---
title: external-integrations-system
purpose: BuildFlow customer integrations with external CRMs. Top 10 trades CRMs supported; bidirectional sync of leads, conversions, and customer data. MCP-based connectors for easy customer onboarding.
status: active
owner: c.t.cohen
updated: '2026-09-18'
version: 1.0.0
tier_scope: all
phase: phase_1
spec_name: external-integrations-system
spec_aliases:
- CRM integrations
- external APIs
- customer integrations
- third-party sync
spec_sources:
- chat
spec_authority: authoritative (exported from claude.ai project memory 2026-09-17)
---

> **Overrides (Tyler, 2026-09-18).** This spec is authoritative except where Tyler ruled otherwise (`RECONCILIATION_LOG.md`, `DECISIONS.md`):
> - Launch with one CRM (HubSpot). The real-time <2 min push, 2-hour status pull and daily reconciliation described here wait for two-way sync; launch cadence is the 5-minute batch in System 09.
> - Mid-Market multi-CRM and two-way sync are deferred.


## System 10: External Integrations System

**Scope:** Customer's external CRM integrations (NOT a public API or partner program)

**Phase 1 Decision:** MCP-based connectors for top 10 trades CRMs; light CRM support (basic data sync)

---

## 1. Top 10 Trades CRMs (Phase 1 Support)

| CRM | Market | Status |
|---|---|---|
| ServiceTitan | HVAC, Plumbing, Electrical, Home Services | PRIMARY |
| Jobber | Field Services, Plumbing, Electrical, Landscaping | PRIMARY |
| Housecall Pro | HVAC, Plumbing, Electrical, Handyman | PRIMARY |
| HubSpot | General SMB sales tool | PRIMARY |
| Successware | HVAC, Plumbing (regional favorite) | PRIMARY |
| Spike | Field Services | SECONDARY |
| FieldEdge | HVAC, Plumbing, Electrical | SECONDARY |
| Knowify | Construction trades | SECONDARY |
| Zoho CRM | General, low-cost SMB | SECONDARY |
| Pipedrive | General, sales-focused | SECONDARY |

**Phase 2 expansion:** Monday.com, Asana, Notion, Airtable, Salesforce, Acuity Scheduling + more

---

## 2. Data Flow: BuildFlow → Customer's External CRM

**Push events:** qualified_lead_generated (business info, contact, lead_quality_score, urgency, service_category), lead_converted (conversion value/type/date), website_interaction (real-time page views, calls, chat, form submits)

---

## 3. Data Flow: Customer's External CRM → BuildFlow (Feedback Loop)

**Pull events:** lead_status_updated (crm_status, notes, outcome, competitor_name if lost), customer_record_updated (contact info, notes, NPS, renewal flag)

---

## 4. Sync Architecture (MCP-Based Connectors)

**Onboarding:** dashboard "Add CRM" → select CRM → OAuth flow → choose sync depth (leads only / leads+conversions / full sync) → test sync → go live

**Sync frequency:** lead push real-time (<2 min); status pull every 2 hours; daily bulk reconciliation

**Conflict resolution:** BuildFlow source of truth for lead quality score + website-form contact info; CRM source of truth for lead status/outcome/notes; CRM wins for historical data, BuildFlow wins for new lead attributes

---

## 5. MCP Connector Implementation (Per CRM)

Standard pattern: `buildflow-{crm_name}-connector` — authenticate(), create_lead(), update_lead(), get_lead_status(), sync_customer_data()

---

## 6. Data Mapping: BuildFlow Fields → CRM Fields

Standard fields (contact_name, contact_email, contact_phone, business_name, lead_quality_score, service_category, estimated_value, urgency) mapped per-CRM in onboarding config.

---

## 7. Error Handling & Retry Logic

Temporary (API timeout): retry 5 min × 6. Auth fail: alert customer, require re-auth. Rate limit: queue, batch off-peak. 3 failures → Tyler notified. 5 → sync paused, customer alerted.

---

## 8. Security & Data Privacy

OAuth 2.0 (cloud CRMs) / API Key (legacy CRMs), annual token rotation, TLS 1.2+ in transit, AES-256 encrypted API keys at rest, no CRM password storage, full audit trail. Customer can pause/delete sync anytime; export audit trail on request.

---

## 9. Monitoring & Observability

Targets: lead delivery latency <2 min (alert >5min); status sync <2hr (alert >4hr); sync success rate >99% (alert <98%); API error rate <1% (alert >2%). Customer dashboard shows last sync, leads sent, status, manual resync.

---

## 10. Roadmap

Phase 1: top 3 CRMs (ServiceTitan, Jobber, HubSpot), lead push + status pull. Phase 1.5 (Month 2-3): remaining 7 CRMs, full bidirectional sync. Phase 2 (Month 4-6): custom field mapping UI, Zapier integration, webhook support.

---

## 11. Agent Cross-Reference

**CRM Sync Agent (Agent Registry #8)** is the same agent implementing System 9's customer-CRM connectors — this system specifies the top-10-CRM data contracts and conflict rules that agent operates under.

Full agent detail: `agents/AGENT_REGISTRY.md`

---

## Status: LOCKED
