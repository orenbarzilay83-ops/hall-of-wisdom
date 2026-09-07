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
  const lines = block.split('\n');
  let replaced = false;
  const next = lines.map((line) => {
    if (line.trimStart().startsWith('notes: ')) {
      replaced = true;
      const indent = line.slice(0, line.indexOf('notes:'));
      return `${indent}notes: '${note.replaceAll("'", "\\'")}',`;
    }
    return line;
  });
  if (!replaced) {
    const close = next.length - 1;
    next.splice(close, 0, `    notes: '${note.replaceAll("'", "\\'")}',`);
  }
  return next.join('\n');
}

// Reuse the already-audited figure-combination and planetary-attribution sources.
const pendingImport = `} from './kashf-pending-extraction.js';\n`;
if (!executors.includes("from './raml-figures.js'")) {
  if (!executors.includes(pendingImport)) throw new Error('Could not find pending-extraction import anchor');
  executors = executors.replace(
    pendingImport,
    pendingImport + `\nimport { combineRamlFigures } from './raml-figures.js';\nimport { FIGURE_PLANET_MAP } from '../data/sources/kashf-al-asrar/kashf-hazz.js';\n`
  );
}

if (!executors.includes('function computeHonorConditionP256')) {
  const anchor = 'const CUSTOM_EXECUTORS = Object.freeze({';
  if (!executors.includes(anchor)) throw new Error('Could not find custom executor anchor');

  const block = `
const P256_HONOR_POSITIVE_PLANETS = new Set(['שמש', 'צדק', 'נוגה']);
const P257_APPOINTMENT_COMPLETION_PLANETS = new Set(['שמש', 'ירח', 'צדק', 'נוגה']);

function findCanonicalHouse(chart, houseNumber) {
  if (!Array.isArray(chart)) return null;
  return chart.find((entry) => Number(entry?.house ?? entry?.houseNumber) === houseNumber)
    || chart[houseNumber - 1]
    || null;
}

function getVerifiedPlanetForPattern(pattern) {
  if (!pattern) return null;
  const record = FIGURE_PLANET_MAP.find((entry) => Array.isArray(entry.patterns) && entry.patterns.includes(pattern));
  if (!record) return null;
  return {
    planetHebrew: record.planet,
    planetArabic: record.arabicName,
    sourceStatus: record.sourceStatus,
  };
}

function computeHonorConditionP256(chart) {
  const h10 = findCanonicalHouse(chart, 10);
  const pattern = h10?.key || h10?.pattern || null;
  if (!pattern) return null;

  const figureHebrew = h10?.hebrew || h10?.hebrewName || pattern;
  const planet = getVerifiedPlanetForPattern(pattern);
  const planetHebrew = planet?.planetHebrew || null;

  let condition = 'unresolved-by-source';
  let conditionHebrew = 'לא הוכרע בכלל זה';
  let positive = null;
  let outputHebrew;

  if (planetHebrew === 'שמש') {
    condition = 'strong-honor-and-rank';
    conditionHebrew = 'כוח בכבוד ובמעלה';
    positive = true;
    outputHebrew = \`בית 10: \${figureHebrew} (\${pattern}) — מצורות השמש. לפי כשף עמ׳ 256 הדבר מורה על כוח הכבוד והמעלה ועל שלווה לבעלי השררה.\`;
  } else if (planetHebrew === 'צדק' || planetHebrew === 'נוגה') {
    condition = 'good-and-complete';
    conditionHebrew = 'טוב ושלמות';
    positive = true;
    outputHebrew = \`בית 10: \${figureHebrew} (\${pattern}) — מצורות \${planetHebrew}. לפי כשף עמ׳ 256 הדבר מורה על טוב ושלמות.\`;
  } else if (planetHebrew === 'שבתאי') {
    condition = 'no-benefit-gloom-distress';
    conditionHebrew = 'חוסר תועלת, קדרות וצער';
    positive = false;
    outputHebrew = \`בית 10: \${figureHebrew} (\${pattern}) — מצורות שבתאי. לפי כשף עמ׳ 256 הדבר מורה על חוסר תועלת, קדרות וצער.\`;
  } else if (planetHebrew) {
    outputHebrew = \`בית 10: \${figureHebrew} (\${pattern}) — מצורות \${planetHebrew}. במקטע כשף עמ׳ 256 נמסרה הוראה מפורשת לשמש, לצדק/נוגה ולשבתאי בלבד; אין להשלים מכאן דין לפרסום או למעמד עבור כוכב זה.\`;
  } else {
    outputHebrew = \`בית 10: \${figureHebrew} (\${pattern}) — לא נמצא שיוך כוכבי מאומת במפת כשף עמ׳ 133–134, ולכן אין להכריע את מצב הכבוד לפי כלל עמ׳ 256.\`;
  }

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 256; שיוכי כוכבים עמ׳ 133–134',
    sourceText: 'בבית הכבוד והשררה: צורות השמש מורות על כוח הכבוד והמעלה; צדק או נוגה על טוב ושלמות; שבתאי על חוסר תועלת, קדרות וצער.',
    housesUsed: [10],
    h10Pattern: pattern,
    h10FigureHebrew: figureHebrew,
    planetHebrew,
    planetArabic: planet?.planetArabic || null,
    planetSourceStatus: planet?.sourceStatus || null,
    condition,
    conditionHebrew,
    positive,
    outputHebrew,
  };
}

function computeAppointmentCompletionP257(chart) {
  const h1 = findCanonicalHouse(chart, 1);
  const h10 = findCanonicalHouse(chart, 10);
  const h1Pattern = h1?.key || h1?.pattern || null;
  const h10Pattern = h10?.key || h10?.pattern || null;
  if (!h1Pattern || !h10Pattern) return null;

  const combined = combineRamlFigures(h1Pattern, h10Pattern);
  const resultPattern = combined.resultPattern;
  const resultFigureHebrew = combined.result?.hebrewName || resultPattern;
  const planet = getVerifiedPlanetForPattern(resultPattern);
  const planetHebrew = planet?.planetHebrew || null;
  const appointmentCompletes = planetHebrew
    ? P257_APPOINTMENT_COMPLETION_PLANETS.has(planetHebrew)
    : null;

  let sourceClass = null;
  if (planetHebrew === 'שמש' || planetHebrew === 'ירח') sourceClass = 'luminary';
  if (planetHebrew === 'צדק' || planetHebrew === 'נוגה') sourceClass = 'benefic-planet';

  let outputHebrew;
  if (appointmentCompletes === true) {
    const classHebrew = sourceClass === 'luminary' ? 'משני המאורות' : 'משני הכוכבים המיטיבים';
    outputHebrew = \`הולד צורה מבית 1 (\${h1Pattern}) ומבית 10 (\${h10Pattern}): \${resultFigureHebrew} (\${resultPattern}), שיוכה \${planetHebrew}. היא \${classHebrew}; לפי כשף עמ׳ 257 השררה / המינוי מתקיימים.\`;
  } else if (appointmentCompletes === false) {
    outputHebrew = \`הולד צורה מבית 1 (\${h1Pattern}) ומבית 10 (\${h10Pattern}): \${resultFigureHebrew} (\${resultPattern}), שיוכה \${planetHebrew}. היא אינה מצורות השמש/הירח ואינה מצורות צדק/נוגה; לפי כשף עמ׳ 257 השררה / המינוי אינם מתקיימים.\`;
  } else {
    outputHebrew = \`הולד צורה מבית 1 (\${h1Pattern}) ומבית 10 (\${h10Pattern}): \${resultFigureHebrew} (\${resultPattern}), אך אין לה שיוך כוכבי מאומת במפת כשף עמ׳ 133–134. אין להחליף את החסר בסיווג מיטיב/מזיק.\`;
  }

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 257; שיוכי כוכבים עמ׳ 133–134',
    sourceText: 'הולד צורה מן הראשון והעשירי: אם היא מצורות שני המאורות, השמש והירח, או משני הכוכבים המיטיבים, צדק ונוגה — השררה מתקיימת; ואם לא — אינה מתקיימת.',
    housesUsed: [1, 10],
    h1Pattern,
    h10Pattern,
    resultPattern,
    resultFigureHebrew,
    planetHebrew,
    planetArabic: planet?.planetArabic || null,
    planetSourceStatus: planet?.sourceStatus || null,
    sourceClass,
    appointmentCompletes,
    positive: appointmentCompletes,
    outputHebrew,
  };
}

`;
  executors = executors.replace(anchor, block + anchor);
}

