import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { runKashfPack } from './_build/run.mjs';
import { buildQawlSpiritualReading } from './_build/runtime/goral-hachol/engine/qawl-spiritual-kashf-bridge.js';

const dir = path.dirname(fileURLToPath(import.meta.url));
const read = name => JSON.parse(fs.readFileSync(path.join(dir, '_build', name), 'utf8'));
const methods = read('CANONICAL_METHODS.json').methods;
const routes = read('QUESTION_ROUTES.json').routes;
const cases = read('GOLDEN_CASES.json').cases;
const source = read('SOURCE_INDEX.json');
const qawl = read('QAWL_SPIRITUAL_METHOD.json');
assert.match(execFileSync(process.execPath, [path.join(dir, '_build', 'SELF_TEST.mjs')], { encoding: 'utf8' }), /SELF_TEST PASS/);

assert.equal(methods.length, 46);
assert.equal(methods.filter(item => item.clientFacingCertified).length, 45);
assert.equal(routes.length, 138);
assert(routes.every(item => typeof item.label === 'string' && item.label.trim() && typeof item.description === 'string'));
assert.equal(source.records.length, 272);
assert.equal(source.spiritualQuestionCoverage.questionRoutes.length, 8);
assert.equal(source.spiritualQuestionCoverage.sourceMentions.length, 8);
for (const item of source.spiritualQuestionCoverage.questionRoutes) {
  assert.equal(routes.find(route => route.questionId === item.questionId)?.canRunKashf,
    item.runtimeStatus === 'READY', item.questionId);
}
assert.equal(source.sourceFreeze.filter(item => item.status === 'SOURCE_CONFLICT/NON_OPERATIONAL').length, 39);
const hiddenActionSource = source.records.find(item => item.entryId === 'gate6.house1.p167.hidden-work-diagnostic');
assert.equal(hiddenActionSource?.verificationStatus, 'VERIFIED');
assert.deepEqual(hiddenActionSource?.sourceDiscrepancies, []);
assert.equal(routes.find(item => item.questionId === 'q-hidden-action')?.canRunKashf, true);
for (const id of ['q-sorcery', 'q-sorcery-h10', 'q-jinn-type', 'q-sorcerer', 'q-obsession']) {
  assert.equal(routes.find(item => item.questionId === id)?.canRunKashf, false, id);
}
assert.deepEqual(qawl.questionIds, ['q-sorcery', 'q-sorcery-h10', 'q-jinn-type']);
assert.equal(qawl.directRules.length, 10);
for (const id of qawl.questionIds) assert.match(routes.find(route => route.questionId === id)?.supplementalRuntime || '', /^AL_QAWL/);
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

const spiritualMothers = ['1111', '1121', '2212', '1221'];
for (const questionId of qawl.questionIds) {
  const result = runKashfPack({ mothers: spiritualMothers, questionId });
  assert.equal(result.status, 'ok', questionId);
  assert.equal(result.sourceVolume, 'al-qawl-al-jami');
  assert.equal(result.sourceBook, qawl.sourceBook);
  assert.equal(result.openCount, 36);
  assert.equal(result.remainder, 1);
  assert.equal(result.verdict, null);
  assert.equal(result.clientAnswerDraft, null);
  assert.equal(result.safety.clientFacingCertified, false);
  assert(result.directEvidence.some(item => item.id === 'aqla-house13-bound-magic-sprinkled'));
  assert.equal(result.jinnTypeEvidence?.id === 'air-figure-flying-jinn', questionId === 'q-jinn-type');
}
for (const questionId of ['q-sorcerer', 'q-obsession']) {
  assert.equal(runKashfPack({ mothers: spiritualMothers, questionId }).status, 'blocked');
}
const nonJinn = runKashfPack({ mothers: ['1111', '1122', '2212', '1221'], questionId: 'q-jinn-type' });
assert.equal(nonJinn.remainder, 4);
assert.equal(nonJinn.jinnTypeEvidence, null);
assert.equal(runKashfPack({ mothers: ['2222','2222','2222','2222'], questionId: 'q-sorcery' }).status, 'blocked');
const boardWith = overrides => ({ entries: Array.from({ length: 16 }, (_, i) => ({
  houseNumber: i + 1, pattern: overrides[i + 1] || '1111',
})), boardValidation: { isValid: true } });
const derived = buildQawlSpiritualReading(boardWith({ 9: '2221', 10: '2221', 13: '2222' }));
assert(derived.directEvidence.some(item => item.id === 'jamaa-from-two-ankis-two-buried-magics-renewed'));
assert.equal(buildQawlSpiritualReading(boardWith({ 6: '2222' }), 'q-sorcery').directEvidence
  .some(item => item.id === 'jamaa-house6-umm-sibyan-blocks-marriage-pregnancy-children'), false);
assert.equal(buildQawlSpiritualReading(boardWith({ 6: '2222' }), 'q-sorcery', { gender: 'אישה' }).directEvidence
  .some(item => item.id === 'jamaa-house6-umm-sibyan-blocks-marriage-pregnancy-children'), true);

console.log(`Pack QA PASS: ${methods.length} Kashf methods, ${routes.length} routes, ${cases.length} fixed Kashf cases, 3 Qawl routes and spiritual boundaries.`);
