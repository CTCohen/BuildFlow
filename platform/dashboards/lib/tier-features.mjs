// One dashboard, feature-flag layer (BUILD_TASKS.md §7, docs/TIER-FEATURE-MATRIX.md "Dashboard (one dashboard,
// tier flags)" table + the per-tier sections). No separate builds per tier: the SMB feature set is the base
// component set; Micro is the SAME components with a reduced flag set (lead-inbox-only + the limited edits the
// matrix's Micro section allows), not a fork. Mid-Market is out of scope (LANE-H-dashboards.md "Out of scope").
//
// tier: "micro" | "smb" (mid-market intentionally unsupported here — see above).

const SMB_FEATURES = Object.freeze({
  leadInbox: true,
  csvExport: true,
  emailAlerts: true,
  notes: true,
  pipeline: true, // new/contacted/converted, per BUILD_TASKS.md §7 and the matrix
  imageUploads: true,
  crmConfig: true,
  editServiceDescriptions: true,
  editContactInfo: true,
  editHours: true,
  addTestimonials: true,
  editBrandColor: false, // matrix: pre-approved by Fornax, no tier can self-edit at launch
  editFonts: false,
  customCss: false,
  multiUser: false,
  apiAccess: false,
});

// Micro's reduction, per the matrix's "Micro Dashboard — VIEW ONLY + Limited Edits" section: read-only lead
// inbox plus a short allow-list of limited edits (hours, one phone number, single logo replace). Everything
// else in the SMB set is turned off, not removed from the component tree — same dashboard, fewer flags on.
const MICRO_OVERRIDES = Object.freeze({
  notes: false,
  pipeline: false,
  imageUploads: false, // matrix allows only a single logo replace, not the SMB multi-image uploader
  singleLogoUpload: true,
  crmConfig: false,
  editServiceDescriptions: false,
  addTestimonials: false,
  editContactInfo: false, // matrix: "Add phone number" (one) only, not full contact-info editing
  singlePhoneNumberEdit: true,
});

export function resolveFeatures(tier) {
  if (tier === "smb") return { ...SMB_FEATURES };
  if (tier === "micro") return { ...SMB_FEATURES, ...MICRO_OVERRIDES };
  throw new Error(`resolveFeatures: unsupported tier "${tier}" (only "micro" and "smb" are in scope, see LANE-H-dashboards.md)`);
}

export function isFeatureEnabled(tier, featureName) {
  const features = resolveFeatures(tier);
  if (!(featureName in features)) {
    throw new Error(`isFeatureEnabled: unknown feature "${featureName}"`);
  }
  return features[featureName];
}
