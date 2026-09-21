"""Lead Scoring Agent (#4): deterministic 100-point model from SPEC-07 Section 2.

One model for outbound (System 7) and photo intake (System 18). No LLM.
Missing data scores 0 for that signal and lowers `confidence`; it never blocks.
"""
from __future__ import annotations

from collections import defaultdict

from .size import classify_size

VERTICALS = {"plumbing", "hvac", "electrical", "roofing"}
VERTICAL_ALIASES = {"plumber": "plumbing", "heating": "hvac", "air conditioning": "hvac",
                    "electrician": "electrical", "roofer": "roofing"}
TEST_MARKETS = {"AZ", "CA", "TX", "FL", "NY"}
SIZE_RANGE = (1, 50)        # SPEC-07 s1 company size
ICP_HEADCOUNT = (1, 20)     # Micro + SMB tiers (docs/PRICING.md); >20 is Mid-Market
HIGH_REVIEW_VELOCITY = 2.0  # new reviews per month
KEY_FIELDS = ("vertical", "state", "headcount", "years_in_business", "review_count")

ROUTES = ((70, "outreach_now"), (50, "secondary"), (20, "backlog"), (0, "deprioritize"))


def normalize_vertical(v):
    v = (v or "").strip().lower()
    return VERTICAL_ALIASES.get(v, v)


def route_for(score: int) -> str:
    return next(r for floor, r in ROUTES if score >= floor)


def score_lead(lead: dict) -> dict:
    size = classify_size(lead)
    headcount = lead.get("headcount")
    if headcount is None:
        headcount = size["headcount_estimate"]
    vertical = normalize_vertical(lead.get("vertical"))
    state = (lead.get("state") or "").strip().upper()
    years = lead.get("years_in_business")
    reviews = lead.get("review_count")

    a = {"vertical_match": 20 if vertical in VERTICALS else 0,
         "location": 10 if state in TEST_MARKETS else 0,
         "company_size": 10 if headcount is not None and SIZE_RANGE[0] <= headcount <= SIZE_RANGE[1] else 0}
    b = {"headcount_aligns": 10 if headcount is not None and ICP_HEADCOUNT[0] <= headcount <= ICP_HEADCOUNT[1] else 0,
         "years_2_plus": 8 if years is not None and years >= 2 else 0,
         "has_reviews": 10 if reviews and reviews > 0 else 0,
         "revenue_or_social": 7 if lead.get("revenue_estimate") or lead.get("has_social") else 0}
    c = {"has_gbp": 8 if lead.get("has_gbp") else 0,
         "has_website": 8 if lead.get("has_website") else 0,
         "active_social": 6 if lead.get("social_active") else 0,
         "review_velocity": 3 if (lead.get("review_velocity") or 0) >= HIGH_REVIEW_VELOCITY else 0}

    total = sum(a.values()) + sum(b.values()) + sum(c.values())
    missing = [f for f in KEY_FIELDS
               if lead.get(f) in (None, "") and not (f == "headcount" and headcount is not None)]
    tier = size["tier"]
    suppressed = tier == "mid_market"
    return {
        "score": total,
        "breakdown": {"vertical_location_size": sum(a.values()), "fit": sum(b.values()),
                      "engagement": sum(c.values()), "detail": {**a, **b, **c}},
        "route": "suppress_waitlist" if suppressed else route_for(total),
        "threshold_route": route_for(total),
        "tier": None if suppressed else ("smb" if tier == "unknown" else tier),
        "tier_provisional": tier == "unknown",
        "suppressed": suppressed,
        "confidence": "low" if len(missing) >= 3 else "medium" if missing else "high",
        "missing_fields": missing,
        "icp_match_pct": round(total),
        "vertical": vertical,
        "tyler_gate": lead.get("source") == "photo_intake" and 50 <= total <= 69 and not suppressed,
        "reasoning": _reason(a, b, c, total, size),
    }


def _reason(a, b, c, total, size):
    got = [k for d in (a, b, c) for k, v in d.items() if v]
    lost = [k for d in (a, b, c) for k, v in d.items() if not v]
    return (f"{total}/100. Scored: {', '.join(got) or 'none'}. Not scored: {', '.join(lost) or 'none'}. "
            f"Size basis: {size['basis']} ({size['tier']}).")


def calibration_by_vertical(outcomes: list[dict]) -> dict:
    """outcomes: [{vertical, score, converted}]. Conversion rate per band, per vertical.

    The number that matters: is a 70+ converting more than a 50-69 (SPEC agent #4)?
    """
    bands = (("70-100", 70, 100), ("50-69", 50, 69), ("20-49", 20, 49), ("0-19", 0, 19))
    tally = defaultdict(lambda: {b[0]: [0, 0] for b in bands})
    for o in outcomes:
        v = normalize_vertical(o["vertical"])
        for name, lo, hi in bands:
            if lo <= o["score"] <= hi:
                tally[v][name][0] += 1
                tally[v][name][1] += 1 if o["converted"] else 0
    out = {}
    for v, t in tally.items():
        rates = {n: {"n": n_, "converted": c, "rate": round(c / n_, 3) if n_ else None}
                 for n, (n_, c) in t.items()}
        hi, mid = rates["70-100"]["rate"], rates["50-69"]["rate"]
        out[v] = {"bands": rates,
                  "calibrated": None if hi is None or mid is None else hi > mid}
    return out
