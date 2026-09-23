---
title: Business Operations & Financials System
purpose: Authoritative spec and build checklist for unit economics, budget guardrails, hiring gates, and revenue tracking — plus the open decision on a bookkeeping/accounting tool. Absorbs systems/01-business-operations-system.md from the original 19-system export.
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Business Operations & Financials System

Locks down pricing/margin economics, the $50/mo budget constraint, hiring triggers, and the in-app revenue
dashboard that shows business health (MRR/ARR/churn) at a glance. This system does **not** cover bookkeeping,
tax prep, or expense tracking — that's a separate, still-open decision, addressed directly below because Tyler
asked for it tonight ("we need a free financials and accounting system for how we will keep track of business
finances"). **The two are not the same thing:** the revenue dashboard (built, in-app) shows MRR/ARR/churn for
business-health monitoring; an accounting tool (not chosen yet, external) handles the actual books — categorized
expenses, invoices, tax-ready records. Both matter; conflating them would leave the business with health metrics
but no real books.

**Code lives at:** `platform/dashboards/lib/admin-dashboard.mjs` (`buildRevenueDashboard`, `buildAlertsView`,
customer health scoring).

## Built and verified
- [x] Revenue dashboard: MRR, ARR, active customer count, churn rate %, ARPU, and a Micro/SMB breakdown (Mid-
  Market excluded per spec override — tier paused) — `buildRevenueDashboard()` in
  `platform/dashboards/lib/admin-dashboard.mjs` (lines 88-109), built from `app.subscriptions` rows per SPEC-18
  Section 3. **Test evidence, re-run live today:** `node --test platform/dashboards/admin-dashboard.test.mjs` →
  11/11 tests pass, 0 failures — covers revenue math, alert-view grouping, and customer health scoring in the
  same file.
- [x] Alerts view for the admin dashboard (severity-grouped, resolved alerts dropped) — same file, same test
  run, also covered by the 11/11 above.
- [x] Pricing structure and annual-billing math (10x monthly, ~16.7% "2 months free" discount, non-refundable/
  non-prorated cancellation) — matches `docs/PRICING.md` and the offer table in `BuildFlow/CLAUDE.md`; not a
  new build, cross-checked as consistent with what's in this system's original spec.

## Specified, not yet built
- [ ] $50/mo budget tracking and the monthly-review ritual (1st Friday, 30 min: burn-down forecast, cost-saving
  triggers, hiring readiness) — no tooling exists; currently a manual process per the spec, nothing to build
  until Tyler wants it automated.
- [ ] Hiring-trigger dashboard (10/50/100/500-customer thresholds, contribution-margin-at-each-stage display) —
  spec is fully worked out (see below) but not wired to any live view; would sit on top of the same
  `buildRevenueDashboard` data once there are real customers.
- [ ] Break-even / burn-down forecasting — no live financial model exists yet; the original spec's numbers are
  projections, not computed from real data (no customers yet).
- [ ] **Bookkeeping / accounting system** — genuinely unbuilt and, per this task, not a code decision at all.
  See "Open questions" below for the real options.

## Possible future specs (not built, not committed to)
- Automated $50/mo spend-cap enforcement (hard block vs. alert-only) once real vendor bills exist to track
  against.
- Multi-year (Year 1/2/3) revenue projections — the original spec explicitly flags this as missing; only 6-12
  month scenarios exist.
- Explicit CAC/LTV target numbers as a tracked metric, not just an implied model assumption.

## Open questions

**1. Free/cheap bookkeeping tool for a pre-revenue-to-early-revenue solo operator — Tyler's call, not made here.**
This is a real external-tool decision, distinct from the in-app revenue dashboard above. Three options worth
knowing about (based on general knowledge of the small-business accounting tool landscape, not live research —
confirm current pricing/features before committing):

| Tool | One-line tradeoff |
|---|---|
| **Wave Accounting** | Free core bookkeeping/invoicing for a single user, well-known fit for solo/small operators; paid add-ons for payroll and payment processing, and Wave has been scaling back some free features over time — worth checking current scope before relying on it long-term. |
| **QuickBooks Simple Start** | The industry-standard choice, easiest to hand to an accountant or bookkeeper later (near-universal compatibility at tax time), but it's paid from day one (~$25-35/mo range) — not free, so it eats into the $50/mo constraint immediately. |
| **Spreadsheet (manual) + a business bank account's built-in categorization** | Zero cost, full control, appropriate for genuinely pre-revenue with near-zero transaction volume; stops scaling the moment transaction volume or tax complexity grows, and has no audit trail or accountant-friendly export. |

Tyler should pick based on: current transaction volume (near-zero pre-revenue favors the spreadsheet route),
whether he plans to hand this to an accountant at tax time (favors QuickBooks), and whether Wave's current free
tier still covers what he needs (confirm live, tool pricing/features change).

**2. Approval thresholds for spend** (carried over from the original spec's own open items, never decided):
self-approve under what dollar amount, escalate above what amount? No number has ever been set.

**3. Tool sunset policy** — no criteria exist for cutting a paid tool that's grown too expensive relative to the
$50/mo constraint.
