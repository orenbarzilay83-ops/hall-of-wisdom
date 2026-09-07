#!/usr/bin/env node
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const readingPath = 'goral-hachol/engine/kashf-canonical-reading-engine.js';
const executorsPath = 'goral-hachol/engine/kashf-canonical-executors.js';
const registryPath = 'goral-hachol/registry/kashf-canonical-method-registry.js';
const testsPath = '_test_kashf_canonical_routing.mjs';
const auditPath = 'HALL_WISDOM_KASHF_SOURCE_LOCAL_CLASSIFICATION_AUDIT.md';

let reading = fs.readFileSync(readingPath, 'utf8');
let executors = fs.readFileSync(executorsPath, 'utf8');
let registry = fs.readFileSync(registryPath, 'utf8');
let tests = fs.readFileSync(testsPath, 'utf8');
let audit = fs.existsSync(auditPath) ? fs.readFileSync(auditPath, 'utf8') : '';

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
  if (!next || next === block) throw new Error(`Method block was not changed: ${methodId}`);
  return source.slice(0, start) + next + source.slice(blockEnd);
}

// Canonical formula execution must preserve the source's third fortune class (mixed).
if (reading.includes('  classifyPattern,\n')) {
  reading = reading.replace('  classifyPattern,\n', '');
}
if (!reading.includes("from './kashf-canonical-figure-classifier.js'")) {
  const anchor = "} from './kashf-formula-engine.js';\n";
  if (!reading.includes(anchor)) throw new Error('Canonical reading import anchor not found');
  reading = reading.replace(anchor, anchor + "import { classifyCanonicalFigure } from './kashf-canonical-figure-classifier.js';\n");
}
if (!reading.includes('const classification = classifyCanonicalFigure(resultPattern);')) {
  if (!reading.includes('const classification = classifyPattern(resultPattern);')) throw new Error('Canonical classification call not found');
  reading = reading.replace('const classification = classifyPattern(resultPattern);', 'const classification = classifyCanonicalFigure(resultPattern);');
}

// Ruler-condition executor: H7 + H10, then source-safe سعد/نحس judgment.
if (!executors.includes("from './kashf-canonical-figure-classifier.js'")) {
  const anchor = "import { FIGURE_PLANET_MAP } from '../data/sources/kashf-al-asrar/kashf-hazz.js';\n";
  if (!executors.includes(anchor)) throw new Error('Executor classifier import anchor not found');
  executors = executors.replace(anchor, anchor + "import { classifyCanonicalFigure } from './kashf-canonical-figure-classifier.js';\n");
}

if (!executors.includes('function computeRulerConditionP257')) {
  const anchor = 'const CUSTOM_EXECUTORS = Object.freeze({';
  if (!executors.includes(anchor)) throw new Error('Custom executor anchor not found');
  const block = String.raw`
function computeRulerConditionP257(chart) {
  if (!Array.isArray(chart)) return null;
  const h7 = chart.find((entry) => Number(entry?.house ?? entry?.houseNumber) === 7) || chart[6] || null;
  const h10 = chart.find((entry) => Number(entry?.house ?? entry?.houseNumber) === 10) || chart[9] || null;
  const h7Pattern = h7?.key || h7?.pattern || null;
  const h10Pattern = h10?.key || h10?.pattern || null;
  if (!h7Pattern || !h10Pattern) return null;

  const combined = combineRamlFigures(h7Pattern, h10Pattern);
  const resultPattern = combined.resultPattern;
  const resultFigureHebrew = combined.result?.hebrewName || resultPattern;
  const classification = classifyCanonicalFigure(resultPattern);

  let rulerCondition = null;
  let rulerConditionHebrew = 'לא הוכרע בכלל זה';
  let positive = null;
  let outputHebrew;

  if (classification.saadNahs === 'saad') {
    rulerCondition = 'good';
    rulerConditionHebrew = 'טוב';
    positive = true;
    outputHebrew = 'הולד צורה מבית 7 (' + h7Pattern + ') ומבית 10 (' + h10Pattern + '): ' + resultFigureHebrew + ' (' + resultPattern + ') — מיטיבה. לפי כשף עמ׳ 257: מצב בעל השררה טוב.';
  } else if (classification.saadNahs === 'nahs') {
    rulerCondition = 'bad';
    rulerConditionHebrew = 'רע';
    positive = false;
    outputHebrew = 'הולד צורה מבית 7 (' + h7Pattern + ') ומבית 10 (' + h10Pattern + '): ' + resultFigureHebrew + ' (' + resultPattern + ') — מזיקה. לפי כשף עמ׳ 257: מצב בעל השררה רע.';
  } else if (classification.saadNahs === 'mixed') {
    outputHebrew = 'הולד צורה מבית 7 (' + h7Pattern + ') ומבית 10 (' + h10Pattern + '): ' + resultFigureHebrew + ' (' + resultPattern + ') — ממוזגת. כלל עמ׳ 257 מוסר דין מפורש למיטיב ולמזיק בלבד; אין להפוך צורה ממוזגת אוטומטית לטובה או לרעה.';
  } else {
    outputHebrew = 'לא ניתן לסווג את הצורה שנולדה מבית 7 ובית 10 לפי סיווג המיטיב/מזיק/ממוזג הקנוני; אין להשלים דין מן הדעת.';
  }

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 257',
    sourceText: 'הולד מן השביעי והעשירי צורה; אם יצאה מיטיבה — דון לו בטוב, ואם מזיקה — דון לו ברע.',
    housesUsed: [7, 10],
    h7Pattern,
    h10Pattern,
    resultPattern,
    resultFigureHebrew,
    classification,
    rulerCondition,
    rulerConditionHebrew,
    positive,
    outputHebrew,
  };
}

`;
  executors = executors.replace(anchor, block + anchor);
}

