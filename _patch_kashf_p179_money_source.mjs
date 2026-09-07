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

// 1) Enable the source-ready p179 money-source method.
{
  const path = 'goral-hachol/registry/kashf-canonical-method-registry.js';
  let s = read(path);
  s = updateMethodBlock(s, 'money.p179.sourceByIncomingHonorHouse', (block) => {
    block = replaceOnce(block, "    runtimeAllowed: false,", "    runtimeAllowed: true,", 'p179 runtimeAllowed');
    block = replaceOnce(block, "    executorStatus: 'pending',", "    executorStatus: 'ready',", 'p179 executorStatus');
    block = block.replace(
      /    notes: '[^\n]*',/,
      "    notes: 'Canonical p179 money-source executor is wired. If H2 is pure benefic, locate Incoming Honor (2211) in the twelve topical houses and report the source by the nature/title of the house or houses where it appears. Multiple occurrences remain multiple source channels; none are ranked. If Money Incoming (2121) itself is in H2, its topical recurrences are exposed separately as acquisition-judgment testimony and are not silently merged into the Incoming-Honor source rule. Mixed/non-benefic H2 does not activate this source clause. The distinct p179 malefic-H2 exceptions and p181 alternate/modulo method are not imported.',"
    );
    return block;
  });
  write(path, s);
}

