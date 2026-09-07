import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const methodPath = 'goral-hachol/registry/kashf-canonical-method-registry.js';
const routePath = 'goral-hachol/registry/kashf-question-route-registry.js';
const testPath = '_test_kashf_canonical_routing.mjs';

let methods = fs.readFileSync(methodPath, 'utf8');
let routes = fs.readFileSync(routePath, 'utf8');
let tests = fs.readFileSync(testPath, 'utf8');

const methodMarker = '  // ── REPAIR REQUIRED ----------------------------------------------------';
if (!methods.includes('// ── SPIRITUAL + MISC source-safety slice')) {
  const block = `  // ── SPIRITUAL + MISC source-safety slice -----------------------------
  'spiritual.p167.hiddenActionAirRows46815': method({
    kashfMethodId: 'spiritual.p167.hiddenActionAirRows46815',
    kashfIntentId: 'spiritual.hiddenAction',
    topicId: 'spiritualDiagnostics',
    sourcePages: [167],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'Body-source p167 asks whether there is an action behind the matter: take the air rows of H4,H6,H8 and the balance/judge, form one figure; malefic => an action is behind it, otherwise not. This is covert/hidden action, not a diagnosis that the querent is affected by sorcery, jinn or evil eye.',
  }),

  'religion.p253.h3h9Quality': method({
    kashfMethodId: 'religion.p253.h3h9Quality',
    kashfIntentId: 'religion.religiosity',
    topicId: 'religion',
    sourcePages: [253],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'Body-source religion/righteousness rule: malefic figures in H3 and H9 indicate little religion; benefic figures there indicate religiosity and fear of God. It does not answer broad theological, spiritual-practice or faith-advice questions.',
  }),

  'spiritual.jinnType.unsupported': method({
    kashfMethodId: 'spiritual.jinnType.unsupported',
    kashfIntentId: 'spiritual.jinnType',
    topicId: 'spiritualDiagnostics',
    sourcePages: [167],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'No audited Kashf body method classifies an alleged influence as jinn vs evil eye vs human sorcery. p167 must not be stretched into this diagnosis.',
  }),

  'spiritual.sorcererIdentity.unsupported': method({
    kashfMethodId: 'spiritual.sorcererIdentity.unsupported',
    kashfIntentId: 'spiritual.sorcererIdentity',
    topicId: 'spiritualDiagnostics',
    sourcePages: [167],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'p167 can ask whether the querent acts by sorcery on the quesited person; it does not identify a named sorcerer behind an alleged harm. No identity method is selected.',
  }),

  'spiritual.obsessionCause.unsupported': method({
    kashfMethodId: 'spiritual.obsessionCause.unsupported',
    kashfIntentId: 'spiritual.obsessionCause',
    topicId: 'spiritualDiagnostics',
    sourcePages: [43],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'House symbolism includes worry/waswasa-like meanings, but no audited operational Kashf body rule distinguishes spiritual from psychological causes of anxiety or intrusive thoughts. Do not diagnose by house meaning alone.',
  }),

  'security.external.p235.h8': method({
    kashfMethodId: 'security.external.p235.h8',
    kashfIntentId: 'security.general',
    topicId: 'deathInheritance',
    sourcePages: [235, 236],
    sourceLayer: 'added-from-other-book',
    attributedSourceBook: 'al-Multaqat',
    methodRole: 'educational-only',
    kashfRuntimeStatus: 'educational-only',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The H8 security/fear/longevity/inheritance material is in the explicitly attributed collected/al-Multaqat addition. Keep it in educational knowledge only; never feed a Kashf body verdict.',
  }),

  'social.slander.unsupported': method({
    kashfMethodId: 'social.slander.unsupported',
    kashfIntentId: 'social.slander',
    topicId: 'enemies',
    sourcePages: [43],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Slander/backbiting can appear among house meanings, but no audited operational body-source method has been selected for the UI yes/no/identity question.',
  }),

  'social.twoFaced.unsupported': method({
    kashfMethodId: 'social.twoFaced.unsupported',
    kashfIntentId: 'social.twoFaced',
    topicId: 'enemies',
    sourcePages: [43],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'No audited Kashf body method establishes that a specific person is two-faced/deceptive. General house symbolism is not an operational verdict.',
  }),

  'wronged.status.unsupported': method({
    kashfMethodId: 'wronged.status.unsupported',
    kashfIntentId: 'wronged.status',
    topicId: 'disputes',
    sourcePages: [43],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The wronged/oppressed person occurs in house meanings, but no audited operational Kashf body method has been selected for the broad UI question. Keep blocked rather than infer from house semantics.',
  }),

  'isolation.status.unsupported': method({
    kashfMethodId: 'isolation.status.unsupported',
    kashfIntentId: 'isolation.status',
    topicId: 'enemies',
    sourcePages: [43],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Isolation/confinement meanings of houses do not constitute a dedicated operational method for the broad UI isolation question.',
  }),

`;
  if (!methods.includes(methodMarker)) throw new Error('Method insertion marker not found');
  methods = methods.replace(methodMarker, block + methodMarker);
}

