// supabase/functions/oren-smart-advisor/kashf_reading_payload_sanitizer.ts
//
// Server-side sanitization (defense-in-depth) לפני כל שליחה של payload
// קריאה-בודדת (module:"kashf") ל-Anthropic. עצמאי, self-contained, אין
// imports — אותו דפוס כמו goral_qa_payload_sanitizer.ts (module:"goralQA").
//
// אותה החלטה מתועדת (HALL_WISDOM_GORAL_QA_LIVE_AI_READY_PRECOMMIT_REPORT.md):
// כשנמצא שדה-אסור — חוסמים live ונופלים חזרה ל-MOCK, לא מנקים-בשקט.

const FORBIDDEN_KEYS = ['phone', 'dynFields', 'parentName', 'maritalStatus', 'hasChildren', 'clientHistorySummary'];

const MAX_SOURCE_SNIPPET_LENGTH = 2000;

export interface SanitizationResult {
  ok: boolean;
  reason?: string;
}

interface KashfReadingPayloadLike {
  readingContext?: {
    sourceEvidence?: unknown;
    canonicalResolution?: unknown;
    canonicalRetrieval?: unknown;
    aiVerdictAllowed?: unknown;
    professionalVerdictSafety?: unknown;
  };
}

function isShortString(value: unknown, max = 300): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= max;
}

function isStringArray(value: unknown, maxItems = 30, maxLength = 300): value is string[] {
  return Array.isArray(value)
    && value.length <= maxItems
    && value.every((item) => typeof item === 'string' && item.length <= maxLength);
}

function validateCanonicalBlock(payload: KashfReadingPayloadLike): boolean {
  const rc = payload?.readingContext;
  const retrieval = rc?.canonicalRetrieval as Record<string, unknown> | null | undefined;
  const resolution = rc?.canonicalResolution as Record<string, unknown> | null | undefined;

  // Legacy packages remain accepted. Once either canonical field is present,
  // both must satisfy the stricter contract.
  if (retrieval == null && resolution == null) return true;
  if (!retrieval || typeof retrieval !== 'object' || !resolution || typeof resolution !== 'object') return false;

  if (!isShortString(retrieval.kashfMethodId, 200)) return false;
  if (!isShortString(retrieval.kashfIntentId, 200)) return false;
  if (retrieval.knowledgeLanguage !== 'he') return false;
  if (retrieval.knowledgeRole !== 'operational-primary') return false;
  if (!isStringArray(retrieval.doNotMixWith, 30, 200)) return false;

  const v57 = retrieval.v57 as Record<string, unknown> | null | undefined;
  if (!v57 || typeof v57 !== 'object') return false;
  if (v57.version !== 'v57') return false;
  if (!isShortString(v57.hebrewRule, MAX_SOURCE_SNIPPET_LENGTH)) return false;
  if (!isShortString(v57.anchor, 80)) return false;
  if (typeof v57.page !== 'number' || !Number.isFinite(v57.page)) return false;

  const arabic = retrieval.arabicVerification as Record<string, unknown> | null | undefined;
  if (!arabic || typeof arabic !== 'object' || arabic.role !== 'verification-only') return false;
  if (!Array.isArray(arabic.pages) || !arabic.pages.every((p) => typeof p === 'number' && Number.isFinite(p))) return false;

  if (resolution.kashfMethodId !== retrieval.kashfMethodId) return false;
  if (resolution.kashfIntentId !== retrieval.kashfIntentId) return false;
  if (!['question-route', 'retrieval-index'].includes(String(resolution.resolutionSource || ''))) return false;
  if (typeof rc?.aiVerdictAllowed !== 'boolean') return false;

  const safety = rc?.professionalVerdictSafety as Record<string, unknown> | null | undefined;
  if (!safety || typeof safety !== 'object') return false;
  if (!isShortString(safety.policyVersion, 120)) return false;
  if (safety.kashfMethodId !== retrieval.kashfMethodId) return false;
  if (!['positive', 'negative', 'non-binary', 'blocked'].includes(String(safety.authoritativePolarity || ''))) return false;
  if (typeof safety.isSafe !== 'boolean') return false;
  if (typeof safety.binaryClientVerdictAllowed !== 'boolean') return false;
  if (!['certified', 'pending-backfill', 'not-applicable'].includes(String(safety.certificationStatus || ''))) return false;
  if (typeof safety.clientFacingCertified !== 'boolean') return false;
  if ((safety.certificationStatus === 'certified') !== (safety.clientFacingCertified === true)) return false;
  if (safety.binaryClientVerdictAllowed === true && safety.clientFacingCertified !== true) return false;
  if (safety.noInverseRule !== true || safety.noUnstatedAggregation !== true || safety.selectedMethodOnly !== true) return false;
  if (!isStringArray(safety.allowedVerdictSources, 10, 300)) return false;
  if (!isStringArray(safety.forbiddenVerdictSources, 60, 500)) return false;
  if (rc.aiVerdictAllowed === true && safety.isSafe !== true) return false;
  if (safety.authoritativePolarity === 'non-binary' && safety.binaryClientVerdictAllowed !== false) return false;
  if (safety.authoritativePolarity === 'blocked' && rc.aiVerdictAllowed === true) return false;

  // A blocked/pending method may be retrievable knowledge, but the payload
  // must never claim the AI is allowed to present a computed verdict for it.
  const runtimeAllowed = retrieval.runtimeAllowed === true;
  const executorReady = retrieval.executorStatus === 'ready';
  const sourceReady = retrieval.kashfRuntimeStatus === 'ready';
  if (rc.aiVerdictAllowed === true && !(runtimeAllowed && executorReady && sourceReady)) return false;

  return true;
}

export function sanitizeKashfReadingPayloadForAi(payload: unknown): SanitizationResult {
  if (!payload || typeof payload !== 'object') {
    return { ok: false, reason: 'sanitization-failed' };
  }

  let json: string;
  try {
    json = JSON.stringify(payload);
  } catch {
    return { ok: false, reason: 'sanitization-failed' };
  }

  for (const key of FORBIDDEN_KEYS) {
    if (json.includes(`"${key}"`)) {
      return { ok: false, reason: 'sanitization-failed' };
    }
  }

  const typedPayload = payload as KashfReadingPayloadLike;
  if (!validateCanonicalBlock(typedPayload)) {
    return { ok: false, reason: 'sanitization-failed' };
  }

  const sourceEvidence = typedPayload?.readingContext?.sourceEvidence;
  if (Array.isArray(sourceEvidence)) {
    for (const snippet of sourceEvidence) {
      if (typeof snippet === 'string' && snippet.length > MAX_SOURCE_SNIPPET_LENGTH) {
        return { ok: false, reason: 'sanitization-failed' };
      }
    }
  }

  return { ok: true };
}

export default { sanitizeKashfReadingPayloadForAi };
