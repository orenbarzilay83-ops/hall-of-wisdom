#!/usr/bin/env node
/**
 * _test_kashf_need_fulfillment_p169.mjs
 *
 * Golden tests for need.p169.fulfillmentH1Fortune (q-need-fulfillment).
 * Opened 2026-10-05, split out of the formerly-bundled
 * need.p169-170.outcomeRules (that id is kept for the three sub-rules
 * still genuinely unresolved — see its updated registry notes).
 *
 * Re-read printed p169 (PDF 171) at 1600 DPI. Two adjacent body-text
 * نكتة notes: "في الحاجة: فالحاجة: في الأول؛ والأصل: في الرابع؛ والقوة: في
 * العاشر؛ والنهاية: في السابع" (the need itself is assigned to H1),
 * immediately followed by "في الحاجة هل تقضى أم لا؟ فانظر الذي في بيت
 * الحاجة، فإن كان سعدا، إنقضت؛ وإن كان ممتزجا، ففيها بطئ؛ وإن كان نحسا،
 * فلا تقضى" (look at what is in the house of the need: benefic =>
 * fulfilled, mixed => delayed, malefic => not fulfilled). "بيت الحاجة" is
 * read as H1 via the immediately preceding note's own explicit assignment
 * — a context-based reading grounded in the adjacent text, not a guess.
 *
 * A fully closed 3-way branch over all three fortune classes — unlike most
 * methods in this corpus, the source gives an explicit verdict for the
 * mixed case too (delay), not silence.
 *
 * Distinct from hope.p267.fulfillment (H11, page 267, q-wish) — a
 * different source page and a different book intent ("الحاجة"/need vs
 * "الأمل"/hope) — must never be merged or voted together.
 *
 * All boards below use real mother-derived boards (buildRamlBoardFromMothers).
 */

import assert from 'node:assert/strict';

import { getKashfMethod, validateKashfMethodRegistry } from './goral-hachol/registry/kashf-canonical-method-registry.js';
import { resolveKashfRouteByQuestionId } from './goral-hachol/engine/kashf-method-router.js';
import { buildKashfReadingByQuestionId } from './goral-hachol/engine/kashf-canonical-reading-engine.js';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';

let assertions = 0;
function ok(cond, msg) { assertions++; assert(cond, msg); }

ok(validateKashfMethodRegistry().valid, 'method registry stays internally valid');

const method = getKashfMethod('need.p169.fulfillmentH1Fortune');
ok(method.kashfRuntimeStatus === 'ready', 'need.p169.fulfillmentH1Fortune is ready');
ok(method.runtimeAllowed === true, 'runtime is allowed');
ok(method.executorStatus === 'ready', 'executor is wired');
ok(/بيت الحاجة/.test(method.notes || ''), 'registry notes carry the exact Arabic quote');

// The remaining bundle must stay blocked and distinct, not silently closed.
const bundle = getKashfMethod('need.p169-170.outcomeRules');
ok(bundle.kashfRuntimeStatus === 'blocked-by-source', 'the remaining 3-note bundle (H10/Awtad timing + water-house rules) stays blocked');
ok(bundle.kashfIntentId === 'need.fulfillmentCompound', 'the remaining bundle keeps a distinct intent id from the opened H1 rule');

const route = resolveKashfRouteByQuestionId('q-need-fulfillment');
ok(route.kashfMethodId === 'need.p169.fulfillmentH1Fortune', 'q-need-fulfillment routes to the p169 H1 method');
ok(route.canRunKashf === true, 'q-need-fulfillment is runnable');

// Benefic H1 -> fulfilled.
{
  const board = buildRamlBoardFromMothers(['2211', '1111', '1111', '1111']);
  const reading = buildKashfReadingByQuestionId(board, 'q-need-fulfillment', { question: 'test' });
  const er = reading?.primaryFormula?.result?.executorResult;
  ok(reading.valid === true, 'benefic case: valid reading');
  ok(er?.h1Pattern === '2211' && er?.fortune === 'saad', 'benefic case: real board lands on H1=2211 (saad)');
  ok(er?.outcome === 'fulfilled', 'benefic case: outcome is fulfilled');
  ok(reading?.primaryFormula?.verdict?.positive === true, 'benefic case: engine-level positive is true');
}

// Malefic H1 -> not fulfilled.
{
  const board = buildRamlBoardFromMothers(['2221', '1111', '1111', '1111']);
  const reading = buildKashfReadingByQuestionId(board, 'q-need-fulfillment', { question: 'test' });
  const er = reading?.primaryFormula?.result?.executorResult;
  ok(reading.valid === true, 'malefic case: valid reading');
  ok(er?.h1Pattern === '2221' && er?.fortune === 'nahs', 'malefic case: real board lands on H1=2221 (nahs)');
  ok(er?.outcome === 'not-fulfilled', 'malefic case: outcome is not-fulfilled');
  ok(reading?.primaryFormula?.verdict?.positive === false, 'malefic case: engine-level positive is false');
}

// Mixed H1 -> delayed (the source gives an explicit verdict here too, unlike most methods).
{
  const board = buildRamlBoardFromMothers(['1111', '1111', '1111', '1111']);
  const reading = buildKashfReadingByQuestionId(board, 'q-need-fulfillment', { question: 'test' });
  const er = reading?.primaryFormula?.result?.executorResult;
  ok(reading.valid === true, 'mixed case: valid reading');
  ok(er?.h1Pattern === '1111' && er?.fortune === 'mixed', 'mixed case: real board lands on H1=1111 (mixed)');
  ok(er?.outcome === 'delayed', 'mixed case: outcome is delayed (explicit source verdict, not silence)');
  ok(reading?.primaryFormula?.verdict?.positive === null, 'mixed case: engine-level positive stays null (delay is not a boolean yes/no)');
}

// Must stay fully isolated from hope.p267.fulfillment / q-wish.
{
  const wishRoute = resolveKashfRouteByQuestionId('q-wish');
  ok(wishRoute.kashfMethodId === 'hope.p267.fulfillment', 'q-wish keeps its own p267 method, unaffected by need.p169');
  const board = buildRamlBoardFromMothers(['2211', '1111', '1111', '1111']);
  const needReading = buildKashfReadingByQuestionId(board, 'q-need-fulfillment', { question: 'test' });
  ok(needReading?.canonicalExecution?.methodsExecuted?.length === 1
    && needReading.canonicalExecution.methodsExecuted[0] === 'need.p169.fulfillmentH1Fortune',
    'q-need-fulfillment executes only its own p169 method, never the p267 hope method');
}

console.log(`Kashf need-fulfillment p169 golden tests: ${assertions} assertions passed`);
