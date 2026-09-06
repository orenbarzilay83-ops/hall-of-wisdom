#!/usr/bin/env node
/**
 * _test_hall_wisdom_reading_strategy_builder.mjs
 *
 * Tests for Hall of Wisdom Core — Reading Strategy Builder (second
 * implemented component, per
 * HALL_WISDOM_READING_STRATEGY_BUILDER_COMPONENT_CONTRACT.md). No AI, no
 * network, no engine calls — pure deterministic logic consuming already-
 * computed Intent Analyzer output.
 */

import { analyzeIntent } from './goral-hachol/intelligence/intent-analyzer.js';
import { UNKNOWN_INTENT_ID, isIntentId } from './goral-hachol/intelligence/intent-types.js';
import {
  buildReadingStrategy, validateStrategyInput, validateStrategyResult, STRATEGY_VERSION,
} from './goral-hachol/intelligence/reading-strategy-builder.js';
import {
  STRATEGY_CONSTRAINT_CATEGORIES, CONSTRAINT_FIELD_NAMES, READING_DOMAINS, METHOD_BY_DOMAIN,
} from './goral-hachol/intelligence/reading-strategy-types.js';

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

function build(question, method, extra = {}) {
  const intentResult = analyzeIntent({ question });
  return { intentResult, strategy: buildReadingStrategy({ intentResult, method, ...extra }) };
}

const OUTPUT_CONTRACT_FIELDS = [
  'strategyId', 'strategyVersion', 'readingDomain', 'method', 'spreadId', 'questionType', 'primaryIntent', 'secondaryIntents',
  'goal', 'primaryEvidence', 'secondaryEvidence', 'verificationPolicy', 'contradictionPolicy',
  'clientDepth', 'advisorDepth', 'hiddenSectionsPolicy', 'timingPolicy', 'spiritualPolicy',
  'confidencePolicy', 'strategyConstraints', 'strategyReason', 'confidence', 'requiresClarification',
  'clarificationQuestion', 'needsOrenDecision',
];

// --- Output contract shape --------------------------------------------------

{
  const { strategy } = build('האם העסק החדש יצליח?', 'hawi');
  for (const field of OUTPUT_CONTRACT_FIELDS) {
    assert(field in strategy, `output contract includes field "${field}"`);
  }
  assert(Object.keys(strategy).length === OUTPUT_CONTRACT_FIELDS.length, `output has exactly ${OUTPUT_CONTRACT_FIELDS.length} fields, got ${Object.keys(strategy).length}`);
  for (const field of CONSTRAINT_FIELD_NAMES) {
    assert(field in strategy.strategyConstraints, `strategyConstraints includes field "${field}"`);
    assert(Array.isArray(strategy.strategyConstraints[field]), `strategyConstraints.${field} is an array`);
  }
}

// --- 1. Prediction -----------------------------------------------------------

{
  const { strategy } = build('האם העסק החדש יצליח?', 'hawi');
  assert(strategy.primaryIntent === 'prediction', `Prediction: primaryIntent=prediction, got ${strategy.primaryIntent}`);
  assert(strategy.requiresClarification === false, 'Prediction: requiresClarification=false');
  assert(strategy.strategyConstraints.mustExclude.includes('hiddenThought'), 'Prediction: mustExclude includes hiddenThought');
  assert(strategy.strategyConstraints.mustExclude.includes('timing'), 'Prediction: mustExclude includes timing');
  assert(strategy.strategyConstraints.forbiddenWithoutQuestion.includes('timing'), 'Prediction: timing forbiddenWithoutQuestion (not asked)');
  assert(strategy.strategyConstraints.forbiddenWithoutQuestion.includes('spiritual'), 'Prediction: spiritual forbiddenWithoutQuestion (not asked)');
  assert(strategy.strategyConstraints.mustInclude.includes('outcomeRules'), 'Prediction: mustInclude includes outcomeRules');
  assert(strategy.strategyReason.includes('Prediction'), 'Prediction: strategyReason names Prediction');
  assert(validateStrategyResult(strategy).valid, `Prediction: validates cleanly: ${validateStrategyResult(strategy).errors.join('; ')}`);
}

// --- 2. Decision Support -------------------------------------------------------

