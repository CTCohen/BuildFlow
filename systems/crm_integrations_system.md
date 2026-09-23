---
title: CRM & External Integrations System
purpose: Authoritative spec and build checklist for CRM sync (Fornax's own outbound pipeline into HubSpot, plus the customer-facing external-CRM connector vision). Absorbs systems/09-crm-integration-system.md and systems/10-external-integrations-system.md from the original 19-system export.
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# CRM & External Integrations System

Two distinct things live under this one file, per the original export: **System 09** (a *customer's* leads
syncing outward to *their own* external CRM — ServiceTitan, Jobber, HousecallPro, HubSpot, Successware, via
per-customer OAuth) and **System 10** ("external integrations," which on reading its actual content is the
same customer-facing multi-CRM sync capability, not a separate integrations surface — it lists the same top-10
CRM roadmap, the same push/pull data flow, and the same MCP-connector pattern as System 09, just described from
the "top 10 trades CRMs" angle). What's actually been built so far is neither of these customer-facing things:
it's **Fornax's own internal lead pipeline pushing one-way into Fornax's own HubSpot account**, for the
business's own sales tracking. That distinction matters — see "Built and verified" below.

**Code lives at:** `crm/hubspot/` (built connector), `crm/SPEC-09-crm-integration.md` and
`crm/SPEC-10-external-integrations.md` (original spec text, still present), `crm/TASKS.md` (scope note and
assumptions for this lane).

## Built and verified
- [x] Internal one-way push connector: Fornax's own `admin.leads`/`admin.prospects` (per `platform/CONTRACT.md`,
  Foundation lane) → Fornax's own HubSpot contact/deal records, 5-minute batch cadence — `crm/hubspot/mapping.py`
  (field/status/dealstage mapping, tier→list-price mapping) + `crm/hubspot/sync.py` (batching + retry state
  machine) + `crm/hubspot/mocks.py` (in-memory mock HubSpot client — no real HubSpot account exists yet).
- [x] Retry/pause policy, verified against both original specs (System 09's override block and System 10's
  Section 7, confirmed identical numbers in both): exponential backoff 1s/5s/30s/5min, max 5 attempts, Tyler
  notified after 3 consecutive failures, sync auto-paused after 5 — `crm/hubspot/sync.py`
  (`RETRY_DELAYS_SECONDS`, `NOTIFY_AFTER_FAILURES`, `PAUSE_AFTER_FAILURES`).
- [x] Test evidence, re-run live today: **`python3 -m crm.run_evals` → 18/18 tests pass** (`OK`, 0 failures).
  Verified 2026-09-22 by running the suite directly, not taken on faith. Covers `crm/evals/test_mapping.py` and
  `crm/evals/test_sync.py`, including `TestEndToEndTestLead` (transient failure then success, field mapping +
  contact/deal IDs verified end to end on mocks).
- [x] Scope boundary documented in-repo (`crm/TASKS.md`): this build satisfies System 09/10's retry-policy spec
  but is explicitly *not* the customer-facing OAuth connector — the field mapping here is specific to Fornax's
  own `admin.leads` shape, not a customer's `app.form_submissions`.

## Specified, not yet built
- [ ] Real HubSpot developer/private app for the internal connector above — blocked on credentials
  (`operations/TYLER_QUEUE.md` §2 still lists this as not created); connector is proven on mocks only.
- [ ] Customer-facing external-CRM connector (the actual System 09/10 capability): per-customer OAuth flow,
  "Add CRM" dashboard UI, choice of sync depth, top-10 trades CRM support (ServiceTitan, Jobber, Housecall Pro,
  HubSpot, Successware as Phase 1 PRIMARY; Spike, FieldEdge, Knowify, Zoho, Pipedrive as SECONDARY) — none of
  this exists in code. Needs Track H (customer dashboard) and an OAuth flow to exist first.
- [ ] Bidirectional sync / pull path (System 09 Section 3, System 10 Section 3: CRM status/notes/outcome
  flowing back into Fornax) — Phase 2 per both original specs, not started.
- [ ] Conflict resolution engine (System 09 Section 6: CRM-wins-by-default reconciliation logic, 4-signal
  decision tree, `crm_conflict_log`) — spec is fully worked out, no implementation.
- [ ] Customer-facing sync status dashboard (connection status, last sync, success rate, manual retry) —
  unbuilt; would live in Track H dashboards.
- [ ] Per-CRM MCP connectors beyond HubSpot (ServiceTitan, Jobber, Housecall Pro, Successware, and the
  Phase 1.5/2 set) — none built.

## Possible future specs (not built, not committed to)
- Custom field-mapping UI and Zapier integration (System 10 Phase 2 roadmap)
- Conditional/score-based sync and webhook support (System 09 Phase 3)
- Phase 2 CRM expansion: Monday.com, Asana, Notion, Airtable, Salesforce, Acuity Scheduling

## Open questions
- The original specs describe a customer-facing multi-CRM product feature; what's built today is an internal
  sales-ops tool. Both are legitimately "CRM integration" but they're different systems with different owners
  (customer dashboard team vs. internal ops) — worth deciding whether this file should eventually split into
  two once the customer-facing connector work actually starts, rather than growing one file to cover both.
- System 09 and System 10 were two separate files in the original 19-system export with near-identical content
  (same CRM list, same retry numbers, same MCP pattern, described from two angles). Confirmed via direct read
  that neither adds material not covered by the other — kept merged into this one file rather than resurrected
  as two, consistent with the granularity rule in `systems.md`.
