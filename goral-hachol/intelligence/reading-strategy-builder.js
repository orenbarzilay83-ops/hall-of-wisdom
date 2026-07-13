/**
 * reading-strategy-builder.js
 *
 * Hall of Wisdom Core — Reading Strategy Builder (second implemented
 * component, per HALL_WISDOM_READING_STRATEGY_BUILDER_COMPONENT_CONTRACT.md).
 * Deterministic layer that translates an already-computed Intent Result +
 * Question Type + Method into a ReadingStrategy — BEFORE the Reading Planner
 * builds a ReadingPlan or any engine runs.
 *
 * Foundation phase, per explicit instruction:
 *  - NOT connected to goral-hachol/engine/* (no Kashf/Hawi engine calls)
 *  - NOT connected to the live goral-rule-applicability-matrix.js /
 *    goral-knowledge-registry.js (strategyConstraints categories are a v1
 *    foundation vocabulary — see reading-strategy-types.js header)
 *  - no AI, no network, no UI, no QA, no Supabase
 *
 * Internal structure (matches the four logical sub-responsibilities named in
 * the implementation request):
 *  1. buildReadingStrategy()      — the engine entry point
 *  2. resolveStrategyValues()     — Strategy Resolver (policy fields)
 *  3. resolveConstraints()        — Constraints Resolver (strategyConstraints)
 *  4. buildStrategyReason()       — Strategy Reason Builder (strategyReason)
 *  5. validateStrategyInput/Result() — Validators
 */

import { getIntentDefinition, isPrimaryIntentValue, UNKNOWN_INTENT_ID } from './intent-types.js';
import { validateIntentResult } from './intent-analyzer.js';
import {
  isNonEmptyString, isStringArray, isContradictionPolicy,
} from './reading-intelligence-types.js';
import {
  STRATEGY_VERSION, CONSTRAINT_FIELD_NAMES, CATEGORY_HEBREW_LABELS, ENGLISH_INTENT_LABELS,
  HINT_TO_MAY_INCLUDE_CATEGORY, PRIMARY_EVIDENCE_CATEGORIES_BY_INTENT, PRIMARY_EVIDENCE_CATEGORIES_BY_INTENT_CARDS,
  spiritualCategoryForDomain, isReadingDomain, isMethodForDomain, isKnownConstraintCategoryForDomain,
  isVerificationPolicy, isClientDepth, isAdvisorDepth, isHiddenSectionsPolicy,
  isTimingPolicy, isSpiritualPolicy, isConfidencePolicy,
} from './reading-strategy-types.js';

// readingDomain defaults to 'goralHachol' wherever omitted, both here and in
// the validators below — preserves 100% backward compatibility for every
// existing kashf/hawi call site (Intent Analyzer, Reading Planner, and all
// pre-existing tests never pass readingDomain and must keep working
// unchanged) while adding explicit 'cards' support for new callers.
const DEFAULT_READING_DOMAIN = 'goralHachol';

export { STRATEGY_VERSION };

// Same discipline already applied to Intent Analyzer's decisionReason:
// strategyReason is a deterministic template, never a model call — these
// markers must never appear in it.
const CHAIN_OF_THOUGHT_MARKERS = ['אני חושב', 'לדעתי', 'בואו נבדוק', 'step by step', 'let me', 'I think', 'reasoning:', 'thought:'];

function categoryLabel(category) {
  return CATEGORY_HEBREW_LABELS[category] || category;
}

function containsChainOfThought(text) {
  const lower = String(text || '').toLowerCase();
  return CHAIN_OF_THOUGHT_MARKERS.some((marker) => lower.includes(marker.toLowerCase()));
}

function containsLikelyPII(text) {
  return /\d{7,}/.test(String(text || ''));
}

function joinHebrewExclusionClause(labels) {
  if (labels.length === 0) return '';
  if (labels.length === 1) return `, ללא ${labels[0]}`;
  const last = labels[labels.length - 1];
  const rest = labels.slice(0, -1).map((label) => `ללא ${label}`).join(', ');
  return `, ${rest} וללא ${last}`;
}

// ---------------------------------------------------------------------------
// 2. Strategy Resolver
// ---------------------------------------------------------------------------

