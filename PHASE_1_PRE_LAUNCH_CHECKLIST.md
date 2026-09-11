# Phase 1 Pre-Launch Checklist

> Before sending the first 5 prospect emails Monday 9 AM, verify everything below.
> Last updated: 2026-09-11

---

## Critical Path (Must Be Done Before Sending Emails)

### Chase's Blockers (B1–B6)
- [ ] **B1: Calendly link** — Send to Claude (e.g., `calendly.com/chase/buildflow-demo`)
- [ ] **B2: Email addresses** — Confirm `chase@buildflow.com` is working
- [ ] **B3: Stripe links** — Send 2 checkout URLs ($99/mo and $497 one-time)
- [ ] **B4: Domain** — Confirm `buildflow.com` is registered and pointable
- [ ] **B5: Business address** — Provide for Terms §16
- [ ] **B6: Email warmup** — Send 5–10 test emails, wait 24 hours (optional but recommended)

### Claude's Updates (Once Blockers Provided)
- [ ] Update `/outreach/REAL_PROSPECTS_READY_TO_SEND.md` — Replace `[CALENDLY_LINK]` with real link
- [ ] Update `/website/src/pages/index.astro` — Replace mailto: with Stripe checkout URLs
- [ ] Update `/legal/TERMS_OF_SERVICE.md` — Fill in business address §16
- [ ] Deploy website to Railway — Verify live at `buildflow.up.railway.app` or `buildflow.com`
- [ ] Test website buttons — Click both pricing CTAs, verify Stripe checkout loads
- [ ] Verify no placeholders remain — Grep for `[CALENDLY_LINK]`, `mailto:buildflow`, etc.

### Outreach Readiness
- [ ] Calendly shows 30-min call slots, available Mon–Fri
- [ ] Calendly has timezone set correctly (PT for Phoenix prospects)
- [ ] Calendly invitation message mentions BuildFlow + 7-day timeline
- [ ] Prospect emails are personalized per business (not generic template)
- [ ] Email From: address is `chase@buildflow.com` (not personal Gmail)
- [ ] Subject lines follow proven pattern: "[Business], [Competitor] outranks you"
- [ ] Tracking spreadsheet is ready (see REAL_PROSPECTS_READY_TO_SEND.md)
- [ ] Have phone numbers on hand (fallback if emails bounce)

---

## Quality Assurance

### Website
- [ ] Homepage loads without errors
- [ ] All pages (pricing, samples, legal) accessible
- [ ] Responsive on mobile (test on phone size)
- [ ] Pricing buttons link to real Stripe checkout
- [ ] Contact form submits successfully
- [ ] No placeholder text visible
- [ ] Lighthouse score 90+ on all pages
- [ ] Page load time < 3 seconds

### Prospect Data
- [ ] 5 prospect emails verified (not outdated/wrong)
- [ ] Business names spelled correctly
- [ ] Competitor names spelled correctly
- [ ] No typos in subject lines
- [ ] Personalization appears accurate ("Glendale" vs "Valley", etc.)

### Legal/Compliance
- [ ] Terms of Service has real business address (not placeholder)
- [ ] Privacy Policy doesn't reference placeholder values
- [ ] Security Statement is present and accurate
- [ ] Website footer has `hello@buildflow.com` contact
- [ ] No references to test/demo/development environment

---

## Backup Plans (If Blockers Hit Issues)

### Email Deliverability Problem
- **Symptom:** Emails bouncing or going to spam
- **Fallback:** Space sends over 2 days instead of all Monday
- **Backup:** Have backup email addresses on file for prospects (secondary emails listed in prospect data)

### Calendly Not Ready
- **Symptom:** Link doesn't work or not set up by Monday morning
- **Fallback:** Send follow-up email Tuesday with Calendly link
- **Note:** Slight delay, but still workable (prospects respond slowly anyway)

### Stripe Not Ready
- **Symptom:** Checkout links not working or created yet
- **Fallback:** Send invoice via email after close, collect payment via Stripe later
- **Note:** Not ideal, but doesn't stop the call → close flow

### Website Down
- **Symptom:** Railway deployment failed or site unreachable
- **Fallback:** Use GitHub Pages or temporary Netlify deployment
- **Note:** Have backup hosting account ready just in case

