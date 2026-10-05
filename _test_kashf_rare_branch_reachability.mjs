#!/usr/bin/env node
/**
 * _test_kashf_rare_branch_reachability.mjs
 *
 * Six ready, routed methods never produced a decisive verdict across a
 * 47-board test battery (7 structured boards + 40 random boards, seeded)
 * built while correcting the verdict-measurement methodology on
 * 2026-10-05 (the prior round's metric wrongly counted any text different
 * from the single generic fallback string as "a verdict", which conflated
 * explicit no-decision prose with real decisions; this is unrelated to
 * that fix and addresses what it surfaced). A sixth, q-missing-return-timing,
 * was added later the same round when that method's routing was opened.
 *
 * Per "do not presuppose the book or the code is wrong; give a precise
 * mathematical explanation", each was checked by exhaustive or targeted
 * enumeration over the relevant board space, using the SAME classifier
 * each executor itself imports (kashf-canonical-figure-classifier.js, not
 * the simpler kashf-figure-classifier.js — the two disagree on 6 of 16
 * figures' saad/nahs class for genuinely "mixed" figures, confirmed by
 * direct comparison this round). All six conditions are confirmed
 * REACHABLE from real 4-mother boards, just rare (0.01%-2.3% of the 65,536
 * possible boards) — not bugs, not unreachable like well.p188.recast1468.
 * Two further conditions checked in the same overall effort
 * (travel.p244.returnH1H2H9's "allBeneficIncoming" branch, and
 * missing.p249.returnTimingTariqH10H11's "within-the-hour" branch) are NOT
 * reachable (0/65,536) and are documented separately in the method
 * registry and in that method's own golden test; only each method's OTHER,
 * reachable branch is exercised below.
 *
 * Each case below supplies a real 4-mother board (via
 * buildRamlBoardFromMothers) found by exhaustive/targeted search, not a
 * hand-set synthetic board, so the test proves the branch is reachable
 * through the actual board-generation math.
 */

import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { buildKashfReadingByQuestionId } from './goral-hachol/engine/kashf-canonical-reading-engine.js';
import assert from 'node:assert/strict';

let assertions = 0;
function ok(cond, msg) { assertions++; assert(cond, msg); }

// pregnancy.p191-192.miscarriageRedH7NakisH8 (q-miscarriage): exact pattern
// match H7=2122 (Humra) AND H8=2221 (Nakis). Reachable in 256/65,536 boards
// (~0.39%) by direct enumeration — exact match on two independent houses,
// not a compound dakhil/saad condition, so no classifier ambiguity.
{
  const board = buildRamlBoardFromMothers(['1122', '1112', '1122', '1121']);
  const reading = buildKashfReadingByQuestionId(board, 'q-miscarriage', { question: 'test' });
  const er = reading?.primaryFormula?.result?.executorResult;
  ok(reading.valid === true, 'q-miscarriage: real board produces a valid reading');
  ok(er?.h7Pattern === '2122' && er?.h8Pattern === '2221', 'q-miscarriage: real board lands on H7=2122/H8=2221');
  ok(er?.miscarriageSign === true, 'q-miscarriage: miscarriage sign fires on a real board (256/65536 boards reachable)');
  ok(er?.sourceOutcome === 'miscarriage-sign', 'q-miscarriage: sourceOutcome reflects the positive branch');
}

// money.p181.recast25811 (q-livelihood-arrive): recast H2/H5/H8/H11 as new
// mothers, require {1,2,4,7,10} all dakhil in the recast board. Reachable
// in exactly 8 of the 8,192 distinct reachable (H2,H5,H8,H11) tuples
// (8/65536 overall, ~0.012%) — confirmed by exhaustive enumeration of
// every original board's derived tuple, then testing each reachable tuple
// as a recast-mother set.
{
  const board = buildRamlBoardFromMothers(['2212', '2121', '1211', '1212']);
  const reading = buildKashfReadingByQuestionId(board, 'q-livelihood-arrive', { question: 'test' });
  const er = reading?.primaryFormula?.result?.executorResult;
  ok(reading.valid === true, 'q-livelihood-arrive: real board produces a valid reading');
  ok(er?.allRequiredInternal === true, 'q-livelihood-arrive: all required houses dakhil in the recast (8/65536 boards reachable)');
  ok(er?.sourceOutcome === 'money-obtained', 'q-livelihood-arrive: sourceOutcome reflects the positive branch');
  ok(reading?.primaryFormula?.verdict?.positive === true, 'q-livelihood-arrive: engine-level verdict.positive is true');
}

// missing.p249.returnAnglesJudge (q-missing-return): all four Awtad
// (1,4,7,10) benefic-dakhil AND the Judge (H15) also benefic-dakhil.
// Reachable in 16/65,536 boards (~0.024%) by exhaustive enumeration.
{
  const board = buildRamlBoardFromMothers(['2121', '2111', '2112', '2211']);
  const reading = buildKashfReadingByQuestionId(board, 'q-missing-return', { question: 'test' });
  const er = reading?.primaryFormula?.result?.executorResult;
  ok(reading.valid === true, 'q-missing-return: real board produces a valid reading');
  ok(er?.returnIndicatedForMale === true, 'q-missing-return: all-Awtad+Judge benefic-dakhil fires on a real board (16/65536 boards reachable)');
  ok(er?.allAnglesSupportReturn === true && er?.judgeSupportsReturn === true, 'q-missing-return: both angle and judge conditions hold');
}

