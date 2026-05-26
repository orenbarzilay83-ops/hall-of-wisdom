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
} from './goral-conclusion-writer.js';

import {
  HAWI_QUESTION_HIDDEN_TREASURE_EXTRA,
} from '../data/sources/hawi/question-rules/hawi-question-hidden-treasure-extra.js';

import {
  FIGURE_LETTER_EXTRACTION,
} from '../data/sources/hawi/foundations/hawi-figure-letter-extraction.js';

// Natural figure (جدول, jadwal) for each house — the figure that naturally belongs there.
// When the figure in a house matches its natural figure, the judgement is especially strong.
// Source: חאוי העג׳איב (حاوي العجائب) PDFs only — no Western/zodiacal tradition used.
// Reading method: extract |/0 chars from OCR section heading left-to-right → 4-digit figure code.
export const NATURAL_HOUSE_FIGURES = {
  // Confirmed directly from Hawi PDF chapter headings (OCR pattern)
  1:  '1121', // נלחם — doc2: "الجدولة 00|0"
  2:  '1222', // נשוא ראש — doc3: "0|||" בכותרת פרק בית 2
  3:  '2111', // סף נכנס — doc3: "|000" + "ساقط" בכותרת פרק בית 3
  4:  '2212', // לבן — doc3: "(||0|) البيت الرابع"
  8:  '2221', // שפל ראש — doc5: "||| ... 0" (L→R: |||0 = 2221)
  9:  '1122', // כבוד יוצא — doc6: "00 ... ||" (L→R: 00|| = 1122) + "ساقط"
  10: '1221', // סוהר — doc6: "0||0 وتد الشمال"
  11: '2112', // חיבור — doc7: "| ... 00 ... |" (L→R: |00| = 2112) + "يلي الوتد"
  12: '2211', // כבוד נכנס — doc7: "|| ... 00" (L→R: ||00 = 2211) + "ساقط"

  // Taskin al-Sharq source positions 4,5,6 (Hawi PDF docs 33-34, taskinEast.orderFromSource)
  5:  '1211', // בר הלחי — Taskin East[4] = "0|00"
  6:  '1112', // סף יוצא — Taskin East[5] = "000|"
  7:  '2122', // אדום — Taskin East[6] = "|0||"
};

// Taskin al-Sharq order (تسكين الشرق) — 16 figure patterns in source order
// Converted from | (=1, single) / 0 (=2, double) notation in hawi-dhamir-directions-validation.js
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

// Fortune tone of each house by its structural nature (from hawi-house-states-colors.js)
const HOUSE_FORTUNE_TONES = {
  1: 1, 2: -1, 3: 0.5, 4: -1, 5: 1, 6: -0.5,
  7: -1, 8: -0.5, 9: 1, 10: 1, 11: 1, 12: -1,
  13: 1, 14: -0.5, 15: 0, 16: 1,
};

// Houses that represent the OTHER SIDE (opponent/illness/enemy) — fortune is inverted for the questioner
const ADVERSARIAL_HOUSES_BY_TOPIC = {
  disputes: [7],
  enemies: [7, 12],
  illness: [6],
};

const TOPIC_MAIN_HOUSES = {
  travel: [1, 3, 5, 8, 9, 12],
  missingPerson: [1, 7, 8, 9, 12],
  childrenPregnancy: [1, 4, 5, 6, 7, 11, 13, 14, 15],
  hiddenTreasure: [1, 2, 4, 6, 7, 8, 10, 12, 15, 16],
  yearlyForecast: [1, 10, 15],
  authorityState: [1, 7, 10, 11, 15],
  birthNativity: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  spiritualDiagnostics: [1, 6, 8, 9, 12],
  marriage: [1, 7, 8, 12, 13, 14, 15],
  illness: [1, 6, 7, 8, 13, 14, 15],
  disputes: [1, 7, 13, 14, 15],
  enemies: [1, 7, 9, 12, 13, 14, 15],
  fear: [1, 4, 12, 13, 14, 15],
  commerce: [1, 2, 7, 10, 13, 14, 15],
  loveHate: [1, 5, 7, 11, 13, 14, 15],
  completion: [1, 13, 14, 15],
  foundations: [1, 13, 14, 15, 16],
};

const TOPIC_HEBREW_TITLES = {
  travel: 'נסיעה',
  missingPerson: 'נעדר / גאיב',
  childrenPregnancy: 'ילדים והריון',
  hiddenTreasure: 'מטמון / חבוי',
  yearlyForecast: 'טאלע השנה / גשם / יוקר וזול',
  authorityState: 'שלטון / מדינה / בעלי תפקידים',
  birthNativity: 'מולד / נולד',
  spiritualDiagnostics: 'אבחון רוחני',
  marriage: 'נישואין / זוגיות',
  illness: 'חולה / מחלה',
  disputes: 'סכסוך / תביעה',
  enemies: 'אויב / אויבות',
  fear: 'פחד / סכנה',
  commerce: 'מסחר / קנייה ומכירה',
  loveHate: 'אהבה ושנאה',
  completion: 'האם הדבר יצליח / יושלם',
  foundations: 'יסודות גורל החול',
};

// הבית המייצג את הנשאל לפי נושא (house of the quesited / бيت المطلوب)
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
  birthNativity:        1,
  spiritualDiagnostics: 6,
};

// צורות הנחשבות נחס (رمال النحوس) לפי מסורת חאוי
const MALEFIC_FIGURE_PATTERNS = new Set([
  '2122', // אדום — נחס חזק
  '2221', // שפל ראש — נחס חזק
  '1212', // ממון יוצא — נחס
  '2211', // כבוד נכנס — נחס ממוזג
  '1221', // סוהר — נחס (כלא)
]);

// יתדות (awtad) — בתים יציבים/זוויתיים
const ANGULAR_HOUSES_SET = new Set([1, 4, 7, 10]);

// צורות שמש ולבנה (لأشكال الشمس والقمر) לפי PLANETARY_FIGURES
const SUN_FIGURE_PATTERNS  = new Set(['1122', '2121']); // כבוד יוצא, ממון נכנס
const MOON_FIGURE_PATTERNS = new Set(['2212', '1111']); // לבן, דרך

// משולשי יסודות — כוכבים לפי יסוד (שער המשולשים, חאוי עמ׳ 59)
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
    v.includes('סעד') ||
    v.includes('טוב') ||
    v.includes('benefic') ||
    v.includes('saad') ||
    v.includes('s سعد')
  );
}

function isBadValue(value = '') {
  const v = normalizeText(value);
  return (
    v.includes('נחס') ||
    v.includes('רע') ||
    v.includes('malefic') ||
    v.includes('nahs') ||
    v.includes('نحس')
  );
}
function getFigureFortuneTone(house) {
  if (!house) return 0;
  const fortune = String(house.fortune || house.fortuneHebrew || '');
  if (!fortune) return 0;
  if (fortune === 'סעד') return 1;
  if (fortune === 'נחס') return -1;
  if (fortune.startsWith('ממוזג') && fortune.includes('סעד')) return 0.5;
  if (fortune.startsWith('ממוזג') && fortune.includes('נחס')) return -0.5;
  if (fortune.startsWith('ממוזג')) return 0;
  if (isGoodValue(fortune)) return 1;
  if (isBadValue(fortune)) return -1;
  return 0;
}

// Tone from figure state's house-specific fortuneState (overrides base figure fortune when available).
// Source: Hawi chapter on figure states in houses (الباب الثامن عشر).
function getFigureStateHouseTone(figureState) {
  if (!figureState?.fortuneState) return null;
  const fs = figureState.fortuneState;
  if (fs.startsWith('benefic')) return 1;
  if (fs.startsWith('malefic')) return -1;
  return null;
}

// Weight multiplier when a figure is silent (שותק / صامت) in its house.
// A silent figure's influence is weakened per Hawi: "צורה שותקת בבית מרכזי מחלישה את הדין".
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

