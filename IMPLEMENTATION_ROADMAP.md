---
title: BuildFlow Implementation Roadmap
purpose: SUPERSEDED by RECONCILIATION_LOG.md v2 (written before specs were fully read; do not build from this)
status: deprecated
owner: c.t.cohen
updated: 2026-09-18
---

# Implementation Roadmap: Task 2.4 → 2.7

## SECTION 1: REPO FOLDER STRUCTURE (Task 2.4)

Maps 19 systems to folder layout so each system's spec lives next to its code.

```
BuildFlow/
├── buildflow-specs/              # [STAGING] Spec exports from claude.ai memory
│   ├── index.md
│   ├── business-model-and-constraints.md
│   ├── launch-readiness-plan.md
│   └── systems/
│       ├── 01-business-operations-system.md
│       ├── 02-platform-architecture-system.md
│       ├── 03-hosting-infrastructure-system.md
│       ├── 04-design-quality-system.md
│       ├── 05-feature-system.md
│       ├── 06-demo-to-customer-system.md
│       ├── 07-lead-to-customer-pipeline.md
│       ├── 08-payments-billing-system.md
│       ├── 09-crm-integration-system.md
│       ├── 10-external-integrations-system.md
│       ├── 11-compliance-security-system.md
│       ├── 12-customer-lifecycle-success-system.md
│       ├── 13-observability-system.md
│       ├── 14-customer-support-documentation-system.md
│       ├── 15-customer-feedback-iteration-system.md
│       ├── 16-seo-geo-system.md
│       ├── 17-experimentation-system.md
│       ├── 18-admin-crm-operations-system.md
│       ├── 19-buildflow-website-system.md
│       └── agent-registry.md
│
├── docs/                         # Cross-cutting docs (move from buildflow-specs/ here after 2.4)
│   ├── ARCHITECTURE.md           # Systems 02, 03 combined
│   ├── BUSINESS_MODEL.md         # System 01
│   ├── AGENT_REGISTRY.md         # Agent registry copy (symlink from buildflow-specs/)
│   ├── LAUNCH_READINESS.md       # Copy of launch-readiness-plan
│   └── buildflow-specs/          # Keep for reference during implementation
│
├── design/                       # System 04: Design & Quality System
│   ├── SPEC.md                   # System 04 spec file (moved here)
│   ├── templates/
│   │   ├── micro/                # Micro tier templates
│   │   │   ├── base.astro
│   │   │   └── components/
│   │   └── smb/                  # SMB tier templates (current system)
│   │       ├── base.astro
│   │       └── components/
│   ├── tokens/                   # Design tokens (colors, fonts, spacing)
│   │   ├── micro-default.json
│   │   ├── smb-default.json
│   │   └── 10-styling-profiles.json
│   ├── qa/                       # QA gates (Lighthouse, axe)
│   │   └── qa-rules.json
│   └── discovery/                # Design Discovery Agent
│       └── extractor.py
│
├── agents/                       # Agent Registry implementations (System 02, all)
│   ├── README.md                 # Cross-agent guidelines
│   ├── design/                   # Agent #1, #2, #3
│   │   ├── design_agent.py
│   │   ├── design_discovery_agent.py
│   │   ├── design_qa_agent.py
│   │   └── eval_suite.py
│   ├── lead/                     # Agent #4, #5, #7
│   │   ├── lead_scoring_agent.py
│   │   ├── lead_lookup_agent.py
│   │   ├── outreach_copy_agent.py
│   │   └── eval_suite.py
│   ├── crm/                      # Agent #8
│   │   ├── crm_sync_agent.py
│   │   └── eval_suite.py
│   ├── dunning/                  # Agent #9 (Phase 1.5)
│   │   └── dunning_agent.py
│   ├── support/                  # Agents #10, #11 (Phase 2)
│   │   ├── support_triage_agent.py
│   │   └── feedback_triage_agent.py
│   └── lifecycle/                # Agents #12–15 (Phase 2+)
│       ├── lifecycle_agent.py
│       ├── seo_agent.py
│       ├── review_sync_agent.py
│       └── experimentation_agent.py
│
├── app/                          # System 02: Platform Architecture (Astro app)
│   ├── SPEC.md                   # System 02 + System 03 (hosting)
│   ├── src/
│   │   ├── components/           # Astro components
│   │   ├── pages/
│   │   │   ├── demo/[prospect-id]/index.astro  # Demo rendering
│   │   │   ├── app/              # Customer dashboard (System 02)
│   │   │   └── admin/            # Admin dashboard (System 18)
│   │   ├── layouts/
│   │   └── lib/
│   │       ├── auth.ts           # Auth system (System 11)
│   │       ├── crm-sync.ts       # CRM integration (System 09)
│   │       └── stripe-webhook.ts # Payment processing (System 08)
│   ├── scripts/
│   │   ├── db-init.sql           # Schema initialization (System 02)
│   │   └── migrate.sql
│   └── tests/                    # Integration tests
│
├── billing/                      # System 08: Payments & Billing
│   ├── SPEC.md                   # System 08 spec file
│   ├── stripe/
│   │   ├── products.ts           # Micro/SMB products + pricing
│   │   ├── webhook-handler.ts    # Payment confirmation → site deploy
│   │   └── client.ts
│   ├── dunning/
│   │   ├── state-machine.ts      # 90-day dunning lifecycle
│   │   └── dunning_agent.py      # Agent #9 (Phase 1.5)
│   └── mrr-tracking.ts           # Revenue calculations
│
├── crm/                          # System 09, 10: CRM Integration
│   ├── SPEC.md                   # Systems 09, 10 spec files
│   ├── integrations/
│   │   ├── servicetitan/         # CRM #1
│   │   │   ├── auth.ts
│   │   │   ├── sync.ts
│   │   │   └── field-mapping.json
│   │   ├── jobber/               # CRM #2
│   │   ├── housecall-pro/        # CRM #3
│   │   ├── hubspot/              # CRM #4
│   │   └── successware/          # CRM #5
│   ├── sync-agent/
│   │   ├── crm_sync_agent.py     # Agent #8
│   │   ├── conflict-resolver.ts  # System 09 Section 5B
│   │   └── retry-logic.ts
│   └── tests/
│
├── website/                      # System 19: BuildFlow Public Website
│   ├── SPEC.md                   # System 19 spec file
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index.astro       # Home
│   │   │   ├── features.astro
│   │   │   ├── pricing.astro
│   │   │   ├── demo.astro
│   │   │   ├── blog/
│   │   │   ├── docs/
│   │   │   └── about.astro
│   │   └── components/
│   └── content/                  # Blog posts, docs
│       ├── blog/
│       │   ├── post-1.md
│       │   ├── post-2.md
│       │   └── post-3.md
│       └── docs/
│
├── auth/                         # System 11: Compliance & Security
│   ├── SPEC.md                   # System 11 spec file
│   ├── google-oauth/
│   │   ├── callback.ts
│   │   └── config.ts
│   ├── email-password/
│   │   ├── login.ts
│   │   ├── register.ts
│   │   └── password-reset.ts
│   ├── encryption/
│   │   └── crypto.ts
│   └── privacy/
│       ├── PRIVACY_POLICY.md     # GDPR/CCPA docs
│       └── DATA_RETENTION.md
│
├── observability/                # System 13: Observability (launch baseline)
│   ├── SPEC.md                   # System 13 spec file
│   ├── dashboards/
│   │   ├── admin-dashboard/      # Real-time ops (System 18)
│   │   └── agent-insights/       # Agent run logs
│   ├── monitoring/
│   │   ├── agent-runs.ts         # Track each agent execution
│   │   ├── error-tracking.ts
│   │   └── latency-monitoring.ts
│   └── alerts/
│       └── alert-rules.ts
│
├── compliance/                   # System 11: Security & Compliance
│   ├── SPEC.md
│   ├── audit-logs/               # System 13 audit trail
│   ├── data-retention/           # 90-day log retention
│   └── incident-response.md
│
├── lib/                          # Shared utilities
│   ├── api-clients/              # API wrappers (Apollo, Hunter, Google, etc)
│   ├── database/                 # DB connection + queries
│   ├── types.ts                  # Shared TypeScript types
│   └── utils.ts
│
├── operations/                   # Keep existing operational docs
│   ├── SITE-BUILD-WORKFLOW.md
│   ├── processes/
│   └── logs/
│
├── metrics/                      # Keep existing tracking
│   ├── token-log.md
│   └── EXECUTION_TRACKER.md
│
├── RECONCILIATION_LOG.md         # Decisions from Task 2.2, 2.3
├── IMPLEMENTATION_ROADMAP.md     # This file (Task 2.4, 2.5, 2.7)
└── README.md                     # Updated with folder structure

```

