---
title: Governance System Index
purpose: Single entry point to the complete BuildFlow auto-governance system
status: active
owner: c.t.cohen
updated: 2026-09-16
version: 1.0
critical_path: true
tier_scope: all
phase: operational
related: [GOVERNANCE.md, .workspace.toml]
---

# BuildFlow Governance System — Complete Index

**One place to understand and operate the auto-improving governance system.**

This index maps every component, explains how to use it, and shows the flow from schema → audit → suggestions → enforcement.

---

## First Time Setup

Enable the pre-commit hook to block commits with missing frontmatter (strict phase only):

```bash
git config core.hooksPath .githooks
```

One-time only. After this, new `.md` files without frontmatter will be rejected at commit time (when in strict phase).

---

## Quick Start

**I want to...**

- **Understand how the system works** → Read [`GOVERNANCE.md`](GOVERNANCE.md) (5 min overview + examples)
- **Check workspace compliance** → Run `python3 governance/frontmatter-audit.py audit`
- **Add frontmatter to files** → Run `python3 governance/add-frontmatter.py --apply`
- **See suggestions for rules** → Run `python3 governance/suggestions-engine.py analyze`
- **Approve & apply suggestions** → Run `python3 governance/suggestions-engine.py approve suggest-1`
- **Enforce compliance** → Run `python3 governance/enforce.py` (runs full cycle)
- **Change enforcement phase** → Run `python3 governance/enforce.py --phase strict`
- **Schedule weekly audits** → Use `/schedule --weekly "python3 governance/enforce.py"`

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SCHEMA LAYER                             │
│  .workspace.toml: Rules, fields, paths, phases, thresholds  │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
   ┌─────────────┐        ┌──────────────┐
   │  PARSING    │        │   AUDIT      │
   │  Phase 2    │        │  Phase 3     │
   └─────────────┘        └──────┬───────┘
   (audit.py)                    │
   • Parse YAML              (audit-log.yml)
   • Validate fields         • Coverage %
   • Detect violations       • Missing fields
                             • Stale dates
        │                    • Invalid values
        └────────────┬───────┘
                     │
                     ▼
         ┌───────────────────────┐
         │    SUGGESTIONS        │
         │    Phase 5            │
         ├───────────────────────┤
         │(suggestions-engine.py)│
         │ • Analyze patterns    │
         │ • Propose rule changes│
         │ • Confidence scores   │
         │(suggestions.yml)      │
         └───────────┬───────────┘
                     │
                     ▼
         ┌──────────────────────┐
         │    ENFORCEMENT       │
         │    Phase 6           │
         ├──────────────────────┤
         │  (enforce.py)        │
         │ • Learning: audit    │
         │ • Advisory: warn     │
         │ • Strict: enforce    │
         │ • Auto-fix on demand │
         └──────────┬───────────┘
                    │
            ┌───────┴────────┐
            │                │
         TidyHook      PreCommit Hook
         Integration   (.githooks/)
         (for /tidy)
```

---

## Files & What They Do

### Core Configuration

| File | Purpose | What It Contains |
|------|---------|-----------------|
| **`.workspace.toml`** | Schema definition | Global rules, path-specific rules, exemptions, phase timelines |
| **`GOVERNANCE.md`** | Full documentation | Why, how, examples, FAQ, implementation notes |
| **`GOVERNANCE-INDEX.md`** | This file | Navigation hub, quick reference, architecture |

### Executables

| Script | Phase | What It Does |
|--------|-------|-------------|
| **`governance/frontmatter-audit.py`** | 2–3 | Parse files, validate, report coverage, save audit log |
| **`governance/add-frontmatter.py`** | 4 | Auto-insert frontmatter templates for missing files |
| **`governance/suggestions-engine.py`** | 5 | Analyze patterns, propose rule improvements |
| **`governance/enforce.py`** | 6 | Run full cycle: audit → suggest → warn → fix (phase-aware) |

### Audit & Log Files

| File | What It Contains |
|------|-----------------|
| **`.workspace-audit-log.yml`** | Audit history: coverage %, errors, warnings per run |
| **`.workspace-suggestions.yml`** | Generated suggestions with confidence scores & evidence |
| **`.githooks/pre-commit`** | Git hook: blocks commits if new files lack frontmatter (strict phase) |

---

## How to Use It

### Phase 1: Setup (Done ✅)

Schema defined, all 1,082 files have frontmatter, audit log running.

### Phase 2: Audit & Observe

```bash
# Run audit to see current state
python3 governance/frontmatter-audit.py audit

# Result: .workspace-audit-log.yml updated with findings
# Check coverage % and violations
```

### Phase 3: Suggest Rules

```bash
# Analyze audit log for patterns, generate suggestions
python3 governance/suggestions-engine.py analyze

