#!/usr/bin/env node
import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, content) { fs.writeFileSync(path, content, 'utf8'); }
function replaceOnce(text, from, to, label) {
  if (!text.includes(from)) throw new Error('Missing anchor: ' + label);
  if (text.indexOf(from) !== text.lastIndexOf(from)) throw new Error('Non-unique anchor: ' + label);
  return text.replace(from, to);
}

const safetyPath = 'goral-hachol/intelligence/kashf-professional-verdict-safety.js';
let safety = read(safetyPath);
safety = replaceOnce(
  safety,
  "export const KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION = 'kashf-professional-verdict-safety-v2';",
  "export const KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION = 'kashf-professional-verdict-safety-v3';",
  'safety version v2'
);
safety = replaceOnce(
  safety,
  "const P211_DISSOLUTION_METHOD = 'marriage.p211.dissolutionH7StateMatrix';",
  "const P211_DISSOLUTION_METHOD = 'marriage.p211.dissolutionH7StateMatrix';\nconst P204_PREVIOUS_STATUS_METHOD = 'marriage.p204.previousStatusH7inH10';\nconst P204_DOWRY_METHOD = 'marriage.p204.dowryH8';\nconst P206_WOMAN_FAVOR_METHOD = 'love.p206.womanFavorH7H11ThenH5';\nconst P206_QUERENT_DESIRE_METHOD = 'desire.p206.querentWantsH7H11ThenH5';",
  'method constants'
);

