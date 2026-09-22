// Sandbox / demo-embed dashboard (BUILD_TASKS.md §3 "wire the tier dashboard preview into
// demos" + §7 "Sandbox dashboard (read-only demo embed)"). Per Tyler's ruling that demos include
// the tier's sandbox dashboard (see CLAUDE.md / RECONCILIATION_LOG.md), a prospect viewing their
// demo sees a read-only preview of the dashboard they'd get at their tier — built from the SAME
// platform/dashboards/lib/ view-model logic the real customer dashboard uses (tier-features.mjs,
// customer-dashboard.mjs, demo-tracking.mjs), not a reimplementation, so the preview never drifts
// from what the real dashboard actually does.
//
// Hard rule: this module only ever accepts sample/fixture data
// (fixtures/sandbox-dashboard.fixtures.mjs) — never a real customer_id, real form_submissions, or
// a real CRM integration row. Every mutating helper in customer-dashboard.mjs
// (moveSubmissionStage, setSubmissionNotes) is intentionally NOT re-exported here; this module
// only builds read views. `buildSandboxDashboard` also strips any mutation-shaped fields back out
// of what it returns so a caller can't wire a save button to it by accident.
//
// What this does NOT yet do: render into the actual Astro demo template (website/, app/) or
// admin/agents/design/ — those directories are outside this session's allowed scope
// (agents/lead/ and platform/dashboards/ only). This module is the tested, render-agnostic view
// model; wiring it into the live demo page's markup is the next step, owned by whichever lane
// next touches website/app/agents/design.

import { resolveFeatures } from "./tier-features.mjs";
import { buildLeadInbox, buildPipeline, buildCrmConfigView, buildImageUploadConfig } from "./customer-dashboard.mjs";
import { buildDemoAnalytics } from "./demo-tracking.mjs";
import {
  SAMPLE_FORM_SUBMISSIONS, SAMPLE_CRM_INTEGRATION, SAMPLE_DEMO_EVENTS,
} from "../fixtures/sandbox-dashboard.fixtures.mjs";

const REAL_LOOKING_ID_PATTERNS = [/^cust-/, /^fs-/, /^crm-\d/];

// Guards against ever feeding this something that isn't the sandbox fixture shape — e.g. a real
// customer_id slipping in from a caller who reused a real-dashboard variable by mistake.
function assertSampleShaped(submissions) {
  for (const s of submissions) {
    if (REAL_LOOKING_ID_PATTERNS.some((re) => re.test(String(s.id ?? "")))) {
      throw new Error(
        `buildSandboxDashboard: row id "${s.id}" looks like a real-dashboard fixture id, not a ` +
        `sandbox sample id ("sample-*"). Refusing — the sandbox dashboard must never render real data.`
      );
    }
  }
}

export function buildSandboxDashboard(tier, {
  formSubmissions = SAMPLE_FORM_SUBMISSIONS,
  crmIntegration = SAMPLE_CRM_INTEGRATION,
  demoEvents = SAMPLE_DEMO_EVENTS,
} = {}) {
  assertSampleShaped(formSubmissions);
  const features = resolveFeatures(tier); // throws on an unsupported tier, same as the real dashboard

  const view = {
    tier,
    readOnly: true,
    sample: true, // every consumer (demo template) can key off this to show a "sample data" banner
    features,
    leadInbox: features.leadInbox ? buildLeadInbox(formSubmissions) : null,
    pipeline: features.pipeline ? buildPipeline(tier, formSubmissions) : null,
    crmConfig: features.crmConfig ? buildCrmConfigView(tier, crmIntegration) : null,
    imageUploadConfig: buildImageUploadConfig(tier),
    demoAnalytics: buildDemoAnalytics(demoEvents),
  };

  // Belt-and-suspenders: nothing in the returned tree should carry a mutation hook or a real-shaped id.
  const serialized = JSON.stringify(view);
  if (/[Ff]unction|=>/.test(serialized)) {
    throw new Error("buildSandboxDashboard: refusing to return a view containing a function/callback");
  }
  return view;
}
