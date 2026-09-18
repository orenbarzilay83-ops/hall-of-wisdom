import assert from 'node:assert/strict';

import { KASHF_QUESTION_ROUTES } from './goral-hachol/registry/kashf-question-route-registry.js';
import { getKashfMethod } from './goral-hachol/registry/kashf-canonical-method-registry.js';
import { resolveKashfRouteByQuestionId } from './goral-hachol/engine/kashf-method-router.js';
import {
  buildKashfAiContextPackage,
  buildRuleCoverageStatus,
  KASHF_AI_CONTEXT_BUILDER_VERSION,
} from './goral-hachol/intelligence/kashf-ai-context-builder.js';

const MOTHERS = ['2222', '2211', '2121', '2221'];
const questionIds = Object.keys(KASHF_QUESTION_ROUTES);

assert.equal(KASHF_AI_CONTEXT_BUILDER_VERSION, 'kashf-ai-context-builder-v10');

// 1. Whole-bank authority: Question ID -> Method -> canonical topic.
// Caller topicId is omitted on purpose for all 138 routes.
for (const questionId of questionIds) {
  const route = resolveKashfRouteByQuestionId(questionId);
  const method = getKashfMethod(route.kashfMethodId);

  assert.ok(route.ok, questionId + ': route resolves');
  assert.ok(method?.topicId, questionId + ': method owns a canonical topic');
  assert.equal(route.topicId, method.topicId, questionId + ': router exposes method-owned topic');

  const built = buildKashfAiContextPackage({
    mothers: MOTHERS,
    question: 'בדיקת סמכות נושא — ' + questionId,
    questionId,
    readingId: 'phase5d-' + questionId,
  });

  assert.ok(built.contextPackage, questionId + ': no caller topicId required');
  assert.equal(built.topicResolution?.authority, 'canonical-method', questionId + ': canonical method owns topic authority');
  assert.equal(built.topicResolution?.canonicalTopicId, method.topicId, questionId + ': canonical topic matches method registry');
  assert.equal(built.topicResolution?.effectiveTopicId, method.topicId, questionId + ': effective topic is canonical');
  assert.equal(built.topicResolution?.callerTopicId, null, questionId + ': no hidden caller topic');
  assert.equal(built.topicResolution?.callerConflict, false, questionId + ': no conflict without caller topic');

  const rc = built.contextPackage.readingContext;
  assert.equal(rc.canonicalResolution?.topicId, method.topicId, questionId + ': AI bridge resolution carries canonical topic');
  assert.equal(rc.topicResolution?.effectiveTopicId, method.topicId, questionId + ': payload exposes topic authority trace');
  assert.equal(built.contextPackage.readingPlan?.topicId, method.topicId, questionId + ': planner uses canonical topic');
  assert.deepEqual(
    rc.ruleCoverageStatus,
    buildRuleCoverageStatus(method.topicId),
    questionId + ': rule coverage uses canonical topic'
  );
}

// 2. Conflicting caller metadata is diagnostic only; it cannot steer routing
// or AI metadata away from the canonical selected method.
{
  const built = buildKashfAiContextPackage({
    mothers: MOTHERS,
    topicId: 'commerce',
    question: 'האם הנסיעה תצליח?',
    questionId: 'q-travel-safe',
    readingId: 'phase5d-conflict',
  });

  assert.ok(built.contextPackage);
  assert.equal(built.topicResolution.authority, 'canonical-method');
  assert.equal(built.topicResolution.callerTopicId, 'commerce');
  assert.equal(built.topicResolution.canonicalTopicId, 'travel');
  assert.equal(built.topicResolution.effectiveTopicId, 'travel');
  assert.equal(built.topicResolution.callerConflict, true);
  assert.equal(built.contextPackage.readingPlan?.topicId, 'travel');
  assert.equal(built.contextPackage.readingContext.canonicalResolution?.kashfMethodId, 'travel.p238.assemble1359');
  assert.deepEqual(
    built.contextPackage.readingContext.ruleCoverageStatus,
    buildRuleCoverageStatus('travel'),
    'conflicting caller topic cannot contaminate canonical rule coverage'
  );
}

// 3. Canonical free-text retrieval can also derive its topic when it resolves
// uniquely. No Question ID and no caller topicId are supplied.
{
  const built = buildKashfAiContextPackage({
    mothers: MOTHERS,
    question: 'בתולה או גרושה',
    useCanonicalRetrieval: true,
    readingId: 'phase5d-free-text',
  });

  assert.ok(built.contextPackage, 'resolved free-text canonical retrieval builds without caller topicId');
  assert.equal(built.canonicalBridge?.resolution?.state, 'resolved');
  assert.equal(built.topicResolution?.authority, 'canonical-method');
  assert.equal(built.topicResolution?.effectiveTopicId, built.canonicalBridge?.resolution?.topicId);
  assert.equal(built.contextPackage.readingPlan?.topicId, built.topicResolution?.effectiveTopicId);
}

// 4. Legacy/non-canonical flow still needs an explicit topicId. Phase 5D does
// not invent a topic when no canonical method exists.
{
  const built = buildKashfAiContextPackage({
    mothers: MOTHERS,
    question: 'שאלה כללית ללא ניתוב קנוני',
    readingId: 'phase5d-legacy-no-topic',
  });

  assert.equal(built.contextPackage, null);
  assert.equal(built.topicResolution?.authority, 'none');
  assert.ok(built.missingFields.some((x) => String(x).includes('topicId')));
}

assert.equal(questionIds.length, 138);
console.log('Phase 5D canonical topic authority: PASS');
console.log('Question routes verified without caller topicId:', questionIds.length);
console.log('Conflicting caller topic is diagnostic-only: PASS');
console.log('Resolved free-text retrieval topic derivation: PASS');
console.log('Legacy no-topic fail-closed: PASS');
