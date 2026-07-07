/**
 * al-falak-abjad-decomposition.js
 *
 * ═══════════════════════════════════════════════════════════════════════
 * מקור חיצוני — לא כשף אל-אסראר.
 * ═══════════════════════════════════════════════════════════════════════
 *
 * ספר: الفلك المشحون في علم الرمل المصون (אל-פלק אל-משחון).
 *
 * שימוש: כשף אל-אסראר, השער הרביעי, "הסוג הרביעי" בגילוי הכוונה הנסתרת
 * (עמ' 153-155) נותן כלל מילולי — "סופרים את חשבון המערך כולו, יודעים
 * את מספרו, ומתבוננים לאיזו אות הוא שייך" — אך אינו נותן דוגמה מספרית
 * להמרת מספר גדול (טווח ~64-128 בלוח מלא) לאות אבג'ד בודדת, וטווח זה
 * אינו מתיישב עם ערכי אבג'ד רגילים (חסרים ערכים לרוב המספרים בטווח).
 *
 * אל-פלק אל-משחון נותן דוגמה מספרית מפורשת לאותה בעיה מבנית (ספירת
 * "مساحة الرمل" = 94, פירוק ל-דאל(4)+צאד(90), ולא חיפוש אות בודדת בעלת
 * ערך 94), ולכן משמש כאן כמקור-השלמה לפעולת ההמרה **בלבד** — לא כתוכן
 * פרשני של כשף אל-אסראר, ולא כתחליף לכלל של כשף. שולב באפליקציה
 * באישור מפורש של המשתמש (2026-07-07), בתנאי גילוי מלא בקוד ובממשק,
 * באותו אופן שבו מסומנות תוספות "נֻזְהַת אל-עֻקוּל" ו"אל-מֻלְתַקַט"
 * בקבצי כשף (additionalMethods עם sourceStatus מפורש).
 *
 * טבלת ערכי אבג'ד (א=1...ת=400, ואילך ת'=500 עד ע'=1000) היא הסדר
 * הקלאסי הסטנדרטי — לא ייחודית לאף אחד משני הספרים; מובאת כאן משום
 * שהיא הכלי הטכני שאל-פלק משתמש בו בדוגמתו.
 */

export const AL_FALAK_SOURCE_DISCLOSURE = {
  bookArabic: 'الفلك المشحون في علم الرمل المصون',
  bookHebrew: 'אל-פלק אל-משחון בעלם אל-רמל אל-מסון',
  isKashfAlAsrar: false,
  usageScope:
    'רק לפעולת ההמרה (מספר → אותיות אבג\'ד) עבור שער 4 סוג 4 של כשף ' +
    'אל-אסראר — לא לשום תוכן פרשני אחר.',
  userAuthorization: '2026-07-07, אישור מפורש בתנאי גילוי מלא',
};

