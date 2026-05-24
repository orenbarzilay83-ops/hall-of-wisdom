import * as APPROVED_SPIRITUAL_SOURCE from '../data/sources/approved-raml/spiritual-diagnostics/raml-spiritual-diagnostics-sihr-mass-hasad.js';

// Mapping from Arabic figure names (as they appear in source rules) to Hebrew names used in the board
const ARABIC_TO_HEBREW_FIGURE = {
  'الأنكيس': 'שפל ראש',
  'المنكوس': 'שפל ראש',
  'الجودلة': 'נלחם',
  'كوسج': 'נלחם',
  'القبض الداخل': 'ממון נכנס',
  'الأحيان': 'נשוא ראש',
  'الضاحك': 'נשוא ראש',
  'العقلة': 'סוהר',
  'الشقاوة': 'סוהר',
  'الجماعة': 'קהלה',
  'الحمرة': 'אדום',
  'الاجتماع': 'חיבור',
  'البياض': 'לבן',
  'القبض الخارج': 'ממון יוצא',
  'الطريق': 'דרך',
  'عتبة خارجة': 'סף יוצא',
  'عتبة داخلة': 'סף נכנס',
  'نصرة خارجة': 'כבוד יוצא',
  'نصرة داخلة': 'כבוד נכנס',
  'نقي الخد': 'בר הלחי',
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

function getApprovedSpiritualSource() {
  const values = Object.values(APPROVED_SPIRITUAL_SOURCE);
  return values.find((v) => v && typeof v === 'object' && !Array.isArray(v)) || {};
}

function getHouse(board, houseNumber) {
  return asArray(board?.chart).find((h) => Number(h.house) === Number(houseNumber)) || null;
}

function getFigureHebrewName(house) {
  return house?.hebrew || house?.figureHebrew || house?.name || null;
}

function figureMatchesRule(house, ruleArabicFigure) {
  if (!house || !ruleArabicFigure) return false;
  const figureHebrew = getFigureHebrewName(house);
  if (!figureHebrew) return false;
  const expectedHebrew = ARABIC_TO_HEBREW_FIGURE[ruleArabicFigure.trim()];
  if (expectedHebrew && normalizeText(figureHebrew) === normalizeText(expectedHebrew)) return true;
  // Fallback: check if Arabic name appears in house fields
  const houseText = normalizeText([house.arabic, house.arabicName, house.key].filter(Boolean).join(' '));
  return houseText.includes(normalizeText(ruleArabicFigure));
}

// Check specific figure+house rules from the source data
function checkFigureHouseRules(board, source) {
  const rules = asArray(source.figureHouseRules);
  const matched = [];

  for (const rule of rules) {
    if (!rule.figure || !rule.house) continue;
    const house = getHouse(board, rule.house);
    if (!house) continue;
    if (!figureMatchesRule(house, rule.figure)) continue;

    const figureHebrew = getFigureHebrewName(house);
    const diagnosis = (rule.hebrewTranslation || []).join(' ');
    const meaning = rule.appMeaningHebrew || diagnosis;

    matched.push({
      ruleId: rule.id,
      house: rule.house,
      figureHebrew,
      diagnosisHebrew: diagnosis,
      meaningHebrew: meaning,
      severity: rule.severity || 'medium',
      sourcePage: rule.sourcePage || null,
    });
  }

  return matched;
}

// Check general opening rules (e.g. "עקלה = מכשפה", "חיבור = מכשף רע")
function checkOpeningRules(board, source) {
  const rules = asArray(source.openingRules);
  const matched = [];

  for (const rule of rules) {
    const figures = asArray(rule.figures);
    for (const arabicFigure of figures) {
      // Check if this figure appears anywhere on the board
      const allHouses = asArray(board?.chart);
      const found = allHouses.find((h) => figureMatchesRule(h, arabicFigure));
      if (!found) continue;

      const figureHebrew = getFigureHebrewName(found);
      const diagnosis = asArray(rule.hebrewTranslation).join(' ');

      matched.push({
        ruleId: rule.id,
        house: found.house,
        figureHebrew,
        diagnosisHebrew: diagnosis,
        meaningHebrew: diagnosis,
        severity: 'medium',
        sourcePage: rule.sourcePage || null,
      });
      break;
    }
  }

  return matched;
}

function severityScore(severity) {
  const map = { extreme: 8, 'very-high': 6, high: 4, 'medium-high': 3, medium: 2, low: 1 };
  return map[severity] || 2;
}

function gradeFromMatches(specificMatches, openingMatches, genericScore) {
  const specificScore = specificMatches.reduce((s, m) => s + severityScore(m.severity), 0);
  const openingScore = openingMatches.reduce((s, m) => s + 1, 0);
  const total = specificScore * 2 + openingScore + genericScore;

  if (specificMatches.some((m) => m.severity === 'extreme' || m.severity === 'very-high') || total >= 12) {
    return 'strong-suspicion';
  }
  if (specificMatches.length > 0 || total >= 7) {
    return 'medium-suspicion';
  }
  if (openingMatches.length > 0 || total >= 3) {
    return 'weak-suspicion';
  }
  if (total <= -2) {
    return 'mostly-clear';
  }
  return 'mixed';
}

function buildFinalHebrew(grade, specificMatches, openingMatches, isqatResult, jinnTypeResult) {
  const verdictMap = {
    'strong-suspicion': 'מסקנה רוחנית: כן — הלוח מראה סימנים חזקים לפגיעה רוחנית לפי כללי המקור.',
    'medium-suspicion': 'מסקנה רוחנית: ייתכן — יש חשד בינוני לפגיעה רוחנית. נמצאו התאמות מהמקור שדורשות בדיקה.',
    'weak-suspicion': 'מסקנה רוחנית: ספק — יש סימנים חלשים בלבד, אין הכרעה חזקה.',
    'mostly-clear': 'מסקנה רוחנית: לא — אין סימן חזק לפגיעה רוחנית בלוח זה.',
    mixed: 'מסקנה רוחנית: הלוח ממוזג. יש לבדוק את בית 6, בית 12, העדים והדיין לפני הכרעה.',
  };

  let base = verdictMap[grade] || verdictMap.mixed;
  const details = [];

  for (const m of specificMatches.slice(0, 4)) {
    const position = m.house === 15 ? 'הדיין' : m.house === 13 ? 'עד ראשון' : m.house === 14 ? 'עד שני' : `בית ${m.house}`;
    details.push(`${position} (${m.figureHebrew}): ${m.diagnosisHebrew}`);
  }

  for (const m of openingMatches.slice(0, 2)) {
    const position = m.house === 15 ? 'הדיין' : m.house === 13 ? 'עד ראשון' : m.house === 14 ? 'עד שני' : `בית ${m.house}`;
    details.push(`${position} (${m.figureHebrew}): ${m.diagnosisHebrew}`);
  }

  if (details.length > 0) {
    base += '\n' + details.join('\n');
  }

  if (isqatResult?.hebrewText) {
    base += '\nספירת מפתוח 7×7: ' + isqatResult.hebrewText;
  }

  if (jinnTypeResult?.hebrewText) {
    base += '\nסוג הג׳ין (15×4): ' + jinnTypeResult.hebrewText;
  }

  return base;
}

function detectSpiritualTopicFromQuestion(question = '') {
  const keywords = {
    sihr: ['כישוף', 'סחר', 'סحر', 'sihr', 'קשירה', 'טליסמא', 'طلسم'],
    ayin: ['עין', 'עין הרע', 'عين'],
    hasad: ['קנאה', 'חסד', 'حسد', 'hasad'],
    jinn: ['ג׳ין', 'גין', 'שדים', 'جن', 'jinn'],
    mass: ['מס', 'אחיזה', 'פגיעה רוחנית', 'مس', 'mass'],
    fearHiddenEnemy: ['פחד', 'אויב נסתר', 'שנאה', 'טינה', 'הסתרה'],
  };
  const hits = [];
  const text = normalizeText(question);
  for (const [cat, words] of Object.entries(keywords)) {
    if (words.some((w) => text.includes(normalizeText(w)))) hits.push(cat);
  }
  return hits;
}

// Generic house scoring (kept as a secondary signal)
function quickHouseScore(board) {
  const SCORED_HOUSES = [
    { house: 1, weight: 1 },
    { house: 6, weight: 3 },
    { house: 8, weight: 2 },
    { house: 12, weight: 3 },
    { house: 15, weight: 2 },
  ];

  const BAD_MARKERS = ['נחס', 'רע', 'malefic', 'nahs', 'نحس', 'אדום', 'humra', 'الحمرة'];
  const GOOD_MARKERS = ['סעד', 'טוב', 'benefic', 'saad', 'سعد', 'לבן', 'bayad', 'البياض'];

  let score = 0;
  for (const { house, weight } of SCORED_HOUSES) {
    const h = getHouse(board, house);
    if (!h) continue;
    const text = normalizeText([h.hebrew, h.key, h.fortune, h.element].filter(Boolean).join(' '));
    if (BAD_MARKERS.some((w) => text.includes(normalizeText(w)))) score += weight;
    if (GOOD_MARKERS.some((w) => text.includes(normalizeText(w)))) score -= 1;
  }
  return score;
}

// Count open (odd) points in the board and apply 7×7 isqat method from ספר 2
function applyIsqatSevenMethod(board, source) {
  const allHouses = asArray(board?.chart);
  if (!allHouses.length) return null;

  // Count total open (odd) points across all 16 houses
  let openCount = 0;
  for (const house of allHouses) {
    const pattern = house.figure || house.key || '';
    if (pattern && /^[12]{4}$/.test(String(pattern))) {
      for (const ch of String(pattern)) {
        if (ch === '1') openCount++;
      }
    } else if (house.figure && Array.isArray(house.figure)) {
      for (const v of house.figure) {
        if (Number(v) === 1) openCount++;
      }
    }
  }

  if (!openCount) return null;

  // Reduce modulo 7, remainder in range 1-7
  const remainder = ((openCount - 1) % 7) + 1;

  const results = asArray(source?.isqatSevenRules?.results);
  const match = results.find((r) => Number(r.remainder) === remainder);

  return {
    openCount,
    remainder,
    diagnosis: match?.diagnosis || null,
    hebrewText: match?.hebrew || null,
  };
}

// Get figure element (fire/air/water/earth) from pattern
function getFigureElement(house) {
  const element = String(house?.element || house?.elementHebrew || '').toLowerCase();
  if (element.includes('אש') || element.includes('fire')) return 'fire';
  if (element.includes('אוויר') || element.includes('air')) return 'air';
  if (element.includes('מים') || element.includes('water')) return 'water';
  if (element.includes('עפר') || element.includes('earth') || element.includes('ard')) return 'earth';
  return null;
}

// Apply 15×4 jinn type method from ספר 2
function applyJinnTypeMethod(board, source) {
  const judge = asArray(board?.chart).find((h) => Number(h.house) === 15);
  if (!judge) return null;

  const judgeElement = getFigureElement(judge);
  if (!judgeElement) return null;

  const jinnRules = asArray(source?.jinnTypeRules);
  const match = jinnRules.find((r) => r.element === judgeElement);
  if (!match) return null;

  return {
    judgeFigure: judge.hebrew || judge.figureHebrew || null,
    judgeElement,
    jinnType: match.jinnType || null,
    hebrewText: match.resultHebrew || null,
  };
}

export function diagnoseSpiritualInfluence(question = '', board = null) {
  const source = getApprovedSpiritualSource();
  const questionHits = detectSpiritualTopicFromQuestion(question);

  if (!board || !Array.isArray(board.chart)) {
    return {
      id: 'goral-spiritual-diagnostics',
      active: true,
      hasBoard: false,
      questionHits,
      finalHebrew: 'שכבת האבחון הרוחני פעילה, אבל לא התקבל לוח גורל מלא. לכן אין לפסוק כישוף/עין/אחיזה בלי לוח.',
    };
  }

  const specificMatches = checkFigureHouseRules(board, source);
  const openingMatches = checkOpeningRules(board, source);
  const genericScore = quickHouseScore(board) + (questionHits.length ? 2 : 0);
  const isqatResult = applyIsqatSevenMethod(board, source);
  const jinnTypeResult = applyJinnTypeMethod(board, source);

  const grade = gradeFromMatches(specificMatches, openingMatches, genericScore);
  const finalHebrew = buildFinalHebrew(grade, specificMatches, openingMatches, isqatResult, jinnTypeResult);

  const mainReasons = specificMatches.map((m) => ({
    house: m.house,
    role: m.house === 15 ? 'הדיין' : m.house === 13 ? 'עד ראשון' : m.house === 14 ? 'עד שני' : `בית ${m.house}`,
    figureHebrew: m.figureHebrew,
    score: severityScore(m.severity),
    signals: [m.diagnosisHebrew],
    sourceBased: true,
  }));

  if (!mainReasons.length && openingMatches.length) {
    openingMatches.slice(0, 3).forEach((m) => {
      mainReasons.push({
        house: m.house,
        role: m.house === 15 ? 'הדיין' : m.house === 13 ? 'עד ראשון' : m.house === 14 ? 'עד שני' : `בית ${m.house}`,
        figureHebrew: m.figureHebrew,
        score: 1,
        signals: [m.diagnosisHebrew],
        sourceBased: true,
      });
    });
  }

  // Add isqat result as a signal if found
  if (isqatResult?.hebrewText) {
    mainReasons.push({
      house: null,
      role: 'ספירת מפתוח (7×7)',
      figureHebrew: null,
      score: 1,
      signals: [isqatResult.hebrewText],
      sourceBased: true,
      isqat: true,
    });
  }

  return {
    id: 'goral-spiritual-diagnostics',
    active: true,
    hasBoard: true,
    questionHits,
    specificMatches,
    openingMatches,
    genericScore,
    isqatResult,
    jinnTypeResult,
    grade,
    finalHebrew,
    mainReasons,
    shouldShow: grade !== 'mixed',
    isSpiritualQuestion: questionHits.length > 0,
  };
}

export function isSpiritualQuestion(question = '') {
  return detectSpiritualTopicFromQuestion(question).length > 0;
}

export default {
  diagnoseSpiritualInfluence,
  isSpiritualQuestion,
};

if (typeof module !== 'undefined') {
  module.exports = {
    diagnoseSpiritualInfluence,
    isSpiritualQuestion,
  };
}
