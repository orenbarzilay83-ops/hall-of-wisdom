/**
 * goral-decision-brain.js
 *
 * Deterministic decision layer for Oren Smart Advisor — Goral Knowledge +
 * Decision Brain (Phase 4). Given one already-collected engine output
 * (same shape as goral-qa-output-collector.js::collectScenarioOutput),
 * classifies the question, compares what the engine actually did against
 * what the knowledge registry + applicability matrix say it should do, and
 * returns a structured diagnosis.
 *
 * This is NOT AI. It is a rich, deterministic ground-truth layer meant to
 * feed a future AI evaluator (goral-qa-ai-payload-builder.js) with
 * pre-computed facts instead of asking the AI to re-derive them from raw HTML.
 *
 * Read-only: never mutates engineReading/clientOutput/advisorData.
 */

import { classifyQuestionType, getQuestionType } from './goral-question-taxonomy.js';
import { getApplicability, RULE_CATEGORIES } from './goral-rule-applicability-matrix.js';
import { RUBRIC_DIMENSIONS, getAllRubricDimensionIds } from './goral-output-quality-rubric.js';
import { HOUSE_NAMES } from '../engine/kashf-reading-engine.js';

// Same literal markers as goral-qa-deterministic-checks.js (kept in sync deliberately —
// both files read real, existing outputHebrew strings from kashf-pending-extraction.js /
// kashf-narrative-writer.js, not invented text).
const DHAMIR_MARKER = 'מחשבת השואל';
const TIMING_MARKER = 'עיתוי צפוי:';
const TEMPERAMENT_MARKER = 'טבע השואל:';
const NO_APPLICABILITY_MARKER = 'אין לכלל זה תחולה';
const CODE_LEAK_TERMS = ['dakhal-kharij', 'legacy-fn', 'checkType', 'fnName', 'row-assemble', 'undefined', 'NaN'];
const UNCERTAINTY_TEXT_HINTS = ['אזהר', 'ייתכן', 'לא ודאי', 'אינו ודאי', 'יש לקחת בחשבון', 'בדיקת אימות נוספת'];
const PHONE_LIKE_PATTERN = /0\d{1,2}-?\d{7}/;

const SEVERITY_RANK = { none: 0, low: 1, medium: 2, high: 3 };

function maxSeverity(a, b) {
  return SEVERITY_RANK[a] >= SEVERITY_RANK[b] ? a : b;
}

function detectRuleCategories({ method, topicId, clientOutput, engineReading, sectionsShown }) {
  const detected = new Set();
  if ((clientOutput || '').trim().length > 0) {
    detected.add('houseMeanings');
    // clientWording is a property of the produced text itself (adequate wording exists),
    // not a separately-computed engine feature — presence of non-trivial client text is
    // the only deterministic signal available; actual wording *quality* needs AI review.
    detected.add('clientWording');
  }
  if (sectionsShown?.includes('dhamir') || (clientOutput || '').includes(DHAMIR_MARKER)) detected.add('dhamir');
  if ((clientOutput || '').includes(TIMING_MARKER)) detected.add('timing');
  if ((clientOutput || '').includes(TEMPERAMENT_MARKER)) detected.add('characterNature');
  // spiritual content is the primary content of this topicId — treat non-empty client
  // output as evidence it's present, same reasoning as houseMeanings/clientWording above.
  if (topicId === 'spiritualDiagnostics' && (clientOutput || '').trim().length > 0) detected.add('spiritual');

  if (method === 'kashf') {
    if (engineReading?.altFormula) detected.add('verificationRules');
    if (engineReading?.witnessTestimony) detected.add('witnessesJudge');
    if ((engineReading?.keyHouseReadings || []).some((h) => h.isFormulaOnly)) detected.add('formulaOnlyHouses');
  } else if (method === 'hawi') {
    if (engineReading?.judgeVerdict) detected.add('witnessesJudge');
    if (engineReading?.boardValidation) detected.add('verificationRules');
  }

  return [...detected];
}

function computeMissingAndIrrelevant({ questionTypeId, method, detectedRuleCategories }) {
  const missingRequiredRules = [];
  const irrelevantAppliedRules = [];
  const advisorOnlyLeaks = [];

  for (const category of RULE_CATEGORIES) {
    const applicability = getApplicability(questionTypeId, method, category);
    const isDetected = detectedRuleCategories.includes(category);

    if (applicability === 'required' && !isDetected) {
      missingRequiredRules.push(category);
    }
    if (applicability === 'forbidden' && isDetected) {
      irrelevantAppliedRules.push(category);
    }
    if (applicability === 'advisorOnly' && isDetected) {
      advisorOnlyLeaks.push(category);
    }
  }

  return { missingRequiredRules, irrelevantAppliedRules, advisorOnlyLeaks };
}

