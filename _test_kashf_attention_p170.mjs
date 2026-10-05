#!/usr/bin/env node
/**
 * _test_kashf_attention_p170.mjs
 *
 * Golden tests for attention.p170.mutualGazeFireRows1713 (q-attention-focus).
 * Opened 2026-10-05: re-read printed p170 (PDF 172) at 1600 DPI. Exact
 * quote: "نكتة: إذا قال لك سائل: هل هذا الشخص ينظر إلي أو ينظر إلى غيره؟
 * فانظر إلى أشكال الرمل، فإن إنحل نار الأول، ونار السابع، وانسد نار الثالث
 * عشر، فتنظر له وينظر لك؛ وإذا إنحل نار الثالث عشر، وإنسد نار الأول،
 * وانفتح نار السابع، فهو ينظر الغير، والغير ينظر له، وعلى هذا العمل فقس،
 * والله أعلم." Body text, no attribution marker.
 *
 * Same H1/H7/H13 fire-row houses as love.p204.attentionFireRows1713, but a
 * separate, more general source note (no marriage/romance framing) with a
 * second explicit branch p204 does not give at all. Per the pre-existing
 * registry instruction, these two methods must NEVER be merged or voted
 * together — this file verifies that boundary holds, not just that this
 * method's own branches are correct.
 *
 * All boards below were found by brute-force search over the 65,536
 * mother combinations so every branch is reached through real
 * board-generation math, not by mirroring the executor's own if-statements.
 */

import assert from 'node:assert/strict';

import { getKashfMethod, validateKashfMethodRegistry } from './goral-hachol/registry/kashf-canonical-method-registry.js';
import { resolveKashfRouteByQuestionId } from './goral-hachol/engine/kashf-method-router.js';
import { buildKashfReadingByQuestionId } from './goral-hachol/engine/kashf-canonical-reading-engine.js';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';

let assertions = 0;
function ok(cond, msg) { assertions++; assert(cond, msg); }

ok(validateKashfMethodRegistry().valid, 'method registry stays internally valid');

const method = getKashfMethod('attention.p170.mutualGazeFireRows1713');
ok(method.kashfRuntimeStatus === 'ready', 'attention.p170.mutualGazeFireRows1713 is ready');
ok(method.runtimeAllowed === true, 'runtime is allowed');
ok(method.executorStatus === 'ready', 'executor is wired');
ok(/ينظر الغير، والغير ينظر له/.test(method.notes || ''), 'registry notes carry the second-branch Arabic quote');
ok(/must never be merged|never merged|kept entirely separate/i.test(method.notes || ''), 'registry notes state the no-merge boundary with p204');

const route = resolveKashfRouteByQuestionId('q-attention-focus');
ok(route.kashfMethodId === 'attention.p170.mutualGazeFireRows1713', 'q-attention-focus routes to the p170 method');
ok(route.canRunKashf === true, 'q-attention-focus is runnable');

// Branch A (mutual gaze): mothers all 1111 -> H1=1111(open), H7=1111(open), H13=2222(joined).
{
  const board = buildRamlBoardFromMothers(['1111', '1111', '1111', '1111']);
  const reading = buildKashfReadingByQuestionId(board, 'q-attention-focus', { question: 'test' });
  const er = reading?.primaryFormula?.result?.executorResult;
  ok(reading.valid === true, 'mutual-gaze case: valid reading');
  ok(er?.fireRows?.h1 === 'open' && er?.fireRows?.h7 === 'open' && er?.fireRows?.h13 === 'joined', 'mutual-gaze case: real board lands on the expected fire-row states');
  ok(er?.gazeDirection === 'mutual', 'mutual-gaze case: gazeDirection is mutual');
  ok(reading?.primaryFormula?.verdict?.positive === true, 'mutual-gaze case: engine-level positive is true');
}

// Branch B (looks elsewhere): mothers 2111,1111,1111,1111 -> H1=2111(joined), H7=1111(open), H13=1222(open).
{
  const board = buildRamlBoardFromMothers(['2111', '1111', '1111', '1111']);
  const reading = buildKashfReadingByQuestionId(board, 'q-attention-focus', { question: 'test' });
  const er = reading?.primaryFormula?.result?.executorResult;
  ok(reading.valid === true, 'looks-elsewhere case: valid reading');
  ok(er?.fireRows?.h1 === 'joined' && er?.fireRows?.h7 === 'open' && er?.fireRows?.h13 === 'open', 'looks-elsewhere case: real board lands on the expected fire-row states');
  ok(er?.gazeDirection === 'elsewhere', 'looks-elsewhere case: gazeDirection is elsewhere');
  ok(reading?.primaryFormula?.verdict?.positive === false, 'looks-elsewhere case: engine-level positive is false');
}

// Undetermined branch: neither of the two explicit fire-row patterns holds.
{
  const board = buildRamlBoardFromMothers(['1111', '1111', '1111', '2111']);
  const reading = buildKashfReadingByQuestionId(board, 'q-attention-focus', { question: 'test' });
  const er = reading?.primaryFormula?.result?.executorResult;
  ok(reading.valid === true, 'undetermined case: valid reading');
  ok(er?.gazeDirection === null, 'undetermined case: gazeDirection is null (no invented third branch)');
  ok(reading?.primaryFormula?.verdict?.positive === null, 'undetermined case: engine-level positive is null');
}

// Must stay fully isolated from love.p204.attentionFireRows1713 / q-who-looks-love.
{
  const loveRoute = resolveKashfRouteByQuestionId('q-who-looks-love');
  ok(loveRoute.kashfMethodId === 'love.p204.attentionFireRows1713', 'q-who-looks-love keeps its own p204 method, unaffected by p170');
  const board = buildRamlBoardFromMothers(['1111', '1111', '1111', '1111']);
  const loveReading = buildKashfReadingByQuestionId(board, 'q-who-looks-love', { question: 'test' });
  ok(loveReading?.canonicalExecution?.methodsExecuted?.length === 1
    && loveReading.canonicalExecution.methodsExecuted[0] === 'love.p204.attentionFireRows1713',
    'q-who-looks-love executes only its own p204 method, never the p170 one');
  const focusReading = buildKashfReadingByQuestionId(board, 'q-attention-focus', { question: 'test' });
  ok(focusReading?.canonicalExecution?.methodsExecuted?.length === 1
    && focusReading.canonicalExecution.methodsExecuted[0] === 'attention.p170.mutualGazeFireRows1713',
    'q-attention-focus executes only its own p170 method, never the p204 one');
  // Same mutual-gaze board independently confirms the SAME condition in both
  // sibling methods (p170's branch A and p204's single branch are
  // textually identical on H1/H7/H13), without the two results voting
  // together anywhere in the pipeline.
  ok(loveReading?.primaryFormula?.result?.executorResult?.sourceConditionMet === true, 'p204 also independently reads the same mutual condition as met on this board');
}

console.log(`Kashf attention p170 golden tests: ${assertions} assertions passed`);
