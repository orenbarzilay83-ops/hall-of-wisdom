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
function enableAsCustom(text, methodId, notes, label) {
  return updateMethodBlock(text, methodId, (block) => {
    block = replaceOnce(block, "    runtimeAllowed: false,", "    runtimeAllowed: true,", label + ' runtimeAllowed');
    block = block.replace(/    executionKind: '(?:recast-board|legacy-function|custom-engine)',/, "    executionKind: 'custom-engine',");
    block = replaceOnce(block, "    executorStatus: 'pending',", "    executorStatus: 'ready',", label + ' executorStatus');
    if (/\n    notes: '[^\n]*',/.test(block)) {
      block = block.replace(/\n    notes: '[^\n]*',/, `\n    notes: '${notes}',`);
    }
    return block;
  });
}

// 1) Enable two source-ready methods whose exact mechanics can now be isolated.
{
  const path = 'goral-hachol/registry/kashf-canonical-method-registry.js';
  let s = read(path);
  s = enableAsCustom(
    s,
    'money.p181.recast25811',
    'Canonical p181 secondary-board executor is wired: original H2,H5,H8,H11 become the four mothers of a fresh board. In that recast board H1,H2,H4,H7,H10 must each be strictly internal (dakhil); when all qualify, the source says the money is obtained. Failure of the positive condition remains unresolved because this exact clause does not state the inverse. The preceding p181 2/6/8/10 parity method remains a separate alternative and is not aggregated.',
    'p181 money recast'
  );
  s = enableAsCustom(
    s,
    'career.p266.returnToOffice',
    'Canonical p266 return-to-office executor is wired directly from the body-source clause rather than the broad authorityState helper. H1 must be pure benefic and strictly internal, its same figure must recur in another strong/angle house (H4/H7/H10; H10 is explicitly named), and H16 / al-aqiba must be pure benefic to support the return. Pure-malefic H1 activates the explicit opposite branch. Mixed H1 or incomplete positive testimony remains unresolved. The original H1 occurrence is not counted as a recurrence.',
    'p266 return to office'
  );
  write(path, s);
}

