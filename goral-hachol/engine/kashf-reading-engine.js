/**
 * kashf-reading-engine.js
 *
 * מנוע הקריאה הראשי — שיטת כשף אל-אסרר.
 * מחבר בין נתוני הלוח לבין כללי הנושא ומפיק קריאה מובנית.
 *
 * שימוש:
 *   const reading = buildKashfReading(board, topicId, clientContext);
 *
 * מקורות:
 *   כשף אל-אסרר המצונה — פרקים 1-12 של "השער השישי" (עמ׳ 166-276)
 */

import {
  ROW,
  combineHouses,
  combineSharedHousePair,
  assembleFromRow,
  assembleFromFireRows,
  assembleFromAllRows,
  assembleRowThenCombine,
  assessHouseQuality,
  classifyHouse,
  classifyPattern,
  hasFigureInHouse,
  countQualityInHouses,
  isHouseMasculine,
  getHouseElement,
  isBeneficPlanetPattern,
  getFigureHebrewName,
  getHouseEntry,
  getHousePattern,
  getQualityHebrew,
} from './kashf-formula-engine.js';

import { getTopicRules } from './kashf-topic-rules.js';
import { computeCommerceSmartLayer } from './kashf-commerce-smart-layer.js';
import { getDakhalKharij } from './kashf-figure-classifier.js';
import { computeDhamirByMajority } from './kashf-dhamir.js';
import { computeDhamirType4External } from './kashf-dhamir-type4-external.js';
import { buildLegacyChart } from './kashf-legacy-chart-adapter.js';
import {
  computeThiefProximity,
  computeStolenItemReturn,
  computeEnemyPresenceCheck,
  computePrisonerReleaseCheck,
  computeParnasaLivelihood,
  computeChildrenPregnancyKashfAnalysis,
  computeLoanKashfAnalysis,
  computeFugitiveKashf,
  computeTravelTimingKashf,
  computeAuthorityDurationKashf,
  computeReturnToOfficeKashf,
  computeStateStabilityKashf,
  computeBodyPartDiagnosisKashf,
  computeMoneySourceKashf,
  computeLifespanKashf,
  computeLifespanByFigureShapes,
  computeProfessionH9Kashf,
  computeClothingLuckKashf,
  computeClothingBestFiguresKashf,
  computePromiseFulfillmentKashf,
  computeWhoLooksAtWhomKashf,
  computeWellDrillingKashf,
  computeSodHaDhamirim,
  computeQuerentHonestyCheck,
  computeQuerentSubject,
  computeTimingByDhamirThirds,
  computeQuerentTemperament,
  computeTimingByMadad,
  computeTimingEstimate,
  computeWitnessTestimony,
  computeGeographicDirection,
  countElementsForYesNo,
  computeLostAnimalReturn,
} from './kashf-pending-extraction.js';
import {
  computeFearOfPunishment,
  computePrisonerDurationDanger,
  computeStayOrMove,
  computeWomanModesty,
  computeJoyTimingKashf,
  computeServantMatterKashf,
  computeLifeYearsKashf,
  computeMoneyMagnitudeKashf,
  computeGoodsProfitLossKashf,
  computeHiddenDepthKashf,
  computeRequesterCircleStrengthKashf,
  computeWheelPositionStrengthKashf,
  computeDerekhHouseRuleKashf,
  computeFigureDesireFulfillmentKashf,
  computeFriendTypeByHouse11Kashf,
} from './kashf-book-additions.js';

// countElementsForYesNo מצפה לפורמט board.entries[i].figure.elementHebrew (הפורמט
// הישן של raml-board-generator.js) — עוטפים אותה כדי שתעבוד עם ה-chart המומר,
// ומוסיפים outputHebrew לצורך רינדור אחיד עם שאר בדיקות ה-legacy-fn.
function countElementsForYesNoWrapper(chart) {
  const result = countElementsForYesNo({ entries: chart.map((h) => ({ figure: { elementHebrew: h.element } })) });
  return { ...result, outputHebrew: result?.hebrewSummary || '' };
}

