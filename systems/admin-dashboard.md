---
title: Admin Dashboard System
purpose: Authoritative spec and build checklist for Tyler's admin command center — CRM view, outbound pacing/scripts, data analytics, financials. Superseded/absorbed from platform/SPEC-18-admin-crm-operations.md (System 18).
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Admin Dashboard System

Tyler's own operations view: pipeline/CRM funnel, customer health, revenue, and alerts, built as a web admin
panel (the iOS photo-intake app is explicitly Phase 1.5, out of scope per the spec's own override). Code:
`platform/dashboards/lib/admin-dashboard.mjs`, built and tested 2026-09-22 as part of Track H.

## Built and verified
- [x] Pipeline funnel + stuck-deal detection — `platform/dashboards/lib/admin-dashboard.mjs`'s
  `buildPipelineFunnel()` and `findStuckDeals()`. Funnel stages: Identified → Outreach Sent → Demo Viewed →
  Demo Conversion → Customer (Trial Active stage removed per the 2026-09-18 spec override — no free trial).
  Stuck-deal rule: 14+ days since demo with no conversion and no recent follow-up. Part of the 26/26
  `platform/dashboards/*.test.mjs` suite from Track H (`operations/BUILD_TASKS.md` §7).
- [x] Customer record view — `buildCustomerRecord()`, joins `app.customers` + `admin.customer_admin` +
  `app.subscriptions` by customer_id into the SPEC-18 Section 1 field set (company, tier, status, renewal date,
  LTV, phone, payment status, notes).
- [x] Health score — `computeHealthScore()`, the exact SPEC-18 Section 4 weighting (Engagement 40% / Payment
  30% / Retention Signals 20% / Growth 10%), banded 80+ healthy / 60-79 at-risk / <60 churning. This is the
  canonical formula System 12 (customer lifecycle) reuses per that spec's Section 6.
- [x] Revenue dashboard (financials) — `buildRevenueDashboard()`: MRR, ARR, active customer count, churn rate,
  ARPU, breakdown by tier (Micro/SMB only — Mid-Market excluded per spec override, trial-conversion metric
  dropped per the no-free-trial override).
- [x] Alerts view — `buildAlertsView()`, groups open/acknowledged `admin.alerts` rows by severity
  (critical/warning/info) for the dashboard's alert card, per SPEC-18 Section 6.

**Test evidence:** 26/26 `node --test platform/dashboards/*.test.mjs`, run live 2026-09-22
(`operations/BUILD_TASKS.md` §7). **Not wired to a live database** — no Supabase service-role key yet (gate G3
per `operations/COORDINATOR_STATE.md`) — this is a tested view-model logic layer only, fixtures shaped to
`platform/CONTRACT.md`, no rendered UI.

## Specified, not yet built
- [ ] CRM view beyond the pipeline funnel and customer record — e.g. bulk CRM export (spec: "bulk CRM export"
  is a Web Admin-only feature) — not found in `admin-dashboard.mjs`
- [ ] Ability to change outbound pacing or outreach scripts from the admin dashboard — read `admin-dashboard.mjs`
  in full; it has no function touching `agents/lead/`'s send pacing, templates, or schedule. This capability
  does not exist in code.
- [ ] Config screens for thresholds/weights/dunning timings (spec: "configuration (thresholds/weights/dunning
  timings)" is Web Admin-only) — not found
- [ ] Google OAuth + 2FA admin login (spec: "Tyler's admin login is Google OAuth plus 2FA" per the 2026-09-18
  override) — not found; auth generally blocked on a real Google OAuth client
  (`operations/BUILD_TASKS.md` §1: "[ ] Real Google OAuth client [credential: Google Cloud OAuth client]")
- [ ] Onboarding queue, invoice disputes/refunds screens (spec Section 8, Web Admin-only items) — not found
- [ ] Photo intake subsystem (OCR → lookup → scoring → auto-action) — explicitly Phase 1.5 per the spec's own
  override, correctly out of scope for this pass; not built
- [ ] Agent QA & feedback loop dashboard card ("Agent Insights," top-3-recommendations-per-day) — not found
- [ ] Operational alerts delivery beyond the in-dashboard alerts view — iOS push + email delivery channels
  (spec Section 6) not found; only the read-side grouping exists
- [ ] Rendered UI — everything above that IS built is a tested logic layer with fixtures, not a shipped screen

## Possible future specs (not built, not committed to)
- iOS photo-intake app (Phase 1.5, deferred by design)
- Cohort/retention/CAC detailed reporting (spec lists as Web-Admin-only "detailed reporting")

## Open questions
- Whether outbound pacing/script control should live in the admin dashboard at all, or stay a direct edit to
  `agents/lead/` config files/templates — the spec (System 18) doesn't explicitly scope this capability by
  name; the task description asked to check for it and it is confirmed absent from the built code.
