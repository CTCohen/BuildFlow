import test from "node:test";
import assert from "node:assert/strict";
import { buildSandboxDashboard } from "./lib/sandbox-dashboard.mjs";
import { SAMPLE_FORM_SUBMISSIONS } from "./fixtures/sandbox-dashboard.fixtures.mjs";
import { formSubmissions as REAL_TEST_FORM_SUBMISSIONS } from "./fixtures/customer-dashboard.fixtures.mjs";

test("SMB sandbox dashboard exposes full read-only view built from sample data", () => {
  const view = buildSandboxDashboard("smb");
  assert.equal(view.readOnly, true);
  assert.equal(view.sample, true);
  assert.equal(view.tier, "smb");
  assert.equal(view.leadInbox.length, 3);
  assert.ok(view.pipeline); // SMB has pipeline enabled
  assert.deepEqual(Object.keys(view.pipeline).sort(), ["contacted", "converted", "new"]);
  assert.ok(view.crmConfig);
  assert.equal(view.crmConfig.connected, true);
  assert.equal("auth_token_encrypted" in view.crmConfig, false);
  assert.deepEqual(view.imageUploadConfig.targets, ["logo", "hero", "services", "team", "testimonials"]);
  assert.ok(view.demoAnalytics);
  assert.equal(view.demoAnalytics.uniqueSessions, 2);
});

test("Micro sandbox dashboard is lead-inbox-only, matching the real Micro scope", () => {
  const view = buildSandboxDashboard("micro");
  assert.equal(view.leadInbox.length, 3);
  assert.equal(view.pipeline, null); // Micro: pipeline off
  assert.equal(view.crmConfig, null); // Micro: crmConfig off
  assert.deepEqual(view.imageUploadConfig, { mode: "single-logo", targets: ["logo"], maxFiles: 1 });
});

test("sandbox dashboard never exposes a mutation function (moveSubmissionStage/setSubmissionNotes)", () => {
  const view = buildSandboxDashboard("smb");
  assert.equal(typeof view.moveSubmissionStage, "undefined");
  assert.equal(typeof view.setSubmissionNotes, "undefined");
  // deep-walk: nothing in the tree is a function
  const walk = (node) => {
    if (typeof node === "function") throw new Error("found a function in the sandbox view tree");
    if (node && typeof node === "object") for (const v of Object.values(node)) walk(v);
  };
  walk(view);
});

test("sandbox dashboard refuses real-dashboard fixture rows (real-looking ids)", () => {
  assert.throws(
    () => buildSandboxDashboard("smb", { formSubmissions: REAL_TEST_FORM_SUBMISSIONS }),
    /looks like a real-dashboard fixture id/
  );
});

test("sandbox dashboard rejects an unsupported tier, same as the real dashboard", () => {
  assert.throws(() => buildSandboxDashboard("mid-market"), /unsupported tier/);
});

test("sandbox sample data itself never uses real-looking ids (guards the fixture file, not just the function)", () => {
  for (const s of SAMPLE_FORM_SUBMISSIONS) {
    assert.match(s.id, /^sample-/);
    assert.match(s.prospect_email, /@example\.com$/);
  }
});
