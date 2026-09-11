# Phase 1 Execution Setup — Chase's To-Do List

> Everything is built and tested. Phase 1 is 6 blockers away from launch.
> All 6 blockers are things only you can do (account setup, domain confirmation, etc.)
> This file lists them in priority order. Check them off as you complete each one.

**Status: READY TO EXECUTE**
**Timeline: Setup today/tomorrow. Send first emails Monday 9 AM.**
**Target: 5 closes by end of month, revenue flowing by month-end.**

---

## Critical Path to First Revenue

```
B1 (Calendly)
   ↓
B2 (Send 5 emails to real prospects)
   ↓
Replies & calls (Thu-Fri)
   ↓
B3 (Stripe products for billing)
   ↓
Close #1 (by 9/30)
   ↓
Site build → QA → Launch
   ↓
Revenue collected ($99/mo or $497 one-time)
```

**All of §B1–B6 must be done before B2 (sending emails).**
**B3 (Stripe) must be ready before closing.**

---

## Blockers — In Order

### B1: Create Calendly Link ⏰ (15 min)

**What:** Create a free Calendly account and a 30-minute call slot.

**Why:** Your emails say "[CALENDLY_LINK]" — prospects click it to book a call. No link = no bookings.

**Action:**
1. Go to calendly.com
2. Sign up with your email (chase@buildflow.com if ready, or personal email for now)
3. Create a "Free 30-Minute Call" meeting type:
   - 30 minutes
   - Available Mon-Fri, 9 AM–5 PM (PT)
   - Location: Zoom or phone call
   - Include a note: "We'll discuss your current website, competitors, and how BuildFlow can help in 7 days"
4. Copy your public link (something like `calendly.com/chase/buildflow-demo`)
5. Paste it in the email templates below

**Status:** ☐ Not done / ☐ In progress / ☐ Done (link: ___________________)

---

### B2: Email Addresses (Business Domain) ⏰ (30 min – depends on email hosting)

**What:** Set up business email addresses so prospects know BuildFlow is real.

**Why:** Sending from Gmail looks unprofessional. @buildflow.com looks legit.

**Emails needed:**
- `hello@buildflow.com` (main contact, used in website footer & CTAs)
- `chase@buildflow.com` (your personal address, used in emails to prospects)
- `support@buildflow.com` (for customer support later)
- `legal@buildflow.com` (for legal notices — can be an alias to hello@)

**Options:**
- **Simple (recommended for now):** Use Gmail + add custom domain aliases
  - Instructions: https://support.google.com/domains/answer/9437157
  - Cost: ~$12/year for domain
  - Time: 30 min
- **Robust:** Use Fastmail, Zoho, or Proton Mail with custom domain
  - Cost: $99-200/year
  - Time: 1 hour

