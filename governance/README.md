---
title: Governance
purpose: Home base for the governance agent — what "governance" means in this workspace, what each script does, and how they run.
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Governance

**This is where the governance agent lives.** Governance in Fornax is not a one-time write-up — it's the set of
scripts in this folder that keep `systems.md`, `operations/BUILD_TASKS.md`, `operations/TYLER_QUEUE.md`, and the
`systems/*.md` files internally consistent over time and catch drift automatically, instead of relying on every
session to remember to update all of them by hand.

The failure mode this exists to prevent: a system file gets renamed or removed and `systems.md`'s table silently
falls out of sync; a retired term (old pricing, an old plan name, an old owner) survives in a doc nobody re-read;
frontmatter goes missing on a new file and nothing catches it until much later. Governance is the mechanism that
makes those things loud immediately instead of rotting quietly.

## Scripts

| Script | What it does |
|---|---|
| `enforce.py` | The main entry point. Runs the stale-term lint (`--lint`) and the `systems.md` <-> `systems/*.md` sync check (`--check-systems`), drives the frontmatter audit/warn/fix cycle for the current enforcement phase (`learning` → `advisory` → `strict`), and can change phase (`--phase <name>`). Run with no args for the full cycle. |
| `manifest.py` | Walks every workspace file, classifies it against the spec-reconciliation rule table (`RULES`), and writes `docs/specs/APPLICATION_MANIFEST.md` — a live status report of what's rewritten/updated/kept/pending from the spec export. `--check` exits 1 if anything is `UNCLASSIFIED` or `PENDING`. |
| `phase-manager.py` | Date-driven. Reads the learning/advisory/strict windows and updates `current_phase` in `.workspace.toml` to match today's date — no manual phase flips needed as the workspace matures. |
| `frontmatter-audit.py` | The frontmatter engine `enforce.py` calls: `audit` (report), `fix` (auto-fix missing/invalid frontmatter), `validate`, `suggest`. Writes `.workspace-audit-log.yml`. |
| `add-frontmatter.py` | Applies frontmatter fixes found by the audit (`--apply`). Called by `enforce.py`'s strict-phase auto-fix step. |
| `suggestions-engine.py` | Generates tidiness/consistency suggestions into `.workspace-suggestions.yml`, run as part of every `enforce.py` cycle. |

## How they're meant to be run

- **Pre-commit (automatic, local):** `.githooks/pre-commit` (active via `git config core.hooksPath .githooks`)
  blocks new `.md` files without frontmatter once the phase is `strict`; warns in `advisory`; no-ops in
  `learning`. It does not currently run `--lint` or `--check-systems` — those are cycle-level checks, not
  per-file ones, and are meant to run at the workspace level (see below), not gate every commit.
- **Scheduled (per `operations/LOOPS.md`, Loop L6 — "Governance and stale-term lint"):** the phase manager runs
  daily (promotes `learning` → `advisory` → `strict` on the calendar dates baked into `phase-manager.py`), and
  the full `enforce.py` cycle — including the stale-term lint and the `systems.md` sync check — runs weekly.
  Neither is wired to a live cron/scheduled-task entry yet; `LOOPS.md` marks L6 as "exists" (the scripts are
  real) but "not running" (nothing schedules them yet, tracked with the rest of the loops in
  `operations/LOOPS.md`'s Status note).
- **Manual (anytime):** run any of the commands below directly. This is the normal path today, since L6 isn't
  scheduled yet.

```bash
# Full cycle: stale-term lint + systems.md sync check + frontmatter audit/warn/(fix in strict)
python3 governance/enforce.py

# Stale-term lint only, exits 1 on any hit
python3 governance/enforce.py --lint

# systems.md <-> systems/*.md bidirectional sync check only, exits 1 on any mismatch
python3 governance/enforce.py --check-systems

# Advance/set the enforcement phase
python3 governance/enforce.py --phase advisory

# Regenerate the application manifest (docs/specs/APPLICATION_MANIFEST.md)
python3 governance/manifest.py
python3 governance/manifest.py --check     # exit 1 if anything UNCLASSIFIED/PENDING

# Date-driven phase promotion (what a daily scheduled run would call)
python3 governance/phase-manager.py
```

## The `systems.md` sync check

`enforce.py --check-systems` (folded into the default full-cycle run too, alongside the stale-term lint — same
"report always, block only in `strict`" treatment) checks both directions:

1. Every file path listed in `systems.md`'s `| System | File | Status |` table must exist under `systems/`.
2. Every real `systems/*.md` file (except this folder's own `README.md`, which isn't a system) must be listed
   in that table.

A mismatch in either direction prints the specific file(s) at fault and exits non-zero. This is what `systems.md`
itself refers to under its own "Governance" section as "implementation pending" — it is no longer pending.

## Not yet built here

- L6 is not wired to an actual cron job or `mcp__scheduled-tasks__*` entry — someone still has to run these
  commands by hand or via `/schedule` until that's set up.
- The stale-term lint and the `systems.md` sync check both currently only *report* outside of `strict` phase;
  they don't yet block a commit the way the frontmatter check does via `.githooks/pre-commit`. If Tyler wants
  either to gate commits before `strict` phase, that's a `.githooks/pre-commit` change, not an `enforce.py` one.
