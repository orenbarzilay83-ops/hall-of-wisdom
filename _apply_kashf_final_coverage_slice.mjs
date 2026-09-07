import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const methodPath = 'goral-hachol/registry/kashf-canonical-method-registry.js';
const routePath = 'goral-hachol/registry/kashf-question-route-registry.js';
const testPath = '_test_kashf_canonical_routing.mjs';

let methods = fs.readFileSync(methodPath, 'utf8');
let routes = fs.readFileSync(routePath, 'utf8');
let tests = fs.readFileSync(testPath, 'utf8');

const methodMarker = '  // ── REPAIR REQUIRED ----------------------------------------------------';
if (!methods.includes('// ── FINAL QUESTION-BANK COVERAGE slice')) {
  const block = `  // ── FINAL QUESTION-BANK COVERAGE slice -------------------------------
  'agriculture.mixedScope.unsupported': method({
    kashfMethodId: 'agriculture.mixedScope.unsupported',
    kashfIntentId: 'agriculture.mixedScope',
    topicId: 'yearlyForecast',
    sourcePages: [184, 222],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The UI mixes crop yield, irrigation and land ownership. Kashf body p184 treats land/property structure, while agriculture/yield material mapped at p222 belongs to the Nuzhat addition. Split the question before any operational method is selected.',
  }),

  'family.fatherPropertyMixedScope.unsupported': method({
    kashfMethodId: 'family.fatherPropertyMixedScope.unsupported',
    kashfIntentId: 'family.fatherPropertyMixedScope',
    topicId: 'parentsProperty',
    sourcePages: [184],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'p184 contains distinct rules for father condition and for property/house/land. The current UI merges father health, house and land into one question, so it must be split rather than routed to one verdict.',
  }),

  'direction.generic.unsupported': method({
    kashfMethodId: 'direction.generic.unsupported',
    kashfIntentId: 'direction.generic',
    topicId: 'generalReading',
    sourcePages: [117, 188, 246],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Kashf contains several domain-specific direction systems with different provenance and inputs. No single body-source generic direction method is selected for every question.',
  }),

  'helpers.generic.unsupported': method({
    kashfMethodId: 'helpers.generic.unsupported',
    kashfIntentId: 'helpers.findHelp',
    topicId: 'completion',
    sourcePages: [176],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'p176 contains servant/service material, but no audited canonical body method has been selected for the broad modern question “will I find someone to help me?”. Do not generalize servant rules automatically.',
  }),

  'illness.causeMixedScope.unsupported': method({
    kashfMethodId: 'illness.causeMixedScope.unsupported',
    kashfIntentId: 'illness.causeMixedScope',
    topicId: 'illness',
    sourcePages: [197],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'p197 classifies humoral/elemental illness nature. It does not provide a verified modern physical-vs-emotional-vs-environmental cause classifier. Keep the broader cause question blocked.',
  }),

  'illness.p197.h1h8ElementHumor': method({
    kashfMethodId: 'illness.p197.h1h8ElementHumor',
    kashfIntentId: 'illness.humor',
    topicId: 'illness',
    sourcePages: [197],
    kashfRuntimeStatus: 'repair-required',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    legacyTopicId: 'illness',
    notes: 'Canonical body-source humor rule requires H1 and H8 to be of the same element: water => cold/moist illness; earth => black bile; fire => yellow bile; air => winds/air-related condition. Existing legacy handling is not source-equivalent and must be repaired before execution.',
  }),

  'money.loseFortune.unsupported': method({
    kashfMethodId: 'money.loseFortune.unsupported',
    kashfIntentId: 'money.loseFortune',
    topicId: 'money',
    sourcePages: [179, 223],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'No single audited body-source canonical method is selected for the broad question of losing one’s fortune. p223 loss/profit material is in an added/Nuzhat context and is not a body fallback.',
  }),

  'nativity.birthDate.unsupported': method({
    kashfMethodId: 'nativity.birthDate.unsupported',
    kashfIntentId: 'nativity.birthDate',
    topicId: 'generalReading',
    sourcePages: [],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'No audited Kashf canonical method has been selected for deriving a complete fate reading from a birth date alone.',
  }),

  'social.neighbor.unsupported': method({
    kashfMethodId: 'social.neighbor.unsupported',
    kashfIntentId: 'social.neighborState',
    topicId: 'siblings',
    sourcePages: [182],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The selected p182 siblings method is not automatically a neighbor method. No separate audited canonical rule for the broad neighbor question is selected.',
  }),

  'authority.officialDocs.unsupported': method({
    kashfMethodId: 'authority.officialDocs.unsupported',
    kashfIntentId: 'authority.officialDocs',
    topicId: 'authorityState',
    sourcePages: [256, 257],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The audited authority chapter covers honor, appointments, rulers and return to service. It does not provide a selected body-source method for modern visa/license/contract approval.',
  }),

  'general.pastEvents.unsupported': method({
    kashfMethodId: 'general.pastEvents.unsupported',
    kashfIntentId: 'general.pastEvents',
    topicId: 'generalReading',
    sourcePages: [],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'No audited Kashf canonical method has been selected for reconstructing arbitrary past events from a generic question.',
  }),

  'family.relativeState.unsupported': method({
    kashfMethodId: 'family.relativeState.unsupported',
    kashfIntentId: 'family.relativeState',
    topicId: 'siblings',
    sourcePages: [182],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The canonical p182 sibling method is source-specific to siblings and must not be expanded to every in-law, uncle, relative or neighbor without an explicit source rule.',
  }),

  'separation.mixedScope.unsupported': method({
    kashfMethodId: 'separation.mixedScope.unsupported',
    kashfIntentId: 'separation.mixedScope',
    topicId: 'generalReading',
    sourcePages: [183, 211],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The current UI mixes separation from a person, a place and a relationship. Kashf has distinct relocation and marriage-dissolution methods; no universal separation method should be inferred.',
  }),

  'separation.loved.unsupported': method({
    kashfMethodId: 'separation.loved.unsupported',
    kashfIntentId: 'separation.lovedPerson',
    topicId: 'marriage',
    sourcePages: [205, 211, 264],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Love and marriage passages do not yield a selected universal canonical method for whether separation from a loved person is final. Do not substitute marriage divorce or friendship alternatives automatically.',
  }),

  'stalled.cause.unsupported': method({
    kashfMethodId: 'stalled.cause.unsupported',
    kashfIntentId: 'stalled.cause',
    topicId: 'generalReading',
    sourcePages: [],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'No audited Kashf canonical method has been selected for diagnosing the general cause of “why is everything stuck?”. Keep this broad causal question blocked.',
  }),

  'stranger.description.unresolved': method({
    kashfMethodId: 'stranger.description.unresolved',
    kashfIntentId: 'stranger.description',
    topicId: 'generalReading',
    sourcePages: [68, 69, 71, 72, 74, 76, 77, 79, 81, 82, 85, 86, 88, 89, 91, 93],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Kashf contains detailed figure descriptions, but a source-safe operational rule selecting which figure/house describes an arbitrary unknown stranger has not been closed. Do not turn the descriptive corpus into a generic identity engine by inference.',
  }),

`;
  if (!methods.includes(methodMarker)) throw new Error('Method insertion marker not found');
  methods = methods.replace(methodMarker, block + methodMarker);
}

