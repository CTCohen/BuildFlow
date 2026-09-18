---
name: 07-lead-to-customer-pipeline
description: Lead warehouse population, qualification scoring, outbound campaigns, GTM feedback loop
sources: [chat]
aliases: [lead generation, lead qualification, outbound sales, GTM engine]
---

# System 07 — Lead-to-Customer Pipeline

## Purpose

Lock down how leads are discovered, enriched, scored, prioritized, and contacted via outbound campaigns.

## Contents

- Lead warehouse: sources, targeting criteria, enrichment
- Lead qualification and scoring model
- Outbound campaign system (email infrastructure, sequencing)
- Lead-to-conversion tracking and attribution
- GTM feedback loop and optimization
- Geographic and vertical expansion strategy

## Specifications

### SECTION 1: Lead Warehouse

**Contents:**
- Lead sources Phase 1: Apollo.io, Hunter.io, LinkedIn Sales Navigator (manual export), manual upload (referrals)
- Targeting criteria: Geography (AZ, CA, TX, FL, NY test markets), Vertical (Plumbing, HVAC, Electrical, Roofing), Company size (1-50 employees), Signals (has website, Google Business Profile, reviews)
- Enrichment data per lead: company name/location/phone/website, primary contact name/title/email/phone, business type, headcount, years in business, revenue estimate, existing tech stack, review/social signals
- Data quality targets: email deliverability >95%, phone accuracy >80%, completeness >90%, staleness <6 months >85%
- Warehouse schema: lead_id, company, name, email, phone, vertical, location, source, created_at, last_contacted_at, status

---

## SECTION 2: Lead Qualification & Scoring

**Lead scoring model (100-point scale, weighted) — LOCKED:**
- **Vertical + Location + Company size (0-40 pts):** vertical match +20, location +10, company size +10
- **Business fit signals (0-35 pts):** headcount aligns +10, years in business 2+ +8, has reviews +10, revenue/social signals +7
- **Engagement signals (0-25 pts):** has GBP +8, has website +8, active social +6, high review velocity +3
- **Weighting rationale:** Fit-heavy (35/40/25) — prioritize ICP lock over engagement (trailing indicator)

**Thresholds:** 70-100 outreach immediately; 50-69 secondary tier; 20-49 backlog; 0-19 deprioritize

**Re-scoring cadence:** daily for new leads; weekly rescore of existing leads

---

## SECTION 3: Outbound Campaign System

**Email infrastructure:** SendGrid (provider), bounce/complaint handling, sender domain

**Email templates (A/B tested):** Template A (high-touch, personalized), Template B (social proof), Template C (urgency)

**Personalization fields:** {{first_name}}, {{company}}, {{service}}, {{location}}, {{num_reviews}}

**Sequencing (5-email drip):** Day 0 initial → Day 3 re-send if no open → Day 7 follow-up different angle → Day 14 last attempt → Day 21 mark contacted/no response. One per day, same time (9 AM local).

**Send frequency:** target 100 leads/day × 5-email sequence; spam compliance monitored (<5% bounce, <0.1% complaint); warmup period for new sending domain

**Compliance:** CAN-SPAM unsubscribe link required; one-click unsubscribe; pause campaign if 5%+ marked spam

---

## SECTION 4: Lead-to-Conversion Tracking & Feedback

**Tracking:** unique demo URL per lead with UTM params; attribution is last-touch (email that generated demo click gets credit)

**Weekly reporting:** emails sent, open rate, click rate, demo view rate, conversion rate, CAC; best-performing template/vertical/location; action items

---

## SECTION 5: GTM Feedback Loop & Optimization

**Monthly pipeline review (1st Friday):** metrics vs. target CAC; scale spend if CAC < target, optimize quality if CAC > target

**A/B testing framework:** one test at a time, 2-week minimum, 95% confidence to declare winner

**Scaling decisions:** payback-ratio-driven (CAC $50 vs LTV $2000 = 20x payback → scale 2x spend)

**Geographic/vertical expansion:** measure conversion by geography/vertical, scale winners, cut/investigate underperformers

**CAC payback threshold:** target <6 months (Micro tier: acceptable CAC ≤$894)

---

## SECTION 6: Agent Cross-Reference

**Shared scoring model:** The 100-point scoring model in Section 2 is executed by the **Lead Scoring Agent** (Agent Registry #4) — the SAME agent/model used by System 18's photo-intake feature, evaluated per-vertical for calibration. Photo-intake and outbound-sourced leads must be scored on identical logic.

**Outreach/Copy Agent (Agent Registry #7)** generates Section 3's personalized email templates; sequencing/cadence logic is a deterministic workflow, not agentic.

**Lead Lookup Agent (Agent Registry #5)** is the same fan-out (Apollo + Hunter + LinkedIn) mechanism used in System 18's photo intake — this system's Section 1 warehouse population uses it for batch enrichment; System 18 uses it for single-lead real-time lookup.

Full agent detail: `systems/agent-registry.md`
