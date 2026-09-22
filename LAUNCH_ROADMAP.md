---
title: Launch Roadmap
purpose: Detailed roadmap for product launch sequence and milestones
status: active
owner: c.t.cohen
updated: '2026-09-18'
version: '1.0'
tier_scope: smb
phase: phase_1
critical_path: true
related:
- ROADMAP.md
- PHASE_1.md
---

# Launch Roadmap — every step of the spec launch plan

> Rebuilt 2026-09-18. Source: `docs/specs/LAUNCH_READINESS_PLAN.md` (8 steps, all sub-steps). Rulings applied: Mid-Market paused, English-only launch,
> one CRM first (HubSpot), lead agents built with their infrastructure, manual dunning first. Legend: ✔ done · ◐ partly · ☐ to do · ⏸ deferred.
> The pre-spec roadmap is kept at the bottom as history; its still-valid items are carried in the "Carry-over" section.

**Standing principle:** the specs are the starting point, not the finished depth. Where a spec is thin, research current docs and write the detail back into the spec.

## The 8 steps
**Step 1: Migrate specs** — 1.1 ✔ unzip · 1.2 ✔ snapshot (tag `pre-spec-reconciliation`, branch `spec-reconciliation`) · 1.3 ✔ snippet merged into `CLAUDE.md` · 1.4 ✔ specs committed separately (6913061) · 1.5 ◐ re-export process: the repo copy is now the source of truth.

**Step 2: Reconcile, then implement** — 2.1 ✔ reconciliation pass · 2.2 ✔ conflict log (`RECONCILIATION_LOG.md`) · 2.3 ◐ Tyler's rulings (D06, D14, D15, D42 done; the rest provisional) · 2.4 ✔ specs moved beside their modules · 2.5 ☐ implementation task list per system (`TASKS.md` in each module) · 2.6 ☐ pre-launch open items vs Phase 2+ · 2.7 ☐ research-driven gap-filling, written back into specs.

**Step 3: Agents and APIs** — 3.1 ☐ build order: first Design, Design QA, Design Discovery; second Lead Scoring, Lead Lookup, Outreach/Copy (with their infrastructure); third CRM Sync and Dunning; fourth OCR, Review Sync, Lifecycle, Support and Feedback Triage, SEO/GEO, Experimentation · 3.2 ☐ wire APIs: Cloudflare, Stripe, SendGrid, Apollo/Hunter, Google Places and Business Profile, CRM (HubSpot first), Twilio alerts · 3.3 ☐ retry, escalation and human-gate logic per registry Section F · 3.4 ☐ eval suite (15–20 cases) per agent before "done" · 3.5 ☐ System 13 monitoring jobs ingest agent runs.

**Step 4: Design system, looped testing** — 4.1 ☐ four vertical base templates (existing SMB system as base) · 4.2 ☐ tier feature-gating (Micro, SMB; Mid-Market ⏸) · 4.3 ☐ 10 styling profiles (curate the existing 30 themes) · 4.4 ☐ Discovery Agent crawl-and-extract · 4.5 ☐ customization sliders (SMB only) · 4.6 ☐ Design QA evaluator-optimizer loop (max 2 retries, escalate on the 3rd failure) · 4.7 ☐ rejection-reason log + monthly top-3 failure-mode job · 4.8 ☐ smoke-test matrix (every vertical × built tier × 2–3 profiles; full 120 is Phase 2+).

**Step 5: Videos** — 5.1 ☐ scripts from System 6 §5 and System 12 §1 (existing scripts in `onboarding/`) · 5.2 ☐ Managed walkthrough · 5.3 ☐ Offboard handoff · 5.4 ☐ tier-specific segments only where the dashboard differs · 5.5 ☐ host and link in welcome emails and Help Center.

**Step 6: Website, dashboards, logo** — 6.1 ☐ logo and brand identity · 6.2 ☐ marketing site (System 19) · 6.3 ☐ customer dashboard · 6.4 ☐ admin web dashboard · 6.5 ⏸ iOS admin app (Phase 1.5) · 6.6 ⏸ customer mobile app (Phase 2+).

