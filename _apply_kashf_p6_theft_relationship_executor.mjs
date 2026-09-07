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

// Kashf pp224-225: the H7 figure is followed where it recurs elsewhere in the
// board. The house of recurrence indicates the cause/connection. p225 gives a
// second, kinship-root layer for a subset of houses. Keep the two source layers
// separate rather than collapsing them into one invented identity.
const theftRelationshipExecutor = `
const P224_H7_RECURRENCE_CONNECTIONS = Object.freeze({
  1: 'אדם העומד במקום בעל הדבר',
  2: 'אחד מעוזריו של בעל הדבר',
  3: 'הגנב עצמו',
  4: 'מי שנכנס לביתו של בעל הדבר',
  5: 'מי שמתערב עם ילדיו של בעל הדבר',
  6: 'המקור מוסר שבעל הדבר יחלה בגלל הגניבה; אין כאן זיהוי קשר אישי',
  9: 'הקשר בא מחמת נסיעה',
  10: 'אדם הקשור לבעלי השלטון',
  11: 'אדם הקשור לאנשים שהגנב מתחבר עמם',
});

const P225_KINSHIP_ROOTS = Object.freeze({
  1: 'סב מצד האם',
  4: 'אב',
  5: 'בן',
  6: 'דוד',
  8: 'אחים',
  10: 'אם ובני הדוד',
  11: 'חברים',
  12: 'בני הדוד מצד האם',
});

function computeThiefRelationshipP224(chart) {
  if (!Array.isArray(chart)) return null;
  const normalized = chart.map((entry, index) => ({
    ...entry,
    houseNumber: Number(entry?.house ?? entry?.houseNumber ?? (index + 1)),
    pattern: entry?.key || entry?.pattern || null,
  }));
  const h7 = normalized.find((entry) => entry.houseNumber === 7) || normalized[6] || null;
  const h7Pattern = h7?.pattern || null;
  if (!h7Pattern) return null;

  // The original H7 occurrence is the reference point, not a recurrence.
  const recurrenceHouses = normalized
    .filter((entry) => entry.houseNumber !== 7 && entry.pattern === h7Pattern)
    .map((entry) => entry.houseNumber)
    .filter((house) => Number.isInteger(house) && house >= 1 && house <= 16)
    .sort((a, b) => a - b);

  const indications = recurrenceHouses.map((house) => ({
    house,
    p224Connection: P224_H7_RECURRENCE_CONNECTIONS[house] || null,
    p225KinshipRoot: P225_KINSHIP_ROOTS[house] || null,
  }));
  const sourceSupported = indications.filter((item) => item.p224Connection || item.p225KinshipRoot);

  let outputHebrew;
  if (recurrenceHouses.length === 0) {
    outputHebrew = \`צורת בית 7 (\${h7Pattern}) אינה חוזרת בבית אחר בלוח. לפי כלל עמ׳ 224 אין כאן בית חזרה שממנו ניתן לקבוע את הקשר; הכלל גם אינו מודד מרחק מספרי.\`;
  } else if (sourceSupported.length === 0) {
    outputHebrew = \`צורת בית 7 (\${h7Pattern}) חוזרת בבית/בתים \${recurrenceHouses.join(', ')}, אך במקטע המקור עמ׳ 224–225 לא נמסרה הוראת קשר מפורשת לבתים אלה. אין להשלים קשר מן הדעת.\`;
  } else {
    const parts = sourceSupported.map((item) => {
      const layers = [];
      if (item.p224Connection) layers.push(\`עמ׳ 224: \${item.p224Connection}\`);
      if (item.p225KinshipRoot) layers.push(\`עמ׳ 225 — שורש קרבה: \${item.p225KinshipRoot}\`);
      return \`בית \${item.house} — \${layers.join('; ')}\`;
    });
    outputHebrew = \`צורת בית 7 (\${h7Pattern}) חוזרת בבית/בתים \${recurrenceHouses.join(', ')}. \${parts.join(' | ')}. זהו תיאור קשר לפי הבית שבו הצורה חוזרת, לא זיהוי של אדם מסוים ולא מדידת מרחק.\`;
  }

  return {
    sourceRef: 'כשף אל-אסרר עמ׳ 224–225',
    sourceText: 'הבית השביעי, אם צורתו חוזרת בבית מן הבתים, מורה על סיבת הגניבה ועל מי שקשור בה; הדין לפי הבית שבו חזרה הצורה.',
    h7Pattern,
    h7FigureHebrew: h7?.hebrew || h7?.hebrewName || h7Pattern,
    recurrenceHouses,
    housesUsed: [7, ...recurrenceHouses],
    indications,
    sourceSupportedIndications: sourceSupported,
    relationResolved: sourceSupported.length > 0,
    positive: null,
    outputHebrew,
  };
}
`;

