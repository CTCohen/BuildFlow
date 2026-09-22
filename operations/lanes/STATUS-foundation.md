---
title: Lane A Status
purpose: Handoff for the Foundation lane (platform/)
status: active
owner: c.t.cohen
updated: '2026-09-20'
version: 1.0.0
tier_scope: all
phase: phase_1
related: [operations/lanes/LANE-A-foundation.md, platform/CONTRACT.md]
---

# Lane A status

## Done
- `platform/CONTRACT.md` v1.0.0, committed first. Two schemas (`app` customer-visible with RLS on `customer_id`; `admin` closed to customers), which resolves the PaymentTransaction contradiction.
- SQL migrations `platform/db/migrations/0001-0004` (schemas/roles, tables, RLS and column grants, monitoring functions).
- SQL tests `platform/db/tests/10_isolation.sql` (two fake customers, about 30 checks) and `20_monitoring.sql`, plus `platform/db/run-local.sh`.
- Container skeleton `platform/service/` (Dockerfile, zero-dependency server, `/health` and `/ready`); 6 handler tests pass.
- Monitoring runner `platform/monitoring/monitor.mjs` (health probes, dispatcher, mock senders); 10 tests pass.
- `platform/AUTH-SETUP.md`, `platform/TASKS.md`.

## NOT verified (blocked by this session's sandbox)
- **The migrations and SQL tests have never been run.** The sandbox blocks Postgres's shared-memory call, so a local server cannot start here. "Migrations apply cleanly" and "isolation proven" are therefore **unproven**. The SQL is written and reviewed by eye only.
- The container was **not built** (Docker/Colima daemon is not running). The server logic is tested through its handler; a real socket was also blocked.

## Needs Tyler
1. Run `platform/db/run-local.sh` in your own terminal (it starts a throwaway Postgres in a temp dir, applies the migrations, runs the tests, and stops). Paste the output back. Expect fixes on the first run.
2. Approve the `pg` npm dependency (see TASKS.md).
3. Later: Supabase project, Railway, alert-channel keys.
An already-running Postgres listens on localhost:5432; this lane did not touch it.

## Other lanes
Code against `platform/CONTRACT.md`. Lane B: the client JSON section mirrors `schema.mjs`; tell Lane A when its shape changes.
