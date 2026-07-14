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
  readingContext?: { sourceEvidence?: unknown };
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

  const sourceEvidence = (payload as KashfReadingPayloadLike)?.readingContext?.sourceEvidence;
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
