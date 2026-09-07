#!/usr/bin/env node
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const executorsPath = 'goral-hachol/engine/kashf-canonical-executors.js';
const registryPath = 'goral-hachol/registry/kashf-canonical-method-registry.js';
const testsPath = '_test_kashf_canonical_routing.mjs';
const auditPath = 'HALL_WISDOM_KASHF_P202_LOST_ITEM_RETURN_AUDIT.md';

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
  if (!next || next === block) throw new Error(`Method block was not changed: ${methodId}`);
  return source.slice(0, start) + next + source.slice(blockEnd);
}

// ── 1. Add exact p202 method-scoped executor -----------------------------
if (!executors.includes('function computeLostItemReturnP202(chart) {')) {
  const marker = '\nconst CUSTOM_EXECUTORS = Object.freeze({';
  const at = executors.indexOf(marker);
  if (at < 0) throw new Error('CUSTOM_EXECUTORS marker not found');

  const fn = String.raw`

// Kashf p202: the lost thing returns only when BOTH H6 and H8 contain
// figures that are simultaneously benefic (سعيدة) and strictly internal
// (داخلة). "Internal" here is the source p57 four-figure class, represented
// canonically by dakhalKharij === 'dakhil'; fixed/mutable mujassad classes are
// not silently treated as internal.
function computeLostItemReturnP202(chart) {
  if (!Array.isArray(chart)) return null;
  const h6 = chart.find((entry) => Number(entry?.house ?? entry?.houseNumber) === 6) || chart[5] || null;
  const h8 = chart.find((entry) => Number(entry?.house ?? entry?.houseNumber) === 8) || chart[7] || null;
  const h6Pattern = h6?.key || h6?.pattern || null;
  const h8Pattern = h8?.key || h8?.pattern || null;
  if (!h6Pattern || !h8Pattern) return null;

  const h6Class = classifyCanonicalFigure(h6Pattern);
  const h8Class = classifyCanonicalFigure(h8Pattern);
  const h6Qualifies = h6Class.saadNahs === 'saad' && h6Class.dakhalKharij === 'dakhil';
  const h8Qualifies = h8Class.saadNahs === 'saad' && h8Class.dakhalKharij === 'dakhil';
  const returns = h6Qualifies && h8Qualifies;

  const h6Hebrew = h6?.hebrew || h6?.hebrewName || h6Class.figureHebrew || h6Pattern;
  const h8Hebrew = h8?.hebrew || h8?.hebrewName || h8Class.figureHebrew || h8Pattern;
  const describe = (name, pattern, cls, qualifies) =>
    name + ' (' + pattern + ') — ' + (cls.saadNahsHebrew || 'ללא סיווג') + ', ' + (cls.dakhalKharijHebrew || 'ללא סיווג תנועה') + (qualifies ? ' [עומדת בתנאי]' : ' [אינה עומדת בתנאי]');

  const outputHebrew = returns
    ? 'בית 6: ' + describe(h6Hebrew, h6Pattern, h6Class, h6Qualifies) + '; בית 8: ' + describe(h8Hebrew, h8Pattern, h8Class, h8Qualifies) + '. לפי כשף עמ׳ 202: שתי הצורות מיטיבות ופנימיות — האבדה תשוב.'
    : 'בית 6: ' + describe(h6Hebrew, h6Pattern, h6Class, h6Qualifies) + '; בית 8: ' + describe(h8Hebrew, h8Pattern, h8Class, h8Qualifies) + '. לפי כשף עמ׳ 202: התנאי המצטבר של מיטיבה+פנימית בשני הבתים אינו מתקיים — האבדה אינה שבה לפי כלל זה.';

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 202; הגדרת הצורות הפנימיות עמ׳ 57',
    sourceText: 'באבדה ובשיבתה: כוון אל הבית השמיני והשישי. אם נמצאו שם צורות מיטיבות פנימיות — האבדה תשוב; ואם לא — לא.',
    housesUsed: [6, 8],
    h6Pattern,
    h8Pattern,
    h6Classification: h6Class,
    h8Classification: h8Class,
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
  executors = executors.replace(
    'const CUSTOM_EXECUTORS = Object.freeze({\n',
    "const CUSTOM_EXECUTORS = Object.freeze({\n  'lostItem.p202.returnH6H8': computeLostItemReturnP202,\n"
  );
}

// ── 2. Enable exact method in canonical registry -------------------------
registry = updateMethodBlock(registry, 'lostItem.p202.returnH6H8', (block) => {
  let next = block
    .replace("    runtimeAllowed: false,", "    runtimeAllowed: true,")
    .replace("    executorStatus: 'pending',", "    executorStatus: 'ready',");
  const notesRe = /    notes: '[^']*',/;
  const note = "    notes: 'Canonical p202 executor is wired: BOTH H6 and H8 must each be pure benefic (saad) and strictly internal (dakhil). The source says otherwise it does not return. Mixed figures and mujassad/fixed/mutable movement classes are not coerced into benefic+internal. This method is shared by lost-item and lost-animal routes and is not a theft-attribution rule.',";
  if (notesRe.test(next)) next = next.replace(notesRe, note);
  else next = next.replace(/\n  \}\),$/, `\n${note}\n  }),`);
  return next;
});

// ── 3. Deterministic contracts -------------------------------------------
if (!tests.includes('// ── P11 lost-item return p202 executor')) {
  const marker = '// ── Canonical execution isolation ----------------------------------------';
  const at = tests.indexOf(marker);
  if (at < 0) throw new Error('Canonical execution isolation marker not found in tests');

  const block = String.raw`// ── P11 lost-item return p202 executor -------------------------------
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

