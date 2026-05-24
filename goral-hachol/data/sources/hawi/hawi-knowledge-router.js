import {
  HAWI_SOURCE,
  HAWI_EXTENDED_KNOWLEDGE_LIST,
  HAWI_EXTENDED_KNOWLEDGE_BY_ID,
} from './hawi-source.js';

const TOPIC_ALIASES = {
  travel: [
    'נסיעה',
    'דרך',
    'מסע',
    'יציאה',
    'חזרה',
    'נוסע',
    'travel',
    'safar',
  ],
  missingPerson: [
    'נעדר',
    'גאיב',
    'חוזר',
    'אדם חסר',
    'איפה הוא',
    'חי או מת',
    'missing',
    'ghaib',
  ],
  childrenPregnancy: [
    'ילד',
    'ילדים',
    'הריון',
    'היריון',
    'עובר',
    'זכר',
    'נקבה',
    'לידה',
    'pregnancy',
    'child',
  ],
  hiddenTreasure: [
    'מטמון',
    'חבוי',
    'דפין',
    'אוצר',
    'קבור',
    'טליסמא',
    'treasure',
    'دفين',
  ],
  yearlyForecast: [
    'שנה',
    'טאלע השנה',
    'יוקר',
    'זול',
    'מחירים',
    'גשם',
    'מזג אוויר',
    'מלחמות',
    'מחלות כלליות',
    'yearly',
    'rain',
    'weather',
  ],
  authorityState: [
    'שלטון',
    'מלך',
    'מדינה',
    'ממשלה',
    'דיין',
    'שופט',
    'משרה',
    'תפקיד',
    'authority',
    'state',
    'king',
  ],
  birthNativity: [
    'מולד',
    'נולד',
    'אדם',
    'טאלע אישי',
    'חיי אדם',
    'nativity',
    'mawlud',
  ],
  spiritualDiagnostics: [
    'כישוף',
    'עין הרע',
    'עין רע',
    'קנאה',
    'ג׳ין',
    'אחיזה',
    'רוחני',
    'פגיעה רוחנית',
    'sihr',
    'hasad',
  ],
  marriage: [
    'נישואין',
    'זוגיות',
    'חתונה',
    'בעל',
    'אישה',
    'התאמה',
    'גירושין',
    'כלה',
    'חתן',
    'זיווג',
    'marriage',
    'zawaj',
  ],
  illness: [
    'חולה',
    'חולי',
    'מחלה',
    'מרגיש',
    'רפואה',
    'חלמה',
    'יחלים',
    'ימות',
    'חיים ומוות',
    'illness',
    'marad',
  ],
  disputes: [
    'ריב',
    'סכסוך',
    'תביעה',
    'בית משפט',
    'פשרה',
    'ניצחון',
    'הפסד',
    'dispute',
    'khusuma',
  ],
  enemies: [
    'אויב',
    'אויבים',
    'שונא',
    'מתנגד',
    'enemy',
    'adawwa',
  ],
  fear: [
    'פחד',
    'מורא',
    'סכנה',
    'איום',
    'fear',
    'khawf',
  ],
  commerce: [
    'מסחר',
    'קנייה',
    'מכירה',
    'עסקה',
    'עסק',
    'סחורה',
    'רווח',
    'הפסד כסף',
    'commerce',
    'bay',
  ],
  loveHate: [
    'אהבה',
    'שנאה',
    'חיבה',
    'מישהו אוהב',
    'מישהו שונא',
    'love',
    'mahaba',
    'baghda',
  ],
  completion: [
    'יצליח',
    'יושלם',
    'יסתיים',
    'ישתלם',
    'האם הדבר',
    'האם ייגמר',
    'completion',
    'tamam',
  ],
  foundations: [
    'יסוד',
    'הכאה',
    'דמיר',
    'תסקין',
    'בית',
    'בתים',
    'כוכבים',
    'מזלות',
    'צבעים',
    'foundations',
  ],
};

