---
title: Fornax Decisions & Rationale
purpose: Single source of truth for all business, product, and technical decisions with context and impact
status: active
owner: c.t.cohen
updated: 2026-09-12
version: 1.0
tier_scope: all
phase: operational
critical_path: false
related: [CLAUDE.md, ROADMAP.md, GOVERNANCE.md]
---

# Decisions & Direction

**What this is:** Single source of truth for all business decisions — what we decided, why, when, and current status.

**When to update:** Whenever a meaningful decision is made or reversed. Always add new decisions at the top.

**Last updated:** 2026-09-11  
**Owner:** Tyler (final call), Claude (documentation)

---


## Decisions of 2026-09-18 (spec export applied; these override anything below)

Ruled = Tyler decided. Provisional = my recommendation applied, easy to reverse (IDs refer to `RECONCILIATION_LOG.md`).

| # | Decision | Status |
|---|---|---|
| 1 | The spec export (19 systems + agent registry) is authoritative over older workspace docs. | Ruled |
| 2 | Owner is **Tyler**. | Ruled |
| 3 | Pricing: Micro $149/mo or $499, SMB $249/mo or $799, Mid-Market $399/mo or $1,299; annual = 10x monthly. Prices rise soon after launch; billing keeps versioned price IDs and a launch-cohort flag (D02). | Ruled / provisional |
| 4 | **Mid-Market paused ~12 months:** shown on the website and pricing, nothing built. | Ruled |
| 5 | ICP is SMB on the existing design system; Micro templates next. | Ruled |
| 6 | Demo = the built site plus the tier's dashboard (sandbox). SEO/GEO Layer 1 is in every tier (D26). | Ruled / provisional |
| 7 | Hosting: static sites on Cloudflare; platform on Supabase; backend containerized on Railway now, Cloud Run later (D10-D12). After conversion, sites move to our hosting or the client's. | Ruled / provisional |
| 8 | Claude Pro for build and operator work; Claude API only for unattended real-time steps, **capped $30/mo pre-revenue** (D14). | Ruled |
| 9 | English-only launch; Spanish stays in the template as an opt-in fast follow (D15). | Ruled |
| 10 | Phase 1 re-baselined to the platform launch; the 5 drafted emails are on hold (D42). | Ruled |
| 11 | Lead agents and their infrastructure are built together from the start. | Ruled |
| 12 | One CRM at launch (HubSpot first, D22); Stripe with manual dunning first; Google plus email/password auth; compliance docs plus lawyer review before first charge. | Ruled / provisional |
| 13 | No hiring until Tyler says (about $150K annual profit) (D06). | Ruled |
| 14 | Provisional: Offboard replaces Ownership (D04), no free trial (D03), 90-day demos (D30), QA floors 80/90 demo and 90 live (D31), email-only outreach (D33), 24-48 h published support (D37), pre-selected tier (D28). | Provisional |
| 15 | Orchestration between phases is parked until most of the platform exists; today handoffs run through Tyler and documents. | Ruled |
| 16 | Open items from System 01 still undecided: spend-approval thresholds, tool sunset policy, CAC/LTV targets, multi-year projections, hire-onboarding budget, remote-hiring policy. | Open |
| 17 | **Rebrand: "BuildFlow" → "Fornax" (tagline "Ops Suite"), 2026-09-22.** "BuildFlow" was taken by too many other companies. Applies everywhere the brand name appears in content, docs, code identifiers, legal/pricing text, website copy, and the GitHub repo name. **Exception: the local folder path stays `~/BuildFlow`** — not renamed, per Tyler's explicit instruction. Domains not yet owned; new domain plan needed once purchased (was `buildflow.io`/`buildflow.com`/`buildflowsites.com`, D32). | Ruled |

Risk register: `docs/RISKS.md`. LLM cost plan: `docs/LLM_COST_AND_API_PLAN.md`.

---

## Earlier decisions (pre-spec). Entries marked SUPERSEDED no longer apply.

## Current Decisions (In Effect at the time)

### Delivery Model: Two-Tier Pricing
**Date decided:** 2026-09-10  
**Status:** ❌ SUPERSEDED 2026-09-18 by the spec pricing (decisions 3 and 14 above)  
**Owner:** Tyler  

**Decision:**
- **Managed Growth:** $99/month (recurring)
  - We host, maintain, SEO, handle updates
  - Client never touches code
  - Cancel anytime
  - Annual discount available ($990/yr)
- **Ownership:** $497 one-time
  - Static export to their own host
  - 1 month transition support
  - Then client owns maintenance
  - Lower price, no recurring revenue

**Why:** Market research showed service businesses want recurring bills (familiarity) OR ownership (control). Two tiers let prospects choose. Managed Growth is primary (higher LTV, recurring), Ownership is fallback.

**Rationale:** $99/mo is 30–50% less than hiring a web dev ($200–400/mo); $497 is fair for one-time work (vs. $2k+ custom builds). Pricing validated against competitors and service-business budgets.

**Impact:** Sales pitch leads with $99/mo; Ownership is downsell if prospect refuses recurring. All legal, website, and outreach docs reference both.

---

### Design System: One System, Not Two
**Date decided:** 2026-09-11  
**Status:** ✅ ACTIVE  
**Owner:** Claude (architectural), Tyler (approved)  

**Decision:**
The design system has ONE branch point: **logo-first** (`existing-identity` vs `generated-identity`).
- **existing-identity:** Business has a logo/brand → we extract colors from it, don't override
- **generated-identity:** No usable brand → we invent an identity for them
- All other decisions (hero style, typography, density) flow from this single choice

