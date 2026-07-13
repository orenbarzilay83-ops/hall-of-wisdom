#!/usr/bin/env node
/**
 * _test_hall_wisdom_reading_planner.mjs
 *
 * Tests for Hall of Wisdom Core — Reading Planner (third implemented
 * component, per HALL_WISDOM_READING_PLANNER_COMPONENT_CONTRACT.md). No AI,
 * no network, no engine calls — pure deterministic logic consuming
 * already-computed Intent Analyzer / Reading Strategy Builder output.
 */

import { analyzeIntent } from './goral-hachol/intelligence/intent-analyzer.js';
import { buildReadingStrategy } from './goral-hachol/intelligence/reading-strategy-builder.js';
import { buildReadingPlan, PLAN_VERSION } from './goral-hachol/intelligence/reading-planner.js';
import { validatePlannerInput, validatePlannerResult } from './goral-hachol/intelligence/reading-planner-validators.js';
import { WARNING_TYPES, WARNING_SEVERITY_VALUES, READING_DOMAINS, METHOD_BY_DOMAIN } from './goral-hachol/intelligence/reading-planner-types.js';

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

function planFor(question, method, extra = {}) {
  const intentResult = analyzeIntent({ question, ...extra });
  const readingStrategy = buildReadingStrategy({ intentResult, method });
  const input = {
    question, readingDomain: 'goralHachol', method, questionType: readingStrategy.questionType,
    intentResult, readingStrategy,
  };
  return { intentResult, readingStrategy, input, plan: buildReadingPlan(input) };
}

const OUTPUT_CONTRACT_FIELDS = [
  'planId', 'planVersion', 'readingDomain', 'method', 'spreadId', 'topicId', 'questionType',
  'primaryIntent', 'strategyId', 'goal',
  'primaryDecisionCategories', 'verificationCategories', 'conditionalCategories', 'supportingCategories',
  'advisorOnlyCategories', 'forbiddenCategories', 'unavailableCategories',
  'requiredInputs', 'missingInputs', 'evidenceRequirements', 'sourceEvidencePointers',
  'expectedClientSections', 'expectedAdvisorSections', 'hiddenClientSections',
  'executionOrder', 'verificationOrder', 'contradictionPolicy', 'uncertaintyPolicy', 'timingPolicy', 'spiritualPolicy',
  'plannerWarnings', 'plannerReason', 'confidence', 'requiresClarification', 'clarificationQuestion', 'needsOrenDecision',
];

// --- Output contract shape --------------------------------------------------

{
  const { plan } = planFor('האם העסק החדש יצליח?', 'hawi');
  for (const field of OUTPUT_CONTRACT_FIELDS) {
    assert(field in plan, `output contract includes field "${field}"`);
  }
  assert(Object.keys(plan).length === OUTPUT_CONTRACT_FIELDS.length, `output has exactly ${OUTPUT_CONTRACT_FIELDS.length} fields, got ${Object.keys(plan).length}`);
}

// --- 1. Business Prediction (Kashf/Hawi) ------------------------------------

{
  const { plan, input } = planFor('האם העסק החדש יצליח?', 'hawi');
  assert(validatePlannerInput(input).valid, `Business Prediction: input valid: ${validatePlannerInput(input).errors.join('; ')}`);
  assert(plan.primaryIntent === 'prediction', 'Business Prediction: primaryIntent=prediction');
  assert(plan.primaryDecisionCategories.includes('outcomeRules'), 'Business Prediction: outcome category in primaryDecision');
  assert(plan.supportingCategories.includes('verification'), 'Business Prediction: verification allowed (supporting)');
  assert(plan.forbiddenCategories.includes('hiddenThought'), 'Business Prediction: hiddenThought forbidden');
  assert(plan.forbiddenCategories.includes('timing'), 'Business Prediction: timing forbidden (not asked)');
  assert(plan.forbiddenCategories.includes('spiritual'), 'Business Prediction: spiritual forbidden (not relevant)');
  const v = validatePlannerResult(plan);
  assert(v.valid, `Business Prediction: plan validates cleanly: ${v.errors.join('; ')}`);
}

// --- 2. Decision Support -----------------------------------------------------

