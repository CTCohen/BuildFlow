---
id: performance-baseline
type: principle
status: active
last_reviewed: 2026-09-08
applies_to: [build]
links: [[web-design]] [[accessibility-baseline]] [[local-seo]]
---

# Performance baseline (Core Web Vitals)

## Rule
- Ship static HTML with near-zero JS. No client framework. The only script is the
  on-scroll reveal observer.
- Images: explicit `width`/`height` (no layout shift), lazy-load below the fold,
  modern format (WebP/AVIF), sized to display size, hero preloaded.
- Fonts: self-hosted `woff2`, `font-display: swap`, ≤ 2 families, subset to Latin.
  System stack acceptable.
- CSS inlined/critical-first; no render-blocking third-party CSS or JS.
- No third-party embeds that block render (maps/reviews load lazily or as static).
- Total transferred home page < 500KB; < 50 requests.

## Targets (Lighthouse mobile, throttled)
- Performance ≥ 90 · LCP < 2.5s · CLS < 0.1 · TBT < 200ms

## Why
Local buyers are on phones on cell data; slow sites lose calls and rank worse. Static
Astro output makes 90+ the default, not a fight. (ref:local-seo-hvac-2025)

## Check
- Lighthouse CI in the QA battery: perf ≥ 90, LCP/CLS/TBT within targets, or the build fails.
- QA: no `<script src>` to a third-party host; every `<img>` has width+height.
