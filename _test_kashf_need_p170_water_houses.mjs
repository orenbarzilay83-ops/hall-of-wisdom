#!/usr/bin/env node
/**
 * _test_kashf_need_p170_water_houses.mjs
 *
 * Golden tests for need.p170.waterHousesRowOpen.
 *
 * Opened 2026-10-05 from the actual printed-page scan images (not OCR, not
 * a secondary transcription): printed_043__pdf_045.jpg, printed_047__pdf_049.jpg,
 * printed_169__pdf_171.jpg, printed_170__pdf_172.jpg.
 *
 * Photographed line (p170, PDF 172), second "also" note:
 * "ـ وأيضا ـ انظر البيوت المائية، إذا انفتح فيهم الماء، فإن المسئلة تحصل؛
 *  وإن كان بخلاف ذلك، فالمسئلة مانعة على هذا النفس."
 * (Also: look at the watery houses. If the water opens in them, the matter
 *  is attained; if the contrary, the matter is prevented for this person.)
 *
 * "Watery houses" / "water houses" (بيوت الماء, one sentence earlier on the
 * same photographed page) is read as houses 3, 7, 11, 15 -- confirmed from
 * two other photographed lines:
 *   - p43 (PDF 45): "وفيها: ... أوتاد، ومواليات، وزايلات، وتسمى: ساقطات ...
 *     وفيها: ناري وهوائي، وماني (مائي) وترابي" -- the general list of house
 *     attribute-axes, including the fixed Fire/Air/Water/Earth cycle.
 *   - p47 (PDF 49): "والإخاء: البيت الثالث من الأمهات: شرقي، وزايل الوتد، ...
 *     وماني، ... والشكل الحال فيه يسمى: ماء الماء، وهو بيت الأخوة" -- House 3
 *     itself is explicitly water-element ("ماني") and cadent ("زايل الوتد"),
 *     confirming the fixed per-house cycle puts water at 3 (and by the same
 *     4-house cycle, at 7, 11, 15).
 *
 * Computation action: read houses 3, 7, 11, 15 off the real generated board;
 * for each, take the third character of its 4-digit pattern (fire=0, air=1,
 * water=2, earth=3 -- same row order the p204/p170 gaze executors already
 * use); '1' = open, '2' = joined/closed. All four open => positive:true
 * (attained). Any one closed => positive:false (prevented).
 *
 * The two boards below were found by brute-force search over real mother
 * combinations (via buildRamlBoardFromMothers), not by hand-picking house
 * patterns to match the executor's own if-statement.
 */

import assert from 'node:assert/strict';

import { getKashfMethod, validateKashfMethodRegistry } from './goral-hachol/registry/kashf-canonical-method-registry.js';
import { hasCanonicalCustomExecutor, hasCanonicalLegacyExecutor, executeCanonicalCustomMethod } from './goral-hachol/engine/kashf-canonical-executors.js';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';

let assertions = 0;
function ok(cond, msg) { assertions++; assert(cond, msg); }

ok(validateKashfMethodRegistry().valid, 'method registry stays internally valid after adding need.p170.waterHousesRowOpen');

const method = getKashfMethod('need.p170.waterHousesRowOpen');
ok(method.kashfRuntimeStatus === 'ready', 'need.p170.waterHousesRowOpen is ready');
ok(method.executorStatus === 'ready', 'executor is wired');
ok(method.methodRole === 'supporting-condition', 'registered as a supporting condition, not a second canonical-operational method');
ok(method.runtimeAllowed === false, 'not auto-selected as the operational primary for need.fulfillment without an explicit routing decision');
ok(method.kashfIntentId === 'need.fulfillment', 'shares the need.fulfillment intent with need.p169.fulfillmentH1Fortune, by design');
ok(/بيوت المائية|بيوت الماء/.test(method.notes || ''), 'registry notes carry the exact photographed Arabic for the water-houses clause');
ok(/p43|PDF 45/.test(method.notes || '') && /p47|PDF 49/.test(method.notes || ''), 'registry notes cite the exact scan pages used to resolve which houses are the water houses');

