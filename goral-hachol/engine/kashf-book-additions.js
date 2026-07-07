/**
 * kashf-book-additions.js
 *
 * פונקציות חדשות שנכתבו ישירות מתוך אימות מול kashf-al-asrar.html (עמ' 174,
 * 272-274), בעקבות בדיקת 135 שאלות מועמדות שהוצעו ע"י צ'אט חיצוני. כל פונקציה
 * כאן מצטטת טקסט-ליבה של הספר עצמו — לא תוספות מאוחרות המיוחסות לחיבור אחר.
 *
 * הוחרג במפורש: "מן התוספת שאינה מגוף הספר" (עמ' 273, פדיון שבוי/אסיר לפי
 * בית 1+13 ו-16+12) ו"מתוספת נֻזְהַת אל־עֻקוּל" (עמ' 274, בית 1+5 וטבלת
 * צורות-גורל) — שני אלה מיוחסים בספר עצמו למקור/חיבור שאינו המחבר הראשי,
 * באותו אופן שבו הוחרג חומר אלזנאתי משער 4 (ראה kashf-dhamir.js).
 *
 * פורמט קלט: אותו chart array כמו kashf-pending-extraction.js
 * ({house, key, hebrew, fortune, direction, movement}).
 */

import { MALEFIC_FIGURE_PATTERNS } from './hawi-interpreter.js';
import {
  computeHiddenDepthByOpposites,
  computeRequesterCircleHouse,
} from '../data/sources/kashf-al-asrar/kashf-shibutzim.js';
import { FIGURE_WHEEL_POSITION } from '../data/sources/kashf-al-asrar/kashf-figure-classification-gate2.js';
import {
  DEREKH_HOUSE_RULES,
  FIGURE_DESIRE_FULFILLMENT_NOTES,
} from '../data/sources/kashf-al-asrar/kashf-gate5-foundational-figures.js';
import { getDakhalKharij } from './kashf-figure-classifier.js';
import { FIGURE_PLANET_MAP } from '../data/sources/kashf-al-asrar/kashf-hazz.js';
import { FRIEND_TYPE_BY_PLANET } from '../data/sources/kashf-al-asrar/kashf-topic-house11-friends-hope.js';

const PATTERN_TO_PLANET_LOCAL = Object.fromEntries(
  FIGURE_PLANET_MAP.flatMap((entry) => entry.patterns.map((p) => [p, entry.planet]))
);

// כשף אל-אסרר עמ' 272-273 — "כלל מעשי: אדם החושש מעונש"
// "באדם החושש מעונש — ממאסר, ממלקות או מדבר אחר — אם בבית העשירי נמצאת
//  כבוד נכנס, ובחמישי סף נכנס, ובראשון נשוא ראש, ... צריך שיהיה בבית
//  הרביעי סימן מיטיב; ואז אין לחשוש עליו."
export function computeFearOfPunishment(chart) {
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h1 = getH(1), h4 = getH(4), h5 = getH(5), h10 = getH(10);
  if (!h1 || !h4 || !h5 || !h10) return null;

  const signsPresent = h10.key === '2211' && h5.key === '2111' && h1.key === '1222';
  const h4Fortune = String(h4.fortune || '');
  const h4Benefic = h4Fortune.includes('מיטיב') && !h4Fortune.startsWith('ממוזג-מזיק');

  let verdict, outputHebrew;
  if (signsPresent && h4Benefic) {
    verdict = 'no-fear';
    outputHebrew = 'סימני הביטחון מופיעים (כבוד נכנס בעשירי, סף נכנס בחמישי, נשוא ראש בראשון), ובית 4 מיטיב — אין לחשוש מן העונש.';
  } else if (signsPresent && !h4Benefic) {
    verdict = 'uncertain';
    outputHebrew = 'סימני הביטחון (כבוד נכנס/סף נכנס/נשוא ראש) מופיעים, אך בית 4 אינו מיטיב — עדיין יש מקום לחשש מן העונש.';
  } else {
    verdict = 'no-clear-signal';
    outputHebrew = 'לא נמצאו במלואם סימני הביטחון המיוחדים לחשש מעונש (כבוד נכנס/סף נכנס/נשוא ראש) — אין הכרעה מיוחדת מכלל זה.';
  }
  return { verdict, outputHebrew };
}

