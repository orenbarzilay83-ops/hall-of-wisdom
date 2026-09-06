/**
 * _test_oren_smart_advisor_kashf_reading_payload.mjs
 *
 * בדיקה אמיתית (לא-mock-של-הבדיקה-עצמה) של ההרחבה ל-module:"kashf" ב-
 * supabase/functions/oren-smart-advisor/index.ts — קבלת AI Context Package
 * אמיתי (payloadVersion/domain/method/questionType/primaryIntent/
 * readingStrategy/readingPlan/decisionSummary/readingContext) וניתובו
 * דרך שער-5-התנאים (mode==='live' + HALL_WISDOM_AI_MODE==='live' +
 * ANTHROPIC_API_KEY + ANTHROPIC_MODEL + סניטציה) — בדיוק כמו module:"goralQA".
 * כולל: AI Invocation Log (ללא chain-of-thought).
 *
 * הקובץ נטען-ומורץ-בפועל ב-Node (Node 22+ type-stripping). deps.verifyToken
 * מזריק verifier מדומה — אין קריאת-רשת. globalThis.fetch מוחלף בspy שזורק
 * אם-נקרא (מוכיח: כשאין-כל-4-התנאים, callAnthropicEdge אף-פעם-לא-נקרא).
 *
 * אין secret אמיתי. אין deploy. אין UI.
 */

import { handleAdvisorRequest } from './supabase/functions/oren-smart-advisor/index.ts';

let failures = 0;
function assert(condition, message) {
  if (!condition) { failures++; console.error(`✗ ${message}`); }
  else { console.log(`✓ ${message}`); }
}

const FAKE_SUPABASE_URL = 'https://fake-project.example.invalid';
const FAKE_SUPABASE_ANON_KEY = 'fake-anon-key-not-real';
const MOCK_ALLOWED_UID = 'mock-uid-oren-000';

async function injectedMockVerifier(token) {
  if (token === 'mock-token-oren') return { valid: true, userId: 'mock-uid-oren-000' };
  return { valid: false, userId: null };
}

let fetchCallCount = 0;
const originalFetch = globalThis.fetch;
globalThis.fetch = async (...args) => {
  fetchCallCount++;
  throw new Error(`fetch נקרא בפועל בבדיקה! (קריאה #${fetchCallCount}, args[0]=${args[0]}) — אסור בבדיקה מקומית.`);
};

// spy על console.log — לתפיסת AI Invocation Log entries, בלי-לבטל-הדפסה-רגילה.
const originalConsoleLog = console.log;
const capturedLogLines = [];
console.log = (...args) => {
  capturedLogLines.push(args);
  originalConsoleLog(...args);
};

const originalEnv = {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  ALLOWED_OREN_UID: process.env.ALLOWED_OREN_UID,
  HALL_WISDOM_AI_MODE: process.env.HALL_WISDOM_AI_MODE,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  ANTHROPIC_MODEL: process.env.ANTHROPIC_MODEL,
};
function setBaseEnv() {
  process.env.SUPABASE_URL = FAKE_SUPABASE_URL;
  process.env.SUPABASE_ANON_KEY = FAKE_SUPABASE_ANON_KEY;
  process.env.ALLOWED_OREN_UID = MOCK_ALLOWED_UID;
  delete process.env.HALL_WISDOM_AI_MODE;
  delete process.env.ANTHROPIC_API_KEY;
  delete process.env.ANTHROPIC_MODEL;
}

function makeRequest(bodyObj) {
  return new Request('https://example.local/oren-smart-advisor', {
    method: 'POST',
    headers: { authorization: 'Bearer mock-token-oren', 'content-type': 'application/json' },
    body: bodyObj === undefined ? undefined : JSON.stringify(bodyObj),
  });
}

// AI Context Package אמיתי — מעטפה גנרית + readingContext ספציפי-ל-Domain.
const REAL_CONTEXT_PACKAGE = {
  payloadVersion: 'ai-context-package-v1',
  readingId: 'reading-test-001',
  domain: 'reading.goralHachol',
  method: 'kashf',
  questionType: 'yesNo',
  primaryIntent: 'outcomeCompletion',
  readingStrategy: { strategyId: 'strategy-test', goal: 'test' },
  readingPlan: { planId: 'plan-test', primaryDecisionCategories: ['outcomeRules'] },
  decisionSummary: '1 required, 0 allowed, 0 conditional, 0 advisorOnly, 0 forbidden, 0 unavailable.',
  readingContext: {
    question: 'האם העסק החדש יצליח?',
    board: { mothers: ['2222', '2211', '2121', '2221'] },
    engineOutput: { clientWording: '...', certaintyLevel: 'medium' },
    activatedRuleIds: ['goral.kashf.commerce.1'],
    rejectedRuleIds: [],
    sourceEvidence: ['kashf p.73 — עסק חדש...'],
  },
};

