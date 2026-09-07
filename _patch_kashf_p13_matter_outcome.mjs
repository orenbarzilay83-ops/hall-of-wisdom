#!/usr/bin/env node
import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, value) { fs.writeFileSync(path, value); }
function replaceOnce(text, needle, replacement, label) {
  const first = text.indexOf(needle);
  if (first < 0) throw new Error(`Missing patch anchor: ${label}`);
  if (text.indexOf(needle, first + needle.length) >= 0) throw new Error(`Non-unique patch anchor: ${label}`);
  return text.slice(0, first) + replacement + text.slice(first + needle.length);
}

const registryPath = 'goral-hachol/registry/kashf-canonical-method-registry.js';
let registry = read(registryPath);
registry = replaceOnce(
  registry,
  "    runtimeAllowed: false,\n    executionKind: 'custom-engine',\n    executorStatus: 'pending',\n    notes: 'Combine 1+7, combine 10+11, then combine the two results. Distinct from completion p173.',",
  "    runtimeAllowed: true,\n    executionKind: 'custom-engine',\n    executorStatus: 'ready',\n    notes: 'Canonical p172 matter-outcome executor is wired: combine H1+H7, combine H10+H11, then combine those two generated figures. The final figure alone is the source result for good/bad. Pure benefic => good, pure malefic => bad, and mixed remains mixed/unresolved rather than being collapsed. Distinct from completion p173.',",
  'p172 matter registry readiness'
);
write(registryPath, registry);

const knowledgePath = 'goral-hachol/registry/kashf-v57-knowledge-registry.js';
let knowledge = read(knowledgePath);
knowledge = replaceOnce(
  knowledge,
  "    notes: 'שיטה זו נפרדת משיטת השלמת העניין בעמוד 173.',",
  "    notes: 'שיטה זו נפרדת משיטת השלמת העניין בעמוד 173. את הצורה הסופית שופטים לפי סיווג הטוב/הרע הקנוני של v57; צורה ממוזגת נשארת ממוזגת ואינה נהפכת אוטומטית למיטיבה או למזיקה.',",
  'p172 v57 source-safe note'
);
write(knowledgePath, knowledge);

const executorsPath = 'goral-hachol/engine/kashf-canonical-executors.js';
let executors = read(executorsPath);
const executorBlock = `

// Kashf v57 p172: derive one figure from H1+H7, another from H10+H11,
// then combine those generated figures. The final figure is the result of the
// querent's matter "for good or bad". Canonical source-safe fortune classes
// are preserved: mixed is not collapsed into benefic or malefic.
function computeMatterOutcomeP172(chart) {
  if (!Array.isArray(chart)) return null;
  const houseNumbers = [1, 7, 10, 11];
  const patterns = {};

  for (const houseNumber of houseNumbers) {
    const entry = findCanonicalHouse(chart, houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    if (!pattern) return null;
    patterns[houseNumber] = pattern;
  }

  const firstSeventh = combineRamlFigures(patterns[1], patterns[7]);
  const tenthEleventh = combineRamlFigures(patterns[10], patterns[11]);
  const finalCombination = combineRamlFigures(firstSeventh.resultPattern, tenthEleventh.resultPattern);
  const resultPattern = finalCombination.resultPattern;
  const classification = classifyCanonicalFigure(resultPattern);

  let sourceOutcome = 'unresolved';
  let sourceOutcomeHebrew = 'לא הוכרע לטוב או לרע בכלל זה';
  let positive = null;

  if (classification.saadNahs === 'saad') {
    sourceOutcome = 'good';
    sourceOutcomeHebrew = 'תוצאת העניין לטוב';
    positive = true;
  } else if (classification.saadNahs === 'nahs') {
    sourceOutcome = 'bad';
    sourceOutcomeHebrew = 'תוצאת העניין לרע';
    positive = false;
  } else if (classification.saadNahs === 'mixed') {
    sourceOutcome = 'mixed';
    sourceOutcomeHebrew = classification.mixedTendencyHebrew
      ? 'תוצאת העניין ממוזגת — ' + classification.mixedTendencyHebrew
      : 'תוצאת העניין ממוזגת';
  }

  const finalFigureLabel = classification.figureHebrew || resultPattern;
  const outputHebrew = classification.saadNahs === 'saad'
    ? 'לפי כשף v57 עמ׳ 172: חיבור 1+7 וחיבור 10+11 נצרפו שוב, והצורה הסופית היא ' + finalFigureLabel + ' — מיטיבה. לכן תוצאת עניינו של השואל נידונה לטוב.'
    : classification.saadNahs === 'nahs'
      ? 'לפי כשף v57 עמ׳ 172: חיבור 1+7 וחיבור 10+11 נצרפו שוב, והצורה הסופית היא ' + finalFigureLabel + ' — מזיקה. לכן תוצאת עניינו של השואל נידונה לרע.'
      : classification.saadNahs === 'mixed'
        ? 'לפי כשף v57 עמ׳ 172: חיבור 1+7 וחיבור 10+11 נצרפו שוב, והצורה הסופית היא ' + finalFigureLabel + ' — ממוזגת. אין להפוך צורה ממוזגת בכוח להכרעת טוב או רע חד־משמעית.'
        : 'הצורה הסופית נוצרה לפי חיבורי עמ׳ 172, אך סיווג הטוב/הרע שלה אינו זמין; לכן אין הכרעה לפי כלל זה.';

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 172',
    sourceText: 'לדעת את תוצאת עניינו של השואל, הוצא צורה מן הבית הראשון והשביעי, וצורה נוספת מן העשירי והאחד־עשר. אחר כך צרף אותן; הצורה היוצאת מהן היא תוצאת עניינו של השואל — לטוב או לרע.',
    housesUsed: houseNumbers,
    housePatterns: patterns,
    firstSeventhPattern: firstSeventh.resultPattern,
    tenthEleventhPattern: tenthEleventh.resultPattern,
    resultPattern,
    resultFigureHebrew: classification.figureHebrew || null,
    classification,
    sourceOutcome,
    sourceOutcomeHebrew,
    positive,
    outputHebrew,
  };
}
`;
executors = replaceOnce(
  executors,
  '\nconst CUSTOM_EXECUTORS = Object.freeze({',
  executorBlock + '\nconst CUSTOM_EXECUTORS = Object.freeze({',
  'p172 executor insertion point'
);
executors = replaceOnce(
  executors,
  "const CUSTOM_EXECUTORS = Object.freeze({\n",
  "const CUSTOM_EXECUTORS = Object.freeze({\n  'matter.p172.h17_h1011_thenCombine': computeMatterOutcomeP172,\n",
  'p172 custom allowlist'
);
write(executorsPath, executors);

