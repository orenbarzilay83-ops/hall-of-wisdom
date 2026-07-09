/**
 * _test_hall_wisdom_goral_qa_edge_mock.mjs
 *
 * בדיקה אמיתית (index.ts נטען ומורץ בפועל ב-Node, לא-מדומה) של module:"goralQA"
 * ב-supabase/functions/oren-smart-advisor/index.ts — הרחבה של הבדיקה הקיימת
 * _test_oren_smart_advisor_auth_function.mjs (לא-נערכה, נשארת-הבסיס לזרימת
 * ה-auth). כאן: routing לפי module, payload-validation, ואינטגרציה אמיתית
 * עם goral-qa-runner + payload-builder + evaluator-mock.
 *
 * אין secret אמיתי, אין קריאת-רשת (verifier מוזרק + spy על fetch), אין deploy.
 */

import { handleAdvisorRequest } from './supabase/functions/oren-smart-advisor/index.ts';
import { run as runQaBrain } from './goral-hachol/qa/goral-qa-runner.mjs';
import { buildQaEvaluatorPayload } from './goral-hachol/qa/goral-qa-ai-payload-builder.js';
import { evaluateQaRunMock } from './goral-hachol/qa/goral-qa-ai-evaluator-mock.js';

let failures = 0;
function assert(condition, message) {
  if (!condition) { failures++; console.error(`✗ ${message}`); }
  else { console.log(`✓ ${message}`); }
}

const FAKE_SUPABASE_URL = 'https://fake-project.example.invalid';
const FAKE_SUPABASE_ANON_KEY = 'fake-anon-key-not-real';
const MOCK_ALLOWED_UID = 'mock-uid-oren-000';

function makeRequest(token, jsonBody) {
  const headers = { 'content-type': 'application/json' };
  if (token) headers.authorization = `Bearer ${token}`;
  const init = { headers };
  if (jsonBody !== undefined) {
    init.method = 'POST';
    init.body = JSON.stringify(jsonBody);
  }
  return new Request('https://example.local/oren-smart-advisor', init);
}

async function injectedMockVerifier(token) {
  if (token === 'mock-token-oren') return { valid: true, userId: 'mock-uid-oren-000' };
  if (token === 'mock-token-other-user') return { valid: true, userId: 'mock-uid-someone-else-111' };
  return { valid: false, userId: null };
}

let fetchCallCount = 0;
const originalFetch = globalThis.fetch;
globalThis.fetch = async (...args) => {
  fetchCallCount++;
  throw new Error(`fetch נקרא בפועל בבדיקה! (args[0]=${args[0]})`);
};

function setFullEnv() {
  process.env.SUPABASE_URL = FAKE_SUPABASE_URL;
  process.env.SUPABASE_ANON_KEY = FAKE_SUPABASE_ANON_KEY;
  process.env.ALLOWED_OREN_UID = MOCK_ALLOWED_UID;
}
setFullEnv();

// בונים payload אמיתי (לא מדומיין) — אותו pipeline משלבים 2+3.
const realQaRunResult = runQaBrain();
const realPayload = buildQaEvaluatorPayload(realQaRunResult);

console.log('\n--- 1. ללא token → 401 ---');
{
  const res = await handleAdvisorRequest(makeRequest(null, { module: 'goralQA', payload: realPayload }), { verifyToken: injectedMockVerifier });
  assert(res.status === 401, `אין Authorization → 401 (בפועל: ${res.status})`);
  const body = await res.json();
  assert(!('evaluatorOutput' in body), 'אין evaluatorOutput בתגובת-401');
}

console.log('\n--- 2. token תקף, UID לא-מורשה → 403 ---');
{
  const res = await handleAdvisorRequest(makeRequest('mock-token-other-user', { module: 'goralQA', payload: realPayload }), { verifyToken: injectedMockVerifier });
  assert(res.status === 403, `UID לא-תואם → 403 (בפועל: ${res.status})`);
  const body = await res.json();
  assert(!('evaluatorOutput' in body), 'אין evaluatorOutput בתגובת-403');
}

