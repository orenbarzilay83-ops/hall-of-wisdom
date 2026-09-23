import assert from 'node:assert/strict';
import fs from 'node:fs';

import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import {
  SHIBUTZ_3_ELEMENT_VALUES,
  SHIBUTZ_3_ALTERNATIVE_ELEMENT_VALUES_CITED,
  SHIBUTZ_3_P132_ELEMENT_VALUE_CONFLICT,
  SHIBUTZ_3_ELEMENT_TRADITION_CATALOG,
} from './goral-hachol/data/sources/kashf-al-asrar/kashf-shibutzim.js';
import {
  computeSelectedDhamirMethod,
  computeDhamirByMajority,
  KASHF_DHAMIR_NEED_DRIVEN_POLICY,
} from './goral-hachol/engine/kashf-dhamir.js';
import { buildKashfReading } from './goral-hachol/engine/kashf-reading-engine.js';
import { getApplicability } from './goral-hachol/brain/goral-rule-applicability-matrix.js';

// Batch 11 thematic wave:
// B07-DATA-ELEMENT-TRADITIONS-RUNTIME-PRECEDENCE
// B07-DHAMIR-NEED-DRIVEN-SELECTION
// B09-DHAMIR-MAJORITY-RUNTIME-DISABLED

// ── 1. Element traditions stay separate ─────────────────────────────────
assert.equal(SHIBUTZ_3_ELEMENT_VALUES.traditionId, 'p122-author-working');
assert.deepEqual(
  { אש: SHIBUTZ_3_ELEMENT_VALUES['אש'], אוויר: SHIBUTZ_3_ELEMENT_VALUES['אוויר'], מים: SHIBUTZ_3_ELEMENT_VALUES['מים'], עפר: SHIBUTZ_3_ELEMENT_VALUES['עפר'] },
  { אש: 1, אוויר: 2, מים: 3, עפר: 4 }
);
assert.equal(SHIBUTZ_3_ALTERNATIVE_ELEMENT_VALUES_CITED.length, 3);
for (const tradition of SHIBUTZ_3_ALTERNATIVE_ELEMENT_VALUES_CITED) {
  assert.equal(tradition.operationalRole, 'REFERENCE_ONLY', tradition.traditionId);
  assert.equal(tradition.runtimeEligible, false, tradition.traditionId);
  assert.equal(tradition.mayAutoSelect, false, tradition.traditionId);
  assert.equal(tradition.mayVoteAgainstSelectedTradition, false, tradition.traditionId);
}
assert.deepEqual(
  SHIBUTZ_3_ALTERNATIVE_ELEMENT_VALUES_CITED.find((x) => x.traditionId === 'p126-zanati').values,
  { אש: 9, אוויר: 11, מים: 14, עפר: 16 }
);
assert.deepEqual(
  SHIBUTZ_3_ALTERNATIVE_ELEMENT_VALUES_CITED.find((x) => x.traditionId === 'p126-trabulsi').values,
  { אש: 1, אוויר: 2, מים: 4, עפר: 8 }
);
assert.deepEqual(
  SHIBUTZ_3_ALTERNATIVE_ELEMENT_VALUES_CITED.find((x) => x.traditionId === 'p126-ahl-al-tabai').values,
  { אש: 1, אוויר: 2, מים: 3, עפר: 4 }
);

// p132 is not normalized back into p126.
assert.equal(SHIBUTZ_3_P132_ELEMENT_VALUE_CONFLICT.sourceStatus, 'SOURCE_CONFLICT');
assert.equal(SHIBUTZ_3_P132_ELEMENT_VALUE_CONFLICT.runtimeEligible, false);
assert.deepEqual(SHIBUTZ_3_P132_ELEMENT_VALUE_CONFLICT.ahlAlTabaiLines.values, { אש: 8, אוויר: 4, מים: 2, עפר: 1 });
assert.deepEqual(SHIBUTZ_3_P132_ELEMENT_VALUE_CONFLICT.zanati.values, { אש: 1, אוויר: 2, מים: 3, עפר: 4 });
assert.equal(SHIBUTZ_3_P132_ELEMENT_VALUE_CONFLICT.trabulsiAgreementWithZanati, true);

assert.equal(SHIBUTZ_3_ELEMENT_TRADITION_CATALOG['p122-author-working'].runtimeEligible, true);
for (const id of ['p126-zanati', 'p126-trabulsi', 'p126-ahl-al-tabai']) {
  assert.equal(SHIBUTZ_3_ELEMENT_TRADITION_CATALOG[id].runtimeEligible, false, id);
}

