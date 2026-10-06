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
import { verifyKashfBoardStructuralIntegrity } from './raml-board-generator.js';
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
      ? executeCanonicalCustomMethod(method.kashfMethodId, board, clientContext)
      : executeCanonicalLegacyMethod(method.kashfMethodId, board);
    if (!executorResult || typeof executorResult !== 'object') {
      throw new Error('Approved canonical method-scoped executor returned no result');
    }

    const verdict = {
      // clientSafeHebrew (when an executor provides it) is a short, citation-free
      // rendering meant to be read to the client; outputHebrew carries the full
      // source-evidence trail (page citations, alternate-method markers, method
      // notes) for the advisor record. Executors that don't yet provide a
      // clientSafeHebrew keep falling back to outputHebrew unchanged.
      text: executorResult.clientSafeHebrew || executorResult.outputHebrew || 'ללא הכרעה מפורשת',
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
 *
 * The board-structural-integrity gate below always runs, unconditionally --
 * there is no parameter anywhere on this function (or on
 * buildKashfReadingByQuestionId) that can skip it. An earlier round
 * (2026-10-05/06) added a gate-skipping option plus a parallel pair of
 * "legacy fixture test" exports so this engagement's test suite could
 * keep using synthetic, non-reconstructed fixture boards without
 * weakening the real gate. On review that was itself a liability: the
 * bypass was reachable by name from any file that chose to import it (a
 * grep showing no CURRENT importer does not prevent a FUTURE one). It has
 * been removed entirely -- every test fixture that needed it was
 * convertible to a genuinely valid board instead (see the makeBoard-style
 * helpers across the _test_kashf_*.mjs suite, several of which now
 * auto-repair mother/daughter diagonal consistency for whichever side of
 * a pair a test does not explicitly override), with the small number of
 * genuinely mathematically-unreachable fixture combinations (proven by
 * exhaustive enumeration, not assumed) tested directly against the
 * executor instead of through this gated path. See
 * _test_kashf_board_validation_gate.mjs for the regression test that
 * would catch a bypass parameter being reintroduced here.
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

  const attributedReferenceOnly = method.attributedSourceBook !== 'Kashf'
    || method.sourceLayer !== 'body';
  if (attributedReferenceOnly) {
    return blockedResult({
      kashfMethodId: method.kashfMethodId,
      kashfIntentId: method.kashfIntentId,
      status: 'educational-only',
      executorStatus: method.executorStatus,
      reason: 'attributed-reference-only',
      userMessage: 'שיטה מיוחסת או חיצונית נשמרת לעיון בלבד ואינה משתתפת בפסיקה הקנונית.',
    });
  }

  // Structural board validity gate (applies to every method, before any
  // executor or formula runs): per raml-board-generator.js's validateBoard,
  // only a `critical` finding (currently: the Judge, house 15, must be an
  // even figure -- source: "הדיין (בית 15) חייב להיות זוג. אם לא -- הלוח
  // כולו פסול") means the source itself declares the WHOLE BOARD invalid
  // and requires re-casting. A `warning`-severity finding (Ras/Dhanab al-
  // Tinnin in house 1, or none of the four liar-exposing figures present)
  // is the source telling the reader to weigh it carefully or consider
  // re-casting -- advisory, not a stop -- and must not block a verdict.
  //
  // 2026-10-06 hardening (independent re-audit, flagged on review): this
  // gate originally (2026-10-05) trusted board?.boardValidation?.hasCritical
  // -- a flag computed once at board-creation time and then attached to the
  // board object. That flag can be missing, stale, or simply wrong for a
  // board that didn't pass through generateRamlEntriesFromMothers exactly
  // as constructed (hand-built test fixture, a board patched after
  // creation, a future alternate construction path) -- a caller could set
  // boardValidation: {isValid:true, hasCritical:false} (or omit it
  // entirely) on a board whose actual house patterns are internally
  // inconsistent or whose Judge is not actually even, and this gate would
  // have let it straight through to a client-facing verdict. Fixed by no
  // longer trusting that attached flag at all: verifyKashfBoardStructuralIntegrity
  // independently checks board.entries directly -- regardless of what
  // boardValidation claims or whether it is present at all. Precisely
  // (NOT "all 16 houses recomputed", which an earlier draft of this
  // comment overstated): house 15's own declared parity (p.34), and the
  // four daughter/mother diagonal digits -- house5/house1 fire,
  // house6/house2 air, house7/house3 water, house8/house4 earth (p.35).
  // Houses 9-14 and 16 (nieces, witnesses, the sentence house) are NOT
  // independently re-verified against their parents -- no equivalent
  // explicit source rule was found for them; see
  // _test_kashf_board_validation_gate.mjs for the proof this is a
  // deliberate, tested scope boundary, not a silent gap.
  const boardEntriesForIntegrity = Array.isArray(board)
    ? board
    : Array.isArray(board?.entries)
      ? board.entries
      : null;
  const structuralIntegrity = verifyKashfBoardStructuralIntegrity(boardEntriesForIntegrity);
  if (structuralIntegrity.hasCritical) {
    return blockedResult({
      kashfMethodId: method.kashfMethodId,
      kashfIntentId: method.kashfIntentId,
      status: method.kashfRuntimeStatus,
      executorStatus: method.executorStatus,
      reason: 'board-validation-critical',
      userMessage: 'הלוח פסול במפורש לפי המקור (למשל: הדיין בבית 15 אינו זוגי, או שבית-בת בלוח אינו תואם את האם המתאימה) — יש להטיל מחדש. לא ניתן למסור פסק קנוני על בסיס לוח זה.',
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

  if (method.kashfMethodId === 'hidden.p188.quarterDirection') {
    const casts = [1, 2, 3, 4].map(n => clientContext?.dynFields?.[`quarter${n}Pattern`]);
    if (casts.some(pattern => typeof pattern !== 'string' || !/^[12]{4}$/.test(pattern))) {
      return blockedResult({
        kashfMethodId: method.kashfMethodId,
        kashfIntentId: method.kashfIntentId,
        status: method.kashfRuntimeStatus,
        executorStatus: method.executorStatus,
        reason: 'four-independent-casts-required',
        userMessage: 'לפי כשף עמ׳ 188 יש להזין ארבע צורות תקינות מהטלות עצמאיות, אחת לכל רבע במקום החשוד. אין להסיק אותן מארבע האמהות או מבתי הלוח.',
      });
    }
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
 * Delegates to buildKashfReadingByMethod, so the board-structural-integrity
 * gate there always runs for this path too, unconditionally.
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
