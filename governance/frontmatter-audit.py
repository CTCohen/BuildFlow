#!/usr/bin/env python3
"""
Fornax Frontmatter Audit & Management System
Phase 2: Parsing, validation, and audit collection

Usage:
  python3 frontmatter-audit.py audit              # Run audit and report
  python3 frontmatter-audit.py fix                # Auto-fix missing frontmatter
  python3 frontmatter-audit.py validate           # Validate existing frontmatter
  python3 frontmatter-audit.py suggest            # Generate rule suggestions
"""

import os
import sys
import re
import json
import yaml
import subprocess
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass, asdict

# ============================================================================
# DATA MODELS
# ============================================================================

@dataclass
class FrontmatterField:
    """Represents a single frontmatter field requirement"""
    name: str
    required: bool = False
    recommended: bool = False
    type: str = "string"  # string, enum, date, boolean, array, semver
    allowed_values: List[str] = None
    pattern: str = None
    default: str = None

@dataclass
class FileFrontmatter:
    """Parsed frontmatter from a file"""
    file_path: str
    title: Optional[str] = None
    purpose: Optional[str] = None
    status: Optional[str] = None
    owner: Optional[str] = None
    updated: Optional[str] = None
    version: Optional[str] = None
    tier_scope: Optional[str] = None
    phase: Optional[str] = None
    critical_path: Optional[bool] = None
    related: Optional[List[str]] = None
    raw: Dict = None

@dataclass
class AuditFinding:
    """Single audit finding (violation, warning, or suggestion)"""
    file_path: str
    severity: str  # error, warning, info
    category: str  # missing_field, invalid_value, stale, suggestion
    message: str
    details: Dict = None

# ============================================================================
# CONFIGURATION LOADER
# ============================================================================