**Step 7: Tier dashboards** — 7.1 ☐ one dashboard with a feature-flag layer · 7.2 ☐ Micro: lead inbox, text-only editing · 7.3 ☐ SMB: + notes, simple pipeline, image uploads, CRM config · 7.4 ⏸ Mid-Market (custom stages, scoring display, task assignment, bulk actions, multi-CRM).

**Step 8: End-to-end testing (the gate)** — 8.1 ☐ full funnel dry run (monthly and annual) · 8.2 ☐ agent eval suites · 8.3 ☐ dunning tiers 1–3 live, 4–5 by document review · 8.4 ⏸ photo-intake cycle · 8.5 ☐ WCAG sample, data-isolation, auth · 8.6 ☐ load smoke test · 8.7 ☐ monitoring populated by real events · 8.8 ☐ soft-launch cohort (the 5 Phoenix HVAC prospects, re-priced).

**Dependency order:** Steps 1→2 block everything. Steps 3 and 4 run mostly in parallel once 2 clears, but 4 needs Design and Design QA from 3.1 first. Step 6 needs 3 and 4 functional; scaffolding, logo and marketing site can start earlier. Step 7 finishes with 6.3. Step 5 comes near the end. Step 8 is the gate.

## Phase 1 launch gate (business model Part 9; all must be complete)
Data Model · Agent Orchestration · Design System · Feature System (Micro and SMB) · Pricing · Hosting Decision · Payment Processor · Compliance · CRM Integration (one CRM: HubSpot) · Demo System.
Open questions to close before code: hosting (ruled), conversion validation (2–5%, measure Months 1–3), lead-scoring accuracy ≥80%, churn ≤8%/mo, CAC by channel.

