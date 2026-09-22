#!/usr/bin/env python3
"""
Fornax Governance Enforcement
Phase 6: Tidy integration + progressive enforcement

Enforces frontmatter compliance based on current phase (learning → advisory → strict)

Usage:
  python3 enforce.py                          # Run full enforcement cycle
  python3 enforce.py --phase learning         # Set enforcement phase
  python3 enforce.py --phase advisory
  python3 enforce.py --phase strict
  python3 enforce.py --lint                   # stale-term lint only (exit 1 on hits)
  python3 enforce.py --check-systems          # systems.md <-> systems/*.md sync check only (exit 1 on mismatch)
"""

import os
import sys
import yaml
import subprocess
from pathlib import Path
from datetime import datetime
from typing import Tuple

# ============================================================================
# ENFORCEMENT PHASES
# ============================================================================

PHASES = {
    'learning': {
        'description': 'Audit only, no enforcement',
        'actions': ['audit'],
        'blocks_commits': False
    },
    'advisory': {
        'description': 'Warn on violations, suggest fixes',
        'actions': ['audit', 'warn'],
        'blocks_commits': False
    },
    'strict': {
        'description': 'Require compliant frontmatter, auto-fix with approval',
        'actions': ['audit', 'warn', 'fix'],
        'blocks_commits': True
    }
}

# ============================================================================
# STALE-TERM LINT (spec reconciliation 2026-09-18)
# ============================================================================

import re

# Terms retired by the spec export and Tyler's rulings. Content below a "## Superseded" or
# "## Earlier decisions" heading is history and is not linted.
STALE_TERMS = [
    (r"\bChase\b", "owner is Tyler"),
    (r"\$99\s*(?:/|a |per )\s*mo", "old SMB price; SMB is $249/mo"),
    (r"\$99/month", "old SMB price; SMB is $249/mo"),
    (r"\$497\b", "old Ownership price; SMB Offboard is $799"),
    (r"\$990/y", "old annual price; SMB annual is $2,490/yr"),
    (r"Managed Growth", "plan is named Managed"),
    (r"\bOwnership (?:plan|pricing|package)\b", "plan is named Offboard"),
    (r"no Anthropic API", "Claude API is allowed, capped, for unattended real-time steps"),
]
LINT_EXEMPT = ("archive/", "node_modules/", ".git/", "RECONCILIATION_LOG.md", "IMPLEMENTATION_ROADMAP.md",
               "docs/specs/", "docs/PRICING_STRATEGY_RESEARCH.md", "research/", "governance/", "dist/", ".astro/", "app/src/data/clients/")
LINT_EXTS = (".md", ".astro", ".txt", ".html", ".toml", ".mjs", ".ts")

def lint_stale_terms(workspace_root: str) -> list:
    """Return [(path, line_no, term, hint)] for retired terms found outside history sections."""
    hits = []
    root = Path(workspace_root)
    for path in root.rglob("*"):
        if not path.is_file() or path.suffix not in LINT_EXTS:
            continue
        rel = str(path.relative_to(root))
        if any(rel.startswith(e) or f"/{e}" in f"/{rel}" for e in LINT_EXEMPT) or "SPEC-" in rel or rel in ("docs/01-business-operations-system.md", "docs/BUSINESS_MODEL.md", "specs/05-feature-system.md", "agents/AGENT_REGISTRY.md"):
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except Exception:
            continue
        m = re.search(r"^## (?:Superseded|Earlier decisions)", text, re.M)
        if m:
            text = text[:m.start()]
        for i, line in enumerate(text.splitlines(), 1):
            for pat, hint in STALE_TERMS:
                if re.search(pat, line):
                    hits.append((rel, i, pat, hint))
    return hits

# ============================================================================
# SYSTEMS.MD <-> systems/*.md SYNC CHECK
# ============================================================================

