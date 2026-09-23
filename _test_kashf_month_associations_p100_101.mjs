import assert from 'node:assert/strict';

import {
  FIGURE_MONTHS,
} from './goral-hachol/data/sources/kashf-al-asrar/kashf-figure-attributes-gate2.js';

// Printed KASHF pp100-101 / scan pp102-103 source regression.

assert.equal(FIGURE_MONTHS.sourceRef, "כשף אל-אסראר עמ' 100-101");
assert.equal(FIGURE_MONTHS.provenance.editionId, 'kashf-hebrew-v57');
assert.equal(FIGURE_MONTHS.certainty.visualDependency, 'printed-scan-p102-103');

const expected = {
  'רמדאן': ['1222'],
  "ג'ומאדא הראשונה": ['2121', '1112'],
  "ג'ומאדא האחרונה": ['1212'],
  'שוואל': ['2222', '2212'],
  'רביע הראשון': ['1121'],
  'רביע האחרון': ['1121', '2111'],
  'שעבאן': ['1221', '2221'],
  'רג׳ב': ['2122'],
  'מוחרם': ['2212'],
  'צפר': ['1122'],
  "ד׳ו אל־קעדה": ['2211'],
  "ד׳ו אל־חג׳ה": ['2112', '1111'],
};

assert.deepEqual(FIGURE_MONTHS.byMonth, expected, 'month map must match printed pp100-101 exactly');
assert.equal(Object.keys(FIGURE_MONTHS.byMonth).length, 12, 'all 12 Hijri months are represented');

// Critical duplicated associations preserved from the printed layout.
assert.deepEqual(FIGURE_MONTHS.byMonth['שוואל'], ['2222', '2212'], 'Shawwal includes Jamaa + Bayad');
assert.deepEqual(FIGURE_MONTHS.byMonth['מוחרם'], ['2212'], 'Bayad is also assigned to Muharram');
assert.deepEqual(FIGURE_MONTHS.byMonth['רביע האחרון'], ['1121', '2111'], 'Rabi al-Akhir includes Joudala + Ataba Dakhila');
assert.deepEqual(FIGURE_MONTHS.byMonth["ג'ומאדא הראשונה"], ['2121', '1112'], 'Jumada I includes Qabd Dakhil + Ataba Kharija');
assert.deepEqual(FIGURE_MONTHS.byMonth["ד׳ו אל־חג׳ה"], ['2112', '1111'], 'Dhu al-Hijjah includes Ijtimaa + Tariq');

// The source does not force a one-to-one relation.
const figureToMonths = {};
for (const [month, figures] of Object.entries(FIGURE_MONTHS.byMonth)) {
  for (const pattern of figures) {
    (figureToMonths[pattern] ||= []).push(month);
  }
}
assert.deepEqual(figureToMonths['2212'], ['שוואל', 'מוחרם'], 'Bayad must remain associated with two months');
assert.deepEqual(figureToMonths['1121'], ['רביע הראשון', 'רביע האחרון'], 'Joudala must remain associated with two months');

assert.deepEqual(FIGURE_MONTHS.unassignedFigures, ['1211'], 'Bar al-Khad is the only figure with no explicit month assignment');
assert.equal(FIGURE_MONTHS.completenessPolicy.allTwelveMonthsRepresented, true);
assert.equal(FIGURE_MONTHS.completenessPolicy.mustNotInferMissingAssignments, true);
assert.equal(FIGURE_MONTHS.completenessPolicy.mustNotForceOneMonthPerFigure, true);
assert.equal(FIGURE_MONTHS.completenessPolicy.mustNotForceOneFigurePerMonth, true);
assert.equal(FIGURE_MONTHS.completenessPolicy.mustNotFillFromOtherTradition, true);

console.log('Batch 05 pp100-101 month-association source regression: PASS');
console.log('All 12 Hijri months represented: PASS');
console.log('Bayad -> Shawwal + Muharram preserved: PASS');
console.log('Ataba Dakhila -> Rabi al-Akhir restored: PASS');
console.log('No one-to-one inference introduced: PASS');
