/**
 * reading-planner.js
 *
 * Hall of Wisdom Core — Reading Planner (third implemented component, per
 * HALL_WISDOM_READING_PLANNER_COMPONENT_CONTRACT.md). Deterministic layer
 * that translates an Intent Result + Reading Strategy (+ optional Knowledge
 * Context) into a ReadingPlan — before any Rule Decision Engine or engine
 * execution happens.
 *
 * Foundation phase, per explicit instruction:
 *  - NOT connected to goral-hachol/engine/* (no Kashf/Hawi/Cards engine calls)
 *  - NOT connected to the live goral-rule-applicability-matrix.js /
 *    goral-knowledge-registry.js
 *  - no AI, no network, no UI, no QA, no Supabase
 *
 * buildReadingPlan() assumes valid input (does not self-validate) — callers
 * must run validatePlannerInput() first, matching the convention already
 * established by analyzeIntent()/buildReadingStrategy().
 */

import { PLAN_VERSION, EXECUTION_ORDER_DEFAULT } from './reading-planner-types.js';
import { isUncertaintyPolicy } from './reading-intelligence-types.js';

export { PLAN_VERSION };

function mkWarning(warningType, severity, message, affectedCategory, needsOrenDecision) {
  return { warningType, severity, message, affectedCategory: affectedCategory || null, needsOrenDecision: !!needsOrenDecision };
}

// ---------------------------------------------------------------------------
// Stop Result — used whenever the upstream Intent Result or Reading Strategy
// is itself unresolved (requiresClarification === true). Reading Planner
// never builds a full plan on an uncertain foundation.
// ---------------------------------------------------------------------------

function buildStopResult({ stopReason, clarificationQuestion, needsOrenDecision }) {
  return {
    stopped: true,
    stopComponent: 'readingPlanner',
    stopReason,
    recoverable: true,
    requiresClarification: true,
    clarificationQuestion: clarificationQuestion || null,
    needsOrenDecision: !!needsOrenDecision,
  };
}

// ---------------------------------------------------------------------------
// Category resolution — precedence-ordered so no category can ever land in
// more than one of the 7 decision buckets (Component Contract §6, rule 6).
// Precedence: conflicting (excluded from all) > forbidden > unavailable >
// advisorOnly > primaryDecision > verification > supporting > conditional.
// ---------------------------------------------------------------------------

function normalizeProvidedEvidenceCategories(sourceEvidencePointers) {
  if (!Array.isArray(sourceEvidencePointers)) return new Set();
  return new Set(
    sourceEvidencePointers
      .map((p) => (typeof p === 'string' ? p : (p && (p.category || p.ruleCategory)) || null))
      .filter(Boolean)
  );
}

