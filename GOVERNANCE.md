# BuildFlow Governance Framework

**Last Updated:** September 2026

---

## 1. Overview

BuildFlow is a solo-operated venture (currently) with plans to scale to a team by Phase 4-5. This governance document establishes decision-making authority, role clarity, and operational procedures to ensure consistency, accountability, and scalability.

**Current Structure:** Solo operation (Chase)
**Target Structure (Phase 4+):** 3-4 person team (closer, support, contractor)

---

## 2. Decision Framework

### Decision Types & Authority

**Tactical Decisions (You Decide, Log in GitHub)**
- Examples: messaging copy A/B tests, email template tweaks, SMS timing experiments, small feature tweaks
- Authority: You (no approval needed)
- Process: Test → measure → log results in GitHub issue
- Timeline: Immediate

**Strategic Decisions (You Decide, Log in GitHub + Document)**
- Examples: pivot customer type, change pricing tiers, major design system changes, new automation platform
- Authority: You (solo for now, advisory board if scaled)
- Process: Document rationale in GitHub → log decision in `DECISIONS.md` → implement
- Timeline: 1-3 days deliberation, then execute

**Financial Decisions (You Approve)**
- Examples: hire contractor, spend >$500/month on tools, new infrastructure
- Authority: You (Chase)
- Process: Proposal → budget review → approval
- Timeline: 24-48 hours

**Legal/Compliance Decisions (Consult External, Then You Decide)**
- Examples: new terms of service, privacy policy changes, GDPR/CCPA updates, data handling policies
- Authority: You (with legal counsel if needed)
- Process: Research → draft → legal review (optional) → approve
- Timeline: 3-5 days

**Customer-Facing Changes (Log Before Launch)**
- Examples: onboarding process changes, support policy changes, new features/revisions
- Authority: You
- Process: Implement → document in customer-facing docs → log in GitHub
- Timeline: Immediate for fixes, 7 days for new processes

### Escalation Path

**If Uncertain On A Decision:**
1. Check this governance doc (may already have precedent)
2. Review `DECISIONS.md` (prior decisions with rationale)
3. Make decision + log rationale + move on
4. If decision proves wrong, update log + iterate

**No formal escalation needed** (solo operation). When scaled to team: escalate >$5K expenses or customer-impacting changes to co-founder/advisory.

---

## 3. Roles & Responsibilities

### Current Role: You (Chase)

**Title:** Founder & Operator

**Responsibilities:**
- ✓ Customer discovery & lead generation
- ✓ Sales calls & closing
- ✓ Customer onboarding & support
- ✓ Website generation & QA
- ✓ Agent development & automation
- ✓ Financial tracking
- ✓ Strategic decisions

**Authority:**
- Final say on all business decisions (solo for now)
- Approve customer-impacting changes
- Manage budget and spending
- Hiring decisions

**Hours:** 12-14 hours/week on BuildFlow (alongside Vanguard)

---

### Future Role: Support Contractor (Phase 2-3)

**Title:** Customer Support & Operations

**Responsibilities:**
- Handle support tickets (email/chat)
- Manage FAQ bot training
- Document common issues
- Track metrics
- Process customer update requests

**Authority:**
- Resolve support issues up to $100 value
- Escalate complex issues to you

**Hours:** 10-15 hours/week (contractor, not full-time)
**Cost:** $15-25/hour

**Hiring Criteria:**
- Experience with customer support or operations
- Technical fluency (understands web hosting, domains, etc.)
- Clear communication
- Reliable & responsive

---

### Future Role: Second Closer (Phase 4+, If Needed)

**Title:** Business Development & Sales

**Responsibilities:**
- Support you on sales calls (coaching, note-taking)
- Handle some customer discovery
- Manage email/SMS follow-up sequences
- Track pipeline metrics

**Authority:**
- Qualify leads for your calls
- Follow sales scripts
- Escalate to you for final closes

**Hours:** 20-30 hours/week (contract or part-time)
**Cost:** $30-50/hour (or revenue share)

