import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  SEVEN_WISDOM_WITNESSES_NOTE,
  FIGURE_PROXIMITY_RUNTIME_POLICY,
  FIGURE_PROXIMITY_RULES,
} from './goral-hachol/data/sources/kashf-al-asrar/kashf-gate5-foundational-figures.js';

// Batch 15 — p164-165 operational boundaries.

// Seven Witnesses: H9-H15 exactly; H16 is separate for dhamir.
assert.deepEqual(SEVEN_WISDOM_WITNESSES_NOTE.witnessHouses, [9,10,11,12,13,14,15]);
assert.equal(SEVEN_WISDOM_WITNESSES_NOTE.witnessHouses.includes(16), false);
assert.equal(SEVEN_WISDOM_WITNESSES_NOTE.hiddenIntentionHouse, 16);
assert.equal(SEVEN_WISDOM_WITNESSES_NOTE.h16CountsAsWitness, false);
assert.equal(SEVEN_WISDOM_WITNESSES_NOTE.operationalRole, 'SUPPORTING_ONLY');
assert.equal(SEVEN_WISDOM_WITNESSES_NOTE.runtimeEligibleAsPrimary, false);
assert.equal(SEVEN_WISDOM_WITNESSES_NOTE.mayAutoRoute, false);
assert.equal(SEVEN_WISDOM_WITNESSES_NOTE.mayMergeWithOtherWitnessSystems, false);

// Proximity remains reference-only until "proximity" is source-faithfully defined.
assert(Array.isArray(FIGURE_PROXIMITY_RULES) && FIGURE_PROXIMITY_RULES.length > 0);
assert.equal(FIGURE_PROXIMITY_RUNTIME_POLICY.operationalRole, 'REFERENCE_ONLY');
assert.equal(FIGURE_PROXIMITY_RUNTIME_POLICY.runtimeEligible, false);
assert.equal(FIGURE_PROXIMITY_RUNTIME_POLICY.mayAutoRun, false);
assert.equal(FIGURE_PROXIMITY_RUNTIME_POLICY.mayFeedVerdict, false);
assert.equal(FIGURE_PROXIMITY_RUNTIME_POLICY.computationalDefinitionStatus, 'UNRESOLVED');
assert.equal(FIGURE_PROXIMITY_RUNTIME_POLICY.knowledgeStatus, 'REVIEW_REQUIRED');

// Enforce that neither source-only structure is imported/referenced by live runtime
// directories. Similar words such as "proximity" in unrelated theft methods are fine;
// this guard is on the exact Gate-5 source symbols.
const runtimeRoots = [
  './goral-hachol/engine',
  './goral-hachol/registry',
  './goral-hachol/intelligence',
  './goral-hachol/brain',
  './goral-hachol/ui',
  './raml-data',
];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.(?:js|mjs|ts)$/.test(entry.name) ? [full] : [];
  });
}

const forbiddenSymbols = ['SEVEN_WISDOM_WITNESSES_NOTE', 'FIGURE_PROXIMITY_RULES'];
const violations = [];
for (const file of runtimeRoots.flatMap(walk)) {
  const src = fs.readFileSync(file, 'utf8');
  for (const symbol of forbiddenSymbols) {
    if (src.includes(symbol)) violations.push({ file, symbol });
  }
}
assert.deepEqual(
  violations,
  [],
  'Gate-5 Seven Witnesses / proximity source symbols must remain disconnected from live runtime'
);

console.log('Batch 15 Seven Witnesses supporting-only boundary: PASS');
console.log('H16 separate from the seven witnesses: PASS');
console.log('p164-165 proximity runtime block: PASS');
console.log('no live runtime imports of Gate-5 witness/proximity source symbols: PASS');
