import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const methodPath = 'goral-hachol/registry/kashf-canonical-method-registry.js';
const routePath = 'goral-hachol/registry/kashf-question-route-registry.js';
const testPath = '_test_kashf_canonical_routing.mjs';
const auditPath = '_audit_kashf_question_route_coverage.mjs';

let methods = fs.readFileSync(methodPath, 'utf8');
let routes = fs.readFileSync(routePath, 'utf8');
let tests = fs.readFileSync(testPath, 'utf8');
let audit = fs.readFileSync(auditPath, 'utf8');

const methodMarker = '  // ── REPAIR REQUIRED ----------------------------------------------------';
if (!methods.includes('// ── FINAL EXPLICIT ROUTING COVERAGE slice')) {
  const block = `  // ── FINAL EXPLICIT ROUTING COVERAGE slice ----------------------------
  'spiritual.p167.hiddenActionAirRows46815': method({
    kashfMethodId: 'spiritual.p167.hiddenActionAirRows46815',
    kashfIntentId: 'spiritual.hiddenAction',
    topicId: 'spiritualDiagnostics',
    sourcePages: [167],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'Body-source hidden-action method: take the AIR rows of H4, H6, H8 and the balance/judge and form one figure; malefic means an action is behind the matter, otherwise not. This is not the separate p167 sorcery method, which uses fire rows and asks whether the querent acts by sorcery on the quesited person.',
  }),

  'illness.p202.humorElementMajority': method({
    kashfMethodId: 'illness.p202.humorElementMajority',
    kashfIntentId: 'illness.humor',
    topicId: 'illness',
    sourcePages: [202],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'Explicit body-source humoral method: count fire/air/water/earth; the most numerous element is the originating humor — fire=yellow bile, air=blood, water=phlegm, earth=black bile. Majority here is source-internal to this ONE method and is not cross-method voting.',
  }),

  'religion.p253.h3h9': method({
    kashfMethodId: 'religion.p253.h3h9',
    kashfIntentId: 'religion.religiosity',
    topicId: 'religion',
    sourcePages: [253],
    kashfRuntimeStatus: 'repair-required',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'Body-source religiosity/piety judgment uses H3 and H9: malefic there indicates little religion; benefic indicates religion and fear of God. Current broader religion handling must not add a majority heuristic or answer general faith/counseling questions.',
  }),

  'danger.deathRisk.unresolved': method({
    kashfMethodId: 'danger.deathRisk.unresolved',
    kashfIntentId: 'danger.deathRisk',
    topicId: 'deathInheritance',
    sourcePages: [196, 197, 198, 199, 200, 201, 202, 203],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The UI question combines accident, severe illness, disaster and generic death danger. Kashf contains several distinct illness/life-death signs and the complex KDF-013 path remains blocked. No single canonical method is selected for this broad mixed question.',
  }),

  'agriculture.mixedScope.unsupported': method({
    kashfMethodId: 'agriculture.mixedScope.unsupported',
    kashfIntentId: 'agriculture.mixedScope',
    topicId: 'yearlyForecast',
    sourcePages: [221, 222],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The UI combines crop yield, irrigation and land ownership. Year/rain/crop material exists in later additions, including Nuzhat, but no one body-source canonical method covers this mixed question. Split before any future selection.',
  }),

  'parents.mixedFatherHouseLand.unsupported': method({
    kashfMethodId: 'parents.mixedFatherHouseLand.unsupported',
    kashfIntentId: 'parents.mixedScope',
    topicId: 'parentsProperty',
    sourcePages: [184, 185],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The UI merges father health, house condition and land/property into one question. These are not one canonical source intent; split them instead of routing all to H4 symbolism.',
  }),

  'direction.genericMixedScope.unsupported': method({
    kashfMethodId: 'direction.genericMixedScope.unsupported',
    kashfIntentId: 'direction.genericMixedScope',
    topicId: 'generalReading',
    sourcePages: [185, 187, 225, 240, 246, 249, 250],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Kashf has different direction methods for different intents (hidden thing, theft, travel, absent person, etc.). A generic “where is the thing/person/matter?” direction question cannot safely use one universal direction formula.',
  }),

  'helpers.general.unsupported': method({
    kashfMethodId: 'helpers.general.unsupported',
    kashfIntentId: 'helpers.general',
    topicId: 'completion',
    sourcePages: [43, 52, 176],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Helpers/assistants appear among house significations and specific passages, but no audited one-method body rule has been selected for the broad question “will I find help?”. House meaning alone is not an operational method.',
  }),

  'illness.causeModernCategories.unsupported': method({
    kashfMethodId: 'illness.causeModernCategories.unsupported',
    kashfIntentId: 'illness.causeModernCategories',
    topicId: 'illness',
    sourcePages: [197, 202, 203],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The UI promises a physical/emotional/environmental root cause. The audited source supports humoral/elemental classifications and other illness rules, not this modern three-way causation model. Do not translate one into the other.',
  }),

  'socialIsolation.unsupported': method({
    kashfMethodId: 'socialIsolation.unsupported',
    kashfIntentId: 'socialIsolation.outcome',
    topicId: 'illness',
    sourcePages: [43, 52],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Isolation/separation from people occurs in house significations, but no audited operational method was selected for whether a person’s social isolation will pass.',
  }),

  'spiritual.jinnType.unsupported': method({
    kashfMethodId: 'spiritual.jinnType.unsupported',
    kashfIntentId: 'spiritual.jinnType',
    topicId: 'spiritualDiagnostics',
    sourcePages: [63, 167],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The source classifies some figures as associated with impurity of jinn/humans and has a separate sorcery-action rule, but no audited canonical method identifies “jinn vs evil eye vs human sorcery” for the client. Do not synthesize such a diagnosis.',
  }),

  'fortuneLoss.mixedScope.unsupported': method({
    kashfMethodId: 'fortuneLoss.mixedScope.unsupported',
    kashfIntentId: 'fortuneLoss.mixedScope',
    topicId: 'deathInheritance',
    sourcePages: [43, 51, 52],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The UI mixes loss of property, luck and social status. These are separate source domains and cannot be answered by one H8 fallback.',
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
    notes: 'No audited Kashf body method has been selected for a birth-date-based natal character/talent/life-destiny reading. Do not infer one from general house or figure descriptions.',
  }),

  'neighbor.general.unsupported': method({
    kashfMethodId: 'neighbor.general.unsupported',
    kashfIntentId: 'neighbor.general',
    topicId: 'siblings',
    sourcePages: [43, 48],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Neighbor is a house signification, but the audited sibling method is not generalized to neighbors. No one canonical neighbor-condition method is selected.',
  }),

  'spiritual.obsessionCause.unsupported': method({
    kashfMethodId: 'spiritual.obsessionCause.unsupported',
    kashfIntentId: 'spiritual.obsessionCause',
    topicId: 'spiritualDiagnostics',
    sourcePages: [52],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Waswasa/confusion appear as H12 significations. That does not establish an operational method for deciding spiritual versus psychological cause.',
  }),

  'officialDocs.approval.unsupported': method({
    kashfMethodId: 'officialDocs.approval.unsupported',
    kashfIntentId: 'officialDocs.approval',
    topicId: 'authorityState',
    sourcePages: [43, 47, 51],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Government writings/documents are house significations, but no audited canonical method was selected for approval of a visa, license, contract or permit. Do not route this through appointment/authority formulas.',
  }),

  'pastEvents.generic.unsupported': method({
    kashfMethodId: 'pastEvents.generic.unsupported',
    kashfIntentId: 'pastEvents.generic',
    topicId: 'completion',
    sourcePages: [43, 45],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Cadent houses and some house definitions signify the past, but no audited canonical reconstruction method was selected for the broad UI promise “what happened in the past?”.',
  }),

  'relatives.nonSibling.unsupported': method({
    kashfMethodId: 'relatives.nonSibling.unsupported',
    kashfIntentId: 'relatives.nonSibling',
    topicId: 'siblings',
    sourcePages: [43, 182],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The canonical H1+H3 sibling method must not be generalized to son-in-law, mother-in-law, uncle or other relatives merely because they share a family category in the UI.',
  }),

  'separation.genericMixedScope.unsupported': method({
    kashfMethodId: 'separation.genericMixedScope.unsupported',
    kashfIntentId: 'separation.genericMixedScope',
    topicId: 'siblings',
    sourcePages: [43, 48, 52, 211],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The UI mixes separation from a person, place and relationship. Kashf treats different separation contexts differently; no one canonical generic-separation method is selected.',
  }),

  'separation.loved.unsupported': method({
    kashfMethodId: 'separation.loved.unsupported',
    kashfIntentId: 'separation.loved',
    topicId: 'marriage',
    sourcePages: [43, 48, 211],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: '“Separation of loved ones” is a house signification and marriage has its own dissolution method, but no audited canonical method covers every non-marital loved-person separation as final vs temporary.',
  }),

  'slander.unsupported': method({
    kashfMethodId: 'slander.unsupported',
    kashfIntentId: 'slander.exists',
    topicId: 'enemies',
    sourcePages: [52],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Slander/gossip is listed among H12 significations. That noun alone is not an operational yes/no or identity method.',
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
    notes: 'p167 asks whether the querent performs sorcery on the quesited person. It does not provide a verified method for identifying the real-world person supposedly behind harm.',
  }),

  'stalled.cause.unsupported': method({
    kashfMethodId: 'stalled.cause.unsupported',
    kashfIntentId: 'stalled.cause',
    topicId: 'fear',
    sourcePages: [52],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Delay, complexity and what does not complete are H12 significations. No audited canonical cause-finding method was selected for why an arbitrary matter is stalled.',
  }),

  'stranger.description.unsupported': method({
    kashfMethodId: 'stranger.description.unsupported',
    kashfIntentId: 'stranger.description',
    topicId: 'marriage',
    sourcePages: [43, 49],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Person/appearance descriptions exist throughout figure lore, but no audited one-method canonical procedure was selected for a completely unknown stranger’s appearance, character, profession and relation all at once.',
  }),

  'twoFaced.identity.unsupported': method({
    kashfMethodId: 'twoFaced.identity.unsupported',
    kashfIntentId: 'twoFaced.identity',
    topicId: 'enemies',
    sourcePages: [52],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Two-faced/two-tongued people are H12 significations. No audited canonical identity method was selected for finding which real person fits that description.',
  }),

  'wronged.veracity.unsupported': method({
    kashfMethodId: 'wronged.veracity.unsupported',
    kashfIntentId: 'wronged.veracity',
    topicId: 'disputes',
    sourcePages: [43, 49, 212],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Oppressed/wronged persons are house significations and disputes have outcome/reconciliation rules, but no audited canonical method determines the factual/legal truth of “was I wronged?”.',
  }),

`;
  if (!methods.includes(methodMarker)) throw new Error('Method insertion marker not found');
  methods = methods.replace(methodMarker, block + methodMarker);
}

