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

const board = makeBoard({
  1:'1122', 2:'1122', 4:'1122', 13:'1122', 14:'1122', 15:'1122',
});

assert.equal(validateKashfMethodRegistry().valid, true);

// Physical hidden-object presence keeps ONE runnable p188 method.
const treasureRoute = resolveKashfRouteByQuestionId('q-treasure');
assert.equal(treasureRoute.kashfMethodId, 'hidden.p188.isStillThere');
assert.equal(treasureRoute.canRunKashf, true);
assert.equal(isKashfMethodProfessionallyCertified('hidden.p188.isStillThere'), true);
const treasure = buildKashfReadingByQuestionId(board, 'q-treasure', { question: 'האם הדבר הנסתר עדיין במקומו?' });
assert.equal(treasure.valid, true);
assert.deepEqual(treasure.canonicalExecution?.methodsExecuted, ['hidden.p188.isStillThere']);
assert.equal(treasure.canonicalExecution?.altFormulaExecuted, false);
assert.equal(treasure.canonicalExecution?.topicSupportingChecksExecuted, false);
assert.equal(treasure.canonicalExecution?.topicBundleExecuted, false);

// Direction UI selects ONLY the p188 four-cast procedure.
// It cannot execute until the dedicated additional-cast input flow exists.
const directionRoute = resolveKashfRouteByQuestionId('q-dig-direction');
assert.equal(directionRoute.kashfMethodId, 'hidden.p188.quarterDirection');
assert.equal(directionRoute.canRunKashf, false);
const directionReading = buildKashfReadingByQuestionId(board, 'q-dig-direction', { question: 'לאיזה כיוון לחפש?' });
assert.equal(directionReading.valid, false);
assert.equal(directionReading.kashfMethodId, 'hidden.p188.quarterDirection');

// p185 recursive arithmetic is blocked at the printed 94 vs apparent 16x4 conflict.
const p185 = getKashfMethod('hidden.p185.recursiveQuarterFireAir');
assert.equal(p185.kashfRuntimeStatus, 'blocked-by-source');
assert.equal(p185.runtimeAllowed, false);
assert.match(p185.notes || '', /94/);
assert.match(p185.notes || '', /16×4|64/);
assert.equal(buildKashfReadingByMethod(board, p185.kashfMethodId).valid, false);

// p186 alternatives are independent pending flows, not supporting votes.
const p186Name = getKashfMethod('hidden.p186.nameDayAbjadQuarter');
assert.equal(p186Name.kashfRuntimeStatus, 'ready');
assert.equal(p186Name.runtimeAllowed, false);
assert.match(p186Name.notes || '', /qibla/i);
assert.match(p186Name.notes || '', /1=east, 2=west, 3=south, 4=north/i);

const p186Tamtam = getKashfMethod('hidden.p186.tamtamFourQuarterCasts');
assert.equal(p186Tamtam.runtimeAllowed, false);
assert.match(p186Tamtam.notes || '', /TWO intermediate figures/i);
assert.match(p186Tamtam.notes || '', /must not be collapsed|aggregated|fallback/i);

// p187 restores two angle figures then a third, but the munshaat token is unresolved.
const p187 = getKashfMethod('hidden.p187.kindRootDirection');
assert.equal(p187.kashfRuntimeStatus, 'blocked-by-source');
assert.equal(p187.runtimeAllowed, false);
assert.match(p187.notes || '', /TWO figures from the angles/i);
assert.match(p187.notes || '', /ناحية الجاه/);
assert.match(p187.notes || '', /not source-secure as “north”/i);

// Well result and water depth are separate intents.
const wellRoute = resolveKashfRouteByQuestionId('q-well-drilling');
assert.equal(wellRoute.kashfMethodId, 'well.p188.recast1468');
assert.equal(wellRoute.canRunKashf, false);
const wellMethod = getKashfMethod('well.p188.recast1468');
assert.match(wellMethod.notes || '', /depth is a separate intent|water depth is a separate intent/i);

