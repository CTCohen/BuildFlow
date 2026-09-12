# BuildFlow — Business Plan & Phases

**Objective:** Capital generation through automated outbound website delivery to service-based trades. One-time $375-595 model. Solo operation alongside Vanguard. Exit at $100K+ profit (Month 9-12). Target exit value: $200-300K.

---

## Core Model

**What:** Find HVAC/plumbing/electrical contractors without websites. Build personalized websites. Outreach (email/SMS/call). Qualify via SMS gate. Close on phone. Hand off via automated onboarding. Exit clean.

**Target customer:** Service-based trades (plumbers, HVAC, electricians, roofers, carpenters, cleaners)

**Why them:** 40-50% have no website, 30-40% have broken/outdated ones. High urgency. Easy to find. Clear design template.

**Offering:**
- **BuildFlow Standard:** $375 one-time. Website built. You own it. Fully hands-off.
- **BuildFlow Pro:** $595 one-time. Standard + white-glove onboarding call (15 min) + 30-day optimization review + 3 revisions included.

**Positioning:** "Professional websites on your doorstep."

---

## Phase 1: Build & Validate

**Goal:** Prove the model works. Close 5-10 deals. Validate automation viability.

**Key Activities:**

**Agent setup**
- Design discovery agent: finds trades on business registries, LinkedIn, Google Maps
- Design site builder agent: generates HTML/Webflow template sites, personalized to trade type
- Design outreach agent: crafts email copy, schedules SMS cadence, tracks opens
- Use Claude API for all agents

**Qualification gate**
- Email automation: site link + context
- Day 2 email: "Did you get a chance to review?"
- SMS trigger: only if they viewed site. "If this was getting you calls, worth 15 minutes?"
- Calendar link: only if SMS yes

**Onboarding automation**
- Welcome sequence: video + setup guide + next steps
- Day 1: tutorial videos (Google Business, call tracking, customer outreach)
- Day 3: check-in (did you set up?)
- Day 7: final handoff + monthly checklist

**Manual operations**
- You take all qualified calls
- You close (expected: 5-10 closes)
- You run manual onboarding calls (not yet fully automated)
- Track every metric

**Metrics to track:**
- Sites built (target: 600)
- Email opens (target: 10-15%)
- SMS opens (target: 30-40%)
- SMS replies with "yes" (target: 20-25% of opens)
- Calls you take (expect: 15-20)
- Closes (expect: 5-8)
- Close rate on qualified calls (track: %)
- Time per call (target: 10-15 min)
- Revenue: $1,875-3,000

**Hours per week:** 10-12 hours (front-loaded on setup)

**Success criteria:**
- At least 1 close (any close = model works)
- Close rate on qualified calls ≥3% (acceptable baseline)
- Average time per close call ≤15 minutes
- Onboarding automation handles 80% of setup without you

**If it fails:**
- Close rate <1%: Messaging/hook is wrong. Pivot copy or customer type.
- No one replies: Discovery is finding the wrong people, or email lands in spam. Fix targeting or deliverability.
- Can't close: Your call skills or close conversation isn't working. Tape and review.

---

## Phase 2: Scale with AI-assisted closes

**Goal:** Increase closes/month to 10-14 without proportional increase in your time. Introduce AI pre-close qualification.

**Key changes:**

**Qualification gate 2.0**
- After SMS "yes" → don't send calendar link
- → Send: short form (3 questions)
  - "What's your biggest lead source gap right now?"
  - "How many leads/week would move the needle?"
  - "When would you want this live?"
- AI scores responses (OpenAI or Claude API)
- High-confidence prospects → your 10-min call
- Medium-confidence → async close (voice message + contract link via email)
- Low-confidence → auto-decline gracefully

**Async close process**
- AI generates personalized voice message: "Hi [name], I reviewed your responses. Here's what I'm thinking..."
- Link to contract (Stripe Payment Link or DocuSign)
- Email follow-up 24h later if no signature
- Email follow-up 48h later if no response

**Onboarding 2.0**
- Automated welcome video (AI-generated, personalized name + site URL)
- Auto-email sequence (day 0, 1, 3, 7)
- Support bot: FAQ answers 80% of common questions
- Contractor ticket handler: $15-25/hour, handles remaining 15%

