#!/usr/bin/env node
/**
 * _test_kashf_marriage_chastity_p205.mjs
 *
 * Golden tests for marriage.p205.modestyPurity (q-marriage-chastity).
 * Repaired 2026-10-04: the canonical executor computeMarriageChastityPurityP205
 * reads purity (tahir/najis) from HAWI_FIGURE_NAMES_BY_ID where the printed
 * p205-206 scan states purity, uses saad/nahs only where the source itself
 * says saad/nahs, and derives the H7+H9 composite figure (combineRamlFigures)
 * instead of testing H7 and H9 individually. Boards below were found by a
 * brute-force search over all 65,536 mother combinations so every branch is
 * reached through the real board-generation math, not by mirroring the
 * executor's own if-statements.
 */

import { resolveKashfRouteByQuestionId } from './goral-hachol/engine/kashf-method-router.js';
import { buildKashfReadingByQuestionId } from './goral-hachol/engine/kashf-canonical-reading-engine.js';
import { getKashfV57Knowledge } from './goral-hachol/registry/kashf-v57-knowledge-registry.js';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';

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
  const reading = buildKashfReadingByQuestionId(board, 'q-marriage-chastity');
  return { reading, result: reading.primaryFormula?.result?.executorResult };
}

// ── Route contract ─────────────────────────────────────────────────────────
const route = resolveKashfRouteByQuestionId('q-marriage-chastity');
assert(route.canRunKashf === true, 'q-marriage-chastity route is runnable after the repair');
assert(route.kashfMethodId === 'marriage.p205.modestyPurity', 'q-marriage-chastity routes to marriage.p205.modestyPurity');

// ── Branch 1: pure signs (H1 pure, H1+H7 both pure) ─────────────────────────
{
  const { reading, result } = resultFor(['1111', '1111', '1111', '1111']);
  assert(reading.valid === true, 'pure-signs board is a valid reading');
  assert(result.branch === 'pure-signs', 'pure-signs board reaches the pure-signs branch');
  assert(result.positive === true, 'pure-signs board is positive');
  assert(result.h1Pattern === '1111' && result.h7Pattern === '1111', 'pure-signs board keeps expected H1/H7');
  assert(result.outputHebrew.includes('צורת בית 1 טהורה'), 'pure-signs board states H1 purity sign');
  assert(result.outputHebrew.includes('בית 1 ובית 7 שניהם טהורים'), 'pure-signs board states the alternate H1+H7 clause');
}

// ── Branch 2: impure signs (H1 impure; H7+H9 composite malefic) ─────────────
{
  const { reading, result } = resultFor(['1112', '1111', '1111', '1111']);
  assert(reading.valid === true, 'impure-signs board is a valid reading');
  assert(result.branch === 'impure-signs', 'impure-signs board reaches the impure-signs branch');
  assert(result.positive === false, 'impure-signs board is negative');
  assert(result.combinedH7H9Pattern === '1112', 'impure-signs board derives the expected H7+H9 composite');
  assert(result.outputHebrew.includes('צורת בית 1 טמאה'), 'impure-signs board states H1 impurity');
  assert(result.outputHebrew.includes('מזיקה — סימן לפריצות'), 'impure-signs board states the adverse composite-figure sign');
}

// ── Branch 3: mixed signs (H1 pure sign + adverse H7/H9 composite together) ─
{
  const { reading, result } = resultFor(['1111', '1111', '1111', '1121']);
  assert(reading.valid === true, 'mixed-signs board is a valid reading');
  assert(result.branch === 'mixed-signs', 'mixed-signs board reaches the mixed-signs branch');
  assert(result.positive === null, 'mixed-signs board has no single bounded polarity');
  assert(result.outputHebrew.includes('צורת בית 1 טהורה'), 'mixed-signs board keeps the positive H1 sign');
  assert(result.outputHebrew.includes('מזיקה — סימן לפריצות'), 'mixed-signs board keeps the adverse composite sign alongside it');
}

// ── Branch 4: no applicable clause ───────────────────────────────────────────
{
  const { reading, result } = resultFor(['2122', '1111', '1111', '2121']);
  assert(reading.valid === true, 'no-applicable-clause board is a valid reading');
  assert(result.branch === 'no-applicable-clause', 'board with no matching clause reaches the explicit no-rule branch');
  assert(result.positive === null, 'no-applicable-clause board makes no polarity claim');
  assert(result.outputHebrew === 'אף אחד מסעיפי הסימנים (עמ׳ 205-206) אינו חל על צירוף הצורות הזה בלוח הנוכחי.', 'no-applicable-clause board states the explicit no-rule-found message');
}

// ── Named clause coverage (each wording confirmed reachable on a real board) ─
{
  const { result } = resultFor(['1111', '1111', '1111', '2221']);
  assert(result.h1Pattern === result.h15Pattern, 'fully-pure-certain fixture matches H1 to Mizan');
  assert(result.outputHebrew.includes('טהורה כליל, אין בה ספק'), 'H1=Mizan-in-purity reaches the "fully pure, no doubt" clause');
}
{
  const { result } = resultFor(['1212', '1111', '1111', '2221']);
  assert(result.h1Pattern === result.h15Pattern, 'match-mizan-malefic fixture matches H1 to Mizan');
  assert(result.outputHebrew.includes('היא בהפך זאת'), 'H1=Mizan-malefic reaches the mirrored adverse clause');
}
{
  const { result } = resultFor(['1122', '1121', '1111', '1111']);
  assert(result.outputHebrew.includes('נשקף חשש שתתקלקל'), 'H1 saad+pure with H9 nahs reaches the "fear of later corruption" clause');
}
{
  const { result } = resultFor(['1112', '1112', '1111', '1111']);
  assert(result.outputHebrew.includes('אין חשש מרכילה'), 'H1 nahs with H9+Mizan pure reaches the "no fear of gossip" clause');
}

// ── sourceText / knowledge wiring ────────────────────────────────────────────
{
  const { reading } = resultFor(['1111', '1111', '1111', '1111']);
  const knowledge = getKashfV57Knowledge('marriage.p205.modestyPurity');
  assert(Boolean(knowledge), 'marriage.p205.modestyPurity has v57 knowledge registered');
  assert(reading.primaryFormula?.sourceText === knowledge?.v57?.hebrewRule, 'runtime sourceText is the registered Hebrew v57 rule');
  assert(reading.primaryFormula?.houses?.slice().sort().join(',') === '1,15,7,9'.split(',').sort().join(','), 'houses used are exactly H1, H7, H9, H15');
}

console.log(`Kashf marriage-chastity (p205) tests: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
}
