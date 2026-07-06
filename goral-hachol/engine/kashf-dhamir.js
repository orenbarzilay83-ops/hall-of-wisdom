/**
 * kashf-dhamir.js
 *
 * גילוי מחשבת השואל (הדמיר) — שיטת כשף אל-אסראר, השער הרביעי (עמ' 151-155).
 * "המאזן" = בית 15 (הדיין) — מאומת ישירות מול המקור, עמ' 152:
 * "לוקחים את מספר היסודות שבמאזן, ומוליכים אותו מן הבית החמישה־עשר אל הראשון".
 *
 * הבסיס לשלוש מהשיטות כאן שוחזר מקובץ kashf-support-analyzer.js (שנמחק
 * כ"מנוע-צל" לפני שהועבר כראוי) — הלוגיקה כבר השתמשה נכון בבית 15, רק
 * לא חוברה מעולם למנוע החי. שיטת "המאזן" (Face 1) נבנתה כאן מחדש
 * במלואה לפי הטקסט המלא (עמ' 151-152), כולל השלבים שהיו חסרים בגרסה
 * שאוחזרה: בדיקת "בית טבעי", חיבור עם בעל הבית, ושילוב שתי הנקודות.
 * שיטה רביעית ("אלכסון האמהות") שהייתה בקובץ המקורי לא שוחזרה — לא
 * נמצא לה ציטוט עמוד מפורש בספר בבדיקה הזו.
 *
 * שער 4 מכיל 5 "סוגים" (עמ' 151-155), שהספר עצמו מסכם: "תאסוף את גילוי
 * הכוונה הנסתרת בחמש הדרכים האלה... ותכריע לפי הרוב" (עמ' 155) — זו
 * שיטת הסופר עצמה, לא דעה מצוטטת (בשונה מ"תועלת מדברי אל-זנאתי",
 * עמ' 156 ואילך, שהיא תוספת מפורשת מחכם אחר). בקובץ הזה מיושמים רק
 * הסוג הראשון (3 מתוך 4 פנים: מאזן, רוחב, ג'והריין). סוגים 2-5 עדיין
 * לא מיושמים — המנגנון המדויק שלהם לא היה חד-משמעי מספיק בתרגום
 * העברי לבד (ראו הערות בתחתית הקובץ).
 *
 * מקור: כשף אל-אסראר המצונה, השער הרביעי — עמ' 151-155
 */

import { getHousePattern, getHouseEntry, getFigureHebrewName } from './kashf-formula-engine.js';
import { combineRamlPatterns } from './raml-figures.js';
import { NATURAL_HOUSE_FIGURES } from './hawi-interpreter.js';

const PARENT_PAIRS = {
  9:  [1, 2],
  10: [3, 4],
  11: [5, 6],
  12: [7, 8],
  13: [9, 10],
  14: [11, 12],
  15: [13, 14],
};

function countDots(pattern) {
  if (!pattern) return 0;
  return pattern.split('').reduce((sum, ch) => sum + (ch === '2' ? 2 : 1), 0);
}

function traceToSource(board, houseNum, rowIndex) {
  if (houseNum <= 8) return houseNum;
  const [left, right] = PARENT_PAIRS[houseNum] || [];
  if (!left) return null;
  if (getHousePattern(board, left)?.[rowIndex] === '1') return traceToSource(board, left, rowIndex);
  if (getHousePattern(board, right)?.[rowIndex] === '1') return traceToSource(board, right, rowIndex);
  return null;
}

