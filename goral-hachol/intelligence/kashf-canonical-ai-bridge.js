/**
 * kashf-canonical-ai-bridge.js
 *
 * Single bridge between natural-language/question-bank selection and the
 * canonical Kashf runtime that is allowed to feed the AI.
 *
 * Authority rules:
 * 1. An explicit Question Bank questionId is authoritative. Free-text search
 *    may enrich it, but may never replace its kashfMethodId.
 * 2. Without questionId, the Hebrew AI retrieval index may resolve a unique
 *    method. Ambiguous/no-match retrieval never executes a method.
 * 3. v57 Hebrew is operational-primary. Arabic metadata is verification-only.
 * 4. Retrieval never changes runtimeAllowed/executorStatus.
 * 5. Only kashf-canonical-reading-engine may calculate a verdict.
 */

import { resolveKashfRouteByQuestionId } from '../engine/kashf-method-router.js';
import {
  buildKashfReadingByMethod,
  buildKashfReadingByQuestionId,
} from '../engine/kashf-canonical-reading-engine.js';
import {
  getKashfAiRetrievalRecord,
  resolveBestKashfAiRetrievalHit,
  searchKashfAiRetrievalIndex,
} from '../registry/kashf-ai-retrieval-index.js';
import { buildKashfProfessionalVerdictSafety } from './kashf-professional-verdict-safety.js';

export const KASHF_CANONICAL_AI_BRIDGE_VERSION = 'kashf-canonical-ai-bridge-v2';

function freezeArray(values = []) {
  return Object.freeze([...(Array.isArray(values) ? values : [])]);
}

function projectRecord(record) {
  if (!record) return null;
  return Object.freeze({
    kashfMethodId: record.kashfMethodId,
    kashfIntentId: record.kashfIntentId,
    topicId: record.topicId,
    methodRole: record.methodRole,
    kashfRuntimeStatus: record.kashfRuntimeStatus,
    runtimeAllowed: record.runtimeAllowed === true,
    executorStatus: record.executorStatus,
    executionKind: record.executionKind,
    sourceConfidence: record.sourceConfidence,
    questionIds: freezeArray(record.questionIds),
    aliases: freezeArray(record.aliases),
    houses: freezeArray(record.houses),
    doNotMixWith: freezeArray(record.doNotMixWith),
    pages: freezeArray(record.pages),
    supportingPages: freezeArray(record.supportingPages),
    knowledgeLanguage: record.operationalLanguage,
    knowledgeRole: record.operationalRole,
    v57: record.v57 ? Object.freeze({
      version: record.v57.version,
      indexFile: record.v57.indexFile,
      draftFile: record.v57.draftFile,
      page: record.v57.page,
      anchor: record.v57.anchor,
      topic: record.v57.topic,
      heading: record.v57.heading,
      hebrewRule: record.v57.hebrewRule,
    }) : null,
    arabicVerification: Object.freeze({
      role: record.arabicVerificationRole,
      pages: freezeArray(record.arabicVerificationPages),
    }),
    notes: record.notes || null,
  });
}

function projectCandidate(record) {
  if (!record) return null;
  return Object.freeze({
    kashfMethodId: record.kashfMethodId,
    kashfIntentId: record.kashfIntentId,
    kashfRuntimeStatus: record.kashfRuntimeStatus,
    runtimeAllowed: record.runtimeAllowed === true,
    executorStatus: record.executorStatus,
    v57Page: record.v57?.page ?? null,
    v57Heading: record.v57?.heading ?? null,
    retrievalScore: Number(record.retrievalScore || 0),
    retrievalReasons: freezeArray(record.retrievalReasons),
  });
}

