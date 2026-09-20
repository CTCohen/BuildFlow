---
title: admin-crm-operations-system
purpose: Tyler's operations dashboard — iOS app + web admin panel. Pipeline management, photo intake (OCR + auto-scoring), customer health, revenue tracking, agent QA feedback loop, and operational alerts.
status: active
owner: c.t.cohen
updated: '2026-09-18'
version: 1.0.0
tier_scope: all
phase: phase_1
spec_name: admin-crm-operations-system
spec_aliases:
- admin CRM
- operations dashboard
- Tyler's CRM
- photo intake system
- admin app
spec_sources:
- chat
spec_authority: authoritative (exported from claude.ai project memory 2026-09-17)
---

> **Overrides (Tyler, 2026-09-18).** This spec is authoritative except where Tyler ruled otherwise (`RECONCILIATION_LOG.md`, `DECISIONS.md`):
> - Web admin ships at launch; the iOS photo-intake app is Phase 1.5.
> - Remove the 'Trial Active' pipeline stage and the trial-conversion metric (no free trial).
> - Mid-Market tier reporting is deferred.


## System 18: Admin CRM & Operations System

**Phase:** Phase 1.5 (photo intake); Phase 1 (core web admin)

**Architecture:** Separate iOS app (photo intake, pipeline, customer list, revenue, alerts, agent feedback) + web admin (admin.buildflow.com — full ops, reporting, config, CRM export). Bidirectional real-time sync; iOS works offline, syncs when online.

---

## 1. Core Data Model

**Pipeline stages:** Identified → Outreach Sent → Demo Viewed → Demo Conversion → Trial Active → Customer → Churn Risk → Churned. Dashboard shows funnel % conversion + stuck-deal alerts.

**Customer record fields:** customer_id, company_name, industry, location, website_url, monthly_charge, subscription_status, started_date, lead_source, lead_score, customer_health_score, churn_risk, last_activity, qualified_leads_generated, conversion_count, trial_onboarding_complete, renewal_date, notes, contact info, crm_integrations, external_crm_sync_status, payment_status, late_payments_history.

**Agent feedback record:** feedback_id, customer_id, feedback_type, agent, assessment, metric, expected_value, actual_value, signal_strength, recommendation, action_needed, tyler_review_flag.

---

## 2. Photo Intake Subsystem (Phase 1.5)

**Trigger:** Tyler snaps photo of work van/truck from iPhone

**Workflow:** OCR Agent reads business name/phone/location/logo → Lookup Agent searches Apollo/Hunter/LinkedIn → Scoring Agent scores against ICP → Auto-Action: score ≥70 auto-build+demo, 50-69 flag for Tyler review, <50 archive to backlog

**iOS UI:** camera button, photo queue (pending/approved/sent/converted), photo details (OCR results, lead score, action status), quick actions (approve/reject/edit score/send now/archive)

**Data stored:** photo_intake_id, timestamp, image_url, ocr_results, lead_lookup matches+confidence, lead_score, recommended_action, status, resulting_customer_id, demo_sent_date, demo_personalization text

---

## 3. Revenue & Billing Dashboard

Tracked: MRR, ARR, Active Customers, Churn Rate, Trial Conversion Rate, CAC, LTV:CAC Ratio, ARPU — with trend and target per metric. Breakdown by tier (Micro/SMB/MM customer count, MRR, % of base).

---

## 4. Customer Health & Churn Risk

**Health Score Components:** Engagement 40% (site views, leads, demo clicks, integration activity), Payment 30% (on-time, no disputes), Retention Signals 20% (renewal proximity, NPS, escalations), Growth 10% (expansion, tier upgrade, feature usage trend)

**Scoring:** 80+ Healthy (green), 60-79 At-risk (yellow, schedule QBR/upsell), <60 Churning (red, intervention required)

**Intervention workflow:** system flags → notification with record+recommendation → Tyler acts (email/Slack/call/defer) → outcome tracked

---

## 5. Agent QA & Feedback Loop

Tyler sees real-time signals: Lead Scoring Agent (lead quality by vertical), Site Design Agent (design QA patterns), Copy Agent (copy performance A/B), CRM Sync Agent (sync health), Dunning Agent (payment recovery rate). "Agent Insights" dashboard card shows top 3 recommendations per day.

---

## 6. Operational Alerts & Monitoring

**P1 (immediate):** payment processing down, platform down (3+ sites), CRM sync failure (2+ customers)
**P2 (today):** high-value churn risk, lead scoring accuracy drop, demo QA failure rate >10%
**P3 (this week):** NPS trending negative, trial conversion drop >5%, CAC above target

Delivery: iOS push + email + dashboard card.

---

## 7. Integrations

**Inbound:** Stripe (payments real-time), Apollo/Hunter (lead lookup), Customer CRM Connectors (System 9)
**Outbound:** Twilio (SMS), SendGrid (email), Slack (internal alerts)

---

## 8. iOS App vs. Web Admin

**iOS:** photo intake, pipeline card, customer list, revenue dashboard, agent insights, alerts, settings
**Web Admin:** everything in iOS full-screen + detailed reporting (cohort/retention/CAC), bulk CRM export, configuration (thresholds/weights/dunning timings), agent feedback queue, customer deep-dive, invoice disputes/refunds, onboarding queue

---

## 9. Phase 1.5 Milestone: Photo Intake Launch

Depends on: iOS app framework, OCR tuned 90%+ accuracy, lead scoring model locked, demo generation working. Full pipeline (photo→OCR→scoring→build→demo) target <2 min. Success metric: photo-to-customer conversion ≥15% (vs 12% outbound average).

---

## 10. Data Security & Privacy (Tyler's Ops Only)

Passwordless magic link/OAuth; Tyler-only access, encrypted photo storage; full audit trail; daily backups; photos deleted after 30 days if not converted, customer records kept indefinitely.

---

## 11. Agent Cross-Reference

Heaviest consumer of shared agents — must not fork any:
- **OCR/Photo Intake Agent (#6)** — Section 2, ~15-20 sec of 2-min budget
- **Lead Lookup Agent (#5)** — Section 2, same fan-out mechanism System 7 uses for batch; here single-lead real-time
- **Lead Scoring Agent (#4)** — Section 2, MUST be identical model/calibration to System 7's outbound scoring — critical shared dependency
- **Design Agent (#1)** — Section 2 auto-build, one of four call sites, identical logic required
- **Lifecycle/Churn Prediction Agent (#12)** — Section 4's health score formula is the canonical definition System 12 reuses

Full agent detail: `agents/AGENT_REGISTRY.md`

---

## Status: LOCKED
