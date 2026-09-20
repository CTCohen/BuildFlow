---
title: Features
purpose: Documentation for features.md
status: draft
owner: c.t.cohen
updated: '2026-09-18'
tier_scope: all
phase: operational
---

# Feature registry: BuildFlow

> Rebuilt 2026-09-18 from the 19 systems and the agent registry. Status: `idea` | `building` | `live` | `blocked` | `deferred`. Spec files sit beside their modules (`README.md` folder map).

## Critical paths
| # | Path | Spec | Status |
|---|---|---|---|
| 1 | Lead discovery and scoring (Lookup and Scoring agents) | System 07 | idea (existing manual research in `outreach/`) |
| 2 | Outreach: 5-touch email sequence, warmed sender domain (SMS off at launch) | System 07 | building (templates in `messaging/`) |
| 3 | Demo generation: Design, Discovery, Design QA agents; static site plus tier dashboard sandbox | Systems 04, 06 | building (Astro design system and QA gate exist) |
| 4 | Conversion and payment: Stripe monthly and annual, self-serve and high-touch | Systems 06, 08 | idea |
| 5 | Fulfillment: payment to live in under 60 seconds | System 06 | idea |
| 6 | Customer dashboard (Micro, SMB), one dashboard with tier flags | Systems 02, 05 | idea |
| 7 | CRM sync (HubSpot first, one-way, 5-minute batch) | Systems 09, 10 | idea |
| 8 | Per-client QA gate (`npm run qa -- --client <slug>`), spec thresholds | System 04 | building |
| 9 | Auth and data isolation (Supabase Auth, row-level security) | System 11 | idea |
| 10 | Usage and cost logging (`metrics/token-log.md`, `AgentRun` tokens and dollars) | System 13 | idea |

## Systems and where they stand
| System | Scope at launch | Status |
|---|---|---|
| 01 Business Operations | Pricing, cost cap, hiring gate | ruled |
| 02 Platform Architecture | Schema, events, orchestration | idea |
| 03 Hosting | Cloudflare static, containerized backend | idea |
| 04 Design and Quality | Micro and SMB, 10 profiles, QA loop | building |
| 05 Feature System | Micro and SMB features; Mid-Market deferred | ruled |
| 06 Demo-to-Customer | Demo, tracking, conversion, fulfillment | idea |
| 07 Lead Pipeline | Warehouse, scoring, email sequence | idea |
| 08 Payments | Stripe, manual dunning first | idea |
| 09/10 CRM | HubSpot first | idea |
| 11 Compliance and Security | Auth, encryption, retention, runbook, lawyer review | idea |
| 12 Lifecycle | 30-day journey, churn score | idea |
| 13 Observability | Health check, alerts, basic dashboard pre-launch | idea |
| 14 Support | Inbox, help center, triage | idea |
| 15 Feedback | Form, monthly triage | idea |
| 16 SEO/GEO | Layer 1 all tiers, Layer 2 SMB | building (schema, llms.txt exist) |
| 17 Experimentation | Post-launch | deferred |
| 18 Admin CRM | Web admin at launch; iOS photo intake Phase 1.5 | idea |
| 19 Website | Home, Features, Pricing, Demo, Blog x3, Docs, About | idea (prototype in `website/`) |

## Agents (15, `agents/AGENT_REGISTRY.md`)
Launch build order: Design, Design QA, Design Discovery, then Lead Scoring, Lead Lookup, Outreach/Copy, then CRM Sync and Dunning; fourth tier after launch: OCR, Review Sync, Lifecycle/Churn, Support Triage, Feedback Triage, SEO/GEO, Experimentation.

## Supporting
Speed instrumentation (start to built, start to closed), eval suites per agent, monitoring of agent runs, EN-only launch with Spanish as an opt-in fast follow.
