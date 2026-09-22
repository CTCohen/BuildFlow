---
title: 'Phase 1: SMB Launch'
purpose: Execution plan for Phase 1 SMB tier launch by 2026-09-30
status: active
owner: c.t.cohen
version: '1.0'
tier_scope: smb
phase: phase_1
critical_path: true
related:
- ROADMAP.md
- DECISIONS.md
---

> **ON HOLD (2026-09-18):** re-priced to the spec pricing (SMB $249/mo, offboard $799). Do not send or use this until Tyler approves the updated copy. Phase 1 was re-baselined to the platform launch; see `ROADMAP.md` and `RECONCILIATION_LOG.md` (D42).


# Phase 1 — First 5 Closes

**Status:** 🟢 READY TO EXECUTE  
**Timeline:** 9/11–9/30  
**Target:** 5 closes, $495/mo MRR, 5 sites live  
**Owner:** Tyler (sales), Claude (builds + delivery)

---

## Executive Summary

Everything is built and tested. Phase 1 is 6 setup tasks away from launch.

**What's done:**
- ✅ Pipeline fully tested, QA-gated
- ✅ 5 real prospects identified with emails drafted
- ✅ Website rebuilt and deployment infrastructure live
- ✅ Security hardened, design system consolidated

**What's blocking:**
- ⏳ Tyler: 6 setup blockers (75 minutes of work)

**Next:**
- Today/tomorrow: Complete blockers
- Monday 9 AM: Send 5 emails
- Friday: Sales calls, close 1–2 deals
- Fri–Mon: Build and launch sites
- By 9/30: 5 closes, revenue flowing

---

## Critical Path to First Revenue

```
B1 (Calendly)
   ↓
B2 (Email addresses)
   ↓
B3 (Stripe products)
   ↓
MONDAY 9 AM: Send 5 emails
   ↓
WED–THU: Opens & clicks come in
   ↓
FRIDAY: Sales calls
   ↓
CLOSE 1–2 DEALS
   ↓
MON–FRI (following week): Build + Launch
   ↓
REVENUE COLLECTED
```

**Timeline: Setup today/tomorrow. Send Monday 9 AM.**

---

## Your Setup Blockers (B1–B6)

### B1: Create Calendly Link ⏰ (15 min)

**What:** Free Calendly account, 30-minute call slot

**Why:** Emails link to your calendar. No link = no bookings.

**Action:**
1. calendly.com → Sign up with email
2. Create "Free 30-Minute Call" meeting type:
   - 30 minutes
   - Mon–Fri, 9 AM–5 PM PT
   - Location: Zoom or phone
   - Note: "We'll discuss your current website, competitors, and how Fornax can help in 7 days"
3. Copy public link (e.g., `calendly.com/tyler/fornax-demo`)
4. Send to Claude

**Status:** ☐ Not done / ☐ In progress / ☐ Done (link: ___________________)

---

### B2: Business Email Addresses ⏰ (30 min)

**What:** @[domain TBD under Fornax name] email addresses (not Gmail)

**Why:** Prospects need to see a real business, not a personal Gmail account

**Emails needed:**
- `tyler@[domain TBD under Fornax name]` (your personal address, used in outreach)
- `hello@[domain TBD under Fornax name]` (main contact, website footer)
- `support@[domain TBD under Fornax name]` (customer support)
- `legal@[domain TBD under Fornax name]` (legal notices)

**Options:**
- **Simple (recommended):** Gmail + add custom domain aliases (~$12/yr domain cost, 30 min)
  - https://support.google.com/domains/answer/9437157
- **Robust:** Fastmail, Zoho, or Proton Mail ($99–200/yr, 1 hr)

