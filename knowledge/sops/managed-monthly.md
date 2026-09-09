---
id: managed-monthly
type: sop
status: draft
last_reviewed: 2026-09-08
applies_to: [managed]
links: [[content-refresh]] [[local-seo]] [[ai-seo]] [[hvac-phoenix-seasonal]]
---

# SOP — managed account, monthly (Package B)

Runs once per calendar month per managed client. Agent-run; human reviews the report.

## Steps
1. **Health check:** site up, forms submitting, Lighthouse re-run (perf ≥ 90 / a11y ≥ 95),
   broken-link scan, SSL + domain expiry.
2. **Rankings:** check primary keywords ([[hvac-keyword-map]]) in the client's city; log
   position deltas.
3. **GBP post:** publish one seasonal Google Post per [[hvac-phoenix-seasonal]] current month.
4. **Reviews:** report new review count + rating; flag any ≤ 3★ for the human.
5. **Content refresh:** apply [[content-refresh]] (one page updated or added).
6. **AI visibility:** re-run `searchfit-seo:ai-visibility`; regenerate `/llms.txt` if pages changed.
7. **Client report:** 1 page — traffic, calls/forms, rankings movement, what we did, what's next.

## Check
- All 7 steps completed and logged; report sent; any regression (perf, ranking drop,
  broken form) raised to the human same day.
