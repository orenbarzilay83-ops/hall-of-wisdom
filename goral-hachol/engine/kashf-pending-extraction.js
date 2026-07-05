/**
 * kashf-pending-extraction.js
 *
 * "מחסן" זמני לפונקציות המבוססות על כשף אל-אסרר (ולא על חאווי) שהוצאו
 * מתוך hawi-interpreter.js כחלק מהפרדת שתי השיטות (ראה CLAUDE.md).
 *
 * חשוב: קובץ זה עדיין לא מחובר לשום מנוע חי. הפונקציות כאן שמורות
 * (לא נמחקו) כדי שלא לאבד עבודה שכבר בוצעה, אבל הן ימתינו לחיווט
 * מסודר לתוך מנוע כשף האמיתי (kashf-reading-engine.js) לפי המבנה
 * העצמאי של הספר (ראה שלב 3 בתוכנית ההפרדה) — לא לפי topicId של חאווי.
 *
 * כל פונקציה נושאת sourceRef מקורי לעמוד בספר כשף אל-אסרר.
 */

import { NATURAL_HOUSE_FIGURES } from './hawi-interpreter.js';
import { HAWI_SOURCE } from '../data/sources/hawi/hawi-source.js';

// כשף עמ' 104: "كل شكل حل في بيته الطبيعي يدل على الضمير — احفظ هذا فإنه سر الضمائر"
export function computeSodHaDhamirim(chart) {
  if (!Array.isArray(chart)) return null;
  const matches = [];
  for (const house of chart) {
    const hNum = Number(house.house);
    const naturalFig = NATURAL_HOUSE_FIGURES[hNum];
    if (naturalFig && house.key === naturalFig) {
      matches.push({
        houseNumber: hNum,
        pattern: house.key,
        figureHebrew: house.hebrew || house.key,
        fortune: house.fortune || null,
      });
    }
  }
  if (matches.length === 0) return null;
  const primary = matches[0];
  const outputHebrew = matches.length === 1
    ? `סוד הכוונות הנסתרות: בית ${primary.houseNumber} — ${primary.figureHebrew} יושבת בביתה הטבעי`
    : `סוד הכוונות הנסתרות: בתים ${matches.map(m => m.houseNumber).join(', ')} — צורות בביתן הטבעי`;
  return {
    method: 'sod-ha-dhamirim',
    methodHebrew: 'סוד הכוונות הנסתרות',
    sourceRef: 'כשף עמ׳ 104',
    matches,
    primaryHouseNumber: primary.houseNumber,
    primaryHebrew: primary.figureHebrew,
    primaryFortune: primary.fortune,
    outputHebrew,
  };
}

// כשף עמ' 35: "إن لم يأت في اليد المضروبة أحد هؤلاء الأشكال الأربعة ... فصاحب الضمير عائث كذاب"
const FOUR_HONESTY_FIGURES = ['1111', '1221', '2112', '2222'];

export function computeQuerentHonestyCheck(chart) {
  if (!Array.isArray(chart)) return null;
  const chartPatterns = new Set(chart.map(h => h.key).filter(Boolean));
  const foundFigures = FOUR_HONESTY_FIGURES.filter(f => chartPatterns.has(f));
  const isHonest = foundFigures.length > 0;
  const getFigHebrew = (pat) => {
    const rec = (HAWI_SOURCE.figureNames?.list || []).find(f => f.pattern === pat);
    return rec?.hebrewName || pat;
  };
  const foundHebrew = foundFigures.map(getFigHebrew);
  return {
    sourceRef: 'כשף עמ׳ 35',
    isHonest,
    foundFigures,
    foundHebrew,
    outputHebrew: isHonest
      ? `השואל ישר: בלוח מופיע${foundHebrew.length > 1 ? 'ות' : 'ה'} ${foundHebrew.join(', ')}`
      : 'אזהרה: אף אחת מ-4 הצורות המיוחדות לא מופיעה בלוח — השואל עשוי לשקר',
  };
}

