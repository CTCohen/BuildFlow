// Node side of the payment -> live-site hand-off (BUILD_TASKS.md §5). See
// `billing/fulfillment.py`'s module docstring for why the interface is an
// `admin.events`-shaped record on an ndjson queue rather than direct glue code:
// billing (Python) and hosting (Node) share no process, and `admin.events` is the
// existing documented pattern (platform/CONTRACT.md) for exactly this kind of
// cross-service hand-off, once a real Postgres project exists (gate G3). This module
// is the consumer side; `readFulfillmentQueue` parses the same ndjson format
// `billing/fulfillment.py`'s `write_events_ndjson` writes, independently — proving
// the *format* is the contract, not a shared parser.
import { readFileSync } from "node:fs";
import { runDeployPipeline } from "./pipeline.mjs";

export const FULFILLMENT_EVENT_TYPE = "site.fulfillment_requested";

const REQUIRED_PAYLOAD_FIELDS = ["customer_id", "tier", "stripe_subscription_id", "requested_at"];

export class FulfillmentEventError extends Error {}

/** Parse the ndjson queue file billing writes into an array of event objects. */
export function readFulfillmentQueue(path) {
  const text = readFileSync(path, "utf8");
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function assertValidEvent(event) {
  if (event?.event_type !== FULFILLMENT_EVENT_TYPE) {
    throw new FulfillmentEventError(`unsupported event_type: ${event?.event_type}`);
  }
  for (const field of REQUIRED_PAYLOAD_FIELDS) {
    if (!event.payload || event.payload[field] === undefined || event.payload[field] === null) {
      throw new FulfillmentEventError(`fulfillment event missing payload.${field}`);
    }
  }
}

/**
 * Consume one fulfillment event: build the site's build output for the requested
 * customer, then run the real hosting deploy pipeline (deploy + assets + DNS/SSL +
 * health check). Design generation itself (agents/design/) is out of this module's
 * scope (task constraint: stay inside billing/ and platform/hosting/), so the caller
 * supplies `buildFn` — a `(payload) => Promise<buildResult>` in `renderSite()`'s
 * `{ ok, outDir, client }` shape, exactly what `runDeployPipeline` already expects
 * per `pipeline.mjs`. Tests use a fake `buildFn`; production wiring is a one-line
 * swap to `agents/design/design-agent.mjs`'s real `renderSite`.
 *
 * @param {object} event  one parsed fulfillment event (admin.events shape)
 * @param {object} opts
 * @param {(payload: object) => Promise<object>} opts.buildFn
 * @param {object} opts.adapter        Cloudflare adapter (mock or real)
 * @param {import('./deploy.mjs').VersionStore} [opts.versions]
 * @param {object} [opts.domainConfig]
 * @param {() => number} [opts.now]
 */
export async function consumeFulfillmentEvent(event, { buildFn, adapter, versions, domainConfig, now = () => Date.now() } = {}) {
  assertValidEvent(event);
  if (typeof buildFn !== "function") {
    throw new FulfillmentEventError("consumeFulfillmentEvent requires opts.buildFn");
  }

  const t0 = now();
  const buildResult = await buildFn(event.payload);
  const tBuildDone = now();
  if (!buildResult?.ok) {
    return {
      ok: false,
      stage: "build",
      event,
      buildResult,
      ms: { total: Math.round(tBuildDone - t0) },
    };
  }

  const pipelineResult = await runDeployPipeline({ buildResult, adapter, versions, domainConfig, now });
  const totalMs = Math.round(now() - t0);

  return {
    ok: pipelineResult.ok,
    stage: pipelineResult.stage,
    event,
    customerId: event.payload.customer_id,
    pipeline: pipelineResult,
    ms: { build: Math.round(tBuildDone - t0), pipeline: pipelineResult.ms.total, total: totalMs },
  };
}
