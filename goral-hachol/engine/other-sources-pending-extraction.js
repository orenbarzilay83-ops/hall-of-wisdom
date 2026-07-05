/**
 * other-sources-pending-extraction.js
 *
 * "מחסן" זמני לפונקציות שהוצאו מתוך hawi-interpreter.js כי הן אינן
 * מבוססות על ספר חאווי — הן מצטטות ספרים אחרים (בעיקר "الأقول الجامع
 * في علم الرمل" של השייח' מוחמד סאס, ולעיתים "بلوغ الأمل في علم الرمل")
 * שאינם חלק מהיקף ההפרדה הנוכחי (חאווי מול כשף אל-אסרר).
 *
 * חשוב: קובץ זה עדיין לא מחובר לשום מנוע חי. הפונקציות כאן שמורות
 * (לא נמחקו) — sourceStatus: ההיקף המלא של הספרים האלה טרם טופל,
 * ראה CLAUDE.md. אם וכאשר יוחלט לבנות שכבה עצמאית לספרים האלה, זה
 * המקום להתחיל ממנו.
 */

import { ELEMENT_DIRECTION } from './hawi-interpreter.js';

// מיפוי צורה → איבר גוף הכואב
// מקור: القول الجامع في علم الرمل (שייח׳ מוחמד סאס), עמ׳ 16
// שיטה: הצורה שנמצאת בבית 6 מורה על האיבר הכואב
// (3 צורות לא מוזכרות במקור: שפל ראש, סוהר, כבוד יוצא)
const FIGURE_BODY_PART = {
  '1222': { arabic: 'الرقبة والكتف الأيمن', hebrew: 'צוואר וכתף ימין' },   // נשוא ראש / أحيان
  '2212': { arabic: 'الرقبة والكتف الأيمن', hebrew: 'צוואר וכתף ימין' },   // לבן / بياض
  '2211': { arabic: 'الكتف الأيسر',          hebrew: 'כתף שמאל' },          // כבוד נכנס / نصرة داخلة
  '1121': { arabic: 'اليد اليمنى',           hebrew: 'יד ימין' },            // נלחם / جودلة
  '1211': { arabic: 'اليد اليسرى',           hebrew: 'יד שמאל' },            // בר הלחי / نقي الخد
  '2112': { arabic: 'البطن والأضلاع',        hebrew: 'בטן וצלעות' },         // חיבור / اجتماع
  '2222': { arabic: 'السرة',                 hebrew: 'טבור' },               // קהלה / جماعة
  '2122': { arabic: 'الظهر',                 hebrew: 'גב' },                  // אדום / حمرة
  '1111': { arabic: 'الذكر',                 hebrew: 'איברי מין' },           // דרך / طريق
  '1212': { arabic: 'الفخذ الأيمن',         hebrew: 'ירך ימין' },            // ממון יוצא / قبض خارج
  '2121': { arabic: 'الفخذ الأيسر',         hebrew: 'ירך שמאל' },            // ממון נכנס / قبض داخل
  '2111': { arabic: 'الساق اليمنى',          hebrew: 'שוק ורגל ימין' },       // סף נכנס / عتبة داخلة
  '1112': { arabic: 'الساق اليسرى',          hebrew: 'שוק ורגל שמאל' },       // סף יוצא / عتبة خارجة
  // הצורות הבאות לא מוזכרות בפרק זה במקור:
  '2221': null,  // שפל ראש / انكيس
  '1221': null,  // סוהר / عقلة
  '1122': null,  // כבוד יוצא / نصرة خارجة
};

export function computeBodyPartDiagnosis(chart) {
  const h6 = chart.find((h) => Number(h.house) === 6);
  if (!h6?.key) return null;
  const entry = FIGURE_BODY_PART[h6.key];
  const figHebrew = h6.hebrew || h6.key;
  if (entry === undefined) return null;
  if (entry === null) {
    return {
      figureKey: h6.key,
      figureHebrew: figHebrew,
      bodyPartHebrew: null,
      outputHebrew: `${figHebrew} בבית 6 — האיבר הכואב: לא מפורש במקור (הצורה אינה נזכרת בפרק זה עמ׳ 16)`,
    };
  }
  return {
    figureKey: h6.key,
    figureHebrew: figHebrew,
    bodyPartHebrew: entry.hebrew,
    bodyPartArabic: entry.arabic,
    outputHebrew: `${figHebrew} בבית 6 — האיבר הכואב: ${entry.hebrew}`,
  };
}

