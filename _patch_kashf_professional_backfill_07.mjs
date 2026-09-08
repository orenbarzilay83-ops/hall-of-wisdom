#!/usr/bin/env node
import fs from 'node:fs';

const safetyPath = 'goral-hachol/intelligence/kashf-professional-verdict-safety.js';
const testPath = '_test_kashf_professional_verdict_safety.mjs';
const statusPath = 'HALL_WISDOM_KASHF_PROFESSIONAL_VERDICT_BACKFILL_STATUS.md';

function replaceOnce(text, from, to, label) {
  if (!text.includes(from)) throw new Error('Missing anchor: ' + label);
  if (text.indexOf(from) !== text.lastIndexOf(from)) throw new Error('Non-unique anchor: ' + label);
  return text.replace(from, to);
}

let safety = fs.readFileSync(safetyPath, 'utf8');
if (safety.includes('professional-backfill-07')) throw new Error('Batch 07 already applied to safety file');
safety = replaceOnce(
  safety,
  "export const KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION = 'kashf-professional-verdict-safety-v7';",
  "export const KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION = 'kashf-professional-verdict-safety-v8';",
  'safety version'
);

const constAnchor = "const P204_ATTENTION_METHOD = 'love.p204.attentionFireRows1713';";
const constBlock = `${constAnchor}\nconst P173_COMPLETION_METHOD = 'completion.p173.fireRows15910';\nconst P183_PLACE_TO_PLACE_METHOD = 'relocation.p183.h4h15';\nconst P182_SIBLING_RELATIONSHIP_METHOD = 'siblings.p182.h1h3';\nconst P238_TRAVEL_SUCCESS_METHOD = 'travel.p238.assemble1359';\nconst P199_BODY_PART_METHOD = 'illness.bodyPart.h6Figure';\nconst P191_CHILD_SAFETY_METHOD = 'pregnancy.p191.childSafetyH1H6H8';\nconst P191_DELIVERY_DIFFICULTY_METHOD = 'pregnancy.p191.deliveryDifficultyH1H5H15';\nconst P167_HIDDEN_ACTION_METHOD = 'spiritual.p167.hiddenActionAirRows46815';`;
safety = replaceOnce(safety, constAnchor, constBlock, 'batch07 constants');

