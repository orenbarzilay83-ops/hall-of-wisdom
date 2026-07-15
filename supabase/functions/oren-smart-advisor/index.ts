// supabase/functions/oren-smart-advisor/index.ts
//
// שער-ההרשאה של Oren Smart Advisor Brain — Edge Function ייעודית, נפרדת
// לגמרי מ-oren-smart-ai (Runtime AI ללקוח, ראו OREN_SMART_ADVISOR_ACCESS_CONTROL_AUDIT.md
// ו-OREN_SMART_ADVISOR_AUTH_ALLOWLIST_PLAN.md לעקרון-ההפרדה ולזרימה המלאה).
//
// אימות-הטוקן (verifyTokenWithSupabase) הוא מסלול-אמיתי — קורא ל-Supabase
// Auth REST API (GET /auth/v1/user עם Bearer-token), בלי SDK, באותו-דפוס
// כמו ai/provider/anthropic-provider.js (fetch גולמי, בלי מפתח-מוטמע).
// **אין deploy, אין secret אמיתי בסביבה הזו** — הבדיקה המקומית מזריקה
// verifier מדומה דרך deps.verifyToken כדי לא-לקרוא-לרשת (ראו
// _test_oren_smart_advisor_auth_function.mjs). mockAdvisorBrainOutput
// עדיין-נשאר-mock במפורש — לא-קורא-ל-AI כלל, יוחלף בעתיד בקריאה אמיתית
// ל-callAnthropic, רק אחרי שהרשאה אושרה, בשלב-נפרד-ומאושר.
//
// ניתן-להרצה גם בתוך Node (לבדיקה מקומית-בלבד) — declare const Deno +
// typeof-guards מבטיחים שהקובץ לא-קורס כשאין Deno global, ושה-Deno.serve
// בתחתית לא-מופעל מחוץ ל-Deno האמיתי.
//
// הערות-deploy עתידיות (לא מבוצעות כאן, ולא-בלי אישור נפרד ומפורש):
//   supabase functions deploy oren-smart-advisor
//   supabase secrets set SUPABASE_URL=<כתובת-הפרויקט>
//   supabase secrets set SUPABASE_ANON_KEY=<מפתח-anon של הפרויקט>
//   supabase secrets set ALLOWED_OREN_UID=<UID אמיתי של אורן משה>
//   supabase secrets set ANTHROPIC_API_KEY=<בעתיד, כשה-mock AI יוחלף בקריאה אמיתית>
//   supabase secrets set ANTHROPIC_MODEL=<בעתיד — שם-מודל, לא-מקובע בקוד; אין החלטה כרגע>
//   supabase secrets set HALL_WISDOM_AI_MODE=live   <בעתיד — מתג-שרת ל-module:"goralQA" live-ready, ברירת-מחדל היעדר-הגדרה = mock>

// module:"goralQA" — בינת היכל החכמה: Goral QA Evaluator. כל הקבצים
// הבאים חיים בתוך תיקיית-הפונקציה עצמה בלבד (deploy-safety — ראו
// HALL_WISDOM_GORAL_QA_LIVE_AI_INTEGRATION_PLAN.md) — שום ייבוא חוצה-ריפו:
//   - goral_qa_mock_evaluator.ts    — MOCK תמיד-זמין, ברירת-המחדל
//   - anthropic-provider-edge.ts    — פורט מקומי, live-ready, לא-קורא-לרשת
//     אלא-אם apiKey מסופק בפועל (לא קורה כאן — ראו §"מצב live" למטה)
//   - goral-qa-evaluator-prompt.ts  — prompt קבוע, מקומי
//   - goral_qa_payload_sanitizer.ts — סניטציה שרתית לפני כל שליחה ל-AI
import { evaluateQaRunMockEdge } from './goral_qa_mock_evaluator.ts';
import { callAnthropicEdge, callAnthropicEdgeWithForcedTool } from './anthropic-provider-edge.ts';
import { GORAL_QA_EVALUATOR_PROMPT } from './goral-qa-evaluator-prompt.ts';
import { sanitizeGoralQaPayloadForAi } from './goral_qa_payload_sanitizer.ts';
// module:"kashf" עם payload אמיתי — אותו דפוס בדיוק כמו goralQA לעיל,
// דרך AI Context Package גנרי (Shared Core, לא-Domain-ספציפי — ר'
// HALL_WISDOM_LIVE_INTELLIGENCE_FIRST_USABLE_VERSION_PLAN.md §9/הבהרת-מוצר).
// הפלט עצמו נאכף כעת דרך forced tool_choice (structured output), לא
// JSON.parse על טקסט חופשי — ר' HALL_WISDOM_KASHF_LIVE_PILOT_CONTEXT_SIZE_AND_JSON_AUDIT_REPORT.md:
import { OREN_SMART_ADVISOR_BRAIN_PROMPT, OREN_SMART_ADVISOR_BRAIN_PROMPT_VERSION } from './oren-smart-advisor-brain-prompt.ts';
import { KASHF_ADVISOR_TOOL_DEFINITION, validateKashfAdvisorOutput } from './oren-smart-advisor-brain-tool-schema.ts';
import { sanitizeKashfReadingPayloadForAi } from './kashf_reading_payload_sanitizer.ts';
import { isValidAiContextPackageEnvelope, type AiContextPackage } from './ai-context-package.ts';
import { buildAiInvocationLogEntry, logAiInvocation } from './ai-invocation-log.ts';

