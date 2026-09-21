"""Run all lead-lane evals: `python3 -m agents.lead.run_evals`. Exit 1 on any failure."""
from __future__ import annotations

import json
import sys
import unittest
from pathlib import Path

from .lookup import MockProvider, default_providers, lookup
from .scoring import score_lead
from .size import classify_size

EVALS = Path(__file__).parent / "evals"


def _load(name):
    return json.loads((EVALS / f"{name}.json").read_text())


def _check_scoring(c):
    r = score_lead(c["lead"])
    return [f"{k}: got {r.get(k)!r}, want {v!r}" for k, v in c["expect"].items() if r.get(k) != v]


def _check_size(c):
    r = classify_size(c["lead"])
    return [f"{k}: got {r.get(k)!r}, want {v!r}" for k, v in c["expect"].items() if r.get(k) != v]


def _check_lookup(c):
    e, errs = c["expect"], []
    ps = default_providers()
    ps = [MockProvider(p.name, fail=True) if p.name in c["fail"] else p for p in ps]
    r = lookup(c["query"], ps)
    if c["query"].get("mode") == "batch":
        n = len(r["results"])
        if n < e.get("batch_min", 0) or n > e.get("batch_max", 10**6):
            errs.append(f"batch size {n}")
        if e.get("batch_sources_min") and not all(len(x["sources"]) >= e["batch_sources_min"] for x in r["results"]):
            errs.append("batch not merged across sources")
        if set(e.get("failed", [])) - set(r["sources_failed"]):
            errs.append("failed provider not reported")
        return errs
    for k in ("status", "flag_tyler", "score_allowed", "low_confidence", "reason"):
        if k in e and r.get(k) != e[k]:
            errs.append(f"{k}: got {r.get(k)!r}, want {e[k]!r}")
    if "min_conf" in e and r["confidence"] < e["min_conf"]:
        errs.append(f"confidence {r['confidence']}")
    if "sources" in e and r["sources_matched"] != e["sources"]:
        errs.append(f"sources {r['sources_matched']}")
    if "failed" in e and sorted(r["sources_failed"]) != sorted(e["failed"]):
        errs.append(f"failed {list(r['sources_failed'])}")
    for f, v in e.get("fields", {}).items():
        if (r["record"] or {}).get(f) != v:
            errs.append(f"field {f}: got {(r['record'] or {}).get(f)!r}, want {v!r}")
    for f, src in e.get("provenance", {}).items():
        if (r.get("provenance") or {}).get(f, {}).get("source") != src:
            errs.append(f"provenance {f}: want {src}")
    return errs


def main() -> int:
    failed = total = 0
    for suite, fn in (("scoring", _check_scoring), ("size", _check_size), ("lookup", _check_lookup)):
        cases = _load(suite)
        bad = 0
        for c in cases:
            errs = fn(c)
            total += 1
            if errs:
                bad += 1
                print(f"FAIL {suite}/{c['id']} {c['desc']}: {'; '.join(errs)}")
        failed += bad
        print(f"{suite}: {len(cases) - bad}/{len(cases)} passed")
    from .evals import test_outreach_send
    res = unittest.TextTestRunner(verbosity=0).run(unittest.defaultTestLoader.loadTestsFromModule(test_outreach_send))
    total += res.testsRun
    failed += len(res.failures) + len(res.errors)
    print(f"outreach+send: {res.testsRun - len(res.failures) - len(res.errors)}/{res.testsRun} passed")
    print(f"TOTAL {total - failed}/{total}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
