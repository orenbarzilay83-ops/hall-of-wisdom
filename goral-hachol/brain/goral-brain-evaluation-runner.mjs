#!/usr/bin/env node
/**
 * goral-brain-evaluation-runner.mjs
 *
 * Runs every scenario in GORAL_QA_SCENARIOS through the real engines
 * (via collectScenarioOutput), evaluates each with the deterministic
 * Decision Brain, and produces a coverage report:
 *   totalScenarios, questionTypeCoverage, methodCoverage, ruleCategoryCoverage,
 *   sourceCoverage, failuresBySeverity, missingKnowledgeEntries,
 *   ambiguousMappings, scenariosNeedingOrenDecision, codeInstructionForClaude
 *
 * This file is the concrete implementation of what Hall of Wisdom Core calls
 * the "Hall of Wisdom Knowledge Pipeline" — an architectural name only, for
 * the chain: Knowledge Registry -> Question Taxonomy -> Rule Applicability
 * Matrix -> Decision Engine -> reasoning-ready output. No file/API renaming
 * implied by that name (see HALL_WISDOM_CORE_ARCHITECTURE.md).
 *
 * Read-only: does not modify any engine, UI, or card. No AI, no network.
 */

import { GORAL_QA_SCENARIOS } from '../qa/goral-qa-scenarios.js';
import { collectScenarioOutput } from '../qa/goral-qa-output-collector.js';
import { evaluateReading } from './goral-decision-brain.js';
import { getAllQuestionTypeIds } from './goral-question-taxonomy.js';
import { KASHF_RULES_WITHOUT_PAGE_MAP, KASHF_PAGE_MAP_WITHOUT_RULES } from './goral-knowledge-registry.js';

