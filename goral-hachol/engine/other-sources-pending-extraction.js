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

import {
  ELEMENT_DIRECTION,
  FIGURE_HEBREW_G,
  FIGURE_ELEMENT_MAP_G,
  isBeneficG,
  isMaleficG,
  deriveFigureG,
} from './hawi-interpreter.js';

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

// ── 10. computePrisonerGuilty — מי גרם לכליאה (הקול הכולל עמ' 55) ─────────
export function computePrisonerGuilty(chart) {
  if (!Array.isArray(chart) || chart.length < 16) return null;
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h1  = getH(1);
  const h5  = getH(5);
  const h6  = getH(6);
  const h7  = getH(7);
  const h11 = getH(11);
  if (!h1?.key || !h7?.key) return null;

  // כלל 12 (PDF1 עמ' 55): המתסבב בסגנה מג'נס ד'רב 1×7
  const derivedPattern = deriveFigureG(h1.key, h7.key);
  const derivedHebrew  = derivedPattern ? (FIGURE_HEBREW_G[derivedPattern] || derivedPattern) : '—';
  const element        = derivedPattern ? (FIGURE_ELEMENT_MAP_G[derivedPattern] || null) : null;
  const isMale         = element === 'אש' || element === 'אוויר';
  const causeGender    = element ? (isMale ? 'זכר' : 'נקבה') : null;
  const h1Hebrew = FIGURE_HEBREW_G[h1.key] || h1.key;
  const h7Hebrew = FIGURE_HEBREW_G[h7.key] || h7.key;
  const lines = [];
  if (derivedPattern) {
    lines.push(`ב1 (${h1Hebrew}) × ב7 (${h7Hebrew}) → ${derivedHebrew}: המסבב את הכליאה מהמין ${causeGender || '—'}`);
  }
  // כלל 11: תם-האסיר לפי ב11 מול ב5/ב6
  if (h11?.key && h5?.key && h6?.key) {
    if (h11.key === h5.key) {
      lines.push(`ב11 ≡ ב5 (${FIGURE_HEBREW_G[h11.key] || h11.key}) — האסיר חף מפשע`);
    } else if (h11.key === h6.key) {
      lines.push(`ב11 ≡ ב6 (${FIGURE_HEBREW_G[h11.key] || h11.key}) — האסיר חשוד ואשם`);
    }
  }
  return {
    derivedPattern,
    derivedHebrew,
    causeGender,
    outputHebrew: lines.join('\n'),
  };
}

// ── 11. computeDebts — חובות (הקול הכולל עמ' 25) ──────────────────────────
export function computeDebts(chart) {
  if (!Array.isArray(chart) || chart.length < 16) return null;
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h2  = getH(2);
  const h12 = getH(12);
  if (!h12?.key) return null;
  const h12Hebrew = FIGURE_HEBREW_G[h12.key] || h12.key;
  const lines = [];
  if (isBeneficG(h12)) {
    lines.push(`ב12 מיטיב (${h12Hebrew}) — בית החובות מורה על קלות: החוב ניתן לפירעון`);
  } else if (isMaleficG(h12)) {
    lines.push(`ב12 מזיק (${h12Hebrew}) — בית החובות מורה על כבדות: החוב כבד, פירעון קשה`);
  } else {
    lines.push(`ב12 ממוזג (${h12Hebrew}) — מצב החוב אינו חד-משמעי`);
  }
  if (h2?.key) {
    const h2Hebrew = FIGURE_HEBREW_G[h2.key] || h2.key;
    if (isBeneficG(h2)) {
      lines.push(`ב2 מיטיב (${h2Hebrew}) — יש אמצעים לפירעון החוב`);
    } else if (isMaleficG(h2)) {
      lines.push(`ב2 מזיק (${h2Hebrew}) — אמצעי הפירעון מוגבלים`);
    }
  }
  return {
    h12Fortune: h12.fortune || '',
    outputHebrew: lines.join('\n'),
  };
}

// ── 12. computeIllnessTypeIsqat — סוג המחלה (שיבוץ 7) (הקול הכולל עמ' 58) ──
export function computeIllnessTypeIsqat(chart) {
  if (!Array.isArray(chart) || chart.length < 16) return null;
  let jumla = 0;
  for (const house of chart) {
    for (const ch of String(house.key || '')) {
      if (ch === '1') jumla += 1;
      else if (ch === '2') jumla += 2;
    }
  }
  let remainder = jumla;
  while (remainder > 7) remainder -= 7;
  if (remainder === 0) remainder = 7;
  const ISQAT7_MAP = {
    1: { hebrew: 'ממסוס מן ג׳ין — פגיעה רוחנית מרוחות', isSpiritualCause: true },
    2: { hebrew: 'מחסוד ומעויין — עין הרע וקנאה', isSpiritualCause: true },
    3: { hebrew: 'מסחור מן אנס — כישוף אנושי', isSpiritualCause: true },
    4: { hebrew: 'מחלת ריר/בלגם — מיוחס למים', isSpiritualCause: false },
    5: { hebrew: 'מחלת דם — מיוחס לאוויר', isSpiritualCause: false },
    6: { hebrew: 'מחלת מרה שחורה — מיוחס לעפר', isSpiritualCause: false },
    7: { hebrew: 'מחלת מרה צהובה — מיוחס לאש', isSpiritualCause: false },
  };
  const entry = ISQAT7_MAP[remainder];
  return {
    jumla,
    remainder,
    isSpiritualCause: entry.isSpiritualCause,
    outputHebrew: `ג׳ומלה (${jumla}) ÷ 7, שארית ${remainder}: ${entry.hebrew}`,
  };
}

