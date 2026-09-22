/**
 * _test_kashf_essential_dignities_table.mjs
 *
 * GT-10 — printed-source regression for the Essential Dignities table.
 *
 * Ground truth:
 *   printed KASHF pp97-99 / scan pp99-101
 *   Master Index entry: figures.p97-99.dignities-source-table
 *
 * This supersedes the older v56-derived verification assumption. The printed
 * table has 14 rows: ממון נכנס (2121) and סוהר (1221) are omitted; חיבור
 * (2112) and דרך (1111) are explicitly present.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  FIGURE_DIGNITIES,
  FIGURE_DIGNITIES_METADATA,
} from './goral-hachol/data/sources/kashf-al-asrar/kashf-figure-attributes-gate2.js';
import {
  HAWI_FIGURE_NAMES,
  HAWI_FIGURE_NAMES_BY_ID,
} from './goral-hachol/data/sources/kashf-al-asrar/kashf-figure-names.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE_PATH = join(__dirname, 'goral-hachol/data/sources/kashf-al-asrar/kashf-figure-attributes-gate2.js');
const RAW_SOURCE = readFileSync(DATA_FILE_PATH, 'utf8');

let failures = 0;
function assert(condition, message) {
  if (!condition) {
    failures++;
    console.error('✗ ' + message);
  } else {
    console.log('✓ ' + message);
  }
}

const FIELDS = [
  'maalaHouse',
  'moshavHouse',
  'gvulHouse',
  'panimHouse',
  'simchaHouse',
  'tzaarHouse',
  'mezegHouse',
];

const EXPECTED = {
  '1121': { maalaHouse:1,  moshavHouse:5,  gvulHouse:9,  panimHouse:11, simchaHouse:5,  tzaarHouse:7,    mezegHouse:null },
  '1222': { maalaHouse:2,  moshavHouse:1,  gvulHouse:1,  panimHouse:1,  simchaHouse:11, tzaarHouse:null, mezegHouse:6 },
  '2111': { maalaHouse:3,  moshavHouse:14, gvulHouse:7,  panimHouse:14, simchaHouse:5,  tzaarHouse:null, mezegHouse:2 },
  '2212': { maalaHouse:4,  moshavHouse:9,  gvulHouse:4,  panimHouse:6,  simchaHouse:6,  tzaarHouse:null, mezegHouse:null },
  '1211': { maalaHouse:5,  moshavHouse:16, gvulHouse:9,  panimHouse:13, simchaHouse:null,tzaarHouse:null, mezegHouse:null },
  '1112': { maalaHouse:6,  moshavHouse:13, gvulHouse:8,  panimHouse:7,  simchaHouse:6,  tzaarHouse:null, mezegHouse:null },
  '2122': { maalaHouse:7,  moshavHouse:9,  gvulHouse:3,  panimHouse:2,  simchaHouse:null,tzaarHouse:null, mezegHouse:null },
  '2221': { maalaHouse:8,  moshavHouse:7,  gvulHouse:2,  panimHouse:8,  simchaHouse:12, tzaarHouse:null, mezegHouse:5 },
  '2211': { maalaHouse:9,  moshavHouse:10, gvulHouse:6,  panimHouse:3,  simchaHouse:12, tzaarHouse:null, mezegHouse:null },
  '2112': { maalaHouse:11, moshavHouse:15, gvulHouse:15, panimHouse:6,  simchaHouse:15, tzaarHouse:null, mezegHouse:3 },
  '1122': { maalaHouse:12, moshavHouse:11, gvulHouse:5,  panimHouse:12, simchaHouse:null,tzaarHouse:null, mezegHouse:6 },
  '1111': { maalaHouse:13, moshavHouse:13, gvulHouse:16, panimHouse:15, simchaHouse:13, tzaarHouse:null, mezegHouse:5 },
  '1212': { maalaHouse:14, moshavHouse:3,  gvulHouse:12, panimHouse:5,  simchaHouse:10, tzaarHouse:null, mezegHouse:3 },
  '2222': { maalaHouse:16, moshavHouse:2,  gvulHouse:11, panimHouse:10, simchaHouse:10, tzaarHouse:null, mezegHouse:9 },
};

const EXPECTED_ORDER = Object.keys(EXPECTED);
const OMITTED = ['2121', '1221'];

console.log('\n--- 1. Canonical figure registry ---');
assert(HAWI_FIGURE_NAMES.length === 16, 'registry has 16 canonical figures');
assert(new Set(HAWI_FIGURE_NAMES.map((x) => x.pattern)).size === 16, 'registry patterns are unique');

console.log('\n--- 2. Printed p97-99 row set ---');
const keys = Object.keys(FIGURE_DIGNITIES);
assert(keys.length === 14, 'FIGURE_DIGNITIES has exactly 14 printed rows');
assert(JSON.stringify(keys) === JSON.stringify(EXPECTED_ORDER), 'row order follows the printed source sequence');
for (const pattern of OMITTED) {
  assert(!Object.prototype.hasOwnProperty.call(FIGURE_DIGNITIES, pattern), pattern + ' is not invented into the printed table');
}
assert(
  JSON.stringify(Object.keys(FIGURE_DIGNITIES_METADATA.omittedFigures).sort()) === JSON.stringify(OMITTED.slice().sort()),
  'metadata omittedFigures is exactly {2121 ממון נכנס, 1221 סוהר}'
);

console.log('\n--- 3. Exact 14-row source fidelity ---');
for (const [pattern, expected] of Object.entries(EXPECTED)) {
  const actual = FIGURE_DIGNITIES[pattern];
  assert(!!actual, pattern + ': row exists');
  const projected = Object.fromEntries(FIELDS.map((field) => [field, actual?.[field] ?? null]));
  assert(
    JSON.stringify(projected) === JSON.stringify(expected),
    pattern + ': seven dignity fields match printed pp97-99'
  );

  const registry = HAWI_FIGURE_NAMES_BY_ID[pattern];
  assert(!!registry?.hebrewName, pattern + ': canonical Hebrew name resolves');
}

console.log('\n--- 4. Critical repaired rows ---');
assert(FIGURE_DIGNITIES['1112'].panimHouse === 7 && FIGURE_DIGNITIES['1112'].simchaHouse === 6,
  'סף יוצא: face=7, joy=6');
assert(FIGURE_DIGNITIES['2211'].simchaHouse === 12,
  'כבוד נכנס: joy=12');
assert(FIGURE_DIGNITIES['2112'].maalaHouse === 11 && FIGURE_DIGNITIES['2112'].simchaHouse === 15,
  'חיבור is present: exaltation=11, joy=15');
assert(FIGURE_DIGNITIES['1122'].panimHouse === 12 && FIGURE_DIGNITIES['1122'].mezegHouse === 6,
  'כבוד יוצא: face=12, temperament=6');
assert(FIGURE_DIGNITIES['1111'].maalaHouse === 13 && FIGURE_DIGNITIES['1111'].panimHouse === 15,
  'דרך is present: exaltation=13, face=15');
assert(FIGURE_DIGNITIES['1212'].panimHouse === 5,
  'ממון יוצא: face=5');
assert(FIGURE_DIGNITIES['1212'].tzaarHouse === null,
  'ממון יוצא sorrow remains unresolved; "opposite" is not converted to a house number');

console.log('\n--- 5. Provenance / source guardrails ---');
assert(FIGURE_DIGNITIES_METADATA.provenance.editionId === 'kashf-hebrew-v57', 'dignity-table provenance points to corrected v57');
assert(/97-99/.test(FIGURE_DIGNITIES_METADATA.sourceRef), 'sourceRef is printed pp97-99');
assert(FIGURE_DIGNITIES_METADATA.nullSemantics.mustNotInfer === true, 'nulls must not be inferred');
assert(FIGURE_DIGNITIES_METADATA.nullSemantics.mustNotFillFromOtherTradition === true, 'other traditions may not fill missing rows');

console.log('\n--- 6. Leaf-data safety ---');
assert(!/^\s*import\s/m.test(RAW_SOURCE), 'data file has no imports');
for (const token of ['TODO', 'FIXME', 'placeholder', 'fetch(', 'api.anthropic.com', 'ANTHROPIC_API_KEY']) {
  assert(!RAW_SOURCE.toLowerCase().includes(token.toLowerCase()), 'data file excludes ' + token);
}

if (failures) {
  console.error('\n' + failures + ' checks failed.');
  process.exit(1);
}
console.log('\nGT-10 PASS — FIGURE_DIGNITIES now matches printed KASHF pp97-99: 14 rows, omitted {2121,1221}, no inferred completion.');