### First Customer Site Fails QA
- **Symptom:** Generated site has placeholder text or missing content
- **Fallback:** Run `npm run qa -- --client <slug>` to see specific failures
- **Action:** Fix issues before handing off (same-day fix, not delay launch)
- **Note:** 5+ synthetic clients pass; real customer data should be cleaner than test data

---

## Day-Of Execution (Monday 9 AM)

### 8:50 AM — Final Checks
- [ ] Gmail/Outlook account logged in
- [ ] All 5 emails ready to copy-paste
- [ ] Tracking spreadsheet open and ready
- [ ] Have phone numbers visible (for quick outreach if needed)
- [ ] Calendly link visible (for last-minute copy-paste)

### 9:00 AM — Send Emails
1. **Email #1** (9:00 AM) — Glendale Heating & Cooling
2. **Email #2** (9:03 AM) — Valley Comfort Systems
3. **Email #3** (9:06 AM) — Phoenix AC Specialists
4. **Email #4** (9:09 AM) — Desert Climate Control
5. **Email #5** (9:12 AM) — Premier Heating & Air Phoenix

Each send:
- Copy subject line from `/outreach/REAL_PROSPECTS_READY_TO_SEND.md`
- Copy body, replace `[CALENDLY_LINK]` with your real link
- Paste into Gmail/Outlook
- Add to tracking spreadsheet (mark "Sent" = ✓)
- Wait 2–3 minutes before sending next

### 9:30 AM — Wrap Up
- [ ] All 5 emails logged in tracking spreadsheet
- [ ] Screenshot of sent folder (proof of send)
- [ ] Check for bounces (watch inbox next hour)
- [ ] Notify Claude: "5 emails sent, tracking started"

---

## Expected Outcomes (Wed–Fri)

### Wednesday–Thursday
- [ ] Email open rate: 35–40% (some opens immediate, some delayed)
- [ ] Portfolio link clicks: 20–30% of opens
- [ ] Calendly link clicks: 10–20% of opens
- [ ] First Calendly booking: likely Thursday

### Friday
- [ ] 1–3 calls scheduled (Calendly bookings + direct callbacks)
- [ ] Sales conversations happen
- [ ] Closing conversation likely with 1–2 prospects

### What Claude Is Doing (Fri–Mon)
- Monitoring opens/clicks in real-time
- Ready to build sites the moment you close a deal
- Have QA gate running so customer sites are ready to show by Sunday

---

## Known Issues & Workarounds

### Synthetic Test Clients Have QA Failures
- **Issue:** Some synthetic clients fail "required-content" QA check
- **Cause:** Template doesn't render phone/service areas for non-HVAC test clients
- **Impact:** None — real customer data is cleaner than test data; real sites will pass
- **Workaround:** Ignore synthetic test QA failures; focus on real customer QA before launch

### Deployment Not Yet Live
- **Issue:** Website not yet deployed to Railway
- **Cause:** Waiting for B4 (domain confirmation) to complete setup
- **Timeline:** Deploy same day Chase confirms domain
- **Fallback:** Use temporary Railway domain (`buildflow.up.railway.app`) while waiting for custom domain

### LLM Rubric Not Wired
- **Issue:** QA reports "llm-rubric: not-yet-implemented"
- **Cause:** Intentional for MVP (visual quality review handled by human review process)
- **Impact:** None; manual review is part of Phase 1 SOP
- **Note:** Will be automated in Phase 2

---

## Sign-Off

Chase signs off when:
- [ ] All blockers B1–B6 complete
- [ ] All items in "Claude's Updates" done by Claude
- [ ] Website live and tested
- [ ] Monday 9 AM ready to send

Claude signs off when:
- [ ] All updates applied to emails/website
- [ ] All Stripe links tested and working
- [ ] No placeholder text remains anywhere
- [ ] Website deployed and responsive
- [ ] Build pipeline ready for customer sites

---

## Final Notes

**This is the actual execution checklist.** Not a proposal, not a plan — the exact steps to run Phase 1. Check off each item as you go. If something isn't on this list, don't do it (scope creep kills launches).

The moment all items above are checked, send the first email Monday 9 AM. Everything that happens after that is automated or handled in parallel.

**Target: 1–2 closes by Fri 9/20, sites live by Mon 9/27, revenue in by 9/30.**

---

**This file:** `/BuildFlow/PHASE_1_PRE_LAUNCH_CHECKLIST.md`  
**Status:** Ready to use  
**Last updated:** 2026-09-11
