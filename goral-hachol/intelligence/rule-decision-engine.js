/**
 * rule-decision-engine.js
 *
 * Hall of Wisdom Core — Rule Decision Engine (fourth implemented component,
 * per HALL_WISDOM_RULE_DECISION_ENGINE_COMPONENT_CONTRACT.md). Deterministic
 * layer that translates a Reading Plan + Rule Definitions + Knowledge
 * Context + Strategy Constraints into per-rule Rule Decisions — before any
 * Engine Execution Coordinator, engine call, Narrative, or Audit.
 *
 * Foundation phase, per explicit instruction:
 *  - NOT connected to goral-hachol/engine/* (no Kashf/Hawi/Cards engine calls)
 *  - NOT connected to the live goral-rule-applicability-matrix.js /
 *    goral-knowledge-registry.js
 *  - no AI, no network, no UI, no QA, no Supabase
 *  - Reading Planner / Reading Strategy Builder / Intent Analyzer untouched
 *
 * This component returns Rule Decisions only — it never executes anything,
 * never builds Narrative, never performs Audit (Component Contract §2).
 */

import {
  ENGINE_VERSION, isRuleDecisionValue, isWarningSeverity, isKnownConstraintCategoryForDomain,
} from './rule-decision-types.js';

export { ENGINE_VERSION };

const CATEGORY_BUCKET_FIELDS = [
  'primaryDecisionCategories', 'verificationCategories', 'conditionalCategories',
  'supportingCategories', 'advisorOnlyCategories',
];

function mkWarning(warningType, severity, ruleId, message, recoverable, needsOrenDecision) {
  return {
    warningId: `w-${warningType}-${ruleId || 'general'}-${Math.random().toString(36).slice(2, 8)}`,
    warningType, severity, ruleId: ruleId || null, message,
    recoverable: recoverable !== false, needsOrenDecision: !!needsOrenDecision,
  };
}

function mkConflict(conflictType, ruleIds, severity, description, recoverable, needsOrenDecision) {
  return { conflictType, ruleIds: ruleIds.slice(), severity, description, recoverable: !!recoverable, needsOrenDecision: !!needsOrenDecision };
}

// ---------------------------------------------------------------------------
// Step 1 of Decision Order — structural validity of the Rule Definition
// itself. A Rule Definition that fails this is excluded from every decision
// bucket entirely (never forbidden/unavailable — those imply "considered
// but blocked"; this means "never considered at all").
// ---------------------------------------------------------------------------

function isStructurallyValidRuleDefinition(ruleDef) {
  if (!ruleDef || typeof ruleDef !== 'object') return false;
  if (typeof ruleDef.ruleId !== 'string' || ruleDef.ruleId.length === 0) return false;
  if (typeof ruleDef.ruleVersion !== 'string' || ruleDef.ruleVersion.length === 0) return false;
  if (typeof ruleDef.readingDomain !== 'string' || typeof ruleDef.method !== 'string') return false;
  if (typeof ruleDef.ruleCategory !== 'string' || ruleDef.ruleCategory.length === 0) return false;
  if (!isKnownConstraintCategoryForDomain(ruleDef.ruleCategory, ruleDef.readingDomain)) return false;
  if (typeof ruleDef.sourceId !== 'string' && ruleDef.sourceId !== null) return false;
  return true;
}

// ---------------------------------------------------------------------------
// Per-rule decision — implements Decision Order (§6, 14 steps) procedurally
// and Decision Precedence (§7, 8 tiers, waterfall) for the final `decision`
// value. Never invents a Rule Definition, never mutates one — read-only.
// ---------------------------------------------------------------------------

