#!/usr/bin/env node
/**
 * _test_kashf_prisoner_p272_outcome_safety.mjs
 *
 * Golden tests for two new methods opened this round, both from the same
 * printed p272 (PDF 274) "نكتة: في المحبوس" (note: concerning the
 * imprisoned one) as the already-ready prisoner.p272-273.rapidExitH11WithH5Caution:
 *   - prisoner.p272.outcomeH1H4 (new intent: prisoner.outcomeFate)
 *   - prisoner.p272.exitSafetyH12 (new intent: prisoner.exitSafety)
 *
 * Also locks in the documented status of three related findings from the
 * same scan pages (p272-273) that were investigated but deliberately NOT
 * implemented:
 *   - prisoner.p272.releaseManner (blocked-by-source: house-set
 *     discrepancy between the main reading and a manuscript variant, plus
 *     no stated precedence when signs conflict)
 *   - dispute.p272.enemyJudgmentRecast (blocked-by-source: recast method
 *     with an unnamed success-check house, same category as
 *     well.p188.recast1468 / joy.p196.recast14511 / messenger.p176.recast14511)
 *   - prisoner.external.p272-273.nonBody (educational-only: content after
 *     the page's own "ومن غير الكتاب" marker, same pattern as
 *     war.external.p213-217.nonBody)
 */

import assert from 'node:assert/strict';

import { getKashfMethod, validateKashfMethodRegistry } from './goral-hachol/registry/kashf-canonical-method-registry.js';
import { getKashfQuestionRoute, validateKashfQuestionRoutes } from './goral-hachol/registry/kashf-question-route-registry.js';
import { hasCanonicalCustomExecutor, executeCanonicalCustomMethod } from './goral-hachol/engine/kashf-canonical-executors.js';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';

let assertions = 0;
function ok(cond, msg) { assertions++; assert(cond, msg); }

ok(validateKashfMethodRegistry().valid, 'method registry stays internally valid after opening the two new p272 prisoner methods');
ok(validateKashfQuestionRoutes((id) => getKashfMethod(id)).valid, 'question route registry stays internally valid');

// ── prisoner.p272.outcomeH1H4 ─────────────────────────────────────────
//
// Photographed line (p272, PDF 274): "وأنشئ من الأول والرابع شكلا، فإن
// كان نحسا، فعاقبة المحبوس إلى شر؛ وإن كان سعدا، فعاقبته إلى خير."
//
// Computation action: combine H1+H4 (parity-sum); saad -> good outcome,
// nahs -> bad outcome, mixed -> unresolved (no source branch for mixed).

const outcomeMethod = getKashfMethod('prisoner.p272.outcomeH1H4');
ok(outcomeMethod.kashfRuntimeStatus === 'ready', 'prisoner.p272.outcomeH1H4 is ready');
ok(outcomeMethod.executorStatus === 'ready', 'executor is wired');
ok(outcomeMethod.runtimeAllowed === true, 'runtime is allowed');
ok(outcomeMethod.kashfIntentId === 'prisoner.outcomeFate', 'registered under a new, distinct intent from prisoner.rapidExitSign/releaseTiming');
ok(/الأول والرابع/.test(outcomeMethod.notes || ''), 'registry notes carry the exact photographed house reference');
ok(/releaseManner/.test(outcomeMethod.notes || ''), 'registry notes cross-reference the blocked release-manner clause on the same page');
ok(hasCanonicalCustomExecutor('prisoner.p272.outcomeH1H4'), 'executor is reachable via the canonical custom-executor dispatch');

const outcomeRoute = getKashfQuestionRoute('q-prisoner-outcome');
ok(outcomeRoute != null, 'q-prisoner-outcome route exists');
ok(outcomeRoute.kashfMethodId === 'prisoner.p272.outcomeH1H4', 'q-prisoner-outcome routes to the correct executor');

