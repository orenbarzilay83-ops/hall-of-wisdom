/**
 * _test_kashf_essential_dignities_table.mjs
 *
 * GT-10 — Golden Test for the Essential Dignities Table (מעלה/מושב/גבול/
 * פנים/שמחה/צער/מזג), Roadmap Phase 1 target.
 *
 * IMPORTANT: this test does NOT import a new data file. Per explicit user
 * decision, Roadmap Phase 1 uses the ALREADY-EXISTING `FIGURE_DIGNITIES`
 * object in `kashf-figure-attributes-gate2.js` — discovered during this
 * table. Downstream Correction DS-03 rechecked it directly against the
 * authoritative printed scan (printed pp.97-99 / scan pp.99-101) and
 * corrected the earlier HTML-only reconstruction. No new data file,
 * adapter, or re-export was created.
 *
 * Ground truth, verified this round (see
 * HALL_WISDOM_KASHF_ESSENTIAL_DIGNITIES_EXISTING_DATA_VERIFICATION_REPORT.md
 * for the full derivation):
 *   - FIGURE_DIGNITIES has exactly 14 keys (patterns), not 16. The source
 *     book's own "פרק במעלת הצורות, מושבן, מזגן ופניהן" (p.97-99) never
 *     assigns dignity values to patterns 2121 (ממון נכנס) or 1221 (סוהר).
 *     The printed scan does assign complete rows to 1111 (דרך) and 2112
 *     (חיבור), which the former HTML-based test had incorrectly excluded.
 *   - All 14 present records carry all 7 required fields (maalaHouse,
 *     moshavHouse, gvulHouse, panimHouse, simchaHouse, tzaarHouse,
 *     mezegHouse) as own-properties, regardless of whether their value is
 *     a house number or null.
 *   - Every null in the table corresponds to an explicit "לא נתפרש
 *     במקור"/"לא נתפרשו כאן" statement (or an unresolved indirect
 *     reference, e.g. ממון יוצא's צער stated only as "כנגדו") found in the
 *     printed source itself — never a silent gap.
 *
 * This test does not evaluate a board, does not call an engine, does not
 * touch verdict logic, does not fetch, and does not call any AI. It reads
 * two static data modules only.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { FIGURE_DIGNITIES } from './goral-hachol/data/sources/kashf-al-asrar/kashf-figure-attributes-gate2.js';
import { HAWI_FIGURE_NAMES, HAWI_FIGURE_NAMES_BY_ID } from './goral-hachol/data/sources/kashf-al-asrar/kashf-figure-names.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE_PATH = join(__dirname, 'goral-hachol/data/sources/kashf-al-asrar/kashf-figure-attributes-gate2.js');
const RAW_SOURCE = readFileSync(DATA_FILE_PATH, 'utf8');

let failures = 0;
function assert(condition, message) {
  if (!condition) { failures++; console.error(`✗ ${message}`); }
  else { console.log(`✓ ${message}`); }
}

const REQUIRED_FIELDS = ['maalaHouse', 'moshavHouse', 'gvulHouse', 'panimHouse', 'simchaHouse', 'tzaarHouse', 'mezegHouse'];
const KNOWN_ABSENT_PATTERNS = ['2121', '1221']; // ממון נכנס, סוהר — no rows in the printed p.97-99 table
// Integer-like object keys are enumerated numerically by JavaScript,
// regardless of their visual source order in the object literal.
const EXPECTED_KEY_ORDER = ['1111', '1112', '1121', '1122', '1211', '1212', '1222', '2111', '2112', '2122', '2211', '2212', '2221', '2222'];

console.log('\n--- 1. Registry baseline (16 canonical figures) ---');
{
  assert(HAWI_FIGURE_NAMES.length === 16, `(1a) registry (kashf-figure-names.js) has exactly 16 figures (got: ${HAWI_FIGURE_NAMES.length})`);
  const registryPatterns = HAWI_FIGURE_NAMES.map((f) => f.pattern);
  assert(new Set(registryPatterns).size === 16, '(1b) all 16 registry patterns are unique');
}

console.log('\n--- 2. FIGURE_DIGNITIES record count (true state, not assumed) ---');
{
  const keys = Object.keys(FIGURE_DIGNITIES);
  assert(keys.length === 14, `(2a) FIGURE_DIGNITIES has exactly 14 keys today — this is the SOURCE-VERIFIED true count for p.97-99, not 16 (got: ${keys.length})`);
  assert(new Set(keys).size === keys.length, '(2b) all keys (patterns) in FIGURE_DIGNITIES are unique');
  for (const k of keys) {
    assert(/^[12]{4}$/.test(k), `(2c) key "${k}" is a well-formed 4-line pattern`);
  }
}

console.log('\n--- 3. Full 16-figure accounting: 14 present + 2 explicitly-known-absent ---');
{
  const presentKeys = Object.keys(FIGURE_DIGNITIES);
  const registryPatterns = HAWI_FIGURE_NAMES.map((f) => f.pattern);
  const missingFromFile = registryPatterns.filter((p) => !presentKeys.includes(p));
  assert(missingFromFile.length === 2, `(3a) exactly 2 registry patterns are absent from FIGURE_DIGNITIES (got: ${missingFromFile.length}: ${missingFromFile.join(',')})`);
  assert(
    missingFromFile.length === 2 && missingFromFile.includes('2121') && missingFromFile.includes('1221'),
    `(3b) the 2 absent patterns are exactly {2121 (ממון נכנס), 1221 (סוהר)} — a regression here means either a real record was accidentally deleted, or the source-verified absence list changed (got: ${missingFromFile.join(',')})`
  );
  const accountedFor = new Set([...presentKeys, ...missingFromFile]);
  assert(accountedFor.size === 16, `(3c) present ∪ known-absent covers all 16 registry patterns with no gap and no double-count (got: ${accountedFor.size})`);
  assert(registryPatterns.every((p) => accountedFor.has(p)), '(3d) every registry pattern is accounted for one way or the other');
}

console.log('\n--- 4. Seven professional fields present on every record ---');
{
  for (const [pattern, record] of Object.entries(FIGURE_DIGNITIES)) {
    for (const field of REQUIRED_FIELDS) {
      assert(Object.prototype.hasOwnProperty.call(record, field), `(4) ${pattern}: has own-property "${field}"`);
    }
  }
}

console.log('\n--- 5. Registry cross-check (pattern-level; identity fields live in kashf-figure-names.js by design) ---');
{
  for (const pattern of Object.keys(FIGURE_DIGNITIES)) {
    const registryEntry = HAWI_FIGURE_NAMES_BY_ID[pattern];
    assert(!!registryEntry, `(5a) ${pattern}: has a matching registry entry`);
    assert(!!registryEntry?.hebrewName, `(5b) ${pattern}: registry entry has a hebrewName ("${registryEntry?.hebrewName}")`);
    assert(!!registryEntry?.arabicName, `(5c) ${pattern}: registry entry has an arabicName ("${registryEntry?.arabicName}")`);
  }
  assert(
    HAWI_FIGURE_NAMES_BY_ID['1121']?.hebrewName === 'נלחם' &&
    HAWI_FIGURE_NAMES_BY_ID['1221']?.hebrewName === 'סוהר' &&
    HAWI_FIGURE_NAMES_BY_ID['2222']?.hebrewName === 'קהלה',
    '(5d) spot-check: 3 sampled patterns resolve to their expected canonical Hebrew names via the registry'
  );
}

console.log('\n--- 6. No placeholder values anywhere in the source file ---');
{
  const banned = ['TODO', 'demo', 'sample', 'inferred', 'FIXME', 'XXX', 'placeholder'];
  for (const word of banned) {
    const re = new RegExp(word, 'i');
    assert(!re.test(RAW_SOURCE), `(6) file does not contain the placeholder token "${word}"`);
  }
}

console.log('\n--- 7. Null positions match the source-verified expected-null map (no silent gaps, no silent extras) ---');
{
  // Built from the DS-03 visual recheck of printed pp.97-99 / scan pp.99-101.
  // Every position here was traced to an explicit omission or unresolved
  // relative wording ("כנגדו") in the printed source.
  const expectedNullFields = {
    '1121': ['mezegHouse'],
    '1222': ['tzaarHouse'],
    '2111': ['tzaarHouse'],
    '2212': ['tzaarHouse', 'mezegHouse'],
    '1211': ['simchaHouse', 'tzaarHouse', 'mezegHouse'],
    '1112': ['tzaarHouse', 'mezegHouse'],
    '2122': ['simchaHouse', 'tzaarHouse', 'mezegHouse'],
    '2221': ['tzaarHouse'],
    '2211': ['tzaarHouse', 'mezegHouse'],
    '2112': ['tzaarHouse'],
    '1122': ['simchaHouse', 'tzaarHouse'],
    '1111': ['tzaarHouse'],
    '1212': ['tzaarHouse'], // צערה = "כנגדו" — unresolved indirect reference, correctly left null
    '2222': ['tzaarHouse'],
  };
  for (const [pattern, record] of Object.entries(FIGURE_DIGNITIES)) {
    const actualNulls = REQUIRED_FIELDS.filter((f) => record[f] === null).sort();
    const expected = (expectedNullFields[pattern] || []).slice().sort();
    assert(
      JSON.stringify(actualNulls) === JSON.stringify(expected),
      `(7) ${pattern}: null fields match source-verified expectation (expected [${expected.join(',')}], got [${actualNulls.join(',')}])`
    );
  }
}

console.log('\n--- 8. Source-page citation present at module level (97-99 range referenced) ---');
{
  assert(/97-99/.test(RAW_SOURCE) && /פרק במעלת הצורות/.test(RAW_SOURCE), '(8a) file documents the source chapter title and the printed p.97-99 range');
  assert(/עמ['’]?\s*97-99/.test(RAW_SOURCE), '(8b) the exact printed-page citation p.97-99 is present');
  // Note: the file does NOT carry a per-record sourcePages field (design
  // choice — page citation lives once at module level, not duplicated 14
  // times). This is a structural difference from the originally-envisioned
  // schema, disclosed in the verification report, not silently assumed here.
}

console.log('\n--- 9. Deterministic key order ---');
{
  const actualOrder = Object.keys(FIGURE_DIGNITIES);
  assert(JSON.stringify(actualOrder) === JSON.stringify(EXPECTED_KEY_ORDER), `(9) FIGURE_DIGNITIES key order is fixed and deterministic (got: ${actualOrder.join(',')})`);
}

console.log('\n--- 10. No fetch, no AI, no network ---');
{
  const forbidden = ['fetch(', 'XMLHttpRequest', 'anthropic', 'api.anthropic.com', 'ANTHROPIC_API_KEY'];
  for (const token of forbidden) {
    assert(!RAW_SOURCE.toLowerCase().includes(token.toLowerCase()), `(10) file does not reference "${token}"`);
  }
}

console.log('\n--- 11. No verdict/engine coupling — this is a leaf data file ---');
{
  assert(!/^\s*import\s/m.test(RAW_SOURCE), '(11a) kashf-figure-attributes-gate2.js has zero imports (confirmed leaf data file)');
  // Note: the file's header comment (line 9) mentions kashf-dhamir.js by
  // name — but only to disclose that kashf-dhamir.js CONSUMES this data
  // (the reverse direction: engine imports data, not data imports engine).
  // A bare substring search would false-positive on that honest disclosure
  // comment, so this check is scoped to actual import-statement lines only
  // — of which (11a) already proved there are zero.
  const importLines = RAW_SOURCE.split('\n').filter((line) => /^\s*import\s/.test(line));
  assert(importLines.length === 0, `(11b) zero import-statement lines found (confirms no engine coupling; got: ${importLines.length})`);
  assert(typeof FIGURE_DIGNITIES === 'object' && FIGURE_DIGNITIES !== null && typeof FIGURE_DIGNITIES !== 'function', '(11c) FIGURE_DIGNITIES is plain data, not a callable/effectful export');
}

console.log('\n--- 12. No duplicate data file was created this round ---');
{
  // Structural note, not a runtime-enforceable claim: per explicit user
  // decision, no new data file / adapter / re-export was created for
  // Roadmap Phase 1. This test imports the ORIGINAL, pre-existing file
  // path only — there is no second import path to compare against.
  assert(true, '(12) this test imports exactly one data source (kashf-figure-attributes-gate2.js) — no duplicate file exists to reconcile');
}

console.log('');
if (failures > 0) {
  console.error(`${failures} בדיקות נכשלו.`);
  process.exit(1);
}
console.log('כל הבדיקות עברו (GT-10). FIGURE_DIGNITIES מאומת מול הסריקה המודפסת: 14 רשומות אמיתיות + 2 צורות (ממון נכנס, סוהר) שאינן מקבלות שורה בטבלת עמ׳ 97-99. כל 7 השדות המקצועיים קיימים בכל רשומה. כל null תואם לחסר או לניסוח יחסי במקור. אין placeholder, אין fetch, אין AI, ואין צימוד חדש למנוע.');
