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
    entries[idx] = { ...entries[idx], pattern, key: pattern, hebrew: `צורה-${pattern}`, hebrewName: `צורה-${pattern}` };
  }
  return { entries, boardValidation: { isValid: true, warnings: [] } };
}

const board = makeBoard({
  1:'1111', 2:'1122', 4:'2211', 5:'2111', 7:'2222',
  9:'1112', 10:'1122', 11:'2211', 13:'1211', 15:'2222', 16:'2111'
});

assert.equal(validateKashfMethodRegistry().valid, true);

// p172 exact outcome is runnable and isolated from p173 completion.
const p172Method = getKashfMethod('matter.p172.h17_h1011_thenCombine');
assert.equal(p172Method.runtimeAllowed, true);
assert.match(p172Method.notes || '', /H16|16-position|שישה/);
const p172 = buildKashfReadingByQuestionId(board, 'q-matter-end', { question: 'מה תוצאת העניין?' });
assert.equal(p172.valid, true);
assert.deepEqual(p172.canonicalExecution?.methodsExecuted, ['matter.p172.h17_h1011_thenCombine']);
assert.equal(p172.canonicalExecution?.altFormulaExecuted, false);
assert.equal(p172.canonicalExecution?.topicSupportingChecksExecuted, false);
assert.equal(p172.canonicalExecution?.topicBundleExecuted, false);
assert.match(p172.hebrewKnowledge?.hebrewRule || '', /שישה־עשר|השישה/);

// p173 completion remains a separate selected primary; quoted H1+H16 is not executed.
const p173 = buildKashfReadingByQuestionId(board, 'q-success', { question: 'האם העניין יושלם?' });
assert.equal(p173.valid, true);
assert.deepEqual(p173.canonicalExecution?.methodsExecuted, ['completion.p173.fireRows15910']);
assert.equal(p173.altFormula, null);

// p174 general state stays distinct from the p174 hope algorithm.
const general = buildKashfReadingByQuestionId(board, 'q-general-state', { question: 'מה מצבי הכללי?' });
assert.equal(general.valid, true);
assert.deepEqual(general.canonicalExecution?.methodsExecuted, ['general.p174.h1h2h4h7h10h15']);

const p174Hope = getKashfMethod('hope.p174.h5h11ThroughH1');
assert.equal(p174Hope.kashfRuntimeStatus, 'repair-required');
assert.equal(p174Hope.runtimeAllowed, false);
assert.match(p174Hope.notes || '', /TWO intermediate|שתי|H5/);
const blockedHope = buildKashfReadingByMethod(board, 'hope.p174.h5h11ThroughH1');
assert.equal(blockedHope.valid, false);
assert.equal(blockedHope.reason, 'repair-required');

// p175-176 ruler chain is one bounded framework, still repair-required.
const rulerNeed = getKashfMethod('authority.p175-176.needBeforeRulerChain');
assert.equal(rulerNeed.kashfRuntimeStatus, 'repair-required');
assert.equal(rulerNeed.runtimeAllowed, false);

// p176 request, person-intent and meeting are exact source intents, not background checks.
for (const methodId of [
  'request.p176.h1h2GateThenH1H4',
  'intent.p176.h7h10',
  'meeting.p176.hopeHouseH1H13',
]) {
  const method = getKashfMethod(methodId);
  assert(method, `${methodId} exists`);
  assert.equal(method.runtimeAllowed, false);
  assert.equal(method.executorStatus, 'pending');
  const result = buildKashfReadingByMethod(board, methodId);
  assert.equal(result.valid, false);
  assert.equal(result.reason, 'executor-pending');
}

