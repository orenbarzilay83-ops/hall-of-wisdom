/**
 * goral-qa-ai-payload-builder.js
 *
 * בונה את ה-payload ל-Goral QA Evaluator (ai/prompts/hall-wisdom-goral-qa-evaluator.prompt.md)
 * מתוך תוצאות goral-qa-runner.js (run()). פונקציה טהורה — לא AI, לא רשת,
 * לא שינוי-מנוע. אוכפת הפרדת-פרטיות: phone/dynFields-גולמי/clientHistorySummary
 * לעולם לא נכנסים ל-payload, גם אם ישנם בעתיד בתרחיש (kashf-context-sanitizer.js
 * הוא התקדים לעיקרון הזה בקוד הקיים — כאן נאכף באופן דומה, ברמת ה-payload).
 *
 * Phase 4: כולל גם ground-truth מ-Decision Brain (goral-hachol/brain/) —
 * classifiedQuestionType/applicableRuleMatrix/decisionBrainFindings/rubricScores/
 * missingKnowledgeReferences/sourceEvidencePointers — כדי שה-AI evaluator העתידי
 * יקבל עובדות מחושבות-מראש במקום לגזור אותן-לבד מ-HTML גולמי.
 */

import { RULE_CATEGORIES, getApplicability } from '../brain/goral-rule-applicability-matrix.js';
import {
  getRegistryEntriesForTopic,
  KASHF_RULES_WITHOUT_PAGE_MAP,
  KASHF_PAGE_MAP_WITHOUT_RULES,
} from '../brain/goral-knowledge-registry.js';

const SENSITIVE_KEYS = ['phone', 'dynFields', 'clientHistorySummary'];

function buildApplicableRuleMatrix(questionTypeId, method) {
  if (!questionTypeId) return null;
  const row = {};
  for (const category of RULE_CATEGORIES) {
    row[category] = getApplicability(questionTypeId, method, category);
  }
  return row;
}

function buildMissingKnowledgeReferences(method, topicId) {
  const refs = [];
  if (method === 'kashf' && KASHF_RULES_WITHOUT_PAGE_MAP.includes(topicId)) {
    refs.push(`kashf:${topicId} — יש כלל מנוע אך אין רשומת-עמוד ב-KASHF_TOPIC_PAGE_MAP`);
  }
  if (method === 'kashf' && KASHF_PAGE_MAP_WITHOUT_RULES.includes(topicId)) {
    refs.push(`kashf:${topicId} — יש עמוד ממופה אך אין כלל מנוע תואם ב-KASHF_TOPIC_RULES`);
  }
  return refs;
}

function buildSourceEvidencePointers(method, topicId) {
  return getRegistryEntriesForTopic(method, topicId).map((entry) => ({
    ruleId: entry.ruleId,
    file: entry.evidenceLocation.file,
    exportOrFunction: entry.evidenceLocation.exportOrFunction,
    confidence: entry.confidence,
  }));
}

function buildDecisionBrainFindings(brain) {
  if (!brain) return null;
  return {
    missingRequiredRules: brain.missingRequiredRules,
    irrelevantAppliedRules: brain.irrelevantAppliedRules,
    advisorOnlyLeaks: brain.advisorOnlyLeaks,
    forbiddenClientSections: brain.forbiddenClientSections,
    formulaRoleLabelProblems: brain.formulaRoleLabelProblems,
    contradictionProblems: brain.contradictionProblems,
    uncertaintyProblems: brain.uncertaintyProblems,
    privacyProblems: brain.privacyProblems,
    overallSeverity: brain.overallSeverity,
    recommendedFixes: brain.recommendedFixes,
    needsAiReview: brain.needsAiReview,
  };
}

function sanitizeForAi(collected) {
  const brain = collected.brainEvaluation || null;
  return {
    scenarioId: collected.scenarioId,
    method: collected.method,
    topicId: collected.topicId,
    category: collected.category,
    question: collected.question,
    clientOutputHtml: collected.clientOutputHtml || '',
    sectionsShown: collected.sectionsShown || [],
    sectionsHidden: collected.sectionsHidden || [],
    warnings: collected.warnings || [],
    sourceRulesApplied: collected.sourceRulesApplied || [],
    // board/advisorOnlyOutput/raw במפורש לא-נכללים — הם לא נחוצים לשיפוט
    // client-output, ועלולים לשאת בעתיד clientContext עשיר (phone/dynFields).
    classifiedQuestionType: brain?.questionType || null,
    applicableRuleMatrix: buildApplicableRuleMatrix(brain?.questionType, collected.method),
    decisionBrainFindings: buildDecisionBrainFindings(brain),
    rubricScores: brain?.rubricScores || null,
    missingKnowledgeReferences: buildMissingKnowledgeReferences(collected.method, collected.topicId),
    sourceEvidencePointers: buildSourceEvidencePointers(collected.method, collected.topicId),
  };
}

/**
 * @param {{results: Array, allProblems: Array, crashed: number}} qaRunResult - תוצר run() מ-goral-qa-runner.mjs
 * @returns {object} payload לפי Input Schema של hall-wisdom-goral-qa-evaluator.prompt.md
 */
export function buildQaEvaluatorPayload(qaRunResult) {
  const { results, allProblems, crashed } = qaRunResult;

  const scenarios = results.map((r) => ({
    id: r.scenario.id,
    category: r.scenario.category,
    method: r.scenario.method,
    topicId: r.scenario.topicId,
    question: r.scenario.question,
  }));

  const collectedOutputs = results
    .filter((r) => !r.crashed)
    .map((r) => sanitizeForAi(r.collected));

  const deterministicFindings = allProblems.map((p) => ({
    scenarioId: p.scenario.id,
    section: p.section,
    description: p.description,
    evidence: p.evidence,
    severity: p.severity,
  }));

  const payload = {
    qaRunSummary: {
      totalScenarios: results.length,
      crashed,
      scenariosWithProblems: results.filter((r) => r.problems.length > 0).length,
      totalDeterministicProblems: allProblems.length,
    },
    scenarios,
    collectedOutputs,
    deterministicFindings,
  };

  // בדיקת-שפיות: לוודא שאף שדה-רגיש לא הסתנן בטעות (defense-in-depth, מעבר
  // לכך ש-sanitizeForAi כבר לא מעתיק אותם כלל).
  const payloadJson = JSON.stringify(payload);
  const leaked = SENSITIVE_KEYS.filter((k) => payloadJson.includes(`"${k}"`));
  if (leaked.length) {
    throw new Error(`goral-qa-ai-payload-builder: שדות רגישים נמצאו ב-payload: ${leaked.join(', ')}`);
  }

  return payload;
}

export default { buildQaEvaluatorPayload };
