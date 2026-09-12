# Tier Build Plan — What Needs to be Built

**Comprehensive roadmap for bringing all three tiers to production.**

---

## Overview

To launch and scale three tiers (Micro, SMB, Mid-market), we need to build infrastructure, automate tier qualification, and differentiate products. This plan tracks all work required.

---

## 1. Tier Qualification & Lead Warehouse

### 1.1 Google API Integration (Micro Tier Qualifier)

**What:** Auto-detect business size from Google Business Profile

**Why:** Micro customers are small (soloprenuers, <$500k revenue). We can use Google signals to pre-qualify prospects without manual assessment.

**Work required:**
- [ ] Set up Google My Business API access
- [ ] Build scraper: business_size_detector.ts
  - Extract: revenue signals, employee count, service areas, review count
  - Logic: If <$500k revenue + <5 services + <50 reviews → likely Micro
- [ ] Integration: When prospect fills out inquiry form, auto-detect tier
- [ ] Validation: Test on 100+ known prospects to calibrate thresholds
- [ ] Documentation: Tier detection logic + edge cases

**Owner:** Claude (implementation), Chase (validation)  
**Timeline:** Phase 2 (Oct)  
**Blocking:** No, Micro can launch with manual tier assignment first

---

### 1.2 Lead Warehouse Trifurcation

**What:** Separate lead buckets for Micro / SMB / Mid-market

**Why:** Different sales strategies, different contact patterns. Need to track conversion per tier.

**Current state:** REAL_PROSPECTS_READY_TO_SEND.md has 5 SMB prospects (Phoenix HVAC)

**Work required:**
- [ ] Create three prospect lists in outreach/:
  - `PROSPECTS_MICRO.md` — Solopreneurs, new contractors (target: high volume)
  - `PROSPECTS_SMB.md` — Established contractors (current, 5 Phoenix HVAC)
  - `PROSPECTS_MID_MARKET.md` — Enterprise/multi-location (target: long sales cycle)
- [ ] Prospect qualification template (per tier) showing why each prospect fits their tier
- [ ] Prospecting strategy per tier (how we find Micro vs. Mid-market)
- [ ] Lead scoring model (what signals indicate each tier?)
- [ ] CRM integration (Airtable or Linear: track prospect → tier → close)

**Owner:** Chase (discovery + qualification), Claude (infrastructure)  
**Timeline:** Phase 1 (SMB), Phase 2 (add Micro), Phase 3 (add Mid-market)  
**Blocking:** No for Phase 1 (manual lists work), yes before scaling to 50+ prospects/week

---

## 2. Website & Dashboard Feature Differentiation

### 2.1 Website Features per Tier

**What:** Website feature sets vary by tier

| Feature | Micro | SMB | Mid-market |
|---------|-------|-----|-----------|
| Pages | 5–7 | 10–15 | Unlimited |
| Services per site | 2–3 | 5–10 | Unlimited |
| Services portfolio (before/after) | No | Optional | Yes |
| Team bios | No | Optional | Yes |
| Blog | No | No | Yes |
| Testimonials | 2–3 required | 5+ | Unlimited |
| Custom fields | No | No | Yes |
| API integrations | No | No | Yes (CRM, calendar, etc.) |
| Custom CSS override | No | No | Yes |

**Work required:**
- [ ] Feature flags in schema.mjs per tier (control which features render)
- [ ] QA gate per tier (different pass criteria)
- [ ] Build pipeline differences (Micro: 3–4 days, SMB: 5–7, Mid: 10–14)
- [ ] Content templates per tier (what content is required/optional)

**Owner:** Claude (implementation)  
**Timeline:** Phase 2 (Micro features), Phase 3 (Mid-market features)  
**Blocking:** Phase 1 is SMB only (already built)

---

### 2.2 Dashboard Features per Tier

**What:** Self-service dashboard capabilities vary by tier

| Feature | Micro | SMB | Mid-market |
|---------|-------|-----|-----------|
| View submissions | ✅ | ✅ | ✅ |
| Edit hours | ✅ | ✅ | ✅ |
| Edit services | ✅ | ✅ | ✅ |
| Upload photos | ✅ | ✅ | ✅ |
| Add testimonials | No | ✅ | ✅ |
| View analytics | No | Basic | Advanced |
| Edit design (colors, fonts) | No | No | ✅ |
| Custom fields | No | No | ✅ |
| Multi-user access | No | No | ✅ |
| API access | No | No | ✅ |

