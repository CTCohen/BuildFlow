---
title: System 13 — Observability System
purpose: Monitor uptime, performance, errors, and business metrics across all BuildFlow systems with alerting and dashboards
status: active
owner: c.t.cohen
updated: '2026-09-18'
version: 1.0.0
tier_scope: all
phase: phase_1
spec_name: 13-observability-system
spec_aliases:
- monitoring
- observability
- alerting
- metrics
- dashboards
spec_sources:
- chat
spec_authority: authoritative (exported from claude.ai project memory 2026-09-17)
---

# System 13 — Observability System

## Purpose

Track system health, customer behavior, and operational metrics to detect failures and optimize performance. A homegrown monitoring layer using four coordinated cron-based jobs (not LLM agents — see Agent Registry Section A2) that ping infrastructure, aggregate business metrics, dispatch alerts, and render real-time dashboards on the admin dashboard.

**Tier:** Tier 3 (Scale) — shipped after MVP launch.

## Contents

- Monitoring jobs (Health Check, Metrics, Alert Dispatcher, Dashboard Renderer)
- Infrastructure health checks
- Business metrics queries
- Alert thresholds and routing rules
- Admin dashboard specification
- Notification channels (SMS, Slack, email)
- Data retention and logging
- Cost model and deployment architecture
- Operational dials (control signals)

---

## MONITORING CHECKLIST (Summary)

| Category | Frequency | Alert Threshold |
|---|---|---|
| Infrastructure uptime (buildflowsites.com, DNS, Cloud Run, DB) | 1-5 min | 3 failed checks = down |
| Demo generation/QA pass rate | 1h | <5 generated/24h; <90% QA pass |
| Lead warehouse volume | 1h | <50 leads rolling 7d |
| Form submissions / conversion rate | 1h | <5/24h; <5% conversion |
| CRM sync latency/error rate | 15min-1h | >1h old; >10% error |
| Stripe connectivity / MRR / churn signals | 5min-1h | unavailable >5min; declining MRR |
| Customer site load time / login activity | 30min-1h | >5s load; 0 logins 7d |

---

## JOB ARCHITECTURE (Cron/Infra, Not LLM Agents)

**1. Health Check Job:** pings infra endpoints every 5 min (HTTP, DNS, Cloud Run, DB), 3+ consecutive down = trigger alert

**2. Business Metrics Job:** hourly SQL queries (demos_generated_24h, demo_qa_pass_rate, form_submissions_24h, new_customers_today, crm_sync_failures_24h, mrr_current, churn_signals_7d), alerts if thresholds crossed

**3. Alert Dispatcher Job:** gathers alerts, dedupes (30 min window), categorizes CRITICAL (SMS+Slack+email immediate) / WARNING (Slack+email, hourly digest) / INFO (daily digest 8am)

**4. Dashboard Renderer Job:** fetches latest data on-demand or pre-caches every 5 min (Redis TTL 5 min), returns JSON to admin.buildflow.com/dashboard

**Deployment:** Cloud Run + Cloud Scheduler; PostgreSQL tables (health_check_log 30d retention, business_metrics_log 90d, alerts until ack+7d)

---

## ADMIN DASHBOARD LAYOUT

Top section: infrastructure status (green/red per endpoint) + active alerts. Business metrics scrollable panel (demos, QA pass rate, submissions, new customers, sync failures, MRR, churn signals). CRM sync per-customer status table. Recent activity log (latest 10 events).

---

## COST MODEL

Cloud Run <$0.50/mo, Cloud Scheduler <$0.01/mo, Postgres storage <$1/mo, Twilio SMS ~$0.05/mo, Slack free, SendGrid free tier, Redis $0-5/mo. **Total: ~$1-5/month, all homegrown (no Datadog/Sentry/PagerDuty).**

---

## ALERT THRESHOLDS (LOCKED)

| Metric | Warning | Critical |
|---|---|---|
| Infrastructure uptime | <99% | 3+ consecutive fails |
| Demo generation rate | <5/24h | 0/24h |
| Demo QA pass rate | <90% | <80% |
| Form submissions | <5/24h | 0/24h |
| CRM sync latency | >1h old | >4h old |
| CRM sync failure rate | >10% | >25% |
| Stripe connectivity | unavailable >5min | unavailable >15min |
| MRR | trending down | $0 |

---

## ON-CALL & SLA (LOCKED)

99.5% uptime SLA (3.6 hrs/month allowed downtime). Business hours response 6am-8pm AZ. After-hours: SMS only for CRITICAL infra. No 24/7 on-call required Phase 1.

---

## DATABASE TABLES

health_check_log, business_metrics_log, alerts — schemas as defined in full spec.

---

## IMPLEMENTATION PRIORITY

Phase 1 MVP (pre-launch): Health Check + Alert Dispatcher + basic Dashboard Renderer. Phase 1 post-launch (10 customers): Business Metrics Job + enhanced dashboard. Phase 2 (50 customers): anomaly detection, runbook automation.

---

## OPERATIONAL DIALS (Control Signals) — LOCKED

1. **Lead Qualification Minimum %** (slider 0-100%) — filters outreach eligibility
2. **Demo QA Floor (Lighthouse) — LOCKED: 80+**
3. **Demo/Offer Generation Rate** (slider, per day) — throttles batch generation
4. **Dunning Retry Count** (slider 1-5) — LOCKED default 3
5. **Daily Lead Acquisition Target** (slider 0-500/day) — caps Apollo/Hunter spend
6. **Delinquency Grace Period** (slider 3-45 days, default 14)

**CRM Sync Frequency — LOCKED: 5 minutes** (not a dial; infra-locked, Cloud Function, no LLM, ~$0.20/million invocations)
