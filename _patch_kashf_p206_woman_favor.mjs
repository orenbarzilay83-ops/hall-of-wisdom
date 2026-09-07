#!/usr/bin/env node
import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, text) { fs.writeFileSync(path, text); }
function replaceOnce(text, needle, replacement, label) {
  const first = text.indexOf(needle);
  if (first < 0) throw new Error('Missing patch anchor: ' + label);
  if (text.indexOf(needle, first + needle.length) >= 0) throw new Error('Non-unique patch anchor: ' + label);
  return text.slice(0, first) + replacement + text.slice(first + needle.length);
}

// 1) Canonical method registry: p206 contains TWO distinct source questions
// with the same derivation. Preserve them as separate intents/method ids.
{
  const path = 'goral-hachol/registry/kashf-canonical-method-registry.js';
  let s = read(path);
  const anchor = "  'desire.p206.querentWantsH7H11ThenH5': method({";
  const addition = [
    "  'love.p206.womanFavorH7H11ThenH5': method({",
    "    kashfMethodId: 'love.p206.womanFavorH7H11ThenH5',",
    "    kashfIntentId: 'love.womanFindsFavor',",
    "    topicId: 'marriage',",
    "    sourcePages: [206],",
    "    kashfRuntimeStatus: 'ready',",
    "    runtimeAllowed: true,",
    "    executionKind: 'custom-engine',",
    "    executorStatus: 'ready',",
    "    notes: 'Canonical p206 woman-favor clause. Combine H7+H11, then combine that result with H5. Pure benefic means the woman finds favor in his eyes; pure malefic means she does not; mixed remains unresolved. This is one-directional favor, not mutual chemistry or a general love verdict.',",
    "  }),",
    "",
  ].join('\n');
  s = replaceOnce(s, anchor, addition + anchor, 'method registry p206 insertion');
  s = replaceOnce(
    s,
    "    notes: 'Combine H7+H11, then combine that result with H5. A benefic result means the querent wants the matter. The source does NOT say this method tests whether a woman will please a man or whether chemistry is mutual.',",
    "    notes: 'Combine H7+H11, then combine that result with H5. Pure benefic means the querent wants the matter; pure malefic means the opposite; mixed remains unresolved. A separate explicit p206 clause uses the same derivation for whether a woman finds favor in his eyes, and is mapped under its own canonical method id; the two intents must not be merged.',",
    'desire p206 stale note'
  );
  write(path, s);
}

// 2) Hebrew v57 operational knowledge for the newly isolated source clause.
{
  const path = 'goral-hachol/registry/kashf-v57-knowledge-registry.js';
  let s = read(path);
  const anchor = "  'desire.p206.querentWantsH7H11ThenH5': knowledge({";
  const addition = [
    "  'love.p206.womanFavorH7H11ThenH5': knowledge({",
    "    kashfMethodId: 'love.p206.womanFavorH7H11ThenH5',",
    "    page: 206,",
    "    topic: 'הפרק השביעי — נישואין, המבקש והמבוקש, המנצח והמנוצח, מכירה וקנייה',",
    "    heading: 'האם האישה תמצא חן בעיני השואל',",
    "    hebrewRule: 'אם שאל השואל על אישה — האם היא תמצא חן בעיני? קח צורה מן השביעי והאחד־עשר, ואת היוצא הכה עם החמישי. אם יצאה צורה מיטיבה, היא תמצא חן בעיניו. ואם יצאה צורה מזיקה, לא תמצא חן בעיניו.',",
    "    supportingPages: [54, 57, 58, 59, 60],",
    "    arabicVerificationPages: [206],",
    "    verificationNotes: 'המקור הערבי בעמ׳ 206 מאשר במפורש את אותה שאלה ואת אותה הולדה: השביעי+האחד־עשר, ואחר כך עם החמישי; מיטיב = תמצא חן, מזיק = לא תמצא חן.',",
    "    notes: 'זהו דין חד־כיווני של מציאת חן בעיני השואל. אין להרחיב אותו לכימיה הדדית, משיכה הדדית או אהבה מלאה; דין רצון השואל הסמוך בעמ׳ 206 נשמר כשיטה נפרדת אף שהחישוב זהה.',",
    "  }),",
    "",
  ].join('\n');
  s = replaceOnce(s, anchor, addition + anchor, 'v57 p206 woman-favor insertion');
  write(path, s);
}

