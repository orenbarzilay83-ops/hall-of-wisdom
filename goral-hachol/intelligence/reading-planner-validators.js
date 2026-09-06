/**
 * reading-planner-validators.js
 *
 * Validators for Hall of Wisdom Reading Planner
 * (HALL_WISDOM_READING_PLANNER_COMPONENT_CONTRACT.md §10). No engine
 * imports, no AI, no network — pure structural validation.
 */

import { isPrimaryIntentValue } from './intent-types.js';
import { validateIntentResult } from './intent-analyzer.js';
import { validateStrategyResult } from './reading-strategy-builder.js';
import { isNonEmptyString, isStringArray, isContradictionPolicy, isUncertaintyPolicy } from './reading-intelligence-types.js';
import {
  isReadingDomain, isMethodForDomain, isWarningType, isWarningSeverity,
  isKnownConstraintCategory, EXECUTION_ORDER_DEFAULT,
} from './reading-planner-types.js';

// Reading Planner input is not allowed to carry these — client/PII data must
// travel through Knowledge Repository/Reference IDs, never raw, per the
// Integration Contract's Privacy Boundary.
const FORBIDDEN_PRIVACY_FIELDS = ['phone', 'rawClientHistory', 'rawDynFields', 'secrets', 'accessTokens', 'paymentData', 'accessToken'];

const CATEGORY_ARRAY_FIELDS = [
  'primaryDecisionCategories', 'verificationCategories', 'conditionalCategories',
  'supportingCategories', 'advisorOnlyCategories', 'forbiddenCategories', 'unavailableCategories',
];

function scanForForbiddenWord(obj, word) {
  const text = JSON.stringify(obj ?? '');
  return text.includes(word);
}