const routeMarker = '  // ── REPAIR REQUIRED: explicit hard stop until fixed -------------------';
if (!routes.includes('// ── FINAL EXPLICIT ROUTING COVERAGE')) {
  const block = `  // ── FINAL EXPLICIT ROUTING COVERAGE ----------------------------------
  'q-agriculture': route({ questionId: 'q-agriculture', disposition: 'SPLIT', kashfIntentId: 'agriculture.mixedScope', kashfMethodId: 'agriculture.mixedScope.unsupported', kashfRuntimeStatus: 'unsupported', note: 'Split yield, irrigation and land-ownership intents; do not route the broad bundle to Nuzhat/yearly material.' }),
  'q-father': route({ questionId: 'q-father', disposition: 'SPLIT', kashfIntentId: 'parents.mixedScope', kashfMethodId: 'parents.mixedFatherHouseLand.unsupported', kashfRuntimeStatus: 'unsupported', note: 'Current wording mixes father health, house and land/property; these require distinct intents.' }),
  'q-geo-direction': route({ questionId: 'q-geo-direction', disposition: 'SPLIT', kashfIntentId: 'direction.genericMixedScope', kashfMethodId: 'direction.genericMixedScope.unsupported', kashfRuntimeStatus: 'unsupported', note: 'Direction must be intent-specific (hidden object, theft, travel, absent person, etc.); no universal direction formula.' }),
  'q-helpers': route({ questionId: 'q-helpers', disposition: 'BLOCK', kashfIntentId: 'helpers.general', kashfMethodId: 'helpers.general.unsupported', kashfRuntimeStatus: 'unsupported', note: 'House signification is not enough to create an operational helper-finding method.' }),
  'q-hidden-action': route({ questionId: 'q-hidden-action', disposition: 'KEEP', kashfIntentId: 'spiritual.hiddenAction', kashfMethodId: 'spiritual.p167.hiddenActionAirRows46815', kashfRuntimeStatus: 'ready', note: 'Exact p167 hidden-action method uses AIR rows H4/H6/H8/balance. Keep separate from the fire-row sorcery question.' }),
  'q-illness-cause': route({ questionId: 'q-illness-cause', disposition: 'BLOCK', kashfIntentId: 'illness.causeModernCategories', kashfMethodId: 'illness.causeModernCategories.unsupported', kashfRuntimeStatus: 'unsupported', note: 'Source humoral/elemental classification is not equivalent to the UI promise physical/emotional/environmental cause.' }),
  'q-illness-type': route({ questionId: 'q-illness-type', disposition: 'KEEP', kashfIntentId: 'illness.humor', kashfMethodId: 'illness.p202.humorElementMajority', kashfRuntimeStatus: 'ready', note: 'Use the explicit p202 four-element majority rule only; do not aggregate with other illness methods.' }),
  'q-isolation': route({ questionId: 'q-isolation', disposition: 'BLOCK', kashfIntentId: 'socialIsolation.outcome', kashfMethodId: 'socialIsolation.unsupported', kashfRuntimeStatus: 'unsupported' }),
  'q-jinn-type': route({ questionId: 'q-jinn-type', disposition: 'BLOCK', kashfIntentId: 'spiritual.jinnType', kashfMethodId: 'spiritual.jinnType.unsupported', kashfRuntimeStatus: 'unsupported', note: 'No verified canonical client-diagnostic method distinguishes jinn / evil eye / human sorcery.' }),
  'q-lose-fortune': route({ questionId: 'q-lose-fortune', disposition: 'SPLIT', kashfIntentId: 'fortuneLoss.mixedScope', kashfMethodId: 'fortuneLoss.mixedScope.unsupported', kashfRuntimeStatus: 'unsupported', note: 'Split property loss, luck and status; do not use one H8 fallback.' }),
  'q-nativity': route({ questionId: 'q-nativity', disposition: 'BLOCK', kashfIntentId: 'nativity.birthDate', kashfMethodId: 'nativity.birthDate.unsupported', kashfRuntimeStatus: 'unsupported', note: 'No audited birth-date natal method selected from Kashf.' }),
  'q-neighbor': route({ questionId: 'q-neighbor', disposition: 'BLOCK', kashfIntentId: 'neighbor.general', kashfMethodId: 'neighbor.general.unsupported', kashfRuntimeStatus: 'unsupported', note: 'Do not generalize the canonical sibling method to neighbors.' }),
  'q-obsession': route({ questionId: 'q-obsession', disposition: 'BLOCK', kashfIntentId: 'spiritual.obsessionCause', kashfMethodId: 'spiritual.obsessionCause.unsupported', kashfRuntimeStatus: 'unsupported', note: 'H12 mentions waswasa; that is not a spiritual-vs-psychological diagnosis method.' }),
  'q-official-docs': route({ questionId: 'q-official-docs', disposition: 'BLOCK', kashfIntentId: 'officialDocs.approval', kashfMethodId: 'officialDocs.approval.unsupported', kashfRuntimeStatus: 'unsupported', note: 'Do not infer visa/license/contract approval from house meanings or authority appointment formulas.' }),
  'q-past-events': route({ questionId: 'q-past-events', disposition: 'BLOCK', kashfIntentId: 'pastEvents.generic', kashfMethodId: 'pastEvents.generic.unsupported', kashfRuntimeStatus: 'unsupported', note: 'Past-signifying houses are not a complete reconstruction method.' }),
  'q-relative-state': route({ questionId: 'q-relative-state', disposition: 'BLOCK', kashfIntentId: 'relatives.nonSibling', kashfMethodId: 'relatives.nonSibling.unsupported', kashfRuntimeStatus: 'unsupported', note: 'Do not generalize H1+H3 sibling judgment to all relatives.' }),
  'q-religion': route({ questionId: 'q-religion', disposition: 'RENAME', kashfIntentId: 'religion.religiosity', kashfMethodId: 'religion.p253.h3h9', kashfRuntimeStatus: 'repair-required', note: 'Source-safe scope is level/condition of religiosity/piety from H3/H9, not general faith counseling or religious study advice.' }),
  'q-security-h8': route({ questionId: 'q-security-h8', disposition: 'BLOCK', kashfIntentId: 'danger.deathRisk', kashfMethodId: 'danger.deathRisk.unresolved', kashfRuntimeStatus: 'blocked-by-source', note: 'Broad accident/illness/disaster/death-danger scope has no one canonical method selected; KDF-013 remains blocked.' }),
  'q-separation': route({ questionId: 'q-separation', disposition: 'SPLIT', kashfIntentId: 'separation.genericMixedScope', kashfMethodId: 'separation.genericMixedScope.unsupported', kashfRuntimeStatus: 'unsupported', note: 'Split person/place/relationship separation; no universal separation method.' }),
  'q-separation-loved': route({ questionId: 'q-separation-loved', disposition: 'BLOCK', kashfIntentId: 'separation.loved', kashfMethodId: 'separation.loved.unsupported', kashfRuntimeStatus: 'unsupported', note: 'House signification “separation of loved ones” is not itself a final-vs-temporary operational method.' }),
  'q-slander': route({ questionId: 'q-slander', disposition: 'BLOCK', kashfIntentId: 'slander.exists', kashfMethodId: 'slander.unsupported', kashfRuntimeStatus: 'unsupported', note: 'Slander is an H12 signification, not a verified yes/no/identity method.' }),
  'q-sorcerer': route({ questionId: 'q-sorcerer', disposition: 'BLOCK', kashfIntentId: 'spiritual.sorcererIdentity', kashfMethodId: 'spiritual.sorcererIdentity.unsupported', kashfRuntimeStatus: 'unsupported', note: 'p167 does not identify the person supposedly behind sorcery.' }),
  'q-stalled': route({ questionId: 'q-stalled', disposition: 'BLOCK', kashfIntentId: 'stalled.cause', kashfMethodId: 'stalled.cause.unsupported', kashfRuntimeStatus: 'unsupported', note: 'Delay/non-completion are H12 meanings, not a verified general cause-finding method.' }),
  'q-stranger-desc': route({ questionId: 'q-stranger-desc', disposition: 'BLOCK', kashfIntentId: 'stranger.description', kashfMethodId: 'stranger.description.unsupported', kashfRuntimeStatus: 'unsupported', note: 'No one audited source procedure covers appearance+character+profession+relation of an unknown stranger.' }),
  'q-two-faced': route({ questionId: 'q-two-faced', disposition: 'BLOCK', kashfIntentId: 'twoFaced.identity', kashfMethodId: 'twoFaced.identity.unsupported', kashfRuntimeStatus: 'unsupported', note: 'Two-faced people are an H12 signification, not an identity method.' }),
  'q-wronged': route({ questionId: 'q-wronged', disposition: 'BLOCK', kashfIntentId: 'wronged.veracity', kashfMethodId: 'wronged.veracity.unsupported', kashfRuntimeStatus: 'unsupported', note: 'Dispute rules do not establish factual/legal truth that the querent was wronged.' }),

`;
  if (!routes.includes(routeMarker)) throw new Error('Route insertion marker not found');
  routes = routes.replace(routeMarker, block + routeMarker);
}

