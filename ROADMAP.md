---
title: BuildFlow Weekly Roadmap
purpose: Weekly planning and execution tracking with clear goals and success metrics
status: active
owner: c.t.cohen
updated: '2026-09-18'
version: 1.0
tier_scope: all
phase: phase_1
staleness_days: 7
related:
- CLAUDE.md
- DECISIONS.md
- phases/PHASE_1.md
---

# ROADMAP.md — BuildFlow

> Rebuilt 2026-09-18 from the spec export (`docs/specs/LAUNCH_READINESS_PLAN.md`) and Tyler's rulings.
> Every step and sub-step is in `LAUNCH_ROADMAP.md`. Open conflicts: `RECONCILIATION_LOG.md`. What needs Tyler: `operations/TYLER_QUEUE.md`.

## Goal (target: soft launch ~2026-11-23)
A working platform where agents find and score prospects, generate a personalized demo site, send it, and convert paying
customers automatically, with Tyler handling only decisions and sales calls. Launch scope: English only, Micro and SMB
tiers, email-only outreach, HubSpot first. **Mid-Market is paused for about 12 months** (shown, not built).

## Phases
| Phase | What | Owner |
|---|---|---|
| **0. Unblock** | Rulings, business setup (entity/EIN, bank, address), domains, accounts (Cloudflare, Supabase, Stripe test, SendGrid warmup, Google Cloud), CRM partner applications, Calendly | Tyler |
| **1. Core engine** | Schema, auth, deploy foundation → Design, Design QA, Discovery agents on the existing SMB design system → lead agents and their infrastructure together (Lookup, Scoring, Outreach/Copy, send workflow) | Claude loops |
| **2. Revenue path** | Stripe (versioned prices, annual, launch-cohort flag, manual dunning) → payment-to-live in under 60 s → HubSpot one-way push → onboarding and offboarding automation | Claude loops |
| **3. Platform** | Customer dashboard (SMB, then Micro) → admin web and monitoring baseline → marketing site (System 19) → legal rewrite and lawyer review | Claude + Tyler approvals |
| **4. Prove it** | Videos → end-to-end test (funnel, evals, dunning tiers 1–3, WCAG, isolation, load) → soft launch with the 5 Phoenix HVAC prospects, re-priced | Both |
| **Deferred** | Mid-Market, iOS photo intake (Phase 1.5), remaining CRMs, ranking tracking, A/B testing, redesign service | — |

## Calendar (estimate; Tyler 15–20 hrs/week, re-cut after week 1)
| Week | Claude (loops) | Tyler-only | Tyler hrs |
|---|---|---|---|
| W1 Sep 21–27 | Apply the specs across all files; manifest and lint; `TASKS.md` per system | Entity/EIN start, domains, open accounts, SendGrid warmup, CRM partner requests, Calendly | 6–8 |
| W2 Sep 28–Oct 4 | Schema, RLS, auth, Cloudflare skeleton, container deploy; Design Agent v0 and build-time benchmark | Choose a lawyer; logo direction; API key ($30 cap) | 4–5 |
| W3 Oct 5–11 | Design, QA, Discovery agents; 30 themes → 10 profiles; evals | Approve profiles and QA thresholds; first-10 site scoring | 5–6 |
| W4 Oct 12–18 | Lead Lookup, Scoring, Outreach templates, send workflow; business-size rules; copy pool | Approve outreach copy and sequence | 4–5 |
| W5 Oct 19–25 | Stripe, fulfillment <60 s, demo pipeline, HubSpot push | Stripe test products; review demo pages | 4–5 |
| W6 Oct 26–Nov 1 | SMB customer dashboard, admin web, monitoring, sandbox demo dashboard | Dashboard UX review | 4–5 |
| W7 Nov 2–8 | Micro templates and dashboard, marketing site, logo | Approve logo, site copy, Mid-Market waitlist copy | 4–5 |
| W8 Nov 9–15 | Help center, internal KB, onboarding/offboarding scripts, offboard export tool | Record videos | 6–8 |
| W9 Nov 16–22 | End-to-end test and fixes | Lawyer sign-off; Stripe live only after it | 5–6 |
| W10 Nov 23–29 | Soft launch and monitoring | Calls, closes, onboarding | 8–10 |
| W11–12 Nov 30–Dec 13 | Fixes, first-batch decision report, price-increase model | Approve first outbound batch | 5–6 |

## This week's goal
Close the reconciliation: every file updated from the specs, the manifest showing no pending file, and Tyler's Phase 0 accounts started.

## In scope now
Spec application, Phase 0 setup, foundation and Design Agent work per the calendar.

## Out of scope
Mid-Market build, SMS outreach, Spanish sites, iOS app, customer mobile app, additional verticals, paid acquisition.

## Success metrics
Every agent passes 15–20 eval cases · 3 consecutive first-pass QA runs · dunning tiers 1–3 dry-run · data-isolation test passes ·
demo generation and payment-to-live within spec times · API spend inside the cap · conversion measured against the 2–5% assumption.

## Constraints
- $50/mo platform budget until the first $500 MRR; Claude API capped at $30/mo (`docs/LLM_COST_AND_API_PLAN.md`).
- Solo operator, 15–20 hrs/week. One codebase, no per-client code.
