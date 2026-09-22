---
title: Loops
purpose: The automated loops that move Fornax forward without Tyler doing the manual work: trigger, where it runs, inputs and outputs, approval gate, and budget
status: active
owner: c.t.cohen
updated: '2026-09-18'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Loops

Lanes: **A** deterministic, **B** attended or scheduled on Tyler's Pro, **C** capped API (`docs/LLM_COST_AND_API_PLAN.md`). Every loop logs tokens and dollars to `metrics/token-log.md`; L10 kills any loop at its cap. Anything needing Tyler goes to `operations/TYLER_QUEUE.md`.

| # | Loop | Trigger | Runs where | Inputs → outputs | Approval gate | Lane / budget |
|---|---|---|---|---|---|---|
| L1 | Spec-to-code build (per system) | Tyler starts it (multi-agent workflow opt-in), in dependency order | Tyler's Claude Code, isolated git worktrees | SPEC + registry entry + `TASKS.md` → branch, tests, reviewer report | Tyler merges; the reviewer agent must fail to refute first | B; at most 5 agents per workflow |
| L2 | Agent eval | Every agent change and nightly | Local or CI | 15-20 cases per agent → pass/fail in `metrics/eval/` | Blocks "done"; regressions go to the queue | A (assertions); judge via Batch up to $1 per run |
| L3 | Design Build → Test → Learn | Weekly and on template change | Tyler's Mac (Playwright and Lighthouse need a local browser) | N sample clients → `qa.mjs` → `knowledge/test-logs/round-NN.md` and patches | Tyler reviews systemic fixes; first 10 sites hand-scored | B; ~5% rubric sample |
| L4 | Demo generation batch | Nightly | Tyler's Mac first; server plus Batch API later | Approved lead list, copy pool, tier → bundles on R2 plus QA result | Automatic within the daily cap; escalations to the queue | B/C; inside the $30 cap |
| L5 | Outreach send | Daily 9 AM local | Server cron | Leads scoring 70+ and templates → SendGrid sends and events | Templates approved once; volume dial; new copy needs approval | A (touch-1 hook via Workers AI) |
| L6 | Governance and stale-term lint | Daily phase manager; weekly enforce | Scheduled task or cron | Repo → audit log, suggestions, lint report | Tyler approves rule changes | A |
| L7 | QA failure-mode learning | 1st Friday monthly | Scheduled | Rejection-reason log → top-3 report and prompt-patch proposal | Tyler approves any prompt change | B |
| L8 | Monthly Business Review | 1st Friday monthly | Scheduled | Stripe and Supabase metrics, spend logs → one-page review | Tyler decides (30 minutes) | B, tiny |
| L9 | Weekly pipeline report | Mondays | Server | SendGrid and Supabase → funnel and CAC report | Tyler reads | A |
| L10 | Cost guard | Hourly and on every LLM call | Server and local | Provider usage → `token-log.md`, kill switch at cap, queue alert | Automatic kill; Tyler resets | A |
| L11 | Blocked-on-Tyler digest | Daily | Scheduled | `TYLER_QUEUE.md`, git state → one message of what needs him | none | B, tiny |
| L12 | Production jobs | Schedules from Systems 13, 2, 9, 12 | Server | Health checks, CRM push (5 min), review sync (daily), churn score, dunning state machine | Escalations per registry Section F | A |
| L13 | Support triage | Inbound email | Server | Email → classify, KB reply, or queue | P0/P1 and low confidence always go to Tyler | Workers AI or Haiku inside the cap |
| L14 | Spec gap-fill (launch plan 2.7) | Before each system's build | Tyler's Claude Code | Thin spots in a SPEC → researched detail written back into the spec | Real decisions go to the conflict log | B |

## Status
None of these loops is running yet. L6 exists as `governance/enforce.py` (with the stale-term lint) and `governance/phase-manager.py`; L3 extends `scripts/testing-loop.mjs` and `scripts/analyze-loop.mjs`. The rest are built during Phases 1-3 per `ROADMAP.md`.
