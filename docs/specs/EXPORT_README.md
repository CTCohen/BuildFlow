---
title: BuildFlow — Spec Export
purpose: BuildFlow spec export document
status: active
owner: c.t.cohen
updated: '2026-09-18'
version: 1.0.0
tier_scope: all
phase: phase_1
spec_authority: authoritative (exported from claude.ai project memory 2026-09-17)
---
# BuildFlow — Spec Export

This is a snapshot export of the BuildFlow systems documentation, originally
maintained as Claude Project memory in claude.ai, migrated for use in a local
Claude Code project.

## What's here

- `index.md` — master overview of all 19 systems, dependency map, file list
- `business-model-and-constraints.md` — unit economics, pricing, GTM, operational constraints
- `launch-readiness-plan.md` — the 8 remaining pre-launch steps broken into sub-steps, mapped to
  the systems below, plus resolved scope decisions and a consolidated Phase 2+ list. Read this
  first if you're picking up implementation work.
- `preferences.md` — documentation style conventions used across the systems/ files
- `systems/` — all 19 numbered system specs (01-19) + `agent-registry.md`
  (the cross-cutting catalog of every AI agent BuildFlow uses, referenced by
  most of the numbered systems)

## Not included

A handful of older, explicitly superseded/archived docs from the original
project (pre-consolidation stubs like `01-data-model-system.md`, and
consolidation-analysis working notes) were left out since the index already
marks them superseded by the current 19-system set. If you want those for
historical reference, they can be pulled from the original claude.ai Project
memory on request.

## Using this with Claude Code

1. Unzip this into your project's working directory, e.g.:
   ```
   your-repo/
     docs/
       buildflow-specs/   <- this folder
   ```
2. Point Claude Code at it. Either:
   - Drop the included `CLAUDE.md` snippet (see below) into your repo root
     (merge it with any existing `CLAUDE.md`), or
   - Just reference the folder directly in a prompt, e.g. "read
     docs/buildflow-specs/index.md and build System 6 per spec."
3. Claude Code reads these as plain Markdown with its normal file tools — no
   special import step needed. Treat `systems/*.md` as the build spec; each
   file is written to be agent-actionable per the conventions in
   `preferences.md`.

## Keeping it in sync

This is a point-in-time export (as of the date it was generated). The
claude.ai Project memory is the live/editable source — if you keep working
there, re-export periodically. If you'd rather make this folder the source of
truth going forward, edit these files directly and have Claude Code (not
claude.ai memory) own future changes.
