/**
 * _test_oren_smart_advisor_auth_function.mjs
 *
 * בדיקה אמיתית (לא-mock-של-הבדיקה-עצמה) של
 * supabase/functions/oren-smart-advisor/index.ts — הקובץ נטען-ומורץ-בפועל
 * ב-Node (Node 22+, type-stripping ל-TypeScript זמין כברירת-מחדל בסביבה
 * הזו; אם Node ישן-יותר, יש להריץ עם `node --experimental-strip-types`).
 * `Deno` אינו מוגדר ב-Node — הקובץ מטפל בזה בעצמו (typeof-guards).
 *
 * מסלול-האימות-הראשי ב-index.ts הוא עכשיו verifyTokenWithSupabase — קריאה
 * אמיתית ל-Supabase Auth REST API. **הבדיקה הזו לא-קוראת-לרשת בכלל** —
 * מזריקה verifier מדומה דרך `deps.verifyToken` (dependency-injection
 * שה-handler עצמו תומך-בה), ומוודאת בנוסף שה-fetch הגלובלי אף-פעם לא-נקרא
 * (spy על globalThis.fetch, זורק אם-מנסים-להשתמש-בו).
 *
 * אין secret אמיתי. SUPABASE_URL/SUPABASE_ANON_KEY/ALLOWED_OREN_UID
 * למטה הם ערכים-מזויפים-במפורש (fake-...) שנקבעים/נמחקים ידנית בתוך
 * הבדיקה, לא-ערכים-אמיתיים-של-אף-אחד. אין deploy.
 */

import { handleAdvisorRequest } from './supabase/functions/oren-smart-advisor/index.ts';

let failures = 0;
function assert(condition, message) {
  if (!condition) { failures++; console.error(`✗ ${message}`); }
  else { console.log(`✓ ${message}`); }
}

const REQUIRED_KEYS = ['module', 'advisorDiagnosis', 'clientAnswerDraft', 'engineCritique', 'missingKnowledgeOrRules', 'recommendedFix', 'codeInstructionForClaude', 'safetyNotes', 'privacyBlockedFields', 'nextBestAction', 'confidence', 'needsOrenDecision'];

// ⚠ ערכים-מזויפים-במפורש — לא Supabase-project אמיתי, לא UID-אמיתי.
const FAKE_SUPABASE_URL = 'https://fake-project.example.invalid';
const FAKE_SUPABASE_ANON_KEY = 'fake-anon-key-not-real';
const MOCK_ALLOWED_UID = 'mock-uid-oren-000';

function makeRequest(token) {
  const headers = {};
  if (token) headers.authorization = `Bearer ${token}`;
  return new Request('https://example.local/oren-smart-advisor', { headers });
}

// verifier-מוזרק, זהה-בהתנהגותו-לגרסה-הישנה, אך עכשיו כ-dependency מפורשת —
// לעולם לא-קורא לרשת.
async function injectedMockVerifier(token) {
  if (token === 'mock-token-oren') return { valid: true, userId: 'mock-uid-oren-000' };
  if (token === 'mock-token-other-user') return { valid: true, userId: 'mock-uid-someone-else-111' };
  return { valid: false, userId: null };
}

// spy: אם משהו-בטעות-קורא ל-fetch האמיתי (למשל אם deps.verifyToken
// לא-הועבר כראוי ונפלנו-חזרה ל-verifyTokenWithSupabase האמיתי) — הבדיקה
// חייבת-להיכשל-בקול-רם, לא-לנסות-קריאת-רשת-אמיתית בשקט.
let fetchCallCount = 0;
const originalFetch = globalThis.fetch;
globalThis.fetch = async (...args) => {
  fetchCallCount++;
  throw new Error(`fetch נקרא בפועל בבדיקה! (קריאה #${fetchCallCount}, args[0]=${args[0]}) — זו-בדיקה-מקומית, אסור-שתהיה-קריאת-רשת.`);
};

// שמירת מצב-סביבה מקורי
const originalEnv = {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  ALLOWED_OREN_UID: process.env.ALLOWED_OREN_UID,
};
function setFullEnv() {
  process.env.SUPABASE_URL = FAKE_SUPABASE_URL;
  process.env.SUPABASE_ANON_KEY = FAKE_SUPABASE_ANON_KEY;
  process.env.ALLOWED_OREN_UID = MOCK_ALLOWED_UID;
}

// ── 1. no token → 401 ───────────────────────────────────────────────────
console.log('\n--- 1. no token ---');
{
  setFullEnv();
  const res = await handleAdvisorRequest(makeRequest(null), { verifyToken: injectedMockVerifier });
  assert(res.status === 401, `אין Authorization header → 401 (בפועל: ${res.status})`);
  const body = await res.json();
  assert(body.ok === false, 'ok:false');
  assert(body.errorCode === 'unauthenticated', 'errorCode === "unauthenticated"');
  assert(!('advisorBrainOutput' in body), 'התגובה לא-כוללת advisorBrainOutput');
}