// רשימת פונקציות מותרות ל-checkType 'legacy-fn' — פונקציות שאומתו מול המקור,
// חלקן בעת ההוצאה מ-hawi-interpreter.js (kashf-pending-extraction.js), חלקן
// נכתבו ישירות מאימות מול הספר (kashf-book-additions.js)
const LEGACY_FN_REGISTRY = {
  computeThiefProximity,
  computeStolenItemReturn,
  computeEnemyPresenceCheck,
  computePrisonerReleaseCheck,
  computeParnasaLivelihood,
  computeChildrenPregnancyKashfAnalysis,
  computeLoanKashfAnalysis,
  computeFugitiveKashf,
  computeTravelTimingKashf,
  computeAuthorityDurationKashf,
  computeReturnToOfficeKashf,
  computeStateStabilityKashf,
  computeBodyPartDiagnosisKashf,
  computeMoneySourceKashf,
  computeLifespanKashf,
  computeLifespanByFigureShapes,
  computeProfessionH9Kashf,
  computeClothingLuckKashf,
  computeClothingBestFiguresKashf,
  computePromiseFulfillmentKashf,
  computeWhoLooksAtWhomKashf,
  computeWellDrillingKashf,
  computeGeographicDirection,
  countElementsForYesNo: countElementsForYesNoWrapper,
  computeLostAnimalReturn,
  computeFearOfPunishment,
  computePrisonerDurationDanger,
  computeStayOrMove,
  computeWomanModesty,
  computeJoyTimingKashf,
  computeServantMatterKashf,
  computeLifeYearsKashf,
  computeMoneyMagnitudeKashf,
  computeGoodsProfitLossKashf,
  computeHiddenDepthKashf,
  computeRequesterCircleStrengthKashf,
  computeWheelPositionStrengthKashf,
  computeDerekhHouseRuleKashf,
  computeFigureDesireFulfillmentKashf,
  computeFriendTypeByHouse11Kashf,
};

// ── תיאורי כיוונים לפי יסוד ────────────────────────────────────────────────
const ELEMENT_DIRECTION = {
  fire:  'מזרח',
  air:   'מערב',
  water: 'ים (צפון מערב)',
  earth: 'דרום',
};

const ELEMENT_HEBREW = {
  fire:  'אש',
  air:   'אוויר',
  water: 'מים',
  earth: 'עפר',
};

// ── תיאורי מחלה לפי יסוד ─────────────────────────────────────────────────
const ILLNESS_BY_ELEMENT = {
  fire:  'מן המרה הצהובה — חום יבש',
  air:   'מרוחות שונות ומחלות אוויריות',
  water: 'מצד קור ולחות, כגון בהרת ודומה לה',
  earth: 'מן המרה השחורה — קור יבש',
};

// ── ביצוע נוסחאות ────────────────────────────────────────────────────────

const ROW_BY_NAME = { fire: ROW.FIRE, air: ROW.AIR, water: ROW.WATER, earth: ROW.EARTH };

function executeFormula(board, formula) {
  let resultPattern;
  const { type, houses } = formula;

  if (type === 'parallel-combine') {
    // שתי הולדות מקבילות ובלתי-תלויות, החולקות בית משותף אחד — ללא חיבור
    // בין שתי התוצאות. מקור: כשף אל-אסרר עמ' 182 (KDF-009). אינה כותבת ללוח.
    const { sharedHouse, firstHouse, secondHouse } = formula;
    const parallel = combineSharedHousePair(board, sharedHouse, firstHouse, secondHouse);
    const classificationA = classifyPattern(parallel.resultAPattern);
    const classificationB = classifyPattern(parallel.resultBPattern);
    return {
      type: 'parallel-combine',
      houses,
      ruleId: 'KDF-009',
      operationType: 'parallel_local_derivations',
      inputs: {
        shared: { type: 'house', house: sharedHouse, pattern: parallel.sharedPattern },
        first: { type: 'house', house: firstHouse, pattern: parallel.firstPattern },
        second: { type: 'house', house: secondHouse, pattern: parallel.secondPattern },
      },
      results: [
        {
          id: 'resultA',
          sourceHouses: [sharedHouse, firstHouse],
          resultPattern: parallel.resultAPattern,
          resultCanonicalName: getFigureHebrewName(parallel.resultAPattern),
          classification: classificationA,
        },
        {
          id: 'resultB',
          sourceHouses: [sharedHouse, secondHouse],
          resultPattern: parallel.resultBPattern,
          resultCanonicalName: getFigureHebrewName(parallel.resultBPattern),
          classification: classificationB,
        },
      ],
      writeBackToBoard: false,
    };
  }

  switch (type) {
    case 'fire-row-assemble':
      resultPattern = assembleFromFireRows(board, houses);
      break;
    case 'row-assemble':
      resultPattern = assembleFromRow(board, houses, ROW_BY_NAME[formula.row]);
      break;
    case 'assemble':
      resultPattern = assembleFromAllRows(board, houses);
      break;
    case 'combine':
      resultPattern = combineHouses(board, houses);
      break;
    case 'house-quality':
      resultPattern = getHousePattern(board, houses[0]);
      break;
    case 'count-quality': {
      const counts = countQualityInHouses(board, houses);
      return { type: 'count-quality', counts, houses };
    }
    default:
      throw new Error(`סוג נוסחה לא מוכר: ${type}`);
  }

  const classification = classifyPattern(resultPattern);
  return {
    type,
    houses,
    resultPattern,
    resultFigureName: getFigureHebrewName(resultPattern),
    classification,
  };
}

