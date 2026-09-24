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
  1:'1122', 2:'1112', 4:'2211', 6:'1211', 7:'2222',
  8:'1221', 9:'2111', 10:'1122', 12:'1212', 15:'2212',
});

assert.equal(validateKashfMethodRegistry().valid, true);

// p183 destination-quality route: ONE method only, no legacy alt/supporting bundle.
const destinationRoute = resolveKashfRouteByQuestionId('q-move-city');
assert.equal(destinationRoute.kashfMethodId, 'relocation.p183.h4h15');
assert.equal(destinationRoute.canRunKashf, true);
const destination = buildKashfReadingByQuestionId(board, 'q-move-city', { question: 'מה טיב המקום החדש?' });
assert.equal(destination.valid, true);
assert.deepEqual(destination.canonicalExecution?.methodsExecuted, ['relocation.p183.h4h15']);
assert.deepEqual(destination.primaryFormula?.houses, [4, 15]);
assert.equal(destination.canonicalExecution?.altFormulaExecuted, false);
assert.equal(destination.canonicalExecution?.topicSupportingChecksExecuted, false);
assert.equal(destination.canonicalExecution?.topicBundleExecuted, false);

// p183 two-city comparison preserves the benefic precondition but fails closed
// because the printed passage does not define the comparative strength metric.
const twoCities = getKashfMethod('relocation.p183.compare12vs78');
assert.equal(twoCities.kashfRuntimeStatus, 'blocked-by-source');
assert.equal(twoCities.runtimeAllowed, false);
assert.equal(twoCities.executorStatus, 'pending');
assert.match(twoCities.notes || '', /benefic precondition|benefic figures/i);
assert.match(twoCities.notes || '', /strength metric|strength/i);
assert.match(twoCities.notes || '', /H1\/H2\/H7\/H8\/H9/);
const twoCitiesRoute = resolveKashfRouteByQuestionId('q-best-city');
assert.equal(twoCitiesRoute.kashfMethodId, 'relocation.p183.compare12vs78');
assert.equal(twoCitiesRoute.canRunKashf, false);
const blockedTwoCities = buildKashfReadingByQuestionId(board, 'q-best-city', { question: 'איזו עיר עדיפה?' });
assert.equal(blockedTwoCities.valid, false);
assert.equal(blockedTwoCities.reason, 'blocked-by-source');

// p183 current-vs-new and repeated H1/H2 stay/move remain distinct exact routes.
const moveHome = buildKashfReadingByQuestionId(board, 'q-move-home', { question: 'האם לעבור דירה?' });
assert.equal(moveHome.valid, true);
assert.deepEqual(moveHome.canonicalExecution?.methodsExecuted, ['relocation.p183.currentVsNewPlace']);
assert.equal(moveHome.canonicalExecution?.topicSupportingChecksExecuted, false);

const stayPlace = buildKashfReadingByQuestionId(board, 'q-stay-place', { question: 'להישאר או לעבור?' });
assert.equal(stayPlace.valid, true);
assert.deepEqual(stayPlace.canonicalExecution?.methodsExecuted, ['relocation.p183.stayMoveH1H2']);
assert.equal(stayPlace.canonicalExecution?.topicSupportingChecksExecuted, false);

// p184 additional indicators are source-preserved but cannot be voted together.
const p184Indicators = getKashfMethod('relocation.p184.multiIndicatorStayMove');
assert.equal(p184Indicators.kashfRuntimeStatus, 'blocked-by-source');
assert.equal(p184Indicators.runtimeAllowed, false);
assert.match(p184Indicators.notes || '', /H6\/H7/);
assert.match(p184Indicators.notes || '', /H1\/H12/);
assert.match(p184Indicators.notes || '', /H2/);
assert.match(p184Indicators.notes || '', /no precedence|conflict-resolution|never aggregate|vote/i);
const blockedIndicators = buildKashfReadingByMethod(board, 'relocation.p184.multiIndicatorStayMove');
assert.equal(blockedIndicators.valid, false);
assert.equal(blockedIndicators.reason, 'blocked-by-source');

// pp184-185 house/garden mapping is exact, including corrected H7/H3,
// but runtime stays blocked because the passage does not define its witnesses.
const propertyMap = getKashfMethod('property.p184-185.houseGardenMap');
assert.equal(propertyMap.kashfRuntimeStatus, 'blocked-by-source');
assert.equal(propertyMap.runtimeAllowed, false);
assert.match(propertyMap.notes || '', /H4=land\/ground/);
assert.match(propertyMap.notes || '', /H10=trees/);
assert.match(propertyMap.notes || '', /H7=vegetables\/plants/);
assert.match(propertyMap.notes || '', /H3=water channels/);
assert.match(propertyMap.notes || '', /H2=the surrounding wall/);
assert.match(propertyMap.notes || '', /witness system/i);
const blockedPropertyMap = buildKashfReadingByMethod(board, 'property.p184-185.houseGardenMap');
assert.equal(blockedPropertyMap.valid, false);
assert.equal(blockedPropertyMap.reason, 'blocked-by-source');

// Selling a specific property is a different intent and must not be repurposed
// to the p184 ownership/house-garden passage.
const saleRoute = resolveKashfRouteByQuestionId('q-sell-property');
assert.equal(saleRoute.kashfMethodId, 'property.sale.unsupported');
assert.equal(saleRoute.canRunKashf, false);

// Retrieval must distinguish exact relocation intents and expose blocked source boundaries.
for (const methodId of [
  'relocation.p183.h4h15',
  'relocation.p183.currentVsNewPlace',
  'relocation.p183.stayMoveH1H2',
  'relocation.p183.compare12vs78',
  'relocation.p184.multiIndicatorStayMove',
  'property.p184-185.houseGardenMap',
]) {
  assert(getKashfAiRetrievalRecord(methodId), `${methodId} has retrieval knowledge`);
}

assert.equal(resolveBestKashfAiRetrievalHit('איזו משתי ערים טובה יותר').best?.kashfMethodId, 'relocation.p183.compare12vs78');
assert.equal(resolveBestKashfAiRetrievalHit('קרקע עצים צמחים תעלות חומה').best?.kashfMethodId, 'property.p184-185.houseGardenMap');
assert.equal(resolveBestKashfAiRetrievalHit('בית שני פנימי להישאר').best?.kashfMethodId, 'relocation.p184.multiIndicatorStayMove');

console.log('Batch 19 House3 relocation + pp184-185 property boundaries: PASS');
console.log('p183 exact relocation intent routing: PASS');
console.log('p184 multi-indicator no-vote boundary: PASS');
console.log('pp184-185 property map H7/H3 + witness hard stop: PASS');
console.log('property sale remains a distinct unsupported intent: PASS');
