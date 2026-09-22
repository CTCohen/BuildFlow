"""Send and sequence workflow (deterministic) against a mock SendGrid.

Nothing here can send for real: `MockSendGrid` records messages in memory and
`Campaign` refuses any sender that is not marked mock unless the copy is
approved AND the postal address is configured.
"""
from __future__ import annotations

import hashlib
import hmac
from dataclasses import dataclass, field
from datetime import date, datetime, timezone

from .config import get_env
from .sequence import load_templates, render_touch, schedule, tz_for

MAILING_ADDRESS_ENV_VAR = "BUILDFLOW_MAILING_ADDRESS"
MAILING_ADDRESS_LOCAL_FILE = "business-contact.env"

MIN_SAMPLE = 20             # do not judge rates on fewer sends
PAUSE_SPAM_RATE = 0.05      # SPEC-07 s3: pause at 5% marked spam
PAUSE_BOUNCE_RATE = 0.05    # spec target is <5% bounce
ALERT_COMPLAINT_RATE = 0.001


class ConfigError(Exception):
    pass


class MockSendGrid:
    is_mock = True

    def __init__(self):
        self.sent: list[dict] = []

    def send(self, msg: dict) -> str:
        self.sent.append(msg)
        return f"mock-{len(self.sent)}"


def load_mailing_address() -> str | None:
    """CAN-SPAM postal address (Tyler's, gitignored) — real env var first,
    then `.local/business-contact.env`. Returns None if neither has it; never
    reads or returns a git-tracked value."""
    return get_env(MAILING_ADDRESS_ENV_VAR, local_file=MAILING_ADDRESS_LOCAL_FILE)


def unsubscribe_token(secret: str, lead_id: str) -> str:
    """Deterministic: same lead + secret always yields the same token."""
    return hmac.new(secret.encode(), lead_id.encode(), hashlib.sha256).hexdigest()[:32]


@dataclass
class Enrollment:
    lead: dict
    demo_url: str
    start: date
    status: str = "active"   # active | completed | unsubscribed | bounced | complained
    sent: dict = field(default_factory=dict)      # touch -> utc datetime
    opened: set = field(default_factory=set)
    skipped: set = field(default_factory=set)


