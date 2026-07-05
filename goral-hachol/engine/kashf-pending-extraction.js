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

import {
  NATURAL_HOUSE_FIGURES,
  MALEFIC_FIGURE_PATTERNS,
  getFigureDirection,
  chartHouse,
  FIGURE_PLANET_MAP,
} from './hawi-interpreter.js';
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

// ── קבוצה 2b: שלטון / אורך חיים / לבוש / נסיעה (כשף אל-אסרר) ──────────────

// משך השררות — kashf p.259: stability of authority based on 4 angular houses
export function computeAuthorityDurationKashf(chart) {
  const angularNums = [1, 4, 7, 10];
  const angulars = angularNums.map((n) => chartHouse(chart, n));
  const isBenefic = (h) => h && !MALEFIC_FIGURE_PATTERNS.has(h.key || '');
  const isMutable = (h) => h && getFigureDirection(h.key) === 'mutable';
  const isMalefic = (h) => h && MALEFIC_FIGURE_PATTERNS.has(h.key || '');

  const allBenefic = angulars.every(isBenefic);
  const allMalefic = angulars.every(isMalefic);
  const anyMutable = angulars.some(isMutable);
  const anyMalefic = angulars.some(isMalefic);

  const housesDisplay = angulars.map((h, i) => `ב${angularNums[i]} (${h?.hebrew || '?'})`).join(', ');

  let verdict, outputHebrew;
  if (allBenefic) {
    verdict = 'stable';
    outputHebrew = `ארבעת היתדות (${housesDisplay}) מסועדות — המושל יישאר בשלטון, שלטונו יציב (כשף עמ׳ 259)`;
  } else if (allMalefic) {
    verdict = 'removal-soon';
    outputHebrew = `ארבעת היתדות (${housesDisplay}) מזיקיות — אין שלטון קבוע, יודח בקרוב (כשף עמ׳ 259)`;
  } else if (anyMutable) {
    verdict = 'alternating';
    outputHebrew = `יתדות מתהפכות בלוח (${housesDisplay}) — פעם יודח ופעם ימונה מחדש (כשף עמ׳ 259)`;
  } else if (anyMalefic) {
    verdict = 'risk';
    outputHebrew = `חלק מן היתדות מזיקיות (${housesDisplay}) — שלטון עם סיכון; אם חלקן מיטיב, יש לפחד אך לא לייאש (כשף עמ׳ 259)`;
  } else {
    verdict = 'stable';
    outputHebrew = `היתדות (${housesDisplay}) במיטיב — שלטון יציב (כשף עמ׳ 259)`;
  }
  return { verdict, outputHebrew };
}

// האם יחזור לתפקיד — kashf p.266: will the dismissed person return to their position?
export function computeReturnToOfficeKashf(chart) {
  const h1  = chartHouse(chart, 1);
  const h10 = chartHouse(chart, 10);
  const h16 = chartHouse(chart, 16);
  const isBenefic  = (h) => h && !MALEFIC_FIGURE_PATTERNS.has(h.key || '');
  const isIncoming = (h) => h && getFigureDirection(h.key) === 'incoming';

  const h1Good = isBenefic(h1) && isIncoming(h1);
  const h10Good = isBenefic(h10);
  const h16Good = isBenefic(h16);

  let verdict, outputHebrew;
  if (h1Good && (h10Good || h16Good)) {
    verdict = 'returns';
    outputHebrew = `ב1 (${h1?.hebrew}) מיטיב+נכנס, ב10 (${h10?.hebrew}) / ב16 (${h16?.hebrew}) תומכים — יחזור לתפקידו (כשף עמ׳ 266)`;
  } else if (!isBenefic(h1)) {
    verdict = 'no-return';
    outputHebrew = `ב1 (${h1?.hebrew}) מזיק — לא יחזור לתפקיד (כשף עמ׳ 266)`;
  } else {
    verdict = 'uncertain';
    outputHebrew = `ב1 (${h1?.hebrew}) מיטיב אך לא נכנס, או בית 10/16 לא תומכים — הדין לא מוכרע (כשף עמ׳ 266)`;
  }
  return { verdict, outputHebrew };
}

