---
title: Lane A Foundation
purpose: Brief for the session that builds the database, auth and server skeleton, and the shared data contract
status: active
owner: c.t.cohen
updated: '2026-09-19'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Lane A: Foundation (`platform/`)

**Goal:** the data and identity layer every other lane depends on.
**Read first:** `platform/SPEC-02-platform-architecture.md` (schema, events), `platform/SPEC-03-hosting-infrastructure.md`, `legal/SPEC-11-compliance-security.md` (auth, isolation), `platform/SPEC-13-observability.md` (pre-launch subset), `operations/lanes/README.md`, `RECONCILIATION_LOG.md` D10-D13, D39.

## Tasks, in order
1. **`platform/CONTRACT.md` first (day 1).** One document with every entity and field: Lead, Prospect, Demo, Customer, Website, FormSubmission, Review, CRMIntegration, Subscription (with `launch_cohort`), AgentRun (with tokens and dollars), LeadWarehouse, OutboundCampaignRun, crm_sync_log, crm_conflict_log, health and alert logs. Include the client JSON that the design engine renders (`app/src/data/schema.mjs` is the current version). Fix the spec's PaymentTransaction / `customer_id` contradiction (admin tables in a separate schema and role). Commit it as soon as it exists so other lanes can use it.
2. **SQL migrations** for Supabase Postgres from the contract.
3. **Row-level security:** every customer table isolated by `customer_id`; admin tables locked to Tyler's role.
4. **Auth configuration:** Google and email/password (12+ characters); admin Google login with 2FA. Document the setup; do not create the real project (Tyler does).
5. **Container skeleton:** Dockerfile and a minimal service with a health endpoint that runs on Railway now and Cloud Run later.
6. **Pre-launch monitoring subset:** health check job and alert dispatcher, tested against a local database.
7. Write `platform/TASKS.md` for the remaining platform work.

## Done means
Migrations apply cleanly to a local Postgres; an isolation test with two fake customers proves customer A cannot read customer B (show the output); the container builds and the health endpoint answers; `CONTRACT.md` is committed.
**Needs from Tyler:** nothing to start (uses a local database). A real Supabase project comes later.
**Out of scope:** dashboards UI, billing, CRM, agents.