const routeMarker = '  // ── REPAIR REQUIRED: explicit hard stop until fixed -------------------';
if (!routes.includes('// ── FINAL AUDITED QUESTION-BANK COVERAGE SLICE')) {
  const block = `  // ── FINAL AUDITED QUESTION-BANK COVERAGE SLICE -----------------------
  'q-agriculture': route({
    questionId: 'q-agriculture',
    disposition: 'SPLIT',
    kashfIntentId: 'agriculture.mixedScope',
    kashfMethodId: 'agriculture.mixedScope.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'Split crop/yield, irrigation and land ownership. The source uses different layers/methods for these and the agriculture-year material is Nuzhat.',
  }),

  'q-father': route({
    questionId: 'q-father',
    disposition: 'SPLIT',
    kashfIntentId: 'family.fatherPropertyMixedScope',
    kashfMethodId: 'family.fatherPropertyMixedScope.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'p184 separates father condition from property/house/land. The current combined question cannot have one canonical verdict.',
  }),

  'q-geo-direction': route({
    questionId: 'q-geo-direction',
    disposition: 'BLOCK',
    kashfIntentId: 'direction.generic',
    kashfMethodId: 'direction.generic.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'No single generic direction method covers every intent; direction must remain method/domain specific.',
  }),

  'q-helpers': route({
    questionId: 'q-helpers',
    disposition: 'BLOCK',
    kashfIntentId: 'helpers.findHelp',
    kashfMethodId: 'helpers.generic.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'Do not generalize servant/service material into a universal helper-finding verdict.',
  }),

  'q-illness-cause': route({
    questionId: 'q-illness-cause',
    disposition: 'BLOCK',
    kashfIntentId: 'illness.causeMixedScope',
    kashfMethodId: 'illness.causeMixedScope.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'The source humor rule is not a physical/emotional/environmental diagnostic classifier.',
  }),

  'q-illness-type': route({
    questionId: 'q-illness-type',
    disposition: 'KEEP',
    kashfIntentId: 'illness.humor',
    kashfMethodId: 'illness.p197.h1h8ElementHumor',
    kashfRuntimeStatus: 'repair-required',
    note: 'Use the p197 H1+H8 elemental/humoral classification only. It does not itself prescribe treatment.',
  }),

  'q-lose-fortune': route({
    questionId: 'q-lose-fortune',
    disposition: 'BLOCK',
    kashfIntentId: 'money.loseFortune',
    kashfMethodId: 'money.loseFortune.unsupported',
    kashfRuntimeStatus: 'unsupported',
  }),

  'q-nativity': route({
    questionId: 'q-nativity',
    disposition: 'BLOCK',
    kashfIntentId: 'nativity.birthDate',
    kashfMethodId: 'nativity.birthDate.unsupported',
    kashfRuntimeStatus: 'unsupported',
  }),

  'q-neighbor': route({
    questionId: 'q-neighbor',
    disposition: 'BLOCK',
    kashfIntentId: 'social.neighborState',
    kashfMethodId: 'social.neighbor.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'Do not reuse the p182 sibling method for a neighbor.',
  }),

  'q-official-docs': route({
    questionId: 'q-official-docs',
    disposition: 'BLOCK',
    kashfIntentId: 'authority.officialDocs',
    kashfMethodId: 'authority.officialDocs.unsupported',
    kashfRuntimeStatus: 'unsupported',
  }),

  'q-past-events': route({
    questionId: 'q-past-events',
    disposition: 'BLOCK',
    kashfIntentId: 'general.pastEvents',
    kashfMethodId: 'general.pastEvents.unsupported',
    kashfRuntimeStatus: 'unsupported',
  }),

  'q-relative-state': route({
    questionId: 'q-relative-state',
    disposition: 'BLOCK',
    kashfIntentId: 'family.relativeState',
    kashfMethodId: 'family.relativeState.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'Do not expand the siblings method to arbitrary relatives/in-laws.',
  }),

  'q-separation': route({
    questionId: 'q-separation',
    disposition: 'SPLIT',
    kashfIntentId: 'separation.mixedScope',
    kashfMethodId: 'separation.mixedScope.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'Split person/relationship separation from place/relocation; no universal separation method.',
  }),

  'q-separation-loved': route({
    questionId: 'q-separation-loved',
    disposition: 'BLOCK',
    kashfIntentId: 'separation.lovedPerson',
    kashfMethodId: 'separation.loved.unsupported',
    kashfRuntimeStatus: 'unsupported',
  }),

  'q-stalled': route({
    questionId: 'q-stalled',
    disposition: 'BLOCK',
    kashfIntentId: 'stalled.cause',
    kashfMethodId: 'stalled.cause.unsupported',
    kashfRuntimeStatus: 'unsupported',
  }),

  'q-stranger-desc': route({
    questionId: 'q-stranger-desc',
    disposition: 'BLOCK',
    kashfIntentId: 'stranger.description',
    kashfMethodId: 'stranger.description.unresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    note: 'Figure descriptions exist, but the operational selector for an arbitrary stranger is not source-closed.',
  }),

`;
  if (!routes.includes(routeMarker)) throw new Error('Route insertion marker not found');
  routes = routes.replace(routeMarker, block + routeMarker);
}

