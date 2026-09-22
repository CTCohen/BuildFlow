---
title: Outbound System
purpose: Authoritative spec and build checklist for lead discovery, scoring, and cold outreach. Superseded/absorbed from outreach/SPEC-07-lead-pipeline.md, agents/AGENT_REGISTRY.md (Lead agents section).
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Outbound System

Finds candidate businesses, scores whether they're a fit and which tier, and contacts them with a personalized
demo link on a fixed schedule — without Tyler doing manual prospecting. Code: `agents/lead/`.

## Built and verified
- [x] Business-size classification and tier routing (Micro under 3 employees, SMB 3-20, Mid-Market above/$5M+)
  — kept as built, ruled by Tyler 2026-09-21, matches `docs/PRICING_STRATEGY_RESEARCH.md`. `agents/lead/size.py`.
- [x] Lead scoring model — `agents/lead/` scoring logic, part of 101/101 passing test suite
  (`python3 -m agents.lead.run_evals`, verified live 2026-09-22).
- [x] Lead lookup with automated deep-research fallback — replaces manual Tyler review entirely (ruled
  2026-09-21): below 0.7 confidence, a second pass widens provider fan-out and cross-checks the business's own
  website/GBP listing directly. Still unconfirmed after that → auto-suppressed, never surfaced to Tyler.
  `agents/lead/lookup.py`.
- [x] Outreach template sequence (5 touches: day 0/3/7/14/21) — drafted, code-gated from sending until Tyler
  approves the copy (`messaging/outreach_sequence_draft.json`, `meta.status` must flip `draft`→`approved`).
- [x] Send workflow, sandboxed — `agents/lead/send.py`. Hard-refuses to run without a configured mailing
  address (CAN-SPAM); wired to read Tyler's address from a gitignored local file, never hardcoded.
- [x] Sender address ruled: `hello@` (D01, ruled 2026-09-21).
- [x] Contract adapter — maps this system's lead/prospect data into the shared database's real table shapes
  (`agents/lead/adapter.py`), so this system and the CRM/dashboard systems agree on one shape.
- [x] Mid-Market leads: captured in the warehouse, never contacted, nothing built beyond storage (D29, changed
  2026-09-21 from the old "suppress entirely" default).
- [x] Five send-mechanics defaults kept as built (weekend sends allowed, 5% bounce-rate auto-pause, skip
  follow-up if already opened, calendar days not business days, Eastern time for unrecognized states) — ruled
  2026-09-21, revisit only if a real problem shows up.

**Test evidence:** 101/101 (`python3 -m agents.lead.run_evals`), re-verified live 2026-09-22.

## Specified, not yet built
- [ ] Real send capability — needs a SendGrid account + a warmed sender domain (no account exists yet)
- [ ] Real lead-data providers (Apollo, Hunter, Google Places) — currently mocked; needs those accounts
- [ ] Real outreach copy sent to a real prospect — needs Tyler's approval of the drafted copy, plus SendGrid

## Possible future specs (not built, not committed to)
- SMS outreach — explicitly off at launch (email-only), could be added later
- Multi-language outreach — English-only at launch, Spanish templates exist but aren't wired to send

## Open questions
- Company-size cutoffs (Micro/SMB/Mid-Market boundary numbers) were ruled but not battle-tested against real
  leads yet — revisit once real outreach starts producing data.
