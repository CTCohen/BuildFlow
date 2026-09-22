---
title: Platform Tasks
purpose: Remaining platform work after Lane A's foundation, in order
status: active
owner: c.t.cohen
updated: '2026-09-20'
version: 1.0.0
tier_scope: all
phase: phase_1
related: [platform/CONTRACT.md, operations/lanes/LANE-A-foundation.md]
---

# Platform tasks (after the foundation)

## Blocked on Tyler
- [ ] Create the Supabase project and apply migrations (`AUTH-SETUP.md`); re-run the isolation test there.
- [ ] Decide: add the `pg` npm dependency (needed for `/ready` DB check and the monitoring runner's real DB adapter). Free, standard driver; it needs npm registry access.
- [ ] Create Railway project and deploy `platform/service` (Dockerfile ready).
- [ ] Twilio, Slack webhook, SendGrid keys for real alert delivery (senders are mocks today).

## Foundation follow-ups
- [ ] Run `platform/db/run-local.sh` on a machine where Postgres can start and record the output (see STATUS-foundation.md; the sandbox blocked it).
- [ ] Docker build of `platform/service` and a run of the container (daemon was not running).
- [ ] Real `pg` adapter for `monitor.mjs` and a scheduler entry point (Railway cron / Cloud Scheduler) for health checks every 5 min and dispatcher every minute.
- [ ] Business Metrics Job (post-launch, System 13): fill `business_metrics_log`, alerts at the locked thresholds.
- [ ] Encryption helper for `crm_integrations.auth_token_encrypted` (AES-256-GCM, key from the secret store); key rotation procedure.
- [ ] Backend authorization layer: verify JWT, resolve `admin.admins` + `aal2`, choose role per request; log every admin read of customer data (System 11 §4).
- [ ] Event processor: retry backoff 1s/5s/30s/5min, DLQ after 3 (`admin.events`).
- [ ] Retention jobs: cancelled customers 90 days, unconverted leads 12 months, `crm_sync_log` 90 days, `crm_conflict_log` 30 days (`prune_monitoring` covers monitoring tables only).
- [ ] Migration runner that records versions in `app.schema_migrations`.
- [ ] Tables the contract defers: support tickets, photo intake, agent feedback, experiments (Systems 12, 14-18); add when their lanes start.
- [ ] Customer data export (JSON, 24 h link) and deletion on request (45 days), System 11.
- [ ] Customer edit path: decide which customer writes go through RLS-scoped policies vs. the backend (today all writes are backend-only).
- [ ] Redis is skipped at launch (D12); dashboard cache is a Postgres query for now.
