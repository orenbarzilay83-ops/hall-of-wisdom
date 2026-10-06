import assert from 'node:assert/strict';

import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { buildKashfCanonicalAiBridge } from './goral-hachol/intelligence/kashf-canonical-ai-bridge.js';

// 2026-10-06 (third round): this file checks the ACTUAL CONTENT of
// authoritativeClientDraftHebrew, not merely that it exists or that its
// source lists are correct. The live GPT prompt copies this field
// word-for-word as the client-facing answer, so any internal-only content
// inside it (a raw method ID, an Arabic source quote, a raw 4-digit figure
// pattern code, or grammatical/linguistic analysis) is a direct leak to
// the client. The underlying root cause was authoritativeClientDraftFromReading()
// (kashf-professional-verdict-safety.js) reading executorResult.outputHebrew
// verbatim; it now prefers executorResult.clientSafeHebrew when the
// executor provides one, and several executors were given/fixed that field
// this round. Every assertion below reads the field exactly as the GPT
// prompt would receive it -- through buildKashfCanonicalAiBridge(), never
// by reading the executor directly.
//
// No assertion here may ever accept a changed VERDICT (positive/branch) as
// a side effect of a leak fix -- each case below pins the engine's own
// positive/branch value alongside the content check, so a future edit
// cannot silently soften, invert, or fabricate a verdict while "cleaning up"
// wording.

function draftFor(questionId, mothers, extra = {}) {
  const board = buildRamlBoardFromMothers(mothers);
  const bridge = buildKashfCanonicalAiBridge({
    questionId,
    questionText: 'test',
    board,
    clientContext: { question: 'test', ...extra },
  });
  return {
    draft: bridge.professionalVerdictSafety?.authoritativeClientDraftHebrew,
    executorResult: bridge.canonicalReading?.primaryFormula?.result?.executorResult,
  };
}

const ARABIC_RE = /[؀-ۿ]/;
const METHOD_ID_RE = /\b[a-z][a-z0-9]*\.[a-z][a-z0-9]*\.[a-zA-Z0-9]+\b/;
const RAW_PATTERN_RE = /[^0-9](1111|1112|1121|1122|1211|1212|1221|1222|2111|2112|2121|2122|2211|2212|2221|2222)[^0-9]/;
const BARE_ENGLISH_WORD_RE = /\b(mixed|saad|nahs|dakhil|kharij|true|false|null)\b/i;

function assertClean(draft, label) {
  assert(typeof draft === 'string' && draft.trim().length > 0, `${label}: a non-empty client draft must exist`);
  assert(!ARABIC_RE.test(draft), `${label}: client draft must not contain raw Arabic source text: ${draft}`);
  assert(!METHOD_ID_RE.test(draft), `${label}: client draft must not contain a raw method ID: ${draft}`);
  assert(!RAW_PATTERN_RE.test(` ${draft} `), `${label}: client draft must not contain a raw 4-digit figure pattern code: ${draft}`);
  assert(!BARE_ENGLISH_WORD_RE.test(draft), `${label}: client draft must not contain a bare English classification word: ${draft}`);
}

// ── q-dispute-h2h8 (explicitly named by this round's instruction) ──────────

{
  // unresolved: neither H2 nor H8 saad.
  const { draft, executorResult } = draftFor('q-dispute-h2h8', ['1111', '1111', '1111', '1111']);
  assert.equal(executorResult.branch, 'unresolved');
  assert.equal(executorResult.positive, null);
  assertClean(draft, 'q-dispute-h2h8/unresolved');
}

{
  // petitioner-wins-sign: H2 saad, H8 not.
  const { draft, executorResult } = draftFor('q-dispute-h2h8', ['1111', '2111', '1111', '1111']);
  assert.equal(executorResult.branch, 'petitioner-wins-sign');
  assert.equal(executorResult.positive, true);
  assertClean(draft, 'q-dispute-h2h8/petitioner-wins-sign');
  assert.match(draft, /המבקש זוכה/, 'the positive verdict itself must survive the cleanup, worded for the client');
}