const testMarker = '// ── Source-ready is NOT the same as executor-ready -----------------------';
if (!tests.includes('// ── Final explicit coverage / source-vs-signification guards')) {
  const block = `// ── Final explicit coverage / source-vs-signification guards -----------
assertRoute('q-hidden-action', {
  ok: true,
  canRunKashf: false,
  kashfIntentId: 'spiritual.hiddenAction',
  kashfMethodId: 'spiritual.p167.hiddenActionAirRows46815',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'pending',
});
assert(resolveKashfRouteByQuestionId('q-hidden-action').kashfMethodId !== resolveKashfRouteByQuestionId('q-sorcery').kashfMethodId, 'hidden action and sorcery diagnosis are not conflated');

assertRoute('q-illness-type', {
  ok: true,
  canRunKashf: false,
  kashfIntentId: 'illness.humor',
  kashfMethodId: 'illness.p202.humorElementMajority',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'pending',
});
assert(resolveKashfRouteByQuestionId('q-illness-cause').kashfRuntimeStatus === 'unsupported', 'modern physical/emotional/environmental illness-cause promise is not inferred from humors');

assertRoute('q-religion', {
  ok: true,
  canRunKashf: false,
  kashfIntentId: 'religion.religiosity',
  kashfMethodId: 'religion.p253.h3h9',
  kashfRuntimeStatus: 'repair-required',
});

for (const qid of ['q-helpers','q-isolation','q-jinn-type','q-nativity','q-neighbor','q-obsession','q-official-docs','q-past-events','q-relative-state','q-separation-loved','q-slander','q-sorcerer','q-stalled','q-stranger-desc','q-two-faced','q-wronged']) {
  const r = resolveKashfRouteByQuestionId(qid);
  assert(r.ok === true, `${qid}: has an explicit route`);
  assert(r.canRunKashf === false, `${qid}: house signification/unsupported question cannot run`);
  assert(r.kashfRuntimeStatus === 'unsupported', `${qid}: remains explicitly unsupported`);
}
for (const qid of ['q-agriculture','q-father','q-geo-direction','q-lose-fortune','q-separation']) {
  const r = resolveKashfRouteByQuestionId(qid);
  assert(r.ok === true && r.disposition === 'SPLIT', `${qid}: mixed-scope question is explicitly split`);
  assert(r.canRunKashf === false, `${qid}: mixed-scope question cannot run before split`);
}
assertRoute('q-security-h8', {
  ok: true,
  canRunKashf: false,
  kashfIntentId: 'danger.deathRisk',
  kashfMethodId: 'danger.deathRisk.unresolved',
  kashfRuntimeStatus: 'blocked-by-source',
});

`;
  if (!tests.includes(testMarker)) throw new Error('Test insertion marker not found');
  tests = tests.replace(testMarker, block + testMarker);
}

