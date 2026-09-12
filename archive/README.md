# Archive

Old documents that have been superseded. Keep for historical context.

## What's Here

- **decisions/** — Old decision docs (replaced by ../DECISIONS.md)
- **planning/** — Old roadmaps, phase plans, brainstorm docs
- **research/** — Old market research, analysis

## When to Check Here

You're wondering:
- "Why did we decide X?"
- "What was the rationale for old Plan Y?"
- "What did we learn from earlier research?"

## When NOT to Check Here

You want:
- Current decisions → go to ../DECISIONS.md
- Current roadmap → go to ../phases/
- Current strategy → go to ../README.md or ../CLAUDE.md

## How Archiving Works

**Never delete.** When a doc becomes historical:
1. Move to appropriate subfolder (decisions/, planning/, research/)
2. Add a note at the top: "ARCHIVED [date]. See ../[current doc] for current version."
3. Add to git (it's just moved, not deleted)

Example:
```markdown
# Old Decision: Single-Tier Pricing

**ARCHIVED 2026-09-10**  
See [../DECISIONS.md](../DECISIONS.md) for current pricing decision.

[old content below]
```

This way we keep the reasoning for future reference without cluttering the active workspace.

## Owner

Claude (archiving), Chase (history)
