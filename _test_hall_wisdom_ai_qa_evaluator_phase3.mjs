// בדיקת רגרסיה: בינת היכל החכמה — Goral QA AI Evaluator, שלב 3 (MOCK בלבד).
import { run as runQaBrain } from './goral-hachol/qa/goral-qa-runner.mjs';
import { buildQaEvaluatorPayload } from './goral-hachol/qa/goral-qa-ai-payload-builder.js';
import { evaluateQaRunMock } from './goral-hachol/qa/goral-qa-ai-evaluator-mock.js';

let failed = 0;
function assert(cond, msg) {
  if (!cond) { console.error('✗ FAIL:', msg); failed++; }
  else console.log('✓', msg);
}

const qaRunResult = runQaBrain();
const payload = buildQaEvaluatorPayload(qaRunResult);
const evaluation = evaluateQaRunMock(payload);

console.log('\n--- 1. payload כולל לפחות 20 תרחישים ---');
{
  assert(payload.scenarios.length >= 20, `payload.scenarios.length = ${payload.scenarios.length} (>= 20)`);
  assert(payload.collectedOutputs.length >= 20, `payload.collectedOutputs.length = ${payload.collectedOutputs.length} (>= 20)`);
  const kashfCount = payload.scenarios.filter((s) => s.method === 'kashf').length;
  const hawiCount = payload.scenarios.filter((s) => s.method === 'hawi').length;
  assert(kashfCount >= 5 && hawiCount >= 5, `כשף=${kashfCount}, חאווי=${hawiCount} — שניהם מיוצגים`);
}

console.log('\n--- 2. ה-output mock עומד בסכימה ---');
{
  const requiredKeys = [
    'overallDiagnosis', 'scenarioFindings', 'detectedProblems', 'severity',
    'irrelevantSections', 'missingRelevantSections', 'advisorOnlyLeaks',
    'clientOutputProblems', 'sourceRuleConcerns', 'recommendedFixes',
    'codeInstructionForClaude', 'testsToAdd', 'needsOrenDecision', 'confidence',
  ];
  for (const k of requiredKeys) {
    assert(k in evaluation, `evaluation כולל שדה "${k}"`);
  }
  assert(typeof evaluation.overallDiagnosis === 'string' && evaluation.overallDiagnosis.length > 0, 'overallDiagnosis הוא מחרוזת לא-ריקה');
  assert(Array.isArray(evaluation.scenarioFindings) && evaluation.scenarioFindings.length === payload.scenarios.length, 'scenarioFindings.length תואם למספר-התרחישים');
  assert(['low', 'medium', 'high'].includes(evaluation.severity), 'severity הוא ערך-enum תקין');
  assert(['low', 'medium', 'high'].includes(evaluation.confidence), 'confidence הוא ערך-enum תקין');
  assert(typeof evaluation.needsOrenDecision === 'boolean', 'needsOrenDecision הוא boolean');
  assert(evaluation.overallDiagnosis.includes('MOCK'), 'overallDiagnosis מתויג-במפורש כ-MOCK');
}

console.log('\n--- 3. codeInstructionForClaude בפורמט שימושי ---');
{
  const c = evaluation.codeInstructionForClaude;
  assert(typeof c.needed === 'boolean', 'codeInstructionForClaude.needed הוא boolean');
  assert(Array.isArray(c.filesToInspect), 'filesToInspect הוא מערך');
  assert(Array.isArray(c.filesNotToTouch), 'filesNotToTouch הוא מערך');
  assert(Array.isArray(c.testsToRun), 'testsToRun הוא מערך');
  if (!c.needed) {
    assert(c.filesToInspect.length === 0, 'כש-needed=false, filesToInspect ריק (אין הוראה מיותרת)');
  }
}

