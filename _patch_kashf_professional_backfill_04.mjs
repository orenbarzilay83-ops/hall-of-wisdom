#!/usr/bin/env node
import fs from 'node:fs';

function replaceOnce(text, from, to, label) {
  if (!text.includes(from)) throw new Error('Missing anchor: ' + label);
  return text.replace(from, to);
}

// ---------------------------------------------------------------------------
// 1. Professional Verdict Safety registry/policies
// ---------------------------------------------------------------------------
{
  const path = 'goral-hachol/intelligence/kashf-professional-verdict-safety.js';
  let text = fs.readFileSync(path, 'utf8');

  text = replaceOnce(
    text,
    "export const KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION = 'kashf-professional-verdict-safety-v4';",
    "export const KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION = 'kashf-professional-verdict-safety-v5';",
    'safety version v4->v5',
  );

  text = replaceOnce(
    text,
    "const P265_CLOTHING_LUCK_METHOD = 'clothing.p264-265.luck';",
    "const P265_CLOTHING_LUCK_METHOD = 'clothing.p264-265.luck';\nconst P191_PREGNANCY_EXISTS_METHOD = 'pregnancy.p191.existsH5SilentEmpty';\nconst P191_PREGNANCY_GENDER_METHOD = 'pregnancy.p191.genderH5';\nconst P196_ILLNESS_RECOVERY_METHOD = 'illness.p196.outcomeH15';\nconst P188_HIDDEN_STILL_THERE_METHOD = 'hidden.p188.isStillThere';\nconst P224_THIEF_RELATIONSHIP_METHOD = 'theft.p224.relationshipH7Recurrence';",
    'batch04 constants',
  );

  const policies = String.raw`
function p191PregnancyExistsPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-04',
    goldenCaseIds: freezeArray(['PV-BF04-P191-EXISTS-SILENT', 'PV-BF04-P191-EXISTS-EMPTY', 'PV-BF04-P191-EXISTS-UNRESOLVED']),
    policyId: 'p191-pregnancy-existence-silent-empty-v1',
    questionScopeHebrew: 'עצם קיום ההריון לפי סיווג שותקת/ריקה של H5, עמ׳ 191',
    decisiveRuleHebrew: 'H5 שותקת => ההריון נכון; H5 ריקה => ההריון בטל. צורה שאינה באחת משתי הקבוצות נשארת ללא הכרעה בכלל זה.',
    oneWayBranches: freezeArray([
      'H5 שותקת => ההריון נכון',
      'H5 ריקה => ההריון בטל',
    ]),
    forbiddenInversions: freezeArray([
      'אין להחליף את סיווג שותקת/ריקה בסיווג מיטיב/מזיק.',
      'צורה שאינה שותקת ואינה ריקה אינה מוכיחה הריון או היעדר הריון.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'pregnancy.p191.genderH5 — מין הוולד הוא דין נפרד.',
      'pregnancy.p191.childSafetyH1H6H8 — שלום הוולד הוא דין נפרד.',
      'pregnancy.p191.deliveryDifficultyH1H5H15 ושאר דיני לידה/בריאות.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'מין הוולד',
      'שלום הוולד או בריאותו',
      'קלות או קושי הלידה',
      'מועד הלידה',
    ]),
  });
}

function p191PregnancyGenderPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-04',
    goldenCaseIds: freezeArray(['PV-BF04-P191-GENDER-MALE', 'PV-BF04-P191-GENDER-FEMALE', 'PV-BF04-P191-GENDER-UNRESOLVED']),
    policyId: 'p191-pregnancy-gender-h5-v1',
    questionScopeHebrew: 'מין הוולד לפי הסיווג הזכרי/נקבי של H5, עמ׳ 191',
    decisiveRuleHebrew: 'H5 זכרית => הוולד זכר; H5 נקבית => הוולד נקבה. צורה שאינה מוכרעת בסיווג זה נשארת ללא הכרעה.',
    oneWayBranches: freezeArray([
      'H5 זכרית => הוולד זכר',
      'H5 נקבית => הוולד נקבה',
    ]),
    forbiddenInversions: freezeArray([
      'צורה שאינה מסווגת זכרית אינה הופכת אוטומטית לנקבית, ולהפך.',
      'שיטת המין אינה מוכיחה שעצם ההריון קיים.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'pregnancy.p191.existsH5SilentEmpty — קיום ההריון הוא דין נפרד.',
      'pregnancy.p191.childSafetyH1H6H8 — שלום הוולד הוא דין נפרד.',
      'שיטות מין נוספות בעמודים הבאים אינן מצביעות בתוך השיטה הזאת.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'יש הריון משום שהצורה זכרית או נקבית',
      'הוולד בריא או בטוח',
      'הלידה תהיה קלה או קשה',
    ]),
  });
}

function p196IllnessRecoveryPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-04',
    goldenCaseIds: freezeArray(['PV-BF04-P196-RECOVERS', 'PV-BF04-P196-PROLONGED', 'PV-BF04-P196-MIXED']),
    policyId: 'p196-illness-recovery-h15-v1',
    questionScopeHebrew: 'החלמת החולה/התארכות המחלה לפי H15, עמ׳ 196',
    decisiveRuleHebrew: 'H15 מיטיב => החולה יתרפא. H15 מזיק => המחלה תתארך. ממוזג אינו מוכרע בכלל זה.',
    oneWayBranches: freezeArray([
      'H15 מיטיב => החולה יתרפא',
      'H15 מזיק => המחלה תתארך',
    ]),
    forbiddenInversions: freezeArray([
      'התארכות המחלה אינה פסק שהחולה לעולם לא יחלים.',
      'H15 מזיק אינו דין מוות.',
      'צורה ממוזגת אינה מקודמת לפי נטייתה להחלמה או להתארכות.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'illness.bodyPart.h6Figure — מיקום החולי בגוף הוא דין נפרד.',
      'דיני חיים/מוות, רפואה, סיבת המחלה ושאר כללי החולה בעמ׳ 196–202.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'החולה ימות',
      'החולה לעולם לא יחלים',
      'משך המחלה במספר ימים/שבועות/חודשים',
      'האיבר החולה בגוף',
    ]),
  });
}

function p188HiddenStillTherePolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-04',
    goldenCaseIds: freezeArray(['PV-BF04-P188-PRESENT', 'PV-BF04-P188-NOT-PRESENT', 'PV-BF04-P188-NO-MAJORITY']),
    policyId: 'p188-hidden-still-there-all-six-v1',
    questionScopeHebrew: 'האם דבר נסתר שכבר נשאל עליו עדיין נמצא במקום הנבדק, עמ׳ 188',
    decisiveRuleHebrew: 'H1,H2,H4,H13,H14,H15 כולם חייבים להיות מיטיבים טהורים => הדבר שם; אם התנאי אינו מתקיים => אינו שם. אין כלל רוב.',
    oneWayBranches: freezeArray([
      'כל H1,H2,H4,H13,H14,H15 מיטיבים => הדבר שם',
      'אחד או יותר מן הבתים הנדרשים אינו מיטיב => הדבר אינו שם לפי הכלל',
    ]),
    forbiddenInversions: freezeArray([]),
    excludedFromPrimaryVerdict: freezeArray([
      'עצם קיומו של מטמון שלא הונח בשאלה.',
      'מיקום מדויק, כיוון, עומק, שווי או זהות מי שהסתיר.',
      'hidden.p188.quarterDirection ושיטות כיוון/עומק נפרדות.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'יש מטמון במקום משום שהשיטה יצאה חיובית',
      'הדבר נמצא בכיוון מסוים או בעומק מסוים',
      'חמישה מתוך שישה בתים מיטיבים ולכן הדבר כנראה שם',
    ]),
  });
}

function p224ThiefRelationshipPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-04',
    goldenCaseIds: freezeArray(['PV-BF04-P224-RECURRENCE-H4', 'PV-BF04-P224-NO-RECURRENCE']),
    policyId: 'p224-thief-relationship-h7-recurrence-v1',
    questionScopeHebrew: 'הקשר/הזיקה של הגנב לפי הבית שבו צורת H7 חוזרת, עמ׳ 224–225',
    decisiveRuleHebrew: 'צורת H7 היא נקודת הייחוס. רק חזרתה בבית אחר מפעילה את תיאור הקשר שנמסר לאותו בית; ללא חזרה או ללא הוראת מקור לאותו בית אין להשלים קשר מן הדעת.',
    oneWayBranches: freezeArray([
      'חזרת צורת H7 בבית בעל הוראת מקור => מתארים רק את הקשר שנמסר לאותו בית',
      'אין חזרת H7 בבית אחר => אין קשר מוכרע בכלל זה',
    ]),
    forbiddenInversions: freezeArray([
      'אי-חזרה אינה מוכיחה שהגנב זר.',
      'בית שאין לו הוראת מקור מפורשת אינו מקבל משמעות כללית מן הדעת.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'theft.p225.thiefDescriptionH7 — תיאור פיזי של הגנב הוא דין נפרד.',
      'זהות של אדם מסוים, שם, גיל, מרחק מספרי או מיקום החפץ.',
      'lostItem.p202.returnH6H8 ושאר דיני אבדה אינם חלק משיטת הקשר.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'פלוני הוא הגנב',
      'הגנב נמצא במרחק מסוים',
      'כך נראה הגנב',
      'החפץ נמצא במקום מסוים',
    ]),
  });
}

`;

  text = replaceOnce(
    text,
    'const METHOD_POLICIES = Object.freeze({',
    policies + 'const METHOD_POLICIES = Object.freeze({',
    'batch04 policies',
  );

  text = replaceOnce(
    text,
    "  [P265_CLOTHING_LUCK_METHOD]: p265ClothingLuckPolicy(),\n});",
    "  [P265_CLOTHING_LUCK_METHOD]: p265ClothingLuckPolicy(),\n  [P191_PREGNANCY_EXISTS_METHOD]: p191PregnancyExistsPolicy(),\n  [P191_PREGNANCY_GENDER_METHOD]: p191PregnancyGenderPolicy(),\n  [P196_ILLNESS_RECOVERY_METHOD]: p196IllnessRecoveryPolicy(),\n  [P188_HIDDEN_STILL_THERE_METHOD]: p188HiddenStillTherePolicy(),\n  [P224_THIEF_RELATIONSHIP_METHOD]: p224ThiefRelationshipPolicy(),\n});",
    'batch04 method policy registry',
  );

  fs.writeFileSync(path, text, 'utf8');
}