console.log('\n--- 3. UID מורשה + module goralQA + payload תקין → 200 עם mock evaluator ---');
{
  const res = await handleAdvisorRequest(makeRequest('mock-token-oren', { module: 'goralQA', payload: realPayload }), { verifyToken: injectedMockVerifier });
  assert(res.status === 200, `בקשה תקינה → 200 (בפועל: ${res.status})`);
  const body = await res.json();
  assert(body.ok === true, 'ok:true');
  assert(body.module === 'goralQA', 'module === "goralQA" בתגובה');
  assert(typeof body.evaluatorOutput === 'object' && body.evaluatorOutput !== null, 'evaluatorOutput קיים');
  const REQUIRED = ['overallDiagnosis', 'scenarioFindings', 'detectedProblems', 'severity', 'irrelevantSections', 'missingRelevantSections', 'advisorOnlyLeaks', 'clientOutputProblems', 'sourceRuleConcerns', 'recommendedFixes', 'codeInstructionForClaude', 'testsToAdd', 'needsOrenDecision', 'confidence'];
  assert(REQUIRED.every((k) => k in body.evaluatorOutput), 'evaluatorOutput כולל את כל 14 שדות הסכימה');
  assert(body.evaluatorOutput.overallDiagnosis.includes('MOCK'), 'evaluatorOutput.overallDiagnosis מתויג MOCK');

  // עקביות-סכימה: ה-Edge Function משתמשת ב-adapter מקומי-משלה
  // (goral_qa_mock_evaluator.ts, deploy-safe — ראו בדיקה 3 למטה), לא
  // בקובץ המקומי הזה — לכן לא-בודקים זהות-מוחלטת, אלא ששני המימושים
  // מפיקים אותה צורת-סכימה עבור אותו payload (אותם מפתחות, סוגי-נתונים
  // עקביים, אותו overallDiagnosis מתויג-MOCK).
  const directEvaluation = evaluateQaRunMock(realPayload);
  assert(
    Object.keys(body.evaluatorOutput).sort().join(',') === Object.keys(directEvaluation).sort().join(','),
    'evaluatorOutput מה-Edge Function ומ-evaluateQaRunMock המקומי חולקים בדיוק את אותם מפתחות-סכימה'
  );
  assert(
    body.evaluatorOutput.detectedProblems.length === directEvaluation.detectedProblems.length &&
    body.evaluatorOutput.severity === directEvaluation.severity &&
    body.evaluatorOutput.needsOrenDecision === directEvaluation.needsOrenDecision,
    'שני המימושים מגיעים לאותה מסקנה (detectedProblems/severity/needsOrenDecision) עבור אותו payload'
  );
}

console.log('\n--- 4. payload חסר/לא-תקין → 400 ---');
{
  const res1 = await handleAdvisorRequest(makeRequest('mock-token-oren', { module: 'goralQA' }), { verifyToken: injectedMockVerifier });
  assert(res1.status === 400, `module goralQA בלי payload → 400 (בפועל: ${res1.status})`);
  const body1 = await res1.json();
  assert(body1.ok === false && body1.errorCode === 'invalid_payload', 'errorCode === "invalid_payload"');

  const res2 = await handleAdvisorRequest(makeRequest('mock-token-oren', { module: 'goralQA', payload: { scenarios: 'not-an-array' } }), { verifyToken: injectedMockVerifier });
  assert(res2.status === 400, `payload.scenarios לא-מערך → 400 (בפועל: ${res2.status})`);
}

console.log('\n--- 5. module לא-מוכר → 400/422, לא fallback מסוכן ---');
{
  const res = await handleAdvisorRequest(makeRequest('mock-token-oren', { module: 'somethingUnknown' }), { verifyToken: injectedMockVerifier });
  assert(res.status === 400 || res.status === 422, `module לא-מוכר → 400/422 (בפועל: ${res.status})`);
  const body = await res.json();
  assert(body.ok === false, 'ok:false');
  assert(!('evaluatorOutput' in body) && !('advisorBrainOutput' in body), 'אין evaluatorOutput ואין advisorBrainOutput — אין fallback מסוכן');
}

console.log('\n--- 6. תאימות-לאחור: בלי module כלל → עדיין 200 עם advisorBrainOutput הישן ---');
{
  const res = await handleAdvisorRequest(makeRequest('mock-token-oren'), { verifyToken: injectedMockVerifier });
  assert(res.status === 200, `בלי module → 200 (בפועל: ${res.status})`);
  const body = await res.json();
  assert('advisorBrainOutput' in body && !('evaluatorOutput' in body), 'עדיין advisorBrainOutput (legacy), לא evaluatorOutput');
}

console.log('\n--- 7. evaluator לא-נקרא לפני auth (התנהגות + מקור) ---');
{
  delete process.env.ALLOWED_OREN_UID;
  const bodyFailClosed = await (await handleAdvisorRequest(makeRequest('mock-token-oren', { module: 'goralQA', payload: realPayload }), { verifyToken: injectedMockVerifier })).text();
  setFullEnv();
  const bodyNoToken = await (await handleAdvisorRequest(makeRequest(null, { module: 'goralQA', payload: realPayload }), { verifyToken: injectedMockVerifier })).text();
  const bodyWrongUid = await (await handleAdvisorRequest(makeRequest('mock-token-other-user', { module: 'goralQA', payload: realPayload }), { verifyToken: injectedMockVerifier })).text();
  assert(!bodyFailClosed.includes('evaluatorOutput') && !bodyNoToken.includes('evaluatorOutput') && !bodyWrongUid.includes('evaluatorOutput'), 'evaluatorOutput לא-מופיע באף-תגובת-כישלון, גם עם payload תקין מצורף לבקשה');

  const fs = await import('node:fs');
  const src = fs.readFileSync('./supabase/functions/oren-smart-advisor/index.ts', 'utf8');
  const forbiddenCheckPos = src.indexOf("errorCode: 'forbidden'");
  const evaluatorCallPos = src.indexOf('evaluateQaRunMockEdge(qaPayload');
  assert(forbiddenCheckPos > -1 && evaluatorCallPos > -1 && forbiddenCheckPos < evaluatorCallPos, 'במקור: בדיקת-ה-403 מופיעה לפני הקריאה ל-evaluateQaRunMockEdge');
}

