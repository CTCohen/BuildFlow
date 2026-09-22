---
title: Fornax Spec Reconciliation Log
purpose: Line-by-line reconciliation of the buildflow-specs export (authoritative) against the existing workspace, with recommendations awaiting Tyler's determinations
status: active
owner: c.t.cohen
updated: 2026-09-18
version: 2.0.0
tier_scope: all
phase: phase_1
critical_path: true
related: [buildflow-specs/index.md, buildflow-specs/launch-readiness-plan.md, DECISIONS.md]
---

# Fornax Spec Reconciliation Log (v2)

**Rule:** the spec export is authoritative. Nothing in the workspace is changed until Tyler rules on Section 4.
**Supersedes:** the v1 log and `IMPLEMENTATION_ROADMAP.md` (both written before the specs were fully read).

## 0. Status after application (2026-09-18)

The workspace was updated from the specs on branch `spec-reconciliation` (tag `pre-spec-reconciliation` is the snapshot). Nothing is committed or deployed. Proof: `python3 governance/manifest.py --check` (every file classified, none pending) and `python3 governance/enforce.py --lint` (no retired terms). Live file list: `docs/specs/APPLICATION_MANIFEST.md`.

| Status | Decisions |
|---|---|
| **Ruled by Tyler and applied** | R1-R15 above; D06 ($150K annual profit); D14 (deterministic-first, $30/mo API cap); D15 (English-only launch); D42 (re-baseline Phase 1) |
| **Applied as my recommendation (provisional; reply to reverse)** | D01 (Tyler; sender address still open), D03, D04, D07, D08, D10, D11, D12, D13, D16, D17, D18, D19, D20, D21, D23, D24, D25, D27, D28, D30, D31, D33, D35, D36, D37, D38, D39, D40, D41, D43 |
| **Applied, needs your input to finish** | D02 (increase timing and numbers), D05 (build budget number), D22 (confirm HubSpot), D26 (which "GEO"), D29 (Mid-Market-size leads), D32 (domains you own) |
| **Not built yet (documented in plan)** | Platform code, agents, billing, CRM, dashboards; these follow `ROADMAP.md` |
Open items are also listed in `operations/TYLER_QUEUE.md`.

## 1. Coverage: what was read and where it lands

All 27 files were read in full (198 KB). "Blocked by" = decisions in Section 4 that must be ruled first.

| Spec file | Read | Applies to (proposed home) | Blocked by |
|---|---|---|---|
| index.md, README.md, CLAUDE.md (snippet), preferences.md | ✔ | root `CLAUDE.md`, doc conventions (3-section format: purpose / contents / specs) | D01 |
| business-model-and-constraints.md | ✔ | `docs/BUSINESS_MODEL.md`; `CLAUDE.md`; `DECISIONS.md` | D02–D08, D10 |
| launch-readiness-plan.md | ✔ | `ROADMAP.md`, `LAUNCH_ROADMAP.md`, `phases/` | D42 |
| 01 Business Operations | ✔ | `docs/BUSINESS_MODEL.md`, `metrics/` | D02, D05–D07 |
| 02 Platform Architecture | ✔ | `platform/` (schema, events, orchestration) | D10, D12, D39 |
| 03 Hosting & Infrastructure | ✔ | `platform/` + `app/` deploy config | D10, D11, D13, D32 |
| 04 Design & Quality | ✔ | `design/` + `app/DESIGN.md` + QA gate | D13, D15, D18–D20, D25, D31 |
| 05 Feature System | ✔ | `specs/features.md`, `docs/TIER-FEATURE-MATRIX.md` | D17–D24, D28, D29 |
| 06 Demo-to-Customer | ✔ | `platform/` (demo, conversion, fulfillment) | D28, D30 |
| 07 Lead-to-Customer Pipeline | ✔ | `agents/lead/`, `outreach/`, `discovery/` | D05, D33 |
| 08 Payments & Billing | ✔ | `billing/` | D02, D03, D35 |
| 09 CRM Integration | ✔ | `crm/` | D22, D23 |
| 10 External Integrations | ✔ | `crm/` (data contracts) | D22, D23, D43 |
| 11 Compliance & Security | ✔ | `legal/`, `platform/auth` | D12, D36 |
| 12 Customer Lifecycle | ✔ | `agents/lifecycle/`, `onboarding/` | D24, D40 |
| 13 Observability | ✔ | `platform/observability` | D38 |
| 14 Support & Documentation | ✔ | `operations/`, help center | D32, D37 |
| 15 Feedback & Iteration | ✔ | `operations/` | none |
| 16 SEO/GEO | ✔ | `knowledge/`, `app/` defaults | D26 |
| 17 Experimentation | ✔ | Phase 2 backlog | D40 |
| 18 Admin CRM & Operations | ✔ | `platform/admin` | D03, D08 |
| 19 Fornax Website | ✔ | `website/` | D27, D32 |
| agent-registry.md | ✔ | `agents/` (cross-cutting, stays at docs root) | D14, D25 |

