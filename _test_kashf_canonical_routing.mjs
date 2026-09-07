#!/usr/bin/env node
/**
 * _test_kashf_canonical_routing.mjs
 *
 * P0 contract tests for Question -> Kashf Intent -> ONE Canonical Method.
 * No AI, no network. Includes a small deterministic board-execution slice.
 */

import {
  getKashfMethod,
  getCanonicalKashfMethodForIntent,
  canRunKashfMethod,
  validateKashfMethodRegistry,
  KASHF_CANONICAL_METHODS,
} from './goral-hachol/registry/kashf-canonical-method-registry.js';
import {
  KASHF_V57_KNOWLEDGE,
  getKashfV57Knowledge,
  validateKashfV57KnowledgeCoverage,
} from './goral-hachol/registry/kashf-v57-knowledge-registry.js';
import {
  validateKashfQuestionRoutes,
} from './goral-hachol/registry/kashf-question-route-registry.js';
import {
  resolveKashfRouteByQuestionId,
  requireRunnableKashfRoute,
} from './goral-hachol/engine/kashf-method-router.js';
import {
  buildKashfReadingByQuestionId,
} from './goral-hachol/engine/kashf-canonical-reading-engine.js';
import { writeCanonicalKashfReading } from './goral-hachol/engine/kashf-canonical-narrative-writer.js';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { getCanonicalSaadNahsDetail } from './goral-hachol/engine/kashf-canonical-figure-classifier.js';

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

// Reused, previously validated mother combination from the repository QA set.
const PILOT_MOTHERS = ['1112', '2122', '1121', '2211'];
const PILOT_BOARD = buildRamlBoardFromMothers(PILOT_MOTHERS);

// ── Registry invariants ---------------------------------------------------
{
  const result = validateKashfMethodRegistry();
  assert(result.valid, `method registry valid: ${result.errors.join('; ')}`);
}
{
  const result = validateKashfQuestionRoutes(getKashfMethod);
  assert(result.valid, `question route registry valid: ${result.errors.join('; ')}`);
}
{
  const result = validateKashfV57KnowledgeCoverage(KASHF_CANONICAL_METHODS);
  assert(result.valid, `every source-ready canonical method has v57 Hebrew knowledge: ${result.errors.join('; ')}`);
  assert(result.coveredCount === result.sourceReadyCount, `v57 source-ready coverage ${result.coveredCount}/${result.sourceReadyCount}`);
  assert(result.sourceReadyCount > 0, 'v57 coverage gate sees source-ready canonical methods');
  assert(result.runnableCount > 0, 'v57 coverage gate still sees runnable canonical methods');
}
for (const [methodId, entry] of Object.entries(KASHF_V57_KNOWLEDGE)) {
  assert(entry.knowledgeLanguage === 'he', `${methodId} v57 knowledge language is Hebrew`);
  assert(entry.knowledgeRole === 'operational-primary', `${methodId} v57 knowledge is operational-primary`);
  assert(entry.arabicVerification?.role === 'verification-only', `${methodId} Arabic source is verification-only`);
  assert(entry.v57?.indexFile === 'kashf-v57-topic-index.html', `${methodId} points to v57 topic index`);
  assert(entry.v57?.draftFile === 'kashf-v57-draft.html', `${methodId} points to v57 Hebrew draft`);
  assert(typeof entry.v57?.hebrewRule === 'string' && entry.v57.hebrewRule.length > 0, `${methodId} has Hebrew operational rule text`);
}

const p239SeaLandV57 = getKashfV57Knowledge('travel.p239.seaOrLandByElement');
assert(p239SeaLandV57?.knowledgeLanguage === 'he', 'p239 sea/land has Hebrew v57 knowledge despite runtime source block');
assert(p239SeaLandV57?.arabicVerification?.notes?.includes('פער נוסח'), 'p239 sea/land records Hebrew/Arabic source discrepancy');
assert(getKashfMethod('travel.p239.seaOrLandByElement')?.kashfRuntimeStatus === 'blocked-by-source', 'p239 sea/land is not mislabeled source-ready while derivation/discrepancy remain open');
assert(getKashfMethod('travel.p239.profitEarthRowH2')?.kashfRuntimeStatus === 'blocked-by-source', 'p239 profit is not mislabeled source-ready while earth-row input remains unresolved');
assert(getKashfMethod('joy.p196.recast14511')?.kashfRuntimeStatus === 'blocked-by-source', 'joy p196 false source mapping is blocked');
assert(getKashfV57Knowledge('joy.p196.recast14511') === null, 'false p196 joy mapping is not fabricated into v57 Hebrew knowledge');
assert(JSON.stringify(getKashfMethod('missing.p248-249.lifeH1H4H9Outcome')?.sourcePages) === JSON.stringify([250, 251]), 'missing-person life/death source pages corrected to v57 pp250-251');

const professionV57 = getKashfV57Knowledge('profession.p254.h9Planet');
assert(professionV57?.v57?.hebrewRule.includes('כישוף, נפלאות ואצטגנינות'), 'profession p254 v57 knowledge preserves Mercury magic/wonders/astrology rule');
assert(!professionV57?.v57?.hebrewRule.includes('כתיבה וחשבונות'), 'profession p254 v57 knowledge does not retain stale Mercury writing/accounts rule');

const v57ProbeReading = buildKashfReadingByQuestionId(PILOT_BOARD, 'q-pregnancy', { question: 'האם יש הריון?' });
assert(v57ProbeReading.knowledgeLanguage === 'he', 'runnable reading exposes Hebrew as operational knowledge language');
assert(v57ProbeReading.hebrewKnowledge?.version === 'v57', 'runnable reading exposes v57 Hebrew knowledge payload');
assert(v57ProbeReading.source?.operationalKnowledge?.role === 'operational-primary', 'reading source marks v57 as operational-primary');
assert(v57ProbeReading.source?.verificationSource?.role === 'verification-only', 'reading source marks Arabic as verification-only');
assert(v57ProbeReading.primaryFormula?.sourceText === getKashfV57Knowledge('pregnancy.p191.existsH5SilentEmpty')?.v57?.hebrewRule, 'reading primary sourceText comes from v57 Hebrew knowledge');

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
  executorStatus: 'ready',
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
  executorStatus: 'not-applicable',
});
assert(!canRunKashfMethod('promise.external.p255'), 'educational promise method can never run');

// ── Acceptance test 4: q-sorcery must NOT trigger p167 ------------------
const sorcery = assertRoute('q-sorcery', {
  ok: true,
  canRunKashf: false,
  kashfIntentId: 'spiritual.affectedBySorcery',
  kashfRuntimeStatus: 'unsupported',
  runtimeAllowed: false,
  executorStatus: 'not-applicable',
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
  kashfMethodId: 'missing.p248-249.lifeH1H4H9Outcome',
  kashfRuntimeStatus: 'ready',
});

