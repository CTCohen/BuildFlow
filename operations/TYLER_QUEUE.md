---
title: Tyler Queue
purpose: The only list of things that need Tyler: rulings, approvals, accounts and credentials, and calls. Loops append here instead of interrupting.
status: active
owner: c.t.cohen
updated: '2026-09-21'
version: 2.1.0
tier_scope: all
phase: phase_1
---

# Tyler queue

The only list of things that need you. Three sections, in order of urgency. If something has a working default
already, it's in section 3, not section 1 — the build isn't stuck on it. Rules: secrets go in a gitignored `.env`
or the provider's secret store, never in chat or docs. Check items off as you handle them; don't remove open ones
yourself — the daily/weekly agents log new items here and read this file to know what's still waiting.

## 1. Genuinely blocking work right now
- [x] **Run the database safety-test script** — done 2026-09-21. Every isolation and monitoring test passed.
  The Foundation lane is now fully proven and ready to merge.
- [x] **Mailing address** — given 2026-09-21 (your home address, for now). Stored in `.local/business-contact.env`,
  gitignored, never in a tracked file. Recommend switching to a PO box before real volume, but this unblocks
  building/testing now.
- [x] **The 5 lead-engine send-mechanics guesses** (weekend sends, bounce-pause threshold, skip-if-opened, calendar
  vs. business days, default timezone) — keeping all 5 defaults, per Tyler 2026-09-21. Resolved, not open.
- [x] **Company-size cutoffs** — kept as built (Micro under 3 employees, SMB 3-20, Mid-Market above/$5M+), matches
  your own pricing research. Ruled 2026-09-21, revisit only if it looks wrong later.
- [x] **Manual-review threshold for lead lookup** — redesigned instead of ruled: a low-confidence lead no longer
  gets flagged for you to check by hand. It now gets a second, deeper automated pass (broader search, more source
  cross-checks, a look at the actual site/socials) before a decision. Only skipped if that still can't confirm it.
  New build task logged in `BUILD_TASKS.md` §4. You should never see individual leads for review.

