#!/usr/bin/env node
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const executorsPath = 'goral-hachol/engine/kashf-canonical-executors.js';
const registryPath = 'goral-hachol/registry/kashf-canonical-method-registry.js';
const bankPath = 'goral-hachol/ui/question-bank.js';
const testsPath = '_test_kashf_canonical_routing.mjs';

let executors = fs.readFileSync(executorsPath, 'utf8');
let registry = fs.readFileSync(registryPath, 'utf8');
let bank = fs.readFileSync(bankPath, 'utf8');
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

// ── 1. Exact p188 executor ------------------------------------------------
if (!executors.includes('function computeHiddenStillThereP188(chart) {')) {
  const insertMarker = '\nconst CUSTOM_EXECUTORS = Object.freeze({';
  const at = executors.indexOf(insertMarker);
  if (at < 0) throw new Error('CUSTOM_EXECUTORS marker not found');

  const fn = String.raw`

function computeHiddenStillThereP188(chart) {
  if (!Array.isArray(chart)) return null;
  const housesUsed = [1, 2, 4, 13, 14, 15];
  const houseResults = housesUsed.map((houseNumber) => {
    const entry = findCanonicalHouse(chart, houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    if (!pattern) return null;
    return {
      houseNumber,
      pattern,
      figureHebrew: entry?.hebrew || entry?.hebrewName || pattern,
      classification: classifyCanonicalFigure(pattern),
    };
  });
  if (houseResults.some((item) => !item)) return null;

  const allBenefic = houseResults.every((item) => item.classification.saadNahs === 'saad');
  const presentInPlace = allBenefic;
  const nonBeneficHouses = houseResults
    .filter((item) => item.classification.saadNahs !== 'saad')
    .map((item) => item.houseNumber);

  const outputHebrew = presentInPlace
    ? 'בבתים 1, 2, 4, 13, 14 ו־15 נמצאו צורות מיטיבות. לפי כשף עמ׳ 188: הדבר הנסתר נמצא עדיין במקום הנבדק.'
    : 'לא כל הצורות בבתים 1, 2, 4, 13, 14 ו־15 מיטיבות (הבתים שאינם מיטיבים במפורש: ' + nonBeneficHouses.join(', ') + '). לפי כשף עמ׳ 188: הדבר הנסתר אינו במקום הנבדק. כלל זה עוסק בדבר נסתר שכבר נשאל עליו ובמקומו; הוא אינו מוכיח מעצמו שקיים מטמון לא ידוע.';

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 188',
    sourceText: 'בדבר הנסתר — האם הוא במקומו או לא? התבונן בראשון, בשני, בבית הדבר הנסתר — הרביעי — ובשלושה־עשר, בארבעה־עשר ובחמישה־עשר. אם הצורות מיטיבות, הרי הוא שם; ואם אינן מיטיבות, אינו שם.',
    housesUsed,
    houseResults,
    allBenefic,
    nonBeneficHouses,
    presentInPlace,
    positive: presentInPlace,
    outputHebrew,
  };
}
`;
  executors = executors.slice(0, at) + fn + executors.slice(at);
}

if (!executors.includes("'hidden.p188.isStillThere': computeHiddenStillThereP188,")) {
  const mapMarker = "const CUSTOM_EXECUTORS = Object.freeze({\n";
  if (!executors.includes(mapMarker)) throw new Error('CUSTOM_EXECUTORS map start not found');
  executors = executors.replace(mapMarker, mapMarker + "  'hidden.p188.isStillThere': computeHiddenStillThereP188,\n");
}

// ── 2. Enable exact method in registry ------------------------------------
registry = updateMethodBlock(registry, 'hidden.p188.isStillThere', (block) => {
  let next = block
    .replace("runtimeAllowed: false", "runtimeAllowed: true")
    .replace("executorStatus: 'pending'", "executorStatus: 'ready'");
  next = next.replace(
    "notes: 'Check H1,H2,H4,H13,H14,H15. Source is binary: if the required figures are benefic, the hidden thing is there; otherwise it is not. No majority rule.'",
    "notes: 'Canonical p188 executor is wired: H1,H2,H4,H13,H14,H15 must all be explicitly benefic (saad) for the hidden thing to be in the tested place; otherwise the source says it is not there. No majority rule and no promotion of mixed tendency to benefic. This does not prove an unspecified treasure exists from nothing.'"
  );
  return next;
});

// ── 3. Correct UI wording to the source-safe routed intent ----------------
const oldTreasure = `  {\n    id: 'q-treasure',\n    category: 'money', houseId: 2, topicId: 'hiddenTreasure', kashfTopicId: 'hiddenTreasure',\n    label: 'האם יש מטמון נסתר?',`;
const newTreasure = `  {\n    id: 'q-treasure',\n    category: 'money', houseId: 2, topicId: 'hiddenTreasure', kashfTopicId: 'hiddenTreasure',\n    label: 'האם הדבר הנסתר עדיין במקומו?',`;
if (bank.includes(oldTreasure)) {
  bank = bank.replace(oldTreasure, newTreasure);
} else if (!bank.includes("label: 'האם הדבר הנסתר עדיין במקומו?'")) {
  throw new Error('q-treasure label marker not found');
}

