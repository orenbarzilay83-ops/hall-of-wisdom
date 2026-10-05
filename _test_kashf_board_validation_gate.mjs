#!/usr/bin/env node
/**
 * _test_kashf_board_validation_gate.mjs
 *
 * Fixes a gap found during the 2026-10-05 closing audit: buildKashfReadingByMethod
 * (the single entry point both the canonical path and the AI bridge call through)
 * always returned valid:true/canRunKashf:true regardless of board?.boardValidation,
 * even though raml-board-generator.js's validateBoard already distinguishes:
 *   - severity:'critical' (currently only judge-not-even, house 15) -- the SOURCE
 *     ITSELF says "הדיין (בית 15) חייב להיות זוג. אם לא -- הלוח כולו פסול" (the
 *     Judge must be even; if not, the WHOLE BOARD is invalid) -- an explicit
 *     re-cast instruction, not advisory.
 *   - severity:'warning' (Ras/Dhanab al-Tinnin in house 1; none of the four
 *     liar-exposing figures present) -- the source says to weigh it carefully /
 *     consider re-casting, or that the question may be insincere -- advisory,
 *     not a stop.
 *
 * Per explicit instruction: a critical finding must block a verdict in BOTH
 * the canonical reading path and the AI bridge; a mere warning must NOT.
 *
 * Also documents and proves (exhaustive enumeration over all 65,536 possible
 * 4-mother boards, same convention used throughout this engagement for
 * reachability claims) that judge-not-even is UNREACHABLE from any real
 * buildRamlBoardFromMothers board -- this is a provable algebraic invariant
 * of the mothers->daughters->nieces->witnesses->judge construction (house15's
 * total parity reduces to the same XOR term cancelling against itself via
 * the daughter row/column transpose), not a gap in the search. The gate is
 * still correct and necessary: it guards any board object that did not come
 * from this exact generator (a hand-built fixture, a future alternate board
 * path, a corrupted/edited board), and this file forces that condition
 * directly to prove the gate itself works.
 */

import assert from 'node:assert/strict';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { buildKashfReadingByQuestionId } from './goral-hachol/engine/kashf-canonical-reading-engine.js';
import { buildKashfCanonicalAiBridge } from './goral-hachol/intelligence/kashf-canonical-ai-bridge.js';

let assertions = 0;
function ok(cond, msg) { assertions++; assert(cond, msg); }

// ── Exhaustive proof: judge-not-even is unreachable from any real board ────

function toPattern(n) {
  let s = '';
  for (let i = 0; i < 4; i++) s += ((n >> i) & 1) ? '2' : '1';
  return s;
}

let criticalCount = 0;
let warningOnlyCount = 0;
let cleanCount = 0;
let firstWarningOnlyBoard = null;
for (let a = 0; a < 16; a++) {
  for (let b = 0; b < 16; b++) {
    for (let c = 0; c < 16; c++) {
      for (let d = 0; d < 16; d++) {
        const mothers = [toPattern(a), toPattern(b), toPattern(c), toPattern(d)];
        const board = buildRamlBoardFromMothers(mothers);
        const bv = board.boardValidation;
        if (bv.hasCritical) criticalCount++;
        else if (bv.warnings.length > 0) {
          warningOnlyCount++;
          if (!firstWarningOnlyBoard) firstWarningOnlyBoard = mothers;
        } else cleanCount++;
      }
    }
  }
}
ok(criticalCount === 0, 'judge-not-even (critical) is unreachable across all 65,536 possible 4-mother boards -- proven by exhaustive enumeration, not merely assumed');
ok(warningOnlyCount > 0, 'warning-only boards (e.g. no-liar-figure) are real and reachable -- confirms the two severities are not both vacuous');
ok(criticalCount + warningOnlyCount + cleanCount === 65536, 'enumeration covers all 65,536 boards exactly once');

// ── Case (e): a valid board carrying only a warning must still verdict ─────

{
  const board = buildRamlBoardFromMothers(firstWarningOnlyBoard);
  ok(board.boardValidation.hasCritical === false, 'sanity: this board is warning-only, not critical');
  ok(board.boardValidation.warnings.length > 0, 'sanity: this board does carry at least one warning');

  const reading = buildKashfReadingByQuestionId(board, 'q-missing-in-city', { question: 'test' });
  ok(reading.valid === true, 'a warning-only board does not block valid:true in the canonical path');
  ok(reading.canRunKashf === true, 'a warning-only board does not block canRunKashf:true in the canonical path');
  ok(reading.verdict !== null, 'a warning-only board still produces a verdict object (never blocked by a mere warning)');

  const bridge = buildKashfCanonicalAiBridge({
    questionId: 'q-missing-in-city',
    questionText: 'test',
    board,
    clientContext: { question: 'test' },
  });
  ok(bridge.aiVerdictAllowed === true, 'the AI bridge also does not block a warning-only board (aiVerdictAllowed stays true)');
}

// ── Case (f): a board whose Judge is forced non-even must be stopped ───────
//
// Forced directly (see file header: this condition cannot arise from a real
// buildRamlBoardFromMothers casting) to prove the gate itself works.

{
  const realBoard = buildRamlBoardFromMothers(['1111', '1111', '1111', '1122']);
  const criticalBoard = {
    ...realBoard,
    boardValidation: {
      isValid: false,
      hasCritical: true,
      warnings: [{ code: 'judge-not-even', severity: 'critical' }],
    },
  };

  const reading = buildKashfReadingByQuestionId(criticalBoard, 'q-missing-in-city', { question: 'test' });
  ok(reading.valid === false, 'a critical board-validation finding blocks valid:true in the canonical path');
  ok(reading.canRunKashf === false, 'a critical board-validation finding blocks canRunKashf:true in the canonical path');
  ok(reading.reason === 'board-validation-critical', 'the block reason names the board-validation gate specifically, not a generic error');
  ok(reading.verdict === null, 'no verdict object is produced when the board itself is source-declared invalid');

  const bridge = buildKashfCanonicalAiBridge({
    questionId: 'q-missing-in-city',
    questionText: 'test',
    board: criticalBoard,
    clientContext: { question: 'test' },
  });
  ok(bridge.aiVerdictAllowed === false, 'the AI bridge refuses to present a verdict when the canonical path is blocked by a critical board finding');
  ok(bridge.canonicalReading?.reason === 'board-validation-critical', 'the bridge surfaces the same specific block reason, not a generic one');
}

// ── Gate applies board-wide: a second, unrelated ready method also blocks ──

{
  const realBoard = buildRamlBoardFromMothers(['1111', '1111', '1111', '1122']);
  const criticalBoard = {
    ...realBoard,
    boardValidation: {
      isValid: false,
      hasCritical: true,
      warnings: [{ code: 'judge-not-even', severity: 'critical' }],
    },
  };
  const reading = buildKashfReadingByQuestionId(criticalBoard, 'q-missing-return', { question: 'test' });
  ok(reading.valid === false, 'the gate is not special-cased to one question/method: a different ready method is blocked too');
  ok(reading.reason === 'board-validation-critical', 'same block reason on the second method');
}

console.log(`Kashf board-validation gate: ${assertions} assertions passed`);
