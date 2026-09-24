import assert from 'node:assert/strict';

import {
  getKashfMethod,
  validateKashfMethodRegistry,
} from './goral-hachol/registry/kashf-canonical-method-registry.js';
import { resolveKashfRouteByQuestionId } from './goral-hachol/engine/kashf-method-router.js';
import {
  buildKashfReadingByMethod,
  buildKashfReadingByQuestionId,
} from './goral-hachol/engine/kashf-canonical-reading-engine.js';
import {
  getKashfAiRetrievalRecord,
  resolveBestKashfAiRetrievalHit,
} from './goral-hachol/registry/kashf-ai-retrieval-index.js';
import { isKashfMethodProfessionallyCertified } from './goral-hachol/intelligence/kashf-professional-verdict-safety.js';

function makeBoard(overrides = {}) {
  const fallback = [
    '1111','1112','1121','1122','1211','1212','1221','1222',
    '2111','2112','2121','2122','2211','2212','2221','2222',
  ];
  const entries = fallback.map((pattern, i) => ({
    house: i + 1,
    houseNumber: i + 1,
    pattern,
    key: pattern,
    hebrew: `צורה-${pattern}`,
    hebrewName: `צורה-${pattern}`,
  }));
  for (const [house, pattern] of Object.entries(overrides)) {
    const idx = Number(house) - 1;
    entries[idx] = {
      ...entries[idx],
      pattern,
      key: pattern,
      hebrew: `צורה-${pattern}`,
      hebrewName: `צורה-${pattern}`,
    };
  }
  return { entries, boardValidation: { isValid: true, warnings: [] } };
}

const board = makeBoard({ 2: '2211', 10: '2121' });
assert.equal(validateKashfMethodRegistry().valid, true);

// B12 p179: exact body-source debt path exists, but fails closed.
for (const questionId of ['q-loan', 'q-loan-return']) {
  const route = resolveKashfRouteByQuestionId(questionId);
  assert.equal(route.kashfMethodId, 'debt.p179.creditorDebtorWalking');
  assert.equal(route.kashfRuntimeStatus, 'blocked-by-source');
  assert.equal(route.canRunKashf, false);
  assert.notEqual(route.kashfMethodId, 'loan.external.p234.repayment');
  const reading = buildKashfReadingByQuestionId(board, questionId, { question: 'האם החוב יוחזר?' });
  assert.equal(reading.valid, false);
  assert.equal(reading.reason, 'blocked-by-source');
}
const debtMethod = getKashfMethod('debt.p179.creditorDebtorWalking');
assert.match(debtMethod.notes || '', /walked two|walked three|Farah|Bakr/i);
assert.match(debtMethod.notes || '', /hand/i);

// B13 p180: comparison/amount procedure is source-backed but computationally blocked.
const p180 = getKashfMethod('money.p180.elementComparison');
assert.equal(p180.kashfIntentId, 'money.compareQuestionerAsked');
assert.equal(p180.kashfRuntimeStatus, 'blocked-by-source');
assert.equal(p180.runtimeAllowed, false);
assert.match(p180.notes || '', /lower element|monetary amount|יסוד|number/i);
const blocked180 = buildKashfReadingByMethod(board, 'money.p180.elementComparison');
assert.equal(blocked180.valid, false);
assert.equal(blocked180.reason, 'blocked-by-source');

// General money state has one exact primary route from p182, not the blocked p180 comparison.
const moneyStateRoute = resolveKashfRouteByQuestionId('q-money-state');
assert.equal(moneyStateRoute.kashfMethodId, 'money.p182.h2h10Outlook');
assert.equal(moneyStateRoute.canRunKashf, true);
const moneyState = buildKashfReadingByQuestionId(board, 'q-money-state', { question: 'מה מצב הממון?' });
assert.equal(moneyState.valid, true);
assert.deepEqual(moneyState.canonicalExecution?.methodsExecuted, ['money.p182.h2h10Outlook']);
assert.deepEqual(moneyState.primaryFormula?.result?.executorResult?.housesUsed, [2, 10]);
assert.equal(moneyState.canonicalExecution?.altFormulaExecuted, false);
assert.equal(moneyState.canonicalExecution?.topicSupportingChecksExecuted, false);
assert.equal(moneyState.canonicalExecution?.topicBundleExecuted, false);
assert.equal(isKashfMethodProfessionallyCertified('money.p182.h2h10Outlook'), true);

