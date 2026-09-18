#!/usr/bin/env python3
"""
BuildFlow Suggestions Engine
Phase 5: Auto-generate rule suggestions based on audit patterns

Analyzes audit logs to detect patterns and propose governance rule improvements.

Usage:
  python3 suggestions-engine.py analyze              # Analyze audit log and generate suggestions
  python3 suggestions-engine.py suggest              # Show suggestions with confidence scores
  python3 suggestions-engine.py apply [suggestion]   # Apply a suggestion
"""

import os
import sys
import yaml
import json
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Tuple
from dataclasses import dataclass, asdict

# ============================================================================
# DATA MODELS
# ============================================================================

@dataclass
class Suggestion:
    """A suggested governance rule change"""
    id: str
    category: str  # coverage_gap, invalid_values, staleness, path_divergence
    description: str
    reason: str  # Why this suggestion emerged
    confidence: float  # 0.0-1.0
    evidence: Dict  # Data supporting this suggestion
    action: str  # What to do if accepted
    impact: str  # "low", "medium", "high"
    status: str  # "pending", "approved", "rejected", "implemented"

# ============================================================================
# SUGGESTION ANALYZER
# ============================================================================

def analyze_audit_log(workspace_root: str) -> List[Suggestion]:
    """Analyze audit log and generate suggestions"""
    log_path = Path(workspace_root) / ".workspace-audit-log.yml"

    if not log_path.exists():
        print("❌ Audit log not found. Run audit first: python3 governance/frontmatter-audit.py audit")
        return []

    with open(log_path, 'r') as f:
        try:
            audit_entries = yaml.safe_load(f) or []
        except:
            audit_entries = []

    if not audit_entries:
        print("❌ Audit log is empty")
        return []

    suggestions = []

    # Analyze latest audit entry
    latest = audit_entries[-1] if isinstance(audit_entries, list) else audit_entries
    if not latest:
        return []

    findings = latest.get('findings', {})
    summary = latest.get('summary', {})

    # ========================================================================
    # SUGGESTION 1: Coverage Gap - Missing "owner" field
    # ========================================================================
    missing_owner = findings.get('missing_field', [])
    owner_missing_count = len([f for f in missing_owner if 'owner' in f.get('message', '')])

    if owner_missing_count >= 3:
        confidence = min(0.95, 0.5 + (owner_missing_count * 0.1))
        suggestions.append(Suggestion(
            id="suggest-1",
            category="coverage_gap",
            description="Make 'owner' a required field for all .md files",
            reason=f"{owner_missing_count} files missing 'owner' field",
            confidence=confidence,
            evidence={'files_missing_owner': owner_missing_count},
            action="Add 'owner' to [governance.frontmatter.workspace] required fields",
            impact="medium",
            status="pending"
        ))

    # ========================================================================
    # SUGGESTION 2: Coverage Gap - Missing "updated" field
    # ========================================================================
    updated_missing_count = len([f for f in missing_owner if 'updated' in f.get('message', '')])

    if updated_missing_count >= 3:
        confidence = min(0.95, 0.5 + (updated_missing_count * 0.1))
        suggestions.append(Suggestion(
            id="suggest-2",
            category="coverage_gap",
            description="Make 'updated' a required field for all .md files",
            reason=f"{updated_missing_count} files missing 'updated' field",
            confidence=confidence,
            evidence={'files_missing_updated': updated_missing_count},
            action="Add 'updated' to [governance.frontmatter.workspace] required fields",
            impact="medium",
            status="pending"
        ))

    # ========================================================================
    # SUGGESTION 3: Staleness - Adjust threshold
    # ========================================================================
    stale_files = findings.get('stale', [])
    if stale_files:
        avg_days = sum([f.get('details', {}).get('days_old', 0) for f in stale_files]) / len(stale_files)
        if avg_days > 30:
            confidence = 0.7 if avg_days < 40 else 0.85
            suggestions.append(Suggestion(
                id="suggest-3",
                category="staleness",
                description=f"Adjust staleness threshold to {int(avg_days)} days",
                reason=f"Average staleness is {avg_days:.0f} days (current threshold: 21)",
                confidence=confidence,
                evidence={'stale_files_count': len(stale_files), 'avg_days_old': avg_days},
                action=f"Update [audit.thresholds] staleness_days = {int(avg_days)}",
                impact="low",
                status="pending"
            ))

    # ========================================================================
    # SUGGESTION 4: Invalid Values - Add enum validation
    # ========================================================================
    invalid_fields = findings.get('invalid_value', [])
    status_invalid = len([f for f in invalid_fields if 'status' in f.get('message', '')])

    if status_invalid >= 2:
        suggestions.append(Suggestion(
            id="suggest-4",
            category="invalid_values",
            description="Tighten 'status' field validation with enum enforcement",
            reason=f"{status_invalid} files with invalid 'status' values",
            confidence=0.80,
            evidence={'invalid_status_count': status_invalid},
            action="Add enum validation for status: [draft, active, deprecated, archived]",
            impact="medium",
            status="pending"
        ))

    # ========================================================================
    # SUGGESTION 5: Coverage - High coverage achieved
    # ========================================================================
    coverage = summary.get('coverage_pct', 0) if isinstance(summary, dict) else 0
    if coverage >= 0.90:
        suggestions.append(Suggestion(
            id="suggest-5",
            category="coverage_gap",
            description="Frontmatter coverage is excellent — consider moving to advisory phase",
            reason=f"Coverage at {coverage*100:.1f}% (threshold: 85%)",
            confidence=0.95,
            evidence={'coverage': coverage},
            action="Advance to advisory phase: set [enforcement.current_phase] = 'advisory'",
            impact="high",
            status="pending"
        ))

    return suggestions

