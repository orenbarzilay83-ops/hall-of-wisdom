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
 * רשימת הצורות שהספר עצמו מכנה "مجسد" במפורש, לפי עמ' 95-97 ("ומן غير
 * الكتاب: فصل في طبائع الأشكال على التقريب") — פרק מיוחס (לא גוף-הספר),
 * שעובר צורה־צורה על כל 16 הצורות ומזכיר "مجسد" רק עבור שש מהן:
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
 * אומת צולב מול התיאורים הפרטניים של אותן 16 צורות במקום אחר בספר
 * (kashf-al-asrar-book.js) — אותן שש צורות בדיוק מתוארות שם "מגושם/
 * מגושמת", אפס סתירה.
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
 * בדיקה האם צורה מופיעה ברשימת ה"مجسد" המפורשת של עמ' 95-97.
 * @param {string} pattern
 * @returns {boolean}
 */
export function isMujassadP95_97(pattern) {
  return MUJASSAD_P95_97_PATTERNS.includes(pattern);
}

export default { getDakhalKharij, getSaadNahs, classifyFigure, MUJASSAD_P95_97_PATTERNS, isMujassadP95_97 };
