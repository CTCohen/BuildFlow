---
title: Delivery_Model
purpose: Documentation for DELIVERY_MODEL.md
status: draft
owner: c.t.cohen
updated: '2026-09-18'
tier_scope: all
phase: operational
---

# Delivery Model

> Rebuilt 2026-09-18 from Systems 03, 04, 05, 06 and the business model. Pricing: `PRICING.md`. Feature detail by tier: `TIER-FEATURE-MATRIX.md`.

## Core principle
**One codebase, no per-client code.** Each site is the existing design system rendered by the Design Agent from a per-client data file into a static bundle.
Demo and live site are the same thing: gated before conversion, public after. Nothing is ever handed over under Managed.

## How a prospect becomes a customer
1. Agents discover and score a lead; the score assigns the tier (Micro or SMB at launch).
2. The Design Agent builds a personalized static site and the Design QA Agent gates it (Lighthouse and axe). The demo lives on Cloudflare at a non-guessable URL for 90 days.
3. The prospect sees their site **and a sandbox of their tier's dashboard**, gets the outreach email (5-touch email sequence), and clicks "Get This Site".
4. Self-serve path: pay through Stripe, then the customer record, live site, DNS and SSL, welcome email and dashboard access are created in under 60 seconds. High-touch path: Tyler quotes and closes by hand.
5. Managed: the site stays on our hosting. Offboard: we export and transfer domain ownership with docs and videos; no ongoing support.

## The two ways to pay
| | Managed | Offboard |
|---|---|---|
| Hosting, SSL, CDN, custom domain | We host | Customer hosts |
| SEO | Layer 1 defaults for all tiers; monthly optimization for SMB | Customer's job |
| Content edits | Self-serve dashboard | Customer's job |
| CRM sync | SMB (HubSpot first) | n/a |
| Support | Email and help center | None (docs and videos) |
| Cancel | Monthly: through end of month. Annual: non-refundable, stops immediately | n/a |

## Tiers at a glance
- **Micro:** 6-8 components, lead inbox only, text-only edits, no CRM (email alerts and CSV export), monthly email report.
- **SMB:** Micro plus gallery, map, FAQ, seasonal offers, team profiles, service-area targeting, custom colors and fonts, notes, simple pipeline, image uploads, one CRM.
- **Mid-Market:** paused; see `TIER-FEATURE-MATRIX.md`.
Launch is English-only, email-outreach-only.

## Hosting and migration
Static sites live on Cloudflare (Pages/Workers, R2). Customer subdomains: `[company].[domain TBD under Fornax name]`; custom domains through Cloudflare DNS with automatic SSL.
The platform (dashboards, API, agents) runs containerized: Railway first, Google Cloud Run later. Because demo and live share the same infrastructure, conversion is a
re-render and a domain change, not a provider migration. Offboard exports the static bundle to the customer's host.

## What we promise
The lead-capture machinery: a fast, accessible site, click-to-call, quote forms routed to the owner, review display, CRM sync. We do **not** promise lead volume or outcomes.

---

## Superseded delivery model (2026-09-12, kept for history)

# Delivery Model

**Three service tiers, two pricing options (A/B) per tier.**

---

## The Three Tiers

### MICRO
**For:** Solopreneurs, just-starting contractors, single-location businesses  
**Use case:** "I need leads. Fast and simple."

| Feature | Micro |
|---------|-------|
| **Design complexity** | Simple (1 hero style, 1 font) |
| **Pages** | 5–7 (home, services, about, contact) |
| **Services per site** | 2–3 |
| **Brand customization** | Auto-generated identity (unless they have logo) |
| **Dashboard** | View-only (see contact submissions) |
| **Build time** | 3–4 days |
| **Support** | Email (24–48hr response) |

**Pricing:**
- **Managed Growth:** $49/month (hosting, basics, edits 1x/month)
- **Ownership:** $297 one-time (static export, 2-week support)

---

### SMB (Small-to-Medium Business)
**For:** Established contractors (3–20 years), multi-service, multi-location in mind  
**Use case:** "I want a professional site that competes with bigger players."

