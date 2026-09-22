---
title: Pricing
purpose: Documentation for PRICING.md
status: draft
owner: c.t.cohen
updated: '2026-09-18'
tier_scope: all
phase: operational
---

# Pricing

> Rebuilt 2026-09-18 from System 01, System 05, System 08 and the business model. **Prices will rise soon after launch** (Tyler): billing keeps
> versioned price IDs and a `launch_cohort` flag so early customers can be grandfathered. Increase timing and numbers: `RECONCILIATION_LOG.md` D02.

## The offer (locked)
| Tier | Managed (monthly) | Managed (annual, 10x monthly) | Offboard (one-time) | Target customer |
|---|---|---|---|---|
| **Micro** | $149/mo | $1,490/yr (saves $298) | $499 | Solo contractors, under 3 employees |
| **SMB (ICP)** | $249/mo | $2,490/yr (saves $498) | $799 | Established trades, 3-20 employees, $250k-$5M revenue |
| **Mid-Market** | $399/mo | $3,990/yr (saves $798) | $1,299 | **Paused ~12 months.** Shown on the site and here, not built |

- **Prescriptive tier:** lead scoring assigns the tier; a prospect sees only their tier. If misclassification exceeds 20%, recalibrate scoring; never offer a choice.
- **No free trial.** Payment happens at conversion; the site is live in about a minute. (Earlier "first 3 free" pilots are retired unless Tyler reinstates them as a soft-launch cohort.)
- **Managed:** we host and maintain, SEO, CRM sync (SMB), support. **Offboard:** the customer takes domain ownership plus docs and videos; no ongoing support.
- **Annual:** "2 months free" (~16.7% off), single payment, **non-refundable and not prorated** on cancellation; access stops at cancellation. Monthly plans get a 30-day pro-rata refund; full refund for billing error or a 24+ hour unplanned outage (reported within 7 days).
- Offboard = about 3.2-3.3 months of Managed; annual = 10 months of Managed.

## Unit economics (System 01, conservative)
| Tier | Monthly cost to serve | Managed margin | Offboard margin |
|---|---|---|---|
| Micro | $11 | 92.6% | 99.6% |
| SMB | $16 | 93.6% | 99.75% |
| Mid-Market | $21 | 94.7% | 99.85% |
The infrastructure model (System 03) implies $4/$5/$8 (97-98%); plan with the conservative numbers until real cost is measured.
Design generation is amortized at about $2 per site. CAC must stay under $50 per customer; Micro CAC up to $894 is acceptable at a 6-month payback. Demo conversion (assumed 2-5%) is the one variable the model depends on.

## Positioning
Premium, not a cheaper Wix: trade-specific design, built-in WCAG 2.1 AA, automated review aggregation, CRM integration, done-for-you generation.
| | Fornax | ServiceTitan | Jobber | Wix |
|---|---|---|---|---|
| Website | AI-generated, trade-specific | Basic landing page | Basic landing page | DIY |
| WCAG 2.1 AA | Built in | No | No | No |
| CRM integration | Yes (Phase 1 five) | Own CRM only | Own CRM only | No |
| Review aggregation | Automated | No | No | No |
| Price | $149-399/mo | $398+/mo | $49-349/mo | $10-30/mo |

## Price increase and grandfathering (spec plan; timing under review)
Spec plan: validate at launch prices, then after about 25 customers raise new-customer pricing (spec example $199/$349/$599) while the first 25-50 stay at launch pricing indefinitely; optional migration at first renewal (month 18-24) framed as added value. Tyler expects to raise prices sooner than the spec's Month 7, so the numbers and trigger are an open decision.

## Add-ons
Professional Redesign ($199 layout tweaks, $299 for 2-3 sections, $499 full custom) is human-executed; treated as a waitlist item (System 04 §8). The System 19 "Done-For-You Setup $99" add-on is dropped: done-for-you is the product.

---

## Superseded pricing document (2026-09-12, kept for history)

# Pricing Strategy

**Three-tier pricing model: Micro ($49/mo or $297), SMB ($99/mo or $497), Mid-market ($299/mo or $1,497).**

---

## Pricing Rationale

### Micro Tier ($49/mo MG or $297 Ownership)

**Unit economics:**
- Build cost: ~$150 (3–4 days @ $50/hr internally)
- Hosting cost: $8/month
- Support cost: $10/month (minimal)
- **Gross profit (MG):** $49 - $18 = $31/month (63% margin)
- **Payback period:** 5 months

**Market positioning:**
- Competitive with DIY builders (Wix $14/mo, Squarespace $12/mo)
- But includes human-designed site (not template)
- Premium to DIY, discount to custom agencies ($200–400/mo)

