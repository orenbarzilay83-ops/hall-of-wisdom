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
  computeNameLetters,
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


// ============================================================
// BATCH D: מחלה — האם ימות + סוג הג׳ין (PDF1 p.41-42, p.57-58)
// ============================================================
const DEATH_RISK_FIGURES = new Set(['2121','2122','2222','2112','1221','1212','1111']);
const LIFE_SAVING_FIGURES = new Set(['1122','2211','1222','2212']);

export function computeDeathRisk(chart) {
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h4  = getH(4);
  const h6  = getH(6);
  const h8  = getH(8);
  const h12 = getH(12);
  const h14 = getH(14);
  const lines = [];
  let riskLevel = 0;
  if (h6?.key === '2122' && h8?.key === '2221') {
    lines.push('⚠⚠ אדום בבית 6 + שפל ראש בבית 8 — "הגלב עליהם המוות", סכנת מוות גבוהה מאוד');
    riskLevel += 3;
  }
  for (const h of [h4, h12, h14].filter(Boolean)) {
    if (DEATH_RISK_FIGURES.has(h.key || '')) {
      lines.push(`⚠ ${h.hebrew || h.key} בבית ${h.house} — צורה מסוכנת`);
      riskLevel += 1;
    }
  }
  if (h14 && String(h14.fortune || '').includes('מזיק')) {
    lines.push('בית 14 (אחרית) מזיק — תוצאה שלילית');
    riskLevel += 1;
  }
  for (const h of [h6, h8].filter((h) => h && LIFE_SAVING_FIGURES.has(h.key || ''))) {
    lines.push(`${h.hebrew || h.key} בבית ${h.house} — צורה מגנה, סיכוי החלמה`);
    riskLevel -= 1;
  }
  const verdict = riskLevel >= 3 ? 'סכנת מוות גבוהה מאוד — יש להיזהר'
    : riskLevel >= 2 ? 'סכנה גבוהה — מצב קשה'
    : riskLevel >= 1 ? 'סכנה בינונית — יש לעקוב'
    : 'לא נמצאו סימני מוות חזקים';
  lines.push(`\nמסקנה: ${verdict}`);
  return { riskLevel, verdict, outputHebrew: lines.join('\n') };
}

export function computeJinnType(chart) {
  const h15 = chart.find((h) => Number(h.house) === 15);
  const h6  = chart.find((h) => Number(h.house) === 6);
  if (!h15?.key) return null;
  let dots = 0;
  for (const ch of (h15.key || '')) {
    if (ch === '1') dots += 1;
    else if (ch === '2') dots += 2;
  }
  const product = dots * 4;
  const rem = product % 3 || 3;
  const JINN_MAP = { 1: 'ג׳ין רוחני', 2: 'חסד / עין רעה', 3: 'כישוף מאדם' };
  const ELEMENT_JINN = {
    'אש': 'ג׳ין אש', 'עפר': 'ג׳ין אדמה',
    'מים': 'ג׳ין טייר — מים', 'אוויר': 'ג׳ין טייר — אוויר',
  };
  const h6El = h6?.element || h6?.elementHebrew || '';
  const lines = [];
  if (JINN_MAP[rem]) lines.push(`שיטת נקודות (ב15=${dots}×4=${product}, שארית ${rem}): ${JINN_MAP[rem]}`);
  if (ELEMENT_JINN[h6El]) lines.push(`לפי יסוד ב6 (${h6El}): ${ELEMENT_JINN[h6El]}`);
  return { dots, product, remainder: rem, outputHebrew: lines.join('\n') };
}

// ============================================================
// BATCH E: נישואין — גרושה/בעולה / בתולה + צניעות (PDF1 p.43-44)
// ============================================================
export function computeWifeVirginityStatus(chart) {
  const h7  = chart.find((h) => Number(h.house) === 7);
  const h13 = chart.find((h) => Number(h.house) === 13);
  if (!h7?.key || !h13?.key) return null;
  const derive = (p1, p2) => {
    if (!p1 || !p2 || p1.length !== 4 || p2.length !== 4) return null;
    return p1.split('').map((c, i) => c === p2[i] ? '2' : '1').join('');
  };
  const derived = derive(h13.key, h7.key);
  if (!derived) return null;
  const isVirgin = derived.startsWith('2');
  const status = isVirgin ? 'בתולה' : 'גרושה/בעולה — לא בתולה';
  return {
    derivedKey: derived, isVirgin,
    outputHebrew: `גזירת ב13×ב7 → ${derived}: ${status} (הקול הכולל עמ׳ 44)`,
  };
}

export function computeWifeChastity(chart) {
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h4 = getH(4); const h7 = getH(7);
  const MARS_FIGURES = new Set(['2122','1121','2221']);
  const lines = [];
  if (MARS_FIGURES.has(h7?.key || '') && MARS_FIGURES.has(h4?.key || '')) {
    lines.push(`⚠ צורת מאדים (${h7?.hebrew || h7?.key}) בבית 7 + (${h4?.hebrew || h4?.key}) בבית 4 — ספק בצניעות האישה (PDF1 עמ׳ 44)`);
  }
  if (h4?.key === '2212') lines.push('לבן בבית 4 — ספק נוסף (PDF1 עמ׳ 44)');
  if (!lines.length) lines.push('לא נמצאו סימנים לפגמים בצניעות');
  return { outputHebrew: lines.join('\n') };
}

