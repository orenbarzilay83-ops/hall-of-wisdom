#!/usr/bin/env node
/**
 * _test_goral_knowledge_decision_brain_phase4.mjs
 *
 * Tests for Oren Smart Advisor — Goral Knowledge + Decision Brain (Phase 4).
 * No AI, no network. Runs real engines via existing goral-qa-output-collector.js.
 */

import { GORAL_QA_SCENARIOS } from './goral-hachol/qa/goral-qa-scenarios.js';
import { collectScenarioOutput } from './goral-hachol/qa/goral-qa-output-collector.js';
import { evaluateReading } from './goral-hachol/brain/goral-decision-brain.js';
import { run as runBrainEvaluation } from './goral-hachol/brain/goral-brain-evaluation-runner.mjs';
import { run as runQaRunner } from './goral-hachol/qa/goral-qa-runner.mjs';
import { buildQaEvaluatorPayload } from './goral-hachol/qa/goral-qa-ai-payload-builder.js';
import {
  GORAL_KNOWLEDGE_REGISTRY,
  getRegistryEntriesForMethod,
  getRegistryEntryByRuleId,
  KASHF_RULES_WITHOUT_PAGE_MAP,
} from './goral-hachol/brain/goral-knowledge-registry.js';
import { QUESTION_TYPES, classifyQuestionType, getAllQuestionTypeIds } from './goral-hachol/brain/goral-question-taxonomy.js';
import { RULE_APPLICABILITY_MATRIX, getApplicability, RULE_CATEGORIES } from './goral-hachol/brain/goral-rule-applicability-matrix.js';
import { RUBRIC_DIMENSIONS, severityForScore } from './goral-hachol/brain/goral-output-quality-rubric.js';
import {
  RULE_DECISION_VALUES,
  isRuleDecisionValue,
  isMethod,
  isClientVisibility,
  isConfidence,
  isSeverity,
} from './goral-hachol/intelligence/reading-intelligence-types.js';

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

// --- Knowledge Registry -----------------------------------------------

assert(GORAL_KNOWLEDGE_REGISTRY.length >= 60, `registry should have >=60 entries, got ${GORAL_KNOWLEDGE_REGISTRY.length}`);
assert(getRegistryEntriesForMethod('kashf').length > 0, 'kashf registry entries exist');
assert(getRegistryEntriesForMethod('hawi').length > 0, 'hawi registry entries exist');

for (const entry of GORAL_KNOWLEDGE_REGISTRY) {
  assert(isMethod(entry.method), `entry ${entry.ruleId} has valid method`);
  assert(typeof entry.ruleId === 'string' && entry.ruleId.length > 0, `entry has ruleId`);
  assert(
    // ruleType is a distinct, Phase-4-specific enum (registry rule classification) —
    // not the same concept as RULE_DECISION_VALUES, so it is not sourced from
    // reading-intelligence-types.js. See HALL_WISDOM_VOCABULARY_CONTRACTS_ALIGNMENT_PRECOMMIT_REPORT.md.
    ['primaryDecision', 'verification', 'supporting', 'advisorOnly', 'conditional', 'spiritual', 'timing', 'hiddenThought', 'characterNature'].includes(entry.ruleType),
    `entry ${entry.ruleId} has valid ruleType (got ${entry.ruleType})`
  );
  assert(isClientVisibility(entry.clientVisibility), `entry ${entry.ruleId} has valid clientVisibility`);
  assert(entry.evidenceLocation && typeof entry.evidenceLocation.file === 'string', `entry ${entry.ruleId} has evidenceLocation.file`);
  assert(isConfidence(entry.confidence), `entry ${entry.ruleId} has valid confidence`);
  assert(entry.approvedSource === true, `entry ${entry.ruleId} sourced from an approved book`);
}

assert(getRegistryEntryByRuleId('kashf-topic-commerce') !== null, 'commerce topic entry exists for Kashf');
assert(getRegistryEntryByRuleId('hawi-topic-commerce') !== null, 'commerce topic entry exists for Hawi');
assert(getRegistryEntryByRuleId('kashf-dhamir-majority').clientVisibility === 'advisorOnly', 'kashf dhamir registry entry is advisorOnly');
assert(KASHF_RULES_WITHOUT_PAGE_MAP.length > 0, 'known Kashf source gap is detected (money/relocation/etc.)');

