// Pages/Workers deploy pipeline (platform/SPEC-03-hosting-infrastructure.md section 2): takes the
// Astro build output from agents/design/design-agent.mjs's renderSite() and deploys it.
//
// The actual Cloudflare API call is mocked (platform/hosting/mocks.mjs — no token exists yet, see
// operations/TYLER_QUEUE.md "Cloudflare"). What's real here: picking the project/site name per
// client, versioning + rollback on failure, and timing the deploy against the spec's end-to-end
// target. Swap `adapter` for a real Cloudflare client (same method names) once the token exists.

import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

// SPEC-03 section 2, step 5: "Upload to Cloudflare (~2 sec)". The *end-to-end* target ("Total time
// to live: ~60 seconds, fully automated") covers design generation + QA + this upload + DNS/SSL +
// health check + welcome email — see runDeployPipeline() in pipeline.mjs, which composes all of
// those and checks the full 60s budget. This module's own target is just its own upload stage.
export const UPLOAD_TARGET_MS = 2_000;

/** Cloudflare Pages project name per client. Stable, DNS-safe, and unique per customer slug. */
export function projectNameFor(customer) {
  if (!customer?.slug) throw new Error("projectNameFor: customer.slug is required");
  if (!/^[a-z0-9-]+$/.test(customer.slug)) {
    throw new Error(`projectNameFor: slug "${customer.slug}" has characters not valid in a Cloudflare Pages project name`);
  }
  // Cloudflare Pages project names are account-wide, not per-client-app, so prefix with the
  // product so multiple Fornax properties (marketing site, app, customer sites) never collide.
  return `fornax-site-${customer.slug}`;
}

/** Read every file under a renderSite() outDir, returning {path (posix, relative), body, size}. */
export function collectBuildFiles(outDir) {
  const files = [];
  const stack = [outDir];
  while (stack.length) {
    const dir = stack.pop();
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) { stack.push(full); continue; }
      const rel = relative(outDir, full).split(sepForPlatform()).join("/");
      const body = readFileSync(full);
      files.push({ path: rel, full, body, size: body.length });
    }
  }
  return files;
}

function sepForPlatform() {
  return process.platform === "win32" ? "\\" : "/";
}

/** In-memory deploy history per project, enough to roll back to the last known-good deployment.
 *  A real implementation would persist this (e.g. admin.agent_runs or a dedicated table) — the
 *  shape here is deliberately simple so it's a drop-in swap once that table exists. */
export class VersionStore {
  constructor() { this.history = new Map(); } // projectName -> entry[]
  record(projectName, entry) {
    const list = this.history.get(projectName) ?? [];
    list.push(entry);
    this.history.set(projectName, list);
  }
  lastGood(projectName) {
    const list = this.history.get(projectName) ?? [];
    for (let i = list.length - 1; i >= 0; i--) if (list[i].ok) return list[i];
    return null;
  }
  all(projectName) { return this.history.get(projectName) ?? []; }
}

/**
 * Deploy one client's built site.
 * @param {object} opts
 * @param {object} opts.buildResult   the `{ ok, outDir, client }` returned by renderSite()
 * @param {object} opts.adapter       Cloudflare adapter (mock or real; see mocks.mjs)
 * @param {VersionStore} [opts.versions]
 * @param {() => number} [opts.now]   injectable clock for tests
 */
export async function deploySite({ buildResult, adapter, versions = new VersionStore(), now = () => Date.now() }) {
  if (!buildResult?.ok) throw new Error("deploySite: buildResult must be a successful renderSite() result (buildResult.ok === true)");
  const customer = buildResult.client;
  const projectName = projectNameFor(customer);

  const t0 = now();
  const files = collectBuildFiles(buildResult.outDir);
  const tCollect = now();

  let deployment;
  try {
    deployment = await adapter.deployPages({ projectName, files, meta: { slug: customer.slug, tier: customer.tier } });
  } catch (err) {
    const tFail = now();
    const rollbackTarget = versions.lastGood(projectName);
    versions.record(projectName, { id: err.deployment?.id ?? null, at: tFail, ok: false, error: err.message });
    let rolledBackTo = null;
    if (rollbackTarget) {
      await adapter.rollbackTo({ projectName, deploymentId: rollbackTarget.id });
      rolledBackTo = rollbackTarget.id;
    }
    return {
      ok: false,
      projectName,
      error: err.message,
      rolledBackTo,
      ms: { collect: Math.round(tCollect - t0), deploy: Math.round(tFail - tCollect), total: Math.round(tFail - t0) },
    };
  }
  const tDeploy = now();
  versions.record(projectName, { id: deployment.id, at: tDeploy, ok: true, url: deployment.url });

  const uploadMs = Math.round(tDeploy - tCollect);
  return {
    ok: true,
    projectName,
    deploymentId: deployment.id,
    url: deployment.url,
    fileCount: files.length,
    ms: { collect: Math.round(tCollect - t0), deploy: uploadMs, total: Math.round(tDeploy - t0) },
    withinUploadTarget: uploadMs <= UPLOAD_TARGET_MS,
  };
}

/** Explicit rollback to the last known-good deployment for a project (e.g. triggered by ops, not a failed deploy). */
export async function rollback({ projectName, adapter, versions, now = () => Date.now() }) {
  const target = versions.lastGood(projectName);
  if (!target) throw new Error(`rollback: no known-good deployment recorded for ${projectName}`);
  const result = await adapter.rollbackTo({ projectName, deploymentId: target.id });
  versions.record(projectName, { id: target.id, at: now(), ok: true, url: result.url, rolledBack: true });
  return result;
}
