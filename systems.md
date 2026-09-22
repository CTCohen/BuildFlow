---
title: Systems Index
purpose: The authoritative list of every business system and where its spec file lives. CLAUDE.md points here. Governance checks that every systems/*.md file is listed here and every listing has a real file — nothing drifts unlisted.
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Systems Index

**What this is.** Fornax is organized as a series of business systems. Each one has exactly one authoritative
`.md` file under `systems/`. That file is the current truth for what the system is supposed to do, what's
actually built (checked off), what's planned but not started, and what's possible but not yet decided on. Testing
agents use the checkboxes as their test plan. When something is built, removed, or changed, the relevant system
file(s) get updated in the same pass — not later, not by a different session.

**Why one folder, not scattered by code location.** A system like Onboarding touches billing, CRM, email, and
dashboards — five different code folders. Putting its spec in any one of them would be an arbitrary guess for
whoever looks for it next. One location, one lookup rule, for every human and every agent.

**Relationship to the old `SPEC-NN` files** (`platform/SPEC-02...`, `design/SPEC-04...`, etc.): those were organized
by engineering module. This index is organized by business function and market tranche instead — a better match
for how the business is actually run and checked. The old spec files are the *source material* being folded into
these system files, not duplicated. As each system file below absorbs its old spec content, the old file gets a
`Superseded by systems/<name>.md` banner and stays in place as history — never deleted.

**Granularity rule.** A system is one coherent thing with its own lifecycle that a customer, prospect, or Tyler
interacts with as a unit — not a code module, not a single feature. "Outbound" is a system. "The bounce-rate
pause threshold" is one line inside Outbound's spec, not its own file.

**File format every system file follows:**
```
---
[frontmatter matching this workspace's standard: title, purpose, status, owner, updated, version, tier_scope, phase]
---
# <System Name>
One paragraph: what this system does, for whom, and how it fits the rest of the business.

## Built and verified
- [x] <spec item> — <evidence: commit, test count, or file path>

## Specified, not yet built
- [ ] <spec item> — <what's blocking it, if anything: decision, credential, or just not started>

## Possible future specs (not built, not committed to)
- <idea, with why it's not committed yet>

## Open questions
- <anything genuinely undecided about how this system should work>
```

## The systems

| System | File | Status |
|---|---|---|
| Outbound (lead discovery, scoring, outreach) | [systems/outbound.md](systems/outbound.md) | drafted |
| Onboarding | [systems/onboarding.md](systems/onboarding.md) | drafted |
| Offboarding | [systems/offboarding.md](systems/offboarding.md) | drafted |
| Admin command center (CRM view, outbound pacing/scripts, analytics, financials) | [systems/admin-dashboard.md](systems/admin-dashboard.md) | drafted |
| Design system — Micro | [systems/design-micro.md](systems/design-micro.md) | drafted |
| Design system — SMB | [systems/design-smb.md](systems/design-smb.md) | drafted |
| Design system — Mid-Market | [systems/design-mid-market.md](systems/design-mid-market.md) | drafted (tier paused) |
| Customer dashboard — Micro | [systems/dashboard-micro.md](systems/dashboard-micro.md) | drafted |
| Customer dashboard — SMB | [systems/dashboard-smb.md](systems/dashboard-smb.md) | drafted |
| Customer dashboard — Mid-Market | [systems/dashboard-mid-market.md](systems/dashboard-mid-market.md) | drafted (tier paused) |
| Billing | [systems/billing.md](systems/billing.md) | drafted |
| Hosting & deployment | [systems/hosting.md](systems/hosting.md) | drafted |
| Compliance & data retention | [systems/compliance.md](systems/compliance.md) | drafted |
| Marketing site | [systems/marketing-site.md](systems/marketing-site.md) | drafted |

**Note on dashboards:** per Tyler's ruling (2026-09-22), dashboards are uniform within a tranche — every Micro
customer's dashboard looks and functions identically, wired to their site's own lead-capture endpoints. Not
per-vertical (yet — may change based on need, tracked as an open question in each dashboard system file). This is
the opposite of the website design system, which is deliberately per-business through multi-layer review.

## Governance
- Every file in `systems/` must be listed in the table above, and every table row must point to a real file —
  `governance/enforce.py` checks this (implementation pending, see systems/README.md status).
- `CLAUDE.md` points here as the entry point for "what does the business actually do and what's built."
- Update this file's `updated:` date whenever a system is added, renamed, or its status column changes.
