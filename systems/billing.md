---
title: Billing System
purpose: Authoritative spec and build checklist for payment processing, subscription billing, dunning, and revenue accounting. Superseded/absorbed from billing/SPEC-08-payments-billing.md (System 08), DECISIONS.md items 3/14.
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Billing System

Stripe-based subscription billing for all three tiers, versioned prices to support a launch-cohort grandfather
guarantee ahead of a planned post-launch price rise, and an automated Tier 1-3 dunning ladder (Tier 4-5 legal
escalation explicitly out of scope per DECISIONS.md #14). Code: `billing/`.

## Built and verified
- [x] Versioned price catalog on placeholder IDs — `billing/prices.py`. Launch prices per DECISIONS.md item 3:
  Micro $149/mo·$1,490/yr, SMB $249/mo·$2,490/yr, annual = 10x monthly. `launch_cohort` flag
  (`launch`/`standard`) distinguishes launch-price customers from future price-rise customers;
  `add_price_increase()` creates a new `standard` version without touching `launch` rows. Mid-Market
  intentionally absent (paused, DECISIONS.md item 4). 10/10 evals pass (`billing/evals/test_prices.py`).
  **No real Stripe Products/Prices exist yet** — these are placeholder IDs, per
  `operations/BUILD_TASKS.md` §5.
- [x] Webhook handling — `billing/webhooks.py`'s `handle_event()` + `billing/mocks.py`
  (`WebhookSignatureMock`, `StripeEventFactory`, mocked signature verification, no real Stripe
  account/webhook secret exists). Handles `invoice.payment_succeeded`, `invoice.payment_failed`,
  `customer.subscription.{created,updated,deleted}`. On the 3rd failed retry, hands off to
  `billing/dunning/`'s `start_delinquency()`/`advance()`. 12/12 evals pass (`billing/evals/test_webhooks.py`).
- [x] Dunning state machine (Tiers 1-3) — `billing/dunning/state_machine.py` + `billing/dunning/mocks.py`
  (Stripe/SendGrid mocks). 20/20 evals pass (`python3 -m billing.dunning.run_evals`). Tiers 4-5 (legal
  escalation, small claims) explicitly out of scope per DECISIONS.md #14.
- [x] Full billing suite — 42/42 evals pass live (`python3 -m billing.run_evals`), per
  `operations/BUILD_TASKS.md` §5.
- [x] Annual billing pricing table and revenue-recognition treatment (deferred-revenue liability, MRR
  contribution = `annual_price / 12`) — specified in `billing/SPEC-08-payments-billing.md` Section 7, and the
  price catalog build above (`prices.py`) implements the annual price points; the revenue-recognition
  *accounting* logic (deferred-revenue liability tracking) was not separately confirmed as code in this pass —
  flagging rather than claiming it as verified beyond the price catalog.

## Specified, not yet built
- [ ] Real Stripe test-mode account and real Product/Price objects [credential: Stripe test account, per
  `operations/BUILD_TASKS.md` §5]
- [ ] Real webhook endpoint + signing secret [credential: Stripe]
- [ ] Live Stripe switch [decision: blocked on legal sign-off, G7 — do not do before then, per DECISIONS.md #12]
- [ ] Payment → live site fulfillment under 60 seconds [depends: Cloudflare hosting §2 + Stripe §5, both still
  on mocks]
- [ ] Refund handling code (30-day pro-rata, exceptions for billing error / 24+hr outage) per SPEC-08 Section 4
  — not confirmed as built in the evals read in this pass
- [ ] Tax compliance automation (nexus tracking, 1099-K threshold monitoring) per SPEC-08 Section 5 — no code
  found; likely manual/CPA-handled at this stage, not contradicted by anything found
- [ ] Chargeback/dispute handling beyond Stripe's own auto-response (per SPEC-08 Section 4) — not found

## Possible future specs (not built, not committed to)
- LLM-personalized dunning tone in Tiers 1-2 (spec allows it; launch dunning is explicitly manual/deterministic
  per the 2026-09-18 override, so this is deferred, not rejected)
- Tier 4-5 legal escalation automation (demand letters, small-claims filing) — explicitly deferred, DECISIONS.md #14

## Open questions
- None new found beyond what's already tracked in `operations/TYLER_QUEUE.md` for the Stripe account itself.
