---
title: Client Onboarding System
purpose: Authoritative spec and build checklist for the 30-day post-purchase customer journey. Superseded/absorbed from onboarding/SPEC-12-customer-lifecycle.md (System 12), Section 1.
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Client Onboarding System

Takes a customer from Stripe payment confirmed to a live, working relationship with their site: a Day 0-30
automated email and dashboard sequence that gets them their first leads and their first content edit, with a
success milestone at Day 30. Spec source: `onboarding/SPEC-12-customer-lifecycle.md` Section 1 (System 12).
Code location once built: expected under `onboarding/` (folder exists, currently spec files only) plus the
billing→hosting pipeline for the Day 0 trigger.


**Code lives at:** `onboarding/`, `billing/webhooks.py`, `platform/dashboards/lib/demo-tracking.mjs`

**Flow diagram:** `docs/workflow-graph.html` (needs refresh — stale as of 2026-09-22) shows the payment →
onboarding → Day 0-30 sequence this system runs; treat its visual sequencing as unconfirmed until refreshed.

## Built and verified
- (none — no onboarding-specific code exists yet per `operations/BUILD_TASKS.md`, which does not list an
  onboarding build task at all. The billing side of Day 0 — a webhook firing on payment success — exists as
  `billing/webhooks.py`, 12/12 evals passing as part of billing's 42/42 suite (`python3 -m billing.run_evals`),
  but it stops at delinquency/dunning handling; it does not yet trigger a welcome email or Day-0 sequence.)

## Specified, not yet built
- [ ] Day 0: purchase confirmed → welcome email — blocked on SendGrid credential (no account exists, same
  blocker as outbound send, `operations/BUILD_TASKS.md` §4) and on this sequence not yet being scoped as a
  build task anywhere in BUILD_TASKS.md
- [ ] Day 1: first login, guided tour — not built, no dashboard UI exists yet (dashboards are view-model layers
  only per BUILD_TASKS.md §7, not rendered UI)
- [ ] Day 3: customization check-in email — not built
- [ ] Day 7: first-leads milestone email — not built; depends on demo/lead tracking, which exists
  (`platform/dashboards/lib/demo-tracking.mjs`, 9/9 tests) but is not wired to an onboarding trigger
- [ ] Day 15: mid-point engagement check (5+ leads?) → conditional tips email — not built
- [ ] Day 30: success confirmation (10+ leads AND 2+ edits) → "you've launched" email — not built
- [ ] Success milestones by tranche (Micro: Week1=5 leads/Month1=20 leads+1 conversion/Month3=100+ leads; SMB:
  Week1=CRM working/Month1=30+leads+2 conversions/Month3=200+leads; Mid-Market: deferred per Tyler's 2026-09-18
  override) — not built
- [ ] Engagement signal tracking (site visits, lead captures, customer edits, form CTR/completion) feeding the
  onboarding sequence — the underlying demo/analytics tracking exists but is not wired to onboarding logic
- [ ] Payment→live fulfillment under 60 seconds, the mechanical trigger this sequence hangs off of — listed in
  BUILD_TASKS.md §5 as `[ ]` "Payment → live site fulfillment <60s [depends: Cloudflare hosting §2, Stripe §5]",
  itself not yet done (both dependencies are on mocks, not real accounts)
- [ ] Onboarding Agent / Outreach-Copy-Agent personalization for the Day 0-30 sequence (spec: "uses
  Outreach/Copy Agent (Agent Registry #7) for personalization; trigger logic stays a deterministic workflow")

## Possible future specs (not built, not committed to)
- Video tutorials as an onboarding channel (spec lists this as one of four channels alongside email, dashboard
  prompts, and 1-on-1 support-on-request) — no video content exists
- 1-on-1 support on request during onboarding — depends on `operations/SPEC-14-customer-support.md` being built
  out, not reviewed in this pass

## Open questions
- Whether onboarding milestone thresholds (5/20/100 leads for Micro, etc.) are realistic pre-launch numbers or
  need revisiting once real lead volume exists — same caveat as Outbound's tier cutoffs
  (`systems/outbound.md`'s open question).
- Whether the Day 0-30 sequence should be a standalone build task in `operations/BUILD_TASKS.md` (it currently
  isn't tracked as one at all) — flagging this gap rather than guessing why it's missing.
