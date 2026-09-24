import assert from 'node:assert/strict';

import { getKashfMethod, validateKashfMethodRegistry } from './goral-hachol/registry/kashf-canonical-method-registry.js';
import { resolveKashfRouteByQuestionId } from './goral-hachol/engine/kashf-method-router.js';
import { buildKashfReadingByMethod, buildKashfReadingByQuestionId } from './goral-hachol/engine/kashf-canonical-reading-engine.js';
import { getKashfAiRetrievalRecord, resolveBestKashfAiRetrievalHit } from './goral-hachol/registry/kashf-ai-retrieval-index.js';
import { isKashfMethodProfessionallyCertified } from './goral-hachol/intelligence/kashf-professional-verdict-safety.js';

function makeBoard(overrides = {}) {
  const fallback = ['1111','1112','1121','1122','1211','1212','1221','1222','2111','2112','2121','2122','2211','2212','2221','2222'];
  const entries = fallback.map((pattern, i) => ({
    house: i + 1, houseNumber: i + 1, pattern, key: pattern,
    hebrew: `צורה-${pattern}`, hebrewName: `צורה-${pattern}`,
  }));
  for (const [house, pattern] of Object.entries(overrides)) {
    const idx = Number(house) - 1;
    entries[idx] = { ...entries[idx], pattern, key: pattern, hebrew: `צורה-${pattern}`, hebrewName: `צורה-${pattern}` };
  }
  return { entries, boardValidation: { isValid: true, warnings: [] } };
}

assert.equal(validateKashfMethodRegistry().valid, true);

for (const [questionId, methodId] of [
  ['q-pregnancy', 'pregnancy.p191.existsH5SilentEmpty'],
  ['q-gender', 'pregnancy.p191.genderH5'],
  ['q-child-survive', 'pregnancy.p191.childSafetyH1H6H8'],
  ['q-birth-ease', 'pregnancy.p191.deliveryDifficultyH1H5H15'],
]) {
  const route = resolveKashfRouteByQuestionId(questionId);
  assert.equal(route.kashfMethodId, methodId);
  assert.equal(route.canRunKashf, true);
  const reading = buildKashfReadingByQuestionId(makeBoard({ 1:'2111', 5:'2111', 6:'2111', 8:'2111', 15:'2111' }), questionId);
  assert.equal(reading.valid, true);
  assert.deepEqual(reading.canonicalExecution?.methodsExecuted, [methodId]);
  assert.equal(reading.canonicalExecution?.topicSupportingChecksExecuted, false);
  assert.equal(reading.canonicalExecution?.topicBundleExecuted, false);
}

const twins = getKashfMethod('pregnancy.p191.twinsMujassad');
assert.equal(twins.kashfRuntimeStatus, 'blocked-by-source');
assert.equal(twins.runtimeAllowed, false);
assert.match(twins.notes || '', /مجسدا/);
assert.match(twins.notes || '', /Do not equate/i);

const miscarriageRoute = resolveKashfRouteByQuestionId('q-miscarriage');
assert.equal(miscarriageRoute.kashfMethodId, 'pregnancy.p191-192.miscarriageRedH7NakisH8');
assert.equal(miscarriageRoute.canRunKashf, true);
assert.equal(isKashfMethodProfessionallyCertified('pregnancy.p191-192.miscarriageRedH7NakisH8'), true);

const signReading = buildKashfReadingByQuestionId(makeBoard({ 7:'2122', 8:'2221' }), 'q-miscarriage');
const signExec = signReading.primaryFormula?.result?.executorResult;
assert.equal(signReading.valid, true);
assert.deepEqual(signReading.canonicalExecution?.methodsExecuted, ['pregnancy.p191-192.miscarriageRedH7NakisH8']);
assert.equal(signExec?.miscarriageSign, true);
assert.equal(signExec?.sourceOutcome, 'miscarriage-sign');
assert.equal(signReading.overallPositive, null);
assert.equal(signReading.canonicalExecution?.topicSupportingChecksExecuted, false);

const absentReading = buildKashfReadingByQuestionId(makeBoard({ 7:'2111', 8:'2221' }), 'q-miscarriage');
assert.equal(absentReading.primaryFormula?.result?.executorResult?.miscarriageSign, false);
assert.equal(absentReading.primaryFormula?.result?.executorResult?.sourceOutcome, 'unresolved');
assert.equal(absentReading.overallPositive, null);