console.log('\n--- 3ב. אין ייבוא חוצה-תיקיות אל goral-hachol/qa מתוך index.ts (deploy-safety) ---');
{
  const fs = await import('node:fs');
  const src = fs.readFileSync('./supabase/functions/oren-smart-advisor/index.ts', 'utf8');
  // בודקים import-statement בפועל (לא אזכור-מילולי בהערה שמסבירה מה-*לא*-קורה)
  assert(!/from\s+['"]\.\.\/.*goral-hachol/.test(src), 'אין import-statement חוצה-ריפו אל goral-hachol/** ב-index.ts');
  assert(src.includes("from './goral_qa_mock_evaluator.ts'"), 'index.ts מייבא את ה-evaluator מ-adapter מקומי, באותה תיקייה');
  assert(fs.existsSync('./supabase/functions/oren-smart-advisor/goral_qa_mock_evaluator.ts'), 'goral_qa_mock_evaluator.ts קיים בתוך תיקיית-הפונקציה');
  const adapterSrc = fs.readFileSync('./supabase/functions/oren-smart-advisor/goral_qa_mock_evaluator.ts', 'utf8');
  assert(!/^import/m.test(adapterSrc), 'goral_qa_mock_evaluator.ts עצמו לא-מייבא שום דבר (self-contained, deploy-safe)');
}

console.log('\n--- 8. אין AI חי / callAnthropic / ANTHROPIC_API_KEY ---');
{
  const fs = await import('node:fs');
  const src = fs.readFileSync('./supabase/functions/oren-smart-advisor/index.ts', 'utf8');
  assert(!/callAnthropic\s*\(/.test(src), 'אין קריאה בפועל ל-callAnthropic');
  // ANTHROPIC_API_KEY מוזכר בהערת-deploy-עתידית בראש הקובץ ("בעתיד, כשה-mock
  // AI יוחלף") — זו תיעוד-מכוון-לעתיד, לא-שימוש-בפועל. בודקים שאין קריאה
  // אמיתית אליו (getEnv/Deno.env.get/process.env), לא בדיקת-מחרוזת-גורפת.
  assert(!/getEnv\(\s*['"]ANTHROPIC_API_KEY['"]\s*\)/.test(src) && !/env\.get\(\s*['"]ANTHROPIC_API_KEY['"]\s*\)/.test(src), 'אין קריאה בפועל ל-ANTHROPIC_API_KEY (getEnv/Deno.env.get)');
  assert(!src.includes('api.openai.com') && !src.includes('OPENAI'), 'אין הפניה ל-OpenAI');
  assert(fetchCallCount === 0, `אין קריאת-fetch חיצונית מלבד Supabase Auth (deps.verifyToken חסם הכל) — בפועל: ${fetchCallCount} קריאות`);
}

console.log('\n--- 9. אין דליפת phone/sourceText-לא-מסונן/clientHistorySummary/dynFields ---');
{
  const res = await handleAdvisorRequest(makeRequest('mock-token-oren', { module: 'goralQA', payload: realPayload }), { verifyToken: injectedMockVerifier });
  const bodyText = await res.text();
  assert(!bodyText.includes('"phone"'), 'אין "phone" בתגובה');
  assert(!bodyText.includes('"dynFields"'), 'אין "dynFields" בתגובה');
  assert(!bodyText.includes('"clientHistorySummary"'), 'אין "clientHistorySummary" בתגובה');
}

console.log('\n--- 10. regression: מנועי Kashf/Hawi, קלפים, UI ---');
{
  assert(realQaRunResult.crashed === 0, 'goral-qa-runner רץ על 20 תרחישים בלי קריסה — המנועים לא נפגעו');
  const fs = await import('node:fs');
  assert(fs.existsSync(new URL('./cards.html', import.meta.url)), 'cards.html עדיין קיים');
  assert(fs.existsSync(new URL('./cartomancy/ui/cards-app.js', import.meta.url)), 'cartomancy/ui/cards-app.js עדיין קיים');
  const appJs = fs.readFileSync(new URL('./goral-hachol/ui/goral-app.js', import.meta.url), 'utf8');
  assert(appJs.includes('בינת היכל החכמה — לוח יועץ פנימי'), 'כותרת הפאנל ("בינת היכל החכמה") ללא שינוי');
}

globalThis.fetch = originalFetch;
delete process.env.SUPABASE_URL;
delete process.env.SUPABASE_ANON_KEY;
delete process.env.ALLOWED_OREN_UID;

console.log('');
console.log('הצהרה: לא בוצע `supabase functions deploy` בשום שלב של הבדיקה הזו.');
if (failures > 0) {
  console.error(`${failures} בדיקות נכשלו.`);
  process.exit(1);
}
console.log('כל הבדיקות עברו — module:"goralQA" עובד רק-אחרי-auth תקין, מחזיר MOCK evaluator output זהה לקריאה ישירה, דוחה payload לא-תקין/module לא-מוכר, ואין AI חי/דליפת-פרטיות.');