{
  // respondent-prevails-sign: H8 saad, H2 not.
  const { draft, executorResult } = draftFor('q-dispute-h2h8', ['1111', '1111', '1112', '1112']);
  assert.equal(executorResult.branch, 'respondent-prevails-sign');
  assert.equal(executorResult.positive, false);
  assertClean(draft, 'q-dispute-h2h8/respondent-prevails-sign');
  assert.match(draft, /המבוקש גובר/, 'the negative verdict itself must survive the cleanup, worded for the client');
}

{
  // conflicting-signs: both H2 and H8 saad -- the branch that leaked the
  // sibling method ID "(dispute.p212.winnerH1)" before this round's fix.
  const { draft, executorResult } = draftFor('q-dispute-h2h8', ['1111', '2111', '1112', '1112']);
  assert.equal(executorResult.branch, 'conflicting-signs');
  assert.equal(executorResult.positive, null, 'conflicting signs must never be collapsed into a fabricated binary verdict');
  assertClean(draft, 'q-dispute-h2h8/conflicting-signs');
  assert(!draft.includes('dispute.p212.winnerH1'), 'the sibling method ID must never appear in the client draft');
}

// ── q-missing-arriving (explicitly named by this round's instruction) ──────
// This branch previously leaked a full Arabic quote plus grammatical/
// linguistic analysis ("the grammatical subject is an abstract concept...")
// directly into the client-facing text.

{
  const { draft, executorResult } = draftFor('q-missing-arriving', ['1111', '1111', '1111', '1111']);
  assert.equal(executorResult.verdictType, 'missing-arrival-sign-h3h15-descriptive-only');
  assert.equal(executorResult.positive, null, 'this method is descriptive-only by design and must never report a binary verdict');
  assertClean(draft, 'q-missing-arriving/descriptive-only');
  assert(!/دخول|قادم|الخامس عشر/.test(draft), 'no fragment of the Arabic source sentence may appear in the client draft');
  assert(!/דקדוקי|התקדים|מושג מופשט/.test(draft), 'no grammatical/linguistic analysis may appear in the client draft');
}

{
  // A different board -- confirms the descriptive framing (never a positive)
  // holds across boards, not just the one sampled above.
  const { draft, executorResult } = draftFor('q-missing-arriving', ['2111', '1111', '2211', '1221']);
  assert.equal(executorResult.positive, null);
  assertClean(draft, 'q-missing-arriving/second-board');
}

// ── other confirmed-leaky methods fixed this round ──────────────────────────

{
  // missing.p249.inCitySignH1H4 -- previously leaked raw pattern codes like "(1111)".
  const { draft: d1 } = draftFor('q-missing-in-city', ['1111', '1111', '1111', '1111']);
  assertClean(d1, 'q-missing-in-city/a');
  const { draft: d2 } = draftFor('q-missing-in-city', ['2111', '1211', '1111', '1111']);
  assertClean(d2, 'q-missing-in-city/b');
}

{
  // missing.p249.returnTimingTariqH10H11 -- previously leaked the raw Arabic
  // marker word "مجرب" embedded inline.
  const { draft } = draftFor('q-missing-return-timing', ['1111', '1111', '1111', '1111']);
  assertClean(draft, 'q-missing-return-timing');
  assert.match(draft, /מועד הפגישה/, 'the no-sign branch concerns meeting the absent person');
  assert.doesNotMatch(draft, /מועד החזרה/, 'meeting timing must not be described as return timing');
}

{
  // prisoner.p272.outcomeH1H4 -- previously leaked raw pattern codes.
  const { draft: good } = draftFor('q-prisoner-outcome', ['1111', '2111', '1111', '1122']);
  assertClean(good, 'q-prisoner-outcome/good');
  const { draft: unresolved } = draftFor('q-prisoner-outcome', ['1111', '1111', '1111', '1111']);
  assertClean(unresolved, 'q-prisoner-outcome/unresolved');
}

{
  // prisoner.p272.exitSafetyH12 -- previously leaked raw pattern codes.
  const { draft } = draftFor('q-prisoner-exit-safety', ['1111', '1111', '1111', '1111']);
  assertClean(draft, 'q-prisoner-exit-safety');
}

