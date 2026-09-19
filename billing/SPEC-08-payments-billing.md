---
name: 08-payments-billing-system
description: Payment processor selection, subscription billing, revenue recognition, refunds, tax compliance
sources: [chat]
aliases: [payment processor, billing, revenue, subscriptions]
---

# System 08 — Payments Billing System

## Purpose

Lock down payment infrastructure, billing automation, revenue accounting, and tax compliance.

## Contents

- Payment processor selection (Stripe) and setup
- Subscription billing implementation and proration
- Revenue recognition, MRR/ARR tracking
- Refunds and dispute handling
- Tax compliance (sales tax, income tax, 1099-K)
- Delinquency and account recovery logic

## Specifications

### SECTION 1: Payment Processor Selection & Setup

**LOCKED: Stripe** (2.9% + $0.30/transaction) — chosen over Square (weaker recurring billing) and Paddle (higher fees, unneeded global VAT handling for US-only Phase 1)

**Setup:** Stripe business account, connected bank account, weekly payout schedule, fraud/chargeback tolerance settings

**Card acceptance:** Visa/Mastercard/Amex mandatory; debit same flow; ACH not Phase 1; Apple/Google Pay optional

---

## SECTION 2: Subscription Billing Implementation

**Billing setup:** cycle starts on signup date, recurs monthly; first invoice at signup, auto-charged on anniversary date

**Proration:** upgrade mid-month = prorated charge for remaining days at new-tier daily rate; downgrade = credit applied to next invoice

**Payment retry logic — DUNNING RETRY COUNT: STANDARD (3) — LOCKED:**
- Attempt 1: day of renewal; Attempt 2: day 3; Attempt 3: day 7
- After 3 failures: mark delinquent, pause site, 14-day grace period to resolve
- Rationale: balances SMB payment friction against cash flow; 85% of legitimate failures resolve by day 7

**Renewal automation:** Stripe Billing subscriptions API; customer can update card anytime; cancel anytime (access through end of month)

---

## SECTION 3: Revenue Recognition & Accounting

**Policy:** recognize revenue monthly as service delivered (not at payment date)

**MRR calculation:** sum of all active subscriptions' monthly value, tracked daily

**ARR:** current MRR × 12

**Churn accounting:** gross churn (customers lost / total), revenue churn (MRR lost / previous MRR), net churn (accounts for expansion)

---

## SECTION 4: Refunds & Disputes

**Refund policy:** 30-day pro-rata refund (not full); exceptions (full refund): billing error, service failure (24+ hr unplanned downtime, requested within 7 days). No refund after 30 days.

**Chargeback handling:** Stripe auto-responds with evidence (invoice, access logs, support emails); typical SaaS win rate 70-80%; $15 fee if lost; suspension risk if chargeback rate >0.5%

---

## SECTION 5: Tax Compliance

**Sales tax:** collect only if nexus established in a state; simplest default assumes no nexus Phase 1; reassess if any state exceeds $100K

**Income tax:** BuildFlow revenue as business income; quarterly estimated taxes; CPA-prepared Schedule C

**Stripe 1099-K:** issued if volume >$20K and >200 transactions (likely hit month 2-3); requires EIN

**Records:** invoices/receipts/tax docs kept 7 years

---

## SECTION 6: Late Invoice & Late Payment Recovery Lifecycle — LOCKED

**Design principle:** Retention > Collection. Biases toward payment plans and flexibility until day 90, then legal escalation.

### Tier 1: Soft Reach-Out (Days 0-7)
Trigger: 3 failed Stripe retries, account delinquent. Day 0: site paused, friendly notice. Days 1-7: AI-assisted personalized recovery emails (Day 1, 4, 7) — tone varies by business-activity signal (low-urgency/quiet biz vs. high-urgency/active biz).

### Tier 2: Friendly Escalation (Days 7-30)
Trigger: no Tier 1 response, or customer initiates contact. Tyler calls/emails directly. Agent generates 2-3 payment plan options (Conservative 50/50 split, Flexible 3-payment/90-day, Seasonal defer-30-then-normal). Site re-enabled on first partial payment.

### Tier 3: Firm Escalation (Days 30-60)
Day 30 final notice (account closure in 30 days). Optional 5% late fee (recommendation: skip Phase 1). Day 40: final take-it-or-leave-it payment plan offer if still unresponsive.

### Tier 4: Legal Escalation (Days 60-90)
Day 60: auto-generated state-specific demand letter (email + certified mail). Collections referral evaluated if amount owed >$400 (25-35% agency cost).

### Tier 5: Post-Day 90 Legal Action
Small claims filing (Arizona $3,500 limit, ~$100-150 filing cost, 70%+ win rate with documentation) or collections agency referral. Write-off as bad debt after 180 days uncollectible.

