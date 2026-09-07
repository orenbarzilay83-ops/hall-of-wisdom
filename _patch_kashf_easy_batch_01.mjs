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
    block = block.replace(/    notes: '[^\n]*',/, `    notes: '${notes}',`);
    return block;
  });
}

// 1) Activate four source-ready, non-recast methods.
{
  const path = 'goral-hachol/registry/kashf-canonical-method-registry.js';
  let s = read(path);
  s = enableMethod(
    s,
    'pregnancy.p191.childSafetyH1H6H8',
    'Canonical p191 child-safety executor is wired. H1 pure benefic gives the source safety testimony; H1 pure malefic gives fear/concern. H6+H8 both pure malefic activate the separate severe source warning that the fetus/child may emerge dead. Mixed figures are not collapsed. The severe clause is treated as a risk statement, not as a certain death verdict.',
    'p191 child safety'
  );
  s = enableMethod(
    s,
    'lifespan.p264.stagesH11H9H7',
    'Canonical p264 life-stages executor is wired as a descriptive three-stage profile only: H11 beginning of life, H9 middle, H7 end. Each stage exposes the figure and the verified p133-134 planetary attribution. It does not calculate lifespan duration and does not invent an aggregate good/bad score.',
    'p264 life stages'
  );
  s = enableMethod(
    s,
    'travel.p244.returnH1H2H9',
    'Canonical p244 traveler-return executor is wired conservatively. H1/H2/H9 all pure benefic and strictly internal support return in goodness and joy. H1/H2/H9 all pure malefic expose the source hardship / possible non-return branch, but are not converted into a certain no-return verdict. Split or mixed testimony remains unresolved. The separate H5 companion rule is not imported.',
    'p244 traveler return'
  );
  s = enableMethod(
    s,
    'marriage.p210.generalMarriageH1H2H7H8H10Judge',
    'Canonical pp210-211 general-marriage executor is wired. It preserves the source roles of H1/H2 for the man and marriage, H7/H8 for the woman, H10 for what occurs between them and H15 for the outcome; it then performs the explicit H1+H5 derivation for the final good/opposite judgment. Only source-explicit branches are asserted, and mixed testimony remains unresolved.',
    'p210 marriage suitability'
  );
  write(path, s);
}

