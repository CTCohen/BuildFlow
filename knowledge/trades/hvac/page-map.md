---
id: hvac-page-map
type: trade-pack
trade: hvac
status: draft
source: [ref:local-seo-hvac-2025]
last_reviewed: 2026-09-08
applies_to: [build, seo]
links: [[hvac-must-haves]] [[page-service-detail]] [[page-service-area]] [[hvac-keyword-map]]
---

# HVAC site page map

Pages every HVAC site generates:

| Path | Notes |
|---|---|
| `/` | home ([[page-home]]) |
| `/services` | hub ([[page-services]]) |
| `/services/ac-repair` | "AC not cooling / blowing warm" |
| `/services/ac-installation` | replacement + financing + efficiency credits |
| `/services/heating-repair` | "no heat / furnace won't ignite" |
| `/services/heating-installation` | furnace / heat pump install |
| `/services/maintenance` | tune-ups + membership plan |
| `/services/emergency-hvac` | 24/7, if offered |
| `/services/<extra>` | duct, IAQ, mini-split, thermostat — only if the business does it |
| `/areas/<city>` | one per `serviceAreas` entry ([[page-service-area]]) |
| `/about` · `/contact` | standard |
| `/llms.txt` · `/sitemap.xml` · `/robots.txt` | generated |

Rules:
- Minimum: home, services hub, 4 service pages, 1 area page, about, contact.
- Only create a service page for something the business actually does (from their site / GBP / reviews).
- Every service page links its siblings + the area pages; every area page links the services.

## Check
- QA: all minimum pages present; no service page for a service not in `derived_services`.
- SEO audit: internal-link graph connected, every page ≤ 2 clicks from home.
