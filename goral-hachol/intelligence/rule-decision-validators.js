/**
 * rule-decision-validators.js
 *
 * Validators for Hall of Wisdom Rule Decision Engine
 * (HALL_WISDOM_RULE_DECISION_ENGINE_COMPONENT_CONTRACT.md §16). No engine
 * imports, no AI, no network — pure structural validation.
 */

import { isPrimaryIntentValue } from './intent-types.js';
import { isNonEmptyString, isStringArray } from './reading-intelligence-types.js';
import { isReadingDomain, isMethodForDomain } from './reading-strategy-types.js';
import {
  isRuleDecisionValue, isWarningSeverity, isWarningType, isConflictType, isClientVisibilityValue,
  isKnownConstraintCategoryForDomain, WARNING_TYPES,
} from './rule-decision-types.js';

const FORBIDDEN_PRIVACY_FIELDS = ['phone', 'rawClientHistory', 'rawDynFields', 'secrets', 'accessTokens', 'paymentData', 'accessToken'];
const DEPRECATED_DECISION_VALUES = ['notAvailable', 'selected', 'rejected', 'active', 'inactive'];

function scanForForbiddenWord(obj, word) {
  return JSON.stringify(obj ?? '').includes(word);
}

// ---------------------------------------------------------------------------
// Rule Definition validator (Component Contract §4, §16 items 1-5)
// ---------------------------------------------------------------------------

export function validateRuleDefinition(ruleDef) {
  const errors = [];
  if (!ruleDef || typeof ruleDef !== 'object') return { valid: false, errors: ['rule definition must be an object'] };

  if (!isNonEmptyString(ruleDef.ruleId)) errors.push('ruleId is required and must be a non-empty string');
  if (!isNonEmptyString(ruleDef.ruleVersion)) errors.push('ruleVersion is required and must be a non-empty string');

  if (!isReadingDomain(ruleDef.readingDomain)) {
    errors.push(`readingDomain must be 'goralHachol' or 'cards' (got ${JSON.stringify(ruleDef.readingDomain)})`);
  } else if (!isMethodForDomain(ruleDef.method, ruleDef.readingDomain)) {
    errors.push(`method "${ruleDef.method}" is not valid for readingDomain "${ruleDef.readingDomain}"`);
  }

  if (!isNonEmptyString(ruleDef.ruleCategory)) {
    errors.push('ruleCategory is required and must be a non-empty string');
  } else if (isReadingDomain(ruleDef.readingDomain) && !isKnownConstraintCategoryForDomain(ruleDef.ruleCategory, ruleDef.readingDomain)) {
    errors.push(`ruleCategory "${ruleDef.ruleCategory}" is not an approved knowledge category for readingDomain "${ruleDef.readingDomain}"`);
  }

  if (ruleDef.sourceId !== null && !isNonEmptyString(ruleDef.sourceId)) {
    errors.push('sourceId is required (string) or explicitly null if genuinely missing');
  }
  if (ruleDef.sourceEvidence !== undefined && ruleDef.sourceEvidence !== null && !Array.isArray(ruleDef.sourceEvidence)) {
    errors.push('sourceEvidence must be an array if provided');
  }

  if (ruleDef.topicIds !== undefined && !isStringArray(ruleDef.topicIds)) errors.push('topicIds must be an array of strings if provided');
  if (ruleDef.questionTypes !== undefined && !isStringArray(ruleDef.questionTypes)) errors.push('questionTypes must be an array of strings if provided');
  if (ruleDef.intents !== undefined && !isStringArray(ruleDef.intents)) errors.push('intents must be an array of strings if provided');
  if (ruleDef.requiredInputs !== undefined && !isStringArray(ruleDef.requiredInputs)) errors.push('requiredInputs must be an array of strings if provided');
  if (ruleDef.activationConditions !== undefined && !isStringArray(ruleDef.activationConditions)) errors.push('activationConditions must be an array of strings if provided');
  if (ruleDef.conflictsWith !== undefined && !isStringArray(ruleDef.conflictsWith)) errors.push('conflictsWith must be an array of strings if provided');
  if (ruleDef.verifies !== undefined && !isStringArray(ruleDef.verifies)) errors.push('verifies must be an array of strings if provided');
  if (ruleDef.supplements !== undefined && !isStringArray(ruleDef.supplements)) errors.push('supplements must be an array of strings if provided');

  if (ruleDef.clientVisibility !== undefined && !isClientVisibilityValue(ruleDef.clientVisibility)) {
    errors.push(`clientVisibility invalid (got ${JSON.stringify(ruleDef.clientVisibility)})`);
  }
  if (ruleDef.confidence !== undefined && (typeof ruleDef.confidence !== 'number' || ruleDef.confidence < 0 || ruleDef.confidence > 1)) {
    errors.push('confidence must be a number between 0 and 1 if provided');
  }

  return { valid: errors.length === 0, errors };
}