const policyAnchor = '\nconst METHOD_POLICIES = Object.freeze({';
const policies = `

function p173CompletionPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-07',
    goldenCaseIds: freezeArray(['PV-BF07-P173-COMPLETE', 'PV-BF07-P173-NOT-COMPLETE', 'PV-BF07-P173-MUJASSAD']),
    policyId: 'p173-completion-fire-rows-15910-v1',
    questionScopeHebrew: 'האם העניין יושלם לפי ראשי H1,H5,H9,H10, עמ׳ 173',
    decisiveRuleHebrew: 'מרכיבים צורה משורת האש של H1,H5,H9,H10. חיצונית => העניין לא יושלם; פנימית => יושלם. גוף כפול/קבוע אינו מקבל ענף שלא נמסר.',
    oneWayBranches: freezeArray([
      'תוצאה חיצונית => העניין לא יושלם',
      'תוצאה פנימית => העניין יושלם',
    ]),
    forbiddenInversions: freezeArray([
      'תוצאה גוף-כפול אינה נדחפת בכוח לפנימית או לחיצונית.',
      'אין להשתמש בשיטת H1+H16 החלופית כדי לשנות את פסק השיטה שנבחרה.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'matter.p172.h17_h1011_thenCombine — תוצאת העניין היא שיטה נפרדת.',
      'החלופה H1+H16 המופיעה לאחר הכלל הראשי בעמ׳ 173.',
      'דמיר, H15, רוב בתים או משמעות כללית של הצורה.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'מתי העניין יושלם',
      'למה העניין יושלם או ייכשל',
      'תוצאה ממוזגת מוכיחה הצלחה חלקית',
    ]),
  });
}

function p183PlaceToPlacePolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-07',
    goldenCaseIds: freezeArray(['PV-BF07-P183-PLACE-GOOD', 'PV-BF07-P183-PLACE-BAD', 'PV-BF07-P183-PLACE-MIXED']),
    policyId: 'p183-place-to-place-h4h15-v1',
    questionScopeHebrew: 'טיב המקום שאליו עוברים לפי הולדת H4+H15, עמ׳ 183',
    decisiveRuleHebrew: 'הולד H4+H15: מיטיב => המקום טוב ומבורך; מזיק => מזיק המקום, קושי ועמל; ממוזג => המקום ממוצע.',
    oneWayBranches: freezeArray([
      'תוצאת H4+H15 מיטיבה => המקום טוב ומבורך',
      'תוצאת H4+H15 מזיקה => קושי ועמל במקום',
      'תוצאת H4+H15 ממוזגת => המקום ממוצע',
    ]),
    forbiddenInversions: freezeArray([]),
    excludedFromPrimaryVerdict: freezeArray([
      'relocation.p183.currentVsNewPlace — השוואת המקום הנוכחי למעבר היא שיטה נפרדת.',
      'relocation.p183.stayMoveH1H2 — האם להישאר או לעבור היא שיטה נפרדת.',
      'משמעות כללית של H4/H15 מעבר להולדה המפורשת.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'עדיף לעבור מאשר להישאר',
      'עדיף להישאר במקום הנוכחי',
      'המקום בטוח או מסוכן במובן עובדתי',
    ]),
  });
}

function p182SiblingRelationshipPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-07',
    goldenCaseIds: freezeArray(['PV-BF07-P182-REL-GOOD', 'PV-BF07-P182-REL-BAD', 'PV-BF07-P182-REL-MIXED']),
    policyId: 'p182-sibling-relationship-h1h3-v1',
    questionScopeHebrew: 'הסכמה או קלקול ביחסי אחים לפי הולדת H1+H3, עמ׳ 182',
    decisiveRuleHebrew: 'הולד H1+H3: מיטיב => הסכמה; מזיק => קלקול מידותיהם. ממוזג נשאר ללא הכרעה בשיטה הזאת.',
    oneWayBranches: freezeArray([
      'תוצאת H1+H3 מיטיבה => הסכמה בין האחים',
      'תוצאת H1+H3 מזיקה => קלקול ביחסים/במידותיהם',
    ]),
    forbiddenInversions: freezeArray([
      'תוצאה ממוזגת אינה הופכת אוטומטית להסכמה חלקית או למריבה חלקית.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'siblings.p182.seniority — דין מי הגדול/בכור הוא שיטה נפרדת.',
      'הולדות H5+H3 ו-H5+H13 הנזכרות בהמשך המקור אינן מצביעות לתוך השיטה הקנונית הזאת.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'מי מן האחים אשם',
      'מי מן האחים גדול יותר',
      'הקשר יישאר כך לצמיתות',
    ]),
  });
}

function p238TravelSuccessPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-07',
    goldenCaseIds: freezeArray(['PV-BF07-P238-TRAVEL-GOOD', 'PV-BF07-P238-TRAVEL-BAD', 'PV-BF07-P238-TRAVEL-MIXED']),
    policyId: 'p238-travel-success-assemble-1359-v1',
    questionScopeHebrew: 'טיב/הצלחת המסע לפי הרכבת ארבעת היסודות מ-H1,H3,H5,H9, עמ׳ 238',
    decisiveRuleHebrew: 'מרכיבים צורה מכל ארבע שורות היסוד של H1,H3,H5,H9. מיטיבה => המסע נאה; מזיקה => יש להיזהר מן המסע; ממוזגת אינה מוכרעת בינארית בכלל זה.',
    oneWayBranches: freezeArray([
      'הצורה המורכבת מיטיבה => המסע נאה',
      'הצורה המורכבת מזיקה => יש להיזהר מן המסע',
    ]),
    forbiddenInversions: freezeArray([
      'צורה ממוזגת אינה מקודמת לפי נטייתה להצלחה או לכישלון.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'travel.p238.timeSelectionH9H4 — בחירת זמן לפי צורות נקובות היא דין נפרד.',
      'travel.p244.returnH1H2H9 — חזרת הנוסע היא דין נפרד.',
      'כיוון, זמן, מועד חזרה או סכנה מסוימת שאינם חלק מן הכלל.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'הנוסע יחזור או לא יחזור',
      'מועד הנסיעה או החזרה',
      'תתרחש תאונה או סכנה מסוימת',
    ]),
  });
}

function p199BodyPartPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-07',
    goldenCaseIds: freezeArray(['PV-BF07-P199-MAPPED', 'PV-BF07-P199-UNLISTED']),
    policyId: 'p199-body-part-h6-source-table-v1',
    questionScopeHebrew: 'שיבוץ איבר החולי לפי הצורה שב-H6 וטבלת עמ׳ 199',
    decisiveRuleHebrew: 'קוראים את צורת H6 ומחזירים רק את האיבר המופיע מולה בטבלת המקור. נלחם (1121) אינו מופיע בטבלה ולכן נשאר ללא איבר מוכרע.',
    oneWayBranches: freezeArray([
      'צורת H6 שמופיעה בטבלת עמ׳ 199 => מחזירים בדיוק את האיבר המשויך לה בטבלה',
      'צורה שאינה מופיעה בטבלה => אין מיפוי איבר מן המקור',
    ]),
    forbiddenInversions: freezeArray([
      'חוסר מיפוי לצורה אינו מתיר לנחש איבר לפי יסוד, כוכב או משמעות כללית.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'אבחנה רפואית, סיבת מחלה, חומרת מחלה, טיפול או פרוגנוזה רפואית.',
      'illness.p196.outcomeH15 — החלמה/התארכות המחלה היא שיטה נפרדת.',
      'משמעות גוף כללית ממקורות אחרים או משיטות אחרות.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'זהו אבחון רפואי',
      'זה האיבר הפגוע בוודאות מבחינה רפואית',
      'יש מחלה מסוימת באיבר',
      'יש צורך בטיפול מסוים',
    ]),
  });
}

function p191ChildSafetyPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-07',
    goldenCaseIds: freezeArray(['PV-BF07-P191-CHILD-SAFE', 'PV-BF07-P191-CHILD-FEAR', 'PV-BF07-P191-CHILD-SEVERE']),
    policyId: 'p191-child-safety-h1h6h8-v1',
    questionScopeHebrew: 'שלום הוולד לפי H1 ובדיקת האזהרה הנפרדת H6+H8, עמ׳ 191',
    decisiveRuleHebrew: 'H1 מיטיב => עדות לשלום הוולד; H1 מזיק => יש לחשוש עליו. H6+H8 שניהם מזיקים => אזהרת מקור חמורה שהוולד עלול לצאת מת. האזהרה היא לשון סיכון ולא ודאות מוות.',
    oneWayBranches: freezeArray([
      'H1 מיטיב, בלי תנאי האזהרה H6+H8 => עדות לשלום הוולד',
      'H1 מזיק => יש לחשוש על הוולד',
      'H6+H8 שניהם מזיקים => אזהרת מקור חמורה',
    ]),
    forbiddenInversions: freezeArray([
      'חשש אינו פסק שהוולד לא ישרוד.',
      'אזהרת H6+H8 אינה הופכת לאישור ודאי של מוות.',
      'ממוזג אינו מקודם לפי נטייתו למיטיב או למזיק.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'pregnancy.p191.existsH5SilentEmpty — עצם קיום ההריון הוא דין נפרד.',
      'pregnancy.p191.genderH5 — מין הוולד הוא דין נפרד.',
      'pregnancy.p191.deliveryDifficultyH1H5H15 — קלות הלידה היא דין נפרד.',
      'child.p194.healthTrajectoryH6H8 — מסלול בריאות הילד הוא דין נפרד.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'הוולד ימות בוודאות',
      'הוולד יחיה בוודאות בעולם הממשי',
      'מין הוולד',
      'הלידה תהיה קלה או קשה',
    ]),
  });
}

function p191DeliveryDifficultyPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-07',
    goldenCaseIds: freezeArray(['PV-BF07-P191-DELIVERY-EASY', 'PV-BF07-P191-DELIVERY-DIFFICULT', 'PV-BF07-P191-DELIVERY-CONFLICT']),
    policyId: 'p191-delivery-difficulty-h1h5h15-v1',
    questionScopeHebrew: 'קלות או קושי הלידה לפי H1,H5 ועדות H15, עמ׳ 191/194',
    decisiveRuleHebrew: 'H1+H5 זכריים => סימן ללידה קלה, במיוחד אם שניהם מתהפכים. H5 קבוע => סימן ללידה קשה. אם שני הסימנים מתקיימים יחד, אין במקור כלל קדימות ולכן נשמרת סתירה.',
    oneWayBranches: freezeArray([
      'H1+H5 זכריים וללא סימן קושי מתנגש => לידה קלה',
      'H5 קבוע וללא סימן קלות מתנגש => לידה קשה',
      'סימן קלות וסימן קושי יחד => סתירת מקור, ללא הכרעה בכוח',
    ]),
    forbiddenInversions: freezeArray([
      'העדר זכריות בשני הבתים אינו לבדו מוכיח לידה קשה.',
      'העדר H5 קבוע אינו לבדו מוכיח לידה קלה.',
      'H15 אינו משמש הצבעת רוב או שובר שוויון שלא נמסר.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'pregnancy.p191.existsH5SilentEmpty — קיום ההריון.',
      'pregnancy.p191.genderH5 — מין הוולד.',
      'pregnancy.p191.childSafetyH1H6H8 — שלום הוולד.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'מין הוולד',
      'הוולד יהיה בריא או לא',
      'מועד הלידה',
      'תוצאה רפואית ודאית של הלידה',
    ]),
  });
}

function p167HiddenActionPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-07',
    goldenCaseIds: freezeArray(['PV-BF07-P167-HIDDEN-ACTION', 'PV-BF07-P167-NO-HIDDEN-ACTION']),
    policyId: 'p167-hidden-action-air-rows-46815-v1',
    questionScopeHebrew: 'האם מאחורי הדבר יש פעולה נסתרת לפי אוויר H4,H6,H8,H15, עמ׳ 167',
    decisiveRuleHebrew: 'מרכיבים צורה משורת האוויר של H4,H6,H8 והמאזן H15. אם התוצאה מזיקה => יש פעולה מאחורי הדבר; ואם לא => אין פעולה לפי כלל זה.',
    oneWayBranches: freezeArray([
      'הצורה המורכבת מזיקה => יש פעולה מאחורי הדבר',
      'הצורה המורכבת אינה מזיקה => אין פעולה מאחורי הדבר לפי הכלל',
    ]),
    forbiddenInversions: freezeArray([]),
    excludedFromPrimaryVerdict: freezeArray([
      'כישוף, ג׳ין, עין הרע, קללה או סוג פעולה רוחנית מסוים.',
      'זהות אדם שעשה פעולה.',
      'spiritual.jinnType.unsupported ו-spiritual.sorcererIdentity.unsupported.',
      'כל שורת יסוד שאינה אוויר וכל בית שאינו H4,H6,H8,H15.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'יש כישוף',
      'יש ג׳ין',
      'יש עין הרע',
      'פלוני עשה את הפעולה',
      'אין שום השפעה רוחנית מכל סוג',
    ]),
  });
}
`;
safety = replaceOnce(safety, policyAnchor, policies + policyAnchor, 'policy insertion');

