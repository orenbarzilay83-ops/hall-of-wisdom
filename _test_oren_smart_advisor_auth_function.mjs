/**
 * _test_oren_smart_advisor_auth_function.mjs
 *
 * בדיקה אמיתית (לא-mock-של-הבדיקה-עצמה) של
 * supabase/functions/oren-smart-advisor/index.ts — הקובץ נטען-ומורץ-בפועל
 * ב-Node (Node 22+, עם type-stripping ל-TypeScript זמין; אומת שעובד גם
 * בלי דגל מיוחד בסביבה הזו — אם Node ישן-יותר, יש להריץ עם
 * `node --experimental-strip-types`). `Deno` אינו מוגדר ב-Node — הקובץ
 * מטפל בזה בעצמו (typeof-guards), כך שאין-קריסה ואין-הפעלת-שרת-אמיתי.
 *
 * משתמש ב-Request/Response הגלובליים של Node (fetch API standard) —
 * אותם-אובייקטים-בדיוק שה-handler מקבל/מחזיר ב-Deno האמיתי.
 *
 * אין קריאת-רשת. אין secret אמיתי (ALLOWED_OREN_UID למטה הוא מחרוזת-מזויפת
 * שנקבעת/נמחקת ידנית בתוך הבדיקה, לא UID-אמיתי-של-אף-אחד). אין deploy.
 */

import { handleAdvisorRequest } from './supabase/functions/oren-smart-advisor/index.ts';

let failures = 0;
function assert(condition, message) {
  if (!condition) { failures++; console.error(`✗ ${message}`); }
  else { console.log(`✓ ${message}`); }
}

const REQUIRED_KEYS = ['module', 'advisorDiagnosis', 'clientAnswerDraft', 'engineCritique', 'missingKnowledgeOrRules', 'recommendedFix', 'codeInstructionForClaude', 'safetyNotes', 'privacyBlockedFields', 'nextBestAction', 'confidence', 'needsOrenDecision'];
const MOCK_ALLOWED_UID = 'mock-uid-oren-000'; // ⚠ מחרוזת-מזויפת-בלבד — לא UID אמיתי

function makeRequest(token) {
  const headers = {};
  if (token) headers.authorization = `Bearer ${token}`;
  return new Request('https://example.local/oren-smart-advisor', { headers });
}

// שמירת מצב-סביבה מקורי, כדי לא-להשפיע על שאר-התהליך
const originalEnvValue = process.env.ALLOWED_OREN_UID;
function clearAllowedUid() { delete process.env.ALLOWED_OREN_UID; }
function setAllowedUid(v) { process.env.ALLOWED_OREN_UID = v; }

// ── 1. no token → 401 ───────────────────────────────────────────────────
console.log('\n--- 1. no token ---');
{
  setAllowedUid(MOCK_ALLOWED_UID);
  const res = handleAdvisorRequest(makeRequest(null));
  assert(res.status === 401, `אין Authorization header → 401 (בפועל: ${res.status})`);
  const body = await res.json();
  assert(body.ok === false, 'ok:false');
  assert(body.errorCode === 'unauthenticated', 'errorCode === "unauthenticated"');
  assert(!('advisorBrainOutput' in body), 'התגובה לא-כוללת advisorBrainOutput');
}

// ── 2. invalid token → 401 ──────────────────────────────────────────────
console.log('\n--- 2. invalid token ---');
{
  const res = handleAdvisorRequest(makeRequest('this-is-not-a-real-token'));
  assert(res.status === 401, `טוקן לא-תקף → 401 (בפועל: ${res.status})`);
  const body = await res.json();
  assert(body.ok === false, 'ok:false');
  assert(!('advisorBrainOutput' in body), 'התגובה לא-כוללת advisorBrainOutput');
}

// ── 3. missing ALLOWED_OREN_UID → fail closed ───────────────────────────
console.log('\n--- 3. ALLOWED_OREN_UID חסר בסביבה ---');
{
  clearAllowedUid();
  const res = handleAdvisorRequest(makeRequest('mock-token-oren')); // טוקן-תקף, אבל אין-עם-מה-להשוות
  assert(res.status === 503, `ALLOWED_OREN_UID חסר → 503, לא allowed (בפועל: ${res.status})`);
  const body = await res.json();
  assert(body.ok === false, 'ok:false — fail closed, לא נפתח-בטעות');
  assert(body.errorCode === 'server_misconfigured', 'errorCode === "server_misconfigured"');
  assert(!('advisorBrainOutput' in body), 'התגובה לא-כוללת advisorBrainOutput גם-במצב-fail-closed');
  setAllowedUid(MOCK_ALLOWED_UID); // משחזרים לשאר הבדיקות
}

// ── 4. valid token but wrong UID → 403 ──────────────────────────────────
console.log('\n--- 4. token תקף, UID לא-תואם ---');
{
  const res = handleAdvisorRequest(makeRequest('mock-token-other-user'));
  assert(res.status === 403, `UID לא-תואם → 403 (בפועל: ${res.status})`);
  const body = await res.json();
  assert(body.ok === false, 'ok:false');
  assert(body.errorCode === 'forbidden', 'errorCode === "forbidden"');
  assert(!('advisorBrainOutput' in body), 'התגובה לא-כוללת advisorBrainOutput');
}

