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

// 1) Activate three source-ready, board-only, non-recast methods.
{
  const path = 'goral-hachol/registry/kashf-canonical-method-registry.js';
  let s = read(path);
  s = enableMethod(
    s,
    'pregnancy.p191.deliveryDifficultyH1H5H15',
    'Canonical p191 delivery-difficulty executor is wired. H1+H5 both masculine give the explicit ease sign, with the source noting greater force when both are mutable. A fixed H5 gives the explicit difficulty sign, with H1 and H15 exposed as testimony rather than converted into an invented vote. If ease and difficulty signs coexist, the executor reports conflicting source signs instead of choosing one silently.',
    'p191 delivery difficulty'
  );
  s = enableMethod(
    s,
    'money.p180.livelihoodH10Invert',
    'Canonical p180 livelihood executor is wired. It inverts every open/closed row of H10, identifies the resulting figure, and traces its recurrence in houses 1-12. A pure-benefic result placed in an angle supports expanded livelihood; cadent placement is unfavorable. If the result occurs in both angle and cadent houses, or only in an unstated placement, the method remains unresolved rather than inventing a priority rule.',
    'p180 livelihood'
  );
  s = enableMethod(
    s,
    'missing.p248-249.lifeH1H4H9Outcome',
    'Canonical pp250-251 missing-person life-status executor is wired from the corrected v57 provenance. H1+H4+H9+H15 all pure benefic expose the explicit alive sign. H6+H7+H8+H15 all drawn from the seven source-listed death figures expose the separate severe testimony. Neither absence of the alive sign nor the severe pattern is silently converted into a certain death/alive verdict; mixed or incomplete testimony remains unresolved.',
    'pp250-251 missing life status'
  );
  write(path, s);
}

