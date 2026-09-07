import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const methodPath = 'goral-hachol/registry/kashf-canonical-method-registry.js';
const routePath = 'goral-hachol/registry/kashf-question-route-registry.js';

let methods = fs.readFileSync(methodPath, 'utf8');
let routes = fs.readFileSync(routePath, 'utf8');

const methodMarker = '  // ── REPAIR REQUIRED ----------------------------------------------------';
if (!methods.includes('// ── CAREER + AUTHORITY canonical slice')) {
  const block = `  // ── CAREER + AUTHORITY canonical slice --------------------------------
  'authority.p256.honorConditionH10Planet': method({
    kashfMethodId: 'authority.p256.honorConditionH10Planet',
    kashfIntentId: 'authority.honorCondition',
    topicId: 'authorityState',
    sourcePages: [256],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'Body-source honor/status rule: judge the figure in the house of honor/authority by its planetary attribution. Sun figures indicate strength of honor/rank; Jupiter or Venus indicate good/completion; Saturn indicates lack of benefit, gloom and distress. This is a condition-of-honor method, not a binary fame prediction.',
  }),

  'authority.p257.appointmentH1H10Planet': method({
    kashfMethodId: 'authority.p257.appointmentH1H10Planet',
    kashfIntentId: 'authority.appointmentStays',
    topicId: 'authorityState',
    sourcePages: [257],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'Body-source question “does the appointment/authority remain?”: derive one figure from H1+H10. If it belongs to the two luminaries (Sun/Moon) or the two benefics (Jupiter/Venus), the appointment remains; otherwise it does not. Must use actual planetary attribution, not a benefic/malefic proxy. It does not calculate a number of months/years.',
  }),

  'authority.p257.rulerConditionH7H10': method({
    kashfMethodId: 'authority.p257.rulerConditionH7H10',
    kashfIntentId: 'authority.rulerCondition',
    topicId: 'authorityState',
    sourcePages: [257],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'Body-source ruler-condition rule: derive a figure from H7+H10; benefic gives a good condition and malefic gives a bad condition. This is distinct from whether an appointment remains.',
  }),

  'career.p266.returnToOffice': method({
    kashfMethodId: 'career.p266.returnToOffice',
    kashfIntentId: 'career.returnToOffice',
    topicId: 'authorityState',
    sourcePages: [266],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'legacy-function',
    executorStatus: 'pending',
    legacyTopicId: 'authorityState',
    notes: 'Body-source rule for one dismissed from service: H1 must be benefic+incoming and connect/appear in H10 or strong houses, with the outcome supporting return. Existing computeReturnToOfficeKashf is only provisionally reusable after the general benefic/malefic classification boundary is closed; it must not run as a broad authorityState supporting check.',
  }),

  'profession.p254.h9Planet': method({
    kashfMethodId: 'profession.p254.h9Planet',
    kashfIntentId: 'profession.type',
    topicId: 'authorityState',
    sourcePages: [254],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'legacy-function',
    executorStatus: 'pending',
    legacyTopicId: 'authorityState',
    notes: 'Body-source profession/craft rule: profession itself is judged by the planetary figure in H9; H10/H11 benefic is only a separate ease-of-work qualifier. Existing computeProfessionH9Kashf already follows this split and may be reused after method-scoped wiring. Source does not claim to optimize a modern “best career fit” from personal preference.',
  }),

`;
  if (!methods.includes(methodMarker)) throw new Error('Method insertion marker not found');
  methods = methods.replace(methodMarker, block + methodMarker);
}

const routeMarker = '  // ── REPAIR REQUIRED: explicit hard stop until fixed -------------------';
if (!routes.includes('// ── AUDITED CAREER + AUTHORITY SLICE')) {
  const block = `  // ── AUDITED CAREER + AUTHORITY SLICE ----------------------------------
  'q-career-state': route({
    questionId: 'q-career-state',
    disposition: 'RENAME',
    aliasOf: 'q-stability',
    kashfIntentId: 'state.stability',
    kashfMethodId: 'state.p265.h1h2h9h15',
    kashfRuntimeStatus: 'repair-required',
    note: 'The current wording mixes broad career condition with trend. Source-safe scope is whether the current professional/role state remains stable; route it to the dedicated state-stability method rather than the authorityState bundle.',
  }),

  'q-position-keep': route({
    questionId: 'q-position-keep',
    disposition: 'KEEP',
    kashfIntentId: 'authority.appointmentStays',
    kashfMethodId: 'authority.p257.appointmentH1H10Planet',
    kashfRuntimeStatus: 'ready',
    note: 'Dedicated p257 body-source question: does the appointment/authority remain? Uses H1+H10 and actual planetary attribution.',
  }),

  'q-career-duration': route({
    questionId: 'q-career-duration',
    disposition: 'RENAME',
    aliasOf: 'q-position-keep',
    kashfIntentId: 'authority.appointmentStays',
    kashfMethodId: 'authority.p257.appointmentH1H10Planet',
    kashfRuntimeStatus: 'ready',
    note: 'The source method answers whether the post continues or ends; it does not calculate how many months/years remain. Rename the UI accordingly.',
  }),

  'q-career-return': route({
    questionId: 'q-career-return',
    disposition: 'KEEP',
    kashfIntentId: 'career.returnToOffice',
    kashfMethodId: 'career.p266.returnToOffice',
    kashfRuntimeStatus: 'ready',
    note: 'Distinct body-source p266 intent for a person dismissed from service. Do not treat it as an alternative vote inside authorityState.',
  }),

  'q-profession': route({
    questionId: 'q-profession',
    disposition: 'RENAME',
    kashfIntentId: 'profession.type',
    kashfMethodId: 'profession.p254.h9Planet',
    kashfRuntimeStatus: 'ready',
    note: 'Source-safe wording concerns the craft/profession indicated by H9 planetary attribution. The current “best profession for me” wording should not imply a modern optimization system.',
  }),

  'q-ruler-status': route({
    questionId: 'q-ruler-status',
    disposition: 'RENAME',
    kashfIntentId: 'authority.rulerCondition',
    kashfMethodId: 'authority.p257.rulerConditionH7H10',
    kashfRuntimeStatus: 'ready',
    note: 'Keep only “what is the ruler/authority-holder condition?”. The current description also asks whether they remain in office, which is a separate appointment-stability intent.',
  }),

  'q-fame': route({
    questionId: 'q-fame',
    disposition: 'RENAME',
    kashfIntentId: 'authority.honorCondition',
    kashfMethodId: 'authority.p256.honorConditionH10Planet',
    kashfRuntimeStatus: 'ready',
    note: 'p256 judges the condition/strength of honor, rank and reputation by the planetary figure in H10. It does not directly promise “will I become famous?”. Rename to a source-safe honor/reputation condition question.',
  }),

`;
  if (!routes.includes(routeMarker)) throw new Error('Route insertion marker not found');
  routes = routes.replace(routeMarker, block + routeMarker);
}

fs.writeFileSync(methodPath, methods);
fs.writeFileSync(routePath, routes);

for (const [cmd, args] of [
  ['node', ['_test_kashf_canonical_routing.mjs']],
  ['node', ['_audit_kashf_question_route_coverage.mjs']],
]) {
  const r = spawnSync(cmd, args, { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
