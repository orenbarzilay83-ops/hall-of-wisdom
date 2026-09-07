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

// 1) Enable the exact source-ready p167 hidden-action method.
{
  const path = 'goral-hachol/registry/kashf-canonical-method-registry.js';
  let s = read(path);
  s = updateMethodBlock(s, 'spiritual.p167.hiddenActionAirRows46815', (block) => {
    block = replaceOnce(block, "    runtimeAllowed: false,", "    runtimeAllowed: true,", 'p167 runtimeAllowed');
    block = replaceOnce(block, "    executorStatus: 'pending',", "    executorStatus: 'ready',", 'p167 executorStatus');
    block = block.replace(
      /    notes: '[^\n]*',/,
      "    notes: 'Canonical p167 hidden-action executor is wired. Take ONLY the AIR row of H4, H6, H8 and H15 (the balance/judge) and assemble one four-row figure. Pure malefic => an action is behind the matter; every other source classification follows the explicit source complement “otherwise no”. This is covert/hidden action only and must never be promoted to sorcery, jinn, evil-eye or sorcerer identification.',"
    );
    return block;
  });
  write(path, s);
}

// 2) Add the exact method-scoped executor.
{
  const path = 'goral-hachol/engine/kashf-canonical-executors.js';
  let s = read(path);
  const anchor = 'const CUSTOM_EXECUTORS = Object.freeze({';
  const fn = `// Kashf v57 p167 — hidden/covert action behind the matter.
// Source construction: AIR row only from H4, H6, H8 and H15 (the balance/judge),
// assembled in that order into one four-row figure. This is intentionally NOT
// the neighboring fire-row sorcery rule and does not diagnose sorcery/jinn/evil eye.
function computeHiddenActionP167(chart) {
  if (!Array.isArray(chart)) return null;
  const housesUsed = [4, 6, 8, 15];
  const airRows = housesUsed.map((houseNumber) => {
    const entry = findCanonicalHouse(chart, houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    const value = typeof pattern === 'string' && pattern.length === 4 ? pattern[1] : null;
    return {
      houseNumber,
      pattern,
      figureHebrew: entry?.hebrew || entry?.hebrewName || pattern,
      airRowValue: value,
      airRowState: getCanonicalRowState(pattern, 1),
    };
  });
  if (airRows.some((row) => row.airRowValue !== '1' && row.airRowValue !== '2')) return null;

  const derivedPattern = airRows.map((row) => row.airRowValue).join('');
  const classification = classifyCanonicalFigure(derivedPattern);
  const derivedFigureHebrew = classification.figureHebrew || derivedPattern;
  const hiddenAction = classification.saadNahs === 'nahs';

  let outputHebrew;
  if (hiddenAction) {
    outputHebrew = 'שורות האוויר של בתים 4, 6, 8 ו־15 יצרו את הצורה ' + derivedFigureHebrew + ' (' + derivedPattern + ') — צורה מזיקה. לפי כשף v57 עמ׳ 167: יש פעולה מאחורי הדבר. כלל זה אינו קובע שמדובר בכישוף, ג׳ין או עין הרע ואינו מזהה אדם.';
  } else {
    outputHebrew = 'שורות האוויר של בתים 4, 6, 8 ו־15 יצרו את הצורה ' + derivedFigureHebrew + ' (' + derivedPattern + ') — ' + (classification.saadNahsHebrew || classification.saadNahs || 'ללא סיווג') + '. לפי לשון כשף v57 עמ׳ 167: אם התוצאה אינה מזיקה — אין פעולה מאחורי הדבר לפי כלל זה.';
  }

  return {
    sourceRef: 'כשף אל-אסרר v57 עמ׳ 167',
    sourceText: 'אם אמר לך השואל: האם מאחורי הדבר יש פעולה או לא? קח את אוויר הרביעי, אוויר השישי, אוויר השמיני ואוויר המאזן; העמד מהם צורה. אם יצאה צורה מזיקה, הרי הפעולה מאחוריו; ואם לא — לא.',
    housesUsed,
    rowUsed: 'air',
    rowIndex: 1,
    airRows,
    derivedPattern,
    derivedFigureHebrew,
    classification,
    hiddenAction,
    sourceConditionMet: hiddenAction,
    positive: hiddenAction,
    diagnosisScope: 'hidden-action-only',
    outputHebrew,
  };
}

`;
  s = replaceOnce(s, anchor, fn + anchor, 'p167 executor insertion');
  s = replaceOnce(
    s,
    "const CUSTOM_EXECUTORS = Object.freeze({\n  'love.p206.womanFavorH7H11ThenH5': computeWomanFavorP206,",
    "const CUSTOM_EXECUTORS = Object.freeze({\n  'spiritual.p167.hiddenActionAirRows46815': computeHiddenActionP167,\n  'love.p206.womanFavorH7H11ThenH5': computeWomanFavorP206,",
    'p167 custom executor allowlist'
  );
  write(path, s);
}

