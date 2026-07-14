// goral-hachol/intelligence/kashf-ai-context-builder.js
//
// Wires the real Kashf reading pipeline into an AiContextPackage matching
// supabase/functions/oren-smart-advisor/ai-context-package.ts. Genuine
// engine calls only — no fabricated board/engineOutput/intent/strategy/plan.
//
// Real, wired here:
//   mothers -> buildRamlBoardFromMothers (raml-board-generator.js) -> board
//   board + topicId + question -> buildKashfReading (kashf-reading-engine.js) -> raw engineOutput
//   raw engineOutput -> buildAiSafeKashfEngineOutput (this file) -> AI-safe engineOutput
//   question -> analyzeIntent (intent-analyzer.js) -> questionType/primaryIntent
//   intentResult -> buildReadingStrategy (reading-strategy-builder.js) -> readingStrategy
//   intentResult + readingStrategy -> buildReadingPlan (reading-planner.js) -> readingPlan
//
// NOT wired (reported via missingFields, never invented):
//   activatedRuleIds / rejectedRuleIds / sourceEvidence / decisionSummary —
//   these are runRuleDecisionEngine's output (rule-decision-engine.js), which
//   requires per-rule `ruleDefinitions` with real sourceEvidence arrays. No
//   such loader exists for Kashf: goral-knowledge-registry.js only has
//   topic-level entries (evidenceLocation pointers, not sourceEvidence[]),
//   and rule-decision-engine.js has no real ruleDefinitions source wired
//   anywhere outside its own unit test fixtures. Building that loader is a
//   separate, reviewable decision — not made here.
//
// ---------------------------------------------------------------------------
// AI-safe Engine Output Projection — two layers of defense
// ---------------------------------------------------------------------------
// buildKashfReading()'s real return value is NOT safe to send to AI as-is:
// it always echoes a full `clientContext` sub-object (containing every key
// kashf_reading_payload_sanitizer.ts forbids: maritalStatus/hasChildren/
// parentName/phone/dynFields — present even when empty/null), and — for the
// 'commerce' topic — a second, deeper leak at
// `commerceSmartLayer.advisorDiagnosis.contextRelevance`, whose own key
// names are those same forbidden strings (confirmed by a full recursive
// scan of a real reading; no other leak paths were found).
//
// buildAiSafeKashfEngineOutput() is Layer 1 (this file, payload-construction
// time): an explicit ALLOWLIST projection — copies only named professional
// fields into a new object, never a full-copy-then-delete. It never mutates
// the original engineOutput (buildKashfReading's return value is untouched;
// callers who need the raw reading — e.g. the narrative writer — still get
// it unchanged from wherever they already call buildKashfReading directly).
//
// kashf_reading_payload_sanitizer.ts (supabase/functions/oren-smart-advisor/)
// remains Layer 2, unmodified and unweakened, run server-side just before
// any AI call. Layer 1 does not replace Layer 2 — the sanitizer still runs
// on the projected payload as defense-in-depth, and this builder does not
// assume it is unnecessary.

import { buildRamlBoardFromMothers } from '../engine/raml-board-generator.js';
import { buildKashfReading } from '../engine/kashf-reading-engine.js';
import { analyzeIntent } from './intent-analyzer.js';
import { buildReadingStrategy } from './reading-strategy-builder.js';
import { buildReadingPlan } from './reading-planner.js';

export const KASHF_AI_CONTEXT_BUILDER_VERSION = 'kashf-ai-context-builder-v2';

// Top-level engineOutput fields that are professional/engine-computed —
// deliberately excludes `clientContext` (the only top-level source of
// forbidden-key leakage, per the recursive scan referenced above).
const ENGINE_OUTPUT_ALLOWED_KEYS = [
  'valid', 'error', 'topicId', 'topicHebrewName', 'topicDescription', 'sourceRef',
  'primaryFormula', 'altFormula', 'supportingFindings', 'keyHouseReadings',
  'boardValidation', 'dhamir', 'dhamirType4External', 'dhamirExtras',
  'witnessTestimony', 'overallPositive',
];

// commerceSmartLayer (currently the only topic-specific "smart layer";
// buildKashfReading only attaches it for topicId:'commerce') — professional
// signal/verdict fields only.
const COMMERCE_SMART_LAYER_ALLOWED_KEYS = [
  'weightedHouses', 'certaintyLevel', 'strongestSignals', 'weakSignals',
  'contradictions', 'clientWording', 'practicalGuidance',
];

// commerceSmartLayer.advisorDiagnosis — deliberately excludes
// `contextRelevance`: its own key names (parentName/maritalStatus/
// hasChildren/workStatus/quesitedName/dynFields) are exactly the forbidden
// strings, regardless of the (always non-identifying) values underneath.
const ADVISOR_DIAGNOSIS_ALLOWED_KEYS = [
  'weightedHouses', 'strongestSignals', 'weakSignals', 'contradictions',
  'certaintyLevel', 'supportRatio', 'contextAdjustments',
];

