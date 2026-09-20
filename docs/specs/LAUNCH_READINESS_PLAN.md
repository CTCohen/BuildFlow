---
title: BuildFlow — Launch Readiness Plan
purpose: The 8 remaining steps to BuildFlow launch, broken into sub-steps, mapped to the 19 locked systems + agent registry. Includes conflicts needing Tyler's decision and a consolidated Phase 2+ list.
status: active
owner: c.t.cohen
updated: '2026-09-18'
version: 1.0.0
tier_scope: all
phase: phase_1
spec_name: launch-readiness-plan
spec_aliases:
- launch plan
- launch checklist
- path to launch
- remaining steps
spec_sources:
- chat
spec_authority: authoritative (exported from claude.ai project memory 2026-09-17)
---

# BuildFlow — Launch Readiness Plan

## Purpose

Break Tyler's 8 remaining pre-launch steps into concrete sub-steps, each mapped to the specific locked system(s) that already define how to build it. Surface conflicts between the step list and locked specs before Claude Code starts implementing, so those get resolved by Tyler rather than silently decided by an agent. Consolidate what's explicitly deferred to Phase 2+ so it isn't lost or accidentally pulled into scope.

**Standing principle for Claude Code's implementation work:** the migrated specs are the authoritative starting point, not the finished depth. Where a spec states something at a high level (an integration named but not detailed to the endpoint/field level, a compliance requirement stated as a goal without the specific implementation pattern, etc.), Claude Code should research current documentation/best practice and fill the gap with real implementation-level detail — then write that detail back into the spec files themselves, not just into code, so the docs stay the authoritative reference as they deepen. See Step 2.7 for how this is gated.

## Contents

- The 8 steps, each broken into sub-steps with system references
- Suggested dependency order (what blocks what)
- Conflicts & decisions needed before/during implementation
- Consolidated Phase 2+ / future consideration list (pulled from across all 19 systems)

---

## The 8 Steps, Broken Down

### Step 1 — Migrate specs to the Claude Code venture

