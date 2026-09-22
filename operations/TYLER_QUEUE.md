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

## Lane B: design engine (decisions from the build, `operations/lanes/STATUS-B-design.md`)
- [ ] **Micro: how many fixed hero options?** Built with 1 (`split`, the MICRO.md default) so there is something concrete to look at. `docs/DESIGN_SYSTEMS/MICRO.md`'s open item asked whether Micro should offer 2-3. Decide: ship with 1, or have Lane B add 2 more (e.g. `full-bleed`, `minimal`) before launch.
- [ ] **Micro: single service page vs. services grid?** Also open in `MICRO.md`. Currently Micro has both — a `/services` grid and per-service pages (same components as SMB, reduced set) — because dropping either wasn't an obvious call. Confirm that's right for a $149/mo customer, or say which one to cut.
- [ ] **SMB font-dropdown sliders: build them, or is the type-pairing set enough?** Spec System 04 §7 lists separate headline-font and body-font dropdowns (4 options / 2 options) as customer sliders. What's built instead is the pre-existing 3 `typePairing` choices (grotesk-serif / humanist / classic), set by the styling profile and not currently slider-exposed to the SMB customer alongside color/spacing/radius. Decide: leave it as profile-only, or have Lane B expose `typePairing` as a fourth SMB slider (cheap: it's already validated in the schema).
- [ ] **Run the browser QA checks (Lighthouse + layout) on your machine** — the build sandbox can't open a local port or launch Chrome, so this hasn't been done yet. From `app/`: `CLIENT=demo-plumbing npm run build && npm run qa -- --client demo-plumbing --stage demo`, or `node agents/design/smoke.mjs --browser require` for all 20 smoke sites. Report back if any site is below the demo floor (Lighthouse 80 / accessibility 90).
- [ ] **First-10 site scoring (QA rubric, calibration)** — now has something to score: run `node agents/design/smoke.mjs`, open `agents/design/out/smoke/index.html` (20 fictional sites, 4 verticals x SMB/Micro x 2-3 profiles), and score per the manual-review checklist in `design/SPEC-04-design-quality.md` §2.

## Calls and hands-on
- Sales calls and onboarding during the soft launch
- Record the onboarding and offboarding videos (about 4-5 hours on camera)
