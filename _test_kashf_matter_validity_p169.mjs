#!/usr/bin/env node
/**
 * _test_kashf_matter_validity_p169.mjs
 *
 * Golden tests for matter.p169.validityH6H8Planet (q-matter-valid).
 * Opened 2026-10-05: re-read printed p169 (PDF 171) directly at 1600 DPI.
 * Exact quote: "نكتة: هذا الأمر يصح لي أم لا؟ أخرج من السادس والثامن شكلا،
 * فإن كان من أشكال الزهرة، أو القمر، أو عطارد، فالأمر يصح؛ وإن كان خلاف
 * هذه الأشكال، فلا يصح" — derive a figure from H6+H8; if it is among the
 * figures of Venus, the Moon or Mercury, the matter is right/valid for the
 * querent; any other figure, it is not. Body text (no attribution marker)
 * between two unrelated "نكتة" notes. The prior block was specifically the
 * v57 Hebrew knowledge layer losing the explicit Mercury term — the Arabic
 * scan itself was never ambiguous, and no v57 entry even existed yet.
 *
 * Distinct from q-success (completion.p173.fireRows15910, "will it
 * succeed") — this answers suitability/rightness for the querent, not
 * outcome, and must never be merged with or vote against it.
 *
 * All boards below were found by brute-force search over the 65,536
 * mother combinations so every branch is reached through real
 * board-generation math (buildRamlBoardFromMothers), not by mirroring the
 * executor's own if-statements. Six of sixteen possible H6+H8-derived
 * figures qualify (Venus {1121,2211}, Moon {2212,1111}, Mercury
 * {2112,2222}); the other ten do not — a closed binary with no
 * undetermined branch.
 */

import assert from 'node:assert/strict';

import { getKashfMethod, validateKashfMethodRegistry } from './goral-hachol/registry/kashf-canonical-method-registry.js';
import { resolveKashfRouteByQuestionId } from './goral-hachol/engine/kashf-method-router.js';
import { buildKashfReadingByQuestionId } from './goral-hachol/engine/kashf-canonical-reading-engine.js';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { getKashfAiRetrievalRecord } from './goral-hachol/registry/kashf-ai-retrieval-index.js';

let assertions = 0;
function ok(cond, msg) { assertions++; assert(cond, msg); }

ok(validateKashfMethodRegistry().valid, 'method registry stays internally valid');

const method = getKashfMethod('matter.p169.validityH6H8Planet');
ok(method.kashfRuntimeStatus === 'ready', 'matter.p169.validityH6H8Planet is ready');
ok(method.runtimeAllowed === true, 'runtime is allowed');
ok(method.executorStatus === 'ready', 'executor is wired');
ok(/أشكال الزهرة، أو القمر، أو عطارد/.test(method.notes || ''), 'registry notes carry the exact Arabic quote');

const route = resolveKashfRouteByQuestionId('q-matter-valid');
ok(route.kashfMethodId === 'matter.p169.validityH6H8Planet', 'q-matter-valid routes to the p169 method');
ok(route.canRunKashf === true, 'q-matter-valid is runnable');

// Mercury (عطارد / כוכב): mothers all 1111 -> H6=1111, H8=1111 -> combined 2222.
{
  const board = buildRamlBoardFromMothers(['1111', '1111', '1111', '1111']);
  const reading = buildKashfReadingByQuestionId(board, 'q-matter-valid', { question: 'test' });
  const er = reading?.primaryFormula?.result?.executorResult;
  ok(reading.valid === true, 'Mercury case: valid reading');
  ok(er?.h6Pattern === '1111' && er?.h8Pattern === '1111' && er?.resultPattern === '2222', 'Mercury case: real board lands on the expected houses/result');
  ok(er?.planetHebrew === 'כוכב' && er?.qualifies === true, 'Mercury case: qualifies');
  ok(reading?.primaryFormula?.verdict?.positive === true, 'Mercury case: engine-level positive is true');
}

// Moon (القمر / ירח): mothers 1111,1111,1112,1111 -> H6=1111, H8=1121 -> combined 2212.
{
  const board = buildRamlBoardFromMothers(['1111', '1111', '1112', '1111']);
  const reading = buildKashfReadingByQuestionId(board, 'q-matter-valid', { question: 'test' });
  const er = reading?.primaryFormula?.result?.executorResult;
  ok(reading.valid === true, 'Moon case: valid reading');
  ok(er?.resultPattern === '2212', 'Moon case: real board lands on the expected result');
  ok(er?.planetHebrew === 'ירח' && er?.qualifies === true, 'Moon case: qualifies');
  ok(reading?.primaryFormula?.verdict?.positive === true, 'Moon case: engine-level positive is true');
}

// Venus (الزهرة / נוגה): mothers 1111,1111,1112,1112 -> H6=1111, H8=1122 -> combined 2211.
{
  const board = buildRamlBoardFromMothers(['1111', '1111', '1112', '1112']);
  const reading = buildKashfReadingByQuestionId(board, 'q-matter-valid', { question: 'test' });
  const er = reading?.primaryFormula?.result?.executorResult;
  ok(reading.valid === true, 'Venus case: valid reading');
  ok(er?.resultPattern === '2211', 'Venus case: real board lands on the expected result');
  ok(er?.planetHebrew === 'נוגה' && er?.qualifies === true, 'Venus case: qualifies');
  ok(reading?.primaryFormula?.verdict?.positive === true, 'Venus case: engine-level positive is true');
}

// Negative branch: mothers 1111,1111,1111,1112 -> H6=1111, H8=1112 -> combined 2221 (Saturn) — does not qualify.
{
  const board = buildRamlBoardFromMothers(['1111', '1111', '1111', '1112']);
  const reading = buildKashfReadingByQuestionId(board, 'q-matter-valid', { question: 'test' });
  const er = reading?.primaryFormula?.result?.executorResult;
  ok(reading.valid === true, 'negative case: valid reading');
  ok(er?.resultPattern === '2221', 'negative case: real board lands on the expected result');
  ok(er?.planetHebrew === 'שבתאי' && er?.qualifies === false, 'negative case: does not qualify (Saturn)');
  ok(reading?.primaryFormula?.verdict?.positive === false, 'negative case: engine-level positive is false (this is a closed binary, not an undetermined branch)');
}

// Must stay distinct from q-success (completion.p173) — no cross-voting.
{
  const successRoute = resolveKashfRouteByQuestionId('q-success');
  ok(successRoute.kashfMethodId === 'completion.p173.fireRows15910', 'q-success keeps its own method, unaffected by q-matter-valid');
  const board = buildRamlBoardFromMothers(['1111', '1111', '1111', '1111']);
  const successReading = buildKashfReadingByQuestionId(board, 'q-success', { question: 'test' });
  ok(successReading?.canonicalExecution?.methodsExecuted?.length === 1
    && successReading.canonicalExecution.methodsExecuted[0] === 'completion.p173.fireRows15910',
    'q-success executes only its own method, not matter.p169.validityH6H8Planet');
}

// AI retrieval must expose the method's real boundary, not a generic stand-in.
{
  const record = getKashfAiRetrievalRecord('matter.p169.validityH6H8Planet');
  ok(Boolean(record), 'matter.p169.validityH6H8Planet has an AI retrieval record');
}

console.log(`Kashf matter-validity p169 golden tests: ${assertions} assertions passed`);