// ─────────────────────────────────────────────────────────────────────────────
// כיוון הצורה (الداخل / الخارج / الثابت / المتغير)
// מקור: מבנה הצורה — שתי הספרות הראשונות של הדפוס קובעות את הכיוון.
// 21xx = נכנס (داخل/مقبل)  — מגיע לעבר העניין
// 12xx = יוצא (خارج/مدبر) — מתרחק מן העניין
// 22xx = קבוע (ثابت)       — יציב ומושרש
// 11xx = מתהפך (متحول)    — לא יציב, ניתן לשינוי
// ─────────────────────────────────────────────────────────────────────────────
function getFigureDirection(pattern) {
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

// ─────────────────────────────────────────────────────────────────────────────
// כל צורה מבקשת את השביעית שלה (كل شكل يطلب سابعة)
// מקור: חאוי, hawi-dhamir-directions-validation.js, sourcePage 34.
// הסדר: מיקום N בתסקין → השביעית היא מיקום (N+7) mod 16.
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// ניתוח כיוונים — ריבוע הבתים לפי מקור חאוי (hawi-question-hidden-treasure-extra.js)
// בתים 1-4 = מזרח, 5-8 = מערב, 9-12 = דרום, 13-16 = צפון
// ─────────────────────────────────────────────────────────────────────────────
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
  // Find the strongest incoming+benefic quadrant — indicates where/toward what
  const summary = Object.entries(quadrants).map(([dir, houses]) => {
    const hebrewDir = { east: 'מזרח', west: 'מערב', south: 'דרום', north: 'צפון' }[dir];
    const incomingBenefic = houses.filter((h) => h.direction === 'incoming' && h.fortune.includes('סעד')).length;
    const outgoingMalefic = houses.filter((h) => h.direction === 'outgoing' && h.fortune.includes('נחס')).length;
    return { dir, hebrewDir, houses, incomingBenefic, outgoingMalefic };
  });
  const dominant = summary.reduce((a, b) => (b.incomingBenefic > a.incomingBenefic ? b : a), summary[0]);
  return { quadrants: summary, dominant };
}

// ─────────────────────────────────────────────────────────────────────────────
// חי או מת — אלגוריתם לשאלת נעדר
// מקור: hawi-question-missing-person-extra.js, specificDeathRules (PDF 59-60)
// ─────────────────────────────────────────────────────────────────────────────
const DEATH_FIGURE_PATTERNS = new Set(['1112', '1212']); // עתבה יוצאת, קבץ יוצא — "מן הצורות הנחסות ביותר"

function computeLifeDeath(chart) {
  if (!Array.isArray(chart)) return null;
  const h1  = chartHouse(chart, 1);
  const h8  = chartHouse(chart, 8);
  const h9  = chartHouse(chart, 9);
  const h12 = chartHouse(chart, 12);
  const h13 = chartHouse(chart, 13);
  const h14 = chartHouse(chart, 14);

  const isMalefic = (h) => h && MALEFIC_FIGURE_PATTERNS.has(h.key);
  const isBenefic = (h) => h && !MALEFIC_FIGURE_PATTERNS.has(h.key) && h.fortune && h.fortune.includes('סעד');
  const isDeathFigure = (h) => h && DEATH_FIGURE_PATTERNS.has(h.key);

  const deathSignals = [];
  const lifeSignals  = [];

  // כלל 1: עתבה יוצאת / קבץ יוצא בבתים מרכזיים
  for (const h of [h1, h8, h9, h14]) {
    if (isDeathFigure(h)) {
      deathSignals.push(`${h.hebrew || h.key} (בית ${h.house}) — מן הצורות הנחסיות ביותר, מורה על מוות.`);
    }
  }

  // כלל 2: חזרה בבית 14 או 8 כנחס
  if (isMalefic(h14)) deathSignals.push(`בית 14 נחס (${h14.key}) — חזרה בבית 14 כנחס, סימן מוות.`);
  if (isMalefic(h8))  deathSignals.push(`בית 8 נחס (${h8.key}) — בית המוות בנחס.`);

  // כלל 3: בתים 1, 9, 13 כולם נחסיים + חזרה בבית 12
  if (isMalefic(h1) && isMalefic(h9) && isMalefic(h13)) {
    if (isMalefic(h12) || (h12 && h12.key === h1?.key)) {
      deathSignals.push('בתים 1, 9, 13 כולם נחסיים וחזרה בבית 12 — לפי חאוי: פסוק מוות.');
    }
  }

  // כלל 4: סעדים חזקים המביטים אל בית 8 — מבטלים/מרככים מוות
  if (isBenefic(h1) && isBenefic(h9)) {
    lifeSignals.push('סעדים בבית 1 ובית 9 — בית המוות מוקף בטוב, הנעדר בסכנה אך ניצל.');
  }
  if (!isMalefic(h8)) {
    lifeSignals.push(`בית 8 אינו נחס (${h8?.key || '?'}) — אין סימן מוות ישיר.`);
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

// ─────────────────────────────────────────────────────────────────────────────
// איתיסלאת — חיבורים בין בתים (اتصالات)
// שני סוגים: (1) חזרת צורה בבתים שונים, (2) קשר מבטי (תסדיס/ריבוע/משולש/מול)

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
  if (fortune.includes('נחס')) return -1;
  if (fortune.includes('סעד')) return 1;
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

  // ── 1. חזרת צורה בבתים עיקריים ──────────────────────────────────────────
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

  // ── 2. קשר מבטי בין בית 1, בית המרכזי, בית 15 ───────────────────────────
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

  // Hebrew summary for conclusion
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

// ─────────────────────────────────────────────────────────────────────────────
// מצב הטאלע — ניתוח עומק של בית 1 (בית השואל / بيت الطالع)

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
  illness:    'בית 1 = גוף החולה. האלמנט מצביע על אזור הגוף הפגוע.',
  disputes:   'בית 1 = השואל בדיון. מצבו קובע צד חזק/חלש.',
  marriage:   'בית 1 = הבעל/השואל. יש להשוות עם בית 7 (הצד השני).',
  enemies:    'בית 1 = כוח השואל מול האויב. אם טוב — יכול להתמודד.',
  loveHate:   'בית 1 = מצב השואל הרגשי. בדוק חיבור לבית 11.',
  commerce:   'בית 1 = השואל כסוחר. בדוק מצבו מול בית 2 (ממון).',
  fear:       'בית 1 = השואל. אם הצורה רעה — הפחד מוצדק.',
  missingPerson: 'בית 1 = השואל המחפש. בדוק מול בית 7 (הנעדר).',
  travel:     'בית 1 = הנוסע. צורה טובה = נסיעה מוצלחת.',
  completion: 'בית 1 = השואל שרוצה להשלים. צורה טובה = יש כוח להשלמה.',
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
  if (fortune.includes('סעד')) fortuneGrade = 1;
  else if (fortune.includes('נחס')) fortuneGrade = -1;

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

// ─────────────────────────────────────────────────────────────────────────────
// בדיקות קשר נוספות לפי נושא (Topic-specific house-pair checks)

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
      const aspect = aspectTypeBetween(aNum, bNum);
      if (aspect) {
        connType = 'aspect';
        connDetail = aspect.hebrew;
      }
    }

    const assessment =
      connType === 'same-figure' ? `אותה צורה (${a.hebrew}) — ${connDetail}` :
      connType === 'aspect'      ? connDetail :
      'אין חיבור';

    const fortuneA = a.fortune || '';
    const fortuneB = b.fortune || '';
    const toneA = fortuneA.includes('סעד') ? 1 : fortuneA.includes('נחס') ? -1 : 0;
    const toneB = fortuneB.includes('סעד') ? 1 : fortuneB.includes('נחס') ? -1 : 0;
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

// ─────────────────────────────────────────────────────────────────────────────
// תחסיל (تحصيل) — האם הדבר ייגמר?
// מניעה (حيلولة) — מה חוסם את ההגעה?
// ─────────────────────────────────────────────────────────────────────────────

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

function chartHouse(chart, houseNum) {
  return chart.find((h) => Number(h.house) === Number(houseNum)) || null;
}

// Planetary figure assignments from Hawi (hawi-dhamir-directions-validation.js, doc 33-34).
// Each planet has two representative figures. Converted from |/0 notation: |=2, 0=1.
const PLANETARY_FIGURES = [
  { hebrew: 'שמש',    figures: ['1122', '2121'] },
  { hebrew: 'לבנה',   figures: ['2212', '1111'] },
  { hebrew: 'מאדים',  figures: ['2122', '1121'] },
  { hebrew: 'כוכב',   figures: ['2222'] },           // second shape partial in source, using only ||||
  { hebrew: 'שבתאי',  figures: ['2221', '1221'] },
  { hebrew: 'נוגה',   figures: ['2211', '1211'] },
  { hebrew: 'צדק',    figures: ['1222', '2111'] },
];

/**
 * computeAsala — אצאלה (أصالة): האם הלוח תקף לפסיקה?
 *
 * שני כללים מחאוי (PDF docs 33-34, strikeValidityPrinciples + moonValidationRules):
 *   1. צורת הלבנה (לבן 2212 / דרך 1111) חייבת להופיע בלוח — אחרת חוזרים על ההכאה.
 *   2. מחלקת כל אחד מ-7 הכוכבים חייבת להופיע — אחרת אין לסמוך על הלוח.
 */
function computeAsala(chart) {
  if (!Array.isArray(chart)) return null;

  const chartKeys = new Set(chart.map((h) => h.key).filter(Boolean));

  // Rule 1 — moon figure (לבן = 2212) or (דרך = 1111) must appear
  const moonFigures = ['2212', '1111'];
  const hasMoon = moonFigures.some((f) => chartKeys.has(f));
  const moonFigureFound = moonFigures.find((f) => chartKeys.has(f));

  // Rule 2 — at least one figure from each planet's pair must appear
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

  // חסימה 1: הדיין נחס ואינו קשור לאחד הצדדים
  if (judge && MALEFIC_FIGURE_PATTERNS.has(judge.key)) {
    if (judge.key !== querentFig && judge.key !== quesitedFig) {
      reasons.push(`הדיין (בית 15: ${judge.hebrew || judge.key}) הוא נחס ואינו מחובר לצד השואל ולצד הנשאל — הוא חוסם את הפסיקה.`);
    }
  }

  // חסימה 2: בית 12 (אויב נסתר/אבדה) נחס ואינו קשור לאחד הצדדים
  if (h12 && MALEFIC_FIGURE_PATTERNS.has(h12.key)) {
    if (h12.key !== querentFig && h12.key !== quesitedFig) {
      reasons.push(`בית 12 (${h12.hebrew || h12.key}) — סכנה נסתרת של נחס — מפריעה להגעה.`);
    }
  }

  // חסימה 3: בית 8 (מוות/הפסד) נחס ואינו קשור — חוסם בנישואין/מחלה/נסיעה
  if (h8 && MALEFIC_FIGURE_PATTERNS.has(h8.key)) {
    if (h8.key !== querentFig && h8.key !== quesitedFig) {
      reasons.push(`בית 8 (${h8.hebrew || h8.key}) — נחס — מטיל צל של הפסד או סכנה על הדין.`);
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
 *   2. טבעי (جدول)      — צורת הטאלע שייכת טבעית לבית הנשאל → חזק
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
      tahasilHebrew: 'לא ניתן לחשב תחסיל — חסרים נתונים.',
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

  // ── 1. ישיר (اتحاد) ──────────────────────────────────────────────────────
  if (querentFig && querentFig === quesitedFig) {
    tahasilStatus   = 'direct';
    tahasilStrength = 'strong';
    tahasilHebrew   = `תחסיל ישיר (אתחאד): אותה צורה — "${querentName}" — בבית 1 ובבית ${quesitedHouseNum}. הדבר ייגמר ואין ספק בו.`;
  }

  // ── 2. טבעי (جدول) ───────────────────────────────────────────────────────
  if (tahasilStatus === 'none') {
    const naturalOfQuerent  = getNaturalHouseOf(querentFig);
    const naturalOfQuesited = getNaturalHouseOf(quesitedFig);
    if (naturalOfQuerent === quesitedHouseNum) {
      tahasilStatus   = 'natural';
      tahasilStrength = 'strong';
      tahasilHebrew   = `תחסיל טבעי (ג׳דוול): הצורה "${querentName}" שייכת טבעית לבית ${quesitedHouseNum} — הדבר ייגמר בדרך הטבע.`;
    } else if (naturalOfQuesited === 1) {
      tahasilStatus   = 'natural';
      tahasilStrength = 'strong';
      tahasilHebrew   = `תחסיל טבעי (ג׳דוול): הצורה "${quesitedName}" שייכת טבעית לבית 1 — הנשאל מגיע אל השואל.`;
    }
  }

  // ── 3. עדים/דיין (شهادة) ─────────────────────────────────────────────────
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
      tahasilHebrew   = `תחסיל דרך עדים ודיין: הדיין מחובר לאחד הצדדים ועד מחובר לצד השני — הדבר ייגמר, אך ייקח זמן.`;
    } else if ((w1HasQ && w2HasT) || (w1HasT && w2HasQ)) {
      tahasilStatus   = 'witness';
      tahasilStrength = 'medium';
      tahasilHebrew   = `תחסיל דרך עדים: עד ראשון מחובר לצד אחד ועד שני לצד השני — גורם ביניים מעביר את הדבר.`;
    } else if ((w1HasQ || w1HasT) && (w2HasQ || w2HasT)) {
      tahasilStatus   = 'witness';
      tahasilStrength = 'medium';
      tahasilHebrew   = `תחסיל חלקי דרך עדים: שני העדים קשורים לאחד הצדדים — יש תמיכה, אך לא הגעה ישירה.`;
    }
  }

  // ── 4. העברה (نقل النور) ─────────────────────────────────────────────────
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
      tahasilHebrew   = `תחסיל בהעברה: הצורה "${bridgeName}" בבית ${bridge.house} מחברת בין בית 1 לבית ${quesitedHouseNum} — הדבר ייגמר בעזרת גורם שלישי.`;
    }
  }

  // ── 5. שיתוף שורות (اشتراك الأوتاد) ─────────────────────────────────────
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
      tahasilHebrew = `אין תחסיל: לא נמצא חיבור בין בית 1 ("${querentName}") לבית ${quesitedHouseNum} ("${quesitedName}") — הדבר לא ייגמר כפי שמקווים.`;
    }
  }

  // ── מניעה (حيلولة) ───────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// ציון שלמות הלוח — כלל 96 הנקודות (ناقص / كامل)
