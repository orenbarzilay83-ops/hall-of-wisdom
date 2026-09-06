/**
 * rule-decision-types.js
 *
 * Single source of truth for Hall of Wisdom Rule Decision Engine
 * (HALL_WISDOM_RULE_DECISION_ENGINE_COMPONENT_CONTRACT.md). Deterministic
 * catalog + type guards only — no engine imports, no AI, no network.
 *
 * Foundation phase: not connected to goral-hachol/engine/* (Kashf/Hawi/Cards),
 * not connected to the live goral-rule-applicability-matrix.js /
 * goral-knowledge-registry.js, and no real Rule Definitions exist yet — same
 * decoupling already established for Reading Strategy Builder / Reading
 * Planner.
 */

import { RULE_DECISION_VALUES, isRuleDecisionValue } from './reading-intelligence-types.js';
import { WARNING_SEVERITY_VALUES, isWarningSeverity } from './reading-planner-types.js';
import { isKnownConstraintCategoryForDomain } from './reading-strategy-types.js';

export const ENGINE_VERSION = 'rule-decision-engine-v1';

// Re-exported, not redefined — decision vocabulary is the SAME 6-value enum
// already established in reading-intelligence-types.js (required/allowed/
// conditional/advisorOnly/forbidden/unavailable). 'notAvailable', 'selected',
// 'rejected', 'active', 'inactive' are explicitly never used anywhere in
// this component (Component Contract §5).
export { RULE_DECISION_VALUES, isRuleDecisionValue };

// Re-exported, not redefined — same 4-value severity scale already
// established for Reading Planner warnings (info/warning/error/critical).
export { WARNING_SEVERITY_VALUES, isWarningSeverity };

export const WARNING_TYPES = [
  'missingSourceEvidence', 'unsupportedRuleForMethod', 'forbiddenRuleRequested', 'advisorOnlyLeakRisk',
  'missingRequiredInput', 'unmetActivationCondition', 'ambiguousApplicability', 'ruleConflict',
  'noVerificationPath', 'noPrimaryDecisionPath', 'crossDomainRule', 'deprecatedRule', 'lowConfidenceRule',
];

export const CONFLICT_TYPES = [
  'directContradiction', 'sourceConflict', 'applicabilityConflict', 'visibilityConflict',
  'executionOrderConflict', 'missingEvidenceConflict', 'crossDomainConflict',
];

// A 4-value enum, distinct from reading-intelligence-types.js::CLIENT_VISIBILITY_VALUES
// (which only has 3 values: client/advisorOnly/hiddenUnlessRequested — no
// 'hidden'). Defined locally rather than extending the shared file, since
// modifying any file transitively used by Intent Analyzer/Reading Strategy
// Builder/Reading Planner was explicitly out of scope for this round.
export const CLIENT_VISIBILITY_VALUES = ['client', 'advisorOnly', 'hiddenUnlessRequested', 'hidden'];

export function isClientVisibilityValue(value) {
  return CLIENT_VISIBILITY_VALUES.includes(value);
}

export function isWarningType(value) {
  return WARNING_TYPES.includes(value);
}

export function isConflictType(value) {
  return CONFLICT_TYPES.includes(value);
}

// The 14-step Decision Order (Component Contract §6) — documented here as
// data (not just prose) so tests/tracing can reference step names without
// re-typing them. The engine itself follows this order procedurally; the
// separate DECISION_PRECEDENCE_TIERS below governs which OUTCOME wins when
// multiple tiers would otherwise apply simultaneously (Component Contract §7).
export const DECISION_ORDER_STEPS = [
  'ruleDefinitionValid', 'readingDomainMatches', 'methodMatches', 'sourceEvidenceExists',
  'topicIdMatches', 'questionTypeMatches', 'primaryIntentMatches', 'readingPlanAllowsCategory',
  'strategyConstraintsForbid', 'requiredInputsPresent', 'activationConditionsMet',
  'isAdvisorOnly', 'hasConflict', 'needsOrenDecision',
];

// The 8-tier Decision Precedence (Component Contract §7) — a waterfall:
// the first tier that applies determines the final `decision` value. Later
// tiers are never reached once an earlier one has matched.
export const DECISION_PRECEDENCE_TIERS = [
  'domainMethodMismatch', 'missingApprovedSource', 'forbiddenCategory', 'advisorOnlyVisibility',
  'missingActivationCondition', 'missingRequiredInput', 'primaryDecisionRequired', 'optionalSupportingRule',
];

// Rule ID namespacing (Component Contract §8) — policy only, not enforced
// against any real Rule Definitions yet (none exist in this foundation phase).
export const RULE_ID_NAMESPACE_PREFIX = {
  goralHachol: { kashf: 'goral.kashf.', hawi: 'goral.hawi.' },
  cards: { cartomancy: 'cards.cartomancy.' },
};

export function expectedRuleIdPrefix(readingDomain, method) {
  return RULE_ID_NAMESPACE_PREFIX[readingDomain]?.[method] || null;
}

export function isValidRuleIdNamespace(ruleId, readingDomain, method) {
  const prefix = expectedRuleIdPrefix(readingDomain, method);
  return typeof ruleId === 'string' && prefix !== null && ruleId.startsWith(prefix);
}

export { isKnownConstraintCategoryForDomain };

export default {
  ENGINE_VERSION,
  RULE_DECISION_VALUES,
  isRuleDecisionValue,
  WARNING_SEVERITY_VALUES,
  isWarningSeverity,
  WARNING_TYPES,
  CONFLICT_TYPES,
  CLIENT_VISIBILITY_VALUES,
  isClientVisibilityValue,
  isWarningType,
  isConflictType,
  DECISION_ORDER_STEPS,
  DECISION_PRECEDENCE_TIERS,
  RULE_ID_NAMESPACE_PREFIX,
  expectedRuleIdPrefix,
  isValidRuleIdNamespace,
  isKnownConstraintCategoryForDomain,
};
