/**
 * rule-decision-schema.js
 *
 * Schema + validation for RuleDecision (see
 * HALL_WISDOM_READING_INTELLIGENCE_ARCHITECTURE.md, חלק ד).
 * Phase 1 foundation: schema/builder/validator only. Running the actual
 * 12-step Rule Decision Pipeline against real registry entries is Phase 2.
 */

import { isRuleDecisionValue, isClientVisibility, isConfidence, isNonEmptyString } from './reading-intelligence-types.js';

/**
 * Builds a RuleDecision object with sane defaults for omitted fields.
 * Does not validate — call validateRuleDecision() separately.
 */
export function createRuleDecision(input = {}) {
  return {
    ruleId: input.ruleId,
    decision: input.decision,
    reason: input.reason,
    sourceEvidence: input.sourceEvidence ?? null,
    activationCondition: input.activationCondition ?? null,
    clientVisibility: input.clientVisibility,
    confidence: input.confidence,
    needsOrenDecision: input.needsOrenDecision ?? false,
  };
}

/**
 * @param {object} decision
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateRuleDecision(decision) {
  const errors = [];

  if (!decision || typeof decision !== 'object') {
    return { valid: false, errors: ['rule decision must be an object'] };
  }

  if (!isNonEmptyString(decision.ruleId)) errors.push('ruleId is required and must be a non-empty string');
  if (!isRuleDecisionValue(decision.decision)) errors.push(`decision has an unknown value: ${JSON.stringify(decision.decision)}`);
  if (!isNonEmptyString(decision.reason)) errors.push('reason is required and must be a non-empty string');
  if (!isClientVisibility(decision.clientVisibility)) errors.push(`clientVisibility has an unknown value: ${JSON.stringify(decision.clientVisibility)}`);
  if (!isConfidence(decision.confidence)) errors.push(`confidence has an unknown value: ${JSON.stringify(decision.confidence)}`);
  if (typeof decision.needsOrenDecision !== 'boolean') errors.push('needsOrenDecision must be a boolean');

  // Hard invariant: an advisorOnly rule can never be client-visible.
  if (decision.decision === 'advisorOnly' && decision.clientVisibility === 'client') {
    errors.push('a rule decided as advisorOnly cannot have clientVisibility "client"');
  }

  // Hard invariant: a rule marked required must carry source evidence.
  if (decision.decision === 'required' && !isNonEmptyString(decision.sourceEvidence)) {
    errors.push('a rule decided as required must have non-empty sourceEvidence');
  }

  return { valid: errors.length === 0, errors };
}

export default { createRuleDecision, validateRuleDecision };
