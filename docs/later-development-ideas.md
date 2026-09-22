---
title: Later Development Ideas
purpose: Documentation for later-development-ideas.md
status: draft
owner: c.t.cohen
updated: '2026-09-12'
tier_scope: all
phase: operational
---

# Later development ideas — Fornax

Parked ideas. Not in the current build. Revisit after the core pipeline works.

## Platform-specific pain points woven into the offer

During website assessment (Stage 2B), detect the platform the prospect's current site is
built on (WordPress + theme, Wix, Squarespace, GoDaddy, Weebly, Duda, hand-coded, etc.)
and detect concrete code/health issues.

Then, in the outreach + offer, acknowledge the specific problems that platform/stack is
known for and that they are likely experiencing. Examples:
- WordPress business site → plugin bloat, security/update burden, slow admin, page speed,
  maintenance cost.
- Wix/GoDaddy builder → poor Core Web Vitals, limited local SEO control, template sameness,
  export lock-in.
- Old hand-coded site → not responsive, no HTTPS, no structured data.

Deliver it as: "Your site is on X. Businesses on X typically hit A, B, C. Here's your site's
score, here's the specific evidence, here's a replacement that fixes it."

## SEO scorecard as a lead magnet / outreach asset

Turn the Stage 2B audit into a shareable one-page SEO/web-presence scorecard for the
prospect (their score vs. a good score, per category, with the top 3 fixes). Use as the
outreach hook and/or a free tool on the marketing site.

## Admin GUI for the warehouse

Small internal web page to eyeball/edit `warehouse` rows, override vet decisions, and
watch the queue — instead of adding Airtable.

## Win-back track for churned managed clients

Separate sequence for `won → churned` businesses after a 30-day cooldown.
