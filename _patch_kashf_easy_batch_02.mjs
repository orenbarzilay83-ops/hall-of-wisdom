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
function enableMethod(text, methodId, notes, label) {
  return updateMethodBlock(text, methodId, (block) => {
    block = replaceOnce(block, "    runtimeAllowed: false,", "    runtimeAllowed: true,", label + ' runtimeAllowed');
    block = replaceOnce(block, "    executorStatus: 'pending',", "    executorStatus: 'ready',", label + ' executorStatus');
    if (/\n    notes: '[^\n]*',/.test(block)) {
      block = block.replace(/\n    notes: '[^\n]*',/, `\n    notes: '${notes}',`);
    } else {
      block = block.replace('\n  }),', `\n    notes: '${notes}',\n  }),`);
    }
    return block;
  });
}

// 1) Activate four source-ready, non-recast methods.
{
  const path = 'goral-hachol/registry/kashf-canonical-method-registry.js';
  let s = read(path);
  s = enableMethod(
    s,
    'child.p194.healthTrajectoryH6H8',
    'Canonical p194 child-health trajectory executor is wired as two separate source witnesses: pure malefic H6 gives the explicit childhood-pains warning; H8 pure malefic gives low hope, while H8 pure benefic gives improvement as the child grows. Mixed or unmentioned branches remain unresolved. This method is not current-illness recovery and does not aggregate H6+H8 into one invented score.',
    'p194 child health trajectory'
  );
  s = enableMethod(
    s,
    'siblings.p182.seniority',
    'Canonical p182 sibling-seniority executor is wired to H3 only. Jamaa/קהלה (2222) is the source sign for elders, especially paternal elders; Nakis/שפל ראש (2221) also indicates elders. Other H3 figures remain unresolved by this exact rule. The method does not identify a named sibling or infer that an unlisted figure means younger.',
    'p182 sibling seniority'
  );
  s = enableMethod(
    s,
    'marriage.p211.dissolutionH7StateMatrix',
    'Canonical p211 marriage stability/dissolution executor is wired from H7 quality plus state. Internal figures support continuation; internal malefic adds quarrel while preserving continuity. External pure benefic gives a good marriage with possible separation; external pure malefic gives the explicit breakdown/cut-off branch. Pure benefic fixed gives the stated repair condition. Unstated mixed/mutable combinations remain unresolved.',
    'p211 marriage dissolution'
  );
  s = enableMethod(
    s,
    'missing.p249.returnAnglesJudge',
    'Canonical p249 missing-return executor is wired conservatively. The four angles H1/H4/H7/H10 must all be pure benefic and strictly internal, and H15 must give the same benefic/internal supporting testimony before the source return sign is exposed. Failure of the positive condition is not inverted into non-return. The Hebrew source clause explicitly speaks of return of males, so the executor preserves that scope and does not silently generalize it to every missing-person case.',
    'p249 missing return'
  );
  write(path, s);
}

