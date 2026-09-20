---
title: System 16 — SEO GEO System
purpose: Design defaults, dynamic optimization, ranking monitoring, and auto-triggered optimizations
status: active
owner: c.t.cohen
updated: '2026-09-18'
version: 1.0.0
tier_scope: all
phase: phase_1
spec_name: 16-seo-geo-system
spec_aliases:
- SEO
- geo-targeting
- search optimization
- local SEO
spec_sources:
- chat
spec_authority: authoritative (exported from claude.ai project memory 2026-09-17)
---

> **Overrides (Tyler, 2026-09-18).** This spec is authoritative except where Tyler ruled otherwise (`RECONCILIATION_LOG.md`, `DECISIONS.md`):
> - Layer 1 (design defaults, plus `llms.txt` and answer-structured FAQ) applies to every tier. Layer 2 monthly optimization is SMB. Layer 3 ranking tracking is deferred until revenue.
> - 'GEO' in this spec means geographic targeting; AI-answer optimization is handled inside Layer 1.


# System 16 — SEO GEO System

## Purpose

Lock down three layers of SEO/geo-targeting: design defaults, dynamic optimization per customer geography/vertical, and ranking monitoring with automation.

## Contents

- Layer 1: Design defaults (schema, meta tags, Core Web Vitals, geo-content)
- Layer 2: Dynamic optimization per customer (vertical-specific, geographic)
- Layer 3: Ranking monitoring and auto-optimization triggers
- Long-term SEO strategy and budget impact
- Agent cross-reference

## Specifications

### SECTION 1: Layer 1 — Design Defaults (Built-In SEO)

**Meta tags:** title "[Business] - [Service] in [City]" (40-60 chars), meta description 155-160 chars, viewport, UTF-8

**Schema markup:** LocalBusiness, Review (aggregate rating), Service (per service), BreadcrumbList, Organization

**On-page:** one H1/page, proper heading hierarchy, alt text on all images, internal linking, keyword usage (H1/title/description + 1-2x body)

**Technical:** HTTPS, mobile responsive (320/768/1024px tested), page speed optimization, auto sitemap.xml, robots.txt, canonical tags

**Core Web Vitals targets:** LCP <2.5s, FID <100ms, CLS <0.1, Lighthouse ≥90; enforced as QA gate

**Geo-content defaults:** service area = customer's city (customizable), geo keywords in titles/descriptions, local citation consistency, "serving X and surrounding areas" boilerplate

---

## SECTION 2: Layer 2 — Dynamic Optimization Per Customer

**Engine:** input (vertical, service area, tier) → output (optimized title/description/keywords/content snippets), automated monthly or on-request

**Vertical-specific optimizations (Plumbing/HVAC/Electrical/Roofing):** vertical keyword sets, title templates, vertical-specific schema, seasonal content (HVAC), safety-focused language (Electrical), before/after content (Roofing)

**Geographic optimization:** geo-keyword expansion (city/county/nearby), local citation updates, proximity targeting (nearby suburbs), mobile "near me" optimization

**Automated content suggestions:** title/content-gap/keyword-density/readability/internal-link suggestions — Tyler approval workflow (applies or dismisses)

---

## SECTION 3: Layer 3 — Ranking Monitoring & Auto-Optimization

**Tracking:** SEMrush API or free alternative (SerpAPI); top 10-20 keywords per site; monthly baseline, weekly for top 5

**Customer ranking dashboard:** per-keyword rank + trend, 3-month chart, visibility score

**Anomaly detection:** flag rank drop >5 positions/30 days, new top-10 competitor, indexed-but-not-ranking pages

**Auto-optimization triggers:**
1. Ranking drop → audit page, fix content/readability/media, implement within 30 days
2. Competitor in top 5 → analyze competitor, improve content/backlinks, 60-day timeline
3. Low CTR → optimize title/description, A/B test 30 days
4. Seasonal drop → prepare seasonal content 2 months in advance

**Long-term strategy:** Phase 1 (0-3mo) technical/on-page/citations; Phase 2 (3-6mo) content expansion/earned links; Phase 3 (6mo+) brand authority. Expect 6-12 months to top-3 in competitive markets.

**Budget:** Phase 1 skip premium tool (DIY free tools + spot-checks); Phase 2 upgrade if revenue allows

---

## SECTION 4: Agent Cross-Reference

**Agent used:** SEO/GEO Optimization Agent (Agent Registry #13) — routing-pattern workflow executing Section 3's four auto-optimization triggers.

**Anti-thrashing rule:** after an optimization action, changes monitored 2 weeks before agent can trigger another pass on the same page.

**Human gate:** content/meta changes route through Tyler's approval workflow — agent drafts, Tyler applies or dismisses. Never auto-publishes to a live customer site.

Full agent detail: `agents/AGENT_REGISTRY.md`