// כשף אל-אסרר עמ' 274 — "האסיר — אורך המאסר, סכנה ושחרור" (המשפט הראשון,
// לפני "ויש שאמרו" המפריד לתוספת אחרת)
// "אם הבית השישה־עשר והבית השנים־עשר שניהם מזיקים ויוצאים — ישלים האסיר
//  זמן רב במאסרו. ואם שניהם מזיקים ונכנסים, והצורות המזיקות מעידות להן,
//  ורבתה צורת אדום במערך גורל החול — הדבר עלול להגיע לשפיכות דמים.
//  ואם שניהם מזיקים ונכנסים, הוא חולה ומת."
export function computePrisonerDurationDanger(chart) {
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h12 = getH(12), h16 = getH(16);
  if (!h12 || !h16) return null;

  const isMalefic = (h) => String(h?.fortune || '').includes('מזיק');
  const bothMalefic = isMalefic(h12) && isMalefic(h16);
  const bothOutgoing = h12.direction === 'outgoing' && h16.direction === 'outgoing';
  const bothIncoming = h12.direction === 'incoming' && h16.direction === 'incoming';
  // "ורבתה צורת אדום במערך" — ספירת הופעות אדום (2122) בכל 16 הבתים
  const humraCount = chart.filter((h) => h.key === '2122').length;

  let verdict, outputHebrew;
  if (bothMalefic && bothOutgoing) {
    verdict = 'long-imprisonment';
    outputHebrew = 'בית 12 ובית 16 שניהם מזיקים ויוצאים — האסיר ישלים זמן רב במאסרו.';
  } else if (bothMalefic && bothIncoming && humraCount >= 2) {
    verdict = 'danger-bloodshed';
    outputHebrew = `בית 12 ובית 16 שניהם מזיקים ונכנסים, וצורת אדום מרובה בלוח (${humraCount} מופעים) — הדבר עלול להגיע לשפיכות דמים.`;
  } else if (bothMalefic && bothIncoming) {
    verdict = 'illness-death';
    outputHebrew = 'בית 12 ובית 16 שניהם מזיקים ונכנסים — הוא חולה ומת.';
  } else {
    verdict = 'mixed';
    outputHebrew = 'אין התאמה לתנאי הקיצון (בית 12 ובית 16 שניהם מזיקים ויוצאים/נכנסים) — מצב המאסר מעורב, לא חמור באופן קיצוני.';
  }
  return { verdict, outputHebrew };
}

// כשף אל-אסרר עמ' 177 — "האם טוב לאדם להישאר בעיר זו או לעבור ממנה?"
// "השלם את ההכאה. אם יצאה בראשון צורה מיטיבה ובשני צורה מזיקה, המקום
//  שבו הוא נמצא טוב לו. ואם יצא להפך — הדין להפך."
export function computeStayOrMove(chart) {
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h1 = getH(1), h2 = getH(2);
  if (!h1 || !h2) return null;

  const isBenefic = (h) => {
    const f = String(h?.fortune || '');
    return f.includes('מיטיב') && !f.startsWith('ממוזג-מזיק');
  };
  const isMalefic = (h) => String(h?.fortune || '').includes('מזיק');

  let verdict, outputHebrew;
  if (isBenefic(h1) && isMalefic(h2)) {
    verdict = 'stay';
    outputHebrew = `בית 1 (${h1.hebrew || h1.key}) מיטיב ובית 2 (${h2.hebrew || h2.key}) מזיק — המקום שבו הוא נמצא טוב לו; עדיף להישאר.`;
  } else if (isMalefic(h1) && isBenefic(h2)) {
    verdict = 'move';
    outputHebrew = `בית 1 (${h1.hebrew || h1.key}) מזיק ובית 2 (${h2.hebrew || h2.key}) מיטיב — הדין הפוך; עדיף לעבור ממקום זה.`;
  } else {
    verdict = 'no-clear-signal';
    outputHebrew = 'הכלל דורש בית 1 ובית 2 בקטבים הפוכים (אחד מיטיב, השני מזיק) — כאן שניהם דומים באופיים, ואין הכרעה מיוחדת מכלל זה.';
  }
  return { verdict, outputHebrew };
}

