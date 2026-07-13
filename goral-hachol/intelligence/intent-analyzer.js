/**
 * intent-analyzer.js
 *
 * Hall of Wisdom Core — Intent Analyzer (first implemented component).
 * Deterministic layer that classifies what a question's underlying intent
 * is (Prediction, Decision Support, Hidden Thought, Timing, ...) BEFORE any
 * Reading Strategy, Planner, or engine execution.
 *
 * Explicitly out of scope here (per HALL_WISDOM_CORE_ARCHITECTURE.md):
 *  - no engine calls, no engine imports
 *  - no Reading Strategy construction (only strategyHints are returned)
 *  - no rule selection (only forbiddenDefaultRuleCategories hints)
 *  - no client-facing output of any kind
 *  - no AI, no network
 */

import {
  getAllIntentIds,
  getIntentDefinition,
  isPrimaryIntentValue,
  UNKNOWN_INTENT_ID,
  EXCLUSION_REASON_BY_INTENT,
  UNKNOWN_FORBIDDEN_RULE_CATEGORIES,
} from './intent-types.js';
import { INTENT_PATTERNS } from './intent-analyzer-hebrew-rules.js';
import { isMethod, isNonEmptyString } from './reading-intelligence-types.js';
import { classifyQuestionType, getAllQuestionTypeIds } from '../brain/goral-question-taxonomy.js';

// A match driven only by weak (weight-1) patterns can never produce high
// confidence on its own — this is what keeps genuinely ambiguous phrasing
// like "מה יהיה איתו?" from being confidently (and wrongly) resolved.
const MAX_CONFIDENCE_FOR_WEAK_ONLY_MATCH = 0.4;

// Small nudge applied when questionTypeHint is compatible with a candidate
// intent — used only to break near-ties between multiple text-matched
// candidates, never large enough to manufacture a match out of nothing or
// to override a clearly stronger text signal.
const QUESTION_TYPE_HINT_BONUS = 0.5;

// The analyzer is deliberately conservative: a leading score must beat the
// runner-up by at least this margin to be accepted as a real primaryIntent.
// A smaller gap (including an exact tie) is never arbitrarily resolved —
// it always falls through to UNKNOWN_INTENT_ID + requiresClarification.
const CLEAR_WIN_MARGIN = 2;

const SECONDARY_INTENT_MIN_SCORE = 1;
const MAX_SECONDARY_INTENTS = 3;

// Single place where the analyzer's version identifier is defined. Every
// analyzeIntent() output carries this exact value, so future algorithm
// changes can be told apart in regression/QA/archive/Knowledge Graph data.
export const ANALYSIS_VERSION = 'intent-analyzer-v1';

function normalizeQuestion(question) {
  return String(question || '').trim().replace(/\s+/g, ' ');
}

function scoreIntents(normalizedQuestion, questionTypeHint) {
  const scores = {};
  const signalsByIntent = {};
  const maxWeightByIntent = {};

  for (const intentId of getAllIntentIds()) {
    let score = 0;
    let maxWeight = 0;
    const signals = [];
    for (const rule of INTENT_PATTERNS[intentId] || []) {
      if (rule.pattern.test(normalizedQuestion)) {
        score += rule.weight;
        maxWeight = Math.max(maxWeight, rule.weight);
        signals.push({ intentId, label: rule.label, weight: rule.weight });
      }
    }
    if (questionTypeHint && getIntentDefinition(intentId).compatibleQuestionTypes.includes(questionTypeHint)) {
      score += QUESTION_TYPE_HINT_BONUS;
    }
    scores[intentId] = score;
    signalsByIntent[intentId] = signals;
    maxWeightByIntent[intentId] = maxWeight;
  }

  return { scores, signalsByIntent, maxWeightByIntent };
}

function computeConfidence(primaryScore, secondScore, maxPatternWeight) {
  if (primaryScore <= 0) return 0;
  let base;
  if (secondScore <= 0) {
    base = Math.min(1, 0.5 + primaryScore * 0.1);
  } else {
    base = Math.min(1, primaryScore / (primaryScore + secondScore));
  }
  if (maxPatternWeight <= 1) {
    base = Math.min(base, MAX_CONFIDENCE_FOR_WEAK_ONLY_MATCH);
  }
  return Math.round(base * 100) / 100;
}