// ── Conflict/theft source-intent separation -----------------------------
assertRoute('q-theft-return', {
  ok: true,
  canRunKashf: false,
  kashfIntentId: 'theft.recovery',
  kashfMethodId: 'theft.p224.recoveryH8',
  kashfRuntimeStatus: 'repair-required',
});
assertRoute('q-thief-near', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'theft.thiefRelationship',
  kashfMethodId: 'theft.p224.relationshipH7Recurrence',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assertRoute('q-theft-who', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'theft.thiefDescription',
  kashfMethodId: 'theft.p225.thiefDescriptionH7',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
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

// ── Exact illness recovery method is now executor-ready -------------------
const illnessRecovery = assertRoute('q-illness-heal', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'illness.recovery',
  kashfMethodId: 'illness.p196.outcomeH15',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assert(canRunKashfMethod(illnessRecovery.kashfMethodId), 'p196 H15 recovery method is explicitly runnable');

// ── Spiritual/misc source-boundary checks -------------------------------
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

// ── Final question-bank coverage checks ---------------------------------
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
assert(canRunKashfMethod('illness.p196.outcomeH15') === true, 'p196 H15 executor can run after explicit canonical cutover');

// ── P1 profession method-scoped legacy executor -------------------------
const professionRoute = assertRoute('q-profession', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'profession.type',
  kashfMethodId: 'profession.p254.h9Planet',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assert(canRunKashfMethod(professionRoute.kashfMethodId) === true, 'profession canonical method is explicitly runnable');
const professionReading = buildKashfReadingByQuestionId(PILOT_BOARD, 'q-profession', { question: 'מה המלאכה המורה עלי?' });
assert(professionReading.valid === true, 'q-profession executes through canonical legacy allowlist');
assert(professionReading.canonicalExecution?.methodsExecuted?.length === 1, 'q-profession executes exactly one method');
assert(professionReading.canonicalExecution?.methodsExecuted?.[0] === 'profession.p254.h9Planet', 'q-profession executes the exact p254 method only');
assert(professionReading.canonicalExecution?.altFormulaExecuted === false, 'q-profession does not execute alt formula');
assert(professionReading.canonicalExecution?.topicSupportingChecksExecuted === false, 'q-profession does not execute authorityState supporting checks');
assert(professionReading.canonicalExecution?.topicBundleExecuted === false, 'q-profession does not execute authorityState bundle');
assert(typeof professionReading.verdict?.text === 'string' && professionReading.verdict.text.length > 0, 'q-profession exposes profession result text');
assert(professionReading.overallPositive === null, 'profession method does not invent a binary positive/negative verdict');
const professionHtml = writeCanonicalKashfReading(professionReading);
assert(professionHtml.includes('profession.p254.h9Planet'), 'profession writer identifies exact canonical method');
assert(!professionHtml.includes('בדיקת אימות נוספת'), 'profession writer contains no alt-formula section');
assert(!professionHtml.includes('ניתוח תומך לפי ספר'), 'profession writer contains no broad topic support section');
assert(!professionHtml.includes('מחשבת השואל (הדמיר)'), 'profession writer contains no automatic Dhamir');
assert(!professionHtml.includes('עדים ודיין'), 'profession writer contains no witness/judge bundle');
// ── P2 illness body-part method-scoped legacy executor -----------------
const bodyPartRoute = assertRoute('q-illness-bodypart', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'illness.bodyPart',
  kashfMethodId: 'illness.bodyPart.h6Figure',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assert(canRunKashfMethod(bodyPartRoute.kashfMethodId) === true, 'illness body-part canonical method is explicitly runnable');
const bodyPartReading = buildKashfReadingByQuestionId(PILOT_BOARD, 'q-illness-bodypart', { question: 'באיזה איבר נאחז החולי?' });
assert(bodyPartReading.valid === true, 'q-illness-bodypart executes through canonical legacy allowlist');
assert(bodyPartReading.canonicalExecution?.methodsExecuted?.length === 1, 'q-illness-bodypart executes exactly one method');
assert(bodyPartReading.canonicalExecution?.methodsExecuted?.[0] === 'illness.bodyPart.h6Figure', 'q-illness-bodypart executes the exact H6 method only');
assert(bodyPartReading.primaryFormula?.houses?.length === 1 && bodyPartReading.primaryFormula.houses[0] === 6, 'q-illness-bodypart traceability records H6 only');
assert(bodyPartReading.primaryFormula?.result?.legacyResult?.figureKey === '1112', 'pilot board H6 is passed to the legacy helper as canonical pattern key');
assert(bodyPartReading.primaryFormula?.result?.legacyResult?.bodyPartHebrew === 'הרגל השמאלית', 'H6=1112 resolves to the source-table body part');
assert(bodyPartReading.canonicalExecution?.altFormulaExecuted === false, 'q-illness-bodypart does not execute alt formula');
assert(bodyPartReading.canonicalExecution?.topicSupportingChecksExecuted === false, 'q-illness-bodypart does not execute illness supporting checks');
assert(bodyPartReading.canonicalExecution?.topicBundleExecuted === false, 'q-illness-bodypart does not execute illness topic bundle');
assert(bodyPartReading.overallPositive === null, 'body-part lookup does not invent a positive/negative verdict');
const bodyPartHtml = writeCanonicalKashfReading(bodyPartReading);
assert(bodyPartHtml.includes('illness.bodyPart.h6Figure'), 'body-part writer identifies exact canonical method');
assert(bodyPartHtml.includes('הרגל השמאלית'), 'body-part writer renders the source-table result');
assert(!bodyPartHtml.includes('ניתוח תומך לפי ספר'), 'body-part writer contains no broad illness support section');
assert(!bodyPartHtml.includes('מחשבת השואל (הדמיר)'), 'body-part writer contains no automatic Dhamir');
// ── P3 thief-description method-scoped custom executor ----------------
const thiefDescriptionRoute = assertRoute('q-theft-who', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'theft.thiefDescription',
  kashfMethodId: 'theft.p225.thiefDescriptionH7',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assert(canRunKashfMethod(thiefDescriptionRoute.kashfMethodId) === true, 'thief-description canonical method is explicitly runnable');
const thiefDescriptionReading = buildKashfReadingByQuestionId(PILOT_BOARD, 'q-theft-who', { question: 'מהו תיאור הגנב?' });
assert(thiefDescriptionReading.valid === true, 'q-theft-who executes through canonical custom allowlist');
assert(thiefDescriptionReading.canonicalExecution?.methodsExecuted?.length === 1, 'q-theft-who executes exactly one method');
assert(thiefDescriptionReading.canonicalExecution?.methodsExecuted?.[0] === 'theft.p225.thiefDescriptionH7', 'q-theft-who executes the exact H7 description method only');
assert(thiefDescriptionReading.primaryFormula?.houses?.length === 1 && thiefDescriptionReading.primaryFormula.houses[0] === 7, 'q-theft-who traceability records H7 only');
assert(thiefDescriptionReading.primaryFormula?.result?.executorResult?.figureKey === '1221', 'pilot board H7 is passed as the canonical figure key');
assert(String(thiefDescriptionReading.primaryFormula?.result?.executorResult?.description || '').includes('רחב בטן'), 'H7=1221 resolves to the source description table');
assert(thiefDescriptionReading.canonicalExecution?.altFormulaExecuted === false, 'q-theft-who does not execute alt formula');
assert(thiefDescriptionReading.canonicalExecution?.topicSupportingChecksExecuted === false, 'q-theft-who does not execute theft supporting checks');
assert(thiefDescriptionReading.canonicalExecution?.topicBundleExecuted === false, 'q-theft-who does not execute theft topic bundle');
assert(thiefDescriptionReading.overallPositive === null, 'descriptive thief profile does not invent a positive/negative verdict');
assert(String(thiefDescriptionReading.verdict?.text || '').includes('רחב בטן'), 'thief-description verdict renders the source descriptive profile');
const thiefDescriptionHtml = writeCanonicalKashfReading(thiefDescriptionReading);
assert(thiefDescriptionHtml.includes('theft.p225.thiefDescriptionH7'), 'thief-description writer identifies exact canonical method');
assert(thiefDescriptionHtml.includes('רחב בטן'), 'thief-description writer renders the source-table description');
assert(!thiefDescriptionHtml.includes('ניתוח תומך לפי ספר'), 'thief-description writer contains no broad theft support section');
assert(!thiefDescriptionHtml.includes('מחשבת השואל (הדמיר)'), 'thief-description writer contains no automatic Dhamir');
// ── P4 pregnancy-exists p191 custom executor -------------------------
const pregnancyRoute = assertRoute('q-pregnancy', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'pregnancy.exists',
  kashfMethodId: 'pregnancy.p191.existsH5SilentEmpty',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assert(canRunKashfMethod(pregnancyRoute.kashfMethodId) === true, 'pregnancy-exists canonical method is explicitly runnable');
const pregnancyReading = buildKashfReadingByQuestionId(PILOT_BOARD, 'q-pregnancy', { question: 'האם יש הריון?' });
assert(pregnancyReading.valid === true, 'q-pregnancy executes through canonical custom allowlist');
assert(pregnancyReading.canonicalExecution?.methodsExecuted?.length === 1, 'q-pregnancy executes exactly one method');
assert(pregnancyReading.canonicalExecution?.methodsExecuted?.[0] === 'pregnancy.p191.existsH5SilentEmpty', 'q-pregnancy executes the exact p191 method only');
assert(pregnancyReading.primaryFormula?.houses?.length === 1 && pregnancyReading.primaryFormula.houses[0] === 5, 'q-pregnancy traceability records H5 only');
assert(pregnancyReading.primaryFormula?.result?.executorResult?.h5Pattern === '1212', 'pilot board H5 is ממון יוצא / 1212');
assert(pregnancyReading.primaryFormula?.result?.executorResult?.classification === 'empty', 'H5=1212 is source-classified as empty');
assert(pregnancyReading.primaryFormula?.result?.executorResult?.pregnancyExists === false, 'empty H5 yields pregnancy false by p191');
assert(pregnancyReading.verdict?.positive === false && pregnancyReading.overallPositive === false, 'binary p191 verdict is propagated without topic voting');
assert(String(pregnancyReading.verdict?.text || '').includes('ההריון בטל'), 'empty H5 renders the exact p191 negative rule');
assert(pregnancyReading.canonicalExecution?.altFormulaExecuted === false, 'q-pregnancy does not execute alt formula');
assert(pregnancyReading.canonicalExecution?.topicSupportingChecksExecuted === false, 'q-pregnancy does not execute children supporting checks');
assert(pregnancyReading.canonicalExecution?.topicBundleExecuted === false, 'q-pregnancy does not execute children topic bundle');
const pregnancyHtml = writeCanonicalKashfReading(pregnancyReading);
assert(pregnancyHtml.includes('pregnancy.p191.existsH5SilentEmpty'), 'pregnancy writer identifies exact canonical method');
assert(pregnancyHtml.includes('ההריון בטל'), 'pregnancy writer renders the p191 result');
assert(pregnancyHtml.includes('אם בבית החמישי נמצאת צורה שותקת'), 'pregnancy writer exposes the exact source rule');
assert(!pregnancyHtml.includes('ניתוח תומך לפי ספר'), 'pregnancy writer contains no broad children support section');
assert(!pregnancyHtml.includes('מחשבת השואל (הדמיר)'), 'pregnancy writer contains no automatic Dhamir');

// Positive-path source guard: H5=2111 is סף נכנס, one of the six silent figures.
const PREGNANCY_SILENT_BOARD = buildRamlBoardFromMothers(['2122', '1112', '1121', '1211']);
const pregnancySilentReading = buildKashfReadingByQuestionId(PREGNANCY_SILENT_BOARD, 'q-pregnancy', { question: 'האם יש הריון?' });
assert(pregnancySilentReading.primaryFormula?.result?.executorResult?.h5Pattern === '2111', 'silent guard board produces H5=2111');
assert(pregnancySilentReading.primaryFormula?.result?.executorResult?.classification === 'silent', 'H5=2111 is source-classified as silent');
assert(pregnancySilentReading.primaryFormula?.result?.executorResult?.pregnancyExists === true, 'silent H5 yields pregnancy true by p191');
assert(pregnancySilentReading.verdict?.positive === true && pregnancySilentReading.overallPositive === true, 'silent H5 positive verdict is propagated');
assert(String(pregnancySilentReading.verdict?.text || '').includes('ההריון נכון'), 'silent H5 renders the exact p191 positive rule');

// Non-invention guard: p191 does not say every other figure means no pregnancy.
const PREGNANCY_UNRESOLVED_BOARD = buildRamlBoardFromMothers(['1112', '1121', '1211', '1221']);
const pregnancyUnresolvedReading = buildKashfReadingByQuestionId(PREGNANCY_UNRESOLVED_BOARD, 'q-pregnancy', { question: 'האם יש הריון?' });
assert(pregnancyUnresolvedReading.primaryFormula?.result?.executorResult?.h5Pattern === '1111', 'unresolved guard board produces H5=1111 / דרך');
assert(pregnancyUnresolvedReading.primaryFormula?.result?.executorResult?.classification === 'unresolved', 'H5=1111 is neither silent nor empty for this p191 rule');
assert(pregnancyUnresolvedReading.primaryFormula?.result?.executorResult?.pregnancyExists === null, 'unclassified p191 figure does not invent a no-pregnancy verdict');
assert(pregnancyUnresolvedReading.verdict?.positive === null && pregnancyUnresolvedReading.overallPositive === null, 'unresolved p191 figure remains neutral');
assert(String(pregnancyUnresolvedReading.verdict?.text || '').includes('אינו מכריע'), 'unresolved p191 result is explicit rather than fabricated');
// ── P5 pregnancy-gender p191 custom executor -------------------------
const pregnancyGenderRoute = assertRoute('q-gender', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'pregnancy.gender',
  kashfMethodId: 'pregnancy.p191.genderH5',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assert(canRunKashfMethod(pregnancyGenderRoute.kashfMethodId) === true, 'pregnancy-gender canonical method is explicitly runnable');
const pregnancyGenderReading = buildKashfReadingByQuestionId(PILOT_BOARD, 'q-gender', { question: 'מה מין הוולד?' });
assert(pregnancyGenderReading.valid === true, 'q-gender executes through canonical custom allowlist');
assert(pregnancyGenderReading.canonicalExecution?.methodsExecuted?.length === 1, 'q-gender executes exactly one method');
assert(pregnancyGenderReading.canonicalExecution?.methodsExecuted?.[0] === 'pregnancy.p191.genderH5', 'q-gender executes the exact p191 H5 gender method only');
assert(pregnancyGenderReading.primaryFormula?.houses?.length === 1 && pregnancyGenderReading.primaryFormula.houses[0] === 5, 'q-gender traceability records H5 only');
assert(pregnancyGenderReading.primaryFormula?.result?.executorResult?.h5Pattern === '1212', 'pilot board H5 remains ממון יוצא / 1212');
assert(pregnancyGenderReading.primaryFormula?.result?.executorResult?.gender === 'male', 'H5=1212 is masculine and yields male by p191');
assert(pregnancyGenderReading.verdict?.positive === null && pregnancyGenderReading.overallPositive === null, 'gender lookup does not invent positive/negative sentiment');
assert(String(pregnancyGenderReading.verdict?.text || '').includes('הוולד זכר'), 'masculine H5 renders the exact p191 male rule');
assert(pregnancyGenderReading.canonicalExecution?.altFormulaExecuted === false, 'q-gender does not execute alternate gender formula');
assert(pregnancyGenderReading.canonicalExecution?.topicSupportingChecksExecuted === false, 'q-gender does not execute children supporting checks');
assert(pregnancyGenderReading.canonicalExecution?.topicBundleExecuted === false, 'q-gender does not execute children topic bundle');
const pregnancyGenderHtml = writeCanonicalKashfReading(pregnancyGenderReading);
assert(pregnancyGenderHtml.includes('pregnancy.p191.genderH5'), 'pregnancy-gender writer identifies exact canonical method');
assert(pregnancyGenderHtml.includes('הוולד זכר'), 'pregnancy-gender writer renders the p191 result');
assert(pregnancyGenderHtml.includes('אם הצורה זכרית'), 'pregnancy-gender writer exposes the exact source rule');

// Feminine-path source guard: H5=2111 / סף נכנס is one of the six feminine figures.
const pregnancyGenderFemaleReading = buildKashfReadingByQuestionId(PREGNANCY_SILENT_BOARD, 'q-gender', { question: 'מה מין הוולד?' });
assert(pregnancyGenderFemaleReading.primaryFormula?.result?.executorResult?.h5Pattern === '2111', 'female guard board produces H5=2111');
assert(pregnancyGenderFemaleReading.primaryFormula?.result?.executorResult?.gender === 'female', 'H5=2111 is feminine and yields female by p191');
assert(String(pregnancyGenderFemaleReading.verdict?.text || '').includes('הוולד נקבה'), 'feminine H5 renders the exact p191 female rule');

// Non-invention guard: the four androgynous figures are not forced to male/female.
const pregnancyGenderUnresolvedReading = buildKashfReadingByQuestionId(PREGNANCY_UNRESOLVED_BOARD, 'q-gender', { question: 'מה מין הוולד?' });
assert(pregnancyGenderUnresolvedReading.primaryFormula?.result?.executorResult?.h5Pattern === '1111', 'gender unresolved guard board produces H5=1111 / דרך');
assert(pregnancyGenderUnresolvedReading.primaryFormula?.result?.executorResult?.gender === null, 'H5=1111 remains unresolved by the p191 masculine/feminine rule');
assert(pregnancyGenderUnresolvedReading.verdict?.positive === null && pregnancyGenderUnresolvedReading.overallPositive === null, 'androgynous H5 remains neutral');
assert(String(pregnancyGenderUnresolvedReading.verdict?.text || '').includes('אינו מכריע'), 'androgynous p191 result is explicit rather than fabricated');
// ── P6 theft-relationship H7 recurrence executor ---------------------
const thiefRelationshipRoute = assertRoute('q-thief-near', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'theft.thiefRelationship',
  kashfMethodId: 'theft.p224.relationshipH7Recurrence',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assert(canRunKashfMethod(thiefRelationshipRoute.kashfMethodId) === true, 'theft-relationship canonical method is explicitly runnable');

// No-recurrence guard: the normal pilot board has H7=1221 only at H7.
const thiefRelationshipNoRecurrence = buildKashfReadingByQuestionId(PILOT_BOARD, 'q-thief-near', { question: 'מה הקשר של הגנב לבעל הדבר?' });
assert(thiefRelationshipNoRecurrence.valid === true, 'q-thief-near executes through canonical custom allowlist');
assert(thiefRelationshipNoRecurrence.canonicalExecution?.methodsExecuted?.length === 1, 'q-thief-near executes exactly one method');
assert(thiefRelationshipNoRecurrence.canonicalExecution?.methodsExecuted?.[0] === 'theft.p224.relationshipH7Recurrence', 'q-thief-near executes the exact p224 recurrence method only');
assert(thiefRelationshipNoRecurrence.primaryFormula?.result?.executorResult?.h7Pattern === '1221', 'pilot board H7 remains 1221');
assert(thiefRelationshipNoRecurrence.primaryFormula?.result?.executorResult?.recurrenceHouses?.length === 0, 'pilot board has no H7 recurrence outside H7');
assert(thiefRelationshipNoRecurrence.primaryFormula?.houses?.length === 1 && thiefRelationshipNoRecurrence.primaryFormula.houses[0] === 7, 'no-recurrence traceability records only reference H7');
assert(thiefRelationshipNoRecurrence.primaryFormula?.result?.executorResult?.relationResolved === false, 'no recurrence does not invent a relationship');
assert(String(thiefRelationshipNoRecurrence.verdict?.text || '').includes('אינה חוזרת בבית אחר'), 'no-recurrence result is explicit');
assert(String(thiefRelationshipNoRecurrence.verdict?.text || '').includes('אינו מודד מרחק מספרי'), 'renamed route does not masquerade as a distance meter');

// Exact recurrence guard: this board has H7=1112 recurring only in H2.
const THIEF_H2_RECURRENCE_BOARD = buildRamlBoardFromMothers(['1111', '1112', '1111', '1121']);
const thiefRelationshipH2 = buildKashfReadingByQuestionId(THIEF_H2_RECURRENCE_BOARD, 'q-thief-near', { question: 'מה הקשר של הגנב לבעל הדבר?' });
assert(thiefRelationshipH2.primaryFormula?.result?.executorResult?.h7Pattern === '1112', 'recurrence guard board produces H7=1112');
assert(JSON.stringify(thiefRelationshipH2.primaryFormula?.result?.executorResult?.recurrenceHouses) === JSON.stringify([2]), 'H7=1112 recurs only in H2');
assert(JSON.stringify(thiefRelationshipH2.primaryFormula?.houses) === JSON.stringify([7, 2]), 'dynamic traceability records H7 reference plus H2 recurrence');
assert(thiefRelationshipH2.primaryFormula?.result?.executorResult?.sourceSupportedIndications?.[0]?.p224Connection === 'אחד מעוזריו של בעל הדבר', 'H2 recurrence resolves to the exact p224 helper connection');
assert(String(thiefRelationshipH2.verdict?.text || '').includes('אחד מעוזריו של בעל הדבר'), 'H2 recurrence renders the source connection');
assert(thiefRelationshipH2.verdict?.positive === null && thiefRelationshipH2.overallPositive === null, 'relationship lookup does not invent positive/negative sentiment');

// Dual-layer source guard: H4 recurrence preserves p224 and p225 as separate evidence.
const THIEF_H4_RECURRENCE_BOARD = buildRamlBoardFromMothers(['1111', '1111', '1121', '1122']);
const thiefRelationshipH4 = buildKashfReadingByQuestionId(THIEF_H4_RECURRENCE_BOARD, 'q-thief-near', { question: 'מה הקשר של הגנב לבעל הדבר?' });
assert(thiefRelationshipH4.primaryFormula?.result?.executorResult?.recurrenceHouses?.includes(4) === true, 'H4 guard board includes the source-relevant H4 recurrence');
assert(thiefRelationshipH4.primaryFormula?.result?.executorResult?.sourceSupportedIndications?.[0]?.p224Connection === 'מי שנכנס לביתו של בעל הדבר', 'p224 layer is preserved at H4');
assert(thiefRelationshipH4.primaryFormula?.result?.executorResult?.sourceSupportedIndications?.[0]?.p225KinshipRoot === 'אב', 'p225 kinship layer is preserved separately at H4');
assert(String(thiefRelationshipH4.verdict?.text || '').includes('עמ׳ 224') && String(thiefRelationshipH4.verdict?.text || '').includes('עמ׳ 225'), 'writer text does not silently merge the two source layers');

assert(thiefRelationshipH2.canonicalExecution?.altFormulaExecuted === false, 'q-thief-near does not execute alt formula');
assert(thiefRelationshipH2.canonicalExecution?.topicSupportingChecksExecuted === false, 'q-thief-near does not execute theft supporting checks');
assert(thiefRelationshipH2.canonicalExecution?.topicBundleExecuted === false, 'q-thief-near does not execute theft topic bundle');
const thiefRelationshipHtml = writeCanonicalKashfReading(thiefRelationshipH2);
assert(thiefRelationshipHtml.includes('theft.p224.relationshipH7Recurrence'), 'theft-relationship writer identifies exact canonical method');
assert(thiefRelationshipHtml.includes('אחד מעוזריו של בעל הדבר'), 'theft-relationship writer renders source connection');
assert(thiefRelationshipHtml.includes('הבית השביעי'), 'theft-relationship writer exposes the source rule');
assert(!thiefRelationshipHtml.includes('ניתוח תומך לפי ספר'), 'theft-relationship writer contains no broad theft support section');
assert(!thiefRelationshipHtml.includes('מחשבת השואל (הדמיר)'), 'theft-relationship writer contains no automatic Dhamir');
// ── P7 authority planetary executors -----------------------------------
assertRoute('q-fame', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'authority.honorCondition',
  kashfMethodId: 'authority.p256.honorConditionH10Planet',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assert(canRunKashfMethod('authority.p256.honorConditionH10Planet'), 'p256 honor-condition method is runnable only through its exact canonical executor');

const AUTHORITY_P256_SUN_BOARD = buildRamlBoardFromMothers(['1111', '1111', '1111', '2211']);
const authoritySun = buildKashfReadingByQuestionId(AUTHORITY_P256_SUN_BOARD, 'q-fame', { question: 'מצב הכבוד והמעמד' });
assert(authoritySun.valid === true && authoritySun.canRunKashf === true, 'p256 Sun board executes canonically');
assert(authoritySun.kashfMethodId === 'authority.p256.honorConditionH10Planet', 'p256 executes only the exact honor-condition method');
assert(JSON.stringify(authoritySun.primaryFormula?.houses) === JSON.stringify([10]), 'p256 traces only H10');
assert(authoritySun.primaryFormula?.result?.executorResult?.h10Pattern === '1122', 'p256 positive fixture has H10=1122');
assert(authoritySun.primaryFormula?.result?.executorResult?.planetHebrew === 'שמש', 'p256 resolves H10=1122 to Sun using the audited planet map');
assert(authoritySun.primaryFormula?.result?.executorResult?.condition === 'strong-honor-and-rank', 'p256 Sun branch preserves source-specific honor/rank meaning');
assert(authoritySun.overallPositive === true, 'p256 Sun branch is positive');
assert(authoritySun.canonicalExecution?.topicBundleExecuted === false, 'p256 does not execute broad authorityState bundle');
assert(authoritySun.dhamir === null, 'p256 does not auto-run Dhamir');
const authoritySunHtml = writeCanonicalKashfReading(authoritySun);
assert(authoritySunHtml.includes('authority.p256.honorConditionH10Planet'), 'p256 narrative exposes exact canonical method id');
assert(authoritySunHtml.includes('מצורות השמש'), 'p256 narrative preserves the Sun condition instead of promising fame');

const AUTHORITY_P256_SATURN_BOARD = buildRamlBoardFromMothers(['1111', '1111', '1111', '2221']);
const authoritySaturn = buildKashfReadingByQuestionId(AUTHORITY_P256_SATURN_BOARD, 'q-fame', { question: 'מצב הכבוד והמעמד' });
assert(authoritySaturn.primaryFormula?.result?.executorResult?.h10Pattern === '1112', 'p256 negative fixture has H10=1112');
assert(authoritySaturn.primaryFormula?.result?.executorResult?.planetHebrew === 'שבתאי', 'p256 resolves H10=1112 to Saturn');
assert(authoritySaturn.primaryFormula?.result?.executorResult?.condition === 'no-benefit-gloom-distress', 'p256 Saturn branch preserves the source-specific adverse condition');
assert(authoritySaturn.overallPositive === false, 'p256 Saturn branch is negative');

const AUTHORITY_P256_UNRESOLVED_BOARD = buildRamlBoardFromMothers(['1111', '1111', '1111', '1111']);
const authorityMercury = buildKashfReadingByQuestionId(AUTHORITY_P256_UNRESOLVED_BOARD, 'q-fame', { question: 'מצב הכבוד והמעמד' });
assert(authorityMercury.primaryFormula?.result?.executorResult?.h10Pattern === '2222', 'p256 unresolved fixture has H10=2222');
assert(authorityMercury.primaryFormula?.result?.executorResult?.planetHebrew === 'כוכב', 'p256 unresolved fixture maps H10=2222 to Mercury');
assert(authorityMercury.primaryFormula?.result?.executorResult?.condition === 'unresolved-by-source', 'p256 leaves Mercury unresolved because p256 excerpt gives no explicit judgment');
assert(authorityMercury.overallPositive === null, 'p256 unresolved branch does not invent a binary fame verdict');

assertRoute('q-position-keep', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'authority.appointmentStays',
  kashfMethodId: 'authority.p257.appointmentH1H10Planet',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assert(canRunKashfMethod('authority.p257.appointmentH1H10Planet'), 'p257 appointment method is runnable only through its exact canonical executor');

const AUTHORITY_P257_POSITIVE_BOARD = buildRamlBoardFromMothers(['1111', '1111', '1111', '1111']);
const authorityAppointmentYes = buildKashfReadingByQuestionId(AUTHORITY_P257_POSITIVE_BOARD, 'q-position-keep', { question: 'האם המינוי יתקיים' });
assert(authorityAppointmentYes.valid === true && authorityAppointmentYes.canRunKashf === true, 'p257 positive board executes canonically');
assert(authorityAppointmentYes.kashfMethodId === 'authority.p257.appointmentH1H10Planet', 'p257 executes only the exact appointment method');
assert(JSON.stringify(authorityAppointmentYes.primaryFormula?.houses) === JSON.stringify([1, 10]), 'p257 traces H1+H10');
assert(authorityAppointmentYes.primaryFormula?.result?.executorResult?.h1Pattern === '1111', 'p257 positive fixture carries H1=1111');
assert(authorityAppointmentYes.primaryFormula?.result?.executorResult?.h10Pattern === '2222', 'p257 positive fixture carries H10=2222');
assert(authorityAppointmentYes.primaryFormula?.result?.executorResult?.resultPattern === '1111', 'p257 combines H1+H10 into 1111');
assert(authorityAppointmentYes.primaryFormula?.result?.executorResult?.planetHebrew === 'ירח', 'p257 resolves combined 1111 to Moon');
assert(authorityAppointmentYes.primaryFormula?.result?.executorResult?.sourceClass === 'luminary', 'p257 identifies Moon as one of the two luminaries');
assert(authorityAppointmentYes.primaryFormula?.result?.executorResult?.appointmentCompletes === true, 'p257 luminary result completes the appointment');
assert(authorityAppointmentYes.overallPositive === true, 'p257 positive branch is positive');
assert(authorityAppointmentYes.altFormula === null, 'p257 does not aggregate another authority formula');
assert(authorityAppointmentYes.canonicalExecution?.topicBundleExecuted === false, 'p257 does not execute broad authorityState bundle');
assert(authorityAppointmentYes.dhamir === null, 'p257 does not auto-run Dhamir');
const authorityAppointmentHtml = writeCanonicalKashfReading(authorityAppointmentYes);
assert(authorityAppointmentHtml.includes('authority.p257.appointmentH1H10Planet'), 'p257 narrative exposes exact canonical method id');
assert(authorityAppointmentHtml.includes('משני המאורות'), 'p257 narrative preserves the luminary rule');

const AUTHORITY_P257_NEGATIVE_BOARD = buildRamlBoardFromMothers(['1111', '1111', '1111', '1112']);
const authorityAppointmentNo = buildKashfReadingByQuestionId(AUTHORITY_P257_NEGATIVE_BOARD, 'q-position-keep', { question: 'האם המינוי יתקיים' });
assert(authorityAppointmentNo.primaryFormula?.result?.executorResult?.resultPattern === '1112', 'p257 negative fixture combines to 1112');
assert(authorityAppointmentNo.primaryFormula?.result?.executorResult?.planetHebrew === 'שבתאי', 'p257 negative fixture resolves to Saturn');
assert(authorityAppointmentNo.primaryFormula?.result?.executorResult?.appointmentCompletes === false, 'p257 non-luminary/non-benefic planet means the appointment does not complete');
assert(authorityAppointmentNo.overallPositive === false, 'p257 negative branch is negative');




// ── P13 p172 matter-outcome source contract -------------------------------
assertRoute('q-matter-end', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'matter.outcome',
  kashfMethodId: 'matter.p172.h17_h1011_thenCombine',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assert(canRunKashfMethod('matter.p172.h17_h1011_thenCombine'), 'p172 matter-outcome method is explicitly runnable');

const p172Good = buildKashfReadingByQuestionId(
  makeP204Board({ 1: '1111', 7: '2222', 10: '1111', 11: '1122' }),
  'q-matter-end',
  { question: 'מה תהיה תוצאת העניין?' }
);
assert(p172Good.valid === true && p172Good.canRunKashf === true, 'p172 good fixture executes canonically');
assert(JSON.stringify(p172Good.primaryFormula?.houses) === JSON.stringify([1, 7, 10, 11]), 'p172 traces exactly H1+H7+H10+H11');
assert(p172Good.primaryFormula?.result?.executorResult?.firstSeventhPattern === '1111', 'p172 first generated figure is H1+H7');
assert(p172Good.primaryFormula?.result?.executorResult?.tenthEleventhPattern === '2211', 'p172 second generated figure is H10+H11');
assert(p172Good.primaryFormula?.result?.executorResult?.resultPattern === '1122', 'p172 final combination is generated from the two intermediate figures');
assert(p172Good.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'saad', 'p172 final pure benefic is classified source-safely');
assert(p172Good.primaryFormula?.result?.executorResult?.sourceOutcome === 'good', 'p172 pure benefic final figure means good outcome');
assert(p172Good.overallPositive === true, 'p172 good source outcome is positive');
assert(p172Good.altFormula === null, 'p172 does not aggregate completion p173 or other formulas');
assert(p172Good.canonicalExecution?.topicBundleExecuted === false, 'p172 does not execute broad general-reading bundle');
assert(p172Good.dhamir === null, 'p172 does not auto-run Dhamir');

const p172Bad = buildKashfReadingByQuestionId(
  makeP204Board({ 1: '1111', 7: '2222', 10: '1111', 11: '1112' }),
  'q-matter-end',
  { question: 'מה תהיה תוצאת העניין?' }
);
assert(p172Bad.primaryFormula?.result?.executorResult?.firstSeventhPattern === '1111', 'p172 bad fixture preserves first intermediate figure');
assert(p172Bad.primaryFormula?.result?.executorResult?.tenthEleventhPattern === '2221', 'p172 bad fixture generates second intermediate figure');
assert(p172Bad.primaryFormula?.result?.executorResult?.resultPattern === '1112', 'p172 bad fixture final result is pure malefic');
assert(p172Bad.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'nahs', 'p172 final pure malefic is classified source-safely');
assert(p172Bad.primaryFormula?.result?.executorResult?.sourceOutcome === 'bad', 'p172 pure malefic final figure means bad outcome');
assert(p172Bad.overallPositive === false, 'p172 bad source outcome is negative');

const p172Mixed = buildKashfReadingByQuestionId(
  makeP204Board({ 1: '1111', 7: '2222', 10: '1111', 11: '2212' }),
  'q-matter-end',
  { question: 'מה תהיה תוצאת העניין?' }
);
assert(p172Mixed.primaryFormula?.result?.executorResult?.tenthEleventhPattern === '1121', 'p172 mixed fixture generates expected second intermediate figure');
assert(p172Mixed.primaryFormula?.result?.executorResult?.resultPattern === '2212', 'p172 mixed fixture final result is canonical mixed figure');
assert(p172Mixed.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'mixed', 'p172 preserves mixed fortune class');
assert(p172Mixed.primaryFormula?.result?.executorResult?.classification?.mixedTendency === 'saad', 'p172 preserves mixed benefic inclination as metadata only');
assert(p172Mixed.primaryFormula?.result?.executorResult?.sourceOutcome === 'mixed', 'p172 mixed final figure remains mixed');
assert(p172Mixed.overallPositive === null, 'p172 mixed result is not collapsed into a binary verdict');

const p172Html = writeCanonicalKashfReading(p172Good);
assert(p172Html.includes('matter.p172.h17_h1011_thenCombine'), 'p172 narrative exposes exact method id');
assert(p172Html.includes('תוצאת עניינו של השואל'), 'p172 narrative preserves v57 Hebrew rule context');

// ── P12 p183 current place vs relocation source contract -----------------
assertRoute('q-move-home', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'relocation.isThisPlaceGood',
  kashfMethodId: 'relocation.p183.currentVsNewPlace',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assert(canRunKashfMethod('relocation.p183.currentVsNewPlace'), 'p183 current-vs-new relocation method is explicitly runnable');

const p183CurrentGood = buildKashfReadingByQuestionId(
  makeP204Board({ 1: '1122', 4: '1122', 7: '1112', 10: '1112' }),
  'q-move-home',
  { question: 'האם טוב לי להישאר כאן או לעבור?' }
);
assert(p183CurrentGood.valid === true && p183CurrentGood.canRunKashf === true, 'p183 current-place fixture executes canonically');
assert(JSON.stringify(p183CurrentGood.primaryFormula?.houses) === JSON.stringify([1, 4, 7, 10]), 'p183 traces exactly H1+H4+H7+H10');
assert(p183CurrentGood.primaryFormula?.result?.executorResult?.currentPlaceGood === true, 'p183 pure-benefic H1+H4 supports good residence');
assert(p183CurrentGood.primaryFormula?.result?.executorResult?.moveGood === false, 'p183 non-benefic H7+H10 does not satisfy positive move clause');
assert(p183CurrentGood.primaryFormula?.result?.executorResult?.sourceOutcome === 'current-place-good', 'p183 current-only source outcome is explicit');
assert(p183CurrentGood.overallPositive === null, 'p183 comparison remains descriptive rather than collapsing to sentiment');
assert(p183CurrentGood.altFormula === null, 'p183 does not aggregate alternate relocation formulas');
assert(p183CurrentGood.canonicalExecution?.topicBundleExecuted === false, 'p183 does not execute broad relocation bundle');
assert(p183CurrentGood.dhamir === null, 'p183 does not auto-run Dhamir');

const p183MoveGood = buildKashfReadingByQuestionId(
  makeP204Board({ 1: '1112', 4: '1112', 7: '1122', 10: '1122' }),
  'q-move-home',
  { question: 'האם טוב לי להישאר כאן או לעבור?' }
);
assert(p183MoveGood.primaryFormula?.result?.executorResult?.currentPlaceGood === false, 'p183 non-benefic H1+H4 does not satisfy positive residence clause');
assert(p183MoveGood.primaryFormula?.result?.executorResult?.moveGood === true, 'p183 pure-benefic H7+H10 supports good move');
assert(p183MoveGood.primaryFormula?.result?.executorResult?.sourceOutcome === 'move-good', 'p183 move-only source outcome is explicit');
assert(!p183MoveGood.primaryFormula?.result?.executorResult?.outputHebrew.includes('המקום הנוכחי רע'), 'p183 does not invent negative current-place clause');

const p183BothGood = buildKashfReadingByQuestionId(
  makeP204Board({ 1: '1122', 4: '1122', 7: '1122', 10: '1122' }),
  'q-move-home',
  { question: 'האם טוב לי להישאר כאן או לעבור?' }
);
assert(p183BothGood.primaryFormula?.result?.executorResult?.sourceOutcome === 'both-good', 'p183 preserves both positive source clauses when both pairs qualify');
assert(!p183BothGood.primaryFormula?.result?.executorResult?.outputHebrew.includes('טובה יותר'), 'p183 does not invent a ranking when both options qualify');

const p183MixedGuard = buildKashfReadingByQuestionId(
  makeP204Board({ 1: '2212', 4: '1122', 7: '1112', 10: '1112' }),
  'q-move-home',
  { question: 'האם טוב לי להישאר כאן או לעבור?' }
);
assert(p183MixedGuard.primaryFormula?.result?.executorResult?.houseResults?.find((x) => x.houseNumber === 1)?.classification?.saadNahs === 'mixed', 'p183 mixed guard sees canonical mixed H1');
assert(p183MixedGuard.primaryFormula?.result?.executorResult?.currentPlaceGood === false, 'p183 mixed H1 is not promoted to pure benefic');
assert(p183MixedGuard.primaryFormula?.result?.executorResult?.sourceOutcome === 'unresolved', 'p183 no-positive-pair case remains unresolved rather than invented negative');

const p183Html = writeCanonicalKashfReading(p183CurrentGood);
assert(p183Html.includes('relocation.p183.currentVsNewPlace'), 'p183 narrative exposes exact method id');
assert(p183Html.includes('טובת המגורים'), 'p183 narrative preserves v57 Hebrew residence wording');

// ── P11 p204 attention/look source contract ------------------------------
assertRoute('q-who-looks-love', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'love.attention',
  kashfMethodId: 'love.p204.attentionFireRows1713',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assert(canRunKashfMethod('love.p204.attentionFireRows1713'), 'p204 attention method is explicitly runnable');

const p204Attention = buildKashfReadingByQuestionId(
  makeP204Board({ 1: '1111', 7: '1121', 13: '2222' }),
  'q-who-looks-love',
  { question: 'האם אדם זה מביט אלי או אל אחר?' }
);
assert(p204Attention.valid === true && p204Attention.canRunKashf === true, 'p204 attention source condition executes canonically');
assert(p204Attention.kashfMethodId === 'love.p204.attentionFireRows1713', 'p204 attention uses exact canonical method id');
assert(JSON.stringify(p204Attention.primaryFormula?.houses) === JSON.stringify([1, 7, 13]), 'p204 attention traces H1+H7+H13 only');
assert(p204Attention.primaryFormula?.result?.executorResult?.fireRows?.h1 === 'open', 'p204 attention reads one-point H1 fire as open');
assert(p204Attention.primaryFormula?.result?.executorResult?.fireRows?.h7 === 'open', 'p204 attention reads one-point H7 fire as open');
assert(p204Attention.primaryFormula?.result?.executorResult?.fireRows?.h13 === 'joined', 'p204 attention reads two-point H13 fire as joined/closed');
assert(p204Attention.primaryFormula?.result?.executorResult?.sourceConditionMet === true, 'p204 attention exact three-row source condition is met');
assert(p204Attention.primaryFormula?.result?.executorResult?.attention === 'mutual-and-others', 'p204 attention returns only the explicit mutual-and-others source result');
assert(p204Attention.primaryFormula?.result?.executorResult?.attentionHebrew === 'שניהם מביטים זה בזה וגם באחרים', 'p204 attention preserves exact Hebrew result');
assert(p204Attention.overallPositive === null, 'p204 attention is descriptive rather than positive/negative');
assert(p204Attention.altFormula === null, 'p204 attention does not aggregate alternate marriage/love formulas');
assert(p204Attention.canonicalExecution?.topicBundleExecuted === false, 'p204 attention does not execute broad marriage bundle');
assert(p204Attention.dhamir === null, 'p204 attention does not auto-run Dhamir');
assert(!p204Attention.primaryFormula?.result?.executorResult?.outputHebrew.includes('אוהב'), 'p204 attention does not convert gaze/attention into a love verdict');

const p204AttentionOtherCombination = buildKashfReadingByQuestionId(
  makeP204Board({ 1: '1111', 7: '1121', 13: '1111' }),
  'q-who-looks-love',
  { question: 'האם אדם זה מביט אלי או אל אחר?' }
);
assert(p204AttentionOtherCombination.primaryFormula?.result?.executorResult?.fireRows?.h13 === 'open', 'p204 attention guard fixture has H13 fire open');
assert(p204AttentionOtherCombination.primaryFormula?.result?.executorResult?.sourceConditionMet === false, 'p204 attention rejects a row combination not stated in the p204 clause');
assert(p204AttentionOtherCombination.primaryFormula?.result?.executorResult?.attention === null, 'p204 attention does not import the p170 other-person branch');
assert(p204AttentionOtherCombination.overallPositive === null, 'p204 attention unresolved branch remains non-sentiment');

const p204AttentionHtml = writeCanonicalKashfReading(p204Attention);
assert(p204AttentionHtml.includes('love.p204.attentionFireRows1713'), 'p204 attention narrative exposes exact method id');
assert(p204AttentionHtml.includes('שניהם מביטים זה בזה וגם באחרים'), 'p204 attention narrative preserves v57 p204 result');

// ── P10 corrected marriage p204 source contracts -----------------------
function makeP204Board(overrides = {}) {
  return {
    entries: Array.from({ length: 16 }, (_, index) => {
      const house = index + 1;
      const pattern = overrides[house] || '2222';
      return { house, houseNumber: house, pattern, key: pattern, hebrewName: pattern };
    }),
    boardValidation: { isValid: true, warnings: [] },
  };
}

assertRoute('q-marriage-thayib', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'marriage.previousStatus',
  kashfMethodId: 'marriage.p204.previousStatusH7inH10',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assert(canRunKashfMethod('marriage.p204.previousStatusH7inH10'), 'corrected p204 previous-status method is explicitly runnable');
assert(!getKashfMethod('marriage.p204.previousStatusH7'), 'misleading old p204 H7-only method id no longer exists');

const previousStatusDivorced = buildKashfReadingByQuestionId(makeP204Board({ 7: '1121', 10: '1121' }), 'q-marriage-thayib', { question: 'האם האישה בתולה או גרושה?' });
assert(previousStatusDivorced.valid === true && previousStatusDivorced.canRunKashf === true, 'p204 repeated mutable H7 executes canonically');
assert(previousStatusDivorced.kashfMethodId === 'marriage.p204.previousStatusH7inH10', 'p204 executes corrected H7-in-H10 method id');
assert(JSON.stringify(previousStatusDivorced.primaryFormula?.houses) === JSON.stringify([7, 10]), 'p204 previous-status traces H7+H10');
assert(previousStatusDivorced.primaryFormula?.result?.executorResult?.recursInH10 === true, 'p204 verifies H7 recurrence in H10 before judging status');
assert(previousStatusDivorced.primaryFormula?.result?.executorResult?.figureClass === 'mutable', 'p204 repeated 1121 is source-defined mutable');
assert(previousStatusDivorced.primaryFormula?.result?.executorResult?.previousStatus === 'divorced', 'p204 mutable recurrence returns divorced exactly');
assert(previousStatusDivorced.primaryFormula?.result?.executorResult?.previousStatusHebrew === 'גרושה', 'p204 renders source category גרושה');
assert(previousStatusDivorced.overallPositive === null, 'p204 previous status remains descriptive, not positive/negative');
assert(previousStatusDivorced.altFormula === null, 'p204 previous-status does not aggregate marriage alternatives');
assert(previousStatusDivorced.canonicalExecution?.topicBundleExecuted === false, 'p204 previous-status does not execute broad marriage bundle');
assert(previousStatusDivorced.dhamir === null, 'p204 previous-status does not auto-run Dhamir');
const previousStatusDivorcedHtml = writeCanonicalKashfReading(previousStatusDivorced);
assert(previousStatusDivorcedHtml.includes('marriage.p204.previousStatusH7inH10'), 'p204 narrative exposes corrected method id');
assert(previousStatusDivorcedHtml.includes('גרושה'), 'p204 narrative preserves explicit divorced result');
assert(!previousStatusDivorcedHtml.includes('אלמנה'), 'p204 runtime does not invent widow result');

const previousStatusVirgin = buildKashfReadingByQuestionId(makeP204Board({ 7: '2222', 10: '2222' }), 'q-marriage-thayib', { question: 'האם האישה בתולה או גרושה?' });
assert(previousStatusVirgin.primaryFormula?.result?.executorResult?.recursInH10 === true, 'p204 fixed fixture also requires recurrence');
assert(previousStatusVirgin.primaryFormula?.result?.executorResult?.figureClass === 'fixed', 'p204 repeated 2222 is source-defined fixed');
assert(previousStatusVirgin.primaryFormula?.result?.executorResult?.previousStatus === 'virgin', 'p204 fixed recurrence returns virgin');
assert(previousStatusVirgin.primaryFormula?.result?.executorResult?.previousStatusHebrew === 'בתולה', 'p204 renders exact virgin result');

const previousStatusNoRecurrence = buildKashfReadingByQuestionId(makeP204Board({ 7: '1121', 10: '2222' }), 'q-marriage-thayib', { question: 'האם האישה בתולה או גרושה?' });
assert(previousStatusNoRecurrence.primaryFormula?.result?.executorResult?.recursInH10 === false, 'p204 detects when H7 does not recur in H10');
assert(previousStatusNoRecurrence.primaryFormula?.result?.executorResult?.previousStatus === null, 'p204 does not judge status without H7 recurrence in H10');
assert(previousStatusNoRecurrence.overallPositive === null, 'p204 no-recurrence branch stays unresolved');

const previousStatusOtherClass = buildKashfReadingByQuestionId(makeP204Board({ 7: '1112', 10: '1112' }), 'q-marriage-thayib', { question: 'האם האישה בתולה או גרושה?' });
assert(previousStatusOtherClass.primaryFormula?.result?.executorResult?.recursInH10 === true, 'p204 other-class fixture has required recurrence');
assert(previousStatusOtherClass.primaryFormula?.result?.executorResult?.figureClass === 'other-source-class', 'p204 keeps outgoing/incoming figure outside fixed/mutable source classes');
assert(previousStatusOtherClass.primaryFormula?.result?.executorResult?.previousStatus === null, 'p204 repeated other-class figure remains unresolved');

assertRoute('q-dowry', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'marriage.dowryAmount',
  kashfMethodId: 'marriage.p204.dowryH8',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assert(canRunKashfMethod('marriage.p204.dowryH8'), 'p204 H8 dowry method is explicitly runnable');

const dowryLarge = buildKashfReadingByQuestionId(makeP204Board({ 8: '1122' }), 'q-dowry', { question: 'האם המוהר גדול?' });
assert(dowryLarge.valid === true, 'p204 dowry benefic fixture executes canonically');
assert(JSON.stringify(dowryLarge.primaryFormula?.houses) === JSON.stringify([8]), 'p204 dowry traces only H8');
assert(dowryLarge.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'saad', 'p204 dowry fixture has pure benefic H8');
assert(dowryLarge.primaryFormula?.result?.executorResult?.isLargeDowry === true, 'p204 benefic H8 explicitly yields large mahr');
assert(dowryLarge.overallPositive === null, 'dowry size is descriptive rather than normative positive/negative');
assert(dowryLarge.canonicalExecution?.topicBundleExecuted === false, 'p204 dowry does not execute broad marriage bundle');
assert(dowryLarge.dhamir === null, 'p204 dowry does not auto-run Dhamir');
const dowryLargeHtml = writeCanonicalKashfReading(dowryLarge);
assert(dowryLargeHtml.includes('marriage.p204.dowryH8'), 'p204 dowry narrative exposes exact method id');
assert(dowryLargeHtml.includes('המוהר גדול'), 'p204 dowry narrative preserves exact large-mahr statement');

const dowryMalefic = buildKashfReadingByQuestionId(makeP204Board({ 8: '1112' }), 'q-dowry', { question: 'האם המוהר גדול?' });
assert(dowryMalefic.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'nahs', 'p204 dowry malefic fixture is classified as malefic');
assert(dowryMalefic.primaryFormula?.result?.executorResult?.isLargeDowry === null, 'p204 does not turn malefic H8 into an unsourced small-mahr verdict');
assert(dowryMalefic.overallPositive === null, 'p204 malefic H8 stays unresolved for mahr size');

const dowryMixed = buildKashfReadingByQuestionId(makeP204Board({ 8: '2212' }), 'q-dowry', { question: 'האם המוהר גדול?' });
assert(dowryMixed.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'mixed', 'p204 dowry preserves mixed H8');
assert(dowryMixed.primaryFormula?.result?.executorResult?.isLargeDowry === null, 'p204 mixed H8 does not invent a dowry-size verdict');
assert(dowryMixed.overallPositive === null, 'p204 mixed H8 remains unresolved');

// ── P9 source-safe mixed classification --------------------------------
const canonicalMixedFigures = [
  ['1111', 'nahs'], // דרך — ממוזג-מזיק
  ['1121', 'saad'], // נלחם — ממוזג-מיטיב
  ['1211', 'saad'], // בר הלחי — ממוזג-מיטיב
  ['2112', 'nahs'], // חיבור — ממוזג-מזיק
  ['2212', 'saad'], // לבן — ממוזג-מיטיב
  ['2222', 'nahs'], // קהלה — ממוזג-מזיק
];
for (const [pattern, tendency] of canonicalMixedFigures) {
  const detail = getCanonicalSaadNahsDetail(pattern);
  assert(detail.saadNahs === 'mixed', 'canonical mixed classifier preserves mixed for ' + pattern);
  assert(detail.mixedTendency === tendency, 'canonical mixed classifier preserves tendency metadata for ' + pattern);
}
assert(getCanonicalSaadNahsDetail('1122').saadNahs === 'saad', 'canonical classifier preserves pure benefic figure');
assert(getCanonicalSaadNahsDetail('1112').saadNahs === 'nahs', 'canonical classifier preserves pure malefic figure');

function makeP9Board(overrides = {}) {
  return {
    entries: Array.from({ length: 16 }, (_, index) => {
      const house = index + 1;
      const pattern = overrides[house] || '2222';
      return { house, houseNumber: house, pattern, key: pattern, hebrewName: pattern };
    }),
    boardValidation: { isValid: true, warnings: [] },
  };
}

const relocationMixedBoard = makeP9Board({ 4: '1111', 15: '2222' });
const relocationMixedReading = buildKashfReadingByQuestionId(relocationMixedBoard, 'q-move-city', { question: 'האם כדאי לעבור מקום?' });
assert(relocationMixedReading.valid === true, 'relocation mixed regression executes canonically');
assert(relocationMixedReading.primaryFormula?.result?.resultPattern === '1111', 'relocation mixed fixture produces Road');
assert(relocationMixedReading.primaryFormula?.result?.classification?.saadNahs === 'mixed', 'relocation canonical formula exposes mixed instead of collapsing it to nahs');
assert(relocationMixedReading.primaryFormula?.result?.classification?.mixedTendency === 'nahs', 'relocation mixed tendency remains metadata only');
assert(relocationMixedReading.verdict?.text === 'המקום ממוצע — לא מצוין אך לא מזיק', 'relocation reaches its explicit mixed verdict branch');
assert(relocationMixedReading.overallPositive === null, 'relocation mixed branch remains non-binary');

assertRoute('q-ruler-status', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'authority.rulerCondition',
  kashfMethodId: 'authority.p257.rulerConditionH7H10',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assert(canRunKashfMethod('authority.p257.rulerConditionH7H10') === true, 'p257 ruler-condition method is explicitly runnable');

const rulerGood = buildKashfReadingByQuestionId(makeP9Board({ 7: '1122', 10: '2222' }), 'q-ruler-status', { question: 'מה מצב בעל השררה?' });
assert(rulerGood.valid === true, 'p257 ruler good fixture executes canonically');
assert(rulerGood.canonicalExecution?.methodsExecuted?.length === 1, 'p257 ruler executes exactly one method');
assert(rulerGood.canonicalExecution?.methodsExecuted?.[0] === 'authority.p257.rulerConditionH7H10', 'p257 ruler executes exact canonical method');
assert(JSON.stringify(rulerGood.primaryFormula?.houses) === JSON.stringify([7, 10]), 'p257 ruler traces H7+H10 only');
assert(rulerGood.primaryFormula?.result?.executorResult?.resultPattern === '1122', 'p257 ruler good fixture produces 1122');
assert(rulerGood.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'saad', 'p257 ruler good result is benefic');
assert(rulerGood.overallPositive === true, 'p257 ruler benefic result is positive');
assert(rulerGood.canonicalExecution?.topicBundleExecuted === false, 'p257 ruler does not execute broad authority bundle');
assert(rulerGood.dhamir == null, 'p257 ruler does not auto-run Dhamir');

const rulerBad = buildKashfReadingByQuestionId(makeP9Board({ 7: '1112', 10: '2222' }), 'q-ruler-status', { question: 'מה מצב בעל השררה?' });
assert(rulerBad.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'nahs', 'p257 ruler bad result is malefic');
assert(rulerBad.overallPositive === false, 'p257 ruler malefic result is negative');

const rulerMixed = buildKashfReadingByQuestionId(makeP9Board({ 7: '1111', 10: '2222' }), 'q-ruler-status', { question: 'מה מצב בעל השררה?' });
assert(rulerMixed.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'mixed', 'p257 ruler mixed result stays mixed');
assert(rulerMixed.primaryFormula?.result?.executorResult?.rulerCondition === null, 'p257 ruler mixed branch remains unresolved by this source rule');
assert(rulerMixed.overallPositive === null, 'p257 ruler mixed branch does not invent positive or negative verdict');

// ── P11 lost-item return p202 executor ---------------------------------
assertRoute('q-lost-item', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'lostItem.return',
  kashfMethodId: 'lostItem.p202.returnH6H8',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assert(canRunKashfMethod('lostItem.p202.returnH6H8') === true, 'p202 lost-item return method is explicitly runnable');

const lostReturnYes = buildKashfReadingByQuestionId(makeP9Board({ 6: '2111', 8: '2121' }), 'q-lost-item', { question: 'האם האבדה תשוב?' });
assert(lostReturnYes.valid === true && lostReturnYes.canRunKashf === true, 'p202 lost-item positive fixture executes canonically');
assert(lostReturnYes.canonicalExecution?.methodsExecuted?.length === 1, 'p202 lost-item executes exactly one method');
assert(lostReturnYes.canonicalExecution?.methodsExecuted?.[0] === 'lostItem.p202.returnH6H8', 'p202 lost-item executes exact canonical method');
assert(JSON.stringify(lostReturnYes.primaryFormula?.houses) === JSON.stringify([6, 8]), 'p202 lost-item traces H6+H8 only');
assert(lostReturnYes.primaryFormula?.result?.executorResult?.h6Classification?.saadNahs === 'saad', 'p202 H6 positive fixture is benefic');
assert(lostReturnYes.primaryFormula?.result?.executorResult?.h6Classification?.dakhalKharij === 'dakhil', 'p202 H6 positive fixture is internal');
assert(lostReturnYes.primaryFormula?.result?.executorResult?.h8Classification?.saadNahs === 'saad', 'p202 H8 positive fixture is benefic');
assert(lostReturnYes.primaryFormula?.result?.executorResult?.h8Classification?.dakhalKharij === 'dakhil', 'p202 H8 positive fixture is internal');
assert(lostReturnYes.primaryFormula?.result?.executorResult?.returns === true, 'p202 both benefic+internal houses mean return');
assert(lostReturnYes.overallPositive === true, 'p202 return branch is positive');
assert(lostReturnYes.verdict?.text.includes('האבדה תשוב'), 'p202 return verdict preserves source meaning');
assert(lostReturnYes.altFormula === null, 'p202 does not aggregate lost-item alternatives');
assert(lostReturnYes.canonicalExecution?.topicBundleExecuted === false, 'p202 does not execute broad lost-animal/theft bundle');
assert(lostReturnYes.dhamir === null, 'p202 does not auto-run Dhamir');

const lostReturnMixedNo = buildKashfReadingByQuestionId(makeP9Board({ 6: '2212', 8: '2111' }), 'q-lost-item', { question: 'האם האבדה תשוב?' });
assert(lostReturnMixedNo.primaryFormula?.result?.executorResult?.h6Classification?.saadNahs === 'mixed', 'p202 mixed-benefic tendency remains mixed');
assert(lostReturnMixedNo.primaryFormula?.result?.executorResult?.h6Qualifies === false, 'p202 mixed figure is not promoted to explicit benefic+internal');
assert(lostReturnMixedNo.primaryFormula?.result?.executorResult?.returns === false, 'p202 mixed H6 fails exact return condition');
assert(lostReturnMixedNo.overallPositive === false, 'p202 source otherwise-no branch is negative');

const lostReturnOutgoingNo = buildKashfReadingByQuestionId(makeP9Board({ 6: '2111', 8: '1122' }), 'q-lost-item', { question: 'האם האבדה תשוב?' });
assert(lostReturnOutgoingNo.primaryFormula?.result?.executorResult?.h8Classification?.saadNahs === 'saad', 'p202 outgoing negative fixture remains benefic in quality');
assert(lostReturnOutgoingNo.primaryFormula?.result?.executorResult?.h8Classification?.dakhalKharij === 'kharij', 'p202 outgoing negative fixture is explicitly external');
assert(lostReturnOutgoingNo.primaryFormula?.result?.executorResult?.h8Qualifies === false, 'p202 benefic but outgoing H8 fails internal condition');
assert(lostReturnOutgoingNo.primaryFormula?.result?.executorResult?.returns === false, 'p202 benefic-but-outgoing branch does not return');

const lostAnimalRoute = assertRoute('q-lost-animal', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'lostItem.return',
  kashfMethodId: 'lostItem.p202.returnH6H8',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assert(lostAnimalRoute.aliasOf === 'q-lost-item', 'q-lost-animal remains an explicit alias of the same p202 return method');
const lostAnimalReading = buildKashfReadingByQuestionId(makeP9Board({ 6: '2111', 8: '2121' }), 'q-lost-animal', { question: 'האם החיה האבודה תחזור?' });
assert(lostAnimalReading.primaryFormula?.result?.executorResult?.returns === true, 'q-lost-animal alias reaches the same exact p202 executor');
assert(lostAnimalReading.canonicalExecution?.methodsExecuted?.length === 1, 'q-lost-animal alias still executes one method only');

// ── P12 hidden-item p188 executor --------------------------------------
assertRoute('q-treasure', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'hidden.isStillThere',
  kashfMethodId: 'hidden.p188.isStillThere',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assert(canRunKashfMethod('hidden.p188.isStillThere') === true, 'p188 hidden-item method is explicitly runnable');

const hiddenYes = buildKashfReadingByQuestionId(makeP9Board({
  1: '1122', 2: '1222', 4: '2111', 13: '2121', 14: '2211', 15: '1122',
}), 'q-treasure', { question: 'האם הדבר הנסתר עדיין במקום?' });
assert(hiddenYes.valid === true && hiddenYes.canRunKashf === true, 'p188 hidden positive fixture executes canonically');
assert(hiddenYes.canonicalExecution?.methodsExecuted?.length === 1, 'p188 hidden executes exactly one method');
assert(hiddenYes.canonicalExecution?.methodsExecuted?.[0] === 'hidden.p188.isStillThere', 'p188 hidden executes exact canonical method');
assert(JSON.stringify(hiddenYes.primaryFormula?.houses) === JSON.stringify([1, 2, 4, 13, 14, 15]), 'p188 hidden traces exactly six source houses');
assert(hiddenYes.primaryFormula?.result?.executorResult?.houseResults?.every((item) => item.classification.saadNahs === 'saad'), 'p188 positive fixture has all six houses explicitly benefic');
assert(hiddenYes.primaryFormula?.result?.executorResult?.presentInPlace === true, 'p188 all-benefic branch means hidden thing is in place');
assert(hiddenYes.overallPositive === true, 'p188 in-place branch is positive');
assert(hiddenYes.verdict?.text.includes('נמצא עדיין במקום'), 'p188 verdict states still in tested place');
assert(hiddenYes.canonicalExecution?.topicBundleExecuted === false, 'p188 hidden does not execute broad hidden-treasure bundle');
assert(hiddenYes.altFormula === null, 'p188 hidden does not execute direction/recast alternatives');
assert(hiddenYes.dhamir === null, 'p188 hidden does not auto-run Dhamir');

const hiddenNo = buildKashfReadingByQuestionId(makeP9Board({
  1: '1122', 2: '1222', 4: '1112', 13: '2121', 14: '2211', 15: '1122',
}), 'q-treasure', { question: 'האם הדבר הנסתר עדיין במקום?' });
assert(hiddenNo.primaryFormula?.result?.executorResult?.houseResults?.find((item) => item.houseNumber === 4)?.classification?.saadNahs === 'nahs', 'p188 negative fixture has H4 explicitly malefic');
assert(hiddenNo.primaryFormula?.result?.executorResult?.presentInPlace === false, 'p188 one non-benefic source house fails all-benefic condition');
assert(hiddenNo.overallPositive === false, 'p188 source otherwise-not-there branch is negative');
assert(hiddenNo.verdict?.text.includes('אינו במקום הנבדק'), 'p188 negative verdict says not in tested place');

const hiddenMixedNo = buildKashfReadingByQuestionId(makeP9Board({
  1: '1122', 2: '1222', 4: '2212', 13: '2121', 14: '2211', 15: '1122',
}), 'q-treasure', { question: 'האם הדבר הנסתר עדיין במקום?' });
assert(hiddenMixedNo.primaryFormula?.result?.executorResult?.houseResults?.find((item) => item.houseNumber === 4)?.classification?.saadNahs === 'mixed', 'p188 mixed figure remains mixed');
assert(hiddenMixedNo.primaryFormula?.result?.executorResult?.presentInPlace === false, 'p188 mixed tendency is not promoted to benefic');

// ── P12 illness recovery p196 H15 executor ----------------------------
const illnessRecovers = buildKashfReadingByQuestionId(makeP9Board({ 15: '1122' }), 'q-illness-heal', { question: 'האם החולה יחלים?' });
assert(illnessRecovers.valid === true, 'p196 benefic H15 executes canonically');
assert(JSON.stringify(illnessRecovers.primaryFormula?.houses) === JSON.stringify([15]), 'p196 traces H15 only');
assert(illnessRecovers.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'saad', 'p196 positive fixture is pure benefic');
assert(illnessRecovers.primaryFormula?.result?.executorResult?.recoveryStatus === 'recovers', 'p196 benefic H15 gives recovery');
assert(illnessRecovers.primaryFormula?.result?.executorResult?.recovers === true, 'p196 benefic H15 records explicit recovery');
assert(illnessRecovers.overallPositive === true, 'p196 benefic branch is positive');
assert(illnessRecovers.canonicalExecution?.methodsExecuted?.length === 1, 'p196 executes exactly one method');
assert(illnessRecovers.canonicalExecution?.topicBundleExecuted === false, 'p196 does not execute broad illness bundle');
assert(illnessRecovers.dhamir == null, 'p196 does not auto-run Dhamir');

const illnessProlonged = buildKashfReadingByQuestionId(makeP9Board({ 15: '1112' }), 'q-illness-heal', { question: 'האם החולה יחלים?' });
assert(illnessProlonged.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'nahs', 'p196 prolonged fixture is pure malefic');
assert(illnessProlonged.primaryFormula?.result?.executorResult?.recoveryStatus === 'prolonged-illness', 'p196 malefic H15 means prolonged illness');
assert(illnessProlonged.primaryFormula?.result?.executorResult?.recovers === null, 'p196 malefic H15 does not invent a categorical no-recovery verdict');
assert(illnessProlonged.overallPositive === null, 'p196 prolongation remains non-binary');
assert(illnessProlonged.verdict?.text?.includes('המחלה תתארך'), 'p196 prolonged branch preserves exact source sense');
assert(!illnessProlonged.verdict?.text?.includes('ימות'), 'p196 H15 malefic branch does not invent death');
assert(!illnessProlonged.verdict?.text?.includes('לא יתרפא'), 'p196 H15 malefic branch does not invent permanent non-recovery');

const illnessMixed = buildKashfReadingByQuestionId(makeP9Board({ 15: '1111' }), 'q-illness-heal', { question: 'האם החולה יחלים?' });
assert(illnessMixed.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'mixed', 'p196 mixed fixture stays mixed');
assert(illnessMixed.primaryFormula?.result?.executorResult?.recoveryStatus === 'unresolved', 'p196 mixed branch remains unresolved');
assert(illnessMixed.primaryFormula?.result?.executorResult?.recovers === null, 'p196 mixed branch does not invent recovery');
assert(illnessMixed.overallPositive === null, 'p196 mixed branch remains non-binary');

const illnessHtml = writeCanonicalKashfReading(illnessRecovers);
assert(illnessHtml.includes('illness.p196.outcomeH15'), 'p196 narrative exposes exact canonical method id');
assert(illnessHtml.includes('החולה יתרפא'), 'p196 narrative preserves recovery wording');
assert(!illnessHtml.includes('עדים ודיין'), 'p196 narrative does not aggregate broader illness witnesses/judge');

// ── Canonical execution isolation ----------------------------------------
for (const qid of ['q-success', 'q-travel-safe', 'q-short-travel', 'q-move-city', 'q-siblings']) {
  const reading = buildKashfReadingByQuestionId(PILOT_BOARD, qid, { question: qid });
  assert(reading.valid === true, `${qid}: canonical pilot reading executes successfully`);
  assert(Array.isArray(reading.canonicalExecution?.methodsExecuted), `${qid}: execution evidence contains methodsExecuted`);
  assert(reading.canonicalExecution?.methodsExecuted.length === 1, `${qid}: exactly one method executed`);
  assert(reading.canonicalExecution?.altFormulaExecuted === false, `${qid}: alt formula did not execute`);
  assert(reading.canonicalExecution?.topicSupportingChecksExecuted === false, `${qid}: topic supporting checks did not execute`);
  assert(reading.canonicalExecution?.topicBundleExecuted === false, `${qid}: topic bundle did not execute`);
  assert(reading.overallPositive === reading.verdict?.positive, `${qid}: overall verdict is only the canonical method verdict`);

  // Existing writer compatibility shape — intentionally empty alternatives.
  assert(reading.primaryFormula?.verdict === reading.verdict, `${qid}: renderer-compatible primaryFormula points to canonical verdict`);
  assert(reading.altFormula === null, `${qid}: renderer-compatible altFormula is explicitly null`);
  assert(Array.isArray(reading.supportingFindings) && reading.supportingFindings.length === 0, `${qid}: renderer-compatible supportingFindings is empty`);
  assert(Array.isArray(reading.keyHouseReadings) && reading.keyHouseReadings.length === 0, `${qid}: no broad topic houses leak into canonical reading`);
  assert(typeof reading.topicHebrewName === 'string' && reading.topicHebrewName.length > 0, `${qid}: renderer-compatible topicHebrewName is present`);

  // Canonical writer must render ONLY executed method evidence.
  const html = writeCanonicalKashfReading(reading);
  assert(html.includes('השיטה הקנונית'), `${qid}: canonical writer shows method-scoped details`);
  assert(html.includes(reading.kashfMethodId), `${qid}: canonical writer identifies the exact method`);
  assert(!html.includes('בדיקת אימות נוספת'), `${qid}: canonical writer does not invent/render alt formula`);
  assert(!html.includes('ניתוח תומך לפי ספר'), `${qid}: canonical writer does not render broad topic supporting checks`);
  assert(!html.includes('מחשבת השואל (הדמיר)'), `${qid}: canonical writer does not render Dhamir automatically`);
  assert(!html.includes('עדים ודיין'), `${qid}: canonical writer does not render witness/judge bundle automatically`);
}

const blockedPromiseReading = buildKashfReadingByQuestionId(PILOT_BOARD, 'q-promise');
assert(blockedPromiseReading.canRunKashf === false || blockedPromiseReading.valid === false, 'educational q-promise never reaches canonical executor');
const blockedPromiseHtml = writeCanonicalKashfReading(blockedPromiseReading);
assert(blockedPromiseHtml.includes('ספריית הלימוד'), 'educational q-promise renders an explanatory block instead of a verdict');
assert(!blockedPromiseHtml.includes('הפסיקה:'), 'educational q-promise HTML contains no verdict');

const blockedSorceryReading = buildKashfReadingByQuestionId(PILOT_BOARD, 'q-sorcery');
assert(blockedSorceryReading.canRunKashf === false || blockedSorceryReading.valid === false, 'unsupported q-sorcery never reaches p167 executor');
const blockedSorceryHtml = writeCanonicalKashfReading(blockedSorceryReading);
assert(!blockedSorceryHtml.includes('הפסיקה:'), 'unsupported q-sorcery HTML contains no verdict');


// HTML escaping is mandatory because client question/name are user input.
const escapedReading = buildKashfReadingByQuestionId(PILOT_BOARD, 'q-success', {
  name: '<script>alert(1)</script>',
  question: '<img src=x onerror=alert(1)>',
});
const escapedHtml = writeCanonicalKashfReading(escapedReading);
assert(!escapedHtml.includes('<script>alert(1)</script>'), 'canonical writer escapes client name HTML');
assert(!escapedHtml.includes('<img src=x onerror=alert(1)>'), 'canonical writer escapes client question HTML');
assert(escapedHtml.includes('&lt;script&gt;'), 'escaped client name remains visible as text');

console.log(`Kashf canonical routing tests: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
