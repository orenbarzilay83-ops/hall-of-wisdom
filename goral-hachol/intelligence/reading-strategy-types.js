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
 *
 * Reading Domain support (goralHachol / cards): READING_DOMAINS/METHOD_BY_DOMAIN
 * below intentionally duplicate (not import) the equivalent constants in
 * reading-planner-types.js — that file already imports FROM this one
 * (STRATEGY_CONSTRAINT_CATEGORIES etc.), so importing back would create a
 * circular dependency. Both copies must stay in sync by hand; they are small
 * and rarely-changing enums.
 */

export const STRATEGY_VERSION = 'reading-strategy-builder-v1';

export const READING_DOMAINS = ['goralHachol', 'cards'];

// 'cartomancy' verified against the existing codebase (cartomancy/ folder,
// cartomancyReadingsArchive_v1_${uid} storage key, 'cartomancy/**' QA
// exclusion patterns) — same evidence already documented in
// reading-planner-types.js and HALL_WISDOM_READING_PLANNER_COMPONENT_CONTRACT.md.
export const METHOD_BY_DOMAIN = {
  goralHachol: ['kashf', 'hawi'],
  cards: ['cartomancy'],
};

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
// (travel/pregnancy), kept for forward-compatibility per the component contract,
// (d) cards-specific categories added for readingDomain:'cards' support — see
// CATEGORY_DOMAINS below for which domain(s) each category is legal in. No
// card interpretation/spread/rule content is implied by these names — they
// are structural category labels only, same as the goralHachol ones.
export const STRATEGY_CONSTRAINT_CATEGORIES = [
  // shared cross-cutting gating categories (both domains) — mirror
  // intent-types.js::INTENT_DEFINITIONS[*].forbiddenDefaultRuleCategories,
  // which is itself domain-agnostic (Intent Analyzer is not touched here).
  'hiddenThought', 'characterNature', 'timing', 'absoluteOutcomeClaims', 'unrelatedOutcomeRules',
  'verification', 'contradictionResolution', 'clientNarrative', 'advisorNarrative', 'outcomeRules',
  // goralHachol-exclusive: per-intent primary/secondary evidence categories
  'businessRelevantRules', 'currentStateRules', 'timingRules', 'hiddenThoughtRules',
  'investigationRules', 'diagnosisRules', 'compatibilityRules', 'comparisonRules', 'guidanceRules',
  'generalForecastRules', 'supportingRules', 'technicalFormulaDetails', 'dhamir',
  'thematicHouseMeaning', 'formulaOnlyHouse',
  // goralHachol-exclusive: the goralHachol spelling of the spiritual-gating category
  'spiritual',
  // cards-exclusive
  'relationshipRelevantRules', 'technicalSpreadDetails', 'spiritualDiagnostics',
  // reserved, not yet driven by a dedicated Intent — forward-compatibility only
  'travel', 'pregnancy',
];

// Which readingDomain(s) each category is legal for. Categories not listed
// here are treated as unknown (isKnownConstraintCategory already rejects
// them) — this map only governs the *domain-exclusivity* check
// (isKnownConstraintCategoryForDomain), addressing "strategyConstraints של
// Domain אחד אינם משתמשים בקטגוריות מקצועיות ייחודיות ל-Domain אחר".
export const CATEGORY_DOMAINS = {
  hiddenThought: ['goralHachol', 'cards'],
  characterNature: ['goralHachol', 'cards'],
  timing: ['goralHachol', 'cards'],
  absoluteOutcomeClaims: ['goralHachol', 'cards'],
  unrelatedOutcomeRules: ['goralHachol', 'cards'],
  verification: ['goralHachol', 'cards'],
  contradictionResolution: ['goralHachol', 'cards'],
  clientNarrative: ['goralHachol', 'cards'],
  advisorNarrative: ['goralHachol', 'cards'],
  outcomeRules: ['goralHachol', 'cards'],
  businessRelevantRules: ['goralHachol'],
  currentStateRules: ['goralHachol'],
  timingRules: ['goralHachol'],
  hiddenThoughtRules: ['goralHachol'],
  investigationRules: ['goralHachol'],
  diagnosisRules: ['goralHachol'],
  compatibilityRules: ['goralHachol'],
  comparisonRules: ['goralHachol'],
  guidanceRules: ['goralHachol'],
  generalForecastRules: ['goralHachol'],
  supportingRules: ['goralHachol'],
  technicalFormulaDetails: ['goralHachol'],
  dhamir: ['goralHachol'],
  thematicHouseMeaning: ['goralHachol'],
  formulaOnlyHouse: ['goralHachol'],
  spiritual: ['goralHachol'],
  relationshipRelevantRules: ['cards'],
  technicalSpreadDetails: ['cards'],
  spiritualDiagnostics: ['cards'],
  travel: ['goralHachol'],
  pregnancy: ['goralHachol'],
};

