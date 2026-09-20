---
title: Sales Call Script
purpose: Documentation for SALES-CALL-SCRIPT.md
status: draft
owner: c.t.cohen
updated: '2026-09-12'
tier_scope: all
phase: operational
---

> **ON HOLD (2026-09-18):** re-priced to the spec pricing (SMB $249/mo, offboard $799). Do not send or use this until Tyler approves the updated copy. Phase 1 was re-baselined to the platform launch; see `ROADMAP.md` and `RECONCILIATION_LOG.md` (D42).


# Phone Sales Call Script — Ready to Use

**Purpose:** Close contractor deals over the phone using a proven 12–15 minute script.

**Offer:** Managed — $249/mo (lead with this). Offboard — $799 one-time (downsell only, if they reject a monthly fee).

**Target:** 30–45% close rate on qualified calls (a recurring plan closes a little lower than a one-timer; that's expected).

**Delivery:** Read word-for-word or use as guide (authenticity matters more than perfection).

---

## Pre-Call Preparation (5 min)

**Before each call:**

1. Pull up prospect info:
   - [ ] Their name + business name
   - [ ] Their city + trade (HVAC/plumbing/etc)
   - [ ] Any notes from email (if they mentioned something)
   - [ ] Competitor name (reference in call if needed)

2. Have these open:
   - [ ] Portfolio link (buildflow.com/samples/[trade])
   - [ ] Calendly booking link (in case they want to book right then)
   - [ ] Pricing: **$249/mo Managed** (lead) · **$799 one-time Offboard** (downsell only)
   - [ ] Stripe subscription checkout link
   - [ ] Objection handlers (from `/messaging/EMAIL-HOOKS-VALIDATED.md`)

3. Mindset:
   - [ ] You're helping (not selling)
   - [ ] They likely have a problem (lack of leads/website)
   - [ ] You have a solution — and you keep it working, month after month
   - [ ] ~40% of them will start a plan

**Call length:** 12–15 minutes (respect their time)

---

## The Script (Word-for-Word)

### Section 1: Opening (1 min)

```
[Phone rings → Answer professionally]

"Hi [Name]! Thanks so much for jumping on the call. I know you're busy, so I'll keep this quick.

We help contractors like you turn their website into a lead-generating machine — and we keep it running for you so you never have to think about it.

Before we dive in, have you checked your Google ranking for [Trade] + [City] lately?"

[Listen to their response - they might say "no" or give context]
```

**Why this opening:**
- Thanks them (shows respect)
- Sets time expectation
- States what you do AND that it's ongoing ("we keep it running")
- Asks a discovery question (engages them)

**Their likely response:**
- "No, I haven't" → Continue to Step 2
- "Not recently" → Continue to Step 2
- "Yes, I rank pretty well" → Pivot to Step 2 (mention competitor)

---

### Section 2: Discovery (2-3 min)

```
"Got it. So here's what I'm noticing with most contractors I talk to:

Google is where customers find you. Right now, [Competitor Name] is ranking higher than you for [Trade] in [City].

So here's my question: Last month, how many new leads or calls came directly from your website or Google?

[LISTEN - they'll say "not many", "a few", "none", or "I don't know"]
```

**What they'll say:**
- "Not many" → Perfect. They have the problem.
- "A few" → Still an opportunity.
- "None" → Ideal prospect.
- "A lot" → Less urgent, but still a good prospect.

**Your follow-up (choose based on their answer):**

If "not many" / "none":
```
"That's actually pretty common. Most contractors don't optimize for online leads.

So here's the opportunity: Your website is either missing or not set up to convert searches into calls.

We can fix that in 7 days — and then we keep it optimized every month so it stays ahead of the other guys. Modern site, Google Business, call tracking, all of it.

Have you been interested in doing something like that?"
```

If "a few" / "some":
```
"Nice, so you're already getting some. The question is: how many are you leaving on the table?

Most contractors we work with are leaving 50%+ of potential leads on the table just because their site isn't optimized — and it drifts backward over time if nobody's maintaining it.

We can show you what that looks like and what the fix would be. Interested?"
```

---

### Section 3: The Offer (2 min)

```
[They say "yes" or "tell me more"]

"Perfect. So here's what we do:

We build you a complete, modern website in 7 days. We get you on Google Business and Maps. We add call tracking so you know which leads come from your site.

Then we run it for you — hosting, security, the domain, ongoing local SEO, and any content changes you need. You email us 'add a service' or 'new photo' and we just do it. Monthly check-in so it never goes stale.

That's our Managed plan — $249 a month. No big upfront cost, cancel anytime.

Think of it as less than one service call a month to have a website that's actually bringing you work — and one you never have to babysit."

[They'll say yes, ask questions, or push on the monthly fee]
```

**Why this framing:**
- Specific outcomes (Google Business, call tracking, ongoing SEO)
- Clear timeline (7 days to live)
- Ongoing value is the point — "we run it for you", "never have to babysit"
- Price anchored against a service call ("less than one a month")
- Low friction ("no big upfront cost, cancel anytime")

**Only if they reject a monthly fee outright** → downsell to Offboard:
```
"Totally fair. There's another way to do it: we build the site, export it, and hand it to you on your own hosting. One-time, $799, and then it's yours to run.

Heads up — after that, updates, hosting, keeping it optimized, that's all on you. Most guys find the monthly plan easier because we handle all of that. But the option's there."
```

---

### Section 4: Handle Objections (3-5 min)

#### Objection #1: "$249 a month adds up / I don't want another bill"

```
Your response:
"I hear that. Here's how most of our customers think about it:

One new job from a better website = $400-600 in revenue. The plan is $249 a month. So roughly one extra job every two months covers it — a typical job here is $400-600, and anything beyond that is profit. (Illustrative arithmetic, not a promise of results.)

And you're not just paying for a website file sitting there. You're paying for us to host it, keep it fast, keep it ranking, and make your changes. It's a service, not a one-time build that rots.

Plus you can cancel any time. There's no lock-in. Does that make sense?"

[If still hesitant]
"What if I show you exactly what you'd get before you decide? No commitment. Just so you can see the value."
```

#### Objection #2: "I already have a website"

```
Your response:
"That's great! Most of our customers had one too.

Here's what I'd ask: How many leads came from it last month?

[They'll say a low number]

"Exactly. So either it's not optimized for search, or it's not converting visitors into calls — and nobody's actively working on it.

We rebuild it, get you on Google Maps, add call tracking, and then keep improving it every month. That last part is what your current site doesn't have.

Want to see what an optimized, maintained site looks like compared to yours?"
```

#### Objection #3: "I can DIY it myself"

```
Your response:
"Totally possible. Here's what most contractors find though:

DIY takes 20-40 hours to build. Then it needs updates, security patches, SEO attention — and that never stops. That's your time, every month, forever.

Our plan: we build it, and then we're the ones keeping it fast, secure, and ranking. $249/mo. You never open a website editor.

You focus on the trucks, we focus on the leads. Make sense?"
```

#### Objection #4: "I'm not ready yet"

```
Your response:
"No pressure at all. I get it.

Here's what happens though: Competitors aren't waiting. Every month you don't have an optimized site, they're getting calls you could be getting.

The plan's month-to-month, so there's no big commitment to 'get ready' for — we can start the build next week and you're live in seven days. Want me to lock that in?"

[Move to closing]
```

#### Objection #5: "Let me think about it"

```
Your response:
"Of course. I totally understand.

Here's what I'd suggest: You know there's an opportunity here — we both acknowledged that in the call.

The risk isn't in moving forward, it's in waiting. And since it's month-to-month with no lock-in, the downside of starting is basically nothing — if it's not working in a couple months, you cancel.

What if we lock in a start date right now? I can get you live in 7 days. Works?"

[Move to closing]
```

---

### Section 5: Closing (1 min)

```
[After they've agreed or seem interested]

"Perfect. Here's what happens next:

I'll send you a link to start the plan and a short form for your business info — logo, photos, services.

You start the plan, send the info, and we get to work. 7 days later, you're live, and from there we keep it running.

Sound good?

[They say yes]

Great! Can I get your email real quick? I'll send everything over right now."

[Take their email]

"Perfect [Name]. I'll get this to you in the next 30 minutes.

You'll get an email from me with the signup link and the info form.

We're going to make this easy — in a week you'll have customers finding you on Google, and you won't have to lift a finger on it after that.

Sound good?"

[They confirm]

"Awesome. Thanks for the call. Talk soon!"

[Hang up]
```

**If they're hesitant or want to think about it:**

```
"One last thing: We onboard a limited number of new sites each month so we can do them right. If you want in this month, now's the time.

Let me know in the next 24 hours and I'll get you scheduled. Sound fair?"
```

---

## Common Call Scenarios & What to Do

### Scenario 1: They're Interested & Ready to Start (Best Case)
**Timeline:** 12 minutes
**Result:** Start the plan in the call

**Your action:**
- Confirm their email
- Confirm trade + city
- Say you'll send the signup link + info form
- Hang up and send it immediately

---

### Scenario 2: They're Interested But Need Time (Good Case)
**Timeline:** 10 minutes
**Result:** Not a start yet, but probable

**What they'll say:**
- "Sounds good but let me check with my accountant"
- "I need to think about it"
- "Can you send me something to review?"

**Your response:**
- "Smart. I'll send you everything. Check it out, and let me know your thoughts by Friday."
- Send plan details + examples
- Follow up Friday (email or SMS)
- Usually closes within 48 hrs

---

### Scenario 3: They're Not Interested (Rare, ~15% of calls)
**Timeline:** 5-7 minutes
**Result:** No start, but gather intel

**What they'll say:**
- "Nope, not interested"
- "We're DIY-ing it"
- "We already have someone"

**Your response:**
- "No problem at all. If things change, keep me in mind."
- Ask: "Out of curiosity, what made you decide to pass?" (gather feedback)
- Take notes (helps refine messaging)
- Move on to next call

---

## Post-Call Action Items

### If They Started a Plan (Congrats!)
1. [ ] Send Stripe subscription signup link immediately (same day)
2. [ ] Confirm first payment cleared
3. [ ] Request their business info (logo, photos, services, description)
4. [ ] Schedule kickoff message (confirm Day 1 onboarding email)
5. [ ] Add to "Sites to Build" list

### If They're Interested But Not Decided
1. [ ] Send plan details + examples (same day)
2. [ ] Note follow-up date (remind yourself in 24-48 hrs)
3. [ ] Send SMS reminder if no response in 48 hrs

### If They Passed
1. [ ] Thank them
2. [ ] Take notes on why
3. [ ] Log in tracking spreadsheet ("Not interested - reason: XYZ")

---

## Call Tracking

**Create a simple log after each call:**

```
| Date | Name | Trade | City | Call Length | Result | Notes | Plan |
|------|------|-------|------|------------|--------|-------|------|
| 9/18 | Mike | HVAC | Phoenix | 12 min | Started | Managed, monthly | $249/mo |
| 9/18 | Sarah | Plumbing | Denver | 10 min | Maybe | Needs to check with accountant | — |
| 9/18 | David | Electrical | Austin | 6 min | No | Already has website | — |
```

**Track:**
- Close rate % (started / total calls)
- Average call length (getting faster = more efficient)
- Common objections (helps refine pitch)
- Downsell rate (how often you fall back to $799 Offboard)

---

## Key Phrases That Work

1. "Most contractors I talk to say..." (shows pattern, normalizes their problem)
2. "One extra job every few months pays for the whole year" (ROI anchor for the monthly)
3. "You're paying for a service, not a file that rots" (justifies recurring)
4. "Less than one service call a month" (price anchor)
5. "Your competitor is getting the calls you should be getting" (urgency)
6. "Month-to-month, cancel anytime, no lock-in" (kills commitment fear)
7. "You never open a website editor" (the ongoing value, made concrete)
8. "What if we lock in a start date right now?" (move to close)

**Never say these:**
- "We build beautiful websites" (too abstract)
- "We offer design services" (too vague)
- "Let me know if you're interested" (weak close)
- "I'll follow up next week" (no urgency)

---

## Mental Game

✓ **You're helping.** They need this. They're losing leads.
✓ **~40% will start.** That's normal for a monthly plan. Most will pass.
✓ **You set the price.** Don't discount the $249/mo. If they truly can't do monthly, downsell to $799 Offboard — don't cut the monthly rate.
✓ **Speed matters.** "7 days" is a differentiator.
✓ **Ongoing is the pitch.** They're not buying a site, they're buying never having to think about it.

**If you bomb a call:**
- It's fine. You'll get better.
- Learn from it (what objection tripped you up?)
- Next call, you'll handle it differently.

---

## Ready to Execute

**Print this script. Take the first 5 calls.**

By call #3, you won't need the script.
By call #10, you'll have started 3-4 plans.

**Let's go.**