**Action:**
1. Choose option above
2. Set up all 4 emails
3. Test: Send from `tyler@[domain TBD under Fornax name]` to yourself
4. Verify it arrives (don't want bounces on prospects)
5. Confirm ready to Claude

**Status:** ☐ Not done / ☐ In progress / ☐ Done (addresses working: ☐)

---

### B3: Stripe Products & Checkout Links ⏰ (20 min)

**What:** 2 Stripe products with checkout links for billing

**Why:** When a prospect says yes, they click a link to pay. No Stripe = no money collected.

**Products to create:**

1. **Fornax Managed (Monthly)**
   - Name: "Fornax Managed"
   - Description: "Professional website + hosting + SEO, managed monthly"
   - Price: **$249/month** (recurring)
   - Billing interval: Monthly
   - Get checkout link (looks like `https://buy.stripe.com/XXXXX`)

2. **Fornax Offboard (One-Time)**
   - Name: "Fornax Offboard"
   - Description: "One-time site delivery + 1 month transition support"
   - Price: **$799 one-time** (non-recurring)
   - Get checkout link

**Action:**
1. stripe.com → Sign up or log in
2. Products → Create Product for each
3. Copy both checkout links
4. Send to Claude

**Status:** ☐ Not done / ☐ In progress / ☐ Done (links collected: ☐)

**Links (send to Claude):**
- Managed: _________________________
- Offboard: _________________________

---

### B4: Confirm [domain TBD under Fornax name] Domain ⏰ (5 min)

**What:** Verify that [domain TBD under Fornax name] is registered and you can manage DNS

**Why:** Website, emails, and landing page all need a real domain. If it's not yours, we can't use it.

**Action:**
1. Go to your domain registrar (GoDaddy, Namecheap, Google Domains, etc.)
2. Search for [domain TBD under Fornax name]
3. If available: **Confirm with Claude before buying** (cost, setup, etc.)
4. If registered: Confirm you have admin access to DNS settings
5. Report status to Claude

**Status:** ☐ Not done / ☐ In progress / ☐ Done (domain status: _______________)

---

### B5: Add Business Address to Terms of Service ⏰ (5 min)

**What:** Your real business address in the legal Terms

**Why:** Legal requirement. Terms say "Fornax LLC located at [ADDRESS]". Empty = not legal.

**Action:**
1. Open `/legal/TERMS_OF_SERVICE.md`
2. Find the section with "Fornax LLC" or "[ADDRESS PLACEHOLDER]"
3. Replace with your real address:
   ```
   Fornax LLC
   [Your Address]
   [City], [State] [ZIP]
   ```
4. Confirm to Claude

**Example:**
   ```
   Fornax LLC
   1234 Main Street
   Scottsdale, Arizona 85251
   ```

**Status:** ☐ Not done / ☐ In progress / ☐ Done (address: _______________)

---

### B6: Warm Up Email Account ⏰ (Optional but recommended)

**What:** Send test emails from your new account to warm it up

**Why:** Email providers (Gmail, Outlook) flag new accounts as spam. A warm account has higher deliverability.

**Action:**
1. After setting up `tyler@[domain TBD under Fornax name]`, send 5–10 test emails to yourself
   - Subject: "Testing email deliverability"
   - Content: Anything
2. Wait 24 hours before sending prospect emails
3. Check Gmail "Sent" folder (ensure none are flagged)

**Alternative:** Use SendGrid/Mailgun for higher deliverability (~$20/mo, 30 min setup)  
**Verdict:** Not needed for 5 emails, but get this if scaling to 50+

**Status:** ☐ Not needed / ☐ In progress / ☐ Done

---

## Our Updates (Once You Provide Blockers)

Once you send Claude the 6 values above (Calendly link, Stripe links, email address, domain, business address), I will:

1. ✅ Update prospect emails with your real Calendly link (replace placeholder)
2. ✅ Update website with real Stripe checkout URLs
3. ✅ Update Terms with your business address
4. ✅ Deploy website to Railway
5. ✅ Verify no placeholders remain
6. ✅ Test both pricing buttons (Stripe checkout loads)
7. ✅ Confirm everything ready for Monday send

**Time required:** ~30 minutes

---

## Pre-Launch Checklist

### Critical Path (Must Be Done Before Sending Emails)

**Tyler's Setup (B1–B6)**
- [ ] B1: Calendly link created and working
- [ ] B2: Email addresses confirmed working (@[domain TBD under Fornax name])
- [ ] B3: Stripe checkout links created
- [ ] B4: Domain status confirmed
- [ ] B5: Business address in Terms §16
- [ ] B6: Email account warmed (optional but recommended)

**Claude's Updates**
- [ ] Prospect emails updated with your Calendly link
- [ ] Website pricing buttons link to real Stripe checkout
- [ ] Terms of Service filled with business address
- [ ] Footer has correct support email
- [ ] No placeholder text remains in any file
- [ ] Website deployed and live on Railway
- [ ] Both pricing buttons tested (Stripe checkout loads)

**Outreach Readiness**
- [ ] Calendly shows 30-min slots, correct timezone (PT for Phoenix prospects)
- [ ] Calendly invitation message mentions Fornax + 7-day timeline
- [ ] 5 prospect emails personalized (not generic)
- [ ] Email From: address is `tyler@[domain TBD under Fornax name]`
- [ ] Subject lines follow pattern: "[Business], [Competitor] outranks you"
- [ ] Tracking spreadsheet ready (see REAL_PROSPECTS_READY_TO_SEND.md)
- [ ] Prospect phone numbers on hand (fallback if emails bounce)

---

### Quality Assurance

**Website**
- [ ] Homepage loads without errors
- [ ] All pages (pricing, samples, legal) accessible
- [ ] Responsive on mobile
- [ ] Pricing buttons link to real Stripe checkout
- [ ] Contact form submits successfully
- [ ] No placeholder text visible
- [ ] Lighthouse score 90+ on all pages

**Prospect Data**
- [ ] 5 prospect emails verified (not outdated)
- [ ] Business names spelled correctly
- [ ] Competitor names spelled correctly
- [ ] No typos in subject lines
- [ ] Personalization appears accurate

**Legal/Compliance**
- [ ] Terms has real business address (not placeholder)
- [ ] Privacy Policy doesn't reference placeholder values
- [ ] Website footer has `hello@[domain TBD under Fornax name]`
- [ ] No references to test/demo/development

---

### Backup Plans (If Issues Hit)

**Email Deliverability Problem**
- **If:** Emails bouncing or going to spam
- **Fallback:** Space sends over 2 days instead of all Monday
- **Backup:** Have alternate emails on file for prospects

**Calendly Not Ready**
- **If:** Link doesn't work by Monday morning
- **Fallback:** Send follow-up Tuesday with link
- **Note:** Slight delay, but workable

**Stripe Not Ready**
- **If:** Checkout links not working
- **Fallback:** Send invoice via email after close, collect payment later
- **Note:** Not ideal, but doesn't stop the sales call

**Website Down**
- **If:** Railway deployment failed
- **Fallback:** Use GitHub Pages or temporary Netlify deployment
- **Note:** Have backup hosting ready

**First Customer Site Fails QA**
- **If:** Generated site has placeholder or missing content
- **Fallback:** Run QA check to see specific failures
- **Action:** Fix same day before handing off
- **Note:** Synthetic test clients have known issues; real customer data is cleaner

---

## Day-Of Execution (Monday 9 AM)

### 8:50 AM — Final Checks
- [ ] Gmail/Outlook logged in
- [ ] All 5 emails ready to copy-paste
- [ ] Tracking spreadsheet open
- [ ] Prospect phone numbers visible
- [ ] Calendly link visible (for last-minute copy-paste)

### 9:00 AM — Send Emails
**30 minutes, 5 emails, 2–3 minutes apart:**

1. **9:00 AM** — Glendale Heating & Cooling
2. **9:03 AM** — Valley Comfort Systems
3. **9:06 AM** — Phoenix AC Specialists
4. **9:09 AM** — Desert Climate Control
5. **9:12 AM** — Premier Heating & Air Phoenix

**Per email:**
- Copy subject line from `/outreach/REAL_PROSPECTS_READY_TO_SEND.md`
- Copy body, replace `[CALENDLY_LINK]` with your real link
- Paste into Gmail/Outlook
- Add to tracking spreadsheet (mark "Sent" = ✓)
- Wait 2–3 minutes before sending next

### 9:30 AM — Wrap Up
- [ ] All 5 emails logged in tracking spreadsheet
- [ ] Screenshot of sent folder (proof)
- [ ] Check for bounces (watch inbox next hour)
- [ ] Notify Claude: "5 emails sent, tracking started"

---

## Expected Outcomes (Wed–Fri)

**Wednesday–Thursday**
- Email open rate: 35–40% (typical for cold email)
- Portfolio link clicks: 20–30% of opens
- Calendly link clicks: 10–20% of opens
- First Calendly booking: likely Thursday

**Friday**
- 1–3 calls scheduled (Calendly bookings + direct callbacks)
- Sales conversations with 1–3 prospects
- Closing conversation likely with 1–2

**Claude's Work (Fri–Mon)**
- Monitoring opens/clicks real-time
- Ready to build sites the moment you close
- QA gate running so customer sites are ready to show by Sunday

---

## Success Criteria

**PHASE 1 DONE = TRUE if:**
- ✅ 5+ closes by 9/30
- ✅ 5+ sites live by 9/30
- ✅ $495+/mo MRR by 9/30
- ✅ 0 major outages
- ✅ 0 customer quality complaints

**If ANY above fail:** Retrospective, then Phase 2 adjustment

---

## Sign-Off

**Tyler signs off when:**
- [ ] All blockers B1–B6 complete
- [ ] Ready to send emails Monday 9 AM

**Claude signs off when:**
- [ ] All updates applied to emails/website
- [ ] All Stripe links tested and working
- [ ] No placeholder text remains
- [ ] Website deployed and responsive
- [ ] Build pipeline ready for customer sites

---

## FAQ

**Q: What if we don't get 5 closes by 9/30?**  
A: We pivot. Retrospective on what didn't work, adjust messaging/pricing/targeting for Phase 2. 1–2 closes still proves the model.

**Q: Can I send emails Tuesday instead of Monday?**  
A: Yes, but Monday is better (more replies Thu–Fri). Tuesday works fine.

**Q: Do I need Calendly or can I just give out my phone number?**  
A: Calendly is better (low friction, no back-and-forth). Phone is fallback if Calendly breaks.

**Q: What if a prospect asks to customize their site?**  
A: Phase 1 is fixed scope. Say: "We build it standard in 7 days. After launch, you can request edits (included with Managed)." This keeps timeline tight.

**Q: How many times can I follow up if they don't reply?**  
A: Phase 1 is one send. If they don't reply in the first week, move on. Phase 2 will have follow-up sequences.

---

**Last updated:** 2026-09-11  
**Archive plan:** When Phase 1 closes (by 10/15), move this to `archive/planning/PHASE_1.md`  
**Next phase:** Phase 2 (10+ closes, 10+ sites live, ops automation)
