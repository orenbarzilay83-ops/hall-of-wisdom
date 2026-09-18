import assert from 'node:assert/strict';

import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { buildKashfReadingByQuestionId } from './goral-hachol/engine/kashf-canonical-reading-engine.js';
import { resolveKashfRouteByQuestionId } from './goral-hachol/engine/kashf-method-router.js';
import { getKashfMethod } from './goral-hachol/registry/kashf-canonical-method-registry.js';
import { KASHF_QUESTION_ROUTES } from './goral-hachol/registry/kashf-question-route-registry.js';
import {
  buildKashfAiContextPackage,
  buildAiSafeCanonicalKashfEngineOutput,
} from './goral-hachol/intelligence/kashf-ai-context-builder.js';

const MOTHERS = ['2222', '2211', '2121', '2221'];
const board = buildRamlBoardFromMothers(MOTHERS);

let runnable = 0;
let blocked = 0;
let aiVerdictAllowed = 0;
let aiVerdictBlockedByProfessionalSafety = 0;
const statuses = {};
const topicIds = new Set();

for (const questionId of Object.keys(KASHF_QUESTION_ROUTES)) {
  const route = resolveKashfRouteByQuestionId(questionId);
  assert.equal(route.ok, true, questionId + ': canonical route must resolve');

  const method = getKashfMethod(route.kashfMethodId);
  assert.ok(method, questionId + ': method must exist');
  assert.ok(method.topicId, questionId + ': canonical method must carry its own topicId');
  topicIds.add(method.topicId);

  const question = 'בדיקת Phase 5C — ' + questionId;
  const direct = buildKashfReadingByQuestionId(board, questionId, { question });
  const built = buildKashfAiContextPackage({
    mothers: MOTHERS,
    topicId: method.topicId,
    question,
    questionId,
    readingId: 'phase5c-' + questionId,
  });

  assert.ok(built.contextPackage, questionId + ': AI context package must be built');
  const rc = built.contextPackage.readingContext;
  assert.equal(rc.canonicalResolution?.questionId, questionId, questionId + ': AI keeps authoritative Question ID');
  assert.equal(rc.canonicalResolution?.authoritative, true, questionId + ': selected Question ID remains authoritative');
  assert.equal(rc.canonicalResolution?.kashfMethodId, route.kashfMethodId, questionId + ': client/AI method parity');
  assert.equal(rc.canonicalResolution?.kashfIntentId, route.kashfIntentId, questionId + ': client/AI intent parity');

  const expectedSafeOutput = buildAiSafeCanonicalKashfEngineOutput(direct);
  assert.deepEqual(
    rc.engineOutput,
    expectedSafeOutput,
    questionId + ': AI engineOutput must be the safe projection of the exact client canonical reading'
  );

  assert.equal(rc.engineOutput?.kashfMethodId, direct.kashfMethodId, questionId + ': engine method identity parity');
  assert.equal(rc.engineOutput?.kashfRuntimeStatus, direct.kashfRuntimeStatus, questionId + ': runtime-status parity');
  assert.equal(rc.engineOutput?.overallPositive, direct.overallPositive, questionId + ': verdict polarity parity');
  assert.deepEqual(rc.engineOutput?.verdict, direct.verdict, questionId + ': exact verdict parity');

  statuses[route.kashfRuntimeStatus] = (statuses[route.kashfRuntimeStatus] || 0) + 1;

  if (route.canRunKashf) {
    runnable++;
    assert.equal(direct.valid, true, questionId + ': every runnable route must produce a valid canonical reading');
    assert.equal(direct.canRunKashf, true);
    assert.equal(direct.canonicalExecution?.topicBundleExecuted, false, questionId + ': no broad topic bundle in client reading');
    assert.deepEqual(direct.canonicalExecution?.methodsExecuted, [route.kashfMethodId], questionId + ': exactly one method executed');
    assert.ok(rc.canonicalRetrieval?.v57?.hebrewRule, questionId + ': runnable AI path must carry v57 Hebrew operational rule');
    assert.ok(Array.isArray(rc.sourceEvidence) && rc.sourceEvidence.length >= 1, questionId + ': runnable AI path must carry source evidence');

    if (rc.aiVerdictAllowed === true) aiVerdictAllowed++;
    else aiVerdictBlockedByProfessionalSafety++;
  } else {
    blocked++;
    assert.equal(direct.valid, false, questionId + ': non-runnable route must fail closed');
    assert.notEqual(rc.aiVerdictAllowed, true, questionId + ': blocked route must never authorize AI verdict');
  }
}

assert.equal(Object.keys(KASHF_QUESTION_ROUTES).length, 138, 'Question Bank canonical route baseline');
assert.equal(runnable, 54, 'runnable route baseline');
assert.equal(blocked, 84, 'non-runnable route baseline');

// Phase 5D closure regression: an authoritative Question ID now supplies its
// canonical topic metadata; no duplicate caller topicId is required.
const topiclessProbe = buildKashfAiContextPackage({
  mothers: MOTHERS,
  question: 'האם הנסיעה תצליח?',
  questionId: 'q-travel-safe',
  readingId: 'phase5c-topicless-probe',
});
assert.ok(topiclessProbe.contextPackage, 'canonical Question ID builds AI context without caller topicId');
assert.equal(topiclessProbe.topicResolution?.authority, 'canonical-method');
assert.equal(topiclessProbe.topicResolution?.effectiveTopicId, 'travel');
assert.equal(topiclessProbe.contextPackage.readingContext.topicResolution?.effectiveTopicId, 'travel');

console.log('Phase 5C client↔AI canonical parity: PASS');
console.log('Questions audited:', Object.keys(KASHF_QUESTION_ROUTES).length);
console.log('Runnable:', runnable, 'Blocked/non-runnable:', blocked);
console.log('Runtime status counts:', JSON.stringify(statuses));
console.log('Distinct canonical topicIds:', topicIds.size);
console.log('AI verdict allowed among runnable:', aiVerdictAllowed);
console.log('Runnable but AI verdict withheld by professional safety:', aiVerdictBlockedByProfessionalSafety);
console.log('Phase 5D closure — canonical AI builder requires external topicId:', 'NO');