// 2) Add exact method-scoped executors.
{
  const path = 'goral-hachol/engine/kashf-canonical-executors.js';
  let s = read(path);
  const anchor = 'const P174_GENERAL_STATE_HOUSE_ROLES = Object.freeze({';
  const fn = `// Kashf v57 p191 — ease/difficulty of delivery.
function computeDeliveryDifficultyP191(chart) {
  if (!Array.isArray(chart)) return null;
  const housesUsed = [1, 5, 15];
  const rows = housesUsed.map((houseNumber) => {
    const entry = findCanonicalHouse(chart, houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    if (!pattern) return null;
    return {
      houseNumber,
      pattern,
      figureHebrew: classifyCanonicalFigure(pattern).figureHebrew || entry?.hebrew || entry?.hebrewName || pattern,
      classification: classifyCanonicalFigure(pattern),
      masculine: P191_MASCULINE_PATTERNS.has(pattern),
      mutable: P204_MUTABLE_PATTERNS.has(pattern),
      fixed: P204_FIXED_PATTERNS.has(pattern),
    };
  });
  if (rows.some((item) => !item)) return null;
  const byHouse = Object.fromEntries(rows.map((item) => [item.houseNumber, item]));

  const easeSign = byHouse[1].masculine && byHouse[5].masculine;
  const bothMutable = byHouse[1].mutable && byHouse[5].mutable;
  const difficultySign = byHouse[5].fixed;
  let sourceOutcome = 'unresolved';
  let sourceOutcomeHebrew = 'לא הוכרע בכלל זה';
  if (easeSign && difficultySign) {
    sourceOutcome = 'conflicting-source-signs';
    sourceOutcomeHebrew = 'סימן הקלות וסימן הקושי מופיעים יחד';
  } else if (easeSign) {
    sourceOutcome = 'easy';
    sourceOutcomeHebrew = bothMutable ? 'לידה קלה — עם חיזוק מפני ששתי הצורות מתהפכות' : 'לידה קלה';
  } else if (difficultySign) {
    sourceOutcome = 'difficult';
    sourceOutcomeHebrew = 'לידה קשה ואינה נשלמת בקלות';
  }

  const outputHebrew = sourceOutcome === 'unresolved'
    ? 'לפי כשף v57 עמ׳ 191, סימן הקלות דורש שהראשון והחמישי יהיו זכריים, וסימן הקושי המפורש הוא צורה קבועה בחמישי. אף אחד מן התנאים המפורשים אינו מכריע כאן; עדות בית 1 ובית 15 נשמרת ואינה נהפכת להצבעת רוב.'
    : sourceOutcome === 'conflicting-source-signs'
      ? 'בית 1 ובית 5 זכריים ולכן מופיע סימן הקלות, אך בית 5 גם קבוע ולכן מופיע סימן הקושי. המקור אינו נותן כאן כלל קדימות בין שני הסימנים; לכן אין לבחור אחד מהם מן הדעת. בית 15 נשמר כעדות נוספת בלבד.'
      : 'לפי כשף v57 עמ׳ 191: ' + sourceOutcomeHebrew + '. בית 15 מוצג כעדות המקור ואינו משמש להצבעת רוב שלא נמסרה.';

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 191; פירוט משלים עמ׳ 194',
    sourceText: 'אם הראשון והחמישי זכריים, הוולד זכר והלידה קלה ליולדת, בפרט אם הצורות מתהפכות. אם החמישי צורה קבועה, הלידה קשה ואינה נשלמת בקלות, לפי עדות הראשון והחמישה־עשר.',
    housesUsed,
    houseResults: rows,
    easeSign,
    bothMutable,
    difficultySign,
    h15Testimony: byHouse[15],
    sourceOutcome,
    sourceOutcomeHebrew,
    positive: sourceOutcome === 'easy' ? true : sourceOutcome === 'difficult' ? false : null,
    verdictType: 'delivery-difficulty',
    outputHebrew,
  };
}

// Kashf v57 p180 — invert H10 rows and judge the resulting figure's placement.
function computeLivelihoodP180(chart) {
  if (!Array.isArray(chart)) return null;
  const h10 = findCanonicalHouse(chart, 10);
  const h10Pattern = h10?.key || h10?.pattern || null;
  if (!h10Pattern || h10Pattern.length !== 4) return null;
  const resultPattern = [...h10Pattern].map((row) => row === '1' ? '2' : row === '2' ? '1' : '').join('');
  if (resultPattern.length !== 4) return null;
  const classification = classifyCanonicalFigure(resultPattern);
  const resultFigureHebrew = classification.figureHebrew || resultPattern;

  const placements = [];
  for (let houseNumber = 1; houseNumber <= 12; houseNumber += 1) {
    const entry = findCanonicalHouse(chart, houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    if (pattern === resultPattern) placements.push(houseNumber);
  }
  const angleSet = new Set([1, 4, 7, 10]);
  const cadentSet = new Set([3, 6, 9, 12]);
  const succedentSet = new Set([2, 5, 8, 11]);
  const anglePlacements = placements.filter((houseNumber) => angleSet.has(houseNumber));
  const cadentPlacements = placements.filter((houseNumber) => cadentSet.has(houseNumber));
  const succedentPlacements = placements.filter((houseNumber) => succedentSet.has(houseNumber));
  const hasAnglePlacement = anglePlacements.length > 0;
  const hasCadentPlacement = cadentPlacements.length > 0;

  let sourceOutcome = 'unresolved';
  let positive = null;
  if (hasAnglePlacement && hasCadentPlacement) {
    sourceOutcome = 'conflicting-placement';
  } else if (hasAnglePlacement && classification.saadNahs === 'saad') {
    sourceOutcome = 'expanded-livelihood';
    positive = true;
  } else if (hasCadentPlacement) {
    sourceOutcome = 'unfavorable-livelihood';
    positive = false;
  }

  let outputHebrew;
  if (sourceOutcome === 'expanded-livelihood') {
    outputHebrew = 'היפוך שורות בית 10 יצר את ' + resultFigureHebrew + ' (' + resultPattern + '), צורה מיטיבה, והיא נמצאת בבית/בתי יתד ' + anglePlacements.join(', ') + '. לפי כשף v57 עמ׳ 180: המחיה מתרחבת.';
  } else if (sourceOutcome === 'unfavorable-livelihood') {
    outputHebrew = 'היפוך שורות בית 10 יצר את ' + resultFigureHebrew + ' (' + resultPattern + '), והיא נמצאת בבית/בתים נופלים ' + cadentPlacements.join(', ') + '. לפי כשף v57 עמ׳ 180: מצב זה אינו טוב למחיה.';
  } else if (sourceOutcome === 'conflicting-placement') {
    outputHebrew = 'הצורה שנוצרה מהיפוך בית 10 נמצאת גם ביתד (' + anglePlacements.join(', ') + ') וגם בבית נופל (' + cadentPlacements.join(', ') + '). המקור אינו נותן כלל קדימות למצב כפול כזה, ולכן אין להכריע מן הדעת.';
  } else {
    const where = placements.length ? placements.join(', ') : 'ללא חזרה בבתים 1–12';
    outputHebrew = 'היפוך שורות בית 10 יצר את ' + resultFigureHebrew + ' (' + resultPattern + '). מיקומיה בלוח: ' + where + '. התנאי המפורש של צורה מיטיבה ביתד אינו מתקיים באופן חד־משמעי, וגם אין עדות נופלת יחידה שמכריעה; לכן כלל עמ׳ 180 נשאר ללא הכרעה.';
  }

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 180',
    sourceText: 'במחיה: התבונן בעשירי. כל מה שבצורותיו פתוח — סתום; וכל מה שסתום — פתח. התבונן איזו צורה יוצאת. אם הצורה עוברת לבית יתד והיא צורה מיטיבה, המחיה מתרחבת; ואם היא נופלת, אינה טובה.',
    housesUsed: [1,2,3,4,5,6,7,8,9,10,11,12],
    h10Pattern,
    resultPattern,
    resultFigureHebrew,
    classification,
    placements,
    anglePlacements,
    succedentPlacements,
    cadentPlacements,
    sourceOutcome,
    positive,
    verdictType: 'livelihood',
    outputHebrew,
  };
}

const P250_251_MISSING_DEATH_PATTERNS = new Set([
  '2222', // קהלה
  '2112', // חיבור
  '1111', // דרך
  '1221', // סוהר
  '2221', // שפל ראש
  '2122', // אדום
  '2212', // לבן
]);

// Kashf v57 pp250-251 — life-status testimony for a missing person.
function computeMissingLifeStatusP250P251(chart) {
  if (!Array.isArray(chart)) return null;
  const lifeHouses = [1, 4, 9, 15];
  const severeHouses = [6, 7, 8, 15];
  const readHouse = (houseNumber) => {
    const entry = findCanonicalHouse(chart, houseNumber);
    const pattern = entry?.key || entry?.pattern || null;
    if (!pattern) return null;
    return {
      houseNumber,
      pattern,
      figureHebrew: classifyCanonicalFigure(pattern).figureHebrew || entry?.hebrew || entry?.hebrewName || pattern,
      classification: classifyCanonicalFigure(pattern),
    };
  };
  const lifeResults = lifeHouses.map(readHouse);
  const severeResults = severeHouses.map(readHouse);
  if (lifeResults.some((item) => !item) || severeResults.some((item) => !item)) return null;

  const aliveIndicated = lifeResults.every((item) => item.classification.saadNahs === 'saad');
  const severeDeathTestimony = severeResults.every((item) => P250_251_MISSING_DEATH_PATTERNS.has(item.pattern));
  let sourceOutcome = 'unresolved';
  if (aliveIndicated && severeDeathTestimony) sourceOutcome = 'conflicting-source-signs';
  else if (aliveIndicated) sourceOutcome = 'alive-indicated';
  else if (severeDeathTestimony) sourceOutcome = 'severe-death-testimony';

  let outputHebrew;
  if (sourceOutcome === 'alive-indicated') {
    outputHebrew = 'בתים 1, 4, 9 ו־15 כולם מיטיבים. לפי כשף v57 עמ׳ 250–251: זהו סימן שהנעדר חי.';
  } else if (sourceOutcome === 'severe-death-testimony') {
    outputHebrew = 'בבתים 6, 7, 8 ו־15 נמצאות כולן צורות מן הרשימה הקשה שמונה המקור: קהלה, חיבור, דרך, סוהר, שפל ראש, אדום או לבן. זהו לפי v57 עמ׳ 250–251 סימן קשה בדין חייו של הנעדר; הפלט אינו הופך עדות זו לבדו לאישור עובדתי ודאי של מוות.';
  } else if (sourceOutcome === 'conflicting-source-signs') {
    outputHebrew = 'בלוח מתקיימים יחד סימן החיים וסימן המוות הקשה שנמסרו בעמ׳ 250–251. המקור אינו נותן כאן כלל קדימות בין העדויות, ולכן אין לבחור אחת מהן מן הדעת.';
  } else {
    outputHebrew = 'לא הושלם סימן החיים של בתים 1, 4, 9 ו־15, וגם לא הושלם צירוף ארבעת בתי עדות המוות 6, 7, 8 ו־15. אין להסיק מאי־קיום אחד התנאים את היפוכו; כלל זה נשאר ללא הכרעה.';
  }

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 250–251',
    sourceText: 'אם הראשון, הרביעי, התשיעי והסוף מיטיבים, הרי הנעדר חי. אם נמצאו בשישי, בשביעי, בשמיני ובסוף צורות המוות המנויות במקור — קהלה, חיבור, דרך, סוהר, שפל ראש, אדום או לבן — הדבר משמש עדות קשה בדין חייו של הנעדר.',
    housesUsed: [1,4,6,7,8,9,15],
    lifeHouses,
    severeHouses,
    lifeResults,
    severeResults,
    aliveIndicated,
    severeDeathTestimony,
    sourceOutcome,
    positive: sourceOutcome === 'alive-indicated' ? true : null,
    verdictType: 'missing-life-status',
    outputHebrew,
  };
}

`;
  s = replaceOnce(s, anchor, fn + anchor, 'easy batch 03 executor insertion');
  s = replaceOnce(
    s,
    "const CUSTOM_EXECUTORS = Object.freeze({\n  'child.p194.healthTrajectoryH6H8': computeChildHealthTrajectoryP194,",
    "const CUSTOM_EXECUTORS = Object.freeze({\n  'pregnancy.p191.deliveryDifficultyH1H5H15': computeDeliveryDifficultyP191,\n  'money.p180.livelihoodH10Invert': computeLivelihoodP180,\n  'missing.p248-249.lifeH1H4H9Outcome': computeMissingLifeStatusP250P251,\n  'child.p194.healthTrajectoryH6H8': computeChildHealthTrajectoryP194,",
    'easy batch 03 custom executor allowlist'
  );
  write(path, s);
}