function decideRule(ruleDef, ctx) {
  const base = { ruleId: ruleDef?.ruleId ?? null, ruleVersion: ruleDef?.ruleVersion ?? null, ruleCategory: ruleDef?.ruleCategory ?? null };

  // Decision Order step 1: structural validity
  if (!isStructurallyValidRuleDefinition(ruleDef)) {
    return {
      ...base, decision: null, excluded: true,
      decisionReason: 'Rule Definition נכשל בבדיקת-תקינות-מבנית (ruleCategory לא-מוכר/לא-מתאים-לדומיין, או שדה-חובה חסר) — הוחרג מכל דלי-החלטה.',
      sourceEvidence: null, matchedConditions: [], missingConditions: [], requiredInputs: [], missingInputs: [],
      activationCondition: null, clientVisibility: null, executionPriority: null, conflicts: [],
      confidence: 0, warningIds: [], needsOrenDecision: false,
    };
  }

  const warnings = [];

  // Decision Precedence Tier 1 (Decision Order steps 2+3): domain/method mismatch
  if (ruleDef.readingDomain !== ctx.readingDomain || ruleDef.method !== ctx.method) {
    const w = mkWarning('crossDomainRule', 'error', ruleDef.ruleId, `Rule "${ruleDef.ruleId}" (${ruleDef.readingDomain}/${ruleDef.method}) אינו תואם לקריאה הנוכחית (${ctx.readingDomain}/${ctx.method}).`, true, false);
    warnings.push(w);
    return finalizeDecision(ruleDef, 'unavailable', 'Domain/Method mismatch — Rule Definition שייך ל-Domain/Method אחר.', { warnings });
  }

  // Decision Precedence Tier 2 (Decision Order step 4): missing source evidence
  const hasSourceEvidence = ruleDef.sourceId && Array.isArray(ruleDef.sourceEvidence) && ruleDef.sourceEvidence.length > 0;
  if (!hasSourceEvidence) {
    const disputed = ruleDef.status === 'disputed' || ruleDef.needsOrenDecision === true;
    const w = mkWarning('missingSourceEvidence', 'error', ruleDef.ruleId, `Rule "${ruleDef.ruleId}" חסר sourceEvidence תקף — לא ניתן לסמן required/allowed.`, true, disputed);
    warnings.push(w);
    return finalizeDecision(ruleDef, 'unavailable', 'Missing source evidence.', { warnings, needsOrenDecision: disputed });
  }

  // Decision Order steps 5-7: applicability (topic/questionType/intent)
  const notApplicable =
    (Array.isArray(ruleDef.topicIds) && ruleDef.topicIds.length > 0 && ctx.topicId && !ruleDef.topicIds.includes(ctx.topicId)) ||
    (Array.isArray(ruleDef.questionTypes) && ruleDef.questionTypes.length > 0 && !ruleDef.questionTypes.includes(ctx.questionType)) ||
    (Array.isArray(ruleDef.intents) && ruleDef.intents.length > 0 && !ruleDef.intents.includes(ctx.primaryIntent));
  if (notApplicable) {
    return finalizeDecision(ruleDef, 'unavailable', 'Rule אינו רלוונטי ל-topicId/questionType/primaryIntent הנוכחיים.', { warnings });
  }

  // Decision Order step 8: does the Reading Plan even carry this category?
  const inForbidden = ctx.readingPlan.forbiddenCategories.includes(ruleDef.ruleCategory);
  const inPlanUnavailable = ctx.readingPlan.unavailableCategories.includes(ruleDef.ruleCategory);
  const inAdvisorOnlyCategory = ctx.readingPlan.advisorOnlyCategories.includes(ruleDef.ruleCategory);
  const inPrimary = ctx.readingPlan.primaryDecisionCategories.includes(ruleDef.ruleCategory);
  const inVerification = ctx.readingPlan.verificationCategories.includes(ruleDef.ruleCategory);
  const inSupporting = ctx.readingPlan.supportingCategories.includes(ruleDef.ruleCategory);
  const inConditionalBucket = ctx.readingPlan.conditionalCategories.includes(ruleDef.ruleCategory);

  if (inPlanUnavailable) {
    return finalizeDecision(ruleDef, 'unavailable', 'הקטגוריה מסומנת unavailable ב-Reading Plan.', { warnings });
  }
  if (!inForbidden && !inAdvisorOnlyCategory && !inPrimary && !inVerification && !inSupporting && !inConditionalBucket) {
    return finalizeDecision(ruleDef, 'unavailable', 'הקטגוריה אינה חלק מ-Reading Plan הנוכחי.', { warnings });
  }

  // Decision Precedence Tier 3 (Decision Order step 9): forbidden
  if (inForbidden) {
    const w = mkWarning('forbiddenRuleRequested', 'warning', ruleDef.ruleId, `Rule "${ruleDef.ruleId}" בקטגוריה אסורה (${ruleDef.ruleCategory}).`, true, false);
    warnings.push(w);
    return finalizeDecision(ruleDef, 'forbidden', 'הקטגוריה מסומנת forbidden ב-Reading Plan/Strategy Constraints.', { warnings });
  }

  const requiredInputs = Array.isArray(ruleDef.requiredInputs) ? ruleDef.requiredInputs : [];
  const missingInputs = requiredInputs.filter((inp) => !ctx.availableInputs.includes(inp));
  const activationConditions = Array.isArray(ruleDef.activationConditions) ? ruleDef.activationConditions : [];
  const missingConditions = activationConditions.filter((c) => !ctx.metActivationConditions.includes(c));
  const matchedConditions = activationConditions.filter((c) => ctx.metActivationConditions.includes(c));

  // Decision Precedence Tier 4 (Decision Order step 12): advisorOnly —
  // takes priority over missing-condition/missing-input (tiers 5-6):
  // advisor-only rules are never client-facing, so incompleteness does not
  // block them the same way it would a client-visible rule.
  if (inAdvisorOnlyCategory || ruleDef.clientVisibility === 'advisorOnly') {
    return finalizeDecision(ruleDef, 'advisorOnly', 'הקטגוריה/Rule מסומנים advisorOnly.', {
      warnings, missingInputs, missingConditions, matchedConditions, clientVisibility: 'advisorOnly',
    });
  }

  // Decision Precedence Tier 5: missing activation condition
  if (missingConditions.length > 0) {
    const w = mkWarning('unmetActivationCondition', 'warning', ruleDef.ruleId, `Rule "${ruleDef.ruleId}" ממתין ל-activationCondition שטרם התקיים.`, true, false);
    warnings.push(w);
    return finalizeDecision(ruleDef, 'conditional', 'activationCondition טרם התקיים.', { warnings, missingInputs, missingConditions, matchedConditions });
  }

  // Decision Precedence Tier 6: missing required input
  if (missingInputs.length > 0) {
    // Conservative default: treat as conditional (plausibly-completable)
    // unless the missing input's own category is itself marked unavailable
    // at the plan level — in which case it can never be completed.
    const uncompletable = missingInputs.some((inp) => ctx.readingPlan.unavailableCategories.includes(inp));
    const w = mkWarning('missingRequiredInput', 'warning', ruleDef.ruleId, `Rule "${ruleDef.ruleId}" חסר requiredInputs: ${missingInputs.join(', ')}.`, !uncompletable, false);
    warnings.push(w);
    return finalizeDecision(ruleDef, uncompletable ? 'unavailable' : 'conditional', uncompletable ? 'requiredInputs חסרים ואינם-ניתנים-להשלמה.' : 'requiredInputs חסרים אך ניתנים-להשלמה בהמשך.', { warnings, missingInputs, missingConditions, matchedConditions });
  }

  // Decision Precedence Tier 7: primary decision required by plan
  if (inPrimary) {
    return finalizeDecision(ruleDef, 'required', 'הקטגוריה מסומנת primaryDecisionCategories ב-Reading Plan; כל התנאים התקיימו.', { warnings, missingInputs, missingConditions, matchedConditions });
  }

  // Decision Precedence Tier 8: optional/supporting rule
  return finalizeDecision(ruleDef, 'allowed', 'הקטגוריה נתמכת (verification/supporting/conditional-bucket) אך אינה primaryDecision.', { warnings, missingInputs, missingConditions, matchedConditions });
}

