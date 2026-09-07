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

// 1) Enable the already source-ready p206 querent-desire method.
{
  const path = 'goral-hachol/registry/kashf-canonical-method-registry.js';
  let s = read(path);
  const oldBlock = [
    "    kashfRuntimeStatus: 'ready',",
    "    runtimeAllowed: false,",
    "    executionKind: 'custom-engine',",
    "    executorStatus: 'pending',",
    "    notes: 'Combine H7+H11, then combine that result with H5. Pure benefic means the querent wants the matter; pure malefic means the opposite; mixed remains unresolved. A separate explicit p206 clause uses the same derivation for whether a woman finds favor in his eyes, and is mapped under its own canonical method id; the two intents must not be merged.',",
  ].join('\n');
  const newBlock = [
    "    kashfRuntimeStatus: 'ready',",
    "    runtimeAllowed: true,",
    "    executionKind: 'custom-engine',",
    "    executorStatus: 'ready',",
    "    notes: 'Canonical p206 querent-desire executor is wired. Combine H7+H11, then combine that generated figure with H5. Pure benefic means the querent wants the matter; pure malefic means the opposite; mixed remains unresolved. The separate p206 woman-favor clause uses the same derivation but remains a different method/intent and never votes into this result.',",
  ].join('\n');
  s = replaceOnce(s, oldBlock, newBlock, 'p206 desire registry readiness');
  write(path, s);
}

// 2) Exact method-scoped executor.
{
  const path = 'goral-hachol/engine/kashf-canonical-executors.js';
  let s = read(path);
  const anchor = "// Kashf v57 p206 — whether a woman finds favor in the querent's eyes.";
  const fn = [
    "// Kashf v57 p206 — whether the querent wants the matter.",
    "// Derive H7+H11, then combine that generated figure with H5.",
    "// This uses the same geometry as the neighboring woman-favor clause,",
    "// but the semantic intent and output remain strictly separate.",
    "function computeQuerentWantsMatterP206(chart) {",
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
    "  let wantsMatter = null;",
    "  if (classification.saadNahs === 'saad') wantsMatter = true;",
    "  else if (classification.saadNahs === 'nahs') wantsMatter = false;",
    "",
    "  let outputHebrew;",
    "  if (wantsMatter === true) {",
    "    outputHebrew = 'נולדה צורה מן הבית השביעי והאחד־עשר, ולאחר מכן חוברה עם הבית החמישי. התוצאה היא ' + finalFigureHebrew + ' (' + finalPattern + ') — צורה מיטיבה. לפי כשף עמ׳ 206: השואל רוצה בדבר.';",
    "  } else if (wantsMatter === false) {",
    "    outputHebrew = 'נולדה צורה מן הבית השביעי והאחד־עשר, ולאחר מכן חוברה עם הבית החמישי. התוצאה היא ' + finalFigureHebrew + ' (' + finalPattern + ') — צורה מזיקה. לפי כשף עמ׳ 206: הדין להפך — השואל אינו רוצה בדבר.';",
    "  } else {",
    "    outputHebrew = 'נולדה צורה מן הבית השביעי והאחד־עשר, ולאחר מכן חוברה עם הבית החמישי. התוצאה היא ' + finalFigureHebrew + ' (' + finalPattern + ') — ' + (classification.saadNahsHebrew || 'ללא סיווג מכריע') + '. כלל עמ׳ 206 מוסר הכרעה מפורשת למיטיב או מזיק בלבד; תוצאה ממוזגת נשארת ללא הכרעה.';",
    "  }",
    "",
    "  return {",
    "    sourceRef: 'כשף אל-אסרר v57 עמ׳ 206',",
    "    sourceText: 'אם רצית לדעת אם השואל רוצה בדבר או לא: הכה את השביעי והאחד־עשר, ואת היוצא מהם הכה עם החמישי. אם יצאה צורה מיטיבה — הוא רוצה. ואם יצאה צורה מזיקה — להפך.',",
    "    housesUsed: [7, 11, 5],",
    "    h7Pattern,",
    "    h11Pattern,",
    "    h5Pattern,",
    "    firstDerivedPattern: firstDerived.resultPattern,",
    "    firstDerivedFigureHebrew: firstDerived.result?.hebrewName || firstDerived.resultPattern,",
    "    finalPattern,",
    "    finalFigureHebrew,",
    "    classification,",
    "    wantsMatter,",
    "    positive: wantsMatter,",
    "    outputHebrew,",
    "  };",
    "}",
    "",
    "",
  ].join('\n');
  s = replaceOnce(s, anchor, fn + anchor, 'p206 desire executor insertion');
  s = replaceOnce(
    s,
    "  'love.p206.womanFavorH7H11ThenH5': computeWomanFavorP206,",
    "  'love.p206.womanFavorH7H11ThenH5': computeWomanFavorP206,\n  'desire.p206.querentWantsH7H11ThenH5': computeQuerentWantsMatterP206,",
    'p206 desire allowlist'
  );
  write(path, s);
}