// ── 1. back-compat: module undefined, no payload → old mock, unchanged ──
console.log('\n--- 1. תאימות-לאחור: אין module, אין payload ---');
{
  setBaseEnv();
  const res = await handleAdvisorRequest(makeRequest(undefined), { verifyToken: injectedMockVerifier });
  assert(res.status === 200, `200 (בפועל: ${res.status})`);
  const body = await res.json();
  assert(body.ok === true, 'ok:true');
  assert(body.advisorBrainOutput?.advisorDiagnosis?.startsWith('MOCK'), 'advisorDiagnosis הישן (MOCK) ללא-שינוי');
  assert(!('evaluatorMode' in body), 'אין evaluatorMode כשאין-payload-כלל (המסלול-הישן-במדויק)');
}

// ── 2. module:"kashf", no payload → old mock, unchanged ──────────────────
console.log('\n--- 2. module:"kashf" מפורש, אין payload ---');
{
  const res = await handleAdvisorRequest(makeRequest({ module: 'kashf' }), { verifyToken: injectedMockVerifier });
  assert(res.status === 200, `200 (בפועל: ${res.status})`);
  const body = await res.json();
  assert(body.advisorBrainOutput?.advisorDiagnosis?.startsWith('MOCK'), 'advisorDiagnosis הישן (MOCK) ללא-שינוי');
}

// ── 2ב. payload חלקי (חסר payloadVersion) → נחשב-כ"אין payload אמיתי" ────
console.log('\n--- 2ב. AI Context Package חלקי (חסר payloadVersion) ---');
{
  const incomplete = { ...REAL_CONTEXT_PACKAGE };
  delete incomplete.payloadVersion;
  const res = await handleAdvisorRequest(makeRequest({ module: 'kashf', payload: incomplete }), { verifyToken: injectedMockVerifier });
  const body = await res.json();
  assert(body.advisorBrainOutput?.advisorDiagnosis?.startsWith('MOCK'), 'payloadVersion חסר → מטופל כ"אין payload אמיתי", MOCK הישן');
  assert(!('evaluatorMode' in body), 'אין evaluatorMode — לא-נכנסים-לשער-5-התנאים כשהמעטפה לא-תקינה');
}

// ── 2ג. domain לא-תואם (cards בטעות) → נדחה, MOCK הישן ────────────────────
console.log('\n--- 2ג. domain לא-תואם (reading.cards בענף-kashf) ---');
{
  const wrongDomain = { ...REAL_CONTEXT_PACKAGE, domain: 'reading.cards' };
  const res = await handleAdvisorRequest(makeRequest({ module: 'kashf', payload: wrongDomain }), { verifyToken: injectedMockVerifier });
  const body = await res.json();
  assert(body.advisorBrainOutput?.advisorDiagnosis?.startsWith('MOCK'), 'domain לא-תואם ל-reading.goralHachol → MOCK הישן, לא-מעובד');
  assert(!('evaluatorMode' in body), 'אין evaluatorMode — Domain Separation נאכף');
}

// ── 3. real context package, no mode:'live' → mock, evaluatorMode:'mock', no reason ──
console.log('\n--- 3. AI Context Package אמיתי, ללא mode:"live" ---');
{
  const res = await handleAdvisorRequest(makeRequest({ module: 'kashf', payload: REAL_CONTEXT_PACKAGE }), { verifyToken: injectedMockVerifier });
  assert(res.status === 200, `200 (בפועל: ${res.status})`);
  const body = await res.json();
  assert(body.evaluatorMode === 'mock', 'evaluatorMode === "mock"');
  assert(!('liveModeUnavailableReason' in body), 'אין liveModeUnavailableReason — לא-ביקשו live בכלל');
}

// ── 4. real payload + mode:'live', HALL_WISDOM_AI_MODE not set → mockFallback('mode-not-live') ──
console.log('\n--- 4. mode:"live", HALL_WISDOM_AI_MODE לא-מוגדר ---');
{
  const res = await handleAdvisorRequest(makeRequest({ module: 'kashf', mode: 'live', payload: REAL_CONTEXT_PACKAGE }), { verifyToken: injectedMockVerifier });
  const body = await res.json();
  assert(body.evaluatorMode === 'mock', 'evaluatorMode === "mock"');
  assert(body.liveModeUnavailableReason === 'mode-not-live', `liveModeUnavailableReason === "mode-not-live" (בפועל: ${body.liveModeUnavailableReason})`);
}

