// R2 bucket wiring for site assets (platform/SPEC-03-hosting-infrastructure.md section 2 upload
// step; platform/CONTRACT.md app.websites.bundle_url).
//
// The actual R2 PUT calls are mocked (platform/hosting/mocks.mjs — no Cloudflare account/token
// yet, see operations/TYLER_QUEUE.md). What's real: which files get uploaded and the bucket
// key/path structure, so switching to a real adapter is the only change needed once the account
// exists.

import { collectBuildFiles } from "./deploy.mjs";

// Placeholder — real bucket name TBD once the Cloudflare account exists (TYLER_QUEUE.md).
export const DEFAULT_BUCKET = process.env.FORNAX_R2_BUCKET || "fornax-sites-tbd";

const CONTENT_TYPES = {
  html: "text/html; charset=utf-8", css: "text/css", js: "application/javascript", mjs: "application/javascript",
  json: "application/json", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", svg: "image/svg+xml",
  webp: "image/webp", avif: "image/avif", ico: "image/x-icon", woff: "font/woff", woff2: "font/woff2",
  ttf: "font/ttf", txt: "text/plain", xml: "application/xml", webmanifest: "application/manifest+json",
};

export function guessContentType(path) {
  const ext = path.split(".").pop()?.toLowerCase();
  return CONTENT_TYPES[ext] ?? "application/octet-stream";
}

// Key structure: sites/<slug>/<version>/<relative path>. `version` defaults to the deployment id
// (or an ISO timestamp) so re-deploys never clobber a previous version's assets — that's what
// makes rollback possible: the previous version's objects are still there under their own prefix.
export function assetKey(slug, version, relPath) {
  if (!slug) throw new Error("assetKey: slug is required");
  if (!version) throw new Error("assetKey: version is required");
  if (!relPath) throw new Error("assetKey: relPath is required");
  return `sites/${slug}/${version}/${relPath}`;
}

/** Build the list of {key, size, contentType, body} objects to upload for one build output dir. */
export function buildAssetManifest(outDir, { slug, version }) {
  return collectBuildFiles(outDir).map((f) => ({
    key: assetKey(slug, version, f.path),
    size: f.size,
    contentType: guessContentType(f.path),
    body: f.body,
  }));
}

/** Upload every asset in a build output dir to R2 (via the adapter), returning a summary + bundle_url. */
export async function uploadAssets(adapter, outDir, { slug, version, bucket = DEFAULT_BUCKET }) {
  const manifest = buildAssetManifest(outDir, { slug, version });
  const t0 = Date.now();
  const results = [];
  for (const asset of manifest) {
    const r = await adapter.uploadObject({ bucket, key: asset.key, body: asset.body, contentType: asset.contentType });
    results.push({ key: asset.key, ok: r.ok });
  }
  const indexAsset = manifest.find((a) => a.key.endsWith("/index.html"));
  return {
    ok: results.every((r) => r.ok),
    bucket,
    version,
    count: results.length,
    totalBytes: manifest.reduce((sum, a) => sum + a.size, 0),
    ms: Date.now() - t0,
    // Placeholder public URL shape — real R2/Pages custom-domain URL TBD once the account exists.
    bundleUrl: indexAsset ? `https://${bucket}.r2.dev/${indexAsset.key.replace(/\/index\.html$/, "/")}` : null,
    failed: results.filter((r) => !r.ok).map((r) => r.key),
  };
}
