#!/usr/bin/env python3
"""
Fornax Frontmatter Auto-Fix
Phase 4: Add frontmatter to all .md files based on path-specific rules

Usage:
  python3 add-frontmatter.py [--dry-run]    # Preview changes
  python3 add-frontmatter.py --apply        # Apply frontmatter to all files
"""

import os
import sys
import yaml
from pathlib import Path
from datetime import datetime

# ============================================================================
# FRONTMATTER TEMPLATES
# ============================================================================

FRONTMATTER_TEMPLATES = {
    # Governance & decision documents
    'GOVERNANCE.md': {
        'title': 'Fornax Governance & Frontmatter System',
        'purpose': 'Auto-improving governance system with frontmatter as first-class metadata',
        'status': 'active',
        'owner': 'c.t.cohen',
        'version': '1.0',
        'tier_scope': 'all',
        'phase': 'operational',
        'critical_path': True,
        'related': ['CLAUDE.md', 'DECISIONS.md']
    },

    # Planning & execution
    'PHASE_1.md': {
        'title': 'Phase 1: SMB Launch',
        'purpose': 'Execution plan for Phase 1 SMB tier launch by 2026-09-30',
        'status': 'active',
        'owner': 'c.t.cohen',
        'version': '1.0',
        'tier_scope': 'smb',
        'phase': 'phase_1',
        'critical_path': True,
        'related': ['ROADMAP.md', 'DECISIONS.md']
    },

    'STATUS.md': {
        'title': 'Fornax Execution Status',
        'purpose': 'Real-time tracking of Phase 1 execution status and blockers',
        'status': 'active',
        'owner': 'c.t.cohen',
        'updated': datetime.now().strftime('%Y-%m-%d'),
        'tier_scope': 'all',
        'phase': 'phase_1'
    },

    'PROGRESS.md': {
        'title': 'Fornax Weekly Progress',
        'purpose': 'Weekly snapshot of progress, blockers, and next steps',
        'status': 'active',
        'owner': 'c.t.cohen',
        'updated': datetime.now().strftime('%Y-%m-%d'),
        'tier_scope': 'all',
        'phase': 'operational'
    },

    'EXECUTION_STATUS.md': {
        'title': 'Execution Status Tracker',
        'purpose': 'Detailed tracking of execution metrics and milestones',
        'status': 'active',
        'owner': 'c.t.cohen',
        'updated': datetime.now().strftime('%Y-%m-%d'),
        'tier_scope': 'all',
        'phase': 'operational'
    },

    'EXECUTION_VARIABLES_TEMPLATE.md': {
        'title': 'Execution Variables Template',
        'purpose': 'Template for tracking execution variables and environment setup',
        'status': 'draft',
        'owner': 'c.t.cohen',
        'tier_scope': 'all',
        'phase': 'operational'
    },

    # Testing & learning
    'testing-loop-learnings.md': {
        'title': 'Testing Loop Learnings',
        'purpose': 'Insights and patterns from testing iterations',
        'status': 'active',
        'owner': 'c.t.cohen',
        'updated': datetime.now().strftime('%Y-%m-%d'),
        'tier_scope': 'all',
        'phase': 'operational'
    },

    'testing-loop-analysis.md': {
        'title': 'Testing Loop Analysis',
        'purpose': 'Analysis of testing patterns and recommendations',
        'status': 'active',
        'owner': 'c.t.cohen',
        'tier_scope': 'all',
        'phase': 'operational'
    },

    'REVIEW.md': {
        'title': 'Phase 1 Launch Review Checklist',
        'purpose': 'Quality gates and shipping checklist for Phase 1 launch',
        'status': 'active',
        'owner': 'c.t.cohen',
        'updated': datetime.now().strftime('%Y-%m-%d'),
        'tier_scope': 'smb',
        'phase': 'phase_1',
        'critical_path': True
    },

    # LAUNCH_ROADMAP
    'LAUNCH_ROADMAP.md': {
        'title': 'Launch Roadmap',
        'purpose': 'Detailed roadmap for product launch sequence and milestones',
        'status': 'active',
        'owner': 'c.t.cohen',
        'updated': datetime.now().strftime('%Y-%m-%d'),
        'version': '1.0',
        'tier_scope': 'smb',
        'phase': 'phase_1',
        'critical_path': True,
        'related': ['ROADMAP.md', 'PHASE_1.md']
    },
}

