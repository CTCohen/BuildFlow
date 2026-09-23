---
title: Experimentation System
purpose: Authoritative spec and build checklist for A/B testing infrastructure across outbound, pricing, and features. Absorbs systems/17-experimentation-system.md from the original 19-system export.
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Experimentation System

A/B testing infrastructure for outbound campaigns, pricing/offers, and feature rollouts, meant to drive
optimization and product learning once there's enough traffic and customers to make tests statistically
meaningful. Identified as a real gap in `systems/AUDIT.md` (2026-09-22) — a grep for "A/B test" or "experiment"
across the other 14 (now 21) system files returned zero hits before this file existed. Explicitly post-launch
per the original spec's own override: nothing here is expected to be built yet, and nothing is.

**Code lives at:** nothing yet. Spec source: `operations/SPEC-17-experimentation.md` (copy of the original
export, unchanged).

## Built and verified
(none — no experimentation code exists in this repo; confirmed against `operations/BUILD_TASKS.md` and
`operations/COORDINATOR_STATE.md`, neither lists an experimentation/A-B-testing lane as started)

## Specified, not yet built
- [ ] A/B test framework: hypothesis structure ("If we [change X], then [metric Y] will [improve] because
  [reason]"), statistical rigor (pre-calculated sample size, 95% confidence, 80% power, Bonferroni correction
  for multiple comparisons, p<0.05 threshold, no audience overlap).
- [ ] Outbound campaign testing (Month 1 per the spec's cadence, first thing to test once launch happens):
  subject line/CTA/body-length/sender-identity/send-time/cadence variants, tracked via open/click/reply/bounce/
  unsubscribe/demo-view/conversion rate and time-to-conversion.
- [ ] Pricing & offer testing (Phase 2+, explicitly waits until after the price increase is decided per
  `BuildFlow/CLAUDE.md`'s pricing table note): price-point variants, offer variants (annual discount/trial/
  guarantee), messaging variants.
- [ ] Feature & onboarding testing: staged feature-flag rollout (5%→25%→50%→100%), onboarding flow variants,
  UI/UX variants, tracked via adoption/engagement/retention/support-ticket/task-completion metrics.
- [ ] Testing checklist and governance (pre-registered hypothesis, no early stopping, no ad-hoc analysis,
  post-test statistical review and guardrail check).
- [ ] Experimentation / Guardrail Agent (Agent Registry #15): computes sample size, checks the daily
  >10%-underperformance auto-kill guardrail, calculates p-value/CI/effect size at test end. Explicitly does
  NOT declare a winner or roll out a change — that stays Tyler's call per the original spec's governance
  section; the agent removes manual math, not decision authority.
- [ ] Tooling: email A/B split (SendGrid/Mailchimp/manual), feature-flag system (LaunchDarkly or custom),
  statistical calculator, event tracking schema (test_id/variant/timestamp per assignment) — none chosen or
  provisioned.

## Possible future specs (not built, not committed to)
- Continuous parallel-test portfolio management (Month 4+ per the spec's cadence, 1-2 running tests with
  quarterly portfolio review) — years out from being relevant at current scale.
- A living cross-motion playbook (winning outbound sequences/pricing/onboarding patterns feeding future tests)
  — depends on enough completed tests existing first.

## Open questions
- No experimentation work should start before real outbound traffic exists (there are zero live customers and
  zero real sends per `systems/outbound.md`'s "Specified, not yet built" section) — this system's entire
  backlog is correctly blocked on other systems going live first, not on its own design work.
- Feature-flag tooling choice (LaunchDarkly vs. custom) has real cost implications against the $50/mo
  constraint (see `systems/business-operations-financials.md`) and hasn't been decided.