// יציבות המצב הנוכחי — kashf pp.265-266: durability of current state (דוואם אל-חאל)
export function computeStateStabilityKashf(chart) {
  const h1  = chartHouse(chart, 1);
  const h2  = chartHouse(chart, 2);
  const h9  = chartHouse(chart, 9);
  const h15 = chartHouse(chart, 15);
  const isBenefic = (h) => h && !MALEFIC_FIGURE_PATTERNS.has(h.key || '');

  const h1Good = isBenefic(h1);
  const h1ReturnsInH15 = h1?.key && h15?.key && h1.key === h15.key;
  const allFourGood = [h1, h2, h9, h15].every(isBenefic);
  const h15Good = isBenefic(h15);

  let verdict, outputHebrew;
  if (h1Good && h1ReturnsInH15) {
    verdict = 'stable-complete';
    outputHebrew = `ב1 (${h1?.hebrew}) מיטיב וחוזר בב15 — יציבות מלאה ושלמות האושר (כשף עמ׳ 265)`;
  } else if (allFourGood) {
    verdict = 'stable-all';
    outputHebrew = `ב1+2+9+15 (${h1?.hebrew}/${h2?.hebrew}/${h9?.hebrew}/${h15?.hebrew}) מסועדים — שלמות אושר, מעבר מטוב לטוב (כשף עמ׳ 265)`;
  } else if (!h1Good && h15Good) {
    verdict = 'improving';
    outputHebrew = `ב1 (${h1?.hebrew}) מזיק בבית מיטיב (ב15: ${h15?.hebrew}) — המצב עשוי להשתפר מרע לטוב (כשף עמ׳ 265)`;
  } else if (!h1Good) {
    verdict = 'declining';
    outputHebrew = `ב1 (${h1?.hebrew}) מזיק — המצב אינו יציב, צפויה ירידה (כשף עמ׳ 265-266)`;
  } else {
    verdict = 'moderate';
    outputHebrew = `ב1 (${h1?.hebrew}) מיטיב אך ב15 (${h15?.hebrew}) לא חוזר — יציבות בינונית (כשף עמ׳ 265)`;
  }
  return { verdict, outputHebrew };
}

// Security and lifespan from kashf p.234-236 (house 8)
export function computeSecurityKashf(chart) {
  const h8 = chartHouse(chart, 8);
  if (!h8) return null;
  const isSaad = !MALEFIC_FIGURE_PATTERNS.has(h8.key || '');
  const dir = getFigureDirection(h8.key);
  let verdict, outputHebrew;
  if (isSaad && dir === 'outgoing') {
    verdict = 'safe-outgoing';
    outputHebrew = `בית 8 (${h8.hebrew}) — מיטיב יוצא: יינצל השואל מן הפחד, ייכנס בידו ממון, והסוף נוטה לטובה (כשף עמ׳ 236).`;
  } else if (isSaad) {
    verdict = 'safe';
    outputHebrew = `בית 8 (${h8.hebrew}) — מיטיב: ביטחון מפחד, אריכות ימים, ירושה או ממון נעלם שיבוא אל השואל (כשף עמ׳ 234).`;
  } else if (dir === 'incoming') {
    verdict = 'fear-incoming';
    outputHebrew = `בית 8 (${h8.hebrew}) — מזיק פנימי: פחד חזק, אך סופו של האדם בתשובה, שלום ופיוס (כשף עמ׳ 236).`;
  } else {
    verdict = 'fear-outgoing';
    outputHebrew = `בית 8 (${h8.hebrew}) — מזיק יוצא: פחד מרובה ואין ביטחון; מיתתו עלולה להיות בפתאומיות או מחמת פגיעה (כשף עמ׳ 236).`;
  }
  return { verdict, outputHebrew };
}