const mapAnchor = "  [P204_ATTENTION_METHOD]: p204AttentionPolicy(),\n});";
const mapBlock = `  [P204_ATTENTION_METHOD]: p204AttentionPolicy(),\n  [P173_COMPLETION_METHOD]: p173CompletionPolicy(),\n  [P183_PLACE_TO_PLACE_METHOD]: p183PlaceToPlacePolicy(),\n  [P182_SIBLING_RELATIONSHIP_METHOD]: p182SiblingRelationshipPolicy(),\n  [P238_TRAVEL_SUCCESS_METHOD]: p238TravelSuccessPolicy(),\n  [P199_BODY_PART_METHOD]: p199BodyPartPolicy(),\n  [P191_CHILD_SAFETY_METHOD]: p191ChildSafetyPolicy(),\n  [P191_DELIVERY_DIFFICULTY_METHOD]: p191DeliveryDifficultyPolicy(),\n  [P167_HIDDEN_ACTION_METHOD]: p167HiddenActionPolicy(),\n});`;
safety = replaceOnce(safety, mapAnchor, mapBlock, 'METHOD_POLICIES batch07 map');
fs.writeFileSync(safetyPath, safety);

let tests = fs.readFileSync(testPath, 'utf8');
if (tests.includes('Professional backfill batch 07')) throw new Error('Batch 07 tests already present');
tests = replaceOnce(
  tests,
  "assert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.length === 29, 'certification registry contains twenty-nine professionally certified methods');",
  "assert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.length === 37, 'certification registry contains thirty-seven professionally certified methods');",
  'certified count assertion'
);
const certifiedListAnchor = "  'love.p204.attentionFireRows1713',\n]) {";
const certifiedListBlock = `  'love.p204.attentionFireRows1713',\n  'completion.p173.fireRows15910',\n  'relocation.p183.h4h15',\n  'siblings.p182.h1h3',\n  'travel.p238.assemble1359',\n  'illness.bodyPart.h6Figure',\n  'pregnancy.p191.childSafetyH1H6H8',\n  'pregnancy.p191.deliveryDifficultyH1H5H15',\n  'spiritual.p167.hiddenActionAirRows46815',\n]) {`;
tests = replaceOnce(tests, certifiedListAnchor, certifiedListBlock, 'certified method list');

