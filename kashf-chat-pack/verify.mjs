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

assert.equal(methods.length, 90);
assert.equal(methods.filter(item => item.clientFacingCertified).length, 87);
assert.equal(routes.length, 158);
assert(routes.every(item => typeof item.label === 'string' && item.label.trim() && typeof item.description === 'string'));
assert.equal(source.records.length, 275);
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
assert.equal(new Set(methods.map(item => item.methodId)).size, 90);
assert(methods.every(item => item.v57.hebrewRule && item.sourcePages.length));
assert(routes.every(item => item.canRunKashf !== true || methods.some(method => method.methodId === item.methodId)));
for (const [id, methodId] of [
  ['q-enemy-exists', 'enemy.p271.h1vsH12'], ['q-hidden-enemy', 'enemy.p271.h1vsH12'],
  ['q-enemy', 'enemy.p271.h1vsH12'], ['q-illness-type', 'illness.p197.h1h8ElementHumor'],
  ['q-friends', 'friends.p263.h1h11'],
]) {
  const route = routes.find(item => item.questionId === id);
  assert.equal(route?.canRunKashf, true);
  assert.equal(route?.methodId, methodId);
  assert.equal(methods.find(item => item.methodId === methodId)?.clientFacingCertified, true);
}
for (const [questionId, sourcePage, predicate] of [
  ['q-enemy-exists', 271, x => x.branch === 'querent-prevails' && x.enemyPresent === true],
  ['q-illness-type', 197, x => x.humor === null && x.sameElement === false],
]) {
  const result = runKashfPack({ mothers: ['2111', '1221', '1111', '1111'], questionId });
  assert.equal(result.status, 'ok');
  assert.equal(result.sourcePage, sourcePage);
  assert(predicate(result.methodResult?.executorResult || {}));
}

for (const { mothers, expected } of [
  { mothers: ['1112', '1111', '1111', '1111'], expected: true },
  { mothers: ['1111', '1112', '1112', '1111'], expected: false },
  { mothers: ['1111', '1111', '1111', '1111'], expected: null },
]) {
  const result = runKashfPack({ mothers, questionId: 'q-theft-return' });
  assert.equal(result.status, 'ok');
  assert.equal(result.methodId, 'theft.p224.recoveryH8');
  assert.equal(result.sourcePage, 224);
  assert.equal(result.methodResult?.executorResult?.stolenPropertyRecovered, expected);
  assert.equal(result.safety.authoritativePolarity, expected === null ? 'non-binary' : expected ? 'positive' : 'negative');
}

for (const item of cases) {
  const result = runKashfPack({ mothers: item.mothers, questionId: item.questionId });
  assert.equal(result.status, 'ok', item.id);
  assert.equal(result.methodId, item.methodId, item.id);
  assert.equal(result.sourcePage, item.sourcePage, item.id);
  const fields = result.methodResult?.executorResult;
  for (const [key, expected] of Object.entries(item.expected)) assert.equal(fields?.[key], expected, `${item.id}: ${key}`);
  assert.equal(result.safety.methodPolicyCertified, true, item.id);
  if (result.safety.clientFacingCertified) assert.equal(typeof result.clientAnswerDraft, 'string', item.id);
  else assert.equal(result.clientAnswerDraft, null, item.id);
}

