/**
 * _test_kashf_commerce_smart_layer.mjs
 *
 * 5 בדיקות-חובה לפי KASHF_FIRST_TOPIC_SMART_REWRITE_PROPOSAL.md סעיף 6:
 * מקרה פשוט, מקרה מורכב, מקרה עם סימנים סותרים, מקרה עם ודאות נמוכה,
 * מקרה שבו צריך fallback. בלוחות אמיתיים דרך buildRamlBoardFromMothers +
 * buildKashfReading — לא מדומיינים.
 */

import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { buildKashfReading } from './goral-hachol/engine/kashf-reading-engine.js';
import { writeKashfReading } from './goral-hachol/engine/kashf-narrative-writer.js';
import { computeCommerceSmartLayer } from './goral-hachol/engine/kashf-commerce-smart-layer.js';

let failures = 0;
function assert(condition, message) {
  if (!condition) { failures++; console.error(`✗ ${message}`); }
  else { console.log(`✓ ${message}`); }
}

function commerceReading(mothers) {
  const board = buildRamlBoardFromMothers(mothers);
  return buildKashfReading(board, 'commerce', { name: 'ראובן', question: 'האם העסק ירוויח?' });
}

// ── 1. מקרה פשוט (ודאות גבוהה, פסיקה ברורה) ─────────────────────────────
console.log('\n--- מקרה 1: פשוט (ודאות גבוהה) ---');
{
  const reading = commerceReading(['1112', '2122', '1121', '2211']);
  const layer = reading.commerceSmartLayer;
  assert(reading.valid, 'הלוח תקין');
  assert(!!layer, 'commerceSmartLayer חושב בהצלחה');
  assert(layer.certaintyLevel === 'high', `certaintyLevel === 'high' (בפועל: ${layer?.certaintyLevel})`);
  assert(typeof layer.clientWording === 'string' && layer.clientWording.length > 10, 'clientWording נבנה כמחרוזת משמעותית');
  assert(layer.clientWording.includes('בית המבקש') && layer.clientWording.includes('בית אחרית'), 'clientWording מזכיר גם מבקש וגם אחרית');
  const html = writeKashfReading(reading);
  assert(html.includes(layer.clientWording.split('.')[0]), 'הניסוח-החדש אכן מופיע בפלט ה-HTML הסופי');
  console.log('   clientWording:', layer.clientWording);
}

// ── 2. מקרה מורכב (ודאות בינונית, פולריות-מעורבת חלקית) ──────────────────
console.log('\n--- מקרה 2: מורכב (ודאות בינונית) ---');
{
  const reading = commerceReading(['1122', '1212', '1122', '2221']);
  const layer = reading.commerceSmartLayer;
  assert(!!layer, 'commerceSmartLayer חושב בהצלחה');
  assert(layer.certaintyLevel === 'medium', `certaintyLevel === 'medium' (בפועל: ${layer?.certaintyLevel})`);
  assert(layer.clientWording.includes('לא לגמרי חד-משמעית'), 'הניסוח-החדש מציין מפורשות שהתמונה לא חד-משמעית');
  console.log('   clientWording:', layer.clientWording);
}

// ── 3. מקרה עם סימנים סותרים (primary מול alt) ───────────────────────────
console.log('\n--- מקרה 3: סימנים סותרים (primary≠alt) ---');
{
  const reading = commerceReading(['1211', '2121', '2112', '1222']);
  const layer = reading.commerceSmartLayer;
  assert(!!layer, 'commerceSmartLayer חושב בהצלחה');
  assert(layer.contradictions.length === 1, `contradictions מזהה סתירה אחת (בפועל: ${layer?.contradictions?.length})`);
  assert(layer.contradictions[0].primary !== layer.contradictions[0].alt, 'primary ו-alt אכן חלוקים');
  assert(!layer.practicalGuidance.includes('זמן טוב להתקדם'), 'practicalGuidance לא מכיל "זמן טוב להתקדם" כשיש סתירה');
  assert(layer.practicalGuidance.includes('סתירה'), 'practicalGuidance מזכיר במפורש "סתירה" כשיש contradictions');
  const html = writeKashfReading(reading);
  assert(html.includes('בדיקת אימות נוספת'), 'גילוי-הסתירה הכללי (WORKPLAN #18) עדיין מופיע בפלט, לא נדרס');
  assert(!html.includes('זה זמן טוב להתקדם'), 'הפלט הסופי (HTML) לא מכיל "זה זמן טוב להתקדם" ליד הסתירה');
  console.log('   contradictions:', JSON.stringify(layer.contradictions));
  console.log('   practicalGuidance:', layer.practicalGuidance);
}

