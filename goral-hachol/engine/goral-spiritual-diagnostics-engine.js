import * as APPROVED_SPIRITUAL_SOURCE from '../data/sources/approved-raml/spiritual-diagnostics/raml-spiritual-diagnostics-sihr-mass-hasad.js';

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

function hasAnyText(value, words) {
  const text = normalizeText(value);
  return words.some((w) => text.includes(normalizeText(w)));
}

function isGoodValue(value = '') {
  return hasAnyText(value, ['סעד', 'טוב', 'benefic', 'saad', 'سعد']);
}

function isBadValue(value = '') {
  return hasAnyText(value, ['נחס', 'רע', 'malefic', 'nahs', 'نحس']);
}

const SPIRITUAL_KEYWORDS = {
  sihr: ['כישוף', 'סחר', 'סحر', 'sihr', 'קשירה', 'טליסמא', 'طلسم', 'طلسمات'],
  ayin: ['עין', 'עין הרע', 'عين'],
  hasad: ['קנאה', 'חסד', 'حسد', 'hasad'],
  jinn: ['ג׳ין', 'גין', 'שדים', 'جن', 'jinn'],
  mass: ['מס', 'אחיזה', 'פגיעה רוחנית', 'مس', 'mass'],
  fearHiddenEnemy: ['פחד', 'אויב נסתר', 'שנאה', 'טינה', 'הסתרה'],
};

const SPIRITUAL_HOUSES = [
  {
    house: 1,
    role: 'גוף השואל / מצב כללי',
    categories: ['general', 'sihr', 'mass'],
    weight: 2,
  },
  {
    house: 6,
    role: 'חולי / אחיזה / קנאה / פגיעה',
    categories: ['illness', 'mass', 'hasad', 'sihr'],
    weight: 4,
  },
  {
    house: 8,
    role: 'פגיעה עמוקה / פחד / סודות / מוות',
    categories: ['deep-harm', 'sihr', 'fearHiddenEnemy'],
    weight: 3,
  },
  {
    house: 9,
    role: 'חלומות / ידיעת נסתרות / רוחניות',
    categories: ['dreams', 'hidden-knowledge', 'jinn'],
    weight: 2,
  },
  {
    house: 12,
    role: 'אויב נסתר / קנאה / שנאה / הסתרה',
    categories: ['hidden-enemy', 'hasad', 'ayin', 'fearHiddenEnemy'],
    weight: 4,
  },
  {
    house: 13,
    role: 'עד ראשון',
    categories: ['witness'],
    weight: 2,
  },
  {
    house: 14,
    role: 'עד שני',
    categories: ['witness'],
    weight: 2,
  },
  {
    house: 15,
    role: 'דיין',
    categories: ['judge'],
    weight: 4,
  },
  {
    house: 16,
    role: 'משלים בית 15',
    categories: ['sentence'],
    weight: 3,
  },
];

function detectSpiritualTopicFromQuestion(question = '') {
  const hits = [];

  for (const [category, words] of Object.entries(SPIRITUAL_KEYWORDS)) {
    if (hasAnyText(question, words)) {
      hits.push(category);
    }
  }

  return hits;
}

function collectSourceRules(source) {
  const rules = [];

  function walk(value, path = []) {
    if (!value) return;

    if (Array.isArray(value)) {
      for (const item of value) walk(item, path);
      return;
    }

    if (typeof value !== 'object') return;

    const textFields = [
      value.hebrew,
      value.rule,
      value.ruleHebrew,
      value.effectHebrew,
      value.appDisplayHebrew,
      value.diagnosisHebrew,
      value.meaning,
      value.note,
      value.arabic,
      value.arabicText,
    ].filter(Boolean);

    const hasUsefulText = textFields.length > 0;

    const text = normalizeText(textFields.join(' '));
    const spiritualHit =
      hasAnyText(text, [
        'כישוף',
        'סחר',
        'סحر',
        'עין',
        'عين',
        'קנאה',
        'حسد',
        'ג׳ין',
        'جن',
        'מס',
        'مس',
        'אחיזה',
        'רוחני',
        'טליסמא',
        'طلسم',
      ]);

    if (hasUsefulText && spiritualHit) {
      rules.push({
        path: path.join('.'),
        id: value.id || null,
        house: value.house || null,
        houses: value.houses || null,
        category: value.category || value.type || null,
        hebrew:
          value.hebrew ||
          value.ruleHebrew ||
          value.effectHebrew ||
          value.appDisplayHebrew ||
          value.diagnosisHebrew ||
          value.meaning ||
          value.note ||
          null,
        arabic: value.arabic || value.arabicText || null,
      });
    }

    for (const [key, child] of Object.entries(value)) {
      if (key === 'default') continue;
      walk(child, [...path, key]);
    }
  }

  walk(source, []);
  return rules;
}

