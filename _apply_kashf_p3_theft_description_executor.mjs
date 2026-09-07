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

// 1) Add the exact H7 thief-description helper to a CUSTOM method-scoped allowlist.
const oldImport = `import {\n  computeProfessionH9Kashf,\n  computeBodyPartDiagnosisKashf,\n} from './kashf-pending-extraction.js';`;
const newImport = `import {\n  computeProfessionH9Kashf,\n  computeBodyPartDiagnosisKashf,\n  computeThiefPhysicalDescriptionKashf,\n} from './kashf-pending-extraction.js';`;
if (executors.includes(oldImport)) {
  executors = executors.replace(oldImport, newImport);
} else if (!executors.includes('computeThiefPhysicalDescriptionKashf')) {
  throw new Error('Could not find canonical executor import anchor');
}

const customBlock = `\nconst CUSTOM_EXECUTORS = Object.freeze({\n  'theft.p225.thiefDescriptionH7': computeThiefPhysicalDescriptionKashf,\n});\n`;
if (!executors.includes("'theft.p225.thiefDescriptionH7': computeThiefPhysicalDescriptionKashf")) {
  const legacyEnd = `const LEGACY_EXECUTORS = Object.freeze({\n  'profession.p254.h9Planet': computeProfessionH9Kashf,\n  'illness.bodyPart.h6Figure': computeBodyPartDiagnosisKashf,\n});\n`;
  if (!executors.includes(legacyEnd)) throw new Error('Could not find legacy executor allowlist anchor');
  executors = executors.replace(legacyEnd, legacyEnd + customBlock);
}

const customFns = `\nexport function hasCanonicalCustomExecutor(kashfMethodId) {\n  return typeof CUSTOM_EXECUTORS[kashfMethodId] === 'function';\n}\n\nexport function executeCanonicalCustomMethod(kashfMethodId, board) {\n  const executor = CUSTOM_EXECUTORS[kashfMethodId];\n  if (typeof executor !== 'function') {\n    const error = new Error(\`No approved canonical custom executor for \${kashfMethodId}\`);\n    error.code = 'KASHF_CANONICAL_CUSTOM_EXECUTOR_NOT_APPROVED';\n    throw error;\n  }\n\n  return executor(toLegacyChart(board));\n}\n`;
if (!executors.includes('export function hasCanonicalCustomExecutor')) {
  const listAnchor = `export function listApprovedCanonicalLegacyExecutors() {\n  return Object.keys(LEGACY_EXECUTORS);\n}\n`;
  if (!executors.includes(listAnchor)) throw new Error('Could not find canonical executor function anchor');
  executors = executors.replace(listAnchor, customFns + '\n' + listAnchor);
}

const defaultAnchor = `export default {\n  hasCanonicalLegacyExecutor,\n  executeCanonicalLegacyMethod,\n  listApprovedCanonicalLegacyExecutors,\n};`;
const defaultReplacement = `export default {\n  hasCanonicalLegacyExecutor,\n  executeCanonicalLegacyMethod,\n  hasCanonicalCustomExecutor,\n  executeCanonicalCustomMethod,\n  listApprovedCanonicalLegacyExecutors,\n};`;
if (executors.includes(defaultAnchor)) {
  executors = executors.replace(defaultAnchor, defaultReplacement);
} else if (!executors.includes('hasCanonicalCustomExecutor,')) {
  throw new Error('Could not update canonical executor default export');
}

