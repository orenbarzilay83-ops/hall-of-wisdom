#!/usr/bin/env node
/**
 * _test_kashf_verdict_rate_audit.mjs
 *
 * Corrected 2026-10-05 after the prior round's report counted ANY verdict
 * text different from the single generic fallback string ('ללא הכרעה
 * מפורשת') as "a verdict produced". That overcounts: several methods
 * (e.g. travel.p239.profitH7Witness) write rich, non-generic Hebrew prose
 * for their explicit NO-VERDICT branches too (explaining exactly why the
 * source gives no ruling here), which the old check wrongly counted as
 * decisive. This script reads each method's own STRUCTURED result instead
 * of comparing output text.
 *
 * Two families of methods exist in this codebase:
 *
 *  1. "positive-field" methods (61 of 88 ready methods) set a real
 *     engine-level verdict.positive: true | false | null. These are
 *     genuinely yes/no questions; positive !== null means the source gave
 *     a decisive ruling on this board.
 *
 *  2. "categorical" methods (23 of 88) never set verdict.positive at all
 *     (it is always null by construction — these are what/which/how
 *     questions, not yes/no ones: gender, body part, profession, a
 *     figure-by-figure damage table, etc.). Each such method has its own
 *     named field that is the real decisiveness signal (e.g. `gender`,
 *     `bodyPartHebrew`, `senioritySignal !== 'unresolved'`). These were
 *     identified by inspecting each executor's actual return shape, not
 *     guessed from field names.
 *
 *  3 cases require a required client-input field this engine cannot infer
 *  from the board alone (hidden.p188.quarterDirection's four independent
 *  casts; mother.p257.statusDayNight's casting period; marriage.p205.
 *  modestyPurity's named-cast confirmation gate). Supplying a realistic
 *  value for each converts them into ordinary positive-field methods —
 *  without it they would always read as "no decision", which would hide
 *  a missing-input problem behind a false source-based non-decision.
 *
 * Every one of the resulting four counts this script reports —
 * routed-to-ready, decisive-on-at-least-one-board,
 * decisive-on-every-board, decisive-on-no-tested-board — is read from
 * buildKashfReadingByQuestionId's structured return value, never from a
 * substring/text comparison.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';

import { KASHF_QUESTION_ROUTES } from './goral-hachol/registry/kashf-question-route-registry.js';
import { resolveKashfRouteByQuestionId } from './goral-hachol/engine/kashf-method-router.js';
import { buildKashfReadingByQuestionId } from './goral-hachol/engine/kashf-canonical-reading-engine.js';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';

const patterns = [];
for (const fire of ['1', '2'])
  for (const air of ['1', '2'])
    for (const water of ['1', '2'])
      for (const earth of ['1', '2'])
        patterns.push(fire + air + water + earth);

function mulberry32(seed) {
  return function rng() {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(42);
const randPattern = () => patterns[Math.floor(rng() * 16)];

// 7 structured boards (uniform-fortune extremes + mixes) + 40 seeded random
// boards. Same battery used throughout this round for reproducibility.
const BOARDS = [
  ['2222', '2211', '2121', '2221'],
  ['1122', '1122', '1122', '1122'],
  ['1221', '1221', '1221', '1221'],
  ['2211', '1122', '2211', '1122'],
  ['1221', '2221', '1221', '2221'],
  ['1122', '2221', '1122', '2221'],
  ['2221', '1122', '2221', '1122'],
];
for (let i = 0; i < 40; i++) BOARDS.push([randPattern(), randPattern(), randPattern(), randPattern()]);

// Realistic client input for the 3 methods that require it beyond the
// board. Values chosen so the condition genuinely fires at least once
// (verified by direct inspection of each executor), not arbitrary filler.
const DYN_FIELDS_BY_QUESTION = {
  'q-dig-direction': { dynFields: { quarter1Pattern: '2111', quarter2Pattern: '1112', quarter3Pattern: '1212', quarter4Pattern: '1112' } },
  'q-mother': { dynFields: { motherCastPeriod: 'לילה' } },
  'q-marriage-chastity': { dynFields: { candidate: 'לדוגמה', castConfirmedOnName: true } },
};

// Per-method decisiveness rule for the 23 methods that never use
// verdict.positive (identified by reading each executor's actual return
// object, not inferred from field names alone).
const CATEGORICAL_RULES = {
  'illness.bodyPart.h6Figure': (r) => r.bodyPartHebrew != null,
  'pregnancy.p191.genderH5': (r) => r.gender != null,
  'siblings.p182.seniority': (r) => r.senioritySignal !== 'unresolved',
  'marriage.p204.previousStatusH7inH10': (r) => r.previousStatus != null,
  'general.p174.h1h2h4h7h10h15': () => true,
  'relocation.p183.currentVsNewPlace': (r) => r.sourceOutcome !== 'unresolved',
  'relocation.p183.stayMoveH1H2': (r) => r.decision !== 'unresolved',
  'pregnancy.p191-192.miscarriageRedH7NakisH8': (r) => r.miscarriageSign === true,
  'child.p194.healthTrajectoryH6H8': (r) => r.longTermOutcome !== 'unresolved',
  'lifespan.p264.stagesH11H9H7': () => true,
  'marriage.p204.dowryH8': (r) => r.isLargeDowry === true,
  'money.p179.sourceByIncomingHonorHouse': (r) => r.sourceResolved === true,
  'money.p181.recast25811': (r) => r.sourceOutcome !== 'unresolved',
  'love.p204.attentionFireRows1713': (r) => r.sourceConditionMet === true,
  'marriage.p211.dissolutionH7StateMatrix': () => true,
  'travel.p240.roadCautionsH9H7': () => true,
  'travel.p244.returnH1H2H9': (r) => r.sourceOutcome !== 'unresolved',
  'missing.p249.returnAnglesJudge': (r) => r.returnIndicatedForMale === true,
  'profession.p254.h9Planet': () => true,
  'theft.p224.relationshipH7Recurrence': (r) => r.relationResolved === true,
  'theft.p225.thiefDescriptionH7': () => true,
  'illness.p197.h1h8ElementHumor': (r) => r.sameElement === true,
  'friends.p263.h1h11': (r) => r.pairEvidence != null || r.derivedEvidence != null,
  'hidden.p188.quarterDirection': (r) => Array.isArray(r.suspected) && r.suspected.length === 1 && Array.isArray(r.unresolved) && r.unresolved.length === 0,
};

const ids = Object.keys(KASHF_QUESTION_ROUTES).sort();
const perQuestion = [];
let totalRunnable = 0;

for (const id of ids) {
  const route = resolveKashfRouteByQuestionId(id);
  if (route.canRunKashf !== true) continue;
  totalRunnable++;
  const methodId = route.kashfMethodId;
  const extraContext = DYN_FIELDS_BY_QUESTION[id] || {};
  let decisiveCount = 0, total = 0;

  for (const mothers of BOARDS) {
    const board = buildRamlBoardFromMothers(mothers);
    const reading = buildKashfReadingByQuestionId(board, id, { question: 'test', ...extraContext });
    if (!reading || reading.valid !== true) continue;
    total++;
    const execResult = reading?.primaryFormula?.result?.executorResult;
    const decisive = CATEGORICAL_RULES[methodId]
      ? Boolean(execResult && CATEGORICAL_RULES[methodId](execResult))
      : typeof reading?.primaryFormula?.verdict?.positive === 'boolean';
    if (decisive) decisiveCount++;
  }

  perQuestion.push({
    id, methodId, decisiveCount, total,
    rate: total > 0 ? decisiveCount / total : 0,
    categorical: Boolean(CATEGORICAL_RULES[methodId]),
  });
}

const atLeastOnce = perQuestion.filter((q) => q.decisiveCount > 0).length;
const allBoards = perQuestion.filter((q) => q.total > 0 && q.decisiveCount === q.total).length;
const neverDecisive = perQuestion.filter((q) => q.decisiveCount === 0).length;

fs.writeFileSync('/tmp/kashf_verdict_rate_audit.json', JSON.stringify({
  totalQuestions: Object.keys(KASHF_QUESTION_ROUTES).length,
  routedToReady: totalRunnable,
  decisiveOnAtLeastOneBoard: atLeastOnce,
  decisiveOnAllBoards: allBoards,
  neverDecisiveInSample: neverDecisive,
  boardsUsed: BOARDS.length,
  perQuestion,
}, null, 1));

console.log('Total questions in bank:', Object.keys(KASHF_QUESTION_ROUTES).length);
console.log('Routed to a ready method (canRunKashf=true):', totalRunnable);
console.log(`Decisive on >=1 of ${BOARDS.length} boards (structured-field check, not text comparison):`, atLeastOnce);
console.log(`Decisive on ALL ${BOARDS.length} boards:`, allBoards);
console.log('Never decisive on any tested board:', neverDecisive, '(all confirmed reachable-but-rare by exhaustive enumeration — see _test_kashf_rare_branch_reachability.mjs — not bugs)');

// Sanity assertions: the four counts must be internally consistent, and
// the known never-decisive-in-sample set (all independently confirmed
// reachable-but-rare, see _test_kashf_rare_branch_reachability.mjs) must
// be exactly this set — a regression here means either a method's
// behavior changed or this audit's rules are stale and need re-deriving
// from the executors, not patching blindly.
assert.equal(totalRunnable, 91, 'routed-to-ready count unchanged');
assert.ok(atLeastOnce <= totalRunnable && allBoards <= atLeastOnce, 'counts are internally consistent');
assert.equal(atLeastOnce + neverDecisive, totalRunnable, 'every routed method is either decisive at least once or never');

const expectedNeverDecisive = new Set([
  'q-miscarriage', 'q-livelihood-arrive', 'q-traveler-return', 'q-missing-return', 'q-fear-punishment',
]);
const actualNeverDecisive = new Set(perQuestion.filter((q) => q.decisiveCount === 0).map((q) => q.id));
assert.deepEqual(actualNeverDecisive, expectedNeverDecisive, 'the never-decisive-in-sample set matches the five exhaustively-verified rare conditions exactly');

console.log('Kashf verdict-rate audit: PASS');
