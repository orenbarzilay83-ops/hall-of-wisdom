#!/usr/bin/env node
/**
 * _test_hall_wisdom_rule_decision_engine.mjs
 *
 * Tests for Hall of Wisdom Core — Rule Decision Engine (fourth implemented
 * component, per HALL_WISDOM_RULE_DECISION_ENGINE_COMPONENT_CONTRACT.md).
 * No AI, no network, no engine calls — pure deterministic logic consuming
 * a Reading Plan + hand-constructed Rule Definitions (no real Rule
 * Definitions exist yet anywhere in the codebase).
 */

import { readFileSync } from 'node:fs';
import { analyzeIntent } from './goral-hachol/intelligence/intent-analyzer.js';
import { buildReadingStrategy } from './goral-hachol/intelligence/reading-strategy-builder.js';
import { buildReadingPlan } from './goral-hachol/intelligence/reading-planner.js';
import {
  runRuleDecisionEngine, validateRuleSet, decideRule, ENGINE_VERSION,
} from './goral-hachol/intelligence/rule-decision-engine.js';
import {
  validateRuleDefinition, validateRuleDecisionRecord, validateWarning, validateConflict,
  validateRuleDecisionInput, validateEngineOutput,
} from './goral-hachol/intelligence/rule-decision-validators.js';
import {
  RULE_DECISION_VALUES, WARNING_SEVERITY_VALUES, WARNING_TYPES, CONFLICT_TYPES,
  CLIENT_VISIBILITY_VALUES, DECISION_ORDER_STEPS, DECISION_PRECEDENCE_TIERS,
  RULE_ID_NAMESPACE_PREFIX, expectedRuleIdPrefix, isValidRuleIdNamespace,
} from './goral-hachol/intelligence/rule-decision-types.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed += 1;
  } else {
    failed += 1;
    console.error('FAIL:', message);
  }
}

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

function mkPlan(overrides = {}) {
  return {
    primaryDecisionCategories: [],
    verificationCategories: ['verification'],
    conditionalCategories: ['timing'],
    supportingCategories: ['characterNature'],
    advisorOnlyCategories: ['spiritual'],
    forbiddenCategories: ['dhamir'],
    unavailableCategories: ['thematicHouseMeaning'],
    executionOrder: ['primaryDecision', 'verification', 'supporting', 'advisorOnly'],
    stopped: false,
    ...overrides,
  };
}

function mkDef(overrides = {}) {
  return {
    ruleId: 'goral.kashf.r1',
    ruleVersion: '1.0',
    readingDomain: 'goralHachol',
    method: 'kashf',
    ruleCategory: 'characterNature',
    sourceId: 'kashf-p73',
    sourceEvidence: ['kashf p.73'],
    topicIds: [],
    questionTypes: [],
    intents: [],
    requiredInputs: [],
    activationConditions: [],
    conflictsWith: [],
    verifies: [],
    supplements: [],
    clientVisibility: 'client',
    confidence: 0.9,
    ...overrides,
  };
}

function mkInput(overrides = {}) {
  return {
    pipelineRunId: 'run-1',
    readingDomain: 'goralHachol',
    method: 'kashf',
    topicId: 'topic.x',
    questionType: 'yesNo',
    primaryIntent: 'outcomeCompletion',
    readingPlan: mkPlan(),
    ruleDefinitions: [],
    availableInputs: [],
    metActivationConditions: [],
    sourceEvidencePointers: [],
    ...overrides,
  };
}

function planFor(question, method, extra = {}) {
  const intentResult = analyzeIntent({ question, ...extra });
  const readingStrategy = buildReadingStrategy({ intentResult, method });
  const plannerInput = {
    question, readingDomain: 'goralHachol', method, questionType: readingStrategy.questionType,
    intentResult, readingStrategy,
  };
  return buildReadingPlan(plannerInput);
}

// ---------------------------------------------------------------------------
// Output Contract shape
// ---------------------------------------------------------------------------

const OUTPUT_CONTRACT_FIELDS = [
  'engineVersion', 'readingDomain', 'method', 'topicId', 'questionType', 'primaryIntent',
  'ruleDecisionRecords', 'selectedRuleIds', 'rejectedRuleIds', 'conditionalRuleIds', 'advisorOnlyRuleIds',
  'forbiddenRuleIds', 'unavailableRuleIds', 'executionInstructions', 'conflicts', 'warnings', 'errors',
  'sourceEvidencePointers', 'decisionSummary', 'confidence', 'stopped', 'stopReason', 'needsOrenDecision',
];

{
  const out = runRuleDecisionEngine(mkInput({ ruleDefinitions: [mkDef({ ruleCategory: 'characterNature' })] }));
  for (const field of OUTPUT_CONTRACT_FIELDS) {
    assert(field in out, `output contract includes field "${field}"`);
  }
  assert(Object.keys(out).length === OUTPUT_CONTRACT_FIELDS.length, `output has exactly ${OUTPUT_CONTRACT_FIELDS.length} fields, got ${Object.keys(out).length}: ${Object.keys(out).join(',')}`);
  assert(out.engineVersion === ENGINE_VERSION, 'engineVersion matches ENGINE_VERSION export');
  assert(!('ruleCategory' in out.ruleDecisionRecords[0]), 'ruleDecisionRecords[0] does not leak internal ruleCategory field');
  assert(!('_warnings' in out.ruleDecisionRecords[0]), 'ruleDecisionRecords[0] does not leak internal _warnings field');
  assert(!('excluded' in out.ruleDecisionRecords[0]), 'ruleDecisionRecords[0] does not leak internal excluded field');
}

// ---------------------------------------------------------------------------
// 1. Required rule (all six Rule Decision outcomes, part 1)
// ---------------------------------------------------------------------------

{
  const plan = mkPlan({ primaryDecisionCategories: ['outcomeRules'] });
  const def = mkDef({ ruleId: 'goral.kashf.required1', ruleCategory: 'outcomeRules' });
  const out = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: [def] }));
  assert(out.stopped === false, 'Required: engine does not stop');
  assert(out.ruleDecisionRecords.length === 1, 'Required: one decision record');
  assert(out.ruleDecisionRecords[0].decision === 'required', 'Required: decision=required');
  assert(out.selectedRuleIds.includes('goral.kashf.required1'), 'Required: rule in selectedRuleIds');
  assert(out.ruleDecisionRecords[0].sourceEvidence && out.ruleDecisionRecords[0].sourceEvidence.length > 0, 'Required: sourceEvidence present');
  assert(out.ruleDecisionRecords[0].clientVisibility === 'client', 'Required: clientVisibility=client by default');
  assert(out.ruleDecisionRecords[0].executionPriority === 1, 'Required: executionPriority=1');
  assert(validateEngineOutput(out).valid, `Required: output validates cleanly: ${validateEngineOutput(out).errors.join('; ')}`);
  assert(validateRuleDecisionRecord(out.ruleDecisionRecords[0]).valid, 'Required: record validates cleanly');
}

