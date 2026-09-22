---
title: PM Review
purpose: Weekly project-management review of BuildFlow's organization and communication — a separate, slower check from the daily coordinator loop
status: active
owner: c.t.cohen
updated: '2026-09-21'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# PM Review

## 2026-09-21 (first review)

**Note on timing:** the `buildflow-coordinator` scheduled task ran live, in parallel with this review (its output
landed in `COORDINATOR_STATE.md` and `BUILD_TASKS.md` while this review was in progress). This review reflects
the files *after* that run, and evaluates that run's behavior below.

### For Tyler, plain language
The project is staying organized, and the coordinator caught something good on its own today: it found a leftover
broken piece of code in the site-builder that was silently failing a check nobody was running, deleted it, and
re-confirmed all 67 tests still pass. That's exactly the kind of thing it should be doing unattended.

There is one small process gap: the four lane sessions that finished Sunday each left you specific notes ("needs
from Tyler"), and those notes weren't making it into your queue automatically — they live on git branches the
daily helper wasn't checking. I found this, added the two real, current items to `TYLER_QUEUE.md` myself, and
proposed a fix so it stops happening. From your side, `TYLER_QUEUE.md` now has two new things worth two minutes:

1. **Run one script and paste back what it prints** — proves the database's core safety property and is the one
   thing blocking the Foundation lane from being called done.
2. **Give a mailing address** for outreach emails (legally required) and skim 5 small technical yes/no defaults
   from the lead-engine lane.

Nothing else needs you yet. No lane has merged to `main`, which is expected — nothing has cleared its proof gate.

### For the coordinating Claude session — findings

**1. Lane handoff files exist but are structurally invisible to the daily coordinator.**
Per `operations/lanes/README.md`, each lane writes `operations/lanes/STATUS-<lane>.md` on its own branch at
handoff. All four active lanes did this: `lane/foundation:...STATUS-foundation.md`, `lane/design:...STATUS-B-design.md`,
`lane/lead:...STATUS-lead.md`, `lane/content:...STATUS-content.md`. None are on `main` (no lane has merged), and
**`buildflow-coordinator`'s own SKILL.md Step 1 orientation list never mentions these files** — confirmed by
reading `/Users/c.t.cohen/.claude/scheduled-tasks/buildflow-coordinator/SKILL.md` directly, zero occurrences of
"STATUS". This is the root cause of finding 2, and it did not self-correct even in today's live coordinator run
(see below) — its own report added a new code-level finding to `BUILD_TASKS.md` but still didn't touch the
lane-STATUS-to-TYLER_QUEUE gap, because nothing in its instructions tells it to look.

**2. Concrete, current "needs Tyler" items were sitting unsurfaced — confirmed still true after today's live run.**
- `STATUS-foundation.md` asks Tyler to run `platform/db/run-local.sh` and paste back the output. This is the
  literal #1 item in `COORDINATOR_STATE.md`'s own "Next coordinator action" section (both before and after
  today's run), yet it was never a line in `TYLER_QUEUE.md` until this review added it.
- `agents/lead/TASKS.md` (on `lane/lead`) lists a postal-address requirement and 5 named implementation
  assumptions under "Blocked on / needs Tyler." None were in `TYLER_QUEUE.md` until this review added them.
- By contrast, `STATUS-B-design.md`'s asks (run Lighthouse, hand-score first 10 sites) are correctly *absent*
  from the queue — the plan explicitly defers browser/QA checks to W6, and `BUILD_TASKS.md` §3 already reflects
  that. No drift there — the gap is specific to items STATUS files raise that aren't already covered by the
  plan's own deferral rules.

**3. `TYLER_QUEUE.md` was substantially rewritten during this review window** (three-section structure: genuinely
blocking / accounts+credentials / decisions-with-defaults, version bumped 1.0.0 → 2.0.0), by a process outside
this review — likely the same coordinator run or a concurrent session. It's a real clarity improvement (grouping
by urgency instead of by source), but the new schema has no natural slot for "a quick hands-on action that isn't
an account and isn't a decision" — I used section 1 for the isolation-test-run and postal-address items since
they're genuinely blocking a specific gate, but if this kind of item recurs, the schema should grow a fourth
category rather than forcing everything into "blocking."

