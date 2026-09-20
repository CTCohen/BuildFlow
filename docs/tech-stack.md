---
title: Tech Stack
purpose: Documentation for tech-stack.md
status: draft
owner: c.t.cohen
updated: '2026-09-18'
tier_scope: all
phase: operational
---

# Tech stack

> Rebuilt 2026-09-18 from Systems 02, 03, 08, 11, 13 and Tyler's rulings. One codebase for all sites; solo operator; cheap to run.
> Hosting split and database rulings: `RECONCILIATION_LOG.md` D10-D14.

## Locked
| Layer | Choice | Notes |
|---|---|---|
| Site rendering | Existing **Astro** design system, one client per build, static output | Design Agent supplies the client data file; QA gate before anything ships |
| Site hosting (demo and live) | **Cloudflare Pages/Workers + R2** | Free tier pre-conversion; scales to thousands of demos at near-zero cost |
| Domains and DNS | **Cloudflare** (Registrar, DNS, automatic SSL) | Customer subdomains `[company].buildflowsites.com`; custom domains via Cloudflare DNS |
| Database | **Supabase Postgres**, row-level security on `customer_id` | Admin tables in a separate schema and role |
| Auth | **Supabase Auth**: Google and email/password (12+ characters), optional TOTP | Tyler's admin login: Google OAuth plus 2FA |
| Backend, dashboards, agents | Containerized service: **Railway now, Google Cloud Run later** | Docker from day 1 so the move is a redeploy |
| Scheduling | Cloud Scheduler / cron; Railway cron until then | System 13 jobs, CRM sync every 5 min, daily review sync |
| Payments | **Stripe** (monthly and annual Prices, webhooks) | Versioned price IDs, `launch_cohort` |
| Email | **SendGrid** with a separate warmed sending domain | One-click unsubscribe; email-only outreach at launch |
| CRM | **HubSpot** first (one-way push), then Jobber, ServiceTitan, Housecall Pro, Successware | Custom connectors, encrypted tokens |
| Monitoring | Homegrown (System 13): health check, alert dispatcher, dashboard; Slack and Twilio for alerts | No Sentry/Datadog |
| AI | Deterministic code first; **Claude Pro** for build/operator work; **Claude API** only for unattended real-time steps, capped $30/mo; Cloudflare Workers AI for cheap classification after an eval | `docs/LLM_COST_AND_API_PLAN.md` |
| Knowledge base | `knowledge/` cards compiled by `compile.mjs` | Feeds the copy pool and Design Agent |

## Not using (and why)
- **AWS Lightsail / S3:** the spec's Lightsail idea is dropped; static sites live on Cloudflare, so there is nothing for it to host.
- **Vercel / Next.js:** heavier than mostly-static service sites need.
- **Per-client repos or per-client code:** kills "fix once".
- **Sentry, Datadog, PagerDuty:** System 13 is homegrown by design.
- **SMS cold outreach:** off at launch (consent-law risk).

## Open questions
- Astro per-site build time vs the spec's 10-second generation target (benchmark in week 2).
- Cloudflare custom-domain limits at 1,000+ customer domains (Pages vs Cloudflare for SaaS).
- Google Places / Business Profile / Yelp terms for storing and displaying reviews.
- Whether Workers AI quality is sufficient for extraction and classification (eval against Claude).

## Decisions log
- 2026-09-18: spec export authoritative; Cloudflare static hosting plus Supabase plus containerized backend; Pro plus a capped API; English-only launch.
- 2026-09-07 (superseded): Astro multi-tenant on one Railway service, files instead of a database, Claude Pro only.

---

## Superseded stack document (2026-09-12)

# Tech stack — BuildFlow

Solo operator. Cheap to run. No rewrite later. One codebase for all sites.

## Locked

| Layer | Choice | Notes |
|-------|--------|-------|
| Public sites | **Astro**, single multi-tenant app | ~6-page service sites; ships HTML; very stable |
| Tenancy | Route by domain → `content/<slug>/` + `theme.json` | one deploy serves every client |
| Content store | **Files in the repo** (Markdown/JSON) | no database until ~10+ clients; Claude edits directly |
| Hosting | **Railway** (one service, many custom domains) | already subscribed |
| DNS / SSL / cache | **Cloudflare** (free tier) in front | client CNAMEs their domain to us |
| Forms → leads | Form → small endpoint (Railway) or Web3Forms free tier → email + SMS to owner | keep minimal |
| Domains | Client points existing domain, or we register at cost (~$12/yr) and bill through | |
| Pipeline / CRM | `pipeline.md` file or Airtable free tier | not a database |
| AI agents | Run **native on Chase's machine + cloud**, against **Claude Pro** | no Anthropic API |

## Not using (and why)

- **Anthropic API** — Pro covers agent + site-gen work. Only revisit if embedding Claude
  *inside* delivered sites; many cheaper options exist for that and it's a separate call.
- **Database** — premature under ~10 clients; files are simpler and versioned.
- **Next.js** — heavier than needed for mostly-static service sites; Astro is more durable.
- **Per-client repos** — kills the "fix once" property and the minimalist thesis.

## Open questions

- Lead endpoint: roll our own on Railway vs. Web3Forms/Formspree free tier
- SMS provider for lead alerts (owner notifications) — cost + deliverability
- When files → Postgres on Railway (trigger: ~10 clients or content editing pain)
- Where A-package exports get deployed (Netlify/Vercel one-click vs. zip + instructions)
- Analytics: Cloudflare Web Analytics (free) vs. Plausible

## Decisions log

- 2026-09-07 — Astro multi-tenant, Railway + Cloudflare, files-not-DB, no Anthropic API,
  hosted-subscription delivery model. See `docs/delivery-model.md`.
