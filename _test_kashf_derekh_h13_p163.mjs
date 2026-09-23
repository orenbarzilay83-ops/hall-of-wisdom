import assert from 'node:assert/strict';

import { DEREKH_HOUSE_RULES } from './goral-hachol/data/sources/kashf-al-asrar/kashf-gate5-foundational-figures.js';
import { computeDerekhHouseRuleKashf } from './goral-hachol/engine/kashf-book-additions.js';

function chartWith(overrides = {}) {
  const base = Array.from({ length: 16 }, (_, i) => ({
    house: i + 1,
    key: '2222',
    hebrew: 'קהלה',
  }));
  for (const [house, key] of Object.entries(overrides)) {
    base[Number(house) - 1] = {
      house: Number(house),
      key,
      hebrew: key === '1111' ? 'דרך' : key,
    };
  }
  return base;
}

const h13 = DEREKH_HOUSE_RULES[13];
assert(h13);
assert.deepEqual(h13.parentHouses, [9, 10]);

// Printed p163: H9 internal + H10 external => quick return.
const quick = h13.verdictsByParentCombo['dakhil-kharij'];
assert(quick);
assert.match(quick.textHebrew, /מהירות/);
assert.equal(quick.sourceRef, "כשף אל-אסראר עמ' 163");

// Printed p163: H9 external + H10 internal => delay / long stay.
const slow = h13.verdictsByParentCombo['kharij-dakhil'];
assert(slow);
assert.match(slow.textHebrew, /יתעכב|זמן רב/);
assert.equal(slow.sourceRef, "כשף אל-אסראר עמ' 163");

// Runtime must preserve the same polarity.
// 2111 => fire=2, earth=1 => dakhil.
// 1112 => fire=1, earth=2 => kharij.
const quickRuntime = computeDerekhHouseRuleKashf(chartWith({
  9: '2111',
  10: '1112',
  13: '1111',
}));
assert.equal(quickRuntime.verdict, 'derekh-house-rule-found');
assert.equal(quickRuntime.derekhHouse, 13);
assert.equal(quickRuntime.comboKey, 'dakhil-kharij');
assert.match(quickRuntime.outputHebrew, /מהירות/);

const slowRuntime = computeDerekhHouseRuleKashf(chartWith({
  9: '1112',
  10: '2111',
  13: '1111',
}));
assert.equal(slowRuntime.verdict, 'derekh-house-rule-found');
assert.equal(slowRuntime.derekhHouse, 13);
assert.equal(slowRuntime.comboKey, 'kharij-dakhil');
assert.match(slowRuntime.outputHebrew, /יתעכב|זמן רב/);

// Same-polarity combinations are not defined for H13 and must not be invented.
const unspecified = computeDerekhHouseRuleKashf(chartWith({
  9: '2111',
  10: '2111',
  13: '1111',
}));
assert.equal(unspecified.verdict, 'combo-not-specified-in-source');
assert.equal(unspecified.derekhHouse, 13);

console.log('Batch 14 p163 Derekh H13 polarity: PASS');
console.log('H9 dakhil + H10 kharij => quick return: PASS');
console.log('H9 kharij + H10 dakhil => delay/long stay: PASS');
console.log('undefined same-polarity branches remain unresolved: PASS');