const lostAlias = resolveKashfRouteByQuestionId('q-lost-animal');
assert(lostAlias.canRunKashf === true, 'q-lost-animal alias becomes runnable through the same p202 method');
assert(lostAlias.aliasOf === 'q-lost-item', 'q-lost-animal remains an explicit alias of q-lost-item');
assert(lostAlias.kashfMethodId === 'lostItem.p202.returnH6H8', 'q-lost-animal uses exact p202 H6/H8 method');

const lostReturns = buildKashfReadingByQuestionId(makeP9Board({ 6: '2111', 8: '2211' }), 'q-lost-item', { question: 'האם האבדה תשוב?' });
assert(lostReturns.valid === true, 'p202 positive fixture executes canonically');
assert(JSON.stringify(lostReturns.primaryFormula?.houses) === JSON.stringify([6, 8]), 'p202 traces H6+H8 only');
assert(lostReturns.primaryFormula?.result?.executorResult?.h6Classification?.saadNahs === 'saad', 'p202 H6 positive fixture is benefic');
assert(lostReturns.primaryFormula?.result?.executorResult?.h6Classification?.dakhalKharij === 'dakhil', 'p202 H6 positive fixture is strictly internal');
assert(lostReturns.primaryFormula?.result?.executorResult?.h8Classification?.saadNahs === 'saad', 'p202 H8 positive fixture is benefic');
assert(lostReturns.primaryFormula?.result?.executorResult?.h8Classification?.dakhalKharij === 'dakhil', 'p202 H8 positive fixture is strictly internal');
assert(lostReturns.primaryFormula?.result?.executorResult?.returns === true, 'p202 returns only when both houses qualify');
assert(lostReturns.overallPositive === true, 'p202 positive fixture is positive');
assert(lostReturns.canonicalExecution?.methodsExecuted?.length === 1, 'p202 executes exactly one method');
assert(lostReturns.canonicalExecution?.topicBundleExecuted === false, 'p202 does not execute broad lost/theft bundle');
assert(lostReturns.dhamir == null, 'p202 does not auto-run Dhamir');

// Internal but malefic H6 must fail: 2221 is one of the four source-defined internal figures, but it is malefic.
const lostInternalMalefic = buildKashfReadingByQuestionId(makeP9Board({ 6: '2221', 8: '2211' }), 'q-lost-item', { question: 'האם האבדה תשוב?' });
assert(lostInternalMalefic.primaryFormula?.result?.executorResult?.h6Classification?.dakhalKharij === 'dakhil', 'p202 negative fixture preserves internal movement');
assert(lostInternalMalefic.primaryFormula?.result?.executorResult?.h6Classification?.saadNahs === 'nahs', 'p202 internal malefic figure remains malefic');
assert(lostInternalMalefic.primaryFormula?.result?.executorResult?.h6Qualifies === false, 'p202 internal alone is insufficient');
assert(lostInternalMalefic.primaryFormula?.result?.executorResult?.returns === false, 'p202 fails when one house is internal but malefic');
assert(lostInternalMalefic.overallPositive === false, 'p202 source else-branch is negative');