declare const Deno: any;

function getEnv(key: string): string | undefined {
  if (typeof Deno !== 'undefined' && Deno.env) return Deno.env.get(key);
  if (typeof process !== 'undefined' && process.env) return process.env[key];
  return undefined;
}

interface VerifyResult {
  valid: boolean;
  userId: string | null;
}

interface SupabaseEnv {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

type VerifyTokenFn = (token: string, env: SupabaseEnv) => Promise<VerifyResult>;

const SAFE_MESSAGES = {
  unauthenticated: 'Authentication required.',
  forbidden: 'Not authorized.',
  serverMisconfigured: 'Service temporarily unavailable.',
};

// מסלול-אימות אמיתי מול Supabase Auth — GET /auth/v1/user עם Bearer-token
// ו-apikey (anon key). לעולם-לא-זורק — כישלון-רשת/תגובה-לא-תקינה חוזר
// כ-{valid:false}, לא-חריגה, כדי-שהקורא תמיד-יטפל-בזה כ-401 רגיל.
async function verifyTokenWithSupabase(token: string, env: SupabaseEnv): Promise<VerifyResult> {
  try {
    const res = await fetch(`${env.supabaseUrl}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: env.supabaseAnonKey,
      },
    });
    if (!res.ok) return { valid: false, userId: null };
    const data = await res.json();
    if (!data || typeof data.id !== 'string' || !data.id) return { valid: false, userId: null };
    return { valid: true, userId: data.id };
  } catch {
    return { valid: false, userId: null };
  }
}

// MOCK-בלבד — אינו קורא ל-Anthropic בשום-אופן, לא-כרגע ולא-כ-fallback.
function mockAdvisorBrainOutput() {
  return {
    module: 'kashf',
    advisorDiagnosis: 'MOCK — אין קריאת-AI אמיתית בשלב הזה.',
    clientAnswerDraft: 'MOCK — טיוטה-בלבד, לא-נשלחת-ללקוח.',
    engineCritique: { hasProblem: false, problems: [] as string[], severity: 'none' },
    missingKnowledgeOrRules: [] as string[],
    recommendedFix: '',
    codeInstructionForClaude: {
      needed: false,
      instruction: '',
      filesToInspect: [] as string[],
      filesNotToTouch: [] as string[],
      testsToRun: [] as string[],
    },
    safetyNotes: [] as string[],
    privacyBlockedFields: [] as string[],
    nextBestAction: 'approveOutput',
    confidence: 'low',
    needsOrenDecision: false,
  };
}

function jsonResponse(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

// deps.verifyToken — dependency-injection לבדיקות-מקומיות בלבד (כדי
// שלא-יקראו-לרשת). כשלא-מוזרק, המסלול-האמיתי (verifyTokenWithSupabase) הוא
// זה-שרץ תמיד — הוא הלוגיקה-הראשית, לא mockVerifyToken (הוסר).
export async function handleAdvisorRequest(
  req: Request,
  deps: { verifyToken?: VerifyTokenFn } = {},
): Promise<Response> {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  // 1. אין Authorization header כלל (או לא בפורמט Bearer)
  if (!token) {
    return jsonResponse(401, { ok: false, errorCode: 'unauthenticated', message: SAFE_MESSAGES.unauthenticated });
  }

  // 2. תצורת-Supabase חסרה בסביבה → אי-אפשר-לאמת-בכלל → fail closed
  const supabaseUrl = getEnv('SUPABASE_URL');
  const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY');
  if (!supabaseUrl || !supabaseAnonKey) {
    return jsonResponse(503, { ok: false, errorCode: 'server_misconfigured', message: SAFE_MESSAGES.serverMisconfigured });
  }

  // 3. אימות-הטוקן בפועל — real Supabase Auth כברירת-מחדל, verifier-מוזרק בבדיקות
  const verifyToken = deps.verifyToken || verifyTokenWithSupabase;
  const verified = await verifyToken(token, { supabaseUrl, supabaseAnonKey });
  if (!verified.valid || !verified.userId) {
    return jsonResponse(401, { ok: false, errorCode: 'unauthenticated', message: SAFE_MESSAGES.unauthenticated });
  }

  // 4. ALLOWED_OREN_UID חסר בסביבה → fail closed, לעולם לא allowed
  const allowedUid = getEnv('ALLOWED_OREN_UID');
  if (!allowedUid) {
    return jsonResponse(503, { ok: false, errorCode: 'server_misconfigured', message: SAFE_MESSAGES.serverMisconfigured });
  }

  // 5. משתמש מחובר אך user.id לא-תואם
  if (verified.userId !== allowedUid) {
    return jsonResponse(403, { ok: false, errorCode: 'forbidden', message: SAFE_MESSAGES.forbidden });
  }

  // 6. הרשאה אושרה — רק-עכשיו קוראים body ומנתבים לפי module. עד-כאן
  // שום payload/module לא-נקרא בכלל — ה-fail-closed-checks (1-5) לעולם
  // לא-תלויים בתוכן-הבקשה.
  let body: Record<string, unknown> = {};
  try {
    const rawBody = await req.text();
    body = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    return jsonResponse(400, { ok: false, errorCode: 'invalid_json', message: 'Request body is not valid JSON.' });
  }

  const moduleName = body?.module;

  // module:"kashf" (או ללא module כלל — ר' תאימות-לאחור למטה).
  //
  // תאימות-לאחור: בקשה-בלי-module כלל, או module:"kashf" בלי AI Context
  // Package תקין — ההתנהגות הישנה שכבר-נבדקה (mockAdvisorBrainOutput
  // תמיד), ללא-שינוי. אם סופקה מעטפה תקינה (payloadVersion/domain/method/
  // readingContext, ר' ai-context-package.ts) עם readingContext.question/
  // board/engineOutput — נכנסים לשער-5-התנאים, **בדיוק** כמו-module:"goralQA".
  if (moduleName === undefined || moduleName === 'kashf') {
    const contextPackage = body?.payload as AiContextPackage | undefined;

    const readingContext = contextPackage?.readingContext as {
      question?: unknown;
      board?: unknown;
      engineOutput?: unknown;
      activatedRuleIds?: unknown;
      rejectedRuleIds?: unknown;
      sourceEvidence?: unknown;
    } | undefined;

    const hasRealReadingPayload =
      isValidAiContextPackageEnvelope(contextPackage) &&
      contextPackage.domain === 'reading.goralHachol' &&
      typeof readingContext?.question === 'string' &&
      readingContext.question.length > 0 &&
      readingContext.board !== undefined &&
      readingContext.engineOutput !== undefined;

    if (!hasRealReadingPayload) {
      return jsonResponse(200, { ok: true, advisorBrainOutput: mockAdvisorBrainOutput() });
    }

    const mockFallback = (reason: string) =>
      jsonResponse(200, {
        ok: true,
        advisorBrainOutput: mockAdvisorBrainOutput(),
        evaluatorMode: 'mock',
        liveModeUnavailableReason: reason,
      });

    const requestWantsLive = body?.mode === 'live';
    if (!requestWantsLive) {
      return jsonResponse(200, { ok: true, advisorBrainOutput: mockAdvisorBrainOutput(), evaluatorMode: 'mock' });
    }

    if (getEnv('HALL_WISDOM_AI_MODE') !== 'live') {
      return mockFallback('mode-not-live');
    }

    const apiKey = getEnv('ANTHROPIC_API_KEY');
    if (!apiKey) {
      return mockFallback('missing-api-key');
    }

    const model = getEnv('ANTHROPIC_MODEL');
    if (!model) {
      return mockFallback('missing-model');
    }

    const sanitization = sanitizeKashfReadingPayloadForAi(contextPackage);
    if (!sanitization.ok) {
      return mockFallback(sanitization.reason || 'sanitization-failed');
    }

    // AI Context Package המלא (envelope + readingContext) נשלח כפי-שהוא —
    // readingStrategy/readingPlan/decisionSummary/questionType/primaryIntent
    // כבר-נכללים-בו, ללא-עיבוד-נוסף כאן (Core לא-מחשב-מחדש). הפלט נאכף
    // דרך forced tool_choice — אין JSON.parse על טקסט חופשי, אין קבלת
    // text כהצלחה חלופית, אין חילוץ-JSON ממארקדאון, אין "תיקון" פלט שבור,
    // ואין round-trip שני (tool_use.input נקרא ישירות, לא מבוצע בפועל).
    const startedAt = Date.now();
    const aiResult = await callAnthropicEdgeWithForcedTool({
      apiKey,
      model,
      system: OREN_SMART_ADVISOR_BRAIN_PROMPT,
      userMessage: JSON.stringify(contextPackage),
      tool: KASHF_ADVISOR_TOOL_DEFINITION,
    });
    const latencyMs = Date.now() - startedAt;

    const logBase = {
      readingId: contextPackage.readingId,
      payloadVersion: contextPackage.payloadVersion,
      promptVersion: OREN_SMART_ADVISOR_BRAIN_PROMPT_VERSION,
      model,
      latencyMs,
      tokens: aiResult.usage ? { input: aiResult.usage.inputTokens, output: aiResult.usage.outputTokens } : null,
      ...(aiResult.diagnostics
        ? {
            stopReason: aiResult.diagnostics.stopReason,
            contentBlockTypes: aiResult.diagnostics.contentBlockTypes,
            textBlockCount: aiResult.diagnostics.textBlockCount,
            toolUseBlockCount: aiResult.diagnostics.toolUseBlockCount,
            receivedToolNames: aiResult.diagnostics.receivedToolNames,
          }
        : {}),
    };

    if (!aiResult.ok || !aiResult.toolInput) {
      logAiInvocation(buildAiInvocationLogEntry({ ...logBase, success: false, error: aiResult.error || 'anthropic-error' }));
      return mockFallback('anthropic-error');
    }

    // Zero-trust re-validation of tool_use.input — never assumes the API's
    // strict:true schema enforcement was sufficient on its own. A missing
    // field, wrong type, or extra field is a rejection, never a repair.
    const validation = validateKashfAdvisorOutput(aiResult.toolInput);
    if (!validation.ok || !validation.value) {
      logAiInvocation(buildAiInvocationLogEntry({ ...logBase, success: false, error: 'schema-validation-failed', schemaValidationErrorCategory: validation.category || 'unknown' }));
      return mockFallback('anthropic-error');
    }

    logAiInvocation(buildAiInvocationLogEntry({ ...logBase, success: true }));
    return jsonResponse(200, { ok: true, advisorBrainOutput: validation.value, evaluatorMode: 'live' });
  }

  // module:"goralQA" — בינת היכל החכמה: Goral QA Evaluator.
  // ברירת-מחדל: MOCK תמיד. live-ready רק אם כל 5 התנאים הבאים מתקיימים
  // יחד — auth כבר-אושר-למעלה (שלבים 1-5); כאן ממשיכים לבדוק:
  //   (א) הבקשה מבקשת live במפורש (body.mode === 'live')
  //   (ב) מתג-השרת HALL_WISDOM_AI_MODE === 'live'
  //   (ג) ANTHROPIC_API_KEY קיים בסביבה
  //   (ד) ANTHROPIC_MODEL קיים בסביבה (לא-מקובע-בקוד — אין החלטה על מודל)
  //   (ה) ה-payload עובר סניטציה שרתית (defense-in-depth)
  // כל תנאי-חסר → fallback ל-MOCK עם liveModeUnavailableReason ברור,
  // לא-שקט. שום קריאה ל-callAnthropicEdge לא-מתבצעת לפני שכל 5 התנאים
  // אושרו במפורש.
  if (moduleName === 'goralQA') {
    const qaPayload = body?.payload as { scenarios?: unknown; collectedOutputs?: unknown } | undefined;
    if (!qaPayload || !Array.isArray(qaPayload.scenarios) || !Array.isArray(qaPayload.collectedOutputs)) {
      return jsonResponse(400, {
        ok: false,
        errorCode: 'invalid_payload',
        message: 'module "goralQA" requires payload.scenarios and payload.collectedOutputs (arrays).',
      });
    }

    const mockFallback = (reason: string) =>
      jsonResponse(200, {
        ok: true,
        module: 'goralQA',
        evaluatorMode: 'mock',
        liveModeUnavailableReason: reason,
        evaluatorOutput: evaluateQaRunMockEdge(qaPayload as never),
      });

    const requestWantsLive = body?.mode === 'live';
    if (!requestWantsLive) {
      // המצב הרגיל/ברירת-המחדל — לא ביקשו live בכלל, אין "סיבה" להסביר.
      return jsonResponse(200, {
        ok: true,
        module: 'goralQA',
        evaluatorMode: 'mock',
        evaluatorOutput: evaluateQaRunMockEdge(qaPayload as never),
      });
    }

    if (getEnv('HALL_WISDOM_AI_MODE') !== 'live') {
      return mockFallback('mode-not-live');
    }

    const apiKey = getEnv('ANTHROPIC_API_KEY');
    if (!apiKey) {
      return mockFallback('missing-api-key');
    }

    const model = getEnv('ANTHROPIC_MODEL');
    if (!model) {
      return mockFallback('missing-model');
    }

    const sanitization = sanitizeGoralQaPayloadForAi(qaPayload);
    if (!sanitization.ok) {
      return mockFallback(sanitization.reason || 'sanitization-failed');
    }

    const aiResult = await callAnthropicEdge({
      apiKey,
      model,
      system: GORAL_QA_EVALUATOR_PROMPT,
      userMessage: JSON.stringify(qaPayload),
    });
    if (!aiResult.ok || !aiResult.text) {
      return mockFallback('anthropic-error');
    }

    let parsedOutput: Record<string, unknown>;
    try {
      parsedOutput = JSON.parse(aiResult.text);
    } catch {
      // תגובת-Anthropic לא-הייתה JSON תקין — לא-מחזירים טקסט-גולמי-לא-מאומת.
      return mockFallback('anthropic-error');
    }

    const REQUIRED_OUTPUT_KEYS = [
      'overallDiagnosis', 'scenarioFindings', 'detectedProblems', 'severity',
      'irrelevantSections', 'missingRelevantSections', 'advisorOnlyLeaks',
      'clientOutputProblems', 'sourceRuleConcerns', 'recommendedFixes',
      'codeInstructionForClaude', 'testsToAdd', 'needsOrenDecision', 'confidence',
    ];
    const hasAllKeys = REQUIRED_OUTPUT_KEYS.every((k) => k in parsedOutput);
    if (!hasAllKeys) {
      return mockFallback('anthropic-error');
    }

    return jsonResponse(200, {
      ok: true,
      module: 'goralQA',
      evaluatorMode: 'live',
      evaluatorOutput: parsedOutput,
    });
  }

  // module לא-מוכר — אין fallback מסוכן.
  return jsonResponse(422, { ok: false, errorCode: 'unknown_module', message: `Unknown module: ${String(moduleName)}` });
}

if (typeof Deno !== 'undefined' && typeof Deno.serve === 'function') {
  Deno.serve((req: Request) => handleAdvisorRequest(req));
}
