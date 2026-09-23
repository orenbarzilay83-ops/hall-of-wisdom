import assert from 'node:assert/strict';

import {
  KASHF_ATTRIBUTED_METHOD_RUNTIME_POLICY,
  KASHF_SHIBUTZ_ATTRIBUTED_METHOD_CATALOG,
  SHIBUTZ_2_ALZANATI_CITATION,
  SHIBUTZ_2_P121_ATTRIBUTED_DISTANCE_METHODS,
  SHIBUTZ_2_P121_RETURN_TO_PRIMARY_COPY,
} from './goral-hachol/data/sources/kashf-al-asrar/kashf-shibutzim.js';
import {
  KASHF_CANONICAL_METHODS,
  validateKashfMethodRegistry,
} from './goral-hachol/registry/kashf-canonical-method-registry.js';
import { buildKashfReadingByMethod } from './goral-hachol/engine/kashf-canonical-reading-engine.js';

// Batch 09 — printed KASHF pp113-114/121.
// Attributed / variant methods are knowledge-only by default.
assert.equal(KASHF_ATTRIBUTED_METHOD_RUNTIME_POLICY.operationalRole, 'REFERENCE_ONLY');
assert.equal(KASHF_ATTRIBUTED_METHOD_RUNTIME_POLICY.runtimeEligible, false);
assert.equal(KASHF_ATTRIBUTED_METHOD_RUNTIME_POLICY.defaultEligible, false);
assert.equal(KASHF_ATTRIBUTED_METHOD_RUNTIME_POLICY.mayAutoRun, false);
assert.equal(KASHF_ATTRIBUTED_METHOD_RUNTIME_POLICY.mayVoteAgainstPrimary, false);
assert.equal(KASHF_ATTRIBUTED_METHOD_RUNTIME_POLICY.requiresExplicitSelection, true);

assert.equal(KASHF_SHIBUTZ_ATTRIBUTED_METHOD_CATALOG.length, 4);
for (const entry of KASHF_SHIBUTZ_ATTRIBUTED_METHOD_CATALOG) {
  assert.equal(entry.operationalRole, 'REFERENCE_ONLY', entry.id);
  assert.equal(entry.runtimeEligible, false, entry.id);
  assert.equal(entry.defaultEligible, false, entry.id);
  assert.equal(entry.mayAutoRun, false, entry.id);
  assert.equal(entry.mayVoteAgainstPrimary, false, entry.id);
}

assert.equal(SHIBUTZ_2_ALZANATI_CITATION.operationalRole, 'REFERENCE_ONLY');
assert.equal(SHIBUTZ_2_ALZANATI_CITATION.runtimeEligible, false);
assert.equal(SHIBUTZ_2_ALZANATI_CITATION.mayAutoRun, false);
assert.equal(SHIBUTZ_2_ALZANATI_CITATION.mayVoteAgainstPrimary, false);

assert.equal(SHIBUTZ_2_P121_ATTRIBUTED_DISTANCE_METHODS.length, 2);
const zanati = SHIBUTZ_2_P121_ATTRIBUTED_DISTANCE_METHODS.find((x) => x.id === 'al-zanati-distance');
const layth = SHIBUTZ_2_P121_ATTRIBUTED_DISTANCE_METHODS.find((x) => x.id === 'al-layth-distance');
assert(zanati && layth);
assert.deepEqual(zanati.unitByLandingGroup, {
  mothers: 'שיבר', daughters: 'אמה', generated: 'באע', balances: 'פרסה',
});
assert.deepEqual(layth.unitByFigureOriginGroup, {
  mothers: 'שיבר', daughters: 'אמה', generated: 'באע', balances: 'פרסה',
});
assert.equal(SHIBUTZ_2_P121_RETURN_TO_PRIMARY_COPY.arabic, 'رجع إلى النسخة الأولى');

// Registry invariant: an attributed/external record can never be runtimeAllowed.
for (const method of Object.values(KASHF_CANONICAL_METHODS)) {
  if (method.attributedSourceBook !== 'Kashf' || method.sourceLayer !== 'body') {
    assert.equal(method.runtimeAllowed, false, method.kashfMethodId);
  }
}
const registryValidation = validateKashfMethodRegistry();
assert.equal(registryValidation.valid, true, registryValidation.errors.join('\n'));

// Direct execution hard-stop: even bypassing question routing, an external method
// remains educational/reference-only and cannot feed a verdict.
const blocked = buildKashfReadingByMethod({}, 'travel.external.p246.directionNuzhat');
assert.equal(blocked.valid, false);
assert.equal(blocked.canRunKashf, false);
assert.equal(blocked.reason, 'attributed-reference-only');
assert.equal(blocked.verdict, null);

console.log('Batch 09 attributed-method isolation: PASS');
console.log('pp113-114 Al-Zanati reference-only: PASS');
console.log('p121 Al-Zanati/al-Layth reference-only: PASS');
console.log('external direct-execution hard-stop: PASS');