// 3) Retrieval aliases and anti-mixing boundaries.
{
  const path = 'goral-hachol/registry/kashf-ai-retrieval-index.js';
  let s = read(path);
  const anchor = "  'child.p194.healthTrajectoryH6H8': {";
  const block = `  'pregnancy.p191.deliveryDifficultyH1H5H15': {
    aliases: ['לידה קלה או קשה', 'האם הלידה תהיה קלה', 'האם הלידה תהיה קשה', 'קלות וקושי הלידה'],
    doNotMixWith: ['pregnancy.p191.existsH5SilentEmpty', 'pregnancy.p191.genderH5', 'pregnancy.p191.childSafetyH1H6H8'],
    houses: [1, 5, 15],
  },
  'money.p180.livelihoodH10Invert': {
    aliases: ['מה מצב הפרנסה', 'האם הפרנסה תתרחב', 'מצב המחיה', 'התרחבות הפרנסה', 'דין הפרנסה השוטפת'],
    doNotMixWith: ['money.p179.sourceByIncomingHonorHouse', 'money.p181.recast25811', 'inheritance.p180.elementComposite'],
    houses: [1,2,3,4,5,6,7,8,9,10,11,12],
  },
  'missing.p248-249.lifeH1H4H9Outcome': {
    aliases: ['הנעדר חי או מת', 'האם הנעדר חי', 'מצב חייו של הנעדר', 'האם הנעדר בחיים'],
    doNotMixWith: ['missing.p249.returnAnglesJudge', 'missing.p249.locationDirectionUnresolved', 'travel.p244.returnH1H2H9'],
    houses: [1,4,6,7,8,9,15],
  },
`;
  s = replaceOnce(s, anchor, block + anchor, 'easy batch 03 retrieval overrides');
  write(path, s);
}

