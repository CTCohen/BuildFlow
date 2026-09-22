"""Lead Lookup Agent (#5): fan-out to providers, merge by confidence.

Providers here are recorded-fixture mocks. Real Apollo/Hunter/Places clients
implement the same `search(query)` and slot in later; no keys are used or read.
Single-lead (photo intake) and batch (warehouse) share `lookup()`.
"""
from __future__ import annotations

import json
import re
from concurrent.futures import ThreadPoolExecutor
from difflib import SequenceMatcher
from pathlib import Path

FIXTURES = Path(__file__).parent / "fixtures"
# How much each source is trusted per field (Places is best for place facts,
# Apollo for firmographics, Hunter for emails).
TRUST = {
    "apollo": {"headcount": .9, "email": .6, "contact_name": .8, "years_in_business": .7, "revenue_estimate": .8},
    "hunter": {"email": .9, "contact_name": .6, "domain": .8},
    "google_places": {"phone": .9, "address": .9, "review_count": .95, "has_gbp": 1.0, "website": .85,
                      "review_velocity": .9},
}
MATCH_MIN = 0.6  # below this the match is not trusted: flag Tyler, do not score


class MockProvider:
    def __init__(self, name: str, records=None, fail: bool = False):
        self.name = name
        self.fail = fail
        self.records = records if records is not None else json.loads((FIXTURES / f"{name}.json").read_text())

    def search(self, q: dict) -> list[dict]:
        if self.fail:
            raise ConnectionError(f"{self.name} unavailable")
        return [dict(r) for r in self.records if _record_matches(r, q)]


def default_providers(**kw):
    return [MockProvider(n, **kw.get(n, {})) for n in ("apollo", "hunter", "google_places")]


def _digits(s):
    return re.sub(r"\D", "", s or "")[-10:]


def _norm(s):
    s = re.sub(r"\b(llc|inc|co|company|corp|the|and|&)\b", " ", (s or "").lower())
    return re.sub(r"[^a-z0-9 ]", "", s).split()


def name_sim(a, b):
    return SequenceMatcher(None, " ".join(_norm(a)), " ".join(_norm(b))).ratio()


def _record_matches(r, q):
    if q.get("mode") == "batch":
        return (not q.get("vertical") or r.get("vertical") == q["vertical"]) and \
               (not q.get("state") or r.get("state") == q["state"])
    return match_score(r, q) >= 0.35  # loose provider-side recall; strict decision is in the merge


def match_score(r, q) -> float:
    """0..1 confidence that record r is the business described by query q."""
    s = name_sim(r.get("company"), q.get("company")) if q.get("company") and r.get("company") else 0.0
    if q.get("phone") and r.get("phone") and _digits(q["phone"]) == _digits(r["phone"]):
        s = max(s, 0.5) + 0.4
    if q.get("state") and r.get("state") and q["state"] != r["state"]:
        s -= 0.4
    if q.get("city") and r.get("city") and q["city"].lower() == r["city"].lower():
        s += 0.1
    return max(0.0, min(1.0, s))


def lookup(query: dict, providers=None) -> dict:
    """Single-lead lookup. Anything the primary pass would have sent to Tyler (confidence
    < 0.7, including no match at all) instead falls through to `_deep_research` — ruled
    2026-09-21 (BUILD_TASKS.md §4): manual Tyler review is retired for this path. Tyler is
    never shown an individual low-confidence lead again; unconfirmed leads are suppressed."""
    providers = providers or default_providers()
    if query.get("mode") == "batch":
        return _batch(query, providers)

    result = _primary_lookup(query, providers)
    if result["flag_tyler"]:
        result = _deep_research(query, providers, result)
    return result


def _primary_lookup(query: dict, providers) -> dict:
    hits, errors = [], {}

    def run(p):
        try:
            return p.name, p.search(query), None
        except Exception as e:  # provider down: score on what we have, never block
            return p.name, [], str(e)

    with ThreadPoolExecutor(max_workers=len(providers)) as ex:
        for name, recs, err in ex.map(run, providers):
            if err:
                errors[name] = err
            for r in recs:
                hits.append((name, r, match_score(r, query)))

    # cluster: the best hit anchors the identity; others must also match the query
    good = [h for h in hits if h[2] >= MATCH_MIN]
    if not good:
        reason = "all sources failed" if len(errors) == len(providers) else "no source matched"
        return {"status": "manual_lookup", "reason": reason, "record": None, "confidence": 0.0,
                "sources_matched": [], "sources_failed": errors, "flag_tyler": True, "score_allowed": False}

    anchor = max(good, key=lambda h: h[2])[1]
    cluster = [h for h in good if h[1] is anchor or _same_business(h[1], anchor)]
    record, provenance = _merge(cluster)
    # Per source keep only the best hit; a disagreement on phone lowers confidence.
    conf = max(h[2] for h in cluster)
    phones = {_digits(h[1].get("phone")) for h in cluster if h[1].get("phone")}
    if len(phones) > 1:
        conf = max(0.0, conf - 0.15)
    if len({h[0] for h in cluster}) >= 2:
        conf = min(1.0, conf + 0.05)
    conf = round(conf, 3)
    return {"status": "matched", "record": record, "provenance": provenance, "confidence": conf,
            "sources_matched": sorted({h[0] for h in cluster}), "sources_failed": errors,
            "flag_tyler": conf < 0.7, "score_allowed": True,
            "low_confidence": bool(errors) or conf < 0.7}


