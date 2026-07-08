/**
 * kashf-commerce-smart-layer.js
 *
 * שכבת-מסקנה חכמה לנושא "מסחר ועסקים" בשיטת כשף אל-אסראר בלבד.
 * הוכחת-היתכנות ראשונה ל-Kashf Architecture Advisor Brain
 * (ראו KASHF_FIRST_TOPIC_SMART_REWRITE_PROPOSAL.md).
 *
 * לא נוגעת בחישוב הגורל עצמו (executeFormula/countQualityInHouses) —
 * רק בונה ניסוח עשיר-יותר מתוך העובדות שכבר חושבו על-ידי buildKashfReading.
 *
 * עצמאית לגמרי מ-narrative-fact-phrasing.js של חאווי — לא מייבאת ממנו
 * דבר. משתמשת אך ורק בנתוני כשף (kashf-figure-names.js, ה-reading של
 * kashf-reading-engine.js).
 */

import { HAWI_FIGURE_NAMES_BY_ID } from '../data/sources/kashf-al-asrar/kashf-figure-names.js';

// משקל לפי חלוקת-התפקידים שהספר עצמו קובע (כשף עמ' 218, מצוטט כבר
// כ-sourceText בבלוק commerce של kashf-topic-rules.js):
// "עשה את הראשון והשני לקונה, את השמיני והשביעי למוכר, את העשירי
// למתווך, ואת החמישה־עשר לאחרית הדבר".
const COMMERCE_HOUSE_WEIGHT = {
  1: 2, 2: 2,   // קונה
  7: 2, 8: 2,   // מוכר
  10: 1,        // מתווך
  15: 3,        // אחרית הדבר — המשקל הגבוה ביותר, ההכרעה הסופית
  4: 1, 11: 1, 16: 1, // בתוך נוסחת-הספירה הראשית, לא נקראים-בשם בחלוקת-התפקידים
};

function fortuneOf(pattern) {
  const fig = HAWI_FIGURE_NAMES_BY_ID?.[pattern];
  if (!fig) return { hebrewName: pattern, fortuneHebrew: '', tone: 0, mixed: false };
  const fortune = fig.fortuneHebrew || '';
  const mixed = fortune.includes('ממוזג');
  const tone = fortune.includes('מזיק') ? -1 : fortune.includes('מיטיב') ? 1 : 0;
  return { hebrewName: fig.hebrewName || pattern, fortuneHebrew: fortune, tone, mixed };
}

function phraseHouse(h, frameLabel) {
  if (!h?.figureName) return '';
  const rulingWord = h.mixed
    ? (h.tone > 0 ? 'ממוזגת-מיטיבה' : h.tone < 0 ? 'ממוזגת-מזיקה' : 'ממוזגת')
    : (h.tone > 0 ? 'מיטיבה' : h.tone < 0 ? 'מזיקה' : 'ניטרלית');
  return `${frameLabel} מראה ${h.figureName} — ${rulingWord}.`;
}

/**
 * בונה שכבת-מסקנה עשירה לנושא מסחר בכשף בלבד. מחזירה null אם reading
 * אינו-תקין או אינו-נושא-מסחר — הקורא נופל-חזרה לניסוח-הקבוע הישן.
 *
 * @param {object} reading - תוצר buildKashfReading (כבר מחושב במלואו)
 * @returns {object|null}
 */
