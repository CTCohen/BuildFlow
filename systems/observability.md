---
title: Observability System
purpose: Authoritative spec and build checklist for infrastructure health checks, business metrics, and alerting. Absorbs systems/13-observability-system.md from the original 19-system export.
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Observability System

Tracks system health, business metrics, and operational alerts across Fornax's infrastructure — a homegrown,
cron-based monitoring layer (not LLM agents), described in the original spec as four coordinated jobs: Health
Check, Business Metrics, Alert Dispatcher, Dashboard Renderer. A first slice of this — the alert dedupe/
escalate/resolve mechanism and its DB schema — is built and merged as part of the Foundation lane; the full
four-job architecture, thresholds, and admin dashboard rendering are not.

**Code lives at:** `platform/monitoring/` (alert dispatcher), `platform/db/migrations/0004_monitoring.sql`
(schema), `platform/hosting/cost-alert.mjs` (one concrete alert built on top of the same pattern).

## Built and verified
- [x] Alert dispatcher core: `admin.raise_alert` / `admin.resolve_alert` — dedupe, escalate, resolve logic —
  `platform/monitoring/monitor.mjs`, schema in `platform/db/migrations/0004_monitoring.sql` (107 lines).
  **Test evidence, re-run live today:** `node --test platform/monitoring/monitor.test.mjs` → 10/10 tests pass,
  0 failures. Part of the Foundation lane, merged (`operations/BUILD_TASKS.md` line 19: "Migrations, RLS
  policies, service skeleton, monitoring script — done, commit `2dd5a19`"; line 21: RLS isolation + monitoring
  tests confirmed run and passing by Tyler on his Mac 2026-09-21).
- [x] One concrete alert consumer built on the dispatcher: per-customer hosting cost alert (>$50) —
  `platform/hosting/cost-alert.mjs` + `platform/db/migrations/0006_hosting_cost_alert.sql`. Deterministic, no
  LLM, reuses `admin.raise_alert`/`admin.resolve_alert` from the monitoring migration. Per
  `operations/BUILD_TASKS.md` this needs Tyler's Mac or CI to actually execute the DB-backed portion (same gate
  as the isolation test); the alert module's own 3 JS-level tests are unconfirmed in this pass — not claimed as
  independently verified here.

## Specified, not yet built
- [ ] Health Check Job — infra endpoint pings (buildflowsites.com, DNS, Cloud Run, DB) every 1-5 min, 3-failed
  = down. Not built; no infra to check against yet (no live site/hosting account per hosting.md).
- [ ] Business Metrics Job — hourly SQL queries for demos_generated_24h, demo_qa_pass_rate,
  form_submissions_24h, new_customers_today, crm_sync_failures_24h, mrr_current, churn_signals_7d, each with
  its own warning/critical threshold from the original spec's locked table. Not built.
- [ ] Dashboard Renderer Job — admin dashboard infra-status/business-metrics/CRM-sync-status panel, Redis-cached
  every 5 min. Not built; depends on Admin Dashboard system.
- [ ] Notification channel wiring: SMS (Twilio) + Slack + email, CRITICAL/WARNING/INFO routing tiers. Not built
  — no Twilio/Slack account provisioned per `operations/TYLER_QUEUE.md`.
- [ ] `health_check_log` and `business_metrics_log` tables and their retention windows (30d / 90d) — not
  present; only the `alerts`-adjacent schema in `0004_monitoring.sql` is built.
- [ ] Anomaly detection and runbook automation (Phase 2, 50-customer scale per original spec) — not started.

## Possible future specs (not built, not committed to)
- Full four-job cron architecture as originally scoped (Cloud Run + Cloud Scheduler), once real infrastructure
  (Cloudflare hosting, Stripe, CRM sync) exists to actually monitor.
- Operational dials (Lead Qualification Minimum, Demo QA Floor, Generation Rate throttle, Dunning Retry Count,
  Daily Lead Acquisition Target, Delinquency Grace Period) as live admin-dashboard sliders — currently only
  described in the original spec text, not wired to any control surface.

## Open questions
- The original spec scopes this as "Tier 3 (Scale) — shipped after MVP launch," but the alert-dispatcher
  primitive was actually built early (inside the Foundation lane) because hosting-cost alerting needed it now.
  Worth deciding whether to formally re-tier this system as "partially Tier 1" rather than leave the Tier 3
  label on a system with real merged code.
- No monitoring target exists yet to point the Health Check Job at (no live hosting account, no production
  Stripe/CRM connections) — this system's remaining scope is gated on those other systems going live, not on
  its own remaining engineering.
