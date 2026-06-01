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

// Helper: check if a house has a specific 4-digit pattern
function houseHasPattern(house, pattern) {
  if (!house) return false;
  const key = house.key || (Array.isArray(house.figure) ? house.figure.join('') : '');
  return key === pattern;
}

// Check jamaa derivation rules — house 13 from 9×10, house 14 from 11×12
function checkJamaaDerivedRules(board, source) {
  const matched = [];

  // Patterns
  const JAMAA_PATTERN = '2222';  // קהלה
  const HUMRA_PATTERN = '2122';  // אדום
  const NAKIS_PATTERN = '2221';  // שפל ראש

  const house9 = getHouse(board, 9);
  const house10 = getHouse(board, 10);
  const house11 = getHouse(board, 11);
  const house12 = getHouse(board, 12);
  const house13 = getHouse(board, 13);
  const house14 = getHouse(board, 14);

  // Rule 1: house 13 = קהלה AND houses 9+10 are both אדום
  if (
    houseHasPattern(house13, JAMAA_PATTERN) &&
    houseHasPattern(house9, HUMRA_PATTERN) &&
    houseHasPattern(house10, HUMRA_PATTERN)
  ) {
    matched.push({
      ruleId: 'jamaa-from-two-humra-witness1',
      house: 13,
      figureHebrew: 'קהלה',
      diagnosisHebrew: 'ג׳מאעה שיצאה משתי חומרה — קנאה חזקה מאוד',
      meaningHebrew: 'ג׳מאעה שיצאה משתי חומרה — קנאה חזקה מאוד',
      severity: 'very-high',
      sourcePage: null,
    });
  }

  // Rule 2: house 13 = קהלה AND houses 9+10 are both שפל ראש
  if (
    houseHasPattern(house13, JAMAA_PATTERN) &&
    houseHasPattern(house9, NAKIS_PATTERN) &&
    houseHasPattern(house10, NAKIS_PATTERN)
  ) {
    matched.push({
      ruleId: 'jamaa-from-two-nakis-witness1',
      house: 13,
      figureHebrew: 'קהלה',
      diagnosisHebrew: 'ג׳מאעה שיצאה משני שפל ראש — שני כישופים קבורים ומתחדשים',
      meaningHebrew: 'ג׳מאעה שיצאה משני שפל ראש — שני כישופים קבורים ומתחדשים',
      severity: 'extreme',
      sourcePage: null,
    });
  }

  // Rule 3: house 14 = קהלה AND houses 11+12 are both אדום
  if (
    houseHasPattern(house14, JAMAA_PATTERN) &&
    houseHasPattern(house11, HUMRA_PATTERN) &&
    houseHasPattern(house12, HUMRA_PATTERN)
  ) {
    matched.push({
      ruleId: 'jamaa-from-two-humra-witness2',
      house: 14,
      figureHebrew: 'קהלה',
      diagnosisHebrew: 'ג׳מאעה שיצאה משתי חומרה — קנאה חזקה מאוד',
      meaningHebrew: 'ג׳מאעה שיצאה משתי חומרה — קנאה חזקה מאוד',
      severity: 'very-high',
      sourcePage: null,
    });
  }

  // Rule 4: house 14 = קהלה AND houses 11+12 are both שפל ראש
  if (
    houseHasPattern(house14, JAMAA_PATTERN) &&
    houseHasPattern(house11, NAKIS_PATTERN) &&
    houseHasPattern(house12, NAKIS_PATTERN)
  ) {
    matched.push({
      ruleId: 'jamaa-from-two-nakis-witness2',
      house: 14,
      figureHebrew: 'קהלה',
      diagnosisHebrew: 'ג׳מאעה שיצאה משני שפל ראש — שני כישופים קבורים ומתחדשים',
      meaningHebrew: 'ג׳מאעה שיצאה משני שפל ראש — שני כישופים קבורים ומתחדשים',
      severity: 'extreme',
      sourcePage: null,
    });
  }

  return matched;
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

// Spiritual houses where a sorcery-related figure carries higher diagnostic weight
const CRITICAL_SPIRITUAL_HOUSES = {
  6:  'high',        // בית המחלה
  9:  'very-high',   // בית המכשף
  12: 'medium-high', // בית האויבים
  13: 'high',        // עד ראשון
  14: 'high',        // עד שני
};

function stripArabic(text = '') {
  return String(text)
    .replace(/[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]+/g, '')
    .replace(/\s*\/\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Check general opening rules (e.g. "עקלה = מכשפה", "חיבור = מכשף רע")
// Finds ALL occurrences on the board; figures in critical spiritual houses
// are marked inCriticalHouse=true so they can be promoted to specificMatches.
function checkOpeningRules(board, source) {
  const rules = asArray(source.openingRules);
  const matched = [];

  for (const rule of rules) {
    const figures = asArray(rule.figures);
    for (const arabicFigure of figures) {
      const allHouses = asArray(board?.chart);
      const foundAll = allHouses.filter((h) => figureMatchesRule(h, arabicFigure));
      if (!foundAll.length) continue;

      for (const found of foundAll) {
        const figureHebrew = getFigureHebrewName(found);
        const houseNum = Number(found.house);
        const criticalSeverity = CRITICAL_SPIRITUAL_HOUSES[houseNum];
        const rawText = asArray(rule.hebrewTranslation).map(stripArabic).join(' ');
        const meaning = rule.appMeaningHebrew || rawText;

        matched.push({
          ruleId: `${rule.id}-h${houseNum}`,
          house: found.house,
          figureHebrew,
          diagnosisHebrew: meaning,
          meaningHebrew: meaning,
          severity: criticalSeverity || 'medium',
          sourcePage: rule.sourcePage || null,
          inCriticalHouse: !!criticalSeverity,
        });
      }
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

function buildFinalHebrew(grade, specificMatches, openingMatches, isqatResult, jinnTypeResult, organDiagnosisResult) {
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

  if (organDiagnosisResult?.hebrewText) {
    base += '\nאבחון איבר (בית 6 × בית 8): ' + organDiagnosisResult.hebrewText;
    if (organDiagnosisResult.organHebrew) {
      base += ' | איבר: ' + organDiagnosisResult.organHebrew;
    }
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

// Apply 8×6 organ/illness-type method from ספר 2
// Looks at the dominant element in houses 6 and 8 to identify the type of physical illness
function applyOrganDiagnosisMethod(board, source) {
  const house6 = getHouse(board, 6);
  const house8 = getHouse(board, 8);
  if (!house6 && !house8) return null;

  const elements = [house6, house8]
    .filter(Boolean)
    .map(getFigureElement)
    .filter(Boolean);

  if (!elements.length) return null;

  // Count element occurrences; if tie, prefer house 6 (illness house)
  const counts = {};
  for (const el of elements) counts[el] = (counts[el] || 0) + 1;

  let dominant = getFigureElement(house6) || getFigureElement(house8);
  let maxCount = 0;
  for (const [el, count] of Object.entries(counts)) {
    if (count > maxCount) { maxCount = count; dominant = el; }
  }

  if (!dominant) return null;

  const results = asArray(source?.organDiagnosisRules?.results);
  const match = results.find((r) => r.element === dominant);
  if (!match) return null;

  return {
    house6Element: getFigureElement(house6),
    house8Element: getFigureElement(house8),
    dominantElement: dominant,
    diagnosis: match.diagnosis,
    hebrewText: match.hebrewIllness,
    organHebrew: match.organHebrew,
  };
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

function checkPerpetratorRules(board, source) {
  const h7 = getHouse(board, 7);
  if (!h7) return null;

  const figureHebrew = getFigureHebrewName(h7);
  if (!figureHebrew) return null;

  const prRules = source?.perpetratorRules;
  if (!prRules) return null;

  const normFig = normalizeText(figureHebrew);
  const maleList   = (prRules.genderFromFigure?.male   || []).map(normalizeText);
  const femaleList = (prRules.genderFromFigure?.female || []).map(normalizeText);

  const isMale   = maleList.includes(normFig);
  const isFemale = femaleList.includes(normFig);
  const gender   = isMale ? 'זכר' : isFemale ? 'נקבה' : null;

  const specificNote = (prRules.specificFigureNotes || [])
    .find((n) => normalizeText(n.figureHebrew) === normFig);

  if (!gender && !specificNote) return null;

  return {
    figureHebrew,
    gender,
    specificNoteHebrew: specificNote?.noteHebrew || null,
    hebrewText: gender
      ? `מין העושה: ${gender}${specificNote ? ` — ${specificNote.noteHebrew}` : ''}`
      : specificNote?.noteHebrew || null,
  };
}

function checkSorcererLocation(board, source) {
  const h6 = getHouse(board, 6);
  if (!h6) return null;

  const figureHebrew = getFigureHebrewName(h6);
  if (!figureHebrew) return null;

  const locRules = source?.sorcererLocationRules;
  if (!locRules) return null;

  const normFig = normalizeText(figureHebrew);
  const match = (locRules.figureLocations || [])
    .find((r) => normalizeText(r.figureHebrew) === normFig);
  if (!match) return null;

  return {
    figureHebrew,
    direction: match.direction,
    locationHebrew: match.locationHebrew,
    hebrewText: match.locationHebrew,
  };
}

function checkSorcererProfile(board, source) {
  const h9 = getHouse(board, 9);
  if (!h9) return null;

  const figureHebrew = getFigureHebrewName(h9);
  if (!figureHebrew) return null;

  const profRules = source?.sorcererProfileRules;
  if (!profRules) return null;

  const normFig = normalizeText(figureHebrew);
  const match = (profRules.figureProfiles || [])
    .find((r) => normalizeText(r.figureHebrew) === normFig);
  if (!match) return null;

  return {
    figureHebrew,
    genderHint: match.genderHint,
    professionHebrew: match.professionHebrew,
    appearanceHebrew: match.appearanceHebrew,
    hebrewText: [match.professionHebrew, match.appearanceHebrew].filter(Boolean).join(' — '),
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

  const rawOpeningMatches = checkOpeningRules(board, source);
  const specificMatches = [
    ...checkFigureHouseRules(board, source),
    ...checkJamaaDerivedRules(board, source),
    ...rawOpeningMatches.filter((m) => m.inCriticalHouse),
  ];
  const openingMatches = rawOpeningMatches.filter((m) => !m.inCriticalHouse);
  const genericScore = quickHouseScore(board) + (questionHits.length ? 2 : 0);
  const isqatResult = applyIsqatSevenMethod(board, source);
  const jinnTypeResult = applyJinnTypeMethod(board, source);
  const organDiagnosisResult = applyOrganDiagnosisMethod(board, source);

  const perpetratorResult      = checkPerpetratorRules(board, source);
  const sorcererLocationResult = checkSorcererLocation(board, source);
  const sorcererProfileResult  = checkSorcererProfile(board, source);

  const grade = gradeFromMatches(specificMatches, openingMatches, genericScore);
  const finalHebrew = buildFinalHebrew(grade, specificMatches, openingMatches, isqatResult, jinnTypeResult, organDiagnosisResult);

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
    organDiagnosisResult,
    grade,
    finalHebrew,
    mainReasons,
    shouldShow: grade !== 'mixed',
    isSpiritualQuestion: questionHits.length > 0,
    perpetratorResult,
    sorcererLocationResult,
    sorcererProfileResult,
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