function resolveStrategyValues(intentDef, questionType) {
  const hints = intentDef.defaultStrategyHints;
  const has = (hint) => hints.includes(hint);

  const verificationPolicy = has('requireVerificationRules')
    ? 'always'
    : (has('allowVerification') ? 'onlyOnContradiction' : 'none');

  // Contradictions are always surfaced to the client, for every intent —
  // Core Constitution §4 (Explainability): the system never hides a known
  // contradiction from the person it concerns.
  const contradictionPolicy = 'mustSurfaceToClient';

  const clientDepth = (has('compareRisksAndSupports') || has('compareOptionsSideBySide') || has('compareTwoParties'))
    ? 'extended'
    : (has('focusOnIdentificationOrLocation') ? 'short' : 'standard');

  const advisorDepth = has('advisorDepthHigh') ? 'full-reasoning' : 'standard';

  const hiddenSectionsPolicy = has('allowHiddenThoughtRules') ? 'includeHiddenThoughtOnly' : 'excludeAll';

  const timingPolicy = has('requireTimingRules') ? 'includeAsPrimary' : 'excludeUnlessAsked';

  const spiritualPolicy = intentDef.forbiddenDefaultRuleCategories.includes('spiritual')
    ? (questionType === 'spiritual' ? 'includeIfRelevant' : 'excludeUnlessAsked')
    : 'excludeUnlessAsked';

  const confidencePolicy = 'flagIfBelowThreshold';

  return {
    goal: intentDef.description,
    verificationPolicy, contradictionPolicy, clientDepth, advisorDepth,
    hiddenSectionsPolicy, timingPolicy, spiritualPolicy, confidencePolicy,
  };
}

// Used only when primaryIntent === UNKNOWN_INTENT_ID — mirrors the same
// "never guess a policy from an uncertain Intent" principle already applied
// to Intent Analyzer's own unknown fallback (CLEAR_WIN_MARGIN / requiresClarification).
function conservativeStrategyValues() {
  return {
    goal: 'לא ניתן לקבוע מטרה חד-משמעית — נדרשת הבהרה לפני בניית אסטרטגיה.',
    verificationPolicy: 'always',
    contradictionPolicy: 'mustSurfaceToClient',
    clientDepth: 'short',
    advisorDepth: 'standard',
    hiddenSectionsPolicy: 'excludeAll',
    timingPolicy: 'excludeUnlessAsked',
    spiritualPolicy: 'excludeUnlessAsked',
    confidencePolicy: 'strict',
  };
}

// ---------------------------------------------------------------------------
// 3. Constraints Resolver
// ---------------------------------------------------------------------------