1.1. Unzip the current spec export (`buildflow-specs.zip`) into the BuildFlow Claude Code repo at a staging path like `docs/buildflow-specs/` — this is a landing spot, not the final home; final placement happens in Step 2.4 below, once each spec's corresponding module exists to receive it.
1.2. Before overwriting anything in the existing "buildflow lock" directory, snapshot it (git branch or plain copy) so nothing is lost if a reconciliation call (Step 2) turns out wrong.
1.3. Merge the included `CLAUDE.md` stub into the repo root so Claude Code knows to treat `docs/buildflow-specs/` as authoritative before writing code.
1.4. Commit the spec files to version control as their own commit, separate from any implementation changes — gives you a clean diff history as specs themselves evolve later.
1.5. Re-export from claude.ai memory any time a spec changes going forward (the zip is a snapshot, not a live sync — flagged already in the export's README).

### Step 2 — Claude Code unpacks, reconciles, and implements

2.1. **Reconciliation pass first, implementation second.** Have Claude Code read the existing buildflow-lock directory's current file/folder structure and code state, then diff it against the 19 systems + agent registry.
2.2. **Produce a conflict log, don't auto-resolve.** Anywhere the existing implementation contradicts a locked spec — naming, data model, architecture choice, pricing, agent design, folder layout — Claude Code should list it, not silently overwrite it. This matches your instruction: imported specs are authoritative, but conflicts come to you.
2.3. **You review the conflict log and rule on each item** before Claude Code proceeds past that point. Quick yes/no or pick-one calls, not open-ended re-litigation of decisions already locked in the specs.
2.4. **Folder/file structure derivation, and this is where specs get their permanent home.** Once conflicts are resolved, have Claude Code propose a repo layout that maps cleanly to the 19 systems (e.g., an `agents/` directory matching the Agent Registry's 15 agents, a `dashboards/` split for customer vs. admin per System 2's two-dashboard architecture, etc.) — approve the layout before code gets written into it. **Each system's spec file moves out of the `docs/buildflow-specs/` staging area into the module it governs** (e.g., System 08's payments spec lives with the billing module as `billing/SPEC.md` or equivalent, System 9/10's CRM specs live with the CRM integration code, System 4's design spec lives with the design/template engine) — so the doc a developer or agent needs is sitting next to the code it describes, not off in a disconnected reference folder. Cross-cutting files that don't belong to one module — `index.md`, `agent-registry.md`, `business-model-and-constraints.md`, `launch-readiness-plan.md` — stay at a root-level docs location since they span the whole repo. This is the concrete version of the documentation philosophy already in `preferences.md`: scope → implementation → execution should be readable in one place per module, not scattered.
2.5. **Derive the implementation task list.** This is where Claude Code should generate its own second-level breakdown per system (e.g., "System 8 tasks: Stripe monthly + annual Price objects, dunning state machine, MRR calc") — this document intentionally doesn't duplicate that; it's Claude Code's job once the reconciliation and folder layout are settled.
2.6. **Flag pre-launch open items separately from Phase 2+ items.** A few specs have genuine unresolved "TBD" items (see Conflicts section below and System 01's own "Open Items" list) — these need a decision before or during Step 2, not after launch.
2.7. **Research-driven gap-filling, ongoing through implementation.** Beyond reconciling conflicts against existing code, Claude Code should actively look for places where a spec is thin — an integration named without endpoint/field-level detail, a requirement stated as a goal without the specific pattern needed to satisfy it, an agent's prompt/logic described at the "what" level without the "how" — and research current documentation or best practice to fill it in. Write the added detail back into the relevant spec file, not just into code, so the docs keep pace with what's actually built. Routine implementation-level detail (e.g., "the ServiceTitan API's actual field name is X, not Y") doesn't need a human gate — just document it and move on. Anything that surfaces a real decision (not just a missing detail) goes through the same conflict-log process as 2.2–2.3.

### Step 3 — Build the agents and connect the APIs

3.1. **Build order by launch dependency**, not registry order:
   - First (blocks everything downstream): Design Agent, Design QA Agent, Design Discovery Agent — System 4, needed before any site can exist.
   - Second (GTM engine): Lead Scoring Agent, Lead Lookup Agent, Outreach/Copy Agent — System 7.
   - Third (revenue path): CRM Sync Agent — System 9/10; Dunning Agent — System 8.
   - Fourth (post-launch-safe, per spec's own phasing): OCR/Photo Intake Agent, Review Sync Agent, Lifecycle/Churn Agent, Support Triage, Feedback Triage, SEO/GEO Agent, Experimentation Agent — these are System 12/14/15/16/17/18 territory and several are explicitly Phase 1.5 already (photo intake) — don't let them block Day 1.
3.2. **Wire external APIs** as each agent needs them:
   - Cloudflare (Workers/Pages, DNS, R2/KV) — demo + live site hosting, System 3/6.
   - Stripe — billing (monthly + annual), System 8.
   - SendGrid — outbound email + dunning emails, System 7/8.
   - Apollo / Hunter.io — lead enrichment, System 7/18.
   - Google APIs — Places API (lead discovery, System 7), Google Business Profile API (review sync, System 12).
   - CRM APIs — ServiceTitan, Jobber, Housecall Pro, HubSpot, Successware (Phase 1 five) — System 9.
   - Twilio — SMS alerts, System 18.
3.3. **Build the retry/escalation/human-gate logic as specified**, not just the happy path — every agent in the registry has a specific retry ceiling and a human-in-the-loop trigger (Agent Registry Section F). Skipping these at build time is the most common way a "working demo" agent becomes a production headache.
3.4. **Write the eval suite before calling an agent done.** Agent Registry Section D sets a 15–20 hand-built test case minimum per agent pre-launch (obvious case, edge case, failure case) — this is cheap now and expensive to retrofit after agents are live and making real decisions.
3.5. **Wire System 13's four monitoring jobs to actually ingest from these agents** as they're built, not as an afterthought — otherwise Step 8 (end-to-end testing) has no observability to test against.

### Step 4 — Website design system for all 3 tranches, with looped testing + self-improvement

4.1. Build the 4 vertical base templates (plumbing, HVAC, electrical, roofing) per System 4 Section 1's wireframe structure.
4.2. Implement tranche feature-gating on top of those templates per System 5 Section 1 (Micro/SMB/Mid-Market component sets) — one template system with feature flags, not three separate template sets.
4.3. Build the 10 styling profiles (System 4 Section 6) as swappable design-token sets layered on the base templates.
4.4. Build the Design Discovery Agent crawl-and-extract pipeline (System 4 Section 5) so brand preservation works before real customers onboard.
4.5. Build the customization layer sliders (System 4 Section 7) — color/font/spacing controls.
4.6. **"Looped testing" = the Design QA Agent evaluator-optimizer loop** (System 4 Sections 2–3, Agent Registry #3): Lighthouse + axe automated gate, max 2 retries, escalate to you on the 3rd failure. Build this loop itself, not just the checks.
4.7. **"Automated self-improvement" = the QA feedback loop** (System 4 Section 3): log every rejection reason, run the monthly "top 3 failure modes" review, and feed those learnings back into the Design Agent's prompt. This is a real pipeline to build (a rejection-reason log + a monthly aggregation job), not just a manual habit.
4.8. Before calling this step done, smoke-test the full matrix: at least one generation per vertical × tranche × styling-profile combination (4 × 3 × 10 = 120 combinations is the full matrix; a representative sample — e.g., every vertical at every tranche with 2–3 styling profiles each — is a reasonable launch bar rather than all 120).

### Step 5 — Record onboarding and offboarding videos

5.1. Script from System 6 Section 5 (first-login dashboard tour, onboarding checklist) and System 12 Section 1 (the 30-day journey) — the script already exists in the specs, this is filming, not writing.
5.2. Record the **Managed** onboarding walkthrough: dashboard tour, customizing name/services/photos, CRM connection flow.
5.3. Record the **Offboard** handoff video: domain ownership transfer, what "no ongoing support" means in practice, where to get help if they get stuck.
5.4. Record tranche-specific segments only where the dashboard genuinely differs (Mid-Market's custom stages/lead scoring/task assignment aren't in Micro/SMB) — don't produce three full separate videos if 80% of the walkthrough is shared.
5.5. Host and link: embed in the welcome email sequence (System 6 Section 5) and the Help Center (System 14 Section 2, which already calls for 2–3 min videos as a content format).

### Step 6 — Build BuildFlow website, dashboard, logo, admin app, customer app

6.1. **Logo/brand identity** — not currently specified anywhere; this is a new prerequisite. Needed before the marketing site (6.2) and the design system's own "Professional Service" default styling profile can be finalized, since BuildFlow's own brand informs tone.
6.2. Marketing website (buildflow.io) per System 19 — Home, Features, Pricing, Demo, Blog (first 3 posts), Docs, About. Phase 1 scope only (System 19's own roadmap section).
6.3. Customer dashboard (app.buildflow.com) per System 2's two-dashboard architecture, System 6 Section 5's first-login UX, and System 4 Section 7's customization sliders.
6.4. Admin web dashboard (admin.buildflow.com) per System 18 Section 8's web-admin feature list + System 13's dashboard layout.
6.5. Admin iOS app per System 18 — confirmed staying on the spec's original phasing: web admin ships at launch, iOS app (photo intake) follows in Phase 1.5, not a launch blocker (see Resolved Decisions below).
6.6. Customer mobile app — confirmed Phase 2+, targeted for a few months post-launch, not in launch scope (see Resolved Decisions below and Phase 2+ list).

### Step 7 — Build market tranche dashboards

7.1. Confirmed: this is a feature-flag layer inside Step 6.3's single customer dashboard, not a separate build (see Resolved Decisions below) — one component library, tranche determines which features render. Higher tier = more features exposed, not a different codebase.
7.2. Micro: lead inbox only, text-only content editing (business-model-and-constraints.md Part 2).
7.3. SMB: + editable Notes, simple Pipeline (new/contacted/converted), image uploads, CRM config UI.
7.4. Mid-Market: + custom pipeline stages, lead scoring display, task assignment, advanced filtering/bulk actions, multi-CRM config.

### Step 8 — End-to-end testing

8.1. Full funnel dry run: lead discovery → scoring → outreach → demo generation → demo tracking → conversion (test both monthly **and** annual checkout paths) → fulfillment → CRM sync → onboarding email sequence → dashboard access.
8.2. Run the eval suites built in Step 3.4 for all launch-blocking agents.
8.3. Dry-run the full Dunning lifecycle (System 8 Section 6) — simulate a failed payment through Tiers 1–3 at minimum before launch; Tiers 4–5 (legal escalation) can be validated by document review rather than a live test.
8.4. If photo intake is in launch scope (see Step 3.1's Fourth tier — it doesn't have to be): full OCR → lookup → score → build → demo cycle, confirm it lands inside the 2-minute budget (System 18 Section 9).
8.5. WCAG audit on a sample of generated sites + a data-isolation test (System 11 Section 4 — confirm customer A genuinely cannot see customer B's data) + auth flow test.
8.6 Basic load smoke test: generate a batch of demos concurrently, confirm Cloudflare/Cloud Run hold up (System 3).
8.7 Confirm System 13's monitoring dashboard is actually populating from real events, not just test fixtures.
8.8 Consider a small soft-launch cohort (a handful of real prospects) before the first full outbound batch — catches integration issues a synthetic test won't, and costs almost nothing given the near-zero demo cost (business-model-and-constraints.md Part 3).

---

## Suggested Dependency Order

Not a rigid schedule — a guide to what can run in parallel vs. what blocks what, to help hit your 2–4 week estimate:

1. **Steps 1 → 2 are strictly sequential and block everything else.** Nothing else should start until the conflict log is resolved.
2. **Steps 3 and 4 can run mostly in parallel** once Step 2 clears — except Step 4 depends on Step 3.1's "First" tier (Design Agent + Design QA Agent) specifically, so that slice of Step 3 has to lead.
3. **Step 6 depends on Steps 3 and 4** being functional enough to actually render a site and drive a dashboard — it can start on scaffolding/logo/marketing-site work earlier, but the customer/admin dashboards need working agents underneath them.
4. **Step 7 is not a separate phase** — it's a feature-flag layer inside Step 6.3, so it finishes when Step 6.3 does, not after.
5. **Step 5 comes near the end** — you need a working dashboard to film a walkthrough of.
6. **Step 8 is the gate** — nothing ships until it passes, and it necessarily touches everything built in 3, 4, 6, and 7.

---

## Resolved Decisions (Formerly Open Conflicts)

**Customer mobile app.** Confirmed Phase 2+, targeted for a few months after launch — not in launch scope. Launch ships web-only for customers, matching System 5 Section 3's original deferral. Added to the Phase 2+ list below with the rough timeframe.

**Admin iOS app timing.** Confirmed staying on System 18's original phasing: web admin (admin.buildflow.com) ships at launch; the iOS app (photo intake specifically) follows in Phase 1.5, shortly after. Not a launch blocker.

**Tranche dashboards.** Confirmed as one customer dashboard with a feature-flag layer, not three separate builds. Tranche difference is which features render — higher tier exposes more features (Micro → SMB → Mid-Market is additive, per Step 7's breakdown), not a different underlying dashboard.

---

## Consolidated Phase 2+ List (Pulled From All 19 Systems — For Later, Not Launch)

- **Verticals:** landscaping, cleaning, pest control, automotive, security/infrastructure (business-model-and-constraints.md)
- **CRMs:** remaining 7 of the top-10 trades CRMs beyond the Phase 1 five; Pipedrive, Zendesk, Salesforce (System 9/10)
- **CRM sync:** two-way sync, custom field mapping UI, Zapier integration, webhook support, conditional sync (System 9/10)
- **API/Partners:** public API, webhook system, referral/integration/white-label partner programs (System 10's original scope, now understood as customer-CRM-only for Phase 1)
- **Pricing experiments:** price-point A/B tests, offer testing beyond the now-locked annual option (System 17)
- **Feature system deferrals:** white-label/reseller, partner API access, geo-fence lead scoring, customer-triggered email campaigns, multi-language, custom development, offline functionality (System 5)
- **Customer mobile app:** confirmed Phase 2+, targeted a few months post-launch (System 5 Section 3 original deferral, reconfirmed this session)
- **SEO tooling:** premium keyword-ranking tool (SEMrush-tier) once revenue allows (System 16)
- **Website content:** Content Agent for blog automation once posting volume justifies it (System 19 / Agent Registry)
- **Compliance:** SOC 2 Type II at 10–50 customers / $3–5K ARR; GDPR if EU customers appear (System 11)
- **Hiring:** first hire at $100k annual profit, team build-out at $150k+ (System 01)
- **Design:** full 120-combination (4 vertical × 3 tranche × 10 profile) test matrix, if the launch smoke-test sample surfaces no issues worth full coverage sooner (System 04)
- **Open items never formally decided** (carried from System 01): spend-approval thresholds, tool sunset policy, training/onboarding budget per hire, remote-hiring policy, formal CAC/LTV targets, multi-year (Y2/Y3) revenue projections
