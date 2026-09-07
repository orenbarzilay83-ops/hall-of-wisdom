#!/usr/bin/env node
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const executorsPath = 'goral-hachol/engine/kashf-canonical-executors.js';
const registryPath = 'goral-hachol/registry/kashf-canonical-method-registry.js';
const testsPath = '_test_kashf_canonical_routing.mjs';
const auditPath = 'HALL_WISDOM_KASHF_P196_ILLNESS_RECOVERY_AUDIT.md';

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

if (!executors.includes('function computeIllnessRecoveryP196(chart) {')) {
  const marker = '\nconst CUSTOM_EXECUTORS = Object.freeze({';
  const at = executors.indexOf(marker);
  if (at < 0) throw new Error('CUSTOM_EXECUTORS marker not found');

  const fn = String.raw`

// Kashf p196: H15 alone gives the primary recovery/prolongation indication.
// Benefic => the patient recovers. Malefic => the illness is prolonged.
// The malefic clause does NOT say that recovery is impossible or that the
// patient dies, so canonical output must not turn prolongation into a false
// yes/no "will never recover" verdict. Mixed remains unresolved by this rule.
function computeIllnessRecoveryP196(chart) {
  if (!Array.isArray(chart)) return null;
  const h15 = findCanonicalHouse(chart, 15);
  const h15Pattern = h15?.key || h15?.pattern || null;
  if (!h15Pattern) return null;

  const h15FigureHebrew = h15?.hebrew || h15?.hebrewName || h15Pattern;
  const classification = classifyCanonicalFigure(h15Pattern);

  let recoveryStatus = 'unresolved';
  let recovers = null;
  let positive = null;
  let outputHebrew;

  if (classification.saadNahs === 'saad') {
    recoveryStatus = 'recovers';
    recovers = true;
    positive = true;
    outputHebrew = 'בית 15: ' + h15FigureHebrew + ' (' + h15Pattern + ') — צורה מיטיבה. לפי כשף עמ׳ 196: החולה יתרפא.';
  } else if (classification.saadNahs === 'nahs') {
    recoveryStatus = 'prolonged-illness';
    outputHebrew = 'בית 15: ' + h15FigureHebrew + ' (' + h15Pattern + ') — צורה מזיקה. לפי כשף עמ׳ 196: המחלה תתארך. המקור אינו אומר כאן שהחולה לא יתרפא לעולם ואינו נותן כאן דין מוות.';
  } else if (classification.saadNahs === 'mixed') {
    outputHebrew = 'בית 15: ' + h15FigureHebrew + ' (' + h15Pattern + ') — צורה ממוזגת. כלל כשף עמ׳ 196 נותן דין מפורש למיטיב ולמזיק בלבד; אין להמיר את הנטייה של צורה ממוזגת אוטומטית להחלמה או להתארכות.';
  } else {
    outputHebrew = 'לא ניתן לסווג את צורת בית 15 לפי סיווג מיטיב/מזיק/ממוזג הקנוני; אין להכריע את דין ההחלמה מן הכלל הזה.';
  }

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 196',
    sourceText: 'אם בחמישה־עשר צורה מיטיבה, הוא יתרפא; ואם היא מזיקה, המחלה תתארך.',
    housesUsed: [15],
    h15Pattern,
    h15FigureHebrew,
    classification,
    recoveryStatus,
    recovers,
    positive,
    outputHebrew,
  };
}
`;
  executors = executors.slice(0, at) + fn + executors.slice(at);
}

if (!executors.includes("'illness.p196.outcomeH15': computeIllnessRecoveryP196,")) {
  executors = executors.replace(
    'const CUSTOM_EXECUTORS = Object.freeze({\n',
    "const CUSTOM_EXECUTORS = Object.freeze({\n  'illness.p196.outcomeH15': computeIllnessRecoveryP196,\n"
  );
}

