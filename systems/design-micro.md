---
title: Design System — Micro
purpose: Authoritative spec and build checklist for the Micro tier's website generation. Superseded/absorbed from docs/DESIGN_SYSTEMS/MICRO.md, design/SPEC-04-design-quality.md.
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.0.0
tier_scope: micro
phase: phase_1
---

# Design System — Micro

Website generation for solo-contractor customers: one fixed design, minimal input, fast build, no layout
customization. Philosophy: "We pick the best defaults." Built **after** SMB per Tyler's sequencing
(`docs/DESIGN_SYSTEMS/MICRO.md`).


**Code lives at:** `agents/design/`

**Saved demo builds:** `app/dist/` is Astro's ephemeral build output (gitignored, wiped every build — not a
storage location) and `agents/design/out/smoke/` is scratch space for a single smoke-test run (overwritten next
run). A build worth keeping past the run that produced it — for review, a QA escalation, or an outreach send —
gets copied into `agents/design/demos/micro/<vertical>-<slug>/`. Only `agents/design/demos/README.md` and any
curated review report are tracked in git; the generated site output itself is gitignored
(`agents/design/demos/*/*/` in `.gitignore`). See `agents/design/demos/README.md` for the full convention.

## Built and verified
- (none confirmed Micro-specific. The shared Design Agent that Micro will run through — `agents/design/`,
  67/67 evals passing — is built and verified for SMB; `operations/BUILD_TASKS.md` does not list a Micro-tier
  build task or test run distinct from SMB's. Do not read SMB's evidence as covering Micro.)

## Specified, not yet built
- [ ] Micro flag in client data (`tier: micro`, `styleProfile`) driving a reduced component set behind the flag
- [ ] Reduced 6-8 component template (hero, services grid, single service page, testimonials 2-3, contact form,
  footer with NAP/hours, mobile call bar) — reusing SMB components in a reduced set, not forked
- [ ] Fixed styling profile default: "Professional Service," no slider customization (contrast with SMB, which
  has sliders per `docs/DESIGN_SYSTEMS/SMB.md`)
- [ ] Identity resolution: `existing-identity` if a logo exists (via Discovery Agent), else `generated-identity`
  — the Discovery Agent itself is built and had a real bug fix verified 2026-09-22 (commit `5f4159f`, 67/67
  design evals, live smoke test against deljoheating.com went from 0.75 to 1.0 confidence), but that fix was
  tested generically, not against a Micro-flagged build
- [ ] Locked editable scope in dashboard (business name, service text, contact info, hours, logo, gallery
  images only — hero/layout/colors/fonts locked, per RECONCILIATION_LOG D18)
- [ ] No CRM connector at launch (email lead alerts + CSV export only, per D21) — the dashboard side of this is
  partially covered by `platform/dashboards/lib/tier-features.mjs`'s Micro overrides (see systems/dashboard-micro.md), which correctly set `crmConfig: false` for Micro; the *design system's* copy/template side of "no CRM" is not itself a build item, just a non-feature
- [ ] Smoke test across each of the 4 verticals with 2-3 profiles

## Possible future specs (not built, not committed to)
- 2 vs. 3 fixed hero options for Micro (open item in the source doc, undecided)
- Single-service-page vs. services-grid layout choice (open item in the source doc, undecided)

## Open questions
- Both open items above are unresolved in `docs/DESIGN_SYSTEMS/MICRO.md` itself and no later ruling was found
  in DECISIONS.md or RECONCILIATION_LOG.md.
- Whether Micro CAC and churn should gate a revisit of the fixed-default philosophy — noted in the source doc
  as "measure after launch," not yet possible since nothing is live.