/**
 * מעקב נקודה יחידה מן המאזן (בית 15): עוקבים אחורה בעץ ההורים עד
 * לאם/בת מקורית (rowIndex קבוע לאורך המעקב — עמ' 151), ואז בודקים אם
 * הצורה היושבת שם היא הצורה ה"טבעית" של אותו בית (NATURAL_HOUSE_FIGURES,
 * כשף עמ' 97-99). אם כן — שם מתגלה מחשבת השואל. אם לא — מחברים
 * (הכאת רמל) את הצורה היושבת שם עם "בעל הבית" (הצורה הטבעית של אותו
 * בית), ומחפשים את התוצאה על הלוח.
 *
 * מקור (עמ' 152): "ואם הגיעה הנקודה אל צורה העומדת בבית שלה — שם
 * מתגלה מחשבת השואל. ואם אין זה ביתה, מכים את הצורה השורה באותו בית
 * עם בעל הבית; והצורה היוצאת משתיהן — אם נמצאה בלוח הגורל הערוך, שם
 * מתגלה מחשבת השואל: או בצורתה, או בבית שבו שרתה, או בבית שלה."
 */
function resolveMizanPoint(board, rowIndex) {
  const sourceHouse = traceToSource(board, 15, rowIndex);
  if (!sourceHouse) return null;
  const currentPattern = getHousePattern(board, sourceHouse);
  const naturalPattern = NATURAL_HOUSE_FIGURES[sourceHouse];

  if (currentPattern === naturalPattern) {
    return { houseNumber: sourceHouse, pattern: currentPattern, inOwnHouse: true, revealedPattern: currentPattern };
  }

  const combinedPattern = combineRamlPatterns(currentPattern, naturalPattern);
  const foundEntry = (board?.entries || []).find((e) => e.pattern === combinedPattern);
  return {
    houseNumber: sourceHouse,
    pattern: currentPattern,
    inOwnHouse: false,
    combinedPattern,
    foundAtHouse: foundEntry ? foundEntry.houseNumber : null,
    revealedPattern: combinedPattern,
  };
}

/**
 * הסוג הראשון, הפנים הראשונות — "תנועת האורך" (עמ' 151-152).
 * לוקחים את הנקודה (השורה היחידית) הראשונה מצורת המאזן, ועדיף גם את
 * השנייה אם יש; לכל אחת עושים resolveMizanPoint, ואת שתי הצורות
 * המתגלות מולידים (הכאת רמל) לצורה אחת סופית — שם מחשבת השואל.
 *
 * מקור: "והטוב יותר הוא לקחת את הנקודה השנייה מן המאזן ולעשות בה כפי
 * שקדם. מולידים משתי הצורות צורה אחת, ובה מתגלה מחשבת השואל. דרך זו
 * נקראת תנועת האורך."
 */
export function computeDhamirMizan(board) {
  const judgePattern = getHousePattern(board, 15);
  if (!judgePattern) return null;

  const singleRows = [];
  for (let r = 0; r < 4; r++) {
    if (judgePattern[r] === '1') singleRows.push(r);
  }
  if (!singleRows.length) return null;

  const point1 = resolveMizanPoint(board, singleRows[0]);
  if (!point1) return null;

  if (singleRows.length === 1) {
    return {
      method: 'mizan',
      methodHebrew: 'שיטת המאזן (תנועת האורך)',
      sourceRef: 'כשף אל-אסראר עמ׳ 151-152 — הסוג הראשון, הפנים הראשונות',
      point1,
      pattern: point1.revealedPattern,
      houseNumber: point1.foundAtHouse ?? point1.houseNumber,
      nameHebrew: getFigureHebrewName(point1.revealedPattern),
    };
  }

  const point2 = resolveMizanPoint(board, singleRows[1]);
  if (!point2) {
    return {
      method: 'mizan',
      methodHebrew: 'שיטת המאזן (תנועת האורך)',
      sourceRef: 'כשף אל-אסראר עמ׳ 151-152 — הסוג הראשון, הפנים הראשונות',
      point1,
      pattern: point1.revealedPattern,
      houseNumber: point1.foundAtHouse ?? point1.houseNumber,
      nameHebrew: getFigureHebrewName(point1.revealedPattern),
    };
  }

  const finalPattern = combineRamlPatterns(point1.revealedPattern, point2.revealedPattern);
  const finalEntry = (board?.entries || []).find((e) => e.pattern === finalPattern);
  return {
    method: 'mizan',
    methodHebrew: 'שיטת המאזן (תנועת האורך, שתי הנקודות)',
    sourceRef: 'כשף אל-אסראר עמ׳ 151-152 — הסוג הראשון, הפנים הראשונות',
    point1,
    point2,
    pattern: finalPattern,
    houseNumber: finalEntry ? finalEntry.houseNumber : null,
    nameHebrew: getFigureHebrewName(finalPattern),
  };
}

