---
title: Spec Location Map
purpose: Where each system spec now lives in the repo, and how the spec export was applied
status: active
owner: c.t.cohen
updated: '2026-09-18'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Spec location map

The spec export (`buildflow-specs.zip`, exported from claude.ai project memory on 2026-09-17) is **authoritative**. Its files were moved beside the modules they govern (launch plan Step 2.4). The repo copy is now the source of truth; if a spec is edited in claude.ai, re-export and reconcile.

| System | File | Module |
|---|---|---|
| Index | `docs/specs/INDEX.md` | cross-cutting |
| Business model and constraints | `docs/BUSINESS_MODEL.md` | cross-cutting |
| Launch readiness plan (8 steps) | `docs/specs/LAUNCH_READINESS_PLAN.md` | cross-cutting |
| Documentation conventions | `docs/specs/PREFERENCES.md` | cross-cutting |
| Original export README and CLAUDE snippet | `docs/specs/EXPORT_README.md`, `EXPORT_CLAUDE_SNIPPET.md` | history (paths in them describe the export, not the repo) |
| 01 Business Operations | `docs/01-business-operations-system.md` | docs |
| 02 Platform Architecture | `platform/SPEC-02-platform-architecture.md` | platform |
| 03 Hosting and Infrastructure | `platform/SPEC-03-hosting-infrastructure.md` | platform |
| 04 Design and Quality | `design/SPEC-04-design-quality.md` | design, `app/` |
| 05 Feature System | `specs/05-feature-system.md` | specs |
| 06 Demo-to-Customer | `platform/SPEC-06-demo-to-customer.md` | platform |
| 07 Lead-to-Customer Pipeline | `outreach/SPEC-07-lead-to-customer-pipeline.md` | outreach, agents |
| 08 Payments and Billing | `billing/SPEC-08-payments-billing.md` | billing |
| 09 CRM Integration | `crm/SPEC-09-crm-integration.md` | crm |
| 10 External Integrations | `crm/SPEC-10-external-integrations.md` | crm |
| 11 Compliance and Security | `legal/SPEC-11-compliance-security.md` | legal, platform |
| 12 Customer Lifecycle | `onboarding/SPEC-12-customer-lifecycle.md` | onboarding |
| 13 Observability | `platform/SPEC-13-observability.md` | platform |
| 14 Customer Support | `operations/SPEC-14-customer-support.md` | operations |
| 15 Customer Feedback | `operations/SPEC-15-customer-feedback.md` | operations |
| 16 SEO/GEO | `knowledge/SPEC-16-seo-geo.md` | knowledge |
| 17 Experimentation | `operations/SPEC-17-experimentation.md` | operations |
| 18 Admin CRM and Operations | `platform/SPEC-18-admin-crm-operations.md` | platform |
| 19 BuildFlow Website | `website/SPEC-19-website.md` | website |
| Agent Registry | `agents/AGENT_REGISTRY.md` | agents |

## Overrides
Where Tyler's rulings change a spec, the affected spec file carries an "Overrides (Tyler, 2026-09-18)" box at the top. The full list of conflicts and rulings is `RECONCILIATION_LOG.md`; decisions are in `DECISIONS.md`.

## Status of application
`docs/specs/APPLICATION_MANIFEST.md` lists every workspace file with its intended action and whether it has been done. `python3 governance/enforce.py --lint` checks for retired terms.
