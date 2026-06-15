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
    'עין',
    'קנאה',
    'ג׳ין',
    'אחיזה',
    'רוחני',
    'פגיעה רוחנית',
    'רוח רעה',
    'שד',
    'דיבוק',
    'קללה',
    'עשב',
    'מזיק',
    'חרם',
    'נגיעה',
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
    'גנב',
    'גנבה',
    'גנוב',
    'גנב לי',
    'נגנב',
    'גניבה',
    'מי גנב',
    'enemy',
    'adawwa',
    'liss',
    'sariq',
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
  theft: ['גנבה', 'גנב', 'גנוב', 'נגנב', 'גניבה', 'מי גנב', 'theft', 'sariq'],
  seaVoyage: ['ים', 'ספינה', 'מסע ים', 'נסיעה בים', 'ים מסוכן', 'sea', 'bahr'],
  prisoner: ['אסיר', 'כלא', 'מאסר', 'שחרור', 'בית סוהר', 'עצור', 'prisoner', 'sajin'],
  partnership: [
    'שותפות',
    'שותף',
    'ערבות',
    'להיכנס לשותפות',
    'שיתוף',
    'כדאי להשקיע',
    'partnership',
    'sharika',
  ],
  siblings: [
    'אח',
    'אחים',
    'אחות',
    'שכן',
    'שכנים',
    'חבר קרוב',
    'siblings',
    'akh',
    'jar',
  ],
  deathInheritance: [
    'ירושה',
    'ירש',
    'יורש',
    'מוות',
    'פטירה',
    'נפטר',
    'עיזבון',
    'תורש',
    'inheritance',
    'mawt',
    'mirath',
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
  theft: ['hawi-question-theft', 'hawi-house-states-colors', 'hawi-dhamir-directions-validation'],
  seaVoyage: ['hawi-question-sea-voyage', 'hawi-house-states-colors', 'hawi-dhamir-directions-validation'],
  prisoner: ['hawi-question-prisoner', 'hawi-house-states-colors', 'hawi-dhamir-directions-validation'],
  partnership: [
    'hawi-question-partnership',
    'hawi-house-states-colors',
    'hawi-dhamir-directions-validation',
  ],
  siblings: [
    'hawi-question-siblings',
    'hawi-house-states-colors',
    'hawi-dhamir-directions-validation',
  ],
  deathInheritance: [
    'hawi-question-death-inheritance',
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

// ── מיפוי 12 בתים → נושאי שאלות (כשף אל-אסראר שער שישי) ───────────────────
// מקור: כשף אל-אסראר, שער שישי — תוכן עניינים עמ׳ 277
export const HOUSE_TOPICS_MAP = {
  1: [
    { topicId: 'generalReading',    label: 'מצב השואל הכללי' },
    { topicId: 'foundations',       label: 'פתיחה / יסודות הגורל' },
    { topicId: 'birthNativity',     label: 'גורל האדם / מולד' },
    { topicId: 'completion',        label: 'האם הדבר יתממש' },
    { topicId: 'spiritualDiagnostics', label: 'כישוף / עין הרע (אם יש מעשה)' },
  ],
  2: [
    { topicId: 'commerce',          label: 'ממון / כסף / עסק' },
    { topicId: 'deathInheritance',  label: 'ירושה / עיזבון' },
    { topicId: 'theft',             label: 'חפץ גנוב — מה נגנב' },
    { topicId: 'hiddenTreasure',    label: 'שווי אוצר / מטמון' },
  ],
  3: [
    { topicId: 'siblings',          label: 'אחים / שכנים / קרובים' },
    { topicId: 'travel',            label: 'נסיעה קצרה / תנועה' },
  ],
  4: [
    { topicId: 'hiddenTreasure',    label: 'מטמון / אוצר גנוז (מיקום)' },
    { topicId: 'missingPerson',     label: 'מיקום הנעדר' },
    { topicId: 'theft',             label: 'מיקום החפץ הגנוב' },
    { topicId: 'childrenPregnancy', label: 'מצב האב / הבית' },
  ],
  5: [
    { topicId: 'childrenPregnancy', label: 'ילדים / הריון / לידה' },
    { topicId: 'prisoner',          label: 'סיכוי שחרור מכלא' },
    { topicId: 'loveHate',          label: 'ילד האהבה / בן/בת הנאהב' },
  ],
  6: [
    { topicId: 'illness',           label: 'חולה / מחלה' },
    { topicId: 'spiritualDiagnostics', label: 'אבחון רוחני / כישוף / עין' },
    { topicId: 'hiddenTreasure',    label: 'חפץ אבוד / בהמה אבודה' },
  ],
  7: [
    { topicId: 'marriage',          label: 'נישואין / זוגיות' },
    { topicId: 'disputes',          label: 'סכסוך / תביעה / מריבה' },
    { topicId: 'enemies',           label: 'אויב / יריב' },
    { topicId: 'missingPerson',     label: 'נעדר (הצד השני)' },
    { topicId: 'commerce',          label: 'קנייה ומכירה / צד שני' },
    { topicId: 'partnership',       label: 'שותפות עסקית' },
    { topicId: 'theft',             label: 'הגנב (מי גנב)' },
  ],
  8: [
    { topicId: 'theft',             label: 'גנבה / חפץ גנוב' },
    { topicId: 'deathInheritance',  label: 'מוות / סכנת מוות' },
    { topicId: 'illness',           label: 'פרוגנוזה: מוות או החלמה' },
    { topicId: 'seaVoyage',         label: 'סכנת ים / טביעה' },
  ],
  9: [
    { topicId: 'travel',            label: 'נסיעה / מסע' },
    { topicId: 'missingPerson',     label: 'נעדר / גאיב' },
    { topicId: 'seaVoyage',         label: 'מסע ים / ספינה' },
    { topicId: 'hiddenTreasure',    label: 'חפץ אבוד — כיוון הנסיעה' },
    { topicId: 'spiritualDiagnostics', label: 'חלום / חזון' },
  ],
  10: [
    { topicId: 'authorityState',    label: 'שלטון / תפקיד / ממשל' },
    { topicId: 'yearlyForecast',    label: 'טאלע השנה / גורל שנתי' },
    { topicId: 'commerce',          label: 'מוניטין עסקי / הצלחה מקצועית' },
  ],
  11: [
    { topicId: 'loveHate',          label: 'אהבה / ידידות / תקוות' },
    { topicId: 'authorityState',    label: 'סיכויים / תקוות בשלטון' },
    { topicId: 'childrenPregnancy', label: 'אם ייתממש הדבר' },
  ],
  12: [
    { topicId: 'enemies',           label: 'אויבים נסתרים' },
    { topicId: 'fear',              label: 'פחד / סכנה נסתרת' },
    { topicId: 'prisoner',          label: 'אסיר / כלוא / עצור' },
    { topicId: 'theft',             label: 'הגנב — מי גנב' },
    { topicId: 'missingPerson',     label: 'מה מונע את חזרת הנעדר' },
    { topicId: 'travel',            label: 'מכשולים / סכנות בנסיעה' },
  ],
};

/**
 * מחזיר רשימת נושאי שאלות לפי בית.
 * @param {number} houseNumber - 1–12
 * @returns {{ topicId, label }[]}
 */
export function getTopicsForHouse(houseNumber) {
  return HOUSE_TOPICS_MAP[Number(houseNumber)] || [];
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
  getTopicsForHouse,
  houseTopicsMap: HOUSE_TOPICS_MAP,
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
    getTopicsForHouse,
    HOUSE_TOPICS_MAP,
  };
}