/**
 * הסוג הראשון, הפנים השניות — "תנועת הרוחב" (עמ' 152).
 * סופרים את נקודות המאזן (בית 15), ומהלכים אחורה N צעדים החל מבית 15
 * (15→14→...→1→16→15...).
 *
 * מקור: "לוקחים את מספר היסודות שבמאזן, ומוליכים אותו מן הבית
 * החמישה־עשר אל הראשון, וכן הלאה, עד המקום שבו הוא עומד... דרך זו
 * נקראת תנועת הרוחב."
 */
export function computeDhamirHarkatAlArd(board) {
  const judgePattern = getHousePattern(board, 15);
  if (!judgePattern) return null;
  const n = countDots(judgePattern);
  if (!n) return null;
  let pos = 15;
  for (let i = 0; i < n; i++) {
    pos = pos === 1 ? 16 : pos - 1;
  }
  const entry = getHouseEntry(board, pos);
  if (!entry) return null;
  return {
    method: 'harkat-al-ard',
    methodHebrew: 'תנועת הרוחב (ספירת נקודות המאזן)',
    sourceRef: 'כשף אל-אסראר עמ׳ 152 — הסוג הראשון, הפנים השניות',
    pattern: entry.pattern,
    houseNumber: pos,
    nameHebrew: entry.hebrewName || getFigureHebrewName(entry.pattern),
    dotCount: n,
  };
}

/**
 * הסוג הראשון, הפנים הרביעיות — "ג'והריין" / קל וכבד (עמ' 153).
 * סופרים חפיף+ת'קיל (קל+כבד) בבתים 1-15 בלבד (לא 16), מפחיתים 12-12,
 * ומשליכים את הנשאר מבית 1.
 *
 * מקור: "סופרים את נקודות שני היסודות — הקל והכבד — מתוך המערך שנערך,
 * מן הראשון עד החמישה־עשר, ואינם מכניסים בחשבון את השישה־עשר. מצרפים
 * את המספר, מפחיתים אותו שנים־עשר שנים־עשר, ומה שנותר משליכים מן
 * הבית הראשון עד המקום שבו הוא עומד."
 */
export function computeDhamirJawharayn(board) {
  let total = 0;
  for (let i = 1; i <= 15; i++) {
    const p = getHousePattern(board, i);
    if (p) total += countDots(p);
  }
  if (!total) return null;
  let pos = total % 12;
  if (pos === 0) pos = 12;
  const entry = getHouseEntry(board, pos);
  if (!entry) return null;
  return {
    method: 'jawharayn',
    methodHebrew: 'שני היסודות (קל וכבד)',
    sourceRef: 'כשף אל-אסראר עמ׳ 153 — הסוג הראשון, הפנים הרביעיות',
    pattern: entry.pattern,
    houseNumber: pos,
    nameHebrew: entry.hebrewName || getFigureHebrewName(entry.pattern),
    totalDots: total,
  };
}

/**
 * מריץ את השיטות המיושמות ומכריע לפי הרוב (עמ' 155: "תאסוף... ותכריע
 * לפי הרוב"). מחזיר גם את כל המועמדים וגם את ההכרעה, כדי שנתיב ההצגה
 * יוכל להראות את כל הראיות ולא רק את המסקנה.
 *
 * הערה: זו הכרעה חלקית בלבד — הספר עצמו קורא לאסוף את כל 5 ה"סוגים"
 * (עמ' 151-155), ואילו כאן מיושמים רק 3 מ-4 הפנים של הסוג הראשון (חסרה
 * "תנועת העומק"/פנים שלישיות, עמ' 152), וסוגים 2-5 אינם מיושמים כלל —
 * ראו הערה בתחתית הקובץ.
 */
