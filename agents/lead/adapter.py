"""Adapter: Lane C's plain-dict lead/prospect shapes -> platform/CONTRACT.md's admin tables.

Lane C (scoring.py, lookup.py, send.py) was built before `platform/CONTRACT.md` existed (Lane A's
contract, see TASKS.md "Not done / next"). Everything in this lane runs on plain dicts in memory.
Now that the contract is done and Foundation's isolation test is verified, this module is the seam:
pure functions that take those plain dicts (plus a `score_lead()` / `lookup()` result) and return
dicts shaped exactly like CONTRACT.md's `admin.lead_warehouse` / `admin.leads` / `admin.prospects` /
`admin.outbound_campaign_runs` rows.

No I/O and no Supabase client here — Lane A's real service layer (or whoever wires the DB) inserts
these dicts; this lane's job is only to get the shape right. Field names and nullability match
`platform/CONTRACT.md` (as of contract v1.0.0) exactly; if the contract changes, this file changes
with it.

D29 (ruled 2026-09-21): Mid-Market leads are captured in the warehouse and get a `leads` row (so the
capture is visible), but never get a `prospects` row and are never enrolled in outreach —
`send.Campaign.enroll()` already refuses any lead with `lead.get("suppressed")` truthy. This module
enforces the same rule at the DB-shape boundary: `to_prospect_row()` raises if given a suppressed
lead's row, so a caller can't accidentally build the demo/outreach path for one.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone


def _uuid() -> str:
    return str(uuid.uuid4())


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _location(d: dict) -> str | None:
    return ", ".join(x for x in (d.get("city"), d.get("state")) if x) or None


def to_lead_warehouse_row(raw: dict, *, source: str, dedupe_key: str, warehouse_id: str | None = None) -> dict:
    """`raw`: a lookup() `record`, or a hand-entered/photo-intake dict. -> admin.lead_warehouse.

    `source` must be one of the contract's enum values (`google-places`, `apollo`, `hunter`,
    `scraper`, `photo-intake`, `manual`). `dedupe_key` is the caller's normalized phone or domain —
    lookup.py already has the matching logic (`_digits`, `.get("domain")`) to build one.
    """
    now = _now()
    return {
        "id": warehouse_id or _uuid(),
        "source": source,
        "source_ref": raw.get("source_ref"),
        "dedupe_key": dedupe_key,
        "company": raw.get("company"),
        "name": raw.get("contact_name") or raw.get("name"),
        "email": raw.get("email"),
        "phone": raw.get("phone"),
        "vertical": raw.get("vertical"),
        "location": _location(raw),
        "website_url": raw.get("website") or raw.get("website_url"),
        "raw": raw,
        "created_at": now,
        "last_seen_at": now,
    }


def to_lead_row(lead: dict, score_result: dict, *, warehouse_id: str, lead_id: str | None = None) -> dict:
    """`lead`: the plain dict passed to `scoring.score_lead()`. `score_result`: its return value.
    -> admin.leads.

    `status` is `"suppressed"` and `assigned_tier` is null for Mid-Market/suppressed leads (D29:
    captured, not sent). Otherwise `status` starts `"scored"` — `send.py`/whatever marks it
    `"contacted"` moves it forward later.
    """
    now = _now()
    suppressed = bool(score_result.get("suppressed"))
    intent_fields = ("has_website", "has_gbp", "review_count", "review_velocity", "social_active",
                      "pagespeed_score", "website_quality")
    return {
        "id": lead_id or _uuid(),
        "warehouse_id": warehouse_id,
        "name": lead.get("contact_name") or lead.get("first_name"),
        "email": lead.get("email"),
        "phone": lead.get("phone"),
        "company": lead.get("company"),
        "title": lead.get("title"),
        "location": _location(lead),
        "vertical": score_result.get("vertical") or lead.get("vertical"),
        "website_url": lead.get("website") or lead.get("website_url"),
        "intent_signals": {k: lead[k] for k in intent_fields if k in lead},
        "source": lead.get("source", "unknown"),
        "status": "suppressed" if suppressed else "scored",
        "score": score_result.get("score"),
        "assigned_tier": score_result.get("tier"),
        "score_reason": {
            "route": score_result.get("route"),
            "threshold_route": score_result.get("threshold_route"),
            "confidence": score_result.get("confidence"),
            "missing_fields": score_result.get("missing_fields"),
            "reasoning": score_result.get("reasoning"),
        },
        "last_contacted_at": None,
        "created_at": now,
        "updated_at": now,
        "deleted_at": None,
    }


def to_prospect_row(lead_row: dict, *, prospect_id: str | None = None) -> dict:
    """admin.prospects, one per non-suppressed lead about to get a demo.

    D29: raises if `lead_row["status"] == "suppressed"` — a Mid-Market/suppressed lead stops at
    `to_lead_row()`; no demo, no outreach, nothing built for it beyond the warehouse+lead capture.
    """
    if lead_row.get("status") == "suppressed":
        raise ValueError(
            "D29 (ruled 2026-09-21): Mid-Market/suppressed leads are captured in the warehouse and "
            "leads table only — no prospects row, no outreach.")
    now = _now()
    return {
        "id": prospect_id or _uuid(),
        "lead_id": lead_row["id"],
        "demo_generated_at": None,
        "demo_view_count": 0,
        "demo_viewed_at": None,
        "demo_converted_at": None,
        "demo_expiration_date": None,
        "follow_up_count": 0,
        "next_follow_up_date": None,
        "customer_id": None,
        "created_at": now,
        "updated_at": now,
    }


def to_campaign_run_row(prospect_row: dict, lead_row: dict, touch: int, msg: dict, demo_url: str, *,
                        template_variant: str = "A", sendgrid_message_id: str | None = None,
                        run_id: str | None = None) -> dict:
    """admin.outbound_campaign_runs, one row per email touch (unique on lead_id+touch_number).

    `msg` is the dict `send.Campaign._send()` builds (subject/body/to/from/headers/...);
    `sendgrid_message_id` is whatever the real sender's `.send()` returns (mock or real), which
    `send.py` doesn't currently capture — pass it through once it does.
    """
    now = _now()
    return {
        "id": run_id or _uuid(),
        "lead_id": lead_row["id"],
        "prospect_id": prospect_row["id"],
        "touch_number": touch,
        "template_variant": template_variant,
        "status": "sent" if sendgrid_message_id else "queued",
        "subject": msg.get("subject"),
        "sendgrid_message_id": sendgrid_message_id,
        "demo_url": demo_url,
        "utm": msg.get("utm", {}),
        "sent_at": now if sendgrid_message_id else None,
        "opened_at": None,
        "clicked_at": None,
        "replied_at": None,
        "error_message": None,
        "agent_run_id": None,
        "created_at": now,
    }