function finalizeDecision(ruleDef, decision, decisionReason, extra) {
  const { warnings = [], missingInputs = [], missingConditions = [], matchedConditions = [], clientVisibility, needsOrenDecision } = extra || {};
  return {
    ruleId: ruleDef.ruleId,
    ruleVersion: ruleDef.ruleVersion,
    ruleCategory: ruleDef.ruleCategory,
    decision,
    decisionReason,
    sourceEvidence: ruleDef.sourceEvidence || null,
    matchedConditions,
    missingConditions,
    requiredInputs: Array.isArray(ruleDef.requiredInputs) ? ruleDef.requiredInputs : [],
    missingInputs,
    activationCondition: (Array.isArray(ruleDef.activationConditions) && ruleDef.activationConditions.length > 0) ? ruleDef.activationConditions.join(' & ') : null,
    clientVisibility: clientVisibility || ruleDef.clientVisibility || 'client',
    executionPriority: decision === 'required' ? 1 : (decision === 'allowed' ? 2 : (decision === 'conditional' ? 3 : (decision === 'advisorOnly' ? 4 : 0))),
    conflicts: [],
    confidence: typeof ruleDef.confidence === 'number' ? ruleDef.confidence : 0.5,
    warningIds: warnings.map((w) => w.warningId),
    needsOrenDecision: !!needsOrenDecision,
    _warnings: warnings, // internal-only, stripped before final output (see runRuleDecisionEngine)
  };
}

