#!/usr/bin/env node
/**
 * _test_kashf_canonical_routing.mjs
 *
 * P0 contract tests for Question -> Kashf Intent -> ONE Canonical Method.
 * Pure registry/router tests: no AI, no network, no board calculation.
 */

import {
  getKashfMethod,
  getCanonicalKashfMethodForIntent,
  canRunKashfMethod,
  validateKashfMethodRegistry,
} from './goral-hachol/registry/kashf-canonical-method-registry.js';
import {
  validateKashfQuestionRoutes,
} from './goral-hachol/registry/kashf-question-route-registry.js';
import {
  resolveKashfRouteByQuestionId,
  requireRunnableKashfRoute,
} from './goral-hachol/engine/kashf-method-router.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed += 1;
  } else {
    failed += 1;
    console.error('FAIL:', message);
  }
}

function assertRoute(questionId, expected) {
  const route = resolveKashfRouteByQuestionId(questionId);
  for (const [key, value] of Object.entries(expected)) {
    assert(route[key] === value, `${questionId}.${key}: expected ${String(value)}, got ${String(route[key])}`);
  }
  return route;
}

// ── Registry invariants ---------------------------------------------------
{
  const result = validateKashfMethodRegistry();
  assert(result.valid, `method registry valid: ${result.errors.join('; ')}`);
}
{
  const result = validateKashfQuestionRoutes(getKashfMethod);
  assert(result.valid, `question route registry valid: ${result.errors.join('; ')}`);
}

assert(
  getCanonicalKashfMethodForIntent('travel.success')?.kashfMethodId === 'travel.p238.assemble1359',
  'travel.success has exactly one canonical method'
);
assert(
  getCanonicalKashfMethodForIntent('completion.willComplete')?.kashfMethodId === 'completion.p173.fireRows15910',
  'completion.willComplete has exactly one canonical method'
);

// ── Acceptance test 1: travel success -----------------------------------
assertRoute('q-travel-safe', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'travel.success',
  kashfMethodId: 'travel.p238.assemble1359',
  kashfRuntimeStatus: 'ready',
});

// ── Acceptance test 2: alias resolves to same exact method ---------------
const travelMain = resolveKashfRouteByQuestionId('q-travel-safe');
const travelAlias = resolveKashfRouteByQuestionId('q-short-travel');
assert(travelAlias.canRunKashf === true, 'q-short-travel is runnable in pilot slice');
assert(travelAlias.kashfIntentId === travelMain.kashfIntentId, 'short travel alias uses same Kashf intent');
assert(travelAlias.kashfMethodId === travelMain.kashfMethodId, 'short travel alias uses same exact canonical method');
assert(travelAlias.aliasOf === 'q-travel-safe', 'short travel alias is documented');

// ── Acceptance test 3: promise is educational-only -----------------------
assertRoute('q-promise', {
  ok: true,
  canRunKashf: false,
  kashfIntentId: 'promise.fulfillment',
  kashfRuntimeStatus: 'educational-only',
  runtimeAllowed: false,
});
assert(!canRunKashfMethod('promise.external.p255'), 'educational promise method can never run');

// ── Acceptance test 4: q-sorcery must NOT trigger p167 ------------------
const sorcery = assertRoute('q-sorcery', {
  ok: true,
  canRunKashf: false,
  kashfIntentId: 'spiritual.affectedBySorcery',
  kashfRuntimeStatus: 'unsupported',
  runtimeAllowed: false,
});
assert(sorcery.kashfMethodId !== 'spiritual.p167.querentActsBySorcery', 'q-sorcery is not mapped to the p167 querent-acts-by-sorcery method');

// ── Acceptance test 5: friends bundle is hard-stopped until isolated -----
assertRoute('q-friends', {
  ok: true,
  canRunKashf: false,
  kashfIntentId: 'friends.relationship',
  kashfMethodId: 'friends.p263.h1h11',
  kashfRuntimeStatus: 'repair-required',
});

// ── Acceptance test 6: stability does not run broad authorityState -------
const stability = assertRoute('q-stability', {
  ok: true,
  canRunKashf: false,
  kashfIntentId: 'state.stability',
  kashfMethodId: 'state.p265.h1h2h9h15',
  kashfRuntimeStatus: 'repair-required',
});
assert(stability.legacyTopicId === 'authorityState', 'legacy topic retained only as migration metadata');

// ── Acceptance test 7: missing alive/dead is isolated --------------------
assertRoute('q-missing-alive', {
  ok: true,
  canRunKashf: false,
  kashfIntentId: 'missing.aliveOrDead',
  kashfMethodId: 'missing.p248.aliveOrDead',
  kashfRuntimeStatus: 'repair-required',
});

// ── Acceptance test 8: runtimeAllowed=false is a hard stop ---------------
for (const qid of ['q-promise', 'q-fear', 'q-sorcery', 'q-sea-voyage', 'q-prisoner', 'q-friends', 'q-stability', 'q-missing-alive']) {
  const route = resolveKashfRouteByQuestionId(qid);
  assert(route.canRunKashf === false, `${qid}: blocked/non-ready route cannot run`);
  let threw = false;
  try {
    requireRunnableKashfRoute(qid);
  } catch (err) {
    threw = err?.code === 'KASHF_ROUTE_BLOCKED';
  }
  assert(threw, `${qid}: requireRunnableKashfRoute hard-stops`);
}

// ── Acceptance test 9/10/11: no hidden fallback --------------------------
const unmapped = resolveKashfRouteByQuestionId('q-not-mapped-on-purpose');
assert(unmapped.ok === false, 'unmapped question is rejected');
assert(unmapped.canRunKashf === false, 'unmapped question cannot run');
assert(unmapped.reason === 'unmapped-question-id', 'unmapped question explains no-fallback reason');
assert(unmapped.kashfMethodId === null, 'unmapped question does not invent a method id');

// Ready method guard itself must be explicit.
assert(canRunKashfMethod('travel.p238.assemble1359') === true, 'ready canonical travel method can run');
assert(canRunKashfMethod('state.p265.h1h2h9h15') === false, 'repair-required method cannot run');
assert(canRunKashfMethod('travel.p242.vehicleSafety') === false, 'blocked-by-source method cannot run');

console.log(`Kashf canonical routing tests: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
