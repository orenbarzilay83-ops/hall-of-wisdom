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

const registryPath = 'goral-hachol/registry/kashf-canonical-method-registry.js';
let registry = read(registryPath);
registry = patchMethodBlock(registry, 'relocation.p183.stayMoveH1H2', (block) => {
  let out = block;
  out = replaceOnce(out, '    runtimeAllowed: false,', '    runtimeAllowed: true,', 'stay/move runtimeAllowed');
  out = replaceOnce(out, "    executionKind: 'legacy-function',", "    executionKind: 'custom-engine',", 'stay/move executionKind');
  out = replaceOnce(out, "    executorStatus: 'pending',", "    executorStatus: 'ready',", 'stay/move executorStatus');
  const noteLine = out.split('\n').find((line) => line.trim().startsWith("notes: '"));
  if (noteLine) {
    out = out.replace(noteLine, "    notes: 'Canonical H1/H2 stay-or-move executor is wired from the repeated v57 rule on pp178 and 183. H1 pure benefic + H2 pure malefic => the current place is better / stay. H1 pure malefic + H2 pure benefic => the reverse / moving away is better. Same-class, mixed or unknown testimony remains unresolved; no broad relocation helper is executed.',");
  }
  return out;
});
write(registryPath, registry);

const knowledgePath = 'goral-hachol/registry/kashf-v57-knowledge-registry.js';
let knowledge = read(knowledgePath);
const kMarker = "  'relocation.p183.stayMoveH1H2': knowledge({";
const kStart = knowledge.indexOf(kMarker);
if (kStart < 0) throw new Error('Missing stay/move v57 knowledge block');
const kEnd0 = knowledge.indexOf('\n  }),', kStart);
if (kEnd0 < 0) throw new Error('Missing stay/move v57 knowledge block end');
const kEnd = kEnd0 + '\n  }),'.length;
let kBlock = knowledge.slice(kStart, kEnd);
kBlock = kBlock.replace('    page: 183,', '    page: 178,');
kBlock = kBlock.replace("    heading: 'מעבר ממקום למקום — הישיבה במקום או המעבר ממנו',", "    heading: 'אורך חיי האדם / ומקום או מעבר — האם להישאר או לעבור',");
kBlock = kBlock.replace(
  "    hebrewRule: 'אם שאלך אדם האם הישיבה בעיר זו טובה לו או המעבר ממנה, השלם את לוח הגורל. אם בראשון יצאה צורה מיטיבה ובשני צורה מזיקה — המקום שבו הוא נמצא טוב לו. אם בראשון מזיק ובשני מיטיב — הדין להפך.',",
  "    hebrewRule: 'האם טוב לאדם להישאר בעיר זו או לעבור ממנה? השלם את ההכאה. אם יצאה בראשון צורה מיטיבה ובשני צורה מזיקה, המקום שבו הוא נמצא טוב לו. ואם יצא להפך — הדין להפך.',"
);
if (kBlock.includes('    detailPages:')) {
  kBlock = kBlock.replace(/    detailPages: \[[^\]]*\],/, '    detailPages: [178, 183],');
} else {
  kBlock = kBlock.replace("    hebrewRule: 'האם טוב לאדם להישאר בעיר זו או לעבור ממנה? השלם את ההכאה. אם יצאה בראשון צורה מיטיבה ובשני צורה מזיקה, המקום שבו הוא נמצא טוב לו. ואם יצא להפך — הדין להפך.',", "    hebrewRule: 'האם טוב לאדם להישאר בעיר זו או לעבור ממנה? השלם את ההכאה. אם יצאה בראשון צורה מיטיבה ובשני צורה מזיקה, המקום שבו הוא נמצא טוב לו. ואם יצא להפך — הדין להפך.',\n    detailPages: [178, 183],");
}
const noteLine = kBlock.split('\n').find((line) => line.trim().startsWith("notes: '"));
const newNote = "    notes: 'הכלל מופיע ב-v57 בעמ׳ 178 וחוזר שוב בעמ׳ 183. רק שני המצבים ההפוכים מפורשים: H1 מיטיב + H2 מזיק = המקום הנוכחי טוב; H1 מזיק + H2 מיטיב = הדין להפך. אין להשלים דין כאשר שני הבתים באותו סיווג או כאשר אחד מהם ממוזג.',";
if (noteLine) kBlock = kBlock.replace(noteLine, newNote);
else kBlock = kBlock.replace('\n  })', '\n' + newNote + '\n  })');
knowledge = knowledge.slice(0, kStart) + kBlock + knowledge.slice(kEnd);
write(knowledgePath, knowledge);