// 2) Add method-scoped executors. Recast is a real new board, never a topic fallback.
{
  const path = 'goral-hachol/engine/kashf-canonical-executors.js';
  let s = read(path);
  s = replaceOnce(
    s,
    "import { combineRamlFigures } from './raml-figures.js';",
    "import { combineRamlFigures } from './raml-figures.js';\nimport { buildRamlBoardFromMothers } from './raml-board-generator.js';",
    'board generator import'
  );

  const anchor = '// Kashf v57 p180 — invert H10 rows and judge the resulting figure\'s placement.';
  const fn = `// Kashf v57 p181 — rebuild a secondary board from H2/H5/H8/H11.\nfunction computeMoneyAcquireP181(chart) {\n  if (!Array.isArray(chart)) return null;\n  const sourceMotherHouses = [2, 5, 8, 11];\n  const sourceMothers = sourceMotherHouses.map((houseNumber) => {\n    const entry = findCanonicalHouse(chart, houseNumber);\n    const pattern = entry?.key || entry?.pattern || null;\n    return pattern ? { houseNumber, pattern, figureHebrew: entry?.hebrew || entry?.hebrewName || pattern } : null;\n  });\n  if (sourceMothers.some((item) => !item)) return null;\n\n  const recastMotherPatterns = sourceMothers.map((item) => item.pattern);\n  const recastBoard = buildRamlBoardFromMothers(recastMotherPatterns);\n  const recastChart = recastBoard?.entries || [];\n  if (recastChart.length !== 16) return null;\n\n  const conditionHouses = [1, 2, 4, 7, 10];\n  const conditionResults = conditionHouses.map((houseNumber) => {\n    const entry = findCanonicalHouse(recastChart, houseNumber);\n    const pattern = entry?.key || entry?.pattern || null;\n    if (!pattern) return null;\n    const classification = classifyCanonicalFigure(pattern);\n    return {\n      houseNumber,\n      pattern,\n      figureHebrew: classification.figureHebrew || entry?.hebrew || entry?.hebrewName || pattern,\n      classification,\n      strictlyInternal: classification.dakhalKharij === 'dakhil',\n    };\n  });\n  if (conditionResults.some((item) => !item)) return null;\n\n  const allRequiredInternal = conditionResults.every((item) => item.strictlyInternal);\n  const moneyObtained = allRequiredInternal ? true : null;\n  const failingHouses = conditionResults.filter((item) => !item.strictlyInternal).map((item) => item.houseNumber);\n  const outputHebrew = allRequiredInternal\n    ? 'הבתים 2, 5, 8 ו־11 מן הלוח המקורי הועמדו כאמהות ונבנה מהם לוח חדש. בלוח החדש ארבעת היתדות — 1, 4, 7, 10 — וגם בית 2 הם צורות פנימיות ממש. לפי כשף v57 עמ׳ 181: הממון יושג.'\n    : 'הבתים 2, 5, 8 ו־11 מן הלוח המקורי הועמדו כאמהות ונבנה מהם לוח חדש. תנאי עמ׳ 181 דורש שבארבעת היתדות ובבית 2 בלוח החדש יהיו צורות פנימיות; התנאי אינו שלם בבתים ' + failingHouses.join(', ') + '. הקטע הזה אינו מוסר במפורש שהעדר התנאי מוכיח שהממון לא יושג, ולכן התוצאה נשארת ללא הכרעה שלילית. אין לצרף לכאן את שיטת הזוג/יחיד החלופית שבאותו עמוד.';\n\n  return {\n    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 181',\n    sourceText: 'בדין הממון: העמד את השני, החמישי, השמיני והאחד־עשר כאמהות, והשלים את גורל החול. אם ראית שהיתדות והבית השני פנימיים, הממון יושג.',\n    housesUsed: sourceMotherHouses,\n    sourceMotherHouses,\n    sourceMothers,\n    recastMotherPatterns,\n    recastBoardValid: recastBoard?.boardValidation?.isValid !== false,\n    recastBoardWarnings: recastBoard?.boardValidation?.warnings || [],\n    recastConditionHouses: conditionHouses,\n    recastConditionResults: conditionResults,\n    allRequiredInternal,\n    failingHouses,\n    moneyObtained,\n    sourceOutcome: allRequiredInternal ? 'money-obtained' : 'unresolved',\n    positive: moneyObtained,\n    verdictType: 'money-acquire-recast',\n    outputHebrew,\n  };\n}\n\n// Kashf v57 p266 — whether a person dismissed from service returns.\nfunction computeReturnToOfficeP266(chart) {\n  if (!Array.isArray(chart)) return null;\n  const h1 = findCanonicalHouse(chart, 1);\n  const h16 = findCanonicalHouse(chart, 16);\n  const h1Pattern = h1?.key || h1?.pattern || null;\n  const h16Pattern = h16?.key || h16?.pattern || null;\n  if (!h1Pattern || !h16Pattern) return null;\n\n  const h1Classification = classifyCanonicalFigure(h1Pattern);\n  const h16Classification = classifyCanonicalFigure(h16Pattern);\n  const h1BeneficIncoming = h1Classification.saadNahs === 'saad' && h1Classification.dakhalKharij === 'dakhil';\n  const h1PureMalefic = h1Classification.saadNahs === 'nahs';\n\n  const strongRecurrenceHouses = [4, 7, 10].filter((houseNumber) => {\n    const entry = findCanonicalHouse(chart, houseNumber);\n    return (entry?.key || entry?.pattern || null) === h1Pattern;\n  });\n  const appearsInStrongHouse = strongRecurrenceHouses.length > 0;\n  const appearsInH10 = strongRecurrenceHouses.includes(10);\n  const outcomeSupportsReturn = h16Classification.saadNahs === 'saad';\n  const returnIndicated = h1BeneficIncoming && appearsInStrongHouse && outcomeSupportsReturn;\n\n  let sourceOutcome = 'unresolved';\n  let positive = null;\n  let outputHebrew;\n  if (returnIndicated) {\n    sourceOutcome = 'returns';\n    positive = true;\n    outputHebrew = 'בית 1 הוא צורה מיטיבה פנימית, אותה צורה חוזרת בבית חזק נוסף (' + strongRecurrenceHouses.join(', ') + '), ובית 16 — אחרית הדבר — מיטיב ותומך. לפי כשף v57 עמ׳ 266: מי שהודח מן השירות חוזר למקומו.';\n  } else if (h1PureMalefic) {\n    sourceOutcome = 'does-not-return';\n    positive = false;\n    outputHebrew = 'בית 1 הוא צורה מזיקה טהורה. המקור בעמ׳ 266 אומר במפורש שבמקרה שהצורה הנזכרת מזיקה הדין להפך; לפי כלל זה אין חזרה למקום השירות. אין צורך להמציא הצבעת רוב מן הבתים האחרים.';\n  } else {\n    const missing = [];\n    if (!h1BeneficIncoming) missing.push('בית 1 אינו מיטיב־פנימי במלוא התנאי');\n    if (!appearsInStrongHouse) missing.push('צורת בית 1 אינה חוזרת בבית חזק נוסף');\n    if (!outcomeSupportsReturn) missing.push('בית 16 אינו נותן עדות מיטיבה תומכת');\n    outputHebrew = 'תנאי החזרה החיובי של כשף v57 עמ׳ 266 אינו שלם: ' + missing.join('; ') + '. מאחר שבית 1 גם אינו מזיק טהור בענף ההפוך המפורש, אין להשלים פסק מן הדעת והתוצאה נשארת ללא הכרעה.';\n  }\n\n  return {\n    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 266',\n    sourceText: 'מי שהודח משירות — האם יחזור? ראה את הראשון. אם הוא מיטיב נכנס, ומצטייר בעשירי או בבתים החזקים, והאחרית מעידה על כך — הוא חוזר למקומו. ואם הצורה מזיקה, הדין להפך.',\n    housesUsed: [1, 4, 7, 10, 16],\n    h1Pattern,\n    h1FigureHebrew: h1Classification.figureHebrew || h1?.hebrew || h1?.hebrewName || h1Pattern,\n    h1Classification,\n    h1BeneficIncoming,\n    strongRecurrenceHouses,\n    appearsInStrongHouse,\n    appearsInH10,\n    outcomeHouse: 16,\n    h16Pattern,\n    h16FigureHebrew: h16Classification.figureHebrew || h16?.hebrew || h16?.hebrewName || h16Pattern,\n    h16Classification,\n    outcomeSupportsReturn,\n    sourceOutcome,\n    positive,\n    verdictType: 'return-to-office',\n    outputHebrew,\n  };\n}\n\n`;
  s = replaceOnce(s, anchor, fn + anchor, 'new custom executors anchor');
  s = replaceOnce(
    s,
    "  'money.p180.livelihoodH10Invert': computeLivelihoodP180,",
    "  'money.p180.livelihoodH10Invert': computeLivelihoodP180,\n  'money.p181.recast25811': computeMoneyAcquireP181,\n  'career.p266.returnToOffice': computeReturnToOfficeP266,",
    'custom executor map'
  );
  write(path, s);
}