// Once every q-* bank question has an explicit disposition, the coverage
// audit becomes a permanent hard CI gate. Make the change now and let the
// audit itself prove that the final mapping is complete.
if (!audit.includes("if (unmapped.length) errors.push(`Unmapped Question IDs:")) {
  const errorMarker = "if (malformedRoutes.length) errors.push(`Malformed route IDs: ${malformedRoutes.join(', ')}`);";
  if (!audit.includes(errorMarker)) throw new Error('Coverage error marker not found');
  audit = audit.replace(
    errorMarker,
    errorMarker + "\nif (unmapped.length) errors.push(`Unmapped Question IDs: ${unmapped.join(', ')}`);"
  );
  audit = audit.replace(
    "Migration coverage gate: REPORT-ONLY until explicit routing reaches 100%.",
    "Migration coverage gate: HARD FAIL — all Question Bank IDs must remain explicitly routed."
  );
  audit = audit.replace(
    "Migration coverage gate: 100% — safe to tighten future CI to reject unmapped questions.",
    "Migration coverage gate: 100% — HARD GATE ACTIVE; future unmapped questions fail CI."
  );
}

fs.writeFileSync(methodPath, methods);
fs.writeFileSync(routePath, routes);
fs.writeFileSync(testPath, tests);
fs.writeFileSync(auditPath, audit);

for (const cmd of [
  ['node', ['_test_kashf_canonical_routing.mjs']],
  ['node', ['_audit_kashf_question_route_coverage.mjs']],
]) {
  const r = spawnSync(cmd[0], cmd[1], { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