if (!executors.includes('function computeThiefRelationshipP224')) {
  const customAnchor = `const CUSTOM_EXECUTORS = Object.freeze({\n  'theft.p225.thiefDescriptionH7': computeThiefPhysicalDescriptionKashf,\n  'pregnancy.p191.existsH5SilentEmpty': computePregnancyExistenceP191,\n  'pregnancy.p191.genderH5': computePregnancyGenderP191,\n});`;
  if (!executors.includes(customAnchor)) throw new Error('Could not find P5 custom executor allowlist anchor');
  const replacement = theftRelationshipExecutor + `\nconst CUSTOM_EXECUTORS = Object.freeze({\n  'theft.p225.thiefDescriptionH7': computeThiefPhysicalDescriptionKashf,\n  'pregnancy.p191.existsH5SilentEmpty': computePregnancyExistenceP191,\n  'pregnancy.p191.genderH5': computePregnancyGenderP191,\n  'theft.p224.relationshipH7Recurrence': computeThiefRelationshipP224,\n});`;
  executors = executors.replace(customAnchor, replacement);
} else if (!executors.includes("'theft.p224.relationshipH7Recurrence': computeThiefRelationshipP224")) {
  executors = executors.replace(
    "  'pregnancy.p191.genderH5': computePregnancyGenderP191,\n",
    "  'pregnancy.p191.genderH5': computePregnancyGenderP191,\n  'theft.p224.relationshipH7Recurrence': computeThiefRelationshipP224,\n"
  );
}

