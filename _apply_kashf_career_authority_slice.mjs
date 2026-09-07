import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const methodPath = 'goral-hachol/registry/kashf-canonical-method-registry.js';
const routePath = 'goral-hachol/registry/kashf-question-route-registry.js';
const testPath = '_test_kashf_canonical_routing.mjs';

let methods = fs.readFileSync(methodPath, 'utf8');
let routes = fs.readFileSync(routePath, 'utf8');
let tests = fs.readFileSync(testPath, 'utf8');

const methodMarker = '  // ── REPAIR REQUIRED ----------------------------------------------------';
if (!methods.includes('// ── CAREER + AUTHORITY canonical slice')) {
  const block = `  // ── CAREER + AUTHORITY canonical slice -------------------------------
  'authority.p256.honorConditionH10PlanetAngles': method({
    kashfMethodId: 'authority.p256.honorConditionH10PlanetAngles',
    kashfIntentId: 'authority.honorCondition',
    topicId: 'authorityState',
    sourcePages: [256],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'Body-source honor/status judgment: H10 solar figures indicate strong honor/rank; Jupiter/Venus figures indicate good and completeness; Saturn indicates hardship/lowness. The four angles are corroborating conditions. This is status/honor, not a generic career forecast.',
  }),

  'authority.p256.durationH1H10Movement': method({
    kashfMethodId: 'authority.p256.durationH1H10Movement',
    kashfIntentId: 'authority.duration',
    topicId: 'authorityState',
    sourcePages: [256],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'Body-source duration/stability rule for an appointment: benefic fixed H1/H10 supports continuation; bicorporeal indicates removal then reappointment; mutable indicates removal. It does not calculate months/years.',
  }),

  'career.p266.returnToService': method({
    kashfMethodId: 'career.p266.returnToService',
    kashfIntentId: 'career.returnToOffice',
    topicId: 'authorityState',
    sourcePages: [266],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'legacy-function',
    executorStatus: 'pending',
    legacyTopicId: 'authorityState',
    notes: 'General dismissed-from-service return intent. Existing computeReturnToOfficeKashf is provisionally reusable only after method-scoped isolation and source-trace cleanup. Keep distinct from ruler/governor return p258.',
  }),

  'profession.p254.h9PlanetH10H11': method({
    kashfMethodId: 'profession.p254.h9PlanetH10H11',
    kashfIntentId: 'profession.type',
    topicId: 'authorityState',
    sourcePages: [254],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'legacy-function',
    executorStatus: 'pending',
    legacyTopicId: 'authorityState',
    notes: 'Body-source profession rule: H9 planetary figure determines trade/profession family; H10/H11 benefic figures indicate ease/little toil. Existing computeProfessionH9Kashf appears source-local but remains pending canonical wiring.',
  }),

  'authority.p257.rulerConditionH7H10': method({
    kashfMethodId: 'authority.p257.rulerConditionH7H10',
    kashfIntentId: 'authority.rulerCondition',
    topicId: 'authorityState',
    sourcePages: [257],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'formula',
    executorStatus: 'pending',
    legacyTopicId: 'authorityState',
    notes: 'Body-source ruler-condition method: derive H7+H10; benefic = good condition, malefic = bad. This is not the same intent as whether the ruler remains in office.',
  }),

  'authority.p257.appointmentH1H10Planet': method({
    kashfMethodId: 'authority.p257.appointmentH1H10Planet',
    kashfIntentId: 'authority.appointment',
    topicId: 'authorityState',
    sourcePages: [257],
    kashfRuntimeStatus: 'repair-required',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    legacyTopicId: 'authorityState',
    notes: 'Derive H1+H10. Appointment holds only when the result belongs to Sun/Moon/Jupiter/Venus. Current topic runtime proxies this with benefic/malefic, which is not source-equivalent.',
  }),

`;
  if (!methods.includes(methodMarker)) throw new Error('Method insertion marker not found');
  methods = methods.replace(methodMarker, block + methodMarker);
}