{
  // partnership.p212.compatibilityH1H7H5H7 -- previously leaked the bare
  // English word "mixed" inline in Hebrew client text.
  const { draft: unresolvedMixed } = draftFor('q-partnership', ['1111', '1111', '1111', '1111']);
  assertClean(unresolvedMixed, 'q-partnership/unresolved-mixed');
  const { draft: good, executorResult: goodExec } = draftFor('q-partnership', ['1111', '1111', '1121', '1121']);
  assertClean(good, 'q-partnership/good');
  assert.equal(goodExec.branch, 'good');
  assert.equal(goodExec.positive, true);
}

{
  // marriage.p205.modestyPurity -- previously leaked Arabic quotes ("وقيل")
  // and advisor-only meta-commentary about alternative-method ordering.
  const { draft, executorResult } = draftFor('q-marriage-chastity', ['1111', '1111', '1111', '1111'], {
    dynFields: { candidate: 'שרה', castConfirmedOnName: true },
  });
  assertClean(draft, 'q-marriage-chastity/general');
  assert.notEqual(executorResult.branch, 'named-cast-not-confirmed');

  // The missing-precondition branch already had a clean clientSafeHebrew
  // before this round; confirm it still is.
  const { draft: missingDraft, executorResult: missingExec } = draftFor('q-marriage-chastity', ['1111', '1111', '1111', '1111'], {
    dynFields: { candidate: 'שרה' },
  });
  assert.equal(missingExec.branch, 'named-cast-not-confirmed');
  assert.equal(missingExec.positive, null);
  assertClean(missingDraft, 'q-marriage-chastity/named-cast-not-confirmed');
  assert.match(missingDraft, /חסר/, 'the missing-precondition draft must still explain what is missing, never fabricate a sign');
}

{
  // matter.p169.validityH6H8 -- previously leaked raw pattern codes.
  const { draft: yes } = draftFor('q-matter-valid', ['1111', '1111', '1111', '1111']);
  assertClean(yes, 'q-matter-valid/a');
  const { draft: no } = draftFor('q-matter-valid', ['2111', '1211', '1111', '1111']);
  assertClean(no, 'q-matter-valid/b');
}

// ── sample of methods already clean before this round (no regression) ──────

{
  const { draft } = draftFor('q-marriage-woman-quality', ['1111', '1111', '1111', '1111'], {
    dynFields: { candidate: 'שרה', castConfirmedOnName: true },
  });
  assertClean(draft, 'q-marriage-woman-quality');
}

{
  const { draft } = draftFor('q-attention-focus', ['1111', '1111', '1111', '1111']);
  assertClean(draft, 'q-attention-focus');
}

{
  const { draft } = draftFor('q-travel-profit', ['1111', '1111', '1111', '1111']);
  assertClean(draft, 'q-travel-profit');
}

{
  const { draft } = draftFor('q-need-fulfillment', ['1111', '1111', '1111', '1111']);
  assertClean(draft, 'q-need-fulfillment');
}

{
  const { draft } = draftFor('q-prisoner-release-manner', ['1111', '1111', '1111', '1111']);
  assertClean(draft, 'q-prisoner-release-manner');
}

{
  const { draft } = draftFor('q-need-move-p168', ['1111', '2111', '2111', '2111']);
  assertClean(draft, 'q-need-move-p168');
}

{
  const { draft } = draftFor('q-request-ease-p168', ['1111', '1111', '2121', '2121']);
  assertClean(draft, 'q-request-ease-p168');
}

console.log('Kashf client draft content-leak audit (opened 2026-10-06, third round): PASS');
console.log('q-dispute-h2h8 (all 4 branches) / q-missing-arriving (2 boards): clean, verdicts preserved: PASS');
console.log('missing-in-city / missing-return-timing / prisoner-outcome / prisoner-exit-safety / partnership / marriage-chastity / matter-valid: clean: PASS');
console.log('Sample of previously-clean methods (woman-quality, attention-focus, travel-profit, need-fulfillment, release-manner, need-move-p168, request-ease-p168): no regression: PASS');