// 3) Retrieval aliases/house scopes for the two newly runnable methods.
{
  const path = 'goral-hachol/registry/kashf-ai-retrieval-index.js';
  let s = read(path);
  const anchor = "  'missing.p248-249.lifeH1H4H9Outcome': {";
  const block = `  'money.p181.recast25811': {\n    aliases: ['האם הממון יושג', 'האם הכסף יגיע לידי', 'השגת ממון', 'האם אקבל את הכסף', 'ממון צפוי'],\n    doNotMixWith: ['money.p179.sourceByIncomingHonorHouse', 'money.p180.livelihoodH10Invert', 'inheritance.p180.elementComposite'],\n    houses: [2, 5, 8, 11],\n  },\n  'career.p266.returnToOffice': {\n    aliases: ['האם אחזור לתפקיד', 'האם יחזור לתפקידו', 'חזרה למשרה לאחר הדחה', 'האם אשוב למקום העבודה', 'מי שהודח משירות האם יחזור'],\n    doNotMixWith: ['state.p265.h1h2h9h15', 'authority.p257.appointmentH1H10Planet', 'authority.p256.honorConditionH10Planet'],\n    houses: [1, 4, 7, 10, 16],\n  },\n`;
  s = replaceOnce(s, anchor, block + anchor, 'retrieval overrides');
  write(path, s);
}

