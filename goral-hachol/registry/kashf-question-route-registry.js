/**
 * kashf-question-route-registry.js
 *
 * P0 explicit Question ID -> Kashf source intent -> canonical method mapping.
 * This registry is authoritative for Kashf routing when a concrete
 * question-bank id is known.
 *
 * Unmapped question ids are NOT allowed to fall back to topic routing.
 */

const route = ({
  questionId,
  disposition,
  kashfIntentId,
  kashfMethodId,
  kashfRuntimeStatus,
  aliasOf = null,
  note = null,
}) => Object.freeze({
  questionId,
  disposition,
  kashfIntentId,
  kashfMethodId,
  kashfRuntimeStatus,
  aliasOf,
  note,
});

export const KASHF_QUESTION_ROUTES = Object.freeze({
  // ── READY pilot questions ---------------------------------------------
  'q-success': route({
    questionId: 'q-success',
    disposition: 'KEEP',
    kashfIntentId: 'completion.willComplete',
    kashfMethodId: 'completion.p173.fireRows15910',
    kashfRuntimeStatus: 'ready',
  }),

  'q-knowledge-success': route({
    questionId: 'q-knowledge-success',
    disposition: 'ALIAS',
    aliasOf: 'q-success',
    kashfIntentId: 'completion.willComplete',
    kashfMethodId: 'completion.p173.fireRows15910',
    kashfRuntimeStatus: 'ready',
  }),

  'q-academic': route({
    questionId: 'q-academic',
    disposition: 'ALIAS',
    aliasOf: 'q-success',
    kashfIntentId: 'completion.willComplete',
    kashfMethodId: 'completion.p173.fireRows15910',
    kashfRuntimeStatus: 'ready',
  }),

  'q-spiritual-path': route({
    questionId: 'q-spiritual-path',
    disposition: 'ALIAS',
    aliasOf: 'q-success',
    kashfIntentId: 'completion.willComplete',
    kashfMethodId: 'completion.p173.fireRows15910',
    kashfRuntimeStatus: 'ready',
    note: 'Only when the intended question is whether the path/study will succeed; not a diagnosis of spiritual status.',
  }),

  'q-move-city': route({
    questionId: 'q-move-city',
    disposition: 'KEEP',
    kashfIntentId: 'relocation.placeToPlace',
    kashfMethodId: 'relocation.p183.h4h15',
    kashfRuntimeStatus: 'ready',
  }),

  'q-illness-heal': route({
    questionId: 'q-illness-heal',
    disposition: 'KEEP',
    kashfIntentId: 'illness.recovery',
    kashfMethodId: 'illness.p196.outcomeH15',
    kashfRuntimeStatus: 'ready',
  }),

  'q-illness-bodypart': route({
    questionId: 'q-illness-bodypart',
    disposition: 'KEEP',
    kashfIntentId: 'illness.bodyPart',
    kashfMethodId: 'illness.bodyPart.h6Figure',
    kashfRuntimeStatus: 'ready',
  }),

  'q-gender': route({
    questionId: 'q-gender',
    disposition: 'KEEP',
    kashfIntentId: 'pregnancy.gender',
    kashfMethodId: 'pregnancy.p191.genderH5',
    kashfRuntimeStatus: 'ready',
  }),

  'q-siblings': route({
    questionId: 'q-siblings',
    disposition: 'RENAME',
    kashfIntentId: 'siblings.relationship',
    kashfMethodId: 'siblings.p182.h1h3',
    kashfRuntimeStatus: 'ready',
    note: 'Source-safe scope is sibling relationship/condition; generic relatives/neighbors are not automatically covered.',
  }),

  'q-sibling-agreement': route({
    questionId: 'q-sibling-agreement',
    disposition: 'ALIAS',
    aliasOf: 'q-siblings',
    kashfIntentId: 'siblings.relationship',
    kashfMethodId: 'siblings.p182.h1h3',
    kashfRuntimeStatus: 'ready',
  }),

  'q-sibling-eldest': route({
    questionId: 'q-sibling-eldest',
    disposition: 'KEEP',
    kashfIntentId: 'siblings.seniority',
    kashfMethodId: 'siblings.p182.seniority',
    kashfRuntimeStatus: 'ready',
  }),

  'q-marriage-thayib': route({
    questionId: 'q-marriage-thayib',
    disposition: 'KEEP',
    kashfIntentId: 'marriage.previousStatus',
    kashfMethodId: 'marriage.p204.previousStatusH7',
    kashfRuntimeStatus: 'ready',
  }),

  'q-travel-safe': route({
    questionId: 'q-travel-safe',
    disposition: 'KEEP',
    kashfIntentId: 'travel.success',
    kashfMethodId: 'travel.p238.assemble1359',
    kashfRuntimeStatus: 'ready',
  }),

  'q-short-travel': route({
    questionId: 'q-short-travel',
    disposition: 'ALIAS',
    aliasOf: 'q-travel-safe',
    kashfIntentId: 'travel.success',
    kashfMethodId: 'travel.p238.assemble1359',
    kashfRuntimeStatus: 'ready',
  }),

  // ── AUDITED GENERAL / RELOCATION SLICE --------------------------------
  // Source-ready records below remain hard-stopped until their canonical
  // executorStatus becomes ready in the method registry.
  'q-general-state': route({
    questionId: 'q-general-state',
    disposition: 'KEEP',
    kashfIntentId: 'general.state',
    kashfMethodId: 'general.p174.h1h2h4h7h10h15',
    kashfRuntimeStatus: 'ready',
  }),

  'q-best-city': route({
    questionId: 'q-best-city',
    disposition: 'BLOCK',
    kashfIntentId: 'relocation.compareTwoCities',
    kashfMethodId: 'relocation.p183.compare12vs78',
    kashfRuntimeStatus: 'blocked-by-source',
    note: 'Exact source meaning of comparative strength must be closed before execution.',
  }),

  'q-move-home': route({
    questionId: 'q-move-home',
    disposition: 'KEEP',
    kashfIntentId: 'relocation.isThisPlaceGood',
    kashfMethodId: 'relocation.p183.currentVsNewPlace',
    kashfRuntimeStatus: 'ready',
  }),

  'q-stay-place': route({
    questionId: 'q-stay-place',
    disposition: 'KEEP',
    kashfIntentId: 'relocation.stayOrMove',
    kashfMethodId: 'relocation.p183.stayMoveH1H2',
    kashfRuntimeStatus: 'ready',
  }),

  'q-message': route({
    questionId: 'q-message',
    disposition: 'KEEP',
    kashfIntentId: 'messenger.outcome',
    kashfMethodId: 'messenger.p176.recast14511',
    kashfRuntimeStatus: 'ready',
  }),

  'q-news-arrive': route({
    questionId: 'q-news-arrive',
    disposition: 'ALIAS',
    aliasOf: 'q-message',
    kashfIntentId: 'messenger.outcome',
    kashfMethodId: 'messenger.p176.recast14511',
    kashfRuntimeStatus: 'ready',
    note: 'Alias only when the question means a message/news item arriving from a sender; generic future news remains outside this method.',
  }),

  'q-clothing-lucky': route({
    questionId: 'q-clothing-lucky',
    disposition: 'RENAME',
    kashfIntentId: 'clothing.luck',
    kashfMethodId: 'clothing.p264-265.luck',
    kashfRuntimeStatus: 'ready',
    note: 'Keep within the source clothing judgment; do not promise an unsourced universal lucky-color system.',
  }),

  'q-matter-end': route({
    questionId: 'q-matter-end',
    disposition: 'KEEP',
    kashfIntentId: 'matter.outcome',
    kashfMethodId: 'matter.p172.h17_h1011_thenCombine',
    kashfRuntimeStatus: 'ready',
  }),

  'q-celebrations': route({
    questionId: 'q-celebrations',
    disposition: 'KEEP',
    kashfIntentId: 'joy.occurrence',
    kashfMethodId: 'joy.p196.recast14511',
    kashfRuntimeStatus: 'ready',
  }),

  'q-joy-coming': route({
    questionId: 'q-joy-coming',
    disposition: 'ALIAS',
    aliasOf: 'q-celebrations',
    kashfIntentId: 'joy.occurrence',
    kashfMethodId: 'joy.p196.recast14511',
    kashfRuntimeStatus: 'ready',
  }),

  'q-gift': route({
    questionId: 'q-gift',
    disposition: 'BLOCK',
    kashfIntentId: 'gift.receive',
    kashfMethodId: 'gift.sourceInputUnclear',
    kashfRuntimeStatus: 'blocked-by-source',
    note: 'Gift polarity is stated, but the exact source input/house is not closed.',
  }),

  // ── REPAIR REQUIRED: explicit hard stop until fixed -------------------
  'q-wish': route({
    questionId: 'q-wish',
    disposition: 'KEEP',
    kashfIntentId: 'hope.fulfillment',
    kashfMethodId: 'hope.p267.fulfillment',
    kashfRuntimeStatus: 'repair-required',
    note: 'Must route to the dedicated p267 hope method, not completion p173.',
  }),

  'q-dream': route({
    questionId: 'q-dream',
    disposition: 'KEEP',
    kashfIntentId: 'dream.meaning',
    kashfMethodId: 'dream.p254.h9AndTransit',
    kashfRuntimeStatus: 'repair-required',
  }),

  'q-dream-daily': route({
    questionId: 'q-dream-daily',
    disposition: 'ALIAS',
    aliasOf: 'q-dream',
    kashfIntentId: 'dream.meaning',
    kashfMethodId: 'dream.p254.h9AndTransit',
    kashfRuntimeStatus: 'repair-required',
  }),

  'q-dream-omen': route({
    questionId: 'q-dream-omen',
    disposition: 'ALIAS',
    aliasOf: 'q-dream',
    kashfIntentId: 'dream.meaning',
    kashfMethodId: 'dream.p254.h9AndTransit',
    kashfRuntimeStatus: 'repair-required',
  }),

  'q-friends': route({
    questionId: 'q-friends',
    disposition: 'RENAME',
    kashfIntentId: 'friends.relationship',
    kashfMethodId: 'friends.p263.h1h11',
    kashfRuntimeStatus: 'repair-required',
    note: 'Do not execute the current friendsHope bundle; Nuzhat need/hope material must be isolated first.',
  }),

  'q-stability': route({
    questionId: 'q-stability',
    disposition: 'KEEP',
    kashfIntentId: 'state.stability',
    kashfMethodId: 'state.p265.h1h2h9h15',
    kashfRuntimeStatus: 'repair-required',
  }),

  'q-missing-alive': route({
    questionId: 'q-missing-alive',
    disposition: 'KEEP',
    kashfIntentId: 'missing.aliveOrDead',
    kashfMethodId: 'missing.p248.aliveOrDead',
    kashfRuntimeStatus: 'repair-required',
    note: 'Current missingPerson topic bundle is not source-safe for this question.',
  }),

  'q-enemy-exists': route({
    questionId: 'q-enemy-exists',
    disposition: 'KEEP',
    kashfIntentId: 'enemy.presenceAndDominance',
    kashfMethodId: 'enemy.p271.h1vsH12',
    kashfRuntimeStatus: 'repair-required',
  }),

  'q-hidden-enemy': route({
    questionId: 'q-hidden-enemy',
    disposition: 'ALIAS',
    aliasOf: 'q-enemy-exists',
    kashfIntentId: 'enemy.presenceAndDominance',
    kashfMethodId: 'enemy.p271.h1vsH12',
    kashfRuntimeStatus: 'repair-required',
    note: 'The canonical method establishes enemy presence/dominance, not identity of a hidden enemy.',
  }),

  'q-enemy': route({
    questionId: 'q-enemy',
    disposition: 'RENAME',
    aliasOf: 'q-enemy-exists',
    kashfIntentId: 'enemy.presenceAndDominance',
    kashfMethodId: 'enemy.p271.h1vsH12',
    kashfRuntimeStatus: 'repair-required',
    note: 'Rename away from “who is the enemy”; p271 does not identify a named person.',
  }),

  // ── BLOCKED BY SOURCE --------------------------------------------------
  'q-sea-voyage': route({
    questionId: 'q-sea-voyage',
    disposition: 'BLOCK',
    kashfIntentId: 'travel.vehicleSafety',
    kashfMethodId: 'travel.p242.vehicleSafety',
    kashfRuntimeStatus: 'blocked-by-source',
  }),

  'q-prisoner': route({
    questionId: 'q-prisoner',
    disposition: 'RENAME',
    kashfIntentId: 'prisoner.releaseTiming',
    kashfMethodId: 'prisoner.releaseTiming.unresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    note: 'Current wording asks WHEN; selected body-source methods do not provide a canonical release-timing calculation.',
  }),

  // ── EDUCATIONAL ONLY ---------------------------------------------------
  'q-promise': route({
    questionId: 'q-promise',
    disposition: 'EDUCATIONAL',
    kashfIntentId: 'promise.fulfillment',
    kashfMethodId: 'promise.external.p255',
    kashfRuntimeStatus: 'educational-only',
  }),

  'q-yearly-forecast': route({
    questionId: 'q-yearly-forecast',
    disposition: 'EDUCATIONAL',
    kashfIntentId: 'yearly.forecast',
    kashfMethodId: 'yearly.external.p221-223',
    kashfRuntimeStatus: 'educational-only',
    note: 'Mapped yearly methods in this range belong to non-body/Nuzhat additions, so they remain learning-only by default.',
  }),

  'q-fear': route({
    questionId: 'q-fear',
    disposition: 'EDUCATIONAL',
    kashfIntentId: 'fear.general',
    kashfMethodId: 'fear.external.p274.h7h8',
    kashfRuntimeStatus: 'educational-only',
  }),

  // ── UNSUPPORTED IN KASHF ----------------------------------------------
  'q-sorcery': route({
    questionId: 'q-sorcery',
    disposition: 'BLOCK',
    kashfIntentId: 'spiritual.affectedBySorcery',
    kashfMethodId: 'spiritual.affectedBySorcery.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'p167 does not answer whether the querent is affected by sorcery/evil eye/jinn.',
  }),

  'q-sorcery-h10': route({
    questionId: 'q-sorcery-h10',
    disposition: 'ALIAS',
    aliasOf: 'q-sorcery',
    kashfIntentId: 'spiritual.affectedBySorcery',
    kashfMethodId: 'spiritual.affectedBySorcery.unsupported',
    kashfRuntimeStatus: 'unsupported',
  }),
});

