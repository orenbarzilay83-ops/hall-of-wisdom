/**
 * kashf-book-rule-selector.js
 *
 * Deterministic selector over KASHF_BOOK_RULE_CATALOG /
 * KASHF_DHAMIR_METHOD_COVERAGE (kashf-book-rule-catalog.js). Pure lookup +
 * categorization — computes NO new facts about the board, invents NO
 * precedence beyond what a rule record already declares.
 *
 * ── v3 (semantic-correction round) ──
 * v2 built its "applied" bucket directly from `implementationStatus`. That
 * conflates "has code" with "this reading's finding/decision actually used
 * it" — five genuinely different facts were being treated as one:
 *
 *   implemented : rule has code in the engine (implementationStatus)
 *   applicable  : the source allows considering this rule for this topic
 *   selected    : the selector matched this rule to this topic/method
 *   evaluated   : PROVEN (via runtimeEvidence.evaluated) that the engine
 *                 actually computed this rule's own result on this call
 *   applied     : evaluated AND the result demonstrably reached the
 *                 verdict (feedsOverallPositive) or a professional/
 *                 narrative finding (feedsNarrativeOrProfessionalFinding)
 *
 * `implemented` never implies `applied` here — see kashf-p49-house6-
 * sorcery-domain, which IS implementationStatus:"implemented" but has NO
 * independent runtimeEvidence (it is only ever folded into another rule's
 * own computed figure), so it lands in `implementedAvailableRules`, not
 * `appliedBookRules`.
 *
 * ── Bucket structure ──
 * Category buckets (what KIND of rule — every topic-matched rule lands in
 * exactly one, based on ruleCategory, independent of operational status):
 *   directVerdictRules         — ruleCategory 'verdictFormula' (book-authorized
 *                                 to determine the topic's main verdict)
 *   supportingCalculationRules — ruleCategory 'supportingCheck' | 'foundationalContext'
 *   generalWitnessRules        — ruleCategory 'witnessScheme' | 'generalPrinciple'
 *   candidateDhamirRules       — ruleCategory 'aggregationRule' + the full
 *                                 8-method KASHF_DHAMIR_METHOD_COVERAGE map.
 *                                 Renamed from v2's "applicableDhamirRules" —
 *                                 "candidate" makes clear these are what the
 *                                 book makes AVAILABLE for the topic-independent
 *                                 dhamir mechanism, not a claim that all 9 ran.
 *                                 See dhamirCoverage for the real 5/8 split.
 *
 * Status buckets (operational truth, computed from runtimeEvidence, NOT
 * from implementationStatus alone):
 *   selectedRules        — every rule matched to this topic (union of the
 *                           4 category buckets above) — "the selector chose
 *                           to examine these for this reading"
 *   evaluatedRules        — subset of selectedRules where
 *                           runtimeEvidence.evaluated === true — "proven
 *                           the engine actually computed this"
 *   appliedBookRules      — subset of evaluatedRules where
 *                           runtimeEvidence.feedsOverallPositive === true
 *                           OR runtimeEvidence.feedsNarrativeOrProfessionalFinding
 *                           === true — "proven this result reached a
 *                           finding or the verdict"
 *   implementedAvailableRules — implementationStatus === 'implemented' but
 *                           NOT in evaluatedRules (code exists, matched to
 *                           topic, but no independent runtime evidence —
 *                           e.g. house6-domain)
 *
 * Non-implemented rules, partitioned by WHY they are unavailable (mutually
 * exclusive — each rule lands in exactly one of these three):
 *   missingVerifiedRelevantRules  — implementationStatus !== 'implemented'
 *                           AND resolutionStatus === 'resolved' AND
 *                           applicabilityStatus is verifiedRelevant/generalRule
 *                           (source is clear and relevance is proven — simply
 *                           not coded yet)
 *   unresolvedApplicabilityRules — resolutionStatus === 'resolved' AND
 *                           applicabilityStatus === 'unresolved' (the rule's
 *                           own mechanism is clearly worded, but whether it
 *                           even belongs to THIS topic is unproven — e.g.
 *                           connection-type-by-element, sharing a page with
 *                           the sorcery formulas is not proof of relevance)
 *   unresolvedSourceRelationshipRules — resolutionStatus === 'unresolvedSourceRelationship'.
 *                           NOTE: this bucket is NOT exclusive with
 *                           appliedBookRules/evaluatedRules — kashf-p53-
 *                           witness-scheme-basic appears in BOTH (it is
 *                           genuinely implemented+evaluated+applied AND its
 *                           relationship to kashf-p101-witness-scheme-extended
 *                           is unresolved; these are independent facts).
 *   requiresFullContextReviewRules — resolutionStatus === 'requiresFullContextReview'
 *                           (general doctrines/systems needing more source
 *                           context before any mechanical rule can be written)
 *
 *   unavailableBookRules  — convenience union of missingVerifiedRelevantRules +
 *                           unresolvedApplicabilityRules + requiresFullContextReviewRules
 *                           + the NOT-implemented members of
 *                           unresolvedSourceRelationshipRules (i.e. excludes
 *                           kashf-p53-witness-scheme-basic, which IS available)
 *   irrelevantRules        — catalog entries that do not match this topicId
 *
 * A rule with implementationStatus !== 'implemented' can NEVER appear in
 * evaluatedRules or appliedBookRules — this is enforced structurally by
 * requiring runtimeEvidence.evaluated (which is only ever true for entries
 * whose implementation was directly re-verified against a live engine run;
 * every 'missing' entry in the catalog carries runtimeEvidence.evaluated:false).
 */

