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

function buildFinalHebrew(grade, specificMatches, openingMatches, isqatResult, jinnTypeResult, crossReferenceNote, sihrDetails) {
  const verdictMap = {
    'strong-suspicion': 'מסקנה רוחנית: כן — הלוח מראה סימנים חזקים לפגיעה רוחנית לפי כללי המקור.',
    'medium-suspicion': 'מסקנה רוחנית: ייתכן — יש חשד בינוני לפגיעה רוחנית. נמצאו התאמות מהמקור שדורשות בדיקה.',
    'weak-suspicion': 'מסקנה רוחנית: ספק — יש סימנים חלשים בלבד, אין הכרעה חזקה.',
    'mostly-clear': 'מסקנה רוחנית: לא — אין סימן חזק לפגיעה רוחנית בלוח זה. אם בכל זאת יש בעיה — כנראה שהיא בתחום אחר. ראה מסקנת הלוח המלאה למטה.',
    mixed: 'מסקנה רוחנית: הלוח ממוזג — לא ניתן לקבוע בוודאות. יש לבדוק את בית 6, בית 12, העדים והדיין. ייתכן שיש בעיה שאינה רוחנית — ראה מסקנה מלאה למטה.',
  };

  let base = verdictMap[grade] || verdictMap.mixed;

  if (crossReferenceNote) {
    base += '\n' + crossReferenceNote;
  }

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

  if (sihrDetails?.length) {
    base += '\n\n— פרטי הכישוף —\n' + sihrDetails.join('\n');
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

// Maps isqat remainder → spiritual category and Hebrew label
const ISQAT_REMAINDER_MAP = {
  1: { category: 'jinn',    hebrew: 'אחיזת ג׳ין',         isSpiritual: true  },
  2: { category: 'ayin',   hebrew: 'עין הרע / קנאה',      isSpiritual: true  },
  3: { category: 'sihr',   hebrew: 'כישוף (אדם עשה)',      isSpiritual: true  },
  4: { category: 'illness', hebrew: 'ליחה/בלגם',           isSpiritual: false },
  5: { category: 'illness', hebrew: 'מחלת דם',             isSpiritual: false },
  6: { category: 'illness', hebrew: 'מרה שחורה',           isSpiritual: false },
  7: { category: 'illness', hebrew: 'מרה צהובה',           isSpiritual: false },
};

// Resolves primary question category from questionHits
function resolveQuestionCategory(questionHits) {
  if (!questionHits?.length) return null;
  if (questionHits.includes('sihr') || questionHits.includes('mass')) return 'sihr';
  if (questionHits.includes('ayin') || questionHits.includes('hasad'))  return 'ayin';
  if (questionHits.includes('jinn')) return 'jinn';
  return null;
}

// Computes cross-reference note when isqat result doesn't match what was asked
function computeCrossReference(questionHits, isqatResult) {
  if (!isqatResult?.remainder) return null;
  const questionCategory = resolveQuestionCategory(questionHits);
  if (!questionCategory) return null;

  const isqatInfo = ISQAT_REMAINDER_MAP[isqatResult.remainder];
  if (!isqatInfo) return null;

  const questionHebrew = { sihr: 'כישוף', ayin: 'עין הרע / קנאה', jinn: 'ג׳ין' }[questionCategory];

  if (!isqatInfo.isSpiritual) {
    return `⚠ ספירת מפתוח: הלוח מצביע על ${isqatInfo.hebrew} — לא פגיעה רוחנית. השאלה הייתה על ${questionHebrew} אך ייתכן שהבעיה גופנית.`;
  }

  if (isqatInfo.category !== questionCategory) {
    return `⚠ ספירת מפתוח: הלוח מצביע על ${isqatInfo.hebrew} (לא ${questionHebrew}). ייתכן שהבעיה שונה ממה שנשאל — מומלץ לבדוק שני הכיוונים.`;
  }

  return null; // Categories match — no cross-reference needed
}

// Figure pattern → { element, compassDirection, hebrewName }
// Source: كشف الأسرار المصونة في اخراج الضمائر المخزونة pp. 43-67
const PATTERN_TO_FIGURE_PROPS = {
  '1111': { element: 'מים',   compassDirection: 'צפון',  hebrewName: 'דרך'       },
  '1112': { element: 'אש',    compassDirection: 'מזרח',  hebrewName: 'סף יוצא'   },
  '1121': { element: 'אוויר', compassDirection: 'מערב',  hebrewName: 'נלחם'      },
  '1122': { element: 'אש',    compassDirection: 'מזרח',  hebrewName: 'כבוד יוצא' },
  '1211': { element: 'מים',   compassDirection: 'צפון',  hebrewName: 'בר הלחי'   },
  '1212': { element: 'אש',    compassDirection: 'מזרח',  hebrewName: 'ממון יוצא' },
  '1221': { element: 'עפר',   compassDirection: 'דרום',  hebrewName: 'סוהר'      },
  '1222': { element: 'אש',    compassDirection: 'מזרח',  hebrewName: 'נשוא ראש'  },
  '2111': { element: 'אוויר', compassDirection: 'מערב',  hebrewName: 'סף נכנס'   },
  '2112': { element: 'אוויר', compassDirection: 'מערב',  hebrewName: 'חיבור'     },
  '2121': { element: 'עפר',   compassDirection: 'דרום',  hebrewName: 'ממון נכנס' },
  '2122': { element: 'אוויר', compassDirection: 'מערב',  hebrewName: 'אדום'      },
  '2211': { element: 'מים',   compassDirection: 'צפון',  hebrewName: 'כבוד נכנס' },
  '2212': { element: 'מים',   compassDirection: 'צפון',  hebrewName: 'לבן'       },
  '2221': { element: 'עפר',   compassDirection: 'דרום',  hebrewName: 'שפל ראש'   },
  '2222': { element: 'עפר',   compassDirection: 'דרום',  hebrewName: 'קהלה'      },
};

// Figure pattern → shortFigureId lookup
const PATTERN_TO_FIGURE_ID = {
  '1111': 'tariq',        '1112': 'ataba-kharija',
  '1121': 'judla',        '1122': 'nusra-kharija',
  '1211': 'naqi-khad',    '1212': 'qabd-kharij',
  '1221': 'aqla',         '1222': 'hayyan',
  '2111': 'ataba-dakhila','2112': 'ijtima',
  '2121': 'qabd-dakhil',  '2122': 'humra',
  '2211': 'nusra-dakhila','2212': 'bayad',
  '2221': 'nakis',        '2222': 'jamaa',
};

// Arabic letter hints per figure — extracted from شعر حروف كل شكل (Kashf al-Asrar pp. 138-139).
// Each figure maps to 1-2 Arabic letters whose sounds hint at the name being sought.
// Palindromic figures (same when reversed: tariq/aqla/ijtima/jamaa) get 1 letter; others get 2.
// Figures not found in the available digitized poem are omitted (naqi-khad, nusra-kharija, nusra-dakhila).
const FIGURE_LETTER_HINTS = {
  'tariq':         { display: 'ע (عين)' },                              // 1111 — palindrome
  'ataba-kharija': { display: 'ח (حاء), ח׳ (خاء)' },                   // 1112
  'judla':         { display: 'ט (طاء), ד׳ (ذال)' },                   // 1121 — كوسج in poem
  'qabd-kharij':   { display: 'ל (لام), ג׳ (غين)' },                   // 1212
  'aqla':          { display: 'נ (نون)' },                              // 1221 — palindrome (= ثقاف)
  'hayyan':        { display: 'א (ألف), פ (فاء)' },                     // 1222
  'ataba-dakhila': { display: 'ז (زاي), ת (تاء)' },                     // 2111
  'ijtima':        { display: 'ס (سين)' },                              // 2112 — palindrome
  'qabd-dakhil':   { display: 'כ (كاف), ש (شين)' },                    // 2121
  'humra':         { display: 'ח (حاء), ק (قاف)' },                     // 2122
  'bayad':         { display: 'ד (دال), ר (راء)' },                     // 2212
  'nakis':         { display: 'ב (باء), ס (صاد)' },                     // 2221
  'jamaa':         { display: 'מ (ميم)' },                              // 2222 — palindrome
};

function getFigureLetterHints(house) {
  if (!house) return null;
  const key = house.key || (Array.isArray(house.figure) ? house.figure.join('') : '');
  const figureId = PATTERN_TO_FIGURE_ID[key];
  return figureId ? (FIGURE_LETTER_HINTS[figureId] || null) : null;
}

// Element → type of hiding place (Kashf al-Asrar pp. 185-187, أحكام الخبايا)
const ELEMENT_LOCATION_HINT = {
  'עפר':   'קבור באדמה',
  'מים':   'קרוב למים (בור / נהר / כיור)',
  'אוויר': 'תלוי / קשור באוויר (עץ / גובה)',
  'אש':    'קרוב למקור חום / אש',
};

// House 4 = location house for hidden objects — same method as buried treasure (الخبيئة).
// Element of its figure → type of hiding; compass direction → direction to search.
function getSihrLocationHint(board) {
  const house4 = getHouse(board, 4);
  if (!house4) return null;
  const key = house4.key || (Array.isArray(house4.figure) ? house4.figure.join('') : '');
  const props = PATTERN_TO_FIGURE_PROPS[key];
  if (!props) return null;
  const locType = ELEMENT_LOCATION_HINT[props.element] || props.element;
  return `${locType} — כיוון: ${props.compassDirection} (${props.hebrewName} בבית 4)`;
}

// Maps rule IDs from figureHouseRules to structured sorcery method info
// Source: القول الجامع في علم الرمل, pages 57-58
const SIHR_METHOD_RULE_MAP = {
  'ankis-house6-buried-magic-in-grave':       { method: 'קבור',             location: 'בקבר' },
  'ankis-house6-buried-underground-sorcery':  { method: 'קבור',             location: 'באדמה' },
  'jawdala-house6-drunk-magic':               { method: 'שתייה / בליעה',    location: null   },
  'jawdala-house12-bound-from-wife':          { method: 'קשירה זוגית',       location: null   },
  'qabd-dakhil-house6-bound-from-women':      { method: 'קשירה / עיגון',    location: null   },
  'aqla-house13-bound-magic-sprinkled':       { method: 'קשירה + ריסוס',    location: null   },
  'aqla-house14-house-or-place-has-magic':    { method: 'תלוי',             location: 'בבית או במקום' },
  'jawdala-house14-magic-in-house-or-place':  { method: 'תלוי',             location: 'בבית' },
  'jamaa-from-two-nakis-witness1':            { method: 'קבור (כפול)',       location: null   },
  'jamaa-from-two-nakis-witness2':            { method: 'קבור (כפול)',       location: null   },
};

// Build structured sorcery detail section when sorcery is confirmed or strongly suspected.
// Activated when: isqat remainder=3 (human-made sorcery), OR figure-house rules match,
// OR house 9 contains a known sorcerer figure (aqla/ijtima).
// Source for sorcerer type: القول الجامع p.56 (aqla=female sorcerer, ijtima=bad male sorcerer)
function detectSihrDetails(board, specificMatches, isqatResult) {
  const isSihrIsqat = isqatResult?.remainder === 3;
  const methodMatches = specificMatches.filter(m => SIHR_METHOD_RULE_MAP[m.ruleId]);

  // Check house 9 for known sorcerer figures — activates sihr section even without method match
  const house9 = getHouse(board, 9);
  const house9Fig = house9 ? getFigureHebrewName(house9) : null;
  const house9Norm = normalizeText(house9Fig || '');
  const house9IsSorcerer = house9Norm === normalizeText('סוהר') || house9Norm === normalizeText('חיבור');

  if (!isSihrIsqat && !methodMatches.length && !house9IsSorcerer) return null;

  const lines = [];

  // Sorcerer identification from house 9 (source: القول الجامع p.56)
  if (house9) {
    let desc = null;
    if (house9Norm === normalizeText('סוהר'))   desc = 'אישה מכשפת (סוהר בבית 9)';
    else if (house9Norm === normalizeText('חיבור')) desc = 'גבר מכשף רע (חיבור בבית 9)';
    else if (house9Fig)                           desc = `${house9Fig} בבית 9 (בית המכשפים)`;
    if (desc) lines.push(`מי עשה: ${desc}`);

    // Name letter hints from تسكين الحروف table (Kashf al-Asrar pp. 138-139)
    const nameHints = getFigureLetterHints(house9);
    if (nameHints) {
      lines.push(`רמז לשם המכשף: ${nameHints.display}`);
    }
  }

  // Method details — deduplicate by house (take first match per house)
  const seenHouses = new Set();
  for (const m of methodMatches) {
    if (seenHouses.has(m.house)) continue;
    seenHouses.add(m.house);
    const info = SIHR_METHOD_RULE_MAP[m.ruleId];
    const parts = [info.method, info.location].filter(Boolean).join(' — ');
    lines.push(`שיטה: ${parts} (${m.figureHebrew} בבית ${m.house})`);
    if (seenHouses.size >= 2) break; // at most 2 method lines
  }

  // Location hint — same technique as finding buried treasure (Kashf al-Asrar pp. 185-187)
  const locationHint = getSihrLocationHint(board);
  if (locationHint) {
    lines.push(`מיקום הכישוף: ${locationHint}`);
  }

  return lines.length ? lines : null;
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
  if (element.includes('אוויר') || element.includes('רוח') || element.includes('air')) return 'air';
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

  const grade = gradeFromMatches(specificMatches, openingMatches, genericScore);
  const crossReferenceNote = computeCrossReference(questionHits, isqatResult);
  const sihrDetails = detectSihrDetails(board, specificMatches, isqatResult);
  const finalHebrew = buildFinalHebrew(grade, specificMatches, openingMatches, isqatResult, jinnTypeResult, crossReferenceNote, sihrDetails);

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
    crossReferenceNote,
    sihrDetails,
    grade,
    finalHebrew,
    mainReasons,
    shouldShow: grade !== 'mixed',
    isSpiritualQuestion: questionHits.length > 0,
    questionCategory: resolveQuestionCategory(questionHits),
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
