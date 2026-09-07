#!/usr/bin/env node
import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, text) { fs.writeFileSync(path, text); }
function replaceOnce(text, needle, replacement, label) {
  const i = text.indexOf(needle);
  if (i < 0) throw new Error('Missing patch anchor: ' + label);
  if (text.indexOf(needle, i + needle.length) >= 0) throw new Error('Non-unique patch anchor: ' + label);
  return text.slice(0, i) + replacement + text.slice(i + needle.length);
}
function updateMethodBlock(text, methodId, mutator) {
  const startNeedle = `  '${methodId}': method({`;
  const start = text.indexOf(startNeedle);
  if (start < 0) throw new Error('Missing method block: ' + methodId);
  const endMarker = '\n  }),';
  const endAt = text.indexOf(endMarker, start);
  if (endAt < 0) throw new Error('Missing method block end: ' + methodId);
  const end = endAt + endMarker.length;
  const block = text.slice(start, end);
  return text.slice(0, start) + mutator(block) + text.slice(end);
}

// 1) Enable the source-ready p174 general-state method.
{
  const path = 'goral-hachol/registry/kashf-canonical-method-registry.js';
  let s = read(path);
  s = updateMethodBlock(s, 'general.p174.h1h2h4h7h10h15', (block) => {
    block = replaceOnce(block, "    runtimeAllowed: false,", "    runtimeAllowed: true,", 'p174 runtimeAllowed');
    block = replaceOnce(block, "    executorStatus: 'pending',", "    executorStatus: 'ready',", 'p174 executorStatus');
    block = block.replace(
      /    notes: '[^\n]*',/,
      "    notes: 'Canonical p174 general-state executor is wired. It reads only H1,H2,H4,H7,H10,H15 separately according to their explicit v57 roles. It does not execute the broad legacy generalReading bundle, does not average or majority-vote the six houses, and does not collapse them into one yes/no verdict. Each house exposes its figure and canonical fortune class for a bounded general-state reading.',"
    );
    return block;
  });
  write(path, s);
}

// 2) Exact method-scoped executor: six source-named houses, no invented aggregate.
{
  const path = 'goral-hachol/engine/kashf-canonical-executors.js';
  let s = read(path);
  const anchor = 'const P179_MONEY_SOURCE_HOUSE_LABELS = Object.freeze({';
  const fn = `const P174_GENERAL_STATE_HOUSE_ROLES = Object.freeze({
  1: Object.freeze({ titleHebrew: 'בית הנפש', roleHebrew: 'מצב האדם והתחלת כל דבר' }),
  2: Object.freeze({ titleHebrew: 'בית הממון', roleHebrew: 'ממונו של השואל' }),
  4: Object.freeze({ titleHebrew: 'בית האחרית והמקום', roleHebrew: 'אחריתו ומקומו' }),
  7: Object.freeze({ titleHebrew: 'בית הכוונות והמבוקש', roleHebrew: 'כוונותיו ומבוקשיו' }),
  10: Object.freeze({ titleHebrew: 'בית הטוב והמעמד', roleHebrew: 'טובו ומעמדו' }),
  15: Object.freeze({ titleHebrew: 'בית אחרית העניין', roleHebrew: 'אחרית עניינו' }),
});

// Kashf v57 p174 — bounded general-state reading.
// The source tells the reader which houses to inspect. It does NOT give a
// majority rule or a single aggregate yes/no formula, so every house remains
// an independent source witness and the executor deliberately returns
// positive:null.
function computeGeneralStateP174(chart) {
  if (!Array.isArray(chart)) return null;
  const housesUsed = [1, 2, 4, 7, 10, 15];
  const houseResults = housesUsed.map((houseNumber) => {
    const entry = findCanonicalHouse(chart, houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    if (!pattern) return null;
    const classification = classifyCanonicalFigure(pattern);
    const role = P174_GENERAL_STATE_HOUSE_ROLES[houseNumber];
    return {
      houseNumber,
      titleHebrew: role?.titleHebrew || ('בית ' + houseNumber),
      roleHebrew: role?.roleHebrew || null,
      pattern,
      figureHebrew: classification.figureHebrew || entry?.hebrew || entry?.hebrewName || pattern,
      classification,
      fortuneClass: classification.saadNahs,
      fortuneClassHebrew: classification.saadNahsHebrew || 'ללא סיווג קנוני זמין',
    };
  });
  if (houseResults.some((item) => !item)) return null;

  const detail = houseResults.map((item) =>
    'בית ' + item.houseNumber + ' — ' + item.titleHebrew + ' (' + item.roleHebrew + '): ' +
    item.figureHebrew + ' (' + item.pattern + '), ' + item.fortuneClassHebrew
  ).join('; ');

  const outputHebrew = 'לפי חשיפת הסודות הנצורים v57 עמ׳ 174, הקריאה הכללית נעשית בשישה מוקדים נפרדים: ' +
    detail + '. המקור מורה להתבונן בכל אחד מן הבתים האלה לפי תפקידו; הוא אינו מוסר כאן נוסחת רוב, שקלול בין הבתים או פסק כן/לא יחיד, ולכן אין ליצור הכרעה מצטברת שלא נאמרה במקור.';

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 174',
    sourceText: 'בבית הראשון האדם: אם שאלך אדם על הבית הראשון שלו, על אחריתו, על ממונו, על מסעותיו או על כלל ענייניו, התבונן לאחר השלמת ההכאה בבית הראשון — בית הנפש, שהוא התחלת כל דבר. אחר כך התבונן בשני — בית הממון; ברביעי — בית אחריתו ומקומו; בשביעי — בית כוונותיו ומבוקשיו; בעשירי — בית טובו ומעמדו; ובחמישה־עשר — בית אחרית עניינו.',
    housesUsed,
    houseResults,
    aggregationRule: 'none-source-explicit',
    aggregateVerdict: null,
    verdictType: 'general-state-profile',
    positive: null,
    outputHebrew,
  };
}

`;
  s = replaceOnce(s, anchor, fn + anchor, 'p174 executor insertion');
  s = replaceOnce(
    s,
    "const CUSTOM_EXECUTORS = Object.freeze({\n  'money.p179.sourceByIncomingHonorHouse': computeMoneySourceP179,",
    "const CUSTOM_EXECUTORS = Object.freeze({\n  'general.p174.h1h2h4h7h10h15': computeGeneralStateP174,\n  'money.p179.sourceByIncomingHonorHouse': computeMoneySourceP179,",
    'p174 custom executor allowlist'
  );
  write(path, s);
}

