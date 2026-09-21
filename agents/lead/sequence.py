"""Outreach / Copy Agent (#7), deterministic form: templates, hook choice, schedule.

No LLM. Touch number is a parameter (AGENT_REGISTRY s.B). Copy lives in
messaging/outreach_sequence_draft.json and stays a draft until Tyler approves.
"""
from __future__ import annotations

import json
import re
from datetime import date, datetime, time, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

TEMPLATE_PATH = Path(__file__).resolve().parents[2] / "messaging" / "outreach_sequence_draft.json"
STATE_TZ = {"AZ": "America/Phoenix", "CA": "America/Los_Angeles", "TX": "America/Chicago",
            "FL": "America/New_York", "NY": "America/New_York"}
DEFAULT_TZ = "America/New_York"
SERVICE = {"plumbing": "plumbing", "hvac": "HVAC", "electrical": "electrical", "roofing": "roofing"}


def load_templates(path: Path = TEMPLATE_PATH) -> dict:
    return json.loads(Path(path).read_text())


def choose_hook(lead: dict) -> str:
    """Touch-1 hook from signals, first match wins. Pure rules."""
    if lead.get("has_website") is False:
        return "no_website"
    if lead.get("website_quality") == "weak" or (lead.get("pagespeed_score") or 100) < 50:
        return "weak_website"
    if (lead.get("review_count") or 0) >= 50:
        return "reviews_strong"
    if lead.get("has_gbp") is False:
        return "no_gbp"
    return "default"


def merge_fields(lead: dict, demo_url: str, extra: dict) -> dict:
    city, state = lead.get("city"), lead.get("state")
    return {
        "first_name": (lead.get("first_name") or (lead.get("contact_name") or "").split(" ")[0] or "there"),
        "company": lead["company"],
        "service": SERVICE.get((lead.get("vertical") or "").lower(), "home services"),
        "location": ", ".join(x for x in (city, state) if x) or "your area",
        "num_reviews": str(lead["review_count"]) if lead.get("review_count") else "",
        "demo_url": demo_url,
        **extra,
    }


def _fill(text: str, fields: dict) -> str:
    def sub(m):
        v = fields.get(m.group(1))
        if v is None:
            raise KeyError(f"unresolved merge field: {m.group(1)}")
        return v
    return re.sub(r"\{\{(\w+)\}\}", sub, text)


def render_touch(touch: int, lead: dict, demo_url: str, *, sender_name: str, unsubscribe_url: str,
                 postal_address: str, templates: dict | None = None) -> dict:
    t = templates or load_templates()
    if touch not in (1, 2, 3, 4, 5):
        raise ValueError("touch must be 1-5")
    fields = merge_fields(lead, demo_url, {"sender_name": sender_name, "unsubscribe_url": unsubscribe_url,
                                           "postal_address": postal_address})
    hook_key = choose_hook(lead)
    if hook_key == "reviews_strong" and not fields["num_reviews"]:
        hook_key = "default"
    fields["hook"] = _fill(t["hooks"][hook_key], fields)
    tpl = t["touches"][str(touch)]
    return {"touch": touch, "subject": _fill(tpl["subject"], fields),
            "body": _fill(tpl["body"] + t["footer"], fields),
            "hook": hook_key if touch == 1 else None, "angle": tpl["angle"],
            "template_status": t["meta"]["status"]}


def tz_for(state: str | None) -> ZoneInfo:
    return ZoneInfo(STATE_TZ.get((state or "").upper(), DEFAULT_TZ))


def schedule(start: date, state: str | None, templates: dict | None = None) -> list[dict]:
    """Send instants for touches 1-5: day offsets 0/3/7/14/21 at 9 AM local."""
    meta = (templates or load_templates())["meta"]
    tz = tz_for(state)
    out = []
    for i, off in enumerate(meta["sequence_days"], start=1):
        d = start + timedelta(days=off)
        local = datetime.combine(d, time(meta["send_hour_local"]), tzinfo=tz)
        out.append({"touch": i, "local_date": d, "send_at_local": local,
                    "send_at_utc": local.astimezone(timezone.utc)})
    return out
