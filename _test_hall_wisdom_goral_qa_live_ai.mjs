/**
 * _test_hall_wisdom_goral_qa_live_ai.mjs
 *
 * בדיקה אמיתית (index.ts נטען ומורץ בפועל ב-Node) של המסלול "live-ready"
 * ב-module:"goralQA" — HALL_WISDOM_GORAL_QA_LIVE_AI_INTEGRATION_PLAN.md,
 * מומש ב-HALL_WISDOM_GORAL_QA_LIVE_AI_READY_PRECOMMIT_REPORT.md.
 *
 * **אין שום קריאת-רשת אמיתית בבדיקה הזו** — globalThis.fetch מוחלף
 * לגמרי ב-mock מבוקר (fetchMockImpl, ניתן-להחלפה-לכל-תרחיש), ו-deps.verifyToken
 * מוזרק כמו בכל בדיקות ה-auth הקיימות. אין ANTHROPIC_API_KEY אמיתי —
 * FAKE_API_KEY מוגדר-במפורש-כמזויף. אין deploy.
 */

import { handleAdvisorRequest } from './supabase/functions/oren-smart-advisor/index.ts';
import { run as runQaBrain } from './goral-hachol/qa/goral-qa-runner.mjs';
import { buildQaEvaluatorPayload } from './goral-hachol/qa/goral-qa-ai-payload-builder.js';

let failures = 0;
function assert(condition, message) {
  if (!condition) { failures++; console.error(`✗ ${message}`); }
  else { console.log(`✓ ${message}`); }
}

const FAKE_SUPABASE_URL = 'https://fake-project.example.invalid';
const FAKE_SUPABASE_ANON_KEY = 'fake-anon-key-not-real';
const MOCK_ALLOWED_UID = 'mock-uid-oren-000';
const FAKE_API_KEY = 'fake-anthropic-key-not-real-sk-ant-00000';
const FAKE_MODEL = 'fake-claude-model-for-tests';

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

// fetch מבוקר — כל תרחיש-בדיקה קובע מה יקרה בקריאה-הבאה.
let fetchCallCount = 0;
let fetchMockImpl = async () => {
  throw new Error('fetch נקרא בתרחיש שלא-ציפה-לקריאת-רשת בכלל!');
};
const originalFetch = globalThis.fetch;
globalThis.fetch = async (...args) => {
  fetchCallCount++;
  return fetchMockImpl(...args);
};

function anthropicSuccessResponse(evaluatorOutputObj) {
  return {
    ok: true,
    status: 200,
    json: async () => ({ content: [{ type: 'text', text: JSON.stringify(evaluatorOutputObj) }] }),
  };
}
function anthropicHttpErrorResponse(status) {
  return { ok: false, status, json: async () => ({}) };
}
function anthropicNonJsonResponse() {
  return {
    ok: true,
    status: 200,
    json: async () => ({ content: [{ type: 'text', text: 'this is not valid JSON {{{' }] }),
  };
}

const VALID_EVALUATOR_OUTPUT = {
  overallDiagnosis: 'LIVE-TEST — הכל תקין.',
  scenarioFindings: [],
  detectedProblems: [],
  severity: 'low',
  irrelevantSections: [],
  missingRelevantSections: [],
  advisorOnlyLeaks: [],
  clientOutputProblems: [],
  sourceRuleConcerns: [],
  recommendedFixes: [],
  codeInstructionForClaude: { needed: false, instruction: '', filesToInspect: [], filesNotToTouch: [], testsToRun: [] },
  testsToAdd: [],
  needsOrenDecision: false,
  confidence: 'high',
};

function setFullEnv() {
  process.env.SUPABASE_URL = FAKE_SUPABASE_URL;
  process.env.SUPABASE_ANON_KEY = FAKE_SUPABASE_ANON_KEY;
  process.env.ALLOWED_OREN_UID = MOCK_ALLOWED_UID;
}
function clearLiveEnv() {
  delete process.env.HALL_WISDOM_AI_MODE;
  delete process.env.ANTHROPIC_API_KEY;
  delete process.env.ANTHROPIC_MODEL;
}
setFullEnv();
clearLiveEnv();

