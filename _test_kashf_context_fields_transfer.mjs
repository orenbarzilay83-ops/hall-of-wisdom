/**
 * _test_kashf_context_fields_transfer.mjs
 *
 * בדיקות-חובה לשלב (ג-חלקי) של KASHF_CONTEXT_COLLECTOR_IMPLEMENTATION_PLAN.md:
 * maritalStatus/workStatus/hasChildren/parentName/quesitedName/phone/dynFields
 * מגיעים עד reading.clientContext, בלי לשנות חישוב או ניסוח.
 */

import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { buildKashfReading } from './goral-hachol/engine/kashf-reading-engine.js';
import { writeKashfReading } from './goral-hachol/engine/kashf-narrative-writer.js';

let failures = 0;
function assert(condition, message) {
  if (!condition) { failures++; console.error(`✗ ${message}`); }
  else { console.log(`✓ ${message}`); }
}

const mothers = ['1112', '2122', '1121', '2211'];
const board = buildRamlBoardFromMothers(mothers);

// ── 1+3. buildKashfReading מקבל ושומר maritalStatus/workStatus/hasChildren/parentName/quesitedName/phone ─
console.log('\n--- 1+3. שדות-פרופיל ושדות-קשר עוברים ל-reading.clientContext ---');
{
  const richCtx = {
    name: 'אבי', question: 'מה מצב הכסף?', age: '', gender: 'male',
    maritalStatus: 'single', workStatus: 'employed', hasChildren: 'no',
    parentName: 'משה', quesitedName: '', phone: '0500000000',
    dynFields: {},
  };
  const reading = buildKashfReading(board, 'money', richCtx);
  assert(reading.valid, 'הלוח תקין');
  assert(reading.clientContext.maritalStatus === 'single', 'maritalStatus נשמר ב-reading.clientContext');
  assert(reading.clientContext.workStatus === 'employed', 'workStatus נשמר');
  assert(reading.clientContext.hasChildren === 'no', 'hasChildren נשמר');
  assert(reading.clientContext.parentName === 'משה', 'parentName נשמר');
  assert(reading.clientContext.phone === '0500000000', 'phone נשמר בתוך reading.clientContext (advisor-only data)');

  const html = writeKashfReading(reading);
  assert(!html.includes('0500000000'), 'phone לא מופיע בפלט ה-HTML ללקוח (advisor-only, לא ב-narrative)');
}

// ── 2. dynFields מגיע כאובייקט מסודר, לא כשדות מפוזרים ────────────────────
console.log('\n--- 2. dynFields כאובייקט מקונן ---');
{
  const ctxWithDyn = {
    name: 'רות', question: 'האם אני חולה?', age: '', gender: 'female',
    dynFields: { symptoms: 'כאב ראש', duration: 'שבועיים' },
  };
  const reading = buildKashfReading(board, 'money', ctxWithDyn);
  assert(typeof reading.clientContext.dynFields === 'object' && reading.clientContext.dynFields !== null, 'dynFields הוא object');
  assert(reading.clientContext.dynFields.symptoms === 'כאב ראש', 'ערך פנימי של dynFields נשמר נכון');
  assert(reading.clientContext.symptoms === undefined, 'שדה dynField לא "דלף" כשדה שטוח ישירות על clientContext');
  const html = writeKashfReading(reading);
  assert(!html.includes('כאב ראש'), 'תוכן-dynFields (רגיש) לא מוצג אוטומטית בפלט ללקוח בשלב הזה');
}

// ── 4. age עדיין לא-נוסף ולא-מנוחש ─────────────────────────────────────────
console.log('\n--- 4. age לא נוסף/מנוחש בשלב הזה ---');
{
  const ctxNoAge = { name: 'דנה', question: 'שאלה', age: '', gender: 'female' };
  const reading = buildKashfReading(board, 'money', ctxNoAge);
  assert(reading.clientContext.age === '', 'age עדיין ריק כברירת-מחדל, לא מנוחש — לא נוסף היגיון-age חדש בשלב הזה');
}

// ── 5. פלט-המסקנה ללקוח לא משתנה (השוואה בין clientContext מינימלי לעשיר) ──
console.log('\n--- 5. פלט זהה בין clientContext ישן (מינימלי) לחדש (עשיר) ---');
{
  const minimalCtx = { name: 'אבי', question: 'מה מצב הכסף?', age: '', gender: 'male' };
  const richCtx = {
    name: 'אבי', question: 'מה מצב הכסף?', age: '', gender: 'male',
    maritalStatus: 'married', workStatus: 'self', hasChildren: 'yes',
    parentName: 'X', quesitedName: 'Y', phone: '0501111111',
    dynFields: { matter: 'עסקה גדולה' },
  };
  const readingMinimal = buildKashfReading(board, 'money', minimalCtx);
  const readingRich = buildKashfReading(board, 'money', richCtx);
  const htmlMinimal = writeKashfReading(readingMinimal);
  const htmlRich = writeKashfReading(readingRich);
  assert(htmlMinimal === htmlRich, 'ה-HTML הסופי זהה-בדיוק בין clientContext מינימלי לעשיר — narrative לא הושפע');
}

// ── 6+7. הלוח והחישוב לא השתנו (רגרסיה בסיסית) ────────────────────────────
console.log('\n--- 6+7. רגרסיה: חישוב-הלוח וה-primaryFormula לא השתנו ---');
{
  const ctx1 = { name: 'א', question: 'ש', age: '', gender: '' };
  const ctx2 = { name: 'א', question: 'ש', age: '', gender: '', maritalStatus: 'divorced', dynFields: { x: '1' } };
  const r1 = buildKashfReading(board, 'money', ctx1);
  const r2 = buildKashfReading(board, 'money', ctx2);
  assert(JSON.stringify(r1.primaryFormula) === JSON.stringify(r2.primaryFormula), 'primaryFormula זהה — החישוב לא הושפע מהשדות-הנוספים');
  assert(r1.overallPositive === r2.overallPositive, 'overallPositive זהה');
}

console.log('');
if (failures > 0) {
  console.error(`${failures} בדיקות נכשלו.`);
  process.exit(1);
}
console.log('כל הבדיקות עברו. שדות-הקשר מגיעים ל-reading.clientContext, אין דליפה ל-narrative, אין שינוי-חישוב, age לא נוסף.');