const batch02Policies = `
function p204PreviousStatusPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-02',
    goldenCaseIds: freezeArray(['PV-BF02-P204-PREVIOUS-MUTABLE', 'PV-BF02-P204-PREVIOUS-FIXED', 'PV-BF02-P204-PREVIOUS-NORECURRENCE']),
    policyId: 'p204-previous-status-recurrence-scope-v1',
    questionScopeHebrew: 'גרושה לעומת בתולה לפי חזרת צורת H7 ב-H10, עמ׳ 204',
    decisiveRuleHebrew: 'רק כאשר צורת H7 נמצאת גם ב-H10: צורה מתהפכת => גרושה; צורה קבועה => בתולה. ללא החזרה או בסיווג אחר אין הכרעה בכלל זה.',
    oneWayBranches: freezeArray([
      'H7 חוזר ב-H10 + הצורה מתהפכת => גרושה',
      'H7 חוזר ב-H10 + הצורה קבועה => בתולה',
    ]),
    forbiddenInversions: freezeArray([
      'אי-חזרת H7 ב-H10 אינה מוכיחה שום מצב קודם.',
      'צורה שאינה באחת מארבע המתהפכות או מארבע הקבועות אינה מתירה לנחש קטגוריה.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'דין עמ׳ 207 של בעולה/בתולה לפי שורת המים — שיטה סמוכה ונפרדת.',
      'marriage.p204.dowryH8, love.p204.attentionFireRows1713 ושאר דיני הנישואין.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'אלמנה',
      'מצב נישואין נוכחי מעבר לקטגוריות גרושה/בתולה של הכלל',
      'אין חזרה ולכן היא בתולה או גרושה',
    ]),
  });
}

function p204DowryPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-02',
    goldenCaseIds: freezeArray(['PV-BF02-P204-DOWRY-LARGE', 'PV-BF02-P204-DOWRY-NOINVERSE']),
    policyId: 'p204-dowry-h8-no-inverse-v1',
    questionScopeHebrew: 'גודל המוהר לפי H8 בעמ׳ 204',
    decisiveRuleHebrew: 'צורה מיטיבה ב-H8 מורה על מוהר גדול. המקור אינו נותן כאן היפוך שלפיו צורה מזיקה מורה על מוהר קטן.',
    oneWayBranches: freezeArray([
      'H8 מיטיב => מוהר גדול',
    ]),
    forbiddenInversions: freezeArray([
      'H8 מזיק אינו מוכיח מוהר קטן.',
      'H8 ממוזג אינו מוכיח מוהר בינוני.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'marriage.p210.generalMarriageH1H2H7H8H10Judge — דין התאמת נישואין נפרד.',
      'כל משמעות כללית של בית 8 שאינה חלק מדין המוהר.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'המוהר קטן',
      'המוהר בינוני',
      'הנישואין טובים או רעים בגלל H8 בלבד',
    ]),
  });
}

function p206WomanFavorPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-02',
    goldenCaseIds: freezeArray(['PV-BF02-P206-WOMAN-FAVOR-POSITIVE', 'PV-BF02-P206-WOMAN-FAVOR-NEGATIVE', 'PV-BF02-P206-WOMAN-FAVOR-MIXED']),
    policyId: 'p206-woman-favor-exact-semantics-v1',
    questionScopeHebrew: 'האם האישה תמצא חן בעיני השואל/האיש לפי עמ׳ 206',
    decisiveRuleHebrew: 'הולד H7+H11, ואת התוצאה הכה עם H5. תוצאה מיטיבה => היא תמצא חן בעיניו; מזיקה => לא תמצא חן; ממוזגת => אין הכרעה בינארית.',
    oneWayBranches: freezeArray([
      'תוצאת H7+H11 ואז +H5 מיטיבה => היא תמצא חן בעיניו',
      'התוצאה מזיקה => היא לא תמצא חן בעיניו',
    ]),
    forbiddenInversions: freezeArray([
      'תוצאה ממוזגת אינה הופכת לכן או לא.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'desire.p206.querentWantsH7H11ThenH5 — אותה מכניקה אך שאלה סמנטית אחרת.',
      'love.p205.directLoveH1PlacementH5Relation — אהבה ישירה, כרגע repair-required.',
      'marriage.p210.generalMarriageH1H2H7H8H10Judge — התאמת נישואין.',
      'love.p204.attentionFireRows1713 — למי מופנה המבט.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'הוא אוהב אותה',
      'יש ביניהם כימיה הדדית',
      'יש משיכה הדדית',
      'הקשר מתאים לנישואין',
    ]),
  });
}

function p206QuerentDesirePolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-02',
    goldenCaseIds: freezeArray(['PV-BF02-P206-DESIRE-POSITIVE', 'PV-BF02-P206-DESIRE-NEGATIVE', 'PV-BF02-P206-DESIRE-MIXED']),
    policyId: 'p206-querent-desire-exact-semantics-v1',
    questionScopeHebrew: 'האם השואל רוצה בדבר לפי עמ׳ 206',
    decisiveRuleHebrew: 'הולד H7+H11, ואת התוצאה הכה עם H5. תוצאה מיטיבה => השואל רוצה בדבר; מזיקה => להפך; ממוזגת => אין הכרעה בינארית.',
    oneWayBranches: freezeArray([
      'תוצאת H7+H11 ואז +H5 מיטיבה => השואל רוצה בדבר',
      'התוצאה מזיקה => השואל אינו רוצה בדבר',
    ]),
    forbiddenInversions: freezeArray([
      'תוצאה ממוזגת אינה הופכת לרצון או אי-רצון.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'love.p206.womanFavorH7H11ThenH5 — אותה מכניקה אך שאלה אחרת.',
      'love.p205.directLoveH1PlacementH5Relation — אהבת אדם אחר.',
      'marriage.p210.generalMarriageH1H2H7H8H10Judge — התאמת נישואין.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'האישה מוצאת חן בעיניו',
      'אדם אחר אוהב את השואל',
      'הקשר מתאים',
      'הנישואין יצליחו',
    ]),
  });
}

`;
safety = replaceOnce(safety, 'const METHOD_POLICIES = Object.freeze({', batch02Policies + 'const METHOD_POLICIES = Object.freeze({', 'method policies anchor');
safety = replaceOnce(
  safety,
  "  [P210_MARRIAGE_METHOD]: p210Policy(),\n});",
  "  [P210_MARRIAGE_METHOD]: p210Policy(),\n  [P204_PREVIOUS_STATUS_METHOD]: p204PreviousStatusPolicy(),\n  [P204_DOWRY_METHOD]: p204DowryPolicy(),\n  [P206_WOMAN_FAVOR_METHOD]: p206WomanFavorPolicy(),\n  [P206_QUERENT_DESIRE_METHOD]: p206QuerentDesirePolicy(),\n});",
  'method policies entries'
);
write(safetyPath, safety);

const testPath = '_test_kashf_professional_verdict_safety.mjs';
let tests = read(testPath);
tests = replaceOnce(tests, "assert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.length === 5, 'certification registry starts with p210 + four backfilled methods');", "assert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.length === 9, 'certification registry contains p210 plus eight professionally backfilled methods');", 'certification count');
tests = replaceOnce(
  tests,
  "  'missing.p249.returnAnglesJudge',\n]) {",
  "  'missing.p249.returnAnglesJudge',\n  'marriage.p204.previousStatusH7inH10',\n  'marriage.p204.dowryH8',\n  'love.p206.womanFavorH7H11ThenH5',\n  'desire.p206.querentWantsH7H11ThenH5',\n]) {",
  'certified id list'
);

