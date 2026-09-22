---
title: Marketing Site System
purpose: Authoritative spec and build checklist for the public marketing website. Superseded/absorbed from website/SPEC-19-website.md (System 19).
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Marketing Site System

The public-facing site (separate from the admin CRM and customer dashboards): Home, Features, Pricing, Demo,
Blog, Docs, About. Built as draft Astro pages 2026-09-22 per `operations/BUILD_TASKS.md` §9. Case Studies is
explicitly withheld pending real customers.

## Built and verified
- [x] Home, Features, Pricing, Demo, Blog, Docs, About pages — draft Astro pages under `website/src/pages/`
  (`index.astro` pre-existing and extended; new: `features.astro`, `pricing.astro`, `demo.astro`,
  `about.astro`, `docs/index.astro`, `blog/index.astro` + 2 posts).
- [x] Pricing page numbers match `docs/PRICING.md` exactly — Micro $149/$1,490/$499, SMB $249/$2,490/$799,
  Mid-Market $399/$3,990/$1,299 shown as paused/waitlist per DECISIONS.md item 4.
- [x] No fabricated testimonials, customer logos, or case studies — Demo page's dashboard preview and About
  page's proof section are explicitly marked as placeholders pending real customers, per `CLAUDE.md`'s "Don't"
  rule (no fabricated testimonials or customer results).
- [x] No real domain hardcoded — replaced pre-existing `hello@buildflow.com` mailto links and the absolute
  `https://buildflow.com/og-image.png` OG tag with internal `/demo` links and a relative `/og-image.png`;
  footer states the contact email/domain are not yet public.
- [x] Build proof — `cd website && npm run build` → **15 page(s) built in 648ms**, no errors (unrelated macOS
  keychain warnings about "failed to copy trust settings of system certificate" are not build failures).
- [x] Governance lint clean — `python3 governance/enforce.py --lint` → **0 stale-term hit(s)**.
- [x] No free trial / no lead-or-site limits shown on the pricing page, per the 2026-09-18 override (this
  overrides the spec's own original text in Section 4, which listed a 14-day free trial and lead/site caps —
  that original text is now stale per the override note at the top of `website/SPEC-19-website.md`)
- [x] Hero uses done-for-you framing (not "website builder"), per the same override — confirmed as an explicit
  build correction in BUILD_TASKS.md §9's own listing of what was fixed relative to the original spec text.

## Specified, not yet built
- [ ] Case Studies page — spec lists it, but Tyler's override explicitly forbids case studies before real
  customers exist; correctly not built, and outside BUILD_TASKS.md §9's task scope list
- [ ] Logo and brand identity [decision: Tyler picks direction] — not resolved; also intersects with the
  BuildFlow→Fornax rebrand (DECISIONS.md item 17, 2026-09-22)
- [ ] Deploy to production [depends: §8 legal sign-off if the site names real pricing/claims — do not deploy
  before then; also depends on not touching `platform/hosting/`, which another lane owns concurrently]
- [ ] Rebrand pass applying "Fornax" everywhere the old "BuildFlow" name appears in this site's content — per
  DECISIONS.md item 17 (ruled 2026-09-22, same day as this file); not confirmed as applied to `website/`'s
  actual page content in this pass — flagging as likely still needed rather than assuming it's done, since the
  rebrand decision postdates the §9 build note it's layered on top of

## Possible future specs (not built, not committed to)
- Phase 2: +2 case studies, expanded blog, video testimonials, Calendly integration
- Phase 3: customer stories, comparison page, integration directory, video tutorials
- A dedicated Content Agent for blog writing, once posting volume justifies it (spec explicitly frames this as
  "a reasonable Phase 2 addition," not committed)

## Open questions
- Whether the "Fornax" rebrand has been applied to this site's actual copy yet, or only to governance/naming
  docs — worth a direct check before deploy, not assumed either way here.
