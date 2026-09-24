import assert from 'node:assert/strict';

import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { buildKashfCanonicalAiBridge } from './goral-hachol/intelligence/kashf-canonical-ai-bridge.js';
import {
  buildKashfCanonicalRuleDecisionPayload,
  KASHF_CANONICAL_RULE_DECISION_VERSION,
} from './goral-hachol/intelligence/kashf-canonical-rule-decision.js';
import { buildKashfAiContextPackage } from './goral-hachol/intelligence/kashf-ai-context-builder.js';
import { sanitizeKashfReadingPayloadForAi } from './supabase/functions/oren-smart-advisor/kashf_reading_payload_sanitizer.ts';

const MOTHERS = ['2222', '2211', '2121', '2221'];
const board = buildRamlBoardFromMothers(MOTHERS);

function realDecision(questionId, questionText) {
  const bridge = buildKashfCanonicalAiBridge({ questionId, questionText, board });
  return { bridge, decision: buildKashfCanonicalRuleDecisionPayload(bridge) };
}

console.log('\n--- Canonical Kashf Rule Decision payload ---');

// 1. Gender: route is authoritative; p192 alternatives are explicitly rejected.
{
  const { bridge, decision } = realDecision('q-gender', 'זכר או נקבה?');
  assert.equal(decision.version, KASHF_CANONICAL_RULE_DECISION_VERSION);
  assert.equal(bridge.resolution.kashfMethodId, 'pregnancy.p191.genderH5');
  assert.deepEqual(decision.activatedRuleIds, ['pregnancy.p191.genderH5']);
  assert(decision.rejectedRuleIds.includes('pregnancy.p192.genderH5H11InOut'));
  assert(decision.rejectedRuleIds.includes('pregnancy.p192.genderParityH1H6H8H12'));
  assert(!decision.rejectedRuleIds.includes('pregnancy.p191.genderH5'));
  assert.equal(decision.executionAllowed, true);
  assert.equal(decision.sourceEvidence.length, 1);
  assert(decision.sourceEvidence[0].includes('עמ׳ 191'));
  assert(decision.decisionSummary.includes('pregnancy.p191.genderH5'));
  assert(decision.decisionSummary.includes('אין הצבעת רוב'));
}

// 2. Birth ease: p194 delivery material stays rejected and cannot vote.
{
  const { decision } = realDecision('q-birth-ease', 'האם הלידה תהיה קלה?');
  assert.deepEqual(decision.activatedRuleIds, ['pregnancy.p191.deliveryDifficultyH1H5H15']);
  assert(decision.rejectedRuleIds.includes('pregnancy.p194.deliveryH5Weight'));
  assert(decision.rejectedRuleIds.includes('pregnancy.p192.maternalSafetyH6H8H12'));
  assert.equal(decision.executionAllowed, true);
}

// 3. Miscarriage route: exact p191→192 method only; safety routes stay rejected.
{
  const { decision } = realDecision('q-miscarriage', 'האם מופיע סימן ההפלה?');
  assert.deepEqual(decision.activatedRuleIds, ['pregnancy.p191-192.miscarriageRedH7NakisH8']);
  assert(decision.rejectedRuleIds.includes('pregnancy.p191.childSafetyH1H6H8'));
  assert(decision.rejectedRuleIds.includes('pregnancy.p192.maternalSafetyH6H8H12'));
  assert.equal(decision.activatedRuleIds.length, 1);
}

// 4. Illness recovery: H15 only, with p196 recurrence/sensory and body-part excluded.
{
  const { decision } = realDecision('q-illness-heal', 'האם החולה יחלים?');
  assert.deepEqual(decision.activatedRuleIds, ['illness.p196.outcomeH15']);
  assert(decision.rejectedRuleIds.includes('illness.p196.h1RecurrenceDurationRisk'));
  assert(decision.rejectedRuleIds.includes('illness.p196.sensorySignsH6H8'));
  assert(decision.rejectedRuleIds.includes('illness.bodyPart.h6Figure'));
}