// ---------------------------------------------------------------------------
// 2. Allowed rule (supporting category, non-primary)
// ---------------------------------------------------------------------------

{
  const plan = mkPlan({ primaryDecisionCategories: ['outcomeRules'] });
  const primaryDef = mkDef({ ruleId: 'goral.kashf.primaryX', ruleCategory: 'outcomeRules' });
  const supportDef = mkDef({ ruleId: 'goral.kashf.allowed1', ruleCategory: 'characterNature' });
  const out = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: [primaryDef, supportDef] }));
  const rec = out.ruleDecisionRecords.find((r) => r.ruleId === 'goral.kashf.allowed1');
  assert(rec.decision === 'allowed', 'Allowed: decision=allowed for supporting-category rule');
  assert(out.selectedRuleIds.includes('goral.kashf.allowed1'), 'Allowed: rule in selectedRuleIds (required+allowed)');
  assert(out.executionInstructions.executionGroups.supporting.includes('goral.kashf.allowed1'), 'Allowed: rule lands in executionGroups.supporting');
  assert(validateEngineOutput(out).valid, 'Allowed: output validates cleanly');
}

// ---------------------------------------------------------------------------
// 3. Allowed rule (verification category split)
// ---------------------------------------------------------------------------

{
  const plan = mkPlan({ primaryDecisionCategories: ['outcomeRules'] });
  const primaryDef = mkDef({ ruleId: 'goral.kashf.primaryY', ruleCategory: 'outcomeRules' });
  const verifyDef = mkDef({ ruleId: 'goral.kashf.verify1', ruleCategory: 'verification' });
  const out = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: [primaryDef, verifyDef] }));
  const rec = out.ruleDecisionRecords.find((r) => r.ruleId === 'goral.kashf.verify1');
  assert(rec.decision === 'allowed', 'Verification: decision=allowed for verification-category rule');
  assert(out.executionInstructions.executionGroups.verification.includes('goral.kashf.verify1'), 'Verification: rule lands in executionGroups.verification (not supporting)');
  assert(!out.executionInstructions.executionGroups.supporting.includes('goral.kashf.verify1'), 'Verification: rule does NOT also land in executionGroups.supporting');
}

// ---------------------------------------------------------------------------
// 4. Conditional rule (missing activation condition)
// ---------------------------------------------------------------------------

{
  const plan = mkPlan({});
  const def = mkDef({ ruleId: 'goral.kashf.cond1', ruleCategory: 'timing', activationConditions: ['cond.timingAsked'] });
  const out = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: [def] }));
  const rec = out.ruleDecisionRecords[0];
  assert(rec.decision === 'conditional', 'Conditional: decision=conditional when activationCondition unmet');
  assert(rec.missingConditions.includes('cond.timingAsked'), 'Conditional: missingConditions lists the unmet condition');
  assert(out.conditionalRuleIds.includes('goral.kashf.cond1'), 'Conditional: rule in conditionalRuleIds');
  assert(!out.selectedRuleIds.includes('goral.kashf.cond1'), 'Conditional: rule NOT in selectedRuleIds');
  assert(validateRuleDecisionRecord(rec).valid, 'Conditional: record validates cleanly (has missingConditions to condition on)');
}

// 4b. Conditional rule becomes required once the activation condition is met
{
  const plan = mkPlan({ primaryDecisionCategories: ['timing'] });
  const def = mkDef({ ruleId: 'goral.kashf.cond2', ruleCategory: 'timing', activationConditions: ['cond.timingAsked'] });
  const out = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: [def], metActivationConditions: ['cond.timingAsked'] }));
  const rec = out.ruleDecisionRecords[0];
  assert(rec.decision === 'required', 'Conditional->Required: once condition is met and category is primary, decision=required');
  assert(rec.matchedConditions.includes('cond.timingAsked'), 'Conditional->Required: matchedConditions records the met condition');
}

// 4c. Conditional rule (missing required input, completable)
{
  const plan = mkPlan({});
  const def = mkDef({ ruleId: 'goral.kashf.cond3', ruleCategory: 'timing', requiredInputs: ['clientAge'] });
  const out = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: [def], availableInputs: [] }));
  const rec = out.ruleDecisionRecords[0];
  assert(rec.decision === 'conditional', 'Conditional (missing input): decision=conditional, completable');
  assert(rec.missingInputs.includes('clientAge'), 'Conditional (missing input): missingInputs lists clientAge');
}

// 4d. Missing required input, uncompletable (input's category itself unavailable)
{
  const plan = mkPlan({ unavailableCategories: ['thematicHouseMeaning', 'clientAge'] });
  const def = mkDef({ ruleId: 'goral.kashf.cond4', ruleCategory: 'timing', requiredInputs: ['clientAge'] });
  const out = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: [def] }));
  const rec = out.ruleDecisionRecords[0];
  assert(rec.decision === 'unavailable', 'Conditional (uncompletable input): decision=unavailable when input category itself is unavailable');
}

// ---------------------------------------------------------------------------
// 5. Advisor only
// ---------------------------------------------------------------------------

{
  const plan = mkPlan({});
  const def = mkDef({ ruleId: 'goral.kashf.advisor1', ruleCategory: 'spiritual' });
  const out = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: [def] }));
  const rec = out.ruleDecisionRecords[0];
  assert(rec.decision === 'advisorOnly', 'AdvisorOnly: decision=advisorOnly for advisorOnlyCategories');
  assert(rec.clientVisibility === 'advisorOnly', 'AdvisorOnly: clientVisibility=advisorOnly');
  assert(out.advisorOnlyRuleIds.includes('goral.kashf.advisor1'), 'AdvisorOnly: rule in advisorOnlyRuleIds');
  assert(!out.selectedRuleIds.includes('goral.kashf.advisor1'), 'AdvisorOnly: rule NOT in selectedRuleIds');
  assert(validateRuleDecisionRecord(rec).valid, 'AdvisorOnly: record must not carry clientVisibility=client (validator item 6)');
}

// 5b. advisorOnly takes priority over missing input/condition (explicit precedence design decision)
{
  const plan = mkPlan({});
  const def = mkDef({
    ruleId: 'goral.kashf.advisor2', ruleCategory: 'spiritual',
    requiredInputs: ['someMissingInput'], activationConditions: ['some.unmet.condition'],
  });
  const out = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: [def] }));
  const rec = out.ruleDecisionRecords[0];
  assert(rec.decision === 'advisorOnly', 'AdvisorOnly precedence: stays advisorOnly even with missing inputs/conditions (tier 4 beats tiers 5-6)');
}

