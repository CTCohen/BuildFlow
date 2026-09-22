---
title: Fornax
purpose: Workspace overview, quick navigation, and status dashboard
status: active
owner: c.t.cohen
updated: '2026-09-18'
version: 1.0
tier_scope: all
phase: operational
related:
- CLAUDE.md
- DECISIONS.md
- ROADMAP.md
---

# Fornax

**An AI-powered outbound sales engine for trades SMBs.** Agents find and score prospects, generate a personalized website for each,
and email it as a demo. A prospect who likes it clicks "Get This Site", pays, and the demo becomes their live site in about a minute.
Tyler handles decisions and sales calls; everything else is automated.

**Authority:** the spec export is authoritative. Start at [`docs/specs/INDEX.md`](docs/specs/INDEX.md). Owner: **Tyler**.

## Quick links
- **What are we building and when?** [`ROADMAP.md`](ROADMAP.md) and [`LAUNCH_ROADMAP.md`](LAUNCH_ROADMAP.md) (all 8 steps and sub-steps)
- **What was decided?** [`DECISIONS.md`](DECISIONS.md) · open conflicts and rulings: [`RECONCILIATION_LOG.md`](RECONCILIATION_LOG.md)
- **What needs Tyler?** [`operations/TYLER_QUEUE.md`](operations/TYLER_QUEUE.md) · loops: [`operations/LOOPS.md`](operations/LOOPS.md)
- **Offer and pricing:** [`docs/PRICING.md`](docs/PRICING.md), [`docs/DELIVERY_MODEL.md`](docs/DELIVERY_MODEL.md)
- **Agents:** [`agents/AGENT_REGISTRY.md`](agents/AGENT_REGISTRY.md) · **LLM cost plan:** [`docs/LLM_COST_AND_API_PLAN.md`](docs/LLM_COST_AND_API_PLAN.md)
- **Is every file updated?** [`docs/specs/APPLICATION_MANIFEST.md`](docs/specs/APPLICATION_MANIFEST.md)

## Current status (2026-09-18)
Spec export applied across the workspace. Phase 1 (5 closes by 9/30 at the old $99 price) is **on hold and re-baselined** to the platform launch.
Launch scope: English only, Micro and SMB, email-only outreach, HubSpot first. **Mid-Market is paused about 12 months.**

## Folder map (what each folder is for, and its spec)
| Folder | Purpose | Spec |
|---|---|---|
| `app/` | Astro design system and site renderer (one client per build) | `design/SPEC-04` |
| `design/` | Design-system docs, logo-first analysis, variant pools | `SPEC-04-design-quality.md` |
| `agents/` | The 15 agents (registry now; code as built) | `AGENT_REGISTRY.md` |
| `platform/` | Schema, API, dashboards, hosting, demo-to-customer, observability, admin | `SPEC-02, 03, 06, 13, 18` |
| `outreach/` | Lead pipeline, prospect lists, email and call scripts | `SPEC-07` |
| `billing/` | Stripe, dunning, revenue | `SPEC-08` |
| `crm/` | CRM connectors and data contracts | `SPEC-09, 10` |
| `legal/` | Terms, privacy, security; compliance spec | `SPEC-11` |
| `onboarding/` | 30-day journey, emails, video scripts | `SPEC-12` |
| `operations/` | Support, feedback, experimentation, runbooks, loops, Tyler queue | `SPEC-14, 15, 17` |
| `knowledge/` | Trade packs, SEO/GEO, SOPs, principles | `SPEC-16` |
| `website/` | Fornax's own marketing site | `SPEC-19` |
| `messaging/`, `sales/`, `context/`, `research/`, `customers/` | Copy hooks, positioning, personas, research, customer records | `SPEC-07` |
| `docs/` | Cross-cutting: business model, pricing, stack, tier matrix, CRM roadmap | `01`, `BUSINESS_MODEL` |
| `specs/` | Feature registry and the feature system | `05-feature-system.md` |
| `metrics/`, `routines/`, `phases/`, `execution/` | KPIs and token log, checklists, phase plans, simulation records | — |
| `governance/`, `.githooks/` | Frontmatter audit, enforcement, phase manager | `GOVERNANCE.md` |
| `archive/` | Superseded material. Never delete: move here | — |

## How information flows between folders
| Stage | Where it happens | Output | Feeds |
|---|---|---|---|
| Discover and score leads | `outreach/`, `agents/` (Lookup, Scoring) | Scored lead records | Outreach |
| Send demo email | `outreach/`, `messaging/` | Sends, opens, clicks | Demo |
| Generate the demo | `app/`, `design/`, `agents/` (Design, Discovery, QA) | Static site plus dashboard preview on Cloudflare | Conversion |
| Convert and pay | `billing/`, `platform/` | Customer, subscription | Fulfillment |
| Go live and onboard | `platform/`, `onboarding/` | Live site, welcome sequence | Lifecycle |
| Sync and support | `crm/`, `operations/` | CRM records, tickets | Metrics |
| Measure and decide | `metrics/`, `ROADMAP.md`, `DECISIONS.md` | Reports, rulings | Next week's plan |
Today these handoffs run through Tyler and documents. The spec's target is a Supabase state machine with event flows (System 2); orchestration
is parked until most of the pieces exist (see `DECISIONS.md`).

## Working rules
- Read the module's SPEC before building. Every doc carries frontmatter (`GOVERNANCE.md`).
- Record decisions in `DECISIONS.md`; update the manifest when a file changes meaning.
- Never delete: archive or move to `~/DELETION/`. Never commit secrets.
- Weekly: update `PROGRESS.md`. Monthly (1st Friday): the business review.