const batch02Tests = `

console.log('\\n--- Professional backfill batch 02 ---');

// PV-BF02-P204-PREVIOUS-* — the p204 rule is conditional on H7 recurring in H10.
const p204PreviousMutable = buildKashfCanonicalAiBridge({ questionId: 'q-marriage-thayib', questionText: 'בתולה או גרושה?', board: makeBoard({ 7:'1121', 10:'1121' }) });
assert(p204PreviousMutable.canonicalReading?.primaryFormula?.result?.executorResult?.previousStatus === 'divorced', 'p204 mutable H7 recurrence yields exactly divorced');
assert(p204PreviousMutable.professionalVerdictSafety?.certificationStatus === 'certified', 'p204 previous-status method passed professional backfill');
assert(p204PreviousMutable.professionalVerdictSafety?.authoritativePolarity === 'non-binary', 'p204 previous status remains categorical rather than sentiment polarity');
const p204PreviousFixed = buildKashfCanonicalAiBridge({ questionId: 'q-marriage-thayib', questionText: 'בתולה או גרושה?', board: makeBoard({ 7:'2222', 10:'2222' }) });
assert(p204PreviousFixed.canonicalReading?.primaryFormula?.result?.executorResult?.previousStatus === 'virgin', 'p204 fixed H7 recurrence yields exactly virgin');
const p204PreviousNoRecurrence = buildKashfCanonicalAiBridge({ questionId: 'q-marriage-thayib', questionText: 'בתולה או גרושה?', board: makeBoard({ 7:'1121', 10:'2222' }) });
assert(p204PreviousNoRecurrence.canonicalReading?.primaryFormula?.result?.executorResult?.previousStatus === null, 'p204 no-recurrence case stays unresolved');
assert(p204PreviousNoRecurrence.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenInversions?.some((x) => x.includes('אי-חזרת')), 'p204 safety policy explicitly forbids guessing from absent recurrence');

// PV-BF02-P204-DOWRY-* — only the stated benefic H8 branch proves a large mahr.
const p204DowryLarge = buildKashfCanonicalAiBridge({ questionId: 'q-dowry', questionText: 'מה גודל המוהר?', board: makeBoard({ 8:'1122' }) });
assert(p204DowryLarge.canonicalReading?.primaryFormula?.result?.executorResult?.isLargeDowry === true, 'p204 benefic H8 yields the explicit large-mahr branch');
assert(p204DowryLarge.professionalVerdictSafety?.certificationStatus === 'certified', 'p204 dowry method passed professional backfill');
const p204DowryMalefic = buildKashfCanonicalAiBridge({ questionId: 'q-dowry', questionText: 'מה גודל המוהר?', board: makeBoard({ 8:'1112' }) });
assert(p204DowryMalefic.canonicalReading?.primaryFormula?.result?.executorResult?.isLargeDowry === null, 'p204 malefic H8 does not invert into small mahr');
assert(p204DowryMalefic.professionalVerdictSafety?.authoritativePolarity === 'non-binary', 'p204 malefic dowry branch remains non-binary');
const p204DowryInventedSmall = validateKashfAdvisorOutput(auditOutputForSafety(p204DowryMalefic.professionalVerdictSafety, { draft: 'המוהר יהיה קטן.', draftPolarity: 'negative' }));
assert(validateKashfAdvisorVerdictAlignment(p204DowryInventedSmall.value, p204DowryMalefic.professionalVerdictSafety).ok === false, 'server rejects invented small-mahr inverse verdict');

// PV-BF02-P206-WOMAN-FAVOR-* — exact semantics: finding favor, not love/chemistry/marriage.
const p206FavorGood = buildKashfCanonicalAiBridge({ questionId: 'q-woman-grace', questionText: 'האם האישה תמצא חן בעיני האיש?', board: makeBoard({ 5:'2211', 7:'2222', 11:'2222' }) });
assert(p206FavorGood.canonicalReading?.overallPositive === true, 'p206 woman-favor benefic final is positive');
assert(p206FavorGood.professionalVerdictSafety?.certificationStatus === 'certified', 'p206 woman-favor method passed professional backfill');
const p206FavorBad = buildKashfCanonicalAiBridge({ questionId: 'q-woman-grace', questionText: 'האם האישה תמצא חן בעיני האיש?', board: makeBoard({ 5:'1212', 7:'2222', 11:'2222' }) });
assert(p206FavorBad.canonicalReading?.overallPositive === false, 'p206 woman-favor malefic final is negative');
const p206FavorMixed = buildKashfCanonicalAiBridge({ questionId: 'q-woman-grace', questionText: 'האם האישה תמצא חן בעיני האיש?', board: makeBoard({ 5:'2222', 7:'2222', 11:'2222' }) });
assert(p206FavorMixed.canonicalReading?.overallPositive === null, 'p206 woman-favor mixed final remains unresolved');
assert(p206FavorGood.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenClientClaimsWithoutExplicitSelectedMethodBranch?.some((x) => x.includes('כימיה')), 'p206 woman-favor policy forbids mutual-chemistry expansion');
const p206FavorUnsupportedLove = validateKashfAdvisorOutput(auditOutputForSafety(p206FavorGood.professionalVerdictSafety, { draft: 'הוא אוהב אותה.', draftPolarity: 'positive' }));
p206FavorUnsupportedLove.value.verdictAudit.unsupportedClientClaims = ['הוא אוהב אותה'];
assert(validateKashfAdvisorVerdictAlignment(p206FavorUnsupportedLove.value, p206FavorGood.professionalVerdictSafety).ok === false, 'server rejects expansion from finding-favor to love');

// PV-BF02-P206-DESIRE-* — same arithmetic as woman-favor, but a different semantic question.
const p206DesireGood = buildKashfCanonicalAiBridge({ questionText: 'האם השואל רוצה בדבר', board: makeBoard({ 5:'2211', 7:'2222', 11:'2222' }) });
assert(p206DesireGood.resolution.kashfMethodId === 'desire.p206.querentWantsH7H11ThenH5', 'p206 desire free text resolves only the exact desire method');
assert(p206DesireGood.canonicalReading?.overallPositive === true, 'p206 desire benefic final means the querent wants the matter');
assert(p206DesireGood.professionalVerdictSafety?.certificationStatus === 'certified', 'p206 desire method passed professional backfill');
const p206DesireBad = buildKashfCanonicalAiBridge({ questionText: 'האם השואל רוצה בדבר', board: makeBoard({ 5:'1212', 7:'2222', 11:'2222' }) });
assert(p206DesireBad.canonicalReading?.overallPositive === false, 'p206 desire malefic final means the querent does not want the matter');
const p206DesireMixed = buildKashfCanonicalAiBridge({ questionText: 'האם השואל רוצה בדבר', board: makeBoard({ 5:'2222', 7:'2222', 11:'2222' }) });
assert(p206DesireMixed.canonicalReading?.overallPositive === null, 'p206 desire mixed final remains unresolved');
assert(p206DesireGood.professionalVerdictSafety?.methodSpecificPolicy?.excludedFromPrimaryVerdict?.some((x) => x.includes('womanFavor')), 'p206 desire policy explicitly isolates the identical-arithmetic woman-favor method');

// p211 is deliberately NOT certified: Arabic verification shows branches absent from current operational v57 knowledge/executor.
assert(!KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.includes('marriage.p211.dissolutionH7StateMatrix'), 'p211 dissolution is held from certification pending source-coverage repair');
const p211Pending = buildKashfCanonicalAiBridge({ questionId: 'q-divorce', questionText: 'האם תהיה פרידה בנישואין?', board: makeBoard({ 7:'2111' }) });
assert(p211Pending.professionalVerdictSafety?.certificationStatus === 'pending-backfill', 'p211 remains pending-backfill despite being computationally runnable');
assert(p211Pending.professionalVerdictSafety?.clientFacingCertified === false, 'p211 cannot issue client-facing advice before source coverage is repaired');
assert(p211Pending.professionalVerdictSafety?.binaryClientVerdictAllowed === false, 'p211 has no binary client-verdict permission while uncertified');
const p211UnsafeDraft = validateKashfAdvisorOutput(auditOutputForSafety(p211Pending.professionalVerdictSafety, { draft: 'הנישואין יישארו יציבים.', draftPolarity: p211Pending.professionalVerdictSafety.authoritativePolarity === 'positive' ? 'positive' : 'non-binary' }));
assert(validateKashfAdvisorVerdictAlignment(p211UnsafeDraft.value, p211Pending.professionalVerdictSafety).ok === false, 'server blocks a p211 client draft while professional certification is pending');
`;
tests = replaceOnce(tests, "console.log(`\\nKashf professional verdict safety tests: ${passed} passed, ${failed} failed`);", batch02Tests + "\nconsole.log(`\\nKashf professional verdict safety tests: ${passed} passed, ${failed} failed`);", 'test final log');
write(testPath, tests);

