"""Field mapping: `admin.leads` / `admin.prospects` (platform/CONTRACT.md) -> HubSpot
contact/deal properties.

Source schema is the Foundation lane's already-merged contract, not guessed:
- `admin.leads`: id, warehouse_id, name, email, phone, company, title, location, vertical,
  website_url, intent_signals jsonb, source, status, score int 0-100, assigned_tier,
  score_reason jsonb, last_contacted_at, created_at, updated_at, deleted_at.
- `admin.prospects`: id, lead_id FK unique, demo_generated_at, demo_view_count,
  demo_viewed_at, demo_converted_at, demo_expiration_date, follow_up_count,
  next_follow_up_date, customer_id, created_at, updated_at.

HubSpot side is a plain property dict — this module never calls the network, it only
shapes data. The actual push happens in `sync.py` via the mocked client.
"""
from __future__ import annotations

# admin.leads.status -> HubSpot contact lifecycle stage (standard HubSpot values)
LEAD_STATUS_TO_HS_LIFECYCLE = {
    "new": "lead",
    "scored": "lead",
    "contacted": "salesqualifiedlead",
    "qualified": "salesqualifiedlead",
    "converted": "customer",
    "rejected": "other",
    "suppressed": "other",
}

# admin.leads.status -> HubSpot deal stage (standard-ish pipeline stage names; a real
# HubSpot app would use the account's actual pipeline/stage IDs, fetched once and cached —
# out of scope until the app exists, see TYLER_QUEUE.md)
LEAD_STATUS_TO_HS_DEALSTAGE = {
    "new": "appointmentscheduled",
    "scored": "qualifiedtobuy",
    "contacted": "qualifiedtobuy",
    "qualified": "decisionmakerboughtin",
    "converted": "closedwon",
    "rejected": "closedlost",
    "suppressed": "closedlost",
}

# assigned_tier -> list price in cents, used only as the deal's initial amount estimate.
# Prices per BuildFlow/CLAUDE.md's offer table (Micro/SMB/Mid-Market monthly). Mid-Market is
# paused per DECISIONS.md #4 but still mapped here in case a lead is scored into it.
TIER_TO_MONTHLY_CENTS = {
    "micro": 14900,
    "smb": 24900,
    "mid-market": 39900,
}


def _split_name(full_name: str | None) -> tuple[str, str]:
    """Best-effort first/last name split. HubSpot contacts want two fields; our lead only
    has one. Single-word names go entirely to firstname (matches HubSpot's own UI default
    when importing a single "name" column)."""
    if not full_name:
        return "", ""
    parts = full_name.strip().split(None, 1)
    if len(parts) == 1:
        return parts[0], ""
    return parts[0], parts[1]


def lead_to_hubspot_contact(lead: dict) -> dict:
    """Map one `admin.leads` row to a HubSpot contact `properties` dict.

    Required fields: `email` (HubSpot's own contact de-dupe key) — a lead with no email
    cannot be pushed as a contact and the caller should skip/flag it (see `sync.py`).
    """
    if not lead.get("email"):
        raise ValueError(f"lead {lead.get('id')!r} has no email — cannot map to a HubSpot contact")

    firstname, lastname = _split_name(lead.get("name"))
    status = lead.get("status", "new")

    props = {
        "email": lead["email"],
        "firstname": firstname,
        "lastname": lastname,
        "phone": lead.get("phone") or "",
        "company": lead.get("company") or "",
        "jobtitle": lead.get("title") or "",
        "website": lead.get("website_url") or "",
        "hs_lead_status": status.upper(),
        "lifecyclestage": LEAD_STATUS_TO_HS_LIFECYCLE.get(status, "lead"),
        # custom properties a real HubSpot app would need created first (private app schema
        # setup — flagged in TYLER_QUEUE.md)
        "fornax_lead_id": str(lead["id"]),
        "fornax_lead_score": lead.get("score"),
        "fornax_vertical": lead.get("vertical") or "",
        "fornax_source": lead.get("source") or "",
    }
    return {k: v for k, v in props.items() if v is not None}


def lead_prospect_to_hubspot_deal(lead: dict, prospect: dict | None) -> dict:
    """Map a lead (+ optional matching `admin.prospects` row) to a HubSpot deal
    `properties` dict. A lead with no prospect row yet (demo not generated) still gets a
    deal — early pipeline visibility — just without demo-stage detail.
    """
    status = lead.get("status", "new")
    tier = (lead.get("assigned_tier") or "").lower()
    amount_cents = TIER_TO_MONTHLY_CENTS.get(tier)

    company = lead.get("company") or lead.get("name") or f"lead-{lead.get('id')}"
    props = {
        "dealname": f"{company} — Fornax {tier or 'unscored'}".strip(),
        "dealstage": LEAD_STATUS_TO_HS_DEALSTAGE.get(status, "appointmentscheduled"),
        "amount": (amount_cents / 100) if amount_cents else None,
        "pipeline": "default",
        "fornax_lead_id": str(lead["id"]),
        "fornax_assigned_tier": tier or None,
    }
    if prospect:
        props["fornax_demo_generated_at"] = prospect.get("demo_generated_at")
        props["fornax_demo_view_count"] = prospect.get("demo_view_count")
        props["fornax_demo_converted_at"] = prospect.get("demo_converted_at")
    return {k: v for k, v in props.items() if v is not None}