const openDepth = getKashfMethod('hiddenDepth.p188-189.openElementLengths');
const tamtamDepth = getKashfMethod('waterDepth.p189-190.tamtamTable');
assert.equal(openDepth.kashfRuntimeStatus, 'blocked-by-source');
assert.equal(tamtamDepth.kashfRuntimeStatus, 'blocked-by-source');
assert.notEqual(openDepth.kashfIntentId, tamtamDepth.kashfIntentId);
assert.match(openDepth.notes || '', /fire=one finger, air=one span, water=one cubit, earth=one stature/i);
assert.match(openDepth.notes || '', /two fingers and one span/i);
assert.match(tamtamDepth.notes || '', /H1\+H12/);
assert.match(tamtamDepth.notes || '', /H12\+H9/);
assert.match(tamtamDepth.notes || '', /Keep this method separate/i);

// p190 near/far is distinct; recursive inside-house method is blocked on مثلثة.
const p190Near = getKashfMethod('hidden.p190.nearFarElementDirection');
assert.equal(p190Near.kashfRuntimeStatus, 'ready');
assert.equal(p190Near.runtimeAllowed, false);
assert.match(p190Near.notes || '', /Moon and Mars indicate near/i);
assert.match(p190Near.notes || '', /earth=qibla/i);

const p190Recursive = getKashfMethod('hidden.p190-191.recursiveHouseTriangles');
assert.equal(p190Recursive.kashfRuntimeStatus, 'blocked-by-source');
assert.equal(p190Recursive.runtimeAllowed, false);
assert.match(p190Recursive.notes || '', /مثلثة/);
assert.match(p190Recursive.notes || '', /do not reduce/i);

// Abstract secrets stay unsupported and cannot be replaced by physical hidden-object methods.
const secretRoute = resolveKashfRouteByQuestionId('q-secrets');
assert.equal(secretRoute.kashfMethodId, 'hidden.abstractSecret.unsupported');
assert.equal(secretRoute.canRunKashf, false);

// Retrieval exposes each procedure without authorizing runtime or mixing them.
for (const methodId of [
  'hidden.p185.recursiveQuarterFireAir',
  'hidden.p186.nameDayAbjadQuarter',
  'hidden.p186.tamtamFourQuarterCasts',
  'hidden.p187.kindRootDirection',
  'hidden.p188.isStillThere',
  'hidden.p188.quarterDirection',
  'hiddenDepth.p188-189.openElementLengths',
  'waterDepth.p189-190.tamtamTable',
  'hidden.p190.nearFarElementDirection',
  'hidden.p190-191.recursiveHouseTriangles',
  'well.p188.recast1468',
]) {
  assert(getKashfAiRetrievalRecord(methodId), `${methodId} has retrieval knowledge`);
}

assert.equal(resolveBestKashfAiRetrievalHit('16 מקומות ארבעה חלקים 94').best?.kashfMethodId, 'hidden.p185.recursiveQuarterFireAir');
assert.equal(resolveBestKashfAiRetrievalHit('שתי צורות מן היתדות והשלישית משתיהן').best?.kashfMethodId, 'hidden.p187.kindRootDirection');
assert.equal(resolveBestKashfAiRetrievalHit('אש אצבע אוויר שעל מים אמה עפר קומה').best?.kashfMethodId, 'hiddenDepth.p188-189.openElementLengths');
assert.equal(resolveBestKashfAiRetrievalHit('H1 H12 H12 H9 עומק מים').best?.kashfMethodId, 'waterDepth.p189-190.tamtamTable');
assert.equal(resolveBestKashfAiRetrievalHit('مثلثة ארבעה כיוונים בתוך הבית').best?.kashfMethodId, 'hidden.p190-191.recursiveHouseTriangles');

console.log('Batch 20 House4 hidden-location/depth boundaries: PASS');
console.log('hidden-location alternatives are exact and non-aggregating: PASS');
console.log('p185 94 conflict + p187 munshaat + p190 مثلثة hard stops: PASS');
console.log('p188-190 depth frameworks remain separate and blocked: PASS');
console.log('q-treasure/q-dig-direction/q-well-drilling intent isolation: PASS');
