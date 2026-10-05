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
 * Which figures are "مجسد" is resolved from printed pp95-97 (PDF 97-99),
 * "ومن غير الكتاب: فصل في طبائع الأشكال على التقريب" -- an attributed
 * chapter walking all 16 figures by name, using the word مجسد for exactly
 * six: أنكيس (2221), جودلة (1121), العتبة الداخلة (2111), نصرة خارجة
 * (1122), نصرة داخلة (2211), العقلة (1221). Independently cross-confirmed
 * against this source's own scattered individual figure descriptions
 * elsewhere (kashf-al-asrar-book.js: the same six patterns are separately
 * called "מגושם/מגושמת" there).
 *
 * This is NOT the same set as the canonical classifier's mujassad-dakhil/
 * mujassad-kharij code labels (an internal name for the unrelated,
 * independently-confirmed eight-figure "fixed"/"mutable" class; overlap is
 * only 2 of 6 figures: 1121, 1221).
 *
 * Computation action: read H5's pattern off the real generated board; if it
 * is one of the six p95-97 مجسد patterns, assert a traditional twins sign
 * (positive:true). The source states no inverse rule, so a non-matching H5
 * figure must return positive:null (no verdict), never positive:false --
 * absence of the sign is not evidence against twins.
 *
 * All boards below were found by brute-force search over real mother
 * combinations (via buildRamlBoardFromMothers), not by hand-picking H5 to
 * match the executor's own if-statement.
 */

import assert from 'node:assert/strict';

import { getKashfMethod, validateKashfMethodRegistry } from './goral-hachol/registry/kashf-canonical-method-registry.js';
import { hasCanonicalCustomExecutor, executeCanonicalCustomMethod } from './goral-hachol/engine/kashf-canonical-executors.js';
import { MUJASSAD_P95_97_PATTERNS, isMujassadP95_97 } from './goral-hachol/engine/kashf-figure-classifier.js';
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
ok(hasCanonicalCustomExecutor('pregnancy.p191.twinsMujassad'), 'executor is reachable via the canonical custom-executor dispatch');

ok(MUJASSAD_P95_97_PATTERNS.length === 6, 'exactly six figures are named مجسد on p95-97');
ok(isMujassadP95_97('2221') && isMujassadP95_97('1121') && isMujassadP95_97('2111')
  && isMujassadP95_97('1122') && isMujassadP95_97('2211') && isMujassadP95_97('1221'),
  'all six confirmed مجسد patterns are recognized');
ok(!isMujassadP95_97('1111') && !isMujassadP95_97('2222') && !isMujassadP95_97('2112'),
  'patterns outside the six-figure list are not treated as مجسد (Tariq/Jamaa/Ijtima excluded)');

function makeBoardWithH5(pattern, mothers) {
  const board = buildRamlBoardFromMothers(mothers);
  const entries = board.entries || board;
  const h5 = entries.find((e) => Number(e.house || e.houseNumber) === 5);
  ok((h5.pattern || h5.key) === pattern, `sanity: real board lands H5=${pattern} as expected from mothers ${JSON.stringify(mothers)}`);
  return board;
}

// All six positive (مجسد-included) figures: real boards, each confirmed positive:true.
const INCLUDED = {
  '2221': ['2111', '2111', '2111', '1111'],
  '1121': ['1111', '1111', '2111', '1111'],
  '2111': ['2111', '1111', '1111', '1111'],
  '1122': ['1111', '1111', '2111', '2111'],
  '2211': ['2111', '2111', '1111', '1111'],
  '1221': ['1111', '2111', '2111', '1111'],
};

for (const [pattern, mothers] of Object.entries(INCLUDED)) {
  const board = makeBoardWithH5(pattern, mothers);
  const result = executeCanonicalCustomMethod('pregnancy.p191.twinsMujassad', board);
  ok(result != null, `included case ${pattern}: executor returns a result from a real generated board`);
  ok(result.h5Pattern === pattern, `included case ${pattern}: result carries the correct H5 pattern`);
  ok(result.isTwinsSign === true, `included case ${pattern}: isTwinsSign is true`);
  ok(result.positive === true, `included case ${pattern}: positive is true (traditional twins sign)`);
  ok(result.outputHebrew.includes('תאומים'), `included case ${pattern}: Hebrew output mentions twins`);
  ok(result.outputHebrew.includes('לא קביעה רפואית') || result.outputHebrew.includes('מסורתי'),
    `included case ${pattern}: Hebrew output frames this as a traditional sign, not medical`);
}

// One excluded (non-مجسد) figure: real board, H5=1111 (Tariq) -- must be
// positive:null, NOT positive:false. Absence of the sign proves nothing.
{
  const board = makeBoardWithH5('1111', ['1111', '1111', '1111', '1111']);
  const result = executeCanonicalCustomMethod('pregnancy.p191.twinsMujassad', board);
  ok(result.h5Pattern === '1111', 'excluded case: result carries H5=1111 (Tariq)');
  ok(result.isTwinsSign === false, 'excluded case: isTwinsSign is false');
  ok(result.positive === null, 'excluded case: positive is null (no verdict), never false');
  ok(result.outputHebrew.includes('היעדר הסימן אינו הוכחה שאין תאומים'), 'excluded case: Hebrew output explicitly states absence is not proof against twins');
}

// Missing/incomplete board data: must not guess.
{
  const result = executeCanonicalCustomMethod('pregnancy.p191.twinsMujassad', { entries: [] });
  ok(result === null, 'missing board data returns null rather than guessing');
}

// Independence from the unrelated mujassad-dakhil/kharij (fixed/mutable)
// classifier: of the six true مجسد patterns, only 1121 and 1221 also
// satisfy fire=earth (the OTHER code concept) -- the remaining four must
// still register as true مجسد despite NOT being fire=earth.
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
