#!/usr/bin/env node
/**
 * _test_hall_wisdom_reading_intelligence_foundation.mjs
 *
 * Tests for Reading Intelligence Phase 1 foundation
 * (HALL_WISDOM_READING_INTELLIGENCE_ARCHITECTURE.md, חלק יא).
 * No AI, no network, no engine calls — schema/validation only.
 */

import { createReadingPlan, validateReadingPlan } from './goral-hachol/intelligence/reading-plan-schema.js';
import { createRuleDecision, validateRuleDecision } from './goral-hachol/intelligence/rule-decision-schema.js';
import {
  createSystemMemoryEvent,
  validateSystemMemoryEvent,
  createSystemMemoryStore,
  upsertIssueEvent,
  findIssueEvents,
} from './goral-hachol/intelligence/system-memory-schema.js';
import * as types from './goral-hachol/intelligence/reading-intelligence-types.js';

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

function validPlanInput(overrides = {}) {
  return {
    method: 'kashf',
    question: 'האם העסק שלי יצליח?',
    questionType: 'businessSuccess',
    topicId: 'commerce',
    primaryDecisionRules: ['kashf-topic-commerce'],
    verificationRules: [],
    conditionalRules: [],
    supportingRules: [],
    advisorOnlyRules: ['kashf-dhamir-majority'],
    forbiddenRules: [],
    requiredInputs: ['board (16 houses)'],
    evidenceRequirements: [],
    expectedClientSections: ['houseMeanings'],
    expectedAdvisorSections: ['dhamir'],
    sourceEvidencePointers: [],
    needsOrenDecision: false,
    ...overrides,
  };
}

// --- 1. Reading Plan תקין עובר validation ---------------------------------
{
  const plan = createReadingPlan(validPlanInput());
  const { valid, errors } = validateReadingPlan(plan);
  assert(valid, `valid reading plan should pass validation, got errors: ${errors.join('; ')}`);
}

// --- 2. Reading Plan בלי method נכשל ---------------------------------------
{
  const plan = createReadingPlan(validPlanInput({ method: undefined }));
  const { valid, errors } = validateReadingPlan(plan);
  assert(!valid, 'reading plan without method should fail validation');
  assert(errors.some((e) => e.includes('method')), 'error message should mention method');
}

// --- 3. Reading Plan בלי questionType נכשל ---------------------------------
{
  const plan = createReadingPlan(validPlanInput({ questionType: undefined }));
  const { valid, errors } = validateReadingPlan(plan);
  assert(!valid, 'reading plan without questionType should fail validation');
  assert(errors.some((e) => e.includes('questionType')), 'error message should mention questionType');
}

// --- 4. rule decision עם value לא מוכר נכשל ---------------------------------
{
  const decision = createRuleDecision({
    ruleId: 'kashf-topic-commerce',
    decision: 'definitely-not-a-real-value',
    reason: 'test',
    clientVisibility: 'client',
    confidence: 'high',
  });
  const { valid, errors } = validateRuleDecision(decision);
  assert(!valid, 'rule decision with unknown value should fail validation');
  assert(errors.some((e) => e.includes('decision')), 'error message should mention decision');
}

// --- 5. advisorOnly rule לא יכול להיות client-visible -----------------------
{
  const decision = createRuleDecision({
    ruleId: 'kashf-dhamir-majority',
    decision: 'advisorOnly',
    reason: 'dhamir is always advisor-only',
    clientVisibility: 'client', // contradiction, deliberately
    confidence: 'high',
  });
  const { valid, errors } = validateRuleDecision(decision);
  assert(!valid, 'advisorOnly decision with clientVisibility=client should fail validation');
  assert(errors.some((e) => e.includes('advisorOnly')), 'error message should explain the advisorOnly/client conflict');
}
{
  // sanity: the same rule with a consistent clientVisibility passes
  const decision = createRuleDecision({
    ruleId: 'kashf-dhamir-majority',
    decision: 'advisorOnly',
    reason: 'dhamir is always advisor-only',
    clientVisibility: 'advisorOnly',
    confidence: 'high',
  });
  const { valid } = validateRuleDecision(decision);
  assert(valid, 'advisorOnly decision with consistent clientVisibility should pass validation');
}