// כשף אל-אסרר עמ' 204-205 — "בצניעות האישה"
// "השלם את גורל החול על שמה. אם הצורה הראשונה טהורה — היא צנועה. אם היא
//  תואמת את המאזן — היא צנועה לגמרי. וכן אם הצורה שבבית הראשון והבית
//  השביעי טהורות — הרי היא צנועה. אם צורות הבית השביעי והתשיעי מיטיבות —
//  היא יראת שמים וצנועה. ואם צורה מזיקה במאזן — היא פרוצה. אם הבית
//  הראשון מיטיב וטהור, והבית התשיעי מזיק — יש חשש לפריצות. ואם הבית
//  הראשון מזיק, אך התשיעי והמאזן טהורים — רוחה טהורה ואין חשש."
// הערה: "טהורה/טמאה" בספר זהה למונח "מיטיבה/מזיקה" (סעד/נחס) — ראה
// תיעוד השער השני בתוכנית ההפרדה.
export function computeWomanModesty(chart) {
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h1 = getH(1), h7 = getH(7), h9 = getH(9), h15 = getH(15);
  if (!h1 || !h7 || !h9 || !h15) return null;

  const isBenefic = (h) => {
    const f = String(h?.fortune || '');
    return f.includes('מיטיב') && !f.startsWith('ממוזג-מזיק');
  };
  const isMalefic = (h) => String(h?.fortune || '').includes('מזיק');

  const lines = [];
  if (isBenefic(h1)) lines.push('בית 1 מיטיב וטהור — סימן לצניעות.');
  if (h1.key === h15.key) lines.push('בית 1 תואם את המאזן (בית 15) — צנועה לגמרי.');
  if (isBenefic(h1) && isBenefic(h7)) lines.push('בית 1 ובית 7 שניהם מיטיבים — סימן לצניעות.');
  if (isBenefic(h7) && isBenefic(h9)) lines.push('בית 7 ובית 9 שניהם מיטיבים — יראת שמים וצניעות.');
  if (isMalefic(h15)) lines.push('⚠ המאזן (בית 15) מזיק — חשש שהיא פרוצה.');
  if (isBenefic(h1) && isMalefic(h9)) lines.push('⚠ בית 1 מיטיב וטהור, אך בית 9 מזיק — יש חשש לפריצות.');
  if (isMalefic(h1) && isBenefic(h9) && isBenefic(h15)) lines.push('בית 1 מזיק, אך בית 9 והמאזן טהורים — רוחה טהורה ואין חשש.');

  if (!lines.length) {
    return { verdict: 'mixed', outputHebrew: 'הסימנים מעורבים — אין הכרעה חד-משמעית על צניעותה מכלל זה.' };
  }
  const hasWarning = lines.some((l) => l.startsWith('⚠'));
  const verdict = hasWarning ? 'concern' : 'modest';
  return { verdict, outputHebrew: lines.join('\n') };
}

// כשף אל-אסרר עמ' 195 — "עיתוי טוב לשמחה/טיול/שעשוע"
// "ובבחירת זמני שמחה, טיול ושעשוע, טוב שיהיה כבוד נכנס בחמישי ובראשון,
//  או בתשיעי; ובראשון ובחמישי הוא טוב ומועיל יותר, והאל יודע את הנכון."
export function computeJoyTimingKashf(chart) {
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h1 = getH(1), h5 = getH(5), h9 = getH(9);
  if (!h1 || !h5 || !h9) return null;

  const isNusraDakhila = (h) => h.key === '2211';
  let verdict, outputHebrew;
  if (isNusraDakhila(h5) && isNusraDakhila(h1)) {
    verdict = 'best-timing';
    outputHebrew = 'כבוד נכנס נמצא בבית 1 ובבית 5 — העת טובה ומועילה ביותר לשמחה, טיול ושעשוע.';
  } else if (isNusraDakhila(h5) && isNusraDakhila(h9)) {
    verdict = 'good-timing';
    outputHebrew = 'כבוד נכנס נמצא בבית 5 ובבית 9 — העת טובה לשמחה, טיול ושעשוע.';
  } else {
    verdict = 'no-clear-signal';
    outputHebrew = 'לא נמצא כבוד נכנס בשילוב הבתים המיוחד לכך (1+5 או 5+9) — אין הכרעה מיוחדת מכלל זה על עיתוי השמחה.';
  }
  return { verdict, outputHebrew };
}