## 2. Determinations already received (applied once this log is closed)

| # | Ruling | Follow-through |
|---|---|---|
| R1 | New pricing wins: Micro $149/mo or $499, SMB $249/mo or $799, MM $399/mo or $1,299; annual = 10× monthly. **Prices will rise soon after launch.** | 38 workspace files carry old prices (Section 5). Billing built with versioned price IDs and a launch-cohort flag from day 1. |
| R2 | The owner is **Tyler**, not Chase. | 36 workspace files, `.workspace.toml` owner pattern, and memory say "Chase". My earlier docs used Tyler correctly. |
| R3 | Claude Pro wherever it makes sense; Claude API only where necessary. | See D14 (analysis of which agents are unattended). |
| R4 | Cloudflare and the spec's other hosting; may start on Railway. | See D10. |
| R5 | Supabase database per specs; may start on Railway then migrate. | See D12. |
| R6 | Fusion: existing design system, rendered by the Design Agent as static sites on Cloudflare (hundreds to thousands of demos); after a client takes the onboard/offboard deal, migrate to our hosting or theirs. | See D13. |
| R7 | Existing SMB design system is the ICP; build Micro templates next. **Mid-Market paused ~12 months:** shown on site and pricing, not built. | D29 lists everything this touches. |
| R8 | Demo = the actual built site plus the tranche's dashboard; SEO/GEO features are universal. | D26 (needs care: "GEO" in the spec means something different). |
| R9 | Lead automation and agents are built together from the start. | Reorders the build (D22, D33). |
| R10 | CRM: one CRM at launch. | Which one: D22. |
| R11 | Payments: Stripe + manual dunning at launch. | D35. |
| R12 | Auth: Google + email/password. | D12. |
| R13 | Compliance docs + lawyer review before payments go live. | D36. |
| R14 | Hiring: none until Tyler says (~$150K profit). | Unit needs confirming (D06). |
| R15 | Design system is retained and improved before launch. | Kept as the template layer. |

## 3. Corrections to my earlier work

1. The v1 log claimed "current state" for several systems without checking. Superseded by this document.
2. `IMPLEMENTATION_ROADMAP.md` is on hold. Known errors: it lists Sentry/LogRocket (System 13 specifies homegrown monitoring), Stripe Tax (System 8 says no nexus in Phase 1), an invented top-level folder tree that ignores existing folders, and it asked you to send credentials to me. **Do not paste keys in chat.** They go in a gitignored `.env` or a secret manager.
3. Claim "no website exists" was tested against your statement. `website/` **does** exist (home, three samples, legal pages) but is built on the $99 model, undeployed. See D27.

## 4. Conflicts needing a determination

Tags: **[S↔S]** spec contradicts itself. **[S↔W]** spec vs existing workspace. "Rec" = my recommendation. Reply with the ID and accept/alter (e.g. "accept all except D14, D22").

### A. Business, pricing, budget

