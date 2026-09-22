---
title: Fornax — Claude Code Project Instructions
purpose: Fornax spec export document
status: active
owner: c.t.cohen
updated: '2026-09-18'
version: 1.0.0
tier_scope: all
phase: phase_1
spec_authority: authoritative (exported from claude.ai project memory 2026-09-17)
---
# Fornax — Claude Code Project Instructions

This repo includes `docs/fornax-specs/` — the full system specification
for Fornax (an AI-powered website + lead-gen platform for trades SMBs).

**Before implementing any feature, read the relevant spec first:**
- Start with `docs/fornax-specs/index.md` for the system map and file list.
- Each numbered system in `docs/fornax-specs/systems/` is a locked build
  spec — treat it as the source of truth for that part of the product.
- `docs/fornax-specs/systems/agent-registry.md` is the source of truth for
  every AI agent in the system — its type, pattern, model tier, retry logic,
  and which other systems share it. Before building or modifying anything
  agent-related, check this file so you don't fork an agent that's supposed
  to be shared (e.g. the Design Agent has four call sites across Systems 4,
  6, 12, and 18 — one implementation, not four).
- `docs/fornax-specs/business-model-and-constraints.md` has the unit
  economics, pricing, and hard operational constraints ($50/mo budget cap
  pre-revenue, solo-founder capacity limits, etc.) — respect these when
  proposing architecture or scope.

If a spec file references something that doesn't yet exist in this repo,
that's expected — the specs describe target state, not current state.