// p176 messenger recast: source is known but runtime must fail closed until
// a dedicated derived-board executor preserves source and derived boards separately.
const messengerMethod = getKashfMethod('messenger.p176.recast14511');
assert.equal(messengerMethod.runtimeAllowed, false);
assert.equal(messengerMethod.executionKind, 'recast-board');
assert.equal(messengerMethod.executorStatus, 'pending');
assert.match(messengerMethod.notes || '', /separate derived board|NEW board|Source board/i);
const messengerRoute = resolveKashfRouteByQuestionId('q-message');
assert.equal(messengerRoute.kashfMethodId, 'messenger.p176.recast14511');
assert.equal(messengerRoute.canRunKashf, false);
const messenger = buildKashfReadingByQuestionId(board, 'q-message', { question: 'האם המסר יגיע?' });
assert.equal(messenger.valid, false);
assert.equal(messenger.reason, 'executor-pending');

// p177 recursive relative-thirteenth remains source-blocked, with no inferred mapping.
const p177 = getKashfMethod('person.p177.relativeThirteenth');
assert.equal(p177.kashfRuntimeStatus, 'blocked-by-source');
assert.equal(p177.runtimeAllowed, false);
assert.match(p177.notes || '', /معموم/);
assert.match(p177.notes || '', /relative-thirteenth|thirteenth/i);
const blocked177 = buildKashfReadingByMethod(board, 'person.p177.relativeThirteenth');
assert.equal(blocked177.valid, false);
assert.equal(blocked177.reason, 'blocked-by-source');

// p178 lifespan duration is source-known but computationally blocked at executor
// level until the exact figure-number-in-house lookup is certified.
const lifespan = getKashfMethod('lifespan.p178.elementCountToHouse');
assert.equal(lifespan.kashfRuntimeStatus, 'ready');
assert.equal(lifespan.runtimeAllowed, false);
assert.equal(lifespan.executorStatus, 'pending');
assert.match(lifespan.notes || '', /figure number in that house|מספר|certified/i);
assert.match(lifespan.notes || '', /Do not substitute dignity|Hawi|p264/i);
const lifespanRoute = resolveKashfRouteByQuestionId('q-lifespan');
assert.equal(lifespanRoute.kashfMethodId, 'lifespan.p178.elementCountToHouse');
assert.equal(lifespanRoute.canRunKashf, false);
const blockedLife = buildKashfReadingByQuestionId(board, 'q-lifespan', { question: 'כמה שנים?' });
assert.equal(blockedLife.valid, false);
assert.equal(blockedLife.reason, 'executor-pending');

// p264 life stages is a distinct runnable intent; p178/183 stay-or-move remains
// a distinct runnable relocation intent.
const stages = buildKashfReadingByQuestionId(board, 'q-lifespan-stages', { question: 'שלבי החיים' });
assert.equal(stages.valid, true);
assert.equal(stages.kashfMethodId, 'lifespan.p264.stagesH11H9H7');

const stayMove = buildKashfReadingByQuestionId(
  makeBoard({ 1:'1122', 2:'1112' }),
  'q-stay-place',
  { question: 'האם להישאר או לעבור?' }
);
assert.equal(stayMove.valid, true);
assert.equal(stayMove.kashfMethodId, 'relocation.p183.stayMoveH1H2');

// Blocked exact intents remain retrievable as knowledge but not executable.
for (const [query, methodId] of [
  ['באיזה בית ענייני ורווחי', 'matter.p172.locationH2H16'],
  ['הבית השלושה עשר היחסי', 'person.p177.relativeThirteenth'],
]) {
  const hit = resolveBestKashfAiRetrievalHit(query);
  assert.equal(hit.resolved, true);
  assert.equal(hit.best?.kashfMethodId, methodId);
  assert.equal(hit.best?.runtimeAllowed, false);
  assert(getKashfAiRetrievalRecord(methodId));
}

console.log('Batch 17 p172-178 intent separation: PASS');
console.log('p172/p173/p174 runnable intents remain isolated: PASS');
console.log('p176 recast derived-board runtime block: PASS');
console.log('p177 relative-thirteenth source block: PASS');
console.log('p178 lifespan computation block and p264 separation: PASS');