function resolveCategories({ strategyConstraints, verificationPolicy, availableRuleCategories, sourceEvidencePointers }) {
  const mustInclude = strategyConstraints.mustInclude || [];
  const mayInclude = strategyConstraints.mayInclude || [];
  const mustExclude = strategyConstraints.mustExclude || [];
  const advisorOnlyInput = strategyConstraints.advisorOnly || [];
  const requiresEvidence = strategyConstraints.requiresEvidence || [];
  const forbiddenWithoutQuestion = strategyConstraints.forbiddenWithoutQuestion || [];

  const warnings = [];
  const hasAvailabilityList = Array.isArray(availableRuleCategories);
  const isAvailable = (cat) => !hasAvailabilityList || availableRuleCategories.includes(cat);

  // Rule 7: conflict between mustInclude and mustExclude — flagged, and the
  // category is excluded from every bucket until Oren resolves it (never a
  // silent pick of one side).
  const conflicting = mustInclude.filter((c) => mustExclude.includes(c));
  for (const cat of conflicting) {
    warnings.push(mkWarning('conflictingConstraints', 'critical', `הקטגוריה "${cat}" מופיעה גם ב-mustInclude וגם ב-mustExclude — נדרשת החלטת אורן.`, cat, true));
  }

  // forbiddenCategories = mustExclude ∪ forbiddenWithoutQuestion (rules 2+5), minus conflicting
  const forbiddenCategories = [...new Set([...mustExclude, ...forbiddenWithoutQuestion])].filter((c) => !conflicting.includes(c));

  // unavailableCategories = requested categories not present in availableRuleCategories (when provided)
  const requested = [...new Set([...mustInclude, ...mayInclude, ...requiresEvidence])];
  const unavailableCategories = requested.filter((c) => !conflicting.includes(c) && !forbiddenCategories.includes(c) && !isAvailable(c));

  // advisorOnlyCategories
  const advisorOnlyCategories = advisorOnlyInput.filter(
    (c) => !conflicting.includes(c) && !forbiddenCategories.includes(c) && !unavailableCategories.includes(c)
  );

  // primaryDecisionCategories (rule 1)
  const primaryDecisionCategories = mustInclude.filter(
    (c) => !conflicting.includes(c) && !forbiddenCategories.includes(c) && !unavailableCategories.includes(c) && !advisorOnlyCategories.includes(c)
  );
  for (const cat of mustInclude) {
    if (conflicting.includes(cat)) continue; // already warned via conflictingConstraints
    if (!primaryDecisionCategories.includes(cat)) {
      warnings.push(mkWarning('missingRequiredCategory', 'error', `הקטגוריה "${cat}" נדרשת (mustInclude) אך אינה נכנסת לתוכנית (לא-זמינה או חסומה).`, cat, true));
    }
  }
  if (primaryDecisionCategories.length === 0 && mustInclude.length === 0) {
    warnings.push(mkWarning('missingRequiredCategory', 'warning', 'לא הוגדרו קטגוריות-הכרעה-עיקריות (primaryDecisionCategories ריק).', null, false));
  }

  // verificationCategories — only meaningful when verificationPolicy !== 'none'
  const verificationCategories = verificationPolicy !== 'none'
    ? requiresEvidence.filter(
        (c) => !conflicting.includes(c) && !forbiddenCategories.includes(c) && !unavailableCategories.includes(c)
          && !advisorOnlyCategories.includes(c) && !primaryDecisionCategories.includes(c)
      )
    : [];

  // supportingCategories = mayInclude minus everything already claimed
  const supportingCategories = mayInclude.filter(
    (c) => !conflicting.includes(c) && !forbiddenCategories.includes(c) && !unavailableCategories.includes(c)
      && !advisorOnlyCategories.includes(c) && !primaryDecisionCategories.includes(c) && !verificationCategories.includes(c)
  );

  // conditionalCategories — v1: always empty (no activationCondition mechanism yet)
  const conditionalCategories = [];

  // Evidence tracking (rule 4)
  const providedEvidence = normalizeProvidedEvidenceCategories(sourceEvidencePointers);
  const relevantEvidenceCategories = requiresEvidence.filter(
    (c) => primaryDecisionCategories.includes(c) || verificationCategories.includes(c)
  );
  const evidenceRequirements = relevantEvidenceCategories.map((category) => ({
    category,
    satisfied: providedEvidence.has(category),
  }));
  const requiredInputs = evidenceRequirements.map((e) => e.category);
  const missingInputs = evidenceRequirements.filter((e) => !e.satisfied).map((e) => e.category);
  if (missingInputs.length > 0) {
    for (const cat of missingInputs) {
      warnings.push(mkWarning('missingEvidence', 'warning', `הקטגוריה "${cat}" דורשת evidence אך לא סופק sourceEvidencePointer מתאים.`, cat, false));
    }
  }

  return {
    primaryDecisionCategories, verificationCategories, conditionalCategories, supportingCategories,
    advisorOnlyCategories, forbiddenCategories, unavailableCategories,
    requiredInputs, missingInputs, evidenceRequirements,
    warnings,
  };
}

// ---------------------------------------------------------------------------
// Execution order (Component Contract §7)
// ---------------------------------------------------------------------------

function resolveExecutionOrder(categories) {
  const stageHasContent = {
    primaryDecision: categories.primaryDecisionCategories.length > 0,
    verification: categories.verificationCategories.length > 0,
    conditional: categories.conditionalCategories.length > 0,
    supporting: categories.supportingCategories.length > 0,
    advisorOnly: categories.advisorOnlyCategories.length > 0,
  };
  return EXECUTION_ORDER_DEFAULT.filter((stage) => stageHasContent[stage]);
}

// ---------------------------------------------------------------------------
// Client / Advisor visibility (Component Contract §8) — section IDs/category
// names only, never client-facing narrative text.
// ---------------------------------------------------------------------------

function resolveVisibility(categories) {
  const expectedClientSections = [
    ...categories.primaryDecisionCategories,
    ...categories.verificationCategories,
    ...categories.supportingCategories,
    ...categories.conditionalCategories,
  ];

  const advisorExtras = ['contradictionNotes'];
  if (categories.warnings.length > 0) advisorExtras.push('warnings');
  if (categories.missingInputs.length > 0) advisorExtras.push('evidenceGaps');

  const expectedAdvisorSections = [...new Set([
    ...expectedClientSections,
    ...categories.advisorOnlyCategories,
    ...advisorExtras,
  ])];

  const hiddenClientSections = [...new Set([
    ...categories.advisorOnlyCategories,
    ...categories.forbiddenCategories,
    ...categories.unavailableCategories,
  ])];

  return { expectedClientSections, expectedAdvisorSections, hiddenClientSections };
}

// ---------------------------------------------------------------------------
// Planner Reason (Component Contract §8 in the earlier doc / §11 here) —
// deterministic template, never AI, never chain-of-thought, never PII beyond
// category names.
// ---------------------------------------------------------------------------