function getFormulaPrimaryVerdict(formulaResult, formula, interpretBy) {
  const { classification } = formulaResult;

  if (interpretBy === 'dakhal-kharij') {
    const key = classification?.dakhalKharij;
    const map = formula.verdictByDakhalKharij || {};
    return map[key] || { text: classification?.dakhalKharijHebrew || '—', positive: null };
  }

  if (interpretBy === 'saad-nahs') {
    const key = classification?.saadNahs;
    const map = formula.verdictBySaadNahs || {};
    return map[key] || { text: classification?.saadNahsHebrew || '—', positive: null };
  }

  if (interpretBy === 'saad-nahs-parallel') {
    // שתי הולדות בלתי-תלויות (KDF-009) נשפטות כל אחת בנפרד לפי אותו כלל
    // מיטיב/מזיק — אין מיזוג גיאומנטי בין התוצאות. מוצג טקסט משולב כדי
    // שאף אחת מהתוצאות לא תוסתר; positive מוסכם רק כששתי התוצאות מסכימות
    // (אותה מוסכמה כמו verdictBySaadNahs.mixed המשמשת בכל שאר הכללים).
    const map = formula.verdictBySaadNahs || {};
    const verdictFor = (result) => {
      const key = result.classification?.saadNahs;
      return map[key] || { text: result.classification?.saadNahsHebrew || '—', positive: null };
    };
    const [resultA, resultB] = formulaResult.results || [];
    const vA = verdictFor(resultA);
    const vB = verdictFor(resultB);
    const positive = vA.positive === vB.positive ? vA.positive : null;
    // mixed: true מסמן במפורש "שתי תוצאות אמיתיות שאינן מסכימות" — לא
    // "אין תוצאה"/"שגיאה"/"לא ידוע". positive:null נשאר ללא שינוי משמעות;
    // mixed הוא שדה-עזר תיעודי בלבד, לא הכרעה כוללת חדשה שאינה במקור.
    return {
      text: `בית ${resultA.sourceHouses.join('+')}: ${vA.text}; בית ${resultB.sourceHouses.join('+')}: ${vB.text}`,
      positive,
      mixed: vA.positive !== vB.positive,
    };
  }

  if (interpretBy === 'benefic-planet') {
    const isBenefic = isBeneficPlanetPattern(formulaResult.resultPattern);
    const map = formula.verdictByBeneficPlanet || {};
    return isBenefic ? (map.benefic || { text: 'מכוכבי הטוב', positive: true })
                     : (map.malefic || { text: 'ממזיקים', positive: false });
  }

  if (interpretBy === 'count-quality') {
    const { counts } = formulaResult;
    const total = (counts?.saad || 0) + (counts?.nahs || 0) + (counts?.mixed || 0);
    const map = formula.verdictByCountQuality || {};
    if (counts?.saad === total) return map.allSaad || { text: 'כולם מיטיבים', positive: true };
    if (counts?.nahs === total) return map.allNahs || { text: 'כולם מזיקים', positive: false };
    if ((counts?.saad || 0) > (counts?.nahs || 0)) return map.mostSaad || { text: 'רוב מיטיבים', positive: true };
    if ((counts?.nahs || 0) > (counts?.saad || 0)) return map.mostNahs || { text: 'רוב מזיקים', positive: false };
    return map.mixed || { text: 'מעורב', positive: null };
  }

  return { text: '—', positive: null };
}

// ── בדיקות תומכות ────────────────────────────────────────────────────────