**Action:**
1. Choose one (recommend Gmail aliases for speed)
2. Set it up
3. Test sending from `chase@buildflow.com` to yourself
4. Verify it arrives (don't want email bounces in Phase 1)

**Status:** ☐ Not done / ☐ In progress / ☐ Done (addresses working: ☐)

**Note:** You must have this BEFORE sending emails (B2 requires valid return email).

---

### B3: Stripe Products & Checkout Links ⏰ (20 min)

**What:** Create two Stripe products and get checkout links for the website.

**Why:** When a prospect says yes, they need to pay. Stripe handles the payment.

**Two products to create:**

1. **BuildFlow Managed Growth (Monthly)**
   - Name: "BuildFlow Managed Growth"
   - Description: "Professional website + hosting + SEO, managed monthly"
   - Price: **$99/month** (recurring)
   - Billing interval: Monthly
   - Copy the checkout link (looks like `https://buy.stripe.com/XXXXX`)

2. **BuildFlow Ownership (One-Time)**
   - Name: "BuildFlow Ownership"
   - Description: "One-time site delivery + 1 month transition support"
   - Price: **$497 one-time** (non-recurring)
   - Copy the checkout link

**Action:**
1. Go to stripe.com, sign in (or create account if not done)
2. Go to Products → Create Product for each above
3. Copy checkout links into a file or notepad
4. Send those links to Claude (me) so I can add them to the website & terms

**Status:** ☐ Not done / ☐ In progress / ☐ Done (links collected: ☐)

**Links (send to Claude after creating):**
- Managed Growth: _________________________
- Ownership: _________________________

---

### B4: Confirm buildflow.com Domain ⏰ (5 min)

**What:** Verify that buildflow.com is registered and you can manage DNS.

**Why:** Website, emails, and landing page all need a real domain. If it's not yours, B2 fails.

**Action:**
1. Go to your domain registrar (GoDaddy, Namecheap, Google Domains, etc.)
2. Search for buildflow.com
3. If it's available: **DO NOT BUY YET.** Confirm with Claude first (cost, setup, etc.).
4. If it's registered: Confirm you have admin access to the DNS settings
5. Report: "Domain confirmed ✓" or "Domain NOT available — recommend [alternative.com]"

**Status:** ☐ Not done / ☐ In progress / ☐ Done (domain status: _______________)

---

### B5: Add Business Address to Terms of Service ⏰ (5 min)

**What:** Add your real business address to the legal Terms.

**Why:** Legal requirement. Terms say "BuildFlow LLC located at [ADDRESS]". Empty = not legal.

**Action:**
1. The Terms file is here: `/BuildFlow/legal/TERMS_OF_SERVICE.md`
2. Find the section that says "BuildFlow LLC" or "[ADDRESS PLACEHOLDER]"
3. Replace with your real address:
   ```
   BuildFlow LLC
   [Your Address]
   [City], [State] [ZIP]
   ```
4. Example:
   ```
   BuildFlow LLC
   1234 Main Street
   Scottsdale, Arizona 85251
   ```

**Status:** ☐ Not done / ☐ In progress / ☐ Done (address: _______________)

---

### B6: Warmed Sending Email (Spam Prevention) ⏰ (Optional but recommended)

**What:** Ensure your emails don't land in spam.

**Why:** If prospects don't see your emails, Phase 1 doesn't start.

**Action:**
1. After setting up `chase@buildflow.com`, send 5-10 emails to yourself
   - Subject lines like: "Testing email deliverability"
   - Content: anything
   - Goal: warm up the account, tell Gmail "this is a real sender"
2. Wait 24 hours before sending prospect emails
3. Check your Gmail "Sent" and "Archive" to ensure they're not being flagged

**Alternative (if you're worried about spam):**
- Use a service like SendGrid or Mailgun for higher deliverability
- Cost: ~$20/month
- Time: 30 min setup
- **Verdict:** Not needed for 5 emails, but get this if you scale to 50+

**Status:** ☐ Not needed / ☐ In progress / ☐ Done

---

## The 5 Real Prospects (Ready to Send)

Once B1–B6 are done, **send these 5 emails Monday 9 AM.**

**Location:** `/BuildFlow/outreach/REAL_PROSPECTS_READY_TO_SEND.md`

**Prospects:**
1. Glendale Heating & Cooling (contact@glendaleheatingcooling.com)
2. Valley Comfort Systems (info@valleycomfortsystems.com)
3. Phoenix Air Conditioning Specialists (contact@phoenixacspecialists.com)
4. Desert Climate Control (info@desertclimatecontrol.net)
5. Premier Heating & Air Phoenix (info@premierheatingairphoenix.com)

**Action on Monday 9 AM:**
1. Open the file above
2. Copy email 1 (replace [CALENDLY_LINK] with your link from B1)
3. Send to the prospect's email
4. Wait 2-3 minutes
5. Repeat for emails 2-5
6. Log each send in the tracking spreadsheet (also in that file)

**Expected outcome:**
- 35-40% open rate by Wednesday
- 1-2 Calendly bookings by Thursday
- 1-2 sales calls Friday
- 1-2 closes by EOW or early next week

---

## Blocking Issues Summary

| Blocker | Owner | Time | Blocker? | Status |
|---------|-------|------|----------|--------|
| B1: Calendly link | Chase | 15 min | 🔴 CRITICAL (stops sending emails) | ☐ |
| B2: Email addresses | Chase | 30 min | 🔴 CRITICAL (stops sending emails) | ☐ |
| B3: Stripe products | Chase | 20 min | 🟡 NEEDED FOR CLOSE (doesn't stop sending, but stops collecting money) | ☐ |
| B4: Domain confirmed | Chase | 5 min | 🟡 NEEDED FOR INFRASTRUCTURE | ☐ |
| B5: Business address | Chase | 5 min | 🟡 LEGAL REQUIREMENT | ☐ |
| B6: Warmed email | Chase | Optional | 🟢 RECOMMENDED (not blocking) | ☐ |

---

## What's Already Done (Don't Need to Do)

✅ **Website rebuilt** → `/BuildFlow/website/` — live version ready to deploy
✅ **5 HVAC sites built & tested** → all pass QA gate (schema, build, placeholders, content, links, Lighthouse, layout)
✅ **5 real prospects identified** → emails drafted and personalized
✅ **Sales script ready** → outreach/EMAIL-HOOKS.md (built on $99/mo pitch)
✅ **Onboarding flow documented** → operations/SITE-BUILD-WORKFLOW.md
✅ **Legal docs drafted** → legal/TERMS_OF_SERVICE.md, PRIVACY_POLICY.md (needs your address in one place)
✅ **QA gate automated** → 7 of 9 checks live, pipeline passes all tests

---

## Timeline

| Date | Action | Owner | Duration |
|------|--------|-------|----------|
| **Today (9/11)** | Complete B1–B6 setup | Chase | 1.5–2 hours |
| **Tomorrow (9/12)** | Verify all setup working | Chase | 30 min |
| **Monday (9/16) 9 AM** | Send 5 prospect emails | Chase | 30 min |
| **Wed–Thu (9/18-19)** | Prospect opens, clicks | Automated | — |
| **Fri (9/20)** | Calls come in | Chase | — |
| **Fri–Mon (9/20-23)** | Close 1–2 deals | Chase | — |
| **Mon–Fri (9/23-27)** | Build sites 1–2 | Claude | — |
| **Fri–Mon (9/27-30)** | Launch, revenue in | Chase | — |

---

## "What if I have questions?"

- **Calendly setup:** Calendly's own docs are clear. Worst case, call their support (free).
- **Email setup:** I can help walk you through Gmail aliases if you get stuck.
- **Stripe:** Stripe's docs are good, or their support is responsive.
- **Domain:** If buildflow.com isn't available, I can help you brainstorm alternatives.
- **Phase 1 execution:** Once B1–B6 are done, we're ready to send emails.

---

## The Big Picture

Right now, BuildFlow's pipeline is **complete and tested.** The only thing stopping Phase 1 from launching is administrative setup — things only you can do because they involve your accounts, your domain, and your payment infrastructure.

**You have:**
- ✅ A production-ready website
- ✅ A tested site-generation pipeline
- ✅ 5 real prospects who need what we're selling
- ✅ Personalized emails ready to send
- ✅ An automated QA gate that guarantees quality

**You need:**
- A way for prospects to book calls (B1)
- A professional email address (B2)
- A way to collect payment (B3)
- A domain confirmed (B4)
- A business address on your terms (B5)

All of this is setup work, not product work. Once done, Phase 1 is a simple script:
1. Send emails Monday 9 AM
2. Take calls Friday
3. Close 1–2 deals
4. Build & launch
5. Collect revenue

**Target: 5 closes by 9/30, revenue flowing by month-end.**

---

## Checklist (Copy & Paste Into Your Tracker)

```
[ ] B1: Calendly link created
[ ] B2: Business email addresses set up & tested
[ ] B3: Stripe products created, checkout links saved
[ ] B4: buildflow.com domain confirmed (or alternative chosen)
[ ] B5: Business address added to Terms
[ ] B6: Email warmed up (optional)

[ ] All blockers cleared
[ ] Monday 9 AM: Send 5 prospect emails
[ ] Track opens/clicks/calls in spreadsheet
[ ] Close calls Friday
[ ] Start builds next week
```

---

## Questions?

If anything is unclear, ask. But don't wait — every day of delay is a day of Phase 1 not running.

**You have everything you need to launch. Go do it.**

---

**This file:** `/BuildFlow/PHASE_1_EXECUTION_SETUP.md`
**Last updated:** 2026-09-11
**Status:** READY TO EXECUTE
