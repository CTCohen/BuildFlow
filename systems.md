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

**Flow diagram:** `docs/workflow-graph.html` (needs refresh — stale as of 2026-09-22) is the existing visual
pipeline diagram. It predates tonight's builds and the Fornax rename in places, so treat what it shows as
unconfirmed until it's redrawn — that redraw is separate, larger follow-up work, not done in this pass. It's
also linked from `systems/outbound.md`, `systems/onboarding.md`, and `systems/admin-dashboard.md`, the three
system files a visual flow would most help.

**Specs vs. flows vs. workflows.** Three different things, easy to blur together — Tyler's terms for each:
- **Specs** (`systems/*.md`, this folder) are the checkbox-tracked *what and why*: what a system does, what's
  built and verified, what's specified but not built, what's possible but not committed to, and what's still
  an open question. Text, one file per system, the authoritative source.
- **Flows** are visual diagrams showing the sequence a lead, a customer, or a dollar actually moves through —
  e.g. lead discovered → scored → demo built → outreach sent → opened → converted. They live as diagrams (like
  `docs/workflow-graph.html`), referenced from whichever system file(s) the sequence touches, not re-described
  as duplicate prose in the spec. A flow shows the path; the spec it's linked from explains each stop on it.
- **Workflows** are who/what does each step — human (Tyler) vs. agent, retries, and approval gates. That's
  already `operations/LOOPS.md`: its table (trigger, runs where, inputs → outputs, approval gate, lane/budget)
  is the workflow layer for every automated loop in the business. Don't duplicate LOOPS.md content into a
  system file — cross-link it (as several system files already do implicitly via their agent/automation
  descriptions) instead.

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
| Client Onboarding | [systems/onboarding.md](systems/onboarding.md) | drafted |
| Client Offboarding | [systems/offboarding.md](systems/offboarding.md) | drafted |
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
| CRM & External Integrations | [systems/crm-integrations.md](systems/crm-integrations.md) | drafted |
| Observability | [systems/observability.md](systems/observability.md) | drafted |
| Business Operations & Financials | [systems/business-operations-financials.md](systems/business-operations-financials.md) | drafted |
| Customer Support | [systems/customer-support.md](systems/customer-support.md) | drafted |
| Customer Feedback & Iteration | [systems/customer-feedback.md](systems/customer-feedback.md) | drafted |
| SEO / AI-Visibility | [systems/seo-ai-visibility.md](systems/seo-ai-visibility.md) | drafted |
| Experimentation | [systems/experimentation.md](systems/experimentation.md) | drafted |
| *(meta, not a system)* Coverage audit | [systems/AUDIT.md](systems/AUDIT.md) | reference |

**Note on dashboards:** per Tyler's ruling (2026-09-22), dashboards are uniform within a tranche — every Micro
customer's dashboard looks and functions identically, wired to their site's own lead-capture endpoints. Not
per-vertical (yet — may change based on need, tracked as an open question in each dashboard system file). This is
the opposite of the website design system, which is deliberately per-business through multi-layer review.

## Open questions on file granularity (Tyler's call, 2026-09-22)

Three systems from the original 19-system export don't have their own dedicated `systems/*.md` file — their
content is folded into other systems' files instead. Whether that should change is genuinely undecided; each
option below has a real tradeoff, and it's Tyler's call, not decided here:

1. **System 02 (Platform Architecture)** — currently split across `systems/hosting.md`,
   `systems/admin-dashboard.md`, and other files' "Code lives at" sections, per the granularity rule (platform
   architecture is a code-organization concern, not a customer-facing unit with its own lifecycle). Own file =
   clearer single place to find cross-cutting infra decisions; folded = fewer files, but architecture detail is
   scattered and harder to find standalone.
2. **System 05 (Feature System)** — currently folded into the tier-specific `systems/design-*.md` and
   `systems/dashboard-*.md` files (feature availability per tier is described where each tier's design/
   dashboard is described). Own file = one place to see the full feature matrix across tiers at once; folded =
   fewer files, but comparing feature availability across tiers means opening multiple files.
3. **System 06 (Demo-to-Customer)** — currently folded into `systems/admin-dashboard.md` (the demo→conversion
   flow is described alongside the admin/CRM funnel view that tracks it). Own file = the demo-to-customer
   journey (a real, distinct lifecycle stage between Outbound and Onboarding) gets its own authoritative home;
   folded = fewer files, but the conversion mechanics are buried inside a file primarily about the admin
   dashboard rather than about the journey itself.

## Governance
- Every file in `systems/` must be listed in the table above, and every table row must point to a real file —
  `governance/enforce.py --check-systems` (also part of the default full-cycle run) checks this both
  directions. See `governance/README.md` for what governance means here and how the checks run.
- `CLAUDE.md` points here as the entry point for "what does the business actually do and what's built."
- Update this file's `updated:` date whenever a system is added, renamed, or its status column changes.