// Benefic but external H6 must fail: 1122 is benefic but not internal.
const lostBeneficExternal = buildKashfReadingByQuestionId(makeP9Board({ 6: '1122', 8: '2211' }), 'q-lost-item', { question: 'האם האבדה תשוב?' });
assert(lostBeneficExternal.primaryFormula?.result?.executorResult?.h6Classification?.saadNahs === 'saad', 'p202 external fixture preserves benefic quality');
assert(lostBeneficExternal.primaryFormula?.result?.executorResult?.h6Classification?.dakhalKharij === 'kharij', 'p202 external fixture is external');
assert(lostBeneficExternal.primaryFormula?.result?.executorResult?.h6Qualifies === false, 'p202 benefic alone is insufficient');
assert(lostBeneficExternal.primaryFormula?.result?.executorResult?.returns === false, 'p202 fails when one house is benefic but external');

const lostHtml = writeCanonicalKashfReading(lostReturns);
assert(lostHtml.includes('lostItem.p202.returnH6H8'), 'p202 narrative exposes exact canonical method id');
assert(lostHtml.includes('האבדה תשוב'), 'p202 narrative preserves the source return verdict');
assert(!lostHtml.includes('מי גנב'), 'p202 narrative does not leak theft attribution');

`;
  tests = tests.slice(0, at) + block + tests.slice(at);
}

fs.writeFileSync(executorsPath, executors);
fs.writeFileSync(registryPath, registry);
fs.writeFileSync(testsPath, tests);

fs.writeFileSync(auditPath, `# Kashf p202 — Lost-item return canonical audit\n\n## Runtime intent\n- Intent: \`lostItem.return\`\n- Canonical method: \`lostItem.p202.returnH6H8\`\n- Houses used: H6 and H8 only.\n- Shared by the explicit lost-item route and its lost-animal alias. It is not a theft-attribution method.\n\n## Primary-source rule\nArabic scan, printed p201 / working p202:\n\n> في الضال ورجوعها: أقصد البيتين الثامن والسادس، فإن حل فيها أشكال سعيدة داخلة فهي ترجع، وإلا فلا.\n\nWorking Hebrew:\n\n> באבדה ובשיבתה: כוון אל הבית השמיני והשישי. אם נמצאו שם צורות מיטיבות פנימיות — האבדה תשוב; ואם לא — לא.\n\nThis is a conjunctive rule: both relevant houses must contain figures that satisfy both predicates. The source supplies an explicit else branch, so there is no invented middle state.\n\n## What “internal” means here\nThe same source defines the four internal figures (p57):\n- כבוד נכנס / النصرة الداخلة — 2211\n- סף נכנס / العتبة الداخلة — 2111\n- ממון נכנס / القبض الداخل — 2121\n- שפל ראש / الأنكيس — 2221\n\nIt also gives the structural definition: fire row closed (2) and earth row open (1). In canonical classification this is exactly \`dakhalKharij === 'dakhil'\`. The mujassad fixed/mutable categories are not silently treated as internal for this rule.\n\n## What “benefic” means here\nThe canonical runtime uses the repaired three-way fortune classifier. For p202, the word \`سعيدة\` requires the pure \`saad\` class. Mixed figures are not promoted via tendency metadata. Of the four internal figures above, 2211, 2111 and 2121 are benefic; 2221 is malefic.\n\n## Contract boundary\nReturn = true iff:\n\n\`H6.saadNahs === 'saad' && H6.dakhalKharij === 'dakhil' && H8.saadNahs === 'saad' && H8.dakhalKharij === 'dakhil'\`\n\nOtherwise the source verdict is that it does not return. No topic bundle, Dhamir, theft profile, witness/judge bundle, or alternative method is aggregated into this verdict.\n`);

for (const file of [executorsPath, registryPath, testsPath]) {
  const check = spawnSync('node', ['--check', file], { stdio: 'inherit' });
  if (check.status !== 0) process.exit(check.status ?? 1);
}

for (const script of ['_test_kashf_canonical_routing.mjs', '_audit_kashf_question_route_coverage.mjs']) {
  const run = spawnSync('node', [script], { stdio: 'inherit' });
  if (run.status !== 0) process.exit(run.status ?? 1);
}

console.log('P11 p202 lost-item return canonical cutover passed.');