**Volume increase**
- Sites built: 900 (up from 600)
- Qualified calls you take: 12-16 (down from 20, but better pre-qualified)
- Async closes: 3-4 (new channel)
- Total closes: 15-20 (up 2-2.5x from Phase 1)

**Pricing:**
- Keep Standard at $375 for volume
- Introduce Pro at $595 (white-glove for 15-20% uptake)
- Blended average: ~$415

**Revenue:** $6,225-8,300/month

**Hours per week:** 12-15 hours (more sites, fewer manual calls)

**Metrics:**
- Sites built: 900
- Response rate: track (expect same 10-15%)
- Qualified calls: 12-16
- Async closes: 3-4
- Total closes: 15-20
- Your close rate (calls): 35-45% (pre-qualified better)
- Async close rate: 20-30% (lower than calls, but no time)
- Time spent on calls: 10-12 hours/month (down from 20+)
- Support tickets: track volume (expect 1-2 per customer)

**Success criteria:**
- Closes 15+ per month (2-3x Phase 1)
- Async closes ≥20% of revenue (proves AI close works)
- Your call hours stay flat or decrease despite 2.5x closes
- Support tickets manageable (<2 hours/month)

**If it fails:**
- Async closes <10%: Message/process isn't converting. Refine voice copy.
- Support tickets explode: Onboarding automation isn't working. Improve tutorials or hire contractor earlier.

---

## Phase 3: Refine & optimize

**Goal:** Maximize unit economics. Hit $10-12K/month run rate. Clean up operations for handoff.

**Key activities:**

**Messaging optimization**
- A/B test email subject lines
- A/B test SMS hook ("worth 15 min" vs other angles)
- Test different site angles (lead-gen vs credibility vs price)
- Track what converts best by trade type

**Automation tightening**
- Reduce manual touch points to near-zero
- Self-service onboarding: measure completion rates (goal: 90%+)
- Support bot: expand FAQ coverage (goal: handle 85%+ of tickets)
- Contractor ticket handler: document all common issues for bot training

**Customer delight layer**
- 30-day check-in (auto-generated): "Here's how you're ranking for [keyword]"
- Performance dashboard: customers can see their site analytics
- (Optional) Email template: "Here's how to tell your customers about your new site"

**Pricing test**
- Trial $595 price point on 50% of new customers
- Measure uptake (target: 20%+ choose Pro)
- If >25% choose Pro, increase overall ASP to $450 blended

**Volume**
- Sites built: 1,200
- Closes: 18-22
- Revenue: $7,500-9,000/month (blended ASP)

**Hours per week:** 14-16 hours (more volume, better automation)

**Metrics to track:**
- Conversion by trade type (which convert best?)
- Email open rate by subject line
- SMS yes rate by hook message
- Async close rate by messaging variant
- Support ticket volume (should be flat or decreasing)
- Customer feedback (NPS, qualitative)

**Success criteria:**
- Closes 20+ per month consistently
- Unit economics clear (cost to acquire, time to close, revenue per close)
- You can hand this off to someone else without being present
- Support tickets <3 hours/month (can be handled by contractor)

---

## Phase 4: Automate onboarding

**Goal:** Remove yourself from post-close operations entirely. Prepare for handoff.

**Key activities:**

**Full self-service onboarding**
- Day 0: Auto-email with welcome video, site link, setup checklist
- Day 1: Auto-email with how-to videos (Google Business, call tracking, customer outreach)
- Day 3: Auto-SMS check-in ("Did you set up Google Business?")
- Day 7: Auto-email with monthly checklist and "we're done here"
- Support: Fully routed to AI FAQ bot + contractor

**Pricing tier formalization**
- Standard: $375 (self-serve everything)
- Pro: $595 (15-min onboarding call + 30-day review + 3 revisions)
- Communicate pricing clearly in close conversation

**Documentation for handoff**
- All agents documented: what they do, how to run them, how to update copy
- All automation flows documented: email/SMS sequences, gates, routing rules
- Metrics dashboard: monthly reporting template
- Support runbook: common issues + solutions

**Volume and cadence**
- Sites built: 1,500
- Closes: 20-25 per month
- Revenue: $8,750-11,000/month

**Hours per week:** 12-14 hours (you only close, everything else is automated)

