#!/usr/bin/env node
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const executorsPath = 'goral-hachol/engine/kashf-canonical-executors.js';
const registryPath = 'goral-hachol/registry/kashf-canonical-method-registry.js';
const testsPath = '_test_kashf_canonical_routing.mjs';

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

function replaceNotes(block, note) {
  const escapedNote = note.replaceAll("'", "\\'");
  const lines = block.split('\n');
  let replaced = false;
  const next = lines.map((line) => {
    if (line.trimStart().startsWith('notes: ')) {
      replaced = true;
      const indent = line.slice(0, line.indexOf('notes:'));
      return `${indent}notes: '${escapedNote}',`;
    }
    return line;
  });
  if (!replaced) next.splice(next.length - 1, 0, `    notes: '${escapedNote}',`);
  return next.join('\n');
}

if (!executors.includes('function computeMarriagePreviousStatusP204')) {
  const anchor = 'const CUSTOM_EXECUTORS = Object.freeze({';
  if (!executors.includes(anchor)) throw new Error('Custom executor anchor not found');

  const block = `
// p204 uses the source's explicit "mutable" and "fixed" figure classes.
// Source classification (working pp. 57-60): four mutable + four fixed only.
// The other eight incoming/outgoing figures are NOT silently forced into either class.
const P204_MUTABLE_PATTERNS = new Set([
  '1121', // נלחם / الجودلة
  '1211', // בר הלחי / نقي الخد
  '1221', // סוהר / العقلة
  '1111', // דרך / الطريق
]);

const P204_FIXED_PATTERNS = new Set([
  '2222', // קהלה / الجماعة
  '2112', // חיבור / الاجتماع
  '2122', // אדום / الحمرة
  '2212', // לבן / البياض
]);

function computeMarriagePreviousStatusP204(chart) {
  if (!Array.isArray(chart)) return null;
  const h7 = chart.find((entry) => Number(entry?.house ?? entry?.houseNumber) === 7)
    || chart[6]
    || null;
  const pattern = h7?.key || h7?.pattern || null;
  if (!pattern) return null;

  const figureHebrew = h7?.hebrew || h7?.hebrewName || pattern;
  const isMutable = P204_MUTABLE_PATTERNS.has(pattern);
  const isFixed = P204_FIXED_PATTERNS.has(pattern);
  const status = isMutable ? 'thayyib' : isFixed ? 'virgin' : null;
  const statusHebrew = isMutable ? 'ת׳יִּבּ / בעולה או מי שנישאה בעבר' : isFixed ? 'בתולה' : 'לא הוכרע בכלל זה';
  const figureClass = isMutable ? 'mutable' : isFixed ? 'fixed' : 'other-source-class';
  const figureClassHebrew = isMutable ? 'מתהפכת' : isFixed ? 'קבועה' : 'אינה מארבע המתהפכות ואינה מארבע הקבועות';

  let outputHebrew;
  if (isMutable) {
    outputHebrew = 'בית 7: ' + figureHebrew + ' (' + pattern + ') — צורה מתהפכת. לפי כשף עמ׳ 204: היא ת׳יִּבּ (בעולה / מי שנישאה בעבר). המקור אינו מבחין כאן בין גרושה לאלמנה.';
  } else if (isFixed) {
    outputHebrew = 'בית 7: ' + figureHebrew + ' (' + pattern + ') — צורה קבועה. לפי כשף עמ׳ 204: היא בתולה.';
  } else {
    outputHebrew = 'בית 7: ' + figureHebrew + ' (' + pattern + ') — הצורה אינה אחת מארבע המתהפכות ואינה אחת מארבע הקבועות שנקבעו במקור. כלל עמ׳ 204 לבדו אינו מכריע כאן בתולה לעומת ת׳יִּבּ; אין להשלים מן הדעת.';
  }

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 204; סיווג מתהפך/קבוע עמ׳ 57–60',
    sourceText: 'אם השביעי מתהפך — היא ת׳יִּבּ; ואם הוא קבוע — היא בתולה.',
    housesUsed: [7],
    h7Pattern: pattern,
    h7FigureHebrew: figureHebrew,
    figureClass,
    figureClassHebrew,
    previousStatus: status,
    previousStatusHebrew: statusHebrew,
    positive: null,
    outputHebrew,
  };
}

`;
  executors = executors.replace(anchor, block + anchor);
}

if (!executors.includes("'marriage.p204.previousStatusH7': computeMarriagePreviousStatusP204")) {
  const customAnchor = 'const CUSTOM_EXECUTORS = Object.freeze({\n';
  if (!executors.includes(customAnchor)) throw new Error('CUSTOM_EXECUTORS map anchor not found');
  executors = executors.replace(
    customAnchor,
    customAnchor + "  'marriage.p204.previousStatusH7': computeMarriagePreviousStatusP204,\n"
  );
}

registry = updateMethodBlock(registry, 'marriage.p204.previousStatusH7', (block) => {
  let next = block.replace('    runtimeAllowed: false,', '    runtimeAllowed: true,');
  next = next.replace("    executorStatus: 'pending',", "    executorStatus: 'ready',");
  next = replaceNotes(next, 'Primary Arabic scan p204: if H7 is mutable (منقلب) => thayyib; if fixed (ثابت) => virgin. Canonical executor therefore uses only the four source-defined mutable and four source-defined fixed figures; the other eight remain unresolved. Thayyib does not distinguish divorced from widowed. Source erratum: the primary scan says H1 recurring in H7 => female slave/servant (أمة), while H7 recurring in H10 => free woman (حرة); the working Hebrew text conflated these clauses.');
  return next;
});