// Lifespan stages from kashf p.264 (houses 11, 9, 7)
export function computeLifespanKashf(chart) {
  const h11 = chartHouse(chart, 11);
  const h9  = chartHouse(chart, 9);
  const h7  = chartHouse(chart, 7);
  const isSaad = (h) => h && !MALEFIC_FIGURE_PATTERNS.has(h.key || '');
  const stageHebrew = (h, label) => {
    if (!h) return `${label}: לא נמצא`;
    return `${label} (${h.hebrew}) — ${isSaad(h) ? 'מיטיב' : 'מזיק'}`;
  };
  return {
    verdict: 'three-stages',
    outputHebrew: `${stageHebrew(h11, 'ראשית החיים — ב11')} | ${stageHebrew(h9, 'אמצע החיים — ב9')} | ${stageHebrew(h7, 'סוף החיים — ב7')} (כשף עמ׳ 264).`,
  };
}

const KASHF_PLANET_COLORS = {
  'שמש':            'צהוב',
  'לבנה':           'צבעוני / מגוון',
  'מאדים':          'אדום',
  'כוכב / מרקורי':  'צבעוני / מגוון',
  'שבתאי':          'שחור',
  'נוגה':           'ירוק',
  'צדק':            'לבן',
};

// Clothing luck analysis from kashf p.265 (houses 5, 10, 11)
export function computeClothingLuckKashf(chart) {
  const h5  = chartHouse(chart, 5);
  const h10 = chartHouse(chart, 10);
  const h11 = chartHouse(chart, 11);
  const isSaad = (h) => h && !MALEFIC_FIGURE_PATTERNS.has(h.key || '');
  const isMutable = (h) => h && getFigureDirection(h.key) === 'mutable';
  const h5Good  = isSaad(h5);
  const h10Good = isSaad(h10);
  const h11Good = isSaad(h11);
  const planet5 = h5 ? FIGURE_PLANET_MAP[h5.key] : null;
  const color   = planet5 ? (KASHF_PLANET_COLORS[planet5] || 'לא ידוע') : 'לא ידוע';
  let verdict, outputHebrew;
  if (h5Good && h11Good) {
    verdict = 'luck';
    const mutableNote = isMutable(h5) ? ' הצורה מתהפכת — אינו עומד על לבוש אחד.' : '';
    outputHebrew = `ב5 (${h5?.hebrew}) וב11 (${h11?.hebrew}) מיטיבים — יש לו מזל בלבושים.${mutableNote} צבע הלבוש (${planet5 || 'לא ידוע'}): ${color} (כשף עמ׳ 265).`;
  } else if (!h10Good) {
    verdict = 'no-luck-rulers';
    outputHebrew = `ב10 (${h10?.hebrew}) מזיק — אין לו מזל בלבוש המלכים או בכיבוד מצד בעלי מעלה (כשף עמ׳ 265).`;
  } else {
    const bothBad = !h5Good && !h11Good;
    verdict = bothBad ? 'no-luck' : 'partial';
    outputHebrew = bothBad
      ? `ב5 (${h5?.hebrew}) וב11 (${h11?.hebrew}) מזיקים — אין מזל בלבוש, הבגד ישאר עליו עד שיקרע (כשף עמ׳ 265).`
      : `ב5 (${h5?.hebrew}) / ב11 (${h11?.hebrew}) — מצב מעורב, מזל חלקי בלבוש (כשף עמ׳ 265).`;
  }
  return { verdict, outputHebrew, colorHebrew: color, planet: planet5 };
}

// Lifespan by figure shapes — kashf p.195
const SHORT_LIFE_FIGURES = new Set(['2112', '1211', '1111', '2221', '2122']);
const LONG_LIFE_FIGURES  = new Set(['2212', '2222']);
const PILLAR_HOUSES      = new Set([1, 4, 7, 10]);

