---
name: BuildFlow Business Model & Constraints
description: Complete business model, GTM strategy, unit economics, pricing, constraints, and operational limits—consolidated for iOS readability
sources: [chat]
aliases: [business summary, GTM strategy, unit economics, operational constraints]
---

# BuildFlow — COMPLETE BUSINESS MODEL & CONSTRAINTS

## EXECUTIVE SUMMARY

BuildFlow is an AI-powered website design and lead management platform for service industry SMBs (trades: plumbing, HVAC, electrical, roofing; maintenance: landscaping, cleaning; automotive; security).

**Core Model:**
- AI agents generate 500-5,000 static website designs and store them offline
- Cold outreach sends demo previews to prospects (preview sites cost near-zero to host)
- 3-month demo lifecycle; prospects convert or expire
- Managed hosting ($149-399/mo) for conversions; one-time offboard option ($499-1,299)
- 95%+ automated (agents handle design, deployment, CRM sync, review management)
- Gross margins: 95%+; net margins: 90%+ (solo founder, minimal overhead)

**Phase 1 Target:** Residential & commercial trades (plumbing, HVAC, electrical, roofing). Five CRM integrations (ServiceTitan, Jobber, Housecall Pro, HubSpot, Successware = 85% trades SMB market coverage).

**Phase 2+:** Landscaping, cleaning, pest control, automotive, security/infrastructure verticals.

---

## PART 1: THE PRODUCT MODEL

### What BuildFlow Sells (NOT "Website Builder")

BuildFlow is **NOT** a website builder (like Wix, Squarespace). It's an **automated outbound sales engine** that uses AI-generated websites as cold-outreach collateral.

**The workflow:**
1. **Lead Discovery:** AI agents query Apollo/Hunter.io + Google Places API -> prospect contact list (by vertical, geography, business size)
2. **Design Generation:** AI agents create 500-5,000 static websites (one per prospect) -> store offline in S3 (~$0.10/mo)
3. **Cold Outreach:** Email/SMS campaign -> "See what your website could look like: [demo-preview-link]"
4. **Demo Delivery:** Prospect clicks link -> Cloudflare Workers renders HTML on-demand (~$0.0000001/click, cached) -> prospect views personalized demo for 3 months
5. **Conversion:** Prospect interested? Click "Get This Site" -> payment -> site becomes live (either managed $149-399/mo OR offboard one-time $499-1,299)
6. **Post-Sale:** Customer dashboard for managing copy, features, CRM integrations, reviews, analytics

**Critical clarification:** "Site and demo site are the same thing" — not two separate products. Same website, gated access pre-conversion, live/public post-conversion.

### Two-Dashboard Architecture (Critical Product Design)

**Customer Dashboard** (`app.buildflow.com/dashboard`)
- Users: customers only
- Purpose: manage website, view analytics, configure CRM sync, manage fields/features
- Sections: Lead Inbox, Notes, Pipeline (simple), Analytics (per tranche), CRM Config
- Data: Website, FormSubmission (their leads), CRMIntegration (their config), Subscription (summary only), Reviews
- UX: beautiful, minimal, intuitive
- Security: row-level by customer_id (database enforces isolation)

**Admin Dashboard** (`admin.buildflow.com`)
- Users: Tyler only
- Purpose: monitor business health, debug agents, track revenue, manage escalations
- Sections: KPI dashboard (MRR, churn, ARR), Customer list, Agent logs, Revenue, Escalations
- Data: All customers' data + AgentRun logs + PaymentTransaction + LeadWarehouse + OutboundCampaignRun
- UX: data-dense, alerts-focused, queryable
- Security: Tyler-only access; no customer visibility

**Architectural implication:** Zero data leakage between customers. Admin data is global ops only. Customer data is filtered by `customer_id` at database level (RLS policies).

---

## PART 2: THE GTM STRATEGY

### Three-Tier Product Offering (Prescriptive Segmentation)

**No customer choice of tier.** Lead scoring determines tier; customer cannot override. Rationale: website architecture is tier-locked (Micro site != SMB site). Wrong tier = wasted design generation + wrong feature set + support burden.

**Micro Tier ($149/mo managed OR $499 one-time offboard)**
- Target: solo contractors, <3 employees
- Website features: hero + services grid + testimonials + contact form (6-8 components max)
- Dashboard: lead inbox only (view forms, export CSV, email notifications)
- CRM: Zapier only (no MCP built; they route leads themselves via Zapier)
- Analytics: monthly email report (lead count, source breakdown, 3-month trend)
- Content editing: text-only (service names, descriptions, FAQ answers); hero images locked
- Gross margin: 97%+

