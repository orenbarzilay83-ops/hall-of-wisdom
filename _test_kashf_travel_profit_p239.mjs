#!/usr/bin/env node
/**
 * _test_kashf_travel_profit_p239.mjs
 *
 * Golden tests for travel.p239.profitH7Witness (q-travel-profit).
 * Opened 2026-10-04: re-verified directly against the printed scan p239
 * (PDF p241) — "والسابع البلد الذي قاصدها، فإن كان فيه شكل سعد، وشهد له
 * سعد، فإنه يربح في تجارته ويرجع سالما؛ وإن كان فيه نحس، فالتجارة خاسرة" —
 * cross-referenced with the witness table on printed p101-102 (PDF 103-104):
 * H9 witnesses H1/H5/H7, H5 witnesses H3/H7/H11 (both independently
 * re-confirmed against the scan this round, and matching the pre-existing
 * HOUSE_TESTIMONY data in kashf-figure-attributes-gate2.js exactly).
 *
 * Corrected 2026-10-04 (second pass): the SAME p101-102 passage continues,
 * right after the testimony table, with a rule for disagreeing witnesses —
 * "والتوليد من الشكلين عند اختلافهما، هو شاهد لهما وعليهما؛ فمن مال إليه،
 * فاحكم به من السعد، والنحس، والممتزج" ("the generation from the two
 * figures, when they disagree, is itself a witness for and against them;
 * whichever it inclines toward, judge by that one's fortune"). This DOES
 * apply to H9/H5 disagreeing about H7 — it was read in full, not assumed
 * either way. But "مال إليه" ("inclines toward") has no computable
 * definition anywhere in the book (the same unresolved operator as the
 * p182 money-halal rule's "مال الخارج إلى"). So the executor now requires
 * H9 AND H5 to BOTH be benefic for the profit branch (no disagreement to
 * arbitrate); when they disagree, it computes the generated figure as
 * evidence that the source's procedure was followed, but produces NO
 * profit verdict — previously (first pass) a single confirming witness was
 * treated as sufficient, which is corrected here.
 *
 * This is INDEPENDENT of the other, still-blocked p237 "تراب المنطقة"
 * profit rule (travel.p239.profitEarthRowH2) and of the sea-or-land
 * blocker (travel.p239.seaOrLandByElement) — neither is closed by this file.
 *
 * Boards below were found by a brute-force search over all 65,536 mother
 * combinations so every branch is reached through real board-generation
 * math, not by mirroring the executor's own if-statements.
 */

import { resolveKashfRouteByQuestionId } from './goral-hachol/engine/kashf-method-router.js';
import { buildKashfReadingByQuestionId } from './goral-hachol/engine/kashf-canonical-reading-engine.js';
import { getKashfV57Knowledge } from './goral-hachol/registry/kashf-v57-knowledge-registry.js';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { classifyCanonicalFigure } from './goral-hachol/engine/kashf-canonical-figure-classifier.js';
import { combineRamlFigures } from './goral-hachol/engine/raml-figures.js';

let passed = 0;
let failed = 0;
function assert(condition, message) {
  if (condition) {
    passed += 1;
  } else {
    failed += 1;
    console.error('FAIL:', message);
  }
}

function resultFor(mothers) {
  const board = buildRamlBoardFromMothers(mothers);
  const reading = buildKashfReadingByQuestionId(board, 'q-travel-profit');
  return { reading, result: reading.primaryFormula?.result?.executorResult };
}

// ── Route contract ────────────────────────────────────────────────────────
const route = resolveKashfRouteByQuestionId('q-travel-profit');
assert(route.canRunKashf === true, 'q-travel-profit route is runnable after the repair');
assert(route.kashfMethodId === 'travel.p239.profitH7Witness', 'q-travel-profit routes to the new independent H7+witness method, not the still-blocked earth-row method');

// ── This open did NOT close the other two travel blockers ──────────────────
{
  const earthRow = resolveKashfRouteByQuestionId('q-sea-or-land');
  assert(earthRow.canRunKashf === false, 'q-sea-or-land remains blocked (not merged with the profit fix)');
  const { KASHF_CANONICAL_METHODS } = await import('./goral-hachol/registry/kashf-canonical-method-registry.js');
  assert(KASHF_CANONICAL_METHODS['travel.p239.profitEarthRowH2'].kashfRuntimeStatus === 'blocked-by-source', 'the earth-row profit method itself remains blocked-by-source, not silently marked ready');
}

// ── Branch 1: loss (H7 malefic, regardless of witnesses) ───────────────────
{
  const { reading, result } = resultFor(['1111', '1111', '1111', '1121']);
  assert(reading.valid === true, 'loss board is a valid reading');
  assert(result.branch === 'loss', 'loss board reaches the loss branch');
  assert(result.positive === false, 'loss board is negative');
  assert(classifyCanonicalFigure(result.h7Pattern).saadNahs === 'nahs', 'loss board genuinely has a malefic H7');
  assert(result.outputHebrew.includes('המסחר מפסיד'), 'loss board cites the source loss clause');
  assert(result.outputHebrew.includes('ללא תלות'), 'loss board states the loss branch does not depend on witnesses, per the source\'s own asymmetry');
}