function projectAllowlist(obj, allowedKeys) {
  const out = {};
  for (const key of allowedKeys) {
    if (obj && Object.prototype.hasOwnProperty.call(obj, key)) out[key] = obj[key];
  }
  return out;
}

/**
 * Layer 1 (payload-construction-time) — pure function, does not mutate its
 * input. Returns a NEW object built entirely from an explicit allowlist, so
 * `clientContext` and `commerceSmartLayer.advisorDiagnosis.contextRelevance`
 * (the two confirmed leak paths) are structurally impossible to include —
 * there is no delete/blacklist step that could be forgotten or bypassed.
 *
 * @param {object} engineOutput - real, unmodified return value of buildKashfReading()
 * @returns {object} AI-safe projection
 */
export function buildAiSafeKashfEngineOutput(engineOutput) {
  if (!engineOutput || typeof engineOutput !== 'object') return engineOutput;

  const projected = projectAllowlist(engineOutput, ENGINE_OUTPUT_ALLOWED_KEYS);

  const csl = engineOutput.commerceSmartLayer;
  if (csl && typeof csl === 'object') {
    const projectedCsl = projectAllowlist(csl, COMMERCE_SMART_LAYER_ALLOWED_KEYS);
    if (csl.advisorDiagnosis && typeof csl.advisorDiagnosis === 'object') {
      projectedCsl.advisorDiagnosis = projectAllowlist(csl.advisorDiagnosis, ADVISOR_DIAGNOSIS_ALLOWED_KEYS);
    }
    projected.commerceSmartLayer = projectedCsl;
  }

  return projected;
}

/**
 * @param {object} input
 * @param {string[]} input.mothers - real 4-figure array (e.g. ['2222','2211','2121','2221'])
 * @param {string} input.topicId - real Kashf topic id (kashf-topic-rules.js)
 * @param {string} input.question - the real question asked
 * @param {string} [input.readingId]
 * @param {string} [input.clientName]
 * @returns {{ contextPackage: object|null, completeness: 'complete'|'partial', missingFields: string[], intentResult: object|null }}
 */
export function buildKashfAiContextPackage(input = {}) {
  const { mothers, topicId, question, readingId, clientName } = input;
  const missingFields = [];

  if (!Array.isArray(mothers) || mothers.length !== 4) {
    return { contextPackage: null, completeness: 'partial', missingFields: ['mothers — must be a real 4-figure array (e.g. from an actual cast), none was provided'], intentResult: null };
  }
  if (!topicId) {
    return { contextPackage: null, completeness: 'partial', missingFields: ['topicId — required to run buildKashfReading, none was provided'], intentResult: null };
  }
  if (!question || typeof question !== 'string') {
    return { contextPackage: null, completeness: 'partial', missingFields: ['question — required for intent analysis and readingContext.question, none was provided'], intentResult: null };
  }

  const board = buildRamlBoardFromMothers(mothers);
  const rawEngineOutput = buildKashfReading(board, topicId, { name: clientName || '', question });
  const aiSafeEngineOutput = buildAiSafeKashfEngineOutput(rawEngineOutput);

  const intentResult = analyzeIntent({ question, method: 'kashf', topicId });
  const readingStrategy = buildReadingStrategy({ intentResult, method: 'kashf', topicId });
  const readingPlan = buildReadingPlan({
    question,
    readingDomain: 'goralHachol',
    method: 'kashf',
    topicId,
    questionType: intentResult.questionType,
    intentResult,
    readingStrategy,
  });

  missingFields.push('readingContext.activatedRuleIds — no per-rule ruleDefinitions source is wired for Kashf yet (rule-decision-engine.js has no real loader; goral-knowledge-registry.js entries are topic-level, not rule-level)');
  missingFields.push('readingContext.rejectedRuleIds — same missing source as activatedRuleIds');
  missingFields.push('readingContext.sourceEvidence — same missing source (per-rule sourceEvidence snippets, distinct from topic-level evidenceLocation pointers)');
  missingFields.push('decisionSummary — normally produced by runRuleDecisionEngine, which did not run (see activatedRuleIds above)');

  if (readingPlan?.stopped) {
    missingFields.push(`readingPlan.stopped — ${readingPlan.stopReason}`);
  }
  if (intentResult?.requiresClarification) {
    missingFields.push(`intentResult.requiresClarification — ${intentResult.clarificationQuestion || 'question intent was not confidently classified'}`);
  }

  const contextPackage = {
    payloadVersion: 'ai-context-package-v1',
    readingId: readingId || null,
    domain: 'reading.goralHachol',
    method: 'kashf',
    questionType: intentResult.questionType,
    primaryIntent: intentResult.primaryIntent,
    readingStrategy,
    readingPlan,
    readingContext: {
      question,
      board,
      engineOutput: aiSafeEngineOutput,
      activatedRuleIds: [],
      rejectedRuleIds: [],
      sourceEvidence: [],
    },
  };

  return { contextPackage, completeness: missingFields.length === 0 ? 'complete' : 'partial', missingFields, intentResult };
}

export default { buildKashfAiContextPackage, buildAiSafeKashfEngineOutput, KASHF_AI_CONTEXT_BUILDER_VERSION };