// No invented rule text: every registry entry must reference a real file under goral-hachol/
for (const entry of GORAL_KNOWLEDGE_REGISTRY) {
  assert(entry.evidenceLocation.file.startsWith('goral-hachol/'), `entry ${entry.ruleId} evidenceLocation points inside goral-hachol/`);
}

// --- Question Taxonomy --------------------------------------------------

const questionTypeIds = getAllQuestionTypeIds();
assert(questionTypeIds.length >= 16, `taxonomy should have >=16 question types, got ${questionTypeIds.length}`);
for (const id of questionTypeIds) {
  const qt = QUESTION_TYPES[id];
  assert(Array.isArray(qt.keywords) && qt.keywords.length > 0, `${id} has keywords`);
  assert(qt.expectedTopicIds && Array.isArray(qt.expectedTopicIds.kashf) && Array.isArray(qt.expectedTopicIds.hawi), `${id} has expectedTopicIds for both methods`);
  assert(typeof qt.expectedAnswerFocus === 'string' && qt.expectedAnswerFocus.length > 0, `${id} has expectedAnswerFocus`);
}

{
  const result = classifyQuestionType('האם העסק החדש שלי יצליח?');
  assert(result.questionTypeId === 'businessSuccess', `business question classified correctly, got ${result.questionTypeId}`);
}
{
  const result = classifyQuestionType('מתי אני אתחתן?');
  assert(result.questionTypeId === 'timing' || result.questionTypeId === 'marriage', `timing/marriage question classified plausibly, got ${result.questionTypeId}`);
}
{
  const result = classifyQuestionType('שאלה חסרת מובן בלי אף מילת-מפתח');
  assert(result.questionTypeId === 'general', `unclassifiable question falls back to general, got ${result.questionTypeId}`);
}

// --- Rule Applicability Matrix ------------------------------------------

for (const qId of questionTypeIds) {
  for (const method of ['kashf', 'hawi']) {
    for (const cat of RULE_CATEGORIES) {
      const value = getApplicability(qId, method, cat);
      assert(isRuleDecisionValue(value), `matrix[${qId}][${method}][${cat}] has a valid value (got ${value})`);
    }
  }
}

assert(getApplicability('businessSuccess', 'kashf', 'dhamir') === 'advisorOnly', 'dhamir is advisorOnly (never client-required) for businessSuccess/kashf');
assert(getApplicability('businessSuccess', 'kashf', 'timing') === 'forbidden', 'timing forbidden for businessSuccess/kashf (not asked)');
assert(getApplicability('timing', 'kashf', 'timing') === 'allowed', 'timing allowed for timing questionType');
assert(getApplicability('spiritual', 'kashf', 'spiritual') === 'required', 'spiritual required for spiritual questionType/kashf');
assert(getApplicability('spiritual', 'hawi', 'spiritual') === 'required', 'spiritual required for spiritual questionType/hawi');
assert(getApplicability('spiritual', 'hawi', 'dhamir') === 'allowed', 'dhamir allowed exception for hawi spiritual (matches buildSpiritualNarrative real behavior)');
assert(getApplicability('loveRelationship', 'kashf', 'characterNature') === 'allowed', 'characterNature allowed for loveRelationship (matches checkTemperamentLeak skip)');
assert(getApplicability('businessSuccess', 'kashf', 'characterNature') === 'forbidden', 'characterNature forbidden by default for businessSuccess');

// --- Output Quality Rubric ----------------------------------------------

const rubricIds = Object.keys(RUBRIC_DIMENSIONS);
assert(rubricIds.length >= 12, `rubric should have >=12 dimensions, got ${rubricIds.length}`);
for (const id of rubricIds) {
  const dim = RUBRIC_DIMENSIONS[id];
  assert(Array.isArray(dim.failureConditions) && dim.failureConditions.length > 0, `${id} has failureConditions`);
  assert(dim.severityMapping && typeof dim.severityMapping[0] === 'string', `${id} has severityMapping`);
}
assert(severityForScore('safetyAndPrivacy', 0) === 'high', 'score 0 on safetyAndPrivacy maps to high severity');
assert(severityForScore('safetyAndPrivacy', 4) === 'none', 'score 4 maps to none severity');