// 2) Method-scoped executors.
{
  const path = 'goral-hachol/engine/kashf-canonical-executors.js';
  let s = read(path);
  const anchor = 'const P174_GENERAL_STATE_HOUSE_ROLES = Object.freeze({';
  const fn = `// Kashf v57 p191 — child/fetal safety.
function computeChildSafetyP191(chart) {
  if (!Array.isArray(chart)) return null;
  const housesUsed = [1, 6, 8];
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
  const h1Class = byHouse[1].classification.saadNahs;
  const severeCondition = byHouse[6].classification.saadNahs === 'nahs' && byHouse[8].classification.saadNahs === 'nahs';
  const h1Safety = h1Class === 'saad';
  const h1Fear = h1Class === 'nahs';

  let sourceOutcome = 'unresolved';
  let sourceOutcomeHebrew = 'הכלל אינו מכריע בבירור';
  if (severeCondition) {
    sourceOutcome = 'severe-risk';
    sourceOutcomeHebrew = 'אזהרת מקור חמורה: שני הבתים 6 ו־8 מזיקים';
  } else if (h1Safety) {
    sourceOutcome = 'safety';
    sourceOutcomeHebrew = 'עדות לשלום הוולד';
  } else if (h1Fear) {
    sourceOutcome = 'fear';
    sourceOutcomeHebrew = 'יש לחשוש על הוולד';
  }

  let outputHebrew;
  if (severeCondition) {
    outputHebrew = 'לפי חשיפת הסודות הנצורים v57 עמ׳ 191, בית 6 ובית 8 שניהם מזיקים. המקור מוסר שבמצב זה הוולד עלול לצאת מת. זהו ניסוח של סיכון במקור, לא פסק ודאי של מוות.';
  } else if (h1Safety) {
    outputHebrew = 'בית 1 מיטיב. לפי חשיפת הסודות הנצורים v57 עמ׳ 191, הדבר מורה שהוולד יינצל ויהיה בשלום. בתי 6 ו־8 אינם עומדים יחד בתנאי האזהרה החמורה.';
  } else if (h1Fear) {
    outputHebrew = 'בית 1 מזיק. לפי חשיפת הסודות הנצורים v57 עמ׳ 191, יש לחשוש על הוולד. בתי 6 ו־8 אינם עומדים יחד בתנאי האזהרה החמורה.';
  } else {
    outputHebrew = 'בית 1 אינו מיטיב טהור ואינו מזיק טהור לפי הסיווג הקנוני. כלל עמ׳ 191 אינו נותן כאן הכרעה חד־משמעית, ובתי 6 ו־8 אינם עומדים יחד בתנאי האזהרה החמורה.';
  }

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 191',
    sourceText: 'אם בבית הראשון נמצאת צורה מיטיבה, הוולד יינצל ויהיה בשלום. ואם נמצאת בו צורה מזיקה, יש לחשוש עליו. ואם בשישי ובשמיני נמצאות צורות מזיקות, הוולד עלול לצאת מת.',
    housesUsed,
    houseResults: rows,
    h1Safety,
    h1Fear,
    severeCondition,
    sourceOutcome,
    sourceOutcomeHebrew,
    positive: h1Safety && !severeCondition ? true : null,
    verdictType: 'child-safety',
    outputHebrew,
  };
}

// Kashf v57 p264 — beginning/middle/end of life by planetary figure.
function computeLifespanStagesP264(chart) {
  if (!Array.isArray(chart)) return null;
  const stageDefs = [
    { houseNumber: 11, stage: 'beginning', stageHebrew: 'ראשית החיים' },
    { houseNumber: 9, stage: 'middle', stageHebrew: 'אמצע החיים' },
    { houseNumber: 7, stage: 'end', stageHebrew: 'סוף החיים' },
  ];

  const stages = stageDefs.map((def) => {
    const entry = findCanonicalHouse(chart, def.houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    if (!pattern) return null;
    const planetRecord = FIGURE_PLANET_MAP.find((record) => Array.isArray(record.patterns) && record.patterns.includes(pattern)) || null;
    return {
      ...def,
      pattern,
      figureHebrew: entry?.hebrew || entry?.hebrewName || classifyCanonicalFigure(pattern).figureHebrew || pattern,
      planetHebrew: planetRecord?.planet || null,
      planetArabic: planetRecord?.arabicName || null,
      planetSourceStatus: planetRecord?.sourceStatus || null,
      planetResolved: Boolean(planetRecord),
    };
  });
  if (stages.some((item) => !item)) return null;

  const detail = stages.map((item) => {
    const planet = item.planetResolved ? item.planetHebrew : 'שיוך כוכבי לא מוכרע במפה המאומתת';
    return item.stageHebrew + ': ' + item.figureHebrew + ' (' + item.pattern + ') — ' + planet;
  }).join('; ');

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 264; שיוכי כוכבים עמ׳ 133–134',
    sourceText: 'בדין החיים: הבית האחד־עשר מורה על ראשית החיים; התשיעי על האמצע; והשביעי על הסוף. דון לפי צורות הכוכבים המופיעות בבתים.',
    housesUsed: [11, 9, 7],
    stages,
    aggregationRule: 'none-source-explicit',
    positive: null,
    verdictType: 'lifespan-stages',
    outputHebrew: 'לפי חשיפת הסודות הנצורים v57 עמ׳ 264: ' + detail + '. שיטה זו מתארת שלושה שלבים לפי הכוכב של הצורה בכל בית; היא אינה מחשבת את מספר שנות החיים.',
  };
}

// Kashf v57 p244 — traveler return.
function computeTravelerReturnP244(chart) {
  if (!Array.isArray(chart)) return null;
  const housesUsed = [1, 2, 9];
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
      beneficIncoming: classification.saadNahs === 'saad' && classification.dakhalKharij === 'dakhil',
      pureMalefic: classification.saadNahs === 'nahs',
    };
  });
  if (rows.some((item) => !item)) return null;

  const allBeneficIncoming = rows.every((item) => item.beneficIncoming);
  const allPureMalefic = rows.every((item) => item.pureMalefic);
  let sourceOutcome = 'unresolved';
  let outputHebrew;
  if (allBeneficIncoming) {
    sourceOutcome = 'good-return';
    outputHebrew = 'בתים 1, 2 ו־9 כולם נושאים צורות מיטיבות פנימיות. לפי חשיפת הסודות הנצורים v57 עמ׳ 244, הדבר תומך בכך שהנוסע ישוב אל ארצו בטוב ובשמחה.';
  } else if (allPureMalefic) {
    sourceOutcome = 'hardship-possible-no-return';
    outputHebrew = 'בתים 1, 2 ו־9 כולם מזיקים. לפי חשיפת הסודות הנצורים v57 עמ׳ 244, הנוסע יתייגע במסעו ולעיתים לא ישוב. המקור אינו הופך את הענף הזה לפסק ודאי של אי־חזרה.';
  } else {
    outputHebrew = 'העדות בבתים 1, 2 ו־9 מפוצלת או ממוזגת. כדי לא להמציא כלל רוב שאינו במקור, שיטת עמ׳ 244 נשארת כאן ללא הכרעה חד־משמעית.';
  }

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 244',
    sourceText: 'כלל לנוסע: התבונן בראשון, בשני ובתשיעי. אם נמצאו בהם צורות מיטיבות המורות על כניסה, ובפרט במקומות הראויים, ישוב אל ארצו בטוב ובשמחה. ואם נמצאו בהם צורות מזיקות, יתייגע במסעו, ולעיתים לא ישוב.',
    housesUsed,
    houseResults: rows,
    allBeneficIncoming,
    allPureMalefic,
    sourceOutcome,
    returnIndicated: allBeneficIncoming ? true : null,
    positive: allBeneficIncoming ? true : null,
    verdictType: 'traveler-return',
    outputHebrew,
  };
}

// Kashf v57 pp210-211 — general marriage judgment.
function computeMarriageSuitabilityP210(chart) {
  if (!Array.isArray(chart)) return null;
  const housesUsed = [1, 2, 5, 7, 8, 10, 15];
  const patterns = {};
  const houseResults = housesUsed.map((houseNumber) => {
    const entry = findCanonicalHouse(chart, houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    if (!pattern) return null;
    patterns[houseNumber] = pattern;
    const classification = classifyCanonicalFigure(pattern);
    return {
      houseNumber,
      pattern,
      figureHebrew: classification.figureHebrew || entry?.hebrew || entry?.hebrewName || pattern,
      classification,
    };
  });
  if (houseResults.some((item) => !item)) return null;

  const byHouse = Object.fromEntries(houseResults.map((item) => [item.houseNumber, item]));
  const manGoodToWoman = byHouse[1].classification.saadNahs === 'saad' ? true : null;
  const womanBetterThanMan = byHouse[1].classification.saadNahs === 'nahs' && byHouse[7].classification.saadNahs === 'saad' ? true : null;
  const judgeGood = byHouse[15].classification.saadNahs === 'saad' ? true : null;

  const derived = combineRamlFigures(patterns[1], patterns[5]);
  const finalPattern = derived.resultPattern;
  const finalClassification = classifyCanonicalFigure(finalPattern);
  const finalOutcome = finalClassification.saadNahs === 'saad'
    ? 'good'
    : finalClassification.saadNahs === 'nahs'
      ? 'opposite-bad'
      : 'unresolved';
  const positive = finalOutcome === 'good' ? true : finalOutcome === 'opposite-bad' ? false : null;

  const sourceSignals = [];
  if (manGoodToWoman) sourceSignals.push('בית 1 מיטיב — האיש טוב לה ומיטיב עמה');
  if (womanBetterThanMan) sourceSignals.push('בית 1 מזיק ובית 7 מיטיב — היא טובה ממנו לפי לשון המקור');
  if (judgeGood) sourceSignals.push('בית 15 מיטיב — אחרית עניינם טובה, יפה ושמחה');
  sourceSignals.push('חיבור בית 1 ובית 5 יצר ' + (finalClassification.figureHebrew || finalPattern) + ' (' + finalPattern + ') — ' + (finalClassification.saadNahsHebrew || 'ללא סיווג'));

  let outputHebrew = 'לפי חשיפת הסודות הנצורים v57 עמ׳ 210–211: ' + sourceSignals.join('; ') + '. ';
  if (finalOutcome === 'good') {
    outputHebrew += 'הצורה שנולדה מן הראשון והחמישי מיטיבה, ולכן הדין הסופי של ההולדה הוא לטוב.';
  } else if (finalOutcome === 'opposite-bad') {
    outputHebrew += 'הצורה שנולדה מן הראשון והחמישי מזיקה, ולכן הדין הסופי הוא להפך מן הטוב.';
  } else {
    outputHebrew += 'הצורה שנולדה מן הראשון והחמישי ממוזגת או בלתי מוכרעת; אין לכפות עליה פסק טוב/רע חד־משמעי.';
  }

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 210–211',
    sourceText: 'עשה את הבית הראשון והשני לסימני האיש והנישואין, ואת הבית השביעי והשמיני לסימני האישה. הבית העשירי מורה על מה שיתרחש ביניהם, והדיין מורה על אחרית עניינם. אם הראשון מיטיב, האיש טוב לה ומיטיב עמה. אם הראשון מזיק והשביעי מיטיב, הרי היא טובה ממנו. אם המכריע מיטיב, אחרית עניינם טובה, יפה ושמחה. לאחר מכן הוצא צורה מן הראשון והחמישי, ודון במה שיצא, לטוב או להפך.',
    housesUsed,
    houseResults,
    roles: {
      manAndMarriage: [1, 2],
      woman: [7, 8],
      betweenThem: 10,
      judge: 15,
      finalDerivation: [1, 5],
    },
    manGoodToWoman,
    womanBetterThanMan,
    judgeGood,
    finalPattern,
    finalFigureHebrew: finalClassification.figureHebrew || null,
    finalClassification,
    finalOutcome,
    positive,
    verdictType: 'marriage-suitability',
    outputHebrew,
  };
}

`;
  s = replaceOnce(s, anchor, fn + anchor, 'easy batch executor insertion');
  s = replaceOnce(
    s,
    "const CUSTOM_EXECUTORS = Object.freeze({\n  'general.p174.h1h2h4h7h10h15': computeGeneralStateP174,",
    "const CUSTOM_EXECUTORS = Object.freeze({\n  'pregnancy.p191.childSafetyH1H6H8': computeChildSafetyP191,\n  'lifespan.p264.stagesH11H9H7': computeLifespanStagesP264,\n  'travel.p244.returnH1H2H9': computeTravelerReturnP244,\n  'marriage.p210.generalMarriageH1H2H7H8H10Judge': computeMarriageSuitabilityP210,\n  'general.p174.h1h2h4h7h10h15': computeGeneralStateP174,",
    'easy batch custom executor allowlist'
  );
  write(path, s);
}

