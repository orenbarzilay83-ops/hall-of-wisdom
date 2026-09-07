#!/usr/bin/env node
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const executorsPath = 'goral-hachol/engine/kashf-canonical-executors.js';
const registryPath = 'goral-hachol/registry/kashf-canonical-method-registry.js';
const readingEnginePath = 'goral-hachol/engine/kashf-canonical-reading-engine.js';
const testsPath = '_test_kashf_canonical_routing.mjs';

let executors = fs.readFileSync(executorsPath, 'utf8');
let registry = fs.readFileSync(registryPath, 'utf8');
let readingEngine = fs.readFileSync(readingEnginePath, 'utf8');
let tests = fs.readFileSync(testsPath, 'utf8');

// 1) Explicitly allow the already source-audited H6 body-part helper.
const oldImport = "import { computeProfessionH9Kashf } from './kashf-pending-extraction.js';";
const newImport = "import {\n  computeProfessionH9Kashf,\n  computeBodyPartDiagnosisKashf,\n} from './kashf-pending-extraction.js';";
if (executors.includes(oldImport)) {
  executors = executors.replace(oldImport, newImport);
} else if (!executors.includes('computeBodyPartDiagnosisKashf')) {
  throw new Error('Could not find canonical executor import anchor');
}

const allowlistAnchor = "  'profession.p254.h9Planet': computeProfessionH9Kashf,\n";
const allowlistLine = "  'illness.bodyPart.h6Figure': computeBodyPartDiagnosisKashf,\n";
if (!executors.includes(allowlistLine)) {
  if (!executors.includes(allowlistAnchor)) throw new Error('Could not find canonical executor allowlist anchor');
  executors = executors.replace(allowlistAnchor, allowlistAnchor + allowlistLine);
}

// Canonical boards expose pattern/hebrewName; legacy helpers historically expect key/hebrew.
// Normalize only those aliases and keep every original entry field intact.
const oldAdapter = `function toLegacyChart(board) {\n  if (Array.isArray(board)) return board;\n  if (Array.isArray(board?.entries)) return board.entries;\n  const error = new Error('Canonical legacy executor requires a board entries array');\n  error.code = 'KASHF_CANONICAL_BOARD_ADAPTER_FAILED';\n  throw error;\n}`;
const newAdapter = `function toLegacyChart(board) {\n  const entries = Array.isArray(board)\n    ? board\n    : Array.isArray(board?.entries)\n      ? board.entries\n      : null;\n  if (!entries) {\n    const error = new Error('Canonical legacy executor requires a board entries array');\n    error.code = 'KASHF_CANONICAL_BOARD_ADAPTER_FAILED';\n    throw error;\n  }\n\n  return entries.map((entry) => {\n    const key = entry?.key || entry?.pattern || entry?.figure?.pattern || null;\n    const hebrew = entry?.hebrew || entry?.hebrewName || entry?.figure?.hebrewName || key;\n    return { ...entry, key, hebrew };\n  });\n}`;
if (executors.includes(oldAdapter)) {
  executors = executors.replace(oldAdapter, newAdapter);
} else if (!executors.includes('const key = entry?.key || entry?.pattern')) {
  throw new Error('Could not find canonical legacy board adapter anchor');
}

