#!/usr/bin/env node
import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, value) { fs.writeFileSync(path, value); }
function replaceOnce(text, needle, replacement, label) {
  const first = text.indexOf(needle);
  if (first < 0) throw new Error('Missing patch anchor: ' + label);
  if (text.indexOf(needle, first + needle.length) >= 0) throw new Error('Non-unique patch anchor: ' + label);
  return text.slice(0, first) + replacement + text.slice(first + needle.length);
}
function patchMethodBlock(text, methodId, mutate) {
  const marker = "  '" + methodId + "': method({";
  const start = text.indexOf(marker);
  if (start < 0) throw new Error('Missing method block: ' + methodId);
  const end = text.indexOf('\n  }),', start);
  if (end < 0) throw new Error('Missing method block end: ' + methodId);
  const blockEnd = end + '\n  }),'.length;
  const oldBlock = text.slice(start, blockEnd);
  const newBlock = mutate(oldBlock);
  if (oldBlock === newBlock) throw new Error('Method block unchanged: ' + methodId);
  return text.slice(0, start) + newBlock + text.slice(blockEnd);
}

const registryPath = 'goral-hachol/registry/kashf-canonical-method-registry.js';
let registry = read(registryPath);
registry = patchMethodBlock(registry, 'dispute.p212.reconciliationH1H7', (block) => {
  let out = block;
  out = replaceOnce(out, '    runtimeAllowed: false,', '    runtimeAllowed: true,', 'p212 runtimeAllowed');
  out = replaceOnce(out, "    executorStatus: 'pending',", "    executorStatus: 'ready',", 'p212 executorStatus');
  const noteLine = out.split('\n').find((line) => line.trim().startsWith("notes: '"));
  if (noteLine) {
    out = out.replace(noteLine, "    notes: 'Canonical p212 reconciliation executor is wired. Generate one figure from H1+H7. A pure benefic generated figure gives the explicit source verdict that the two sides reconcile. Pure malefic, mixed, or unknown generated figures remain unresolved because p212 does not state the converse in this clause. Mediator identity clauses remain outside this yes/no executor.',");
  }
  return out;
});
write(registryPath, registry);

const knowledgePath = 'goral-hachol/registry/kashf-v57-knowledge-registry.js';
let knowledge = read(knowledgePath);
const knowledgeMarker = "  'dispute.p212.reconciliationH1H7': knowledge({";
const knowledgeStart = knowledge.indexOf(knowledgeMarker);
if (knowledgeStart < 0) throw new Error('Missing p212 v57 knowledge block');
const knowledgeEnd = knowledge.indexOf('\n  }),', knowledgeStart);
if (knowledgeEnd < 0) throw new Error('Missing p212 v57 knowledge block end');
const kEnd = knowledgeEnd + '\n  }),'.length;
let kBlock = knowledge.slice(knowledgeStart, kEnd);
if (kBlock.includes("notes: '")) {
  const noteLine = kBlock.split('\n').find((line) => line.trim().startsWith("notes: '"));
  kBlock = kBlock.replace(noteLine, "    notes: 'לשאלת עצם הפיוס מפעילים רק את הולדת H1+H7. רק ענף מיטיב מפורש במקור כעדות לפיוס; אין להמציא מן ההפך דין מפורש של אי־פיוס. סעיפי זהות המפשר/מתווך נשמרים כחומר ידע ואינם חלק מהכרעת כן/לא זו.',");
} else {
  kBlock = kBlock.replace('\n  })', "\n    notes: 'לשאלת עצם הפיוס מפעילים רק את הולדת H1+H7. רק ענף מיטיב מפורש במקור כעדות לפיוס; אין להמציא מן ההפך דין מפורש של אי־פיוס. סעיפי זהות המפשר/מתווך נשמרים כחומר ידע ואינם חלק מהכרעת כן/לא זו.',\n  })");
}
knowledge = knowledge.slice(0, knowledgeStart) + kBlock + knowledge.slice(kEnd);
write(knowledgePath, knowledge);