function checkFormulaRoleLabelProblems({ method, engineReading, clientOutput }) {
  const problems = [];
  if (method !== 'kashf') return problems;
  const keyHouseReadings = engineReading?.keyHouseReadings || [];
  for (const h of keyHouseReadings) {
    if (!h.isFormulaOnly) continue;
    const topicalName = HOUSE_NAMES[h.houseNum];
    if (topicalName && (clientOutput || '').includes(topicalName)) {
      problems.push({
        houseNum: h.houseNum,
        topicalNameLeaked: topicalName,
        description: `בית ${h.houseNum} הוא formula-only אך הכותרת הנושאית ("${topicalName}") עדיין מופיעה בפלט`,
      });
    }
  }
  if ((clientOutput || '').includes(NO_APPLICABILITY_MARKER)) {
    problems.push({
      houseNum: null,
      topicalNameLeaked: null,
      description: 'סעיף legacy-fn ללא-תחולה ("אין לכלל זה תחולה") מופיע בפלט במקום להיות מוסתר',
    });
  }
  return problems;
}

function checkContradictionProblems({ method, engineReading, clientOutput }) {
  const problems = [];
  if (method !== 'kashf') return problems;
  const overallPositive = engineReading?.overallPositive;
  const altPositive = engineReading?.altFormula?.verdict?.positive;
  if (typeof overallPositive !== 'boolean' || typeof altPositive !== 'boolean') return problems;
  if (overallPositive === altPositive) return problems;
  if (!(clientOutput || '').includes('בדיקת אימות נוספת')) {
    problems.push({
      description: 'primaryFormula ו-altFormula חלוקים (positive שונה) והסתירה לא מוצגת ללקוח',
      overallPositive,
      altPositive,
    });
  }
  return problems;
}

function checkUncertaintyProblems({ warnings, clientOutput }) {
  const problems = [];
  if (!warnings || warnings.length === 0) return problems;
  const hasHint = UNCERTAINTY_TEXT_HINTS.some((hint) => (clientOutput || '').includes(hint));
  if (!hasHint) {
    problems.push({
      description: 'יש warnings מהמנוע (boardValidation) אך אין להם כל ביטוי-ניסוחי בפלט ללקוח',
      warningCount: warnings.length,
    });
  }
  return problems;
}

function checkPrivacyProblems({ clientOutput }) {
  const problems = [];
  const clientText = clientOutput || '';
  if (PHONE_LIKE_PATTERN.test(clientText)) {
    problems.push({ description: 'תבנית-דמוית-טלפון נמצאה בפלט ללקוח', section: 'clientOutput' });
  }
  return problems;
}

function computeRubricScores({
  formulaRoleLabelProblems,
  irrelevantAppliedRules,
  sourceRulesApplied,
  clientOutput,
  missingRequiredRules,
  advisorOnlyLeaks,
  contradictionProblems,
  uncertaintyProblems,
  privacyProblems,
}) {
  const hasContent = (clientOutput || '').trim().length > 0;
  const hasCodeLeak = CODE_LEAK_TERMS.some((term) => (clientOutput || '').includes(term));

  const scores = {
    relevanceToQuestion: 4 - Math.min(4, formulaRoleLabelProblems.length + irrelevantAppliedRules.length),
    sourceFaithfulness: hasContent && sourceRulesApplied.length === 0 ? 1 : 4,
    ruleApplicability: 4 - Math.min(4, missingRequiredRules.length + irrelevantAppliedRules.length),
    internalConsistency: contradictionProblems.length > 0 ? 1 : 4,
    clientClarity: hasCodeLeak ? 1 : 4,
    advisorOnlyLeakage: 4 - Math.min(4, advisorOnlyLeaks.length * 2),
    unsupportedClaims: hasContent && sourceRulesApplied.length === 0 ? 1 : 4,
    contradictionHandling: contradictionProblems.length > 0 ? 1 : 4,
    uncertaintyHandling: uncertaintyProblems.length > 0 ? 2 : 4,
    safetyAndPrivacy: privacyProblems.length > 0 ? 0 : 4,
    professionalTone: 4, // not measurable deterministically — always flagged for AI review below
    actionability: hasContent ? 4 : 0,
  };

  for (const id of getAllRubricDimensionIds()) {
    if (!(id in scores)) scores[id] = 4;
  }
  return scores;
}

function buildRecommendedFixes({
  missingRequiredRules,
  irrelevantAppliedRules,
  advisorOnlyLeaks,
  formulaRoleLabelProblems,
  contradictionProblems,
  uncertaintyProblems,
  privacyProblems,
}) {
  const fixes = [];
  if (missingRequiredRules.length) fixes.push(`הוסף טיפול בקטגוריות החסרות: ${missingRequiredRules.join(', ')}`);
  if (irrelevantAppliedRules.length) fixes.push(`הסר/הסתר קטגוריות לא-רלוונטיות: ${irrelevantAppliedRules.join(', ')}`);
  if (advisorOnlyLeaks.length) fixes.push(`חסום דליפת advisorOnly: ${advisorOnlyLeaks.join(', ')}`);
  if (formulaRoleLabelProblems.length) fixes.push('תקן תיוג בתי formula-only שמציגים כותרת נושאית שגויה');
  if (contradictionProblems.length) fixes.push('הצג במפורש התראת-סתירה בין primaryFormula ל-altFormula');
  if (uncertaintyProblems.length) fixes.push('שקף warnings/אי-ודאות בניסוח הטקסט ללקוח');
  if (privacyProblems.length) fixes.push('הסר מידע רגיש/דמוי-טלפון מהפלט ללקוח');
  return fixes;
}

