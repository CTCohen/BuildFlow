---
title: System 02 — Platform Architecture System
purpose: Master schema, data flows, agent execution engine, orchestration, and system integration
status: active
owner: c.t.cohen
updated: '2026-09-18'
version: 1.0.0
tier_scope: all
phase: phase_1
spec_name: Platform Architecture System
spec_aliases:
- database schema
- data model
- agents
- orchestration
- data flows
spec_sources:
- chat
spec_authority: authoritative (exported from claude.ai project memory 2026-09-17)
---

# System 02 — Platform Architecture System

## Purpose

Define the foundational technical architecture—schema, data flows, and agent orchestration—that all other systems depend on. This system specifies what data is captured, how it flows between services, how agents execute and coordinate, and how state is managed across the entire platform—ensuring consistency, scalability, and auditability from lead to customer lifecycle.

## Contents

- Entity definitions and full schema
- Data dictionary with types, validation, constraints
- Primary/foreign keys, indexes, enums
- Soft delete and retention strategy
- Multi-tenancy isolation model
- API payload examples
- Agent types and responsibilities
- Execution model and scheduling
- Trigger events per agent
- Error handling and retry logic
- Logging and monitoring
- Dependency chain between agents
- State management and idempotency
- Data flows between systems
- Event schemas
- Failure recovery

## Specifications

## CRITICAL PRINCIPLE: Two-Dashboard Architecture

Fornax has TWO distinct dashboards with different purposes, data access, and users:

**Customer Dashboard** ([domain TBD under Fornax name]/dashboard) — Beautiful product UI for customers
- Users: customers only
- Purpose: Manage their website, view analytics, configure CRM integration
- Data visibility: Website, FormSubmission (their leads), CRMIntegration (their config), Subscription (billing summary only), Reviews
- UX: Clean, minimal, intuitive
- Security: Row-level security by customer_id (database enforces it)

**Admin Dashboard** ([domain TBD under Fornax name]) — Dense ops tool for Tyler only
- Users: Tyler only
- Purpose: Monitor business health, debug agents, track revenue, manage escalations
- Data visibility: All customers' data + AgentRun logs + PaymentTransaction + LeadWarehouse + OutboundCampaignRun + support tickets
- UX: Data-dense, alerts-focused, queryable
- Security: Tyler-only access; no customer visibility

**Schema Implication:** Schema tables belong to ONE dashboard or the other (or both, with different access levels). Customer-facing tables (Website, FormSubmission, CRMIntegration) are filtered by `customer_id` in queries. Admin-only tables (AgentRun, PaymentTransaction) have NO customer_id field — they're global ops data.

---

## SECTION 1: Data Model & Schema

**Contents to lock down:**
- Entity catalog with full schema:
  - **Lead:** id, name, email, phone, company, title, location, business_size, vertical, website_url, intent_signals, source, created_at, updated_at, last_contacted_at, status (new/contacted/qualified/converted/rejected)
  - **Prospect:** id, lead_id, demo_generated_at, demo_view_count, demo_viewed_at, demo_converted_at, demo_expiration_date, follow_up_count, next_follow_up_date
  - **Demo:** id, prospect_id, design_template_used, cloudflare_url, cloudflare_deployment_id, created_at, expires_at, archived_at, view_count, conversion_flag, core_web_vitals_score
  - **Customer:** id, name, email, domain, tranche (Micro/SMB/Mid-Market), created_at, churn_date, notes (admin-only fields: ltv, phone, payment_status)
  - **Website:** id, customer_id, domain, subdomain_fallback, ssl_certificate_expires_at, deployed_at, last_updated_at, feature_toggles (json), customer_edit_count, last_customer_edit_at
  - **FormSubmission:** id, website_id, prospect_name, prospect_email, prospect_phone, message, submitted_at, synced_to_crm_at, crm_sync_status (pending/synced/failed), crm_error_message
  - **Review:** id, website_id, source (Google/Yelp/Trustpilot), author_name, rating, text, url, reviewed_at, synced_at, customer_response
  - **CRMIntegration:** id, customer_id, crm_type, auth_token (encrypted), sync_status (active/failed/paused), last_sync_at, leads_sent, sync_errors_count
  - **Subscription:** id, customer_id, stripe_subscription_id, tranche (Micro/SMB/Mid-Market), monthly_price, billing_cycle_start, billing_cycle_end, next_billing_date, payment_status (active/past_due/canceled/unpaid), created_at, canceled_at, cancellation_reason
  - **[ADMIN ONLY] AgentRun:** id, agent_name, run_id, started_at, completed_at, status (success/failed/partial/timeout), rows_processed, rows_failed, error_message, retry_count
  - **[ADMIN ONLY] PaymentTransaction:** id, customer_id, stripe_transaction_id, amount, transaction_type (charge/refund/dispute), status (succeeded/failed/pending), created_at, error_message
