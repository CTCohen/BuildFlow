import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runDeployPipeline, PIPELINE_TARGET_MS } from "./pipeline.mjs";
import { MockCloudflareAdapter } from "./mocks.mjs";
import { VersionStore } from "./deploy.mjs";

const cfg = { appDomain: "app.example.test", customerRootDomain: "sites.example.test" };

function fakeBuild(slug = "acme-hvac") {
  const outDir = mkdtempSync(join(tmpdir(), "fornax-pipeline-test-"));
  mkdirSync(join(outDir, "assets"));
  writeFileSync(join(outDir, "index.html"), "<html>hi</html>");
  writeFileSync(join(outDir, "assets", "style.css"), "body{}");
  return { ok: true, outDir, client: { slug, tier: "smb" } };
}

test("runDeployPipeline: happy path deploys, uploads assets, provisions DNS, and health-checks", async () => {
  const build = fakeBuild();
  const adapter = new MockCloudflareAdapter();
  const res = await runDeployPipeline({ buildResult: build, adapter, versions: new VersionStore(), domainConfig: cfg });
  assert.equal(res.ok, true);
  assert.equal(res.stage, "done");
  assert.equal(res.subdomain, "acme-hvac.sites.example.test");
  assert.equal(res.url, "https://acme-hvac.sites.example.test");
  assert.equal(res.deploy.ok, true);
  assert.equal(res.assets.ok, true);
  assert.equal(res.dns.sslStatus, "active");
  assert.equal(res.health.ok, true);
  assert.ok(typeof res.ms.total === "number");
  assert.equal(res.withinTarget, res.ms.total <= PIPELINE_TARGET_MS);
});

test("runDeployPipeline: stops at the deploy stage and reports it, without touching DNS", async () => {
  const build = fakeBuild();
  const adapter = new MockCloudflareAdapter({ failNextDeploy: true });
  const res = await runDeployPipeline({ buildResult: build, adapter, versions: new VersionStore(), domainConfig: cfg });
  assert.equal(res.ok, false);
  assert.equal(res.stage, "deploy");
  assert.equal(adapter.dnsRecords.size, 0);
});

test("runDeployPipeline: DNS failure is reported as its own stage, deploy/assets already done", async () => {
  const build = fakeBuild();
  const adapter = new MockCloudflareAdapter({ failNextDns: true });
  const res = await runDeployPipeline({ buildResult: build, adapter, versions: new VersionStore(), domainConfig: cfg });
  assert.equal(res.ok, false);
  assert.equal(res.stage, "dns");
  assert.equal(res.deploy.ok, true);
  assert.equal(res.assets.ok, true);
});

test("runDeployPipeline: unhealthy result after a real deploy is reported, not silently marked ok", async () => {
  const build = fakeBuild();
  const adapter = new MockCloudflareAdapter({ failHealthCheck: true });
  const res = await runDeployPipeline({ buildResult: build, adapter, versions: new VersionStore(), domainConfig: cfg });
  assert.equal(res.ok, false);
  assert.equal(res.stage, "health-check");
  assert.equal(res.health.ok, false);
});

test("runDeployPipeline: refuses an unsuccessful build result up front", async () => {
  const adapter = new MockCloudflareAdapter();
  await assert.rejects(() => runDeployPipeline({ buildResult: { ok: false }, adapter }), /successful renderSite/);
});
