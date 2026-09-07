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

// Source audit for Kashf p191 + classification pages p57-p60:
// - Silent figures are the six feminine/night figures listed by the source.
// - Empty figures are the four external figures listed by the source.
// - The remaining six figures are NOT forced into either verdict.
// This intentionally replaces the old broad helper's incorrect startsWith('2') shortcut.
const pregnancyExecutor = `
const P191_SILENT_PATTERNS = new Set([
  '1211', // בר הלחי / نقي الخد
  '2111', // סף נכנס / عتبة داخلة
  '2121', // ממון נכנס / القبض الداخل
  '2211', // כבוד נכנס / نصرة داخلة
  '2212', // לבן / البياض
  '2221', // שפל ראש / الأنكيس
]);

const P191_EMPTY_PATTERNS = new Set([
  '1112', // סף יוצא / عتبة خارجة
  '1122', // כבוד יוצא / نصرة خارجة
  '1212', // ממון יוצא / القبض الخارج
  '1222', // נשוא ראש / الأحيان
]);

function computePregnancyExistenceP191(chart) {
  if (!Array.isArray(chart)) return null;
  const h5 = chart.find((entry) => Number(entry?.house) === 5)
    || chart.find((entry) => Number(entry?.houseNumber) === 5)
    || chart[4]
    || null;
  const pattern = h5?.key || h5?.pattern || null;
  if (!pattern) return null;

  const figureHebrew = h5?.hebrew || h5?.hebrewName || pattern;
  const isSilent = P191_SILENT_PATTERNS.has(pattern);
  const isEmpty = P191_EMPTY_PATTERNS.has(pattern);
  const pregnancyExists = isSilent ? true : isEmpty ? false : null;
  const classification = isSilent ? 'silent' : isEmpty ? 'empty' : 'unresolved';
  const classificationHebrew = isSilent ? 'שותקת' : isEmpty ? 'ריקה' : 'לא הוכרעה בכלל זה';

  let outputHebrew;
  if (pregnancyExists === true) {
    outputHebrew = \`בית 5: \${figureHebrew} (\${pattern}) — צורה שותקת. לפי כשף עמ׳ 191: ההריון נכון.\`;
  } else if (pregnancyExists === false) {
    outputHebrew = \`בית 5: \${figureHebrew} (\${pattern}) — צורה ריקה. לפי כשף עמ׳ 191: ההריון בטל.\`;
  } else {
    outputHebrew = \`בית 5: \${figureHebrew} (\${pattern}) — הצורה אינה מן השותקות ואינה מן הריקות שנקבעו בכלל זה. כשף עמ׳ 191 לבדו אינו מכריע אם ההריון נכון או בטל.\`;
  }

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 191; סיווגי הצורות עמ׳ 57–60',
    sourceText: 'אם בבית החמישי נמצאת צורה שותקת — ההריון נכון; ואם נמצאת בו צורה ריקה — ההריון בטל.',
    houseNumber: 5,
    h5Pattern: pattern,
    h5FigureHebrew: figureHebrew,
    classification,
    classificationHebrew,
    pregnancyExists,
    positive: pregnancyExists,
    outputHebrew,
  };
}
`;

if (!executors.includes('function computePregnancyExistenceP191')) {
  const customAnchor = `const CUSTOM_EXECUTORS = Object.freeze({\n  'theft.p225.thiefDescriptionH7': computeThiefPhysicalDescriptionKashf,\n});`;
  if (!executors.includes(customAnchor)) throw new Error('Could not find custom executor allowlist anchor');
  const replacement = pregnancyExecutor + `\nconst CUSTOM_EXECUTORS = Object.freeze({\n  'theft.p225.thiefDescriptionH7': computeThiefPhysicalDescriptionKashf,\n  'pregnancy.p191.existsH5SilentEmpty': computePregnancyExistenceP191,\n});`;
  executors = executors.replace(customAnchor, replacement);
} else if (!executors.includes("'pregnancy.p191.existsH5SilentEmpty': computePregnancyExistenceP191")) {
  executors = executors.replace(
    "  'theft.p225.thiefDescriptionH7': computeThiefPhysicalDescriptionKashf,\n",
    "  'theft.p225.thiefDescriptionH7': computeThiefPhysicalDescriptionKashf,\n  'pregnancy.p191.existsH5SilentEmpty': computePregnancyExistenceP191,\n"
  );
}

