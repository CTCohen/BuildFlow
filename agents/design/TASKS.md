---
title: Design engine tasks
purpose: Lane B task list for the Design, Design QA and Design Discovery agents, with status and how to run each piece
status: active
owner: c.t.cohen
updated: '2026-09-20'
version: 1.0.0
tier_scope: all
phase: phase_1
related: [operations/lanes/LANE-B-design.md, design/SPEC-04-design-quality.md, agents/AGENT_REGISTRY.md]
---

# Design engine: tasks

Run everything from the repo root. Needs `cd app && npm install` once.

| # | Task | Status | Where |
|---|---|---|---|
| 1 | Design Agent v0, deterministic, no LLM | done | `design-agent.mjs` (`renderSite`, `renderMany`, `resolveDesign`) |
| 1b | Build-time benchmark vs the 10 s target | done: ~1.2 s per site | `benchmark.mjs`, `BENCHMARKS.md` |
| 2 | Design QA loop: render + 2 retries, escalate on the 3rd | done | `qa-loop.mjs` (wraps `app/scripts/qa.mjs`) |
| 3 | Design Discovery, minimal, SSRF-safe, manual-intake fallback | done | `discovery.mjs` |
| 4 | 10 profiles wired to the 32 themes; SMB sliders | done | `design-agent.mjs`, `app/src/data/styleProfiles.json` |
| 5 | Micro reduced template behind the tier flag | done | `app/src/pages`, `app/src/lib/client.ts` (`isMicro`) |
| 6 | Evals (67 cases) and smoke test | done | `evals/`, `smoke.mjs` |

## Run
```bash
node agents/design/evals/run.mjs            # all 67 evals (about 60 s; --fast skips the real builds)
node agents/design/smoke.mjs                # 4 verticals x SMB/Micro x 2-3 profiles through the QA loop, writes a gallery
node agents/design/benchmark.mjs --write    # refreshes BENCHMARKS.md
```
Programmatic: `import { runWithQa } from "./agents/design/qa-loop.mjs"; await runWithQa(clientJson, { outDir, stage: "demo" })`.

## How the pieces fit
- **Design Agent:** client JSON -> normalize (defaults, tier rules) -> profile picks a theme (trade fit, then maturity, then a stable per-slug tiebreak) -> type pairing and density from the profile -> hero, services and testimonial variants from vertical and profile -> Astro build in a private work root -> inline CSS. Same client + corrections always gives the same site.
- **Existing identity:** logo colors are kept (never overwritten by a theme); a generated identity takes the theme colors.
- **Micro:** locked to Professional Service, split hero, one type pairing, comfortable density; no sliders; no About page, no area pages, no About or Area sections on the home page.
- **SMB sliders (System 04 section 7):** `customization` block: primary, accent, spacing 0.8-1.3, radius 0-20 px. Validated in `app/src/data/schema.mjs`. Headline and body font dropdowns are not built (the app has three type pairings, set by the profile).
- **QA loop:** failed check names are fed back as `corrections` (contrast: darken the brand color to 4.5:1; layout or Lighthouse: minimal hero, compact density). Anything without an automatic fix is recorded and retried unchanged, then escalated. Logs go to `agents/design/logs/` (gitignored): `rejections.jsonl` (one row per failed check: slug, tier, stage, attempt, check, category, reason), `escalations.jsonl`, `runs.jsonl` (time, LLM tokens 0).
- **Discovery:** parses DOM and CSS for logo, colors, fonts, services, name, phone. Blocks non-http(s), credentials in URLs, localhost and internal suffixes, private, link-local, metadata, CGNAT and IPv6 ULA addresses (checked after DNS and again on every redirect hop). Tone is left null unless a mock or LLM step is added later.

## Not done here, on purpose
- Lighthouse and layout-sanity run on Tyler's machine (the sandbox cannot open a local port or launch Chrome). The QA loop probes for a browser and skips those two checks when it cannot run them, and reports `browserChecked: false`.
- Claude API, hosting, dashboards, payments: out of scope for this lane.
- Persisting rejection logs in Postgres: the JSONL files are the interface until Lane A's `AgentRun` contract exists (`platform/CONTRACT.md` was not present at the time of this work).

## Open items for a later session
- Wire Discovery output into the demo flow once the Lead/Prospect shapes are fixed by the contract.
- Real hero photography and self-hosted fonts (see `app/DESIGN.md`, Known gaps).
- Tyler scores the first ~10 sites (spec); run `smoke.mjs`, open the gallery, and score.
