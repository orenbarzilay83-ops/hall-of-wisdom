#!/usr/bin/env node
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const executorsPath = 'goral-hachol/engine/kashf-canonical-executors.js';
const registryPath = 'goral-hachol/registry/kashf-canonical-method-registry.js';
const routesPath = 'goral-hachol/registry/kashf-question-route-registry.js';
const bankPath = 'goral-hachol/ui/question-bank.js';
const testsPath = '_test_kashf_canonical_routing.mjs';

let executors = fs.readFileSync(executorsPath, 'utf8');
let registry = fs.readFileSync(registryPath, 'utf8');
let routes = fs.readFileSync(routesPath, 'utf8');
let bank = fs.readFileSync(bankPath, 'utf8');
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

// ── 1. Correct p204 previous-status mechanism ----------------------------
const oldMethodId = 'marriage.p204.previousStatusH7';
const newMethodId = 'marriage.p204.previousStatusH7inH10';

// Replace the current executor body: p204 requires the H7 figure to occur in H10.
const previousFnStart = executors.indexOf('function computeMarriagePreviousStatusP204(chart) {');
if (previousFnStart < 0) throw new Error('p204 previous-status executor not found');
const previousFnEnd = executors.indexOf('\n}\n\nconst CUSTOM_EXECUTORS', previousFnStart);
if (previousFnEnd < 0) throw new Error('p204 previous-status executor end not found');

const correctedPreviousFn = String.raw`function computeMarriagePreviousStatusP204(chart) {
  if (!Array.isArray(chart)) return null;
  const h7 = chart.find((entry) => Number(entry?.house ?? entry?.houseNumber) === 7) || chart[6] || null;
  const h10 = chart.find((entry) => Number(entry?.house ?? entry?.houseNumber) === 10) || chart[9] || null;
  const h7Pattern = h7?.key || h7?.pattern || null;
  const h10Pattern = h10?.key || h10?.pattern || null;
  if (!h7Pattern || !h10Pattern) return null;

  const figureHebrew = h7?.hebrew || h7?.hebrewName || h7Pattern;
  const recursInH10 = h7Pattern === h10Pattern;
  const isMutable = P204_MUTABLE_PATTERNS.has(h7Pattern);
  const isFixed = P204_FIXED_PATTERNS.has(h7Pattern);

  let previousStatus = null;
  let previousStatusHebrew = 'לא הוכרע בכלל זה';
  let figureClass = isMutable ? 'mutable' : isFixed ? 'fixed' : 'other-source-class';
  let figureClassHebrew = isMutable ? 'מתהפכת' : isFixed ? 'קבועה' : 'אינה מארבע המתהפכות ואינה מארבע הקבועות';
  let outputHebrew;

  if (!recursInH10) {
    outputHebrew = 'צורת בית 7 (' + figureHebrew + ', ' + h7Pattern + ') אינה נמצאת בבית 10. כלל כשף עמ׳ 204 קושר את דין גרושה/בתולה למצב שבו השביעי נמצא בעשירי; לכן כלל זה לבדו אינו מכריע כאן.';
  } else if (isMutable) {
    previousStatus = 'divorced';
    previousStatusHebrew = 'גרושה';
    outputHebrew = 'צורת בית 7 (' + figureHebrew + ', ' + h7Pattern + ') חוזרת בבית 10 והיא מתהפכת. לפי כשף עמ׳ 204: גרושה.';
  } else if (isFixed) {
    previousStatus = 'virgin';
    previousStatusHebrew = 'בתולה';
    outputHebrew = 'צורת בית 7 (' + figureHebrew + ', ' + h7Pattern + ') חוזרת בבית 10 והיא קבועה. לפי כשף עמ׳ 204: בתולה.';
  } else {
    outputHebrew = 'צורת בית 7 (' + figureHebrew + ', ' + h7Pattern + ') חוזרת בבית 10, אך היא אינה אחת מארבע המתהפכות ואינה אחת מארבע הקבועות שנקבעו בסיווג המקור. כלל עמ׳ 204 לבדו אינו מכריע גרושה לעומת בתולה; אין להשלים מן הדעת.';
  }

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 204; סיווג מתהפך/קבוע עמ׳ 57–60',
    sourceText: 'אם השביעי נמצא בעשירי: אם הוא מתהפך — גרושה; ואם הוא קבוע — בתולה.',
    housesUsed: [7, 10],
    h7Pattern,
    h10Pattern,
    h7FigureHebrew: figureHebrew,
    recursInH10,
    figureClass,
    figureClassHebrew,
    previousStatus,
    previousStatusHebrew,
    positive: null,
    outputHebrew,
  };
}`;