function buildClarificationQuestion(candidateIntentIds) {
  const ids = candidateIntentIds.length > 0 ? candidateIntentIds : ['stateAssessment', 'hiddenThoughtIntent', 'prediction'];
  const titles = ids.slice(0, 3).map((id) => getIntentDefinition(id).titleHebrew);
  if (titles.length === 1) return `האם אתה מבקש לדעת ${titles[0]}?`;
  const last = titles[titles.length - 1];
  const rest = titles.slice(0, -1).join(', ');
  return `האם אתה מבקש לדעת ${rest}, או ${last}?`;
}

// excludedIntents explains, for the chosen primaryIntent, which of the other
// CENTRAL/commonly-confused intents were considered and ruled out, and why —
// not just "no signal found" but a concrete, human reason per excluded
// intent (EXCLUSION_REASON_BY_INTENT), so a Reading Strategy Builder (or a
// human debugging one) gets a full explanation, not just a bare list.
function buildExcludedIntents(primaryIntentId, scores) {
  const primaryDef = getIntentDefinition(primaryIntentId);
  if (!primaryDef) return []; // UNKNOWN_INTENT_ID has no "confused with" set — see analyzeIntent()
  const excluded = [];
  for (const candidateId of primaryDef.commonlyConfusedWith) {
    if (candidateId === primaryIntentId) continue;
    if ((scores[candidateId] || 0) <= 0) {
      excluded.push({ intentId: candidateId, reason: EXCLUSION_REASON_BY_INTENT[candidateId] });
    }
  }
  return excluded;
}

// decisionReason: a short, deterministic, rule-based sentence explaining why
// primaryIntent was (or was not) chosen. Built entirely from already-computed
// facts (scores, matched-pattern counts, exclusion list) — never an AI call,
// never a model's chain-of-thought, never anything beyond what the rest of
// the output already contains in structured form.
function buildDecisionReason({ isUnknown, zeroSignal, gapInsufficient, belowOwnThreshold, candidateId, secondCandidateId, confidence, matchedCount, excludedIntentIds, hasRealRunnerUp }) {
  if (isUnknown) {
    if (zeroSignal) {
      return 'לא ניתן לזהות Intent יחיד בביטחון מספק ולכן נדרשת הבהרה.';
    }
    if (gapInsufficient) {
      return `לא ניתן להכריע בין ${candidateId} ל-${secondCandidateId} (ניקוד קרוב מדי), ולכן נדרשת הבהרה.`;
    }
    // weak-only-pattern or below-own-threshold
    return `הביטחון בזיהוי ${candidateId} (${confidence}) נמוך מהסף הנדרש, ולכן לא ניתן לזהות Intent יחיד בביטחון מספק ונדרשת הבהרה.`;
  }

  const signalClause = matchedCount >= 2
    ? `נמצאו ${matchedCount} תבניות התואמות ל-${candidateId}`
    : `נמצאה תבנית מובהקת התואמת ל-${candidateId}`;
  let reason = `נבחר ${candidateId} משום ש${signalClause}`;
  if (excludedIntentIds.length > 0) {
    reason += `, לא נמצאו אותות של ${excludedIntentIds.slice(0, 2).join(' או ')}`;
  }
  if (hasRealRunnerUp) {
    reason += `, וקיבל עדיפות על ${secondCandidateId}`;
  }
  return reason + '.';
}

/**
 * @param {object} input
 * @param {string} input.question
 * @param {'kashf'|'hawi'} [input.method]
 * @param {string} [input.topicId]
 * @param {string} [input.questionTypeHint]
 * @param {string} [input.language]
 */