// Real boards for each of the three branches (H1=mother1, H4=mother4 are
// read directly off the board, confirmed by inspection; fillers in
// mothers 2/3 do not affect H1/H4).
const OUTCOME_CASES = [
  { mothers: ['1111', '1111', '1111', '1122'], expectResult: '2211', expectOutcome: 'good', expectPositive: true, label: 'good (saad) outcome' },
  { mothers: ['1111', '1111', '1111', '1112'], expectResult: '2221', expectOutcome: 'bad', expectPositive: false, label: 'bad (nahs) outcome' },
  { mothers: ['1111', '1111', '1111', '1111'], expectResult: '2222', expectOutcome: 'unresolved', expectPositive: null, label: 'mixed outcome, no source branch' },
];

for (const { mothers, expectResult, expectOutcome, expectPositive, label } of OUTCOME_CASES) {
  const board = buildRamlBoardFromMothers(mothers);
  const entries = board.entries || board;
  const h1 = entries.find((e) => Number(e.house || e.houseNumber) === 1);
  const h4 = entries.find((e) => Number(e.house || e.houseNumber) === 4);
  ok((h1.pattern || h1.key) === mothers[0], `${label}: real board lands H1=${mothers[0]} as expected`);
  ok((h4.pattern || h4.key) === mothers[3], `${label}: real board lands H4=${mothers[3]} as expected`);

  const result = executeCanonicalCustomMethod('prisoner.p272.outcomeH1H4', board);
  ok(result != null, `${label}: executor returns a result from a real generated board`);
  ok(result.resultPattern === expectResult, `${label}: combine(H1,H4) yields ${expectResult} as expected`);
  ok(result.outcome === expectOutcome, `${label}: outcome is ${expectOutcome}`);
  ok(result.positive === expectPositive, `${label}: positive is ${expectPositive}`);
  if (expectOutcome === 'good') ok(result.outputHebrew.includes('לטובה'), `${label}: Hebrew output says the outcome is good`);
  if (expectOutcome === 'bad') ok(result.outputHebrew.includes('לרעה'), `${label}: Hebrew output says the outcome is bad`);
  if (expectOutcome === 'unresolved') ok(result.outputHebrew.includes('אין הכרעה'), `${label}: Hebrew output says there is no verdict`);
}

{
  const result = executeCanonicalCustomMethod('prisoner.p272.outcomeH1H4', { entries: [] });
  ok(result === null, 'prisoner.p272.outcomeH1H4: missing board data returns null rather than guessing');
}

// ── prisoner.p272.exitSafetyH12 ───────────────────────────────────────
//
// Photographed line (p272, PDF 274): "وإن كان الثاني عشر سعدا، كان خروجه
// بسلامة."
//
// Computation action: H12 saad -> safe-exit sign (positive:true); any
// other H12 -> positive:null (no verdict, never a "danger" verdict).

const safetyMethod = getKashfMethod('prisoner.p272.exitSafetyH12');
ok(safetyMethod.kashfRuntimeStatus === 'ready', 'prisoner.p272.exitSafetyH12 is ready');
ok(safetyMethod.executorStatus === 'ready', 'executor is wired');
ok(safetyMethod.runtimeAllowed === true, 'runtime is allowed');
ok(safetyMethod.kashfIntentId === 'prisoner.exitSafety', 'registered under a new, distinct intent');
ok(/الثاني عشر سعدا/.test(safetyMethod.notes || ''), 'registry notes carry the exact photographed clause');
ok(hasCanonicalCustomExecutor('prisoner.p272.exitSafetyH12'), 'executor is reachable via dispatch');

const safetyRoute = getKashfQuestionRoute('q-prisoner-exit-safety');
ok(safetyRoute != null, 'q-prisoner-exit-safety route exists');
ok(safetyRoute.kashfMethodId === 'prisoner.p272.exitSafetyH12', 'q-prisoner-exit-safety routes to the correct executor');

