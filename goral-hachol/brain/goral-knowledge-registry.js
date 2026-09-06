/**
 * goral-knowledge-registry.js
 *
 * Registry of what the app actually knows and actually runs, for both
 * Kashf and Hawi. Every entry traces to real, already-existing code/data —
 * nothing here is an invented rule or meaning. Where the underlying source
 * status is unclear or missing, that is recorded explicitly (confidence,
 * notes) rather than filled in.
 *
 * Two kinds of entries:
 *  - topic entries (ruleType: 'primaryDecision') — one per real topicId in
 *    KASHF_TOPIC_RULES (kashf-topic-rules.js) / TOPIC_MAIN_HOUSES (hawi-interpreter.js)
 *  - cross-cutting entries — mechanisms that run independent of topicId
 *    (dhamir, timing, witnesses/judge, formula-only-house labeling, etc.)
 *
 * `applicableQuestionTypes` is derived by reverse lookup against
 * goral-question-taxonomy.js (single source of truth for that mapping).
 * `blockedQuestionTypes` is intentionally left as [] on every entry —
 * duplicating an inverse of applicableQuestionTypes here would create a
 * second, driftable copy of the same fact. Use
 * getAllQuestionTypeIds().filter(qt => !applicableQuestionTypes.includes(qt))
 * against the taxonomy if a blocked-list is needed at call time.
 */

import { QUESTION_TYPES } from './goral-question-taxonomy.js';

const KASHF_SOURCE_ID = 'kashf-al-asrar-book';
const KASHF_SOURCE_TITLE = 'كشف الأسرار (Kashf al-Asrar) — kashf-al-asrar-book.js';
const HAWI_SOURCE_ID = 'hawi-al-ajaib-book';
const HAWI_SOURCE_TITLE = 'كتاب حاوي العجائب ومظهر الغرائب (Hawi) — question-rules + figure-transits + figure-states';

function applicableQuestionTypesFor(method, topicId) {
  return Object.values(QUESTION_TYPES)
    .filter((qt) => (qt.expectedTopicIds[method] || []).includes(topicId))
    .map((qt) => qt.id);
}

// topicId -> KASHF_TOPIC_PAGE_MAP entry (kashf-book-sections.js), or null when no page-map entry exists.
// Read directly from that file; not invented. Topics present in KASHF_TOPIC_RULES but absent here
// are a real, confirmed gap (see KASHF_RULES_WITHOUT_PAGE_MAP below).
const KASHF_PAGE_INFO = {
  completion: { pageNumber: 173, sourceStatus: 'confirmed' },
  spiritualDiagnostics: { pageNumber: null, sourceStatus: 'none' },
  money: null,
  siblings: { pageNumber: 182, sourceStatus: 'confirmed' },
  relocation: null,
  hiddenTreasure: { pageNumber: 185, sourceStatus: 'confirmed' },
  parentsProperty: null,
  children: null,
  illness: { pageNumber: 196, sourceStatus: 'confirmed' },
  lostAnimal: { pageNumber: 201, sourceStatus: 'partial' },
  marriage: { pageNumber: 204, sourceStatus: 'confirmed' },
  disputes: { pageNumber: 212, sourceStatus: 'confirmed' },
  enemies: { pageNumber: 271, sourceStatus: 'confirmed' },
  theft: { pageNumber: 224, sourceStatus: 'confirmed' },
  loan: { pageNumber: 234, sourceStatus: 'confirmed' },
  deathInheritance: { pageNumber: 235, sourceStatus: 'confirmed' },
  travel: { pageNumber: 237, sourceStatus: 'confirmed' },
  missingPerson: { pageNumber: 248, sourceStatus: 'confirmed' },
  dream: null,
  authorityState: { pageNumber: 256, sourceStatus: 'confirmed' },
  motherRules: { pageNumber: 184, sourceStatus: 'partial' },
  commerce: { pageNumber: 218, sourceStatus: 'confirmed' },
  yearlyForecast: { pageNumber: 221, sourceStatus: 'confirmed' },
  partnership: { pageNumber: 212, sourceStatus: 'partial' },
  prisoner: { pageNumber: 272, sourceStatus: 'confirmed' },
  fear: { pageNumber: 235, sourceStatus: 'partial' },
  religion: { pageNumber: 253, sourceStatus: 'partial' },
  friendsHope: null,
  generalReading: { pageNumber: 167, sourceStatus: 'confirmed' },
  // Real KASHF_TOPIC_PAGE_MAP entries with NO matching KASHF_TOPIC_RULES entry —
  // the book has a mapped page, but no rule executes for these in Kashf yet.
  foundations: { pageNumber: 43, sourceStatus: 'confirmed' },
  loveHate: { pageNumber: 205, sourceStatus: 'confirmed' },
  childrenPregnancy: { pageNumber: 191, sourceStatus: 'confirmed' },
  seaVoyage: { pageNumber: 239, sourceStatus: 'confirmed' },
  birthNativity: { pageNumber: null, sourceStatus: 'none' },
};

