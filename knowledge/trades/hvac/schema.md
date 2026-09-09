---
id: hvac-schema
type: trade-pack
trade: hvac
status: draft
source: [ref:google-localbusiness-schema, ref:geo-2025]
last_reviewed: 2026-09-08
applies_to: [build, seo]
links: [[local-seo]] [[ai-seo]] [[hvac-page-map]]
---

# HVAC structured data

JSON-LD on every page. Values come only from verified business data.

## Sitewide — `HVACBusiness` (subtype of `LocalBusiness`)
```json
{
  "@context": "https://schema.org",
  "@type": "HVACBusiness",
  "name": "<Business>",
  "telephone": "<phone>",
  "email": "<email>",
  "url": "<site>",
  "image": "<logo or hero>",
  "priceRange": "$$",
  "areaServed": ["<City1>", "<City2>", "..."],
  "address": { "@type": "PostalAddress", "addressLocality": "<HQ city>", "addressRegion": "AZ" },
  "geo": { "@type": "GeoCoordinates", "latitude": <lat>, "longitude": <lng> },
  "openingHoursSpecification": [ ... from hours ... ],
  "sameAs": ["<Google Business Profile URL>", "<Facebook>", "..."],
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": <rating>, "reviewCount": <count> }
}
```

## Per service page — `Service` + `HowTo`
- `Service` with `serviceType`, `provider` (the business), `areaServed`.
- `HowTo` for the "what we do" steps.

## Per area page — `LocalBusiness` with `areaServed` = that city.

## Home + service pages — `FAQPage`
- Each `Question` / `acceptedAnswer` mirrors visible on-page FAQ text exactly.

## Rules
- Never emit a rating/review count that isn't real.
- `name`, `telephone`, `areaServed` strings identical to the visible NAP.

## Check
- Schema validates (Rich Results test / `searchfit-seo:schema-markup`).
- QA: `HVACBusiness` on every page; `FAQPage` on `/` and each `/services/*`; NAP strings
  in JSON-LD == footer == contact page.