// payload אמיתי (לא מדומיין) — אותו pipeline משלבים 2+3.
const realQaRunResult = runQaBrain();
const realPayload = buildQaEvaluatorPayload(realQaRunResult);

console.log('\n--- 1. no token → 401 ---');
{
  const res = await handleAdvisorRequest(makeRequest(null, { module: 'goralQA', mode: 'live', payload: realPayload }), { verifyToken: injectedMockVerifier });
  assert(res.status === 401, `אין token → 401 (בפועל: ${res.status})`);
}

console.log('\n--- 2. wrong UID → 403 ---');
{
  const res = await handleAdvisorRequest(makeRequest('mock-token-other-user', { module: 'goralQA', mode: 'live', payload: realPayload }), { verifyToken: injectedMockVerifier });
  assert(res.status === 403, `UID לא-מורשה → 403 (בפועל: ${res.status})`);
}

console.log('\n--- 3. authorized + mode mock (ברירת-מחדל) → mock response ---');
{
  const before = fetchCallCount;
  const res = await handleAdvisorRequest(makeRequest('mock-token-oren', { module: 'goralQA', payload: realPayload }), { verifyToken: injectedMockVerifier });
  const body = await res.json();
  assert(res.status === 200 && body.evaluatorMode === 'mock' && !('liveModeUnavailableReason' in body), 'בלי mode:"live" בכלל → mock, בלי סיבה-להסביר');
  assert(fetchCallCount === before, 'לא בוצעה שום קריאת-fetch');
}

console.log('\n--- 4. body.mode:"live" אבל HALL_WISDOM_AI_MODE לא live → mock עם reason ---');
{
  clearLiveEnv();
  const before = fetchCallCount;
  const res = await handleAdvisorRequest(makeRequest('mock-token-oren', { module: 'goralQA', mode: 'live', payload: realPayload }), { verifyToken: injectedMockVerifier });
  const body = await res.json();
  assert(res.status === 200 && body.evaluatorMode === 'mock' && body.liveModeUnavailableReason === 'mode-not-live', `reason === "mode-not-live" (בפועל: ${body.liveModeUnavailableReason})`);
  assert(fetchCallCount === before, 'לא בוצעה שום קריאת-fetch (מתג-שרת חסם לפני כל ניסיון)');
}

console.log('\n--- 5. server live + request live אבל ANTHROPIC_API_KEY חסר → mock עם reason ---');
{
  process.env.HALL_WISDOM_AI_MODE = 'live';
  delete process.env.ANTHROPIC_API_KEY;
  const before = fetchCallCount;
  const res = await handleAdvisorRequest(makeRequest('mock-token-oren', { module: 'goralQA', mode: 'live', payload: realPayload }), { verifyToken: injectedMockVerifier });
  const body = await res.json();
  assert(res.status === 200 && body.evaluatorMode === 'mock' && body.liveModeUnavailableReason === 'missing-api-key', `reason === "missing-api-key" (בפועל: ${body.liveModeUnavailableReason})`);
  assert(fetchCallCount === before, 'לא בוצעה שום קריאת-fetch');
}

console.log('\n--- 5ב. server live + request live + API key אך ANTHROPIC_MODEL חסר → mock עם reason ---');
{
  process.env.ANTHROPIC_API_KEY = FAKE_API_KEY;
  delete process.env.ANTHROPIC_MODEL;
  const before = fetchCallCount;
  const res = await handleAdvisorRequest(makeRequest('mock-token-oren', { module: 'goralQA', mode: 'live', payload: realPayload }), { verifyToken: injectedMockVerifier });
  const body = await res.json();
  assert(res.status === 200 && body.evaluatorMode === 'mock' && body.liveModeUnavailableReason === 'missing-model', `reason === "missing-model" (בפועל: ${body.liveModeUnavailableReason})`);
  assert(fetchCallCount === before, 'לא בוצעה שום קריאת-fetch');
  process.env.ANTHROPIC_MODEL = FAKE_MODEL;
}