// Remove the now-stale note left from the earlier H6 body-part cutover.
registry = updateMethodBlock(registry, 'illness.bodyPart.h6Figure', (block) => {
  return replaceNotes(block, 'Use only the verified H6 figure → body-part mapping from p199. Canonical method-scoped legacy executor is wired and tested; missing source entries remain unresolved rather than invented.');
});

if (!tests.includes('// ── P8 marriage previous-status p204 executor')) {
  const anchor = '// ── Canonical execution isolation ----------------------------------------';
  if (!tests.includes(anchor)) throw new Error('Canonical isolation test anchor not found');

  const block = `// ── P8 marriage previous-status p204 executor --------------------------
assertRoute('q-marriage-thayib', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'marriage.previousStatus',
  kashfMethodId: 'marriage.p204.previousStatusH7',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assert(canRunKashfMethod('marriage.p204.previousStatusH7'), 'p204 previous-status method is explicitly runnable');

// All four mothers 1111 => daughter H7 = 1111 (Road), one of the four source-defined mutable figures.
const P204_MUTABLE_BOARD = buildRamlBoardFromMothers(['1111', '1111', '1111', '1111']);
const previousStatusMutable = buildKashfReadingByQuestionId(P204_MUTABLE_BOARD, 'q-marriage-thayib', { question: 'בתולה או ת׳יִּבּ?' });
assert(previousStatusMutable.valid === true && previousStatusMutable.canRunKashf === true, 'p204 mutable H7 executes canonically');
assert(previousStatusMutable.kashfMethodId === 'marriage.p204.previousStatusH7', 'p204 executes only exact previous-status method');
assert(JSON.stringify(previousStatusMutable.primaryFormula?.houses) === JSON.stringify([7]), 'p204 traces only H7');
assert(previousStatusMutable.primaryFormula?.result?.executorResult?.h7Pattern === '1111', 'p204 mutable fixture has H7=1111');
assert(previousStatusMutable.primaryFormula?.result?.executorResult?.figureClass === 'mutable', 'p204 classifies Road as source-defined mutable');
assert(previousStatusMutable.primaryFormula?.result?.executorResult?.previousStatus === 'thayyib', 'p204 mutable branch returns thayyib');
assert(previousStatusMutable.overallPositive === null, 'p204 previous status is descriptive, not positive/negative');
assert(previousStatusMutable.altFormula === null, 'p204 does not aggregate marriage alternatives');
assert(previousStatusMutable.canonicalExecution?.topicBundleExecuted === false, 'p204 does not execute broad marriage bundle');
assert(previousStatusMutable.dhamir === null, 'p204 does not auto-run Dhamir');
const previousStatusMutableHtml = writeCanonicalKashfReading(previousStatusMutable);
assert(previousStatusMutableHtml.includes('marriage.p204.previousStatusH7'), 'p204 narrative exposes exact canonical method id');
assert(previousStatusMutableHtml.includes('ת׳יִּבּ'), 'p204 narrative preserves the source thayyib category');
assert(previousStatusMutableHtml.includes('אינו מבחין כאן בין גרושה לאלמנה'), 'p204 narrative does not invent divorced-vs-widowed distinction');

// Four mothers with water row=2 => daughter H7=2222 (Community), one of the four source-defined fixed figures.
const P204_FIXED_BOARD = buildRamlBoardFromMothers(['1121', '1121', '1121', '1121']);
const previousStatusFixed = buildKashfReadingByQuestionId(P204_FIXED_BOARD, 'q-marriage-thayib', { question: 'בתולה או ת׳יִּבּ?' });
assert(previousStatusFixed.primaryFormula?.result?.executorResult?.h7Pattern === '2222', 'p204 fixed fixture has H7=2222');
assert(previousStatusFixed.primaryFormula?.result?.executorResult?.figureClass === 'fixed', 'p204 classifies Community as source-defined fixed');
assert(previousStatusFixed.primaryFormula?.result?.executorResult?.previousStatus === 'virgin', 'p204 fixed branch returns virgin');
assert(previousStatusFixed.primaryFormula?.result?.executorResult?.previousStatusHebrew === 'בתולה', 'p204 fixed branch renders exact Hebrew category');

// H7=2121 (Incoming Money) is neither one of the four mutable nor four fixed figures.
const P204_UNRESOLVED_BOARD = buildRamlBoardFromMothers(['1121', '1111', '1121', '1111']);
const previousStatusUnresolved = buildKashfReadingByQuestionId(P204_UNRESOLVED_BOARD, 'q-marriage-thayib', { question: 'בתולה או ת׳יִּבּ?' });
assert(previousStatusUnresolved.primaryFormula?.result?.executorResult?.h7Pattern === '2121', 'p204 unresolved fixture has H7=2121');
assert(previousStatusUnresolved.primaryFormula?.result?.executorResult?.figureClass === 'other-source-class', 'p204 keeps incoming/outgoing figure outside mutable/fixed classes');
assert(previousStatusUnresolved.primaryFormula?.result?.executorResult?.previousStatus === null, 'p204 unresolved branch does not force a status');
assert(previousStatusUnresolved.overallPositive === null, 'p204 unresolved branch does not invent a verdict');

`;
  tests = tests.replace(anchor, block + anchor);
}

fs.writeFileSync(executorsPath, executors);
fs.writeFileSync(registryPath, registry);
fs.writeFileSync(testsPath, tests);

for (const [command, args] of [
  ['node', ['_test_kashf_canonical_routing.mjs']],
  ['node', ['_audit_kashf_question_route_coverage.mjs']],
]) {
  const result = spawnSync(command, args, { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log('Marriage p204 previous-status canonical executor cutover passed.');
