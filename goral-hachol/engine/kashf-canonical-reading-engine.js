/**
 * kashf-canonical-reading-engine.js
 *
 * P0 canonical execution path for Kashf.
 * Executes exactly ONE method selected by kashfMethodId. It intentionally
 * does NOT execute topic altFormula/supportingChecks/dhamir extras.
 *
 * This first implementation supports the formula-based pilot slice only.
 * Other execution kinds stay hard-stopped until their dedicated executor is
 * implemented and explicitly enabled in the method registry.
 */

import {
  ROW,
  combineHouses,
  assembleFromRow,
  assembleFromFireRows,
  assembleFromAllRows,
  classifyPattern,
  getFigureHebrewName,
  getHousePattern,
} from './kashf-formula-engine.js';
import { getTopicRules } from './kashf-topic-rules.js';
import { getKashfMethod } from '../registry/kashf-canonical-method-registry.js';
import { requireRunnableKashfRoute } from './kashf-method-router.js';

const ROW_BY_NAME = Object.freeze({
  fire: ROW.FIRE,
  air: ROW.AIR,
  water: ROW.WATER,
  earth: ROW.EARTH,
});

function blockedResult({
  kashfMethodId,
  kashfIntentId = null,
  status = 'unsupported',
  reason,
  userMessage,
}) {
  return {
    valid: false,
    status: 'blocked',
    verdict: null,
    overallPositive: null,
    kashfIntentId,
    kashfMethodId,
    kashfRuntimeStatus: status,
    reason,
    userMessage,
  };
}

function executeFormula(board, formula) {
  if (!formula || typeof formula !== 'object') {
    throw new Error('Canonical formula is missing');
  }

  const { type, houses = [] } = formula;
  let resultPattern;

  switch (type) {
    case 'fire-row-assemble':
      resultPattern = assembleFromFireRows(board, houses);
      break;
    case 'row-assemble': {
      const row = ROW_BY_NAME[formula.row];
      if (row == null) throw new Error(`Unknown row name: ${formula.row}`);
      resultPattern = assembleFromRow(board, houses, row);
      break;
    }
    case 'assemble':
      resultPattern = assembleFromAllRows(board, houses);
      break;
    case 'combine':
      resultPattern = combineHouses(board, houses);
      break;
    case 'house-quality':
      resultPattern = getHousePattern(board, houses[0]);
      break;
    default:
      throw new Error(`Canonical formula type is not enabled in P0: ${type}`);
  }

  const classification = classifyPattern(resultPattern);
  return {
    type,
    houses: [...houses],
    resultPattern,
    resultFigureName: getFigureHebrewName(resultPattern),
    classification,
  };
}

function interpretFormula(result, formula) {
  const classification = result?.classification || {};

  if (formula.interpretBy === 'dakhal-kharij') {
    const key = classification.dakhalKharij;
    const verdict = formula.verdictByDakhalKharij?.[key];
    return verdict || {
      text: classification.dakhalKharijHebrew || 'ללא הכרעה',
      positive: null,
    };
  }

  if (formula.interpretBy === 'saad-nahs') {
    const key = classification.saadNahs;
    const verdict = formula.verdictBySaadNahs?.[key];
    return verdict || {
      text: classification.saadNahsHebrew || 'ללא הכרעה',
      positive: null,
    };
  }

  throw new Error(`Canonical interpretBy is not enabled in P0: ${formula.interpretBy}`);
}

/**
 * Executes ONE explicitly selected canonical Kashf method.
 * No topic fallback, no alt formula, no supporting bundle.
 */
