---
title: Site Build Workflow
purpose: Documentation for SITE-BUILD-WORKFLOW.md
status: draft
owner: c.t.cohen
updated: '2026-09-12'
tier_scope: all
phase: operational
---

> **Updated 2026-09-18:** this 7-day manual workflow is now the **fallback and high-touch path**. The spec's fulfillment path (System 06 section 5) is automated: after Stripe confirms payment, the customer record, live site, DNS and SSL, welcome email and dashboard access are created in under 60 seconds from the already-built demo. Use this document when a customer needs a hand-built or custom-intake site. Prices and plan names follow `docs/PRICING.md`.


# Site Build Workflow — 7-Day Execution

**Purpose:** Once a customer is closed, use this workflow to build and launch their site in 7 days.

**Timeline:** Day 1 (intake) → Day 7 (launch)

---

## Days 1-2: Customer Intake

### Day 1: Send Kickoff Email (Same day as close)

**Email to send (customized):**

```
Subject: [Business Name] — Let's Build Your Site! 🎉

Hi [Name],

Excited to work with you! Here's what happens next:

STEP 1: I need your business info
Please send me:
- Business logo (PNG/JPG)
- 3-5 photos of your work (or business)
- List of your top 3 services
- 2-3 customer testimonials (optional, can use placeholders)
- Your service area + hours of operation

Reply to this email with everything, or call me if easier.

STEP 2: We design
Once I have your info (usually 24 hrs), I'll design your site using the logo-first approach. This means your site will look like it was designed specifically for YOUR brand, not like a generic template.

STEP 3: You review (Day 4-5)
I'll send you a preview link. You'll have 24 hours to request changes.

STEP 4: We launch (Day 7)
Your site goes live. We set up Google Business, call tracking, and everything else.

Timeline: 7 days total from today.

Questions? Call me: [YOUR PHONE]

[Your Name]
BuildFlow
```

**Send at:** Within 1 hour of close

**Track:** Note when they reply with their info

---

### Days 2-3: Gather Customer Data

**While waiting for customer to reply, prepare:**