const testMarker = '// ── Acceptance test 8: runtimeAllowed=false is a hard stop ---------------';
if (!tests.includes('// ── Final question-bank coverage checks')) {
  const block = `// ── Final question-bank coverage checks ---------------------------------
assertRoute('q-illness-type', {
  ok: true,
  canRunKashf: false,
  kashfIntentId: 'illness.humor',
  kashfMethodId: 'illness.p197.h1h8ElementHumor',
  kashfRuntimeStatus: 'repair-required',
});
for (const qid of [
  'q-agriculture','q-father','q-geo-direction','q-helpers','q-illness-cause',
  'q-lose-fortune','q-nativity','q-neighbor','q-official-docs','q-past-events',
  'q-relative-state','q-separation','q-separation-loved','q-stalled'
]) {
  const r = resolveKashfRouteByQuestionId(qid);
  assert(r.ok === true, qid + ': explicit final-coverage route exists');
  assert(r.canRunKashf === false, qid + ': unsupported/mixed scope hard-stops');
  assert(r.kashfRuntimeStatus === 'unsupported', qid + ': unsupported status is explicit');
}
assertRoute('q-stranger-desc', {
  ok: true,
  canRunKashf: false,
  kashfRuntimeStatus: 'blocked-by-source',
  kashfMethodId: 'stranger.description.unresolved',
});

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
