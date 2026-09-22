---
title: Build Tasks
purpose: The one master checklist of concrete deliverables and subtasks, each tagged with what's blocking it. Read before every scheduled check. Only two things are allowed to block a task — a decision only Tyler can rule on, or a credential only Tyler can provide. Everything else should be buildable now, on mocks if needed.
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.0.2
tier_scope: all
phase: phase_1
---

# Build tasks

Blocked-by tags: **[none]** buildable now · **[decision: Dxx]** needs a Tyler ruling, see TYLER_QUEUE.md ·
**[credential: X]** needs an account/key only Tyler can create · **[depends: task]** needs another task done first.

## 1. Foundation — database, auth, hosting skeleton
- [x] Data contract (`platform/CONTRACT.md`) — done, commit `4462209`
- [x] Migrations, RLS policies, service skeleton, monitoring script — done, commit `2dd5a19`
- [x] Service unit tests (6/6) — verified passing
- [x] **RLS isolation test actually run and confirmed** — done, Tyler ran it 2026-09-21, all isolation + monitoring tests PASS
- [◐] Real Supabase project provisioned — project exists, URL + publishable key stored in `.local/supabase.env` 2026-09-21 [credential: still need the service role key before backend can connect]
- [ ] Real Google OAuth client [credential: Google Cloud OAuth client]
- [ ] Container deploy to Railway (real, not local) [credential: Railway project already exists — confirm env]

## 2. Static hosting on Cloudflare — set up and tested
- [ ] Cloudflare account + API token [credential: Cloudflare]
- [x] **Pages/Workers project wired to the Astro build output** — done on mocks, `platform/hosting/deploy.mjs` +
  `platform/hosting/mocks.mjs`: real per-client project naming (`fornax-site-<slug>`), real versioning/rollback
  (`VersionStore`, auto-rollback to last known-good deploy on a failed deploy, plus an explicit `rollback()`),
  the actual Cloudflare Pages API call mocked behind `MockCloudflareAdapter.deployPages`/`rollbackTo`. Reads
  the real build output from `agents/design/design-agent.mjs`'s `renderSite()` (`buildResult.outDir`).
  40/40 unit tests pass (`node --test platform/hosting/*.test.mjs`). [depends on real token for the live call]
- [x] **R2 bucket for site assets** — done on mocks, `platform/hosting/assets.mjs`: real key structure
  (`sites/<slug>/<version>/<relative path>`, versioned so re-deploys/rollback never clobber a prior version's
  assets), real content-type mapping, real manifest built from the actual build output; upload itself mocked
  via `MockCloudflareAdapter.uploadObject`. Returns a `bundleUrl` shaped like `app.websites.bundle_url`
  (`platform/CONTRACT.md`). [depends on real bucket for the live call]
- [x] **DNS + two-domain model** — done, `platform/hosting/domains.mjs`: `subdomainForSlug()` assigns each
  customer `<slug>.<customerRootDomain>`; `primaryHostnameFor()` picks the customer's own domain when set,
  else the subdomain. Domain names are config/env placeholders (`FORNAX_APP_DOMAIN`,
  `FORNAX_CUSTOMER_ROOT_DOMAIN`), not hardcoded guesses — see TYLER_QUEUE.md "Domains". D32 (which domains
  you own) still needs your call before the real values go in.
- [ ] Wildcard SSL for customer subdomains — **nothing to build here.** This is a Cloudflare account-level
  setting (issued automatically for any domain/subdomain on a Cloudflare zone, or via the Universal SSL /
  Advanced Certificate Manager wildcard option) once the domain is on Cloudflare, not application code. The
  mock DNS step in `platform/hosting/mocks.mjs`'s `provisionDns()` reports `sslStatus: "active"` as a stand-in;
  there is no separate SSL code path to write. [depends: Cloudflare account, domain purchased]
- [x] **Deploy pipeline: generated site → live URL, timed end to end** — done on mocks,
  `platform/hosting/pipeline.mjs` `runDeployPipeline()`: composes deploy → R2 upload → DNS/SSL provision →
  health check, timing each stage. Target used: `platform/SPEC-03-hosting-infrastructure.md` section 2's
  locked "~60 seconds, fully automated" total (design gen ~10s spec target, proven ~1.2s in
  `agents/design/BENCHMARKS.md` + QA ~5s, upstream of this module) — this module's own share of that budget
  (upload ~2s + DNS/SSL ~30s + health check ~5s = 37s) is `PIPELINE_TARGET_MS`, checked via `withinTarget` on
  every run. 9/9 pipeline unit tests pass live. [depends on real Cloudflare token for a real end-to-end timing run]
