---
title: Testing
purpose: Documentation for testing.md
status: draft
owner: c.t.cohen
updated: '2026-09-18'
tier_scope: all
phase: operational
---

# Testing strategy: Fornax

> Rebuilt 2026-09-18 from System 04 (QA), the agent registry (Section D) and the launch plan (Steps 3.4, 4.6-4.8, 8). Three layers.

## Layer 1: Template quality (run when the shared design system changes)
Component and unit tests; responsive checks; axe/Lighthouse accessibility; Playwright visual regression per profile; form validation, submit and error states.

## Layer 2: Per-site QA gate (`npm run qa -- --client <slug>`), before any demo or live site ships
Hard-fail blocks the site. Thresholds follow the spec; the workspace's earlier stricter numbers stay as design targets.
| # | Check | Fail condition |
|---|---|---|
| 1 | Build | Does not compile |
| 2 | Placeholder leakage | `lorem`, `TODO`, `{{`, `[business name]`, `example.com`, unfilled tokens |
| 3 | Required content | Schema validation: name, phone, service area, at least the minimum services, hours, a CTA |
| 4 | Links | Broken internal link |
| 5 | Forms | Headless submit does not reach the test inbox |
| 6 | Accessibility and performance | **Demo:** Lighthouse below 80 or accessibility below 90 or any axe must-fix. **Live:** below 90. Core Web Vitals within budget (LCP under 2.5 s, CLS under 0.1) |
| 7 | Layout sanity (Playwright, mobile and desktop) | Horizontal scroll, zero-height section, broken image, overlap |
| 8 | LLM rubric (credibility, copy specificity, polish, completeness) | Any dimension at or below 3 flags for a human; run on about 5% of demos plus all flagged ones |
| 9 | Language | Launch is English-only; the Spanish parity check runs only when a site opts into Spanish |
Retry policy: the Design Agent re-renders with the failure reasons up to 2 times; the third failure escalates to Tyler. Every rejection reason is logged; a monthly job reports the top 3 failure modes back into the Design Agent prompt.
Manual review: escalations and a sample; the first ~10 sites are also scored by Tyler with the same rubric until the gate's PASS/FLAG matches his judgment.

## Layer 3: Agent evals (before any agent counts as done)
15-20 hand-built cases per agent (obvious, edge, failure), rerun on every change and nightly, recorded in `metrics/eval/`. Tool-call correctness, recovery quality, cost per success and human override rate are tracked per the registry. Full 50-case suites are Phase 2.

## End to end (launch step 8)
Full funnel dry run (monthly and annual checkout), dunning tiers 1-3, WCAG sample, data-isolation test (customer A cannot see customer B), auth flow, load smoke test, monitoring populated by real events, then a soft-launch cohort.

## Still to define
Agent-handoff correctness logging, speed instrumentation (start to built, start to closed), discovery quality metric, sandbox mode for the full pipeline on a real candidate.
