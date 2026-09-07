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

// Kashf p191 says: if the H5 figure is masculine, the child is male;
// if feminine, the child is female. Pages 59-60 define six masculine,
// six feminine, and four androgynous figures. The androgynous four remain
// unresolved by this specific p191 rule and must not be forced into a sex.
const genderExecutor = `
const P191_MASCULINE_PATTERNS = new Set([
  '1112', // סף יוצא / عتبة خارجة
  '1121', // נלחם / جودلة
  '1122', // כבוד יוצא / نصرة خارجة
  '1212', // ממון יוצא / القبض الخارج
  '1222', // נשוא ראש / الأحيان
  '2122', // אדום / الحمرة
]);

const P191_FEMININE_PATTERNS = new Set([
  '1211', // בר הלחי / نقي الخد
  '2111', // סף נכנס / عتبة داخلة
  '2121', // ממון נכנס / القبض الداخل
  '2211', // כבוד נכנס / نصرة داخلة
  '2212', // לבן / البياض
  '2221', // שפל ראש / الأنكيس
]);

function computePregnancyGenderP191(chart) {
  if (!Array.isArray(chart)) return null;
  const h5 = chart.find((entry) => Number(entry?.house) === 5)
    || chart.find((entry) => Number(entry?.houseNumber) === 5)
    || chart[4]
    || null;
  const pattern = h5?.key || h5?.pattern || null;
  if (!pattern) return null;

  const figureHebrew = h5?.hebrew || h5?.hebrewName || pattern;
  const isMasculine = P191_MASCULINE_PATTERNS.has(pattern);
  const isFeminine = P191_FEMININE_PATTERNS.has(pattern);
  const gender = isMasculine ? 'male' : isFeminine ? 'female' : null;
  const genderHebrew = isMasculine ? 'זכר' : isFeminine ? 'נקבה' : 'לא הוכרע בכלל זה';

  let outputHebrew;
  if (gender === 'male') {
    outputHebrew = \`בית 5: \${figureHebrew} (\${pattern}) — צורה זכרית. לפי כשף עמ׳ 191: הוולד זכר.\`;
  } else if (gender === 'female') {
    outputHebrew = \`בית 5: \${figureHebrew} (\${pattern}) — צורה נקבית. לפי כשף עמ׳ 191: הוולד נקבה.\`;
  } else {
    outputHebrew = \`בית 5: \${figureHebrew} (\${pattern}) — הצורה אינה זכרית ואינה נקבית לפי סיווג עמ׳ 59–60. כלל עמ׳ 191 לבדו אינו מכריע את מין הוולד.\`;
  }

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 191; סיווגי זכר/נקבה עמ׳ 59–60',
    sourceText: 'אם הצורה זכרית — הוולד זכר; ואם היא נקבית — הוולד נקבה.',
    houseNumber: 5,
    h5Pattern: pattern,
    h5FigureHebrew: figureHebrew,
    gender,
    genderHebrew,
    positive: null,
    outputHebrew,
  };
}
`;

if (!executors.includes('function computePregnancyGenderP191')) {
  const customAnchor = `const CUSTOM_EXECUTORS = Object.freeze({\n  'theft.p225.thiefDescriptionH7': computeThiefPhysicalDescriptionKashf,\n  'pregnancy.p191.existsH5SilentEmpty': computePregnancyExistenceP191,\n});`;
  if (!executors.includes(customAnchor)) throw new Error('Could not find P4 custom executor allowlist anchor');
  const replacement = genderExecutor + `\nconst CUSTOM_EXECUTORS = Object.freeze({\n  'theft.p225.thiefDescriptionH7': computeThiefPhysicalDescriptionKashf,\n  'pregnancy.p191.existsH5SilentEmpty': computePregnancyExistenceP191,\n  'pregnancy.p191.genderH5': computePregnancyGenderP191,\n});`;
  executors = executors.replace(customAnchor, replacement);
} else if (!executors.includes("'pregnancy.p191.genderH5': computePregnancyGenderP191")) {
  executors = executors.replace(
    "  'pregnancy.p191.existsH5SilentEmpty': computePregnancyExistenceP191,\n",
    "  'pregnancy.p191.existsH5SilentEmpty': computePregnancyExistenceP191,\n  'pregnancy.p191.genderH5': computePregnancyGenderP191,\n"
  );
}

