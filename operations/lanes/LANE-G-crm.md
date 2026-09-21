---
title: Lane G CRM
purpose: Brief for the session that builds the HubSpot connector
status: active
owner: c.t.cohen
updated: '2026-09-20'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Lane G: CRM (`crm/`)

**Starts when:** Track A's contract exists; Tyler has a HubSpot developer or private app (sandbox).
**Read first:** `crm/SPEC-09-crm-integration.md`, `crm/SPEC-10-external-integrations.md`, `docs/CRM_MCP_INTEGRATION_ROADMAP.md`, `platform/CONTRACT.md`, `operations/lanes/README.md`.

## Tasks
1. **HubSpot connector:** OAuth, encrypted token storage interface, create-lead, field mapping (name, email, phone, message, time).
2. **Sync mechanism:** 5-minute batch, group by customer, retries 1 s/5 s/30 s/5 min (max 5), notify Tyler after 3 failures, pause at 5, alert if down over 2 hours; log to `crm_sync_log`. No LLM.
3. **Customer sync-status data** for the dashboard (connection, last sync, count, success rate).
4. Connector interface the other four CRMs (Jobber, ServiceTitan, Housecall Pro, Successware) will follow; research their API detail and write it back into the spec (launch plan 2.7).
5. Evals and `crm/TASKS.md`.

**Done means:** a test lead lands in a HubSpot sandbox through the batch job; the failure and retry paths are demonstrated. **Needs from Tyler:** HubSpot sandbox app; Jobber and ServiceTitan applications submitted.