**SMB Tier ($249/mo managed OR $799 one-time offboard)**
- Target: established service businesses, 3-20 employees, $250k-$5M revenue
- Website features: Micro features + gallery + map + FAQ + seasonal offers + contact form variants (10-12 components)
- Dashboard: Lead Inbox + editable Notes + simple Pipeline (new/contacted/converted)
- CRM: MCPs for five trades CRMs (ServiceTitan, Jobber, Housecall Pro, HubSpot, Successware) = 85% market coverage
- Analytics: real-time lead count + form submissions + source breakdown + monthly 3-month trend report
- Content editing: text + images (upload/manage); reorder items; form validation stricter
- Gross margin: 98%+

**Mid-Market Tier ($399/mo managed OR $1,299 one-time offboard)**
- Target: scaled service businesses, 20+ employees, $5M+ revenue, multi-location capability
- Website features: SMB features + pricing table + case studies + blog + client logos + advanced video integration (15+ components)
- Dashboard: Inbox + Notes + Pipeline + custom stages + lead scoring + task assignment + advanced filtering/bulk actions
- CRM: MCP for top 10 CRMs + bi-directional sync capability
- Analytics: lead scoring (hot/warm/cold) + CRM sync health + quarterly PDF trend report + SEO tracking
- Content editing: text + images + conditional display (show section if >20 reviews) + scheduled content (seasonal offers on specific dates) + advanced metadata
- Gross margin: 98%+

### Pricing Model (Premium Positioning, NOT Race-to-Bottom)

**Why Premium?**
You're delivering:
- Trade-specific website design (not generic)
- WCAG 2.1 AA compliance built-in (competitors skip this)
- Automated review aggregation + display
- CRM integration (prospects -> leads -> their CRM, automatically)
- Done-For-You generation (no design work from customer)
- AI-driven SEO optimization (Micro: none, SMB: monthly, Mid-Market: monthly + tracking)

Compare to competitors:
- ServiceTitan: $398+/mo per tech -> BuildFlow premium at $149-399 is CHEAPER but adds website
- Jobber: $49-349/mo -> BuildFlow in their range but with better value
- Housecall Pro: $169+/mo -> BuildFlow $149 Micro undercuts; $249 SMB same price, more features
- Positioning: "We're not cheaper Wix. We're built for trades, compliant, and include lead management."

**Two-Option Strategy:**
- **Option A (Managed):** $149-399/mo recurring, or annual prepay at 10x monthly ("2 months free" -- Micro $1,490/yr, SMB $2,490/yr, Mid-Market $3,990/yr; non-refundable, non-prorated on cancellation). You host, maintain, handle SEO, CRM sync, customer support.
- **Option B (Offboard):** $499-1,299 one-time. Customer takes domain ownership, you provide offboarding docs/videos, no ongoing support. Design cost amortized across 5,000+ sites = ~$2/site.

**Offboard pricing = 3.2-3.3 months of Managed cost. Annual Managed pricing = 10 months of Managed cost.** Long-term customer logic: three ways to pay (monthly forever, annual for a discount + BuildFlow gets cash upfront, or buy-once-and-own).

### Pricing Evolution & Grandfathering Strategy (LOCKED)

**Launch phase (Month 0-6):** Validate at current tiers ($149-249-399/mo)

**Validation gate (~25 customers):** Once market signals confirm willingness-to-pay for higher pricing:
- Analysis: objection reasons (% "too expensive" feedback), NPS/survey data on willingness-to-pay, competitive positioning feedback
- Decision: If signals suggest market will accept $199-349-599/mo, proceed to price increase

**Price increase strategy (Month 7+, new customers only):**
- **Early customer cohort (first 25-50):** Grandfather at launch pricing indefinitely
  - Rationale: Early customers feel rewarded for taking founder risk; retention benefit > forgone revenue
  - Psychological: Early customers discover they pay LESS than new customers -> feel good about early decision, not cheated
- **New customers (Month 7 onward):** New tiers at $199-349-599/mo
  - Validates higher pricing without retroactively penalizing early adopters
  - Billing system: tracks customer_id.launch_cohort to manage dual tiers

