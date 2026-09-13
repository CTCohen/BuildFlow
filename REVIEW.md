---
title: Phase 1 Launch Review Checklist
purpose: Quality gates and shipping checklist for Phase 1 launch
status: active
owner: c.t.cohen
updated: '2026-09-12'
tier_scope: smb
phase: phase_1
critical_path: true
---

# REVIEW.md — BuildFlow shipping checklist

> Run before shipping anything on a critical path: a delivered site, an outreach change,
> an onboarding change, or an automation going live.

## Must have

- [ ] Delivered site renders correctly on mobile + desktop
- [ ] All forms (contact, quote request) submit and route somewhere a human sees
- [ ] EN and ES versions both correct — no machine-translation errors, no untranslated strings
- [ ] Site has no broken links, no placeholder/lorem content
- [ ] Discovery output is real, reachable businesses (valid name, location, contact)
- [ ] Outreach: email + SMS actually deliver (not spam-foldered / carrier-blocked)
- [ ] Handoff to human first-reply is triggered and logged
- [ ] Onboarding path lets the business adopt the site without a support call
- [ ] Auth on anything customer-facing works and fails safe
- [ ] Automated run reported its token cost to `metrics/`

## Should have

- [ ] Site feels "living/breathing" — real copy, real imagery, sensible structure
- [ ] Lighthouse / basic perf pass on the delivered site
- [ ] Handoff record includes enough context for the human to reply well
- [ ] Discovery de-dupes against already-contacted businesses
- [ ] Outreach respects opt-out / unsubscribe

## Okay to ship without

- Analytics dashboards beyond token tracking
- Multi-vertical support
- Self-serve / billing

## Eyes / UX checks

- [ ] Would a plumber recognize their own business in this site?
- [ ] Does the outreach read like a person, not a bot?
- [ ] Is the "replace your current site" path obvious to a non-technical owner?

## Security & performance

- [ ] No secrets in the repo or in generated site output
- [ ] Rate limits / caps on outreach sending
- [ ] Token cap enforced per automation run (Pro budget)
- [ ] PII from discovery/onboarding stored minimally and not logged in plaintext

## Common mistakes to avoid

- Shipping outreach copy or onboarding changes without approval
- Letting an automation run without token accounting
- Adding a pipeline step instead of removing one
- Treating ES as an afterthought
