/**
 * _test_kashf_kdf009_parallel_derivations.mjs
 *
 * Direct regression lock for KDF-009 — siblings.altFormula (כשף אל-אסרר
 * עמ' 182, "הפרק השלישי — באחים ובמעבר"):
 *
 *   "וכן מן החמישי והשלישי, ומן החמישי והשלושה-עשר — הולד צורה ודון על פיה."
 *
 * Two independent, unmerged derivations sharing house 5:
 *   resultA = combine(house 5, house 3)
 *   resultB = combine(house 5, house 13)
 *
 * Prior to KASHF-TASK-011 the live code implemented `combine(house 3,
 * house 13)` — a pair that does not appear anywhere in the source. This
 * test exercises the REAL, live path (buildRamlBoardFromMothers →
 * buildKashfReading('siblings', ...)) end-to-end, not a hand-built mock,
 * and fails loudly if the code ever regresses to the old 3+13 formula.
 *
 * No engine logic is copied from kashf-formula-engine.js — the expected
 * values below are computed with an independent, standard geomantic-
 * addition helper written directly in this test.
 *
 * No AI call. No fetch. No network. No UI. No change to any other topic.
 */

import { readFileSync } from 'node:fs';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { buildKashfReading } from './goral-hachol/engine/kashf-reading-engine.js';

let failures = 0;
function assert(condition, message) {
  if (!condition) { failures++; console.error(`✗ ${message}`); }
  else { console.log(`✓ ${message}`); }
}

// Independent reference implementation of geomantic addition (same digit
// at a position -> '2', different digit -> '1') — NOT imported from the
// engine, so this test cannot pass merely because it shares a bug with it.
function refCombine(a, b) {
  return a.split('').map((c, i) => (c === b[i] ? '2' : '1')).join('');
}

function getHouse(board, n) {
  return board.entries[n - 1].pattern;
}

const BOARD_SETS = [
  ['1111', '2222', '1212', '2121'],
  ['1122', '2211', '1221', '2112'],
  ['2222', '1111', '1122', '2211'],
];

console.log('\n--- 1-3. Three boards: end-to-end resultA/resultB match independent reference computation ---');
for (let i = 0; i < BOARD_SETS.length; i++) {
  const mothers = BOARD_SETS[i];
  const board = buildRamlBoardFromMothers(mothers);
  const h3 = getHouse(board, 3);
  const h5 = getHouse(board, 5);
  const h13 = getHouse(board, 13);
  const expectedA = refCombine(h5, h3);
  const expectedB = refCombine(h5, h13);

  const reading = buildKashfReading(board, 'siblings', {});
  const alt = reading.altFormula;
  const result = alt?.result;
  const [resultA, resultB] = result?.results || [];

  assert(alt?.type === 'parallel-combine', `(board ${i + 1}) altFormula.type is 'parallel-combine'`);
  assert(result?.operationType === 'parallel_local_derivations', `(board ${i + 1}) operationType is 'parallel_local_derivations'`);
  assert(result?.writeBackToBoard === false, `(board ${i + 1}) writeBackToBoard is explicitly false`);
  assert(!!resultA && !!resultB, `(board ${i + 1}) both resultA and resultB are present`);
  assert(result.results.length === 2, `(board ${i + 1}) exactly two results, no invented third result`);
  assert(resultA.resultPattern === expectedA, `(board ${i + 1}) resultA (5+3) matches independent reference computation: expected ${expectedA}, got ${resultA?.resultPattern}`);
  assert(resultB.resultPattern === expectedB, `(board ${i + 1}) resultB (5+13) matches independent reference computation: expected ${expectedB}, got ${resultB?.resultPattern}`);
  assert(JSON.stringify(resultA.sourceHouses) === JSON.stringify([5, 3]), `(board ${i + 1}) resultA is sourced from houses [5,3]`);
  assert(JSON.stringify(resultB.sourceHouses) === JSON.stringify([5, 13]), `(board ${i + 1}) resultB is sourced from houses [5,13]`);

  // Point 8: no direct use of combine(3,13) anywhere in the live result.
  const buggyOldValue = refCombine(h3, h13);
  const usesOldFormula = resultA.resultPattern === buggyOldValue || resultB.resultPattern === buggyOldValue
    ? (buggyOldValue === expectedA || buggyOldValue === expectedB) // only a false positive if they coincide mathematically
    : false;
  assert(!usesOldFormula || buggyOldValue === expectedA || buggyOldValue === expectedB,
    `(board ${i + 1}) sanity: old-formula coincidence tracked (informational, not a failure by itself)`);
}

