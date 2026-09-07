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
  const block = `  // ── CONFLICT + THEFT canonical slice ----------------------------------
  'theft.p224.recoveryH8Quality': method({
    kashfMethodId: 'theft.p224.recoveryH8Quality',
    kashfIntentId: 'theft.recovery',
    topicId: 'theft',
    sourcePages: [224],
    kashfRuntimeStatus: 'repair-required',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    legacyTopicId: 'theft',
    notes: 'Body-source recovery rule is binary: H8 benefic => owner recovers the stolen thing; H8 malefic => does not. Current legacy runtime softens this and adds mixed branches, so it must be bypassed/repaired before canonical execution.',
  }),

  'theft.p224.connectedPersonH7Recurrence': method({
    kashfMethodId: 'theft.p224.connectedPersonH7Recurrence',
    kashfIntentId: 'theft.connectedPerson',
    topicId: 'theft',
    sourcePages: [224, 225],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'Body-source relation method: recurrence of the H7 figure in specific houses indicates who is connected to the theft; p225 supplies kinship-role context. This identifies relation/proximity, not a named culprit.',
  }),

  'theft.p225.thiefDescriptionUnresolved': method({
    kashfMethodId: 'theft.p225.thiefDescriptionUnresolved',
    kashfIntentId: 'theft.thiefDescription',
    topicId: 'theft',
    sourcePages: [225, 232, 233, 234],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'p225 body text says to take the thief description from H7, but the detailed figure-by-figure physical/profession table is in the later non-body block p232-p234. Do not silently use that external table as canonical body runtime; a body-safe resolver must be selected first.',
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
    notes: 'Body-source reconciliation rule: derive from H1+H7; a benefic result indicates reconciliation, with the placement/source figure indicating the mediator. This is a distinct intent from who wins.',
  }),

  'dispute.p213.winnerLoserStrengthUnresolved': method({
    kashfMethodId: 'dispute.p213.winnerLoserStrengthUnresolved',
    kashfIntentId: 'dispute.whoWins',
    topicId: 'disputes',
    sourcePages: [213],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The body-source winner/loser method compares the querent side (H13 plus balance/judge) against H14 by multiplicity/strength, with a grouped-house tie-breaker. Exact source semantics of “strength” are not closed, so no runtime code yet.',
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
    notes: 'Body text points to H1/H7 and H5/H7 and also gives a parity rule over “the total”, but the exact operation/input is not sufficiently closed. Do not choose or combine methods by inference.',
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
    notes: 'Canonical body rule for fear of punishment/imprisonment/beating: Incoming Honor in H10, Incoming Threshold in H5, Nesu Rosh in H1 OR the enemy house, and H4 benefic => no fear. Existing helper omits the enemy-house alternative and must be repaired before isolated reuse.',
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
    notes: 'The H8 security/fear/longevity/inheritance material follows an explicit attribution to al-Multaqat / collected point-lore. Retain for learning only; do not use as Kashf body verdict.',
  }),

  'war.external.p213-217': method({
    kashfMethodId: 'war.external.p213-217',
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
    notes: 'War/city/siege methods after the explicit ومن غير الكتاب marker are non-body material. Keep them educational by default.',
  }),

  'prisoner.jailerIdentity.unsupported': method({
    kashfMethodId: 'prisoner.jailerIdentity.unsupported',
    kashfIntentId: 'prisoner.jailerIdentity',
    topicId: 'prisoner',
    sourcePages: [272, 273],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Audited body-source prisoner rules cover exit conditions, outcome and fear of punishment; they do not provide a verified method for identifying who caused the imprisonment.',
  }),

  'victory.mixedScope.unsupported': method({
    kashfMethodId: 'victory.mixedScope.unsupported',
    kashfIntentId: 'victory.mixedScope',
    topicId: 'disputes',
    sourcePages: [],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The current UI question mixes defeating an opponent with general success in a goal. These are separate intents (dispute.whoWins vs hope/completion) and must be split before routing.',
  }),

  'business.attention.unsupported': method({
    kashfMethodId: 'business.attention.unsupported',
    kashfIntentId: 'business.attention',
    topicId: 'partnership',
    sourcePages: [],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'No audited Kashf body method has been selected for whether a business counterparty has shifted attention to another opportunity. Do not repurpose the p204 love-attention method by analogy.',
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
    notes: 'The wronged/oppressed person appears in house meanings, but no audited operational Kashf body rule has been selected for the broad UI question.',
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
    kashfMethodId: 'theft.p224.recoveryH8Quality',
    kashfRuntimeStatus: 'repair-required',
    note: 'p224 is binary: H8 benefic => recover; H8 malefic => not. Current legacy softening/mixed branches are not source-safe.',
  }),

  'q-thief-near': route({
    questionId: 'q-thief-near',
    disposition: 'RENAME',
    kashfIntentId: 'theft.connectedPerson',
    kashfMethodId: 'theft.p224.connectedPersonH7Recurrence',
    kashfRuntimeStatus: 'ready',
    note: 'Source-safe scope is what relation/house connection the theft points to. It does not identify a named culprit.',
  }),

  'q-theft-who': route({
    questionId: 'q-theft-who',
    disposition: 'BLOCK',
    kashfIntentId: 'theft.thiefDescription',
    kashfMethodId: 'theft.p225.thiefDescriptionUnresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    note: 'Body p225 points to H7 for description, but the detailed physical/profession table is in the later non-body p232-p234 block. Do not promise identity or use that external table as body runtime.',
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
  }),

  'q-dispute': route({
    questionId: 'q-dispute',
    disposition: 'BLOCK',
    kashfIntentId: 'dispute.whoWins',
    kashfMethodId: 'dispute.p213.winnerLoserStrengthUnresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    note: 'Dedicated body winner/loser method is identified, but exact “strength” semantics remain unresolved.',
  }),

  'q-women-dispute': route({
    questionId: 'q-women-dispute',
    disposition: 'ALIAS',
    aliasOf: 'q-dispute',
    kashfIntentId: 'dispute.whoWins',
    kashfMethodId: 'dispute.p213.winnerLoserStrengthUnresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    note: 'No separate Kashf winner/loser method is selected merely because the opponent is a woman.',
  }),

  'q-partnership': route({
    questionId: 'q-partnership',
    disposition: 'BLOCK',
    kashfIntentId: 'partnership.goodOrBad',
    kashfMethodId: 'partnership.p212.operationUnresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    note: 'The source passage identifies partnership judgments but the exact operation/input is not fully closed. Do not infer or aggregate.',
  }),

  'q-who-looks-biz': route({
    questionId: 'q-who-looks-biz',
    disposition: 'BLOCK',
    kashfIntentId: 'business.attention',
    kashfMethodId: 'business.attention.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'No source-safe business-attention method is selected; do not reuse the love-attention rule by analogy.',
  }),

  'q-victory-goal': route({
    questionId: 'q-victory-goal',
    disposition: 'SPLIT',
    kashfIntentId: 'victory.mixedScope',
    kashfMethodId: 'victory.mixedScope.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'Split “defeat an opponent” from “succeed in a goal” before choosing a Kashf method.',
  }),

  'q-war': route({
    questionId: 'q-war',
    disposition: 'EDUCATIONAL',
    kashfIntentId: 'war.outcome',
    kashfMethodId: 'war.external.p213-217',
    kashfRuntimeStatus: 'educational-only',
    note: 'The mapped war/city methods are inside the explicit non-body block.',
  }),

  'q-fear-punishment': route({
    questionId: 'q-fear-punishment',
    disposition: 'KEEP',
    kashfIntentId: 'fear.punishment',
    kashfMethodId: 'fear.p273.punishmentSigns',
    kashfRuntimeStatus: 'repair-required',
    note: 'The canonical body rule is nearly implemented, but the existing helper omits the Nesu Rosh alternative in the enemy house.',
  }),

  'q-prisoner-guilty': route({
    questionId: 'q-prisoner-guilty',
    disposition: 'BLOCK',
    kashfIntentId: 'prisoner.jailerIdentity',
    kashfMethodId: 'prisoner.jailerIdentity.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'No audited body-source method identifies who caused the imprisonment.',
  }),

  'q-security-h8': route({
    questionId: 'q-security-h8',
    disposition: 'EDUCATIONAL',
    kashfIntentId: 'security.general',
    kashfMethodId: 'security.external.p235.h8',
    kashfRuntimeStatus: 'educational-only',
    note: 'The H8 security/fear material is explicitly attributed to collected/al-Multaqat point-lore, not the Kashf body.',
  }),

  'q-wronged': route({
    questionId: 'q-wronged',
    disposition: 'BLOCK',
    kashfIntentId: 'wronged.status',
    kashfMethodId: 'wronged.status.unsupported',
    kashfRuntimeStatus: 'unsupported',
  }),

`;
  if (!routes.includes(routeMarker)) throw new Error('Route insertion marker not found');
  routes = routes.replace(routeMarker, block + routeMarker);
}