const statusPath = 'HALL_WISDOM_KASHF_PROFESSIONAL_VERDICT_BACKFILL_STATUS.md';
let status = read(statusPath);
status = status.replace('מוסמכים מקצועית לאחר Batch 01: **5/43**.', 'מוסמכים מקצועית לאחר Batch 02: **9/43**.');
status = status.replace('ממתינים להסמכה רטרואקטיבית: **38/43**.', 'ממתינים להסמכה רטרואקטיבית: **34/43**.');
status = replaceOnce(
  status,
  '| missing.p249.returnAnglesJudge | certified | PV-BF01-P249 | סימן חזרת זכרים; אין היפוך לאי-חזרה ואין הכללה אוניברסלית |',
  '| missing.p249.returnAnglesJudge | certified | PV-BF01-P249 | סימן חזרת זכרים; אין היפוך לאי-חזרה ואין הכללה אוניברסלית |\n| marriage.p204.previousStatusH7inH10 | certified | PV-BF02-P204-PREVIOUS-* | רק חזרת H7 ב-H10 מפעילה גרושה/בתולה; ללא חזרה אין ניחוש |\n| marriage.p204.dowryH8 | certified | PV-BF02-P204-DOWRY-* | H8 מיטיב מורה מוהר גדול; אין היפוך מזיק=>מוהר קטן |\n| love.p206.womanFavorH7H11ThenH5 | certified | PV-BF02-P206-WOMAN-FAVOR-* | מציאת חן חד-כיוונית בלבד; לא אהבה/כימיה/התאמת נישואין |\n| desire.p206.querentWantsH7H11ThenH5 | certified | PV-BF02-P206-DESIRE-* | רצון השואל בלבד; אותה מכניקה אינה מתירה להעתיק משמעות משיטת מציאת החן |',
  'status certified rows'
);
const p211Audit = `

### marriage.p211.dissolutionH7StateMatrix

- המנוע הנוכחי runnable, אך אינו מוסמך מקצועית.
- v57 התפעולי הקיים כולל ענפי פנימי, מזיק-פנימי, מיטיב-חיצוני, מזיק-חיצוני ומיטיב-קבוע.
- בבדיקת הסריקה הערבית של עמ׳ 211 נמצאו גם שלושה ענפים נוספים: מזיק-קבוע, מיטיב-מתהפך ומזיק-מתהפך.
- מאחר שהערבית היא verification-only, אסור להכניס את הענפים האלה בשקט למנוע או להחליף באמצעותם את v57.
- לכן certificationStatus נשאר pending-backfill ו-clientFacingCertified נשאר false עד לתיקון מפורש של ארטיפקט v57, הידע הקנוני וה-executor לפי סדר Source Closure.
`;
status = replaceOnce(status, '\n## כלל הפעלה בזמן ה-Backfill', p211Audit + '\n## כלל הפעלה בזמן ה-Backfill', 'status p211 audit insertion');
write(statusPath, status);