function runSupportingCheck(board, check) {
  const { checkType, houses, label, sourceText } = check;

  if (checkType === 'house-quality') {
    const houseNum = houses[0];
    const quality = assessHouseQuality(board, houseNum);
    const figName = getFigureHebrewName(getHousePattern(board, houseNum));
    return {
      id: check.id,
      label,
      checkType,
      houseNum,
      quality,
      qualityHebrew: getQualityHebrew(quality),
      figureName: figName,
      sourceText,
    };
  }

  if (checkType === 'count-quality') {
    const counts = countQualityInHouses(board, houses);
    const total = counts.saad + counts.nahs + counts.mixed;
    let summary;
    if (counts.saad === total) summary = 'כולם מיטיבים';
    else if (counts.nahs === total) summary = 'כולם מזיקים';
    else if (counts.saad > counts.nahs) summary = `רוב מיטיבים (${counts.saad}/${total})`;
    else if (counts.nahs > counts.saad) summary = `רוב מזיקים (${counts.nahs}/${total})`;
    else summary = 'מעורב';
    return { id: check.id, label, checkType, houses, counts, summary, sourceText };
  }

  if (checkType === 'house-dakhal-kharij') {
    const houseNum = houses[0];
    const cls = classifyHouse(board, houseNum);
    return {
      id: check.id,
      label,
      checkType,
      houseNum,
      dakhalKharij: cls.dakhalKharij,
      dakhalKharijHebrew: cls.dakhalKharijHebrew,
      sourceText,
    };
  }

  if (checkType === 'row-assemble-then-combine-dakhal-kharij') {
    const { assembleHouses, row, combineHouse } = check;
    const resultPattern = assembleRowThenCombine(board, assembleHouses, ROW_BY_NAME[row], combineHouse);
    const cls = classifyPattern(resultPattern);
    return {
      id: check.id,
      label,
      checkType,
      houses,
      resultPattern,
      resultFigureName: getFigureHebrewName(resultPattern),
      dakhalKharij: cls.dakhalKharij,
      dakhalKharijHebrew: cls.dakhalKharijHebrew,
      sourceText,
    };
  }

  if (checkType === 'house-gender') {
    const houseNum = houses[0];
    const isMasc = isHouseMasculine(board, houseNum);
    return {
      id: check.id,
      label,
      checkType,
      houseNum,
      gender: isMasc ? 'masculine' : 'feminine',
      genderHebrew: isMasc ? 'זכר' : 'נקבה',
      sourceText,
    };
  }

  if (checkType === 'house-element') {
    const houseNum = houses[0];
    const element = getHouseElement(board, houseNum);
    return {
      id: check.id,
      label,
      checkType,
      houseNum,
      element,
      elementHebrew: ELEMENT_HEBREW[element],
      direction: ELEMENT_DIRECTION[element],
      sourceText,
    };
  }

  if (checkType === 'element-pair') {
    const elements = houses.map(h => getHouseElement(board, h));
    const dominant = elements[0]; // first house is dominant
    return {
      id: check.id,
      label,
      checkType,
      houses,
      elements,
      dominantElement: dominant,
      illnessType: ILLNESS_BY_ELEMENT[dominant],
      sourceText,
    };
  }

  if (checkType === 'house-figure-description') {
    const houseNum = houses[0];
    const pattern = getHousePattern(board, houseNum);
    const figName = getFigureHebrewName(pattern);
    const cls = classifyPattern(pattern);
    return {
      id: check.id,
      label,
      checkType,
      houseNum,
      pattern,
      figureName: figName,
      classification: cls,
      sourceText,
    };
  }

  if (checkType === 'house-in-house-check') {
    // Check if main house's figure matches target house
    const { mainHouse, targetHouse } = check;
    const mainPattern = getHousePattern(board, mainHouse);
    const targetPattern = getHousePattern(board, targetHouse);
    const matches = mainPattern === targetPattern;
    return {
      id: check.id,
      label,
      checkType,
      mainHouse,
      targetHouse,
      matches,
      sourceText,
    };
  }

  if (checkType === 'pattern-lookup') {
    // Map the pattern currently in houses[0] through a fixed pattern→label table
    const { lookupTable, notFoundLabel } = check;
    const houseNum = houses[0];
    const pattern = getHousePattern(board, houseNum);
    const value = lookupTable[pattern] ?? null;
    return {
      id: check.id,
      label,
      checkType,
      houseNum,
      pattern,
      value,
      valueLabel: value ?? (notFoundLabel || 'לא מפורש במקור עבור צורה זו'),
      sourceText,
    };
  }

  if (checkType === 'legacy-fn') {
    const { fnName } = check;
    const fn = LEGACY_FN_REGISTRY[fnName];
    if (typeof fn !== 'function') {
      return { id: check.id, label, checkType, error: `פונקציה לא רשומה: ${fnName}`, sourceText };
    }
    const chart = buildLegacyChart(board);
    let result;
    try {
      result = fn(chart);
    } catch (err) {
      result = { outputHebrew: `שגיאה בהרצת ${fnName}: ${err.message}` };
    }
    return { id: check.id, label, checkType, fnName, ...(result || {}), sourceText };
  }

  if (checkType === 'figure-in-house-group') {
    // Check whether any pattern from `patterns` sits in any house from `houses`
    const { patterns } = check;
    const foundHouses = houses.filter((h) => patterns.includes(getHousePattern(board, h)));
    return {
      id: check.id,
      label,
      checkType,
      houses,
      patterns,
      found: foundHouses.length > 0,
      foundHouses,
      sourceText,
    };
  }

  return { id: check.id, label, checkType, sourceText, note: 'סוג בדיקה לא מוכר' };
}

