#!/usr/bin/env node
/**
 * goral-qa-runner.mjs
 *
 * Local runner — Oren Smart Advisor: Goral QA Brain (שלב 2).
 * מריץ את כל GORAL_QA_SCENARIOS דרך goral-qa-output-collector.js, מפעיל
 * את שכבת-הבדיקות הדטרמיניסטית (goral-qa-deterministic-checks.js), ומדפיס
 * דוח סיכום. לא AI, לא רשת, לא secret, לא שינוי-מנוע — כלי-קריאה בלבד.
 *
 * הרצה:
 *   node goral-hachol/qa/goral-qa-runner.mjs
 */

import { GORAL_QA_SCENARIOS } from './goral-qa-scenarios.js';
import { collectScenarioOutput } from './goral-qa-output-collector.js';
import { runDeterministicChecks } from './goral-qa-deterministic-checks.js';

const RECOMMENDED_FIX_BY_SECTION = {
  dhamir: 'בדוק goral-rule-applicability.js (DHAMIR_CLIENT_VISIBLE_TOPICS) ואת נקודת-הקריאה ל-writeDhamirPara/dhamirParagraph.',
  'dhamirExtras.timing': 'אותה שכבת-גייטינג כמו דמיר — timing נמצא בתוך writeDhamirPara/dhamirExtras.',
  'dhamirExtras.temperament': 'אותה שכבת-גייטינג כמו דמיר — temperament נמצא בתוך writeDhamirPara/dhamirExtras.',
  keyHouses: 'בדוק getFormulaOnlyHouseNumbers ב-kashf-reading-engine.js וודא שהנושא הזה מכוסה נכון.',
  supportingFindings: 'בדוק findingSentence() (checkType legacy-fn) ב-kashf-narrative-writer.js.',
  'verdict-contradiction': 'בדוק writeShortVerdictBox/writeConclusionPara ב-kashf-narrative-writer.js — לוגיקת altPositive.',
};

function codeInstructionFor(problem, scenario) {
  return {
    needed: true,
    instruction: `[${scenario.method}/${scenario.topicId}] ${problem.description}`,
    filesToInspect: RECOMMENDED_FIX_BY_SECTION[problem.section]
      ? [RECOMMENDED_FIX_BY_SECTION[problem.section]]
      : ['(לא מופה אוטומטית — בדיקה ידנית נדרשת)'],
    filesNotToTouch: ['cartomancy/**', 'goral-hachol/engine/goral-spiritual-diagnostics-engine.js', 'supabase/functions/**'],
    testsToRun: ['node _test_goral_rule_applicability.mjs', 'node _test_kashf_house_label_context.mjs'],
  };
}

function severityRank(sev) {
  return { high: 3, medium: 2, low: 1 }[sev] || 0;
}

function run() {
  const results = [];
  let crashed = 0;

  for (const scenario of GORAL_QA_SCENARIOS) {
    try {
      const collected = collectScenarioOutput(scenario);
      const problems = runDeterministicChecks(collected);
      results.push({ scenario, collected, problems, crashed: false });
    } catch (err) {
      crashed++;
      results.push({ scenario, collected: null, problems: [], crashed: true, crashError: err.message });
    }
  }

  const allProblems = results.flatMap((r) =>
    r.problems.map((p) => ({ ...p, scenario: r.scenario }))
  );
  allProblems.sort((a, b) => severityRank(b.severity) - severityRank(a.severity));

  console.log('═'.repeat(70));
  console.log('Oren Smart Advisor — Goral QA Brain — Local Runner (Phase 2, no AI)');
  console.log('═'.repeat(70));
  console.log(`תרחישים שהורצו: ${results.length}`);
  console.log(`תרחישים שקרסו (שגיאת-הרצה): ${crashed}`);
  console.log(`תרחישים ללא בעיה: ${results.filter((r) => !r.crashed && r.problems.length === 0).length}`);
  console.log(`תרחישים עם בעיה אחת או יותר: ${results.filter((r) => r.problems.length > 0).length}`);
  console.log(`סה"כ בעיות שנמצאו: ${allProblems.length}`);
  console.log();

  if (crashed > 0) {
    console.log('--- תרחישים שקרסו ---');
    for (const r of results.filter((r) => r.crashed)) {
      console.log(`✗ ${r.scenario.id}: ${r.crashError}`);
    }
    console.log();
  }

  if (allProblems.length === 0) {
    console.log('לא נמצאו בעיות דטרמיניסטיות באף תרחיש.');
  } else {
    console.log('--- בעיות שנמצאו (ממוינות לפי severity) ---');
    for (const p of allProblems) {
      console.log(`\n[${p.severity.toUpperCase()}] ${p.scenario.method}/${p.scenario.topicId} (${p.scenario.id}) — ${p.section}`);
      console.log(`  שאלה: "${p.scenario.question}"`);
      console.log(`  תיאור: ${p.description}`);
      console.log(`  evidence: ${p.evidence}`);
      console.log(`  recommendedFix: ${RECOMMENDED_FIX_BY_SECTION[p.section] || '(בדיקה ידנית נדרשת)'}`);
      const instr = codeInstructionFor(p, p.scenario);
      console.log(`  codeInstructionForClaude.filesToInspect: ${instr.filesToInspect.join(', ')}`);
    }
  }

  console.log();
  console.log('═'.repeat(70));

  return { results, allProblems, crashed };
}

// מריצים ישירות רק כשהקובץ נקרא כ-script (לא כשמיובא ע"י בדיקה)
const isMain = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  run();
}

export { run };
export default { run };
