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
  ELEMENT_DIRECTION,
  getFigureFortuneTone,
  deriveFigureG,
  getDerivedFortune,
  getDerivedFortuneTone,
  isBeneficG,
  isMaleficG,
  FIGURE_HEBREW_G,
} from './hawi-interpreter.js';
import { HAWI_SOURCE } from '../data/sources/hawi/hawi-source.js';

const isIncomingG = (h) => h && (h.direction === 'incoming' || (h.key && ['2111','2112','2121','2122','2211','2212','2221','2222'].includes(h.key)));

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

// ── קבוצה 2c: גוף/גנבה/כיוון (כשף אל-אסרר) ────────────────────────────────

// מקור: כשף אל-אסרר עמ׳ 199 — תסכין האיברים (שיבוץ איברי הגוף)
// "התבונן בבית השישי ובצורה שנפלה בו — לפי הצורה תדע באיזה איבר החולי"
const FIGURE_BODY_PART_KASHF = {
  '2222': 'ראש',         // קהלה
  '2112': 'ראש',         // חיבור
  '2212': 'צוואר',       // לבן
  '1211': 'חזה',         // בר הלחי
  '1111': 'בטן',         // דרך
  '1122': 'בטן',         // כבוד יוצא
  '2122': 'אחוריים',     // אדום
  '2211': 'איבר המין',   // כבוד נכנס
  '1221': 'יד ימין',     // סוהר
  '1212': 'כתף ימין',    // ממון יוצא
  '2221': 'צד ימין',     // שפל ראש
  '1121': 'ירך ימין',    // נלחם
  '2121': 'כתף שמאל',    // ממון נכנס
  '1112': 'צד שמאל',     // סף יוצא
  '2111': 'ירך שמאל',    // סף נכנס
  // '1222' (נשוא ראש): הספר מזכיר "תשמיר" (רגל ימין) ו"דגל השמחה" (רגל שמאל) — שמות מסורתיים
};

export function computeBodyPartDiagnosisKashf(chart) {
  const h6 = chart.find((h) => Number(h.house) === 6);
  if (!h6?.key) return null;
  const bodyPart = FIGURE_BODY_PART_KASHF[h6.key];
  const figHebrew = h6.hebrew || h6.key;
  if (h6.key === '1222') {
    return {
      figureKey: h6.key, figureHebrew: figHebrew, bodyPartHebrew: 'רגל',
      outputHebrew: `${figHebrew} בבית 6 — האיבר הכואב: רגל (כשף עמ׳ 199 — נשוא ראש מוזכר כ"תשמיר" ו"דגל השמחה")`,
    };
  }
  if (!bodyPart) return {
    figureKey: h6.key, figureHebrew: figHebrew, bodyPartHebrew: null,
    outputHebrew: `${figHebrew} בבית 6 — האיבר הכואב: לא מופה (כשף עמ׳ 199)`,
  };
  return {
    figureKey: h6.key, figureHebrew: figHebrew, bodyPartHebrew: bodyPart,
    outputHebrew: `${figHebrew} בבית 6 — האיבר הכואב: ${bodyPart} (כשף עמ׳ 199)`,
  };
}

// BATCH A: כיוון גיאוגרפי — כשף אל-אסרר עמ' 62
// ELEMENT_DIRECTION מיובא מ-hawi-interpreter.js (משותף גם עם computeDiggingDirection החאווי)
export function computeGeographicDirection(chart) {
  const h1 = chart.find((h) => Number(h.house) === 1);
  if (!h1?.key) return null;
  const el = h1.element || h1.elementHebrew || '';
  const dir = ELEMENT_DIRECTION[el];
  if (!dir) return null;
  return {
    element: el, direction: dir,
    outputHebrew: `${h1.hebrew || h1.key} בבית 1 (יסוד: ${el}) → כיוון גיאוגרפי: ${dir}`,
  };
}

export function computeTravelDirection(chart) {
  const h9 = chart.find((h) => Number(h.house) === 9);
  if (!h9?.key) return null;
  const el = h9.element || h9.elementHebrew || '';
  const dir = ELEMENT_DIRECTION[el];
  if (!dir) return null;
  return {
    element: el, direction: dir,
    outputHebrew: `${h9.hebrew || h9.key} בבית 9 (יסוד: ${el}) → כיוון הנסיעה: ${dir}`,
  };
}

// BATCH B: גנבה — קרבה, גיל, האם הגנוב יוחזר. מקור ראשי: כשף אל-אסרר עמ׳ 224, 229-234
const THIEF_AGE_BY_FIGURE = {
  '1211': 'צעיר', '1112': 'צעיר', '2212': 'צעיר',
  '2222': 'ביניים', '1111': 'ביניים', '2111': 'ביניים',
  '2221': 'זקן',   '1222': 'זקן',
};

// כשף אל-אסרר עמ׳ 224 — "אם הבית השביעי חוזר באחד הבתים, הוא מורה על סיבת הגניבה ועל מי שקשור בה"
const THIEF_PROXIMITY_BY_HOUSE = {
  1:  'עומד במקום בעל הדבר — הגנב ממעגל השואל הקרוב',
  2:  'מן העוזרים / המכרים של בעל הדבר',
  3:  'זה הגנב עצמו — גילויו ודאי (ב3 = הגנב)',
  4:  'ממי שנכנס לבית הנשאל',
  5:  'ממי שמתערב עם ילדי בעל הדבר',
  6:  'הגנב יחלה בגלל הגניבה',
  7:  'גילוי הגנב ודאי',
  8:  'אדם רחוק / מחוץ להישג יד',
  9:  'הדבר בא בגלל נסיעה — הגנב קשור לנסיעה',
  10: 'ממי שקשור לבעלי השלטון',
  11: 'קשור לאנשים שהגנב מתחבר עמם',
  12: 'אויב נסתר',
};

// כשף אל-אסרר עמ׳ 231-234 — תיאור הגנב לפי הצורה בבית 7
const THIEF_PHYSICAL_DESCRIPTION_KASHF = {
  '1121': 'דמותו גבוהה, צבעו נוטה לאדמומיות, זקנו מייצג — ויש בו חריפות וגסות',
  '1222': 'עד, סופר או מלמד — שלם במראהו, רחב חזה, עיניים גדולות, פנים עגולות, צבעו לבן ונאה',
  '2111': 'אישה או דמות נקבית — לבנה, זריזת דיבור, ראשה גדול, כפות רגליה דקות; לחלופין: עירוני / מן אנשי המלאכה',
  '2212': 'לבן, צוחק, נבון ומובחן — עוסק בכתיבה, נייר או תפירה',
  '1211': 'נמשך אחר נשים, יש בו תחבולה ודעת; לחלופין: אישה או נער יפה-עיניים',
  '1112': 'צבעו שחום, מבטו רע וריחו רע — מלאכות ניקוי, אשפה או בזויות',
  '2122': 'צבעו דמי, קומה גבוהה, רגליים רחבות, סימן בפנים — עוסק בבישול, חריתה או אש; לעיתים רכיל',
  '2221': 'צבעו שחור, שורש עבדות או שפלות — עוסק בעורות, אדמה או בהמות',
  '1122': 'עגול-פנים, רחב רגליים, ניכר במעמדו ויופיו — עוסק בזהב, אבנים או חפצי ערך',
  '1221': 'שחום, רחב בטן, גדול רגליים — עוסק בסנדלרות או עבודה גסה',
  '2112': 'איש לשכה — כתיבה, חשבון, שיפוט, ספרים',
  '2211': 'דמות לבנה, עגולת פנים, ראש גדול, קומה קטנה — עוסק בדין, הוראה או מעמד כבוד',
  '1111': 'נער קטן, דק-גוף, מהיר בתנועה — שליחות, ריקוד, הליכה',
  '1212': 'פנים לבנות או צהובות, ראש קטן, רגליים גדולות — עוסק ברפואה או חכמה',
  '2222': 'גוף רחב, סנטר גדול, רגליים רחבות — בעל מנהיגות, ספנות, הנדסה',
  '2121': 'קומה בינונית, פנים עגולות, ראש ורגליים גדולים, זקן עבה — עוסק בסחורה וקניין',
};

