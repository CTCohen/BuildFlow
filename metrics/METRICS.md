---
title: Metrics
purpose: Documentation for METRICS.md
status: draft
owner: c.t.cohen
updated: '2026-09-18'
tier_scope: all
phase: operational
---

# Metrics & KPIs

> Rebuilt 2026-09-18 from the business model (Parts 3, 8, 9), System 01, System 13 and System 18. Update monthly (1st Friday review). Owner: Tyler; tracking by loops (`operations/LOOPS.md`).

## Financial targets
| Metric | Target | Source |
|---|---|---|
| Gross margin | 90%+ (planning: 92-95% using System 01 cost to serve) | System 01 |
| Platform budget | $50/mo until first $500 MRR, then flexible to $100; API cap $30/mo | System 01, D14 |
| CAC | Under $50 per customer; Micro up to $894 at a 6-month payback | Systems 01, 07 |
| Demo to customer conversion | 2-5% assumed; validate in months 1-3 (if under 2%, demo cost exceeds LTV) | Business model |
| Monthly churn | 8% or better | Business model |
| Lead-scoring accuracy | 80%+; recalibrate if misclassification exceeds 20% | Business model |
| Hiring gate | None until Tyler says (about $150K annual profit) | Tyler |

## Revenue projection, re-cut for Micro and SMB only
The spec's Month 1/3/6/12 projection (5 / 15 / 35 / 75 customers; $1.2k / $3.5k / $8.3k / $17k MRR) assumed a 40/40/20 Micro/SMB/Mid-Market mix. With Mid-Market paused, a 50/50 Micro/SMB mix averages about $199 per customer:
| Month | Customers | MRR (50/50 mix) |
|---|---|---|
| 1 | 5 | ~$1,000 |
| 3 | 15 | ~$3,000 |
| 6 | 35 | ~$7,000 |
| 12 | 75 | ~$14,900 |
Prices will rise after launch, so treat these as a floor. Recompute when the price increase is decided.

## Operational (launch gate and after)
| Metric | Target |
|---|---|
| Demo generation | Under 10 s per site; first-pass QA rate tracked |
| Payment to live | Under 60 s |
| CRM sync | Latency under 5 min; success above 99% |
| Uptime | 99.5% monthly |
| Demo QA | Lighthouse at least 80 to ship a demo; live sites at least 90 |
| Email health | Bounce under 5%, complaint under 0.1%; pause at 5% spam |
| Agent quality | Task completion rate and human override rate per agent (registry Section D) |
| LLM spend | Per-agent monthly cap; total under $30/mo pre-revenue |

## Customer
Health score 0-100 (engagement 40%, payment 30%, retention 20%, growth 10%); 80+ healthy, 60-79 at risk, under 60 churning. Contact-form submission rate above 2%. NPS after 30 days.

## Funnel (weekly pipeline report)
Leads scored, emails sent, open rate, click rate, demo view rate, conversion rate, CAC, best template/vertical/location.

## Status (2026-09-18)
Pre-launch. No customers, no revenue. Phase 1 was re-baselined to the platform launch; see `ROADMAP.md`.

---

## Superseded metrics dashboard (2026-09-12)

# Metrics & KPIs

**Purpose:** Dashboard of business health — financial, operational, customer.

**Updated:** Monthly (or as data arrives)  
**Owner:** Tyler (data collection), Claude (tracking)  
**Last updated:** 2026-09-11

---

## Financial (Monthly)

| Metric | Target (9/30) | Actual (Sep) | Status | Notes |
|--------|-------|--------|--------|-------|
| **Revenue** | $495+/mo MRR | $0 | 🔴 Pending closes | 5 closes × $99/mo = $495 MRR |
| **Gross margin** | 80%+ | TBD | ⏳ Post-close | Estimated: $495 rev - $50 cost (hosting) = $445 / $495 = 90% |
| **Customer acquisition cost (CAC)** | <$100 | TBD | ⏳ Post-close | Time investment / close rate = CAC |
| **Breakeven** | 10 customers | 10 | 📋 Calculated | 10 × $99/mo = $990/mo; est. $500/mo opex = breakeven |
| **Payback period** | 2–3 months | TBD | ⏳ Post-close | CAC / monthly margin |

---

## Operational (Phase 1 Targets)

