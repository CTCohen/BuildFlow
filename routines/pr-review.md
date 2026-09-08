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
- [ ] Language: EN and ES output both verified for the touched area
- [ ] Speed: start→built / start→closed timings recorded if the change could affect them

## Approvals

- [ ] Outreach copy/messaging change → explicit owner approval
- [ ] Onboarding process change → explicit owner approval
- [ ] New dependency or paid service → explicit owner approval

## Merge

- [ ] REVIEW.md checklist run if this touches a critical path
- [ ] Rollback plan noted in the PR description