export function computeThiefAge(chart) {
  const h7 = chart.find((h) => Number(h.house) === 7);
  if (!h7?.key) return null;
  const age = THIEF_AGE_BY_FIGURE[h7.key];
  const figHebrew = h7.hebrew || h7.key;
  if (!age) return {
    figureKey: h7.key, figureHebrew: figHebrew, age: null,
    outputHebrew: `${figHebrew} בבית 7 — גיל הגנב: לא מפורש במקור עבור צורה זו`,
  };
  return { figureKey: h7.key, figureHebrew: figHebrew, age,
    outputHebrew: `${figHebrew} בבית 7 — גיל הגנב: ${age}`,
  };
}

export function computeThiefPhysicalDescriptionKashf(chart) {
  const h7 = chart.find((h) => Number(h.house) === 7);
  if (!h7?.key) return null;
  const desc = THIEF_PHYSICAL_DESCRIPTION_KASHF[h7.key];
  const figHebrew = h7.hebrew || h7.key;
  if (!desc) return {
    figureKey: h7.key, figureHebrew: figHebrew,
    outputHebrew: `${figHebrew} בבית 7 — תיאור הגנב: לא מפורש במקור (כשף עמ׳ 231-234)`,
  };
  return {
    figureKey: h7.key, figureHebrew: figHebrew, description: desc,
    outputHebrew: `${figHebrew} בבית 7 — ${desc}`,
  };
}

export function computeThiefProximity(chart) {
  const h7 = chart.find((h) => Number(h.house) === 7);
  if (!h7?.key) return null;
  const figHebrew = h7.hebrew || h7.key;
  const appearances = chart
    .filter((h) => Number(h.house) !== 7 && h.key === h7.key && Number(h.house) <= 12)
    .map((h) => Number(h.house));
  if (!appearances.length) {
    return { figureKey: h7.key, figureHebrew: figHebrew, appearances: [],
      outputHebrew: `${figHebrew} (ב7) — לא חוזר בבתים אחרים: הגנב זר, ממקום אחר`,
    };
  }
  const lines = appearances.map((hn) => `${figHebrew} חוזר בבית ${hn} → ${THIEF_PROXIMITY_BY_HOUSE[hn] || `בית ${hn}`}`);
  return { figureKey: h7.key, figureHebrew: figHebrew, appearances,
    outputHebrew: lines.join('\n'),
  };
}

export function computeStolenItemReturn(chart) {
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h1 = getH(1); const h2 = getH(2);
  const h7 = getH(7); const h8 = getH(8);
  const h12 = getH(12); const h14 = getH(14);
  if (!h1 || !h7) return null;
  const isSaad = (h) => !!h && String(h.fortune || '').includes('מיטיב');
  const isNahs = (h) => !!h && String(h.fortune || '').includes('מזיק');
  const lines = [];
  // כשף עמ׳ 229: "אם מצאת בראשון ובשני צורות מיטיבות, ובשביעי ובשמיני צורות מזיקות — הגניבה חוזרת לבעליה"
  if (isSaad(h1) && isSaad(h2) && isNahs(h7) && isNahs(h8)) {
    lines.push('בית 1+2 מיטיב + בית 7+8 מזיק → הגניבה חוזרת לבעליה (כשף עמ׳ 229)');
  }
  // כשף עמ׳ 229: "ואם בראשון ובשני צורות מזיקות, ובשביעי ובשמיני צורות מיטיבות — לא יחזור אליו דבר"
  if (isNahs(h1) && isNahs(h2) && isSaad(h7) && isSaad(h8)) {
    lines.push('⚠ בית 1+2 מזיק + בית 7+8 מיטיב → לא יחזור לבעליו (כשף עמ׳ 229)');
  }
  // כשף עמ׳ 229: "אם ראית את השמיני בשני, יחזור לבעל הדבר מה שאבד ממנו"
  if (h8 && h2 && h8.key === h2.key) {
    lines.push(`בית 8 ובית 2 אותה צורה (${h8.hebrew || h8.key}) → יחזור לבעל הדבר מה שאבד (כשף עמ׳ 229)`);
  }
  const h12Incoming = h12 && h12.direction === 'incoming';
  const h12Outgoing = h12 && h12.direction === 'outgoing';
  const h14Outgoing = h14 && h14.direction === 'outgoing';
  if (h12Incoming) {
    const ease = h12.movement === 'מתהפך' ? ' בקלות' : h12.movement === 'קבוע' ? ' בקושי' : '';
    lines.push(`בית 12 נכנס → הגנבה תוחזר${ease}`);
  }
  if (h12Outgoing && h14Outgoing) {
    lines.push('בית 12+14 יוצאים → הגנבה לא תוחזר');
  }
  if (!lines.length) {
    if (isSaad(h1)) lines.push('בית 1 מיטיב — יש סיכוי להחזרה');
    else if (isNahs(h1)) lines.push('בית 1 מזיק — סיכוי נמוך להחזרה');
    else lines.push('לא נמצאו סימנים ברורים — ספק תוחזר');
  }
  return { outputHebrew: lines.join('\n') };
}

// ── קבוצה 2d: הריון/הלוואה/דת/דיני האם (כשף אל-אסרר) ──────────────────────