// Enable only the selected canonical p191 H5-gender method.
const genderRegex = /(  'pregnancy\.p191\.genderH5': method\(\{[\s\S]*?kashfRuntimeStatus: 'ready',\n)    runtimeAllowed: false,([\s\S]*?executionKind: 'custom-engine',\n)    executorStatus: 'pending',/;
if (genderRegex.test(registry)) {
  registry = registry.replace(genderRegex, "$1    runtimeAllowed: true,$2    executorStatus: 'ready',");
} else if (!/pregnancy\.p191\.genderH5[\s\S]*?runtimeAllowed: true,[\s\S]*?executorStatus: 'ready'/.test(registry)) {
  throw new Error('Could not enable pregnancy.p191.genderH5 safely');
}

// Document the canonical boundary so alternative p192-p194 gender procedures
// do not get silently blended into this p191 method.
const genderMethodRegex = /(  'pregnancy\.p191\.genderH5': method\(\{[\s\S]*?legacyTopicId: 'children',\n)(  \}),)/;
if (genderMethodRegex.test(registry) && !/pregnancy\.p191\.genderH5[\s\S]*?notes:/.test(registry.match(/'pregnancy\.p191\.genderH5'[\s\S]*?\n  \}\),/m)?.[0] || '')) {
  registry = registry.replace(
    genderMethodRegex,
    "$1    notes: 'Canonical p191 method: read the sex from the masculine/feminine classification of H5 only. The four androgynous figures remain unresolved. Do not blend the alternative p192-p194 gender procedures into this verdict.',\n$2"
  );
}

// Add H5 traceability for the second p191 pregnancy method.
const oldHouses = `        : method.kashfMethodId === 'pregnancy.p191.existsH5SilentEmpty'\n            ? [5]\n            : [];`;
const newHouses = `        : method.kashfMethodId === 'pregnancy.p191.existsH5SilentEmpty'\n            ? [5]\n            : method.kashfMethodId === 'pregnancy.p191.genderH5'\n              ? [5]\n              : [];`;
if (readingEngine.includes(oldHouses)) {
  readingEngine = readingEngine.replace(oldHouses, newHouses);
} else if (!readingEngine.includes("method.kashfMethodId === 'pregnancy.p191.genderH5'")) {
  throw new Error('Could not add p191 gender H5 traceability');
}

