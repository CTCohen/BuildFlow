---
title: BuildFlow Operating Manual
purpose: Governance and decision-making for the BuildFlow venture
status: active
owner: c.t.cohen
updated: '2026-09-18'
version: 1.0
critical_path: true
tier_scope: all
phase: operational
related:
- DECISIONS.md
- ROADMAP.md
- GOVERNANCE.md
---

# CLAUDE.md — BuildFlow

> Operating manual. Read before any build, spec, or outreach work. `~/CLAUDE.md` and `~/.claude/CLAUDE.md` still apply.
> **Authority:** the spec export (19 systems + agent registry) is authoritative. Index: `docs/specs/INDEX.md`.
> Where older docs conflict, the spec wins. Open conflicts and Tyler's rulings: `RECONCILIATION_LOG.md`.

## Role
**BuildFlow** is an AI-powered outbound sales engine for trades SMBs, not a website builder. Agents generate a
personalized site per prospect, cold outreach sends it as a demo, and on conversion the demo becomes the live site.
The owner and only human is **Tyler** (solo, ~15–20 hrs/week; no hires until he says, ~$150K annual profit).

## Offer (locked; prices will rise soon after launch)
| Tier | Managed | Annual (10×) | Offboard (one-time) |
|---|---|---|---|
| Micro | $149/mo | $1,490 | $499 |
| **SMB (ICP)** | $249/mo | $2,490 | $799 |
| Mid-Market | $399/mo | $3,990 | $1,299 — **paused ~12 months: shown on site and pricing, nothing built** |

Lead scoring assigns the tier; customers don't choose. No free trial. Managed = we host; Offboard = customer takes
the domain and files, no ongoing support. Details: `docs/PRICING.md`, `specs/05-feature-system.md`.

## Stack
- **Sites:** existing Astro design system, rendered to static bundles by the Design Agent, hosted on Cloudflare (Pages/Workers, R2).
  One codebase, no per-client code. After conversion they run on our hosting or the client's.
- **Platform:** Supabase Postgres (row-level security on `customer_id`) + Supabase Auth (Google and email/password).
  Backend containerized: Railway now, Google Cloud Run later. Stripe, SendGrid, HubSpot first (one-way CRM push).
- **Agents:** 15 in `agents/AGENT_REGISTRY.md`; no LLM where the spec says none. **Claude Pro** for build and operator work.
  **Claude API only for unattended real-time steps**, capped at $30/mo pre-revenue (`docs/LLM_COST_AND_API_PLAN.md`).
  Log runs in `metrics/token-log.md`.

## Where things live
Specs sit beside their module: `platform/`, `design/`, `agents/`, `billing/`, `crm/`, `outreach/`, `legal/`,
`onboarding/`, `operations/`, `knowledge/`, `website/`. Cross-cutting: `docs/`, `docs/specs/`. Site renderer: `app/`.
Marketing site: `website/`. Live file status: `docs/specs/APPLICATION_MANIFEST.md`. Loops: `operations/LOOPS.md`.

## Critical paths (cannot break)
Design → QA → deploy of demos and live sites · lead discovery and outreach delivery · Stripe payment → live (<60 s) ·
customer data isolation · auth · CRM sync · legal and compliance before the first charge.

## Constraints
- $50/mo platform budget until the first $500 MRR (excludes per-customer hosting cost and the Claude Pro plan).
- Launch scope: English only; Micro and SMB; email-only outreach (SMS off); one CRM first (HubSpot).
- Tyler's time is the bottleneck. Automate everything that is not a decision. `operations/TYLER_QUEUE.md` lists what needs him.

## Decision rules
- **Safe:** run discovery, build draft or preview sites, test any part of the pipeline, update docs, propose improvements.
- **Ask first:** outreach or messaging copy, onboarding changes, legal text, production changes, price changes, new paid
  services or dependencies, migrations, auth changes, and sending any real email.

## Do
- Read the module's SPEC before building. Use the shared agents (the Design Agent has four call sites; one Lead Scoring model).
- Run the QA gate before any site leaves the pipeline. Log token and dollar cost of every automated run.
- Where a spec is thin, research it and write the detail back into the spec.

## Don't
- No per-client code, no promises of lead outcomes, no fabricated testimonials or "customer results".
- Never hand over code, DNS or hosting under Managed. Never delete: archive locally or move to `~/DELETION/`.
