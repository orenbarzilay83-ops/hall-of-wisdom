/**
 * kashf-figure-classifier.js
 *
 * מסווג צורות גורל לפי שיטת כשף-אל-אסראר.
 *
 * מקור: כשף-אל-אסראר המצונה, עמ' 63
 *   צוחקת / יוצא (خارج): שורת-האש פתוחה (1) + שורת-האדמה סגורה (2)
 *   בוכה  / נכנס (داخل): שורת-האש סגורה (2) + שורת-האדמה פתוחה (1)
 *   אנדרוגינוס (مجسد): שתי השורות זהות (שתיהן 1 או שתיהן 2)
 *
 * קובץ זה אינו מחליף שום מנוע קיים — הוא שכבת סיווג נפרדת.
 */

import { HAWI_FIGURE_NAMES_BY_ID } from '../data/sources/kashf-al-asrar/kashf-figure-names.js';

/**
 * מחזיר את סיווג יוצא/נכנס/אנדרוגינוס לפי הגדרת הספר.
 *
 * 4 קטגוריות (מתואמות עם movementHebrew בנתוני חאוי):
 *   kharij          (חיצוני)   fire=1, earth=2  — צוחקת, יוצאת
 *   dakhil          (פנימי)    fire=2, earth=1  — בוכה, נכנסת
 *   mujassad-kharij (מתהפך)   fire=1, earth=1  — כפול-גוף, נוטה לחוץ
 *   mujassad-dakhil (קבוע)    fire=2, earth=2  — כפול-גוף, נוטה לפנים
 *
 * @param {string} pattern
 * @returns {'kharij'|'dakhil'|'mujassad-kharij'|'mujassad-dakhil'}
 */
export function getDakhalKharij(pattern) {
  const fire  = pattern[0];
  const earth = pattern[3];
  if (fire === '1' && earth === '2') return 'kharij';
  if (fire === '2' && earth === '1') return 'dakhil';
  if (fire === '1' && earth === '1') return 'mujassad-kharij';
  return 'mujassad-dakhil';
}

/**
 * מחזיר מיטיב/מזיק מנתוני חאוי הקיימים.
 * @param {string} pattern
 * @returns {'saad'|'nahs'|'mixed'|null}
 */
export function getSaadNahs(pattern) {
  const fig = HAWI_FIGURE_NAMES_BY_ID?.[pattern];
  if (!fig) return null;
  const fortune = fig.fortuneHebrew || '';
  if (fortune.includes('מזיק')) return 'nahs';
  if (fortune.includes('מיטיב')) return 'saad';
  return 'mixed';
}

const DAKHIL_KHARIJ_HEBREW = {
  'kharij':          "חיצונית — צוחקת (יוצאת / מתממשת)",
  'dakhil':          "פנימית — בוכה (נשארת / מעוכבת)",
  'mujassad-kharij': "מתהפכת (תלוי, נוטה לחוץ)",
  'mujassad-dakhil': "קבועה (תלוי, נוטה להישאר)",
};

const SAAD_NAHS_HEBREW = {
  saad:  'מיטיב',
  nahs:  'מזיק',
  mixed: 'ממוזג',
};

/**
 * סיווג מלא של צורה לפי שיטת כשף-אל-אסראר.
 * @param {string} pattern
 * @returns {{pattern, dakhalKharij, saadNahs, dakhalKharijHebrew, saadNahsHebrew}}
 */
export function classifyFigure(pattern) {
  const dakhalKharij = getDakhalKharij(pattern);
  const saadNahs     = getSaadNahs(pattern);
  return {
    pattern,
    dakhalKharij,
    saadNahs,
    dakhalKharijHebrew: DAKHIL_KHARIJ_HEBREW[dakhalKharij] || dakhalKharij,
    saadNahsHebrew:     SAAD_NAHS_HEBREW[saadNahs]         || '',
  };
}