// 5c. clientVisibility=advisorOnly on the Rule Definition itself also forces advisorOnly, even outside an advisorOnlyCategory
{
  const plan = mkPlan({});
  const def = mkDef({ ruleId: 'goral.kashf.advisor3', ruleCategory: 'characterNature', clientVisibility: 'advisorOnly' });
  const out = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: [def] }));
  assert(out.ruleDecisionRecords[0].decision === 'advisorOnly', 'AdvisorOnly via clientVisibility field: decision=advisorOnly even for a non-advisorOnly category');
}

// ---------------------------------------------------------------------------
// 6. Forbidden rules
// ---------------------------------------------------------------------------

{
  const plan = mkPlan({});
  const def = mkDef({ ruleId: 'goral.kashf.forbidden1', ruleCategory: 'dhamir' });
  const out = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: [def] }));
  const rec = out.ruleDecisionRecords[0];
  assert(rec.decision === 'forbidden', 'Forbidden: decision=forbidden for forbiddenCategories');
  assert(out.forbiddenRuleIds.includes('goral.kashf.forbidden1'), 'Forbidden: rule in forbiddenRuleIds');
  assert(!out.selectedRuleIds.includes('goral.kashf.forbidden1'), 'Forbidden: rule NOT in selectedRuleIds');
  assert(!out.executionInstructions.executionOrder.includes('forbidden'), 'Forbidden: "forbidden" never appears in executionOrder vocabulary');
  const warn = out.warnings.find((w) => w.ruleId === 'goral.kashf.forbidden1');
  assert(warn && warn.warningType === 'forbiddenRuleRequested', 'Forbidden: forbiddenRuleRequested warning raised');
}

// ---------------------------------------------------------------------------
// 7. Missing source evidence -> unavailable
// ---------------------------------------------------------------------------

{
  const plan = mkPlan({});
  const def = mkDef({ ruleId: 'goral.kashf.nosrc1', sourceEvidence: [] });
  const out = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: [def] }));
  const rec = out.ruleDecisionRecords[0];
  assert(rec.decision === 'unavailable', 'Missing evidence: decision=unavailable when sourceEvidence is empty');
  const warn = out.warnings.find((w) => w.ruleId === 'goral.kashf.nosrc1');
  assert(warn && warn.warningType === 'missingSourceEvidence', 'Missing evidence: missingSourceEvidence warning raised');
  assert(warn.severity === 'error', 'Missing evidence: warning severity=error');
}

// 7b. sourceId null but sourceEvidence present is still missing (sourceId required for hasSourceEvidence)
{
  const plan = mkPlan({});
  const def = mkDef({ ruleId: 'goral.kashf.nosrc2', sourceId: null, sourceEvidence: ['some text'] });
  const out = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: [def] }));
  assert(out.ruleDecisionRecords[0].decision === 'unavailable', 'Missing evidence (null sourceId): decision=unavailable');
}

// 7c. Source Fidelity — required/allowed decisions always carry non-empty sourceEvidence (Validator item 5)
{
  const plan = mkPlan({ primaryDecisionCategories: ['outcomeRules'] });
  const def = mkDef({ ruleId: 'goral.kashf.srcfid1', ruleCategory: 'outcomeRules', sourceEvidence: ['kashf p.90'] });
  const out = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: [def] }));
  const rec = out.ruleDecisionRecords[0];
  assert(rec.decision === 'required' && Array.isArray(rec.sourceEvidence) && rec.sourceEvidence.length > 0, 'Source Fidelity: required decision carries non-empty sourceEvidence');
}

// ---------------------------------------------------------------------------
// 8. Unavailable — category not part of Reading Plan at all
// ---------------------------------------------------------------------------

{
  const plan = mkPlan({});
  const def = mkDef({ ruleId: 'goral.kashf.noplan1', ruleCategory: 'unrelatedOutcomeRules' });
  const out = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: [def] }));
  assert(out.ruleDecisionRecords[0].decision === 'unavailable', 'Not-in-plan: decision=unavailable when category is not part of the Reading Plan at all');
}

// 8b. Unavailable — category explicitly marked unavailable in plan
{
  const plan = mkPlan({});
  const def = mkDef({ ruleId: 'goral.kashf.planunavail1', ruleCategory: 'thematicHouseMeaning' });
  const out = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: [def] }));
  assert(out.ruleDecisionRecords[0].decision === 'unavailable', 'Plan-unavailable: decision=unavailable for a category explicitly marked unavailable');
}

// 8c. Unavailable — topicId mismatch (supporting category, so no primary-decision stop is triggered)
{
  const plan = mkPlan({});
  const def = mkDef({ ruleId: 'goral.kashf.topicmismatch1', ruleCategory: 'characterNature', topicIds: ['topic.other'] });
  const out = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: [def], topicId: 'topic.x' }));
  assert(out.ruleDecisionRecords[0].decision === 'unavailable', 'Not-applicable: decision=unavailable on topicId mismatch');
}

// 8d. Unavailable — questionType mismatch
{
  const plan = mkPlan({});
  const def = mkDef({ ruleId: 'goral.kashf.qtmismatch1', ruleCategory: 'characterNature', questionTypes: ['spiritual'] });
  const out = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: [def], questionType: 'yesNo' }));
  assert(out.ruleDecisionRecords[0].decision === 'unavailable', 'Not-applicable: decision=unavailable on questionType mismatch');
}

// 8e. Unavailable — intent mismatch
{
  const plan = mkPlan({});
  const def = mkDef({ ruleId: 'goral.kashf.intentmismatch1', ruleCategory: 'characterNature', intents: ['timingRequest'] });
  const out = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: [def], primaryIntent: 'outcomeCompletion' }));
  assert(out.ruleDecisionRecords[0].decision === 'unavailable', 'Not-applicable: decision=unavailable on primaryIntent mismatch');
}

// ---------------------------------------------------------------------------
// 9. Domain separation
// ---------------------------------------------------------------------------

{
  const plan = mkPlan({});
  const cardsDef = mkDef({ ruleId: 'cards.cartomancy.d1', readingDomain: 'cards', method: 'cartomancy', ruleCategory: 'relationshipRelevantRules' });
  const out = runRuleDecisionEngine(mkInput({ readingDomain: 'goralHachol', method: 'kashf', readingPlan: plan, ruleDefinitions: [cardsDef] }));
  assert(out.ruleDecisionRecords[0].decision === 'unavailable', 'Domain separation: cards rule inside a goralHachol context -> unavailable');
  const warn = out.warnings.find((w) => w.ruleId === 'cards.cartomancy.d1');
  assert(warn && warn.warningType === 'crossDomainRule', 'Domain separation: crossDomainRule warning raised');
}