- Enum definitions:
  - business_size: Micro, SMB, Mid-Market
  - tranche: Micro, SMB, Mid-Market (different from biz size — it's our offering tier)
  - crm_type: ServiceTitan, Jobber, Housecall Pro, HubSpot, Successware
  - demo_status: generated, viewed, converted, expired, archived
  - sync_status: active, failed, paused, error
- Multi-tenancy isolation: Row-level security (customer_id on every query)
- API payload examples:
  - POST /customers { name, email, domain, tranche }
  - GET /leads?created_after=2024-09-01 [ { id, name, email, status } ]
  - POST /crm-sync { customer_id, crm_type, leads_to_sync: [ { name, email, phone } ] }

---

## SECTION 2: Event/Sync System (Data Flows)

**Contents to lock down:**
- Data flow map (locked-in flows):
  - **Lead Discovery → Warehouse:** Google Places API + scraper → prospect contact info (daily 7am)
  - **Lead Scoring → Outbound Queue:** quality score + fit ranking → high-priority leads eligible for outreach (hourly)
  - **Outbound Campaign → Demo:** email sent → track open/click (real-time webhook from SendGrid)
  - **Demo Click → Conversion:** prospect views demo on Cloudflare → demo view tracked, intent signal captured (real-time)
  - **Conversion → Payment:** prospect purchases → Stripe webhook → create customer record (real-time)
  - **Payment → Site Deployment:** customer paid → regenerate static site → deploy to Cloudflare → send welcome email (<1 min)
  - **Customer Dashboard Edit → Site Regen:** customer edits copy/features → trigger regeneration → push to Cloudflare (5-10 seconds)
  - **Form Submit → CRM Sync Queue:** prospect submits contact form on customer website → stored in Fornax → queued for hourly CRM sync
  - **CRM Sync Agent → Customer CRM:** every hour 6am-8pm, batch leads captured → push to ServiceTitan/Jobber/etc (hourly batch)
  - **Review Sync → Customer Site:** daily check Google/Yelp APIs → new reviews pulled → site regenerated with fresh reviews → pushed to Cloudflare (daily 6am)
  - **Site Analytics → Dashboard:** customer logs in → sees real-time stats (leads, form submissions, page views) (real-time)
- Failure handling per flow:
  - Failed event: retry with exponential backoff (1s → 5s → 30s → 5min)
  - Max retries: 3 attempts, then move to DLQ (dead letter queue)
  - Circuit breaker: if CRM API is down, stop trying for 5 minutes, then retry
- Idempotency: every event has unique ID (event_id, timestamp, source, recipient); database constraint unique(event_id) prevents duplicates
- Ordering: within same stream (e.g., per-customer events), maintain order
- Monitoring: sync latency, success rate; alert if latency >5 min or success rate <95%
- Logging: retention 90 days (debugging), archive after 1 year

---

## SECTION 3: Agent Orchestration System

**Contents to lock down:**
- Execution model: Cloud functions (stateless, fast, cheap) for short tasks; Docker containers for long-running/stateful
- Scheduling: cron jobs, event-triggered, queue-based, manual
- Trigger events (when does each agent run?):
  - Lead Discovery: cron daily 7 AM
  - Lead Scoring: cron hourly
  - Outbound Campaign: event-triggered per lead (high-scoring leads trigger send)
  - Demo Gen: event-triggered after Outbound success
  - QA Validation: event-triggered after Demo Gen
  - CRM Sync: cron every 15 min
  - Review Sync: cron daily 6 AM
  - Analytics Event: real-time streaming
- Error handling: exponential backoff (1s, 5s, 30s, 5min, 30min, 1hr); max retries 5 for transient errors, 1 for hard errors; DLQ after max retries; alert Tyler within 5 min
- Dependency chain: Lead Discovery → Lead Scoring → Outbound Campaign → Demo Gen → QA Validation → Delivery → Conversion → CRM Sync → Analytics Event
- State management: stateless agents (Lead Scoring, Outbound Campaign) safe to parallelize; stateful agents (CRM Sync) track "already synced" via idempotency key
- Testing: local dev with mock data, test database (isolated copy of prod schema), mock APIs, dry-run mode, CI/CD before deploying agents to prod

---

## INTEGRATION POINTS

**How all three components work together:**
1. **Data Model** defines what data exists and how it's related
2. **Event/Sync System** defines how data moves between systems
3. **Agent Orchestration** defines how agents process and transform data

**Example flow:**
- Lead Discovery Agent queries APIs, outputs lead records
- Events trigger: lead created → Lead Scoring Agent runs
- Lead Scoring Agent reads leads from database, scores them, updates status
- Event triggered: lead scored (high priority) → Outbound Campaign Agent runs
- Outbound Agent outputs event: email sent
- Event triggered: email sent → tracking enabled
- User clicks demo link → Demo click event triggered → Conversion System begins

---

## AGENT REGISTRY CROSS-REFERENCE (Supersedes Section 3's Agent Catalog)

**Section 3's agent list above predates the unified Agent Registry and has naming drift.** The Agent Registry (`agents/AGENT_REGISTRY.md`) is now the source of truth for agent names, patterns, retry logic, and eval standards. Corrections:

| Section 3 name (this doc) | Registry name | Note |
|---|---|---|
| Lead Discovery Agent | Lead Lookup Agent (#5) | Same agent as System 18's photo-intake lookup, batch mode |
| Outbound Campaign Agent | Outreach/Copy Agent (#7) | Copy generation is agentic; sending/sequencing is deterministic workflow code, not part of the agent |
| Demo Generation Agent | Design Agent (#1) | One of FOUR call sites (System 4, 6, 18, and this system's edit-triggered regen) |
| QA Validation Agent | Design QA Agent (#3) | — |
| CRM Sync Agent | CRM Sync Agent (#8) | Name unchanged, already consistent |
| Site Regeneration Agent | Design Agent (#1), 4th call site | Not a separate agent — same template warehouse/logic as the other three call sites |
| Review Sync Agent | Review Sync Agent (#14) | Was previously undocumented in the registry; gap closed |
| Analytics Event Agent | *(not an agent)* | Pure event-stream ingestion, no LLM reasoning — see Registry Section A2 |

All retry logic, model tiering, eval metrics, and human-in-the-loop gates for these agents now live in the Agent Registry, not duplicated here.
