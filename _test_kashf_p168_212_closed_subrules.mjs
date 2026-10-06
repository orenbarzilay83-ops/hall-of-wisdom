import assert from 'node:assert/strict';

import { getKashfMethod, validateKashfMethodRegistry } from './goral-hachol/registry/kashf-canonical-method-registry.js';
import { resolveKashfRouteByQuestionId } from './goral-hachol/engine/kashf-method-router.js';
import { buildKashfReadingByQuestionId } from './goral-hachol/engine/kashf-canonical-reading-engine.js';
import { buildKashfCanonicalAiBridge } from './goral-hachol/intelligence/kashf-canonical-ai-bridge.js';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { getKashfAiRetrievalRecord } from './goral-hachol/registry/kashf-ai-retrieval-index.js';
import { isKashfMethodProfessionallyCertified } from './goral-hachol/intelligence/kashf-professional-verdict-safety.js';

// 2026-10-06 (second round): three closed sub-rules opened from
// kashf-v57-draft.html, verified against the printed page + PDF page in
// the original Arabic scan per this round's instruction: dispute.p212's
// H2/H8 winner signs (deliberately excluded from, but never separately
// opened for, dispute.p212.winnerH1), and two independent p168 rules
// (move-to-obtain-a-need majority rule, request-answered-ease rule).
// Codex independently re-checked both printed pages (168, 212) against the
// Arabic scan afterward and confirmed the rules match the source -- that
// decoding is not reopened here.
//
// 2026-10-06 (third round): every board below is a genuine buildRamlBoardFromMothers()
// output from a 4-mother input -- not a synthetic 16-pattern array with an
// after-the-fact diagonal patch. Each (mothers -> branch) pair was found by
// exhaustively enumerating all 65,536 possible 4-mother combinations,
// classifying the relevant houses exactly as each executor does, and
// keeping the first board landing on each branch. All twelve branches
// tested below (4 for the dispute method, 5 for the need-move method, 3
// for the request-ease method) were confirmed reachable this way -- none
// needed to fall back to a direct-executor-only test. The search script
// itself is not part of this repo (one-off reachability proof, not a
// runtime component); its output is the mother arrays embedded below,
// independently re-verified here against the real routing + reading
// engine, not just copied from the search.

assert.equal(validateKashfMethodRegistry().valid, true);

for (const [methodId, questionId] of [
  ['dispute.p212.winnerH2H8Sign', 'q-dispute-h2h8'],
  ['need.p168.moveToObtainH5H9H14', 'q-need-move-p168'],
  ['request.p168.answeredEaseH5H7', 'q-request-ease-p168'],
]) {
  const method = getKashfMethod(methodId);
  assert.equal(method.kashfRuntimeStatus, 'ready');
  assert.equal(method.runtimeAllowed, true);
  assert.equal(method.executorStatus, 'ready');
  assert.equal(method.executionKind, 'custom-engine');

  const route = resolveKashfRouteByQuestionId(questionId);
  assert.equal(route.kashfMethodId, methodId);
  assert.equal(route.canRunKashf, true);

  assert(getKashfAiRetrievalRecord(methodId), `${methodId} has an AI retrieval record`);
  assert.equal(isKashfMethodProfessionallyCertified(methodId), true, `${methodId} is professionally certified`);
}

// ── dispute.p212.winnerH2H8Sign ─────────────────────────────────────────────
// Branch depends only on H2/H8's own saad/nahs classification; the search
// found a real 4-mother board for each of the four possible combinations.

{
  // Mothers 1111/1111/1111/1111 -> H2=1111 (mixed), H8=1111 (mixed) -> neither saad -> no sign.
  const board = buildRamlBoardFromMothers(['1111', '1111', '1111', '1111']);
  const exec = buildKashfReadingByQuestionId(board, 'q-dispute-h2h8', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.branch, 'unresolved');
  assert.equal(exec.positive, null);
}

{
  // Mothers 1111/1111/1112/1112 -> H2=1111 (mixed), H8=1122 (saad) -> respondent prevails.
  const board = buildRamlBoardFromMothers(['1111', '1111', '1112', '1112']);
  const exec = buildKashfReadingByQuestionId(board, 'q-dispute-h2h8', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.branch, 'respondent-prevails-sign');
  assert.equal(exec.positive, false);
  assert.match(exec.outputHebrew, /המבוקש גובר/);
}

{
  // Mothers 1111/2111/1111/1111 -> H2=2111 (saad), H8=1111 (mixed) -> petitioner wins.
  const board = buildRamlBoardFromMothers(['1111', '2111', '1111', '1111']);
  const exec = buildKashfReadingByQuestionId(board, 'q-dispute-h2h8', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.branch, 'petitioner-wins-sign');
  assert.equal(exec.positive, true);
  assert.match(exec.outputHebrew, /המבקש זוכה/);
}

{
  // Mothers 1111/2111/1112/1112 -> H2=2111 (saad), H8=1122 (saad) -> both signs fire, conflicting.
  const board = buildRamlBoardFromMothers(['1111', '2111', '1112', '1112']);
  const exec = buildKashfReadingByQuestionId(board, 'q-dispute-h2h8', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.branch, 'conflicting-signs');
  assert.equal(exec.positive, null);
  assert.match(exec.outputHebrew, /סותרים/);

  const bridge = buildKashfCanonicalAiBridge({ questionId: 'q-dispute-h2h8', questionText: 'test', board, clientContext: { question: 'test' } });
  assert.equal(bridge.aiVerdictAllowed, true);
}