function routeOnlyRecord(route) {
  if (!route) return null;
  return Object.freeze({
    kashfMethodId: route.kashfMethodId || null,
    kashfIntentId: route.kashfIntentId || null,
    topicId: route.legacyTopicId || null,
    methodRole: route.methodRole || null,
    kashfRuntimeStatus: route.kashfRuntimeStatus || 'unsupported',
    runtimeAllowed: route.runtimeAllowed === true,
    executorStatus: route.executorStatus || 'not-applicable',
    executionKind: route.executionKind || null,
    sourceConfidence: route.sourceConfidence || null,
    questionIds: freezeArray(route.questionId ? [route.questionId] : []),
    aliases: freezeArray([]),
    houses: freezeArray([]),
    doNotMixWith: freezeArray([]),
    pages: freezeArray(route.sourcePages),
    supportingPages: freezeArray([]),
    knowledgeLanguage: null,
    knowledgeRole: null,
    v57: null,
    arabicVerification: Object.freeze({ role: 'verification-only', pages: freezeArray([]) }),
    notes: route.userMessage || null,
  });
}

function blockedReadingFromResolution(resolution, reason, userMessage) {
  return Object.freeze({
    valid: false,
    status: 'blocked',
    canRunKashf: false,
    verdict: null,
    overallPositive: null,
    kashfIntentId: resolution?.kashfIntentId || null,
    kashfMethodId: resolution?.kashfMethodId || null,
    kashfRuntimeStatus: resolution?.kashfRuntimeStatus || 'unsupported',
    executorStatus: resolution?.executorStatus || 'not-applicable',
    reason,
    userMessage,
  });
}

/**
 * Resolve + optionally execute exactly one canonical Kashf method for AI use.
 *
 * @param {object} input
 * @param {string} [input.questionId] Question Bank id; authoritative when present.
 * @param {string} [input.questionText] Natural-language user question.
 * @param {object} [input.board] Canonical Raml board.
 * @param {object} [input.clientContext] Minimal safe context for canonical engine.
 */