| Feature | SMB |
|---------|-----|
| **Design complexity** | Medium (5 hero styles, 3 fonts, brand extraction) |
| **Pages** | 10–15 (home, services x5+, about, blog, testimonials, contact) |
| **Services per site** | 5–10 |
| **Brand customization** | Extract from logo OR generate custom identity |
| **Dashboard** | Self-service edits (content, hours, photos, reviews) |
| **Build time** | 5–7 days |
| **Support** | Email (24hr response) + monthly check-in call |

**Pricing:**
- **Managed Growth:** $99/month (hosting, SEO, edits unlimited, check-ins)
- **Ownership:** $497 one-time (static export, 1-month support)

---

### MID-MARKET
**For:** Growing businesses (20+ years, multiple locations, complex service catalog)  
**Use case:** "I want full control over my brand and how we present ourselves."

| Feature | Mid-Market |
|---------|-----------|
| **Design complexity** | High (unlimited hero styles, custom fonts, pixel-level control) |
| **Pages** | Unlimited (custom architecture) |
| **Services per site** | Unlimited |
| **Brand customization** | Full white-label (custom colors, fonts, layouts, components) |
| **Dashboard** | Full self-service (design tweaks, custom fields, analytics, multi-user) |
| **Build time** | 10–14 days |
| **Support** | Dedicated support + quarterly strategy calls |

**Pricing:**
- **Managed Growth:** $299/month (hosting, full customization rights, white-label dashboard, analytics)
- **Ownership:** $1,497 one-time (static export with full source, 1-month support, licensing)

---

## How Tiers Differ

### Design System
- **Micro:** Fixed design (we pick the best defaults)
- **SMB:** Configurable design (hero style, font, colors)
- **Mid-market:** Custom design (build anything, white-label)

### Knowledge Base
- **Micro:** Essential playbook (key trust signals, must-haves)
- **SMB:** Detailed playbook (comprehensive, best practices)
- **Mid-market:** Advanced playbook (strategy, positioning, competitive edge)

### Build Process
- **Micro:** Template (fast, minimal config)
- **SMB:** Configured (design decisions, brand extraction)
- **Mid-market:** Custom (consultation-driven, design review loop)

### Post-Launch
- **Micro:** Hands-off (no edits, send requests via email, we handle)
- **SMB:** Self-service + support (edit yourself, support for questions)
- **Mid-market:** White-label dashboard (full control, we're behind the scenes)

---

## Why Three Tiers?

**Market reality:** Service businesses come in three sizes, each with different needs.
- **Micro** = fast, cheap, no frills (big market, high churn risk)
- **SMB** = professional, brand-aware, willing to pay (best market fit)
- **Mid-market** = control, customization, scale (smallest market, best LTV)

**Revenue model:** 
- Micro: High volume, low margin, low LTV
- SMB: Medium volume, good margin, medium LTV (sweet spot)
- Mid-market: Low volume, high margin, high LTV (long sales cycles)

---

## Ownership vs. Managed Growth

**Both tiers offer A (Ownership) and B (Managed Growth):**

### Ownership (One-Time, A)
- Static HTML export
- Client hosts on their own server
- 1–2 weeks transition support
- Client owns and maintains forever
- No ongoing platform dependency

### Managed Growth (Recurring, B)
- We host on Railway
- We maintain SSL, backups, uptime
- Ongoing SEO optimization
- Content edits included (self-service for SMB/Mid-market, email for Micro)
- Cancel anytime (site goes offline at period-end)

---

## See Also

- **Pricing rationale:** [PRICING.md](PRICING.md)
- **Design system per tier:** [DESIGN_SYSTEMS/](DESIGN_SYSTEMS/_OVERVIEW.md)
- **Dashboard features per tier:** [DASHBOARDS/](DASHBOARDS/_OVERVIEW.md)
- **Sales pitch per tier:** [../sales/POSITIONING.md](../sales/POSITIONING.md)
- **Knowledge base per tier:** [../knowledge/trades/](../knowledge/trades/)

---

**Last updated:** 2026-09-12  
**Owner:** Chase (product decisions), Claude (documentation)