const TOPIC_TO_KNOWLEDGE_IDS = {
  travel: [
    'hawi-question-travel-extra',
    'hawi-dhamir-directions-validation',
    'hawi-house-states-colors',
    'hawi-planetary-correspondences',
  ],
  missingPerson: [
    'hawi-question-missing-person-extra',
    'hawi-dhamir-directions-validation',
    'hawi-house-states-colors',
  ],
  childrenPregnancy: [
    'hawi-question-children-pregnancy-extra',
    'hawi-house-states-colors',
    'hawi-dhamir-directions-validation',
  ],
  hiddenTreasure: [
    'hawi-question-hidden-treasure-extra',
    'hawi-dhamir-directions-validation',
    'hawi-planetary-correspondences',
    'hawi-house-states-colors',
  ],
  yearlyForecast: [
    'hawi-yearly-prices-forecast',
    'hawi-rain-weather-forecast',
    'hawi-triangles-zodiac',
    'hawi-planetary-correspondences',
    'hawi-house-states-colors',
  ],
  authorityState: [
    'hawi-authority-state-rulers',
    'hawi-dhamir-directions-validation',
    'hawi-planetary-correspondences',
    'hawi-house-states-colors',
  ],
  birthNativity: [
    'hawi-birth-nativity',
    'hawi-dhamir-directions-validation',
    'hawi-house-states-colors',
    'hawi-planetary-correspondences',
  ],
  spiritualDiagnostics: [
    'hawi-house-states-colors',
    'hawi-planetary-correspondences',
    'hawi-question-hidden-treasure-extra',
  ],
  marriage: [
    'hawi-question-marriage',
    'hawi-house-states-colors',
    'hawi-dhamir-directions-validation',
  ],
  illness: [
    'hawi-question-illness',
    'hawi-house-states-colors',
    'hawi-dhamir-directions-validation',
  ],
  disputes: [
    'hawi-question-disputes',
    'hawi-house-states-colors',
    'hawi-dhamir-directions-validation',
  ],
  enemies: [
    'hawi-question-enemies',
    'hawi-house-states-colors',
    'hawi-dhamir-directions-validation',
  ],
  fear: [
    'hawi-question-fear',
    'hawi-house-states-colors',
    'hawi-dhamir-directions-validation',
  ],
  commerce: [
    'hawi-question-commerce',
    'hawi-house-states-colors',
    'hawi-dhamir-directions-validation',
  ],
  loveHate: [
    'hawi-question-love-hate',
    'hawi-house-states-colors',
    'hawi-dhamir-directions-validation',
  ],
  completion: [
    'hawi-question-completion',
    'hawi-house-states-colors',
    'hawi-dhamir-directions-validation',
  ],
  foundations: [
    'hawi-introduction-mahw-thabat',
    'hawi-dhamir-directions-validation',
    'hawi-house-states-colors',
    'hawi-triangles-zodiac',
    'hawi-planetary-correspondences',
  ],
};

function normalizeText(value = '') {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[״"]/g, '')
    .replace(/[׳']/g, '');
}

export function detectHawiTopicFromQuestion(question = '') {
  const q = normalizeText(question);

  if (!q) {
    return {
      topicId: 'foundations',
      confidence: 0,
      matchedBy: [],
    };
  }

  const matches = [];

  for (const [topicId, aliases] of Object.entries(TOPIC_ALIASES)) {
    const hit = aliases.find((alias) => q.includes(normalizeText(alias)));
    if (hit) {
      matches.push({
        topicId,
        alias: hit,
      });
    }
  }

  if (!matches.length) {
    return {
      topicId: 'foundations',
      confidence: 0.25,
      matchedBy: [],
    };
  }

  return {
    topicId: matches[0].topicId,
    confidence: matches.length > 1 ? 0.75 : 0.6,
    matchedBy: matches,
  };
}

export function getHawiKnowledgeForTopic(topicId) {
  const ids = TOPIC_TO_KNOWLEDGE_IDS[topicId] || TOPIC_TO_KNOWLEDGE_IDS.foundations;

  return ids
    .map((id) => HAWI_EXTENDED_KNOWLEDGE_BY_ID[id])
    .filter(Boolean);
}

export function routeHawiQuestion(question = '') {
  const detected = detectHawiTopicFromQuestion(question);
  const knowledge = getHawiKnowledgeForTopic(detected.topicId);

  return {
    question,
    topicId: detected.topicId,
    confidence: detected.confidence,
    matchedBy: detected.matchedBy,
    knowledgeIds: knowledge.map((item) => item.id),
    knowledge,
    sourceId: HAWI_SOURCE.id,
  };
}

export function getAllHawiKnowledgeTopics() {
  return Object.keys(TOPIC_TO_KNOWLEDGE_IDS);
}

export function getAllHawiExtendedKnowledge() {
  return HAWI_EXTENDED_KNOWLEDGE_LIST;
}

export const HAWI_KNOWLEDGE_ROUTER = {
  id: 'hawi-knowledge-router',
  status: 'active-router-initial',
  topicAliases: TOPIC_ALIASES,
  topicToKnowledgeIds: TOPIC_TO_KNOWLEDGE_IDS,
  detectTopic: detectHawiTopicFromQuestion,
  getKnowledgeForTopic: getHawiKnowledgeForTopic,
  routeQuestion: routeHawiQuestion,
};

export default { HAWI_KNOWLEDGE_ROUTER };

if (typeof module !== 'undefined') {
  module.exports = {
    HAWI_KNOWLEDGE_ROUTER,
    detectHawiTopicFromQuestion,
    getHawiKnowledgeForTopic,
    routeHawiQuestion,
    getAllHawiKnowledgeTopics,
    getAllHawiExtendedKnowledge,
  };
}