| ID | Conflict | Rec |
|---|---|---|
| **D01** | Outreach emails and onboarding scripts are signed "Chase" and use chase@[domain TBD under Fornax name]. | Replace with Tyler across 36 files. **Ask:** sender address (`tyler@` or a role address like `hello@`)? |
| **D02** | Prices will rise "soon." Spec plan: raise at ~25 customers / Month 7+ to $199/$349/$599 for new customers, grandfather the first 25–50. Grandfathering strategy lives **only** in business-model Part 2. Systems 01 and 08 reference "cohort tracking" without defining it. **[S↔S]** | Build billing with versioned Stripe Price IDs plus `launch_cohort` on the customer now. **Ask:** target date/numbers for the increase, and do early customers still get grandfathered? |
| **D03** | Free trial: System 19 (14-day trial, "Start Free Trial") and System 18 ("Trial Active" stage, trial-conversion metric) vs Systems 06/08 (pay at conversion, live in 60 s). Workspace has "first 3 free." **[S↔S][S↔W]** | No trial. Remove trial stage/metric. **Ask:** keep "first 3 free" as a design-partner soft-launch cohort (Step 8.8), or retire it? |
| **D04** | "Ownership $497 / 1-month support / you host it" vs spec "Offboard $499–$1,299, domain transfer, no ongoing support." Your R6 adds "migrate to our hosting or theirs." | Adopt Offboard naming/prices. **Ask:** keep 1 month of transition support? (Spec says none; offboard video says "where to get help.") |
| **D05** | $50/mo hard cap (until first $500 MRR) vs spec's own tools: Apollo/Hunter, business-size data ($200–$1,500/mo per business-model Part 5), SendGrid, Supabase, Cloudflare Pro, Cloud Run, plus any API use. **[S↔S]** | Define the cap as platform run-rate excluding per-customer COGS and the Claude Pro subscription. Start every lead source on free tiers, throttled by the "Daily Lead Acquisition Target" dial (System 13). **Ask:** a pre-launch build budget number. |
| **D06** | Hiring gate: $100k annual profit (serious at $150k) vs System 01's customer-count triggers (10/50/100/500 customers) and scenarios that hire in months 3–4. **[S↔S]** You said "~$150K profit MRR." | Customer-count triggers become alerts only. **Ask:** $150K annual profit, or $150K MRR (~$1.8M ARR)? |
| **D07** | COGS: System 01 $11/$16/$21 per month (92.6–94.7% margin) vs System 03 and business-model $4/$5/$8 (97–98%). **[S↔S]** | Plan with System 01's conservative figures; instrument actual cost. Margins clear 90% either way. |
| **D08** | Conversion planning: business-model 2–5% (validated Month 1–3) vs System 18 "12% outbound average / 15% photo target" vs workspace metrics "50–70% close rate." **[S↔S][S↔W]** | Plan on 2–5%; rewrite `metrics/METRICS.md`. |

### B. Architecture and hosting

