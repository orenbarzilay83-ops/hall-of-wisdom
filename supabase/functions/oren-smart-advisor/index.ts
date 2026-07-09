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

// module:"goralQA" — בינת היכל החכמה: Goral QA Evaluator (MOCK בלבד, ראו
// HALL_WISDOM_GORAL_QA_EDGE_MOCK_PRECOMMIT_REPORT.md). ייבוא מ-adapter
// מקומי בתוך תיקיית-הפונקציה עצמה (goral_qa_mock_evaluator.ts) — לא ייבוא
// חוצה-ריפו — כדי שה-Edge Function תהיה deploy-safe ולא תלויה בבנדלינג
// שעלול לא-לתמוך בייבוא-מחוץ-לתיקיית-הפונקציה. ה-runner המקומי ממשיך
// להשתמש ב-goral-hachol/qa/goral-qa-ai-evaluator-mock.js (לא שונה).
import { evaluateQaRunMockEdge } from './goral_qa_mock_evaluator.ts';

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

  // תאימות-לאחור: בקשה-בלי-module כלל (או module:"kashf" מפורש) — ההתנהגות
  // הישנה שכבר-נבדקה (mockAdvisorBrainOutput תמיד).
  if (moduleName === undefined || moduleName === 'kashf') {
    return jsonResponse(200, { ok: true, advisorBrainOutput: mockAdvisorBrainOutput() });
  }

  // module:"goralQA" — בינת היכל החכמה: Goral QA Evaluator (MOCK בלבד).
  if (moduleName === 'goralQA') {
    const qaPayload = body?.payload as { scenarios?: unknown; collectedOutputs?: unknown } | undefined;
    if (!qaPayload || !Array.isArray(qaPayload.scenarios) || !Array.isArray(qaPayload.collectedOutputs)) {
      return jsonResponse(400, {
        ok: false,
        errorCode: 'invalid_payload',
        message: 'module "goralQA" requires payload.scenarios and payload.collectedOutputs (arrays).',
      });
    }
    const evaluatorOutput = evaluateQaRunMockEdge(qaPayload as never);
    return jsonResponse(200, { ok: true, module: 'goralQA', evaluatorOutput });
  }

  // module לא-מוכר — אין fallback מסוכן.
  return jsonResponse(422, { ok: false, errorCode: 'unknown_module', message: `Unknown module: ${String(moduleName)}` });
}

if (typeof Deno !== 'undefined' && typeof Deno.serve === 'function') {
  Deno.serve((req: Request) => handleAdvisorRequest(req));
}
