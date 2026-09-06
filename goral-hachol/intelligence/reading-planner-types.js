/**
 * reading-planner-types.js
 *
 * Single source of truth for Hall of Wisdom Reading Planner
 * (HALL_WISDOM_READING_PLANNER_COMPONENT_CONTRACT.md). Deterministic
 * catalog + type guards only — no engine imports, no AI, no network.
 *
 * Foundation phase: not connected to goral-hachol/engine/* (Kashf/Hawi/Cards)
 * and not connected to the live goral-rule-applicability-matrix.js /
 * goral-knowledge-registry.js — same decoupling already established for
 * Reading Strategy Builder (see reading-strategy-types.js header).
 */

import { STRATEGY_CONSTRAINT_CATEGORIES, CONSTRAINT_FIELD_NAMES, isKnownConstraintCategory } from './reading-strategy-types.js';
import { RULE_DECISION_VALUES, isRuleDecisionValue } from './reading-intelligence-types.js';

export const PLAN_VERSION = 'reading-planner-v1';

export const READING_DOMAINS = ['goralHachol', 'cards'];

// 'cartomancy' verified against the existing codebase, not invented: the
// module folder is cartomancy/ (not cards/), the existing storage key
// already uses this name (`cartomancyReadingsArchive_v1_${uid}`,
// cartomancy/ui/cards-app.js), and QA file-exclusion lists already
// reference the domain as 'cartomancy/**' (goral-hachol/qa/goral-qa-runner.mjs,
// goral-qa-ai-evaluator-mock.js). There is no separate literal
// `method`/`readingType` constant anywhere in the cards code itself (cards
// currently has only one method, unlike goralHachol's kashf/hawi duality) —
// 'cartomancy' is the only value consistent with the existing convention.
export const METHOD_BY_DOMAIN = {
  goralHachol: ['kashf', 'hawi'],
  cards: ['cartomancy'],
};

// Real spreadId values already used in cartomancy/ui/cards-app.js
// (state.spread) — referenced here as a known-values catalog, NOT imported
// (Reading Planner must not import cards engine/UI code).
export const KNOWN_CARD_SPREAD_IDS = ['three', 'past-present-future'];

export const EXECUTION_ORDER_DEFAULT = ['primaryDecision', 'verification', 'conditional', 'supporting', 'advisorOnly'];

export const WARNING_TYPES = [
  'missingRequiredCategory', 'conflictingConstraints', 'missingEvidence', 'unsupportedTopic',
  'unavailableForMethod', 'clarificationRequired', 'advisorOnlyLeakRisk', 'forbiddenCategoryRequested',
  'ambiguousPlan', 'missingInput', 'domainMismatch',
];

// Distinct, deliberately, from reading-intelligence-types.js::SEVERITY_VALUES
// (a QA/Audit vocabulary: high/medium/low/none) — Planner Warnings use their
// own 4-value severity scale, as specified for this component.
export const WARNING_SEVERITY_VALUES = ['info', 'warning', 'error', 'critical'];

export function isReadingDomain(value) {
  return READING_DOMAINS.includes(value);
}

export function isMethodForDomain(method, readingDomain) {
  return Array.isArray(METHOD_BY_DOMAIN[readingDomain]) && METHOD_BY_DOMAIN[readingDomain].includes(method);
}

export function isWarningType(value) {
  return WARNING_TYPES.includes(value);
}

export function isWarningSeverity(value) {
  return WARNING_SEVERITY_VALUES.includes(value);
}

export {
  STRATEGY_CONSTRAINT_CATEGORIES, CONSTRAINT_FIELD_NAMES, isKnownConstraintCategory,
  RULE_DECISION_VALUES, isRuleDecisionValue,
};

export default {
  PLAN_VERSION,
  READING_DOMAINS,
  METHOD_BY_DOMAIN,
  KNOWN_CARD_SPREAD_IDS,
  EXECUTION_ORDER_DEFAULT,
  WARNING_TYPES,
  WARNING_SEVERITY_VALUES,
  isReadingDomain,
  isMethodForDomain,
  isWarningType,
  isWarningSeverity,
  STRATEGY_CONSTRAINT_CATEGORIES,
  CONSTRAINT_FIELD_NAMES,
  isKnownConstraintCategory,
  RULE_DECISION_VALUES,
  isRuleDecisionValue,
};
