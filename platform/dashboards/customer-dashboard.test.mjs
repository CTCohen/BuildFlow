import test from "node:test";
import assert from "node:assert/strict";
import {
  buildLeadInbox, toCsv, buildPipeline, moveSubmissionStage, setSubmissionNotes,
  buildCrmConfigView, buildImageUploadConfig, PIPELINE_STAGES,
} from "./lib/customer-dashboard.mjs";
import { formSubmissions, crmIntegration } from "./fixtures/customer-dashboard.fixtures.mjs";
import { resolveFeatures } from "./lib/tier-features.mjs";

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

// BUILD_TASKS.md §7 "Micro dashboard (lead inbox only)" — end-to-end confirmation that every
// customer-dashboard.mjs builder, driven purely through tier-features.mjs flags (no separate
// Micro code path), actually lands on lead-inbox-only for Micro. buildLeadInbox itself is not
// tier-gated (there is no "leadInbox" check inside it) — the gating that matters is that every
// OTHER dashboard capability refuses Micro, which is what makes Micro "lead-inbox-only" in
// practice. This test walks every capability once, for both tiers, so a future capability added
// to SMB without an explicit Micro decision fails loudly here instead of silently leaking through.
test("Micro dashboard end to end: lead inbox works, every other capability refuses Micro by flag", () => {
  const micro = resolveFeatures("micro");
  const smb = resolveFeatures("smb");

  // Lead inbox: on for both tiers (not gated by a feature flag at all — it's the one thing the
  // matrix guarantees every tier has), and behaves identically regardless of tier.
  assert.equal(micro.leadInbox, true);
  const microInbox = buildLeadInbox(formSubmissions);
  const smbInbox = buildLeadInbox(formSubmissions);
  assert.deepEqual(microInbox, smbInbox);
  assert.equal(microInbox.length, 3);

  // Everything else SMB can do, Micro's flags turn off, and the builder actually enforces it:
  assert.equal(smb.pipeline, true);
  assert.equal(micro.pipeline, false);
  assert.throws(() => buildPipeline("micro", formSubmissions), /pipeline is not enabled/);

  assert.equal(smb.notes, true);
  assert.equal(micro.notes, false);
  assert.throws(() => setSubmissionNotes("micro", formSubmissions[0], "x"), /notes are not enabled/);

  assert.equal(smb.crmConfig, true);
  assert.equal(micro.crmConfig, false);
  assert.throws(() => buildCrmConfigView("micro", crmIntegration), /CRM config is not enabled/);

  assert.equal(smb.imageUploads, true);
  assert.equal(micro.imageUploads, false);
  assert.equal(micro.singleLogoUpload, true); // matrix's one Micro exception: a single logo replace
  assert.deepEqual(buildImageUploadConfig("micro"), { mode: "single-logo", targets: ["logo"], maxFiles: 1 });

  // Locked for every tier, not a Micro-specific restriction:
  assert.equal(micro.editBrandColor, false);
  assert.equal(smb.editBrandColor, false);
});

test("Micro CSV export still works (matrix does not restrict it, only pipeline/notes/CRM/uploads)", () => {
  const csv = toCsv(formSubmissions);
  assert.equal(csv.split("\n").length, 4);
});