// ---------------------------------------------------------------------------
// Rule Set Validation — runs AFTER every individual Rule Decision is made,
// BEFORE executionInstructions are built. Never adds/removes Rules, never
// changes a Decision — only validates the final set for internal
// consistency (Component Contract, new "Rule Set Validation" requirement).
// ---------------------------------------------------------------------------

export function validateRuleSet(records, ruleDefinitionsById) {
  const conflicts = [];
  const warnings = [];

  const activeDecisions = ['required', 'allowed', 'conditional', 'advisorOnly'];
  const activeRecords = records.filter((r) => !r.excluded && activeDecisions.includes(r.decision));
  const activeIds = new Set(activeRecords.map((r) => r.ruleId));

  // 1. Duplicate execution — same ruleId appears more than once among decision records.
  const seenIds = new Map();
  for (const r of records) {
    if (r.excluded) continue;
    seenIds.set(r.ruleId, (seenIds.get(r.ruleId) || 0) + 1);
  }
  for (const [ruleId, count] of seenIds) {
    if (count > 1) {
      conflicts.push(mkConflict('executionOrderConflict', [ruleId], 'critical', `Rule "${ruleId}" מופיע ${count} פעמים בסט-ההחלטות — ביצוע-כפול.`, false, true));
    }
  }

  // 2. Mutual exclusions — ruleDef.conflictsWith names another rule that is also active.
  for (const record of activeRecords) {
    const def = ruleDefinitionsById.get(record.ruleId);
    const conflictsWith = Array.isArray(def?.conflictsWith) ? def.conflictsWith : [];
    for (const otherId of conflictsWith) {
      if (activeIds.has(otherId) && otherId !== record.ruleId) {
        conflicts.push(mkConflict('directContradiction', [record.ruleId, otherId], 'critical', `Rule "${record.ruleId}" ו-"${otherId}" מסומנים כ-conflictsWith זה-את-זה אך שניהם פעילים.`, false, true));
      }
    }
  }

  // 3+5. Required combinations / missing companion rules — `verifies`/`supplements`
  // targets of an active rule must themselves exist and be active.
  for (const record of activeRecords) {
    const def = ruleDefinitionsById.get(record.ruleId);
    const companions = [...(Array.isArray(def?.verifies) ? def.verifies : []), ...(Array.isArray(def?.supplements) ? def.supplements : [])];
    for (const companionId of companions) {
      if (!ruleDefinitionsById.has(companionId)) {
        warnings.push(mkWarning('noVerificationPath', 'warning', record.ruleId, `Rule "${record.ruleId}" מפנה ל-companion "${companionId}" שאינו קיים כלל ב-Rule Definitions.`, true, false));
      } else if (!activeIds.has(companionId)) {
        warnings.push(mkWarning('noVerificationPath', 'warning', record.ruleId, `Rule "${record.ruleId}" מפנה ל-companion "${companionId}" שאינו פעיל בסט-ההחלטות הנוכחי.`, true, false));
      }
    }
  }

  // 4. Invalid combinations — a 'conditional' rule whose activationCondition
  // effectively depends on another rule that ended up forbidden/unavailable
  // (heuristic: the condition names a ruleId that is forbidden/unavailable).
  const blockedIds = new Set(records.filter((r) => !r.excluded && (r.decision === 'forbidden' || r.decision === 'unavailable')).map((r) => r.ruleId));
  for (const record of records.filter((r) => r.decision === 'conditional')) {
    for (const condition of record.missingConditions) {
      if (blockedIds.has(condition)) {
        conflicts.push(mkConflict('applicabilityConflict', [record.ruleId, condition], 'error', `Rule "${record.ruleId}" ממתין ל-condition "${condition}" שהוא עצמו forbidden/unavailable — התנאי לעולם לא יתקיים.`, false, true));
      }
    }
  }

  // 6. Cross-domain contamination in the final set (defensive — should
  // already be impossible given per-rule domain/method checks, but verified
  // here at the set level too).
  // (No separate check needed beyond per-rule decisions, which already
  // exclude cross-domain rules to 'unavailable' — documented here for
  // Validator §16 traceability, not a redundant re-implementation.)

  const stopRequired = conflicts.some((c) => c.severity === 'critical' && !c.recoverable);

  return { conflicts, warnings, stopRequired };
}

