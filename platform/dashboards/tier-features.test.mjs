import test from "node:test";
import assert from "node:assert/strict";
import { resolveFeatures, isFeatureEnabled } from "./lib/tier-features.mjs";

test("SMB gets the full base feature set", () => {
  const f = resolveFeatures("smb");
  assert.equal(f.notes, true);
  assert.equal(f.pipeline, true);
  assert.equal(f.imageUploads, true);
  assert.equal(f.crmConfig, true);
  assert.equal(f.leadInbox, true);
});

test("Micro is the same component set with a reduced flag set, not a fork", () => {
  const smb = resolveFeatures("smb");
  const micro = resolveFeatures("micro");
  assert.deepEqual(Object.keys(smb).sort(), Object.keys(micro).filter((k) => k in smb).sort());
  assert.equal(micro.leadInbox, true); // lead-inbox-only per BUILD_TASKS.md §7
  assert.equal(micro.notes, false);
  assert.equal(micro.pipeline, false);
  assert.equal(micro.crmConfig, false);
  assert.equal(micro.imageUploads, false);
  assert.equal(micro.singleLogoUpload, true);
  assert.equal(micro.singlePhoneNumberEdit, true);
});

test("no tier can self-edit brand color or fonts (matrix: pre-approved/locked)", () => {
  assert.equal(resolveFeatures("smb").editBrandColor, false);
  assert.equal(resolveFeatures("micro").editFonts, false);
});

test("mid-market is out of scope for this dashboard build", () => {
  assert.throws(() => resolveFeatures("mid-market"), /unsupported tier/);
});

test("isFeatureEnabled reads through resolveFeatures", () => {
  assert.equal(isFeatureEnabled("smb", "pipeline"), true);
  assert.equal(isFeatureEnabled("micro", "pipeline"), false);
});

test("isFeatureEnabled rejects an unknown feature name", () => {
  assert.throws(() => isFeatureEnabled("smb", "notARealFeature"), /unknown feature/);
});
