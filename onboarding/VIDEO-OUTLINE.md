---
title: Video Outline
purpose: Documentation for VIDEO-OUTLINE.md
status: draft
owner: c.t.cohen
updated: '2026-09-12'
tier_scope: all
phase: operational
---

> **Updated 2026-09-18 (spec reconciliation):** launch plan Step 5: scripts come from System 06 section 5 (first-login tour, checklist) and System 12 section 1 (30-day journey). Record the Managed walkthrough (dashboard tour, customize name/services/photos, CRM connection), an **Offboard handoff** video (domain transfer, what no ongoing support means, where to get help), and tier-specific segments only where the dashboard differs (Micro vs SMB; Mid-Market deferred). Host and link in the welcome sequence and Help Center.


# Onboarding Video Outline

**Purpose:** Automate customer onboarding so sites are self-setup without manual calls.

**Timeline:**
- Phase 1: Record manually (rough + authentic)
- Phase 2+: Use recorded videos in auto-sequences
- Phase 4+: Generate via AI (if customer preference data supports it)

---

## Video 1: Welcome to Your New Site (1 min)

**Timing:** Auto-sent Day 0 (site launch)

**Script:**
```
Hey [Name]! Your new website is live. 

In the next 7 days, we're going to set up three things:
1. Google Business Profile (so customers find you on Google Maps)
2. Call tracking (so you know which leads come from your site)
3. Tell your customers about your new site

Each setup takes 5-10 minutes and we have videos to walk you through it.

Check your email over the next few days — links to everything are coming.

Your site: [URL]
```

**Visual:**
- Split screen: (1) Your live site on laptop, (2) Mobile view
- Quick tour of hero, services, contact form
- Ending frame: "Let's get you leads" + CTA

**Metadata:**
- Duration: 60 seconds
- Format: MP4 1080p
- Platform: YouTube (unlisted), embedded in emails
- Captions: Auto-generated + reviewed

---

## Video 2: Set Up Google Business Profile (3 min)

**Timing:** Auto-sent Day 1 (email + SMS)

**Script:**
```
Let's get you on Google Maps so customers can find you.

Step 1: Go to google.com/business
Step 2: Click "Manage your business"
Step 3: Search for [Business Name] in your area
Step 4: If you don't see yourself, click "Create a business"

Then fill in:
- Business name (exact name from your site)
- Address (service area if you're mobile)
- Phone number
- Website (paste the URL from your welcome email)
- Services (pick the categories that match your business)

Step 5: Verify ownership (Google sends a postcard)

That's it. Once verified, your business shows up on Google Maps and Google Search.

Questions? Reply to this email and we'll help.
```

**Visual:**
- Screen recording: Live Google Business dashboard walkthrough
- Mouse highlights key buttons
- Text callouts: "Click here", "Fill this in"
- Pause points where viewer should take action

**Metadata:**
- Duration: 3 min
- Format: Screen recording + voiceover
- Platform: YouTube (unlisted)
- Captions: Synced to narration

---

## Video 3: Set Up Call Tracking (2 min)

**Timing:** Auto-sent Day 1 (same email as Video 2)

**Script:**
```
Every call from your website is a lead. Let's track where they come from.

We recommend CallRail (free version available).

Step 1: Go to callrail.com
Step 2: Click "Sign up"
Step 3: Enter your phone number
Step 4: Create an account
Step 5: Copy your tracking number

Then come back to your website admin dashboard:
- Paste the tracking number in Settings → Call Tracking
- Save

Now every call will be logged with:
- Customer name (if they left a voicemail)
- Call duration
- Time of day
- Which page they called from

This tells you what's working and what's not.

Already have CallRail? Just paste your number and you're done.
```

**Visual:**
- Screen recording: CallRail signup → tracking number
- Then: Your site settings panel, paste step
- Before/after: Call log showing tracked calls
- End frame: "Now you're tracking leads"

**Metadata:**
- Duration: 2 min
- Format: Screen recording + voiceover
- Platform: YouTube (unlisted)

---

## Video 4: Tell Your Customers About Your New Site (2 min)

**Timing:** Auto-sent Day 3 (SMS reminder + email link)

**Script:**
```
Your new site is ready. Let's tell your customers.

We've made it easy. Here's a message you can send:

---
TEMPLATE EMAIL (copy + send to your email list):

Subject: New Website! Check It Out

Hi [Customer],

We just launched a new website and wanted you to see it:
[Your site URL]

You can now:
- Request a quote online (instant)
- See our latest work
- Book an appointment
- Find us on Google Maps

Give it a look and let us know what you think!

[Your name]
---

TEMPLATE TEXT MESSAGE (send to customers who text you):

"Hey! Check out our new website: [URL] 
Easy online quotes & booking. Thanks for your business!"

---

Send these to your existing customers and watch the leads roll in.

Already have an email list? Perfect. Don't have one? No problem — 
tell customers in person or add the link to your social media.
```