export function computeLifespanByFigureShapes(chart) {
  const nonPillars = chart.filter(h => !PILLAR_HOUSES.has(Number(h.house)));
  let shortCount = 0, longCount = 0;
  const shortNames = [], longNames = [];
  for (const h of nonPillars) {
    if (SHORT_LIFE_FIGURES.has(h.key)) {
      shortCount++;
      shortNames.push(`ב${h.house} (${h.hebrew})`);
    } else if (LONG_LIFE_FIGURES.has(h.key)) {
      longCount++;
      longNames.push(`ב${h.house} (${h.hebrew})`);
    }
  }
  let verdict, outputHebrew;
  if (longCount >= 2) {
    verdict = 'long-life';
    outputHebrew = `צורות ארוכות מרובות בבתים הלא-יתדיים: ${longNames.join(', ')} — מורות על אורך ימים (כשף עמ׳ 195).`;
  } else if (shortCount >= 3) {
    verdict = 'short-life';
    outputHebrew = `צורות קצרות מרובות בבתים הלא-יתדיים: ${shortNames.join(', ')} — מורות על קוצר ימים (כשף עמ׳ 195).`;
  } else if (longCount > shortCount) {
    verdict = 'leaning-long';
    outputHebrew = `${longCount} צורות ארוכות (${longNames.join(', ')}) מול ${shortCount} קצרות — נטייה לאורך ימים (כשף עמ׳ 195).`;
  } else if (shortCount > longCount) {
    verdict = 'leaning-short';
    outputHebrew = `${shortCount} צורות קצרות (${shortNames.join(', ')}) מול ${longCount} ארוכות — נטייה לאורך חיים קצר (כשף עמ׳ 195).`;
  } else {
    verdict = 'neutral';
    outputHebrew = `${shortCount} צורות קצרות, ${longCount} ארוכות בבתים הלא-יתדיים — אין הכרעה ברורה לאורך חיים (כשף עמ׳ 195).`;
  }
  return { verdict, outputHebrew, shortCount, longCount, shortNames, longNames };
}

// Preferred clothing figures: כבוד נכנס(2211), לבן(2212), בר הלחי(1211) in h5 — kashf p.196
export function computeClothingBestFiguresKashf(chart) {
  const h5 = chartHouse(chart, 5);
  if (!h5) return null;
  const BEST_CLOTHING = new Set(['2211', '2212', '1211']);
  const isBest = BEST_CLOTHING.has(h5.key);
  return {
    verdict: isBest ? 'best-clothing' : 'other',
    outputHebrew: isBest
      ? `ב5 (${h5.hebrew}) — מן הצורות המועדפות לפריסת לבוש ותפירה: כבוד נכנס / לבן / בר הלחי (כשף עמ׳ 196).`
      : `ב5 (${h5.hebrew}) — אינה מן הצורות המועדפות לפריסת לבוש (כשף עמ׳ 196).`,
  };
}

// Who looks at whom — fire row of h1, h7, h13 (kashf p.170)
export function computeWhoLooksAtWhomKashf(chart) {
  const h1  = chartHouse(chart, 1);
  const h7  = chartHouse(chart, 7);
  const h13 = chartHouse(chart, 13);
  if (!h1 || !h7) return null;
  // fire row = pattern[0]; '1'=odd=single=open, '2'=even=pair=closed
  const h1Fire  = h1.key?.[0] === '1';
  const h7Fire  = h7.key?.[0] === '1';
  const h13Fire = h13?.key?.[0] === '1';
  let verdict, outputHebrew;
  if (h1Fire && !h7Fire) {
    verdict = 'looks-at-you';
    outputHebrew = `ב1 (${h1.hebrew}) — שורת האש פתוחה; ב7 (${h7.hebrew}) — שורת האש סתומה: האדם מביט אליך (כשף עמ׳ 170).`;
  } else if (h13Fire && h7Fire) {
    verdict = 'looks-at-other';
    outputHebrew = `ב13 (${h13?.hebrew}) וב7 (${h7.hebrew}) — שתי שורות האש פתוחות: האדם מביט אל אחר (כשף עמ׳ 170).`;
  } else {
    verdict = 'unclear';
    outputHebrew = `ב1 (${h1.hebrew}) / ב7 (${h7.hebrew}) — אין אינדיקציה ברורה מי מביט על מי (כשף עמ׳ 170).`;
  }
  return { verdict, outputHebrew };
}