// ============================================================
// BATCH F: שאר הנושאים
// ============================================================
export function computeMarketPrices(chart) {
  const elCounts = { 'אש': 0, 'אוויר': 0, 'מים': 0, 'עפר': 0 };
  for (const h of chart) {
    const el = h.element || h.elementHebrew || '';
    if (elCounts[el] !== undefined) elCounts[el]++;
  }
  const hotDry = (elCounts['אש'] || 0) + (elCounts['אוויר'] || 0);
  const coldWet = (elCounts['מים'] || 0) + (elCounts['עפר'] || 0);
  const verdict = hotDry > coldWet
    ? `אש+אוויר (${hotDry}) > מים+עפר (${coldWet}) → מחירים גבוהים (יוקר)`
    : hotDry < coldWet
    ? `מים+עפר (${coldWet}) > אש+אוויר (${hotDry}) → מחירים נמוכים (זול)`
    : 'שיווי משקל — מחירים יציבים';
  return { hotDry, coldWet, isExpensive: hotDry > coldWet, verdict, outputHebrew: verdict };
}

export function computeWishFulfillment(chart) {
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h1 = getH(1); const h11 = getH(11); const h15 = getH(15);
  if (!h1 || !h11 || !h15) return null;
  const isPos = (h) => !!h && String(h.fortune || '').includes('מיטיב');
  const all = isPos(h1) && isPos(h11) && isPos(h15);
  const any = isPos(h1) || isPos(h11) || isPos(h15);
  let verdict = '';
  if (all)      verdict = 'בית 1+11+15 כולם מיטיב — יצליח להשיג מה שרוצה';
  else if (any) verdict = 'חלק מהבתים מיטיב — הצלחה חלקית או עם עיכוב';
  else          verdict = 'בית 1+11+15 שליליים — לא ישיג מה שרוצה בזמן זה';
  return { all, any, outputHebrew: verdict };
}

export function computeQuerentSorceryCheck(chart) {
  const h10 = chart.find((h) => Number(h.house) === 10);
  if (!h10) return null;
  const isSorcered = h10.key === '1222';
  return {
    isSorcered,
    outputHebrew: isSorcered
      ? '⚠ נשוא ראש בבית 10 — סימן לכישוף על השואל (הקול הכולל עמ׳ 56)'
      : `${h10.hebrew || h10.key} בבית 10 — לפי ספר זה, הסימן הספציפי (נשוא ראש) אינו בבית הכבוד; ראה אבחון הכולל לעיל`,
  };
}