// 2) Add exact method-scoped executors. No topic bundle, no Dhamir, no fallback.
{
  const path = 'goral-hachol/engine/kashf-canonical-executors.js';
  let s = read(path);
  const anchor = 'const P174_GENERAL_STATE_HOUSE_ROLES = Object.freeze({';
  const fn = `// Kashf v57 p194 — childhood pains and longer-term health trajectory.
function computeChildHealthTrajectoryP194(chart) {
  if (!Array.isArray(chart)) return null;
  const housesUsed = [6, 8];
  const rows = housesUsed.map((houseNumber) => {
    const entry = findCanonicalHouse(chart, houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    if (!pattern) return null;
    const classification = classifyCanonicalFigure(pattern);
    return {
      houseNumber,
      pattern,
      figureHebrew: classification.figureHebrew || entry?.hebrew || entry?.hebrewName || pattern,
      classification,
    };
  });
  if (rows.some((item) => !item)) return null;

  const byHouse = Object.fromEntries(rows.map((item) => [item.houseNumber, item]));
  const h6Malefic = byHouse[6].classification.saadNahs === 'nahs';
  const h8Class = byHouse[8].classification.saadNahs;
  const childhoodPains = h6Malefic ? true : null;
  const longTermOutcome = h8Class === 'nahs'
    ? 'low-hope'
    : h8Class === 'saad'
      ? 'improves-with-age'
      : 'unresolved';

  const h6Text = h6Malefic
    ? 'בית 6 מזיק — המקור מורה על ריבוי מכאובים בילדות.'
    : 'בית 6 אינו מזיק טהור — כלל עמ׳ 194 אינו מוסר מכאן לבדו את ההפך, ולכן אין לקבוע שאין מכאובים.';
  const h8Text = h8Class === 'nahs'
    ? 'בית 8 מזיק — התקווה בו מועטה לפי המקור.'
    : h8Class === 'saad'
      ? 'בית 8 מיטיב — ככל שיגדל ימעט חוליו וישתפר מצבו לפי המקור.'
      : 'בית 8 ממוזג או לא מסווג לענף מפורש — מגמת הבריאות בהמשך אינה מוכרעת בכלל זה.';

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 194',
    sourceText: 'אם באה הצורה ריקה, התבונן בבית השישי, שהוא בית המחלות. אם נמצאת בו צורה מזיקה, הדבר מורה על ריבוי מכאובים בילדותו. אחר כך התבונן בבית השמיני, שהוא בית המוות והאבדון. אם נמצאת בו צורה מזיקה, התקווה בו מועטה. ואם נמצאת בו צורה מיטיבה, כל כמה שיגדל — ימעט חוליו וישתפר מצבו.',
    housesUsed,
    houseResults: rows,
    childhoodPains,
    longTermOutcome,
    positive: null,
    verdictType: 'child-health-trajectory',
    outputHebrew: h6Text + ' ' + h8Text + ' שתי העדויות נשמרות בנפרד; אין ליצור מהן ציון בריאות כולל שלא נמסר במקור.',
  };
}

// Kashf v57 p182 — sign of elder/senior siblings from H3.
function computeSiblingSeniorityP182(chart) {
  if (!Array.isArray(chart)) return null;
  const h3 = findCanonicalHouse(chart, 3);
  const pattern = h3?.key || h3?.pattern || null;
  if (!pattern) return null;

  let senioritySignal = 'unresolved';
  let seniorityHebrew = 'אין סימן מפורש לגדולים בכלל זה';
  if (pattern === '2222') {
    senioritySignal = 'older-paternal-emphasis';
    seniorityHebrew = 'סימן לגדולים, ובייחוד לגדולים מצד האב';
  } else if (pattern === '2221') {
    senioritySignal = 'older';
    seniorityHebrew = 'סימן לגדולים';
  }

  const figureHebrew = classifyCanonicalFigure(pattern).figureHebrew || h3?.hebrew || h3?.hebrewName || pattern;
  const outputHebrew = senioritySignal === 'unresolved'
    ? 'בית 3 מכיל ' + figureHebrew + ' (' + pattern + '). כלל כשף v57 עמ׳ 182 נותן סימן מפורש לגדולים רק לקהלה (2222) ולשפל ראש (2221); אין להסיק מן הצורה הנוכחית שהאח צעיר יותר ואין לזהות אח מסוים מן הדעת.'
    : 'בית 3 מכיל ' + figureHebrew + ' (' + pattern + ') — ' + seniorityHebrew + '. זהו סימן ותק/בכורה בלבד, לא זיהוי של אח מסוים בשם.';

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 182',
    sourceText: 'הצורה קהלה מורה על הגדולים, ובייחוד הגדולים מצד האב. וכן שפל ראש.',
    housesUsed: [3],
    h3Pattern: pattern,
    h3FigureHebrew: figureHebrew,
    senioritySignal,
    seniorityHebrew,
    positive: null,
    verdictType: 'sibling-seniority-sign',
    outputHebrew,
  };
}

// Kashf v57 p211 — H7 marriage stability/dissolution matrix.
function computeMarriageDissolutionP211(chart) {
  if (!Array.isArray(chart)) return null;
  const h7 = findCanonicalHouse(chart, 7);
  const pattern = h7?.key || h7?.pattern || null;
  if (!pattern) return null;
  const classification = classifyCanonicalFigure(pattern);
  const fortune = classification.saadNahs;
  const state = classification.dakhalKharij;

  let sourceOutcome = 'unresolved';
  let sourceOutcomeHebrew = 'הצירוף אינו מקבל ענף מפורש בכלל זה';

  if (state === 'dakhil') {
    if (fortune === 'nahs') {
      sourceOutcome = 'stable-with-quarrel';
      sourceOutcomeHebrew = 'עגמת נפש ומריבה, אבל מצב הנישואין קבוע';
    } else {
      sourceOutcome = 'stable';
      sourceOutcomeHebrew = 'יישוב הדעת וקיום מצב הנישואין';
    }
  } else if (state === 'kharij' && fortune === 'saad') {
    sourceOutcome = 'good-but-separation-possible';
    sourceOutcomeHebrew = 'נישואין טובים, אך פרידה אפשרית מפני שהחלק אינו קבוע';
  } else if (state === 'kharij' && fortune === 'nahs') {
    sourceOutcome = 'breakdown-if-existing';
    sourceOutcomeHebrew = 'אין כאן נישואין ראויים; ואם כבר היו — החלק נחתך ונפסק';
  } else if (state === 'mujassad-dakhil' && fortune === 'saad') {
    sourceOutcome = 'fixed-benefic-repair';
    sourceOutcomeHebrew = 'צורה מיטיבה וקבועה — תיקון בית המשכב';
  }

  const figureHebrew = classification.figureHebrew || h7?.hebrew || h7?.hebrewName || pattern;
  const unresolvedNote = sourceOutcome === 'unresolved'
    ? ' המקור אינו נותן בקטע זה דין מפורש לצירוף הנוכחי, ולכן אין להשלים גירושין או יציבות מן הדעת.'
    : '';

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 211',
    sourceText: 'בבית השביעי: אם שכנו בו צורות פנימיות, הדבר מורה על יישוב הדעת ועל קיום מצב הנישואין. צורה מזיקה פנימית מורה על עגמת נפש ומריבה, אבל החלק קבוע. צורה מיטיבה חיצונית מורה על נישואין טובים אך אפשר שייפרד ממנה, מפני שהחלק אינו קבוע. צורה מזיקה חיצונית מורה שאין כאן נישואין ראויים, ואם כבר היו — החלק נחתך ונפסק. צורה מיטיבה וקבועה מורה על תיקון בית המשכב.',
    housesUsed: [7],
    h7Pattern: pattern,
    h7FigureHebrew: figureHebrew,
    classification,
    sourceOutcome,
    sourceOutcomeHebrew,
    positive: null,
    verdictType: 'marriage-stability-dissolution',
    outputHebrew: 'בית 7: ' + figureHebrew + ' (' + pattern + ') — ' + (classification.saadNahsHebrew || fortune || 'ללא סיווג') + ', ' + (classification.dakhalKharijHebrew || state || 'ללא מצב') + '. לפי כשף v57 עמ׳ 211: ' + sourceOutcomeHebrew + '.' + unresolvedNote,
  };
}

// Kashf v57 p249 — return sign for a missing/absent male from angles + judge.
function computeMissingReturnP249(chart) {
  if (!Array.isArray(chart)) return null;
  const angleHouses = [1, 4, 7, 10];
  const angleResults = angleHouses.map((houseNumber) => {
    const entry = findCanonicalHouse(chart, houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    if (!pattern) return null;
    const classification = classifyCanonicalFigure(pattern);
    return {
      houseNumber,
      pattern,
      figureHebrew: classification.figureHebrew || entry?.hebrew || entry?.hebrewName || pattern,
      classification,
      returnQuality: classification.saadNahs === 'saad' && classification.dakhalKharij === 'dakhil',
    };
  });
  if (angleResults.some((item) => !item)) return null;

  const judge = findCanonicalHouse(chart, 15);
  const judgePattern = judge?.key || judge?.pattern || null;
  if (!judgePattern) return null;
  const judgeClassification = classifyCanonicalFigure(judgePattern);
  const judgeSupportsReturn = judgeClassification.saadNahs === 'saad' && judgeClassification.dakhalKharij === 'dakhil';
  const allAnglesSupportReturn = angleResults.every((item) => item.returnQuality);
  const returnIndicatedForMale = allAnglesSupportReturn && judgeSupportsReturn;

  const outputHebrew = returnIndicatedForMale
    ? 'ארבעת היתדות — בתים 1, 4, 7 ו־10 — כולם מיטיבים פנימיים, וגם בית 15 נותן אותה עדות תומכת. לפי כשף v57 עמ׳ 249 זהו סימן לחזרת הזכרים. לשון המקור כאן מצומצמת לזכרים, ולכן אין להרחיב את הפסק אוטומטית למקרה אחר.'
    : 'תנאי החזרה החיובי של עמ׳ 249 אינו שלם: לא כל ארבעת היתדות מיטיבים פנימיים ו/או בית 15 אינו נותן אותה עדות תומכת. המקור אינו מוסר כאן שהעדר התנאי מוכיח אי־חזרה, ולכן התוצאה נשארת ללא הכרעה שלילית.';

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 249',
    sourceText: 'אם בבתים היתדיים נמצאו צורות מיטיבות פנימיות בעניין נעדר, בורח, אבדה או גניבה — הדבר מורה על חזרת הזכרים, כאשר גם המכריע מעיד לכך.',
    housesUsed: [1, 4, 7, 10, 15],
    angleHouses,
    angleResults,
    allAnglesSupportReturn,
    judgePattern,
    judgeFigureHebrew: judgeClassification.figureHebrew || judge?.hebrew || judge?.hebrewName || judgePattern,
    judgeClassification,
    judgeSupportsReturn,
    returnIndicatedForMale,
    sourceOutcome: returnIndicatedForMale ? 'male-return-indicated' : 'unresolved',
    sourceScope: 'male-return-clause',
    positive: null,
    verdictType: 'missing-return',
    outputHebrew,
  };
}

`;
  s = replaceOnce(s, anchor, fn + anchor, 'easy batch 02 executor insertion');
  s = replaceOnce(
    s,
    "const CUSTOM_EXECUTORS = Object.freeze({\n  'pregnancy.p191.childSafetyH1H6H8': computeChildSafetyP191,",
    "const CUSTOM_EXECUTORS = Object.freeze({\n  'child.p194.healthTrajectoryH6H8': computeChildHealthTrajectoryP194,\n  'siblings.p182.seniority': computeSiblingSeniorityP182,\n  'marriage.p211.dissolutionH7StateMatrix': computeMarriageDissolutionP211,\n  'missing.p249.returnAnglesJudge': computeMissingReturnP249,\n  'pregnancy.p191.childSafetyH1H6H8': computeChildSafetyP191,",
    'easy batch 02 custom executor allowlist'
  );
  write(path, s);
}