export function computeDhamirByMajority(board) {
  const candidates = [
    computeDhamirMizan(board),
    computeDhamirHarkatAlArd(board),
    computeDhamirJawharayn(board),
  ].filter(Boolean);

  if (!candidates.length) {
    return { candidates: [], winner: null, agreementCount: 0 };
  }

  const counts = {};
  for (const c of candidates) {
    (counts[c.houseNumber] ||= []).push(c);
  }

  let winner = null;
  let bestCount = 0;
  for (const group of Object.values(counts)) {
    if (group.length > bestCount) {
      bestCount = group.length;
      winner = group.find((c) => c.method === 'mizan')
        || group.find((c) => c.method === 'harkat-al-ard')
        || group[0];
      winner = { ...winner, agreementCount: group.length, methodsAgreed: group.map((c) => c.methodHebrew) };
    }
  }

  return { candidates, winner, agreementCount: bestCount };
}

// ─────────────────────────────────────────────────────────────────────────
// טרם מיושם — טעון בירור מול המקור הערבי לפני קידוד, לא לנחש:
//
// הסוג הראשון, הפנים השלישיות — "תנועת העומק" (עמ' 152). המקור נותן
// רק דוגמה ("אם הצורה השמינית עומדת בראשון, מוסיפים מן הראשון עד
// השמיני, ומפחיתים מן השמיני עד השישה־עשר") ולא כלל כללי מופשט —
// לא ברור מהתרגום העברי לבד איך מכלילים את הדוגמה לכל מקרה.
//
// הסוג השני (עמ' 153-154): "מתבוננים בצורת המאזן וביסוד שהתגבר בה,
// ומוליכים אותו..." — לא ברור מהו "היסוד שהתגבר" בצורה בודדת של 4
// שורות (לכל שורה יש יסוד קבוע משלה), ואיך בדיוק "מוליכים" את היסוד
// למקום. משתמש ב"סדר שיבוץ המושב" (SHIBUTZ_1_MOSHAV, כבר קיים
// ב-kashf-shibutzim.js) — כך שברגע שיתבהר המנגנון, יש כבר נתונים
// מוכנים לחיבור.
//
// הסוג השלישי (עמ' 154): "סופרים את היחידים... מכים אותם בעצמם,
// מוסיפים עליהם כמותם, ומחלקים את הכול לשניים" — נוסחה אריתמטית
// שניתנת לשני פירושים שונים לפחות (ראו דיון בשיחה); צריך מקור ברור
// יותר לפני שמכריעים.
//
// הסוג הרביעי (עמ' 153, 155): סופר את כל נקודות הלוח, ממיר למספר-אות
// (אבג"ד), וממיר את האות לצורה. תלוי במיפוי אות↔צורה מלא, שקיים כרגע
// רק חלקית ובאי-ודאות ב-SHIBUTZ_6 (kashf-shibutzim.js, 4 מתוך 16 צורות
// בלבד, וסתירה לא-פתורה בכלל "שתי האותיות") — חסום עד שהפער הזה ייסגר.
//
// הסוג החמישי (עמ' 155): "מוליכים את הנקודה הראשונה... אחר כך מוליכים
// את המקום שעליו עמדה... עד שייסגר המעגל" — הליכה איטרטיבית, אך לא
// ברור איזה כלל-צעד יחיד חוזרים עליו כל פעם.
//
// כל אחד מהם דורש צילום/הכתבה של המקור הערבי (עמ' 152-155) לפני קידוד,
// כמו שנעשה עם שיבוצי השער השלישי.
// ─────────────────────────────────────────────────────────────────────────

export default { computeDhamirMizan, computeDhamirHarkatAlArd, computeDhamirJawharayn, computeDhamirByMajority };