/**
 * @param {object} input
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validatePlannerInput(input) {
  const errors = [];
  if (!input || typeof input !== 'object') return { valid: false, errors: ['planner input must be an object'] };

  if (!isNonEmptyString(input.question)) errors.push('question is required and must be a non-empty string');

  if (!isReadingDomain(input.readingDomain)) {
    errors.push(`readingDomain must be 'goralHachol' or 'cards' (got ${JSON.stringify(input.readingDomain)})`);
  } else if (!isMethodForDomain(input.method, input.readingDomain)) {
    errors.push(`method "${input.method}" is not valid for readingDomain "${input.readingDomain}"`);
  }

  const intentValidation = validateIntentResult(input.intentResult);
  if (!intentValidation.valid) errors.push(...intentValidation.errors.map((e) => `intentResult: ${e}`));

  const strategyValidation = validateStrategyResult(input.readingStrategy);
  if (!strategyValidation.valid) errors.push(...strategyValidation.errors.map((e) => `readingStrategy: ${e}`));

  if (input.topicId !== undefined && input.topicId !== null && typeof input.topicId !== 'string') {
    errors.push('topicId must be a string if provided');
  }
  if (input.spreadId !== undefined && input.spreadId !== null && typeof input.spreadId !== 'string') {
    errors.push('spreadId must be a string if provided');
  }
  if (input.availableRuleCategories !== undefined && !isStringArray(input.availableRuleCategories)) {
    errors.push('availableRuleCategories must be an array of strings if provided');
  }

  for (const field of FORBIDDEN_PRIVACY_FIELDS) {
    if (input[field] !== undefined) errors.push(`forbidden field "${field}" must not be present in planner input`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * @param {object} result - output of buildReadingPlan() — either a full
 * ReadingPlan or a Stop Result ({ stopped: true, ... })
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validatePlannerResult(result) {
  const errors = [];
  if (!result || typeof result !== 'object') return { valid: false, errors: ['planner result must be an object'] };

  if (result.stopped === true) {
    return validateStopResult(result);
  }

  const requiredFields = [
    'planId', 'planVersion', 'readingDomain', 'method', 'spreadId', 'topicId', 'questionType',
    'primaryIntent', 'strategyId', 'goal',
    'primaryDecisionCategories', 'verificationCategories', 'conditionalCategories', 'supportingCategories',
    'advisorOnlyCategories', 'forbiddenCategories', 'unavailableCategories',
    'requiredInputs', 'missingInputs', 'evidenceRequirements', 'sourceEvidencePointers',
    'expectedClientSections', 'expectedAdvisorSections', 'hiddenClientSections',
    'executionOrder', 'verificationOrder', 'contradictionPolicy', 'uncertaintyPolicy', 'timingPolicy', 'spiritualPolicy',
    'plannerWarnings', 'plannerReason', 'confidence', 'requiresClarification', 'clarificationQuestion', 'needsOrenDecision',
  ];
  for (const field of requiredFields) {
    if (!(field in result)) errors.push(`${field} is required`);
  }

  if (!isNonEmptyString(result.planId)) errors.push('planId is required and must be a non-empty string');
  if (!isNonEmptyString(result.planVersion)) errors.push('planVersion is required and must be a non-empty string');
  if (!isReadingDomain(result.readingDomain)) errors.push(`readingDomain invalid (got ${JSON.stringify(result.readingDomain)})`);
  else if (!isMethodForDomain(result.method, result.readingDomain)) errors.push(`method "${result.method}" does not match readingDomain "${result.readingDomain}"`);
  if (!isPrimaryIntentValue(result.primaryIntent)) errors.push(`primaryIntent invalid (got ${JSON.stringify(result.primaryIntent)})`);
  if (!isNonEmptyString(result.strategyId)) errors.push('strategyId is required and must be a non-empty string');

  if (typeof result.confidence !== 'number' || result.confidence < 0 || result.confidence > 1) {
    errors.push('confidence must be a number between 0 and 1');
  }

  for (const field of CATEGORY_ARRAY_FIELDS) {
    if (!isStringArray(result[field])) errors.push(`${field} must be an array of strings`);
  }

  // executionOrder is non-empty for a full plan, UNLESS every category was
  // excluded by a conflict/missing-required-category warning (a degenerate
  // but legitimate plan — everything is blocked, and the warnings explain why).
  const hasExplainingWarning = Array.isArray(result.plannerWarnings)
    && result.plannerWarnings.some((w) => w && (w.warningType === 'conflictingConstraints' || w.warningType === 'missingRequiredCategory'));
  if (!Array.isArray(result.executionOrder)) {
    errors.push('executionOrder must be an array');
  } else if (result.executionOrder.length === 0 && !hasExplainingWarning) {
    errors.push('executionOrder must be a non-empty array in a full plan, unless explained by a conflictingConstraints/missingRequiredCategory warning');
  } else {
    for (const stage of result.executionOrder) {
      if (!EXECUTION_ORDER_DEFAULT.includes(stage)) errors.push(`executionOrder contains an unknown stage "${stage}"`);
      if (stage === 'forbidden' || stage === 'unavailable') errors.push(`executionOrder must never contain "${stage}"`);
    }
  }

  // advisorOnly must never be client-visible
  if (Array.isArray(result.advisorOnlyCategories) && Array.isArray(result.expectedClientSections)) {
    for (const cat of result.advisorOnlyCategories) {
      if (result.expectedClientSections.includes(cat)) errors.push(`"${cat}" is in advisorOnlyCategories and must not appear in expectedClientSections`);
    }
  }

  // no category appears in more than one of the 7 decision buckets
  if (CATEGORY_ARRAY_FIELDS.every((f) => Array.isArray(result[f]))) {
    const seen = new Map();
    for (const field of CATEGORY_ARRAY_FIELDS) {
      for (const cat of result[field]) {
        if (seen.has(cat)) errors.push(`"${cat}" appears in both ${seen.get(cat)} and ${field} — a category must belong to at most one decision bucket`);
        else seen.set(cat, field);
      }
    }
  }

  // no category is simultaneously required and forbidden
  if (Array.isArray(result.primaryDecisionCategories) && Array.isArray(result.forbiddenCategories)) {
    for (const cat of result.primaryDecisionCategories) {
      if (result.forbiddenCategories.includes(cat)) errors.push(`"${cat}" appears in both primaryDecisionCategories and forbiddenCategories`);
    }
  }

  if (!isContradictionPolicy(result.contradictionPolicy)) errors.push(`contradictionPolicy invalid (got ${JSON.stringify(result.contradictionPolicy)})`);
  if (!isUncertaintyPolicy(result.uncertaintyPolicy)) errors.push(`uncertaintyPolicy invalid (got ${JSON.stringify(result.uncertaintyPolicy)})`);

  if (typeof result.requiresClarification !== 'boolean') {
    errors.push('requiresClarification must be a boolean');
  } else if (result.requiresClarification && !isNonEmptyString(result.clarificationQuestion)) {
    errors.push('clarificationQuestion is required and must be non-empty when requiresClarification is true');
  }

  if (!isNonEmptyString(result.plannerReason)) errors.push('plannerReason is required and must be a non-empty string');

  if (!Array.isArray(result.plannerWarnings)) {
    errors.push('plannerWarnings must be an array');
  } else {
    let hasMissingEvidenceWarning = false;
    for (const warning of result.plannerWarnings) {
      if (!warning || typeof warning !== 'object') { errors.push('each plannerWarning must be an object'); continue; }
      if (!isWarningType(warning.warningType)) errors.push(`warningType invalid (got ${JSON.stringify(warning.warningType)})`);
      if (!isWarningSeverity(warning.severity)) errors.push(`severity invalid (got ${JSON.stringify(warning.severity)})`);
      if (!isNonEmptyString(warning.message)) errors.push('warning.message is required and must be non-empty');
      if (typeof warning.needsOrenDecision !== 'boolean') errors.push('warning.needsOrenDecision must be a boolean');
      if (warning.warningType === 'missingEvidence') hasMissingEvidenceWarning = true;
    }
    if (Array.isArray(result.missingInputs) && result.missingInputs.length > 0 && !hasMissingEvidenceWarning) {
      errors.push('missingInputs is non-empty but no missingEvidence plannerWarning was found');
    }
  }

  // "unavailable" (deprecated vocabulary) must never appear anywhere
  if (scanForForbiddenWord(result, 'notAvailable')) {
    errors.push('output must not contain the deprecated value "notAvailable" anywhere');
  }

  for (const field of FORBIDDEN_PRIVACY_FIELDS) {
    if (scanForForbiddenWord(result, `"${field}"`)) errors.push(`output must not contain forbidden privacy field "${field}"`);
  }

  return { valid: errors.length === 0, errors };
}

function validateStopResult(result) {
  const errors = [];
  if (result.stopComponent !== 'readingPlanner') errors.push(`stopComponent must be "readingPlanner" (got ${JSON.stringify(result.stopComponent)})`);
  if (!isNonEmptyString(result.stopReason)) errors.push('stopReason is required and must be a non-empty string');
  if (typeof result.recoverable !== 'boolean') errors.push('recoverable must be a boolean');
  if (result.requiresClarification !== true) errors.push('a Stop Result must always carry requiresClarification === true');
  if (!isNonEmptyString(result.clarificationQuestion)) errors.push('clarificationQuestion is required and must be non-empty in a Stop Result');
  if (typeof result.needsOrenDecision !== 'boolean') errors.push('needsOrenDecision must be a boolean');
  return { valid: errors.length === 0, errors };
}

export default { validatePlannerInput, validatePlannerResult };