console.log('\n--- 4. אין חשיפת phone/dynFields/clientHistorySummary ב-payload ---');
{
  const payloadJson = JSON.stringify(payload);
  assert(!payloadJson.includes('"phone"'), 'אין מפתח "phone" ב-payload');
  assert(!payloadJson.includes('"dynFields"'), 'אין מפתח "dynFields" ב-payload');
  assert(!payloadJson.includes('"clientHistorySummary"'), 'אין מפתח "clientHistorySummary" ב-payload');
  assert(!('board' in (payload.collectedOutputs[0] || {})), 'collectedOutputs לא כולל board גולמי');
  assert(!('advisorOnlyOutput' in (payload.collectedOutputs[0] || {})), 'collectedOutputs לא כולל advisorOnlyOutput גולמי');
  assert(!('raw' in (payload.collectedOutputs[0] || {})), 'collectedOutputs לא כולל raw (reading/result) גולמי');
  // sourceRulesApplied כן-אמור-להופיע — זה sourceText נחוץ, לא מידע-לקוח-רגיש
  assert(payload.collectedOutputs.some((c) => Array.isArray(c.sourceRulesApplied)), 'sourceRulesApplied כן קיים (נחוץ לשיפוט נאמנות-למקור)');
}

console.log('\n--- 5. אין שינוי במנועי Kashf/Hawi (regression) ---');
{
  // אם המנועים היו נשברים, runQaBrain() כבר היה זורק/מחזיר crashed>0 למעלה
  assert(qaRunResult.crashed === 0, 'אף תרחיש לא קרס — המנועים פועלים כרגיל');
}

console.log('\n--- 6. אין שינוי בקלפים (smoke) ---');
{
  const fs = await import('node:fs');
  assert(fs.existsSync(new URL('./cards.html', import.meta.url)), 'cards.html עדיין קיים');
  assert(fs.existsSync(new URL('./cartomancy/ui/cards-app.js', import.meta.url)), 'cartomancy/ui/cards-app.js עדיין קיים');
}

console.log('\n--- 7. אין שינוי ב-UI (smoke) ---');
{
  const fs = await import('node:fs');
  const html = fs.readFileSync(new URL('./goral-hachol.html', import.meta.url), 'utf8');
  const appJs = fs.readFileSync(new URL('./goral-hachol/ui/goral-app.js', import.meta.url), 'utf8');
  assert(html.includes('orenAdvisorPanel'), 'orenAdvisorPanel עדיין ב-goral-hachol.html');
  assert(appJs.includes('בינת היכל החכמה — לוח יועץ פנימי'), 'כותרת הפאנל נשארת "בינת היכל החכמה" (לא שונתה בשלב הזה)');
}

console.log('\n--- 8. אין AI חי — אין fetch/callAnthropic בקבצי שלב 3 ---');
{
  const fs = await import('node:fs');
  const files = [
    './goral-hachol/qa/goral-qa-ai-payload-builder.js',
    './goral-hachol/qa/goral-qa-ai-evaluator-mock.js',
    './goral-hachol/qa/goral-qa-ai-runner.mjs',
  ];
  for (const f of files) {
    const src = fs.readFileSync(new URL(f, import.meta.url), 'utf8');
    // בודקים קריאה/ייבוא בפועל של callAnthropic — לא אזכור-מילולי בהערות
    // שמסבירות שזה *לא* קורה (למשל "לא AI, לא fetch, לא callAnthropic").
    assert(!/callAnthropic\s*\(/.test(src) && !/import\s*\{[^}]*callAnthropic/.test(src), `${f}: אין קריאה/ייבוא בפועל של callAnthropic`);
    assert(!/\bfetch\s*\(/.test(src), `${f}: אין קריאת fetch`);
    assert(!/ANTHROPIC_API_KEY/.test(src), `${f}: אין הפניה ל-ANTHROPIC_API_KEY`);
  }
}

console.log(failed ? `\n${failed} בדיקות נכשלו` : '\nכל הבדיקות עברו — Goral QA AI Evaluator (MOCK) עובד, ללא AI חי, ללא דליפת-פרטיות, ללא שינוי במנועים/קלפים/UI.');
process.exitCode = failed ? 1 : 0;
