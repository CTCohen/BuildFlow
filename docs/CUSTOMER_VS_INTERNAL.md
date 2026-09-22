---
title: Customer Vs Internal
purpose: Which folders/systems are the PRODUCT (built for customers, sold to them) vs OUR OWN OPERATIONS (Fornax running itself). Read this before creating any design, dashboard, CRM, or system file — it decides which side it belongs on.
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Customer-facing product vs. our own business

Two completely separate categories. Nothing should sit ambiguously between them. If you're about to create a
design, a dashboard, a CRM connection, or any "system," ask first: **is this something a customer uses/sees, or
is this something Tyler/Fornax uses to run the company?** Then put it on the correct side of this table.

## For customers (the product we build and sell)

| What | Lives in | Notes |
|---|---|---|
| Customer website design system (templates, style profiles, components, tokens) | `design/`, `app/src/tokens/`, `app/src/components/` | The 10 style profiles, 4 vertical templates |
| Customer brand extraction (preserving *their* logo/colors when we build their site) | `design/LOGO-FIRST-DESIGN.md`, `design/logo-analyzer.ts` | This is about THEIR brand, not ours — name is confusing, scope is not |
| Design Agent, Design QA Agent, Discovery Agent (the code that builds customer sites) | `agents/design/` | |
| Customer copy, trade knowledge, SEO content for customer sites | `knowledge/` | |
| Customer's own website, once built | Customer's Cloudflare subdomain / their own hosting after Offboard | |
| Customer dashboard (their view: leads, pipeline, notes) | `platform/dashboards/customer/` | |
| CRM sync **into the customer's own CRM** (HubSpot, later others) | `crm/`, `agents/lead/` (adapter) | We're building the pipe; the CRM itself is theirs |
| Lead scoring, outreach, demo generation for prospects | `agents/lead/`, `outreach/`, `messaging/` | Also customer-facing — the "customer" here is the prospect we're selling to |

## For us (running Fornax as a business)

| What | Lives in | Notes |
|---|---|---|
| Fornax's own logo, brand identity, voice/tone guide | `brand/` (new, see below) | Does not exist as a build task yet — Tyler picks a direction (TYLER_QUEUE.md), then this gets built |
| Fornax's own marketing site ([domain TBD under Fornax name]) | `website/` | Already correctly separate — do not confuse with customer sites |
| Admin dashboard (Tyler's view: all customers, health, revenue) | `platform/dashboards/admin/` | This is OUR tool, not a customer's |
| Our own operating files, coordination, task tracking | `operations/` | `COORDINATOR_STATE.md`, `BUILD_TASKS.md`, `TYLER_QUEUE.md`, `LOOPS.md` |
| Our own business metrics | `metrics/` | MRR, churn, CAC — about the business, not a customer's site |
| Our own use of a CRM to run Fornax's own sales (if we ever adopt one) | Not yet a repo concern | Distinct from `crm/`, which is the connector we BUILD for customers' CRMs |
| Legal (our Terms/Privacy, our compliance posture) | `legal/` | Governs how we treat customers, but it's our document, not theirs |

## The `brand/` folder (new)

Doesn't exist yet as real content — scaffolded now so there's a clear place for it. Holds Fornax's own:
- Logo files and usage rules
- Brand color/type system (separate from the *customer* style-profile system in `design/`)
- Voice and tone guide for Fornax's own marketing copy (distinct from `messaging/`, which is customer-facing outreach copy)

This is a `[decision: Tyler picks a direction]` item per `TYLER_QUEUE.md` — nothing gets built here until he does.

## Rule for every future addition
Before adding a new design, dashboard, CRM integration, or "system" file anywhere in this repo: check this table
first. If it doesn't fit an existing row, add a new row rather than guessing which side it's on — ambiguity here
is exactly the thing that caused the original confusion.
