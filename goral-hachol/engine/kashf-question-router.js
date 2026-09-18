/**
 * kashf-question-router.js
 *
 * Wave 2 — canonical question routing.
 *
 * Purpose: a selected user question must choose one source-backed route.
 * Topic bundles are retrieval containers, not permission to execute every
 * formula/check inside them. This router narrows execution by question id.
 *
 * Route fields:
 * - topicId: canonical KASHF topic that owns the method.
 * - runPrimary/runAlt: whether the topic's primary/alternate formula may run.
 * - supportingCheckIds: exact allow-list. [] means no supporting checks.
 * - routeKind: documentation only.
 *
 * If a question is absent here, the engine keeps legacy topic behavior for
 * compatibility until its route is audited; selected Wave-2 questions below
 * are locked to explicit routes.
 */

export const KASHF_CANONICAL_QUESTION_ROUTES = Object.freeze({
  // House 1 / general intents
  'q-general-state': {
    topicId: 'generalReading',
    routeKind: 'primary-with-scoped-support',
    runPrimary: true,
    runAlt: false,
    supportingCheckIds: ['outcome', 'general-money-aspect'],
  },
  'q-geo-direction': {
    topicId: 'generalReading',
    routeKind: 'supporting-only',
    runPrimary: false,
    runAlt: false,
    supportingCheckIds: ['geographic-direction'],
  },
  'q-clothing-lucky': {
    topicId: 'generalReading',
    routeKind: 'supporting-only',
    runPrimary: false,
    runAlt: false,
    supportingCheckIds: ['clothing-luck', 'clothing-best-figures'],
  },

  // Completion / exact request outcome
  'q-success': {
    topicId: 'completion',
    routeKind: 'primary',
    runPrimary: true,
    runAlt: false,
    supportingCheckIds: [],
  },
  'q-wish': {
    topicId: 'completion',
    routeKind: 'primary-with-scoped-support',
    runPrimary: true,
    runAlt: false,
    supportingCheckIds: ['figure-desire-fulfillment'],
  },

  // House 2 — money intents must not vote together
  'q-money-state': {
    topicId: 'money',
    routeKind: 'primary-with-scoped-support',
    runPrimary: true,
    runAlt: true,
    supportingCheckIds: ['money-house'],
  },
  'q-money-source': {
    topicId: 'money',
    routeKind: 'supporting-only',
    runPrimary: false,
    runAlt: false,
    supportingCheckIds: ['money-source-total'],
  },
  'q-livelihood': {
    topicId: 'money',
    routeKind: 'supporting-only',
    runPrimary: false,
    runAlt: false,
    supportingCheckIds: ['livelihood-house', 'parnasa-source'],
  },

  // House 3 — relocation
  'q-move-city': {
    topicId: 'relocation',
    routeKind: 'primary',
    runPrimary: true,
    runAlt: false,
    supportingCheckIds: [],
  },
  'q-move-home': {
    topicId: 'relocation',
    routeKind: 'primary',
    runPrimary: true,
    runAlt: false,
    supportingCheckIds: [],
  },
  'q-stay-place': {
    topicId: 'relocation',
    routeKind: 'supporting-only',
    runPrimary: false,
    runAlt: false,
    supportingCheckIds: ['current-place'],
  },

  // House 4 — hidden object / land
  'q-treasure': {
    topicId: 'hiddenTreasure',
    routeKind: 'primary',
    runPrimary: true,
    runAlt: false,
    supportingCheckIds: [],
  },
  'q-well-drilling': {
    topicId: 'hiddenTreasure',
    routeKind: 'blocked-pending-algorithm',
    routeStatus: 'BLOCKED',
    blockReason: 'Depth/location computation belongs to the unresolved pp188-190 algorithm family; do not run until Golden-Testable.',
    runPrimary: false,
    runAlt: false,
    supportingCheckIds: [],
  },
  'q-dig-direction': {
    topicId: 'hiddenTreasure',
    routeKind: 'blocked-pending-algorithm',
    routeStatus: 'BLOCKED',
    blockReason: 'Hidden-location direction methods are alternatives with unresolved derivation details; no automatic method is selected.',
    runPrimary: false,
    runAlt: false,
    supportingCheckIds: [],
  },
  'q-secrets': {
    topicId: 'hiddenTreasure',
    routeKind: 'blocked-source-scope',
    routeStatus: 'BLOCKED',
    blockReason: 'A general secret/revelation question is not the same intent as the chapter-4 hidden-object location procedures; do not fall back to that bundle.',
    runPrimary: false,
    runAlt: false,
    supportingCheckIds: [],
  },
  'q-father': {
    topicId: 'parentsProperty',
    routeKind: 'blocked-mixed-intent',
    routeStatus: 'BLOCKED',
    blockReason: 'This UI item mixes father, house and land. The p184 property map remains non-runtime until the source-faithful H3/H7/witness mapping is closed.',
    runPrimary: false,
    runAlt: false,
    supportingCheckIds: [],
  },
  'q-best-city': {
    topicId: 'relocation',
    routeKind: 'blocked-pending-rule',
    routeStatus: 'BLOCKED',
    blockReason: 'The two-city comparison text does not define a safe computational strength comparator; do not substitute the generic relocation route.',
    runPrimary: false,
    runAlt: false,
    supportingCheckIds: [],
  },
  'q-lifespan-remaining': {
    topicId: 'generalReading',
    routeKind: 'blocked-pending-algorithm',
    routeStatus: 'BLOCKED',
    blockReason: 'The lifespan walking algorithm remains unresolved and Golden-Testable only after Wave 3 closure.',
    runPrimary: false,
    runAlt: false,
    supportingCheckIds: [],
  },
  'q-debts': {
    topicId: 'loan',
    routeKind: 'blocked-pending-algorithm',
    routeStatus: 'BLOCKED',
    blockReason: 'The p179 debt walking procedure is not computationally closed; do not fall back to the ordinary loan route.',
    runPrimary: false,
    runAlt: false,
    supportingCheckIds: [],
  },

  // House 5 — pregnancy/children
  'q-pregnancy': {
    topicId: 'children',
    routeKind: 'supporting-only',
    runPrimary: false,
    runAlt: false,
    supportingCheckIds: ['pregnancy-confirmation-exact'],
  },
  'q-gender': {
    topicId: 'children',
    routeKind: 'supporting-only',
    runPrimary: false,
    runAlt: false,
    supportingCheckIds: ['pregnancy-gender-exact'],
  },
  'q-miscarriage': {
    topicId: 'children',
    routeKind: 'supporting-only',
    runPrimary: false,
    runAlt: false,
    supportingCheckIds: ['pregnancy-miscarriage-exact'],
  },
  'q-birth-ease': {
    topicId: 'children',
    routeKind: 'supporting-only',
    runPrimary: false,
    runAlt: false,
    supportingCheckIds: ['pregnancy-birth-ease-exact'],
  },
  'q-child-survive': {
    topicId: 'children',
    routeKind: 'supporting-only',
    runPrimary: false,
    runAlt: false,
    supportingCheckIds: ['child-safety', 'danger'],
  },
  'q-child-health': {
    topicId: 'children',
    routeKind: 'supporting-only',
    runPrimary: false,
    runAlt: false,
    supportingCheckIds: ['child-health-exact'],
  },
  'q-child-lifespan': {
    topicId: 'children',
    routeKind: 'supporting-only',
    runPrimary: false,
    runAlt: false,
    supportingCheckIds: ['child-welfare-exact'],
  },

  // House 6 — illness intents
  'q-illness-heal': {
    topicId: 'illness',
    routeKind: 'primary-with-scoped-support',
    runPrimary: true,
    runAlt: true,
    supportingCheckIds: ['recovery', 'illness-duration-h6', 'illness-severity-h8'],
  },
  'q-illness-bodypart': {
    topicId: 'illness',
    routeKind: 'supporting-only',
    runPrimary: false,
    runAlt: false,
    supportingCheckIds: ['body-part'],
  },
  'q-illness-type': {
    topicId: 'illness',
    routeKind: 'supporting-only',
    runPrimary: false,
    runAlt: false,
    supportingCheckIds: ['illness-type'],
  },
  'q-illness-cause': {
    topicId: 'illness',
    routeKind: 'blocked-source-scope',
    routeStatus: 'BLOCKED',
    blockReason: 'This UI question does not have an approved p196 Kashf cause-of-illness route; do not run the broad illness bundle as a substitute.',
    runPrimary: false,
    runAlt: false,
    supportingCheckIds: [],
  },
});

export function resolveKashfQuestionRoute(questionId, requestedTopicId) {
  if (!questionId) return null;
  const route = KASHF_CANONICAL_QUESTION_ROUTES[questionId] || null;
  if (!route) return null;
  if (requestedTopicId && route.topicId !== requestedTopicId) {
    return {
      ...route,
      routeError: `question ${questionId} is locked to ${route.topicId}, not ${requestedTopicId}`,
    };
  }
  return route;
}

export function filterSupportingChecksForRoute(checks, route) {
  if (!route) return checks || [];
  const allowed = new Set(route.supportingCheckIds || []);
  return (checks || []).filter((check) => allowed.has(check.id));
}

export default {
  KASHF_CANONICAL_QUESTION_ROUTES,
  resolveKashfQuestionRoute,
  filterSupportingChecksForRoute,
};
