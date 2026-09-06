/**
 * kashf-method-router.js
 *
 * P0 hard-stop router for Kashf.
 * Resolves an explicit question-bank id into exactly one source-specific
 * Kashf intent and one canonical method. It never falls back to topic-level
 * routing.
 */

import { getKashfMethod } from '../registry/kashf-canonical-method-registry.js';
import { getKashfQuestionRoute } from '../registry/kashf-question-route-registry.js';

const USER_MESSAGE_BY_STATUS = Object.freeze({
  ready: null,
  'repair-required': 'שיטת כשף לשאלה זו ממופה במקור, אך עדיין אינה מאושרת להפעלה עד השלמת התיקון והבדיקות.',
  'blocked-by-source': 'שיטת כשף לשאלה זו עדיין חסומה בגלל נקודת מקור שלא הוכרעה.',
  'educational-only': 'החומר קיים בספריית הלימוד אך אינו משמש כרגע לפסיקה.',
  unsupported: 'לא נמצא כרגע חוק כשף אופרטיבי מאומת לשאלה זו.',
});

// P0 intentionally enables only the isolated formula executor. Other source-
// verified execution kinds stay visible in the registry but cannot run until
// their dedicated canonical executor is connected.
const P0_ENABLED_EXECUTION_KINDS = Object.freeze(['formula']);

export function resolveKashfRouteByQuestionId(questionId) {
  if (typeof questionId !== 'string' || questionId.trim().length === 0) {
    return {
      ok: false,
      questionId: questionId || null,
      canRunKashf: false,
      kashfIntentId: null,
      kashfMethodId: null,
      kashfRuntimeStatus: 'unsupported',
      runtimeAllowed: false,
      executorEnabled: false,
      disposition: 'BLOCK',
      reason: 'invalid-question-id',
      userMessage: 'לא נבחרה שאלת כשף תקפה.',
    };
  }

  const route = getKashfQuestionRoute(questionId);
  if (!route) {
    return {
      ok: false,
      questionId,
      canRunKashf: false,
      kashfIntentId: null,
      kashfMethodId: null,
      kashfRuntimeStatus: 'unsupported',
      runtimeAllowed: false,
      executorEnabled: false,
      disposition: 'BLOCK',
      reason: 'unmapped-question-id',
      userMessage: 'השאלה עדיין לא מופתה לשיטת כשף קנונית. אין fallback לנושא כללי.',
    };
  }

  const method = getKashfMethod(route.kashfMethodId);
  if (!method) {
    return {
      ok: false,
      questionId,
      canRunKashf: false,
      kashfIntentId: route.kashfIntentId,
      kashfMethodId: route.kashfMethodId,
      kashfRuntimeStatus: route.kashfRuntimeStatus,
      runtimeAllowed: false,
      executorEnabled: false,
      disposition: route.disposition,
      aliasOf: route.aliasOf,
      reason: 'method-not-found',
      userMessage: 'מיפוי השאלה מצביע לשיטה שאינה קיימת ברשם השיטות.',
    };
  }

  if (method.kashfIntentId !== route.kashfIntentId) {
    return {
      ok: false,
      questionId,
      canRunKashf: false,
      kashfIntentId: route.kashfIntentId,
      kashfMethodId: route.kashfMethodId,
      kashfRuntimeStatus: route.kashfRuntimeStatus,
      runtimeAllowed: false,
      executorEnabled: false,
      disposition: route.disposition,
      aliasOf: route.aliasOf,
      reason: 'route-method-intent-mismatch',
      userMessage: 'נמצאה אי־התאמה פנימית בין כוונת השאלה לשיטת כשף.',
    };
  }

  if (method.kashfRuntimeStatus !== route.kashfRuntimeStatus) {
    return {
      ok: false,
      questionId,
      canRunKashf: false,
      kashfIntentId: route.kashfIntentId,
      kashfMethodId: route.kashfMethodId,
      kashfRuntimeStatus: route.kashfRuntimeStatus,
      runtimeAllowed: false,
      executorEnabled: false,
      disposition: route.disposition,
      aliasOf: route.aliasOf,
      reason: 'route-method-status-mismatch',
      userMessage: 'נמצאה אי־התאמה פנימית בסטטוס שיטת כשף.',
    };
  }

  const executorEnabled = P0_ENABLED_EXECUTION_KINDS.includes(method.executionKind);
  const sourceAndPolicyAllowRun = method.methodRole === 'canonical-operational'
    && method.runtimeAllowed === true
    && method.kashfRuntimeStatus === 'ready';
  const canRunKashf = sourceAndPolicyAllowRun && executorEnabled;

  const reason = canRunKashf
    ? 'ready'
    : sourceAndPolicyAllowRun && !executorEnabled
      ? 'canonical-executor-not-enabled'
      : method.kashfRuntimeStatus;

  const userMessage = canRunKashf
    ? null
    : sourceAndPolicyAllowRun && !executorEnabled
      ? 'השיטה מאומתת במקור, אך המבצע הקנוני שלה עדיין לא חובר לנתיב החדש.'
      : (USER_MESSAGE_BY_STATUS[method.kashfRuntimeStatus] ?? 'שיטת כשף אינה זמינה כרגע להפעלה.');

  return {
    ok: true,
    questionId,
    canRunKashf,
    kashfIntentId: route.kashfIntentId,
    kashfMethodId: route.kashfMethodId,
    kashfRuntimeStatus: route.kashfRuntimeStatus,
    runtimeAllowed: method.runtimeAllowed,
    executorEnabled,
    disposition: route.disposition,
    aliasOf: route.aliasOf,
    methodRole: method.methodRole,
    sourceVolume: method.sourceVolume,
    sourcePages: method.sourcePages,
    sourceLayer: method.sourceLayer,
    attributedSourceBook: method.attributedSourceBook,
    sourceConfidence: method.sourceConfidence,
    executionKind: method.executionKind,
    legacyTopicId: method.legacyTopicId,
    legacyFormulaSlot: method.legacyFormulaSlot,
    reason,
    userMessage,
  };
}

export function requireRunnableKashfRoute(questionId) {
  const resolved = resolveKashfRouteByQuestionId(questionId);
  if (!resolved.ok || !resolved.canRunKashf) {
    const error = new Error(resolved.userMessage || 'Kashf route is not runnable');
    error.code = 'KASHF_ROUTE_BLOCKED';
    error.route = resolved;
    throw error;
  }
  return resolved;
}

export default {
  resolveKashfRouteByQuestionId,
  requireRunnableKashfRoute,
};