export function computeChildrenPregnancyKashfAnalysis(chart) {
  if (!Array.isArray(chart) || chart.length < 16) return null;

  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h1  = getH(1);
  const h5  = getH(5);
  const h6  = getH(6);
  const h7  = getH(7);
  const h8  = getH(8);
  const h11 = getH(11);
  const h15 = getH(15);
  const h16 = getH(16);

  if (!h5) return null;

  // Element per pattern (Kashf al-Asrar pp. 43-67, confirmed in kashf-figure-names.js)
  const ELEMENT = {
    '1111':'מים','1112':'אש','1121':'אוויר','1122':'אש',
    '1211':'מים','1212':'אש','1221':'עפר','1222':'אש',
    '2111':'אוויר','2112':'אוויר','2121':'עפר','2122':'אוויר',
    '2211':'מים','2212':'מים','2221':'עפר','2222':'עפר',
  };

  // RAML derivation: same row → 2, different → 1
  const deriveFigure = (p1, p2) => {
    if (!p1 || !p2 || p1.length !== 4 || p2.length !== 4) return null;
    return p1.split('').map((c, i) => c === p2[i] ? '2' : '1').join('');
  };

  const isBenefic = (h) => {
    if (!h) return false;
    const f = String(h.fortune || '');
    return f.includes('מיטיב') && !f.startsWith('ממוזג-מזיק');
  };
  const isMalefic = (h) => {
    if (!h) return false;
    return String(h.fortune || '').includes('מזיק');
  };

  const lines = [];
  const h5Pattern = h5.key || '';

  // 1. האם ההריון אמיתי? (Kashf p.191)
  // صامت (silent/full): first digit '2' → pregnancy real
  // فارغ (empty): first digit '1' → pregnancy false
  const pregnancyReal = h5Pattern.startsWith('2');
  lines.push(`האם ההריון אמיתי: ${pregnancyReal ? 'כן — בית 5 מלא (צאמת)' : 'לא — בית 5 ריק (פארג)'} [${h5.hebrew || h5Pattern}]`);

  // 2. מין העובר לפי יסוד בית 1+5 (Kashf p.193)
  // "خذ من الأول والخامس ، فإن خرج ناري أو هوائي ، فالحمل ذكر ؛ وإن كان مائي أو ترابي ، فالحمل أنثى"
  const derived15Pattern = deriveFigure(h1?.key, h5Pattern);
  if (derived15Pattern) {
    const el = ELEMENT[derived15Pattern] || null;
    if (el === 'אש' || el === 'אוויר') {
      lines.push(`מין העובר (יסוד בית 1+5 → ${el}): זכר [כשף עמ׳ 193]`);
    } else if (el === 'מים' || el === 'עפר') {
      lines.push(`מין העובר (יסוד בית 1+5 → ${el}): נקבה [כשף עמ׳ 193]`);
    }
  }

  // 3. הפלה? (Kashf pp.191-192)
  const h7Pattern = h7?.key || '';
  const h8Pattern = h8?.key || '';
  const h11SafeIncoming = h11 && h11.key?.startsWith('2') && isBenefic(h11);

  if (h7Pattern === '2122' || h7Pattern === '2221') {
    lines.push(`סכנת הפלה: ${h7?.hebrew || h7Pattern} בבית 7 — סכנת הפלה [כשף עמ׳ 191-192]`);
  }
  if (h8Pattern === '2122') {
    lines.push(`סכנת הפלה: אדום בבית 8 — סכנת הפלה [כשף עמ׳ 192]`);
  }
  if (h8Pattern === '1221') {
    if (h11SafeIncoming) {
      lines.push(`סוהר בבית 8 — האם בסכנה, בית 11 מיטיב-נכנס: הנולד ינצל [כשף עמ׳ 192]`);
    } else {
      lines.push(`סוהר בבית 8 — סכנת מוות לאם ולנולד [כשף עמ׳ 192]`);
    }
  }

  // 4. קושי לידה (Kashf p.191)
  // ثابت (pattern '22xx') → difficult birth; منقلب ('11xx') → easy
  const dir5 = h5Pattern.slice(0, 2);
  if (dir5 === '22') {
    lines.push(`קושי בלידה: בית 5 קבוע (ת׳אבת) — הלידה קשה [כשף עמ׳ 191]`);
  } else if (dir5 === '11') {
    lines.push(`לידה קלה: בית 5 מתהפך (מנקלב) — הלידה תתרחש בקלות [כשף עמ׳ 191]`);
  }

  // 5. תאומים — מוגסד (Kashf p.191)
  // Palindromic figures: 1111, 1221, 2112, 2222 (same when rows are reversed)
  const PALINDROMES = new Set(['1111','1221','2112','2222']);
  if (PALINDROMES.has(h5Pattern)) {
    lines.push(`תאומים: בית 5 = ${h5.hebrew || h5Pattern} (מוגסד) — יתכן שמדובר בתאומים [כשף עמ׳ 191]`);
  }

  // 6. טיב/איכות הילד — בית 6 (בריאות) ובית 8 (אריכות ימים) (Kashf p.194)
  if (h6) {
    if (isMalefic(h6)) {
      lines.push(`בריאות הילד בילדות: בית 6 מזיק (${h6.hebrew || h6.key}) — מחלות רבות בגיל הרך [כשף עמ׳ 194]`);
    } else if (isBenefic(h6)) {
      lines.push(`בריאות הילד: בית 6 מיטיב (${h6.hebrew || h6.key}) — בריאות טובה [כשף עמ׳ 194]`);
    }
  }
  if (h8) {
    if (isMalefic(h8)) {
      lines.push(`אריכות ימים: בית 8 מזיק (${h8.hebrew || h8.key}) — מעט תקווה [כשף עמ׳ 194]`);
    } else if (isBenefic(h8)) {
      lines.push(`אריכות ימים: בית 8 מיטיב (${h8.hebrew || h8.key}) — ככל שיגדל מצבו ישתפר [כשף עמ׳ 194]`);
    }
  }

  // 7. מזל הילד — בית 5+16 (Kashf p.194)
  if (h16) {
    const b5g = isBenefic(h5),  b5b = isMalefic(h5);
    const b16g = isBenefic(h16), b16b = isMalefic(h16);
    if (b5g && b16g) {
      lines.push(`מזל הילד (בית 5+16 שניהם מיטיב): אושר, מצב טוב, עושר [כשף עמ׳ 194]`);
    } else if (b5b && b16b) {
      lines.push(`מזל הילד (בית 5+16 שניהם מזיק): מצב ירוד [כשף עמ׳ 194]`);
    } else {
      lines.push(`מזל הילד (בית 5+16 מעורב): מצב בינוני [כשף עמ׳ 194]`);
    }
  }

  // 8. כמה חודשים עברו (Kashf p.192)
  // "انظر الشكل الحال في الميزان ، فهو عدد شهورها"
  // Count dots in house 15 (mizzan = judge)
  if (h15) {
    const dots = (h15.key || '').split('').reduce((s, c) => s + (c === '2' ? 2 : 1), 0);
    lines.push(`חודשי הריון (לפי בית 15 מיזאן — ${h15.hebrew || h15.key}): כ-${dots} חודשים [כשף עמ׳ 192]`);
  }

  return {
    outputHebrew: `— אבחון ילד/הריון (כשף פרק 5) —\n${lines.join('\n')}`,
    details: lines,
    pregnancyReal,
  };
}

// ── הלוואה לפי כשף אל-אסרר פרק 8 (עמ' 233-234) ─────────────────────────────
// "أنشيء من الأول والسابع شكلا, ومن الثاني والثامن شكلا, وأنشيء من الشكلين شكلا"
export function computeLoanKashfAnalysis(chart) {
  if (!Array.isArray(chart) || chart.length < 16) return null;

  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h1 = getH(1);
  const h2 = getH(2);
  const h7 = getH(7);
  const h8 = getH(8);
  if (!h1 || !h2 || !h7 || !h8) return null;

  const deriveFigure = (p1, p2) => {
    if (!p1 || !p2 || p1.length !== 4 || p2.length !== 4) return null;
    return p1.split('').map((c, i) => c === p2[i] ? '2' : '1').join('');
  };

  const isBenefic = (pattern) => {
    if (!pattern) return false;
    // Benefic figures: tariq(1111), naqi-khad(1211), ijtima(2112), nusra-dakhila(2211), nusra-kharija(1122), bayad(2212)
    // Malefic: humra(2122), nakis(2221), qabd-kharij(1212), nusra-dakhila(2211) is mixed
    // Using the standard fortune table from the system
    const FIGURE_FORTUNE = {
      '1111': 'מיטיב', '1112': 'מזיק', '1121': 'ממוזג', '1122': 'מיטיב',
      '1211': 'מיטיב', '1212': 'מזיק', '1221': 'מזיק', '1222': 'ממוזג',
      '2111': 'ממוזג', '2112': 'מיטיב', '2121': 'מיטיב', '2122': 'מזיק',
      '2211': 'ממוזג-מזיק', '2212': 'מיטיב', '2221': 'מזיק', '2222': 'ממוזג',
    };
    const f = FIGURE_FORTUNE[pattern] || '';
    return f.includes('מיטיב') && !f.startsWith('ממוזג-מזיק');
  };

  const figHebrew = {
    '1111':'דרך','1112':'סף יוצא','1121':'נלחם','1122':'כבוד יוצא',
    '1211':'בר הלחי','1212':'ממון יוצא','1221':'סוהר','1222':'נשוא ראש',
    '2111':'סף נכנס','2112':'חיבור','2121':'ממון נכנס','2122':'אדום',
    '2211':'כבוד נכנס','2212':'לבן','2221':'שפל ראש','2222':'קהלה',
  };

  const figA = deriveFigure(h1.key, h7.key);
  const figB = deriveFigure(h2.key, h8.key);
  const figFinal = (figA && figB) ? deriveFigure(figA, figB) : null;
  const figVerify = deriveFigure(h7.key, h8.key);

  const lines = [];

  lines.push(`בית 1 (${figHebrew[h1.key] || h1.key}) + בית 7 (${figHebrew[h7.key] || h7.key}) → ${figA ? (figHebrew[figA] || figA) : '—'}`);
  lines.push(`בית 2 (${figHebrew[h2.key] || h2.key}) + בית 8 (${figHebrew[h8.key] || h8.key}) → ${figB ? (figHebrew[figB] || figB) : '—'}`);

  let mainVerdict = '';
  if (figFinal) {
    const benefic = isBenefic(figFinal);
    mainVerdict = benefic
      ? `צורה משולבת: ${figHebrew[figFinal] || figFinal} (מיטיב) — הלווה ישיב את ההלוואה`
      : `צורה משולבת: ${figHebrew[figFinal] || figFinal} (מזיק) — יתקשה להחזיר את ההלוואה`;
    lines.push(mainVerdict);
  }

  let verifyVerdict = '';
  if (figVerify) {
    const benefic = isBenefic(figVerify);
    verifyVerdict = benefic
      ? `אימות (ב7+ב8 → ${figHebrew[figVerify] || figVerify}): ייתן — ההלוואה תתממש [כשף עמ׳ 234]`
      : `אימות (ב7+ב8 → ${figHebrew[figVerify] || figVerify}): לא ייתן — ההלוואה בספק [כשף עמ׳ 234]`;
    lines.push(verifyVerdict);
  }

  return {
    figA, figB, figFinal, figVerify,
    willRepay: figFinal ? isBenefic(figFinal) : null,
    willGive: figVerify ? isBenefic(figVerify) : null,
    outputHebrew: `— ניתוח הלוואה (כשף פרק 8, עמ׳ 233-234) —\n${lines.join('\n')}`,
    details: lines,
  };
}

