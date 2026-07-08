/**
 * _test_kashf_commerce_context_coherence.mjs
 *
 * ביקורת-קוהרנטיות בהיקף-גדול לחיבור kashf-context-sanitizer.js אל
 * kashf-commerce-smart-layer.js (KASHF_COMMERCE_CONTEXT_COHERENCE_REVIEW.md).
 * מריץ N לוחות-אמיתיים-אקראיים × מגוון-שילובי-context, ובודק שאין:
 * דליפת-phone/dynFields-רגישים, "בעל-עסק" ל-employed, החלשת-סתירות,
 * שינוי-חישוב, או דליפה לנושאים-אחרים. כולל גם 3 מקרי-קצה קבועים
 * (self+low-certainty, self+contradiction, unemployed+positive) שנמצאו
 * בביקורת המקורית, לרגרסיה-קבועה בלי-תלות-ברנדום.
 */

import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { buildKashfReading } from './goral-hachol/engine/kashf-reading-engine.js';
import { writeKashfReading } from './goral-hachol/engine/kashf-narrative-writer.js';

let failures = 0;
function assert(condition, message) {
  if (!condition) { failures++; console.error(`✗ ${message}`); }
  else { console.log(`✓ ${message}`); }
}

const ALL = ['1111','1112','1121','1122','1211','1212','1221','1222','2111','2112','2121','2122','2211','2212','2221','2222'];
const PHONE = '0521234567';
const SENSITIVE_MARK = 'ZZZSENSITIVE999';
const NONSENSITIVE_MARK = 'MATTER777';

const CONTEXT_PROFILES = [
  { label: 'none', ctx: {} },
  { label: 'workStatus:employed', ctx: { workStatus: 'employed' } },
  { label: 'workStatus:self', ctx: { workStatus: 'self' } },
  { label: 'workStatus:unemployed', ctx: { workStatus: 'unemployed' } },
  { label: 'maritalStatus:married', ctx: { maritalStatus: 'married' } },
  { label: 'hasChildren:yes', ctx: { hasChildren: 'yes' } },
  { label: 'dynFields:sensitive', ctx: { dynFields: { symptoms: SENSITIVE_MARK } } },
  { label: 'phone', ctx: { phone: PHONE } },
  { label: 'self+married+children+phone+dynFields-sensitive', ctx: { workStatus: 'self', maritalStatus: 'married', hasChildren: 'yes', phone: PHONE, dynFields: { symptoms: SENSITIVE_MARK, matter: NONSENSITIVE_MARK } } },
];

console.log('\n--- בדיקה בהיקף-גדול: 500 לוחות × 9 פרופילי-context ---');
{
  let total = 0;
  const localFailures = [];
  for (let i = 0; i < 500; i++) {
    const mothers = Array.from({ length: 4 }, () => ALL[Math.floor(Math.random() * 16)]);
    const board = buildRamlBoardFromMothers(mothers);
    const baseline = buildKashfReading(board, 'commerce', { name: 'בדיקה', question: 'האם העסק ירוויח?' });
    if (!baseline.valid) continue;
    total++;
    const baselineLayer = baseline.commerceSmartLayer;

    for (const profile of CONTEXT_PROFILES) {
      const ctx = { name: 'בדיקה', question: 'האם העסק ירוויח?', ...profile.ctx };
      const reading = buildKashfReading(board, 'commerce', ctx);
      const layer = reading.commerceSmartLayer;
      const html = writeKashfReading(reading);
      const rec = { mothers, profile: profile.label };

      if (html.includes(PHONE)) localFailures.push({ ...rec, check: 'phone-in-html' });
      if (html.includes(SENSITIVE_MARK)) localFailures.push({ ...rec, check: 'sensitive-dynfield-in-html' });
      if (html.includes(NONSENSITIVE_MARK)) localFailures.push({ ...rec, check: 'nonsensitive-dynfield-in-html' });
      if (profile.label.startsWith('workStatus:employed') && (html.includes('בעל עסק') || html.includes('העסק שלך'))) {
        localFailures.push({ ...rec, check: 'employed-implies-business-owner' });
      }
      if (reading.overallPositive !== baseline.overallPositive) localFailures.push({ ...rec, check: 'overallPositive-changed' });
      if (layer?.certaintyLevel !== baselineLayer?.certaintyLevel) localFailures.push({ ...rec, check: 'certaintyLevel-changed' });
      if ((layer?.contradictions?.length || 0) !== (baselineLayer?.contradictions?.length || 0)) localFailures.push({ ...rec, check: 'contradictions-count-changed' });
      if (JSON.stringify(reading.primaryFormula) !== JSON.stringify(baseline.primaryFormula)) localFailures.push({ ...rec, check: 'primaryFormula-changed' });
      if (layer?.clientWording !== baselineLayer?.clientWording) localFailures.push({ ...rec, check: 'clientWording-changed' });
      if ((layer?.contradictions?.length || 0) > 0 && html.includes('זה זמן טוב להתקדם')) localFailures.push({ ...rec, check: 'positive-phrase-alongside-contradiction' });
    }
  }
  assert(total > 400, `נבדקו ${total} לוחות-תקינים (יעד: 400+)`);
  assert(localFailures.length === 0, `0 כשלים מתוך ${total * CONTEXT_PROFILES.length} שילובי-בדיקה (בפועל: ${localFailures.length})`);
  if (localFailures.length) console.error(JSON.stringify(localFailures.slice(0, 5), null, 2));
}

