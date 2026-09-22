// Two-domain model (platform/SPEC-03-hosting-infrastructure.md section 3): every customer gets an
// automatic platform subdomain; a customer may later bring their own domain instead/as well.
//
// The actual domain names are TBD — nothing is purchased yet (operations/TYLER_QUEUE.md "Domains
// (OPEN — rebrand impact)"). Everything here reads from config/env, never hardcodes a guessed
// domain, so plugging in the real Fornax domains later is a config change, not a code change.

export const DOMAIN_CONFIG = {
  // Placeholders. Replace via env once Tyler buys the Fornax domains — see TYLER_QUEUE.md.
  appDomain: process.env.FORNAX_APP_DOMAIN || "app.fornax-domain-tbd.test",
  customerRootDomain: process.env.FORNAX_CUSTOMER_ROOT_DOMAIN || "fornax-sites-tbd.test",
};

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** The customer's automatic platform subdomain, e.g. "acme-hvac.<customerRootDomain>". */
export function subdomainForSlug(slug, config = DOMAIN_CONFIG) {
  if (!slug || !SLUG_RE.test(slug)) {
    throw new Error(`subdomainForSlug: "${slug}" is not a valid slug (lowercase letters/digits, single hyphens)`);
  }
  return `${slug}.${config.customerRootDomain}`;
}

/** Build a URL on the app domain (admin/customer dashboard), e.g. appUrlFor("/dashboard"). */
export function appUrlFor(path = "", config = DOMAIN_CONFIG) {
  const suffix = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  return `https://${config.appDomain}${suffix}`;
}

/** True once a customer has pointed their own domain at us (not our platform subdomain/app domain). */
export function isCustomDomain(domain, config = DOMAIN_CONFIG) {
  if (!domain) return false;
  return domain !== config.appDomain && !domain.endsWith(`.${config.customerRootDomain}`) && domain !== config.customerRootDomain;
}

/** Which hostname a site should actually be served on: the customer's own domain if set, else the subdomain. */
export function primaryHostnameFor({ slug, customerDomain }, config = DOMAIN_CONFIG) {
  if (customerDomain && isCustomDomain(customerDomain, config)) return customerDomain;
  return subdomainForSlug(slug, config);
}