const testMarker = '// ── Acceptance test 8: runtimeAllowed=false is a hard stop ---------------';
if (!tests.includes('// ── Conflict/theft source-isolation checks')) {
  const block = `// ── Conflict/theft source-isolation checks ------------------------------
assertRoute('q-reconciliation', {
  ok: true,
  canRunKashf: false,
  kashfIntentId: 'dispute.reconciliation',
  kashfMethodId: 'dispute.p212.reconciliationH1H7',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'pending',
});
const compromise = resolveKashfRouteByQuestionId('q-compromise');
assert(compromise.kashfMethodId === 'dispute.p212.reconciliationH1H7', 'q-compromise aliases the exact reconciliation method');
assert(compromise.aliasOf === 'q-reconciliation', 'q-compromise documents its alias target');
assertRoute('q-dispute', {
  ok: true,
  canRunKashf: false,
  kashfRuntimeStatus: 'blocked-by-source',
  kashfMethodId: 'dispute.p213.winnerLoserStrengthUnresolved',
});
assertRoute('q-theft-return', {
  ok: true,
  canRunKashf: false,
  kashfIntentId: 'theft.recovery',
  kashfRuntimeStatus: 'repair-required',
});
assertRoute('q-theft-who', {
  ok: true,
  canRunKashf: false,
  kashfRuntimeStatus: 'blocked-by-source',
});
assertRoute('q-war', {
  ok: true,
  canRunKashf: false,
  kashfRuntimeStatus: 'educational-only',
  runtimeAllowed: false,
});
assertRoute('q-prisoner-guilty', {
  ok: true,
  canRunKashf: false,
  kashfRuntimeStatus: 'unsupported',
});
assertRoute('q-fear-punishment', {
  ok: true,
  canRunKashf: false,
  kashfMethodId: 'fear.p273.punishmentSigns',
  kashfRuntimeStatus: 'repair-required',
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