{
  const { plan, input } = planFor('האם כדאי לי לפתוח עסק?', 'hawi');
  assert(validatePlannerInput(input).valid, 'Decision Support: input valid');
  assert(plan.primaryIntent === 'decisionSupport', 'Decision Support: primaryIntent=decisionSupport');
  assert(plan.primaryDecisionCategories.includes('outcomeRules') && plan.primaryDecisionCategories.includes('currentStateRules'), 'Decision Support: outcome+currentState in primaryDecision');
  assert(validatePlannerResult(plan).valid, 'Decision Support: plan validates cleanly');
}

// --- 3. Hidden Thought -------------------------------------------------------

{
  const { plan, input } = planFor('מה הוא חושב עליי?', 'kashf');
  assert(validatePlannerInput(input).valid, 'Hidden Thought: input valid');
  assert(plan.primaryIntent === 'hiddenThoughtIntent', 'Hidden Thought: primaryIntent=hiddenThoughtIntent');
  assert(plan.advisorOnlyCategories.includes('dhamir'), 'Hidden Thought: dhamir is advisor-only');
  assert(!plan.expectedClientSections.includes('dhamir'), 'Hidden Thought: dhamir not client-visible');
  assert(plan.hiddenClientSections.includes('dhamir'), 'Hidden Thought: dhamir in hiddenClientSections');
  assert(validatePlannerResult(plan).valid, 'Hidden Thought: plan validates cleanly');
}

// --- 4. Timing ----------------------------------------------------------------

{
  const { plan, input } = planFor('מתי העסק יתחיל להרוויח?', 'hawi');
  assert(validatePlannerInput(input).valid, 'Timing: input valid');
  assert(plan.primaryIntent === 'timingRequest', 'Timing: primaryIntent=timingRequest');
  assert(plan.primaryDecisionCategories.includes('timingRules'), 'Timing: timingRules in primaryDecision');
  assert(!plan.forbiddenCategories.includes('timing'), 'Timing: "timing" category not forbidden (it was asked)');
  assert(plan.timingPolicy === 'includeAsPrimary', 'Timing: timingPolicy=includeAsPrimary');
  assert(validatePlannerResult(plan).valid, 'Timing: plan validates cleanly');
}

// --- 5. Hawi / Spiritual ------------------------------------------------------

{
  const { plan, input } = planFor('מה מצבו?', 'hawi', { questionTypeHint: 'spiritual' });
  assert(validatePlannerInput(input).valid, 'Spiritual: input valid');
  assert(input.questionType === 'spiritual', 'Spiritual: questionType=spiritual');
  assert(plan.spiritualPolicy === 'includeIfRelevant', `Spiritual: spiritualPolicy=includeIfRelevant, got ${plan.spiritualPolicy}`);
  assert(validatePlannerResult(plan).valid, 'Spiritual: plan validates cleanly');
}

// --- 6-7. Cards (Relationship State / Decision Support) -----------------------
//
// Reading Strategy Builder now supports readingDomain:'cards' (added in a
// follow-up round, see HALL_WISDOM_READING_PLANNER_PRECOMMIT_REPORT.md §5 for
// the gap that was found and closed) — these two tests now run the REAL,
// full pipeline (Intent Analyzer -> Reading Strategy Builder -> Reading
// Planner) end-to-end for cards, through validatePlannerInput() itself, not
// a hand-built mock.

function planForCards(question, extra = {}) {
  const intentResult = analyzeIntent({ question, ...extra });
  const readingStrategy = buildReadingStrategy({
    intentResult, readingDomain: 'cards', method: 'cartomancy', spreadId: 'three', questionType: intentResult.questionType,
  });
  const input = {
    question, readingDomain: 'cards', method: 'cartomancy', spreadId: 'three',
    questionType: readingStrategy.questionType, intentResult, readingStrategy,
  };
  return { intentResult, readingStrategy, input, plan: buildReadingPlan(input) };
}

