#!/usr/bin/env node
/**
 * _test_kashf_pregnancy_p191_twins_mujassad.mjs
 *
 * Golden tests for pregnancy.p191.twinsMujassad.
 *
 * Opened 2026-10-05 from the actual printed-page scan images supplied for
 * this purpose: printed_191__pdf_193.jpg and printed_095/096/097__pdf_097-
 * 099.jpg.
 *
 * Photographed line (p191, PDF 193), end of an unbroken H5-figure-state
 * chain (silent/empty/male/female/fixed/مجسد):
 *   "...وإن كان في الخامس شكل ثابت، تعسرت، لم تتخلص، بشهادة الشهود:
 *    الأول والخامس عشر؛ وإن كان مجسدا، فالمولود توأم."
 *
 * Which figures are "مجسد" is first resolved from printed pp95-97 (PDF
 * 97-99), "ومن غير الكتاب: فصل في طبائع الأشكال على التقريب" -- an
 * ATTRIBUTED chapter (it opens with "ومن غير الكتاب", "and from outside
 * the book") walking all 16 figures by name, using the word مجسد for
 * exactly six: أنكيس (2221), جودلة (1121), العتبة الداخلة (2111), نصرة
 * خارجة (1122), نصرة داخلة (2211), العقلة (1221).
 *
 * RESTRICTED 2026-10-05: because that chapter is attributed, not body
 * text, it is not used alone to drive a positive verdict. Each of the six
 * figures' OWN independent body-text profile entry (the unattributed
 * per-figure chapter, pp70-94) was re-read. Only THREE independently call
 * themselves مجسد/מגושם(ת) there: Aqla/1221 (p76), Nakis/2221 (p77), Nusra
 * Dakhila/2211 (p85). The other three's own body entries (Judla/1121 p74,
 * Nusra Kharija/1122 p82, Ataba Dakhila/2111 p89) never use the word --
 * they remain attributed-only, documented separately, and do not drive a
 * positive verdict.
 *
 * This is NOT the same set as the canonical classifier's mujassad-dakhil/
 * mujassad-kharij code labels (an internal name for the unrelated,
 * independently-confirmed eight-figure "fixed"/"mutable" class; overlap is
 * only 2 of 6 figures: 1121, 1221).
 *
 * Computation action: read H5's pattern off the real generated board; if it
 * is one of the THREE body-confirmed مجسد patterns, assert a traditional
 * twins sign (positive:true). Every other H5 figure -- attributed-only or
 * unlisted -- returns positive:null (no verdict), never positive:false --
 * absence/non-body-confirmation of the sign is not evidence against twins.
 *
 * All boards below were found by brute-force search over real mother
 * combinations (via buildRamlBoardFromMothers), not by hand-picking H5 to
 * match the executor's own if-statement.
 */

import assert from 'node:assert/strict';

import { getKashfMethod, validateKashfMethodRegistry } from './goral-hachol/registry/kashf-canonical-method-registry.js';
import { hasCanonicalCustomExecutor, executeCanonicalCustomMethod } from './goral-hachol/engine/kashf-canonical-executors.js';
import {
  MUJASSAD_P95_97_PATTERNS,
  MUJASSAD_BODY_CONFIRMED_PATTERNS,
  MUJASSAD_P95_97_ATTRIBUTED_ONLY_PATTERNS,
  isMujassadP95_97,
  isMujassadBodyConfirmed,
} from './goral-hachol/engine/kashf-figure-classifier.js';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';

let assertions = 0;
function ok(cond, msg) { assertions++; assert(cond, msg); }

ok(validateKashfMethodRegistry().valid, 'method registry stays internally valid after opening pregnancy.p191.twinsMujassad');

const method = getKashfMethod('pregnancy.p191.twinsMujassad');
ok(method.kashfRuntimeStatus === 'ready', 'pregnancy.p191.twinsMujassad is ready');
ok(method.executorStatus === 'ready', 'executor is wired');
ok(method.runtimeAllowed === true, 'runtime is allowed');
ok(/مجسد/.test(method.notes || ''), 'registry notes carry the exact photographed Arabic term');
ok(/95-97|p95-97/.test(method.notes || ''), 'registry notes cite the exact scan pages the figure list came from');
ok(/traditional/i.test(method.notes || ''), 'registry notes frame this as a traditional source sign');
ok(/RESTRICTED/.test(method.notes || ''), 'registry notes document the 2026-10-05 restriction to body-confirmed figures');
ok(hasCanonicalCustomExecutor('pregnancy.p191.twinsMujassad'), 'executor is reachable via the canonical custom-executor dispatch');

