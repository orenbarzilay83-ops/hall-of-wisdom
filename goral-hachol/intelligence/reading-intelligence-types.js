/**
 * reading-intelligence-types.js
 *
 * Shared enums/constants + type guards for the Reading Intelligence
 * architecture (HALL_WISDOM_READING_INTELLIGENCE_ARCHITECTURE.md, Phase 1
 * foundation). Pure constants and predicate functions only — no engine
 * imports, no AI calls, no persistence, no UI.
 */

export const METHODS = ['kashf', 'hawi'];

export const RULE_DECISION_VALUES = ['required', 'allowed', 'conditional', 'advisorOnly', 'forbidden', 'unavailable'];

export const CLIENT_VISIBILITY_VALUES = ['client', 'advisorOnly', 'hiddenUnlessRequested'];

export const CONFIDENCE_VALUES = ['high', 'medium', 'low'];

export const SEVERITY_VALUES = ['high', 'medium', 'low', 'none'];

export const ISSUE_STATUS_VALUES = ['open', 'investigating', 'orenDecisionRequired', 'fixed', 'verified', 'rejected'];

export const UNCERTAINTY_POLICY_VALUES = ['mustReflectInClientText', 'advisorOnlyNote', 'none'];

export const CONTRADICTION_POLICY_VALUES = ['mustSurfaceToClient', 'advisorOnlyNote', 'blockOutputUntilResolved'];

export const SAFETY_POLICY_VALUES = ['standard', 'heightened'];

export function isMethod(value) {
  return METHODS.includes(value);
}

export function isRuleDecisionValue(value) {
  return RULE_DECISION_VALUES.includes(value);
}

export function isClientVisibility(value) {
  return CLIENT_VISIBILITY_VALUES.includes(value);
}

export function isConfidence(value) {
  return CONFIDENCE_VALUES.includes(value);
}

export function isSeverity(value) {
  return SEVERITY_VALUES.includes(value);
}

export function isIssueStatus(value) {
  return ISSUE_STATUS_VALUES.includes(value);
}

export function isUncertaintyPolicy(value) {
  return UNCERTAINTY_POLICY_VALUES.includes(value);
}

export function isContradictionPolicy(value) {
  return CONTRADICTION_POLICY_VALUES.includes(value);
}

export function isSafetyPolicy(value) {
  return SAFETY_POLICY_VALUES.includes(value);
}

export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isStringArray(value) {
  return Array.isArray(value) && value.every((v) => typeof v === 'string');
}

export function isPositiveInteger(value) {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

export default {
  METHODS,
  RULE_DECISION_VALUES,
  CLIENT_VISIBILITY_VALUES,
  CONFIDENCE_VALUES,
  SEVERITY_VALUES,
  ISSUE_STATUS_VALUES,
  UNCERTAINTY_POLICY_VALUES,
  CONTRADICTION_POLICY_VALUES,
  SAFETY_POLICY_VALUES,
  isMethod,
  isRuleDecisionValue,
  isClientVisibility,
  isConfidence,
  isSeverity,
  isIssueStatus,
  isUncertaintyPolicy,
  isContradictionPolicy,
  isSafetyPolicy,
  isNonEmptyString,
  isStringArray,
  isPositiveInteger,
};