// 2) Exact method-scoped executor.
{
  const path = 'goral-hachol/engine/kashf-canonical-executors.js';
  let s = read(path);
  const anchor = '// Kashf v57 p167 — hidden/covert action behind the matter.';
  const fn = `const P179_MONEY_SOURCE_HOUSE_LABELS = Object.freeze({
  1: 'בית הנפש / השואל',
  2: 'בית הממון',
  3: 'בית האחים והקרובים',
  4: 'בית האב, הבית והקרקע',
  5: 'בית הילדים והשמחה',
  6: 'בית המחלות והמשרתים',
  7: 'בית הזוגיות והצד שמול השואל',
  8: 'בית המוות והירושה',
  9: 'בית המסע והדת',
  10: 'בית הכבוד, השלטון והמלאכה',
  11: 'בית התקווה, החברים והסיוע',
  12: 'בית האויבים, המאסר והעיכוב',
});

// Kashf v57 p179 — source of money by the house occupied by Incoming Honor.
// The source first requires H2 to be benefic. We therefore do NOT promote a
// mixed H2 into the gate. Incoming Honor is searched only in the twelve topical
// houses because the rule asks for the nature of the house; witness/judge
// positions are traced separately but not interpreted as financial channels.
function computeMoneySourceP179(chart) {
  if (!Array.isArray(chart)) return null;
  const h2 = findCanonicalHouse(chart, 2);
  const h2Pattern = h2?.key || h2?.pattern || null;
  if (!h2Pattern) return null;

  const h2Classification = classifyCanonicalFigure(h2Pattern);
  const beneficGateMet = h2Classification.saadNahs === 'saad';
  const allPositions = Array.from({ length: 16 }, (_, i) => i + 1);
  const topicalHouses = Array.from({ length: 12 }, (_, i) => i + 1);

  const incomingHonorOccurrences = allPositions.filter((houseNumber) => {
    const entry = findCanonicalHouse(chart, houseNumber);
    return (entry?.key || entry?.pattern || null) === '2211';
  });
  const incomingHonorTopicalHouses = incomingHonorOccurrences.filter((houseNumber) => houseNumber <= 12);
  const incomingHonorNonTopicalPositions = incomingHonorOccurrences.filter((houseNumber) => houseNumber > 12);

  const sourceCandidates = beneficGateMet
    ? incomingHonorTopicalHouses.map((houseNumber) => ({
        houseNumber,
        houseNatureHebrew: P179_MONEY_SOURCE_HOUSE_LABELS[houseNumber] || ('בית ' + houseNumber),
      }))
    : [];

  const moneyIncomingInH2 = h2Pattern === '2121';
  const moneyIncomingJudgmentHouses = moneyIncomingInH2
    ? topicalHouses.filter((houseNumber) => {
        const entry = findCanonicalHouse(chart, houseNumber);
        return (entry?.key || entry?.pattern || null) === '2121';
      })
    : [];

  const sourceResolved = beneficGateMet && sourceCandidates.length > 0;
  let outputHebrew;
  if (!beneficGateMet) {
    outputHebrew = 'בית 2 אינו מסווג כאן כצורה מיטיבה טהורה. לכן כלל מקור הממון של כשף v57 עמ׳ 179 — חיפוש כבוד נכנס — אינו מופעל. אין להסיק מכך לבדו שאין כסף, ואין להפעיל כאן את ענפי העמוד האחרים שלא שייכים לשיטה הזאת.';
  } else if (!sourceCandidates.length) {
    outputHebrew = 'בית 2 מיטיב, אך כבוד נכנס (2211) אינו נמצא באחד משנים־עשר בתי הנושא. לכן כלל עמ׳ 179 אינו נותן כאן מקור ביתי מוגדר לממון.';
  } else {
    const channels = sourceCandidates.map((item) => 'בית ' + item.houseNumber + ' — ' + item.houseNatureHebrew).join('; ');
    outputHebrew = 'בית 2 מיטיב. כבוד נכנס (2211) נמצא ב' + channels + '. לפי כשף v57 עמ׳ 179, הממון מתקבל מטבע הבית או הבתים שבהם כבוד נכנס שורה. אם יש יותר מהופעה אחת, המקור נותן יותר מערוץ אחד ואינו מדרג ביניהם.';
  }

  if (moneyIncomingInH2) {
    const recurrenceText = moneyIncomingJudgmentHouses.length
      ? moneyIncomingJudgmentHouses.map((n) => 'בית ' + n).join(', ')
      : 'ללא חזרה נוספת';
    outputHebrew += ' בנוסף, ממון נכנס (2121) עצמו נמצא בבית 2; הופעותיו ב' + recurrenceText + ' נותנות לפי אותו עמוד עדות נפרדת על השגת הממון. עדות זו אינה מוחלפת או מוזגת עם כלל מקור הממון של כבוד נכנס.';
  }

  return {
    sourceRef: 'כשף אל-אסרר v57 עמ׳ 179',
    sourceText: 'אם בשני יש בה צד מיטיב, בקש את כבוד נכנס; במקום שבו הוא נמצא, הממון יגיע מטבע אותו בית שבו הוא שורה. ואם עלתה צורת ממון נכנס בבית הממון, כל בית שבו נמצאת הצורה הזאת ייתן דין על השגת הממון.',
    housesUsed: topicalHouses,
    positionsScanned: allPositions,
    h2Pattern,
    h2Classification,
    beneficGateMet,
    incomingHonorPattern: '2211',
    incomingHonorOccurrences,
    incomingHonorTopicalHouses,
    incomingHonorNonTopicalPositions,
    sourceCandidates,
    sourceHouseNumbers: sourceCandidates.map((item) => item.houseNumber),
    sourceResolved,
    multipleSourceChannels: sourceCandidates.length > 1,
    moneyIncomingPattern: '2121',
    moneyIncomingInH2,
    moneyIncomingJudgmentHouses,
    positive: null,
    verdictType: 'money-source',
    outputHebrew,
  };
}

`;
  s = replaceOnce(s, anchor, fn + anchor, 'p179 executor insertion');
  s = replaceOnce(
    s,
    "const CUSTOM_EXECUTORS = Object.freeze({\n  'spiritual.p167.hiddenActionAirRows46815': computeHiddenActionP167,",
    "const CUSTOM_EXECUTORS = Object.freeze({\n  'money.p179.sourceByIncomingHonorHouse': computeMoneySourceP179,\n  'spiritual.p167.hiddenActionAirRows46815': computeHiddenActionP167,",
    'p179 custom executor allowlist'
  );
  write(path, s);
}

// 3) Tighten the Question Bank wording to what p179 actually proves.
{
  const path = 'goral-hachol/ui/question-bank.js';
  let s = read(path);
  s = replaceOnce(
    s,
    "    desc: 'כשצפוי כסף אך לא ידוע המקור — ממי, מאיפה, מאיזה ערוץ',",
    "    desc: 'דין עמ׳ 179: כאשר בית הממון מיטיב, מאתרים את כבוד נכנס ומפרשים את מקור הכסף לפי טבע הבית שבו הוא נמצא',",
    'q-money-source source-safe description'
  );
  write(path, s);
}

// 4) Retrieval aliases and method-isolation boundaries.
{
  const path = 'goral-hachol/registry/kashf-ai-retrieval-index.js';
  let s = read(path);
  const anchor = "  'spiritual.p167.hiddenActionAirRows46815': {";
  const block = `  'money.p179.sourceByIncomingHonorHouse': {
    aliases: ['מאיפה יגיע הכסף', 'מה מקור הכסף', 'מאיזה מקום יבוא הכסף', 'מאיזה ערוץ יגיע הממון', 'מקור הממון'],
    doNotMixWith: ['money.p180.livelihoodH10Invert', 'money.p181.recast25811', 'inheritance.p180.elementComposite'],
    houses: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
`;
  s = replaceOnce(s, anchor, block + anchor, 'p179 retrieval override');
  write(path, s);
}