**Rationale:** Micro is high-volume, low-touch. $49 undercuts agencies, beats DIY on quality. Ownership ($297) is attractive to price-sensitive builders who want to own it.

---

### SMB Tier ($99/mo MG or $497 Ownership) ← PHASE 1 LAUNCH

**Unit economics:**
- Build cost: ~$300 (5–7 days @ $50/hr)
- Hosting cost: $12/month
- Support cost: $20/month (email + monthly call)
- **Gross profit (MG):** $99 - $32 = $67/month (67.7% margin)
- **Payback period:** 4.5 months

**Market positioning:**
- Competitive with mid-tier agencies ($100–150/mo)
- But includes brand extraction, design curation, SEO setup
- Ownership ($497) is 1/4 the cost of a custom build ($2k+)

**Rationale:** SMB is the Goldilocks tier. High willingness to pay (they have revenue), good margin, long LTV. $99/mo is familiar price point for business software (like Slack, Stripe, etc.). Ownership at $497 is attractive for businesses that want to own it but can't afford $2k.

---

### Mid-Market Tier ($299/mo MG or $1,497 Ownership)

**Unit economics:**
- Build cost: ~$600 (10–14 days @ $50/hr)
- Hosting + premium infrastructure: $30/month
- Support cost: $50/month (dedicated support + calls)
- **Gross profit (MG):** $299 - $80 = $219/month (73% margin)
- **Payback period:** 2.7 months

**Market positioning:**
- Competitive with boutique agencies ($300–500/mo)
- But includes white-label dashboard, unlimited customization, analytics
- Ownership ($1,497) is still 1/3 the cost of enterprise custom build ($5k+)

**Rationale:** Mid-market pays for control and customization. High LTV (likely 3–5 year retention), high margins. $299/mo is the "enterprise" price point. Ownership at $1,497 is attractive for large companies that want to own their site long-term.

---

## Comparison to Market

| Segment | DIY Builders | Agencies | Fornax |
|---------|-------------|----------|-----------|
| **Micro** | Wix $14–20/mo, Squarespace $12–18/mo | Not available | $49/mo (MG) or $297 (Ownership) |
| **SMB** | Weebly $50/mo, GoDaddy $100/mo | $100–200/mo (retainer) | $99/mo (MG) or $497 (Ownership) |
| **Mid-market** | Drupal $200/mo managed | $300–500/mo (retainer) | $299/mo (MG) or $1,497 (Ownership) |

**Fornax's edge:** Design quality (not template), brand extraction (not generic), human support (not ticket queue).

---

## Why Ownership Pricing?

**Ownership option (A) is 50–60% of annual Managed Growth (B):**
- Micro: $297 vs $49 × 12 = $588 (50%)
- SMB: $497 vs $99 × 12 = $1,188 (42%)
- Mid-market: $1,497 vs $299 × 12 = $3,588 (42%)

**Rationale:** Ownership requires one-time support (export, handoff, 2-week help). If we lose the recurring revenue, we need to recover the opportunity cost. 42–50% of annual revenue is standard for buying out recurring subscriptions.

---

## Pricing Psychology

**$49/mo (Micro):** Below the "small business software" threshold ($99+). Feels experimental, low commitment.

**$99/mo (SMB):** Standard SaaS price point (Slack, Stripe, HubSpot start here). Feels professional and familiar.

**$299/mo (Mid-market):** "Enterprise" price. Signals white-glove service. Buyers at this level expect premium support.

**One-time pricing:** 50% of annual pricing is anchor point buyers understand. Feels like "getting 6 months free."

---

## How Customers Choose

**Micro buyers:**
- "I'm new and just need leads" → Pick Micro
- Later graduate to SMB when they want professional branding

**SMB buyers (Phase 1 focus):**
- "I'm established and want to compete professionally" → Pick SMB
- Choose Managed Growth (recurring) if they value ongoing support/SEO
- Choose Ownership (one-time) if they want to own it outright

**Mid-market buyers:**
- "I want full control and analytics" → Pick Mid-market
- Choose Managed Growth (recurring) for white-label dashboard
- Choose Ownership (one-time) if they have internal ops team

---

## See Also

- **Delivery model (features per tier):** [DELIVERY_MODEL.md](DELIVERY_MODEL.md)
- **Design system per tier:** [DESIGN_SYSTEMS/](DESIGN_SYSTEMS/_OVERVIEW.md)
- **Sales pitch per tier:** [../sales/POSITIONING.md](../sales/POSITIONING.md)

---

**Last updated:** 2026-09-12  
**Owner:** Chase (final approval), Claude (documentation)