/**
 * @param {object} input
 * @param {'kashf'|'hawi'} input.method
 * @param {string} input.topicId
 * @param {string} input.question
 * @param {string} [input.questionType] - pre-classified id from goral-question-taxonomy.js; auto-classified if omitted
 * @param {object} input.engineReading - raw reading/result (collected.raw)
 * @param {string} input.clientOutput - clientOutputHtml
 * @param {*} input.advisorData - advisorOnlyOutput
 * @param {string[]} [input.sectionsShown]
 * @param {string[]} [input.sectionsHidden]
 * @param {string[]} [input.sourceRulesApplied]
 * @param {string[]} [input.warnings]
 */
export function evaluateReading(input) {
  const {
    method,
    topicId,
    question,
    engineReading = {},
    clientOutput = '',
    advisorData = null,
    sectionsShown = [],
    sectionsHidden = [],
    sourceRulesApplied = [],
    warnings = [],
  } = input;

  const classification = input.questionType
    ? { questionTypeId: input.questionType, confidence: 'provided', matchedKeywordCount: null }
    : classifyQuestionType(question, { topicId });
  const questionTypeId = classification.questionTypeId;
  const questionTypeDef = getQuestionType(questionTypeId);

  const expectedRuleCategories = RULE_CATEGORIES.filter(
    (cat) => getApplicability(questionTypeId, method, cat) === 'required'
  );
  const detectedRuleCategories = detectRuleCategories({ method, topicId, clientOutput, engineReading, sectionsShown });
  const { missingRequiredRules, irrelevantAppliedRules, advisorOnlyLeaks } = computeMissingAndIrrelevant({
    questionTypeId,
    method,
    detectedRuleCategories,
  });

  const forbiddenClientSections = (questionTypeDef?.forbiddenClientSections || []).filter((section) => {
    if (section === 'dhamir') return detectedRuleCategories.includes('dhamir');
    if (section === 'timing') return detectedRuleCategories.includes('timing');
    if (section === 'characterNature') return detectedRuleCategories.includes('characterNature');
    return false;
  });

  const formulaRoleLabelProblems = checkFormulaRoleLabelProblems({ method, engineReading, clientOutput });
  const contradictionProblems = checkContradictionProblems({ method, engineReading, clientOutput });
  const uncertaintyProblems = checkUncertaintyProblems({ warnings, clientOutput });
  const privacyProblems = checkPrivacyProblems({ clientOutput });

  const rubricScores = computeRubricScores({
    formulaRoleLabelProblems,
    irrelevantAppliedRules,
    sourceRulesApplied,
    clientOutput,
    missingRequiredRules,
    advisorOnlyLeaks,
    contradictionProblems,
    uncertaintyProblems,
    privacyProblems,
  });

  let overallSeverity = 'none';
  if (missingRequiredRules.length || irrelevantAppliedRules.length || formulaRoleLabelProblems.length) {
    overallSeverity = maxSeverity(overallSeverity, 'medium');
  }
  if (advisorOnlyLeaks.length || contradictionProblems.length || privacyProblems.length || forbiddenClientSections.length) {
    overallSeverity = maxSeverity(overallSeverity, 'high');
  }
  if (uncertaintyProblems.length) {
    overallSeverity = maxSeverity(overallSeverity, 'low');
  }

  const recommendedFixes = buildRecommendedFixes({
    missingRequiredRules,
    irrelevantAppliedRules,
    advisorOnlyLeaks,
    formulaRoleLabelProblems,
    contradictionProblems,
    uncertaintyProblems,
    privacyProblems,
  });

  const needsAiReview =
    overallSeverity !== 'none' ||
    rubricScores.professionalTone < 4 ||
    rubricScores.clientClarity < 4 ||
    rubricScores.actionability < 4 ||
    classification.confidence !== 'provided';

  return {
    questionType: questionTypeId,
    questionTypeClassification: classification,
    expectedRuleCategories,
    detectedRuleCategories,
    missingRequiredRules,
    irrelevantAppliedRules,
    advisorOnlyLeaks,
    forbiddenClientSections,
    formulaRoleLabelProblems,
    contradictionProblems,
    uncertaintyProblems,
    privacyProblems,
    rubricScores,
    overallSeverity,
    recommendedFixes,
    needsAiReview,
  };
}

export default { evaluateReading };