export function analyzeIntent(input) {
  const { question, method, topicId, questionTypeHint, language } = input || {};
  const normalizedQuestion = normalizeQuestion(question);

  const validHint = questionTypeHint && getAllQuestionTypeIds().includes(questionTypeHint) ? questionTypeHint : null;
  const { scores, signalsByIntent, maxWeightByIntent } = scoreIntents(normalizedQuestion, validHint);

  // Array.sort is stable, so intents that tie in score keep their
  // getAllIntentIds() declaration order in rankedIntents — but that order is
  // NEVER used to pick a winner among tied/near-tied scores (see
  // CLEAR_WIN_MARGIN below). It only affects which order tied candidates are
  // listed in secondaryIntents/clarificationQuestion, which is cosmetic.
  const rankedIntents = getAllIntentIds()
    .map((intentId) => ({ intentId, score: scores[intentId] }))
    .sort((a, b) => b.score - a.score);

  const topScore = rankedIntents[0].score;
  const secondScore = rankedIntents[1]?.score || 0;
  const zeroSignal = topScore <= 0;
  const candidateId = zeroSignal ? null : rankedIntents[0].intentId;
  const candidateDef = candidateId ? getIntentDefinition(candidateId) : null;
  const maxPatternWeight = zeroSignal ? 0 : maxWeightByIntent[candidateId];

  const confidence = computeConfidence(topScore, secondScore, maxPatternWeight);

  // Conservative-by-design: an exact tie, or any gap smaller than
  // CLEAR_WIN_MARGIN, is never arbitrarily resolved in favor of either
  // candidate — it always becomes UNKNOWN_INTENT_ID + requiresClarification.
  const gapInsufficient = !zeroSignal && secondScore > 0 && (topScore - secondScore) < CLEAR_WIN_MARGIN;
  const belowOwnThreshold = !zeroSignal && !gapInsufficient && confidence < candidateDef.confidenceThreshold;
  const isUnknown = zeroSignal || gapInsufficient || belowOwnThreshold;

  const primaryIntentId = isUnknown ? UNKNOWN_INTENT_ID : candidateId;
  const requiresClarification = isUnknown;

  const secondaryIntents = [...new Set(
    rankedIntents
      .filter((r) => r.intentId !== primaryIntentId && r.score >= SECONDARY_INTENT_MIN_SCORE)
      .slice(0, MAX_SECONDARY_INTENTS)
      .map((r) => r.intentId)
  )];

  const excludedIntents = buildExcludedIntents(primaryIntentId, scores);

  const ambiguityReasons = [];
  if (zeroSignal) {
    ambiguityReasons.push('לא נמצאה אף תבנית-כוונה מוכרת בשאלה — לא ניתן לקבוע כוונה בביטחון.');
  } else if (gapInsufficient) {
    ambiguityReasons.push(
      `הפער בין "${candidateDef.titleHebrew}" (ניקוד ${topScore}) ל-"${getIntentDefinition(rankedIntents[1].intentId).titleHebrew}" (ניקוד ${secondScore}) קטן-מדי להכרעה שמרנית — לא נבחרת כוונה יחידה באופן שרירותי.`
    );
  } else if (maxPatternWeight <= 1) {
    ambiguityReasons.push('נמצא רק אות חלש (משקל 1) ולא נמצאה תבנית חזקה ומדויקת יותר.');
  } else if (belowOwnThreshold) {
    ambiguityReasons.push(`הביטחון (${confidence}) נמוך מהסף הנדרש עבור "${candidateDef.titleHebrew}" (${candidateDef.confidenceThreshold}).`);
  }

  const clarificationCandidates = zeroSignal
    ? []
    : rankedIntents.filter((r) => r.score > 0).slice(0, 3).map((r) => r.intentId);
  const clarificationQuestion = requiresClarification ? buildClarificationQuestion(clarificationCandidates) : null;

  const matchedSignals = isUnknown
    ? rankedIntents.filter((r) => r.score > 0).flatMap((r) => signalsByIntent[r.intentId])
    : (signalsByIntent[primaryIntentId] || []);

  const questionType = validHint || classifyQuestionType(normalizedQuestion, { topicId }).questionTypeId;

  if (method !== undefined && !isMethod(method)) {
    // Method is accepted for forward-compatibility/validation only — it is
    // never used to alter intent detection, which is purely text-driven.
    // An invalid method is reported via ambiguityReasons rather than thrown,
    // since intent analysis can still proceed from the question text alone.
    ambiguityReasons.push(`method לא-חוקי (${JSON.stringify(method)}) — לא נעשה בו שימוש בקביעת הכוונה.`);
  }

  const decisionReason = buildDecisionReason({
    isUnknown,
    zeroSignal,
    gapInsufficient,
    belowOwnThreshold,
    candidateId,
    secondCandidateId: rankedIntents[1]?.intentId || null,
    confidence,
    matchedCount: isUnknown ? 0 : (signalsByIntent[candidateId] || []).length,
    excludedIntentIds: excludedIntents.map((e) => e.intentId),
    hasRealRunnerUp: !isUnknown && secondScore > 0,
  });

  return {
    normalizedQuestion,
    primaryIntent: primaryIntentId,
    secondaryIntents,
    questionType,
    confidence,
    matchedSignals,
    excludedIntents,
    ambiguityReasons,
    // When isUnknown, there is no committed intent to hint a strategy for
    // (strategyHints: []); forbiddenDefaultRuleCategories falls back to the
    // conservative union of every intent's forbidden categories instead —
    // "forbid everything sensitive by default until a real intent is known."
    strategyHints: isUnknown ? [] : candidateDef.defaultStrategyHints.slice(),
    forbiddenDefaultRuleCategories: isUnknown ? UNKNOWN_FORBIDDEN_RULE_CATEGORIES.slice() : candidateDef.forbiddenDefaultRuleCategories.slice(),
    requiresClarification,
    clarificationQuestion,
    needsOrenDecision: requiresClarification,
    decisionReason,
    analysisVersion: ANALYSIS_VERSION,
  };
}