// --- 6. forbidden rule לא יכול להיכלל ב-expectedClientSections --------------
{
  const plan = createReadingPlan(
    validPlanInput({ forbiddenRules: ['timing'], expectedClientSections: ['houseMeanings', 'timing'] })
  );
  const { valid, errors } = validateReadingPlan(plan);
  assert(!valid, 'reading plan with a forbidden rule also listed as an expected client section should fail');
  assert(errors.some((e) => e.includes('forbiddenRules')), 'error message should mention forbiddenRules overlap');
}
{
  // sanity: no overlap passes
  const plan = createReadingPlan(validPlanInput({ forbiddenRules: ['spiritual'], expectedClientSections: ['houseMeanings'] }));
  const { valid } = validateReadingPlan(plan);
  assert(valid, 'reading plan with no forbidden/client-section overlap should pass');
}

// --- 7. system memory event עם status לא חוקי נכשל --------------------------
{
  const event = createSystemMemoryEvent({
    issueId: 'issue-1',
    issueType: 'missingRequiredRule',
    severity: 'medium',
    currentStatus: 'not-a-real-status',
  });
  const { valid, errors } = validateSystemMemoryEvent(event);
  assert(!valid, 'system memory event with invalid currentStatus should fail validation');
  assert(errors.some((e) => e.includes('currentStatus')), 'error message should mention currentStatus');
}

// --- 8. issue recurrence count חייב להיות מספר חיובי -------------------------
{
  const zeroEvent = createSystemMemoryEvent({
    issueId: 'issue-2', issueType: 'missingRequiredRule', severity: 'low', occurrenceCount: 0,
  });
  assert(!validateSystemMemoryEvent(zeroEvent).valid, 'occurrenceCount=0 should fail validation');

  const negativeEvent = createSystemMemoryEvent({
    issueId: 'issue-3', issueType: 'missingRequiredRule', severity: 'low', occurrenceCount: -3,
  });
  assert(!validateSystemMemoryEvent(negativeEvent).valid, 'negative occurrenceCount should fail validation');

  const floatEvent = createSystemMemoryEvent({
    issueId: 'issue-4', issueType: 'missingRequiredRule', severity: 'low', occurrenceCount: 1.5,
  });
  assert(!validateSystemMemoryEvent(floatEvent).valid, 'non-integer occurrenceCount should fail validation');

  const validEvent = createSystemMemoryEvent({
    issueId: 'issue-5', issueType: 'missingRequiredRule', severity: 'low', occurrenceCount: 3,
  });
  assert(validateSystemMemoryEvent(validEvent).valid, 'positive integer occurrenceCount should pass validation');
}

// --- 9. sourceEvidence נדרש לחוק שמסומן required ------------------------------
{
  const decision = createRuleDecision({
    ruleId: 'kashf-topic-commerce',
    decision: 'required',
    reason: 'primary decision rule for this topic',
    sourceEvidence: null,
    clientVisibility: 'client',
    confidence: 'high',
  });
  const { valid, errors } = validateRuleDecision(decision);
  assert(!valid, 'a required decision without sourceEvidence should fail validation');
  assert(errors.some((e) => e.includes('sourceEvidence')), 'error message should mention sourceEvidence');
}
{
  const decision = createRuleDecision({
    ruleId: 'kashf-topic-commerce',
    decision: 'required',
    reason: 'primary decision rule for this topic',
    sourceEvidence: 'goral-hachol/engine/kashf-topic-rules.js :: KASHF_TOPIC_RULES.commerce',
    clientVisibility: 'client',
    confidence: 'high',
  });
  const { valid } = validateRuleDecision(decision);
  assert(valid, 'a required decision with sourceEvidence present should pass validation');
}

// --- Extra: system memory store upsert/find round-trip ----------------------
{
  const store = createSystemMemoryStore();
  const event = createSystemMemoryEvent({
    issueId: 'issue-round-trip', method: 'kashf', issueType: 'sourceGap', severity: 'medium', occurrenceCount: 1,
  });
  upsertIssueEvent(store, event);
  const found = findIssueEvents(store, { issueId: 'issue-round-trip' });
  assert(found.length === 1, 'upserted event should be findable by issueId');

  const updated = createSystemMemoryEvent({ ...event, occurrenceCount: 2, currentStatus: 'investigating' });
  upsertIssueEvent(store, updated);
  assert(store.events.length === 1, 'upserting the same issueId should update in place, not duplicate');
  assert(findIssueEvents(store, { issueId: 'issue-round-trip' })[0].occurrenceCount === 2, 'upsert should update occurrenceCount');
}

