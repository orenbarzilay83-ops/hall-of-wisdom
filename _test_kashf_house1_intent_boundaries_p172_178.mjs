import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

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
  // 2026-10-06: base board is now a REAL, structurally-consistent
  // board (uniform Jamaa/2222 in every position satisfies both the
  // Judge-parity check -- p.34 -- and the daughter/mother diagonal
  // check -- p.35 -- trivially, since every house equals every other),
  // not a naive 1111..2222 enumeration (which failed both). Overrides
  // below still replace only the specific houses each test cares
  // about.
  const fallback = Array(16).fill('2222');
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

const board = makeBoard({
  1:'1111', 2:'1122', 4:'2211', 7:'2222',
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

// Updated 2026-10-05: hope.p174.h5h11ThroughH1 was completed and promoted to
// 'ready' in an earlier round (computeHopeThroughTwoIntermediatesP174 is wired
// and tested in _test_kashf_p174_hope.mjs); this boundary test only needs to
// confirm it stays isolated from p173/p174-general, not re-assert its old
// repair-required state.
const p174Hope = getKashfMethod('hope.p174.h5h11ThroughH1');
assert.equal(p174Hope.kashfRuntimeStatus, 'ready');
assert.equal(p174Hope.runtimeAllowed, true);
assert.match(p174Hope.notes || '', /TWO intermediate|שתי|H5/);
const readyHope = buildKashfReadingByMethod(board, 'hope.p174.h5h11ThroughH1');
assert.equal(readyHope.valid, true);
assert.equal(readyHope.kashfMethodId, 'hope.p174.h5h11ThroughH1');
assert.equal(typeof readyHope.primaryFormula?.verdict?.text, 'string');

// p175-176 ruler chain is one bounded framework, still repair-required.
const rulerNeed = getKashfMethod('authority.p175-176.needBeforeRulerChain');
assert.equal(rulerNeed.kashfRuntimeStatus, 'repair-required');
assert.equal(rulerNeed.runtimeAllowed, false);

// p176 request, person-intent and meeting are exact source intents, not background checks.
// Updated 2026-10-05: request.p176.h1h2GateThenH1H4 and intent.p176.h7h10 were
// wired to computeRequestGateAndOutcomeP176/computePersonPurposeSignP176 in an
// earlier round and are now ready; meeting.p176.hopeHouseH1H13 remains pending.
for (const methodId of [
  'request.p176.h1h2GateThenH1H4',
  'intent.p176.h7h10',
]) {
  const method = getKashfMethod(methodId);
  assert(method, `${methodId} exists`);
  assert.equal(method.runtimeAllowed, true);
  assert.equal(method.executorStatus, 'ready');
  const result = buildKashfReadingByMethod(board, methodId);
  assert.equal(result.valid, true);
  assert.equal(result.kashfMethodId, methodId);
}

const meetingMethod = getKashfMethod('meeting.p176.hopeHouseH1H13');
assert(meetingMethod, 'meeting.p176.hopeHouseH1H13 exists');
assert.equal(meetingMethod.runtimeAllowed, false);
assert.equal(meetingMethod.executorStatus, 'pending');
const meetingResult = buildKashfReadingByMethod(board, 'meeting.p176.hopeHouseH1H13');
assert.equal(meetingResult.valid, false);
assert.equal(meetingResult.reason, 'executor-pending');

// p176 messenger recast: a later round found the five-malefic golden board had
// benefic neighbors and pulled this back to blocked-by-source (see its notes);
// updated 2026-10-05 to match that correction instead of the old ready state.
const messengerMethod = getKashfMethod('messenger.p176.recast14511');
assert.equal(messengerMethod.runtimeAllowed, false);
assert.equal(messengerMethod.executorStatus, 'pending');
assert.equal(messengerMethod.kashfRuntimeStatus, 'blocked-by-source');
assert.match(messengerMethod.notes || '', /separate derived board|source board/i);
const blockedMessenger = buildKashfReadingByMethod(board, 'messenger.p176.recast14511');
assert.equal(blockedMessenger.valid, false);
assert.equal(blockedMessenger.reason, 'blocked-by-source');

// q-message was later RENAMEd to the general p173 completion method rather
// than the still-blocked p176 messenger recast (q-debts and q-sell-property
// follow the same pattern elsewhere in the route registry).
const messengerRoute = resolveKashfRouteByQuestionId('q-message');
assert.equal(messengerRoute.kashfMethodId, 'completion.p173.fireRows15910');
assert.equal(messengerRoute.canRunKashf, true);
assert.match(readFileSync(new URL('./goral-hachol/ui/question-bank.js', import.meta.url), 'utf8'), /id: 'q-message',[\s\S]*?label: 'האם המשימה שנמסרה לשליח תושלם\?'/);
const messenger = buildKashfReadingByQuestionId(board, 'q-message', { question: 'האם המשימה שנמסרה לשליח תושלם?' });
assert.equal(messenger.valid, true);
assert.deepEqual(messenger.canonicalExecution.methodsExecuted, ['completion.p173.fireRows15910']);
const newsRoute = resolveKashfRouteByQuestionId('q-news-arrive');
assert.equal(newsRoute.kashfMethodId, 'news.arrival.unsupported');
assert.equal(newsRoute.aliasOf, null);
assert.equal(newsRoute.canRunKashf, false);
assert.equal(buildKashfReadingByQuestionId(board, 'q-news-arrive').reason, 'unsupported');

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
// level: the mod-16/Awtad-Mail-Zail procedure is fully confirmed (2026-10-04
// re-read), but the "جمع العناصر" input depends on the same unresolved
// SHIBUTZ_3 multi-element combination table as the dhamir sug-2 blocker.
const lifespan = getKashfMethod('lifespan.p178.elementCountToHouse');
assert.equal(lifespan.runtimeAllowed, false);
assert.equal(lifespan.executorStatus, 'pending');
assert.match(lifespan.notes || '', /SHIBUTZ_3_COMBINATION_RULE|multi-element/i);
assert.match(lifespan.notes || '', /Do not substitute dignity|Hawi|p264/i);
const lifespanRoute = resolveKashfRouteByQuestionId('q-lifespan');
assert.equal(lifespanRoute.kashfMethodId, 'lifespan.p178.elementCountToHouse');
assert.equal(lifespanRoute.canRunKashf, false);
const blockedLife = buildKashfReadingByQuestionId(board, 'q-lifespan', { question: 'כמה שנים?' });
assert.equal(blockedLife.valid, false);
assert.equal(blockedLife.reason, 'blocked-by-source');

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
console.log('p176 recast limited negative branch and news isolation: PASS');
console.log('p177 relative-thirteenth source block: PASS');
console.log('p178 lifespan computation block and p264 separation: PASS');