// מיפוי יסוד → מין וגיל הגנב
// מקור: القول الجامع في علم الرمل (שייח׳ מוחמד סאס), עמ׳ 48
// שיטה: יסוד הצורה בבית 7 מורה על מין הגנב וגילו
const THIEF_GENDER_AGE_BY_ELEMENT = {
  'אש':    { gender: 'זכר', age: 'צעיר',    outputHebrew: 'זכר צעיר' },
  'מים':   { gender: 'זכר/נקבה', age: 'ילד/ה', outputHebrew: 'ילד/ה צעיר' },
  'אוויר': { gender: 'זכר', age: 'מבוגר',   outputHebrew: 'זכר מבוגר' },
  'עפר':   { gender: 'נקבה', age: 'בגרות',  outputHebrew: 'נקבה' },
};

export function computeThiefGenderAge(chart) {
  const h7 = chart.find((h) => Number(h.house) === 7);
  if (!h7?.key) return null;
  const element = h7.element || h7.elementHebrew || '';
  const desc = THIEF_GENDER_AGE_BY_ELEMENT[element];
  const figHebrew = h7.hebrew || h7.key;
  let specificNote = '';
  if (h7.key === '1111') specificNote = ' (דרך — זכר בבירור לפי המקור)';
  if (h7.key === '1122') specificNote = ' (כבוד יוצא — זכר בבירור לפי המקור)';
  if (!desc && !specificNote) {
    return {
      figureKey: h7.key, figureHebrew: figHebrew, element,
      outputHebrew: `${figHebrew} בבית 7 — מין הגנב: לא מפורש במקור`,
    };
  }
  const baseDesc = desc ? desc.outputHebrew : 'זכר';
  return {
    figureKey: h7.key, figureHebrew: figHebrew, element,
    gender: desc?.gender || 'זכר', age: desc?.age || '',
    outputHebrew: `${figHebrew} בבית 7 (יסוד: ${element || 'לא ידוע'}) — הגנב: ${baseDesc}${specificNote}`,
  };
}

// BATCH C: נעדר — מיקום + האם יחזור (PDF1 p.52, PDF2 p.59)
export function computeMissingPersonLocation(chart) {
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h5  = getH(5);
  const h6  = getH(6);
  const h9  = getH(9);
  const h10 = getH(10);
  const h11 = getH(11);
  const lines = [];
  const h9El  = h9?.element  || h9?.elementHebrew  || '';
  const h10El = h10?.element || h10?.elementHebrew || '';
  const dir9  = ELEMENT_DIRECTION[h9El]  || null;
  const dir10 = ELEMENT_DIRECTION[h10El] || null;
  if (dir9 && dir10 && dir9 === dir10) {
    lines.push(`בית 9+10 אותו כיוון (${h9El}) → הנעדר בכיוון ${dir9}`);
  } else {
    if (dir9)  lines.push(`בית 9 (${h9?.hebrew || h9El || '?'}) → כיוון ${dir9}`);
    if (dir10) lines.push(`בית 10 (${h10?.hebrew || h10El || '?'}) → כיוון ${dir10}`);
  }
  if (h5 && String(h5.fortune || '').includes('מיטיב')) {
    lines.push(`בית 5 מיטיב (${h5.hebrew || ''}) → הנעדר קרוב לבית`);
  }
  if (h6?.key === '1212') {
    lines.push('ממון יוצא בבית 6 → הנעדר בגלות / רחוק מהבית');
  }
  if (h11?.key?.startsWith('1') && String(h11.fortune || '').includes('מיטיב')) {
    lines.push(`בית 11 פתוח+מיטיב (${h11.hebrew || ''}) → יש קשר קרוב עם הנעדר`);
  }
  return lines.length ? { outputHebrew: lines.join('\n') } : null;
}

export function computeMissingPersonReturn(chart) {
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h1  = getH(1);
  const h6  = getH(6);
  const h7  = getH(7);
  const h9  = getH(9);
  const h14 = getH(14);
  const isSaad = (h) => !!h && String(h.fortune || '').includes('מיטיב');
  const lines = [];
  if (h14?.key === '1222' || h14?.key === '2211') {
    lines.push(`${h14.hebrew || h14.key} בבית 14 → הנעדר יחזור`);
  }
  if (h9?.key === '2222') {
    lines.push('קהלה בבית 9 — הנעדר יסע לאזור חדש');
  }
  if (h6?.key === '1212') {
    lines.push('⚠ ממון יוצא בבית 6 — סכנת מוות בגלות');
  }
  if (isSaad(h1) && isSaad(h7)) lines.push('בית 1+7 מיטיב — יש סיכוי טוב לחזרה');
  else if (!isSaad(h1) && !isSaad(h7)) lines.push('בית 1+7 מזיק — הסיכוי לחזרה נמוך');
  if (!lines.length) lines.push('לא נמצאו סימנים ברורים לגבי חזרת הנעדר');
  return { outputHebrew: lines.join('\n') };
}