// ── דת ואמונה לפי כשף אל-אסרר (עמ' 253) ─────────────────────────────────────
// "إن كان في الثالث والتاسع شكل نحس, فهو قليل الدين; وإن كان سعد, فهو ذوا دين"
export function computeReligionKashfAnalysis(chart) {
  if (!Array.isArray(chart) || chart.length < 16) return null;

  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h3 = getH(3);
  const h9 = getH(9);
  if (!h3 || !h9) return null;

  const isBenefic = (h) => {
    if (!h) return false;
    const f = String(h.fortune || '');
    return f.includes('מיטיב') && !f.startsWith('ממוזג-מזיק');
  };
  const isMalefic = (h) => !!h && String(h.fortune || '').includes('מזיק');

  const h3Benefic = isBenefic(h3);
  const h9Benefic = isBenefic(h9);
  const h3Malefic = isMalefic(h3);
  const h9Malefic = isMalefic(h9);

  const lines = [];
  lines.push(`בית 3 (${h3.hebrew || h3.key}): ${h3.fortune || '—'}`);
  lines.push(`בית 9 (${h9.hebrew || h9.key}): ${h9.fortune || '—'}`);

  let verdict = '';
  const bothBenefic = h3Benefic && h9Benefic;
  const bothMalefic = h3Malefic && h9Malefic;
  const anyMalefic  = h3Malefic || h9Malefic;
  const anyBenefic  = h3Benefic || h9Benefic;

  if (bothBenefic) {
    verdict = 'בעל דת ויירא את האלוהים — אמונה חזקה [כשף עמ׳ 253]';
  } else if (bothMalefic) {
    verdict = 'מעט דת — חסר אמונה בסיסית [כשף עמ׳ 253]';
  } else if (anyBenefic && !anyMalefic) {
    verdict = 'אמונה ממוזגת — יש יסוד דתי אך אינו שלם [כשף עמ׳ 253]';
  } else {
    verdict = 'מצב אמונה בינוני — מיטיב ומזיק מעורבים [כשף עמ׳ 253]';
  }
  lines.push(verdict);

  return {
    h3Benefic, h9Benefic, h3Malefic, h9Malefic,
    hasFaith: bothBenefic || (anyBenefic && !anyMalefic),
    outputHebrew: `— ניתוח דת ואמונה (כשף עמ׳ 253) —\n${lines.join('\n')}`,
    details: lines,
    verdict,
  };
}

// ── דיני האם לפי כשף אל-אסרר פרק 10 (עמ' 257) ───────────────────────────────
// "وأما حكم الأم: فإن كان نحس → شر; سعد → خير; البياض/الطريق في الأوتاد → خير وصلاح; السواقط → نكبات"
export function computeMotherRulesKashfAnalysis(chart) {
  if (!Array.isArray(chart) || chart.length < 16) return null;

  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h10 = getH(10);
  if (!h10) return null;

  const isBenefic = (h) => {
    if (!h) return false;
    const f = String(h.fortune || '');
    return f.includes('מיטיב') && !f.startsWith('ממוזג-מזיק');
  };
  const isMalefic = (h) => !!h && String(h.fortune || '').includes('מזיק');

  // Pillar houses (אותאד): 1, 4, 7, 10
  const PILLAR_HOUSES  = [1, 4, 7, 10];
  // Falling/cadent houses (שואקט): 3, 6, 9, 12
  const FALLING_HOUSES = [3, 6, 9, 12];
  // Benefic Venus/Moon figures in RAML: bayad(2212/לבן), tariq(1111/דרך)
  const SPECIAL_FIGS = new Set(['2212', '1111']);

  const figHebrew = { '2212': 'לבן', '1111': 'דרך' };

  const lines = [];
  lines.push(`בית 10 (${h10.hebrew || h10.key}): ${h10.fortune || '—'}`);

  // Primary verdict from h10
  let primaryVerdict = '';
  if (isMalefic(h10)) {
    primaryVerdict = 'מזיק בבית האם → רע לה [כשף עמ׳ 257]';
  } else if (isBenefic(h10)) {
    primaryVerdict = 'מיטיב בבית האם → טוב לה [כשף עמ׳ 257]';
  } else {
    primaryVerdict = 'בית האם ממוזג → מצב בינוני [כשף עמ׳ 257]';
  }
  lines.push(primaryVerdict);

  // Check for bayad/tariq in pillars or falling houses
  const specialInPillar  = [];
  const specialInFalling = [];

  for (const hNum of PILLAR_HOUSES) {
    const h = getH(hNum);
    if (h && SPECIAL_FIGS.has(h.key)) {
      specialInPillar.push(`בית ${hNum} (${figHebrew[h.key]})`);
    }
  }
  for (const hNum of FALLING_HOUSES) {
    const h = getH(hNum);
    if (h && SPECIAL_FIGS.has(h.key)) {
      specialInFalling.push(`בית ${hNum} (${figHebrew[h.key]})`);
    }
  }

  if (specialInPillar.length > 0) {
    lines.push(`לבן/דרך בעמוד (${specialInPillar.join(', ')}) → טוב ויושר לאם [כשף עמ׳ 257]`);
  }
  if (specialInFalling.length > 0) {
    lines.push(`לבן/דרך בשואקט (${specialInFalling.join(', ')}) → נכבות לאם [כשף עמ׳ 257]`);
  }

  const isGoodForMother = isBenefic(h10) || specialInPillar.length > 0;
  const isBadForMother  = isMalefic(h10) || specialInFalling.length > 0;

  return {
    h10Benefic: isBenefic(h10),
    h10Malefic: isMalefic(h10),
    specialInPillar,
    specialInFalling,
    isGoodForMother,
    isBadForMother,
    outputHebrew: `— דיני האם (כשף פרק 10, עמ׳ 257) —\n${lines.join('\n')}`,
    details: lines,
    primaryVerdict,
  };
}