const ELEMENT_ILLNESS_TYPE = {
  'אש':    'מרה צהובה — חום, כבד, מרה, בעיות עיכול (חולי אש)',
  'אוויר': 'דם — לחץ דם, עצבים, מחלות נשימה (חולי אוויר)',
  'מים':   'כיח / ריר — ריאות, כליות, בעיות נוזלים (חולי מים)',
  'עפר':   'מרה שחורה — עצבות, עייפות, מחלות כרוניות (חולי עפר)',
};
export function computeIllnessElementDiagnosis(chart) {
  const counts = { 'אש': 0, 'אוויר': 0, 'מים': 0, 'עפר': 0 };
  for (const h of chart) {
    const el = h.element || h.elementHebrew || '';
    if (counts[el] !== undefined) counts[el]++;
  }
  const h6 = chart.find((h) => Number(h.house) === 6);
  const h8 = chart.find((h) => Number(h.house) === 8);
  const h6El = h6?.element || h6?.elementHebrew || '';
  const h8El = h8?.element || h8?.elementHebrew || '';

  // בית 6 = מחלה, בית 8 = סכנה. בית 6 גובר.
  const primaryEl = h6El || Object.entries(counts).sort(([,a],[,b]) => b - a)[0][0];
  const illnessType = ELEMENT_ILLNESS_TYPE[primaryEl] || '';
  const dangerType  = h8El ? ELEMENT_ILLNESS_TYPE[h8El] : null;

  const lines = [`אלמנט בית 6 (מחלה): ${h6El || 'לא ידוע'} → ${illnessType}`];
  if (dangerType && h8El !== h6El) {
    lines.push(`אלמנט בית 8 (סכנה): ${h8El} → ${dangerType}`);
  }

  const specificSigns = [];
  const h6Key = h6?.key || '';
  const h1Key = chart.find((h) => Number(h.house) === 1)?.key || '';
  if (h6Key === '2112') specificSigns.push('חיבור בבית 6 — מחלת בטן (כבד, טחול, שיעול)');
  if (h6Key === '1111') specificSigns.push('דרך בבית 6 — חשד לרעל או אכילת מזיקה');
  if (h6Key === '1221') specificSigns.push('סוהר בבית 6 — מחלה קשה, קבר פתוח — זהירות');
  if (h6Key === '2212') specificSigns.push('לבן בבית 6 — המחלה לא תאריך ימים');
  if (specificSigns.length) lines.push(...specificSigns);

  return {
    primaryElement: primaryEl,
    illnessType,
    dangerType,
    elementCounts: counts,
    specificSigns,
    outputHebrew: lines.join('\n'),
  };
}
export function computeThiefLocationDetails(chart) {
  const figureHouses = {};
  for (const h of chart) {
    const key = h.key;
    if (!key) continue;
    if (!figureHouses[key]) figureHouses[key] = [];
    figureHouses[key].push({ house: Number(h.house), hebrew: h.hebrew || h.key });
  }

  const lines = [];
  const findings = [];

  for (const [key, entries] of Object.entries(figureHouses)) {
    if (entries.length < 2) continue;
    const houseNums = entries.map((e) => e.house);
    const figHebrew = entries[0].hebrew;

    const inMothers   = houseNums.some((n) => n >= 1 && n <= 4);
    const inHouse5    = houseNums.includes(5);
    const inHouse6    = houseNums.includes(6);
    const afterSeven  = houseNums.filter((n) => n >= 7 && n <= 12);

    let thiefType = '';
    if (inMothers)        thiefType = 'הגנב מאנשי הבית / המשרתים';
    else if (inHouse5)    thiefType = 'הגנב מהשכנים';
    else if (inHouse6)    thiefType = 'הגנב מהיכרים / אוהבים של הבעלים';
    else if (afterSeven.length >= 2) thiefType = `יש ${afterSeven.length} גנבים (צורה חוזרת אחרי בית 7)`;

    if (thiefType) {
      lines.push(`${figHebrew} חוזר בבתים ${houseNums.join(', ')} — ${thiefType}`);
      findings.push({ figureKey: key, figureHebrew: figHebrew, houses: houseNums, thiefType });
    }
  }

  const h8 = chart.find((h) => Number(h.house) === 8);
  const h6 = chart.find((h) => Number(h.house) === 6);
  if (h8) lines.push(`תיאור הגנב (בית 8 — ${h8.hebrew || h8.key}): ${h8.transit?.meaning || 'ראה פסיקת המעבר'}`);
  if (h6) lines.push(`תיאור החפץ הגנוב (בית 6 — ${h6.hebrew || h6.key}): ${h6.transit?.meaning || 'ראה פסיקת המעבר'}`);

  if (!lines.length) return null;
  return { findings, outputHebrew: lines.join('\n') };
}
export function computeEnemyInHousehold(chart) {
  const MALEFIC = new Set(['1212','2122','2221','2222','1221']);
  let openDots = 0;
  for (const h of chart) {
    if (!MALEFIC.has(h.key || '')) continue;
    for (const ch of String(h.key || '')) {
      if (ch === '1') openDots++;
    }
  }
  if (openDots === 0) return { hasEnemy: false, outputHebrew: 'לא נמצאו סימנים לאויב בסביבה הקרובה.' };

  const remainder = openDots % 5 || 5;
  const targetHouse = chart.find((h) => Number(h.house) === remainder);
  const targetFig = targetHouse?.key || '';
  const isMalefic = MALEFIC.has(targetFig);
  const isBenefic = ['1122','2211','2121','1222'].includes(targetFig);

  let verdict = '';
  if (isMalefic)       verdict = 'יש אויב בסביבה הקרובה';
  else if (isBenefic)  verdict = 'אין אויב — מדובר בחבר או אדם ניטרלי';
  else                 verdict = 'אדם מפוקפק בסביבה — לא אויב ברור אבל לא ידיד מוחלט';

  const repetitions = chart.filter((h) => h.key === targetFig).length;
  const enemyCount = repetitions > 1 ? ` (מספר האויבים: ${repetitions})` : '';

  return {
    hasEnemy: isMalefic,
    openDots,
    remainder,
    targetHouse: remainder,
    targetFigure: targetHouse?.hebrew || targetFig,
    verdict,
    outputHebrew: `גילוי אויב בסביבה (נוסחת הנקודות הפתוחות): נפל על בית ${remainder} — ${targetHouse?.hebrew || targetFig} — ${verdict}${enemyCount}`,
  };
}

const MARRIAGE_BY_DOMINANT_FIGURE = {
  '1111': 'דרך שולטת — לא יתאחד עד לאחר זמן; האיחוד יבוא בעיכוב',
  '1112': 'סף יוצא שולט — נישואין עם מכשולים ביציאה; יש עיכוב כבד',
  '1121': 'נלחם שולט — ישמח בה; נישואין עם שמחה',
  '1122': 'כבוד יוצא שולט — לא ינקה מנכד ורוגז; קושי בנישואין',
  '1211': 'בר הלחי שולט — זיווג ושמחה מצד הנשים; הצלחה בשותפות',
  '1212': 'ממון יוצא שולט — ייצא ממנה ולא יחזור; פרידה בסוף',
  '1221': 'סוהר שולט — נישואין ישנו את מצבו לטובה',
  '1222': 'נשוא ראש שולט — אין טוב לנישואין אלה; ריב ונכד',
  '2111': 'סף נכנס שולט — יתחתן אבל יגרש לאחר מכן',
  '2112': 'חיבור שולט — ישמח בה; נישואין טובים עם שמחה',
  '2121': 'ממון נכנס שולט — קבלה עם קושי אך אחרית טובה; נישואין עם סבל שמסתיים בטוב',
  '2122': 'אדום שולט — יפיק תועלת גדולה מהנישואין',
  '2211': 'כבוד נכנס שולט — נישואין עם אהבה ביניהם; קשר חזק',
  '2212': 'לבן שולט — אין טוב לו בנישואין אלה; לא מומלץ',
  '2221': 'שפל ראש שולט — יש תנועה חיובית; נישואין אפשריים עם הסתייגות',
  '2222': 'קהלה שולטת — קשיים ורב כיוון; ריב ונכד בנישואין',
};