if (!executors.includes("'authority.p256.honorConditionH10Planet': computeHonorConditionP256")) {
  executors = executors.replace(
    "  'theft.p224.relationshipH7Recurrence': computeThiefRelationshipP224,\n",
    "  'theft.p224.relationshipH7Recurrence': computeThiefRelationshipP224,\n  'authority.p256.honorConditionH10Planet': computeHonorConditionP256,\n  'authority.p257.appointmentH1H10Planet': computeAppointmentCompletionP257,\n"
  );
}

registry = updateMethodBlock(registry, 'authority.p256.honorConditionH10Planet', (block) => {
  let next = block.replace('    runtimeAllowed: false,', '    runtimeAllowed: true,');
  next = next.replace("    executorStatus: 'pending',", "    executorStatus: 'ready',");
  next = replaceNotes(next, 'Canonical p256 H10-planet executor is wired to the source-verified p133-134 planetary map. Sun => strength of honor/rank; Jupiter or Venus => good/completion; Saturn => lack of benefit, gloom and distress. Moon, Mercury and Mars remain unresolved by this p256 excerpt; do not turn this into a binary fame prediction.');
  return next;
});

registry = updateMethodBlock(registry, 'authority.p257.appointmentH1H10Planet', (block) => {
  let next = block.replace('    runtimeAllowed: false,', '    runtimeAllowed: true,');
  next = next.replace("    executorStatus: 'pending',", "    executorStatus: 'ready',");
  next = replaceNotes(next, 'Canonical p257 executor combines H1+H10 and judges the resulting figure by the source-verified planetary attribution. Sun/Moon or Jupiter/Venus => the appointment/authority completes; every other verified planet => it does not. Never substitute a benefic/malefic proxy for the planetary rule.');
  return next;
});