// ערכי אבג'ד קלאסיים (סדר "אבג'ד הגדול" הסטנדרטי). האות בעמודה Hebrew
// היא התעתיק שכבר בשימוש ב-SHIBUTZ_6_LETTER_TABLE (kashf-shibutzim.js,
// כשף עמ' 138) — לא תעתיק עצמאי חדש.
export const ABJAD_VALUES = [
  { arabic: 'ا', hebrew: 'א', name: 'אליף', value: 1 },
  { arabic: 'ب', hebrew: 'ב', name: 'בא', value: 2 },
  { arabic: 'ج', hebrew: "ג'", name: 'ג\'ים', value: 3 },
  { arabic: 'د', hebrew: 'ד', name: 'דאל', value: 4 },
  { arabic: 'ه', hebrew: 'ה', name: 'הא', value: 5 },
  { arabic: 'و', hebrew: 'ו', name: 'ואו', value: 6 },
  { arabic: 'ز', hebrew: 'ז', name: 'זאי', value: 7 },
  { arabic: 'ح', hebrew: 'ח', name: 'חא', value: 8 },
  { arabic: 'ط', hebrew: 'ט', name: 'טא', value: 9 },
  { arabic: 'ي', hebrew: 'י', name: 'יא', value: 10 },
  { arabic: 'ك', hebrew: 'כ', name: 'כאף', value: 20 },
  { arabic: 'ل', hebrew: 'ל', name: 'לאם', value: 30 },
  { arabic: 'م', hebrew: 'מ', name: 'מים', value: 40 },
  { arabic: 'ن', hebrew: 'נ', name: 'נון', value: 50 },
  { arabic: 'س', hebrew: 'ס', name: 'סין', value: 60 },
  { arabic: 'ع', hebrew: 'ע', name: 'עין', value: 70 },
  { arabic: 'ف', hebrew: 'פ', name: 'פא', value: 80 },
  { arabic: 'ص', hebrew: 'צ', name: 'צאד', value: 90 },
  { arabic: 'ق', hebrew: 'ק', name: 'קאף', value: 100 },
  { arabic: 'ر', hebrew: 'ר', name: 'רא', value: 200 },
  { arabic: 'ش', hebrew: 'ש', name: 'שין', value: 300 },
  { arabic: 'ت', hebrew: 'ת', name: 'תא', value: 400 },
  // ── ערכים 500 ואילך (אותיות "מורחבות") — לא נדרשים בטווח נקודות-הלוח
  // הריאלי (~64-128, ראה kashf-dhamir-type4-external.js), ולא נעשה בהם
  // שימוש כרגע. הושמטו מכוונה כדי לא לנחש תעתיק לא-חד-משמעי (בטבלת
  // עמ' 138 יש רק 6 אותיות-גרש, וללא סדר-ערך מפורש בספר לשיוך ודאי).
];

const BY_VALUE = new Map(ABJAD_VALUES.map((x) => [x.value, x]));

/**
 * פירוק מספר לרכיבי אבג'ד לפי דרגת-מקום (יחידות, עשרות, מאות...),
 * בסדר עולה — תואם את דוגמת אל-פלק המפורשת (94 = דאל(4) + צאד(90),
 * יחידות לפני עשרות).
 * @param {number} n
 * @returns {{status:'ok', letters:Array}|{status:'unsupported_number', letters:Array, rest:number}}
 */
export function decomposeNumberToAbjadLetters(n) {
  if (!Number.isInteger(n) || n <= 0) {
    throw new Error('decomposeNumberToAbjadLetters: מספר לא תקין');
  }
  const result = [];
  let rest = n;

  const units = rest % 10;
  if (units) { const item = BY_VALUE.get(units); if (item) result.push(item); }
  rest -= units;

  const tens = rest % 100;
  if (tens) { const item = BY_VALUE.get(tens); if (item) result.push(item); }
  rest -= tens;

  const hundreds = rest % 1000;
  if (hundreds) { const item = BY_VALUE.get(hundreds); if (item) result.push(item); }
  rest -= hundreds;

  if (rest !== 0 || result.length !== [units, tens, hundreds].filter(Boolean).length) {
    return { status: 'unsupported_number', letters: result, rest: n - result.reduce((s, x) => s + x.value, 0) };
  }
  return { status: 'ok', letters: result };
}

/**
 * שיטה משנית (מתועדת באל-פלק כ"דעה אחרת", לא כברירת מחדל): הפחתת
 * המספר ב-28 חוזרות, שארית → מיקום באות אבג'ד (1-28), לא ערך.
 */
export function resolveByMod28(n) {
  if (!Number.isInteger(n) || n <= 0) {
    throw new Error('resolveByMod28: מספר לא תקין');
  }
  // מיקום 1-22 בלבד נתמך (22 אותיות בסיס; 23-28 דורשות תעתיק-גרש
  // שלא נעשה בו שימוש חד-משמעי כאן — ראה הערה למעלה).
  const remainder = n % 28 || 28;
  if (remainder > 22) {
    return { status: 'unsupported_remainder', remainder };
  }
  const item = ABJAD_VALUES[remainder - 1];
  return { status: 'ok', remainder, letter: item };
}