**Hiring Criteria:**
- Strong communication skills
- Comfort with cold outreach
- Sales experience (direct or SaaS)
- Coachable

---

## 4. Standard Operating Procedures (SOP)

### Discovery Phase

**Process:**
1. Research potential customer (business registry, Google Maps, website)
2. Personalize email with specific context (service, location, pain point)
3. Send email + wait 2 days
4. Send SMS if email opened (or 48 hrs)
5. Wait for response (log in pipeline)

**Owner:** You
**Timeline:** Ongoing
**Success Metric:** 10-15% email open rate, 30-40% SMS open rate

**If No Response:**
- After 7 days: send final follow-up email
- If still no response: mark "not interested" in pipeline
- No harassment; one chance only

---

### Qualification Phase

**Process:**
1. Prospect replies "yes" or clicks link
2. Send qualification form (3 questions: pain point, lead volume goal, timeline)
3. AI scores response (high/med/low confidence)
4. If high confidence: schedule your call (calendar link)
5. If medium confidence: send async close (voice message + contract)
6. If low confidence: send graceful decline

**Owner:** You (form creation), Automation (form distribution & scoring)
**Timeline:** 12-24 hours from response
**Success Metric:** 20-25% of SMS opens convert to calls/async closes

---

### Sales Call Phase

**Process:**
1. 10-15 min call (you take these, pre-qualified)
2. Show 2-3 site examples (from your portfolio)
3. Explain offering (Standard $375 vs Pro $595)
4. Answer questions
5. Close: "ready to get started?"
6. Collect payment info (Stripe link)
7. Send next-steps email immediately

**Owner:** You
**Timeline:** Calls booked M-F 10 AM - 5 PM PT
**Success Metric:** 35-50% close rate on qualified calls

---

### Site Generation Phase

**Process:**
1. Receive customer data (business info, logo, content)
2. Run logo analyzer (color extraction, mood classification)
3. Select hero variant based on logo mood + business type
4. Generate site (Astro build + Claude API for copy)
5. QA check (9 checks: layout, forms, bilingual, Lighthouse, etc.)
6. 2 rounds of revisions (Standard) or 3 (Pro)
7. Launch site

**Owner:** You (+ agents)
**Timeline:** 3-5 days (first draft), 5-7 days (final)
**Success Metric:** 100% QA pass rate

---

### Onboarding Phase

**Process:**
1. Send welcome email + video 1
2. Day 1: email with videos 2-3 (Google Business, call tracking)
3. Day 3: SMS check-in (optional manual response)
4. Day 7: final email + checklist
5. Optional: Pro customers get 15-min call + 30-day review

**Owner:** Automation (emails/SMS), You (Pro calls)
**Timeline:** 7 days automated
**Success Metric:** 80% of customers complete setup within 7 days

---

### Support Phase

**Process:**
1. Customer emails support with question/update request
2. FAQ bot attempts to answer (self-service)
3. If bot can't answer: route to contractor
4. Contractor handles (or escalates to you if needed)
5. Response time target: 24-48 hours

**Owner:** Contractor (with your oversight)
**Timeline:** Continuous
**Success Metric:** <3 hours/month on support

---

## 5. Communication Channels & Update Cadence

### Where Decisions Get Logged

**GitHub Issues:**
- Major decisions (post as issue, tag with "decision")
- A/B test results (post with data)
- Technical decisions (infrastructure, code, automations)

**DECISIONS.md:**
- All strategic decisions (one-liner + rationale + date)
- Reviewed quarterly to surface patterns

**Airtable / Spreadsheet:**
- Pipeline (prospects, close rate, revenue)
- Metrics dashboard (monthly)
- Customer list (feedback, satisfaction)

**Email:**
- Customer communications (onboarding, support, updates)
- Internal (contractor updates, status checks)

### Update Cadence

**Daily:**
- Check email/support (mornings)
- Track new closes in pipeline

