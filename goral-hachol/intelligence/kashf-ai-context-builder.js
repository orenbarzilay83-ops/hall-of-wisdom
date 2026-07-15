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

export const KASHF_AI_CONTEXT_BUILDER_VERSION = 'kashf-ai-context-builder-v3';

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

// ---------------------------------------------------------------------------
// AI-safe Board Projection
// ---------------------------------------------------------------------------
// buildRamlBoardFromMothers()'s real return value is NOT shaped for an AI
// prompt as-is: measured on a real reading (see
// HALL_WISDOM_KASHF_LIVE_PILOT_CONTEXT_SIZE_AND_JSON_AUDIT_REPORT.md),
// `board.houses` and `board.housesByNumber` serialize the exact same 16
// positions twice, and every position's `figure` sub-object embeds that
// figure's FULL 16-house transit table (source text for all 16 houses it
// could ever occupy), even though only the 1 entry matching that position's
// own house number is relevant. That nested table alone was confirmed
// byte-identical to the position's own top-level `figureHouseMeaning` field
// — so nothing is lost by dropping it.
//
// buildAiSafeKashfBoard() applies the same allowlist-projection pattern as
// buildAiSafeKashfEngineOutput() above: never mutates the original board
// (raml-board-generator.js and the live board display are untouched), and
// copies only named fields into a new object — no delete/blacklist step.
//
// Canonical representation: `houses` (array) only — `housesByNumber` (the
// confirmed duplicate) is dropped entirely, not projected under a new name.
// `entries` and `generation` (mothers/daughters/granddaughters/witnesses/
// judge derivation history) are dropped as separate top-level structures —
// their one piece of content not already present in `houses[i]`, namely
// each position's figure-state/classification fields (fortune/movement/
// element/gender/zodiac/seeker-status — Kashf's own classification layer,
// `kashf-figure-names.js`), is folded into `houses[i].figureState` instead,
// keyed by house number. `sourceReview` (book-audit provenance notes about
// how houses 5-8/15-16 were derived) is dropped — it documents the
// generation *process*, not this reading's interpretation.

const BOARD_TOP_LEVEL_ALLOWED_KEYS = [
  'id', 'source', 'boardHebrewName', 'inputMode', 'displayDirection', 'boardValidation',
];

// Figure identity only — deliberately excludes sourcePages/extractionStatus/
// auditStatus/section/sourceBook/next/noteHebrew/houses (book-audit metadata
// and the full 16-house transit table; the latter is redundant with the
// position's own figureHouseMeaning, per the note above).
const POSITION_FIGURE_IDENTITY_KEYS = ['id', 'hebrewName', 'arabicName'];

// Kashf's own figure-classification layer (kashf-figure-names.js), matched
// per-position via board.entries — genuinely new content, not present
// anywhere else in `houses[i]`.
const POSITION_FIGURE_STATE_KEYS = [
  'fortuneHebrew', 'movementHebrew', 'elementHebrew', 'compassDirection',
  'genderHebrew', 'timeHebrew', 'weightHebrew', 'purityHebrew',
  'zodiacPosition', 'zodiacHebrew', 'ichchhaHebrew', 'seekerStatus',
  'seekerSoughtArabic', 'seekerSoughtHebrew',
];

/**
 * Layer 1 (payload-construction-time) — pure function, does not mutate its
 * input. Returns a NEW object: one canonical `houses` array (no
 * `housesByNumber` duplicate), each position carrying only its own
 * figure identity, figure-state/classification, house-generic meaning,
 * and this-figure-in-this-house transit meaning — never the figure's full
 * 16-house transit table.
 *
 * @param {object} board - real, unmodified return value of buildRamlBoardFromMothers()
 * @returns {object} AI-safe projection
 */
export function buildAiSafeKashfBoard(board) {
  if (!board || typeof board !== 'object') return board;

  const stateByHouse = new Map();
  if (Array.isArray(board.entries)) {
    for (const entry of board.entries) {
      if (entry && typeof entry.house === 'number' && entry.figure && typeof entry.figure === 'object') {
        stateByHouse.set(entry.house, entry.figure);
      }
    }
  }

  const houses = Array.isArray(board.houses) ? board.houses.map((position) => {
    const stateFigure = stateByHouse.get(position?.house);
    return {
      house: position.house,
      houseNumber: position.houseNumber,
      figureId: position.figureId,
      figure: position.figure && typeof position.figure === 'object'
        ? projectAllowlist(position.figure, POSITION_FIGURE_IDENTITY_KEYS)
        : null,
      figureState: stateFigure ? projectAllowlist(stateFigure, POSITION_FIGURE_STATE_KEYS) : null,
      houseMeaning: position.houseMeaning ?? null,
      figureHouseMeaning: position.figureHouseMeaning ?? null,
      sourceStatus: position.sourceStatus,
    };
  }) : [];

  const projected = projectAllowlist(board, BOARD_TOP_LEVEL_ALLOWED_KEYS);
  projected.houses = houses;
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
  const aiSafeBoard = buildAiSafeKashfBoard(board);

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
      board: aiSafeBoard,
      engineOutput: aiSafeEngineOutput,
      activatedRuleIds: [],
      rejectedRuleIds: [],
      sourceEvidence: [],
    },
  };

  return { contextPackage, completeness: missingFields.length === 0 ? 'complete' : 'partial', missingFields, intentResult };
}

export default { buildKashfAiContextPackage, buildAiSafeKashfEngineOutput, buildAiSafeKashfBoard, KASHF_AI_CONTEXT_BUILDER_VERSION };
