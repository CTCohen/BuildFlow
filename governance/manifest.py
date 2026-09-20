#!/usr/bin/env python3
"""
BuildFlow application manifest.
Lists every non-archive workspace file with its intended action from the spec reconciliation and whether it is done.
Status is computed from git: a file is "done" if it changed since the tag `pre-spec-reconciliation` (or is new).

Usage:
  python3 governance/manifest.py            # write docs/specs/APPLICATION_MANIFEST.md and print a summary
  python3 governance/manifest.py --check    # exit 1 if any file is UNCLASSIFIED or PENDING
"""
import fnmatch, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE_TAG = "pre-spec-reconciliation"
EXCLUDE_DIRS = ("archive/", "node_modules/", ".git/", "dist/", ".astro/")
EXCLUDE_NAMES = ("package-lock.json", ".DS_Store")
EXTS = (".md", ".txt", ".html", ".toml", ".yml", ".yaml", ".mjs", ".ts", ".astro", ".py", ".json", ".css", ".sh", ".xml")

# (glob, action, note). First match wins. Actions: R rewrite, U update, B banner, C code change, N new, S spec, K keep.
RULES = [
 ("CLAUDE.md","R","operating manual from the specs"), ("DECISIONS.md","R","new decisions on top; old marked superseded"),
 ("ROADMAP.md","R","roadmap, calendar"), ("LAUNCH_ROADMAP.md","R","8 steps, gates, carry-over"), ("README.md","R","tree and flow map"),
 ("STATUS.md","U","historical note"), ("PROGRESS.md","U","session entry"), ("REVIEW.md","U","spec gates"),
 ("GOVERNANCE.md","U","owner, spec conventions"), ("GOVERNANCE-INDEX.md","U","owner pattern"), (".workspace.toml","U","owner pattern"),
 ("RECONCILIATION_LOG.md","U","per-decision status"),
 ("EXECUTION_STATUS.md","B","on hold"), ("EXECUTION_VARIABLES_TEMPLATE.md","B","on hold"),
 ("IMPLEMENTATION_ROADMAP.md","K","deprecated, superseded by the log"), ("testing-loop-*","K","loop outputs"),
 (".workspace-*.yml","K","generated"), (".claude/*","K",""), (".githooks/*","K",""),
 ("docs/PRICING.md","R",""), ("docs/DELIVERY_MODEL.md","R",""), ("docs/delivery-model.md","R",""), ("docs/tech-stack.md","R",""),
 ("docs/TIER-FEATURE-MATRIX.md","R",""), ("docs/CRM_MCP_INTEGRATION_ROADMAP.md","R",""),
 ("docs/DESIGN_SYSTEMS/_OVERVIEW.md","R",""), ("docs/DESIGN_SYSTEMS/MICRO.md","R",""), ("docs/DESIGN_SYSTEMS/SMB.md","U",""),
 ("docs/DESIGN_SYSTEMS/MID_MARKET.md","B","deferred"), ("docs/capability-buildout.md","U",""), ("docs/workflow-graph.html","U",""),
 ("docs/later-development-ideas.md","K",""), ("docs/resource-index.md","K",""),
 ("docs/specs/APPLICATION_MANIFEST.md","N","generated"), ("docs/specs/README.md","N",""), ("docs/specs/*","S",""),
 ("docs/01-business-operations-system.md","S",""), ("docs/BUSINESS_MODEL.md","S",""),
 ("docs/PRICING_STRATEGY_RESEARCH.md","N","research from another session; informs D02"), ("docs/LLM_COST_AND_API_PLAN.md","N",""), ("docs/RISKS.md","N",""),
 ("specs/features.md","R",""), ("specs/05-feature-system.md","S",""),
 ("context/*","R",""), ("sales/POSITIONING.md","R",""), ("sales/README.md","U",""), ("research/README.md","U",""),
 ("research/COMPETITIVE-ANALYSIS.md","U","add spec positioning; competitor prices kept"), ("customers/README.md","U",""),
 ("metrics/METRICS.md","R",""), ("metrics/EXECUTION_TRACKER.md","B","on hold"), ("metrics/token-log.md","U","add dollar columns"),
 ("routines/testing.md","R",""), ("routines/pr-review.md","U",""),
 ("operations/README.md","U",""), ("operations/CALENDLY_SETUP_5MIN.md","U",""), ("operations/SITE-BUILD-WORKFLOW.md","U","spec fulfillment path"),
 ("operations/TIER_BUILD_PLAN.md","R",""), ("operations/LOOPS.md","N",""), ("operations/TYLER_QUEUE.md","N",""), ("operations/SPEC-*","S",""),
 ("phases/PHASE_1.md","B","on hold"), ("phases/PHASE_1_MID_MARKET.md","B","deferred"), ("phases/*","U",""),
 ("outreach/SPEC-*","S",""), ("outreach/PHASE_1_EXECUTED_EXAMPLE.md","B","simulation"), ("outreach/PROSPECT-RESEARCH-TEMPLATE.md","U",""),
 ("outreach/*","B","on hold, re-priced"), ("execution/*","B","simulation"), ("messaging/*","U",""),
 ("onboarding/SPEC-*","S",""), ("onboarding/EMAIL-SEQUENCES.md","U","map to System 12 journey"), ("onboarding/VIDEO-RECORDING-GUIDE.md","K","generic recording guide, no spec impact"), ("onboarding/*","U",""),
 ("legal/SPEC-*","S",""), ("legal/*","R","draft; counsel review"),
 ("website/SPEC-*","S",""), ("website/src/pages/index.astro","C","System 19"), ("website/src/layouts/Layout.astro","C",""),
 ("website/src/pages/legal/*","R","mirrors legal/"), ("website/*","K",""),
 ("design/SPEC-*","S",""), ("design/LOGO-FIRST-DESIGN.md","U","Discovery Agent branch"), ("design/VARIANT-POOLS.md","U","10 profiles"), ("design/*","K",""),
 ("lib/*","K",""), ("scripts/*","K",""), ("customer-sites/*","K","examples"),
 ("agents/*","S",""), ("billing/*","S",""), ("crm/*","S",""), ("platform/*","S",""),
 ("app/src/data/schema.mjs","C","tier, styleProfile, EN-only"), ("app/scripts/qa.mjs","C","spec thresholds"), ("app/scripts/new-client.mjs","C","tier, profile, EN-only"),
 ("app/src/lib/client.ts","C","optional Spanish"), ("app/src/pages/areas/[[]slug].astro","C","langs from client"), ("app/src/pages/services/[[]slug].astro","C","langs from client"),
 ("app/src/data/styleProfiles.json","N","32 themes to 10 profiles"), ("app/src/data/clients/*","C","tier, styleProfile added"),
 ("app/DESIGN.md","U","link SPEC-04, floors, EN-only"), ("app/README.md","U","tier/profile, deploy"), ("app/KNOWLEDGE.md","K","generated; recompiled 2026-09-18, unchanged (20 cards, hash f1d3028aa910)"),
 ("app/src/tokens/README.md","U","profile mapping"), ("app/src/tokens/*.md","K","reference docs, no spec conflict"), ("app/scripts/constrained-variety-test.mjs","K","reviewed; no change needed"), ("app/*","K",""),
 ("knowledge/SPEC-*","S",""), ("knowledge/README.md","U",""), ("knowledge/SERVICE_VERTICALS.md","U",""), ("knowledge/design-tokens-schema.md","U","profiles"),
 ("knowledge/LEARNING-LOG.md","U","append"), ("knowledge/sops/*","U",""), ("knowledge/principles/ai-seo.md","U","Layer 1 default"), ("knowledge/*","K",""),
 ("governance/enforce.py","C","stale-term lint"), ("governance/manifest.py","N",""), ("governance/frontmatter-audit.py","K","reviewed"), ("governance/*","K",""),
]