/**
 * רשימת הצורות שהספר עצמו מכנה "مجسد" במפורש, לפי עמ' 95-97 ("ومن غير
 * الكتاب: فصل في طبائع الأشكال على التقريب") — פרק *מיוחס* (לא גוף-הספר;
 * הפרק עצמו נפתח במילים "ومن غير الكتاب" = "ומחוץ לספר"), שעובר צורה־צורה
 * על כל 16 הצורות ומזכיר "مجسد" עבור שש מהן:
 *   أنكيس (שפל ראש, 2221) — "...ليلي، مجسد، ملآن"
 *   جودلة (נלחם, 1121) — "...مجسد مع الذكور والإناث..."
 *   العتبة الداخلة (סף נכנס, 2111) — "...جامد، مجسد، داخل..."
 *   نصرة خارجة (כבוד יוצא, 1122) — "...ناري، مجسد، قوي..."
 *   نصرة داخلة (כבוד נכנס, 2211) — "...مؤنث، محلول، مجسد"
 *   العقلة (סוהר, 1221) — "...مربوط، مجسد، ترابي"
 *
 * חשוב — זו רשימה שונה לגמרי מ-getDakhalKharij לעיל: הקטגוריות
 * 'mujassad-kharij'/'mujassad-dakhil' שם הן כינוי-קוד פנימי לצורות
 * "קבועות"/"מתהפכות" (fire=earth; עמ' 54-58, ובפירוש בעמ' 211 ("צורה
 * מיטיבה וקבועה"/"צורה מיטיבה ומתַהפכת")) — קבוצה שונה של 8 צורות
 * (1111,1121,1211,1221,2112,2122,2212,2222), ללא קשר למילה "مجسد"
 * שבעמ' 95-97. אל תשתמש ב-getDakhalKharij כתחליף לרשימה הזו: החפיפה
 * בין שתי הקבוצות היא רק 2 צורות (1121, 1221) מתוך 6.
 *
 * מקור: כשף אל-אסראר עמ' 95-97 (PDF 97-99), פרק מיוחס ("ومن غير الكتاب").
 *
 * **הגבלה חשובה (עודכן 2026-10-05):** היות שהפרק עצמו מסומן "ومن غير
 * الكتاب", אין להשתמש ברשימה המלאה הזו לבדה כדי להפיק סימן חיובי פעיל.
 * נבדק ישירות מול תיאורי כל שש הצורות בפרק הפרופיל הבלתי-מיוחס (גוף-הספר,
 * "פרק א-16" שבעמ' 70-94, kashf-al-asrar-book.js) — רק שלוש מתוך שש
 * מאוזכרות "מגושם/מגושמת" גם שם, במשפט התכונות העצמאי של אותה צורה עצמה
 * (לא בפרק המיוחס):
 *   עמ' 76 — העقلة/סוהר (1221): "...קשורה, מגושמת ומיסוד העפר."
 *   עמ' 77 — أنكيس/שפל ראש (2221): "...כבדה, לילית, מגושמת וארצית."
 *   עמ' 85 — نصرة داخلة/כבוד נכנס (2211): "...קבועה, לילית, נקבית,
 *            פתורה ומגושמת."
 * שלוש הנותרות מופיעות ברשימת עמ' 95-97 בלבד — תיאורן העצמאי בגוף-הספר
 * (עמ' 74 נלחם/1121, עמ' 82 כבוד יוצא/1122, עמ' 89 סף נכנס/2111) אינו
 * כולל את המילה "مجسد"/"מגושם" כלל (עמ' 74 ו-82 אומרות שם "מתהפכת",
 * שמשתייכת לקטגוריית קבוע/מתהפך הנפרדת לעיל, לא ל-مجسد). ייתכן שהפרק
 * המיוחס מתעד מסורת נוספת/חיצונית לגבי שלוש אלה שאינה מופיעה בגוף הספר —
 * אין להכריע זאת כאן, רק לתעד את הממצא.
 */
export const MUJASSAD_P95_97_PATTERNS = Object.freeze([
  '2221', // أنكيس / שפל ראש
  '1121', // جودلة / נלחם
  '2111', // العتبة الداخلة / סף נכנס
  '1122', // نصرة خارجة / כבוד יוצא
  '2211', // نصرة داخلة / כבוד נכנס
  '1221', // العقلة / סוהר
]);

/**
 * תת-קבוצה מתוך MUJASSAD_P95_97_PATTERNS שמאומתת גם בתיאור הפרטני העצמאי
 * של אותה צורה בגוף-הספר (לא בפרק המיוחס עמ' 95-97 בלבד) — ראו תיעוד
 * מלא מעל. זו הקבוצה היחידה שמותר לה להפיק סימן חיובי פעיל עבור "مجسد"
 * (למשל ב-computePregnancyTwinsMujassadP191).
 */
export const MUJASSAD_BODY_CONFIRMED_PATTERNS = Object.freeze([
  '1221', // العقلة / סוהר — עמ' 76
  '2221', // أنكيس / שפל ראש — עמ' 77
  '2211', // نصرة داخلة / כבוד נכנס — עמ' 85
]);

/**
 * תת-קבוצה מתוך MUJASSAD_P95_97_PATTERNS שמאוזכרת "مجسد" רק בפרק המיוחס
 * עמ' 95-97 — תיאורן העצמאי בגוף-הספר (עמ' 74, 82, 89) אינו משתמש במילה
 * הזו. מתועדת בנפרד, לא משמשת ענף חיובי במתודות קנוניות.
 */
export const MUJASSAD_P95_97_ATTRIBUTED_ONLY_PATTERNS = Object.freeze([
  '1121', // جودلة / נלחם — עמ' 74 (שם: "מתהפכת", לא "מגושמת")
  '2111', // العتبة الداخلة / סף נכנס — עמ' 89 (אין "מגושמת")
  '1122', // نصرة خارجة / כבוד יוצא — עמ' 82 (שם: "מתהפכת", לא "מגושמת")
]);

/**
 * בדיקה האם צורה מופיעה ברשימת ה"مجسد" המפורשת של עמ' 95-97 (הרשימה
 * המלאה, פרק מיוחס) — לתיעוד/השוואה בלבד. אין להשתמש בזו לבדה כדי להפיק
 * סימן חיובי פעיל; לכך יש להשתמש ב-isMujassadBodyConfirmed.
 * @param {string} pattern
 * @returns {boolean}
 */
export function isMujassadP95_97(pattern) {
  return MUJASSAD_P95_97_PATTERNS.includes(pattern);
}

/**
 * בדיקה האם צורה מאומתת כ"مجسد" הן בפרק המיוחס עמ' 95-97 והן בתיאור
 * הפרטני העצמאי שלה בגוף-הספר (עמ' 70-94) — זו הבדיקה שיש להשתמש בה
 * כדי להפיק סימן חיובי פעיל (positive:true) במתודות קנוניות.
 * @param {string} pattern
 * @returns {boolean}
 */
export function isMujassadBodyConfirmed(pattern) {
  return MUJASSAD_BODY_CONFIRMED_PATTERNS.includes(pattern);
}

export default {
  getDakhalKharij,
  getSaadNahs,
  classifyFigure,
  MUJASSAD_P95_97_PATTERNS,
  MUJASSAD_BODY_CONFIRMED_PATTERNS,
  MUJASSAD_P95_97_ATTRIBUTED_ONLY_PATTERNS,
  isMujassadP95_97,
  isMujassadBodyConfirmed,
};