// fear.p273.punishmentSigns (q-fear-punishment): H10=Nusra Dakhila(2211),
// H5=Ataba Dakhila(2111), Ahyan(1222) in H1 or H12, H4 benefic — a
// four-way compound condition. Reachable in 32/65,536 boards (~0.05%) by
// exhaustive enumeration using the canonical classifier.
{
  const board = buildRamlBoardFromMothers(['2112', '1111', '1111', '1122']);
  const reading = buildKashfReadingByQuestionId(board, 'q-fear-punishment', { question: 'test' });
  const er = reading?.primaryFormula?.result?.executorResult;
  ok(reading.valid === true, 'q-fear-punishment: real board produces a valid reading');
  ok(er?.noFear === true, 'q-fear-punishment: full p273 no-fear condition fires on a real board (32/65536 boards reachable)');
  ok(reading?.primaryFormula?.verdict?.positive === false, 'q-fear-punishment: engine-level verdict.positive is false (no-fear is itself the decisive answer; positive encodes "is there reason to fear")');
}

// travel.p244.returnH1H2H9 (q-traveler-return), the allPureMalefic branch:
// H1, H2 and H9 all strictly nahs (not merely mixed-leaning-nahs).
// Reachable in 1,536/65,536 boards (~2.3%) using the canonical classifier
// — the SAME exhaustive check using the simpler kashf-figure-classifier.js
// module instead (which collapses 6 of 16 "mixed" figures into forced
// saad/nahs) wrongly gives 10,240/65536; this is why the two classifier
// modules must never be mixed when reasoning about reachability.
// Its OTHER branch, allBeneficIncoming (H1,H2,H9 all saad+dakhil), is
// confirmed UNREACHABLE (0/65,536) by the same exhaustive method — see
// the method's registry notes. This method can therefore never produce a
// "good return" verdict on any board; only "hardship-possible-no-return"
// or no-decision.
{
  const board = buildRamlBoardFromMothers(['1112', '1212', '1111', '1111']);
  const reading = buildKashfReadingByQuestionId(board, 'q-traveler-return', { question: 'test' });
  const er = reading?.primaryFormula?.result?.executorResult;
  ok(reading.valid === true, 'q-traveler-return: real board produces a valid reading');
  ok(er?.allPureMalefic === true, 'q-traveler-return: all-pure-malefic fires on a real board (1536/65536 boards reachable)');
  ok(er?.sourceOutcome === 'hardship-possible-no-return', 'q-traveler-return: sourceOutcome reflects the only reachable decisive branch');
  ok(reading?.primaryFormula?.verdict?.positive === null, 'q-traveler-return: verdict.positive stays null even on this decisive branch — the engine-level positive field only ever captures the unreachable allBeneficIncoming branch, so client code must read sourceOutcome, not positive, for this method');
}

// missing.p249.returnTimingTariqH10H11 (q-missing-return-timing, added
// 2026-10-05), same-day branch: H10=H11=Tariq(1111). Reachable in
// 512/65,536 boards (~0.78%) by exhaustive enumeration (re-confirmed this
// round). Its OTHER branch, within-the-hour (H10=Tariq/1111,
// H11=Ijtima/2112), is confirmed UNREACHABLE (0/65,536) by the same
// exhaustive method -- already documented in the original opening round's
// golden test (_test_kashf_missing_p249_return_life.mjs), which exercises
// that branch logic directly against a hand-built chart instead. This
// method can therefore produce a decisive "same-day" verdict on a real
// board, but never a real-board "within-the-hour" verdict.
{
  const board = buildRamlBoardFromMothers(['1211', '1211', '1211', '2122']);
  const reading = buildKashfReadingByQuestionId(board, 'q-missing-return-timing', { question: 'test' });
  const er = reading?.primaryFormula?.result?.executorResult;
  ok(reading.valid === true, 'q-missing-return-timing: real board produces a valid reading');
  ok(er?.timing === 'same-day', 'q-missing-return-timing: same-day branch fires on a real board (512/65536 boards reachable)');
  ok(reading?.primaryFormula?.verdict?.positive === true, 'q-missing-return-timing: engine-level verdict.positive is true on the same-day branch');
}

// missing.p249.inCitySignAwtad (q-missing-in-city, added 2026-10-05):
// all four Awtad (H1,H4,H7,H10) uniformly dakhil. Reachable in 256/65,536
// boards (~0.39%) by exhaustive enumeration; the opposite, all-kharij,
// branch is equally reachable at the same count (confirmed by the same
// enumeration, not separately exercised here since the mechanism is
// identical).
{
  const board = buildRamlBoardFromMothers(['2121', '1111', '2112', '2111']);
  const reading = buildKashfReadingByQuestionId(board, 'q-missing-in-city', { question: 'test' });
  const er = reading?.primaryFormula?.result?.executorResult;
  ok(reading.valid === true, 'q-missing-in-city: real board produces a valid reading');
  ok(er?.branch === 'in-city-sign', 'q-missing-in-city: in-city-sign branch fires on a real board (256/65536 boards reachable)');
  ok(reading?.primaryFormula?.verdict?.positive === true, 'q-missing-in-city: engine-level verdict.positive is true on the in-city branch');
}

console.log(`Kashf rare-branch reachability: ${assertions} assertions passed`);