import { KASHF_BOOK_RULE_CATALOG, KASHF_DHAMIR_METHOD_COVERAGE } from '../data/sources/kashf-al-asrar/kashf-book-rule-catalog.js';

function matchesTopic(rule, topicId) {
  return Array.isArray(rule.appliesToTopics) && rule.appliesToTopics.includes(topicId);
}

function categoryBucketFor(ruleCategory) {
  switch (ruleCategory) {
    case 'verdictFormula':
      return 'directVerdictRules';
    case 'supportingCheck':
    case 'foundationalContext':
      return 'supportingCalculationRules';
    case 'witnessScheme':
    case 'generalPrinciple':
      return 'generalWitnessRules';
    case 'aggregationRule':
    case 'dhamirMethod':
      return 'candidateDhamirRules';
    default:
      return null;
  }
}

function isEvaluated(rule) {
  return !!(rule.runtimeEvidence && rule.runtimeEvidence.evaluated === true);
}

function isApplied(rule) {
  if (!isEvaluated(rule)) return false;
  const ev = rule.runtimeEvidence;
  return ev.feedsOverallPositive === true || ev.feedsNarrativeOrProfessionalFinding === true;
}

/**
 * @param {object} input
 * @param {string} input.method - e.g. 'kashf'
 * @param {string} input.topicId - e.g. 'spiritualDiagnostics'
 * @returns {object} bucketed rule sets — see file header for exact semantics
 */
