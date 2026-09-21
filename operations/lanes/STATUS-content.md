---
title: Status Lane D Content
purpose: Handoff status for Track D (Content)
status: active
owner: c.t.cohen
updated: '2026-09-21'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Lane D (Content) status, 2026-09-21

**Done (branch `lane/content`)**
- Copy pool for the four Phase 1 verticals (hvac, plumbing, electrical, roofing): 6 services each, in `knowledge/pool/`. Format and selection rules in `knowledge/pool/README.md`.
- 10 style profiles mapped to preferred headline tones (`profiles.json`); profile ids match `app/src/data/styleProfiles.json`.
- Phoenix city and climate context, all marked unverified.
- 24 new trade-pack cards (plumbing, electrical, roofing x 8 each) in the existing card format; `knowledge/manifest.json` updated so `compile.mjs` includes them.
- Proof: `node knowledge/pool/validate.mjs` = 49 checks passed, 0 failed (8 self-tests prove bad input is caught; every profile resolves a headline for every ungated service). `node knowledge/graph.mjs` = 0 stubs, 0 dangling links; the 24 new cards all have a Check block. `compile.mjs` builds for all four trades.

**Not done / caveats**
- All cards and pool entries are `draft`. The educational FAQ answers are general knowledge, not verified against local code; Phoenix facts are marked unverified. Needs a human review pass before real use.
- Layer 1 SEO defaults as cards (llms.txt, answer-structured FAQ) not yet written as separate cards; `principles/ai-seo` and `sops/ai-seo-setup` already cover them.
- The Design Agent (Lane B) does not consume the pool yet.

**Needs from Tyler:** nothing now. Later: a review pass on the pool copy, and your list of any local facts to add.
**Needs from other lanes:** Lane B to read `knowledge/pool/README.md` and use `pickHeadline` (in `validate.mjs`) as the reference selection behavior.
