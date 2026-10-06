import assert from 'node:assert/strict';

import { getKashfMethod, validateKashfMethodRegistry } from './goral-hachol/registry/kashf-canonical-method-registry.js';
import { resolveKashfRouteByQuestionId } from './goral-hachol/engine/kashf-method-router.js';
import { buildKashfReadingByQuestionId } from './goral-hachol/engine/kashf-canonical-reading-engine.js';
import { buildKashfCanonicalAiBridge } from './goral-hachol/intelligence/kashf-canonical-ai-bridge.js';
import { getKashfAiRetrievalRecord } from './goral-hachol/registry/kashf-ai-retrieval-index.js';
import { isKashfMethodProfessionallyCertified } from './goral-hachol/intelligence/kashf-professional-verdict-safety.js';

// 2026-10-06: four closed sub-rules opened this round from kashf-v57-draft.html
// (the canonical corrected working copy, ranked above kashf-al-asrar-book.js
// per CLAUDE.md's current source-priority order): illness.p196 duration-risk
// and sensory-signs, pregnancy.p192 maternal safety, child.p194 wellbeing.
// Each was already "kashfRuntimeStatus: ready" with a fully-specified,
// unambiguous printed rule but no executor wired (executorStatus: pending) --
// this file is the regression coverage for wiring them up.

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
  // Auto-repair p.35's mother(1-4)/daughter(5-8) diagonal for whichever side
  // of a pair the caller did NOT explicitly override (same convention as the
  // other _test_kashf_*_boundaries_*.mjs files).
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

// ── Registry + routing + retrieval + certification sanity ──────────────────

