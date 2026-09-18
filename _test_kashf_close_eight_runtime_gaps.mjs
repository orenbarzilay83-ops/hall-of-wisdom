import assert from 'node:assert/strict';

import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { buildKashfReadingByQuestionId } from './goral-hachol/engine/kashf-canonical-reading-engine.js';
import { resolveKashfRouteByQuestionId } from './goral-hachol/engine/kashf-method-router.js';
import { KASHF_QUESTION_ROUTES } from './goral-hachol/registry/kashf-question-route-registry.js';
import { KASHF_CANONICAL_METHODS } from './goral-hachol/registry/kashf-canonical-method-registry.js';
import { getKashfV57Knowledge } from './goral-hachol/registry/kashf-v57-knowledge-registry.js';

const board = buildRamlBoardFromMothers(['2222', '2211', '2121', '2221']);

const runnableQuestions = [
  'q-message',
  'q-news-arrive',
  'q-well-drilling',
  'q-inheritance',
];
for (const questionId of runnableQuestions) {
  const route = resolveKashfRouteByQuestionId(questionId);
  assert.equal(route.canRunKashf, true, questionId + ' must be runnable');
  assert.equal(route.kashfRuntimeStatus, 'ready');
  assert.equal(route.executorStatus, 'ready');

  const reading = buildKashfReadingByQuestionId(board, questionId, { question: questionId });
  assert.equal(reading.valid, true, questionId + ' must produce a canonical reading');
  assert.equal(reading.canRunKashf, true);
  assert.equal(reading.canonicalExecution?.topicBundleExecuted, false);
  assert.deepEqual(reading.canonicalExecution?.methodsExecuted, [route.kashfMethodId]);
}

const blocked = {
  'q-lifespan': 'blocked-by-source',
  'q-lifespan-remaining': 'blocked-by-source',
  'q-mother': 'blocked-by-source',
  'q-dig-direction': 'repair-required',
};
for (const [questionId, expectedStatus] of Object.entries(blocked)) {
  const route = resolveKashfRouteByQuestionId(questionId);
  assert.equal(route.canRunKashf, false, questionId + ' must fail closed');
  assert.equal(route.kashfRuntimeStatus, expectedStatus);

  const reading = buildKashfReadingByQuestionId(board, questionId, { question: questionId });
  assert.equal(reading.valid, false);
  assert.equal(reading.canRunKashf, false);
  assert.equal(reading.kashfRuntimeStatus, expectedStatus);
}

// Global consistency: no question route may call itself source-ready while
// pointing to a method that still cannot execute.
for (const route of Object.values(KASHF_QUESTION_ROUTES)) {
  const method = KASHF_CANONICAL_METHODS[route.kashfMethodId];
  assert.ok(method, route.questionId + ' points to a missing method');
  assert.equal(method.kashfIntentId, route.kashfIntentId, route.questionId + ' intent mismatch');
  assert.equal(method.kashfRuntimeStatus, route.kashfRuntimeStatus, route.questionId + ' status mismatch');
  if (route.kashfRuntimeStatus === 'ready') {
    assert.equal(method.runtimeAllowed, true, route.questionId + ' ready route is runtime-blocked');
    assert.equal(method.executorStatus, 'ready', route.questionId + ' ready route has pending executor');
    assert.ok(getKashfV57Knowledge(route.kashfMethodId), route.questionId + ' ready route lacks v57 knowledge');
  }
}

// p180 source correction must include both derived figures and the final combination.
const inheritanceKnowledge = getKashfV57Knowledge('inheritance.p180.elementComposite');
assert.match(inheritanceKnowledge.v57.hebrewRule, /עפר מן הראשון/);
assert.match(inheritanceKnowledge.v57.hebrewRule, /אש מן החמישי/);
assert.match(inheritanceKnowledge.v57.hebrewRule, /משתי הצורות הוצא צורה שלישית/);

console.log('Eight canonical runtime gaps: PASS');