{
  const plan = mkPlan({ primaryDecisionCategories: ['relationshipRelevantRules'] });
  const cardsDef = mkDef({ ruleId: 'cards.cartomancy.d2', readingDomain: 'cards', method: 'cartomancy', ruleCategory: 'relationshipRelevantRules', sourceId: 'cartomancy-src', sourceEvidence: ['spread evidence'] });
  const out = runRuleDecisionEngine(mkInput({ readingDomain: 'cards', method: 'cartomancy', readingPlan: plan, ruleDefinitions: [cardsDef], primaryIntent: 'compatibility', questionType: 'openEnded' }));
  assert(out.ruleDecisionRecords[0].decision === 'required', 'Domain separation: a cards rule inside a matching cards context correctly becomes required');
}

// ---------------------------------------------------------------------------
// 10. Method separation (kashf vs hawi, both goralHachol)
// ---------------------------------------------------------------------------

{
  const plan = mkPlan({});
  const hawiDef = mkDef({ ruleId: 'goral.hawi.m1', readingDomain: 'goralHachol', method: 'hawi', ruleCategory: 'outcomeRules' });
  const out = runRuleDecisionEngine(mkInput({ readingDomain: 'goralHachol', method: 'kashf', readingPlan: plan, ruleDefinitions: [hawiDef] }));
  assert(out.ruleDecisionRecords[0].decision === 'unavailable', 'Method separation: hawi rule inside a kashf context -> unavailable (same domain, different method)');
}

{
  const plan = mkPlan({ primaryDecisionCategories: ['outcomeRules'] });
  const hawiDef = mkDef({ ruleId: 'goral.hawi.m2', readingDomain: 'goralHachol', method: 'hawi', ruleCategory: 'outcomeRules' });
  const out = runRuleDecisionEngine(mkInput({ readingDomain: 'goralHachol', method: 'hawi', readingPlan: plan, ruleDefinitions: [hawiDef] }));
  assert(out.ruleDecisionRecords[0].decision === 'required', 'Method separation: hawi rule inside a matching hawi context correctly becomes required');
}

// ---------------------------------------------------------------------------
// 11. Namespacing helpers
// ---------------------------------------------------------------------------

assert(expectedRuleIdPrefix('goralHachol', 'kashf') === 'goral.kashf.', 'Namespacing: goralHachol/kashf prefix');
assert(expectedRuleIdPrefix('goralHachol', 'hawi') === 'goral.hawi.', 'Namespacing: goralHachol/hawi prefix');
assert(expectedRuleIdPrefix('cards', 'cartomancy') === 'cards.cartomancy.', 'Namespacing: cards/cartomancy prefix');
assert(expectedRuleIdPrefix('cards', 'kashf') === null, 'Namespacing: mismatched domain/method returns null');
assert(isValidRuleIdNamespace('goral.kashf.foo', 'goralHachol', 'kashf') === true, 'Namespacing: valid kashf ruleId passes');
assert(isValidRuleIdNamespace('goral.hawi.foo', 'goralHachol', 'kashf') === false, 'Namespacing: hawi ruleId fails kashf namespace check');
assert(isValidRuleIdNamespace('cards.cartomancy.foo', 'cards', 'cartomancy') === true, 'Namespacing: valid cards ruleId passes');

// ---------------------------------------------------------------------------
// 12. Conflicts (Rule Set Validation)
// ---------------------------------------------------------------------------

// 12a. Direct contradiction (conflictsWith, both active) -> critical, stop
{
  const plan = mkPlan({});
  const d1 = mkDef({ ruleId: 'goral.kashf.confA', ruleCategory: 'characterNature', conflictsWith: ['goral.kashf.confB'] });
  const d2 = mkDef({ ruleId: 'goral.kashf.confB', ruleCategory: 'characterNature', conflictsWith: ['goral.kashf.confA'] });
  const out = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: [d1, d2] }));
  assert(out.stopped === true, 'Conflict: direct contradiction between two active rules stops the engine');
  assert(out.stopReason.includes('conflict') || out.stopReason.includes('Conflict'), 'Conflict: stopReason mentions conflict');
  assert(out.needsOrenDecision === true, 'Conflict: needsOrenDecision=true on stop');
  assert(out.clarificationQuestion === null || !('clarificationQuestion' in out), 'Conflict: Rule Decision Engine never authors a clarificationQuestion on stop');
  assert(out.conflictingRuleIds.includes('goral.kashf.confA') && out.conflictingRuleIds.includes('goral.kashf.confB'), 'Conflict: both ruleIds listed in conflictingRuleIds');
  assert(validateEngineOutput(out).valid, `Conflict stop: output validates cleanly: ${validateEngineOutput(out).errors.join('; ')}`);
}

// 12b. Missing companion (verifies/supplements target not active) -> warning, not stop
{
  const plan = mkPlan({ primaryDecisionCategories: ['outcomeRules'] });
  const d1 = mkDef({ ruleId: 'goral.kashf.needsCompanion', ruleCategory: 'outcomeRules', verifies: ['goral.kashf.companionMissing'] });
  const out = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: [d1] }));
  assert(out.stopped === false, 'Missing companion: engine does not stop (warning only)');
  const warn = out.warnings.find((w) => w.warningType === 'noVerificationPath');
  assert(!!warn, 'Missing companion: noVerificationPath warning raised');
}

// 12c. Invalid combination — conditional rule depends on a condition-named-rule that is forbidden
{
  const plan = mkPlan({});
  const forbiddenDef = mkDef({ ruleId: 'goral.kashf.blocker1', ruleCategory: 'dhamir' });
  const conditionalDef = mkDef({ ruleId: 'goral.kashf.dependsOnBlocked', ruleCategory: 'timing', activationConditions: ['goral.kashf.blocker1'] });
  const out = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: [forbiddenDef, conditionalDef] }));
  assert(out.stopped === false, 'Invalid combination: reported as a recoverable (non-critical) conflict, not an unresolved-critical stop');
  const rec = out.ruleDecisionRecords.find((r) => r.ruleId === 'goral.kashf.dependsOnBlocked');
  assert(rec.conflicts.includes('applicabilityConflict'), 'Invalid combination: applicabilityConflict attached to the dependent rule record');
  assert(out.conflicts.some((c) => c.conflictType === 'applicabilityConflict'), 'Invalid combination: applicabilityConflict present in output.conflicts');
}

// 12d. Duplicate execution — same ruleId appears twice in ruleDefinitions
{
  const plan = mkPlan({ primaryDecisionCategories: ['outcomeRules'] });
  const d1 = mkDef({ ruleId: 'goral.kashf.dupe1', ruleCategory: 'outcomeRules' });
  const d2 = mkDef({ ruleId: 'goral.kashf.dupe1', ruleCategory: 'outcomeRules' });
  const out = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: [d1, d2] }));
  assert(out.stopped === true, 'Duplicate prevention: duplicate ruleId across Rule Definitions stops the engine');
  assert(out.stopReason.toLowerCase().includes('conflict'), 'Duplicate prevention: stopReason references conflict');
}

