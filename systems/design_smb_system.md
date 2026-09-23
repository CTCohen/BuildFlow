---
title: Design System — SMB
purpose: Authoritative spec and build checklist for the SMB (ICP) tier's website generation, the most-built design system. Superseded/absorbed from docs/DESIGN_SYSTEMS/SMB.md, design/SPEC-04-design-quality.md.
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.0.0
tier_scope: smb
phase: phase_1
---

# Design System — SMB

The ICP tier's website generation: curated design choices (hero style, typography, density) within locked
layout, conditional trade-signal features, full QA gate. Philosophy: "You choose your aesthetic, we handle the
rest." This is the design system the Design Agent is actually built against today (`agents/design/`).


**Code lives at:** `agents/design/`, `app/`

**Saved demo builds:** `app/dist/` is Astro's ephemeral build output (gitignored, wiped every build — not a
storage location) and `agents/design/out/smoke/` is scratch space for a single smoke-test run (overwritten next
run). A build worth keeping past the run that produced it — for review, a QA escalation, or an outreach send —
gets copied into `agents/design/demos/smb/<vertical>-<slug>/`. Only `agents/design/demos/README.md` and any
curated review report are tracked in git; the generated site output itself is gitignored
(`agents/design/demos/*/*/` in `.gitignore`). See `agents/design/demos/README.md` for the full convention.

## Built and verified
- [x] Design Agent v0 builds a site from client JSON — `operations/BUILD_TASKS.md` §3: "done, lane/design,
  verified 67/67 evals" (`agents/design/evals/design.eval.mjs`)
- [x] Build-time benchmark — 1.22s vs. a 10s target, verified (`agents/design/BENCHMARKS.md`)
- [x] Style-profile-to-theme mapping — all 32 themes in `themes-30.json` map 1:1 to the 10 spec profiles, no
  dupes/typos, verified 2026-09-21 by script cross-check
- [x] `styleProfile` wired live into the Design Agent — `agents/design/design-agent.mjs`'s `pickTheme`/
  `resolveDesign` reads `client.styleProfile`, resolves through `styleProfiles.json` to a theme in
  `themes-30.json`, writes `brand.primary/accent/...` into the client JSON the Astro site renders from
  (`app/src/data/clients/*.json`). Verified 2026-09-21, commit `c5119fc`, 67/67 evals before and after. A
  parallel, never-imported "Agent Decision Engine v2" (`app/src/lib/agent-decisions.ts`,
  `app/src/data/vertical-pools.ts`) was found to be dead code and archived to `archive/legacy-agent-decisions/`
  (not deleted), not part of the live pipeline.
- [x] Discovery Agent real-world fix — commit `5f4159f`, 2026-09-22: fixed HTML-entity decoding in
  `og:site_name`/`description` meta extraction, and added a heading-keyword fallback for
  `extractServices()` when a site uses per-service headings instead of one umbrella "Services" section. Live
  smoke test against a real HVAC site (deljoheating.com, not a fixture) went from 0.75 to 1.0 confidence, all
  8 real services extracted. 67/67 design evals still pass. Not yet pushed to GitHub as of that commit
  (network unreachable from the sandbox that run) — check current `git log origin/main` before assuming it's
  live upstream.
- [x] Conditional feature detection by business signal (emergency-focused, portfolio-heavy, seasonal,
  project-based, multi-location, solo-operator) — implementation referenced at
  `app/src/lib/conditional-features.ts`; covered by the same 67/67 eval suite (not verified line-by-line in
  this pass beyond the file's existence and the eval count).
- [x] Copy pool for 4 verticals (hvac/plumbing/electrical/roofing), 24 service cards, fact-density validator —
  commit `2e39a9e`, 49/49 checks, later extended to 52/52 with a `facts` array per service (>=3 concrete facts,
  >=2 ungated) per D26/SPEC-16 Layer 1 — `knowledge/pool/validate.mjs`

## Specified, not yet built
- [ ] Design QA loop (Lighthouse/axe gate, retries, escalation) — `operations/BUILD_TASKS.md` §3 marks this
  "◐ partial — exists in lane/design, full run needs a local browser (Tyler's machine), not before W6 per your
  rule"
- [ ] Demo's sandbox dashboard rendered into the live demo page — the view-model
  (`platform/dashboards/lib/sandbox-dashboard.mjs`) is built and tested, but rendering it into the Astro demo
  page is `website/`/`app/` work, explicitly out of scope for the sessions that built the view-model
- [ ] Client-side demo tracking beacon (scroll/click event firing) — the backend recording/aggregation
  (`platform/dashboards/lib/demo-tracking.mjs`, 9/9 tests) is built; the JS snippet that would call it from the
  live demo page is not
- [ ] LLM visual-quality rubric and form-submission QA test — both marked "⏳ deferred to Phase 2" in
  `docs/DESIGN_SYSTEMS/SMB.md`'s QA Gate section

## Possible future specs (not built, not committed to)
- Additional hero styles or typography pairings beyond the current 5 hero styles / 3 pairings

## Open questions
- None found specific to SMB beyond what's already tracked as "specified, not yet built" above; the source doc
  marks SMB itself as "FULLY BUILT" for its design decisions, which the eval evidence supports for the design
  logic layer (not the QA loop or demo-embed pieces called out above).
