import assert from 'node:assert/strict';

import { buildRamlBoardFromMothers, verifyKashfBoardStructuralIntegrity } from './goral-hachol/engine/raml-board-generator.js';
import { buildKashfCanonicalAiBridge } from './goral-hachol/intelligence/kashf-canonical-ai-bridge.js';

// 2026-10-06: end-to-end verification of the GPT/AI package across a
// deliberately diverse sample, per this round's explicit instruction: a
// decisive question, a descriptive-only method, a blocked question, a
// structurally invalid board, a warning-only board, and a method
// requiring additional client input (named-cast confirmation, a
// dedicated-input method). Confirms the AI bridge activates board-validity
// gating in every case, accepts the engine's verdict when one exists,
// never invents one when it doesn't, and never lets the client-facing
// draft leak out when either the board or the method's own precondition
// blocks it.

// ── A: a decisive question on a real, valid board ──────────────────────────
{
  const board = buildRamlBoardFromMothers(['1111', '1111', '1111', '1122']);
  const bridge = buildKashfCanonicalAiBridge({ questionId: 'q-illness-heal', questionText: 'test', board, clientContext: { question: 'test' } });
  assert.equal(bridge.canonicalReading?.valid, true);
  assert.equal(typeof bridge.canonicalReading?.overallPositive, 'boolean', 'a decisive question produces a genuine boolean verdict, not left at null');
  assert.equal(bridge.aiVerdictAllowed, true);
  assert.equal(bridge.professionalVerdictSafety?.binaryClientVerdictAllowed, true);
}

// ── B: a descriptive-only method (never a forced yes/no) ───────────────────
{
  const board = buildRamlBoardFromMothers(['1111', '1111', '1111', '1122']);
  const bridge = buildKashfCanonicalAiBridge({ questionId: 'q-theft-who', questionText: 'test', board, clientContext: { question: 'test' } });
  assert.equal(bridge.canonicalReading?.valid, true);
  assert.equal(bridge.canonicalReading?.overallPositive, null, 'descriptive-only methods never report a binary polarity');
  assert.equal(bridge.aiVerdictAllowed, true, 'the reading is still a valid, AI-usable result -- just non-binary');
  assert.equal(bridge.professionalVerdictSafety?.binaryClientVerdictAllowed, false);
  assert.equal(bridge.professionalVerdictSafety?.nonBinaryExplanationAllowed, true);
}

// ── C: a question blocked by source (never invent a verdict) ───────────────
{
  const board = buildRamlBoardFromMothers(['1111', '1111', '1111', '1122']);
  const bridge = buildKashfCanonicalAiBridge({ questionId: 'q-best-city', questionText: 'test', board, clientContext: { question: 'test' } });
  assert.equal(bridge.canonicalReading?.valid, false);
  assert.equal(bridge.canonicalReading?.reason, 'blocked-by-source');
  assert.equal(bridge.aiVerdictAllowed, false);
  assert(typeof bridge.canonicalReading?.userMessage === 'string' && bridge.canonicalReading.userMessage.length > 0, 'a clear user-facing reason is always given for a blocked question');
}

// ── D: a structurally invalid board (critical gate fires for ANY question) ─
{
  const real = buildRamlBoardFromMothers(['1111', '1111', '1111', '1122']);
  const corrupted = {
    entries: real.entries.map((e) => (e.houseNumber === 15 ? { ...e, pattern: '1112', key: '1112' } : e)),
    boardValidation: { isValid: true, hasCritical: false, warnings: [] }, // lying metadata must not matter
  };
  assert.equal(verifyKashfBoardStructuralIntegrity(corrupted.entries).hasCritical, true, 'sanity: the independent verifier catches the corrupted Judge');

  const bridge = buildKashfCanonicalAiBridge({ questionId: 'q-illness-heal', questionText: 'test', board: corrupted, clientContext: { question: 'test' } });
  assert.equal(bridge.canonicalReading?.valid, false);
  assert.equal(bridge.canonicalReading?.reason, 'board-validation-critical');
  assert.equal(bridge.aiVerdictAllowed, false);
  assert.equal(bridge.professionalVerdictSafety?.isSafe, false);
  assert.equal(bridge.professionalVerdictSafety?.binaryClientVerdictAllowed, false);
  // clientFacingCertified reflects the METHOD's general certification status
  // (illness.p196.outcomeH15 is certified in general), independent of this
  // one board being invalid -- the live GPT prompt nulls clientAnswerDraft
  // via the SEPARATE aiVerdictAllowed check (both conditions are AND'd), so
  // the real guarantee to assert here is that no draft text exists at all.
  assert.equal(bridge.professionalVerdictSafety?.authoritativeClientDraftHebrew, null, 'no draft text can exist when there is no valid reading to draft from');
}

