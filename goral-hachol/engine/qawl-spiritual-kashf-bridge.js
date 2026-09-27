/**
 * Independent al-Qawl al-Jami' spiritual reading on the board displayed in
 * Kashf mode. The rules belong to al-Qawl al-Jami', pp. 56-58, NOT to Kashf.
 * Only the printed figure/house rules, 7-by-7 count, and conditional 15x4
 * derivation are enabled. No score, inferred sorcerer identity, or treasure
 * location is imported from the old Hawi diagnostics runtime.
 */
import { RAML_SPIRITUAL_DIAGNOSTICS_SIHR_MASS_HASAD as SOURCE } from '../data/sources/approved-raml/spiritual-diagnostics/raml-spiritual-diagnostics-sihr-mass-hasad.js';
import { HAWI_FIGURE_NAMES_BY_ID } from '../data/sources/kashf-al-asrar/kashf-figure-names.js';
import { combineRamlPatterns } from './raml-figures.js';

export const QAWL_SPIRITUAL_QUESTION_IDS = Object.freeze(['q-sorcery', 'q-sorcery-h10', 'q-jinn-type']);
const QAWL_PATTERN_BY_ARABIC = Object.freeze({
  'الأنكيس': '2221', 'الجودلة': '1121', 'القبض الداخل': '2121',
  'الأحيان': '1222', 'العقلة': '1221', 'الجماعة': '2222',
});
const DIRECT_RULE_IDS = new Set([
  'ankis-house6-buried-magic-in-grave',
  'jawdala-house6-drunk-magic',
  'jawdala-house12-bound-from-wife',
  'qabd-dakhil-house6-bound-from-women',
  'hayyan-house10-also-bewitched',
  'aqla-house13-bound-magic-sprinkled',
  'aqla-house14-house-or-place-has-magic',
  'jamaa-house6-umm-sibyan-blocks-marriage-pregnancy-children',
]);
const DERIVED_RULES = Object.freeze([
  { parents: [9, 10], witness: 13, pattern: '2122', id: 'jamaa-from-two-humra-strong-envy' },
  { parents: [11, 12], witness: 14, pattern: '2122', id: 'jamaa-from-two-humra-strong-envy' },
  { parents: [9, 10], witness: 13, pattern: '2221', id: 'jamaa-from-two-ankis-two-buried-magics-renewed-periodically' },
  { parents: [11, 12], witness: 14, pattern: '2221', id: 'jamaa-from-two-ankis-two-buried-magics-renewed-periodically' },
]);

function normalizeEntries(board) {
  const entries = board?.entries || board?.chart || board;
  if (!Array.isArray(entries) || entries.length !== 16 || board?.boardValidation?.isValid === false) return null;
  const result = Array(16);
  for (const entry of entries) {
    const house = Number(entry?.houseNumber ?? entry?.house);
    const pattern = entry?.pattern ?? entry?.key;
    if (!Number.isInteger(house) || house < 1 || house > 16 || !/^[12]{4}$/.test(pattern) || result[house - 1]) return null;
    result[house - 1] = pattern;
  }
  return result.every(Boolean) ? result : null;
}

function ruleEvidence(rule, houses) {
  return {
    id: rule.id,
    houses,
    text: (rule.hebrewTranslation || []).join(' '),
    sourceBook: 'القول الجامع في علم الرمل',
    sourcePage: 57,
    kind: 'figure-house',
  };
}

function directEvidence(patterns, gender) {
  const isFemale = /^(נקבה|אישה|אשה|female|woman)$/i.test(String(gender || '').trim());
  return SOURCE.figureHouseRules
    .filter(rule => DIRECT_RULE_IDS.has(rule.id))
    .filter(rule => rule.id !== 'jamaa-house6-umm-sibyan-blocks-marriage-pregnancy-children' || isFemale)
    .filter(rule => patterns[rule.house - 1] === QAWL_PATTERN_BY_ARABIC[rule.figure])
    .map(rule => ruleEvidence(rule, [rule.house]));
}

function derivedEvidence(patterns) {
  return DERIVED_RULES.filter(({ parents, witness, pattern }) =>
    patterns[witness - 1] === '2222' && parents.every(h => patterns[h - 1] === pattern)
  ).map(({ parents, witness, id }) => {
    const rule = SOURCE.figureHouseRules.find(r => r.id === id);
    return ruleEvidence(rule, [...parents, witness]);
  });
}

function countOpenPoints(patterns) {
  return patterns.join('').split('').filter(ch => ch === '1').length;
}

function jinnTypeEvidence(patterns) {
  // Printed p. 58: multiply house 15 by house 4, then classify the RESULT.
  const resultPattern = combineRamlPatterns(patterns[14], patterns[3]);
  const elementHebrew = HAWI_FIGURE_NAMES_BY_ID[resultPattern]?.elementHebrew;
  const element = { 'אש': 'fire', 'אוויר': 'air', 'מים': 'water', 'עפר': 'earth' }[elementHebrew];
  const rule = SOURCE.jinnTypeRules.find(r => r.element === element);
  return rule ? {
    id: rule.id,
    houses: [15, 4],
    resultPattern,
    resultFigure: HAWI_FIGURE_NAMES_BY_ID[resultPattern]?.hebrewName || resultPattern,
    text: rule.resultHebrew,
    sourceBook: 'القول الجامع في علم الرمل',
    sourcePage: 58,
    kind: 'conditional-jinn-type',
  } : null;
}

