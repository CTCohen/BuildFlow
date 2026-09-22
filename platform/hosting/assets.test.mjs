import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { assetKey, guessContentType, buildAssetManifest, uploadAssets } from "./assets.mjs";
import { MockCloudflareAdapter } from "./mocks.mjs";

function fakeBuild() {
  const outDir = mkdtempSync(join(tmpdir(), "fornax-assets-test-"));
  mkdirSync(join(outDir, "assets"));
  writeFileSync(join(outDir, "index.html"), "<html>hi</html>");
  writeFileSync(join(outDir, "assets", "logo.png"), Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  return outDir;
}

test("assetKey: sites/<slug>/<version>/<relPath> structure", () => {
  assert.equal(assetKey("acme-hvac", "v1", "index.html"), "sites/acme-hvac/v1/index.html");
});
test("assetKey: requires all three parts", () => {
  assert.throws(() => assetKey(null, "v1", "index.html"), /slug is required/);
  assert.throws(() => assetKey("acme", null, "index.html"), /version is required/);
  assert.throws(() => assetKey("acme", "v1", null), /relPath is required/);
});

test("guessContentType: maps common extensions, falls back to octet-stream", () => {
  assert.equal(guessContentType("index.html"), "text/html; charset=utf-8");
  assert.equal(guessContentType("assets/logo.png"), "image/png");
  assert.equal(guessContentType("weird.unknownext"), "application/octet-stream");
});

test("buildAssetManifest: keys every file under a version prefix for its slug", () => {
  const outDir = fakeBuild();
  const manifest = buildAssetManifest(outDir, { slug: "acme-hvac", version: "v1" });
  const keys = manifest.map((m) => m.key).sort();
  assert.deepEqual(keys, ["sites/acme-hvac/v1/assets/logo.png", "sites/acme-hvac/v1/index.html"]);
  assert.ok(manifest.every((m) => m.body.length === m.size));
});

test("uploadAssets: uploads every file and returns a bundleUrl pointing at the version's index.html", async () => {
  const outDir = fakeBuild();
  const adapter = new MockCloudflareAdapter();
  const res = await uploadAssets(adapter, outDir, { slug: "acme-hvac", version: "v1" });
  assert.equal(res.ok, true);
  assert.equal(res.count, 2);
  assert.equal(res.failed.length, 0);
  assert.match(res.bundleUrl, /sites\/acme-hvac\/v1\/$/);
  assert.equal(adapter.objects.size, 2);
});

test("uploadAssets: reports which keys failed without throwing", async () => {
  const outDir = fakeBuild();
  const adapter = new MockCloudflareAdapter();
  adapter.uploadObject = async ({ key }) => ({ key, ok: !key.endsWith("index.html") });
  const res = await uploadAssets(adapter, outDir, { slug: "acme-hvac", version: "v1" });
  assert.equal(res.ok, false);
  assert.deepEqual(res.failed, ["sites/acme-hvac/v1/index.html"]);
});