const oldDesc = "    desc: 'לאיתור מטמון/חפץ נסתר — האם קיים ובאיזה כיוון לחפש',";
const oldDesc2 = "    desc: 'לבדיקת מטמון או דבר נסתר — האם יש, היכן, ומה טיבו',";
const newDesc = "    desc: 'לדבר נסתר או טמון שכבר ידוע או נחשד במקום מסוים — האם הוא עדיין שם. השיטה אינה מוכיחה קיום מטמון לא ידוע.',";
if (bank.includes(oldDesc)) bank = bank.replace(oldDesc, newDesc);
else if (bank.includes(oldDesc2)) bank = bank.replace(oldDesc2, newDesc);
else {
  const qStart = bank.indexOf("    id: 'q-treasure',");
  const qEnd = qStart >= 0 ? bank.indexOf('\n  },', qStart) : -1;
  if (qStart < 0 || qEnd < 0) throw new Error('q-treasure block not found for description update');
  const block = bank.slice(qStart, qEnd);
  if (!block.includes(newDesc.trim())) {
    const replaced = block.replace(/    desc: '[^']*',/, newDesc);
    if (replaced === block) throw new Error('q-treasure description not replaceable');
    bank = bank.slice(0, qStart) + replaced + bank.slice(qEnd);
  }
}

// ── 4. Contract tests -----------------------------------------------------
if (!tests.includes('// ── P12 hidden-item p188 executor')) {
  const testMarker = '// ── Canonical execution isolation ----------------------------------------';
  const at = tests.indexOf(testMarker);
  if (at < 0) throw new Error('Canonical execution isolation marker not found');

  const block = String.raw`// ── P12 hidden-item p188 executor --------------------------------------
assertRoute('q-treasure', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'hidden.isStillThere',
  kashfMethodId: 'hidden.p188.isStillThere',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assert(canRunKashfMethod('hidden.p188.isStillThere') === true, 'p188 hidden-item method is explicitly runnable');

const hiddenYes = buildKashfReadingByQuestionId(makeP9Board({
  1: '1122', 2: '1222', 4: '2111', 13: '2121', 14: '2211', 15: '1122',
}), 'q-treasure', { question: 'האם הדבר הנסתר עדיין במקום?' });
assert(hiddenYes.valid === true && hiddenYes.canRunKashf === true, 'p188 hidden positive fixture executes canonically');
assert(hiddenYes.canonicalExecution?.methodsExecuted?.length === 1, 'p188 hidden executes exactly one method');
assert(hiddenYes.canonicalExecution?.methodsExecuted?.[0] === 'hidden.p188.isStillThere', 'p188 hidden executes exact canonical method');
assert(JSON.stringify(hiddenYes.primaryFormula?.houses) === JSON.stringify([1, 2, 4, 13, 14, 15]), 'p188 hidden traces exactly six source houses');
assert(hiddenYes.primaryFormula?.result?.executorResult?.houseResults?.every((item) => item.classification.saadNahs === 'saad'), 'p188 positive fixture has all six houses explicitly benefic');
assert(hiddenYes.primaryFormula?.result?.executorResult?.presentInPlace === true, 'p188 all-benefic branch means hidden thing is in place');
assert(hiddenYes.overallPositive === true, 'p188 in-place branch is positive');
assert(hiddenYes.verdict?.text.includes('נמצא עדיין במקום'), 'p188 verdict states still in tested place');
assert(hiddenYes.canonicalExecution?.topicBundleExecuted === false, 'p188 hidden does not execute broad hidden-treasure bundle');
assert(hiddenYes.altFormula === null, 'p188 hidden does not execute direction/recast alternatives');
assert(hiddenYes.dhamir === null, 'p188 hidden does not auto-run Dhamir');

const hiddenNo = buildKashfReadingByQuestionId(makeP9Board({
  1: '1122', 2: '1222', 4: '1112', 13: '2121', 14: '2211', 15: '1122',
}), 'q-treasure', { question: 'האם הדבר הנסתר עדיין במקום?' });
assert(hiddenNo.primaryFormula?.result?.executorResult?.houseResults?.find((item) => item.houseNumber === 4)?.classification?.saadNahs === 'nahs', 'p188 negative fixture has H4 explicitly malefic');
assert(hiddenNo.primaryFormula?.result?.executorResult?.presentInPlace === false, 'p188 one non-benefic source house fails all-benefic condition');
assert(hiddenNo.overallPositive === false, 'p188 source otherwise-not-there branch is negative');
assert(hiddenNo.verdict?.text.includes('אינו במקום הנבדק'), 'p188 negative verdict says not in tested place');

const hiddenMixedNo = buildKashfReadingByQuestionId(makeP9Board({
  1: '1122', 2: '1222', 4: '2212', 13: '2121', 14: '2211', 15: '1122',
}), 'q-treasure', { question: 'האם הדבר הנסתר עדיין במקום?' });
assert(hiddenMixedNo.primaryFormula?.result?.executorResult?.houseResults?.find((item) => item.houseNumber === 4)?.classification?.saadNahs === 'mixed', 'p188 mixed figure remains mixed');
assert(hiddenMixedNo.primaryFormula?.result?.executorResult?.presentInPlace === false, 'p188 mixed tendency is not promoted to benefic');

`;
  tests = tests.slice(0, at) + block + tests.slice(at);
}

fs.writeFileSync(executorsPath, executors);
fs.writeFileSync(registryPath, registry);
fs.writeFileSync(bankPath, bank);
fs.writeFileSync(testsPath, tests);

for (const file of [executorsPath, registryPath, bankPath, testsPath]) {
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

console.log('P12 p188 hidden-item canonical executor passed.');
