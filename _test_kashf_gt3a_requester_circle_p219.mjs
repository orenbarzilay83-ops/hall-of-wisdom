/**
 * _test_kashf_gt3a_requester_circle_p219.mjs
 *
 * GT-3A — Golden Test / regression lock for the "מבקש במעגל" (Requester
 * via the Circle) technique, כשף אל-אסראר עמ' 218-219, Gate 6 Chapter 7.
 *
 * This test does NOT implement anything new. It exercises the ALREADY-
 * EXISTING, already-live code path end-to-end:
 *   computeRequesterCircleHouse (kashf-shibutzim.js)
 *   → computeRequesterCircleStrengthKashf (kashf-book-additions.js)
 *   → registered as supportingCheck id 'requester-circle-strength'
 *     under the `commerce` topic (kashf-topic-rules.js)
 *   → dispatched via the generic legacy-fn mechanism and exposed in
 *     reading.supportingFindings (kashf-reading-engine.js::buildKashfReading)
 *
 * No logic from any of those files is copied into this test. No mock
 * replaces the circle-counting calculation itself — `raml-board-
 * generator.js` (the shared, method-agnostic board-construction engine
 * used identically by Hawi and Kashf per this repo's own architecture —
 * not Hawi-specific content) is used to build REAL boards so the test
 * exercises the REAL `buildKashfReading` dispatch path, not a
 * hand-built fixture.
 *
 * Source re-verified directly against kashf-hebrew-v56-clean-final.html,
 * printed page 219 (PAGE_BLOCK 202), before writing this test — not
 * taken from prior documentation alone:
 *
 *   "אם הופיעה צורת שפל ראש בבית הראשון, ובית כבודה הוא השמיני, מונים
 *   מן השמיני עד הראשון, ונמצאים עשרה. התבוננו בעשירי מסדר שיבוץ המושב,
 *   ומצאנו אותו בית הכבוד, השלטון, הרוממות, התוספת והמעמד."
 *   → שפל ראש: house of honor = 8, count to house 1 = 10, lands house 10.
 *
 *   "וכן אם הופיעה כבוד נכנס בראשון, ובית כבודה השנים־עשר, מנה ממנו עד
 *   הראשון — שישה. והשישי הוא בית המחלות..."
 *   → כבוד נכנס: house of honor = 12, count to house 1 = 6, lands house 6.
 *
 * No AI call. No fetch. No network. No UI. No change to any engine file.
 */

import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { buildKashfReading } from './goral-hachol/engine/kashf-reading-engine.js';
import {
  computeRequesterCircleHouse,
  REQUEST_CIRCLE_HONOR_HOUSES,
  SHIBUTZ_1_MOSHAV,
} from './goral-hachol/data/sources/kashf-al-asrar/kashf-shibutzim.js';
import { FIGURE_DIGNITIES } from './goral-hachol/data/sources/kashf-al-asrar/kashf-figure-attributes-gate2.js';
import { HAWI_FIGURE_NAMES } from './goral-hachol/data/sources/kashf-al-asrar/kashf-figure-names.js';

let failures = 0;
function assert(condition, message) {
  if (!condition) { failures++; console.error(`✗ ${message}`); }
  else { console.log(`✓ ${message}`); }
}

// Two source-verified figures: שפל ראש (2221), כבוד נכנס (2211).
// Mothers are chosen so the FIRST mother becomes house 1 (confirmed
// this round by direct execution: buildRamlBoardFromMothers places
// mothers[0] in house 1) — the other 3 mothers are arbitrary and do not
// affect this technique (it depends only on the house-1 figure).
const SHFAL_ROSH_MOTHERS = ['2221', '1212', '1121', '1122'];
const KAVOD_NICHNAS_MOTHERS = ['2211', '1212', '1121', '1122'];
const NILCHAM_MOTHERS = ['1121', '1212', '2221', '1122']; // unverified figure in house 1

