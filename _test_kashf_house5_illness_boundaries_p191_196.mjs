import assert from 'node:assert/strict';

import { getKashfMethod, validateKashfMethodRegistry } from './goral-hachol/registry/kashf-canonical-method-registry.js';
import { resolveKashfRouteByQuestionId } from './goral-hachol/engine/kashf-method-router.js';
import { buildKashfReadingByMethod, buildKashfReadingByQuestionId } from './goral-hachol/engine/kashf-canonical-reading-engine.js';
import { getKashfAiRetrievalRecord, resolveBestKashfAiRetrievalHit } from './goral-hachol/registry/kashf-ai-retrieval-index.js';
import { isKashfMethodProfessionallyCertified } from './goral-hachol/intelligence/kashf-professional-verdict-safety.js';

function makeBoard(overrides = {}) {
  const fallback = Array(16).fill('2222'); // 2026-10-06: real, structurally-consistent base (see other boundary files for rationale)
  const entries = fallback.map((pattern, i) => ({
    house: i + 1, houseNumber: i + 1, pattern, key: pattern,
    hebrew: `צורה-${pattern}`, hebrewName: `צורה-${pattern}`,
  }));
  for (const [house, pattern] of Object.entries(overrides)) {
    const idx = Number(house) - 1;
    entries[idx] = { ...entries[idx], pattern, key: pattern, hebrew: `צורה-${pattern}`, hebrewName: `צורה-${pattern}` };
  }
  // Auto-repair structural consistency (Kashf p.34 Judge parity is
  // unaffected here; this repairs p.35's mother/daughter diagonal) for
  // whichever of a mother(1-4)/daughter(5-8) pair the caller did NOT
  // explicitly override, so overriding just one does not silently
  // produce a board the structural-integrity gate would reject for a
  // reason this test never intended to exercise. If the caller
  // overrides BOTH sides of a pair, their explicit values are trusted
  // as-is.
  for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
    const motherHouse = rowIndex + 1;
    const daughterHouse = 5 + rowIndex;
    const motherGiven = motherHouse in overrides || String(motherHouse) in overrides;
    const daughterGiven = daughterHouse in overrides || String(daughterHouse) in overrides;
    if (motherGiven && !daughterGiven) {
      const motherPattern = entries[motherHouse - 1].pattern;
      const d = entries[daughterHouse - 1];
      const fixed = d.pattern.slice(0, rowIndex) + motherPattern[rowIndex] + d.pattern.slice(rowIndex + 1);
      entries[daughterHouse - 1] = { ...d, pattern: fixed, key: fixed, hebrewName: `צורה-${fixed}`, ...(d.hebrew !== undefined ? { hebrew: `צורה-${fixed}` } : {}) };
    } else if (daughterGiven && !motherGiven) {
      const daughterPattern = entries[daughterHouse - 1].pattern;
      const m = entries[motherHouse - 1];
      const fixed = m.pattern.slice(0, rowIndex) + daughterPattern[rowIndex] + m.pattern.slice(rowIndex + 1);
      entries[motherHouse - 1] = { ...m, pattern: fixed, key: fixed, hebrewName: `צורה-${fixed}`, ...(m.hebrew !== undefined ? { hebrew: `צורה-${fixed}` } : {}) };
    }
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
  const reading = buildKashfReadingByQuestionId(makeBoard({ 1:'2111', 5:'2111', 6:'2111', 8:'2111', 15:'2112' }), questionId);
  assert.equal(reading.valid, true);
  assert.deepEqual(reading.canonicalExecution?.methodsExecuted, [methodId]);
  assert.equal(reading.canonicalExecution?.topicSupportingChecksExecuted, false);
  assert.equal(reading.canonicalExecution?.topicBundleExecuted, false);
}

const twins = getKashfMethod('pregnancy.p191.twinsMujassad');
assert.equal(twins.kashfRuntimeStatus, 'ready');
assert.equal(twins.runtimeAllowed, true);
assert.equal(twins.executorStatus, 'ready');
assert.match(twins.notes || '', /مجسد/);
assert.match(twins.notes || '', /NOT the same set as the canonical classifier/i);

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
// 2026-10-06: opened this round (see _test_kashf_p192_194_196_closed_subrules.mjs
// for the full positive/negative branch coverage) -- now ready/runtimeAllowed,
// not pending as this file previously asserted.
const maternal = getKashfMethod('pregnancy.p192.maternalSafetyH6H8H12');
assert.equal(maternal.kashfIntentId, 'pregnancy.maternalSafety');
assert.equal(maternal.runtimeAllowed, true);
assert.equal(maternal.executorStatus, 'ready');
assert.match(maternal.notes || '', /not fetal safety/i);
const months = getKashfMethod('pregnancy.p192.monthCount');
assert.equal(months.kashfRuntimeStatus, 'blocked-by-source');
assert.equal(months.runtimeAllowed, false);
assert.match(months.notes || '', /nine-by-nine/i);
assert.match(months.notes || '', /two month-count routes|two routes/i);

const childExistence = getKashfMethod('child.p194.existenceH1H5Nature');
assert.equal(childExistence.runtimeAllowed, false);
assert.match(childExistence.notes || '', /not a gate/i);
// 2026-10-06: opened this round (see _test_kashf_p192_194_196_closed_subrules.mjs).
assert.equal(getKashfMethod('child.p194.wellbeingH5H16').runtimeAllowed, true);
const childHealth = buildKashfReadingByQuestionId(makeBoard({ 6:'1112', 8:'2211' }), 'q-child-health');
assert.equal(childHealth.valid, true);
assert.deepEqual(childHealth.canonicalExecution?.methodsExecuted, ['child.p194.healthTrajectoryH6H8']);
assert.deepEqual(childHealth.primaryFormula?.result?.executorResult?.housesUsed, [6,8]);
assert.equal(childHealth.canonicalExecution?.topicSupportingChecksExecuted, false);
assert.equal(getKashfMethod('pregnancy.p194.deliveryH5Weight').methodRole, 'educational-only');

const illness = buildKashfReadingByQuestionId(makeBoard({ 15:'2112', 1:'1112', 6:'1112', 8:'1112' }), 'q-illness-heal');
assert.equal(illness.valid, true);
assert.deepEqual(illness.canonicalExecution?.methodsExecuted, ['illness.p196.outcomeH15']);
assert.deepEqual(illness.primaryFormula?.result?.executorResult?.housesUsed, [15]);
assert.equal(illness.canonicalExecution?.topicSupportingChecksExecuted, false);
// 2026-10-06: both opened this round (see _test_kashf_p192_194_196_closed_subrules.mjs).
for (const methodId of ['illness.p196.h1RecurrenceDurationRisk','illness.p196.sensorySignsH6H8']) {
  const method = getKashfMethod(methodId);
  assert.equal(method.runtimeAllowed, true);
  assert.equal(buildKashfReadingByMethod(makeBoard(), methodId).valid, true);
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