// Real, existing Kashf topicId -> Hebrew name, from KASHF_TOPIC_RULES (kashf-topic-rules.js).
const KASHF_TOPICS = {
  completion: 'השלמת העניין',
  spiritualDiagnostics: 'כישוף ופעולה נסתרת',
  money: 'ממון וכסף',
  siblings: 'אחים ויחסי משפחה',
  relocation: 'מעבר ממקום למקום',
  hiddenTreasure: 'מטמון ודבר נסתר',
  parentsProperty: 'הורים, נכסים וקרקע',
  children: 'ילדים והריון',
  illness: 'חולה ומחלה',
  lostAnimal: 'בהמה או חיה אבודה',
  marriage: 'נישואין וזיווג',
  disputes: 'מריבות ומשפט',
  enemies: 'אויבים',
  theft: 'גניבה ואבדה',
  loan: 'הלוואה וחוב',
  deathInheritance: 'מוות וירושה',
  travel: 'נסיעה ומסע',
  missingPerson: 'נעדר ובורח',
  dream: 'משמעות החלום',
  authorityState: 'כבוד ושררה',
  motherRules: 'מצב האם',
  commerce: 'מסחר ועסקים — מכירה וקנייה',
  yearlyForecast: 'תחזית שנתית — יוקר וזול',
  partnership: 'שותפות',
  prisoner: 'אסיר וכלוא',
  fear: 'פחד וסכנה',
  religion: 'דת וצדיקות',
  friendsHope: 'חברים ותקווה',
  generalReading: 'קריאה כללית',
};

// Real, existing Hawi topicId -> Hebrew title, from TOPIC_HEBREW_TITLES (hawi-interpreter.js).
const HAWI_TOPICS = {
  travel: 'נסיעה',
  missingPerson: 'נעדר / גאיב',
  childrenPregnancy: 'ילדים והריון',
  hiddenTreasure: 'מטמון / חבוי',
  yearlyForecast: 'עולה השנה / גשם / יוקר וזול',
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
  generalReading: 'פתיחה כללית — מצב האדם',
  prisoner: 'אסיר / כלא / מעצר',
  partnership: 'שותפות / ערבות / קשר עסקי',
  seaVoyage: 'מסע ים / ספינה',
  theft: 'גנבה / חפץ גנוב',
  siblings: 'אחים / שכנים / קרובים',
  deathInheritance: 'מוות / ירושה / פחד גדול',
  loan: 'הלוואה / חוב',
  religion: 'דת / אמונה',
  motherRules: 'דיני האם',
  lostAnimal: 'בהמה / חיה אבודה',
};