// ── 3ב. מקרה נוסף שנתפס בביקורת (KASHF_COMMERCE_SMART_LAYER_REVIEW.md §4):
// overallPositive=true עם supportRatio גבוה, אך primary/alt חלוקים — בדיוק
// התרחיש שבו נמצא הבאג המקורי (practicalGuidance התעלם מ-contradictions).
console.log('\n--- מקרה 3ב: הדוגמה-מהביקורת שחשפה את הבאג המקורי ---');
{
  const reading = commerceReading(['1122', '1222', '1111', '2111']);
  const layer = reading.commerceSmartLayer;
  assert(!!layer, 'commerceSmartLayer חושב בהצלחה');
  assert(layer.contradictions.length === 1, `contradictions מזהה סתירה (בפועל: ${layer?.contradictions?.length})`);
  assert(layer.certaintyLevel !== 'high', `certaintyLevel לא 'high' כשיש סתירה (בפועל: ${layer?.certaintyLevel})`);
  assert(!layer.clientWording.includes('זמן טוב'), 'clientWording לא מרמז-להתקדמות-בטוחה');
  assert(!layer.practicalGuidance.includes('זמן טוב להתקדם'), 'practicalGuidance לא "זמן טוב להתקדם"');
  const html = writeKashfReading(reading);
  assert(!html.includes('זה זמן טוב להתקדם'), 'הפלט הסופי לא מכיל את הניסוח-החיובי-מדי לצד הסתירה (הבאג המקורי תוקן)');
  console.log('   certaintyLevel:', layer.certaintyLevel);
  console.log('   clientWording:', layer.clientWording);
  console.log('   practicalGuidance:', layer.practicalGuidance);
}

// ── 4. מקרה עם ודאות נמוכה (בלי contradiction — נבדל במפורש ממקרה 3/3ב) ───
console.log('\n--- מקרה 4: ודאות נמוכה (בלי סתירה) ---');
{
  const reading = commerceReading(['2112', '2122', '1112', '1222']);
  const layer = reading.commerceSmartLayer;
  assert(!!layer, 'commerceSmartLayer חושב בהצלחה');
  assert(layer.contradictions.length === 0, `נבחר-בכוונה לוח בלי contradiction, כדי לבודד את מקרה-הודאות-הנמוכה (בפועל: ${layer?.contradictions?.length})`);
  assert(layer.certaintyLevel === 'low', `certaintyLevel === 'low' (בפועל: ${layer?.certaintyLevel})`);
  assert(layer.clientWording.includes('אי-ודאות של ממש'), 'הניסוח-החדש מזהיר-במפורש מפני אי-ודאות');
  assert(layer.practicalGuidance.includes('לבדוק שוב'), 'ההמלצה-המעשית משקפת זהירות, לא ודאות מזויפת');
  console.log('   clientWording:', layer.clientWording);
  console.log('   practicalGuidance:', layer.practicalGuidance);
}

// ── 5. מקרה שבו צריך fallback ─────────────────────────────────────────────
console.log('\n--- מקרה 5: fallback ---');
{
  // 5א: reading לא-תקין (topicId שגוי) — computeCommerceSmartLayer מחזירה null
  assert(computeCommerceSmartLayer(null) === null, 'reading=null → מחזירה null, לא זורקת');
  assert(computeCommerceSmartLayer({ valid: true, topicId: 'money' }) === null, 'topicId שאינו commerce → מחזירה null');
  assert(computeCommerceSmartLayer({ valid: false, topicId: 'commerce' }) === null, 'reading.valid=false → מחזירה null');

  // 5ב: נושא אחר לגמרי (money) — commerceSmartLayer חייב להיות null, וההתנהגות הישנה חייבת להישאר זהה
  const board = buildRamlBoardFromMothers(['1112', '2122', '1121', '2211']);
  const moneyReading = buildKashfReading(board, 'money', { name: 'ראובן', question: 'מה מצב הכסף?' });
  assert(moneyReading.commerceSmartLayer === undefined || moneyReading.commerceSmartLayer === null, 'נושא money לא-מקבל commerceSmartLayer בכלל');
  const moneyHtml = writeKashfReading(moneyReading);
  assert(moneyHtml.length > 100, 'נושא money ממשיך לפעול תקין (רגרסיה)');

  // 5ג: אם commerceSmartLayer.clientWording חסר (סימולציה) — writeConclusionPara נופל-חזרה
  const commReading = commerceReading(['1112', '2122', '1121', '2211']);
  const brokenReading = { ...commReading, commerceSmartLayer: null };
  const brokenHtml = writeKashfReading(brokenReading);
  assert(brokenHtml.includes('הלוח מראה מסחר') || brokenHtml.includes('הלוח מורה על הפסדים') || brokenHtml.includes('המסחר אפשרי'), 'כש-commerceSmartLayer=null בכוונה, נופל-חזרה לטקסט TOPIC_GUIDANCE.commerce הישן');
}

console.log('');
if (failures > 0) {
  console.error(`${failures} בדיקות נכשלו.`);
  process.exit(1);
}
console.log('כל 5 המקרים עברו בהצלחה. commerceSmartLayer עובד, גילוי-סתירות משמר, fallback עובד, שאר-הנושאים לא-נפגעו.');
