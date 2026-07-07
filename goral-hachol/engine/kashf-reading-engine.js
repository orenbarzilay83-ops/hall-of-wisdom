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
import { getDakhalKharij } from './kashf-figure-classifier.js';
import { computeDhamirByMajority } from './kashf-dhamir.js';
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

function describeHouse(board, houseNum) {
  const entry = getHouseEntry(board, houseNum);
  const cls = classifyHouse(board, houseNum);
  return {
    houseNum,
    houseName: HOUSE_NAMES[houseNum] || `בית ${houseNum}`,
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
  const keyHouseReadings = (rules.keyHouses || []).map(h => {
    try {
      return describeHouse(board, h);
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

  return {
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
    dhamirExtras,
    witnessTestimony,

    overallPositive: primaryVerdict?.positive,
  };
}

export default { buildKashfReading };