// Hawi question-rule source file per topicId (goral-hachol/data/sources/hawi/question-rules/).
// null = no dedicated question-rule file; engine falls back to generic board analysis only.
const HAWI_QUESTION_RULE_FILE = {
  travel: 'hawi-question-travel-extra.js',
  missingPerson: 'hawi-question-missing-person-extra.js',
  childrenPregnancy: 'hawi-question-children-pregnancy-extra.js',
  hiddenTreasure: 'hawi-question-hidden-treasure-extra.js',
  yearlyForecast: 'hawi-question-yearly-forecast.js',
  authorityState: 'hawi-question-authority-state.js',
  birthNativity: 'hawi-question-birth-nativity.js',
  spiritualDiagnostics: 'hawi-question-spiritual-diagnostics.js',
  marriage: 'hawi-question-marriage.js',
  illness: 'hawi-question-illness.js',
  disputes: 'hawi-question-disputes.js',
  enemies: 'hawi-question-enemies.js',
  fear: 'hawi-question-fear.js',
  commerce: 'hawi-question-commerce.js',
  loveHate: 'hawi-question-love-hate.js',
  completion: 'hawi-question-completion.js',
  foundations: null,
  generalReading: null,
  prisoner: 'hawi-question-prisoner.js',
  partnership: 'hawi-question-partnership.js',
  seaVoyage: 'hawi-question-sea-voyage.js',
  theft: 'hawi-question-theft.js',
  siblings: 'hawi-question-siblings.js',
  deathInheritance: 'hawi-question-death-inheritance.js',
  loan: 'hawi-question-loan.js',
  religion: 'hawi-question-religion.js',
  motherRules: 'hawi-question-mother-rules.js',
  lostAnimal: 'hawi-question-lost-animal.js',
};

function kashfTopicEntry(topicId) {
  const pageInfo = KASHF_PAGE_INFO[topicId];
  const confidence = !pageInfo ? 'low' : pageInfo.sourceStatus === 'confirmed' ? 'high' : 'medium';
  return {
    method: 'kashf',
    sourceId: KASHF_SOURCE_ID,
    sourceTitle: KASHF_SOURCE_TITLE,
    approvedSource: true,
    topicId,
    ruleId: `kashf-topic-${topicId}`,
    ruleName: `Kashf primary formula/verdict — ${KASHF_TOPICS[topicId]}`,
    rulePurpose: `הכרעה ראשית (primaryFormula/altFormula/supportingChecks) עבור נושא "${KASHF_TOPICS[topicId]}"`,
    ruleType: 'primaryDecision',
    requiredInputs: ['board (16 houses from mothers)'],
    applicableQuestionTypes: applicableQuestionTypesFor('kashf', topicId),
    blockedQuestionTypes: [],
    clientVisibility: 'client',
    evidenceLocation: {
      file: 'goral-hachol/engine/kashf-topic-rules.js',
      exportOrFunction: `KASHF_TOPIC_RULES.${topicId}`,
      sourceSnippetIdentifier: pageInfo?.pageNumber ? `kashf-al-asrar page ${pageInfo.pageNumber}` : null,
    },
    confidence,
    notes: !pageInfo
      ? `אין רשומה תואמת ב-KASHF_TOPIC_PAGE_MAP (kashf-book-sections.js) לנושא הזה — הכלל רץ בפועל דרך kashf-topic-rules.js, אך אין קישור-עמוד מאומת. פער ידע.`
      : pageInfo.sourceStatus === 'partial'
        ? `KASHF_TOPIC_PAGE_MAP מסמן sourceStatus:"partial" לעמוד הזה — הפרק מכסה את הנושא בין נושאים נוספים, לא פרק ייעודי.`
        : '',
  };
}