// Source of money — count all board points mod 7 (kashf p.181)
export function computeMoneySourceKashf(chart) {
  let total = 0;
  for (const h of chart) {
    const key = h.key || '';
    for (const c of key) total += (c === '1') ? 1 : 2;
  }
  const foundMoney = (total % 2 === 0);
  const rem7 = total % 7;
  const srcMap = { 1: 'מצד השלטון', 2: 'מצד נשים', 3: 'מצד כתיבה או ספרים',
                   4: 'מצד ירושה', 5: 'מצד נסיעה', 6: 'מצד מסחר', 0: 'מצד גניבה — אין בה טוב' };
  const source = srcMap[rem7] || srcMap[0];
  const moneyNote = foundMoney ? 'ימצא כסף גדול' : 'אינו מוצא כסף';
  return {
    verdict: foundMoney ? `money-found-${rem7}` : 'no-money',
    outputHebrew: `סך נקודות הלוח: ${total} — ${moneyNote}. מקור הכסף (שארית ÷7=${rem7 || 7}): ${source} (כשף עמ׳ 181).`,
    total, foundMoney, source,
  };
}

// Well drilling — h4 saad+incoming = success (kashf p.188-189)
export function computeWellDrillingKashf(chart) {
  const h1  = chartHouse(chart, 1);
  const h4  = chartHouse(chart, 4);
  const h7  = chartHouse(chart, 7);
  const h10 = chartHouse(chart, 10);
  if (!h4) return null;
  const isSaad  = (h) => h && !MALEFIC_FIGURE_PATTERNS.has(h.key || '');
  const isIn    = (h) => h && getFigureDirection(h.key) === 'incoming';
  const h4Good  = isSaad(h4) && isIn(h4);
  const pillarsOk = [h1, h4, h7, h10].every(h => isSaad(h));
  const k = h4.key || '    ';
  const depthUnit = k[0]==='1' ? 'אצבעות (אש)' : k[1]==='1' ? 'שיבר (אוויר)' : k[2]==='1' ? 'אמות (מים)' : 'לפי עומק הקרקע (עפר)';
  let verdict, outputHebrew;
  if (h4Good && pillarsOk) {
    verdict = 'success';
    outputHebrew = `ב4 (${h4.hebrew}) — מיטיב ופנימי, כל היתדות מיטיבים: הבאר תצלח ויימצאו מים. מידת העומק: ${depthUnit} (כשף עמ׳ 188-189).`;
  } else if (h4Good) {
    verdict = 'partial';
    outputHebrew = `ב4 (${h4.hebrew}) — מיטיב ופנימי, אך לא כל היתדות מיטיבים: יש סיכוי למים, אך לא מובטח. עומק: ${depthUnit} (כשף עמ׳ 188-189).`;
  } else {
    verdict = 'fail';
    const reason = !isSaad(h4) ? 'מזיק' : 'חיצוני';
    outputHebrew = `ב4 (${h4.hebrew}) — ${reason}: לא מומלץ לחפור באר בעת זו (כשף עמ׳ 188-189).`;
  }
  return { verdict, outputHebrew };
}