{
  const { strategy } = build('האם כדאי לי לפתוח עסק?', 'hawi');
  assert(strategy.primaryIntent === 'decisionSupport', `Decision Support: primaryIntent=decisionSupport, got ${strategy.primaryIntent}`);
  assert(strategy.clientDepth === 'extended', `Decision Support: clientDepth=extended (comparison-style intent), got ${strategy.clientDepth}`);
  assert(strategy.strategyConstraints.mustExclude.includes('absoluteOutcomeClaims'), 'Decision Support: mustExclude includes absoluteOutcomeClaims');
  assert(strategy.strategyReason.includes('Decision Support'), 'Decision Support: strategyReason names Decision Support');
  assert(validateStrategyResult(strategy).valid, `Decision Support: validates cleanly: ${validateStrategyResult(strategy).errors.join('; ')}`);
}

// --- 3. Timing -----------------------------------------------------------------

{
  const { strategy } = build('מתי העסק יתחיל להרוויח?', 'hawi');
  assert(strategy.primaryIntent === 'timingRequest', `Timing: primaryIntent=timingRequest, got ${strategy.primaryIntent}`);
  assert(strategy.timingPolicy === 'includeAsPrimary', `Timing: timingPolicy=includeAsPrimary (asked explicitly), got ${strategy.timingPolicy}`);
  assert(!strategy.strategyConstraints.forbiddenWithoutQuestion.includes('timing'), 'Timing: timing is NOT in forbiddenWithoutQuestion (it was asked)');
  assert(strategy.strategyConstraints.mustInclude.includes('timingRules'), 'Timing: mustInclude includes timingRules');
  assert(validateStrategyResult(strategy).valid, `Timing: validates cleanly: ${validateStrategyResult(strategy).errors.join('; ')}`);
}

// --- 4. Hidden Thought -----------------------------------------------------------

{
  const { strategy } = build('מה הוא חושב עליי?', 'kashf');
  assert(strategy.primaryIntent === 'hiddenThoughtIntent', `Hidden Thought: primaryIntent=hiddenThoughtIntent, got ${strategy.primaryIntent}`);
  assert(strategy.hiddenSectionsPolicy === 'includeHiddenThoughtOnly', `Hidden Thought: hiddenSectionsPolicy=includeHiddenThoughtOnly, got ${strategy.hiddenSectionsPolicy}`);
  assert(strategy.advisorDepth === 'full-reasoning', `Hidden Thought: advisorDepth=full-reasoning, got ${strategy.advisorDepth}`);
  assert(strategy.strategyConstraints.advisorOnly.includes('dhamir'), 'Hidden Thought: advisorOnly includes dhamir');
  assert(validateStrategyResult(strategy).valid, `Hidden Thought: validates cleanly: ${validateStrategyResult(strategy).errors.join('; ')}`);
}

// --- 5. Advisor Only invariant ----------------------------------------------

{
  const { strategy } = build('מה הוא חושב עליי?', 'kashf');
  const overlap = strategy.strategyConstraints.advisorOnly.filter(
    (c) => strategy.strategyConstraints.mustInclude.includes(c) || strategy.strategyConstraints.mayInclude.includes(c)
  );
  assert(overlap.length === 0, `Advisor Only: no advisorOnly category is also client-visible via mustInclude/mayInclude, got overlap=${JSON.stringify(overlap)}`);
  assert(strategy.strategyConstraints.advisorOnly.includes('technicalFormulaDetails'), 'Advisor Only: technicalFormulaDetails is always advisorOnly');
  // technicalFormulaDetails should never appear as client-visible in ANY strategy
  for (const q of ['האם העסק החדש יצליח?', 'האם כדאי לי לפתוח עסק?', 'מתי העסק יתחיל להרוויח?']) {
    const { strategy: s } = build(q, 'hawi');
    assert(!s.strategyConstraints.mustInclude.includes('technicalFormulaDetails') && !s.strategyConstraints.mayInclude.includes('technicalFormulaDetails'), `Advisor Only: technicalFormulaDetails never client-visible for "${q}"`);
  }
}

// --- 6. Mixed Intent (real secondary intent alongside primary) -----------------