// 12e. validateRuleSet directly — duplicate detection
{
  const d = mkDef({ ruleId: 'goral.kashf.dupe2' });
  const records = [
    { ruleId: 'goral.kashf.dupe2', ruleVersion: '1.0', decision: 'required', excluded: false, missingConditions: [] },
    { ruleId: 'goral.kashf.dupe2', ruleVersion: '1.0', decision: 'required', excluded: false, missingConditions: [] },
  ];
  const byId = new Map([[d.ruleId, d]]);
  const result = validateRuleSet(records, byId);
  assert(result.conflicts.length === 1, 'validateRuleSet: exactly one duplicate conflict detected');
  assert(result.conflicts[0].conflictType === 'executionOrderConflict', 'validateRuleSet: duplicate reported as executionOrderConflict');
  assert(result.stopRequired === true, 'validateRuleSet: stopRequired=true for unresolved critical conflict');
}

// 12f. validateRuleSet directly — mutual exclusion
{
  const dA = mkDef({ ruleId: 'goral.kashf.mutexA', conflictsWith: ['goral.kashf.mutexB'] });
  const dB = mkDef({ ruleId: 'goral.kashf.mutexB', conflictsWith: ['goral.kashf.mutexA'] });
  const records = [
    { ruleId: 'goral.kashf.mutexA', ruleVersion: '1.0', decision: 'allowed', excluded: false, missingConditions: [] },
    { ruleId: 'goral.kashf.mutexB', ruleVersion: '1.0', decision: 'allowed', excluded: false, missingConditions: [] },
  ];
  const byId = new Map([[dA.ruleId, dA], [dB.ruleId, dB]]);
  const result = validateRuleSet(records, byId);
  assert(result.conflicts.some((c) => c.conflictType === 'directContradiction'), 'validateRuleSet: mutual exclusion reported as directContradiction');
}

// 12g. validateRuleSet directly — no conflicts for a clean, non-overlapping set
{
  const dA = mkDef({ ruleId: 'goral.kashf.clean1' });
  const dB = mkDef({ ruleId: 'goral.kashf.clean2' });
  const records = [
    { ruleId: 'goral.kashf.clean1', ruleVersion: '1.0', decision: 'required', excluded: false, missingConditions: [] },
    { ruleId: 'goral.kashf.clean2', ruleVersion: '1.0', decision: 'allowed', excluded: false, missingConditions: [] },
  ];
  const byId = new Map([[dA.ruleId, dA], [dB.ruleId, dB]]);
  const result = validateRuleSet(records, byId);
  assert(result.conflicts.length === 0, 'validateRuleSet: clean set produces zero conflicts');
  assert(result.stopRequired === false, 'validateRuleSet: clean set does not require stop');
}

// 12h. validateRuleSet never adds/removes/mutates records (read-only contract)
{
  const dA = mkDef({ ruleId: 'goral.kashf.readonly1' });
  const records = [{ ruleId: 'goral.kashf.readonly1', ruleVersion: '1.0', decision: 'required', excluded: false, missingConditions: [] }];
  const recordsCopy = JSON.parse(JSON.stringify(records));
  validateRuleSet(records, new Map([[dA.ruleId, dA]]));
  assert(JSON.stringify(records) === JSON.stringify(recordsCopy), 'validateRuleSet: never mutates the input records array');
}

// ---------------------------------------------------------------------------
// 13. Stop behavior
// ---------------------------------------------------------------------------

// 13a. readingPlan.stopped forwards without deciding
{
  const out = runRuleDecisionEngine(mkInput({ readingPlan: { stopped: true }, ruleDefinitions: [mkDef({})] }));
  assert(out.stopped === true, 'Stop forwarding: readingPlan.stopped=true forwards a stop');
  assert(out.stopComponent === 'ruleDecisionEngine', 'Stop forwarding: stopComponent=ruleDecisionEngine');
  assert(out.clarificationQuestion === null, 'Stop forwarding: clarificationQuestion is null (never authored)');
  assert(out.needsOrenDecision === true, 'Stop forwarding: needsOrenDecision=true');
  assert(validateEngineOutput(out).valid, 'Stop forwarding: stop result validates cleanly');
}

// 13b. Empty ruleDefinitions but plan requires a primary decision -> stop
{
  const plan = mkPlan({ primaryDecisionCategories: ['outcomeRules'] });
  const out = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: [] }));
  assert(out.stopped === true, 'Stop (no rules, primary required): engine stops');
  assert(out.stopReason.toLowerCase().includes('no rule definitions'), 'Stop (no rules, primary required): stopReason explains why');
}

// 13c. Empty ruleDefinitions and plan does not require a primary decision -> no stop, empty output
{
  const plan = mkPlan({ primaryDecisionCategories: [] });
  const out = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: [] }));
  assert(out.stopped === false, 'No stop (no rules, no primary required): engine proceeds');
  assert(out.ruleDecisionRecords.length === 0, 'No stop (no rules): zero records');
}

// 13d. noPrimaryDecisionPath — rules exist but none reach required, plan needs a primary decision
{
  const plan = mkPlan({ primaryDecisionCategories: ['outcomeRules'] });
  const def = mkDef({ ruleId: 'goral.kashf.noprimary1', ruleCategory: 'characterNature' }); // not outcomeRules
  const out = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: [def] }));
  assert(out.stopped === true, 'noPrimaryDecisionPath: stops when plan requires a primary decision but none is reached');
  assert(out.stopReason.toLowerCase().includes('primary decision'), 'noPrimaryDecisionPath: stopReason mentions primary decision');
}

// 13e. Structurally invalid Rule Definition -> excluded, never a full record
{
  const plan = mkPlan({});
  const def = mkDef({ ruleId: 'goral.kashf.badcat1', ruleCategory: 'totallyMadeUpCategory' });
  const out = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: [def] }));
  assert(out.ruleDecisionRecords.length === 0, 'Structural exclusion: invalid Rule Definition produces zero decision records');
  assert(out.rejectedRuleIds.includes('goral.kashf.badcat1'), 'Structural exclusion: rule appears in rejectedRuleIds');
  assert(validateEngineOutput(out).valid, 'Structural exclusion: output still validates cleanly');
}

{
  const plan = mkPlan({});
  const def = mkDef({ ruleId: '', ruleCategory: 'characterNature' });
  const out = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: [def] }));
  assert(out.ruleDecisionRecords.length === 0, 'Structural exclusion (empty ruleId): zero decision records');
  assert(out.rejectedRuleIds.length === 0, 'Structural exclusion (empty ruleId): not added to rejectedRuleIds (filter(Boolean))');
}

