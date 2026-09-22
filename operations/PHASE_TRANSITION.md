---
title: Phase Transition (Build to Run)
purpose: How every coordinating agent and lane session gets reprogrammed when BuildFlow moves from "being built" to "launched and running." Read this before touching any agent's prompt after launch.
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Phase transition: build → run

**Current phase: BUILD.** Nothing below has happened yet. This file exists so the transition is deliberate and
documented, not improvised in a conversation that later gets lost to context rot.

## The trigger
The transition happens on **Tyler's explicit call**, tied to Gate G8 (soft launch: the 5 Phoenix HVAC prospects
contacted and at least one real customer live) or whatever Tyler actually declares as "we're launched" at the
time. No agent decides this on its own. When Tyler says the word, the coordinating session (whichever Claude
session he's talking to) executes this whole file in one pass, then updates the "Current phase" line above.

## Why reprogram instead of rebuild
State lives in files (`COORDINATOR_STATE.md`, `BUILD_TASKS.md`, lane `STATUS-*.md`), not in a session's memory.
Reprogramming a session or scheduled task means editing its stored prompt and swapping which file it treats as
its task list — the session's identity, folder scope, and history stay exactly as they are. Nothing gets torn
down and recreated.

## What changes, piece by piece

### buildflow-coordinator (scheduled task) → becomes the chief-of-staff / ops loop
- Task source changes from `BUILD_TASKS.md`'s gates (G0-G8, "prove this got built") to an ops backlog driven by
  real metrics: `metrics/METRICS.md`, churn, MRR, support load, conversion rate — the rituals already defined
  in the plan (monthly business review, weekly pipeline report).
- Job shifts from "build toward launch" to "watch the business, catch problems, propose and run improvements,
  escalate only what truly needs Tyler."
- `TYLER_QUEUE.md` keeps the same purpose (the one escalation channel) but the content changes: no more
  "need a Stripe account," now "churn spike in cohort X," "a payment-failure pattern," "support backlog growing."
- `BUILD_TASKS.md` gets archived (not deleted — moved to `archive/`) once every gate is either done or
  consciously deferred; a new `operations/RUN_TASKS.md` replaces it as the ops backlog, same tagging convention
  ([none]/[depends:]/[decision:]/[credential:]) so the format doesn't have to be relearned.

### buildflow-pm-reviewer (scheduled task) → keeps its job, watches a different phase
- Same self-improving weekly review structure. What it evaluates changes from "is the build organized" to
  "are the ops agents behaving well, is the run-phase backlog clear, is Tyler's queue still short and honest."

### The four lane sessions (Foundation, Design, Lead, Content) → narrow to maintenance/improvement, same territory
No new sessions, no folder changes — same ownership, new mission:
- **Foundation** → reliability and cost: uptime, DB performance, hosting cost creep, backup verification
- **Design** → conversion and quality: which templates/profiles actually convert, QA regressions, refreshing
  stale customer sites, the monthly top-3-failure-modes loop (already spec'd, L7 in `LOOPS.md`)
- **Lead** → growth: what's actually converting, A/B tests on outreach (System 17), CAC by channel, expanding
  past the initial verticals
- **Content** → AI-answer/SEO performance (System 16 Layer 2), expanding to new verticals as the business grows

Each keeps the same hard limits it has now: no merges, no touching legal/pricing/outreach without approval, no
guessing on open decisions. What changes is only where they pull their task list from (`RUN_TASKS.md` section
for their lane, instead of `BUILD_TASKS.md`).

### New lanes that may activate at this point (not before)
Public (E), Billing (F), CRM (G), Dashboards (H) — whichever of these are still "not started" at launch either
get stood up for the first time here (if launch happened faster than their build work), or simply also switch
from build-mode to run-mode alongside the original four.

## What does NOT change
- The subservient structure: lane sessions still work only inside their scope and report up; the coordinator
  still holds the single source of priorities.
- The `[decision]`/`[credential]` boundary: agents still never guess on business decisions or act without an
  account Tyler provides.
- `docs/CUSTOMER_VS_INTERNAL.md`'s split between product-for-customers and tools-for-running-the-business.

## Execution checklist (run this when Tyler declares launch)
1. Confirm G8 (or Tyler's actual launch declaration) with real evidence, not a claim.
2. Write `operations/RUN_TASKS.md`, seeded from `metrics/METRICS.md` and any known post-launch priorities.
3. Archive `operations/BUILD_TASKS.md` to `archive/` once its remaining open items are migrated or consciously
   dropped (with a note why).
4. Update `buildflow-coordinator`'s scheduled-task prompt per the section above.
5. Update `buildflow-pm-reviewer`'s scheduled-task prompt per the section above.
6. Update each of the four lane sessions' scope/prompt per the section above.
7. Flip "Current phase" at the top of this file to **RUN**, dated.
8. Tell Tyler plainly what changed and what to expect differently going forward.