function resolveConstraints({ primaryIntentId, intentDef, secondaryIntentIds, questionType, isUnknown, readingDomain }) {
  // The domain-appropriate spelling of the spiritual-gating category —
  // goralHachol keeps 'spiritual' (unchanged, since intent-types.js already
  // emits it and Intent Analyzer is not touched here); cards uses its own
  // domain-exclusive 'spiritualDiagnostics' name (see CATEGORY_DOMAINS).
  const spiritualCategory = spiritualCategoryForDomain(readingDomain);
  const advisorOnlyTechnicalCategory = readingDomain === 'cards' ? 'technicalSpreadDetails' : 'technicalFormulaDetails';

  if (isUnknown) {
    // Conservative-by-default: forbid everything sensitive, require nothing
    // automatically, include nothing automatically — until a real Intent (or
    // Oren) resolves the ambiguity. Mirrors UNKNOWN_FORBIDDEN_RULE_CATEGORIES
    // in intent-types.js (the conservative union approach).
    return {
      mustInclude: [],
      mayInclude: [],
      mustExclude: ['hiddenThought', 'characterNature', 'timing', spiritualCategory, 'absoluteOutcomeClaims'],
      advisorOnly: [advisorOnlyTechnicalCategory],
      requiresEvidence: [],
      forbiddenWithoutQuestion: ['timing', spiritualCategory],
    };
  }

  const evidenceMap = readingDomain === 'cards' ? PRIMARY_EVIDENCE_CATEGORIES_BY_INTENT_CARDS : PRIMARY_EVIDENCE_CATEGORIES_BY_INTENT;
  const mustInclude = [...(evidenceMap[primaryIntentId] || [])];

  // mayInclude candidates are derived from domain-agnostic Intent hints, so
  // they are filtered down to categories actually legal for this domain
  // (e.g. 'supportingRules' is goralHachol-exclusive and must not leak into
  // a cards strategy even if the hint that would normally produce it fires).
  const mayInclude = [...new Set(
    intentDef.defaultStrategyHints
      .map((hint) => HINT_TO_MAY_INCLUDE_CATEGORY[hint])
      .filter(Boolean)
  )].filter((cat) => isKnownConstraintCategoryForDomain(cat, readingDomain));

  // forbiddenDefaultRuleCategories (from intent-types.js, domain-agnostic)
  // only ever contains shared cross-cutting categories plus the literal
  // string 'spiritual' — translated here to the domain-appropriate spelling.
  const mustExclude = intentDef.forbiddenDefaultRuleCategories.map((cat) => (cat === 'spiritual' ? spiritualCategory : cat));

  const advisorOnly = [advisorOnlyTechnicalCategory];
  // 'dhamir' is a goralHachol-exclusive concept (RAML hidden/shadow house) —
  // it has no cards equivalent and is never added for readingDomain:'cards'.
  if (readingDomain === 'goralHachol' && primaryIntentId === 'hiddenThoughtIntent') advisorOnly.push('dhamir');

  const requiresEvidence = ['contradictionResolution'];

  // timing/spiritual are gated on "did the querent actually ask" — inferred
  // only from already-computed Intent signals (primary/secondary intent,
  // questionType), never by re-parsing raw question text (Reading Strategy
  // Builder accepts no raw question text as input at all — see contract §3).
  const forbiddenWithoutQuestion = [];
  const timingWasAsked = primaryIntentId === 'timingRequest' || secondaryIntentIds.includes('timingRequest');
  if (!timingWasAsked) forbiddenWithoutQuestion.push('timing');
  const spiritualWasAsked = questionType === 'spiritual';
  if (!spiritualWasAsked) forbiddenWithoutQuestion.push(spiritualCategory);

  return { mustInclude, mayInclude, mustExclude, advisorOnly, requiresEvidence, forbiddenWithoutQuestion };
}

// ---------------------------------------------------------------------------
// 4. Strategy Reason Builder
// ---------------------------------------------------------------------------

function buildStrategyReason({ isUnknown, intentDef, primaryIntentId, constraints, intentResult }) {
  if (isUnknown) {
    const candidateTitles = (intentResult.secondaryIntents || [])
      .map((id) => getIntentDefinition(id))
      .filter(Boolean)
      .slice(0, 3)
      .map((def) => def.titleHebrew);

    if (candidateTitles.length === 0) {
      return 'לא ניתן לבנות אסטרטגיה חד-משמעית משום שלא זוהתה כוונה מוכרת בשאלה, ולכן נדרשת הבהרה.';
    }
    const last = candidateTitles[candidateTitles.length - 1];
    const rest = candidateTitles.slice(0, -1);
    const list = rest.length === 0 ? last : `${rest.join(', ')} או ${last}`;
    return `לא ניתן לבנות אסטרטגיה חד-משמעית משום שלא ברור אם המשתמש מבקש ${list}.`;
  }

  const excludedCategories = [...new Set([...constraints.mustExclude, ...constraints.forbiddenWithoutQuestion])].slice(0, 3);
  const exclusionClause = joinHebrewExclusionClause(excludedCategories.map(categoryLabel));
  const descriptionClause = intentDef.description.replace(/\.$/, '');
  const label = ENGLISH_INTENT_LABELS[primaryIntentId] || primaryIntentId;

  return `נבחרה אסטרטגיית ${label} משום ש${descriptionClause}${exclusionClause}.`;
}

// ---------------------------------------------------------------------------
// 1. Engine entry point
// ---------------------------------------------------------------------------

/**
 * @param {object} input
 * @param {object} input.intentResult - full output of intent-analyzer.js::analyzeIntent()
 * @param {'goralHachol'|'cards'} [input.readingDomain] - defaults to 'goralHachol' if omitted
 * @param {'kashf'|'hawi'|'cartomancy'} input.method
 * @param {string} [input.spreadId] - cards spread context; Strategy Builder never chooses one
 * @param {string} [input.questionType] - overrides intentResult.questionType if provided
 * @param {string} [input.topicId]
 * @returns {object} ReadingStrategy
 */