export function computeMarriageFigureForecast(chart) {
  const counts = {};
  for (const h of chart) {
    const k = h.key || '';
    if (k) counts[k] = (counts[k] || 0) + 1;
  }
  const dominant = Object.entries(counts).sort(([,a],[,b]) => b - a)[0];
  if (!dominant) return null;

  const [domKey, domCount] = dominant;
  const meaning = MARRIAGE_BY_DOMINANT_FIGURE[domKey];
  if (!meaning) return null;

  const domHebrew = chart.find((h) => h.key === domKey)?.hebrew || domKey;
  return {
    dominantKey: domKey,
    dominantHebrew: domHebrew,
    count: domCount,
    meaning,
    outputHebrew: `פסיקת נישואין לפי צורה שולטת: "${domHebrew}" (${domCount}×) — ${meaning}`,
  };
}

const YEARLY_BY_DOMINANT_FIGURE = {
  '1111': 'דרך שולטת — שנת תנועה ונדידה, ללא ברכה יציבה. טוב לנוסעים ולמסחר בדרכים',
  '1112': 'סף יוצא שולט — שנת יציאות והוצאות; דברים יוצאים מהיד. זהירות מהפסדים',
  '1121': 'נלחם שולט — שנת סכסוכים ומחלוקות; עמל רב, אך מי שיחזיק מעמד יצלח',
  '1122': 'כבוד יוצא שולט — שנה עם כבוד ופרידות; יש כבוד אבל גם עזיבות ואובדן',
  '1211': 'בר הלחי שולט — שנה טובה לנישואין ושמחה; שותפויות ואחרית טובה',
  '1212': 'ממון יוצא שולט — שנת הפסד; כסף וחפצים יוצאים מהיד, זהירות מגנבות',
  '1221': 'סוהר שולט — שנה כבדה; עיכובים, חסימות ומכשולים בכל דרך',
  '1222': 'נשוא ראש שולט — שנת שלטון ומעמד; עסקים עם בעלי סמכות, ויכוחים גדולים',
  '2111': 'סף נכנס שולט — שנת כניסה ורכישה; דברים חדשים נכנסים לחיים, הזדמנויות',
  '2112': 'חיבור שולט — שנה שפופה; ריבוי עניינים ומועקה ללא הצלחה ברורה',
  '2121': 'ממון נכנס שולט — שנת שפע; כסף נכנס, עסקים מצליחים, ברכה בממון',
  '2122': 'אדום שולט — שנה עם מחלות ועימותים; זהירות בבריאות ובמריבות',
  '2211': 'כבוד נכנס שולט — שנה מצוינת, שנה עם הרבה טוב; כבוד, הצלחה ושפע',
  '2212': 'לבן שולט — שנת ניקיון ושלום; שנה יציבה ורגועה, ללא גדולות',
  '2221': 'שפל ראש שולט — שנת ירידה; קשיים, עיכובים, הפסדים ורוע מזל',
  '2222': 'קהלה שולטת — שנת ריבוי עניינים; הרבה אנשים ומחלוקות, קשה למצוא שקט',
};