// 3) Question route: q-woman-grace already matches the explicit p206 source
// question. Route it to the newly isolated exact method instead of stealing the
// neighboring querent-desire intent.
{
  const path = 'goral-hachol/registry/kashf-question-route-registry.js';
  let s = read(path);
  const oldBlock = [
    "  'q-woman-grace': route({",
    "    questionId: 'q-woman-grace',",
    "    disposition: 'RENAME',",
    "    kashfIntentId: 'desire.querentWantsMatter',",
    "    kashfMethodId: 'desire.p206.querentWantsH7H11ThenH5',",
    "    kashfRuntimeStatus: 'ready',",
    "    note: 'The p206 formula answers whether the querent wants the matter. It does not answer whether the woman will please the man or whether chemistry is mutual; the UI wording must be corrected before cutover.',",
    "  }),",
  ].join('\n');
  const newBlock = [
    "  'q-woman-grace': route({",
    "    questionId: 'q-woman-grace',",
    "    disposition: 'KEEP',",
    "    kashfIntentId: 'love.womanFindsFavor',",
    "    kashfMethodId: 'love.p206.womanFavorH7H11ThenH5',",
    "    kashfRuntimeStatus: 'ready',",
    "    note: 'v57 p206 explicitly asks whether the woman will find favor in his eyes. This route is one-directional favor only; it must not be expanded into mutual chemistry, mutual attraction, or the neighboring querent-desire rule.',",
    "  }),",
  ].join('\n');
  s = replaceOnce(s, oldBlock, newBlock, 'q-woman-grace route');
  write(path, s);
}

// 4) Question Bank wording: keep the sourced label, remove the unsourced
// promise of mutual chemistry.
{
  const path = 'goral-hachol/ui/question-bank.js';
  let s = read(path);
  s = replaceOnce(
    s,
    "    desc: 'לפני שידוך — האם יהיה כימיה הדדית ומשיכה',",
    "    desc: 'לפני שידוך — האם האישה תמצא חן בעיני האיש; הכלל אינו בודק כימיה או משיכה הדדית',",
    'q-woman-grace description'
  );
  write(path, s);
}

// 5) Method-scoped executor. The final figure alone carries this clause's
// benefic/malefic judgment; mixed is preserved as unresolved.
{
  const path = 'goral-hachol/engine/kashf-canonical-executors.js';
  let s = read(path);
  const anchor = 'const CUSTOM_EXECUTORS = Object.freeze({';
  const fn = [
    "// Kashf v57 p206 — whether a woman finds favor in the querent's eyes.",
    "// Derive H7+H11, then combine that generated figure with H5.",
    "// This is distinct from the adjacent querent-desire clause despite using",
    "// the same derivation, and distinct from mutual love/attention methods.",
    "function computeWomanFavorP206(chart) {",
    "  if (!Array.isArray(chart)) return null;",
    "  const h7 = findCanonicalHouse(chart, 7);",
    "  const h11 = findCanonicalHouse(chart, 11);",
    "  const h5 = findCanonicalHouse(chart, 5);",
    "  const h7Pattern = h7?.key || h7?.pattern || null;",
    "  const h11Pattern = h11?.key || h11?.pattern || null;",
    "  const h5Pattern = h5?.key || h5?.pattern || null;",
    "  if (!h7Pattern || !h11Pattern || !h5Pattern) return null;",
    "",
    "  const firstDerived = combineRamlFigures(h7Pattern, h11Pattern);",
    "  const finalDerived = combineRamlFigures(firstDerived.resultPattern, h5Pattern);",
    "  const finalPattern = finalDerived.resultPattern;",
    "  const classification = classifyCanonicalFigure(finalPattern);",
    "  const finalFigureHebrew = finalDerived.result?.hebrewName || classification.figureHebrew || finalPattern;",
    "",
    "  let findsFavor = null;",
    "  if (classification.saadNahs === 'saad') findsFavor = true;",
    "  else if (classification.saadNahs === 'nahs') findsFavor = false;",
    "",
    "  let outputHebrew;",
    "  if (findsFavor === true) {",
    "    outputHebrew = 'נולדה צורה מן הבית השביעי והאחד־עשר, ולאחר מכן חוברה עם הבית החמישי. התוצאה היא ' + finalFigureHebrew + ' (' + finalPattern + ') — צורה מיטיבה. לפי כשף עמ׳ 206: היא תמצא חן בעיניו.';",
    "  } else if (findsFavor === false) {",
    "    outputHebrew = 'נולדה צורה מן הבית השביעי והאחד־עשר, ולאחר מכן חוברה עם הבית החמישי. התוצאה היא ' + finalFigureHebrew + ' (' + finalPattern + ') — צורה מזיקה. לפי כשף עמ׳ 206: היא לא תמצא חן בעיניו.';",
    "  } else {",
    "    outputHebrew = 'נולדה צורה מן הבית השביעי והאחד־עשר, ולאחר מכן חוברה עם הבית החמישי. התוצאה היא ' + finalFigureHebrew + ' (' + finalPattern + ') — ' + (classification.saadNahsHebrew || 'ללא סיווג מכריע') + '. כלל עמ׳ 206 מוסר הכרעה מפורשת למיטיב או מזיק בלבד; תוצאה ממוזגת נשארת ללא הכרעה.';",
    "  }",
    "",
    "  return {",
    "    sourceRef: 'כשף אל-אסרר v57 עמ׳ 206',",
    "    sourceText: 'אם שאל השואל על אישה — האם היא תמצא חן בעיני? קח צורה מן השביעי והאחד־עשר, ואת היוצא הכה עם החמישי. אם יצאה צורה מיטיבה, היא תמצא חן בעיניו. ואם יצאה צורה מזיקה, לא תמצא חן בעיניו.',",
    "    housesUsed: [7, 11, 5],",
    "    h7Pattern,",
    "    h11Pattern,",
    "    h5Pattern,",
    "    firstDerivedPattern: firstDerived.resultPattern,",
    "    firstDerivedFigureHebrew: firstDerived.result?.hebrewName || firstDerived.resultPattern,",
    "    finalPattern,",
    "    finalFigureHebrew,",
    "    classification,",
    "    findsFavor,",
    "    positive: findsFavor,",
    "    outputHebrew,",
    "  };",
    "}",
    "",
    "",
  ].join('\n');
  s = replaceOnce(s, anchor, fn + anchor, 'p206 executor insertion');
  s = replaceOnce(
    s,
    "const CUSTOM_EXECUTORS = Object.freeze({\n",
    "const CUSTOM_EXECUTORS = Object.freeze({\n  'love.p206.womanFavorH7H11ThenH5': computeWomanFavorP206,\n",
    'p206 custom executor allowlist'
  );
  write(path, s);
}

