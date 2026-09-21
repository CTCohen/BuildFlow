---
title: Lane F Billing and Fulfillment
purpose: Brief for the session that builds Stripe billing, the dunning state machine and payment-to-live fulfillment
status: active
owner: c.t.cohen
updated: '2026-09-20'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Lane F: Billing and fulfillment (`billing/`)

**Starts when:** Track A's contract and schema exist, and Tyler has a Stripe test account.
**Read first:** `billing/SPEC-08-payments-billing.md`, `platform/SPEC-06-demo-to-customer.md` (section 5), `platform/CONTRACT.md`, `docs/PRICING.md`, `operations/lanes/README.md`.

## Tasks
1. Stripe products and **versioned** Prices (Micro and SMB, monthly and annual) and the `launch_cohort` flag; Mid-Market prices not sold.
2. Webhook handler: payment confirmed -> customer record -> hand off to fulfillment.
3. Fulfillment: customer, site build from the demo, DNS and SSL, welcome email, dashboard access, target under 60 s (mock the deploy targets).
4. Dunning **state machine** and templates (deterministic): retries day 0/3/7, delinquent, site paused, 14-day grace, Tier 1 emails days 1/4/7, Tier 2 to Tyler from day 7; back-payment math computed twice, alert if they differ by more than $1.
5. MRR and revenue recognition (annual as 1/12 per month); refund and annual non-refundable rules.
6. Evals and `billing/TASKS.md`.

**Done means:** a test-mode payment produces a live customer and site record in under 60 s; dunning tiers 1-3 run in a simulation with correct dates; all evals pass. **No live Stripe, no real charges.**
**Needs from Tyler:** Stripe test account and products.
