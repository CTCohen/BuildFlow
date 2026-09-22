---
title: Lane B status
purpose: Handoff for the design engine lane: what is done, in progress, blocked, and what needs Tyler
status: active
owner: c.t.cohen
updated: '2026-09-20'
version: 1.0.0
tier_scope: all
phase: phase_1
related: [operations/lanes/LANE-B-design.md, agents/design/TASKS.md]
---

# Lane B (design engine): status

**Branch:** `lane/design`. Details and run commands: `agents/design/TASKS.md`.

## Done
- Design Agent v0 (deterministic): client JSON to static bundle, about 1.2 s per site against the 10 s target (`agents/design/BENCHMARKS.md`); parallel builds work (4 workers: about 0.5 s per site wall time).
- Design QA loop: initial render + 2 retries with failure reasons fed back, escalation on the 3rd failure, rejection log for the monthly failure-mode job. Shown escalating on a placeholder-laden client (eval q03) and recovering on a too-pale brand color (eval q09).
- Design Discovery (minimal): URL to brand profile, SSRF-blocking, manual-intake fallback.
- 10 profiles wired to the 32 themes; SMB sliders (colors, spacing, radius). Micro reduced template behind the tier flag.
- 67 eval cases (26 design, 17 QA, 24 discovery) all passing, plus a 20-site smoke test (4 verticals x SMB and Micro x 2-3 profiles), all passing.
- QA gate additions in `app/scripts/qa.mjs`: brand-contrast check, `FILL_` scaffold marker as a placeholder, `--client-file`, `--out-dir`, `--json`.

## In progress
Nothing.

## Blocked
Nothing. `platform/CONTRACT.md` did not exist when this lane ran, so agent inputs and outputs use the existing client JSON (`app/src/data/schema.mjs`) and JSONL logs. Reconcile with Lane A's Prospect, Demo, Website and AgentRun shapes when it lands.

## Needs Tyler
Logged as five items in `operations/TYLER_QUEUE.md` under "Lane B: design engine" (2026-09-21), each with the context and the command to run: Micro hero count (1 built, MICRO.md's open item asked 2-3), Micro single-service-page vs. services-grid (both currently built), whether to expose the SMB type-pairing slider (spec §7's font dropdowns vs. what's built), running the browser QA checks on his machine, and first-10 site scoring against the smoke gallery.

## Requests for the main session (root docs, not edited here)
- `docs/DESIGN_SYSTEMS/MICRO.md`: status is now built (reduced set: hero, services grid, service pages, testimonials, quote form, footer, call bar; no About or area pages). The "2 or 3 fixed heroes" and single-page-vs-grid open items are now Tyler decisions (see above), not resolved by this lane.
- `operations/LOOPS.md`: the monthly failure-mode job reads `agents/design/logs/rejections.jsonl` (fields in TASKS.md).
- Token log: no Claude API used; deterministic agents log `llmTokens: 0` per run. Session tokens for the Claude Pro build work are not measurable from inside the session.

Note: `operations/TYLER_QUEUE.md` is a root doc outside this lane's folders; it was edited directly in this session because Tyler asked for it explicitly, not as a standing exception to the lane rule.
