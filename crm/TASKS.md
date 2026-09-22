---
title: CRM Lane Tasks
purpose: Status, run instructions, assumptions and open questions for Track G (HubSpot push connector)
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.0.0
tier_scope: all
phase: phase_1
related: [operations/BUILD_TASKS.md, crm/SPEC-09-crm-integration.md, crm/SPEC-10-external-integrations.md, DECISIONS.md, platform/CONTRACT.md]
---

# Track G (CRM) tasks

Run everything: `python3 -m crm.run_evals` (stdlib only, no keys, no network, no LLM).

| # | Task | Status | Where |
|---|---|---|---|
| 1 | Field mapping, `admin.leads`/`admin.prospects` -> HubSpot contact/deal properties | Done | `crm/hubspot/mapping.py` |
| 2 | Mock HubSpot client (no real account exists) | Done | `crm/hubspot/mocks.py` |
| 3 | One-way push connector, 5-minute batch cadence, retry ladder | Done | `crm/hubspot/sync.py` |
| 4 | Retry logic verified against spec (not a secondhand summary) | Done — matches `crm/SPEC-09-crm-integration.md` override block AND `crm/SPEC-10-external-integrations.md` line 89: 1s/5s/30s/5min, max 5 attempts, Tyler notified after 3 failures, sync paused after 5 | `crm/hubspot/sync.py` (`RETRY_DELAYS_SECONDS`, `NOTIFY_AFTER_FAILURES`, `PAUSE_AFTER_FAILURES`) |
| 5 | Evals (all pass) | Done: 18/18 | `crm/evals/test_mapping.py`, `crm/evals/test_sync.py`, run via `crm/run_evals.py` |
| 6 | Test lead end-to-end (mocked): transient failure then success, field mapping + retry proven | Done | `crm/evals/test_sync.py::TestEndToEndTestLead` |
| 7 | Real HubSpot developer/private app, live sandbox push | **Blocked** — needs the HubSpot app (TYLER_QUEUE.md §2) | — |
| 8 | Customer-facing two-way sync, conflict resolver (SPEC-09 Section 6) | Out of scope — Phase 2 per spec, and separate from this lane's scope (internal Fornax->HubSpot CRM, not the customer multi-tenant connector) | `crm/SPEC-09-crm-integration.md` Section 6 |

## Scope

This lane builds the connector for BUILD_TASKS.md §6 ("One-way push connector, 5-minute
batch, retries" — Fornax's own lead pipeline into Fornax's HubSpot instance for sales
tracking), sourced from `platform/CONTRACT.md`'s `admin.leads`/`admin.prospects` shapes
(Foundation lane, already merged). This is distinct from `crm/SPEC-09-crm-integration.md`'s
customer-facing feature (a *customer's* leads syncing to *their own* external CRM via
per-customer OAuth) — that one shares the same retry-policy numbers (confirmed identical
in both specs) but is unbuilt, gated on the customer-facing dashboard (Track H) and OAuth
flow existing first. Only crm/ was touched; platform/, billing/, agents/lead/ were read for
schema reference only, never edited.

## What's real vs. mocked

- **Real:** field mapping logic (name split, status->lifecycle/dealstage, tier->amount),
  batching (only leads whose retry delay has elapsed get attempted per cycle), the full
  retry state machine (attempts, backoff schedule, notify-at-3, pause-at-5, manual reset).
- **Mocked:** the actual HubSpot API call (`crm/hubspot/mocks.py::MockHubSpotClient` — an
  in-memory recorder with scriptable success/failure outcomes, no network, no credential).
  No real HubSpot account exists yet (confirmed: TYLER_QUEUE.md §2 still lists "HubSpot
  developer/private app" as not created).

## Assumptions made where the spec was silent

1. **Source is Fornax's own outbound lead pipeline, not the customer-facing connector.**
   The task instructions pointed at `platform/CONTRACT.md`'s lead/prospect shapes as the
   source schema, which are `admin.leads`/`admin.prospects` (our sales funnel), not
   `app.form_submissions` (a customer's website form leads, which is what SPEC-09's
   customer-facing OAuth connector actually syncs). Both use the same retry policy, so the
   retry-logic build satisfies both; the field mapping here is specific to our own lead
   shape and would need a second, customer-facing mapping module later for SPEC-09 proper.
2. **HubSpot pipeline/stage/property names are placeholders.** `mapping.py`'s
   `LEAD_STATUS_TO_HS_DEALSTAGE` uses HubSpot's generic default pipeline stage IDs
   (`appointmentscheduled`, `qualifiedtobuy`, etc.) and invents custom contact/deal
   properties (`fornax_lead_id`, `fornax_lead_score`, ...). A real HubSpot private app
   needs those custom properties created in HubSpot's own schema UI before they can be
   set via the API — flagged below for Tyler.
3. **"Sync paused" is per-lead, not global.** SPEC-10's "5 -> sync paused, customer
   alerted" describes a per-customer sync in the two-way feature; applied here, pausing
   means that one lead stops auto-retrying (marked `PAUSED`, `reset_paused()` needed) —
   it does not stop the whole batch job from processing other leads. This seemed the
   safer reading (one bad lead shouldn't block everyone else's sync) but flag if Tyler
   wants a global circuit breaker instead.
