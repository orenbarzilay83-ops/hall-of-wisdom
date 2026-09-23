// בדיקת רגרסיה: Question-Aware Section Filter (goral-rule-applicability.js)
// מוודאת שדמיר/מחשבת-השואל אינם מחושבים או מוצגים כברירת מחדל,
// ושחישוב מפורש יחיד עדיין עובד במצב advisor.
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { buildKashfReading } from './goral-hachol/engine/kashf-reading-engine.js';
import { writeKashfReading } from './goral-hachol/engine/kashf-narrative-writer.js';
import { interpretHawiQuestionInitial } from './goral-hachol/engine/hawi-interpreter.js';

let failed = 0;
function assert(cond, msg) {
  if (!cond) { console.error('✗ FAIL:', msg); failed++; }
  else console.log('✓', msg);
}

const mothers = ['1112', '2122', '1121', '2211'];
const board = buildRamlBoardFromMothers(mothers);

console.log('\n--- 1. כשף: שאלת עסק/הצלחה — ללא דמיר ---');
{
  const reading = buildKashfReading(board, 'commerce', { name: 'בדיקה', question: 'האם העסק החדש יצליח?' });
  const html = writeKashfReading(reading);
  assert(!html.includes('מחשבת השואל'), 'אין "מחשבת השואל" בפלט הלקוח');
  assert(!html.includes('kashf-dhamir-body'), 'אין כרטיס-דמיר בפלט הלקוח');
  assert(!html.includes('kashf-dhamir-extra'), 'אין תוספות-דמיר (עיתוי/טבע-שואל) בפלט הלקוח');
  assert(reading.dhamir === null, 'commerce: דמיר אינו מחושב ללא בחירה מפורשת');
  assert(reading.dhamirExtras === null, 'commerce: תוספות דמיר אינן מחושבות ללא opt-in');
  assert(reading.dhamirType4External === null, 'commerce: משלים דמיר חיצוני אינו מחושב ללא opt-in');
}

console.log('\n--- 2. כשף: השלמת עניין — ללא דמיר כברירת מחדל ---');
{
  const reading = buildKashfReading(board, 'completion', { question: 'האם הדבר יצליח?' });
  const html = writeKashfReading(reading);
  assert(!html.includes('מחשבת השואל'), 'completion: אין דמיר בפלט הלקוח כברירת מחדל');
  assert(reading.dhamir === null, 'completion: reading.dhamir אינו מחושב כברירת מחדל');
}

console.log('\n--- 3. כשף: advisor mode — דמיר כן מוצג במפורש ---');
{
  const reading = buildKashfReading(board, 'commerce', {
    question: 'מה הוא באמת חושב?',
    dhamirSelection: { intentId: 'hiddenThoughtIntent', methodId: 'mizan' },
  });
  assert(reading.dhamir?.winner, 'advisor mode fixture: שיטת דמיר אחת חושבה במפורש');
  assert(reading.dhamir.candidates.length === 1, 'advisor mode fixture: רק מועמד דמיר אחד רץ');
  const advisorHtml = writeKashfReading(reading, { mode: 'advisor' });
  assert(advisorHtml.includes('מחשבת השואל'), 'advisor mode: דמיר מפורש מוצג ליועץ');
}

console.log('\n--- 4. כשף: מצב client (ברירת מחדל, ללא options) זהה למצב client מפורש ---');
{
  const reading = buildKashfReading(board, 'commerce', { question: 'האם העסק יצליח?' });
  const implicit = writeKashfReading(reading);
  const explicit = writeKashfReading(reading, { mode: 'client' });
  assert(implicit === explicit, 'writeKashfReading(reading) === writeKashfReading(reading, {mode:"client"})');
}

console.log('\n--- 5. חאווי: שאלה רגילה — ללא dhamirParagraph ללקוח ---');
{
  const boardWithChart = { ...board, chart: board.chart || board.entries || [], topicId: 'commerce' };
  const result = interpretHawiQuestionInitial('האם העסק החדש יצליח?', boardWithChart);
  assert(!result.finalConclusionHebrew.includes('מחשבת השואל'), 'finalConclusionHebrew: אין "מחשבת השואל" בשאלת מסחר רגילה');
  assert(!result.clientReadingHebrew?.includes?.('מחשבת השואל'), 'clientReadingHebrew: אין "מחשבת השואל" בשאלת מסחר רגילה');
}

console.log('\n--- 6. חאווי: אבחון רוחני עדיין מופיע רק בנושאים המאושרים ---');
{
  const boardSpiritual = { ...board, chart: board.chart || board.entries || [], topicId: 'spiritualDiagnostics' };
  const resultSpiritual = interpretHawiQuestionInitial('האם יש עליי כישוף?', boardSpiritual);
  assert(!!resultSpiritual.spiritualDiagnosis, 'spiritualDiagnostics topic: spiritualDiagnosis עדיין מחושב ומוחזר');

  const boardCommerce = { ...board, chart: board.chart || board.entries || [], topicId: 'commerce' };
  const resultCommerce = interpretHawiQuestionInitial('האם העסק יצליח?', boardCommerce);
  assert(!!resultCommerce.spiritualDiagnosis, 'commerce topic: spiritualDiagnosis עדיין מחושב ברקע (לא נמחק)');
  assert(
    !resultCommerce.finalConclusionHebrew.includes('פגיעה רוחנית') && !resultCommerce.finalConclusionHebrew.includes('כישוף'),
    'commerce topic: אבחון רוחני עדיין לא דולף לפלט הלקוח (התנהגות שלא שונתה)'
  );
}

console.log('\n--- 7. פאנל בינת אורן + קלפים עדיין קיימים (smoke, לא נגענו בהם) ---');
{
  const fs = await import('node:fs');
  const html = fs.readFileSync(new URL('./goral-hachol.html', import.meta.url), 'utf8');
  assert(html.includes('orenAdvisorPanel'), 'orenAdvisorPanel עדיין ב-goral-hachol.html');
  assert(fs.existsSync(new URL('./cards.html', import.meta.url)), 'cards.html עדיין קיים');
  assert(fs.existsSync(new URL('./cartomancy/ui/cards-app.js', import.meta.url)), 'cartomancy/ui/cards-app.js עדיין קיים');
}

console.log(failed ? `\n${failed} בדיקות נכשלו` : '\nכל הבדיקות עברו — דמיר אינו רץ אוטומטית בכשף, חישוב מפורש יחיד זמין ליועץ, וחאווי לא נגע.');
process.exitCode = failed ? 1 : 0;