**Work required:**
- [ ] Build dashboard (currently doesn't exist)
  - View-only tier (Micro)
  - Self-service edit tier (SMB)
  - Full customization tier (Mid-market)
- [ ] Authentication & multi-user roles
- [ ] Analytics integration (Google Analytics, Stripe data)
- [ ] Form submission tracking

**Owner:** Claude (implementation)  
**Timeline:** Phase 2 (Micro/SMB dashboards), Phase 3 (Mid-market full dashboard)  
**Blocking:** Yes for recurring revenue (can't support Managed Growth without dashboard edits)

---

## 3. Pricing & Value Justification

### 3.1 Unit Economics per Tier

**What:** Validate pricing makes sense per tier

**Current pricing:**
- Micro: $49/mo or $297 (estimated 63% margin)
- SMB: $99/mo or $497 (estimated 68% margin)
- Mid-market: $299/mo or $1,497 (estimated 73% margin)

**Work required:**
- [ ] Validate Micro CAC (how much does it cost to acquire a Micro customer?)
- [ ] Measure SMB churn rate (do they stay $99/mo long-term?)
- [ ] Estimate Mid-market sales cycle length (3-month average?)
- [ ] LTV calculation per tier (CAC payback period)
- [ ] Gross margin per tier (build cost, hosting, support)
- [ ] Capacity constraint (how many customers can Chase support at each tier?)

**Owner:** Chase (data collection), Claude (analysis)  
**Timeline:** Phase 1 (collect SMB data), Phase 2+ (add Micro/Mid data)  
**Blocking:** No for Phase 1, but important before scaling

---

### 3.2 Feature Justification per Tier

**What:** Explain why each feature is worth the price difference

**Example:**
- "Micro: $49/mo because we auto-generate design (no custom work)"
- "SMB: $99/mo because we extract your brand + custom QA + monthly support"
- "Mid-market: $299/mo because we build unlimited custom + white-label dashboard + dedicated support"

**Work required:**
- [ ] Feature matrix (what does each tier get?)
- [ ] Cost-to-build per feature (logo extraction: $X, dashboard: $X, custom CSS: $X)
- [ ] Customer willingness-to-pay research (ask prospects: "Is $99 worth this?")
- [ ] Competitive positioning (why is our $99 better than competitors' $150?)
- [ ] Sales script per tier (how to justify pricing in calls)

**Owner:** Chase (sales validation), Claude (cost analysis)  
**Timeline:** Phase 1 (SMB), Phase 2+ (Micro/Mid justification)  
**Blocking:** No for Phase 1 (pricing set), but important for Phase 2+ expansion

---

## 4. Market Research & Business Logic per Tier

### 4.1 Micro-Tier Market Research

**What:** Understand Micro market (solopreneurs, new contractors)

**Work required:**
- [ ] TAM: How many solopreneurs in our verticals?
  - HVAC: ~50,000 in US
  - Plumbing: ~100,000
  - Electrical: ~80,000
  - Total Micro TAM: ~230,000+
- [ ] Willingness to pay research (survey 50+ solopreneurs)
  - "Would you pay $49/mo for a professional site?" → What % say yes?
  - "What features matter most?" → Speed? Design? Simplicity?
- [ ] Churn risk analysis (solopreneurs churn faster — how much?)
  - Hypothesis: 10% monthly churn (high) vs SMB 2% (low)
- [ ] CAC feasibility (can we acquire Micro customers for <$100?)
  - Hypothesis: Cold email open rates lower, need higher volume

**Owner:** Claude (research), Chase (validation)  
**Timeline:** Phase 2 (early Oct, before Micro launch)  
**Blocking:** Yes for Micro launch decision (if CAC > LTV, we don't launch)

---

### 4.2 SMB-Tier Market Research (Ongoing)

**What:** Validate SMB market assumptions (Phase 1 launch)

**Work required:**
- [ ] TAM: Confirmed number of established contractors
  - HVAC: ~200,000 in US
  - Plumbing: ~300,000
  - Electrical: ~250,000
  - Total SMB TAM: ~750,000+
- [ ] Willingness to pay (launched, measuring in Phase 1)
  - First 5 closes will tell us: do they accept $99/mo?
- [ ] Churn analysis (after 3 months of customers)
  - Hypothesis: 2% monthly churn
- [ ] CAC from Phase 1
  - 5 closes from 5 emails = 100% close rate (likely won't repeat)
  - Real CAC = time spent + follow-ups

**Owner:** Chase (data), Claude (analysis)  
**Timeline:** Phase 1 (ongoing measurement)  
**Blocking:** No (we launch regardless), but data informs Phase 2 strategy

---

### 4.3 Mid-Market Research (Future)

**What:** Enterprise market positioning and go-to-market

**Work required:**
- [ ] TAM: Number of multi-location contractors
  - HVAC franchises: ~5,000
  - Multi-location plumbing: ~3,000
  - Total Mid-market TAM: ~8,000–10,000
- [ ] Sales cycle research (how long does closing take?)
  - Hypothesis: 3–6 weeks (vs. SMB 3–5 days)
- [ ] Feature requests (what do enterprises actually want?)
  - White-label dashboard?
  - API integrations?
  - Multi-team management?
- [ ] Competitive landscape (who else serves this segment?)
  - Unacast? ServiceTitan? Other vertical SaaS?

**Owner:** Chase (strategic research)  
**Timeline:** Phase 2–3 (research during Phase 2, launch Phase 3)  
**Blocking:** No for Phase 1

---

## 5. Product Feature Development Timeline

### Phase 1 (Now – 9/30)
**Launch:** SMB tier only

**Done:**
- ✅ SMB design system (5 hero styles, 3 fonts, brand extraction)
- ✅ SMB website (build + QA)
- ✅ SMB pricing ($99 or $497)
- ✅ SMB sales (5 prospects identified)

**Not needed yet:**
- ❌ Dashboard (can do manual edits for now)
- ❌ Google API tier detection
- ❌ Micro/Mid-market features

---

### Phase 2 (Oct)
**Launch:** Micro tier + infrastructure

**To build:**
- [ ] Dashboard (view-only for Micro, self-service for SMB)
- [ ] Google API tier detection
- [ ] Lead warehouse trifurcation
- [ ] Micro website features (simpler version)
- [ ] Micro design system (1 hero, 1 font)
- [ ] Micro sales strategy

**Research:**
- [ ] Micro TAM + CAC
- [ ] SMB data from Phase 1 (closes, churn, feedback)

---

### Phase 3 (Nov+)
**Launch:** Mid-market tier + enterprise features

**To build:**
- [ ] Dashboard full customization (design editor, API access)
- [ ] Mid-market website features (unlimited pages, custom fields, integrations)
- [ ] Mid-market design system (component builder, custom CSS)
- [ ] Mid-market sales process (longer cycle, consultation)

**Research:**
- [ ] Mid-market TAM + competitive landscape
- [ ] Enterprise feature validation

---

## 6. Dependencies & Blockers

### Critical Path to Multi-Tier Success

```
Phase 1: Launch SMB (done/ready)
    ↓
Phase 1: Collect SMB data (ongoing)
    ↓
Phase 2: Build dashboard (blocks Micro/SMB self-service)
    ↓
Phase 2: Launch Micro tier
    ↓
Phase 2: Validate Micro CAC & churn
    ↓
Phase 3: Build enterprise features (dashboard customization, APIs)
    ↓
Phase 3: Launch Mid-market tier
    ↓
Scale: Automate tier detection (Google API)
    ↓
Scale: Multi-tier sales & support playbook
```

### Hard Blockers

| Item | Impact | Timeline |
|------|--------|----------|
| Dashboard doesn't exist | Can't do SMB self-service edits (manual only) | Phase 2 (Oct) |
| Micro features not built | Can't launch Micro with full feature parity | Phase 2 (Oct) |
| Mid-market customization not built | Can't serve enterprise customers | Phase 3 (Nov) |
| Lead warehouse not trifurcated | Can't manage 50+ prospects/week efficiently | Phase 2 (Oct) |

---

## Work Items Checklist

### Phase 1 (Now)
- [x] Workspace structure (three tiers documented)
- [x] Pricing & positioning (documented)
- [x] SMB design system (built)
- [x] SMB website (built)
- [ ] **Dashboard** (view-only minimum needed)

### Phase 2 (Oct)
- [ ] **Dashboard full build** (view-only Micro, self-service SMB)
- [ ] Micro design system (stub → implement)
- [ ] Micro website features (stub → implement)
- [ ] Google API tier detection (new)
- [ ] Lead warehouse trifurcation (new)
- [ ] Market research: Micro TAM + CAC
- [ ] SMB data analysis (closes, churn, LTV)

### Phase 3 (Nov+)
- [ ] **Mid-market dashboard** (full customization)
- [ ] Mid-market website features (stub → implement)
- [ ] Mid-market design system (stub → implement)
- [ ] Market research: Mid-market TAM + competitors
- [ ] Enterprise sales playbook

---

## Owner Assignment

| Work | Owner | Priority |
|------|-------|----------|
| Dashboard build | Claude | 🔴 CRITICAL (Phase 2) |
| Micro tier build | Claude | 🟡 HIGH (Phase 2) |
| Mid-market tier build | Claude | 🟡 HIGH (Phase 3) |
| Market research | Chase | 🟡 HIGH (inform strategy) |
| Lead warehouse | Chase | 🟡 HIGH (manage prospects) |
| Google API integration | Claude | 🟢 MEDIUM (automation, Phase 2+) |
| Sales playbooks | Chase | 🟢 MEDIUM (Phase 2–3) |

---

**Last updated:** 2026-09-12  
**Next review:** 2026-10-01 (after Phase 1 closes, before Phase 2 planning)