// Preserve the p239 blocker discovered by checking the primary Arabic scan.
registry = updateMethodBlock(registry, 'travel.p239.seaOrLandByElement', (block) => {
  return replaceNotes(block, 'Primary Arabic source (printed p237; working HTML p239) judges the figure produced from the preceding two figures: fire = go by land and return by sea; air = sea out / land back; water = sea / sea; earth = land / land. The preceding construction begins with “تراب المنطقة” and H2, but “المنطقة” is not defined elsewhere in the audited source. Executor therefore remains pending until that input is resolved. Do not use the Hebrew working-text omission of the fire return leg as runtime authority.');
});

if (!tests.includes('// ── P7 authority planetary executors')) {
  const anchor = '// ── Canonical execution isolation ----------------------------------------';
  if (!tests.includes(anchor)) throw new Error('Could not find canonical isolation test anchor');

  const block = String.raw`// ── P7 authority planetary executors -----------------------------------
assertRoute('q-fame', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'authority.honorCondition',
  kashfMethodId: 'authority.p256.honorConditionH10Planet',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assert(canRunKashfMethod('authority.p256.honorConditionH10Planet'), 'p256 honor-condition method is runnable only through its exact canonical executor');

const AUTHORITY_P256_SUN_BOARD = buildRamlBoardFromMothers(['1111', '1111', '1111', '2211']);
const authoritySun = buildKashfReadingByQuestionId(AUTHORITY_P256_SUN_BOARD, 'q-fame', { question: 'מצב הכבוד והמעמד' });
assert(authoritySun.valid === true && authoritySun.canRunKashf === true, 'p256 Sun board executes canonically');
assert(authoritySun.kashfMethodId === 'authority.p256.honorConditionH10Planet', 'p256 executes only the exact honor-condition method');
assert(JSON.stringify(authoritySun.primaryFormula?.houses) === JSON.stringify([10]), 'p256 traces only H10');
assert(authoritySun.primaryFormula?.result?.executorResult?.h10Pattern === '1122', 'p256 positive fixture has H10=1122');
assert(authoritySun.primaryFormula?.result?.executorResult?.planetHebrew === 'שמש', 'p256 resolves H10=1122 to Sun using the audited planet map');
assert(authoritySun.primaryFormula?.result?.executorResult?.condition === 'strong-honor-and-rank', 'p256 Sun branch preserves source-specific honor/rank meaning');
assert(authoritySun.overallPositive === true, 'p256 Sun branch is positive');
assert(authoritySun.canonicalExecution?.topicBundleExecuted === false, 'p256 does not execute broad authorityState bundle');
assert(authoritySun.dhamir === null, 'p256 does not auto-run Dhamir');
const authoritySunHtml = writeCanonicalKashfReading(authoritySun);
assert(authoritySunHtml.includes('authority.p256.honorConditionH10Planet'), 'p256 narrative exposes exact canonical method id');
assert(authoritySunHtml.includes('מצורות השמש'), 'p256 narrative preserves the Sun condition instead of promising fame');

const AUTHORITY_P256_SATURN_BOARD = buildRamlBoardFromMothers(['1111', '1111', '1111', '2221']);
const authoritySaturn = buildKashfReadingByQuestionId(AUTHORITY_P256_SATURN_BOARD, 'q-fame', { question: 'מצב הכבוד והמעמד' });
assert(authoritySaturn.primaryFormula?.result?.executorResult?.h10Pattern === '1112', 'p256 negative fixture has H10=1112');
assert(authoritySaturn.primaryFormula?.result?.executorResult?.planetHebrew === 'שבתאי', 'p256 resolves H10=1112 to Saturn');
assert(authoritySaturn.primaryFormula?.result?.executorResult?.condition === 'no-benefit-gloom-distress', 'p256 Saturn branch preserves the source-specific adverse condition');
assert(authoritySaturn.overallPositive === false, 'p256 Saturn branch is negative');

const AUTHORITY_P256_UNRESOLVED_BOARD = buildRamlBoardFromMothers(['1111', '1111', '1111', '1111']);
const authorityMercury = buildKashfReadingByQuestionId(AUTHORITY_P256_UNRESOLVED_BOARD, 'q-fame', { question: 'מצב הכבוד והמעמד' });
assert(authorityMercury.primaryFormula?.result?.executorResult?.h10Pattern === '2222', 'p256 unresolved fixture has H10=2222');
assert(authorityMercury.primaryFormula?.result?.executorResult?.planetHebrew === 'כוכב', 'p256 unresolved fixture maps H10=2222 to Mercury');
assert(authorityMercury.primaryFormula?.result?.executorResult?.condition === 'unresolved-by-source', 'p256 leaves Mercury unresolved because p256 excerpt gives no explicit judgment');
assert(authorityMercury.overallPositive === null, 'p256 unresolved branch does not invent a binary fame verdict');

assertRoute('q-position-keep', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'authority.appointmentStays',
  kashfMethodId: 'authority.p257.appointmentH1H10Planet',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assert(canRunKashfMethod('authority.p257.appointmentH1H10Planet'), 'p257 appointment method is runnable only through its exact canonical executor');

const AUTHORITY_P257_POSITIVE_BOARD = buildRamlBoardFromMothers(['1111', '1111', '1111', '1111']);
const authorityAppointmentYes = buildKashfReadingByQuestionId(AUTHORITY_P257_POSITIVE_BOARD, 'q-position-keep', { question: 'האם המינוי יתקיים' });
assert(authorityAppointmentYes.valid === true && authorityAppointmentYes.canRunKashf === true, 'p257 positive board executes canonically');
assert(authorityAppointmentYes.kashfMethodId === 'authority.p257.appointmentH1H10Planet', 'p257 executes only the exact appointment method');
assert(JSON.stringify(authorityAppointmentYes.primaryFormula?.houses) === JSON.stringify([1, 10]), 'p257 traces H1+H10');
assert(authorityAppointmentYes.primaryFormula?.result?.executorResult?.h1Pattern === '1111', 'p257 positive fixture carries H1=1111');
assert(authorityAppointmentYes.primaryFormula?.result?.executorResult?.h10Pattern === '2222', 'p257 positive fixture carries H10=2222');
assert(authorityAppointmentYes.primaryFormula?.result?.executorResult?.resultPattern === '1111', 'p257 combines H1+H10 into 1111');
assert(authorityAppointmentYes.primaryFormula?.result?.executorResult?.planetHebrew === 'ירח', 'p257 resolves combined 1111 to Moon');
assert(authorityAppointmentYes.primaryFormula?.result?.executorResult?.sourceClass === 'luminary', 'p257 identifies Moon as one of the two luminaries');
assert(authorityAppointmentYes.primaryFormula?.result?.executorResult?.appointmentCompletes === true, 'p257 luminary result completes the appointment');
assert(authorityAppointmentYes.overallPositive === true, 'p257 positive branch is positive');
assert(authorityAppointmentYes.altFormula === null, 'p257 does not aggregate another authority formula');
assert(authorityAppointmentYes.canonicalExecution?.topicBundleExecuted === false, 'p257 does not execute broad authorityState bundle');
assert(authorityAppointmentYes.dhamir === null, 'p257 does not auto-run Dhamir');
const authorityAppointmentHtml = writeCanonicalKashfReading(authorityAppointmentYes);
assert(authorityAppointmentHtml.includes('authority.p257.appointmentH1H10Planet'), 'p257 narrative exposes exact canonical method id');
assert(authorityAppointmentHtml.includes('משני המאורות'), 'p257 narrative preserves the luminary rule');

const AUTHORITY_P257_NEGATIVE_BOARD = buildRamlBoardFromMothers(['1111', '1111', '1111', '1112']);
const authorityAppointmentNo = buildKashfReadingByQuestionId(AUTHORITY_P257_NEGATIVE_BOARD, 'q-position-keep', { question: 'האם המינוי יתקיים' });
assert(authorityAppointmentNo.primaryFormula?.result?.executorResult?.resultPattern === '1112', 'p257 negative fixture combines to 1112');
assert(authorityAppointmentNo.primaryFormula?.result?.executorResult?.planetHebrew === 'שבתאי', 'p257 negative fixture resolves to Saturn');
assert(authorityAppointmentNo.primaryFormula?.result?.executorResult?.appointmentCompletes === false, 'p257 non-luminary/non-benefic planet means the appointment does not complete');
assert(authorityAppointmentNo.overallPositive === false, 'p257 negative branch is negative');

`;
  tests = tests.replace(anchor, block + anchor);
}

fs.writeFileSync(executorsPath, executors);
fs.writeFileSync(registryPath, registry);
fs.writeFileSync(testsPath, tests);

for (const cmd of [
  ['node', ['_test_kashf_canonical_routing.mjs']],
  ['node', ['_audit_kashf_question_route_coverage.mjs']],
]) {
  const result = spawnSync(cmd[0], cmd[1], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log('Authority p256/p257 canonical planet executors cutover passed.');