// 4) Tighten Question Bank descriptions where the exact canonical scope is narrower.
{
  const path = 'goral-hachol/ui/question-bank.js';
  let s = read(path);
  s = replaceOnce(
    s,
    "    desc: 'מה צפוי בלידה עצמה — קלה ומהירה, או מסובכת',",
    "    desc: 'לפי כשף עמ׳ 191: קלות/קושי לפי בתים 1, 5 ו־15; השיטה אינה מחשבת מהירות לידה או סיבוכים רפואיים',",
    'q-birth-ease description'
  );
  s = replaceOnce(
    s,
    "    desc: 'לבדיקת מצב בריאות ילד — האם יחלים, מה צפוי',",
    "    desc: 'לפי כשף עמ׳ 194: מכאובים בילדות ומגמת הבריאות ככל שהילד גדל; לא דין החלמה ממחלה נוכחית',",
    'q-child-health description'
  );
  s = replaceOnce(
    s,
    "    desc: 'מצב הפרנסה השוטפת — האם מייצרת, האם תשתפר, מה מקורותיה',",
    "    desc: 'דין עמ׳ 180: הופכים פתוח/סתום בבית 10, מזהים את הצורה שנוצרה ובודקים אם היא מיטיבה ביתד או נופלת; השיטה אינה מזהה מקור הכנסה',",
    'q-livelihood description'
  );
  s = replaceOnce(
    s,
    "    desc: 'השאלה הדחופה ביותר על נעדר — האם בחיים',",
    "    desc: 'דין עמ׳ 250–251: סימן חיים מבתים 1, 4, 9 והסוף מול עדות צורות המוות ב־6, 7, 8 והסוף; זו פסיקת מקור ולא אימות עובדתי',",
    'q-missing-alive description'
  );
  s = replaceOnce(
    s,
    "    desc: 'לאחר אישור שחי — האם ומתי יחזור הביתה',",
    "    desc: 'סימן חזרה לפי היתדות והמכריע בעמ׳ 249; הסעיף החיובי במקור נאמר במפורש על חזרת זכרים ואינו מחשב זמן',",
    'q-missing-return description'
  );
  write(path, s);
}

