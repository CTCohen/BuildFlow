---
name: 05-feature-system
description: Phase 1 product scope, feature list, acceptance criteria per tranche, locked vs. future features
sources: [chat]
aliases: [MVP features, product scope, feature list, phase 1]
---

# System 05 — Feature System

## Purpose

Lock down Phase 1 product scope—what features ship in MVP, acceptance criteria for each, and what's explicitly deferred to Phase 2+.

## Contents

- Pricing and tranche positioning (Micro/SMB/Mid-Market)
- MVP feature inventory by tranche
- Feature acceptance criteria
- Locked vs. deferred features (Phase 2+)
- Feature dependencies and launch sequence
- Feature metrics and success criteria

## Specifications

### SECTION 0: PRICING & TRANCHE POSITIONING

**PRICING MODEL (LOCKED — Premium Positioning)**

| Tier | Managed (Recurring) | Managed (Annual, 10x monthly) | Offboard (One-Time) | Gross Margin |
|---|---|---|---|---|
| Micro | $149/mo | $1,490/yr (save $298) | $499 | 97%+ |
| SMB | $249/mo | $2,490/yr (save $498) | $799 | 98%+ |
| Mid-Market | $399/mo | $3,990/yr (save $798) | $1,299 | 98%+ |

**Annual option:** "2 months free" (~16.7% discount) across all three tiers, single upfront payment, non-refundable/non-prorated on cancellation (full spec: System 08 Section 7).

**Pricing presentation: Prescriptive.** Customer sees ONLY their assigned tier at closure — no self-selection. Lead scoring determines tier based on business size signals. If lead scoring misclassification rate >20%, recalibrate scoring — do NOT offer customer choice.

---

## SECTION 1: MVP Feature Inventory by Tranche

**LOCKED ARCHITECTURE:** All features built into static template, toggled via admin dashboard. Toggle on/off → next site regeneration includes/excludes section, live in <5 seconds.

**Micro Tier ($149/mo):**
1. Single service page (description, pricing, CTA)
2. Contact form (name, email, phone, message)
3. Auto-generated review aggregation (Google/Yelp)
4. Mobile-responsive design (WCAG 2.1 AA)
5. SSL certificate + custom domain support
6. Basic analytics (monthly page views, form submissions)
7. Email notifications (lead capture alerts)
- Excluded: CRM integration, advanced customization, white-label

**SMB Tier ($249/mo):** All Micro, plus:
8. Multiple service pages (up to 5)
9. Team member profiles
10. Photo gallery
11. Service area targeting
12. Custom colors/fonts
13. Lead priority tagging
14. CRM integration starter (1 of: Jobber, ServiceTitan, HubSpot, Housecall Pro, Successware)
- Excluded: White-label, advanced reporting, custom integrations

**Mid-Market Tier ($399/mo):** All SMB, plus:
15. Unlimited service pages & customization
16. Advanced form builder (custom fields, conditional logic)
17. Multi-location support
18. Lead automation (auto-assign, auto-notify, workflows)
19. Advanced reporting (cohort, LTV, retention)
20. Slack integration
21. Multiple CRM integrations (2+ simultaneous)
22. Custom domain for all landing pages
- Excluded: Custom development, white-label, API access

---

## SECTION 2: Feature Acceptance Criteria (Sample)

**Contact Form (Micro):** renders desktop/tablet/mobile; required fields validated; submit disabled until valid; on submit stores lead + emails customer + shows confirmation within 2 min; resets after submit; WCAG 2.1 AA compliant. Non-goals: spam filtering, multi-language (Phase 1).

**Review Aggregation (Micro):** syncs Google/Yelp/Trustpilot; displays latest 5 on homepage; daily sync; "No reviews yet" placeholder if none. Non-goals: reply to reviews, moderation (Phase 1).

**CRM Integration (SMB):** OAuth or API key auth; new leads sync within 5 min; retries every 15 min (max 5 attempts) on failure, then notifies customer; customer can pause sync; basic field mapping. Non-goals: bi-directional sync, custom transformation.

**Service Area Targeting (SMB):** customer adds towns/regions served; displays on homepage; includes geo schema markup for SEO; editable anytime.

**Lead Automation (Mid-Market):** IF/THEN rules (auto-tag/notify/assign); runs within 1 min of submission; enable/disable per rule. Non-goals: complex conditional logic, time-based automation (Phase 2).

---

## SECTION 3: Locked vs. Deferred Features

**Explicitly Deferred (Phase 2+):** white-label/reseller program, partner API access, advanced reporting (Phase 1 uses manual tracking), geo-fence lead scoring, A/B testing framework, customer-triggered email campaigns, video embedding beyond iframe/Loom, multi-language, custom development/white-glove, mobile app (web-only Phase 1), offline functionality.

---

## SECTION 4: Feature Dependencies & Launch Sequence

**Dependency graph:** Contact Form → Email Notifications (must have both); CRM Integration → Contact Form (leads before syncing); Lead Automation → CRM Integration; Advanced Reporting → Analytics Foundation.

**Launch sequence (MVP):** Week 1 Micro tier → Week 2 add SMB tier → Week 3 add Mid-Market tier (or single all-tiers launch — either acceptable). All features within a tier ship together (no staged rollout within tier).

---

## SECTION 5: Feature Metrics & Success Criteria

- **Contact Form:** target >2% submission rate; monthly review; investigate if <0.5% for 2 months
- **CRM Integration:** target >99% sync success rate, <5 min submission-to-CRM, >50% SMB adoption; weekly (success rate) / monthly (adoption) review; investigate if sync <95%
- **Review Aggregation:** review display rate, conversion impact; monthly review
- **Feature adoption tracking:** adoption by tier, churn correlation, revenue correlation (LTV by feature usage)