def load_workspace_config(workspace_root: str) -> Dict:
    """Load .workspace.toml configuration"""
    config_path = Path(workspace_root) / ".workspace.toml"
    if not config_path.exists():
        print(f"❌ Configuration not found: {config_path}")
        sys.exit(1)

    try:
        with open(config_path, 'r') as f:
            import toml
            return toml.load(f)
    except ImportError:
        # Fallback: simple TOML parser for our specific config
        print("⚠️  toml library not found, using fallback parser")
        config = {}
        with open(config_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line.startswith('[') and not line.startswith('[['):
                    section = line.strip('[]')
                    if section not in config:
                        config[section] = {}
        return config

def get_field_requirements(config: Dict, file_path: str) -> Tuple[List[str], List[str]]:
    """
    Get required and recommended fields for a file based on path-specific rules.

    Returns: (required_fields, recommended_fields)
    """
    # Start with global defaults
    governance = config.get('governance', {}).get('frontmatter', {})
    required = governance.get('global', {}).get('required', ['title', 'purpose', 'status'])
    recommended = governance.get('global', {}).get('recommended', ['owner', 'updated'])

    # Apply workspace overrides
    workspace_rules = governance.get('workspace', {})
    if workspace_rules.get('required'):
        required = workspace_rules.get('required', required)
    if workspace_rules.get('recommended'):
        recommended = workspace_rules.get('recommended', recommended)

    # Apply path-specific rules (most specific wins)
    file_path_obj = Path(file_path)
    parts = file_path_obj.parts

    # Check exact file match
    for key in governance.keys():
        if not key.startswith('_') and key not in ['global', 'workspace', 'validation']:
            # Check if this is a path pattern
            if key.endswith('/'):
                # Directory pattern
                path_str = str(file_path).replace('\\', '/')
                if path_str.startswith(key) or f"/{key}" in f"/{path_str}":
                    path_rules = governance.get(key, {})
                    if path_rules.get('required'):
                        required = path_rules.get('required')
                    if path_rules.get('recommended'):
                        recommended = path_rules.get('recommended')
            else:
                # File pattern
                if file_path.endswith(key) or file_path.endswith(key.lstrip('/')):
                    path_rules = governance.get(key, {})
                    if path_rules.get('required'):
                        required = path_rules.get('required')
                    if path_rules.get('recommended'):
                        recommended = path_rules.get('recommended')

    return required, recommended

# ============================================================================
# FRONTMATTER PARSING
# ============================================================================

def parse_frontmatter(file_path: str) -> Tuple[Optional[FileFrontmatter], str]:
    """
    Parse frontmatter from a markdown file.

    Returns: (parsed_frontmatter, full_file_content)
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check for YAML frontmatter markers
    if not content.startswith('---'):
        return None, content

    # Extract frontmatter block
    try:
        _, fm_block, rest = content.split('---', 2)
        fm_dict = yaml.safe_load(fm_block)

        fm = FileFrontmatter(
            file_path=file_path,
            title=fm_dict.get('title'),
            purpose=fm_dict.get('purpose'),
            status=fm_dict.get('status'),
            owner=fm_dict.get('owner'),
            updated=fm_dict.get('updated'),
            version=fm_dict.get('version'),
            tier_scope=fm_dict.get('tier_scope'),
            phase=fm_dict.get('phase'),
            critical_path=fm_dict.get('critical_path'),
            related=fm_dict.get('related'),
            raw=fm_dict
        )
        return fm, content
    except (ValueError, yaml.YAMLError) as e:
        print(f"⚠️  Failed to parse frontmatter in {file_path}: {e}")
        return None, content

# ============================================================================
# AUDIT FUNCTIONS
# ============================================================================

def audit_workspace(workspace_root: str, config: Dict) -> List[AuditFinding]:
    """Run full audit on all markdown files in workspace"""
    findings = []
    workspace_path = Path(workspace_root)

    print(f"\n🔍 Starting frontmatter audit...")
    print(f"   Workspace: {workspace_root}")
    print(f"   Phase: {config.get('enforcement', {}).get('current_phase', 'unknown')}")

    # Find all .md files
    md_files = list(workspace_path.rglob('*.md'))
    print(f"   Found {len(md_files)} markdown files")

    files_with_fm = 0
    files_without_fm = 0

    for md_file in sorted(md_files):
        # Skip archive and exempt paths
        rel_path = str(md_file.relative_to(workspace_path))
        if 'archive/' in rel_path or any(rel_path.startswith(p) for p in ['.', 'scratch/', 'temp/']):
            continue

        fm, content = parse_frontmatter(str(md_file))

        if fm is None:
            files_without_fm += 1
            findings.append(AuditFinding(
                file_path=rel_path,
                severity='error',
                category='missing_frontmatter',
                message=f"No frontmatter found",
                details={'has_frontmatter': False}
            ))
        else:
            files_with_fm += 1
            required, recommended = get_field_requirements(config, rel_path)

            # Check for missing required fields
            for field in required:
                if getattr(fm, field, None) is None:
                    findings.append(AuditFinding(
                        file_path=rel_path,
                        severity='error',
                        category='missing_field',
                        message=f"Missing required field: {field}",
                        details={'field': field, 'required': True}
                    ))

            # Check for stale frontmatter (if updated field exists)
            if fm.updated:
                try:
                    # Handle both string and date object
                    if isinstance(fm.updated, str):
                        update_date = datetime.strptime(fm.updated, '%Y-%m-%d')
                    else:
                        update_date = datetime.combine(fm.updated, datetime.min.time())
                    days_old = (datetime.now() - update_date).days
                    staleness_threshold = 21  # Default

                    # Get staleness threshold from config if specified
                    for key in config.get('governance', {}).get('frontmatter', {}).keys():
                        if rel_path.endswith(key.rstrip('/')):
                            threshold = config['governance']['frontmatter'][key].get('staleness_days', 21)
                            staleness_threshold = threshold

                    if days_old > staleness_threshold:
                        findings.append(AuditFinding(
                            file_path=rel_path,
                            severity='warning',
                            category='stale',
                            message=f"File not updated for {days_old} days (threshold: {staleness_threshold})",
                            details={'days_old': days_old, 'threshold': staleness_threshold}
                        ))
                except ValueError:
                    findings.append(AuditFinding(
                        file_path=rel_path,
                        severity='warning',
                        category='invalid_value',
                        message=f"Invalid date format in 'updated' field: {fm.updated}",
                        details={'field': 'updated', 'value': fm.updated}
                    ))

    # Summary stats
    total = len(md_files)
    coverage = (files_with_fm / total * 100) if total > 0 else 0

    print(f"\n📊 Audit Summary:")
    print(f"   Total files: {total}")
    print(f"   With frontmatter: {files_with_fm} ({coverage:.1f}%)")
    print(f"   Without frontmatter: {files_without_fm}")
    print(f"   Findings: {len(findings)}")

    # Report by severity
    errors = [f for f in findings if f.severity == 'error']
    warnings = [f for f in findings if f.severity == 'warning']
    print(f"   Errors: {len(errors)}, Warnings: {len(warnings)}")

    return findings

# ============================================================================
# REPORT GENERATION
# ============================================================================

def save_audit_log(workspace_root: str, findings: List[AuditFinding]):
    """Append audit results to .workspace-audit-log.yml"""
    log_path = Path(workspace_root) / ".workspace-audit-log.yml"

    # Organize findings by category
    by_category = {}
    for f in findings:
        if f.category not in by_category:
            by_category[f.category] = []
        by_category[f.category].append({
            'file': f.file_path,
            'message': f.message,
            'severity': f.severity
        })

    audit_entry = {
        'date': datetime.now().strftime('%Y-%m-%d'),
        'time': datetime.now().strftime('%H:%M:%S'),
        'findings': by_category,
        'summary': {
            'total': len(findings),
            'errors': len([f for f in findings if f.severity == 'error']),
            'warnings': len([f for f in findings if f.severity == 'warning']),
        }
    }

    # Append to log
    with open(log_path, 'a') as f:
        f.write(f"\n---\n")
        yaml.dump(audit_entry, f, default_flow_style=False, sort_keys=False)

    print(f"\n✅ Audit log saved to: {log_path}")

# ============================================================================
# CLI
# ============================================================================

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    workspace_root = os.getcwd()
    config = load_workspace_config(workspace_root)
    command = sys.argv[1]

    if command == 'audit':
        findings = audit_workspace(workspace_root, config)
        save_audit_log(workspace_root, findings)

        # Show errors
        errors = [f for f in findings if f.severity == 'error']
        if errors:
            print(f"\n❌ Errors ({len(errors)}):")
            for f in errors[:10]:  # Show first 10
                print(f"   • {f.file_path}: {f.message}")

    elif command == 'validate':
        findings = audit_workspace(workspace_root, config)
        if findings:
            print(f"\n❌ Found {len(findings)} issues")
            sys.exit(1)
        else:
            print(f"\n✅ All files have compliant frontmatter")

    else:
        print(f"Unknown command: {command}")
        sys.exit(1)

if __name__ == '__main__':
    main()
