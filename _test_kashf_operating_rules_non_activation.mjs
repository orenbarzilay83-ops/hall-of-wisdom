#!/usr/bin/env node
/**
 * _test_kashf_operating_rules_non_activation.mjs
 *
 * Part 3 of the 2026-10-05 closing round: proves the six non-activation
 * scenarios required alongside KASHF_AI_BRIDGE_OPERATING_RULES.md --
 * each one proves something does NOT fire when it should not, not just
 * that the positive path works.
 *
 *   (a) a normal question without dhamir
 *   (b) an explicit dhamir intent with a selected method
 *   (c) a question about another person
 *   (d) absence of confirmation for casting-on-a-person's-name when required
 *   (e) a valid board with a warning
 *   (f) a state requiring a stop/re-cast per a verified source
 *
 * (e) and (f) are also covered in more depth in
 * _test_kashf_board_validation_gate.mjs; they are re-asserted here, through
 * the same entry points, so this single file is a complete, self-contained
 * record of all six required scenarios for the delivery.
 */

import assert from 'node:assert/strict';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { buildKashfReadingByQuestionId, buildKashfReadingByMethod } from './goral-hachol/engine/kashf-canonical-reading-engine.js';
import { buildKashfCanonicalAiBridge } from './goral-hachol/intelligence/kashf-canonical-ai-bridge.js';
import { computeSelectedDhamirMethod } from './goral-hachol/engine/kashf-dhamir.js';
import { executeCanonicalCustomMethod } from './goral-hachol/engine/kashf-canonical-executors.js';
import { sanitizeKashfClientContext } from './goral-hachol/engine/kashf-context-sanitizer.js';

let assertions = 0;
function ok(cond, msg) { assertions++; assert(cond, msg); }

// ── (a) a normal question without dhamir ────────────────────────────────
// An ordinary, already-ready question must never carry dhamir output just
// because dhamir exists in the engine -- dhamir is intent-gated (see (b)),
// not something every reading runs by default.

{
  const board = buildRamlBoardFromMothers(['1111', '1111', '1111', '1122']);
  const reading = buildKashfReadingByQuestionId(board, 'q-missing-in-city', { question: 'test, no dhamir intent' });
  ok(reading.valid === true, '(a) ordinary question still produces a valid reading');
  ok(reading.dhamir === null, '(a) dhamir stays null on an ordinary question -- not auto-run');
  ok(reading.dhamirType4External === null, '(a) dhamirType4External stays null too');
  ok(reading.dhamirExtras === null, '(a) dhamirExtras stays null too');
}

// ── (b) an explicit dhamir intent with a selected method ────────────────
// Requires BOTH an approved intentId (only 'hiddenThoughtIntent') AND an
// explicit methodId -- neither alone is enough (see the negative checks
// folded in here too, since they are the direct contrast for (b)).

{
  const board = buildRamlBoardFromMothers(['1111', '1111', '1111', '1122']);

  const selected = computeSelectedDhamirMethod(board, 'mizan', { intentId: 'hiddenThoughtIntent' });
  ok(selected.selected === true, '(b) explicit intent + explicit method -> dhamir runs');
  ok(selected.result?.method === 'mizan', '(b) the exact selected method ran, not some other one');

  const noIntent = computeSelectedDhamirMethod(board, 'mizan', { intentId: null });
  ok(noIntent.selected === false, '(b) contrast: no approved intent -> dhamir does not run even with a method given');
  ok(noIntent.reason === 'dhamir-intent-not-approved', '(b) refusal reason names the missing intent approval specifically');

  const noMethod = computeSelectedDhamirMethod(board, null, { intentId: 'hiddenThoughtIntent' });
  ok(noMethod.selected === false, '(b) contrast: approved intent alone, no method -> dhamir does not run');
  ok(noMethod.reason === 'explicit-dhamir-method-required', '(b) refusal reason names the missing explicit method specifically');

  const wrongIntent = computeSelectedDhamirMethod(board, 'mizan', { intentId: 'someOtherIntent' });
  ok(wrongIntent.selected === false, '(b) contrast: an unapproved intent id (not hiddenThoughtIntent) does not run dhamir');
}

// ── (c) a question about another person ─────────────────────────────────
// Two distinct, non-interchangeable mechanisms: (i) the quesitedName
// context field, relevant only for commerce by its own classifier, and
// (ii) the p159 H6-recurrence subject-identification method, a separate
// intent (dhamir.identifyQuestionSubject) from generic hidden-thought
// discovery and from quesitedName.