// 3) Tighten the Question Bank wording to the exact p174 scope.
{
  const path = 'goral-hachol/ui/question-bank.js';
  let s = read(path);
  s = replaceOnce(
    s,
    "    desc: 'לניתוח כוללני של מצב האדם כרגע. בחר כאן כשאין שאלה ספציפית אחת',",
    "    desc: 'סקירה כללית לפי כשף עמ׳ 174 בלבד: בית 1 (הנפש), 2 (ממון), 4 (אחרית ומקום), 7 (כוונות ומבוקש), 10 (טוב ומעמד), 15 (אחרית העניין)',",
    'q-general-state source-safe description'
  );
  write(path, s);
}

// 4) Retrieval aliases and isolation boundaries.
{
  const path = 'goral-hachol/registry/kashf-ai-retrieval-index.js';
  let s = read(path);
  const anchor = "  'completion.p173.fireRows15910': {";
  const block = `  'general.p174.h1h2h4h7h10h15': {
    aliases: ['מה מצבי הכללי', 'מצב כללי', 'מה מצבו הכללי', 'סקירה כללית', 'כלל ענייניו של השואל', 'מה המצב הכללי שלי'],
    doNotMixWith: ['matter.p172.h17_h1011_thenCombine', 'completion.p173.fireRows15910', 'lifespan.p178.elementCountToHouse', 'lifespan.p264.stagesH11H9H7'],
    houses: [1, 2, 4, 7, 10, 15],
  },
`;
  s = replaceOnce(s, anchor, block + anchor, 'p174 retrieval override');
  write(path, s);
}

