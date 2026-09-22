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
- [ ] **Give a mailing address** for the bottom of outreach emails (the law requires a real postal address on any
  commercial email — CAN-SPAM). The lead-engine lane has this coded as a hard requirement and won't run for real
  without it. A PO box is fine.
- [ ] **Skim and confirm 5 small technical guesses** the lead-engine lane made where the spec didn't say (full
  detail in `agents/lead/TASKS.md`): (1) send emails on weekends too, or skip them? (2) pause outreach once 5%+
  of emails bounce? (3) skip the day-3 follow-up if someone already opened the day-0 email? (4) count days as
  calendar days, not business days, for the 0/3/7/14/21 send schedule? (5) default to Eastern time for any state
  it doesn't recognize? Current defaults: yes to all five. Say only if you want one changed.

## 2. Accounts and credentials — needed before the *real* (not mock/local) version of each piece can run
Not blocking today's build work, but each one unlocks something specific. Do these on your own timeline; the
build keeps moving on mocks until you do.
- [ ] **Business basics** — entity/EIN, business bank account, real business address (needed for Stripe/1099-K and the Terms of Service)
- [ ] **A lawyer** for Terms/Privacy review — required before the first real charge, not before
- [ ] **Domains** — confirm which of `buildflow.io` / `buildflow.com` / `buildflowsites.com` you actually own, move to Cloudflare Registrar if needed
- [ ] **Mailboxes** — `tyler@`, `hello@`, `support@`, `legal@`, `security@`
- [ ] **SendGrid** — account, domain authentication, a separate cold-outreach sender domain (warmup takes time, so earlier is better)
- [ ] **Cloudflare** — account + API token (unlocks real site hosting)
- [ ] **Supabase** — real project (unlocks the real database — Foundation lane is currently local-only)
- [ ] **Google Cloud** — OAuth client (unlocks real customer/admin login)
- [ ] **Stripe** — test-mode account first (unlocks real billing testing)
- [ ] **Anthropic Console API key** — with a $30/mo spend limit set
- [ ] **Apollo + Hunter** (free tiers) and **Google Places API** (with a quota cap) — unlocks real lead lookup
- [ ] **HubSpot** developer/private app — unlocks real CRM sync; also apply now for Jobber/ServiceTitan partner access (1-2 week lead time)
- [ ] **Slack workspace + webhook**, **Twilio** — unlocks real alerting
- [ ] **Calendly link** — for the high-touch sales path
- [ ] **Housekeeping:** refresh the expired GitHub token; rotate the plaintext keys in `~/.claude/CLAUDE.md`; confirm the GitHub repo is set to Private (still unconfirmed)

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
- Outreach and messaging copy — all current drafts are on hold and marked re-priced
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

## Calls and hands-on (needed later, not now)
- Sales calls and onboarding during the soft launch
- Recording the onboarding/offboarding videos (~4-5 hours on camera)
- Hand-scoring the first 10 sites against the QA rubric (calibration)