// ── מקרי-קצה קבועים, שנמצאו בביקורת המקורית ────────────────────────────
console.log('\n--- מקרי-קצה קבועים ---');
{
  // self + certaintyLevel low (בלי סתירה)
  const board1 = buildRamlBoardFromMothers(['1112', '1122', '2211', '1112']);
  const r1 = buildKashfReading(board1, 'commerce', { name: 'x', question: 'q', workStatus: 'self' });
  assert(r1.commerceSmartLayer.certaintyLevel === 'low', 'מקרה self+low-certainty: certaintyLevel אכן low');
  assert(!r1.commerceSmartLayer.contradictions.length, 'מקרה self+low-certainty: אין contradiction (מבודד-נכון)');
  const html1 = writeKashfReading(r1);
  assert(html1.includes('אי-ודאות של ממש'), 'האזהרה-הבסיסית של ודאות-נמוכה מופיעה');
  assert(html1.includes('פעילות עצמאית שלך'), 'תוספת-ה-self מופיעה גם-כן — שתי-האזהרות מתקיימות-יחד, לא-סותרות');

  // self + contradiction
  const board2 = buildRamlBoardFromMothers(['2111', '1222', '2212', '1211']);
  const r2 = buildKashfReading(board2, 'commerce', { name: 'x', question: 'q', workStatus: 'self' });
  assert(r2.commerceSmartLayer.contradictions.length === 1, 'מקרה self+contradiction: יש סתירה');
  const html2 = writeKashfReading(r2);
  assert(html2.includes('סתירה בין סימנים'), 'הודעת-הסתירה מופיעה');
  assert(!html2.includes('זה זמן טוב להתקדם'), 'אין "זמן טוב להתקדם" לצד סתירה');
  assert(!html2.includes('פעילות עצמאית שלך'), 'משפט-ה-self לא-מתווסף כשיש-סתירה (לא-מדלל את האזהרה)');

  // unemployed + primaryVerdict positive (הצירוף תקין וקוהרנטי, לא-סותר)
  const board3 = buildRamlBoardFromMothers(['1222', '2121', '1212', '1121']);
  const r3 = buildKashfReading(board3, 'commerce', { name: 'x', question: 'q', workStatus: 'unemployed' });
  const html3 = writeKashfReading(r3);
  assert(html3.includes('זה זמן טוב להתקדם'), 'מקרה unemployed+positive: הפסיקה-החיובית-מהלוח נשארת (context לא-הופך אותה)');
  assert(html3.includes('אין כרגע הכנסה קבועה'), 'מקרה unemployed+positive: אזהרת-הזהירות-הכספית מתווספת בנוסף, לא-מחליפה');
}

console.log('');
if (failures > 0) {
  console.error(`${failures} בדיקות נכשלו.`);
  process.exit(1);
}
console.log('כל הבדיקות עברו. אין דליפת phone/dynFields-רגישים, employed לא-הופך-לבעל-עסק, self/unemployed לא-מחלישים-סתירות ולא-הופכים שלילי-לחיובי, חישוב-הלוח לא-מושפע.');
