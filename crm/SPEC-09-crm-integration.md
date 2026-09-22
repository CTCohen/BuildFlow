---
title: System 09 — CRM Integration System
purpose: Customer external CRM connection via Fornax MCPs—supported platforms, sync depth, authentication, onboarding
status: active
owner: c.t.cohen
updated: '2026-09-18'
version: 1.0.0
tier_scope: all
phase: phase_1
spec_name: 09-crm-integration-system
spec_aliases:
- CRM sync
- integrations
- crm connectors
- external CRM export
spec_sources:
- chat
spec_authority: authoritative (exported from claude.ai project memory 2026-09-17)
---

> **Overrides (Tyler, 2026-09-18).** This spec is authoritative except where Tyler ruled otherwise (`RECONCILIATION_LOG.md`, `DECISIONS.md`):
> - Launch with one CRM: HubSpot first. Jobber, ServiceTitan, Housecall Pro and Successware follow.
> - One-way push, 5-minute batch, retries 1 s/5 s/30 s/5 min (max 5), Tyler notified after 3 failures, sync paused at 5. Status pull and the conflict resolver wait for two-way sync.
> - Micro has no CRM connector at launch.


# System 09 — CRM Integration System

## Purpose

Lock down how customers connect their own external CRM (ServiceTitan, Jobber, HubSpot, etc.) so leads captured in Fornax's lightweight dashboard automatically sync to their existing CRM system via our built MCPs.

## Contents

- Supported CRMs and integration architecture (5 CRMs, custom MCPs)
- Sync depth, direction, and field mapping
- Authentication flow (OAuth) and customer onboarding
- Error handling and customer support workflow
- CRM roadmap (Phase 1-3 expansion)

## Specifications

### SECTION 1: Supported CRMs & Integration Architecture — LOCKED

- **ServiceTitan:** OAuth 2.0, 200 req/min — market leader HVAC/Plumbing/Electrical
- **Jobber:** OAuth 2.0, 100 req/min — popular small trades
- **Housecall Pro:** API key, 50 req/min — field service various trades
- **HubSpot:** OAuth 2.0/API key, 500 req/min — general SMB CRM
- **Successware:** OAuth 2.0, 100 req/min — trades-specific, growing

**Rationale:** these five cover 70%+ of trades market in Phase 1 verticals. Custom MCPs per CRM (Fornax builds/maintains, not middleware). Customer owns their CRM credentials (Fornax stores encrypted auth tokens only).

---

## SECTION 2: Sync Depth & Data Flow — LOCKED

**Direction: One-way, Fornax dashboard → customer's external CRM** (Phase 1)

**Data synced:** name, email, phone, message, submission timestamp — within 5 minutes (batch sync every 5 min)

**Field mapping:** customer configures during onboarding; standard pairs (name → first_name+last_name, email→email, phone→phone, message→notes)

**Sync failure handling:** API error → retry exponential backoff (1s/5s/30s/5min); auth error → refresh OAuth token retry; field validation error → log + alert customer; partial failure → retry failed only, don't block batch

---

## SECTION 3: Authentication & Customer Onboarding — LOCKED

**OAuth flow:** Dashboard → Integrations → choose CRM → OAuth redirect → customer authorizes → Fornax receives token, stores encrypted, sync begins → success message

**Token security:** AES-256 encrypted, separate secrets manager, only sync agents can decrypt, auto-refresh before expiration, immediate revocation on disconnect

**Onboarding checklist:** choose CRM → connect (OAuth ~30 sec) → review default field mapping → test sync (generate test lead, verify appears in their CRM) → activate

**Sync status dashboard (customer-facing):** connection status, last sync time, total leads synced, success rate, error alerts, manual retry/reconnect

---

## SECTION 4: Error Handling & Customer Support — LOCKED

**Transient errors** (auto-retry, exponential backoff 1s/5s/30s/5min, max 5 attempts): API slow/down, rate limit, temp token refresh

**Persistent errors** (customer action required, no infinite retry): field mapping mismatch, revoked token, invalid data format

**Escalation:** sync down >2 hours → email customer + notify Tyler; same error across multiple customers → escalate as platform bug

---

## SECTION 5: CRM Roadmap & Future Integrations

**Phase 1 (MVP):** one-way sync, 5 CRMs, <5 min latency, >99% success target

**Phase 2:** two-way sync (pull existing leads), additional CRMs (Pipedrive, Zendesk, Salesforce), custom field mapping, bulk import

**Phase 3:** conditional sync (score-based), custom transformations, webhook support, advanced multi-field mapping

---

## SECTION 5B: Sync Mechanism (Cost & Architecture) — LOCKED

**Infrastructure:** Cloud Scheduler cron every 5 min → Cloud Function reads submissions since last sync → groups by customer → decrypts auth token → pushes via CRM API → logs result → retries with backoff (max 5 attempts) → stores in `crm_sync_log`

**Cost:** ~$0.20/million Cloud Function invocations; worst case (1,000 customers) ~$1.70/month — negligible, no LLM involved (pure data movement)

---

## SECTION 6: CRM Conflict Resolution — LOCKED

**Policy: CRM Wins by Default, Agent Reconciliation.** Customer's CRM is system of record; Fornax never unconditionally overwrites customer work.

**Reconciliation logic (4 signals):** CRM edit recency (highest weight), data completeness, field type match, customer CRM activity level

**Decision tree:**
- CRM edit <24h old + field complete → CRM WINS
- CRM edit >7d old + Fornax data higher quality → Fornax WINS
- Custom/auxiliary field conflict → CRM ALWAYS WINS
- Confidence <60% → FLAG TO TYLER
- Default → CRM WINS

**Logging:** every conflict + resolution logged (timestamp, field, old/new value, reason, confidence) in `crm_conflict_log`, 30-day retention, weekly audit report

**Success metrics:** reconciliation accuracy >95%, manual escalations <5% of conflicts

---

## SECTION 7: Agent Cross-Reference

**CRM Sync Agent (Agent Registry #8)** executes both the push mechanism (Section 5B, deterministic/cheap-tier, no LLM) and the conflict-reconciliation logic (Section 6, Medium-tier evaluator step) — an Evaluator-Optimizer pattern layered on an otherwise pure pipeline.

**Shared implementation:** SAME agent referenced by System 10 (customer-facing data flow spec) and surfaced in System 18 (Tyler's sync-health dashboard).

Full agent detail: `agents/AGENT_REGISTRY.md`