| ID | Conflict | Rec |
|---|---|---|
| **D10** | Managed hosting: System 03 lists Lightsail "recommended," Cloud Run "best margins," yet its own **LOCKED architecture** is Cloudflare + Cloud Run + shared DB and its COGS uses Cloud Run; business-model says Lightsail chosen, review Cloud Run at 500+ sites; Railway "ruled out (bill variance)"; and "cannot migrate infrastructure between phases." **[S↔S]** You: start on Railway, migrate later. | Static sites (demo and live) → Cloudflare Pages/Workers + R2. Backend, dashboards, agents → one containerized service: Railway now, target GCP Cloud Run. Drop Lightsail (nothing left for it to host). Dockerfile from day 1 so migration is a redeploy. |
| **D11** | Demo storage: S3 (business-model, System 03) vs Cloudflare Workers/Pages (Systems 04/06). **[S↔S]** | Cloudflare R2 + Workers; no AWS. |
| **D12** | Database and auth: spec says shared Postgres, row-level security on `customer_id`, custom bcrypt auth, AWS Secrets Manager, Redis cache. You: Supabase; auth Google + email/password. | Supabase Postgres (RLS) and Supabase Auth (covers bcrypt, reset links, Google OAuth, optional TOTP). Secrets in provider stores (Railway vars → GCP Secret Manager), not AWS. Skip Redis at launch. **Ask:** OK to use Supabase Auth instead of hand-rolled auth? |
| **D13** | Design Agent output: spec "static HTML ~50KB in ~10 s" per demo vs existing Astro app that builds one client per `npm run build` (workspace docs also disagree: tech-stack says one multi-tenant service routed by domain; app/README says one client per build). | Contract = client JSON (`schema.mjs`) → static bundle → Cloudflare. Retire the "one Railway service, many domains" idea. Benchmark build time before promising 10 s; run parallel builds in a queue. |
| **D14** | Agents on Claude Pro vs API. Pro/Claude Code cannot be called by cron jobs or webhooks. Spec requires unattended flows (payment→live <60 s, edit→live <5 s, daily review sync, dunning, triage). **Verify current terms before assuming unattended automation is permitted on a subscription.** | Deterministic code, no LLM: CRM push, Review Sync, Health/Metrics jobs, churn formula, experiment math. Pro/Claude Code for build-time and operator-time work: writing templates, evals, QA triage, batch runs in attended waves. Cheap-tier API only for unattended LLM steps (personalization copy, extraction, triage), with a per-agent monthly cap logged in `metrics/token-log.md`. **Ask:** approve a capped API key? |
| **D32** | Domains conflict. Marketing [domain TBD under Fornax name] (System 19, plan 6.2); app/admin/demo on [domain TBD under Fornax name] (`app.`, `admin.`, `/demo/`); platform sites and support on [domain TBD under Fornax name]; workspace emails/legal use [domain TBD under Fornax name]. **[S↔S][S↔W]** | Three-domain model: [domain TBD under Fornax name] marketing, [domain TBD under Fornax name] app/admin/demo/email, [domain TBD under Fornax name] customer subdomains + support/help. **Ask:** which do you own?|
| **D38** | Monitoring: System 13 is homegrown (Cloud Run + Scheduler + Postgres + Slack + Twilio, ~$1–5/mo). | Follow System 13; no Sentry/LogRocket. Needs a Slack workspace/webhook. Pre-launch subset only: Health Check, Alert Dispatcher, basic dashboard. |
| **D39** | System 02 schema: says admin-only tables have **no** `customer_id`, then defines PaymentTransaction **with** `customer_id`. Entities used elsewhere are missing: LeadWarehouse, OutboundCampaignRun, `crm_sync_log`, `crm_conflict_log`, health/metrics/alert logs, photo intake, agent feedback, support tickets, experiments, `launch_cohort`. **[S↔S]** | Derive one consolidated schema; admin tables in a separate schema/role (PaymentTransaction keeps `customer_id`, admin-only access). |

### C. Product, tiers, design

