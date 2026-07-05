import {
  routeHawiQuestion,
} from '../data/sources/hawi/hawi-knowledge-router.js';

import {
  HAWI_SOURCE,
} from '../data/sources/hawi/hawi-source.js';

import {
  diagnoseSpiritualInfluence,
  isSpiritualQuestion,
} from './goral-spiritual-diagnostics-engine.js';

import {
  writeHumanGoralConclusion,
  writeShortClientVerdict,
  writeClientReadingHebrew,
} from './goral-conclusion-writer.js';

import {
  HAWI_QUESTION_HIDDEN_TREASURE_EXTRA,
} from '../data/sources/hawi/question-rules/hawi-question-hidden-treasure-extra.js';

import {
  FIGURE_LETTER_EXTRACTION,
} from '../data/sources/hawi/foundations/hawi-figure-letter-extraction.js';

import {
  calculateHazz,
  getHazzStrengthLabel,
} from '../data/sources/kashf-al-asrar/kashf-hazz.js';

import {
  HAWI_FIGURE_NAMES_BY_ID,
} from '../data/sources/kashf-al-asrar/kashf-figure-names.js';

import {
  getHawiAspectsBetweenHouses,
} from '../data/sources/hawi/foundations/hawi-witnesses.js';

export const NATURAL_HOUSE_FIGURES = {
  1:  '1222', // נשוא ראש — כשף עמ' 97 (מושבו בראשון)
  2:  '2222', // קהלה — כשף עמ' 99 (מושבה בשני)
  3:  '1212', // ממון יוצא — כשף עמ' 99 (מושבה בשלישי)
  4:  '1111', // דרך — לא מפורש בכשף; שובץ ברביעי לפי סדר הנותר
  5:  '1121', // נלחם — כשף עמ' 97 (מושבו בחמישי)
  6:  '2112', // חיבור — לא מפורש בכשף; שובץ בשישי (יסוד אוויר תואם)
  7:  '2221', // שפל ראש — כשף עמ' 98 (מושבו בשביעי)
  8:  '2122', // אדום — כשף עמ' 98 (מושבו תשיעי — קונפליקט עם לבן; שובץ בשמיני)
  9:  '2212', // לבן — כשף עמ' 98 (מושבו בתשיעי)
  10: '2211', // כבוד נכנס — כשף עמ' 99 (מושבה בעשירי)
  11: '1122', // כבוד יוצא — כשף עמ' 99 (מושבה באחד-עשר)
  12: '1221', // סוהר — כשף עמ' 99 (מושבו בשנים-עשר)
  13: '1112', // סף יוצא — כשף עמ' 98 (מושבה בשלושה-עשר)
  14: '2111', // סף נכנס — כשף עמ' 97 (מושבה בארבעה-עשר)
  15: '2121', // ממון נכנס — כשף עמ' 99 (מושבה בחמישה-עשר)
  16: '1211', // בר הלחי — כשף עמ' 98 (מושבו בשישה-עשר)
};

const TASKIN_EAST_PATTERNS = [
  '2212', // לבן
  '2111', // סף נכנס
  '1222', // נשוא ראש
  '1121', // נלחם
  '2122', // אדום
  '2221', // שפל ראש
  '1211', // בר הלחי
  '1112', // סף יוצא
  '2211', // כבוד נכנס
  '2112', // חיבור
  '1221', // סוהר
  '1122', // כבוד יוצא
  '2222', // קהלה
  '2121', // ממון נכנס
  '1111', // דרך
  '1212', // ממון יוצא
];

const HOUSE_FORTUNE_TONES = {
  1: 1, 2: -1, 3: 0.5, 4: -1, 5: 1, 6: -0.5,
  7: -1, 8: -0.5, 9: 1, 10: 1, 11: 1, 12: -1,
  13: 1, 14: -0.5, 15: 0, 16: 1,
};

// Houses that represent the OTHER SIDE (opponent/illness/enemy) — fortune is inverted for the questioner
const ADVERSARIAL_HOUSES_BY_TOPIC = {
  disputes:         [7],
  enemies:          [7, 12],
  illness:          [6],
  prisoner:         [12],
  partnership:      [7],
  theft:            [7],
  deathInheritance: [8],
};

