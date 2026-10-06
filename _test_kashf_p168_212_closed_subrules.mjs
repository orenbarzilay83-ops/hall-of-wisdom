import assert from 'node:assert/strict';

import { getKashfMethod, validateKashfMethodRegistry } from './goral-hachol/registry/kashf-canonical-method-registry.js';
import { resolveKashfRouteByQuestionId } from './goral-hachol/engine/kashf-method-router.js';
import { buildKashfReadingByQuestionId } from './goral-hachol/engine/kashf-canonical-reading-engine.js';
import { buildKashfCanonicalAiBridge } from './goral-hachol/intelligence/kashf-canonical-ai-bridge.js';
import { getKashfAiRetrievalRecord } from './goral-hachol/registry/kashf-ai-retrieval-index.js';
import { isKashfMethodProfessionallyCertified } from './goral-hachol/intelligence/kashf-professional-verdict-safety.js';

// 2026-10-06 (second round): three closed sub-rules opened from
// kashf-v57-draft.html, verified against the printed page + PDF page in
// the original Arabic scan per this round's instruction: dispute.p212's
// H2/H8 winner signs (deliberately excluded from, but never separately
// opened for, dispute.p212.winnerH1), and two independent p168 rules
// (move-to-obtain-a-need majority rule, request-answered-ease rule).

function makeBoard(overrides = {}) {
  const fallback = Array(16).fill('2222');
  const entries = fallback.map((pattern, i) => ({
    house: i + 1, houseNumber: i + 1, pattern, key: pattern,
    hebrew: `צורה-${pattern}`, hebrewName: `צורה-${pattern}`,
  }));
  for (const [house, pattern] of Object.entries(overrides)) {
    const idx = Number(house) - 1;
    entries[idx] = { ...entries[idx], pattern, key: pattern, hebrew: `צורה-${pattern}`, hebrewName: `צורה-${pattern}` };
  }
  for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
    const motherHouse = rowIndex + 1;
    const daughterHouse = 5 + rowIndex;
    const motherGiven = motherHouse in overrides || String(motherHouse) in overrides;
    const daughterGiven = daughterHouse in overrides || String(daughterHouse) in overrides;
    if (motherGiven && !daughterGiven) {
      const motherPattern = entries[motherHouse - 1].pattern;
      const d = entries[daughterHouse - 1];
      const fixed = d.pattern.slice(0, rowIndex) + motherPattern[rowIndex] + d.pattern.slice(rowIndex + 1);
      entries[daughterHouse - 1] = { ...d, pattern: fixed, key: fixed, hebrewName: `צורה-${fixed}`, hebrew: `צורה-${fixed}` };
    } else if (daughterGiven && !motherGiven) {
      const daughterPattern = entries[daughterHouse - 1].pattern;
      const m = entries[motherHouse - 1];
      const fixed = m.pattern.slice(0, rowIndex) + daughterPattern[rowIndex] + m.pattern.slice(rowIndex + 1);
      entries[motherHouse - 1] = { ...m, pattern: fixed, key: fixed, hebrewName: `צורה-${fixed}`, hebrew: `צורה-${fixed}` };
    }
  }
  return { entries, boardValidation: { isValid: true, warnings: [] } };
}

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

{
  // H2 benefic only => petitioner wins.
  const board = makeBoard({ 2: '1122', 8: '1112' });
  const exec = buildKashfReadingByQuestionId(board, 'q-dispute-h2h8', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.branch, 'petitioner-wins-sign');
  assert.equal(exec.positive, true);
  assert.match(exec.outputHebrew, /המבקש זוכה/);
}

{
  // H8 benefic only => respondent prevails.
  const board = makeBoard({ 2: '1112', 8: '1122' });
  const exec = buildKashfReadingByQuestionId(board, 'q-dispute-h2h8', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.branch, 'respondent-prevails-sign');
  assert.equal(exec.positive, false);
  assert.match(exec.outputHebrew, /המבוקש גובר/);
}

{
  // Both benefic => conflicting signs, no forced arbitration.
  const board = makeBoard({ 2: '1122', 8: '2111' });
  const exec = buildKashfReadingByQuestionId(board, 'q-dispute-h2h8', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.branch, 'conflicting-signs');
  assert.equal(exec.positive, null);
  assert.match(exec.outputHebrew, /סותרים/);

  const bridge = buildKashfCanonicalAiBridge({ questionId: 'q-dispute-h2h8', questionText: 'test', board, clientContext: { question: 'test' } });
  assert.equal(bridge.aiVerdictAllowed, true);
}

