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
    "export const KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION = 'kashf-professional-verdict-safety-v5';",
    "export const KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION = 'kashf-professional-verdict-safety-v6';",
    'safety version v5->v6',
  );

  text = replaceOnce(
    text,
    "const P224_THIEF_RELATIONSHIP_METHOD = 'theft.p224.relationshipH7Recurrence';",
    "const P224_THIEF_RELATIONSHIP_METHOD = 'theft.p224.relationshipH7Recurrence';\nconst P172_MATTER_OUTCOME_METHOD = 'matter.p172.h17_h1011_thenCombine';\nconst P183_CURRENT_VS_NEW_METHOD = 'relocation.p183.currentVsNewPlace';\nconst P256_HONOR_CONDITION_METHOD = 'authority.p256.honorConditionH10Planet';\nconst P257_APPOINTMENT_METHOD = 'authority.p257.appointmentH1H10Planet';\nconst P257_RULER_CONDITION_METHOD = 'authority.p257.rulerConditionH7H10';",
    'batch05 constants',
  );

  const policies = String.raw`
function p172MatterOutcomePolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-05',
    goldenCaseIds: freezeArray(['PV-BF05-P172-GOOD', 'PV-BF05-P172-BAD', 'PV-BF05-P172-MIXED']),
    policyId: 'p172-matter-outcome-final-generated-figure-v1',
    questionScopeHebrew: 'תוצאת עניינו של השואל לטוב או לרע לפי עמ׳ 172',
    decisiveRuleHebrew: 'הולד H1+H7, הולד H10+H11, ואז הולד משתי התוצאות. הצורה הסופית לבדה היא תוצאת העניין: מיטיבה => לטוב; מזיקה => לרע; ממוזגת נשארת ללא הכרעה בינארית.',
    oneWayBranches: freezeArray([
      'הצורה הסופית מיטיבה => תוצאת העניין לטוב',
      'הצורה הסופית מזיקה => תוצאת העניין לרע',
    ]),
    forbiddenInversions: freezeArray([
      'צורה סופית ממוזגת אינה מקודמת לפי נטייתה לטוב או לרע.',
      'אין להחליף את הצורה הסופית באחד משני תוצרי הביניים או ברוב של ארבעת בתי הקלט.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'completion.p173.fireRows15910 — האם העניין יושלם היא שיטה נפרדת בעמ׳ 173.',
      'משמעות כללית של H1,H7,H10,H11 או של תוצרי הביניים מעבר לחישוב המפורש.',
      'דמיר, H15/H16 וכל שיטת תוצאה אחרת שלא נבחרה.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'העניין בוודאות יושלם',
      'העניין בוודאות לא יושלם',
      'מועד השלמת העניין',
      'סיבת ההצלחה או הכישלון מעבר למה שהכלל עצמו אומר',
    ]),
  });
}

function p183CurrentVsNewPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-05',
    goldenCaseIds: freezeArray(['PV-BF05-P183-CURRENT', 'PV-BF05-P183-MOVE', 'PV-BF05-P183-BOTH', 'PV-BF05-P183-UNRESOLVED']),
    policyId: 'p183-current-vs-new-positive-pairs-v1',
    questionScopeHebrew: 'טובת המגורים במקום הנוכחי לעומת עדות טובה למעבר לפי עמ׳ 183',
    decisiveRuleHebrew: 'H1+H4 שניהם מיטיבים => עדות טובה למגורים במקום הנוכחי. H7+H10 שניהם מיטיבים => עדות טובה למעבר. המקור אינו הופך כישלון של זוג לעדות שלילית ואינו מדרג בין האפשרויות אם שתיהן חיוביות.',
    oneWayBranches: freezeArray([
      'H1+H4 שניהם מיטיבים => דון בטובת המגורים במקום הנוכחי',
      'H7+H10 שניהם מיטיבים => דון בטובת המעבר',
      'שני הזוגות עומדים בתנאי => שתי העדויות החיוביות נשמרות יחד ללא דירוג',
    ]),
    forbiddenInversions: freezeArray([
      'כישלון H1+H4 אינו מוכיח שהמקום הנוכחי רע.',
      'כישלון H7+H10 אינו מוכיח שהמעבר רע.',
      'אין לבחור איזו אפשרות טובה יותר כאשר שני הזוגות עומדים בתנאי.',
      'צורה ממוזגת אינה מקודמת למיטיבה לפי הנטייה שלה.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'relocation.p183.stayMoveH1H2 — דין להישאר/לעבור לפי H1/H2 הוא שיטה נפרדת.',
      'relocation.p183.h4h15 — דין טיב המקום החדש לפי H4+H15 הוא שיטה נפרדת.',
      'שיטות השוואה אחרות בעמ׳ 183–184 וכל משמעות כללית של בתי המעבר.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'המקום הנוכחי רע',
      'המעבר רע',
      'עדיף לעבור',
      'עדיף להישאר',
      'אפשרות אחת טובה יותר מן השנייה',
    ]),
  });
}

function p256HonorConditionPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-05',
    goldenCaseIds: freezeArray(['PV-BF05-P256-SUN', 'PV-BF05-P256-SATURN', 'PV-BF05-P256-UNRESOLVED']),
    policyId: 'p256-honor-condition-h10-planet-v1',
    questionScopeHebrew: 'מצב הכבוד, המעלה והשררה לפי הכוכב של צורת H10, עמ׳ 256',
    decisiveRuleHebrew: 'צורת שמש ב-H10 => כוח הכבוד והמעלה ושלווה; צדק או נוגה => טוב ושלמות; שבתאי => חוסר תועלת, קדרות וצער. לכוכבים אחרים אין במקטע זה ענף מפורש.',
    oneWayBranches: freezeArray([
      'H10 מצורות השמש => כוח בכבוד ובמעלה ושלווה לבעלי השררה',
      'H10 מצורות צדק או נוגה => טוב ושלמות',
      'H10 מצורות שבתאי => חוסר תועלת, קדרות וצער',
    ]),
    forbiddenInversions: freezeArray([
      'כוכב שאינו שמש/צדק/נוגה/שבתאי אינו מקבל דין טוב או רע מן הדעת.',
      'אין להחליף את סיווג הכוכב בסיווג מיטיב/מזיק של הצורה.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'authority.p257.appointmentH1H10Planet — קיום המינוי הוא דין נפרד.',
      'authority.p257.rulerConditionH7H10 — מצב בעל השררה הוא דין נפרד.',
      'דיני משך המלכות, הדחה, מוות או ירידת השליט בעמ׳ 257.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'האדם יהיה מפורסם',
      'המינוי יתקיים או לא יתקיים',
      'השליט יישאר בשלטון או יודח',
      'משך הכבוד או המשרה',
    ]),
  });
}

function p257AppointmentPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-05',
    goldenCaseIds: freezeArray(['PV-BF05-P257-APPOINTMENT-YES', 'PV-BF05-P257-APPOINTMENT-NO']),
    policyId: 'p257-appointment-h1h10-planet-class-v1',
    questionScopeHebrew: 'האם השררה/המינוי מתקיימים לפי הולדת H1+H10 והכוכב של התוצאה, עמ׳ 257',
    decisiveRuleHebrew: 'הולד H1+H10. אם התוצאה מצורות השמש/הירח או צדק/נוגה — המינוי מתקיים; ואם היא מכוכב אחר בעל שיוך מאומת — אינו מתקיים. בלי שיוך כוכבי מאומת אין להשלים דין.',
    oneWayBranches: freezeArray([
      'תוצאת H1+H10 מן השמש או הירח => המינוי מתקיים',
      'תוצאת H1+H10 מן צדק או נוגה => המינוי מתקיים',
      'תוצאה בעלת שיוך כוכבי מאומת שאינה מארבעת אלה => המינוי אינו מתקיים',
    ]),
    forbiddenInversions: freezeArray([
      'חסר בשיוך הכוכבי אינו הופך אוטומטית לאי-קיום המינוי.',
      'אין להחליף את מבחן הכוכבים בסיווג מיטיב/מזיק של הצורה.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'authority.p256.honorConditionH10Planet — כבוד ומעמד לפי H10 הוא דין נפרד.',
      'authority.p257.rulerConditionH7H10 — מצב בעל השררה הוא דין נפרד.',
      'דיני משך מלכות, הדחה, מוות, ירידה או סיבת המינוי.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'האדם יהיה מפורסם או מכובד',
      'בעל השררה טוב או רע',
      'המינוי יימשך זמן מסוים',
      'סיבת קיום או אי-קיום המינוי',
    ]),
  });
}

function p257RulerConditionPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-05',
    goldenCaseIds: freezeArray(['PV-BF05-P257-RULER-GOOD', 'PV-BF05-P257-RULER-BAD', 'PV-BF05-P257-RULER-MIXED']),
    policyId: 'p257-ruler-condition-h7h10-v1',
    questionScopeHebrew: 'מצב בעל השררה לפי הצורה הנולדת מ-H7+H10, עמ׳ 257',
    decisiveRuleHebrew: 'הולד H7+H10. תוצאה מיטיבה => דון לו בטוב; תוצאה מזיקה => דון לו ברע; ממוזגת נשארת ללא הכרעה בכלל זה.',
    oneWayBranches: freezeArray([
      'תוצאת H7+H10 מיטיבה => מצב בעל השררה טוב',
      'תוצאת H7+H10 מזיקה => מצב בעל השררה רע',
    ]),
    forbiddenInversions: freezeArray([
      'תוצאה ממוזגת אינה מקודמת לפי נטייתה לטוב או לרע.',
      'אין להשתמש ב-H7 או H10 בנפרד כדי לדרוס את הצורה שנולדה מהם.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'authority.p256.honorConditionH10Planet — מצב הכבוד והמעלה הוא דין נפרד.',
      'authority.p257.appointmentH1H10Planet — קיום המינוי הוא דין נפרד.',
      'דיני משך המלכות, הדחה, יציאה מן השלטון, מוות או ירידה הסמוכים בעמ׳ 257.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'השליט יישאר בשלטון',
      'השליט יודח',
      'המינוי יתקיים או לא יתקיים',
      'האדם יהיה מפורסם',
    ]),
  });
}

`;

  text = replaceOnce(
    text,
    'const METHOD_POLICIES = Object.freeze({',
    policies + 'const METHOD_POLICIES = Object.freeze({',
    'batch05 policies',
  );

  text = replaceOnce(
    text,
    "  [P224_THIEF_RELATIONSHIP_METHOD]: p224ThiefRelationshipPolicy(),\n});",
    "  [P224_THIEF_RELATIONSHIP_METHOD]: p224ThiefRelationshipPolicy(),\n  [P172_MATTER_OUTCOME_METHOD]: p172MatterOutcomePolicy(),\n  [P183_CURRENT_VS_NEW_METHOD]: p183CurrentVsNewPolicy(),\n  [P256_HONOR_CONDITION_METHOD]: p256HonorConditionPolicy(),\n  [P257_APPOINTMENT_METHOD]: p257AppointmentPolicy(),\n  [P257_RULER_CONDITION_METHOD]: p257RulerConditionPolicy(),\n});",
    'batch05 method policy registry',
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
    "assert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.length === 19, 'certification registry contains nineteen professionally certified methods');",
    "assert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.length === 24, 'certification registry contains twenty-four professionally certified methods');",
    'certified method count 19->24',
  );

  text = replaceOnce(
    text,
    "  'theft.p224.relationshipH7Recurrence',\n]) {",
    "  'theft.p224.relationshipH7Recurrence',\n  'matter.p172.h17_h1011_thenCombine',\n  'relocation.p183.currentVsNewPlace',\n  'authority.p256.honorConditionH10Planet',\n  'authority.p257.appointmentH1H10Planet',\n  'authority.p257.rulerConditionH7H10',\n]) {",
    'certified method list batch05',
  );

  const tests = String.raw`

console.log('\n--- Professional backfill batch 05 ---');

// PV-BF05-P172 — only the final generated figure decides good/bad; mixed stays mixed.
const p172BfGood = buildKashfCanonicalAiBridge({
  questionId: 'q-matter-end',
  questionText: 'מה תהיה תוצאת העניין?',
  board: makeBoard({ 1:'1111', 7:'2222', 10:'1111', 11:'1122' }),
});
const p172BfGoodExec = p172BfGood.canonicalReading?.primaryFormula?.result?.executorResult;
assert(p172BfGoodExec?.firstSeventhPattern === '1111' && p172BfGoodExec?.tenthEleventhPattern === '2211', 'p172 builds the two exact intermediate figures');
assert(p172BfGoodExec?.resultPattern === '1122' && p172BfGoodExec?.sourceOutcome === 'good', 'p172 final pure-benefic figure gives good outcome');
assert(p172BfGood.canonicalReading?.overallPositive === true, 'p172 good branch is positive');
assert(p172BfGood.professionalVerdictSafety?.certificationStatus === 'certified', 'p172 matter outcome passed professional backfill');
assert(p172BfGood.professionalVerdictSafety?.methodSpecificPolicy?.excludedFromPrimaryVerdict?.some((x) => x.includes('completion.p173')), 'p172 safety policy isolates the separate p173 completion method');
const p172BfBad = buildKashfCanonicalAiBridge({
  questionId: 'q-matter-end', questionText: 'מה תהיה תוצאת העניין?',
  board: makeBoard({ 1:'1111', 7:'2222', 10:'1111', 11:'1112' }),
});
assert(p172BfBad.canonicalReading?.primaryFormula?.result?.executorResult?.resultPattern === '1112', 'p172 bad fixture generates the expected final figure');
assert(p172BfBad.canonicalReading?.overallPositive === false, 'p172 pure-malefic final figure gives bad outcome');
const p172BfMixed = buildKashfCanonicalAiBridge({
  questionId: 'q-matter-end', questionText: 'מה תהיה תוצאת העניין?',
  board: makeBoard({ 1:'1111', 7:'2222', 10:'1111', 11:'2212' }),
});
assert(p172BfMixed.canonicalReading?.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'mixed', 'p172 mixed final preserves the mixed class');
assert(p172BfMixed.canonicalReading?.overallPositive === null, 'p172 mixed final cannot become binary good/bad');

// PV-BF05-P183 — two independent positive pairs; no inverse and no ranking.
const p183BfCurrent = buildKashfCanonicalAiBridge({
  questionId: 'q-move-home', questionText: 'מקום נוכחי מול מקום חדש',
  board: makeBoard({ 1:'1122', 4:'1122', 7:'1112', 10:'1112' }),
});
const p183BfCurrentExec = p183BfCurrent.canonicalReading?.primaryFormula?.result?.executorResult;
assert(p183BfCurrentExec?.sourceOutcome === 'current-place-good', 'p183 H1+H4 benefic pair gives the current-place positive clause');
assert(p183BfCurrentExec?.moveGood === false && !String(p183BfCurrentExec?.outputHebrew || '').includes('המעבר רע'), 'p183 failed move pair is not inverted into a bad move');
assert(p183BfCurrent.canonicalReading?.overallPositive === null, 'p183 comparison stays descriptive/non-binary');
assert(p183BfCurrent.professionalVerdictSafety?.certificationStatus === 'certified', 'p183 current-vs-new passed professional backfill');
const p183BfMove = buildKashfCanonicalAiBridge({
  questionId: 'q-move-home', questionText: 'מקום נוכחי מול מקום חדש',
  board: makeBoard({ 1:'1112', 4:'1112', 7:'1122', 10:'1122' }),
});
assert(p183BfMove.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'move-good', 'p183 H7+H10 benefic pair gives the move positive clause');
assert(!String(p183BfMove.canonicalReading?.primaryFormula?.result?.executorResult?.outputHebrew || '').includes('המקום הנוכחי רע'), 'p183 failed current pair is not inverted into a bad current place');
const p183BfBoth = buildKashfCanonicalAiBridge({
  questionId: 'q-move-home', questionText: 'מקום נוכחי מול מקום חדש',
  board: makeBoard({ 1:'1122', 4:'1122', 7:'1122', 10:'1122' }),
});
assert(p183BfBoth.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'both-good', 'p183 preserves both positive clauses together');
assert(!String(p183BfBoth.canonicalReading?.primaryFormula?.result?.executorResult?.outputHebrew || '').includes('טובה יותר'), 'p183 does not invent a ranking when both options qualify');
const p183BfMixed = buildKashfCanonicalAiBridge({
  questionId: 'q-move-home', questionText: 'מקום נוכחי מול מקום חדש',
  board: makeBoard({ 1:'2212', 4:'1122', 7:'1112', 10:'1112' }),
});
assert(p183BfMixed.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'unresolved', 'p183 mixed/nonqualifying evidence remains unresolved');

// PV-BF05-P256 — H10 planetary branch only; no fame or appointment inference.
const p256BfSun = buildKashfCanonicalAiBridge({ questionId: 'q-fame', questionText: 'מה מצב הכבוד והמעמד?', board: makeBoard({ 10:'1122' }) });
const p256BfSunExec = p256BfSun.canonicalReading?.primaryFormula?.result?.executorResult;
assert(p256BfSunExec?.planetHebrew === 'שמש' && p256BfSunExec?.condition === 'strong-honor-and-rank', 'p256 Sun branch preserves strength of honor/rank');
assert(p256BfSun.canonicalReading?.overallPositive === true, 'p256 Sun branch is positive');
assert(p256BfSun.professionalVerdictSafety?.certificationStatus === 'certified', 'p256 honor condition passed professional backfill');
assert(p256BfSun.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenClientClaimsWithoutExplicitSelectedMethodBranch?.includes('האדם יהיה מפורסם'), 'p256 policy blocks expansion into fame prediction');
const p256BfSaturn = buildKashfCanonicalAiBridge({ questionId: 'q-fame', questionText: 'מה מצב הכבוד והמעמד?', board: makeBoard({ 10:'1112' }) });
assert(p256BfSaturn.canonicalReading?.primaryFormula?.result?.executorResult?.planetHebrew === 'שבתאי', 'p256 Saturn fixture resolves the exact planet');
assert(p256BfSaturn.canonicalReading?.overallPositive === false, 'p256 Saturn branch is negative');
const p256BfOther = buildKashfCanonicalAiBridge({ questionId: 'q-fame', questionText: 'מה מצב הכבוד והמעמד?', board: makeBoard({ 10:'2222' }) });
assert(p256BfOther.canonicalReading?.primaryFormula?.result?.executorResult?.condition === 'unresolved-by-source', 'p256 unlisted planet remains source-unresolved');
assert(p256BfOther.canonicalReading?.overallPositive === null, 'p256 unlisted planet is not invented into positive/negative');

// PV-BF05-P257 appointment — exact planet-class test, with explicit else.
const p257AppointmentYes = buildKashfCanonicalAiBridge({
  questionId: 'q-position-keep', questionText: 'האם המינוי יתקיים?',
  board: makeBoard({ 1:'1111', 10:'2222' }),
});
const p257AppointmentYesExec = p257AppointmentYes.canonicalReading?.primaryFormula?.result?.executorResult;
assert(p257AppointmentYesExec?.resultPattern === '1111' && p257AppointmentYesExec?.planetHebrew === 'ירח', 'p257 appointment positive fixture resolves to Moon');
assert(p257AppointmentYesExec?.appointmentCompletes === true && p257AppointmentYes.canonicalReading?.overallPositive === true, 'p257 luminary result completes the appointment');
assert(p257AppointmentYes.professionalVerdictSafety?.certificationStatus === 'certified', 'p257 appointment passed professional backfill');
assert(p257AppointmentYes.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenInversions?.some((x) => x.includes('מיטיב/מזיק')), 'p257 appointment policy forbids fortune-class substitution');
const p257AppointmentNo = buildKashfCanonicalAiBridge({
  questionId: 'q-position-keep', questionText: 'האם המינוי יתקיים?',
  board: makeBoard({ 1:'1111', 10:'2221' }),
});
const p257AppointmentNoExec = p257AppointmentNo.canonicalReading?.primaryFormula?.result?.executorResult;
assert(p257AppointmentNoExec?.resultPattern === '1112' && p257AppointmentNoExec?.planetHebrew === 'שבתאי', 'p257 appointment negative fixture resolves to Saturn');
assert(p257AppointmentNoExec?.appointmentCompletes === false && p257AppointmentNo.canonicalReading?.overallPositive === false, 'p257 verified non-luminary/non-benefic planet activates the explicit no branch');

// PV-BF05-P257 ruler condition — derived H7+H10 only; mixed stays unresolved.
const p257RulerGood = buildKashfCanonicalAiBridge({ questionId: 'q-ruler-status', questionText: 'מה מצב בעל השררה?', board: makeBoard({ 7:'1122', 10:'2222' }) });
const p257RulerGoodExec = p257RulerGood.canonicalReading?.primaryFormula?.result?.executorResult;
assert(p257RulerGoodExec?.resultPattern === '1122' && p257RulerGoodExec?.rulerCondition === 'good', 'p257 ruler benefic derivation gives good condition');
assert(p257RulerGood.canonicalReading?.overallPositive === true, 'p257 ruler good branch is positive');
assert(p257RulerGood.professionalVerdictSafety?.certificationStatus === 'certified', 'p257 ruler condition passed professional backfill');
const p257RulerBad = buildKashfCanonicalAiBridge({ questionId: 'q-ruler-status', questionText: 'מה מצב בעל השררה?', board: makeBoard({ 7:'1112', 10:'2222' }) });
assert(p257RulerBad.canonicalReading?.primaryFormula?.result?.executorResult?.rulerCondition === 'bad', 'p257 ruler malefic derivation gives bad condition');
assert(p257RulerBad.canonicalReading?.overallPositive === false, 'p257 ruler bad branch is negative');
const p257RulerMixed = buildKashfCanonicalAiBridge({ questionId: 'q-ruler-status', questionText: 'מה מצב בעל השררה?', board: makeBoard({ 7:'1111', 10:'2222' }) });
assert(p257RulerMixed.canonicalReading?.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'mixed', 'p257 ruler mixed fixture preserves mixed classification');
assert(p257RulerMixed.canonicalReading?.overallPositive === null, 'p257 ruler mixed result remains non-binary');
assert(p257RulerMixed.professionalVerdictSafety?.methodSpecificPolicy?.excludedFromPrimaryVerdict?.some((x) => x.includes('משך המלכות')), 'p257 ruler policy isolates kingship-duration/removal rules');
`;

  text = replaceOnce(
    text,
    "console.log(`\\nKashf professional verdict safety tests: ${passed} passed, ${failed} failed`);",
    tests + "\nconsole.log(`\\nKashf professional verdict safety tests: ${passed} passed, ${failed} failed`);",
    'batch05 tests before final summary',
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
    '- מוסמכים מקצועית לאחר Batch 04: **19/43**.\n- ממתינים להסמכה רטרואקטיבית: **24/43**.',
    '- מוסמכים מקצועית לאחר Batch 05: **24/43**.\n- ממתינים להסמכה רטרואקטיבית: **19/43**.',
    'batch05 status counts',
  );

  text = replaceOnce(
    text,
    '| theft.p224.relationshipH7Recurrence | certified | PV-BF04-P224-* | רק חזרת H7 בבית בעל הוראת מקור מתארת קשר; אין זיהוי אדם/מרחק |',
    '| theft.p224.relationshipH7Recurrence | certified | PV-BF04-P224-* | רק חזרת H7 בבית בעל הוראת מקור מתארת קשר; אין זיהוי אדם/מרחק |\n| matter.p172.h17_h1011_thenCombine | certified | PV-BF05-P172-* | רק הצורה הסופית משתי ההולדות קובעת טוב/רע; ממוזג נשאר לא מוכרע ואין ערבוב עם p173 |\n| relocation.p183.currentVsNewPlace | certified | PV-BF05-P183-* | H1+H4 ו-H7+H10 הם שני תנאים חיוביים עצמאיים; אין היפוך שלילי ואין דירוג |\n| authority.p256.honorConditionH10Planet | certified | PV-BF05-P256-* | H10 לפי כוכב: שמש/צדק/נוגה/שבתאי בלבד; כוכבים אחרים נשארים לא מוכרעים |\n| authority.p257.appointmentH1H10Planet | certified | PV-BF05-P257-APPOINTMENT-* | H1+H10 נבחן לפי המאורות/צדק/נוגה; אין החלפה במיטיב/מזיק |\n| authority.p257.rulerConditionH7H10 | certified | PV-BF05-P257-RULER-* | תוצאת H7+H10 מיטיבה=>טוב, מזיקה=>רע; ממוזג נשאר לא מוכרע |',
    'batch05 certified rows',
  );

  text += '\n\n## Batch 05 — Matter / Relocation / Authority\n\nBatch 05 הסמיך חמישה מנועי custom-engine שמקורם התפעולי והמבצעים שלהם כבר היו סגורים: תוצאת העניין בעמ׳ 172, השוואת עדות טובה למגורים/מעבר בעמ׳ 183, מצב הכבוד לפי כוכב H10 בעמ׳ 256, קיום מינוי לפי H1+H10 בעמ׳ 257, ומצב בעל השררה לפי H7+H10 בעמ׳ 257. ההסמכה מקבעת במיוחד שאין לערבב p172 עם p173, שאין להפוך כישלון של זוג-בתים במעבר לעדות שלילית, וששלושת דיני השררה נשארים שלושה מנועים נפרדים. p179 ו-p211 נשארו בכוונה מחוץ להסמכה עד סגירת פערי המקור המתועדים.\n';

  fs.writeFileSync(path, text, 'utf8');
}

console.log('Professional Verdict Safety backfill batch 05 patch applied.');