const finalAnchor = "\nconsole.log(`\\nKashf professional verdict safety tests: ${passed} passed, ${failed} failed`);\nif (failed) process.exit(1);";
const batch07Tests = `

console.log('\\n--- Professional backfill batch 07 ---');

// PV-BF07-P173-* — exact fire-row completion method; no H1+H16 alternate vote.
const p173Complete = buildKashfCanonicalAiBridge({ questionId: 'q-success', questionText: 'האם העניין יושלם', board: makeBoard({ 1:'2111', 5:'1112', 9:'1112', 10:'1112' }) });
assert(p173Complete.resolution?.kashfMethodId === 'completion.p173.fireRows15910', 'p173 exact completion route selected');
assert(p173Complete.canonicalReading?.primaryFormula?.result?.resultPattern === '2111', 'p173 fire-row fixture builds 2111');
assert(p173Complete.canonicalReading?.overallPositive === true, 'p173 internal result gives explicit completion');
assert(p173Complete.professionalVerdictSafety?.certificationStatus === 'certified', 'p173 completion passed professional backfill');
assert(p173Complete.professionalVerdictSafety?.methodSpecificPolicy?.excludedFromPrimaryVerdict?.some((x) => x.includes('H1+H16')), 'p173 policy excludes alternate H1+H16 method');
const p173No = buildKashfCanonicalAiBridge({ questionId: 'q-success', questionText: 'האם העניין יושלם', board: makeBoard({ 1:'1112', 5:'1112', 9:'1112', 10:'2111' }) });
assert(p173No.canonicalReading?.primaryFormula?.result?.resultPattern === '1112', 'p173 external fixture builds 1112');
assert(p173No.canonicalReading?.overallPositive === false, 'p173 external result gives explicit non-completion');

// PV-BF07-P183-PLACE-* — H4+H15 has explicit good/bad/mixed branches.
const p183PlaceGood = buildKashfCanonicalAiBridge({ questionId: 'q-move-city', questionText: 'מעבר ממקום למקום', board: makeBoard({ 4:'1111', 15:'2211' }) });
assert(p183PlaceGood.resolution?.kashfMethodId === 'relocation.p183.h4h15', 'p183 place-to-place exact route selected');
assert(p183PlaceGood.canonicalReading?.primaryFormula?.result?.resultPattern === '1122', 'p183 good fixture derives 1122');
assert(p183PlaceGood.canonicalReading?.overallPositive === true, 'p183 benefic H4+H15 gives good/blessed place');
assert(p183PlaceGood.professionalVerdictSafety?.certificationStatus === 'certified', 'p183 place-to-place passed professional backfill');
const p183PlaceBad = buildKashfCanonicalAiBridge({ questionId: 'q-move-city', questionText: 'מעבר ממקום למקום', board: makeBoard({ 4:'1111', 15:'2221' }) });
assert(p183PlaceBad.canonicalReading?.primaryFormula?.result?.resultPattern === '1112', 'p183 bad fixture derives 1112');
assert(p183PlaceBad.canonicalReading?.overallPositive === false, 'p183 malefic H4+H15 gives hardship branch');
const p183PlaceMixed = buildKashfCanonicalAiBridge({ questionId: 'q-move-city', questionText: 'מעבר ממקום למקום', board: makeBoard({ 4:'2222', 15:'2222' }) });
assert(p183PlaceMixed.canonicalReading?.primaryFormula?.result?.classification?.saadNahs === 'mixed', 'p183 mixed fixture preserves mixed classification');
assert(p183PlaceMixed.canonicalReading?.overallPositive === null, 'p183 mixed place remains non-binary');

// PV-BF07-P182-REL-* — H1+H3 only; seniority and other sibling variants remain separate.
const p182RelGood = buildKashfCanonicalAiBridge({ questionId: 'q-siblings', questionText: 'יחסים בין אחים', board: makeBoard({ 1:'1111', 3:'2211' }) });
assert(p182RelGood.resolution?.kashfMethodId === 'siblings.p182.h1h3', 'p182 sibling relationship exact route selected');
assert(p182RelGood.canonicalReading?.overallPositive === true, 'p182 benefic H1+H3 gives agreement');
assert(p182RelGood.professionalVerdictSafety?.certificationStatus === 'certified', 'p182 sibling relationship passed professional backfill');
const p182RelBad = buildKashfCanonicalAiBridge({ questionId: 'q-siblings', questionText: 'יחסים בין אחים', board: makeBoard({ 1:'1111', 3:'2221' }) });
assert(p182RelBad.canonicalReading?.overallPositive === false, 'p182 malefic H1+H3 gives corruption/dispute branch');
assert(p182RelGood.professionalVerdictSafety?.methodSpecificPolicy?.excludedFromPrimaryVerdict?.some((x) => x.includes('seniority')), 'p182 relationship policy isolates sibling-seniority method');

// PV-BF07-P238-TRAVEL-* — exact four-house all-row assembly.
const p238Good = buildKashfCanonicalAiBridge({ questionId: 'q-travel-safe', questionText: 'האם המסע טוב', board: makeBoard({ 1:'1122', 3:'2222', 5:'2222', 9:'2222' }) });
assert(p238Good.resolution?.kashfMethodId === 'travel.p238.assemble1359', 'p238 travel success exact route selected');
assert(p238Good.canonicalReading?.primaryFormula?.result?.resultPattern === '1122', 'p238 assembly preserves benefic fixture');
assert(p238Good.canonicalReading?.overallPositive === true, 'p238 benefic assembly gives good travel');
assert(p238Good.professionalVerdictSafety?.certificationStatus === 'certified', 'p238 travel success passed professional backfill');
const p238Bad = buildKashfCanonicalAiBridge({ questionId: 'q-travel-safe', questionText: 'האם המסע טוב', board: makeBoard({ 1:'1112', 3:'2222', 5:'2222', 9:'2222' }) });
assert(p238Bad.canonicalReading?.primaryFormula?.result?.resultPattern === '1112', 'p238 assembly preserves malefic fixture');
assert(p238Bad.canonicalReading?.overallPositive === false, 'p238 malefic assembly gives caution branch');
assert(p238Good.professionalVerdictSafety?.methodSpecificPolicy?.excludedFromPrimaryVerdict?.some((x) => x.includes('timeSelection')), 'p238 success policy isolates named-figure time-selection method');

// PV-BF07-P199-* — H6 source table only; missing table row remains unresolved.
const p199Mapped = buildKashfCanonicalAiBridge({ questionText: 'איפה בגוף החולי', board: makeBoard({ 6:'1112' }) });
assert(p199Mapped.resolution?.kashfMethodId === 'illness.bodyPart.h6Figure', 'p199 body-part free text resolves exact method');
assert(p199Mapped.canonicalReading?.primaryFormula?.result?.executorResult?.bodyPartHebrew === 'הרגל השמאלית', 'p199 source table maps 1112 to left leg');
assert(p199Mapped.professionalVerdictSafety?.certificationStatus === 'certified', 'p199 body-part method passed professional backfill');
assert(p199Mapped.professionalVerdictSafety?.authoritativePolarity === 'non-binary', 'p199 body-part result stays categorical/non-binary');
const p199Unlisted = buildKashfCanonicalAiBridge({ questionText: 'איפה בגוף החולי', board: makeBoard({ 6:'1121' }) });
assert(p199Unlisted.canonicalReading?.primaryFormula?.result?.executorResult?.bodyPartHebrew === null, 'p199 unlisted 1121 does not invent a body part');
assert(p199Mapped.professionalVerdictSafety?.methodSpecificPolicy?.excludedFromPrimaryVerdict?.some((x) => x.includes('אבחנה רפואית')), 'p199 policy blocks medical-diagnosis expansion');

// PV-BF07-P191-CHILD-* — safety, fear, and severe-risk wording stay distinct.
const p191ChildSafe = buildKashfCanonicalAiBridge({ questionId: 'q-child-survive', questionText: 'האם הוולד יהיה בשלום', board: makeBoard({ 1:'2111', 6:'2222', 8:'2222' }) });
assert(p191ChildSafe.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'safety', 'p191 H1 benefic gives safety testimony');
assert(p191ChildSafe.canonicalReading?.overallPositive === true, 'p191 safety branch is positive');
assert(p191ChildSafe.professionalVerdictSafety?.certificationStatus === 'certified', 'p191 child-safety method passed professional backfill');
const p191ChildFear = buildKashfCanonicalAiBridge({ questionId: 'q-child-survive', questionText: 'האם הוולד יהיה בשלום', board: makeBoard({ 1:'1112', 6:'2222', 8:'2222' }) });
assert(p191ChildFear.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'fear', 'p191 H1 malefic preserves fear branch');
assert(p191ChildFear.canonicalReading?.overallPositive === null, 'p191 fear is not inverted into certain non-survival');
const p191ChildSevere = buildKashfCanonicalAiBridge({ questionId: 'q-child-survive', questionText: 'האם הוולד יהיה בשלום', board: makeBoard({ 1:'2111', 6:'1112', 8:'1112' }) });
assert(p191ChildSevere.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'severe-risk', 'p191 H6+H8 malefic activates severe source warning');
assert(p191ChildSevere.canonicalReading?.overallPositive === null, 'p191 severe warning is not converted into certain death');
assert(p191ChildSafe.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenInversions?.some((x) => x.includes('ודאי')), 'p191 child-safety policy blocks certainty inflation');

// PV-BF07-P191-DELIVERY-* — exact ease/difficulty signs, no H15 vote.
const p191DeliveryEasy = buildKashfCanonicalAiBridge({ questionId: 'q-birth-ease', questionText: 'לידה קלה או קשה', board: makeBoard({ 1:'1112', 5:'1112', 15:'2222' }) });
assert(p191DeliveryEasy.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'easy', 'p191 masculine H1+H5 gives ease sign');
assert(p191DeliveryEasy.canonicalReading?.overallPositive === true, 'p191 easy-delivery branch is positive');
assert(p191DeliveryEasy.professionalVerdictSafety?.certificationStatus === 'certified', 'p191 delivery-difficulty method passed professional backfill');
const p191DeliveryHard = buildKashfCanonicalAiBridge({ questionId: 'q-birth-ease', questionText: 'לידה קלה או קשה', board: makeBoard({ 1:'2222', 5:'2222', 15:'2111' }) });
assert(p191DeliveryHard.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'difficult', 'p191 fixed H5 gives difficulty sign');
assert(p191DeliveryHard.canonicalReading?.overallPositive === false, 'p191 difficult-delivery branch is negative');
assert(p191DeliveryEasy.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenInversions?.some((x) => x.includes('H15')), 'p191 delivery policy forbids an invented H15 vote');

// PV-BF07-P167-* — hidden action only; no sorcery/jinn/evil-eye promotion.
const p167Hidden = buildKashfCanonicalAiBridge({ questionText: 'האם יש פעולה מאחורי הדבר', board: makeBoard({ 4:'1111', 6:'1111', 8:'1111', 15:'1211' }) });
assert(p167Hidden.resolution?.kashfMethodId === 'spiritual.p167.hiddenActionAirRows46815', 'p167 hidden-action free text resolves exact method');
assert(p167Hidden.canonicalReading?.primaryFormula?.result?.executorResult?.derivedPattern === '1112', 'p167 air rows derive the malefic fixture 1112');
assert(p167Hidden.canonicalReading?.overallPositive === true, 'p167 malefic derived figure means hidden action exists');
assert(p167Hidden.professionalVerdictSafety?.certificationStatus === 'certified', 'p167 hidden-action method passed professional backfill');
const p167None = buildKashfCanonicalAiBridge({ questionText: 'האם יש פעולה מאחורי הדבר', board: makeBoard({ 4:'1111', 6:'1111', 8:'1211', 15:'1211' }) });
assert(p167None.canonicalReading?.primaryFormula?.result?.executorResult?.derivedPattern === '1122', 'p167 air rows derive benefic fixture 1122');
assert(p167None.canonicalReading?.overallPositive === false, 'p167 non-malefic derived figure activates explicit no-action complement');
assert(p167Hidden.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenClientClaimsWithoutExplicitSelectedMethodBranch?.some((x) => x.includes('כישוף')), 'p167 policy forbids expanding hidden action into sorcery');

// Six runnable methods remain intentionally uncertified after source/implementation audit.
for (const id of [
  'money.p179.sourceByIncomingHonorHouse',
  'marriage.p211.dissolutionH7StateMatrix',
  'profession.p254.h9Planet',
  'theft.p225.thiefDescriptionH7',
  'child.p194.healthTrajectoryH6H8',
  'missing.p248-249.lifeH1H4H9Outcome',
]) {
  assert(!KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.includes(id), id + ' remains pending professional source closure');
}
`;
tests = replaceOnce(tests, finalAnchor, batch07Tests + finalAnchor, 'batch07 tests insertion');
fs.writeFileSync(testPath, tests);