def check_systems_sync(workspace_root: str) -> list:
    """
    Bidirectional consistency check between systems.md's table and the real files
    under systems/.

    Returns a list of human-readable problem strings; empty list means clean.
      1. Every row in systems.md's `| System | File | Status |` table must point to a
         file that actually exists under systems/.
      2. Every actual systems/*.md file must be referenced by some row in that table.
    """
    root = Path(workspace_root)
    index_path = root / "systems.md"
    problems = []

    if not index_path.exists():
        return ["systems.md not found"]

    text = index_path.read_text(encoding="utf-8")

    # Pull every markdown link that points at systems/*.md out of the table rows.
    # Row shape: | System | [systems/foo.md](systems/foo.md) | status |
    listed = set(re.findall(r"\(systems/([A-Za-z0-9_\-]+\.md)\)", text))

    if not listed:
        problems.append("systems.md: no systems/*.md rows found in the table (parse failure or empty table)")

    # Direction 1: every listed file must exist.
    for name in sorted(listed):
        if not (root / "systems" / name).exists():
            problems.append(f"systems.md lists 'systems/{name}' but that file does not exist")

    # Direction 2: every real systems/*.md file must be listed (README.md is the folder's
    # own doc, not a system, and is exempt).
    systems_dir = root / "systems"
    if systems_dir.is_dir():
        for f in sorted(systems_dir.glob("*.md")):
            if f.name == "README.md":
                continue
            if f.name not in listed:
                problems.append(f"systems/{f.name} exists but is not listed in systems.md's table")

    return problems


# ============================================================================
# ENFORCEMENT LOGIC
# ============================================================================

def load_enforcement_state(workspace_root: str) -> Tuple[str, datetime]:
    """Load current enforcement phase and start date"""
    config_path = Path(workspace_root) / ".workspace.toml"

    try:
        with open(config_path, 'r') as f:
            content = f.read()
            # Simple parse for current_phase
            for line in content.split('\n'):
                if 'current_phase' in line and '=' in line:
                    phase = line.split('=')[-1].strip().strip("'\"")
                    return phase, datetime.now()
    except:
        pass

    return 'learning', datetime.now()

def run_audit(workspace_root: str) -> dict:
    """Run frontmatter audit"""
    print("\n🔍 Running audit...")
    result = subprocess.run(
        ['python3', 'governance/frontmatter-audit.py', 'audit'],
        cwd=workspace_root,
        capture_output=True,
        text=True
    )

    # Note: audit script may return non-zero even on success (output contains errors)
    # We only check for catastrophic failure via stderr containing "Traceback"
    if "Traceback" in result.stderr:
        print(f"❌ Audit failed: {result.stderr[:200]}")
        return {}

    # Parse audit log (handles multiple YAML documents)
    log_path = Path(workspace_root) / ".workspace-audit-log.yml"
    if log_path.exists():
        try:
            with open(log_path, 'r') as f:
                entries = list(yaml.safe_load_all(f)) or []
                if entries:
                    # Find the last dict entry (contains summary)
                    for entry in reversed(entries):
                        if isinstance(entry, dict):
                            return entry
                    return {}
        except Exception as e:
            print(f"⚠️  Failed to parse audit log: {e}")
            return {}

    return {}

def run_suggestions(workspace_root: str):
    """Run suggestion engine"""
    print("\n💡 Generating suggestions...")
    result = subprocess.run(
        ['python3', 'governance/suggestions-engine.py', 'analyze'],
        cwd=workspace_root,
        capture_output=True,
        text=True
    )

    if result.returncode != 0:
        print(f"⚠️  Suggestions failed: {result.stderr}")
        return

    # Load and display suggestions
    suggestions_path = Path(workspace_root) / ".workspace-suggestions.yml"
    if suggestions_path.exists():
        with open(suggestions_path, 'r') as f:
            suggestions_data = yaml.safe_load(f) or {}
            pending = suggestions_data.get('pending', 0)
            if pending > 0:
                print(f"   💡 {pending} suggestions pending")

def auto_fix_frontmatter(workspace_root: str):
    """Auto-fix missing frontmatter (strict phase only)"""
    print("\n✍️  Auto-fixing missing frontmatter...")
    result = subprocess.run(
        ['python3', 'governance/add-frontmatter.py', '--apply'],
        cwd=workspace_root,
        capture_output=True,
        text=True
    )

    if result.returncode != 0:
        print(f"❌ Auto-fix failed: {result.stderr}")
        return False

    print("✅ Frontmatter fixed")
    return True

