import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const methodPath = 'goral-hachol/registry/kashf-canonical-method-registry.js';
const routePath = 'goral-hachol/registry/kashf-question-route-registry.js';
const testPath = '_test_kashf_canonical_routing.mjs';

let methods = fs.readFileSync(methodPath, 'utf8');
let routes = fs.readFileSync(routePath, 'utf8');
let tests = fs.readFileSync(testPath, 'utf8');

const methodMarker = '  // ── REPAIR REQUIRED ----------------------------------------------------';
if (!methods.includes('// ── CONFLICT + THEFT canonical slice')) {
  const block = `  // ── CONFLICT + THEFT canonical slice --------------------------------
  'theft.p224.recoveryH8': method({
    kashfMethodId: 'theft.p224.recoveryH8',
    kashfIntentId: 'theft.recovery',
    topicId: 'theft',
    sourcePages: [224],
    kashfRuntimeStatus: 'repair-required',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    legacyTopicId: 'theft',
    notes: 'Body-source recovery rule: H8 benefic => the stolen property is obtained/recovered; H8 malefic => it is not. Legacy runtime softens this binary rule and adds mixed branches, so it must not run unchanged.',
  }),

  'theft.p224.relationshipH7Recurrence': method({
    kashfMethodId: 'theft.p224.relationshipH7Recurrence',
    kashfIntentId: 'theft.thiefRelationship',
    topicId: 'theft',
    sourcePages: [224, 225],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'Body-source relationship/proximity method follows where the H7 figure recurs and judges the connection by that house. It can classify relation/proximity; it does not identify a named thief.',
  }),

  'theft.p225.thiefDescriptionH7': method({
    kashfMethodId: 'theft.p225.thiefDescriptionH7',
    kashfIntentId: 'theft.thiefDescription',
    topicId: 'theft',
    sourcePages: [224, 225],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'Body-source instruction takes the thief description from H7 and its figure, with H10 used for location/context. This yields a descriptive profile/letters, not a certain real-world identity or accusation.',
  }),

  'dispute.p212.reconciliationH1H7': method({
    kashfMethodId: 'dispute.p212.reconciliationH1H7',
    kashfIntentId: 'dispute.reconciliation',
    topicId: 'disputes',
    sourcePages: [212],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'Body-source reconciliation rule: derive H1+H7; a benefic result indicates reconciliation, and the house in which that result resides can indicate the mediator. These are parts of one method, not separate votes.',
  }),

  'dispute.p213.winnerStrengthUnresolved': method({
    kashfMethodId: 'dispute.p213.winnerStrengthUnresolved',
    kashfIntentId: 'dispute.whoWins',
    topicId: 'disputes',
    sourcePages: [213],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Body-source winner/loser method is identified (H13+balance for querent, H14 for respondent, then multiplicity/strength and tie-break house groups), but the exact source semantics of “strength/multiplicity of force” are not closed. No code until that term is resolved.',
  }),

  'partnership.p212.operationUnresolved': method({
    kashfMethodId: 'partnership.p212.operationUnresolved',
    kashfIntentId: 'partnership.goodOrBad',
    topicId: 'partnership',
    sourcePages: [212],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'p212 gives partnership indications from H1/H7 and H5/H7 and also a 2-by-2 remainder rule, but the exact operation/input denoted by the total is not sufficiently closed. Do not merge the variants or invent the operand.',
  }),

  'fear.p273.punishmentSigns': method({
    kashfMethodId: 'fear.p273.punishmentSigns',
    kashfIntentId: 'fear.punishment',
    topicId: 'fear',
    sourcePages: [273],
    kashfRuntimeStatus: 'repair-required',
    runtimeAllowed: false,
    executionKind: 'legacy-function',
    executorStatus: 'pending',
    legacyTopicId: 'fear',
    notes: 'Body-source punishment-fear rule requires Incoming Honor in H10, Incoming Threshold in H5, Ahyan/Nesu Rosh in H1 OR the enemy house, and H4 benefic. Existing computeFearOfPunishment checks the H1 branch but omits the alternative enemy-house branch.',
  }),

  'war.external.p213-217.nonBody': method({
    kashfMethodId: 'war.external.p213-217.nonBody',
    kashfIntentId: 'war.outcome',
    topicId: 'disputes',
    sourcePages: [213, 214, 215, 216, 217],
    sourceLayer: 'non-body-addition',
    attributedSourceBook: 'other',
    methodRole: 'educational-only',
    kashfRuntimeStatus: 'educational-only',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The city/war/winner material after the explicit ومن غير الكتاب marker is retained for learning only. It must not become the runtime fallback for dispute or war questions.',
  }),

  'prisoner.causeOfImprisonment.unsupported': method({
    kashfMethodId: 'prisoner.causeOfImprisonment.unsupported',
    kashfIntentId: 'prisoner.causeOfImprisonment',
    topicId: 'prisoner',
    sourcePages: [272, 273],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Audited body-source prisoner rules judge outcome/exit conditions, not the identity of the person responsible for causing the imprisonment. Do not infer a culprit from house symbolism.',
  }),

  'conflict.victoryGoalMixedScope.unsupported': method({
    kashfMethodId: 'conflict.victoryGoalMixedScope.unsupported',
    kashfIntentId: 'conflict.victoryGoalMixedScope',
    topicId: 'disputes',
    sourcePages: [212, 213, 267],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The UI question mixes defeating an opponent with succeeding in a personal objective. Those belong to dispute.whoWins and hope.fulfillment respectively and must be split before canonical routing.',
  }),

  'business.attention.unsupported': method({
    kashfMethodId: 'business.attention.unsupported',
    kashfIntentId: 'business.otherPartyAttention',
    topicId: 'partnership',
    sourcePages: [212],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'No audited body-source method has been selected for whether a business counterparty is still mentally committed or has shifted attention elsewhere. Do not reuse the p204 love-attention method across domains.',
  }),

`;
  if (!methods.includes(methodMarker)) throw new Error('Method insertion marker not found');
  methods = methods.replace(methodMarker, block + methodMarker);
}

