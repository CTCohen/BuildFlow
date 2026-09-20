---
title: System 01 — Business Operations System
purpose: Unit economics, margin targets, financial modeling, budget guardrails, and hiring triggers across all growth stages
status: active
owner: c.t.cohen
updated: '2026-09-18'
version: 1.0.0
tier_scope: all
phase: phase_1
spec_name: 01-business-operations-system
spec_aliases:
- business model
- cost control
- scaling
- financial model
- hiring plan
spec_sources:
- chat
spec_authority: authoritative (exported from claude.ai project memory 2026-09-17)
---

> **Overrides (Tyler, 2026-09-18).** This spec is authoritative except where Tyler ruled otherwise (`RECONCILIATION_LOG.md`, `DECISIONS.md`):
> - Mid-Market is paused about 12 months: shown on the website and pricing, nothing built for it.
> - Hiring: none until Tyler says (about $150K annual profit). The customer-count hiring triggers (10/50/100/500) are alerts only.
> - Prices will rise soon after launch; keep versioned prices and a launch-cohort flag.
> - Claude Pro for build and operator work; Claude API only for unattended real-time steps, capped at $30/mo pre-revenue. The $50/mo platform budget excludes per-customer cost to serve and the Claude Pro plan.
> - Launch scope: English only, Micro and SMB, email-only outreach.


# System 01 — Business Operations System

## Purpose

Lock down unit economics, margins, financial projections, budget constraints, and hiring decisions—ensuring all operational choices stay within financial reality. This system governs pricing structure, infrastructure costs, margin targets, and hiring triggers—providing the guardrails that ensure BuildFlow remains financially viable as it scales from initial launch through 1,000+ sites/day.

## Contents

- Pricing structure and tier definitions
- Infrastructure costs per tier
- Gross margin calculations and analysis
- LTV and unit economics drivers
- Cost control and budget guardrails ($50/mo constraint)
- Break-even analysis and financial modeling
- Operational capacity and scaling walls
- Hiring triggers at 10, 50, 100, 500 customer stages
- Role definitions and responsibilities
- Contractor vs. FTE decision criteria
- Margin impact analysis per hire
- Decision gates and review cadence

## Specifications

### Pricing Structure (LOCKED)

| Tier | Managed (Monthly) | Offboard (One-Time) |
|---|---|---|
| **Micro** | $149/mo | $499 |
| **SMB** | $249/mo | $799 |
| **Mid-Market** | $399/mo | $1,299 |

**Pricing philosophy:** Premium positioning, not race-to-bottom. BuildFlow brings WCAG 2.1 AA compliance, trade-specific automation, CRM integration, and Done-For-You site generation. This is worth $150–$400/mo. Offboard price = 3–3.3 months of Managed cost (incentivizes long-term stickiness).

### Annual Billing Option — LOCKED

**Discount: "2 months free" (~16.7% off) — applies uniformly across all three tiers.** Annual price = 10x the applicable monthly rate (whichever monthly rate the customer is on -- new pricing or grandfathered launch pricing).

| Tier | Monthly | Annual (single payment) | Savings |
|---|---|---|---|
| Micro | $149/mo | $1,490/yr | $298 (16.7%) |
| SMB | $249/mo | $2,490/yr | $498 (16.7%) |
| Mid-Market | $399/mo | $3,990/yr | $798 (16.7%) |

**Cash flow impact:** annual prepay is a working-capital accelerant -- Tyler receives 10 months of revenue on day 1 instead of trickling in over 12 months. Materially helps the $50/mo bootstrap constraint and break-even timeline once annual adoption is non-trivial.

**Margin impact:** COGS is unchanged (same infrastructure cost regardless of billing cadence) and is a small fraction of price, so the 16.7% discount compresses gross margin only marginally (e.g., Micro: $124.17/mo effective revenue - $11/mo COGS = 91.1% margin, still comfortably above the 90% target).

**Cancellation policy:** Annual plans are non-refundable and non-prorated -- canceling mid-year forfeits the remaining prepaid period, and access stops immediately upon cancellation request (does not run through the paid year). This is a deliberate deviation from the monthly plan's 30-day pro-rata refund policy (System 08 Section 4) to maximize revenue certainty on the annual commitment. The two existing refund exceptions (BuildFlow billing error, extended unplanned service failure) still apply to annual plans -- this policy only removes the "changed my mind" refund path, not BuildFlow's own error accountability.

**Full billing implementation:** System 08 Section 7.