export function buildReadingStrategy(input) {
  const { intentResult, method, questionType: questionTypeOverride, readingDomain: readingDomainInput, spreadId } = input || {};
  const readingDomain = readingDomainInput || DEFAULT_READING_DOMAIN;

  const questionType = questionTypeOverride || intentResult?.questionType || null;
  const primaryIntentId = intentResult?.primaryIntent;
  const isUnknown = primaryIntentId === UNKNOWN_INTENT_ID;
  const intentDef = isUnknown ? null : getIntentDefinition(primaryIntentId);
  const secondaryIntentIds = Array.isArray(intentResult?.secondaryIntents) ? intentResult.secondaryIntents.slice() : [];

  const strategyValues = isUnknown ? conservativeStrategyValues() : resolveStrategyValues(intentDef, questionType);
  const constraints = resolveConstraints({ primaryIntentId, intentDef, secondaryIntentIds, questionType, isUnknown, readingDomain });
  const strategyReason = buildStrategyReason({ isUnknown, intentDef, primaryIntentId, constraints, intentResult });

  const evidenceMap = readingDomain === 'cards' ? PRIMARY_EVIDENCE_CATEGORIES_BY_INTENT_CARDS : PRIMARY_EVIDENCE_CATEGORIES_BY_INTENT;
  const secondaryEvidence = isUnknown ? [] : [...new Set([
    ...constraints.mayInclude,
    ...secondaryIntentIds.flatMap((id) => evidenceMap[id] || []),
  ])];

  const strategyId = `strat-${primaryIntentId}-${questionType || 'unknownQuestionType'}${readingDomain === 'cards' ? '-cards' : ''}`;

  return {
    strategyId,
    strategyVersion: STRATEGY_VERSION,
    readingDomain,
    method,
    spreadId: spreadId ?? null,
    questionType,
    primaryIntent: primaryIntentId,
    secondaryIntents: secondaryIntentIds,
    goal: strategyValues.goal,
    primaryEvidence: constraints.mustInclude.slice(),
    secondaryEvidence,
    verificationPolicy: strategyValues.verificationPolicy,
    contradictionPolicy: strategyValues.contradictionPolicy,
    clientDepth: strategyValues.clientDepth,
    advisorDepth: strategyValues.advisorDepth,
    hiddenSectionsPolicy: strategyValues.hiddenSectionsPolicy,
    timingPolicy: strategyValues.timingPolicy,
    spiritualPolicy: strategyValues.spiritualPolicy,
    confidencePolicy: strategyValues.confidencePolicy,
    strategyConstraints: constraints,
    strategyReason,
    confidence: typeof intentResult?.confidence === 'number' ? intentResult.confidence : 0,
    requiresClarification: !!intentResult?.requiresClarification,
    clarificationQuestion: intentResult?.clarificationQuestion ?? null,
    needsOrenDecision: !!intentResult?.requiresClarification,
  };
}

// ---------------------------------------------------------------------------
// 5. Validators
// ---------------------------------------------------------------------------

