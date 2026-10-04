#!/usr/bin/env node
/**
 * _test_kashf_partnership_compatibility_p212.mjs
 *
 * Golden tests for partnership.p212.compatibilityH1H7H5H7 (q-partnership).
 *
 * Opened 2026-10-04 while re-reading printed p212 (PDF 214) in full
 * sequence for the already-known "الجملة" partnership blocker (which
 * remains independently unresolved as partnership.p212.operationUnresolved
 * — NOT closed by this file). The SAME page's disputes paragraph, just
 * above the Jumla note, ends with a clause introduced specifically for
 * "الشريك" (the partner): "وكذلك تحكم للشريك من الأول والسابع، والخامس
 * والسابع، لأنهما بيتا مزاجهما، فما كان سعدا، فاحكم له بالخير، وما كان
 * نحسا، فاحكم بضده" — judge for the partner from the figure generated
 * from H1+H7 and the figure generated from H5+H7 (the two houses of their
 * mutual temperament): whichever is benefic, judge good; whichever is
 * malefic, judge the opposite.
 *
 * This is independent of dispute.p212.reconciliationH1H7 (a different
 * question — will the disputing sides reconcile — using only H1+H7 and
 * only a benefic-verdict branch).
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
  const reading = buildKashfReadingByQuestionId(board, 'q-partnership');
  return { reading, result: reading.primaryFormula?.result?.executorResult };
}

// ── Route contract ────────────────────────────────────────────────────────
const route = resolveKashfRouteByQuestionId('q-partnership');
assert(route.canRunKashf === true, 'q-partnership route is runnable after the open');
assert(route.kashfMethodId === 'partnership.p212.compatibilityH1H7H5H7', 'q-partnership routes to the new H1+7/H5+7 compatibility method');

// ── This open did NOT close the Jumla sub-rule ──────────────────────────────
{
  const { KASHF_CANONICAL_METHODS } = await import('./goral-hachol/registry/kashf-canonical-method-registry.js');
  const jumla = KASHF_CANONICAL_METHODS['partnership.p212.operationUnresolved'];
  assert(jumla.kashfRuntimeStatus === 'blocked-by-source', 'the Jumla (2-by-2) partnership method remains blocked-by-source, not silently marked ready');
  assert(jumla.methodRole === 'unresolved', 'the Jumla method is explicitly marked unresolved so it never collides with the new canonical method for the same intent');
}

// ── Branch 1: good (both generated figures benefic, no disagreement) ───────
{
  const { reading, result } = resultFor(['1111', '1111', '1121', '1121']);
  assert(reading.valid === true, 'good board is a valid reading');
  assert(result.branch === 'good', 'good board reaches the good branch');
  assert(result.positive === true, 'good board is positive');
  assert(classifyCanonicalFigure(result.pattern17).saadNahs === 'saad', 'fixture genuinely has a benefic H1+H7 generated figure');
  assert(classifyCanonicalFigure(result.pattern57).saadNahs === 'saad', 'fixture genuinely has a benefic H5+H7 generated figure');
  assert(result.outputHebrew.includes('ללא מחלוקת'), 'output states the two signs agree');
  assert(result.clientSafeHebrew.includes('טובה'), 'clientSafeHebrew states there is good in the partnership');
}

// ── Branch 2: bad (both generated figures malefic, no disagreement) ────────
{
  const { reading, result } = resultFor(['1111', '1111', '1111', '1121']);
  assert(reading.valid === true, 'bad board is a valid reading');
  assert(result.branch === 'bad', 'bad board reaches the bad branch');
  assert(result.positive === false, 'bad board is negative');
  assert(classifyCanonicalFigure(result.pattern17).saadNahs === 'nahs', 'fixture genuinely has a malefic H1+H7 generated figure');
  assert(classifyCanonicalFigure(result.pattern57).saadNahs === 'nahs', 'fixture genuinely has a malefic H5+H7 generated figure');
  assert(result.outputHebrew.includes('מזיקות'), 'output states both generated figures are malefic');
}

// ── Branch 3: unresolved — the two generated figures disagree ──────────────
{
  const { reading, result } = resultFor(['1111', '1111', '2111', '1121']);
  assert(reading.valid === true, 'disagreement board is a valid reading');
  assert(result.branch === 'unresolved-disagreement', 'board reaches the disagreement branch');
  assert(result.positive === null, 'disagreement board has no bounded polarity — not presented as a certain decision');
  const f17 = classifyCanonicalFigure(result.pattern17).saadNahs;
  const f57 = classifyCanonicalFigure(result.pattern57).saadNahs;
  assert(f17 !== f57 && f17 !== 'mixed' && f57 !== 'mixed', 'fixture genuinely has disagreeing (one saad, one nahs) generated figures');
  assert(result.outputHebrew.includes('חלוקים'), 'output states the two signs disagree');
  assert(result.outputHebrew.includes('אינו נותן כלל הכרעה'), 'output states explicitly that the source gives no tie-break rule');
  assert(result.clientSafeHebrew.includes('חלוקים'), 'clientSafeHebrew does not present the disagreement as a certain decision');
}

// ── Branch 4: unresolved — at least one generated figure is mixed ──────────
{
  const { reading, result } = resultFor(['1111', '1111', '1111', '1111']);
  assert(reading.valid === true, 'mixed board is a valid reading');
  assert(result.branch === 'unresolved-mixed', 'board reaches the mixed branch');
  assert(result.positive === null, 'mixed board has no bounded polarity');
  assert(
    classifyCanonicalFigure(result.pattern17).saadNahs === 'mixed' || classifyCanonicalFigure(result.pattern57).saadNahs === 'mixed',
    'fixture genuinely has at least one mixed generated figure'
  );
}

// ── sourceText / knowledge wiring ────────────────────────────────────────────
{
  const { reading } = resultFor(['1111', '1111', '1121', '1121']);
  const knowledge = getKashfV57Knowledge('partnership.p212.compatibilityH1H7H5H7');
  assert(Boolean(knowledge), 'partnership.p212.compatibilityH1H7H5H7 has v57 knowledge registered');
  assert(knowledge.v57.page === 212, 'v57 knowledge is anchored at printed p212, where this rule actually lives');
  assert(reading.primaryFormula?.sourceText === knowledge?.v57?.hebrewRule, 'runtime sourceText is the registered Hebrew v57 rule');
  assert(reading.primaryFormula?.houses?.slice().sort((a, b) => a - b).join(',') === '1,5,7', 'houses used are exactly H1, H5, H7');
}

console.log(`Kashf partnership-compatibility (p212) tests: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
}