export function computeYearlyFigureForecast(chart) {
  const counts = {};
  for (const h of chart) {
    const k = h.key || '';
    if (k) counts[k] = (counts[k] || 0) + 1;
  }
  const dominant = Object.entries(counts).sort(([,a],[,b]) => b - a)[0];
  if (!dominant) return null;

  const [domKey, domCount] = dominant;
  const meaning = YEARLY_BY_DOMINANT_FIGURE[domKey];
  if (!meaning) return null;

  const domHebrew = chart.find((h) => h.key === domKey)?.hebrew || domKey;
  return {
    dominantKey: domKey,
    dominantHebrew: domHebrew,
    count: domCount,
    meaning,
    outputHebrew: `תחזית שנתית לפי צורה שולטת: "${domHebrew}" (${domCount}×) — ${meaning}`,
  };
}
export function computeAlternativeNameExtraction(chart) {
  const houseNums = [1, 4, 12];
  const results = houseNums.map((n) => computeNameLetters(chart, n)).filter(Boolean);
  if (!results.length) return null;

  const keysSeen = {};
  const withRepeat = results.map((r) => {
    const k = r.figurePattern || '';
    keysSeen[k] = (keysSeen[k] || 0) + 1;
    return { ...r, repeatCount: keysSeen[k] };
  });

  const lines = withRepeat.map((r) =>
    `  בית ${r.houseNumber} — ${r.figureHebrew}: ${r.outputHebrew}${r.repeatCount > 1 ? ' (צורה חוזרת — אותיות כפולות)' : ''}`
  );

  return {
    houses: houseNums,
    results: withRepeat,
    outputHebrew: `שיטה 5 (בתים 1, 4, 12):\n${lines.join('\n')}`,
  };
}
const FIGURE_PHYSICAL_DESCRIPTION = {
  '1111': { height: 'בינוני', skin: 'חיוור / עור בהיר', hair: 'ישר ובינוני', eyes: 'עיניים אפורות / ירוקות', signs: 'מראה תנועתי, לא יושב בשקט', character: 'נוטה לנדידה, חברותי, חסר מנוחה' },
  '1112': { height: 'נמוך ורזה', skin: 'עור בהיר', hair: 'דק וקצר', eyes: 'עיניים קטנות', signs: 'גוף דק, תנועות מהירות', character: 'שקוע במחשבות, נוטה לצאת ולברוח' },
  '1121': { height: 'בינוני עם בטן בולטת', skin: 'עור כהה-בינוני', hair: 'סמיך ומסורבל', eyes: 'עיניים כהות', signs: 'שיער לסת, פנים חדות', character: 'עקשן, נוטה לסכסוכים, עמלן' },
  '1122': { height: 'גבוה ורזה', skin: 'עור בהיר עם גוון', hair: 'ישר ומאורך', eyes: 'עיניים בהירות', signs: 'מראה אצילי, הליכה זקופה', character: 'מכובד, נוטה לעזוב, אוהב כבוד' },
  '1211': { height: 'בינוני-נמוך', skin: 'עור נקי וצהבהב', hair: 'רך ומסודר', eyes: 'עיניים יפות', signs: 'לחיים נקיות ויפות, פנים נעימות', character: 'חברותי, אוהב נשים ושותפויות' },
  '1212': { height: 'קצר ועבה', skin: 'עור כהה', hair: 'מסובך ולא מסודר', eyes: 'עיניים קטנות וחדות', signs: 'ידיים עסוקות, מבט חשדן', character: 'גנבן, עצלן, נוטה לאובדן' },
  '1221': { height: 'גוף כבד ועצל', skin: 'עור כהה-שחרחר', hair: 'מסורבל', eyes: 'עיניים עמוקות', signs: 'תנועות עצלות, מסורבל', character: 'ממושקל, עצור, לא נוח לזוז' },
  '1222': { height: 'גבוה ורחב', skin: 'עור בינוני', hair: 'ראש גדול, שיער כהה', eyes: 'עיניים גדולות ושלטוניות', signs: 'ראש גדול, מראה סמכותי', character: 'שלטוני, בעל מעמד, אוהב שליטה' },
  '2111': { height: 'נמוך ורחב', skin: 'עור בינוני', hair: 'מסודר', eyes: 'עיניים רחבות', signs: 'גוף רחב ויציב', character: 'נוטה לכניסה ולהיאחז, אוהב לקבל' },
  '2112': { height: 'עבה ורחב', skin: 'עור חיוור-צהבהב', hair: 'מסולסל', eyes: 'עיניים עגולות', signs: 'פנים עגולות, גוף מלא', character: 'חיבורי, אוהב קשרים, ידען' },
  '2121': { height: 'בינוני', skin: 'עור בינוני', hair: 'ישר', eyes: 'עיניים ממוקדות ופקחות', signs: 'ידיים פתוחות, מראה של מקבל', character: 'ממוקד, עסקי, אוהב ממון' },
  '2122': { height: 'גוף כבד', skin: 'עור אדמדם-כהה', hair: 'צבוע בגוון חם', eyes: 'עיניים אדומות / חמות', signs: 'פנים אדמדמות, סימני מחלה', character: 'חולני, נוטה לעימותים, עצבני' },
  '2211': { height: 'גוף יפה ומאוזן', skin: 'עור בהיר ונקי', hair: 'מסודר ומכובד', eyes: 'עיניים בהירות ונעימות', signs: 'מראה של עושר וכבוד', character: 'מכובד, אוהב כבוד, נדיב' },
  '2212': { height: 'גוף רזה ונמוך', skin: 'עור לבן מאוד', hair: 'שיער בהיר', eyes: 'עיניים בהירות', signs: 'מראה שקט ורגוע', character: 'שקט, נסוג, לא נוהר לקדמה' },
  '2221': { height: 'גוף שפוף', skin: 'עור כהה', hair: 'שיער מדולדל', eyes: 'מבט מושפל', signs: 'ראש שפוף, כתפיים נמוכות', character: 'עצוב, מושפל, נוטה לירידה' },
  '2222': { height: 'גוף גדול ומסיבי', skin: 'עור כהה', hair: 'עבות ומסורבל', eyes: 'עיניים גדולות', signs: 'מסה גדולה, קשה לפספוס', character: 'נמשך לקבוצות, בלגנאי, רבגוני' },
};