const questionBankPath = 'goral-hachol/ui/question-bank.js';
let questionBank = read(questionBankPath);
questionBank = replaceOnce(
  questionBank,
  "    label: 'האם כדאי להישאר במקום זה?',\n    desc: 'להחלטה האם להישאר (עיר, מדינה, מקום עבודה) — לא מעבר אחר',",
  "    label: 'האם כדאי להישאר במקום זה או לעבור?',\n    desc: 'להחלטה בין הישארות במקום הנוכחי לבין מעבר ממנו, לפי דין בתים 1 ו־2 של v57',",
  'q-stay-place source-safe wording'
);
write(questionBankPath, questionBank);

const executorsPath = 'goral-hachol/engine/kashf-canonical-executors.js';
let executors = read(executorsPath);
const executorBlock = `

// Kashf v57 pp178/183 — stay in the current place or move away.
// The source gives exactly two opposite H1/H2 combinations. We do not infer
// a verdict for same-class testimony or for mixed figures.
function computeRelocationStayMoveH1H2(chart) {
  if (!Array.isArray(chart)) return null;
  const h1 = findCanonicalHouse(chart, 1);
  const h2 = findCanonicalHouse(chart, 2);
  const h1Pattern = h1?.key || h1?.pattern || null;
  const h2Pattern = h2?.key || h2?.pattern || null;
  if (!h1Pattern || !h2Pattern) return null;

  const h1Classification = classifyCanonicalFigure(h1Pattern);
  const h2Classification = classifyCanonicalFigure(h2Pattern);
  const h1Quality = h1Classification.saadNahs;
  const h2Quality = h2Classification.saadNahs;

  let decision = 'unresolved';
  let decisionHebrew = 'לא הוכרע אם עדיף להישאר או לעבור לפי כלל זה';
  let currentPlaceBetter = null;
  let moveBetter = null;
  let outputHebrew;

  if (h1Quality === 'saad' && h2Quality === 'nahs') {
    decision = 'stay';
    decisionHebrew = 'המקום שבו הוא נמצא טוב לו — עדיף להישאר';
    currentPlaceBetter = true;
    moveBetter = false;
    outputHebrew = 'לפי חשיפת הסודות הנצורים v57 עמ׳ 178 (והכלל החוזר בעמ׳ 183), בבית הראשון צורה מיטיבה ובבית השני צורה מזיקה. לכן המקום שבו הוא נמצא טוב לו, והדין נוטה להישארות.';
  } else if (h1Quality === 'nahs' && h2Quality === 'saad') {
    decision = 'move';
    decisionHebrew = 'הדין להפך — המעבר מן המקום הנוכחי עדיף';
    currentPlaceBetter = false;
    moveBetter = true;
    outputHebrew = 'לפי חשיפת הסודות הנצורים v57 עמ׳ 178 (והכלל החוזר בעמ׳ 183), בבית הראשון צורה מזיקה ובבית השני צורה מיטיבה. המקור אומר שבמצב ההפוך הדין להפך, ולכן המעבר מן המקום הנוכחי עדיף.';
  } else {
    const hasMixed = h1Quality === 'mixed' || h2Quality === 'mixed';
    outputHebrew = hasMixed
      ? 'כלל v57 להישארות או מעבר דורש צירוף מפורש של מיטיב מול מזיק בשני הבתים. כאן לפחות אחד מהם ממוזג, ולכן אין להפוך את נטייתו בכוח להכרעה ואין פסק לפי כלל זה.'
      : 'בית 1 ובית 2 אינם יוצרים כאן אחד משני הצירופים ההפוכים שהמקור מגדיר במפורש. לכן אין להשלים מן הדעת אם עדיף להישאר או לעבור.';
  }

  return {
    sourceRef: 'חשיפת הסודות הנצורים v57 עמ׳ 178; חזרה בעמ׳ 183',
    sourceText: 'האם טוב לאדם להישאר בעיר זו או לעבור ממנה? השלם את ההכאה. אם יצאה בראשון צורה מיטיבה ובשני צורה מזיקה, המקום שבו הוא נמצא טוב לו. ואם יצא להפך — הדין להפך.',
    housesUsed: [1, 2],
    h1Pattern,
    h2Pattern,
    h1Classification,
    h2Classification,
    h1Quality,
    h2Quality,
    decision,
    decisionHebrew,
    currentPlaceBetter,
    moveBetter,
    positive: null,
    outputHebrew,
  };
}
`;
executors = replaceOnce(executors, '\nconst CUSTOM_EXECUTORS = Object.freeze({', executorBlock + '\nconst CUSTOM_EXECUTORS = Object.freeze({', 'stay/move executor insertion point');
executors = replaceOnce(executors, "const CUSTOM_EXECUTORS = Object.freeze({\n", "const CUSTOM_EXECUTORS = Object.freeze({\n  'relocation.p183.stayMoveH1H2': computeRelocationStayMoveH1H2,\n", 'stay/move custom allowlist');
write(executorsPath, executors);

