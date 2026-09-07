#!/usr/bin/env node
import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, value) { fs.writeFileSync(path, value); }
function replaceOnce(text, needle, replacement, label) {
  const first = text.indexOf(needle);
  if (first < 0) throw new Error(`Missing patch anchor: ${label}`);
  if (text.indexOf(needle, first + needle.length) >= 0) throw new Error(`Non-unique patch anchor: ${label}`);
  return text.slice(0, first) + replacement + text.slice(first + needle.length);
}

const registryPath = 'goral-hachol/registry/kashf-canonical-method-registry.js';
let registry = read(registryPath);
const oldMethod = `  'religion.p253.h3h9Quality': method({\n    kashfMethodId: 'religion.p253.h3h9Quality',\n    kashfIntentId: 'religion.religiosity',\n    topicId: 'religion',\n    sourcePages: [253],\n    kashfRuntimeStatus: 'ready',\n    runtimeAllowed: false,\n    executionKind: 'custom-engine',\n    executorStatus: 'pending',\n    notes: 'Body-source religion/righteousness rule: malefic figures in H3 and H9 indicate little religion; benefic figures there indicate religiosity and fear of God. It does not answer broad theological, spiritual-practice or faith-advice questions.',\n  }),`;
const newMethod = `  'religion.p253.h3h9Quality': method({\n    kashfMethodId: 'religion.p253.h3h9Quality',\n    kashfIntentId: 'religion.religiosity',\n    topicId: 'religion',\n    sourcePages: [253],\n    kashfRuntimeStatus: 'ready',\n    runtimeAllowed: true,\n    executionKind: 'custom-engine',\n    executorStatus: 'ready',\n    notes: 'Canonical p253 religion/righteousness executor is wired. Both H3 and H9 pure malefic => little religion; both pure benefic => religious and God-fearing according to the source wording. Mixed figures and split H3/H9 testimony remain unresolved rather than being forced into a binary judgment. It does not answer broad theological, spiritual-practice or faith-advice questions.',\n  }),`;
registry = replaceOnce(registry, oldMethod, newMethod, 'p253 religion registry method');
write(registryPath, registry);

const knowledgePath = 'goral-hachol/registry/kashf-v57-knowledge-registry.js';
let knowledge = read(knowledgePath);
knowledge = replaceOnce(
  knowledge,
  `    heading: 'הנעדר לפי אל־זנאתי; דת וצדקות',\n    hebrewRule: 'בדין הדת והצדקות: אם בבית השלישי והתשיעי יש צורה מזיקה — הוא מועט בדת. ואם יש שם צורה מיטיבה — הוא בעל דת ויראת אלוהים.',\n    supportingPages: [54, 57, 58, 59, 60],\n    arabicVerificationPages: [253],\n    notes: 'זהו דין מצומצם על הדת/הצדקות לפי H3 ו-H9, לא מענה לשאלות אמונה או ייעוץ רוחני כללי.',`,
  `    heading: 'הנעדר לפי הזנאטי; דת וצדקות',\n    hebrewRule: 'בדין הדת והצדקות: אם בבית השלישי והתשיעי יש צורה מזיקה — הוא מועט בדת. ואם יש שם צורה מיטיבה — הוא בעל דת ויראת אלוהים.',\n    supportingPages: [54, 57, 58, 59, 60],\n    arabicVerificationPages: [253],\n    notes: 'זהו דין מצומצם על הדת/הצדקות לפי H3 ו-H9, לא מענה לשאלות אמונה או ייעוץ רוחני כללי. כדי לא להמציא הרחבה מעבר ללשון v57, הכרעה קנונית ניתנת רק כאשר שני הבתים מסכימים בסיווג טהור: שניהם מיטיבים או שניהם מזיקים. ממוזג או עדות מפוצלת נשארים ללא הכרעה.',`,
  'p253 v57 heading and source-safe boundary'
);
write(knowledgePath, knowledge);

