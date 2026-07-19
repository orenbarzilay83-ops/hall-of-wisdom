/**
 * kashf-book-rule-selector.js
 *
 * Deterministic selector over KASHF_BOOK_RULE_CATALOG /
 * KASHF_DHAMIR_METHOD_COVERAGE (kashf-book-rule-catalog.js). Pure lookup +
 * categorization — computes NO new facts about the board, invents NO
 * precedence beyond what a rule record already declares, and never
 * "activates" a rule marked unresolved just because it matched a topic.
 *
 * Categories returned (per HALL_WISDOM audit request):
 *   A verdictRules        — direct-verdict formulas for this topic
 *   B supportingRules     — supporting checks / foundational context
 *   C generalWitnessRules — general witness doctrine that IS resolved
 *                           enough to surface (unresolved witness schemes
 *                           are excluded here — see unresolvedRules)
 *   D dhamirRules         — the topic-independent dhamir aggregation rule
 *                           + full 8-method dhamir coverage (always
 *                           surfaced for any Kashf reading, per the book's
 *                           own "עצמאי מהנושא" framing — never claims all
 *                           8 are implemented, see implementationStatus)
 *   E irrelevantRules     — catalog entries that do not match this topicId
 *   F unresolvedRules     — entries with resolutionStatus set — NEVER
 *                           placed in any other bucket, NEVER treated as
 *                           applied
 *   unavailableRules      — matched, non-unresolved entries whose
 *                           implementationStatus !== 'implemented'
 *                           (cross-cutting flag, independent of category)
 */

import { KASHF_BOOK_RULE_CATALOG, KASHF_DHAMIR_METHOD_COVERAGE } from '../data/sources/kashf-al-asrar/kashf-book-rule-catalog.js';

function matchesTopic(rule, topicId) {
  return Array.isArray(rule.appliesToTopics) && rule.appliesToTopics.includes(topicId);
}

/**
 * @param {object} input
 * @param {string} input.method - e.g. 'kashf'
 * @param {string} input.topicId - e.g. 'spiritualDiagnostics'
 * @param {string} [input.questionType]
 * @param {string} [input.primaryIntent]
 * @returns {{
 *   verdictRules: object[], supportingRules: object[], generalWitnessRules: object[],
 *   dhamirRules: object[], irrelevantRules: object[], unresolvedRules: object[],
 *   unavailableRules: object[],
 * }}
 */
export function selectApplicableBookRules(input = {}) {
  const { method, topicId } = input;

  const empty = {
    verdictRules: [], supportingRules: [], generalWitnessRules: [],
    dhamirRules: [], irrelevantRules: [], unresolvedRules: [], unavailableRules: [],
  };
  if (method !== 'kashf' || !topicId) return empty;

  const verdictRules = [];
  const supportingRules = [];
  const generalWitnessRules = [];
  const dhamirRules = [];
  const irrelevantRules = [];
  const unresolvedRules = [];
  const unavailableRules = [];

  for (const rule of KASHF_BOOK_RULE_CATALOG) {
    const matched = matchesTopic(rule, topicId);

    if (!matched) {
      irrelevantRules.push(rule);
      continue;
    }

    // Unresolved rules are NEVER placed in any applied-facing bucket —
    // matching a topic does not "activate" them.
    if (rule.resolutionStatus === 'unresolved-source-relationship') {
      unresolvedRules.push(rule);
      continue;
    }

    switch (rule.ruleCategory) {
      case 'verdictFormula':
        verdictRules.push(rule);
        break;
      case 'supportingCheck':
      case 'foundationalContext':
        supportingRules.push(rule);
        break;
      case 'witnessScheme':
      case 'generalPrinciple':
        generalWitnessRules.push(rule);
        break;
      case 'aggregationRule':
        dhamirRules.push(rule);
        break;
      default:
        // Unknown category — surfaced as unresolved rather than silently
        // dropped or guessed into a bucket.
        unresolvedRules.push(rule);
    }

    if (rule.implementationStatus !== 'implemented') {
      unavailableRules.push(rule);
    }
  }

  // Dhamir is documented in the book itself as independent of the chosen
  // topic ("עצמאי מהנושא שנבחר") — surfaced for every Kashf reading, not
  // gated by topicId. Each of the 8 sub-methods carries its own honest
  // implementationStatus; this never collapses to "all dhamir verified".
  for (const method8 of KASHF_DHAMIR_METHOD_COVERAGE) {
    dhamirRules.push({ ...method8, ruleCategory: 'dhamirMethod' });
    if (method8.implementationStatus !== 'implemented') {
      unavailableRules.push({ ...method8, ruleCategory: 'dhamirMethod' });
    }
  }

  return { verdictRules, supportingRules, generalWitnessRules, dhamirRules, irrelevantRules, unresolvedRules, unavailableRules };
}

export default { selectApplicableBookRules };