// כשף אל-אסרר עמ' 165 — "פרק כולל לסימנים רבים"
// "ואם תרצה לדעת עניין עבד, קח מן השישי והשישה־עשר צורה."
export function computeServantMatterKashf(chart) {
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h6 = getH(6), h16 = getH(16);
  if (!h6?.key || !h16?.key) return null;

  const combined = h6.key.split('').map((c, i) => (c === h16.key[i] ? '2' : '1')).join('');
  const isMalefic = MALEFIC_FIGURE_PATTERNS.has(combined);
  const verdict = isMalefic ? 'unfavorable' : 'favorable';
  const outputHebrew = isMalefic
    ? `הצורה העולה מחיבור בית 6 ובית 16 (${combined}) מזיקה — מצב עניין העבד/המשרת אינו טוב.`
    : `הצורה העולה מחיבור בית 6 ובית 16 (${combined}) מיטיבה — מצב עניין העבד/המשרת טוב.`;
  return { verdict, outputHebrew };
}

// כשף אל-אסרר עמ' 105 — "תמונת שיבוץ המספר ומשך-הזמן: המספר המצטבר לכל צורה"
// (מאומת ישירות מול הטבלה בעמ' 104-106, 109, 114: נלחם=1, נשוא ראש=3,
// סף נכנס=6, לבן=10, בר הלחי=15, סף יוצא=21, אדום=28, שפל ראש=36,
// ממון נכנס=45, סוהר=55, חיבור=66, דרך=78, כבוד נכנס=91, ממון יוצא=105,
// קהלה=120, כבוד יוצא=136 — טור זה שונה ונפרד מ"מספרי התכונה" האישיים
// שכל צורה מקבלת בפרק שלה בשער השני, ואין לערבב ביניהם).
const FIGURE_DURATION_NUMBERS = {
  '1121': 1,   // נלחם
  '1222': 3,   // נשוא ראש
  '2111': 6,   // סף נכנס
  '2212': 10,  // לבן
  '1211': 15,  // בר הלחי
  '1112': 21,  // סף יוצא
  '2122': 28,  // אדום
  '2221': 36,  // שפל ראש
  '2121': 45,  // ממון נכנס
  '1221': 55,  // סוהר
  '2112': 66,  // חיבור
  '1111': 78,  // דרך
  '2211': 91,  // כבוד נכנס
  '1212': 105, // ממון יוצא
  '2222': 120, // קהלה
  '1122': 136, // כבוד יוצא
};

const PILLAR_HOUSES_SET = new Set([1, 4, 7, 10]);
const SUCCEDENT_HOUSES_SET = new Set([2, 5, 8, 11]);
const CADENT_HOUSES_SET = new Set([3, 6, 9, 12]);

function totalBoardPoints(chart) {
  let total = 0;
  for (const h of chart) {
    const key = h.key || '';
    for (const c of key) total += c === '1' ? 1 : 2;
  }
  return total;
}

// שלב משותף לשתי הנוסחאות (עמ' 177, 182): סוכמים את כל נקודות הלוח,
// מפחיתים ב-16 (שארית 0 → 16), וההולכה היא ישירה מבית 1 עד מספר השארית
// (אותה קונבנציית "הליכה מבית 1 קדימה" המשמשת כבר ב-computeDhamirJawharayn
// ובחישוב מקור הכסף הקיים — לא מוגדרת כאן במפורש בטקסט המצוטט עצמו).
function walkToDurationHouse(chart) {
  const total = totalBoardPoints(chart);
  let remainder = total % 16;
  if (remainder === 0) remainder = 16;
  const landing = chart.find((h) => Number(h.house) === remainder);
  if (!landing?.key) return null;

  let houseType;
  if (PILLAR_HOUSES_SET.has(remainder)) houseType = 'pillar';
  else if (SUCCEDENT_HOUSES_SET.has(remainder)) houseType = 'succedent';
  else if (CADENT_HOUSES_SET.has(remainder)) houseType = 'cadent';
  else houseType = null; // בתים 13-16 — לא מכוסים בטקסט המצוטט

  const durationNumber = FIGURE_DURATION_NUMBERS[landing.key];
  return { total, remainder, landingHouse: remainder, landing, houseType, durationNumber };
}

