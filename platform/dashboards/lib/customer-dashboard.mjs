// Customer dashboard (SMB base, Micro via tier-features.mjs flags). Pure view-model builders over
// platform/CONTRACT.md row shapes + mock/fixture data — no live Supabase wiring yet (service role key
// missing, see COORDINATOR_STATE.md gate G3). Real backend wiring is the one thing left blocked here.
//
// CONTRACT GAP (logged to operations/TYLER_QUEUE.md, not guessed into CONTRACT.md): app.form_submissions has
// no `pipeline_stage` or `notes` column, but BUILD_TASKS.md §7 / TIER-FEATURE-MATRIX.md require SMB to have an
// editable simple pipeline (new/contacted/converted) and notes per lead. These functions accept those two
// fields as optional extensions on the form_submissions row shape (defaulting pipeline_stage to "new" and
// notes to "") so the UI layer is real and testable now; Lane A owns whether they land as new columns or a
// side table once Tyler rules on the TYLER_QUEUE.md note.

import { resolveFeatures } from "./tier-features.mjs";

const PIPELINE_STAGES = ["new", "contacted", "converted"];

export function buildLeadInbox(formSubmissions) {
  return formSubmissions
    .slice()
    .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))
    .map((s) => ({
      id: s.id,
      name: s.prospect_name,
      email: s.prospect_email,
      phone: s.prospect_phone,
      message: s.message,
      submittedAt: s.submitted_at,
      crmSyncStatus: s.crm_sync_status ?? "pending",
      pipelineStage: s.pipeline_stage ?? "new",
    }));
}

export function toCsv(formSubmissions) {
  const header = "id,name,email,phone,submitted_at,pipeline_stage,crm_sync_status";
  const rows = formSubmissions.map((s) =>
    [s.id, s.prospect_name, s.prospect_email, s.prospect_phone, s.submitted_at,
      s.pipeline_stage ?? "new", s.crm_sync_status ?? "pending"]
      .map((v) => `"${String(v ?? "").replaceAll('"', '""')}"`)
      .join(",")
  );
  return [header, ...rows].join("\n");
}

export function buildPipeline(tier, formSubmissions) {
  const features = resolveFeatures(tier);
  if (!features.pipeline) {
    throw new Error(`buildPipeline: pipeline is not enabled for tier "${tier}"`);
  }
  const byStage = Object.fromEntries(PIPELINE_STAGES.map((stage) => [stage, []]));
  for (const s of formSubmissions) {
    const stage = s.pipeline_stage ?? "new";
    if (!byStage[stage]) throw new Error(`buildPipeline: unknown stage "${stage}" on submission ${s.id}`);
    byStage[stage].push(s.id);
  }
  return byStage;
}

export function moveSubmissionStage(tier, submission, newStage) {
  const features = resolveFeatures(tier);
  if (!features.pipeline) {
    throw new Error(`moveSubmissionStage: pipeline is not enabled for tier "${tier}"`);
  }
  if (!PIPELINE_STAGES.includes(newStage)) {
    throw new Error(`moveSubmissionStage: "${newStage}" is not a valid stage (${PIPELINE_STAGES.join(", ")})`);
  }
  return { ...submission, pipeline_stage: newStage };
}

export function setSubmissionNotes(tier, submission, notes) {
  const features = resolveFeatures(tier);
  if (!features.notes) {
    throw new Error(`setSubmissionNotes: notes are not enabled for tier "${tier}"`);
  }
  return { ...submission, notes };
}

// CRM config UI (SMB only): never exposes auth_token_encrypted — CONTRACT.md is explicit that customers
// cannot select that column, so this view-model builder drops it even if a caller accidentally passes it in.
export function buildCrmConfigView(tier, crmIntegration) {
  const features = resolveFeatures(tier);
  if (!features.crmConfig) {
    throw new Error(`buildCrmConfigView: CRM config is not enabled for tier "${tier}"`);
  }
  const { auth_token_encrypted, ...safe } = crmIntegration;
  return {
    id: safe.id,
    crmType: safe.crm_type,
    syncStatus: safe.sync_status,
    lastSyncAt: safe.last_sync_at,
    leadsSent: safe.leads_sent,
    syncErrorsCount: safe.sync_errors_count,
    connected: safe.sync_status === "active",
  };
}

// Image uploads: SMB gets the full multi-image uploader (services/team/testimonials, matrix); Micro gets a
// single logo replace only. Returns the allowed upload targets for the caller's tier, not a live upload.
export function buildImageUploadConfig(tier) {
  const features = resolveFeatures(tier);
  if (features.imageUploads) {
    return { mode: "multi", targets: ["logo", "hero", "services", "team", "testimonials"], maxFiles: 20 };
  }
  if (features.singleLogoUpload) {
    return { mode: "single-logo", targets: ["logo"], maxFiles: 1 };
  }
  return { mode: "none", targets: [], maxFiles: 0 };
}

export { PIPELINE_STAGES };