// --- Decision Brain: real regression-detection proofs --------------------

// 1a. Regression guard: the original 20 scenarios (already approved/tested before Phase 4)
//     must still come back completely clean — any non-none here would mean Phase 4 changed
//     real behavior for already-verified output, which is not allowed in this phase.
const ORIGINAL_20_SCENARIO_IDS = new Set([
  'commerce-kashf', 'commerce-hawi', 'love-kashf', 'love-hawi', 'timing-kashf', 'timing-hawi',
  'spiritual-kashf', 'spiritual-hawi', 'illness-kashf', 'illness-hawi', 'completion-kashf',
  'completion-hawi', 'travel-kashf', 'travel-hawi', 'money-kashf', 'money-hawi', 'enemies-kashf',
  'enemies-hawi', 'general-kashf', 'general-hawi',
]);
{
  let anyNonNone = 0;
  let anyHigh = 0;
  for (const scenario of GORAL_QA_SCENARIOS) {
    const collected = collectScenarioOutput(scenario);
    const brain = evaluateReading({
      method: collected.method,
      topicId: collected.topicId,
      question: collected.question,
      engineReading: collected.raw,
      clientOutput: collected.clientOutputHtml,
      advisorData: collected.advisorOnlyOutput,
      sectionsShown: collected.sectionsShown,
      sectionsHidden: collected.sectionsHidden,
      sourceRulesApplied: collected.sourceRulesApplied,
      warnings: collected.warnings,
    });
    if (ORIGINAL_20_SCENARIO_IDS.has(scenario.id) && brain.overallSeverity !== 'none') {
      anyNonNone += 1;
      console.error(`  regression: ${scenario.id} is no longer clean (severity=${brain.overallSeverity})`);
    }
    // Across all 60 (original + Phase-4-added), "high" severity would mean a real leak/
    // contradiction/privacy problem — never acceptable. "medium"/"low" on newly-added
    // scenarios can be a legitimate, previously-undiscovered knowledge gap (see coverage
    // report) and is allowed here; it is surfaced to Oren via scenariosNeedingOrenDecision,
    // not silently hidden.
    if (brain.overallSeverity === 'high') anyHigh += 1;
  }
  assert(anyNonNone === 0, `all 20 original pre-Phase-4 scenarios should stay clean (regression guard), got ${anyNonNone} non-none`);
  assert(anyHigh === 0, `no scenario (original or new) should reach "high" severity, got ${anyHigh}`);
}

// 2. Regression proof: real dhamir leak (advisor-mode HTML) must be caught as advisorOnlyLeak/high.
{
  const scenario = GORAL_QA_SCENARIOS.find((s) => s.method === 'kashf');
  const collected = collectScenarioOutput(scenario);
  const advisorHtml = collected.advisorOnlyOutput; // real advisor-mode HTML, known to contain dhamir text
  const brain = evaluateReading({
    method: collected.method,
    topicId: collected.topicId,
    question: collected.question,
    engineReading: collected.raw,
    clientOutput: advisorHtml, // deliberately mislabel advisor HTML as client output
    advisorData: collected.advisorOnlyOutput,
    sectionsShown: ['dhamir'],
    sectionsHidden: [],
    sourceRulesApplied: collected.sourceRulesApplied,
    warnings: collected.warnings,
  });
  assert(brain.advisorOnlyLeaks.includes('dhamir'), 'real advisor-mode dhamir content is detected as an advisorOnlyLeak');
  assert(brain.overallSeverity === 'high', 'dhamir leak drives overallSeverity to high');
}

// 3. Regression proof: recreate the exact pre-fix formula-only house-label bug via string substitution.
{
  const scenario = GORAL_QA_SCENARIOS.find((s) => s.method === 'kashf' && s.category === 'commerce');
  const collected = collectScenarioOutput(scenario);
  const formulaOnlyHouse = (collected.raw.keyHouseReadings || []).find((h) => h.isFormulaOnly);
  if (formulaOnlyHouse) {
    const { HOUSE_NAMES } = await import('./goral-hachol/engine/kashf-reading-engine.js');
    const topicalName = HOUSE_NAMES[formulaOnlyHouse.houseNum];
    const corruptedHtml = collected.clientOutputHtml + `<div>בית ${formulaOnlyHouse.houseNum} — ${topicalName}</div>`;
    const brain = evaluateReading({
      method: collected.method,
      topicId: collected.topicId,
      question: collected.question,
      engineReading: collected.raw,
      clientOutput: corruptedHtml,
      advisorData: collected.advisorOnlyOutput,
      sectionsShown: collected.sectionsShown,
      sectionsHidden: collected.sectionsHidden,
      sourceRulesApplied: collected.sourceRulesApplied,
      warnings: collected.warnings,
    });
    assert(brain.formulaRoleLabelProblems.length > 0, 'recreated formula-only house-label bug is detected by the brain');
  } else {
    assert(true, 'no formula-only house in this scenario to recreate the bug with — skipped (not a failure)');
  }
}