export function buildQawlSpiritualReading(board, questionId = 'q-sorcery', clientContext = {}) {
  if (!QAWL_SPIRITUAL_QUESTION_IDS.includes(questionId)) {
    return { valid: false, status: 'unsupported-question', evidence: [] };
  }
  const patterns = normalizeEntries(board);
  if (!patterns) {
    return { valid: false, status: 'invalid-board', questionId, evidence: [], message: 'נדרש לוח גורל תקין ומלא בן 16 בתים.' };
  }
  const openCount = countOpenPoints(patterns);
  if (openCount === 0) {
    return {
      valid: false, status: 'source-unresolved-zero-open', questionId, evidence: [],
      message: 'בלוח אין נקודות פתוחות. פרק 7×7 מפרט שאריות 1–7 אך אינו מכריע כאן איך לטפל באפס; אין להפיק פסק מן הכלל הזה.',
    };
  }
  const remainder = ((openCount - 1) % 7) + 1;
  const isqat = SOURCE.isqatSevenRules.results.find(r => r.remainder === remainder);
  const direct = [...directEvidence(patterns, clientContext.gender), ...derivedEvidence(patterns)];
  const jinnType = questionId === 'q-jinn-type' && remainder === 1 ? jinnTypeEvidence(patterns) : null;

  return {
    valid: true,
    status: 'ok',
    sourceVolume: 'al-qawl-al-jami',
    sourceBook: 'القول الجامع في علم الرمل',
    questionId,
    openCount,
    remainder,
    // p. 58 counts the open points on the whole board, then reduces by seven.
    isqatEvidence: {
      id: 'isqat-7-7-spiritual-diagnosis', sourcePage: 58,
      sourceBook: 'القول الجامع في علم الرمل', text: isqat.hebrew,
      kind: 'open-points-remainder',
    },
    directEvidence: direct,
    jinnTypeEvidence: jinnType,
    evidence: [
      { id: 'isqat-7-7-spiritual-diagnosis', sourcePage: 58 },
      ...direct.map(({ id, sourcePage, houses }) => ({ id, sourcePage, houses })),
      ...(jinnType ? [{ id: jinnType.id, sourcePage: 58, houses: [15, 4] }] : []),
    ],
    // Absence of a matching house rule is not a negative verdict.
    verdict: null,
  };
}

function escapeHtml(value) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

export function writeQawlSpiritualReading(reading) {
  if (!reading?.valid) {
    return `<div class="kashf-reading-output blocked"><div class="kashf-reading-error">${escapeHtml(reading?.message || 'הבדיקה אינה זמינה לשאלה זו.')}</div></div>`;
  }
  const ruleItems = reading.directEvidence.map(e => `<li>${escapeHtml(e.text)} (בתים ${e.houses.join(', ')})</li>`).join('');
  const type = reading.questionId === 'q-jinn-type'
    ? reading.jinnTypeEvidence
      ? `<p>15×4: ${escapeHtml(reading.jinnTypeEvidence.resultFigure)} (${escapeHtml(reading.jinnTypeEvidence.resultPattern)}) — ${escapeHtml(reading.jinnTypeEvidence.text)}.</p>`
      : '<p>שיטת סוג הג׳ין 15×4 אינה מופעלת כאן: שארית 7×7 לא הצביעה על מס ג׳ין.</p>'
    : '';
  return `<div class="kashf-reading-output qawl-spiritual-reading" dir="rtl">
    <h3>בדיקה רוחנית — מקור משלים</h3>
    <p>שיטת 7×7: ${escapeHtml(reading.isqatEvidence.text)}</p>
    ${ruleItems ? `<p>כללי צורה ובית שנמצאו בלוח:</p><ul>${ruleItems}</ul>` : '<p>לא נמצאה בלוח התאמה לכללי הצורה והבית שנבדקו; אין בכך לבדו הכרעה שאין פגיעה.</p>'}
    ${type}
    <details><summary>פרטי חישוב ומקור ליועץ</summary>
      <p>القول الجامع في علم الرمل, עמ׳ 56–58. הספר נבדל מכשף אל־אסראר.</p>
      <p>7×7: ${reading.openCount} נקודות פתוחות בכל 16 הבתים; שארית ${reading.remainder}.</p>
      ${reading.jinnTypeEvidence ? '<p>סוג ג׳ין: צורת בית 15 הוכתה בצורת בית 4; יסוד הצורה שנולדה קובע.</p>' : ''}
      <p>כללי 7×7 וכללי הצורה והבית מוצגים כראיות נפרדות. הספר אינו נותן כאן נוסחת דירוג או הכרעת רוב ביניהם.</p>
      <p>אין להסיק מן הכללים האלה שם מכשף, מיקום חפץ או סיבה רפואית.</p>
    </details>
  </div>`;
}
