#!/usr/bin/env python3
"""
BuildFlow Phase Manager
Automatically promotes enforcement phases based on timeline

Run daily via cron or /schedule:
  python3 governance/phase-manager.py

Phases advance automatically:
  learning (2026-09-12 — 2026-09-26) → advisory (2026-09-26 — 2026-11-07) → strict (2026-11-07+)
"""

import os
import sys
from pathlib import Path
from datetime import datetime

def load_config(workspace_root: str) -> dict:
    """Load .workspace.toml configuration"""
    config_path = Path(workspace_root) / ".workspace.toml"

    config = {
        'learning_start': '2026-09-12',
        'learning_end': '2026-09-26',
        'advisory_start': '2026-09-26',
        'advisory_end': '2026-11-07',
        'strict_start': '2026-11-07',
    }

    return config

def get_current_phase(dates: dict) -> str:
    """Determine current phase based on today's date"""
    today = datetime.now().date()

    learning_start = datetime.strptime(dates['learning_start'], '%Y-%m-%d').date()
    learning_end = datetime.strptime(dates['learning_end'], '%Y-%m-%d').date()
    advisory_start = datetime.strptime(dates['advisory_start'], '%Y-%m-%d').date()
    advisory_end = datetime.strptime(dates['advisory_end'], '%Y-%m-%d').date()
    strict_start = datetime.strptime(dates['strict_start'], '%Y-%m-%d').date()

    if today < learning_end:
        return 'learning'
    elif today < advisory_end:
        return 'advisory'
    else:
        return 'strict'

def update_phase_in_config(workspace_root: str, new_phase: str) -> bool:
    """Update current_phase in .workspace.toml"""
    config_path = Path(workspace_root) / ".workspace.toml"

    with open(config_path, 'r') as f:
        content = f.read()

    lines = content.split('\n')
    updated = False

    for i, line in enumerate(lines):
        if 'current_phase = ' in line:
            old_phase = line.split('=')[-1].strip().strip('"\'')
            if old_phase != new_phase:
                lines[i] = f'current_phase = "{new_phase}"'
                updated = True
                print(f"📍 Phase advanced: {old_phase} → {new_phase}")
            break

    if updated:
        with open(config_path, 'w') as f:
            f.write('\n'.join(lines))
        return True

    return False

def main():
    workspace_root = os.getcwd()
    config = load_config(workspace_root)
    current = get_current_phase(config)

    print(f"🔄 BuildFlow Phase Manager")
    print(f"   Today: {datetime.now().strftime('%Y-%m-%d')}")
    print(f"   Current phase should be: {current}")

    # Update if needed
    if update_phase_in_config(workspace_root, current):
        print(f"✅ Config updated")
        return 0
    else:
        print(f"✅ Phase is already {current}")
        return 0

if __name__ == '__main__':
    sys.exit(main())
