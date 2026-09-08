#!/usr/bin/env node
import fs from 'node:fs';

function replaceOnce(text, from, to, label) {
  if (!text.includes(from)) throw new Error('Missing anchor: ' + label);
  return text.replace(from, to);
}

// 1) Professional Verdict Safety policies
{
  const path = 'goral-hachol/intelligence/kashf-professional-verdict-safety.js';
  let text = fs.readFileSync(path, 'utf8');

  text = replaceOnce(
    text,
    "export const KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION = 'kashf-professional-verdict-safety-v6';",
    "export const KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION = 'kashf-professional-verdict-safety-v7';",
    'safety version v6->v7',
  );

  text = replaceOnce(
    text,
    "const P257_RULER_CONDITION_METHOD = 'authority.p257.rulerConditionH7H10';",
    "const P257_RULER_CONDITION_METHOD = 'authority.p257.rulerConditionH7H10';\nconst P264_LIFESPAN_STAGES_METHOD = 'lifespan.p264.stagesH11H9H7';\nconst P180_LIVELIHOOD_METHOD = 'money.p180.livelihoodH10Invert';\nconst P181_MONEY_ACQUIRE_METHOD = 'money.p181.recast25811';\nconst P266_RETURN_TO_OFFICE_METHOD = 'career.p266.returnToOffice';\nconst P204_ATTENTION_METHOD = 'love.p204.attentionFireRows1713';",
    'batch06 constants',
  );

  const policies = String.raw`
function p264LifespanStagesPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-06',
    goldenCaseIds: freezeArray(['PV-BF06-P264-STAGES']),
    policyId: 'p264-lifespan-stages-planet-profile-v1',
    questionScopeHebrew: 'ראשית, אמצע וסוף החיים לפי צורות הכוכבים ב-H11,H9,H7, עמ׳ 264',
    decisiveRuleHebrew: 'H11 מתאר את ראשית החיים, H9 את אמצע החיים, ו-H7 את סוף החיים. כל שלב מתואר לפי הכוכב של הצורה באותו בית; אין במקור נוסחת רוב או חישוב שנות חיים.',
    oneWayBranches: freezeArray([]),
    forbiddenInversions: freezeArray([
      'אין להפוך שלושה תיאורי שלב לפסק מצטבר של חיים טובים או רעים.',
      'אין להסיק אורך חיים, שנות חיים שנותרו או מועד מוות מן שלושת הבתים.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'lifespan.p178.elementCountToHouse — משך החיים הוא שיטה נפרדת.',
      'general.p174.h1h2h4h7h10h15 — קריאה כללית היא שיטה נפרדת.',
      'סיווג מיטיב/מזיק כתחליף לשיוך הכוכבי שהמקור דורש כאן.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'כמה שנים יחיה האדם',
      'כמה שנים נשארו לו',
      'מתי ימות',
      'חייו יהיו טובים או רעים בסך הכול',
    ]),
  });
}

function p180LivelihoodPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-06',
    goldenCaseIds: freezeArray(['PV-BF06-P180-ANGLE', 'PV-BF06-P180-CADENT', 'PV-BF06-P180-CONFLICT']),
    policyId: 'p180-livelihood-invert-h10-placement-v1',
    questionScopeHebrew: 'מצב המחיה/הפרנסה לפי היפוך שורות H10 ומיקום הצורה שנוצרה, עמ׳ 180',
    decisiveRuleHebrew: 'הפוך כל שורה ב-H10. אם הצורה שנוצרה מיטיבה ונמצאת ביתד — המחיה מתרחבת. אם היא נמצאת בבית נופל — אינה טובה. הופעה גם ביתד וגם בנופל נשארת ללא הכרעת קדימות.',
    oneWayBranches: freezeArray([
      'תוצאת היפוך H10 מיטיבה ומופיעה ביתד => המחיה מתרחבת',
      'תוצאת היפוך H10 מופיעה בבית נופל => מצב שאינו טוב למחיה',
    ]),
    forbiddenInversions: freezeArray([
      'היעדר הופעה ביתד אינו מוכיח לבדו שהמחיה רעה.',
      'הופעה בבית סמוך/עוקב בלבד אינה מקבלת דין טוב או רע שלא נמסר.',
      'כאשר אותה צורה מופיעה גם ביתד וגם בנופל אין לבחור צד או לבצע רוב.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'money.p179.sourceByIncomingHonorHouse — מקור הממון הוא דין נפרד.',
      'money.p181.recast25811 — השגת ממון מסוים היא דין נפרד.',
      'inheritance.p180.elementComposite — ירושה היא דין נפרד.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'מאין יגיע הכסף',
      'כמה כסף יגיע',
      'מתי יגיע הכסף',
      'כסף מסוים יתקבל משום שהמחיה מתרחבת',
    ]),
  });
}

function p181MoneyAcquirePolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-06',
    goldenCaseIds: freezeArray(['PV-BF06-P181-YES', 'PV-BF06-P181-UNRESOLVED']),
    policyId: 'p181-money-acquire-recast-internal-v1',
    questionScopeHebrew: 'האם ממון מסוים יושג לפי לוח משני שנבנה מ-H2,H5,H8,H11, עמ׳ 181',
    decisiveRuleHebrew: 'העמד את H2,H5,H8,H11 כאמהות ללוח חדש. אם H1,H2,H4,H7,H10 בלוח החדש כולם פנימיים ממש — הממון יושג. המקור אינו מוסר כאן את ההיפך אם התנאי נכשל.',
    oneWayBranches: freezeArray([
      'כל H1,H2,H4,H7,H10 בלוח המשני פנימיים => הממון יושג',
    ]),
    forbiddenInversions: freezeArray([
      'כישלון אחד או יותר מחמשת הבתים אינו מוכיח שהממון לא יושג.',
      'קבועה/מתהפכת הנוטה פנימה אינה מוחלפת ב-p181 ב"פנימית ממש".',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'השיטה החלופית של זוג/יחיד באותו עמוד.',
      'money.p179.sourceByIncomingHonorHouse — מקור הממון.',
      'money.p180.livelihoodH10Invert — מצב המחיה השוטפת.',
      'inheritance.p180.elementComposite — ירושה.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'הממון לא יושג משום שאחד התנאים נכשל',
      'מאין יגיע הכסף',
      'מתי יגיע הכסף',
      'מה יהיה סכום הכסף',
    ]),
  });
}

function p266ReturnToOfficePolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-06',
    goldenCaseIds: freezeArray(['PV-BF06-P266-RETURN', 'PV-BF06-P266-NO', 'PV-BF06-P266-UNRESOLVED']),
    policyId: 'p266-return-to-office-h1-recurrence-outcome-v1',
    questionScopeHebrew: 'האם מי שהודח משירות יחזור למקומו לפי עמ׳ 266',
    decisiveRuleHebrew: 'H1 מיטיב ופנימי, אותה צורה חוזרת בבית חזק נוסף H4/H7/H10, ו-H16 מיטיב => חוזר למקומו. H1 מזיק טהור מפעיל את ענף "הדין להפך" => אינו חוזר. מצבים אחרים נשארים ללא הכרעה.',
    oneWayBranches: freezeArray([
      'H1 מיטיב-פנימי + חזרה בבית חזק + H16 מיטיב => חוזר למקום השירות',
      'H1 מזיק טהור => הדין להפך, אינו חוזר לפי כלל זה',
    ]),
    forbiddenInversions: freezeArray([
      'חסר באחד מתנאי הענף החיובי אינו מוכיח אי-חזרה אלא אם H1 עצמו מזיק טהור.',
      'אין לבצע הצבעת רוב בין H1,H4,H7,H10,H16.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'authority.p256.honorConditionH10Planet — כבוד ומעמד.',
      'authority.p257.appointmentH1H10Planet — קיום מינוי.',
      'authority.p257.rulerConditionH7H10 — מצב בעל השררה.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'מתי יחזור לתפקיד',
      'מדוע הודח',
      'יקבל קידום',
      'יצליח בתפקיד לאחר החזרה',
    ]),
  });
}

function p204AttentionPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-06',
    goldenCaseIds: freezeArray(['PV-BF06-P204-ATTENTION-MATCH', 'PV-BF06-P204-ATTENTION-NO-MATCH']),
    policyId: 'p204-attention-fire-rows-1713-v1',
    questionScopeHebrew: 'לאן מופנה המבט לפי מצב שורת האש ב-H1,H7,H13, עמ׳ 204',
    decisiveRuleHebrew: 'אש H1 פתוחה + אש H7 פתוחה + אש H13 מתחברת => שניהם מביטים זה בזה וגם באחרים. אם התנאי אינו שלם, כלל זה לבדו אינו מכריע.',
    oneWayBranches: freezeArray([
      'אש H1 פתוחה + אש H7 פתוחה + אש H13 מתחברת => שניהם מביטים זה בזה וגם באחרים',
    ]),
    forbiddenInversions: freezeArray([
      'כישלון התנאי אינו מוכיח שאינם מביטים זה בזה.',
      'אין לייבא את ענפי הכלל הדומה בעמ׳ 170 כדי להשלים תוצאה.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'love.p205.directLoveH1PlacementH5Relation — שאלת אהבה היא שיטה נפרדת וחסומה כרגע.',
      'love.p206.womanFavorH7H11ThenH5 — מציאת חן היא שיטה נפרדת.',
      'marriage.p210.generalMarriageH1H2H7H8H10Judge — התאמת נישואין היא שיטה נפרדת.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'הוא אוהב אותך',
      'הוא נאמן או בלעדי',
      'יש התאמה לנישואין',
      'אין לו עניין באנשים אחרים',
    ]),
  });
}

`;

  text = replaceOnce(text, 'const METHOD_POLICIES = Object.freeze({', policies + 'const METHOD_POLICIES = Object.freeze({', 'batch06 policies');
  text = replaceOnce(
    text,
    "  [P257_RULER_CONDITION_METHOD]: p257RulerConditionPolicy(),\n});",
    "  [P257_RULER_CONDITION_METHOD]: p257RulerConditionPolicy(),\n  [P264_LIFESPAN_STAGES_METHOD]: p264LifespanStagesPolicy(),\n  [P180_LIVELIHOOD_METHOD]: p180LivelihoodPolicy(),\n  [P181_MONEY_ACQUIRE_METHOD]: p181MoneyAcquirePolicy(),\n  [P266_RETURN_TO_OFFICE_METHOD]: p266ReturnToOfficePolicy(),\n  [P204_ATTENTION_METHOD]: p204AttentionPolicy(),\n});",
    'batch06 policy registry',
  );

  fs.writeFileSync(path, text, 'utf8');
}