export function buildKashfCanonicalAiBridge(input = {}) {
  const questionId = typeof input.questionId === 'string' && input.questionId.trim()
    ? input.questionId.trim()
    : null;
  const questionText = typeof input.questionText === 'string' ? input.questionText.trim() : '';
  const board = input.board || null;
  const clientContext = input.clientContext && typeof input.clientContext === 'object'
    ? input.clientContext
    : {};

  let resolution;
  let retrievalRecord = null;
  let candidates = [];

  if (questionId) {
    const route = resolveKashfRouteByQuestionId(questionId);
    retrievalRecord = route.kashfMethodId ? getKashfAiRetrievalRecord(route.kashfMethodId) : null;

    // Search is advisory evidence only when a route exists. It can expose
    // competing natural-language hits for debugging but cannot change method.
    const textHits = questionText
      ? searchKashfAiRetrievalIndex(questionText, { limit: 3 }).map(projectCandidate).filter(Boolean)
      : [];
    candidates = textHits;

    resolution = Object.freeze({
      state: route.ok ? 'resolved' : 'blocked',
      resolutionSource: 'question-route',
      authoritative: true,
      questionId,
      questionText,
      kashfIntentId: route.kashfIntentId || null,
      kashfMethodId: route.kashfMethodId || null,
      kashfRuntimeStatus: route.kashfRuntimeStatus || 'unsupported',
      runtimeAllowed: route.runtimeAllowed === true,
      executorStatus: route.executorStatus || 'not-applicable',
      canExecute: route.canRunKashf === true,
      reason: route.reason || null,
      userMessage: route.userMessage || null,
      retrievalDisagreesWithRoute: Boolean(
        textHits[0]?.kashfMethodId && route.kashfMethodId && textHits[0].kashfMethodId !== route.kashfMethodId
      ),
    });

    if (!retrievalRecord && route.kashfMethodId) retrievalRecord = routeOnlyRecord(route);
  } else {
    const retrieval = resolveBestKashfAiRetrievalHit(questionText);
    const best = retrieval.best || null;
    retrievalRecord = best ? getKashfAiRetrievalRecord(best.kashfMethodId) || best : null;
    candidates = [best, ...(retrieval.alternatives || [])].filter(Boolean).map(projectCandidate);

    if (!retrieval.resolved || !best) {
      resolution = Object.freeze({
        state: best ? 'ambiguous' : 'not-found',
        resolutionSource: 'retrieval-index',
        authoritative: false,
        questionId: null,
        questionText,
        kashfIntentId: best?.kashfIntentId || null,
        kashfMethodId: best?.kashfMethodId || null,
        kashfRuntimeStatus: best?.kashfRuntimeStatus || 'unsupported',
        runtimeAllowed: false,
        executorStatus: best?.executorStatus || 'not-applicable',
        canExecute: false,
        reason: retrieval.reason,
        userMessage: best
          ? 'הניסוח מתאים ליותר משיטת כשף אחת; אין לבחור שיטה בכוח.'
          : 'לא נמצאה התאמה מספקת באינדקס הידע העברי של כשף.',
        retrievalDisagreesWithRoute: false,
      });
    } else {
      const canExecute = best.runtimeAllowed === true
        && best.executorStatus === 'ready'
        && best.kashfRuntimeStatus === 'ready';
      resolution = Object.freeze({
        state: 'resolved',
        resolutionSource: 'retrieval-index',
        authoritative: false,
        questionId: null,
        questionText,
        kashfIntentId: best.kashfIntentId,
        kashfMethodId: best.kashfMethodId,
        kashfRuntimeStatus: best.kashfRuntimeStatus,
        runtimeAllowed: best.runtimeAllowed === true,
        executorStatus: best.executorStatus,
        canExecute,
        reason: canExecute ? 'ready' : (best.kashfRuntimeStatus === 'ready' ? 'executor-pending' : best.kashfRuntimeStatus),
        userMessage: canExecute ? null : 'השיטה נמצאה באינדקס, אך סטטוס המקור/המבצע אינו מתיר חישוב חי.',
        retrievalDisagreesWithRoute: false,
      });
    }
  }

  const canonicalRetrieval = retrievalRecord ? projectRecord(retrievalRecord) : null;

  let canonicalReading;
  if (!board) {
    canonicalReading = blockedReadingFromResolution(resolution, 'board-missing', 'חסר לוח גורל לחישוב הקנוני.');
  } else if (resolution.state !== 'resolved' || !resolution.kashfMethodId) {
    canonicalReading = blockedReadingFromResolution(
      resolution,
      resolution.state === 'ambiguous' ? 'retrieval-ambiguous' : 'retrieval-not-resolved',
      resolution.userMessage
    );
  } else if (questionId) {
    // The question route gets the final say. The canonical engine performs its
    // own fail-closed status/executor/v57 gates again.
    canonicalReading = buildKashfReadingByQuestionId(board, questionId, {
      ...clientContext,
      question: questionText || clientContext.question || '',
    });
  } else {
    canonicalReading = buildKashfReadingByMethod(board, resolution.kashfMethodId, {
      ...clientContext,
      question: questionText || clientContext.question || '',
    });
  }

  const baseAiVerdictAllowed = Boolean(
    resolution.state === 'resolved'
    && canonicalReading?.valid === true
    && canonicalReading?.canRunKashf === true
    && canonicalReading?.kashfMethodId === resolution.kashfMethodId
  );
  const professionalVerdictSafety = buildKashfProfessionalVerdictSafety({
    resolution,
    canonicalReading,
    canonicalRetrieval,
    baseAiVerdictAllowed,
  });
  const aiVerdictAllowed = Boolean(baseAiVerdictAllowed && professionalVerdictSafety.isSafe);

  return Object.freeze({
    bridgeVersion: KASHF_CANONICAL_AI_BRIDGE_VERSION,
    resolution,
    canonicalRetrieval,
    candidates: freezeArray(candidates),
    canonicalReading,
    professionalVerdictSafety,
    aiVerdictAllowed,
  });
}

export default { buildKashfCanonicalAiBridge, KASHF_CANONICAL_AI_BRIDGE_VERSION };
