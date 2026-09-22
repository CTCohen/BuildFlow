// End-to-end deploy pipeline: composes deploy.mjs + assets.mjs + domains.mjs into the sequence
// platform/SPEC-03-hosting-infrastructure.md section 2 specifies, and times it against that
// spec's locked target: "Total time to live: ~60 seconds, fully automated" (steps 3-7: design
// generation, QA, upload, DNS/SSL, health check — step 8's welcome email is not timed against
// the 60s budget in the spec and isn't part of this module).
//
// Design generation (agents/design/design-agent.mjs renderSite(), already ~1.2s per
// agents/design/BENCHMARKS.md) happens before this pipeline runs; QA (Lighthouse/axe) is
// platform/SPEC-04-design-quality territory and not duplicated here. This module covers steps
// 5-7: upload to Cloudflare, DNS + SSL auto-provision, health check.

import { deploySite } from "./deploy.mjs";
import { uploadAssets } from "./assets.mjs";
import { subdomainForSlug } from "./domains.mjs";

// SPEC-03 section 2 step totals: upload ~2s, DNS+SSL ~30s, health check ~5s = 37s of this
// pipeline's own budget within the spec's overall ~60s (the rest is design gen + QA, upstream).
export const PIPELINE_TARGET_MS = 37_000;

/**
 * Run the hosting side of "customer pays -> live site": upload build output, wire R2 assets,
 * provision DNS/SSL for the customer's subdomain, then health-check the result.
 * @param {object} opts
 * @param {object} opts.buildResult  successful renderSite() result ({ ok, outDir, client })
 * @param {object} opts.adapter      Cloudflare adapter (mock or real)
 * @param {import('./deploy.mjs').VersionStore} [opts.versions]
 */
export async function runDeployPipeline({ buildResult, adapter, versions, now = () => Date.now(), domainConfig } = {}) {
  if (!buildResult?.ok) throw new Error("runDeployPipeline: buildResult must be a successful renderSite() result");
  const t0 = now();
  const customer = buildResult.client;

  const deploy = await deploySite({ buildResult, adapter, versions, now });
  if (!deploy.ok) {
    return { ok: false, stage: "deploy", deploy, ms: { total: Math.round(now() - t0) } };
  }

  const assets = await uploadAssets(adapter, buildResult.outDir, { slug: customer.slug, version: deploy.deploymentId });
  if (!assets.ok) {
    return { ok: false, stage: "assets", deploy, assets, ms: { total: Math.round(now() - t0) } };
  }

  const subdomain = subdomainForSlug(customer.slug, domainConfig);
  const tPreDns = now();
  let dns;
  try {
    dns = await adapter.provisionDns({ subdomain, target: deploy.url });
  } catch (err) {
    return { ok: false, stage: "dns", error: err.message, deploy, assets, ms: { total: Math.round(now() - t0) } };
  }
  const tDns = now();

  const health = await adapter.healthCheck({ url: `https://${subdomain}` });
  const tHealth = now();

  const totalMs = Math.round(tHealth - t0);
  return {
    ok: health.ok,
    stage: health.ok ? "done" : "health-check",
    subdomain,
    url: `https://${subdomain}`,
    deploy,
    assets,
    dns,
    health,
    ms: {
      deploy: deploy.ms.total,
      assets: assets.ms,
      dns: Math.round(tDns - tPreDns),
      health: Math.round(tHealth - tDns),
      total: totalMs,
    },
    withinTarget: totalMs <= PIPELINE_TARGET_MS,
  };
}
