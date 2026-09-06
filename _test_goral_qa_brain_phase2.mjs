// בדיקת רגרסיה: Oren Smart Advisor — Goral QA Brain, שלב 2
// (scenarios + collector + deterministic checks + runner) — בלי AI.
import { GORAL_QA_SCENARIOS } from './goral-hachol/qa/goral-qa-scenarios.js';
import { collectScenarioOutput } from './goral-hachol/qa/goral-qa-output-collector.js';
import { runDeterministicChecks } from './goral-hachol/qa/goral-qa-deterministic-checks.js';
import { run as runQaBrain } from './goral-hachol/qa/goral-qa-runner.mjs';
import { buildKashfReading } from './goral-hachol/engine/kashf-reading-engine.js';
import { writeKashfReading } from './goral-hachol/engine/kashf-narrative-writer.js';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';

let failed = 0;
function assert(cond, msg) {
  if (!cond) { console.error('✗ FAIL:', msg); failed++; }
  else console.log('✓', msg);
}

console.log('\n--- 1. runner עובד מקומית ---');
{
  const { results, allProblems, crashed } = runQaBrain();
  assert(Array.isArray(results) && results.length > 0, 'runner מחזיר תוצאות');
  assert(crashed === 0, 'אף תרחיש לא קרס');
  assert(Array.isArray(allProblems), 'allProblems הוא מערך (גם אם ריק)');
}

console.log('\n--- 2. לפחות 20 תרחישים ---');
{
  assert(GORAL_QA_SCENARIOS.length >= 20, `יש ${GORAL_QA_SCENARIOS.length} תרחישים (>= 20)`);
}

console.log('\n--- 3. תרחישים גם ל-kashf וגם ל-hawi ---');
{
  const kashfCount = GORAL_QA_SCENARIOS.filter((s) => s.method === 'kashf').length;
  const hawiCount = GORAL_QA_SCENARIOS.filter((s) => s.method === 'hawi').length;
  assert(kashfCount >= 5, `יש ${kashfCount} תרחישי כשף`);
  assert(hawiCount >= 5, `יש ${hawiCount} תרחישי חאווי`);
}

console.log('\n--- 4. המערכת תופסת דמיר לא-רצוי כשהוא מופיע (real advisor-mode HTML) ---');
{
  const board = buildRamlBoardFromMothers(['1112', '2122', '1121', '2211']);
  const reading = buildKashfReading(board, 'commerce', { question: 'האם העסק יצליח?' });
  const advisorHtml = writeKashfReading(reading, { mode: 'advisor' }); // מכיל דמיר באמת (ענף קיים במנוע)
  assert(advisorHtml.includes('מחשבת השואל'), 'ודאות: HTML מצב-advisor אכן מכיל "מחשבת השואל" (לא בדיקת-שווא)');

  const badCollected = {
    scenarioId: 'synthetic-bad-dhamir', category: 'commerce', method: 'kashf', topicId: 'commerce',
    question: 'האם העסק יצליח?', clientOutputHtml: advisorHtml, // מדמים דליפה: html-advisor "מוצג ללקוח"
    sectionsShown: [], sectionsHidden: ['dhamir'], raw: reading,
  };
  const problems = runDeterministicChecks(badCollected);
  assert(problems.some((p) => p.section === 'dhamir'), 'runDeterministicChecks תופס דמיר-דולף כ-problem');
}

console.log('\n--- 5. המערכת תופסת שם-בית-נושאי לא-רצוי כשהוא מופיע (regression signature) ---');
{
  const board = buildRamlBoardFromMothers(['1112', '2122', '1121', '2211']);
  const reading = buildKashfReading(board, 'completion', { question: 'האם הדבר יצליח?' });
  const fixedHtml = writeKashfReading(reading);
  assert(!fixedHtml.includes('הדת והנסיעה'), 'ודאות: אחרי התיקון, ה-HTML האמיתי לא מכיל את השם הנושאי');

  // משחזרים את חתימת-הבאג המדויקת שתוקנה (49abd7c/70953ec): מחליפים את
  // התווית הטכנית הניטרלית בחזרה לשם הנושאי המקורי — כך בודקים שהבודק
  // *היה* תופס את הבאג המקורי, לא רק שהוא שקט כשהתיקון עדיין בתוקף.
  const regressedHtml = fixedHtml.replace('בית 9 — מרכיב בנוסחת ההכרעה', 'בית תשיעי — הדת והנסיעה');
  const badCollected = {
    scenarioId: 'synthetic-regressed-house-label', category: 'completion', method: 'kashf', topicId: 'completion',
    question: 'האם הדבר יצליח?', clientOutputHtml: regressedHtml,
    sectionsShown: [], sectionsHidden: ['dhamir'], raw: reading,
  };
  const problems = runDeterministicChecks(badCollected);
  assert(problems.some((p) => p.section === 'keyHouses'), 'runDeterministicChecks תופס תווית-בית-נושאית-מוטעית כ-problem');
}

console.log('\n--- 6. המערכת לא משנה פלטים — רק קוראת אותם ---');
{
  const scenario = GORAL_QA_SCENARIOS[0];
  const first = collectScenarioOutput(scenario);
  const second = collectScenarioOutput(scenario);
  assert(first.clientOutputHtml === second.clientOutputHtml, 'קריאה כפולה לאותו תרחיש מפיקה HTML זהה (אין side-effect)');
  assert(JSON.stringify(first.board) === JSON.stringify(second.board), 'הלוח זהה בין שתי קריאות — collector לא משנה קלט');
}

console.log('\n--- 7. רגרסיה: פאנל בינת אורן עדיין קיים ---');
{
  const fs = await import('node:fs');
  const html = fs.readFileSync(new URL('./goral-hachol.html', import.meta.url), 'utf8');
  assert(html.includes('orenAdvisorPanel'), 'orenAdvisorPanel עדיין ב-goral-hachol.html');
}

console.log('\n--- 8. רגרסיה: קבצי הקלפים עדיין קיימים ---');
{
  const fs = await import('node:fs');
  assert(fs.existsSync(new URL('./cards.html', import.meta.url)), 'cards.html עדיין קיים');
  assert(fs.existsSync(new URL('./cartomancy/ui/cards-app.js', import.meta.url)), 'cartomancy/ui/cards-app.js עדיין קיים');
}

console.log(failed ? `\n${failed} בדיקות נכשלו` : '\nכל הבדיקות עברו — Goral QA Brain שלב 2 עובד, תופס דמיר/תוויות-בית לא-רצויים, ולא משנה פלטים.');
process.exitCode = failed ? 1 : 0;
