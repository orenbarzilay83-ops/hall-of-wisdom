import assert from 'node:assert/strict';

import {
  HOUSE_PARTNERS,
  HOUSE_TESTIMONY,
} from './goral-hachol/data/sources/kashf-al-asrar/kashf-figure-attributes-gate2.js';

import { KASHF_BOOK_RULE_CATALOG } from './goral-hachol/data/sources/kashf-al-asrar/kashf-book-rule-catalog.js';

// Printed KASHF pp101-102 / scan pp103-104 regression.

assert.equal(HOUSE_PARTNERS.sourceRef, "כשף אל-אסראר עמ' 101-102");
assert.equal(HOUSE_PARTNERS.provenance.editionId, 'kashf-hebrew-v57');
assert.equal(HOUSE_PARTNERS.certainty.visualDependency, 'printed-scan-p103-104');
assert.deepEqual(
  {13: HOUSE_PARTNERS[13], 14: HOUSE_PARTNERS[14], 15: HOUSE_PARTNERS[15], 16: HOUSE_PARTNERS[16]},
  {13: 1, 14: 7, 15: 10, 16: 4},
  'partner map must match printed p101'
);

assert.equal(HOUSE_TESTIMONY.sourceRef, "כשף אל-אסראר עמ' 101-102");
assert.equal(HOUSE_TESTIMONY.provenance.editionId, 'kashf-hebrew-v57');
assert.equal(HOUSE_TESTIMONY.certainty.visualDependency, 'printed-scan-p103-104');

assert.deepEqual(HOUSE_TESTIMONY[9],  [1,5,7], 'H9 witness targets');
assert.deepEqual(HOUSE_TESTIMONY[14], [2,6,10], 'H14 witness targets');
assert.deepEqual(HOUSE_TESTIMONY[5],  [3,7,11], 'H5 witness targets — critical printed numeral');
assert.deepEqual(HOUSE_TESTIMONY[16], [4,8,12], 'H16 witness targets');
assert.equal(Object.prototype.hasOwnProperty.call(HOUSE_TESTIMONY, 15), false, 'H15 is NOT a witness key in the p101 extended map');
assert.equal(HOUSE_TESTIMONY[5].includes(6), false, 'H6 must NOT be invented in the H5 witness targets');

const rule = KASHF_BOOK_RULE_CATALOG.find((x) => x.ruleKey === 'kashf-p101-witness-scheme-extended');
assert.ok(rule, 'p101 extended witness rule exists in catalog');
assert.deepEqual(rule.requiredHouses, [5,9,13,14,15,16], 'catalog requires all source houses used by partner+witness data');
assert.match(rule.calculationType, /5→\[3,7,11\]/, 'catalog carries H5 witness map');
assert.doesNotMatch(rule.calculationType, /15→\[3,6,7,11\]/, 'catalog no longer carries stale H15 witness map');
assert.equal(rule.implementationStatus, 'missing', 'source correction does not silently implement unresolved extended witness scheme');
assert.equal(rule.resolutionStatus, 'unresolvedSourceRelationship', 'relationship to p53 scheme remains unresolved');

console.log('Batch 06 pp101-102 partner/witness source regression: PASS');
console.log('Critical H5 -> H3/H7/H11 numeral: PASS');
console.log('H15 stale witness key absent: PASS');
console.log('No invented H6 in H5 targets: PASS');
console.log('p53 vs p101-102 scheme relationship remains unresolved: PASS');
