---
title: Coordinator State
purpose: The single source of truth for what is done, in progress, and open across every lane. Read this file FIRST, before answering any question about build status. Update it LAST, after every check-in or merge. This file exists so status survives context loss between sessions — nothing about launch progress should be trusted from memory alone.
status: active
owner: c.t.cohen
updated: '2026-09-21'
version: 1.3.0
tier_scope: all
phase: phase_1
---

## Latest coordinator run — 2026-09-21 (design lane session)

Pushed lane/design's previously-stuck commit (`a6c2940`) to GitHub successfully this run — GitHub was reachable
this time (last run's proxy timeout was transient, not a login problem).

Then picked up the top open item in BUILD_TASKS.md §3: "wire the customer's chosen styleProfile into the live
Design Agent." Investigating it found that item was a **false gap** — the real production pipeline
(`agents/design/design-agent.mjs`, functions `pickTheme`/`resolveDesign`) already reads `client.styleProfile`,
resolves it through `styleProfiles.json` to a theme in `themes-30.json`, and writes the resolved brand colors
into the client JSON the Astro site actually renders from. This was already proven passing by the existing eval
suite (`design.eval.mjs` d01/d02/d09/d14/d15) — 67/67 both before and after this session's change. The prior
"gap" was caused by `app/src/lib/agent-decisions.ts` and `app/src/data/vertical-pools.ts`: an earlier, orphaned
design-decision engine that was never imported by any live code path (only referenced in archived docs) and that
ignored `styleProfile`. Archived both files to `archive/legacy-agent-decisions/` (commit `c5119fc`, pushed) rather
than leaving them to keep misleading future audits. No design-system judgment call was actually needed, so
nothing new was logged to TYLER_QUEUE.md for this. BUILD_TASKS.md §3 updated to mark this item done with evidence.

# Coordinator state

**Rule for whoever (or whichever Claude session) reads this: this file, not memory or a prior conversation, is the record.
If this file disagrees with something a session "remembers," this file wins. Update it every time state changes —
a lane merges, a gate is proven, Tyler rules on a decision, a task finishes.**

Last full lane audit: **complete, 2026-09-21** (agent `afe09b48d4d1414b2`). Read-only, no merges/edits/deletions.
Findings below are backed by commands actually run in that audit (test suites executed live, not re-read from
claims) — commit hashes and file paths are exact. Re-run this audit before trusting any lane's status again if
significant time or new commits have passed.

---

## 1. Gates (from the plan; proof required, not claims)

| Gate | Proof required | Status | Evidence |
|---|---|---|---|
| G0 contract published | `platform/CONTRACT.md` committed; other lanes' code imports its shapes | ✔ done | `platform/CONTRACT.md` (208 lines, substantive) at commit `4462209` on lane/foundation |
| G0 isolation test passes | RLS isolation test actually runs and passes | ✔ **done** | Run by Tyler on his Mac 2026-09-21 via `platform/db/run-local.sh`: every isolation check PASS (cross-customer denial, anon/stranger denial, admin/service_role access, data-integrity guards) and every monitoring test PASS. Output ended "ALL DB TESTS PASSED." |
| G1 design engine | Generated site for a vertical/tier + build-time numbers vs 10s target | ✔ done | 67/67 evals passed, run live by the audit; `agents/design/BENCHMARKS.md` shows ~1.22s/site build vs 10s target (M1, Node 22.23.1) |
| G2 lead pipeline | Scores match spec thresholds; send dates correct; unsubscribe test passes | ✔ done (on mocks) | 99/99 evals passed, run live 2026-09-21 (was 89/89; +8 adapter, +2 sender evals in `ed9f4e4`). Contract adapter now exists (`agents/lead/adapter.py`) but nothing calls a real DB client yet — still in-memory/plain-dict at runtime, self-disclosed in `agents/lead/TASKS.md` |
| G3 data flow | Scored lead + demo appear as rows in the database | ☐ not started (needs real Supabase, Phase 2) |
| G4 payment to live | Test-mode payment → live site <60s | ☐ not started (Track F not begun) |
| G5 demo | Demo link showing site + tier sandbox dashboard | ☐ not started (Track H not begun) |
| G6 end to end | Full funnel dry run | ☐ not started |
| G7 legal | Counsel sign-off on Terms/Privacy | ☐ not started (needs T1 lawyer) |
| G8 soft launch | 5 Phoenix HVAC prospects contacted | ☐ not started |

## 2. Lanes

| Lane | Branch | Worktree | Commits ahead of main | Status | Merged to main? |
|---|---|---|---|---|---|
| A Foundation | lane/foundation | ~/BuildFlow-lanes/foundation | 2 (`4462209`,`2dd5a19`) | Contract + migrations + RLS policies + service (6/6 tests pass) + isolation/monitoring DB tests — **all confirmed passing on Tyler's Mac 2026-09-21**. Fully proven, ready to merge. | No |
| B Design | lane/design | ~/BuildFlow-lanes/design | 4 (`bd2db94`,`a6c2940`,`56af207`,`c5119fc`) | Verified: 67/67 evals pass live; real build-speed benchmark 1.22s vs 10s target. `a6c2940` (2026-09-21) removes dead code that broke `tsc`. `c5119fc` (2026-09-21) archives `agent-decisions.ts`/`vertical-pools.ts` — investigated the "wire styleProfile" task and found it was already done in the real pipeline (`agents/design/design-agent.mjs`); those two files were an orphaned, never-imported earlier design engine that made the gap look real (see BUILD_TASKS.md §3). All 4 commits now pushed to GitHub. | No |
| C Lead | lane/lead | ~/BuildFlow-lanes/lead | 3 (`1ae4bda`,`d3c0f19`,`ed9f4e4`) | Verified: 99/99 evals pass live (`python3 -m agents.lead.run_evals`, run 2026-09-21). `ed9f4e4` adds `agents/lead/adapter.py` — pure functions mapping this lane's plain-dict leads to `platform/CONTRACT.md`'s `admin.lead_warehouse`/`leads`/`prospects`/`outbound_campaign_runs` row shapes (D29-enforced: `to_prospect_row()` raises on a suppressed/Mid-Market lead) — and wires D01 (`hello@` sender) into `send.py`'s `Campaign.sender_email`. Still in-memory only, no DB client wired (no real Supabase project yet); no real send (by design — needs Tyler approval + real address first). | No |
| D Content | lane/content | ~/BuildFlow-lanes/content | 2 (`2e39a9e`, new) | Reviewed by coordinator session; validator passed 49/49, 0 stubs/dangling in graph. New commit (2026-09-21) adds `facts` (fact-density) content to all 24 pool service cards per SPEC-16 Layer 1 / `ai-seo-setup.md` step 3 (D26 reconfirmed tonight); validator extended and passes 52/52 live. | No — awaiting merge order (after Foundation) |
| E Public | — | not started | 0 | Not started (planned W2) | — |
| F Billing | — | not started | 0 | Not started (planned W3, needs A+Stripe test) | — |
| G CRM | — | not started | 0 | Not started (planned W3, needs A+HubSpot app) | — |
| H Dashboards | — | not started | 0 | Not started (planned W4, needs A+B) | — |
| I Integration/QA | this session | main | — | Ongoing (this file + audits) | — |

**Merge order rule (from the plan, A5):** Foundation first (owns the contract), then whichever of Design/Lead/Content
is cleanest, then the rest. Tyler approves every merge. Never merge without re-running
`python3 governance/manifest.py --check` and `python3 governance/enforce.py --lint` clean first.

## 3. Launch-plan step checklist (Part 3b of the plan; ✔ done / ◐ partial / ☐ open / ⏸ deferred)

Source of truth for the full list: the plan file itself
(`/Users/c.t.cohen/.claude/plans/snazzy-hatching-babbage.md`, Part 3b). Do not re-derive this from memory —
re-read that file's checkboxes when in doubt, they are the canonical list. This section tracks only what's
changed **since** the plan was last read in full.

- Step 1 (migrate specs) — ✔/◐ as of plan writing, unchanged since
- Step 2 (reconcile then implement) — ◐, D06/D14/D15/D42 ruled, rest provisional (see TYLER_QUEUE.md)
- Step 3 (build agents) — ⏳ in progress across lanes A/B/C, unverified until audit lands
- Step 4 (design system + looped testing) — ⏳ in progress in lane/design, unverified
- Step 5 (onboarding/offboarding videos) — ☐ not started (needs a working dashboard first)
- Step 6 (website, dashboards, logo, admin) — ☐ not started
- Step 7 (tranche dashboards) — ☐ not started
- Step 8 (end-to-end testing / the gate) — ☐ not started

## 4. Open decisions blocking nothing yet, but need Tyler eventually

See `TYLER_QUEUE.md` — do not duplicate that list here. This file only tracks **build status**; TYLER_QUEUE.md
tracks **what needs Tyler**. Keep them separate.

## 5a. Standing references (read once, applies always)
- `docs/CUSTOMER_VS_INTERNAL.md` — which folders/systems are the product (for customers) vs our own ops (for us). Check before creating any design, dashboard, or CRM file.
- `operations/PHASE_TRANSITION.md` — how every agent gets reprogrammed when BuildFlow moves from build to run. Current phase: BUILD. Do not act on this file's checklist until Tyler explicitly declares launch.

## 5. Next coordinator action (as of 2026-09-21, post coordinator run)

1. ~~Push lane/design's commit (`a6c2940`) to GitHub~~ — done this run, and its follow-up (`c5119fc`) also pushed.
2. **Get Foundation's isolation test actually run** — on Tyler's Mac or a CI runner, not in a sandboxed session
   (`platform/db/run-local.sh`, then the isolation SQL test). This is the one unverified gate; nothing else found
   any stub or red flag.
3. Once that's confirmed, merge order: **Foundation → Content → Design → Lead** (Tyler approves each).
4. ~~Lead lane needs a short follow-up pass adding the adapter~~ — done, see §4 in BUILD_TASKS.md (`ed9f4e4`).
5. ~~Wire the customer's chosen styling profile into the live Design Agent~~ — done this run; it was already
   wired in the real pipeline, see `operations/BUILD_TASKS.md` §3 for the evidence. No design-system judgment
   call was actually needed.
6. `operations/TYLER_QUEUE.md`: D01 and D22 were ruled 2026-09-21 ("Ruled tonight" section) — D01 (`hello@`
   sender) is now wired into lane/lead's `send.py` (`ed9f4e4`). D02, D32, and the rest of §4 in that file are
   still open with working defaults in use; they block nothing technically yet but should get Tyler's
   attention before Phase 2 (billing/CRM) starts.
7. No lane needs rework for stub/red-flag reasons beyond the dead-code fixes made across recent runs.
8. Re-run this file's update after every merge, every gate proof, every Tyler ruling.

---

### How to keep this file honest
- Never write "done" here without a file path, commit hash, or command output backing it.
- If a lane's own STATUS-<track>.md claims something this file hasn't verified, mark it ⏳ pending audit, not ✔.
- Re-read this file at the start of every coordinator session/turn, before answering "what's left."
- Update the `updated:` frontmatter date every time this file changes.