console.log('\n--- 6. payload עם phone/dynFields/clientHistorySummary → sanitization חוסמת live ---');
{
  const pollutedPayload = {
    ...realPayload,
    collectedOutputs: [
      { ...realPayload.collectedOutputs[0], phone: '050-0000000' },
      ...realPayload.collectedOutputs.slice(1),
    ],
  };
  const before = fetchCallCount;
  const res = await handleAdvisorRequest(makeRequest('mock-token-oren', { module: 'goralQA', mode: 'live', payload: pollutedPayload }), { verifyToken: injectedMockVerifier });
  const body = await res.json();
  assert(res.status === 200 && body.evaluatorMode === 'mock' && body.liveModeUnavailableReason === 'sanitization-failed', `reason === "sanitization-failed" (בפועל: ${body.liveModeUnavailableReason})`);
  assert(fetchCallCount === before, 'ה-AI לעולם לא-ראה את ה-payload המזוהם — 0 קריאות-fetch נוספות');
  const bodyText = JSON.stringify(body);
  assert(!bodyText.includes('050-0000000'), 'מספר-הטלפון עצמו לא-הודלף גם בתגובה');
}

console.log('\n--- 7. authorized + כל 5 התנאים + Anthropic מדומה מצליח → evaluatorMode:"live" ---');
{
  fetchMockImpl = async () => anthropicSuccessResponse(VALID_EVALUATOR_OUTPUT);
  const before = fetchCallCount;
  const res = await handleAdvisorRequest(makeRequest('mock-token-oren', { module: 'goralQA', mode: 'live', payload: realPayload }), { verifyToken: injectedMockVerifier });
  const body = await res.json();
  assert(res.status === 200, `200 (בפועל: ${res.status})`);
  assert(body.evaluatorMode === 'live', `evaluatorMode === "live" (בפועל: ${body.evaluatorMode})`);
  assert(!('liveModeUnavailableReason' in body), 'אין liveModeUnavailableReason כש-live הצליח');
  assert(body.evaluatorOutput.overallDiagnosis === VALID_EVALUATOR_OUTPUT.overallDiagnosis, 'evaluatorOutput הוא-בדיוק מה-ש-Anthropic-המדומה החזיר (JSON.parse תקין)');
  assert(fetchCallCount === before + 1, `בדיוק קריאת-fetch אחת בוצעה (ל-Anthropic המדומה) — בפועל: ${fetchCallCount - before}`);
}

console.log('\n--- 8. Anthropic מחזיר שגיאה (500 מדומה) → fallback mock, בלי דליפת-secret ---');
{
  fetchMockImpl = async () => anthropicHttpErrorResponse(500);
  const res = await handleAdvisorRequest(makeRequest('mock-token-oren', { module: 'goralQA', mode: 'live', payload: realPayload }), { verifyToken: injectedMockVerifier });
  const body = await res.json();
  assert(res.status === 200 && body.evaluatorMode === 'mock' && body.liveModeUnavailableReason === 'anthropic-error', `reason === "anthropic-error" (בפועל: ${body.liveModeUnavailableReason})`);
  const bodyText = JSON.stringify(body);
  assert(!bodyText.includes(FAKE_API_KEY), 'המפתח-המזויף לא-מופיע בתגובה בשום מקום');
}

