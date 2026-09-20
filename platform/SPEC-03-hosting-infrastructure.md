---
title: System 03 — Hosting Infrastructure System
purpose: Infrastructure for managed customer websites, cost model, failover strategy, domain management
status: active
owner: c.t.cohen
updated: '2026-09-18'
version: 1.0.0
tier_scope: all
phase: phase_1
spec_name: 03-hosting-infrastructure-system
spec_aliases:
- hosting
- infrastructure
- domains
- deployment
spec_sources:
- chat
spec_authority: authoritative (exported from claude.ai project memory 2026-09-17)
---

> **Overrides (Tyler, 2026-09-18).** This spec is authoritative except where Tyler ruled otherwise (`RECONCILIATION_LOG.md`, `DECISIONS.md`):
> - Hosting split: static sites (demo and live) run on Cloudflare Pages/Workers with R2 storage (not S3); dashboards, API and agents run as a container, on Railway first and Google Cloud Run later. Lightsail and Vercel are not used.
> - Database: Supabase Postgres. Secrets live in the provider's secret store (not AWS Secrets Manager).
> - The 'cannot migrate infrastructure between phases' rule is relaxed: start on Railway and migrate later; containerize from day 1 so the move is a redeploy.
> - After conversion a site runs on our hosting or the client's (Offboard export).


# System 03 — Hosting Infrastructure System

## Purpose

Lock down the hosting platform, per-customer site infrastructure, domain strategy, and cost model to support 1→50,000 customers without migration.

## Contents

- Two-phase hosting strategy (stateless demo vs. persistent managed)
- Hosting provider finalists and decision framework (Lightsail, Vercel, Cloud Run)
- Locked three-layer architecture (Cloudflare + Cloud Run + shared DB)
- Per-customer site infrastructure and provisioning workflow
- Customer admin dashboard and edit workflow
- Domain management (Cloudflare Registrar, two-domain model)
- Cost modeling and scaling economics
- Monitoring and uptime strategy

## Specifications

### SECTION 1: Hosting Architecture & Platform Selection — PHASE 1 vs. PHASE 2

**ARCHITECTURAL PRINCIPLE: Two-Phase Hosting Strategy (Stateless Demo → Persistent Managed)**

Phase 1 (Pre-Conversion) uses stateless, pay-per-use architecture. Phase 2 (Post-Conversion) uses persistent hosting.

**Phase 1: Demo-Site Generation & Delivery (Stateless)**
- Infrastructure: Cloudflare Workers + S3
- Generation: 500-5,000 website designs stored offline in S3 (~$0.10/mo storage cost)
- Delivery: Cloudflare Workers renders HTML on-demand (~$0.0000001/click, cached by CDN)
- Demo lifecycle: 3 months average

**Phase 2: Managed-Site Hosting (Persistent) — THREE FINALISTS**

**Option A: AWS Lightsail (RECOMMENDED PRIMARY)**
- Cost: $5–10/mo flat; Margin (SMB): 92%+; SLA 99.99%
- Best for: Predictability, simplicity, phase 1 launch, zero ops surprises

**Option B: Vercel Pro (IF NEXT.JS-NATIVE)**
- Cost: $22–25/mo/site; Margin (SMB): 90%; SLA 99.99%
- Best for: Next.js/React products, global edge compute

**Option C: Google Cloud Run (BEST MARGINS)**
- Cost: $1–8/mo; Margin (SMB): 97%+; SLA 99.99%
- Best for: Many low-traffic sites, cost efficiency, containerized workloads

**Ruled out:** Fly.io (reliability incidents, unpredictable egress), Railway (bill variance), Render (always-on costs + reliability)

**LOCKED ARCHITECTURE — Three-layer hosting model (PHASE 2):**
1. **Public customer websites:** Static HTML + client-side JS on Cloudflare (free tier pre-onboarding, Pro ~$20/mo at 1000+ domains)
2. **Admin dashboard:** React SPA on Cloud Run backend
3. **Backend API:** Google Cloud Run (stateless, serverless)

**Cost model per customer:** Cloudflare ~$2-5/mo + Cloud Run ~$1-3/mo = **$3-8/mo total COGS → 95%+ gross margin**

**Scaling:** 100 customers ~$500/mo → 1,000 ~$5,000/mo → 10,000 ~$50,000/mo → 100,000 ~$500,000/mo (no migrations needed at any scale)

---

## SECTION 2: Per-Customer Site Infrastructure

**LOCKED DEPLOYMENT PROCESS:**
- Master warehouse: pre-built, locked templates per vertical (plumbing, HVAC, electrical, roofing)
- Site provisioning workflow (trigger: customer pays):
  1. Create customer record, domain, subscription
  2. Assign design template, logo, initial colors, fonts
  3. Design Agent generates static website (~10 sec)
  4. QA Agent validates (Lighthouse, WCAG AA) (~5 sec)
  5. Upload to Cloudflare (~2 sec)
  6. Cloudflare DNS + SSL auto-provision (~30 sec)
  7. Health check (~5 sec)
  8. Send welcome email with dashboard login
  - **Total time to live: ~60 seconds, fully automated**

**Customer admin dashboard:** React SPA on Cloud Run — site preview, edit panel, template selection, lead/form tracking, settings

**Edit workflow:** Customer edits copy → API call → backend regenerates HTML → re-validates (QA) → pushes to Cloudflare → cache invalidates → live within <5 seconds

**Customer-configurable:** Domain, copy/content, feature toggles, form fields, templates (switch/factory reset)
**Cannot customize:** layout, structure, fonts, color palette, logo positioning (locked by design)

---

## SECTION 3: Domain Management

**LOCKED DECISIONS:**

**Domain provider: Cloudflare** — bulk registration (100k+ domains), full API automation, automatic DNS + SSL

**Two-domain model:**
1. **Platform subdomain (automatic):** `[company-name].buildflowsites.com` — every customer gets this by default, zero setup, wildcard SSL
2. **Custom domain (customer brings own):** Customer points nameservers to Cloudflare; BuildFlow automation configures DNS records; SSL via Cloudflare (automatic, free)

---

## SECTION 4: Cost Modeling & Scaling Economics

**LOCKED COST MODEL — Per-customer hosting cost breakdown:**
- Cloudflare (public sites + CDN): $2-5/mo
- Cloud Run (backend API): $1-3/mo
- Database (shared PostgreSQL): $0.50-1/mo allocated per customer
- Ops/monitoring overhead: $0.10-0.50/mo
- **Total COGS per customer: $3-9/mo average**

**Margin analysis at scale:**
- Micro ($149/mo): cost ~$4/mo → **97% gross margin**
- SMB ($249/mo): cost ~$5/mo → **98% gross margin**
- Mid-Market ($399/mo): cost ~$8/mo → **98% gross margin**

**Cost optimization:** No reserved instances needed (already pay-per-use); automatic scaling; Cloudflare bulk discount negotiable at 5,000+ domains (20-30%); no provider migration risk

---

## SECTION 5: Monitoring & Uptime

**Contents to lock down:**
- Uptime monitoring: check frequency, HTTP GET vs. full page load, acceptable latency threshold
- Alerting: downtime thresholds → email/SMS escalation
- Performance monitoring: p50/p95/p99 latency per customer, alert if p95 >3s for >10 min
- Cost monitoring: per-customer spend tracking, alert if >$50/mo (margin risk)
- Capacity utilization: CPU/memory/storage tracking, auto-scale trigger at >85% CPU