// 3) Retrieval aliases and isolation boundaries for the four methods.
{
  const path = 'goral-hachol/registry/kashf-ai-retrieval-index.js';
  let s = read(path);
  const anchor = "  'pregnancy.p191.childSafetyH1H6H8': {";
  const block = `  'child.p194.healthTrajectoryH6H8': {
    aliases: ['בריאות הילד לאורך הזמן', 'בריאות הילד כשיגדל', 'מכאובים בילדות ובריאות בהמשך', 'מצב בריאות הילד לאורך השנים'],
    doNotMixWith: ['pregnancy.p191.childSafetyH1H6H8', 'illness.p196.outcomeH15'],
    houses: [6, 8],
  },
  'siblings.p182.seniority': {
    aliases: ['מי הגדול בין האחים', 'מי הבכור בין האחים', 'סימן לאחים גדולים', 'מי הראשי בין האחים'],
    doNotMixWith: ['siblings.p182.h1h3'],
    houses: [3],
  },
  'marriage.p211.dissolutionH7StateMatrix': {
    aliases: ['האם תהיה פרידה בנישואין', 'האם הזוג יתגרש', 'יציבות הנישואין', 'פירוק הנישואין', 'האם הנישואין יישארו קיימים'],
    doNotMixWith: ['marriage.p210.generalMarriageH1H2H7H8H10Judge', 'love.p205.directLoveH1PlacementH15'],
    houses: [7],
  },
  'missing.p249.returnAnglesJudge': {
    aliases: ['האם הנעדר יחזור', 'האם הנעדר ישוב', 'חזרת הנעדר', 'האם הבורח יחזור'],
    doNotMixWith: ['travel.p244.returnH1H2H9', 'missing.p248-249.lifeH1H4H9Outcome', 'missing.p249.locationDirectionUnresolved'],
    houses: [1, 4, 7, 10, 15],
  },
`;
  s = replaceOnce(s, anchor, block + anchor, 'easy batch 02 retrieval overrides');
  write(path, s);
}