// 3) Tighten user-facing descriptions to the actual source scope.
{
  const path = 'goral-hachol/ui/question-bank.js';
  let s = read(path);
  s = replaceOnce(
    s,
    "    desc: 'לשאלת הישרדות ובריאות הנולד בשלב מיד לאחר הלידה',",
    "    desc: 'דין כשף עמ׳ 191: בית 1 לשלום/חשש על הוולד; בתי 6 ו־8 יחד נותנים את אזהרת המקור החמורה',",
    'q-child-survive source-safe description'
  );
  s = replaceOnce(
    s,
    "    desc: 'ניתוח שלושת שלבי החיים: ילדות, בגרות, זקנה — מה כל שלב מביא',",
    "    desc: 'כשף עמ׳ 264: בית 11 לראשית החיים, 9 לאמצע ו־7 לסוף; הדין לפי הכוכב של הצורה בכל בית — לא חישוב שנות חיים',",
    'q-lifespan-stages source-safe description'
  );
  s = replaceOnce(
    s,
    "    desc: 'לנוסע שכבר יצא לדרך — האם ישוב הביתה',",
    "    desc: 'כשף עמ׳ 244: חזרת נוסע שכבר יצא לדרך לפי בתים 1, 2 ו־9; השיטה אינה מחשבת מועד חזרה',",
    'q-traveler-return source-safe description'
  );
  s = replaceOnce(
    s,
    "    desc: 'לבדיקת שידוך: האם הזוג מתאים, מה סיכויי הנישואין',",
    "    desc: 'דין הנישואין של כשף עמ׳ 210–211: בתי האיש, האישה, מה שביניהם, הדיין והולדת 1+5 לפסק הסופי',",
    'q-marriage-fit source-safe description'
  );
  write(path, s);
}