export function computePhysicalDescriptionForHouse(chart, houseNumber) {
  const house = chart.find((h) => Number(h.house) === Number(houseNumber));
  if (!house?.key) return null;
  const desc = FIGURE_PHYSICAL_DESCRIPTION[house.key];
  if (!desc) return null;
  const figHebrew = house.hebrew || house.key;
  const bodyDesc = desc.height.startsWith('גוף') ? desc.height : `מבנה גוף ${desc.height}`;
  const hairDesc = desc.hair.startsWith('שיער') ? desc.hair : `שיער ${desc.hair}`;
  return {
    houseNumber,
    figureKey: house.key,
    figureHebrew: figHebrew,
    ...desc,
    outputHebrew: `${figHebrew}: ${bodyDesc}, ${desc.skin}, ${hairDesc}, ${desc.eyes}. ${desc.signs}. אופי: ${desc.character}.`,
  };
}
export function computePrisonerAnalysis(chart) {
  const h1  = chart.find((h) => Number(h.house) === 1);
  const h4  = chart.find((h) => Number(h.house) === 4);
  const h5  = chart.find((h) => Number(h.house) === 5);
  const h12 = chart.find((h) => Number(h.house) === 12);
  const h15 = chart.find((h) => Number(h.house) === 15);

  if (!h1 || !h12) return null;

  const lines = [];

  const samePattern = h1.key && h1.key === h12.key;
  if (samePattern) {
    lines.push(`בית 1 = בית 12 (${h1.hebrew || h1.key}) — האסיר עדיין קשור לכלא`);
  }

  if (h5?.key === '1222') {
    lines.push('נשוא ראש בבית 5 — האסיר ייצא ויקבל פיצוי (חאוי)');
  }

  if (h15?.key === '1221') {
    lines.push('⚠ סוהר בבית 15 (הדיין) — סימן לאסיר שמאסרו יתמשך');
  }

  if (h4) {
    const h4Fortune = h4.fortune || '';
    lines.push(`בית 4 (מצב הכלא): ${h4.hebrew || h4.key} [${h4Fortune || 'לא ידוע'}]`);
  }
  if (h5) {
    const h5Fortune = h5.fortune || '';
    lines.push(`בית 5 (גורל האסיר): ${h5.hebrew || h5.key} [${h5Fortune || 'לא ידוע'}]`);
  }

  const judgeForAcquit = h15?.fortune?.includes('מיטיב');
  const judgeForDetain = h15?.fortune?.includes('מזיק');
  let exitVerdict = '';
  if (judgeForAcquit) exitVerdict = 'הדיין מיטיב — יש סיכוי ליציאה';
  else if (judgeForDetain) exitVerdict = 'הדיין מזיק — המאסר ממשיך';
  if (exitVerdict) lines.push(exitVerdict);

  return {
    samePattern,
    lines,
    outputHebrew: lines.join('\n'),
  };
}
export function computeSeaVoyageRisks(chart) {
  const h1  = chart.find((h) => Number(h.house) === 1);
  const h8  = chart.find((h) => Number(h.house) === 8);
  const h9  = chart.find((h) => Number(h.house) === 9);
  const h12 = chart.find((h) => Number(h.house) === 12);

  const lines = [];

  if (h8?.key === '1222') {
    lines.push('נשוא ראש בבית 8 — מציל מסכנה בים (מגן על הנוסע)');
  }

  const hasHamra = [h1,h8,h9,h12].some((h) => h?.key === '2122');
  const hasRais   = [h1,h8,h9,h12].some((h) => h?.key === '1222');
  if (hasHamra && hasRais) {
    lines.push('⚠ אדום ונשוא ראש ביחד — סכנת טביעה בים; לשקול דחיית המסע');
  }

  if (h9?.key === '1221') {
    lines.push('⚠ סוהר בבית 9 (המסע) — המסע ייתקע או יעוכב');
  }

  if (h9?.key === '1212') {
    lines.push('ממון יוצא בבית 9 — הפסד כספי בדרך הים');
  }

  if (h9?.key === '1111') {
    lines.push('דרך בבית 9 — מסע ים טוב ומבורך');
  }

  if (h12) {
    const isMalefic = ['1212','2122','2221','2222','1221'].includes(h12.key || '');
    if (isMalefic) {
      lines.push(`⚠ ${h12.hebrew || h12.key} בבית 12 — סכנה נסתרת בים, להיזהר`);
    }
  }

  if (!lines.length) return null;
  return {
    lines,
    outputHebrew: `ניתוח מסע ים (בלוג' אלאמל עמ' 26):\n${lines.map((l) => `  ${l}`).join('\n')}`,
  };
}

