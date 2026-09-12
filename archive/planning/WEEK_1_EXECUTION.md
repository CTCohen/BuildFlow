# Week 1 Execution Plan (This Week)

**Goal:** Complete 4 critical items, ready to launch Phase 1 outreach Week 2

**Timeline:** Mon-Fri (5 days available, each ~4 productive hours = 20 hours total)

---

## Monday (Today)

### Task 1: Record Videos (2 hours)
**Videos 1, 2, 5 (1 min + 3 min + 1 min = 5 min total content)**

**Setup (15 min):**
- Open ScreenFlow (Mac) or OBS
- Set background (neutral, natural light)
- Test mic (built-in okay)
- Get scripts ready (already written)

**Record Video 1: Welcome (5 min)**
- Talking head (face to camera)
- One take, don't worry about perfection
- Read from script: `/onboarding/VIDEO-OUTLINE.md` → Video 1
- Save as: `video-1-welcome.mp4`

**Record Video 2: Google Business (10 min)**
- Screen recording only
- Open Google Business (google.com/business)
- Walk through steps slowly
- Read from script: `/onboarding/VIDEO-OUTLINE.md` → Video 2
- Save as: `video-2-google.mp4`

**Record Video 5: Monthly Checklist (5 min)**
- Talking head with text overlay
- Show checklist on screen (use PowerPoint or Google Slides)
- Read from script: `/onboarding/VIDEO-OUTLINE.md` → Video 5
- Save as: `video-5-checklist.mp4`

**Buffer:** 30 min (for re-takes, audio sync)

**Status:** [ ] DO TODAY

---

### Task 2: Prospect Research Prep (1 hour)

**Create spreadsheet:**
- Open Google Sheets or Airtable
- Columns: Name, Business Name, Email, Phone, Service, City, Website, Notes
- 10 rows (for 10 prospects)

**Research targets (draft list):**
- [ ] HVAC Contractor #1 (search: "HVAC [your city]" on Google Maps)
- [ ] HVAC Contractor #2
- [ ] Plumbing Company #1
- [ ] Plumbing Company #2
- [ ] Electrical Contractor #1
- [ ] Electrical Contractor #2
- [ ] Cleaning Service #1
- [ ] Cleaning Service #2
- [ ] Other trade #1
- [ ] Other trade #2

**For each prospect:**
- Write name + business name in spreadsheet
- Find email: website → "Contact" page, OR LinkedIn profile
- Find phone: Google Business listing (if exists)
- Note: Do they have website? Google ranking? Professional appearance?

**Timeline:** 1 hour (6 min per prospect)

**Status:** [ ] DO TODAY

---

## Tuesday

### Task 3: Build 3 Sample Sites (2 hours)

**Using Astro + components, build 3 minimal landing pages**

**Site 1: HVAC (Emergency Bold)**
- Hero: Emergency Bold variant (already coded)
- Services: Grid layout (3 services)
- Testimonials: 2 fake testimonials (use placeholder quotes)
- CTA: "Get a quote" button
- Colors: Warm (orange/red accents)
- Copy: Speed + reliability + local

