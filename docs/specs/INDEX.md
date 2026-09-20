---
title: BuildFlow — Master System Index
purpose: Macro-level overview of all 19 BuildFlow systems, organized by tier, dependencies, and launch phase
status: active
owner: c.t.cohen
updated: '2026-09-18'
version: 1.0.0
tier_scope: all
phase: phase_1
spec_name: BuildFlow Master Index
spec_aliases:
- systems index
- architecture index
- master overview
spec_sources:
- chat
spec_authority: authoritative (exported from claude.ai project memory 2026-09-17)
---

# BuildFlow — Master System Index

**19 consolidated systems** — one doc per system + this overview. See "File Locations" below

---

## TIER 1: FOUNDATION (3 Systems)

| # | System | Purpose | Status |
|---|--------|---------|--------|
| 1 | Business Operations System (01) | Unit economics, margins, budget, hiring plan | LOCKED |
| 2 | Platform Architecture System (02) | Data schema, event flows, agent orchestration | LOCKED |
| 3 | Hosting & Infrastructure System (03) | Customer website hosting, domains, failover | LOCKED |

## TIER 2: MVP LAUNCH (8 Systems)

| # | System | Purpose | Status |
|---|--------|---------|--------|
| 4 | Design & Quality System (04) | Templates, components, WCAG gates, QA, discovery/styling/customization/redesign | LOCKED |
| 5 | Feature System (05) | Phase 1 scope, tranche-specific feature list, acceptance criteria | LOCKED |
| 6 | Demo-to-Customer System (06) | Generate → deliver → convert → fulfill | LOCKED |
| 7 | Lead-to-Customer Pipeline (07) | Populate → qualify → pitch → convert (full GTM motion) | LOCKED |
| 8 | Payments & Billing System (08) | Processor, billing, revenue, refunds, tax, dunning | LOCKED |
| 9 | CRM Integration System (09) | Phase 1 CRMs (5), sync, conflict resolution | LOCKED |
| 10 | External Integrations System (10) | Customer CRM integrations — top 10 trades CRMs, bidirectional sync | LOCKED |
| 11 | Compliance & Security System (11) | GDPR/CCPA, auth, encryption, WCAG, incident response | LOCKED |

## TIER 3: SCALE (5 Systems)

| # | System | Purpose | Status |
|---|--------|---------|--------|
| 12 | Customer Lifecycle & Success System (12) | Onboarding, milestones, churn prediction, reviews | LOCKED |
| 13 | Observability System (13) | Event tracking, metrics dashboards, monitoring alerts | LOCKED |
| 14 | Customer Support & Documentation System (14) | Support triage, SLAs, help center, knowledge base | LOCKED |
| 15 | Customer Feedback & Iteration System (15) | Bug capture, feature requests, roadmap prioritization | LOCKED |

## TIER 3.5: TYLER'S OPERATIONS (2 Systems)

| # | System | Purpose | Status |
|---|--------|---------|--------|
| 18 | Admin CRM & Operations System (18) | Tyler's iOS app + web admin. Photo intake, pipeline, customer health, revenue, agent feedback | LOCKED |
| 19 | BuildFlow Public Website (19) | buildflow.io marketing site | LOCKED |

## TIER 4: OPTIMIZE (2 Systems)

| # | System | Purpose | Status |
|---|--------|---------|--------|
| 16 | SEO/GEO System (16) | Design defaults + dynamic optimization + ranking monitoring | LOCKED |
| 17 | Experimentation System (17) | A/B testing infrastructure for outbound, pricing, features | LOCKED |

---

## Agent Registry (Cross-Cutting — Not a Numbered System)

`agents/AGENT_REGISTRY.md` — catalogs all 15 BuildFlow agents (Design, Discovery, Design QA, Lead Scoring, Lead Lookup, OCR, Outreach/Copy, CRM Sync, Dunning, Support Triage, Feedback Triage, Lifecycle/Churn, SEO Optimization, Review Sync, Experimentation/Guardrail) with pattern classification, model tier, retry logic, human-gate requirements, 2026 eval standards, and an agent-scaling model confirming no additional agents are needed per vertical/tranche/outbound-touch. Read this alongside any system that mentions an agent (2, 4, 6, 7, 8, 9, 10, 12, 14, 15, 16, 17, 18). Systems 1, 3, 5, 11, 19 need no agent; System 13's "agents" are infrastructure cron jobs, not LLM agents.

---

## System Workflow Map

```
Business Operations (1) + Platform Architecture (2) + Hosting (3)
    -> (these define all constraints & infrastructure)

Demo-to-Customer (6): generate -> deliver -> conversion
    -> Demo relies on Design System (4), QA Gates (4)
    -> Conversion requires Payments (8)
    -> Fulfillment creates CRM link (9)

Lead-to-Customer Pipeline (7): warehouse -> qualify -> pitch
    -> Outbound relies on Lead Warehouse quality
    -> Pitch includes Demo (6) preview

Launch (4, 5, 6, 7, 8, 9, 11) complete.
CRM Sync (9) + External CRM Integrations (10) handle integrations.

Post-Launch:
    Lifecycle (12): onboarding -> churn prediction -> reviews
    Observability (13): monitor everything
    Support (14): scale with triage + docs
    Feedback (15): iterate roadmap

Growth:
    SEO/GEO (16): rank in search, expand geographically
    Experimentation (17): test outbound, pricing, features

Internal Ops:
    Admin CRM (18): Tyler's pipeline + photo intake
    Website (19): marketing / top of funnel
```

---

## File Locations

Each system's spec now sits beside the module it governs. Full map: [`README.md`](README.md).

- 01: `docs/01-business-operations-system.md`
- 02: `platform/SPEC-02-platform-architecture.md`
- 03: `platform/SPEC-03-hosting-infrastructure.md`
- 04: `design/SPEC-04-design-quality.md`
- 05: `specs/05-feature-system.md`
- 06: `platform/SPEC-06-demo-to-customer.md`
- 07: `outreach/SPEC-07-lead-to-customer-pipeline.md`
- 08: `billing/SPEC-08-payments-billing.md`
- 09: `crm/SPEC-09-crm-integration.md`
- 10: `crm/SPEC-10-external-integrations.md`
- 11: `legal/SPEC-11-compliance-security.md`
- 12: `onboarding/SPEC-12-customer-lifecycle.md`
- 13: `platform/SPEC-13-observability.md`
- 14: `operations/SPEC-14-customer-support.md`
- 15: `operations/SPEC-15-customer-feedback.md`
- 16: `knowledge/SPEC-16-seo-geo.md`
- 17: `operations/SPEC-17-experimentation.md`
- 18: `platform/SPEC-18-admin-crm-operations.md`
- 19: `website/SPEC-19-website.md`
- Agent registry: `agents/AGENT_REGISTRY.md`

Cross-cutting: `docs/specs/INDEX.md` (this file), `docs/BUSINESS_MODEL.md`, `docs/specs/LAUNCH_READINESS_PLAN.md`, `docs/specs/PREFERENCES.md`.

---

## Status Summary

All 19 systems LOCKED. Agent Registry LOCKED (15 agents, all 19 systems audited for coverage, no cycles found).