function analyzeSpiritualHouse(board, config) {
  const house = getHouse(board, config.house);

  if (!house) {
    return {
      house: config.house,
      role: config.role,
      found: false,
      score: 0,
      signals: ['הבית לא נמצא בלוח.'],
    };
  }

  const combined = [
    house.hebrew,
    house.figureHebrew,
    house.key,
    house.fortune,
    house.movement,
    house.element,
    house.houseHebrew,
  ].filter(Boolean).join(' ');

  let score = 0;
  const signals = [];

  if (isBadValue(combined)) {
    score += config.weight;
    signals.push('נמצא סימן נחס / קושי בבית זה.');
  }

  if (isGoodValue(combined)) {
    score -= Math.max(1, Math.floor(config.weight / 2));
    signals.push('נמצא סימן סעד / תיקון בבית זה.');
  }

  if (hasAnyText(combined, ['אדום', 'humra', 'חמרה', 'الحمرة'])) {
    score += 2;
    signals.push('אדום מחזק חשד לחום, פגיעה, עימות או מזיק פעיל.');
  }

  if (hasAnyText(combined, ['עקלה', 'סוהר', 'aqla', 'العقلة'])) {
    score += 2;
    signals.push('עקלה/סוהר מחזקת חסימה, קשירה או אחיזה.');
  }

  if (hasAnyText(combined, ['ממון יוצא', 'qabd-kharij', 'قبض خارج'])) {
    score += 1;
    signals.push('ממון יוצא מחזק יציאה, הפסד, התרוקנות או כוח מזיק.');
  }

  if (hasAnyText(combined, ['לבן', 'bayad', 'البياض'])) {
    score -= 1;
    signals.push('לבן עשוי להראות ריכוך, ניקוי או אפשרות תיקון.');
  }

  if (hasAnyText(combined, ['דרך', 'tariq', 'الطريق'])) {
    signals.push('דרך מראה תנועה, מעבר או השפעה נעה ולא קבועה.');
  }

  return {
    house: config.house,
    role: config.role,
    categories: config.categories,
    found: true,
    figureHebrew: house.hebrew || house.figureHebrew || null,
    figureKey: house.key || null,
    fortune: house.fortune || null,
    movement: house.movement || null,
    element: house.element || null,
    score,
    signals,
  };
}

function gradeSpiritualScore(score) {
  if (score >= 13) {
    return {
      grade: 'strong-suspicion',
      hebrew: 'מסקנה רוחנית: קיימים סימנים חזקים לפגיעה רוחנית / כישוף / עין / אחיזה, לפי הבתים המרכזיים והדיין.',
    };
  }

  if (score >= 8) {
    return {
      grade: 'medium-suspicion',
      hebrew: 'מסקנה רוחנית: קיימים סימנים בינוניים לחשד רוחני. לא לפסוק לבד; יש לבדוק את סוג הפגיעה לפי הבית והצורה.',
    };
  }

  if (score >= 4) {
    return {
      grade: 'weak-suspicion',
      hebrew: 'מסקנה רוחנית: קיימים סימנים חלשים או מעורבים. ייתכן קושי רגשי/חברתי/רוחני, אך אין הכרעה חזקה.',
    };
  }

  if (score <= -2) {
    return {
      grade: 'mostly-clear',
      hebrew: 'מסקנה רוחנית: אין סימן חזק לפגיעה רוחנית. קיימים סימני ריכוך או תיקון.',
    };
  }

  return {
    grade: 'mixed',
    hebrew: 'מסקנה רוחנית: הלוח ממוזג. יש לבדוק את בית 6, בית 12, העדים והדיין לפני הכרעה.',
  };
}

export function diagnoseSpiritualInfluence(question = '', board = null) {
  const source = getApprovedSpiritualSource();
  const questionHits = detectSpiritualTopicFromQuestion(question);
  const sourceRules = collectSourceRules(source);

  if (!board || !Array.isArray(board.chart)) {
    return {
      id: 'goral-spiritual-diagnostics',
      active: true,
      hasBoard: false,
      questionHits,
      sourceRules: sourceRules.slice(0, 12),
      finalHebrew:
        'שכבת האבחון הרוחני פעילה, אבל לא התקבל לוח גורל מלא. לכן אין לפסוק כישוף/עין/אחיזה בלי לוח.',
    };
  }

  const houseAnalysis = SPIRITUAL_HOUSES.map((config) => analyzeSpiritualHouse(board, config));
  const rawScore = houseAnalysis.reduce((sum, item) => sum + (item.score || 0), 0);

  const questionBoost = questionHits.length ? 2 : 0;
  const score = rawScore + questionBoost;
  const grade = gradeSpiritualScore(score);

  const mainReasons = houseAnalysis
    .filter((item) => item.signals && item.signals.length)
    .map((item) => ({
      house: item.house,
      role: item.role,
      figureHebrew: item.figureHebrew,
      score: item.score,
      signals: item.signals,
    }));

  return {
    id: 'goral-spiritual-diagnostics',
    active: true,
    hasBoard: true,
    questionHits,
    checkedHouses: SPIRITUAL_HOUSES.map((h) => h.house),
    houseAnalysis,
    sourceRules: sourceRules.slice(0, 12),
    score,
    grade: grade.grade,
    finalHebrew: grade.hebrew,
    mainReasons,
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
