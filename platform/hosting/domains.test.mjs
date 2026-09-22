import test from "node:test";
import assert from "node:assert/strict";
import { subdomainForSlug, appUrlFor, isCustomDomain, primaryHostnameFor, DOMAIN_CONFIG } from "./domains.mjs";

const cfg = { appDomain: "app.example.test", customerRootDomain: "sites.example.test" };

test("subdomainForSlug: builds the platform subdomain", () => {
  assert.equal(subdomainForSlug("acme-hvac", cfg), "acme-hvac.sites.example.test");
});
test("subdomainForSlug: rejects invalid slugs (no double hyphen, uppercase, underscore, etc.)", () => {
  assert.throws(() => subdomainForSlug("Acme_HVAC", cfg), /not a valid slug/);
  assert.throws(() => subdomainForSlug("", cfg), /not a valid slug/);
  assert.throws(() => subdomainForSlug("-leading", cfg), /not a valid slug/);
});
test("subdomainForSlug: uses config, never a hardcoded domain (default config is a placeholder)", () => {
  assert.match(DOMAIN_CONFIG.customerRootDomain, /tbd/i);
});

test("appUrlFor: builds a URL on the app domain", () => {
  assert.equal(appUrlFor("/dashboard", cfg), "https://app.example.test/dashboard");
  assert.equal(appUrlFor("dashboard", cfg), "https://app.example.test/dashboard");
  assert.equal(appUrlFor("", cfg), "https://app.example.test");
});

test("isCustomDomain: true only for a domain that is neither the app domain nor a platform subdomain", () => {
  assert.equal(isCustomDomain("acme-hvac.sites.example.test", cfg), false);
  assert.equal(isCustomDomain("app.example.test", cfg), false);
  assert.equal(isCustomDomain("sites.example.test", cfg), false);
  assert.equal(isCustomDomain("acmehvac.com", cfg), true);
  assert.equal(isCustomDomain(null, cfg), false);
});

test("primaryHostnameFor: prefers the customer's own domain, falls back to the subdomain", () => {
  assert.equal(primaryHostnameFor({ slug: "acme-hvac", customerDomain: "acmehvac.com" }, cfg), "acmehvac.com");
  assert.equal(primaryHostnameFor({ slug: "acme-hvac", customerDomain: null }, cfg), "acme-hvac.sites.example.test");
  // a domain that's actually our own platform subdomain never gets treated as "custom"
  assert.equal(primaryHostnameFor({ slug: "acme-hvac", customerDomain: "acme-hvac.sites.example.test" }, cfg), "acme-hvac.sites.example.test");
});