/**
 * @param {object} input
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateStrategyInput(input) {
  const errors = [];
  if (!input || typeof input !== 'object') return { valid: false, errors: ['strategy input must be an object'] };

  const intentValidation = validateIntentResult(input.intentResult);
  if (!intentValidation.valid) {
    errors.push(...intentValidation.errors.map((e) => `intentResult: ${e}`));
  }

  // readingDomain defaults to 'goralHachol' when omitted (backward
  // compatibility, see DEFAULT_READING_DOMAIN) — only validated for
  // correctness when it IS provided and non-default.
  if (input.readingDomain !== undefined && !isReadingDomain(input.readingDomain)) {
    errors.push(`readingDomain must be 'goralHachol' or 'cards' if provided (got ${JSON.stringify(input.readingDomain)})`);
  } else {
    const readingDomain = input.readingDomain || DEFAULT_READING_DOMAIN;
    if (!isMethodForDomain(input.method, readingDomain)) {
      errors.push(`method "${input.method}" is not valid for readingDomain "${readingDomain}"`);
    }
  }

  if (input.questionType !== undefined && !isNonEmptyString(input.questionType)) {
    errors.push('questionType must be a non-empty string if provided');
  }

  if (input.topicId !== undefined && typeof input.topicId !== 'string') {
    errors.push('topicId must be a string if provided');
  }

  if (input.spreadId !== undefined && input.spreadId !== null && typeof input.spreadId !== 'string') {
    errors.push('spreadId must be a string if provided');
  }

  // Domain separation: a Domain's Knowledge Context must never be handed to
  // another Domain. knowledgeContext is not yet deeply consumed (no live
  // Knowledge Decision Pipeline exists), but this cross-check is enforced
  // now so future wiring cannot silently mix Domains.
  if (input.knowledgeContext !== undefined) {
    if (typeof input.knowledgeContext !== 'object' || input.knowledgeContext === null) {
      errors.push('knowledgeContext must be an object if provided');
    } else {
      const readingDomain = input.readingDomain || DEFAULT_READING_DOMAIN;
      if (input.knowledgeContext.readingDomain !== undefined && input.knowledgeContext.readingDomain !== readingDomain) {
        errors.push(`knowledgeContext.readingDomain ("${input.knowledgeContext.readingDomain}") does not match input.readingDomain ("${readingDomain}") — a Domain's Knowledge Context must not be passed to another Domain`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * @param {object} strategy - output of buildReadingStrategy()
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateStrategyResult(strategy) {
  const errors = [];
  if (!strategy || typeof strategy !== 'object') return { valid: false, errors: ['strategy result must be an object'] };

  const requiredFields = [
    'strategyId', 'strategyVersion', 'readingDomain', 'method', 'spreadId', 'questionType', 'primaryIntent', 'secondaryIntents',
    'goal', 'primaryEvidence', 'secondaryEvidence', 'verificationPolicy', 'contradictionPolicy',
    'clientDepth', 'advisorDepth', 'hiddenSectionsPolicy', 'timingPolicy', 'spiritualPolicy',
    'confidencePolicy', 'strategyConstraints', 'strategyReason', 'confidence', 'requiresClarification',
    'clarificationQuestion', 'needsOrenDecision',
  ];
  for (const field of requiredFields) {
    if (!(field in strategy)) errors.push(`${field} is required`);
  }

  if (!isNonEmptyString(strategy.strategyVersion)) errors.push('strategyVersion is required and must be a non-empty string');

  if (!isReadingDomain(strategy.readingDomain)) {
    errors.push(`readingDomain must be 'goralHachol' or 'cards' (got ${JSON.stringify(strategy.readingDomain)})`);
  } else if (!isMethodForDomain(strategy.method, strategy.readingDomain)) {
    errors.push(`method "${strategy.method}" is not valid for readingDomain "${strategy.readingDomain}"`);
  }

  if (strategy.spreadId !== undefined && strategy.spreadId !== null && typeof strategy.spreadId !== 'string') {
    errors.push('spreadId must be a string or null');
  }

  if (!isPrimaryIntentValue(strategy.primaryIntent)) errors.push(`primaryIntent must be a known intent or '${UNKNOWN_INTENT_ID}' (got ${JSON.stringify(strategy.primaryIntent)})`);
  if (!Array.isArray(strategy.secondaryIntents)) errors.push('secondaryIntents must be an array');
  if (!isNonEmptyString(strategy.goal)) errors.push('goal is required and must be a non-empty string');
  if (!isStringArray(strategy.primaryEvidence)) errors.push('primaryEvidence must be an array of strings');
  if (!isStringArray(strategy.secondaryEvidence)) errors.push('secondaryEvidence must be an array of strings');

  if (!isVerificationPolicy(strategy.verificationPolicy)) errors.push(`verificationPolicy invalid (got ${JSON.stringify(strategy.verificationPolicy)})`);
  if (!isContradictionPolicy(strategy.contradictionPolicy)) errors.push(`contradictionPolicy invalid (got ${JSON.stringify(strategy.contradictionPolicy)})`);
  if (!isClientDepth(strategy.clientDepth)) errors.push(`clientDepth invalid (got ${JSON.stringify(strategy.clientDepth)})`);
  if (!isAdvisorDepth(strategy.advisorDepth)) errors.push(`advisorDepth invalid (got ${JSON.stringify(strategy.advisorDepth)})`);
  if (!isHiddenSectionsPolicy(strategy.hiddenSectionsPolicy)) errors.push(`hiddenSectionsPolicy invalid (got ${JSON.stringify(strategy.hiddenSectionsPolicy)})`);
  if (!isTimingPolicy(strategy.timingPolicy)) errors.push(`timingPolicy invalid (got ${JSON.stringify(strategy.timingPolicy)})`);
  if (!isSpiritualPolicy(strategy.spiritualPolicy)) errors.push(`spiritualPolicy invalid (got ${JSON.stringify(strategy.spiritualPolicy)})`);
  if (!isConfidencePolicy(strategy.confidencePolicy)) errors.push(`confidencePolicy invalid (got ${JSON.stringify(strategy.confidencePolicy)})`);

  if (typeof strategy.confidence !== 'number' || strategy.confidence < 0 || strategy.confidence > 1) {
    errors.push('confidence must be a number between 0 and 1');
  }

  if (typeof strategy.requiresClarification !== 'boolean') {
    errors.push('requiresClarification must be a boolean');
  } else if (strategy.requiresClarification && !isNonEmptyString(strategy.clarificationQuestion)) {
    errors.push('clarificationQuestion is required and must be non-empty when requiresClarification is true');
  }

  if (typeof strategy.needsOrenDecision !== 'boolean') {
    errors.push('needsOrenDecision must be a boolean');
  } else if (strategy.needsOrenDecision !== strategy.requiresClarification) {
    errors.push('needsOrenDecision must equal requiresClarification');
  }

  const sc = strategy.strategyConstraints;
  if (!sc || typeof sc !== 'object' || Array.isArray(sc)) {
    errors.push('strategyConstraints must be an object');
  } else {
    for (const field of CONSTRAINT_FIELD_NAMES) {
      if (!isStringArray(sc[field])) errors.push(`strategyConstraints.${field} must be an array of strings`);
    }
    const allValues = CONSTRAINT_FIELD_NAMES.flatMap((field) => (Array.isArray(sc[field]) ? sc[field] : []));
    for (const value of allValues) {
      if (!isKnownConstraintCategoryForDomain(value, strategy.readingDomain)) {
        errors.push(`strategyConstraints contains category "${value}" not valid for readingDomain "${strategy.readingDomain}" (unknown, or exclusive to another Domain)`);
      }
    }

    const mustInclude = sc.mustInclude || [];
    const mayInclude = sc.mayInclude || [];
    const mustExclude = sc.mustExclude || [];
    const advisorOnly = sc.advisorOnly || [];
    const requiresEvidence = sc.requiresEvidence || [];
    const forbiddenWithoutQuestion = sc.forbiddenWithoutQuestion || [];

    // Validator rule 3
    for (const value of mustInclude) {
      if (mustExclude.includes(value)) errors.push(`strategyConstraints: "${value}" cannot be in both mustInclude and mustExclude`);
    }
    // Validator rule 4
    for (const value of mayInclude) {
      if (mustExclude.includes(value)) errors.push(`strategyConstraints: "${value}" cannot be in both mayInclude and mustExclude`);
    }
    // Validator rule 5
    for (const value of advisorOnly) {
      if (mustInclude.includes(value) || mayInclude.includes(value)) {
        errors.push(`strategyConstraints: "${value}" is in advisorOnly and cannot also be client-visible via mustInclude/mayInclude`);
      }
    }
    // Validator rule 6
    for (const value of forbiddenWithoutQuestion) {
      if (mustInclude.includes(value) && !requiresEvidence.includes(value)) {
        errors.push(`strategyConstraints: "${value}" is in forbiddenWithoutQuestion and mustInclude without a matching requiresEvidence entry`);
      }
    }
  }

  // Validator rules 7-10
  if (!isNonEmptyString(strategy.strategyReason)) {
    errors.push('strategyReason is required and must be a non-empty string');
  } else {
    if (containsLikelyPII(strategy.strategyReason)) errors.push('strategyReason must not contain personal data (digit sequences of length >= 7)');
    if (containsChainOfThought(strategy.strategyReason)) errors.push('strategyReason must not contain chain-of-thought markers');
    if (strategy.requiresClarification && strategy.strategyReason.startsWith('נבחרה אסטרטגיית')) {
      errors.push('strategyReason must explain the ambiguity when requiresClarification is true, not read like a confident pick');
    }
  }

  return { valid: errors.length === 0, errors };
}

export default { buildReadingStrategy, validateStrategyInput, validateStrategyResult, STRATEGY_VERSION };