def save_suggestions(workspace_root: str, suggestions: List[Suggestion]):
    """Save suggestions to .workspace-suggestions.yml"""
    suggestions_path = Path(workspace_root) / ".workspace-suggestions.yml"

    suggestions_data = {
        'generated': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'total': len(suggestions),
        'pending': len([s for s in suggestions if s.status == 'pending']),
        'suggestions': [asdict(s) for s in suggestions]
    }

    with open(suggestions_path, 'w') as f:
        yaml.dump(suggestions_data, f, default_flow_style=False, sort_keys=False)

    print(f"✅ Suggestions saved to: {suggestions_path}")

# ============================================================================
# DISPLAY & INTERACTION
# ============================================================================

def display_suggestions(suggestions: List[Suggestion]):
    """Display suggestions in readable format"""
    if not suggestions:
        print("✅ No suggestions at this time")
        return

    print(f"\n📋 Governance Suggestions ({len(suggestions)} total)")
    print("=" * 70)

    for i, s in enumerate(suggestions, 1):
        confidence_bar = "█" * int(s.confidence * 10) + "░" * (10 - int(s.confidence * 10))

        print(f"\n{i}. {s.description}")
        print(f"   Category: {s.category} | Confidence: {confidence_bar} {s.confidence*100:.0f}%")
        print(f"   Impact: {s.impact}")
        print(f"   Reason: {s.reason}")
        print(f"   Action: {s.action}")
        print(f"   Status: {s.status}")
        print(f"   Evidence: {json.dumps(s.evidence, indent=2).replace(chr(10), chr(10) + '           ')}")

# ============================================================================
# APPROVAL & APPLICATION
# ============================================================================

def approve_suggestion(workspace_root: str, suggestion_id: str) -> bool:
    """Approve and apply a suggestion to .workspace.toml"""
    suggestions_path = Path(workspace_root) / ".workspace-suggestions.yml"

    if not suggestions_path.exists():
        print("❌ No suggestions file found")
        return False

    with open(suggestions_path, 'r') as f:
        suggestions_data = yaml.safe_load(f)

    suggestions = [Suggestion(**s) for s in suggestions_data.get('suggestions', [])]

    # Find the suggestion
    target = None
    for s in suggestions:
        if s.id == suggestion_id:
            target = s
            break

    if not target:
        print(f"❌ Suggestion {suggestion_id} not found")
        return False

    print(f"\n✅ Approving: {target.description}")
    print(f"   Action: {target.action}")
    print(f"   ℹ️  Review .workspace.toml and apply the action manually")
    print(f"   Then re-run: python3 governance/frontmatter-audit.py audit")

    # Mark as approved in suggestions file
    for s in suggestions_data['suggestions']:
        if s['id'] == suggestion_id:
            s['status'] = 'approved'

    with open(suggestions_path, 'w') as f:
        yaml.dump(suggestions_data, f, default_flow_style=False, sort_keys=False)

    print(f"\n✅ Suggestion marked as approved in .workspace-suggestions.yml")
    return True

# ============================================================================
# CLI
# ============================================================================

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    workspace_root = os.getcwd()
    command = sys.argv[1]

    print(f"🔍 BuildFlow Suggestions Engine")
    print(f"   Workspace: {workspace_root}")
    print()

    if command == 'analyze':
        suggestions = analyze_audit_log(workspace_root)
        save_suggestions(workspace_root, suggestions)
        display_suggestions(suggestions)

        if suggestions:
            print(f"\n💡 {len([s for s in suggestions if s.status == 'pending'])} suggestions pending approval")

    elif command == 'suggest':
        suggestions_path = Path(workspace_root) / ".workspace-suggestions.yml"
        if not suggestions_path.exists():
            print("❌ No suggestions generated yet. Run: python3 suggestions-engine.py analyze")
            sys.exit(1)

        with open(suggestions_path, 'r') as f:
            suggestions_data = yaml.safe_load(f)

        suggestions = [Suggestion(**s) for s in suggestions_data.get('suggestions', [])]
        display_suggestions(suggestions)

    elif command == 'approve':
        if len(sys.argv) < 3:
            print("Usage: python3 suggestions-engine.py approve <suggestion-id>")
            print("Example: python3 suggestions-engine.py approve suggest-1")
            sys.exit(1)

        suggestion_id = sys.argv[2]
        if approve_suggestion(workspace_root, suggestion_id):
            print(f"\n✅ Ready to update .workspace.toml")
        else:
            sys.exit(1)

    else:
        print(f"Unknown command: {command}")
        sys.exit(1)

if __name__ == '__main__':
    main()