// 3) Tighten the Question Bank wording to the exact source scope.
{
  const path = 'goral-hachol/ui/question-bank.js';
  let s = read(path);
  s = replaceOnce(
    s,
    "    desc: 'האם מישהו פועל בנסתר נגד העניין — לא בדרך רוחנית, אלא בפעולה סמויה',",
    "    desc: 'בדיקת כלל עמ׳ 167: האם יש פעולה נסתרת מאחורי הדבר. אין בכך אבחון של כישוף, ג׳ין או עין הרע',",
    'q-hidden-action source-safe description'
  );
  write(path, s);
}

// 4) Give the AI retrieval layer explicit natural-language boundaries.
{
  const path = 'goral-hachol/registry/kashf-ai-retrieval-index.js';
  let s = read(path);
  const anchor = "  'clothing.p264-265.luck': {";
  const block = `  'spiritual.p167.hiddenActionAirRows46815': {
    aliases: ['האם יש פעולה מאחורי הדבר', 'פעולה נסתרת מאחורי הדבר', 'האם יש פעולה סמויה מאחורי העניין', 'פעולה נסתרת מאחורי העניין'],
    doNotMixWith: ['spiritual.affectedBySorcery.unsupported', 'spiritual.sorcererIdentity.unsupported', 'spiritual.jinnType.unsupported'],
    houses: [4, 6, 8, 15],
  },
`;
  s = replaceOnce(s, anchor, block + anchor, 'p167 retrieval override');
  write(path, s);
}

// 5) Canonical route + executor regression tests.
{
  const path = '_test_kashf_canonical_routing.mjs';
  let s = read(path);
  const oldRoute = `assertRoute('q-hidden-action', {
  ok: true,
  canRunKashf: false,
  kashfIntentId: 'spiritual.hiddenAction',
  kashfMethodId: 'spiritual.p167.hiddenActionAirRows46815',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'pending',
});`;
  const newRoute = `assertRoute('q-hidden-action', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'spiritual.hiddenAction',
  kashfMethodId: 'spiritual.p167.hiddenActionAirRows46815',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
});`;
  s = replaceOnce(s, oldRoute, newRoute, 'q-hidden-action runnable route test');

  const summary = "console.log(`Kashf canonical routing tests: ${passed} passed, ${failed} failed`);";
  const tests = `// ── P167 hidden-action AIR-row executor ---------------------------------
const p167HiddenMethod = getKashfMethod('spiritual.p167.hiddenActionAirRows46815');
assert(p167HiddenMethod?.runtimeAllowed === true && p167HiddenMethod?.executorStatus === 'ready', 'p167 hidden-action method is runnable');
assert(canRunKashfMethod('spiritual.p167.hiddenActionAirRows46815') === true, 'p167 hidden-action canRunKashfMethod is true');

const p167HiddenMalefic = buildKashfReadingByQuestionId(makeP204Board({ 4: '1111', 6: '2222', 8: '1111', 15: '2222' }), 'q-hidden-action', { question: 'האם יש פעולה מאחורי הדבר?' });
assert(p167HiddenMalefic.valid === true && p167HiddenMalefic.canRunKashf === true, 'p167 hidden-action malefic fixture executes');
assert(p167HiddenMalefic.primaryFormula?.result?.executorResult?.derivedPattern === '1212', 'p167 assembles only AIR rows H4,H6,H8,H15 in order');
assert(p167HiddenMalefic.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'nahs', 'p167 malefic derived figure is classified as pure malefic');
assert(p167HiddenMalefic.primaryFormula?.result?.executorResult?.hiddenAction === true, 'p167 pure malefic means action is behind the matter');
assert(p167HiddenMalefic.overallPositive === true, 'p167 affirmative hidden-action answer is represented as positive=true');
assert(JSON.stringify(p167HiddenMalefic.primaryFormula?.houses) === JSON.stringify([4, 6, 8, 15]), 'p167 trace uses exactly H4,H6,H8,H15');
assert(JSON.stringify(p167HiddenMalefic.primaryFormula?.result?.executorResult?.airRows?.map((r) => r.airRowValue)) === JSON.stringify(['1','2','1','2']), 'p167 trace exposes the four AIR-row values');
assert(p167HiddenMalefic.primaryFormula?.sourceText === getKashfV57Knowledge('spiritual.p167.hiddenActionAirRows46815')?.v57?.hebrewRule, 'p167 runtime sourceText comes from Hebrew v57');
assert(p167HiddenMalefic.canonicalExecution?.methodsExecuted?.length === 1 && p167HiddenMalefic.canonicalExecution.methodsExecuted[0] === 'spiritual.p167.hiddenActionAirRows46815', 'p167 executes only its exact canonical method');
assert(p167HiddenMalefic.dhamir === null && p167HiddenMalefic.canonicalExecution?.topicBundleExecuted === false && p167HiddenMalefic.canonicalExecution?.altFormulaExecuted === false, 'p167 runs no Dhamir/topic bundle/alternative');
assert(p167HiddenMalefic.primaryFormula?.result?.executorResult?.diagnosisScope === 'hidden-action-only', 'p167 result is explicitly scoped to hidden action only');

const p167HiddenBenefic = buildKashfReadingByQuestionId(makeP204Board({ 4: '2222', 6: '2222', 8: '1111', 15: '1111' }), 'q-hidden-action');
assert(p167HiddenBenefic.primaryFormula?.result?.executorResult?.derivedPattern === '2211', 'p167 benefic fixture derives 2211');
assert(p167HiddenBenefic.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'saad', 'p167 benefic fixture is pure benefic');
assert(p167HiddenBenefic.primaryFormula?.result?.executorResult?.hiddenAction === false && p167HiddenBenefic.overallPositive === false, 'p167 non-malefic result follows explicit otherwise-no branch');

const p167HiddenMixed = buildKashfReadingByQuestionId(makeP204Board({ 4: '2222', 6: '2222', 8: '2222', 15: '2222' }), 'q-hidden-action');
assert(p167HiddenMixed.primaryFormula?.result?.executorResult?.derivedPattern === '2222', 'p167 mixed fixture derives 2222');
assert(p167HiddenMixed.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'mixed', 'p167 preserves mixed classification metadata');
assert(p167HiddenMixed.primaryFormula?.result?.executorResult?.hiddenAction === false && p167HiddenMixed.overallPositive === false, 'p167 mixed still follows source explicit otherwise-no branch rather than being promoted to malefic');
assert(resolveKashfRouteByQuestionId('q-sorcery').kashfMethodId !== 'spiritual.p167.hiddenActionAirRows46815', 'p167 hidden-action remains separated from q-sorcery after activation');

`;
  s = replaceOnce(s, summary, tests + summary, 'p167 canonical tests');
  write(path, s);
}