// כשף אל-אסרר עמ' 177 — "כיצד אדע את שנותיי?"
// "הסר את הגורל, ואסוף את כל היסודות... הפחת אותם בשש-עשרה, ומה שנותר
//  הולך על פני הבתים. במקום שבו יסתיים החשבון, התבונן בצורה שעליה עמד:
//  איזו צורה היא, ומה מספרה באותו בית. לדוגמה: אם לאחר ההפחתה נותר מן
//  היתדות... מספרה הוא מספר השנים. אם היא מן הנטויים, מספרה הוא חודשים.
//  ואם היא מן הנופלים, מספרה הוא ימים."
export function computeLifeYearsKashf(chart) {
  const result = walkToDurationHouse(chart);
  if (!result || result.durationNumber == null) return null;
  const { landingHouse, landing, houseType, durationNumber } = result;
  const figureName = landing.hebrew || landing.key;

  if (!houseType) {
    return {
      verdict: 'out-of-scope',
      outputHebrew: `החשבון נחת בבית ${landingHouse} (${figureName}) — בית זה אינו מכוסה בכלל המצוטט (המתייחס רק ליתדות/נטויים/נופלים, בתים 1-12).`,
    };
  }
  const unitHebrew = { pillar: 'שנים', succedent: 'חודשים', cadent: 'ימים' }[houseType];
  return {
    verdict: 'life-years',
    outputHebrew: `החשבון נחת בבית ${landingHouse} (${figureName}) — ${durationNumber} ${unitHebrew} (כשף עמ׳ 177).`,
    landingHouse, figureName, durationNumber, unitHebrew,
  };
}

// כשף אל-אסרר עמ' 182 — "אשר למספר הממון — דון בו כדין מספר השנים:
//  הצורות המורות על שנים הן אלפים, החודשים מאות, והימים עשרות."
export function computeMoneyMagnitudeKashf(chart) {
  const result = walkToDurationHouse(chart);
  if (!result || result.durationNumber == null) return null;
  const { landingHouse, landing, houseType, durationNumber } = result;
  const figureName = landing.hebrew || landing.key;

  if (!houseType) {
    return {
      verdict: 'out-of-scope',
      outputHebrew: `החשבון נחת בבית ${landingHouse} (${figureName}) — בית זה אינו מכוסה בכלל המצוטט (המתייחס רק ליתדות/נטויים/נופלים, בתים 1-12).`,
    };
  }
  const scale = { pillar: 1000, succedent: 100, cadent: 10 }[houseType];
  const amount = durationNumber * scale;
  return {
    verdict: 'money-magnitude',
    outputHebrew: `החשבון נחת בבית ${landingHouse} (${figureName}) — לפי דין מספר השנים, סדר הגודל המוערך: כ-${amount} (כשף עמ׳ 182).`,
    landingHouse, figureName, durationNumber, amount,
  };
}