// 2) Enable ONLY illness.bodyPart.h6Figure in the canonical method registry.
const bodyPartRegex = /(  'illness\.bodyPart\.h6Figure': method\(\{[\s\S]*?kashfRuntimeStatus: 'ready',\n)    runtimeAllowed: false,([\s\S]*?executionKind: 'legacy-function',\n)    executorStatus: 'pending',/;
if (bodyPartRegex.test(registry)) {
  registry = registry.replace(bodyPartRegex, "$1    runtimeAllowed: true,$2    executorStatus: 'ready',");
} else if (!/illness\.bodyPart\.h6Figure[\s\S]*?runtimeAllowed: true,[\s\S]*?executorStatus: 'ready'/.test(registry)) {
  throw new Error('Could not enable illness.bodyPart.h6Figure safely');
}

// 3) Preserve method-scoped house traceability in the canonical reading output.
const oldHouses = "    const houses = method.kashfMethodId === 'profession.p254.h9Planet' ? [9, 10, 11] : [];";
const newHouses = "    const houses = method.kashfMethodId === 'profession.p254.h9Planet'\n      ? [9, 10, 11]\n      : method.kashfMethodId === 'illness.bodyPart.h6Figure'\n        ? [6]\n        : [];";
if (readingEngine.includes(oldHouses)) {
  readingEngine = readingEngine.replace(oldHouses, newHouses);
} else if (!readingEngine.includes("method.kashfMethodId === 'illness.bodyPart.h6Figure'")) {
  throw new Error('Could not find legacy-method house traceability anchor');
}

// 4) Contract tests: exact route, exact executor, exact H6 source-table result,
// and no fallback into the broad illness bundle.
if (!tests.includes('// ── P2 illness body-part method-scoped legacy executor')) {
  const testAnchor = '// ── Canonical execution isolation ----------------------------------------';
  const testBlock = [
    '// ── P2 illness body-part method-scoped legacy executor -----------------',
    "const bodyPartRoute = assertRoute('q-illness-bodypart', {",
    '  ok: true,',
    '  canRunKashf: true,',
    "  kashfIntentId: 'illness.bodyPart',",
    "  kashfMethodId: 'illness.bodyPart.h6Figure',",
    "  kashfRuntimeStatus: 'ready',",
    "  executorStatus: 'ready',",
    '  runtimeAllowed: true,',
    '});',
    "assert(canRunKashfMethod(bodyPartRoute.kashfMethodId) === true, 'illness body-part canonical method is explicitly runnable');",
    "const bodyPartReading = buildKashfReadingByQuestionId(PILOT_BOARD, 'q-illness-bodypart', { question: 'באיזה איבר נאחז החולי?' });",
    "assert(bodyPartReading.valid === true, 'q-illness-bodypart executes through canonical legacy allowlist');",
    "assert(bodyPartReading.canonicalExecution?.methodsExecuted?.length === 1, 'q-illness-bodypart executes exactly one method');",
    "assert(bodyPartReading.canonicalExecution?.methodsExecuted?.[0] === 'illness.bodyPart.h6Figure', 'q-illness-bodypart executes the exact H6 method only');",
    "assert(bodyPartReading.primaryFormula?.houses?.length === 1 && bodyPartReading.primaryFormula.houses[0] === 6, 'q-illness-bodypart traceability records H6 only');",
    "assert(bodyPartReading.primaryFormula?.result?.legacyResult?.figureKey === '1112', 'pilot board H6 is passed to the legacy helper as canonical pattern key');",
    "assert(bodyPartReading.primaryFormula?.result?.legacyResult?.bodyPartHebrew === 'הרגל השמאלית', 'H6=1112 resolves to the source-table body part');",
    "assert(bodyPartReading.canonicalExecution?.altFormulaExecuted === false, 'q-illness-bodypart does not execute alt formula');",
    "assert(bodyPartReading.canonicalExecution?.topicSupportingChecksExecuted === false, 'q-illness-bodypart does not execute illness supporting checks');",
    "assert(bodyPartReading.canonicalExecution?.topicBundleExecuted === false, 'q-illness-bodypart does not execute illness topic bundle');",
    "assert(bodyPartReading.overallPositive === null, 'body-part lookup does not invent a positive/negative verdict');",
    'const bodyPartHtml = writeCanonicalKashfReading(bodyPartReading);',
    "assert(bodyPartHtml.includes('illness.bodyPart.h6Figure'), 'body-part writer identifies exact canonical method');",
    "assert(bodyPartHtml.includes('הרגל השמאלית'), 'body-part writer renders the source-table result');",
    "assert(!bodyPartHtml.includes('ניתוח תומך לפי ספר'), 'body-part writer contains no broad illness support section');",
    "assert(!bodyPartHtml.includes('מחשבת השואל (הדמיר)'), 'body-part writer contains no automatic Dhamir');",
    '',
  ].join('\n');
  if (!tests.includes(testAnchor)) throw new Error('Could not find canonical execution isolation test anchor');
  tests = tests.replace(testAnchor, testBlock + testAnchor);
}

fs.writeFileSync(executorsPath, executors);
fs.writeFileSync(registryPath, registry);
fs.writeFileSync(readingEnginePath, readingEngine);
fs.writeFileSync(testsPath, tests);

for (const [cmd, args] of [
  ['node', ['_test_kashf_canonical_routing.mjs']],
  ['node', ['_audit_kashf_question_route_coverage.mjs']],
]) {
  const result = spawnSync(cmd, args, { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log('Illness body-part canonical executor cutover passed.');