executors = executors.slice(0, previousFnStart) + correctedPreviousFn + executors.slice(previousFnEnd + 2);
executors = executors.replaceAll(`'${oldMethodId}'`, `'${newMethodId}'`);

// ── 2. Add source-safe p204 dowry executor -------------------------------
if (!executors.includes('function computeDowryH8P204')) {
  const anchor = 'const CUSTOM_EXECUTORS = Object.freeze({';
  if (!executors.includes(anchor)) throw new Error('Custom executor anchor missing');
  const dowryFn = String.raw`
function computeDowryH8P204(chart) {
  if (!Array.isArray(chart)) return null;
  const h8 = chart.find((entry) => Number(entry?.house ?? entry?.houseNumber) === 8) || chart[7] || null;
  const h8Pattern = h8?.key || h8?.pattern || null;
  if (!h8Pattern) return null;

  const h8FigureHebrew = h8?.hebrew || h8?.hebrewName || h8Pattern;
  const classification = classifyCanonicalFigure(h8Pattern);
  const isLarge = classification.saadNahs === 'saad' ? true : null;

  let outputHebrew;
  if (isLarge === true) {
    outputHebrew = 'בית 8: ' + h8FigureHebrew + ' (' + h8Pattern + ') — צורה מיטיבה. לפי כשף עמ׳ 204: המוהר גדול.';
  } else if (classification.saadNahs === 'nahs') {
    outputHebrew = 'בית 8: ' + h8FigureHebrew + ' (' + h8Pattern + ') — צורה מזיקה. עמ׳ 204 קובע במפורש רק שמיטיב בבית 8 מורה על מוהר גדול; משפט המזיק הסמוך שייך לדין המשפחה בבית 10. לכן אין להסיק מכאן מוהר קטן.';
  } else if (classification.saadNahs === 'mixed') {
    outputHebrew = 'בית 8: ' + h8FigureHebrew + ' (' + h8Pattern + ') — צורה ממוזגת. עמ׳ 204 אינו נותן כאן דין מפורש לגודל המוהר בצורת ממוזג, ולכן אין להשלים מן הדעת.';
  } else {
    outputHebrew = 'לא ניתן לסווג את צורת בית 8 לפי סיווג המיטיב/מזיק/ממוזג הקנוני; אין להכריע את גודל המוהר.';
  }

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 204',
    sourceText: 'צורה מיטיבה בבית השמיני מורה על מוהר גדול.',
    housesUsed: [8],
    h8Pattern,
    h8FigureHebrew,
    classification,
    isLargeDowry: isLarge,
    positive: null,
    outputHebrew,
  };
}

`;
  executors = executors.replace(anchor, dowryFn + anchor);
}
if (!executors.includes("'marriage.p204.dowryH8': computeDowryH8P204")) {
  executors = executors.replace(
    `  '${newMethodId}': computeMarriagePreviousStatusP204,\n`,
    `  '${newMethodId}': computeMarriagePreviousStatusP204,\n  'marriage.p204.dowryH8': computeDowryH8P204,\n`
  );
}

// ── 3. Registry corrections ---------------------------------------------
registry = updateMethodBlock(registry, 'marriage.p204.dowryH8', (block) => {
  let next = block.replace('    runtimeAllowed: false,', '    runtimeAllowed: true,');
  next = next.replace("    executorStatus: 'pending',", "    executorStatus: 'ready',");
  next = next.replace(
    "    notes: 'H8 benefic indicates a large mahr; the paired malefic statement indicates lowness. Keep separate from H10 family-status judgment.',",
    "    notes: 'Canonical p204 H8 executor: an explicitly benefic figure indicates a large mahr. The immediately following benefic/malefic clause belongs to H10 family status, so H8 malefic or mixed does NOT authorize a small-mahr verdict. Those branches remain unresolved.',"
  );
  return next;
});

