---
id: electrical-page-map
type: trade-pack
trade: electrical
status: draft
source: []
last_reviewed: 2026-09-21
applies_to: [build]
links: [[electrical-must-haves]] [[electrical-keyword-map]] [[page-services]]
---

# Electrical site page map

## Rule
Pages every electrical site generates:

| Path | Notes |
|---|---|
| `/` | home |
| `/services` | hub |
| `/services/panel-upgrade` | panels and load |
| `/services/wiring-outlets` | wiring, outlets, switches |
| `/services/lighting` | fixtures, fans, outdoor |
| `/services/ev-charger` | dedicated circuits |
| `/services/troubleshooting` | breaker trips, dead circuits |
| `/services/emergency-electrical` | only if offered |
| `/areas/<city>` | one per `serviceAreas` entry |
| `/about`, `/contact` | standard |

Minimum: home, services hub, 4 service pages, 1 area page, about, contact. Create a service page only for something the business actually does.

## Why
Each service page targets one customer intent. A tidy map keeps pages from competing and gives every service its own searchable page.

## Check
- QA: all minimum pages present; no page for a service the business does not offer.
- SEO audit: every page is within two clicks of home and links its siblings.