**Metrics:**
- Calls you take: 12-16 (pre-qualified, AI-scored)
- Your close rate: 40-50% (very pre-qualified now)
- Async closes: 6-10 (growing as message optimizes)
- Support tickets handled by contractor: <4/month
- Customer satisfaction: track (should be high, minimal surprise support)

**Success criteria:**
- You take ≤15 calls/month to hit 20-25 closes (easy, high-quality conversations)
- You spend <2 hours/month on post-close operations (onboarding is fully automated)
- Contractor handles all support for <$200/month
- Business runs without you present (could go on vacation, check in weekly)

---

## Phase 5: Stabilize & scale to exit threshold

**Goal:** Hit $100K+ annual profit. Stabilize operations. Prepare to sell.

**Key activities:**

**Volume increase for final push**
- If Phase 4 metrics are solid, increase volume: 2,000+ sites/month
- Closes: 25-30 per month
- Revenue: $11,000-13,000/month run rate

**Optional managed tier introduction**
- Offer $50/update service for common requests (contact changes, photo updates, etc.)
- ~30-40% uptake expected
- Adds $300-400/customer over first year (not required for exit, but increases valuation)

**Clean up for buyers**
- Financial statements: monthly P&L, customer metrics, cost structure
- Customer data: names, emails, close dates, ARR (if any)
- Repeatable processes: documented agents, automation flows, sales script
- Metrics dashboard: monthly close rate, response rate, cost per close, revenue
- Testimonials/case studies: before/after screenshots of 3-5 best customers

**Exit positioning**
- This is a turnkey service business with systematized lead gen, qualification, and close
- Recurring update revenue possible ($50/update, 30-40% attach rate)
- Can be run by non-technical person (agents handle everything)
- Buyer could immediately hire 1-2 people and scale to 50+ closes/month

**Final volumes**
- Sites built: 2,000-2,500
- Closes: 25-35 per month
- Revenue: $11,000-15,000/month (including optional update revenue)
- Profit: $9,000-12,000/month (assuming minimal overhead)