// Travel timing — good figures for h9 (kashf p.238)
export function computeTravelTimingKashf(chart) {
  const h9 = chartHouse(chart, 9);
  const h4 = chartHouse(chart, 4);
  if (!h9) return null;
  const isSaad = (h) => h && !MALEFIC_FIGURE_PATTERNS.has(h.key || '');
  const BEST = new Set(['1111', '2221', '2211']);
  const GOOD = new Set(['1111', '2111', '1122']);
  const NEUTRAL = new Set(['2221', '1112', '1212', '1221', '2112', '2222']);
  const h4Good = isSaad(h4);
  const h9Key  = h9.key;
  let verdict, outputHebrew;
  if (BEST.has(h9Key) && h4Good) {
    verdict = 'excellent-time';
    outputHebrew = `ב9 (${h9.hebrew}) — מן הצורות המועדפות לנסיעה, וב4 (${h4?.hebrew}) מיטיב: זמן מצוין לנסיעה (כשף עמ׳ 238).`;
  } else if (BEST.has(h9Key)) {
    verdict = 'good-time';
    outputHebrew = `ב9 (${h9.hebrew}) — צורה מועדפת לנסיעה, אך ב4 (${h4?.hebrew}) מזיק: זמן בינוני לנסיעה (כשף עמ׳ 238).`;
  } else if (GOOD.has(h9Key) && h4Good) {
    verdict = 'travel-happens';
    outputHebrew = `ב9 (${h9.hebrew}) וב4 (${h4?.hebrew}) מיטיבים: הנסיעה תתקיים בהצלחה (כשף עמ׳ 238).`;
  } else if (NEUTRAL.has(h9Key)) {
    verdict = 'travel-no-benefit';
    outputHebrew = `ב9 (${h9.hebrew}) — הנסיעה תתקיים, אך השואל יחזור ללא תועלת שלמה (כשף עמ׳ 238).`;
  } else {
    verdict = 'avoid-travel';
    outputHebrew = `ב9 (${h9.hebrew}) — אינה מן הצורות הטובות לנסיעה: הימנע מנסיעה בעת זו (כשף עמ׳ 238).`;
  }
  return { verdict, outputHebrew };
}

// Profession by planet of h9 (kashf p.254)
const PROFESSION_BY_PLANET = {
  'שבתאי':          'חקלאות ועבודת אדמה',
  'צדק':            'בקשת חכמות ולימודים',
  'מאדים':          'רפואה ורפואת בהמות',
  'שמש':            'הנדסה ומדידות',
  'נוגה':           'דברי הימים, לחנים וניגונים',
  'כוכב / מרקורי':  'סגולות, כתיבות, חשבונות ואצטגנינות',
  'לבנה':           'ענייני עניים וצדיקים',
};

export function computeProfessionH9Kashf(chart) {
  const h9  = chartHouse(chart, 9);
  const h10 = chartHouse(chart, 10);
  const h11 = chartHouse(chart, 11);
  if (!h9) return null;
  const isSaad  = (h) => h && !MALEFIC_FIGURE_PATTERNS.has(h.key || '');
  const planet9 = FIGURE_PLANET_MAP[h9.key];
  const profession = planet9 ? (PROFESSION_BY_PLANET[planet9] || null) : null;
  const lightWork = isSaad(h10) && isSaad(h11);
  let outputHebrew = '';
  if (lightWork) outputHebrew += `ב10 (${h10?.hebrew}) וב11 (${h11?.hebrew}) מיטיבים — מלאכתו מעטה בטרחה ומוצא בה מנוחה. `;
  if (planet9 && profession) {
    outputHebrew += `כוכב ב9: ${planet9} (${h9.hebrew}) → מלאכה: ${profession} (כשף עמ׳ 254).`;
  } else if (planet9) {
    outputHebrew += `ב9 (${h9.hebrew}) — כוכב ${planet9}, אך המקצוע אינו מפורש בטבלה (כשף עמ׳ 254).`;
  } else {
    outputHebrew += `ב9 (${h9.hebrew}) — ראש/זנב התלי: ידיעת הדתות ועניינים נסתרים, או לחלופין בורות ובגידה (כשף עמ׳ 254).`;
  }
  return { verdict: planet9 ? `profession-${planet9}` : 'node', outputHebrew, planet: planet9, profession };
}

