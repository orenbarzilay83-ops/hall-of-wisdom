import assert from 'node:assert/strict';

import {
  KASHF_DHAMIR_NEED_DRIVEN_POLICY,
  KASHF_DHAMIR_IMPLEMENTED_METHOD_CATALOG,
  computeSelectedDhamirMethod,
} from './goral-hachol/engine/kashf-dhamir.js';
import { computeLeshonHainyan } from './goral-hachol/engine/kashf-leshon-hainyan.js';

// Batch 10 — pp121-123 downstream boundary.
// Source data being present must never auto-select or auto-run every dhamir method.
assert.equal(KASHF_DHAMIR_NEED_DRIVEN_POLICY.selectionMode, 'explicit-single-method');
assert.equal(KASHF_DHAMIR_NEED_DRIVEN_POLICY.autoSelectFromAvailableData, false);
assert.equal(KASHF_DHAMIR_NEED_DRIVEN_POLICY.autoRunAllImplementedMethods, false);
assert.equal(KASHF_DHAMIR_NEED_DRIVEN_POLICY.requireExplicitMethodId, true);
assert.deepEqual(KASHF_DHAMIR_NEED_DRIVEN_POLICY.sourceDataPages, [121, 122, 123, 124, 125, 128, 130, 131]);

const catalogIds = KASHF_DHAMIR_IMPLEMENTED_METHOD_CATALOG.map((x) => x.methodId);
assert.deepEqual(catalogIds, [
  'mizan',
  'harkat-al-ard',
  'jawharayn',
  'doubled-square',
  'element-prevalence',
]);

const elementMethod = KASHF_DHAMIR_IMPLEMENTED_METHOD_CATALOG.find(
  (x) => x.methodId === 'element-prevalence'
);
assert(elementMethod);
assert.equal(elementMethod.usesShibutz3ElementValues, true);
for (const entry of KASHF_DHAMIR_IMPLEMENTED_METHOD_CATALOG) {
  if (entry.methodId !== 'element-prevalence') {
    assert.equal(entry.usesShibutz3ElementValues, false, entry.methodId);
  }
}

// Missing/unknown selection blocks BEFORE touching the board.
assert.equal(
  computeSelectedDhamirMethod({}, null).reason,
  'dhamir-intent-not-approved',
  'without an approved intent the selector blocks before method/board evaluation'
);
assert.equal(
  computeSelectedDhamirMethod({}, null, { intentId: 'hiddenThoughtIntent' }).reason,
  'explicit-dhamir-method-required',
  'approved intent still requires an explicit method'
);
assert.equal(
  computeSelectedDhamirMethod({}, 'not-a-real-method', { intentId: 'hiddenThoughtIntent' }).reason,
  'unknown-dhamir-method'
);

// A complete synthetic board is enough to execute the selected source method.
// H15=2112 has open air+water; with p122 values water(3) prevails over air(2).
const patterns = [
  '1222', '2121', '1212', '2222',
  '1121', '1221', '2221', '2122',
  '2212', '1122', '2211', '1112',
  '1111', '2111', '2112', '1211',
];
const board = {
  entries: patterns.map((pattern, i) => ({
    houseNumber: i + 1,
    pattern,
  })),
};

assert.equal(
  computeSelectedDhamirMethod(board, 'element-prevalence', { intentId: 'hiddenThoughtIntent' }).reason,
  'explicit-element-tradition-required',
  'element-prevalence cannot inherit a tradition merely because p122 data is imported'
);
const selected = computeSelectedDhamirMethod(board, 'element-prevalence', {
  intentId: 'hiddenThoughtIntent',
  elementTraditionId: 'p122-author-working',
});
assert.equal(selected.selected, true);
assert.deepEqual(selected.methodsExecuted, ['element-prevalence']);
assert.equal(selected.methodId, 'element-prevalence');
assert(selected.result);
assert.equal(selected.result.method, 'element-prevalence');
assert.equal(selected.result.prevailingElement, 'מים');
assert.equal(selected.result.walkValue, 3);
assert.equal(selected.result.elementTraditionId, 'p122-author-working');

// Lisan al-Amr may consume an explicitly selected dhamir house, but it may
// no longer trigger computeDhamirByMajority on its own.
assert.equal(
  computeLeshonHainyan(board),
  null,
  'Lisan must not auto-run a dhamir majority when no explicit dhamir house was selected'
);
const lisanExplicit = computeLeshonHainyan(board, 1);
assert(lisanExplicit);
assert.equal(lisanExplicit.dhamirHouseNum, 1);
assert.equal(lisanExplicit.dhamirSource, 'provided-explicitly');

console.log('Batch 10 dhamir need-driven selection: PASS');
console.log('SHIBUTZ_3 element values do not auto-trigger all dhamir methods: PASS');
console.log('single selected dhamir method only: PASS');
console.log('Lisan implicit majority fallback removed: PASS');