// ---------------------------------------------------------------------------
// Execution Instructions (Component Contract §10)
// ---------------------------------------------------------------------------

function buildExecutionInstructions(records, readingPlan) {
  const selectedRuleIds = records.filter((r) => !r.excluded && (r.decision === 'required' || r.decision === 'allowed')).map((r) => r.ruleId);
  const conditionalRuleIds = records.filter((r) => !r.excluded && r.decision === 'conditional').map((r) => r.ruleId);
  const advisorOnlyRuleIds = records.filter((r) => !r.excluded && r.decision === 'advisorOnly').map((r) => r.ruleId);
  const skippedRuleIds = records.filter((r) => r.excluded).map((r) => r.ruleId).filter(Boolean);
  const unavailableRuleIds = records.filter((r) => !r.excluded && r.decision === 'unavailable').map((r) => r.ruleId);

  const requiredInputs = [...new Set(records.flatMap((r) => r.requiredInputs || []))];
  const missingInputs = [...new Set(records.flatMap((r) => r.missingInputs || []))];

  const evidenceRequirements = records
    .filter((r) => !r.excluded && (r.decision === 'required' || r.decision === 'allowed'))
    .map((r) => ({ ruleId: r.ruleId, sourceEvidence: r.sourceEvidence }));

  return {
    selectedRuleIds,
    conditionalRuleIds,
    advisorOnlyRuleIds,
    skippedRuleIds,
    unavailableRuleIds,
    executionOrder: readingPlan.executionOrder.slice(),
    executionGroups: {
      primaryDecision: records.filter((r) => !r.excluded && r.decision === 'required').map((r) => r.ruleId),
      verification: records.filter((r) => !r.excluded && r.decision === 'allowed' && readingPlan.verificationCategories.includes(r.ruleCategory)).map((r) => r.ruleId),
      supporting: records.filter((r) => !r.excluded && r.decision === 'allowed' && !readingPlan.verificationCategories.includes(r.ruleCategory)).map((r) => r.ruleId),
      advisorOnly: advisorOnlyRuleIds,
    },
    requiredInputs,
    missingInputs,
    stopConditions: [],
    evidenceRequirements,
  };
}

