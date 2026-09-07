/**
 * kashf-canonical-reading-engine.js
 *
 * P0 canonical execution path for Kashf.
 * Executes exactly ONE method selected by kashfMethodId. It intentionally
 * does NOT execute topic altFormula/supportingChecks/dhamir extras.
 *
 * Formula methods and explicitly allowlisted method-scoped executors may run.
 * Every other execution kind stays hard-stopped until its exact executor is
 * implemented, source-audited, allowlisted, and enabled in the method registry.
 */

import {
  ROW,
  combineHouses,
  assembleFromRow,
  assembleFromFireRows,
  assembleFromAllRows,
  getFigureHebrewName,
  getHousePattern,
} from './kashf-formula-engine.js';
import { classifyCanonicalFigure } from './kashf-canonical-figure-classifier.js';
import { getTopicRules } from './kashf-topic-rules.js';
import { getKashfMethod } from '../registry/kashf-canonical-method-registry.js';
import { getKashfV57Knowledge } from '../registry/kashf-v57-knowledge-registry.js';
import { requireRunnableKashfRoute } from './kashf-method-router.js';
import {
  hasCanonicalLegacyExecutor,
  executeCanonicalLegacyMethod,
  hasCanonicalCustomExecutor,
  executeCanonicalCustomMethod,
} from './kashf-canonical-executors.js';

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
  executorStatus = 'not-applicable',
  reason,
  userMessage,
}) {
  return {
    valid: false,
    status: 'blocked',
    canRunKashf: false,
    verdict: null,
    overallPositive: null,
    kashfIntentId,
    kashfMethodId,
    kashfRuntimeStatus: status,
    executorStatus,
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

  const classification = classifyCanonicalFigure(resultPattern);
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

function buildLegacyFunctionReading(board, method, clientContext = {}, v57Knowledge) {
  const isLegacyExecutor = method.executionKind === 'legacy-function';
  const isCustomExecutor = method.executionKind === 'custom-engine';
  const executorApproved = isLegacyExecutor
    ? hasCanonicalLegacyExecutor(method.kashfMethodId)
    : isCustomExecutor
      ? hasCanonicalCustomExecutor(method.kashfMethodId)
      : false;

  if (!executorApproved) {
    return blockedResult({
      kashfMethodId: method.kashfMethodId,
      kashfIntentId: method.kashfIntentId,
      status: method.kashfRuntimeStatus,
      executorStatus: method.executorStatus,
      reason: isCustomExecutor ? 'canonical-custom-executor-not-approved' : 'canonical-legacy-executor-not-approved',
      userMessage: 'המבצע המדויק של שיטה זו לא אושר במפורש לנתיב הקנוני.',
    });
  }

  try {
    const executorResult = isCustomExecutor
      ? executeCanonicalCustomMethod(method.kashfMethodId, board)
      : executeCanonicalLegacyMethod(method.kashfMethodId, board);
    if (!executorResult || typeof executorResult !== 'object') {
      throw new Error('Approved canonical method-scoped executor returned no result');
    }

    const verdict = {
      text: executorResult.outputHebrew || 'ללא הכרעה מפורשת',
      positive: typeof executorResult.positive === 'boolean' ? executorResult.positive : null,
    };
    const topicRules = method.legacyTopicId ? getTopicRules(method.legacyTopicId) : null;
    const houses = Array.isArray(executorResult.housesUsed)
      ? [...executorResult.housesUsed]
      : method.kashfMethodId === 'profession.p254.h9Planet'
        ? [9, 10, 11]
        : method.kashfMethodId === 'illness.bodyPart.h6Figure'
          ? [6]
          : method.kashfMethodId === 'theft.p225.thiefDescriptionH7'
            ? [7]
            : method.kashfMethodId === 'pregnancy.p191.existsH5SilentEmpty'
              ? [5]
              : method.kashfMethodId === 'pregnancy.p191.genderH5'
                ? [5]
                : [];
    const result = {
      type: method.executionKind,
      executorResult,
      ...(isLegacyExecutor ? { legacyResult: executorResult } : {}),
    };
    const primaryFormula = {
      type: method.executionKind,
      houses,
      result,
      verdict,
      sourceText: v57Knowledge.v57.hebrewRule,
    };

    return {
      valid: true,
      status: 'ok',
      canRunKashf: true,
      kashfIntentId: method.kashfIntentId,
      kashfMethodId: method.kashfMethodId,
      kashfRuntimeStatus: method.kashfRuntimeStatus,
      executorStatus: method.executorStatus,
      methodRole: method.methodRole,
      knowledgeLanguage: 'he',
      hebrewKnowledge: v57Knowledge.v57,
      v57Knowledge,
      topicId: method.topicId || method.legacyTopicId,
      topicHebrewName: topicRules?.topicHebrewName || method.kashfIntentId,
      topicDescription: topicRules?.topicDescription || '',
      sourceRef: 'חשיפת הסודות הנצורים v57, עמ׳ ' + v57Knowledge.v57.page,
      primaryFormula,
      altFormula: null,
      supportingFindings: [],
      keyHouseReadings: [],
      boardValidation: board?.boardValidation || { isValid: true, warnings: [] },
      dhamir: null,
      dhamirType4External: null,
      dhamirExtras: null,
      witnessTestimony: null,
      source: {
        sourceVolume: method.sourceVolume,
        sourcePages: method.sourcePages,
        sourceLayer: method.sourceLayer,
        attributedSourceBook: method.attributedSourceBook,
        sourceConfidence: method.sourceConfidence,
        operationalKnowledge: {
          language: 'he',
          role: 'operational-primary',
          version: v57Knowledge.v57.version,
          indexFile: v57Knowledge.v57.indexFile,
          draftFile: v57Knowledge.v57.draftFile,
          page: v57Knowledge.v57.page,
          anchor: v57Knowledge.v57.anchor,
        },
        verificationSource: {
          language: 'ar',
          role: v57Knowledge.arabicVerification.role,
          pages: [...v57Knowledge.arabicVerification.pages],
        },
      },
      clientContext: {
        name: clientContext.name || '',
        question: clientContext.question || '',
        age: clientContext.age || '',
        gender: clientContext.gender || '',
        maritalStatus: clientContext.maritalStatus || null,
        workStatus: clientContext.workStatus || null,
        hasChildren: clientContext.hasChildren || null,
        parentName: clientContext.parentName || '',
        quesitedName: clientContext.quesitedName || '',
        phone: clientContext.phone || '',
        dynFields: clientContext.dynFields || {},
      },
      formula: {
        type: method.executionKind,
        houses,
        sourceText: v57Knowledge.v57.hebrewRule,
        result,
      },
      verdict,
      overallPositive: verdict.positive,
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
      canRunKashf: false,
      kashfIntentId: method.kashfIntentId,
      kashfMethodId: method.kashfMethodId,
      kashfRuntimeStatus: method.kashfRuntimeStatus,
      executorStatus: method.executorStatus,
      verdict: null,
      overallPositive: null,
      reason: 'canonical-execution-error',
      error: err instanceof Error ? err.message : String(err),
    };
  }
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

  // Source/method readiness and executor readiness are separate facts.
  // A source-ready method with no canonical executor must not masquerade as
  // runnable and must not fall back to its broad legacy topic bundle.
  if (method.kashfRuntimeStatus === 'ready' && method.executorStatus !== 'ready') {
    return blockedResult({
      kashfMethodId,
      kashfIntentId: method.kashfIntentId,
      status: method.kashfRuntimeStatus,
      executorStatus: method.executorStatus,
      reason: 'executor-pending',
      userMessage: 'השיטה מאומתת במקור, אך המבצע הקנוני שלה עדיין לא חובר לנתיב החדש.',
    });
  }

  if (method.methodRole !== 'canonical-operational' || method.runtimeAllowed !== true || method.kashfRuntimeStatus !== 'ready') {
    return blockedResult({
      kashfMethodId,
      kashfIntentId: method.kashfIntentId,
      status: method.kashfRuntimeStatus,
      executorStatus: method.executorStatus,
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

  const v57Knowledge = getKashfV57Knowledge(method.kashfMethodId);
  if (!v57Knowledge) {
    return blockedResult({
      kashfMethodId: method.kashfMethodId,
      kashfIntentId: method.kashfIntentId,
      status: method.kashfRuntimeStatus,
      executorStatus: method.executorStatus,
      reason: 'v57-knowledge-missing',
      userMessage: 'השיטה מוכנה לחישוב אך חסר לה עוגן ידע עברי v57; ההפעלה נחסמה כדי שה-AI לא יסתמך על מקור שאינו שכבת הידע העברית הקנונית.',
    });
  }

  if (method.executionKind === 'legacy-function'
      || (method.executionKind === 'custom-engine' && hasCanonicalCustomExecutor(method.kashfMethodId))) {
    return buildLegacyFunctionReading(board, method, clientContext, v57Knowledge);
  }
  if (method.executionKind !== 'formula') {
    return blockedResult({
      kashfMethodId,
      kashfIntentId: method.kashfIntentId,
      status: method.kashfRuntimeStatus,
      executorStatus: method.executorStatus,
      reason: 'canonical-executor-not-enabled',
      userMessage: 'סוג המבצע הקנוני של השיטה עדיין אינו נתמך בנתיב P0.',
    });
  }

  if (!method.legacyTopicId || !method.legacyFormulaSlot) {
    return blockedResult({
      kashfMethodId,
      kashfIntentId: method.kashfIntentId,
      status: method.kashfRuntimeStatus,
      executorStatus: method.executorStatus,
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
      executorStatus: method.executorStatus,
      reason: 'legacy-formula-not-found',
      userMessage: 'נוסחת המקור שהשיטה מפנה אליה אינה זמינה.',
    });
  }

  try {
    const result = executeFormula(board, formula);
    const verdict = interpretFormula(result, formula);
    const primaryFormula = {
      type: formula.type,
      houses: [...(formula.houses || [])],
      result,
      verdict,
      sourceText: v57Knowledge.v57.hebrewRule,
    };

    return {
      valid: true,
      status: 'ok',
      canRunKashf: true,
      kashfIntentId: method.kashfIntentId,
      kashfMethodId: method.kashfMethodId,
      kashfRuntimeStatus: method.kashfRuntimeStatus,
      executorStatus: method.executorStatus,
      methodRole: method.methodRole,
      knowledgeLanguage: 'he',
      hebrewKnowledge: v57Knowledge.v57,
      v57Knowledge,

      // Legacy-renderer compatibility fields. They contain ONLY the selected
      // canonical method; alternative/topic-bundle fields are deliberately
      // empty so the existing writer cannot accidentally render them.
      topicId: method.topicId || method.legacyTopicId,
      topicHebrewName: topicRules.topicHebrewName || method.kashfIntentId,
      topicDescription: topicRules.topicDescription || '',
      sourceRef: `חשיפת הסודות הנצורים v57, עמ׳ ${v57Knowledge.v57.page}` ,
      primaryFormula,
      altFormula: null,
      supportingFindings: [],
      keyHouseReadings: [],
      boardValidation: board?.boardValidation || { isValid: true, warnings: [] },
      dhamir: null,
      dhamirType4External: null,
      dhamirExtras: null,
      witnessTestimony: null,

      source: {
        sourceVolume: method.sourceVolume,
        sourcePages: method.sourcePages,
        sourceLayer: method.sourceLayer,
        attributedSourceBook: method.attributedSourceBook,
        sourceConfidence: method.sourceConfidence,
        operationalKnowledge: {
          language: 'he',
          role: 'operational-primary',
          version: v57Knowledge.v57.version,
          indexFile: v57Knowledge.v57.indexFile,
          draftFile: v57Knowledge.v57.draftFile,
          page: v57Knowledge.v57.page,
          anchor: v57Knowledge.v57.anchor,
        },
        verificationSource: {
          language: 'ar',
          role: v57Knowledge.arabicVerification.role,
          pages: [...v57Knowledge.arabicVerification.pages],
        },
      },
      clientContext: {
        name: clientContext.name || '',
        question: clientContext.question || '',
        age: clientContext.age || '',
        gender: clientContext.gender || '',
        maritalStatus: clientContext.maritalStatus || null,
        workStatus: clientContext.workStatus || null,
        hasChildren: clientContext.hasChildren || null,
        parentName: clientContext.parentName || '',
        quesitedName: clientContext.quesitedName || '',
        phone: clientContext.phone || '',
        dynFields: clientContext.dynFields || {},
      },

      // Canonical-native aliases for future writers.
      formula: {
        type: formula.type,
        houses: [...(formula.houses || [])],
        sourceText: v57Knowledge.v57.hebrewRule,
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
      canRunKashf: false,
      kashfIntentId: method.kashfIntentId,
      kashfMethodId: method.kashfMethodId,
      kashfRuntimeStatus: method.kashfRuntimeStatus,
      executorStatus: method.executorStatus,
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
    const blockedRoute = err?.route;
    if (blockedRoute) {
      return blockedResult({
        kashfMethodId: blockedRoute.kashfMethodId,
        kashfIntentId: blockedRoute.kashfIntentId,
        status: blockedRoute.kashfRuntimeStatus,
        executorStatus: blockedRoute.executorStatus,
        reason: blockedRoute.reason,
        userMessage: blockedRoute.userMessage,
      });
    }
    return blockedResult({
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