const routeMarker = '  // ── REPAIR REQUIRED: explicit hard stop until fixed -------------------';
if (!routes.includes('// ── AUDITED SPIRITUAL + MISC SLICE')) {
  const block = `  // ── AUDITED SPIRITUAL + MISC SLICE ----------------------------------
  'q-hidden-action': route({
    questionId: 'q-hidden-action',
    disposition: 'KEEP',
    kashfIntentId: 'spiritual.hiddenAction',
    kashfMethodId: 'spiritual.p167.hiddenActionAirRows46815',
    kashfRuntimeStatus: 'ready',
    note: 'Use only the p167 hidden/covert-action question. This route does not diagnose sorcery, jinn or evil eye.',
  }),

  'q-religion': route({
    questionId: 'q-religion',
    disposition: 'RENAME',
    kashfIntentId: 'religion.religiosity',
    kashfMethodId: 'religion.p253.h3h9Quality',
    kashfRuntimeStatus: 'ready',
    note: 'Source-safe wording is the person’s religiosity/righteousness condition. p253 does not answer broad theology, practice advice or spiritual-study questions.',
  }),

  'q-jinn-type': route({
    questionId: 'q-jinn-type',
    disposition: 'BLOCK',
    kashfIntentId: 'spiritual.jinnType',
    kashfMethodId: 'spiritual.jinnType.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'No audited Kashf body method classifies jinn vs eye vs human sorcery.',
  }),

  'q-sorcerer': route({
    questionId: 'q-sorcerer',
    disposition: 'BLOCK',
    kashfIntentId: 'spiritual.sorcererIdentity',
    kashfMethodId: 'spiritual.sorcererIdentity.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'Do not turn p167 “does the querent act by sorcery on the quesited?” into an identity-finding method.',
  }),

  'q-obsession': route({
    questionId: 'q-obsession',
    disposition: 'BLOCK',
    kashfIntentId: 'spiritual.obsessionCause',
    kashfMethodId: 'spiritual.obsessionCause.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'No source-safe Kashf method distinguishes spiritual from psychological causes of anxiety/intrusive thoughts.',
  }),

  'q-security-h8': route({
    questionId: 'q-security-h8',
    disposition: 'EDUCATIONAL',
    kashfIntentId: 'security.general',
    kashfMethodId: 'security.external.p235.h8',
    kashfRuntimeStatus: 'educational-only',
    note: 'The mapped H8 security/fear material is explicitly from the added al-Multaqat/collected point-lore layer.',
  }),

  'q-slander': route({
    questionId: 'q-slander',
    disposition: 'BLOCK',
    kashfIntentId: 'social.slander',
    kashfMethodId: 'social.slander.unsupported',
    kashfRuntimeStatus: 'unsupported',
  }),

  'q-two-faced': route({
    questionId: 'q-two-faced',
    disposition: 'BLOCK',
    kashfIntentId: 'social.twoFaced',
    kashfMethodId: 'social.twoFaced.unsupported',
    kashfRuntimeStatus: 'unsupported',
  }),

  'q-wronged': route({
    questionId: 'q-wronged',
    disposition: 'BLOCK',
    kashfIntentId: 'wronged.status',
    kashfMethodId: 'wronged.status.unsupported',
    kashfRuntimeStatus: 'unsupported',
  }),

  'q-isolation': route({
    questionId: 'q-isolation',
    disposition: 'BLOCK',
    kashfIntentId: 'isolation.status',
    kashfMethodId: 'isolation.status.unsupported',
    kashfRuntimeStatus: 'unsupported',
  }),

`;
  if (!routes.includes(routeMarker)) throw new Error('Route insertion marker not found');
  routes = routes.replace(routeMarker, block + routeMarker);
}

const testMarker = '// ── Acceptance test 8: runtimeAllowed=false is a hard stop ---------------';
if (!tests.includes('// ── Spiritual/misc source-boundary checks')) {
  const block = `// ── Spiritual/misc source-boundary checks -------------------------------
assertRoute('q-hidden-action', {
  ok: true,
  canRunKashf: false,
  kashfIntentId: 'spiritual.hiddenAction',
  kashfMethodId: 'spiritual.p167.hiddenActionAirRows46815',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'pending',
});
assertRoute('q-religion', {
  ok: true,
  canRunKashf: false,
  kashfIntentId: 'religion.religiosity',
  kashfMethodId: 'religion.p253.h3h9Quality',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'pending',
});
for (const qid of ['q-jinn-type', 'q-sorcerer', 'q-obsession', 'q-slander', 'q-two-faced', 'q-wronged', 'q-isolation']) {
  const r = resolveKashfRouteByQuestionId(qid);
  assert(r.ok === true, qid + ': explicit route exists');
  assert(r.canRunKashf === false, qid + ': unsupported source scope cannot run');
  assert(r.kashfRuntimeStatus === 'unsupported', qid + ': explicitly marked unsupported');
}
const securityH8 = resolveKashfRouteByQuestionId('q-security-h8');
assert(securityH8.kashfRuntimeStatus === 'educational-only', 'q-security-h8 remains external/educational');
assert(securityH8.canRunKashf === false, 'q-security-h8 cannot feed live Kashf verdict');
assert(resolveKashfRouteByQuestionId('q-sorcery').kashfMethodId !== 'spiritual.p167.hiddenActionAirRows46815', 'q-sorcery cannot fall into p167 hidden-action method');

`;
  if (!tests.includes(testMarker)) throw new Error('Test insertion marker not found');
  tests = tests.replace(testMarker, block + testMarker);
}

fs.writeFileSync(methodPath, methods);
fs.writeFileSync(routePath, routes);
fs.writeFileSync(testPath, tests);

for (const [cmd, args] of [
  ['node', ['_test_kashf_canonical_routing.mjs']],
  ['node', ['_audit_kashf_question_route_coverage.mjs']],
]) {
  const r = spawnSync(cmd, args, { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
