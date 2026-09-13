---
title: Testing
purpose: Documentation for testing.md
status: draft
owner: c.t.cohen
updated: '2026-09-12'
tier_scope: all
phase: operational
---

# Testing strategy — BuildFlow

Two layers. The template is tested thoroughly but rarely; every client site passes an
automated gate before it leaves the pipeline.

---

## Layer 1 — Template quality (run when the shared Astro app/theme changes)

Not per client. Standard CI on the one codebase:

- Component / unit tests
- Responsive: mobile + tablet + desktop breakpoints
- Accessibility: axe / Lighthouse a11y ≥ 95
- Lighthouse: performance ≥ 90, SEO ≥ 95
- Playwright visual regression against baseline screenshots for each theme
- Form components: validation, submit, error states

---

## Layer 2 — Per-client QA gate  ·  `npm run qa -- --client <slug>`

Runs after a site is generated, before outreach/handoff. Outputs a pass/fail report.
Any hard-fail blocks the site.

| # | Check | Fail condition |
|---|-------|----------------|
| 1 | Build | Does not compile clean |
| 2 | Placeholder leakage | Output contains `lorem`, `TODO`, `{{`, `[business name]`, `example.com`, or unfilled tokens |
| 3 | Required content | Schema validation of `content/<slug>/`: business name, valid phone, service area, ≥N services, hours, ≥1 CTA/page |
| 4 | Links | Any broken internal link; external links unresolved |
| 5 | Forms | Headless submit of contact + quote form does not reach the test inbox |
| 6 | Bilingual | ES key set ≠ EN key set; any ES field still equals its EN value; English-only phrases detected in ES pages |
| 7 | Lighthouse budget | perf < 90, a11y < 95, or SEO < 95 |
| 8 | Layout sanity (Playwright, mobile + desktop) | Horizontal scroll, zero-height section, broken image, overlapping elements |
| 9 | LLM rubric review | Claude scores rendered pages/screenshots on credibility, copy specificity, visual polish, completeness (1–5 each); any dimension below threshold → flag for human |

### The rubric (check 9) — keep fixed

> Rate 1–5, with one sentence of justification each:
> - **Credibility** — would a real customer trust this is an established local business?
> - **Copy specificity** — is the writing about *this* business, or generic filler?
> - **Visual polish** — spacing, hierarchy, imagery, consistency.
> - **Completeness** — every section populated, nothing stub-like.
> Then: overall PASS / FLAG, and the single biggest issue.

Threshold to start: FLAG if any dimension ≤ 3. Tune after calibration.

### Calibration

For the first ~10 sites, Chase also reviews by hand using the *same rubric*. Record both
scores. Adjust automated thresholds until the gate's PASS/FLAG matches Chase's judgment.
After that, trust the gate and spot-check.

---

## Still to define

- Agent-handoff correctness (discovery → outreach → human → onboarding), traceable + logged
- Speed instrumentation: start→built, start→closed
- Discovery quality metric (share of candidates a human agrees are a real fit)
- Auth + onboarding scripted walkthrough
- E2E: full pipeline run on a real candidate in a sandbox mode
