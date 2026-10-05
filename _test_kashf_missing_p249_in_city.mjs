#!/usr/bin/env node
/**
 * _test_kashf_missing_p249_in_city.mjs
 *
 * Golden tests for printed p249-250 (PDF 251-252) in-city signs, split
 * out of the former combined blocker missing.p249.locationDirectionUnresolved
 * (renamed to the still-blocked missing.p249.directionUnresolved):
 *   - missing.p249.inCitySignAwtad -- WITHDRAWN 2026-10-05 (independent
 *     re-audit, flagged on review): opened in the same round it was
 *     later revoked. The claimed "all four Awtad must uniformly agree"
 *     mechanism does not hold up grammatically (a singular predicate
 *     against an explicitly plural, four-count named subject -- see the
 *     method registry's own entry for the full finding). No executor is
 *     registered; this file now locks in its blocked status.
 *   - missing.p249.inCitySignH1H4 -- PROMOTED 2026-10-05 from supporting
 *     condition to the sole primary method for missing.currentlyInCity,
 *     now that its former sibling has been withdrawn. Grammatically
 *     sound (explicit "خذ...شكلا" combination, no mismatch). Routed to
 *     q-missing-in-city (re-pointed from the withdrawn method).
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

ok(validateKashfMethodRegistry().valid, 'method registry stays internally valid after withdrawing inCitySignAwtad and promoting inCitySignH1H4');
ok(validateKashfQuestionRoutes((id) => getKashfMethod(id)).valid, 'question route registry stays internally valid');

// ── missing.p249.inCitySignAwtad (withdrawn) ────────────────────────────
//
// Photographed line (p249, PDF 251): "نكتة: عن شخص هل هو في المدينة أم
// لا؟ خذ رؤوس الأشكال (لعله: الأوتاد) الأربعة، فإن خلف داخلا، فهو فيها؛
// وإن كان خارجا، فليس فيها."
//
// The verb "خلف" and predicate "داخلا" are grammatically SINGULAR
// (re-verified at high zoom against the raw scan: no plural/dual marker,
// no attached pronoun), while the named subject "رؤوس الأشكال...الأربعة"
// is explicitly plural and four-count. No "all four must agree"
// collective condition is textually supported, and no alternative
// specific mechanism could be proven either. This clause stays
// blocked-by-source with no executor.

const awtadMethod = getKashfMethod('missing.p249.inCitySignAwtad');
ok(awtadMethod.methodRole === 'unresolved', 'missing.p249.inCitySignAwtad is unresolved (withdrawn)');
ok(awtadMethod.kashfRuntimeStatus === 'blocked-by-source', 'missing.p249.inCitySignAwtad is blocked-by-source');
ok(awtadMethod.runtimeAllowed === false, 'missing.p249.inCitySignAwtad is not runtime-allowed');
ok(!hasCanonicalCustomExecutor('missing.p249.inCitySignAwtad'), 'missing.p249.inCitySignAwtad has no executor (correctly withdrawn)');
ok(/WITHDRAWN 2026-10-05/.test(awtadMethod.notes || ''), 'registry notes document the withdrawal');
ok(/GRAMMATICALLY SINGULAR/.test(awtadMethod.notes || ''), 'registry notes document the specific grammatical finding (singular predicate vs. plural named subject)');
ok(/لعله/.test(awtadMethod.notes || ''), 'registry notes correctly cite the printed book\'s own "لعله" (perhaps) hedge, not an overconfident "العله"');

{
  let threw = false;
  let code = null;
  try {
    executeCanonicalCustomMethod('missing.p249.inCitySignAwtad', buildRamlBoardFromMothers(['2121', '1111', '2112', '2111']));
  } catch (err) {
    threw = true;
    code = err.code;
  }
  ok(threw, 'missing.p249.inCitySignAwtad: dispatch refuses to run (throws) rather than producing a guessed verdict');
  ok(code === 'KASHF_CANONICAL_CUSTOM_EXECUTOR_NOT_APPROVED', 'missing.p249.inCitySignAwtad: throw carries the standard not-approved error code');
}

// q-missing-in-city no longer points at the withdrawn method.
{
  const route = getKashfQuestionRoute('q-missing-in-city');
  ok(route != null, 'q-missing-in-city route exists');
  ok(route.kashfMethodId !== 'missing.p249.inCitySignAwtad', 'q-missing-in-city no longer routes to the withdrawn Awtad method');
}

// ── missing.p249.inCitySignH1H4 (promoted to primary) ───────────────────
//
// Photographed line (p250, PDF 252): "ومن غيره: خذ من الرابع والأول
// شكلا، واحكم على ما يدل من دخول أو ضده: رجع."
//
// Computation: combine H1+H4; dakhil => in-city/returned sign (source's
// own word: "رجع"), kharij => the source's own explicit stated opposite.

const h1h4Method = getKashfMethod('missing.p249.inCitySignH1H4');
ok(h1h4Method.kashfRuntimeStatus === 'ready', 'missing.p249.inCitySignH1H4 is ready');
ok(h1h4Method.runtimeAllowed === true, 'missing.p249.inCitySignH1H4 is now runtime-allowed (promoted to primary)');
ok(h1h4Method.executorStatus === 'ready', 'executor is wired');
ok(h1h4Method.kashfIntentId === 'missing.currentlyInCity', 'registered under the missing.currentlyInCity intent');
ok(/ومن غيره/.test(h1h4Method.notes || ''), 'registry notes carry the source\'s own "alternate method" marker');
ok(/PROMOTED 2026-10-05/.test(h1h4Method.notes || ''), 'registry notes document the promotion from supporting-condition to primary');
ok(hasCanonicalCustomExecutor('missing.p249.inCitySignH1H4'), 'executor is reachable via dispatch');

const h1h4Route = getKashfQuestionRoute('q-missing-in-city');
ok(h1h4Route.kashfMethodId === 'missing.p249.inCitySignH1H4', 'q-missing-in-city routes to the promoted H1+H4 method');

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
  ok(result.outputHebrew.includes('חזר'), 'dakhil case: Hebrew output names the source\'s own word "חזר" (רجع)');
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
