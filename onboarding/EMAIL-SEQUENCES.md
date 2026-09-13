---
title: Email Sequences
purpose: Documentation for EMAIL-SEQUENCES.md
status: draft
owner: c.t.cohen
updated: '2026-09-12'
tier_scope: all
phase: operational
---

# Automated Onboarding Email Sequences

**Goal:** Guide customers through setup (Google Business, call tracking, customer outreach) with minimal manual intervention.

**Timeline:**
- Day 0: Welcome email
- Day 1: Setup instructions
- Day 3: SMS reminder + customer outreach template
- Day 7: Final checklist + support offer

---

## Day 0: Welcome Email

**Timing:** Auto-send immediately after site launches (within 1 hour)

**Subject:** "Your new website is live! 🎉"

**From:** hello@buildflow.com

**Body:**

```
Hi [First Name],

Your new website is live!

Visit: [SITE_URL]

Take a look and let us know what you think. Your site is ready for customers.

Over the next 7 days, we'll help you set up three things to start getting leads:
1. Google Business Profile (so customers find you on Google Maps)
2. Call tracking (so you know which leads come from your site)
3. Tell your customers about their new site

Step 1 starts tomorrow. Check your email tomorrow morning.

Questions? Reply to this email anytime.

[Your name]
BuildFlow
```

**Metadata:**
- Email: Text only (no complex HTML, just clean text)
- Link tracking: Track site URL clicks
- Next trigger: Day 1 email (24 hours later)
- Fallback: If no response, still send Day 1 (no manual intervention)

**Metrics to track:**
- Open rate (target: >40%)
- Click rate (target: >20%)
- Site visit duration

---

## Day 1: Setup Instructions Email

**Timing:** Auto-send 24 hours after Day 0

**Subject:** "Let's set up Google Business & call tracking (15 min)"

**Body:**

```
Hi [First Name],

Ready to set up? Here's what we're going to do today:

PART 1: Google Business Profile (5 min)
This gets you on Google Maps and Google Search.

→ Watch this video: [VIDEO_2_LINK]
   (Or read the full guide: [GUIDE_LINK])

Key steps:
1. Go to google.com/business
2. Search for your business name
3. Claim or create your profile
4. Add your website: [SITE_URL]
5. Verify ownership (Google mails you a postcard)

Once verified, you'll show up when customers search for your services in your area.

---

PART 2: Call Tracking (5 min)
This shows you which phone calls come from your website.

→ Watch this video: [VIDEO_3_LINK]
   (Or use CallRail: callrail.com - free tier available)

Key steps:
1. Sign up for CallRail (or similar)
2. Get your tracking phone number
3. Add it to your site settings
4. Every call is logged with time, duration, source

This takes 5 minutes and tells you if the website is working.

---

HOW TO GET HELP:
- Video stuck? Watch it on YouTube directly: [YT_LINK]
- Need help? Reply to this email with "HELP [topic]"
- Prefer a call? Reply with "CALL ME"

Once you finish both, reply "DONE" and we'll send you Part 3.

Good luck!

[Your name]
BuildFlow
```