// ── תיאור בתים מרכזיים ───────────────────────────────────────────────────

export const HOUSE_NAMES = {
  1: 'בית ראשון — הנפש',
  2: 'בית שני — הממון',
  3: 'בית שלישי — האחים',
  4: 'בית רביעי — האחרית והאב',
  5: 'בית חמישי — הילדים',
  6: 'בית שישי — המחלה והמשרתים',
  7: 'בית שביעי — הנישואין והיריב',
  8: 'בית שמיני — המוות והירושה',
  9: 'בית תשיעי — הדת והנסיעה',
  10: 'בית עשירי — הכבוד והפרנסה',
  11: 'בית אחד-עשר — התקווה והחברים',
  12: 'בית שנים-עשר — האויבים הנסתרים',
  13: 'בית שלושה-עשר — עד ראשון',
  14: 'בית ארבעה-עשר — עד שני',
  15: 'בית חמישה-עשר — הדיין',
  16: 'בית שישה-עשר — אחרית הדיין',
};

// בית שמופיע ב-keyHouses רק בגלל שהוא רכיב-חישוב בנוסחה (primaryFormula/
// altFormula) ואף supportingCheck לא מתייחס אליו ספציפית — כלומר אין לו
// פרשנות-תוכן עצמאית בנושא הזה — לא אמור להיות מוצג ללקוח עם הכותרת
// הנושאית הקבועה שלו (HOUSE_NAMES, למשל "בית תשיעי — הדת והנסיעה"), כי זה
// עלול לגרום ללקוח לחשוב שהקריאה עוסקת בנושא הזה בפועל. נגזר אוטומטית
// מנתוני-הנושא הקיימים ב-kashf-topic-rules.js — לא מיון ידני חדש לכל נושא.
// בתים 1 ו-13-16 (השואל/עדים/דיין) לא נכללים — אין להם שם-נושאי מטעה.
function getFormulaOnlyHouseNumbers(rules) {
  const formulaHouses = new Set([
    ...(rules?.primaryFormula?.houses || []),
    ...(rules?.altFormula?.houses || []),
  ]);
  const supportedHouses = new Set();
  for (const check of rules?.supportingChecks || []) {
    (check.houses || []).forEach((h) => supportedHouses.add(h));
    if (check.mainHouse != null) supportedHouses.add(check.mainHouse);
    if (check.targetHouse != null) supportedHouses.add(check.targetHouse);
    (check.assembleHouses || []).forEach((h) => supportedHouses.add(h));
    if (check.combineHouse != null) supportedHouses.add(check.combineHouse);
  }
  const result = new Set();
  for (const h of formulaHouses) {
    if (h <= 1 || h >= 13) continue;
    if (!supportedHouses.has(h)) result.add(h);
  }
  return result;
}