// 4) AI retrieval aliases and isolation boundaries.
{
  const path = 'goral-hachol/registry/kashf-ai-retrieval-index.js';
  let s = read(path);
  const anchor = "  'general.p174.h1h2h4h7h10h15': {";
  const block = `  'pregnancy.p191.childSafetyH1H6H8': {
    aliases: ['האם הוולד יהיה בשלום', 'האם יש חשש לוולד', 'מה מצב שלום הוולד', 'האם הוולד יחיה', 'בטיחות הוולד'],
    doNotMixWith: ['pregnancy.p191.existsH5SilentEmpty', 'pregnancy.p191.genderH5', 'pregnancy.p191.deliveryDifficultyH1H5H15', 'child.p194.healthTrajectoryH6H8'],
    houses: [1, 6, 8],
  },
  'lifespan.p264.stagesH11H9H7': {
    aliases: ['שלבי החיים', 'ראשית אמצע וסוף החיים', 'איך יהיו שלבי החיים', 'ילדות בגרות זקנה', 'מה מצב שלבי החיים'],
    doNotMixWith: ['lifespan.p178.elementCountToHouse', 'general.p174.h1h2h4h7h10h15'],
    houses: [11, 9, 7],
  },
  'travel.p244.returnH1H2H9': {
    aliases: ['האם הנוסע יחזור', 'האם ישוב מהמסע', 'חזרת הנוסע', 'האם יחזור הביתה מהנסיעה', 'האם ישוב לארצו'],
    doNotMixWith: ['travel.p238.assemble1359', 'travel.p238.timeSelectionH9H4', 'missing.p249.returnAnglesJudge'],
    houses: [1, 2, 9],
  },
  'marriage.p210.generalMarriageH1H2H7H8H10Judge': {
    aliases: ['האם השידוך מתאים', 'האם הזוגיות מתאימה', 'מה יהיה בנישואין', 'התאמת נישואין', 'סיכויי הנישואין'],
    doNotMixWith: ['marriage.p204.previousStatusH7inH10', 'marriage.p204.dowryH8', 'love.p206.womanFavorH7H11ThenH5', 'desire.p206.querentWantsH7H11ThenH5'],
    houses: [1, 2, 5, 7, 8, 10, 15],
  },
`;
  s = replaceOnce(s, anchor, block + anchor, 'easy batch retrieval overrides');
  write(path, s);
}