function buildPlannerReason({ categories }) {
  const parts = [];
  if (categories.primaryDecisionCategories.length > 0) {
    parts.push(`נכללו ${categories.primaryDecisionCategories.join(', ')} כקטגוריות-הכרעה-עיקריות`);
  } else {
    parts.push('לא נכללו קטגוריות-הכרעה-עיקריות');
  }
  if (categories.forbiddenCategories.length > 0) {
    parts.push(`נחסמו ${categories.forbiddenCategories.slice(0, 3).join(', ')}`);
  }
  if (categories.advisorOnlyCategories.length > 0) {
    parts.push(`${categories.advisorOnlyCategories.slice(0, 3).join(', ')} מסומנות advisor-only`);
  }
  if (categories.unavailableCategories.length > 0) {
    parts.push(`${categories.unavailableCategories.slice(0, 3).join(', ')} אינן זמינות`);
  }
  if (categories.warnings.length > 0) {
    parts.push(`${categories.warnings.length} warnings נוצרו`);
  }
  return parts.join('; ') + '.';
}

// ---------------------------------------------------------------------------
// uncertaintyPolicy — derived deterministically from readingStrategy's own
// confidencePolicy, reusing the existing UNCERTAINTY_POLICY_VALUES enum
// (reading-intelligence-types.js) rather than inventing a new one.
// ---------------------------------------------------------------------------

function deriveUncertaintyPolicy(confidencePolicy) {
  if (confidencePolicy === 'strict') return 'mustReflectInClientText';
  if (confidencePolicy === 'lenient') return 'none';
  return 'advisorOnlyNote'; // 'flagIfBelowThreshold' and any other value
}

// ---------------------------------------------------------------------------
// Engine entry point
// ---------------------------------------------------------------------------

/**
 * @param {object} input - see reading-planner-validators.js::validatePlannerInput
 * @returns {object} ReadingPlan, or a Stop Result ({ stopped: true, ... })
 */
export function buildReadingPlan(input) {
  const {
    question, readingDomain, method, spreadId, topicId, questionType,
    intentResult, readingStrategy, availableRuleCategories, sourceEvidencePointers,
  } = input || {};

  // §3: if intentResult or readingStrategy requires clarification, Reading
  // Planner does not proceed to a full plan — it returns a Stop Result.
  if (intentResult?.requiresClarification) {
    return buildStopResult({
      stopReason: 'intentResult.requiresClarification is true',
      clarificationQuestion: intentResult.clarificationQuestion,
      needsOrenDecision: true,
    });
  }
  if (readingStrategy?.requiresClarification) {
    return buildStopResult({
      stopReason: 'readingStrategy.requiresClarification is true',
      clarificationQuestion: readingStrategy.clarificationQuestion,
      needsOrenDecision: true,
    });
  }

  const categories = resolveCategories({
    strategyConstraints: readingStrategy.strategyConstraints,
    verificationPolicy: readingStrategy.verificationPolicy,
    availableRuleCategories,
    sourceEvidencePointers,
  });
  const executionOrder = resolveExecutionOrder(categories);
  const visibility = resolveVisibility(categories);
  const plannerReason = buildPlannerReason({ categories });

  const hasConflict = categories.warnings.some((w) => w.warningType === 'conflictingConstraints');
  const needsOrenDecision = hasConflict || categories.warnings.some((w) => w.needsOrenDecision);

  const planId = `plan-${intentResult.primaryIntent}-${questionType}${readingDomain === 'cards' ? '-cards' : ''}`;

  return {
    planId,
    planVersion: PLAN_VERSION,
    readingDomain,
    method,
    spreadId: spreadId ?? null,
    topicId: topicId ?? null,
    questionType,
    primaryIntent: intentResult.primaryIntent,
    strategyId: readingStrategy.strategyId,
    goal: readingStrategy.goal,

    primaryDecisionCategories: categories.primaryDecisionCategories,
    verificationCategories: categories.verificationCategories,
    conditionalCategories: categories.conditionalCategories,
    supportingCategories: categories.supportingCategories,
    advisorOnlyCategories: categories.advisorOnlyCategories,
    forbiddenCategories: categories.forbiddenCategories,
    unavailableCategories: categories.unavailableCategories,

    requiredInputs: categories.requiredInputs,
    missingInputs: categories.missingInputs,
    evidenceRequirements: categories.evidenceRequirements,
    sourceEvidencePointers: Array.isArray(sourceEvidencePointers) ? sourceEvidencePointers.slice() : [],

    expectedClientSections: visibility.expectedClientSections,
    expectedAdvisorSections: visibility.expectedAdvisorSections,
    hiddenClientSections: visibility.hiddenClientSections,

    executionOrder,
    verificationOrder: categories.verificationCategories.slice(),
    contradictionPolicy: readingStrategy.contradictionPolicy,
    uncertaintyPolicy: deriveUncertaintyPolicy(readingStrategy.confidencePolicy),
    timingPolicy: readingStrategy.timingPolicy,
    spiritualPolicy: readingStrategy.spiritualPolicy,

    plannerWarnings: categories.warnings,
    plannerReason,
    confidence: typeof readingStrategy.confidence === 'number' ? readingStrategy.confidence : 0,
    requiresClarification: false,
    clarificationQuestion: null,
    needsOrenDecision,
  };
}

export default { buildReadingPlan, PLAN_VERSION };