// ── E: a warning-only board must NOT block -- a mere warning is not critical
{
  let warningBoard = null;
  const toPattern = (n) => { let s = ''; for (let i = 0; i < 4; i++) s += ((n >> i) & 1) ? '2' : '1'; return s; };
  outer:
  for (let a = 0; a < 16 && !warningBoard; a++) {
    for (let b = 0; b < 16 && !warningBoard; b++) {
      for (let c = 0; c < 16 && !warningBoard; c++) {
        for (let d = 0; d < 16; d++) {
          const bd = buildRamlBoardFromMothers([toPattern(a), toPattern(b), toPattern(c), toPattern(d)]);
          if (!bd.boardValidation.hasCritical && bd.boardValidation.warnings.length > 0) { warningBoard = bd; break outer; }
        }
      }
    }
  }
  assert(warningBoard, 'sanity: a warning-only board exists among real generated boards');

  const bridge = buildKashfCanonicalAiBridge({ questionId: 'q-illness-heal', questionText: 'test', board: warningBoard, clientContext: { question: 'test' } });
  assert.equal(bridge.canonicalReading?.valid, true, 'a warning-only board must never be blocked -- only a critical finding blocks');
  assert.equal(bridge.aiVerdictAllowed, true);
}

// ── F: named-cast confirmation precondition (method-level, not board-level)
{
  const board = buildRamlBoardFromMothers(['1111', '1111', '1111', '1122']);

  // Missing the required precondition: the method itself must report "no
  // verdict yet" with a clear reason, and the AI bridge must never surface
  // a fabricated verdict in its place.
  const missing = buildKashfCanonicalAiBridge({
    questionId: 'q-marriage-chastity',
    questionText: 'test',
    board,
    clientContext: { question: 'test', dynFields: { candidate: 'שרה' } }, // castConfirmedOnName omitted
  });
  assert.equal(missing.canonicalReading?.valid, true, 'the method runs (board is fine) but produces no verdict without the precondition');
  assert.equal(missing.canonicalReading?.overallPositive, null);
  assert.match(missing.canonicalReading?.primaryFormula?.result?.executorResult?.branch || '', /named-cast-not-confirmed/);
  assert.match(missing.professionalVerdictSafety?.authoritativeClientDraftHebrew || '', /חסר/, 'the client-safe draft itself explains what is missing, never a fabricated sign');

  // With the precondition satisfied, the method is free to produce a sign.
  const confirmed = buildKashfCanonicalAiBridge({
    questionId: 'q-marriage-chastity',
    questionText: 'test',
    board,
    clientContext: { question: 'test', dynFields: { candidate: 'שרה', castConfirmedOnName: true } },
  });
  assert.notEqual(confirmed.canonicalReading?.primaryFormula?.result?.executorResult?.branch, 'named-cast-not-confirmed');
}

// ── G: a dedicated-input method requiring client input beyond the board ────
{
  const board = buildRamlBoardFromMothers(['1111', '1111', '1111', '1122']);
  const bridge = buildKashfCanonicalAiBridge({ questionId: 'q-dig-direction', questionText: 'test', board, clientContext: { question: 'test' } });
  assert.equal(bridge.canonicalReading?.valid, false, 'missing required dedicated-input fields must block, never be inferred from the board/mothers');
  assert.equal(bridge.aiVerdictAllowed, false);
}

// ── Implementation details never leak to the client-facing layer ──────────
{
  const board = buildRamlBoardFromMothers(['1111', '1111', '1111', '1122']);
  const bridge = buildKashfCanonicalAiBridge({ questionId: 'q-illness-heal', questionText: 'test', board, clientContext: { question: 'test' } });
  const forbidden = bridge.professionalVerdictSafety?.forbiddenVerdictSources || [];
  assert(forbidden.some((s) => /board/i.test(s)), 'the raw board is explicitly named as a forbidden verdict source for the AI');
  assert(forbidden.some((s) => /dhamir/i.test(s)), 'dhamir/legacy context is explicitly named as a forbidden verdict source for the AI');
  assert(Array.isArray(bridge.professionalVerdictSafety?.allowedVerdictSources) && bridge.professionalVerdictSafety.allowedVerdictSources.length > 0, 'an explicit allowlist of real verdict sources is always given to the AI');
}

console.log('Kashf GPT package diverse-sample end-to-end audit: PASS');
console.log('A (decisive) / B (descriptive-only) / C (blocked-by-source) / D (structurally invalid board) / E (warning-only board) / F (named-cast precondition) / G (dedicated-input method): PASS');
console.log('Implementation-detail non-leakage (forbidden/allowed verdict sources): PASS');
