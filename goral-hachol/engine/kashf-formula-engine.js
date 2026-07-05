/**
 * kashf-formula-engine.js
 *
 * מנוע חישוב הנוסחאות לפי שיטת כשף אל-אסרר.
 * כל פונקציה מיישמת נוסחה המופיעה בספר.
 *
 * מקורות:
 *   כשף אל-אסרר המצונה — פרקים 6-12 (עמ׳ 166-276)
 */

import { combineRamlPatterns } from './raml-figures.js';
import { getDakhalKharij, getSaadNahs, classifyFigure } from './kashf-figure-classifier.js';
import { HAWI_FIGURE_NAMES_BY_ID } from '../data/sources/kashf-al-asrar/kashf-figure-names.js';

// ── אינדקסי שורות ──────────────────────────────────────────────────────────
export const ROW = { FIRE: 0, AIR: 1, WATER: 2, EARTH: 3 };

// ── גישה לנתוני לוח ────────────────────────────────────────────────────────

/**
 * מחזיר את הצורה (pattern) עבור בית מסוים (1–16).
 */
export function getHousePattern(board, houseNum) {
  const entry = board.entries[houseNum - 1];
  if (!entry) throw new Error(`בית ${houseNum} אינו קיים בלוח`);
  return entry.pattern;
}

/**
 * מחזיר את כל נתוני הרשומה עבור בית מסוים (1–16).
 */
export function getHouseEntry(board, houseNum) {
  const entry = board.entries[houseNum - 1];
  if (!entry) throw new Error(`בית ${houseNum} אינו קיים בלוח`);
  return entry;
}

// ── נוסחאות חישוב ──────────────────────────────────────────────────────────

/**
 * חיבור רמל: חיבור כל צורות הבתים הנתונים בסדרה (חיבור זוגי).
 * שימוש ב-combineRamlPatterns על כל זוג ברצף.
 *
 * מקור: בשימוש רחב בספר — "קח צורה מן X ו-Y" / "הכה זה בזה"
 *
 * @param {object} board
 * @param {number[]} houseNums - לפחות 2 בתים
 * @returns {string} תבנית צורה
 */
export function combineHouses(board, houseNums) {
  if (!houseNums || houseNums.length < 2) {
    throw new Error('combineHouses דורש לפחות 2 מספרי בתים');
  }
  let result = getHousePattern(board, houseNums[0]);
  for (let i = 1; i < houseNums.length; i++) {
    result = combineRamlPatterns(result, getHousePattern(board, houseNums[i]));
  }
  return result;
}

/**
 * הרכבת צורה מ"ראש" (שורת אש) של בדיוק 4 בתים.
 * שורת האש של כל בית הופכת לשורה אחת בצורה החדשה:
 *   אש-h1 → שורת אש החדשה
 *   אש-h2 → שורת אוויר החדשה
 *   אש-h3 → שורת מים החדשה
 *   אש-h4 → שורת עפר החדשה
 *
 * מקור: כשף אל-אסרר עמ׳ 173
 * "קח את ראש הראשון, החמישי, התשיעי והעשירי, והעמד מהם צורה."
 *
 * @param {object} board
 * @param {number[]} houseNums - בדיוק 4 בתים
 * @returns {string} תבנית צורה 4-תווים
 */
export function assembleFromFireRows(board, houseNums) {
  if (houseNums.length !== 4) {
    throw new Error('assembleFromFireRows דורש בדיוק 4 מספרי בתים');
  }
  return houseNums
    .map(h => getHousePattern(board, h)[ROW.FIRE])
    .join('');
}

/**
 * הרכבת צורה מכל שורות-יסוד של 4 בתים (שיטת "העמד מהם צורה").
 * שורת האש = זוגיות ספירת הנקודות האשיות בכל 4 הבתים, וכן לשאר השורות.
 * מתמטית: זהה לחיבור רמל של 4 הצורות.
 *
 * מקור: כשף אל-אסרר עמ׳ 180, 238
 * "קח את שורת יסוד האש של הראשון, השלישי, החמישי והתשיעי..."
 * "קח את השני, הרביעי, השישי והשמיני, והעמד מהם צורה."
 *
 * @param {object} board
 * @param {number[]} houseNums - בדיוק 4 בתים
 * @returns {string} תבנית צורה
 */
