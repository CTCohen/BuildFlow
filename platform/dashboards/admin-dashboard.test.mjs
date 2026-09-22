import test from "node:test";
import assert from "node:assert/strict";
import {
  buildPipelineFunnel, findStuckDeals, buildCustomerRecord, computeHealthScore,
  buildRevenueDashboard, buildAlertsView, PIPELINE_STAGES,
} from "./lib/admin-dashboard.mjs";
import {
  leads, prospects, demos, customers, customerAdmin, subscriptions, alerts,
} from "./fixtures/admin-dashboard.fixtures.mjs";

test("pipeline stages exclude Trial Active per the SPEC-18 override (no free trial)", () => {
  assert.equal(PIPELINE_STAGES.includes("trial_active"), false);
  assert.deepEqual(PIPELINE_STAGES, ["identified", "outreach_sent", "demo_viewed", "demo_conversion", "customer"]);
});

test("buildPipelineFunnel counts each stage from CONTRACT.md rows", () => {
  const funnel = buildPipelineFunnel({ leads, prospects, demos, customers });
  const byStage = Object.fromEntries(funnel.stages.map((s) => [s.stage, s.count]));
  assert.equal(byStage.identified, 4);
  assert.equal(byStage.outreach_sent, 2); // contacted + qualified
  assert.equal(byStage.demo_viewed, 2); // viewed + converted demos
  assert.equal(byStage.demo_conversion, 1);
  assert.equal(byStage.customer, 1);
});

test("buildPipelineFunnel computes conversion % from the previous stage", () => {
  const funnel = buildPipelineFunnel({ leads, prospects, demos, customers });
  const outreach = funnel.stages.find((s) => s.stage === "outreach_sent");
  assert.equal(outreach.conversionFromPrevPct, 50); // 2 of 4 identified
});

test("findStuckDeals flags a demo 14+ days old with no conversion and no future follow-up", () => {
  const now = new Date("2026-09-21T00:00:00Z");
  const stuck = findStuckDeals(prospects, now);
  assert.equal(stuck.length, 1);
  assert.equal(stuck[0].prospectId, "pros-1");
});

test("findStuckDeals excludes converted prospects and ones with an upcoming follow-up", () => {
  const now = new Date("2026-08-22T00:00:00Z"); // pros-1 only 2 days old here, pros-2 converted
  assert.deepEqual(findStuckDeals(prospects, now), []);
});

test("buildCustomerRecord joins customer + customer_admin + subscription", () => {
  const record = buildCustomerRecord(customers[0], customerAdmin, subscriptions[0]);
  assert.equal(record.companyName, "Rivera Plumbing");
  assert.equal(record.tier, "smb");
  assert.equal(record.ltvCents, 249000);
  assert.equal(record.monthlyChargeCents, 24900);
  assert.equal(record.subscriptionStatus, "active");
});

test("buildCustomerRecord tolerates missing admin/subscription rows", () => {
  const record = buildCustomerRecord(customers[0], null, null);
  assert.equal(record.ltvCents, null);
  assert.equal(record.subscriptionStatus, null);
});

test("computeHealthScore applies the 40/30/20/10 weighting and bands (SPEC-18 section 4)", () => {
  const healthy = computeHealthScore({ engagement: 90, payment: 100, retention: 80, growth: 70 });
  assert.equal(healthy.score, 89); // 90*.4 + 100*.3 + 80*.2 + 70*.1
  assert.equal(healthy.band, "healthy");

  const atRisk = computeHealthScore({ engagement: 70, payment: 70, retention: 70, growth: 70 });
  assert.equal(atRisk.score, 70);
  assert.equal(atRisk.band, "at-risk");

  const churning = computeHealthScore({ engagement: 30, payment: 20, retention: 10, growth: 0 });
  assert.equal(churning.band, "churning");
});

test("computeHealthScore rejects out-of-range inputs", () => {
  assert.throws(() => computeHealthScore({ engagement: 150, payment: 0, retention: 0, growth: 0 }), /must be a number 0-100/);
});

test("buildRevenueDashboard computes MRR/ARR/churn/ARPU and per-tier breakdown, excluding mid-market", () => {
  const rev = buildRevenueDashboard(subscriptions);
  assert.equal(rev.mrrCents, 24900 + 14900); // two active subs
  assert.equal(rev.arrCents, rev.mrrCents * 12);
  assert.equal(rev.activeCustomers, 2);
  assert.equal(rev.churnRatePct, Math.round((1 / 3) * 1000) / 10);
  assert.equal(rev.byTier.smb.customerCount, 1);
  assert.equal(rev.byTier.micro.customerCount, 1);
  assert.equal("mid-market" in rev.byTier, false);
});

test("buildAlertsView drops resolved alerts and groups the rest by severity", () => {
  const view = buildAlertsView(alerts);
  assert.equal(view.counts.critical, 1);
  assert.equal(view.counts.warning, 1);
  assert.equal(view.counts.info, 0); // the info alert is resolved
  assert.equal(view.bySeverity.critical[0].title, "CRM sync failing");
});