class Campaign:
    def __init__(self, sender, *, secret: str, postal_address: str | None = None,
                 base_url="https://unsub.fornax.example",
                 sender_name="Tyler", sender_email="hello@fornax.example", max_new_per_day=100, templates=None):
        # sender_email default follows D01 (ruled 2026-09-21): the outbound sender address is
        # hello@<domain>, not a personal address. Domain is a placeholder (.example) — D32 (which
        # domain Fornax actually owns) is still open, matching base_url's existing placeholder.
        #
        # postal_address: pass it explicitly (tests do), or leave it unset and it is read at
        # runtime from BUILDFLOW_MAILING_ADDRESS / .local/business-contact.env (gitignored, never
        # committed — see load_mailing_address()). Either way, _guard() still refuses to run with
        # no address configured.
        self.sender, self.secret = sender, secret
        self.postal = postal_address if postal_address is not None else load_mailing_address()
        self.base_url, self.sender_name, self.sender_email = base_url, sender_name, sender_email
        self.max_new_per_day = max_new_per_day
        self.templates = templates or load_templates()
        self.enrollments: dict[str, Enrollment] = {}
        self.suppressed: dict[str, str] = {}   # email -> reason
        self.paused, self.pause_reason, self.alerts = False, None, []
        self.counts = {"sent": 0, "bounce": 0, "complaint": 0}
        self._new_by_day: dict[date, int] = {}

    # -- guards -----------------------------------------------------------
    def _guard(self):
        if not self.postal:
            raise ConfigError(
                "postal address required (CAN-SPAM): set "
                f"{MAILING_ADDRESS_ENV_VAR} in the environment, or in the gitignored "
                f".local/{MAILING_ADDRESS_LOCAL_FILE}, or pass postal_address= explicitly"
            )
        if not getattr(self.sender, "is_mock", False):
            if self.templates["meta"]["status"] != "approved":
                raise ConfigError("outreach copy not approved by Tyler; real sending is blocked")

    def _url(self, lead_id):
        return f"{self.base_url}/u/{lead_id}/{unsubscribe_token(self.secret, lead_id)}"

    # -- enrollment -------------------------------------------------------
    def enroll(self, lead: dict, demo_url: str, start: date) -> bool:
        email = lead["email"].lower()
        if email in self.suppressed or lead["lead_id"] in self.enrollments:
            return False
        if lead.get("suppressed"):   # Mid-Market waitlist
            return False
        self.enrollments[lead["lead_id"]] = Enrollment(lead, demo_url, start)
        return True

    # -- daily run --------------------------------------------------------
    def run(self, now_utc: datetime) -> dict:
        self._guard()
        report = {"sent": [], "skipped": [], "blocked": None}
        if self.paused:
            report["blocked"] = self.pause_reason
            return report
        for lid, en in self.enrollments.items():
            if en.status != "active":
                continue
            tz = tz_for(en.lead.get("state"))
            today_local = now_utc.astimezone(tz).date()
            sched = schedule(en.start, en.lead.get("state"), self.templates)
            if any(t.astimezone(tz).date() == today_local for t in en.sent.values()):
                continue   # one email per lead per day
            for s in sched:
                n = s["touch"]
                if n in en.sent or n in en.skipped:
                    continue
                if s["send_at_utc"] > now_utc:
                    break
                if n == 2 and 1 in en.opened:      # day-3 re-send only if not opened
                    en.skipped.add(2)
                    report["skipped"].append((lid, 2, "opened"))
                    continue
                if n == 1:
                    if self._new_by_day.get(today_local, 0) >= self.max_new_per_day:
                        break
                    self._new_by_day[today_local] = self._new_by_day.get(today_local, 0) + 1
                self._send(en, n, now_utc)
                report["sent"].append((lid, n))
                break   # one per day
            if all(k in en.sent or k in en.skipped for k in range(1, 6)) and en.status == "active":
                en.status = "completed"   # day 21 done: contacted / no response
            if self.paused:
                report["blocked"] = self.pause_reason
                break
        return report

    def _send(self, en: Enrollment, touch: int, now_utc: datetime):
        lead = en.lead
        url = self._url(lead["lead_id"])
        msg = render_touch(touch, lead, en.demo_url, sender_name=self.sender_name, unsubscribe_url=url,
                           postal_address=self.postal, templates=self.templates)
        msg.update({"to": lead["email"], "from": self.sender_email, "lead_id": lead["lead_id"],
                    "headers": {"List-Unsubscribe": f"<{url}>",
                                "List-Unsubscribe-Post": "List-Unsubscribe=One-Click"}})
        self.sender.send(msg)
        en.sent[touch] = now_utc
        self.counts["sent"] += 1

    # -- events -----------------------------------------------------------
    def handle_event(self, kind: str, lead_id: str):
        en = self.enrollments.get(lead_id)
        if en is None:
            return
        if kind == "open":
            en.opened.add(max(en.sent) if en.sent else 1)
        elif kind == "bounce_hard":
            self._suppress(en, "bounced", "hard bounce")
            self.counts["bounce"] += 1
        elif kind == "spam_complaint":
            self._suppress(en, "complained", "spam complaint")
            self.counts["complaint"] += 1
        self._check_health()

    def unsubscribe(self, lead_id: str, token: str) -> bool:
        """One-click, deterministic, idempotent, works even while paused."""
        if not hmac.compare_digest(token, unsubscribe_token(self.secret, lead_id)):
            return False
        en = self.enrollments.get(lead_id)
        if en:
            self._suppress(en, "unsubscribed", "unsubscribe")
        return True

    def _suppress(self, en, status, reason):
        en.status = status
        self.suppressed[en.lead["email"].lower()] = reason

    def health(self) -> dict:
        s = self.counts["sent"]
        return {"sent": s, "bounce_rate": self.counts["bounce"] / s if s else 0.0,
                "complaint_rate": self.counts["complaint"] / s if s else 0.0}

    def _check_health(self):
        h = self.health()
        if h["sent"] < MIN_SAMPLE:
            return
        if h["complaint_rate"] >= ALERT_COMPLAINT_RATE and "complaint_rate_high" not in self.alerts:
            self.alerts.append("complaint_rate_high")
        if h["complaint_rate"] >= PAUSE_SPAM_RATE:
            self.paused, self.pause_reason = True, "spam complaints >= 5%"
        elif h["bounce_rate"] >= PAUSE_BOUNCE_RATE:
            self.paused, self.pause_reason = True, "bounce rate >= 5%"
