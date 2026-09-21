---
title: Copy Pool
purpose: Reusable, pre-written copy per vertical and service so no model call is needed per prospect; format, rules and how the Design Agent selects from it
status: draft
owner: c.t.cohen
updated: '2026-09-21'
version: 0.1.0
tier_scope: all
phase: phase_1
related: [docs/LLM_COST_AND_API_PLAN.md, knowledge/trades, app/src/data/styleProfiles.json, operations/lanes/LANE-D-content.md]
---

# Copy pool

**What it is:** copy written once and reused for every prospect, instead of generated per prospect. It is the main way the design engine stays under the API budget (`docs/LLM_COST_AND_API_PLAN.md`).

## Files
- `hvac.json`, `plumbing.json`, `electrical.json`, `roofing.json`: six services each. Per service: symptoms, headline variants (each tagged with a tone), hero sub-lines, a one-sentence blurb, a 30-90 word direct-answer opener, process steps, and FAQ.
- `profiles.json`: maps each of the 10 styling profiles to preferred headline tones, in order.
- `cities/phoenix.json`: the Phoenix-area city list and general climate and water observations, all marked unverified.
- `validate.mjs`: checks the pool and proves the checker catches bad input. Run `node knowledge/pool/validate.mjs`.

## How the Design Agent uses it
1. Take the business's vertical and the services it offers; skip services it does not.
2. Pick the styling profile; read its preferred tones from `profiles.json`.
3. For each service choose the first headline whose tone matches **and whose `requires` flags the business has confirmed**; fall back to the `practical` headline.
4. Fill merge fields: `{business}`, `{city}`, `{metro}`, `{phone}`, `{years}`, `{license}`, `{areas}`.
5. A service tagged `requires: ["emergency_24_7"]` is used only if the business confirms emergency availability.

## Rules for editing
No invented prices, percentages, licences or years. No em dashes. No banned phrases. Availability, offers and warranties are gated by `requires` flags (`emergency_24_7`, `same_day`, `free_estimate`, `financing`, `warranty`). Educational answers are general and must be reviewed against local code before a site relies on them.

## Status
Draft. Not yet used by a build. A human review pass (Tyler or a trade-savvy reviewer) is needed before any copy reaches a real prospect.