const questionBankPath = 'goral-hachol/ui/question-bank.js';
let questionBank = read(questionBankPath);
questionBank = replaceOnce(
  questionBank,
  `  {\n    id: 'q-religion',\n    category: 'spiritual', houseId: 9, topicId: 'religion', kashfTopicId: 'religion',\n    label: 'שאלה בעניין דת / אמונה',\n    desc: 'לשאלות על אמונה, קשר לה׳, פרקטיקה דתית, לימוד',\n    clientFields: [F.matter],\n  },`,
  `  {\n    id: 'q-religion',\n    category: 'spiritual', houseId: 9, topicId: 'religion', kashfTopicId: 'religion',\n    label: 'מה מצב דתו וצדקותו של האדם?',\n    desc: 'דין מצומצם לפי בתים 3 ו־9 על מידת הדת והצדקות; לא ייעוץ אמונה, קשר לה׳, פרקטיקה דתית או לימוד',\n    clientFields: [F.matter],\n  },`,
  'q-religion source-safe UI wording'
);
write(questionBankPath, questionBank);

const executorsPath = 'goral-hachol/engine/kashf-canonical-executors.js';
let executors = read(executorsPath);
const executorBlock = `\n\n// Kashf v57 p253 — religion/righteousness. The source names H3 and H9\n// together and gives only two explicit branches: malefic -> little religion;\n// benefic -> religious and God-fearing. Canonical execution therefore requires\n// both houses to agree in the same pure class. Mixed or split testimony is\n// preserved as unresolved rather than invented into a third source verdict.\nfunction computeReligionQualityP253(chart) {\n  if (!Array.isArray(chart)) return null;\n  const housesUsed = [3, 9];\n  const houseResults = housesUsed.map((houseNumber) => {\n    const entry = findCanonicalHouse(chart, houseNumber);\n    const pattern = entry?.key || entry?.pattern || null;\n    if (!pattern) return null;\n    return {\n      houseNumber,\n      pattern,\n      figureHebrew: entry?.hebrew || entry?.hebrewName || pattern,\n      classification: classifyCanonicalFigure(pattern),\n    };\n  });\n  if (houseResults.some((item) => !item)) return null;\n\n  const [h3, h9] = houseResults;\n  const h3Quality = h3.classification.saadNahs;\n  const h9Quality = h9.classification.saadNahs;\n  const bothBenefic = h3Quality === 'saad' && h9Quality === 'saad';\n  const bothMalefic = h3Quality === 'nahs' && h9Quality === 'nahs';\n\n  let sourceOutcome = 'unresolved';\n  let sourceOutcomeHebrew = 'לא הוכרע לפי כלל זה';\n  let positive = null;\n  let outputHebrew;\n\n  if (bothBenefic) {\n    sourceOutcome = 'religious-and-god-fearing';\n    sourceOutcomeHebrew = 'בעל דת ויראת אלוהים';\n    positive = true;\n    outputHebrew = 'לפי חשיפת הסודות הנצורים v57 עמ׳ 253, בבית השלישי ובבית התשיעי נמצאות צורות מיטיבות. לפי לשון הכלל: הוא בעל דת ויראת אלוהים.';\n  } else if (bothMalefic) {\n    sourceOutcome = 'little-religion';\n    sourceOutcomeHebrew = 'מועט בדת';\n    positive = false;\n    outputHebrew = 'לפי חשיפת הסודות הנצורים v57 עמ׳ 253, בבית השלישי ובבית התשיעי נמצאות צורות מזיקות. לפי לשון הכלל: הוא מועט בדת.';\n  } else {\n    const hasMixed = h3Quality === 'mixed' || h9Quality === 'mixed';\n    outputHebrew = hasMixed\n      ? 'כלל v57 עמ׳ 253 נותן הכרעה כאשר השלישי והתשיעי נידונים כמיטיבים או כמזיקים. כאן לפחות אחד משני הבתים ממוזג, ולכן אין להפוך את הנטייה שלו בכוח למיטיבה או למזיקה ואין הכרעה לפי כלל זה.'\n      : 'בית 3 ובית 9 אינם נותנים כאן עדות אחידה של שני מיטיבים או שני מזיקים. המקור אינו מוסר ענף מפורש לעדות מפוצלת, ולכן אין הכרעה לפי כלל זה.';\n  }\n\n  return {\n    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 253',\n    sourceText: 'בדין הדת והצדקות: אם בבית השלישי והתשיעי יש צורה מזיקה — הוא מועט בדת. ואם יש שם צורה מיטיבה — הוא בעל דת ויראת אלוהים.',\n    housesUsed,\n    houseResults,\n    h3Quality,\n    h9Quality,\n    bothBenefic,\n    bothMalefic,\n    sourceOutcome,\n    sourceOutcomeHebrew,\n    positive,\n    outputHebrew,\n  };\n}\n`;
executors = replaceOnce(
  executors,
  `\nconst CUSTOM_EXECUTORS = Object.freeze({`,
  `${executorBlock}\nconst CUSTOM_EXECUTORS = Object.freeze({`,
  'p253 executor insertion point'
);
executors = replaceOnce(
  executors,
  `const CUSTOM_EXECUTORS = Object.freeze({\n`,
  `const CUSTOM_EXECUTORS = Object.freeze({\n  'religion.p253.h3h9Quality': computeReligionQualityP253,\n`,
  'p253 custom allowlist'
);
write(executorsPath, executors);

