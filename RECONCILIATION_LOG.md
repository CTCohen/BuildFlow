---
title: BuildFlow Reconciliation Log
purpose: Gap analysis between spec export and current BuildFlow implementation
status: in_progress
owner: c.t.cohen
updated: 2026-09-18
---

# Reconciliation: Spec vs. Current Implementation

**Phase:** Step 0 of Launch Readiness Plan — conflict identification before implementation

**Process:**
1. List spec requirements (19 systems + 15 agents + core infrastructure)
2. Map to current BuildFlow state
3. Identify conflicts / gaps / decisions needed
4. User reviews and rules on each conflict
5. Approved reconciliation gates Step 1 implementation

---

## TIER 1: FOUNDATION SYSTEMS (3 Systems)

### System 01: Business Operations System
**Spec requires:**
- Unit economics locked (pricing: B $99/mo or A $497 one-time; ARPU targets; CAC limits)
- Budget constraints ($50/mo pre-revenue spend cap)
- Team/hiring plan

**Current state:**
- ✅ Pricing documented in CLAUDE.md (B $99/mo, A $497)
- ✅ Budget awareness in ROADMAP.md (token spend tracking in metrics/)
- ⚠️ Hiring plan: not documented; solo founder model implicit

**Decision needed:** Do we need explicit hiring plan doc, or is solo-founder assumption sufficient for launch?

---

### System 02: Platform Architecture System
**Spec requires:**
- Data schema (customer, site, lead, payment records)
- Event flows (discovery → outreach → demo → conversion → sync → churn)
- Agent orchestration patterns
- State machine for pipeline (prospect → customer → lifecycle)