registry = updateMethodBlock(registry, 'illness.p196.outcomeH15', (block) => {
  let next = block
    .replace("    runtimeAllowed: false,", "    runtimeAllowed: true,")
    .replace("    executorStatus: 'pending',", "    executorStatus: 'ready',");
  const note = "    notes: 'Canonical p196 H15 executor is wired. Pure benefic => recovery; pure malefic => illness is prolonged. A malefic H15 is NOT promoted to a death/no-recovery verdict, because the source does not say that here. Mixed remains unresolved. Only H15 is executed for this intent; the broader illness bundle stays outside the verdict.',";
  if (/    notes: '[^']*',/.test(next)) next = next.replace(/    notes: '[^']*',/, note);
  else next = next.replace(/\n  \}\),$/, `\n${note}\n  }),`);
  return next;
});

const oldRouteBlock = `// ── Source-ready is NOT the same as executor-ready -----------------------\nconst illnessRecovery = assertRoute('q-illness-heal', {\n  ok: true,\n  canRunKashf: false,\n  kashfIntentId: 'illness.recovery',\n  kashfMethodId: 'illness.p196.outcomeH15',\n  kashfRuntimeStatus: 'ready',\n  executorStatus: 'pending',\n  runtimeAllowed: false,\n  reason: 'executor-pending',\n});\nassert(!canRunKashfMethod(illnessRecovery.kashfMethodId), 'source-ready method with pending executor cannot run');\n`;
const newRouteBlock = `// ── Exact illness recovery method is now executor-ready -------------------\nconst illnessRecovery = assertRoute('q-illness-heal', {\n  ok: true,\n  canRunKashf: true,\n  kashfIntentId: 'illness.recovery',\n  kashfMethodId: 'illness.p196.outcomeH15',\n  kashfRuntimeStatus: 'ready',\n  executorStatus: 'ready',\n  runtimeAllowed: true,\n});\nassert(canRunKashfMethod(illnessRecovery.kashfMethodId), 'p196 H15 recovery method is explicitly runnable');\n`;
if (!tests.includes(newRouteBlock)) {
  if (!tests.includes(oldRouteBlock)) throw new Error('Old illness route readiness block not found');
  tests = tests.replace(oldRouteBlock, newRouteBlock);
}

const oldBlocked = `const blockedIllnessReading = buildKashfReadingByQuestionId(PILOT_BOARD, 'q-illness-heal');\nassert(blockedIllnessReading.valid === false, 'source-ready but executor-pending illness reading is blocked');\nassert(blockedIllnessReading.reason === 'executor-pending', 'executor-pending reason is preserved to reading output');\n`;
if (tests.includes(oldBlocked)) tests = tests.replace(oldBlocked, '');