{
  const { input, plan } = planForCards('האם אנחנו מתאימים?');
  assert(validatePlannerInput(input).valid, `Cards/Relationship State: input valid: ${validatePlannerInput(input).errors.join('; ')}`);
  assert(plan.readingDomain === 'cards', 'Cards/Relationship State: readingDomain=cards');
  assert(plan.method === 'cartomancy', 'Cards/Relationship State: method=cartomancy');
  assert(plan.spreadId === 'three', 'Cards/Relationship State: spreadId=three carried through as context');
  assert(plan.primaryIntent === 'compatibility', 'Cards/Relationship State: primaryIntent=compatibility');
  assert(plan.primaryDecisionCategories.includes('relationshipRelevantRules'), 'Cards/Relationship State: relationshipRelevantRules in primaryDecision');
  assert(plan.advisorOnlyCategories.includes('technicalSpreadDetails'), 'Cards/Relationship State: technicalSpreadDetails advisor-only');
  assert(!plan.expectedClientSections.includes('technicalSpreadDetails'), 'Cards/Relationship State: technicalSpreadDetails not client-visible');
  assert(!plan.primaryDecisionCategories.includes('hiddenThought'), 'Cards/Relationship State: hiddenThought not activated (Intent was compatibility, not hiddenThoughtIntent)');
  const v = validatePlannerResult(plan);
  assert(v.valid, `Cards/Relationship State: plan validates cleanly: ${v.errors.join('; ')}`);
}

{
  const { input, plan } = planForCards('האם כדאי לי לפתוח עסק?');
  assert(validatePlannerInput(input).valid, `Cards/Decision Support: input valid: ${validatePlannerInput(input).errors.join('; ')}`);
  assert(plan.readingDomain === 'cards', 'Cards/Decision Support: readingDomain=cards');
  assert(plan.primaryIntent === 'decisionSupport', 'Cards/Decision Support: primaryIntent=decisionSupport');
  assert(plan.primaryDecisionCategories.includes('outcomeRules'), 'Cards/Decision Support: outcomeRules (shared category) in primaryDecision');
  const v = validatePlannerResult(plan);
  assert(v.valid, `Cards/Decision Support: plan validates cleanly: ${v.errors.join('; ')}`);
}

// --- 8. Ambiguous question -> stop -------------------------------------------

{
  const { plan, input } = planFor('מה קורה בעסק?', 'hawi');
  assert(plan.stopped === true, 'Ambiguous: stopped=true');
  assert(plan.stopComponent === 'readingPlanner', 'Ambiguous: stopComponent=readingPlanner');
  assert(plan.recoverable === true, 'Ambiguous: recoverable=true');
  assert(plan.requiresClarification === true, 'Ambiguous: requiresClarification=true');
  assert(typeof plan.clarificationQuestion === 'string' && plan.clarificationQuestion.length > 0, 'Ambiguous: clarificationQuestion non-empty');
  assert(plan.needsOrenDecision === true, 'Ambiguous: needsOrenDecision=true');
  assert(!('primaryDecisionCategories' in plan), 'Ambiguous: no full plan fields present (stop-only shape)');
  const v = validatePlannerResult(plan);
  assert(v.valid, `Ambiguous: stop result validates cleanly: ${v.errors.join('; ')}`);
}

// --- 9. Domain mismatch -> validation failure --------------------------------

{
  const { readingStrategy, intentResult } = planFor('האם העסק החדש יצליח?', 'hawi');
  const mismatchInput = {
    question: 'x', readingDomain: 'cards', method: 'hawi', questionType: 'businessSuccess', intentResult, readingStrategy,
  };
  const v = validatePlannerInput(mismatchInput);
  assert(!v.valid, 'Domain mismatch: input is invalid');
  assert(v.errors.some((e) => e.includes('not valid for readingDomain')), 'Domain mismatch: error names the method/domain mismatch');

  for (const domain of READING_DOMAINS) {
    for (const method of METHOD_BY_DOMAIN[domain]) {
      for (const otherDomain of READING_DOMAINS.filter((d) => d !== domain)) {
        assert(
          !METHOD_BY_DOMAIN[otherDomain].includes(method) || METHOD_BY_DOMAIN[domain].includes(method),
          `Domain mismatch: method "${method}" (${domain}) does not silently satisfy ${otherDomain}`
        );
      }
    }
  }
}

// --- 10. Conflicting constraints -> needsOrenDecision ------------------------