// Full p95-97 attributed list: still 6, unchanged, kept for documentation only.
ok(MUJASSAD_P95_97_PATTERNS.length === 6, 'exactly six figures are named مجسد on p95-97 (attributed chapter)');
ok(isMujassadP95_97('2221') && isMujassadP95_97('1121') && isMujassadP95_97('2111')
  && isMujassadP95_97('1122') && isMujassadP95_97('2211') && isMujassadP95_97('1221'),
  'all six attributed-chapter مجسد patterns are still recognized by isMujassadP95_97');
ok(!isMujassadP95_97('1111') && !isMujassadP95_97('2222') && !isMujassadP95_97('2112'),
  'patterns outside the six-figure list are not treated as مجسد (Tariq/Jamaa/Ijtima excluded)');

// Body-confirmed subset (drives the positive branch): exactly 3.
ok(MUJASSAD_BODY_CONFIRMED_PATTERNS.length === 3, 'exactly three of the six are confirmed مجسد in their own body-text entry');
ok(MUJASSAD_BODY_CONFIRMED_PATTERNS.includes('1221')
  && MUJASSAD_BODY_CONFIRMED_PATTERNS.includes('2221')
  && MUJASSAD_BODY_CONFIRMED_PATTERNS.includes('2211'),
  'body-confirmed set is exactly {Aqla/1221, Nakis/2221, Nusra Dakhila/2211}');
ok(isMujassadBodyConfirmed('1221') && isMujassadBodyConfirmed('2221') && isMujassadBodyConfirmed('2211'),
  'isMujassadBodyConfirmed is true for all three body-confirmed patterns');

// Attributed-only subset (does NOT drive a positive verdict): exactly 3.
ok(MUJASSAD_P95_97_ATTRIBUTED_ONLY_PATTERNS.length === 3, 'exactly three of the six are attributed-chapter-only');
ok(MUJASSAD_P95_97_ATTRIBUTED_ONLY_PATTERNS.includes('1121')
  && MUJASSAD_P95_97_ATTRIBUTED_ONLY_PATTERNS.includes('2111')
  && MUJASSAD_P95_97_ATTRIBUTED_ONLY_PATTERNS.includes('1122'),
  'attributed-only set is exactly {Judla/1121, Ataba Dakhila/2111, Nusra Kharija/1122}');
ok(!isMujassadBodyConfirmed('1121') && !isMujassadBodyConfirmed('2111') && !isMujassadBodyConfirmed('1122'),
  'isMujassadBodyConfirmed is false for all three attributed-only patterns');

// Body-confirmed + attributed-only partition the full 6-figure list exactly.
ok(MUJASSAD_BODY_CONFIRMED_PATTERNS.length + MUJASSAD_P95_97_ATTRIBUTED_ONLY_PATTERNS.length === MUJASSAD_P95_97_PATTERNS.length,
  'body-confirmed and attributed-only subsets partition the full p95-97 list with no overlap and no gap');
for (const p of MUJASSAD_P95_97_PATTERNS) {
  ok(MUJASSAD_BODY_CONFIRMED_PATTERNS.includes(p) !== MUJASSAD_P95_97_ATTRIBUTED_ONLY_PATTERNS.includes(p),
    `pattern ${p} is in exactly one of body-confirmed / attributed-only, never both or neither`);
}

function makeBoardWithH5(pattern, mothers) {
  const board = buildRamlBoardFromMothers(mothers);
  const entries = board.entries || board;
  const h5 = entries.find((e) => Number(e.house || e.houseNumber) === 5);
  ok((h5.pattern || h5.key) === pattern, `sanity: real board lands H5=${pattern} as expected from mothers ${JSON.stringify(mothers)}`);
  return board;
}

// Body-confirmed figures: real boards, each confirmed positive:true.
const BODY_CONFIRMED_BOARDS = {
  '2221': ['2111', '2111', '2111', '1111'],
  '2211': ['2111', '2111', '1111', '1111'],
  '1221': ['1111', '2111', '2111', '1111'],
};

for (const [pattern, mothers] of Object.entries(BODY_CONFIRMED_BOARDS)) {
  const board = makeBoardWithH5(pattern, mothers);
  const result = executeCanonicalCustomMethod('pregnancy.p191.twinsMujassad', board);
  ok(result != null, `body-confirmed case ${pattern}: executor returns a result from a real generated board`);
  ok(result.h5Pattern === pattern, `body-confirmed case ${pattern}: result carries the correct H5 pattern`);
  ok(result.isTwinsSign === true, `body-confirmed case ${pattern}: isTwinsSign is true`);
  ok(result.isAttributedOnly === false, `body-confirmed case ${pattern}: isAttributedOnly is false`);
  ok(result.positive === true, `body-confirmed case ${pattern}: positive is true (traditional twins sign)`);
  ok(result.outputHebrew.includes('תאומים'), `body-confirmed case ${pattern}: Hebrew output mentions twins`);
  ok(result.outputHebrew.includes('לא קביעה רפואית') || result.outputHebrew.includes('מסורתי'),
    `body-confirmed case ${pattern}: Hebrew output frames this as a traditional sign, not medical`);
  ok(result.outputHebrew.includes('גוף-הספר'), `body-confirmed case ${pattern}: Hebrew output cites the body-text confirmation`);
}