// ---------------------------------------------------------------------------
// decisionSummary — deterministic, template-based, run-level summary.
// Never chain-of-thought, never AI, never PII, never client narrative.
// ---------------------------------------------------------------------------

function buildDecisionSummary({ records, conflicts, warnings }) {
  const counts = { required: 0, allowed: 0, conditional: 0, advisorOnly: 0, forbidden: 0, unavailable: 0, excluded: 0 };
  for (const r of records) {
    if (r.excluded) { counts.excluded += 1; continue; }
    if (counts[r.decision] !== undefined) counts[r.decision] += 1;
  }
  const parts = [`${counts.required} required, ${counts.allowed} allowed, ${counts.conditional} conditional, ${counts.advisorOnly} advisorOnly, ${counts.forbidden} forbidden, ${counts.unavailable} unavailable`];
  if (counts.excluded > 0) parts.push(`${counts.excluded} rules excluded (invalid Rule Definition)`);
  if (conflicts.length > 0) parts.push(`${conflicts.length} conflicts detected`);
  if (warnings.length > 0) parts.push(`${warnings.length} warnings raised`);
  return parts.join('; ') + '.';
}

// ---------------------------------------------------------------------------
// Engine entry point
// ---------------------------------------------------------------------------

/**
 * @param {object} input - see rule-decision-validators.js::validateRuleDecisionInput
 * @returns {object} Rule Decision Engine Output, or a Stop Result ({ stopped: true, ... })
 */
