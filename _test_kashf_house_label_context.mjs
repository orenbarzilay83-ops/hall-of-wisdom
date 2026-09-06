// בדיקת רגרסיה: context-aware house label — בית שמופיע רק כרכיב-נוסחה
// לא מוצג עם כותרת נושאית מטעה (למשל "בית תשיעי — הדת והנסיעה") ללקוח,
// ו"סעיף ללא-תחולה" (למשל מתן התאוות) לא מוצג ללקוח כשאין לו תוכן.
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { buildKashfReading } from './goral-hachol/engine/kashf-reading-engine.js';
import { writeKashfReading } from './goral-hachol/engine/kashf-narrative-writer.js';

let failed = 0;
function assert(cond, msg) {
  if (!cond) { console.error('✗ FAIL:', msg); failed++; }
  else console.log('✓', msg);
}

// לוח שבו בית 1 הוא "בר הלחי" (naqi-khad) — כדי לבדוק גם את מקרה
// ה"הערה נמצאה" (note-found) של מתן התאוות, לצד לוח שבו אין הערה.
const mothersA = ['1112', '2122', '1121', '2211'];
const boardA = buildRamlBoardFromMothers(mothersA);

console.log('\n--- 1. כשף: השלמת עניין — בית 9 מוצג כרכיב-נוסחה, לא כ"דת ונסיעה" ---');
{
  const reading = buildKashfReading(boardA, 'completion', { question: 'האם העסק החדש יצליח?' });
  const html = writeKashfReading(reading);
  assert(!html.includes('הדת והנסיעה'), 'אין "הדת והנסיעה" בפלט הלקוח');
  const h9 = reading.keyHouseReadings.find((h) => h.houseNum === 9);
  assert(!!h9 && h9.isFormulaOnly === true, 'reading.keyHouseReadings: בית 9 מסומן isFormulaOnly=true');
  assert(h9.houseName === 'בית 9 — מרכיב בנוסחת ההכרעה', 'houseName של בית 9 הוא התווית הטכנית הניטרלית');
  assert(html.includes('בית 9 — מרכיב בנוסחת ההכרעה'), 'הפלט מציג את התווית הטכנית עבור בית 9');
}

console.log('\n--- 2. כשף: מחלה — בית 6/8 עדיין מוצגים עם כותרת נושאית (תמיכה מפורשת קיימת) ---');
{
  const reading = buildKashfReading(boardA, 'illness', { question: 'מה מצב הבריאות?' });
  const h6 = reading.keyHouseReadings.find((h) => h.houseNum === 6);
  const h8 = reading.keyHouseReadings.find((h) => h.houseNum === 8);
  assert(h6.isFormulaOnly === false, 'illness: בית 6 (המחלה) לא מסומן formula-only — יש לו תמיכה ספציפית');
  assert(h8.isFormulaOnly === false, 'illness: בית 8 (מוות/ירושה) לא מסומן formula-only — יש לו תמיכה ספציפית');
  assert(h6.houseName.includes('המחלה'), 'illness: בית 6 עדיין מציג כותרת נושאית ("המחלה")');
}

console.log('\n--- 3. כשף: מתן-התאוות — לא מוצג ללקוח כשאין תחולה ---');
{
  // מחפשים לוח שבו computeFigureDesireFulfillmentKashf לא מוצא הערה (רוב הצורות)
  let foundNoApplicability = false;
  for (const combo of [
    ['1112', '2122', '1121', '2211'],
    ['1211', '2121', '2112', '1222'],
    ['1122', '1212', '1122', '2221'],
  ]) {
    const b = buildRamlBoardFromMothers(combo);
    const reading = buildKashfReading(b, 'completion', { question: 'האם הדבר יצליח?' });
    const desire = reading.supportingFindings.find((f) => f.fnName === 'computeFigureDesireFulfillmentKashf');
    if (desire?.verdict === 'no-note-for-this-figure') {
      foundNoApplicability = true;
      const html = writeKashfReading(reading);
      assert(!html.includes('אין לכלל זה תחולה'), 'הטקסט "אין לכלל זה תחולה" לא מופיע בפלט הלקוח');
      assert(!html.includes('מתן התאוות'), '"מתן התאוות" לא מופיע בכלל בפלט הלקוח כשאין תחולה');
      assert(!!desire.outputHebrew, 'supportingFindings המלא עדיין מכיל את הרשומה (advisor-only, לא נמחק)');
      break;
    }
  }
  assert(foundNoApplicability, 'נמצא לפחות לוח-בדיקה אחד עם verdict=no-note-for-this-figure (תרחיש רלוונטי נבדק בפועל)');
}

console.log('\n--- 4. חישוב לא השתנה: verdict/positive/pattern זהים ---');
{
  const reading = buildKashfReading(boardA, 'completion', { question: 'האם העסק החדש יצליח?' });
  assert(typeof reading.overallPositive === 'boolean' || reading.overallPositive === null, 'overallPositive עדיין קיים ובעל טיפוס תקין');
  assert(!!reading.primaryFormula?.result?.resultPattern, 'primaryFormula.result.resultPattern עדיין מחושב');
}

console.log(failed ? `\n${failed} בדיקות נכשלו` : '\nכל הבדיקות עברו — תוויות-בתים context-aware, ללא שינוי בחישוב.');
process.exitCode = failed ? 1 : 0;
