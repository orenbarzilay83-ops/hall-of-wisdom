/**
 * kashf-canonical-rule-decision.js
 *
 * Deterministic Rule Decision payload adapter for the canonical Kashf path.
 *
 * IMPORTANT:
 * - This is NOT a replacement for the generic Hall of Wisdom Rule Decision
 *   Engine and does not invent Rule Definitions or rule categories.
 * - It projects decisions that are already established by the authoritative
 *   Kashf question route / canonical retrieval / canonical reading / professional
 *   safety gates.
 * - Exactly one canonical Kashf method may be activated.
 * - Explicit doNotMixWith methods and non-selected retrieval candidates are
 *   rejected for THIS reading only; they are not globally invalid rules.
 */

export const KASHF_CANONICAL_RULE_DECISION_VERSION = 'kashf-canonical-rule-decision-v1';

function uniqueStrings(values = []) {
  return [...new Set((Array.isArray(values) ? values : []).filter((value) => typeof value === 'string' && value.length > 0))];
}

function buildSourceEvidence(canonicalRetrieval) {
  const v57 = canonicalRetrieval?.v57;
  if (!v57?.hebrewRule) return [];
  const page = v57.page != null ? ` עמ׳ ${v57.page}` : '';
  return [`v57${page}: ${v57.hebrewRule}`];
}

function isExactRunnableSelection(bridge, selectedMethodId) {
  return Boolean(
    selectedMethodId
    && bridge?.resolution?.state === 'resolved'
    && bridge?.resolution?.kashfMethodId === selectedMethodId
    && bridge?.canonicalRetrieval?.kashfMethodId === selectedMethodId
    && bridge?.canonicalReading?.valid === true
    && bridge?.canonicalReading?.canRunKashf === true
    && bridge?.canonicalReading?.kashfMethodId === selectedMethodId
    && bridge?.professionalVerdictSafety?.isSafe === true
    && bridge?.aiVerdictAllowed === true
  );
}

/**
 * @param {object|null} canonicalBridge output of buildKashfCanonicalAiBridge()
 * @returns {{
 *   version: string,
 *   selectedMethodId: string|null,
 *   intentId: string|null,
 *   activatedRuleIds: string[],
 *   rejectedRuleIds: string[],
 *   sourceEvidence: string[],
 *   decisionSummary: string,
 *   executionAllowed: boolean,
 *   decisionReason: string
 * }}
 */
export function buildKashfCanonicalRuleDecisionPayload(canonicalBridge) {
  const selectedMethodId = canonicalBridge?.resolution?.kashfMethodId || null;
  const intentId = canonicalBridge?.resolution?.kashfIntentId || null;
  const activated = isExactRunnableSelection(canonicalBridge, selectedMethodId);

  const explicitlyIsolated = uniqueStrings(canonicalBridge?.canonicalRetrieval?.doNotMixWith);
  const nonSelectedCandidates = uniqueStrings(
    (canonicalBridge?.candidates || [])
      .map((candidate) => candidate?.kashfMethodId)
      .filter((methodId) => methodId && methodId !== selectedMethodId)
  );

  const rejected = uniqueStrings([
    ...(!activated && selectedMethodId ? [selectedMethodId] : []),
    ...explicitlyIsolated,
    ...nonSelectedCandidates,
  ]).filter((methodId) => !activated || methodId !== selectedMethodId);

  const activatedRuleIds = activated ? [selectedMethodId] : [];
  const sourceEvidence = buildSourceEvidence(canonicalBridge?.canonicalRetrieval);

  let decisionReason;
  let decisionSummary;

  if (activated) {
    decisionReason = 'authoritative-canonical-route-passed-runtime-source-retrieval-and-professional-safety-gates';
    const page = canonicalBridge?.canonicalRetrieval?.v57?.page;
    const sourcePart = page != null ? ` מקור v57 עמ׳ ${page}.` : ' מקור v57 קנוני אותר.';
    decisionSummary = `הופעל כלל כשף קנוני יחיד: ${selectedMethodId} עבור ${intentId || 'הכוונה שנבחרה'}. נדחו ${rejected.length} מסלולים מפורשים שאסור לערבב בקריאה זו.${sourcePart} אין הצבעת רוב, fallback או צירוף שיטה חלופית.`;
  } else if (selectedMethodId) {
    const reason = canonicalBridge?.resolution?.reason
      || canonicalBridge?.canonicalReading?.reason
      || canonicalBridge?.professionalVerdictSafety?.reason
      || 'canonical-gates-not-satisfied';
    decisionReason = `not-activated:${reason}`;
    decisionSummary = `לא הופעל כלל כשף: ${selectedMethodId} לא עבר את כל שערי המקור, ה-runtime והבטיחות הקנוניים לקריאה זו. נדחו ${rejected.length} מסלולים; לא הופעל fallback ולא נבחרה שיטה חלופית.`;
  } else {
    const state = canonicalBridge?.resolution?.state || 'not-resolved';
    decisionReason = `no-canonical-method:${state}`;
    decisionSummary = `לא הופעל כלל כשף: לא נבחר kashfMethodId קנוני יחיד לקריאה זו (${state}). נדחו ${rejected.length} מסלולים; אין השלמה או fallback מן הדעת.`;
  }

  return Object.freeze({
    version: KASHF_CANONICAL_RULE_DECISION_VERSION,
    selectedMethodId,
    intentId,
    activatedRuleIds: Object.freeze(activatedRuleIds),
    rejectedRuleIds: Object.freeze(rejected),
    sourceEvidence: Object.freeze(sourceEvidence),
    decisionSummary,
    executionAllowed: activated,
    decisionReason,
  });
}

export default {
  buildKashfCanonicalRuleDecisionPayload,
  KASHF_CANONICAL_RULE_DECISION_VERSION,
};