// 4) Canonical routing/source-boundary tests.
{
  const path = '_test_kashf_canonical_routing.mjs';
  let s = read(path);
  const anchor = 'console.log(`Kashf canonical routing tests: ${passed} passed, ${failed} failed`);';
  const tests = `// ── Easy batch 04: p181 recast money + p266 return to office ----------\nassertRoute('q-livelihood-arrive', {\n  ok: true,\n  canRunKashf: true,\n  kashfIntentId: 'money.acquire',\n  kashfMethodId: 'money.p181.recast25811',\n  kashfRuntimeStatus: 'ready',\n  executorStatus: 'ready',\n  runtimeAllowed: true,\n});\nassertRoute('q-career-return', {\n  ok: true,\n  canRunKashf: true,\n  kashfIntentId: 'career.returnToOffice',\n  kashfMethodId: 'career.p266.returnToOffice',\n  kashfRuntimeStatus: 'ready',\n  executorStatus: 'ready',\n  runtimeAllowed: true,\n});\nassert(canRunKashfMethod('money.p181.recast25811') === true, 'p181 recast money method is explicitly runnable');\nassert(canRunKashfMethod('career.p266.returnToOffice') === true, 'p266 return-to-office method is explicitly runnable');\n\nconst p181PositiveBoard = buildRamlBoardFromMothers(['2212', '2121', '1211', '1212']);\nconst p181Positive = buildKashfReadingByQuestionId(p181PositiveBoard, 'q-livelihood-arrive');\nconst p181Result = p181Positive.primaryFormula?.result?.executorResult;\nassert(p181Result?.sourceOutcome === 'money-obtained', 'p181 secondary-board positive condition yields money-obtained');\nassert(JSON.stringify(p181Result?.sourceMotherHouses) === JSON.stringify([2,5,8,11]), 'p181 uses only original H2/H5/H8/H11 as recast mothers');\nassert(JSON.stringify(p181Result?.recastMotherPatterns) === JSON.stringify(['2121','2211','2112','2111']), 'p181 builds the expected secondary mothers from a real board');\nassert(p181Result?.recastConditionResults?.every((item) => item.strictlyInternal) === true, 'p181 requires all recast angles plus H2 to be strictly internal');\nassert(p181Positive.primaryFormula?.sourceText === getKashfV57Knowledge('money.p181.recast25811')?.v57?.hebrewRule, 'p181 runtime sourceText comes from Hebrew v57');\n\nconst p266Positive = buildKashfReadingByQuestionId(\n  makeP204Board({ 1: '2211', 10: '2211', 16: '1122' }),\n  'q-career-return'\n);\nconst p266PositiveResult = p266Positive.primaryFormula?.result?.executorResult;\nassert(p266PositiveResult?.sourceOutcome === 'returns', 'p266 positive source condition yields return');\nassert(p266PositiveResult?.strongRecurrenceHouses?.includes(10), 'p266 requires H1 figure recurrence in H10/another strong house');\nassert(p266PositiveResult?.outcomeHouse === 16 && p266PositiveResult?.outcomeSupportsReturn === true, 'p266 uses H16 as al-aqiba/outcome testimony');\nconst p266Negative = buildKashfReadingByQuestionId(makeP204Board({ 1: '1112', 16: '1122' }), 'q-career-return');\nassert(p266Negative.primaryFormula?.result?.executorResult?.sourceOutcome === 'does-not-return', 'p266 pure-malefic H1 activates the explicit opposite branch');\nconst p266Unresolved = buildKashfReadingByQuestionId(makeP204Board({ 1: '2211', 16: '1122' }), 'q-career-return');\nassert(p266Unresolved.primaryFormula?.result?.executorResult?.sourceOutcome === 'unresolved', 'p266 benefic incoming H1 without a strong-house recurrence is not over-read as a return');\n\nfor (const reading of [p181Positive, p266Positive, p266Negative, p266Unresolved]) {\n  assert(reading.canonicalExecution?.methodsExecuted?.length === 1, 'easy batch 04 reading executes exactly one canonical method');\n  assert(reading.dhamir === null && reading.canonicalExecution?.topicBundleExecuted === false && reading.canonicalExecution?.altFormulaExecuted === false, 'easy batch 04 reading runs no Dhamir/topic bundle/alternative');\n}\n\n`;
  s = replaceOnce(s, anchor, tests + anchor, 'canonical tests ending');
  write(path, s);
}