// 5) Canonical routing regression tests.
{
  const path = '_test_kashf_canonical_routing.mjs';
  let s = read(path);
  const summary = "console.log(`Kashf canonical routing tests: ${passed} passed, ${failed} failed`);";
  const tests = `// ── P174 bounded general-state executor ---------------------------------
const p174GeneralMethod = getKashfMethod('general.p174.h1h2h4h7h10h15');
assert(p174GeneralMethod?.runtimeAllowed === true && p174GeneralMethod?.executorStatus === 'ready', 'p174 general-state method is runnable');
assert(canRunKashfMethod('general.p174.h1h2h4h7h10h15') === true, 'p174 general-state canRunKashfMethod is true');
const p174GeneralRoute = resolveKashfRouteByQuestionId('q-general-state');
assert(p174GeneralRoute?.canRunKashf === true && p174GeneralRoute?.kashfMethodId === 'general.p174.h1h2h4h7h10h15', 'q-general-state routes to the exact runnable p174 method');

const p174GeneralReading = buildKashfReadingByQuestionId(
  makeP204Board({ 1: '1222', 2: '1222', 4: '1222', 7: '1222', 10: '1222', 15: '1222' }),
  'q-general-state',
  { question: 'מה מצבי הכללי?' }
);
assert(p174GeneralReading.valid === true && p174GeneralReading.canRunKashf === true, 'p174 general-state fixture executes canonically');
const p174GeneralExec = p174GeneralReading.primaryFormula?.result?.executorResult;
assert(JSON.stringify(p174GeneralExec?.housesUsed) === JSON.stringify([1,2,4,7,10,15]), 'p174 uses only the six source-named houses');
assert(p174GeneralExec?.houseResults?.length === 6, 'p174 returns one independent result for each source-named house');
assert(p174GeneralExec?.houseResults?.every((item) => item?.classification?.saadNahs === 'saad'), 'p174 fixture preserves canonical fortune class per house');
assert(p174GeneralExec?.aggregationRule === 'none-source-explicit' && p174GeneralExec?.aggregateVerdict === null, 'p174 invents no majority or aggregate verdict');
assert(p174GeneralExec?.positive === null && p174GeneralReading.overallPositive === null, 'p174 remains descriptive rather than forced yes/no');
assert(p174GeneralReading.primaryFormula?.sourceText === getKashfV57Knowledge('general.p174.h1h2h4h7h10h15')?.v57?.hebrewRule, 'p174 runtime sourceText comes from Hebrew v57');
assert(p174GeneralReading.canonicalExecution?.methodsExecuted?.length === 1 && p174GeneralReading.canonicalExecution.methodsExecuted[0] === 'general.p174.h1h2h4h7h10h15', 'p174 executes only its exact canonical method');
assert(p174GeneralReading.dhamir === null && p174GeneralReading.canonicalExecution?.topicBundleExecuted === false && p174GeneralReading.canonicalExecution?.altFormulaExecuted === false, 'p174 runs no Dhamir/topic bundle/alternative');

`;
  s = replaceOnce(s, summary, tests + summary, 'p174 canonical tests');
  write(path, s);
}

// 6) AI retrieval-index regression tests.
{
  const path = '_test_kashf_ai_retrieval_index.mjs';
  let s = read(path);
  s = replaceOnce(
    s,
    "expectTop('האם העניין יושלם', 'completion.p173.fireRows15910');",
    "expectTop('האם העניין יושלם', 'completion.p173.fireRows15910');\nexpectTop('מה מצבי הכללי', 'general.p174.h1h2h4h7h10h15');",
    'p174 retrieval top-hit test'
  );
  const anchor = "const sourceReadyPendingResults = searchKashfAiRetrievalIndex('בריאות הוולד', { sourceReadyOnly: true, limit: 20 });";
  const tests = `const generalStateRecord = getKashfAiRetrievalRecord('general.p174.h1h2h4h7h10h15');
assert(generalStateRecord?.questionIds.includes('q-general-state'), 'p174 retrieval links q-general-state');
assert(generalStateRecord?.runtimeAllowed === true && generalStateRecord?.executorStatus === 'ready', 'p174 retrieval exposes runnable state');
assert(JSON.stringify(generalStateRecord?.houses) === JSON.stringify([1,2,4,7,10,15]), 'p174 retrieval exposes only the six source-named houses');
assert(generalStateRecord?.doNotMixWith.includes('completion.p173.fireRows15910'), 'p174 retrieval stays separate from completion verdict');

`;
  s = replaceOnce(s, anchor, tests + anchor, 'p174 retrieval record tests');
  write(path, s);
}

// 7) Canonical AI live-bridge regression tests.
{
  const path = '_test_kashf_ai_retrieval_live_bridge.mjs';
  let s = read(path);
  const summary = "console.log(`Kashf AI retrieval live bridge tests: ${passed} passed, ${failed} failed`);";
  const tests = `// 10. General-state wording resolves the bounded p174 method and explicit route stays authoritative.
const generalStateFreeText = buildKashfCanonicalAiBridge({
  questionText: 'מה מצבי הכללי',
  board: BOARD,
});
assert(generalStateFreeText.resolution.kashfMethodId === 'general.p174.h1h2h4h7h10h15', 'general-state free text resolves exact p174 method');
assert(generalStateFreeText.resolution.resolutionSource === 'retrieval-index', 'general-state free text resolves through AI retrieval index');
const generalStateLocked = buildKashfCanonicalAiBridge({
  questionId: 'q-general-state',
  questionText: 'האם העניין יושלם?',
  board: BOARD,
});
assert(generalStateLocked.resolution.kashfMethodId === 'general.p174.h1h2h4h7h10h15', 'explicit q-general-state remains authoritative over competing wording');
assert(generalStateLocked.resolution.resolutionSource === 'question-route', 'q-general-state uses authoritative question route');
assert(generalStateLocked.canonicalRetrieval?.knowledgeLanguage === 'he', 'p174 bridge exposes Hebrew operational knowledge');

`;
  s = replaceOnce(s, summary, tests + summary, 'p174 live bridge tests');
  write(path, s);
}

console.log('Applied Kashf p174 bounded general-state executor patch.');