const defaultMothers = ['2222', '2211', '2121', '2221'];
// Four legacy formula routes produce exact, short verdict.text rather than
// executorResult.clientSafeHebrew. Pin every outcome to a real board so the
// package can expose these texts without a generic advisor-text fallback.
for (const [methodId, cases] of [
  ['completion.p173.fireRows15910', [
    [['2222','2211','2121','2221'], null, 'צורה קבועה — אין הכרעה בדין השלמת העניין'],
    [['1122','1122','1122','1122'], false, 'העניין לא יושלם'],
    [['2211','1122','2211','1122'], true, 'העניין יושלם'],
  ]],
  ['relocation.p183.h4h15', [
    [['2222','2211','2121','2221'], true, 'המקום טוב ומבורך למעבר'],
    [['1221','1221','1221','1221'], false, 'המקום מזיק, יש קושי ועמל'],
    [['2221','1122','2221','1122'], null, 'המקום ממוצע — לא מצוין אך לא מזיק'],
  ]],
  ['siblings.p182.h1h3', [
    [['2222','2211','2121','2221'], true, 'הקשר עם האחים טוב, יש הסכמה'],
    [['1122','1122','1122','1122'], null, 'הקשר בינוני, יש מעלות וחסרונות'],
    [['2112','1222','2212','2121'], false, 'קיים קלקול ביחסים, מריבות'],
  ]],
  ['travel.p238.assemble1359', [
    [['2222','2211','2121','2221'], null, 'המסע עם אתגרים אך אפשרי'],
    [['2211','1122','2211','1122'], false, 'המסע מסוכן — יש להיזהר'],
    [['1122','2221','1122','2221'], true, 'המסע מבורך ונאה'],
  ]],
]) {
  for (const [mothers, positive, text] of cases) {
    const result = runKashfPack({ mothers, methodId });
    assert.equal(result.status, 'ok', methodId);
    assert.equal(result.verdict?.positive, positive, methodId);
    assert.equal(result.verdict?.text, text, methodId);
    assert.equal(result.clientAnswerDraft, text, methodId);
    assert.equal(result.safety.clientFacingCertified, true, methodId);
    assert.equal(result.methodResult?.executorResult, undefined, methodId);
  }
}
const extraInputByMethod = {
  'hidden.p188.quarterDirection': { quarterPatterns: ['2111', '1112', '1212', '1112'] },
  'mother.p257.statusDayNight': { motherCastPeriod: 'לילה' },
  'marriage.p205.modestyPurity': { candidate: 'שם בדיקה', castConfirmedOnName: true },
  'marriage.p208.womanQualityH5H4': { candidate: 'שם בדיקה', castConfirmedOnName: true },
};
for (const item of methods) {
  const result = runKashfPack({ mothers: defaultMothers, methodId: item.methodId, methodInputs: extraInputByMethod[item.methodId] });
  assert.equal(result.status, 'ok', `${item.methodId}: ${result.reason}`);
  assert.equal(result.methodId, item.methodId);
  assert.equal(result.safety.methodPolicyCertified, item.clientFacingCertified);
  assert.equal(result.safety.clientFacingCertified, Boolean(result.clientAnswerDraft));
  if (result.clientAnswerDraft) assert.doesNotMatch(result.clientAnswerDraft, /[\u0600-\u06ff]|(?:^|[^0-9])[12]{4}(?![0-9])|עמ[׳']/u);
}
assert.equal(runKashfPack({ mothers: defaultMothers, questionId: 'q-marriage-chastity', methodInputs: { candidate: 'שם בדיקה' } }).overallPositive, null,
  'a name alone never confirms a named cast');
assert.equal(runKashfPack({ mothers: defaultMothers, questionId: 'q-dig-direction' }).status, 'blocked',
  'four independent quarter casts are required');
assert.equal(runKashfPack({ mothers: defaultMothers, questionId: 'q-dig-direction', methodInputs: { quarterPatterns: ['2111', '1112', '1212', '1112'] } }).status, 'ok',
  'four supplied independent casts enable the dedicated direction method');
const meetingNoSign = runKashfPack({ mothers: ['1111', '1111', '1111', '1111'], questionId: 'q-missing-return-timing' });
assert.equal(meetingNoSign.safety.clientFacingCertified, true);
assert.match(meetingNoSign.clientAnswerDraft, /מועד הפגישה/);
assert.doesNotMatch(meetingNoSign.clientAnswerDraft, /מועד החזרה|עמ[׳']|[\u0600-\u06ff]/u);
const advisorOnly = runKashfPack({ mothers: defaultMothers, questionId: 'q-illness-heal' });
assert.equal(advisorOnly.status, 'ok');
assert.equal(advisorOnly.safety.methodPolicyCertified, true);
assert.equal(advisorOnly.safety.clientFacingCertified, false,
  'a policy certificate does not authorize raw advisor text as a client draft');
assert.equal(advisorOnly.clientAnswerDraft, null);
assert.match(advisorOnly.authoritativeEngineText, /עמ[׳']/u,
  'the original explanation is retained for the advisor only');
assert.equal(runKashfPack({ mothers: defaultMothers, questionId: 'q-illness-heal', methodInputs: { invented: true } }).status, 'blocked',
  'unlisted client inputs cannot bypass the package schema');
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
const zeroOpen = runKashfPack({ mothers: ['2222', '2222', '2222', '2222'], questionId: 'q-sorcery', gender: 'אישה' });
assert.equal(zeroOpen.status, 'ok');
assert.equal(zeroOpen.sourceStatus, 'partial-source-unresolved-zero-open');
assert.equal(zeroOpen.remainder, null);
assert.equal(zeroOpen.isqatEvidence, null);
assert(zeroOpen.directEvidence.some(item => item.id === 'jamaa-house6-umm-sibyan-blocks-marriage-pregnancy-children'));
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
assert.equal(runKashfPack({ mothers: ['2222','2222','2222','2222'], questionId: 'q-sorcery' }).sourceStatus, 'partial-source-unresolved-zero-open');
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