// ── קבוצה 2e: עיתוי — שיטת המדד/האדד (כשף אל-אסרר) ─────────────────────────
// computeTimingByMadad היה חשוף כפתור "⏱ עיתוי" נפרד במסך חאווי — הוסר משם
// (goral-app.js, goral-hachol.html). מקבילה בכשף תיבנה בשלב 3.

// ── שיטת האדד המלאה (Task 9) ─────────────────────────────────────────────────
// מקור: כשף אל-אסראר — ספירת נקודות הצורה לחישוב מדויק של זמן
// כל שורה '1' = נקודה אחת; כל שורה '2' = שתי נקודות
// אמהות (ב1–4) = ימים | בנות (ב5–8) = שבועות | נכדות (ב9–12) = חודשים | עדים/דיין (ב13–16) = שנים
export function countFigureDots(pattern) {
  if (!pattern || pattern.length < 4) return 0;
  return pattern.split('').reduce((sum, ch) => sum + (ch === '2' ? 2 : 1), 0);
}

// ── שיטת המדד — כשף אל-אסרר עמ' 119 ──────────────────────────────────────
// "ספור את ארבע האמהות, זוג ופרד. הורד ב-(16,16). מה שנשאר — חלק לבתים
//  מהבית הראשון, נקודה לכל בית. היכן שנפסק — זה בית העיתוי."
// הסכמת כל בעלי האמנות: "هذا وجه العمل بهذا العلم وما أجمعوا عليه أهل هذا الفن"

export function countSingleRows(pattern) {
  if (!pattern || pattern.length < 4) return 1;
  const singles = pattern.split('').filter(c => c === '1').length;
  return singles || 2; // all-double figure (jamaa) → 2 as default
}

export function computeTimingByMadad(chart) {
  if (!Array.isArray(chart) || chart.length < 4) return null;

  // שלב 1: ספור נקודות ארבע האמהות (בתים 1–4 בלוח = צורות האמהות)
  const motherPatterns = chart.slice(0, 4).map(h => h.key || '');
  const totalDots = motherPatterns.reduce((sum, pat) => {
    if (!pat || pat.length < 4) return sum;
    return sum + pat.split('').reduce((s, c) => s + (c === '2' ? 2 : 1), 0);
  }, 0);

  // שלב 2: mod 16 (הורד ב-16 שוב ושוב)
  let remainder = totalDots % 16;
  if (remainder === 0) remainder = 16;

  // שלב 3: הבית שנפסקת בו
  const landingHouse = remainder;
  const landingEntry = chart.find(h => Number(h.house) === landingHouse);
  const figPattern   = landingEntry?.key || '';
  const figHebrew    = landingEntry?.hebrew || '—';

  // שלב 4: קבוצת הזמן לפי מיקום הבית
  const n = landingHouse;
  let tier, tierHebrew, unitShort, unitSingle;
  if      (n <= 4)  { tier = 'mothers';   tierHebrew = 'שעות / ימים';      unitShort = 'ימים';    unitSingle = 'יום';     }
  else if (n <= 8)  { tier = 'daughters'; tierHebrew = 'ימים / שבועות';    unitShort = 'שבועות';  unitSingle = 'שבוע';    }
  else if (n <= 12) { tier = 'nieces';    tierHebrew = 'שבועות / חודשים';  unitShort = 'חודשים';  unitSingle = 'חודש';    }
  else              { tier = 'witnesses'; tierHebrew = 'חודשים / שנים';    unitShort = 'שנים';    unitSingle = 'שנה';     }

  // שלב 5: כמות — לפי ספירת שורות יחידות בצורה שנפסקת בה
  const quantity = countSingleRows(figPattern);

  const unitDisplay = quantity === 1 ? unitSingle : unitShort;

  return {
    totalDots,
    remainder,
    landingHouse,
    figHebrew,
    figPattern,
    tier,
    tierHebrew,
    quantity,
    unitShort,
    unitSingle,
    unitDisplay,
    outputHebrew: [
      `סה״כ נקודות 4 האמהות: ${totalDots}`,
      `${totalDots} mod 16 = ${remainder} → הגעה לבית ${landingHouse}`,
      `הצורה בבית ${landingHouse}: ${figHebrew}`,
      `קבוצת הזמן: ${tierHebrew}`,
      `תוצאה: ${quantity} ${unitDisplay}`,
    ].join('\n'),
    sourceRef: 'כשף אל-אסרר עמ׳ 119 — שיטת המדד',
  };
}

export function getTimingUnit(houseNumber) {
  const n = Number(houseNumber);
  if (n >= 1  && n <= 4)  return { unit: 'ימים',    unitSingle: 'יום',    tier: 'mothers',       tierHebrew: 'אמהות (מהיר — ימים)' };
  if (n >= 5  && n <= 8)  return { unit: 'שבועות',  unitSingle: 'שבוע',   tier: 'daughters',     tierHebrew: 'בנות (בינוני — שבועות)' };
  if (n >= 9  && n <= 12) return { unit: 'חודשים',  unitSingle: 'חודש',   tier: 'granddaughters',tierHebrew: 'נכדות (ממושך — חודשים)' };
  return                         { unit: 'שנים',     unitSingle: 'שנה',    tier: 'witnesses',     tierHebrew: 'עדים/דיין (ארוך — שנים)' };
}

export function computeTimingEstimate(chart, dhamirHouse, topicId) {
  if (!dhamirHouse || !Array.isArray(chart)) return null;

  const dh = Number(dhamirHouse.houseNumber || dhamirHouse.house);
  const dhamirEntry = chart.find((h) => Number(h.house) === dh);
  if (!dhamirEntry) return null;

  const pattern = dhamirEntry.key || dhamirEntry.pattern || '';
  const dotCount = countFigureDots(pattern);
  const { unit, unitSingle, tier, tierHebrew } = getTimingUnit(dh);
  const quantity = dotCount === 1 ? `${dotCount} ${unitSingle}` : `${dotCount} ${unit}`;

  return {
    dhamirHouse: dh,
    dhamirFigure: dhamirEntry.hebrew || dhamirEntry.key,
    pattern,
    dotCount,
    quantity,
    unit,
    tier,
    timingUnits: tierHebrew,
    outputHebrew: `עיתוי (האדד): מחשבת השואל בבית ${dh} (${dhamirEntry.hebrew || dhamirEntry.key}, ${dotCount} נקודות) → ${quantity}. סקאלה: ${tierHebrew}`,
    sourceRef: 'כשף אל-אסראר — שיטת האדד: ספירת נקודות הצורה × עמדת הבית = תזמון',
  };
}

// ── קבוצה 2f: עדות בתים 13-14 ושילוב צורה×בית (כשף אל-אסרר) ────────────────

// ── עדות ספציפית של בתים 13–14 (Task 6) ─────────────────────────────────────
// מקור: כשף אל-אסראר — בית 13 מעיד על בית 1 ו-9; בית 14 מעיד על בית 5, 6 ו-11
const WITNESS_13_HOUSES = [1, 9];
const WITNESS_14_HOUSES = [5, 6, 11];

const HOUSE_TOPIC_LABELS = {
  1:  'השואל',
  5:  'ילדים',
  6:  'מחלה / משרתים',
  9:  'מזל / נסיעה / דת',
  11: 'חברים / תקוות',
};

