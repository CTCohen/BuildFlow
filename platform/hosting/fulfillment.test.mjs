// Cross-language integration test for BUILD_TASKS.md §5 "Payment → live site
// fulfillment": proves the real chain works together, not each piece in isolation.
//
// This spawns `python3 -m billing.fulfillment_cli` as a real subprocess — it runs the
// real `billing/webhooks.py::handle_event()` against a real subscription.created +
// invoice.payment_succeeded sequence and writes a real ndjson fulfillment event file
// — then reads that file back in Node with the real `readFulfillmentQueue` and drives
// it through the real `consumeFulfillmentEvent` -> `runDeployPipeline` chain (mocked
// Cloudflare adapter, since no real Cloudflare account exists — same mocking level as
// `platform/hosting/pipeline.test.mjs`). Nothing here is stubbed on the Node side;
// the only thing not real is the two external accounts (Stripe, Cloudflare) neither
// side has yet.
import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { consumeFulfillmentEvent, readFulfillmentQueue, FulfillmentEventError } from "./fulfillment.mjs";
import { MockCloudflareAdapter } from "./mocks.mjs";
import { VersionStore } from "./deploy.mjs";
import { PIPELINE_TARGET_MS } from "./pipeline.mjs";

// Repo root: this file is platform/hosting/fulfillment.test.mjs
const REPO_ROOT = join(fileURLToPath(import.meta.url), "..", "..", "..");
const cfg = { appDomain: "app.example.test", customerRootDomain: "sites.example.test" };

// SPEC-03's ~60s end-to-end budget covers design generation + QA + this pipeline's
// upload/DNS/health steps (see pipeline.mjs's own comment). The billing dispatch step
// this test adds in front of it is a webhook handler doing in-memory dict lookups —
// budgeted generously at 2s so a slow CI box doesn't make this test flaky, while still
// catching a real regression (e.g. an accidental network call creeping into the
// handler) that would blow the budget.
const BILLING_DISPATCH_BUDGET_MS = 2_000;
const SPEC03_TOTAL_BUDGET_MS = 60_000;

function runFulfillmentCli(queuePath, customerId) {
  execFileSync("python3", ["-m", "billing.fulfillment_cli", queuePath, customerId], {
    cwd: REPO_ROOT,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function fakeBuildFn(slug) {
  return async (payload) => {
    const outDir = mkdtempSync(join(tmpdir(), "fornax-fulfillment-test-"));
    mkdirSync(join(outDir, "assets"));
    writeFileSync(join(outDir, "index.html"), `<html>${payload.customer_id}</html>`);
    writeFileSync(join(outDir, "assets", "style.css"), "body{}");
    return { ok: true, outDir, client: { slug, tier: payload.tier } };
  };
}

test("payment_succeeded (real Python webhook handler) -> real Node deploy pipeline, end to end", async () => {
  const dir = mkdtempSync(join(tmpdir(), "fornax-fulfillment-queue-"));
  const queuePath = join(dir, "queue.ndjson");
  const customerId = "cust_e2e_smoke";

  const tBillingStart = Date.now();
  runFulfillmentCli(queuePath, customerId);
  const billingMs = Date.now() - tBillingStart;

  // Real assertion on real subprocess output, not a mocked stand-in.
  assert.ok(billingMs < BILLING_DISPATCH_BUDGET_MS, `billing dispatch took ${billingMs}ms, budget ${BILLING_DISPATCH_BUDGET_MS}ms`);

  const events = readFulfillmentQueue(queuePath);
  assert.equal(events.length, 1);
  const [event] = events;
  assert.equal(event.event_type, "site.fulfillment_requested");
  assert.equal(event.payload.customer_id, customerId);
  assert.equal(event.payload.tier, "smb");
  assert.equal(event.source, "billing.webhooks");
  assert.equal(event.recipient, "platform.hosting");
  assert.ok(event.event_id.startsWith("fulfill_"));

  const adapter = new MockCloudflareAdapter();
  const result = await consumeFulfillmentEvent(event, {
    buildFn: fakeBuildFn("acme-hvac-e2e"),
    adapter,
    versions: new VersionStore(),
    domainConfig: cfg,
  });

  assert.equal(result.ok, true);
  assert.equal(result.stage, "done");
  assert.equal(result.customerId, customerId);
  assert.equal(result.pipeline.subdomain, "acme-hvac-e2e.sites.example.test");
  assert.equal(result.pipeline.url, "https://acme-hvac-e2e.sites.example.test");
  assert.equal(result.pipeline.health.ok, true);
  assert.ok(result.pipeline.withinTarget, `hosting pipeline took ${result.pipeline.ms.total}ms, target ${PIPELINE_TARGET_MS}ms`);

  const fullChainMs = billingMs + result.ms.total;
  assert.ok(
    fullChainMs <= SPEC03_TOTAL_BUDGET_MS,
    `full payment->live chain took ${fullChainMs}ms (billing ${billingMs}ms + hosting ${result.ms.total}ms), SPEC-03 budget ${SPEC03_TOTAL_BUDGET_MS}ms`,
  );

  rmSync(dir, { recursive: true, force: true });
});

test("consumeFulfillmentEvent: rejects an event of the wrong type", async () => {
  await assert.rejects(
    () => consumeFulfillmentEvent({ event_type: "not.fulfillment", payload: {} }, { buildFn: fakeBuildFn("x"), adapter: new MockCloudflareAdapter() }),
    FulfillmentEventError,
  );
});

test("consumeFulfillmentEvent: rejects an event missing a required payload field", async () => {
  const badEvent = {
    event_type: "site.fulfillment_requested",
    payload: { customer_id: "cust_1", tier: "smb" /* missing stripe_subscription_id, requested_at */ },
  };
  await assert.rejects(
    () => consumeFulfillmentEvent(badEvent, { buildFn: fakeBuildFn("x"), adapter: new MockCloudflareAdapter() }),
    FulfillmentEventError,
  );
});

test("consumeFulfillmentEvent: a build failure is reported at the build stage, pipeline never runs", async () => {
  const event = {
    event_type: "site.fulfillment_requested",
    payload: { customer_id: "cust_1", tier: "smb", stripe_subscription_id: "sub_1", requested_at: "2026-09-22" },
  };
  const adapter = new MockCloudflareAdapter();
  const result = await consumeFulfillmentEvent(event, {
    buildFn: async () => ({ ok: false, error: "design agent QA failed" }),
    adapter,
  });
  assert.equal(result.ok, false);
  assert.equal(result.stage, "build");
  assert.equal(adapter.dnsRecords.size, 0);
});

test("readFulfillmentQueue: parses the real ndjson format written by billing/fulfillment.py (two events)", async () => {
  const dir = mkdtempSync(join(tmpdir(), "fornax-fulfillment-queue-multi-"));
  const queuePath = join(dir, "queue.ndjson");
  runFulfillmentCli(queuePath, "cust_a");
  runFulfillmentCli(queuePath, "cust_b");
  const events = readFulfillmentQueue(queuePath);
  assert.equal(events.length, 2);
  assert.deepEqual(events.map((e) => e.payload.customer_id), ["cust_a", "cust_b"]);
  rmSync(dir, { recursive: true, force: true });
});
