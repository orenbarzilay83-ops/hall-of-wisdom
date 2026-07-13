/**
 * reading-strategy-types.js
 *
 * Single source of truth for Hall of Wisdom Reading Strategy Builder
 * (HALL_WISDOM_READING_STRATEGY_BUILDER_COMPONENT_CONTRACT.md). Deterministic
 * catalog + type guards only — no engine imports, no AI, no network.
 *
 * Foundation phase: the category names/mappings here are a v1 vocabulary for
 * strategyConstraints/primaryEvidence, not yet reconciled with the live
 * goral-rule-applicability-matrix.js / goral-knowledge-registry.js. That
 * reconciliation is explicit future integration work — Reading Strategy
 * Builder is intentionally NOT connected to engines or the live knowledge
 * registry in this phase.
 */

export const STRATEGY_VERSION = 'reading-strategy-builder-v1';

export const VERIFICATION_POLICY_VALUES = ['always', 'onlyOnContradiction', 'none'];
export const CLIENT_DEPTH_VALUES = ['short', 'standard', 'extended'];
export const ADVISOR_DEPTH_VALUES = ['standard', 'full-reasoning'];
export const HIDDEN_SECTIONS_POLICY_VALUES = ['excludeAll', 'includeHiddenThoughtOnly', 'includeAll'];
export const TIMING_POLICY_VALUES = ['excludeUnlessAsked', 'includeAsPrimary', 'includeAsSecondary'];
export const SPIRITUAL_POLICY_VALUES = ['excludeUnlessAsked', 'includeIfRelevant'];
export const CONFIDENCE_POLICY_VALUES = ['flagIfBelowThreshold', 'strict', 'lenient'];

export const CONSTRAINT_FIELD_NAMES = [
  'mustInclude', 'mayInclude', 'mustExclude', 'advisorOnly', 'requiresEvidence', 'forbiddenWithoutQuestion',
];

// v1 category vocabulary — union of (a) the exact forbiddenDefaultRuleCategories
// strings already used in intent-types.js, (b) the worked-example categories
// already approved in HALL_WISDOM_READING_STRATEGY_BUILDER_COMPONENT_CONTRACT.md,
// (c) a small set of reserved names for topics with no dedicated Intent yet
// (travel/pregnancy), kept for forward-compatibility per the component contract.
export const STRATEGY_CONSTRAINT_CATEGORIES = [
  // shared with intent-types.js::INTENT_DEFINITIONS[*].forbiddenDefaultRuleCategories
  'hiddenThought', 'characterNature', 'timing', 'spiritual', 'absoluteOutcomeClaims', 'unrelatedOutcomeRules',
  // per-intent primary/secondary evidence categories (foundation-only names)
  'outcomeRules', 'businessRelevantRules', 'currentStateRules', 'timingRules', 'hiddenThoughtRules',
  'investigationRules', 'diagnosisRules', 'compatibilityRules', 'comparisonRules', 'guidanceRules',
  'generalForecastRules', 'supportingRules',
  // cross-cutting categories
  'verification', 'contradictionResolution', 'technicalFormulaDetails', 'dhamir',
  'thematicHouseMeaning', 'formulaOnlyHouse', 'clientNarrative', 'advisorNarrative',
  // reserved, not yet driven by a dedicated Intent — forward-compatibility only
  'travel', 'pregnancy',
];

export const CATEGORY_HEBREW_LABELS = {
  hiddenThought: 'בירור מחשבות',
  characterNature: 'בירור אופי',
  timing: 'בקשת עיתוי',
  spiritual: 'אבחון רוחני',
  absoluteOutcomeClaims: 'קביעה מוחלטת',
  unrelatedOutcomeRules: 'תוצאה לא-קשורה',
  travel: 'נסיעה',
  pregnancy: 'הריון',
};

// Human-readable English label used inside strategyReason sentences, per the
// convention already approved in the component contract (e.g. "נבחרה
// אסטרטגיית Prediction משום ש..."). Deliberately not titleHebrew — that
// convention was set by the approved worked examples in the contract.
export const ENGLISH_INTENT_LABELS = {
  prediction: 'Prediction',
  decisionSupport: 'Decision Support',
  stateAssessment: 'State Assessment',
  hiddenThoughtIntent: 'Hidden Thought',
  timingRequest: 'Timing',
  investigation: 'Investigation',
  diagnosis: 'Diagnosis',
  compatibility: 'Compatibility',
  outcomeCompletion: 'Outcome Completion',
  comparison: 'Comparison',
  guidance: 'Guidance',
  generalForecast: 'General Forecast',
};