function describeHouse(board, houseNum, formulaOnlyHouseNumbers = null) {
  const entry = getHouseEntry(board, houseNum);
  const cls = classifyHouse(board, houseNum);
  const isFormulaOnly = !!formulaOnlyHouseNumbers?.has(houseNum);
  return {
    houseNum,
    houseName: isFormulaOnly ? `בית ${houseNum} — מרכיב בנוסחת ההכרעה` : (HOUSE_NAMES[houseNum] || `בית ${houseNum}`),
    isFormulaOnly,
    pattern: entry.pattern,
    figureName: entry.hebrewName || getFigureHebrewName(entry.pattern),
    quality: cls.saadNahs,
    qualityHebrew: cls.saadNahsHebrew,
    dakhalKharij: cls.dakhalKharij,
    dakhalKharijHebrew: cls.dakhalKharijHebrew,
  };
}

// ── מנוע ראשי ────────────────────────────────────────────────────────────

/**
 * מנוע הקריאה הראשי לשיטת כשף אל-אסרר.
 *
 * @param {object} board - לוח הגורל (תוצר buildRamlBoardFromMothers)
 * @param {string} topicId - מזהה נושא (מ-kashf-topic-rules.js)
 * @param {object} clientContext - הקשר הלקוח (שם, שאלה וכו׳)
 * @returns {object} קריאה מובנית
 */