// 5) Canonical routing regressions.
{
  const path = '_test_kashf_canonical_routing.mjs';
  let s = read(path);
  const summary = "console.log(`Kashf canonical routing tests: ${passed} passed, ${failed} failed`);";
  const tests = `// ── Easy batch 01: p191 child safety, p264 stages, p244 return, p210 marriage ---
for (const [methodId, questionId] of [
  ['pregnancy.p191.childSafetyH1H6H8', 'q-child-survive'],
  ['lifespan.p264.stagesH11H9H7', 'q-lifespan-stages'],
  ['travel.p244.returnH1H2H9', 'q-traveler-return'],
  ['marriage.p210.generalMarriageH1H2H7H8H10Judge', 'q-marriage-fit'],
]) {
  const method = getKashfMethod(methodId);
  assert(method?.runtimeAllowed === true && method?.executorStatus === 'ready', methodId + ' is runnable');
  assert(canRunKashfMethod(methodId) === true, methodId + ' canRunKashfMethod is true');
  const route = resolveKashfRouteByQuestionId(questionId);
  assert(route?.canRunKashf === true && route?.kashfMethodId === methodId, questionId + ' routes to its exact runnable method');
}

const p191Safety = buildKashfReadingByQuestionId(makeP204Board({ 1: '1222', 6: '1222', 8: '1222' }), 'q-child-survive');
const p191SafetyExec = p191Safety.primaryFormula?.result?.executorResult;
assert(p191SafetyExec?.sourceOutcome === 'safety' && p191SafetyExec?.positive === true, 'p191 pure-benefic H1 gives source safety testimony');
assert(p191Safety.primaryFormula?.sourceText === getKashfV57Knowledge('pregnancy.p191.childSafetyH1H6H8')?.v57?.hebrewRule, 'p191 runtime sourceText comes from Hebrew v57');
const p191Severe = buildKashfReadingByQuestionId(makeP204Board({ 1: '1222', 6: '1112', 8: '1112' }), 'q-child-survive');
assert(p191Severe.primaryFormula?.result?.executorResult?.severeCondition === true, 'p191 H6+H8 pure malefic activates the severe source warning');
assert(p191Severe.primaryFormula?.result?.executorResult?.positive === null, 'p191 severe warning is not converted into a certain death verdict');
const p191Fear = buildKashfReadingByQuestionId(makeP204Board({ 1: '1112', 6: '1222', 8: '1222' }), 'q-child-survive');
assert(p191Fear.primaryFormula?.result?.executorResult?.sourceOutcome === 'fear', 'p191 pure-malefic H1 gives fear/concern branch');

const p264Stages = buildKashfReadingByQuestionId(makeP204Board({ 11: '2211', 9: '1222', 7: '2122' }), 'q-lifespan-stages');
const p264Exec = p264Stages.primaryFormula?.result?.executorResult;
assert(JSON.stringify(p264Exec?.housesUsed) === JSON.stringify([11,9,7]), 'p264 uses H11/H9/H7 in source order');
assert(p264Exec?.stages?.length === 3 && p264Exec.stages.every((stage) => stage.planetResolved === true), 'p264 resolves verified planetary attribution for each fixture stage');
assert(p264Exec?.positive === null && p264Stages.overallPositive === null, 'p264 remains descriptive and does not invent a lifespan yes/no score');
assert(p264Stages.primaryFormula?.sourceText === getKashfV57Knowledge('lifespan.p264.stagesH11H9H7')?.v57?.hebrewRule, 'p264 runtime sourceText comes from Hebrew v57');

const p244Return = buildKashfReadingByQuestionId(makeP204Board({ 1: '2211', 2: '2211', 9: '2211' }), 'q-traveler-return');
const p244Exec = p244Return.primaryFormula?.result?.executorResult;
assert(p244Exec?.allBeneficIncoming === true && p244Exec?.sourceOutcome === 'good-return' && p244Exec?.positive === true, 'p244 all pure-benefic internal houses support good return');
const p244Hard = buildKashfReadingByQuestionId(makeP204Board({ 1: '1112', 2: '1112', 9: '1112' }), 'q-traveler-return');
assert(p244Hard.primaryFormula?.result?.executorResult?.sourceOutcome === 'hardship-possible-no-return', 'p244 all pure-malefic houses expose hardship/possible non-return branch');
assert(p244Hard.primaryFormula?.result?.executorResult?.positive === null, 'p244 hardship branch is not converted into certain no-return');
assert(p244Return.primaryFormula?.sourceText === getKashfV57Knowledge('travel.p244.returnH1H2H9')?.v57?.hebrewRule, 'p244 runtime sourceText comes from Hebrew v57');

const p210Marriage = buildKashfReadingByQuestionId(makeP204Board({ 1: '1111', 5: '2111', 7: '1222', 15: '1222' }), 'q-marriage-fit');
const p210Exec = p210Marriage.primaryFormula?.result?.executorResult;
assert(p210Exec?.finalPattern === '1222', 'p210 H1+H5 fixture derives expected final figure');
assert(p210Exec?.finalOutcome === 'good' && p210Exec?.positive === true, 'p210 benefic H1+H5 result gives good final judgment');
assert(p210Exec?.judgeGood === true, 'p210 benefic judge exposes the explicit good-outcome testimony');
assert(p210Marriage.primaryFormula?.sourceText === getKashfV57Knowledge('marriage.p210.generalMarriageH1H2H7H8H10Judge')?.v57?.hebrewRule, 'p210 runtime sourceText comes from Hebrew v57');

for (const reading of [p191Safety, p264Stages, p244Return, p210Marriage]) {
  assert(reading.canonicalExecution?.methodsExecuted?.length === 1, 'easy batch reading executes exactly one canonical method');
  assert(reading.dhamir === null && reading.canonicalExecution?.topicBundleExecuted === false && reading.canonicalExecution?.altFormulaExecuted === false, 'easy batch reading runs no Dhamir/topic bundle/alternative');
}

`;
  s = replaceOnce(s, summary, tests + summary, 'easy batch canonical tests');
  write(path, s);
}