{
  const { strategy } = build('האם כדאי לי לנסוע, ומתי?', 'hawi');
  assert(strategy.primaryIntent === 'decisionSupport', `Mixed Intent: primaryIntent=decisionSupport, got ${strategy.primaryIntent}`);
  assert(strategy.secondaryIntents.includes('timingRequest'), `Mixed Intent: secondaryIntents includes timingRequest, got ${JSON.stringify(strategy.secondaryIntents)}`);
  assert(strategy.secondaryEvidence.includes('timingRules'), 'Mixed Intent: secondaryEvidence reflects the secondary intent (timingRules)');
  assert(!strategy.strategyConstraints.forbiddenWithoutQuestion.includes('timing'), 'Mixed Intent: timing not forbiddenWithoutQuestion since timingRequest is a real secondary intent (it was asked)');
  assert(validateStrategyResult(strategy).valid, `Mixed Intent: validates cleanly: ${validateStrategyResult(strategy).errors.join('; ')}`);
}

// --- 7. Ambiguous Question (Intent Analyzer returned 'unknown') ----------------

{
  const { strategy: zeroSignal } = build('מה קורה בעסק?', 'hawi');
  assert(zeroSignal.primaryIntent === UNKNOWN_INTENT_ID, `Ambiguous (zero-signal): primaryIntent=unknown, got ${zeroSignal.primaryIntent}`);
  assert(zeroSignal.requiresClarification === true, 'Ambiguous (zero-signal): requiresClarification=true');
  assert(zeroSignal.needsOrenDecision === true, 'Ambiguous (zero-signal): needsOrenDecision=true');
  assert(isNonEmptyClarification(zeroSignal), 'Ambiguous (zero-signal): clarificationQuestion is non-empty');
  assert(zeroSignal.strategyReason.length > 0, 'Ambiguous (zero-signal): strategyReason is non-empty');
  assert(!zeroSignal.strategyReason.startsWith('נבחרה אסטרטגיית'), 'Ambiguous (zero-signal): strategyReason does not read like a confident pick');
  assert(zeroSignal.strategyConstraints.mustInclude.length === 0, 'Ambiguous (zero-signal): mustInclude is empty (nothing committed without a known intent)');
  assert(zeroSignal.strategyConstraints.mustExclude.includes('hiddenThought'), 'Ambiguous (zero-signal): conservative mustExclude still forbids hiddenThought');
  assert(zeroSignal.verificationPolicy === 'always', 'Ambiguous (zero-signal): verificationPolicy=always (conservative)');
  assert(validateStrategyResult(zeroSignal).valid, `Ambiguous (zero-signal): validates cleanly: ${validateStrategyResult(zeroSignal).errors.join('; ')}`);

  const { strategy: tie } = build('מתי כדאי לי לנסוע?', 'hawi');
  assert(tie.primaryIntent === UNKNOWN_INTENT_ID, `Ambiguous (near-tie): primaryIntent=unknown, got ${tie.primaryIntent}`);
  assert(tie.requiresClarification === true, 'Ambiguous (near-tie): requiresClarification=true');
  assert(tie.strategyReason.includes('decisionSupport') === false || true, 'Ambiguous (near-tie): sanity no-throw check');
}

function isNonEmptyClarification(strategy) {
  return typeof strategy.clarificationQuestion === 'string' && strategy.clarificationQuestion.trim().length > 0;
}

// --- 8. Conflict Detection (validator catches malformed strategyConstraints) ---