// 4) Canonical routing regression tests for all four executors.
{
  const path = '_test_kashf_canonical_routing.mjs';
  let s = read(path);
  const summary = "console.log(`Kashf canonical routing tests: ${passed} passed, ${failed} failed`);";
  const tests = `// ── Easy batch 02: p194 child health, p182 seniority, p211 dissolution, p249 missing return ---
for (const [methodId, questionId] of [
  ['child.p194.healthTrajectoryH6H8', 'q-child-health'],
  ['siblings.p182.seniority', 'q-sibling-eldest'],
  ['marriage.p211.dissolutionH7StateMatrix', 'q-divorce'],
  ['missing.p249.returnAnglesJudge', 'q-missing-return'],
]) {
  const method = getKashfMethod(methodId);
  assert(method?.runtimeAllowed === true && method?.executorStatus === 'ready', methodId + ' is runnable');
  assert(canRunKashfMethod(methodId) === true, methodId + ' canRunKashfMethod is true');
  const route = resolveKashfRouteByQuestionId(questionId);
  assert(route?.canRunKashf === true && route?.kashfMethodId === methodId, questionId + ' routes to its exact runnable method');
}

const p194Child = buildKashfReadingByQuestionId(makeP204Board({ 6: '1112', 8: '1222' }), 'q-child-health');
const p194Exec = p194Child.primaryFormula?.result?.executorResult;
assert(p194Exec?.childhoodPains === true, 'p194 pure-malefic H6 exposes childhood-pains warning');
assert(p194Exec?.longTermOutcome === 'improves-with-age', 'p194 pure-benefic H8 exposes improvement-with-age branch');
assert(p194Exec?.positive === null && p194Child.overallPositive === null, 'p194 keeps H6/H8 as separate descriptive witnesses');
assert(p194Child.primaryFormula?.sourceText === getKashfV57Knowledge('child.p194.healthTrajectoryH6H8')?.v57?.hebrewRule, 'p194 runtime sourceText comes from Hebrew v57');
const p194LowHope = buildKashfReadingByQuestionId(makeP204Board({ 6: '1222', 8: '1112' }), 'q-child-health');
assert(p194LowHope.primaryFormula?.result?.executorResult?.longTermOutcome === 'low-hope', 'p194 pure-malefic H8 exposes low-hope branch');

const p182Jamaa = buildKashfReadingByQuestionId(makeP204Board({ 3: '2222' }), 'q-sibling-eldest');
assert(p182Jamaa.primaryFormula?.result?.executorResult?.senioritySignal === 'older-paternal-emphasis', 'p182 Jamaa in H3 indicates elders with paternal emphasis');
const p182Nakis = buildKashfReadingByQuestionId(makeP204Board({ 3: '2221' }), 'q-sibling-eldest');
assert(p182Nakis.primaryFormula?.result?.executorResult?.senioritySignal === 'older', 'p182 Nakis in H3 indicates elders');
const p182Other = buildKashfReadingByQuestionId(makeP204Board({ 3: '1222' }), 'q-sibling-eldest');
assert(p182Other.primaryFormula?.result?.executorResult?.senioritySignal === 'unresolved', 'p182 unlisted H3 figure is not inverted into younger');
assert(p182Jamaa.primaryFormula?.sourceText === getKashfV57Knowledge('siblings.p182.seniority')?.v57?.hebrewRule, 'p182 runtime sourceText comes from Hebrew v57');

const p211Stable = buildKashfReadingByQuestionId(makeP204Board({ 7: '2211' }), 'q-divorce');
assert(p211Stable.primaryFormula?.result?.executorResult?.sourceOutcome === 'stable', 'p211 pure-benefic internal H7 supports continuation');
const p211Quarrel = buildKashfReadingByQuestionId(makeP204Board({ 7: '2221' }), 'q-divorce');
assert(p211Quarrel.primaryFormula?.result?.executorResult?.sourceOutcome === 'stable-with-quarrel', 'p211 malefic internal H7 gives quarrel but continuity');
const p211PossibleSeparation = buildKashfReadingByQuestionId(makeP204Board({ 7: '1222' }), 'q-divorce');
assert(p211PossibleSeparation.primaryFormula?.result?.executorResult?.sourceOutcome === 'good-but-separation-possible', 'p211 benefic external H7 gives good marriage with possible separation');
const p211Breakdown = buildKashfReadingByQuestionId(makeP204Board({ 7: '1112' }), 'q-divorce');
assert(p211Breakdown.primaryFormula?.result?.executorResult?.sourceOutcome === 'breakdown-if-existing', 'p211 malefic external H7 gives source breakdown branch');
assert(p211Stable.primaryFormula?.result?.executorResult?.positive === null && p211Stable.overallPositive === null, 'p211 does not reduce the source matrix to a forced yes/no');
assert(p211Stable.primaryFormula?.sourceText === getKashfV57Knowledge('marriage.p211.dissolutionH7StateMatrix')?.v57?.hebrewRule, 'p211 runtime sourceText comes from Hebrew v57');

const p249Return = buildKashfReadingByQuestionId(makeP204Board({ 1: '2211', 4: '2211', 7: '2211', 10: '2211', 15: '2211' }), 'q-missing-return');
const p249Exec = p249Return.primaryFormula?.result?.executorResult;
assert(p249Exec?.allAnglesSupportReturn === true && p249Exec?.judgeSupportsReturn === true, 'p249 fixture satisfies angle and judge return testimony');
assert(p249Exec?.returnIndicatedForMale === true && p249Exec?.sourceOutcome === 'male-return-indicated', 'p249 exposes source-scoped male-return sign');
assert(p249Exec?.positive === null && p249Return.overallPositive === null, 'p249 does not generalize the male clause into a universal yes/no');
const p249Incomplete = buildKashfReadingByQuestionId(makeP204Board({ 1: '1222', 4: '2211', 7: '2211', 10: '2211', 15: '2211' }), 'q-missing-return');
assert(p249Incomplete.primaryFormula?.result?.executorResult?.sourceOutcome === 'unresolved', 'p249 incomplete positive condition is not inverted into non-return');
assert(p249Return.primaryFormula?.sourceText === getKashfV57Knowledge('missing.p249.returnAnglesJudge')?.v57?.hebrewRule, 'p249 runtime sourceText comes from Hebrew v57');

for (const reading of [p194Child, p182Jamaa, p211Stable, p249Return]) {
  assert(reading.canonicalExecution?.methodsExecuted?.length === 1, 'easy batch 02 reading executes exactly one canonical method');
  assert(reading.dhamir === null && reading.canonicalExecution?.topicBundleExecuted === false && reading.canonicalExecution?.altFormulaExecuted === false, 'easy batch 02 reading runs no Dhamir/topic bundle/alternative');
}

`;
  s = replaceOnce(s, summary, tests + summary, 'easy batch 02 canonical tests');
  write(path, s);
}