// 6) AI retrieval-index regressions.
{
  const path = '_test_kashf_ai_retrieval_index.mjs';
  let s = read(path);
  const anchor = "expectTop('מה מצבי הכללי', 'general.p174.h1h2h4h7h10h15');";
  const extra = `expectTop('האם הוולד יהיה בשלום', 'pregnancy.p191.childSafetyH1H6H8');
expectTop('שלבי החיים', 'lifespan.p264.stagesH11H9H7');
expectTop('האם הנוסע יחזור', 'travel.p244.returnH1H2H9');
expectTop('האם השידוך מתאים', 'marriage.p210.generalMarriageH1H2H7H8H10Judge');`;
  s = replaceOnce(s, anchor, anchor + '\n' + extra, 'easy batch retrieval top hits');

  const recordAnchor = "const sourceReadyPendingResults = searchKashfAiRetrievalIndex('בריאות הוולד', { sourceReadyOnly: true, limit: 20 });";
  const recordTests = `for (const [methodId, questionId, houses] of [
  ['pregnancy.p191.childSafetyH1H6H8', 'q-child-survive', [1,6,8]],
  ['lifespan.p264.stagesH11H9H7', 'q-lifespan-stages', [11,9,7]],
  ['travel.p244.returnH1H2H9', 'q-traveler-return', [1,2,9]],
  ['marriage.p210.generalMarriageH1H2H7H8H10Judge', 'q-marriage-fit', [1,2,5,7,8,10,15]],
]) {
  const record = getKashfAiRetrievalRecord(methodId);
  assert(record?.questionIds.includes(questionId), methodId + ' retrieval links ' + questionId);
  assert(record?.runtimeAllowed === true && record?.executorStatus === 'ready', methodId + ' retrieval exposes runnable state');
  assert(JSON.stringify(record?.houses) === JSON.stringify(houses), methodId + ' retrieval exposes exact operational houses');
}

`;
  s = replaceOnce(s, recordAnchor, recordTests + recordAnchor, 'easy batch retrieval records');
  write(path, s);
}