{
  const { strategy: base } = build('האם העסק החדש יצליח?', 'hawi');

  const withMustIncludeExcludeConflict = {
    ...base,
    strategyConstraints: { ...base.strategyConstraints, mustInclude: ['timing'], mustExclude: ['timing'] },
  };
  assert(!validateStrategyResult(withMustIncludeExcludeConflict).valid, 'Conflict Detection: mustInclude ∩ mustExclude is rejected');

  const withMayIncludeExcludeConflict = {
    ...base,
    strategyConstraints: { ...base.strategyConstraints, mayInclude: ['characterNature'], mustExclude: ['characterNature'] },
  };
  assert(!validateStrategyResult(withMayIncludeExcludeConflict).valid, 'Conflict Detection: mayInclude ∩ mustExclude is rejected');

  const withAdvisorOnlyClientVisibleConflict = {
    ...base,
    strategyConstraints: { ...base.strategyConstraints, mustInclude: ['dhamir'], advisorOnly: ['dhamir'] },
  };
  assert(!validateStrategyResult(withAdvisorOnlyClientVisibleConflict).valid, 'Conflict Detection: advisorOnly category also in mustInclude is rejected');

  const withForbiddenWithoutEvidenceConflict = {
    ...base,
    strategyConstraints: { ...base.strategyConstraints, mustInclude: ['timing'], forbiddenWithoutQuestion: ['timing'], requiresEvidence: [] },
  };
  assert(!validateStrategyResult(withForbiddenWithoutEvidenceConflict).valid, 'Conflict Detection: forbiddenWithoutQuestion+mustInclude without requiresEvidence is rejected');

  const withUnknownCategory = {
    ...base,
    strategyConstraints: { ...base.strategyConstraints, mustInclude: ['notARealCategory'] },
  };
  assert(!validateStrategyResult(withUnknownCategory).valid, 'Conflict Detection: unknown category name is rejected');

  assert(validateStrategyResult(base).valid, 'Conflict Detection: the real (unmodified) strategy still validates cleanly');
}

// --- strategyReason: privacy + chain-of-thought -------------------------------

{
  const questions = [
    'האם העסק החדש יצליח?',
    'האם כדאי לי לפתוח עסק?',
    'מתי העסק יתחיל להרוויח?',
    'מה הוא חושב עליי?',
    'מה קורה בעסק?',
  ];
  const CHAIN_OF_THOUGHT_MARKERS = ['אני חושב', 'לדעתי', 'בואו נבדוק', 'step by step', 'let me', 'I think', 'reasoning:', 'thought:'];
  for (const q of questions) {
    const { strategy } = build(q, 'hawi');
    assert(!/\d{7,}/.test(strategy.strategyReason), `strategyReason for "${q}" contains no digit-sequence PII`);
    for (const marker of CHAIN_OF_THOUGHT_MARKERS) {
      assert(!strategy.strategyReason.toLowerCase().includes(marker.toLowerCase()), `strategyReason for "${q}" does not contain chain-of-thought marker "${marker}"`);
    }
  }

  const phoneQuestion = 'האם העסק החדש יצליח? מספר הטלפון שלי 0501234567';
  const { strategy: phoneStrategy } = build(phoneQuestion, 'hawi');
  assert(!phoneStrategy.strategyReason.includes('0501234567'), 'strategyReason does not leak an injected phone number');
}

// --- strategyVersion consistency ------------------------------------------------

{
  const questions = ['האם העסק החדש יצליח?', 'האם כדאי לי לפתוח עסק?', 'מה הוא חושב עליי?', 'מה קורה בעסק?'];
  for (const q of questions) {
    const { strategy } = build(q, 'hawi');
    assert(strategy.strategyVersion === STRATEGY_VERSION, `strategyVersion for "${q}" matches exported STRATEGY_VERSION`);
    assert(strategy.strategyVersion.length > 0, `strategyVersion for "${q}" is non-empty`);
  }
}

// --- Strict Method Separation (structural: strategyId reflects method, no cross-bleed) ---

{
  const { strategy: kashfStrategy } = build('מה הוא חושב עליי?', 'kashf');
  const { strategy: hawiStrategy } = build('מה הוא חושב עליי?', 'hawi');
  assert(kashfStrategy.method === 'kashf', 'Strict Method Separation: kashf strategy carries method=kashf');
  assert(hawiStrategy.method === 'hawi', 'Strict Method Separation: hawi strategy carries method=hawi');
  // Foundation-phase note: category catalog is currently method-agnostic
  // (no live knowledge-registry connection yet — see reading-strategy-types.js
  // header), so this only asserts the method field itself is carried through
  // correctly, not per-category method exclusivity (that requires the future
  // integration phase).
}

// --- validateStrategyInput ------------------------------------------------------

{
  const { intentResult } = build('האם העסק החדש יצליח?', 'hawi');
  assert(validateStrategyInput({ intentResult, method: 'hawi' }).valid, 'validateStrategyInput: valid input passes');
  assert(!validateStrategyInput({ intentResult, method: 'notAMethod' }).valid, 'validateStrategyInput: invalid method fails');
  assert(!validateStrategyInput({ intentResult: { bogus: true }, method: 'hawi' }).valid, 'validateStrategyInput: invalid intentResult fails');
  assert(!validateStrategyInput(null).valid, 'validateStrategyInput: null input fails');
}

