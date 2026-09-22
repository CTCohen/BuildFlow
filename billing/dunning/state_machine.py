"""Dunning state machine — Tiers 1-3, deterministic, no LLM calls.

Scope (BUILD_TASKS.md §5 "Dunning state machine (tiers 1-3 automated)"):
    Tier 1 (days 0-7)  — site paused day 0, recovery emails days 1/4/7
    Tier 2 (days 7-30) — Tyler notified once, payment-plan options generated/offered
    Tier 3 (days 30-60) — day 30 final notice, day 40 final take-it-or-leave-it offer

Tier 4 (legal escalation, days 60-90) and Tier 5 (post-day-90 legal action /
collections / write-off) are explicitly OUT OF SCOPE for this task, per
DECISIONS.md item 14 (D35-D37, "manual dunning first, provisional defaults")
and the spec header override in `billing/SPEC-08-payments-billing.md`
("Launch dunning is manual (Tyler) using a deterministic state machine and
templates; LLM personalization comes later."). This machine lands an account
in `TIER4_MANUAL` at day 60 and raises a `TylerNotification` — it does not
generate demand letters, file small claims, or write off debt. See TASKS.md
for the assumptions made where the spec was silent.

Source: `billing/SPEC-08-payments-billing.md` Section 6 (locked) and the
header override block (dunning clock start, email days, grace period —
locked and takes precedence over Section 6 where they differ).
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, timedelta
from enum import Enum

from .mocks import SendGridDunningMock, StripeChargeMock


class DunningError(Exception):
    """Raised on an invalid state transition (e.g. starting delinquency twice)."""


class State(str, Enum):
    ACTIVE = "active"                # current, never delinquent (or fully recovered and quiet)
    TIER1 = "tier1_soft"             # days 0-7: site paused, days 1/4/7 emails
    TIER2 = "tier2_friendly"         # days 7-30: Tyler notified, payment-plan offers
    TIER3 = "tier3_firm"             # days 30-60: day30 final notice, day40 final offer
    TIER4_MANUAL = "tier4_manual"    # day 60+: legal/manual — OUT OF SCOPE, automation stops here
    RECOVERED = "recovered"          # full payment landed, site restored


# --- Locked constants (spec header override, takes precedence over Section 6's day-1/3/7 language) ---
TIER1_EMAIL_DAYS: tuple[int, ...] = (1, 4, 7)
TIER2_START_DAY = 7
TIER3_START_DAY = 30
TIER3_FINAL_OFFER_DAY = 40
TIER4_START_DAY = 60
GRACE_DAYS = 14   # forgiven only on the customer's 1st delinquency episode (Section 6, Repeat Delinquency)

PAYMENT_PLANS: tuple[dict, ...] = (
    {"name": "Conservative", "schedule": "50/50 split"},
    {"name": "Flexible", "schedule": "3 payments over 90 days"},
    {"name": "Seasonal", "schedule": "defer 30 days, then resume normal billing"},
)


@dataclass
class TylerNotification:
    """A manual-attention event this run wants surfaced to Tyler. Never sent automatically —
    the caller (a cron/report step) is responsible for actually notifying him."""
    on: date
    reason: str
    tier: str
    customer_id: str


@dataclass
class DunningAccount:
    """In-memory dunning record for one customer's subscription. Persistence is out of scope
    (no live Supabase project yet, same status as Lane C — see TASKS.md)."""
    customer_id: str
    monthly_amount_cents: int
    delinquency_count: int = 0            # number of PRIOR completed delinquency episodes
    delinquent_since: date | None = None
    state: State = State.ACTIVE
    site_paused: bool = False
    emails_sent_days: set = field(default_factory=set)
    tier2_notified: bool = False
    tier3_final_notice_sent: bool = False
    tier3_final_offer_sent: bool = False
    payment_plan_active: bool = False
    grace_forgiven: bool = False
    log: list = field(default_factory=list)


def start_delinquency(acct: DunningAccount, on: date) -> DunningAccount:
    """Entry point. Call this after the 3rd failed Stripe retry (Section 2's separate
    retry ladder — attempt on renewal day, day 3, day 7 — is a precondition, not part of
    this machine). `on` becomes delinquency day 0."""
    if acct.state not in (State.ACTIVE, State.RECOVERED):
        raise DunningError(f"cannot start delinquency from state {acct.state.value}")
    acct.state = State.TIER1
    acct.delinquent_since = on
    acct.site_paused = True
    acct.emails_sent_days = set()
    acct.tier2_notified = False
    acct.tier3_final_notice_sent = False
    acct.tier3_final_offer_sent = False
    acct.payment_plan_active = False
    acct.grace_forgiven = False
    acct.log.append(f"{on.isoformat()} delinquency start (episode #{acct.delinquency_count + 1}), site paused")
    return acct


def _days_late(acct: DunningAccount, today: date) -> int:
    if acct.delinquent_since is None:
        return 0
    return (today - acct.delinquent_since).days


def advance(
    acct: DunningAccount,
    today: date,
    stripe: StripeChargeMock,
    sendgrid: SendGridDunningMock,
) -> list:
    """Advance the machine to `today`. Deterministic and idempotent — calling it twice for
    the same (account state, today) sends no duplicate emails and raises no duplicate
    notifications. A single call may cascade through several tiers if `today` jumps far
    ahead (e.g. a nightly cron catching up), which is intended: this models a periodic job,
    not a continuously-running one.

    Returns the list of `TylerNotification`s raised during this call (empty if none). The
    caller is responsible for actually delivering them — this function only decides *that*
    Tyler needs telling and *why*.
    """
    if acct.state in (State.ACTIVE, State.RECOVERED, State.TIER4_MANUAL):
        return []
    if acct.delinquent_since is None:
        raise DunningError("advance() called with no delinquency in progress")

    notifications: list[TylerNotification] = []
    days_late = _days_late(acct, today)

    # --- Tier 1: days 0-7, emails on 1/4/7 ---
    if acct.state == State.TIER1:
        for d in TIER1_EMAIL_DAYS:
            if days_late >= d and d not in acct.emails_sent_days:
                sendgrid.send(
                    acct.customer_id, template=f"tier1_day{d}", tier="tier1",
                    on=acct.delinquent_since + timedelta(days=d),
                )
                acct.emails_sent_days.add(d)
                acct.log.append(f"day {d}: tier1 recovery email sent")
        if days_late >= TIER2_START_DAY:
            acct.state = State.TIER2
            acct.log.append(f"day {days_late}: escalated tier1 -> tier2")

    # --- Tier 2: days 7-30, Tyler notified once, payment-plan options offered ---
    if acct.state == State.TIER2:
        if not acct.tier2_notified:
            notifications.append(TylerNotification(
                on=today, tier="tier2", customer_id=acct.customer_id,
                reason="no tier1 response by day 7 — escalate to friendly outreach + payment plan",
            ))
            sendgrid.send(
                acct.customer_id, template="tier2_payment_plans", tier="tier2", on=today,
                plans=PAYMENT_PLANS,
            )
            acct.tier2_notified = True
            acct.log.append(f"day {days_late}: tier2 Tyler notified, payment plans offered")
        if days_late >= TIER3_START_DAY:
            acct.state = State.TIER3
            acct.log.append(f"day {days_late}: escalated tier2 -> tier3")

    # --- Tier 3: days 30-60, day30 final notice, day40 final take-it-or-leave-it offer ---
    if acct.state == State.TIER3:
        if days_late >= TIER3_START_DAY and not acct.tier3_final_notice_sent:
            sendgrid.send(
                acct.customer_id, template="tier3_final_notice", tier="tier3",
                on=acct.delinquent_since + timedelta(days=TIER3_START_DAY), closure_in_days=30,
            )
            notifications.append(TylerNotification(
                on=today, tier="tier3", customer_id=acct.customer_id,
                reason="day 30 final notice sent — account closure in 30 days absent payment",
            ))
            acct.tier3_final_notice_sent = True
            acct.log.append(f"day {days_late}: tier3 final notice sent")
        if days_late >= TIER3_FINAL_OFFER_DAY and not acct.tier3_final_offer_sent:
            sendgrid.send(
                acct.customer_id, template="tier3_final_offer", tier="tier3",
                on=acct.delinquent_since + timedelta(days=TIER3_FINAL_OFFER_DAY), plans=PAYMENT_PLANS,
            )
            acct.tier3_final_offer_sent = True
            acct.log.append(f"day {days_late}: tier3 final take-it-or-leave-it offer sent")
        if days_late >= TIER4_START_DAY:
            acct.state = State.TIER4_MANUAL
            notifications.append(TylerNotification(
                on=today, tier="tier4", customer_id=acct.customer_id,
                reason="day 60 reached — legal-escalation range; manual/Tyler-only from here (out of scope)",
            ))
            acct.log.append(f"day {days_late}: entered tier4_manual, automation stops (out of scope)")

    return notifications


def record_payment(acct: DunningAccount, amount_cents: int, on: date) -> None:
    """A payment lands while an account is mid-lifecycle. Full payment (>= the monthly
    amount) recovers the account and closes this episode. A partial payment re-enables the
    site per Section 6 Tier 2 ("site re-enabled on first partial payment") without closing
    the episode or resetting the tier."""
    if acct.state in (State.ACTIVE, State.RECOVERED):
        raise DunningError(f"cannot record payment in state {acct.state.value}")
    if amount_cents >= acct.monthly_amount_cents:
        is_first_episode = acct.delinquency_count == 0
        acct.grace_forgiven = is_first_episode
        acct.site_paused = False
        acct.state = State.RECOVERED
        acct.delinquency_count += 1
        acct.log.append(f"{on.isoformat()} recovered: full payment {amount_cents}c received")
    else:
        acct.payment_plan_active = True
        acct.site_paused = False
        acct.log.append(f"{on.isoformat()} partial payment {amount_cents}c — site re-enabled, plan active")
