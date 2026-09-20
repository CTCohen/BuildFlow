---
title: Readme
purpose: Documentation for README.md
status: draft
owner: c.t.cohen
updated: '2026-09-12'
tier_scope: all
phase: operational
---

# Customers

Customer data, intake, feedback, and case studies.

## What's Here

- **CASE_STUDIES.md** — Summary of all customer wins (public-facing)
- **[customer-slug]/** — One folder per customer
  - INTAKE.md — Who they are, what they needed
  - SITE_CONFIG/ — Their config files (linked from app/src/data/clients/)
  - FEEDBACK.md — Post-launch requests, satisfaction
  - METRICS.md — Their site's traffic, conversions, uptime
  - NOTES.md — Call notes, context

## Example Customer Folder

```
customers/
├── glendale-heating-cooling/
│   ├── INTAKE.md
│   ├── FEEDBACK.md
│   ├── METRICS.md
│   └── NOTES.md
└── ...
```

## How to Add a Customer

1. Create folder: `customers/[business-slug]/`
2. Add INTAKE.md with:
   - Business name, type (HVAC, plumbing, etc.)
   - Location, years in business
   - Why they signed up
   - What they valued most
   - Tier and deal terms (Micro $149/mo or $499 offboard; SMB $249/mo or $799 offboard)
3. Add FEEDBACK.md after launch (post-mortem: what went well, what to improve)
4. Update CASE_STUDIES.md with win summary

## Owner

Tyler (customer relationships), Claude (documentation)