| ID | Conflict | Rec |
|---|---|---|
| **D15** | **EN/ES.** Spec defers multi-language to Phase 2+ (System 05 non-goal, Phase 2+ list, `lang="en"`). Workspace makes EN/ES parity a critical path and a QA gate; schema requires both; buyer persona names Spanish-first owners. **[S↔W]** | Keep ES capability in the template, but EN-only at launch; parity checks off the launch gate. **Big call: please rule.** |
| **D16** | Verticals: spec Phase 1 = plumbing, HVAC, electrical, roofing; workspace = HVAC-first, 27 trades in schema, 40+ in taxonomy. Knowledge packs exist for HVAC, plumbing, electrical only. | Phase 1 = the four spec verticals, HVAC/Phoenix first. Build a roofing pack before outreaching roofers. Others stay parked. |
| **D17** | Tier features: `TIER-FEATURE-MATRIX`, `DESIGN_SYSTEMS/*`, `DELIVERY_MODEL`, `TIER_BUILD_PLAN`, `POSITIONING` all describe different tiers than Systems 04/05 and business-model (e.g. SMB "10–15 pages, blog" vs spec "up to 5 service pages, 10–12 components"). | Spec wins; rewrite all five. Mid-Market rows are marked "not built." |
| **D18** | Micro edit scope: System 04 "name, description, contact info, images only" vs business-model "text-only, hero images locked." **[S↔S]** | Micro edits name, description/service text, contact, hours, logo/gallery images. Hero, layout, colors, fonts locked. |
| **D19** | Customization: System 04 §7 sliders have no tier gate; System 03 says fonts/colors/layout cannot be customized; System 04 §1 gives SMB colors/fonts. **[S↔S]** | Sliders (color, font, spacing, radius) for SMB only; none for Micro; layout locked everywhere. |
| **D20** | 10 styling profiles (spec) vs existing 30 themes / 5 heroes / 4 service layouts. | Curate the 30 into 10 named profiles; keep hero/layout variants as vertical-keyed Design Agent choices. |
| **D21** | Micro CRM: business-model "Zapier only" vs System 05 "CRM excluded"; Zapier is a Phase 2 item. **[S↔S]** | Micro = email alerts + CSV export at launch; Zapier/webhooks Phase 2. |
| **D24** | Review aggregation is a **Micro launch feature** (System 05) but Review Sync Agent is "post-launch" (plan 3.1). Yelp/Trustpilot/GBP API access and display terms are unverified. **[S↔S]** | Launch with Google reviews snapshot at build time; daily sync and other sources fast-follow after API terms are verified. |
| **D25** | Discovery Agent: "Phase 1.5" (System 04 §5) vs pre-launch (plan Step 4.4). **[S↔S]** | Pre-launch, minimal version: it delivers the personalized-demo hook and your existing logo-first branch (`existing-identity` / `generated-identity`) needs it. |
| **D26** | **Your question: are SEO/GEO universal?** Layer 1 (schema, meta, sitemap, Core Web Vitals, geo-content) is built into every template: yes. Layers 2–3 (monthly optimization, rank tracking) have no tier gating in System 16; business-model says Micro none / SMB monthly / MM + tracking. **Also, "GEO" in the spec means geographic targeting, not generative-engine optimization.** The existing `llms.txt` / AI-SEO work has no home in the specs. | Layer 1 universal, including `llms.txt`/AI-answer structure as a Layer 1 default. Layer 2 SMB monthly. Layer 3 deferred until revenue (tool cost). **Confirm which "GEO" you meant.** |
| **D29** | **Mid-Market pause** touches: System 05 features 15–22, Step 7.4, System 04 MM customization, System 12 MM milestones and upsell, Systems 09/10 top-10 CRMs, prices in Systems 01/08/19. | Keep the tier enum and price table; mark every MM feature "deferred (12 months)." **Ask:** leads scored Mid-Market-size: suppress from outbound, or route to a waitlist? |
| **D18b** | System 19 pricing page adds limits (Micro 50 leads/1 site, SMB 500/3, MM unlimited/10) found nowhere else. **[S↔S]** | Drop the limits unless you want them. |

### D. Site, GTM, outreach