// ── 2. invalid token → 401 ──────────────────────────────────────────────
console.log('\n--- 2. invalid token ---');
{
  const res = await handleAdvisorRequest(makeRequest('this-is-not-a-real-token'), { verifyToken: injectedMockVerifier });
  assert(res.status === 401, `טוקן לא-תקף → 401 (בפועל: ${res.status})`);
  const body = await res.json();
  assert(body.ok === false, 'ok:false');
  assert(!('advisorBrainOutput' in body), 'התגובה לא-כוללת advisorBrainOutput');
}

// ── 3. missing ALLOWED_OREN_UID → fail closed ───────────────────────────
console.log('\n--- 3. ALLOWED_OREN_UID חסר בסביבה ---');
{
  delete process.env.ALLOWED_OREN_UID;
  const res = await handleAdvisorRequest(makeRequest('mock-token-oren'), { verifyToken: injectedMockVerifier });
  assert(res.status === 503, `ALLOWED_OREN_UID חסר → 503, לא allowed (בפועל: ${res.status})`);
  const body = await res.json();
  assert(body.ok === false, 'ok:false — fail closed');
  assert(body.errorCode === 'server_misconfigured', 'errorCode === "server_misconfigured"');
  assert(!('advisorBrainOutput' in body), 'התגובה לא-כוללת advisorBrainOutput');
  process.env.ALLOWED_OREN_UID = MOCK_ALLOWED_UID;
}

// ── 3ב. missing Supabase env (SUPABASE_URL/ANON_KEY) → fail closed ──────
console.log('\n--- 3ב. SUPABASE_URL/SUPABASE_ANON_KEY חסרים ---');
{
  delete process.env.SUPABASE_URL;
  const res1 = await handleAdvisorRequest(makeRequest('mock-token-oren'), { verifyToken: injectedMockVerifier });
  assert(res1.status === 503, `SUPABASE_URL חסר → 503 (בפועל: ${res1.status})`);
  const body1 = await res1.json();
  assert(body1.ok === false && !('advisorBrainOutput' in body1), 'ok:false, אין advisorBrainOutput כש-SUPABASE_URL חסר');
  process.env.SUPABASE_URL = FAKE_SUPABASE_URL;

  delete process.env.SUPABASE_ANON_KEY;
  const res2 = await handleAdvisorRequest(makeRequest('mock-token-oren'), { verifyToken: injectedMockVerifier });
  assert(res2.status === 503, `SUPABASE_ANON_KEY חסר → 503 (בפועל: ${res2.status})`);
  process.env.SUPABASE_ANON_KEY = FAKE_SUPABASE_ANON_KEY;
}

// ── 4. valid token but wrong UID → 403 ──────────────────────────────────
console.log('\n--- 4. token תקף, UID לא-תואם ---');
{
  const res = await handleAdvisorRequest(makeRequest('mock-token-other-user'), { verifyToken: injectedMockVerifier });
  assert(res.status === 403, `UID לא-תואם → 403 (בפועל: ${res.status})`);
  const body = await res.json();
  assert(body.ok === false, 'ok:false');
  assert(body.errorCode === 'forbidden', 'errorCode === "forbidden"');
  assert(!('advisorBrainOutput' in body), 'התגובה לא-כוללת advisorBrainOutput');
}

// ── 5+6. valid token + allowed UID → 200, כולל 12 המפתחות ──────────────
console.log('\n--- 5+6. token תקף, UID תואם ---');
{
  const res = await handleAdvisorRequest(makeRequest('mock-token-oren'), { verifyToken: injectedMockVerifier });
  assert(res.status === 200, `UID תואם → 200 (בפועל: ${res.status})`);
  const body = await res.json();
  assert(body.ok === true, 'ok:true');
  assert(typeof body.advisorBrainOutput === 'object' && body.advisorBrainOutput !== null, 'advisorBrainOutput קיים');
  const hasAllKeys = REQUIRED_KEYS.every((k) => k in body.advisorBrainOutput);
  assert(hasAllKeys, `advisorBrainOutput כולל את כל 12 המפתחות (חסרים: ${REQUIRED_KEYS.filter((k) => !(k in body.advisorBrainOutput)).join(',') || 'none'})`);
}

// ── 7. unauthorized responses לא-כוללות advisorBrainOutput (סיכום-חוזר) ─
console.log('\n--- 7. אין advisorBrainOutput בתגובות-לא-מורשות ---');
{
  delete process.env.ALLOWED_OREN_UID;
  const r503 = await (await handleAdvisorRequest(makeRequest('mock-token-oren'), { verifyToken: injectedMockVerifier })).json();
  process.env.ALLOWED_OREN_UID = MOCK_ALLOWED_UID;
  const r401 = await (await handleAdvisorRequest(makeRequest(null), { verifyToken: injectedMockVerifier })).json();
  const r403 = await (await handleAdvisorRequest(makeRequest('mock-token-other-user'), { verifyToken: injectedMockVerifier })).json();
  assert(!('advisorBrainOutput' in r503) && !('advisorBrainOutput' in r401) && !('advisorBrainOutput' in r403), '401/403/503 — אף אחת לא-כוללת advisorBrainOutput');
}