const routeMarker = '  // ── REPAIR REQUIRED: explicit hard stop until fixed -------------------';
if (!routes.includes('// ── AUDITED CAREER + AUTHORITY SLICE')) {
  const block = `  // ── AUDITED CAREER + AUTHORITY SLICE ---------------------------------
  'q-career-state': route({
    questionId: 'q-career-state',
    disposition: 'RENAME',
    kashfIntentId: 'authority.honorCondition',
    kashfMethodId: 'authority.p256.honorConditionH10PlanetAngles',
    kashfRuntimeStatus: 'ready',
    note: 'Source-safe scope is current professional rank/honor/standing. The present wording also asks stability/trend; that belongs to a separate stability/duration intent and must not be merged after the board is cast.',
  }),

  'q-fame': route({
    questionId: 'q-fame',
    disposition: 'RENAME',
    aliasOf: 'q-career-state',
    kashfIntentId: 'authority.honorCondition',
    kashfMethodId: 'authority.p256.honorConditionH10PlanetAngles',
    kashfRuntimeStatus: 'ready',
    note: 'p256 judges honor, rank and public standing. Rename away from a guaranteed future yes/no promise that the name “will become famous”.',
  }),

  'q-position-keep': route({
    questionId: 'q-position-keep',
    disposition: 'KEEP',
    kashfIntentId: 'authority.duration',
    kashfMethodId: 'authority.p256.durationH1H10Movement',
    kashfRuntimeStatus: 'ready',
    note: 'This method answers continuation/removal/reappointment, not a numeric duration.',
  }),

  'q-career-duration': route({
    questionId: 'q-career-duration',
    disposition: 'RENAME',
    aliasOf: 'q-position-keep',
    kashfIntentId: 'authority.duration',
    kashfMethodId: 'authority.p256.durationH1H10Movement',
    kashfRuntimeStatus: 'ready',
    note: 'Current UI asks “how long”. Source method gives continue / removed then reappointed / removed, not months or years. Rename to whether the appointment continues.',
  }),

  'q-career-return': route({
    questionId: 'q-career-return',
    disposition: 'KEEP',
    kashfIntentId: 'career.returnToOffice',
    kashfMethodId: 'career.p266.returnToService',
    kashfRuntimeStatus: 'ready',
    note: 'Use the general p266 dismissed-from-service rule. Do not aggregate with the ruler/governor return rule from p258.',
  }),

  'q-profession': route({
    questionId: 'q-profession',
    disposition: 'RENAME',
    kashfIntentId: 'profession.type',
    kashfMethodId: 'profession.p254.h9PlanetH10H11',
    kashfRuntimeStatus: 'ready',
    note: 'Source identifies profession/trade family from the planetary figure in H9; wording should not promise modern career-fit psychology beyond the source table.',
  }),

  'q-ruler-status': route({
    questionId: 'q-ruler-status',
    disposition: 'RENAME',
    kashfIntentId: 'authority.rulerCondition',
    kashfMethodId: 'authority.p257.rulerConditionH7H10',
    kashfRuntimeStatus: 'ready',
    note: 'Route only the ruler-condition question. Remove the current “will remain in place” promise; remaining in office is the separate authority.duration intent.',
  }),

`;
  if (!routes.includes(routeMarker)) throw new Error('Route insertion marker not found');
  routes = routes.replace(routeMarker, block + routeMarker);
}

const testMarker = '// ── Source-ready is NOT the same as executor-ready -----------------------';
if (!tests.includes('// ── Career/authority source-intent separation')) {
  const block = `// ── Career/authority source-intent separation ---------------------------
const careerDuration = assertRoute('q-career-duration', {
  ok: true,
  canRunKashf: false,
  kashfIntentId: 'authority.duration',
  kashfMethodId: 'authority.p256.durationH1H10Movement',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'pending',
});
const positionKeep = resolveKashfRouteByQuestionId('q-position-keep');
assert(careerDuration.kashfMethodId === positionKeep.kashfMethodId, 'career-duration wording aliases the same non-numeric position-continuation method');
assert(careerDuration.aliasOf === 'q-position-keep', 'career-duration alias is explicit');

const rulerStatus = assertRoute('q-ruler-status', {
  ok: true,
  canRunKashf: false,
  kashfIntentId: 'authority.rulerCondition',
  kashfMethodId: 'authority.p257.rulerConditionH7H10',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'pending',
});
assert(rulerStatus.kashfMethodId !== positionKeep.kashfMethodId, 'ruler condition is not conflated with duration/remaining-in-office');

assertRoute('q-career-return', {
  ok: true,
  canRunKashf: false,
  kashfIntentId: 'career.returnToOffice',
  kashfMethodId: 'career.p266.returnToService',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'pending',
});
assertRoute('q-profession', {
  ok: true,
  canRunKashf: false,
  kashfIntentId: 'profession.type',
  kashfMethodId: 'profession.p254.h9PlanetH10H11',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'pending',
});

`;
  if (!tests.includes(testMarker)) throw new Error('Test insertion marker not found');
  tests = tests.replace(testMarker, block + testMarker);
}

fs.writeFileSync(methodPath, methods);
fs.writeFileSync(routePath, routes);
fs.writeFileSync(testPath, tests);

for (const cmd of [
  ['node', ['_test_kashf_canonical_routing.mjs']],
  ['node', ['_audit_kashf_question_route_coverage.mjs']],
]) {
  const r = spawnSync(cmd[0], cmd[1], { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