def sh(*a):
    return subprocess.run(a, cwd=ROOT, capture_output=True, text=True).stdout

def files():
    out = []
    for p in ROOT.rglob("*"):
        if not p.is_file(): continue
        rel = p.relative_to(ROOT).as_posix()
        if any(rel.startswith(d) or f"/{d}" in f"/{rel}" for d in EXCLUDE_DIRS): continue
        if p.name in EXCLUDE_NAMES or p.suffix not in EXTS: continue
        out.append(rel)
    return sorted(out)

def classify(rel):
    for pat, act, note in RULES:
        if fnmatch.fnmatch(rel, pat): return act, note
    return None, ""

def main():
    changed = set(sh("git", "diff", "--name-only", BASE_TAG).split()) | set(sh("git", "ls-files", "--others", "--exclude-standard").split())
    # renames appear under their new path in `git diff --name-only`; include staged status too
    changed |= {l[3:].split(" -> ")[-1] for l in sh("git", "status", "--porcelain").splitlines()}
    rows, counts, bad = [], {}, []
    for rel in files():
        act, note = classify(rel)
        if act is None: st = "UNCLASSIFIED"
        elif act == "K": st = "kept"
        else: st = "done" if rel in changed else "PENDING"
        counts[st] = counts.get(st, 0) + 1
        if st in ("UNCLASSIFIED", "PENDING"): bad.append((rel, act, st))
        rows.append((rel, act or "?", st, note))
    if "--check" in sys.argv:
        for rel, act, st in bad: print(f"{st}: {rel} ({act})")
        print(counts); sys.exit(1 if bad else 0)
    lines = ["---", "title: Application Manifest", "purpose: Every workspace file with its intended action from the spec reconciliation and whether it is done (generated by governance/manifest.py)",
             "status: active", "owner: c.t.cohen", "updated: '2026-09-18'", "version: 1.0.0", "tier_scope: all", "phase: phase_1", "---", "",
             "# Application manifest", "",
             "Generated by `python3 governance/manifest.py`. Actions: **R** rewrite from the spec, **U** targeted update, **B** banner only, **C** code change, **N** new, **S** spec file (moved; overrides box where a ruling applies), **K** keep as is. Status is computed from git against the tag `pre-spec-reconciliation`.", "",
             "Summary: " + ", ".join(f"{k} {v}" for k, v in sorted(counts.items())), "", "| File | Action | Status | Note |", "|---|---|---|---|"]
    lines += [f"| `{r}` | {a} | {s} | {n} |" for r, a, s, n in rows]
    (ROOT / "docs/specs/APPLICATION_MANIFEST.md").write_text("\n".join(lines) + "\n")
    print("written; ", counts)
    for rel, act, st in bad: print(f"  {st}: {rel} ({act})")

if __name__ == "__main__":
    main()
