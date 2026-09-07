#!/usr/bin/env node
import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, value) { fs.writeFileSync(path, value); }
function replaceOnce(text, needle, replacement, label) {
  const first = text.indexOf(needle);
  if (first < 0) throw new Error('Missing patch anchor: ' + label);
  if (text.indexOf(needle, first + needle.length) >= 0) throw new Error('Non-unique patch anchor: ' + label);
  return text.slice(0, first) + replacement + text.slice(first + needle.length);
}
function patchMethodBlock(text, methodId, mutate) {
  const marker = "  '" + methodId + "': method({";
  const start = text.indexOf(marker);
  if (start < 0) throw new Error('Missing method block: ' + methodId);
  const end = text.indexOf('\n  }),', start);
  if (end < 0) throw new Error('Missing method block end: ' + methodId);
  const blockEnd = end + '\n  }),'.length;
  const oldBlock = text.slice(start, blockEnd);
  const newBlock = mutate(oldBlock);
  if (oldBlock === newBlock) throw new Error('Method block unchanged: ' + methodId);
  return text.slice(0, start) + newBlock + text.slice(blockEnd);
}
function patchKnowledgeBlock(text, methodId, mutate) {
  const marker = "  '" + methodId + "': knowledge({";
  const start = text.indexOf(marker);
  if (start < 0) throw new Error('Missing knowledge block: ' + methodId);
  const end = text.indexOf('\n  }),', start);
  if (end < 0) throw new Error('Missing knowledge block end: ' + methodId);
  const blockEnd = end + '\n  }),'.length;
  const oldBlock = text.slice(start, blockEnd);
  const newBlock = mutate(oldBlock);
  if (oldBlock === newBlock) throw new Error('Knowledge block unchanged: ' + methodId);
  return text.slice(0, start) + newBlock + text.slice(blockEnd);
}

const methodId = 'clothing.p264-265.luck';

const registryPath = 'goral-hachol/registry/kashf-canonical-method-registry.js';
let registry = read(registryPath);
registry = patchMethodBlock(registry, methodId, (block) => {
  let out = block;
  out = replaceOnce(out, '    runtimeAllowed: false,', '    runtimeAllowed: true,', 'clothing runtimeAllowed');
  out = replaceOnce(out, "    executionKind: 'legacy-function',", "    executionKind: 'custom-engine',", 'clothing executionKind');
  out = replaceOnce(out, "    executorStatus: 'pending',", "    executorStatus: 'ready',", 'clothing executorStatus');
  const noteLine = out.split('\n').find((line) => line.trim().startsWith("notes: '"));
  if (noteLine) {
    out = out.replace(noteLine, "    notes: 'Canonical clothing-luck executor is wired from v57 pp264-265 using only the explicit fortune clauses: H5+H11 both pure benefic => luck in clothing; both pure malefic => no luck in clothing; pure malefic H10 separately indicates no luck in royal clothing/honor from superiors. Mixed/split testimony remains unresolved. The legacy helper is not reused because it collapses mixed figures and invents a partial branch. Fixed/mutable persistence and clothing-color subrules are excluded from this luck verdict.',");
  }
  return out;
});
write(registryPath, registry);

