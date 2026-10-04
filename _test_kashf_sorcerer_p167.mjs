#!/usr/bin/env node
/**
 * _test_kashf_sorcerer_p167.mjs
 *
 * Golden tests for spiritual.p167.querentCastsSorceryMizan.
 *
 * Opened 2026-10-04 while reading printed p167 (PDF 169) in full for the
 * spiritual-diagnostics question group, immediately after the
 * already-implemented generic hidden-action rule
 * (spiritual.p167.hiddenActionAirRows46815, q-hidden-action).
 *
 * Direct quote: "نكتة: إذا كان السائل يسحر عنه المسنول أو لا؟ خذ نار الأول،
 * والرابع، والسادس، والميزان، قيم منهم شكلا، وانظر ذلك الشكل، فإن نحسا،
 * فالسائل يعمل" — fire-row of H1/H4/H6/Mizan(H15); malefic => querent
 * practices sorcery on the asked-about person.
 *
 * "الميزان" = H15 reuses the identification already live in the sibling
 * computeHiddenActionP167 executor (which independently names H15 "דין"/
 * Judge, validated by raml-board-generator.js's validateJudgeIsEven) — not
 * a fresh guess for this method.
 *
 * UNLIKE the sibling hidden-action rule, this passage states only the
 * malefic branch with no "otherwise not" clause — confirmed by direct
 * re-reading at printed p167, not assumed. So non-malefic returns NO
 * verdict (positive: null), never a disguised "not sorcery" claim.
 *
 * INTENT CORRECTION (same day, second pass): this method was first wired
 * to q-sorcerer, whose real UI question ("מי הוא המכשף / המאחז?",
 * question-bank.js) asks to identify an unknown THIRD-PARTY perpetrator
 * from the victim's side. This method answers the OPPOSITE direction
 * (does the querent cast on someone else) and is NOT routed to any
 * current question — it is tested here by direct method invocation
 * (buildKashfReadingByMethod), not through q-sorcerer or any route.
 *
 * Boards below were found by a brute-force search over all 65,536 mother
 * combinations so every branch is reached through real board-generation
 * math, not by mirroring the executor's own if-statements.
 */

import { resolveKashfRouteByQuestionId } from './goral-hachol/engine/kashf-method-router.js';
import { buildKashfReadingByMethod } from './goral-hachol/engine/kashf-canonical-reading-engine.js';
import { getKashfV57Knowledge } from './goral-hachol/registry/kashf-v57-knowledge-registry.js';
import { getKashfMethod } from './goral-hachol/registry/kashf-canonical-method-registry.js';
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
  const reading = buildKashfReadingByMethod(board, 'spiritual.p167.querentCastsSorceryMizan');
  return { reading, result: reading.primaryFormula?.result?.executorResult };
}

// ── Method contract ──────────────────────────────────────────────────────
const method = getKashfMethod('spiritual.p167.querentCastsSorceryMizan');
assert(method.kashfRuntimeStatus === 'ready', 'method is ready');
assert(method.kashfIntentId === 'spiritual.querentCastsSorcery', 'method has its own distinct intent, not spiritual.sorcererIdentity');

// ── This method is NOT routed to q-sorcerer or any question ────────────────
{
  const sorcerer = resolveKashfRouteByQuestionId('q-sorcerer');
  assert(sorcerer.kashfMethodId !== 'spiritual.p167.querentCastsSorceryMizan', 'q-sorcerer (victim asks "who is cursing me") does not route to this method (querent-as-caster, opposite direction)');
  assert(sorcerer.canRunKashf === false, 'q-sorcerer remains unsupported — no rule identifies a third-party sorcerer');
  const hiddenAction = resolveKashfRouteByQuestionId('q-hidden-action');
  assert(hiddenAction.kashfMethodId === 'spiritual.p167.hiddenActionAirRows46815', 'q-hidden-action keeps its own, separate, generic method');
}

// ── Branch 1: malefic fire-row figure => explicit positive verdict ────────
{
  const { reading, result } = resultFor(['1111', '1111', '1111', '1111']);
  assert(reading.valid === true, 'malefic board is a valid reading');
  assert(result.querentCastsSorcery === true, 'malefic board flags querentCastsSorcery true');
  assert(result.positive === true, 'malefic board has positive verdict true');
  assert(classifyCanonicalFigure(result.derivedPattern).saadNahs === 'nahs', 'fixture genuinely produces a malefic fire-row figure');
  assert(result.outputHebrew.includes('מזיקה'), 'output states the figure is malefic');
  assert(result.clientSafeHebrew.includes('כישוף'), 'clientSafeHebrew states the sorcery finding');
  assert(result.housesUsed.join(',') === '1,4,6,15', 'houses used are exactly H1,H4,H6,H15(Mizan)');
  assert(result.rowUsed === 'fire', 'uses the fire row, not air');
}

// ── Branch 2: non-malefic fire-row figure => no verdict (not "no sorcery") ─
{
  const { reading, result } = resultFor(['1111', '1111', '1111', '2111']);
  assert(reading.valid === true, 'non-malefic board is a valid reading');
  assert(result.querentCastsSorcery === false, 'non-malefic board flags querentCastsSorcery false (descriptive)');
  assert(result.positive === null, 'non-malefic board has NO bounded verdict — not presented as "not sorcery"');
  const cls = classifyCanonicalFigure(result.derivedPattern).saadNahs;
  assert(cls !== 'nahs', 'fixture genuinely does not produce a malefic fire-row figure');
  assert(result.outputHebrew.includes('אין בטקסט סעיף'), 'output explicitly states the source gives no "otherwise" clause');
  assert(!result.outputHebrew.includes('השואל אינו מכשף') && !result.outputHebrew.includes('אין כישוף,'), 'output never asserts as fact that there is no sorcery');
  assert(result.clientSafeHebrew.includes('אינו נותן'), 'clientSafeHebrew does not present a negative verdict as certain');
}

// ── sourceText / knowledge wiring ────────────────────────────────────────────
{
  const { reading } = resultFor(['1111', '1111', '1111', '1111']);
  const knowledge = getKashfV57Knowledge('spiritual.p167.querentCastsSorceryMizan');
  assert(Boolean(knowledge), 'spiritual.p167.querentCastsSorceryMizan has v57 knowledge registered');
  assert(knowledge.v57.page === 167, 'v57 knowledge is anchored at printed p167');
  assert(reading.primaryFormula?.sourceText === knowledge?.v57?.hebrewRule, 'runtime sourceText is the registered Hebrew v57 rule');
}

console.log(`Kashf sorcerer (p167) tests: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
}