// ── 13. computeSorcererH9 — כישוף/מכשפים (הקול הכולל עמ' 56) ─────────────
export function computeSorcererH9(chart) {
  if (!Array.isArray(chart) || chart.length < 16) return null;
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h6  = getH(6);
  const h9  = getH(9);
  const h10 = getH(10);
  const h12 = getH(12);
  const h13 = getH(13);
  const h14 = getH(14);
  const lines = [];

  // H9 מצביע לכיוון המכשף ולסוג הכישוף (PDF1 עמ' 56)
  if (h9?.key) {
    const h9Hebrew = FIGURE_HEBREW_G[h9.key] || h9.key;
    const h9El  = FIGURE_ELEMENT_MAP_G[h9.key] || null;
    const h9Dir = h9El ? ELEMENT_DIRECTION[h9El] : null;
    const h9Ben = isBeneficG(h9); const h9Mal = isMaleficG(h9);
    const sorcDesc = h9Mal ? 'המכשף מן הקרובים / בעל השפעה שלילית'
                   : (h9Ben ? 'השפעה פחות מסוכנת' : 'מכשף ממוצע');
    lines.push(`ב9 (${h9Hebrew}${h9El ? `/${h9El}` : ''}) → כיוון המכשף: ${h9Dir || 'לא ידוע'} — ${sorcDesc}`);
  }

  // כללים ספציפיים: צורה × בית (PDF1 עמ' 56)
  if (h6?.key === '1221') lines.push('סוהר בבית 6 — הכישוף קבור בקבר');
  if (h6?.key === '1121') lines.push('נלחם בבית 6 — כישוף שתייה (סחר משרוב)');
  if (h12?.key === '1121') lines.push('נלחם בבית 12 — השואל מרוסן/קשור על ידי אשתו');
  if (h6?.key === '2121') lines.push('ממון נכנס בבית 6 — כישוף עקוד/קשור שנעשה על ידי נשים');
  if (h10?.key === '1222') lines.push('נשוא ראש בבית 10 — סימן לכישוף על הנשאל');

  // קהלה מנגזרת משני אדומים → קנאה קשה
  if (h13?.key === '2122' && h14?.key === '2122') {
    lines.push('שני עדים אדום — קהלה מנגזרת משני אדומים: קנאה קשה ועין הרע חמורה');
  }
  // קהלה מנגזרת משני שפל ראשות → שני כישופים קבורים מתחדשים
  if (h13?.key === '2221' && h14?.key === '2221') {
    lines.push('שני עדים שפל ראש — קהלה מנגזרת משני שפלי ראש: שני כישופים קבורים המתחדשים');
  }

  if (!lines.length) return null;
  return { h9Key: h9?.key || null, outputHebrew: lines.join('\n') };
}


// ── 15. computeHiddenTreasureH2 — מטמון/כנוז (הקול הכולל עמ' 24) ───────────
export function computeHiddenTreasureH2(chart) {
  if (!Array.isArray(chart) || chart.length < 16) return null;
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h2 = getH(2); const h4 = getH(4); const h6 = getH(6);
  if (!h2?.key) return null;
  const h2Hebrew = FIGURE_HEBREW_G[h2.key] || h2.key;
  const h4Hebrew = h4 ? (FIGURE_HEBREW_G[h4.key] || h4.key) : '—';
  const h6Hebrew = h6 ? (FIGURE_HEBREW_G[h6.key] || h6.key) : '—';
  const b2Ben = isBeneficG(h2); const b4Ben = h4 && isBeneficG(h4); const b6Ben = h6 && isBeneficG(h6);
  const b2Mal = isMaleficG(h2); const b4Mal = h4 && isMaleficG(h4); const b6Mal = h6 && isMaleficG(h6);
  const allBen = b2Ben && (h4 ? b4Ben : true) && (h6 ? b6Ben : true);
  const allMal = b2Mal && (h4 ? b4Mal : true) && (h6 ? b6Mal : true);
  const lines = [];
  lines.push(`ב2 (${h2Hebrew}) + ב6 (${h6Hebrew}) + ב4 (${h4Hebrew}) — אבחון מטמון תת-קרקעי`);
  if (allBen)       lines.push('שלושת הבתים מיטיב — יש מטמון וניתן להגיע אליו');
  else if (allMal)  lines.push('שלושת הבתים מזיק — המטמון אינו נגיש או אינו קיים');
  else if (b2Ben)   lines.push('בית 2 מיטיב — ייתכן מטמון, בדוק לפי שאר הכללים');
  else              lines.push('הבתים ממוזגים — אין הכרעה ברורה לגבי קיום המטמון');
  return { outputHebrew: lines.join('\n') };
}

