#!/usr/bin/env node
import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, text) { fs.writeFileSync(path, text, 'utf8'); }
function replaceOnce(text, from, to, label) {
  const count = text.split(from).length - 1;
  if (count !== 1) throw new Error(`${label}: expected exactly 1 literal match, found ${count}`);
  return text.replace(from, to);
}
function replaceBetween(text, start, end, replacement, label) {
  const i = text.indexOf(start);
  if (i === -1) throw new Error(`${label}: start anchor not found`);
  const j = text.indexOf(end, i + start.length);
  if (j === -1) throw new Error(`${label}: end anchor not found`);
  if (text.indexOf(start, i + 1) !== -1) throw new Error(`${label}: start anchor is not unique`);
  return text.slice(0, i) + replacement + text.slice(j + end.length);
}

// 1) Canonical routing regression: close all p211 state branches, especially mixed fixed/mutable.
{
  const path = '_test_kashf_canonical_routing.mjs';
  let text = read(path);
  const tests = `\n// ── Batch 12: p211 complete H7 marriage matrix ---------------------------\nconst p211FixedBenefic = buildKashfReadingByQuestionId(makeP204Board({ 7: '2212' }), 'q-divorce');\nconst p211FixedMalefic = buildKashfReadingByQuestionId(makeP204Board({ 7: '2222' }), 'q-divorce');\nconst p211MutableBenefic = buildKashfReadingByQuestionId(makeP204Board({ 7: '1121' }), 'q-divorce');\nconst p211MutableMalefic = buildKashfReadingByQuestionId(makeP204Board({ 7: '1111' }), 'q-divorce');\n\nassert(p211FixedBenefic.primaryFormula?.result?.executorResult?.sourceOutcome === 'fixed-benefic-repair', 'p211 fixed mixed-benefic H7 reaches the source repair branch');\nassert(p211FixedBenefic.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'mixed', 'p211 fixed-benefic fixture remains canonically mixed');\nassert(p211FixedBenefic.primaryFormula?.result?.executorResult?.sourceValence === 'saad', 'p211 fixed-benefic uses its source tendency only inside p211');\nassert(p211FixedMalefic.primaryFormula?.result?.executorResult?.sourceOutcome === 'fixed-malefic-distress-origin-man', 'p211 fixed mixed-malefic H7 reaches the missing adverse fixed branch');\nassert(p211FixedMalefic.primaryFormula?.result?.executorResult?.sourceValence === 'nahs', 'p211 fixed-malefic uses source tendency without changing canonical mixed class');\nassert(p211MutableBenefic.primaryFormula?.result?.executorResult?.sourceOutcome === 'mutable-benefic-joy-love-wealth', 'p211 mutable mixed-benefic H7 reaches the source joy/love/wealth branch');\nassert(p211MutableBenefic.primaryFormula?.result?.executorResult?.sourceValence === 'saad', 'p211 mutable-benefic source valence is method-local');\nassert(p211MutableMalefic.primaryFormula?.result?.executorResult?.sourceOutcome === 'mutable-malefic-breakdown-separation', 'p211 mutable mixed-malefic H7 reaches the source separation branch');\nassert(p211MutableMalefic.primaryFormula?.result?.executorResult?.sourceValence === 'nahs', 'p211 mutable-malefic source valence is method-local');\nassert(String(p211MutableMalefic.primaryFormula?.result?.executorResult?.outputHebrew || '').includes('בלשון המקור: העזיבה עדיפה'), 'p211 preserves the adverse mutable advice explicitly as source wording');\nassert(p211FixedBenefic.primaryFormula?.sourceText === getKashfV57Knowledge('marriage.p211.dissolutionH7StateMatrix')?.v57?.hebrewRule, 'p211 full runtime sourceText is the promoted Hebrew v57 matrix');\nassert([p211Stable,p211Quarrel,p211PossibleSeparation,p211Breakdown,p211FixedBenefic,p211FixedMalefic,p211MutableBenefic,p211MutableMalefic].every((r) => r.primaryFormula?.result?.executorResult?.sourceOutcome !== 'unresolved'), 'p211 all eight source state/valence branches resolve without fallback');\nassert([p211FixedBenefic,p211FixedMalefic,p211MutableBenefic,p211MutableMalefic].every((r) => r.primaryFormula?.result?.executorResult?.sourceValenceBasis === 'mixed-tendency-for-p211-only'), 'p211 fixed/mutable mixed-tendency exception stays explicitly scoped');\n\n`;
  text = replaceOnce(
    text,
    "console.log(`Kashf canonical routing tests: ${passed} passed, ${failed} failed`);",
    tests + "console.log(`Kashf canonical routing tests: ${passed} passed, ${failed} failed`);",
    'append p211 canonical regression',
  );
  write(path, text);
}

