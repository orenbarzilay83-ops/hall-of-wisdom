#!/usr/bin/env node
/**
 * _test_kashf_missing_p249_return_life.mjs
 *
 * Golden tests for the two p249 methods opened this round:
 *   - missing.p249.returnTimingTariqH10H11 (new intent: missing.returnTiming)
 *   - missing.p249.lifeStatusH8H14 (supporting condition for missing.aliveOrDead)
 *
 * Both resolved from the actual printed-page scan image supplied for this
 * purpose: printed_249__pdf_251.jpg.
 */

import assert from 'node:assert/strict';

import { getKashfMethod, validateKashfMethodRegistry } from './goral-hachol/registry/kashf-canonical-method-registry.js';
import { hasCanonicalCustomExecutor, executeCanonicalCustomMethod } from './goral-hachol/engine/kashf-canonical-executors.js';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';

let assertions = 0;
function ok(cond, msg) { assertions++; assert(cond, msg); }

ok(validateKashfMethodRegistry().valid, 'method registry stays internally valid after opening both p249 methods');

// ── missing.p249.returnTimingTariqH10H11 ──────────────────────────────
//
// Photographed line (p249, PDF 251): "نكتة: للغائب الذي ترجوا قدومه: فإن
// خرج في العاشر والحادي عشر طريق، فإنه يدل على إجتماع به في يومك. وإن كان
// في العاشر طريق، وفي الحادي عشر إجتماع، كان الإجتماع في الساعة، مجرب."
//
// Computation action: read H10 and H11 patterns off the board. H10=H11=
// Tariq(1111) => union within the day. H10=Tariq(1111), H11=Ijtima(2112)
// => union within the hour. Any other pairing => no verdict (the source
// states no "otherwise" branch here).

const timingMethod = getKashfMethod('missing.p249.returnTimingTariqH10H11');
ok(timingMethod.kashfRuntimeStatus === 'ready', 'missing.p249.returnTimingTariqH10H11 is ready');
ok(timingMethod.executorStatus === 'ready', 'executor is wired');
ok(timingMethod.runtimeAllowed === true, 'runtime is allowed (sole method for its own new intent)');
ok(timingMethod.kashfIntentId === 'missing.returnTiming', 'registered under a new, distinct intent from missing.return');
ok(/مجرب/.test(timingMethod.notes || ''), 'registry notes carry the source\'s own "تested" marker');
ok(/q-missing-return/.test(timingMethod.notes || ''), 'registry notes document the connection to the existing q-missing-return gap');
ok(hasCanonicalCustomExecutor('missing.p249.returnTimingTariqH10H11'), 'timing executor is reachable via dispatch');

// Branch A (same day): real board, found by brute-force search over all
// 65,536 mother combinations.
{
  const board = buildRamlBoardFromMothers(['1211', '1211', '1211', '2122']);
  const entries = board.entries || board;
  const h10 = entries.find((e) => Number(e.house || e.houseNumber) === 10);
  const h11 = entries.find((e) => Number(e.house || e.houseNumber) === 11);
  ok((h10.pattern || h10.key) === '1111', 'same-day case: real board lands H10=1111 (Tariq) as expected');
  ok((h11.pattern || h11.key) === '1111', 'same-day case: real board lands H11=1111 (Tariq) as expected');

  const result = executeCanonicalCustomMethod('missing.p249.returnTimingTariqH10H11', board);
  ok(result.timing === 'same-day', 'same-day case: timing is same-day');
  ok(result.positive === true, 'same-day case: positive is true');
  ok(result.outputHebrew.includes('אותו היום'), 'same-day case: Hebrew output mentions same-day union');
}

// Branch B (within the hour): exhaustively confirmed 0/65,536 real mother
// combinations reach H10=Tariq(1111) + H11=Ijtima(2112) simultaneously (a
// documented, verified reachability gap, same category as other 0/65536
// findings already recorded elsewhere in this codebase, e.g.
// well.p188.recast1468 / _test_kashf_rare_branch_reachability.mjs). The
// branch logic itself is still tested directly against a hand-built chart,
// since the executor must not special-case board provenance.
{
  const chart = Array.from({ length: 16 }, (_, i) => {
    const house = i + 1;
    const pattern = house === 10 ? '1111' : house === 11 ? '2112' : '2222';
    return { house, houseNumber: house, pattern, key: pattern, hebrew: pattern };
  });
  const result = executeCanonicalCustomMethod('missing.p249.returnTimingTariqH10H11', { entries: chart });
  ok(result.timing === 'within-the-hour', 'within-the-hour case: timing is within-the-hour');
  ok(result.positive === true, 'within-the-hour case: positive is true');
  ok(result.outputHebrew.includes('תוך השעה'), 'within-the-hour case: Hebrew output mentions within-the-hour union');
}