// 5) Canonical routing tests + update the old missing-alive hard-stop acceptance.
{
  const path = '_test_kashf_canonical_routing.mjs';
  let s = read(path);
  s = replaceOnce(
    s,
    `assertRoute('q-missing-alive', {
  ok: true,
  canRunKashf: false,
  kashfIntentId: 'missing.aliveOrDead',
  kashfMethodId: 'missing.p248-249.lifeH1H4H9Outcome',
  kashfRuntimeStatus: 'ready',
});`,
    `assertRoute('q-missing-alive', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'missing.aliveOrDead',
  kashfMethodId: 'missing.p248-249.lifeH1H4H9Outcome',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});`,
    'q-missing-alive acceptance becomes runnable'
  );
  s = replaceOnce(
    s,
    "for (const qid of ['q-promise', 'q-fear', 'q-sorcery', 'q-sea-voyage', 'q-prisoner', 'q-friends', 'q-stability', 'q-missing-alive']) {",
    "for (const qid of ['q-promise', 'q-fear', 'q-sorcery', 'q-sea-voyage', 'q-prisoner', 'q-friends', 'q-stability']) {",
    'remove q-missing-alive from hard-stop loop'
  );

  const summary = "console.log(`Kashf canonical routing tests: ${passed} passed, ${failed} failed`);";
  const tests = `// ── Easy batch 03: p191 delivery, p180 livelihood, pp250-251 missing life status ---
for (const [methodId, questionId] of [
  ['pregnancy.p191.deliveryDifficultyH1H5H15', 'q-birth-ease'],
  ['money.p180.livelihoodH10Invert', 'q-livelihood'],
  ['missing.p248-249.lifeH1H4H9Outcome', 'q-missing-alive'],
]) {
  const method = getKashfMethod(methodId);
  assert(method?.runtimeAllowed === true && method?.executorStatus === 'ready', methodId + ' is runnable');
  assert(canRunKashfMethod(methodId) === true, methodId + ' canRunKashfMethod is true');
  const route = resolveKashfRouteByQuestionId(questionId);
  assert(route?.canRunKashf === true && route?.kashfMethodId === methodId, questionId + ' routes to its exact runnable method');
}

const p191Ease = buildKashfReadingByQuestionId(makeP204Board({ 1: '1222', 5: '1122', 15: '2211' }), 'q-birth-ease');
const p191EaseExec = p191Ease.primaryFormula?.result?.executorResult;
assert(p191EaseExec?.easeSign === true && p191EaseExec?.sourceOutcome === 'easy' && p191EaseExec?.positive === true, 'p191 masculine H1+H5 gives easy-delivery source sign');
const p191MutableEase = buildKashfReadingByQuestionId(makeP204Board({ 1: '1121', 5: '1121', 15: '2211' }), 'q-birth-ease');
assert(p191MutableEase.primaryFormula?.result?.executorResult?.bothMutable === true, 'p191 mutable H1+H5 records the source strengthening clause');
const p191Difficulty = buildKashfReadingByQuestionId(makeP204Board({ 1: '2211', 5: '2212', 15: '2211' }), 'q-birth-ease');
assert(p191Difficulty.primaryFormula?.result?.executorResult?.difficultySign === true && p191Difficulty.primaryFormula?.result?.executorResult?.sourceOutcome === 'difficult', 'p191 fixed H5 gives difficulty source sign');
const p191Conflict = buildKashfReadingByQuestionId(makeP204Board({ 1: '1222', 5: '2122', 15: '2211' }), 'q-birth-ease');
assert(p191Conflict.primaryFormula?.result?.executorResult?.sourceOutcome === 'conflicting-source-signs', 'p191 does not silently rank simultaneous ease/difficulty signs');
assert(p191Ease.primaryFormula?.sourceText === getKashfV57Knowledge('pregnancy.p191.deliveryDifficultyH1H5H15')?.v57?.hebrewRule, 'p191 delivery runtime sourceText comes from Hebrew v57');

const p180Expanded = buildKashfReadingByQuestionId(makeP204Board({ 1: '1222', 10: '2111' }), 'q-livelihood');
const p180ExpandedExec = p180Expanded.primaryFormula?.result?.executorResult;
assert(p180ExpandedExec?.resultPattern === '1222', 'p180 inversion 2111 -> 1222 is exact');
assert(JSON.stringify(p180ExpandedExec?.anglePlacements) === JSON.stringify([1]), 'p180 finds derived figure in H1 angle');
assert(p180ExpandedExec?.sourceOutcome === 'expanded-livelihood' && p180ExpandedExec?.positive === true, 'p180 pure-benefic derived figure in angle expands livelihood');
const p180Cadent = buildKashfReadingByQuestionId(makeP204Board({ 3: '1222', 10: '2111' }), 'q-livelihood');
assert(p180Cadent.primaryFormula?.result?.executorResult?.sourceOutcome === 'unfavorable-livelihood', 'p180 derived figure in cadent house gives unfavorable branch');
const p180Conflict = buildKashfReadingByQuestionId(makeP204Board({ 1: '1222', 3: '1222', 10: '2111' }), 'q-livelihood');
assert(p180Conflict.primaryFormula?.result?.executorResult?.sourceOutcome === 'conflicting-placement', 'p180 angle+cadent recurrence remains unresolved instead of inventing priority');
assert(p180Expanded.primaryFormula?.sourceText === getKashfV57Knowledge('money.p180.livelihoodH10Invert')?.v57?.hebrewRule, 'p180 livelihood runtime sourceText comes from Hebrew v57');

const p250Alive = buildKashfReadingByQuestionId(makeP204Board({ 1: '2211', 4: '2211', 9: '2211', 15: '2211' }), 'q-missing-alive');
const p250AliveExec = p250Alive.primaryFormula?.result?.executorResult;
assert(p250AliveExec?.aliveIndicated === true && p250AliveExec?.sourceOutcome === 'alive-indicated', 'pp250-251 four pure-benefic life houses give alive sign');
const p250Severe = buildKashfReadingByQuestionId(makeP204Board({ 6: '2221', 7: '2221', 8: '2221', 15: '2221' }), 'q-missing-alive');
assert(p250Severe.primaryFormula?.result?.executorResult?.severeDeathTestimony === true && p250Severe.primaryFormula?.result?.executorResult?.sourceOutcome === 'severe-death-testimony', 'pp250-251 four source-listed death figures expose severe testimony');
assert(p250Severe.primaryFormula?.result?.executorResult?.positive === null, 'severe missing-person testimony is not converted to a generic certain-death boolean');
const p250Unresolved = buildKashfReadingByQuestionId(makeP204Board({ 1: '1222', 4: '1112', 9: '1222', 15: '2112' }), 'q-missing-alive');
assert(p250Unresolved.primaryFormula?.result?.executorResult?.sourceOutcome === 'unresolved', 'incomplete missing-person conditions are not inverted into an unsourced verdict');
assert(p250Alive.primaryFormula?.sourceText === getKashfV57Knowledge('missing.p248-249.lifeH1H4H9Outcome')?.v57?.hebrewRule, 'pp250-251 missing-life runtime sourceText comes from Hebrew v57');

for (const reading of [p191Ease, p180Expanded, p250Alive]) {
  assert(reading.canonicalExecution?.methodsExecuted?.length === 1, 'easy batch 03 reading executes exactly one canonical method');
  assert(reading.dhamir === null && reading.canonicalExecution?.topicBundleExecuted === false && reading.canonicalExecution?.altFormulaExecuted === false, 'easy batch 03 reading runs no Dhamir/topic bundle/alternative');
}

`;
  s = replaceOnce(s, summary, tests + summary, 'easy batch 03 canonical tests');
  write(path, s);
}

