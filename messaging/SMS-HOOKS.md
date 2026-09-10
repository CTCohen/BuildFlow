# SMS Messaging Strategy

**Purpose:** High-converting SMS follow-up sequences for contractor outreach.

SMS has 3x higher open rate than email (98% vs. 30%) and 40x faster response time.
Use SMS as the follow-up, not the first touch.

---

## SMS Timing Strategy

**Day 0 (Email sent):**
- No SMS (email is first touch)

**Day 1:**
- If email opened: No SMS needed (they engaged)
- If email NOT opened: Send SMS with video link

**Day 2-3:**
- If they replied to email: Stop SMS sequence
- If no email reply: Send follow-up SMS with calendar link

**Day 7:**
- If no response to email/SMS: Send final SMS with offer deadline

---

## SMS Message Variants

### Variant A: FOMO (Fear of Missing Out)
**When:** Follow-up to email non-open, targeting seasonal urgency

```
Hi [Name]! Summer is peak season for [trade].
Contractors with better websites book jobs 40% faster.

See the difference → [2-min video]

– BuildFlow
```

**Best for:** HVAC (summer rush), pressure washing, lawn care (spring)

**Metrics:**
- Character count: 115 (fits in 1 SMS)
- Call rate: High (FOMO is strong motivator)

---

### Variant B: Curiosity + Social Proof
**When:** Follow-up to email with competitive angle

```
[Name], 6 contractors in [City] just launched new sites.
Already getting online quote requests.

Quick look? [2-min video]

– BuildFlow
```

**Best for:** Competitive markets (every contractor you call has competition)

**Metrics:**
- Character count: 109 (1 SMS)
- Call rate: Medium-high (social proof works)

---

### Variant C: Direct Call-to-Action
**When:** Follow-up to email, targeting immediate action

```
[Name], question: How many leads came from your website last month?

If it's under 5, we can help.

5-min call? [Calendar link]

– BuildFlow
```

**Best for:** Warm leads, follow-ups, prospects who engaged with email

**Metrics:**
- Character count: 142 (2 SMS)
- Call rate: Highest (direct question drives response)

---

## Objection-Specific SMS

### If they text "Too expensive"
```
[Name], most contractors make back the cost in 2-3 new jobs.

Real example: One HVAC contractor on our $99/mo plan got 2 jobs ($600 each) in month 1.

Worth 10 minutes to talk? [Calendar]

– BuildFlow
```

### If they text "I have a website"
```
That's awesome! Quick question: How many new customers came from it last month?

If it's less than 5, we can probably improve it in 1-2 weeks.

Quick call? [Calendar]

– BuildFlow
```

### If they text "I'm not interested"
```
No problem! One quick thought tho — if you ever want to capture more leads online, 
we can do it in a week. Just keep us in mind.

Good luck!

– BuildFlow
```

---

## SMS Sequence (Full)

**Day 0:**
- Email sent (no SMS)

**Day 1 (9 AM):**
- SMS Variant A or B (social proof or FOMO)
```
"6 contractors in [City] just launched new sites. 
Already getting online quote requests. Quick look? [VIDEO]"
```

**Day 2 (2 PM):**
- If no SMS reply, send direct CTA
```
"[Name], question: How many leads from your website last month?
If under 5, we can help. 5-min call? [CALENDAR]"
```

**Day 5 (10 AM):**
- If still no reply, send offer deadline
```
"[Name], last chance this week for Phase 1 availability.
Only 2 spots left. Details: [SHORT_LINK]"
```

**Day 7:**
- Stop sequence (move to Phase 2 if they don't convert)
- Archive prospect for Phase 2 re-engagement (30 days later)

---

## Personalization in SMS

**Available tokens:**
- `[Name]` (first name only, SMS is casual)
- `[City]` (local specificity)
- `[Trade]` (HVAC, plumbing, electrical, etc.)
- `[Competitor Count]` ("6 contractors", "12 plumbers")

**Avoid:**
- `[Full Business Name]` (too formal for SMS)
- Long URLs (use bit.ly or similar shortener)
- Emojis (unless brand voice is playful)

---

## Character Limits

SMS has 160 character limit (160-char message = 1 "segment").
Multi-segment SMS charges more and has lower engagement.

**Target: Keep SMS ≤160 characters (1 segment)**

**Examples:**

✅ Good (1 SMS):
```
"6 contractors in Phoenix just launched sites.
Getting leads already. Video: [link]"
= 76 characters
```

❌ Bad (2 SMS):
```
"Hi [Name], I noticed you don't have a website. 
Most contractors without sites are losing 60% of their potential leads..."
= 157 characters (barely fits)
```

---

## SMS Cadence Rules

**Max frequency:**
- 1 SMS per day (avoid SMS fatigue)
- Max 3 SMS total per prospect (abandon after 3 no-responses)
- If they reply, never send the next SMS (conversation mode)

**Optimal time to send:**
- 9-10 AM (morning check)
- 2-3 PM (afternoon check)
- Avoid: 6+ PM (too late), early morning (too early), weekends (lower response)

---

## Response Handling

**If they text back:**
- Immediate SMS reply (within 1 hour)
- Transition to human (support contractor or you)
- Use SMS for scheduling, email for details

**SMS replies to expect:**
- "Yes" → Send calendar link immediately
- "What?" → Send 1-sentence clarification
- "Call me" → Request phone number + call within 2 hours
- "Interested but busy" → Offer calendar link
- "Not interested" → Graceful exit (see template above)

---

## Compliance Notes

**SMS compliance (US/Canada):**
- Opt-in required (implied consent via email = okay)
- Opt-out capability ("Reply STOP to unsubscribe")
- Clear sender ID ("BuildFlow")
- No SMS before 9 AM or after 9 PM recipient's time

**Implementation:**
- Use SMS platform with compliance built-in (Twilio, MessageBird)
- Add "Reply STOP to opt-out" footer to every SMS
- Track opt-outs (never resend to opt-outs)

---

## Phase 1 Testing

**Hypothesis:**
SMS Variant C (direct CTA) will have 2x higher response rate than Variant A (FOMO)

**Test setup:**
- Send Variant A to 5 prospects
- Send Variant C to 5 prospects
- Track: Reply rate, calendar link clicks, calls booked

**Success metric:** Variant C has >30% reply rate

---

## Phase 2 Optimization

Once we have Phase 1 data:
- Combine best SMS + best email
- Test different send times (9 AM vs. 2 PM)
- Test SMS length (1 SMS vs. 2 SMS)
- Personalize by trade (HVAC SMS ≠ plumbing SMS)

---

## Tools/Platform

**Recommended:** Twilio (most flexible)
- Cost: $0.0075 per SMS (affordable at scale)
- Features: Compliance built-in, API, scheduling
- Integration: Zapier (automation)

**Alternative:** MessageBird or Bandwidth (similar pricing/features)

**Setup time:** 2-3 hours (account setup + Zapier automation)

---

## Success Criteria

✓ SMS send rate ≥95% (deliverability)
✓ SMS reply rate ≥25% (vs. email reply rate of 15%)
✓ Calendar link clicks from SMS ≥15%
✓ SMS → Call booked conversion ≥10%
✓ Opt-out rate <2% (too many opt-outs = messaging issues)

---

**Phase 1 rollout:** Weeks 2-3 (after finalizing email hooks)
**Phase 2 optimization:** Weeks 5-6 (after analyzing Phase 1 data)
