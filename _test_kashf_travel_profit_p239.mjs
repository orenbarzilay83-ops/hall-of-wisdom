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

// ── Branch 2: profit (H7 benefic, at least one witness benefic) ────────────
{
  const { reading, result } = resultFor(['1111', '1111', '2121', '2121']);
  assert(reading.valid === true, 'profit board is a valid reading');
  assert(result.branch === 'profit', 'profit board reaches the profit branch');
  assert(result.positive === true, 'profit board is positive');
  assert(classifyCanonicalFigure(result.h7Pattern).saadNahs === 'saad', 'profit board genuinely has a benefic H7');
  assert(result.outputHebrew.includes('מרוויח במסחרו וחוזר בשלום'), 'profit board cites the source profit clause');
}

// ── Branch 2b: profit with CONTRADICTING witnesses (one confirms, one doesn't) ─
// Explicitly exercises "handling mixed evidence": the branch still resolves
// to profit (source says "a benefic witness", singular), but the
// disagreement between H9 and H5 is reported rather than silently merged.
{
  const { result } = resultFor(['1111', '1111', '2121', '2121']);
  const f9 = classifyCanonicalFigure(result.h9Pattern).saadNahs;
  const f5 = classifyCanonicalFigure(result.h5Pattern).saadNahs;
  assert(f9 !== f5, 'this fixture genuinely has disagreeing witnesses (one saad, one not)');
  assert(result.branch === 'profit', 'disagreeing witnesses still resolve to profit when at least one is benefic');
  assert(result.outputHebrew.includes('אין בכך כדי לסתור'), 'disagreement between witnesses is stated explicitly, not silently merged');
}

// ── Branch 3: unresolved — H7 benefic but no confirming witness ────────────
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

// ── Branch 4: unresolved — H7 itself mixed ──────────────────────────────────
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