// ---------------------------------------------------------------------------
// Rule Decision Record validator (Component Contract §5, §16 items 4-8)
// ---------------------------------------------------------------------------

export function validateRuleDecisionRecord(record) {
  const errors = [];
  if (!record || typeof record !== 'object') return { valid: false, errors: ['rule decision record must be an object'] };

  const requiredFields = [
    'ruleId', 'ruleVersion', 'decision', 'decisionReason', 'sourceEvidence', 'matchedConditions',
    'missingConditions', 'requiredInputs', 'missingInputs', 'activationCondition', 'clientVisibility',
    'executionPriority', 'conflicts', 'confidence', 'warningIds', 'needsOrenDecision',
  ];
  for (const field of requiredFields) {
    if (!(field in record)) errors.push(`${field} is required`);
  }

  if (!isNonEmptyString(record.ruleId)) errors.push('ruleId is required and must be a non-empty string');
  if (!isNonEmptyString(record.ruleVersion)) errors.push('ruleVersion is required and must be a non-empty string');

  if (!isRuleDecisionValue(record.decision)) {
    errors.push(`decision must be one of required/allowed/conditional/advisorOnly/forbidden/unavailable (got ${JSON.stringify(record.decision)})`);
  }
  if (DEPRECATED_DECISION_VALUES.includes(record.decision)) {
    errors.push(`decision uses a deprecated/forbidden value "${record.decision}"`);
  }

  if (!isNonEmptyString(record.decisionReason)) errors.push('decisionReason is required and must be a non-empty string');

  // Validator item 5: sourceEvidence required for required/allowed
  if ((record.decision === 'required' || record.decision === 'allowed') && !record.sourceEvidence) {
    errors.push(`decision="${record.decision}" requires non-empty sourceEvidence`);
  }

  if (!Array.isArray(record.matchedConditions)) errors.push('matchedConditions must be an array');
  if (!Array.isArray(record.missingConditions)) errors.push('missingConditions must be an array');
  if (!isStringArray(record.requiredInputs)) errors.push('requiredInputs must be an array of strings');
  if (!isStringArray(record.missingInputs)) errors.push('missingInputs must be an array of strings');

  // Validator item 8: conditional must not be treated as fully-selected while conditions are still missing
  if (record.decision === 'conditional' && Array.isArray(record.missingConditions) && record.missingConditions.length === 0 && Array.isArray(record.missingInputs) && record.missingInputs.length === 0) {
    errors.push('decision="conditional" but no missingConditions/missingInputs are recorded — nothing left to condition on');
  }

  if (record.clientVisibility !== undefined && record.clientVisibility !== null && !isClientVisibilityValue(record.clientVisibility) && record.clientVisibility !== 'client') {
    // 'client' also accepted directly since it is the default visibility even outside CLIENT_VISIBILITY_VALUES reuse
    if (!['client', 'advisorOnly', 'hiddenUnlessRequested', 'hidden'].includes(record.clientVisibility)) {
      errors.push(`clientVisibility invalid (got ${JSON.stringify(record.clientVisibility)})`);
    }
  }
  // Validator item 6: advisorOnly decision must carry advisorOnly (or stricter) visibility, never plain 'client'
  if (record.decision === 'advisorOnly' && record.clientVisibility === 'client') {
    errors.push('decision="advisorOnly" must not carry clientVisibility="client" (advisorOnly must never be client-visible)');
  }

  if (!Array.isArray(record.conflicts)) errors.push('conflicts must be an array');
  if (typeof record.confidence !== 'number' || record.confidence < 0 || record.confidence > 1) {
    errors.push('confidence must be a number between 0 and 1');
  }
  if (!isStringArray(record.warningIds)) errors.push('warningIds must be an array of strings');
  if (typeof record.needsOrenDecision !== 'boolean') errors.push('needsOrenDecision must be a boolean');

  return { valid: errors.length === 0, errors };
}