// כשף אל-אסרר עמ' 222 — "אם קונה שואל על סחורה, האם תתייקר או תוזל:
// אם מצאת שהבית החמישי חוזר בתשיעי, בעשירי או בשלושה־עשר, בשר לו
// ברווחים רבים. ואם הוא חוזר בשישי או בשמיני, יפסיד בלא ספק."
// "חוזר" = הצורה בבית החמישי זהה (אותו pattern) לצורה שבבית ההוא.
export function computeGoodsProfitLossKashf(chart) {
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h5 = getH(5);
  if (!h5?.key) return null;

  const profitHouses = [9, 10, 13].filter((n) => getH(n)?.key === h5.key);
  const lossHouses = [6, 8].filter((n) => getH(n)?.key === h5.key);
  const figureName = h5.hebrew || h5.key;

  if (profitHouses.length && lossHouses.length) {
    return {
      verdict: 'mixed',
      outputHebrew: `הצורה בבית 5 (${figureName}) חוזרת גם בבית${profitHouses.length > 1 ? 'ים' : ''} ${profitHouses.join(', ')} (רווח) וגם בבית${lossHouses.length > 1 ? 'ים' : ''} ${lossHouses.join(', ')} (הפסד) — הסימנים מעורבים (כשף עמ׳ 222).`,
      profitHouses, lossHouses,
    };
  }
  if (profitHouses.length) {
    return {
      verdict: 'profit',
      outputHebrew: `הצורה בבית 5 (${figureName}) חוזרת בבית${profitHouses.length > 1 ? 'ים' : ''} ${profitHouses.join(', ')} — הסחורה תתייקר, בשורת רווחים רבים (כשף עמ׳ 222).`,
      profitHouses, lossHouses,
    };
  }
  if (lossHouses.length) {
    return {
      verdict: 'loss',
      outputHebrew: `הצורה בבית 5 (${figureName}) חוזרת בבית${lossHouses.length > 1 ? 'ים' : ''} ${lossHouses.join(', ')} — הסחורה תוזל, הפסד בלא ספק (כשף עמ׳ 222).`,
      profitHouses, lossHouses,
    };
  }
  return {
    verdict: 'no-clear-signal',
    outputHebrew: `הצורה בבית 5 (${figureName}) אינה חוזרת בבתים 9, 10, 13, 6 או 8 — אין הכרעה מיוחדת מכלל זה (כשף עמ׳ 222).`,
    profitHouses, lossHouses,
  };
}

// כשף אל-אסרר עמ' 189 — "שיבוץ ההפכים": עומק דבר נסתר/מים לפי היסודות
// הפתוחים בצורה שהובילה אליה השאלה (ראה kashf-shibutzim.js לתיעוד מלא).
export function computeHiddenDepthKashf(chart) {
  const h1 = chart.find((h) => Number(h.house) === 1);
  if (!h1?.key) return null;
  const measures = computeHiddenDepthByOpposites(h1.key);
  const figureName = h1.hebrew || h1.key;
  if (!measures.length) {
    return {
      verdict: 'no-open-elements',
      outputHebrew: `הצורה בבית 1 (${figureName}) — לא נמצאו שורות-יסוד פתוחות; אין נתון עומק לפי שיבוץ ההפכים (כשף עמ׳ 189).`,
    };
  }
  return {
    verdict: 'depth-computed',
    outputHebrew: `הצורה בבית 1 (${figureName}) — עומק/מרחק הדבר הנסתר, לפי שיבוץ ההפכים: ${measures.join(' + ')} (כשף עמ׳ 189).`,
    measures,
  };
}

// כשף אל-אסרר עמ' 218-219 — "המבקש במעגל": כוח המבקש/הבקשה, לפי בית
// הכבוד של הצורה שבבית 1 (ראה kashf-shibutzim.js לתיעוד מלא ולהסתייגות
// שהטבלה מאומתת ל-3 צורות בלבד).
const PILLAR_HOUSES_FOR_CIRCLE = new Set([1, 4, 7, 10]);
const SUCCEDENT_HOUSES_FOR_CIRCLE = new Set([2, 5, 8, 11]);
const CADENT_HOUSES_FOR_CIRCLE = new Set([3, 6, 9, 12]);

export function computeRequesterCircleStrengthKashf(chart) {
  const h1 = chart.find((h) => Number(h.house) === 1);
  if (!h1?.key) return null;
  const figureName = h1.hebrew || h1.key;
  const result = computeRequesterCircleHouse(h1.key);
  if (!result) {
    return {
      verdict: 'undefined-in-source',
      outputHebrew: `הצורה בבית 1 (${figureName}) — בית הכבוד שלה בכלל "המבקש במעגל" אינו מאומת במקור שנקרא (רק 2 מתוך 16 הצורות מתועדות, כשף עמ׳ 218-219); לא מחושב.`,
    };
  }
  const { honorHouse, count, landingHouse } = result;
  let houseTypeHebrew;
  if (PILLAR_HOUSES_FOR_CIRCLE.has(landingHouse)) houseTypeHebrew = 'יתד';
  else if (SUCCEDENT_HOUSES_FOR_CIRCLE.has(landingHouse)) houseTypeHebrew = 'נוטה מן היתד';
  else if (CADENT_HOUSES_FOR_CIRCLE.has(landingHouse)) houseTypeHebrew = 'נופל מן היתד';
  else houseTypeHebrew = 'מאזן/יתרה';
  return {
    verdict: 'landing-computed',
    outputHebrew: `הצורה בבית 1 (${figureName}) — בית כבודה ${honorHouse}; ספירה מעגלית עד הבית הראשון: ${count}; נחיתה בבית ${landingHouse} (${houseTypeHebrew}). לפי הכלל: נחיתה ביתד או בבית טוב — המבקש חזק בבקשתו; נחיתה בבית מזיק — חלש (כשף עמ׳ 218-219).`,
    honorHouse, count, landingHouse, houseTypeHebrew,
  };
}