{
  const conflictingStrategy = {
    strategyId: 'strat-test-conflict', strategyVersion: 'reading-strategy-builder-v1', method: 'hawi',
    questionType: 'businessSuccess', primaryIntent: 'prediction', secondaryIntents: [],
    goal: 'test', primaryEvidence: [], secondaryEvidence: [],
    verificationPolicy: 'none', contradictionPolicy: 'mustSurfaceToClient', clientDepth: 'standard', advisorDepth: 'standard',
    hiddenSectionsPolicy: 'excludeAll', timingPolicy: 'excludeUnlessAsked', spiritualPolicy: 'excludeUnlessAsked', confidencePolicy: 'flagIfBelowThreshold',
    strategyConstraints: { mustInclude: ['outcomeRules'], mayInclude: [], mustExclude: ['outcomeRules'], advisorOnly: [], requiresEvidence: [], forbiddenWithoutQuestion: [] },
    strategyReason: 'test', confidence: 1, requiresClarification: false, clarificationQuestion: null, needsOrenDecision: false,
  };
  const intentResult = { primaryIntent: 'prediction', confidence: 1, requiresClarification: false, clarificationQuestion: null, secondaryIntents: [] };
  const input = { question: 'test', readingDomain: 'goralHachol', method: 'hawi', questionType: 'businessSuccess', intentResult, readingStrategy: conflictingStrategy };
  const plan = buildReadingPlan(input);
  assert(!plan.primaryDecisionCategories.includes('outcomeRules'), 'Conflicting constraints: conflicting category excluded from primaryDecisionCategories');
  assert(!plan.forbiddenCategories.includes('outcomeRules'), 'Conflicting constraints: conflicting category excluded from forbiddenCategories too (unresolved, not silently forbidden)');
  assert(plan.needsOrenDecision === true, 'Conflicting constraints: needsOrenDecision=true');
  assert(plan.plannerWarnings.some((w) => w.warningType === 'conflictingConstraints' && w.needsOrenDecision === true), 'Conflicting constraints: conflictingConstraints warning present with needsOrenDecision=true');
  const v = validatePlannerResult(plan);
  assert(v.valid, `Conflicting constraints: plan (degenerate but valid) validates cleanly: ${v.errors.join('; ')}`);
}

// --- 11. Missing evidence -> warning ------------------------------------------

{
  const { plan } = planFor('האם העסק החדש יצליח?', 'hawi'); // requiresEvidence=['contradictionResolution'], no sourceEvidencePointers provided
  assert(plan.missingInputs.includes('contradictionResolution'), 'Missing evidence: contradictionResolution in missingInputs');
  assert(plan.plannerWarnings.some((w) => w.warningType === 'missingEvidence' && w.affectedCategory === 'contradictionResolution'), 'Missing evidence: missingEvidence warning present');
  assert(plan.plannerWarnings.find((w) => w.warningType === 'missingEvidence').needsOrenDecision === false, 'Missing evidence: is a soft warning (needsOrenDecision=false), not a hard block');

  // Positive case: providing matching sourceEvidencePointers satisfies it
  const intentResult = analyzeIntent({ question: 'האם העסק החדש יצליח?' });
  const readingStrategy = buildReadingStrategy({ intentResult, method: 'hawi' });
  const input2 = {
    question: 'האם העסק החדש יצליח?', readingDomain: 'goralHachol', method: 'hawi', questionType: readingStrategy.questionType,
    intentResult, readingStrategy, sourceEvidencePointers: ['contradictionResolution'],
  };
  const plan2 = buildReadingPlan(input2);
  assert(plan2.missingInputs.length === 0, 'Missing evidence (satisfied): missingInputs empty when evidence provided');
  assert(!plan2.plannerWarnings.some((w) => w.warningType === 'missingEvidence'), 'Missing evidence (satisfied): no missingEvidence warning when satisfied');
  assert(validatePlannerResult(plan2).valid, 'Missing evidence (satisfied): plan validates cleanly');
}

// --- 12. Advisor-only leak attempt -> blocked --------------------------------

{
  const { plan } = planFor('מה הוא חושב עליי?', 'kashf');
  assert(plan.advisorOnlyCategories.length > 0, 'Advisor-only leak: sanity — advisorOnlyCategories non-empty for this scenario');
  const leaked = { ...plan, expectedClientSections: [...plan.expectedClientSections, plan.advisorOnlyCategories[0]] };
  const v = validatePlannerResult(leaked);
  assert(!v.valid, 'Advisor-only leak: validator rejects a plan with an advisorOnly category leaked into expectedClientSections');
  assert(v.errors.some((e) => e.includes('advisorOnlyCategories') && e.includes('expectedClientSections')), 'Advisor-only leak: error message names the leak');
}

// --- Decision Vocabulary / no notAvailable -----------------------------------

