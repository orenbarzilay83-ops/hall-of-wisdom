// supabase/functions/oren-smart-advisor/index.ts
//
// שער-ההרשאה של Oren Smart Advisor Brain — Edge Function ייעודית, נפרדת
// לגמרי מ-oren-smart-ai (Runtime AI ללקוח, ראו OREN_SMART_ADVISOR_ACCESS_CONTROL_AUDIT.md
// ו-OREN_SMART_ADVISOR_AUTH_ALLOWLIST_PLAN.md לעקרון-ההפרדה ולזרימה המלאה).
//
// מצב MOCK בלבד בשלב הזה: אין secret אמיתי, אין deploy, אין קריאת-Anthropic
// אמיתית. mockVerifyToken מדמה supabase.auth.getUser(token) — יוחלף בעתיד
// בקריאה-אמיתית ל-Supabase Auth, רק לפני deploy אמיתי ואישור נפרד.
// mockAdvisorBrainOutput לא-קורא-ל-AI כלל — יוחלף בעתיד בקריאה אמיתית
// ל-ai/provider/anthropic-provider.js::callAnthropic, רק אחרי שהרשאה אושרה.
//
// ניתן-להרצה גם בתוך Node (לבדיקה מקומית-בלבד, _test_oren_smart_advisor_auth_function.mjs) —
// declare const Deno + typeof-guards מבטיחים שהקובץ לא-קורס כשאין Deno global,
// ושה-Deno.serve בתחתית לא-מופעל מחוץ ל-Deno האמיתי.
//
// הערות-deploy עתידיות (לא מבוצעות כאן, ולא-בלי אישור נפרד ומפורש):
//   supabase functions deploy oren-smart-advisor
//   supabase secrets set ALLOWED_OREN_UID=<UID אמיתי של אורן משה>
//   supabase secrets set ANTHROPIC_API_KEY=<בעתיד, כשה-mock AI יוחלף בקריאה אמיתית>

declare const Deno: any;

function getEnv(key: string): string | undefined {
  if (typeof Deno !== 'undefined' && Deno.env) return Deno.env.get(key);
  if (typeof process !== 'undefined' && process.env) return process.env[key];
  return undefined;
}

const SAFE_MESSAGES = {
  unauthenticated: 'Authentication required.',
  forbidden: 'Not authorized.',
  serverMisconfigured: 'Service temporarily unavailable.',
};

// MOCK-בלבד — מדמה supabase.auth.getUser(token), בלי שום קריאת-רשת-אמיתית.
// טוקנים מזויפים-בלבד, לא-UID-אמיתי-של-אף-אחד.
function mockVerifyToken(token: string): { valid: boolean; userId: string | null } {
  if (token === 'mock-token-oren') return { valid: true, userId: 'mock-uid-oren-000' };
  if (token === 'mock-token-other-user') return { valid: true, userId: 'mock-uid-someone-else-111' };
  return { valid: false, userId: null };
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

export function handleAdvisorRequest(req: Request): Response {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  // 1. אין Authorization header כלל (או לא בפורמט Bearer)
  if (!token) {
    return jsonResponse(401, { ok: false, errorCode: 'unauthenticated', message: SAFE_MESSAGES.unauthenticated });
  }

  // 2. טוקן לא-תקף
  const verified = mockVerifyToken(token);
  if (!verified.valid || !verified.userId) {
    return jsonResponse(401, { ok: false, errorCode: 'unauthenticated', message: SAFE_MESSAGES.unauthenticated });
  }

  // 3. ALLOWED_OREN_UID חסר בסביבה → fail closed, לעולם לא allowed
  const allowedUid = getEnv('ALLOWED_OREN_UID');
  if (!allowedUid) {
    return jsonResponse(503, { ok: false, errorCode: 'server_misconfigured', message: SAFE_MESSAGES.serverMisconfigured });
  }

  // 4. משתמש מחובר אך user.id לא-תואם
  if (verified.userId !== allowedUid) {
    return jsonResponse(403, { ok: false, errorCode: 'forbidden', message: SAFE_MESSAGES.forbidden });
  }

  // 5. הרשאה אושרה — רק-עכשיו נבנה/מוחזר פלט (mock, לא-AI-אמיתי)
  return jsonResponse(200, { ok: true, advisorBrainOutput: mockAdvisorBrainOutput() });
}

if (typeof Deno !== 'undefined' && typeof Deno.serve === 'function') {
  Deno.serve((req: Request) => handleAdvisorRequest(req));
}
