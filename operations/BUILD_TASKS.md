---
title: Build Tasks
purpose: The one master checklist of concrete deliverables and subtasks, each tagged with what's blocking it. Read before every scheduled check. Only two things are allowed to block a task — a decision only Tyler can rule on, or a credential only Tyler can provide. Everything else should be buildable now, on mocks if needed.
status: active
owner: c.t.cohen
updated: '2026-09-21'
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
- [ ] Pages/Workers project wired to the Astro build output [depends: Cloudflare account]
- [ ] R2 bucket for site assets [depends: Cloudflare account]
- [ ] DNS + two-domain model ([domain TBD under Fornax name] app, [domain TBD under Fornax name] customer sites) [decision: D32 which domains you own]
- [ ] Wildcard SSL for customer subdomains [depends: DNS setup]
- [ ] Deploy pipeline: generated site → live URL, timed end to end [depends: Cloudflare account, design lane merged]
- [ ] Per-customer hosting cost alert (>$50) [depends: Cloudflare account]

## 2b. Content — copy pool and trade packs (lane/content)
- [x] Copy pool for 4 verticals (hvac/plumbing/electrical/roofing), 24 service cards, validator — done, commit `2e39a9e`, 49/49 checks passing
- [x] **Fact density for AI-SEO Layer 1** (`knowledge/sops/ai-seo-setup.md` step 3, SPEC-16 Layer 1, reconfirmed by Tyler's D26 ruling) [none — buildable now, lane/content] — every service in the copy pool now carries a `facts` array (>=3 concrete facts: years, license always-on; warranty/same-day/24-7/free-estimate/financing gated by the same `requires` flags headlines already use, so nothing is fabricated). Validator (`knowledge/pool/validate.mjs`) enforces >=3 facts with >=2 ungated per service; 52/52 checks passing (was 49/49).

## 3. Demo building — set up and tested
- [x] Design Agent v0 builds a site from client JSON [done, lane/design, verified 67/67 evals]
- [x] Build-time benchmark (1.22s vs 10s target) [done, verified]
- [ ] Design QA loop (Lighthouse/axe gate, retries, escalation) [◐ partial — exists in lane/design, full run needs a local browser (Tyler's machine), not before W6 per your rule]
- [x] Style-profile-to-theme mapping (`styleProfiles.json`) — done: all 32 themes in `themes-30.json` map 1:1 to the 10 spec profiles, no dupes/typos (verified 2026-09-21 by script cross-check)
- [x] **Wire the customer's chosen `styleProfile` into the live Design Agent** — done, already wired; the prior note above was based on a stale/orphaned file, not the real pipeline. Investigated 2026-09-21 (lane/design, commit `c5119fc`): the actual production pipeline (`agents/design/design-agent.mjs`, `pickTheme`/`resolveDesign`) already reads `client.styleProfile`, resolves it through `styleProfiles.json` to a theme in `themes-30.json`, and writes the resolved `brand.primary/accent/...` into the client JSON the Astro site renders from (`app/src/data/clients/*.json`). Proven by the existing eval suite (`agents/design/evals/design.eval.mjs` d01/d02/d09/d14/d15), which was already passing 67/67 before this change and still passes 67/67 after. `app/src/lib/agent-decisions.ts` and `app/src/data/vertical-pools.ts` were a separate, never-imported "Agent Decision Engine v2" (only referenced from archived docs, not from any live code path) that read `vertical-pools.ts` instead of `styleProfile` — that dead code is what made the gap look real. Archived both to `archive/legacy-agent-decisions/` (not deleted) rather than left in place to keep confusing future audits. No design-system judgment call was actually needed — no decision logged to TYLER_QUEUE.md.
- [ ] Discovery Agent (brand extraction from a real business URL) [◐ exists, evals passing; real-world test needs live URLs]
- [ ] Demo includes the tier's sandbox dashboard (your ruling) [not started — needs Track H]
- [ ] Demo tracking (view, scroll depth, section clicks) [not started]

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
- [ ] **Replace manual-review-by-Tyler for low-confidence lead lookups with an automated deep-research fallback**
  [none — buildable now, lane/lead] — ruled 2026-09-21: below the 0.7 confidence bar, `agents/lead/lookup.py`
  currently just flags the lead for Tyler to check by hand. Instead: add a second automated pass that widens the
  search (more provider fan-out, cross-check the actual business website/socials/GBP listing directly rather than
  just aggregator matches) before deciding. If the deeper pass still can't confirm the business, suppress/skip
  that lead automatically — never surface individual leads to Tyler for review.

## 5. Billing (Track F — not started)
- [ ] Stripe test-mode products/prices (Micro, SMB, monthly+annual) [credential: Stripe test account]
- [ ] Webhook handling, versioned prices, `launch_cohort` flag [depends: Stripe test account]
- [x] Dunning state machine (tiers 1-3 automated) [none, buildable on mocks] — done 2026-09-21: `billing/dunning/state_machine.py` (+ `mocks.py` for Stripe/SendGrid), 20/20 evals pass live (`python3 -m billing.dunning.run_evals`). Tier 4-5 explicitly out of scope per DECISIONS.md #14. Assumptions and what's left: `billing/TASKS.md`.
- [ ] Payment → live site fulfillment <60s [depends: Cloudflare hosting §2, Stripe §5]
- [ ] Live Stripe switch [decision: legal sign-off (G7) required first — do not do before then]

## 6. CRM (Track G — not started)
- [ ] HubSpot developer/private app [credential: HubSpot app]
- [ ] One-way push connector, 5-minute batch, retries [depends: HubSpot app, Foundation contract]
- [ ] Test lead lands in a HubSpot sandbox [depends: above]

## 7. Dashboards (Track H — not started)
- [ ] Customer dashboard (SMB first) [depends: Foundation schema, Design output format]
- [ ] Admin web dashboard [depends: Foundation]
- [ ] Micro dashboard (lead inbox only) [depends: SMB dashboard component library]

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

## 9. Marketing site (Track E — not started)
- [ ] Home, Features, Pricing, Demo, Blog, Docs, About pages [none, buildable now — draft, not deployed]
- [ ] Logo and brand identity [decision: Tyler picks direction]
- [ ] Deploy (not before legal sign-off if it names real pricing/claims) [depends: §8]

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
