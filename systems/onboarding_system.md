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

## Corrected: what onboarding actually is (2026-09-22)

Superseded characterization, now wrong: onboarding as "moving their website from Cloudflare to our hosted
location." Per `systems/communications_system.md`'s "Open hosting-architecture question" (Tyler, 2026-09-22),
client static websites — demo AND once onboarded for Managed — **stay on Cloudflare permanently**. They never
migrate hosts. Onboarding is not a hosting migration.

**What literally happens at the moment someone converts**, read off the real payment→live pipeline
(`billing/fulfillment.py` + `platform/hosting/fulfillment.mjs`, the mechanical trigger this section hangs off):

1. **Stripe payment succeeds.** `billing/webhooks.py` receives the event (out of scope for this file to
   re-describe; see `billing/SPEC-08-payments-billing.md`).
2. **`billing/fulfillment.py`'s `build_fulfillment_event()` fires.** It builds a `site.fulfillment_requested`
   event (`FulfillmentEvent`, shaped exactly like a future `admin.events` row per `platform/CONTRACT.md`) keyed
   on `customer_id`, carrying `tier`, `billing_cycle`, `stripe_subscription_id`, `launch_cohort`, and the
   triggering Stripe event id. This is written to the ndjson queue (`write_events_ndjson`) — the stand-in
   transport until a real Postgres `admin.events` table exists (gate G3).
3. **`platform/hosting/fulfillment.mjs`'s `consumeFulfillmentEvent()` reads that event** (`readFulfillmentQueue`
   parses the same ndjson format independently — the format is the contract, not shared code) and:
   a. Calls the supplied `buildFn(payload)` — the site build step (design generation itself,
      `agents/design/design-agent.mjs`'s `renderSite`, is explicitly out of this module's scope; the fulfillment
      module just calls whatever build function it's given).
   b. On a successful build, runs `runDeployPipeline()` — deploy + assets + DNS/SSL + health check, on
      Cloudflare, **the same host the demo was already sitting on.** Nothing here points anything at Railway.
4. **What "goes live" means concretely:** the site's status flips from demo to live, and — this is the actual
   substance of onboarding, not a hosting move — **the site's forms start posting to a live backend (the
   Railway-hosted API) instead of nothing.** Before conversion, a demo site's quote-request form has nowhere
   real to send a submission (or posts into a sandboxed/fixture path only, per
   `platform/dashboards/lib/sandbox-dashboard.mjs`'s demo dashboard); after conversion, the same static HTML
   form now posts to the real `app.form_submissions` endpoint.
5. **Dashboard account provisioned.** The customer gets a real dashboard login (`app.customer_users` row mapping
   their Supabase Auth user id to their `customers` row, per `platform/CONTRACT.md`), replacing the read-only
   sandbox/demo dashboard (`buildSandboxDashboard`) they saw during the demo period.
6. **Any additional data/endpoints specific to their business get plugged in** — e.g. SMB's CRM integration
   (`app.crm_integrations` row, wired if they run a supported CRM), Micro's absence of that step, and whatever
   else `systems/dashboard_micro_system.md`/`systems/dashboard_smb_system.md` say their tier's dashboard needs
   live data for.

**What does not happen:** no file transfer, no DNS repoint of the client's own domain away from Cloudflare, no
"their site moves to our servers." The only infrastructure move here is conceptual — the site's forms gain a
real destination and the owner gains dashboard access. Railway is the destination for the backend/API and the
Fornax admin dashboard's own backend, not for any client's static site (confirmed by the same
communications_system.md note; also not the Fornax marketing site, which is planned static-on-Cloudflare too).

**Speed target:** `operations/BUILD_TASKS.md` §5's "Payment → live site fulfillment <60s" is this same pipeline,
not yet run against real Cloudflare/Stripe accounts (both dependencies still on mocks as of this pass).


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
  (`systems/outbound_system.md`'s open question).
- Whether the Day 0-30 sequence should be a standalone build task in `operations/BUILD_TASKS.md` (it currently
  isn't tracked as one at all) — flagging this gap rather than guessing why it's missing.