// 5) Canonical regression tests.
{
  const path = '_test_kashf_canonical_routing.mjs';
  let s = read(path);
  const summary = "console.log(`Kashf canonical routing tests: ${passed} passed, ${failed} failed`);";
  const tests = `// ── P179 money-source executor ------------------------------------------
const p179MoneySourceMethod = getKashfMethod('money.p179.sourceByIncomingHonorHouse');
assert(p179MoneySourceMethod?.runtimeAllowed === true && p179MoneySourceMethod?.executorStatus === 'ready', 'p179 money-source method is runnable');
assert(canRunKashfMethod('money.p179.sourceByIncomingHonorHouse') === true, 'p179 money-source canRunKashfMethod is true');
const p179Route = resolveKashfRouteByQuestionId('q-money-source');
assert(p179Route?.canRunKashf === true && p179Route?.kashfMethodId === 'money.p179.sourceByIncomingHonorHouse', 'q-money-source routes to the exact runnable p179 method');

const p179H10 = buildKashfReadingByQuestionId(makeP204Board({ 2: '1222', 10: '2211' }), 'q-money-source', { question: 'מאיפה יגיע הכסף?' });
assert(p179H10.valid === true && p179H10.canRunKashf === true, 'p179 H10 fixture executes canonically');
assert(p179H10.primaryFormula?.result?.executorResult?.beneficGateMet === true, 'p179 pure benefic H2 opens the source gate');
assert(JSON.stringify(p179H10.primaryFormula?.result?.executorResult?.sourceHouseNumbers) === JSON.stringify([10]), 'p179 Incoming Honor in H10 gives H10 as the source house');
assert(p179H10.primaryFormula?.result?.executorResult?.sourceCandidates?.[0]?.houseNatureHebrew?.includes('שלטון'), 'p179 H10 source label preserves authority/work nature');
assert(p179H10.primaryFormula?.result?.executorResult?.sourceResolved === true, 'p179 H10 source is resolved');
assert(p179H10.overallPositive === null, 'p179 source method remains descriptive rather than forced yes/no');
assert(p179H10.primaryFormula?.sourceText === getKashfV57Knowledge('money.p179.sourceByIncomingHonorHouse')?.v57?.hebrewRule, 'p179 runtime sourceText comes from Hebrew v57');
assert(p179H10.canonicalExecution?.methodsExecuted?.length === 1 && p179H10.canonicalExecution.methodsExecuted[0] === 'money.p179.sourceByIncomingHonorHouse', 'p179 executes only its exact canonical method');
assert(p179H10.dhamir === null && p179H10.canonicalExecution?.topicBundleExecuted === false && p179H10.canonicalExecution?.altFormulaExecuted === false, 'p179 runs no Dhamir/topic bundle/alternative');

const p179Multiple = buildKashfReadingByQuestionId(makeP204Board({ 2: '1222', 3: '2211', 10: '2211' }), 'q-money-source');
assert(JSON.stringify(p179Multiple.primaryFormula?.result?.executorResult?.sourceHouseNumbers) === JSON.stringify([3, 10]), 'p179 preserves multiple Incoming Honor source houses');
assert(p179Multiple.primaryFormula?.result?.executorResult?.multipleSourceChannels === true, 'p179 multiple source channels are explicit and unranked');

const p179MixedGate = buildKashfReadingByQuestionId(makeP204Board({ 2: '2222', 10: '2211' }), 'q-money-source');
assert(p179MixedGate.primaryFormula?.result?.executorResult?.h2Classification?.saadNahs === 'mixed', 'p179 mixed H2 remains mixed');
assert(p179MixedGate.primaryFormula?.result?.executorResult?.beneficGateMet === false, 'p179 mixed H2 does not get promoted to benefic gate');
assert(p179MixedGate.primaryFormula?.result?.executorResult?.sourceResolved === false, 'p179 mixed gate leaves source unresolved even if Incoming Honor appears');

const p179MoneyIncoming = buildKashfReadingByQuestionId(makeP204Board({ 2: '2121', 9: '2121', 10: '2211' }), 'q-money-source');
assert(p179MoneyIncoming.primaryFormula?.result?.executorResult?.moneyIncomingInH2 === true, 'p179 detects Money Incoming in H2');
assert(JSON.stringify(p179MoneyIncoming.primaryFormula?.result?.executorResult?.moneyIncomingJudgmentHouses) === JSON.stringify([2, 9]), 'p179 traces Money Incoming recurrences separately');
assert(JSON.stringify(p179MoneyIncoming.primaryFormula?.result?.executorResult?.sourceHouseNumbers) === JSON.stringify([10]), 'p179 Money Incoming recurrence does not replace Incoming Honor source house');

const p179WitnessOnly = buildKashfReadingByQuestionId(makeP204Board({ 2: '1222', 13: '2211' }), 'q-money-source');
assert(JSON.stringify(p179WitnessOnly.primaryFormula?.result?.executorResult?.incomingHonorNonTopicalPositions) === JSON.stringify([13]), 'p179 traces Incoming Honor in witness positions');
assert(p179WitnessOnly.primaryFormula?.result?.executorResult?.sourceResolved === false, 'p179 does not invent a financial channel from non-topical witness/judge positions');

`;
  s = replaceOnce(s, summary, tests + summary, 'p179 canonical tests');
  write(path, s);
}