## 2. Accounts and credentials — needed before the *real* (not mock/local) version of each piece can run
Not blocking today's build work, but each one unlocks something specific. Do these on your own timeline; the
build keeps moving on mocks until you do.
- [ ] **Domains (OPEN — rebrand impact)** — domain plan: TBD under the Fornax name. `buildflow.io` / `buildflow.com` / `buildflowsites.com` no longer apply post-rebrand and none were purchased; buy the equivalent Fornax domains (marketing, app/admin/demo, customer-subdomain root) and register via Cloudflare Registrar.
- [ ] **Mailboxes** — `tyler@`, `hello@`, `support@`, `legal@`, `security@`
- [ ] **SendGrid** — needs its own Fornax account (checked: no account-wide key exists, only another venture's — don't reuse it, it would hurt that venture's sender reputation). Domain auth + separate cold-outreach sender domain; warmup takes time, so earlier is better.
- [ ] **Cloudflare** — account + API token (unlocks real site hosting). The whole deploy pipeline is built and
  tested on mocks (`platform/hosting/`, see BUILD_TASKS.md §2) and ready to flip to real the moment this
  exists. What's actually needed, once you've created the account:
  - **Account ID** (Cloudflare dashboard, right sidebar) — a config value, not a secret; goes in
    `FORNAX_CF_ACCOUNT_ID`.
  - **API token** (My Profile → API Tokens → Create Token, custom token) with these permission scopes:
    `Account.Cloudflare Pages: Edit` (deploy/rollback), `Account.Workers R2 Storage: Edit` (site asset uploads),
    `Zone.DNS: Edit` and `Zone.SSL and Certificates: Edit` scoped to whichever zone(s) the Fornax domains end
    up on (Domains item above — needs D32 first). Store it in the provider's secret store or a gitignored
    `.local/` env file, never in chat or a tracked file.
  - **R2 bucket name** — once the account exists, create one bucket for site assets and give me the name for
    `FORNAX_R2_BUCKET` (currently a placeholder).
  - **Zone ID(s)** for the purchased domain(s) — needed for the DNS/SSL calls once domains are bought.
- [◐] **Supabase** — project created (`wvkvcuffyzbejuipjfhu.supabase.co`), URL + publishable key stored locally 2026-09-21. Still need the **service role key** (Project Settings → API → service_role) before Foundation can actually connect for real.
- [ ] **Google Cloud** — OAuth client (unlocks real customer/admin login)
- [ ] **Stripe** — test-mode account first (unlocks real billing testing). Once it exists, three things are
  ready to wire in (code and tests already built on mocks, `billing/prices.py` + `billing/webhooks.py`):
  1. Create the real Products/Prices in test mode — 2 tiers (Micro $149/mo, SMB $249/mo) × 2 cycles
     (monthly, annual = 10x monthly) = 4 Prices, then drop the real Price IDs into `billing/prices.py`
     replacing the `price_ph_...` placeholders.
  2. Register a webhook endpoint (once there's a URL to point it at) for `invoice.payment_succeeded`,
     `invoice.payment_failed`, and the `customer.subscription.*` events, and give me the signing secret
     (`.local/`, gitignored) — swaps into `billing/webhooks.py` in place of the current mock verifier.
  3. Confirm whether early customers keep grandfathered pricing forever once prices rise, and roughly when/
     to what (D02, still open — see RECONCILIATION_LOG.md) — the versioning scheme is already built either way,
     this only picks the numbers/date.
- [ ] **Anthropic Console API key** — tried to get this myself via Chrome tonight (2026-09-22) but hit a real
  login wall (Google sign-in or email) that only you can complete — not something I should do on your behalf.
  Log in at console.anthropic.com yourself, create a key, **set the $30/mo spend limit**, and either drop it in
  `.local/anthropic-api.env` or tell me and I'll set that file up for you to paste into.
- [ ] **Apollo + Hunter** (free tiers) and **Google Places API** (with a quota cap) — unlocks real lead lookup
- [ ] **HubSpot** developer/private app — unlocks real CRM sync; also apply now for Jobber/ServiceTitan partner access (1-2 week lead time).
  Push connector logic and retries are already built and tested on mocks (`crm/TASKS.md`); once the app exists,
  three things unblock it: (1) the private app's access token, dropped in `.local/hubspot.env`, gitignored; (2)
  a few custom properties need creating in HubSpot's own schema UI on both the Contact and Deal objects —
  `fornax_lead_id`, `fornax_lead_score`, `fornax_vertical`, `fornax_source` on contacts, `fornax_lead_id` and
  `fornax_assigned_tier` on deals — before the API can set them; (3) confirm the real pipeline/stage IDs for
  your HubSpot account (we used HubSpot's generic defaults as placeholders, your actual pipeline may differ).
- [ ] **Twilio** — for critical alerts only (Slack dropped, see below)
- [ ] **Calendly link** — for the high-touch sales path
- [x] **GitHub token** — already covered account-wide, confirmed working (pushed tonight). Nothing needed.
- [ ] **Confirm the GitHub repo is set to Private** — still unconfirmed, worth a 30-second check on github.com

## Deferred until after revenue (Tyler's call, 2026-09-21) — not tracked as open until then
- Business basics (entity, EIN, business bank account, permanent business address)
- Choosing a lawyer for Terms/Privacy review
These still block the *real* Stripe charge and legal sign-off gates (see COORDINATOR_STATE.md G7), but there's
no reason to chase them before there's revenue to justify the cost. Build keeps moving without them.

## 3. Ruled tonight (2026-09-21) — closed, no longer open
- [x] **D01 sender address** — `hello@` (Tyler: no objection to the recommendation)
- [x] **D22 first CRM** — HubSpot, confirmed
- [x] **D26 "GEO"** — Generative Engine Optimization (showing up in AI answers, not geographic SEO). Relabeling as
  **"AI SEO (GEO)"** everywhere so it doesn't read as jargon.
- [x] **D29 Mid-Market-size leads** — changed from "suppress" to **capture in the lead warehouse, no outreach,
  nothing built yet**. This is a real change from the old default — flagged for whoever's building the lead
  pipeline: add a storage-only path, do not wire it to send.

## 4. Still open — decisions with a working default, confirm/change when it matters
- [ ] **Price-increase timing (D02)** — default: launch prices held, versioned so a later increase doesn't need code changes
- [ ] **Soft-launch cohort (D03)** — default: yes, the 5 Phoenix HVAC prospects get a design-partner deal
- [ ] **Offboard transition support (D04)** — default: one month included
- [ ] **Pre-launch data/tools budget (D05)** — default: none set, so far nothing has hit a wall over cost, but flag before real Apollo/Hunter spend starts
- [ ] **Other provisional rulings** — full list in `DECISIONS.md` item 14; same rule, defaults are in use, only flag if you want to change one

## Approvals (needed at the moment each thing is ready, not now)
- **Outreach copy** ([messaging/outreach_sequence_draft.json](../../messaging/outreach_sequence_draft.json)) — the
  5-touch email sequence and CAN-SPAM footer are drafted but code-blocked from sending until you approve them
  (flip `meta.status` from `draft` to `approved`). Won't send for real even once keys are in place until then.
- Legal text (drafts in `legal/`), any price change, the first outbound batch, the first live Stripe charge
- Logo, marketing-site copy, Mid-Market waitlist copy
- Style-profile choices and any QA-threshold change the monthly review loop proposes

## 5. Foundation lane — small items left, not blocking
- [ ] **`npm install pg`** in `platform/service` (your terminal — this session's sandbox can't reach the npm registry). Standard Postgres driver; without it the service's `/ready` endpoint always reports ready instead of actually checking the database.
- [ ] **Build the Docker image once**, to prove it, not just its unit tests: `docker build -t buildflow-platform platform/service && docker run -p 8080:8080 buildflow-platform`, then `curl localhost:8080/health` should return 200.
- [ ] **When you create the real Supabase project:** expose only the `app` schema to its Data API (never `admin`), set minimum password length to 12, and enroll TOTP on your own account before adding yourself to `admin.admins`. Full steps in `platform/AUTH-SETUP.md`.

## 6. Design lane — three small design calls, two you can just run
- [ ] **Micro tier: one hero layout or a few?** Built with one (`split`) so there's something concrete to look at. Ship with one, or want 2-3 options?
- [ ] **Micro tier: keep both the services grid page and individual service pages, or cut one?** Both exist now; wasn't an obvious call which one a $149/mo customer needs.
- [ ] **SMB font choice: leave it tied to the style profile, or add it as its own separate slider?** Cheap to add if you want it — already validated in the schema, just not exposed as a control yet.
- [ ] **Run the visual/speed QA checks on your machine (not blocking, whenever convenient)** — the build sandbox can't open a browser to run these. From `app/`: `CLIENT=demo-plumbing npm run build && npm run qa -- --client demo-plumbing --stage demo`. Flag anything scoring below 80.
- [ ] **Eyeball the 20 sample sites** — run `node agents/design/smoke.mjs`, open `agents/design/out/smoke/index.html`, see if they look right to you (4 trades × 2 tiers × a few styles).

## 7. Retention/deletion — open questions (2026-09-21)
Built the data retention/deletion code (`platform/db/migrations/0005_retention.sql`,
`platform/retention/retention.mjs`) using exactly the numbers in `legal/SPEC-11-compliance-security.md`
(90 days after cancel, 12 months for unconverted leads, 45 days to fulfill a deletion request). Three spots
where the spec doesn't say exactly how, so a default was picked rather than guessed silently — flag if you'd
pick differently:
- [ ] **What counts as "cancelled"?** Used the customer's own `churn_date` field, not the subscription's
  `canceled_at`. Both exist. If a customer can have `canceled_at` set on a subscription without `churn_date`
  being set on the customer row, the 90-day clock won't start — worth confirming that's not a real gap.
- [ ] **Unconverted lead: delete or anonymize?** The spec says "delete/anonymize" (either). Built it as
  anonymize (null out name/email/phone/company, keep the row) so lead-scoring analytics still have something
  to count. If you want a hard delete instead, that's a one-function swap.
- [ ] **A customer with billing history can't be hard-deleted.** `admin.payment_transactions` references the
  customer and isn't set to cascade-delete (financial records need their own retention rule the spec never
  states). Built it so that customer's row gets anonymized (name/email scrubbed) and everything else about
  them deleted, instead of a true hard delete. Worth confirming that's the right call, and whether payment
  records need their own stated retention period at some point.

## 7. Billing lane — Tiers 1-3 dunning state machine built tonight (2026-09-21), on mocks
- [x] **Dunning state machine (Tiers 1-3)** — built and passing 20/20 live tests
  (`billing/dunning/state_machine.py`, `python3 -m billing.dunning.run_evals`). Tier 4-5 (legal
  escalation, collections, write-off) intentionally not built — DECISIONS.md #14 keeps that manual.
- [ ] **Confirm the header-override day numbers over Section 6's prose** — `billing/SPEC-08-payments-billing.md`'s
  header says Tier 1 emails land days 1/4/7 and Tier 2 starts day 7; Section 6's own body just says "Days 1-7"
  without naming days. Built to the header (it's the more recent, explicit ruling) — say if that's wrong.
- [ ] **Minimum "partial payment" floor** — Section 6 says "site re-enabled on first partial payment" but
  doesn't define partial. Built with no floor (any amount under the full monthly charge counts as partial and
  unpauses the site). Want a minimum, e.g. 10%, so a token $1 payment doesn't re-enable service?
- [ ] **Back-payment calculation logic (Section 6 "Back-Payment Calculation")** — not built, judged out of scope
  for the Tier 1-3 task (it's really Tier 4/5 collections math). Flag when Tier 4/5 gets scoped for real.
- Full list of build assumptions: `billing/TASKS.md`.

## Calls and hands-on (needed later, not now)
- Sales calls and onboarding during the soft launch
- Recording the onboarding/offboarding videos (~4-5 hours on camera)
- Hand-scoring the first 10 sites against the QA rubric (calibration)
