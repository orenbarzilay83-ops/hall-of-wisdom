import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runKashfPack } from './_build/run.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const read = name => JSON.parse(fs.readFileSync(path.join(dir, '_build', name), 'utf8'));
const methods = read('CANONICAL_METHODS.json').methods;
const routes = read('QUESTION_ROUTES.json').routes;
const cases = read('GOLDEN_CASES.json').cases;
const source = read('SOURCE_INDEX.json');

assert.equal(methods.length, 46);
assert.equal(methods.filter(item => item.clientFacingCertified).length, 45);
assert.equal(routes.length, 138);
assert.equal(source.records.length, 272);
assert.equal(source.sourceFreeze.filter(item => item.status === 'SOURCE_CONFLICT/NON_OPERATIONAL').length, 39);
assert.equal(new Set(methods.map(item => item.methodId)).size, 46);
assert(methods.every(item => item.v57.hebrewRule && item.sourcePages.length));
assert(routes.every(item => item.canRunKashf !== true || methods.some(method => method.methodId === item.methodId)));

for (const item of cases) {
  const result = runKashfPack({ mothers: item.mothers, questionId: item.questionId });
  assert.equal(result.status, 'ok', item.id);
  assert.equal(result.methodId, item.methodId, item.id);
  assert.equal(result.sourcePage, item.sourcePage, item.id);
  const fields = result.methodResult?.executorResult;
  for (const [key, expected] of Object.entries(item.expected)) assert.equal(fields?.[key], expected, `${item.id}: ${key}`);
  assert.equal(result.safety.clientFacingCertified, true, item.id);
  assert.equal(result.clientAnswerDraft, null, 'raw engine wording cannot be sent as client draft');
}

const defaultMothers = ['2222', '2211', '2121', '2221'];
for (const item of methods) {
  const result = runKashfPack({ mothers: defaultMothers, methodId: item.methodId });
  assert.equal(result.status, 'ok', `${item.methodId}: ${result.reason}`);
  assert.equal(result.methodId, item.methodId);
  assert.equal(result.safety.clientFacingCertified, item.clientFacingCertified);
}
for (const questionId of ['q-best-city', 'q-lifespan', 'not-a-question']) {
  const result = runKashfPack({ mothers: defaultMothers, questionId });
  assert.equal(result.status, 'blocked', questionId);
  assert.equal(result.verdict, null, questionId);
  assert.equal(result.clientAnswerDraft, null, questionId);
}
assert.equal(runKashfPack({ mothers: defaultMothers, methodId: 'messenger.p176.recast14511' }).status, 'blocked');
assert.equal(runKashfPack({ mothers: defaultMothers, methodId: 'dhamir.p159.subjectByH6Recurrence' }).clientAnswerDraft, null);
assert.equal(runKashfPack({ mothers: ['1111'], questionId: 'q-pregnancy' }).status, 'blocked');

console.log(`Pack QA PASS: ${methods.length} runnable methods, ${routes.length} question routes, ${cases.length} fixed source cases, blocked routes and p159 client gate.`);