export function computeCommerceSmartLayer(reading) {
  if (!reading || reading.topicId !== 'commerce' || !reading.valid) return null;

  const keyHouseReadings = reading.keyHouseReadings || [];
  const supportingFindings = reading.supportingFindings || [];
  const overallPositive = reading.overallPositive;

  // ── signWeighting ──────────────────────────────────────────────────────
  const weightedHouses = keyHouseReadings
    .filter((h) => !h.error && h.pattern)
    .map((h) => {
      const f = fortuneOf(h.pattern);
      return {
        houseNum: h.houseNum,
        houseName: h.houseName,
        figureName: f.hebrewName || h.figureName,
        fortuneHebrew: f.fortuneHebrew,
        tone: f.tone,
        mixed: f.mixed,
        weight: COMMERCE_HOUSE_WEIGHT[h.houseNum] || 1,
      };
    });

  // ── certaintyLevel ─────────────────────────────────────────────────────
  const totalWeight = weightedHouses.reduce((s, h) => s + h.weight, 0) || 1;
  let supportWeight = 0;
  if (typeof overallPositive === 'boolean') {
    for (const h of weightedHouses) {
      if (h.tone === 0) continue; // ניטרלי — לא סופר לתמיכה ולא-נגד
      const supports = (overallPositive && h.tone > 0) || (!overallPositive && h.tone < 0);
      if (supports) supportWeight += h.weight;
    }
  }
  const supportRatio = totalWeight ? supportWeight / totalWeight : 0;
  const mixedCount = weightedHouses.filter((h) => h.mixed).length;

  let certaintyLevel;
  if (typeof overallPositive !== 'boolean') certaintyLevel = 'low';
  else if (supportRatio >= 0.75 && mixedCount === 0) certaintyLevel = 'high';
  else if (supportRatio >= 0.5) certaintyLevel = 'medium';
  else certaintyLevel = 'low';

  // ── strongestSignals / weakSignals ─────────────────────────────────────
  const strongestSignals = [];
  const weakSignals = [];
  for (const f of supportingFindings) {
    if (f.error) continue;
    if (f.checkType === 'legacy-fn') {
      if (f.outputHebrew && f.verdict !== 'undefined-in-source') {
        strongestSignals.push({ id: f.id, label: f.label, detail: f.outputHebrew });
      }
    } else if (f.checkType === 'house-in-house-check') {
      weakSignals.push({ id: f.id, label: f.label, matches: f.matches });
    }
  }

  // ── contradictions ─────────────────────────────────────────────────────
  const altPositive = reading.altFormula?.verdict?.positive;
  const contradictions = (
    typeof altPositive === 'boolean'
    && typeof overallPositive === 'boolean'
    && altPositive !== overallPositive
  ) ? [{ type: 'primary-vs-alt', primary: overallPositive, alt: altPositive }] : [];

  // ── advisorDiagnosis — מבנה-נתונים מאוגד, לא רינדור-HTML ────────────────
  const advisorDiagnosis = {
    weightedHouses,
    strongestSignals,
    weakSignals,
    contradictions,
    certaintyLevel,
    supportRatio: Math.round(supportRatio * 100) / 100,
  };

  // ── clientWording — משפט קוהרנטי מבתי-התפקיד המרכזיים (מבקש+אחרית) ─────
  const h1 = weightedHouses.find((h) => h.houseNum === 1);
  const h15 = weightedHouses.find((h) => h.houseNum === 15);
  const clauses = [];
  if (h1) clauses.push(phraseHouse(h1, 'בית המבקש בעסקה'));
  if (h15) clauses.push(phraseHouse(h15, 'בית אחרית העסקה'));

  const certaintyPhrase = {
    high: '',
    medium: ' התמונה לא לגמרי חד-משמעית.',
    low: ' יש כאן אי-ודאות של ממש — לא כדאי להסתמך על תשובה אחת בלבד.',
  }[certaintyLevel] || '';

  const clientWording = clauses.length ? `${clauses.join(' ')}${certaintyPhrase}` : null;

  // ── practicalGuidance ──────────────────────────────────────────────────
  let practicalGuidance = null;
  if (certaintyLevel === 'low') {
    practicalGuidance = 'כדאי לבדוק שוב בזמן אחר, או להיעזר בשיקול-דעת נוסף לפני החלטה.';
  } else if (overallPositive === true) {
    practicalGuidance = 'זה זמן טוב להתקדם, בזהירות סבירה.';
  } else if (overallPositive === false) {
    practicalGuidance = 'עדיף להמתין או לבחון תנאים אחרים לפני שממשיכים.';
  }

  return {
    weightedHouses,
    certaintyLevel,
    strongestSignals,
    weakSignals,
    contradictions,
    advisorDiagnosis,
    clientWording,
    practicalGuidance,
  };
}

export default { computeCommerceSmartLayer };