// Enable only the source-safe relationship/proximity route; it remains explicitly
// distinct from identifying a named thief or measuring numeric distance.
const relationRegex = /(  'theft\.p224\.relationshipH7Recurrence': method\(\{[\s\S]*?kashfRuntimeStatus: 'ready',\n)    runtimeAllowed: false,([\s\S]*?executionKind: 'custom-engine',\n)    executorStatus: 'pending',/;
if (relationRegex.test(registry)) {
  registry = registry.replace(relationRegex, "$1    runtimeAllowed: true,$2    executorStatus: 'ready',");
} else if (!/theft\.p224\.relationshipH7Recurrence[\s\S]*?runtimeAllowed: true,[\s\S]*?executorStatus: 'ready'/.test(registry)) {
  throw new Error('Could not enable theft.p224.relationshipH7Recurrence safely');
}

// Let method-scoped executors report dynamic house traceability when their exact
// source method follows recurrence/movement to additional houses.
const oldHouses = `    const houses = method.kashfMethodId === 'profession.p254.h9Planet'\n      ? [9, 10, 11]\n      : method.kashfMethodId === 'illness.bodyPart.h6Figure'\n        ? [6]\n        : method.kashfMethodId === 'theft.p225.thiefDescriptionH7'\n          ? [7]\n          : method.kashfMethodId === 'pregnancy.p191.existsH5SilentEmpty'\n            ? [5]\n            : method.kashfMethodId === 'pregnancy.p191.genderH5'\n              ? [5]\n              : [];`;
const newHouses = `    const houses = Array.isArray(executorResult.housesUsed)\n      ? [...executorResult.housesUsed]\n      : method.kashfMethodId === 'profession.p254.h9Planet'\n        ? [9, 10, 11]\n        : method.kashfMethodId === 'illness.bodyPart.h6Figure'\n          ? [6]\n          : method.kashfMethodId === 'theft.p225.thiefDescriptionH7'\n            ? [7]\n            : method.kashfMethodId === 'pregnancy.p191.existsH5SilentEmpty'\n              ? [5]\n              : method.kashfMethodId === 'pregnancy.p191.genderH5'\n                ? [5]\n                : [];`;
if (readingEngine.includes(oldHouses)) {
  readingEngine = readingEngine.replace(oldHouses, newHouses);
} else if (!readingEngine.includes('Array.isArray(executorResult.housesUsed)')) {
  throw new Error('Could not add dynamic method house traceability');
}

if (!tests.includes('// ── P6 theft-relationship H7 recurrence executor')) {
  const anchor = '// ── Canonical execution isolation ----------------------------------------';
  if (!tests.includes(anchor)) throw new Error('Could not find canonical isolation test anchor');

  const block = [
    '// ── P6 theft-relationship H7 recurrence executor ---------------------',
    "const thiefRelationshipRoute = assertRoute('q-thief-near', {",
    '  ok: true,',
    '  canRunKashf: true,',
    "  kashfIntentId: 'theft.thiefRelationship',",
    "  kashfMethodId: 'theft.p224.relationshipH7Recurrence',",
    "  kashfRuntimeStatus: 'ready',",
    "  executorStatus: 'ready',",
    '  runtimeAllowed: true,',
    '});',
    "assert(canRunKashfMethod(thiefRelationshipRoute.kashfMethodId) === true, 'theft-relationship canonical method is explicitly runnable');",
    '',
    '// No-recurrence guard: the normal pilot board has H7=1221 only at H7.',
    "const thiefRelationshipNoRecurrence = buildKashfReadingByQuestionId(PILOT_BOARD, 'q-thief-near', { question: 'מה הקשר של הגנב לבעל הדבר?' });",
    "assert(thiefRelationshipNoRecurrence.valid === true, 'q-thief-near executes through canonical custom allowlist');",
    "assert(thiefRelationshipNoRecurrence.canonicalExecution?.methodsExecuted?.length === 1, 'q-thief-near executes exactly one method');",
    "assert(thiefRelationshipNoRecurrence.canonicalExecution?.methodsExecuted?.[0] === 'theft.p224.relationshipH7Recurrence', 'q-thief-near executes the exact p224 recurrence method only');",
    "assert(thiefRelationshipNoRecurrence.primaryFormula?.result?.executorResult?.h7Pattern === '1221', 'pilot board H7 remains 1221');",
    "assert(thiefRelationshipNoRecurrence.primaryFormula?.result?.executorResult?.recurrenceHouses?.length === 0, 'pilot board has no H7 recurrence outside H7');",
    "assert(thiefRelationshipNoRecurrence.primaryFormula?.houses?.length === 1 && thiefRelationshipNoRecurrence.primaryFormula.houses[0] === 7, 'no-recurrence traceability records only reference H7');",
    "assert(thiefRelationshipNoRecurrence.primaryFormula?.result?.executorResult?.relationResolved === false, 'no recurrence does not invent a relationship');",
    "assert(String(thiefRelationshipNoRecurrence.verdict?.text || '').includes('אינה חוזרת בבית אחר'), 'no-recurrence result is explicit');",
    "assert(String(thiefRelationshipNoRecurrence.verdict?.text || '').includes('אינו מודד מרחק מספרי'), 'renamed route does not masquerade as a distance meter');",
    '',
    '// Exact recurrence guard: this board has H7=1112 recurring only in H2.',
    "const THIEF_H2_RECURRENCE_BOARD = buildRamlBoardFromMothers(['1111', '1112', '1111', '1121']);",
    "const thiefRelationshipH2 = buildKashfReadingByQuestionId(THIEF_H2_RECURRENCE_BOARD, 'q-thief-near', { question: 'מה הקשר של הגנב לבעל הדבר?' });",
    "assert(thiefRelationshipH2.primaryFormula?.result?.executorResult?.h7Pattern === '1112', 'recurrence guard board produces H7=1112');",
    "assert(JSON.stringify(thiefRelationshipH2.primaryFormula?.result?.executorResult?.recurrenceHouses) === JSON.stringify([2]), 'H7=1112 recurs only in H2');",
    "assert(JSON.stringify(thiefRelationshipH2.primaryFormula?.houses) === JSON.stringify([7, 2]), 'dynamic traceability records H7 reference plus H2 recurrence');",
    "assert(thiefRelationshipH2.primaryFormula?.result?.executorResult?.sourceSupportedIndications?.[0]?.p224Connection === 'אחד מעוזריו של בעל הדבר', 'H2 recurrence resolves to the exact p224 helper connection');",
    "assert(String(thiefRelationshipH2.verdict?.text || '').includes('אחד מעוזריו של בעל הדבר'), 'H2 recurrence renders the source connection');",
    "assert(thiefRelationshipH2.verdict?.positive === null && thiefRelationshipH2.overallPositive === null, 'relationship lookup does not invent positive/negative sentiment');",
    '',
    '// Dual-layer source guard: H4 recurrence preserves p224 and p225 as separate evidence.',
    "const THIEF_H4_RECURRENCE_BOARD = buildRamlBoardFromMothers(['1111', '1111', '1121', '1122']);",
    "const thiefRelationshipH4 = buildKashfReadingByQuestionId(THIEF_H4_RECURRENCE_BOARD, 'q-thief-near', { question: 'מה הקשר של הגנב לבעל הדבר?' });",
    "assert(JSON.stringify(thiefRelationshipH4.primaryFormula?.result?.executorResult?.recurrenceHouses) === JSON.stringify([4]), 'H4 guard board has one exact recurrence');",
    "assert(thiefRelationshipH4.primaryFormula?.result?.executorResult?.sourceSupportedIndications?.[0]?.p224Connection === 'מי שנכנס לביתו של בעל הדבר', 'p224 layer is preserved at H4');",
    "assert(thiefRelationshipH4.primaryFormula?.result?.executorResult?.sourceSupportedIndications?.[0]?.p225KinshipRoot === 'אב', 'p225 kinship layer is preserved separately at H4');",
    "assert(String(thiefRelationshipH4.verdict?.text || '').includes('עמ׳ 224') && String(thiefRelationshipH4.verdict?.text || '').includes('עמ׳ 225'), 'writer text does not silently merge the two source layers');",
    '',
    "assert(thiefRelationshipH2.canonicalExecution?.altFormulaExecuted === false, 'q-thief-near does not execute alt formula');",
    "assert(thiefRelationshipH2.canonicalExecution?.topicSupportingChecksExecuted === false, 'q-thief-near does not execute theft supporting checks');",
    "assert(thiefRelationshipH2.canonicalExecution?.topicBundleExecuted === false, 'q-thief-near does not execute theft topic bundle');",
    'const thiefRelationshipHtml = writeCanonicalKashfReading(thiefRelationshipH2);',
    "assert(thiefRelationshipHtml.includes('theft.p224.relationshipH7Recurrence'), 'theft-relationship writer identifies exact canonical method');",
    "assert(thiefRelationshipHtml.includes('אחד מעוזריו של בעל הדבר'), 'theft-relationship writer renders source connection');",
    "assert(thiefRelationshipHtml.includes('הבית השביעי'), 'theft-relationship writer exposes the source rule');",
    "assert(!thiefRelationshipHtml.includes('ניתוח תומך לפי ספר'), 'theft-relationship writer contains no broad theft support section');",
    "assert(!thiefRelationshipHtml.includes('מחשבת השואל (הדמיר)'), 'theft-relationship writer contains no automatic Dhamir');",
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

console.log('Theft-relationship p224 recurrence canonical executor cutover passed.');