const workPath = 'HALL_WISDOM_PROFESSIONAL_VERDICT_SAFETY_WORK_ORDER.md';
let work = read(workPath);
const workUpdate = `

## 7. עדכון Backfill — Batch 02

הוסמכו רטרואקטיבית ארבע שיטות נוספות: p204 מצב קודם של האישה, p204 גודל המוהר, p206 מציאת חן בעיני השואל ו-p206 רצון השואל בדבר. בכל אחת נבדקו Question Scope, No-Inverse, Method Isolation ומקרי קצה שמנסים להרחיב את הדין מעבר ללשונו.

באותו סבב p211 פירוק/יציבות נישואין לא הוסמך. אימות מול הסריקה הערבית בעמ׳ 211 חשף ענפים נוספים שאינם מיוצגים כיום במלואם ב-v57 התפעולי וב-executor. מאחר שהערבית היא verification-only, אין לבצע תיקון שקט. p211 נשאר runnable לצורכי QA בלבד, אך client-facing חסום עד Source Closure מפורש.

מצב לאחר Batch 02: 9 מתוך 43 מנועים runnable מוסמכים מקצועית; 34 ממתינים ל-Backfill. גילוי פער ב-Backfill אינו כישלון של התהליך אלא מטרתו: מנוע לא מקבל certified עד שהפסק, גבולותיו וכל ענפי המקור הנדרשים סגורים.
`;
work = work.trimEnd() + workUpdate + '\n';
write(workPath, work);

console.log('Professional Verdict Safety backfill batch 02 patch applied.');