// ציון = 128 − (מספר שורות יחידות). < 96 = חסר.
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

// ─────────────────────────────────────────────────────────────────────────────
// תסיירת נקטת המיזאן — הדמיר לפי עקיבה אחורה בשרשרת הגזירה
// מקור: "أهم قاعدة هي تسيير نقط الميزان"
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
    methodHebrew: 'תסיירת נקטת המיזאן',
    traces,
    primaryHouseNumber: primary?.dhamirHouseNumber || null,
    primaryHebrew: primary?.dhamirHebrew || '',
    primaryFortune: primary?.dhamirFortune || '',
    primaryElement: primary?.rowElement || '',
  };
}

// נהמת האמהות: שורה 1 מאם 1 + שורה 2 מאם 2 + שורה 3 מאם 3 + שורה 4 מאם 4 → צורת הדמיר
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

  // Base tones from figure intrinsic fortune (סעד/נחס)
  const judgeToneBase = getFigureFortuneTone(judge);
  const w1ToneBase = w1 ? getFigureFortuneTone(w1) : 0;
  const w2ToneBase = w2 ? getFigureFortuneTone(w2) : 0;
  const focusToneBase = focus ? getFigureFortuneTone(focus) : 0;

  // House-specific fortune override from Hawi figure-states chapter (when available)
  const judgeStateTone = getFigureStateHouseTone(judge?.figureState);
  const w1StateTone = getFigureStateHouseTone(w1?.figureState);
  const w2StateTone = getFigureStateHouseTone(w2?.figureState);
  const focusStateTone = getFigureStateHouseTone(focus?.figureState);

  // Use house-specific override when available, else fall back to base fortune
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

  // Speaking state (ناطق/صامت) — silent judge weakens the ruling
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
      hebrewFull = 'תשובה: כן — הדיין (בית 15) הוא "' + judgeFigure + '" שהוא צורה של סעד, והעדים מחזקים.' +
        judgeSilentNote +
        (w1Figure ? ' עד ראשון: ' + w1Figure + '.' : '') +
        (w2Figure ? ' עד שני: ' + w2Figure + '.' : '') +
        (focusFigure ? ' הבית המרכזי (בית ' + focusHouseNum + '): ' + focusFigure + '.' : '');
    } else {
      verdict = 'yes-weak';
      grade = 'positive';
      hebrewShort = 'כן';
      hebrewFull = 'תשובה: כן — הדיין (בית 15) הוא "' + judgeFigure + '" שהוא סעד. העדים מנוגדים לו, אך הדיין פוסק — יש כוחות שמעכבים אבל הכיוון חיובי.' +
        judgeSilentNote +
        (w1Figure ? ' עד ראשון: ' + w1Figure + '.' : '') +
        (w2Figure ? ' עד שני: ' + w2Figure + '.' : '');
    }
  } else if (judgeTone < 0) {
    if (witnessTone <= 0) {
      verdict = 'no-strong';
      grade = 'negative';
      hebrewShort = 'לא';
      hebrewFull = 'תשובה: לא — הדיין (בית 15) הוא "' + judgeFigure + '" שהוא צורה של נחס, והעדים מחזקים את הדין.' +
        judgeSilentNote +
        (w1Figure ? ' עד ראשון: ' + w1Figure + '.' : '') +
        (w2Figure ? ' עד שני: ' + w2Figure + '.' : '') +
        (focusFigure ? ' הבית המרכזי (בית ' + focusHouseNum + '): ' + focusFigure + '.' : '');
    } else {
      verdict = 'no-weak';
      grade = 'negative';
      hebrewShort = 'לא';
      hebrewFull = 'תשובה: לא — הדיין (בית 15) הוא "' + judgeFigure + '" שהוא נחס. העדים מראים צד חיובי אך אינם יכולים לשנות פסיקת הדיין — יש כוח חיובי שמנסה לפעול, אך הכרעת הגורל שלילית.' +
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

  // Dhamir confirmation/contradiction note
  const dhamirFort = boardAnalysis.dhamirByMizan?.primaryFortune || boardAnalysis.dhamirHouse?.fortune || '';
  const dhamirToneVerdict = dhamirFort.includes('סעד') ? 1 : dhamirFort.includes('נחס') ? -1 : 0;
  if (dhamirToneVerdict !== 0) {
    const dhamirH = boardAnalysis.dhamirByMizan?.primaryHouseNumber || boardAnalysis.dhamirHouse?.houseNumber || '';
    const confirming = (judgeTone > 0 && dhamirToneVerdict > 0) || (judgeTone < 0 && dhamirToneVerdict < 0);
    hebrewFull += confirming
      ? ` הדמיר (בית ${dhamirH}) מאשר את הפסיקה — ${dhamirFort}.`
      : ` הדמיר (בית ${dhamirH}) מנוגד לדיין — ${dhamirFort} — ייתכן שינוי במהלך.`;
  }
  // Board completeness note
  if (boardAnalysis.boardScore?.isComplete === false) {
    hebrewFull += ` [הערה: הלוח חסר (${boardAnalysis.boardScore.score} נקודות) — הפסיקה פחות ודאית.]`;
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
    return { score: 1, tone: 'good', hebrew: 'הבית נושא סימן טוב / סעד.' };
  }

  if (isBadValue(combined)) {
    return { score: -1, tone: 'bad', hebrew: 'הבית נושא סימן קשה / נחס.' };
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

function getTransitMeaningForHouse(house) {
  if (!house) return null;
  const houseNum = Number(house.house);
  // Try direct lookup by figureId or shortId
  const figureId = house.figureId || house.shortId || null;
  let houseMeaning = null;
  if (figureId) {
    houseMeaning = HAWI_SOURCE.figureTransits.getHouseMeaning(figureId, houseNum);
  }
  // If that failed, try by pattern (house.key = "2221" etc.)
  if (!houseMeaning && house.key) {
    // Find the figure by pattern from HAWI_SOURCE.figureNames.list
    const figureByPattern = HAWI_SOURCE.figureNames.list.find(f => f.pattern === house.key);
    if (figureByPattern) {
      houseMeaning = HAWI_SOURCE.figureTransits.getHouseMeaning(figureByPattern.shortId, houseNum);
    }
  }
  // If still failed, try by Hebrew name
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
  return {
    figure: house.hebrew || house.key || null,
    house: house.house,
    meaning: houseMeaning.meaning || null,
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

// ─────────────────────────────────────────────────────────────────────────────
// שאלת מטמון / חבוי — חישוב מיקום לפי צורה בבית 1 ובדיקת קיום
// מקור: hawi-question-hidden-treasure-extra.js (שער החבוי, חאוי)
// ─────────────────────────────────────────────────────────────────────────────

// Saturn figure patterns (עקלה 1221, שפל ראש 2221) — key treasure presence indicators
const SATURN_FIGURE_PATTERNS_TREASURE = new Set(['1221', '2221']);

// Map from figure pattern to location rule from hawi-question-hidden-treasure-extra.js
const TREASURE_FIGURE_LOCATION_RULES = (function buildTreasureRules() {
  const PATTERN_MAP = {
    'القبض الداخل':    '2121',
    'القبض الخارج':    '1212',
    'العتبة الخارجة':  '1112',
    'العتبة الداخلة':  '2111',
    'الحمرة':          '2122',
    'البياض':          '2212',
    'الحيان':          '1222',
    'النكيس':          '2221',
    'النقي':           '1211',
    'الجودلة':         '1121',
    'النصرة الداخلة':  '2211',
    'النصرة الخارجة':  '1122',
    'الجماعة':         '2222',
    'الاجتماع':        '2112',
    'الطريق':          '1111',
    'العقلة':          '1221',
  };
  const rules = {};
  for (const rule of (HAWI_QUESTION_HIDDEN_TREASURE_EXTRA?.figureLocationRules || [])) {
    const pattern = PATTERN_MAP[rule.figureArabic];
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

  // Step 1: check Saturn figures in key houses (8, 12, 16) — primary presence test
  const saturnKeyHouses = [8, 12, 16].map((n) => chart.find((h) => Number(h.house) === n)).filter(Boolean);
  const hasSaturnInKeyHouses = saturnKeyHouses.some((h) => SATURN_FIGURE_PATTERNS_TREASURE.has(h.key || ''));

  // Step 2: check secondary houses (2, 6, 8) for qabd dakhil (ממון נכנס = 2121)
  const secondaryHouses = [2, 6, 8].map((n) => chart.find((h) => Number(h.house) === n)).filter(Boolean);
  const hasQabdDakhilInSecondary = secondaryHouses.some((h) => (h.key || '') === '2121');

  // Determine presence verdict
  let presenceVerdict;
  let presenceHebrew;
  if (hasSaturnInKeyHouses) {
    presenceVerdict = 'likely-present';
    presenceHebrew = 'סימני שבתאי (עקלה / שפל ראש) נמצאו בבתים 8, 12 או 16 — הלוח מצביע על קיום דבר קבור במקום';
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
      presenceHebrew = 'לא נמצאו סימני שבתאי, עקלה, שפל ראש או ממון נכנס ביתדות ובבתים 8/12/16 — לפי המקור, המקום ריק';
    }
  }

  // Figure in house 1 → location rule
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

// ─────────────────────────────────────────────────────────────────────────────
// הוצאת שם — استخراج الاسم
// מקור: תסקין עבדוה (hawi-figure-letter-extraction.js)
// בית 9 = מכשף/גורם רוחני, בית 7 = גנב/אויב/אדם לא ידוע
// ─────────────────────────────────────────────────────────────────────────────

// Build a lookup map once: pattern → letter entry
const PATTERN_TO_LETTERS = (function buildLetterMap() {
  const map = {};
  for (const entry of (FIGURE_LETTER_EXTRACTION?.figureLetters || [])) {
    map[entry.pattern] = entry;
  }
  return map;
})();

function computeNameLetters(chart, houseNumber) {
  if (!Array.isArray(chart) || !houseNumber) return null;
  const house = chart.find((h) => Number(h.house) === Number(houseNumber));
  if (!house || !house.key) return null;

  const entry = PATTERN_TO_LETTERS[house.key];
  if (!entry) return null;

  const letters = entry.letters || [];
  const houseRole = FIGURE_LETTER_EXTRACTION?.usageHouses?.[Number(houseNumber)] || `בית ${houseNumber}`;

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

// Topics where name extraction is relevant and which house to read
const NAME_EXTRACTION_HOUSES_BY_TOPIC = {
  spiritualDiagnostics: [9],      // בית 9 = המכשף
  enemies:              [7, 9],   // בית 7 = האויב, בית 9 = מי שכישף
  disputes:             [7],      // בית 7 = היריב
  authorityState:       [7],      // בית 7 = אויב המדינה / גורם הנפילה (חאוי עמ׳ 37-38)
};

// ─────────────────────────────────────────────────────────────────────────────
// מנוע שלטון / בעלי תפקידים (authorityState)
// מקור: hawi-authority-state-rulers.js (חאוי עמ׳ 36-38)
// ─────────────────────────────────────────────────────────────────────────────
function computeAuthorityStateAnalysis(chart) {
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

  const signals = [];

  // כלל 1: יציבות — בית 1 קבוע+סעד ומחובר לבית 10
  const h1BeneficStable = isBenefic(h1) && (isStable(h1) || isIncoming(h1));
  const h10Benefic = isBenefic(h10);
  const h1ConnectsH10 = !!(h1?.key && h10?.key && (h1.key === h10.key || aspectTypeBetween(1, 10)));
  if (h1BeneficStable && h10Benefic && h1ConnectsH10) {
    signals.push({ verdict: 'stable', weight: 3,
      hebrew: `בית 1 (${h1?.hebrew || ''}) סעד+קבוע/נכנס ומחובר לבית 10 (${h10?.hebrew || ''}) — המושל יציב בתפקידו ומכובד.` });
  }

  // כלל 2: ריבוי תומכים — בית 10 חוזר בבית 11 ושלושתם טובים
  if (h10?.key && h11?.key && h10.key === h11.key && isBenefic(h1)) {
    signals.push({ verdict: 'stable', weight: 2,
      hebrew: `בית 10 (${h10?.hebrew || ''}) חוזר בבית 11 ובית 1 סעד — ריבוי תומכים, חברים ואחים.` });
  }

  // כלל 3: נפילה — בית 1 נחס, או נחסים בבית 10 ו-11 יחד
  if (isMalefic(h1) || (isMalefic(h10) && isMalefic(h11))) {
    signals.push({ verdict: 'removal', weight: -3,
      hebrew: `בית 1 (${h1?.hebrew || ''}) או בתים 10+11 (${h10?.hebrew || ''}/${h11?.hebrew || ''}) נחסיים — סימן ליציאה מן התפקיד.` });
  }

  // כלל 4: נפילה קשה — נחסים מבית 7 ו-15 (ראש+זנב מן השביעי)
  if (isMalefic(h7) && isMalefic(h15)) {
    signals.push({ verdict: 'removal', weight: -4,
      hebrew: `נחסים בבית 7 (${h7?.hebrew || ''}) ובבית 15 (${h15?.hebrew || ''}) — נפילה קשה וכעס השליט.` });
  } else if (isMalefic(h7)) {
    signals.push({ verdict: 'removal', weight: -2,
      hebrew: `נחס בבית 7 (${h7?.hebrew || ''}) — לחץ מן הצד השני.` });
  }

  // כלל 5: חזרה לתפקיד — בתים 1, 5, 15, 11 מסועדים ונכנסים
  const returnHouses = [h1, h5, h15, h11];
  const returnBeneficCount = returnHouses.filter((h) => h && isBenefic(h) && isIncoming(h)).length;
  if (returnBeneficCount >= 3) {
    signals.push({ verdict: 'return', weight: 2,
      hebrew: `${returnBeneficCount}/4 מבתים 1,5,15,11 מסועדים ונכנסים — חזרה לתפקיד בוודאות.` });
  } else if (returnBeneficCount >= 2 && h10Benefic) {
    signals.push({ verdict: 'return', weight: 1,
      hebrew: `בתים לחזרה (1,5,15,11) נוטים לסעד ובית 10 תומך — סימן לחזרה.` });
  }

  // כלל 6: שמש ולבנה — יציבות מדינה
  const sunInAngular  = chart.some((h) => SUN_FIGURE_PATTERNS.has(h.key || '') && ANGULAR_HOUSES_SET.has(Number(h.house)));
  const moonInAngular = chart.some((h) => MOON_FIGURE_PATTERNS.has(h.key || '') && ANGULAR_HOUSES_SET.has(Number(h.house)));
  const sunInBoard    = chart.some((h) => SUN_FIGURE_PATTERNS.has(h.key || ''));
  const moonInBoard   = chart.some((h) => MOON_FIGURE_PATTERNS.has(h.key || ''));

  if (sunInAngular && moonInAngular) {
    signals.push({ verdict: 'stable', weight: 2,
      hebrew: 'צורות השמש והלבנה ביתדות — המדינה יציבה ושלטונה תקף.' });
  } else if (sunInBoard && moonInBoard) {
    signals.push({ verdict: 'stable', weight: 1,
      hebrew: 'צורות השמש והלבנה מופיעות בלוח — סימן טוב לשלטון.' });
  } else {
    const missing = [!sunInBoard && 'שמש', !moonInBoard && 'לבנה'].filter(Boolean).join(', ');
    if (missing) signals.push({ verdict: 'warning', weight: -1,
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

  return {
    stabilityVerdict,
    verdictHebrew,
    totalWeight,
    signals,
    returnSignal: signals.find((s) => s.verdict === 'return') || null,
    sunInAngular,
    moonInAngular,
    outputHebrew: [`פסיקת שלטון: ${verdictHebrew}`, ...signals.map((s) => `• ${s.hebrew}`)].join('\n'),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// מנוע טאלע השנה / יוקר וזול / גשם
// מקור: hawi-yearly-prices-forecast.js + hawi-rain-weather-forecast.js
// ─────────────────────────────────────────────────────────────────────────────

// figure pattern → planet name Hebrew (built from PLANETARY_FIGURES)
const FIGURE_PLANET_MAP = (function () {
  const m = {};
  for (const p of [
    { hebrew: 'שמש',            figures: ['1122', '2121'] },
    { hebrew: 'לבנה',           figures: ['2212', '1111'] },
    { hebrew: 'מאדים',          figures: ['2122', '1121'] },
    { hebrew: 'כוכב / מרקורי', figures: ['2222'] },
    { hebrew: 'שבתאי',          figures: ['2221', '1221'] },
    { hebrew: 'נוגה',           figures: ['2211', '1211'] },
    { hebrew: 'צדק',            figures: ['1222', '2111'] },
  ]) { for (const f of p.figures) m[f] = p.hebrew; }
  return m;
})();

// Planet → what gets expensive/important that year (from priceRulesByPlacement)
const PLANET_YEARLY_MEANING = {
  'שמש':           'צדק המלך, ירידה בעוול, שלטון ראוי',
  'לבנה':          'חיזוק הצבא/עמים, כוח חברתי',
  'מאדים':         'התייקרות נשק וציוד קרב, מלחמות',
  'כוכב / מרקורי': 'התייקרות מאכלים בחנויות, מעמד סופרים ורמלים',
  'שבתאי':         'קור, יובש, עצבות, מחסור',
  'נוגה':          'חיזוק נשים, התייקרות מאכלים ומשקאות',
  'צדק':           'התייקרות זהב וכסף, חיזוק נכבדים',
};

// House-15 specific yearly outcome rules
const YEARLY_H15_OUTCOME_RULES = [
  {
    id: 'jamaa-from-two-jamaa',
    match: (h15, w13, w14) => h15?.key === '2222' && w13?.key === '2222' && w14?.key === '2222',
    hebrewResult: 'ג׳מאעה מג׳מאעתיים — שנה מרובת רע, רעב, מחלות, פיתנות ומרה שחורה.',
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
    hebrewResult: 'קבץ יוצא ועקלה — מלכים במלחמה, מחלות, מגפה, מאסר ופחד.',
    grade: 'very-bad',
  },
];

function computeYearlyForecastAnalysis(chart) {
  if (!Array.isArray(chart)) return null;

  const h15 = chartHouse(chart, 15);
  const w13 = chartHouse(chart, 13);
  const w14 = chartHouse(chart, 14);

  // בית 15 — כללים ספציפיים
  let house15Result = null;
  for (const rule of YEARLY_H15_OUTCOME_RULES) {
    if (rule.match(h15, w13, w14)) { house15Result = rule; break; }
  }

  // כוכבים ביתדות — מה מתייקר השנה
  const angularPlanets = chart
    .filter((h) => ANGULAR_HOUSES_SET.has(Number(h.house)) && FIGURE_PLANET_MAP[h.key])
    .map((h) => ({
      house: h.house,
      figureHebrew: h.hebrew || h.key,
      planet: FIGURE_PLANET_MAP[h.key],
      meaning: PLANET_YEARLY_MEANING[FIGURE_PLANET_MAP[h.key]] || '',
      fortune: h.fortune || '',
    }));

  // יסוד דומיננטי בלוח
  const elCounts = {};
  for (const h of chart) { if (h.element) elCounts[h.element] = (elCounts[h.element] || 0) + 1; }
  const dominantElement = Object.entries(elCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  const ELEMENT_YEAR_CHARACTER = {
    'אש':    'שנת אש — חום, מחלוקות, מלחמות',
    'מים':   'שנת מים — גשמים, ריבוי, שינויים רגשיים',
    'אוויר': 'שנת אוויר — תנועה, מסחר, שינויים מהירים',
    'עפר':   'שנת עפר — יציבות, חקלאות, ממון',
  };

  // דין גשם — לבנה + נוגה + שבתאי
  const moonAngular   = chart.some((h) => MOON_FIGURE_PATTERNS.has(h.key || '') && ANGULAR_HOUSES_SET.has(Number(h.house)));
  const moonInBoard   = chart.some((h) => MOON_FIGURE_PATTERNS.has(h.key || ''));
  const venusInBoard  = chart.some((h) => ['2211', '1211'].includes(h.key || ''));
  const saturnAngular = chart.some((h) => ['2221', '1221'].includes(h.key || '') && ANGULAR_HOUSES_SET.has(Number(h.house)));

  const rainVerdict =
    (moonAngular && venusInBoard) ? 'heavy-rain' :
    (moonInBoard && !saturnAngular) ? 'moderate-rain' :
    saturnAngular ? 'cold-dry' : 'unknown';

  const rainHebrew = {
    'heavy-rain':    'לבנה ביתד + נוגה בלוח — גשם רב וכללי צפוי.',
    'moderate-rain': 'לבנה בלוח ושבתאי לא ביתד — גשם מתון.',
    'cold-dry':      'שבתאי ביתד — קור, יובש ועננים שחורים.',
    'unknown':       'לא ניתן לקבוע דין גשם ברור מלוח זה.',
  }[rainVerdict];

  const parts = [];
  if (house15Result) parts.push(`בית 15 (אחרית השנה): ${house15Result.hebrewResult}`);
  if (dominantElement) parts.push(`יסוד דומיננטי: ${dominantElement} — ${ELEMENT_YEAR_CHARACTER[dominantElement] || dominantElement}`);
  if (angularPlanets.length) {
    parts.push('כוכבים ביתדות:\n' + angularPlanets.map((p) =>
      `  ${p.planet} (בית ${p.house} — ${p.figureHebrew}): ${p.meaning}`).join('\n'));
  }
  parts.push(`דין גשם ומזג: ${rainHebrew}`);

  return { house15Result, angularPlanets, dominantElement, rainVerdict, rainHebrew, outputHebrew: parts.join('\n') };
}

// ─────────────────────────────────────────────────────────────────────────────
// שער המולד / הנולד — חזרת בעל הטאלע בבתים
// מקור: hawi-birth-nativity.js (חאוי עמ׳ 51-58)
// ─────────────────────────────────────────────────────────────────────────────

// Build house-number → meanings lookup from all rule groups
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

  // בתים שבהם חוזרת צורת הטאלע (מלבד בית 1 עצמו)
  const repeatingHouses = chart
    .filter((h) => h.key === taliPattern && Number(h.house) !== 1)
    .map((h) => Number(h.house))
    .sort((a, b) => a - b);

  const ruleLookup = buildNativityLookup(birthSource);

  const findings = repeatingHouses.map((houseNum) => {
    const meanings = ruleLookup[houseNum] || [];
    return {
      houseNumber: houseNum,
      meanings,
      hebrewShort: meanings.length
        ? meanings.map((m) => m.hebrew).join(' / ')
        : `בית ${houseNum} — לא נמצא פירוש ספציפי במקור לחזרה זו.`,
    };
  });

  const parts = [`בעל הטאלע: ${taliHebrew}`];
  if (!findings.length) {
    parts.push('הצורה אינה חוזרת בבתים אחרים — אין דין מולד ספציפי מן המקור.');
  } else {
    for (const f of findings) parts.push(`חזרה בבית ${f.houseNumber}: ${f.hebrewShort}`);
  }

  return { taliPattern, taliHebrew, repeatingHouses, findings, outputHebrew: parts.join('\n') };
}

// ─────────────────────────────────────────────────────────────────────────────
// ניתוח משולשים — כוכבים לפי יסוד (שער המשולשים, חאוי עמ׳ 59)
// ─────────────────────────────────────────────────────────────────────────────
function computeTrianglesEnrichment(chart) {
  if (!Array.isArray(chart)) return null;

  // בתים מרכזיים: 1, 7, 10, 15
  const enriched = [1, 7, 10, 15]
    .map((n) => chartHouse(chart, n))
    .filter((h) => h && h.element)
    .map((h) => {
      const planets = ELEMENT_TRIANGLE_PLANETS[h.element] || [];
      return {
        house: h.house,
        element: h.element,
        figureHebrew: h.hebrew || h.key,
        trianglePlanets: planets,
        hebrewNote: planets.length
          ? `בית ${h.house} (${h.hebrew || h.key}) — יסוד ${h.element} → כוכבי המשולש: ${planets.join(', ')}`
          : `בית ${h.house} (${h.hebrew || h.key}) — יסוד ${h.element}`,
      };
    });

  if (!enriched.length) return null;
  return { enriched, outputHebrew: enriched.map((e) => e.hebrewNote).join('\n') };
}

// ─────────────────────────────────────────────────────────────────────────────
// אלמנט → סוג מחלה (בלוג' אלאמל פרק 5)
// ─────────────────────────────────────────────────────────────────────────────
const ELEMENT_ILLNESS_TYPE = {
  'אש':    'מרה צהובה — חום, כבד, מרה, בעיות עיכול (חולי אש)',
  'אוויר': 'דם — לחץ דם, עצבים, מחלות נשימה (חולי אוויר)',
  'מים':   'כיח / ריר — ריאות, כליות, בעיות נוזלים (חולי מים)',
  'עפר':   'מרה שחורה — עצבות, עייפות, מחלות כרוניות (חולי עפר)',
};

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

  // סימנים ספציפיים מהספר (פרק 24)
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

// ─────────────────────────────────────────────────────────────────────────────
// זיהוי גנב לפי בית חזרת הצורה (בלוג' אלאמל פרק 19 ועמ' 64)
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// גילוי אויב בסביבה הקרובה (בלוג' אלאמל עמ' 64)
// נוסחה: נקודות פתוחות של צורות נחסיות, חלקי 5, חלוקה על הבתים
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// עיתוי — מתי יסתיים העניין? (בלוג' אלאמל פרק 7)
// יסוד הצורה בבית הדמיר קובע את יחידת הזמן
// ─────────────────────────────────────────────────────────────────────────────
const ELEMENT_TIMING_UNITS = {
  'אש':    { single: 1, label: 'יום / שעה' },
  'אוויר': { single: 2, label: 'ימיים / שעתיים' },
  'מים':   { single: 3, label: 'שלושה ימים / שעות' },
  'עפר':   { single: 4, label: 'ארבעה ימים / שעות' },
};

function computeTimingEstimate(chart, dhamirHouse, topicId) {
  if (!dhamirHouse || !Array.isArray(chart)) return null;

  const dh = Number(dhamirHouse.houseNumber || dhamirHouse.house);
  const dhamirEntry = chart.find((h) => Number(h.house) === dh);
  if (!dhamirEntry) return null;

  const el = dhamirEntry.element || dhamirEntry.elementHebrew || '';
  const timing = ELEMENT_TIMING_UNITS[el];
  if (!timing) return null;

  // קבוצת הבית קובעת את מה מדדים (ימים/שבועות/חודשים/שנים)
  let scale = '';
  if (dh >= 1  && dh <= 4)  scale = 'ימים / שעות (אמהות — מהיר)';
  if (dh >= 5  && dh <= 8)  scale = 'שבועות / ימים (בנות — בינוני)';
  if (dh >= 9  && dh <= 12) scale = 'חודשים / שבועות (נכדות — ממושך)';
  if (dh >= 13 && dh <= 16) scale = 'שנים / חודשים (מאזנים — ארוך)';

  return {
    dhamirHouse: dh,
    dhamirFigure: dhamirEntry.hebrew || dhamirEntry.key,
    element: el,
    timingUnits: timing.label,
    scale,
    outputHebrew: `עיתוי (מתי יסתיים?): הדמיר בבית ${dh} (${dhamirEntry.hebrew || dhamirEntry.key}) — אלמנט ${el} — ${timing.label}. סקאלה: ${scale}`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// צורה שולטת × נישואין (בלוג' אלאמל פרק 33)
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// צורה ראשונה × חזרות (בלוג' אלאמל פרק 17)
// ─────────────────────────────────────────────────────────────────────────────
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
    'שואל על ריבוי נחסים',
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
};

function computeFirstFigureRepetition(chart) {
  const h1Figure = chart.find((h) => Number(h.house) === 1);
  if (!h1Figure) return null;

  const firstKey = h1Figure.key || '';
  const firstHebrew = h1Figure.hebrew || h1Figure.key;

  // ספור כמה פעמים הצורה הראשונה חוזרת בכל הלוח
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
      return {
        house: house.house,
        houseHebrew: house.houseHebrew || null,
        figureHebrew: house.hebrew || house.figureHebrew || null,
        figureKey: house.key || null,
        fortune: house.fortune || null,
        movement: house.movement || null,
        element: house.element || null,
        tone: judgeHouseTone(house),
        transit: getTransitMeaningForHouse(house),
        figureState: getFigureStateForHouse(house),
        houseState: getHouseStateColor(house.house),
        houseFortuneTone: getHouseFortuneTone(house.house),
        isAdversarial: adversarialHouseNums.has(Number(house.house)),
        direction: dir,
        directionHebrew: getFigureDirectionHebrew(dir),
        isNaturalFigure: !!(house.key && NATURAL_HOUSE_FIGURES[house.house] === house.key),
        seventhFigure: getSeventhFigure(house.key || null),
        quadrant: HOUSE_QUADRANT(house.house),
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
    ? nameExtractionHouses.map((h) => computeNameLetters(board.chart, h)).filter(Boolean)
    : null;

  const authorityStateAnalysis = (topicId === 'authorityState')
    ? computeAuthorityStateAnalysis(board.chart) : null;

  const yearlyForecastAnalysis = (topicId === 'yearlyForecast')
    ? computeYearlyForecastAnalysis(board.chart) : null;

  const birthNativityAnalysis = (topicId === 'birthNativity')
    ? computeBirthNativityAnalysis(board.chart, HAWI_SOURCE.extendedKnowledge?.birthNativity) : null;

  const trianglesEnrichment = (['yearlyForecast', 'birthNativity', 'authorityState'].includes(topicId))
    ? computeTrianglesEnrichment(board.chart) : null;
  const directionQuadrant = (['travel', 'hiddenTreasure', 'missingPerson'].includes(topicId))
    ? computeDirectionQuadrant(board.chart) : null;

  const illnessElementDiagnosis = (topicId === 'illness')
    ? computeIllnessElementDiagnosis(board.chart) : null;

  const thiefLocationDetails = (['theft', 'enemies'].includes(topicId))
    ? computeThiefLocationDetails(board.chart) : null;

  const enemyInHousehold = (topicId === 'enemies')
    ? computeEnemyInHousehold(board.chart) : null;

  const timingEstimate = dhamirHouse
    ? computeTimingEstimate(board.chart, dhamirHouse, topicId) : null;

  const marriageFigureForecast = (topicId === 'marriage')
    ? computeMarriageFigureForecast(board.chart) : null;

  const firstFigureRepetition = computeFirstFigureRepetition(board.chart);

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

  // בדיקת השביעית — האם צורה כלשהי בבית 1 מוצאת את שביעיתה בלוח
  const h1Key = board.chart.find((h) => Number(h.house) === 1)?.key;
  const h1Seventh = getSeventhFigure(h1Key);
  const seventhOfHouse1Found = h1Seventh
    ? board.chart.find((h) => h.key === h1Seventh && Number(h.house) !== 1)
    : null;

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
    trianglesEnrichment,
    directionQuadrant,
    illnessElementDiagnosis,
    thiefLocationDetails,
    enemyInHousehold,
    timingEstimate,
    marriageFigureForecast,
    firstFigureRepetition,
    sourceQuality,
    seventhOfHouse1: seventhOfHouse1Found
      ? { pattern: h1Seventh, foundInHouse: Number(seventhOfHouse1Found.house), figureHebrew: seventhOfHouse1Found.hebrew || h1Seventh }
      : null,
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

  // Use house-specific fortune override from figure states when available, else base figure fortune
  const judgeTone = (getFigureStateHouseTone(judge?.figureState) ?? getFigureFortuneTone(judge));
  const w1Tone = w1 ? (getFigureStateHouseTone(w1?.figureState) ?? getFigureFortuneTone(w1)) : 0;
  const w2Tone = w2 ? (getFigureStateHouseTone(w2?.figureState) ?? getFigureFortuneTone(w2)) : 0;
  const focusTone = focus ? (getFigureStateHouseTone(focus?.figureState) ?? getFigureFortuneTone(focus)) : 0;

  // Speaking state multiplier (שותק = silent = weakened influence, per Hawi figure states chapter)
  const judgeMulti = getSpeakingStateMultiplier(judge?.figureState);
  const w1Multi = getSpeakingStateMultiplier(w1?.figureState);
  const w2Multi = getSpeakingStateMultiplier(w2?.figureState);
  const focusMulti = getSpeakingStateMultiplier(focus?.figureState);

  // Quesited house (בית הנשאל) — the house representing the subject of the question.
  const quesitedHouseNum = boardAnalysis.tahasil?.quesitedHouseNum;
  const quesitedEntry = quesitedHouseNum
    ? boardAnalysis.houses?.find?.((h) => Number(h.house) === quesitedHouseNum)
    : null;
  const quesitedTone = quesitedEntry
    ? (getFigureStateHouseTone(quesitedEntry?.figureState) ?? getFigureFortuneTone(quesitedEntry))
    : 0;
  const quesitedMulti = getSpeakingStateMultiplier(quesitedEntry?.figureState);

  // Direction modifier (כיוון הצורה): incoming figure in quesited house = positive pull toward outcome
  // outgoing = moving away. Source: Hawi figure classification داخل/خارج.
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

  // Topic key-pair connections: each confirmed beneficial connection adds a small bonus.
  const topicConnectionBonus = (boardAnalysis.topicConnections?.checks || [])
    .filter((c) => c.connected)
    .length * 0.5;

  // Dhamir (الضمير) — the hidden intention behind the question. Mizan-tracing is primary.
  // When dhamir agrees with judge → confirms ruling. When opposed → signals inner conflict or change.
  const dhamirFortune = boardAnalysis.dhamirByMizan?.primaryFortune || boardAnalysis.dhamirHouse?.fortune || '';
  const dhamirTone = dhamirFortune.includes('סעד') ? 1 : dhamirFortune.includes('נחס') ? -1 : 0;

  // Figure repetition bonus: judge figure appearing in multiple houses = judgment reinforced.
  const judgePattern = judge?.figureKey;
  const judgeRepeatCount = judgePattern
    ? ((boardAnalysis.ittisalat?.figureConnections || []).find((fc) => fc.figureKey === judgePattern)?.houses?.length || 1)
    : 1;
  const repetitionBonus = Math.max(0, judgeRepeatCount - 1) * 0.4;

  // Aspect/connection bonus: questioner (house 1) connecting to focus house = outcome more reachable.
  const h1toFocus = boardAnalysis.ittisalat?.questioner_to_focus;
  const aspectBonus = (h1toFocus?.type === 'same-figure') ? 1.0
    : (h1toFocus?.type === 'aspect') ? 0.5 : 0;

  // Board completeness: incomplete board (< 96 pts) reduces verdict confidence by 20%.
  const boardComplete = boardAnalysis.boardScore?.isComplete !== false;
  const completenessMultiplier = boardComplete ? 1 : 0.8;

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
  const score = Math.round(rawScore * completenessMultiplier * 2);

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
    reasons.push(`דמיר (בית ${dhamirHouseNum}): ${dhamirFortune}${dhamirNote}`);
  }
  if (repetitionBonus > 0) {
    reasons.push(`צורת הדיין (${judge?.figureHebrew || ''}) חוזרת ${judgeRepeatCount} פעמים בלוח — הדין מחוזק`);
  }
  if (aspectBonus > 0) {
    reasons.push(`קשר בין בית 1 לבית המרכזי: ${h1toFocus?.hebrewShort || (aspectBonus >= 1 ? 'צורה זהה' : 'מבט')}`);
  }
  if (!boardComplete) {
    reasons.push(`לוח חסר (${boardAnalysis.boardScore?.score || '?'} נקודות < 96) — הפסיקה מוחלשת ב-20%`);
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

  // שלמות הלוח — תנאי מוקדם לפסיקה
  const bScore = boardAnalysis.boardScore;
  if (bScore && !bScore.isComplete) {
    parts.push(`⚠ ${bScore.hebrewSummary} — הפסיקה אפשרית אך בטחונה מוגבל.`);
  }

  // אצאלה — תקפות הלוח (בדיקה מקדימה לכל פסיקה, לפי חאוי)
  const asala = boardAnalysis.asala;
  if (asala && !asala.isRadical) {
    parts.push(asala.hebrewNote);
  }

  // Lead with judge verdict (short form to avoid duplication with describeCoreHouses)
  const judgeHebrew = judge?.figureHebrew || 'לא מזוהה';
  const judgeFortune = judge?.fortune ? ` (${judge.fortune})` : '';
  parts.push(`הדיין בבית 15: ${judgeHebrew}${judgeFortune} — ${judgeVerdict?.hebrewShort || boardScore.hebrewShort || 'תשובה לא מוכרעת'}.`);

  // דמיר — האם מאשר או סותר את הדיין
  const dhamirByMizan = boardAnalysis.dhamirByMizan;
  const dhamirHouseEntry = boardAnalysis.dhamirHouse;
  const dhamirFort = dhamirByMizan?.primaryFortune || dhamirHouseEntry?.fortune || '';
  const dhamirToneConclusion = dhamirFort.includes('סעד') ? 1 : dhamirFort.includes('נחס') ? -1 : 0;
  const judgeToneConclusion = judgeVerdict?.judgeTone ?? 0;
  if (dhamirByMizan?.traces?.length > 0 && dhamirToneConclusion !== 0) {
    const confirmingConclusion = (judgeToneConclusion > 0 && dhamirToneConclusion > 0) || (judgeToneConclusion < 0 && dhamirToneConclusion < 0);
    const dhamirLabel = confirmingConclusion ? 'מאשר את הדיין ומחזק את הפסיקה' : 'סותר את הדיין — שים לב, ייתכן שינוי';
    parts.push(`הדמיר (בית ${dhamirByMizan.primaryHouseNumber} — ${dhamirByMizan.primaryHebrew}): ${dhamirFort} — ${dhamirLabel}.`);
  } else if (dhamirHouseEntry && dhamirToneConclusion !== 0) {
    const confirmingConclusion = (judgeToneConclusion > 0 && dhamirToneConclusion > 0) || (judgeToneConclusion < 0 && dhamirToneConclusion < 0);
    const dhamirLabel = confirmingConclusion ? 'מאשר את הדיין' : 'סותר את הדיין — זהירות';
    parts.push(`הדמיר (בית ${dhamirHouseEntry.houseNumber} — ${dhamirHouseEntry.figureHebrew}): ${dhamirFort} — ${dhamirLabel}.`);
  }

  if (sentence) {
    parts.push(
      `בית 16 (אחרית הדבר): ${sentence.figureHebrew || 'לא מזוהה'} — מראה את השלמת הדין.`
    );
  }

  // תחסיל ומניעה — שאלת ההגעה המרכזית
  const tahasil = boardAnalysis.tahasil;
  if (tahasil) {
    parts.push(tahasil.tahasilHebrew);
    if (tahasil.hayulaActive) {
      parts.push(tahasil.hayulaHebrew);
    }

    // בית הנשאל — מצב הצד הנשאל בשאלה
    const quesitedHouseNum = tahasil.quesitedHouseNum;
    const quesitedEntry = quesitedHouseNum
      ? boardAnalysis.houses?.find?.((h) => Number(h.house) === quesitedHouseNum)
      : null;
    if (quesitedEntry && quesitedHouseNum !== (boardAnalysis.focusHouseNumber)) {
      const qFortune = quesitedEntry.fortune || '';
      const qFigure = quesitedEntry.figureHebrew || '';
      const qSpeak = getSpeakingStateHebrew(quesitedEntry?.figureState);
      if (qFigure) {
        parts.push(
          `בית הנשאל (בית ${quesitedHouseNum}): ${qFigure}${qFortune ? ` — ${qFortune}` : ''}${qSpeak ? ` [${qSpeak}]` : ''}.`
        );
      }
    }
  }

  // קשרי נושא ספציפיים
  const connections = (boardAnalysis.topicConnections?.checks || []).filter((c) => c.connected);
  if (connections.length > 0) {
    parts.push(`קשרים פעילים: ${connections.map((c) => c.role).join(' | ')}.`);
  }

  // כיוון בית הנשאל (נכנס/יוצא/קבוע/מתהפך)
  const qFocus = boardAnalysis.focusHouse;
  if (qFocus?.directionHebrew) {
    const naturalNote = qFocus.isNaturalFigure ? ' — הצורה הטבעית של הבית, הדין חזק במיוחד.' : '.';
    parts.push(`כיוון הצורה בבית המרכזי (${qFocus.house}): ${qFocus.figureHebrew} — ${qFocus.directionHebrew}${naturalNote}`);
  }

  // בית 1 — מצב השואל
  const h1a = boardAnalysis.house1Analysis;
  if (h1a) {
    const naturalH1 = h1a.isNatural ? ' הצורה הטבעית לבית הטאלע — כוח כפול.' : '';
    parts.push(`מצב השואל (בית 1): ${h1a.figureHebrew} — ${h1a.fortuneHebrew}.${naturalH1}`);
  }

  // כל צורה מבקשת שביעיתה
  const seventh = boardAnalysis.seventhOfHouse1;
  if (seventh) {
    parts.push(`השביעית של בית 1 (${boardAnalysis.house1Analysis?.figureHebrew || ''}): ${seventh.figureHebrew} — נמצאת בבית ${seventh.foundInHouse}. קשר זה חזק לפי חאוי.`);
  }

  // איתיסלאת — חיבורי צורות חוזרות
  const repeatedFigs = (boardAnalysis.ittisalat?.figureConnections || []).filter((c) => c.houses?.length >= 2);
  if (repeatedFigs.length > 0) {
    const top = repeatedFigs[0];
    parts.push(`צורה חוזרת: ${top.figureHebrew} בבתים ${top.houses.join(', ')} — ${top.quality}.`);
  }

  // חי או מת — שאלת נעדר
  if (boardAnalysis.lifeDeathAnalysis) {
    parts.push(`חי/מת: ${boardAnalysis.lifeDeathAnalysis.hebrewVerdict}`);
  }

  // ניתוח כיוונים — נסיעה / מטמון
  if (boardAnalysis.directionQuadrant?.dominant) {
    const dom = boardAnalysis.directionQuadrant.dominant;
    if (dom.incomingBenefic > 0) {
      parts.push(`כיוון דומיננטי: ${dom.hebrewDir} — ${dom.incomingBenefic} צורות נכנסות וטובות בריבוע זה.`);
    }
  }

  // הערת איכות מקור — מידע לפרקטיקן בלבד
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
    spiritualDiagnosis,
    technicalConclusionHebrew,
    finalConclusionHebrew: writeHumanGoralConclusion({
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
    }),
    conclusionDraftHebrew: technicalConclusionHebrew,
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