let status = fs.readFileSync(statusPath, 'utf8');
if (status.includes('PV-BF07-P173')) throw new Error('Batch 07 already applied to status document');
status = replaceOnce(status, '- מוסמכים מקצועית לאחר Batch 06: **29/43**.', '- מוסמכים מקצועית לאחר Batch 07: **37/43**.', 'status certified count');
status = replaceOnce(status, '- ממתינים להסמכה רטרואקטיבית: **14/43**.', '- ממתינים להסמכה רטרואקטיבית: **6/43**.', 'status pending count');
const rowAnchor = '| love.p204.attentionFireRows1713 | certified | PV-BF06-P204-ATTENTION-* | תנאי אש H1/H7/H13 בלבד; תוצאה היא מבט/תשומת לב, לא אהבה, נאמנות או התאמה |';
const newRows = `${rowAnchor}\n| completion.p173.fireRows15910 | certified | PV-BF07-P173-* | ראשי H1/H5/H9/H10 בלבד; פנימי=>יושלם, חיצוני=>לא יושלם; חלופת H1+H16 אינה מצביעה |\n| relocation.p183.h4h15 | certified | PV-BF07-P183-PLACE-* | הולדת H4+H15: מיטיב/מזיק/ממוזג הם שלושת ענפי המקור; אין הפיכה לשאלת הישארות מול מעבר |\n| siblings.p182.h1h3 | certified | PV-BF07-P182-REL-* | הולדת H1+H3 בלבד להסכמה/קלקול; דיני בכורה ושאר הולדות האחים נשארים נפרדים |\n| travel.p238.assemble1359 | certified | PV-BF07-P238-TRAVEL-* | הרכבת ארבעת היסודות מ-H1/H3/H5/H9 בלבד; אין ערבוב עם בחירת זמן או חזרת נוסע |\n| illness.bodyPart.h6Figure | certified | PV-BF07-P199-* | מיפוי H6 לטבלת האיברים בעמ׳ 199 בלבד; צורה שאינה בטבלה נשארת לא מוכרעת ואין אבחון רפואי |\n| pregnancy.p191.childSafetyH1H6H8 | certified | PV-BF07-P191-CHILD-* | H1 שלום/חשש; H6+H8 אזהרת סיכון חמורה; אין הפיכת אזהרה לוודאות מוות |\n| pregnancy.p191.deliveryDifficultyH1H5H15 | certified | PV-BF07-P191-DELIVERY-* | H1+H5 זכריים=>קלות; H5 קבוע=>קושי; סתירה נשמרת ו-H15 אינו הצבעת רוב |\n| spiritual.p167.hiddenActionAirRows46815 | certified | PV-BF07-P167-* | אוויר H4/H6/H8/H15 בלבד; מזיק=>פעולה מאחורי הדבר, אחרת לא; אין קביעה של כישוף/ג׳ין/עין הרע |`;
status = replaceOnce(status, rowAnchor, newRows, 'status certified rows');
status += `

### child.p194.healthTrajectoryH6H8

- המנוע runnable, אך נשאר **pending-backfill**.
- מקור עמ׳ 194 פותח את הקטע במילים: **"אם באה הצורה ריקה"**, ורק לאחר מכן מורה להתבונן בבית השישי ובבית השמיני.
- ה-executor הנוכחי מפעיל את H6/H8 ללא שער מקדים שמוכיח למה מתייחס התנאי "הצורה ריקה".
- עד שה-antecedent של התנאי נסגר מול המקור, אסור להסמיך את הפלט ללקוח או למחוק את התנאי.

### missing.p248-249.lifeH1H4H9Outcome

- המנוע runnable, אך בבדיקת המקור נמצא **פער יישום מוכח** בין דיני עמ׳ 250 ועמ׳ 251.
- עמ׳ 250 ועמ׳ 251 נותנים רשימות/תנאים שונים לעדות המוות; ה-executor הנוכחי מאחד אותן לקבוצה אחת ומחיל אותה יחד על H6,H7,H8,H15.
- איחוד זה אינו שקול ללשון המקור ולכן אין להסמיך את המנוע לפני תיקון Source Closure ייעודי.

### theft.p225.thiefDescriptionH7

- המנוע runnable ומתבסס על טבלת תיאור לפי H7, אך יש **אי-התאמת עמודי מקור**.
- הרשם הקנוני מייחס את השיטה לעמ׳ 224–225, בעוד פונקציית המקור והטבלה בקוד מסומנות כעמ׳ 231–234.
- לפני הסמכה יש ליישר את עוגן העמודים מול v57/הסריקה ולוודא שאין ערבוב בין פרקי קשר הגנב לבין תיאורו.

### profession.p254.h9Planet

- מיפוי סוג המקצוע לפי כוכב הצורה ב-H9 תואם את מקור עמ׳ 254.
- עם זאת, סייג H10/H11 של "מלאכתו מעטה בטרחה" עדיין משתמש בסיווג legacy בינארי שעלול לקפל צורות ממוזגות למיטיב/מזיק.
- עד שהסייג יעבור לסיווג הקנוני התלת-מצבי, השיטה נשארת **pending-backfill**.
`;
fs.writeFileSync(statusPath, status);

console.log('Professional Verdict Safety backfill batch 07 patch applied.');