const knowledgePath = 'goral-hachol/registry/kashf-v57-knowledge-registry.js';
let knowledge = read(knowledgePath);
knowledge = patchKnowledgeBlock(knowledge, methodId, (block) => {
  let out = block;
  const ruleLine = out.split('\n').find((line) => line.trim().startsWith('hebrewRule:'));
  if (!ruleLine) throw new Error('Missing clothing hebrewRule');
  out = out.replace(ruleLine, "    hebrewRule: 'בדין מזל הלבוש: אם בחמישי ובאחד־עשר יש צורות מיטיבות, יש לו מזל בלבושים. אם בעשירי צורה מזיקה, אין לו מזל בלבוש המלכים או בכיבוד הבא מצד בעלי מעלה. אם בחמישי ובאחד־עשר צורות מזיקות, אין לו מזל בלבוש.',");
  const verificationLine = out.split('\n').find((line) => line.trim().startsWith('verificationNotes:'));
  const verificationText = "    verificationNotes: 'הסריקה הערבית בעמ׳ 265 מאשרת את שלושת ענפי המזל. היא גם מבהירה שהדין על בגד שנשאר עד שיקרע שייך לצורה קבועה, ואילו הצורה המתהפכת אינה עומדת על לבוש אחד; ב-v57 משפט הקביעות התמזג בטעות עם ענף המזיק, ולכן שני סעיפי הקביעות/התהפכות אינם מופעלים במנוע מזל זה. טבלת הצבעים נבדקה מחדש: عطارد/כוכב = צבעוני-מגוון; הירח וראש התלי = לבן; זנב התלי = אפרפר/עכור.',";
  if (verificationLine) out = out.replace(verificationLine, verificationText);
  else out = out.replace(/(    arabicVerificationPages: \[[^\]]*\],)/, '$1\n' + verificationText);
  const noteLine = out.split('\n').find((line) => line.trim().startsWith("notes: '"));
  const noteText = "    notes: 'הפסק הקנוני עונה על מזל בלבוש, לא על שאלת איזה צבע מביא מזל. צבעי הלבוש, וכן דין צורה קבועה/מתהפכת, נשמרים כחומר ידע נפרד ואינם מצביעים לתוך הכרעת המזל.',";
  if (noteLine) out = out.replace(noteLine, noteText);
  else out = out.replace('\n  })', '\n' + noteText + '\n  })');
  return out;
});
write(knowledgePath, knowledge);

const questionBankPath = 'goral-hachol/ui/question-bank.js';
let questionBank = read(questionBankPath);
questionBank = replaceOnce(
  questionBank,
  "    label: 'מה מזלי בלבוש?',\n    desc: 'לקוח הרוצה לדעת איזה צבע/סוג לבוש מביא לו מזל',",
  "    label: 'מה מזלי בלבוש?',\n    desc: 'לבדיקת מזל בלבושים לפי בתים 5 ו־11, עם עדות נפרדת של בית 10 לגבי לבוש מלכים וכיבוד מבעלי מעלה',",
  'q-clothing-lucky source-safe wording'
);
write(questionBankPath, questionBank);

