#!/usr/bin/env node
import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, text) { fs.writeFileSync(path, text, 'utf8'); }
function replaceOnce(text, from, to, label) {
  const count = text.split(from).length - 1;
  if (count !== 1) throw new Error(`${label}: expected exactly 1 literal match, found ${count}`);
  return text.replace(from, to);
}
function replaceBetween(text, start, end, replacement, label) {
  const i = text.indexOf(start);
  if (i === -1) throw new Error(`${label}: start anchor not found`);
  const j = text.indexOf(end, i + start.length);
  if (j === -1) throw new Error(`${label}: end anchor not found`);
  if (text.indexOf(start, i + 1) !== -1) throw new Error(`${label}: start anchor is not unique`);
  return text.slice(0, i) + replacement + text.slice(j);
}

// 1) Professional Verdict Safety policy: certify complete p211 matrix.
{
  const path = 'goral-hachol/intelligence/kashf-professional-verdict-safety.js';
  let text = read(path);
  text = replaceOnce(
    text,
    "export const KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION = 'kashf-professional-verdict-safety-v12';",
    "export const KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION = 'kashf-professional-verdict-safety-v13';",
    'safety version v13',
  );

  const policy = `function p211DissolutionPolicy() {\n  return Object.freeze({\n    certificationStatus: 'certified',\n    certificationBatch: 'professional-backfill-12',\n    goldenCaseIds: freezeArray([\n      'PV-BF12-P211-INTERNAL-BENEFIC',\n      'PV-BF12-P211-INTERNAL-MALEFIC',\n      'PV-BF12-P211-EXTERNAL-BENEFIC',\n      'PV-BF12-P211-EXTERNAL-MALEFIC',\n      'PV-BF12-P211-FIXED-BENEFIC',\n      'PV-BF12-P211-FIXED-MALEFIC',\n      'PV-BF12-P211-MUTABLE-BENEFIC',\n      'PV-BF12-P211-MUTABLE-MALEFIC',\n      'PV-BF12-P211-EXACT-DRAFT',\n    ]),\n    policyId: 'p211-marriage-h7-complete-state-matrix-v1',\n    questionScopeHebrew: 'יציבות/פירוק הנישואין לפי מטריצת H7 המלאה בעמ׳ 211 בלבד',\n    decisiveRuleHebrew: 'H7 נקרא לפי שני צירים יחד: פנימי/חיצוני/קבוע/מתהפך ומיטיב/מזיק. המקור נותן ענפים מפורשים לכל ארבעת המצבים. בענפי קבוע ומתַהפך בלבד, צורות ממוזגות משתמשות בנטיית המיטיב/מזיק הרשומה בקטלוג כדי לממש את זוג הענפים سعد/نحس של עמ׳ 211.',\n    oneWayBranches: freezeArray([\n      'פנימי מיטיב => יישוב הדעת וקיום מצב הנישואין',\n      'פנימי מזיק => עגמת נפש ומריבה, אך המצב קבוע',\n      'חיצוני מיטיב => נישואין טובים, אך פרידה אפשרית משום שהחלק אינו קבוע',\n      'חיצוני מזיק => אין נישואין ראויים; ואם כבר היו, החלק נחתך ונפסק',\n      'קבוע מיטיב => תיקון בית המשכב',\n      'קבוע מזיק => אין תיקון לבית המשכב; רוע בין בני הזוג ומקורו מן האיש',\n      'מתהפך מיטיב => יישוב, שמחה וששון בבית המשכב, אהבה, עושר ועונג',\n      'מתהפך מזיק => אין נישואין; הדבר הולך לרעה ולפירוד; המקור מוסר שהעזיבה עדיפה',\n    ]),\n    forbiddenInversions: freezeArray([\n      'חיצוני מיטיב אומר שפרידה אפשרית, לא שפרידה ודאית.',\n      'אסור לצמצם את p211 למיטיב/מזיק בלבד ולהתעלם ממצב פנימי/חיצוני/קבוע/מתהפך.',\n      'השימוש ב-mixedTendency בענפי קבוע/מתהפך הוא חריג מקומי ל-p211 בלבד; אסור לקדם צורה ממוזגת בשיטות אחרות.',\n      'לשון המקור שהעזיבה עדיפה בענף מתהפך-מזיק אינה היתר להוסיף עצת קשר עצמאית מעבר לטקסט המקור.',\n    ]),\n    excludedFromPrimaryVerdict: freezeArray([\n      'marriage.p210.generalMarriageH1H2H7H8H10Judge — דין הנישואין הכללי הוא שיטה נפרדת.',\n      'marriage.p204.previousStatusH7inH10 — מעמד קודם הוא שיטה נפרדת.',\n      'marriage.p204.dowryH8 — מוהר הוא שיטה נפרדת.',\n      'love.p206.womanFavorH7H11ThenH5 ו-desire.p206.querentWantsH7H11ThenH5 — רצון/מציאת חן הם שיטות נפרדות.',\n      'H15/H16 ומשמעות כללית של צורות/בתים מחוץ למטריצת H7 של p211.',\n    ]),\n    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([\n      'ודאי תהיה פרידה',\n      'ודאי יהיה גירושין',\n      'המקור מוכיח בגידה',\n      'האיש אשם בכל בעיות הנישואין',\n      'אני ממליץ לעזוב את הקשר',\n    ]),\n  });\n}\n\n`;
  text = replaceOnce(text, 'function p254ProfessionPolicy() {', policy + 'function p254ProfessionPolicy() {', 'insert p211 policy');
  text = replaceOnce(
    text,
    '  [P254_PROFESSION_METHOD]: p254ProfessionPolicy(),',
    '  [P211_DISSOLUTION_METHOD]: p211DissolutionPolicy(),\n  [P254_PROFESSION_METHOD]: p254ProfessionPolicy(),',
    'register p211 policy',
  );
  write(path, text);
}

