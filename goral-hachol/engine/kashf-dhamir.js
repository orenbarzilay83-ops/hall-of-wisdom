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
 * שיטת הסופר עצמה, לא דעה מצוטטת (בשונה מ"فائدة... من قول الأستاذ
 * المعظم الزناتي" בעמ' 156 ואילך — תוספת מפורשת מחכם אחר, אל-זנאתי).
 *
 * מאומת מול צילומי המקור הערבי (עמ' 152-156, באדיבות המשתמש):
 *   - סוג 1, פנים 1-2, 4 (מאזן/רוחב/ג'והריין) — מיושמים במלואם.
 *   - סוג 1, פנים 3 ("תנועת העומק") — דוגמה בלבד בערבית המקורית
 *     ("مثلا كان الشكل الثامن في الأول..."), אין כלל מופשט. לא מיושם.
 *   - סוג 3 — אומת ופוענח: "تعد... تضرب في مثلهم... تزيد عليهم مثلهم...
 *     تقسم نصفين" = n·n + n·n, לחלק ל-2 = n² בדיוק (הניסוח המפותל רק
 *     מסתיר חשבון פשוט). מיושם.
 *   - סוג 2 — אומת בערבית, אך "ما قوي فيه من العناصر" (היסוד ה"חזק")
 *     בצורה בודדת של 4 שורות עדיין דורש הכרעה: ערך-חוזק לפי שיטת
 *     אבּדח (עפר8>מים4>אוויר2>אש1), או לפי סדר-קדימות אחר? לא מיושם.
 *   - סוג 4 — חסום: תלוי במיפוי אות↔צורה החסר/סותר (SHIBUTZ_6).
 *   - סוג 5 — אומת מבנה כללי (הליכה איטרטיבית על תוצאת פנים-1 עד
 *     שנסגר מעגל/חוזר על עצמו), אך כלל-הצעד החוזר לא מוגדר מספיק
 *     לביצוע בטוח. לא מיושם.
 *
 * מקור: כשף אל-אסראר המצונה, השער הרביעי — עמ' 151-155
 */

import { getHousePattern, getHouseEntry, getFigureHebrewName } from './kashf-formula-engine.js';
import { combineRamlPatterns } from './raml-figures.js';
import { NATURAL_HOUSE_FIGURES } from './hawi-interpreter.js';
import { SHIBUTZ_2_CANONICAL_NUMBER } from '../data/sources/kashf-al-asrar/kashf-shibutzim.js';

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
 * מקור (מאומת מול הערבית המקורית, עמ' 153): "סופרים את נקודות שני
 * היסודות — הקל והכבד — מתוך המערך שנערך, מן הראשון עד החמישה־עשר,
 * ואינם מכניסים בחשבון את השישה־עשר. מצרפים את המספר, מפחיתים אותו
 * שנים־עשר שנים־עשר, ומה שנותר משליכים מן הבית הראשון עד המקום שבו
 * הוא עומד. אם היה [הבית שבו עמד] בביתו [הטבעי] — שם הדמיר. ...ואם
 * לא — עוברים בו אל ביתו [הטבעי], ומדברים על אותו בית."
 * (הערבית: "فإن كان في بيته ففيه الضمير... وإلا فامض به إلى بيته")
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

  const naturalPattern = NATURAL_HOUSE_FIGURES[pos];
  if (entry.pattern === naturalPattern) {
    return {
      method: 'jawharayn',
      methodHebrew: 'שני היסודות (קל וכבד)',
      sourceRef: 'כשף אל-אסראר עמ׳ 153 — הסוג הראשון, הפנים הרביעיות',
      pattern: entry.pattern,
      houseNumber: pos,
      nameHebrew: entry.hebrewName || getFigureHebrewName(entry.pattern),
      totalDots: total,
      inOwnHouse: true,
    };
  }

  const combinedPattern = combineRamlPatterns(entry.pattern, naturalPattern);
  const foundEntry = (board?.entries || []).find((e) => e.pattern === combinedPattern);
  const finalHouse = foundEntry ? foundEntry.houseNumber : pos;
  const finalPattern = foundEntry ? foundEntry.pattern : combinedPattern;
  return {
    method: 'jawharayn',
    methodHebrew: 'שני היסודות (קל וכבד)',
    sourceRef: 'כשף אל-אסראר עמ׳ 153 — הסוג הראשון, הפנים הרביעיות',
    pattern: finalPattern,
    houseNumber: finalHouse,
    nameHebrew: getFigureHebrewName(finalPattern),
    totalDots: total,
    inOwnHouse: false,
    landedHouse: pos,
  };
}

/**
 * הסוג השלישי (עמ' 154) — "ריבוע היחידים".
 * סופרים את השורות היחידיות (='1') בארבע האמהות (בתים 1-4, 16 שורות
 * בסך הכול) — n. הנוסח הערבי המפותל ("تضرب... מכים אותם בעצמם,
 * מוסיפים עליהם כמותם, מחלקים לשניים") הוא בפועל n·n, פשוט מוסתר:
 * (n² + n²) / 2 = n². מצמצמים את n² מודולו 16 (1-16), ומזהים את הצורה
 * לפי המיקום הקנוני שלה בשיבוץ השני (SHIBUTZ_2_CANONICAL_NUMBER, כשף
 * עמ' 106-109) — ואז מחפשים איפה אותה צורה יושבת בפועל על הלוח.
 *
 * הערת אי-ודאות: הטקסט מאשר שהתוצאה מזהה "צורה" (לא בהכרח בית), אך
 * לא מפרש איזה סדר-מספור בדיוק ממיר את המספר לצורה. השימוש כאן
 * בשיבוץ השני (הסדר הקנוני שכבר אומת בשער 3) הוא ההשערה הסבירה
 * ביותר, אך לא ציטוט ישיר לצעד הזה במיוחד.
 *
 * מקור (מאומת מול הערבית המקורית, עמ' 154): "أن تعد مفردات الأمهات
 * الأربع، وتضربهم في مثلهم، وتزيد عليهم مثلهم، وتقسم الجميع نصفين...
 * فانظر ذلك الشكل أين هو، ففي ذلك البيت الضمير، إن كان بيته، والا
 * رجعت به، ففيه الضمير."
 */
export function computeDhamirDoubledSquare(board) {
  let n = 0;
  for (let i = 1; i <= 4; i++) {
    const p = getHousePattern(board, i);
    if (!p) continue;
    n += p.split('').filter((ch) => ch === '1').length;
  }
  if (!n) return null;

  const squared = n * n;
  let idx = squared % 16;
  if (idx === 0) idx = 16;
  const identifiedPattern = SHIBUTZ_2_CANONICAL_NUMBER.find((f) => f.position === idx)?.pattern;
  if (!identifiedPattern) return null;

  const foundEntry = (board?.entries || []).find((e) => e.pattern === identifiedPattern);
  const landedHouse = foundEntry ? foundEntry.houseNumber : null;
  if (!landedHouse) return null;

  const naturalPattern = NATURAL_HOUSE_FIGURES[landedHouse];
  if (identifiedPattern === naturalPattern) {
    return {
      method: 'doubled-square',
      methodHebrew: 'ריבוע היחידים (הסוג השלישי)',
      sourceRef: 'כשף אל-אסראר עמ׳ 154 — הסוג השלישי',
      pattern: identifiedPattern,
      houseNumber: landedHouse,
      nameHebrew: getFigureHebrewName(identifiedPattern),
      singleCount: n,
      squared,
      inOwnHouse: true,
    };
  }

  const combinedPattern = combineRamlPatterns(identifiedPattern, naturalPattern);
  const combinedEntry = (board?.entries || []).find((e) => e.pattern === combinedPattern);
  const finalHouse = combinedEntry ? combinedEntry.houseNumber : landedHouse;
  const finalPattern = combinedEntry ? combinedEntry.pattern : combinedPattern;
  return {
    method: 'doubled-square',
    methodHebrew: 'ריבוע היחידים (הסוג השלישי)',
    sourceRef: 'כשף אל-אסראר עמ׳ 154 — הסוג השלישי',
    pattern: finalPattern,
    houseNumber: finalHouse,
    nameHebrew: getFigureHebrewName(finalPattern),
    singleCount: n,
    squared,
    inOwnHouse: false,
    landedHouse,
  };
}

/**
 * מריץ את השיטות המיושמות ומכריע לפי הרוב (עמ' 155: "תאסוף... ותכריע
 * לפי הרוב"). מחזיר גם את כל המועמדים וגם את ההכרעה, כדי שנתיב ההצגה
 * יוכל להראות את כל הראיות ולא רק את המסקנה.
 *
 * הערה: זו הכרעה חלקית — הספר עצמו קורא לאסוף את כל 5 ה"סוגים"
 * (עמ' 151-155). כאן מיושמים: סוג 1 (פנים 1,2,4 — חסרה פנים 3, "תנועת
 * העומק") וסוג 3. סוגים 2, 4, 5 אינם מיושמים — ראו הערה בתחתית הקובץ.
 */
export function computeDhamirByMajority(board) {
  const candidates = [
    computeDhamirMizan(board),
    computeDhamirHarkatAlArd(board),
    computeDhamirJawharayn(board),
    computeDhamirDoubledSquare(board),
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
// טרם מיושם — נבדק מול המקור הערבי המקורי (עמ' 152-156), אך נותרו
// אי-ודאויות אמיתיות בכל אחד; לא לנחש, יש להמתין להבהרה נוספת:
//
// הסוג הראשון, הפנים השלישיות — "תנועת העומק" (עמ' 152, מאומת בערבית:
// "مثلا كان الشكل الثامن في الأول، فتزيد من الأول إلى الثامن، وتنقص
// من الثامن إلى السادس عشر"). זו דוגמה ("مثلا" = "למשל") ולא כלל כללי
// מופשט — לא ברור איך מכלילים אותה לכל מקרה (איזו צורה משמשת "צורה
// שמינית", מאיפה מתחילים לספור באופן כללי).
//
// הסוג השני (עמ' 153, מאומת בערבית: "تنظر إلى شكل الميزان، وما قوي
// فيه من العناصر، فسيره إلى حيث يقف... وإلا فارجع به إلى بيته من
// تسكين السكنى") — "السكنى" = "המושב", כלומר משתמש ב-SHIBUTZ_1_MOSHAV
// (kashf-shibutzim.js) בדיוק כמו שכבר שיערנו. אבל "ما قوي... من
// العناصر" (היסוד ה"חזק") בצורה בודדת של 4 שורות עדיין דורש הכרעה
// בין שתי אפשרויות: ערך-חוזק לפי שיטת אבּדח (עפר8>מים4>אוויר2>אש1),
// או משהו אחר. ברגע שיתבהר, יש כבר את כל שאר הנתונים הדרושים.
//
// הסוג הרביעי (עמ' 153-155, מאומת בערבית: "تعد مساحة الرمل... وتنظر
// ذلك العدد بمن هو من الحروف، وتنظر الحروف لمن هي من الأشكال") —
// תלוי במיפוי אות↔צורה מלא, שקיים כרגע רק חלקית ובאי-ודאות ב-SHIBUTZ_6
// (kashf-shibutzim.js, 4 מתוך 16 צורות בלבד, וסתירה לא-פתורה בכלל
// "שתי האותיות") — חסום עד שהפער הזה ייסגר.
//
// הסוג החמישי (עמ' 155, מאומת בערבית: "أن تسير النقطة الأولى حيث
// تقف، وتسير الذي وقفت عليه إلى حيث يبلغ، حتى ينحصر أو يتكرر") —
// הליכה איטרטיבית: לוקחים את תוצאת הפנים הראשונה (computeDhamirMizan),
// ו"מהלכים" את הבית שהתקבל שוב באותו אופן, עד שהתוצאה חוזרת על עצמה
// או נסגרת למעגל. המבנה ברור יותר עכשיו, אך לא ברור אילו "צעד" בדיוק
// חוזרים עליו כשמגיעים לבית שאינו בין 1-8 (שאין לו הורים להמשיך
// לעקוב אחריהם) — טרם מיושם כדי לא להמציא כלל-עצירה.
//
// יש גם שיטה נוספת שאינה חלק מ-5 הסוגים (עמ' 155, "آخر"): "בית ראשון,
// שביעיתו במעגל ושביעיתו בצורה" — דורשת הבנת "קשר אמיתי/מושאל" שלא
// מוגדרים בעמודים אלה. טרם נבדקה.
// ─────────────────────────────────────────────────────────────────────────

export default {
  computeDhamirMizan,
  computeDhamirHarkatAlArd,
  computeDhamirJawharayn,
  computeDhamirDoubledSquare,
  computeDhamirByMajority,
};