**Visual:**
- Template text displayed on screen
- Animation: Email being sent, SMS notification pinging in
- Quick montage: Happy customers visiting site
- End frame: "Watch your leads grow"

**Metadata:**
- Duration: 2 min
- Format: Template display + animation
- Platform: YouTube (unlisted)

---

## Video 5: Monthly Checklist (1 min)

**Timing:** Auto-sent Day 7 (email + SMS)

**Script:**
```
Your site is set up. Here's what to do each month to keep it fresh:

MONTHLY CHECKLIST (takes 5 minutes):

1. Update testimonials — Add your latest 5-star review or case study
2. Check your photos — Replace any blurry or outdated images
3. Update pricing — If you raised rates, update the site
4. Review your Google Business Profile — Make sure hours are correct
5. Check your call tracking — Are you getting leads from the site?

That's it. One quick pass per month keeps your site current and helps Google rank you higher.

Questions? Email us anytime. We're here to help.

Your site: [URL]
Your login: [Admin link]
```

**Visual:**
- Checklist items appear on screen one-by-one
- Quick demo: How to add a testimonial (screenshot)
- How to update a photo (screenshot)
- Ending: Happy business owner with phone ringing (metaphor: leads)

**Metadata:**
- Duration: 1 min
- Format: Text + screenshots + voiceover
- Platform: YouTube (unlisted)

---

## Production Notes

**Recording Approach (Phase 1):**
- Record yourself (authentic, personal)
- Use ScreenFlow (Mac) or OBS (Windows)
- Audio: Built-in mic or AirPods (clear is enough)
- Lighting: Natural light, sit facing camera
- Background: Neutral (bookshelf, office background okay)
- Rough edits: No fancy transitions, keep it real

**Why rough works:**
- Builds trust (you're the founder, not a production company)
- Faster to record and update
- Customers appreciate authenticity
- Lowers expectations (we're not Wistia, we're Fornax)

**Editing (Phase 1 — minimal):**
- Cut dead air
- Add intro/outro with music
- Add captions/text overlays
- Sync audio levels
- Export at 1080p H.264

**Phase 2+:**
- Transcribe videos → turn into written guides (text alternative)
- Add accessibility: captions + audio description
- Consider AI voiceover if customer data shows preference

---

## Hosting

**Phase 1:** YouTube (unlisted, embedded in emails)
- Pros: Free, auto-captioning, embeds in emails
- Cons: Requires YouTube account

**Phase 2:** Vimeo (if privacy preferred)
- Pros: More professional, privacy options
- Cons: $75/month

**Decision:** Start with YouTube, migrate to Vimeo if customers ask.

---

## Integration with Email Sequences

Videos are embedded in emails (Day 0, 1, 3, 7):

```
DAY 0 (site launch):
├─ Email: Welcome + Video 1 (embedded)
├─ Link: Your site URL
└─ CTA: "Let's set you up"

DAY 1:
├─ Email: Next steps + Video 2 + Video 3 (both embedded)
├─ Tasks: Google Business + Call Tracking
└─ Time estimate: 15 minutes total

DAY 3:
├─ SMS: "Don't forget to tell your customers!"
└─ Email: Video 4 + email/SMS templates (copy-paste)

DAY 7:
├─ Email: You're all set! + Video 5 (monthly checklist)
├─ Link: Admin dashboard
└─ Support: "Email us anytime"
```

---

## Success Criteria

✓ All 5 videos recorded and uploaded
✓ Captions working in embedded players
✓ Email sequences tested (send to self first)
✓ SMS sequences tested
✓ Link tracking working (know which videos customers click)
✓ Customer feedback: "Videos were helpful" (target: ≥80% approval)

---

## Next Steps

1. **Week 1:** Record 5 videos (rough draft)
2. **Week 2:** Edit + upload to YouTube
3. **Week 3:** Integrate into email sequences
4. **Week 4:** Send to first 5 customers (test)
5. **Week 5+:** Integrate into automated onboarding flow

---

## Time Budget

- Recording: ~3 hours (1 hour per video + setup)
- Editing: ~2 hours (basic cuts + captions)
- Upload + testing: ~1 hour
- **Total: ~6 hours work**

Breakeven point: 3 customers (saves 3 hours of manual onboarding calls).
By 10 customers, you've saved 30+ hours.
