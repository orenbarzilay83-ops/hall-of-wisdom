/**
 * DS-03 regression: printed pp.97-101 / scan pp.99-103.
 * Source authority is the printed scan. The canonical Hebrew and Master
 * Index are comparison/traceability layers, not substitutes for the scan.
 */

import {
  FIGURE_DIGNITIES,
  FIGURE_DIGNITIES_METADATA,
  FIGURE_JOY_GRIEF_SUPPLEMENTARY_NOTE,
  FIGURE_MONTHS,
} from './goral-hachol/data/sources/kashf-al-asrar/kashf-figure-attributes-gate2.js';
import { computeDhamirElementPrevalence } from './goral-hachol/engine/kashf-dhamir.js';

let failures = 0;
function assert(condition, message) {
  if (condition) console.log(`✓ ${message}`);
  else { failures += 1; console.error(`✗ ${message}`); }
}

const expectedDignities = {
  '1121': [1, 5, 9, 11, 5, 7, null],
  '1222': [2, 1, 1, 1, 11, null, 6],
  '2111': [3, 14, 7, 14, 5, null, 2],
  '2212': [4, 9, 4, 6, 6, null, null],
  '1211': [5, 16, 9, 13, null, null, null],
  '1112': [6, 13, 8, 7, 6, null, null],
  '2122': [7, 9, 3, 2, null, null, null],
  '2221': [8, 7, 2, 8, 12, null, 5],
  '2211': [9, 10, 6, 3, 12, null, null],
  '2112': [11, 15, 15, 6, 15, null, 3],
  '1122': [12, 11, 5, 12, null, null, 6],
  '1111': [13, 13, 16, 15, 13, null, 5],
  '1212': [14, 3, 12, 5, 10, null, 3],
  '2222': [16, 2, 11, 10, 10, null, 9],
};
const fields = ['maalaHouse', 'moshavHouse', 'gvulHouse', 'panimHouse', 'simchaHouse', 'tzaarHouse', 'mezegHouse'];

console.log('\n--- DS-03 dignity table ---');
assert(Object.keys(FIGURE_DIGNITIES).length === 14, 'printed table has exactly 14 rows');
assert(!FIGURE_DIGNITIES['2121'] && !FIGURE_DIGNITIES['1221'], 'ממון נכנס and סוהר are absent from the printed table');
assert(!!FIGURE_DIGNITIES['2112'] && !!FIGURE_DIGNITIES['1111'], 'חיבור and דרך are present in the printed table');
assert(
  JSON.stringify(Object.keys(FIGURE_DIGNITIES_METADATA.omittedFigures).sort()) === JSON.stringify(['1221', '2121']),
  'metadata records only ממון נכנס and סוהר as omitted'
);
for (const [pattern, values] of Object.entries(expectedDignities)) {
  const actual = fields.map((field) => FIGURE_DIGNITIES[pattern]?.[field]);
  assert(JSON.stringify(actual) === JSON.stringify(values), `${pattern}: all seven printed values match`);
}
assert(FIGURE_DIGNITIES['1111'].burjHouse === 7, 'דרך preserves the printed burj value 7');
assert(FIGURE_DIGNITIES['1212'].tzaarHouse === null, 'ממון יוצא relative grief wording is not converted to a house number');

console.log('\n--- DS-03 joy/grief supplement ---');
const supplement = FIGURE_JOY_GRIEF_SUPPLEMENTARY_NOTE;
assert(supplement.planetJoyByHouse['נוגה'] === 5, 'Venus joy is H5');
assert(JSON.stringify(supplement.griefByFigure['2212']) === JSON.stringify([1]), 'לבן grief is H1');
assert(JSON.stringify(supplement.griefByFigure['1111']) === JSON.stringify([1]), 'דרך grief is H1');
assert(!Object.hasOwn(supplement.griefByFigure, '1212'), 'ממון יוצא is not promoted to a definite H1 grief rule');
assert(
  JSON.stringify(supplement.tentativePlanetAttachments.figures) === JSON.stringify(['1212', '1112']) &&
    supplement.tentativePlanetAttachments.status === 'source-tentative',
  'ממון יוצא and סף יוצא remain jointly tentative for Saturn/Mars'
);

console.log('\n--- DS-03 month associations ---');
assert(JSON.stringify(FIGURE_MONTHS.byMonth['שוואל']) === JSON.stringify(['2222', '2212']), 'Shawwal includes קהלה and לבן');
assert(JSON.stringify(FIGURE_MONTHS.byMonth['מוחרם']) === JSON.stringify(['2212']), 'Muharram maps to לבן');
assert(JSON.stringify(FIGURE_MONTHS.byMonth['רביע האחרון']) === JSON.stringify(['1121', '2111']), 'Rabi al-Akhir includes נלחם and סף נכנס');
assert(JSON.stringify(FIGURE_MONTHS.unassignedFigures) === JSON.stringify(['1211']), 'only בר הלחי remains unassigned');

console.log('\n--- DS-03 live consumer safety ---');
function makeBoard(overrides = {}) {
  const entries = Array.from({ length: 16 }, (_, index) => ({
    houseNumber: index + 1,
    pattern: overrides[index + 1] || '2222',
  }));
  return { entries };
}
const confirmed = computeDhamirElementPrevalence(makeBoard({ 1: '1121', 15: '1222' }));
assert(confirmed?.confirmedByMaala === true && confirmed?.houseNumber === 1, 'existing H1 dignity confirmation remains active');
const omitted = computeDhamirElementPrevalence(makeBoard({ 1: '2121', 2: '1222', 15: '1222' }));
assert(omitted?.confirmedByMaala === false && omitted?.houseNumber === 2, 'omitted ממון נכנס safely follows the existing moshav fallback');

if (failures) {
  console.error(`\n${failures} DS-03 assertions failed.`);
  process.exit(1);
}
console.log('\nDS-03 PASS: printed pp.97-101 are represented without inferred rows or silent certainty upgrades.');