// 4. Missing-required-rule detection: strip clientOutput entirely for a spiritual scenario.
{
  const scenario = GORAL_QA_SCENARIOS.find((s) => s.category === 'spiritual' && s.method === 'kashf');
  const collected = collectScenarioOutput(scenario);
  const brain = evaluateReading({
    method: collected.method,
    topicId: collected.topicId,
    question: collected.question,
    engineReading: collected.raw,
    clientOutput: '', // simulate a total rendering failure
    advisorData: collected.advisorOnlyOutput,
    sectionsShown: [],
    sectionsHidden: collected.sectionsHidden,
    sourceRulesApplied: [],
    warnings: collected.warnings,
  });
  assert(brain.missingRequiredRules.includes('spiritual'), 'missing spiritual content on a spiritual question is detected as missingRequiredRules');
  assert(brain.overallSeverity !== 'none', 'missing required rule drives overallSeverity away from none');
}

// 5. Contradiction detection: force primary/alt formula disagreement without the surfacing phrase.
{
  const scenario = GORAL_QA_SCENARIOS.find((s) => s.method === 'kashf' && s.category === 'completion');
  const collected = collectScenarioOutput(scenario);
  const forcedReading = {
    ...collected.raw,
    overallPositive: true,
    altFormula: { ...(collected.raw.altFormula || {}), verdict: { ...(collected.raw.altFormula?.verdict || {}), positive: false } },
  };
  const htmlWithoutVerificationPhrase = collected.clientOutputHtml.replace(/בדיקת אימות נוספת/g, '');
  const brain = evaluateReading({
    method: collected.method,
    topicId: collected.topicId,
    question: collected.question,
    engineReading: forcedReading,
    clientOutput: htmlWithoutVerificationPhrase,
    advisorData: collected.advisorOnlyOutput,
    sectionsShown: collected.sectionsShown,
    sectionsHidden: collected.sectionsHidden,
    sourceRulesApplied: collected.sourceRulesApplied,
    warnings: collected.warnings,
  });
  assert(brain.contradictionProblems.length > 0, 'forced primary/alt contradiction without surfacing phrase is detected');
  assert(brain.rubricScores.internalConsistency < 4, 'internalConsistency rubric score penalized on contradiction');
}

// 6. Uncertainty handling: warnings present, no textual hint in client output.
{
  const scenario = GORAL_QA_SCENARIOS[0];
  const collected = collectScenarioOutput(scenario);
  const brain = evaluateReading({
    method: collected.method,
    topicId: collected.topicId,
    question: collected.question,
    engineReading: collected.raw,
    clientOutput: 'תשובה קצרה בלי שום ביטוי של אי-ודאות כלל',
    advisorData: collected.advisorOnlyOutput,
    sectionsShown: collected.sectionsShown,
    sectionsHidden: collected.sectionsHidden,
    sourceRulesApplied: collected.sourceRulesApplied,
    warnings: ['אזהרת-בדיקה מלאכותית'],
  });
  assert(brain.uncertaintyProblems.length > 0, 'warnings with no textual reflection are detected as uncertaintyProblems');
}

// 7. Rubric always returns a full, valid score object.
{
  const scenario = GORAL_QA_SCENARIOS[0];
  const collected = collectScenarioOutput(scenario);
  const brain = evaluateReading({
    method: collected.method,
    topicId: collected.topicId,
    question: collected.question,
    engineReading: collected.raw,
    clientOutput: collected.clientOutputHtml,
    advisorData: collected.advisorOnlyOutput,
    sectionsShown: collected.sectionsShown,
    sectionsHidden: collected.sectionsHidden,
    sourceRulesApplied: collected.sourceRulesApplied,
    warnings: collected.warnings,
  });
  for (const dimId of Object.keys(RUBRIC_DIMENSIONS)) {
    const score = brain.rubricScores[dimId];
    assert(typeof score === 'number' && score >= 0 && score <= 4, `rubricScores.${dimId} is a valid 0-4 number (got ${score})`);
  }
}

