import {
  routeHawiQuestion,
} from '../data/sources/hawi/hawi-knowledge-router.js';

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

function collectRelevantRules(knowledgeItems, topicId, maxRules = 12) {
  const rules = [];

  for (const item of knowledgeItems) {
    for (const [arrayName, arr] of findArraysWithRules(item)) {
      for (const entry of arr) {
        if (!entry || typeof entry !== 'object') continue;

        rules.push({
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
        });

        if (rules.length >= maxRules) return rules;
      }
    }
  }

  return rules;
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

export function interpretHawiQuestionInitial(question, board = null) {
  const route = routeHawiQuestion(question);
  const mainHouses = TOPIC_MAIN_HOUSES[route.topicId] || TOPIC_MAIN_HOUSES.foundations;
  const topicHebrew = TOPIC_HEBREW_TITLES[route.topicId] || TOPIC_HEBREW_TITLES.foundations;

  const relevantRules = collectRelevantRules(route.knowledge, route.topicId);

  return {
    id: 'hawi-initial-interpretation',
    status: 'initial-source-based-interpretation',
    question,
    topicId: route.topicId,
    topicHebrew,
    confidence: route.confidence,
    matchedBy: route.matchedBy,
    sourceId: route.sourceId,

    mainHouses,
    knowledgeSources: summarizeKnowledgeItems(route.knowledge),
    relevantRules,

    boardContext: board
      ? {
          received: true,
          noteHebrew:
            'התקבל לוח גורל. בשלב הבא יש לחבר את הצורות בפועל לבתים, לעדים, לדיין ולמשלים בית 15.',
        }
      : {
          received: false,
          noteHebrew:
            'לא התקבל לוח גורל. הפירוש כרגע מבוסס על זיהוי נושא השאלה ועל שכבות הידע הרלוונטיות בלבד.',
        },

    conclusionDraftHebrew:
      'זהו פירוש ראשוני לפי נושא השאלה ומקורות חאוי המחוברים. כדי להגיע לפסק מלא צריך לחבר את לוח הגורל בפועל: צורה בבית המרכזי, בית 15 / דיין, העדים, ותנועת הצורות.',
  };
}

export function formatHawiInitialInterpretationHebrew(result) {
  const lines = [];

  lines.push(`נושא השאלה: ${result.topicHebrew}`);
  lines.push(`זיהוי פנימי: ${result.topicId}`);
  lines.push(`בתים עיקריים לבדיקה: ${result.mainHouses.join(', ')}`);
  lines.push('');
  lines.push('מקורות ידע שנשלפו:');
  for (const source of result.knowledgeSources) {
    lines.push(`- ${source.id} — ${source.titleHebrew}`);
  }

  lines.push('');
  lines.push('חוקים ראשונים שנמצאו במקור:');
  for (const rule of result.relevantRules.slice(0, 6)) {
    const houseText = rule.houses ? ` בתים: ${rule.houses.join(', ')}` : rule.house ? ` בית: ${rule.house}` : '';
    const pageText = rule.sourcePage ? ` עמוד מקור: ${rule.sourcePage}` : '';
    lines.push(`- ${rule.hebrew || rule.result || rule.condition || rule.id || 'כלל מקור'}${houseText}${pageText}`);
  }

  lines.push('');
  lines.push(result.boardContext.noteHebrew);
  lines.push(result.conclusionDraftHebrew);

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
