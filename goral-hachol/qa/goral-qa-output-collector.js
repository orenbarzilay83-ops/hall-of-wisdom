/**
 * goral-qa-output-collector.js
 *
 * Engine Output Collector — Oren Smart Advisor: Goral QA Brain (שלב 2).
 *
 * פונקציה טהורה: מריצה תרחיש בודד דרך המנוע האמיתי (כשף או חאווי) ומחזירה
 * אובייקט מובנה אחיד לשתי השיטות. לא AI, לא רשת, לא שינוי-מנוע — קריאה
 * בלבד לפונקציות הקיימות (buildRamlBoardFromMothers / buildKashfReading /
 * writeKashfReading / interpretHawiQuestionInitial / getSectionVisibility),
 * ללא שום שינוי בהן.
 */

import { buildRamlBoardFromMothers } from '../engine/raml-board-generator.js';
import { buildKashfReading } from '../engine/kashf-reading-engine.js';
import { writeKashfReading } from '../engine/kashf-narrative-writer.js';
import { interpretHawiQuestionInitial } from '../engine/hawi-interpreter.js';
import { getSectionVisibility } from '../engine/goral-rule-applicability.js';
import { evaluateReading } from '../brain/goral-decision-brain.js';

function collectKashf(scenario, board) {
  const reading = buildKashfReading(board, scenario.topicId, { question: scenario.question });
  const clientOutputHtml = writeKashfReading(reading);
  const advisorOnlyOutput = writeKashfReading(reading, { mode: 'advisor' });

  const dhamirVisibility = getSectionVisibility({
    method: 'kashf', topicId: scenario.topicId, sectionId: 'dhamir', mode: 'client',
  });

  const sourceRulesApplied = [
    reading.primaryFormula?.sourceText,
    reading.altFormula?.sourceText,
    ...(reading.supportingFindings || []).map((f) => f.sourceText),
  ].filter(Boolean);

  return {
    scenarioId: scenario.id,
    category: scenario.category,
    method: 'kashf',
    topicId: scenario.topicId,
    question: scenario.question,
    board: { mothers: scenario.mothers, entries: board.entries },
    clientOutputHtml,
    advisorOnlyOutput,
    sectionsShown: dhamirVisibility.showToClient ? ['dhamir'] : [],
    sectionsHidden: dhamirVisibility.showToClient ? [] : ['dhamir'],
    warnings: reading.boardValidation?.warnings || [],
    sourceRulesApplied,
    raw: reading,
    error: reading.valid === false ? reading.error : null,
  };
}

function collectHawi(scenario, board) {
  const boardWithTopic = { ...board, chart: board.chart || board.entries || [], topicId: scenario.topicId };
  const result = interpretHawiQuestionInitial(scenario.question, boardWithTopic);
  const clientOutputHtml = result.finalConclusionHebrew || '';
  const advisorOnlyOutput = result;

  const dhamirVisibility = getSectionVisibility({
    method: 'hawi', topicId: scenario.topicId, sectionId: 'dhamir', mode: 'client',
  });

  const sourceRulesApplied = (result.relevantRules || [])
    .map((r) => r.hebrew || r.condition || r.result)
    .filter(Boolean);

  return {
    scenarioId: scenario.id,
    category: scenario.category,
    method: 'hawi',
    topicId: scenario.topicId,
    question: scenario.question,
    board: { mothers: scenario.mothers, entries: board.entries },
    clientOutputHtml,
    advisorOnlyOutput,
    sectionsShown: dhamirVisibility.showToClient ? ['dhamir'] : [],
    sectionsHidden: dhamirVisibility.showToClient ? [] : ['dhamir'],
    warnings: result.boardValidation?.warnings || [],
    sourceRulesApplied,
    raw: result,
    error: null,
  };
}

/**
 * מוסיף brainEvaluation (Phase 4 Decision Brain) לפלט שכבר נאסף — קריאה-בלבד
 * על נתונים שכבר קיימים ב-collected, לא קורא לשום מנוע נוסף ולא משנה שום
 * שדה קיים.
 */
function attachBrainEvaluation(collected) {
  collected.brainEvaluation = evaluateReading({
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
  return collected;
}

/**
 * @param {object} scenario - פריט מ-GORAL_QA_SCENARIOS
 * @returns {object} פלט מובנה אחיד (ראו OREN_SMART_ADVISOR_GORAL_QA_BRAIN_PLAN.md §B),
 *                    כולל brainEvaluation (Phase 4)
 */
export function collectScenarioOutput(scenario) {
  const board = buildRamlBoardFromMothers(scenario.mothers);
  if (scenario.method === 'kashf') return attachBrainEvaluation(collectKashf(scenario, board));
  if (scenario.method === 'hawi') return attachBrainEvaluation(collectHawi(scenario, board));
  throw new Error(`method לא מוכר: ${scenario.method}`);
}

export default { collectScenarioOutput };