## Carry-over from earlier roadmaps (not in the specs, still valid)
1. Onboarding automation: Stripe webhook → Day 0 sequence → intake form → build → preview with approve/request-changes → auto-launch rule → monthly check-in; nudge and hard-stop for an unfinished intake.
2. Offboarding automation (does not exist yet): the Offboard export mechanism (zip or one-click deploy to the client's host), Managed cancellation flow (live to period end, takedown, win-back at +30/+60 days), data retention and deletion.
3. Pass 0 capability loop (`docs/capability-buildout.md`): Build → Test → Learn rounds on Phoenix HVAC samples; exit criteria feed Steps 4.6–4.8.
4. Wire the stubbed QA checks (Lighthouse, layout sanity, rubric); calibrate on the first ~10 sites; visual-regression baselines.
5. SEO and AI-SEO automation folded into the QA gate; define AI SEO (llms.txt, FAQ schema, entity consistency); decide Google Business Profile ownership.
6. Trade packs: HVAC complete; plumbing, electrical partial; roofing missing. Each before outreach in that trade.
7. Synthetic dry runs across trades before the first real client.
8. Business plan docs: unit economics, TAM/SAM/SOM, capacity plan, churn plan, one consolidated `BUSINESS_PLAN.md`.
9. Monitoring and uptime, support intake, backup and disaster recovery (now System 13/14/11 items).

## Cadence (from the specs)
Monthly Business Review (1st Friday) · quarterly review · weekly pipeline report · monthly QA failure-mode review, feedback triage, feature metrics, help-center review, SEO run · daily delinquency metrics.
Monitoring rollout by customer count: pre-launch = health check + alerts + basic dashboard; 10 customers = business metrics job; 50 = anomaly detection.
The spec's Month 1–12 revenue projection assumed 20% Mid-Market by revenue and must be re-cut before use as a target (`metrics/METRICS.md`).

---

## Superseded pre-spec roadmap (2026-09-10, kept for history)

# Launch Roadmap — what's between here and a tight, strong launch

> Single continuous roadmap: current Phase 1 blockers through full-volume launch readiness.
> §0 is pulled from `PHASE_1_BLOCKERS.md` (kept as the detailed/live-updated version — check
> there for the latest state); §1–5 is pre-launch hardening. Last updated: 2026-09-10.

**Current foundation (already real, not aspirational):**
- Multi-tenant Astro app with a design-decision engine (`app/src/lib/design-decision-engine.ts`,
  `agent-decisions.ts`, `conditional-features.ts`) and a token system
- Automated per-client QA gate (`app/scripts/qa.mjs`) with 9 checks incl. an LLM rubric pass
- `knowledge/` base: trade-specific SEO/content knowledge (HVAC fully built), SOPs, principles
- Legal (Terms/Privacy/Security), reconciled sales + messaging stack, [domain TBD under Fornax name] site (built, undeployed)
- Competitive research (`research/COMPETITIVE-ANALYSIS.md`), delivery model with real market pricing rationale

**What "launch" means here:** ready to run outreach at real volume (50+/week) and have every
resulting site, onboarding, and cancellation handled without Chase doing manual one-offs.

---

## 0. Phase 1 — immediate blockers (before the first 5 emails go out)

✅ **Resolved:** pricing contradiction across legal/sales/messaging — commits `9ee7f8e`, `aff977b`.

🔴 **Needs Chase (external accounts, only he can do):**
| # | Blocker | Action |
|---|---------|--------|
| B1 | No Calendly link | Create it; replace `[CALENDLY_LINK]`/`[CALENDAR_LINK]` placeholders in outreach + messaging docs |
| B2 | Outreach not sent | Send the 5 emails in `outreach/REAL_PROSPECTS_READY_TO_SEND.md` |
| B3 | No Stripe products | Create $99/mo subscription + $497 one-time; get checkout links |
| B4 | No business email addresses | `hello@`, `support@`, `legal@`, `chase@[domain TBD under Fornax name]` need to exist |
| B5 | Domain not confirmed | Confirm [domain TBD under Fornax name] registered + DNS-pointable to Railway |
| B6 | Terms missing business address | `legal/TERMS_OF_SERVICE.md` §16 placeholder needs a real address |

🟡 **Needs a decision:**
| # | Blocker | The call |
|---|---------|----------|
| D1 | "Ownership" messaging pillar in `EMAIL-HOOKS.md` still leads with "you own it" | Reframe or drop — undercuts the subscription pitch |
| D2 | `outreach/PHASE_1_EXECUTED_EXAMPLE.md` fictional narrative still on old pricing | Update to $99/mo or move to `archive/` |

🟢 **Claude can do — done this session:**
- Website rebuilt on $99/mo model (`c206286`), not yet deployed (needs approval — publishes public content)

**Critical path to first revenue:** B1 + B6 → B2 (send) → replies → B3 (bill) → close → build → launch.
Full detail and dependency graph: `PHASE_1_BLOCKERS.md`.

---

## 1. Website: perfect it + automate onboarding + automate offboarding

### 1a. [domain TBD under Fornax name] — remaining polish
- [ ] Deploy to Railway, point [domain TBD under Fornax name] once domain is confirmed (see Blockers B5)
- [ ] Replace `mailto:` CTAs and the Formspree placeholder with a real signup flow (ties to §5 billing)
- [ ] Add real case studies once Phase 1 sites exist (the 3 on the page today are illustrative, not real — label them as such or swap in real ones the moment they exist)
- [ ] `og:image` referenced in `Layout.astro` doesn't exist yet — needed for link previews when emails get forwarded/shared

### 1b. Automated onboarding (Managed Growth — recurring clients)
**Today:** 5 video scripts + email sequence exist as content, but nothing *triggers* them. A human has to notice a close happened and manually send things.

- [ ] Trigger: Stripe subscription `checkout.session.completed` webhook → kicks off Day 0 sequence automatically
- [ ] Day 0: welcome email + intake form (business info, logo upload, photos, services, hours) — currently this is "email us your info," should be a form that writes straight into `content/<slug>/`
- [ ] Day 1–3: automated build using `new-client.mjs` scaffold + design-decision-engine, gated by `qa.mjs` before anything is shown to the client
- [ ] Day 3–5: preview link auto-sent, approve/request-changes captured (not just "reply if you don't like it")
- [ ] Day 7: auto-launch if approved or no response (per `operations/SITE-BUILD-WORKFLOW.md`'s existing "approved by inaction" rule) + onboarding video emails fire on schedule
- [ ] Ongoing: monthly check-in email auto-scheduled; content-edit requests (email in) need a lightweight intake → apply → confirm loop, not ad hoc
- [ ] Failure path: what happens if intake form is never completed? Needs a nudge sequence + a hard stop (don't build on missing/garbage data — `qa.mjs` check 3 already blocks this, good)

### 1c. Automated offboarding — **does not exist yet, needs to be built from scratch**
Two distinct offboarding paths, currently undocumented:

- [ ] **Ownership plan (the $497 one-timer):** define the actual export mechanism. What does "static export to their own host" mean technically — a zip of built HTML/CSS/assets? A one-click deploy to Netlify/Vercel under their account? Needs a real script, not a promise in the Terms. Plus: 1-month transition-support tracking (who pings them, when does support end, what's the "you're on your own now" email).
- [ ] **Managed Growth cancellation:** Terms say "site goes offline at end of paid period" — needs an actual automated flow: cancellation received → confirmation email → site stays live until period end → auto-takedown → win-back email at +30/+60 days → optional paid static-export-on-cancel (upsell to Ownership pricing, per Terms §4)
- [ ] Data retention/deletion on offboarding — Privacy Policy commits to specific handling; nothing automated enforces it yet

**This is a real gap.** Legal docs already promise both flows exist; right now neither is automated, and Ownership's export mechanism isn't even specified technically.

---

## 2. SEO & AI SEO

**Today:** `knowledge/principles/local-seo.md`, `ai-seo.md` and `knowledge/sops/seo-audit.md`,
`ai-seo-setup.md` exist — but they're short (~30 lines each) human-run playbooks, not automated
per-client execution. Nothing runs these against a generated site automatically.

- [ ] Turn `seo-audit.md` and `ai-seo-setup.md` from SOPs into scripted checks — fold into `qa.mjs` (schema markup present, meta tags complete, sitemap/robots.txt correct, canonical tags, structured data for LocalBusiness/Service) rather than a human reading a checklist per client
- [ ] Google Business Profile: today it's "we provide guidance in onboarding videos" — decide whether Fornax claims/manages it directly (stronger offer, more liability) or stays guidance-only (weaker, but matches "we promise machinery not results")
- [ ] AI-search optimization ("AI SEO" is in the priced offer) — needs a concrete, defensible definition: llms.txt (already exists at `app/src/pages/llms.txt.ts` — good), structured FAQ schema, clear entity/NAP consistency. Write down what Fornax actually *does* here before selling it as a line item.
- [ ] `knowledge/trades/hvac/` is fully built out (must-haves, keyword-map, page-map, trust-signals, seasonal). **Only HVAC.** Plumbing, electrical, roofing, cleaning, etc. need the same depth before outreach expands past HVAC — right now quality is trade-uneven.
- [ ] Ongoing SEO (the recurring part of the $99/mo promise) needs a monthly automated task per client, not a one-time setup — currently nothing runs "ongoing."

---

## 3. Automated site generation — make "very high quality" the normal result, not the best case

**Today:** design-decision-engine + token system + QA gate + LLM rubric are real and reasonably
sophisticated. The gap is **calibration against real output**, which can't happen without real
clients — this is a chicken-and-egg the roadmap has to name honestly.

- [ ] Run the pipeline end-to-end on 5–10 *synthetic* businesses across different trades (not just HVAC) before the first real client — catch failure modes now, not on a paying customer's site
- [ ] Tighten `qa.mjs`'s LLM rubric thresholds using those synthetic runs — right now the thresholds are set from the plan, not from observed output distribution
- [ ] Visual regression baseline (`routines/testing.md` calls for Playwright screenshots against baselines) — confirm this is actually wired into CI, not just described
- [ ] Decide the human-review gate: does every site get a human glance before going live in Phase 1 (likely yes, at this volume), and when does that stop being required as trust in the automation grows?
- [ ] Logo-first design extraction (`design/LOGO-FIRST-DESIGN.md`) — confirm this is implemented in `design-decision-engine.ts` or still aspirational; it's a named differentiator in the plan and needs to actually run

---

## 4. Business plan & market research

**Today:** `docs/delivery-model.md` has real pricing rationale from market research;
`research/COMPETITIVE-ANALYSIS.md` exists. What's missing is a single coherent plan a buyer,
partner, or Chase-in-six-months could read end to end.

- [ ] **Unit economics doc:** cost to acquire (time per close × hourly value), cost to serve (hosting cost/client, support time/client/month), margin at $99/mo and at $497, breakeven client count, churn assumption and its effect on LTV. None of this is written down as numbers yet.
- [ ] **TAM/SAM/SOM** — how many HVAC/plumbing/electrical/etc. businesses in target metros lack a good site; realistic capture rate. `research/COMPETITIVE-ANALYSIS.md` has competitor detail but not market sizing.
- [ ] **Capacity plan** — how many concurrent Managed Growth clients can one person (Chase) support at acceptable quality before support automation (Phase 3–4 in `ROADMAP_PHASES_1-6.md`) becomes mandatory, not optional
- [ ] **Churn/retention plan** — $99/mo only works if churn is low; nothing currently addresses why a client stays past month 2 beyond "we handle their edits"
- [ ] **Consolidate into one document** — right now business logic is spread across `delivery-model.md`, `CLAUDE.md`, `ROADMAP_PHASES_1-6.md`, `GOVERNANCE.md`, and this file. A single `BUSINESS_PLAN.md` that a bank, investor, or acquirer could read cold doesn't exist yet.

---

## 5. Other pre-launch essentials (not explicitly asked for, but load-bearing)

- [ ] **Billing automation** — Stripe subscription + one-time products don't exist yet (Blocker B3). Failed-payment handling, dunning, and the suspend-after-10-days rule in the Terms need to actually run, not just be written down.
- [ ] **A real pipeline/CRM** — prospect tracking is currently markdown tables (`outreach/PROSPECT_LIST_PHASE_1.md`). Fine for 5 prospects, breaks at 50+/week. Needs at minimum an Airtable base (already the stated Phase 1 tool per `CLAUDE.md`) actually set up, not just referenced.
- [ ] **Monitoring/uptime** — the Terms promise 99.5% uptime and 48-hour breach notification. Nothing currently watches for either. Minimum: uptime pings per client domain, an alert channel.
- [ ] **Support intake** — `support@[domain TBD under Fornax name]` is promised with 24–48hr response in the Terms. Needs to actually route somewhere Chase checks, ideally with a lightweight ticket/thread tracker so nothing falls through at 10+ clients.
- [ ] **Backup/disaster recovery** — Terms promise daily backups retained 30 days. Confirm Railway/whatever host actually does this, or it's a liability, not a feature.
- [ ] **A soft-launch cohort** — before opening the floodgates, is there a plan to run the first 5–10 clients (Phase 1 itself) as a deliberate calibration cohort with extra hand-holding, explicitly to surface the gaps in §1–3 before scaling outreach volume?

---

## Suggested sequencing

1. **Now → before first close:** §1b trigger + intake automation (can't onboard a real client cleanly without it), §5 billing (can't collect money without it), §3 synthetic-business dry runs (cheap insurance before a real client sees the output)
2. **Before scaling past ~10 clients:** §1c offboarding (someone *will* cancel), §2 SEO automation + multi-trade knowledge depth, §4 unit economics + capacity plan (need real numbers to know if scaling is even a good idea)
3. **Before scaling past ~30–50 clients:** §5 monitoring, support ticketing, real CRM — this is roughly where Phase 3–4 automation from `ROADMAP_PHASES_1-6.md` becomes mandatory rather than nice-to-have

**Note on Phase 1 vs this roadmap:** none of §1c, §2's automation, §3's calibration, or §4's
unit economics has to be *finished* before sending the first 5 emails — but §1b (onboarding
trigger) and §5 (billing) do, because the moment someone says yes, there's currently no
automated path to actually deliver and bill them.