// The domain-appropriate spelling of the "spiritual" gating category —
// goralHachol keeps the existing 'spiritual' name (unchanged, since
// intent-types.js::forbiddenDefaultRuleCategories already emits it and
// Intent Analyzer is not touched here); cards uses its own
// 'spiritualDiagnostics' name (domain-exclusive, per CATEGORY_DOMAINS above).
export function spiritualCategoryForDomain(readingDomain) {
  return readingDomain === 'cards' ? 'spiritualDiagnostics' : 'spiritual';
}

export const CATEGORY_HEBREW_LABELS = {
  hiddenThought: 'בירור מחשבות',
  characterNature: 'בירור אופי',
  timing: 'בקשת עיתוי',
  spiritual: 'אבחון רוחני',
  spiritualDiagnostics: 'אבחון רוחני',
  absoluteOutcomeClaims: 'קביעה מוחלטת',
  unrelatedOutcomeRules: 'תוצאה לא-קשורה',
  travel: 'נסיעה',
  pregnancy: 'הריון',
  relationshipRelevantRules: 'התאמת-קשר',
  technicalSpreadDetails: 'פרטי-פריסה טכניים',
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

// v1 mapping from primaryIntent to mustInclude categories, for
// readingDomain:'cards'. Deliberately minimal and generic — per explicit
// instruction, no card meanings, spread names, Rule IDs, or interpretive
// content are invented here. 'outcomeRules' is reused (shared category, see
// CATEGORY_DOMAINS) for outcome-flavored intents; 'relationshipRelevantRules'
// (cards-exclusive) is used only for intents that inherently ask about a
// relationship/person's state — the one concrete example given
// (compatibility/stateAssessment). Every other intent falls back to the
// generic, already-shared 'outcomeRules'.
export const PRIMARY_EVIDENCE_CATEGORIES_BY_INTENT_CARDS = {
  prediction: ['outcomeRules'],
  decisionSupport: ['outcomeRules'],
  stateAssessment: ['relationshipRelevantRules'],
  hiddenThoughtIntent: ['relationshipRelevantRules'],
  timingRequest: ['outcomeRules'],
  investigation: ['outcomeRules'],
  diagnosis: ['outcomeRules'],
  compatibility: ['relationshipRelevantRules'],
  outcomeCompletion: ['outcomeRules'],
  comparison: ['outcomeRules'],
  guidance: ['outcomeRules'],
  generalForecast: ['outcomeRules'],
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

export function isKnownConstraintCategoryForDomain(value, readingDomain) {
  return Array.isArray(CATEGORY_DOMAINS[value]) && CATEGORY_DOMAINS[value].includes(readingDomain);
}

export function isReadingDomain(value) {
  return READING_DOMAINS.includes(value);
}

export function isMethodForDomain(method, readingDomain) {
  return Array.isArray(METHOD_BY_DOMAIN[readingDomain]) && METHOD_BY_DOMAIN[readingDomain].includes(method);
}

export default {
  STRATEGY_VERSION,
  READING_DOMAINS,
  METHOD_BY_DOMAIN,
  VERIFICATION_POLICY_VALUES,
  CLIENT_DEPTH_VALUES,
  ADVISOR_DEPTH_VALUES,
  HIDDEN_SECTIONS_POLICY_VALUES,
  TIMING_POLICY_VALUES,
  SPIRITUAL_POLICY_VALUES,
  CONFIDENCE_POLICY_VALUES,
  CONSTRAINT_FIELD_NAMES,
  STRATEGY_CONSTRAINT_CATEGORIES,
  CATEGORY_DOMAINS,
  CATEGORY_HEBREW_LABELS,
  ENGLISH_INTENT_LABELS,
  HINT_TO_MAY_INCLUDE_CATEGORY,
  PRIMARY_EVIDENCE_CATEGORIES_BY_INTENT,
  PRIMARY_EVIDENCE_CATEGORIES_BY_INTENT_CARDS,
  spiritualCategoryForDomain,
  isVerificationPolicy,
  isClientDepth,
  isAdvisorDepth,
  isHiddenSectionsPolicy,
  isTimingPolicy,
  isSpiritualPolicy,
  isConfidencePolicy,
  isKnownConstraintCategory,
  isKnownConstraintCategoryForDomain,
  isReadingDomain,
  isMethodForDomain,
};
