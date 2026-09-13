---
title: Design
purpose: Documentation for DESIGN.md
status: draft
owner: c.t.cohen
updated: '2026-09-12'
tier_scope: all
phase: operational
---

# DESIGN.md — BuildFlow house style

Read this before generating or editing any site. The goal: every site feels like a real,
established local business paid a good agency — not a template. Custom feel comes from
**content + per-client tokens**, never per-client code.

## Non-negotiables

- **Specific beats pretty.** Real services, real service areas, real review wording, copy
  in the owner's voice. A plain specific site outperforms a gorgeous generic one.
- **One obvious action per screen.** Call / get a quote. Never compete CTAs.
- **Above the fold on mobile:** business name, what they do, where, phone. Nothing else required.
- **Trust signals early:** years in business, licensed & insured, service area, real reviews.
- **Fast:** ships static HTML, ~no JS. Don't add client-side frameworks. Keep it that way.
- **Bilingual parity:** EN and ES say the same things, both natural. ES is not an afterthought.

## The system (fixed craft — edit in `src/styles/global.css` for all sites)

- **Type:** system sans by default; `type-classic` swaps headings to serif. Headings
  `line-height 1.12`, `letter-spacing -0.02em`, `text-wrap: balance`.
- **Rhythm:** sections use `--density-section` (compact 4rem / comfortable 5.5rem / spacious 7rem).
  Container `max-width 76rem`, text `measure` = 42rem.
- **Elevation:** two shadows only — `--shadow-card`, `--shadow-lift`. Cards get a 1px line + card shadow.
- **Radius:** `--radius-lg` 14px (cards), `--radius-xl` 22px (media).
- **Motion:** `.reveal` on-scroll fade+rise, 0.6s, staggered ≤60ms. Buttons lift 1px on hover.
  Respect `prefers-reduced-motion`. Nothing else moves.
- **Color:** two per client — `brand.primary`, `brand.accent`. Text/ink/line/surface are fixed
  neutrals. Brand ink (text on primary) is auto-picked for contrast in `Base.astro`.

## Per-client knobs (`brand` in the client JSON — this is where "custom" lives)

| Knob | Values | Use |
|------|--------|-----|
| `heroStyle` | `split` · `photo-left` · `full-bleed` | full-bleed for bold trades (roofing, junk); split/photo-left for calmer (cleaning, carpentry) |
| `typePairing` | `grotesk-serif` · `humanist` · `classic` | `classic` (serif headings) for established / premium feel |
| `density` | `compact` · `comfortable` · `spacious` | spacious for premium, compact for "lots of services" |
| `primary` / `accent` | hex | pull from the owner's existing logo/truck/branding when it exists |

## Content rules

- **Services:** 3–6. Each: concrete name + one sentence a customer would recognise, no fluff.
- **About:** one paragraph, first person plural, mentions years + area + one differentiator.
- **Reviews:** ≥2, real wording, first name + last initial + city. Never invent 5-star raves.
- **Headline:** names the place + the trade + the promise ("Austin plumbing done right the
  first time"). Not "Welcome to our website".

## When a client wants something the template can't do

Add it to the template as a token-flagged option that every site can use, or decline.
Never fork a client. If it keeps coming up, it's a roadmap item.

## Known gaps to close

- Real photography pipeline (hero + team). Right now heroes are brand-tinted gradients.
- Self-hosted fonts per `typePairing` (currently system stack).
- EN/ES routing (data holds both languages; only EN routes are wired).
- `references/` needs 8–12 bar-setting screenshots added.