// --- 10. אין import למנועי Kashf/Hawi בקבצי intelligence/ --------------------
// --- 11. אין AI call (callAnthropic) ------------------------------------------
// --- 12. אין fetch --------------------------------------------------------------
{
  const fs = await import('node:fs');
  const intelligenceFiles = [
    './goral-hachol/intelligence/reading-intelligence-types.js',
    './goral-hachol/intelligence/reading-plan-schema.js',
    './goral-hachol/intelligence/rule-decision-schema.js',
    './goral-hachol/intelligence/system-memory-schema.js',
  ];
  for (const f of intelligenceFiles) {
    const src = fs.readFileSync(new URL(f, import.meta.url), 'utf8');
    // Strip comment-only lines so mentions of an API in explanatory prose
    // (e.g. "no relation to ... localStorage") don't false-positive below.
    const codeOnly = src
      .split('\n')
      .filter((line) => {
        const trimmed = line.trim();
        return !(trimmed.startsWith('*') || trimmed.startsWith('//'));
      })
      .join('\n');
    assert(!/from\s+['"].*\/engine\//.test(codeOnly), `${f} does not import from any goral-hachol/engine/ path`);
    assert(!/\bcallAnthropic\s*\(/.test(codeOnly), `${f} does not call callAnthropic`);
    assert(!/\bfetch\s*\(/.test(codeOnly), `${f} does not call fetch`);
    assert(!/ANTHROPIC_API_KEY/.test(codeOnly), `${f} does not reference ANTHROPIC_API_KEY`);
    assert(!/localStorage\.|indexedDB\.|readFileSync\(|writeFileSync\(/.test(codeOnly), `${f} does not call any persistence API`);
  }
}

// --- 13. אין שינוי UI (smoke) --------------------------------------------------
{
  const fs = await import('node:fs');
  const html = fs.readFileSync(new URL('./goral-hachol.html', import.meta.url), 'utf8');
  assert(html.includes('orenAdvisorPanel'), 'orenAdvisorPanel still present in goral-hachol.html');
  const appJs = fs.readFileSync(new URL('./goral-hachol/ui/goral-app.js', import.meta.url), 'utf8');
  assert(appJs.includes('בינת היכל החכמה'), 'advisor panel title unchanged ("בינת היכל החכמה") in goral-app.js');
}

// --- 14. אין שינוי קלפים (smoke) -----------------------------------------------
{
  const fs = await import('node:fs');
  assert(fs.existsSync(new URL('./cards.html', import.meta.url)), 'cards.html still exists');
  assert(fs.existsSync(new URL('./cartomancy/ui/cards-app.js', import.meta.url)), 'cartomancy/ui/cards-app.js still exists');
}

// --- 15. אין שינוי מנועים (smoke) ----------------------------------------------
{
  const { buildKashfReading } = await import('./goral-hachol/engine/kashf-reading-engine.js');
  const { interpretHawiQuestionInitial } = await import('./goral-hachol/engine/hawi-interpreter.js');
  assert(typeof buildKashfReading === 'function', 'kashf-reading-engine.js still exports buildKashfReading as a function');
  assert(typeof interpretHawiQuestionInitial === 'function', 'hawi-interpreter.js still exports interpretHawiQuestionInitial as a function');
}

// --- Extra: type guards sanity ------------------------------------------------
{
  assert(types.isMethod('kashf') && types.isMethod('hawi') && !types.isMethod('tarot'), 'isMethod works');
  assert(types.isRuleDecisionValue('conditional') && !types.isRuleDecisionValue('maybe'), 'isRuleDecisionValue works');
  assert(types.isPositiveInteger(1) && !types.isPositiveInteger(0) && !types.isPositiveInteger(-1) && !types.isPositiveInteger(1.5), 'isPositiveInteger works');
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