// ---------------------------------------------------------------------------
// 14. Cross-domain rejection (repeated, explicit per user requirement)
// ---------------------------------------------------------------------------

{
  const plan = mkPlan({});
  const wrongDomainDef = mkDef({ ruleId: 'cards.cartomancy.wrong1', readingDomain: 'cards', method: 'cartomancy', ruleCategory: 'relationshipRelevantRules' });
  const out = runRuleDecisionEngine(mkInput({ readingDomain: 'goralHachol', method: 'hawi', readingPlan: plan, ruleDefinitions: [wrongDomainDef] }));
  assert(out.ruleDecisionRecords[0].decision === 'unavailable', 'Cross-domain rejection: cards rule never becomes required/allowed inside a goralHachol/hawi context');
  assert(!out.selectedRuleIds.includes('cards.cartomancy.wrong1'), 'Cross-domain rejection: never lands in selectedRuleIds');
}

// ---------------------------------------------------------------------------
// 15. No Rule ID in more than one final decision array (partition-by-construction)
// ---------------------------------------------------------------------------

{
  const plan = mkPlan({ primaryDecisionCategories: ['outcomeRules'] });
  const defs = [
    mkDef({ ruleId: 'goral.kashf.partA', ruleCategory: 'outcomeRules' }),
    mkDef({ ruleId: 'goral.kashf.partB', ruleCategory: 'characterNature' }),
    mkDef({ ruleId: 'goral.kashf.partC', ruleCategory: 'timing', activationConditions: ['cond.unmet'] }),
    mkDef({ ruleId: 'goral.kashf.partD', ruleCategory: 'spiritual' }),
    mkDef({ ruleId: 'goral.kashf.partE', ruleCategory: 'dhamir' }),
    mkDef({ ruleId: 'goral.kashf.partF', ruleCategory: 'unrelatedOutcomeRules' }),
  ];
  const out = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: defs }));
  const allIds = [
    ...out.selectedRuleIds, ...out.rejectedRuleIds, ...out.conditionalRuleIds,
    ...out.advisorOnlyRuleIds, ...out.forbiddenRuleIds, ...out.unavailableRuleIds,
  ];
  const uniqueIds = new Set(allIds);
  assert(allIds.length === uniqueIds.size, 'Partition: no ruleId appears in more than one final decision array');
  assert(validateEngineOutput(out).valid, `Partition: full mixed-outcome output validates cleanly: ${validateEngineOutput(out).errors.join('; ')}`);
}

// ---------------------------------------------------------------------------
// 16. Integration — real Reading Planner output feeding the Rule Decision Engine
// ---------------------------------------------------------------------------

{
  const plan = planFor('האם העסק החדש יצליח?', 'hawi');
  const def = mkDef({
    ruleId: 'goral.hawi.integration1', readingDomain: 'goralHachol', method: 'hawi', ruleCategory: 'outcomeRules',
  });
  const out = runRuleDecisionEngine({
    pipelineRunId: 'run-int-1', readingDomain: 'goralHachol', method: 'hawi',
    topicId: plan.topicId, questionType: plan.questionType, primaryIntent: plan.primaryIntent,
    readingPlan: plan, ruleDefinitions: [def], availableInputs: [], metActivationConditions: [], sourceEvidencePointers: [],
  });
  assert(validateRuleDecisionInput({
    pipelineRunId: 'run-int-1', readingDomain: 'goralHachol', method: 'hawi',
    topicId: plan.topicId, questionType: plan.questionType, primaryIntent: plan.primaryIntent,
    readingPlan: plan, ruleDefinitions: [def], availableInputs: [], metActivationConditions: [],
  }).valid, 'Integration: real Reading Plan produces a valid Rule Decision input');
  assert(out.stopped === false, 'Integration: engine runs to completion against a real Reading Plan');
  assert(out.ruleDecisionRecords[0].decision === 'required', 'Integration: outcomeRules rule becomes required, matching real plan.primaryDecisionCategories');
  assert(validateEngineOutput(out).valid, 'Integration: output validates cleanly against a real Reading Plan');
}

{
  const plan = planFor('מה הוא חושב עליי?', 'kashf');
  const def = mkDef({ ruleId: 'goral.kashf.integration2', ruleCategory: 'dhamir' });
  const primaryDef = mkDef({ ruleId: 'goral.kashf.integration2primary', ruleCategory: 'hiddenThoughtRules' });
  const out = runRuleDecisionEngine({
    pipelineRunId: 'run-int-2', readingDomain: 'goralHachol', method: 'kashf',
    topicId: plan.topicId, questionType: plan.questionType, primaryIntent: plan.primaryIntent,
    readingPlan: plan, ruleDefinitions: [def, primaryDef], availableInputs: [], metActivationConditions: [], sourceEvidencePointers: [],
  });
  assert(out.ruleDecisionRecords[0].decision === 'advisorOnly', 'Integration: dhamir rule becomes advisorOnly against a real Hidden Thought plan (dhamir is advisorOnlyCategories there)');
  assert(!out.selectedRuleIds.includes('goral.kashf.integration2'), 'Integration: dhamir rule never leaks into selectedRuleIds for Hidden Thought');
}

// ---------------------------------------------------------------------------
// 17. Validators — direct unit coverage
// ---------------------------------------------------------------------------

{
  const v = validateRuleDefinition(mkDef({}));
  assert(v.valid, `validateRuleDefinition: a well-formed def is valid: ${v.errors.join('; ')}`);
}
{
  const v = validateRuleDefinition({});
  assert(!v.valid, 'validateRuleDefinition: an empty object is invalid');
  assert(v.errors.length > 0, 'validateRuleDefinition: empty object produces errors');
}
{
  const v = validateRuleDefinition(mkDef({ readingDomain: 'notARealDomain' }));
  assert(!v.valid, 'validateRuleDefinition: invalid readingDomain rejected');
}
{
  const v = validateRuleDefinition(mkDef({ readingDomain: 'cards', method: 'kashf' }));
  assert(!v.valid, 'validateRuleDefinition: method not valid for readingDomain rejected');
}
{
  const v = validateRuleDefinition(mkDef({ sourceId: 123 }));
  assert(!v.valid, 'validateRuleDefinition: non-string non-null sourceId rejected');
}
{
  const v = validateRuleDefinition(mkDef({ sourceId: null, sourceEvidence: [] }));
  assert(v.valid, 'validateRuleDefinition: sourceId=null is explicitly allowed (genuinely-missing source)');
}
{
  const v = validateRuleDefinition(mkDef({ confidence: 1.5 }));
  assert(!v.valid, 'validateRuleDefinition: confidence out of [0,1] range rejected');
}
{
  const v = validateRuleDefinition(mkDef({ clientVisibility: 'notARealVisibility' }));
  assert(!v.valid, 'validateRuleDefinition: invalid clientVisibility rejected');
}