export function describeWitnessEffect(witnessHouse, targetHouseNumbers, chartHouses) {
  if (!witnessHouse) return null;
  const tone = getFigureFortuneTone(witnessHouse);

  const targetSummaries = targetHouseNumbers.map((n) => {
    const h = (chartHouses || []).find((ch) => Number(ch.house) === n);
    const label = HOUSE_TOPIC_LABELS[n] || `בית ${n}`;
    const figName = h?.hebrew || h?.figureHebrew || '';
    const figFort = h?.fortune || '';
    const targetTone = h ? getFigureFortuneTone({ fortune: figFort }) : 0;

    let effect;
    if (tone > 0 && targetTone > 0) {
      effect = 'מחזק לטובה';
    } else if (tone > 0 && targetTone < 0) {
      effect = 'מנסה להקל — אך הצורה עצמה שלילית';
    } else if (tone < 0 && targetTone > 0) {
      effect = 'מחליש — עד שלילי על בית חיובי';
    } else if (tone < 0 && targetTone < 0) {
      effect = 'מחזק לרעה';
    } else {
      effect = 'ממוזג';
    }
    return `בית ${n} (${label}${figName ? ` — ${figName}` : ''}): ${effect}`;
  });

  const toneWord = tone > 0 ? 'מיטיב' : tone < 0 ? 'מזיק' : 'ממוזג';
  return {
    witnessHouseNum: Number(witnessHouse.house),
    witnessPattern: witnessHouse.key,
    witnessFortune: toneWord,
    targetHouses: targetHouseNumbers,
    targetSummaries,
    hebrewSummary: targetSummaries.join('; '),
  };
}

// ── שילוב צורה × בית (Task 7) ────────────────────────────────────────────────
// מקור: כשף אל-אסראר — מזל הצורה + טבע הבית = הכרעת הקריאה
export function computeFigureHouseInteraction(figureTone, houseFortuneTone) {
  const f = figureTone > 0 ? 'saad' : figureTone < 0 ? 'nahs' : 'mixed';
  const h = houseFortuneTone > 0 ? 'good' : houseFortuneTone < 0 ? 'bad' : 'neutral';

  if (f === 'saad' && h === 'good')    return { code: 'reinforced-good',   hebrewLabel: 'מחוזקת',           note: 'צורה טובה בבית טוב — הכוח הטוב מחוזק' };
  if (f === 'saad' && h === 'bad')     return { code: 'mixed-good-in-bad', hebrewLabel: 'מעורבת',            note: 'צורה טובה בבית קשה — הכוח הטוב מוחלש' };
  if (f === 'nahs' && h === 'bad')     return { code: 'reinforced-bad',    hebrewLabel: 'מחוזקת לרעה',      note: 'צורה רעה בבית קשה — הקושי מחוזק' };
  if (f === 'nahs' && h === 'good')    return { code: 'weakened-bad',      hebrewLabel: 'מחלישה',           note: 'צורה רעה בבית טוב — מחלישה את הבית הטוב' };
  if (f === 'saad' && h === 'neutral') return { code: 'neutral-good',      hebrewLabel: 'ניטרלי-חיובי',     note: 'צורה טובה בבית ניטרלי' };
  if (f === 'nahs' && h === 'neutral') return { code: 'neutral-bad',       hebrewLabel: 'ניטרלי-שלילי',     note: 'צורה רעה בבית ניטרלי' };
  return { code: 'mixed',              hebrewLabel: 'ממוזג',               note: 'צורה ממוזגת — הכיוון תלוי בעדים' };
}

export function computeWitnessTestimony(witness13, witness14, chartHouses) {
  return {
    w13: witness13 ? describeWitnessEffect(witness13, WITNESS_13_HOUSES, chartHouses) : null,
    w14: witness14 ? describeWitnessEffect(witness14, WITNESS_14_HOUSES, chartHouses) : null,
    sourceRef: 'כשף אל-אסראר — בית 13 מעיד על בית 1 ו-9; בית 14 מעיד על בית 5, 6 ו-11',
  };
}

// ── computeDreamH9 — חלום (כשף עמ' 254) ──────────────────────────────────
export function computeDreamH9(chart) {
  if (!Array.isArray(chart) || chart.length < 16) return null;
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h9 = getH(9);
  if (!h9?.key) return null;
  const h9Hebrew = h9.hebrew || FIGURE_HEBREW_G[h9.key] || h9.key;
  const h9Fortune = h9.fortune || getDerivedFortune(h9.key) || '';
  let dreamTone = 0;
  let dreamDesc = '';
  if (isBeneficG(h9)) {
    dreamTone = 1;
    dreamDesc = `בית 9 מיטיב (${h9Hebrew}) — החלום מורה על טוב`;
  } else if (isMaleficG(h9)) {
    dreamTone = -1;
    dreamDesc = `בית 9 מזיק (${h9Hebrew}) — החלום מורה על קושי`;
  } else {
    dreamTone = 0;
    dreamDesc = `בית 9 ממוזג (${h9Hebrew}) — החלום מעורב, בדוק את פרטיו`;
  }
  const movementNote = h9.movement ? ` | כיוון: ${h9.movement}` : '';
  return {
    h9Key: h9.key,
    h9Hebrew,
    h9Fortune,
    dreamTone,
    outputHebrew: `${dreamDesc}${movementNote} [כשף עמ׳ 254]`,
  };
}

// ── computeLostAnimalReturn — האם הבהמה תחזור (כשף עמ' 202) ───────────────
export function computeLostAnimalReturn(chart) {
  if (!Array.isArray(chart) || chart.length < 16) return null;
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h6 = getH(6);
  const h8 = getH(8);
  if (!h6 || !h8) return null;
  const h6Ben = isBeneficG(h6);
  const h6In  = isIncomingG(h6);
  const h8Ben = isBeneficG(h8);
  const h8In  = isIncomingG(h8);
  const h6Hebrew = h6.hebrew || FIGURE_HEBREW_G[h6.key] || h6.key;
  const h8Hebrew = h8.hebrew || FIGURE_HEBREW_G[h8.key] || h8.key;
  let returned = false;
  let partial = false;
  let desc = '';
  if (h6Ben && h6In && h8Ben && h8In) {
    returned = true;
    desc = `בית 6 ובית 8 שניהם מיטיב-נכנסים (${h6Hebrew} / ${h8Hebrew}) — הבהמה חזרה [כשף עמ׳ 202]`;
  } else if (h6Ben && h6In) {
    partial = true;
    desc = `בית 6 מיטיב-נכנס (${h6Hebrew}), בית 8 לא עומד בתנאי — יש סיכוי לחזרה, אך לא ודאי [כשף עמ׳ 202]`;
  } else {
    desc = `בית 6 (${h6Hebrew}) ובית 8 (${h8Hebrew}) — הבהמה לא תחזור [כשף עמ׳ 202]`;
  }
  return {
    h6Key: h6.key,
    h8Key: h8.key,
    returned: returned ? true : partial ? 'partial' : false,
    outputHebrew: desc,
  };
}

// ── computeAnimalTypeByH6 — סוג הבהמה לפי בית 6 (כשף עמ' 201) ─────────────
const ANIMAL_BY_H6_KEY = {
  '2122': 'כבשים / אילים',
  '1121': 'שוורים',
  '1122': 'סוסים',
  '1112': 'סוסים',
  '1221': 'גמלים',
  '2221': 'חמורים',
  '1212': 'פרדות',
};
export function computeAnimalTypeByH6(chart) {
  if (!Array.isArray(chart) || chart.length < 16) return null;
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h6 = getH(6);
  if (!h6?.key) return null;
  const h6Hebrew = h6.hebrew || FIGURE_HEBREW_G[h6.key] || h6.key;
  const animalType = ANIMAL_BY_H6_KEY[h6.key] || null;
  if (!animalType) {
    return {
      h6Key: h6.key,
      h6Hebrew,
      animalType: null,
      outputHebrew: `${h6Hebrew} בבית 6 — סוג הבהמה: לא מפורש במקור עבור צורה זו [כשף עמ׳ 201]`,
    };
  }
  return {
    h6Key: h6.key,
    h6Hebrew,
    animalType,
    outputHebrew: `${h6Hebrew} בבית 6 → סוג הבהמה: ${animalType} [כשף עמ׳ 201]`,
  };
}