// ── 5. + HALL_WISDOM_AI_MODE=live, no ANTHROPIC_API_KEY → 'missing-api-key' ──
console.log('\n--- 5. + HALL_WISDOM_AI_MODE=live, אין ANTHROPIC_API_KEY ---');
{
  process.env.HALL_WISDOM_AI_MODE = 'live';
  const res = await handleAdvisorRequest(makeRequest({ module: 'kashf', mode: 'live', payload: REAL_CONTEXT_PACKAGE }), { verifyToken: injectedMockVerifier });
  const body = await res.json();
  assert(body.liveModeUnavailableReason === 'missing-api-key', `liveModeUnavailableReason === "missing-api-key" (בפועל: ${body.liveModeUnavailableReason})`);
}

// ── 6. + fake ANTHROPIC_API_KEY, no ANTHROPIC_MODEL → 'missing-model' ────
console.log('\n--- 6. + ANTHROPIC_API_KEY מזויף, אין ANTHROPIC_MODEL ---');
{
  process.env.ANTHROPIC_API_KEY = 'fake-key-not-real';
  const res = await handleAdvisorRequest(makeRequest({ module: 'kashf', mode: 'live', payload: REAL_CONTEXT_PACKAGE }), { verifyToken: injectedMockVerifier });
  const body = await res.json();
  assert(body.liveModeUnavailableReason === 'missing-model', `liveModeUnavailableReason === "missing-model" (בפועל: ${body.liveModeUnavailableReason})`);
}

// ── 7. + fake model, forbidden field in payload → sanitization-failed ────
console.log('\n--- 7. + ANTHROPIC_MODEL מזויף, payload עם שדה-אסור (phone) ---');
{
  process.env.ANTHROPIC_MODEL = 'fake-model-not-real';
  const badPayload = { ...REAL_CONTEXT_PACKAGE, readingContext: { ...REAL_CONTEXT_PACKAGE.readingContext, phone: '050-0000000' } };
  const res = await handleAdvisorRequest(makeRequest({ module: 'kashf', mode: 'live', payload: badPayload }), { verifyToken: injectedMockVerifier });
  const body = await res.json();
  assert(body.evaluatorMode === 'mock', 'evaluatorMode === "mock" — לא-נשלח-payload-עם-phone');
  assert(body.liveModeUnavailableReason === 'sanitization-failed', `liveModeUnavailableReason === "sanitization-failed" (בפועל: ${body.liveModeUnavailableReason})`);
}

// ── 8. כל 4 התנאים מתקיימים + payload נקי → מגיע-עד-לקריאת-AI (ונכשל שם, כי fetch חסום בבדיקה) ──
console.log('\n--- 8. כל 4 התנאים מתקיימים, payload נקי — מגיע לשלב-קריאת-AI ---');
{
  capturedLogLines.length = 0;
  const res = await handleAdvisorRequest(makeRequest({ module: 'kashf', mode: 'live', payload: REAL_CONTEXT_PACKAGE }), { verifyToken: injectedMockVerifier });
  const body = await res.json();
  // fetch חסום ב-spy (זורק) — callAnthropicEdge חייב-לתפוס את זה בעצמו
  // ולהחזיר {ok:false}, לא-לזרוק-החוצה; ה-handler נופל-ל-mockFallback('anthropic-error').
  assert(body.evaluatorMode === 'mock', 'evaluatorMode === "mock" — anthropic-error (fetch חסום בבדיקה)');
  assert(body.liveModeUnavailableReason === 'anthropic-error', `liveModeUnavailableReason === "anthropic-error" (בפועל: ${body.liveModeUnavailableReason})`);

  // ── AI Invocation Log — נכתב גם-במסלול-כשל, ללא chain-of-thought ──
  const logLine = capturedLogLines.find((args) => args[0] === '[AI_INVOCATION_LOG]');
  assert(!!logLine, 'AI Invocation Log נכתב (console.log עם [AI_INVOCATION_LOG])');
  if (logLine) {
    const entry = JSON.parse(logLine[1]);
    assert(entry.readingId === 'reading-test-001', 'log.readingId תואם ל-readingId שנשלח');
    assert(entry.payloadVersion === 'ai-context-package-v1', 'log.payloadVersion תואם');
    assert(typeof entry.promptVersion === 'string' && entry.promptVersion.length > 0, 'log.promptVersion קיים');
    assert(entry.model === 'fake-model-not-real', 'log.model תואם ל-ANTHROPIC_MODEL שהוגדר');
    assert(entry.tokens === null, 'log.tokens === null (fetch נכשל, אין usage אמיתי)');
    assert(typeof entry.latencyMs === 'number' && entry.latencyMs >= 0, 'log.latencyMs הוא מספר לא-שלילי');
    assert(entry.estimatedCost === null, 'log.estimatedCost === null (אין טבלת-מחירים עדיין, אין ניחוש)');
    assert(entry.success === false, 'log.success === false');
    assert(typeof entry.error === 'string' && entry.error.length > 0, 'log.error מתועד');
    const ALLOWED_LOG_KEYS = ['readingId', 'payloadVersion', 'promptVersion', 'model', 'tokens', 'latencyMs', 'estimatedCost', 'success', 'error'];
    const entryKeys = Object.keys(entry);
    assert(entryKeys.every((k) => ALLOWED_LOG_KEYS.includes(k)), `log entry מכיל רק את 9 השדות המוגדרים (בפועל: ${entryKeys.join(',')})`);
    assert(!entryKeys.some((k) => /reason|thought|chain|prompt$|response|text/i.test(k)), 'log entry לא-מכיל שום שדה שנראה כמו chain-of-thought/prompt-content/raw-response');
  }
}