/**
 * @param {object} input
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateIntentInput(input) {
  const errors = [];
  if (!input || typeof input !== 'object') return { valid: false, errors: ['intent input must be an object'] };
  if (!isNonEmptyString(input.question)) errors.push('question is required and must be a non-empty string');
  if (input.method !== undefined && !isMethod(input.method)) errors.push(`method must be 'kashf' or 'hawi' if provided (got ${JSON.stringify(input.method)})`);
  if (input.topicId !== undefined && typeof input.topicId !== 'string') errors.push('topicId must be a string if provided');
  if (input.questionTypeHint !== undefined) {
    if (typeof input.questionTypeHint !== 'string') errors.push('questionTypeHint must be a string if provided');
    else if (!getAllQuestionTypeIds().includes(input.questionTypeHint)) errors.push(`questionTypeHint is not a known questionType (got ${JSON.stringify(input.questionTypeHint)})`);
  }
  if (input.language !== undefined && typeof input.language !== 'string') errors.push('language must be a string if provided');
  return { valid: errors.length === 0, errors };
}

/**
 * @param {object} result - output of analyzeIntent()
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateIntentResult(result) {
  const errors = [];
  if (!result || typeof result !== 'object') return { valid: false, errors: ['intent result must be an object'] };

  if (!isPrimaryIntentValue(result.primaryIntent)) errors.push(`primaryIntent must be a known intent or '${UNKNOWN_INTENT_ID}' (got ${JSON.stringify(result.primaryIntent)})`);
  if (result.primaryIntent === UNKNOWN_INTENT_ID && result.requiresClarification !== true) {
    errors.push(`primaryIntent === '${UNKNOWN_INTENT_ID}' must always carry requiresClarification === true`);
  }

  if (!Array.isArray(result.secondaryIntents)) {
    errors.push('secondaryIntents must be an array');
  } else {
    if (new Set(result.secondaryIntents).size !== result.secondaryIntents.length) errors.push('secondaryIntents must not contain duplicates');
    if (result.secondaryIntents.includes(result.primaryIntent)) errors.push('secondaryIntents must not include primaryIntent');
  }

  if (typeof result.confidence !== 'number' || result.confidence < 0 || result.confidence > 1) {
    errors.push('confidence must be a number between 0 and 1');
  }

  if (!Array.isArray(result.excludedIntents)) {
    errors.push('excludedIntents must be an array');
  } else if (result.excludedIntents.some((e) => e.intentId === result.primaryIntent)) {
    errors.push('excludedIntents must not overlap with primaryIntent');
  }

  if (typeof result.requiresClarification !== 'boolean') {
    errors.push('requiresClarification must be a boolean');
  } else if (result.requiresClarification && !isNonEmptyString(result.clarificationQuestion)) {
    errors.push('clarificationQuestion is required and must be non-empty when requiresClarification is true');
  }

  // decisionReason is always required — both when confidence is high (explains
  // the pick) and when requiresClarification is true (explains why not one
  // was picked). There is no valid case where it may be empty.
  if (!isNonEmptyString(result.decisionReason)) {
    errors.push('decisionReason is required and must be a non-empty string');
  }

  // analysisVersion is a format check only (non-empty string) — deliberately
  // not pinned to today's ANALYSIS_VERSION value, so this validator keeps
  // working across future algorithm versions without needing an update itself.
  if (!isNonEmptyString(result.analysisVersion)) {
    errors.push('analysisVersion is required and must be a non-empty string');
  }

  return { valid: errors.length === 0, errors };
}

export default { analyzeIntent, validateIntentInput, validateIntentResult, ANALYSIS_VERSION };