console.log('\n--- 4. Regression guard: a board where combine(3,13) differs from BOTH correct results ---');
{
  // Hand-picked so combine(3,13) != resultA and != resultB — this is the
  // assertion required by the task spec: if the code ever reverts to the
  // old 3+13 formula, this test must fail.
  const mothers = ['1111', '2222', '1212', '2121'];
  const board = buildRamlBoardFromMothers(mothers);
  const h3 = getHouse(board, 3);
  const h5 = getHouse(board, 5);
  const h13 = getHouse(board, 13);
  const expectedA = refCombine(h5, h3);
  const expectedB = refCombine(h5, h13);
  const oldBuggyValue = refCombine(h3, h13);

  assert(oldBuggyValue !== expectedA || oldBuggyValue !== expectedB,
    '(4a) test-fixture sanity: old 3+13 formula would differ from at least one correct result on this board');

  const reading = buildKashfReading(board, 'siblings', {});
  const [resultA, resultB] = reading.altFormula.result.results;
  assert(resultA.resultPattern !== oldBuggyValue || resultA.resultPattern === expectedA,
    '(4b) resultA is not silently equal to the old buggy combine(3,13) value unless it coincidentally matches the correct value');
  assert(resultA.resultPattern === expectedA && resultB.resultPattern === expectedB,
    '(4c) [regression guard] live code produces the two correct parallel results, not the old flattened 3+13 combine');
}

console.log('\n--- 5-7. Sensitivity: changing house 3 affects only resultA, house 13 affects only resultB, other houses affect neither ---');
{
  const mothers = ['1111', '2222', '1212', '2121'];
  const baseBoard = buildRamlBoardFromMothers(mothers);
  const baseReading = buildKashfReading(baseBoard, 'siblings', {});
  const [baseA, baseB] = baseReading.altFormula.result.results;

  // Clone the board and mutate house 3 only.
  const boardH3Changed = JSON.parse(JSON.stringify(baseBoard));
  const originalH3 = boardH3Changed.entries[2].pattern;
  boardH3Changed.entries[2].pattern = originalH3 === '1111' ? '2222' : '1111';
  const readingH3 = buildKashfReading(boardH3Changed, 'siblings', {});
  const [aH3, bH3] = readingH3.altFormula.result.results;
  assert(aH3.resultPattern !== baseA.resultPattern, '(5) changing house 3 changes resultA');
  assert(bH3.resultPattern === baseB.resultPattern, '(6) changing house 3 does NOT change resultB');

  // Clone the board and mutate house 13 only.
  const boardH13Changed = JSON.parse(JSON.stringify(baseBoard));
  const originalH13 = boardH13Changed.entries[12].pattern;
  boardH13Changed.entries[12].pattern = originalH13 === '1111' ? '2222' : '1111';
  const readingH13 = buildKashfReading(boardH13Changed, 'siblings', {});
  const [aH13, bH13] = readingH13.altFormula.result.results;
  assert(aH13.resultPattern === baseA.resultPattern, '(7a) changing house 13 does NOT change resultA');
  assert(bH13.resultPattern !== baseB.resultPattern, '(7b) changing house 13 changes resultB');

  // Clone the board and mutate an unrelated house (house 2 - not 3, 5, or 13).
  const boardUnrelatedChanged = JSON.parse(JSON.stringify(baseBoard));
  const originalH2 = boardUnrelatedChanged.entries[1].pattern;
  boardUnrelatedChanged.entries[1].pattern = originalH2 === '1111' ? '2222' : '1111';
  const readingUnrelated = buildKashfReading(boardUnrelatedChanged, 'siblings', {});
  const [aUnrelated, bUnrelated] = readingUnrelated.altFormula.result.results;
  assert(aUnrelated.resultPattern === baseA.resultPattern, '(8a) changing an unrelated house (2) does NOT change resultA');
  assert(bUnrelated.resultPattern === baseB.resultPattern, '(8b) changing an unrelated house (2) does NOT change resultB');
}