ok(hasCanonicalCustomExecutor('need.p170.waterHousesRowOpen'), 'executor is reachable via the canonical custom-executor dispatch');

// Sibling H10 "look at the tenth" sub-rule and the first (derived-figure)
// water-houses note stay correctly blocked -- this round only closed the
// second, simpler water-houses note.
const bundle = getKashfMethod('need.p169-170.outcomeRules');
ok(bundle.kashfRuntimeStatus === 'blocked-by-source', 'the remaining p169-170 bundle (H10 tenth-house rule + derived-figure water-houses note) stays blocked-by-source');
ok(!hasCanonicalCustomExecutor('need.p169-170.outcomeRules') && !hasCanonicalLegacyExecutor('need.p169-170.outcomeRules'), 'the remaining bundle has no executor');
ok(!/three distinct remaining/.test(bundle.notes || ''), 'bundle notes were updated to reflect the split (no longer claims three unclosed sub-notes)');

// Branch A (all four water rows open): real board via buildRamlBoardFromMothers.
{
  const board = buildRamlBoardFromMothers(['1211', '1111', '1211', '1111']);
  const result = executeCanonicalCustomMethod('need.p170.waterHousesRowOpen', board);
  ok(result != null, 'all-open case: executor returns a result from a real generated board');
  ok(result.houses.find((h) => h.houseNumber === 3).pattern === '1211', 'all-open case: real board lands H3=1211 as expected');
  ok(result.houses.find((h) => h.houseNumber === 7).pattern === '1111', 'all-open case: real board lands H7=1111 as expected');
  ok(result.houses.find((h) => h.houseNumber === 11).pattern === '1212', 'all-open case: real board lands H11=1212 as expected');
  ok(result.houses.find((h) => h.houseNumber === 15).pattern === '1212', 'all-open case: real board lands H15=1212 as expected');
  ok(result.houses.every((h) => h.waterRowState === 'open'), 'all-open case: all four water rows read as open');
  ok(result.allWaterRowsOpen === true, 'all-open case: allWaterRowsOpen is true');
  ok(result.positive === true, 'all-open case: matter judged attained');
  ok(result.outputHebrew.includes('תתקיים'), 'all-open case: Hebrew output preserves the positive source verdict');
}

// Branch B (H11 and H15 water rows closed): real board via buildRamlBoardFromMothers.
{
  const board = buildRamlBoardFromMothers(['1111', '1111', '1111', '1111']);
  const result = executeCanonicalCustomMethod('need.p170.waterHousesRowOpen', board);
  ok(result.houses.find((h) => h.houseNumber === 11).pattern === '2222', 'one-closed case: real board lands H11=2222 as expected');
  ok(result.houses.find((h) => h.houseNumber === 15).pattern === '2222', 'one-closed case: real board lands H15=2222 as expected');
  ok(result.houses.find((h) => h.houseNumber === 11).waterRowState === 'joined', 'one-closed case: H11 water row reads as closed/joined (digit 2)');
  ok(result.houses.find((h) => h.houseNumber === 15).waterRowState === 'joined', 'one-closed case: H15 water row reads as closed/joined (digit 2)');
  ok(result.allWaterRowsOpen === false, 'one-closed case: allWaterRowsOpen is false');
  ok(result.positive === false, 'one-closed case: matter judged prevented for this asker');
  ok(result.outputHebrew.includes('נמנעת'), 'one-closed case: Hebrew output preserves the negative source verdict');
}

// Missing/incomplete board data: must not guess.
{
  const result = executeCanonicalCustomMethod('need.p170.waterHousesRowOpen', { entries: [] });
  ok(result === null, 'missing board data returns null rather than guessing');
}

console.log(`Kashf p170 water-houses golden tests: ${assertions} assertions passed`);