// Promise fulfillment — h1,3,8,9,11,15 check (kashf p.255)
export function computePromiseFulfillmentKashf(chart) {
  const keyHouses = [1, 3, 8, 9, 11, 15].map(n => chartHouse(chart, n));
  const [h1, h3, h8, h9, h11, h15] = keyHouses;
  const h2 = chartHouse(chart, 2);
  const isSaad   = (h) => h && !MALEFIC_FIGURE_PATTERNS.has(h.key || '');
  const isMutable = (h) => h && getFigureDirection(h.key) === 'mutable';
  const hasTariq = h1?.key === '1111';
  const hasAqla  = h1?.key === '1221';
  const mutableH2H9 = isMutable(h2) || isMutable(h9);
  const saadCount  = keyHouses.filter(h => h && isSaad(h)).length;
  const nahusCount = keyHouses.filter(h => h && !isSaad(h)).length;
  let verdict, outputHebrew;
  if (hasTariq) {
    verdict = 'many-promises-empty';
    outputHebrew = `ב1 — דרך: הבטחות רבות ומשאלות בטלות; ייתכן קיום לאחר עיכוב (כשף עמ׳ 255).`;
  } else if (hasAqla) {
    verdict = 'promise-with-delay';
    outputHebrew = `ב1 — סוהר: הבטחה אמתית ואפשר שתתקיים, אך ייתכן עיכוב (כשף עמ׳ 255).`;
  } else if (mutableH2H9) {
    verdict = 'broken-promise';
    const who = isMutable(h2) ? `ב2 (${h2?.hebrew})` : `ב9 (${h9?.hebrew})`;
    outputHebrew = `${who} — צורה מתהפכת (דו-גוף): הוא מפר את ההבטחה (כשף עמ׳ 255).`;
  } else if (saadCount >= 4) {
    verdict = 'true-promise';
    outputHebrew = `${saadCount}/6 מן הבתים (ב1,3,8,9,11,15) מיטיבים ופנימיים — ההבטחה אמתית, וממנה יגיע טוב (כשף עמ׳ 255).`;
  } else if (nahusCount >= 4) {
    verdict = 'false-promise';
    outputHebrew = `${nahusCount}/6 מן הבתים (ב1,3,8,9,11,15) מזיקים — ההבטחה אינה אמת ואינה נשלמת (כשף עמ׳ 255).`;
  } else {
    verdict = 'mixed';
    outputHebrew = `${saadCount}/6 מן הבתים (ב1,3,8,9,11,15) מיטיבים — מצב מעורב, ייתכן קיום חלקי של ההבטחה (כשף עמ׳ 255).`;
  }
  return { verdict, outputHebrew };
}

// Fugitive tracking — h1=owner, h7=fugitive, h4=location, h10=purpose, h15=outcome (kashf p.240-241)
export function computeFugitiveKashf(chart) {
  const h1  = chartHouse(chart, 1);
  const h4  = chartHouse(chart, 4);
  const h6  = chartHouse(chart, 6);
  const h7  = chartHouse(chart, 7);
  const h10 = chartHouse(chart, 10);
  const h15 = chartHouse(chart, 15);
  if (!h1 || !h7) return null;
  const isSaad = (h) => h && !MALEFIC_FIGURE_PATTERNS.has(h.key || '');
  const isIn   = (h) => h && getFigureDirection(h.key) === 'incoming';
  const h1h6BothIn = isIn(h1) && isIn(h6);
  const allFourGood = [h1, h7, h10, h4].every(h => isSaad(h));
  const outcomeGood = isSaad(h15);
  let verdict, outputHebrew;
  if (h1h6BothIn && allFourGood && outcomeGood) {
    verdict = 'will-return';
    outputHebrew = `ב1+ב6 פנימיים, כל הבתים הראשיים (ב1,4,7,10) מיטיב, וב15 (${h15?.hebrew}) לטובה — הבורח לא התרחק ועתיד לשוב (כשף עמ׳ 240-241). מיקום (ב4): ${h4?.hebrew}.`;
  } else if (!allFourGood || !outcomeGood) {
    verdict = 'will-not-return';
    outputHebrew = `ב7 (${h7?.hebrew}) או ב15 (${h15?.hebrew}) מזיק — הבורח לא יחזור (כשף עמ׳ 240-241). מיקום אפשרי (ב4): ${h4?.hebrew}.`;
  } else {
    verdict = 'return-possible';
    outputHebrew = `הסימנים מעורבים — ייתכן שיחזור עם מאמץ (כשף עמ׳ 240-241). ב4 (מיקום): ${h4?.hebrew}. ב15 (סוף): ${h15?.hebrew}.`;
  }
  return { verdict, outputHebrew };
}