const testsPath = '_test_kashf_canonical_routing.mjs';
let tests = read(testsPath);
const testBlock = `
// ── P13 p172 matter-outcome source contract -------------------------------
assertRoute('q-matter-end', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'matter.outcome',
  kashfMethodId: 'matter.p172.h17_h1011_thenCombine',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assert(canRunKashfMethod('matter.p172.h17_h1011_thenCombine'), 'p172 matter-outcome method is explicitly runnable');

const p172Good = buildKashfReadingByQuestionId(
  makeP204Board({ 1: '1111', 7: '2222', 10: '1111', 11: '1122' }),
  'q-matter-end',
  { question: 'מה תהיה תוצאת העניין?' }
);
assert(p172Good.valid === true && p172Good.canRunKashf === true, 'p172 good fixture executes canonically');
assert(JSON.stringify(p172Good.primaryFormula?.houses) === JSON.stringify([1, 7, 10, 11]), 'p172 traces exactly H1+H7+H10+H11');
assert(p172Good.primaryFormula?.result?.executorResult?.firstSeventhPattern === '1111', 'p172 first generated figure is H1+H7');
assert(p172Good.primaryFormula?.result?.executorResult?.tenthEleventhPattern === '2211', 'p172 second generated figure is H10+H11');
assert(p172Good.primaryFormula?.result?.executorResult?.resultPattern === '1122', 'p172 final combination is generated from the two intermediate figures');
assert(p172Good.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'saad', 'p172 final pure benefic is classified source-safely');
assert(p172Good.primaryFormula?.result?.executorResult?.sourceOutcome === 'good', 'p172 pure benefic final figure means good outcome');
assert(p172Good.overallPositive === true, 'p172 good source outcome is positive');
assert(p172Good.altFormula === null, 'p172 does not aggregate completion p173 or other formulas');
assert(p172Good.canonicalExecution?.topicBundleExecuted === false, 'p172 does not execute broad general-reading bundle');
assert(p172Good.dhamir === null, 'p172 does not auto-run Dhamir');

const p172Bad = buildKashfReadingByQuestionId(
  makeP204Board({ 1: '1111', 7: '2222', 10: '1111', 11: '1112' }),
  'q-matter-end',
  { question: 'מה תהיה תוצאת העניין?' }
);
assert(p172Bad.primaryFormula?.result?.executorResult?.firstSeventhPattern === '1111', 'p172 bad fixture preserves first intermediate figure');
assert(p172Bad.primaryFormula?.result?.executorResult?.tenthEleventhPattern === '2221', 'p172 bad fixture generates second intermediate figure');
assert(p172Bad.primaryFormula?.result?.executorResult?.resultPattern === '1112', 'p172 bad fixture final result is pure malefic');
assert(p172Bad.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'nahs', 'p172 final pure malefic is classified source-safely');
assert(p172Bad.primaryFormula?.result?.executorResult?.sourceOutcome === 'bad', 'p172 pure malefic final figure means bad outcome');
assert(p172Bad.overallPositive === false, 'p172 bad source outcome is negative');

const p172Mixed = buildKashfReadingByQuestionId(
  makeP204Board({ 1: '1111', 7: '2222', 10: '1111', 11: '2212' }),
  'q-matter-end',
  { question: 'מה תהיה תוצאת העניין?' }
);
assert(p172Mixed.primaryFormula?.result?.executorResult?.tenthEleventhPattern === '1121', 'p172 mixed fixture generates expected second intermediate figure');
assert(p172Mixed.primaryFormula?.result?.executorResult?.resultPattern === '2212', 'p172 mixed fixture final result is canonical mixed figure');
assert(p172Mixed.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'mixed', 'p172 preserves mixed fortune class');
assert(p172Mixed.primaryFormula?.result?.executorResult?.classification?.mixedTendency === 'saad', 'p172 preserves mixed benefic inclination as metadata only');
assert(p172Mixed.primaryFormula?.result?.executorResult?.sourceOutcome === 'mixed', 'p172 mixed final figure remains mixed');
assert(p172Mixed.overallPositive === null, 'p172 mixed result is not collapsed into a binary verdict');

const p172Html = writeCanonicalKashfReading(p172Good);
assert(p172Html.includes('matter.p172.h17_h1011_thenCombine'), 'p172 narrative exposes exact method id');
assert(p172Html.includes('תוצאת עניינו של השואל'), 'p172 narrative preserves v57 Hebrew rule context');
`;
tests = replaceOnce(
  tests,
  '// ── P12 p183 current place vs relocation source contract -----------------',
  testBlock + '\n// ── P12 p183 current place vs relocation source contract -----------------',
  'p172 test insertion point'
);
write(testsPath, tests);

console.log('Applied p172 matter-outcome canonical implementation patch.');