const executorsPath = 'goral-hachol/engine/kashf-canonical-executors.js';
let executors = read(executorsPath);
const executorBlock = `

// Kashf v57 pp264-265 — clothing luck.
// This executor is intentionally narrower than the old legacy helper:
// - H5+H11 both pure saad => luck in clothing.
// - H5+H11 both pure nahs => no luck in clothing.
// - H10 pure nahs => separate no-luck indication for royal clothing/honor.
// - Mixed or split H5/H11 testimony remains unresolved.
// Fixed/mutable garment persistence and color indications are knowledge-only
// here; they are not converted into the clothing-luck verdict.
function computeClothingLuckP265(chart) {
  if (!Array.isArray(chart)) return null;
  const h5 = findCanonicalHouse(chart, 5);
  const h10 = findCanonicalHouse(chart, 10);
  const h11 = findCanonicalHouse(chart, 11);
  const h5Pattern = h5?.key || h5?.pattern || null;
  const h10Pattern = h10?.key || h10?.pattern || null;
  const h11Pattern = h11?.key || h11?.pattern || null;
  if (!h5Pattern || !h10Pattern || !h11Pattern) return null;

  const h5Classification = classifyCanonicalFigure(h5Pattern);
  const h10Classification = classifyCanonicalFigure(h10Pattern);
  const h11Classification = classifyCanonicalFigure(h11Pattern);
  const h5Quality = h5Classification.saadNahs;
  const h10Quality = h10Classification.saadNahs;
  const h11Quality = h11Classification.saadNahs;

  const bothBenefic = h5Quality === 'saad' && h11Quality === 'saad';
  const bothMalefic = h5Quality === 'nahs' && h11Quality === 'nahs';
  const royalClothingNoLuck = h10Quality === 'nahs';

  let clothingLuck = null;
  let sourceOutcome = 'unresolved';
  let sourceOutcomeHebrew = 'לא הוכרע מזל הלבוש לפי כלל זה';
  let positive = null;
  let outputHebrew;

  if (bothBenefic) {
    clothingLuck = true;
    sourceOutcome = 'clothing-luck';
    sourceOutcomeHebrew = 'יש לו מזל בלבושים';
    positive = true;
    outputHebrew = 'לפי חשיפת הסודות הנצורים v57 עמ׳ 264–265, בבית החמישי ובבית האחד־עשר נמצאות צורות מיטיבות טהורות. לפי לשון הכלל: יש לו מזל בלבושים.';
  } else if (bothMalefic) {
    clothingLuck = false;
    sourceOutcome = 'no-clothing-luck';
    sourceOutcomeHebrew = 'אין לו מזל בלבוש';
    positive = false;
    outputHebrew = 'לפי חשיפת הסודות הנצורים v57 עמ׳ 264–265, בבית החמישי ובבית האחד־עשר נמצאות צורות מזיקות טהורות. לפי לשון הכלל: אין לו מזל בלבוש.';
  } else {
    const hasMixed = h5Quality === 'mixed' || h11Quality === 'mixed';
    outputHebrew = hasMixed
      ? 'דין v57 על מזל בלבוש נותן ענף מפורש כאשר הבית החמישי והאחד־עשר מיטיבים יחד או מזיקים יחד. כאן לפחות אחד מהם ממוזג, ולכן אין להעלות את נטייתו בכוח למיטיב או למזיק ואין הכרעה לפי כלל זה.'
      : 'הבית החמישי והאחד־עשר נותנים כאן עדות מפוצלת ולא את אחד משני המצבים המפורשים במקור. לכן אין להשלים מן הדעת דין של מזל חלקי.';
  }

  const royalClothingOutcome = royalClothingNoLuck
    ? 'בית 10 מזיק: אין לו מזל בלבוש המלכים או בכיבוד הבא מצד בעלי מעלה.'
    : 'בית 10 אינו נותן כאן את ענף המזיק המפורש; אין להסיק מכך לבדו מזל חיובי בלבוש מלכים.';

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 264–265',
    sourceText: 'בדין מזל הלבוש: אם בחמישי ובאחד־עשר יש צורות מיטיבות, יש לו מזל בלבושים. אם בעשירי צורה מזיקה, אין לו מזל בלבוש המלכים או בכיבוד הבא מצד בעלי מעלה. אם בחמישי ובאחד־עשר צורות מזיקות, אין לו מזל בלבוש.',
    housesUsed: [5, 10, 11],
    h5Pattern,
    h10Pattern,
    h11Pattern,
    h5Classification,
    h10Classification,
    h11Classification,
    h5Quality,
    h10Quality,
    h11Quality,
    bothBenefic,
    bothMalefic,
    clothingLuck,
    royalClothingNoLuck,
    royalClothingOutcome,
    sourceOutcome,
    sourceOutcomeHebrew,
    fixedMutableSubruleExecuted: false,
    colorSubruleExecuted: false,
    positive,
    outputHebrew: outputHebrew + ' ' + royalClothingOutcome,
  };
}
`;
executors = replaceOnce(executors, '\nconst CUSTOM_EXECUTORS = Object.freeze({', executorBlock + '\nconst CUSTOM_EXECUTORS = Object.freeze({', 'clothing executor insertion point');
executors = replaceOnce(executors, "const CUSTOM_EXECUTORS = Object.freeze({\n", "const CUSTOM_EXECUTORS = Object.freeze({\n  'clothing.p264-265.luck': computeClothingLuckP265,\n", 'clothing custom allowlist');
write(executorsPath, executors);