{
  for (const value of DEPRECATED_DECISION_VALUES_TEST()) {
    const record = validRecordTemplate({ decision: value });
    const v = validateRuleDecisionRecord(record);
    assert(!v.valid, `validateRuleDecisionRecord: deprecated decision value "${value}" is rejected`);
  }
}

function DEPRECATED_DECISION_VALUES_TEST() {
  return ['notAvailable', 'selected', 'rejected', 'active', 'inactive'];
}

function validRecordTemplate(overrides = {}) {
  return {
    ruleId: 'goral.kashf.x', ruleVersion: '1.0', decision: 'allowed', decisionReason: 'because',
    sourceEvidence: ['ev'], matchedConditions: [], missingConditions: [], requiredInputs: [], missingInputs: [],
    activationCondition: null, clientVisibility: 'client', executionPriority: 2, conflicts: [],
    confidence: 0.5, warningIds: [], needsOrenDecision: false,
    ...overrides,
  };
}

{
  const v = validateRuleDecisionRecord(validRecordTemplate({ decision: 'required', sourceEvidence: null }));
  assert(!v.valid, 'validateRuleDecisionRecord: decision=required without sourceEvidence is invalid');
}
{
  const v = validateRuleDecisionRecord(validRecordTemplate({ decision: 'allowed', sourceEvidence: null }));
  assert(!v.valid, 'validateRuleDecisionRecord: decision=allowed without sourceEvidence is invalid');
}
{
  const v = validateRuleDecisionRecord(validRecordTemplate({ decision: 'forbidden', sourceEvidence: null }));
  assert(v.valid, 'validateRuleDecisionRecord: decision=forbidden without sourceEvidence is still valid (evidence not required to forbid)');
}
{
  const v = validateRuleDecisionRecord(validRecordTemplate({ decision: 'conditional', missingConditions: [], missingInputs: [] }));
  assert(!v.valid, 'validateRuleDecisionRecord: decision=conditional with nothing left to condition on is invalid');
}
{
  const v = validateRuleDecisionRecord(validRecordTemplate({ decision: 'conditional', missingConditions: ['cond.x'], missingInputs: [] }));
  assert(v.valid, 'validateRuleDecisionRecord: decision=conditional with a real missingCondition is valid');
}
{
  const v = validateRuleDecisionRecord(validRecordTemplate({ decision: 'advisorOnly', clientVisibility: 'client' }));
  assert(!v.valid, 'validateRuleDecisionRecord: decision=advisorOnly with clientVisibility=client is invalid');
}
{
  const v = validateRuleDecisionRecord(validRecordTemplate({ decision: 'advisorOnly', clientVisibility: 'advisorOnly' }));
  assert(v.valid, 'validateRuleDecisionRecord: decision=advisorOnly with clientVisibility=advisorOnly is valid');
}
{
  const v = validateRuleDecisionRecord({});
  assert(!v.valid, 'validateRuleDecisionRecord: empty object is invalid');
}

{
  const v = validateWarning({
    warningId: 'w1', warningType: 'missingSourceEvidence', severity: 'error', message: 'x', recoverable: true, needsOrenDecision: false,
  });
  assert(v.valid, `validateWarning: well-formed warning is valid: ${v.errors.join('; ')}`);
}
{
  const v = validateWarning({ warningId: 'w1', warningType: 'notARealType', severity: 'error', message: 'x', recoverable: true, needsOrenDecision: false });
  assert(!v.valid, 'validateWarning: invalid warningType rejected');
}
{
  const v = validateWarning({ warningId: 'w1', warningType: 'missingSourceEvidence', severity: 'catastrophic', message: 'x', recoverable: true, needsOrenDecision: false });
  assert(!v.valid, 'validateWarning: invalid severity rejected');
}

{
  const v = validateConflict({
    conflictType: 'directContradiction', ruleIds: ['a', 'b'], severity: 'warning', description: 'x', recoverable: true, needsOrenDecision: false,
  });
  assert(v.valid, `validateConflict: well-formed non-critical conflict is valid: ${v.errors.join('; ')}`);
}
{
  const v = validateConflict({
    conflictType: 'directContradiction', ruleIds: ['a', 'b'], severity: 'critical', description: 'x', recoverable: false, needsOrenDecision: false,
  });
  assert(!v.valid, 'validateConflict: unresolved critical conflict without needsOrenDecision=true is invalid');
}
{
  const v = validateConflict({
    conflictType: 'directContradiction', ruleIds: ['a', 'b'], severity: 'critical', description: 'x', recoverable: false, needsOrenDecision: true,
  });
  assert(v.valid, 'validateConflict: unresolved critical conflict WITH needsOrenDecision=true is valid');
}
{
  const v = validateConflict({ conflictType: 'directContradiction', ruleIds: [], severity: 'warning', description: 'x', recoverable: true, needsOrenDecision: false });
  assert(!v.valid, 'validateConflict: empty ruleIds array rejected');
}

{
  const v = validateRuleDecisionInput(mkInput({ ruleDefinitions: [mkDef({})] }));
  assert(v.valid, `validateRuleDecisionInput: well-formed input is valid: ${v.errors.join('; ')}`);
}
{
  const v = validateRuleDecisionInput({});
  assert(!v.valid, 'validateRuleDecisionInput: empty object is invalid');
}
{
  const v = validateRuleDecisionInput(mkInput({ pipelineRunId: '' }));
  assert(!v.valid, 'validateRuleDecisionInput: empty pipelineRunId rejected');
}
{
  const v = validateRuleDecisionInput(mkInput({ readingDomain: 'notReal' }));
  assert(!v.valid, 'validateRuleDecisionInput: invalid readingDomain rejected');
}
{
  const v = validateRuleDecisionInput(mkInput({ readingPlan: null }));
  assert(!v.valid, 'validateRuleDecisionInput: missing readingPlan rejected');
}
{
  const v = validateRuleDecisionInput(mkInput({ ruleDefinitions: 'not-an-array' }));
  assert(!v.valid, 'validateRuleDecisionInput: ruleDefinitions must be an array');
}
{
  const v = validateRuleDecisionInput(mkInput({ ruleDefinitions: [{ ruleId: 'bad' }] }));
  assert(!v.valid, 'validateRuleDecisionInput: a malformed Rule Definition inside the array is caught');
}
for (const field of ['phone', 'rawClientHistory', 'secrets', 'accessTokens', 'paymentData']) {
  const v = validateRuleDecisionInput({ ...mkInput({}), [field]: 'leak' });
  assert(!v.valid, `validateRuleDecisionInput: forbidden privacy field "${field}" rejected`);
}

// ---------------------------------------------------------------------------
// 18. Decision Vocabulary purity — deprecated values never appear anywhere
// ---------------------------------------------------------------------------

