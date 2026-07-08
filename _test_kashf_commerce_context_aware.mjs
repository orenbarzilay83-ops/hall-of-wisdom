/**
 * _test_kashf_commerce_context_aware.mjs
 *
 * בדיקות-חובה לחיבור kashf-context-sanitizer.js אל kashf-commerce-smart-layer.js
 * (KASHF_SAFE_CONTEXT_USAGE_FOR_COMMERCE_PLAN.md, שלב-חיבור ל-commerce בלבד).
 */

import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { buildKashfReading } from './goral-hachol/engine/kashf-reading-engine.js';
import { writeKashfReading } from './goral-hachol/engine/kashf-narrative-writer.js';

let failures = 0;
function assert(condition, message) {
  if (!condition) { failures++; console.error(`✗ ${message}`); }
  else { console.log(`✓ ${message}`); }
}

// לוח ללא-סתירה, וודאות-לא-נמוכה — כדי שנוכל לבחון את תוספת-ה-context
// בלי שהיא תיבלע בתוך ענף-הסתירה/ודאות-נמוכה (שגוברים תמיד).
const NO_CONTRADICTION_MOTHERS = ['1112', '2122', '1121', '2211'];

function commerceReading(clientContext) {
  const board = buildRamlBoardFromMothers(NO_CONTRADICTION_MOTHERS);
  return buildKashfReading(board, 'commerce', clientContext);
}

// ── 1. employed לא כותב כאילו הלקוח בעל-עסק ────────────────────────────────
console.log('\n--- 1. workStatus: employed ---');
{
  const reading = commerceReading({ name: 'א', question: 'האם העסק ירוויח?', workStatus: 'employed' });
  const layer = reading.commerceSmartLayer;
  assert(!!layer, 'commerceSmartLayer חושב בהצלחה');
  assert(!layer.practicalGuidance?.includes('העסק שלך'), 'practicalGuidance לא כותב "העסק שלך"');
  assert(!layer.clientWording?.includes('בעל עסק') && !layer.practicalGuidance?.includes('בעל עסק'), 'אין ניסוח "בעל עסק" בשום מקום');
  assert(layer.advisorDiagnosis.contextAdjustments.some(a => a.type === 'caution-no-business-assumption'), 'advisorDiagnosis מתעד את הזהירות (advisor-only)');
  const html = writeKashfReading(reading);
  assert(!html.includes('בעל עסק') && !html.includes('העסק שלך'), 'גם ה-HTML הסופי נקי מהנחת-בעלות-עסק');
}

// ── 2. self מאפשר ניסוח עסקי מתאים, בלי להמציא תוצאה ───────────────────────
console.log('\n--- 2. workStatus: self ---');
{
  const readingSelf = commerceReading({ name: 'ב', question: 'האם העסק ירוויח?', workStatus: 'self' });
  const readingNone = commerceReading({ name: 'ב', question: 'האם העסק ירוויח?' });
  const layerSelf = readingSelf.commerceSmartLayer;
  const layerNone = readingNone.commerceSmartLayer;
  assert(layerSelf.practicalGuidance.includes('פעילות עצמאית'), 'practicalGuidance מוסיף התייחסות-עסקית כש-workStatus=self');
  assert(layerSelf.certaintyLevel === layerNone.certaintyLevel, 'certaintyLevel זהה בין self ל-ללא-context — התוצאה-הגורלית לא-משתנה');
  assert(layerSelf.clientWording === layerNone.clientWording, 'clientWording (המבוסס-לוח) זהה — context לא-נוגע בחלק-הזה');
}

// ── 3. phone לא מופיע בשום פלט ללקוח ───────────────────────────────────────
console.log('\n--- 3. phone ---');
{
  const reading = commerceReading({ name: 'ג', question: 'שאלה', phone: '0501234567', workStatus: 'self' });
  const layer = reading.commerceSmartLayer;
  assert(!layer.clientWording?.includes('0501234567'), 'phone לא ב-clientWording');
  assert(!layer.practicalGuidance?.includes('0501234567'), 'phone לא ב-practicalGuidance');
  const html = writeKashfReading(reading);
  assert(!html.includes('0501234567'), 'phone לא מופיע ב-HTML הסופי');
}

