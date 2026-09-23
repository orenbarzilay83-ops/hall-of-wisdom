/**
 * kashf-leshon-hainyan.js
 *
 * "לשון העניין" — הכרעת המחבר לשיבוץ השני (כשף אל-אסראר, עמ' 109, 112).
 * זו הפעלה של שיבוץ 2 (kashf-shibutzim.js) שמשתמשת ב"בית מחשבת השואל"
 * (הדמיר, kashf-dhamir.js) כקלט — לכן היא תלויה בשני הקבצים ומחוברת
 * ביניהם כאן, לא בתוך אף אחד מהם.
 *
 * עיקרון (מצוטט כמעט מילולית מהמקור, עמ' 109, 112):
 * "כל צורה כשהיא יושבת בבית שלה לפי סדר [שיבוץ המושב] — אז המספר ומשך-
 * הזמן שייכים לבית ולצורה כאחד. אבל כשאין הדבר כך... נוטלים... ומולידים
 * מהם צורה [לשון העניין]... עיקר ההתבוננות הוא בלשון העניין, והוא הבית
 * השמיני, הנולד מן הבית הראשון ומבית מחשבת השואל... דרך ההכאה: מביאים
 * את לשון העניין, כלומר את הצורה היוצאת מהכאת בית מחשבת השואל בשני
 * שלישיו — הבית החמישי והבית התשיעי."
 *
 * חשוב: sourceStatus ב-SHIBUTZ_2_LESHON_HAINYAN_METHOD מסומן
 * 'not-yet-found-in-current-code-search' — התיאור המילולי מאומת, אך
 * המנגנון המכני לא היה בביטחון מלא כשזה תועד. הפונקציה כאן היא ניסיון
 * ראשון ליישם אותו כעת שיש מנוע דמיר; יש לבחון את התוצאה בזהירות,
 * לא להתייחס אליה כמאומתת ברמה של שאר שיבוץ 2.
 *
 * מקור: כשף אל-אסראר המצונה, השער השלישי — עמ' 104-113
 */

import { getHousePattern } from './kashf-formula-engine.js';
import { combineHouses } from './kashf-formula-engine.js';
import { computeDhamirByMajority } from './kashf-dhamir.js';
import {
  SHIBUTZ_1_MOSHAV,
  SHIBUTZ_2_CANONICAL_NUMBER,
  SHIBUTZ_2_DURATION_BY_HOUSE,
  SHIBUTZ_2_MONEY_BY_HOUSE,
} from '../data/sources/kashf-al-asrar/kashf-shibutzim.js';

function canonicalPositionOf(pattern) {
  return SHIBUTZ_2_CANONICAL_NUMBER.find((f) => f.pattern === pattern)?.position || null;
}

// עמ' 112: הטריגר לעבר/הווה/עתיד הוא מבני — סוג הבית שבו הצורה נמצאת.
// אין להחליף את مائل الأوتاد במילה הסמנטית "עתיד" בתוך חוזה החישוב.
export const LESHON_HAINYAN_STRUCTURAL_STATES = Object.freeze([
  Object.freeze({
    id: 'awtad',
    arabic: 'الأوتاد',
    houses: Object.freeze([1, 4, 7, 10]),
    judgment: 'present',
    judgmentHebrew: 'הווה/מצב נוכחי',
  }),
  Object.freeze({
    id: 'mayil-al-awtad',
    arabic: 'مائل الأوتاد',
    houses: Object.freeze([2, 5, 8, 11]),
    judgment: 'future',
    judgmentHebrew: 'עתיד',
  }),
  Object.freeze({
    id: 'zail-saqit-an-al-watad',
    arabic: 'الزائل الساقط عن الوتد',
    houses: Object.freeze([3, 6, 9, 12]),
    judgment: 'past',
    judgmentHebrew: 'עבר',
  }),
]);

export function classifyLeshonHainyanHouse(houseNum) {
  const n = Number(houseNum);
  const state = LESHON_HAINYAN_STRUCTURAL_STATES.find((x) => x.houses.includes(n));
  if (!state) return null;
  return {
    id: state.id,
    arabic: state.arabic,
    house: n,
    judgment: state.judgment,
    judgmentHebrew: state.judgmentHebrew,
  };
}