// 6) AI retrieval tests; move pending-knowledge guard to mother status.
{
  const path = '_test_kashf_ai_retrieval_index.mjs';
  let s = read(path);
  s = replaceOnce(
    s,
    "expectTop('האם הנעדר יחזור', 'missing.p249.returnAnglesJudge');",
    "expectTop('האם הנעדר יחזור', 'missing.p249.returnAnglesJudge');\nexpectTop('לידה קלה או קשה', 'pregnancy.p191.deliveryDifficultyH1H5H15');\nexpectTop('מה מצב הפרנסה', 'money.p180.livelihoodH10Invert');\nexpectTop('הנעדר חי או מת', 'missing.p248-249.lifeH1H4H9Outcome');",
    'easy batch 03 retrieval top hits'
  );
  const oldPending = "const pendingKnowledgeRecord = getKashfAiRetrievalRecord('pregnancy.p191.deliveryDifficultyH1H5H15');\nassert(pendingKnowledgeRecord?.runtimeAllowed === false && pendingKnowledgeRecord?.executorStatus === 'pending', 'a source-ready pending method remains knowledge-visible without runtime authorization');";
  const newPending = `for (const [methodId, questionId, houses] of [
  ['pregnancy.p191.deliveryDifficultyH1H5H15', 'q-birth-ease', [1,5,15]],
  ['money.p180.livelihoodH10Invert', 'q-livelihood', [1,2,3,4,5,6,7,8,9,10,11,12]],
  ['missing.p248-249.lifeH1H4H9Outcome', 'q-missing-alive', [1,4,6,7,8,9,15]],
]) {
  const record = getKashfAiRetrievalRecord(methodId);
  assert(record?.questionIds.includes(questionId), methodId + ' retrieval links ' + questionId);
  assert(record?.runtimeAllowed === true && record?.executorStatus === 'ready', methodId + ' retrieval exposes runnable state');
  assert(JSON.stringify(record?.houses) === JSON.stringify(houses), methodId + ' retrieval exposes exact operational houses');
}

const pendingKnowledgeRecord = getKashfAiRetrievalRecord('mother.p257.statusDayNight');
assert(pendingKnowledgeRecord?.runtimeAllowed === false && pendingKnowledgeRecord?.executorStatus === 'pending', 'a source-ready pending method remains knowledge-visible without runtime authorization');`;
  s = replaceOnce(s, oldPending, newPending, 'easy batch 03 retrieval records and pending fixture');
  write(path, s);
}