// ── 9. אין קריאת-רשת אמיתית לאורך כל הבדיקה ───────────────────────────────
console.log('\n--- 9. אין קריאת-רשת אמיתית ---');
assert(fetchCallCount > 0, `fetch נקרא (ונחסם) לפחות פעם-אחת בשלב 8, מוכיח שהגענו-בפועל-לשלב-קריאת-AI (בפועל: ${fetchCallCount})`);

// ── 10. אין secret אמיתי בקוד ─────────────────────────────────────────────
console.log('\n--- 10. אין secret אמיתי בקוד ---');
{
  const fs = await import('node:fs');
  const filesToScan = [
    './supabase/functions/oren-smart-advisor/index.ts',
    './supabase/functions/oren-smart-advisor/oren-smart-advisor-brain-prompt.ts',
    './supabase/functions/oren-smart-advisor/kashf_reading_payload_sanitizer.ts',
    './supabase/functions/oren-smart-advisor/ai-context-package.ts',
    './supabase/functions/oren-smart-advisor/ai-invocation-log.ts',
    './supabase/functions/oren-smart-advisor/anthropic-provider-edge.ts',
  ];
  for (const file of filesToScan) {
    const src = fs.readFileSync(file, 'utf8');
    assert(!/sk-ant-[a-zA-Z0-9-]+/.test(src), `${file}: אין מחרוזת שנראית כמו מפתח-Anthropic אמיתי`);
  }
  const indexSrc = fs.readFileSync('./supabase/functions/oren-smart-advisor/index.ts', 'utf8');
  assert(indexSrc.includes("getEnv('ANTHROPIC_API_KEY')"), 'ANTHROPIC_API_KEY נקרא רק דרך getEnv');
  assert(indexSrc.includes("getEnv('ANTHROPIC_MODEL')"), 'ANTHROPIC_MODEL נקרא רק דרך getEnv (לא-מקובע)');
}

// ── 11. Cards-readiness (מבני-בלבד) — Core לא-משתנה עבור Domain נוסף ──────
console.log('\n--- 11. Cards-readiness מבני (ללא מימוש-קלפים בפועל) ---');
{
  const fs = await import('node:fs');
  const envelopeSrc = fs.readFileSync('./supabase/functions/oren-smart-advisor/ai-context-package.ts', 'utf8');
  assert(envelopeSrc.includes("'reading.cards'"), 'ai-context-package.ts כבר-מתעד reading.cards כ-Domain עתידי-נתמך');
  assert(envelopeSrc.includes('readingContext: Record<string, unknown>'), 'readingContext מוגדר כ-bag גנרי — לא-נעול-לצורת-Kashf');
}

// שחזור מצב מקורי
globalThis.fetch = originalFetch;
console.log = originalConsoleLog;
for (const [k, v] of Object.entries(originalEnv)) {
  if (v === undefined) delete process.env[k]; else process.env[k] = v;
}

console.log('');
console.log('הצהרה: לא בוצע `supabase functions deploy` בשום שלב של הבדיקה הזו. לא נוסף אף secret אמיתי. לא נגע ב-UI.');
if (failures > 0) {
  console.error(`${failures} בדיקות נכשלו.`);
  process.exit(1);
}
console.log('כל הבדיקות עברו. module:"kashf" מקבל כעת AI Context Package מלא (payloadVersion/domain/method/questionType/primaryIntent/readingStrategy/readingPlan/decisionSummary/readingContext), מנותב דרך שער-5-התנאים, כותב AI Invocation Log ללא chain-of-thought, ותומך-מבנית בהוספת Cards עתידית בלי לשנות את ה-Core.');