if (!executors.includes("'authority.p257.rulerConditionH7H10': computeRulerConditionP257")) {
  executors = executors.replace(
    "  'authority.p257.appointmentH1H10Planet': computeAppointmentCompletionP257,\n",
    "  'authority.p257.appointmentH1H10Planet': computeAppointmentCompletionP257,\n  'authority.p257.rulerConditionH7H10': computeRulerConditionP257,\n"
  );
}

registry = updateMethodBlock(registry, 'authority.p257.rulerConditionH7H10', (block) => {
  let next = block.replace('    runtimeAllowed: false,', '    runtimeAllowed: true,');
  next = next.replace("    executorStatus: 'pending',", "    executorStatus: 'ready',");
  next = next.replace(
    "    notes: 'Body-source ruler-condition rule: derive a figure from H7+H10; benefic gives a good condition and malefic gives a bad condition. This is distinct from whether an appointment remains.',",
    "    notes: 'Canonical p257 ruler-condition executor combines H7+H10. Source-explicit benefic => good and malefic => bad. Canonical mixed classification stays unresolved because this rule does not state a mixed branch. This is distinct from appointment persistence.',"
  );
  return next;
});

// Regression coverage: all six mixed source-labelled figures must stay mixed canonically.
if (!tests.includes("from './goral-hachol/engine/kashf-canonical-figure-classifier.js'")) {
  const anchor = "import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';\n";
  if (!tests.includes(anchor)) throw new Error('Test import anchor not found');
  tests = tests.replace(anchor, anchor + "import { getCanonicalSaadNahsDetail } from './goral-hachol/engine/kashf-canonical-figure-classifier.js';\n");
}

