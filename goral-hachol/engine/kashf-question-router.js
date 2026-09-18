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
  'q-hidden-place': {
    topicId: 'hiddenTreasure',
    routeKind: 'primary',
    runPrimary: true,
    runAlt: false,
    supportingCheckIds: [],
  },
  'q-well-drilling': {
    topicId: 'hiddenTreasure',
    routeKind: 'supporting-only',
    runPrimary: false,
    runAlt: false,
    supportingCheckIds: ['well-drilling'],
  },

  // House 5 — pregnancy/children
  'q-pregnancy': {
    topicId: 'children',
    routeKind: 'primary',
    runPrimary: true,
    runAlt: false,
    supportingCheckIds: [],
  },
  'q-gender': {
    topicId: 'children',
    routeKind: 'supporting-only',
    runPrimary: false,
    runAlt: false,
    supportingCheckIds: ['gender-check'],
  },
  'q-miscarriage': {
    topicId: 'children',
    routeKind: 'supporting-only',
    runPrimary: false,
    runAlt: false,
    supportingCheckIds: ['danger', 'pregnancy-detailed'],
  },
  'q-birth-ease': {
    topicId: 'children',
    routeKind: 'supporting-only',
    runPrimary: false,
    runAlt: false,
    supportingCheckIds: ['pregnancy-detailed'],
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
    supportingCheckIds: ['pregnancy-detailed'],
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