**Renewal migration (Month 18-24, optional):**
- Grandfathered customers' first renewal: communicate value-add (new CRM integrations, performance improvements, feature X)
- Migrate to new tier with justification tied to delivered value
- Rarely triggers churn when framed as value, not punitive price increase
- Not mandatory; can keep grandfathered pricing if retention is higher value than revenue lift

**Financial impact (illustrative):**
- 25 customers grandfathered @ $200/mo average = $60K/yr forgone
- 50 new customers at Month 12 @ $300/mo average = $150K/yr gain (3 months into new pricing cohort)
- By EOY2: early cohort 25-50 customers, new cohort 75-150 customers, blended ARR reflects new pricing as primary driver

---

## PART 3: FINANCIAL CONSTRAINTS & UNIT ECONOMICS

### Hard Budget Constraints (Non-Negotiable)

**Bootstrap mode:**
- $0 external capital
- $50/mo cash spend (until revenue)
- Current subscriptions: Claude (ongoing), $5/mo Railway (prototype)
- Hiring gate: $100k+ annual profit (serious consideration at $150k+)

**Margin targets:**
- Gross margin minimum: 70% (target: 90%+)
- Net margin at scale: 85%+ post-contractor ($4-8k/mo QA + integration engineer at ~100 customers)

**Infrastructure scaling constraint:**
- CANNOT migrate infrastructure between phases (Railway -> Vercel -> custom risks breakage, ops chaos)
- Must choose architecture that scales linearly 1 -> 50,000 sites WITHOUT migration
- **Chosen solution:** Cloudflare Workers + S3 for demos (scales to millions, costs pennies); Lightsail/Vercel/Cloud Run for managed (pick one, scales linearly with customers)

### Unit Economics (Locked)

**Infrastructure cost per customer (COGS):**
- Cloudflare (public sites + CDN): $2-5/mo
- Cloud Run (backend API): $1-3/mo
- Database: $0.50-1/mo
- Monitoring: $0.10-0.50/mo
- **Total: $3-9/mo average**

**Gross margin per tier (locked):**

| Tier | Price/mo | COGS | Gross Margin |
|---|---|---|---|
| Micro | $149 | $4 | 97.3% |
| SMB | $249 | $5 | 98%+ |
| Mid-Market | $399 | $8 | 98%+ |

**Well above 90% target across all tiers.**

**Scaling cost curve (total platform cost):**
- 100 customers: ~$500/mo
- 1,000 customers: ~$5,000-6,000/mo (linear, Cloudflare bulk discount applies)
- 10,000 customers: ~$50,000-60,000/mo (same per-customer cost, auto-scaling)
- 100,000 customers: ~$500,000-600,000/mo (zero migration needed, same architecture)

### Demo-Site Business Model (Foundational Unit Economics)

**Demo hosting cost = near-zero (serverless + S3)**
- Design storage in S3: $0.10/mo for 5,000 sites
- Demo rendering via Cloudflare Workers: ~$0.0000001/click (essentially free until massive scale)
- **Cost per demo: ~$0.00002 (two-hundredths of a cent)**

**Demo-to-customer conversion rate assumption (CRITICAL):**
- Conservative estimate: **2-5% conversion rate** (unknown, to be validated post-launch)
- If conversion <2%: demo hosting expenses exceed customer LTV (model breaks)
- If conversion >=5%: strong unit economics, model works well
- **Risk:** Conversion rate is the one variable entire ROI depends on

**CAC calculation (if 1,000 demos sent, 3% convert = 30 customers):**
- Demo hosting cost: $1,000 demos x $0.00002 = $0.02 total
- Outbound email cost: Mailgun/SendGrid ~$0.001 per email x 1,000 = $1
- Total CAC cost: ~$1 for 30 customers = $0.03 per customer
- **CAC is nearly free** (outbound automation pays for itself)
- CAC risk: **Outreach quality** (are we reaching the right prospects?)

---

## PART 4: OPERATIONAL CONSTRAINTS (SOLO FOUNDER)

### Tyler's Actual Availability (Hard Boundary)

**Current role:** HNW Client Relationship Associate at Vanguard, full-time 9-5:30pm AZ (sometimes 7pm)

**BuildFlow availability:**
- Evenings: 5:30pm-7pm+ AZ
- Weekends: flexible
- **Total: ~15-20 hrs/week max** (while maintaining Vanguard job)

**NOT a bottleneck constraint because: BuildFlow is 95% automated**
- Design generation: agent
- Website deployment: agent
- Lead discovery: agent
- CRM sync: agent
- Review sync: agent
- Email send: agent
- Monitoring: system alerts (no active watching needed)