for (const methodId of ['pregnancy.p192.genderH5H11InOut','pregnancy.p192.genderParityH1H6H8H12']) {
  const method = getKashfMethod(methodId);
  assert.equal(method.methodRole, 'educational-only');
  assert.equal(method.runtimeAllowed, false);
}
const maternal = getKashfMethod('pregnancy.p192.maternalSafetyH6H8H12');
assert.equal(maternal.kashfIntentId, 'pregnancy.maternalSafety');
assert.equal(maternal.runtimeAllowed, false);
assert.match(maternal.notes || '', /not fetal safety/i);
const months = getKashfMethod('pregnancy.p192.monthCount');
assert.equal(months.kashfRuntimeStatus, 'blocked-by-source');
assert.equal(months.runtimeAllowed, false);
assert.match(months.notes || '', /nine-by-nine/i);
assert.match(months.notes || '', /two month-count routes|two routes/i);

const childExistence = getKashfMethod('child.p194.existenceH1H5Nature');
assert.equal(childExistence.runtimeAllowed, false);
assert.match(childExistence.notes || '', /not a gate/i);
assert.equal(getKashfMethod('child.p194.wellbeingH5H16').runtimeAllowed, false);
const childHealth = buildKashfReadingByQuestionId(makeBoard({ 6:'1112', 8:'2211' }), 'q-child-health');
assert.equal(childHealth.valid, true);
assert.deepEqual(childHealth.canonicalExecution?.methodsExecuted, ['child.p194.healthTrajectoryH6H8']);
assert.deepEqual(childHealth.primaryFormula?.result?.executorResult?.housesUsed, [6,8]);
assert.equal(childHealth.canonicalExecution?.topicSupportingChecksExecuted, false);
assert.equal(getKashfMethod('pregnancy.p194.deliveryH5Weight').methodRole, 'educational-only');

const illness = buildKashfReadingByQuestionId(makeBoard({ 15:'2111', 1:'1112', 6:'1112', 8:'1112' }), 'q-illness-heal');
assert.equal(illness.valid, true);
assert.deepEqual(illness.canonicalExecution?.methodsExecuted, ['illness.p196.outcomeH15']);
assert.deepEqual(illness.primaryFormula?.result?.executorResult?.housesUsed, [15]);
assert.equal(illness.canonicalExecution?.topicSupportingChecksExecuted, false);
for (const methodId of ['illness.p196.h1RecurrenceDurationRisk','illness.p196.sensorySignsH6H8']) {
  const method = getKashfMethod(methodId);
  assert.equal(method.runtimeAllowed, false);
  assert.equal(buildKashfReadingByMethod(makeBoard(), methodId).valid, false);
}

for (const methodId of [
  'pregnancy.p191.twinsMujassad',
  'pregnancy.p191-192.miscarriageRedH7NakisH8',
  'pregnancy.p192.genderH5H11InOut',
  'pregnancy.p192.genderParityH1H6H8H12',
  'pregnancy.p192.maternalSafetyH6H8H12',
  'pregnancy.p192.monthCount',
  'child.p194.existenceH1H5Nature',
  'child.p194.wellbeingH5H16',
  'pregnancy.p194.deliveryH5Weight',
  'child.p194.healthTrajectoryH6H8',
  'illness.p196.h1RecurrenceDurationRisk',
  'illness.p196.sensorySignsH6H8',
  'illness.p196.outcomeH15',
]) assert(getKashfAiRetrievalRecord(methodId), methodId + ' has retrieval knowledge');

assert.equal(resolveBestKashfAiRetrievalHit('אדום בבית 7 שפל ראש בבית 8').best?.kashfMethodId, 'pregnancy.p191-192.miscarriageRedH7NakisH8');
assert.equal(resolveBestKashfAiRetrievalHit('H6 H8 H12 מיטיבים יולדת').best?.kashfMethodId, 'pregnancy.p192.maternalSafetyH6H8H12');
assert.equal(resolveBestKashfAiRetrievalHit('הפחת תשע תשע חודשי הריון').best?.kashfMethodId, 'pregnancy.p192.monthCount');
assert.equal(resolveBestKashfAiRetrievalHit('H1 בשישי המחלה מתארכת').best?.kashfMethodId, 'illness.p196.h1RecurrenceDurationRisk');
assert.equal(resolveBestKashfAiRetrievalHit('H15 מיטיב יתרפא').best?.kashfMethodId, 'illness.p196.outcomeH15');

console.log('Batch 21 House5 + illness p191-196 boundaries: PASS');
console.log('pregnancy/gender/safety/delivery/miscarriage intent isolation: PASS');
console.log('p192 maternal/month/gender alternatives remain separate: PASS');
console.log('p194 existence/wellbeing/health/delivery separation: PASS');
console.log('p196 recovery/duration/sensory separation: PASS');
