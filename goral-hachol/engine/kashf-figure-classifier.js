/**
 * kashf-figure-classifier.js
 *
 * מסווג צורות גורל לפי שיטת כשף-אל-אסראר.
 *
 * מקור: כשף-אל-אסראר המצונה, עמ' 63
 *   צוחקת / ח'ארג' (خارج): שורת-האש פתוחה (1) + שורת-האדמה סגורה (2)
 *   בוכה  / דאח'ל (داخل): שורת-האש סגורה (2) + שורת-האדמה פתוחה (1)
 *   מג'סד (مجسد): שתי השורות זהות (שתיהן 1 או שתיהן 2)
 *
 * קובץ זה אינו מחליף שום מנוע קיים — הוא שכבת סיווג נפרדת.
 */

import { HAWI_FIGURE_NAMES_BY_ID } from '../data/sources/hawi/foundations/hawi-figure-names.js';

/**
 * מחזיר את סיווג ח'ארג'/דאח'ל/מג'סד לפי הגדרת הספר.
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
 * מחזיר סעד/נחס מנתוני חאוי הקיימים.
 * @param {string} pattern
 * @returns {'saad'|'nahs'|'mixed'|null}
 */
export function getSaadNahs(pattern) {
  const fig = HAWI_FIGURE_NAMES_BY_ID?.[pattern];
  if (!fig) return null;
  const fortune = fig.fortuneHebrew || '';
  if (fortune.includes('נחס')) return 'nahs';
  if (fortune.includes('סעד')) return 'saad';
  return 'mixed';
}

const DAKHIL_KHARIJ_HEBREW = {
  'kharij':          "חיצוני (יוצא / מתממש)",
  'dakhil':          "פנימי (נשאר / מעוכב)",
  'mujassad-kharij': "מתהפך (תלוי, נוטה לצאת)",
  'mujassad-dakhil': "קבוע (תלוי, נוטה להישאר)",
};

const SAAD_NAHS_HEBREW = {
  saad:  'סעד — מזל טוב',
  nahs:  'נחס — מזל קשה',
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

export default { getDakhalKharij, getSaadNahs, classifyFigure };