| ID | Conflict | Rec |
|---|---|---|
| **D27** | System 19: hero "Your AI-Powered Website Builder" vs business-model "NOT a website builder"; trial CTA; "logo grid of early customers" and testimonials before any customers; "Done-For-You Setup $99" add-on though DFY is the product; Redesign $199–$499 is human labor vs 15–20 hrs/week. Existing `website/` has a fabricated "Denver plumber" testimonial at $99. | Adopt System 19's structure; rewrite hero to done-for-you outbound framing; no trial; **no fabricated proof** (real ones only, or omit); drop DFY add-on; Redesign as waitlist. Don't deploy current `website/`; reuse its components. |
| **D28** | Tier selection: prescriptive, no choice (System 05, business-model) vs System 06 §3 "select tier → checkout" vs System 19 public 3-tier page. **[S↔S]** | Demo links carry the assigned tier (pre-selected). Public pricing is informational; inbound gets a "build my demo" form that assigns the tier. |
| **D30** | Demo lifetime: System 06 expires at 30 days, archives at 90; business-model and System 03 say a 3-month window with a 30-day extension. **[S↔S]** | 90-day live window (majority of spec), resend cadence (day 3 / day 7) from System 06, archive after 90. |
| **D31** | QA: (a) Lighthouse ≥80 to ship a demo (System 04, 13 locked) vs Accessibility ≥90 blocks deploy vs ≥90 in System 16; workspace gate wants 100/100/100 or perf≥90/a11y≥95/SEO≥95. (b) Tyler manually reviews every design within 24 h (System 04) vs registry "only after 2 failed attempts." (c) "2 failed attempts → escalate" vs "3 attempts." **[S↔S][S↔W]** | (a) Demo floor: Lighthouse ≥80 and a11y ≥90, axe 0 must-fix; live sites ≥90; keep your stricter numbers as design targets. (b) Manual review = escalations + a sample; first ~10 fully reviewed (your calibration rule). (c) Initial render + 2 retries, escalate on the 3rd failure. |
| **D33** | Outreach channels: workspace critical path is **email + SMS**; System 07 is email-only (5-touch drip, 100 leads/day); SMS outreach appears only in Phase 2+ notes; Twilio in the spec is for alerts. SendGrid's acceptable-use terms on cold outreach need checking; spec requires a warmed separate sender domain. | Email-only at launch, SMS cold outreach off (consent-law risk). Separate warmed sending domain; check provider terms before volume. |
| **D42** | "Phase 1: 5 closes by 9/30" (send date 9/16 has passed) assumes the $99 offer and an unbuilt platform; launch plan estimates 2–4 weeks for the 8 steps. | Hold the 5 drafted emails (old pricing, copy changes need approval). Re-baseline: platform launch per plan; the 5 Phoenix prospects become the soft-launch cohort (Step 8.8). **Ask:** confirm new dates. |

### E. Billing, legal, support

| ID | Conflict | Rec |
|---|---|---|
| **D35** | Dunning: System 08 §2 retries day 0/3/7 then pause + 14-day grace; §6 Tier 1 "site paused day 0" (days 0–7) then Tier 2 days 7–30; System 13 grace dial default 14; ToS says 10 days. Refunds: System 08 30-day pro-rata (monthly) and none (annual) vs ToS "no refund/proration." Cancellation: monthly through end of month; annual stops immediately. **[S↔S][S↔W]** | Clock starts at the 3rd failed retry (delinquency day 0): pause site, Tier 1 emails days 1/4/7, Tier 2 (Tyler) day 7+, grace 14 days. Build the state machine and templates now; LLM personalization later (your R11). Update ToS. |
| **D36** | Legal docs vs spec: names Railway as the only host/subprocessor; retention (cancel → 30 days vs spec 90; deletion request 30 vs 45 days; unconverted leads 12 months); "AES-256 for all stored data" vs spec (only tokens/secrets AES-256, PII plain); SOC 2 claims are about providers but must not read as ours; business address placeholder unresolved (B6). | Rewrite ToS/Privacy/Security to the spec's stack and numbers; verify provider-encryption claims; lawyer review before first charge (your R13). |
| **D37** | Support SLA: P0 respond <1 h, P1 <4 h vs Tyler available ~5:30–7 pm and weekends; ToS promises 24–48 h. **[S↔W]** | Publish 24–48 h; P0–P3 stay as internal targets, with alerting automated. |

### F. Minor spec inconsistencies (later/more specific spec wins unless you object)