function hawiTopicEntry(topicId) {
  const ruleFile = HAWI_QUESTION_RULE_FILE[topicId];
  return {
    method: 'hawi',
    sourceId: HAWI_SOURCE_ID,
    sourceTitle: HAWI_SOURCE_TITLE,
    approvedSource: true,
    topicId,
    ruleId: `hawi-topic-${topicId}`,
    ruleName: `Hawi question-rule + board analysis — ${HAWI_TOPICS[topicId]}`,
    rulePurpose: `ניתוח לוח (buildBoardAnalysis/scoreBoard/buildFinalConclusion) עבור נושא "${HAWI_TOPICS[topicId]}"`,
    ruleType: 'primaryDecision',
    requiredInputs: ['board (16 houses from mothers)', 'question text'],
    applicableQuestionTypes: applicableQuestionTypesFor('hawi', topicId),
    blockedQuestionTypes: [],
    clientVisibility: 'client',
    evidenceLocation: {
      file: 'goral-hachol/engine/hawi-interpreter.js',
      exportOrFunction: 'interpretHawiQuestionInitial',
      sourceSnippetIdentifier: ruleFile ? `goral-hachol/data/sources/hawi/question-rules/${ruleFile}` : null,
    },
    confidence: ruleFile ? 'medium' : 'low',
    notes: ruleFile
      ? ''
      : `אין קובץ question-rule ייעודי לנושא זה (${topicId}) — המנוע נופל-חזרה לניתוח-לוח כללי בלבד (buildBoardAnalysis), ללא כללי-שאלה ספציפיים ממקור.`,
  };
}

const KASHF_TOPIC_ENTRIES = Object.keys(KASHF_TOPICS).map(kashfTopicEntry);
const HAWI_TOPIC_ENTRIES = Object.keys(HAWI_TOPICS).map(hawiTopicEntry);