function structuralTimingForPattern(board, pattern) {
  const occurrences = [];
  for (let house = 1; house <= 12; house += 1) {
    if (getHousePattern(board, house) !== pattern) continue;
    const state = classifyLeshonHainyanHouse(house);
    if (state) occurrences.push(state);
  }

  const judgments = [...new Set(occurrences.map((x) => x.judgment))];
  return {
    sourceRef: 'כשף אל-אסראר עמ׳ 112',
    sourceStatus: 'explicit-in-source',
    trigger: 'house-structural-state',
    occurrences,
    judgments,
    ambiguousAcrossStructuralStates: judgments.length > 1,
    fallbackStatus: occurrences.length ? 'not-needed' : 'not-implemented',
    note: occurrences.length
      ? 'הזמן נגזר מסוג הבית שבו לשון העניין נמצאת: יתדות=הווה, מائل الأوتاد=עתיד, נופל מן היתד=עבר.'
      : 'כאשר הצורה אינה נמצאת בלוח, המקור מפנה לשיבוצה; fallback זה אינו מיושם כאן ואין להשלים אותו בהיקש.',
  };
}

/**
 * מחשב את "לשון העניין" ואת המספר/משך-הזמן הנגזרים ממנה.
 *
 * @param {object} board - לוח הגורל
 * @param {number} [dhamirHouseNum] - בית מחשבת השואל, אם כבר חושב
 *   (למשל דרך computeDhamirByMajority(board).winner.houseNumber). אם
 *   לא מועבר, מחושב כאן פנימית באמצעות הרוב מ-kashf-dhamir.js.
 */
export function computeLeshonHainyan(board, dhamirHouseNum) {
  let houseNum = dhamirHouseNum;
  let dhamirSource = 'provided';
  if (!houseNum) {
    const dhamir = computeDhamirByMajority(board);
    if (!dhamir?.winner?.houseNumber) return null;
    houseNum = dhamir.winner.houseNumber;
    dhamirSource = 'computed';
  }

  const currentPattern = getHousePattern(board, houseNum);
  const moshavPattern = SHIBUTZ_1_MOSHAV[houseNum];

  // מקרה א: הצורה יושבת בביתה לפי שיבוץ המושב — המספר/משך שייכים לה ישירות
  if (currentPattern === moshavPattern) {
    const position = canonicalPositionOf(currentPattern);
    return {
      method: 'leshon-hainyan',
      case: 'sitting-in-moshav-house',
      sourceRef: 'כשף אל-אסראר עמ׳ 109-112 — הכרעת המחבר לשיבוץ השני',
      dhamirHouseNum: houseNum,
      dhamirSource,
      pattern: currentPattern,
      canonicalPosition: position,
      duration: position ? SHIBUTZ_2_DURATION_BY_HOUSE[position] : null,
      money: position ? SHIBUTZ_2_MONEY_BY_HOUSE[position] : null,
      structuralTiming: structuralTimingForPattern(board, currentPattern),
    };
  }

  // מקרה ב: לא בביתה — גוזרים "לשון העניין" מהכאת בית מחשבת השואל עם 5 ו-9
  const leshonPattern = combineHouses(board, [houseNum, 5, 9]);
  const position = canonicalPositionOf(leshonPattern);
  return {
    method: 'leshon-hainyan',
    case: 'derived-from-dhamir-5-9',
    sourceRef: 'כשף אל-אסראר עמ׳ 109-112 — הכרעת המחבר לשיבוץ השני',
    dhamirHouseNum: houseNum,
    dhamirSource,
    pattern: leshonPattern,
    canonicalPosition: position,
    duration: position ? SHIBUTZ_2_DURATION_BY_HOUSE[position] : null,
    money: position ? SHIBUTZ_2_MONEY_BY_HOUSE[position] : null,
    structuralTiming: structuralTimingForPattern(board, leshonPattern),
  };
}

export default { computeLeshonHainyan, classifyLeshonHainyanHouse, LESHON_HAINYAN_STRUCTURAL_STATES };