**4. `STATUS-*.md` naming is inconsistent across the four lanes that have used it**:
`STATUS-foundation.md`, `STATUS-B-design.md`, `STATUS-content.md`, `STATUS-lead.md` — three different
conventions. `LANE-*.md` briefs are consistently `LANE-<letter>-<name>.md`; the status files should match before
lanes E-H start and add more.

**5. Executor (buildflow-coordinator) behavior today: good.** It found a real correctness bug (dead code in
`agent-decisions.ts` silently breaking `tsc`, uncaught because the normal test suite doesn't run a type-check),
fixed it minimally, and verified by re-running all 67 design tests before calling it done — exactly the
"prove it, don't claim it" standard this project holds itself to. It correctly identified the styleProfile /
theme-wiring gap as a design judgment call, not a Tyler decision, and logged it to `BUILD_TASKS.md` instead of
guessing. It respected every hard limit (no merge, no push to main, nothing in `legal/`/pricing/outreach touched).
It reported a GitHub push failure honestly as a network issue rather than silently dropping it or treating it as
fatal. No signs of being stuck in a loop or re-doing verified work. One gap: it still didn't reconcile lane
STATUS files against `TYLER_QUEUE.md` (finding 1-2) — not a behavior problem, an instructions problem.

**6. Everything else checked out clean.** `BUILD_TASKS.md` blocked-by tags all matched what the lane files
actually say — no stale tags, nothing marked done without a commit hash or test count behind it.
`TYLER_QUEUE.md`'s decision list matches `RECONCILIATION_LOG.md`'s "needs your input to finish" list exactly
(D02/D05/D22/D26/D29/D32 plus D01/D03/D04 tracked separately) — no duplicates, nothing resolved-but-still-listed.
`COORDINATOR_STATE.md`'s gate table (G0-G8) matches the plan file's own A4 table exactly. No lane STATUS file
overclaims — Foundation is explicit its SQL is "reviewed by eye only" and has never actually run, which
`COORDINATOR_STATE.md` correctly carries as "unverified," not "done."

### Proposed changes

1. **Applied now:** added the isolation-test-run instruction, the postal-address ask, and the 5-assumption
   confirmation list to `TYLER_QUEUE.md` §1, sourced verbatim from `STATUS-foundation.md` and
   `agents/lead/TASKS.md` — not invented. Fixed a frontmatter date typo (`2026-09-22` → `2026-09-21`) and bumped
   to v2.1.0.
2. **Applied now:** added the matching postal-address and assumptions-confirmation subtasks to `BUILD_TASKS.md`
   §4, so the task tree and the queue agree. Bumped to v1.0.2.
3. **Proposed, not applied — needs a human read before it changes an unattended agent's behavior:** add to
   `buildflow-coordinator`'s SKILL.md, in Step 1 or Step 2:

   > Also check each active lane's handoff file on its own branch: `git show lane/<x>:operations/lanes/STATUS-<lane>.md`
   > for foundation, design, lead, content (filenames aren't standardized yet — see `operations/PM_REVIEW.md`
   > 2026-09-21). For every item under that file's "Needs Tyler" / "Blocked on" section, confirm a matching entry
   > exists in `operations/TYLER_QUEUE.md`; append any that are missing, in plain language, before Step 3.

   This directly closes findings 1-2 and should be a standing part of daily orientation, not a one-time fix.
4. **Proposed, not applied — cosmetic, do before lanes E-H start:** standardize the four existing `STATUS-*.md`
   filenames to `STATUS-<letter>-<name>.md` (`STATUS-A-foundation.md`, `STATUS-B-design.md`,
   `STATUS-C-lead.md`, `STATUS-D-content.md`) and say so explicitly in `operations/lanes/README.md`'s "Handoff"
   section. Not renamed here — these files live on other lanes' in-progress branches, not mine to touch mid-work.
5. **Proposed, not applied:** if `TYLER_QUEUE.md` keeps getting quick hands-on asks that are neither an
   account/credential nor a decision-with-a-default (like today's script-run and postal-address items), give it
   a fourth top-level section for that category instead of stretching "genuinely blocking work" to cover both
   meanings.
