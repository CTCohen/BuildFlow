---
title: Tyler Queue
purpose: The only list of things that need Tyler: rulings, approvals, accounts and credentials, and calls. Loops append here instead of interrupting.
status: active
owner: c.t.cohen
updated: '2026-09-18'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Tyler queue

Rules: secrets go in a gitignored `.env` or the provider's secret store, never in chat or docs. Loops append items; Tyler checks them off. The daily digest loop summarizes this file.

## Rulings still open (RECONCILIATION_LOG.md IDs)
- [ ] D02 price-increase timing and numbers; do early customers keep launch pricing?
- [ ] D03 keep "first 3 free" as a design-partner soft-launch cohort?
- [ ] D04 Offboard: keep one month of transition support?
- [ ] D05 pre-launch build budget number for lead data and tools
- [ ] D22 confirm HubSpot as the first CRM
- [ ] D26 confirm which "GEO" is meant (geographic targeting vs AI-answer optimization)
- [ ] D29 Mid-Market-size leads: suppress, or waitlist?
- [ ] D32 which of `buildflow.io`, `buildflow.com`, `buildflowsites.com` you own
- [ ] D01 sender address (`tyler@` or a role address)
- [ ] Confirm or reverse the other provisional rulings in `DECISIONS.md` (item 14)

## Phase 0: business and accounts (week 1-2)
- [ ] Entity and EIN (System 08 needs it for Stripe and 1099-K); business bank account; real business address for the Terms
- [ ] Choose a lawyer for Terms and Privacy review (required before the first charge)
- [ ] Domains: confirm ownership; move to Cloudflare Registrar as needed
- [ ] Mailboxes: `tyler@`, `hello@`, `support@`, `legal@`, `security@`
- [ ] SendGrid: account, domain authentication, a separate cold-outreach sender domain, start warmup
- [ ] Cloudflare (Pages/Workers, R2, Workers AI, Turnstile, DNS API token); Supabase project (Postgres, RLS, Google auth provider); Google Cloud project (OAuth client; later Cloud Run, Scheduler, Secret Manager); Railway (existing)
- [ ] Stripe (test mode first): Micro and SMB, monthly and annual Prices; webhook secret
- [ ] Anthropic Console API key with a **$30/mo spend limit**
- [ ] Apollo and Hunter free tiers; Google Places API (New) with a quota cap
- [ ] HubSpot developer/private app; apply now for Jobber and ServiceTitan partner access (docs cite 1-2 weeks each)
- [ ] Slack workspace and incoming webhook (alerts); Twilio for critical SMS alerts
- [ ] Calendly link for the high-touch path
- [ ] Refresh the expired GitHub token; rotate keys stored in plaintext in `~/.claude/CLAUDE.md`
- [ ] Verify Anthropic's current terms for unattended use of a Pro plan

## Approvals (as items arrive)
- Outreach and messaging copy (all drafts are on hold and re-priced)
- Legal text (drafts in `legal/`), price changes, first outbound batch, first live Stripe charge
- Logo, marketing-site copy, Mid-Market waitlist copy
- Profile and QA-threshold choices, prompt changes proposed by the monthly QA loop

## Lane A: Foundation — needs Tyler
- [ ] **Confirm `platform/db/run-local.sh` now passes clean.** Context: the sandbox this lane runs in can't start Postgres (blocks the `shmget` syscall), so the migrations and the two-fake-customer isolation test have only been reviewed by eye, never executed. You ran it once (2026-09-20) and hit `role "anon" does not exist` — that was a bug in the test's local-only auth shim (it granted to roles before creating them), now fixed. Re-run `cd ~/BuildFlow-lanes/foundation && platform/db/run-local.sh` and paste the full output (all of `10_isolation.sql` and `20_monitoring.sql`). Until this passes, "migrations apply cleanly" and "customer A cannot read customer B" are unproven, and the lane isn't done per its own brief.
- [ ] **Approve adding the `pg` npm package as a dependency** of `platform/service` and `platform/monitoring`. Context: it's the standard Postgres driver, needed for the service's `/ready` endpoint to actually check the database (today it always reports ready) and for the monitoring runner's real DB adapter (today only mocked in tests). No paid cost; this session's sandbox can't reach the npm registry to install it regardless, so it needs to happen in your own terminal (`npm install pg` inside `platform/service`).
- [ ] **Build and run the `platform/service` Docker image once.** Context: this session's Docker/Colima daemon isn't running, so the container has only been proven through its request-handler unit tests (6 pass), never as an actual built image. Confirm `docker build -t buildflow-platform platform/service && docker run -p 8080:8080 buildflow-platform` starts and `curl localhost:8080/health` returns 200.
- [ ] **Decide whether to push `lane/foundation` to `origin` (github.com/CTCohen/BuildFlow) now.** Context: the repo now has a GitHub remote; this branch has 2 commits (contract + migrations/service/monitoring) and hasn't been pushed. It contains no secrets, but the DB tests above haven't passed yet, so pushing now would publish untested SQL. Say go/no-go, or say push it labelled as untested.
- [ ] **Supabase project specifics for this lane** (folds into the Phase 0 Supabase line above): after creating the project, expose only the `app` schema to the Data API — never `admin` — and set minimum password length to 12, and enroll TOTP for your own account before inserting yourself into `admin.admins`. Full steps in `platform/AUTH-SETUP.md`.

## Calls and hands-on
- Sales calls and onboarding during the soft launch
- Record the onboarding and offboarding videos (about 4-5 hours on camera)
- First-10 site scoring with the QA rubric (calibration)
