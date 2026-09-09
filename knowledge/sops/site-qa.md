---
id: site-qa
type: sop
status: active
last_reviewed: 2026-09-08
applies_to: [build]
links: [[build-a-site]] [[web-design]] [[anti-ai-slop-copy]] [[local-seo]] [[ai-seo]]
---

# SOP — site QA (per client)

Run after `sops/build-a-site` step 8. Any hard-fail blocks the site.

## Automated — `npm run qa -- --client <slug>`
1. Build compiles clean.
2. Placeholder + anti-ai-slop grep — 0 hits.
3. Required content — title/meta/H1 per page; hero `tel:`; NAP consistent; service-area strings rendered.
4. Internal links — no broken links; graph connected; every page ≤ 2 clicks from home.
5. Form submit — headless submit reaches the test inbox.
6. EN/ES parity — key sets match; no untranslated ES.
7. Lighthouse — perf ≥ 90, a11y ≥ 95, LCP/CLS/TBT within [[performance-baseline]].
8. Layout sanity (Playwright mobile+desktop) — no h-scroll, overlap, or broken images.
9. Schema — `HVACBusiness` sitewide, `FAQPage` on `/` + `/services/*`, validates.
10. AI visibility — `/llms.txt` present + complete; direct-answer-first; entities consistent.

## LLM rubric (1–5 each; FLAG if any ≤ 3)
credibility · copy specificity · visual polish · completeness → overall PASS/FLAG + biggest issue.

## Human (calibration, first 25 sites; then spot-check)
Same rubric + side-by-side vs the business's current site and a top local competitor.
Verdict: "clearly better than current, competitive with the best."

## Output
Write the report + scores to `knowledge/test-logs/round-NN.md`. Systemic misses → KB edit.

## Check
- QA exits 0. Rubric ≥ 4/5 all dimensions. Human: accept.