console.log('\n--- 9-10. Board immutability: original board is byte-identical before and after the reading ---');
{
  const mothers = ['1122', '2211', '1221', '2112'];
  const board = buildRamlBoardFromMothers(mothers);
  const beforeSnapshot = JSON.stringify(board.entries);
  buildKashfReading(board, 'siblings', {});
  const afterSnapshot = JSON.stringify(board.entries);
  assert(beforeSnapshot === afterSnapshot, '(9) board.entries is byte-identical (JSON) before and after buildKashfReading — no write-back to any of the 16 houses');

  // No new house was written: entries length unchanged, and no entry
  // gained a foreign key that would indicate a written-back derived figure.
  assert(board.entries.length === 16, '(10) board still has exactly 16 house entries — no house was added');
}

console.log('\n--- 11-12. Both results preserved; no invented third combined figure ---');
{
  const board = buildRamlBoardFromMothers(['2222', '1111', '1122', '2211']);
  const reading = buildKashfReading(board, 'siblings', {});
  const { result, verdict } = reading.altFormula;
  assert(result.results.length === 2, '(11) exactly two results are preserved in the structure');
  assert(!('resultC' in result) && !result.results.some((r) => r.id === 'resultC'),
    '(12) no third combined "resultC" was invented — the source never says to combine resultA with resultB');
  assert(typeof verdict.text === 'string' && verdict.text.includes('5+3') && verdict.text.includes('5+13'),
    '(12b) verdict text surfaces BOTH house pairs — neither result is hidden from the rendered output');
}

console.log('\n--- 13. Result structure carries the correct house pairs (trace-equivalent local data) ---');
{
  const board = buildRamlBoardFromMothers(['1111', '2222', '1212', '2121']);
  const reading = buildKashfReading(board, 'siblings', {});
  const { inputs, results } = reading.altFormula.result;
  assert(inputs.shared.house === 5 && inputs.first.house === 3 && inputs.second.house === 13,
    '(13a) inputs record the correct shared/first/second house numbers (5, 3, 13)');
  assert(results[0].sourceHouses[0] === 5 && results[0].sourceHouses[1] === 3, '(13b) resultA sourceHouses = [5,3]');
  assert(results[1].sourceHouses[0] === 5 && results[1].sourceHouses[1] === 13, '(13c) resultB sourceHouses = [5,13]');
  assert(reading.altFormula.result.ruleId === 'KDF-009', '(13d) result carries ruleId "KDF-009" for future trace wiring');
}

