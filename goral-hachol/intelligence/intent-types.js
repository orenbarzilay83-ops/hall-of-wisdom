/**
 * intent-types.js
 *
 * Single source of truth for Hall of Wisdom Intent Analyzer intents
 * (HALL_WISDOM_CORE_ARCHITECTURE.md, Intent Analyzer). Deterministic
 * catalog only — no engine imports, no AI, no network.
 *
 * Intent is orthogonal to questionType (goral-hachol/brain/goral-question-taxonomy.js).
 * The same questionType (e.g. businessSuccess) can carry different intents
 * (prediction, decisionSupport, diagnosis, timingRequest, comparison, guidance).
 *
 * `compatibleQuestionTypes` is a hint list, not an authoritative constraint —
 * it must never override a clear reading of the question text itself.
 *
 * `commonlyConfusedWith` is an addition beyond the minimal 7-field contract
 * requested for intent definitions — it is required to drive the exclusion
 * logic (excludedIntents) in intent-analyzer.js and is documented as an
 * intentional, minimal extension in HALL_WISDOM_INTENT_ANALYZER_PRECOMMIT_REPORT.md.
 *
 * UNKNOWN_INTENT_ID ('unknown') is the mandatory result whenever the
 * analyzer cannot identify a real intent with sufficient confidence — it is
 * never a guess and is never one of the 12 catalog intents. Engines/Reading
 * Strategy must never proceed on 'unknown'; requiresClarification is always
 * true alongside it.
 */

export const UNKNOWN_INTENT_ID = 'unknown';
export const UNKNOWN_INTENT_TITLE_HEBREW = 'לא ידוע';

export const INTENT_IDS = [
  'prediction',
  'decisionSupport',
  'stateAssessment',
  'hiddenThoughtIntent',
  'timingRequest',
  'investigation',
  'diagnosis',
  'compatibility',
  'outcomeCompletion',
  'comparison',
  'guidance',
  'generalForecast',
];

