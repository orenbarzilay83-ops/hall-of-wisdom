#!/usr/bin/env node
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const executorsPath = 'goral-hachol/engine/kashf-canonical-executors.js';
const registryPath = 'goral-hachol/registry/kashf-canonical-method-registry.js';
const testsPath = '_test_kashf_canonical_routing.mjs';

let executors = fs.readFileSync(executorsPath, 'utf8');
let registry = fs.readFileSync(registryPath, 'utf8');
let tests = fs.readFileSync(testsPath, 'utf8');

function updateMethodBlock(source, methodId, transform) {
  const marker = `  '${methodId}': method({`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Method block not found: ${methodId}`);
  const endMarker = '\n  }),';
  const end = source.indexOf(endMarker, start);
  if (end < 0) throw new Error(`Method block end not found: ${methodId}`);
  const blockEnd = end + endMarker.length;
  const block = source.slice(start, blockEnd);
  const next = transform(block);
  if (!next) throw new Error(`Method transform returned empty block: ${methodId}`);
  return source.slice(0, start) + next + source.slice(blockEnd);
}

// ── 1. Exact p202 executor ------------------------------------------------
if (!executors.includes('function computeLostItemReturnP202(chart) {')) {
  const insertMarker = '\nconst CUSTOM_EXECUTORS = Object.freeze({';
  const at = executors.indexOf(insertMarker);
  if (at < 0) throw new Error('CUSTOM_EXECUTORS marker not found');

  const fn = String.raw`

function computeLostItemReturnP202(chart) {
  if (!Array.isArray(chart)) return null;
  const h6 = findCanonicalHouse(chart, 6);
  const h8 = findCanonicalHouse(chart, 8);
  const h6Pattern = h6?.key || h6?.pattern || null;
  const h8Pattern = h8?.key || h8?.pattern || null;
  if (!h6Pattern || !h8Pattern) return null;

  const h6Classification = classifyCanonicalFigure(h6Pattern);
  const h8Classification = classifyCanonicalFigure(h8Pattern);
  const h6Qualifies = h6Classification.saadNahs === 'saad' && h6Classification.dakhalKharij === 'dakhil';
  const h8Qualifies = h8Classification.saadNahs === 'saad' && h8Classification.dakhalKharij === 'dakhil';
  const returns = h6Qualifies && h8Qualifies;

  const h6FigureHebrew = h6?.hebrew || h6?.hebrewName || h6Pattern;
  const h8FigureHebrew = h8?.hebrew || h8?.hebrewName || h8Pattern;
  const outputHebrew = returns
    ? 'בית 6: ' + h6FigureHebrew + ' (' + h6Pattern + ') ובית 8: ' + h8FigureHebrew + ' (' + h8Pattern + ') — שתיהן צורות מיטיבות פנימיות. לפי כשף עמ׳ 202: האבדה תשוב.'
    : 'לפי כשף עמ׳ 202, חזרת האבדה דורשת שגם בית 6 וגם בית 8 יהיו צורות מיטיבות פנימיות. התנאי אינו מתקיים בשני הבתים יחד; לכן לפי כלל זה האבדה אינה שבה. אין להפוך צורה ממוזגת למיטיבה, ואין להחשיב צורה קבועה/מתהפכת/חיצונית כפנימית.';

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 202',
    sourceText: 'בעניין האבדה ושיבתה: כוון אל הבית השמיני והשישי; אם היו הצורות מיטיבות פנימיות — שבה, ואם לא — לא.',
    housesUsed: [6, 8],
    h6Pattern,
    h8Pattern,
    h6FigureHebrew,
    h8FigureHebrew,
    h6Classification,
    h8Classification,
    h6Qualifies,
    h8Qualifies,
    returns,
    positive: returns,
    outputHebrew,
  };
}
`;
  executors = executors.slice(0, at) + fn + executors.slice(at);
}

if (!executors.includes("'lostItem.p202.returnH6H8': computeLostItemReturnP202,")) {
  const mapMarker = "const CUSTOM_EXECUTORS = Object.freeze({\n";
  if (!executors.includes(mapMarker)) throw new Error('CUSTOM_EXECUTORS map start not found');
  executors = executors.replace(mapMarker, mapMarker + "  'lostItem.p202.returnH6H8': computeLostItemReturnP202,\n");
}

// ── 2. Enable exact method in registry ------------------------------------
registry = updateMethodBlock(registry, 'lostItem.p202.returnH6H8', (block) => {
  let next = block
    .replace("runtimeAllowed: false", "runtimeAllowed: true")
    .replace("executorStatus: 'pending'", "executorStatus: 'ready'");
  next = next.replace(
    "notes: 'Canonical body rule for the lost thing: H6 and H8 must be benefic AND internal for return; otherwise it does not return. Do not add an unsourced middle branch.'",
    "notes: 'Canonical p202 executor is wired: H6 and H8 must both be explicitly benefic (saad) AND explicitly internal (dakhil) for return; otherwise the source says it does not return. Mixed tendency is not promoted to benefic, and fixed/mutable/outgoing movement is not promoted to internal.'"
  );
  return next;
});

// ── 3. Contract tests: positive, negative, alias, isolation ---------------
if (!tests.includes('// ── P11 lost-item return p202 executor')) {
  const testMarker = '// ── Canonical execution isolation ----------------------------------------';
  const at = tests.indexOf(testMarker);
  if (at < 0) throw new Error('Canonical execution isolation marker not found');

  const block = String.raw`// ── P11 lost-item return p202 executor ---------------------------------