// ── need.p168.moveToObtainH5H9H14 ───────────────────────────────────────────
// Branch depends on the saad/nahs majority among H5/H9/H14.

{
  // Mothers 1111/2111/2111/2111 -> H5=1222, H9=1222, H14=2111, all saad -> move correct.
  const board = buildRamlBoardFromMothers(['1111', '2111', '2111', '2111']);
  const exec = buildKashfReadingByQuestionId(board, 'q-need-move-p168', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.moveOutcome, 'move-correct');
  assert.equal(exec.positive, true);
  assert.equal(exec.saadCount, 3);

  const bridge = buildKashfCanonicalAiBridge({ questionId: 'q-need-move-p168', questionText: 'test', board, clientContext: { question: 'test' } });
  assert.equal(bridge.aiVerdictAllowed, true);
}

{
  // Mothers 1111/1211/1111/2211 -> H5=1112, H9=2122, H14=2122, all nahs -> move incorrect.
  const board = buildRamlBoardFromMothers(['1111', '1211', '1111', '2211']);
  const exec = buildKashfReadingByQuestionId(board, 'q-need-move-p168', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.moveOutcome, 'move-incorrect');
  assert.equal(exec.positive, false);
  assert.equal(exec.nahsCount, 3);
}

{
  // Mothers 1111/2111/1111/2111 -> H5=1212 (nahs), H9=1222 (saad), H14=2121 (saad) -> 2-1 benefic majority.
  const board = buildRamlBoardFromMothers(['1111', '2111', '1111', '2111']);
  const exec = buildKashfReadingByQuestionId(board, 'q-need-move-p168', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.moveOutcome, 'move-correct-by-majority');
  assert.equal(exec.positive, true);
  assert.equal(exec.saadCount, 2);
  assert.equal(exec.nahsCount, 1);
}

{
  // Mothers 1111/2111/1111/2211 -> H5=1212 (nahs), H9=1222 (saad), H14=2122 (nahs) -> 2-1 malefic majority.
  const board = buildRamlBoardFromMothers(['1111', '2111', '1111', '2211']);
  const exec = buildKashfReadingByQuestionId(board, 'q-need-move-p168', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.moveOutcome, 'move-incorrect-by-majority');
  assert.equal(exec.positive, false);
  assert.equal(exec.saadCount, 1);
  assert.equal(exec.nahsCount, 2);
}

{
  // Mothers 1111/1111/1211/2111 -> H5=1112 (nahs), H9=2222 (mixed, abstains), H14=2211 (saad) -> 1-1 tie among clean votes.
  const board = buildRamlBoardFromMothers(['1111', '1111', '1211', '2111']);
  const exec = buildKashfReadingByQuestionId(board, 'q-need-move-p168', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.saadCount, 1);
  assert.equal(exec.nahsCount, 1);
  assert.equal(exec.moveOutcome, 'unresolved');
  assert.equal(exec.positive, null);
  assert.match(exec.outputHebrew, /אין להמציא שובר-שוויון/);
}

// ── request.p168.answeredEaseH5H7 ───────────────────────────────────────────

{
  // Mothers 1111/1111/2121/2121 -> H5=1122 (saad), H7=1122 (saad) -> answered with ease.
  const board = buildRamlBoardFromMothers(['1111', '1111', '2121', '2121']);
  const exec = buildKashfReadingByQuestionId(board, 'q-request-ease-p168', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.easeOutcome, 'answered-with-ease');
  assert.equal(exec.positive, true);

  const bridge = buildKashfCanonicalAiBridge({ questionId: 'q-request-ease-p168', questionText: 'test', board, clientContext: { question: 'test' } });
  assert.equal(bridge.aiVerdictAllowed, true);
}

{
  // Mothers 1111/1111/1111/2121 -> H5=1112 (nahs), H7=1112 (nahs) -> still answered, just with difficulty.
  const board = buildRamlBoardFromMothers(['1111', '1111', '1111', '2121']);
  const exec = buildKashfReadingByQuestionId(board, 'q-request-ease-p168', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.easeOutcome, 'answered-with-difficulty');
  assert.equal(exec.positive, true);
  assert.match(exec.outputHebrew, /לא תיענה בכלל/);
}

{
  // Mothers 1111/1111/1111/1111 -> H5=1111 (mixed), H7=1111 (mixed) -> neither stated branch applies.
  const board = buildRamlBoardFromMothers(['1111', '1111', '1111', '1111']);
  const exec = buildKashfReadingByQuestionId(board, 'q-request-ease-p168', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.easeOutcome, 'unresolved');
  assert.equal(exec.positive, null);
}

console.log('Kashf p168/212 closed sub-rules (opened 2026-10-06, round 2): PASS');
console.log('All twelve branches confirmed reachable from real buildRamlBoardFromMothers() 4-mother boards (exhaustive 65,536-board search): PASS');
console.log('dispute.p212.winnerH2H8Sign independent/conflicting signs: PASS');
console.log('need.p168.moveToObtainH5H9H14 three-branch + majority tiebreak + tie-no-verdict: PASS');
console.log('request.p168.answeredEaseH5H7 both-branches-answered + mixed-unresolved: PASS');