// כשף עמ' 112: "لسان الأمر ... الشكل الحاصل من ضرب بيت الضمير في ثلثيه، وهو: الخامس، والتاسع"
const MADAD_TIMING = [
  null,
  { value: 1,  unit: 'ימים',    unitSingle: 'יום' },
  { value: 3,  unit: 'ימים',    unitSingle: 'ימים' },
  { value: 6,  unit: 'ימים',    unitSingle: 'ימים' },
  { value: 10, unit: 'ימים',    unitSingle: 'ימים' },
  { value: 1,  unit: 'שבועות',  unitSingle: 'שבוע' },
  { value: 3,  unit: 'שבועות',  unitSingle: 'שבועות' },
  { value: 6,  unit: 'שבועות',  unitSingle: 'שבועות' },
  { value: 10, unit: 'שבועות',  unitSingle: 'שבועות' },
  { value: 1,  unit: 'חודשים',  unitSingle: 'חודש' },
  { value: 3,  unit: 'חודשים',  unitSingle: 'חודשים' },
  { value: 6,  unit: 'חודשים',  unitSingle: 'חודשים' },
  { value: 10, unit: 'חודשים',  unitSingle: 'חודשים' },
  { value: 1,  unit: 'שנים',    unitSingle: 'שנה' },
  { value: 3,  unit: 'שנים',    unitSingle: 'שנים' },
  { value: 6,  unit: 'שנים',    unitSingle: 'שנות' },
  { value: 10, unit: 'שנים',    unitSingle: 'שנות' },
];

export function computeTimingByDhamirThirds(chart, dhamirHouseNum) {
  if (!Array.isArray(chart) || !dhamirHouseNum) return null;
  const combineP = (p1, p2) => {
    if (!p1 || !p2 || p1.length !== 4 || p2.length !== 4) return null;
    return p1.split('').map((c, i) => c === p2[i] ? '2' : '1').join('');
  };
  const dhamirEntry = chart.find(h => Number(h.house) === dhamirHouseNum);
  const house5 = chart.find(h => Number(h.house) === 5);
  const house9 = chart.find(h => Number(h.house) === 9);
  if (!dhamirEntry?.key || !house5?.key || !house9?.key) return null;
  const step1 = combineP(dhamirEntry.key, house5.key);
  if (!step1) return null;
  const resultPattern = combineP(step1, house9.key);
  if (!resultPattern) return null;
  const resultEntry = chart.find(h => h.key === resultPattern);
  const houseNum = resultEntry ? Number(resultEntry.house) : null;
  const timing = houseNum ? MADAD_TIMING[houseNum] : null;
  const TIME_POSITION = { 1:'הווה',4:'הווה',7:'הווה',10:'הווה', 2:'עתיד',5:'עתיד',8:'עתיד',11:'עתיד', 3:'עבר',6:'עבר',9:'עבר',12:'עבר' };
  const timePos = houseNum ? (TIME_POSITION[houseNum] || null) : null;
  const figRec = (HAWI_SOURCE.figureNames?.list || []).find(f => f.pattern === resultPattern);
  const resultHebrew = resultEntry?.hebrew || figRec?.hebrewName || resultPattern;
  let outputHebrew;
  if (houseNum && timing) {
    const timeStr = `${timing.value} ${timing.value === 1 ? timing.unitSingle : timing.unit}`;
    outputHebrew = `לשון-האמר: ${resultHebrew} בבית ${houseNum} → ${timeStr}${timePos ? ` (${timePos})` : ''}`;
  } else {
    outputHebrew = `לשון-האמר: ${resultHebrew} — לא נמצאת בלוח`;
  }
  return {
    sourceRef: 'כשף עמ׳ 112',
    dhamirHouseNum,
    house5Figure: house5.hebrew || house5.key,
    house9Figure: house9.hebrew || house9.key,
    resultPattern,
    resultHebrew,
    resultFoundInHouse: houseNum,
    timing,
    timePosition: timePos,
    outputHebrew,
  };
}

