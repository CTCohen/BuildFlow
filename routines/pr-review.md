---
title: Pr Review
purpose: Documentation for pr-review.md
status: draft
owner: c.t.cohen
updated: '2026-09-12'
tier_scope: all
phase: operational
---

# PR review checklist — BuildFlow

## Before requesting review

- [ ] Change is scoped to one critical path or one supporting concern
- [ ] No secrets, keys, or client PII in the diff or fixtures
- [ ] Token cost of any new automated run is measured and logged to `metrics/`

## Testing (owner: still being defined — see `routines/testing.md`)

- [ ] Website output: automated checks + human eyes on at least one generated sample
- [ ] AI-agent integration: handoffs between discovery → outreach → human → onboarding verified
- [ ] E2E: full pipeline run on a real candidate in a safe/sandbox mode
- [ ] Auth + onboarding path exercised
- [ ] Discovery quality spot-checked (are the businesses real and a fit?)
- [ ] Language: English output verified (Spanish only if the change touches an opt-in Spanish site)
- [ ] Speed: start→built / start→closed timings recorded if the change could affect them

## Shared-agent rules (registry Section E)

- [ ] The Design Agent is not forked: all four call sites use the same template warehouse and logic
- [ ] One Lead Scoring model for outbound and photo intake; calibration tracked per vertical
- [ ] No per-vertical or per-tranche agent copies: use parameters
- [ ] Retry ceiling and human gate implemented per registry Section F
- [ ] Token and dollar cost logged; per-agent cap respected

## Approvals

- [ ] Outreach copy/messaging change → explicit owner approval
- [ ] Onboarding process change → explicit owner approval
- [ ] New dependency or paid service → explicit owner approval
- [ ] Legal text, pricing or price-versioning change → explicit owner approval

## Merge

- [ ] REVIEW.md checklist run if this touches a critical path
- [ ] Rollback plan noted in the PR description