| Metric | Target | Status | Notes |
|--------|--------|--------|-------|
| **Time: inquiry → close** | 3–5 days | ⏳ Testing Mon | Monday send, Friday calls expected |
| **Time: close → site live** | 3–7 days | ✅ Proven | Build: 15 min, QA: 10 min, approval: 2 days |
| **Website uptime** | 99.5% | ✅ Guaranteed | Railway SLA, Cloudflare CDN |
| **Prospect open rate** | 35–40% | ⏳ Testing Mon | Proven in cold email research |
| **Prospect click rate** | 20–30% (of opens) | ⏳ Testing Mon | Portfolio link + Calendly link |
| **Calendly booking rate** | 10–20% (of clicks) | ⏳ Testing Mon | Low friction = higher conversion |
| **Sales close rate** | 50–70% | ⏳ Testing Fri | Personalized outreach typically 40–60% |
| **Build quality (QA pass)** | 100% | ✅ 7/9 checks | Automated gate blocks bad quality |

---

## Customer Metrics (Post-Launch)

| Metric | Target | Status | Notes |
|--------|--------|--------|-------|
| **Churn rate** (monthly) | <5% | ⏳ TBD | Too early; need 10+ customers |
| **Net revenue retention** | 100%+ | ⏳ TBD | Do customers expand or stay flat? |
| **Customer satisfaction (NPS)** | 50+ | ⏳ TBD | Post-launch survey |
| **Time to value** | Day 7 (launch) | ✅ By design | Site goes live 7 days after close |

---

## Logs & Historical Data

| Period | Revenue | Closes | Builds | Launches | Notes |
|--------|---------|--------|--------|----------|-------|
| **2026-09** | $0 | 0 (target: 5) | 0 | 0 | Phase 1 execution starts Mon 9/16 |
| 2026-10 | — | — | — | — | *TBD* |
| 2026-11 | — | — | — | — | *TBD* |

See `logs/` folder for monthly & weekly summaries.

---

## Breakdown: Unit Economics

**Cost per customer:**
- Hosting (Railway): ~$10/month per customer
- Email/SMS (SendGrid/Twilio): ~$2/month per customer
- Cloudflare: ~$1/month per customer
- **Total COGS: ~$13/month per customer**

**Managed Growth ($99/mo):**
- Revenue: $99/month
- COGS: $13/month
- Gross profit: $86/month = 86.8% margin
- Payback period: CAC / $86/month (if CAC = $100 → 1.2 months)

**Ownership ($497 one-time):**
- Revenue: $497 one-time
- COGS: $50 (one-time hosting setup, export)
- Gross profit: $447 = 89.9% margin
- Payback period: Immediate (no monthly costs)

**Blended (if 4 MG, 1 Ownership):**
- Monthly recurring: 4 × $99 = $396
- One-time: 1 × $497 = $497 (divide by lifetime: month 1 = $497, months 2+ = $0)
- Average: ($396 + $497/12) / 5 ≈ $114/customer (month 1 blended)

---

## Assumptions (Validation Needed)

| Assumption | Current | Validated? | Impact if Wrong |
|-----------|---------|-----------|-----------------|
| 35–40% open rate on cold email | Market avg | ⏳ Testing Mon | If 10% → need 50 sends, not 5 |
| 50–70% close rate on calls | Typical B2B | ⏳ Testing Fri | If 20% → need 25 calls, not 5 closes |
| 7-day build + launch time | Proven in QA | ✅ Verified | Lower risk |
| $99/mo is right price | Market research | ⏳ Validation | If too high → lower close rate |
| No churn in month 1–2 | Assumption | ⏳ TBD | Affects LTV calculation |

---

## Phase 1 Success Criteria

**DONE = TRUE if:**
- ✅ 5+ closes by 9/30
- ✅ 5+ sites live by 9/30
- ✅ $495+/mo MRR by 9/30
- ✅ 0 major outages
- ✅ 0 customer complaints re: quality

**If ANY above fail → retrospective → Phase 2 plan adjustment**

---

## Next Steps

**Before Monday 9 AM send:**
- [ ] Verify Calendly booking target (35–40% open rate assumption)
- [ ] Confirm close rate on calls (50–70% assumption)
- [ ] Track first week: opens, clicks, bookings

**After first close:**
- [ ] Calculate actual CAC (time spent / close rate)
- [ ] Measure build time (should be ≤7 days)
- [ ] Get customer feedback (quality, onboarding smooth?)

**Monthly (by 10/1):**
- [ ] Update financial metrics with actual revenue
- [ ] Calculate churn (if anyone churns in month 1)
- [ ] Review operational metrics vs. targets
- [ ] Update `logs/2026-09.md` with month-end summary

---

**Owner:** Tyler (data), Claude (reporting)  
**Last updated:** 2026-09-11  
**Next update:** 2026-10-01 (monthly) or as closes come in