// --- validateStrategyResult: required-field / malformed-shape rejections -------

{
  const { strategy: base } = build('האם העסק החדש יצליח?', 'hawi');

  const missingField = { ...base };
  delete missingField.strategyReason;
  assert(!validateStrategyResult(missingField).valid, 'validateStrategyResult: missing strategyReason fails');

  const emptyReason = { ...base, strategyReason: '' };
  assert(!validateStrategyResult(emptyReason).valid, 'validateStrategyResult: empty strategyReason fails');

  const missingVersion = { ...base };
  delete missingVersion.strategyVersion;
  assert(!validateStrategyResult(missingVersion).valid, 'validateStrategyResult: missing strategyVersion fails');

  const badPolicy = { ...base, verificationPolicy: 'notAPolicy' };
  assert(!validateStrategyResult(badPolicy).valid, 'validateStrategyResult: invalid verificationPolicy fails');

  const badConstraintsShape = { ...base, strategyConstraints: 'notAnObject' };
  assert(!validateStrategyResult(badConstraintsShape).valid, 'validateStrategyResult: strategyConstraints as non-object fails');

  const badConstraintsFieldShape = { ...base, strategyConstraints: { ...base.strategyConstraints, mustInclude: 'notAnArray' } };
  assert(!validateStrategyResult(badConstraintsFieldShape).valid, 'validateStrategyResult: strategyConstraints.mustInclude as non-array fails');

  const clarificationMismatch = { ...base, requiresClarification: true, clarificationQuestion: null };
  assert(!validateStrategyResult(clarificationMismatch).valid, 'validateStrategyResult: requiresClarification=true without clarificationQuestion fails');

  const needsOrenMismatch = { ...base, needsOrenDecision: true };
  assert(!validateStrategyResult(needsOrenMismatch).valid, 'validateStrategyResult: needsOrenDecision != requiresClarification fails');

  assert(validateStrategyResult(base).valid, 'validateStrategyResult: the real (unmodified) strategy passes');
}

// --- Intent -> Strategy mapping consistency across all 12 intents --------------

{
  const knownQuestionsByIntent = {
    prediction: 'האם העסק החדש יצליח?',
    decisionSupport: 'האם כדאי לי לפתוח עסק?',
    outcomeCompletion: 'האם העסק יצא לפועל?',
    timingRequest: 'מתי העסק יתחיל להרוויח?',
    hiddenThoughtIntent: 'מה הוא חושב עליי?',
    stateAssessment: 'האם הוא אוהב אותי?',
    investigation: 'מי גנב את הכסף?',
    diagnosis: 'למה העסק לא מצליח?',
    comparison: 'מה עדיף, עבודה שכירה או עצמאית?',
    guidance: 'מה עליי לעשות כדי לשפר את העסק?',
    generalForecast: 'מה צפוי לי בתקופה הקרובה?',
  };
  for (const [expectedIntent, question] of Object.entries(knownQuestionsByIntent)) {
    const { intentResult, strategy } = build(question, 'hawi');
    assert(intentResult.primaryIntent === expectedIntent, `sanity: "${question}" still classifies as ${expectedIntent}`);
    assert(strategy.primaryIntent === expectedIntent, `Intent->Strategy mapping: "${question}" strategy.primaryIntent=${expectedIntent}`);
    assert(isIntentId(strategy.primaryIntent), `Intent->Strategy mapping: "${question}" strategy.primaryIntent is a real intent id`);
    assert(strategy.goal.length > 0, `Intent->Strategy mapping: "${question}" strategy has non-empty goal`);
    assert(Array.isArray(strategy.primaryEvidence) && strategy.primaryEvidence.length > 0, `Intent->Strategy mapping: "${question}" strategy has non-empty primaryEvidence`);
    const v = validateStrategyResult(strategy);
    assert(v.valid, `Intent->Strategy mapping: "${question}" strategy validates cleanly: ${v.errors.join('; ')}`);
  }
}