# Result: .workspace-suggestions.yml with proposals
# Review suggestions and their confidence scores
```

### Phase 4: Enforce

**Learning Phase (now — 2026-09-26):**
```bash
# Run enforcement cycle (audit only, no blocking)
python3 governance/enforce.py
```

**Advisory Phase (2026-09-26 — 2026-11-07):**
```bash
# Switch to advisory: warn on violations but don't block
python3 governance/enforce.py --phase advisory
```

**Strict Phase (2026-11-07+):**
```bash
# Enforce compliance: auto-fix or block commits
python3 governance/enforce.py --phase strict
```

### Phase 5: Auto-Fix (When Needed)

```bash
# Add frontmatter to any files without it
python3 governance/add-frontmatter.py --apply
```

### Phase 6: Integrate with Git

```bash
# Enable git hooks for pre-commit checks (strict phase only)
git config core.hooksPath .githooks

# Now, new .md files must have frontmatter before commit
```

---

## Frontmatter Fields

Every `.md` file declares:

```yaml
---
title:          What is this document?
purpose:        Why does it exist?
status:         draft | active | deprecated | archived
owner:          c.t.cohen | tyler
updated:        YYYY-MM-DD (when last touched)
version:        1.0 (semver, optional)
tier_scope:     micro | smb | mid-market | all (optional)
phase:          phase_1 | phase_2 | phase_3 | operational (optional)
critical_path:  true | false (optional)
related:        [DECISIONS.md, ROADMAP.md] (optional)
---
```

**Required by default:** `title`, `purpose`, `status`, `owner`, `updated`  
**Path-specific:** Stricter for governance files, looser for context

See [`GOVERNANCE.md`](GOVERNANCE.md) for full field reference.

---

## Automation & Scheduling

### Automatic Phase Transitions

Phase-manager.py automatically advances phases on schedule:

```bash
# Run daily (cron or /schedule)
python3 governance/phase-manager.py

# Automatically promotes:
# 2026-09-26 → learning to advisory
# 2026-11-07 → advisory to strict
```

Set it up:
```bash
# One-time: schedule daily at 9 AM
/schedule --daily "python3 governance/phase-manager.py" "Advance governance phases"

# Or via cron:
0 9 * * * cd /Users/c.t.cohen/BuildFlow && python3 governance/phase-manager.py
```

### Scheduled Audits

Run weekly audits to detect workspace drift:

```bash
# One-time: schedule weekly
/schedule --weekly "python3 governance/enforce.py" "Weekly governance audit"

# Or via cron:
0 9 * * 1 cd /Users/c.t.cohen/BuildFlow && python3 governance/enforce.py
```

---

## Current Status

| Phase | Status | Deadline | What Happens |
|-------|--------|----------|--------------|
| **Learning** | 🟢 Active (started 2026-09-12) | 2026-09-26 | Audit only, collect data, generate suggestions |
| **Advisory** | ⏳ Pending | 2026-11-07 | Warn on violations, don't block commits |
| **Strict** | ⏳ Pending | — | Enforce compliance, auto-fix with approval |

**Current:** 1,082 of 1,145 files (94.5% coverage) have compliant frontmatter.

**Phases advance automatically via `phase-manager.py` when scheduled daily.**

---

## Workflows

### Weekly Audit Routine

```bash
# Every Monday, check workspace health
python3 governance/frontmatter-audit.py audit

# Check for new suggestions
python3 governance/suggestions-engine.py suggest

# If advisory phase: review warnings
# If strict phase: fix auto-fixable issues
```

### Adding a New Document

1. Create your `.md` file
2. Copy the frontmatter block (see above)
3. Fill in: `title`, `purpose`, `status`, `owner`, `updated`
4. Optional: add `tier_scope`, `phase`, `critical_path`, `related`
5. Write your content
6. Commit — pre-commit hook validates (if strict phase enabled)

### Proposing a Rule Change

1. Run audit: `python3 governance/frontmatter-audit.py audit`
2. Run suggestions: `python3 governance/suggestions-engine.py analyze`
3. Review `.workspace-suggestions.yml`
4. If approved: apply suggestion (edit `.workspace.toml`)
5. Re-audit to verify change

---

## FAQ

**Q: How do I enable git hooks?**  
A: `git config core.hooksPath .githooks` — runs pre-commit checks on new .md files.

**Q: What if I want to skip frontmatter for a file?**  
A: Add its path to `.workspace.toml` under `[governance.frontmatter.exempt_files]`.

**Q: How often should I audit?**  
A: Weekly during active development. Daily during Phase 1 launches.

**Q: Can multiple people edit the same doc?**  
A: Yes. Update `updated` field whenever you edit. Keep `owner` as primary maintainer.

**Q: What if the suggestion is wrong?**  
A: Don't apply it. The system learns over time as patterns stabilize.

---

## Next Steps

- **2026-09-26:** Review audit log, approve suggestions, transition to advisory phase
- **2026-11-07:** Review compliance data, decide to move to strict phase
- **Ongoing:** Run weekly audits to stay on top of workspace health

---

## See Also

- [`GOVERNANCE.md`](GOVERNANCE.md) — Full system documentation
- [`.workspace.toml`](.workspace.toml) — Schema and configuration
- [`governance/`](governance/) — All scripts and tools
- [`.workspace-audit-log.yml`](.workspace-audit-log.yml) — Audit history
- [`.workspace-suggestions.yml`](.workspace-suggestions.yml) — Rule suggestions