def set_phase(workspace_root: str, new_phase: str) -> bool:
    """Update enforcement phase in .workspace.toml"""
    config_path = Path(workspace_root) / ".workspace.toml"

    if new_phase not in PHASES:
        print(f"❌ Invalid phase: {new_phase}")
        return False

    with open(config_path, 'r') as f:
        content = f.read()

    # Update current_phase
    lines = content.split('\n')
    updated_lines = []
    for line in lines:
        if 'current_phase = ' in line:
            updated_lines.append(f'current_phase = "{new_phase}"')
        else:
            updated_lines.append(line)

    with open(config_path, 'w') as f:
        f.write('\n'.join(updated_lines))

    print(f"✅ Phase updated to: {new_phase}")
    return True

# ============================================================================
# MAIN ENFORCEMENT CYCLE
# ============================================================================

def run_enforcement_cycle(workspace_root: str):
    """Run complete enforcement cycle"""
    phase, _ = load_enforcement_state(workspace_root)

    print(f"\n🏛️  Fornax Governance Enforcement")
    print(f"   Phase: {phase.upper()} — {PHASES[phase]['description']}")
    print(f"   Workspace: {workspace_root}")

    # Step 0: Stale-term lint (all phases; reported, never blocks a learning-phase run)
    stale = lint_stale_terms(workspace_root)
    if stale:
        print(f"\n⚠️  Stale-term lint: {len(stale)} hit(s)")
        for rel, line, pat, hint in stale[:25]:
            print(f"   • {rel}:{line}  ({hint})")
    else:
        print("\n✅ Stale-term lint: clean")

    # Step 0b: systems.md <-> systems/*.md sync check (all phases; reported, never blocks
    # a learning-phase run, same treatment as the stale-term lint above)
    sync_problems = check_systems_sync(workspace_root)
    if sync_problems:
        print(f"\n⚠️  systems.md sync check: {len(sync_problems)} issue(s)")
        for p in sync_problems:
            print(f"   • {p}")
    else:
        print("\n✅ systems.md sync check: clean")

    # Step 1: Audit
    audit_result = run_audit(workspace_root)
    if not audit_result:
        print("❌ Enforcement cycle failed")
        return False

    summary = audit_result.get('summary', {})
    errors = summary.get('errors', 0)

    # Step 2: Suggest (all phases)
    run_suggestions(workspace_root)

    # Step 3: Warn (advisory + strict)
    if phase in ['advisory', 'strict']:
        if errors > 0:
            print(f"\n⚠️  Found {errors} compliance issues")
            if phase == 'advisory':
                print(f"   (Advisory phase: not blocking, but fix recommended)")
            elif phase == 'strict':
                print(f"   (Strict phase: enforcement required)")

    # Step 4: Auto-fix (strict only)
    if phase == 'strict' and errors > 0:
        if auto_fix_frontmatter(workspace_root):
            # Re-audit after fix
            print("\n🔄 Re-auditing after fix...")
            audit_result = run_audit(workspace_root)
            summary = audit_result.get('summary', {})
            errors = summary.get('errors', 0)
            if errors == 0:
                print("✅ All compliance issues resolved")
            else:
                print(f"⚠️  {errors} issues remain (manual fix needed)")

    return True

# ============================================================================
# CLI
# ============================================================================

def main():
    workspace_root = os.getcwd()

    if len(sys.argv) > 1 and sys.argv[1] == '--lint':
        hits = lint_stale_terms(workspace_root)
        for rel, line, pat, hint in hits:
            print(f"{rel}:{line}: {hint}")
        print(f"{len(hits)} stale-term hit(s)")
        sys.exit(1 if hits else 0)

    if len(sys.argv) > 1 and sys.argv[1] == '--check-systems':
        problems = check_systems_sync(workspace_root)
        for p in problems:
            print(p)
        print(f"{len(problems)} systems.md sync issue(s)")
        sys.exit(1 if problems else 0)

    if len(sys.argv) > 1 and sys.argv[1] == '--phase':
        if len(sys.argv) < 3:
            print("Usage: python3 enforce.py --phase [learning|advisory|strict]")
            sys.exit(1)

        phase = sys.argv[2]
        if set_phase(workspace_root, phase):
            print(f"Phase changed to: {phase}")
            # Run enforcement cycle with new phase
            run_enforcement_cycle(workspace_root)
        else:
            sys.exit(1)

    else:
        # Default: run enforcement cycle
        success = run_enforcement_cycle(workspace_root)
        sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