// כשף אל-אסרר עמ' 60-61 — "בלוח הגורל הנערך, האמהות נקראות עולות. אם
// נמצאה בהן צורה מצורות העולות בגלגל — הדין חזק" (וכן בהתאמה לבנות/
// שוקעות, נולדות/מתרוממות, מאזנים/יורדים). בודק אם צורות-בפועל בלוח
// (אמהות=1-4, בנות=5-8, נולדות=9-12, מאזנים=13-16) שייכות גם לקבוצת
// הגלגל התיאורטית המקבילה (FIGURE_WHEEL_POSITION).
const WHEEL_GROUPS = [
  { houses: [1, 2, 3, 4], wheelKey: 'rising', groupHebrew: 'אמהות', wheelHebrew: 'עולות' },
  { houses: [5, 6, 7, 8], wheelKey: 'setting', groupHebrew: 'בנות', wheelHebrew: 'שוקעות' },
  { houses: [9, 10, 11, 12], wheelKey: 'ascending', groupHebrew: 'נולדות', wheelHebrew: 'מתרוממות' },
  { houses: [13, 14, 15, 16], wheelKey: 'descending', groupHebrew: 'מאזנים', wheelHebrew: 'יורדות' },
];

export function computeWheelPositionStrengthKashf(chart) {
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const matchedGroups = [];
  let totalMatches = 0;

  for (const { houses, wheelKey, groupHebrew, wheelHebrew } of WHEEL_GROUPS) {
    const wheelSet = FIGURE_WHEEL_POSITION[wheelKey];
    const matchedHouses = houses.filter((n) => wheelSet.includes(getH(n)?.key));
    if (matchedHouses.length) {
      matchedGroups.push({ groupHebrew, wheelHebrew, matchedHouses });
      totalMatches += matchedHouses.length;
    }
  }

  if (!totalMatches) {
    return {
      verdict: 'no-wheel-match',
      outputHebrew: 'אף אחת מקבוצות הבתים (אמהות/בנות/נולדות/מאזנים) אינה מכילה צורה השייכת לקבוצת הגלגל התיאורטית המקבילה — אין חיזוק מיוחד מכלל זה (כשף עמ׳ 60-61).',
      totalMatches, matchedGroups,
    };
  }
  const details = matchedGroups
    .map((g) => `${g.groupHebrew} (${g.matchedHouses.length > 1 ? 'בתים' : 'בית'} ${g.matchedHouses.join(', ')}) תואמות את קבוצת ה-${g.wheelHebrew} בגלגל`)
    .join('; ');
  return {
    verdict: 'wheel-match',
    outputHebrew: `הדין חזק: ${details} (כשף עמ׳ 60-61).`,
    totalMatches, matchedGroups,
  };
}

// כשף אל-אסרר עמ' 161-163 — שער חמישי, "דיני דרך בבתים" (9-16). כאשר צורת
// דרך (1111) שורה באחד מבתי-העדות/הדין (9-16), הפסיקה נגזרת ממזג
// (פנימי/חיצוני) שני "בתי-ההורים" שממנו נגזר אותו בית — תואם בדיוק את
// מבנה הגזירה הקיים ב-raml-board-generator.js (house9=1+2, 10=3+4, 11=5+6,
// 12=7+8, 13=9+10, 14=11+12, 15=13+14, 16=15+1).
function internalExternalKey(pattern) {
  const dk = getDakhalKharij(pattern);
  return dk === 'dakhil' || dk === 'mujassad-dakhil' ? 'dakhil' : 'kharij';
}

