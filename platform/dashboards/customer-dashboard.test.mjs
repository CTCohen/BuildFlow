import test from "node:test";
import assert from "node:assert/strict";
import {
  buildLeadInbox, toCsv, buildPipeline, moveSubmissionStage, setSubmissionNotes,
  buildCrmConfigView, buildImageUploadConfig, PIPELINE_STAGES,
} from "./lib/customer-dashboard.mjs";
import { formSubmissions, crmIntegration } from "./fixtures/customer-dashboard.fixtures.mjs";

test("buildLeadInbox sorts newest first and normalizes fields", () => {
  const inbox = buildLeadInbox(formSubmissions);
  assert.equal(inbox.length, 3);
  assert.equal(inbox[0].id, "fs-1"); // 2026-09-20, newest
  assert.equal(inbox[2].id, "fs-3"); // 2026-09-15, oldest
  assert.equal(inbox[0].pipelineStage, "new");
});

test("toCsv includes header and one row per submission, quoting values", () => {
  const csv = toCsv(formSubmissions);
  const lines = csv.split("\n");
  assert.equal(lines.length, 4); // header + 3 rows
  assert.match(lines[0], /^id,name,email,phone,submitted_at,pipeline_stage,crm_sync_status$/);
  assert.match(lines[1], /"fs-1"/);
});

test("buildPipeline groups submissions into new/contacted/converted (SMB)", () => {
  const pipeline = buildPipeline("smb", formSubmissions);
  assert.deepEqual(Object.keys(pipeline).sort(), PIPELINE_STAGES.slice().sort());
  assert.deepEqual(pipeline.new, ["fs-1"]);
  assert.deepEqual(pipeline.contacted, ["fs-2"]);
  assert.deepEqual(pipeline.converted, ["fs-3"]);
});

test("buildPipeline refuses Micro (pipeline flag off)", () => {
  assert.throws(() => buildPipeline("micro", formSubmissions), /pipeline is not enabled/);
});

test("moveSubmissionStage updates stage and validates the target", () => {
  const moved = moveSubmissionStage("smb", formSubmissions[0], "contacted");
  assert.equal(moved.pipeline_stage, "contacted");
  assert.equal(formSubmissions[0].pipeline_stage, "new"); // original untouched
  assert.throws(() => moveSubmissionStage("smb", formSubmissions[0], "bogus"), /not a valid stage/);
  assert.throws(() => moveSubmissionStage("micro", formSubmissions[0], "contacted"), /pipeline is not enabled/);
});

test("setSubmissionNotes updates notes for SMB, refuses Micro", () => {
  const withNotes = setSubmissionNotes("smb", formSubmissions[0], "Called back, left voicemail.");
  assert.equal(withNotes.notes, "Called back, left voicemail.");
  assert.throws(() => setSubmissionNotes("micro", formSubmissions[0], "x"), /notes are not enabled/);
});

test("buildCrmConfigView never leaks auth_token_encrypted", () => {
  const view = buildCrmConfigView("smb", crmIntegration);
  assert.equal("authTokenEncrypted" in view, false);
  assert.equal("auth_token_encrypted" in view, false);
  assert.equal(view.crmType, "hubspot");
  assert.equal(view.connected, true);
});

test("buildCrmConfigView refuses Micro", () => {
  assert.throws(() => buildCrmConfigView("micro", crmIntegration), /CRM config is not enabled/);
});

test("buildImageUploadConfig: SMB gets multi-upload, Micro gets single-logo-only", () => {
  assert.deepEqual(buildImageUploadConfig("smb"), {
    mode: "multi", targets: ["logo", "hero", "services", "team", "testimonials"], maxFiles: 20,
  });
  assert.deepEqual(buildImageUploadConfig("micro"), { mode: "single-logo", targets: ["logo"], maxFiles: 1 });
});
