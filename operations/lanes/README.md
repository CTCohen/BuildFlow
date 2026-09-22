---
title: Lanes
purpose: How several Claude sessions build Fornax in parallel without colliding: lanes, ownership, sync, merge order and handoff
status: active
owner: c.t.cohen
updated: '2026-09-19'
version: 1.0.0
tier_scope: all
phase: phase_1
related: [ROADMAP.md, operations/LOOPS.md, operations/TYLER_QUEUE.md]
---

# Lanes: parallel building

Each lane is one Claude session working in its own copy of the repo (a git worktree) on its own branch. Lanes own separate folders so their work does not conflict. Tyler merges finished work into `main`.

| Lane | Branch | Worktree folder | Brief | Owns |
|---|---|---|---|---|
| A. Foundation | `lane/foundation` | `~/BuildFlow-lanes/foundation` | `LANE-A-foundation.md` | `platform/` |
| B. Design engine | `lane/design` | `~/BuildFlow-lanes/design` | `LANE-B-design.md` | `app/`, `design/`, `agents/design/` |
| C. Lead engine | `lane/lead` | `~/BuildFlow-lanes/lead` | `LANE-C-lead.md` | `agents/lead/`, `outreach/`, `messaging/` |
| D. Content (light) | `lane/content` | created when it starts | `LANE-D-content.md` | `knowledge/` |
| E. Public side (light) | `lane/public` | created when it starts | `LANE-E-public.md` | `website/`, `onboarding/` |
| F. Billing and fulfillment | `lane/billing` | created when it starts | `LANE-F-billing.md` | `billing/` |
| G. CRM | `lane/crm` | created when it starts | `LANE-G-crm.md` | `crm/` |
| H. Dashboards | `lane/dashboards` | created when it starts | `LANE-H-dashboards.md` | `platform/dashboards/` |
I. Integration and QA is the main session (root and `metrics/`). The week-by-week schedule and gates are in `ROADMAP.md`.

## Rules
1. **Stay in your folders.** Do not edit another lane's folders or the root docs (`ROADMAP.md`, `DECISIONS.md`, `CLAUDE.md`). If you need a change there, write it in your status file and Tyler's main session applies it.
2. **One shared contract.** Lane A writes `platform/CONTRACT.md` first: the data shapes (Lead, Prospect, Demo, Customer, Website, the client JSON, AgentRun). Other lanes code against it. Nobody changes it except Lane A; ask through your status file.
3. **Read the spec first.** Each brief lists the spec files. Where a spec is thin, research it and write the detail back into that spec file.
4. **No real-world actions.** No real emails, no real charges, no API keys, no deploys. Use mocks and sandboxes. Nothing here needs a paid key yet.
5. **Prove it.** Every agent ships with 15-20 test cases (obvious, edge, failure) that pass before it is called done. Show the output.
6. **Log cost.** Note the tokens used per session in `metrics/token-log.md` (lane rows only). The Claude API is not used; work runs on Claude Pro.

## Staying in sync
At the start of each session: `git fetch` is not needed (same repo); run `git merge main` on your branch to pick up merged work. Commit small and often on your branch.

## Handoff
At the end of each session write or update `operations/lanes/STATUS-<lane>.md` with: done, in progress, blocked, and what needs Tyler. Do not leave uncommitted work.

## Merge order and review
Tyler reviews one lane at a time. Before a lane merges, the main session runs `python3 governance/manifest.py --check` and `python3 governance/enforce.py --lint`. Merge order: A's contract first, then B and C in whichever finishes first, then later lanes.

## Tyler's part
Only Tyler creates accounts and holds keys (see `operations/TYLER_QUEUE.md`). Lanes never ask for keys in chat.