const routeMarker = '  // ── REPAIR REQUIRED: explicit hard stop until fixed -------------------';
if (!routes.includes('// ── AUDITED CONFLICT + THEFT SLICE')) {
  const block = `  // ── AUDITED CONFLICT + THEFT SLICE -----------------------------------
  'q-theft-return': route({
    questionId: 'q-theft-return',
    disposition: 'KEEP',
    kashfIntentId: 'theft.recovery',
    kashfMethodId: 'theft.p224.recoveryH8',
    kashfRuntimeStatus: 'repair-required',
    note: 'Use the body p224 H8 binary recovery rule. Current legacy logic adds unsupported soft/mixed outcomes and remains blocked.',
  }),

  'q-thief-near': route({
    questionId: 'q-thief-near',
    disposition: 'RENAME',
    kashfIntentId: 'theft.thiefRelationship',
    kashfMethodId: 'theft.p224.relationshipH7Recurrence',
    kashfRuntimeStatus: 'ready',
    note: 'Source-safe scope is the thief’s relationship/connection indicated by the house where the H7 figure recurs. It is not a numeric distance meter.',
  }),

  'q-theft-who': route({
    questionId: 'q-theft-who',
    disposition: 'RENAME',
    kashfIntentId: 'theft.thiefDescription',
    kashfMethodId: 'theft.p225.thiefDescriptionH7',
    kashfRuntimeStatus: 'ready',
    note: 'Rename from “who stole?” to a source-safe descriptive profile of the thief. The method does not prove a named person’s identity and must not be used to accuse a specific suspect.',
  }),

  'q-dispute': route({
    questionId: 'q-dispute',
    disposition: 'BLOCK',
    kashfIntentId: 'dispute.whoWins',
    kashfMethodId: 'dispute.p213.winnerStrengthUnresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    note: 'The body winner/loser method is identified, but exact “strength” semantics are not closed. Do not fall back to post-marker non-body winner rules.',
  }),

  'q-women-dispute': route({
    questionId: 'q-women-dispute',
    disposition: 'ALIAS',
    aliasOf: 'q-dispute',
    kashfIntentId: 'dispute.whoWins',
    kashfMethodId: 'dispute.p213.winnerStrengthUnresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    note: 'No separate canonical winner method by opponent gender was found in the audited body passage.',
  }),

  'q-reconciliation': route({
    questionId: 'q-reconciliation',
    disposition: 'KEEP',
    kashfIntentId: 'dispute.reconciliation',
    kashfMethodId: 'dispute.p212.reconciliationH1H7',
    kashfRuntimeStatus: 'ready',
  }),

  'q-compromise': route({
    questionId: 'q-compromise',
    disposition: 'ALIAS',
    aliasOf: 'q-reconciliation',
    kashfIntentId: 'dispute.reconciliation',
    kashfMethodId: 'dispute.p212.reconciliationH1H7',
    kashfRuntimeStatus: 'ready',
    note: 'Treat as the same reconciliation/settlement intent, not as a separate voting method.',
  }),

  'q-partnership': route({
    questionId: 'q-partnership',
    disposition: 'BLOCK',
    kashfIntentId: 'partnership.goodOrBad',
    kashfMethodId: 'partnership.p212.operationUnresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    note: 'The source variants and the operand of the 2-by-2 remainder rule are not closed. No aggregation or inferred operand.',
  }),

  'q-war': route({
    questionId: 'q-war',
    disposition: 'EDUCATIONAL',
    kashfIntentId: 'war.outcome',
    kashfMethodId: 'war.external.p213-217.nonBody',
    kashfRuntimeStatus: 'educational-only',
    note: 'The audited war/city rules follow the explicit ومن غير الكتاب marker and remain knowledge-only by default.',
  }),

  'q-fear-punishment': route({
    questionId: 'q-fear-punishment',
    disposition: 'KEEP',
    kashfIntentId: 'fear.punishment',
    kashfMethodId: 'fear.p273.punishmentSigns',
    kashfRuntimeStatus: 'repair-required',
    note: 'Body method exists, but the current helper omits the source’s alternative enemy-house condition and cannot run unchanged.',
  }),

  'q-prisoner-guilty': route({
    questionId: 'q-prisoner-guilty',
    disposition: 'BLOCK',
    kashfIntentId: 'prisoner.causeOfImprisonment',
    kashfMethodId: 'prisoner.causeOfImprisonment.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'The body prisoner rules do not identify who caused the imprisonment. Do not infer culpability from general house meanings.',
  }),

  'q-victory-goal': route({
    questionId: 'q-victory-goal',
    disposition: 'SPLIT',
    kashfIntentId: 'conflict.victoryGoalMixedScope',
    kashfMethodId: 'conflict.victoryGoalMixedScope.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'Split opponent-victory from personal-goal fulfillment. The former belongs to dispute.whoWins; the latter to hope.fulfillment.',
  }),

  'q-who-looks-biz': route({
    questionId: 'q-who-looks-biz',
    disposition: 'BLOCK',
    kashfIntentId: 'business.otherPartyAttention',
    kashfMethodId: 'business.attention.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'No body-source business-attention method selected. Do not reuse the p204 love-attention formula for commerce.',
  }),

`;
  if (!routes.includes(routeMarker)) throw new Error('Route insertion marker not found');
  routes = routes.replace(routeMarker, block + routeMarker);
}