// ── Branch 2: profit (H7 benefic, BOTH witnesses benefic — no disagreement) ─
{
  const { reading, result } = resultFor(['1111', '1122', '2121', '2121']);
  assert(reading.valid === true, 'profit board is a valid reading');
  assert(result.branch === 'profit', 'profit board reaches the profit branch');
  assert(result.positive === true, 'profit board is positive');
  assert(classifyCanonicalFigure(result.h7Pattern).saadNahs === 'saad', 'profit board genuinely has a benefic H7');
  assert(classifyCanonicalFigure(result.h9Pattern).saadNahs === 'saad', 'profit board genuinely has a benefic H9 witness');
  assert(classifyCanonicalFigure(result.h5Pattern).saadNahs === 'saad', 'profit board genuinely has a benefic H5 witness — both witnesses agree, no disagreement to arbitrate');
  assert(result.outputHebrew.includes('מרוויח במסחרו וחוזר בשלום'), 'profit board cites the source profit clause');
  assert(result.outputHebrew.includes('ללא מחלוקת'), 'profit board states explicitly that the witnesses agree');
}

// ── Branch 3: unresolved — witnesses DISAGREE (one benefic, one not) ───────
// This is the corrected branch: the p101-102 disagreement-resolution
// procedure applies in principle (generation from the two figures), but
// "مال إليه" is undecodable, so no profit verdict is produced — the
// generated figure is surfaced as evidence the procedure was followed.
{
  const { reading, result } = resultFor(['1111', '1111', '2121', '2121']);
  assert(reading.valid === true, 'disagreeing-witnesses board is a valid reading');
  assert(result.branch === 'unresolved-disagreeing-witnesses', 'board reaches the new disagreeing-witnesses branch');
  assert(result.positive === null, 'disagreeing-witnesses board has no bounded polarity — not presented as a certain decision');
  const f7 = classifyCanonicalFigure(result.h7Pattern).saadNahs;
  const f9 = classifyCanonicalFigure(result.h9Pattern).saadNahs;
  const f5 = classifyCanonicalFigure(result.h5Pattern).saadNahs;
  assert(f7 === 'saad', 'fixture genuinely has benefic H7');
  assert((f9 === 'saad') !== (f5 === 'saad'), 'fixture genuinely has disagreeing witnesses (exactly one benefic)');
  assert(result.outputHebrew.includes('עדיו חלוקים'), 'output states the witnesses disagree');
  assert(result.outputHebrew.includes('עמ׳ 101-102'), 'output cites the p101-102 disagreement-resolution passage');
  assert(result.outputHebrew.includes('אינה מוגדרת תפעולית'), 'output states explicitly that the "inclines toward" operator is not computably defined');
  assert(!result.outputHebrew.includes('מרוויח'), 'output does not claim a profit verdict despite one confirming witness');
  const expectedGenerated = combineRamlFigures(result.h9Pattern, result.h5Pattern)?.resultPattern;
  assert(Boolean(expectedGenerated) && result.outputHebrew.includes(expectedGenerated), 'the generated (combined) figure from H9+H5 is computed and shown as evidence the source procedure was followed');
  assert(result.clientSafeHebrew.includes('חלוקים') || result.clientSafeHebrew.includes('לא') , 'clientSafeHebrew does not present the disagreement as a certain decision');
}

// ── Branch 4: unresolved — H7 benefic but BOTH witnesses agree they are not ─
{
  const { reading, result } = resultFor(['1111', '1111', '1121', '1121']);
  assert(reading.valid === true, 'no-confirming-witness board is a valid reading');
  assert(result.branch === 'unresolved-no-confirming-witness', 'board reaches the no-confirming-witness branch');
  assert(result.positive === null, 'no-confirming-witness board has no bounded polarity');
  assert(classifyCanonicalFigure(result.h7Pattern).saadNahs === 'saad', 'fixture genuinely has benefic H7');
  assert(classifyCanonicalFigure(result.h9Pattern).saadNahs !== 'saad' && classifyCanonicalFigure(result.h5Pattern).saadNahs !== 'saad', 'fixture genuinely has neither witness benefic');
  assert(result.outputHebrew.includes('אין פסק רווח'), 'no-confirming-witness board states explicitly that no profit verdict is given');
  assert(!result.outputHebrew.includes('מפסיד'), 'no-confirming-witness board does not invent a loss verdict either — the source conditions the loss branch on H7 malefic only');
}

// ── Branch 5: unresolved — H7 itself mixed ──────────────────────────────────
{
  const { reading, result } = resultFor(['1111', '1111', '1111', '1111']);
  assert(reading.valid === true, 'mixed-H7 board is a valid reading');
  assert(result.branch === 'unresolved-mixed-h7', 'board reaches the mixed-H7 branch');
  assert(result.positive === null, 'mixed-H7 board has no bounded polarity');
  assert(classifyCanonicalFigure(result.h7Pattern).saadNahs === 'mixed', 'fixture genuinely has a mixed H7');
}

// ── sourceText / knowledge wiring ────────────────────────────────────────────
{
  const { reading } = resultFor(['1111', '1111', '1111', '1121']);
  const knowledge = getKashfV57Knowledge('travel.p239.profitH7Witness');
  assert(Boolean(knowledge), 'travel.p239.profitH7Witness has v57 knowledge registered');
  assert(knowledge.v57.page === 239, 'v57 knowledge is anchored at printed p239, where this rule actually lives');
  assert(reading.primaryFormula?.sourceText === knowledge?.v57?.hebrewRule, 'runtime sourceText is the registered Hebrew v57 rule');
  assert(reading.primaryFormula?.houses?.slice().sort((a, b) => a - b).join(',') === '5,7,9', 'houses used are exactly H5, H7, H9');
}

console.log(`Kashf travel-profit (p239) tests: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
}