export const INTENT_DEFINITIONS = {
  prediction: {
    intentId: 'prediction',
    titleHebrew: 'ניבוי',
    description: 'שאלה מה צפוי לקרות — תוצאה עתידית קונקרטית.',
    compatibleQuestionTypes: [
      'businessSuccess', 'completion', 'moneyLivelihood', 'travel', 'health',
      'marriage', 'pregnancyChildren', 'legalAuthority', 'workCareer',
      'enemiesConflict', 'lostObject', 'general',
    ],
    defaultStrategyHints: ['focusOnOutcome', 'allowVerification', 'hideHiddenThoughtByDefault', 'timingOnlyIfAsked'],
    forbiddenDefaultRuleCategories: ['hiddenThought', 'characterNature', 'timing', 'spiritual'],
    confidenceThreshold: 0.45,
    commonlyConfusedWith: ['hiddenThoughtIntent', 'timingRequest', 'diagnosis', 'investigation', 'decisionSupport'],
  },

  decisionSupport: {
    intentId: 'decisionSupport',
    titleHebrew: 'תמיכה בהחלטה',
    description: 'שאלה האם כדאי לבצע פעולה מסוימת, טרם-בוצעה.',
    compatibleQuestionTypes: [
      'businessSuccess', 'moneyLivelihood', 'loveRelationship', 'travel',
      'marriage', 'legalAuthority', 'workCareer', 'general',
    ],
    defaultStrategyHints: ['compareRisksAndSupports', 'avoidAbsolutePrediction', 'emphasizeGuidance', 'timingOnlyIfAsked'],
    forbiddenDefaultRuleCategories: ['hiddenThought', 'characterNature', 'absoluteOutcomeClaims'],
    confidenceThreshold: 0.45,
    commonlyConfusedWith: ['hiddenThoughtIntent', 'timingRequest', 'outcomeCompletion', 'comparison', 'guidance'],
  },

  stateAssessment: {
    intentId: 'stateAssessment',
    titleHebrew: 'בירור מצב',
    description: 'בירור המצב הנוכחי — לא תחזית, לא כוונה נסתרת.',
    compatibleQuestionTypes: ['loveRelationship', 'health', 'personCharacter', 'marriage', 'general', 'spiritual'],
    defaultStrategyHints: ['focusOnCurrentState', 'avoidFutureProjection', 'timingOnlyIfAsked'],
    forbiddenDefaultRuleCategories: ['timing', 'characterNature', 'spiritual'],
    confidenceThreshold: 0.5,
    commonlyConfusedWith: ['hiddenThoughtIntent', 'prediction', 'timingRequest', 'compatibility'],
  },

  hiddenThoughtIntent: {
    intentId: 'hiddenThoughtIntent',
    titleHebrew: 'כוונה/מחשבה נסתרת',
    description: 'מה אדם חושב, מרגיש, או מתכוון — לא מצבו הכללי.',
    compatibleQuestionTypes: ['hiddenThoughtIntent', 'loveRelationship', 'personCharacter'],
    defaultStrategyHints: ['allowHiddenThoughtRules', 'advisorDepthHigh', 'clientWordingCautious'],
    forbiddenDefaultRuleCategories: ['timing', 'spiritual', 'unrelatedOutcomeRules'],
    confidenceThreshold: 0.45,
    commonlyConfusedWith: ['stateAssessment', 'timingRequest', 'prediction', 'diagnosis'],
  },

  timingRequest: {
    intentId: 'timingRequest',
    titleHebrew: 'בקשת עיתוי',
    description: 'מתי דבר יקרה.',
    compatibleQuestionTypes: ['timing', 'completion', 'businessSuccess', 'marriage', 'travel', 'pregnancyChildren', 'legalAuthority', 'workCareer'],
    defaultStrategyHints: ['requireTimingRules', 'avoidCharacterNature', 'avoidHiddenThoughtUnlessSecondary'],
    forbiddenDefaultRuleCategories: ['hiddenThought', 'characterNature', 'spiritual'],
    confidenceThreshold: 0.4,
    commonlyConfusedWith: ['prediction', 'hiddenThoughtIntent', 'diagnosis', 'outcomeCompletion'],
  },

  investigation: {
    intentId: 'investigation',
    titleHebrew: 'חקירה',
    description: 'מי עשה, מה קרה, היכן נמצא, בירור נסתר.',
    compatibleQuestionTypes: ['lostObject', 'enemiesConflict', 'legalAuthority'],
    defaultStrategyHints: ['focusOnIdentificationOrLocation', 'requireVerificationRules', 'avoidHiddenThoughtUnlessSecondary'],
    forbiddenDefaultRuleCategories: ['hiddenThought', 'characterNature', 'timing'],
    confidenceThreshold: 0.4,
    commonlyConfusedWith: ['diagnosis', 'prediction', 'hiddenThoughtIntent', 'timingRequest'],
  },

  diagnosis: {
    intentId: 'diagnosis',
    titleHebrew: 'אבחון סיבה',
    description: 'מה מקור הבעיה או מה טיבה — לא מה יקרה בעתיד.',
    compatibleQuestionTypes: ['health', 'businessSuccess', 'spiritual', 'enemiesConflict', 'workCareer'],
    defaultStrategyHints: ['seekCauseRules', 'distinguishCauseFromOutcome', 'avoidTimingUnlessAsked'],
    forbiddenDefaultRuleCategories: ['timing', 'hiddenThought'],
    confidenceThreshold: 0.4,
    commonlyConfusedWith: ['prediction', 'investigation', 'timingRequest', 'hiddenThoughtIntent'],
  },

  compatibility: {
    intentId: 'compatibility',
    titleHebrew: 'התאמה',
    description: 'האם יש התאמה בין אנשים/דברים.',
    compatibleQuestionTypes: ['loveRelationship', 'marriage', 'personCharacter'],
    defaultStrategyHints: ['compareTwoParties', 'allowCharacterNature', 'avoidAbsoluteVerdict'],
    forbiddenDefaultRuleCategories: ['hiddenThought', 'timing'],
    confidenceThreshold: 0.45,
    commonlyConfusedWith: ['stateAssessment', 'decisionSupport', 'hiddenThoughtIntent'],
  },

  outcomeCompletion: {
    intentId: 'outcomeCompletion',
    titleHebrew: 'השלמת עניין',
    description: 'האם עניין יושלם או יצא לפועל.',
    compatibleQuestionTypes: ['completion', 'businessSuccess', 'marriage', 'pregnancyChildren', 'legalAuthority', 'moneyLivelihood'],
    defaultStrategyHints: ['focusOnCompletionVerdict', 'allowVerification', 'timingOnlyIfAsked'],
    forbiddenDefaultRuleCategories: ['hiddenThought', 'characterNature', 'timing'],
    confidenceThreshold: 0.45,
    commonlyConfusedWith: ['prediction', 'timingRequest', 'decisionSupport', 'diagnosis'],
  },

  comparison: {
    intentId: 'comparison',
    titleHebrew: 'השוואה',
    description: 'איזו אפשרות עדיפה.',
    compatibleQuestionTypes: ['businessSuccess', 'workCareer', 'legalAuthority', 'general', 'moneyLivelihood'],
    defaultStrategyHints: ['compareOptionsSideBySide', 'avoidSingleOutcomeFraming', 'emphasizeGuidance'],
    forbiddenDefaultRuleCategories: ['hiddenThought', 'timing', 'characterNature'],
    confidenceThreshold: 0.45,
    commonlyConfusedWith: ['decisionSupport', 'guidance', 'prediction'],
  },

  guidance: {
    intentId: 'guidance',
    titleHebrew: 'הכוונה',
    description: 'מה נכון לעשות או כיצד לפעול.',
    compatibleQuestionTypes: ['businessSuccess', 'workCareer', 'general', 'moneyLivelihood', 'legalAuthority'],
    defaultStrategyHints: ['emphasizeActionableAdvice', 'avoidAbsolutePrediction', 'allowSupportingRules'],
    forbiddenDefaultRuleCategories: ['hiddenThought', 'absoluteOutcomeClaims'],
    confidenceThreshold: 0.45,
    commonlyConfusedWith: ['decisionSupport', 'comparison', 'prediction'],
  },

  generalForecast: {
    intentId: 'generalForecast',
    titleHebrew: 'תחזית כללית',
    description: 'שאלה כללית על העתיד ללא יעד ממוקד.',
    compatibleQuestionTypes: ['general'],
    defaultStrategyHints: ['broadOverview', 'avoidSingleTopicFocus', 'timingOnlyIfAsked'],
    forbiddenDefaultRuleCategories: ['hiddenThought', 'characterNature'],
    confidenceThreshold: 0.5,
    commonlyConfusedWith: ['prediction', 'stateAssessment', 'timingRequest'],
  },
};

