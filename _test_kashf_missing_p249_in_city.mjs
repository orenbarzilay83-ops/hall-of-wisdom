#!/usr/bin/env node
/**
 * _test_kashf_missing_p249_in_city.mjs
 *
 * Golden tests for two methods opened this round from printed p249-250
 * (PDF 251-252), split out of the former combined blocker
 * missing.p249.locationDirectionUnresolved (renamed to the still-blocked
 * missing.p249.directionUnresolved):
 *   - missing.p249.inCitySignAwtad (new intent: missing.currentlyInCity;
 *     ready, routed to q-missing-in-city)
 *   - missing.p249.inCitySignH1H4 (supporting condition, same intent)
 *
 * Resolved from the actual printed-page scan images supplied for this
 * purpose: printed_249__pdf_251.jpg and printed_250__pdf_252.jpg.
 */

import assert from 'node:assert/strict';

import { getKashfMethod, validateKashfMethodRegistry } from './goral-hachol/registry/kashf-canonical-method-registry.js';
import { getKashfQuestionRoute, validateKashfQuestionRoutes } from './goral-hachol/registry/kashf-question-route-registry.js';
import { hasCanonicalCustomExecutor, executeCanonicalCustomMethod } from './goral-hachol/engine/kashf-canonical-executors.js';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';

let assertions = 0;
function ok(cond, msg) { assertions++; assert(cond, msg); }

ok(validateKashfMethodRegistry().valid, 'method registry stays internally valid after opening the two new in-city methods');
ok(validateKashfQuestionRoutes((id) => getKashfMethod(id)).valid, 'question route registry stays internally valid');

// ── missing.p249.inCitySignAwtad ───────────────────────────────────────
//
// Photographed line (p249, PDF 251): "نكتة: عن شخص هل هو في المدينة أم
// لا؟ خذ رؤوس الأشكال (العله: الأوتاد) الأربعة، فإن خلف داخلا، فهو فيها؛
// وإن كان خارجا، فليس فيها."
//
// Computation: all four Awtad (H1,H4,H7,H10) dakhil -> in-city sign
// (positive:true); all four kharij -> the source's own stated inverse,
// not-in-city (positive:false); any other mix -> unresolved.

const awtadMethod = getKashfMethod('missing.p249.inCitySignAwtad');
ok(awtadMethod.kashfRuntimeStatus === 'ready', 'missing.p249.inCitySignAwtad is ready');
ok(awtadMethod.executorStatus === 'ready', 'executor is wired');
ok(awtadMethod.runtimeAllowed === true, 'runtime is allowed');
ok(awtadMethod.kashfIntentId === 'missing.currentlyInCity', 'registered under a new, distinct intent');
ok(/رؤوس الأشكال/.test(awtadMethod.notes || ''), 'registry notes carry the exact photographed clause');
ok(/directionUnresolved/.test(awtadMethod.notes || ''), 'registry notes cross-reference the still-blocked direction portion');
ok(hasCanonicalCustomExecutor('missing.p249.inCitySignAwtad'), 'executor is reachable via dispatch');

const awtadRoute = getKashfQuestionRoute('q-missing-in-city');
ok(awtadRoute != null, 'q-missing-in-city route exists');
ok(awtadRoute.kashfMethodId === 'missing.p249.inCitySignAwtad', 'q-missing-in-city routes to the correct executor');

const AWTAD_CASES = [
  { mothers: ['2121', '1111', '2112', '2111'], branch: 'in-city-sign', positive: true, label: 'all four Awtad dakhil' },
  { mothers: ['1112', '1111', '2112', '1122'], branch: 'not-in-city-sign', positive: false, label: 'all four Awtad kharij' },
  { mothers: ['1111', '1111', '1111', '1111'], branch: 'unresolved', positive: null, label: 'mixed (mujassad) Awtad, no uniform reading' },
];

for (const { mothers, branch, positive, label } of AWTAD_CASES) {
  const board = buildRamlBoardFromMothers(mothers);
  const result = executeCanonicalCustomMethod('missing.p249.inCitySignAwtad', board);
  ok(result != null, `${label}: executor returns a result from a real generated board`);
  ok(result.branch === branch, `${label}: branch is ${branch}`);
  ok(result.positive === positive, `${label}: positive is ${positive}`);
}
ok(AWTAD_CASES[0], 'sanity: at least one Awtad case was exercised');
{
  // Re-verify the explicit dakhil/kharij uniformity of the two decisive cases.
  const board = buildRamlBoardFromMothers(AWTAD_CASES[0].mothers);
  const result = executeCanonicalCustomMethod('missing.p249.inCitySignAwtad', board);
  ok(result.allDakhil === true, 'in-city case: allDakhil is true');
  ok(result.outputHebrew.includes('נמצא בעיר'), 'in-city case: Hebrew output states the in-city sign');
}
{
  const board = buildRamlBoardFromMothers(AWTAD_CASES[1].mothers);
  const result = executeCanonicalCustomMethod('missing.p249.inCitySignAwtad', board);
  ok(result.allKharij === true, 'not-in-city case: allKharij is true');
  ok(result.outputHebrew.includes('אינו בעיר'), 'not-in-city case: Hebrew output states the explicit inverse');
}

