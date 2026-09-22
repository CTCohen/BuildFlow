---
title: System 06 — Demo-to-Customer System
purpose: Demo generation, delivery, tracking, conversion, and post-purchase fulfillment
status: active
owner: c.t.cohen
updated: '2026-09-18'
version: 1.0.0
tier_scope: all
phase: phase_1
spec_name: 06-demo-to-customer-system
spec_aliases:
- demo lifecycle
- conversion workflow
- demo delivery
spec_sources:
- chat
spec_authority: authoritative (exported from claude.ai project memory 2026-09-17)
---

> **Overrides (Tyler, 2026-09-18).** This spec is authoritative except where Tyler ruled otherwise (`RECONCILIATION_LOG.md`, `DECISIONS.md`):
> - The demo shows the built site **and a sandbox of the prospect's tier dashboard** (sample leads; notes and pipeline for SMB, lead inbox only for Micro).
> - Demo live window is 90 days (not 30), with the day-3 and day-7 resend cadence unchanged.
> - Tier is prescriptive: pre-selected at checkout, no choice screen. Static files live on Cloudflare R2/Workers.


# System 06 — Demo-to-Customer System

## Purpose

Lock down the complete flow from demo generation through conversion to payment and site deployment.

## Contents

- Demo generation, rendering, and storage architecture
- Demo delivery, tracking, and analytics
- Conversion workflow (self-serve and high-touch paths)
- Demo lifecycle and expiration
- Post-conversion fulfillment automation
- Onboarding and churn prevention

## Specifications

### SECTION 1: Demo Generation & Storage

**LOCKED ARCHITECTURE:**
- Trigger: when Outbound Campaign Agent sends prospect email (eager generation)
- Rendering: Design Agent generates full static HTML website (~50KB, ~10 sec), QA validated (Lighthouse + axe) before upload
- Storage: Cloudflare Workers/Pages (not S3); Demo URL: `[domain TBD under Fornax name]/demo/[prospect-id]`
- Demo-to-live transition: same static files (regenerated with customer branding), same Cloudflare infra, <1 min from payment to live
- Cost: $0 per demo (Cloudflare free tier / Pro at scale)

---

## SECTION 2: Demo Delivery, Tracking & Analytics

**Contents:**
- Demo URL format: `[domain TBD under Fornax name]/demo/[prospect-id]/[unique-token]` (non-guessable), no login required
- Tracking events: demo viewed (timestamp, device, referrer), time on site, scroll depth (25/50/75/100%), section clicks, form interaction
- Analytics measured: view count, view duration, scroll depth, form engagement, conversion rate, device type, traffic source
- Prospect feedback: "Interested?" CTA leads to conversion form
- Performance: Core Web Vitals monitored; alert if page load >3s or Lighthouse <85

---

## SECTION 3: Conversion Workflow (Click → Payment → Deployment)

**LOCKED — Dual conversion paths:**

1. **Self-serve path:** Demo → "Get Your Website" CTA → pricing page → select tier → Stripe checkout. Duration <5 min, no Tyler touch.
2. **High-touch path:** Demo → "Contact us" form → Tyler reviews manually → sends personalized quote → customer pays. Duration 1-3 days.

**Signup flow (self-serve):** business name, email, password, domain choice (subdomain default or custom), CRM selection (optional) → Stripe checkout. Total flow <3 minutes.

**Post-payment fulfillment workflow:**
1. Create customer record
2. Deploy customer's website (provision hosting, DNS, SSL)
3. Create CRM account (if applicable)
4. Send welcome email with login details
5. Notify customer site is live
- **Timeline: <5 minutes from payment to live site**

**Backup flow:** if automated conversion fails (payment fails), manual Tyler intervention via support channel.

---

## SECTION 4: Demo Lifecycle & Expiration

**Demo retention policy:** expires after 30 days; archived after 90 days (deleted from S3, metadata kept forever)

**Expired demo experience:** "This demo has expired" message + "request updated demo" option → triggers regeneration

**Demo re-sends:** not opened after 3 days → resend same link; not opened after 7 days → send updated/regenerated demo

**Customer site previews (post-purchase):** customer can generate shareable preview links for their own clients

---

## SECTION 5: Fulfillment & Post-Conversion Setup

**LOCKED AUTOMATION:**

**Site provisioning (trigger: Stripe webhook payment confirmed):**
1. Create customer record
2. Site Regeneration Agent (Cloud Run): fetch template, generate personalized HTML, QA validate, upload to Cloudflare (retry/escalate on QA fail)
3. Domain setup: platform subdomain auto-provisioned; custom domain via Cloudflare DNS automation; SSL auto-provisioned
4. CRM integration setup (if auth provided at signup): store credentials encrypted, test connection, enable hourly sync
5. Send welcome email + dashboard access
6. Mark site "live" (analytics tracking enabled)
- **Total time: <60 seconds from payment to live site**

**Customer's first login:** welcome email → dashboard → onboarding checklist (customize name/hours, add photos, add services, set up CRM) → guided tour → quick links (view site, help center, support)

**Customer communication cadence:** Welcome (5 min post-payment) → Day 1 site screenshot → Day 7 analytics recap → Day 30 tips/feature highlights

**Churn prevention:** no login in 7 days → "need help getting started?" email; 0 form submissions after 30 days → offer free 1-on-1 onboarding call; delinquent payment → reminder + site pause notice

---

## SECTION 6: Agent Cross-Reference

**Design Agent (Agent Registry #1)** generates the demo website in Section 1 — one of THREE (now four, including System 12's edit-trigger) call sites for the same agent (System 4 direct, this system's demo flow, System 18 photo-intake auto-build). All must use the identical template warehouse/logic; no forked implementation.

**Design QA Agent (Agent Registry #3)** gates Section 1's upload-to-Cloudflare step — same evaluator-optimizer loop defined in System 4 Section 3.

**Outreach/Copy Agent (Agent Registry #7)** is the source of any personalized copy on the demo page; the outbound email that drives traffic to the demo is System 7's responsibility.

Full agent detail: `agents/AGENT_REGISTRY.md`