/**
 * Generic, intent-specific "why this was excluded" reasons — keyed by the
 * EXCLUDED intent, not by the (primary, excluded) pair, since the reason
 * "this question isn't asking that" is a property of what the excluded
 * intent represents, not of which primary intent won. This mirrors the
 * exact reasoning style requested (e.g. "השאלה אינה מבקשת לברר מחשבות או
 * רגשות" for hiddenThoughtIntent, regardless of what the primary intent was).
 */
export const EXCLUSION_REASON_BY_INTENT = {
  prediction: 'לא נשאל מה צפוי לקרות כתוצאה.',
  decisionSupport: 'לא נשאל האם כדאי לבצע פעולה.',
  stateAssessment: 'לא מתבקש בירור של מצב קיים.',
  hiddenThoughtIntent: 'השאלה אינה מבקשת לברר מחשבות או רגשות.',
  timingRequest: 'לא נשאל מתי.',
  investigation: 'לא מתבצע בירור של אדם, חפץ או אירוע.',
  diagnosis: 'לא נשאלה סיבת הבעיה.',
  compatibility: 'לא נשאלת שאלת התאמה בין צדדים.',
  outcomeCompletion: 'לא נשאל האם העניין יושלם או יצא לפועל.',
  comparison: 'לא מוצגות מספר אפשרויות להשוואה.',
  guidance: 'לא מתבקשת הנחיה כיצד לפעול.',
  generalForecast: 'לא מתבקשת תחזית כללית לא-ממוקדת.',
};