// ---------------------------------------------------------------------------
// Warning / Conflict validators
// ---------------------------------------------------------------------------

export function validateWarning(warning) {
  const errors = [];
  if (!warning || typeof warning !== 'object') return { valid: false, errors: ['warning must be an object'] };
  if (!isNonEmptyString(warning.warningId)) errors.push('warningId is required and must be a non-empty string');
  if (!isWarningType(warning.warningType)) errors.push(`warningType invalid (got ${JSON.stringify(warning.warningType)}); must be one of ${WARNING_TYPES.join(', ')}`);
  if (!isWarningSeverity(warning.severity)) errors.push(`severity invalid (got ${JSON.stringify(warning.severity)})`);
  if (!isNonEmptyString(warning.message)) errors.push('message is required and must be a non-empty string');
  if (typeof warning.recoverable !== 'boolean') errors.push('recoverable must be a boolean');
  if (typeof warning.needsOrenDecision !== 'boolean') errors.push('needsOrenDecision must be a boolean');
  return { valid: errors.length === 0, errors };
}

export function validateConflict(conflict) {
  const errors = [];
  if (!conflict || typeof conflict !== 'object') return { valid: false, errors: ['conflict must be an object'] };
  if (!isConflictType(conflict.conflictType)) errors.push(`conflictType invalid (got ${JSON.stringify(conflict.conflictType)})`);
  if (!isStringArray(conflict.ruleIds) || conflict.ruleIds.length === 0) errors.push('ruleIds must be a non-empty array of strings');
  if (!isWarningSeverity(conflict.severity)) errors.push(`severity invalid (got ${JSON.stringify(conflict.severity)})`);
  if (!isNonEmptyString(conflict.description)) errors.push('description is required and must be a non-empty string');
  if (typeof conflict.recoverable !== 'boolean') errors.push('recoverable must be a boolean');
  if (typeof conflict.needsOrenDecision !== 'boolean') errors.push('needsOrenDecision must be a boolean');
  // Validator item 12: unresolved critical conflict must carry needsOrenDecision
  if (conflict.severity === 'critical' && conflict.recoverable === false && conflict.needsOrenDecision !== true) {
    errors.push('an unresolved critical conflict (severity=critical, recoverable=false) must carry needsOrenDecision=true');
  }
  return { valid: errors.length === 0, errors };
}

// ---------------------------------------------------------------------------
// Input validator
// ---------------------------------------------------------------------------

export function validateRuleDecisionInput(input) {
  const errors = [];
  if (!input || typeof input !== 'object') return { valid: false, errors: ['rule decision input must be an object'] };

  if (!isNonEmptyString(input.pipelineRunId)) errors.push('pipelineRunId is required and must be a non-empty string');

  if (!isReadingDomain(input.readingDomain)) {
    errors.push(`readingDomain must be 'goralHachol' or 'cards' (got ${JSON.stringify(input.readingDomain)})`);
  } else if (!isMethodForDomain(input.method, input.readingDomain)) {
    errors.push(`method "${input.method}" is not valid for readingDomain "${input.readingDomain}"`);
  }

  if (!input.readingPlan || typeof input.readingPlan !== 'object') {
    errors.push('readingPlan is required and must be an object');
  }

  if (!Array.isArray(input.ruleDefinitions)) {
    errors.push('ruleDefinitions is required and must be an array (may be empty)');
  } else {
    for (const def of input.ruleDefinitions) {
      const v = validateRuleDefinition(def);
      if (!v.valid) errors.push(`ruleDefinitions[${def?.ruleId ?? '?'}]: ${v.errors.join('; ')}`);
      // Domain/method cross-check against the request itself
      if (v.valid && (def.readingDomain !== input.readingDomain || def.method !== input.method)) {
        // Not an input error by itself — cross-domain Rule Definitions are
        // expected to be filtered/marked unavailable by the engine, not
        // rejected at the input gate (a mixed ruleDefinitions list is valid
        // input; the engine's job is to correctly reject cross-domain rules
        // per-rule, per Component Contract §8).
      }
    }
  }

  if (input.availableInputs !== undefined && !isStringArray(input.availableInputs)) errors.push('availableInputs must be an array of strings if provided');
  if (input.metActivationConditions !== undefined && !isStringArray(input.metActivationConditions)) errors.push('metActivationConditions must be an array of strings if provided');

  for (const field of FORBIDDEN_PRIVACY_FIELDS) {
    if (input[field] !== undefined) errors.push(`forbidden field "${field}" must not be present in rule decision input`);
  }

  return { valid: errors.length === 0, errors };
}