**Human bottleneck IS: Decision-making**
- QA/edge case triage
- CRM integration support
- Design/feature iteration
- Customer intake classification
- Pricing/offer tuning
- Compliance monitoring
- GTM iteration

**Operational load scaling:**
- 10 customers: 8-10 hrs/mo (minimal)
- 50 customers: 20-25 hrs/week
- 100 customers: 35-50 hrs/week (UNSUSTAINABLE with Vanguard job)
- **Scaling wall at ~100 customers -> requires hiring or full-time commitment**

### Scaling & Hiring Plan (Locked)

**Until $100k annual profit:** Solo founder, no hires, minimal overhead

**At $100k-$150k annual profit:** Seriously consider hiring; first role candidates: QA lead OR integration engineer; cost $4-8k/mo; margin impact: gross stays 90%+, net drops to ~85%

**At $150k+ annual profit:** Hire 1-2 people; Team: Tyler + QA/engineer + customer success (part-time); Gross margin 90%+, Net margin 75-80%

**Why not hire earlier?** Hiring costs money; until revenue covers salary comfortably, solo operation minimizes burn; $100k profit threshold gives runway for salary ($60-70k) without risk

---

## PART 5: STRATEGIC CONSTRAINTS (Business Model Dependencies)

### CMS Integration Explicitly NOT Phase 1

**Phase 1 excludes:** Shopify, WordPress, WooCommerce, Magento integrations

**Rationale:** Target customers (service trades) use CRM tools, NOT ecommerce; maintenance burden of 5+ integrations unsustainable for solo founder

**Decision:** Phase 1 nails core product; Phase 2 revisits Shopify only if 5+ customers request it, as $49/mo add-on after $100k MRR

### Business-Size Classification (Data Dependency)

**Multi-signal classification (80-90% confidence):** LinkedIn employee count, job posting velocity, website traffic (Similarweb), revenue proxies (Clearbit)

**Build cost:** 3-5 days; $200-1,500/mo depending on data sources

**Strategic implication:** architectural dependency for all phases; must be built before outbound campaign at scale

---

## PART 6: DEMO SITE LIFECYCLE (Critical GTM Detail)

**Demo generation -> delivery -> expiration (3-month window)**

**Trigger:** Prospect identified -> design agent generates website -> demo link sent via email/SMS

**Demo preview phase (days 1-90):** gated/not indexed, no search crawlers, no CRM integration active, customer can request 30-day extension (Tyler manual approval)

**Demo expiration (day 90):** auto-archived (S3 kept, URL 404s); email sent offering reactivation call

**Conversion path:** "Get This Site" -> pricing/tiering page (pre-selected tier) -> card -> payment -> auto-deploy (60 sec) -> dashboard login link. No manual handoff needed.

**Demo lifecycle metrics tracked:** demos generated/month, demo views/month, conversion rate, demo-to-customer time, conversion by vertical, conversion by outreach channel

---

## PART 7: COMPETITIVE POSITIONING

### Why BuildFlow (NOT "Cheaper Wix")

**Wix/Squarespace/GoDaddy:** generic, cheap, no trades features, no compliance, no CRM, customer does own design work

**ServiceTitan/Jobber/Housecall Pro:** trade-specific CRM but basic landing pages, no design automation, no review management

**BuildFlow:** Trade-specific website builder + CRM integration + compliance + reviews + automation

**Moats:** (1) Trades-specific design, (2) WCAG 2.1 AA built-in, (3) Automated review aggregation, (4) CRM integration, (5) Done-For-You generation

**Positioning:** "Your website + your leads + your CRM = one place. Built for trades."

### Competitor Differentiation

| Feature | BuildFlow | ServiceTitan | Jobber | Wix |
|---|---|---|---|---|
| Website design | AI-generated, trade-specific | Basic landing page | Basic landing page | DIY |
| WCAG 2.1 AA | Built-in | No | No | No |
| CRM integration | Yes (5 trades CRMs) | Own CRM only | Own CRM only | No |
| Review aggregation | Automated | No | No | No |
| Lead capture | Contact forms | Via CRM | Via CRM | Forms |
| Price | $149-399/mo | $398+/mo | $49-349/mo | $10-30/mo |
| Target | Service trades | Service trades | Multi-vertical | Everyone |

---