// ---------------------------------------------------------------------------
// 2. Golden/regression tests for the five certifications
// ---------------------------------------------------------------------------
{
  const path = '_test_kashf_professional_verdict_safety.mjs';
  let text = fs.readFileSync(path, 'utf8');

  text = replaceOnce(
    text,
    "assert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.length === 14, 'certification registry contains fourteen professionally certified methods');",
    "assert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.length === 19, 'certification registry contains nineteen professionally certified methods');",
    'certified method count 14->19',
  );

  text = replaceOnce(
    text,
    "  'clothing.p264-265.luck',\n]) {",
    "  'clothing.p264-265.luck',\n  'pregnancy.p191.existsH5SilentEmpty',\n  'pregnancy.p191.genderH5',\n  'illness.p196.outcomeH15',\n  'hidden.p188.isStillThere',\n  'theft.p224.relationshipH7Recurrence',\n]) {",
    'certified method list batch04',
  );

  const tests = String.raw`

console.log('\n--- Professional backfill batch 04 ---');

// PV-BF04-P191 existence — use silent/empty only; never substitute fortune.
const p191ExistsYes = buildKashfCanonicalAiBridge({ questionId: 'q-pregnancy', questionText: 'האם יש הריון?', board: makeBoard({ 5:'2111' }) });
assert(p191ExistsYes.canonicalReading?.primaryFormula?.result?.executorResult?.classification === 'silent', 'p191 existence silent H5 uses the exact silent class');
assert(p191ExistsYes.canonicalReading?.overallPositive === true, 'p191 silent H5 gives the explicit pregnancy-exists branch');
assert(p191ExistsYes.professionalVerdictSafety?.certificationStatus === 'certified', 'p191 pregnancy existence passed professional backfill');
assert(p191ExistsYes.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenInversions?.some((x) => x.includes('מיטיב/מזיק')), 'p191 existence policy forbids replacing silent/empty with benefic/malefic');
const p191ExistsNo = buildKashfCanonicalAiBridge({ questionId: 'q-pregnancy', questionText: 'האם יש הריון?', board: makeBoard({ 5:'1112' }) });
assert(p191ExistsNo.canonicalReading?.primaryFormula?.result?.executorResult?.classification === 'empty', 'p191 existence empty H5 uses the exact empty class');
assert(p191ExistsNo.canonicalReading?.overallPositive === false, 'p191 empty H5 gives the explicit pregnancy-nullified branch');
const p191ExistsUnresolved = buildKashfCanonicalAiBridge({ questionId: 'q-pregnancy', questionText: 'האם יש הריון?', board: makeBoard({ 5:'1111' }) });
assert(p191ExistsUnresolved.canonicalReading?.overallPositive === null, 'p191 H5 outside silent/empty remains unresolved');

// PV-BF04-P191 gender — categorical male/female needs exact-draft protection.
const p191GenderMale = buildKashfCanonicalAiBridge({ questionId: 'q-gender', questionText: 'מה מין הוולד?', board: makeBoard({ 5:'1112' }) });
assert(p191GenderMale.canonicalReading?.primaryFormula?.result?.executorResult?.gender === 'male', 'p191 masculine H5 gives male');
assert(p191GenderMale.canonicalReading?.overallPositive === null, 'p191 gender remains categorical/non-binary polarity');
assert(p191GenderMale.professionalVerdictSafety?.certificationStatus === 'certified', 'p191 gender passed professional backfill');
const p191GenderExact = validateKashfAdvisorOutput(auditOutputForSafety(p191GenderMale.professionalVerdictSafety, { draft: p191GenderMale.professionalVerdictSafety.authoritativeClientDraftHebrew, draftPolarity: 'non-binary' }));
assert(validateKashfAdvisorVerdictAlignment(p191GenderExact.value, p191GenderMale.professionalVerdictSafety).ok === true, 'p191 exact male category text passes server gate');
const p191GenderWrong = validateKashfAdvisorOutput(auditOutputForSafety(p191GenderMale.professionalVerdictSafety, { draft: 'לפי כשף עמ׳ 191: הוולד נקבה.', draftPolarity: 'non-binary' }));
const p191GenderWrongAlignment = validateKashfAdvisorVerdictAlignment(p191GenderWrong.value, p191GenderMale.professionalVerdictSafety);
assert(p191GenderWrongAlignment.ok === false && p191GenderWrongAlignment.category === 'client-draft-not-exact-engine-text', 'server blocks male→female category replacement even though both are non-binary');
const p191GenderFemale = buildKashfCanonicalAiBridge({ questionId: 'q-gender', questionText: 'מה מין הוולד?', board: makeBoard({ 5:'2111' }) });
assert(p191GenderFemale.canonicalReading?.primaryFormula?.result?.executorResult?.gender === 'female', 'p191 feminine H5 gives female');
const p191GenderUnresolved = buildKashfCanonicalAiBridge({ questionId: 'q-gender', questionText: 'מה מין הוולד?', board: makeBoard({ 5:'1111' }) });
assert(p191GenderUnresolved.canonicalReading?.primaryFormula?.result?.executorResult?.gender === null, 'p191 unclassified H5 does not invent a gender');

// PV-BF04-P196 illness — malefic means prolongation, not death or permanent non-recovery.
const p196Recovery = buildKashfCanonicalAiBridge({ questionId: 'q-illness-heal', questionText: 'האם החולה יחלים?', board: makeBoard({ 15:'1122' }) });
assert(p196Recovery.canonicalReading?.primaryFormula?.result?.executorResult?.recoveryStatus === 'recovers', 'p196 benefic H15 gives explicit recovery');
assert(p196Recovery.canonicalReading?.overallPositive === true, 'p196 recovery branch is positive');
assert(p196Recovery.professionalVerdictSafety?.certificationStatus === 'certified', 'p196 illness recovery passed professional backfill');
const p196Prolonged = buildKashfCanonicalAiBridge({ questionId: 'q-illness-heal', questionText: 'האם החולה יחלים?', board: makeBoard({ 15:'1112' }) });
assert(p196Prolonged.canonicalReading?.primaryFormula?.result?.executorResult?.recoveryStatus === 'prolonged-illness', 'p196 malefic H15 means prolonged illness');
assert(p196Prolonged.canonicalReading?.primaryFormula?.result?.executorResult?.recovers === null && p196Prolonged.canonicalReading?.overallPositive === null, 'p196 prolongation is not inverted into categorical no-recovery');
assert(p196Prolonged.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenClientClaimsWithoutExplicitSelectedMethodBranch?.includes('החולה ימות'), 'p196 policy explicitly forbids inventing death');
const p196Mixed = buildKashfCanonicalAiBridge({ questionId: 'q-illness-heal', questionText: 'האם החולה יחלים?', board: makeBoard({ 15:'2212' }) });
assert(p196Mixed.canonicalReading?.overallPositive === null, 'p196 mixed H15 remains unresolved');

// PV-BF04-P188 hidden thing — all six required houses, no majority.
const p188Present = buildKashfCanonicalAiBridge({ questionId: 'q-treasure', questionText: 'האם הדבר הנסתר עדיין במקומו?', board: makeBoard({ 1:'1122', 2:'1122', 4:'1122', 13:'1122', 14:'1122', 15:'1122' }) });
assert(p188Present.canonicalReading?.primaryFormula?.result?.executorResult?.allBenefic === true, 'p188 all six required houses are pure benefic');
assert(p188Present.canonicalReading?.overallPositive === true, 'p188 all-six condition gives present-in-place');
assert(p188Present.professionalVerdictSafety?.certificationStatus === 'certified', 'p188 hidden-item method passed professional backfill');
const p188Absent = buildKashfCanonicalAiBridge({ questionId: 'q-treasure', questionText: 'האם הדבר הנסתר עדיין במקומו?', board: makeBoard({ 1:'1122', 2:'1122', 4:'1122', 13:'1122', 14:'1112', 15:'1122' }) });
assert(p188Absent.canonicalReading?.primaryFormula?.result?.executorResult?.nonBeneficHouses?.includes(14), 'p188 identifies the single failing required house');
assert(p188Absent.canonicalReading?.overallPositive === false, 'p188 one failing house triggers the explicit not-there branch');
assert(p188Absent.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenClientClaimsWithoutExplicitSelectedMethodBranch?.some((x) => x.includes('חמישה מתוך שישה')), 'p188 policy explicitly forbids invented 5/6 majority');

// PV-BF04-P224 thief relationship — recurrence describes a source-bounded relation, not identity.
const p224Relation = buildKashfCanonicalAiBridge({ questionId: 'q-thief-near', questionText: 'מה הקשר של הגנב לבעל הדבר?', board: makeBoard({ 4:'1121', 7:'1121' }) });
const p224RelationExec = p224Relation.canonicalReading?.primaryFormula?.result?.executorResult;
assert(p224RelationExec?.relationResolved === true, 'p224 H7 recurrence in H4 resolves a source-supported relation');
assert(JSON.stringify(p224RelationExec?.recurrenceHouses) === JSON.stringify([4]), 'p224 reference H7 itself is excluded and only H4 recurrence is used');
assert(String(p224RelationExec?.outputHebrew || '').includes('מי שנכנס לביתו'), 'p224 H4 recurrence preserves the p224 relationship text');
assert(String(p224RelationExec?.outputHebrew || '').includes('שורש קרבה: אב'), 'p224 H4 recurrence preserves the p225 kinship-root layer');
assert(p224Relation.canonicalReading?.overallPositive === null, 'p224 relationship is descriptive/non-binary');
assert(p224Relation.professionalVerdictSafety?.certificationStatus === 'certified', 'p224 thief relationship passed professional backfill');
assert(p224Relation.professionalVerdictSafety?.methodSpecificPolicy?.excludedFromPrimaryVerdict?.some((x) => x.includes('זהות של אדם מסוים')), 'p224 policy blocks named-person identification');
const p224NoRecurrence = buildKashfCanonicalAiBridge({ questionId: 'q-thief-near', questionText: 'מה הקשר של הגנב לבעל הדבר?', board: makeBoard({ 7:'1121' }) });
assert(p224NoRecurrence.canonicalReading?.primaryFormula?.result?.executorResult?.relationResolved === false, 'p224 no H7 recurrence remains unresolved');
assert(p224NoRecurrence.canonicalReading?.overallPositive === null, 'p224 no recurrence does not invent stranger/near/far polarity');
`;

  text = replaceOnce(
    text,
    "console.log(`\\nKashf professional verdict safety tests: ${passed} passed, ${failed} failed`);",
    tests + "\nconsole.log(`\\nKashf professional verdict safety tests: ${passed} passed, ${failed} failed`);",
    'batch04 tests before final summary',
  );

  fs.writeFileSync(path, text, 'utf8');
}

