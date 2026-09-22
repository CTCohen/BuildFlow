// Mock Cloudflare API client: Pages/Workers deploys, R2 object storage, DNS/SSL provisioning.
//
// No real Cloudflare account or API token exists yet — the only credential Tyler has is an
// unrelated Access service token (operations/TYLER_QUEUE.md "Cloudflare"; COORDINATOR_STATE.md
// Track hosting). This records every call in memory and returns scripted results instead of
// making a network call, matching the pattern in billing/dunning/mocks.py: a real, swappable
// interface (deployPages / rollbackTo / uploadObject / deleteObject / provisionDns / healthCheck)
// that the real pipeline logic in this folder calls without knowing it's a mock. Swap this file
// for a real fetch-based client behind the same method names once the token exists — nothing
// else in platform/hosting/ should need to change.

export class MockCloudflareAdapter {
  constructor({ failNextDeploy = false, failNextDns = false, failHealthCheck = false } = {}) {
    this.deployments = [];
    this.objects = new Map();
    this.dnsRecords = new Map(); // subdomain -> record
    this.failNextDeploy = failNextDeploy;
    this.failNextDns = failNextDns;
    this.failHealthCheck = failHealthCheck;
  }

  async deployPages({ projectName, files, meta }) {
    const id = `mock-deploy-${this.deployments.length + 1}`;
    const shouldFail = this.failNextDeploy;
    this.failNextDeploy = false;
    const record = { id, projectName, fileCount: files.length, meta, ok: !shouldFail, deployedAt: new Date().toISOString() };
    this.deployments.push(record);
    if (shouldFail) throw Object.assign(new Error(`mock deploy failed for ${projectName}`), { deployment: record });
    return { id, url: `https://${projectName}.pages.dev`, ok: true };
  }

  // Real Cloudflare Pages rollback re-promotes a prior deployment id. The mock just replays the record.
  async rollbackTo({ projectName, deploymentId }) {
    const found = this.deployments.find((d) => d.projectName === projectName && d.id === deploymentId);
    if (!found) throw new Error(`rollbackTo: no deployment ${deploymentId} for ${projectName}`);
    return { ok: true, id: deploymentId, url: `https://${projectName}.pages.dev` };
  }

  listDeployments(projectName) {
    return this.deployments.filter((d) => d.projectName === projectName);
  }

  async uploadObject({ bucket, key, body, contentType }) {
    this.objects.set(`${bucket}/${key}`, { size: body?.length ?? 0, contentType, uploadedAt: new Date().toISOString() });
    return { key, bucket, ok: true };
  }

  async deleteObject({ bucket, key }) {
    this.objects.delete(`${bucket}/${key}`);
    return { ok: true };
  }

  async provisionDns({ subdomain, target }) {
    const shouldFail = this.failNextDns;
    this.failNextDns = false;
    if (shouldFail) throw new Error(`mock DNS provisioning failed for ${subdomain}`);
    const record = { subdomain, target, sslStatus: "active", provisionedAt: new Date().toISOString() };
    this.dnsRecords.set(subdomain, record);
    return record;
  }

  async healthCheck({ url }) {
    if (this.failHealthCheck) return { ok: false, url, statusCode: 503, error: "mock unhealthy" };
    return { ok: true, url, statusCode: 200, error: null };
  }
}