if (!tests.includes('// ── P5 pregnancy-gender p191 custom executor')) {
  const anchor = '// ── Canonical execution isolation ----------------------------------------';
  if (!tests.includes(anchor)) throw new Error('Could not find canonical isolation test anchor');

  const block = [
    '// ── P5 pregnancy-gender p191 custom executor -------------------------',
    "const pregnancyGenderRoute = assertRoute('q-gender', {",
    '  ok: true,',
    '  canRunKashf: true,',
    "  kashfIntentId: 'pregnancy.gender',",
    "  kashfMethodId: 'pregnancy.p191.genderH5',",
    "  kashfRuntimeStatus: 'ready',",
    "  executorStatus: 'ready',",
    '  runtimeAllowed: true,',
    '});',
    "assert(canRunKashfMethod(pregnancyGenderRoute.kashfMethodId) === true, 'pregnancy-gender canonical method is explicitly runnable');",
    "const pregnancyGenderReading = buildKashfReadingByQuestionId(PILOT_BOARD, 'q-gender', { question: 'מה מין הוולד?' });",
    "assert(pregnancyGenderReading.valid === true, 'q-gender executes through canonical custom allowlist');",
    "assert(pregnancyGenderReading.canonicalExecution?.methodsExecuted?.length === 1, 'q-gender executes exactly one method');",
    "assert(pregnancyGenderReading.canonicalExecution?.methodsExecuted?.[0] === 'pregnancy.p191.genderH5', 'q-gender executes the exact p191 H5 gender method only');",
    "assert(pregnancyGenderReading.primaryFormula?.houses?.length === 1 && pregnancyGenderReading.primaryFormula.houses[0] === 5, 'q-gender traceability records H5 only');",
    "assert(pregnancyGenderReading.primaryFormula?.result?.executorResult?.h5Pattern === '1212', 'pilot board H5 remains ממון יוצא / 1212');",
    "assert(pregnancyGenderReading.primaryFormula?.result?.executorResult?.gender === 'male', 'H5=1212 is masculine and yields male by p191');",
    "assert(pregnancyGenderReading.verdict?.positive === null && pregnancyGenderReading.overallPositive === null, 'gender lookup does not invent positive/negative sentiment');",
    "assert(String(pregnancyGenderReading.verdict?.text || '').includes('הוולד זכר'), 'masculine H5 renders the exact p191 male rule');",
    "assert(pregnancyGenderReading.canonicalExecution?.altFormulaExecuted === false, 'q-gender does not execute alternate gender formula');",
    "assert(pregnancyGenderReading.canonicalExecution?.topicSupportingChecksExecuted === false, 'q-gender does not execute children supporting checks');",
    "assert(pregnancyGenderReading.canonicalExecution?.topicBundleExecuted === false, 'q-gender does not execute children topic bundle');",
    'const pregnancyGenderHtml = writeCanonicalKashfReading(pregnancyGenderReading);',
    "assert(pregnancyGenderHtml.includes('pregnancy.p191.genderH5'), 'pregnancy-gender writer identifies exact canonical method');",
    "assert(pregnancyGenderHtml.includes('הוולד זכר'), 'pregnancy-gender writer renders the p191 result');",
    "assert(pregnancyGenderHtml.includes('אם הצורה זכרית'), 'pregnancy-gender writer exposes the exact source rule');",
    '',
    '// Feminine-path source guard: H5=2111 / סף נכנס is one of the six feminine figures.',
    "const pregnancyGenderFemaleReading = buildKashfReadingByQuestionId(PREGNANCY_SILENT_BOARD, 'q-gender', { question: 'מה מין הוולד?' });",
    "assert(pregnancyGenderFemaleReading.primaryFormula?.result?.executorResult?.h5Pattern === '2111', 'female guard board produces H5=2111');",
    "assert(pregnancyGenderFemaleReading.primaryFormula?.result?.executorResult?.gender === 'female', 'H5=2111 is feminine and yields female by p191');",
    "assert(String(pregnancyGenderFemaleReading.verdict?.text || '').includes('הוולד נקבה'), 'feminine H5 renders the exact p191 female rule');",
    '',
    '// Non-invention guard: the four androgynous figures are not forced to male/female.',
    "const pregnancyGenderUnresolvedReading = buildKashfReadingByQuestionId(PREGNANCY_UNRESOLVED_BOARD, 'q-gender', { question: 'מה מין הוולד?' });",
    "assert(pregnancyGenderUnresolvedReading.primaryFormula?.result?.executorResult?.h5Pattern === '1111', 'gender unresolved guard board produces H5=1111 / דרך');",
    "assert(pregnancyGenderUnresolvedReading.primaryFormula?.result?.executorResult?.gender === null, 'H5=1111 remains unresolved by the p191 masculine/feminine rule');",
    "assert(pregnancyGenderUnresolvedReading.verdict?.positive === null && pregnancyGenderUnresolvedReading.overallPositive === null, 'androgynous H5 remains neutral');",
    "assert(String(pregnancyGenderUnresolvedReading.verdict?.text || '').includes('אינו מכריע'), 'androgynous p191 result is explicit rather than fabricated');",
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

console.log('Pregnancy-gender p191 canonical executor cutover passed.');