assertRoute('q-lost-item', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'lostItem.return',
  kashfMethodId: 'lostItem.p202.returnH6H8',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assert(canRunKashfMethod('lostItem.p202.returnH6H8') === true, 'p202 lost-item return method is explicitly runnable');

const lostReturnYes = buildKashfReadingByQuestionId(makeP9Board({ 6: '2111', 8: '2121' }), 'q-lost-item', { question: 'האם האבדה תשוב?' });
assert(lostReturnYes.valid === true && lostReturnYes.canRunKashf === true, 'p202 lost-item positive fixture executes canonically');
assert(lostReturnYes.canonicalExecution?.methodsExecuted?.length === 1, 'p202 lost-item executes exactly one method');
assert(lostReturnYes.canonicalExecution?.methodsExecuted?.[0] === 'lostItem.p202.returnH6H8', 'p202 lost-item executes exact canonical method');
assert(JSON.stringify(lostReturnYes.primaryFormula?.houses) === JSON.stringify([6, 8]), 'p202 lost-item traces H6+H8 only');
assert(lostReturnYes.primaryFormula?.result?.executorResult?.h6Classification?.saadNahs === 'saad', 'p202 H6 positive fixture is benefic');
assert(lostReturnYes.primaryFormula?.result?.executorResult?.h6Classification?.dakhalKharij === 'dakhil', 'p202 H6 positive fixture is internal');
assert(lostReturnYes.primaryFormula?.result?.executorResult?.h8Classification?.saadNahs === 'saad', 'p202 H8 positive fixture is benefic');
assert(lostReturnYes.primaryFormula?.result?.executorResult?.h8Classification?.dakhalKharij === 'dakhil', 'p202 H8 positive fixture is internal');
assert(lostReturnYes.primaryFormula?.result?.executorResult?.returns === true, 'p202 both benefic+internal houses mean return');
assert(lostReturnYes.overallPositive === true, 'p202 return branch is positive');
assert(lostReturnYes.verdict?.text.includes('האבדה תשוב'), 'p202 return verdict preserves source meaning');
assert(lostReturnYes.altFormula === null, 'p202 does not aggregate lost-item alternatives');
assert(lostReturnYes.canonicalExecution?.topicBundleExecuted === false, 'p202 does not execute broad lost-animal/theft bundle');
assert(lostReturnYes.dhamir === null, 'p202 does not auto-run Dhamir');

const lostReturnMixedNo = buildKashfReadingByQuestionId(makeP9Board({ 6: '2212', 8: '2111' }), 'q-lost-item', { question: 'האם האבדה תשוב?' });
assert(lostReturnMixedNo.primaryFormula?.result?.executorResult?.h6Classification?.saadNahs === 'mixed', 'p202 mixed-benefic tendency remains mixed');
assert(lostReturnMixedNo.primaryFormula?.result?.executorResult?.h6Qualifies === false, 'p202 mixed figure is not promoted to explicit benefic+internal');
assert(lostReturnMixedNo.primaryFormula?.result?.executorResult?.returns === false, 'p202 mixed H6 fails exact return condition');
assert(lostReturnMixedNo.overallPositive === false, 'p202 source otherwise-no branch is negative');

const lostReturnOutgoingNo = buildKashfReadingByQuestionId(makeP9Board({ 6: '2111', 8: '1122' }), 'q-lost-item', { question: 'האם האבדה תשוב?' });
assert(lostReturnOutgoingNo.primaryFormula?.result?.executorResult?.h8Classification?.saadNahs === 'saad', 'p202 outgoing negative fixture remains benefic in quality');
assert(lostReturnOutgoingNo.primaryFormula?.result?.executorResult?.h8Classification?.dakhalKharij === 'kharij', 'p202 outgoing negative fixture is explicitly external');
assert(lostReturnOutgoingNo.primaryFormula?.result?.executorResult?.h8Qualifies === false, 'p202 benefic but outgoing H8 fails internal condition');
assert(lostReturnOutgoingNo.primaryFormula?.result?.executorResult?.returns === false, 'p202 benefic-but-outgoing branch does not return');

const lostAnimalRoute = assertRoute('q-lost-animal', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'lostItem.return',
  kashfMethodId: 'lostItem.p202.returnH6H8',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assert(lostAnimalRoute.aliasOf === 'q-lost-item', 'q-lost-animal remains an explicit alias of the same p202 return method');
const lostAnimalReading = buildKashfReadingByQuestionId(makeP9Board({ 6: '2111', 8: '2121' }), 'q-lost-animal', { question: 'האם החיה האבודה תחזור?' });
assert(lostAnimalReading.primaryFormula?.result?.executorResult?.returns === true, 'q-lost-animal alias reaches the same exact p202 executor');
assert(lostAnimalReading.canonicalExecution?.methodsExecuted?.length === 1, 'q-lost-animal alias still executes one method only');

`;
  tests = tests.slice(0, at) + block + tests.slice(at);
}

fs.writeFileSync(executorsPath, executors);
fs.writeFileSync(registryPath, registry);
fs.writeFileSync(testsPath, tests);

for (const file of [executorsPath, registryPath, testsPath]) {
  const check = spawnSync('node', ['--check', file], { stdio: 'inherit' });
  if (check.status !== 0) process.exit(check.status ?? 1);
}

for (const command of [
  ['node', ['_test_kashf_canonical_routing.mjs']],
  ['node', ['_audit_kashf_question_route_coverage.mjs']],
]) {
  const run = spawnSync(command[0], command[1], { stdio: 'inherit' });
  if (run.status !== 0) process.exit(run.status ?? 1);
}

console.log('P11 p202 lost-item return canonical executor passed.');