// ── 8. אין קריאת-AI/mock-AI לפני auth success ───────────────────────────
console.log('\n--- 8. אין AI-output לפני הרשאה ---');
{
  delete process.env.ALLOWED_OREN_UID;
  const bodyFailClosed = await (await handleAdvisorRequest(makeRequest('mock-token-oren'), { verifyToken: injectedMockVerifier })).text();
  process.env.ALLOWED_OREN_UID = MOCK_ALLOWED_UID;
  const bodyNoToken = await (await handleAdvisorRequest(makeRequest(null), { verifyToken: injectedMockVerifier })).text();
  const bodyWrongUid = await (await handleAdvisorRequest(makeRequest('mock-token-other-user'), { verifyToken: injectedMockVerifier })).text();
  assert(!bodyFailClosed.includes('MOCK — אין קריאת-AI') && !bodyNoToken.includes('MOCK — אין קריאת-AI') && !bodyWrongUid.includes('MOCK — אין קריאת-AI'), 'סימן-ה-mock-AI-output לא-מופיע באף-תגובת-כישלון');

  const fs = await import('node:fs');
  const src = fs.readFileSync('./supabase/functions/oren-smart-advisor/index.ts', 'utf8');
  const forbiddenCheckPos = src.indexOf("errorCode: 'forbidden'");
  const aiCallPos = src.indexOf('advisorBrainOutput: mockAdvisorBrainOutput()');
  assert(forbiddenCheckPos > -1 && aiCallPos > -1 && forbiddenCheckPos < aiCallPos, 'גם-במקור: בדיקת-ה-403 מופיעה בקוד לפני הקריאה בפועל ל-mockAdvisorBrainOutput()');
}

// ── 9. אין secret אמיתי בקוד; mockVerifyToken (הישן) הוסר לגמרי ─────────
console.log('\n--- 9. אין secret אמיתי בקוד + mockVerifyToken לא-קיים-יותר ---');
{
  const fs = await import('node:fs');
  const src = fs.readFileSync('./supabase/functions/oren-smart-advisor/index.ts', 'utf8');
  assert(!/sk-ant-[a-zA-Z0-9-]+/.test(src), 'אין מחרוזת שנראית כמו מפתח-Anthropic אמיתי');
  assert(!src.includes('api.anthropic.com'), 'אין קריאה כלשהי ל-Anthropic API');
  assert(src.includes("getEnv('ALLOWED_OREN_UID')"), 'ALLOWED_OREN_UID נקרא רק דרך getEnv, לא מוגדר כערך-קבוע');
  assert(!/ALLOWED_OREN_UID\s*=\s*['"][^'"]+['"]/.test(src.replace("getEnv('ALLOWED_OREN_UID')", '')), 'אין השמה של ערך-מחרוזת-קבוע ל-ALLOWED_OREN_UID בקוד');
  assert(src.includes('verifyTokenWithSupabase'), 'קיים מסלול-אימות אמיתי בשם verifyTokenWithSupabase');
  assert(!src.includes('function mockVerifyToken'), 'mockVerifyToken (הישן) הוסר — אינו-קיים-יותר בקוד הראשי');
  assert(src.includes('/auth/v1/user'), 'verifyTokenWithSupabase קורא ל-Supabase Auth REST endpoint האמיתי');
}

// ── 10. אין קריאת-רשת אמיתית בכל הבדיקה ─────────────────────────────────
console.log('\n--- 10. אין קריאת-רשת אמיתית ---');
assert(fetchCallCount === 0, `fetch הגלובלי לא-נקרא אף-פעם לאורך כל הבדיקה (בפועל: ${fetchCallCount} קריאות) — מוכיח ש-deps.verifyToken אכן-חסם כל-נסיון-קריאת-רשת`);

// שחזור מצב מקורי
globalThis.fetch = originalFetch;
for (const [k, v] of Object.entries(originalEnv)) {
  if (v === undefined) delete process.env[k]; else process.env[k] = v;
}

console.log('');
console.log('הצהרה: לא בוצע `supabase functions deploy` בשום שלב של הבדיקה הזו.');
if (failures > 0) {
  console.error(`${failures} בדיקות נכשלו.`);
  process.exit(1);
}
console.log('כל הבדיקות עברו. index.ts נטען ומורץ בפועל ב-Node (לא-מדומה): מסלול-האימות-הראשי הוא verifyTokenWithSupabase (Supabase Auth אמיתי), הבדיקות מזריקות verifier מדומה ולא-קוראות-לרשת בכלל (מאומת: 0 קריאות-fetch), 401/403/503-fail-closed/200 כולם תקינים, advisorBrainOutput מלא-רק-במצב-allowed, אין AI-output לפני-הרשאה, אין secret אמיתי בקוד.');