{
  const commerceReading = {
    clientContext: { name: 'X', question: 'test', quesitedName: 'Y' },
    topicId: 'commerce',
    primaryFormula: { sourceText: 'test' },
  };
  const sanitizedCommerce = sanitizeKashfClientContext(commerceReading);
  ok(sanitizedCommerce.contextRelevance.quesitedName.relevant === true, '(c) quesitedName is relevant when topicId is commerce');

  const nonCommerceReading = {
    clientContext: { name: 'X', question: 'test', quesitedName: 'Y' },
    topicId: 'missing',
    primaryFormula: { sourceText: 'test' },
  };
  const sanitizedNonCommerce = sanitizeKashfClientContext(nonCommerceReading);
  ok(sanitizedNonCommerce.contextRelevance.quesitedName.relevant === false, '(c) the SAME quesitedName field is NOT relevant for a non-commerce topic -- not a blanket "other person" flag');

  // The p159 subject-identification method is a wholly separate mechanism,
  // reached only by its own intent (dhamir.identifyQuestionSubject), not by
  // the quesitedName field and not by generic question routing.
  const board = buildRamlBoardFromMothers(['1111', '1111', '1111', '1122']);
  const subjectReading = buildKashfReadingByMethod(board, 'dhamir.p159.subjectByH6Recurrence', { question: 'test' });
  ok(subjectReading.valid === true, '(c) the p159 subject-identification method runs when explicitly selected by its own methodId');
  ok(subjectReading.kashfIntentId === 'dhamir.identifyQuestionSubject', '(c) it carries its own distinct intent id, not hiddenThoughtIntent and not a generic question-routing intent');
}

// ── (d) absence of confirmation for casting-on-a-person's-name ──────────
// marriage.p205.modestyPurity requires BOTH a candidate name AND an
// explicit castConfirmedOnName flag. Typing a name alone is not enough.

{
  const board = buildRamlBoardFromMothers(['1111', '1111', '1111', '1122']);

  const noConfirmation = executeCanonicalCustomMethod('marriage.p205.modestyPurity', board, {
    dynFields: { candidate: 'פלונית' }, // name present, confirmation flag absent
  });
  ok(noConfirmation.branch === 'named-cast-not-confirmed', '(d) name alone, without the confirmation flag, does not produce a sign');
  ok(noConfirmation.positive === null, '(d) positive stays null -- no verdict is smuggled through');
  ok(noConfirmation.namedCastConfirmed === false, '(d) namedCastConfirmed is explicitly false');

  const noNameAtAll = executeCanonicalCustomMethod('marriage.p205.modestyPurity', board, { dynFields: {} });
  ok(noNameAtAll.branch === 'named-cast-not-confirmed', '(d) no name and no confirmation also refuses a verdict');
  ok(noNameAtAll.positive === null, '(d) positive stays null in this case too');

  // Same question through the full canonical path (which drives the AI
  // bridge) must not surface a usable verdict either.
  const reading = buildKashfReadingByQuestionId(board, 'q-marriage-chastity', {
    question: 'test', dynFields: { candidate: 'פלונית' },
  });
  ok(reading.valid === true, '(d) the canonical path still runs (the executor itself refuses the verdict, not a hard engine error)');
  ok(reading.verdict?.positive === null, '(d) the engine-level verdict.positive stays null when the named-cast precondition is unconfirmed');
}

// ── (e) a valid board with a warning ─────────────────────────────────────
// A warning-severity boardValidation finding must not block a verdict.

{
  const board = buildRamlBoardFromMothers(['2111', '1211', '1121', '1212']);
  ok(board.boardValidation.hasCritical === false, '(e) sanity: this board is warning-only');
  ok(board.boardValidation.warnings.some((w) => w.severity === 'warning'), '(e) sanity: it does carry at least one warning');

  const reading = buildKashfReadingByQuestionId(board, 'q-missing-in-city', { question: 'test' });
  ok(reading.valid === true, '(e) a warning-only board does not block the canonical reading');
  ok(reading.canRunKashf === true, '(e) canRunKashf stays true on a warning-only board');

  const bridge = buildKashfCanonicalAiBridge({ questionId: 'q-missing-in-city', questionText: 'test', board, clientContext: { question: 'test' } });
  ok(bridge.aiVerdictAllowed === true, '(e) the AI bridge still allows a verdict on a warning-only board');
}

// ── (f) a state requiring a stop / re-cast per a verified source ────────
// judge-not-even is the source's own explicit "whole board is invalid"
// rule (p35 context notwithstanding; this is validateJudgeIsEven, a
// separate, unrelated structural rule). Forced directly here because it is
// proven unreachable from any real buildRamlBoardFromMothers casting (see
// _test_kashf_board_validation_gate.mjs and KASHF_AI_BRIDGE_OPERATING_RULES.md
// section 1.3) -- this proves the STOP mechanism itself works end to end.

{
  const realBoard = buildRamlBoardFromMothers(['1111', '1111', '1111', '1122']);
  const criticalBoard = {
    ...realBoard,
    boardValidation: { isValid: false, hasCritical: true, warnings: [{ code: 'judge-not-even', severity: 'critical' }] },
  };

  const reading = buildKashfReadingByQuestionId(criticalBoard, 'q-missing-in-city', { question: 'test' });
  ok(reading.valid === false, '(f) a critical board-validation finding stops the canonical reading');
  ok(reading.canRunKashf === false, '(f) canRunKashf is false');
  ok(reading.verdict === null, '(f) no verdict object is produced at all');
  ok(reading.reason === 'board-validation-critical', '(f) the stop reason names the board-validation gate');

  const bridge = buildKashfCanonicalAiBridge({ questionId: 'q-missing-in-city', questionText: 'test', board: criticalBoard, clientContext: { question: 'test' } });
  ok(bridge.aiVerdictAllowed === false, '(f) the AI bridge refuses to present a verdict when the board itself requires a stop/re-cast');
}

console.log(`Kashf operating-rules non-activation proofs: ${assertions} assertions passed`);