- [x] **Per-customer hosting cost alert (>$50)** — done, `platform/hosting/cost-alert.mjs` +
  `platform/db/migrations/0006_hosting_cost_alert.sql`. Deterministic, no LLM. Follows the exact pattern
  already built in `platform/monitoring/` (`admin.raise_alert`/`admin.resolve_alert` from
  `0004_monitoring.sql`, same dedupe/escalate/resolve rules and dispatcher): `admin.record_hosting_cost()`
  logs the reading to `admin.business_metrics_log` and raises a `warning` alert once a customer's reading is
  over $50 (`SPEC-03-hosting-infrastructure.md` section 4), resolves it once back under. New SQL test
  `platform/db/tests/21_hosting_cost.sql` (5 checks: threshold, dedupe, resolve, re-open, no cross-customer
  collision), wired into `platform/db/run-local.sh`'s test list — **not run live**: this sandboxed session
  can't start local Postgres (`shmget: Operation not permitted`, same restriction noted for the G0 isolation
  test), so it needs Tyler's Mac or CI to actually execute, same as that gate. `cost-alert.mjs`'s own 3 JS
  unit tests (calling the SQL function through a fake `db`) do pass live. [depends on a real per-customer cost
  feed — Cloudflare/R2 billing API — to call `recordHostingCost` from; nothing wires that in yet]