const CROSS_CUTTING_ENTRIES = [
  {
    method: 'kashf',
    sourceId: KASHF_SOURCE_ID,
    sourceTitle: KASHF_SOURCE_TITLE,
    approvedSource: true,
    topicId: null,
    ruleId: 'kashf-dhamir-majority',
    ruleName: 'Dhamir — majority vote (5 Gate-4 methods)',
    rulePurpose: 'קביעת "מחשבת השואל" האמיתית מתוך רוב-הצבעה בין 5 שיטות שער-4',
    ruleType: 'hiddenThought',
    requiredInputs: ['board'],
    applicableQuestionTypes: ['hiddenThoughtIntent'],
    blockedQuestionTypes: [],
    clientVisibility: 'advisorOnly',
    evidenceLocation: { file: 'goral-hachol/engine/kashf-dhamir.js', exportOrFunction: 'computeDhamirByMajority', sourceSnippetIdentifier: null },
    confidence: 'medium',
    notes: 'DHAMIR_CLIENT_VISIBLE_TOPICS ריק לגמרי — תמיד advisorOnly בפועל, בכל topicId, כולל hiddenThoughtIntent עצמו.',
  },
  {
    method: 'kashf',
    sourceId: KASHF_SOURCE_ID,
    sourceTitle: KASHF_SOURCE_TITLE,
    approvedSource: true,
    topicId: null,
    ruleId: 'kashf-dhamir-type4-external',
    ruleName: 'Dhamir type-4 external method',
    rulePurpose: 'שיטה שישית, חיצונית-למקור-כשף עצמו, לחישוב דהמיר',
    ruleType: 'hiddenThought',
    requiredInputs: ['board'],
    applicableQuestionTypes: [],
    blockedQuestionTypes: [],
    clientVisibility: 'advisorOnly',
    evidenceLocation: { file: 'goral-hachol/engine/kashf-dhamir-type4-external.js', exportOrFunction: 'computeDhamirType4External', sourceSnippetIdentifier: null },
    confidence: 'low',
    notes: 'לא נובע מספר כשף עצמו (external). לא נקרא כלל משום writer function — לא מוצג אף פעם, גם לא ליועץ, נכון לעכשיו.',
  },
  {
    method: 'kashf',
    sourceId: KASHF_SOURCE_ID,
    sourceTitle: KASHF_SOURCE_TITLE,
    approvedSource: true,
    topicId: null,
    ruleId: 'kashf-timing-temperament-bundle',
    ruleName: 'Timing + temperament (dhamirExtras)',
    rulePurpose: 'הערכת עיתוי (timingByThirds/timingByMadad/timingEstimate) וטבע השואל (temperament), מקוננים בכרטיס-הדהמיר',
    ruleType: 'timing',
    requiredInputs: ['board', 'dhamir winner house'],
    applicableQuestionTypes: ['timing', 'personCharacter'],
    blockedQuestionTypes: [],
    clientVisibility: 'advisorOnly',
    evidenceLocation: { file: 'goral-hachol/engine/kashf-pending-extraction.js', exportOrFunction: 'computeTimingByDhamirThirds / computeQuerentTemperament / computeTimingByMadad / computeTimingEstimate', sourceSnippetIdentifier: null },
    confidence: 'medium',
    notes: 'אין sectionId נפרד ל-timing/temperament ב-goral-rule-applicability.js — מקונן בתוך כרטיס-הדהמיר ולכן חסום תמיד יחד איתו. פער ידע (ראו gapNote ב-goral-question-taxonomy.js לשני הסוגים timing ו-personCharacter).',
  },
  {
    method: 'kashf',
    sourceId: KASHF_SOURCE_ID,
    sourceTitle: KASHF_SOURCE_TITLE,
    approvedSource: true,
    topicId: null,
    ruleId: 'kashf-witness-testimony',
    ruleName: 'Witness testimony (houses 13/14)',
    rulePurpose: 'קריאת שני בתי-העדים כתמיכה/סתירה לפסיקה הראשית',
    ruleType: 'verification',
    requiredInputs: ['board houses 13-14'],
    applicableQuestionTypes: [],
    blockedQuestionTypes: [],
    clientVisibility: 'client',
    evidenceLocation: { file: 'goral-hachol/engine/kashf-pending-extraction.js', exportOrFunction: 'computeWitnessTestimony', sourceSnippetIdentifier: null },
    confidence: 'medium',
    notes: '',
  },
  {
    method: 'kashf',
    sourceId: KASHF_SOURCE_ID,
    sourceTitle: KASHF_SOURCE_TITLE,
    approvedSource: true,
    topicId: null,
    ruleId: 'kashf-formula-only-house-labeling',
    ruleName: 'Formula-only house neutral labeling',
    rulePurpose: 'בתים שמשמשים כקלט-לנוסחה בלבד (לא נבדקים ישירות ב-supportingChecks) מקבלים תווית ניטרלית ("מרכיב בנוסחת ההכרעה") ולא את השם התמטי שלהם',
    ruleType: 'conditional',
    requiredInputs: ['rules.primaryFormula.houses', 'rules.altFormula.houses', 'rules.supportingChecks'],
    applicableQuestionTypes: [],
    blockedQuestionTypes: [],
    clientVisibility: 'client',
    evidenceLocation: { file: 'goral-hachol/engine/kashf-reading-engine.js', exportOrFunction: 'getFormulaOnlyHouseNumbers / describeHouse', sourceSnippetIdentifier: null },
    confidence: 'high',
    notes: 'תוקן ואומת בפאזה קודמת של הסשן (commit 70953ec).',
  },
  {
    method: 'kashf',
    sourceId: KASHF_SOURCE_ID,
    sourceTitle: KASHF_SOURCE_TITLE,
    approvedSource: true,
    topicId: 'commerce',
    ruleId: 'kashf-commerce-smart-layer',
    ruleName: 'Commerce smart narrative rewrite',
    rulePurpose: 'שכבת-ניסוח חכם ייעודית לנושא מסחר בלבד — proof-of-concept ל"בינה" עתידית, נופלת-חזרה לטקסט הסטטי בכשל',
    ruleType: 'supporting',
    requiredInputs: ['reading (kashf commerce)'],
    applicableQuestionTypes: ['businessSuccess'],
    blockedQuestionTypes: [],
    clientVisibility: 'client',
    evidenceLocation: { file: 'goral-hachol/engine/kashf-commerce-smart-layer.js', exportOrFunction: 'computeCommerceSmartLayer', sourceSnippetIdentifier: null },
    confidence: 'medium',
    notes: 'עדיין מוגבל לנושא commerce בלבד, לא הורחב לנושאים אחרים.',
  },

  {
    method: 'hawi',
    sourceId: HAWI_SOURCE_ID,
    sourceTitle: HAWI_SOURCE_TITLE,
    approvedSource: true,
    topicId: null,
    ruleId: 'hawi-judge-verdict',
    ruleName: 'Judge house verdict (house 15)',
    rulePurpose: 'בניית הפסיקה הסופית מבית-השופט, משמש בכל topicId',
    ruleType: 'primaryDecision',
    requiredInputs: ['boardAnalysis'],
    applicableQuestionTypes: [],
    blockedQuestionTypes: [],
    clientVisibility: 'client',
    evidenceLocation: { file: 'goral-hachol/engine/hawi-interpreter.js', exportOrFunction: 'buildJudgeVerdict / judgeHouseTone', sourceSnippetIdentifier: null },
    confidence: 'high',
    notes: '',
  },
  {
    method: 'hawi',
    sourceId: HAWI_SOURCE_ID,
    sourceTitle: HAWI_SOURCE_TITLE,
    approvedSource: true,
    topicId: null,
    ruleId: 'hawi-ittisalat',
    ruleName: 'Ittisalat (house-to-house connections)',
    rulePurpose: 'חישוב "חיבורים" בין שאלן/נשאל/שופט וכיו"ב, תמיכה לפסיקה הראשית',
    ruleType: 'supporting',
    requiredInputs: ['chart', 'focusHouseNumber', 'mainHouses'],
    applicableQuestionTypes: [],
    blockedQuestionTypes: [],
    clientVisibility: 'client',
    evidenceLocation: { file: 'goral-hachol/engine/hawi-interpreter.js', exportOrFunction: 'computeIttisalat', sourceSnippetIdentifier: null },
    confidence: 'medium',
    notes: '',
  },
  {
    method: 'hawi',
    sourceId: HAWI_SOURCE_ID,
    sourceTitle: HAWI_SOURCE_TITLE,
    approvedSource: true,
    topicId: null,
    ruleId: 'hawi-figure-states',
    ruleName: 'Figure fortune/movement/speaking state',
    rulePurpose: 'מזל, תנועה (פנימי/חיצוני/יציב), דיבור/שתיקה של כל צורה בלוח',
    ruleType: 'supporting',
    requiredInputs: ['house figure'],
    applicableQuestionTypes: [],
    blockedQuestionTypes: [],
    clientVisibility: 'client',
    evidenceLocation: { file: 'goral-hachol/engine/hawi-interpreter.js', exportOrFunction: 'getFigureStateForHouse / getFigureStateHouseTone / getSpeakingStateMultiplier', sourceSnippetIdentifier: null },
    confidence: 'high',
    notes: '',
  },
  {
    method: 'hawi',
    sourceId: HAWI_SOURCE_ID,
    sourceTitle: HAWI_SOURCE_TITLE,
    approvedSource: true,
    topicId: null,
    ruleId: 'hawi-triangles',
    ruleName: 'Triangle enrichment',
    rulePurpose: 'העשרת ניתוח דרך יחסי-משולשים בין בתים',
    ruleType: 'supporting',
    requiredInputs: ['chart'],
    applicableQuestionTypes: [],
    blockedQuestionTypes: [],
    clientVisibility: 'advisorOnly',
    evidenceLocation: { file: 'goral-hachol/engine/hawi-interpreter.js', exportOrFunction: 'computeTrianglesEnrichment', sourceSnippetIdentifier: null },
    confidence: 'low',
    notes: 'לא אומת אם/איך משתלב בטקסט-ללקוח לעומת advisorData בלבד — דורש בדיקה ממוקדת נפרדת.',
  },
  {
    method: 'hawi',
    sourceId: HAWI_SOURCE_ID,
    sourceTitle: HAWI_SOURCE_TITLE,
    approvedSource: true,
    topicId: 'disputes',
    ruleId: 'hawi-ghalib-maghloub',
    ruleName: 'Ghalib/Maghloub (winner/defeated)',
    rulePurpose: 'קביעת הצד המנצח/המפסיד — משמש בעיקר לנושא מריבות',
    ruleType: 'supporting',
    requiredInputs: ['chart'],
    applicableQuestionTypes: ['enemiesConflict', 'legalAuthority'],
    blockedQuestionTypes: [],
    clientVisibility: 'client',
    evidenceLocation: { file: 'goral-hachol/engine/hawi-interpreter.js', exportOrFunction: 'computeGhalibMaghloub', sourceSnippetIdentifier: null },
    confidence: 'medium',
    notes: '',
  },
  {
    method: 'hawi',
    sourceId: HAWI_SOURCE_ID,
    sourceTitle: HAWI_SOURCE_TITLE,
    approvedSource: true,
    topicId: null,
    ruleId: 'hawi-dhamir',
    ruleName: 'Hawi dhamir (mizan tracing)',
    rulePurpose: 'חישוב-דהמיר עצמאי של Hawi (שונה מיישום Kashf)',
    ruleType: 'hiddenThought',
    requiredInputs: ['chart'],
    applicableQuestionTypes: ['hiddenThoughtIntent'],
    blockedQuestionTypes: [],
    clientVisibility: 'advisorOnly',
    evidenceLocation: { file: 'goral-hachol/engine/hawi-interpreter.js', exportOrFunction: 'computeDhamirByMizanTracing / computeDhamirHouse', sourceSnippetIdentifier: null },
    confidence: 'medium',
    notes: 'חסום ללקוח באותה מנגנון (DHAMIR_CLIENT_VISIBLE_TOPICS.hawi ריק), חוץ מהחריג היחיד: method=hawi + topicId=spiritualDiagnostics (buildSpiritualNarrative קורא ל-dhamirParagraph ללא-תנאי — ראו goral-rule-applicability-matrix.js).',
  },
];