// ── 16. computeH3Topics — בית 3: תנועה, חלום, מסרים (הקול הכולל עמ' 24) ────
export function computeH3Topics(chart) {
  if (!Array.isArray(chart) || chart.length < 16) return null;
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h3 = getH(3);
  if (!h3?.key) return null;
  const h3Hebrew = FIGURE_HEBREW_G[h3.key] || h3.key;
  const isBen = isBeneficG(h3); const isMal = isMaleficG(h3);
  const tone = (key) => isBen ? key + 'טוב' : (isMal ? key + 'שלילי' : key + 'ממוזג');
  const lines = [
    `ב3 (${h3Hebrew}) — תנועה ונסיעה קצרה: ${tone('').replace('טוב','תצליח').replace('שלילי','קשה').replace('ממוזג','עם עיכובים')}`,
    `ב3 (${h3Hebrew}) — חלום (קצר-טווח): ${isBen ? 'חלום טוב' : (isMal ? 'חלום שלילי' : 'חלום ממוזג')}`,
    `ב3 (${h3Hebrew}) — מסרים/הודעות/מתנות: ${isBen ? 'מסר טוב' : (isMal ? 'מסר שלילי' : 'מסר ממוזג')}`,
  ];
  return { h3Fortune: h3.fortune || '', outputHebrew: lines.join('\n') };
}

// ── 17. computeH4Secrets — נסתרות/סודות (הקול הכולל עמ' 24) ───────────────
export function computeH4Secrets(chart) {
  if (!Array.isArray(chart) || chart.length < 16) return null;
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h4 = getH(4);
  if (!h4?.key) return null;
  const h4Hebrew = FIGURE_HEBREW_G[h4.key] || h4.key;
  const isBen = isBeneficG(h4); const isMal = isMaleficG(h4);
  const desc = isBen ? 'הסוד/הנסתר יתגלה לטובה'
             : (isMal ? 'הסוד נסתר ומסוכן — לא ייחשף'
             : 'הסוד יתגלה בחלקו');
  return { h4Fortune: h4.fortune || '', outputHebrew: `ב4 (${h4Hebrew}) — נסתרות וסודות: ${desc}` };
}

// ── 18. computeIllnessCauseH4 — סיבת המחלה (הקול הכולל עמ' 24) ─────────────
export function computeIllnessCauseH4(chart) {
  if (!Array.isArray(chart) || chart.length < 16) return null;
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h4 = getH(4); const h6 = getH(6);
  if (!h4?.key || !h6?.key) return null;
  const h4Hebrew = FIGURE_HEBREW_G[h4.key] || h4.key;
  const h6Hebrew = FIGURE_HEBREW_G[h6.key] || h6.key;
  const h4El = FIGURE_ELEMENT_MAP_G[h4.key] || null;
  const h6El = FIGURE_ELEMENT_MAP_G[h6.key] || null;
  const lines = [];
  lines.push(`בית 4 (${h4Hebrew}) = שורש/סיבה; בית 6 (${h6Hebrew}) = ביטוי המחלה`);
  if (h4El && h6El) {
    if (h4El === h6El) {
      lines.push(`אותו יסוד (${h4El}) — מחלה ממקור כרוני/פנימי`);
    } else {
      lines.push(`יסוד ב4: ${h4El} ← סיבה; יסוד ב6: ${h6El} ← ביטוי`);
    }
  }
  return { outputHebrew: lines.join('\n') };
}

// ── 19. computeCelebrationsH5 — שמחות ואירועים (הקול הכולל עמ' 24) ──────────
export function computeCelebrationsH5(chart) {
  if (!Array.isArray(chart) || chart.length < 16) return null;
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h5 = getH(5);
  if (!h5?.key) return null;
  const h5Hebrew = FIGURE_HEBREW_G[h5.key] || h5.key;
  const isBen = isBeneficG(h5); const isMal = isMaleficG(h5);
  const desc = isBen ? 'בית 5 מיטיב — השמחות והאירועים יתקיימו'
             : (isMal ? 'בית 5 מזיק — השמחה מוטלת בספק, עצב'
             : 'בית 5 ממוזג — שמחה עם עיכובים/חלקית');
  return { h5Fortune: h5.fortune || '', outputHebrew: `ב5 (${h5Hebrew}) — שמחות ואירועים: ${desc}` };
}

