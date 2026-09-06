// supabase/functions/oren-smart-advisor/goral_qa_payload_sanitizer.ts
//
// Server-side sanitization (defense-in-depth) — עצמאי מ-payload-builder
// המקומי (goral-hachol/qa/goral-qa-ai-payload-builder.js), כי ה-Edge
// Function מקבלת payload מהקורא (לא בהכרח דרך ה-payload-builder!). לפני
// כל שליחה ל-Anthropic, ה-payload עובר דרך הפונקציה הזו. self-contained,
// אין imports.
//
// החלטה מתועדת (ראו HALL_WISDOM_GORAL_QA_LIVE_AI_READY_PRECOMMIT_REPORT.md):
// כשנמצא שדה-אסור — **חוסמים live ונופלים חזרה ל-MOCK** (לא מנקים-בשקט
// וממשיכים). נימוק: ניקוי-שקט עלול להסתיר באג בשכבה שמעל (שהייתה אמורה
// לסנן כבר), ולתת ביטחון-שווא שהכל תקין. חסימה-עם-סיבה-ברורה שקופה יותר.

const FORBIDDEN_KEYS = ['phone', 'dynFields', 'clientHistorySummary'];

// חשד ל"sourceText מלא" (עמוד-ספר שלם) במקום ציטוט-כלל קצר — היוריסטיקה
// על אורך-מחרוזת, כי sourceRulesApplied הוא מערך-מחרוזות-שטוח (אין שדה
// נפרד בשם "sourceText" לבדוק לפי-מפתח בפורמט הזה).
const MAX_SOURCE_SNIPPET_LENGTH = 2000;

export interface SanitizationResult {
  ok: boolean;
  reason?: string;
}

interface CollectedOutputLike {
  sourceRulesApplied?: unknown;
}

interface QaPayloadLike {
  collectedOutputs?: unknown;
}

export function sanitizeGoralQaPayloadForAi(payload: unknown): SanitizationResult {
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

  const collectedOutputs = (payload as QaPayloadLike)?.collectedOutputs;
  if (Array.isArray(collectedOutputs)) {
    for (const output of collectedOutputs as CollectedOutputLike[]) {
      const snippets = Array.isArray(output?.sourceRulesApplied) ? output.sourceRulesApplied : [];
      for (const snippet of snippets) {
        if (typeof snippet === 'string' && snippet.length > MAX_SOURCE_SNIPPET_LENGTH) {
          return { ok: false, reason: 'sanitization-failed' };
        }
      }
    }
  }

  return { ok: true };
}

export default { sanitizeGoralQaPayloadForAi };