// 6) AI retrieval aliases and anti-mixing boundaries for the two neighboring
// p206 clauses.
{
  const path = 'goral-hachol/registry/kashf-ai-retrieval-index.js';
  let s = read(path);
  const anchor = "  'clothing.p264-265.luck': {";
  const addition = [
    "  'desire.p206.querentWantsH7H11ThenH5': {",
    "    aliases: ['האם השואל רוצה בדבר', 'האם אני רוצה בזה', 'רצון השואל בדבר', 'האם הוא רוצה בעניין'],",
    "    doNotMixWith: ['love.p206.womanFavorH7H11ThenH5'],",
    "    houses: [7, 11, 5],",
    "  },",
    "  'love.p206.womanFavorH7H11ThenH5': {",
    "    aliases: ['האם האישה תמצא חן בעיניו', 'האם היא תמצא חן בעיניו', 'האם האישה מוצאת חן בעיני האיש', 'האם היא מוצאת חן בעיניי'],",
    "    doNotMixWith: ['desire.p206.querentWantsH7H11ThenH5', 'love.p204.attentionFireRows1713'],",
    "    houses: [7, 11, 5],",
    "  },",
  ].join('\n') + '\n';
  s = replaceOnce(s, anchor, addition + anchor, 'AI retrieval p206 overrides');
  write(path, s);
}

