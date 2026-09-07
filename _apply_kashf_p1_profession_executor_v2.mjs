import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const enginePath = 'goral-hachol/engine/kashf-canonical-reading-engine.js';
const registryPath = 'goral-hachol/registry/kashf-canonical-method-registry.js';
const testPath = '_test_kashf_canonical_routing.mjs';

let engine = fs.readFileSync(enginePath, 'utf8');
let registry = fs.readFileSync(registryPath, 'utf8');
let tests = fs.readFileSync(testPath, 'utf8');

const importAnchor = "import { requireRunnableKashfRoute } from './kashf-method-router.js';\n";
const executorImport = [
  "import {",
  "  hasCanonicalLegacyExecutor,",
  "  executeCanonicalLegacyMethod,",
  "} from './kashf-canonical-executors.js';",
  "",
].join('\n');
if (!engine.includes("from './kashf-canonical-executors.js'")) {
  if (!engine.includes(importAnchor)) throw new Error('canonical engine import anchor not found');
  engine = engine.replace(importAnchor, importAnchor + executorImport);
}

const buildAnchor = [
  '/**',
  ' * Executes ONE explicitly selected canonical Kashf method.',
  ' * No topic fallback, no alt formula, no supporting bundle.',
  ' */',
  'export function buildKashfReadingByMethod',
].join('\n');

if (!engine.includes('function buildLegacyFunctionReading(')) {
  const helper = [
    'function buildLegacyFunctionReading(board, method, clientContext = {}) {',
    '  if (!hasCanonicalLegacyExecutor(method.kashfMethodId)) {',
    '    return blockedResult({',
    '      kashfMethodId: method.kashfMethodId,',
    '      kashfIntentId: method.kashfIntentId,',
    '      status: method.kashfRuntimeStatus,',
    '      executorStatus: method.executorStatus,',
    "      reason: 'canonical-legacy-executor-not-approved',",
    "      userMessage: 'המבצע הישן של שיטה זו לא אושר במפורש לנתיב הקנוני.',",
    '    });',
    '  }',
    '',
    '  try {',
    '    const legacyResult = executeCanonicalLegacyMethod(method.kashfMethodId, board);',
    "    if (!legacyResult || typeof legacyResult !== 'object') {",
    "      throw new Error('Approved canonical legacy executor returned no result');",
    '    }',
    '',
    '    const verdict = {',
    "      text: legacyResult.outputHebrew || 'ללא הכרעה מפורשת',",
    '      positive: null,',
    '    };',
    '    const topicRules = method.legacyTopicId ? getTopicRules(method.legacyTopicId) : null;',
    "    const houses = method.kashfMethodId === 'profession.p254.h9Planet' ? [9, 10, 11] : [];",
    '    const result = {',
    "      type: 'legacy-function',",
    '      legacyResult,',
    '    };',
    '    const primaryFormula = {',
    "      type: 'legacy-function',",
    '      houses,',
    '      result,',
    '      verdict,',
    "      sourceText: '',",
    '    };',
    '',
    '    return {',
    '      valid: true,',
    "      status: 'ok',",
    '      canRunKashf: true,',
    '      kashfIntentId: method.kashfIntentId,',
    '      kashfMethodId: method.kashfMethodId,',
    '      kashfRuntimeStatus: method.kashfRuntimeStatus,',
    '      executorStatus: method.executorStatus,',
    '      methodRole: method.methodRole,',
    '      topicId: method.topicId || method.legacyTopicId,',
    '      topicHebrewName: topicRules?.topicHebrewName || method.kashfIntentId,',
    "      topicDescription: topicRules?.topicDescription || '',",
    "      sourceRef: 'כשף אל-אסרר, עמ׳ ' + method.sourcePages.join('–'),",
    '      primaryFormula,',
    '      altFormula: null,',
    '      supportingFindings: [],',
    '      keyHouseReadings: [],',
    '      boardValidation: board?.boardValidation || { isValid: true, warnings: [] },',
    '      dhamir: null,',
    '      dhamirType4External: null,',
    '      dhamirExtras: null,',
    '      witnessTestimony: null,',
    '      source: {',
    '        sourceVolume: method.sourceVolume,',
    '        sourcePages: method.sourcePages,',
    '        sourceLayer: method.sourceLayer,',
    '        attributedSourceBook: method.attributedSourceBook,',
    '        sourceConfidence: method.sourceConfidence,',
    '      },',
    '      clientContext: {',
    "        name: clientContext.name || '',",
    "        question: clientContext.question || '',",
    "        age: clientContext.age || '',",
    "        gender: clientContext.gender || '',",
    '        maritalStatus: clientContext.maritalStatus || null,',
    '        workStatus: clientContext.workStatus || null,',
    '        hasChildren: clientContext.hasChildren || null,',
    "        parentName: clientContext.parentName || '',",
    "        quesitedName: clientContext.quesitedName || '',",
    "        phone: clientContext.phone || '',",
    '        dynFields: clientContext.dynFields || {},',
    '      },',
    '      formula: {',
    "        type: 'legacy-function',",
    '        houses,',
    "        sourceText: '',",
    '        result,',
    '      },',
    '      verdict,',
    '      overallPositive: null,',
    '      canonicalExecution: {',
    '        methodsExecuted: [method.kashfMethodId],',
    '        altFormulaExecuted: false,',
    '        topicSupportingChecksExecuted: false,',
    '        topicBundleExecuted: false,',
    '      },',
    '    };',
    '  } catch (err) {',
    '    return {',
    '      valid: false,',
    "      status: 'error',",
    '      canRunKashf: false,',
    '      kashfIntentId: method.kashfIntentId,',
    '      kashfMethodId: method.kashfMethodId,',
    '      kashfRuntimeStatus: method.kashfRuntimeStatus,',
    '      executorStatus: method.executorStatus,',
    '      verdict: null,',
    '      overallPositive: null,',
    "      reason: 'canonical-execution-error',",
    '      error: err instanceof Error ? err.message : String(err),',
    '    };',
    '  }',
    '}',
    '',
  ].join('\n');
  if (!engine.includes(buildAnchor)) throw new Error('canonical engine build anchor not found');
  engine = engine.replace(buildAnchor, helper + buildAnchor);
}