// ── computeKingRulerStatus — מלך/שליט (כשף עמ' 257) ──────────────────────
export function computeKingRulerStatus(chart) {
  if (!Array.isArray(chart) || chart.length < 16) return null;
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h4  = getH(4);
  const h7  = getH(7);
  const h10 = getH(10);
  const h15 = getH(15);
  if (!h7?.key || !h10?.key) return null;
  const derivedPattern = deriveFigureG(h7.key, h10.key);
  const derivedFortune = derivedPattern ? getDerivedFortune(derivedPattern) : null;
  const tone = derivedPattern ? getDerivedFortuneTone(derivedPattern) : 0;
  const h7Hebrew  = h7.hebrew  || FIGURE_HEBREW_G[h7.key]  || h7.key;
  const h10Hebrew = h10.hebrew || FIGURE_HEBREW_G[h10.key] || h10.key;
  const derivedHebrew = derivedPattern ? (FIGURE_HEBREW_G[derivedPattern] || derivedPattern) : '—';
  const lines = [];
  if (derivedPattern) {
    const toneWord = tone > 0 ? 'מיטיב (ג׳ודה) — טוב' : tone < 0 ? 'מזיק (ראדאה) — רע' : 'ממוזג';
    lines.push(`ב7 (${h7Hebrew}) + ב10 (${h10Hebrew}) → ${derivedHebrew} (${derivedPattern}): ${toneWord} [כשף עמ׳ 257]`);
  }
  let h4Risk = null;
  if (h4 && isMaleficG(h4)) {
    h4Risk = `⚠ בית 4 מזיק (${h4.hebrew || FIGURE_HEBREW_G[h4.key] || h4.key}) — יאבד שלטון קרוב [כשף עמ׳ 257]`;
    lines.push(h4Risk);
  }
  let h15DeathRisk = null;
  if (h15 && isMaleficG(h15)) {
    h15DeathRisk = `⚠⚠ בית 15 מזיק (${h15.hebrew || FIGURE_HEBREW_G[h15.key] || h15.key}) — סכנת מוות [כשף עמ׳ 257]`;
    lines.push(h15DeathRisk);
  }
  return {
    h7Key: h7.key,
    h10Key: h10.key,
    derivedPattern,
    derivedFortune,
    h4Risk,
    h15DeathRisk,
    outputHebrew: lines.join('\n') || 'לא נמצאו נתונים מספיקים לניתוח מלך/שליט',
  };
}

// ── computeEnemyPresenceCheck — בדיקת אויב (כשף עמ' 271) ─────────────────
export function computeEnemyPresenceCheck(chart) {
  if (!Array.isArray(chart) || chart.length < 16) return null;
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h1  = getH(1);
  const h12 = getH(12);
  if (!h1 || !h12) return null;
  const h1Ben  = isBeneficG(h1);
  const h1Mal  = isMaleficG(h1);
  const h12Ben = isBeneficG(h12);
  const h12Mal = isMaleficG(h12);
  const h1Hebrew  = h1.hebrew  || FIGURE_HEBREW_G[h1.key]  || h1.key;
  const h12Hebrew = h12.hebrew || FIGURE_HEBREW_G[h12.key] || h12.key;
  const h12Movement = h12.movement || '';
  let enemyPresent = false;
  let querentWins = false;
  const lines = [];
  if (h1Ben && h12Ben) {
    lines.push(`בית 1 מיטיב + בית 12 מיטיב — אין אויבים [כשף עמ׳ 271]`);
    enemyPresent = false;
    querentWins = true;
  } else if (h1Mal && h12Mal) {
    lines.push(`בית 1 מזיק + בית 12 מזיק — יש אויבים [כשף עמ׳ 271]`);
    enemyPresent = true;
    querentWins = false;
  } else if (h1Ben && h12Mal) {
    lines.push(`בית 1 מיטיב + בית 12 מזיק — הוא ינצח את אויביו [כשף עמ׳ 271]`);
    enemyPresent = true;
    querentWins = true;
  } else if (h1Mal && h12Ben) {
    lines.push(`בית 1 מזיק + בית 12 מיטיב — האויב ינצח אותו [כשף עמ׳ 271]`);
    enemyPresent = true;
    querentWins = false;
  } else {
    lines.push(`בית 1 (${h1Hebrew}) + בית 12 (${h12Hebrew}) — מצב מעורב [כשף עמ׳ 271]`);
  }
  if (h12Movement === 'קבוע') {
    lines.push(`בית 12 קבוע (ת׳אבת) — אויביו מתמידים ועקשנים [כשף עמ׳ 271]`);
  } else if (h12Movement && h12Movement !== 'קבוע') {
    lines.push(`בית 12 ${h12Movement} — פעם אויב, פעם מתפייס [כשף עמ׳ 271]`);
  }
  return {
    h1Fortune: h1.fortune || '',
    h12Fortune: h12.fortune || '',
    h12Movement,
    enemyPresent,
    querentWins,
    outputHebrew: lines.join('\n'),
  };
}

// ── computePrisonerReleaseCheck — שחרור אסיר (כשף עמ' 272) ───────────────
export function computePrisonerReleaseCheck(chart) {
  if (!Array.isArray(chart) || chart.length < 16) return null;
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h1  = getH(1);
  const h4  = getH(4);
  const h12 = getH(12);
  if (!h1 || !h4) return null;
  const CHECK_HOUSES = [2, 3, 5, 9, 10];
  const maleficCount = CHECK_HOUSES.filter((n) => {
    const h = getH(n);
    return h && isMaleficG(h);
  }).length;
  const derivedPattern = deriveFigureG(h1.key, h4.key);
  const derivedFortune = derivedPattern ? getDerivedFortune(derivedPattern) : null;
  const derivedTone = derivedPattern ? getDerivedFortuneTone(derivedPattern) : 0;
  const h1Hebrew = h1.hebrew || FIGURE_HEBREW_G[h1.key] || h1.key;
  const h4Hebrew = h4.hebrew || FIGURE_HEBREW_G[h4.key] || h4.key;
  const derivedHebrew = derivedPattern ? (FIGURE_HEBREW_G[derivedPattern] || derivedPattern) : '—';
  const lines = [];
  lines.push(`בית 1 (${h1Hebrew}) + בית 4 (${h4Hebrew}) → ${derivedHebrew}: ${derivedFortune || '—'}`);
  let outcome = 'mixed';
  let willRelease = false;
  if (derivedTone > 0) {
    outcome = 'good';
    willRelease = true;
    lines.push(`גורל המחבוס: מיטיב — גורלו טוב [כשף עמ׳ 272]`);
  } else if (derivedTone < 0) {
    outcome = 'bad';
    willRelease = false;
    lines.push(`גורל המחבוס: מזיק — גורלו רע [כשף עמ׳ 272]`);
  } else {
    lines.push(`גורל המחבוס: ממוזג — לא חד-משמעי [כשף עמ׳ 272]`);
  }
  if (maleficCount >= 3) {
    willRelease = false;
    lines.push(`בתים 2/3/5/9/10: ${maleficCount} מזיקים — האסיר יצא ללא רשות שליט [כשף עמ׳ 272]`);
  } else if (maleficCount > 0) {
    lines.push(`בתים 2/3/5/9/10: ${maleficCount} מזיקים — יציאה עם קושי [כשף עמ׳ 272]`);
  } else {
    lines.push(`בתים 2/3/5/9/10: ללא מזיק — שחרור ברשות [כשף עמ׳ 272]`);
    willRelease = true;
  }
  if (h12 && isBeneficG(h12)) {
    lines.push(`בית 12 מיטיב (${h12.hebrew || FIGURE_HEBREW_G[h12.key] || h12.key}) — לאסיר יש תומכים [כשף עמ׳ 272]`);
  } else if (h12 && isMaleficG(h12)) {
    lines.push(`בית 12 מזיק (${h12.hebrew || FIGURE_HEBREW_G[h12.key] || h12.key}) — אין תמיכה לאסיר [כשף עמ׳ 272]`);
  }
  return {
    h1h4Derived: derivedPattern,
    h1h4Fortune: derivedFortune,
    outcome,
    willRelease,
    outputHebrew: lines.join('\n'),
  };
}