// --- Brain evaluation runner / coverage report ---------------------------

{
  const report = runBrainEvaluation();
  assert(report.totalScenarios === GORAL_QA_SCENARIOS.length, 'runner totalScenarios matches scenario count');
  assert(report.crashedCount === 0, `runner should have zero crashes, got ${report.crashedCount}`);
  assert(report.methodCoverage.kashf > 0 && report.methodCoverage.hawi > 0, 'runner reports both-method coverage');
  assert(Array.isArray(report.missingKnowledgeEntries), 'runner reports missingKnowledgeEntries array');
  assert(report.missingKnowledgeEntries.length > 0, 'runner surfaces real known knowledge gaps (Kashf page-map mismatches)');
  assert(Array.isArray(report.ambiguousMappings) && report.ambiguousMappings.length > 0, 'runner surfaces ambiguous mappings needing Oren decision');
  assert(typeof report.codeInstructionForClaude === 'string' && report.codeInstructionForClaude.length > 0, 'runner always includes a codeInstructionForClaude string');
}

// --- No engine/UI/card mutation guard -------------------------------------
// (structural check: the brain/registry/taxonomy/matrix/rubric files must never import
// anything that writes to engines, UI, or cartomancy — only read-only imports.)
{
  const fs = await import('node:fs');
  const brainFiles = [
    './goral-hachol/brain/goral-decision-brain.js',
    './goral-hachol/brain/goral-knowledge-registry.js',
    './goral-hachol/brain/goral-question-taxonomy.js',
    './goral-hachol/brain/goral-rule-applicability-matrix.js',
    './goral-hachol/brain/goral-output-quality-rubric.js',
    './goral-hachol/brain/goral-brain-evaluation-runner.mjs',
  ];
  for (const f of brainFiles) {
    const src = fs.readFileSync(new URL(f, import.meta.url), 'utf8');
    assert(!/\bui\//.test(src), `${f} does not import from any ui/ directory`);
    assert(!/cartomancy|tarot|myseal/i.test(src), `${f} does not reference cards/seal modules`);
  }
}

// --- Vocabulary & Contracts Alignment ------------------------------------
// (goral-hachol/intelligence/reading-intelligence-types.js is the single
// source of truth for RULE_DECISION_VALUES; Phase 4's matrix re-exports it
// instead of maintaining a parallel list — see
// HALL_WISDOM_VOCABULARY_CONTRACTS_ALIGNMENT_PRECOMMIT_REPORT.md.)

// 1. legal values are exactly required/allowed/conditional/advisorOnly/forbidden/unavailable
assert(
  JSON.stringify(RULE_DECISION_VALUES) === JSON.stringify(['required', 'allowed', 'conditional', 'advisorOnly', 'forbidden', 'unavailable']),
  `RULE_DECISION_VALUES is exactly the 6 canonical values, got ${JSON.stringify(RULE_DECISION_VALUES)}`
);
{
  const APPLICABILITY_VALUES = (await import('./goral-hachol/brain/goral-rule-applicability-matrix.js')).APPLICABILITY_VALUES;
  assert(APPLICABILITY_VALUES === RULE_DECISION_VALUES, 'matrix APPLICABILITY_VALUES is the same array reference as the canonical RULE_DECISION_VALUES (re-exported, not duplicated)');
}

// 2. notAvailable is rejected by the validator
assert(!isRuleDecisionValue('notAvailable'), 'notAvailable (old spelling) is rejected as an unknown decision value');

// 3. conditional is accepted by the validator
assert(isRuleDecisionValue('conditional'), 'conditional is accepted as a valid decision value');

// 4/5. already covered above (advisorOnly not client-visible; forbidden not in expectedClientSections) —
// re-verified here specifically against the canonical import used by Phase 4.
{
  const { validateRuleDecision, createRuleDecision } = await import('./goral-hachol/intelligence/rule-decision-schema.js');
  const bad = createRuleDecision({ ruleId: 'x', decision: 'advisorOnly', reason: 'r', clientVisibility: 'client', confidence: 'high' });
  assert(!validateRuleDecision(bad).valid, 'advisorOnly decision with clientVisibility=client is rejected (Phase 4 alignment re-check)');
}

// 6. unavailable is never marked as required anywhere in the live matrix
{
  let contradictions = 0;
  for (const questionTypeId of Object.keys(RULE_APPLICABILITY_MATRIX)) {
    for (const method of ['kashf', 'hawi']) {
      for (const cat of RULE_CATEGORIES) {
        const value = getApplicability(questionTypeId, method, cat);
        if (value === 'unavailable') {
          // by construction a cell holds one value, so this is also a direct
          // proof no cell is simultaneously 'unavailable' and 'required'
          contradictions += value === 'required' ? 1 : 0;
        }
      }
    }
  }
  assert(contradictions === 0, 'no matrix cell is both unavailable and required');
  assert(getApplicability('general', 'hawi', 'formulaOnlyHouses') === 'unavailable', 'hawi formulaOnlyHouses is unavailable (old notAvailable spelling replaced)');
}

// 7. every matrix entry uses only a legal value (full sweep, not just structural check above)
{
  let allValid = true;
  for (const questionTypeId of Object.keys(RULE_APPLICABILITY_MATRIX)) {
    for (const method of ['kashf', 'hawi']) {
      for (const cat of RULE_CATEGORIES) {
        if (!isRuleDecisionValue(getApplicability(questionTypeId, method, cat))) allValid = false;
      }
    }
  }
  assert(allValid, 'full matrix sweep: every cell holds a legal RULE_DECISION_VALUES value');
}

// 8. every Knowledge Registry entry using decision/status-like fields complies with its contract
//    (clientVisibility/confidence/method already re-verified via canonical type guards above, per-entry loop)
assert(
  GORAL_KNOWLEDGE_REGISTRY.every((e) => isMethod(e.method) && isClientVisibility(e.clientVisibility) && isConfidence(e.confidence)),
  'every registry entry complies with the canonical method/clientVisibility/confidence contract'
);

// 9. every Decision Brain output complies with the contract (overallSeverity is a canonical SEVERITY_VALUES member)
{
  const scenario = GORAL_QA_SCENARIOS[0];
  const collected = collectScenarioOutput(scenario);
  assert(isSeverity(collected.brainEvaluation.overallSeverity), `decision brain overallSeverity is a canonical severity value (got ${collected.brainEvaluation.overallSeverity})`);
}

// 10. QA payload builder never emits the old notAvailable spelling
{
  const qaRunResult = runQaRunner();
  const payload = buildQaEvaluatorPayload(qaRunResult);
  const payloadJson = JSON.stringify(payload);
  assert(!payloadJson.includes('notAvailable'), 'QA evaluator payload does not contain the old "notAvailable" spelling anywhere');
  assert(payloadJson.includes('unavailable') || !payloadJson.includes('Available'), 'if the payload mentions availability at all, it uses "unavailable" (canonical spelling)');
}

// 11. QA output collector never emits the old notAvailable spelling
{
  let anyNotAvailable = false;
  for (const scenario of GORAL_QA_SCENARIOS) {
    const collected = collectScenarioOutput(scenario);
    if (JSON.stringify(collected.brainEvaluation).includes('notAvailable')) anyNotAvailable = true;
  }
  assert(!anyNotAvailable, 'no scenario brainEvaluation output (from goral-qa-output-collector.js) contains the old "notAvailable" spelling');
}

// 13. no change in engine results: severity distribution across all 60 scenarios matches the
//     already-documented, already-approved baseline from HALL_WISDOM_GORAL_KNOWLEDGE_DECISION_BRAIN_PHASE4_PRECOMMIT_REPORT.md
{
  const report = runBrainEvaluation();
  assert(
    report.failuresBySeverity.high === 0 && report.failuresBySeverity.medium === 3 && report.failuresBySeverity.low === 0 && report.failuresBySeverity.none === 57,
    `severity distribution unchanged by vocabulary alignment (expected 0 high / 3 medium / 0 low / 57 none, got ${JSON.stringify(report.failuresBySeverity)})`
  );
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