// "מה בלב השואל" — חזרת הצורה הראשונה N פעמים בלוח. הוצא בשלמותו
// מ-hawi-interpreter.js/goral-conclusion-writer.js: הקוד שהפעיל אותו תייג
// אותו במפורש כ- "بلوغ الامل" פ' 17 (Balugh al-Amal), לא חאווי, אך הוצג
// בעבר עבור כל נושא חאווי ללא כל אבחנה ליוצא-דופן. שני ערכים (2212=לבן,
// 1121=נלחם) נשאו ציטוט נפרד ל"הקול הכולל" (ص29, ص47) — מקור שלישי,
// שונה גם מבלוג' אלאמל. 14 הערכים הנותרים לא אומתו בנפרד מול המקור
// המדויק בבדיקה הזו — סטטוס: not-yet-found-in-current-code-search.
export const FIRST_FIGURE_REPETITIONS_OTHER = {
  // [1x, 2x, 3x, 4x]
  '1111': [
    'שואל על נסיעה בשותפות עם אחרים — נסיעה מבורכת',
    'ניוד — העברת דבר ממקום למקום',
    'החפצים מושגים, תנועות מוצלחות',
    'כמו שלוש — תנועה וקיום הצרכים',
  ],
  '2222': [
    'שואל על אישה שיש ריב ביניהם ורוצה להתפייס',
    'כנ"ל — עם תמיכה לאחד מהצדדים',
    'שואל על נסיעה עם קבוצה — לא כדאי לנסוע',
    'שואל על שיירה גדולה עם פחד — אין לזוז בכלל',
  ],
  '2211': [
    'שואל על חולה שמצבו קשה אך יחלים בסוף',
    'שואל על נעדר שמת לפי הסימנים',
    'שואל על אסיר שמאסרו יתמשך',
    'שואל על חולה שימות מן המחלה',
  ],
  '1122': [
    'שואל על נסיעה — מסע מבורך עם עתיד טוב',
    'שואל על ניוד דבר ממקום למקום',
    'החוסר יושלם',
    'יגיע דבר מרחוק',
  ],
  '1222': [
    'שואל על אדם חשוב — חכם, עשיר, שופט, בעל מעמד',
    'שואל על שניים — עניין כפול',
    'שואל על נושא כבד ומסובך',
    'שואל על בית משפט / עניין שלטוני',
  ],
  '2122': [
    'שואל על רופא או חולה במחלה קשה עם ירידת כבוד',
    'כנ"ל — עם כפל משמעות',
    'שואל על מחלה קשה ומתמשכת',
    'שואל על אדם שחולה בקשיים כפולים',
  ],
  '2221': [
    'שואל על אדם בעל יחס של עבדות, עיוורים, נכים — או הארב מהמסתר',
    'שואל על שניים בעלי מגבלה',
    'שואל על ריבוי קשיים',
    'שואל על ריבוי מזיקים',
  ],
  '2112': [
    'שואל על חכמה, ידע, דיבור, כתיבה',
    'שואל על ידע שמתרבה',
    'שואל על חיבור חיובי',
    'שואל על חיבור חזק מאוד',
  ],
  '2121': [
    'שואל על קבלת כסף או נכס',
    'שואל על הכנסה כפולה',
    'שואל על הכנסות מרובות',
    'שואל על עושר גדול שמגיע',
  ],
  '1221': [
    'שואל על עניין עצור, מדינה נצורה, פרנסה חסומה',
    'שואל על נשים מתאספות ובוכות, פחד חזק',
    'שואל על מוות או ארון קבורה',
    'שואל על פחד חזק ונשים יחד בוכות',
  ],
  '1212': [
    'שואל על תקלה, גנבה, דבר אבוד',
    'שואל על גנבה כפולה',
    'שואל על גנבה ואובדן מרובה',
    'שואל על אובדן גדול',
  ],
  '1211': [
    'שואל על נישואין, שמחה מצד נשים, שותפות',
    'שואל על שני קשרים',
    'שואל על קשרים מרובים',
    'שואל על עסקת קשר גדולה',
  ],
  '2111': [
    'שואל על כוח בקשרים, רווח, תנועה קדימה',
    'שואל על תנועה כפולה',
    'שואל על נסיעה מרובה',
    'שואל על תנועה גדולה',
  ],
  '1112': [
    'שואל על יציאה — דבר שיוצא מידיו',
    'יציאה כפולה — שתי פעולות יוצאות',
    'ריבוי יציאות',
    'תנועה גדולה החוצה',
  ],
  // البياض — לבן. מקור: הקול הכולל ص29
  '2212': [
    'שואל על ממון וחפצים לבנים — חלב, צמחים, כל דבר לבן',
    'ממון שיוצא ועשוי לחזור — עניין כספי מורכב',
    'ממון יוצא מהיד — דברים לבנים שנלקחו',
    'הפסד ממוני — בדוק אם הלבן ביד ימין (הפסד) או שמאל (הפסד וחזרה)',
  ],
  // النصرة خارجة / نلحم — נלחם. מקור: הקול הכולל ص47
  '1121': [
    'שואל על צרה, עצב וצוקה — ייתכן עניין משפטי או קשה',
    'שואל על מחנות, קרב או מחלוקת חמורה',
    'שואל על כלא, חושך, מצור — מקום אפל',
    'שואל על ריבוי צרות וחושך — מצב קשה מכל כיוון',
  ],
};

