---
title: Lane C Lead Engine
purpose: Brief for the session that builds lead lookup, scoring, outreach templates and the send workflow, all against mocks
status: active
owner: c.t.cohen
updated: '2026-09-19'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Lane C: Lead engine (`agents/lead/`, `outreach/`, `messaging/`)

**Goal:** find, score and contact prospects automatically, safely, and cheaply.
**Read first:** `outreach/SPEC-07-lead-to-customer-pipeline.md`, `agents/AGENT_REGISTRY.md` (#4 Lead Scoring, #5 Lead Lookup, #7 Outreach/Copy, Sections B, E, F), `docs/LLM_COST_AND_API_PLAN.md`, `messaging/`, `docs/RISKS.md`, `operations/lanes/README.md`.

## Tasks, in order
1. **Lead Scoring, deterministic.** Implement the spec's 100-point model exactly (vertical/location/size 0-40, fit 0-35, engagement 0-25; thresholds 70/50/20). Tier assignment (Micro or SMB; Mid-Market-size leads are suppressed). Calibration tracked per vertical.
2. **Lead Lookup with mock providers.** Fan-out interface for Apollo, Hunter and Google Places with recorded fixtures; merge by confidence; flag for Tyler when nothing matches. No real keys.
3. **Business-size classification** from free signals first (rules, no LLM).
4. **Outreach templates.** The 5-touch email sequence (day 0/3/7/14/21) as deterministic templates with merge fields; touch-1 hook chosen from signals (no LLM). Copy stays a draft in `messaging/` until Tyler approves.
5. **Send and sequence workflow** against a SendGrid sandbox or mock: one email per day at 9 AM local, bounce and complaint handling, pause at 5% spam, one-click unsubscribe that is always deterministic. Nothing sends for real.
6. **Evals.** 15-20 cases per agent in `agents/lead/evals/`.
7. Write `agents/lead/TASKS.md`.

## Done means
Show: scoring output for a set of sample leads matching the spec's thresholds; the sequence scheduler producing the right send dates; an unsubscribe test; all eval cases passing.
**Needs from Tyler:** approval of outreach copy (later); Apollo, Hunter, SendGrid keys (later, in his `.env`).
**Out of scope:** real sends, real API keys, SMS, the Claude API, demo generation (Lane B).