// 5. A blocked authoritative route activates nothing and never falls back.
{
  const { bridge, decision } = realDecision('q-dig-direction', 'לאיזה כיוון לחפור?');
  assert.equal(bridge.resolution.kashfMethodId, 'hidden.p188.quarterDirection');
  assert.equal(bridge.resolution.canExecute, false);
  assert.deepEqual(decision.activatedRuleIds, []);
  assert(decision.rejectedRuleIds.includes('hidden.p188.quarterDirection'));
  assert.equal(decision.executionAllowed, false);
  assert(decision.decisionSummary.includes('לא הופעל כלל כשף'));
  assert(decision.decisionSummary.includes('לא הופעל fallback'));
}

// 6. Free-text retrieval may disagree, but Question Bank route still owns activation.
{
  const { bridge, decision } = realDecision('q-gender', 'האם הלידה תהיה קלה או קשה?');
  assert.equal(bridge.resolution.resolutionSource, 'question-route');
  assert.equal(bridge.resolution.kashfMethodId, 'pregnancy.p191.genderH5');
  assert.deepEqual(decision.activatedRuleIds, ['pregnancy.p191.genderH5']);
  const nonSelectedCandidateIds = (bridge.candidates || [])
    .map((x) => x?.kashfMethodId)
    .filter((id) => id && id !== 'pregnancy.p191.genderH5');
  for (const id of nonSelectedCandidateIds) {
    assert(decision.rejectedRuleIds.includes(id), 'non-selected retrieval candidate is rejected: ' + id);
  }
}

// 7. No PII/question text is copied into deterministic decision summary.
{
  const secretQuestion = 'זכר או נקבה? מזהה-פרטי-XYZ-991';
  const { decision } = realDecision('q-gender', secretQuestion);
  assert(!decision.decisionSummary.includes('מזהה-פרטי-XYZ-991'));
  assert(!JSON.stringify(decision).includes('XYZ-991'));
}

// 8. AI context builder now carries the real canonical decision payload.
{
  const built = buildKashfAiContextPackage({
    mothers: MOTHERS,
    topicId: 'children',
    question: 'זכר או נקבה?',
    questionId: 'q-gender',
    readingId: 'rule-decision-integration-001',
  });
  const rc = built.contextPackage?.readingContext;
  assert(rc);
  assert.deepEqual(rc.activatedRuleIds, ['pregnancy.p191.genderH5']);
  assert(rc.rejectedRuleIds.includes('pregnancy.p192.genderH5H11InOut'));
  assert(Array.isArray(rc.sourceEvidence) && rc.sourceEvidence.length === 1);
  assert.equal(rc.canonicalRuleDecisionVersion, KASHF_CANONICAL_RULE_DECISION_VERSION);
  assert(typeof built.contextPackage.decisionSummary === 'string' && built.contextPackage.decisionSummary.includes('pregnancy.p191.genderH5'));
  assert(!built.missingFields.some((x) => x.includes('activatedRuleIds')));
  assert(!built.missingFields.some((x) => x.includes('rejectedRuleIds')));
  assert(!built.missingFields.some((x) => x.includes('decisionSummary')));
  assert.equal(built.canonicalRuleDecision?.selectedMethodId, 'pregnancy.p191.genderH5');

  const sanitized = sanitizeKashfReadingPayloadForAi(built.contextPackage);
  assert.equal(sanitized.ok, true, JSON.stringify(sanitized));
}

// 9. Legacy/non-canonical builder path remains honest: no fabricated rule decision.
{
  const built = buildKashfAiContextPackage({
    mothers: MOTHERS,
    topicId: 'commerce',
    question: 'האם העסק החדש יצליח?',
  });
  assert.deepEqual(built.contextPackage.readingContext.activatedRuleIds, []);
  assert.deepEqual(built.contextPackage.readingContext.rejectedRuleIds, []);
  assert(!('decisionSummary' in built.contextPackage));
  assert(built.missingFields.some((x) => x.includes('activatedRuleIds')));
  assert.equal(built.canonicalRuleDecision, null);
}

console.log('Canonical Kashf Rule Decision payload: PASS');
console.log('one-rule activation + explicit rejection + source evidence + AI-context integration: PASS');