// The other House-2 intents keep exactly one selected route each.
assert.equal(resolveKashfRouteByQuestionId('q-money-source').kashfMethodId, 'money.p179.sourceByIncomingHonorHouse');
assert.equal(resolveKashfRouteByQuestionId('q-livelihood').kashfMethodId, 'money.p180.livelihoodH10Invert');
assert.equal(resolveKashfRouteByQuestionId('q-livelihood-arrive').kashfMethodId, 'money.p181.recast25811');
const acquire = buildKashfReadingByQuestionId(board, 'q-livelihood-arrive', { question: 'האם הממון יגיע?' });
if (acquire.valid) {
  assert.deepEqual(acquire.canonicalExecution?.methodsExecuted, ['money.p181.recast25811']);
  assert.equal(acquire.canonicalExecution?.altFormulaExecuted, false);
  assert.equal(acquire.canonicalExecution?.topicBundleExecuted, false);
}

// Printed p182 lawfulness exists, but “inclines to H9/H11” is not operationally defined.
const halalRoute = resolveKashfRouteByQuestionId('q-money-halal');
assert.equal(halalRoute.kashfMethodId, 'money.p182.lawfulnessInclination');
assert.equal(halalRoute.kashfRuntimeStatus, 'blocked-by-source');
assert.equal(halalRoute.canRunKashf, false);
const halal = buildKashfReadingByQuestionId(board, 'q-money-halal', { question: 'האם הממון מותר או אסור?' });
assert.equal(halal.valid, false);
assert.equal(halal.reason, 'blocked-by-source');

// p181 “other book” remainder table is both external/reference-only and source-conflicted.
const otherBook = getKashfMethod('money.p181.otherBookRemainder');
assert.equal(otherBook.sourceLayer, 'non-body-addition');
assert.equal(otherBook.attributedSourceBook, 'other');
assert.equal(otherBook.methodRole, 'educational-only');
assert.equal(otherBook.runtimeAllowed, false);
assert.match(otherBook.notes || '', /two by two|1–7|internally incompatible|divisor/i);
const blockedOtherBook = buildKashfReadingByMethod(board, 'money.p181.otherBookRemainder');
assert.equal(blockedOtherBook.valid, false);
assert.equal(blockedOtherBook.reason, 'attributed-reference-only');

// Broad old-debt UI remains distinct and is not silently generalized to p179.
assert.equal(resolveKashfRouteByQuestionId('q-debts').kashfMethodId, 'debt.outcome.unsupported');

// AI retrieval exposes the exact blocked/source boundaries without authorizing them.
for (const methodId of [
  'debt.p179.creditorDebtorWalking',
  'money.p180.elementComparison',
  'money.p181.otherBookRemainder',
  'money.p182.h2h10Outlook',
  'money.p182.lawfulnessInclination',
]) {
  const record = getKashfAiRetrievalRecord(methodId);
  assert(record, `${methodId} has AI retrieval knowledge`);
}
assert.equal(resolveBestKashfAiRetrievalHit('השוואת ממון השואל והנשאל לפי יסודות').best?.kashfMethodId, 'money.p180.elementComparison');
assert.equal(resolveBestKashfAiRetrievalHit('האם הממון מותר או אסור').best?.kashfMethodId, 'money.p182.lawfulnessInclination');

console.log('Batch 18 p179 debt + House2 routing/source boundaries: PASS');
console.log('p179 debt walking runtime hard stop: PASS');
console.log('p180 element/amount runtime hard stop: PASS');
console.log('p181 other-book remainder isolation: PASS');
console.log('House2 one-primary routes + p182 general money route: PASS');