export function assembleFromAllRows(board, houseNums) {
  // מתמטית זהה ל-combineHouses
  return combineHouses(board, houseNums);
}

// ── הערכת איכות ────────────────────────────────────────────────────────────

/**
 * מחזיר את סיווג הצורה בבית: 'saad' / 'nahs' / 'mixed' / null
 */
export function assessHouseQuality(board, houseNum) {
  return getSaadNahs(getHousePattern(board, houseNum));
}

/**
 * מחזיר סיווג מלא: dakhalKharij + saadNahs + שמות עבריים
 */
export function classifyHouse(board, houseNum) {
  return classifyFigure(getHousePattern(board, houseNum));
}

/**
 * מחזיר סיווג מלא של תבנית שחושבה (לא בית אלא תוצאת חישוב)
 */
export function classifyPattern(pattern) {
  return classifyFigure(pattern);
}

/**
 * בודק אם הצורה בבית מסוים זהה לתבנית נתונה
 */
export function hasFigureInHouse(board, houseNum, targetPattern) {
  return getHousePattern(board, houseNum) === targetPattern;
}

/**
 * סופר כמה בתים יש מכל סוג איכות: { saad, nahs, mixed }
 */
export function countQualityInHouses(board, houseNums) {
  const counts = { saad: 0, nahs: 0, mixed: 0 };
  for (const h of houseNums) {
    const q = assessHouseQuality(board, h);
    if (q in counts) counts[q]++;
  }
  return counts;
}

// ── מאפיינים נוספים ────────────────────────────────────────────────────────

/**
 * בודק אם הצורה בבית הינה זכרית (מספר אי-זוגי של שורות פתוחות)
 * מקור: כשף אל-אסרר עמ׳ 191, 166
 */
export function isHouseMasculine(board, houseNum) {
  const ones = getHousePattern(board, houseNum).split('').filter(c => c === '1').length;
  return ones % 2 === 1;
}

/**
 * מחזיר את יסוד הצורה בבית לפי השורה הפתוחה הראשונה.
 * מקור: כשף אל-אסרר עמ׳ 173, 191, 238
 */
export function getHouseElement(board, houseNum) {
  const p = getHousePattern(board, houseNum);
  if (p[ROW.FIRE]  === '1') return 'fire';
  if (p[ROW.AIR]   === '1') return 'air';
  if (p[ROW.WATER] === '1') return 'water';
  return 'earth';
}

/**
 * בודק האם הצורה מ"כוכבי הטוב" (שמש, ירח, צדק, נוגה).
 * בהיעדר מיפוי כוכבי ישיר בנתונים — משתמשים באיכות "מיטיב" כפרוקסי.
 * מקור: כשף אל-אסרר עמ׳ 256
 */
export function isBeneficPlanetPattern(pattern) {
  return getSaadNahs(pattern) === 'saad';
}

/**
 * מחזיר שם עברי של צורה לפי תבנית
 */
export function getFigureHebrewName(pattern) {
  return HAWI_FIGURE_NAMES_BY_ID?.[pattern]?.hebrewName || pattern;
}

/**
 * מחזיר את איכות השורה כטקסט עברי
 */
export function getQualityHebrew(quality) {
  const map = { saad: 'מיטיב', nahs: 'מזיק', mixed: 'ממוזג' };
  return map[quality] || quality || '—';
}

export default {
  ROW,
  getHousePattern,
  getHouseEntry,
  combineHouses,
  assembleFromFireRows,
  assembleFromAllRows,
  assessHouseQuality,
  classifyHouse,
  classifyPattern,
  hasFigureInHouse,
  countQualityInHouses,
  isHouseMasculine,
  getHouseElement,
  isBeneficPlanetPattern,
  getFigureHebrewName,
  getQualityHebrew,
};
