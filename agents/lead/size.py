"""Business-size classification from free signals (rules only, no LLM).

Tiers follow docs/PRICING.md: Micro <3 employees, SMB 3-20 (and $250k-$5M),
Mid-Market above that. Order of trust: headcount, revenue, then soft signals.
"""
from __future__ import annotations

MICRO_MAX, SMB_MAX = 2, 20
REVENUE_SMB_MAX = 5_000_000


def _by_headcount(n):
    return "micro" if n <= MICRO_MAX else "smb" if n <= SMB_MAX else "mid_market"


def classify_size(lead: dict) -> dict:
    n = lead.get("headcount")
    if n is not None:
        return {"tier": _by_headcount(n), "basis": "headcount", "confidence": "high", "headcount_estimate": n}

    rev = lead.get("revenue_estimate")
    if rev:
        tier = "mid_market" if rev > REVENUE_SMB_MAX else "smb" if rev >= 250_000 else "micro"
        est = {"micro": 2, "smb": 10, "mid_market": 25}[tier]
        return {"tier": tier, "basis": "revenue", "confidence": "medium", "headcount_estimate": est}

    # Soft signals: strongest evidence of scale wins.
    if lead.get("is_franchise") or (lead.get("location_count") or 1) >= 3 or (lead.get("fleet_size") or 0) >= 15:
        return {"tier": "mid_market", "basis": "multi-location/franchise/fleet", "confidence": "medium",
                "headcount_estimate": 25}
    staff = lead.get("team_page_count")
    if staff:
        return {"tier": _by_headcount(staff), "basis": "team page", "confidence": "medium",
                "headcount_estimate": staff}
    fleet = lead.get("fleet_size")
    if fleet is not None:
        est = max(1, fleet * 2)  # rough: about two people per truck
        return {"tier": _by_headcount(est), "basis": "fleet size", "confidence": "low", "headcount_estimate": est}
    if lead.get("owner_named_business") and not lead.get("has_website"):
        return {"tier": "micro", "basis": "owner-named, no site", "confidence": "low", "headcount_estimate": 1}
    return {"tier": "unknown", "basis": "no size signals", "confidence": "low", "headcount_estimate": None}