## PART 8: REVENUE PROJECTIONS & PROFITABILITY TIMELINE

### Conservative Ramp (Month 1-12)

**Assumptions (locked):**
- Month 1-3: Learning phase, 5-10 customers (manual outreach, testing GTM)
- Month 4-6: Growth phase, 10-30 customers (outreach agents active)
- Month 7-12: Scaling phase, 30-100 customers (optimized GTM)
- Churn: 8% monthly (conservative)
- Mix: 40% Micro, 40% SMB, 20% Mid-Market (by revenue)

**Revenue projection:**

| Month | Customers | MRR | ARR | Cumulative Cash |
|---|---|---|---|---|
| 1 | 5 | $1,200 | $14,400 | -$45 |
| 3 | 15 | $3,500 | $42,000 | -$140 |
| 6 | 35 | $8,300 | $99,600 | -$340 |
| 12 | 75 | $17,000 | $204,000 | +$10,660 (break-even) |

**Profitability timeline:** Month 9-10 break-even on operations; Month 11-12 cumulative cash positive; Year 2 $150k+ profit (hiring threshold)

**Risk scenarios:** Slow ramp (conversion <2%) -> Month 12 = 30 customers, MRR $7k, still break-even but tighter. Fast ramp (conversion >5%) -> Month 12 = 150 customers, MRR $34k, can hire earlier.

---

## PART 9: KEY DECISION GATES & REVIEW CADENCE

**Monthly Business Review (1st Friday):** spend vs. $50/mo budget, burn-down forecast, cost-saving triggers, hiring thresholds, churn analysis

**Quarterly Business Review:** financial performance, stress-test projections, hiring readiness, margin analysis, cohort analysis

**Phase 1 Launch Gate (all complete):** Data Model, Agent Orchestration, Design System, Feature System, Pricing, Hosting Decision, Payment Processor, Compliance, CRM Integration (first 5 MCPs), Demo System

---

## PART 10: CRITICAL OPEN QUESTIONS

**Before writing code:**
1. Hosting decision: which of Lightsail/Vercel/Cloud Run? (framework locked; final tech-stack call pending)
2. Conversion rate validation: 2-5% conservative estimate, to be tested Month 1-3
3. Lead scoring accuracy: target 80%+, recalibrate if misclass >20%
4. Churn rate: targeting 8% or better, early data will tell
5. CAC by channel: outbound email vs. SMS vs. organic, test Month 1-6

**Resolved:** Pricing model, margin targets, target market, GTM model, product scope, staffing plan — all locked

---

## PART 11: DEMO SITE HOSTING ARCHITECTURE (All Three Tiers)

### Preview-Phase Hosting (Before Conversion)
Platform: Cloudflare Workers + S3. Cost: near-zero. Demo URL: platform subdomain or short URL. Auto-scales 1 to 1M req/sec, no migration.

### Post-Conversion Managed Hosting (Three Finalists Evaluated)

**Option A: AWS Lightsail (CHOSEN for Phase 1)** — $5-10/site/mo, 92%+ margin (SMB), 99.99% SLA, simplicity/predictability

**Option B: Vercel Pro** — $20-25/site/mo, 90% margin, requires Next.js, superior DX

**Option C: Google Cloud Run** — $1-8/site/mo, 97%+ margin (best), requires Docker expertise, cost variance higher

**Ruled out:** Fly.io (reliability incidents, unpredictable egress), Railway (bill variance), Render (always-on costs + reliability)

---

## APPENDIX: Quick Reference

**Pricing:** Micro $149/mo or $499 one-time; SMB $249/mo or $799 one-time; Mid-Market $399/mo or $1,299 one-time

**Gross Margins:** 97-98%+ across all tiers

**Target Market (Phase 1):** Trades (plumbing, HVAC, electrical, roofing). Phase 2+: landscaping, cleaning, pest control, automotive, security/infrastructure

**Demo Lifecycle:** 3-month preview window; auto-expiration; conversion triggers deployment

**Key Metrics:** Conversion rate (%), CAC, LTV, churn rate (%), MRR, ARR

**Hiring Gate:** $100k annual profit (seriously consider at $150k+)

**Operational Constraint:** Solo founder ~15-20 hrs/week while at Vanguard; 95% automated platform

**Infrastructure Decision:** Lightsail for Phase 1 (predictable, simple); review Cloud Run at 500+ sites (better margins)

**Risk:** Demo-to-customer conversion rate is the ONE variable entire unit economics depends on