/**
 * Conservative default forbidden-rule-categories used only when
 * primaryIntent is UNKNOWN_INTENT_ID — the union of every real intent's
 * forbiddenDefaultRuleCategories, since with no identified intent the safest
 * default is to forbid everything any intent would forbid.
 */
export const UNKNOWN_FORBIDDEN_RULE_CATEGORIES = [...new Set(
  Object.values(INTENT_DEFINITIONS).flatMap((def) => def.forbiddenDefaultRuleCategories)
)];

export function getAllIntentIds() {
  return INTENT_IDS.slice();
}

export function getIntentDefinition(intentId) {
  return INTENT_DEFINITIONS[intentId] || null;
}

export function isIntentId(value) {
  return INTENT_IDS.includes(value);
}

/**
 * True for any legal value of the `primaryIntent` output field — one of the
 * 12 real intents, or the mandatory UNKNOWN_INTENT_ID fallback. Use this
 * (not isIntentId) to validate primaryIntent specifically.
 */
export function isPrimaryIntentValue(value) {
  return value === UNKNOWN_INTENT_ID || isIntentId(value);
}

/**
 * @param {object} def - one entry of INTENT_DEFINITIONS
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateIntentDefinition(def) {
  const errors = [];
  if (!def || typeof def !== 'object') return { valid: false, errors: ['intent definition must be an object'] };

  if (typeof def.intentId !== 'string' || def.intentId.length === 0) errors.push('intentId is required and must be a non-empty string');
  if (typeof def.titleHebrew !== 'string' || def.titleHebrew.length === 0) errors.push('titleHebrew is required and must be a non-empty string');
  if (typeof def.description !== 'string' || def.description.length === 0) errors.push('description is required and must be a non-empty string');
  if (!Array.isArray(def.compatibleQuestionTypes) || !def.compatibleQuestionTypes.every((v) => typeof v === 'string')) {
    errors.push('compatibleQuestionTypes must be an array of strings');
  }
  if (!Array.isArray(def.defaultStrategyHints) || !def.defaultStrategyHints.every((v) => typeof v === 'string')) {
    errors.push('defaultStrategyHints must be an array of strings');
  }
  if (!Array.isArray(def.forbiddenDefaultRuleCategories) || !def.forbiddenDefaultRuleCategories.every((v) => typeof v === 'string')) {
    errors.push('forbiddenDefaultRuleCategories must be an array of strings');
  }
  if (typeof def.confidenceThreshold !== 'number' || def.confidenceThreshold < 0 || def.confidenceThreshold > 1) {
    errors.push('confidenceThreshold must be a number between 0 and 1');
  }

  return { valid: errors.length === 0, errors };
}

export default {
  INTENT_IDS,
  INTENT_DEFINITIONS,
  UNKNOWN_INTENT_ID,
  UNKNOWN_INTENT_TITLE_HEBREW,
  EXCLUSION_REASON_BY_INTENT,
  UNKNOWN_FORBIDDEN_RULE_CATEGORIES,
  getAllIntentIds,
  getIntentDefinition,
  isIntentId,
  isPrimaryIntentValue,
  validateIntentDefinition,
};