// 5) Retrieval contract tests.
{
  const path = '_test_kashf_ai_retrieval_index.mjs';
  let s = read(path);
  s = replaceOnce(
    s,
    "expectTop('הנעדר חי או מת', 'missing.p248-249.lifeH1H4H9Outcome');",
    "expectTop('הנעדר חי או מת', 'missing.p248-249.lifeH1H4H9Outcome');\nexpectTop('האם הממון יושג', 'money.p181.recast25811');\nexpectTop('האם אחזור לתפקיד', 'career.p266.returnToOffice');",
    'retrieval expectTop'
  );
  const anchor = "const pendingKnowledgeRecord = getKashfAiRetrievalRecord('mother.p257.statusDayNight');";
  const tests = `for (const [methodId, questionId, houses, separation] of [\n  ['money.p181.recast25811', 'q-livelihood-arrive', [2,5,8,11], 'money.p180.livelihoodH10Invert'],\n  ['career.p266.returnToOffice', 'q-career-return', [1,4,7,10,16], 'authority.p257.appointmentH1H10Planet'],\n]) {\n  const record = getKashfAiRetrievalRecord(methodId);\n  assert(record?.questionIds.includes(questionId), methodId + ' retrieval links ' + questionId);\n  assert(record?.runtimeAllowed === true && record?.executorStatus === 'ready', methodId + ' retrieval exposes runnable state');\n  assert(JSON.stringify(record?.houses) === JSON.stringify(houses), methodId + ' retrieval exposes exact operational input/scope houses');\n  assert(record?.doNotMixWith.includes(separation), methodId + ' retrieval preserves neighboring-method separation');\n}\n\n`;
  s = replaceOnce(s, anchor, tests + anchor, 'retrieval contract tests');
  write(path, s);
}

// 6) Live bridge tests.
{
  const path = '_test_kashf_ai_retrieval_live_bridge.mjs';
  let s = read(path);
  const anchor = 'console.log(`Kashf AI retrieval live bridge tests: ${passed} passed, ${failed} failed`);';
  const tests = `// 14. Easy batch 04 live retrieval + authoritative routes.\nfor (const [questionText, questionId, methodId] of [\n  ['האם הממון יושג', 'q-livelihood-arrive', 'money.p181.recast25811'],\n  ['האם אחזור לתפקיד', 'q-career-return', 'career.p266.returnToOffice'],\n]) {\n  const freeText = buildKashfCanonicalAiBridge({ questionText, board: BOARD });\n  assert(freeText.resolution.kashfMethodId === methodId, questionText + ' resolves exact batch 04 method');\n  assert(freeText.resolution.resolutionSource === 'retrieval-index', questionText + ' resolves through retrieval index');\n  const locked = buildKashfCanonicalAiBridge({ questionId, questionText: 'מה מצבי הכללי?', board: BOARD });\n  assert(locked.resolution.kashfMethodId === methodId, questionId + ' remains authoritative over competing wording');\n  assert(locked.resolution.resolutionSource === 'question-route', questionId + ' resolves through authoritative question route');\n  assert(locked.canonicalRetrieval?.knowledgeLanguage === 'he', methodId + ' bridge exposes Hebrew operational knowledge');\n  assert(locked.aiVerdictAllowed === true, methodId + ' is executable through the live bridge');\n  assert(locked.canonicalReading?.canonicalExecution?.topicBundleExecuted === false, methodId + ' live bridge does not execute a broad topic bundle');\n}\n\n`;
  s = replaceOnce(s, anchor, tests + anchor, 'live bridge ending');
  write(path, s);
}

console.log('Kashf easy batch 04 patch applied.');