// 3) Canonical tests by exact method id. This method is intentionally not
// assigned to q-woman-grace; free-text AI retrieval may resolve it directly.
{
  const path = '_test_kashf_canonical_routing.mjs';
  let s = read(path);
  const summary = "console.log(`Kashf canonical routing tests: ${passed} passed, ${failed} failed`);";
  const tests = [
    "// ── P206 querent-desire exact method ------------------------------------",
    "const p206DesireMethod = getKashfMethod('desire.p206.querentWantsH7H11ThenH5');",
    "assert(p206DesireMethod?.executorStatus === 'ready' && p206DesireMethod?.runtimeAllowed === true, 'p206 querent-desire method is runnable');",
    "assert(canRunKashfMethod('desire.p206.querentWantsH7H11ThenH5') === true, 'p206 querent-desire canRunKashfMethod is true');",
    "",
    "const p206DesireBenefic = buildKashfReadingByMethod(makeP204Board({ 5: '2211', 7: '2222', 11: '2222' }), 'desire.p206.querentWantsH7H11ThenH5', { question: 'האם השואל רוצה בדבר?' });",
    "assert(p206DesireBenefic.valid === true, 'p206 querent-desire benefic fixture executes');",
    "assert(p206DesireBenefic.primaryFormula?.result?.executorResult?.firstDerivedPattern === '2222', 'p206 desire derives H7+H11 first');",
    "assert(p206DesireBenefic.primaryFormula?.result?.executorResult?.finalPattern === '2211', 'p206 desire then combines with H5');",
    "assert(p206DesireBenefic.primaryFormula?.result?.executorResult?.wantsMatter === true, 'p206 desire pure benefic means querent wants matter');",
    "assert(p206DesireBenefic.overallPositive === true, 'p206 desire benefic is positive true');",
    "assert(JSON.stringify(p206DesireBenefic.primaryFormula?.houses) === JSON.stringify([7, 11, 5]), 'p206 desire uses exactly H7,H11,H5');",
    "assert(p206DesireBenefic.primaryFormula?.sourceText === getKashfV57Knowledge('desire.p206.querentWantsH7H11ThenH5')?.v57?.hebrewRule, 'p206 desire sourceText comes from Hebrew v57');",
    "assert(p206DesireBenefic.canonicalExecution?.methodsExecuted?.length === 1 && p206DesireBenefic.canonicalExecution.methodsExecuted[0] === 'desire.p206.querentWantsH7H11ThenH5', 'p206 desire executes only its exact method');",
    "assert(p206DesireBenefic.dhamir === null && p206DesireBenefic.canonicalExecution?.topicBundleExecuted === false && p206DesireBenefic.canonicalExecution?.altFormulaExecuted === false, 'p206 desire runs no Dhamir/topic bundle/alternative');",
    "assert(!p206DesireBenefic.verdict?.text?.includes('תמצא חן'), 'p206 desire does not leak woman-favor semantics');",
    "",
    "const p206DesireMalefic = buildKashfReadingByMethod(makeP204Board({ 5: '1212', 7: '2222', 11: '2222' }), 'desire.p206.querentWantsH7H11ThenH5');",
    "assert(p206DesireMalefic.primaryFormula?.result?.executorResult?.wantsMatter === false, 'p206 desire pure malefic means opposite / does not want matter');",
    "assert(p206DesireMalefic.overallPositive === false, 'p206 desire malefic is positive false');",
    "",
    "const p206DesireMixed = buildKashfReadingByMethod(makeP204Board({ 5: '2222', 7: '2222', 11: '2222' }), 'desire.p206.querentWantsH7H11ThenH5');",
    "assert(p206DesireMixed.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'mixed', 'p206 desire preserves mixed classification');",
    "assert(p206DesireMixed.primaryFormula?.result?.executorResult?.wantsMatter === null && p206DesireMixed.overallPositive === null, 'p206 desire mixed remains unresolved');",
    "",
  ].join('\n');
  s = replaceOnce(s, summary, tests + '\n' + summary, 'p206 desire tests');
  write(path, s);
}

console.log('Applied Kashf p206 querent-desire executor patch.');