# Path-based default templates
PATH_DEFAULTS = {
    'docs/': {
        'purpose': 'Technical documentation and product specifications',
        'tier_scope': 'all',
        'phase': 'operational',
    },
    'specs/': {
        'purpose': 'Feature specifications and technical requirements',
        'tier_scope': 'all',
        'status': 'draft',
        'phase': 'operational',
    },
    'design/': {
        'purpose': 'Design system and visual architecture documentation',
        'tier_scope': 'all',
        'phase': 'operational',
    },
    'context/': {
        'purpose': 'Business context and market research',
        'tier_scope': 'all',
        'phase': 'operational',
    },
    'research/': {
        'purpose': 'Market research and competitive analysis',
        'tier_scope': 'all',
        'phase': 'operational',
    },
    'operations/': {
        'purpose': 'Standard operating procedures and workflows',
        'tier_scope': 'all',
        'phase': 'operational',
    },
    'sales/': {
        'purpose': 'Sales positioning, outreach templates, and customer stories',
        'tier_scope': 'smb',
        'phase': 'operational',
    },
    'metrics/': {
        'purpose': 'KPIs, metrics, and execution tracking',
        'tier_scope': 'all',
        'phase': 'operational',
    },
    'customers/': {
        'purpose': 'Customer information and engagement tracking',
        'tier_scope': 'all',
        'phase': 'operational',
    },
    'app/': {
        'purpose': 'Application documentation and technical design',
        'tier_scope': 'all',
        'phase': 'operational',
    },
    'archive/README.md': {
        'purpose': 'Archive of historical plans and retired documents',
        'tier_scope': 'all',
        'phase': 'operational',
    }
}

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def get_frontmatter_template(file_path: str) -> dict:
    """Generate frontmatter template for a file based on path and name"""
    file_name = Path(file_path).name
    rel_path = str(file_path).replace('\\', '/')

    # Check for exact file match
    if file_name in FRONTMATTER_TEMPLATES:
        return FRONTMATTER_TEMPLATES[file_name].copy()

    # Check for path-based match
    for path_pattern, defaults in PATH_DEFAULTS.items():
        if rel_path.startswith(path_pattern) or rel_path.endswith(path_pattern):
            template = defaults.copy()
            # Set default values
            if 'title' not in template:
                template['title'] = file_name.replace('.md', '').replace('-', ' ').title()
            if 'status' not in template:
                template['status'] = 'active'
            if 'owner' not in template:
                template['owner'] = 'c.t.cohen'
            if 'updated' not in template:
                template['updated'] = datetime.now().strftime('%Y-%m-%d')
            return template

    # Default fallback
    return {
        'title': file_name.replace('.md', '').replace('-', ' ').title(),
        'purpose': f'Documentation for {file_name}',
        'status': 'draft',
        'owner': 'c.t.cohen',
        'updated': datetime.now().strftime('%Y-%m-%d'),
        'tier_scope': 'all',
        'phase': 'operational',
    }

def file_has_frontmatter(file_path: str) -> bool:
    """Check if file already has YAML frontmatter"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            first_line = f.readline().strip()
            return first_line == '---'
    except:
        return False

def add_frontmatter_to_file(file_path: str, dry_run: bool = False):
    """Add frontmatter to a single file"""
    if file_has_frontmatter(file_path):
        return None  # Already has frontmatter

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    template = get_frontmatter_template(file_path)

    # Build YAML frontmatter
    fm_dict = {k: v for k, v in template.items() if v is not None}
    fm_yaml = yaml.dump(fm_dict, default_flow_style=False, sort_keys=False)

    # Construct new content
    new_content = f"---\n{fm_yaml}---\n\n{content}"

    if dry_run:
        return new_content

    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    return new_content

# ============================================================================
# MAIN
# ============================================================================

def main():
    workspace_root = Path(os.getcwd())
    dry_run = '--apply' not in sys.argv

    print(f"🔧 Fornax Frontmatter Auto-Fix")
    print(f"   Workspace: {workspace_root}")
    print(f"   Mode: {'DRY RUN' if dry_run else 'APPLY'}")
    print()

    # Find all .md files
    md_files = list(workspace_root.rglob('*.md'))

    # Filter out archive and exempt paths
    to_process = []
    for md_file in sorted(md_files):
        rel_path = str(md_file.relative_to(workspace_root))
        if not ('archive/' in rel_path or rel_path.startswith('.') or 'scratch/' in rel_path):
            to_process.append(md_file)

    files_without_fm = [f for f in to_process if not file_has_frontmatter(str(f))]

    print(f"📊 Status:")
    print(f"   Total .md files: {len(to_process)}")
    print(f"   Without frontmatter: {len(files_without_fm)}")
    print()

    if not files_without_fm:
        print("✅ All files already have frontmatter!")
        return

    print(f"📝 Files to process:")
    for md_file in files_without_fm[:10]:  # Show first 10
        rel_path = md_file.relative_to(workspace_root)
        print(f"   • {rel_path}")

    if len(files_without_fm) > 10:
        print(f"   ... and {len(files_without_fm) - 10} more")

    print()

    if dry_run:
        print("🔍 DRY RUN — use --apply to make changes")
        print()
        # Show example
        if files_without_fm:
            example_file = files_without_fm[0]
            rel_path = example_file.relative_to(workspace_root)
            print(f"Example: {rel_path}")
            print("─" * 60)
            new_content = add_frontmatter_to_file(str(example_file), dry_run=True)
            print(new_content[:500])
            print("...")
    else:
        print(f"✍️  Adding frontmatter to {len(files_without_fm)} files...")
        count = 0
        for md_file in files_without_fm:
            add_frontmatter_to_file(str(md_file), dry_run=False)
            count += 1
            if count % 10 == 0:
                print(f"   ... {count}/{len(files_without_fm)}")

        print()
        print(f"✅ Frontmatter added to {count} files!")

if __name__ == '__main__':
    main()
