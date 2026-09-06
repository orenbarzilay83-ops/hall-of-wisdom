#!/usr/bin/env node
/**
 * goral-qa-ai-runner.mjs
 *
 * Oren Smart Advisor — "בינת היכל החכמה": Goral QA AI Evaluator runner (שלב 3).
 * מריץ את ה-QA Runner המקומי (goral-qa-runner.js), בונה payload מסונן-פרטיות
 * (goral-qa-ai-payload-builder.js), ומעביר אותו ל-evaluator — כרגע **MOCK
 * בלבד** (goral-qa-ai-evaluator-mock.js), כי אין AI חי/secret מחובר בשלב הזה.
 *
 * המעבר לעתיד ל-AI חי אמור להיות **החלפת ה-evaluator בלבד** (קריאה ל-
 * callAnthropic עם ai/prompts/hall-wisdom-goral-qa-evaluator.prompt.md דרך
 * Edge Function מוגנת) — לא בנייה-מחדש של payload/runner.
 *
 * הרצה:
 *   node goral-hachol/qa/goral-qa-ai-runner.mjs
 */

import { run as runQaBrain } from './goral-qa-runner.mjs';
import { buildQaEvaluatorPayload } from './goral-qa-ai-payload-builder.js';
import { evaluateQaRunMock } from './goral-qa-ai-evaluator-mock.js';

function run() {
  const qaRunResult = runQaBrain();
  const payload = buildQaEvaluatorPayload(qaRunResult);
  const evaluation = evaluateQaRunMock(payload);

  console.log('\n' + '═'.repeat(70));
  console.log('בינת היכל החכמה — Goral QA AI Evaluator (שלב 3, MOCK — אין AI חי)');
  console.log('═'.repeat(70));
  console.log(`payload: ${payload.scenarios.length} תרחישים, ${payload.deterministicFindings.length} ממצאים דטרמיניסטיים`);
  console.log();
  console.log('overallDiagnosis:');
  console.log('  ' + evaluation.overallDiagnosis);
  console.log();
  console.log(`severity: ${evaluation.severity} | confidence: ${evaluation.confidence} | needsOrenDecision: ${evaluation.needsOrenDecision}`);
  console.log(`codeInstructionForClaude.needed: ${evaluation.codeInstructionForClaude.needed}`);
  if (evaluation.codeInstructionForClaude.needed) {
    console.log(`  instruction: ${evaluation.codeInstructionForClaude.instruction}`);
    console.log(`  filesToInspect: ${evaluation.codeInstructionForClaude.filesToInspect.join(', ')}`);
  }
  console.log('═'.repeat(70));

  return { payload, evaluation };
}

const isMain = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  run();
}

export { run };
export default { run };