**Current state:**
- ✅ Event flows described in ROADMAP.md + phases/
- ✅ Pipeline state in metrics/EXECUTION_TRACKER.md (manual tracking)
- ❌ **No formal data schema defined** (App uses Astro + flat file structure for sites, no DB yet)
- ❌ **No agent orchestration spec** (agents don't exist yet; workflows are manual)

**Conflict:** Spec assumes a database + agent orchestration layer. Current approach is file-based (customer-sites/) + manual workflows.

**Decision needed:**
- A. Keep file-based until scale requires DB (~10 customers), or
- B. Build Supabase schema now for launch?

**Recommendation:** A (ship MVP file-based, specs already say this is Phase 1 acceptable per business-model-and-constraints.md). Schema derivation is Task 2.5 work.

---

### System 03: Hosting & Infrastructure System
**Spec requires:**
- Customer site hosting (multi-tenant Astro app at customer domains)
- Domain management (Cloudflare DNS, SSL)
- Failover / uptime SLA

**Current state:**
- ✅ App structure exists (Astro, multi-tenant routing)
- ✅ Railway + Cloudflare documented (operations/)
- ✅ Domain setup tested (docs/tech-stack.md references it)
- ⚠️ **Failover/SLA not documented** (implied to be Railway's responsibility, no explicit monitoring)

**Decision needed:** Is a written SLA + uptime monitoring baseline needed for launch, or covered by infrastructure assumptions?

**Recommendation:** Add to System 13 (Observability) as a "launch baseline" monitoring item, not a blocker.

---

## TIER 2: MVP LAUNCH SYSTEMS (8 Systems)

### System 04: Design & Quality System
**Spec requires:**
- 4 vertical base templates (plumbing, HVAC, electrical, roofing)
- 10 styling profiles (design-token sets)
- Design Agent + Design QA Agent + Design Discovery Agent
- Customization sliders
- WCAG/Lighthouse QA gates

**Current state:**
- ✅ App scaffold exists (app/src/)
- ❌ **No templates built yet** (designs/ has logo variants, not site templates)
- ❌ **No Design agents exist**
- ❌ **No QA gates implemented**
- ✅ WCAG/Lighthouse mentioned in routines/testing.md (not automated)

**Decisions needed:**
- Design Agent build order: first in Step 1 or in parallel with System 07 agents?
- Template count: start with 1 template + 3 styling profiles, scale to 4×10 by launch?

**Recommendation:** Per launch-readiness-plan.md Step 3.1, Design Agent + Design QA Agent must be "First tier" (blocks everything visual). This is Tier 1 critical path.

---

### System 05: Feature System
**Spec requires:**
- Phase 1 scope per tier (Micro/SMB/Mid-Market feature matrix)
- Acceptance criteria

**Current state:**
- ✅ docs/TIER-FEATURE-MATRIX.md exists
- ✅ Feature gates described in operations/

**Status:** No conflict, forward.

---

### System 06: Demo-to-Customer System
**Spec requires:**
- Generate demo site in <2 min (using Design Agent)
- Deliver preview link to prospect
- Conversion tracking (demo → calendar → call → close)
- Fulfillment (customer data intake → site build → go-live)

**Current state:**
- ⚠️ **Demo generation path unclear** (no Design Agent means no automation yet)
- ✅ Preview link generation (Astro app scaffolding done)
- ⚠️ Conversion tracking: partial (Calendly + manual call notes, no Stripe integration yet)
- ✅ Fulfillment workflow documented (operations/SITE-BUILD-WORKFLOW.md)

**Decision needed:** Does "demo generation" mean:
- A. Generate a unique preview per prospect (using Design Agent), or
- B. Show shared template preview, build unique site post-close?

**Recommendation:** Per spec, A (each demo is unique). This requires Design Agent working. Current approach is B. Defer full A until Design Agent complete, launch with B.

---

### System 07: Lead-to-Customer Pipeline
**Spec requires:**
- Lead Lookup Agent (Apollo/Hunter.io enrichment)
- Lead Scoring Agent (rank prospects by ICP fit)
- Outreach/Copy Agent (personalized email/SMS)
- Sequence state machine (5 touches, time-gated)

**Current state:**
- ✅ Prospect research done manually (outreach/REAL_PROSPECTS_READY_TO_SEND.md)
- ✅ Email copy templates exist (outreach/templates/)
- ❌ **No agents built yet**
- ⚠️ **No sequencing automation** (manual send, manual follow-ups)

**Decision needed:** Build all 3 agents (Lookup, Scoring, Outreach/Copy) before launch, or launch with manual workflow + add agents in Phase 1.5?

**Recommendation:** Per launch-readiness-plan Step 3.2, these are "Second tier" (after Design agents). Required for launch but not Day-1 blocking.

---

### System 08: Payments & Billing System
**Spec requires:**
- Stripe integration (monthly + annual Price objects)
- Dunning state machine (Tiers 1–5, 90-day lifecycle)
- Dunning Agent (personalized retry emails)
- Revenue / MRR tracking

**Current state:**
- ❌ **No Stripe integration built**
- ❌ **No Dunning Agent**
- ✅ Revenue tracking concept (metrics/)

**Decisions needed:**
- Stripe annual/monthly pricing: exact Price IDs, tax handling strategy?
- Dunning automation: build Dunning Agent now, or launch with manual email?

**Recommendation:** Stripe basic integration (checkout flow) needed for launch. Dunning automation is Phase 1.5 per spec; launch with manual Tyler override.

---

### System 09: CRM Integration System
**Spec requires:**
- Phase 1 five CRMs: ServiceTitan, Jobber, Housecall Pro, HubSpot, Successware
- CRM Sync Agent (push customer/lead events, conflict resolution)
- Bidirectional sync
- Conflict reconciliation (System 9 Section 5B: field mapping, 4-signal resolution)

**Current state:**
- ❌ **No CRM integrations built yet**
- ✅ CRM roadmap documented (docs/CRM_MCP_INTEGRATION_ROADMAP.md)
- ❌ **CRM Sync Agent not built**

**Decision needed:** Launch with one CRM (simplest: HubSpot or ServiceTitan), add others in Phase 1.5?

**Recommendation:** Per launch-readiness-plan, System 9 is Tier 2 but note in docs: "Phase 1.0 ships with manual CRM-by-customer config; multi-CRM sync agents planned for Phase 1.5."

---

### System 10: External Integrations System
**Spec requires:**
- Data contracts with 10 top trades CRMs
- Sync logic per CRM schema

**Current state:**
- ❌ **Not started** (depends on System 09 agents first)

**Decision needed:** Is this required for MVP launch, or Phase 1.5?

**Recommendation:** Phase 1.5. Spec confirms; launch with System 9 (one CRM) foundation only.

---

### System 11: Compliance & Security System
**Spec requires:**
- GDPR/CCPA compliance
- Customer auth (login → dashboard access)
- Encryption (data at rest/in transit)
- WCAG A11y gates
- Incident response plan

**Current state:**
- ✅ Auth structure implied (Astro app per-customer routing)
- ❌ **No explicit auth implementation** (no login flow, no auth layer)
- ⚠️ **No GDPR/CCPA documentation**
- ✅ WCAG gates mentioned (System 04, routines/testing.md)
- ❌ **No incident response plan**

**Decisions needed:**
- Auth: simple per-domain login, or federated (Clerk/Auth0)?
- Compliance: full GDPR audit pre-launch, or Phase 1?

**Recommendation:** 
- Auth: ship simple per-domain login (e.g., email-based, stored in flat file during MVP). Upgrade to Clerk in Phase 1.5.
- Compliance: document GDPR/CCPA approach in System 11 (likely: privacy policy + data retention policy), confirm with lawyer before money changes hands.

---

## TIER 3: SCALE SYSTEMS (5 Systems)

### Systems 12–15 (Lifecycle, Observability, Support, Feedback)

**Current state:** Not yet built (post-launch priority per spec).

**Note:** System 13 (Observability) needs a "launch baseline": agent run tracking + error monitoring, wired as agents are built (per launch-readiness-plan Step 3.5).

---

## TIER 3.5: TYLER'S OPERATIONS (2 Systems)

### System 18: Admin CRM & Operations System
**Spec requires:**
- Web admin dashboard (agent insights, customer health, revenue, pipeline)
- iOS app (photo intake → OCR → Lead Lookup → Lead Scoring → Design Agent → demo generation in <2 min)
- Agent feedback loop (what failed, why?)

**Current state:**
- ❌ **Web admin dashboard not built**
- ❌ **iOS app not built**
- ✅ Pipeline concept (metrics/EXECUTION_TRACKER.md)

**Decision needed:** iOS app in launch scope, or Phase 1.5?

**Recommendation:** Per launch-readiness-plan Step 3.1, "fourth tier (post-launch-safe)" — iOS app is Phase 1.5, not a launch blocker. Web admin dashboard IS required for launch (Step 6).

---

### System 19: BuildFlow Public Website
**Spec requires:**
- buildflow.io: Home, Features, Pricing, Demo, Blog (first 3 posts), Docs, About

**Current state:**
- ✅ website/ folder exists
- ⚠️ Site structure unclear (check actual content)

**Decision needed:** Is website currently live/ready, or needs rebuild per spec?

**Recommendation:** Review website/ actual content, confirm against System 19 spec scope.

---

## CROSS-CUTTING: AGENT REGISTRY (15 Agents)

**Spec requires:**
| # | Agent | Pattern | Launch? |
|---|-------|---------|---------|
| 1 | Design Agent | Workflow | **CRITICAL** (blocks System 4, 6) |
| 2 | Design Discovery Agent | Workflow | **CRITICAL** (System 4) |
| 3 | Design QA Agent | Evaluator-Optimizer | **CRITICAL** (gates System 6) |
| 4 | Lead Scoring Agent | Routing | Tier 2 (System 7, 18) |
| 5 | Lead Lookup Agent | Fan-out | Tier 2 (System 7, 18) |
| 6 | OCR / Photo Intake Agent | Simple | Phase 1.5 (System 18) |
| 7 | Outreach / Copy Agent | Prompt chaining | Tier 2 (System 7, 18) |
| 8 | CRM Sync Agent | Pipeline + Evaluator | Tier 2 (System 9, 10) |
| 9 | Dunning Agent | Pipeline | Phase 1.5 (System 8) |
| 10 | Support Triage Agent | Routing | Phase 2 (System 14) |
| 11 | Feedback Triage Agent | Routing | Phase 2 (System 15) |
| 12 | Lifecycle / Churn Prediction Agent | Scoring | Phase 2 (System 12) |
| 13 | SEO Optimization Agent | Batch | Phase 1.5 (System 16) |
| 14 | Review Sync Agent | Pipeline | Phase 2 (System 12) |
| 15 | Experimentation / Guardrail Agent | Routing | Phase 2 (System 17) |

**Current state:** No agents built yet.

**Critical path (launch blockers):**
1. Design Agent (#1)
2. Design QA Agent (#3)
3. Design Discovery Agent (#2)
4. Lead Scoring Agent (#4) — *if* using auto-scoring for outbound
5. Lead Lookup Agent (#5) — *if* automating lead enrichment
6. Outreach/Copy Agent (#7) — *if* automating email generation
7. CRM Sync Agent (#8) — *if* automating CRM push

**Decision needed:** Which agents are Day-1 requirements vs. nice-to-have?

**Recommendation:** Per launch-readiness-plan:
- **Must ship:** Design (#1), Design QA (#3), Design Discovery (#2)
- **Should ship:** Lead Scoring, Lead Lookup, Outreach/Copy, CRM Sync (enables full automation)
- **Phase 1.5+:** Dunning, Support/Feedback Triage, Lifecycle, OCR, Review Sync, SEO, Experimentation

---

## CONFLICTS SUMMARY & DECISIONS NEEDED

| # | Conflict | Spec vs. Current | Recommended Resolution | Decision? |
|----|----------|------------------|------------------------|-----------|
| 1 | **Data Layer** | Spec: DB + schema. Current: File-based. | Keep file-based for MVP, derive schema in Task 2.5 as part of implementation. | ✅ Approved (per business-model constraints) |
| 2 | **Design Templates** | Spec: 4 verticals × 10 profiles. Current: None. | Ship with 1 template + 3 profiles, scale by end of Phase 1. | **WAITING: User decision** |
| 3 | **Demo Generation** | Spec: Unique demo per prospect (Design Agent). Current: Shared template. | Launch with shared template, upgrade to unique when Design Agent ready. | **WAITING: User decision** |
| 4 | **Lead Automation** | Spec: Lookup/Scoring/Outreach agents. Current: Manual. | Launch with manual workflows, add agents in Phase 1.5. | **WAITING: User decision** |
| 5 | **CRM Sync** | Spec: 5 CRMs, automatic. Current: None. | Ship with one CRM (HubSpot), add others Phase 1.5. | **WAITING: User decision** |
| 6 | **Payments** | Spec: Stripe + Dunning. Current: None. | Ship Stripe checkout, manual dunning (Tyler), Dunning Agent in Phase 1.5. | **WAITING: User decision** |
| 7 | **Auth** | Spec: Secure login. Current: No auth layer. | Ship simple per-domain email-based login, upgrade to Clerk Phase 1.5. | **WAITING: User decision** |
| 8 | **Compliance** | Spec: GDPR/CCPA docs. Current: Not documented. | Write privacy policy + data retention, lawyer review before payments enabled. | **WAITING: User decision** |
| 9 | **iOS App** | Spec: Phase 1.5. Current: Not built. | Confirm Phase 1.5 (not launch blocker). | ✅ Approved (per launch-readiness-plan) |
| 10 | **Web Admin Dashboard** | Spec: System 18. Current: Not built. | Ship as part of Step 6 (System 18 web dashboard is launch requirement, iOS is Phase 1.5). | ✅ Approved |
| 11 | **Observability Baseline** | Spec: System 13. Current: Not wired. | Add monitoring for agent runs + errors during Step 3 agent builds. | ✅ Approved (per Step 3.5) |
| 12 | **Hiring Plan** | Spec: System 01 mentions. Current: Implicit solo-founder. | Document as "Solo founder model" in System 01, defer hiring to Phase 2. | **WAITING: User decision** |

---

## NEXT STEP

**User review section above (conflicts 2–8, 12), approve resolutions, or propose alternatives.**

Once approved, proceed to **Task 2.4: Folder/File Structure Derivation** — map the 19 systems to a folder layout where each system's spec lives next to its code.

