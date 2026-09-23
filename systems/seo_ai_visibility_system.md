---
title: SEO / AI Visibility (GEO) System
purpose: Authoritative spec and build checklist for design-default SEO, dynamic per-customer optimization, and ranking/AI-answer monitoring. Absorbs systems/16-seo-geo-system.md from the original 19-system export.
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# SEO / AI Visibility (GEO) System

Three layers, per the original spec: Layer 1 (design-time SEO defaults baked into every site), Layer 2 (dynamic
per-customer optimization by vertical/geography), Layer 3 (ranking monitoring with auto-optimization triggers).
**Naming note, cross-referenced against `DECISIONS.md` item 17/D26:** the original System 16 file used "GEO" to
mean geographic targeting. D26 already ruled that in this codebase's usage, "GEO" instead means **Generative
Engine Optimization** — AI-answer visibility (how the site shows up in ChatGPT/Perplexity/AI-overview answers,
not just Google rankings) — and relabeled it "AI SEO (GEO)". This file *is* that relabeled system: geographic
targeting is still covered (Layer 2's geo-keyword/proximity work), but the "AI visibility" framing in this
file's title reflects D26's ruling, not the original export's geographic-only framing. Per `DECISIONS.md` item
6/37, Layer 1 (SEO/GEO defaults) ships in every tier, not gated to SMB+.

**Code lives at:** `knowledge/sops/ai-seo-setup.md` (Layer 1 setup SOP), `knowledge/pool/validate.mjs` (content
fact-density validator), original spec: `knowledge/SPEC-16-seo-geo.md`.

## Built and verified
- [x] Layer 1 fact-density requirement for AI-SEO: every service in the copy pool carries a `facts` array
  (>=3 concrete facts — years-in-business/license always included; warranty/same-day/24-7/free-estimate/
  financing gated behind the same `requires` flags the headlines already use, so nothing fabricated) —
  `knowledge/sops/ai-seo-setup.md` step 3, enforced by `knowledge/pool/validate.mjs`. Per
  `operations/BUILD_TASKS.md` line 71: **52/52 validator checks passing** (was 49/49 before this work), 0
  stubs/dangling in the content graph — evidence as logged in that build task, not independently re-run in
  this pass (validator requires the full content-pool context to execute meaningfully; taking the logged
  52/52 figure from the merged content lane rather than re-deriving it).

## Specified, not yet built
- [ ] Layer 1 remainder: meta tag templates (title "[Business] - [Service] in [City]", 40-60 chars; description
  155-160 chars), schema markup (LocalBusiness, Review, Service, BreadcrumbList, Organization), on-page rules
  (H1 hierarchy, alt text, internal linking), technical baseline (HTTPS, responsive breakpoints, sitemap.xml,
  robots.txt, canonical tags), Core Web Vitals QA gate (LCP <2.5s, FID <100ms, CLS <0.1, Lighthouse ≥90) —
  only the fact-density piece above is confirmed built; the rest of Layer 1 is unconfirmed in this pass (no
  design-system code was checked for these specific items — flagging as unconfirmed rather than guessing).
- [ ] Layer 2: dynamic per-customer optimization engine (vertical + geography + tier → optimized title/
  description/keywords/content), vertical-specific templates (Plumbing/HVAC/Electrical/Roofing), geo-keyword
  expansion, Tyler-approval workflow for auto-suggested content changes. SMB-tier-only per Tyler's 2026-09-18
  override. Not built.
- [ ] Layer 3: ranking monitoring (SEMrush/SerpAPI or free alternative), per-keyword customer dashboard,
  anomaly detection (rank drop >5 positions/30 days, new top-10 competitor), the four auto-optimization
  triggers, and the SEO/GEO Optimization Agent (Agent Registry #13) that executes them. Deferred until revenue
  per Tyler's 2026-09-18 override. Not built.

## Possible future specs (not built, not committed to)
- Premium rank-tracking tool upgrade (Phase 2, "if revenue allows" per original spec)
- Anti-thrashing rule enforcement (2-week cooldown between optimization passes on the same page) — designed in
  spec, no code to enforce it yet since Layer 3 doesn't exist

## Open questions
- None specific to this file beyond the layers already marked unconfirmed above — the naming resolution (GEO =
  Generative Engine Optimization, per D26) is settled and not reopened here.