// No-match case: real board, neither branch's condition is met.
{
  const board = buildRamlBoardFromMothers(['1111', '1111', '1111', '1111']);
  const entries = board.entries || board;
  const h10 = entries.find((e) => Number(e.house || e.houseNumber) === 10);
  ok((h10.pattern || h10.key) === '2222', 'no-match case: real board lands H10=2222 (not Tariq) as expected');

  const result = executeCanonicalCustomMethod('missing.p249.returnTimingTariqH10H11', board);
  ok(result.timing === null, 'no-match case: timing is null');
  ok(result.positive === null, 'no-match case: positive is null, not a negative/no-return verdict');
}

// ── missing.p249.lifeStatusH8H14 ───────────────────────────────────────
//
// Photographed line (p249, PDF 251): "نكتة: عن حال الغائب: أنشئ من الثامن
// والرابع عشر شكلا، فإن كان سعدا، كان حاله صالحا، وإن كان نحسا، فبضده؛
// فإن إنفتح ناره وهواءه، كان حيا، وإلا بضد ذلك."
//
// Computation action: combine H8+H14 (standard parity-sum combine); its
// fire row AND air row both open => alive sign; otherwise, the source's own
// explicit inverse applies (not an invented negation).

const lifeMethod = getKashfMethod('missing.p249.lifeStatusH8H14');
ok(lifeMethod.kashfRuntimeStatus === 'ready', 'missing.p249.lifeStatusH8H14 is ready');
ok(lifeMethod.executorStatus === 'ready', 'executor is wired');
ok(lifeMethod.methodRole === 'supporting-condition', 'registered as a supporting condition, not a second canonical-operational method');
ok(lifeMethod.runtimeAllowed === false, 'not auto-selected as the operational primary for missing.aliveOrDead');
ok(lifeMethod.kashfIntentId === 'missing.aliveOrDead', 'shares the missing.aliveOrDead intent with missing.p248-249.lifeH1H4H9Outcome, by design');
ok(hasCanonicalCustomExecutor('missing.p249.lifeStatusH8H14'), 'life-status executor is reachable via dispatch');
ok(/FIXED 2026-10-05/.test(lifeMethod.notes || ''), 'registry notes document the 2026-10-05 text/field contradiction fix');

// Alive case: real board where H8+H14 combine to a figure with both fire
// and air rows open.
{
  const board = buildRamlBoardFromMothers(['1111', '2111', '1111', '2111']);
  const entries = board.entries || board;
  const h8 = entries.find((e) => Number(e.house || e.houseNumber) === 8);
  const h14 = entries.find((e) => Number(e.house || e.houseNumber) === 14);
  const result = executeCanonicalCustomMethod('missing.p249.lifeStatusH8H14', board);
  ok(result != null, 'alive-candidate case: executor returns a result from a real generated board');
  ok(result.h8Pattern === (h8.pattern || h8.key), 'alive-candidate case: result carries the real H8 pattern');
  ok(result.h14Pattern === (h14.pattern || h14.key), 'alive-candidate case: result carries the real H14 pattern');
  ok(typeof result.aliveSign === 'boolean', 'alive-candidate case: aliveSign is a real boolean from the combined figure');
  ok(result.positive === result.aliveSign, 'alive-candidate case: positive mirrors aliveSign exactly (source states a full inverse, not invented)');
}

// Direct branch check on a hand-built combined-figure outcome: H8=1111,
// H14=2211 combine (parity-sum per digit: fire 1+2=odd=>'1', air 1+2=
// odd=>'1', water 1+1=even=>'2', earth 1+1=even=>'2') => result 1122,
// fire+air both open => alive sign true.
{
  const chart = Array.from({ length: 16 }, (_, i) => {
    const house = i + 1;
    const pattern = house === 8 ? '1111' : house === 14 ? '2211' : '2222';
    return { house, houseNumber: house, pattern, key: pattern, hebrew: pattern };
  });
  const result = executeCanonicalCustomMethod('missing.p249.lifeStatusH8H14', { entries: chart });
  ok(result.resultPattern === '1122', 'hand-built alive case: combine(1111,2211) yields 1122 (Nusra Kharija)');
  ok(result.fireState === 'open' && result.airState === 'open', 'hand-built alive case: fire and air rows both read as open');
  ok(result.aliveSign === true, 'hand-built alive case: aliveSign is true');
  ok(result.positive === true, 'hand-built alive case: positive is true');
  ok(result.outputHebrew.includes('בחיים'), 'hand-built alive case: Hebrew output mentions being alive');
}