**Hours per week:** 12-14 hours (stays flat, you're just closing)

**Metrics at exit threshold:**
- Annual run rate revenue: $180-200K (if hitting 30 closes/month)
- Annual profit: $100-120K (minimal costs: Anthropic API <$500/mo, infra <$200/mo, contractor <$200/mo)
- Close rate on qualified calls: 40-50%
- Time to close per deal: 5-10 minutes
- Support overhead: <$200/month (contractor)
- Churn: track (should be <5% — they own the site, no ongoing obligation)

**Success criteria:**
- Hit $100K+ annual profit
- Business runs without you for a month (vacation test)
- Can document all operations in <20 pages
- Have 50+ customers (proof of repeatability)

---

## Phase 6: Exit

**Goal:** Sell the business. Extract $200-300K. Redeploy capital.

**Exit strategy:**

**Buyer profile:**
- Web agencies wanting recurring revenue
- HVAC contractors wanting to offer website service
- SDRs/closers wanting white-label system
- Consultants wanting add-on offering

**Valuation:**
- Baseline: 2-3x annual profit
- At $100K annual profit: $200-300K
- If you've built update revenue (20-30% attach): +20-30% to valuation

**Transition:**
- Buyer onboarded on systems, agents, automation
- Buyer shadows 5-10 closes
- Buyer takes calls solo. You available for questions.

**Key documents for sale:**
- Financial statements (P&L, monthly trends)
- Customer list (names, emails, close dates, pricing)
- Operations manual (agents, automation, support playbook)
- Customer testimonials (5-10 quotes)
- Metrics dashboard (conversion funnels, close rates, revenue trends)

**Post-exit:**
- Consulting period: 30 days at $5K flat fee (handle edge case questions)
- Capital deployment: $100-150K into Tenax, $50-100K reserve for family breathing room

---

## Financial Model Summary

| **Phase** | **Sites/mo** | **Closes** | **Revenue/mo** | **Profit/mo** | **Your hours/week** | **Run rate** |
|---|---|---|---|---|---|---|
| Phase 1 | 600 | 5-8 | $1,875-3,000 | $1,700-2,750 | 10-12 | $22.5-36K |
| Phase 2 | 900 | 15-20 | $6,225-8,300 | $5,800-7,700 | 12-15 | $74.7-92.4K |
| Phase 3 | 1,200 | 18-22 | $7,500-9,000 | $7,000-8,300 | 14-16 | $90-108K |
| Phase 4 | 1,500 | 20-25 | $8,750-11,000 | $8,200-10,200 | 12-14 | $105-132K |
| Phase 5 | 2,000-2,500 | 25-35 | $11,000-15,000 | $9,000-12,000 | 12-14 | **$132-180K (annual)** |
| **Exit** | — | — | — | **$200-300K lump** | — | Done |

---

## Key Metrics to Track Monthly

**Acquisition funnel:**
- Sites built (volume)
- Email opens (% of sent)
- SMS opens (% of email opens)
- SMS yes replies (% of SMS opens)
- Calls you take (count)
- Closes (count)
- Close rate on your calls (%)

**Financial:**
- Revenue (sum of closes × ASP)
- Costs (Anthropic API, hosting, contractor if applicable)
- Profit (revenue - costs)

**Operations:**
- Average time per close call (minutes)
- Support tickets (count, time spent)
- Hours you worked (actual)
- $/hour (revenue per your time)

**Customer quality:**
- Churn (how many stop communicating)
- Update service uptake (% of customers buying revisions)
- NPS or qualitative feedback

---

## Success Criteria by Phase

**Phase 1 success:** ≥1 close, ≤15 min avg call time, ≥3% close rate on qualified calls

**Phase 2 success:** ≥15 closes/month, async closes ≥20% of revenue, ≤15 call hours/month

**Phase 3 success:** ≥20 closes/month, clear unit economics, <3 support hours/month

**Phase 4 success:** ≤15 calls/month for 20-25 closes, <2 hours post-close work/month, fully documented

**Phase 5 success:** $100K+ annual profit, can run for a month without you, 50+ customers

**Phase 6 success:** Sold for $200-300K, capital deployed, moved on

---

## Risk flags & Pivots

**If close rate <3%:** Hook/messaging isn't working. Pivot email subject, SMS angle, or site positioning.

**If close rate >10% early:** You're underpricing. Raise to $495-595 in Phase 2.

**If support tickets explode (>5/mo):** Onboarding automation failing. Hire contractor earlier or improve tutorials.

**If async closes <15%:** Voice message/contract process not working. Test shorter, simpler messaging.

**If you can't hit 20+ closes by Phase 4:** Model doesn't scale efficiently. Consider:
- Hiring a second closer (loses "solo" goal but unlocks growth)
- OR exiting at Phase 3 (still profitable, $60-80K/year)
- OR pivoting customer type (maybe agencies/resellers instead of direct to trades)

---

## Implementation Checklist

**Setup:**
- [ ] Claude API setup + agents prototyped
- [ ] Email/SMS automation configured (Zapier + Gmail/Twilio)
- [ ] First 100 site templates built and tested
- [ ] Qualification gate flows mapped out
- [ ] Onboarding automation sequences written
- [ ] Payment/contract process set up (Stripe or DocuSign)

**Phase 1:**
- [ ] 5+ closes (any closes = go)
- [ ] Metrics tracked and documented
- [ ] Feedback from first customers collected

**Phase 2:**
- [ ] Async close tested and refined
- [ ] AI scoring of qualification form working
- [ ] Support contractor (if needed) hired

**Phase 3:**
- [ ] Messaging optimized (A/B tested)
- [ ] Pro pricing tier tested

**Phase 4:**
- [ ] Full onboarding automation running
- [ ] Operations manual drafted
- [ ] Buyer prospect list identified

**Phase 5:**
- [ ] Financial statements cleaned up
- [ ] Customer testimonials collected
- [ ] Exit conversations started

**Phase 6:**
- [ ] Buyer selected
- [ ] Transition plan executed
- [ ] Capital deployed

---

## Notes

- Assumes this runs alongside Vanguard (12-14 hours/week)
- API costs stay <$500/month (sites are lightweight, automation is efficient)
- Contractor costs (if needed) are <$200/month until Phase 4+
- Exit is not mandatory; you can keep running it for $10-15K/month passive income
- Phases 1-5 are designed to compound and reduce your time investment over time
- The goal is clean exit with $200-300K, not perpetual growth