**Weekly:**
- Review metrics (closes, close rate, revenue)
- Update contractor on performance
- Plan next week's priorities

**Monthly:**
- P&L review (revenue, costs, profit)
- Customer feedback summary
- Metrics dashboard update
- Decision log review (any patterns?)

**Quarterly:**
- Full business review (progress toward Phase goals)
- Strategic retrospective (what worked, what didn't)
- Roadmap update
- Contractor performance review

---

## 6. Approval Gates

### What Requires Explicit Approval

**Spending >$500:**
- New tools, platforms, contractors
- Must justify ROI or strategic value
- Approval: You

**Hiring/Contractor Changes:**
- New contractor added
- Contractor role/scope changes
- Approval: You

**Customer-Facing Changes:**
- New terms of service or pricing
- Major onboarding process change
- New support policy
- Approval: You (with customer notification)

**Legal/Compliance:**
- Privacy policy changes
- T&S updates
- GDPR/CCPA compliance updates
- Approval: You (optionally with legal review)

**What Does NOT Require Approval:**
- Messaging copy changes (A/B test)
- Email/SMS template tweaks
- Small design tweaks
- Internal process improvements
- Feature flags or automation adjustments

---

## 7. Metrics & Accountability

### Key Metrics to Track

**Acquisition:**
- Sites built (volume)
- Email open rate
- SMS open rate
- SMS yes rate
- Calls taken
- Closes (count + revenue)
- Close rate on qualified calls (%)
- Time per close call (minutes)

**Operations:**
- Site generation time (hours)
- QA pass rate (%)
- Support tickets (count + time spent)
- Hours worked (actual vs. budget)

**Financial:**
- Revenue (monthly)
- Costs (API, hosting, contractor)
- Profit (revenue - costs)
- Profit margin (%)

**Customer:**
- Onboarding completion rate (%)
- Customer satisfaction (NPS if possible)
- Churn (% canceling)
- Feedback themes

### Reporting

**Monthly Dashboard:**
- 1-page summary: closes, revenue, costs, profit, key metrics
- Attached to `ROADMAP.md` for current month
- Reviewed in monthly business review

**When to Alert:**
- Close rate drops below 3% (investigate messaging)
- Support tickets >3 hours/month (automation issue)
- Profit drops >20% month-over-month (cost or volume issue)

---

## 8. Conflict Resolution

**If You Disagree With A Decision Made:**
1. Review the decision log (DECISIONS.md)
2. Check rationale
3. If still disagree: update log with new rationale + override decision
4. Document reasoning for future reference

**If A Process Isn't Working:**
1. Identify the bottleneck (use metrics)
2. Propose 1-2 alternatives
3. A/B test the better option
4. Log results + new SOP if improved

**If A Customer Complains:**
1. Support contractor documents issue
2. Escalates to you if needed
3. You resolve + log feedback
4. Review feedback quarterly for patterns

---

## 9. Scaling (Phase 4+)

### When Hiring Support Contractor

**Before Hire:**
- Document all support questions + answers (FAQ bot training)
- Create contractor runbook (common issues + solutions)
- Set up support ticketing system
- Define response time SLAs

**After Hire:**
- Weekly sync on ticket volume, patterns, escalations
- Monthly review of contractor performance
- Annual review + contract renewal

### When Hiring Second Closer

**Before Hire:**
- Document sales process (discovery → close)
- Create sales script and objection handling guide
- Set up pipeline tracking system
- Define success metrics (close rate, cycle time)

**After Hire:**
- 2x/week calls to coach and discuss pipeline
- Weekly metrics review (closes, close rate)
- Monthly revenue tracking
- Quarterly performance review

---

## 10. Changes to Governance

This document will evolve as BuildFlow scales. Changes will be logged here with dates. Do not overthink governance at this stage—refactor when complexity actually arises.

**Version History:**
- v1.0 (Sept 2026): Initial governance framework, solo operation

---

**By operating under this governance framework, BuildFlow ensures consistency, accountability, and scalability as we grow.**