## 2b. Content — copy pool and trade packs (lane/content)
- [x] Copy pool for 4 verticals (hvac/plumbing/electrical/roofing), 24 service cards, validator — done, commit `2e39a9e`, 49/49 checks passing
- [x] **Fact density for AI-SEO Layer 1** (`knowledge/sops/ai-seo-setup.md` step 3, SPEC-16 Layer 1, reconfirmed by Tyler's D26 ruling) [none — buildable now, lane/content] — every service in the copy pool now carries a `facts` array (>=3 concrete facts: years, license always-on; warranty/same-day/24-7/free-estimate/financing gated by the same `requires` flags headlines already use, so nothing is fabricated). Validator (`knowledge/pool/validate.mjs`) enforces >=3 facts with >=2 ungated per service; 52/52 checks passing (was 49/49).

## 3. Demo building — set up and tested
- [x] Design Agent v0 builds a site from client JSON [done, lane/design, verified 67/67 evals]
- [x] Build-time benchmark (1.22s vs 10s target) [done, verified]
- [ ] Design QA loop (Lighthouse/axe gate, retries, escalation) [◐ partial — exists in lane/design, full run needs a local browser (Tyler's machine), not before W6 per your rule]
- [x] Style-profile-to-theme mapping (`styleProfiles.json`) — done: all 32 themes in `themes-30.json` map 1:1 to the 10 spec profiles, no dupes/typos (verified 2026-09-21 by script cross-check)
- [x] **Wire the customer's chosen `styleProfile` into the live Design Agent** — done, already wired; the prior note above was based on a stale/orphaned file, not the real pipeline. Investigated 2026-09-21 (lane/design, commit `c5119fc`): the actual production pipeline (`agents/design/design-agent.mjs`, `pickTheme`/`resolveDesign`) already reads `client.styleProfile`, resolves it through `styleProfiles.json` to a theme in `themes-30.json`, and writes the resolved `brand.primary/accent/...` into the client JSON the Astro site renders from (`app/src/data/clients/*.json`). Proven by the existing eval suite (`agents/design/evals/design.eval.mjs` d01/d02/d09/d14/d15), which was already passing 67/67 before this change and still passes 67/67 after. `app/src/lib/agent-decisions.ts` and `app/src/data/vertical-pools.ts` were a separate, never-imported "Agent Decision Engine v2" (only referenced from archived docs, not from any live code path) that read `vertical-pools.ts` instead of `styleProfile` — that dead code is what made the gap look real. Archived both to `archive/legacy-agent-decisions/` (not deleted) rather than left in place to keep confusing future audits. No design-system judgment call was actually needed — no decision logged to TYLER_QUEUE.md.
- [x] **Discovery Agent real-world test + fix** — done 2026-09-22 (lane/design, commit `5f4159f`).
  Live smoke test run against a real HVAC site (deljoheating.com, not a fixture — see
  `agents/design/evals/live-smoke-test-report.md`) found and fixed two real gaps: (1) `og:site_name`/
  `description` meta values weren't HTML-entity-decoded, (2) `extractServices()`'s heading regex
  missed real pages that use per-service headings ("Emergency Heating Services") instead of one
  umbrella "Services" section — now falls back to a service-keyword heading scan. Confidence on the
  real site went from 0.75 (services missing) to 1.0 (all 4 signals, 8 services extracted). 67/67
  design evals still pass live, governance lint clean. Not pushed yet — GitHub unreachable from this
  sandbox this run (proxy timeout on `git ls-remote`); commit is safe locally on `lane/design`.
- [◐] **Demo includes the tier's sandbox dashboard (your ruling)** — view-model layer built,
  2026-09-22: `platform/dashboards/lib/sandbox-dashboard.mjs` (see §7 for detail). Not yet rendered
  into the live demo page — that's `website/`/`app/`, outside this session's allowed scope.
- [x] **Demo tracking (view, scroll depth, section clicks)** — built 2026-09-22, per SPEC-06
  section 2's locked event schema ("demo viewed (timestamp, device, referrer), time on site,
  scroll depth (25/50/75/100%), section clicks, form interaction" / "view count, view duration,
  scroll depth, form engagement, conversion rate, device type, traffic source"). `CONTRACT.md`
  gap found first (checked before building, per this task's instruction): `admin.demos` only had
  aggregate columns (`view_count`, `conversion_flag`), nowhere to log an individual scroll-depth
  tick or section click. Added `platform/db/migrations/0007_demo_tracking.sql`:
  `admin.demo_tracking_events` (one row per event, `event_type` + `payload jsonb` + `session_id`)
  + `admin.record_demo_event()` (idempotent per demo+session+type+payload so a client-side beacon
  retry never double-counts; bumps `admin.demos.view_count`/`admin.prospects.demo_view_count` on a
  session's first `view`). New SQL test `platform/db/tests/22_demo_tracking.sql` (9 checks:
  aggregate bump, session-scoped dedupe, cross-session counting, scroll-depth dedupe by exact
  payload, section click + form interaction recording, unknown-event-type rejection, two demos not
  colliding on a shared session_id), wired into `run-local.sh` — **not run live**, same
  `shmget: Operation not permitted` sandbox restriction as the G0 isolation test and 0006's SQL
  test; needs Tyler's Mac or CI. Read/aggregation side (DB-agnostic, fully tested):
  `platform/dashboards/lib/demo-tracking.mjs` — `buildDemoAnalytics()` (view count, unique
  sessions, device/referrer breakdown, scroll-depth reach per milestone as counts and %, section
  click tally, form-engagement % of sessions, avg time on site) + `buildConversionRate()`. 9/9 new
  JS unit tests pass live (`platform/dashboards/demo-tracking.test.mjs`). CONTRACT.md updated with
  the new table. **Not built:** the client-side tracking beacon itself (the JS snippet embedded in
  the demo page that fires these events on scroll/click) — that lives in the demo template under
  `website/`/`app/`, outside this session's allowed scope (`agents/lead/` + `platform/dashboards/`
  only); the recording/aggregation backend it would call is real and tested.

## 4. Lead pipeline — set up and tested
- [x] Scoring model, business-size logic [done, lane/lead, verified 89/89 evals]
- [x] Outreach templates, send workflow (sandboxed, no real sends) [done, lane/lead]
- [x] Adapter: lead/prospect plain-dict shapes → `platform/CONTRACT.md` tables — done, lane/lead commit `ed9f4e4`, `agents/lead/adapter.py`; 8 new evals, 99/99 lane evals pass (`python3 -m agents.lead.run_evals`)
- [ ] Real Apollo/Hunter/Places clients (currently mocks) [credential: Apollo, Hunter, Google Places API]
- [ ] Real SendGrid send + warmed sender domain [credential: SendGrid account + domain auth; also needs warmup time]
- [ ] CAN-SPAM unsubscribe, real send test [depends: SendGrid] — D01 sender address ruled `hello@`, wired into `send.py` (lane/lead `ed9f4e4`); real send itself still needs SendGrid credential + warmed domain
- [ ] Outreach copy approved for real use [decision: outreach copy approval — currently all drafts on hold]
- [ ] Postal address for the outreach email footer [credential/decision: Tyler — CAN-SPAM requires it; the send workflow refuses to run without one, see TYLER_QUEUE.md]
- [x] Confirm or reverse 5 lead-engine implementation assumptions (weekend sends, bounce-rate pause threshold, open-triggered skip, calendar vs business days, default timezone) — kept all 5 defaults, ruled 2026-09-21
- [x] Company-size cutoffs for Micro/SMB/Mid-Market routing — kept as built, ruled 2026-09-21
- [x] **Replace manual-review-by-Tyler for low-confidence lead lookups with an automated deep-research fallback**
  — done, commit `6b208ce`: below the 0.7 confidence bar (or no match), `lookup()` now falls through into a
  second automated pass (`_deep_research`) that widens provider fan-out and verifies the business directly
  against its website/GBP listing (`_verify_direct`) instead of only aggregator name-fuzz. Confirmed matches
  are floored at 0.7 confidence and never flagged to Tyler; still-unconfirmed leads are suppressed
  automatically. 101/101 lane evals pass, verified live 2026-09-22 (`python3 -m agents.lead.run_evals`).
  Details: `agents/lead/TASKS.md`.

## 5. Billing (Track F — in progress, mocks only)
- [x] Stripe test-mode products/prices (Micro, SMB, monthly+annual) [was: credential: Stripe test account] — done
  2026-09-22 on placeholder IDs (no real Stripe account exists yet): `billing/prices.py`. Versioned
  `PriceVersion` catalog (v1 launch prices: Micro $149/mo·$1,490/yr, SMB $249/mo·$2,490/yr, annual = 10x
  monthly), `launch_cohort` flag (`launch`/`standard`) per DECISIONS.md D02, `add_price_increase()` for the
  future price rise (creates a new `standard` version, never touches `launch` rows — that's the grandfathering
  guarantee). Mid-Market intentionally absent (DECISIONS.md item 4/14, paused). 10/10 evals pass
  (`billing/evals/test_prices.py`). Real Stripe Products/Prices still need creating once a Stripe account
  exists — see TYLER_QUEUE.md.
- [x] Webhook handling, versioned prices, `launch_cohort` flag [was: depends: Stripe test account] — done
  2026-09-22 on mocks: `billing/webhooks.py` (`handle_event`, real dispatch logic) + `billing/mocks.py`
  (`WebhookSignatureMock`, `StripeEventFactory` — mocked signature verification and event construction, no
  real Stripe account/webhook secret exists yet). Handles `invoice.payment_succeeded`,
  `invoice.payment_failed`, `customer.subscription.{created,updated,deleted}`. On the 3rd failed retry
  (`attempt_count>=3`, per SPEC-08 Section 2's locked retry count), hands off into the already-merged
  `billing/dunning/` Tier 1-3 state machine (`start_delinquency()` + `advance()`) — real, tested wiring, not a
  stub. 12/12 evals pass (`billing/evals/test_webhooks.py`); full billing suite 42/42
  (`python3 -m billing.run_evals`). Real Stripe webhook endpoint/secret still needed — see TYLER_QUEUE.md.
- [x] Dunning state machine (tiers 1-3 automated) [none, buildable on mocks] — done 2026-09-21: `billing/dunning/state_machine.py` (+ `mocks.py` for Stripe/SendGrid), 20/20 evals pass live (`python3 -m billing.dunning.run_evals`). Tier 4-5 explicitly out of scope per DECISIONS.md #14. Assumptions and what's left: `billing/TASKS.md`.
- [ ] Payment → live site fulfillment <60s [depends: Cloudflare hosting §2, Stripe §5]
- [ ] Live Stripe switch [decision: legal sign-off (G7) required first — do not do before then]

## 6. CRM (Track G — mocked build done, real account blocked)
- [ ] HubSpot developer/private app [credential: HubSpot app]
- [x] One-way push connector, 5-minute batch, retries — done 2026-09-22: `crm/hubspot/mapping.py`
  (admin.leads/admin.prospects -> HubSpot contact/deal, per platform/CONTRACT.md) + `crm/hubspot/sync.py`
  (batching, retry ladder 1s/5s/30s/5min max 5, Tyler-notify at 3, pause at 5 — verified against both
  `crm/SPEC-09-crm-integration.md` override block and `crm/SPEC-10-external-integrations.md` line 89, they
  agree) + `crm/hubspot/mocks.py` (mock HubSpot client, same pattern as `billing/dunning/mocks.py`). 18/18
  evals pass live (`python3 -m crm.run_evals`). Details and assumptions: `crm/TASKS.md`.
- [◐] Test lead lands in a HubSpot sandbox — proven end-to-end on mocks
  (`crm/evals/test_sync.py::TestEndToEndTestLead`: transient failure then success, field
  mapping + contact/deal IDs verified); real sandbox push blocked on the HubSpot app above.

## 7. Dashboards (Track H — in progress, 2026-09-22)
- [◐] Customer dashboard (SMB first, one dashboard/feature-flag layer per the plan's ruling) — real, tested
  view-model layer built: `platform/dashboards/lib/tier-features.mjs` (SMB base + Micro override flags),
  `platform/dashboards/lib/customer-dashboard.mjs` (lead inbox, CSV export, simple pipeline
  new/contacted/converted, notes, CRM config view that never leaks `auth_token_encrypted`, image-upload
  config). 26/26 `node --test` tests pass live (`platform/dashboards/*.test.mjs`, run 2026-09-22 — see
  `platform/dashboards/TASKS.md` for the exact command/output). Fixtures shaped to `platform/CONTRACT.md`
  (`platform/dashboards/fixtures/`). **Not wired to a live database** — no Supabase service-role key yet
  (gate G3) — and no rendered UI components yet, only the tested logic layer. Found and logged a real contract
  gap (`form_submissions` has no `pipeline_stage`/`notes` column) to `operations/TYLER_QUEUE.md` §4 rather than
  guessing it into `platform/CONTRACT.md`.
- [◐] Admin web dashboard [depends: Foundation] — core view models built and tested:
  `platform/dashboards/lib/admin-dashboard.mjs` — pipeline funnel + stuck-deal detection (SPEC-18 §1, Trial
  Active stage removed per the 2026-09-18 spec override), customer record view, health score (SPEC-18 §4's
  40/30/20/10 weighting), revenue dashboard (MRR/ARR/churn/ARPU by tier, Mid-Market and trial-conversion
  excluded per the override), alerts view (SPEC-18 §6). Same "tested on fixtures, not wired" status as above.
  Not built: Google+2FA login, bulk CRM export, config screens for thresholds/dunning, onboarding queue,
  invoice disputes — deeper SPEC-18 §8 web-only items, next up once there's a real backend to build UI against.
- [x] **Micro dashboard (lead inbox only) — verified end to end, 2026-09-22.** Confirmed
  `resolveFeatures("micro")` correctly reduces `customer-dashboard.mjs`'s SMB-shaped builders:
  `buildLeadInbox`/`toCsv` work identically for both tiers (lead inbox + CSV export are not
  tier-gated at all, per the matrix), while `buildPipeline`, `setSubmissionNotes`,
  `buildCrmConfigView` all throw for Micro, and `buildImageUploadConfig("micro")` returns
  `single-logo` mode — landing Micro on lead-inbox-only in practice, not by a separate code path.
  Added `platform/dashboards/customer-dashboard.test.mjs`'s
  `"Micro dashboard end to end: lead inbox works, every other capability refuses Micro by flag"`
  (walks every capability once for both tiers so a future SMB-only addition fails loudly instead
  of silently leaking to Micro) + a CSV-export-still-works case. Was substantially done already
  (per the dashboards agent's report); this session's work was the verification pass + the two new
  tests. No rendered UI component library yet for either tier — same "logic layer only, gate G3"
  status as the rest of Track H.
- [x] **Sandbox dashboard (read-only demo embed) — built, 2026-09-22.**
  `platform/dashboards/lib/sandbox-dashboard.mjs`'s `buildSandboxDashboard(tier)` composes the
  SAME view-model logic the real customer dashboard uses (`tier-features.mjs`,
  `customer-dashboard.mjs`, the new `demo-tracking.mjs`) over dedicated sample/fixture data
  (`fixtures/sandbox-dashboard.fixtures.mjs` — every id is `sample-*`, every email `@example.com`),
  never a real customer row: `assertSampleShaped()` throws if a real-looking id (`cust-*`, `fs-*`)
  is ever passed in, and no mutation helper (`moveSubmissionStage`, `setSubmissionNotes`) is
  re-exported, so nothing can wire a save button to it. Also serves BUILD_TASKS.md §3's "wire the
  tier dashboard preview into demos" — the view includes `demoAnalytics` from the new demo-tracking
  module (see §3 below), so a prospect's sandbox preview shows sample view/scroll/section-click
  stats, matching Tyler's ruling that demos include the tier's sandbox dashboard. 6/6 new tests
  pass (`platform/dashboards/sandbox-dashboard.test.mjs`). **Not done:** rendering this view model
  into the actual Astro demo page markup — that's `website/`/`app/`/`agents/design/`, outside this
  session's allowed scope (`agents/lead/` + `platform/dashboards/` only); the view model is real
  and tested, the embed is the next lane's job.

## 8. Legal and compliance
- [ ] Terms of Service, Privacy Policy — lawyer review [credential/decision: T1, lawyer chosen by Tyler]
- [ ] Security Statement finalized [depends: lawyer review]
- [◐] Data retention/deletion workflows built — `platform/db/migrations/0005_retention.sql` (scheduled purge
  job `admin.purge_expired_data`; deletion-request workflow `admin.request_deletion` /
  `admin.fulfill_deletion_request`, logged in new table `admin.deletion_requests`; SLA-overdue alert hook
  `admin.overdue_deletion_requests`) + JS runner `platform/retention/retention.mjs`. Numbers used exactly as
  in `legal/SPEC-11-compliance-security.md` section 1: cancelled customer 90 days, unconverted lead 12 months,
  crm_sync_log 90 days, crm_conflict_log 30 days, deletion-on-request fulfilled within 45 days. Real unit
  tests: `node --test platform/retention/retention.test.mjs` — 7/7 pass. Could not run the SQL live in this
  sandbox (Postgres can't start here — `shmget: Operation not permitted`, same limitation noted for Foundation's
  isolation test); syntax reviewed by hand (balanced parens/`$$` pairs, functions match their grant/revoke
  signatures). Three genuine ambiguities in the spec's exact deletion mechanics logged to
  `operations/TYLER_QUEUE.md` under "Retention/deletion — open questions" rather than guessed. **Someone should
  run `platform/db/run-local.sh` on a real machine (as Tyler did for Foundation's isolation test) before this
  is trusted as proven, not just written.**

## 9. Marketing site (Track E — pages built, 2026-09-22)
- [✔] Home, Features, Pricing, Demo, Blog, Docs, About pages — all built as draft Astro pages under `website/src/pages/`
  (`index.astro` pre-existing, extended; new: `features.astro`, `pricing.astro`, `demo.astro`, `about.astro`,
  `docs/index.astro`, `blog/index.astro` + 2 posts). Pricing page numbers match `docs/PRICING.md` exactly
  (Micro $149/$1,490/$499, SMB $249/$2,490/$799, Mid-Market $399/$3,990/$1,299 shown as paused/waitlist per
  DECISIONS.md item 4). No fabricated testimonials, customer logos or case studies — Demo page's dashboard
  preview and About page's proof section are explicitly marked as placeholders pending real customers, per
  CLAUDE.md's "Don't" rule. No real domain hardcoded: replaced pre-existing `hello@buildflow.com` mailto links
  and the absolute `https://buildflow.com/og-image.png` OG tag with internal `/demo` links and a relative
  `/og-image.png` path; footer states the contact email/domain are not yet public. Build proof:
  `cd website && npm run build` → `15 page(s) built in 648ms`, no errors (the `failed to copy trust settings of
  system certificate` lines are unrelated macOS keychain warnings, not build failures). `python3
  governance/enforce.py --lint` → `0 stale-term hit(s)`. Not done: Case Studies page (spec lists it, but Tyler's
  override explicitly forbids case studies before real customers exist, and it's outside this task's scope
  list) — logged as a real gap, not silently dropped.
- [ ] Logo and brand identity [decision: Tyler picks direction]
- [ ] Deploy (not before legal sign-off if it names real pricing/claims) [depends: §8]. Also stay clear of
  `platform/hosting/` — another lane is building Cloudflare hosting concurrently; this task never touched it.

## 10. Business setup (Tyler-only, no Claude task)
- [ ] Entity, EIN, bank account, business address [credential/action: Tyler only]
- [ ] Domains confirmed/moved to Cloudflare Registrar [decision: D32]
- [ ] Mailboxes (`tyler@`, `hello@`, etc.) [credential: Tyler only]
- [ ] Full account list — see `TYLER_QUEUE.md` Phase 0 section, not duplicated here

---

## How this gets worked
Every subtask tagged **[none]** or **[depends: X]** (where X is done) is fair game for the scheduled build loop to
pick up and make progress on, in a lane worktree, without waiting on Tyler. Anything tagged **[decision]** or
**[credential]** goes to `TYLER_QUEUE.md` and stays blocked until he acts — the scheduled task should never guess
on those. Update this file's checkboxes whenever `COORDINATOR_STATE.md` gets updated; they should never disagree.