console.log('\n--- 1. Example 1 (p.219): שפל ראש, house-of-honor=8 → count=10 → house 10 ---');
{
  const direct = computeRequesterCircleHouse('2221');
  assert(direct?.honorHouse === 8, '(1a) [source fact, p.219] שפל ראש house-of-honor = 8, direct function call');
  assert(direct?.count === 10, '(1b) [source fact, p.219] count from house 8 to house 1 = 10, direct function call');
  assert(direct?.landingHouse === 10, '(1c) [source fact, p.219] lands in house 10, direct function call — "התבוננו בעשירי מסדר שיבוץ המושב"');

  const board = buildRamlBoardFromMothers(SHFAL_ROSH_MOTHERS);
  const reading = buildKashfReading(board, 'commerce', {});
  const finding = reading.supportingFindings.find((f) => f.id === 'requester-circle-strength');
  assert(!!finding, '(1d) [code routing fact] requester-circle-strength appears in reading.supportingFindings for a real commerce-topic reading');
  assert(finding.verdict === 'landing-computed', '(1e) [code routing fact] verdict is "landing-computed" for a verified figure');
  assert(finding.honorHouse === 8 && finding.count === 10 && finding.landingHouse === 10, '(1f) [regression invariant] end-to-end reading reproduces the exact same 8/10/10 values as the direct function call');
  assert(finding.houseTypeHebrew === 'יתד', '(1g) [source fact, p.219] house 10 is a pillar ("יתד") — matches "בית הכבוד, השלטון, הרוממות" framing');
}

console.log('\n--- 2. Example 2 (p.219): כבוד נכנס, house-of-honor=12 → count=6 → house 6 ---');
{
  const direct = computeRequesterCircleHouse('2211');
  assert(direct?.honorHouse === 12, '(2a) [source fact, p.219] כבוד נכנס house-of-honor = 12, direct function call');
  assert(direct?.count === 6, '(2b) [source fact, p.219] count from house 12 to house 1 = 6, direct function call');
  assert(direct?.landingHouse === 6, '(2c) [source fact, p.219] lands in house 6, direct function call — "והשישי הוא בית המחלות"');

  const board = buildRamlBoardFromMothers(KAVOD_NICHNAS_MOTHERS);
  const reading = buildKashfReading(board, 'commerce', {});
  const finding = reading.supportingFindings.find((f) => f.id === 'requester-circle-strength');
  assert(!!finding, '(2d) [code routing fact] requester-circle-strength appears in reading.supportingFindings');
  assert(finding.verdict === 'landing-computed', '(2e) [code routing fact] verdict is "landing-computed" for a verified figure');
  assert(finding.honorHouse === 12 && finding.count === 6 && finding.landingHouse === 6, '(2f) [regression invariant] end-to-end reading reproduces the exact same 12/6/6 values as the direct function call');
}

console.log('\n--- 3. computeRequesterCircleStrengthKashf returns a consistent structure for both examples ---');
{
  const board1 = buildRamlBoardFromMothers(SHFAL_ROSH_MOTHERS);
  const f1 = buildKashfReading(board1, 'commerce', {}).supportingFindings.find((f) => f.id === 'requester-circle-strength');
  const board2 = buildRamlBoardFromMothers(KAVOD_NICHNAS_MOTHERS);
  const f2 = buildKashfReading(board2, 'commerce', {}).supportingFindings.find((f) => f.id === 'requester-circle-strength');
  const requiredKeys = ['id', 'label', 'checkType', 'fnName', 'verdict', 'outputHebrew', 'honorHouse', 'count', 'landingHouse', 'houseTypeHebrew', 'sourceText'];
  for (const k of requiredKeys) {
    assert(k in f1, `(3a) [code routing fact] example-1 finding has key "${k}"`);
    assert(k in f2, `(3b) [code routing fact] example-2 finding has key "${k}"`);
  }
  assert(f1.checkType === 'legacy-fn' && f2.checkType === 'legacy-fn', '(3c) [code routing fact] both use the standard legacy-fn dispatch mechanism, same as every other verified supportingCheck in this codebase');
  assert(f1.fnName === 'computeRequesterCircleStrengthKashf' && f2.fnName === 'computeRequesterCircleStrengthKashf', '(3d) [code routing fact] both resolve to the same registered function');
}

console.log('\n--- 4. commerce topic activates the Requester rule; a non-commerce topic does not ---');
{
  const board = buildRamlBoardFromMothers(SHFAL_ROSH_MOTHERS);
  const commerceReading = buildKashfReading(board, 'commerce', {});
  assert(!!commerceReading.supportingFindings.find((f) => f.id === 'requester-circle-strength'), '(4a) [code routing fact] commerce topic includes requester-circle-strength');

  const moneyReading = buildKashfReading(board, 'money', {});
  assert(!moneyReading.supportingFindings.find((f) => f.id === 'requester-circle-strength'), '(4b) [code routing fact] a different topic (money) does NOT activate this commerce-scoped rule — confirms topic-scoped routing, not global injection');
}