### Infrastructure Costs Per Tier

| Tier | Monthly Cost | Breakdown |
|---|---|---|
| **Micro** | $11/mo | $7 hosting + $5 DB + $1 monitoring (Zapier only) |
| **SMB** | $16/mo | $7 hosting + $5 DB + $1 monitoring + ~$3 CRM MCP overhead (5 integrations) |
| **Mid-Market** | $21/mo | $7 hosting + $5 DB + $1 monitoring + ~$8 CRM MCP overhead (10 integrations) |

### Gross Margin Analysis (LOCKED)

| Tier | Managed Margin | Offboard Margin |
|---|---|---|
| **Micro** | $149 – $11 = **92.6%** | $499 – $2 design = **99.6%** |
| **SMB** | $249 – $16 = **93.6%** | $799 – $2 design = **99.75%** |
| **Mid-Market** | $399 – $21 = **94.7%** | $1,299 – $2 design = **99.85%** |

Design generation cost amortized across 5,000+ sites = ~$2/site.

### Unit Economics Drivers

- **LTV driver:** Managed tier provides recurring revenue; Offboard tier funds acquisition costs
- **Conversion rate assumption:** Conservative estimate (low); to be validated post-launch. ROI model is sensitivity-dependent on this variable.
- **Churn sensitivity:** At 10% monthly churn, LTV becomes constrained; at 5% churn, model is healthy. CAC must be <$50/customer.
- **Margins:** 90%–99% across all tiers
- **Managed vs. Offboard:** Both available for all tiers. Managed provides ongoing support + SEO + CRM sync; Offboard = customer takes ownership

### Cost Control: $50/mo Constraint

BuildFlow operates under a hard $50/month spending constraint per system, regardless of infrastructure:

**Allocation Framework:**
- Cloud hosting + infrastructure: $35/month (70%)
- Third-party integrations (CRM, payment, monitoring): $10/month (20%)
- Reserve/contingency: $5/month (10%)

**Decision Rule:** If a new feature requires >$5/month incremental spend, existing features must be cut or consolidated.

**Current Setup:**
- Monthly budget: Hard cap at $50/mo until first $500 MRR, then flexible to $100/mo
- Cost tracking: Minimal; check balance and trim if depleting
- Monthly review ritual: 1st Friday of each month (30 min). Review budget, burn-down forecast, cost-saving triggers, hiring readiness.

### Break-Even Analysis

**Monthly Break-Even (Tyler solo):**
- Fixed costs: $0 (operating from home, no salary draw pre-launch)
- Variable cost/customer: $11–21 depending on tier
- Contribution margin/customer: $128–388 (managed) or $497–1,297 (offboard)
- **Break-even: Day 1** (marginal contribution positive immediately)

**Sustainability Break-Even (Tier 1 hire at 50 customers):**
- Fixed costs: $4,000–8,000/month (contractor or junior FTE)
- Blended contribution margin/customer: ~$250/month (assuming portfolio mix)
- **Break-even customer count:** 16–32 customers
- **At 50 customers:** $12,500/month contribution; with $6,000 hire = +$6,500/month profit

### Operational Capacity & Scaling Wall

**Tyler's Solo Capacity (hours per customer):**
- Initial onboarding: 2 hours (payment, domain setup, CRM connection, go-live)
- Monthly touch: 0.5 hours (success check, troubleshooting)
- Support requests: 0.5 hours/month average
- **Total: ~1 hour/customer/month in steady state**

**Hours Available:**
- 160 hours/month (40-hour work week)
- 80 allocated to product/systems/GTM (50%)
- **80 available for support = 80-customer capacity**

**The 100-Customer Wall:**
- At 100 customers, support needs 50–60 hours/month
- Plus ongoing features, bugs, monitoring, onboarding
- Result: Bottleneck. Must hire before hitting 100 customers.

**Operational Load Scaling:**
- 10 customers ≈ 8–10 hrs/mo
- 50 customers ≈ 20–25 hrs/week
- 100 customers ≈ 35–50 hrs/week

### Hiring Triggers & Cost Model

**Stage 1: 10 Customers → Support/Ops Hire ($0 co-founder or $2,000/mo contractor)**
- Trigger: 10+ support emails/week
- Role: Support, billing, onboarding, CRM troubleshooting
- Hours: 20–40/mo
- Margin impact: -$2,000 (contractor) or break-even (co-founder)

