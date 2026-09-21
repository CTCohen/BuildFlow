---
title: Lane H Dashboards
purpose: Brief for the session that builds the customer dashboard, admin web and the sandbox dashboard shown in demos
status: active
owner: c.t.cohen
updated: '2026-09-20'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Lane H: Dashboards (`platform/dashboards/`)

**Starts when:** Track A's schema exists and Track B's output format is stable (about W3-W4).
**Read first:** `platform/SPEC-02-platform-architecture.md`, `platform/SPEC-18-admin-crm-operations.md`, `specs/05-feature-system.md`, `docs/TIER-FEATURE-MATRIX.md`, `platform/CONTRACT.md`, `operations/lanes/README.md`.

## Tasks
1. **Customer dashboard** (one dashboard, tier flags): lead inbox, CSV export, email alerts; SMB adds notes, simple pipeline, image uploads, CRM config UI; Micro edits text and images. English only.
2. **Sandbox dashboard** for demos: read-only, sample data, per tier, embedded in the demo page.
3. **Admin web** for Tyler: KPIs (MRR, churn), customer list, agent logs, revenue, escalations, alerts; Google login with 2FA.
4. Row-level isolation checks on every query; accessibility built in (WCAG 2.1 AA).
5. Evals and `platform/dashboards/TASKS.md`.

**Done means:** a demo link shows a site plus its tier's sandbox dashboard; a customer sees only their own data (show the test). **Needs from Tyler:** UX review at W6.
**Out of scope:** Mid-Market features, mobile apps.
