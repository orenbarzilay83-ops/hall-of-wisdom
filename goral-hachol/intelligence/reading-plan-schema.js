/**
 * reading-plan-schema.js
 *
 * Schema + validation for ReadingPlan (see
 * HALL_WISDOM_READING_INTELLIGENCE_ARCHITECTURE.md, חלק ג).
 * Phase 1 foundation: schema/builder/validator only. Building a real
 * ReadingPlan from an actual question/topicId is Phase 2 — not here.
 */

import {
  isMethod,
  isNonEmptyString,
  isStringArray,
  isUncertaintyPolicy,
  isContradictionPolicy,
  isSafetyPolicy,
} from './reading-intelligence-types.js';

const ARRAY_FIELDS = [
  'primaryDecisionRules',
  'verificationRules',
  'conditionalRules',
  'supportingRules',
  'advisorOnlyRules',
  'forbiddenRules',
  'requiredInputs',
  'evidenceRequirements',
  'expectedClientSections',
  'expectedAdvisorSections',
];

/**
 * Builds a ReadingPlan object with sane defaults for omitted array fields.
 * Does not validate — call validateReadingPlan() separately.
 */
export function createReadingPlan(input = {}) {
  const plan = {
    method: input.method,
    question: input.question,
    questionType: input.questionType,
    topicId: input.topicId,
    intent: input.intent ?? '',
    sourceEvidencePointers: input.sourceEvidencePointers ?? [],
    needsOrenDecision: input.needsOrenDecision ?? false,
    uncertaintyPolicy: input.uncertaintyPolicy ?? 'mustReflectInClientText',
    contradictionPolicy: input.contradictionPolicy ?? 'mustSurfaceToClient',
    safetyPolicy: input.safetyPolicy ?? 'standard',
  };
  for (const field of ARRAY_FIELDS) {
    plan[field] = input[field] ?? [];
  }
  return plan;
}

/**
 * @param {object} plan
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateReadingPlan(plan) {
  const errors = [];

  if (!plan || typeof plan !== 'object') {
    return { valid: false, errors: ['reading plan must be an object'] };
  }

  if (!isMethod(plan.method)) errors.push(`method is required and must be 'kashf' or 'hawi' (got ${JSON.stringify(plan.method)})`);
  if (!isNonEmptyString(plan.question)) errors.push('question is required and must be a non-empty string');
  if (!isNonEmptyString(plan.questionType)) errors.push('questionType is required and must be a non-empty string');
  if (!isNonEmptyString(plan.topicId)) errors.push('topicId is required and must be a non-empty string');

  for (const field of ARRAY_FIELDS) {
    if (!isStringArray(plan[field])) errors.push(`${field} must be an array of strings`);
  }

  if (plan.uncertaintyPolicy !== undefined && !isUncertaintyPolicy(plan.uncertaintyPolicy)) {
    errors.push(`uncertaintyPolicy has an invalid value: ${JSON.stringify(plan.uncertaintyPolicy)}`);
  }
  if (plan.contradictionPolicy !== undefined && !isContradictionPolicy(plan.contradictionPolicy)) {
    errors.push(`contradictionPolicy has an invalid value: ${JSON.stringify(plan.contradictionPolicy)}`);
  }
  if (plan.safetyPolicy !== undefined && !isSafetyPolicy(plan.safetyPolicy)) {
    errors.push(`safetyPolicy has an invalid value: ${JSON.stringify(plan.safetyPolicy)}`);
  }
  if (typeof plan.needsOrenDecision !== 'boolean') {
    errors.push('needsOrenDecision must be a boolean');
  }

  // Cross-field invariant: a rule explicitly forbidden for this plan may not
  // also be declared as an expected client section (self-contradiction).
  if (isStringArray(plan.forbiddenRules) && isStringArray(plan.expectedClientSections)) {
    const overlap = plan.forbiddenRules.filter((r) => plan.expectedClientSections.includes(r));
    if (overlap.length > 0) {
      errors.push(`forbiddenRules overlap with expectedClientSections: ${overlap.join(', ')}`);
    }
  }

  // Cross-field invariant: an advisorOnly rule may not also be declared as an
  // expected client section.
  if (isStringArray(plan.advisorOnlyRules) && isStringArray(plan.expectedClientSections)) {
    const overlap = plan.advisorOnlyRules.filter((r) => plan.expectedClientSections.includes(r));
    if (overlap.length > 0) {
      errors.push(`advisorOnlyRules overlap with expectedClientSections: ${overlap.join(', ')}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export default { createReadingPlan, validateReadingPlan };
