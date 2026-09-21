---
id: electrical-schema
type: trade-pack
trade: electrical
status: draft
source: []
last_reviewed: 2026-09-21
applies_to: [build, seo]
links: [[electrical-must-haves]] [[electrical-keyword-map]] [[local-seo]]
---

# Electrical structured data

## Rule
JSON-LD on every page. Sitewide type: `Electrician` (a schema.org LocalBusiness subtype).
Per service page: `Service` with `serviceType`, `provider`, `areaServed`. Home and service pages: `FAQPage`. Add `aggregateRating` only when reviews are real.

Rules: values come only from verified business data; never emit a rating or review count that is not real; `name`, `telephone`, and `areaServed` strings match the visible business name, phone, and areas exactly.

## Why
Structured data helps search engines and AI assistants identify the business, its services, and where it works.

## Check
- Schema validates in the Rich Results test.
- QA: the type appears on every page; NAP strings match footer and contact page.
