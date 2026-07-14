// supabase/functions/oren-smart-advisor/ai-invocation-log.ts
//
// AI Invocation Log — מטא-דאטה תפעולית בלבד לכל ניסיון-קריאת-AI-חי.
// **לעולם לא chain-of-thought** — אין reasoning/thoughts/prompt-content/
// raw-response-text בשום שדה. תיעוד תואם ל-
// HALL_WISDOM_LIVE_INTELLIGENCE_FIRST_USABLE_VERSION_PLAN.md §6/§9/§12:
// שלב-ראשוני-בלבד — log-line (Deno console.log, נאסף אוטומטית ב-Supabase
// Edge Function Logs), לא persistence/DB-table. self-contained, אין imports.

export interface AiInvocationLogEntry {
  readingId?: string;
  payloadVersion: string;
  promptVersion: string;
  model?: string;
  tokens: { input: number; output: number } | null;
  latencyMs: number;
  estimatedCost: number | null;
  success: boolean;
  error?: string;
}

const LOG_TAG = '[AI_INVOCATION_LOG]';

// אין טבלת-מחירים מוחלטת כאן — אין החלטה על מודל עדיין (ר' התוכנית §2),
// ולכן estimatedCost תמיד null עד-שתיקבע טבלת-מחירים מאושרת. מוטב
// null-כן-מתועד מ-ניחוש-מספר שעלול-להטעות (No Invented Data).
export function estimateCostUsd(_model: string | undefined, _tokens: { input: number; output: number } | null): number | null {
  return null;
}

export function buildAiInvocationLogEntry(params: {
  readingId?: string;
  payloadVersion: string;
  promptVersion: string;
  model?: string;
  tokens: { input: number; output: number } | null;
  latencyMs: number;
  success: boolean;
  error?: string;
}): AiInvocationLogEntry {
  return {
    readingId: params.readingId,
    payloadVersion: params.payloadVersion,
    promptVersion: params.promptVersion,
    model: params.model,
    tokens: params.tokens,
    latencyMs: params.latencyMs,
    estimatedCost: estimateCostUsd(params.model, params.tokens),
    success: params.success,
    error: params.error,
  };
}

// console.log בלבד — לא-fetch, לא-DB, לא-file-write. Deno Edge Function
// Logs אוספים אוטומטית כל console.log (נגיש דרך supabase get_logs MCP).
export function logAiInvocation(entry: AiInvocationLogEntry): void {
  console.log(LOG_TAG, JSON.stringify(entry));
}

export default { buildAiInvocationLogEntry, logAiInvocation, estimateCostUsd, LOG_TAG };
