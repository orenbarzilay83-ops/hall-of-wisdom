/**
 * goral-qa-ai-payload-builder.js
 *
 * בונה את ה-payload ל-Goral QA Evaluator (ai/prompts/hall-wisdom-goral-qa-evaluator.prompt.md)
 * מתוך תוצאות goral-qa-runner.js (run()). פונקציה טהורה — לא AI, לא רשת,
 * לא שינוי-מנוע. אוכפת הפרדת-פרטיות: phone/dynFields-גולמי/clientHistorySummary
 * לעולם לא נכנסים ל-payload, גם אם ישנם בעתיד בתרחיש (kashf-context-sanitizer.js
 * הוא התקדים לעיקרון הזה בקוד הקיים — כאן נאכף באופן דומה, ברמת ה-payload).
 */

const SENSITIVE_KEYS = ['phone', 'dynFields', 'clientHistorySummary'];

function sanitizeForAi(collected) {
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
