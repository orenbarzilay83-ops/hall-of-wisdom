import assert from 'node:assert/strict';

import { getKashfMethod, validateKashfMethodRegistry } from './goral-hachol/registry/kashf-canonical-method-registry.js';
import { KASHF_QUESTION_ROUTES } from './goral-hachol/registry/kashf-question-route-registry.js';
import { buildKashfCanonicalAiBridge } from './goral-hachol/intelligence/kashf-canonical-ai-bridge.js';
import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import {
  KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS,
  isKashfMethodProfessionallyCertified,
} from './goral-hachol/intelligence/kashf-professional-verdict-safety.js';

// 2026-10-06: the live GPT system prompt
// (supabase/functions/oren-smart-advisor/oren-smart-advisor-brain-prompt.ts)
// forces clientAnswerDraft=null whenever a method's certificationStatus is
// not "certified" or clientFacingCertified is not true -- REGARDLESS of
// aiVerdictAllowed. Found this round: thirteen pre-existing, already-routed,
// ready methods had no certification entry at all, so every one of those
// already-shipped questions was silently producing no client-facing draft
// through the AI path despite a correct, ready computation underneath.
// This file is a standing regression test: every ready/routed/runnable
// method must carry a certification entry, so this gap cannot silently
// reopen (e.g. a future round adds a new ready+routed method and forgets
// the professional-verdict-safety policy, exactly as happened to these
// thirteen).

assert.equal(validateKashfMethodRegistry().valid, true);

function allReadyRoutedRunnableMethodIds() {
  const ids = new Set();
  for (const route of Object.values(KASHF_QUESTION_ROUTES)) {
    if (!route.kashfMethodId) continue;
    const method = getKashfMethod(route.kashfMethodId);
    if (!method) continue;
    if (method.kashfRuntimeStatus === 'ready' && method.runtimeAllowed === true && method.executorStatus === 'ready') {
      ids.add(route.kashfMethodId);
    }
  }
  return ids;
}

const readyRoutedRunnable = allReadyRoutedRunnableMethodIds();
assert(readyRoutedRunnable.size >= 86, `sanity: at least 86 ready/routed/runnable methods exist (got ${readyRoutedRunnable.size})`);

const uncertified = [...readyRoutedRunnable].filter((id) => !isKashfMethodProfessionallyCertified(id));
assert.deepEqual(uncertified, [], `every ready/routed/runnable method must have a professional-verdict-safety certification entry (uncertified: ${JSON.stringify(uncertified)})`);

// The thirteen methods specifically backfilled this round -- confirm each
// one by name, not just by count, so a future accidental removal of any
// single one is caught precisely.
const BACKFILLED_2026_10_06 = [
  'matter.p169.validityH6H8Planet',
  'marriage.p205.modestyPurity',
  'marriage.p208.womanQualityH5H4',
  'attention.p170.mutualGazeFireRows1713',
  'travel.p239.profitH7Witness',
  'missing.p249.inCitySignH1H4',
  'missing.p249.returnTimingTariqH10H11',
  'missing.p249.arrivalSignH3H15',
  'partnership.p212.compatibilityH1H7H5H7',
  'need.p169.fulfillmentH1Fortune',
  'prisoner.p272.outcomeH1H4',
  'prisoner.p272.exitSafetyH12',
  'prisoner.p272.releaseManner',
];
for (const methodId of BACKFILLED_2026_10_06) {
  assert.equal(isKashfMethodProfessionallyCertified(methodId), true, `${methodId} must be certified`);
  assert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.includes(methodId), `${methodId} must appear in KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS`);
}

// End-to-end: confirm the AI bridge's authoritativeClientDraftHebrew (the
// field the live GPT prompt copies verbatim into clientAnswerDraft) is
// actually non-null for each of these thirteen on a real board, for at
// least one of their routed questions -- not just that the metadata flag
// is true, but that the exact mechanism the prompt reads is populated.
const QUESTION_FOR_METHOD = {
  'matter.p169.validityH6H8Planet': 'q-matter-valid',
  'marriage.p205.modestyPurity': 'q-marriage-chastity',
  'marriage.p208.womanQualityH5H4': 'q-marriage-woman-quality',
  'attention.p170.mutualGazeFireRows1713': 'q-attention-focus',
  'travel.p239.profitH7Witness': 'q-travel-profit',
  'missing.p249.inCitySignH1H4': 'q-missing-in-city',
  'missing.p249.returnTimingTariqH10H11': 'q-missing-return-timing',
  'missing.p249.arrivalSignH3H15': 'q-missing-arriving',
  'partnership.p212.compatibilityH1H7H5H7': 'q-partnership',
  'need.p169.fulfillmentH1Fortune': 'q-need-fulfillment',
  'prisoner.p272.outcomeH1H4': 'q-prisoner-outcome',
  'prisoner.p272.exitSafetyH12': 'q-prisoner-exit-safety',
  'prisoner.p272.releaseManner': 'q-prisoner-release-manner',
};

const board = buildRamlBoardFromMothers(['2222', '2222', '2222', '2222']);
for (const [methodId, questionId] of Object.entries(QUESTION_FOR_METHOD)) {
  const bridge = buildKashfCanonicalAiBridge({
    questionId,
    questionText: 'test',
    board,
    clientContext: { question: 'test', dynFields: { candidate: 'שם', castConfirmedOnName: true } },
  });
  assert.equal(bridge.resolution?.kashfMethodId, methodId, `${questionId} still routes to ${methodId}`);
  assert.equal(bridge.aiVerdictAllowed, true, `${questionId} (${methodId}) must be AI-verdict-allowed on a real board`);
  assert.equal(bridge.professionalVerdictSafety?.clientFacingCertified, true, `${questionId} (${methodId}) must be clientFacingCertified`);
  assert.equal(typeof bridge.professionalVerdictSafety?.authoritativeClientDraftHebrew, 'string', `${questionId} (${methodId}) must populate authoritativeClientDraftHebrew -- the exact field the live GPT prompt copies into clientAnswerDraft`);
  assert(bridge.professionalVerdictSafety.authoritativeClientDraftHebrew.length > 0, `${questionId} (${methodId}) authoritativeClientDraftHebrew must be non-empty`);
}

console.log(`Kashf certification coverage audit: ${readyRoutedRunnable.size} ready/routed/runnable methods, all certified. PASS`);
console.log('Thirteen 2026-10-06 backfilled methods verified end-to-end (authoritativeClientDraftHebrew populated): PASS');