// Deterministic mapping from an Intent's `defaultStrategyHints` (already
// defined in intent-types.js) to the "may include" category it signals —
// only hints of the form "allow<Category>" carry this meaning; every other
// hint token affects policy fields (see reading-strategy-builder.js) but not
// strategyConstraints directly. `allowHiddenThoughtRules` is deliberately
// excluded here: it currently only appears on hiddenThoughtIntent itself,
// whose 'hiddenThoughtRules' category is already mandatory via
// PRIMARY_EVIDENCE_CATEGORIES_BY_INTENT (mustInclude) — mapping it into
// mayInclude too would just be a redundant near-duplicate entry.
export const HINT_TO_MAY_INCLUDE_CATEGORY = {
  allowVerification: 'verification',
  allowCharacterNature: 'characterNature',
  allowSupportingRules: 'supportingRules',
};

// v1 mapping from primaryIntent to its mustInclude ("primary evidence")
// categories. Foundation-only — not yet reconciled with the live knowledge
// registry (see file header). The first 4 entries mirror the exact worked
// examples already approved in the component contract; the remaining 8
// follow the same "<intentId>Rules" naming pattern.
export const PRIMARY_EVIDENCE_CATEGORIES_BY_INTENT = {
  prediction: ['outcomeRules', 'businessRelevantRules'],
  decisionSupport: ['outcomeRules', 'currentStateRules'],
  stateAssessment: ['currentStateRules'],
  hiddenThoughtIntent: ['hiddenThoughtRules'],
  timingRequest: ['timingRules', 'outcomeRules'],
  investigation: ['investigationRules'],
  diagnosis: ['diagnosisRules'],
  compatibility: ['compatibilityRules'],
  outcomeCompletion: ['outcomeRules'],
  comparison: ['comparisonRules'],
  guidance: ['guidanceRules'],
  generalForecast: ['generalForecastRules'],
};

export function isVerificationPolicy(value) {
  return VERIFICATION_POLICY_VALUES.includes(value);
}

export function isClientDepth(value) {
  return CLIENT_DEPTH_VALUES.includes(value);
}

export function isAdvisorDepth(value) {
  return ADVISOR_DEPTH_VALUES.includes(value);
}

export function isHiddenSectionsPolicy(value) {
  return HIDDEN_SECTIONS_POLICY_VALUES.includes(value);
}

export function isTimingPolicy(value) {
  return TIMING_POLICY_VALUES.includes(value);
}

export function isSpiritualPolicy(value) {
  return SPIRITUAL_POLICY_VALUES.includes(value);
}

export function isConfidencePolicy(value) {
  return CONFIDENCE_POLICY_VALUES.includes(value);
}

export function isKnownConstraintCategory(value) {
  return STRATEGY_CONSTRAINT_CATEGORIES.includes(value);
}

export default {
  STRATEGY_VERSION,
  VERIFICATION_POLICY_VALUES,
  CLIENT_DEPTH_VALUES,
  ADVISOR_DEPTH_VALUES,
  HIDDEN_SECTIONS_POLICY_VALUES,
  TIMING_POLICY_VALUES,
  SPIRITUAL_POLICY_VALUES,
  CONFIDENCE_POLICY_VALUES,
  CONSTRAINT_FIELD_NAMES,
  STRATEGY_CONSTRAINT_CATEGORIES,
  CATEGORY_HEBREW_LABELS,
  ENGLISH_INTENT_LABELS,
  HINT_TO_MAY_INCLUDE_CATEGORY,
  PRIMARY_EVIDENCE_CATEGORIES_BY_INTENT,
  isVerificationPolicy,
  isClientDepth,
  isAdvisorDepth,
  isHiddenSectionsPolicy,
  isTimingPolicy,
  isSpiritualPolicy,
  isConfidencePolicy,
  isKnownConstraintCategory,
};