const testMarker = '// ── Source-ready is NOT the same as executor-ready -----------------------';
if (!tests.includes('// ── Conflict/theft source-intent separation')) {
  const block = `// ── Conflict/theft source-intent separation -----------------------------
assertRoute('q-theft-return', {
  ok: true,
  canRunKashf: false,
  kashfIntentId: 'theft.recovery',
  kashfMethodId: 'theft.p224.recoveryH8',
  kashfRuntimeStatus: 'repair-required',
});
assertRoute('q-thief-near', {
  ok: true,
  canRunKashf: false,
  kashfIntentId: 'theft.thiefRelationship',
  kashfMethodId: 'theft.p224.relationshipH7Recurrence',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'pending',
});
assertRoute('q-theft-who', {
  ok: true,
  canRunKashf: false,
  kashfIntentId: 'theft.thiefDescription',
  kashfMethodId: 'theft.p225.thiefDescriptionH7',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'pending',
});

const dispute = assertRoute('q-dispute', {
  ok: true,
  canRunKashf: false,
  kashfIntentId: 'dispute.whoWins',
  kashfRuntimeStatus: 'blocked-by-source',
});
const womenDispute = resolveKashfRouteByQuestionId('q-women-dispute');
assert(womenDispute.kashfMethodId === dispute.kashfMethodId, 'women-dispute does not invent a gender-specific winner method');
assert(womenDispute.aliasOf === 'q-dispute', 'women-dispute alias is explicit');

const reconciliation = assertRoute('q-reconciliation', {
  ok: true,
  canRunKashf: false,
  kashfIntentId: 'dispute.reconciliation',
  kashfMethodId: 'dispute.p212.reconciliationH1H7',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'pending',
});
const compromise = resolveKashfRouteByQuestionId('q-compromise');
assert(compromise.kashfMethodId === reconciliation.kashfMethodId, 'compromise and reconciliation use one exact canonical method');

assertRoute('q-war', {
  ok: true,
  canRunKashf: false,
  kashfIntentId: 'war.outcome',
  kashfRuntimeStatus: 'educational-only',
  runtimeAllowed: false,
});
assertRoute('q-fear-punishment', {
  ok: true,
  canRunKashf: false,
  kashfIntentId: 'fear.punishment',
  kashfRuntimeStatus: 'repair-required',
});
assertRoute('q-prisoner-guilty', {
  ok: true,
  canRunKashf: false,
  kashfRuntimeStatus: 'unsupported',
});
assertRoute('q-partnership', {
  ok: true,
  canRunKashf: false,
  kashfRuntimeStatus: 'blocked-by-source',
});
assertRoute('q-victory-goal', {
  ok: true,
  canRunKashf: false,
  kashfRuntimeStatus: 'unsupported',
});
assertRoute('q-who-looks-biz', {
  ok: true,
  canRunKashf: false,
  kashfRuntimeStatus: 'unsupported',
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