// 7) AI live-bridge regressions.
{
  const path = '_test_kashf_ai_retrieval_live_bridge.mjs';
  let s = read(path);
  const summary = "console.log(`Kashf AI retrieval live bridge tests: ${passed} passed, ${failed} failed`);";
  const tests = `// 11. Easy batch 01 free-text retrieval and authoritative question routes.
for (const [questionText, questionId, methodId] of [
  ['האם הוולד יהיה בשלום', 'q-child-survive', 'pregnancy.p191.childSafetyH1H6H8'],
  ['שלבי החיים', 'q-lifespan-stages', 'lifespan.p264.stagesH11H9H7'],
  ['האם הנוסע יחזור', 'q-traveler-return', 'travel.p244.returnH1H2H9'],
  ['האם השידוך מתאים', 'q-marriage-fit', 'marriage.p210.generalMarriageH1H2H7H8H10Judge'],
]) {
  const freeText = buildKashfCanonicalAiBridge({ questionText, board: BOARD });
  assert(freeText.resolution.kashfMethodId === methodId, questionText + ' resolves exact method');
  assert(freeText.resolution.resolutionSource === 'retrieval-index', questionText + ' resolves through retrieval index');
  const locked = buildKashfCanonicalAiBridge({ questionId, questionText: 'מה מצבי הכללי?', board: BOARD });
  assert(locked.resolution.kashfMethodId === methodId, questionId + ' remains authoritative over competing wording');
  assert(locked.resolution.resolutionSource === 'question-route', questionId + ' resolves through authoritative question route');
  assert(locked.canonicalRetrieval?.knowledgeLanguage === 'he', methodId + ' bridge exposes Hebrew operational knowledge');
}

`;
  s = replaceOnce(s, summary, tests + summary, 'easy batch live bridge tests');
  write(path, s);
}

console.log('Kashf easy batch 01 patch applied.');