{
  // H12 saad (Nusra Dakhila, 2211): positive sign.
  const board = buildRamlBoardFromMothers(['1111', '1111', '1112', '1112']);
  const entries = board.entries || board;
  const h12 = entries.find((e) => Number(e.house || e.houseNumber) === 12);
  ok((h12.pattern || h12.key) === '2211', 'safe-exit case: real board lands H12=2211 (Nusra Dakhila, saad) as expected');

  const result = executeCanonicalCustomMethod('prisoner.p272.exitSafetyH12', board);
  ok(result.safeExitSign === true, 'safe-exit case: safeExitSign is true');
  ok(result.positive === true, 'safe-exit case: positive is true');
  ok(result.outputHebrew.includes('בשלום'), 'safe-exit case: Hebrew output mentions a peaceful/safe exit');
}

{
  // H12 mixed (Jamaa, 2222): no signal, must be null, never a danger verdict.
  const board = buildRamlBoardFromMothers(['1111', '1111', '1111', '1111']);
  const entries = board.entries || board;
  const h12 = entries.find((e) => Number(e.house || e.houseNumber) === 12);
  ok((h12.pattern || h12.key) === '2222', 'no-signal case: real board lands H12=2222 (Jamaa, mixed) as expected');

  const result = executeCanonicalCustomMethod('prisoner.p272.exitSafetyH12', board);
  ok(result.safeExitSign === false, 'no-signal case: safeExitSign is false');
  ok(result.positive === null, 'no-signal case: positive is null (no verdict), never false/"dangerous"');
  ok(!result.outputHebrew.includes('סכנה') || result.outputHebrew.includes('אין בכך הוכחה'), 'no-signal case: Hebrew output does not assert danger');
}

{
  const result = executeCanonicalCustomMethod('prisoner.p272.exitSafetyH12', { entries: [] });
  ok(result === null, 'prisoner.p272.exitSafetyH12: missing board data returns null rather than guessing');
}

// ── Documented-but-not-implemented findings from the same pages ───────

const releaseManner = getKashfMethod('prisoner.p272.releaseManner');
ok(releaseManner.methodRole === 'unresolved', 'prisoner.p272.releaseManner stays unresolved');
ok(releaseManner.kashfRuntimeStatus === 'blocked-by-source', 'prisoner.p272.releaseManner stays blocked-by-source');
ok(releaseManner.runtimeAllowed === false, 'prisoner.p272.releaseManner is not runtime-allowed');
ok(!hasCanonicalCustomExecutor('prisoner.p272.releaseManner'), 'prisoner.p272.releaseManner has no executor (correctly unimplemented)');
ok(/تكرر/.test(releaseManner.notes || ''), 'release-manner notes document the manuscript-variant bracket');

const enemyRecast = getKashfMethod('dispute.p272.enemyJudgmentRecast');
ok(enemyRecast.methodRole === 'unresolved', 'dispute.p272.enemyJudgmentRecast stays unresolved');
ok(enemyRecast.kashfRuntimeStatus === 'blocked-by-source', 'dispute.p272.enemyJudgmentRecast stays blocked-by-source');
ok(!hasCanonicalCustomExecutor('dispute.p272.enemyJudgmentRecast'), 'dispute.p272.enemyJudgmentRecast has no executor (correctly unimplemented)');
ok(/money\.p181\.recast25811/.test(enemyRecast.notes || ''), 'enemy-recast notes contrast against the one ready recast method that DOES name its check houses');

const nonBody = getKashfMethod('prisoner.external.p272-273.nonBody');
ok(nonBody.sourceLayer === 'non-body-addition', 'prisoner.external.p272-273.nonBody is tagged non-body-addition');
ok(nonBody.methodRole === 'educational-only', 'prisoner.external.p272-273.nonBody is educational-only');
ok(nonBody.runtimeAllowed === false, 'prisoner.external.p272-273.nonBody is not runtime-allowed');
ok(/ومن غير الكتاب/.test(nonBody.notes || ''), 'non-body notes cite the exact attribution marker');

console.log(`Kashf p272 prisoner outcome/safety golden tests: ${assertions} assertions passed`);