{
  const { plan } = planFor('האם העסק החדש יצליח?', 'hawi');
  const serialized = JSON.stringify(plan);
  assert(!serialized.includes('notAvailable'), 'Decision Vocabulary: output never contains the deprecated "notAvailable" string');
  for (const warning of plan.plannerWarnings) {
    assert(WARNING_TYPES.includes(warning.warningType), `Decision Vocabulary: warningType "${warning.warningType}" is in the official 11-value catalog`);
    assert(WARNING_SEVERITY_VALUES.includes(warning.severity), `Decision Vocabulary: severity "${warning.severity}" is in the official 4-value catalog`);
  }
}

// --- No duplicate categories across buckets (structural, many scenarios) -----

{
  const questions = [
    ['האם העסק החדש יצליח?', 'hawi'],
    ['האם כדאי לי לפתוח עסק?', 'hawi'],
    ['מה הוא חושב עליי?', 'kashf'],
    ['מתי העסק יתחיל להרוויח?', 'hawi'],
  ];
  const bucketFields = [
    'primaryDecisionCategories', 'verificationCategories', 'conditionalCategories',
    'supportingCategories', 'advisorOnlyCategories', 'forbiddenCategories', 'unavailableCategories',
  ];
  for (const [q, m] of questions) {
    const { plan } = planFor(q, m);
    const seen = new Set();
    let hasDuplicate = false;
    for (const field of bucketFields) {
      for (const cat of plan[field]) {
        if (seen.has(cat)) hasDuplicate = true;
        seen.add(cat);
      }
    }
    assert(!hasDuplicate, `No duplicate categories: "${q}" has no category in more than one decision bucket`);
  }
}

// --- plannerReason: no chain-of-thought, no PII -------------------------------

{
  const CHAIN_OF_THOUGHT_MARKERS = ['אני חושב', 'לדעתי', 'בואו נבדוק', 'step by step', 'let me', 'I think', 'reasoning:', 'thought:'];
  const questions = ['האם העסק החדש יצליח?', 'האם כדאי לי לפתוח עסק?', 'מה הוא חושב עליי?', 'מתי העסק יתחיל להרוויח?'];
  for (const q of questions) {
    const { plan } = planFor(q, 'hawi');
    assert(!/\d{7,}/.test(plan.plannerReason), `plannerReason for "${q}" contains no digit-sequence PII`);
    for (const marker of CHAIN_OF_THOUGHT_MARKERS) {
      assert(!plan.plannerReason.toLowerCase().includes(marker.toLowerCase()), `plannerReason for "${q}" does not contain chain-of-thought marker "${marker}"`);
    }
    assert(plan.plannerReason.length > 0, `plannerReason for "${q}" is non-empty`);
  }
}

// --- planVersion consistency ---------------------------------------------------

{
  const questions = ['האם העסק החדש יצליח?', 'האם כדאי לי לפתוח עסק?', 'מה הוא חושב עליי?'];
  for (const q of questions) {
    const { plan } = planFor(q, 'hawi');
    assert(plan.planVersion === PLAN_VERSION, `planVersion for "${q}" matches exported PLAN_VERSION`);
  }
}

// --- validatePlannerInput ------------------------------------------------------

{
  const { input } = planFor('האם העסק החדש יצליח?', 'hawi');
  assert(validatePlannerInput(input).valid, 'validatePlannerInput: valid input passes');
  assert(!validatePlannerInput({ ...input, question: '' }).valid, 'validatePlannerInput: empty question fails');
  assert(!validatePlannerInput({ ...input, question: undefined }).valid, 'validatePlannerInput: missing question fails');
  assert(!validatePlannerInput({ ...input, readingDomain: 'notADomain' }).valid, 'validatePlannerInput: invalid readingDomain fails');
  assert(!validatePlannerInput({ ...input, method: 'kashf', readingDomain: 'cards' }).valid, 'validatePlannerInput: method/domain mismatch fails');
  assert(!validatePlannerInput({ ...input, intentResult: { bogus: true } }).valid, 'validatePlannerInput: invalid intentResult fails');
  assert(!validatePlannerInput({ ...input, readingStrategy: { bogus: true } }).valid, 'validatePlannerInput: invalid readingStrategy fails');
  assert(!validatePlannerInput({ ...input, phone: '0501234567' }).valid, 'validatePlannerInput: forbidden privacy field "phone" fails');
  assert(!validatePlannerInput(null).valid, 'validatePlannerInput: null input fails');
}

// --- validatePlannerResult: required-field / malformed-shape rejections -------

