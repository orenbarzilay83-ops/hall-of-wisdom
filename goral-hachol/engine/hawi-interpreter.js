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

const TOPIC_MAIN_HOUSES = {
  travel: [1, 3, 5, 8, 9, 12],
  missingPerson: [1, 7, 8, 9, 12],
  childrenPregnancy: [1, 4, 5, 6, 7, 11, 13, 14, 15],
  hiddenTreasure: [1, 2, 4, 6, 7, 8, 10, 12, 15, 16],
  yearlyForecast: [1, 10, 15],
  authorityState: [1, 7, 10, 11, 15],
  birthNativity: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  spiritualDiagnostics: [1, 6, 8, 9, 12],
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
  foundations: 'יסודות גורל החול',
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
  const record = findSourceRecordByFigure(house, HAWI_SOURCE.figureTransits?.list);
  if (!record) return null;

  const meanings = record.houses || record.houseMeanings || record.meanings || record.transits || [];
  const houseMeaning = Array.isArray(meanings)
    ? meanings.find((x) => Number(x.house) === Number(house.house))
    : null;

  return {
    sourceId: record.id || null,
    figure: house.hebrew || house.key || null,
    house: house.house,
    meaning: houseMeaning?.meaning || houseMeaning?.hebrew || houseMeaning?.rule || null,
    topics: houseMeaning?.topics || null,
    sourceStatus: houseMeaning?.sourceStatus || record.status || null,
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

  const houses = selectedHouseNumbers
    .map((n) => getHouse(board, n))
    .filter(Boolean)
    .map((house) => ({
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
    }));

  const focusHouse = houses.find((h) => Number(h.house) === focusHouseNumber) || null;
  const witness13 = houses.find((h) => Number(h.house) === 13) || null;
  const witness14 = houses.find((h) => Number(h.house) === 14) || null;
  const judge15 = houses.find((h) => Number(h.house) === 15) || null;
  const sentence16 = houses.find((h) => Number(h.house) === 16) || null;

  return {
    hasBoard: true,
    focusHouseNumber,
    mainHouses,
    houses,
    focusHouse,
    witnesses: [witness13, witness14].filter(Boolean),
    judge: judge15,
    sentence: sentence16,
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

  let score = 0;
  const reasons = [];

  const items = [
    { label: 'הבית המרכזי', item: boardAnalysis.focusHouse, weight: 3 },
    { label: 'עד ראשון', item: boardAnalysis.witnesses?.[0], weight: 1 },
    { label: 'עד שני', item: boardAnalysis.witnesses?.[1], weight: 1 },
    { label: 'בית 15 / דיין', item: boardAnalysis.judge, weight: 3 },
    { label: 'בית 16 / משלים בית 15', item: boardAnalysis.sentence, weight: 2 },
  ];

  for (const { label, item, weight } of items) {
    if (!item) continue;

    const toneScore = item.tone?.score || 0;
    score += toneScore * weight;

    if (toneScore > 0) {
      reasons.push(`${label}: סימן טוב / סעד`);
    } else if (toneScore < 0) {
      reasons.push(`${label}: סימן קשה / נחס`);
    } else {
      reasons.push(`${label}: סימן ממוזג או לא מוכרע`);
    }

    if (item.figureState?.fortuneState) {
      if (isGoodValue(item.figureState.fortuneState)) score += 1;
      if (isBadValue(item.figureState.fortuneState)) score -= 1;
    }

    if (item.houseState?.fortuneState) {
      if (isGoodValue(item.houseState.fortuneState)) score += 1;
      if (isBadValue(item.houseState.fortuneState)) score -= 1;
    }
  }

  let grade = 'mixed';
  let hebrew = 'הגורל ממוזג: יש צדדים מסייעים וצדדים מעכבים. צריך לקרוא לפי פרטי הבית המרכזי, הדיין והעדים.';

  if (score >= 5) {
    grade = 'positive';
    hebrew = 'מסקנה ראשונית: הכיוון חיובי. יש תמיכה מן הלוח, ובפרט אם הבית המרכזי, הדיין והעדים אינם סותרים.';
  } else if (score <= -5) {
    grade = 'negative';
    hebrew = 'מסקנה ראשונית: הכיוון קשה או חסום. יש סימני עיכוב/נחס, וצריך זהירות לפני פעולה.';
  } else if (score >= 2) {
    grade = 'cautiously-positive';
    hebrew = 'מסקנה ראשונית: יש נטייה טובה, אך לא מוחלטת. יש לבדוק את תנאי המקור ואת העדים לפני פסיקה סופית.';
  } else if (score <= -2) {
    grade = 'cautiously-negative';
    hebrew = 'מסקנה ראשונית: יש נטייה מעכבת או מזהירה, אך לא מוחלטת. צריך לבדוק אם קיימים סעדים שמתקנים את הדין.';
  }

  return {
    score,
    grade,
    hebrew,
    reasons,
  };
}

function buildFinalConclusion(topicHebrew, boardScore, boardAnalysis, relevantRules) {
  if (!boardAnalysis.hasBoard) {
    return 'עדיין אין לוח גורל מלא, לכן ניתן רק לזהות את נושא השאלה ואת שכבות הידע המתאימות.';
  }

  const focus = boardAnalysis.focusHouse;
  const judge = boardAnalysis.judge;
  const sentence = boardAnalysis.sentence;

  const parts = [];

  parts.push(boardScore.hebrew);

  if (focus) {
    parts.push(
      `הבית המרכזי לשאלה (${focus.house}) הוא ${focus.figureHebrew || 'ללא שם צורה'}, והוא נותן את גוף הדין בנושא ${topicHebrew}.`
    );
  }

  if (judge) {
    parts.push(
      `בית 15 / הדיין הוא ${judge.figureHebrew || 'ללא שם צורה'}; הוא משמש כפסיקת הלוח לאחר העדים.`
    );
  }

  if (sentence) {
    parts.push(
      `בית 16 / משלים בית 15 הוא ${sentence.figureHebrew || 'ללא שם צורה'}; הוא מראה את השלמת הדין ואת סיום התהליך.`
    );
  }

  const firstRule = relevantRules.find((r) => r.hebrew || r.result || r.condition);
  if (firstRule) {
    parts.push(
      `כלל מקור מרכזי שנבדק: ${firstRule.hebrew || firstRule.result || firstRule.condition}.`
    );
  }

  return parts.join(' ');
}

export function interpretHawiQuestionInitial(question, board = null) {
  const route = routeHawiQuestion(question);
  const mainHouses = TOPIC_MAIN_HOUSES[route.topicId] || TOPIC_MAIN_HOUSES.foundations;
  const topicHebrew = TOPIC_HEBREW_TITLES[route.topicId] || TOPIC_HEBREW_TITLES.foundations;

  const boardAnalysis = buildBoardAnalysis(board, route.topicId, mainHouses);
  const relevantRules = collectRelevantRules(route.knowledge, route.topicId, mainHouses);
  const boardScore = scoreBoard(boardAnalysis);
  const spiritualDiagnosis = diagnoseSpiritualInfluence(question, board);
  const finalConclusionHebrew = buildFinalConclusion(
    topicHebrew,
    boardScore,
    boardAnalysis,
    relevantRules
  );

  return {
    id: 'goral-hachol-full-interpretation',
    status: 'board-aware-source-based-interpretation',
    question,
    topicId: route.topicId,
    topicHebrew,
    confidence: route.confidence,
    matchedBy: route.matchedBy,
    sourceId: route.sourceId,

    mainHouses,
    knowledgeSources: summarizeKnowledgeItems(route.knowledge),
    relevantRules,

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
    finalConclusionHebrew,
    conclusionDraftHebrew: finalConclusionHebrew,
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