export const GORAL_KNOWLEDGE_REGISTRY = [...KASHF_TOPIC_ENTRIES, ...HAWI_TOPIC_ENTRIES, ...CROSS_CUTTING_ENTRIES];

export function getRegistryEntriesForMethod(method) {
  return GORAL_KNOWLEDGE_REGISTRY.filter((e) => e.method === method);
}

export function getRegistryEntryByRuleId(ruleId) {
  return GORAL_KNOWLEDGE_REGISTRY.find((e) => e.ruleId === ruleId) || null;
}

export function getRegistryEntriesForTopic(method, topicId) {
  return GORAL_KNOWLEDGE_REGISTRY.filter((e) => e.method === method && e.topicId === topicId);
}

// Real, confirmed gap: Kashf topics with an executable rule (KASHF_TOPIC_RULES)
// but no matching KASHF_TOPIC_PAGE_MAP entry at all.
export const KASHF_RULES_WITHOUT_PAGE_MAP = Object.keys(KASHF_TOPICS).filter((t) => !KASHF_PAGE_INFO[t]);

// Real, confirmed gap: KASHF_TOPIC_PAGE_MAP topicIds that have no matching KASHF_TOPIC_RULES entry
// (page is mapped in the book, but no rule executes for it in Kashf yet).
export const KASHF_PAGE_MAP_WITHOUT_RULES = Object.keys(KASHF_PAGE_INFO).filter((t) => !(t in KASHF_TOPICS) && !!KASHF_PAGE_INFO[t]);

export default {
  GORAL_KNOWLEDGE_REGISTRY,
  getRegistryEntriesForMethod,
  getRegistryEntryByRuleId,
  getRegistryEntriesForTopic,
  KASHF_RULES_WITHOUT_PAGE_MAP,
  KASHF_PAGE_MAP_WITHOUT_RULES,
};
