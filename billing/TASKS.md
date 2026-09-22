---
title: Billing Lane Tasks
purpose: Status, run instructions, assumptions and open questions for Track F (dunning state machine)
status: active
owner: c.t.cohen
updated: '2026-09-21'
version: 1.0.0
tier_scope: all
phase: phase_1
related: [operations/BUILD_TASKS.md, billing/SPEC-08-payments-billing.md, DECISIONS.md, agents/AGENT_REGISTRY.md]
---

# Track F (Billing) tasks

Run everything: `python3 -m billing.dunning.run_evals` (stdlib only, no keys, no network, no LLM).

| # | Task | Status | Where |
|---|---|---|---|
| 1 | Dunning state machine, Tiers 1-3 automated (site pause, days 1/4/7 emails, Tyler notification + payment plans, days 30/40 firm escalation) | Done | `billing/dunning/state_machine.py` |
| 2 | Mock Stripe charge attempts + mock SendGrid dunning sends (no real credentials exist) | Done | `billing/dunning/mocks.py` |
| 3 | Evals (all pass) | Done: 20/20 | `billing/dunning/evals/test_state_machine.py`, run via `billing/dunning/run_evals.py` |
| 4 | Tier 4-5 (legal escalation, collections, write-off) | **Out of scope**, not built | `billing/SPEC-08-payments-billing.md` Section 6 Tiers 4-5 |
| 5 | Back-payment calculation agent logic (Section 6 "Back-Payment Calculation") | **Out of scope**, not built | see assumption 5 below |
| 6 | Stripe test-mode products/prices, webhooks, `launch_cohort` flag | Not started — needs Stripe test account (TYLER_QUEUE §2) | — |

## Scope (per the task that produced this)
Only Tiers 1-3 of `billing/SPEC-08-payments-billing.md` Section 6, matching BUILD_TASKS.md §5's line item
"Dunning state machine (tiers 1-3 automated) [none, buildable on mocks]" and DECISIONS.md item 14
(D35-D37, "manual dunning first, provisional defaults" — Tier 4/5 stay Tyler-manual). The machine lands an
account in `TIER4_MANUAL` at day 60 and raises a `TylerNotification`; nothing past that point is automated,
generated, or sent.

## Assumptions to confirm (I chose, spec was silent or the header override and Section 6 read slightly
different on the exact day numbers — the header override block, being the most recent Tyler ruling
on top of the spec, is what this machine follows)
1. **The header override's day numbers win over Section 6's own tier-1 wording.** The spec header says
   "Dunning clock starts at the third failed retry (delinquency day 0): site paused, Tier 1 emails days
   1/4/7, Tier 2 (Tyler) from day 7, grace 14 days" — Section 6's body text separately says "Days 1-7"
   without naming exact days. I built to the header's explicit 1/4/7 (matches the file's own note that
   overrides win where they conflict with the spec body).
2. **Tier 2 starts exactly at day 7** (not "any time after"), i.e. the same day the third Tier-1 email goes
   out, per the header ("Tier 2 (Tyler) from day 7").
3. **Tier 3's day 30 and day 40 events** come straight from Section 6 ("Day 30 final notice... Day 40:
   final... payment plan offer") — no ambiguity there.
4. **"Site re-enabled on first partial payment"** (Section 6 Tier 2) is implemented as: any payment below
   the full monthly amount unpauses the site and marks a payment plan active, but does NOT change tier or
   close the delinquency episode. A full payment (>= the monthly amount) is what recovers the account.
   The spec doesn't define "partial" precisely (e.g. a token $1 payment) — I did not add a minimum-partial
   floor; flag if you want one (e.g. "partial must be >= 10%").
5. **Back-payment calculation logic (Section 6) was left out of scope.** It's tier-agnostic math
   (months_delinquent × monthly_amount, minus 14-day forgiveness, plus late fee, plus current month) that's
   really in service of Tier 4/5 collections/legal amounts owed, not part of the Tier 1-3 escalation ladder
   itself — building it now risked scope creep past what this task asked for. Straightforward to add later
   as a pure function once Tier 4/5 is actually scoped.
6. **Repeat-delinquency grace (Section 6 "Repeat Delinquency Escalation")**: implemented only the 1st-episode
   14-day grace forgiveness ("1st: forgive 14 days... 2nd: no forgiveness"). I did not implement 3rd+
   "flagged for manual Tyler review" as a distinct code path beyond what Tier 4 already does — a 3rd
   delinquency episode still runs the same Tier 1-3 ladder and lands in `TIER4_MANUAL` like any other; there's
   no separate "this is their 3rd time" flag surfaced yet. Flag if you want `delinquency_count` surfaced in
   the `TylerNotification` reason text (cheap to add).
7. **Stripe's own 3-attempt retry ladder (Section 2: renewal day / day 3 / day 7) is a precondition, not part
   of this state machine.** `start_delinquency()` assumes that's already happened and `on` is delinquency day 0.
   Nothing here re-implements the retry attempts themselves (no Stripe test account exists to build against
   yet — see BUILD_TASKS.md §5 line 1).
8. **Persistence is out of scope**, same status as Lane C (`agents/lead/TASKS.md`): `DunningAccount` is an
   in-memory dataclass. No live Supabase project exists yet (COORDINATOR_STATE.md, G3 not started); once it
   does, `platform/CONTRACT.md`'s `app.subscriptions` / `admin.payment_transactions` rows are the natural
   place a caller reads/writes account state from between `advance()` calls.

## Not done / next
- Real Stripe and SendGrid clients (no credentials exist — TYLER_QUEUE.md §2 "Stripe" and "SendGrid" items).
- A scheduler/cron entry point that loads real accounts, calls `advance()` daily, and actually delivers
  `TylerNotification`s (e.g. email/Slack to Tyler) — this task built the state machine and its mocks only.
- Tier 4/5 (see Scope above) and the back-payment calculator (assumption 5).