export function runRuleDecisionEngine(input) {
  const {
    readingDomain, method, topicId, questionType, primaryIntent, readingPlan,
    ruleDefinitions, availableInputs, metActivationConditions, sourceEvidencePointers,
  } = input || {};

  // §3: if readingPlan itself is a Stop Result, Rule Decision Engine does
  // not run at all — it forwards the stop, never trying to decide on a plan
  // that was never built.
  if (readingPlan?.stopped) {
    return {
      stopped: true, stopComponent: 'ruleDecisionEngine',
      stopReason: 'readingPlan.stopped is true — upstream Reading Planner did not produce a full plan.',
      recoverable: true, missingInputs: [], conflictingRuleIds: [],
      clarificationQuestion: null, needsOrenDecision: true,
    };
  }

  const defs = Array.isArray(ruleDefinitions) ? ruleDefinitions : [];
  const ruleDefinitionsById = new Map(defs.filter((d) => d && typeof d.ruleId === 'string').map((d) => [d.ruleId, d]));

  const ctx = {
    readingDomain, method, topicId: topicId ?? null, questionType, primaryIntent, readingPlan,
    availableInputs: Array.isArray(availableInputs) ? availableInputs : [],
    metActivationConditions: Array.isArray(metActivationConditions) ? metActivationConditions : [],
  };

  // §3: no Rule Definitions at all, but the plan expects a primary decision -> stop.
  if (defs.length === 0 && readingPlan.primaryDecisionCategories.length > 0) {
    return {
      stopped: true, stopComponent: 'ruleDecisionEngine',
      stopReason: 'No Rule Definitions were provided, but Reading Plan requires primaryDecisionCategories.',
      recoverable: true, missingInputs: [], conflictingRuleIds: [],
      clarificationQuestion: null, needsOrenDecision: true,
    };
  }

  const records = defs.map((def) => decideRule(def, ctx));
  const allWarnings = records.flatMap((r) => r._warnings || []);

  const setValidation = validateRuleSet(records, ruleDefinitionsById);
  const allConflicts = setValidation.conflicts;
  const allWarnings2 = [...allWarnings, ...setValidation.warnings];

  // Attach cross-rule conflicts (from Rule Set Validation) back onto the
  // relevant per-rule records' `conflicts` field, without changing `decision`.
  const conflictsByRuleId = new Map();
  for (const c of allConflicts) {
    for (const rid of c.ruleIds) {
      if (!conflictsByRuleId.has(rid)) conflictsByRuleId.set(rid, []);
      conflictsByRuleId.get(rid).push(c.conflictType);
    }
  }
  for (const r of records) {
    if (conflictsByRuleId.has(r.ruleId)) {
      r.conflicts = conflictsByRuleId.get(r.ruleId);
      if (allConflicts.find((c) => c.ruleIds.includes(r.ruleId) && c.needsOrenDecision)) r.needsOrenDecision = true;
    }
  }

  const noPrimaryDecisionPath = readingPlan.primaryDecisionCategories.length > 0
    && !records.some((r) => !r.excluded && r.decision === 'required');
  if (noPrimaryDecisionPath) {
    allWarnings2.push(mkWarning('noPrimaryDecisionPath', 'critical', null, 'Reading Plan דורש primaryDecisionCategories אך אף Rule לא הוכרע כ-required.', true, true));
  }

  // Unresolved-critical-conflict stop (Component Contract §11)
  if (setValidation.stopRequired || noPrimaryDecisionPath) {
    return {
      stopped: true, stopComponent: 'ruleDecisionEngine',
      stopReason: setValidation.stopRequired ? 'Unresolved critical conflict in the final rule set.' : 'No primary decision path available.',
      recoverable: true,
      missingInputs: [...new Set(records.flatMap((r) => r.missingInputs || []))],
      conflictingRuleIds: [...new Set(allConflicts.flatMap((c) => c.ruleIds))],
      clarificationQuestion: null,
      needsOrenDecision: true,
    };
  }

  const executionInstructions = buildExecutionInstructions(records, readingPlan);
  const decisionSummary = buildDecisionSummary({ records, conflicts: allConflicts, warnings: allWarnings2 });

  // ruleDecisionRecords only contains rules that received a real Decision
  // (the Rule Decision Contract's `decision` field is always one of the 6
  // official values, never null) — structurally-excluded Rule Definitions
  // (Decision Order step 1 failure) are represented only via `rejectedRuleIds`
  // (a bare ID list), not a full record. `ruleCategory`/`excluded`/`_warnings`
  // were internal-only helper fields, stripped here before output.
  const cleanRecords = records
    .filter((r) => !r.excluded)
    .map(({ _warnings, ruleCategory, excluded, ...rest }) => rest);

  const needsOrenDecision = cleanRecords.some((r) => r.needsOrenDecision) || allConflicts.some((c) => c.needsOrenDecision);
  const confidenceValues = cleanRecords.map((r) => r.confidence);
  const confidence = confidenceValues.length > 0 ? Math.min(...confidenceValues) : 0;

  return {
    engineVersion: ENGINE_VERSION,
    readingDomain, method, topicId: topicId ?? null, questionType, primaryIntent,

    ruleDecisionRecords: cleanRecords,

    selectedRuleIds: executionInstructions.selectedRuleIds,
    rejectedRuleIds: records.filter((r) => r.excluded).map((r) => r.ruleId).filter(Boolean),
    conditionalRuleIds: executionInstructions.conditionalRuleIds,
    advisorOnlyRuleIds: executionInstructions.advisorOnlyRuleIds,
    forbiddenRuleIds: cleanRecords.filter((r) => r.decision === 'forbidden').map((r) => r.ruleId),
    unavailableRuleIds: executionInstructions.unavailableRuleIds,

    executionInstructions,
    conflicts: allConflicts,
    warnings: allWarnings2,
    errors: [],

    sourceEvidencePointers: Array.isArray(sourceEvidencePointers) ? sourceEvidencePointers.slice() : [],
    decisionSummary,
    confidence,
    stopped: false,
    stopReason: null,
    needsOrenDecision,
  };
}

export { decideRule };

export default { runRuleDecisionEngine, validateRuleSet, decideRule, ENGINE_VERSION };