// Enable the exact p191 method only.
const pregnancyRegex = /(  'pregnancy\.p191\.existsH5SilentEmpty': method\(\{[\s\S]*?kashfRuntimeStatus: 'ready',\n)    runtimeAllowed: false,([\s\S]*?executionKind: 'custom-engine',\n)    executorStatus: 'pending',/;
if (pregnancyRegex.test(registry)) {
  registry = registry.replace(pregnancyRegex, "$1    runtimeAllowed: true,$2    executorStatus: 'ready',");
} else if (!/pregnancy\.p191\.existsH5SilentEmpty[\s\S]*?runtimeAllowed: true,[\s\S]*?executorStatus: 'ready'/.test(registry)) {
  throw new Error('Could not enable pregnancy.p191.existsH5SilentEmpty safely');
}

// Make the registry note source-exact: p191 does not say every non-silent figure is empty.
registry = registry.replace(
  "notes: 'Canonical body rule: H5 silent => pregnancy true; H5 empty => pregnancy false. Do not substitute benefic/malefic.',",
  "notes: 'Canonical body rule: H5 silent => pregnancy true; H5 empty => pregnancy false. Figures that are neither silent nor empty remain unresolved by this rule. Do not substitute benefic/malefic.',"
);

// Clean the stale documentation note left after the previous body-part cutover.
registry = registry.replace(
  "notes: 'Use the verified H6 figure → body-part mapping only; canonical legacy-function executor is not wired yet.',",
  "notes: 'Use the verified H6 figure → body-part mapping only; method-scoped canonical legacy executor is wired and isolated from the broad illness bundle.',"
);

// Method-scoped executor verdicts may be binary when the source itself is binary.
const oldVerdict = `    const verdict = {\n      text: executorResult.outputHebrew || 'ללא הכרעה מפורשת',\n      positive: null,\n    };`;
const newVerdict = `    const verdict = {\n      text: executorResult.outputHebrew || 'ללא הכרעה מפורשת',\n      positive: typeof executorResult.positive === 'boolean' ? executorResult.positive : null,\n    };`;
if (readingEngine.includes(oldVerdict)) {
  readingEngine = readingEngine.replace(oldVerdict, newVerdict);
} else if (!readingEngine.includes("positive: typeof executorResult.positive === 'boolean'")) {
  throw new Error('Could not enable method-scoped binary verdict passthrough');
}

const oldHouses = `    const houses = method.kashfMethodId === 'profession.p254.h9Planet'\n      ? [9, 10, 11]\n      : method.kashfMethodId === 'illness.bodyPart.h6Figure'\n        ? [6]\n        : method.kashfMethodId === 'theft.p225.thiefDescriptionH7'\n          ? [7]\n          : [];`;
const newHouses = `    const houses = method.kashfMethodId === 'profession.p254.h9Planet'\n      ? [9, 10, 11]\n      : method.kashfMethodId === 'illness.bodyPart.h6Figure'\n        ? [6]\n        : method.kashfMethodId === 'theft.p225.thiefDescriptionH7'\n          ? [7]\n          : method.kashfMethodId === 'pregnancy.p191.existsH5SilentEmpty'\n            ? [5]\n            : [];`;
if (readingEngine.includes(oldHouses)) {
  readingEngine = readingEngine.replace(oldHouses, newHouses);
} else if (!readingEngine.includes("method.kashfMethodId === 'pregnancy.p191.existsH5SilentEmpty'")) {
  throw new Error('Could not add H5 traceability');
}

readingEngine = readingEngine.replace(
  `      sourceText: '',\n    };`,
  `      sourceText: executorResult.sourceText || '',\n    };`
);
readingEngine = readingEngine.replace(
  `        sourceText: '',\n        result,`,
  `        sourceText: executorResult.sourceText || '',\n        result,`
);
readingEngine = readingEngine.replace(
  `      overallPositive: null,`,
  `      overallPositive: verdict.positive,`
);

// Insert P4 pregnancy contracts before canonical isolation.
if (!tests.includes('// ── P4 pregnancy-exists p191 custom executor')) {
  const anchor = '// ── Canonical execution isolation ----------------------------------------';
  if (!tests.includes(anchor)) throw new Error('Could not find canonical isolation test anchor');

  const block = [
    '// ── P4 pregnancy-exists p191 custom executor -------------------------',
    "const pregnancyRoute = assertRoute('q-pregnancy', {",
    '  ok: true,',
    '  canRunKashf: true,',
    "  kashfIntentId: 'pregnancy.exists',",
    "  kashfMethodId: 'pregnancy.p191.existsH5SilentEmpty',",
    "  kashfRuntimeStatus: 'ready',",
    "  executorStatus: 'ready',",
    '  runtimeAllowed: true,',
    '});',
    "assert(canRunKashfMethod(pregnancyRoute.kashfMethodId) === true, 'pregnancy-exists canonical method is explicitly runnable');",
    "const pregnancyReading = buildKashfReadingByQuestionId(PILOT_BOARD, 'q-pregnancy', { question: 'האם יש הריון?' });",
    "assert(pregnancyReading.valid === true, 'q-pregnancy executes through canonical custom allowlist');",
    "assert(pregnancyReading.canonicalExecution?.methodsExecuted?.length === 1, 'q-pregnancy executes exactly one method');",
    "assert(pregnancyReading.canonicalExecution?.methodsExecuted?.[0] === 'pregnancy.p191.existsH5SilentEmpty', 'q-pregnancy executes the exact p191 method only');",
    "assert(pregnancyReading.primaryFormula?.houses?.length === 1 && pregnancyReading.primaryFormula.houses[0] === 5, 'q-pregnancy traceability records H5 only');",
    "assert(pregnancyReading.primaryFormula?.result?.executorResult?.h5Pattern === '1212', 'pilot board H5 is ממון יוצא / 1212');",
    "assert(pregnancyReading.primaryFormula?.result?.executorResult?.classification === 'empty', 'H5=1212 is source-classified as empty');",
    "assert(pregnancyReading.primaryFormula?.result?.executorResult?.pregnancyExists === false, 'empty H5 yields pregnancy false by p191');",
    "assert(pregnancyReading.verdict?.positive === false && pregnancyReading.overallPositive === false, 'binary p191 verdict is propagated without topic voting');",
    "assert(String(pregnancyReading.verdict?.text || '').includes('ההריון בטל'), 'empty H5 renders the exact p191 negative rule');",
    "assert(pregnancyReading.canonicalExecution?.altFormulaExecuted === false, 'q-pregnancy does not execute alt formula');",
    "assert(pregnancyReading.canonicalExecution?.topicSupportingChecksExecuted === false, 'q-pregnancy does not execute children supporting checks');",
    "assert(pregnancyReading.canonicalExecution?.topicBundleExecuted === false, 'q-pregnancy does not execute children topic bundle');",
    'const pregnancyHtml = writeCanonicalKashfReading(pregnancyReading);',
    "assert(pregnancyHtml.includes('pregnancy.p191.existsH5SilentEmpty'), 'pregnancy writer identifies exact canonical method');",
    "assert(pregnancyHtml.includes('ההריון בטל'), 'pregnancy writer renders the p191 result');",
    "assert(pregnancyHtml.includes('אם בבית החמישי נמצאת צורה שותקת'), 'pregnancy writer exposes the exact source rule');",
    "assert(!pregnancyHtml.includes('ניתוח תומך לפי ספר'), 'pregnancy writer contains no broad children support section');",
    "assert(!pregnancyHtml.includes('מחשבת השואל (הדמיר)'), 'pregnancy writer contains no automatic Dhamir');",
    '',
    '// Positive-path source guard: H5=2111 is סף נכנס, one of the six silent figures.',
    "const PREGNANCY_SILENT_BOARD = buildRamlBoardFromMothers(['2122', '1112', '1121', '1211']);",
    "const pregnancySilentReading = buildKashfReadingByQuestionId(PREGNANCY_SILENT_BOARD, 'q-pregnancy', { question: 'האם יש הריון?' });",
    "assert(pregnancySilentReading.primaryFormula?.result?.executorResult?.h5Pattern === '2111', 'silent guard board produces H5=2111');",
    "assert(pregnancySilentReading.primaryFormula?.result?.executorResult?.classification === 'silent', 'H5=2111 is source-classified as silent');",
    "assert(pregnancySilentReading.primaryFormula?.result?.executorResult?.pregnancyExists === true, 'silent H5 yields pregnancy true by p191');",
    "assert(pregnancySilentReading.verdict?.positive === true && pregnancySilentReading.overallPositive === true, 'silent H5 positive verdict is propagated');",
    "assert(String(pregnancySilentReading.verdict?.text || '').includes('ההריון נכון'), 'silent H5 renders the exact p191 positive rule');",
    '',
    '// Non-invention guard: p191 does not say every other figure means no pregnancy.',
    "const PREGNANCY_UNRESOLVED_BOARD = buildRamlBoardFromMothers(['1112', '1121', '1211', '1221']);",
    "const pregnancyUnresolvedReading = buildKashfReadingByQuestionId(PREGNANCY_UNRESOLVED_BOARD, 'q-pregnancy', { question: 'האם יש הריון?' });",
    "assert(pregnancyUnresolvedReading.primaryFormula?.result?.executorResult?.h5Pattern === '1111', 'unresolved guard board produces H5=1111 / דרך');",
    "assert(pregnancyUnresolvedReading.primaryFormula?.result?.executorResult?.classification === 'unresolved', 'H5=1111 is neither silent nor empty for this p191 rule');",
    "assert(pregnancyUnresolvedReading.primaryFormula?.result?.executorResult?.pregnancyExists === null, 'unclassified p191 figure does not invent a no-pregnancy verdict');",
    "assert(pregnancyUnresolvedReading.verdict?.positive === null && pregnancyUnresolvedReading.overallPositive === null, 'unresolved p191 figure remains neutral');",
    "assert(String(pregnancyUnresolvedReading.verdict?.text || '').includes('אינו מכריע'), 'unresolved p191 result is explicit rather than fabricated');",
    '',
  ].join('\n');

  tests = tests.replace(anchor, block + anchor);
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

console.log('Pregnancy-exists p191 canonical executor cutover passed.');