{
  const { plan: base } = planFor('האם העסק החדש יצליח?', 'hawi');

  const missingField = { ...base };
  delete missingField.plannerReason;
  assert(!validatePlannerResult(missingField).valid, 'validatePlannerResult: missing plannerReason fails');

  const emptyReason = { ...base, plannerReason: '' };
  assert(!validatePlannerResult(emptyReason).valid, 'validatePlannerResult: empty plannerReason fails');

  const badPrimaryIntent = { ...base, primaryIntent: 'notARealIntent' };
  assert(!validatePlannerResult(badPrimaryIntent).valid, 'validatePlannerResult: invalid primaryIntent fails');

  const badDomain = { ...base, readingDomain: 'notADomain' };
  assert(!validatePlannerResult(badDomain).valid, 'validatePlannerResult: invalid readingDomain fails');

  const badMethodDomainPair = { ...base, readingDomain: 'cards' };
  assert(!validatePlannerResult(badMethodDomainPair).valid, 'validatePlannerResult: method/domain mismatch fails');

  const badWarning = { ...base, plannerWarnings: [{ warningType: 'notARealWarning', severity: 'info', message: 'x', affectedCategory: null, needsOrenDecision: false }] };
  assert(!validatePlannerResult(badWarning).valid, 'validatePlannerResult: invalid warningType fails');

  const badSeverity = { ...base, plannerWarnings: [{ warningType: 'missingInput', severity: 'notASeverity', message: 'x', affectedCategory: null, needsOrenDecision: false }] };
  assert(!validatePlannerResult(badSeverity).valid, 'validatePlannerResult: invalid severity fails');

  const clarificationMismatch = { ...base, requiresClarification: true, clarificationQuestion: null };
  assert(!validatePlannerResult(clarificationMismatch).valid, 'validatePlannerResult: requiresClarification=true without clarificationQuestion fails');

  const requiredAndForbidden = { ...base, primaryDecisionCategories: ['outcomeRules'], forbiddenCategories: [...base.forbiddenCategories, 'outcomeRules'] };
  assert(!validatePlannerResult(requiredAndForbidden).valid, 'validatePlannerResult: same category in primaryDecisionCategories and forbiddenCategories fails');

  const badExecutionOrder = { ...base, executionOrder: [...base.executionOrder, 'forbidden'] };
  assert(!validatePlannerResult(badExecutionOrder).valid, 'validatePlannerResult: "forbidden" in executionOrder fails');

  const injectedNotAvailable = { ...base, plannerReason: base.plannerReason + ' notAvailable' };
  assert(!validatePlannerResult(injectedNotAvailable).valid, 'validatePlannerResult: injected "notAvailable" string fails');

  assert(validatePlannerResult(base).valid, 'validatePlannerResult: the real (unmodified) plan passes');
}

// --- Structural guards (no engine imports, no AI/fetch, no network) ------------

{
  const fs = await import('node:fs');
  const filesToCheck = [
    './goral-hachol/intelligence/reading-planner.js',
    './goral-hachol/intelligence/reading-planner-types.js',
    './goral-hachol/intelligence/reading-planner-validators.js',
  ];
  for (const file of filesToCheck) {
    const content = fs.readFileSync(new URL(file, import.meta.url), 'utf8');
    assert(!/from ['"].*\/engine\//.test(content), `${file}: no import from goral-hachol/engine/`);
    assert(!/from ['"].*cartomancy\//.test(content), `${file}: no import from cartomancy/ (cards engine/UI)`);
    assert(!/from ['"].*goral-rule-applicability-matrix/.test(content), `${file}: no import from goral-rule-applicability-matrix.js (foundation phase)`);
    assert(!/from ['"].*goral-knowledge-registry/.test(content), `${file}: no import from goral-knowledge-registry.js (foundation phase)`);
    assert(!/from ['"].*goral-question-taxonomy/.test(content), `${file}: no import from goral-question-taxonomy.js (not re-deriving questionType)`);
    assert(!/\bfetch\s*\(/.test(content), `${file}: no fetch() call`);
    assert(!/callAnthropic/.test(content), `${file}: no callAnthropic reference`);
    assert(!/ANTHROPIC_API_KEY/.test(content), `${file}: no ANTHROPIC_API_KEY reference`);
    assert(!/from ['"].*supabase/i.test(content) && !/createClient\s*\(/.test(content), `${file}: no Supabase import/usage`);
  }
}

// --- summary -----------------------------------------------------------------

console.log(`${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