// Hand-built closed case: fire+air both closed => source\'s own explicit inverse.
{
  const chart = Array.from({ length: 16 }, (_, i) => {
    const house = i + 1;
    const pattern = (house === 8 || house === 14) ? '2222' : '1111';
    return { house, houseNumber: house, pattern, key: pattern, hebrew: pattern };
  });
  const result = executeCanonicalCustomMethod('missing.p249.lifeStatusH8H14', { entries: chart });
  ok(result.resultPattern === '2222', 'hand-built closed case: combine(2222,2222) yields 2222 (Jamaa)');
  ok(result.fireState === 'joined' && result.airState === 'joined', 'hand-built closed case: fire and air rows both read as closed/joined');
  ok(result.aliveSign === false, 'hand-built closed case: aliveSign is false');
  ok(result.positive === false, 'hand-built closed case: positive is false (source-stated inverse, not invented)');
  ok(result.stateQuality === 'unresolved', 'hand-built closed case: Jamaa (2222) is a mixed-fortune figure, so stateQuality is unresolved');
  // FIXED 2026-10-05: this exact case previously had positive:false while
  // outputHebrew said "no verdict" ("אין כאן הכרעה שהוא בחיים") about
  // aliveness -- a direct text/field contradiction flagged on review. It
  // must now state the negative verdict plainly. The SEPARATE mixed-state
  // hedge ("אין הכרעה למצבו הכללי") is allowed to coexist -- it addresses
  // the unrelated stateQuality field, not aliveSign/positive.
  ok(result.outputHebrew.includes('סימן שאינו בחיים'), 'hand-built closed case: Hebrew output states the negative alive verdict plainly, not "no verdict"');
  ok(!result.outputHebrew.includes('אין כאן הכרעה שהוא בחיים'), 'hand-built closed case: the old contradictory "no verdict on aliveness" phrasing is gone');
  ok(result.outputHebrew.includes('אין הכרעה למצבו הכללי'), 'hand-built closed case: the separate, still-correct mixed-state-quality hedge is preserved');
}

// Full branch matrix (aliveSign x stateQuality), one real combine case per
// branch, built from H8=1111 with H14 chosen so combine(H8,H14) yields the
// target resultPattern (combine rule: result digit is '2' when the two
// input digits match, '1' when they differ -- verified against the
// existing 1111+2211=>1122 case above). Each case checks that `positive`,
// `aliveSign`, `stateQuality` and `outputHebrew` all agree with each other,
// per the explicit instruction to check a case for every branch.
const LIFE_STATUS_MATRIX = [
  // [h14Pattern, resultPattern, expectAliveSign, expectStateQuality, label]
  ['2221', '1112', true, 'bad', 'alive x bad (Ataba Kharija/1112, nahs)'],
  ['2222', '1111', true, 'unresolved', 'alive x mixed (Tariq/1111, mixed)'],
  ['1122', '2211', false, 'good', 'dead x good (Nusra Dakhila/2211, saad)'],
  ['1112', '2221', false, 'bad', 'dead x bad (Nakis/2221, nahs)'],
];

for (const [h14Pattern, resultPattern, expectAliveSign, expectStateQuality, label] of LIFE_STATUS_MATRIX) {
  const chart = Array.from({ length: 16 }, (_, i) => {
    const house = i + 1;
    const pattern = house === 8 ? '1111' : house === 14 ? h14Pattern : '2222';
    return { house, houseNumber: house, pattern, key: pattern, hebrew: pattern };
  });
  const result = executeCanonicalCustomMethod('missing.p249.lifeStatusH8H14', { entries: chart });
  ok(result.resultPattern === resultPattern, `${label}: combine(1111,${h14Pattern}) yields ${resultPattern} as expected`);
  ok(result.aliveSign === expectAliveSign, `${label}: aliveSign is ${expectAliveSign}`);
  ok(result.positive === expectAliveSign, `${label}: positive mirrors aliveSign exactly`);
  ok(result.stateQuality === expectStateQuality, `${label}: stateQuality is ${expectStateQuality}`);
  ok(result.outputHebrew.includes(expectAliveSign ? 'סימן שהוא בחיים' : 'סימן שאינו בחיים'),
    `${label}: Hebrew output's alive clause matches aliveSign/positive exactly (no text/field contradiction)`);
  ok(!(result.positive === false && /אין כאן הכרעה/.test(result.outputHebrew)),
    `${label}: no "no verdict" wording on aliveness when positive is false`);
  ok(!(result.positive === true && /שאינו בחיים|אין כאן הכרעה/.test(result.outputHebrew)),
    `${label}: no negative or "no verdict" wording on aliveness when positive is true`);
}

// Missing/incomplete board data for both methods: must not guess.
{
  ok(executeCanonicalCustomMethod('missing.p249.returnTimingTariqH10H11', { entries: [] }) === null, 'timing: missing board data returns null');
  ok(executeCanonicalCustomMethod('missing.p249.lifeStatusH8H14', { entries: [] }) === null, 'life-status: missing board data returns null');
}

console.log(`Kashf p249 return-timing + life-status golden tests: ${assertions} assertions passed`);