// 2) Golden/regression tests
{
  const path = '_test_kashf_professional_verdict_safety.mjs';
  let text = fs.readFileSync(path, 'utf8');

  text = replaceOnce(
    text,
    "assert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.length === 24, 'certification registry contains twenty-four professionally certified methods');",
    "assert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.length === 29, 'certification registry contains twenty-nine professionally certified methods');",
    'certified count 24->29',
  );

  text = replaceOnce(
    text,
    "  'authority.p257.rulerConditionH7H10',\n]) {",
    "  'authority.p257.rulerConditionH7H10',\n  'lifespan.p264.stagesH11H9H7',\n  'money.p180.livelihoodH10Invert',\n  'money.p181.recast25811',\n  'career.p266.returnToOffice',\n  'love.p204.attentionFireRows1713',\n]) {",
    'batch06 certified list',
  );

  const tests = String.raw`

console.log('\n--- Professional backfill batch 06 ---');

// PV-BF06-P264 — descriptive planetary life stages only; no lifespan duration/aggregate verdict.
const p264StagesBf = buildKashfCanonicalAiBridge({
  questionId: 'q-lifespan-stages', questionText: 'ראשית אמצע וסוף החיים',
  board: makeBoard({ 11:'1122', 9:'1111', 7:'1112' }),
});
const p264StagesExec = p264StagesBf.canonicalReading?.primaryFormula?.result?.executorResult;
assert(JSON.stringify(p264StagesExec?.housesUsed) === JSON.stringify([11,9,7]), 'p264 stages reads exactly H11,H9,H7');
assert(p264StagesExec?.stages?.map((x) => x.stage).join(',') === 'beginning,middle,end', 'p264 stages preserves beginning/middle/end order');
assert(p264StagesExec?.stages?.[0]?.planetHebrew === 'שמש', 'p264 H11 fixture resolves the verified Sun attribution');
assert(p264StagesExec?.stages?.[1]?.planetHebrew === 'ירח', 'p264 H9 fixture resolves the verified Moon attribution');
assert(p264StagesExec?.stages?.[2]?.planetHebrew === 'שבתאי', 'p264 H7 fixture resolves the verified Saturn attribution');
assert(p264StagesBf.canonicalReading?.overallPositive === null, 'p264 life stages remains descriptive/non-binary');
assert(p264StagesBf.professionalVerdictSafety?.certificationStatus === 'certified', 'p264 life stages passed professional backfill');
assert(p264StagesBf.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenClientClaimsWithoutExplicitSelectedMethodBranch?.includes('כמה שנים יחיה האדם'), 'p264 policy blocks lifespan-duration expansion');

// PV-BF06-P180 — H10 inversion: angle+benefic positive, cadent negative, conflict unresolved.
const p180Angle = buildKashfCanonicalAiBridge({
  questionId: 'q-livelihood', questionText: 'מה מצב הפרנסה?',
  board: makeBoard({ 10:'2211', 1:'1122' }),
});
const p180AngleExec = p180Angle.canonicalReading?.primaryFormula?.result?.executorResult;
assert(p180AngleExec?.resultPattern === '1122', 'p180 inversion fixture produces 1122');
assert(p180AngleExec?.sourceOutcome === 'expanded-livelihood' && p180Angle.canonicalReading?.overallPositive === true, 'p180 benefic result in an angle gives expanded livelihood');
assert(p180Angle.professionalVerdictSafety?.certificationStatus === 'certified', 'p180 livelihood passed professional backfill');
const p180Cadent = buildKashfCanonicalAiBridge({
  questionId: 'q-livelihood', questionText: 'מה מצב הפרנסה?',
  board: makeBoard({ 10:'2211', 3:'1122' }),
});
assert(p180Cadent.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'unfavorable-livelihood', 'p180 cadent placement activates the explicit unfavorable branch');
assert(p180Cadent.canonicalReading?.overallPositive === false, 'p180 cadent branch is negative');
const p180Conflict = buildKashfCanonicalAiBridge({
  questionId: 'q-livelihood', questionText: 'מה מצב הפרנסה?',
  board: makeBoard({ 10:'2211', 1:'1122', 3:'1122' }),
});
assert(p180Conflict.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'conflicting-placement', 'p180 angle+cadent duplicate preserves source conflict');
assert(p180Conflict.canonicalReading?.overallPositive === null, 'p180 conflicting placement is not resolved by invented priority');

// PV-BF06-P181 — reconstructed board positive condition is one-way only.
const p181Yes = buildKashfCanonicalAiBridge({
  questionId: 'q-livelihood-arrive', questionText: 'האם הממון יושג?',
  board: makeBoard({ 2:'2121', 5:'2111', 8:'2112', 11:'2111' }),
});
const p181YesExec = p181Yes.canonicalReading?.primaryFormula?.result?.executorResult;
assert(p181YesExec?.recastMotherPatterns?.join(',') === '2121,2111,2112,2111', 'p181 uses original H2,H5,H8,H11 as the four recast mothers');
assert(p181YesExec?.allRequiredInternal === true && p181YesExec?.moneyObtained === true, 'p181 all required recast houses strictly internal => money obtained');
assert(p181Yes.canonicalReading?.overallPositive === true, 'p181 explicit money-obtained branch is positive');
assert(p181Yes.professionalVerdictSafety?.certificationStatus === 'certified', 'p181 money acquisition passed professional backfill');
const p181Unresolved = buildKashfCanonicalAiBridge({
  questionId: 'q-livelihood-arrive', questionText: 'האם הממון יושג?',
  board: makeBoard({ 2:'2121', 5:'2111', 8:'2112', 11:'2222' }),
});
assert(p181Unresolved.canonicalReading?.primaryFormula?.result?.executorResult?.allRequiredInternal === false, 'p181 counterfixture fails the all-internal condition');
assert(p181Unresolved.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'unresolved', 'p181 failed positive condition stays unresolved');
assert(p181Unresolved.canonicalReading?.overallPositive === null, 'p181 failed condition is not inverted into no-money');
assert(p181Unresolved.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenInversions?.some((x) => x.includes('אינו מוכיח')), 'p181 policy explicitly locks the no-inverse rule');

// PV-BF06-P266 — exact return-to-office positive/opposite branches and unresolved middle.
const p266Return = buildKashfCanonicalAiBridge({
  questionId: 'q-career-return', questionText: 'האם אחזור לתפקיד?',
  board: makeBoard({ 1:'2121', 4:'2121', 16:'1122' }),
});
const p266ReturnExec = p266Return.canonicalReading?.primaryFormula?.result?.executorResult;
assert(p266ReturnExec?.returnIndicated === true && p266ReturnExec?.sourceOutcome === 'returns', 'p266 benefic-internal H1 + strong recurrence + benefic H16 gives return');
assert(p266Return.canonicalReading?.overallPositive === true, 'p266 return branch is positive');
assert(p266Return.professionalVerdictSafety?.certificationStatus === 'certified', 'p266 return-to-office passed professional backfill');
const p266No = buildKashfCanonicalAiBridge({
  questionId: 'q-career-return', questionText: 'האם אחזור לתפקיד?',
  board: makeBoard({ 1:'1112' }),
});
assert(p266No.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'does-not-return', 'p266 pure-malefic H1 activates the explicit opposite branch');
assert(p266No.canonicalReading?.overallPositive === false, 'p266 explicit opposite branch is negative');
const p266Unresolved = buildKashfCanonicalAiBridge({
  questionId: 'q-career-return', questionText: 'האם אחזור לתפקיד?',
  board: makeBoard({ 1:'2121', 16:'1112' }),
});
assert(p266Unresolved.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'unresolved', 'p266 incomplete positive testimony without pure-malefic H1 remains unresolved');
assert(p266Unresolved.canonicalReading?.overallPositive === null, 'p266 incomplete positive testimony is not inverted into no-return');

// PV-BF06-P204 attention — one explicit row-state condition; never promote it to love/exclusivity.
const p204AttentionMatch = buildKashfCanonicalAiBridge({
  questionId: 'q-who-looks-love', questionText: 'האם אדם זה מביט אלי או אל אחר?',
  board: makeBoard({ 1:'1111', 7:'1121', 13:'2222' }),
});
const p204AttentionMatchExec = p204AttentionMatch.canonicalReading?.primaryFormula?.result?.executorResult;
assert(p204AttentionMatchExec?.sourceConditionMet === true && p204AttentionMatchExec?.attention === 'mutual-and-others', 'p204 exact fire-row condition yields mutual-and-others attention');
assert(p204AttentionMatch.canonicalReading?.overallPositive === null, 'p204 attention is categorical/non-binary, not sentiment polarity');
assert(p204AttentionMatch.professionalVerdictSafety?.certificationStatus === 'certified', 'p204 attention passed professional backfill');
assert(p204AttentionMatch.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenClientClaimsWithoutExplicitSelectedMethodBranch?.includes('הוא אוהב אותך'), 'p204 attention policy forbids expansion into love');
const p204AttentionNoMatch = buildKashfCanonicalAiBridge({
  questionId: 'q-who-looks-love', questionText: 'האם אדם זה מביט אלי או אל אחר?',
  board: makeBoard({ 1:'1111', 7:'1121', 13:'1111' }),
});
assert(p204AttentionNoMatch.canonicalReading?.primaryFormula?.result?.executorResult?.sourceConditionMet === false, 'p204 counterfixture fails the exact H13 joined condition');
assert(p204AttentionNoMatch.canonicalReading?.primaryFormula?.result?.executorResult?.attention === null, 'p204 failed condition stays unresolved rather than inverted');
assert(p204AttentionNoMatch.canonicalReading?.overallPositive === null, 'p204 failed condition remains non-binary');
`;

  text = replaceOnce(
    text,
    "console.log(`\\nKashf professional verdict safety tests: ${passed} passed, ${failed} failed`);",
    tests + "\nconsole.log(`\\nKashf professional verdict safety tests: ${passed} passed, ${failed} failed`);",
    'batch06 tests before summary',
  );

  fs.writeFileSync(path, text, 'utf8');
}