### Repeat Delinquency Escalation
1st delinquency: full soft escalation, forgive 14 days on reactivation. 2nd: no forgiveness, full back-payment required. 3rd: consider legal action, likely churn candidate. 3+: flagged for manual Tyler review, consider permanent closure.

### Back-Payment Calculation (Agent Logic)
Inputs: delinquency_count, delinquent_since, current_date, monthly_amount, tier. Calculation: months_delinquent × monthly_amount, minus 14-day forgiveness (1st only), plus 5% late fee if applicable, plus current month. Validated twice independently; alert Tyler if discrepancy >$1.

### BuildFlow Tuning
Seasonal cash flow awareness (HVAC slower in winter, plumbing busier; vice versa in summer) — don't penalize seasonal dips harshly in Tier 1-2. Retention threshold: if LTV <$500, don't pursue small claims (cost/benefit negative); prefer payment plan or write-off. Every delinquency email includes value reminder ("You missed X qualified leads this week while offline").

### Delinquency Metrics Dashboard
Tracked daily: % delinquent by tier, total MRR at-risk, recovery rate by tier, legal costs YTD, write-off rate. Quarterly review with financial forecast.

---

## SECTION 7: Annual Billing Option — LOCKED

**Discount:** "2 months free" (~16.7% off) -- annual price = 10x the customer's applicable monthly rate (new-pricing or grandfathered, whichever the customer is on per System 01's grandfathering cohort tracking).

| Tier | Monthly | Annual (single payment) |
|---|---|---|
| Micro | $149/mo | $1,490/yr |
| SMB | $249/mo | $2,490/yr |
| Mid-Market | $399/mo | $3,990/yr |

**Applies to:** all three tiers (Micro, SMB, Mid-Market) -- offered as a billing-cadence choice at signup and anytime from the customer dashboard (switch monthly -> annual mid-cycle: charge the annual amount, credit any unused days of the current monthly period against it).

**Stripe implementation:**
- One additional Stripe Price object per tier (interval: year) alongside the existing monthly Price objects
- Checkout / dashboard billing settings present a monthly/annual toggle
- Single invoice line item: "BuildFlow Annual -- [Tier] -- [start date] to [end date]"
- Renewal: auto-charges the full annual amount on the anniversary date (same subscriptions-API mechanism as monthly, just yearly interval)

**Revenue recognition:** despite the lump-sum charge, revenue is still recognized monthly over the 12-month period (1/12 per month), consistent with Section 3's SaaS revenue-recognition policy -- the annual charge creates a deferred-revenue liability on receipt, recognized down over the year. MRR calculation (Section 3) treats an annual customer's contribution as `annual_price / 12` so MRR stays a true like-for-like metric across monthly and annual customers.

**Payment failure handling:** if the annual charge itself fails at renewal, it runs through the same Standard (3) dunning retry ladder as monthly (System 08 Section 6 Tier 1), since it's structurally still a single subscription charge to Stripe -- just a larger amount and a once-a-year cadence. Site pause behavior on repeated failure is unchanged.

**Cancellation policy -- non-refundable, no proration:** Canceling an annual plan mid-term forfeits the remaining prepaid period; no partial refund is issued, and access is stopped immediately upon the cancellation request (does not continue through the remainder of the paid year). This is an intentional carve-out from the monthly plan's 30-day pro-rata refund policy (Section 4) -- the annual discount is priced against the certainty of a 12-month commitment.

**Refund exceptions still apply:** the two existing exceptions in Section 4 -- BuildFlow billing error, and extended unplanned service failure (24+ hr downtime, reported within 7 days) -- still entitle an annual customer to a refund or credit. This policy removes only the "customer changed their mind" refund path, not BuildFlow's own error accountability.

**Customer-facing framing (dashboard/checkout copy):** "Save $[X]/year -- billed once annually. Non-refundable; cancel anytime for future renewals, but the current year isn't prorated if you cancel early." Set this expectation clearly at the point of purchase, not just in fine print, given the harder-than-monthly cancellation terms.

---

## SECTION 8: Agent Cross-Reference

**Dunning / Payment Recovery Agent (Agent Registry #9)** executes the full Tier 1-5 lifecycle in Section 6 — a time-gated pipeline (the tiers ARE the retry/escalation ladder), with LLM used only for personalized-tone emails in Tiers 1-2.

**Cross-system coordination:** On entry to Tier 3 (30+ days late), this agent notifies the Lifecycle/Churn Prediction Agent (Agent Registry #12, System 12) immediately rather than waiting for System 12's next scheduled health-score recompute.

Full agent detail: `systems/agent-registry.md`