export function computeDerekhHouseRuleKashf(chart) {
  const getH = (n) => chart.find((h) => Number(h.house) === n);

  const derekhHouse = [9, 10, 11, 12, 13, 14, 15, 16].find((n) => getH(n)?.key === '1111');
  if (!derekhHouse) {
    return {
      verdict: 'no-derekh-in-witness-houses',
      outputHebrew: 'צורת דרך אינה שורה באף אחד מבתי העדות/הדין (9-16) — אין לכלל זה תחולה בקריאה זו (כשף עמ׳ 161-163).',
    };
  }

  const rule = DEREKH_HOUSE_RULES[derekhHouse];
  const [p1, p2] = rule.parentHouses;
  const k1 = getH(p1)?.key, k2 = getH(p2)?.key;
  if (!k1 || !k2) return null;

  const comboKey = `${internalExternalKey(k1)}-${internalExternalKey(k2)}`;
  const verdict = rule.verdictsByParentCombo[comboKey];
  if (!verdict) {
    return {
      verdict: 'combo-not-specified-in-source',
      outputHebrew: `דרך שורה בבית ${derekhHouse}, אך שילוב המזג של בתים ${p1}/${p2} (${comboKey}) אינו מפורש בספר עבור בית זה — נותר ללא פסיקה (כשף עמ׳ 161-163).`,
      derekhHouse,
    };
  }

  return {
    verdict: 'derekh-house-rule-found',
    outputHebrew: `דרך שורה בבית ${derekhHouse}${rule.baseTopic ? ` (${rule.baseTopic})` : ''}: ${verdict.textHebrew} (${verdict.sourceRef}).`,
    derekhHouse,
    comboKey,
  };
}

// כשף אל-אסרר עמ' 163 — שער חמישי, "דיני מקצת הצורות": מתי צורה נותנת את
// תאוותיה. בודק את צורת בית 1 (השואל) מול הטבלה — לא נבנה מבנה נתונים
// חדש, רק לוקח בחשבון ישירות את הטקסט לגבי הצורה הספציפית בבית השואל.
export function computeFigureDesireFulfillmentKashf(chart) {
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h1 = getH(1);
  if (!h1?.key) return null;

  const note = FIGURE_DESIRE_FULFILLMENT_NOTES[h1.key];
  if (!note) {
    return {
      verdict: 'no-note-for-this-figure',
      outputHebrew: 'לא נמצאה הערה מיוחדת לצורת בית 1 בפרק "דיני מקצת הצורות" (כשף עמ׳ 163) — אין לכלל זה תחולה בקריאה זו.',
    };
  }
  return {
    verdict: 'note-found',
    outputHebrew: `צורת השואל (${note.nameHebrew}): ${note.textHebrew} (כשף עמ׳ 163).`,
    figureKey: h1.key,
  };
}

// כשף אל-אסרר עמ' 262-263 — "הצורה / הכוכב בבית האחד-עשר → סוג החברים".
// מיפוי צורה→כוכב לקוח מהטבלה הקיימת (FIGURE_PLANET_MAP, kashf-hazz.js,
// עמ' 133-134) — לא נבנה מיפוי חדש. נלחם/סוהר (משוערים כצמתי ראש/זנב)
// אינם משויכים לכוכב בטבלה הקיימת — אין דין עבורם.
export function computeFriendTypeByHouse11Kashf(chart) {
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h11 = getH(11);
  if (!h11?.key) return null;

  const planet = PATTERN_TO_PLANET_LOCAL[h11.key];
  if (!planet) {
    return {
      verdict: 'no-planet-mapping',
      outputHebrew: 'צורת בית 11 אינה משויכת לאחד משבעת הכוכבים המאומתים (ככל הנראה מצומתי ראש/זנב) — אין דין מוגדר לסוג החברים (כשף עמ׳ 262-263).',
    };
  }
  const friendType = FRIEND_TYPE_BY_PLANET[planet];
  return {
    verdict: 'friend-type-found',
    outputHebrew: `צורת בית 11 (${h11.hebrew || h11.key}) שייכת לכוכב ${planet} — סוג החברים: ${friendType} (כשף עמ׳ 262-263).`,
    planet,
  };
}