export function selectApplicableBookRules(input = {}) {
  const { method, topicId } = input;

  const empty = {
    directVerdictRules: [], supportingCalculationRules: [], generalWitnessRules: [], candidateDhamirRules: [],
    selectedRules: [], evaluatedRules: [], appliedBookRules: [], implementedAvailableRules: [],
    missingVerifiedRelevantRules: [], unresolvedApplicabilityRules: [],
    unresolvedSourceRelationshipRules: [], requiresFullContextReviewRules: [],
    unavailableBookRules: [], irrelevantRules: [],
  };
  if (method !== 'kashf' || !topicId) return empty;

  const directVerdictRules = [];
  const supportingCalculationRules = [];
  const generalWitnessRules = [];
  const candidateDhamirRules = [];
  const selectedRules = [];
  const evaluatedRules = [];
  const appliedBookRules = [];
  const implementedAvailableRules = [];
  const missingVerifiedRelevantRules = [];
  const unresolvedApplicabilityRules = [];
  const unresolvedSourceRelationshipRules = [];
  const requiresFullContextReviewRules = [];
  const unavailableBookRules = [];
  const irrelevantRules = [];

  const categoryBucketMap = { directVerdictRules, supportingCalculationRules, generalWitnessRules, candidateDhamirRules };

  for (const rule of KASHF_BOOK_RULE_CATALOG) {
    const matched = matchesTopic(rule, topicId);

    if (!matched) {
      irrelevantRules.push(rule);
      continue;
    }

    selectedRules.push(rule);

    const bucketName = categoryBucketFor(rule.ruleCategory);
    if (bucketName) categoryBucketMap[bucketName].push(rule);

    if (isEvaluated(rule)) {
      evaluatedRules.push(rule);
      if (isApplied(rule)) {
        appliedBookRules.push(rule);
      }
    } else if (rule.implementationStatus === 'implemented') {
      // Claimed implemented, but no independently-verified runtime
      // evidence this round — never guessed into appliedBookRules.
      implementedAvailableRules.push(rule);
    }

    // resolutionStatus buckets — NOT exclusive with evaluated/applied above.
    // A rule can be both genuinely applied (kashf-p53-witness-scheme-basic)
    // AND carry an unresolved relationship to a sibling rule — both facts
    // are surfaced, neither erases the other.
    if (rule.resolutionStatus === 'unresolvedSourceRelationship') {
      unresolvedSourceRelationshipRules.push(rule);
    } else if (rule.resolutionStatus === 'requiresFullContextReview') {
      requiresFullContextReviewRules.push(rule);
    }

    if (rule.implementationStatus !== 'implemented') {
      if (rule.resolutionStatus === 'resolved' && rule.applicabilityStatus === 'unresolved') {
        unresolvedApplicabilityRules.push(rule);
      } else if (rule.resolutionStatus === 'resolved' && (rule.applicabilityStatus === 'verifiedRelevant' || rule.applicabilityStatus === 'generalRule')) {
        missingVerifiedRelevantRules.push(rule);
      }
      // requiresFullContextReview / unresolvedSourceRelationship entries
      // are already captured in their own buckets above — not duplicated
      // into missingVerifiedRelevantRules or unresolvedApplicabilityRules.
    }
  }

  // Dhamir is documented in the book itself as independent of the chosen
  // topic ("עצמאי מהנושא שנבחר") — surfaced as CANDIDATES for every Kashf
  // reading, not gated by topicId. Whether each one is actually evaluated
  // this round is a separate, honestly-tracked fact (runtimeEvidence) —
  // "candidate" never implies "ran".
  for (const method8 of KASHF_DHAMIR_METHOD_COVERAGE) {
    const tagged = { ...method8, ruleCategory: 'dhamirMethod' };
    candidateDhamirRules.push(tagged);
    selectedRules.push(tagged);

    if (isEvaluated(tagged)) {
      evaluatedRules.push(tagged);
      if (isApplied(tagged)) appliedBookRules.push(tagged);
    } else if (tagged.implementationStatus === 'implemented') {
      implementedAvailableRules.push(tagged);
    } else {
      // The 3 missing dhamir sub-methods are well-understood (the source
      // describes their mechanism) — just not yet coded. Not tracked in
      // missingVerifiedRelevantRules (that bucket is for catalog rules with
      // an explicit applicabilityStatus); dhamirCoverage reports them.
      unavailableBookRules.push(tagged);
    }
  }

  // unavailableBookRules: convenience union for "do not rely on these" —
  // explicitly excludes kashf-p53-witness-scheme-basic (present in
  // unresolvedSourceRelationshipRules but genuinely available/applied).
  const alreadyUnavailable = new Set(unavailableBookRules.map((r) => r.ruleKey || r.methodKey));
  for (const rule of [
    ...missingVerifiedRelevantRules, ...unresolvedApplicabilityRules, ...requiresFullContextReviewRules,
    ...unresolvedSourceRelationshipRules.filter((r) => r.implementationStatus !== 'implemented'),
  ]) {
    const id = rule.ruleKey || rule.methodKey;
    if (!alreadyUnavailable.has(id)) {
      alreadyUnavailable.add(id);
      unavailableBookRules.push(rule);
    }
  }

  return {
    directVerdictRules, supportingCalculationRules, generalWitnessRules, candidateDhamirRules,
    selectedRules, evaluatedRules, appliedBookRules, implementedAvailableRules,
    missingVerifiedRelevantRules, unresolvedApplicabilityRules,
    unresolvedSourceRelationshipRules, requiresFullContextReviewRules,
    unavailableBookRules, irrelevantRules,
  };
}

export default { selectApplicableBookRules };