// ── 5+6. valid token + allowed UID → 200, כולל 12 המפתחות ──────────────
console.log('\n--- 5+6. token תקף, UID תואם ---');
{
  const res = handleAdvisorRequest(makeRequest('mock-token-oren'));
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
  clearAllowedUid();
  const r503 = await handleAdvisorRequest(makeRequest('mock-token-oren')).json();
  setAllowedUid(MOCK_ALLOWED_UID);
  const r401 = await handleAdvisorRequest(makeRequest(null)).json();
  const r403 = await handleAdvisorRequest(makeRequest('mock-token-other-user')).json();
  assert(!('advisorBrainOutput' in r503) && !('advisorBrainOutput' in r401) && !('advisorBrainOutput' in r403), '401/403/503 — אף אחת לא-כוללת advisorBrainOutput');
}

// ── 8. אין קריאת-AI/mock-AI לפני auth success ───────────────────────────
console.log('\n--- 8. אין AI-output לפני הרשאה ---');
{
  // אם ה-mock-AI-output היה נקרא לפני-בדיקת-ההרשאה, סימן-ההיכר שלו
  // ("MOCK — אין קריאת-AI") היה מופיע גם בתגובות-שנכשלות. הוא לא-מופיע —
  // מוכיח שהקריאה-ל-mockAdvisorBrainOutput() קורית רק בענף ה-200.
  clearAllowedUid();
  const bodyFailClosed = await handleAdvisorRequest(makeRequest('mock-token-oren')).text();
  setAllowedUid(MOCK_ALLOWED_UID);
  const bodyNoToken = await handleAdvisorRequest(makeRequest(null)).text();
  const bodyWrongUid = await handleAdvisorRequest(makeRequest('mock-token-other-user')).text();
  assert(!bodyFailClosed.includes('MOCK — אין קריאת-AI') && !bodyNoToken.includes('MOCK — אין קריאת-AI') && !bodyWrongUid.includes('MOCK — אין קריאת-AI'), 'סימן-ה-mock-AI-output לא-מופיע באף-תגובת-כישלון — האבחון-מריץ רק אחרי success');

  // בדיקת-מקור נוספת: קריאת index.ts כטקסט ואימות שסדר-הקוד (לא רק-הריצה)
  // שם את 4 בדיקות-ההרשאה לפני קריאת mockAdvisorBrainOutput()
  const fs = await import('node:fs');
  const src = fs.readFileSync('./supabase/functions/oren-smart-advisor/index.ts', 'utf8');
  const authCheckPos = src.indexOf("errorCode: 'forbidden'");
  const aiCallPos = src.indexOf('advisorBrainOutput: mockAdvisorBrainOutput()'); // קריאת-הפונקציה בפועל, לא ה-declaration שלה
  assert(authCheckPos > -1 && aiCallPos > -1 && authCheckPos < aiCallPos, 'גם-במקור: בדיקת-ה-403 מופיעה בקוד לפני הקריאה בפועל ל-mockAdvisorBrainOutput()');
}

// ── 9. אין secret אמיתי בקוד ─────────────────────────────────────────────
console.log('\n--- 9. אין secret אמיתי בקוד ---');
{
  const fs = await import('node:fs');
  const src = fs.readFileSync('./supabase/functions/oren-smart-advisor/index.ts', 'utf8');
  assert(!/sk-ant-[a-zA-Z0-9-]+/.test(src), 'אין מחרוזת שנראית כמו מפתח-Anthropic אמיתי');
  assert(!src.includes('api.anthropic.com'), 'אין קריאה כלשהי ל-Anthropic API (אין AI חי בכלל בקובץ הזה)');
  assert(src.includes("getEnv('ALLOWED_OREN_UID')"), 'ALLOWED_OREN_UID נקרא רק דרך getEnv (Deno.env/process.env), לא מוגדר כערך-קבוע');
  assert(!/ALLOWED_OREN_UID\s*=\s*['"][^'"]+['"]/.test(src.replace("getEnv('ALLOWED_OREN_UID')", '')), 'אין השמה של ערך-מחרוזת-קבוע ל-ALLOWED_OREN_UID בקוד');
}

// ── 10. אין deploy ───────────────────────────────────────────────────────
console.log('\n--- 10. אין deploy ---');
console.log('✓ (הצהרתי, לא-נבדק-בקוד): לא בוצע `supabase functions deploy` בשום שלב של הבדיקה הזו — ראו OREN_SMART_ADVISOR_AUTH_FUNCTION_PRECOMMIT_REPORT.md.');

// שחזור מצב-סביבה מקורי
if (originalEnvValue === undefined) clearAllowedUid(); else setAllowedUid(originalEnvValue);

console.log('');
if (failures > 0) {
  console.error(`${failures} בדיקות נכשלו.`);
  process.exit(1);
}
console.log('כל הבדיקות עברו. index.ts נטען ומורץ בפועל ב-Node (לא-מדומה): 401/403/503-fail-closed/200 כולם תקינים, advisorBrainOutput מלא-רק-במצב-allowed, אין AI-output לפני-הרשאה, אין secret אמיתי בקוד.');