export function getKashfQuestionRoute(questionId) {
  return KASHF_QUESTION_ROUTES[questionId] || null;
}

export function validateKashfQuestionRoutes(methodLookup) {
  const errors = [];

  for (const [key, entry] of Object.entries(KASHF_QUESTION_ROUTES)) {
    if (entry.questionId !== key) errors.push(`${key}: key must equal questionId`);
    if (!entry.kashfIntentId) errors.push(`${key}: kashfIntentId is required`);
    if (!entry.kashfMethodId) errors.push(`${key}: kashfMethodId is required`);

    if (typeof methodLookup === 'function') {
      const methodEntry = methodLookup(entry.kashfMethodId);
      if (!methodEntry) {
        errors.push(`${key}: unknown kashfMethodId ${entry.kashfMethodId}`);
      } else {
        if (methodEntry.kashfIntentId !== entry.kashfIntentId) {
          errors.push(`${key}: route intent ${entry.kashfIntentId} does not match method intent ${methodEntry.kashfIntentId}`);
        }
        if (methodEntry.kashfRuntimeStatus !== entry.kashfRuntimeStatus) {
          errors.push(`${key}: route status ${entry.kashfRuntimeStatus} does not match method status ${methodEntry.kashfRuntimeStatus}`);
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

export default {
  KASHF_QUESTION_ROUTES,
  getKashfQuestionRoute,
  validateKashfQuestionRoutes,
};