// 3) Status document
{
  const path = 'HALL_WISDOM_KASHF_PROFESSIONAL_VERDICT_BACKFILL_STATUS.md';
  let text = fs.readFileSync(path, 'utf8');

  text = replaceOnce(
    text,
    '- מוסמכים מקצועית לאחר Batch 05: **24/43**.\n- ממתינים להסמכה רטרואקטיבית: **19/43**.',
    '- מוסמכים מקצועית לאחר Batch 06: **29/43**.\n- ממתינים להסמכה רטרואקטיבית: **14/43**.',
    'batch06 counts',
  );

  text = replaceOnce(
    text,
    '| authority.p257.rulerConditionH7H10 | certified | PV-BF05-P257-RULER-* | תוצאת H7+H10 מיטיבה=>טוב, מזיקה=>רע; ממוזג נשאר לא מוכרע |',
    '| authority.p257.rulerConditionH7H10 | certified | PV-BF05-P257-RULER-* | תוצאת H7+H10 מיטיבה=>טוב, מזיקה=>רע; ממוזג נשאר לא מוכרע |\n| lifespan.p264.stagesH11H9H7 | certified | PV-BF06-P264-STAGES | H11/H9/H7 הם ראשית/אמצע/סוף לפי כוכבים; אין חישוב שנות חיים או ציון מצטבר |\n| money.p180.livelihoodH10Invert | certified | PV-BF06-P180-* | היפוך H10 ומיקום התוצאה: מיטיב ביתד=>התרחבות, נופל=>לא טוב; יתד+נופל נשאר סתירה |\n| money.p181.recast25811 | certified | PV-BF06-P181-* | לוח משני מ-H2/H5/H8/H11; חמשת הבתים הנדרשים פנימיים=>הממון יושג; כשל אינו מתהפך ל"לא" |\n| career.p266.returnToOffice | certified | PV-BF06-P266-* | H1 מיטיב-פנימי + חזרה בבית חזק + H16 מיטיב=>חזרה; H1 מזיק=>הדין להפך |\n| love.p204.attentionFireRows1713 | certified | PV-BF06-P204-ATTENTION-* | תנאי אש H1/H7/H13 בלבד; תוצאה היא מבט/תשומת לב, לא אהבה, נאמנות או התאמה |',
    'batch06 certified rows',
  );

  const professionAudit = `\n\n### profession.p254.h9Planet\n\n- מיפוי המקצוע עצמו לפי כוכב H9 תואם למקור ונשאר runnable.\n- עם זאת, המבצע הוותיק עדיין מחשב את סייג "מעטה בטרחה" של H10/H11 דרך הסיווג הבינארי הישן \`MALEFIC_FIGURE_PATTERNS\`, בעוד שה-runtime הקנוני כבר שומר ממוזג כמחלקה נפרדת.\n- לכן Batch 06 אינו מסמיך אותו עדיין ללקוח. לפני הסמכה יש להעביר את סייג H10/H11 לסיווג הקנוני או להוכיח במפורש את טיפול המקור בצורות הממוזגות; אין לשנות את מיפוי המקצוע H9 שכבר תואם למקור.\n`;
  const auditAnchor = '\n\n## כלל הפעלה בזמן ה-Backfill';
  if (!text.includes('### profession.p254.h9Planet')) {
    text = replaceOnce(text, auditAnchor, professionAudit + auditAnchor, 'profession pending audit note');
  }

  text += '\n\n## Batch 06 — Life Stages / Livelihood / Money Acquisition / Return to Office / Attention\n\nBatch 06 הסמיך חמישה מנועים שכבר היו source-ready ושהמבצעים שלהם נבדקו מול ה-v57 התפעולי: שלבי החיים לפי H11/H9/H7 והכוכבים; מצב המחיה לפי היפוך H10; השגת ממון לפי לוח משני מ-H2/H5/H8/H11; חזרה לתפקיד לאחר הדחה לפי H1/חזרה בבית חזק/H16; וכלל המבט בעמ׳ 204 לפי שורות האש H1/H7/H13. בכל החמישה ננעלו גבולות השיטה: אין חישוב שנות חיים מתוך p264, אין מקור/סכום/זמן כסף מתוך p180/p181, אין רוב או המצאת תנאי בחזרה לתפקיד, וכלל המבט אינו מורחב לאהבה או נאמנות. profession.p254 נשאר בכוונה מחוץ להסמכה עד תיקון סייג H10/H11 הוותיק. p179 ו-p211 נשארו אף הם pending לפי פערי המקור שכבר תועדו.\n';

  fs.writeFileSync(path, text, 'utf8');
}

console.log('Professional Verdict Safety backfill batch 06 patch applied.');
