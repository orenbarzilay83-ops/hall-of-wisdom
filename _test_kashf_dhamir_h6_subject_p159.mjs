import assert from 'node:assert/strict';

import { buildKashfReadingByMethod } from './goral-hachol/engine/kashf-canonical-reading-engine.js';
import {
  resolveBestKashfAiRetrievalHit,
  getKashfAiRetrievalRecord,
} from './goral-hachol/registry/kashf-ai-retrieval-index.js';
import {
  getKashfMethod,
  validateKashfMethodRegistry,
} from './goral-hachol/registry/kashf-canonical-method-registry.js';

const METHOD_ID = 'dhamir.p159.subjectByH6Recurrence';

function makeBoard(overrides = {}) {
  const fallback = [
    '1111','1112','1121','1122','1211','1212','1221','1222',
    '2111','2112','2121','2122','2211','2212','2221','2222',
  ];
  const entries = fallback.map((pattern, i) => ({
    houseNumber: i + 1,
    house: i + 1,
    pattern,
    key: pattern,
    hebrewName: pattern,
  }));
  for (const [house, pattern] of Object.entries(overrides)) {
    const idx = Number(house) - 1;
    entries[idx] = {
      ...entries[idx],
      pattern,
      key: pattern,
      hebrewName: `צורה-${pattern}`,
    };
  }
  return { entries, boardValidation: { isValid: true, warnings: [] } };
}

// Registry + knowledge + retrieval are operationally aligned.
const method = getKashfMethod(METHOD_ID);
assert(method);
assert.equal(method.kashfIntentId, 'dhamir.identifyQuestionSubject');
assert.equal(method.runtimeAllowed, true);
assert.equal(method.executorStatus, 'ready');
assert.equal(validateKashfMethodRegistry().valid, true);

const record = getKashfAiRetrievalRecord(METHOD_ID);
assert(record);
assert.equal(record.runtimeAllowed, true);
assert.deepEqual(record.houses, [6]);

const exact = resolveBestKashfAiRetrievalHit('על מי השואל שואל', { runnableOnly: true });
assert.equal(exact.resolved, true);
assert.equal(exact.best?.kashfMethodId, METHOD_ID);

// This p159 route must NOT become the generic hidden-thought route.
const genericThought = resolveBestKashfAiRetrievalHit('מה הוא חושב עליי', { runnableOnly: true });
assert(
  genericThought.best?.kashfMethodId !== METHOD_ID || genericThought.resolved === false,
  'generic hidden-thought wording must not resolve to the p159 H6 subject-identification method'
);

// Unique recurrence: H6 figure repeats only in H3 => subject is H3.
const uniqueBoard = makeBoard({
  3: '2211',
  6: '2211',
});
const unique = buildKashfReadingByMethod(uniqueBoard, METHOD_ID, {
  question: 'על מי השואל שואל?',
});
assert.equal(unique.valid, true);
assert.equal(unique.canRunKashf, true);
assert.equal(unique.kashfMethodId, METHOD_ID);
assert.deepEqual(unique.canonicalExecution.methodsExecuted, [METHOD_ID]);
assert.equal(unique.primaryFormula.result.executorResult.status, 'resolved');
assert.equal(unique.primaryFormula.result.executorResult.resolvedHouseNumber, 3);
assert.match(unique.primaryFormula.result.executorResult.resolvedHouseRole, /אח|שכן|קרוב/);
assert.equal(unique.overallPositive, null);

// Multiple recurrences: source gives no precedence; retain ambiguity.
const multipleBoard = makeBoard({
  3: '2211',
  6: '2211',
  7: '2211',
});
const multiple = buildKashfReadingByMethod(multipleBoard, METHOD_ID, {
  question: 'על מי נסובה השאלה?',
});
assert.equal(multiple.valid, true);
assert.equal(multiple.primaryFormula.result.executorResult.status, 'ambiguous-multiple-recurrences');
assert.equal(multiple.primaryFormula.result.executorResult.resolvedHouseNumber, null);
assert.deepEqual(
  multiple.primaryFormula.result.executorResult.matches.map((m) => m.houseNumber),
  [3, 7]
);

// No recurrence outside H6: remain unresolved; never invent a house.
const noMatchBoard = makeBoard({ 6: '2211' });
const noMatch = buildKashfReadingByMethod(noMatchBoard, METHOD_ID, {
  question: 'על מי השואל שואל?',
});
assert.equal(noMatch.valid, true);
assert.equal(noMatch.primaryFormula.result.executorResult.status, 'no-recurrence');
assert.equal(noMatch.primaryFormula.result.executorResult.resolvedHouseNumber, null);
assert.deepEqual(noMatch.primaryFormula.result.executorResult.matches, []);

console.log('Batch 13 p159 H6 subject-identification: PASS');
console.log('exact intent only: PASS');
console.log('unique recurrence: PASS');
console.log('multiple recurrence ambiguity preserved: PASS');
console.log('generic hidden-thought isolation: PASS');