// 6) Retrieval contract tests.
{
  const path = '_test_kashf_ai_retrieval_index.mjs';
  let s = read(path);
  s = replaceOnce(
    s,
    "expectTop('האם העניין יושלם', 'completion.p173.fireRows15910');",
    "expectTop('האם העניין יושלם', 'completion.p173.fireRows15910');\nexpectTop('האם יש פעולה מאחורי הדבר', 'spiritual.p167.hiddenActionAirRows46815');",
    'p167 retrieval top-hit test'
  );
  const anchor = "const sourceReadyPendingResults = searchKashfAiRetrievalIndex('בריאות הוולד', { sourceReadyOnly: true, limit: 20 });";
  const tests = `const hiddenActionRecord = getKashfAiRetrievalRecord('spiritual.p167.hiddenActionAirRows46815');
assert(JSON.stringify(hiddenActionRecord?.houses) === JSON.stringify([4, 6, 8, 15]), 'p167 retrieval record exposes exact houses');
assert(hiddenActionRecord?.doNotMixWith.includes('spiritual.affectedBySorcery.unsupported'), 'p167 retrieval warns against sorcery conflation');
assert(hiddenActionRecord?.runtimeAllowed === true && hiddenActionRecord?.executorStatus === 'ready', 'p167 retrieval exposes runnable state');

`;
  s = replaceOnce(s, anchor, tests + anchor, 'p167 retrieval record tests');
  write(path, s);
}

// 7) Live AI bridge contract: the activated method is usable by the advisor.
{
  const path = '_test_kashf_ai_retrieval_live_bridge.mjs';
  let s = read(path);
  const anchor = '// 5. Context builder canonical mode carries the bridge into the actual live AI';
  const tests = `// 4b. Newly activated p167 route is available to the live AI only through its
// exact hidden-action method and retains the anti-mixing boundary.
const hiddenActionLive = buildKashfCanonicalAiBridge({
  questionId: 'q-hidden-action',
  questionText: 'האם יש פעולה מאחורי הדבר?',
  board: BOARD,
});
assert(hiddenActionLive.resolution.kashfMethodId === 'spiritual.p167.hiddenActionAirRows46815', 'p167 live bridge resolves exact hidden-action method');
assert(hiddenActionLive.resolution.executorStatus === 'ready', 'p167 live bridge sees ready executor');
assert(hiddenActionLive.aiVerdictAllowed === true, 'p167 live bridge allows AI to explain canonical verdict');
assert(hiddenActionLive.canonicalRetrieval?.doNotMixWith?.includes('spiritual.affectedBySorcery.unsupported'), 'p167 live bridge carries anti-sorcery doNotMixWith guard');
assert(hiddenActionLive.canonicalReading?.canonicalExecution?.topicBundleExecuted === false, 'p167 live bridge does not execute spiritual topic bundle');

`;
  s = replaceOnce(s, anchor, tests + anchor, 'p167 live bridge tests');
  write(path, s);
}

console.log('Applied Kashf p167 hidden-action executor patch.');