if (!tests.includes('// ── P9 source-safe mixed classification')) {
  const anchor = '// ── Canonical execution isolation ----------------------------------------';
  if (!tests.includes(anchor)) throw new Error('Canonical isolation test anchor not found');
  const block = String.raw`// ── P9 source-safe mixed classification --------------------------------
const canonicalMixedFigures = [
  ['1111', 'nahs'], // דרך — ממוזג-מזיק
  ['1121', 'saad'], // נלחם — ממוזג-מיטיב
  ['1211', 'saad'], // בר הלחי — ממוזג-מיטיב
  ['2112', 'nahs'], // חיבור — ממוזג-מזיק
  ['2212', 'saad'], // לבן — ממוזג-מיטיב
  ['2222', 'nahs'], // קהלה — ממוזג-מזיק
];
for (const [pattern, tendency] of canonicalMixedFigures) {
  const detail = getCanonicalSaadNahsDetail(pattern);
  assert(detail.saadNahs === 'mixed', 'canonical mixed classifier preserves mixed for ' + pattern);
  assert(detail.mixedTendency === tendency, 'canonical mixed classifier preserves tendency metadata for ' + pattern);
}
assert(getCanonicalSaadNahsDetail('1122').saadNahs === 'saad', 'canonical classifier preserves pure benefic figure');
assert(getCanonicalSaadNahsDetail('1112').saadNahs === 'nahs', 'canonical classifier preserves pure malefic figure');

function makeP9Board(overrides = {}) {
  return {
    entries: Array.from({ length: 16 }, (_, index) => {
      const house = index + 1;
      const pattern = overrides[house] || '2222';
      return { house, houseNumber: house, pattern, key: pattern, hebrewName: pattern };
    }),
    boardValidation: { isValid: true, warnings: [] },
  };
}

const relocationMixedBoard = makeP9Board({ 4: '1111', 15: '2222' });
const relocationMixedReading = buildKashfReadingByQuestionId(relocationMixedBoard, 'q-move-city', { question: 'האם כדאי לעבור מקום?' });
assert(relocationMixedReading.valid === true, 'relocation mixed regression executes canonically');
assert(relocationMixedReading.primaryFormula?.result?.resultPattern === '1111', 'relocation mixed fixture produces Road');
assert(relocationMixedReading.primaryFormula?.result?.classification?.saadNahs === 'mixed', 'relocation canonical formula exposes mixed instead of collapsing it to nahs');
assert(relocationMixedReading.primaryFormula?.result?.classification?.mixedTendency === 'nahs', 'relocation mixed tendency remains metadata only');
assert(relocationMixedReading.verdict?.text === 'המקום ממוצע — לא מצוין אך לא מזיק', 'relocation reaches its explicit mixed verdict branch');
assert(relocationMixedReading.overallPositive === null, 'relocation mixed branch remains non-binary');

assertRoute('q-ruler-status', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'authority.rulerCondition',
  kashfMethodId: 'authority.p257.rulerConditionH7H10',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assert(canRunKashfMethod('authority.p257.rulerConditionH7H10') === true, 'p257 ruler-condition method is explicitly runnable');

const rulerGood = buildKashfReadingByQuestionId(makeP9Board({ 7: '1122', 10: '2222' }), 'q-ruler-status', { question: 'מה מצב בעל השררה?' });
assert(rulerGood.valid === true, 'p257 ruler good fixture executes canonically');
assert(rulerGood.canonicalExecution?.methodsExecuted?.length === 1, 'p257 ruler executes exactly one method');
assert(rulerGood.canonicalExecution?.methodsExecuted?.[0] === 'authority.p257.rulerConditionH7H10', 'p257 ruler executes exact canonical method');
assert(JSON.stringify(rulerGood.primaryFormula?.houses) === JSON.stringify([7, 10]), 'p257 ruler traces H7+H10 only');
assert(rulerGood.primaryFormula?.result?.executorResult?.resultPattern === '1122', 'p257 ruler good fixture produces 1122');
assert(rulerGood.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'saad', 'p257 ruler good result is benefic');
assert(rulerGood.overallPositive === true, 'p257 ruler benefic result is positive');
assert(rulerGood.canonicalExecution?.topicBundleExecuted === false, 'p257 ruler does not execute broad authority bundle');
assert(rulerGood.dhamir == null, 'p257 ruler does not auto-run Dhamir');

const rulerBad = buildKashfReadingByQuestionId(makeP9Board({ 7: '1112', 10: '2222' }), 'q-ruler-status', { question: 'מה מצב בעל השררה?' });
assert(rulerBad.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'nahs', 'p257 ruler bad result is malefic');
assert(rulerBad.overallPositive === false, 'p257 ruler malefic result is negative');

const rulerMixed = buildKashfReadingByQuestionId(makeP9Board({ 7: '1111', 10: '2222' }), 'q-ruler-status', { question: 'מה מצב בעל השררה?' });
assert(rulerMixed.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'mixed', 'p257 ruler mixed result stays mixed');
assert(rulerMixed.primaryFormula?.result?.executorResult?.rulerCondition === null, 'p257 ruler mixed branch remains unresolved by this source rule');
assert(rulerMixed.overallPositive === null, 'p257 ruler mixed branch does not invent positive or negative verdict');

`;
  tests = tests.replace(anchor, block + anchor);
}

if (audit && !audit.includes('Canonical mixed-classification closure (P9)')) {
  audit += String.raw`

## Canonical mixed-classification closure (P9)

The canonical runtime now preserves the source's third fortune class, ممتزج / ממוזג, instead of collapsing mixed-benefic to سعد or mixed-malefic to نحس. The legacy classifier remains unchanged for compatibility. Canonical formula execution uses a separate source-safe classifier and carries a mixed tendency only as metadata; it does not convert that tendency into a binary verdict. Therefore methods whose source states only سعد/نحس must leave mixed results unresolved unless that specific source rule supplies a mixed branch. The p183 relocation rule is the regression anchor because its source explicitly supplies all three branches and its mixed branch is now reachable.
`;
}

fs.writeFileSync(readingPath, reading);
fs.writeFileSync(executorsPath, executors);
fs.writeFileSync(registryPath, registry);
fs.writeFileSync(testsPath, tests);
if (audit) fs.writeFileSync(auditPath, audit);

for (const command of [
  ['node', ['_test_kashf_canonical_routing.mjs']],
  ['node', ['_audit_kashf_question_route_coverage.mjs']],
]) {
  const result = spawnSync(command[0], command[1], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log('P9 canonical mixed-classification repair and ruler-condition cutover passed.');