// כשף עמ' 124: "ينظر إلى بيت الضمير، وإلى الشكل الذي فيه، فيحكم به الطبع"
const FIGURE_ELEMENTS_MAP = {
  '1111': 'מים', '1112': 'אש',  '1121': 'רוח', '1122': 'אש',
  '1211': 'מים', '1212': 'אש',  '1221': 'עפר', '1222': 'אש',
  '2111': 'רוח', '2112': 'רוח', '2121': 'עפר', '2122': 'רוח',
  '2211': 'מים', '2212': 'מים', '2221': 'עפר', '2222': 'עפר',
};
const ELEMENT_TEMPERAMENT_MAP = {
  'אש':  'חם ויבש — מרה צהובה (צַפְרָא) — אנרגטי, חד, מנהיג',
  'רוח': 'חם ולח — דם (דַּם) — חברותי, מהיר, אופטימי',
  'מים': 'קר ולח — פלגמה (בַּלְגַ׳ם) — שקול, ממושך, מהורהר',
  'עפר': 'קר ויבש — מרה שחורה (סַוְדָּא) — כבד, עמיד, מאופק',
};

export function computeQuerentTemperament(chart, dhamirHouseNum) {
  if (!Array.isArray(chart) || !dhamirHouseNum) return null;
  const dhamirEntry = chart.find(h => Number(h.house) === dhamirHouseNum);
  if (!dhamirEntry?.key) return null;
  const element = FIGURE_ELEMENTS_MAP[dhamirEntry.key];
  if (!element) return null;
  const temperamentDesc = ELEMENT_TEMPERAMENT_MAP[element] || element;
  const figureHebrew = dhamirEntry.hebrew || dhamirEntry.key;
  return {
    sourceRef: 'כשף עמ׳ 124',
    dhamirHouseNum,
    dhamirFigure: figureHebrew,
    element,
    temperamentDesc,
    outputHebrew: `טבע השואל: ${figureHebrew} (בית ${dhamirHouseNum}) → יסוד ${element} — ${temperamentDesc}`,
  };
}

// כשף עמ' 159: "في معرفة السائل عمن سأل — انظر إلى السادس، وانظر مثله في أي بيت، فاعلم أنه يسأل عن صاحب ذلك"
const QUERENT_SUBJECT_HOUSE_ROLES = {
  1:  'השואל עצמו',
  2:  'ממון ורכוש',
  3:  'אח/אחות, שכן, קרוב',
  4:  'אב, בית, קרקע',
  5:  'ילד/ילדה',
  7:  'בן/בת זוג, שותף, יריב',
  8:  'ירושה, מוות',
  9:  'נסיעה, אדם רחוק, דת',
  10: 'שלטון, מלך, עבודה',
  11: 'ידיד, תקווה, רצון',
  12: 'אויב נסתר, בית סוהר',
};

export function computeQuerentSubject(board) {
  if (!board?.chart) return null;
  const house6 = board.chart.find(h => Number(h.house) === 6);
  if (!house6?.key) return null;

  const matches = board.chart
    .filter(h => Number(h.house) !== 6 && Number(h.house) <= 12 && h.key === house6.key)
    .map(h => {
      const num = Number(h.house);
      return { houseNumber: num, houseRole: QUERENT_SUBJECT_HOUSE_ROLES[num] || `בית ${num}`, figure: h.hebrew || h.key };
    });

  if (matches.length === 0) return null;

  const roleText = matches.map(m => `${m.houseRole} (בית ${m.houseNumber})`).join(', ');
  return {
    house6Figure: house6.hebrew || house6.key,
    house6Pattern: house6.key,
    matches,
    outputHebrew: `השואל שואל על: ${roleText}`,
    sourceRef: 'כשף עמ׳ 159',
  };
}