const formulaOnlyBlock = [
  "  if (method.executionKind !== 'formula') {",
  '    return blockedResult({',
  '      kashfMethodId,',
  '      kashfIntentId: method.kashfIntentId,',
  '      status: method.kashfRuntimeStatus,',
  '      executorStatus: method.executorStatus,',
  "      reason: 'canonical-executor-not-enabled',",
  "      userMessage: 'סוג המבצע הקנוני של השיטה עדיין אינו נתמך בנתיב P0.',",
  '    });',
  '  }',
].join('\n') + '\n';
const executionDispatch = [
  "  if (method.executionKind === 'legacy-function') {",
  '    return buildLegacyFunctionReading(board, method, clientContext);',
  '  }',
  '',
].join('\n') + formulaOnlyBlock;
if (!engine.includes("if (method.executionKind === 'legacy-function')")) {
  if (!engine.includes(formulaOnlyBlock)) throw new Error('formula-only dispatch block not found');
  engine = engine.replace(formulaOnlyBlock, executionDispatch);
}

const professionRegex = /(  'profession\.p254\.h9Planet': method\(\{[\s\S]*?kashfRuntimeStatus: 'ready',\n)    runtimeAllowed: false,([\s\S]*?executionKind: 'legacy-function',\n)    executorStatus: 'pending',/;
if (professionRegex.test(registry)) {
  registry = registry.replace(professionRegex, "$1    runtimeAllowed: true,$2    executorStatus: 'ready',");
} else if (!/profession\.p254\.h9Planet[\s\S]*?runtimeAllowed: true,[\s\S]*?executorStatus: 'ready'/.test(registry)) {
  throw new Error('profession registry block not found or unexpected');
}

if (!tests.includes('// ── P1 profession method-scoped legacy executor')) {
  const testAnchor = '// ── Canonical execution isolation ----------------------------------------';
  const testBlock = [
    '// ── P1 profession method-scoped legacy executor -------------------------',
    "const professionRoute = assertRoute('q-profession', {",
    '  ok: true,',
    '  canRunKashf: true,',
    "  kashfIntentId: 'profession.type',",
    "  kashfMethodId: 'profession.p254.h9Planet',",
    "  kashfRuntimeStatus: 'ready',",
    "  executorStatus: 'ready',",
    '  runtimeAllowed: true,',
    '});',
    "assert(canRunKashfMethod(professionRoute.kashfMethodId) === true, 'profession canonical method is explicitly runnable');",
    "const professionReading = buildKashfReadingByQuestionId(PILOT_BOARD, 'q-profession', { question: 'מה המלאכה המורה עלי?' });",
    "assert(professionReading.valid === true, 'q-profession executes through canonical legacy allowlist');",
    "assert(professionReading.canonicalExecution?.methodsExecuted?.length === 1, 'q-profession executes exactly one method');",
    "assert(professionReading.canonicalExecution?.methodsExecuted?.[0] === 'profession.p254.h9Planet', 'q-profession executes the exact p254 method only');",
    "assert(professionReading.canonicalExecution?.altFormulaExecuted === false, 'q-profession does not execute alt formula');",
    "assert(professionReading.canonicalExecution?.topicSupportingChecksExecuted === false, 'q-profession does not execute authorityState supporting checks');",
    "assert(professionReading.canonicalExecution?.topicBundleExecuted === false, 'q-profession does not execute authorityState bundle');",
    "assert(typeof professionReading.verdict?.text === 'string' && professionReading.verdict.text.length > 0, 'q-profession exposes profession result text');",
    "assert(professionReading.overallPositive === null, 'profession method does not invent a binary positive/negative verdict');",
    'const professionHtml = writeCanonicalKashfReading(professionReading);',
    "assert(professionHtml.includes('profession.p254.h9Planet'), 'profession writer identifies exact canonical method');",
    "assert(!professionHtml.includes('בדיקת אימות נוספת'), 'profession writer contains no alt-formula section');",
    "assert(!professionHtml.includes('ניתוח תומך לפי ספר'), 'profession writer contains no broad topic support section');",
    "assert(!professionHtml.includes('מחשבת השואל (הדמיר)'), 'profession writer contains no automatic Dhamir');",
    "assert(!professionHtml.includes('עדים ודיין'), 'profession writer contains no witness/judge bundle');",
    '',
  ].join('\n');
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