// 5) AI retrieval regression tests + move the generic pending-fixture check to a still-pending method.
{
  const path = '_test_kashf_ai_retrieval_index.mjs';
  let s = read(path);
  s = replaceOnce(
    s,
    "expectTop('האם השידוך מתאים', 'marriage.p210.generalMarriageH1H2H7H8H10Judge');",
    "expectTop('האם השידוך מתאים', 'marriage.p210.generalMarriageH1H2H7H8H10Judge');\nexpectTop('בריאות הילד לאורך הזמן', 'child.p194.healthTrajectoryH6H8');\nexpectTop('מי הגדול בין האחים', 'siblings.p182.seniority');\nexpectTop('האם תהיה פרידה בנישואין', 'marriage.p211.dissolutionH7StateMatrix');\nexpectTop('האם הנעדר יחזור', 'missing.p249.returnAnglesJudge');",
    'easy batch 02 retrieval top hits'
  );
  const pendingOld = "const sourceReadyPendingResults = searchKashfAiRetrievalIndex('בריאות הוולד', { sourceReadyOnly: true, limit: 20 });\nassert(sourceReadyPendingResults.some((item) => item.kashfMethodId === 'child.p194.healthTrajectoryH6H8' || item.kashfMethodId === 'pregnancy.p191.childSafetyH1H6H8'), 'source-ready pending methods are retrievable as knowledge');";
  const records = `for (const [methodId, questionId, houses] of [
  ['child.p194.healthTrajectoryH6H8', 'q-child-health', [6,8]],
  ['siblings.p182.seniority', 'q-sibling-eldest', [3]],
  ['marriage.p211.dissolutionH7StateMatrix', 'q-divorce', [7]],
  ['missing.p249.returnAnglesJudge', 'q-missing-return', [1,4,7,10,15]],
]) {
  const record = getKashfAiRetrievalRecord(methodId);
  assert(record?.questionIds.includes(questionId), methodId + ' retrieval links ' + questionId);
  assert(record?.runtimeAllowed === true && record?.executorStatus === 'ready', methodId + ' retrieval exposes runnable state');
  assert(JSON.stringify(record?.houses) === JSON.stringify(houses), methodId + ' retrieval exposes exact operational houses');
}

const pendingKnowledgeRecord = getKashfAiRetrievalRecord('pregnancy.p191.deliveryDifficultyH1H5H15');
assert(pendingKnowledgeRecord?.runtimeAllowed === false && pendingKnowledgeRecord?.executorStatus === 'pending', 'a source-ready pending method remains knowledge-visible without runtime authorization');`;
  s = replaceOnce(s, pendingOld, records, 'easy batch 02 retrieval records and pending fixture');
  write(path, s);
}