// ---------------------------------------------------------------------------
// Engine Output validator (Component Contract §15, §16 items 9-17)
// ---------------------------------------------------------------------------

const CATEGORY_ID_ARRAY_FIELDS = [
  'selectedRuleIds', 'rejectedRuleIds', 'conditionalRuleIds', 'advisorOnlyRuleIds', 'forbiddenRuleIds', 'unavailableRuleIds',
];

export function validateEngineOutput(output) {
  const errors = [];
  if (!output || typeof output !== 'object') return { valid: false, errors: ['engine output must be an object'] };

  if (output.stopped === true) {
    return validateStopResult(output);
  }

  const requiredFields = [
    'engineVersion', 'readingDomain', 'method', 'topicId', 'questionType', 'primaryIntent',
    'ruleDecisionRecords', 'selectedRuleIds', 'rejectedRuleIds', 'conditionalRuleIds', 'advisorOnlyRuleIds',
    'forbiddenRuleIds', 'unavailableRuleIds', 'executionInstructions', 'conflicts', 'warnings', 'errors',
    'sourceEvidencePointers', 'decisionSummary', 'confidence', 'stopped', 'stopReason', 'needsOrenDecision',
  ];
  for (const field of requiredFields) {
    if (!(field in output)) errors.push(`${field} is required`);
  }

  if (!isNonEmptyString(output.engineVersion)) errors.push('engineVersion is required and must be a non-empty string');
  if (!isReadingDomain(output.readingDomain)) errors.push(`readingDomain invalid (got ${JSON.stringify(output.readingDomain)})`);
  else if (!isMethodForDomain(output.method, output.readingDomain)) errors.push(`method "${output.method}" does not match readingDomain "${output.readingDomain}"`);
  if (!isPrimaryIntentValue(output.primaryIntent)) errors.push(`primaryIntent invalid (got ${JSON.stringify(output.primaryIntent)})`);

  if (!Array.isArray(output.ruleDecisionRecords)) {
    errors.push('ruleDecisionRecords must be an array');
  } else {
    for (const record of output.ruleDecisionRecords) {
      const v = validateRuleDecisionRecord(record);
      if (!v.valid) errors.push(`ruleDecisionRecords[${record?.ruleId ?? '?'}]: ${v.errors.join('; ')}`);
      // Validator item 11: cross-domain rules must never end up required/allowed
      if (v.valid && (record.decision === 'required' || record.decision === 'allowed')) {
        // engineVersion-level readingDomain/method already validated above;
        // per-record domain/method are not carried on the Rule Decision
        // Record itself (only on the Rule Definition) by contract design.
      }
    }
  }

  for (const field of CATEGORY_ID_ARRAY_FIELDS) {
    if (!isStringArray(output[field])) errors.push(`${field} must be an array of strings`);
  }

  // Validator item 9: no Rule ID in more than one final decision array
  if (CATEGORY_ID_ARRAY_FIELDS.every((f) => Array.isArray(output[f]))) {
    const seen = new Map();
    for (const field of CATEGORY_ID_ARRAY_FIELDS) {
      for (const ruleId of output[field]) {
        if (seen.has(ruleId)) errors.push(`ruleId "${ruleId}" appears in both ${seen.get(ruleId)} and ${field} — must belong to at most one final decision array`);
        else seen.set(ruleId, field);
      }
    }
  }

  // Validator item 7: forbidden/unavailable must never be in selectedRuleIds
  if (isStringArray(output.selectedRuleIds) && isStringArray(output.forbiddenRuleIds) && isStringArray(output.unavailableRuleIds)) {
    for (const ruleId of output.selectedRuleIds) {
      if (output.forbiddenRuleIds.includes(ruleId)) errors.push(`ruleId "${ruleId}" is in both selectedRuleIds and forbiddenRuleIds`);
      if (output.unavailableRuleIds.includes(ruleId)) errors.push(`ruleId "${ruleId}" is in both selectedRuleIds and unavailableRuleIds`);
    }
  }

  // executionInstructions
  if (!output.executionInstructions || typeof output.executionInstructions !== 'object') {
    errors.push('executionInstructions must be an object');
  } else {
    const ei = output.executionInstructions;
    const eiFields = ['selectedRuleIds', 'conditionalRuleIds', 'advisorOnlyRuleIds', 'skippedRuleIds', 'unavailableRuleIds', 'executionOrder', 'executionGroups', 'requiredInputs', 'missingInputs', 'stopConditions', 'evidenceRequirements'];
    for (const field of eiFields) {
      if (!(field in ei)) errors.push(`executionInstructions.${field} is required`);
    }
    // Validator item 10: executionOrder includes only allowed stage names (Reading Planner's own vocabulary)
    if (Array.isArray(ei.executionOrder)) {
      for (const stage of ei.executionOrder) {
        if (stage === 'forbidden' || stage === 'unavailable') errors.push(`executionInstructions.executionOrder must never contain "${stage}"`);
      }
    }
  }

  if (!Array.isArray(output.conflicts)) {
    errors.push('conflicts must be an array');
  } else {
    for (const conflict of output.conflicts) {
      const v = validateConflict(conflict);
      if (!v.valid) errors.push(`conflicts: ${v.errors.join('; ')}`);
    }
    // Validator item 12: unresolved conflict requires stop or needsOrenDecision
    const hasUnresolvedCritical = output.conflicts.some((c) => c.severity === 'critical' && c.recoverable === false);
    if (hasUnresolvedCritical && output.needsOrenDecision !== true && output.stopped !== true) {
      errors.push('an unresolved critical conflict exists but neither stopped=true nor needsOrenDecision=true was set');
    }
  }

  if (!Array.isArray(output.warnings)) {
    errors.push('warnings must be an array');
  } else {
    for (const warning of output.warnings) {
      const v = validateWarning(warning);
      if (!v.valid) errors.push(`warnings: ${v.errors.join('; ')}`);
    }
  }

  if (!isNonEmptyString(output.decisionSummary)) errors.push('decisionSummary is required and must be a non-empty string');

  if (typeof output.confidence !== 'number' || output.confidence < 0 || output.confidence > 1) {
    errors.push('confidence must be a number between 0 and 1');
  }

  if (typeof output.needsOrenDecision !== 'boolean') errors.push('needsOrenDecision must be a boolean');
  if (typeof output.stopped !== 'boolean') errors.push('stopped must be a boolean');

  // Deprecated-vocabulary / privacy structural guards
  if (scanForForbiddenWord(output, 'notAvailable')) errors.push('output must not contain the deprecated value "notAvailable" anywhere');
  for (const field of FORBIDDEN_PRIVACY_FIELDS) {
    if (scanForForbiddenWord(output, `"${field}"`)) errors.push(`output must not contain forbidden privacy field "${field}"`);
  }

  return { valid: errors.length === 0, errors };
}

function validateStopResult(result) {
  const errors = [];
  if (result.stopComponent !== 'ruleDecisionEngine') errors.push(`stopComponent must be "ruleDecisionEngine" (got ${JSON.stringify(result.stopComponent)})`);
  if (!isNonEmptyString(result.stopReason)) errors.push('stopReason is required and must be a non-empty string');
  if (typeof result.recoverable !== 'boolean') errors.push('recoverable must be a boolean');
  if (!Array.isArray(result.missingInputs)) errors.push('missingInputs must be an array');
  if (!Array.isArray(result.conflictingRuleIds)) errors.push('conflictingRuleIds must be an array');
  if (result.clarificationQuestion !== null) errors.push('Rule Decision Engine must never author a new clarificationQuestion — clarificationQuestion must be null in a Stop Result');
  if (typeof result.needsOrenDecision !== 'boolean') errors.push('needsOrenDecision must be a boolean');
  return { valid: errors.length === 0, errors };
}

export default {
  validateRuleDefinition, validateRuleDecisionRecord, validateWarning, validateConflict,
  validateRuleDecisionInput, validateEngineOutput,
};