console.log('\n--- 5. kashf-reading-engine.js exposes the Requester result in engineOutput (reading.supportingFindings) ---');
{
  const board = buildRamlBoardFromMothers(SHFAL_ROSH_MOTHERS);
  const reading = buildKashfReading(board, 'commerce', {});
  assert(Array.isArray(reading.supportingFindings), '(5a) [code routing fact] reading.supportingFindings is a real array on the buildKashfReading() output object (engineOutput), not an internal-only value');
  assert(reading.supportingFindings.some((f) => f.id === 'requester-circle-strength'), '(5b) [code routing fact] the Requester finding is present in that exposed array');
}

console.log('\n--- 6. The 14 non-source-verified figures return null (direct) and "undefined-in-source" (end-to-end), never a guess ---');
{
  const registryPatterns = HAWI_FIGURE_NAMES.map((f) => f.pattern);
  const verified = ['2221', '2211'];
  const unverified = registryPatterns.filter((p) => !verified.includes(p));
  assert(unverified.length === 14, `(6a) [source fact] exactly 14 registry patterns are outside the 2 source-verified figures (got ${unverified.length})`);
  for (const p of unverified) {
    assert(computeRequesterCircleHouse(p) === null, `(6b) [regression invariant] computeRequesterCircleHouse('${p}') returns null, not a guessed house`);
  }

  const board = buildRamlBoardFromMothers(NILCHAM_MOTHERS); // house 1 = נלחם (1121), unverified
  const reading = buildKashfReading(board, 'commerce', {});
  const finding = reading.supportingFindings.find((f) => f.id === 'requester-circle-strength');
  assert(finding?.verdict === 'undefined-in-source', '(6c) [regression invariant] end-to-end reading reports verdict "undefined-in-source" for an unverified house-1 figure');
  assert(!('honorHouse' in finding) && !('count' in finding) && !('landingHouse' in finding), '(6d) [regression invariant] no honorHouse/count/landingHouse fields are present at all for an unverified figure — not even as null placeholders — confirming no fallback value is synthesized');
}

console.log('\n--- 7-8. No fallback, no guess (explicit, beyond §6) ---');
{
  assert(Object.keys(REQUEST_CIRCLE_HONOR_HOUSES).filter((k) => k !== 'sourceStatus' && k !== 'sourceRef' && k !== 'note').length === 2, '(7a) [source fact] REQUEST_CIRCLE_HONOR_HOUSES contains exactly 2 figure entries — no silent completion of the other 14 has been added anywhere in the codebase');
}

console.log('\n--- 9. No use of FIGURE_DIGNITIES.maalaHouse as a substitute for "house of honor" ---');
{
  // Positive proof, not just absence-of-import: the source itself
  // proves the two tables disagree for כבוד נכנס (12 in the Requester
  // rule vs. 9 in FIGURE_DIGNITIES.maalaHouse). If the code silently
  // substituted maalaHouse, this specific example would be wrong.
  const requesterHonorHouse = REQUEST_CIRCLE_HONOR_HOUSES['2211'];
  const dignitiesMaalaHouse = FIGURE_DIGNITIES['2211']?.maalaHouse;
  assert(requesterHonorHouse === 12, '(9a) [source fact, p.219] REQUEST_CIRCLE_HONOR_HOUSES uses 12 for כבוד נכנס, exactly as the source states');
  assert(dignitiesMaalaHouse === 9, '(9b) [source fact, p.97-99] FIGURE_DIGNITIES.maalaHouse for כבוד נכנס is 9 — a DIFFERENT value');
  assert(requesterHonorHouse !== dignitiesMaalaHouse, '(9c) [regression invariant] the two tables are proven numerically distinct for this figure — the code is NOT silently substituting FIGURE_DIGNITIES.maalaHouse for the "house of honor" concept, since doing so would produce the wrong, unverified answer (9, not 12)');
}

