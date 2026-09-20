---
title: Lane B Design Engine
purpose: Brief for the session that builds the Design, Design QA and Design Discovery agents, the 10 styling profiles and the Micro templates
status: active
owner: c.t.cohen
updated: '2026-09-19'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Lane B: Design engine (`app/`, `design/`, `agents/design/`)

**Goal:** turn a prospect's data into a checked, personalized static site, automatically.
**Read first:** `design/SPEC-04-design-quality.md`, `agents/AGENT_REGISTRY.md` (#1 Design, #2 Discovery, #3 Design QA and Sections A, E, F), `app/DESIGN.md`, `docs/DESIGN_SYSTEMS/`, `docs/LLM_COST_AND_API_PLAN.md`, `operations/lanes/README.md`.

## Tasks, in order
1. **Design Agent v0, deterministic first.** Client JSON in, static bundle out, using the existing Astro system. Pick the template and theme from vertical + style profile (`app/src/data/styleProfiles.json`). No LLM call. **Benchmark the build time per site** against the spec's 10-second target and write the numbers in `agents/design/BENCHMARKS.md`; try parallel builds.
2. **Design QA loop.** Wrap `app/scripts/qa.mjs`: initial render plus 2 retries with the failure reasons fed back, escalate on the 3rd failure. Log every rejection reason (the monthly failure-mode job reads it). Demo floor Lighthouse 80 / accessibility 90; live 90.
3. **Design Discovery, minimal.** Given a URL, parse colors, fonts, logo and services from the DOM and CSS into a brand profile (extends `design/logo-analyzer.ts`). Tone extraction stays out unless a mock is provided. Fall back to a manual intake form on crawl failure. Block internal addresses (SSRF).
4. **Style profiles.** Wire the 10 profiles to the 32 themes; customer sliders for SMB only.
5. **Micro templates.** Reduced 6-8 component set behind the tier flag (`docs/DESIGN_SYSTEMS/MICRO.md`).
6. **Evals.** 15-20 cases per agent in `agents/design/evals/`, plus a smoke test across verticals and tiers with 2-3 profiles each.
7. Write `agents/design/TASKS.md`.

## Done means
Show: a generated site for each of the four verticals at both tiers; build-time numbers; the retry loop demonstrably escalating on a deliberately bad input; all eval cases passing. Lighthouse and layout checks run on Tyler's machine, not in the sandbox; do not block on them.
**Needs from Tyler:** nothing. **Out of scope:** the Claude API, hosting, dashboards, payments.