// 7) Live bridge: move pending guard to q-mother and add batch03 resolution tests.
{
  const path = '_test_kashf_ai_retrieval_live_bridge.mjs';
  let s = read(path);
  const pendingOld = `const pending = buildKashfCanonicalAiBridge({
  questionId: 'q-birth-ease',
  questionText: 'האם הלידה תהיה קשה?',
  board: BOARD,
});
assert(pending.resolution.kashfMethodId === 'pregnancy.p191.deliveryDifficultyH1H5H15', 'pending route resolves to exact source-ready method');
assert(pending.resolution.executorStatus === 'pending', 'pending executor status is preserved');
assert(pending.canonicalRetrieval?.knowledgeLanguage === 'he', 'pending method may still expose Hebrew knowledge');
assert(pending.aiVerdictAllowed === false, 'retrieval cannot promote pending executor to runnable');
assert(pending.canonicalReading.canRunKashf === false, 'canonical runtime stays blocked for pending executor');`;
  const pendingNew = `const pending = buildKashfCanonicalAiBridge({
  questionId: 'q-mother',
  questionText: 'מה מצב האם?',
  board: BOARD,
});
assert(pending.resolution.kashfMethodId === 'mother.p257.statusDayNight', 'pending route resolves to exact source-ready method');
assert(pending.resolution.executorStatus === 'pending', 'pending executor status is preserved');
assert(pending.canonicalRetrieval?.knowledgeLanguage === 'he', 'pending method may still expose Hebrew knowledge');
assert(pending.aiVerdictAllowed === false, 'retrieval cannot promote pending executor to runnable');
assert(pending.canonicalReading.canRunKashf === false, 'canonical runtime stays blocked for pending executor');`;
  s = replaceOnce(s, pendingOld, pendingNew, 'move live pending fixture to q-mother');

  const summary = "console.log(`Kashf AI retrieval live bridge tests: ${passed} passed, ${failed} failed`);";
  const tests = `// 13. Easy batch 03 free-text retrieval and authoritative question routes.
for (const [questionText, questionId, methodId] of [
  ['לידה קלה או קשה', 'q-birth-ease', 'pregnancy.p191.deliveryDifficultyH1H5H15'],
  ['מה מצב הפרנסה', 'q-livelihood', 'money.p180.livelihoodH10Invert'],
  ['הנעדר חי או מת', 'q-missing-alive', 'missing.p248-249.lifeH1H4H9Outcome'],
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
  s = replaceOnce(s, summary, tests + summary, 'easy batch 03 live bridge tests');
  write(path, s);
}

console.log('Kashf easy batch 03 patch applied.');