1. [ ] Pull logo (if customer hasn't sent, find on their website or LinkedIn)
2. [ ] Pull photos (Google Images: "[Business Name] [Service]")
3. [ ] Pull service list (from their current website or Google Business)
4. [ ] Pull testimonials (from Google reviews, Yelp, or ask them to send)
5. [ ] Note: City, trade type, service area

**Create a folder:**
```
/customer-data/[Business Name]/
  - logo.png
  - photo-1.jpg
  - photo-2.jpg
  - photo-3.jpg
  - services.txt
  - testimonials.txt
  - notes.txt
```

**If customer hasn't sent info by Day 2:**
- SMS reminder: "Hey [Name]! Just need those photos + services so I can start building. Reply with them and we're rolling!"
- If still no response by Day 3: Use placeholder photos/testimonials and build (better to ship rough than to miss deadline)

---

## Days 3-4: Design & Build

### Logo Analysis (30 min)

**Using `/design/logo-analyzer.ts` process:**

1. Analyze logo:
   - Dominant colors (primary, secondary, accent)
   - Mood (bold, refined, playful, professional, vibrant)
   - Style (modern, classic, hand-drawn, minimalist)
   - Confidence score (≥80% = good, <80% = manual override)

2. Map to variant:
   - Logo mood + business type → hero variant
   - Example: Bold HVAC logo → Hero-Emergency-Bold
   - Example: Refined plumbing logo → Hero-Reliability-Refined

3. Select color scheme:
   - Match logo colors to one of 4 schemes
   - Validate WCAG AA contrast
   - Generate light/dark mode variants

### Site Building (4-5 hours)

**Using Astro + component system:**

1. Copy sample template:
   ```
   Copy: `/website/src/pages/samples/[trade].astro`
   To: `/customer-sites/[business-name].astro`
   ```

2. Customize content (find & replace):
   - Hero: `[Business Name]` → actual name
   - Services: Replace with their actual services
   - Testimonials: Replace with real quotes (or placeholders)
   - CTA buttons: Add their phone number
   - Colors: Apply extracted logo colors

3. Add images:
   - Replace placeholder hero image with their best photo
   - Add work samples (if available)
   - Optimize images (compress, resize)

4. Test locally:
   ```
   cd website/
   npm run dev
   # View at http://localhost:3000/customer-sites/[business-name].astro
   ```

5. QA checklist (run through this):
   - [ ] Logo displays correctly
   - [ ] Colors match brand
   - [ ] Text is readable (contrast)
   - [ ] Mobile responsive (view on phone)
   - [ ] Links work (phone number clickable)
   - [ ] Images load fast
   - [ ] No typos
   - [ ] Hero section compelling
   - [ ] CTA button is visible

6. Build for deployment:
   ```
   npm run build
   # Generates static files
   ```

---

## Day 5: Customer Review

### Send Preview Link

**Email to send:**

```
Subject: [Business Name] — Your New Site Preview 👀

Hi [Name],

Your site is ready! Check it out and let me know what you think:

👉 [PREVIEW LINK]

What to look for:
- Does it represent your brand well?
- Are the colors right?
- Do you like the layout?
- Are all your services listed?

Feedback? Reply with any changes you want:
- Different colors
- Different layout
- New photos
- Service wording changes
- Anything else

Turnaround: 24 hours for revisions.

[Your Name]
BuildFlow
```

**Send at:** End of Day 4 or morning of Day 5

**Track:** Wait for their feedback

### Gather Feedback (24 hrs)

**If they send feedback:**
- Log in tracking spreadsheet
- Make revisions (typically 30 min - 1 hour)
- Send updated preview

**If they don't respond by Day 6:**
- Send SMS: "Love your site? Let me know if any tweaks before launch!"
- If still no response: Proceed to launch (they approved by inaction)

---

## Day 6-7: Setup & Launch

### Day 6: Setup Google Business + Call Tracking

**Tasks:**
1. [ ] Send customer Google Business setup email (use video script from `/onboarding/VIDEO-OUTLINE.md`)
2. [ ] Help them get tracking number (CallRail, Invoca, or similar)
3. [ ] Prepare domain (if they don't have one):
   - Register domain (usually $12/year)
   - Or point existing domain to BuildFlow hosting
4. [ ] Get SSL certificate (automatic via Cloudflare)
5. [ ] Deploy site to production:
   ```
   Copy built files to production server
   Point domain DNS to BuildFlow hosting
   Test that site is live
   ```

**Verification checklist:**
- [ ] Site accessible at [domain]
- [ ] HTTPS working (lock icon in browser)
- [ ] Google Business profile set up
- [ ] Call tracking number added to site
- [ ] Contact form working
- [ ] Mobile responsive
- [ ] Lighthouse score >85

### Day 7: Launch & Onboarding

**Launch day:**

1. Send "Site Live" email:
```
Subject: 🎉 [Business Name] — Your Site Is Live!

Hi [Name],

Congratulations! Your new website is now live:

👉 [SITE LINK]

What's included:
✓ Professional website (optimized for leads)
✓ Google Business setup
✓ Call tracking (know which calls come from your site)
✓ Email support

Next steps:
1. Visit your site and share with friends/family
2. Set up Google Business (video coming tomorrow)
3. Tell your customers about it (email template coming tomorrow)
4. Start getting leads! 📞

Questions? Reply anytime.

[Your Name]
BuildFlow
```

2. Send onboarding sequence:
   - Day 0 (today): Site live email (above)
   - Day 1: Videos 2-3 (Google Business + Call Tracking)
   - Day 3: Customer outreach template
   - Day 7: Monthly checklist

3. Collect testimonial:
   - Ask: "How was the experience? One sentence for future customers?"
   - Get their permission to use it
   - Add to portfolio (buildflow.com/samples)

---

## Timeline Summary

```
Day 1 (Friday):
- Close deal (5 min call) ✓
- Send kickoff email (5 min)

Days 2-3:
- Customer sends info (waiting)
- Gather backup data (30 min)

Days 3-5:
- Analyze logo + map variant (30 min)
- Design & build site (4-5 hrs)
- Customize & QA (1 hr)
- Send preview (5 min)

Day 5:
- Customer reviews site
- Request feedback (24 hrs)

Days 6-7:
- Make revisions if needed (1 hr)
- Setup Google Business (30 min)
- Deploy to production (30 min)
- Launch & send onboarding (30 min)

Total time investment: ~8-10 hours per site
Deliverable value: $249/mo recurring per site ($799 one-time on Offboard downsell)
Profit margin: 95%+ (after hosting costs)
```

---

## Common Issues & Fixes

### Issue 1: Customer Doesn't Reply with Info
**Fix:**
- SMS reminder Day 2
- Use placeholder data Day 3
- Build with what you have
- Ship anyway (they approve later)

### Issue 2: Logo Colors Don't Work Well
**Fix:**
- Use secondary colors from logo
- Or shift to complementary colors
- Or fall back to one of 4 base color schemes
- Send preview and ask for feedback

### Issue 3: Customer Wants Major Changes
**Fix:**
- If before launch: Make changes (it's Day 5-6, you have time)
- If after launch: Note for next month's update
- Keep scope to: colors, photos, text
- Don't redesign entire layout (outside plan scope)

### Issue 4: Site Doesn't Load or DNS Issues
**Fix:**
- Contact your hosting provider immediately
- Fallback: Deploy to temporary URL
- Have them test on phone before launch
- Typical DNS propagation: 24-48 hours

---

## Quality Assurance Checklist (Before Launch)

**Run this QA before sending launch email:**

- [ ] Hero section loads with correct image
- [ ] Business name is displayed correctly
- [ ] Services section shows all services
- [ ] Testimonials load (at least 2)
- [ ] CTA button is visible + clickable
- [ ] Phone number is clickable (tel: link)
- [ ] Contact form submits correctly
- [ ] Page loads under 3 seconds
- [ ] Lighthouse score ≥85
- [ ] Mobile responsive (test on real phone)
- [ ] No broken links
- [ ] No placeholder text showing
- [ ] Color scheme matches brand
- [ ] WCAG AA contrast (text readable)
- [ ] Form emails route to customer correctly
- [ ] Call tracking number displays

**If any fail: Fix it before launch (don't ship broken).**

---

## Variations by Trade

### HVAC Sites
- Hero: Emergency Bold or Comfort Refined (depending on positioning)
- Emphasize: Speed of response, reliability, emergency availability
- Testimonials: Focus on "came out fast" or "fixed my AC in winter/summer"
- CTA: "Schedule a Tune-Up" or "Emergency Call"

### Plumbing Sites
- Hero: Reliability Refined (trust is key)
- Emphasize: Expertise, trustworthiness, 24/7 availability
- Testimonials: Focus on "honest pricing" or "knew exactly what was wrong"
- CTA: "Request an Estimate" or "Emergency Service"

### Electrical Sites
- Hero: Power Bold (technical, confident)
- Emphasize: Licensed/insured, expertise, safety
- Testimonials: Focus on "fixed the problem properly"
- CTA: "Get an Inspection" or "Schedule Service"

### Cleaning Sites
- Hero: Fresh Playful (energy, results)
- Emphasize: Attention to detail, reliability, customer happiness
- Testimonials: Focus on "transformed my house" or "so much better"
- CTA: "Book a Cleaning" or "Free Quote"

---

## Ready to Execute

**Once you close a deal:**

1. Send kickoff email (same day)
2. Wait for customer info (Days 2-3)
3. Analyze logo → pick variant (30 min)
4. Build site (4-5 hours, Days 3-4)
5. Send preview (Day 5)
6. Make revisions if needed (1 hour, Day 6)
7. Setup Google Business + deploy (1 hour, Day 6)
8. Launch + onboarding (Day 7)

**You're done. Next customer.**

By close #3, you'll finish sites in 6-7 hours (faster with practice).
By close #5, you'll have a system and testimonials for social proof.

Let's build.