---

## SECTION 2: IMPLEMENTATION TASK LIST (Task 2.5)

**Derived from the 8-step launch plan + 19 systems.**

### **PHASE 0: Preparation** (Prerequisite — completed)
- ✅ Specs extracted and reconciled
- ✅ Folder structure approved

### **PHASE 1: CRITICAL PATH — Design Engine** (Step 1 → Step 2)

**Task 1.1: Design Agent (#1) — Workflow**
- [ ] Read System 04 + Agent Registry (#1)
- [ ] Build prompt template: vertical → services → colors → design token assignment
- [ ] Implement prompt chaining: template selection → personalization → render static HTML
- [ ] Wire to Claude API (Strong model: Opus)
- [ ] Test: generate 10 sites (1 per vertical, 2 per styling profile)
- [ ] Build eval suite: 15–20 test cases (obvious, edge, failure)
- [ ] Cost tracking: log tokens per render

**Task 1.2: Design Discovery Agent (#2) — Workflow**
- [ ] Read System 04 Section 5 + Agent Registry (#2)
- [ ] Implement web crawl (Axios/Cheerio) → extract brand elements
- [ ] Parse: logo URLs, colors, fonts, tone, layout patterns
- [ ] Output: JSON brand profile
- [ ] Fallback: manual intake form if crawl fails
- [ ] Build eval suite: 15–20 test cases

**Task 1.3: Design QA Agent (#3) — Evaluator-Optimizer Loop**
- [ ] Read System 04 Section 2–3 + Agent Registry (#3)
- [ ] Wire Lighthouse (PageSpeed Insights API)
- [ ] Wire axe accessibility checker
- [ ] Parse failures → feed back to Design Agent (#1) with corrective prompt
- [ ] Max 2 retries before escalation to Tyler (System 18 queue)
- [ ] Track: pass rate by failure category, false-pass rate
- [ ] Build eval suite: 15–20 test cases

**Task 1.4: Design System (Templates & Tokens)**
- [ ] Audit current SMB design system
- [ ] Extract as base template
- [ ] Build Micro tier template (simpler, 6–8 components)
- [ ] Build 3 styling profiles (default + 2 variants)
- [ ] Define design token JSON: colors, fonts, spacing
- [ ] Implement customization sliders: color, font-size, spacing scale
- [ ] Test: representative sample (Micro × 3 profiles, SMB × 3 profiles)

**Task 1.5: Integrate Design Agents with App**
- [ ] Update app/ to call Design Agent on demo generation
- [ ] Update app/ to call Design Discovery Agent on customer signup (optional brand crawl)
- [ ] Update app/ to call Design QA Agent before Cloudflare deployment
- [ ] Wire Cloudflare upload: validated HTML → demo URL
- [ ] Test: end-to-end demo generation <10 seconds

---

### **PHASE 2: Business Engine** (Step 3 → Step 4)

**Task 2.1: Lead Lookup Agent (#5) — Fan-out**
- [ ] Read System 07 + Agent Registry (#5)
- [ ] Wire Apollo API client (query by company name, location, vertical)
- [ ] Wire Hunter.io API client (email enrichment)
- [ ] Implement fan-out: query Apollo + Hunter in parallel, merge results
- [ ] Confidence scoring: prioritize API with more complete data
- [ ] Fallback: if all sources fail, flag for manual Tyler lookup
- [ ] Build eval suite: 15–20 test cases

**Task 2.2: Lead Scoring Agent (#4) — Routing**
- [ ] Read System 07 + Agent Registry (#4)
- [ ] Implement scoring formula: website quality + vertical fit + size + location fit
- [ ] LLM layer: nuanced signals (e.g., "active Google ads = higher intent")
- [ ] Output: score 0–100, ICP match %, reasoning
- [ ] Routing: high-score leads → immediate outreach queue, low-score → backlog
- [ ] Track: score-to-conversion calibration **PER VERTICAL** (critical per 2026 benchmarks)
- [ ] Build eval suite: 15–20 test cases

**Task 2.3: Outreach/Copy Agent (#7) — Prompt Chaining**
- [ ] Read System 07 + Agent Registry (#7)
- [ ] Implement personalization: lead data → hook extraction (web signal, vertical insight)
- [ ] Generate personalized email copy (not robotic, conversational)
- [ ] Build for both outbound (standard) and photo-intake (hooked) paths
- [ ] A/B test variants (Phase 2 via System 17)
- [ ] Build eval suite: 15–20 test cases

**Task 2.4: Outbound Campaign Workflow (Not an Agent)**
- [ ] Read System 07 Section 3 (Outbound Sequencing)
- [ ] Implement 5-touch sequence: email Day 0, 3, 7, 14, 21
- [ ] Wire SendGrid API: send, open tracking, click tracking
- [ ] Webhook handler: track opens/clicks → demo view intent signals
- [ ] Retry on bounce: retry 24h later if email fails
- [ ] Log campaign metrics: open rate, click rate, response rate

**Task 2.5: CRM Sync Agent (#8) — Pipeline + Evaluator**
- [ ] Read System 09 Section 5B, System 10, Agent Registry (#8)
- [ ] Implement for ServiceTitan first (Task 3.5 adds others)
- [ ] Field mapping: BuildFlow Lead → ServiceTitan Lead schema
- [ ] Implement conflict resolver: if lead exists in CRM, use System 09's "4 signals" logic
- [ ] Retry logic: temporary fail (retry 5m ×6), auth fail (alert customer), rate limit (batch), max 3 failures → Tyler alert
- [ ] Sync success rate target: >95%, <5% manual escalation
- [ ] Build eval suite: 15–20 test cases

**Task 2.6: Stripe Integration (Billing Core)**
- [ ] Read System 08 + business-model-and-constraints.md
- [ ] Create Stripe products: Micro Monthly, Micro Annual, SMB Monthly, SMB Annual
- [ ] Set pricing: Micro $149/mo or $1,490/yr, SMB $249/mo or $2,490/yr
- [ ] Tax configuration: automatically calculated per customer location (Stripe Tax)
- [ ] Wire checkout flow: customer selects tier → payment → confirmation
- [ ] Webhook handler: payment confirmed → trigger site deployment (Task 2.7)
- [ ] MRR tracking: sum active subscriptions per month

**Task 2.7: Post-Payment Site Deployment Workflow**
- [ ] Read System 06 Section 5
- [ ] Trigger on Stripe webhook: payment confirmed
- [ ] Create customer record in database (System 02)
- [ ] Call Design Agent (#1) with customer branding (4th call site)
- [ ] QA gate (Design QA Agent)
- [ ] Upload to Cloudflare Workers/Pages
- [ ] DNS provisioning: platform subdomain or custom domain
- [ ] SSL auto-provisioning (Cloudflare)
- [ ] Send welcome email with dashboard login
- [ ] Timeline target: <60 seconds from payment to live

---

### **PHASE 3: Platform** (Step 5 → Step 6)

**Task 3.1: Customer Dashboard (app.buildflow.com)**
- [ ] Read System 02, System 06 Section 5, System 05 feature matrix
- [ ] Implement in Astro (`app/src/pages/app/`)
- [ ] Micro features: lead inbox only (view forms, export CSV, email notifications)
- [ ] SMB features: + Notes, simple Pipeline (new/contacted/converted), editable content
- [ ] First-login flow: dashboard tour, onboarding checklist
- [ ] Auth: Google OAuth + email/password (System 11)
- [ ] Row-level security: ensure customer_id isolation (System 11 Section 3)
- [ ] Design: minimal, intuitive UX (not data-dense)
- [ ] Test: responsive design, accessibility (WCAG 2.1 AA)

**Task 3.2: Admin Dashboard (admin.buildflow.com)**
- [ ] Read System 18 Section 8, System 13
- [ ] Implement in Astro (`app/src/pages/admin/`)
- [ ] Sections: KPI dashboard (MRR, churn), customer list, agent logs, revenue, escalations
- [ ] Real-time data: agent run logs (System 13)
- [ ] Auth: Tyler-only access (System 11)
- [ ] Design: data-dense, alerts-focused, queryable
- [ ] Export: PDF/CSV reports
- [ ] Test: performance with large datasets

**Task 3.3: BuildFlow Marketing Website (buildflow.io)**
- [ ] Read System 19
- [ ] Sections needed: Home, Features, Pricing, Demo (form + live preview), Blog (3 posts), Docs, About
- [ ] Design: brand-aligned, professional services tone
- [ ] Pricing: show all 3 tiers (with Mid-Market noted as "Enterprise, inquire")
- [ ] Demo section: "See what your website will look like" → form → generate live demo
- [ ] Blog: 3 starter posts (e.g., "Why SMBs Need Websites", "CRM Integration Guide", "Review Management Best Practices")
- [ ] Docs: getting started, feature overview, pricing comparison
- [ ] Test: SEO basics (meta tags, sitemap), Core Web Vitals, mobile responsive
- [ ] Deploy to buildflow.com (via Cloudflare)

**Task 3.4: Feature Flags & Tranche Gating**
- [ ] Read System 05 Section 1
- [ ] Implement in app/ code: if(customer.tranche === 'Micro') { hide Pipeline, hide Images }
- [ ] No separate codebases — one app, conditional rendering
- [ ] Test: all three tranches (though Mid-Market disabled in signup)

---

### **PHASE 4: Extend to Phase 1 Scale** (Step 3 cont'd)

**Task 4.1: Add 4 More CRMs (ServiceTitan already done in 2.5)**
- [ ] Task: Jobber integration (field mapping + sync)
- [ ] Task: Housecall Pro integration
- [ ] Task: HubSpot integration
- [ ] Task: Successware integration
- [ ] Test: cross-CRM sync (same lead in two CRMs)

**Task 4.2: Lead Discovery Automation (Batch Lead Lookup)**
- [ ] Read System 07 Section 1
- [ ] Build batch query runner: "find all HVAC contractors in Phoenix, <10 employees"
- [ ] Call Lead Lookup Agent (#5) in batch mode (1000s of leads)
- [ ] Store in LeadWarehouse table (System 02)
- [ ] Dedup: check if lead exists in warehouse by (company_name, location, phone)
- [ ] Cron trigger: daily 7am (System 02 Section 3)

**Task 4.3: Review Sync Workflow**
- [ ] Read System 05, System 12
- [ ] Wire Google Places API: fetch latest reviews for customer's business
- [ ] Wire Yelp API: fetch reviews
- [ ] Cron trigger: daily 6am (System 02)
- [ ] Regenerate customer site with fresh reviews
- [ ] Cloudflare redeploy
- [ ] Monitoring: sync success rate, review count delta

**Task 4.4: Email Notification System**
- [ ] Read System 06 Section 5, System 12
- [ ] Wire SendGrid for transactional emails
- [ ] Templates: Welcome, Day 1 screenshot, Day 7 analytics, Day 30 tips, Payment reminder, Churn warning
- [ ] Schedule: Day 1 (5 min post-purchase), Day 7 (analytics), Day 30 (if no leads)
- [ ] Test: email delivery, link tracking

---

### **PHASE 5: Testing & Launch** (Step 7 → Step 8)

**Task 5.1: End-to-End Funnel Test**
- [ ] Dry-run complete flow: lead discovery → outreach → demo → conversion → CRM sync
- [ ] Test both checkout paths: monthly + annual
- [ ] Verify: demo generation <10s, post-payment deployment <60s, CRM sync <5 min
- [ ] Check: customer sees site live, can log into dashboard, can edit content

**Task 5.2: Agent Eval Suites**
- [ ] Run all agent eval suites (15–20 test cases each × 15 agents launched)
- [ ] Pass rate target: >90% on launch
- [ ] Failure modes: document and fix

**Task 5.3: Dunning Lifecycle (Manual, Phase 1.5)**
- [ ] Document manual dunning process: Tyler receives failed payment → sends Tier 1 email → waits 3 days → Tier 2 if still failed
- [ ] Automate: Stripe webhook → notify Tyler of failed payment
- [ ] Template: friendly retry email, payment update form link
- [ ] NOTE: Dunning Agent (#9) is Phase 1.5 automation

**Task 5.4: Security & Compliance Audit**
- [ ] WCAG 2.1 AA on generated sites (Design QA Agent)
- [ ] Data isolation test: Customer A cannot see Customer B's data (System 11 Section 4)
- [ ] Auth flow: test login, password reset, Google OAuth
- [ ] Encryption: verify CRM credentials encrypted at rest
- [ ] Privacy: docs written (GDPR, CCPA, data retention)
- [ ] Lawyer review: before first payment processed

**Task 5.5: Load Testing**
- [ ] Generate 100+ demos concurrently
- [ ] Verify: Cloudflare + app infrastructure holds
- [ ] Latency: demo generation <10s under load

**Task 5.6: Soft Launch**
- [ ] 5–10 real prospects (not team members)
- [ ] Monitor: conversion rate, support tickets, agent failures
- [ ] Gate: if all green, proceed to full outbound

**Task 5.7: Onboarding Videos** (Step 7)
- [ ] Script: dashboard walkthrough (System 06), CRM connection (System 09)
- [ ] Record: 2–3 min each
- [ ] Host: embed in welcome email + Help Center (System 14)

---

## SECTION 3: EXTERNAL APIs & CREDENTIALS CHECKLIST (Task 2.7 — Research-Driven Gap-Filling)

**Complete list of external APIs, accounts, and credentials needed for launch.**

### **Authentication & Identity** (System 11)
- [ ] **Google OAuth**
  - Credential: OAuth 2.0 Client ID + Secret
  - Use: customer login (app.buildflow.com)
  - Setup: Google Cloud Console → create project → enable Google+ API → generate credentials
  - Cost: free

- [ ] **Email/Password Auth (Built-in)**
  - Credential: None (build your own)
  - Use: customer login (alternative to Google)
  - Implementation: hash passwords (bcrypt), store in database
  - Cost: free

### **Payments & Billing** (System 08)
- [ ] **Stripe**
  - Credentials: API Key (Secret), Publishable Key, Webhook Signing Secret
  - Use: checkout, subscription management, dunning lifecycle
  - Setup: stripe.com → create account → API keys dashboard
  - Products needed: 
    - Micro Monthly ($149/mo)
    - Micro Annual ($1,490/yr)
    - SMB Monthly ($249/mo)
    - SMB Annual ($2,490/yr)
  - Webhooks: payment_intent.succeeded, charge.failed, customer.subscription.updated
  - Cost: 2.9% + $0.30 per transaction

### **Email & SMS** (System 07, System 08)
- [ ] **SendGrid**
  - Credentials: API Key
  - Use: transactional emails (welcome, dunning, reminders), campaign emails (outreach)
  - Setup: sendgrid.com → create account → Settings → API Keys → create key
  - Email templates needed:
    - Welcome (first login)
    - Day 1 screenshot
    - Day 7 analytics
    - Day 30 tips
    - Payment failed (Tier 1)
    - Payment reminder (Tier 2)
    - Churn warning (no leads 30 days)
  - Webhooks: bounce, click, open (for outreach tracking)
  - Cost: free tier 100 emails/day, paid ~$20-40/mo for outreach volume

- [ ] **Twilio** (Phase 1.5+)
  - Credentials: Account SID, Auth Token
  - Use: SMS alerts (payment failed, new lead, etc.)
  - Setup: twilio.com → create account → phone number → API keys
  - Cost: ~$0.01 per SMS

### **Lead Discovery & Enrichment** (System 07)
- [ ] **Apollo API**
  - Credentials: API Key
  - Use: lead discovery (query by vertical, location, size), email enrichment
  - Setup: apollo.io → sign up → API docs → generate API key
  - Rate limit: depends on plan (e.g., 1000 requests/month on starter)
  - Cost: ~$200-500/mo depending on volume

- [ ] **Hunter.io**
  - Credentials: API Key
  - Use: lead enrichment (email verification), domain discovery
  - Setup: hunter.io → create account → API docs → generate key
  - Rate limit: plan-dependent
  - Cost: ~$50-200/mo depending on volume

- [ ] **Google Places API**
  - Credentials: API Key (restrict to Places API)
  - Use: lead discovery (search "plumbing near Phoenix"), reviews
  - Setup: Google Cloud Console → enable Places API → create API key
  - Quota: 1000 requests/day free, then $7 per 1000 requests
  - Cost: ~$5-50/mo for discovery volume

- [ ] **Google Business Profile API** (System 12)
  - Credentials: OAuth 2.0 credentials (same as login)
  - Use: review aggregation, business info sync
  - Setup: Google Cloud Console → enable API
  - Cost: free

- [ ] **Yelp API** (System 12)
  - Credentials: API Key
  - Use: review aggregation
  - Setup: yelp.com/developers → create app → API key
  - Rate limit: 5000 calls/day
  - Cost: free

### **CRM Integrations** (System 09, 10)
**Phase 1 Launch (Required):**
- [ ] **ServiceTitan API**
  - Credentials: API Key + Account ID
  - Use: sync leads → customer ServiceTitan account
  - Setup: servicetitan.com → Settings → API → generate key
  - Field mapping: Lead → Customer/Lead (per ServiceTitan schema)
  - Cost: included in ServiceTitan subscription (~$500+/mo for customers)

**Phase 1 (Required for SMB):**
- [ ] **Jobber API**
  - Credentials: OAuth token or API key
  - Use: sync leads, manage pipeline
  - Setup: jobber.com → Settings → API
  - Cost: included in Jobber subscription

- [ ] **Housecall Pro API**
  - Credentials: API Key
  - Use: sync leads, customer integration
  - Setup: housecallpro.com → Account → API
  - Cost: included in subscription

- [ ] **HubSpot API**
  - Credentials: Private App Key + OAuth token (if using OAuth)
  - Use: sync leads, CRM data
  - Setup: hubspot.com → Settings → Integrations → Private Apps → create app
  - Cost: free (HubSpot starter plan included)

- [ ] **Successware API**
  - Credentials: API Key + Account ID
  - Use: sync leads
  - Setup: successware.com → API documentation
  - Cost: included in subscription

### **Hosting & Infrastructure** (System 03)
- [ ] **Cloudflare**
  - Credentials: API Key (for programmatic domain/DNS setup)
  - Use: demo site hosting (Workers/Pages), domain management, DNS, SSL
  - Setup: cloudflare.com → create account → add domain → API Tokens → create token for DNS/Worker scope
  - Features needed: Workers/Pages (free), DNS (included), SSL (included)
  - Cost: free tier sufficient for launch

- [ ] **Railway** (Current choice per docs)
  - Credentials: API Key
  - Use: app hosting (Astro)
  - Setup: railway.app → create account → project → API key
  - Cost: ~$5-20/mo depending on usage

- [ ] **Supabase** (Future DB, Phase 1 optional)
  - Credentials: API Key, Connection string
  - Use: PostgreSQL database (if upgraded from file-based)
  - Setup: supabase.io → create project → API settings
  - Cost: free tier ~$0/mo, paid ~$25+/mo as scale grows

### **Analytics & Monitoring** (System 13)
- [ ] **Sentry** (Optional, Phase 1.5)
  - Credentials: DSN (Data Source Name)
  - Use: error tracking, performance monitoring
  - Setup: sentry.io → create project → DSN
  - Cost: free tier for <10k events/mo

- [ ] **LogRocket** (Optional, Phase 2)
  - Credentials: Project ID
  - Use: session replay, customer debugging
  - Setup: logrocket.com → create project
  - Cost: ~$100+/mo

### **Admin Tools**
- [ ] **Stripe Dashboard**
  - Access: Tyler's email
  - Use: manual payment overrides, customer account management, dunning control
  - Setup: stripe.com → login → Customers/Subscriptions dashboards

- [ ] **SendGrid Dashboard**
  - Access: Tyler's email
  - Use: email template management, campaign tracking
  - Setup: sendgrid.com → login → Templates/Suppressions

---

## SECTION 4: CREDENTIALS SETUP CHECKLIST

**Copy this, fill in as you set up each service, and share with Claude Code.**

```
### Authentication & Identity
- [ ] Google OAuth Client ID: ____________________
- [ ] Google OAuth Client Secret: ____________________

### Payments
- [ ] Stripe API Secret Key: ____________________
- [ ] Stripe Publishable Key: ____________________
- [ ] Stripe Webhook Signing Secret: ____________________

### Email & Communication
- [ ] SendGrid API Key: ____________________
- [ ] Twilio Account SID: ____________________
- [ ] Twilio Auth Token: ____________________

### Lead Discovery
- [ ] Apollo API Key: ____________________
- [ ] Hunter.io API Key: ____________________
- [ ] Google Places API Key: ____________________
- [ ] Yelp API Key: ____________________

### CRM Integrations
- [ ] ServiceTitan API Key: ____________________
- [ ] Jobber OAuth Token: ____________________
- [ ] Housecall Pro API Key: ____________________
- [ ] HubSpot Private App Key: ____________________
- [ ] Successware API Key: ____________________

### Hosting & Infrastructure
- [ ] Cloudflare API Token: ____________________
- [ ] Railway API Key: ____________________
- [ ] Supabase API Key: ____________________
- [ ] Supabase Connection String: ____________________

### Admin Access
- [ ] Stripe Dashboard Login: ____________________
- [ ] SendGrid Dashboard Login: ____________________
- [ ] Cloudflare Dashboard Login: ____________________
- [ ] Railway Dashboard Login: ____________________

### Domain & Email
- [ ] BuildFlow.com Domain Registrar Login: ____________________
- [ ] BuildFlow.com DNS Records Set Up: [ ] Yes / [ ] No
- [ ] Email: tyler@buildflow.com Set Up: [ ] Yes / [ ] No
- [ ] Email: support@buildflow.com Set Up: [ ] Yes / [ ] No
```

---

## SECTION 5: NEXT STEPS

1. **Set up external APIs** (parallel work, ~4 hours total):
   - Google OAuth
   - Stripe (products, webhooks)
   - SendGrid
   - Apollo + Hunter
   - CRM APIs (start with ServiceTitan)
   - Cloudflare token

2. **Create database schema** (from System 02, ~2 hours):
   - Customer, Website, FormSubmission, CRMIntegration, Subscription, Review
   - Admin: AgentRun, PaymentTransaction
   - Migrations

3. **Begin Phase 1 agent builds** (start with Design Agent):
   - Read System 04 + Agent Registry
   - Build prompt, test with 10 renders
   - Build eval suite

4. **Share credentials** when ready (encrypted or via secure channel).