const testsPath = '_test_kashf_canonical_routing.mjs';
let tests = read(testsPath);
tests = replaceOnce(
  tests,
  `assertRoute('q-religion', {\n  ok: true,\n  canRunKashf: false,\n  kashfIntentId: 'religion.religiosity',\n  kashfMethodId: 'religion.p253.h3h9Quality',\n  kashfRuntimeStatus: 'ready',\n  executorStatus: 'pending',\n});`,
  `assertRoute('q-religion', {\n  ok: true,\n  canRunKashf: true,\n  kashfIntentId: 'religion.religiosity',\n  kashfMethodId: 'religion.p253.h3h9Quality',\n  kashfRuntimeStatus: 'ready',\n  executorStatus: 'ready',\n  runtimeAllowed: true,\n});`,
  'existing q-religion route assertion'
);

const testBlock = `\n// ── P14 p253 religion/righteousness source contract ----------------------\nassert(canRunKashfMethod('religion.p253.h3h9Quality'), 'p253 religion/righteousness method is explicitly runnable');\nconst religionV57 = getKashfV57Knowledge('religion.p253.h3h9Quality');\nassert(religionV57?.v57?.heading === 'הנעדר לפי הזנאטי; דת וצדקות', 'p253 v57 heading matches the Hebrew draft');\nassert(religionV57?.v57?.hebrewRule.includes('הוא מועט בדת'), 'p253 v57 knowledge preserves the malefic branch');\nassert(religionV57?.v57?.hebrewRule.includes('הוא בעל דת ויראת אלוהים'), 'p253 v57 knowledge preserves the benefic branch');\n\nconst p253Benefic = buildKashfReadingByQuestionId(\n  makeP204Board({ 3: '1122', 9: '2211' }),\n  'q-religion',\n  { question: 'מה מצב דתו וצדקותו של האדם?' }\n);\nassert(p253Benefic.valid === true && p253Benefic.canRunKashf === true, 'p253 benefic fixture executes canonically');\nassert(JSON.stringify(p253Benefic.primaryFormula?.houses) === JSON.stringify([3, 9]), 'p253 traces H3+H9 only');\nassert(p253Benefic.primaryFormula?.result?.executorResult?.h3Quality === 'saad', 'p253 H3 pure benefic remains saad');\nassert(p253Benefic.primaryFormula?.result?.executorResult?.h9Quality === 'saad', 'p253 H9 pure benefic remains saad');\nassert(p253Benefic.primaryFormula?.result?.executorResult?.sourceOutcome === 'religious-and-god-fearing', 'p253 two benefics return exact positive source branch');\nassert(p253Benefic.primaryFormula?.result?.executorResult?.sourceOutcomeHebrew === 'בעל דת ויראת אלוהים', 'p253 positive Hebrew result matches v57');\nassert(p253Benefic.overallPositive === true, 'p253 positive source branch is positive');\nassert(p253Benefic.altFormula === null, 'p253 does not aggregate alternative religion formulas');\nassert(p253Benefic.canonicalExecution?.topicBundleExecuted === false, 'p253 does not execute broad religion bundle');\nassert(p253Benefic.dhamir === null, 'p253 does not auto-run Dhamir');\n\nconst p253Malefic = buildKashfReadingByQuestionId(\n  makeP204Board({ 3: '1112', 9: '1221' }),\n  'q-religion',\n  { question: 'מה מצב דתו וצדקותו של האדם?' }\n);\nassert(p253Malefic.primaryFormula?.result?.executorResult?.h3Quality === 'nahs', 'p253 H3 pure malefic remains nahs');\nassert(p253Malefic.primaryFormula?.result?.executorResult?.h9Quality === 'nahs', 'p253 H9 pure malefic remains nahs');\nassert(p253Malefic.primaryFormula?.result?.executorResult?.sourceOutcome === 'little-religion', 'p253 two malefics return exact negative source branch');\nassert(p253Malefic.primaryFormula?.result?.executorResult?.sourceOutcomeHebrew === 'מועט בדת', 'p253 negative Hebrew result matches v57');\nassert(p253Malefic.overallPositive === false, 'p253 negative source branch is negative');\n\nconst p253Mixed = buildKashfReadingByQuestionId(\n  makeP204Board({ 3: '2212', 9: '1122' }),\n  'q-religion',\n  { question: 'מה מצב דתו וצדקותו של האדם?' }\n);\nassert(p253Mixed.primaryFormula?.result?.executorResult?.h3Quality === 'mixed', 'p253 sees canonical mixed H3');\nassert(p253Mixed.primaryFormula?.result?.executorResult?.sourceOutcome === 'unresolved', 'p253 mixed evidence remains unresolved');\nassert(p253Mixed.overallPositive === null, 'p253 mixed evidence is not collapsed to a binary moral judgment');\n\nconst p253Split = buildKashfReadingByQuestionId(\n  makeP204Board({ 3: '1112', 9: '1122' }),\n  'q-religion',\n  { question: 'מה מצב דתו וצדקותו של האדם?' }\n);\nassert(p253Split.primaryFormula?.result?.executorResult?.h3Quality === 'nahs' && p253Split.primaryFormula?.result?.executorResult?.h9Quality === 'saad', 'p253 split fixture has one malefic and one benefic');\nassert(p253Split.primaryFormula?.result?.executorResult?.sourceOutcome === 'unresolved', 'p253 split testimony remains unresolved because the source gives no split branch');\nassert(p253Split.overallPositive === null, 'p253 split testimony is not forced into a verdict');\n\nconst p253Html = writeCanonicalKashfReading(p253Benefic);\nassert(p253Html.includes('religion.p253.h3h9Quality'), 'p253 narrative exposes exact method id');\nassert(p253Html.includes('בעל דת ויראת אלוהים'), 'p253 narrative preserves the v57 Hebrew result');\n`;
tests = replaceOnce(
  tests,
  `// ── P13 p172 matter-outcome source contract -------------------------------`,
  `${testBlock}\n// ── P13 p172 matter-outcome source contract -------------------------------`,
  'p253 test insertion point'
);
write(testsPath, tests);

console.log('Applied p253 religion/righteousness canonical implementation patch.');