const testsPath = '_test_kashf_canonical_routing.mjs';
let tests = read(testsPath);
const testBlock = `
// ── P16 pp178/183 stay-or-move source contract ---------------------------
assertRoute('q-stay-place', {
  ok: true,
  canRunKashf: true,
  kashfIntentId: 'relocation.stayOrMove',
  kashfMethodId: 'relocation.p183.stayMoveH1H2',
  kashfRuntimeStatus: 'ready',
  executorStatus: 'ready',
  runtimeAllowed: true,
});
assert(canRunKashfMethod('relocation.p183.stayMoveH1H2'), 'stay/move H1/H2 method is explicitly runnable');
const stayMoveV57 = getKashfV57Knowledge('relocation.p183.stayMoveH1H2');
assert(stayMoveV57?.v57?.page === 178, 'stay/move primary v57 anchor is p178');
assert(JSON.stringify(stayMoveV57?.v57?.detailPages) === JSON.stringify([178, 183]), 'stay/move v57 records repeated rule on pp178 and 183');
assert(stayMoveV57?.v57?.hebrewRule.includes('המקום שבו הוא נמצא טוב לו'), 'stay/move v57 preserves the explicit current-place branch');
assert(stayMoveV57?.v57?.hebrewRule.includes('הדין להפך'), 'stay/move v57 preserves the explicit reverse branch');

const p178Stay = buildKashfReadingByQuestionId(
  makeP204Board({ 1: '1122', 2: '1112' }),
  'q-stay-place',
  { question: 'האם כדאי להישאר במקום זה או לעבור?' }
);
assert(p178Stay.valid === true && p178Stay.canRunKashf === true, 'stay/move stay fixture executes canonically');
assert(JSON.stringify(p178Stay.primaryFormula?.houses) === JSON.stringify([1, 2]), 'stay/move traces H1+H2 only');
assert(p178Stay.primaryFormula?.result?.executorResult?.h1Quality === 'saad', 'stay/move stay fixture H1 is pure benefic');
assert(p178Stay.primaryFormula?.result?.executorResult?.h2Quality === 'nahs', 'stay/move stay fixture H2 is pure malefic');
assert(p178Stay.primaryFormula?.result?.executorResult?.decision === 'stay', 'stay/move explicit first branch chooses stay');
assert(p178Stay.primaryFormula?.result?.executorResult?.currentPlaceBetter === true, 'stay/move marks current place better in explicit stay branch');
assert(p178Stay.primaryFormula?.result?.executorResult?.moveBetter === false, 'stay/move marks moving not preferred in explicit stay branch');
assert(p178Stay.overallPositive === null, 'stay/move directional decision is not collapsed into positive/negative sentiment');
assert(p178Stay.altFormula === null, 'stay/move does not aggregate relocation alternatives');
assert(p178Stay.canonicalExecution?.topicBundleExecuted === false, 'stay/move does not execute broad relocation bundle');
assert(p178Stay.dhamir === null, 'stay/move does not auto-run Dhamir');

const p178Move = buildKashfReadingByQuestionId(
  makeP204Board({ 1: '1112', 2: '1122' }),
  'q-stay-place',
  { question: 'האם כדאי להישאר במקום זה או לעבור?' }
);
assert(p178Move.primaryFormula?.result?.executorResult?.h1Quality === 'nahs', 'stay/move reverse fixture H1 is pure malefic');
assert(p178Move.primaryFormula?.result?.executorResult?.h2Quality === 'saad', 'stay/move reverse fixture H2 is pure benefic');
assert(p178Move.primaryFormula?.result?.executorResult?.decision === 'move', 'stay/move explicit reverse branch chooses move');
assert(p178Move.primaryFormula?.result?.executorResult?.currentPlaceBetter === false, 'stay/move reverse branch marks current place not preferred');
assert(p178Move.primaryFormula?.result?.executorResult?.moveBetter === true, 'stay/move reverse branch marks move preferred');
assert(p178Move.overallPositive === null, 'stay/move reverse directional decision is not a sentiment verdict');

const p178Same = buildKashfReadingByQuestionId(
  makeP204Board({ 1: '1122', 2: '2211' }),
  'q-stay-place',
  { question: 'האם כדאי להישאר במקום זה או לעבור?' }
);
assert(p178Same.primaryFormula?.result?.executorResult?.h1Quality === 'saad' && p178Same.primaryFormula?.result?.executorResult?.h2Quality === 'saad', 'stay/move same-class fixture has two pure benefics');
assert(p178Same.primaryFormula?.result?.executorResult?.decision === 'unresolved', 'stay/move does not invent a same-class branch');
assert(p178Same.primaryFormula?.result?.executorResult?.currentPlaceBetter === null && p178Same.primaryFormula?.result?.executorResult?.moveBetter === null, 'stay/move same-class branch remains unresolved');

const p178Mixed = buildKashfReadingByQuestionId(
  makeP204Board({ 1: '2212', 2: '1112' }),
  'q-stay-place',
  { question: 'האם כדאי להישאר במקום זה או לעבור?' }
);
assert(p178Mixed.primaryFormula?.result?.executorResult?.h1Quality === 'mixed', 'stay/move preserves mixed H1 class');
assert(p178Mixed.primaryFormula?.result?.executorResult?.decision === 'unresolved', 'stay/move mixed testimony remains unresolved');
assert(p178Mixed.primaryFormula?.result?.executorResult?.currentPlaceBetter === null, 'stay/move does not promote mixed inclination to stay');

const p178Html = writeCanonicalKashfReading(p178Stay);
assert(p178Html.includes('relocation.p183.stayMoveH1H2'), 'stay/move narrative exposes exact method id');
assert(p178Html.includes('המקום שבו הוא נמצא טוב לו'), 'stay/move narrative preserves v57 Hebrew result');
`;
tests = replaceOnce(tests, '// ── P12 p183 current place vs relocation source contract -----------------', testBlock + '\n// ── P12 p183 current place vs relocation source contract -----------------', 'stay/move test insertion point');
write(testsPath, tests);

console.log('Applied pp178/183 stay-or-move canonical implementation patch.');