// Attributed-only figures: real boards, each must now be positive:null (NOT
// positive:true), with a distinct "attributed-only, no verdict" message --
// this is the exact restriction requested on review.
const ATTRIBUTED_ONLY_BOARDS = {
  '1121': ['1111', '1111', '2111', '1111'],
  '2111': ['2111', '1111', '1111', '1111'],
  '1122': ['1111', '1111', '2111', '2111'],
};

for (const [pattern, mothers] of Object.entries(ATTRIBUTED_ONLY_BOARDS)) {
  const board = makeBoardWithH5(pattern, mothers);
  const result = executeCanonicalCustomMethod('pregnancy.p191.twinsMujassad', board);
  ok(result != null, `attributed-only case ${pattern}: executor returns a result from a real generated board`);
  ok(result.h5Pattern === pattern, `attributed-only case ${pattern}: result carries the correct H5 pattern`);
  ok(result.isTwinsSign === false, `attributed-only case ${pattern}: isTwinsSign is false (not body-confirmed)`);
  ok(result.isAttributedOnly === true, `attributed-only case ${pattern}: isAttributedOnly is true`);
  ok(result.positive === null, `attributed-only case ${pattern}: positive is null (no verdict), never true or false`);
  ok(!result.outputHebrew.includes('תאומים') || result.outputHebrew.includes('אין כאן הכרעה'),
    `attributed-only case ${pattern}: Hebrew output does not assert a twins verdict`);
  ok(result.outputHebrew.includes('ومن غير الكتاب'), `attributed-only case ${pattern}: Hebrew output names the attributed-chapter marker`);
}

// Fully excluded (not on the p95-97 list at all): real board, H5=1111
// (Tariq) -- must be positive:null, NOT positive:false, and NOT flagged
// isAttributedOnly.
{
  const board = makeBoardWithH5('1111', ['1111', '1111', '1111', '1111']);
  const result = executeCanonicalCustomMethod('pregnancy.p191.twinsMujassad', board);
  ok(result.h5Pattern === '1111', 'excluded case: result carries H5=1111 (Tariq)');
  ok(result.isTwinsSign === false, 'excluded case: isTwinsSign is false');
  ok(result.isAttributedOnly === false, 'excluded case: isAttributedOnly is false (not even on the attributed list)');
  ok(result.positive === null, 'excluded case: positive is null (no verdict), never false');
  ok(result.outputHebrew.includes('היעדר הסימן אינו הוכחה שאין תאומים'), 'excluded case: Hebrew output explicitly states absence is not proof against twins');
}

// Missing/incomplete board data: must not guess.
{
  const result = executeCanonicalCustomMethod('pregnancy.p191.twinsMujassad', { entries: [] });
  ok(result === null, 'missing board data returns null rather than guessing');
}

// Independence from the unrelated mujassad-dakhil/kharij (fixed/mutable)
// classifier: of the six true مجسد patterns (full attributed list), only
// 1121 and 1221 also satisfy fire=earth (the OTHER code concept) -- the
// remaining four must still register as true مجسد despite NOT being
// fire=earth. (Note: 1121 is attributed-only and 1221 is body-confirmed --
// the fire=earth overlap cuts across both subsets, confirming it is an
// unrelated axis.)
{
  const fireEqualsEarth = (p) => p[0] === p[3];
  const overlap = MUJASSAD_P95_97_PATTERNS.filter(fireEqualsEarth);
  const nonOverlap = MUJASSAD_P95_97_PATTERNS.filter((p) => !fireEqualsEarth(p));
  ok(overlap.length === 2 && overlap.includes('1121') && overlap.includes('1221'),
    'exactly 2 of the 6 true مجسد patterns coincide with fire=earth (1121, 1221)');
  ok(nonOverlap.length === 4
    && nonOverlap.includes('2221') && nonOverlap.includes('2111')
    && nonOverlap.includes('1122') && nonOverlap.includes('2211'),
    'the other 4 true مجسد patterns (2221,2111,1122,2211) do NOT satisfy fire=earth, confirming this is a distinct classification');
}

console.log(`Kashf p191 twins-مجسد golden tests: ${assertions} assertions passed`);