**Stage 2: 50 Customers → Tier 1 Support/CS ($4,000–5,000/mo)**
- Trigger: 30+ hours/week support, onboarding delays
- Role: Customer success, support, integration troubleshooting
- Hours: 80–120/mo
- Contribution at 50 customers: $12,500/mo
- Margin impact with hire: +$6,500/mo profit

**Stage 3: 100 Customers → Product Engineer ($7,000/mo)**
- Trigger: Feature backlog, technical debt, Tyler bottleneck for product
- Role: Product engineering, CRM integrations, feature build, escalations
- Hours: 160/mo
- Contribution at 100 customers: $25,000/mo
- Margin impact with two hires ($4k + $7k): +$14,000/mo profit

**Stage 4: 500+ Customers → Build Small Team ($25,000–35,000/mo)**
- Trigger: Multiple verticals require domain specialization
- Roles: VP GTM/Sales ($12k), Head of CS ($8k), Senior Engineer ($10k)
- Contribution at 500 customers: $125,000/mo
- Margin impact: +$90,000/mo profit

### Hiring Decision Gates

**Gate: No hires until BuildFlow generates $100k+ annual profit.**
- Seriously consider hiring at $150k+ annual profit
- This is both a business metric AND a personal threshold (ability to pay $60–70k salary)
- Part-time availability: Evenings (5:30pm–7pm+ AZ) and weekends only
- Human bottleneck is NOT infrastructure but decision-making: QA triage, CRM support, design iteration, customer classification, pricing tuning, compliance, GTM iteration

### Margin Impact of First Hire

| Metric | Impact |
|---|---|
| **Gross Margin** | Stays 90%+ |
| **Net Margin** | Post-contractor drops to ~85% but remains profitable |
| **Sustainability** | Profitable and sustainable at scale |

### Contractor vs. FTE Criteria

- **Contractor model (initial):** 50 customers, part-time, $2,000–4,000/mo
- **FTE transition (100+ customers):** Full-time, $60,000–80,000 salary + benefits
- **Decision criteria:** Predictability of volume, permanence of need, skill/knowledge transfer
- **Outsourcing options:** CRM implementation, accounting, support tier 1

### Decision Gates & Review Cadence

**Monthly Review (1st Friday):**
- Review actual spend vs. $50/mo budget
- Update burn-down forecast
- Discuss cost-saving triggers
- Preview hiring triggers (approaching milestone?)
- Adjust next month's budget

**Quarterly Business Review (end of Q):**
- Review financial performance (revenue, margins, growth)
- Stress-test projections (if growth slows, runway impact?)
- Hiring readiness (need someone in next 90 days?)
- Margin analysis (costs creeping up?)

### Financial Modeling Scenarios

**Conservative Growth (30 customers/month, 12 months to 360 customers):**
- Month 1–2: Solo, 0–30 customers, +$238–2,280/month contribution
- Month 3–4: Support hire, 60–120 customers, approaching break-even
- Month 5–6: Stable, CS hire amortized, positive margin
- Month 12: 360 customers, $8,208/month contribution, sustainable

**Aggressive Growth (100 customers/month, 6 months to 600 customers):**
- Month 1: Solo, 100 customers, scaling wall hit
- Month 2–3: Support hire, 200 customers, backlog clearing
- Month 4–5: Product hire, 400 customers, features accelerating
- Month 6: 600 customers, $13,680/month contribution
- Requires $100–200K capital to fund hiring through profitability

### Constraints & Assumptions

- **No outside capital:** Self-funded until 200+ customers or external funding
- **Contractor vs. FTE:** Mix (contractors early, FTEs as predictability grows)
- **Churn assumption:** 5–10% monthly churn per tier (typical SaaS)
- **Infrastructure scaling:** Assumes managed hosting scales linearly; at 1,000+ sites/day may require dedicated infrastructure ($5–10K/mo)
- **Support scaling:** Hours scale with customer count; tier distribution affects actual hours
- **Margin sensitivity:** Micro (97% margin) subsidizes Mid-Market (92%); portfolio stays >95%

### Open Items (carried from pre-consolidation stubs, never decided)

- Approval thresholds for spend (self-approve under what amount? escalate above what?)
- Tool sunset policy (criteria for cutting a tool that's grown too expensive)
- Training/onboarding budget per new hire
- Geographic & remote hiring policy (remote-only? location constraints?)
- Explicit CAC and LTV target numbers (current model implies CAC <$50 and payback <6mo, but no formal target stated)
- Multi-year (Year 1/2/3) revenue projections — only 6–12 month scenarios exist today