const executorsPath = 'goral-hachol/engine/kashf-canonical-executors.js';
let executors = read(executorsPath);
const executorBlock = `

// Kashf v57 p212 — reconciliation in disputes.
// Generate one figure from H1+H7. The source explicitly states only the
// benefic branch: if the generated figure is benefic, the two sides reconcile.
// The converse is not silently invented. Mediator identity rules are not part
// of this yes/no executor.
function computeDisputeReconciliationP212(chart) {
  if (!Array.isArray(chart)) return null;
  const h1 = findCanonicalHouse(chart, 1);
  const h7 = findCanonicalHouse(chart, 7);
  const h1Pattern = h1?.key || h1?.pattern || null;
  const h7Pattern = h7?.key || h7?.pattern || null;
  if (!h1Pattern || !h7Pattern) return null;

  const combined = combineRamlFigures(h1Pattern, h7Pattern);
  const resultPattern = combined.resultPattern;
  const classification = classifyCanonicalFigure(resultPattern);
  const isBenefic = classification.saadNahs === 'saad';

  let sourceOutcome = 'unresolved';
  let sourceOutcomeHebrew = 'לא הוכרע אם יהיה פיוס לפי כלל זה';
  let positive = null;
  let outputHebrew;

  if (isBenefic) {
    sourceOutcome = 'reconciliation';
    sourceOutcomeHebrew = 'שני הצדדים יתפייסו';
    positive = true;
    outputHebrew = 'לפי חשיפת הסודות הנצורים v57 עמ׳ 212, מן הבית הראשון והשביעי נולדה צורה מיטיבה. לפי לשון הכלל: שני הצדדים יתפייסו.';
  } else if (classification.saadNahs === 'mixed') {
    outputHebrew = 'בעמ׳ 212 נמסר במפורש ענף לפיוס כאשר הצורה הנולדת מן הראשון והשביעי מיטיבה. כאן הצורה ממוזגת, ולכן אין להפוך את נטייתה בכוח למיטיבה ואין הכרעת פיוס לפי כלל זה.';
  } else if (classification.saadNahs === 'nahs') {
    outputHebrew = 'בעמ׳ 212 נמסר במפורש ענף לפיוס כאשר הצורה הנולדת מן הראשון והשביעי מיטיבה. כאן הצורה מזיקה, אך סעיף זה אינו אומר במפורש שההפך מוכיח אי־פיוס; לכן אין להשלים דין כזה מן הדעת.';
  } else {
    outputHebrew = 'הצורה נולדה מן הבית הראשון והשביעי לפי עמ׳ 212, אך סיווגה אינו זמין; לכן אין הכרעה לפי כלל זה.';
  }

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 212',
    sourceText: 'אם מן הראשון והשביעי נולדת צורה מיטיבה, שניהם יתפייסו על ידי מי שמורה עליו הבית שבו שוכנת הצורה. אם בראשון צורת השמש — הפיוס בא מן השלטון; ואם בעשירי צורת צדק — מן הדיין; ואם בראשון צורה של נציב או ממונה — מן המושל.',
    housesUsed: [1, 7],
    h1Pattern,
    h7Pattern,
    resultPattern,
    resultFigureHebrew: classification.figureHebrew || null,
    classification,
    reconciliation: isBenefic ? true : null,
    sourceOutcome,
    sourceOutcomeHebrew,
    positive,
    mediatorResolved: false,
    outputHebrew,
  };
}
`;
executors = replaceOnce(
  executors,
  '\nconst CUSTOM_EXECUTORS = Object.freeze({',
  executorBlock + '\nconst CUSTOM_EXECUTORS = Object.freeze({',
  'p212 executor insertion point'
);
executors = replaceOnce(
  executors,
  "const CUSTOM_EXECUTORS = Object.freeze({\n",
  "const CUSTOM_EXECUTORS = Object.freeze({\n  'dispute.p212.reconciliationH1H7': computeDisputeReconciliationP212,\n",
  'p212 custom allowlist'
);
write(executorsPath, executors);

const testsPath = '_test_kashf_canonical_routing.mjs';
let tests = read(testsPath);
const reconciliationStart = tests.indexOf("const reconciliation = assertRoute('q-reconciliation', {");
if (reconciliationStart < 0) throw new Error('Missing reconciliation route assertion');
const reconciliationEnd = tests.indexOf('\n});', reconciliationStart);
if (reconciliationEnd < 0) throw new Error('Missing reconciliation route assertion end');
const rEnd = reconciliationEnd + '\n});'.length;
let rBlock = tests.slice(reconciliationStart, rEnd);
rBlock = rBlock.replace('  canRunKashf: false,', '  canRunKashf: true,');
rBlock = rBlock.replace("  executorStatus: 'pending',", "  executorStatus: 'ready',\n  runtimeAllowed: true,");
tests = tests.slice(0, reconciliationStart) + rBlock + tests.slice(rEnd);