// 2) Enable ONLY the source-safe descriptive H7 theft method.
const theftRegex = /(  'theft\.p225\.thiefDescriptionH7': method\(\{[\s\S]*?kashfRuntimeStatus: 'ready',\n)    runtimeAllowed: false,([\s\S]*?executionKind: 'custom-engine',\n)    executorStatus: 'pending',/;
if (theftRegex.test(registry)) {
  registry = registry.replace(theftRegex, "$1    runtimeAllowed: true,$2    executorStatus: 'ready',");
} else if (!/theft\.p225\.thiefDescriptionH7[\s\S]*?runtimeAllowed: true,[\s\S]*?executorStatus: 'ready'/.test(registry)) {
  throw new Error('Could not enable theft.p225.thiefDescriptionH7 safely');
}

// 3) Let the canonical reading engine execute approved custom engines without topic fallback.
const oldExecImport = `import {\n  hasCanonicalLegacyExecutor,\n  executeCanonicalLegacyMethod,\n} from './kashf-canonical-executors.js';`;
const newExecImport = `import {\n  hasCanonicalLegacyExecutor,\n  executeCanonicalLegacyMethod,\n  hasCanonicalCustomExecutor,\n  executeCanonicalCustomMethod,\n} from './kashf-canonical-executors.js';`;
if (readingEngine.includes(oldExecImport)) {
  readingEngine = readingEngine.replace(oldExecImport, newExecImport);
} else if (!readingEngine.includes('hasCanonicalCustomExecutor')) {
  throw new Error('Could not update canonical reading executor imports');
}

const oldHeader = ` * This first implementation supports the formula-based pilot slice only.\n * Other execution kinds stay hard-stopped until their dedicated executor is\n * implemented and explicitly enabled in the method registry.`;
const newHeader = ` * Formula methods and explicitly allowlisted method-scoped executors may run.\n * Every other execution kind stays hard-stopped until its exact executor is\n * implemented, source-audited, allowlisted, and enabled in the method registry.`;
if (readingEngine.includes(oldHeader)) readingEngine = readingEngine.replace(oldHeader, newHeader);

// Upgrade the method-scoped function runner so it can serve both audited legacy-function
// and audited custom-engine executors while preserving exact-method isolation.
const oldGate = `function buildLegacyFunctionReading(board, method, clientContext = {}) {\n  if (!hasCanonicalLegacyExecutor(method.kashfMethodId)) {\n    return blockedResult({\n      kashfMethodId: method.kashfMethodId,\n      kashfIntentId: method.kashfIntentId,\n      status: method.kashfRuntimeStatus,\n      executorStatus: method.executorStatus,\n      reason: 'canonical-legacy-executor-not-approved',\n      userMessage: 'המבצע הישן של שיטה זו לא אושר במפורש לנתיב הקנוני.',\n    });\n  }\n\n  try {\n    const legacyResult = executeCanonicalLegacyMethod(method.kashfMethodId, board);\n    if (!legacyResult || typeof legacyResult !== 'object') {\n      throw new Error('Approved canonical legacy executor returned no result');\n    }`;
const newGate = `function buildLegacyFunctionReading(board, method, clientContext = {}) {\n  const isLegacyExecutor = method.executionKind === 'legacy-function';\n  const isCustomExecutor = method.executionKind === 'custom-engine';\n  const executorApproved = isLegacyExecutor\n    ? hasCanonicalLegacyExecutor(method.kashfMethodId)\n    : isCustomExecutor\n      ? hasCanonicalCustomExecutor(method.kashfMethodId)\n      : false;\n\n  if (!executorApproved) {\n    return blockedResult({\n      kashfMethodId: method.kashfMethodId,\n      kashfIntentId: method.kashfIntentId,\n      status: method.kashfRuntimeStatus,\n      executorStatus: method.executorStatus,\n      reason: isCustomExecutor ? 'canonical-custom-executor-not-approved' : 'canonical-legacy-executor-not-approved',\n      userMessage: 'המבצע המדויק של שיטה זו לא אושר במפורש לנתיב הקנוני.',\n    });\n  }\n\n  try {\n    const executorResult = isCustomExecutor\n      ? executeCanonicalCustomMethod(method.kashfMethodId, board)\n      : executeCanonicalLegacyMethod(method.kashfMethodId, board);\n    if (!executorResult || typeof executorResult !== 'object') {\n      throw new Error('Approved canonical method-scoped executor returned no result');\n    }`;
if (readingEngine.includes(oldGate)) {
  readingEngine = readingEngine.replace(oldGate, newGate);
} else if (!readingEngine.includes('const isCustomExecutor = method.executionKind')) {
  throw new Error('Could not upgrade method-scoped executor gate');
}

readingEngine = readingEngine.replace(
  `      text: legacyResult.outputHebrew || 'ללא הכרעה מפורשת',`,
  `      text: executorResult.outputHebrew || 'ללא הכרעה מפורשת',`
);

const oldHouses = `    const houses = method.kashfMethodId === 'profession.p254.h9Planet'\n      ? [9, 10, 11]\n      : method.kashfMethodId === 'illness.bodyPart.h6Figure'\n        ? [6]\n        : [];`;
const newHouses = `    const houses = method.kashfMethodId === 'profession.p254.h9Planet'\n      ? [9, 10, 11]\n      : method.kashfMethodId === 'illness.bodyPart.h6Figure'\n        ? [6]\n        : method.kashfMethodId === 'theft.p225.thiefDescriptionH7'\n          ? [7]\n          : [];`;
if (readingEngine.includes(oldHouses)) {
  readingEngine = readingEngine.replace(oldHouses, newHouses);
} else if (!readingEngine.includes("method.kashfMethodId === 'theft.p225.thiefDescriptionH7'")) {
  throw new Error('Could not extend method-house traceability');
}

const oldResult = `    const result = {\n      type: 'legacy-function',\n      legacyResult,\n    };\n    const primaryFormula = {\n      type: 'legacy-function',`;
const newResult = `    const result = {\n      type: method.executionKind,\n      executorResult,\n      ...(isLegacyExecutor ? { legacyResult: executorResult } : {}),\n    };\n    const primaryFormula = {\n      type: method.executionKind,`;
if (readingEngine.includes(oldResult)) {
  readingEngine = readingEngine.replace(oldResult, newResult);
} else if (!readingEngine.includes('...(isLegacyExecutor ? { legacyResult: executorResult } : {})')) {
  throw new Error('Could not generalize method-scoped result shape');
}

readingEngine = readingEngine.replace(
  `        type: 'legacy-function',\n        houses,`,
  `        type: method.executionKind,\n        houses,`
);

const oldDispatch = `  if (method.executionKind === 'legacy-function') {\n    return buildLegacyFunctionReading(board, method, clientContext);\n  }\n  if (method.executionKind !== 'formula') {`;
const newDispatch = `  if (method.executionKind === 'legacy-function'\n      || (method.executionKind === 'custom-engine' && hasCanonicalCustomExecutor(method.kashfMethodId))) {\n    return buildLegacyFunctionReading(board, method, clientContext);\n  }\n  if (method.executionKind !== 'formula') {`;
if (readingEngine.includes(oldDispatch)) {
  readingEngine = readingEngine.replace(oldDispatch, newDispatch);
} else if (!readingEngine.includes("method.executionKind === 'custom-engine' && hasCanonicalCustomExecutor")) {
  throw new Error('Could not extend canonical executor dispatch');
}

// 4) Update route expectations and add execution-isolation contract tests.
const oldRouteTest = `assertRoute('q-theft-who', {\n  ok: true,\n  canRunKashf: false,\n  kashfIntentId: 'theft.thiefDescription',\n  kashfMethodId: 'theft.p225.thiefDescriptionH7',\n  kashfRuntimeStatus: 'ready',\n  executorStatus: 'pending',\n});`;
const newRouteTest = `assertRoute('q-theft-who', {\n  ok: true,\n  canRunKashf: true,\n  kashfIntentId: 'theft.thiefDescription',\n  kashfMethodId: 'theft.p225.thiefDescriptionH7',\n  kashfRuntimeStatus: 'ready',\n  executorStatus: 'ready',\n  runtimeAllowed: true,\n});`;
if (tests.includes(oldRouteTest)) {
  tests = tests.replace(oldRouteTest, newRouteTest);
} else if (!/q-theft-who[\s\S]*?canRunKashf: true,[\s\S]*?executorStatus: 'ready'/.test(tests)) {
  throw new Error('Could not update q-theft-who route contract');
}

if (!tests.includes('// ── P3 thief-description method-scoped custom executor')) {
  const testAnchor = '// ── Canonical execution isolation ----------------------------------------';
  const testBlock = [
    '// ── P3 thief-description method-scoped custom executor ----------------',
    "const thiefDescriptionRoute = assertRoute('q-theft-who', {",
    '  ok: true,',
    '  canRunKashf: true,',
    "  kashfIntentId: 'theft.thiefDescription',",
    "  kashfMethodId: 'theft.p225.thiefDescriptionH7',",
    "  kashfRuntimeStatus: 'ready',",
    "  executorStatus: 'ready',",
    '  runtimeAllowed: true,',
    '});',
    "assert(canRunKashfMethod(thiefDescriptionRoute.kashfMethodId) === true, 'thief-description canonical method is explicitly runnable');",
    "const thiefDescriptionReading = buildKashfReadingByQuestionId(PILOT_BOARD, 'q-theft-who', { question: 'מהו תיאור הגנב?' });",
    "assert(thiefDescriptionReading.valid === true, 'q-theft-who executes through canonical custom allowlist');",
    "assert(thiefDescriptionReading.canonicalExecution?.methodsExecuted?.length === 1, 'q-theft-who executes exactly one method');",
    "assert(thiefDescriptionReading.canonicalExecution?.methodsExecuted?.[0] === 'theft.p225.thiefDescriptionH7', 'q-theft-who executes the exact H7 description method only');",
    "assert(thiefDescriptionReading.primaryFormula?.houses?.length === 1 && thiefDescriptionReading.primaryFormula.houses[0] === 7, 'q-theft-who traceability records H7 only');",
    "assert(thiefDescriptionReading.primaryFormula?.result?.executorResult?.figureKey === '1221', 'pilot board H7 is passed as the canonical figure key');",
    "assert(String(thiefDescriptionReading.primaryFormula?.result?.executorResult?.description || '').includes('רחב בטן'), 'H7=1221 resolves to the source description table');",
    "assert(thiefDescriptionReading.canonicalExecution?.altFormulaExecuted === false, 'q-theft-who does not execute alt formula');",
    "assert(thiefDescriptionReading.canonicalExecution?.topicSupportingChecksExecuted === false, 'q-theft-who does not execute theft supporting checks');",
    "assert(thiefDescriptionReading.canonicalExecution?.topicBundleExecuted === false, 'q-theft-who does not execute theft topic bundle');",
    "assert(thiefDescriptionReading.overallPositive === null, 'descriptive thief profile does not invent a positive/negative verdict');",
    "assert(String(thiefDescriptionReading.verdict?.text || '').includes('תיאור הגנב'), 'thief-description verdict is explicitly descriptive');",
    'const thiefDescriptionHtml = writeCanonicalKashfReading(thiefDescriptionReading);',
    "assert(thiefDescriptionHtml.includes('theft.p225.thiefDescriptionH7'), 'thief-description writer identifies exact canonical method');",
    "assert(thiefDescriptionHtml.includes('רחב בטן'), 'thief-description writer renders the source-table description');",
    "assert(!thiefDescriptionHtml.includes('ניתוח תומך לפי ספר'), 'thief-description writer contains no broad theft support section');",
    "assert(!thiefDescriptionHtml.includes('מחשבת השואל (הדמיר)'), 'thief-description writer contains no automatic Dhamir');",
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

console.log('Thief-description canonical custom executor cutover passed.');