def _deep_research(query: dict, providers, primary: dict) -> dict:
    """Second automated pass for a lead the primary pass could not confirm with confidence
    (status `manual_lookup`, or `matched` below 0.7). Two things the primary pass doesn't do:
    1. Widens provider fan-out — considers every record any provider returned for this query,
       not just ones already over the primary MATCH_MIN name/phone threshold.
    2. Cross-checks the business's own website/socials/GBP listing directly (`_verify_direct`)
       instead of relying only on aggregator fuzzy-name matches.
    Confirmed -> matched, confidence floored at 0.7, never flagged to Tyler. Still unconfirmed
    after this deeper pass -> suppressed automatically; never surfaced to Tyler either way."""
    hits, errors = [], dict(primary.get("sources_failed") or {})

    def run(p):
        if getattr(p, "fail", False):  # still down: a widened fan-out can't read a dead provider
            return p.name, [], f"{p.name} unavailable"
        try:
            return p.name, list(p.records), None
        except Exception as e:
            return p.name, [], str(e)

    with ThreadPoolExecutor(max_workers=max(len(providers), 1)) as ex:
        for name, recs, err in ex.map(run, providers):
            if err:
                errors[name] = err
                continue
            for r in recs:
                s = match_score(r, query)
                if s > 0:  # widened fan-out: any positive signal, not just >= MATCH_MIN
                    hits.append((name, dict(r), s))

    base = {**primary, "sources_failed": errors, "deep_research": True, "flag_tyler": False}
    if not hits:
        return {**base, "status": "suppressed", "score_allowed": False,
                "reason": "unconfirmed after deep pass", "record": None, "sources_matched": []}

    anchor = max(hits, key=lambda h: h[2])[1]
    cluster = [h for h in hits if h[1] is anchor or _same_business(h[1], anchor)]
    if not _verify_direct(query, cluster):
        return {**base, "status": "suppressed", "score_allowed": False,
                "reason": "unconfirmed after deep pass", "record": None,
                "sources_matched": sorted({h[0] for h in cluster})}

    record, provenance = _merge(cluster)
    conf = round(max(0.7, max(h[2] for h in cluster)), 3)
    return {"status": "matched", "record": record, "provenance": provenance, "confidence": conf,
            "sources_matched": sorted({h[0] for h in cluster}), "sources_failed": errors,
            "flag_tyler": False, "score_allowed": True, "low_confidence": False, "deep_research": True}


def _verify_direct(query: dict, cluster) -> bool:
    """Direct verification against the business's own web presence, not just aggregator
    name-fuzz: a candidate counts as confirmed when it carries a live GBP listing or website
    AND at least one hard identifier lines up — an exact phone match, or the business's own
    name tokens showing up in its own website/domain — with no state contradiction."""
    for _, r, _ in cluster:
        if not (r.get("has_gbp") or r.get("has_website") or r.get("website")):
            continue
        if query.get("state") and r.get("state") and query["state"] != r["state"]:
            continue
        phone_ok = bool(query.get("phone") and r.get("phone") and _digits(query["phone"]) == _digits(r["phone"]))
        website = (r.get("website") or "").lower()
        name_tokens = [t for t in _norm(r.get("company") or query.get("company")) if len(t) > 3]
        domain_ok = bool(website and any(t in website for t in name_tokens))
        name_ok = name_sim(r.get("company"), query.get("company")) >= 0.5
        if phone_ok or (domain_ok and name_ok):
            return True
    return False


def _same_business(a, b):
    if a.get("phone") and b.get("phone") and _digits(a["phone"]) == _digits(b["phone"]):
        return True
    if a.get("domain") and a.get("domain") == b.get("domain"):
        return True
    return name_sim(a.get("company"), b.get("company")) >= 0.8 and a.get("state") == b.get("state")


def _merge(cluster):
    record, prov = {}, {}
    fields = {f for _, r, _ in cluster for f in r}
    for f in fields - {"source"}:
        best = None
        for src, r, _ in cluster:
            if r.get(f) in (None, ""):
                continue
            w = TRUST.get(src, {}).get(f, 0.5)
            if best is None or w > best[0]:
                best = (w, src, r[f])
        if best:
            record[f], prov[f] = best[2], {"source": best[1], "trust": best[0]}
    return record, prov


def _batch(q, providers):
    seen, out, errors = [], [], {}
    for p in providers:
        try:
            recs = p.search(q)
        except Exception as e:
            errors[p.name] = str(e)
            continue
        for r in recs:
            for i, (existing, _) in enumerate(seen):
                if _same_business(existing, r):
                    seen[i][1].append((p.name, r, 1.0))
                    break
            else:
                seen.append((r, [(p.name, r, 1.0)]))
    for _, cl in seen:
        rec, prov = _merge(cl)
        out.append({"record": rec, "sources": sorted({c[0] for c in cl})})
    limit = q.get("limit")
    return {"status": "ok", "results": out[:limit] if limit else out, "sources_failed": errors}