{
  const result = executeCanonicalCustomMethod('missing.p249.inCitySignAwtad', { entries: [] });
  ok(result === null, 'missing.p249.inCitySignAwtad: missing board data returns null rather than guessing');
}

// ── missing.p249.inCitySignH1H4 (supporting condition) ─────────────────
//
// Photographed line (p250, PDF 252): "ومن غيره: خذ من الرابع والأول
// شكلا، واحكم على ما يدل من دخول أو ضده: رجع."

const h1h4Method = getKashfMethod('missing.p249.inCitySignH1H4');
ok(h1h4Method.methodRole === 'supporting-condition', 'missing.p249.inCitySignH1H4 is a supporting condition');
ok(h1h4Method.kashfRuntimeStatus === 'ready', 'missing.p249.inCitySignH1H4 is ready (implemented)');
ok(h1h4Method.runtimeAllowed === false, 'missing.p249.inCitySignH1H4 is not auto-selected as primary');
ok(h1h4Method.kashfIntentId === 'missing.currentlyInCity', 'shares the missing.currentlyInCity intent with missing.p249.inCitySignAwtad, by design');
ok(/ومن غيره/.test(h1h4Method.notes || ''), 'registry notes carry the source\'s own "alternate method" marker');
ok(hasCanonicalCustomExecutor('missing.p249.inCitySignH1H4'), 'executor is reachable via dispatch');

{
  // dakhil: in-city/returned sign.
  const board = buildRamlBoardFromMothers(['1111', '1111', '1111', '1122']);
  const entries = board.entries || board;
  const h1 = entries.find((e) => Number(e.house || e.houseNumber) === 1);
  const h4 = entries.find((e) => Number(e.house || e.houseNumber) === 4);
  ok((h1.pattern || h1.key) === '1111' && (h4.pattern || h4.key) === '1122', 'dakhil case: real board lands H1=1111, H4=1122 as expected');

  const result = executeCanonicalCustomMethod('missing.p249.inCitySignH1H4', board);
  ok(result.resultPattern === '2211', 'dakhil case: combine(1111,1122) yields 2211 as expected');
  ok(result.dakhalKharij === 'dakhil', 'dakhil case: result is dakhil');
  ok(result.inCitySign === true, 'dakhil case: inCitySign is true');
  ok(result.positive === true, 'dakhil case: positive is true');
}

{
  // kharij: explicit stated opposite.
  const board = buildRamlBoardFromMothers(['1111', '1111', '1111', '2111']);
  const result = executeCanonicalCustomMethod('missing.p249.inCitySignH1H4', board);
  ok(result.resultPattern === '1222', 'kharij case: combine(1111,2111) yields 1222 as expected');
  ok(result.dakhalKharij === 'kharij', 'kharij case: result is kharij');
  ok(result.notInCitySign === true, 'kharij case: notInCitySign is true');
  ok(result.positive === false, 'kharij case: positive is false (source-stated opposite, not invented)');
}

{
  const result = executeCanonicalCustomMethod('missing.p249.inCitySignH1H4', { entries: [] });
  ok(result === null, 'missing.p249.inCitySignH1H4: missing board data returns null rather than guessing');
}

// ── missing.p249.directionUnresolved (renamed, still blocked) ──────────

const directionMethod = getKashfMethod('missing.p249.directionUnresolved');
ok(directionMethod.methodRole === 'unresolved', 'missing.p249.directionUnresolved stays unresolved');
ok(directionMethod.kashfRuntimeStatus === 'blocked-by-source', 'missing.p249.directionUnresolved stays blocked-by-source');
ok(!hasCanonicalCustomExecutor('missing.p249.directionUnresolved'), 'missing.p249.directionUnresolved has no executor (correctly unimplemented)');
ok(/RENAMED 2026-10-05/.test(directionMethod.notes || ''), 'registry notes document the rename/split from the former combined entry');
ok(/نزهة العقول/.test(directionMethod.notes || ''), 'registry notes re-confirm the Nuzhat attribution exclusion');

console.log(`Kashf p249 in-city golden tests: ${assertions} assertions passed`);
