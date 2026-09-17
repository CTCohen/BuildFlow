#!/usr/bin/env python3
"""
BuildFlow Governance Enforcement
Phase 6: Tidy integration + progressive enforcement

Enforces frontmatter compliance based on current phase (learning → advisory → strict)

Usage:
  python3 enforce.py                          # Run full enforcement cycle
  python3 enforce.py --phase learning         # Set enforcement phase
  python3 enforce.py --phase advisory
  python3 enforce.py --phase strict
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

    print(f"\n🏛️  BuildFlow Governance Enforcement")
    print(f"   Phase: {phase.upper()} — {PHASES[phase]['description']}")
    print(f"   Workspace: {workspace_root}")

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
