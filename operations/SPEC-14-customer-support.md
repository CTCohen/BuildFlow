---
title: System 14 — Customer Support Documentation System
purpose: Support workflow, help center, knowledge base, SLA targets, feedback loop
status: active
owner: c.t.cohen
updated: '2026-09-18'
version: 1.0.0
tier_scope: all
phase: phase_1
spec_name: 14-customer-support-documentation-system
spec_aliases:
- customer support
- documentation
- help center
- knowledge base
spec_sources:
- chat
spec_authority: authoritative (exported from claude.ai project memory 2026-09-17)
---

> **Overrides (Tyler, 2026-09-18).** This spec is authoritative except where Tyler ruled otherwise (`RECONCILIATION_LOG.md`, `DECISIONS.md`):
> - Published support promise is a 24-48 hour first response; the P0-P3 targets are internal, with alerting automated (Tyler works a day job).
> - Support email and help center domains follow the domain map (D32).


# System 14 — Customer Support Documentation System

## Purpose

Lock down customer support workflows, help center documentation, and SLA targets to reduce support load and empower customer self-service.

## Contents

- Support workflow, triage, and severity levels (P0-P3)
- Help center and knowledge base structure
- Internal troubleshooting guides for support team
- Support and product feedback loop
- Automated triage layer

## Specifications

### SECTION 1: Support Workflow & Triage

**Channels:** email (support@[domain TBD under Fornax name], primary), help center self-serve, chat (Phase 2), no phone Phase 1

**Severity definitions:**
- **P0 (respond <1hr, resolve 24hr):** site down, payment failure blocking ops, security concern, multi-customer issue
- **P1 (respond <4hr, resolve 48hr):** feature broken (CRM sync, forms), performance issue, data loss concern
- **P2 (respond <24hr, resolve 72hr):** cosmetic issue, feature request, confusion
- **P3 (respond <72hr, resolve 1wk):** general inquiries, enhancement suggestions, feedback

---

## SECTION 2: Help Center & Knowledge Base

**Topics:** Getting Started (customize site, add services/team), Lead Management (understanding leads, contacting, tracking status), CRM Integration (setup per-CRM, troubleshooting, field mapping), Website Performance (analytics, why no leads, improving capture rate), Billing & Account (how billing works, changing plan, payment method), Troubleshooting (slow site, forms not working, can't log in)

**Format:** written step-by-step + screenshots, 2-3 min videos, FAQs, troubleshooting flowcharts

**Structure:** [domain TBD under Fornax name] — categories, full-text search, related articles, "was this helpful?" feedback

**Maintenance:** new articles on feature launch; quarterly review of top 10 articles; deprecation marking

---

## SECTION 3: Knowledge Base for Support Team (Internal)

**Troubleshooting flowcharts:** "Site is down" (check hosting/DNS/SSL/deployments/resources), "CRM sync failing" (check CRM access/OAuth token/field mapping/rate limits), "Customer not receiving leads" (check site working/tracking enabled/traffic/form interaction/geo targeting)

**Decision trees:** refund requests, security concern triage, feature request evaluation

**Incident playbooks:** site down, payment processor down, data breach, customer churn response

---

## SECTION 4: Support & Product Feedback Loop

**Ticket tags:** feature request, bug, confusion, performance, integration, billing, other

**Monthly analysis:** ticket count by severity/category/resolution time, top issues, resolution time trends, CSAT, action items

**Feedback to product:** feature request tallying, documentation-gap creation, bug escalation to dev, UX-confusion pattern detection, quarterly roadmap input

---

## SECTION 5: Automated Triage Layer

**Agent used:** Support Triage Agent (Agent Registry #10) — cheap-tier classification workflow.

**Automated workflow:**
1. Incoming email → agent classifies severity (P0-P3), category, searches help center for matching article
2. High-confidence KB match + P2/P3 → auto-reply with article + "still need help?" follow-up — no Tyler involvement unless customer replies again
3. P0/P1 or low-confidence → routes directly to Tyler's queue (System 18 admin dashboard), tagged with agent's best-guess for Tyler to confirm/override
4. Feature request category → auto-forwards to Feedback Triage Agent (System 15)

**Fail-safe:** any low-confidence classification defaults to P2 + Tyler queue — never silently auto-closes.

**Monitoring:** auto-resolve rate, false-priority rate, category accuracy (spot-checked monthly)

Full agent detail: `agents/AGENT_REGISTRY.md`