export function buildKashfReadingByMethod(board, kashfMethodId, clientContext = {}) {
  const method = getKashfMethod(kashfMethodId);

  if (!method) {
    return blockedResult({
      kashfMethodId,
      reason: 'method-not-found',
      userMessage: 'שיטת כשף המבוקשת אינה קיימת ברשם השיטות.',
    });
  }

  if (method.methodRole !== 'canonical-operational' || method.runtimeAllowed !== true || method.kashfRuntimeStatus !== 'ready') {
    return blockedResult({
      kashfMethodId,
      kashfIntentId: method.kashfIntentId,
      status: method.kashfRuntimeStatus,
      reason: method.kashfRuntimeStatus,
      userMessage: method.kashfRuntimeStatus === 'educational-only'
        ? 'החומר קיים בספריית הלימוד אך אינו משמש כרגע לפסיקה.'
        : method.kashfRuntimeStatus === 'blocked-by-source'
          ? 'שיטת כשף לשאלה זו עדיין חסומה בגלל נקודת מקור שלא הוכרעה.'
          : method.kashfRuntimeStatus === 'repair-required'
            ? 'שיטת כשף זו ממתינה לתיקון ואימות לפני הפעלה.'
            : 'שיטת כשף זו אינה מאושרת כרגע להפעלה.',
    });
  }

  if (method.executionKind !== 'formula') {
    return blockedResult({
      kashfMethodId,
      kashfIntentId: method.kashfIntentId,
      status: method.kashfRuntimeStatus,
      reason: 'canonical-executor-not-enabled',
      userMessage: 'השיטה מאומתת במקור אך המבצע הקנוני שלה עדיין לא חובר לנתיב החדש.',
    });
  }

  if (!method.legacyTopicId || !method.legacyFormulaSlot) {
    return blockedResult({
      kashfMethodId,
      kashfIntentId: method.kashfIntentId,
      status: method.kashfRuntimeStatus,
      reason: 'formula-reference-missing',
      userMessage: 'חסרה הפניית נוסחה מפורשת לשיטה הקנונית.',
    });
  }

  const topicRules = getTopicRules(method.legacyTopicId);
  const formula = topicRules?.[method.legacyFormulaSlot];
  if (!topicRules || !formula) {
    return blockedResult({
      kashfMethodId,
      kashfIntentId: method.kashfIntentId,
      status: method.kashfRuntimeStatus,
      reason: 'legacy-formula-not-found',
      userMessage: 'נוסחת המקור שהשיטה מפנה אליה אינה זמינה.',
    });
  }

  try {
    const result = executeFormula(board, formula);
    const verdict = interpretFormula(result, formula);

    return {
      valid: true,
      status: 'ok',
      kashfIntentId: method.kashfIntentId,
      kashfMethodId: method.kashfMethodId,
      kashfRuntimeStatus: method.kashfRuntimeStatus,
      methodRole: method.methodRole,
      source: {
        sourceVolume: method.sourceVolume,
        sourcePages: method.sourcePages,
        sourceLayer: method.sourceLayer,
        attributedSourceBook: method.attributedSourceBook,
        sourceConfidence: method.sourceConfidence,
      },
      clientContext: {
        name: clientContext.name || '',
        question: clientContext.question || '',
      },
      formula: {
        type: formula.type,
        houses: [...(formula.houses || [])],
        sourceText: formula.sourceText || '',
        result,
      },
      verdict,
      overallPositive: verdict?.positive ?? null,

      // P0 isolation evidence: these fields are explicit so QA/AI can prove
      // the canonical path did NOT execute topic alternatives/bundles.
      canonicalExecution: {
        methodsExecuted: [method.kashfMethodId],
        altFormulaExecuted: false,
        topicSupportingChecksExecuted: false,
        topicBundleExecuted: false,
      },
    };
  } catch (err) {
    return {
      valid: false,
      status: 'error',
      kashfIntentId: method.kashfIntentId,
      kashfMethodId: method.kashfMethodId,
      kashfRuntimeStatus: method.kashfRuntimeStatus,
      verdict: null,
      overallPositive: null,
      reason: 'canonical-execution-error',
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Question-id entry point for the new Kashf path.
 * The hard-stop router runs before any board calculation is interpreted.
 */
export function buildKashfReadingByQuestionId(board, questionId, clientContext = {}) {
  let route;
  try {
    route = requireRunnableKashfRoute(questionId);
  } catch (err) {
    return err?.route || blockedResult({
      kashfMethodId: null,
      reason: 'route-blocked',
      userMessage: err instanceof Error ? err.message : String(err),
    });
  }

  return buildKashfReadingByMethod(board, route.kashfMethodId, {
    ...clientContext,
    questionId,
  });
}

export default {
  buildKashfReadingByMethod,
  buildKashfReadingByQuestionId,
};