const testsPath = '_test_kashf_canonical_routing.mjs';
let tests = read(testsPath);
const testBlock = `
// ── P17 pp264-265 clothing-luck source contract --------------------------
assertRoute('q-clothing-lucky', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'clothing.luck',
  kashfMethodId: 'clothing.p264-265.luck',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assert(canRunKashfMethod('clothing.p264-265.luck'), 'p265 clothing-luck method is explicitly runnable');
const clothingV57 = getKashfV57Knowledge('clothing.p264-265.luck');
assert(clothingV57?.v57?.hebrewRule.includes('בחמישי ובאחד־עשר'), 'p265 clothing knowledge preserves H5+H11 rule');
assert(clothingV57?.v57?.hebrewRule.includes('בעשירי צורה מזיקה'), 'p265 clothing knowledge preserves separate H10 royal-clothing clause');
assert(clothingV57?.arabicVerification?.notes?.includes('צורה קבועה'), 'p265 verification records fixed/mutable translation boundary');

const clothingGood = buildKashfReadingByQuestionId(
  makeP204Board({ 5: '1122', 10: '2211', 11: '2111' }),
  'q-clothing-lucky',
  { question: 'מה מזלי בלבוש?' }
);
assert(clothingGood.valid === true && clothingGood.canRunKashf === true, 'p265 clothing benefic fixture executes canonically');
assert(JSON.stringify(clothingGood.primaryFormula?.houses) === JSON.stringify([5, 10, 11]), 'p265 clothing traces H5 H10 H11 only');
assert(clothingGood.primaryFormula?.result?.executorResult?.clothingLuck === true, 'p265 H5+H11 pure benefic yields clothing luck');
assert(clothingGood.primaryFormula?.result?.executorResult?.sourceOutcome === 'clothing-luck', 'p265 positive source branch is explicit');
assert(clothingGood.overallPositive === true, 'p265 clothing-luck branch is positive');
assert(clothingGood.primaryFormula?.result?.executorResult?.royalClothingNoLuck === false, 'p265 non-malefic H10 does not trigger royal-clothing no-luck clause');
assert(clothingGood.primaryFormula?.result?.executorResult?.colorSubruleExecuted === false, 'p265 color table does not vote into clothing luck');
assert(clothingGood.primaryFormula?.result?.executorResult?.fixedMutableSubruleExecuted === false, 'p265 fixed/mutable subrule stays outside luck verdict');
assert(clothingGood.altFormula === null, 'p265 clothing does not aggregate alternatives');
assert(clothingGood.canonicalExecution?.topicBundleExecuted === false, 'p265 clothing does not execute broad generalReading bundle');
assert(clothingGood.dhamir === null, 'p265 clothing does not auto-run Dhamir');

const clothingBad = buildKashfReadingByQuestionId(
  makeP204Board({ 5: '1112', 10: '1122', 11: '1212' }),
  'q-clothing-lucky',
  { question: 'מה מזלי בלבוש?' }
);
assert(clothingBad.primaryFormula?.result?.executorResult?.clothingLuck === false, 'p265 H5+H11 pure malefic yields no clothing luck');
assert(clothingBad.primaryFormula?.result?.executorResult?.sourceOutcome === 'no-clothing-luck', 'p265 negative source branch is explicit');
assert(clothingBad.overallPositive === false, 'p265 no-clothing-luck branch is negative');

const clothingRoyal = buildKashfReadingByQuestionId(
  makeP204Board({ 5: '1122', 10: '1112', 11: '2111' }),
  'q-clothing-lucky',
  { question: 'מה מזלי בלבוש?' }
);
assert(clothingRoyal.primaryFormula?.result?.executorResult?.clothingLuck === true, 'p265 general clothing luck can remain true with malefic H10');
assert(clothingRoyal.primaryFormula?.result?.executorResult?.royalClothingNoLuck === true, 'p265 malefic H10 triggers separate royal-clothing no-luck clause');
assert(clothingRoyal.primaryFormula?.result?.executorResult?.royalClothingOutcome.includes('לבוש המלכים'), 'p265 royal-clothing qualifier preserves source wording');

const clothingSplit = buildKashfReadingByQuestionId(
  makeP204Board({ 5: '1122', 10: '2211', 11: '1112' }),
  'q-clothing-lucky',
  { question: 'מה מזלי בלבוש?' }
);
assert(clothingSplit.primaryFormula?.result?.executorResult?.clothingLuck === null, 'p265 split H5/H11 testimony remains unresolved');
assert(clothingSplit.primaryFormula?.result?.executorResult?.sourceOutcome === 'unresolved', 'p265 split testimony does not invent partial luck');
assert(clothingSplit.overallPositive === null, 'p265 split testimony is not collapsed into a verdict');

const clothingMixed = buildKashfReadingByQuestionId(
  makeP204Board({ 5: '1121', 10: '2211', 11: '2111' }),
  'q-clothing-lucky',
  { question: 'מה מזלי בלבוש?' }
);
assert(clothingMixed.primaryFormula?.result?.executorResult?.h5Quality === 'mixed', 'p265 mixed H5 preserves source class');
assert(clothingMixed.primaryFormula?.result?.executorResult?.clothingLuck === null, 'p265 mixed figure is not promoted by tendency');
assert(clothingMixed.overallPositive === null, 'p265 mixed result remains unresolved');
`;

const insertBefore = '\nif (failed > 0) {';
tests = replaceOnce(tests, insertBefore, '\n' + testBlock + insertBefore, 'append p17 tests');
write(testsPath, tests);

console.log('Applied pp264-265 clothing-luck canonical implementation patch.');
