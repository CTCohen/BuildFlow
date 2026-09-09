---
id: conversion
type: principle
status: active
source: [ref:cxl-home-service-landing]
last_reviewed: 2026-09-08
applies_to: [build]
links: [[web-design]] [[page-home]] [[hvac-objection-handling]]
---

# Conversion

## Rule
- **Primary conversion = phone call.** `tel:` everywhere, sticky bar on mobile, phone in
  the header. Secondary = a 4-field quote form.
- Above the fold answers, in order: who, what, where, "can you come now?", proof (rating).
- Reduce anxiety before asking for action: license #, insured, years, real reviews,
  service-area names, same-day/emergency availability.
- Every service section ends with a CTA. Never make the user scroll back up to act.
- Form: name, phone, address, "what's going on?" — 4 fields. Label the button with the
  outcome ("Get my free quote"), not "Submit". Promise a same-business-day reply.
- State pricing signals where possible: "free estimates", financing offer, "no trip
  charge with repair". Silence on price raises anxiety.
- Trust badges near the CTA, not buried in the footer.

## Why
Home-service leads decide fast on trust + availability + affordability. Each unanswered
worry is a lost call. (ref:cxl-home-service-landing)

## Check
- QA required-content: `tel:` CTA in hero + sticky mobile bar present; quote form ≤ 5 fields.
- QA: every page has ≥ 1 CTA per screenful of content.
- LLM rubric: reviewer can state the single primary action within 3 seconds of viewing.
