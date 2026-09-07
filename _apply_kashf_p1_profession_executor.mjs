import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const enginePath = 'goral-hachol/engine/kashf-canonical-reading-engine.js';
const registryPath = 'goral-hachol/registry/kashf-canonical-method-registry.js';
const testPath = '_test_kashf_canonical_routing.mjs';

let engine = fs.readFileSync(enginePath, 'utf8');
let registry = fs.readFileSync(registryPath, 'utf8');
let tests = fs.readFileSync(testPath, 'utf8');

// 1) Wire the exact-method legacy executor allowlist into the canonical engine.
const importAnchor = "import { requireRunnableKashfRoute } from './kashf-method-router.js';\n";
const executorImport = "import {\n  hasCanonicalLegacyExecutor,\n  executeCanonicalLegacyMethod,\n} from './kashf-canonical-executors.js';\n";
if (!engine.includes(executorImport)) {
  if (!engine.includes(importAnchor)) throw new Error('canonical engine import anchor not found');
  engine = engine.replace(importAnchor, importAnchor + executorImport);
}

const buildAnchor = "/**\n * Executes ONE explicitly selected canonical Kashf method.\n * No topic fallback, no alt formula, no supporting bundle.\n */\nexport function buildKashfReadingByMethod";
if (!engine.includes('function buildLegacyFunctionReading(')) {
  const helper = `function buildLegacyFunctionReading(board, method, clientContext = {}) {\n  if (!hasCanonicalLegacyExecutor(method.kashfMethodId)) {\n    return blockedResult({\n      kashfMethodId: method.kashfMethodId,\n      kashfIntentId: method.kashfIntentId,\n      status: method.kashfRuntimeStatus,\n      executorStatus: method.executorStatus,\n      reason: 'canonical-legacy-executor-not-approved',\n      userMessage: 'המבצע הישן של שיטה זו לא אושר במפורש לנתיב הקנוני.',\n    });\n  }\n\n  try {\n    const legacyResult = executeCanonicalLegacyMethod(method.kashfMethodId, board);\n    if (!legacyResult || typeof legacyResult !== 'object') {\n      throw new Error('Approved canonical legacy executor returned no result');\n    }\n\n    const verdict = {\n      text: legacyResult.outputHebrew || 'ללא הכרעה מפורשת',\n      positive: null,\n    };\n    const topicRules = method.legacyTopicId ? getTopicRules(method.legacyTopicId) : null;\n    const houses = method.kashfMethodId === 'profession.p254.h9Planet' ? [9, 10, 11] : [];\n    const result = {\n      type: 'legacy-function',\n      legacyResult,\n    };\n    const primaryFormula = {\n      type: 'legacy-function',\n      houses,\n      result,\n      verdict,\n      sourceText: '',\n    };\n\n    return {\n      valid: true,\n      status: 'ok',\n      canRunKashf: true,\n      kashfIntentId: method.kashfIntentId,\n      kashfMethodId: method.kashfMethodId,\n      kashfRuntimeStatus: method.kashfRuntimeStatus,\n      executorStatus: method.executorStatus,\n      methodRole: method.methodRole,\n      topicId: method.topicId || method.legacyTopicId,\n      topicHebrewName: topicRules?.topicHebrewName || method.kashfIntentId,\n      topicDescription: topicRules?.topicDescription || '',\n      sourceRef: \\`כשף אל-אסרר, עמ׳ \\${method.sourcePages.join('–')}\\`,\n      primaryFormula,\n      altFormula: null,\n      supportingFindings: [],\n      keyHouseReadings: [],\n      boardValidation: board?.boardValidation || { isValid: true, warnings: [] },\n      dhamir: null,\n      dhamirType4External: null,\n      dhamirExtras: null,\n      witnessTestimony: null,\n      source: {\n        sourceVolume: method.sourceVolume,\n        sourcePages: method.sourcePages,\n        sourceLayer: method.sourceLayer,\n        attributedSourceBook: method.attributedSourceBook,\n        sourceConfidence: method.sourceConfidence,\n      },\n      clientContext: {\n        name: clientContext.name || '',\n        question: clientContext.question || '',\n        age: clientContext.age || '',\n        gender: clientContext.gender || '',\n        maritalStatus: clientContext.maritalStatus || null,\n        workStatus: clientContext.workStatus || null,\n        hasChildren: clientContext.hasChildren || null,\n        parentName: clientContext.parentName || '',\n        quesitedName: clientContext.quesitedName || '',\n        phone: clientContext.phone || '',\n        dynFields: clientContext.dynFields || {},\n      },\n      formula: {\n        type: 'legacy-function',\n        houses,\n        sourceText: '',\n        result,\n      },\n      verdict,\n      overallPositive: null,\n      canonicalExecution: {\n        methodsExecuted: [method.kashfMethodId],\n        altFormulaExecuted: false,\n        topicSupportingChecksExecuted: false,\n        topicBundleExecuted: false,\n      },\n    };\n  } catch (err) {\n    return {\n      valid: false,\n      status: 'error',\n      canRunKashf: false,\n      kashfIntentId: method.kashfIntentId,\n      kashfMethodId: method.kashfMethodId,\n      kashfRuntimeStatus: method.kashfRuntimeStatus,\n      executorStatus: method.executorStatus,\n      verdict: null,\n      overallPositive: null,\n      reason: 'canonical-execution-error',\n      error: err instanceof Error ? err.message : String(err),\n    };\n  }\n}\n\n`;
  if (!engine.includes(buildAnchor)) throw new Error('canonical engine build anchor not found');
  engine = engine.replace(buildAnchor, helper + buildAnchor);
}