{
  const engineSrc = readFileSync('./goral-hachol/intelligence/rule-decision-engine.js', 'utf8');
  const typesSrc = readFileSync('./goral-hachol/intelligence/rule-decision-types.js', 'utf8');
  const validatorsSrc = readFileSync('./goral-hachol/intelligence/rule-decision-validators.js', 'utf8');
  for (const word of ["'notAvailable'", "'selected'", "'rejected'", "'active'", "'inactive'"]) {
    assert(!engineSrc.includes(`decision, ${word}`) && !engineSrc.includes(`decision: ${word}`), `rule-decision-engine.js: never assigns decision=${word}`);
  }
  assert(!/[:,]\s*'notAvailable'/.test(typesSrc), 'rule-decision-types.js: never assigns/exports the deprecated value notAvailable as data (comment mentions are fine)');
  assert(validatorsSrc.includes('notAvailable'), 'rule-decision-validators.js: references notAvailable only to reject it (sanity: word does appear, in DEPRECATED list)');
}

assert(RULE_DECISION_VALUES.length === 6, 'RULE_DECISION_VALUES has exactly 6 values');
assert(!RULE_DECISION_VALUES.includes('notAvailable'), 'RULE_DECISION_VALUES excludes notAvailable');
assert(!RULE_DECISION_VALUES.includes('selected'), 'RULE_DECISION_VALUES excludes selected');
assert(!RULE_DECISION_VALUES.includes('rejected'), 'RULE_DECISION_VALUES excludes rejected');
assert(!RULE_DECISION_VALUES.includes('active'), 'RULE_DECISION_VALUES excludes active');
assert(!RULE_DECISION_VALUES.includes('inactive'), 'RULE_DECISION_VALUES excludes inactive');

// ---------------------------------------------------------------------------
// 19. Structural guards — no engine/AI/network imports (Foundation phase)
// ---------------------------------------------------------------------------

{
  const files = [
    './goral-hachol/intelligence/rule-decision-types.js',
    './goral-hachol/intelligence/rule-decision-engine.js',
    './goral-hachol/intelligence/rule-decision-validators.js',
  ];
  for (const file of files) {
    const src = readFileSync(file, 'utf8');
    assert(!/^\s*import[\s\S]*?from\s+['"].*\/engine\//m.test(src), `${file}: no import from goral-hachol/engine/*`);
    assert(!/fetch\(/.test(src), `${file}: no fetch() call`);
    assert(!/anthropic|openai/i.test(src), `${file}: no AI provider references`);
    assert(!/from\s+['"].*supabase/i.test(src) && !/supabase\./i.test(src), `${file}: no live Supabase import/call (documentation mentions in header comments are fine)`);
    assert(!/from\s+['"].*(goral-rule-applicability-matrix|goral-knowledge-registry)/.test(src), `${file}: does not import the live knowledge registry/matrix yet (documentation mentions in header comments are fine)`);
  }
}

// ---------------------------------------------------------------------------
// 20. decisionSummary sanity (deterministic, no PII, no chain-of-thought)
// ---------------------------------------------------------------------------

{
  const plan = mkPlan({ primaryDecisionCategories: ['outcomeRules'] });
  const def = mkDef({ ruleId: 'goral.kashf.summary1', ruleCategory: 'outcomeRules' });
  const out1 = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: [def] }));
  const out2 = runRuleDecisionEngine(mkInput({ readingPlan: plan, ruleDefinitions: [def] }));
  assert(typeof out1.decisionSummary === 'string' && out1.decisionSummary.length > 0, 'decisionSummary: non-empty string');
  assert(out1.decisionSummary === out2.decisionSummary, 'decisionSummary: deterministic across identical runs');
  assert(out1.decisionSummary.includes('required'), 'decisionSummary: mentions required count');
  assert(!/client name|phone|email/i.test(out1.decisionSummary), 'decisionSummary: no PII markers');
}

// ---------------------------------------------------------------------------
// 21. Enum/catalog sanity
// ---------------------------------------------------------------------------

assert(WARNING_SEVERITY_VALUES.length === 4, 'WARNING_SEVERITY_VALUES has exactly 4 values (info/warning/error/critical)');
assert(WARNING_TYPES.length === 13, `WARNING_TYPES has exactly 13 values, got ${WARNING_TYPES.length}`);
assert(CONFLICT_TYPES.length === 7, `CONFLICT_TYPES has exactly 7 values, got ${CONFLICT_TYPES.length}`);
assert(CLIENT_VISIBILITY_VALUES.length === 4, 'CLIENT_VISIBILITY_VALUES has exactly 4 values (client/advisorOnly/hiddenUnlessRequested/hidden)');
assert(CLIENT_VISIBILITY_VALUES.includes('hidden'), 'CLIENT_VISIBILITY_VALUES includes the new "hidden" value');
assert(DECISION_ORDER_STEPS.length === 14, `DECISION_ORDER_STEPS has exactly 14 steps, got ${DECISION_ORDER_STEPS.length}`);
assert(DECISION_PRECEDENCE_TIERS.length === 8, `DECISION_PRECEDENCE_TIERS has exactly 8 tiers, got ${DECISION_PRECEDENCE_TIERS.length}`);
assert(Object.keys(RULE_ID_NAMESPACE_PREFIX).length === 2, 'RULE_ID_NAMESPACE_PREFIX covers exactly 2 domains');

// ---------------------------------------------------------------------------
// 22. decideRule — direct unit tests (bypassing the full engine)
// ---------------------------------------------------------------------------

{
  const ctx = { readingDomain: 'goralHachol', method: 'kashf', topicId: 'topic.x', questionType: 'yesNo', primaryIntent: 'outcomeCompletion', readingPlan: mkPlan({ primaryDecisionCategories: ['outcomeRules'] }), availableInputs: [], metActivationConditions: [] };
  const rec = decideRule(mkDef({ ruleCategory: 'outcomeRules' }), ctx);
  assert(rec.decision === 'required', 'decideRule (direct): required scenario matches engine-level behavior');
}
{
  const ctx = { readingDomain: 'goralHachol', method: 'kashf', topicId: 'topic.x', questionType: 'yesNo', primaryIntent: 'outcomeCompletion', readingPlan: mkPlan({}), availableInputs: [], metActivationConditions: [] };
  const rec = decideRule(null, ctx);
  assert(rec.excluded === true, 'decideRule (direct): null Rule Definition is excluded, never crashes');
  assert(rec.decision === null, 'decideRule (direct): excluded record carries decision=null internally');
}

// ---------------------------------------------------------------------------
// Final tally
// ---------------------------------------------------------------------------

console.log(`\n${passed} passed, ${failed} failed (total ${passed + failed} assertions)`);
if (failed > 0) process.exit(1);