// ---------------------------------------------------------------------------
// 3. Backfill status document
// ---------------------------------------------------------------------------
{
  const path = 'HALL_WISDOM_KASHF_PROFESSIONAL_VERDICT_BACKFILL_STATUS.md';
  let text = fs.readFileSync(path, 'utf8');

  text = replaceOnce(
    text,
    '- מוסמכים מקצועית לאחר Batch 03: **14/43**.\n- ממתינים להסמכה רטרואקטיבית: **29/43**.',
    '- מוסמכים מקצועית לאחר Batch 04: **19/43**.\n- ממתינים להסמכה רטרואקטיבית: **24/43**.',
    'batch04 status counts',
  );

  text = replaceOnce(
    text,
    '| clothing.p264-265.luck | certified | PV-BF03-P265-* | H5/H11 קובעים מזל כללי; H10 מזיק הוא סייג נפרד ללבוש מלכים ואינו מבטל אוטומטית את הכללי |',
    '| clothing.p264-265.luck | certified | PV-BF03-P265-* | H5/H11 קובעים מזל כללי; H10 מזיק הוא סייג נפרד ללבוש מלכים ואינו מבטל אוטומטית את הכללי |\n| pregnancy.p191.existsH5SilentEmpty | certified | PV-BF04-P191-EXISTS-* | שותקת/ריקה בלבד; אין להחליף בסיווג מיטיב/מזיק |\n| pregnancy.p191.genderH5 | certified | PV-BF04-P191-GENDER-* | זכר/נקבה הוא פסק קטגוריאלי; אינו מוכיח קיום הריון |\n| illness.p196.outcomeH15 | certified | PV-BF04-P196-* | מיטיב=>יתרפא; מזיק=>המחלה תתארך, לא מוות ולא אי-החלמה נצחית |\n| hidden.p188.isStillThere | certified | PV-BF04-P188-* | כל ששת הבתים חייבים להיות מיטיבים; אין רוב ואין הוכחת מטמון מאפס |\n| theft.p224.relationshipH7Recurrence | certified | PV-BF04-P224-* | רק חזרת H7 בבית בעל הוראת מקור מתארת קשר; אין זיהוי אדם/מרחק |',
    'batch04 certified rows',
  );

  text += '\n\n## Batch 04 — Family / Health / Hidden / Theft\n\nBatch 04 הסמיך חמישה מנועים שמנגנון המקור שלהם כבר היה סגור ומבצעיהם היו runnable: קיום הריון לפי שותקת/ריקה, מין הוולד לפי זכר/נקבה, החלמת חולה לפי H15, הימצאות דבר נסתר לפי ששת הבתים, וקשר הגנב לפי חזרת H7. בכל החמישה נשמר Exact Client Draft Lock מ-Batch 03. p179 ו-p211 לא נכללו ונשארו חסומים ללקוח עד סגירת פערי המקור המתועדים.\n';

  fs.writeFileSync(path, text, 'utf8');
}

console.log('Professional Verdict Safety backfill batch 04 patch applied.');