// ── 20. computeJumlaAnalysisOther — שיטת הג׳ומלה (סכום נקודות) ──────────────
// מקור: بلوغ الامل في علم الرمل (Balugh al-Amal), עמ' 62-63.
// תועד במפורש כ"בלוג' אל-אמל" ב-hawi-topic-index.js (topicId:
// 'spiritual-diagnostics-expanded') וב-raml-jumla-method.js (sourceBook),
// אך הפונקציה עצמה (computeJumlaAnalysis) ישבה בפועל בתוך hawi-interpreter.js
// והוצגה לנושאי illness/spiritualDiagnostics/childrenPregnancy/partnership
// כחלק מקריאת חאווי, ללא כל אבחנה שמדובר בספר אחר. הוצאה בשלמותה (לא נמחקה).
// ג׳ומלה = סכום כל הנקודות בלוח (נקודה יחידה='1'→1, זוג='2'→2) על פני 16
// הבתים × 4 שורות; מחלקים ב-N ולוקחים את השארית (שארית 0 = הערך המחלק עצמו).
const JUMLA_ILLNESS_MAP = {
  1: { hebrewLabel: 'חום / קדחת',           isSorcery: false }, // فمرضه من الحمى
  2: { hebrewLabel: 'רוחות / ריאות / קור', isSorcery: false }, // فمرضه من الرياح
  3: { hebrewLabel: 'כישוף (סיהר)',         isSorcery: true  }, // فمرضه من السحر
  4: { hebrewLabel: 'רוחות וחום',          isSorcery: false }, // فمرضه من الرياح والحمى
};
const JUMLA_CHILDREN_MAP = {
  1: 'ייוולד זכר (בן)',                        // يولد له غلام
  2: 'תיוולד נקבה (בת)',                       // يولد له جارية
  3: 'הפלה / לא ייוולד ילד בעת הזו',           // تسقط الولد
};
const JUMLA_FRIENDSHIP_MAP = {
  1: 'שונא אותו',                              // فإنه يبغضه
  2: 'אוהב אותו',                              // فإنه يحبه
  3: 'אוהב אותו לכאורה בלבד',                  // فإنه يحبه ظاهراً
  4: 'אין בו טוב',                             // فليس فيه خير
};

export function computeJumlaAnalysisOther(chart, topicId) {
  if (!Array.isArray(chart)) return null;

  let jumla = 0;
  for (const house of chart) {
    for (const ch of String(house.key || '')) {
      if (ch === '1') jumla += 1;
      else if (ch === '2') jumla += 2;
    }
  }

  const mod4 = (jumla % 4) || 4;
  const mod3 = (jumla % 3) || 3;
  const mod4ForFriendship = mod4;

  const result = { jumla, mod4, mod3 };

  if (topicId === 'spiritualDiagnostics' || topicId === 'illness') {
    const entry = JUMLA_ILLNESS_MAP[mod4];
    result.illnessDiagnosis = {
      remainder: mod4,
      hebrewLabel: entry.hebrewLabel,
      isSorcery: entry.isSorcery,
      outputHebrew: `ג׳ומלה לאבחון מחלה (${jumla} ÷ 4, שארית ${mod4}): ${entry.hebrewLabel} (בלוג' אל-אמל עמ' 62-63)`,
    };
  }

  if (topicId === 'childrenPregnancy') {
    const outcome = JUMLA_CHILDREN_MAP[mod3];
    result.childDiagnosis = {
      remainder: mod3,
      outcome,
      outputHebrew: `ג׳ומלה לשאלת ילדים (${jumla} ÷ 3, שארית ${mod3}): ${outcome} (בלוג' אל-אמל עמ' 62-63)`,
    };
  }

  if (topicId === 'partnership' || topicId === 'friendship') {
    const outcome = JUMLA_FRIENDSHIP_MAP[mod4ForFriendship];
    result.friendshipDiagnosis = {
      remainder: mod4ForFriendship,
      outcome,
      outputHebrew: `ג׳ומלה לשאלת ידידות/שותפות (${jumla} ÷ 4, שארית ${mod4ForFriendship}): ${outcome} (בלוג' אל-אמל עמ' 62-63)`,
    };
  }

  return result;
}

export function computeFirstFigureRepetitionOther(chart) {
  const h1Figure = chart.find((h) => Number(h.house) === 1);
  if (!h1Figure) return null;

  const firstKey = h1Figure.key || '';
  const firstHebrew = h1Figure.hebrew || h1Figure.key;

  const allOccurrences = chart.filter((h) => h.key === firstKey);
  const count = allOccurrences.length;

  const meanings = FIRST_FIGURE_REPETITIONS_OTHER[firstKey];
  const countIndex = Math.min(count - 1, 3);
  const meaning = meanings ? meanings[countIndex] : null;

  if (!meaning) return null;

  return {
    figureKey: firstKey,
    figureHebrew: firstHebrew,
    count,
    meaning,
    outputHebrew: `צורה ראשונה בלוח: "${firstHebrew}" (חוזרת ${count}×) — ${meaning} (בלוג' אלאמל פ' 17).`,
  };
}