**Build it (30 min):**
1. Copy `/website/src/pages/index.astro`
2. Create `/website/src/pages/hvac-sample.astro`
3. Replace headline with "Professional HVAC Services"
4. Add hero image (use generic HVAC image from Unsplash)
5. Add 3 sample services
6. Add 2 testimonials
7. View in browser (http://localhost:3000/hvac-sample)
8. Screenshot the site

**Site 2: Plumbing (Refined Reliability)**
- Hero: Reliability Bold variant
- Services: Accordion layout (4 services)
- Testimonials: 3 fake testimonials
- CTA: "Request an estimate"
- Colors: Cool (blue accents)
- Copy: Trust + expertise + 24/7

**Build it (30 min):** Same process, different content

**Site 3: Cleaning (Fresh Playful)**
- Hero: Playful hero variant
- Services: Grid layout (3 services)
- Testimonials: Star ratings + quotes
- CTA: "Book now"
- Colors: Bright (teal/orange accents)
- Copy: Energy + results + fun

**Build it (30 min):** Same process, different content

**Screenshot & Save (30 min):**
- Take 3 screenshots per site (hero, services, testimonials)
- Save to `/website/public/samples/` folder
- Use names: `hvac-hero.png`, `hvac-services.png`, etc.

**Status:** [ ] DO TUESDAY

---

### Task 4: Finalize Email Template (30 min)

**Using `/messaging/EMAIL-HOOKS-VALIDATED.md` content**

Create a simple email template file:

**File:** `/outreach/EMAIL-TEMPLATE.txt`

```
Subject: [Name], [Competitor Name] is ranking higher than you on Google

Body:
Hi [Name],

I noticed [Competitor Name] is ranking above you on Google for "[Service]" in [City].

They're getting the calls you should be getting.

Quick question: How many leads came from your website last month?

Most contractors I talk to say "Not many." If that's you, we can fix it in 7 days.

See what we built: [PORTFOLIO_LINK]

5-min call? [CALENDAR_LINK]

[Your name]
BuildFlow
```

**Test email (20 min):**
- Personalize one copy for each of your 3 target prospects
- Send to yourself (use [Name], [Competitor Name], [City] with real values)
- Check: Does it look natural? Does the copy make sense?

**Status:** [ ] DO TUESDAY (after videos + sites)

---

## Wednesday

### Task 5: Record Remaining Videos (2 hours)

**Videos 3, 4 (2 min + 2 min = 4 min total content)**

**Record Video 3: Call Tracking (10 min)**
- Screen recording
- Open CallRail (callrail.com)
- Walk through signup + tracking number retrieval
- Then show your site admin dashboard (paste tracking number)
- Read from script: `/onboarding/VIDEO-OUTLINE.md` → Video 3
- Save as: `video-3-callrail.mp4`

**Record Video 4: Tell Your Customers (10 min)**
- Talking head + text overlay
- Show email template on screen
- Explain each section
- Read from script: `/onboarding/VIDEO-OUTLINE.md` → Video 4
- Save as: `video-4-outreach.mp4`

**Buffer:** 30 min (re-takes, editing)

**Upload all 5 to YouTube (30 min):**
1. Go to youtube.com (logged in)
2. Upload 5 videos (unlisted)
3. Wait for auto-captions (usually 1-2 min per video)
4. Copy share links into `/onboarding/EMAIL-SEQUENCES.md`
5. Save updated file

**Status:** [ ] DO WEDNESDAY

---

### Task 6: Complete Prospect List (1 hour)

**Finish researching 10 prospects**

**Continue from Tuesday's draft:**
- Get email addresses (LinkedIn, website contact page, business directory)
- Get phone numbers (Google Business, website)
- Fill in remaining rows

**Tips:**
- If you can't find email: use "[firstname]@[company].com" guess OR skip (SMS can work)
- If phone missing: Google Business usually has it
- Note their current website quality (helps personalize emails)

**Status:** [ ] DO WEDNESDAY (afternoon)

---

## Thursday

### Task 7: Create 3 Case Study Files (1 hour)

**For each sample site, write a fake case study**

**File:** `/website/public/samples/HVAC-CASE-STUDY.md`

```
# Case Study: Phoenix HVAC Services

**Before:**
- No website (competitors ranking above)
- Getting <3 leads/month from online
- Lost customers to competitors

**Solution:**
- Built modern, mobile-first website
- Optimized for Google Business + local search
- Added online quote system + call tracking

**Results:**
- Now appearing on Google Maps + Search
- Getting 8-12 qualified leads/month
- 3x revenue increase in 3 months

"Best investment we made. Website is getting us more calls than we can handle."
– Mike Johnson, Owner
```

**Create 3 of these (30 min total)**
- HVAC-CASE-STUDY.md
- PLUMBING-CASE-STUDY.md
- CLEANING-CASE-STUDY.md

**Update BuildFlow.com portfolio (30 min):**
- Add links to case studies on landing page
- Add sample site screenshots
- Update `/website/src/pages/examples.astro` (create new page)

**Status:** [ ] DO THURSDAY

---

## Friday

### Task 8: Email + SMS Templates Finalized (1 hour)

**Email template:** Already done (Tuesday)

**SMS templates:** Adapt from `/messaging/SMS-HOOKS.md`

**File:** `/outreach/SMS-TEMPLATE.txt`

```
Day 1 (24h after email, if no open):
"Hi [Name]! Quick question: How many leads from your website last month? 
If under 5, we can help. Video: [LINK]. – BuildFlow"

Day 2 (48h after email):
"[Name], don't forget to tell your customers about your new site. 
Email template: [LINK]. – BuildFlow"

Day 5 (If no response):
"Only 2 spots left this month. Details: [PORTFOLIO_LINK]. – BuildFlow"
```

**Objection handlers:** Copy from `/messaging/EMAIL-HOOKS-VALIDATED.md`

**Phone script:** Copy from same file, print or memorize

**Calendar link:** Set up Calendly or Google Calendar shareable link
- 15-min time slots
- Mon-Fri 10 AM - 4 PM PT
- Buffer between calls (30 min)
- Add link to emails + calendar invites

**Status:** [ ] DO FRIDAY

---

## Friday Afternoon: Launch Prep Review

**Checklist (verify everything is ready):**
- [ ] 5 videos recorded + uploaded to YouTube (with links)
- [ ] 3 sample sites built + screenshots taken
- [ ] 10 prospects researched + contact info in spreadsheet
- [ ] Email template tested + personalized (for first 3 prospects)
- [ ] SMS templates ready
- [ ] Phone script ready
- [ ] Calendar link created + working
- [ ] Portfolio page on BuildFlow.com updated with samples
- [ ] 3 case studies written

**If anything is missing:** Do it Monday morning before outreach starts

---

## Monday Week 2: Launch!

**Send Batch 1 emails (5 prospects):**
- Subject: Competitor angle
- Personalize with real competitor + city
- Include portfolio link + calendar link
- Send at 9 AM PT

**Track:**
- Open rate (should see within 1-2 hours)
- Clicks (portfolio link)
- Calendar bookings

**Follow-up:**
- Day 1: If email opened, no action (they're engaged)
- Day 1: If email NOT opened, send SMS reminder

---

## Time Budget Summary

| Task | Mon | Tue | Wed | Thu | Fri | Total |
|------|-----|-----|-----|-----|-----|-------|
| Videos | 2h | - | 2h | - | - | 4h |
| Sample Sites | - | 2h | - | - | - | 2h |
| Case Studies | - | - | - | 1h | - | 1h |
| Email Template | - | 0.5h | - | - | - | 0.5h |
| SMS/Calendar | - | - | - | - | 1h | 1h |
| Prospect Research | 1h | - | 1h | - | - | 2h |
| **TOTAL** | 3h | 2.5h | 3h | 1h | 1h | **10.5h** |

**Realistic:** 10-12 hours of work over 5 days = 2-2.5 hours/day. Doable.

---

## No Excuses Clause

- No "it's not perfect" delays
- No waiting for tools/confirmations
- No skipping steps
- Rough videos ship. Fake testimonials okay. Template sites work.
- This week you build the foundation. Ship it.

**Goal:** Everything done Friday. Ready to launch Monday.

**Commit:** [ ] Yes, I'm doing this.

---

**Let's go. Execute.**
