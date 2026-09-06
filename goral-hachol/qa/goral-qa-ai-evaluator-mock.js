/**
 * goral-qa-ai-evaluator-mock.js
 *
 * Local Mock Evaluator — Oren Smart Advisor: Goral QA Brain (שלב 3, בלי AI חי).
 * מקבלת payload (goral-qa-ai-payload-builder.js) ומחזירה JSON לפי אותה
 * סכימה בדיוק שה-AI האמיתי (עתידי) יחזיר — ראו
 * ai/prompts/hall-wisdom-goral-qa-evaluator.prompt.md §Output Schema.
 *
 * **MOCK מפורש:** לא AI, לא fetch, לא callAnthropic. לא ממציאה בעיות
 * סמנטיות חדשות — רק מעבירה-הלאה, בפורמט-הסכימה-הנכון, את מה שכבר נמצא
 * דטרמיניסטית (deterministicFindings בקלט). שדות שדורשים שיפוט-שפה אמיתי
 * (irrelevantSections/missingRelevantSections/advisorOnlyLeaks/
 * clientOutputProblems) נשארים ריקים בכוונה — אין AI שיכול למלא אותם כרגע.
 * המטרה: כשה-provider יוחלף ב-callAnthropic אמיתי (שלב 4, אחרי אישור
 * נפרד), רק הפונקציה הזו מוחלפת — הצרכן (goral-qa-ai-runner.mjs) נשאר זהה.
 */

function severityRank(sev) {
  return { high: 3, medium: 2, low: 1 }[sev] || 0;
}

function summarizeSeverity(problems) {
  if (!problems.length) return 'low';
  const max = problems.reduce((m, p) => Math.max(m, severityRank(p.severity)), 0);
  return max === 3 ? 'high' : max === 2 ? 'medium' : 'low';
}

const RECOMMENDED_FILES_BY_SECTION = {
  dhamir: 'goral-hachol/engine/goral-rule-applicability.js',
  'dhamirExtras.timing': 'goral-hachol/engine/goral-rule-applicability.js',
  'dhamirExtras.temperament': 'goral-hachol/engine/goral-rule-applicability.js',
  keyHouses: 'goral-hachol/engine/kashf-reading-engine.js',
  supportingFindings: 'goral-hachol/engine/kashf-narrative-writer.js',
  'verdict-contradiction': 'goral-hachol/engine/kashf-narrative-writer.js',
};

/**
 * @param {object} payload - תוצר buildQaEvaluatorPayload()
 * @returns {object} JSON לפי Output Schema (MOCK)
 */
export function evaluateQaRunMock(payload) {
  const { qaRunSummary, scenarios, collectedOutputs, deterministicFindings } = payload;

  const scenarioFindings = scenarios.map((s) => {
    const scenarioProblems = deterministicFindings.filter((f) => f.scenarioId === s.id);
    return {
      scenarioId: s.id,
      method: s.method,
      topicId: s.topicId,
      summary: scenarioProblems.length
        ? `MOCK — נמצאו ${scenarioProblems.length} ממצא/ים דטרמיניסטי/ים לתרחיש זה (ראו detectedProblems).`
        : 'MOCK — אין ממצא דטרמיניסטי לתרחיש זה. שיפוט-סמנטי אמיתי (האם התשובה עונה על השאלה) דורש AI חי, לא בוצע כאן.',
      ok: scenarioProblems.length === 0,
    };
  });

  const detectedProblems = deterministicFindings;
  const severity = summarizeSeverity(detectedProblems);

  const filesToInspect = [...new Set(
    detectedProblems.map((p) => RECOMMENDED_FILES_BY_SECTION[p.section]).filter(Boolean)
  )];

  const codeInstructionForClaude = detectedProblems.length
    ? {
        needed: true,
        instruction: `MOCK — ${detectedProblems.length} בעיה/ות דטרמיניסטית/ות נמצאה/ו ב-${qaRunSummary.totalScenarios} תרחישים. ראו detectedProblems לפירוט מלא לפני כל תיקון.`,
        filesToInspect: filesToInspect.length ? filesToInspect : ['(לא מופה אוטומטית)'],
        filesNotToTouch: ['cartomancy/**', 'goral-hachol/engine/goral-spiritual-diagnostics-engine.js', 'supabase/functions/**'],
        testsToRun: ['node goral-hachol/qa/goral-qa-runner.mjs', 'node _test_goral_rule_applicability.mjs'],
      }
    : { needed: false, instruction: '', filesToInspect: [], filesNotToTouch: [], testsToRun: [] };

  const sourceRuleConcerns = collectedOutputs
    .filter((c) => !c.sourceRulesApplied || c.sourceRulesApplied.length === 0)
    .map((c) => ({
      scenarioId: c.scenarioId,
      concern: 'MOCK — אין sourceRulesApplied בקלט לתרחיש זה; לא ניתן לשפוט נאמנות-למקור בלי AI אמיתי.',
    }));

  return {
    overallDiagnosis:
      `MOCK (אין AI חי מחובר) — ${qaRunSummary.totalScenarios} תרחישים נבדקו, ` +
      `${qaRunSummary.totalDeterministicProblems} בעיות דטרמיניסטיות נמצאו. ` +
      'שכבת-שיפוט-סמנטית אמיתית (האם התשובה עונה על השאלה, ניסוח מקצועי, סתירות עדינות) ' +
      'עדיין לא מחוברת — ראו testsToAdd/מה-חסר בדוח ה-Precommit.',
    scenarioFindings,
    detectedProblems,
    severity,
    irrelevantSections: [],       // דורש AI חי — לא זמין ב-mock
    missingRelevantSections: [],  // דורש AI חי — לא זמין ב-mock
    advisorOnlyLeaks: [],         // דורש AI חי — לא זמין ב-mock
    clientOutputProblems: [],     // דורש AI חי — לא זמין ב-mock
    sourceRuleConcerns,
    recommendedFixes: detectedProblems.length
      ? ['MOCK — ראו codeInstructionForClaude ו-detectedProblems לתיקונים מוצעים.']
      : [],
    codeInstructionForClaude,
    testsToAdd: detectedProblems.length
      ? ['MOCK — הוסף/עדכן בדיקת-רגרסיה עבור כל תרחיש עם ממצא, לפני כל תיקון.']
      : [],
    needsOrenDecision: detectedProblems.length > 0,
    confidence: 'low', // תמיד 'low' ב-mock — אין שיפוט סמנטי אמיתי מאחורי זה
  };
}

export default { evaluateQaRunMock };