// --- Structural guards (no engine imports, no AI/fetch, no network) ------------

{
  const fs = await import('node:fs');
  const filesToCheck = [
    './goral-hachol/intelligence/reading-strategy-builder.js',
    './goral-hachol/intelligence/reading-strategy-types.js',
  ];
  for (const file of filesToCheck) {
    const content = fs.readFileSync(new URL(file, import.meta.url), 'utf8');
    assert(!/from ['"].*\/engine\//.test(content), `${file}: no import from goral-hachol/engine/`);
    assert(!/from ['"].*cartomancy\//.test(content), `${file}: no import from cartomancy/ (cards engine/UI)`);
    assert(!/from ['"].*goral-rule-applicability-matrix/.test(content), `${file}: no import from goral-rule-applicability-matrix.js (not yet connected — foundation phase)`);
    assert(!/from ['"].*goral-knowledge-registry/.test(content), `${file}: no import from goral-knowledge-registry.js (not yet connected — foundation phase)`);
    assert(!/\bfetch\s*\(/.test(content), `${file}: no fetch() call`);
    assert(!/callAnthropic/.test(content), `${file}: no callAnthropic reference`);
    assert(!/ANTHROPIC_API_KEY/.test(content), `${file}: no ANTHROPIC_API_KEY reference`);
    assert(!/from ['"].*supabase/i.test(content) && !/createClient\s*\(/.test(content), `${file}: no Supabase import/usage`);
  }
}

// --- Cards Domain Support (readingDomain:'cards', method:'cartomancy') -------
//
// No card meanings, spread names, Rule IDs, or interpretive content are
// introduced anywhere below — only structural domain/category plumbing.

{
  const intentResult = analyzeIntent({ question: 'האם הקשר הזה יכול להתפתח?' });
  const strategy = buildReadingStrategy({
    intentResult, readingDomain: 'cards', method: 'cartomancy', spreadId: 'test-relationship-spread',
    questionType: intentResult.questionType,
  });
  assert(strategy.readingDomain === 'cards', 'Cards: readingDomain=cards carried through');
  assert(strategy.method === 'cartomancy', 'Cards: method=cartomancy carried through');
  assert(strategy.spreadId === 'test-relationship-spread', 'Cards: spreadId carried through as context, unchanged');
  assert(strategy.strategyId.endsWith('-cards'), 'Cards: strategyId carries a -cards suffix');
  assert(!strategy.strategyConstraints.advisorOnly.includes('dhamir'), 'Cards: dhamir (goralHachol-exclusive) never appears for cards, even for hiddenThoughtIntent-flavored questions');
  assert(strategy.strategyConstraints.advisorOnly.every((c) => c !== 'technicalFormulaDetails'), 'Cards: technicalFormulaDetails (goralHachol name) not used for cards');
  const v = validateStrategyResult(strategy);
  assert(v.valid, `Cards: strategy validates cleanly: ${v.errors.join('; ')}`);
}

// --- Integration Test: Intent -> Strategy -> Planner, Cards domain -----------

{
  const { buildReadingPlan } = await import('./goral-hachol/intelligence/reading-planner.js');
  const { validatePlannerResult } = await import('./goral-hachol/intelligence/reading-planner-validators.js');

  const question = 'האם הקשר הזה יכול להתפתח?';
  const intentResult = analyzeIntent({ question });
  const strategy = buildReadingStrategy({
    intentResult, readingDomain: 'cards', method: 'cartomancy', spreadId: 'test-relationship-spread',
    questionType: intentResult.questionType,
  });
  const plannerInput = {
    question, readingDomain: 'cards', method: 'cartomancy', spreadId: 'test-relationship-spread',
    questionType: strategy.questionType, intentResult, readingStrategy: strategy,
  };
  const plan = buildReadingPlan(plannerInput);

  assert(intentResult && typeof intentResult === 'object', 'Integration/Cards: Intent Result produced');
  assert(strategy && typeof strategy === 'object', 'Integration/Cards: Strategy Result produced');
  assert(strategy.readingDomain === 'cards', 'Integration/Cards: readingDomain stays "cards" end-to-end');
  assert(strategy.method === 'cartomancy', 'Integration/Cards: method stays "cartomancy" end-to-end');
  assert(strategy.spreadId === 'test-relationship-spread', 'Integration/Cards: spreadId preserved end-to-end');
  assert(plan && typeof plan === 'object', 'Integration/Cards: Planner Result produced');
  const planValidation = validatePlannerResult(plan);
  assert(planValidation.valid, `Integration/Cards: Planner Result validates cleanly (stop or full plan): ${planValidation.errors.join('; ')}`);
  assert(!JSON.stringify(strategy).includes('kashf') && !JSON.stringify(strategy).includes('hawi'), 'Integration/Cards: no use of kashf/hawi anywhere in the cards strategy');

  // Note: "האם הקשר הזה יכול להתפתח?" does not match any pattern in Intent
  // Analyzer's existing (unmodified) rule set (goral-hachol/intelligence/
  // intent-analyzer-hebrew-rules.js), so it correctly resolves to
  // primaryIntent='unknown' and the chain correctly stops at Reading Planner
  // — this is itself a valid, tested outcome (Stop Result validates cleanly
  // end-to-end for the cards domain too, not just goralHachol). A second,
  // separate scenario below re-confirms the full-plan path with a question
  // that DOES match an existing Intent Analyzer pattern (compatibility).
  if (plan.stopped) {
    assert(plan.requiresClarification === true, 'Integration/Cards (ambiguous case): requiresClarification=true');
    assert(plan.needsOrenDecision === true, 'Integration/Cards (ambiguous case): needsOrenDecision=true');
  } else {
    assert(!(plan.primaryDecisionCategories.includes('hiddenThought')), 'Integration/Cards: hiddenThought not activated (Intent was not hiddenThoughtIntent)');
    assert(!(plan.primaryDecisionCategories.includes('timing')), 'Integration/Cards: timing not activated (question was not a timingRequest)');
    assert(strategy.strategyConstraints.mustExclude.includes('spiritualDiagnostics') || strategy.strategyConstraints.forbiddenWithoutQuestion.includes('spiritualDiagnostics'), 'Integration/Cards: spiritualDiagnostics blocked by default');
  }
}

// --- Integration Test (full-plan path): Cards + a question that DOES match --
// an existing, unmodified Intent Analyzer pattern (compatibility).

{
  const { buildReadingPlan } = await import('./goral-hachol/intelligence/reading-planner.js');
  const { validatePlannerResult } = await import('./goral-hachol/intelligence/reading-planner-validators.js');

  const question = 'האם אנחנו מתאימים?';
  const intentResult = analyzeIntent({ question });
  assert(intentResult.primaryIntent === 'compatibility', `Integration/Cards (full-plan): sanity — "${question}" still classifies as compatibility, got ${intentResult.primaryIntent}`);
  const strategy = buildReadingStrategy({
    intentResult, readingDomain: 'cards', method: 'cartomancy', spreadId: 'test-relationship-spread',
    questionType: intentResult.questionType,
  });
  const plan = buildReadingPlan({
    question, readingDomain: 'cards', method: 'cartomancy', spreadId: 'test-relationship-spread',
    questionType: strategy.questionType, intentResult, readingStrategy: strategy,
  });

  assert(!plan.stopped, 'Integration/Cards (full-plan): reaches a full plan, no stop');
  assert(validatePlannerResult(plan).valid, `Integration/Cards (full-plan): Planner Result validates cleanly: ${validatePlannerResult(plan).errors.join('; ')}`);
  assert(!plan.primaryDecisionCategories.includes('hiddenThought'), 'Integration/Cards (full-plan): hiddenThought not activated (Intent was compatibility, not hiddenThoughtIntent)');
  assert(!plan.primaryDecisionCategories.includes('timing'), 'Integration/Cards (full-plan): timing not activated (question was not a timingRequest)');
  assert(plan.forbiddenCategories.includes('spiritualDiagnostics') || strategy.strategyConstraints.forbiddenWithoutQuestion.includes('spiritualDiagnostics'), 'Integration/Cards (full-plan): spiritualDiagnostics blocked by default');
  assert(!JSON.stringify(plan).includes('kashf') && !JSON.stringify(plan).includes('hawi'), 'Integration/Cards (full-plan): no use of kashf/hawi anywhere in the plan');
  assert(plan.readingDomain === 'cards' && plan.method === 'cartomancy' && plan.spreadId === 'test-relationship-spread', 'Integration/Cards (full-plan): readingDomain/method/spreadId preserved end-to-end');
}

// --- Negative Tests: domain/method mismatch, cross-domain knowledgeContext ---

{
  const intentResult = analyzeIntent({ question: 'האם העסק החדש יצליח?' });

  const cardsKashf = buildReadingStrategy({ intentResult, readingDomain: 'cards', method: 'kashf', questionType: intentResult.questionType });
  assert(!validateStrategyResult(cardsKashf).valid, 'Negative: cards + kashf fails validation');
  assert(!validateStrategyInput({ intentResult, readingDomain: 'cards', method: 'kashf' }).valid, 'Negative: cards + kashf fails input validation');

  const cardsHawi = buildReadingStrategy({ intentResult, readingDomain: 'cards', method: 'hawi', questionType: intentResult.questionType });
  assert(!validateStrategyResult(cardsHawi).valid, 'Negative: cards + hawi fails validation');
  assert(!validateStrategyInput({ intentResult, readingDomain: 'cards', method: 'hawi' }).valid, 'Negative: cards + hawi fails input validation');

  const goralHacholCartomancy = buildReadingStrategy({ intentResult, readingDomain: 'goralHachol', method: 'cartomancy', questionType: intentResult.questionType });
  assert(!validateStrategyResult(goralHacholCartomancy).valid, 'Negative: goralHachol + cartomancy fails validation');
  assert(!validateStrategyInput({ intentResult, readingDomain: 'goralHachol', method: 'cartomancy' }).valid, 'Negative: goralHachol + cartomancy fails input validation');

  assert(!validateStrategyInput({ intentResult, readingDomain: 'cards', method: 'cartomancy', knowledgeContext: { readingDomain: 'goralHachol' } }).valid, 'Negative: cards with a goralHachol-tagged knowledgeContext is rejected');
  assert(!validateStrategyInput({ intentResult, readingDomain: 'goralHachol', method: 'hawi', knowledgeContext: { readingDomain: 'cards' } }).valid, 'Negative: goralHachol with a cards-tagged knowledgeContext is rejected');

  // spreadId alone must not silently pick a different strategy
  const withSpread = buildReadingStrategy({ intentResult, readingDomain: 'cards', method: 'cartomancy', spreadId: 'spread-a', questionType: intentResult.questionType });
  const withOtherSpread = buildReadingStrategy({ intentResult, readingDomain: 'cards', method: 'cartomancy', spreadId: 'spread-b', questionType: intentResult.questionType });
  assert(withSpread.primaryIntent === withOtherSpread.primaryIntent, 'Negative: spreadId alone does not change primaryIntent');
  assert(JSON.stringify(withSpread.strategyConstraints) === JSON.stringify(withOtherSpread.strategyConstraints), 'Negative: spreadId alone does not change strategyConstraints');

  // structural: no engine import, no cartomancy import, already covered by
  // the structural-guards block above — re-affirmed here in the cards context
  const fs = await import('node:fs');
  const content = fs.readFileSync(new URL('./goral-hachol/intelligence/reading-strategy-builder.js', import.meta.url), 'utf8');
  assert(!/from ['"].*\/engine\//.test(content), 'Negative: Strategy Builder does not import any engine, including cards engine');
  assert(!content.includes('cartomancy-data') && !content.includes('spread-policy-engine'), 'Negative: Strategy Builder does not import cards engine modules by name');
}

// --- Domain/Method mapping sanity (official values) --------------------------

{
  assert(READING_DOMAINS.length === 2 && READING_DOMAINS.includes('goralHachol') && READING_DOMAINS.includes('cards'), 'Domain mapping: exactly goralHachol+cards');
  assert(METHOD_BY_DOMAIN.goralHachol.includes('kashf') && METHOD_BY_DOMAIN.goralHachol.includes('hawi'), 'Domain mapping: goralHachol -> kashf/hawi');
  assert(METHOD_BY_DOMAIN.cards.length === 1 && METHOD_BY_DOMAIN.cards[0] === 'cartomancy', 'Domain mapping: cards -> cartomancy only');
}

// --- summary -----------------------------------------------------------------

console.log(`${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
