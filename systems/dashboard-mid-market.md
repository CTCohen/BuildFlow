---
title: Customer Dashboard — Mid-Market
purpose: Authoritative spec for the Mid-Market tier's customer dashboard. Tier is paused ~12 months per DECISIONS.md; nothing built. Superseded/absorbed from docs/TIER-FEATURE-MATRIX.md (superseded section), platform/dashboards/lib/tier-features.mjs.
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.0.0
tier_scope: mid_market
phase: phase_1
---

# Customer Dashboard — Mid-Market

**Tier paused ~12 months (Tyler, 2026-09-18, `DECISIONS.md` item 4).** Same pause status as
`systems/design-mid-market.md`. Confirmed in code: `platform/dashboards/lib/tier-features.mjs`'s
`resolveFeatures()` only accepts `"smb"` and `"micro"` — passing `"mid-market"` throws
`unsupported tier "mid-market" (only "micro" and "smb" are in scope, see LANE-H-dashboards.md)`. Mid-Market is
explicitly out of scope for the current dashboard build, not merely unstarted.

## Built and verified
- (none — nothing built, by design, per the pause ruling; the shared dashboard code actively rejects this tier)

## Specified, not yet built
- [ ] Full analytics (funnels, conversion tracking, goals)
- [ ] Form submissions with CRM sync (HubSpot, Salesforce, Pipedrive)
- [ ] Calendar/appointment integrations (Calendly, Google Calendar, ServiceTitan)
- [ ] Lead scoring display, task assignment, bulk actions
- [ ] Unlimited content editing (services with before/after portfolio, team bios, video testimonials, custom
  fields, blog/resources with content calendar)
- [ ] Full design customization (unlimited colors, font upload, hero/section visual builder, custom CSS,
  white-label branding removal)
- [ ] Multi-user team access with roles (Owner/Editor/Viewer), API access, webhook integrations
- [ ] Custom stages for pipeline (vs. SMB's fixed new/contacted/converted)
- [ ] Quarterly PDF analytics report, lead scoring/sync health reporting (per
  `docs/TIER-FEATURE-MATRIX.md`'s current, non-superseded Dashboard table)

## Possible future specs (not built, not committed to)
- Everything above — the tier is paused, not scheduled. Do not build against this file without a fresh Tyler
  ruling lifting the pause.

## Open questions
- Same as `systems/design-mid-market.md`: no date or trigger condition found for lifting the pause beyond
  "~12 months."