// 2) Professional Golden tests: 43/43 and complete matrix coverage.
{
  const path = '_test_kashf_professional_verdict_safety.mjs';
  let text = read(path);
  text = replaceOnce(
    text,
    "assert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.length === 42, 'certification registry contains forty-two professionally certified methods');",
    "assert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.length === 43, 'certification registry contains forty-three professionally certified methods');",
    'professional certified count 43',
  );
  text = replaceOnce(
    text,
    "for (const id of [\n  'marriage.p210.generalMarriageH1H2H7H8H10Judge',",
    "for (const id of [\n  'marriage.p210.generalMarriageH1H2H7H8H10Judge',\n  'marriage.p211.dissolutionH7StateMatrix',",
    'add p211 to certified registry assertions',
  );

  const oldPendingStart = '// p211 is deliberately NOT certified: Arabic verification shows branches absent from current operational v57 knowledge/executor.\n';
  const oldPendingEnd = "console.log('\\n--- Professional backfill batch 03 + exact client-draft lock ---');";
  text = replaceBetween(text, oldPendingStart, oldPendingEnd, '', 'remove obsolete p211 pending safety block');

  text = replaceOnce(
    text,
    "// One runnable method remains intentionally uncertified after source/implementation audit.\nfor (const id of [\n  'marriage.p211.dissolutionH7StateMatrix',\n]) {\n  assert(!KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.includes(id), id + ' remains pending professional source closure');\n}\n",
    "// All 43 source-ready runnable methods are professionally certified after Batch 12.\nassert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.length === 43, 'no runnable backfill method remains uncertified after batch 12');\n",
    'remove final p211 pending loop',
  );

  const batch12 = `\nconsole.log('\\n--- Professional backfill batch 12 — p211 complete marriage H7 matrix ---');\n\nconst p211InternalGood = buildKashfCanonicalAiBridge({ questionId: 'q-divorce', questionText: 'האם תהיה פרידה בנישואין?', board: makeBoard({ 7:'2211' }) });\nconst p211InternalBad = buildKashfCanonicalAiBridge({ questionId: 'q-divorce', questionText: 'האם תהיה פרידה בנישואין?', board: makeBoard({ 7:'2221' }) });\nconst p211ExternalGood = buildKashfCanonicalAiBridge({ questionId: 'q-divorce', questionText: 'האם תהיה פרידה בנישואין?', board: makeBoard({ 7:'1122' }) });\nconst p211ExternalBad = buildKashfCanonicalAiBridge({ questionId: 'q-divorce', questionText: 'האם תהיה פרידה בנישואין?', board: makeBoard({ 7:'1112' }) });\nconst p211FixedGood = buildKashfCanonicalAiBridge({ questionId: 'q-divorce', questionText: 'האם תהיה פרידה בנישואין?', board: makeBoard({ 7:'2212' }) });\nconst p211FixedBad = buildKashfCanonicalAiBridge({ questionId: 'q-divorce', questionText: 'האם תהיה פרידה בנישואין?', board: makeBoard({ 7:'2222' }) });\nconst p211MutableGood = buildKashfCanonicalAiBridge({ questionId: 'q-divorce', questionText: 'האם תהיה פרידה בנישואין?', board: makeBoard({ 7:'1121' }) });\nconst p211MutableBad = buildKashfCanonicalAiBridge({ questionId: 'q-divorce', questionText: 'האם תהיה פרידה בנישואין?', board: makeBoard({ 7:'1111' }) });\n\nconst p211Exec = (reading) => reading.canonicalReading?.primaryFormula?.result?.executorResult;\nassert(p211InternalGood.resolution?.kashfMethodId === 'marriage.p211.dissolutionH7StateMatrix', 'p211 q-divorce selects only the exact dissolution method');\nassert(p211Exec(p211InternalGood)?.sourceOutcome === 'stable', 'p211 internal benefic branch preserves marriage stability');\nassert(p211Exec(p211InternalBad)?.sourceOutcome === 'stable-with-quarrel', 'p211 internal malefic branch preserves quarrel plus stability');\nassert(p211Exec(p211ExternalGood)?.sourceOutcome === 'good-but-separation-possible', 'p211 external benefic preserves possible, not certain, separation');\nassert(String(p211Exec(p211ExternalGood)?.outputHebrew || '').includes('פרידה אפשרית'), 'p211 external benefic client draft states possibility rather than certainty');\nassert(p211Exec(p211ExternalBad)?.sourceOutcome === 'breakdown-if-existing', 'p211 external malefic preserves explicit cut-off branch');\nassert(p211Exec(p211FixedGood)?.sourceOutcome === 'fixed-benefic-repair', 'p211 fixed benefic branch is now source-complete');\nassert(p211Exec(p211FixedBad)?.sourceOutcome === 'fixed-malefic-distress-origin-man', 'p211 fixed malefic branch is now source-complete');\nassert(p211Exec(p211MutableGood)?.sourceOutcome === 'mutable-benefic-joy-love-wealth', 'p211 mutable benefic branch is now source-complete');\nassert(p211Exec(p211MutableBad)?.sourceOutcome === 'mutable-malefic-breakdown-separation', 'p211 mutable malefic branch is now source-complete');\n\nfor (const reading of [p211FixedGood, p211FixedBad, p211MutableGood, p211MutableBad]) {\n  assert(p211Exec(reading)?.classification?.saadNahs === 'mixed', 'p211 fixed/mutable Golden fixtures preserve canonical mixed classification');\n  assert(p211Exec(reading)?.sourceValenceBasis === 'mixed-tendency-for-p211-only', 'p211 fixed/mutable source valence is explicitly method-local');\n}\nassert(p211Exec(p211FixedGood)?.sourceValence === 'saad' && p211Exec(p211MutableGood)?.sourceValence === 'saad', 'p211 mixed-benefic fixed/mutable figures reach source سعد branches');\nassert(p211Exec(p211FixedBad)?.sourceValence === 'nahs' && p211Exec(p211MutableBad)?.sourceValence === 'nahs', 'p211 mixed-malefic fixed/mutable figures reach source نحس branches');\nassert([p211InternalGood,p211InternalBad,p211ExternalGood,p211ExternalBad,p211FixedGood,p211FixedBad,p211MutableGood,p211MutableBad].every((r) => p211Exec(r)?.sourceOutcome !== 'unresolved'), 'p211 source matrix covers all eight H7 state/valence branches');\n\nassert(p211InternalGood.professionalVerdictSafety?.certificationStatus === 'certified', 'p211 passed Professional Verdict Safety source closure');\nassert(p211InternalGood.professionalVerdictSafety?.clientFacingCertified === true, 'p211 client-facing exact source draft is certified');\nassert(p211InternalGood.professionalVerdictSafety?.authoritativePolarity === 'non-binary', 'p211 remains categorical/non-binary rather than a forced yes/no');\nassert(p211InternalGood.professionalVerdictSafety?.binaryClientVerdictAllowed === false, 'p211 cannot be turned into a binary divorce verdict');\nassert(p211InternalGood.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenInversions?.some((x) => x.includes('חריג מקומי') || x.includes('p211 בלבד')), 'p211 policy prevents mixed-tendency leakage into other methods');\nassert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.includes('marriage.p211.dissolutionH7StateMatrix'), 'p211 method is explicitly professionally certified');\n\nconst p211Exact = validateKashfAdvisorOutput(auditOutputForSafety(p211MutableBad.professionalVerdictSafety, {\n  draft: p211MutableBad.professionalVerdictSafety.authoritativeClientDraftHebrew,\n  draftPolarity: 'non-binary',\n}));\nassert(validateKashfAdvisorVerdictAlignment(p211Exact.value, p211MutableBad.professionalVerdictSafety).ok === true, 'p211 exact deterministic client draft passes');\nconst p211CertainSeparation = validateKashfAdvisorOutput(auditOutputForSafety(p211ExternalGood.professionalVerdictSafety, {\n  draft: 'ודאי תהיה פרידה.',\n  draftPolarity: 'non-binary',\n}));\nassert(validateKashfAdvisorVerdictAlignment(p211CertainSeparation.value, p211ExternalGood.professionalVerdictSafety).ok === false, 'p211 server gate blocks possible-separation becoming certain separation');\n\n`;
  text = replaceOnce(
    text,
    "console.log(`\\nKashf professional verdict safety tests: ${passed} passed, ${failed} failed`);",
    batch12 + "console.log(`\\nKashf professional verdict safety tests: ${passed} passed, ${failed} failed`);",
    'append p211 batch12 Golden tests',
  );
  write(path, text);
}

console.log('Professional Verdict Safety backfill batch 12 part 2 applied.');
