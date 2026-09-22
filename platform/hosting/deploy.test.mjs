import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { projectNameFor, collectBuildFiles, deploySite, rollback, VersionStore, UPLOAD_TARGET_MS } from "./deploy.mjs";
import { MockCloudflareAdapter } from "./mocks.mjs";

function fakeBuild(slug = "acme-hvac", tier = "smb") {
  const outDir = mkdtempSync(join(tmpdir(), "fornax-deploy-test-"));
  mkdirSync(join(outDir, "assets"));
  writeFileSync(join(outDir, "index.html"), "<html>hi</html>");
  writeFileSync(join(outDir, "assets", "style.css"), "body{}");
  return { ok: true, outDir, client: { slug, tier } };
}

test("projectNameFor: stable, prefixed, unique per slug", () => {
  assert.equal(projectNameFor({ slug: "acme-hvac" }), "fornax-site-acme-hvac");
  assert.notEqual(projectNameFor({ slug: "acme-hvac" }), projectNameFor({ slug: "acme-plumbing" }));
});
test("projectNameFor: requires a slug", () => {
  assert.throws(() => projectNameFor({}), /slug is required/);
});
test("projectNameFor: rejects characters invalid in a Pages project name", () => {
  assert.throws(() => projectNameFor({ slug: "acme_hvac!" }), /not valid/);
});

test("collectBuildFiles: reads every file, posix-relative paths", () => {
  const build = fakeBuild();
  const files = collectBuildFiles(build.outDir);
  const paths = files.map((f) => f.path).sort();
  assert.deepEqual(paths, ["assets/style.css", "index.html"]);
  assert.ok(files.every((f) => Buffer.isBuffer(f.body)));
});

test("deploySite: success returns url, deployment id, and timing", async () => {
  const build = fakeBuild();
  const adapter = new MockCloudflareAdapter();
  const res = await deploySite({ buildResult: build, adapter });
  assert.equal(res.ok, true);
  assert.equal(res.projectName, "fornax-site-acme-hvac");
  assert.match(res.url, /^https:\/\/fornax-site-acme-hvac\.pages\.dev$/);
  assert.equal(res.fileCount, 2);
  assert.ok(res.ms.total >= 0);
  assert.equal(res.withinUploadTarget, res.ms.deploy <= UPLOAD_TARGET_MS);
});

test("deploySite: refuses a build that didn't succeed", async () => {
  const adapter = new MockCloudflareAdapter();
  await assert.rejects(() => deploySite({ buildResult: { ok: false }, adapter }), /successful renderSite/);
});

test("deploySite: failure rolls back to the last known-good deployment automatically", async () => {
  const build = fakeBuild();
  const adapter = new MockCloudflareAdapter();
  const versions = new VersionStore();

  const first = await deploySite({ buildResult: build, adapter, versions });
  assert.equal(first.ok, true);

  adapter.failNextDeploy = true;
  const second = await deploySite({ buildResult: build, adapter, versions });
  assert.equal(second.ok, false);
  assert.equal(second.rolledBackTo, first.deploymentId);
  assert.equal(versions.lastGood(second.projectName).id, first.deploymentId);
});

test("deploySite: failure with no prior good deployment reports rolledBackTo: null (nothing to roll back to)", async () => {
  const build = fakeBuild();
  const adapter = new MockCloudflareAdapter({ failNextDeploy: true });
  const res = await deploySite({ buildResult: build, adapter, versions: new VersionStore() });
  assert.equal(res.ok, false);
  assert.equal(res.rolledBackTo, null);
});

test("rollback: explicit rollback to last good deployment", async () => {
  const build = fakeBuild();
  const adapter = new MockCloudflareAdapter();
  const versions = new VersionStore();
  const first = await deploySite({ buildResult: build, adapter, versions });
  await deploySite({ buildResult: build, adapter, versions }); // second good deploy

  const res = await rollback({ projectName: first.projectName, adapter, versions });
  assert.equal(res.ok, true);
  const history = versions.all(first.projectName);
  assert.equal(history.at(-1).rolledBack, true);
});

test("rollback: throws clearly when there is nothing to roll back to", async () => {
  const adapter = new MockCloudflareAdapter();
  await assert.rejects(() => rollback({ projectName: "nope", adapter, versions: new VersionStore() }), /no known-good deployment/);
});

test("VersionStore: lastGood ignores failed entries and returns the most recent success", () => {
  const v = new VersionStore();
  v.record("p", { id: "a", ok: true });
  v.record("p", { id: "b", ok: false });
  v.record("p", { id: "c", ok: true });
  v.record("p", { id: "d", ok: false });
  assert.equal(v.lastGood("p").id, "c");
});
