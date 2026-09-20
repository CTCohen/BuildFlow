---
title: System 12 — Customer Lifecycle Success System
purpose: Onboarding, success milestones, churn prediction, retention motions, review sync and display
status: active
owner: c.t.cohen
updated: '2026-09-18'
version: 1.0.0
tier_scope: all
phase: phase_1
spec_name: 12-customer-lifecycle-success-system
spec_aliases:
- customer success
- retention
- lifecycle
- onboarding
spec_sources:
- chat
spec_authority: authoritative (exported from claude.ai project memory 2026-09-17)
---

> **Overrides (Tyler, 2026-09-18).** This spec is authoritative except where Tyler ruled otherwise (`RECONCILIATION_LOG.md`, `DECISIONS.md`):
> - Mid-Market milestones and the SMB to Mid-Market upsell are deferred; only Micro to SMB upsell applies.
> - Launch is English-only.


# System 12 — Customer Lifecycle Success System

## Purpose

Lock down customer onboarding, engagement milestones, churn prediction, and retention strategies post-purchase.

## Contents

- Onboarding workflow (30-day journey)
- Success milestones and engagement signals by tranche
- Churn risk scoring and at-risk interventions
- Review sync and display (Google, Yelp, Trustpilot)
- Expansion and upselling triggers

## Specifications

### SECTION 1: Onboarding Workflow (30-day journey)

- Day 0: purchase confirmed, welcome email
- Day 1: first login, guided tour
- Day 3: customization check-in email
- Day 7: first leads milestone, celebrate + show CRM/lead management
- Day 15: mid-point engagement check (5+ leads?); if low, "tips to get more leads" email
- Day 30: success confirmation (10+ leads AND 2+ edits) → "you've launched" + next steps

**Channels:** automated email (5-6 over 30 days), dashboard contextual prompts, video tutorials, 1-on-1 support on request

---

## SECTION 2: Success Milestones & Engagement

**By tranche:**
- Micro: Week 1 = 5 leads; Month 1 = 20 leads + 1 conversion; Month 3 = 100+ leads
- SMB: Week 1 = CRM working; Month 1 = 30+ leads + 2 conversions; Month 3 = 200+ leads, team trained
- Mid-Market: Week 1 = custom workflows configured; Month 1 = 50+ leads; Month 3 = $5K+ revenue from leads

**Engagement signals:** site visits, lead captures, customer actions (edits), form engagement (CTR, completion rate)

**Celebration:** milestone emails, dashboard badges, case study offer, upsell offer

---

## SECTION 3: Churn Prediction & Prevention

**Red flags (high risk):** 0 leads 30 days, 0 logins 14 days, payment failed 2x, NPS <0, negative feedback

**Yellow flags (medium risk):** <5 leads/month, 1 login/month, one-time payment then stopped

**Green (healthy):** 5+ leads/month, 1+ login/week, auto-renewed

**Interventions:** Red → Tyler direct email offering call/audit; Yellow → automated 3-email tips series; Green → nurture (newsletter, upgrade offers, referral incentive)

**Retention SLA:** respond to at-risk within 24 hours; goal 20% churn reduction

---

## SECTION 4: Review Sync & Display

**Sources:** Google Business Profile, Yelp, Trustpilot (Phase 1); Facebook/Instagram (Phase 2 if demand)

**Sync:** daily, off-peak; captures rating/name/text/date/URL; deduplicated

**Display:** customer-chosen location/style (grid/carousel/list), quantity (5-10), filtering, sorting, aggregate rating summary

**Moderation:** customer can flag inappropriate reviews (Tyler manual review), cannot delete; can respond if platform supports

**SEO impact:** schema markup for reviews, trust signals boost local SEO, content freshness signal

---

## SECTION 5: Expansion & Upselling

**Triggers:** Micro→SMB after 50 leads or 60-day renewal; SMB→Mid-Market after 200 leads or custom request

**Process:** email comparison + benefits, one-click dashboard upgrade, self-serve proration, Tyler available for migration help

**Churn prevention via upsell:** risk-free trial of higher tier as retention tactic ("Try SMB free for 30 days")

---

## SECTION 6: Agent Cross-Reference

**Churn scoring unification:** Section 3's red/yellow/green flags map onto System 18's quantitative health-score formula (Engagement 40% / Payment 30% / Retention Signals 20% / Growth 10%) rather than a separate scoring system:
- Red ≈ health score <60 ("churning")
- Yellow ≈ health score 60–79 ("at-risk")
- Green ≈ health score 80+ ("healthy")

**Trigger timing:** Dunning Agent (System 8) notifies this system's churn score immediately on entry to Tier 3 (30+ days late), not at next scheduled recompute.

**Agent used:** Lifecycle/Churn Prediction Agent (Agent Registry #12) — reuses System 18's formula; recomputes daily + event-triggered (payment failure, login-inactivity threshold).

**Onboarding automation:** Day 0-30 email sequence (Section 1) uses Outreach/Copy Agent (Agent Registry #7) for personalization; trigger logic stays a deterministic workflow.

**Review Sync Agent (Agent Registry #14)** executes Section 4's daily poll/dedup — cheap-tier, no LLM reasoning needed.

Full agent detail: `agents/AGENT_REGISTRY.md`