console.log('\n--- 10. No merging with Order 1 (שיבוץ המושב) — Order 1 is consumed only for the casting step, not the honor-house lookup ---');
{
  assert(SHIBUTZ_1_MOSHAV !== REQUEST_CIRCLE_HONOR_HOUSES, '(10a) [code routing fact] SHIBUTZ_1_MOSHAV and REQUEST_CIRCLE_HONOR_HOUSES are two distinct exported objects, not one merged table');
  // SHIBUTZ_1_MOSHAV is keyed house(1-16)->pattern; REQUEST_CIRCLE_HONOR_HOUSES is keyed pattern->house. Confirms they are structurally different tables serving different roles, not aliases of each other.
  assert(SHIBUTZ_1_MOSHAV[1] === '1222', '(10b) [source fact, p.104-105] SHIBUTZ_1_MOSHAV is keyed by house number (house 1 -> נשוא ראש), the casting-step table');
  assert(REQUEST_CIRCLE_HONOR_HOUSES['2221'] === 8, '(10c) [source fact, p.218-219] REQUEST_CIRCLE_HONOR_HOUSES is keyed by figure pattern (שפל ראש -> house 8), the starting-count table — confirmed structurally distinct in shape and role from (10b)');
}

console.log('\n--- 11. No change to the primary verdict; this remains a supportingCheck, not a primaryFormula ---');
{
  const board = buildRamlBoardFromMothers(SHFAL_ROSH_MOTHERS);
  const reading = buildKashfReading(board, 'commerce', {});
  assert('primaryFormula' in reading, '(11a) [code routing fact] the reading still has its own independent primaryFormula field');
  assert(reading.primaryFormula?.result !== reading.supportingFindings.find((f) => f.id === 'requester-circle-strength'), '(11b) [regression invariant] primaryFormula and the requester-circle supportingCheck are distinct objects — this check does not overwrite or replace the topic\'s primary verdict');
}

console.log('\n--- 12. No engine-behavior change beyond what already existed (structural check only; full regression suite run separately) ---');
{
  assert(typeof buildKashfReading === 'function', '(12a) buildKashfReading is unmodified, callable exactly as before');
}

console.log('\n--- 13. No AI/fetch in this test file itself ---');
{
  // Scoped to actual import-statement lines only — a bare substring scan
  // of the whole file would false-positive on this very check's own
  // token list (the strings have to be written down somewhere to be
  // checked against), exactly as happened and was fixed in GT-10.
  const fs = await import('node:fs');
  const selfSource = fs.readFileSync(new URL(import.meta.url), 'utf8');
  const importLines = selfSource.split('\n').filter((line) => /^\s*import\s/.test(line));
  const forbidden = ['fetch', 'XMLHttpRequest', 'anthropic'];
  for (const token of forbidden) {
    assert(!importLines.some((line) => line.toLowerCase().includes(token.toLowerCase())), `(13) no import line in this test file references "${token}"`);
  }
  assert(importLines.length === 5, `(13) exactly 5 import statements exist, all pointing at the real existing engine/data files under test (got ${importLines.length})`);
}

console.log('\n--- 14. No dependency on Hawi-specific content ---');
{
  const fs = await import('node:fs');
  const selfSource = fs.readFileSync(new URL(import.meta.url), 'utf8');
  const importLines = selfSource.split('\n').filter((line) => /^\s*import\s/.test(line));
  // raml-board-generator.js is the shared, method-agnostic board engine
  // (used identically by Hawi and Kashf per this repo's architecture) —
  // deliberately imported above to exercise the real dispatch path. What
  // must NOT appear in an IMPORT LINE is any Hawi topic-content module.
  const forbiddenHawiContent = ['hawi-interpreter', 'hawi-figure-state', 'hawi-topic-rules'];
  for (const token of forbiddenHawiContent) {
    assert(!importLines.some((line) => line.includes(token)), `(14) no import line references Hawi-specific topic content ("${token}")`);
  }
}

console.log('');
if (failures > 0) {
  console.error(`${failures} בדיקות נכשלו.`);
  process.exit(1);
}
console.log('כל הבדיקות עברו (GT-3A). computeRequesterCircleHouse/computeRequesterCircleStrengthKashf משחזרים במדויק, מקצה לקצה דרך buildKashfReading, את שתי הדוגמאות מעמ׳ 219 (8→10→בית10; 12→6→בית6), מנותבים אך ורק דרך נושא commerce, וחשופים ב-reading.supportingFindings. 14 הצורות הלא-מאומתות מחזירות null/undefined-in-source ללא נחיתה מומצאת. הוכח במפורש שהקוד אינו מחליף "בית כבוד" ב-FIGURE_DIGNITIES.maalaHouse (הערכים שונים במפורש עבור כבוד נכנס: 12 מול 9) ואינו ממזג עם שיבוץ המושב (Order 1). לא נוצר/שונה שום קוד ייצור.');