**Why:** We had two competing systems: `design-decision-engine.ts` (elaborate categorization) and `conditional-features.ts` (simple rules). The elaborate one was never imported. Real system uses simple rules + hand-set brand tokens.

**What changed:** Archived the elaborate engine. Kept the simple one as truth. This is clearer, simpler, and actually runs production.

**Impact:** New clients only need one config field (`media.source`). QA gate checks it. Template picks colors based on it.

---

### QA Gate: 9 Checks (7 Implemented, 2 Deferred)
**Date decided:** 2026-09-11  
**Status:** ⚠️ PARTLY SUPERSEDED 2026-09-18: keep the checks; thresholds and EN/ES follow the spec (decision 14 above)  
**Owner:** Claude  

**Decision:**
Every generated site must pass QA before showing to customer:

**Implemented (7 checks):**
1. ✅ Schema validation (all required fields present, types correct)
2. ✅ No placeholder text (lorem ipsum, TODO, TBD, [brackets], etc.)
3. ✅ Required content (name, phone, services, reviews, areas)
4. ✅ Internal links valid (no 404s)
5. ✅ Lighthouse budget (100 perf, 100 a11y, 100 SEO)
6. ✅ Layout sanity (no text overflow, responsive works)
7. ✅ Build compiles (Astro build succeeds)

**Deferred to Phase 2 (2 checks):**
- ⏳ LLM rubric (visual quality review via Claude)
- ⏳ Form submission test (actually submit contact form)

**Why:** Phase 1 is scrappy. Human eyes + these 7 checks catch 95% of issues. LLM rubric adds overhead we don't need yet. Form submission requires email integration we'll add in Phase 2.

**Impact:** `npm run qa -- --client [slug]` is the blocking check before any customer sees a site.

---

### Sales Model: Human-Driven Close
**Date decided:** 2026-09-11  
**Status:** ✅ ACTIVE as the high-touch path (the spec adds a self-serve path)  
**Owner:** Tyler  

**Decision:**
- **Discovery (automated):** AI agents find candidate businesses
- **Outreach (automated):** AI agents send emails at scale
- **First reply (human):** Tyler responds and takes calls
- **Close (human):** Tyler closes the deal, signs them up
- **Build & launch (automated):** System generates site, runs QA, hands off

**Why:** AI is great at discovery and outreach (volume). Humans close better (trust, objection handling, customization). Hybrid model scales.

**Impact:** Tyler's time is on sales calls Thu–Fri, not on discovery. Everything else automates. Phase 1 target: 5 closes/month at this model.

---

### Phase 1 Target: 5 Closes by 9/30
**Date decided:** 2026-09-11  
**Status:** ❌ SUPERSEDED 2026-09-18, re-baselined to the platform launch (decision 10 above)  
**Owner:** Tyler  

**Decision:**
Phase 1 = send 5 personalized emails to real prospects, close at least 5 by month-end.

**Roadmap:**
- **9/11–9/12:** Tyler completes setup blockers (Calendly, Stripe, email, domain)
- **9/16 9 AM:** Send 5 emails to Phoenix HVAC contractors
- **9/18–9/19:** Monitor opens/clicks
- **9/20 (Fri):** Sales calls expected, close 1–2 deals
- **9/23–9/27 (Mon–Fri):** Build customer sites
- **9/27–9/30:** Launch, collect revenue

**Why:** 5 closes validates the full pipeline (discovery → close → build → launch) and generates first revenue. Timing aligns with month-end reporting.

**Impact:** Everything else is scoped to support this. No feature creep, no delays.

---

## Decisions Made & Superseded

### [2026-09-10] Pricing: Old Model (Rejected)
**Status:** ❌ SUPERSEDED by "Two-Tier Pricing" (2026-09-10)

**What we considered:** Single tier at $199/month.  
**Why we rejected it:** Market research showed 40% of prospects want ownership, not recurring. Missed revenue opportunity.  
**Current decision:** Two tiers ($99/mo recurring + $497 one-time).

---

### [2026-09-01] Design System: Two Competing Engines
**Status:** ❌ SUPERSEDED by "One System" (2026-09-11)

**What we had:** `design-decision-engine.ts` (elaborate) + `conditional-features.ts` (simple).  
**Why it failed:** The elaborate one was never wired into any real component. We were maintaining two systems for the cost of one.  
**Current decision:** Archive the elaborate one, keep the simple one as single source of truth.  
**Action:** Moved to `archive/decisions/`.

---

## How to Add a New Decision

1. **Identify the choice** — What's the question? What options are there?
2. **Discuss tradeoffs** — What does each option gain/lose?
3. **Decide** — Tyler (product/go-to-market) or Claude (technical) makes the call
4. **Document** — Add to "Current Decisions" section above with:
   - Date decided
   - Decision (what we're doing)
   - Why (rationale, tradeoffs)
   - Status (active, deferred, pending)
   - Owner (who decided)
   - Impact (what changes as a result)
5. **Implement** — Update affected docs (CLAUDE.md, architecture, pitch, sales, etc.)
6. **Track** — If the decision is reversed later, move it to "Superseded" section

---

## Current Open Questions (Not Decided Yet)

| Question | Impact | Next Step |
|----------|--------|-----------|
| Should we hire a second person? | Cost, scaling velocity | Not until Tyler says (~$150K annual profit) |
| Which trade vertical next after HVAC? | Go-to-market focus | Market sizing research (Q4) |
| Should we build design iteration UI? | Feature scope, complexity | MVP feedback from first 5 customers |
| How do we handle payment failures? | Retention, cash flow | Post-Phase 1 (likely Nov) |

---

**Last updated:** 2026-09-11  
**Archive:** Decisions moved to `archive/decisions/` when superseded  
**Next review:** 2026-10-01 (monthly)