const testBlock = `
// ── P15 p212 dispute reconciliation source contract ----------------------
assert(canRunKashfMethod('dispute.p212.reconciliationH1H7'), 'p212 reconciliation method is explicitly runnable');
const p212Knowledge = getKashfV57Knowledge('dispute.p212.reconciliationH1H7');
assert(p212Knowledge?.v57?.hebrewRule.includes('מן הראשון והשביעי'), 'p212 v57 knowledge preserves H1+H7 generation');
assert(p212Knowledge?.v57?.hebrewRule.includes('שניהם יתפייסו'), 'p212 v57 knowledge preserves explicit reconciliation branch');

const p212Benefic = buildKashfReadingByQuestionId(
  makeP204Board({ 1: '1111', 7: '2211' }),
  'q-reconciliation',
  { question: 'האם יהיה פיוס בין הצדדים?' }
);
assert(p212Benefic.valid === true && p212Benefic.canRunKashf === true, 'p212 benefic fixture executes canonically');
assert(JSON.stringify(p212Benefic.primaryFormula?.houses) === JSON.stringify([1, 7]), 'p212 traces H1+H7 only');
assert(p212Benefic.primaryFormula?.result?.executorResult?.resultPattern === '1122', 'p212 generated H1+H7 figure is correct');
assert(p212Benefic.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'saad', 'p212 generated pure benefic stays saad');
assert(p212Benefic.primaryFormula?.result?.executorResult?.sourceOutcome === 'reconciliation', 'p212 explicit benefic branch yields reconciliation');
assert(p212Benefic.primaryFormula?.result?.executorResult?.reconciliation === true, 'p212 reconciliation flag is true only for explicit benefic branch');
assert(p212Benefic.overallPositive === true, 'p212 explicit reconciliation branch is positive');
assert(p212Benefic.altFormula === null, 'p212 does not aggregate dispute alternatives');
assert(p212Benefic.canonicalExecution?.topicBundleExecuted === false, 'p212 does not execute broad disputes bundle');
assert(p212Benefic.dhamir === null, 'p212 does not auto-run Dhamir');
assert(p212Benefic.primaryFormula?.result?.executorResult?.mediatorResolved === false, 'p212 yes/no executor does not invent mediator identity');

const p212Malefic = buildKashfReadingByQuestionId(
  makeP204Board({ 1: '1111', 7: '2221' }),
  'q-reconciliation',
  { question: 'האם יהיה פיוס בין הצדדים?' }
);
assert(p212Malefic.primaryFormula?.result?.executorResult?.resultPattern === '1112', 'p212 malefic fixture generates expected figure');
assert(p212Malefic.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'nahs', 'p212 generated pure malefic stays nahs');
assert(p212Malefic.primaryFormula?.result?.executorResult?.sourceOutcome === 'unresolved', 'p212 does not invent no-reconciliation converse');
assert(p212Malefic.primaryFormula?.result?.executorResult?.reconciliation === null, 'p212 malefic branch remains unresolved');
assert(p212Malefic.overallPositive === null, 'p212 malefic branch is not collapsed into an unsourced negative verdict');

const p212Mixed = buildKashfReadingByQuestionId(
  makeP204Board({ 1: '1111', 7: '1121' }),
  'q-reconciliation',
  { question: 'האם יהיה פיוס בין הצדדים?' }
);
assert(p212Mixed.primaryFormula?.result?.executorResult?.resultPattern === '2212', 'p212 mixed fixture generates expected figure');
assert(p212Mixed.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'mixed', 'p212 preserves mixed source class');
assert(p212Mixed.primaryFormula?.result?.executorResult?.sourceOutcome === 'unresolved', 'p212 mixed branch remains unresolved');
assert(p212Mixed.overallPositive === null, 'p212 mixed result is not promoted by inclination');

const compromiseAfterP212 = resolveKashfRouteByQuestionId('q-compromise');
assert(compromiseAfterP212.canRunKashf === true, 'q-compromise alias becomes runnable through the same p212 method');
assert(compromiseAfterP212.kashfMethodId === 'dispute.p212.reconciliationH1H7', 'q-compromise still resolves to the exact p212 method');

const p212Html = writeCanonicalKashfReading(p212Benefic);
assert(p212Html.includes('dispute.p212.reconciliationH1H7'), 'p212 narrative exposes exact method id');
assert(p212Html.includes('שני הצדדים יתפייסו'), 'p212 narrative preserves Hebrew source verdict');
`;

tests = replaceOnce(
  tests,
  '// ── P14 p253 religion/righteousness source contract ----------------------',
  testBlock + '\n// ── P14 p253 religion/righteousness source contract ----------------------',
  'p212 test insertion point'
);
write(testsPath, tests);

console.log('Applied p212 dispute-reconciliation canonical implementation patch.');
