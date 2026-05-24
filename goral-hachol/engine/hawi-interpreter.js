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

  const judgeTone = getFigureFortuneTone(judge);
  const w1Tone = w1 ? getFigureFortuneTone(w1) : 0;
  const w2Tone = w2 ? getFigureFortuneTone(w2) : 0;
  const focusTone = focus ? getFigureFortuneTone(focus) : 0;
  const witnessTone = (w1Tone + w2Tone) / 2;

  const judgeFigure = judge.figureHebrew || '';
  const judgeFortune = judge.fortune || '';
  const w1Figure = w1?.figureHebrew || '';
  const w2Figure = w2?.figureHebrew || '';
  const focusFigure = focus?.figureHebrew || '';
  const focusHouseNum = focus?.house || '';

  let verdict, grade, hebrewShort, hebrewFull;

  if (judgeTone > 0) {
    if (witnessTone >= 0) {
      verdict = 'yes-strong';
      grade = 'positive';
      hebrewShort = 'כן';
      hebrewFull = 'תשובה: כן — הדיין (בית 15) הוא "' + judgeFigure + '" שהוא צורה של סעד, והעדים מחזקים.' +
        (w1Figure ? ' עד ראשון: ' + w1Figure + '.' : '') +
        (w2Figure ? ' עד שני: ' + w2Figure + '.' : '') +
        (focusFigure ? ' הבית המרכזי (בית ' + focusHouseNum + '): ' + focusFigure + '.' : '');
    } else {
      verdict = 'yes-weak';
      grade = 'cautiously-positive';
      hebrewShort = 'ייתכן שכן';
      hebrewFull = 'תשובה: ייתכן שכן — הדיין (בית 15) הוא "' + judgeFigure + '" שהוא סעד, אך העדים מראים ספק.' +
        (w1Figure ? ' עד ראשון: ' + w1Figure + '.' : '') +
        (w2Figure ? ' עד שני: ' + w2Figure + '.' : '');
    }
  } else if (judgeTone < 0) {
    if (witnessTone <= 0) {
      verdict = 'no-strong';
      grade = 'negative';
      hebrewShort = 'לא';
      hebrewFull = 'תשובה: לא — הדיין (בית 15) הוא "' + judgeFigure + '" שהוא צורה של נחס, והעדים מחזקים את הדין.' +
        (w1Figure ? ' עד ראשון: ' + w1Figure + '.' : '') +
        (w2Figure ? ' עד שני: ' + w2Figure + '.' : '') +
        (focusFigure ? ' הבית המרכזי (בית ' + focusHouseNum + '): ' + focusFigure + '.' : '');
    } else {
      verdict = 'no-weak';
      grade = 'cautiously-negative';
      hebrewShort = 'ייתכן שלא';
      hebrewFull = 'תשובה: ייתכן שלא — הדיין (בית 15) הוא "' + judgeFigure + '" שהוא נחס, אך העדים מציגים צד חיובי.' +
        (w1Figure ? ' עד ראשון: ' + w1Figure + '.' : '') +
        (w2Figure ? ' עד שני: ' + w2Figure + '.' : '');
    }
  } else {
    if (witnessTone > 0 || focusTone > 0) {
      verdict = 'maybe-positive';
      grade = 'cautiously-positive';
      hebrewShort = 'ייתכן';
      hebrewFull = 'תשובה: ייתכן — הדיין (בית 15) הוא "' + judgeFigure + '" שהוא ממוזג, ויש נטייה לטובה לפי העדים.' +
        (w1Figure ? ' עד ראשון: ' + w1Figure + '.' : '') +
        (w2Figure ? ' עד שני: ' + w2Figure + '.' : '');
    } else if (witnessTone < 0 || focusTone < 0) {
      verdict = 'maybe-negative';
      grade = 'cautiously-negative';
      hebrewShort = 'ייתכן שלא';
      hebrewFull = 'תשובה: ייתכן שלא — הדיין (בית 15) הוא "' + judgeFigure + '" שהוא ממוזג, ויש נטייה לקשיים לפי העדים.' +
        (w1Figure ? ' עד ראשון: ' + w1Figure + '.' : '') +
        (w2Figure ? ' עד שני: ' + w2Figure + '.' : '');
    } else {
      verdict = 'mixed';
      grade = 'mixed';
      hebrewShort = 'ממוזג';
      hebrewFull = 'תשובה: ממוזג — הדיין (בית 15) הוא "' + judgeFigure + '" שהוא ממוזג ואינו מכריע, יש לבדוק את פרטי הבית המרכזי.' +
        (w1Figure ? ' עד ראשון: ' + w1Figure + '.' : '') +
        (w2Figure ? ' עד שני: ' + w2Figure + '.' : '');
    }
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

  const judgeVerdict = buildJudgeVerdict(boardAnalysis);
  const judge = boardAnalysis.judge;
  const w1 = boardAnalysis.witnesses?.[0];
  const w2 = boardAnalysis.witnesses?.[1];
  const focus = boardAnalysis.focusHouse;

  const judgeTone = getFigureFortuneTone(judge);
  const w1Tone = w1 ? getFigureFortuneTone(w1) : 0;
  const w2Tone = w2 ? getFigureFortuneTone(w2) : 0;
  const focusTone = focus ? getFigureFortuneTone(focus) : 0;

  // Judge (house 15) is primary — weight 4
  // Each witness — weight 1
  // Focus house — weight 2
  const score = Math.round(
    (judgeTone * 4 + w1Tone * 1 + w2Tone * 1 + focusTone * 2) * 2
  );

  const reasons = [];
  if (judge) reasons.push('בית 15 (דיין): ' + (judge.figureHebrew || '') + ' — ' + (judge.fortune || ''));
  if (w1) reasons.push('עד ראשון: ' + (w1.figureHebrew || '') + ' — ' + (w1.fortune || ''));
  if (w2) reasons.push('עד שני: ' + (w2.figureHebrew || '') + ' — ' + (w2.fortune || ''));
  if (focus) reasons.push('הבית המרכזי (בית ' + (focus.house || '') + '): ' + (focus.figureHebrew || '') + ' — ' + (focus.fortune || ''));

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

  // Lead with judge verdict (short form to avoid duplication with describeCoreHouses)
  const judgeHebrew = judge?.figureHebrew || 'לא מזוהה';
  const judgeFortune = judge?.fortune ? ` (${judge.fortune})` : '';
  parts.push(`הדיין בבית 15: ${judgeHebrew}${judgeFortune} — ${judgeVerdict?.hebrewShort || boardScore.hebrewShort || 'תשובה לא מוכרעת'}.`);

  if (sentence) {
    parts.push(
      `בית 16 (אחרית הדבר): ${sentence.figureHebrew || 'לא מזוהה'} — מראה את השלמת הדין.`
    );
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