// ── 4. dynFields רגישים לא מופיעים כלשונם ──────────────────────────────────
console.log('\n--- 4. dynFields רגישים ---');
{
  const reading = commerceReading({
    name: 'ד', question: 'שאלה', workStatus: 'self',
    dynFields: { matter: 'עסקת-נדל"ן-ייחודית-עם-מונח-נדיר-XYZ123' },
  });
  const layer = reading.commerceSmartLayer;
  assert(!layer.clientWording?.includes('XYZ123'), 'clientWording לא-מכיל תוכן-dynFields גולמי');
  assert(!layer.practicalGuidance?.includes('XYZ123'), 'practicalGuidance לא-מכיל תוכן-dynFields גולמי');
  const html = writeKashfReading(reading);
  assert(!html.includes('XYZ123'), 'HTML הסופי לא-מכיל תוכן-dynFields גולמי');
}

// ── 5. maritalStatus/hasChildren לא מופיעים אם אינם-רלוונטיים ─────────────
console.log('\n--- 5. maritalStatus/hasChildren לא-רלוונטיים ---');
{
  const reading = commerceReading({ name: 'ה', question: 'שאלה', maritalStatus: 'married', hasChildren: 'yes' });
  const layer = reading.commerceSmartLayer;
  assert(!layer.clientWording?.includes('נשוי') && !layer.practicalGuidance?.includes('נשוי'), 'אין אזכור "נשוי" (לא-רלוונטי כברירת-מחדל)');
  assert(!layer.clientWording?.includes('ילדים') && !layer.practicalGuidance?.includes('ילדים'), 'אין אזכור "ילדים" (לא-רלוונטי כברירת-מחדל)');
}

// ── 6+7. פלט משתנה רק כש-contextRelevance מצדיק; זהה-לחלוטין בלי-context ──
console.log('\n--- 6+7. השוואה: context לא-רלוונטי מול context ריק ---');
{
  const readingEmpty = commerceReading({ name: 'ו', question: 'שאלה זהה' });
  const readingIrrelevant = commerceReading({ name: 'ו', question: 'שאלה זהה', maritalStatus: 'single', hasChildren: 'no' });
  const htmlEmpty = writeKashfReading(readingEmpty);
  const htmlIrrelevant = writeKashfReading(readingIrrelevant);
  assert(htmlEmpty === htmlIrrelevant, 'פלט זהה-בדיוק בין context ריק לבין context-לא-רלוונטי (maritalStatus/hasChildren)');

  const readingRelevant = commerceReading({ name: 'ו', question: 'שאלה זהה', workStatus: 'self' });
  const htmlRelevant = writeKashfReading(readingRelevant);
  assert(htmlRelevant !== htmlEmpty, 'הפלט כן-משתנה כש-workStatus=self (רלוונטי-לcommerce) — context-רלוונטי משפיע');
}

// ── 8. שאר הנושאים לא-משתנים ────────────────────────────────────────────────
console.log('\n--- 8. שאר-הנושאים ---');
{
  const board = buildRamlBoardFromMothers(NO_CONTRADICTION_MOTHERS);
  const moneyReading = buildKashfReading(board, 'money', { name: 'ז', question: 'מה מצב הכסף?', workStatus: 'self' });
  assert(moneyReading.commerceSmartLayer === undefined || moneyReading.commerceSmartLayer === null, 'money לא-מקבל commerceSmartLayer בכלל, גם עם workStatus=self');
  const html = writeKashfReading(moneyReading);
  assert(html.length > 100, 'נושא money ממשיך לפעול תקין');
}

// ── 9. חישוב-כשף לא-משתנה (primaryFormula/overallPositive זהים) ───────────
console.log('\n--- 9. חישוב-הלוח לא-מושפע ---');
{
  const r1 = commerceReading({ name: 'ח', question: 'ש' });
  const r2 = commerceReading({ name: 'ח', question: 'ש', workStatus: 'self', maritalStatus: 'married' });
  assert(JSON.stringify(r1.primaryFormula) === JSON.stringify(r2.primaryFormula), 'primaryFormula זהה בין context-ריק ל-context-עשיר');
  assert(r1.overallPositive === r2.overallPositive, 'overallPositive זהה');
}

console.log('');
if (failures > 0) {
  console.error(`${failures} בדיקות נכשלו.`);
  process.exit(1);
}
console.log('כל הבדיקות עברו. Context Sanitizer מחובר ל-commerce בלבד, phone/dynFields רגישים לא-דולפים, employed לא-הופך-לבעל-עסק, self מאפשר-ניסוח-זהיר, maritalStatus/hasChildren לא-רלוונטיים כברירת-מחדל, חישוב-הלוח ושאר-הנושאים לא-מושפעים.');