registry = updateMethodBlock(registry, oldMethodId, (block) => {
  let next = block.replaceAll(oldMethodId, newMethodId);
  next = next.replace(
    /    notes: '.*',/,
    "    notes: 'Corrected against primary Arabic p204: the H7 figure must occur in H10. If that repeated figure is mutable (منقلب) => divorced (مطلقة); if fixed (ثابت) => virgin (بكر). If H7 does not recur in H10, or the repeated figure is outside the four source-defined mutable/four fixed classes, this rule remains unresolved. It does not distinguish widowhood.',"
  );
  return next;
});

// ── 4. Route + Question Bank wording ------------------------------------
routes = routes.replaceAll(oldMethodId, newMethodId);
const routeMarker = "  'q-marriage-thayib': route({";
const routeStart = routes.indexOf(routeMarker);
if (routeStart < 0) throw new Error('q-marriage-thayib route not found');
const routeEnd = routes.indexOf('\n  }),', routeStart);
if (routeEnd < 0) throw new Error('q-marriage-thayib route end not found');
let routeBlock = routes.slice(routeStart, routeEnd + 6);
if (!routeBlock.includes('note:')) {
  routeBlock = routeBlock.replace(
    "    kashfRuntimeStatus: 'ready',",
    "    kashfRuntimeStatus: 'ready',\n    note: 'Source-safe p204 question is divorced vs virgin, and only when the H7 figure recurs in H10. The source does not provide widow as a third result in this rule.',"
  );
} else {
  routeBlock = routeBlock.replace(/    note: '.*',/, "    note: 'Source-safe p204 question is divorced vs virgin, and only when the H7 figure recurs in H10. The source does not provide widow as a third result in this rule.',");
}
routes = routes.slice(0, routeStart) + routeBlock + routes.slice(routeEnd + 6);

const oldBankText = "    label: 'האם האישה בתולה או גרושה / אלמנה?',\n    desc: 'לבחינת עבר האישה — האם נישאה בעבר. שאלה עדינה הדורשת הקשר מתאים',";
const newBankText = "    label: 'האם האישה בתולה או גרושה?',\n    desc: 'כלל כשף עמ׳ 204: רק כאשר צורת בית 7 חוזרת בבית 10 — מתהפכת מורה גרושה וקבועה מורה בתולה. הכלל אינו מבחין באלמנה.',";
if (!bank.includes(oldBankText)) throw new Error('q-marriage-thayib Question Bank wording anchor not found');
bank = bank.replace(oldBankText, newBankText);

const oldDowryText = "    label: 'מה גובה הנדוניה / המוהר?',\n    desc: 'לגובה המוהר ותנאי הנישואין — לשדכנות ומשא ומתן',";
const newDowryText = "    label: 'האם המוהר גדול?',\n    desc: 'כלל כשף עמ׳ 204: צורה מיטיבה בבית 8 מורה על מוהר גדול. המקור אינו נותן כאן סכום מספרי ואינו קובע שמזיק פירושו מוהר קטן.',";
if (!bank.includes(oldDowryText)) throw new Error('q-dowry Question Bank wording anchor not found');
bank = bank.replace(oldDowryText, newDowryText);

// ── 5. Replace incorrect P8 contracts and add dowry contracts ------------
const testStartMarker = '// ── P8 marriage previous-status p204 executor';
const testEndMarker = '// ── P9 source-safe mixed classification';
const testStart = tests.indexOf(testStartMarker);
const testEnd = tests.indexOf(testEndMarker, testStart);
if (testStart < 0 || testEnd < 0) throw new Error('P8 test block boundaries not found');