export function buildKashfReading(board, topicId, clientContext = {}) {
  const rules = getTopicRules(topicId);
  if (!rules) {
    return {
      topicId,
      error: `נושא לא מוכר: ${topicId}`,
      valid: false,
    };
  }

  // ── נוסחה ראשית ─────────────────────────────────────────────────────────
  let primaryResult = null;
  let primaryVerdict = null;

  try {
    primaryResult = executeFormula(board, rules.primaryFormula);
    primaryVerdict = getFormulaPrimaryVerdict(
      primaryResult,
      rules.primaryFormula,
      rules.primaryFormula.interpretBy
    );
  } catch (err) {
    primaryVerdict = { text: `שגיאה בחישוב: ${err.message}`, positive: null };
  }

  // ── נוסחה חלופית ─────────────────────────────────────────────────────────
  let altResult = null;
  let altVerdict = null;

  if (rules.altFormula) {
    try {
      altResult = executeFormula(board, rules.altFormula);
      if (altResult?.type === 'parallel-combine') {
        // עקיבות מקומית ל-KDF-009 — מועבר מרמת ה-topic rule הקיימת
        // (rules.sourceRef), לא מומצא ולא משוכפל. ראו KASHF-TASK-011.
        altResult.sourceRef = rules.sourceRef;
        altResult.sourceVerificationStatus = 'verified_exact';
        altResult.chainDepthRequired = 1;
        altResult.chainDepthImplemented = 1;
      }
      altVerdict = getFormulaPrimaryVerdict(
        altResult,
        rules.altFormula,
        rules.altFormula.interpretBy
      );
    } catch (err) {
      altVerdict = { text: `שגיאה בחישוב חלופי: ${err.message}`, positive: null };
    }
  }

  // ── בדיקות תומכות ────────────────────────────────────────────────────────
  const supportingFindings = (rules.supportingChecks || []).map(check => {
    try {
      return runSupportingCheck(board, check);
    } catch (err) {
      return { id: check.id, label: check.label, error: err.message };
    }
  });

  // ── תיאור בתים מרכזיים ───────────────────────────────────────────────────
  const formulaOnlyHouseNumbers = getFormulaOnlyHouseNumbers(rules);
  const keyHouseReadings = (rules.keyHouses || []).map(h => {
    try {
      return describeHouse(board, h, formulaOnlyHouseNumbers);
    } catch (err) {
      return { houseNum: h, error: err.message };
    }
  });

  // ── לוח שלמות ────────────────────────────────────────────────────────────
  const boardValidation = board.boardValidation || { isValid: true, warnings: [] };

  // ── מחשבת השואל (דמיר) — השער הרביעי ────────────────────────────────────
  // גילוי "מה השואל באמת רוצה" (כשף עמ' 151-155), עצמאי מהנושא שנבחר.
  // ראו kashf-dhamir.js לרשימת השיטות המיושמות ומה שעדיין חסר בהן.
  let dhamir = null;
  try {
    dhamir = computeDhamirByMajority(board);
  } catch (err) {
    dhamir = { candidates: [], winner: null, agreementCount: 0, error: err.message };
  }

  // ── שער 4 סוג 4 — משלים חיצוני (לא כשף אל-אסראר) ────────────────────────
  // שדה נפרד ומסומן במפורש — אינו נכנס להצבעת הרוב של computeDhamirByMajority
  // (5 השיטות שם מאומתות ישירות מכשף עצמו). מחושב ומוצג רק בגילוי מלא —
  // ראו kashf-dhamir-type4-external.js לפרטי המקור.
  let dhamirType4External = null;
  try {
    dhamirType4External = computeDhamirType4External(board);
  } catch (err) {
    dhamirType4External = { error: err.message };
  }

  // ── בדיקות תומכות נוספות לגילוי הכוונה — עצמאיות מנושא, תלויות בבית הדמיר
  // המחושב לעיל (עמ' 104, 35, 112, 119, 124, 159; kashf-pending-extraction.js)
  let dhamirExtras = null;
  try {
    const legacyChart = buildLegacyChart(board);
    const dhamirHouseNum = dhamir?.winner?.houseNumber || null;
    dhamirExtras = {
      sodHaDhamirim: computeSodHaDhamirim(legacyChart),
      honestyCheck: computeQuerentHonestyCheck(legacyChart),
      querentSubject: computeQuerentSubject({ chart: legacyChart }),
      timingByThirds: dhamirHouseNum ? computeTimingByDhamirThirds(legacyChart, dhamirHouseNum) : null,
      temperament: dhamirHouseNum ? computeQuerentTemperament(legacyChart, dhamirHouseNum) : null,
      timingByMadad: computeTimingByMadad(legacyChart),
      timingEstimate: dhamir?.winner ? computeTimingEstimate(legacyChart, dhamir.winner, topicId) : null,
    };
  } catch (err) {
    dhamirExtras = { error: err.message };
  }

  // ── עדות בתים 13-14 ──────────────────────────────────────────────────────
  let witnessTestimony = null;
  try {
    const legacyChart = buildLegacyChart(board);
    const w13 = legacyChart.find((h) => h.house === 13);
    const w14 = legacyChart.find((h) => h.house === 14);
    witnessTestimony = computeWitnessTestimony(w13, w14, legacyChart);
  } catch (err) {
    witnessTestimony = { error: err.message };
  }

  const reading = {
    valid: true,
    topicId,
    topicHebrewName: rules.topicHebrewName,
    topicDescription: rules.topicDescription,
    sourceRef: rules.sourceRef,

    clientContext: {
      name: clientContext.name || '',
      question: clientContext.question || '',
      age: clientContext.age || '',
      gender: clientContext.gender || '',
      // שדות-הקשר נוספים — נשמרים כאן לשימוש עתידי בלבד. narrative-writer
      // לא קורא אותם עדיין (ראו KASHF_CONTEXT_COLLECTOR_IMPLEMENTATION_PLAN.md §6/§9).
      maritalStatus: clientContext.maritalStatus || null,
      workStatus: clientContext.workStatus || null,
      hasChildren: clientContext.hasChildren || null,
      parentName: clientContext.parentName || '',
      quesitedName: clientContext.quesitedName || '',
      phone: clientContext.phone || '',
      dynFields: clientContext.dynFields || {},
    },

    primaryFormula: {
      type: rules.primaryFormula.type,
      houses: rules.primaryFormula.houses,
      result: primaryResult,
      verdict: primaryVerdict,
      sourceText: rules.primaryFormula.sourceText,
    },

    altFormula: rules.altFormula ? {
      type: rules.altFormula.type,
      houses: rules.altFormula.houses,
      result: altResult,
      verdict: altVerdict,
      sourceText: rules.altFormula.sourceText,
    } : null,

    supportingFindings,
    keyHouseReadings,
    boardValidation,
    dhamir,
    dhamirType4External,
    dhamirExtras,
    witnessTestimony,

    overallPositive: primaryVerdict?.positive,
  };

  // שכבת-מסקנה חכמה — כרגע רק לנושא מסחר, הוכחת-היתכנות ל-Kashf
  // Architecture Advisor Brain (ראו KASHF_FIRST_TOPIC_SMART_REWRITE_PROPOSAL.md).
  // בכל כשל — reading.commerceSmartLayer נשאר null, וה-narrative-writer
  // נופל-חזרה לניסוח הקבוע הישן (TOPIC_GUIDANCE.commerce) ללא שינוי.
  try {
    reading.commerceSmartLayer = computeCommerceSmartLayer(reading);
  } catch (err) {
    reading.commerceSmartLayer = null;
  }

  return reading;
}

export default { buildKashfReading };