**D40:** System 12 §1 "launched = 10+ leads and 2+ edits" vs §2 tier milestones (Micro 20 leads, SMB 30+): treat §1 as onboarding completion, §2 as health targets. System 07 "one A/B test at a time" vs System 17 "2–3 parallel non-overlapping tests": System 17 wins. System 02 hourly scoring vs System 07 daily/weekly re-score: System 07 wins. System 11 "30-day remember me" vs "1-hour inactivity logout": apply inactivity logout to admin, remember-me to customers. System 18 admin auth magic link/OAuth vs System 11 separate admin account: Google OAuth + 2FA for Tyler.

### G. Workspace items with no spec home

**D41:** `execution/CYCLE_1_*` (call transcript, payment received, testimonial dated Oct 2, 2026) and `outreach/PHASE_1_EXECUTED_EXAMPLE.md` are **fabricated records that name a real business (Glendale Heating & Cooling)**. Rec: archive labelled SIMULATION; never use publicly.
**D43:** `docs/CRM_MCP_INTEGRATION_ROADMAP.md` lists CRMs (RealGreen, ZenMaid, Tekmetric…) and features (live job-status display, +$50 upsell) that the spec doesn't have; the spec's second wave is Spike, FieldEdge, Knowify, Zoho, Pipedrive (+Salesforce, Zendesk in Phase 2). Rec: rewrite to the spec; keep the vertical-specific CRMs as Phase 3+ notes.
**D22:** Which single CRM first? Rec **HubSpot** (free, simple OAuth, no partner approval). Apply now for Jobber and ServiceTitan approval (docs cite 1–2 weeks lead time). One-way push, 5-minute batch, retries 1s/5s/30s/5m ×5, notify Tyler after 3 failures, pause at 5. Status-pull and the conflict resolver wait for two-way sync.
**D23:** CRM cadence conflict resolved by D22: Systems 09/13 (5 min) win over System 02 (hourly), System 05 (15-min retry), System 10 (real-time <2 min).

## 5. Workspace application plan (runs after Section 4 is closed)

- **Rewrite:** `CLAUDE.md`, `DECISIONS.md`, `ROADMAP.md`, `LAUNCH_ROADMAP.md`, `README.md`, `STATUS.md`, `specs/features.md`, `context/*`, `docs/{delivery-model,DELIVERY_MODEL,PRICING,tech-stack,TIER-FEATURE-MATRIX,DESIGN_SYSTEMS/*,CRM_MCP_INTEGRATION_ROADMAP}.md`, `sales/POSITIONING.md`, `operations/TIER_BUILD_PLAN.md`, `metrics/METRICS.md`, `phases/*`.
- **Old-price files (38):** legal, messaging, onboarding, outreach, website, Phase 1 docs, app client JSON. Copy changes in outreach/messaging need your approval first (per `CLAUDE.md`).
- **Name fix (36 files):** Chase → Tyler.
- **New modules:** `platform/` (schema, API, dashboards, auth), `agents/`, `billing/`, `crm/`. Existing `design/`, `app/`, `website/`, `outreach/`, `operations/`, `legal/` keep their roles. Each spec moves beside its module; cross-cutting files stay in `docs/`.
- **Memory:** replace the stale `buildflow-venture` memory (still says Chase, $99, no API, files-not-DB) and the `crm-mcp-strategy` memory.
- **Archive, never delete:** superseded docs go to `archive/`.

## 6. Spec gaps to research and write back (Step 2.7, after rulings)

Cloudflare custom-domain limits and pricing at 1,000+ customer domains (Cloudflare for SaaS vs Pages); Google Places/GBP/Yelp/Trustpilot API terms for storing and displaying reviews; Apollo/Hunter free-tier quotas; per-CRM OAuth partner approval steps; Astro per-site build time vs the 10 s target; cold-email provider terms; Anthropic terms for unattended use.

## 7. Housekeeping

- The GitHub token in `~/.claude/CLAUDE.md` is noted there as expiring ~2026-09-14; today is 2026-09-18, so `git push`/`gh` may fail.
- `business-model-and-constraints.md` contains personal employment detail. Keep the repo private.
