// supabase/functions/oren-smart-advisor/goral_qa_mock_evaluator.ts
//
// Adapter מקומי, בתוך תיקיית-הפונקציה עצמה — deploy-safe, בלי ייבוא
// חוצה-ריפו. MOCK בלבד (בינת היכל החכמה: Goral QA Evaluator), עדיין אין
// AI חי. פורט-נאמן (לא-שכפול-לוגיקה-חכמה, רק אותה טרנספורמציה דטרמיניסטית
// פשוטה) של goral-hachol/qa/goral-qa-ai-evaluator-mock.js — ה-runner
// המקומי ממשיך-להשתמש-בקובץ-המקורי-ההוא; הקובץ הזה משמש **רק** את
// ה-Edge Function, כדי שלא-תהיה-תלות בייבוא מחוץ לתיקיית-הפונקציה.
//
// ראו HALL_WISDOM_GORAL_QA_EDGE_MOCK_PRECOMMIT_REPORT.md לפרטי-ההחלטה.

interface DeterministicFinding {
  scenarioId: string;
  section: string;
  description: string;
  evidence: string;
  severity: 'low' | 'medium' | 'high';
}

interface QaScenario {
  id: string;
  category?: string;
  method: string;
  topicId: string;
  question: string;
}

interface CollectedOutput {
  scenarioId: string;
  sourceRulesApplied?: unknown[];
}

interface QaEvaluatorPayload {
  qaRunSummary?: { totalScenarios?: number; crashed?: number; scenariosWithProblems?: number; totalDeterministicProblems?: number };
  scenarios: QaScenario[];
  collectedOutputs: CollectedOutput[];
  deterministicFindings?: DeterministicFinding[];
}

const RECOMMENDED_FILES_BY_SECTION: Record<string, string> = {
  dhamir: 'goral-hachol/engine/goral-rule-applicability.js',
  'dhamirExtras.timing': 'goral-hachol/engine/goral-rule-applicability.js',
  'dhamirExtras.temperament': 'goral-hachol/engine/goral-rule-applicability.js',
  keyHouses: 'goral-hachol/engine/kashf-reading-engine.js',
  supportingFindings: 'goral-hachol/engine/kashf-narrative-writer.js',
  'verdict-contradiction': 'goral-hachol/engine/kashf-narrative-writer.js',
};

function severityRank(sev: string): number {
  return ({ high: 3, medium: 2, low: 1 } as Record<string, number>)[sev] || 0;
}

function summarizeSeverity(problems: DeterministicFinding[]): 'low' | 'medium' | 'high' {
  if (!problems.length) return 'low';
  const max = problems.reduce((m, p) => Math.max(m, severityRank(p.severity)), 0);
  return max === 3 ? 'high' : max === 2 ? 'medium' : 'low';
}

/**
 * MOCK בלבד — אינו קורא ל-Anthropic/OpenAI בשום-אופן, לא-כרגע ולא-כ-fallback.
 * מחזיר את אותה סכימה בדיוק כמו evaluateQaRunMock המקומי (goral-hachol/qa/).
 */
export function evaluateQaRunMockEdge(payload: QaEvaluatorPayload) {
  const qaRunSummary = payload.qaRunSummary || {};
  const scenarios = payload.scenarios || [];
  const collectedOutputs = payload.collectedOutputs || [];
  const deterministicFindings = payload.deterministicFindings || [];

  const scenarioFindings = scenarios.map((s) => {
    const scenarioProblems = deterministicFindings.filter((f) => f.scenarioId === s.id);
    return {
      scenarioId: s.id,
      method: s.method,
      topicId: s.topicId,
      summary: scenarioProblems.length
        ? `MOCK — נמצאו ${scenarioProblems.length} ממצא/ים דטרמיניסטי/ים לתרחיש זה (ראו detectedProblems).`
        : 'MOCK — אין ממצא דטרמיניסטי לתרחיש זה. שיפוט-סמנטי אמיתי דורש AI חי, לא בוצע כאן.',
      ok: scenarioProblems.length === 0,
    };
  });

  const detectedProblems = deterministicFindings;
  const severity = summarizeSeverity(detectedProblems);

  const filesToInspect = Array.from(
    new Set(detectedProblems.map((p) => RECOMMENDED_FILES_BY_SECTION[p.section]).filter(Boolean))
  );

  const codeInstructionForClaude = detectedProblems.length
    ? {
        needed: true,
        instruction: `MOCK — ${detectedProblems.length} בעיה/ות דטרמיניסטית/ות נמצאה/ו ב-${qaRunSummary.totalScenarios ?? scenarios.length} תרחישים. ראו detectedProblems לפירוט מלא לפני כל תיקון.`,
        filesToInspect: filesToInspect.length ? filesToInspect : ['(לא מופה אוטומטית)'],
        filesNotToTouch: ['cartomancy/**', 'goral-hachol/engine/goral-spiritual-diagnostics-engine.js', 'supabase/functions/**'],
        testsToRun: ['node goral-hachol/qa/goral-qa-runner.mjs', 'node _test_goral_rule_applicability.mjs'],
      }
    : { needed: false, instruction: '', filesToInspect: [] as string[], filesNotToTouch: [] as string[], testsToRun: [] as string[] };

  const sourceRuleConcerns = collectedOutputs
    .filter((c) => !c.sourceRulesApplied || c.sourceRulesApplied.length === 0)
    .map((c) => ({
      scenarioId: c.scenarioId,
      concern: 'MOCK — אין sourceRulesApplied בקלט לתרחיש זה; לא ניתן לשפוט נאמנות-למקור בלי AI אמיתי.',
    }));

  return {
    overallDiagnosis:
      `MOCK (אין AI חי מחובר) — ${qaRunSummary.totalScenarios ?? scenarios.length} תרחישים נבדקו, ` +
      `${qaRunSummary.totalDeterministicProblems ?? detectedProblems.length} בעיות דטרמיניסטיות נמצאו. ` +
      'שכבת-שיפוט-סמנטית אמיתית עדיין לא מחוברת.',
    scenarioFindings,
    detectedProblems,
    severity,
    irrelevantSections: [] as unknown[],
    missingRelevantSections: [] as unknown[],
    advisorOnlyLeaks: [] as unknown[],
    clientOutputProblems: [] as unknown[],
    sourceRuleConcerns,
    recommendedFixes: detectedProblems.length
      ? ['MOCK — ראו codeInstructionForClaude ו-detectedProblems לתיקונים מוצעים.']
      : ([] as string[]),
    codeInstructionForClaude,
    testsToAdd: detectedProblems.length
      ? ['MOCK — הוסף/עדכן בדיקת-רגרסיה עבור כל תרחיש עם ממצא, לפני כל תיקון.']
      : ([] as string[]),
    needsOrenDecision: detectedProblems.length > 0,
    confidence: 'low' as const,
  };
}

export default { evaluateQaRunMockEdge };
