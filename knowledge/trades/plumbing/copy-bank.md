---
id: plumbing-copy-bank
type: trade-pack
trade: plumbing
status: draft
source: []
last_reviewed: 2026-09-21
applies_to: [build]
links: [[plumbing-must-haves]] [[anti-ai-slop-copy]]
---

# Plumbing copy bank

## Rule
Copy for this trade lives in the reusable pool at `knowledge/pool/plumbing.json`: per service, headline variants tagged by tone, hero sub-lines, a one-sentence blurb, a direct-answer opener, symptoms, process steps, and FAQ. Merge fields ({business}, {city}, {phone}, {areas}, {years}, {license}) are filled at build time.

Rules for editing the pool: no invented prices, percentages, licences, or years; claims about availability or offers carry a `requires` flag and are used only when the business confirms them; no banned phrases (see `anti-ai-slop-copy`); no em dashes.

## Why
Generating copy once and reusing it avoids a model call per prospect while keeping each site specific through merge fields, service lists, and the business's own facts.

## Check
- `node knowledge/pool/validate.mjs` passes with no failures.
- Reviewer: a rendered page names this business, city, and services and reads like the owner, not a template.