// 7) Canonical regression tests: exact route + benefic/malefic/mixed + strict
// method isolation and v57 Hebrew source contract.
{
  const path = '_test_kashf_canonical_routing.mjs';
  let s = read(path);
  const summary = "console.log(`Kashf canonical routing tests: ${passed} passed, ${failed} failed`);";
  const tests = [
    "// ── P206 exact woman-favor source method --------------------------------",
    "const womanFavorRoute = assertRoute('q-woman-grace', {",
    "  ok: true,",
    "  canRunKashf: true,",
    "  kashfIntentId: 'love.womanFindsFavor',",
    "  kashfMethodId: 'love.p206.womanFavorH7H11ThenH5',",
    "  kashfRuntimeStatus: 'ready',",
    "  executorStatus: 'ready',",
    "  runtimeAllowed: true,",
    "});",
    "assert(canRunKashfMethod(womanFavorRoute.kashfMethodId) === true, 'p206 woman-favor method is explicitly runnable');",
    "assert(getKashfMethod('desire.p206.querentWantsH7H11ThenH5')?.kashfIntentId === 'desire.querentWantsMatter', 'neighboring p206 querent-desire clause remains a separate intent');",
    "",
    "const womanFavorBeneficBoard = makeP204Board({ 5: '2211', 7: '2222', 11: '2222' });",
    "const womanFavorBenefic = buildKashfReadingByQuestionId(womanFavorBeneficBoard, 'q-woman-grace', { question: 'האם האישה תמצא חן בעיני האיש?' });",
    "assert(womanFavorBenefic.valid === true, 'p206 woman-favor benefic fixture executes');",
    "assert(womanFavorBenefic.primaryFormula?.result?.executorResult?.firstDerivedPattern === '2222', 'p206 derives H7+H11 first');",
    "assert(womanFavorBenefic.primaryFormula?.result?.executorResult?.finalPattern === '2211', 'p206 then combines derived result with H5');",
    "assert(womanFavorBenefic.primaryFormula?.result?.executorResult?.findsFavor === true, 'p206 pure benefic final means she finds favor');",
    "assert(womanFavorBenefic.overallPositive === true, 'p206 benefic final exposes positive true');",
    "assert(JSON.stringify(womanFavorBenefic.primaryFormula?.houses) === JSON.stringify([7, 11, 5]), 'p206 trace uses exactly H7,H11,H5');",
    "assert(womanFavorBenefic.primaryFormula?.sourceText === getKashfV57Knowledge('love.p206.womanFavorH7H11ThenH5')?.v57?.hebrewRule, 'p206 operational sourceText comes from Hebrew v57');",
    "assert(womanFavorBenefic.canonicalExecution?.methodsExecuted?.length === 1 && womanFavorBenefic.canonicalExecution.methodsExecuted[0] === 'love.p206.womanFavorH7H11ThenH5', 'p206 executes exactly the woman-favor method');",
    "assert(womanFavorBenefic.canonicalExecution?.altFormulaExecuted === false, 'p206 does not execute an alternative formula');",
    "assert(womanFavorBenefic.canonicalExecution?.topicBundleExecuted === false, 'p206 does not execute a broad marriage/love topic bundle');",
    "assert(womanFavorBenefic.dhamir === null, 'p206 does not run Dhamir');",
    "assert(!womanFavorBenefic.verdict?.text?.includes('כימיה הדדית'), 'p206 does not invent mutual chemistry');",
    "",
    "const womanFavorMaleficBoard = makeP204Board({ 5: '1212', 7: '2222', 11: '2222' });",
    "const womanFavorMalefic = buildKashfReadingByQuestionId(womanFavorMaleficBoard, 'q-woman-grace', { question: 'האם האישה תמצא חן בעיני האיש?' });",
    "assert(womanFavorMalefic.primaryFormula?.result?.executorResult?.finalPattern === '1212', 'p206 malefic fixture reaches pure malefic final');",
    "assert(womanFavorMalefic.primaryFormula?.result?.executorResult?.findsFavor === false, 'p206 pure malefic final means she does not find favor');",
    "assert(womanFavorMalefic.overallPositive === false, 'p206 malefic final exposes positive false');",
    "",
    "const womanFavorMixedBoard = makeP204Board({ 5: '2222', 7: '2222', 11: '2222' });",
    "const womanFavorMixed = buildKashfReadingByQuestionId(womanFavorMixedBoard, 'q-woman-grace', { question: 'האם האישה תמצא חן בעיני האיש?' });",
    "assert(womanFavorMixed.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'mixed', 'p206 mixed fixture preserves mixed classification');",
    "assert(womanFavorMixed.primaryFormula?.result?.executorResult?.findsFavor === null, 'p206 mixed final stays unresolved');",
    "assert(womanFavorMixed.overallPositive === null, 'p206 mixed final does not become a yes/no verdict');",
    "",
  ].join('\n');
  s = replaceOnce(s, summary, tests + '\n' + summary, 'canonical test summary insertion');
  write(path, s);
}

// 8) AI retrieval regression: same calculation, distinct semantic intents.
{
  const path = '_test_kashf_ai_retrieval_index.mjs';
  let s = read(path);
  const anchor = "expectTop('אל מי מופנה המבט', 'love.p204.attentionFireRows1713');";
  const replacement = [
    anchor,
    "expectTop('האם האישה תמצא חן בעיניו', 'love.p206.womanFavorH7H11ThenH5');",
    "expectTop('האם השואל רוצה בדבר', 'desire.p206.querentWantsH7H11ThenH5');",
  ].join('\n');
  s = replaceOnce(s, anchor, replacement, 'AI retrieval p206 tests');
  write(path, s);
}

console.log('Applied Kashf p206 woman-favor source correction and executor patch.');
