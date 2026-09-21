---
title: Lane D Content
purpose: Brief for the light session that builds the reusable copy pool and the missing trade packs
status: active
owner: c.t.cohen
updated: '2026-09-20'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Lane D: Content (`knowledge/`), light

**Goal:** copy generated once and reused, so no LLM call is needed per prospect.
**Read first:** `knowledge/SPEC-16-seo-geo.md`, `docs/LLM_COST_AND_API_PLAN.md`, `knowledge/README.md`, `knowledge/trades/hvac/`, `knowledge/principles/anti-ai-slop-copy.md`, `operations/lanes/README.md`.

## Tasks
1. **Copy pool.** Blocks keyed by vertical x service x city x style profile (headline, hero sub, service blurb, about, FAQ), in the existing card format with a Check block each. Fill only real, verifiable facts; leave merge fields for name, phone and city.
2. **Trade packs** for plumbing, electrical and roofing (roofing has none): must-haves, page map, copy bank, objection handling, trust signals, schema, keyword map.
3. **Layer 1 SEO defaults** (`llms.txt`, answer-structured FAQ) as cards.
4. Run `node knowledge/compile.mjs` and `node knowledge/graph.mjs`; report cards active and any gaps.

**Done means:** a pool covering the four verticals; graph report with no dangling links; compiled output committed.
**Needs from Tyler:** none. **Out of scope:** any API call, site generation (Lane B).