// 6) AI retrieval contract.
{
  const path = '_test_kashf_ai_retrieval_index.mjs';
  let s = read(path);
  s = replaceOnce(
    s,
    "expectTop('האם יש פעולה מאחורי הדבר', 'spiritual.p167.hiddenActionAirRows46815');",
    "expectTop('האם יש פעולה מאחורי הדבר', 'spiritual.p167.hiddenActionAirRows46815');\nexpectTop('מאיפה יגיע הכסף', 'money.p179.sourceByIncomingHonorHouse');",
    'p179 retrieval top-hit test'
  );
  const anchor = "const sourceReadyPendingResults = searchKashfAiRetrievalIndex('בריאות הוולד', { sourceReadyOnly: true, limit: 20 });";
  const assertions = `const moneySourceRecord = getKashfAiRetrievalRecord('money.p179.sourceByIncomingHonorHouse');
assert(moneySourceRecord?.questionIds.includes('q-money-source'), 'p179 retrieval links q-money-source');
assert(moneySourceRecord?.runtimeAllowed === true && moneySourceRecord?.executorStatus === 'ready', 'p179 retrieval exposes runnable state');
assert(moneySourceRecord?.doNotMixWith.includes('money.p180.livelihoodH10Invert'), 'p179 retrieval separates source from livelihood');
assert(JSON.stringify(moneySourceRecord?.houses) === JSON.stringify([1,2,3,4,5,6,7,8,9,10,11,12]), 'p179 retrieval exposes the twelve topical houses scanned by the source rule');

`;
  s = replaceOnce(s, anchor, assertions + anchor, 'p179 retrieval record tests');
  write(path, s);
}

// 7) Live AI bridge regression: free text and explicit route both land on p179.
{
  const path = '_test_kashf_ai_retrieval_live_bridge.mjs';
  let s = read(path);
  const summary = "console.log(`Kashf AI retrieval live bridge tests: ${passed} passed, ${failed} failed`);";
  const tests = `// 9. Money-source wording resolves the exact p179 method and stays canonical.
const moneySourceFreeText = buildKashfCanonicalAiBridge({
  questionText: 'מאיפה יגיע הכסף',
  board: BOARD,
});
assert(moneySourceFreeText.resolution.kashfMethodId === 'money.p179.sourceByIncomingHonorHouse', 'money-source free text resolves exact p179 method');
assert(moneySourceFreeText.resolution.resolutionSource === 'retrieval-index', 'money-source free text resolves through AI retrieval index');
const moneySourceLocked = buildKashfCanonicalAiBridge({
  questionId: 'q-money-source',
  questionText: 'מה מצב המחיה?',
  board: BOARD,
});
assert(moneySourceLocked.resolution.kashfMethodId === 'money.p179.sourceByIncomingHonorHouse', 'explicit q-money-source remains authoritative over competing wording');
assert(moneySourceLocked.resolution.resolutionSource === 'question-route', 'q-money-source uses authoritative question route');
assert(moneySourceLocked.canonicalRetrieval?.knowledgeLanguage === 'he', 'p179 bridge exposes Hebrew operational knowledge');

`;
  s = replaceOnce(s, summary, tests + summary, 'p179 live bridge tests');
  write(path, s);
}

console.log('Applied Kashf p179 money-source executor patch.');