// 2) Status: 43/43, no remaining runnable backfill method.
{
  const path = 'HALL_WISDOM_KASHF_PROFESSIONAL_VERDICT_BACKFILL_STATUS.md';
  let text = read(path);
  text = replaceOnce(text, '> תאריך: 2026-09-08', '> תאריך: 2026-09-09', 'status date');
  text = replaceOnce(text, '- מוסמכים מקצועית לאחר Batch 11: **42/43**.', '- מוסמכים מקצועית לאחר Batch 12: **43/43**.', 'status 43 certified');
  text = replaceOnce(text, '- ממתינים להסמכה רטרואקטיבית: **1/43**.', '- ממתינים להסמכה רטרואקטיבית: **0/43**.', 'status zero pending');

  const p254Row = '| profession.p254.h9Planet | certified | PV-BF11-P254-* | H9 נקבע מטבלת הייחוס המלאה עמ׳ 133–134: נלחם→נוגה, סוהר→שבתאי, ראש=1212, זנב=1112; H10/H11 הם רק סייג חד-כיווני של קלות ודורשים שני מיטיבים טהורים |';
  text = replaceOnce(
    text,
    p254Row,
    p254Row + "\n| marriage.p211.dissolutionH7StateMatrix | certified | PV-BF12-P211-* | מטריצת H7 המלאה מעמ׳ 211: פנימי/חיצוני/קבוע/מתהפך × מיטיב/מזיק; שלושת הענפים החסרים הועלו ל-v57; mixedTendency משמש רק בענפי קבוע/מתהפך של p211 |",
    'insert p211 certified row',
  );

  const auditStart = '## Audit פתוח — לא להסמיך עדיין';
  const auditEnd = '## Batch 08 — p179 Money Source raw-scan closure';
  text = replaceBetween(
    text,
    auditStart,
    auditEnd,
    '## Audit פתוח — הושלם\n\nאין עוד runnable methods במסלול Professional Backfill שממתינים להסמכה. כל 43 המנועים שהיו source-ready+runnable בתחילת התהליך מוסמכים כעת. ששת המנועים ללא executor נשארים במסלול Source Closure הנפרד ואינם חלק ממכנה 43 זה.\n\n## Batch 08 — p179 Money Source raw-scan closure',
    'close final audit section',
  );

  text += [
    '',
    '## Batch 12 — p211 Complete H7 marriage matrix closure',
    '',
    '`marriage.p211.dissolutionH7StateMatrix` נסגר מול הסריקה הערבית בעמ׳ 211. הנוסח התפעולי הקודם כלל פנימי, מזיק־פנימי, מיטיב־חיצוני, מזיק־חיצוני ומיטיב־קבוע, אך חסרו בו שלושה ענפים מפורשים מן המקור: מזיק־קבוע, מיטיב־מתהפך ומזיק־מתהפך. שלושת הענפים הועלו תחילה ל-v57 ורק לאחר מכן למבצע הקנוני ול-Professional Verdict Safety.',
    '',
    'בקטלוג הצורות, הצורות הקבועות והמתהפכות הרלוונטיות כוללות גם `ממוזג-מיטיב` ו-`ממוזג-מזיק`. כדי לממש את זוג הענפים سعد/نحس שהמקור עצמו נותן למצבים האלה, p211 משתמש ב-`mixedTendency` כ-valence מקומי בלבד. הסיווג הקנוני של הצורה נשאר `mixed`, והחריג אינו משנה שום שיטה אחרת שבה ממוזג חייב להישאר לא מוכרע.',
    '',
    'הענף מיטיב־חיצוני נשמר כלשונו כאפשרות לפרידה ולא כוודאות. בענף מזיק־מתהפך נשמרת לשון המקור שהעזיבה עדיפה, אך היא מסומנת במפורש כלשון המקור ואינה מורחבת להמלצת יועץ עצמאית.',
    '',
    'לאחר Batch 12 מצב ה-Professional Backfill הוא **43/43 — 100%**. אין עוד runnable method במסלול זה ללא הסמכה מקצועית.',
    '',
  ].join('\n');
  write(path, text);
}

console.log('Professional Verdict Safety backfill batch 12 part 3 applied.');
