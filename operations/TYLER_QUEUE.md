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
- [ ] D29 Mid-Market-size leads: suppress, or waitlist? Lane C ([agents/lead/TASKS.md](../../agents/lead/TASKS.md)) built the scoring/send code to **suppress** them (score but never enroll in outreach) as the placeholder; flip to waitlist by routing `suppress_waitlist` leads into a holding list instead of dropping them, if that's your call.
- [ ] D32 which of `buildflow.io`, `buildflow.com`, `buildflowsites.com` you own
- [ ] D01 sender address (`tyler@` or a role address)
- [ ] Confirm or reverse the other provisional rulings in `DECISIONS.md` (item 14)
- [ ] **Lane C size-tier cutoffs used for lead scoring/routing.** `agents/lead/size.py` classifies Micro as under 3 employees, SMB as 3-20, Mid-Market above that or over $5M revenue (pulled from `docs/PRICING.md`, since SPEC-07 only says "1-50 employees" without sub-splits). "Headcount aligns" (+10 fit points) uses 1-20 as the sellable range. Confirm these cutoffs match how you want tiers assigned, since they decide who gets outreached vs. suppressed.
- [ ] **Lane C outreach-sequence mechanics not specified in SPEC-07 §3, need a ruling:**
  - Touch 2 (day 3) is skipped if the lead opened touch 1; only sent if unopened. Confirm this matches "re-send if no open."
  - The 0/3/7/14/21-day schedule uses **calendar days**, so a touch can land on a weekend. Say if weekend sends should be pushed to the next business day.
  - Campaign auto-pauses at **bounce rate ≥5%** in addition to the spec's named 5% spam-complaint pause (the spec sets <5% bounce as a target but doesn't say to pause on it — Lane C added the pause as a safety default). Confirm this is wanted, and whether "5%" should require a minimum sample size (Lane C used 20 sends) before it can trigger.
- [ ] **Lead Lookup manual-review threshold.** `agents/lead/lookup.py` flags a lead for your manual lookup whenever fan-out match confidence is below 0.7, or no provider matches at all. Confirm 0.7 is the right bar (spec doesn't set one).

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
- **Lane C outreach copy** ([messaging/outreach_sequence_draft.json](../../messaging/outreach_sequence_draft.json)): the 5-touch email sequence (subject + body for each of days 0/3/7/14/21), the touch-1 hook variants (no-website, weak-website, strong-reviews, no-GBP, default), and the CAN-SPAM footer. The send workflow (`agents/lead/send.py`) hard-blocks any real (non-mock) sender until this file's `meta.status` is changed from `draft` to `approved` — it will not send for real even with keys in place until you approve the copy here.
- **Postal address for the email footer** (CAN-SPAM requires one). `agents/lead/send.py` refuses to run at all without one configured; needed before any real send, mock or otherwise, in the pipeline that wires this to production config.
- Outreach and messaging copy (all drafts are on hold and re-priced)
- Legal text (drafts in `legal/`), price changes, first outbound batch, first live Stripe charge
- Logo, marketing-site copy, Mid-Market waitlist copy
- Profile and QA-threshold choices, prompt changes proposed by the monthly QA loop

## Calls and hands-on
- Sales calls and onboarding during the soft launch
- Record the onboarding and offboarding videos (about 4-5 hours on camera)
- First-10 site scoring with the QA rubric (calibration)