**Metadata:**
- Email: Send at 8 AM PT (customer's time if available)
- Personalization: [First Name], [SITE_URL]
- CTA: "Reply DONE" when setup complete
- Alternative: If customer doesn't reply in 3 days, send Day 3 reminder anyway

**Triggers:**
- If customer replies "DONE" or "HELP [topic]" → Human notified (support contractor responds)
- If customer replies "CALL ME" → Calendar link sent for call scheduling
- If no reply by Day 3 → Day 3 reminder auto-sends

---

## Day 3: SMS Reminder (Optional) + Day 3 Email

**SMS (optional, if opted in):**

```
Hi [First Name]! Quick reminder: 
Set up Google Business today? Takes 5 min: [GOOGLE_GUIDE_LINK]

Reply YES when done, or HELP if stuck. 
– BuildFlow
```

**Timing:** Send at 10 AM PT

**Email Subject:** "Day 3: Tell your customers about their new site"

**Body:**

```
Hi [First Name],

You've got one more step to maximize your site's impact:

Tell your existing customers about it.

This is the most underrated marketing move. Existing customers are your most likely leads.

Here's what to do:

OPTION 1: Send an email to your customer list
(Copy & paste this template, send from your own email)

---
TEMPLATE EMAIL:

Subject: New Website – Check It Out

Hi everyone,

We just launched a brand new website and wanted you to see it:
[SITE_URL]

Now you can:
✓ Get instant quotes online
✓ See our latest work
✓ Book appointments
✓ Find us on Google Maps

Give it a look and let us know what you think!

[Your name & business]
---

OPTION 2: Send a text message
(If your customers text you)

"Hey! Check out our new website: [SITE_URL]
Easy online quotes & booking. Thanks!"

OPTION 3: Post on social media
(Facebook, Instagram, etc.)

"Exciting news! We just launched a new website. 
Check us out: [SITE_URL]"

---

QUESTIONS TO CONSIDER:
- Do you have a customer email list? (If yes, this is the time to use it)
- Which customers had great experiences? (Start with your best cases)
- How often do customers contact you? (Weekly? Daily?) Tell them during your next interaction

DO THIS TODAY. Seriously.

This one step often brings your first website leads.

Next up: Monthly checklist to keep your site fresh (coming Day 7).

[Your name]
BuildFlow
```

**Metadata:**
- Email: Clean, text-focused
- Templates: Copy-paste ready
- Psychology: FOMO ("maximize your site's impact"), simplicity ("tell your customers")

---

## Day 7: Monthly Checklist + Support Offer

**Subject:** "You're set up! Here's your monthly maintenance checklist"

**Body:**

```
Hi [First Name],

Congrats! You're all set up.

Your site is live, Google Business is verified, and customers are starting to find you.

Now the real work: keeping it fresh.

MONTHLY CHECKLIST (5 minutes, once a month):

□ Update testimonials — Add your latest 5-star review (if you have new ones)
□ Update photos — Replace outdated images with recent work
□ Update services/pricing — If you raised rates or added services
□ Check your Google Business Profile — Make sure hours are correct
□ Review your call tracking — Are you getting leads? Which pages convert?

That's it. One pass per month keeps your site current.

Pro tip: Do this on the 1st of every month and set a calendar reminder.

---

YOUR DASHBOARD:
Login: [ADMIN_LINK]
Password: [SENT_EARLIER_IN_EMAIL]

---

NEXT STEPS:

You're good to go. But we're here if you need anything:

Questions about your site?
→ Email: hello@buildflow.com

Want to add a new service to your site?
→ Email: hello@buildflow.com (content edits are included in your plan)

Want to update photos/testimonials yourself?
→ Your dashboard has a "Content" section (use it anytime)

Want your monthly check-in call?
→ [CALENDAR_LINK]

---

TRACKING YOUR SUCCESS:

Come back in 30 days and tell us:
- How many leads came from your site?
- Which pages got the most clicks?
- How many phone calls from the site?

This helps us improve your site and gives you data on what's working.

Thanks for choosing BuildFlow. Let's grow your business.

[Your name]
BuildFlow
```

**Metadata:**
- Email: Celebratory tone (you're done!)
- Re-engagement: Multiple CTA options (dashboard, email, calendar, call)
- Monthly check-in call is included in Managed Growth

---

## SMS Sequences (if customer opts in)

**Day 0 (after email):**
```
Hi [Name]! Your new website is live: [SITE_URL]
Google setup + call tracking guide coming tomorrow.
– BuildFlow
```

**Day 1 (after email):**
```
Set up Google Business today? Takes 5 min.
Video: [VIDEO_2_LINK]
Reply DONE when finished, or HELP if stuck.
– BuildFlow
```

**Day 3 (reminder):**
```
Don't forget to tell your customers about your new site!
Email template: [EMAIL_TEMPLATE_LINK]
Reply YES when done.
– BuildFlow
```

**Day 7 (final checklist):**
```
Setup done! Here's your monthly maintenance checklist: [CHECKLIST_LINK]
Questions? Reply anytime.
– BuildFlow
```

---

## Integration Rules

**Auto-send rules:**
- Day 0: Trigger on site launch (immediate)
- Day 1: Trigger on Day 0 email send + 24 hours
- Day 3: Trigger on Day 1 email send + 48 hours (or Day 0 + 72 hours)
- Day 7: Trigger on Day 3 + 96 hours

**Manual intervention triggers:**
- Customer replies "HELP [topic]" → Support contractor notified
- Customer replies "CALL ME" → Calendar link sent
- Customer replies "DONE" → Manual confirmation (nice-to-have, not required)
- No response after Day 7 → Support contractor follows up (optional, only if needed)

**Fallback:**
If customer doesn't reply, emails still send on schedule (no blocking).
Assumption: Some customers skip steps, will figure it out later.

---

## Metrics to Track

**Email:**
- Open rate (target: >40%)
- Click rate (target: >15%)
- Reply rate (target: >20%)
- "DONE" replies (target: >50% by Day 7)

**SMS:**
- Send rate (target: 80%+ delivery)
- Reply rate (target: >30%)
- YES replies (target: >40%)

**Onboarding:**
- Completion rate: % customers who finish setup by Day 7 (target: >70%)
- Time to completion: Average days from launch to fully setup (target: 5-7 days)
- Support tickets: Average tickets per customer (target: <1)

---

## Phase 2 Improvements

Once we have data from Phase 1 customers:
- Shorten or lengthen sequences based on completion rates
- A/B test subject lines for higher open rates
- Add video embeds directly in email (if supported)
- Personalize based on business type (HVAC vs. plumbing sequences differ)
- Integrate Slack notifications for support team

---

## Setup (Zapier/Make/Mailchimp)

**Tools needed:**
- Email platform: Mailchimp (free tier), Klaviyo, or SendGrid
- SMS platform: Twilio, Messagebird, or Mailchimp SMS
- Automation: Zapier (free tier), Make, or native automation

**Setup steps:**
1. Create email templates in Mailchimp/Klaviyo
2. Set up automation: "On site launch, send Day 0 email"
3. Set up automation: "On Day 0 email send + 24h, send Day 1 email"
4. Set up SMS (if using Twilio/SMS platform)
5. Test with self (send to own email first)
6. Deploy to first 3 customers
7. Iterate based on feedback

**Estimated setup time:** 4-6 hours (Phase 1)
**Payback period:** After 10 customers (saves ~3 hours manual onboarding per customer)

---

## Templates Summary

**Day 0:** Welcome + site launch
**Day 1:** Google Business + call tracking setup
**Day 3:** Customer outreach (tell customers about site)
**Day 7:** Monthly checklist + support offer

**Total automation:** 95% of onboarding (5% manual: replying to questions)