if (!tests.includes('// ── P12 illness recovery p196 H15 executor')) {
  const marker = '// ── Canonical execution isolation ----------------------------------------';
  const at = tests.indexOf(marker);
  if (at < 0) throw new Error('Canonical execution isolation marker not found');

  const block = String.raw`// ── P12 illness recovery p196 H15 executor ----------------------------
const illnessRecovers = buildKashfReadingByQuestionId(makeP9Board({ 15: '1122' }), 'q-illness-heal', { question: 'האם החולה יחלים?' });
assert(illnessRecovers.valid === true, 'p196 benefic H15 executes canonically');
assert(JSON.stringify(illnessRecovers.primaryFormula?.houses) === JSON.stringify([15]), 'p196 traces H15 only');
assert(illnessRecovers.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'saad', 'p196 positive fixture is pure benefic');
assert(illnessRecovers.primaryFormula?.result?.executorResult?.recoveryStatus === 'recovers', 'p196 benefic H15 gives recovery');
assert(illnessRecovers.primaryFormula?.result?.executorResult?.recovers === true, 'p196 benefic H15 records explicit recovery');
assert(illnessRecovers.overallPositive === true, 'p196 benefic branch is positive');
assert(illnessRecovers.canonicalExecution?.methodsExecuted?.length === 1, 'p196 executes exactly one method');
assert(illnessRecovers.canonicalExecution?.topicBundleExecuted === false, 'p196 does not execute broad illness bundle');
assert(illnessRecovers.dhamir == null, 'p196 does not auto-run Dhamir');

const illnessProlonged = buildKashfReadingByQuestionId(makeP9Board({ 15: '1112' }), 'q-illness-heal', { question: 'האם החולה יחלים?' });
assert(illnessProlonged.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'nahs', 'p196 prolonged fixture is pure malefic');
assert(illnessProlonged.primaryFormula?.result?.executorResult?.recoveryStatus === 'prolonged-illness', 'p196 malefic H15 means prolonged illness');
assert(illnessProlonged.primaryFormula?.result?.executorResult?.recovers === null, 'p196 malefic H15 does not invent a categorical no-recovery verdict');
assert(illnessProlonged.overallPositive === null, 'p196 prolongation remains non-binary');
assert(illnessProlonged.verdict?.text?.includes('המחלה תתארך'), 'p196 prolonged branch preserves exact source sense');
assert(!illnessProlonged.verdict?.text?.includes('ימות'), 'p196 H15 malefic branch does not invent death');
assert(!illnessProlonged.verdict?.text?.includes('לא יתרפא'), 'p196 H15 malefic branch does not invent permanent non-recovery');

const illnessMixed = buildKashfReadingByQuestionId(makeP9Board({ 15: '1111' }), 'q-illness-heal', { question: 'האם החולה יחלים?' });
assert(illnessMixed.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'mixed', 'p196 mixed fixture stays mixed');
assert(illnessMixed.primaryFormula?.result?.executorResult?.recoveryStatus === 'unresolved', 'p196 mixed branch remains unresolved');
assert(illnessMixed.primaryFormula?.result?.executorResult?.recovers === null, 'p196 mixed branch does not invent recovery');
assert(illnessMixed.overallPositive === null, 'p196 mixed branch remains non-binary');

const illnessHtml = writeCanonicalKashfReading(illnessRecovers);
assert(illnessHtml.includes('illness.p196.outcomeH15'), 'p196 narrative exposes exact canonical method id');
assert(illnessHtml.includes('החולה יתרפא'), 'p196 narrative preserves recovery wording');
assert(!illnessHtml.includes('עדים ודיין'), 'p196 narrative does not aggregate broader illness witnesses/judge');

`;
  tests = tests.slice(0, at) + block + tests.slice(at);
}

fs.writeFileSync(executorsPath, executors);
fs.writeFileSync(registryPath, registry);
fs.writeFileSync(testsPath, tests);

fs.writeFileSync(auditPath, `# Kashf p196 — Illness recovery H15 canonical audit\n\n## Runtime intent\n- Intent: \`illness.recovery\`\n- Canonical method: \`illness.p196.outcomeH15\`\n- Houses used: H15 only.\n\n## Primary Arabic source\nThe printed p196 passage states:\n\n> وإن كان في الخامس عشر سعد فإنه يبريء؛ وإن كان نحسا فإنه يطول المرض\n\nWorking Hebrew:\n\n> ואם בחמישה־עשר צורה מיטיבה, הוא יתרפא. ואם היא מזיקה, המחלה תתארך.\n\n## Canonical boundary\n- H15 pure benefic (saad): explicit recovery.\n- H15 pure malefic (nahs): explicit prolongation of illness.\n- H15 mixed: unresolved by this sentence.\n\nThe malefic branch does **not** say death and does **not** say permanent non-recovery. Therefore the executor records prolongation with a non-binary \`overallPositive = null\` rather than fabricating a categorical "no" answer to "will the patient recover?".\n\nOther illness rules in pp196-202 remain separate methods/supporting conditions and are not aggregated into this verdict.\n`);

for (const file of [executorsPath, registryPath, testsPath]) {
  const check = spawnSync('node', ['--check', file], { stdio: 'inherit' });
  if (check.status !== 0) process.exit(check.status ?? 1);
}
for (const script of ['_test_kashf_canonical_routing.mjs', '_audit_kashf_question_route_coverage.mjs']) {
  const run = spawnSync('node', [script], { stdio: 'inherit' });
  if (run.status !== 0) process.exit(run.status ?? 1);
}
console.log('P12 p196 H15 illness-recovery canonical cutover passed.');