// ── computeFatherParentStatus — מצב האב/הנכס (כשף עמ' 184) ───────────────
export function computeFatherParentStatus(chart) {
  if (!Array.isArray(chart) || chart.length < 16) return null;
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h4 = getH(4);
  const h5 = getH(5);
  if (!h4) return null;
  const h4Hebrew = h4.hebrew || FIGURE_HEBREW_G[h4.key] || h4.key;
  const h5Hebrew = h5 ? (h5.hebrew || FIGURE_HEBREW_G[h5.key] || h5.key) : null;
  const h4Ben = isBeneficG(h4);
  const h4Mal = isMaleficG(h4);
  const h5Ben = h5 && isBeneficG(h5);
  const h5Mal = h5 && isMaleficG(h5);
  const lines = [];
  let propertyStatus = 'mixed';
  if (h4Ben) {
    propertyStatus = 'good';
    lines.push(`בית 4 מיטיב (${h4Hebrew}) — יש לו נכס, וייחזיק בנכס [כשף עמ׳ 184]`);
  } else if (h4Mal) {
    propertyStatus = 'bad';
    lines.push(`בית 4 מזיק (${h4Hebrew}) — אין נכס, או שיצא מידו [כשף עמ׳ 184]`);
  } else {
    lines.push(`בית 4 ממוזג (${h4Hebrew}) — מצב הנכס/האב בינוני [כשף עמ׳ 184]`);
  }
  if (h4Mal) {
    lines.push(`האב / הנכס בקושי — עניות [כשף עמ׳ 184]`);
  }
  if (h5Hebrew) {
    if (h5Ben) {
      lines.push(`בית 5 מיטיב (${h5Hebrew}) — יש לו כסף [כשף עמ׳ 184]`);
    } else if (h5Mal) {
      lines.push(`בית 5 מזיק (${h5Hebrew}) — אין לו כסף [כשף עמ׳ 184]`);
    }
  }
  return {
    h4Fortune: h4.fortune || '',
    h5Fortune: h5?.fortune || '',
    propertyStatus,
    outputHebrew: lines.join('\n'),
  };
}

// ── computeParnasaLivelihood — פרנסה ומחיה (כשף עמ' 181-182) ─────────────
export function computeParnasaLivelihood(chart) {
  if (!Array.isArray(chart) || chart.length < 16) return null;
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h2  = getH(2);
  const h9  = getH(9);
  const h10 = getH(10);
  if (!h2 || !h10) return null;
  const h2Hebrew  = h2.hebrew  || FIGURE_HEBREW_G[h2.key]  || h2.key;
  const h9Hebrew  = h9 ? (h9.hebrew  || FIGURE_HEBREW_G[h9.key]  || h9.key) : null;
  const h10Hebrew = h10.hebrew || FIGURE_HEBREW_G[h10.key] || h10.key;
  const derivedPattern = deriveFigureG(h2.key, h10.key);
  const derivedFortune = derivedPattern ? getDerivedFortune(derivedPattern) : null;
  const derivedTone    = derivedPattern ? getDerivedFortuneTone(derivedPattern) : 0;
  const derivedHebrew  = derivedPattern ? (FIGURE_HEBREW_G[derivedPattern] || derivedPattern) : '—';
  const lines = [];
  lines.push(`בית 2 (${h2Hebrew}) + בית 10 (${h10Hebrew}) → ${derivedHebrew}: ${derivedFortune || '—'} [כשף עמ׳ 182]`);
  if (derivedTone > 0) {
    lines.push(`הפרנסה תתקיים [כשף עמ׳ 181]`);
  } else if (derivedTone < 0) {
    lines.push(`הפרנסה לא תתקיים [כשף עמ׳ 181]`);
  } else {
    lines.push(`הפרנסה תתקיים אחרי צרות (ממוזג) [כשף עמ׳ 181]`);
  }
  let alternativeSource = null;
  if (isMaleficG(h2)) {
    const h9Ben  = h9 && isBeneficG(h9);
    const h10Ben = isBeneficG(h10);
    if (h9Ben && h9Hebrew) {
      alternativeSource = `נסיעה (בית 9 מיטיב — ${h9Hebrew})`;
      lines.push(`בית 2 מזיק — בדוק מקורות אחרים: מנסיעה (בית 9 מיטיב) [כשף עמ׳ 181]`);
    } else if (h10Ben) {
      alternativeSource = `סמכות / מלאכה (בית 10 מיטיב — ${h10Hebrew})`;
      lines.push(`בית 2 מזיק — בדוק מקורות אחרים: משלטון/מלאכה (בית 10) [כשף עמ׳ 181]`);
    } else {
      lines.push(`בית 2 מזיק — קושי כלכלי, חסרי מקור פרנסה ברור [כשף עמ׳ 181]`);
    }
  }
  return {
    h2Fortune: h2.fortune || '',
    h10Fortune: h10.fortune || '',
    derivedPattern,
    derivedFortune,
    alternativeSource,
    outputHebrew: lines.join('\n'),
  };
}

// ── ספירת יסודות לתשובה כן/לא ────────────────────────────────────────────
// מקור: כשף אל-אסראר — רוב זכרי (אש+אוויר) = חיובי; רוב נקבי (מים+עפר) = שלילי
const MASCULINE_ELEMENTS = new Set(['אש', 'אוויר', 'רוח']);
const FEMININE_ELEMENTS  = new Set(['מים', 'עפר']);

export function countElementsForYesNo(board) {
  const entries = board?.entries || [];
  let masculine = 0;
  let feminine  = 0;

  for (const entry of entries) {
    const el = entry.figure?.elementHebrew || '';
    if (MASCULINE_ELEMENTS.has(el)) masculine++;
    else if (FEMININE_ELEMENTS.has(el)) feminine++;
  }

  const total = masculine + feminine;
  let verdict, hebrewShort, hebrewSummary;

  if (masculine > feminine) {
    verdict     = 'positive';
    hebrewShort = 'כן';
    hebrewSummary = `רוב יסודות זכריים (${masculine} זכרי / ${feminine} נקבי מתוך ${total}) — הלוח נוטה לתשובה חיובית.`;
  } else if (feminine > masculine) {
    verdict     = 'negative';
    hebrewShort = 'לא';
    hebrewSummary = `רוב יסודות נקביים (${feminine} נקבי / ${masculine} זכרי מתוך ${total}) — הלוח נוטה לתשובה שלילית.`;
  } else {
    verdict     = 'neutral';
    hebrewShort = 'שוויון';
    hebrewSummary = `שוויון יסודות (${masculine} זכרי / ${feminine} נקבי) — אין הכרעה ביסודות; לסמוך על הדיין.`;
  }

  return { masculine, feminine, total, verdict, hebrewShort, hebrewSummary };
}