// ── 2. Need-driven selector: intent + one method + explicit tradition ─────
assert.deepEqual(KASHF_DHAMIR_NEED_DRIVEN_POLICY.approvedIntentIds, ['hiddenThoughtIntent']);
assert.equal(KASHF_DHAMIR_NEED_DRIVEN_POLICY.autoRunAllImplementedMethods, false);
assert.equal(KASHF_DHAMIR_NEED_DRIVEN_POLICY.requireApprovedIntentId, true);
assert.equal(KASHF_DHAMIR_NEED_DRIVEN_POLICY.elementPrevalenceRequiresExplicitTradition, true);

const board = buildRamlBoardFromMothers(['1112', '2122', '1121', '2211']);

const unrelated = computeSelectedDhamirMethod(board, 'mizan', { intentId: 'businessSuccess' });
assert.equal(unrelated.selected, false);
assert.equal(unrelated.reason, 'dhamir-intent-not-approved');
assert.deepEqual(unrelated.methodsExecuted, []);

const missingTradition = computeSelectedDhamirMethod(board, 'element-prevalence', {
  intentId: 'hiddenThoughtIntent',
});
assert.equal(missingTradition.reason, 'explicit-element-tradition-required');

const referenceTradition = computeSelectedDhamirMethod(board, 'element-prevalence', {
  intentId: 'hiddenThoughtIntent',
  elementTraditionId: 'p126-zanati',
});
assert.equal(referenceTradition.reason, 'element-tradition-not-runtime-eligible');
assert.deepEqual(referenceTradition.methodsExecuted, []);

const oneMethod = computeSelectedDhamirMethod(board, 'mizan', {
  intentId: 'hiddenThoughtIntent',
});
assert.equal(oneMethod.selected, true);
assert.deepEqual(oneMethod.methodsExecuted, ['mizan']);
assert(oneMethod.result);

const selectedElement = computeSelectedDhamirMethod(board, 'element-prevalence', {
  intentId: 'hiddenThoughtIntent',
  elementTraditionId: 'p122-author-working',
});
assert.equal(selectedElement.selected, true);
assert.deepEqual(selectedElement.methodsExecuted, ['element-prevalence']);
assert.equal(selectedElement.result.elementTraditionId, 'p122-author-working');

// ── 3. Default reading no longer performs Dhamir/background bundle ────────
const normal = buildKashfReading(board, 'commerce', {
  question: 'האם העסק יצליח?',
});
assert.equal(normal.dhamir, null);
assert.equal(normal.dhamirType4External, null);
assert.equal(normal.dhamirExtras, null);

const explicit = buildKashfReading(board, 'commerce', {
  question: 'מה הוא באמת חושב?',
  dhamirSelection: {
    intentId: 'hiddenThoughtIntent',
    methodId: 'mizan',
  },
});
assert(explicit.dhamir?.winner);
assert.equal(explicit.dhamir.candidates.length, 1);
assert.equal(explicit.dhamir.agreementCount, 1);
assert.deepEqual(explicit.dhamir.selection.methodsExecuted, ['mizan']);
assert.equal(explicit.dhamirType4External, null);
assert.equal(explicit.dhamirExtras, null);

// Extras are a separate opt-in and require an already-selected Dhamir house.
const explicitWithExtras = buildKashfReading(board, 'commerce', {
  question: 'מה הוא באמת חושב?',
  dhamirSelection: {
    intentId: 'hiddenThoughtIntent',
    methodId: 'harkat-al-ard',
  },
  enableDhamirExtras: true,
});
assert(explicitWithExtras.dhamir?.winner);
assert(explicitWithExtras.dhamirExtras && typeof explicitWithExtras.dhamirExtras === 'object');

// ── 4. p155 majority is preserved as source knowledge, disconnected runtime
const sourceMajority = computeDhamirByMajority(board);
assert(sourceMajority && Array.isArray(sourceMajority.candidates));
assert(sourceMajority.candidates.length > 1, 'source majority helper remains callable directly');

const readingEngineSrc = fs.readFileSync('./goral-hachol/engine/kashf-reading-engine.js', 'utf8');
assert(!readingEngineSrc.includes("import { computeDhamirByMajority }"));
assert(!/computeDhamirByMajority\s*\(board\)/.test(readingEngineSrc));

// ── 5. Applicability reflects the same runtime boundary ─────────────────
assert.equal(getApplicability('businessSuccess', 'kashf', 'dhamir'), 'forbidden');
assert.equal(getApplicability('hiddenThoughtIntent', 'kashf', 'dhamir'), 'advisorOnly');

console.log('Batch 11 element precedence + need-driven Dhamir runtime: PASS');
console.log('p126 traditions isolated: PASS');
console.log('p132 source conflict preserved: PASS');
console.log('default Dhamir majority disconnected: PASS');
console.log('single explicit Dhamir selection: PASS');