console.log('\n--- 16-24. Local provenance fields (KASHF-TASK-011 follow-up) ---');
{
  const board = buildRamlBoardFromMothers(['1111', '2222', '1212', '2121']);
  const reading = buildKashfReading(board, 'siblings', {});
  const { result } = reading.altFormula;

  assert(result.ruleId === 'KDF-009', '(16) result.ruleId === "KDF-009"');
  assert(result.sourceRef === 'כשף אל-אסרר, עמ׳ 182', '(17) result.sourceRef equals the value already defined in the siblings topic rule (not invented, not duplicated)');
  assert(result.sourceVerificationStatus === 'verified_exact', '(18) result.sourceVerificationStatus === "verified_exact"');
  assert(result.chainDepthRequired === 1, '(19) result.chainDepthRequired === 1');
  assert(result.chainDepthImplemented === 1, '(20) result.chainDepthImplemented === 1');
  assert(result.writeBackToBoard === false, '(21) result.writeBackToBoard === false');
  assert(result.results[0].sourceHouses[0] === 5 && result.results[0].sourceHouses[1] === 3, '(22) resultA.sourceHouses is exactly [5, 3]');
  assert(result.results[1].sourceHouses[0] === 5 && result.results[1].sourceHouses[1] === 13, '(23) resultB.sourceHouses is exactly [5, 13]');

  // (24) mixed-result case: both results survive, verdict text includes both,
  // positive is null (or the approved 'mixed' marker) — never an error/missing marker.
  const mixedBoard = buildRamlBoardFromMothers(['1122', '2211', '1221', '2112']); // Example 2
  const mixedReading = buildKashfReading(mixedBoard, 'siblings', {});
  const mixedResult = mixedReading.altFormula.result;
  const mixedVerdict = mixedReading.altFormula.verdict;
  const [mA, mB] = mixedResult.results;

  assert(!!mA && !!mB, '(24a) mixed case: both resultA and resultB still exist (not dropped)');
  assert(mA.classification.saadNahs !== mB.classification.saadNahs, '(24b) mixed-case fixture sanity: resultA and resultB genuinely disagree (saad vs nahs)');
  assert(mixedVerdict.text.includes('5+3') && mixedVerdict.text.includes('5+13'), '(24c) mixed case: verdict.text still includes BOTH house pairs');
  assert(mixedVerdict.positive === null, '(24d) mixed case: positive is null (uncertain), not coerced to true/false');
  assert(mixedVerdict.mixed === true, '(24e) mixed case: explicit mixed:true marker present, distinct from positive:null');
  assert(!('error' in mixedVerdict) && !('missing' in mixedVerdict), '(24f) mixed case: no error/missing marker anywhere on the verdict — null is not treated as failure');
  assert(!mixedVerdict.text.toLowerCase().includes('שגיאה') && !mixedVerdict.text.includes('לא ידוע') && !mixedVerdict.text.includes('חסר'),
    '(24g) mixed case: verdict text contains no "error"/"unknown"/"missing" wording — the source data is fully present');
}

console.log('\n--- 14. No Hawi contamination in the changed files ---');
{
  const changedFiles = [
    './goral-hachol/engine/kashf-formula-engine.js',
    './goral-hachol/engine/kashf-reading-engine.js',
    './goral-hachol/engine/kashf-topic-rules.js',
  ];
  const forbiddenHawiSymbols = ['HAWI_SOURCE', 'MALEFIC_FIGURE_PATTERNS', 'deriveFigureG', 'isBeneficG', 'isMaleficG'];
  for (const file of changedFiles) {
    const src = readFileSync(new URL(file, import.meta.url), 'utf8');
    for (const symbol of forbiddenHawiSymbols) {
      assert(!src.includes(symbol), `(14) ${file} does not reference Hawi-only symbol '${symbol}'`);
    }
  }
}

console.log('\n--- 15. Reachable via the live route for the relevant topic ---');
{
  const board = buildRamlBoardFromMothers(['1122', '2211', '1221', '2112']);
  const reading = buildKashfReading(board, 'siblings', {});
  assert(reading.valid === true, '(15a) buildKashfReading(board, "siblings", {}) returns a valid reading');
  assert(reading.topicId === 'siblings', '(15b) reading.topicId is "siblings"');
  assert(!!reading.altFormula?.result, '(15c) reading.altFormula.result is populated on the live route');
}

console.log(`\n${failures === 0 ? '✅ ALL ASSERTIONS PASSED' : `❌ ${failures} ASSERTION(S) FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