const formulaOnlyBlock = `  if (method.executionKind !== 'formula') {\n    return blockedResult({\n      kashfMethodId,\n      kashfIntentId: method.kashfIntentId,\n      status: method.kashfRuntimeStatus,\n      executorStatus: method.executorStatus,\n      reason: 'canonical-executor-not-enabled',\n      userMessage: 'סוג המבצע הקנוני של השיטה עדיין אינו נתמך בנתיב P0.',\n    });\n  }\n`;
const executionDispatch = `  if (method.executionKind === 'legacy-function') {\n    return buildLegacyFunctionReading(board, method, clientContext);\n  }\n\n${formulaOnlyBlock}`;
if (!engine.includes("if (method.executionKind === 'legacy-function')")) {
  if (!engine.includes(formulaOnlyBlock)) throw new Error('formula-only dispatch block not found');
  engine = engine.replace(formulaOnlyBlock, executionDispatch);
}

// 2) Enable ONLY the source-audited profession helper.
const professionRegex = /(  'profession\.p254\.h9Planet': method\(\{[\s\S]*?kashfRuntimeStatus: 'ready',\n)    runtimeAllowed: false,([\s\S]*?executionKind: 'legacy-function',\n)    executorStatus: 'pending',/;
if (professionRegex.test(registry)) {
  registry = registry.replace(professionRegex, '$1    runtimeAllowed: true,$2    executorStatus: \'ready\',');
} else if (!/profession\.p254\.h9Planet[\s\S]*?runtimeAllowed: true,[\s\S]*?executorStatus: 'ready'/.test(registry)) {
  throw new Error('profession registry block not found or unexpected');
}

// 3) Add contract tests proving exact-method isolation for the profession executor.
if (!tests.includes('// ── P1 profession method-scoped legacy executor')) {
  const testAnchor = '// ── Canonical execution isolation ----------------------------------------';
  const testBlock = `// ── P1 profession method-scoped legacy executor -------------------------\nconst professionRoute = assertRoute('q-profession', {\n  ok: true,\n  canRunKashf: true,\n  kashfIntentId: 'profession.type',\n  kashfMethodId: 'profession.p254.h9Planet',\n  kashfRuntimeStatus: 'ready',\n  executorStatus: 'ready',\n  runtimeAllowed: true,\n});\nassert(canRunKashfMethod(professionRoute.kashfMethodId) === true, 'profession canonical method is explicitly runnable');\nconst professionReading = buildKashfReadingByQuestionId(PILOT_BOARD, 'q-profession', { question: 'מה המלאכה המורה עלי?' });\nassert(professionReading.valid === true, 'q-profession executes through canonical legacy allowlist');\nassert(professionReading.canonicalExecution?.methodsExecuted?.length === 1, 'q-profession executes exactly one method');\nassert(professionReading.canonicalExecution?.methodsExecuted?.[0] === 'profession.p254.h9Planet', 'q-profession executes the exact p254 method only');\nassert(professionReading.canonicalExecution?.altFormulaExecuted === false, 'q-profession does not execute alt formula');\nassert(professionReading.canonicalExecution?.topicSupportingChecksExecuted === false, 'q-profession does not execute authorityState supporting checks');\nassert(professionReading.canonicalExecution?.topicBundleExecuted === false, 'q-profession does not execute authorityState bundle');\nassert(typeof professionReading.verdict?.text === 'string' && professionReading.verdict.text.length > 0, 'q-profession exposes profession result text');\nassert(professionReading.overallPositive === null, 'profession method does not invent a binary positive/negative verdict');\nconst professionHtml = writeCanonicalKashfReading(professionReading);\nassert(professionHtml.includes('profession.p254.h9Planet'), 'profession writer identifies exact canonical method');\nassert(!professionHtml.includes('בדיקת אימות נוספת'), 'profession writer contains no alt-formula section');\nassert(!professionHtml.includes('ניתוח תומך לפי ספר'), 'profession writer contains no broad topic support section');\nassert(!professionHtml.includes('מחשבת השואל (הדמיר)'), 'profession writer contains no automatic Dhamir');\nassert(!professionHtml.includes('עדים ודיין'), 'profession writer contains no witness/judge bundle');\n\n`;
  if (!tests.includes(testAnchor)) throw new Error('test insertion anchor not found');
  tests = tests.replace(testAnchor, testBlock + testAnchor);
}

fs.writeFileSync(enginePath, engine);
fs.writeFileSync(registryPath, registry);
fs.writeFileSync(testPath, tests);

for (const [cmd, args] of [
  ['node', ['_test_kashf_canonical_routing.mjs']],
  ['node', ['_audit_kashf_question_route_coverage.mjs']],
]) {
  const result = spawnSync(cmd, args, { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