for (const [methodId, questionId] of [
  ['illness.p196.h1RecurrenceDurationRisk', 'q-illness-duration-risk'],
  ['illness.p196.sensorySignsH6H8', 'q-illness-sensory-signs'],
  ['pregnancy.p192.maternalSafetyH6H8H12', 'q-pregnancy-maternal-safety'],
  ['child.p194.wellbeingH5H16', 'q-child-wellbeing'],
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

// ── illness.p196.h1RecurrenceDurationRisk ───────────────────────────────────

{
  // H1 recurs in H6 only => prolonged illness, no H8 signal.
  const board = makeBoard({ 1: '1122', 6: '1122', 8: '2211' });
  const reading = buildKashfReadingByQuestionId(board, 'q-illness-duration-risk', { question: 'test' });
  const exec = reading.primaryFormula?.result?.executorResult;
  assert.equal(reading.valid, true);
  assert.equal(exec.recurresInH6, true);
  assert.equal(exec.recurresInH8, false);
  assert.equal(exec.positive, null, 'duration-risk is an observation, never a binary positive/negative verdict');
  assert.match(exec.outputHebrew, /המחלה מתארכת/);

  const bridge = buildKashfCanonicalAiBridge({ questionId: 'q-illness-duration-risk', questionText: 'test', board, clientContext: { question: 'test' } });
  assert.equal(bridge.aiVerdictAllowed, true);
}

{
  // H1 recurs in H8 only => prolonged illness plus fear/concern.
  const board = makeBoard({ 1: '2121', 6: '2211', 8: '2121' });
  const exec = buildKashfReadingByQuestionId(board, 'q-illness-duration-risk', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.recurresInH6, false);
  assert.equal(exec.recurresInH8, true);
  assert.match(exec.outputHebrew, /ויש לחשוש/);
}

{
  // No recurrence at all => observation states absence, no inverted "illness is short" claim.
  const board = makeBoard({ 1: '1122', 6: '2211', 8: '2121' });
  const exec = buildKashfReadingByQuestionId(board, 'q-illness-duration-risk', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.recurresInH6, false);
  assert.equal(exec.recurresInH8, false);
  assert.match(exec.outputHebrew, /אינה חוזרת/);
  assert.match(exec.outputHebrew, /אינו מוכיח שהמחלה קצרה/, 'absence of recurrence must be stated as non-proof, never promoted to "illness is short"');
}

// ── illness.p196.sensorySignsH6H8 ───────────────────────────────────────────

{
  // Blindness only: H1=H8=Ahyan(1222), H6 neither Ahyan nor a Saturn/Jupiter figure.
  const board = makeBoard({ 1: '1222', 8: '1222', 6: '2211' });
  const exec = buildKashfReadingByQuestionId(board, 'q-illness-sensory-signs', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.blindnessSign, true);
  assert.equal(exec.dimVisionSign, false);
  assert.equal(exec.hearingSign, true, 'H8=1222 is itself one of the two Jupiter figures, so the hearing sign also fires (documented source overlap)');
  assert.match(exec.outputHebrew, /עיוורון/);
}

{
  // Dim vision only: H1=H6=Ahyan(1222), H8 a non-overlapping figure.
  const board = makeBoard({ 1: '1222', 6: '1222', 8: '2211' });
  const exec = buildKashfReadingByQuestionId(board, 'q-illness-sensory-signs', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.blindnessSign, false);
  assert.equal(exec.dimVisionSign, true);
  assert.equal(exec.hearingSign, true, 'H6=1222 is itself one of the two Jupiter figures, so the hearing sign also fires (documented source overlap)');
  assert.match(exec.outputHebrew, /חשכת הראייה/);
}

{
  // Hearing only: a Saturn figure (2221, Nakis) in H8, H1 not Ahyan.
  const board = makeBoard({ 1: '1122', 6: '2211', 8: '2221' });
  const exec = buildKashfReadingByQuestionId(board, 'q-illness-sensory-signs', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.blindnessSign, false);
  assert.equal(exec.dimVisionSign, false);
  assert.equal(exec.hearingSign, true);
  assert.match(exec.outputHebrew, /כובד שמיעה/);
  assert.doesNotMatch(exec.outputHebrew, /עיוורון|חשכת הראייה/);
}

{
  // No sensory sign at all.
  const board = makeBoard({ 1: '1122', 6: '2211', 8: '2211' });
  const exec = buildKashfReadingByQuestionId(board, 'q-illness-sensory-signs', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.blindnessSign, false);
  assert.equal(exec.dimVisionSign, false);
  assert.equal(exec.hearingSign, false);
  assert.match(exec.outputHebrew, /היעדר הסימנים/);

  const bridge = buildKashfCanonicalAiBridge({ questionId: 'q-illness-sensory-signs', questionText: 'test', board, clientContext: { question: 'test' } });
  assert.equal(bridge.aiVerdictAllowed, true);
}

// ── pregnancy.p192.maternalSafetyH6H8H12 ────────────────────────────────────

{
  // All three benefic => mother is saved/safe.
  const board = makeBoard({ 6: '1122', 8: '2111', 12: '2121' });
  const exec = buildKashfReadingByQuestionId(board, 'q-pregnancy-maternal-safety', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.allBenefic, true);
  assert.equal(exec.positive, true);
  assert.match(exec.outputHebrew, /ניצלת/);

  const bridge = buildKashfCanonicalAiBridge({ questionId: 'q-pregnancy-maternal-safety', questionText: 'test', board, clientContext: { question: 'test' } });
  assert.equal(bridge.aiVerdictAllowed, true);
}

{
  // One house malefic => condition not fully met; no inverse "unsafe" verdict.
  const board = makeBoard({ 6: '1122', 8: '2111', 12: '2221' });
  const exec = buildKashfReadingByQuestionId(board, 'q-pregnancy-maternal-safety', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.allBenefic, false);
  assert.equal(exec.positive, null, 'absence of the full positive condition must never invert into a negative/unsafe verdict');
  assert.doesNotMatch(exec.outputHebrew, /בסכנה|לא בטוחה/);
}

// ── child.p194.wellbeingH5H16 ────────────────────────────────────────────────

{
  // H5+H16 both benefic => good fortune.
  const board = makeBoard({ 5: '1122', 16: '2111' });
  const exec = buildKashfReadingByQuestionId(board, 'q-child-wellbeing', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.wellbeingOutcome, 'good-fortune');
  assert.equal(exec.positive, true);
  assert.match(exec.outputHebrew, /מזלו הטוב/);

  const bridge = buildKashfCanonicalAiBridge({ questionId: 'q-child-wellbeing', questionText: 'test', board, clientContext: { question: 'test' } });
  assert.equal(bridge.aiVerdictAllowed, true);
}

{
  // H5+H16 both malefic => poor condition.
  const board = makeBoard({ 5: '1221', 16: '2221' });
  const exec = buildKashfReadingByQuestionId(board, 'q-child-wellbeing', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.wellbeingOutcome, 'poor-condition');
  assert.equal(exec.positive, false);
  assert.match(exec.outputHebrew, /ירוד/);
}

{
  // One benefic, one malefic => medium condition.
  const board = makeBoard({ 5: '1122', 16: '2221' });
  const exec = buildKashfReadingByQuestionId(board, 'q-child-wellbeing', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.wellbeingOutcome, 'medium-condition');
  assert.equal(exec.positive, null);
  assert.match(exec.outputHebrew, /בינוני/);
}

{
  // A mixed (neither saad nor nahs) figure on either house is outside the
  // three stated branches and must not be forced into one of them.
  const board = makeBoard({ 5: '1111', 16: '2111' });
  const exec = buildKashfReadingByQuestionId(board, 'q-child-wellbeing', { question: 'test' }).primaryFormula?.result?.executorResult;
  assert.equal(exec.wellbeingOutcome, 'unresolved');
  assert.equal(exec.positive, null);
  assert.match(exec.outputHebrew, /ממוזגת/);
}

console.log('Kashf p192/194/196 closed sub-rules (opened 2026-10-06): PASS');
console.log('illness.p196.h1RecurrenceDurationRisk duration/risk observation branches: PASS');
console.log('illness.p196.sensorySignsH6H8 blindness/dim-vision/hearing branches + documented overlap: PASS');
console.log('pregnancy.p192.maternalSafetyH6H8H12 positive-only safety branch: PASS');
console.log('child.p194.wellbeingH5H16 three-branch + mixed-unresolved coverage: PASS');