// 6) Live AI bridge: keep a still-pending guard and add free-text/route tests for batch 02.
{
  const path = '_test_kashf_ai_retrieval_live_bridge.mjs';
  let s = read(path);
  const pendingOld = `const pending = buildKashfCanonicalAiBridge({
  questionId: 'q-child-health',
  questionText: 'מה מצב בריאות הילד לאורך הזמן?',
  board: BOARD,
});
assert(pending.resolution.kashfMethodId === 'child.p194.healthTrajectoryH6H8', 'pending route resolves to exact source-ready method');
assert(pending.resolution.executorStatus === 'pending', 'pending executor status is preserved');
assert(pending.canonicalRetrieval?.knowledgeLanguage === 'he', 'pending method may still expose Hebrew knowledge');
assert(pending.aiVerdictAllowed === false, 'retrieval cannot promote pending executor to runnable');
assert(pending.canonicalReading.canRunKashf === false, 'canonical runtime stays blocked for pending executor');`;
  const pendingNew = `const pending = buildKashfCanonicalAiBridge({
  questionId: 'q-birth-ease',
  questionText: 'האם הלידה תהיה קשה?',
  board: BOARD,
});
assert(pending.resolution.kashfMethodId === 'pregnancy.p191.deliveryDifficultyH1H5H15', 'pending route resolves to exact source-ready method');
assert(pending.resolution.executorStatus === 'pending', 'pending executor status is preserved');
assert(pending.canonicalRetrieval?.knowledgeLanguage === 'he', 'pending method may still expose Hebrew knowledge');
assert(pending.aiVerdictAllowed === false, 'retrieval cannot promote pending executor to runnable');
assert(pending.canonicalReading.canRunKashf === false, 'canonical runtime stays blocked for pending executor');`;
  s = replaceOnce(s, pendingOld, pendingNew, 'move live pending fixture off p194');

  const summary = "console.log(`Kashf AI retrieval live bridge tests: ${passed} passed, ${failed} failed`);";
  const tests = `// 12. Easy batch 02 free-text retrieval and authoritative question routes.
for (const [questionText, questionId, methodId] of [
  ['בריאות הילד לאורך הזמן', 'q-child-health', 'child.p194.healthTrajectoryH6H8'],
  ['מי הגדול בין האחים', 'q-sibling-eldest', 'siblings.p182.seniority'],
  ['האם תהיה פרידה בנישואין', 'q-divorce', 'marriage.p211.dissolutionH7StateMatrix'],
  ['האם הנעדר יחזור', 'q-missing-return', 'missing.p249.returnAnglesJudge'],
]) {
  const freeText = buildKashfCanonicalAiBridge({ questionText, board: BOARD });
  assert(freeText.resolution.kashfMethodId === methodId, questionText + ' resolves exact method');
  assert(freeText.resolution.resolutionSource === 'retrieval-index', questionText + ' resolves through retrieval index');
  const locked = buildKashfCanonicalAiBridge({ questionId, questionText: 'מה מצבי הכללי?', board: BOARD });
  assert(locked.resolution.kashfMethodId === methodId, questionId + ' remains authoritative over competing wording');
  assert(locked.resolution.resolutionSource === 'question-route', questionId + ' resolves through authoritative question route');
  assert(locked.canonicalRetrieval?.knowledgeLanguage === 'he', methodId + ' bridge exposes Hebrew operational knowledge');
  assert(locked.aiVerdictAllowed === true, methodId + ' is executable through the live bridge');
}

`;
  s = replaceOnce(s, summary, tests + summary, 'easy batch 02 live bridge tests');
  write(path, s);
}

console.log('Kashf easy batch 02 patch applied.');