{
  // Neither benefic => no sign, no inverse.
  const board = makeBoard({ 2: '1112', 8: '1221' });
  const exec = buildKashfReadingByQuestionId(board, 'q-dispute-h2h8', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.branch, 'unresolved');
  assert.equal(exec.positive, null);
}

// ── need.p168.moveToObtainH5H9H14 ───────────────────────────────────────────

{
  // All three benefic => move is correct.
  const board = makeBoard({ 5: '1122', 9: '2111', 14: '2121' });
  const exec = buildKashfReadingByQuestionId(board, 'q-need-move-p168', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.moveOutcome, 'move-correct');
  assert.equal(exec.positive, true);

  const bridge = buildKashfCanonicalAiBridge({ questionId: 'q-need-move-p168', questionText: 'test', board, clientContext: { question: 'test' } });
  assert.equal(bridge.aiVerdictAllowed, true);
}

{
  // All three malefic => move is incorrect.
  const board = makeBoard({ 5: '1112', 9: '1221', 14: '2122' });
  const exec = buildKashfReadingByQuestionId(board, 'q-need-move-p168', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.moveOutcome, 'move-incorrect');
  assert.equal(exec.positive, false);
}

{
  // Mixed with a 2-1 benefic majority => move correct by majority.
  const board = makeBoard({ 5: '1122', 9: '2111', 14: '1221' });
  const exec = buildKashfReadingByQuestionId(board, 'q-need-move-p168', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.moveOutcome, 'move-correct-by-majority');
  assert.equal(exec.positive, true);
  assert.equal(exec.saadCount, 2);
  assert.equal(exec.nahsCount, 1);
}

{
  // Mixed with a 2-1 malefic majority => move incorrect by majority.
  const board = makeBoard({ 5: '1112', 9: '2122', 14: '2211' });
  const exec = buildKashfReadingByQuestionId(board, 'q-need-move-p168', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.moveOutcome, 'move-incorrect-by-majority');
  assert.equal(exec.positive, false);
}

{
  // One saad, one nahs, one mixed (abstains) => tied clean votes, no invented tie-break.
  const board = makeBoard({ 5: '1122', 9: '1112', 14: '1111' });
  const exec = buildKashfReadingByQuestionId(board, 'q-need-move-p168', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.saadCount, 1);
  assert.equal(exec.nahsCount, 1);
  assert.equal(exec.moveOutcome, 'unresolved');
  assert.equal(exec.positive, null);
  assert.match(exec.outputHebrew, /אין להמציא שובר-שוויון/);
}

// ── request.p168.answeredEaseH5H7 ───────────────────────────────────────────

{
  // Both benefic => answered with ease.
  const board = makeBoard({ 5: '1122', 7: '2111' });
  const exec = buildKashfReadingByQuestionId(board, 'q-request-ease-p168', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.easeOutcome, 'answered-with-ease');
  assert.equal(exec.positive, true);

  const bridge = buildKashfCanonicalAiBridge({ questionId: 'q-request-ease-p168', questionText: 'test', board, clientContext: { question: 'test' } });
  assert.equal(bridge.aiVerdictAllowed, true);
}

{
  // Both malefic => still answered, just with difficulty (no "not answered" branch exists).
  const board = makeBoard({ 5: '1112', 7: '1221' });
  const exec = buildKashfReadingByQuestionId(board, 'q-request-ease-p168', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.easeOutcome, 'answered-with-difficulty');
  assert.equal(exec.positive, true);
  assert.match(exec.outputHebrew, /לא תיענה בכלל/);
}

{
  // Mixed combination (one saad, one nahs) => no stated branch, no verdict.
  const board = makeBoard({ 5: '1122', 7: '1221' });
  const exec = buildKashfReadingByQuestionId(board, 'q-request-ease-p168', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.easeOutcome, 'unresolved');
  assert.equal(exec.positive, null);
}

console.log('Kashf p168/212 closed sub-rules (opened 2026-10-06, round 2): PASS');
console.log('dispute.p212.winnerH2H8Sign independent/conflicting signs: PASS');
console.log('need.p168.moveToObtainH5H9H14 three-branch + majority tiebreak + tie-no-verdict: PASS');
console.log('request.p168.answeredEaseH5H7 both-branches-answered + mixed-unresolved: PASS');
