import assert from 'node:assert/strict';

import {
  SHIBUTZ_2_CANONICAL_NUMBER,
  SHIBUTZ_2_MONEY_BY_HOUSE,
} from './goral-hachol/data/sources/kashf-al-asrar/kashf-shibutzim.js';

// Printed KASHF p111 / scan p113 regression.
const expectedMoney = {
  1:  { value: 1,   altValue: null },
  2:  { value: 3,   altValue: null },
  3:  { value: 6,   altValue: null },
  4:  { value: 10,  altValue: null },
  5:  { value: 15,  altValue: null },
  6:  { value: 21,  altValue: null },
  7:  { value: 29,  altValue: null },
  8:  { value: 36,  altValue: null },
  9:  { value: 45,  altValue: 70 },
  10: { value: 55,  altValue: 300 },
  11: { value: 66,  altValue: 600 },
  12: { value: 79,  altValue: 700 },
  13: { value: 105, altValue: 3000 },
  14: { value: 110, altValue: 4000 },
  15: { value: 120, altValue: 6000 },
  16: { value: 136, altValue: 10000 },
};

for (let house = 1; house <= 16; house++) {
  assert.deepEqual(
    SHIBUTZ_2_MONEY_BY_HOUSE[house],
    expectedMoney[house],
    `p111 money row H${house} must match printed source`
  );
}

assert.equal(SHIBUTZ_2_MONEY_BY_HOUSE.sourceRef, "כשף אל-אסראר עמ' 111");
assert.equal(SHIBUTZ_2_MONEY_BY_HOUSE.sourceStatus, 'explicit-in-source');

// Critical repaired rows.
assert.equal(SHIBUTZ_2_MONEY_BY_HOUSE[7].value, 29, 'p111 H7 is 29, not 28');
assert.equal(SHIBUTZ_2_MONEY_BY_HOUSE[11].altValue, 600, 'p111 H11 alternate is 600, not 760');
assert.equal(SHIBUTZ_2_MONEY_BY_HOUSE[12].altValue, 700, 'p111 H12 alternate is 700, not 770');

// Guard the independent p106 canonical sequence from accidental normalization.
const p106Position7 = SHIBUTZ_2_CANONICAL_NUMBER.find((x) => x.position === 7);
const p106Position11 = SHIBUTZ_2_CANONICAL_NUMBER.find((x) => x.position === 11);
const p106Position12 = SHIBUTZ_2_CANONICAL_NUMBER.find((x) => x.position === 12);
assert.equal(p106Position7?.number, 28, 'p106 canonical position 7 remains 28');
assert.equal(p106Position11?.number, 66, 'p106 canonical position 11 remains 66');
assert.equal(p106Position12?.number, 78, 'p106 canonical position 12 remains 78');

console.log('Batch 07 p111 money-number table regression: PASS');
console.log('H7=29: PASS');
console.log('H11 alternate=600: PASS');
console.log('H12 alternate=700: PASS');
console.log('p106 canonical sequence remains separate: PASS');