export function run() {
  const results = [];
  const crashed = [];

  for (const scenario of GORAL_QA_SCENARIOS) {
    try {
      const collected = collectScenarioOutput(scenario);
      const brain = evaluateReading({
        method: collected.method,
        topicId: collected.topicId,
        question: collected.question,
        engineReading: collected.raw,
        clientOutput: collected.clientOutputHtml,
        advisorData: collected.advisorOnlyOutput,
        sectionsShown: collected.sectionsShown,
        sectionsHidden: collected.sectionsHidden,
        sourceRulesApplied: collected.sourceRulesApplied,
        warnings: collected.warnings,
      });
      results.push({ scenario, collected, brain });
    } catch (err) {
      crashed.push({ scenarioId: scenario.id, error: String(err?.message || err) });
    }
  }

  const totalScenarios = GORAL_QA_SCENARIOS.length;

  const methodCoverage = { kashf: 0, hawi: 0 };
  for (const s of GORAL_QA_SCENARIOS) methodCoverage[s.method] = (methodCoverage[s.method] || 0) + 1;

  const questionTypeCoverage = {};
  for (const id of getAllQuestionTypeIds()) questionTypeCoverage[id] = { kashf: 0, hawi: 0 };
  for (const { scenario, brain } of results) {
    if (!questionTypeCoverage[brain.questionType]) questionTypeCoverage[brain.questionType] = { kashf: 0, hawi: 0 };
    questionTypeCoverage[brain.questionType][scenario.method] += 1;
  }

  const ruleCategoryCoverage = {};
  for (const { brain } of results) {
    for (const cat of brain.detectedRuleCategories) {
      ruleCategoryCoverage[cat] = (ruleCategoryCoverage[cat] || 0) + 1;
    }
  }

  const sourceCoverage = { kashf: { withPageMap: 0, withoutPageMap: KASHF_RULES_WITHOUT_PAGE_MAP.length }, hawi: { withQuestionRuleFile: 0, withoutQuestionRuleFile: 0 } };
  for (const { scenario, collected } of results) {
    if (scenario.method === 'kashf') {
      if (!KASHF_RULES_WITHOUT_PAGE_MAP.includes(scenario.topicId)) sourceCoverage.kashf.withPageMap += 1;
    }
    if (scenario.method === 'hawi') {
      const hasSourceRules = (collected.sourceRulesApplied || []).length > 0;
      if (hasSourceRules) sourceCoverage.hawi.withQuestionRuleFile += 1;
      else sourceCoverage.hawi.withoutQuestionRuleFile += 1;
    }
  }

  const failuresBySeverity = { high: 0, medium: 0, low: 0, none: 0 };
  for (const { brain } of results) failuresBySeverity[brain.overallSeverity] += 1;

  const missingKnowledgeEntries = [
    ...KASHF_RULES_WITHOUT_PAGE_MAP.map((topicId) => `kashf:${topicId} — יש כלל מנוע (KASHF_TOPIC_RULES) אך אין רשומת-עמוד ב-KASHF_TOPIC_PAGE_MAP`),
    ...KASHF_PAGE_MAP_WITHOUT_RULES.map((topicId) => `kashf:${topicId} — יש עמוד ממופה ב-KASHF_TOPIC_PAGE_MAP אך אין כלל מנוע תואם ב-KASHF_TOPIC_RULES`),
  ];

  const ambiguousMappings = [
    'hiddenThoughtIntent: DHAMIR_CLIENT_VISIBLE_TOPICS ריק לגמרי בשתי השיטות — גם שאלת-כוונה-נסתרת מפורשת לא מקבלת תוכן-דהמיר ללקוח (ראו goral-question-taxonomy.js gapNote)',
    'timing: תוכן העיתוי מקונן בכרטיס-הדהמיר בלבד, אין נתיב-הצגה נפרד (ראו goral-question-taxonomy.js gapNote)',
    'personCharacter: checkTemperamentLeak מדלג רק על category==="loveIntention", לא על "personCharacter" — פער-בדיקה קיים (ראו goral-rule-applicability-matrix.js override note)',
    'workCareer: אין topicId ייעודי לעבודה/קריירה באף מקור — מיפוי מקורב ל-authorityState+commerce',
    'hawi spiritualDiagnostics: buildSpiritualNarrative מציג דהמיר ללא-תנאי (חריגה רשומה במטריצה, לא תוקנה לפי הנחיה קודמת "לא לגעת באבחון הרוחני")',
  ];

  const scenariosNeedingOrenDecision = results
    .filter(({ brain }) => brain.overallSeverity === 'high' || brain.overallSeverity === 'medium')
    .map(({ scenario, brain }) => ({ scenarioId: scenario.id, severity: brain.overallSeverity, recommendedFixes: brain.recommendedFixes }));

  const codeInstructionForClaude =
    missingKnowledgeEntries.length === 0 && scenariosNeedingOrenDecision.length === 0
      ? 'אין פערים דורשי-פעולה בהרצה זו — אין צורך בשינוי קוד.'
      : 'אל תתקן מנועים/UI/קלפים על סמך הדוח הזה לבד — כל פריט ב-missingKnowledgeEntries/ambiguousMappings/scenariosNeedingOrenDecision דורש קודם אישור אורן, לפי כללי הפרויקט.';

  return {
    totalScenarios,
    crashedCount: crashed.length,
    crashed,
    methodCoverage,
    questionTypeCoverage,
    ruleCategoryCoverage,
    sourceCoverage,
    failuresBySeverity,
    missingKnowledgeEntries,
    ambiguousMappings,
    scenariosNeedingOrenDecision,
    codeInstructionForClaude,
    results,
  };
}

function printReport(report) {
  console.log('=== Goral Knowledge + Decision Brain — Coverage Report ===');
  console.log('totalScenarios:', report.totalScenarios, '(crashed:', report.crashedCount, ')');
  console.log('methodCoverage:', JSON.stringify(report.methodCoverage));
  console.log('failuresBySeverity:', JSON.stringify(report.failuresBySeverity));
  console.log('ruleCategoryCoverage:', JSON.stringify(report.ruleCategoryCoverage));
  console.log('sourceCoverage:', JSON.stringify(report.sourceCoverage));
  console.log('missingKnowledgeEntries:', report.missingKnowledgeEntries.length);
  for (const m of report.missingKnowledgeEntries) console.log('  -', m);
  console.log('ambiguousMappings:', report.ambiguousMappings.length);
  for (const a of report.ambiguousMappings) console.log('  -', a);
  console.log('scenariosNeedingOrenDecision:', report.scenariosNeedingOrenDecision.length);
  for (const s of report.scenariosNeedingOrenDecision) console.log('  -', s.scenarioId, s.severity, s.recommendedFixes.join(' | '));
  console.log('codeInstructionForClaude:', report.codeInstructionForClaude);
}

const isMainModule = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  const report = run();
  printReport(report);
}

export default { run };