const correctedTests = String.raw`// ── P10 corrected marriage p204 source contracts -----------------------
function makeP204Board(overrides = {}) {
  return {
    entries: Array.from({ length: 16 }, (_, index) => {
      const house = index + 1;
      const pattern = overrides[house] || '2222';
      return { house, houseNumber: house, pattern, key: pattern, hebrewName: pattern };
    }),
    boardValidation: { isValid: true, warnings: [] },
  };
}

assertRoute('q-marriage-thayib', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'marriage.previousStatus',
  kashfMethodId: 'marriage.p204.previousStatusH7inH10',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assert(canRunKashfMethod('marriage.p204.previousStatusH7inH10'), 'corrected p204 previous-status method is explicitly runnable');
assert(!getKashfMethod('marriage.p204.previousStatusH7'), 'misleading old p204 H7-only method id no longer exists');

const previousStatusDivorced = buildKashfReadingByQuestionId(makeP204Board({ 7: '1121', 10: '1121' }), 'q-marriage-thayib', { question: 'האם האישה בתולה או גרושה?' });
assert(previousStatusDivorced.valid === true && previousStatusDivorced.canRunKashf === true, 'p204 repeated mutable H7 executes canonically');
assert(previousStatusDivorced.kashfMethodId === 'marriage.p204.previousStatusH7inH10', 'p204 executes corrected H7-in-H10 method id');
assert(JSON.stringify(previousStatusDivorced.primaryFormula?.houses) === JSON.stringify([7, 10]), 'p204 previous-status traces H7+H10');
assert(previousStatusDivorced.primaryFormula?.result?.executorResult?.recursInH10 === true, 'p204 verifies H7 recurrence in H10 before judging status');
assert(previousStatusDivorced.primaryFormula?.result?.executorResult?.figureClass === 'mutable', 'p204 repeated 1121 is source-defined mutable');
assert(previousStatusDivorced.primaryFormula?.result?.executorResult?.previousStatus === 'divorced', 'p204 mutable recurrence returns divorced exactly');
assert(previousStatusDivorced.primaryFormula?.result?.executorResult?.previousStatusHebrew === 'גרושה', 'p204 renders source category גרושה');
assert(previousStatusDivorced.overallPositive === null, 'p204 previous status remains descriptive, not positive/negative');
assert(previousStatusDivorced.altFormula === null, 'p204 previous-status does not aggregate marriage alternatives');
assert(previousStatusDivorced.canonicalExecution?.topicBundleExecuted === false, 'p204 previous-status does not execute broad marriage bundle');
assert(previousStatusDivorced.dhamir === null, 'p204 previous-status does not auto-run Dhamir');
const previousStatusDivorcedHtml = writeCanonicalKashfReading(previousStatusDivorced);
assert(previousStatusDivorcedHtml.includes('marriage.p204.previousStatusH7inH10'), 'p204 narrative exposes corrected method id');
assert(previousStatusDivorcedHtml.includes('גרושה'), 'p204 narrative preserves explicit divorced result');
assert(!previousStatusDivorcedHtml.includes('אלמנה'), 'p204 runtime does not invent widow result');

const previousStatusVirgin = buildKashfReadingByQuestionId(makeP204Board({ 7: '2222', 10: '2222' }), 'q-marriage-thayib', { question: 'האם האישה בתולה או גרושה?' });
assert(previousStatusVirgin.primaryFormula?.result?.executorResult?.recursInH10 === true, 'p204 fixed fixture also requires recurrence');
assert(previousStatusVirgin.primaryFormula?.result?.executorResult?.figureClass === 'fixed', 'p204 repeated 2222 is source-defined fixed');
assert(previousStatusVirgin.primaryFormula?.result?.executorResult?.previousStatus === 'virgin', 'p204 fixed recurrence returns virgin');
assert(previousStatusVirgin.primaryFormula?.result?.executorResult?.previousStatusHebrew === 'בתולה', 'p204 renders exact virgin result');

const previousStatusNoRecurrence = buildKashfReadingByQuestionId(makeP204Board({ 7: '1121', 10: '2222' }), 'q-marriage-thayib', { question: 'האם האישה בתולה או גרושה?' });
assert(previousStatusNoRecurrence.primaryFormula?.result?.executorResult?.recursInH10 === false, 'p204 detects when H7 does not recur in H10');
assert(previousStatusNoRecurrence.primaryFormula?.result?.executorResult?.previousStatus === null, 'p204 does not judge status without H7 recurrence in H10');
assert(previousStatusNoRecurrence.overallPositive === null, 'p204 no-recurrence branch stays unresolved');

const previousStatusOtherClass = buildKashfReadingByQuestionId(makeP204Board({ 7: '1112', 10: '1112' }), 'q-marriage-thayib', { question: 'האם האישה בתולה או גרושה?' });
assert(previousStatusOtherClass.primaryFormula?.result?.executorResult?.recursInH10 === true, 'p204 other-class fixture has required recurrence');
assert(previousStatusOtherClass.primaryFormula?.result?.executorResult?.figureClass === 'other-source-class', 'p204 keeps outgoing/incoming figure outside fixed/mutable source classes');
assert(previousStatusOtherClass.primaryFormula?.result?.executorResult?.previousStatus === null, 'p204 repeated other-class figure remains unresolved');

assertRoute('q-dowry', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'marriage.dowryAmount',
  kashfMethodId: 'marriage.p204.dowryH8',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assert(canRunKashfMethod('marriage.p204.dowryH8'), 'p204 H8 dowry method is explicitly runnable');

const dowryLarge = buildKashfReadingByQuestionId(makeP204Board({ 8: '1122' }), 'q-dowry', { question: 'האם המוהר גדול?' });
assert(dowryLarge.valid === true, 'p204 dowry benefic fixture executes canonically');
assert(JSON.stringify(dowryLarge.primaryFormula?.houses) === JSON.stringify([8]), 'p204 dowry traces only H8');
assert(dowryLarge.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'saad', 'p204 dowry fixture has pure benefic H8');
assert(dowryLarge.primaryFormula?.result?.executorResult?.isLargeDowry === true, 'p204 benefic H8 explicitly yields large mahr');
assert(dowryLarge.overallPositive === null, 'dowry size is descriptive rather than normative positive/negative');
assert(dowryLarge.canonicalExecution?.topicBundleExecuted === false, 'p204 dowry does not execute broad marriage bundle');
assert(dowryLarge.dhamir === null, 'p204 dowry does not auto-run Dhamir');
const dowryLargeHtml = writeCanonicalKashfReading(dowryLarge);
assert(dowryLargeHtml.includes('marriage.p204.dowryH8'), 'p204 dowry narrative exposes exact method id');
assert(dowryLargeHtml.includes('המוהר גדול'), 'p204 dowry narrative preserves exact large-mahr statement');

const dowryMalefic = buildKashfReadingByQuestionId(makeP204Board({ 8: '1112' }), 'q-dowry', { question: 'האם המוהר גדול?' });
assert(dowryMalefic.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'nahs', 'p204 dowry malefic fixture is classified as malefic');
assert(dowryMalefic.primaryFormula?.result?.executorResult?.isLargeDowry === null, 'p204 does not turn malefic H8 into an unsourced small-mahr verdict');
assert(dowryMalefic.overallPositive === null, 'p204 malefic H8 stays unresolved for mahr size');

const dowryMixed = buildKashfReadingByQuestionId(makeP204Board({ 8: '2212' }), 'q-dowry', { question: 'האם המוהר גדול?' });
assert(dowryMixed.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'mixed', 'p204 dowry preserves mixed H8');
assert(dowryMixed.primaryFormula?.result?.executorResult?.isLargeDowry === null, 'p204 mixed H8 does not invent a dowry-size verdict');
assert(dowryMixed.overallPositive === null, 'p204 mixed H8 remains unresolved');

`;
tests = tests.slice(0, testStart) + correctedTests + tests.slice(testEnd);
tests = tests.replaceAll(oldMethodId, newMethodId);

fs.writeFileSync(executorsPath, executors);
fs.writeFileSync(registryPath, registry);
fs.writeFileSync(routesPath, routes);
fs.writeFileSync(bankPath, bank);
fs.writeFileSync(testsPath, tests);

for (const [cmd, args] of [
  ['node', ['_test_kashf_canonical_routing.mjs']],
  ['node', ['_audit_kashf_question_route_coverage.mjs']],
]) {
  const result = spawnSync(cmd, args, { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log('P10 p204 source corrections and dowry executor cutover passed.');