console.log('\n--- 9. Anthropic מחזיר טקסט לא-JSON → fallback mock, לא-מחזיר טקסט גולמי ---');
{
  fetchMockImpl = async () => anthropicNonJsonResponse();
  const res = await handleAdvisorRequest(makeRequest('mock-token-oren', { module: 'goralQA', mode: 'live', payload: realPayload }), { verifyToken: injectedMockVerifier });
  const body = await res.json();
  assert(res.status === 200 && body.evaluatorMode === 'mock' && body.liveModeUnavailableReason === 'anthropic-error', `reason === "anthropic-error" גם-עבור-JSON-לא-תקין (בפועל: ${body.liveModeUnavailableReason})`);
  const bodyText = JSON.stringify(body);
  assert(!bodyText.includes('this is not valid JSON'), 'הטקסט-הגולמי-הלא-תקין מ-Anthropic לא-הודלף לתגובה');
}

console.log('\n--- 10. אין AI/fetch לפני auth תקין (גם עם mode:"live" מלא + payload תקין) ---');
{
  fetchMockImpl = async () => anthropicSuccessResponse(VALID_EVALUATOR_OUTPUT);
  const beforeUnauth = fetchCallCount;
  const r401 = await handleAdvisorRequest(makeRequest(null, { module: 'goralQA', mode: 'live', payload: realPayload }), { verifyToken: injectedMockVerifier });
  const r403 = await handleAdvisorRequest(makeRequest('mock-token-other-user', { module: 'goralQA', mode: 'live', payload: realPayload }), { verifyToken: injectedMockVerifier });
  assert(fetchCallCount === beforeUnauth, `0 קריאות-fetch נוספות ב-401/403, גם כש-mode:"live" ומפתח-מוגדר (בפועל: ${fetchCallCount - beforeUnauth})`);
  assert(!(await r401.text()).includes('evaluatorOutput') && !(await r403.text()).includes('evaluatorOutput'), 'אין evaluatorOutput בתגובות-401/403');

  const fs = await import('node:fs');
  const src = fs.readFileSync('./supabase/functions/oren-smart-advisor/index.ts', 'utf8');
  const forbiddenPos = src.indexOf("errorCode: 'forbidden'");
  const callAnthropicPos = src.indexOf('callAnthropicEdge({');
  assert(forbiddenPos > -1 && callAnthropicPos > -1 && forbiddenPos < callAnthropicPos, 'במקור: בדיקת-403 מופיעה לפני הקריאה ל-callAnthropicEdge');
}

console.log('\n--- 11. אין imports חוצה-תיקיות משום קובץ Edge חדש ---');
{
  const fs = await import('node:fs');
  const files = [
    './supabase/functions/oren-smart-advisor/index.ts',
    './supabase/functions/oren-smart-advisor/anthropic-provider-edge.ts',
    './supabase/functions/oren-smart-advisor/goral-qa-evaluator-prompt.ts',
    './supabase/functions/oren-smart-advisor/goral_qa_payload_sanitizer.ts',
  ];
  for (const f of files) {
    const src = fs.readFileSync(f, 'utf8');
    assert(!/from\s+['"]\.\.\//.test(src), `${f}: אין שום import חוצה-תיקיות (../)`);
  }
}

console.log('\n--- 12. regression: מנועי Kashf/Hawi, קלפים, UI ---');
{
  assert(realQaRunResult.crashed === 0, 'goral-qa-runner רץ על 20 תרחישים בלי קריסה');
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
clearLiveEnv();

console.log('');
console.log('הצהרה: לא בוצע `supabase functions deploy` בשום שלב. לא נוסף ANTHROPIC_API_KEY אמיתי. לא בוצעה קריאת-רשת אמיתית ל-Anthropic — כל ה-fetch מוחלף ב-mock מבוקר.');
if (failures > 0) {
  console.error(`${failures} בדיקות נכשלו.`);
  process.exit(1);
}
console.log('כל הבדיקות עברו — module:"goralQA" live-ready עובד רק אחרי auth+5 תנאים, נופל-חזרה-ל-mock עם reason ברור בכל כשל, מסנן payload מזוהם לפני AI, ולא-מדליף secrets/טקסט-גולמי.');