const TOPIC_MAIN_HOUSES = {
  travel:           [1, 3, 5, 8, 9, 12],
  missingPerson:    [1, 7, 8, 9, 12],
  childrenPregnancy:[1, 4, 5, 6, 7, 11, 13, 14, 15],
  hiddenTreasure:   [1, 2, 4, 6, 7, 8, 10, 12, 15, 16],
  yearlyForecast:   [1, 10, 15],
  authorityState:   [1, 7, 10, 11, 15],
  birthNativity:    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  spiritualDiagnostics: [1, 6, 8, 9, 12],
  marriage:         [1, 7, 8, 12, 13, 14, 15],
  illness:          [1, 6, 7, 8, 13, 14, 15],
  disputes:         [1, 7, 13, 14, 15],
  enemies:          [1, 7, 9, 12, 13, 14, 15],
  fear:             [1, 4, 12, 13, 14, 15],
  commerce:         [1, 2, 7, 10, 13, 14, 15],
  loveHate:         [1, 5, 7, 11, 13, 14, 15],
  completion:       [1, 5, 9, 13, 14, 15],
  foundations:      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  generalReading:   [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  prisoner:         [1, 6, 10, 12, 15],
  partnership:      [1, 2, 7, 10, 13, 14, 15],
  seaVoyage:        [1, 8, 9, 12, 15],
  theft:            [1, 2, 7, 8, 13, 14, 15],
  siblings:         [1, 3, 7, 13, 14, 15],
  deathInheritance: [1, 7, 8, 2, 13, 14, 15],
  loan:             [1, 2, 7, 8, 13, 14, 15],
  religion:         [1, 3, 9, 13, 14, 15],
  motherRules:      [1, 4, 7, 10, 13, 14, 15],
  lostAnimal:       [1, 6, 7, 8, 13, 14, 15],
};

const TOPIC_HEBREW_TITLES = {
  travel:           'נסיעה',
  missingPerson:    'נעדר / גאיב',
  childrenPregnancy:'ילדים והריון',
  hiddenTreasure:   'מטמון / חבוי',
  yearlyForecast:   'עולה השנה / גשם / יוקר וזול',
  authorityState:   'שלטון / מדינה / בעלי תפקידים',
  birthNativity:    'מולד / נולד',
  spiritualDiagnostics: 'אבחון רוחני',
  marriage:         'נישואין / זוגיות',
  illness:          'חולה / מחלה',
  disputes:         'סכסוך / תביעה',
  enemies:          'אויב / אויבות',
  fear:             'פחד / סכנה',
  commerce:         'מסחר / קנייה ומכירה',
  loveHate:         'אהבה ושנאה',
  completion:       'האם הדבר יצליח / יושלם',
  foundations:      'יסודות גורל החול',
  generalReading:   'פתיחה כללית — מצב האדם',
  prisoner:         'אסיר / כלא / מעצר',
  partnership:      'שותפות / ערבות / קשר עסקי',
  seaVoyage:        'מסע ים / ספינה',
  theft:            'גנבה / חפץ גנוב',
  siblings:         'אחים / שכנים / קרובים',
  deathInheritance: 'מוות / ירושה / פחד גדול',
  loan:             'הלוואה / חוב',
  religion:         'דת / אמונה',
  motherRules:      'דיני האם',
  lostAnimal:       'בהמה / חיה אבודה',
};

const TOPIC_QUESITED_HOUSE = {
  marriage:             7,  // בית בן/בת הזוג
  illness:              6,  // בית המחלה
  disputes:             7,  // בית היריב
  enemies:              7,  // בית האויב
  fear:                12,  // בית הסכנה הנסתרת
  commerce:             2,  // בית הממון
  loveHate:             7,  // בית הצד השני
  missingPerson:        7,  // בית הנעדר
  travel:               9,  // בית המסע
  childrenPregnancy:    5,  // בית הילדים
  hiddenTreasure:       4,  // בית המקום הנסתר
  completion:          15,  // הדיין עצמו
  foundations:         15,
  yearlyForecast:      10,
  authorityState:      10,
  birthNativity:       10,  // בית הגורל / הייעוד
  spiritualDiagnostics: 6,
  prisoner:            12,
  partnership:          7,
  seaVoyage:            9,
  theft:                7,  // בית הגנב (הצד השני)
  siblings:             3,  // בית האחים / השכנים
  deathInheritance:     8,  // בית המוות / הירושה
  loan:                 8,  // בית ההחזרה / ממון נסתר
  religion:             9,  // בית הדת והאמונה
  motherRules:         10,  // בית האם / הסמכות
};

// ── תפקידים ספציפיים של בתים לפי נושא (כשף אל-אסראר שער שישי) ──────────────
// מקור: כשף אל-אסראר, שער שישי + פסקה כוללת עמ' 166
const TOPIC_HOUSE_ROLES = {
  illness:          { 6: 'טבע המחלה', 2: 'הרפואה / הדרך לריפוי', 8: 'פרוגנוזה: מוות או החלמה' },
  marriage:         { 7: 'בן/בת הזוג', 13: 'עד — מצב השואל', 14: 'עד — מצב הזוג' },
  travel:           { 9: 'מצב הנסיעה', 4: 'היעד / הסיום', 12: 'מכשולים / סכנות בדרך' },
  missingPerson:    { 1: 'מצב הנעדר', 4: 'מיקום הנעדר', 12: 'מה מונע את חזרתו' },
  theft:            { 2: 'החפץ הגנוב', 12: 'הגנב / מי גנב', 4: 'מיקום החפץ' },
  authorityState:   { 10: 'השלטון / התפקיד', 1: 'השואל ביחס לשלטון', 11: 'הסיכויים / תקוות' },
  commerce:         { 2: 'הממון / הסחורה', 7: 'הצד השני (קונה/מוכר)', 10: 'הרווח / מוניטין' },
  prisoner:         { 1: 'מצב האסיר', 6: 'האסיר עצמו (בית ו׳)', 10: 'הסמכות המשחררת', 12: 'הכלא / מה מחזיק אותו' },
  childrenPregnancy:{ 5: 'הילד / ההריון', 4: 'מצב האב/הבית', 11: 'תקוות / אם יתממש' },
  hiddenTreasure:   { 4: 'מיקום המטמון (קרקע)', 2: 'שווי המטמון', 12: 'מה מסתיר / מה מונע' },
  enemies:          { 7: 'האויב / מצבו', 12: 'מה שמסתיר האויב', 9: 'תנועת האויב / כוונותיו' },
  disputes:         { 7: 'היריב', 1: 'השואל בסכסוך', 15: 'ההכרעה הסופית' },
  deathInheritance: { 8: 'המוות / הסכנה', 2: 'הירושה / הממון', 1: 'מצב השואל' },
  seaVoyage:        { 9: 'הנסיעה', 8: 'סכנת ים / מוות', 12: 'מכשולים בדרך' },
  fear:             { 12: 'מקור הפחד / הסכנה', 1: 'מצב השואל', 4: 'מה יקרה' },
  loan:             { 1: 'השואל / המלווה', 7: 'הלווה', 8: 'ממון ההלוואה / ההחזרה' },
  religion:         { 3: 'שורש האמונה', 9: 'בית הדת — עומק האמונה' },
  motherRules:      { 10: 'האם (פסיקה)', 1: 'מצב השואל', 4: 'הבית / הביסוס' },
  partnership:      { 1: 'הצד הראשון (השואל)', 7: 'השותף / הצד השני', 2: 'הממון המשותף', 10: 'תוצאת השותפות' },
  loveHate:         { 1: 'השואל', 7: 'האהוב / השנוא', 5: 'הנאה / עומק הקשר', 11: 'תקוות הקשר' },
  completion:       { 1: 'השואל / מי שמבצע', 5: 'מה ייצא / התוצאה', 9: 'מסע / עתיד הדבר' },
  siblings:         { 1: 'השואל', 3: 'האח / השכן', 7: 'הצד שכנגד / מקור הסכסוך' },
};

// כשף עמ' 62: מיפוי יסוד → כיוון גיאוגרפי. שותף בין פונקציות חאווי
// (computeDiggingDirection) לפונקציות אחרות שעדיין לא הופרדו.
export const ELEMENT_DIRECTION = {
  'אש':    'מזרח',
  'עפר':   'דרום',
  'מים':   'צפון',
  'אוויר': 'מערב',
};

export const MALEFIC_FIGURE_PATTERNS = new Set([
  '2122', // אדום — מזיק חזק
  '2221', // שפל ראש — מזיק חזק
  '1212', // ממון יוצא — מזיק
  '2211', // כבוד נכנס — מזיק ממוזג
  '1221', // סוהר — מזיק (כלא)
]);

const ANGULAR_HOUSES_SET = new Set([1, 4, 7, 10]);

const SUN_FIGURE_PATTERNS  = new Set(['1122', '2121']); // כבוד יוצא, ממון נכנס
const MOON_FIGURE_PATTERNS = new Set(['2212', '1111']); // לבן, דרך

const ELEMENT_TRIANGLE_PLANETS = {
  'אש':    ['שמש', 'צדק', 'שבתאי'],
  'עפר':   ['נוגה', 'מאדים', 'שבתאי'],
  'אוויר': ['שבתאי', 'כוכב / מרקורי', 'צדק'],
  'מים':   ['נוגה', 'שבתאי', 'מאדים'],
};

function normalizeText(value = '') {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[״"]/g, '')
    .replace(/[׳']/g, '')
    .replace(/\s+/g, ' ');
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function getHouse(board, houseNumber) {
  return asArray(board?.chart).find((h) => Number(h.house) === Number(houseNumber)) || null;
}

function isGoodValue(value = '') {
  const v = normalizeText(value);
  return (
    v.includes('מיטיב') ||
    v.includes('טוב') ||
    v.includes('benefic') ||
    v.includes('saad')
  );
}

function isBadValue(value = '') {
  const v = normalizeText(value);
  return (
    v.includes('מזיק') ||
    v.includes('רע') ||
    v.includes('malefic') ||
    v.includes('nahs')
  );
}
export function getFigureFortuneTone(house) {
  if (!house) return 0;
  const fortune = String(house.fortune || house.fortuneHebrew || '');
  if (!fortune) return 0;
  if (fortune === 'מיטיב') return 1;
  if (fortune === 'מזיק') return -1;
  if (fortune.startsWith('ממוזג') && fortune.includes('מיטיב')) return 0.5;
  if (fortune.startsWith('ממוזג') && fortune.includes('מזיק')) return -0.5;
  if (fortune.startsWith('ממוזג')) return 0;
  if (isGoodValue(fortune)) return 1;
  if (isBadValue(fortune)) return -1;
  return 0;
}

function getFigureStateHouseTone(figureState) {
  if (!figureState?.fortuneState) return null;
  const fs = figureState.fortuneState;
  if (fs.startsWith('benefic')) return 1;
  if (fs.startsWith('malefic')) return -1;
  return null;
}

function getSpeakingStateMultiplier(figureState) {
  if (figureState?.speakingState === 'silent') return 0.6;
  return 1;
}

function getSpeakingStateHebrew(figureState) {
  if (!figureState?.speakingState) return null;
  return figureState.speakingState === 'silent' ? 'שותק' : 'מדבר';
}

function getHouseFortuneTone(houseNumber) {
  return HOUSE_FORTUNE_TONES[Number(houseNumber)] ?? 0;
}

function getHousePositionHebrew(houseNumber) {
  const n = Number(houseNumber);
  if ([1, 4, 7, 10].includes(n)) return 'יתד';
  if ([3, 6, 9, 12].includes(n)) return 'שוקע';
  if ([2, 5, 8, 11].includes(n)) return 'נוטה';
  return null;
}

export function getFigureDirection(pattern) {
  if (!pattern || pattern.length < 2) return null;
  const p = pattern[0] + pattern[1];
  if (p === '21') return 'incoming';
  if (p === '12') return 'outgoing';
  if (p === '22') return 'stable';
  if (p === '11') return 'mutable';
  return null;
}

function getFigureDirectionHebrew(direction) {
  return { incoming: 'נכנס', outgoing: 'יוצא', stable: 'קבוע', mutable: 'מתהפך' }[direction] || null;
}

const TASKIN_ORDER_PATTERNS = [
  '1121','1222','2111','2212','1211','1112','2122','2221',
  '1122','1221','2112','2211','1111','1212','2222','2121',
];

function getSeventhFigure(pattern) {
  if (!pattern) return null;
  const idx = TASKIN_ORDER_PATTERNS.indexOf(pattern);
  if (idx === -1) return null;
  return TASKIN_ORDER_PATTERNS[(idx + 7) % 16];
}

const HOUSE_QUADRANT = (h) => {
  const n = Number(h);
  if (n >= 1  && n <= 4)  return { dir: 'east',  hebrew: 'מזרח'  };
  if (n >= 5  && n <= 8)  return { dir: 'west',  hebrew: 'מערב'  };
  if (n >= 9  && n <= 12) return { dir: 'south', hebrew: 'דרום'  };
  if (n >= 13 && n <= 16) return { dir: 'north', hebrew: 'צפון'  };
  return null;
};

function computeDirectionQuadrant(chart) {
  if (!Array.isArray(chart)) return null;
  const quadrants = { east: [], west: [], south: [], north: [] };
  for (const h of chart) {
    const q = HOUSE_QUADRANT(h.house);
    if (!q) continue;
    const dir = getFigureDirection(h.key);
    quadrants[q.dir].push({
      house: h.house,
      figureHebrew: h.hebrew || h.key,
      fortune: h.fortune || '',
      direction: dir,
      directionHebrew: getFigureDirectionHebrew(dir),
    });
  }
  const summary = Object.entries(quadrants).map(([dir, houses]) => {
    const hebrewDir = { east: 'מזרח', west: 'מערב', south: 'דרום', north: 'צפון' }[dir];
    const incomingBenefic = houses.filter((h) => h.direction === 'incoming' && h.fortune.includes('מיטיב')).length;
    const outgoingMalefic = houses.filter((h) => h.direction === 'outgoing' && h.fortune.includes('מזיק')).length;
    return { dir, hebrewDir, houses, incomingBenefic, outgoingMalefic };
  });
  const dominant = summary.reduce((a, b) => (b.incomingBenefic > a.incomingBenefic ? b : a), summary[0]);
  return { quadrants: summary, dominant, dominantHebrew: dominant?.hebrewDir || null };
}

const DEATH_FIGURE_PATTERNS = new Set(['1112', '1212']); // עתבה יוצאת, קבץ יוצא — "מן הצורות המזיקות ביותר"

function computeLifeDeath(chart) {
  if (!Array.isArray(chart)) return null;
  const h1  = chartHouse(chart, 1);
  const h8  = chartHouse(chart, 8);
  const h9  = chartHouse(chart, 9);
  const h12 = chartHouse(chart, 12);
  const h13 = chartHouse(chart, 13);
  const h14 = chartHouse(chart, 14);

  const isMalefic = (h) => h && MALEFIC_FIGURE_PATTERNS.has(h.key);
  const isBenefic = (h) => h && !MALEFIC_FIGURE_PATTERNS.has(h.key) && h.fortune && h.fortune.includes('מיטיב');
  const isDeathFigure = (h) => h && DEATH_FIGURE_PATTERNS.has(h.key);

  const deathSignals = [];
  const lifeSignals  = [];

  for (const h of [h1, h8, h9, h14]) {
    if (isDeathFigure(h)) {
      deathSignals.push(`${h.hebrew || h.key} (בית ${h.house}) — מן הצורות המזיקיות ביותר, מורה על מוות.`);
    }
  }

  if (isMalefic(h14)) deathSignals.push(`בית 14 מזיק (${h14.key}) — חזרה בבית 14 כמזיק, סימן מוות.`);
  if (isMalefic(h8))  deathSignals.push(`בית 8 מזיק (${h8.key}) — בית המוות במזיק.`);

  if (isMalefic(h1) && isMalefic(h9) && isMalefic(h13)) {
    if (isMalefic(h12) || (h12 && h12.key === h1?.key)) {
      deathSignals.push('בתים 1, 9, 13 כולם מזיקיים וחזרה בבית 12 — לפי חאוי: פסוק מוות.');
    }
  }

  if (isBenefic(h1) && isBenefic(h9)) {
    lifeSignals.push('מיטיבים בבית 1 ובית 9 — בית המוות מוקף בטוב, הנעדר בסכנה אך ניצל.');
  }
  if (!isMalefic(h8)) {
    lifeSignals.push(`בית 8 אינו מזיק (${h8?.key || '?'}) — אין סימן מוות ישיר.`);
  }

  const deathScore  = deathSignals.length;
  const lifeScore   = lifeSignals.length;
  let verdict, hebrewVerdict;

  if (deathScore >= 3) {
    verdict = 'dead';
    hebrewVerdict = 'מוות — שלושה סימנים או יותר מצביעים על מות הנעדר.';
  } else if (deathScore >= 2 && lifeScore === 0) {
    verdict = 'likely-dead';
    hebrewVerdict = 'ספק מוות — שני סימני מוות ללא איזון. יש לבדוק בזהירות.';
  } else if (deathScore >= 1 && lifeScore >= 1) {
    verdict = 'uncertain';
    hebrewVerdict = 'לא מוכרע — יש סימני מוות וגם סימני חיים. הדין תלוי.';
  } else {
    verdict = 'alive';
    hebrewVerdict = 'חי — אין סימני מוות ברורים. הנעדר ככל הנראה חי.';
  }

  return { verdict, hebrewVerdict, deathSignals, lifeSignals, deathScore, lifeScore };
}

const ASPECT_RULES = [
  { id: 'tasdis',   hebrew: 'חיבור-שישה',  offsets: [2, 10] },
  { id: 'tarbi',    hebrew: 'ריבוע',  offsets: [3, 9]  },
  { id: 'tathlith', hebrew: 'משולש',  offsets: [4, 8]  },
  { id: 'muqabala', hebrew: 'מול',    offsets: [6, 13] },
];

function forwardDistance(from, to) {
  return ((to - from + 15) % 16) + 1; // 1‒16
}

function aspectTypeBetween(h1, h2) {
  const d1 = forwardDistance(h1, h2);
  const d2 = forwardDistance(h2, h1);
  for (const rule of ASPECT_RULES) {
    if (rule.offsets.includes(d1) || rule.offsets.includes(d2)) return rule;
  }
  return null;
}

function figureFortuneTone(fortune) {
  if (!fortune) return 0;
  if (fortune.includes('מזיק')) return -1;
  if (fortune.includes('מיטיב')) return 1;
  return 0;
}

function connectionQualityHebrew(figureFortune, houseATone, houseBTone) {
  const fig = figureFortuneTone(figureFortune);
  const houseAvg = (houseATone + houseBTone) / 2;
  if (fig >= 0 && houseAvg >= 0) return 'חיבור טוב — צורה טובה בבתים טובים';
  if (fig < 0 && houseAvg < 0) return 'חיבור רע — צורה רעה בבתים קשים';
  if (fig > 0 && houseAvg < 0) return 'חיבור מסוכן — הבטחה שקרית, שמחה ואז צער';
  if (fig < 0 && houseAvg > 0) return 'חיבור מחליש — קלקול הנושא';
  return 'חיבור ממוזג';
}

function computeIttisalat(chart, focusHouseNumber, mainHouses) {
  if (!Array.isArray(chart)) return null;

  const KEY_HOUSES = Array.from(new Set([1, focusHouseNumber, 13, 14, 15, 16, ...mainHouses]));

  const byFigure = {};
  for (const h of chart) {
    const k = h.key;
    if (!k) continue;
    if (!byFigure[k]) byFigure[k] = [];
    byFigure[k].push(Number(h.house));
  }

  const figureConnections = [];
  for (const [figKey, houses] of Object.entries(byFigure)) {
    const inKey = houses.filter((n) => KEY_HOUSES.includes(n));
    if (inKey.length < 2) continue;
    const sample = chart.find((h) => h.key === figKey);
    const houseATone = getHouseFortuneTone(inKey[0]);
    const houseBTone = getHouseFortuneTone(inKey[1]);
    figureConnections.push({
      figureKey: figKey,
      figureHebrew: sample?.hebrew || figKey,
      figureFortune: sample?.fortune || '',
      houses: inKey,
      quality: connectionQualityHebrew(sample?.fortune || '', houseATone, houseBTone),
    });
  }

  function linkBetween(aNum, bNum) {
    const a = chart.find((h) => Number(h.house) === aNum);
    const b = chart.find((h) => Number(h.house) === bNum);
    if (!a || !b) return null;
    if (a.key === b.key) {
      return {
        type: 'same-figure',
        aspectType: null,
        aspectHebrew: null,
        figureHebrew: a.hebrew || a.key,
        quality: connectionQualityHebrew(a.fortune, getHouseFortuneTone(aNum), getHouseFortuneTone(bNum)),
        hebrewShort: `בית ${aNum}↔${bNum}: אותה צורה (${a.hebrew || a.key})`,
      };
    }
    const aspect = aspectTypeBetween(aNum, bNum);
    if (aspect) {
      return {
        type: 'aspect',
        aspectType: aspect.id,
        aspectHebrew: aspect.hebrew,
        figureHebrew: null,
        quality: null,
        hebrewShort: `בית ${aNum}↔${bNum}: ${aspect.hebrew}`,
      };
    }
    return {
      type: 'none',
      aspectType: null,
      aspectHebrew: null,
      figureHebrew: null,
      quality: null,
      hebrewShort: `בית ${aNum}↔${bNum}: אין חיבור`,
    };
  }

  const questioner_to_focus = focusHouseNumber !== 1 ? linkBetween(1, focusHouseNumber) : null;
  const questioner_to_judge = linkBetween(1, 15);
  // skip focus→judge when focus IS house 1 (would duplicate questioner_to_judge)
  const focus_to_judge = (focusHouseNumber !== 15 && focusHouseNumber !== 1) ? linkBetween(focusHouseNumber, 15) : null;
  const witness_to_witness   = linkBetween(13, 14);

  const isConnected =
    questioner_to_focus?.type === 'same-figure' ||
    questioner_to_focus?.type === 'aspect' ||
    questioner_to_judge?.type === 'same-figure' ||
    questioner_to_judge?.type === 'aspect' ||
    focus_to_judge?.type === 'same-figure' ||
    focus_to_judge?.type === 'aspect';

  const summaryLines = [];
  if (questioner_to_focus) summaryLines.push(questioner_to_focus.hebrewShort);
  if (questioner_to_judge) summaryLines.push(questioner_to_judge.hebrewShort);
  if (focus_to_judge)      summaryLines.push(focus_to_judge.hebrewShort);
  if (witness_to_witness)  summaryLines.push(witness_to_witness.hebrewShort);
  for (const fc of figureConnections) {
    summaryLines.push(`צורה חוזרת: ${fc.figureHebrew} בבתים ${fc.houses.join(', ')} — ${fc.quality}`);
  }

  return {
    figureConnections,
    questioner_to_focus,
    questioner_to_judge,
    focus_to_judge,
    witness_to_witness,
    isConnected,
    summaryLines,
  };
}



const ELEMENT_BODY_MAP = {
  'אש':    'ראש, פנים, רוח — מייצג את השואל עצמו',
  'אוויר': 'צוואר, חזה, ידיים — כוח הדיבור והתקשורת',
  'מים':   'בטן, רחם — חיבורים רגשיים ויחסים',
  'עפר':   'ירכיים, רגליים — יסוד גשמי וממוני',
};

const MOVEMENT_HEBREW_MAP = {
  'מתהפך': 'מתהפך — שינוי ואי-יציבות במצב השואל',
  'קבוע':  'קבוע — יציבות וחוסר שינוי',
  'חיצוני': 'חיצוני — תנועה החוצה, הרפיה',
  'פנימי':  'פנימי — תנועה פנימה, פעילות',
};

const TOPIC_H1_NOTES = {
  illness:          'בית 1 = גוף החולה. האלמנט מצביע על אזור הגוף הפגוע.',
  disputes:         'בית 1 = השואל בדיון. מצבו קובע צד חזק/חלש.',
  marriage:         'בית 1 = הבעל/השואל. יש להשוות עם בית 7 (הצד השני).',
  enemies:          'בית 1 = כוח השואל מול האויב. אם טוב — יכול להתמודד.',
  loveHate:         'בית 1 = מצב השואל הרגשי. בדוק חיבור לבית 11.',
  commerce:         'בית 1 = השואל כסוחר. בדוק מצבו מול בית 2 (ממון).',
  fear:             'בית 1 = השואל. אם הצורה רעה — הפחד מוצדק.',
  missingPerson:    'בית 1 = השואל המחפש. בדוק מול בית 7 (הנעדר).',
  travel:           'בית 1 = הנוסע. צורה טובה = נסיעה מוצלחת.',
  completion:       'בית 1 = השואל שרוצה להשלים. צורה טובה = יש כוח להשלמה.',
  theft:            'בית 1 = הנגנב. בית 7 = הגנב. בית 2 = הרכוש הגנוב. בית 8 = תיאור הגנב.',
  siblings:         'בית 1 = השואל. בית 3 = האח/השכן/הקרוב הנשאל עליו.',
  deathInheritance: 'בית 1 = השואל. בית 8 = המוות/הירושה. בית 7 = הצד השני (יורש/נפטר).',
};

function computeHouse1Analysis(chart, topicId) {
  if (!Array.isArray(chart)) return null;
  const h1 = chart.find((h) => Number(h.house) === 1);
  if (!h1) return null;

  const fortune = h1.fortune || '';
  const element = h1.element || '';
  const movement = h1.movement || '';
  const figureHebrew = h1.hebrew || h1.key || '';

  let fortuneGrade = 0;
  if (fortune.includes('מיטיב')) fortuneGrade = 1;
  else if (fortune.includes('מזיק')) fortuneGrade = -1;

  const fortuneHebrew =
    fortuneGrade > 0  ? `טוב (${fortune}) — השואל במצב טוב`  :
    fortuneGrade < 0  ? `קשה (${fortune}) — השואל נתקל בקושי` :
    `ממוזג (${fortune}) — מצב השואל אינו מוכרע`;

  const elementMeaning = ELEMENT_BODY_MAP[element] || element;
  const movementHebrew = MOVEMENT_HEBREW_MAP[movement] || movement;
  const isNatural = h1.key === NATURAL_HOUSE_FIGURES[1];
  const topicNote = TOPIC_H1_NOTES[topicId] || null;

  const summaryLines = [
    `בית 1 — ${figureHebrew} [${fortune}]: ${fortuneHebrew}`,
    `אלמנט: ${element} — ${elementMeaning}`,
    `תנועה: ${movementHebrew}`,
    isNatural ? 'הצורה הטבעית של הבית — הדין חזק במיוחד' : 'בית יתד (חזק) — מצב הנוכחי של השואל',
  ];
  if (topicNote) summaryLines.push(topicNote);

  return {
    houseNumber: 1,
    figureKey: h1.key,
    figureHebrew,
    fortune,
    fortuneGrade,
    fortuneHebrew,
    element,
    elementMeaning,
    movement,
    movementHebrew,
    isNatural,
    topicNote,
    summaryLines,
  };
}

const TOPIC_KEY_PAIRS = {
  marriage: [
    { houses: [1, 7],  role: 'שואל ↔ בן/בת זוג' },
    { houses: [7, 12], role: 'בן/בת זוג ↔ אבדה/סכנה' },
    { houses: [1, 8],  role: 'שואל ↔ ממון הצד השני' },
  ],
  illness: [
    { houses: [1, 6],  role: 'חולה ↔ מקור המחלה' },
    { houses: [6, 8],  role: 'מחלה ↔ סכנת מוות' },
    { houses: [1, 8],  role: 'חולה ↔ סכנה' },
  ],
  disputes: [
    { houses: [1, 7],  role: 'שואל ↔ יריב' },
    { houses: [1, 10], role: 'שואל ↔ שופט/סמכות' },
    { houses: [7, 10], role: 'יריב ↔ שופט' },
  ],
  enemies: [
    { houses: [1, 7],  role: 'שואל ↔ אויב' },
    { houses: [1, 12], role: 'שואל ↔ סכנה נסתרת' },
    { houses: [7, 12], role: 'אויב ↔ כוח מסתור' },
  ],
  loveHate: [
    { houses: [1, 5],  role: 'שואל ↔ הנאה/יצירה' },
    { houses: [1, 11], role: 'שואל ↔ חברות/קשר' },
    { houses: [5, 11], role: 'הנאה ↔ חברות' },
  ],
  commerce: [
    { houses: [1, 2],  role: 'שואל ↔ ממונו' },
    { houses: [1, 7],  role: 'שואל ↔ שותף/לקוח' },
    { houses: [2, 8],  role: 'ממון שואל ↔ ממון הצד השני' },
  ],
  completion: [
    { houses: [1, 5],  role: 'שואל ↔ מה ייצא' },
    { houses: [1, 9],  role: 'שואל ↔ מסע/עתיד' },
    { houses: [5, 11], role: 'תוצאה ↔ תקווה' },
  ],
  missingPerson: [
    { houses: [1, 7],  role: 'מחפש ↔ נעדר' },
    { houses: [7, 8],  role: 'נעדר ↔ מצבו' },
    { houses: [7, 12], role: 'נעדר ↔ כלא/מסתור' },
  ],
  travel: [
    { houses: [1, 3],  role: 'שואל ↔ דרך הנסיעה' },
    { houses: [3, 9],  role: 'נסיעה ↔ מסע ארוך' },
    { houses: [1, 9],  role: 'שואל ↔ יעד' },
  ],
  fear: [
    { houses: [1, 12], role: 'שואל ↔ פחד נסתר' },
    { houses: [1, 4],  role: 'שואל ↔ שורש הפחד' },
    { houses: [4, 8],  role: 'שורש ↔ סכנה' },
  ],
  childrenPregnancy: [
    { houses: [1, 5],  role: 'שואל ↔ ילדים' },
    { houses: [5, 11], role: 'ילדים ↔ תקווה' },
    { houses: [4, 5],  role: 'בית/עם ↔ ילדים' },
  ],
  hiddenTreasure: [
    { houses: [1, 4],  role: 'שואל ↔ מקום הטמון' },
    { houses: [4, 8],  role: 'אדמה ↔ עומק' },
    { houses: [2, 4],  role: 'ממון ↔ מקום' },
  ],
  yearlyForecast: [
    { houses: [1, 10], role: 'שואל ↔ שנה/ממסד' },
    { houses: [1, 15], role: 'שואל ↔ פסיקה סופית' },
  ],
  authorityState: [
    { houses: [1, 10], role: 'שואל ↔ שלטון/עמדה' },
    { houses: [10, 15], role: 'סמכות ↔ פסיקה' },
  ],
  theft: [
    { houses: [1, 7],  role: 'נגנב ↔ גנב' },
    { houses: [1, 2],  role: 'שואל ↔ ממונו הגנוב' },
    { houses: [7, 8],  role: 'גנב ↔ תיאורו' },
  ],
  siblings: [
    { houses: [1, 3],  role: 'שואל ↔ אח/שכן' },
    { houses: [3, 9],  role: 'קרוב ↔ נסיעה/תנועה' },
  ],
  deathInheritance: [
    { houses: [1, 8],  role: 'שואל ↔ מוות/ירושה' },
    { houses: [7, 8],  role: 'צד שני ↔ הירושה' },
    { houses: [1, 2],  role: 'שואל ↔ ממון הירושה' },
  ],
  loan: [
    { houses: [1, 7],  role: 'מלווה ↔ לווה' },
    { houses: [2, 8],  role: 'ממון שואל ↔ ממון ההחזרה' },
    { houses: [7, 8],  role: 'לווה ↔ מצבו הכלכלי' },
  ],
  religion: [
    { houses: [3, 9],  role: 'שליח ↔ בית הדת' },
    { houses: [1, 9],  role: 'שואל ↔ אמונתו' },
  ],
  motherRules: [
    { houses: [1, 10], role: 'שואל ↔ האם/הסמכות' },
    { houses: [4, 10], role: 'בית ↔ האם' },
    { houses: [10, 15], role: 'האם ↔ פסיקה סופית' },
  ],
};

function computeTopicConnections(chart, topicId) {
  if (!Array.isArray(chart)) return null;
  const pairs = TOPIC_KEY_PAIRS[topicId] || [];
  if (!pairs.length) return null;

  const checks = [];
  for (const pair of pairs) {
    const [aNum, bNum] = pair.houses;
    const a = chart.find((h) => Number(h.house) === aNum);
    const b = chart.find((h) => Number(h.house) === bNum);
    if (!a || !b) continue;

    let connType = 'none';
    let connDetail = null;

    if (a.key === b.key) {
      connType = 'same-figure';
      const figFortune = a.fortune || '';
      const hToneA = HOUSE_FORTUNE_TONES[aNum] ?? 0;
      const hToneB = HOUSE_FORTUNE_TONES[bNum] ?? 0;
      connDetail = connectionQualityHebrew(figFortune, hToneA, hToneB);
    } else {
      const bookAspects = getHawiAspectsBetweenHouses(aNum, bNum);
      if (bookAspects.length > 0) {
        connType = 'aspect';
        connDetail = bookAspects.map((ba) => ba.type).join('+');
      } else {
        const aspect = aspectTypeBetween(aNum, bNum);
        if (aspect) {
          connType = 'aspect';
          connDetail = aspect.hebrew;
        }
      }
    }

    const assessment =
      connType === 'same-figure' ? `אותה צורה (${a.hebrew}) — ${connDetail}` :
      connType === 'aspect'      ? connDetail :
      'אין חיבור';

    const fortuneA = a.fortune || '';
    const fortuneB = b.fortune || '';
    const toneA = fortuneA.includes('מיטיב') ? 1 : fortuneA.includes('מזיק') ? -1 : 0;
    const toneB = fortuneB.includes('מיטיב') ? 1 : fortuneB.includes('מזיק') ? -1 : 0;
    const combinedTone = toneA + toneB;

    checks.push({
      houses: [aNum, bNum],
      role: pair.role,
      connType,
      assessment,
      figureA: { key: a.key, hebrew: a.hebrew, fortune: fortuneA },
      figureB: { key: b.key, hebrew: b.hebrew, fortune: fortuneB },
      combinedTone,
      hebrewShort: `${pair.role} [בית ${aNum}: ${a.hebrew} / בית ${bNum}: ${b.hebrew}] — ${assessment}`,
    });
  }

  return { topicId, topicHebrew: TOPIC_HEBREW_TITLES[topicId] || topicId, checks };
}

function countRowMatches(figA, figB) {
  if (!figA || !figB || figA.length !== 4 || figB.length !== 4) return 0;
  let n = 0;
  for (let i = 0; i < 4; i++) if (figA[i] === figB[i]) n++;
  return n;
}

function getNaturalHouseOf(figurePattern) {
  if (!figurePattern) return null;
  for (const [hNum, pat] of Object.entries(NATURAL_HOUSE_FIGURES)) {
    if (pat === figurePattern) return Number(hNum);
  }
  return null;
}

export function chartHouse(chart, houseNum) {
  return chart.find((h) => Number(h.house) === Number(houseNum)) || null;
}

const PLANETARY_FIGURES = [
  { hebrew: 'שמש',    figures: ['1122', '2121'] },
  { hebrew: 'לבנה',   figures: ['2212', '1111'] },
  { hebrew: 'מאדים',  figures: ['2122', '1211'] },   // כשף עמ' 133: אדום ובר הלחי; נלחם→נוגה
  { hebrew: 'כוכב',   figures: ['2222', '2112'] },   // כשף עמ' 133: קהלה וחיבור (כוכב חמה)
  { hebrew: 'שבתאי',  figures: ['2221', '1221'] },
  { hebrew: 'נוגה',   figures: ['2211', '1121'] },   // כשף עמ' 133: כבוד נכנס ונלחם
  { hebrew: 'צדק',    figures: ['1222', '2111'] },
];

/**
 * computeAsala — כשרות הלוח: האם הלוח תקף לפסיקה?
 *
 * שני כללים מחאוי (PDF docs 33-34, strikeValidityPrinciples + moonValidationRules):
 *   1. צורת הלבנה (לבן 2212 / דרך 1111) חייבת להופיע בלוח — אחרת חוזרים על ההכאה.
 *   2. מחלקת כל אחד מ-7 הכוכבים חייבת להופיע — אחרת אין לסמוך על הלוח.
 */
function computeAsala(chart) {
  if (!Array.isArray(chart)) return null;

  const chartKeys = new Set(chart.map((h) => h.key).filter(Boolean));

  const moonFigures = ['2212', '1111'];
  const hasMoon = moonFigures.some((f) => chartKeys.has(f));
  const moonFigureFound = moonFigures.find((f) => chartKeys.has(f));

  const missingPlanets = PLANETARY_FIGURES
    .filter((p) => !p.figures.some((f) => chartKeys.has(f)))
    .map((p) => p.hebrew);

  const isRadical = hasMoon && missingPlanets.length === 0;
  const isPartiallyRadical = hasMoon && missingPlanets.length > 0;

  let hebrewNote;
  if (!hasMoon) {
    hebrewNote = 'הלוח אינו אצאלי — צורת הלבנה (לבן) אינה מופיעה בלוח. לפי חאוי: יש לחזור על ההכאה ולא לפסוק על לוח זה.';
  } else if (missingPlanets.length > 0) {
    hebrewNote = `הלוח חלקי — הלבנה נוכחת (${moonFigureFound === '2212' ? 'לבן' : 'דרך'}), אך חסרים כוכבים: ${missingPlanets.join(', ')}. לפי חאוי: אפשר לדון אך בזהירות.`;
  } else {
    hebrewNote = `הלוח אצאלי — הלבנה נוכחת (${moonFigureFound === '2212' ? 'לבן' : 'דרך'}) וכל כוכבי המזל מיוצגים.`;
  }

  return {
    isRadical,
    isPartiallyRadical,
    hasMoon,
    moonFigureFound: moonFigureFound || null,
    missingPlanets,
    hebrewNote,
  };
}

/**
 * computeHayula — מניעה (حيلولة): האם יש כוח שחוסם את ההגעה?
 * מחזיר { active, hebrew }.
 */
function computeHayula(chart, quesitedHouseNum, querentFig, quesitedFig, tahasilStatus) {
  if (tahasilStatus === 'none') return { active: false, hebrew: '' };

  const judge = chartHouse(chart, 15);
  const h12   = chartHouse(chart, 12);
  const h8    = chartHouse(chart, 8);
  const reasons = [];

  const judgeIsNahs = judge && judge.fortune && judge.fortune.includes('מזיק');
  if (judgeIsNahs) {
    if (judge.key !== querentFig && judge.key !== quesitedFig) {
      const judgeFortuneLabel = judge.fortune || 'מזיק';
      reasons.push(`הדיין (בית 15: ${judge.hebrew || judge.key}) [${judgeFortuneLabel}] אינו מחובר לצד השואל ולצד הנשאל — הוא חוסם את הפסיקה.`);
    }
  }

  if (h12 && MALEFIC_FIGURE_PATTERNS.has(h12.key)) {
    if (h12.key !== querentFig && h12.key !== quesitedFig) {
      reasons.push(`בית 12 (${h12.hebrew || h12.key}) — סכנה נסתרת של מזיק — מפריעה להגעה.`);
    }
  }

  if (h8 && MALEFIC_FIGURE_PATTERNS.has(h8.key)) {
    if (h8.key !== querentFig && h8.key !== quesitedFig) {
      reasons.push(`בית 8 (${h8.hebrew || h8.key}) — מזיק — מטיל צל של הפסד או סכנה על הדין.`);
    }
  }

  if (!reasons.length) return { active: false, hebrew: '' };

  return {
    active: true,
    hebrew: `מניעה: ${reasons.join(' | ')}`,
  };
}

/**
 * computeTahasil — תחסיל (تحصيل): האם הדבר ייגמר?
 *
 * חמש שיטות לפי סדר עדיפות:
 *   1. ישיר (اتحاد)     — אותה צורה בבית 1 ובבית הנשאל  → חזק מאוד
 *   2. טבעי (جدول)      — הצורה הראשונה שייכת טבעית לבית הנשאל → חזק
 *   3. עדים/דיין (شهادة) — העדים/הדיין מחברים בין שני הצדדים → בינוני-חזק
 *   4. העברה (نقل النور) — צורה ביניים מחברת → בינוני
 *   5. שיתוף שורות       — דרגת קשר חלקי → חלש
 */
function computeTahasil(chart, topicId) {
  if (!Array.isArray(chart)) return null;

  const quesitedHouseNum = TOPIC_QUESITED_HOUSE[topicId] || 15;
  const querentEntry  = chartHouse(chart, 1);
  const quesitedEntry = chartHouse(chart, quesitedHouseNum);

  if (!querentEntry || !quesitedEntry) {
    return {
      tahasilStatus: 'none',
      tahasilStrength: 'none',
      tahasilHebrew: 'לא ניתן לחשב הגעה — חסרים נתונים.',
      hayulaActive: false,
      hayulaHebrew: '',
      quesitedHouseNum,
    };
  }

  const querentFig  = querentEntry.key;
  const quesitedFig = quesitedEntry.key;
  const querentName  = querentEntry.hebrew  || querentFig;
  const quesitedName = quesitedEntry.hebrew || quesitedFig;

  let tahasilStatus   = 'none';
  let tahasilStrength = 'none';
  let tahasilHebrew   = '';

  if (querentFig && querentFig === quesitedFig) {
    tahasilStatus   = 'direct';
    tahasilStrength = 'strong';
    tahasilHebrew   = `הגעה ישירה: אותה צורה — "${querentName}" — בבית 1 ובבית ${quesitedHouseNum}. הדבר ייגמר ואין ספק בו.`;
  }

  if (tahasilStatus === 'none') {
    const naturalOfQuerent  = getNaturalHouseOf(querentFig);
    const naturalOfQuesited = getNaturalHouseOf(quesitedFig);
    if (naturalOfQuerent === quesitedHouseNum) {
      tahasilStatus   = 'natural';
      tahasilStrength = 'strong';
      tahasilHebrew   = `הגעה טבעית: הצורה "${querentName}" שייכת טבעית לבית ${quesitedHouseNum} — הדבר ייגמר בדרך הטבע.`;
    } else if (naturalOfQuesited === 1) {
      tahasilStatus   = 'natural';
      tahasilStrength = 'strong';
      tahasilHebrew   = `הגעה טבעית: הצורה "${quesitedName}" שייכת טבעית לבית 1 — הנשאל מגיע אל השואל.`;
    }
  }

  if (tahasilStatus === 'none') {
    const judge = chartHouse(chart, 15);
    const w1    = chartHouse(chart, 13);
    const w2    = chartHouse(chart, 14);

    const judgeHasQ  = judge?.key === querentFig;
    const judgeHasT  = judge?.key === quesitedFig;
    const w1HasQ = w1?.key === querentFig;
    const w1HasT = w1?.key === quesitedFig;
    const w2HasQ = w2?.key === querentFig;
    const w2HasT = w2?.key === quesitedFig;

    if ((judgeHasQ || judgeHasT) && ((w1HasQ || w1HasT) || (w2HasQ || w2HasT))) {
      tahasilStatus   = 'witness';
      tahasilStrength = 'strong';
      tahasilHebrew   = `הגעה דרך עדים ודיין: הדיין מחובר לאחד הצדדים ועד מחובר לצד השני — הדבר ייגמר, אך ייקח זמן.`;
    } else if ((w1HasQ && w2HasT) || (w1HasT && w2HasQ)) {
      tahasilStatus   = 'witness';
      tahasilStrength = 'medium';
      tahasilHebrew   = `הגעה דרך עדים: עד ראשון מחובר לצד אחד ועד שני לצד השני — גורם ביניים מעביר את הדבר.`;
    } else if ((w1HasQ || w1HasT) && (w2HasQ || w2HasT)) {
      tahasilStatus   = 'witness';
      tahasilStrength = 'medium';
      tahasilHebrew   = `הגעה חלקית דרך עדים: שני העדים קשורים לאחד הצדדים — יש תמיכה, אך לא הגעה ישירה.`;
    }
  }

  if (tahasilStatus === 'none') {
    const bridge = chart.find((h) => {
      const n = Number(h.house);
      return n !== 1 && n !== quesitedHouseNum && n <= 12 &&
        (h.key === querentFig || h.key === quesitedFig);
    });
    if (bridge) {
      tahasilStatus   = 'translation';
      tahasilStrength = 'medium';
      const bridgeName = bridge.hebrew || bridge.key;
      tahasilHebrew   = `הגעה בהעברה: הצורה "${bridgeName}" בבית ${bridge.house} מחברת בין בית 1 לבית ${quesitedHouseNum} — הדבר ייגמר בעזרת גורם שלישי.`;
    }
  }

  if (tahasilStatus === 'none') {
    const shared = countRowMatches(querentFig, quesitedFig);
    if (shared >= 3) {
      tahasilStatus   = 'partial';
      tahasilStrength = 'medium';
      tahasilHebrew   = `קשר חלקי חזק: ${shared}/4 שורות משותפות בין בית 1 לבית ${quesitedHouseNum} — יש פוטנציאל גבוה, אך לא ודאות.`;
    } else if (shared === 2) {
      tahasilStatus   = 'partial';
      tahasilStrength = 'weak';
      tahasilHebrew   = `קשר חלקי: ${shared}/4 שורות משותפות — הדבר מסופק, תלוי בגורמים נוספים.`;
    } else {
      tahasilHebrew = `אין הגעה: לא נמצא חיבור בין בית 1 ("${querentName}") לבית ${quesitedHouseNum} ("${quesitedName}") — הדבר לא ייגמר כפי שמקווים.`;
    }
  }

  const hayula = computeHayula(chart, quesitedHouseNum, querentFig, quesitedFig, tahasilStatus);

  return {
    tahasilStatus,
    tahasilStrength,
    tahasilHebrew,
    hayulaActive: hayula.active,
    hayulaHebrew: hayula.hebrew,
    quesitedHouseNum,
    querentFigure:       querentFig,
    quesitedFigure:      quesitedFig,
    querentFigureHebrew:  querentName,
    quesitedFigureHebrew: quesitedName,
  };
}

function computeBoardScore(chart) {
  if (!Array.isArray(chart)) return null;
  let singles = 0;
  for (const house of chart) {
    const key = String(house.key || '');
    for (const ch of key) {
      if (ch === '1') singles++;
    }
  }
  const score = 128 - singles;
  return {
    singleRows: singles,
    doubleRows: 64 - singles,
    score,
    isComplete: score >= 96,
    status: score >= 96 ? 'שלם' : 'חסר',
    hebrewSummary: score >= 96
      ? `לוח שלם (${score} נקודות ≥ 96)`
      : `לוח חסר (${score} נקודות < 96) — השאלה עשויה שלא להיפתר`,
  };
}
const DHAMIR_PARENT_PAIRS = {
  9: [1, 2], 10: [3, 4], 11: [5, 6], 12: [7, 8],
  13: [9, 10], 14: [11, 12], 15: [13, 14],
};
const ROW_ELEMENTS = ['נאר (אש)', 'הוואא (אוויר)', 'מאא (מים)', 'תראב (אדמה)'];

function traceRowBack(chart, houseNum, rowIndex) {
  if (houseNum <= 8) return houseNum; // הגענו לאם/בת
  const [leftNum, rightNum] = DHAMIR_PARENT_PAIRS[houseNum] || [];
  if (!leftNum) return null;
  const leftKey  = String(chart.find((h) => Number(h.house) === leftNum)?.key  || '');
  const rightKey = String(chart.find((h) => Number(h.house) === rightNum)?.key || '');
  if (leftKey[rowIndex]  === '1') return traceRowBack(chart, leftNum,  rowIndex);
  if (rightKey[rowIndex] === '1') return traceRowBack(chart, rightNum, rowIndex);
  return null;
}

function computeDhamirByMizanTracing(chart) {
  if (!Array.isArray(chart)) return null;
  const judge = chart.find((h) => Number(h.house) === 15);
  if (!judge) return null;

  const judgeKey = String(judge.key || '');
  const traces = [];

  for (let r = 0; r < 4; r++) {
    if (judgeKey[r] !== '1') continue;
    const dhamirNum = traceRowBack(chart, 15, r);
    if (!dhamirNum) continue;
    const dh = chart.find((h) => Number(h.house) === dhamirNum);
    const figureRecord = (HAWI_SOURCE.figureNames?.list || []).find((f) => f.pattern === dh?.key);
    traces.push({
      rowIndex: r,
      rowElement: ROW_ELEMENTS[r],
      dhamirHouseNumber: dhamirNum,
      dhamirKey: dh?.key || '',
      dhamirHebrew: dh?.hebrew || figureRecord?.hebrewName || '',
      dhamirFortune: dh?.fortune || figureRecord?.fortuneHebrew || '',
    });
  }

  const primary = traces[0] || null;
  return {
    method: 'mizan-tracing',
    methodHebrew: 'שיטת ספירת נקודות המאזן',
    traces,
    primaryHouseNumber: primary?.dhamirHouseNumber || null,
    primaryHebrew: primary?.dhamirHebrew || '',
    primaryFortune: primary?.dhamirFortune || '',
    primaryElement: primary?.rowElement || '',
  };
}

function computeDhamirHouse(board) {
  if (!board || !Array.isArray(board.chart)) return null;

  const rows = [];
  for (let i = 1; i <= 4; i++) {
    const motherHouse = board.chart.find((h) => Number(h.house) === i);
    const key = motherHouse?.key ? String(motherHouse.key) : null;
    if (!key || key.length < 4) return null;
    rows.push(key[i - 1]); // row i-1 (0-indexed) from mother i
  }

  const targetPattern = rows.join('');
  const dhamirEntry = board.chart.find((h) => h.key === targetPattern);
  if (!dhamirEntry) return null;

  const figureRecord = (HAWI_SOURCE.figureNames?.list || []).find((f) => f.pattern === targetPattern);
  return {
    houseNumber: Number(dhamirEntry.house),
    pattern: targetPattern,
    figureHebrew: dhamirEntry.hebrew || figureRecord?.hebrewName || targetPattern,
    fortune: dhamirEntry.fortune || figureRecord?.fortuneHebrew || null,
    method: 'nahmah-al-ummahat',
  };
}

function buildJudgeVerdict(boardAnalysis) {
  if (!boardAnalysis.hasBoard) {
    return { verdict: 'no-board', grade: 'unknown', hebrewShort: '', hebrewFull: '' };
  }

  const judge = boardAnalysis.judge;
  const w1 = boardAnalysis.witnesses?.[0] || null;
  const w2 = boardAnalysis.witnesses?.[1] || null;
  const focus = boardAnalysis.focusHouse;

  if (!judge) {
    return { verdict: 'unknown', grade: 'mixed', hebrewShort: 'הדיין לא נמצא', hebrewFull: 'לא ניתן לקבוע תשובה ללא בית 15.' };
  }

  const judgeToneBase = getFigureFortuneTone(judge);
  const w1ToneBase = w1 ? getFigureFortuneTone(w1) : 0;
  const w2ToneBase = w2 ? getFigureFortuneTone(w2) : 0;
  const focusToneBase = focus ? getFigureFortuneTone(focus) : 0;

  const judgeStateTone = getFigureStateHouseTone(judge?.figureState);
  const w1StateTone = getFigureStateHouseTone(w1?.figureState);
  const w2StateTone = getFigureStateHouseTone(w2?.figureState);
  const focusStateTone = getFigureStateHouseTone(focus?.figureState);

  const judgeTone = judgeStateTone ?? judgeToneBase;
  const w1Tone = w1StateTone ?? w1ToneBase;
  const w2Tone = w2StateTone ?? w2ToneBase;
  const focusTone = focusStateTone ?? focusToneBase;
  const witnessTone = (w1Tone + w2Tone) / 2;

  const judgeFigure = judge.figureHebrew || '';
  const judgeFortune = judge.fortune || '';
  const w1Figure = w1?.figureHebrew || '';
  const w2Figure = w2?.figureHebrew || '';
  const focusFigure = focus?.figureHebrew || '';
  const focusHouseNum = focus?.house || '';

  const judgeSpeaking = getSpeakingStateHebrew(judge?.figureState);
  const judgeSilentNote = judgeSpeaking === 'שותק'
    ? ` [הדיין שותק בבית זה — כוחו מוחלש.]`
    : (judgeSpeaking === 'מדבר' ? ` [הדיין פעיל — כוחו מלא.]` : '');

  let verdict, grade, hebrewShort, hebrewFull;

  // The judge (house 15) is the primary and final ruling in ilm al-raml.
  // Witnesses can only strengthen the certainty or note a contradiction —
  // they cannot override the judge's direction.
  if (judgeTone > 0) {
    if (witnessTone >= 0) {
      verdict = 'yes-strong';
      grade = 'positive';
      hebrewShort = 'כן';
      hebrewFull = 'תשובה: כן — הדיין (בית 15) הוא "' + judgeFigure + '" שהוא צורה של מיטיב, והעדים מחזקים.' +
        judgeSilentNote +
        (w1Figure ? ' עד ראשון: ' + w1Figure + '.' : '') +
        (w2Figure ? ' עד שני: ' + w2Figure + '.' : '') +
        (focusFigure ? ' הבית המרכזי (בית ' + focusHouseNum + '): ' + focusFigure + '.' : '');
    } else {
      verdict = 'yes-weak';
      grade = 'positive';
      hebrewShort = 'כן';
      hebrewFull = 'תשובה: כן — הדיין (בית 15) הוא "' + judgeFigure + '" שהוא מיטיב. העדים מנוגדים לו, אך הדיין פוסק — יש כוחות שמעכבים אבל הכיוון חיובי.' +
        judgeSilentNote +
        (w1Figure ? ' עד ראשון: ' + w1Figure + '.' : '') +
        (w2Figure ? ' עד שני: ' + w2Figure + '.' : '');
    }
  } else if (judgeTone < 0) {
    if (witnessTone <= 0) {
      verdict = 'no-strong';
      grade = 'negative';
      hebrewShort = 'לא';
      hebrewFull = 'תשובה: לא — הדיין (בית 15) הוא "' + judgeFigure + '" שהוא צורה של מזיק, והעדים מחזקים את הדין.' +
        judgeSilentNote +
        (w1Figure ? ' עד ראשון: ' + w1Figure + '.' : '') +
        (w2Figure ? ' עד שני: ' + w2Figure + '.' : '') +
        (focusFigure ? ' הבית המרכזי (בית ' + focusHouseNum + '): ' + focusFigure + '.' : '');
    } else {
      verdict = 'no-weak';
      grade = 'negative';
      hebrewShort = 'לא';
      hebrewFull = 'תשובה: לא — הדיין (בית 15) הוא "' + judgeFigure + '" שהוא מזיק. העדים מראים צד חיובי אך אינם יכולים לשנות פסיקת הדיין — יש כוח חיובי שמנסה לפעול, אך הכרעת הגורל שלילית.' +
        judgeSilentNote +
        (w1Figure ? ' עד ראשון: ' + w1Figure + '.' : '') +
        (w2Figure ? ' עד שני: ' + w2Figure + '.' : '');
    }
  } else {
    // Judge is mixed (ממוזג) — here witnesses do decide the lean
    if (witnessTone > 0 || focusTone > 0) {
      verdict = 'maybe-positive';
      grade = 'cautiously-positive';
      hebrewShort = 'ייתכן שכן';
      hebrewFull = 'תשובה: ייתכן שכן — הדיין (בית 15) הוא "' + judgeFigure + '" שהוא ממוזג ולא מכריע. העדים נוטים לטובה.' +
        judgeSilentNote +
        (w1Figure ? ' עד ראשון: ' + w1Figure + '.' : '') +
        (w2Figure ? ' עד שני: ' + w2Figure + '.' : '');
    } else if (witnessTone < 0 || focusTone < 0) {
      verdict = 'maybe-negative';
      grade = 'cautiously-negative';
      hebrewShort = 'ייתכן שלא';
      hebrewFull = 'תשובה: ייתכן שלא — הדיין (בית 15) הוא "' + judgeFigure + '" שהוא ממוזג ולא מכריע. העדים נוטים לקשיים.' +
        judgeSilentNote +
        (w1Figure ? ' עד ראשון: ' + w1Figure + '.' : '') +
        (w2Figure ? ' עד שני: ' + w2Figure + '.' : '');
    } else {
      verdict = 'mixed';
      grade = 'mixed';
      hebrewShort = 'ממוזג';
      hebrewFull = 'תשובה: ממוזג — הדיין (בית 15) הוא "' + judgeFigure + '" שהוא ממוזג, והעדים אינם מכריעים לכאן או לכאן. יש לבדוק את הבית המרכזי.' +
        judgeSilentNote +
        (w1Figure ? ' עד ראשון: ' + w1Figure + '.' : '') +
        (w2Figure ? ' עד שני: ' + w2Figure + '.' : '');
    }
  }

  if (judge.isNaturalFigure) {
    hebrewFull += ` [ביתה הטבעי: הדיין בביתו הטבעי — הפסיקה מתחזקת.]`;
  }
  if (w1?.isNaturalFigure && w1Figure) {
    hebrewFull += ` [ביתה הטבעי: עד ראשון (${w1Figure}) בביתו הטבעי.]`;
  }
  if (w2?.isNaturalFigure && w2Figure) {
    hebrewFull += ` [ביתה הטבעי: עד שני (${w2Figure}) בביתו הטבעי.]`;
  }
  if (w1?.figureState?.speakingState === 'silent' && w1Figure) {
    hebrewFull += ` [עד ראשון (${w1Figure}) — שותק, כוחו מוחלש.]`;
  }
  if (w2?.figureState?.speakingState === 'silent' && w2Figure) {
    hebrewFull += ` [עד שני (${w2Figure}) — שותק, כוחו מוחלש.]`;
  }

  const dhamirFort = boardAnalysis.dhamirByMizan?.primaryFortune || boardAnalysis.dhamirHouse?.fortune || '';
  const dhamirToneVerdict = dhamirFort.includes('מיטיב') ? 1 : dhamirFort.includes('מזיק') ? -1 : 0;
  if (dhamirToneVerdict !== 0) {
    const dhamirH = boardAnalysis.dhamirByMizan?.primaryHouseNumber || boardAnalysis.dhamirHouse?.houseNumber || '';
    const confirming = (judgeTone > 0 && dhamirToneVerdict > 0) || (judgeTone < 0 && dhamirToneVerdict < 0);
    hebrewFull += confirming
      ? ` מחשבת השואל (בית ${dhamirH}) מאשרת את הפסיקה — ${dhamirFort}.`
      : ` מחשבת השואל (בית ${dhamirH}) מנוגדת לדיין — ${dhamirFort} — ייתכן שינוי במהלך.`;
  }
  return { verdict, grade, judgeFigure, judgeFortune, judgeTone, witnessTone, focusTone, hebrewShort, hebrewFull };
}

function judgeHouseTone(house) {
  if (!house) return { score: 0, tone: 'unknown', hebrew: 'לא נמצא בית בלוח.' };

  const combined = [
    house.fortune,
    house.movement,
    house.element,
    house.hebrew,
    house.key,
    house.houseHebrew,
  ].filter(Boolean).join(' ');

  if (isGoodValue(combined)) {
    return { score: 1, tone: 'good', hebrew: 'הבית נושא סימן טוב / מיטיב.' };
  }

  if (isBadValue(combined)) {
    return { score: -1, tone: 'bad', hebrew: 'הבית נושא סימן קשה / מזיק.' };
  }

  return { score: 0, tone: 'mixed', hebrew: 'הבית אינו מוכרע מצד טוב/רע בלבד.' };
}

function findArraysWithRules(item) {
  return Object.entries(item)
    .filter(([key, value]) => Array.isArray(value))
    .filter(([key]) => {
      const k = key.toLowerCase();
      return (
        k.includes('rules') ||
        k.includes('houses') ||
        k.includes('planets') ||
        k.includes('figures') ||
        k.includes('principles')
      );
    });
}

function ruleTouchesHouses(rule, houseNumbers) {
  const wanted = new Set(houseNumbers.map(Number));
  const houses = [];

  if (rule.house) houses.push(Number(rule.house));
  if (Array.isArray(rule.houses)) houses.push(...rule.houses.map(Number));
  if (Array.isArray(rule.housesToCheck)) houses.push(...rule.housesToCheck.map(Number));

  if (!houses.length) return false;
  return houses.some((h) => wanted.has(h));
}

function collectRelevantRules(knowledgeItems, topicId, mainHouses = [], maxRules = 16) {
  const all = [];

  for (const item of knowledgeItems) {
    for (const [arrayName, arr] of findArraysWithRules(item)) {
      for (const entry of arr) {
        if (!entry || typeof entry !== 'object') continue;

        all.push({
          sourceId: item.id,
          sourceSectionHebrew: item.sourceSectionHebrew || item.sourceSectionArabic || item.appArea || item.id,
          arrayName,
          id: entry.id || null,
          house: entry.house || null,
          houses: entry.houses || entry.housesToCheck || null,
          figuresHebrew: entry.figuresHebrew || null,
          figuresArabic: entry.figuresArabic || null,
          topics: entry.topics || null,
          result: entry.result || entry.resultHebrew || null,
          condition: entry.condition || entry.conditionHebrew || null,
          hebrew: entry.hebrew || entry.ruleHebrew || entry.practicalEffectHebrew || null,
          arabic: entry.arabic || entry.arabicText || null,
          sourcePage: entry.sourcePage || null,
          weight: ruleTouchesHouses(entry, mainHouses) ? 2 : 1,
        });
      }
    }
  }

  return all
    .sort((a, b) => b.weight - a.weight)
    .slice(0, maxRules);
}

function summarizeKnowledgeItems(knowledgeItems) {
  return knowledgeItems.map((item) => ({
    id: item.id,
    titleHebrew: item.sourceSectionHebrew || item.purposeHebrew || item.id,
    appArea: item.appArea || null,
    sourcePages: item.sourcePages || [],
    status: item.status || null,
  }));
}

function findSourceRecordByFigure(house, sourceList) {
  if (!house || !Array.isArray(sourceList)) return null;

  const candidates = [
    house.id,
    house.figureId,
    house.key,
    house.hebrew,
    house.figureHebrew,
    house.arabic,
    house.figureArabic,
  ]
    .filter(Boolean)
    .map(normalizeText);

  if (!candidates.length) return null;

  return sourceList.find((item) => {
    const text = normalizeText(JSON.stringify(item));
    return candidates.some((c) => c && text.includes(c));
  }) || null;
}

function getTransitMeaningForHouse(house, topicId = null) {
  if (!house) return null;
  const houseNum = Number(house.house);
  const figureId = house.figureId || house.shortId || null;
  let houseMeaning = null;
  if (figureId) {
    houseMeaning = HAWI_SOURCE.figureTransits.getHouseMeaning(figureId, houseNum);
  }
  if (!houseMeaning && house.key) {
    const figureByPattern = HAWI_SOURCE.figureNames.list.find(f => f.pattern === house.key);
    if (figureByPattern) {
      houseMeaning = HAWI_SOURCE.figureTransits.getHouseMeaning(figureByPattern.shortId, houseNum);
    }
  }
  if (!houseMeaning && house.hebrew) {
    const figureByHebrew = HAWI_SOURCE.figureNames.list.find(f =>
      f.hebrewName === house.hebrew
    );
    if (figureByHebrew) {
      houseMeaning = HAWI_SOURCE.figureTransits.getHouseMeaning(figureByHebrew.shortId, houseNum);
    }
  }
  if (!houseMeaning) return null;
  // Do not return a transit meaning for houses that are genuinely absent from the source.
  // The source itself omits certain house entries (most commonly house 15 for some figures).
  // Returning null keeps the conclusion clean — no "המקור אינו מביא דין" showing up in text.
  if (houseMeaning.sourceStatus === 'not-explicit-in-source') return null;

  let meaning = houseMeaning.meaning || null;
  if (meaning && topicId && houseMeaning.meaningTopicFilter?.sentenceFilters) {
    for (const filter of houseMeaning.meaningTopicFilter.sentenceFilters) {
      if (filter.onlyForTopics && !filter.onlyForTopics.includes(topicId)) {
        meaning = meaning.replace(filter.sentence, '').replace(/\s{2,}/g, ' ').replace(/\.\s*\./g, '.').trim();
      }
    }
  }

  return {
    figure: house.hebrew || house.key || null,
    house: house.house,
    meaning,
    topics: houseMeaning.topics || null,
    sourceStatus: houseMeaning.sourceStatus || null,
  };
}

function getFigureStateForHouse(house) {
  const record = findSourceRecordByFigure(house, HAWI_SOURCE.figureStates?.list);
  if (!record) return null;

  const states = record.houses || record.houseStates || record.states || [];
  const state = Array.isArray(states)
    ? states.find((x) => Number(x.house) === Number(house.house))
    : null;

  return {
    sourceId: record.id || null,
    figure: house.hebrew || house.key || null,
    house: house.house,
    speakingState: state?.speakingState || null,
    fortuneState: state?.fortuneState || null,
    effectHebrew: state?.effectHebrew || state?.hebrew || null,
    sourceStatus: state?.sourceStatus || record.status || null,
  };
}

function getHouseStateColor(houseNumber) {
  const item = HAWI_SOURCE.extendedKnowledge?.houseStatesColors;
  const h = item?.houses?.find((x) => Number(x.house) === Number(houseNumber));
  if (!h) return null;

  return {
    house: h.house,
    speakingState: h.speakingState || null,
    fortuneState: h.fortuneState || null,
    colorHebrew: h.colorHebrew || null,
    practicalEffectHebrew: h.practicalEffectHebrew || h.hebrew || null,
  };
}

const SATURN_FIGURE_PATTERNS_TREASURE = new Set(['1221', '2221']);

const TREASURE_FIGURE_LOCATION_RULES = (function buildTreasureRules() {
  const PATTERN_MAP = {
    'ממון נכנס':  '2121',
    'ממון יוצא':  '1212',
    'סף יוצא':    '1112',
    'סף נכנס':    '2111',
    'אדום':        '2122',
    'לבן':         '2212',
    'נשוא ראש':   '1222',
    'שפל ראש':    '2221',
    'בר הלחי':    '1211',
    'נלחם':        '1121',
    'כבוד נכנס':  '2211',
    'כבוד יוצא':  '1122',
    'קהלה':        '2222',
    'חיבור':       '2112',
    'דרך':         '1111',
    'סוהר':        '1221',
  };
  const rules = {};
  for (const rule of (HAWI_QUESTION_HIDDEN_TREASURE_EXTRA?.figureLocationRules || [])) {
    const pattern = PATTERN_MAP[rule.figureHebrew];
    if (pattern) rules[pattern] = rule;
  }
  return rules;
})();

function buildTreasureLocationHebrew(rule) {
  if (!rule) return null;
  if (rule.resultHebrew) return rule.resultHebrew;

  const parts = [];
  if (rule.certaintyHebrew) parts.push(rule.certaintyHebrew);
  if (rule.directionHebrew) parts.push(`כיוון: ${rule.directionHebrew}`);
  if (rule.materialOrPlaceHebrew?.length) parts.push(`חומר/מקום: ${rule.materialOrPlaceHebrew.join(', ')}`);
  if (rule.containerHebrew?.length) parts.push(`מיכל/מבנה: ${rule.containerHebrew.join(' או ')}`);
  if (rule.placeHebrew) parts.push(`תיאור: ${rule.placeHebrew}`);
  if (rule.conditionHebrew) parts.push(`(תנאי: ${rule.conditionHebrew})`);
  return parts.join(' | ');
}

function computeTreasureLocation(chart) {
  if (!Array.isArray(chart)) return null;

  const house1 = chart.find((h) => Number(h.house) === 1);
  if (!house1) return null;

  const house1Pattern = house1.key || '';

  const saturnKeyHouses = [8, 12, 16].map((n) => chart.find((h) => Number(h.house) === n)).filter(Boolean);
  const hasSaturnInKeyHouses = saturnKeyHouses.some((h) => SATURN_FIGURE_PATTERNS_TREASURE.has(h.key || ''));

  const secondaryHouses = [2, 6, 8].map((n) => chart.find((h) => Number(h.house) === n)).filter(Boolean);
  const hasQabdDakhilInSecondary = secondaryHouses.some((h) => (h.key || '') === '2121');

  let presenceVerdict;
  let presenceHebrew;
  if (hasSaturnInKeyHouses) {
    presenceVerdict = 'likely-present';
    presenceHebrew = 'סימני שבתאי (סוהר / שפל ראש) נמצאו בבתים 8, 12 או 16 — הלוח מצביע על קיום דבר קבור במקום';
  } else if (hasQabdDakhilInSecondary) {
    presenceVerdict = 'likely-present';
    presenceHebrew = 'ממון נכנס נמצא בבית 2, 6 או 8 — סימן שיש דבר קבור';
  } else {
    const angleHouses = [1, 4, 7, 10].map((n) => chart.find((h) => Number(h.house) === n)).filter(Boolean);
    const hasSaturnInAngles = angleHouses.some((h) =>
      SATURN_FIGURE_PATTERNS_TREASURE.has(h.key || '') || (h.key || '') === '2121'
    );
    if (hasSaturnInAngles) {
      presenceVerdict = 'possible';
      presenceHebrew = 'צורות ביתד מצביעות על אפשרות קיום — יש לאשש על פי שאר הכללים';
    } else {
      presenceVerdict = 'not-found';
      presenceHebrew = 'לא נמצאו סימני שבתאי, סוהר, שפל ראש או ממון נכנס ביתדות ובבתים 8/12/16 — לפי המקור, המקום ריק';
    }
  }

  const locationRule = TREASURE_FIGURE_LOCATION_RULES[house1Pattern] || null;
  const locationHebrew = buildTreasureLocationHebrew(locationRule);

  return {
    house1Pattern,
    house1Hebrew: house1.hebrew || '',
    presenceVerdict,
    presenceHebrew,
    hasSaturnInKeyHouses,
    hasQabdDakhilInSecondary,
    locationRule,
    locationHebrew,
  };
}

const PATTERN_TO_LETTERS = (function buildLetterMap() {
  const map = {};
  for (const entry of (FIGURE_LETTER_EXTRACTION?.figureLetters || [])) {
    map[entry.pattern] = entry;
  }
  return map;
})();

function computeNameLetters(chart, houseNumber, labelOverride) {
  if (!Array.isArray(chart) || !houseNumber) return null;
  const house = chart.find((h) => Number(h.house) === Number(houseNumber));
  if (!house || !house.key) return null;

  const entry = PATTERN_TO_LETTERS[house.key];
  if (!entry) return null;

  const letters = entry.letters || [];
  const houseRole = labelOverride
    || FIGURE_LETTER_EXTRACTION?.usageHouses?.[Number(houseNumber)]
    || `בית ${houseNumber}`;

  let outputHebrew;
  if (letters.length === 1) {
    outputHebrew = `שמו מתחיל ב: ${letters[0]}`;
  } else if (letters.length === 2) {
    outputHebrew = `שמו מתחיל ב: ${letters[0]} או ${letters[1]}`;
  } else {
    outputHebrew = `שמו מתחיל ב: ${letters.join(' / ')}`;
  }

  return {
    houseNumber: Number(houseNumber),
    houseRole,
    figurePattern: house.key,
    figureHebrew: entry.hebrewName || house.hebrew || house.key,
    letters,
    outputHebrew,
  };
}

const NAME_EXTRACTION_HOUSES_BY_TOPIC = {
  spiritualDiagnostics: [{ house: 9 }],
  enemies:              [{ house: 7 }, { house: 9 }],
  disputes:             [{ house: 7 }],
  authorityState:       [{ house: 7, labelOverride: 'שם גורם הנפילה / האויב הפוליטי' }],
  missingPerson:        [{ house: 7, labelOverride: 'שם הנעדר' }],
  prisoner:             [{ house: 12, labelOverride: 'שם הגורם לכליאה' }],
  partnership:          [{ house: 7, labelOverride: 'שם השותף' }],
  theft:                [
    { house: 7, labelOverride: 'שם הגנב — אות ראשונה' },
    { house: 8, labelOverride: 'שם הגנב — אות שנייה' },
  ],
};
function computeAuthorityStateAnalysis(chart, authoritySource) {
  if (!Array.isArray(chart)) return null;

  const h1  = chartHouse(chart, 1);
  const h5  = chartHouse(chart, 5);
  const h7  = chartHouse(chart, 7);
  const h10 = chartHouse(chart, 10);
  const h11 = chartHouse(chart, 11);
  const h15 = chartHouse(chart, 15);

  const isBenefic  = (h) => h && !MALEFIC_FIGURE_PATTERNS.has(h.key || '');
  const isMalefic  = (h) => h && MALEFIC_FIGURE_PATTERNS.has(h.key || '');
  const isIncoming = (h) => h && getFigureDirection(h.key) === 'incoming';
  const isStable   = (h) => h && getFigureDirection(h.key) === 'stable';

  const srcStability = authoritySource?.officeStabilityRules || [];
  const srcReturn    = authoritySource?.returnToOfficeRules  || [];

  const rule1Src = srcStability.find(r => r.id === 'first-fixed-benefic-connected-to-tenth-stable-rule');
  const rule2Src = srcStability.find(r => r.id === 'tenth-repeats-in-eleventh-many-supporters');
  const rule3Src = srcStability.find(r => r.id === 'malefic-first-or-tenth-eleventh-with-malefics-removal');
  const rule4Src = srcStability.find(r => r.id === 'malefics-from-seventh-head-tail-and-fifteenth-anger-of-king');
  const returnSrc = srcReturn.find(r => r.id === 'benefic-similar-incoming-forms-return-certain');
  const returnH10Src = srcReturn.find(r => r.id === 'return-strengthened-by-tenth-and-fifteenth');
  const sunMoonSrc = authoritySource?.stateStrengthRules?.find(r => r.id === 'do-not-neglect-sun-and-moon');

  const signals = [];

  const h1BeneficStable = isBenefic(h1) && (isStable(h1) || isIncoming(h1));
  const h10Benefic = isBenefic(h10);
  const h1ConnectsH10 = !!(h1?.key && h10?.key && (h1.key === h10.key || aspectTypeBetween(1, 10)));
  if (h1BeneficStable && h10Benefic && h1ConnectsH10) {
    signals.push({ verdict: 'stable', weight: 3, sourceId: rule1Src?.id || null,
      hebrew: rule1Src?.hebrew
        ? `${rule1Src.hebrew} [בית 1: ${h1?.hebrew || ''}, בית 10: ${h10?.hebrew || ''}]`
        : `בית 1 (${h1?.hebrew || ''}) מיטיב+קבוע/נכנס ומחובר לבית 10 (${h10?.hebrew || ''}) — המושל יציב בתפקידו ומכובד.` });
  }

  if (h10?.key && h11?.key && h10.key === h11.key && isBenefic(h1)) {
    signals.push({ verdict: 'stable', weight: 2, sourceId: rule2Src?.id || null,
      hebrew: rule2Src?.hebrew
        ? `${rule2Src.hebrew} [בית 10: ${h10?.hebrew || ''}, בית 11: ${h11?.hebrew || ''}]`
        : `בית 10 (${h10?.hebrew || ''}) חוזר בבית 11 ובית 1 מיטיב — ריבוי תומכים, חברים ואחים.` });
  }

  if (isMalefic(h1) || (isMalefic(h10) && isMalefic(h11))) {
    signals.push({ verdict: 'removal', weight: -3, sourceId: rule3Src?.id || null,
      hebrew: rule3Src?.hebrew
        ? `${rule3Src.hebrew} [בית 1: ${h1?.hebrew || ''}, בית 10: ${h10?.hebrew || ''}]`
        : `בית 1 (${h1?.hebrew || ''}) או בתים 10+11 (${h10?.hebrew || ''}/${h11?.hebrew || ''}) מזיקיים — סימן ליציאה מן התפקיד.` });
  }

  if (isMalefic(h7) && isMalefic(h15)) {
    signals.push({ verdict: 'removal', weight: -4, sourceId: rule4Src?.id || null,
      hebrew: rule4Src?.hebrew
        ? `${rule4Src.hebrew} [בית 7: ${h7?.hebrew || ''}, בית 15: ${h15?.hebrew || ''}]`
        : `מזיקים בבית 7 (${h7?.hebrew || ''}) ובבית 15 (${h15?.hebrew || ''}) — נפילה קשה וכעס השליט.` });
  } else if (isMalefic(h7)) {
    signals.push({ verdict: 'removal', weight: -2, sourceId: null,
      hebrew: `מזיק בבית 7 (${h7?.hebrew || ''}) — לחץ מן הצד השני.` });
  }

  const returnHouses = [h1, h5, h15, h11];
  const returnBeneficCount = returnHouses.filter((h) => h && isBenefic(h) && isIncoming(h)).length;
  if (returnBeneficCount >= 3) {
    const baseText = returnSrc?.hebrew
      ? `${returnSrc.hebrew} [${returnBeneficCount}/4 מבתים 1,5,15,11 מסועדים ונכנסים]`
      : `${returnBeneficCount}/4 מבתים 1,5,15,11 מסועדים ונכנסים — חזרה לתפקיד בוודאות.`;
    signals.push({ verdict: 'return', weight: 2, sourceId: returnSrc?.id || null, hebrew: baseText });
  } else if (returnBeneficCount >= 2 && h10Benefic) {
    const baseText = returnH10Src?.hebrew
      ? `${returnH10Src.hebrew} [בתים לחזרה נוטים למיטיב, בית 10 תומך]`
      : `בתים לחזרה (1,5,15,11) נוטים למיטיב ובית 10 תומך — סימן לחזרה.`;
    signals.push({ verdict: 'return', weight: 1, sourceId: returnH10Src?.id || null, hebrew: baseText });
  }

  const sunInAngular  = chart.some((h) => SUN_FIGURE_PATTERNS.has(h.key || '') && ANGULAR_HOUSES_SET.has(Number(h.house)));
  const moonInAngular = chart.some((h) => MOON_FIGURE_PATTERNS.has(h.key || '') && ANGULAR_HOUSES_SET.has(Number(h.house)));
  const sunInBoard    = chart.some((h) => SUN_FIGURE_PATTERNS.has(h.key || ''));
  const moonInBoard   = chart.some((h) => MOON_FIGURE_PATTERNS.has(h.key || ''));

  if (sunInAngular && moonInAngular) {
    const sunMoonHebrew = sunMoonSrc?.hebrew
      ? `${sunMoonSrc.hebrew} — שניהם ביתדות: המדינה יציבה ושלטונה תקף.`
      : 'צורות השמש והלבנה ביתדות — המדינה יציבה ושלטונה תקף.';
    signals.push({ verdict: 'stable', weight: 2, sourceId: sunMoonSrc?.id || null, hebrew: sunMoonHebrew });
  } else if (sunInBoard && moonInBoard) {
    signals.push({ verdict: 'stable', weight: 1, sourceId: sunMoonSrc?.id || null,
      hebrew: 'צורות השמש והלבנה מופיעות בלוח — סימן טוב לשלטון.' });
  } else {
    const missing = [!sunInBoard && 'שמש', !moonInBoard && 'לבנה'].filter(Boolean).join(', ');
    if (missing) signals.push({ verdict: 'warning', weight: -1, sourceId: null,
      hebrew: `צורות ${missing} לא נמצאות בלוח — לפי חאוי, יש להיזהר.` });
  }

  const totalWeight = signals.reduce((s, x) => s + x.weight, 0);
  const stabilityVerdict =
    totalWeight >= 3  ? 'stable' :
    totalWeight >= 1  ? 'likely-stable' :
    totalWeight <= -3 ? 'removal' :
    totalWeight <= -1 ? 'likely-removal' : 'uncertain';

  const verdictHebrew = {
    'stable':         'המושל/בעל התפקיד יציב במשרתו.',
    'likely-stable':  'הסימנים נוטים ליציבות, אך יש לבדוק פרטים נוספים.',
    'uncertain':      'הדין מעורב — לא ניתן להכריע.',
    'likely-removal': 'יש סימנים לקושי בתפקיד; ייתכן הרחקה.',
    'removal':        'סימנים חזקים לנפילת המושל מתפקידו.',
  }[stabilityVerdict] || 'לא מוכרע.';

  const scopeNote = authoritySource?.authorityQuestionScope?.hebrew || null;

  return {
    stabilityVerdict,
    verdictHebrew,
    totalWeight,
    signals,
    returnSignal: signals.find((s) => s.verdict === 'return') || null,
    sunInAngular,
    moonInAngular,
    scopeNote,
    outputHebrew: [`פסיקת שלטון: ${verdictHebrew}`, ...signals.map((s) => `• ${s.hebrew}`)].join('\n'),
  };
}


// Planetary mapping per כשף אל-אסרר עמ' 133 (שיבוץ המזג).
// Corrected from prior mapping (חאוי planetary-correspondences):
//   נלחם (1121): מאדים → נוגה; בר הלחי (1211): נוגה → מאדים; חיבור (2112): added to כוכב/מרקורי.
export const FIGURE_PLANET_MAP = (function () {
  const m = {};
  for (const p of [
    { hebrew: 'שמש',            figures: ['1122', '2121'] },
    { hebrew: 'לבנה',           figures: ['2212', '1111'] },
    { hebrew: 'מאדים',          figures: ['2122', '1211'] },   // כשף עמ' 133: אדום ובר הלחי
    { hebrew: 'כוכב / מרקורי', figures: ['2222', '2112'] },   // כשף עמ' 133: קהלה וחיבור
    { hebrew: 'שבתאי',          figures: ['2221', '1221'] },
    { hebrew: 'נוגה',           figures: ['2211', '1121'] },   // כשף עמ' 133: כבוד נכנס ונלחם
    { hebrew: 'צדק',            figures: ['1222', '2111'] },
  ]) { for (const f of p.figures) m[f] = p.hebrew; }
  return m;
})();


const PLANET_ENRICHMENT_MAP = (function () {
  const m = {};
  const planets = HAWI_SOURCE.extendedKnowledge?.planetaryCorrespondences?.planets || [];
  for (const p of planets) {
    if (!p.planetHebrew) continue;
    m[p.planetHebrew] = {
      materials: p.materialsHebrew || [],
      foods: p.plantsFoodsHebrew || [],
      lands: p.landsHebrew || [],
      people: p.peopleHebrew || [],
      climate: p.climateHebrew || '',
    };
  }
  return m;
})();

const PLANET_YEARLY_MEANING = {
  'שמש':           'צדק המלך, ירידה בעוול, שלטון ראוי',
  'לבנה':          'חיזוק הצבא/עמים, כוח חברתי',
  'מאדים':         'התייקרות נשק וציוד קרב, מלחמות',
  'כוכב / מרקורי': 'התייקרות מאכלים בחנויות, מעמד סופרים ורמלים',
  'שבתאי':         'קור, יובש, עצבות, מחסור',
  'נוגה':          'חיזוק נשים, התייקרות מאכלים ומשקאות',
  'צדק':           'התייקרות זהב וכסף, חיזוק נכבדים',
};

const YEARLY_H15_OUTCOME_RULES = [
  {
    id: 'jamaa-from-two-jamaa',
    match: (h15, w13, w14) => h15?.key === '2222' && w13?.key === '2222' && w14?.key === '2222',
    hebrewResult: 'קהלה מ-שתי קהלות — שנה מרובת רע, רעב, מחלות, מהומות ומרידות, ועצבות ודיכאון (מרה שחורה).',
    grade: 'very-bad',
  },
  {
    id: 'nusra-dakhila-from-ataba-kharija',
    match: (h15, w13, w14) => h15?.key === '2211' && (w13?.key === '1112' || w14?.key === '1112'),
    hebrewResult: 'כבוד נכנס מסף יוצא — שנה מרובת מרמה, מלחמה ומהומות.',
    grade: 'bad',
  },
  {
    id: 'qabd-kharij-and-aqla',
    match: (h15, w13, w14) =>
      (w13?.key === '1212' && w14?.key === '1221') || (w13?.key === '1221' && w14?.key === '1212'),
    hebrewResult: 'ממון יוצא וסוהר — מלכים במלחמה, מחלות, מגפה, מאסר ופחד.',
    grade: 'very-bad',
  },
];

// מיפוי כוכב → מזהה כלל מחיר ספציפי בקובץ המקור
const PLANET_TO_PRICE_RULE_ID = {
  'שמש':           'sun-justice-of-king',
  'לבנה':          'moon-arabs-army-strength',
  'מאדים':         'mars-weapons-war-supplies',
  'כוכב / מרקורי': 'mercury-food-shops-scribes-rammalin',
  'נוגה':          'venus-women-foods-drinks',
  'צדק':           'jupiter-gold-silver-nobles',
};

const MARS_FIGURES    = new Set(['2122', '1121']);
const JUPITER_FIGURES = new Set(['1222', '2111']);
const SATURN_FIGURES  = new Set(['2221', '1221']);
const VENUS_FIGURES   = new Set(['2211', '1211']);

function computeYearlyForecastAnalysis(chart, pricesSource, rainSource) {
  if (!Array.isArray(chart)) return null;

  const h1  = chartHouse(chart, 1);
  const h15 = chartHouse(chart, 15);
  const w13 = chartHouse(chart, 13);
  const w14 = chartHouse(chart, 14);

  // 1. בית 15 — אחרית השנה
  let house15Result = null;
  for (const rule of YEARLY_H15_OUTCOME_RULES) {
    if (rule.match(h15, w13, w14)) { house15Result = rule; break; }
  }

  // 2. כלל העוצמה — צורת האם הראשונה (בית 1) מחזקת או מחלישה את העולה
  // מקור: עמוד 61 — "אם חזקה מוסיפה כוח לבית הראשון; אם חסרה מחסירה"
  const h1Fortune  = h1?.fortune || '';
  const strengthNote = h1Fortune.includes('מיטיב')
    ? `כלל העוצמה: צורת האם הראשונה (${h1?.hebrew || ''}) מסועדת — מוסיפה כוח לעולה השנה.`
    : h1Fortune.includes('מזיק')
    ? `כלל העוצמה: צורת האם הראשונה (${h1?.hebrew || ''}) מנוחסת — מחלישה את כוח העולה.`
    : null;

  // 3. כוכבים ביתדות (בתים 1, 4, 7, 10) עם נושאי מחיר ספציפיים
  const angularPlanets = chart
    .filter((h) => ANGULAR_HOUSES_SET.has(Number(h.house)) && FIGURE_PLANET_MAP[h.key])
    .map((h) => {
      const planetName   = FIGURE_PLANET_MAP[h.key];
      const enrichment   = PLANET_ENRICHMENT_MAP[planetName] || {};
      const isBenefic    = !MALEFIC_FIGURE_PATTERNS.has(h.key || '');
      const ruleId       = PLANET_TO_PRICE_RULE_ID[planetName];
      const specificRule = ruleId
        ? pricesSource?.priceRulesByPlacement?.find(r => r.id === ruleId)
        : null;
      const priceTopics  = specificRule?.topics || [];
      const genericResult = isBenefic
        ? pricesSource?.priceRulesByPlacement?.find(r => r.id === 'benefic-sign-increases-price')?.result
        : pricesSource?.priceRulesByPlacement?.find(r => r.id === 'malefic-fallen-sign-lowers-price')?.result;
      return {
        house:       h.house,
        figureHebrew: h.hebrew || h.key,
        planet:      planetName,
        meaning:     PLANET_YEARLY_MEANING[planetName] || '',
        fortune:     h.fortune || '',
        isBenefic,
        priceTopics,
        genericResult: genericResult || null,
        materials:   (enrichment.materials || []).slice(0, 3),
      };
    });

  // 4. יסוד דומיננטי
  const elCounts = {};
  for (const h of chart) { if (h.element) elCounts[h.element] = (elCounts[h.element] || 0) + 1; }
  const dominantElement = Object.entries(elCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  const ELEMENT_YEAR_CHARACTER = {
    'אש':    'שנת אש — חום, מחלוקות, מלחמות',
    'מים':   'שנת מים — גשמים, ריבוי, שינויים רגשיים',
    'אוויר': 'שנת אוויר — תנועה, מסחר, שינויים מהירים',
    'עפר':   'שנת עפר — יציבות, חקלאות, ממון',
  };

  // 5. גשם ומזג — כל הכללים מהמקור (עמוד 62)
  const moonAngular    = chart.some((h) => MOON_FIGURE_PATTERNS.has(h.key || '') && ANGULAR_HOUSES_SET.has(Number(h.house)));
  const moonInBoard    = chart.some((h) => MOON_FIGURE_PATTERNS.has(h.key || ''));
  const venusInBoard   = chart.some((h) => VENUS_FIGURES.has(h.key || ''));
  const saturnAngular  = chart.some((h) => SATURN_FIGURES.has(h.key || '') && ANGULAR_HOUSES_SET.has(Number(h.house)));
  const saturnInBoard  = chart.some((h) => SATURN_FIGURES.has(h.key || ''));
  const marsInBoard    = chart.some((h) => MARS_FIGURES.has(h.key || ''));
  const jupiterInBoard = chart.some((h) => JUPITER_FIGURES.has(h.key || ''));
  const waterHousesActive = chart.some((h) => h.element === 'מים' && ANGULAR_HOUSES_SET.has(Number(h.house)));

  const strongRainRule = rainSource?.rainStrengthRules?.find(r => r.id === 'strong-first-half-heavy-rain');
  const coldSnowRule   = rainSource?.rainStrengthRules?.find(r => r.id === 'watery-houses-cold-snow-mix');

  const rainVerdict =
    (moonAngular && venusInBoard)      ? 'heavy-rain'    :
    (moonAngular && waterHousesActive) ? 'cold-snow'     :
    (moonInBoard && !saturnAngular)    ? 'moderate-rain' :
    saturnAngular                       ? 'cold-dry'      : 'unknown';

  const mainRainHebrew = rainVerdict === 'heavy-rain'
    ? (strongRainRule?.hebrew || 'לבנה ביתד + נוגה בלוח — גשם רב וכללי צפוי.')
    : rainVerdict === 'cold-snow'
    ? (coldSnowRule?.hebrew   || 'לבנה ביתד + בתים מימיים — קור, שלג ותערובת.')
    : rainVerdict === 'moderate-rain'  ? 'לבנה בלוח ושבתאי לא ביתד — גשם מתון.'
    : rainVerdict === 'cold-dry'       ? 'שבתאי ביתד — קור, יובש ועננים שחורים.'
    : 'לא ניתן לקבוע דין גשם ברור מלוח זה.';

  // כללים נוספים — מאדים, צדק, שבתאי (מ-advancedWeatherRules)
  const weatherSigns = [];
  if (marsInBoard) {
    const r = rainSource?.advancedWeatherRules?.find(r => r.id === 'mars-in-rain-signification-thunder-dryness');
    weatherSigns.push(r?.hebrew || 'מאדים בלוח — ברקים, רעמים ויובש.');
  }
  if (jupiterInBoard && (moonAngular || venusInBoard)) {
    const r = rainSource?.advancedWeatherRules?.find(r => r.id === 'jupiter-with-rain-signification-storm-winds');
    weatherSigns.push(r?.hebrew || 'צדק עם גשם — רוחות סוערות.');
  } else if (jupiterInBoard) {
    const r = rainSource?.advancedWeatherRules?.find(r => r.id === 'jupiter-winds');
    weatherSigns.push(r?.hebrew || 'צדק בלוח — רוחות.');
  }
  if (saturnInBoard && !saturnAngular) {
    const r = rainSource?.advancedWeatherRules?.find(r => r.id === 'saturn-continuous-rains');
    weatherSigns.push(r?.hebrew || 'שבתאי בלוח — גשמים מתמשכים.');
  }

  const regionNote = rainSource?.regionAdjustmentRules?.[0]?.ruleHebrew || null;

  // 6. בניית פלט
  const parts = [];
  if (house15Result) {
    parts.push(`בית 15 (אחרית השנה): ${house15Result.hebrewResult}`);
  }
  if (strengthNote) {
    parts.push(strengthNote);
  }
  if (dominantElement) {
    parts.push(`יסוד דומיננטי: ${dominantElement} — ${ELEMENT_YEAR_CHARACTER[dominantElement] || dominantElement}`);
  }
  if (angularPlanets.length) {
    parts.push('כוכבים ביתדות:\n' + angularPlanets.map((p) => {
      let line = `  ${p.planet} (בית ${p.house} — ${p.figureHebrew}): ${p.meaning}`;
      if (p.priceTopics.length) line += ` | ${p.priceTopics.slice(0, 5).join(', ')}`;
      return line;
    }).join('\n'));
  }
  const weatherLine = `דין גשם ומזג: ${mainRainHebrew}`;
  const extraWeather = weatherSigns.length
    ? '\n  ' + weatherSigns.join('\n  ')
    : '';
  parts.push(weatherLine + extraWeather);
  if (regionNote) parts.push(`הערת אזור: ${regionNote}`);

  return {
    house15Result,
    angularPlanets,
    dominantElement,
    rainVerdict,
    rainHebrew: mainRainHebrew,
    weatherSigns,
    strengthNote,
    regionNote,
    outputHebrew: parts.join('\n'),
  };
}

function buildNativityLookup(birthSource) {
  if (!birthSource) return {};
  const lookup = {};
  const groupNames = [
    'mainBirthRules', 'secondHouseLordRules', 'thirdHouseLordRules',
    'fifthHouseLordRules', 'sixthHouseLordRules', 'seventhHouseLordRules',
    'eighthHouseLordRules', 'ninthHouseLordRules', 'tenthHouseLordRules',
    'eleventhHouseLordRules', 'twelfthHouseLordRules', 'thirteenthHouseLordRules',
    'fourteenthHouseLordRules', 'fifteenthHouseLordRules', 'sixteenthHouseLordRules',
  ];
  for (const gn of groupNames) {
    for (const rule of (birthSource[gn] || [])) {
      for (const h of (rule.houses || [])) {
        if (!lookup[h]) lookup[h] = [];
        lookup[h].push({ id: rule.id, hebrew: rule.hebrew, topics: rule.topics || [] });
      }
    }
  }
  return lookup;
}

function computeBirthNativityAnalysis(chart, birthSource) {
  if (!Array.isArray(chart) || !birthSource) return null;

  const tali = chartHouse(chart, 1);
  if (!tali?.key) return null;

  const taliPattern = tali.key;
  const taliHebrew  = tali.hebrew || tali.key;
  // בשאלת מולד: מחפשים לפי כוכב הצורה — כל צורה בעלת אותו כוכב = "בעל הבית" שב בבית אחר
  const taliPlanet  = FIGURE_PLANET_MAP[taliPattern] || null;

  const repeatingHouses = chart
    .filter((h) => {
      if (Number(h.house) === 1) return false;
      return taliPlanet
        ? FIGURE_PLANET_MAP[h.key] === taliPlanet
        : h.key === taliPattern;
    })
    .map((h) => Number(h.house))
    .sort((a, b) => a - b);

  const ruleLookup = buildNativityLookup(birthSource);

  const findings = repeatingHouses.map((houseNum) => {
    const houseEntry = chart.find((h) => Number(h.house) === houseNum);
    const meanings = ruleLookup[houseNum] || [];
    return {
      houseNumber: houseNum,
      figureHebrew: houseEntry?.hebrew || houseEntry?.key || '',
      meanings,
      hebrewShort: meanings.length
        ? meanings.map((m) => m.hebrew).join(' / ')
        : `בית ${houseNum} — לא נמצא פירוש ספציפי במקור.`,
    };
  });

  const planetNote = taliPlanet ? ` (כוכב: ${taliPlanet})` : '';
  const parts = [`בעל העולה: ${taliHebrew}${planetNote}`];
  if (!findings.length) {
    parts.push(taliPlanet
      ? `כוכב העולה (${taliPlanet}) אינו שב בבתים אחרים בלוח — אין דין מולד ספציפי מן המקור.`
      : 'הצורה אינה חוזרת בבתים אחרים — אין דין מולד ספציפי מן המקור.');
  } else {
    for (const f of findings) {
      const label = taliPlanet
        ? `${taliPlanet} בבית ${f.houseNumber} (${f.figureHebrew})`
        : `חזרה בבית ${f.houseNumber}`;
      parts.push(`${label}: ${f.hebrewShort}`);
    }
  }

  return { taliPattern, taliHebrew, taliPlanet, repeatingHouses, findings, outputHebrew: parts.join('\n') };
}
function computeSpiritualDiagnosticsHouseIndex(chart, spiritualSource) {
  if (!Array.isArray(chart) || !spiritualSource) return null;

  const rules = spiritualSource.rules || [];
  if (!rules.length) return null;

  const houseRuleMap = {};
  for (const rule of rules) {
    const houseNum = rule.sourceLocation?.house;
    if (houseNum) {
      if (!houseRuleMap[houseNum]) houseRuleMap[houseNum] = [];
      houseRuleMap[houseNum].push(rule);
    }
  }

  const findings = chart
    .map((h) => {
      const houseNum = Number(h.house);
      const rulesForHouse = houseRuleMap[houseNum];
      if (!rulesForHouse) return null;
      return {
        houseNumber: houseNum,
        figureHebrew: h.hebrew || h.key || '',
        figureKey: h.key || '',
        isMalefic: MALEFIC_FIGURE_PATTERNS.has(h.key || ''),
        spiritualRules: rulesForHouse,
        appDisplayHebrew: rulesForHouse.map(r => r.appDisplayHebrew).join(' | '),
        categories: rulesForHouse.map(r => r.category),
        hebrewTerms: rulesForHouse.flatMap(r => r.hebrewTerms || []),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.houseNumber - b.houseNumber);

  const alerts = findings.filter(f => f.isMalefic);

  const parts = [`אינדקס אבחון רוחני לפי חאוי:`];
  for (const f of findings) {
    const alertMark = f.isMalefic ? ' ⚠' : '';
    parts.push(`בית ${f.houseNumber} (${f.figureHebrew})${alertMark}: ${f.hebrewTerms.join(', ')}`);
  }
  if (alerts.length) {
    parts.push(`\nסימנים לבדיקה: ${alerts.map(a => `בית ${a.houseNumber} — ${a.figureHebrew}`).join(', ')}`);
  }

  return {
    findings,
    alerts,
    purposeHebrew: spiritualSource.purposeHebrew || '',
    outputHebrew: parts.join('\n'),
  };
}
function computeTrianglesEnrichment(chart) {
  if (!Array.isArray(chart)) return null;

  // Load zodiac map from HAWI_SOURCE if available
  const zodiacMap = HAWI_SOURCE.extendedKnowledge?.trianglesZodiac?.zodiacPlanetaryMap || [];

  const enriched = [1, 7, 10, 15]
    .map((n) => chartHouse(chart, n))
    .filter((h) => h && h.element)
    .map((h) => {
      const planets = ELEMENT_TRIANGLE_PLANETS[h.element] || [];

      // Find zodiac signs whose planet list overlaps with this element's planets
      let zodiacNote = '';
      if (planets.length && zodiacMap.length) {
        const matchingSigns = zodiacMap
          .filter((entry) => {
            if (!Array.isArray(entry.planetsHebrew)) return false;
            return planets.some((p) => entry.planetsHebrew.includes(p));
          })
          .map((entry) => entry.signHebrew);
        if (matchingSigns.length) {
          zodiacNote = ` | מזלות קשורים: ${matchingSigns.join(', ')}`;
        }
      }

      return {
        house: h.house,
        element: h.element,
        figureHebrew: h.hebrew || h.key,
        trianglePlanets: planets,
        zodiacNote,
        hebrewNote: planets.length
          ? `בית ${h.house} (${h.hebrew || h.key}) — יסוד ${h.element} → כוכבי המשולש: ${planets.join(', ')}${zodiacNote}`
          : `בית ${h.house} (${h.hebrew || h.key}) — יסוד ${h.element}${zodiacNote}`,
      };
    });

  if (!enriched.length) return null;
  return { enriched, outputHebrew: enriched.map((e) => e.hebrewNote).join('\n') };
}
const ELEMENT_ILLNESS_TYPE = {
  'אש':    'מרה צהובה — חום, כבד, מרה, בעיות עיכול (חולי אש)',
  'אוויר': 'דם — לחץ דם, עצבים, מחלות נשימה (חולי אוויר)',
  'מים':   'כיח / ריר — ריאות, כליות, בעיות נוזלים (חולי מים)',
  'עפר':   'מרה שחורה — עצבות, עייפות, מחלות כרוניות (חולי עפר)',
};

// מיפוי יסוד → אזור גוף לפי שיטת חאוי (פרק 12 — تسكين الاعضاء)
// מקור: חאוי עמ׳ 12 — אזורי הגוף לפי יסוד הצורה
// יסוד הצורה שנפלה בבית 6 (מחלה) מורה על אזור הגוף בו שוכן החולי
const ELEMENT_BODY_REGION_HAWI = {
  'אש':    'ראש, עיניים ומוח (האזור העליון — חולי אש)',
  'אוויר': 'חזה, כתפיים וידיים (האזור האמצעי-עליון — חולי אוויר)',
  'מים':   'בטן, כבד, כליות ואיברי הרבייה (האזור האמצעי-תחתון — חולי מים)',
  'עפר':   'ירכיים, שוקיים ורגליים (האזור התחתון — חולי עפר)',
};


// ============================================================
// BATCH D: מחלה — האם ימות + סוג הג׳ין (PDF1 p.41-42, p.57-58)
// ============================================================
const DEATH_RISK_FIGURES = new Set(['2121','2122','2222','2112','1221','1212','1111']);
const LIFE_SAVING_FIGURES = new Set(['1122','2211','1222','2212']);

function computeDeathRisk(chart) {
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

function computeJinnType(chart) {
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
function computeWifeVirginityStatus(chart) {
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

function computeWifeChastity(chart) {
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
function computeMarketPrices(chart) {
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

function computeWishFulfillment(chart) {
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

function computeQuerentSorceryCheck(chart) {
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


function computeBodyPartDiagnosisHawi(chart) {
  const h6 = chart.find((h) => Number(h.house) === 6);
  if (!h6?.key) return null;
  const h6El = FIGURE_ELEMENT_MAP_G[h6.key] || h6.element || h6.elementHebrew || '';
  const bodyRegion = ELEMENT_BODY_REGION_HAWI[h6El];
  const figHebrew = h6.hebrew || h6.key;
  if (!h6El || !bodyRegion) return null;
  return {
    figureKey: h6.key,
    figureHebrew: figHebrew,
    element: h6El,
    bodyRegion,
    outputHebrew: `${figHebrew} בבית 6 — יסוד ${h6El} → אזור הגוף הכואב: ${bodyRegion} (חאוי פרק 12)`,
  };
}

function computeGhalibMaghloub(chart) {
  if (!Array.isArray(chart)) return null;
  const getH = (n) => chart.find((h) => Number(h.house) === n);

  const querentNums  = [1, 2, 3, 4];
  const opponentNums = [7, 8, 9, 10];

  let querentPoints = 0;
  let opponentPoints = 0;
  const querentDetails = [];
  const opponentDetails = [];

  for (const n of querentNums) {
    const h = getH(n);
    if (!h?.key) continue;
    const pts = (h.key.match(/1/g) || []).length;
    querentPoints += pts;
    querentDetails.push({ house: n, figure: h.hebrew || h.key, points: pts });
  }
  for (const n of opponentNums) {
    const h = getH(n);
    if (!h?.key) continue;
    const pts = (h.key.match(/1/g) || []).length;
    opponentPoints += pts;
    opponentDetails.push({ house: n, figure: h.hebrew || h.key, points: pts });
  }

  let verdict, verdictHebrew, querentWins;
  if (querentPoints > opponentPoints) {
    verdict = 'ghalib-querent';
    verdictHebrew = `השואל גובר — עולה על יריבו (${querentPoints} מול ${opponentPoints})`;
    querentWins = true;
  } else if (opponentPoints > querentPoints) {
    verdict = 'ghalib-opponent';
    verdictHebrew = `היריב גובר — עולה על השואל (${opponentPoints} מול ${querentPoints})`;
    querentWins = false;
  } else {
    verdict = 'equal';
    verdictHebrew = `תאסוויה — כוחות שקולים (${querentPoints} נקודות לכל צד)`;
    querentWins = null;
  }

  const querentLine = querentDetails.map(d => `ב${d.house}(${d.figure}):${d.points}`).join(', ');
  const opponentLine = opponentDetails.map(d => `ב${d.house}(${d.figure}):${d.points}`).join(', ');

  return {
    querentPoints,
    opponentPoints,
    querentDetails,
    opponentDetails,
    verdict,
    querentWins,
    outputHebrew: `גובר ונכנע (חאוי — ספירת נקודות יחידות):\n  שואל [ב׳ 1-4]: ${querentPoints} | ${querentLine}\n  יריב [ב׳ 7-10]: ${opponentPoints} | ${opponentLine}\n  ${verdictHebrew}`,
  };
}

function computeIllnessElementDiagnosis(chart) {
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
function computeThiefLocationDetails(chart) {
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
function computeEnemyInHousehold(chart) {
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

function computeJumlaAnalysis(chart, topicId) {
  if (!Array.isArray(chart)) return null;

  // جملة = sum of all dot values: فرد (pattern '1') = 1 dot, زوج (pattern '2') = 2 dots
  let jumla = 0;
  for (const house of chart) {
    for (const ch of String(house.key || '')) {
      if (ch === '1') jumla += 1;
      else if (ch === '2') jumla += 2;
    }
  }

  // Islamic modular arithmetic: remainder 0 is treated as the divisor value (e.g. mod4=0 → 4)
  const mod4 = (jumla % 4) || 4;
  const mod3 = (jumla % 3) || 3;
  const mod4ForFriendship = mod4; // same divisor, different table

  const ILLNESS_MAP = {
    1: { hebrewLabel: 'חום / קדחת',           isSorcery: false },
    2: { hebrewLabel: 'רוחות / ריאות / קור', isSorcery: false },
    3: { hebrewLabel: 'כישוף (סיהר)',         isSorcery: true  },
    4: { hebrewLabel: 'רוחות וחום',          isSorcery: false },
  };

  const CHILDREN_MAP = {
    1: 'ייוולד זכר (בן)',
    2: 'תיוולד נקבה (בת)',
    3: 'הפלה / לא ייוולד ילד בעת הזו',
  };

  const FRIENDSHIP_MAP = {
    1: 'שונא אותו',
    2: 'אוהב אותו',
    3: 'אוהב אותו לכאורה בלבד',
    4: 'אין בו טוב',
  };

  const result = { jumla, mod4, mod3 };

  if (topicId === 'spiritualDiagnostics' || topicId === 'illness') {
    const entry = ILLNESS_MAP[mod4];
    result.illnessDiagnosis = {
      remainder: mod4,
      hebrewLabel: entry.hebrewLabel,
      isSorcery: entry.isSorcery,
      outputHebrew: `ג׳ומלה לאבחון מחלה (${jumla} ÷ 4, שארית ${mod4}): ${entry.hebrewLabel}`,
    };
  }

  if (topicId === 'childrenPregnancy') {
    const outcome = CHILDREN_MAP[mod3];
    result.childDiagnosis = {
      remainder: mod3,
      outcome,
      outputHebrew: `ג׳ומלה לשאלת ילדים (${jumla} ÷ 3, שארית ${mod3}): ${outcome}`,
    };
  }

  if (topicId === 'partnership' || topicId === 'friendship') {
    const outcome = FRIENDSHIP_MAP[mod4ForFriendship];
    result.friendshipDiagnosis = {
      remainder: mod4ForFriendship,
      outcome,
      outputHebrew: `ג׳ומלה לשאלת ידידות/שותפות (${jumla} ÷ 4, שארית ${mod4ForFriendship}): ${outcome}`,
    };
  }

  return result;
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

function computeMarriageFigureForecast(chart) {
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
const FIRST_FIGURE_REPETITIONS = {
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

function computeFirstFigureRepetition(chart) {
  const h1Figure = chart.find((h) => Number(h.house) === 1);
  if (!h1Figure) return null;

  const firstKey = h1Figure.key || '';
  const firstHebrew = h1Figure.hebrew || h1Figure.key;

  const allOccurrences = chart.filter((h) => h.key === firstKey);
  const count = allOccurrences.length;

  const meanings = FIRST_FIGURE_REPETITIONS[firstKey];
  const countIndex = Math.min(count - 1, 3);
  const meaning = meanings ? meanings[countIndex] : null;

  if (!meaning) return null;

  return {
    figureKey: firstKey,
    figureHebrew: firstHebrew,
    count,
    meaning,
    outputHebrew: `צורה ראשונה בלוח: "${firstHebrew}" (חוזרת ${count}×) — ${meaning}`,
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

function computeYearlyFigureForecast(chart) {
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
function computeAlternativeNameExtraction(chart) {
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

function computePhysicalDescriptionForHouse(chart, houseNumber) {
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
function computePrisonerAnalysis(chart) {
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
function computeSeaVoyageRisks(chart) {
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

// HAWI_DHAMIR_DIRECTIONS_VALIDATION.forcedOrChosenTravelRules (חאוי עמ׳ 33)
function computeForcedTravelAnalysis(chart) {
  const h1 = chartHouse(chart, 1);
  if (!h1?.key) return null;

  const h3  = chartHouse(chart, 3);
  const h9  = chartHouse(chart, 9);
  const h14 = chartHouse(chart, 14);

  const inH3  = h3  && h3.key  === h1.key;
  const inH9  = h9  && h9.key  === h1.key;
  const inH14 = h14 && h14.key === h1.key;

  const h3Nahs = h3?.fortune?.includes('מזיק');
  const h9Nahs = h9?.fortune?.includes('מזיק');

  const isForced  = (inH3 && h3Nahs) || (inH9 && h9Nahs);
  const isChosen  = (inH3 && !h3Nahs) || (inH9 && !h9Nahs) || inH14;

  let travelType = 'unknown';
  let hebrewNote;
  if (isForced) {
    const byHouse = (inH3 && h3Nahs) ? 3 : 9;
    travelType = 'forced';
    hebrewNote = `הנסיעה כפויה — הצורה הראשונה מופיעה בבית ${byHouse} עם מזל מזיק. לפי חאוי (עמ׳ 33): השואל נוסע שלא ברצונו.`;
  } else if (isChosen) {
    const byHouse = inH3 ? 3 : inH9 ? 9 : 14;
    travelType = 'chosen';
    hebrewNote = `הנסיעה רצונית — הצורה הראשונה מופיעה בבית ${byHouse}. לפי חאוי (עמ׳ 33): השואל מבקש את הנסיעה מרצונו.`;
  } else {
    hebrewNote = 'אין סימן ברור לנסיעה כפויה או רצונית לפי חוקי תוקף ההכאה (חאוי עמ׳ 33).';
  }

  return { travelType, hebrewNote };
}

// HAWI_INTRODUCTION_MAHW_THABAT — יסודות לתצוגה בנושא foundations
function computeFoundationsDisplay() {
  const source = HAWI_SOURCE.extendedKnowledge?.introductionMahwThabat;
  if (!source) return null;

  const lines = [];
  const terms = source.mahwThabatCore?.hebrewTerms;
  if (terms) {
    lines.push(`מונחי יסוד: מחיקה, קיום, הכאה, חלוקה, הולדה`);
  }
  const bt = source.boardTerminology;
  if (bt) {
    lines.push(`מרכיבי הלוח: ${bt.mothers} ← ${bt.daughters} ← ${bt.granddaughters} ← ${bt.witnesses} ← ${bt.judge} ← ${bt.sentence}`);
  }
  for (const p of (source.figureGenerationPrinciples || []).slice(0, 3)) {
    if (p.hebrew) lines.push(p.hebrew);
  }

  return {
    lines,
    outputHebrew: lines.join('\n'),
    sourceRef: source.sourceSectionHebrew || 'מבוא חאוי — שער מחיקה וקיום',
  };
}


// ============================================================
// BATCH G: 8 פונקציות חדשות מכשף אל-אסרר (Task 15)
// ============================================================

const FIGURE_FORTUNE_MAP = {
  '1111':'מזיק','1112':'ממוזג-מיטיב','1121':'מזיק','1122':'מיטיב',
  '1211':'ממוזג','1212':'מזיק','1221':'מזיק','1222':'מיטיב',
  '2111':'מזיק','2112':'ממוזג','2121':'ממוזג-מזיק','2122':'מזיק',
  '2211':'מיטיב','2212':'מיטיב','2221':'מזיק','2222':'מזיק',
};
function getDerivedFortune(pattern) {
  return FIGURE_FORTUNE_MAP[pattern] || null;
}
function getDerivedFortuneTone(pattern) {
  const f = getDerivedFortune(pattern);
  if (!f) return 0;
  if (f === 'מיטיב') return 1;
  if (f === 'מזיק') return -1;
  return 0;
}
function deriveFigureG(p1, p2) {
  if (!p1 || !p2 || p1.length !== 4 || p2.length !== 4) return null;
  return p1.split('').map((c, i) => c === p2[i] ? '2' : '1').join('');
}
const isBeneficG = (h) => h && String(h.fortune || '').includes('מיטיב') && !String(h.fortune || '').startsWith('ממוזג-מזיק');
const isMaleficG = (h) => h && String(h.fortune || '').includes('מזיק');
const isIncomingG = (h) => h && (h.direction === 'incoming' || (h.key && ['2111','2112','2121','2122','2211','2212','2221','2222'].includes(h.key)));

const FIGURE_HEBREW_G = {
  '1111':'דרך','1112':'סף יוצא','1121':'נלחם','1122':'כבוד יוצא',
  '1211':'בר הלחי','1212':'ממון יוצא','1221':'סוהר','1222':'נשוא ראש',
  '2111':'סף נכנס','2112':'חיבור','2121':'ממון נכנס','2122':'אדום',
  '2211':'כבוד נכנס','2212':'לבן','2221':'שפל ראש','2222':'קהלה',
};

// יסודות הצורות — מקור: כשף אל-אסרר עמ' 43-67
const FIGURE_ELEMENT_MAP_G = {
  '1112':'אש','1122':'אש','1212':'אש','1222':'אש',
  '1121':'אוויר','2111':'אוויר','2112':'אוויר','2122':'אוויר',
  '1111':'מים','1211':'מים','2211':'מים','2212':'מים',
  '1221':'עפר','2121':'עפר','2221':'עפר','2222':'עפר',
};
// ערכי יסוד לשיטת ח׳לף הברברי (אבג׳ד): אש=1, אוויר=2, מים=4, עפר=8
const ELEMENT_ABJAD_VALUES = { 'אש':1, 'אוויר':2, 'מים':4, 'עפר':8 };

// ── 1. computeDreamH9 — חלום (כשף עמ' 254) ──────────────────────────────────
function computeDreamH9(chart) {
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

// ── 2. computeLostAnimalReturn — האם הבהמה תחזור (כשף עמ' 202) ───────────────
function computeLostAnimalReturn(chart) {
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

// ── 3. computeAnimalTypeByH6 — סוג הבהמה לפי בית 6 (כשף עמ' 201) ─────────────
const ANIMAL_BY_H6_KEY = {
  '2122': 'כבשים / אילים',
  '1121': 'שוורים',
  '1122': 'סוסים',
  '1112': 'סוסים',
  '1221': 'גמלים',
  '2221': 'חמורים',
  '1212': 'פרדות',
};
function computeAnimalTypeByH6(chart) {
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

// ── 4. computeKingRulerStatus — מלך/שליט (כשף עמ' 257) ──────────────────────
function computeKingRulerStatus(chart) {
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

// ── 5. computeEnemyPresenceCheck — בדיקת אויב (כשף עמ' 271) ─────────────────
function computeEnemyPresenceCheck(chart) {
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

// ── 6. computePrisonerReleaseCheck — שחרור אסיר (כשף עמ' 272) ───────────────
function computePrisonerReleaseCheck(chart) {
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

// ── 7. computeFatherParentStatus — מצב האב/הנכס (כשף עמ' 184) ───────────────
function computeFatherParentStatus(chart) {
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

// ── 8. computeParnasaLivelihood — פרנסה ומחיה (כשף עמ' 181-182) ─────────────
function computeParnasaLivelihood(chart) {
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

// ── 9. computePregnancyMonths — כמה חודשים הריון (חאוי עמ' 43, שיטת ח׳לף הברברי) ─
function computePregnancyMonths(chart) {
  if (!Array.isArray(chart) || chart.length < 16) return null;
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h5  = getH(5);
  const h6  = getH(6);
  const h11 = getH(11);
  if (!h5?.key || !h6?.key || !h11?.key) return null;

  let total = 0;
  const details = [];
  for (const [label, h] of [['ב5', h5], ['ב6', h6], ['ב11', h11]]) {
    const pattern = h.key;
    const element = FIGURE_ELEMENT_MAP_G[pattern] || null;
    if (!element) continue;
    const elemVal  = ELEMENT_ABJAD_VALUES[element] || 0;
    const oddCount = pattern.split('').filter((c) => c === '1').length;
    const contrib  = oddCount * elemVal;
    total += contrib;
    const figHebrew = FIGURE_HEBREW_G[pattern] || pattern;
    details.push(`${label} ${figHebrew} (${element}=${elemVal}) × ${oddCount} = ${contrib}`);
  }
  let months = total;
  while (months > 9) months -= 9;
  if (months === 0) months = 9;
  return {
    months,
    total,
    details,
    outputHebrew: `חודשי הריון: ${details.join(', ')} → סה״כ ${total} → ${months} חודשים עברו מן ההריון`,
  };
}

// ── 10. computePrisonerGuilty — מי גרם לכליאה (הקול הכולל עמ' 55) ─────────
function computePrisonerGuilty(chart) {
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
function computeDebts(chart) {
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
function computeIllnessTypeIsqat(chart) {
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
function computeSorcererH9(chart) {
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

// ── 14. computeDiggingDirection — כיוון לחפירה/חיפוש (חאוי פ' 16) ───────────
function computeDiggingDirection(chart) {
  if (!Array.isArray(chart) || chart.length < 16) return null;
  const getH = (n) => chart.find((h) => Number(h.house) === n);
  const h1 = getH(1); const h7 = getH(7);
  const h4 = getH(4); const h10 = getH(10);
  if (!h1?.key || !h7?.key) return null;

  const deriveEW = deriveFigureG(h1.key, h7.key);
  const deriveNS = (h4?.key && h10?.key) ? deriveFigureG(h4.key, h10.key) : null;
  const elEW = deriveEW ? (FIGURE_ELEMENT_MAP_G[deriveEW] || null) : null;
  const elNS = deriveNS ? (FIGURE_ELEMENT_MAP_G[deriveNS] || null) : null;
  const dirEW = elEW ? ELEMENT_DIRECTION[elEW] : null;
  const dirNS = elNS ? ELEMENT_DIRECTION[elNS] : null;
  const figEWHebrew = deriveEW ? (FIGURE_HEBREW_G[deriveEW] || deriveEW) : '—';
  const figNSHebrew = deriveNS ? (FIGURE_HEBREW_G[deriveNS] || deriveNS) : '—';

  const lines = [];
  const h1Heb = FIGURE_HEBREW_G[h1.key] || h1.key;
  const h7Heb = FIGURE_HEBREW_G[h7.key] || h7.key;
  lines.push(`ב1 (${h1Heb}) + ב7 (${h7Heb}) → ${figEWHebrew}${elEW ? ` (${elEW})` : ''} → ${dirEW || 'כיוון לא מפורש'}`);
  if (deriveNS) {
    const h4Heb  = h4  ? (FIGURE_HEBREW_G[h4.key]  || h4.key)  : '—';
    const h10Heb = h10 ? (FIGURE_HEBREW_G[h10.key] || h10.key) : '—';
    lines.push(`ב4 (${h4Heb}) + ב10 (${h10Heb}) → ${figNSHebrew}${elNS ? ` (${elNS})` : ''} → ${dirNS || 'כיוון לא מפורש'}`);
  }
  return { dirEW, dirNS, outputHebrew: lines.join('\n') };
}

// ── 15. computeHiddenTreasureH2 — מטמון/כנוז (הקול הכולל עמ' 24) ───────────
function computeHiddenTreasureH2(chart) {
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
function computeH3Topics(chart) {
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
function computeH4Secrets(chart) {
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
function computeIllnessCauseH4(chart) {
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
function computeCelebrationsH5(chart) {
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

function buildBoardAnalysis(board, topicId, mainHouses) {
  if (!board || !Array.isArray(board.chart)) {
    return {
      hasBoard: false,
      noteHebrew: 'לא התקבל לוח גורל מלא.',
      houses: [],
    };
  }

  const focusHouseNumber = Number(board.focusHouseNumber || mainHouses[0] || 1);

  const selectedHouseNumbers = Array.from(new Set([
    ...mainHouses,
    focusHouseNumber,
    13,
    14,
    15,
    16,
  ])).filter(Boolean);

  const adversarialHouseNums = new Set(ADVERSARIAL_HOUSES_BY_TOPIC[topicId] || []);

  const houses = selectedHouseNumbers
    .map((n) => getHouse(board, n))
    .filter(Boolean)
    .map((house) => {
      const dir = getFigureDirection(house.key || null);
      const figureFull = HAWI_FIGURE_NAMES_BY_ID[house.key] || null;
      const hazz = figureFull ? calculateHazz(figureFull, house.house) : null;
      return {
        house: house.house,
        houseHebrew: house.houseHebrew || null,
        figureHebrew: house.hebrew || house.figureHebrew || null,
        figureKey: house.key || null,
        fortune: house.fortune || null,
        movement: house.movement || null,
        element: house.element || null,
        tone: judgeHouseTone(house),
        transit: getTransitMeaningForHouse(house, topicId),
        figureState: getFigureStateForHouse(house),
        houseState: getHouseStateColor(house.house),
        houseFortuneTone: getHouseFortuneTone(house.house),
        isAdversarial: adversarialHouseNums.has(Number(house.house)),
        direction: dir,
        directionHebrew: getFigureDirectionHebrew(dir),
        isNaturalFigure: !!(house.key && NATURAL_HOUSE_FIGURES[house.house] === house.key),
        seventhFigure: getSeventhFigure(house.key || null),
        quadrant: HOUSE_QUADRANT(house.house),
        hazz,
        hazzCount: hazz?.count ?? 0,
        hazzStrength: hazz ? getHazzStrengthLabel(hazz.count) : null,
        seekerSoughtHebrew: figureFull?.seekerSoughtHebrew || null,
        seekerStatus: figureFull?.seekerStatus || null,
        zodiacHebrew: figureFull?.zodiacHebrew || null,
        ichchhaHebrew: figureFull?.ichchhaHebrew || null,
        topicRole: (TOPIC_HOUSE_ROLES[topicId] || {})[Number(house.house)] || null,
      };
    });

  const focusHouse = houses.find((h) => Number(h.house) === focusHouseNumber) || null;
  const witness13 = houses.find((h) => Number(h.house) === 13) || null;
  const witness14 = houses.find((h) => Number(h.house) === 14) || null;
  const judge15 = houses.find((h) => Number(h.house) === 15) || null;
  const sentence16 = houses.find((h) => Number(h.house) === 16) || null;
  const dhamirHouse = computeDhamirHouse(board);
  const dhamirByMizan = computeDhamirByMizanTracing(board.chart);
  const boardScore = computeBoardScore(board.chart);
  const ittisalat = computeIttisalat(board.chart, focusHouseNumber, mainHouses);
  const house1Analysis = computeHouse1Analysis(board.chart, topicId);
  const topicConnections = computeTopicConnections(board.chart, topicId);
  const tahasil = computeTahasil(board.chart, topicId);
  const asala = computeAsala(board.chart);
  const lifeDeathAnalysis = (topicId === 'missingPerson') ? computeLifeDeath(board.chart) : null;
  const treasureLocation = (topicId === 'hiddenTreasure') ? computeTreasureLocation(board.chart) : null;
  const nameExtractionHouses = NAME_EXTRACTION_HOUSES_BY_TOPIC[topicId] || [];
  const nameLetters = nameExtractionHouses.length > 0
    ? nameExtractionHouses.map((e) => computeNameLetters(board.chart, e.house, e.labelOverride)).filter(Boolean)
    : null;

  const authorityStateAnalysis = (topicId === 'authorityState')
    ? computeAuthorityStateAnalysis(board.chart, HAWI_SOURCE.extendedKnowledge?.authorityStateRulers) : null;

  const yearlyForecastAnalysis = (topicId === 'yearlyForecast')
    ? computeYearlyForecastAnalysis(
        board.chart,
        HAWI_SOURCE.extendedKnowledge?.yearlyPricesForecast,
        HAWI_SOURCE.extendedKnowledge?.rainWeatherForecast
      ) : null;

  const birthNativityAnalysis = (topicId === 'birthNativity')
    ? computeBirthNativityAnalysis(board.chart, HAWI_SOURCE.extendedKnowledge?.birthNativity) : null;

  const spiritualDiagnosticsHouseIndex = (topicId === 'spiritualDiagnostics')
    ? computeSpiritualDiagnosticsHouseIndex(board.chart, HAWI_SOURCE.extendedKnowledge?.spiritualDiagnosticsIndex) : null;

  const trianglesEnrichment = (['yearlyForecast', 'birthNativity', 'authorityState'].includes(topicId))
    ? computeTrianglesEnrichment(board.chart) : null;
  const directionQuadrant = (['travel', 'hiddenTreasure', 'missingPerson'].includes(topicId))
    ? computeDirectionQuadrant(board.chart) : null;

  const illnessElementDiagnosis = (topicId === 'illness')
    ? computeIllnessElementDiagnosis(board.chart) : null;

  const bodyPartDiagnosisHawi = (topicId === 'illness')
    ? computeBodyPartDiagnosisHawi(board.chart) : null;

  const ghalibMaghloub = (['disputes', 'enemies', 'partnership', 'theft'].includes(topicId))
    ? computeGhalibMaghloub(board.chart) : null;

  const deathRisk = (topicId === 'illness')
    ? computeDeathRisk(board.chart) : null;

  const jinnType = (['spiritualDiagnostics'].includes(topicId))
    ? computeJinnType(board.chart) : null;

  const thiefLocationDetails = (['theft', 'enemies'].includes(topicId))
    ? computeThiefLocationDetails(board.chart) : null;

  const wifeVirginityStatus = (topicId === 'marriage')
    ? computeWifeVirginityStatus(board.chart) : null;

  const wifeChastity = (topicId === 'marriage')
    ? computeWifeChastity(board.chart) : null;

  const marketPrices = (['commerce', 'yearlyForecast', 'authorityState'].includes(topicId))
    ? computeMarketPrices(board.chart) : null;

  const wishFulfillment = (['completion', 'loveHate'].includes(topicId))
    ? computeWishFulfillment(board.chart) : null;

  const querentSorceryCheck = (['spiritualDiagnostics', 'authorityState'].includes(topicId))
    ? computeQuerentSorceryCheck(board.chart) : null;

  const enemyInHousehold = (topicId === 'enemies')
    ? computeEnemyInHousehold(board.chart) : null;

  // ── BATCH G: 8 new Kashf-sourced analysis functions ────────────────────────
  const dreamH9 = (['foundations', 'generalReading', 'travel', 'siblings', 'religion'].includes(topicId))
    ? computeDreamH9(board.chart) : null;

  const lostAnimalReturn = (topicId === 'lostAnimal')
    ? computeLostAnimalReturn(board.chart) : null;

  const animalTypeH6 = (topicId === 'lostAnimal')
    ? computeAnimalTypeByH6(board.chart) : null;

  const kingRulerStatus = (topicId === 'authorityState')
    ? computeKingRulerStatus(board.chart) : null;

  const enemyPresenceCheck = (['enemies', 'fear', 'prisoner'].includes(topicId))
    ? computeEnemyPresenceCheck(board.chart) : null;

  const prisonerReleaseCheck = (topicId === 'prisoner')
    ? computePrisonerReleaseCheck(board.chart) : null;

  const fatherParentStatus = (['foundations', 'generalReading', 'hiddenTreasure'].includes(topicId))
    ? computeFatherParentStatus(board.chart) : null;

  const parnasaLivelihood = (['commerce', 'generalReading', 'yearlyForecast'].includes(topicId))
    ? computeParnasaLivelihood(board.chart) : null;

  const pregnancyMonths = (topicId === 'childrenPregnancy')
    ? computePregnancyMonths(board.chart) : null;

  const prisonerGuilty = (topicId === 'prisoner')
    ? computePrisonerGuilty(board.chart) : null;

  const debts = (topicId === 'loan')
    ? computeDebts(board.chart) : null;

  // ── BATCH H: 8 more topic functions ──────────────────────────────────────────
  const illnessTypeIsqat = (topicId === 'illness')
    ? computeIllnessTypeIsqat(board.chart) : null;

  const sorcererH9 = (topicId === 'spiritualDiagnostics')
    ? computeSorcererH9(board.chart) : null;

  const diggingDirection = (topicId === 'hiddenTreasure')
    ? computeDiggingDirection(board.chart) : null;

  const hiddenTreasureH2 = (topicId === 'hiddenTreasure')
    ? computeHiddenTreasureH2(board.chart) : null;

  const h3Topics = (topicId === 'siblings')
    ? computeH3Topics(board.chart) : null;

  const h4Secrets = (['hiddenTreasure', 'foundations'].includes(topicId))
    ? computeH4Secrets(board.chart) : null;

  const illnessCauseH4 = (topicId === 'illness')
    ? computeIllnessCauseH4(board.chart) : null;

  const celebrationsH5 = (topicId === 'childrenPregnancy')
    ? computeCelebrationsH5(board.chart) : null;

  const jumlaAnalysis = (['spiritualDiagnostics', 'illness', 'childrenPregnancy', 'partnership'].includes(topicId))
    ? computeJumlaAnalysis(board.chart, topicId) : null;

  const marriageFigureForecast = (topicId === 'marriage')
    ? computeMarriageFigureForecast(board.chart) : null;

  const yearlyFigureForecast = (topicId === 'yearlyForecast')
    ? computeYearlyFigureForecast(board.chart) : null;

  const alternativeNameExtraction = (['enemies', 'spiritualDiagnostics', 'missingPerson', 'prisoner', 'partnership', 'theft'].includes(topicId))
    ? computeAlternativeNameExtraction(board.chart) : null;

  const physicalDescriptionThief = (['enemies', 'disputes', 'theft'].includes(topicId))
    ? computePhysicalDescriptionForHouse(board.chart, 7) : null;

  const physicalDescriptionMissing = (topicId === 'missingPerson')
    ? computePhysicalDescriptionForHouse(board.chart, 7) : null;

  const prisonerAnalysis = (topicId === 'prisoner')
    ? computePrisonerAnalysis(board.chart) : null;

  const seaVoyageRisks = (topicId === 'seaVoyage')
    ? computeSeaVoyageRisks(board.chart) : null;

  const firstFigureRepetition = computeFirstFigureRepetition(board.chart);

  // HAWI_DHAMIR_DIRECTIONS_VALIDATION — נסיעה כפויה/רצונית (חאוי עמ׳ 33)
  const forcedTravelAnalysis = (topicId === 'travel')
    ? computeForcedTravelAnalysis(board.chart) : null;

  // HAWI_INTRODUCTION_MAHW_THABAT — יסודות לתצוגה בנושא foundations
  const foundationsDisplay = (topicId === 'foundations')
    ? computeFoundationsDisplay() : null;

  // Source quality — how many key houses have explicit transit data from the source.
  // Some houses are genuinely absent from the Hawi text itself (verified across multiple books).
  const keyHouseNums = Array.from(new Set([1, focusHouseNumber, 13, 14, 15, 16]));
  const keyHouseTransitData = keyHouseNums.map((n) => {
    const h = houses.find((x) => Number(x.house) === n);
    return {
      house: n,
      hasTransit: !!(h?.transit),
      hasState: !!(h?.figureState?.speakingState),
      figureHebrew: h?.figureHebrew || null,
    };
  });
  const missingTransitHouses = keyHouseTransitData.filter((h) => !h.hasTransit).map((h) => h.house);
  const sourceQuality = {
    keyHouseNums,
    keyHouseTransitData,
    transitAvailableCount: keyHouseTransitData.filter((h) => h.hasTransit).length,
    totalKeyHouses: keyHouseNums.length,
    missingTransitHouses,
    isFullyCovered: missingTransitHouses.length === 0,
    noteHebrew: missingTransitHouses.length > 0
      ? `בתים ${missingTransitHouses.join(', ')} — מעבר הצורה לא מפורש במקור חאוי. הפסיקה מסתמכת על מזל הצורה הכללי בלבד.`
      : 'כל הבתים העיקריים מכוסים במקור.',
  };

  const h1Key = board.chart.find((h) => Number(h.house) === 1)?.key;
  const h1Seventh = getSeventhFigure(h1Key);
  const seventhOfHouse1Found = h1Seventh
    ? board.chart.find((h) => h.key === h1Seventh && Number(h.house) !== 1)
    : null;

  // Task 11: תפקידים ספציפיים של בתים לפי נושא (מהכשף)
  const houseRoles = TOPIC_HOUSE_ROLES[topicId] || {};
  const specificRolesHebrew = Object.entries(houseRoles).map(([hNum, role]) => {
    const h = houses.find((x) => Number(x.house) === Number(hNum));
    if (!h) return null;
    const fig = h.figureHebrew || h.figureKey || '';
    const fort = h.fortune || '';
    const transit = h.transit?.meaning || '';
    return `${role}: ${fig}${fort ? ` (${fort})` : ''}${transit ? ` — ${transit}` : ''}`;
  }).filter(Boolean);

  return {
    hasBoard: true,
    focusHouseNumber,
    mainHouses,
    houses,
    focusHouse,
    witnesses: [witness13, witness14].filter(Boolean),
    judge: judge15,
    sentence: sentence16,
    dhamirHouse,
    dhamirByMizan,
    boardScore,
    ittisalat,
    house1Analysis,
    topicConnections,
    tahasil,
    asala,
    lifeDeathAnalysis,
    treasureLocation,
    nameLetters,
    authorityStateAnalysis,
    yearlyForecastAnalysis,
    birthNativityAnalysis,
    spiritualDiagnosticsHouseIndex,
    trianglesEnrichment,
    directionQuadrant,
    illnessElementDiagnosis,
    bodyPartDiagnosisHawi,
    ghalibMaghloub,
    deathRisk,
    jinnType,
    thiefLocationDetails,
    wifeVirginityStatus,
    wifeChastity,
    marketPrices,
    wishFulfillment,
    querentSorceryCheck,
    enemyInHousehold,
    jumlaAnalysis,
    marriageFigureForecast,
    yearlyFigureForecast,
    alternativeNameExtraction,
    physicalDescriptionThief,
    physicalDescriptionMissing,
    prisonerAnalysis,
    seaVoyageRisks,
    firstFigureRepetition,
    forcedTravelAnalysis,
    foundationsDisplay,
    sourceQuality,
    seventhOfHouse1: seventhOfHouse1Found
      ? { pattern: h1Seventh, foundInHouse: Number(seventhOfHouse1Found.house), figureHebrew: seventhOfHouse1Found.hebrew || h1Seventh }
      : null,
    specificRolesHebrew,
    dreamH9,
    lostAnimalReturn,
    animalTypeH6,
    kingRulerStatus,
    enemyPresenceCheck,
    prisonerReleaseCheck,
    fatherParentStatus,
    parnasaLivelihood,
    pregnancyMonths,
    prisonerGuilty,
    debts,
    illnessTypeIsqat,
    sorcererH9,
    diggingDirection,
    hiddenTreasureH2,
    h3Topics,
    h4Secrets,
    illnessCauseH4,
    celebrationsH5,
  };
}

function scoreBoard(boardAnalysis) {
  if (!boardAnalysis.hasBoard) {
    return {
      score: 0,
      grade: 'unknown',
      hebrew: 'אין עדיין לוח מלא לפסיקה.',
    };
  }

  const judgeVerdict = buildJudgeVerdict(boardAnalysis);
  const judge = boardAnalysis.judge;
  const w1 = boardAnalysis.witnesses?.[0];
  const w2 = boardAnalysis.witnesses?.[1];
  const focus = boardAnalysis.focusHouse;

  const judgeTone = (getFigureStateHouseTone(judge?.figureState) ?? getFigureFortuneTone(judge));
  const w1Tone = w1 ? (getFigureStateHouseTone(w1?.figureState) ?? getFigureFortuneTone(w1)) : 0;
  const w2Tone = w2 ? (getFigureStateHouseTone(w2?.figureState) ?? getFigureFortuneTone(w2)) : 0;
  const focusTone = focus ? (getFigureStateHouseTone(focus?.figureState) ?? getFigureFortuneTone(focus)) : 0;

  const judgeMulti = getSpeakingStateMultiplier(judge?.figureState);
  const w1Multi = getSpeakingStateMultiplier(w1?.figureState);
  const w2Multi = getSpeakingStateMultiplier(w2?.figureState);
  const focusMulti = getSpeakingStateMultiplier(focus?.figureState);

  const quesitedHouseNum = boardAnalysis.tahasil?.quesitedHouseNum;
  const quesitedEntry = quesitedHouseNum
    ? boardAnalysis.houses?.find?.((h) => Number(h.house) === quesitedHouseNum)
    : null;
  const quesitedTone = quesitedEntry
    ? (getFigureStateHouseTone(quesitedEntry?.figureState) ?? getFigureFortuneTone(quesitedEntry))
    : 0;
  const quesitedMulti = getSpeakingStateMultiplier(quesitedEntry?.figureState);

  const directionModifier = (entry) => {
    const d = entry?.direction;
    if (d === 'incoming') return 0.3;
    if (d === 'outgoing') return -0.3;
    if (d === 'stable')   return 0.15;
    return 0;
  };

  // Natural figure bonus: when the figure in a key house matches the natural (jadwal) figure of that house,
  // the judgment is especially strong per Hawi. Adds ±0.5 for judge, ±0.25 for others.
  const naturalBonus = (entry, weight) => {
    if (!entry?.isNaturalFigure) return 0;
    const tone = getFigureFortuneTone(entry);
    return tone * weight;
  };

  const topicConnectionBonus = (boardAnalysis.topicConnections?.checks || [])
    .filter((c) => c.connected)
    .length * 0.5;

  // Dhamir (الضمير) — the hidden intention behind the question. Mizan-tracing is primary.
  // When dhamir agrees with judge → confirms ruling. When opposed → signals inner conflict or change.
  const dhamirFortune = boardAnalysis.dhamirByMizan?.primaryFortune || boardAnalysis.dhamirHouse?.fortune || '';
  const dhamirTone = dhamirFortune.includes('מיטיב') ? 1 : dhamirFortune.includes('מזיק') ? -1 : 0;

  const judgePattern = judge?.figureKey;
  const judgeRepeatCount = judgePattern
    ? ((boardAnalysis.ittisalat?.figureConnections || []).find((fc) => fc.figureKey === judgePattern)?.houses?.length || 1)
    : 1;
  const repetitionBonus = Math.max(0, judgeRepeatCount - 1) * 0.4;

  const h1toFocus = boardAnalysis.ittisalat?.questioner_to_focus;
  const aspectBonus = (h1toFocus?.type === 'same-figure') ? 1.0
    : (h1toFocus?.type === 'aspect') ? 0.5 : 0;

  // Weights: judge(4) + w1(1) + w2(1) + focus(2) + quesited(2) + direction + natural + connections + dhamir(1.5) + repetition + aspect
  const rawScore = (judgeTone * 4 * judgeMulti +
    w1Tone * 1 * w1Multi +
    w2Tone * 1 * w2Multi +
    focusTone * 2 * focusMulti +
    quesitedTone * 2 * quesitedMulti +
    directionModifier(quesitedEntry) +
    directionModifier(focus) +
    naturalBonus(judge, 0.5) +
    naturalBonus(quesitedEntry, 0.25) +
    naturalBonus(focus, 0.25) +
    topicConnectionBonus +
    dhamirTone * 1.5 +
    repetitionBonus +
    aspectBonus);
  const score = Math.round(rawScore * 2);

  const reasons = [];
  if (judge) {
    const judgeSpeak = getSpeakingStateHebrew(judge.figureState);
    reasons.push('בית 15 (דיין): ' + (judge.figureHebrew || '') + ' — ' + (judge.fortune || '') +
      (judgeSpeak ? ` [${judgeSpeak}]` : ''));
  }
  if (w1) {
    const w1Speak = getSpeakingStateHebrew(w1.figureState);
    reasons.push('עד ראשון: ' + (w1.figureHebrew || '') + ' — ' + (w1.fortune || '') +
      (w1Speak ? ` [${w1Speak}]` : ''));
  }
  if (w2) {
    const w2Speak = getSpeakingStateHebrew(w2.figureState);
    reasons.push('עד שני: ' + (w2.figureHebrew || '') + ' — ' + (w2.fortune || '') +
      (w2Speak ? ` [${w2Speak}]` : ''));
  }
  if (focus) {
    const focusSpeak = getSpeakingStateHebrew(focus.figureState);
    reasons.push('הבית המרכזי (בית ' + (focus.house || '') + '): ' + (focus.figureHebrew || '') + ' — ' + (focus.fortune || '') +
      (focusSpeak ? ` [${focusSpeak}]` : ''));
  }
  if (quesitedEntry && quesitedHouseNum !== (focus?.house)) {
    const qSpeak = getSpeakingStateHebrew(quesitedEntry?.figureState);
    reasons.push('בית הנשאל (בית ' + quesitedHouseNum + '): ' + (quesitedEntry.figureHebrew || '') + ' — ' + (quesitedEntry.fortune || '') +
      (qSpeak ? ` [${qSpeak}]` : ''));
  }
  if (topicConnectionBonus > 0) {
    reasons.push('קשרי נושא: ' + (boardAnalysis.topicConnections?.checks || []).filter((c) => c.connected).map((c) => c.role).join(', '));
  }
  if (dhamirTone !== 0) {
    const dhamirHouseNum = boardAnalysis.dhamirByMizan?.primaryHouseNumber || boardAnalysis.dhamirHouse?.houseNumber || '';
    const dhamirNote = dhamirTone > 0 ? ' — מאשר את הדיין' : ' — סותר את הדיין, זהירות';
    reasons.push(`מחשבת השואל (בית ${dhamirHouseNum}): ${dhamirFortune}${dhamirNote}`);
  }
  if (repetitionBonus > 0) {
    reasons.push(`צורת הדיין (${judge?.figureHebrew || ''}) חוזרת ${judgeRepeatCount} פעמים בלוח — הדין מחוזק`);
  }
  if (aspectBonus > 0) {
    reasons.push(`קשר בין בית 1 לבית המרכזי: ${h1toFocus?.hebrewShort || (aspectBonus >= 1 ? 'צורה זהה' : 'מבט')}`);
  }
  return {
    score,
    grade: judgeVerdict.grade,
    hebrew: judgeVerdict.hebrewFull,
    hebrewShort: judgeVerdict.hebrewShort,
    reasons,
    judgeVerdict,
  };
}

function buildFinalConclusion(topicHebrew, boardScore, boardAnalysis, relevantRules) {
  if (!boardAnalysis.hasBoard) {
    return 'עדיין אין לוח גורל מלא, לכן ניתן רק לזהות את נושא השאלה ואת שכבות הידע המתאימות.';
  }

  const judge = boardAnalysis.judge;
  const sentence = boardAnalysis.sentence;
  const judgeVerdict = boardScore.judgeVerdict || null;

  const parts = [];

  const asala = boardAnalysis.asala;
  if (asala && !asala.isRadical) {
    parts.push(asala.hebrewNote);
  }

  const judgeHebrew = judge?.figureHebrew || 'לא מזוהה';
  const judgeFortune = judge?.fortune ? ` (${judge.fortune})` : '';
  const judgeNaturalNote = judge?.isNaturalFigure ? ' [ביתה הטבעי — הדיין בביתו הטבעי, כוח הפסיקה מוכפל]' : '';
  parts.push(`הדיין בבית 15: ${judgeHebrew}${judgeFortune}${judgeNaturalNote} — ${judgeVerdict?.hebrewShort || boardScore.hebrewShort || 'תשובה לא מוכרעת'}.`);

  const dhamirByMizan = boardAnalysis.dhamirByMizan;
  const dhamirHouseEntry = boardAnalysis.dhamirHouse;
  const dhamirFort = dhamirByMizan?.primaryFortune || dhamirHouseEntry?.fortune || '';
  const dhamirToneConclusion = dhamirFort.includes('מיטיב') ? 1 : dhamirFort.includes('מזיק') ? -1 : 0;
  const judgeToneConclusion = judgeVerdict?.judgeTone ?? 0;
  if (dhamirByMizan?.traces?.length > 0 && dhamirToneConclusion !== 0) {
    const confirmingConclusion = (judgeToneConclusion > 0 && dhamirToneConclusion > 0) || (judgeToneConclusion < 0 && dhamirToneConclusion < 0);
    const dhamirLabel = confirmingConclusion ? 'מאשר את הדיין ומחזק את הפסיקה' : 'סותר את הדיין — שים לב, ייתכן שינוי';
    parts.push(`מחשבת השואל (בית ${dhamirByMizan.primaryHouseNumber} — ${dhamirByMizan.primaryHebrew}): ${dhamirFort} — ${dhamirLabel}.`);
  } else if (dhamirHouseEntry && dhamirToneConclusion !== 0) {
    const confirmingConclusion = (judgeToneConclusion > 0 && dhamirToneConclusion > 0) || (judgeToneConclusion < 0 && dhamirToneConclusion < 0);
    const dhamirLabel = confirmingConclusion ? 'מאשרת את הדיין' : 'סותרת את הדיין — זהירות';
    parts.push(`מחשבת השואל (בית ${dhamirHouseEntry.houseNumber} — ${dhamirHouseEntry.figureHebrew}): ${dhamirFort} — ${dhamirLabel}.`);
  }

  if (sentence) {
    const sentenceSpeakNote = sentence?.figureState?.speakingState === 'silent' ? ' [שותק]' : '';
    const sentenceNaturalNote = sentence.isNaturalFigure ? ' [ביתה הטבעי — בביתה הטבעי]' : '';
    parts.push(
      `בית 16 (אחרית הדבר): ${sentence.figureHebrew || 'לא מזוהה'}${sentenceSpeakNote}${sentenceNaturalNote} — מראה את השלמת הדין.`
    );
  }

  const tahasil = boardAnalysis.tahasil;
  if (tahasil) {
    parts.push(tahasil.tahasilHebrew);
    if (tahasil.hayulaActive) {
      parts.push(tahasil.hayulaHebrew);
    }

    const quesitedHouseNum = tahasil.quesitedHouseNum;
    const quesitedEntry = quesitedHouseNum
      ? boardAnalysis.houses?.find?.((h) => Number(h.house) === quesitedHouseNum)
      : null;
    if (quesitedEntry && quesitedHouseNum !== (boardAnalysis.focusHouseNumber)) {
      const qFortune = quesitedEntry.fortune || '';
      const qFigure = quesitedEntry.figureHebrew || '';
      const qSpeak = getSpeakingStateHebrew(quesitedEntry?.figureState);
      const qNaturalNote = quesitedEntry.isNaturalFigure ? ' [ביתה הטבעי — בביתה הטבעי]' : '';
      const qPosNote = getHousePositionHebrew(quesitedHouseNum) ? ` [${getHousePositionHebrew(quesitedHouseNum)}]` : '';
      if (qFigure) {
        parts.push(
          `בית הנשאל (בית ${quesitedHouseNum}): ${qFigure}${qFortune ? ` — ${qFortune}` : ''}${qSpeak ? ` [${qSpeak}]` : ''}${qPosNote}${qNaturalNote}.`
        );
      }
    }
  }

  const connections = (boardAnalysis.topicConnections?.checks || []).filter((c) => c.connected);
  if (connections.length > 0) {
    parts.push(`קשרים פעילים: ${connections.map((c) => c.role).join(' | ')}.`);
  }

  const qFocus = boardAnalysis.focusHouse;
  if (qFocus?.directionHebrew) {
    const qFocusSpeakNote = getSpeakingStateHebrew(qFocus?.figureState) === 'שותק' ? ' [שותק — כוחו מוחלש]' : '';
    const qFocusPosNote = getHousePositionHebrew(qFocus.house) ? ` [${getHousePositionHebrew(qFocus.house)}]` : '';
    const naturalNote = qFocus.isNaturalFigure ? ' — הצורה הטבעית של הבית, הדין חזק במיוחד.' : '.';
    parts.push(`כיוון הצורה בבית המרכזי (${qFocus.house}): ${qFocus.figureHebrew}${qFocusSpeakNote}${qFocusPosNote} — ${qFocus.directionHebrew}${naturalNote}`);
  }

  const h1a = boardAnalysis.house1Analysis;
  if (h1a) {
    const naturalH1 = h1a.isNatural ? ' הצורה הטבעית להבית הראשון — כוח כפול.' : '';
    parts.push(`מצב השואל (בית 1): ${h1a.figureHebrew} — ${h1a.fortuneHebrew}.${naturalH1}`);
  }

  const seventh = boardAnalysis.seventhOfHouse1;
  if (seventh) {
    parts.push(`השביעית של בית 1 (${boardAnalysis.house1Analysis?.figureHebrew || ''}): ${seventh.figureHebrew} — נמצאת בבית ${seventh.foundInHouse}. קשר זה חזק לפי חאוי.`);
  }

  const repeatedFigs = (boardAnalysis.ittisalat?.figureConnections || []).filter((c) => c.houses?.length >= 2);
  if (repeatedFigs.length > 0) {
    const top = repeatedFigs[0];
    parts.push(`צורה חוזרת: ${top.figureHebrew} בבתים ${top.houses.join(', ')} — ${top.quality}.`);
  }

  if (boardAnalysis.lifeDeathAnalysis) {
    parts.push(`חי/מת: ${boardAnalysis.lifeDeathAnalysis.hebrewVerdict}`);
  }

  if (boardAnalysis.directionQuadrant?.dominant) {
    const dom = boardAnalysis.directionQuadrant.dominant;
    if (dom.incomingBenefic > 0) {
      parts.push(`כיוון דומיננטי: ${dom.hebrewDir} — ${dom.incomingBenefic} צורות נכנסות וטובות בריבוע זה.`);
    }
  }

  const sq = boardAnalysis.sourceQuality;
  if (sq && !sq.isFullyCovered) {
    parts.push(`הערת מקור: בתים ${sq.missingTransitHouses.join(', ')} — ${sq.noteHebrew}`);
  }

  const firstRule = relevantRules.find((r) => r.hebrew || r.result || r.condition);
  if (firstRule) {
    parts.push(
      `כלל מקור: ${firstRule.hebrew || firstRule.result || firstRule.condition}.`
    );
  }

  return parts.join('\n\n');
}

function buildValidatedConclusion(boardValidation, conclusionText) {
  if (!boardValidation?.warnings?.length) return conclusionText;
  const criticals = boardValidation.warnings.filter((w) => w.severity === 'critical');
  const nonCriticals = boardValidation.warnings.filter((w) => w.severity !== 'critical');
  const parts = [];
  if (criticals.length) {
    parts.push('⚠️ שגיאת לוח קריטית:');
    criticals.forEach((w) => parts.push(w.hebrewMessage));
    parts.push('');
    parts.push('הפירוש שלהלן ניתן לצרכי עיון בלבד — הלוח אינו תקין.');
  }
  if (nonCriticals.length) {
    parts.push('⚠️ אזהרת לוח:');
    nonCriticals.forEach((w) => parts.push(w.hebrewMessage));
  }
  if (parts.length) parts.push('');
  parts.push(conclusionText);
  return parts.join('\n');
}

// ── ספירת יסודות לתשובה כן/לא (Task 5) ─────────────────────────────────────
// מקור: כשף אל-אסראר — רוב זכרי (אש+אוויר) = חיובי; רוב נקבי (מים+עפר) = שלילי
const MASCULINE_ELEMENTS = new Set(['אש', 'אוויר', 'רוח']);
const FEMININE_ELEMENTS  = new Set(['מים', 'עפר']);

function countElementsForYesNo(board) {
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

export function interpretHawiQuestionInitial(question, board = null) {
  const route = routeHawiQuestion(question);
  // Allow caller to supply a pre-resolved topicId (e.g. from a UI topic selector)
  const topicOverride = board?.topicId;
  if (topicOverride && TOPIC_MAIN_HOUSES[topicOverride]) {
    route.topicId = topicOverride;
    route.confidence = 'topic-override';
    route.matchedBy = 'board.topicId';
  }
  const clientContext = board?.clientContext || {};
  const clientHistorySummary = board?.clientHistorySummary || null;
  const mainHouses = TOPIC_MAIN_HOUSES[route.topicId] || TOPIC_MAIN_HOUSES.foundations;
  const topicHebrew = TOPIC_HEBREW_TITLES[route.topicId] || TOPIC_HEBREW_TITLES.foundations;

  const boardAnalysis = buildBoardAnalysis(board, route.topicId, mainHouses);
  const relevantRules = collectRelevantRules(route.knowledge, route.topicId, mainHouses);
  const boardScore = scoreBoard(boardAnalysis);
  const judgeVerdict = boardScore.judgeVerdict || buildJudgeVerdict(boardAnalysis);
  const spiritualDiagnosis = diagnoseSpiritualInfluence(question, board);
  const technicalConclusionHebrew = buildFinalConclusion(
    topicHebrew,
    boardScore,
    boardAnalysis,
    relevantRules
  );

  const boardValidation = board?.boardValidation || { isValid: true, hasCritical: false, warnings: [] };
  const elementYesNo = (board?.entries?.length > 0) ? countElementsForYesNo(board) : null;

  return {
    id: 'goral-hachol-full-interpretation',
    status: 'board-aware-source-based-interpretation',
    question,
    clientContext,
    clientHistorySummary,
    topicId: route.topicId,
    topicHebrew,
    confidence: route.confidence,
    matchedBy: route.matchedBy,
    sourceId: route.sourceId,

    mainHouses,
    knowledgeSources: summarizeKnowledgeItems(route.knowledge),
    relevantRules,
    judgeVerdict,

    boardContext: boardAnalysis.hasBoard
      ? {
          received: true,
          noteHebrew:
            'התקבל לוח גורל מלא. הפירוש משלב בית מרכזי, עדים, דיין, משלים בית 15, מעבר צורות, מצבי צורות, מצבי בתים וכללי נושא.',
        }
      : {
          received: false,
          noteHebrew:
            'לא התקבל לוח גורל. הפירוש כרגע מבוסס רק על זיהוי נושא השאלה ושכבות הידע.',
        },

    boardAnalysis,
    boardScore,
    boardValidation,
    elementYesNo,
    spiritualDiagnosis,
    technicalConclusionHebrew,
    finalConclusionHebrew: buildValidatedConclusion(boardValidation, writeHumanGoralConclusion({
      question,
      clientContext,
      clientHistorySummary,
      topicId: route.topicId,
      topicHebrew,
      boardScore,
      boardAnalysis,
      spiritualDiagnosis,
      relevantRules,
      judgeVerdict,
      elementYesNo,
    })),
    conclusionDraftHebrew: technicalConclusionHebrew,

    // Short client-facing verdict (always-visible, topic-aware)
    shortClientVerdict: writeShortClientVerdict({
      topicId: route.topicId,
      boardAnalysis,
      judgeVerdict,
      clientContext,
    }),

    // Clean narrative for reading aloud to client — no technical jargon
    clientReadingHebrew: writeClientReadingHebrew({
      topicId: route.topicId,
      boardAnalysis,
      judgeVerdict,
      clientContext,
      boardScore,
      question,
      spiritualDiagnosis,
    }),
  };
}

export function formatHawiInitialInterpretationHebrew(result) {
  const lines = [];

  lines.push(`נושא השאלה: ${result.topicHebrew}`);
  lines.push(`בתים עיקריים לבדיקה: ${result.mainHouses.join(', ')}`);
  lines.push('');

  if (result.boardAnalysis?.hasBoard) {
    lines.push('לוח בפועל:');
    for (const h of result.boardAnalysis.houses) {
      lines.push(`- בית ${h.house}: ${h.figureHebrew || ''} — ${h.tone?.hebrew || ''}`);
    }
    lines.push('');
    lines.push(`ציון פנימי: ${result.boardScore.score}`);
    lines.push('');
  }

  lines.push('מסקנה:');
  lines.push(result.finalConclusionHebrew);

  return lines.join('\n');
}

export default {
  interpretHawiQuestionInitial,
  formatHawiInitialInterpretationHebrew,
};

if (typeof module !== 'undefined') {
  module.exports = {
    interpretHawiQuestionInitial,
    formatHawiInitialInterpretationHebrew,
  };
}
