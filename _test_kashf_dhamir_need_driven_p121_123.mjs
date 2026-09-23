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
assert.deepEqual(KASHF_DHAMIR_NEED_DRIVEN_POLICY.sourceDataPages, [121, 122, 123]);

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
assert.deepEqual(computeSelectedDhamirMethod({}, null), {
  selected: false,
  status: 'blocked',
  reason: 'explicit-dhamir-method-required',
  methodId: null,
  methodsExecuted: [],
  result: null,
});
assert.deepEqual(computeSelectedDhamirMethod({}, 'not-a-real-method'), {
  selected: false,
  status: 'blocked',
  reason: 'unknown-dhamir-method',
  methodId: 'not-a-real-method',
  methodsExecuted: [],
  result: null,
});

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

const selected = computeSelectedDhamirMethod(board, 'element-prevalence');
assert.equal(selected.selected, true);
assert.deepEqual(selected.methodsExecuted, ['element-prevalence']);
assert.equal(selected.methodId, 'element-prevalence');
assert(selected.result);
assert.equal(selected.result.method, 'element-prevalence');
assert.equal(selected.result.prevailingElement, 'מים');
assert.equal(selected.result.walkValue, 3);

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
