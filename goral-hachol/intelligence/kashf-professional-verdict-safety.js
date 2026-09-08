/**
 * kashf-professional-verdict-safety.js
 *
 * Professional verdict safety contract for the canonical Kashf -> AI path.
 *
 * This layer exists because a technically correct board can still be turned
 * into a professionally wrong consultation if an AI takes a generic meaning
 * of a figure/house and lets it override the dedicated source method selected
 * for the actual question.
 *
 * Core rule:
 *   selected question-specific method > its explicit source branches >
 *   source-bounded explanation > generic figure/house metadata >
 *   other methods / other books.
 *
 * Generic metadata and comparative sources may explain context when explicitly
 * allowed, but they NEVER create, reverse, soften or aggregate the verdict.
 */

export const KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION = 'kashf-professional-verdict-safety-v11';

const P174_GENERAL_METHOD = 'general.p174.h1h2h4h7h10h15';
const P182_SIBLING_SENIORITY_METHOD = 'siblings.p182.seniority';
const P244_TRAVELER_RETURN_METHOD = 'travel.p244.returnH1H2H9';
const P249_MISSING_RETURN_METHOD = 'missing.p249.returnAnglesJudge';
const P210_MARRIAGE_METHOD = 'marriage.p210.generalMarriageH1H2H7H8H10Judge';
const P211_DISSOLUTION_METHOD = 'marriage.p211.dissolutionH7StateMatrix';
const P204_PREVIOUS_STATUS_METHOD = 'marriage.p204.previousStatusH7inH10';
const P204_DOWRY_METHOD = 'marriage.p204.dowryH8';
const P206_WOMAN_FAVOR_METHOD = 'love.p206.womanFavorH7H11ThenH5';
const P206_QUERENT_DESIRE_METHOD = 'desire.p206.querentWantsH7H11ThenH5';
const P183_STAY_MOVE_METHOD = 'relocation.p183.stayMoveH1H2';
const P212_RECONCILIATION_METHOD = 'dispute.p212.reconciliationH1H7';
const P253_RELIGION_METHOD = 'religion.p253.h3h9Quality';
const P202_LOST_RETURN_METHOD = 'lostItem.p202.returnH6H8';
const P265_CLOTHING_LUCK_METHOD = 'clothing.p264-265.luck';
const P191_PREGNANCY_EXISTS_METHOD = 'pregnancy.p191.existsH5SilentEmpty';
const P191_PREGNANCY_GENDER_METHOD = 'pregnancy.p191.genderH5';
const P196_ILLNESS_RECOVERY_METHOD = 'illness.p196.outcomeH15';
const P188_HIDDEN_STILL_THERE_METHOD = 'hidden.p188.isStillThere';
const P224_THIEF_RELATIONSHIP_METHOD = 'theft.p224.relationshipH7Recurrence';
const P172_MATTER_OUTCOME_METHOD = 'matter.p172.h17_h1011_thenCombine';
const P183_CURRENT_VS_NEW_METHOD = 'relocation.p183.currentVsNewPlace';
const P256_HONOR_CONDITION_METHOD = 'authority.p256.honorConditionH10Planet';
const P257_APPOINTMENT_METHOD = 'authority.p257.appointmentH1H10Planet';
const P257_RULER_CONDITION_METHOD = 'authority.p257.rulerConditionH7H10';
const P264_LIFESPAN_STAGES_METHOD = 'lifespan.p264.stagesH11H9H7';
const P180_LIVELIHOOD_METHOD = 'money.p180.livelihoodH10Invert';
const P181_MONEY_ACQUIRE_METHOD = 'money.p181.recast25811';
const P266_RETURN_TO_OFFICE_METHOD = 'career.p266.returnToOffice';
const P204_ATTENTION_METHOD = 'love.p204.attentionFireRows1713';
const P173_COMPLETION_METHOD = 'completion.p173.fireRows15910';
const P183_PLACE_TO_PLACE_METHOD = 'relocation.p183.h4h15';
const P182_SIBLING_RELATIONSHIP_METHOD = 'siblings.p182.h1h3';
const P238_TRAVEL_SUCCESS_METHOD = 'travel.p238.assemble1359';
const P199_BODY_PART_METHOD = 'illness.bodyPart.h6Figure';
const P191_CHILD_SAFETY_METHOD = 'pregnancy.p191.childSafetyH1H6H8';
const P191_DELIVERY_DIFFICULTY_METHOD = 'pregnancy.p191.deliveryDifficultyH1H5H15';
const P167_HIDDEN_ACTION_METHOD = 'spiritual.p167.hiddenActionAirRows46815';
const P179_MONEY_SOURCE_METHOD = 'money.p179.sourceByIncomingHonorHouse';
const P225_THIEF_DESCRIPTION_METHOD = 'theft.p225.thiefDescriptionH7';
const P194_CHILD_HEALTH_METHOD = 'child.p194.healthTrajectoryH6H8';
const P248_249_MISSING_LIFE_METHOD = 'missing.p248-249.lifeH1H4H9Outcome';

function freezeArray(values = []) {
  return Object.freeze([...(Array.isArray(values) ? values : [])]);
}

function polarityFromReading(reading) {
  if (!reading || reading.valid !== true || reading.canRunKashf !== true) return 'blocked';
  if (reading.overallPositive === true) return 'positive';
  if (reading.overallPositive === false) return 'negative';
  return 'non-binary';
}

function authoritativeClientDraftFromReading(reading) {
  const executorText = reading?.primaryFormula?.result?.executorResult?.outputHebrew;
  if (typeof executorText === 'string' && executorText.trim().length > 0) return executorText.trim();
  const verdictText = reading?.verdict?.text;
  if (typeof verdictText === 'string' && verdictText.trim().length > 0) return verdictText.trim();
  return null;
}

function clientInstruction(polarity) {
  if (polarity === 'positive') {
    return 'הפסק הקנוני של השיטה שנבחרה חיובי. טיוטת הלקוח רשאית להסביר את הסיבות שהשיטה עצמה חישבה, אך אסור לה להפוך, לרכך או לסייג את הפסק באמצעות משמעות כללית של בית/צורה, שיטה אחרת או מקור אחר.';
  }
  if (polarity === 'negative') {
    return 'הפסק הקנוני של השיטה שנבחרה שלילי. טיוטת הלקוח רשאית להסביר את הסיבות שהשיטה עצמה חישבה, אך אסור לה להפוך, לרכך או לסייג את הפסק באמצעות משמעות כללית של בית/צורה, שיטה אחרת או מקור אחר.';
  }
  if (polarity === 'non-binary') {
    return 'השיטה הקנונית שנבחרה לא נתנה פסק בינארי. אסור ל-AI ליצור כן/לא מן הדעת, להפוך אי-קיום של תנאי להיפוכו, להמציא רוב או להשתמש במשמעות כללית של צורה כדי להשלים הכרעה.';
  }
  return 'אין פסק קנוני מאושר. אסור להפיק טיוטת פסק ללקוח.';
}

function p174Policy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-01',
    goldenCaseIds: freezeArray(['PV-BF01-P174']),
    policyId: 'p174-general-state-no-aggregation-v1',
    questionScopeHebrew: 'קריאה כללית תחומה לפי עמ׳ 174',
    decisiveRuleHebrew: 'אין כאן פסק כן/לא יחיד: המקור מורה לקרוא בנפרד את H1,H2,H4,H7,H10,H15 לפי תפקידיהם.',
    oneWayBranches: freezeArray([]),
    forbiddenInversions: freezeArray([
      'בית שאינו מיטיב אינו מוכיח שהמצב הכללי רע; אין כלל היפוך כזה בשיטה.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'כל בית מחוץ H1,H2,H4,H7,H10,H15.',
      'כל רוב, ממוצע, ניקוד או שקלול בין ששת הבתים.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'המצב הכללי טוב',
      'המצב הכללי רע',
      'רוב הסימנים חיוביים ולכן התשובה כן',
    ]),
  });
}

function p182Policy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-01',
    goldenCaseIds: freezeArray(['PV-BF01-P182']),
    policyId: 'p182-sibling-seniority-named-figures-v1',
    questionScopeHebrew: 'סימן לגדולים/בכורה בין אחים לפי עמ׳ 182',
    decisiveRuleHebrew: 'ב-H3 קהלה (2222) מורה על גדולים, ובייחוד מצד האב; שפל ראש (2221) גם מורה על גדולים.',
    oneWayBranches: freezeArray([
      'H3 קהלה (2222) => סימן לגדולים, ובייחוד לגדולים מצד האב',
      'H3 שפל ראש (2221) => סימן לגדולים',
    ]),
    forbiddenInversions: freezeArray([
      'כל צורה אחרת ב-H3 אינה מוכיחה שהאח צעיר יותר.',
      'אי-קיום קהלה/שפל ראש אינו מזהה מי הבכור מן הדעת.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'משמעות כללית של H1 או שיטות יחסי-אחים אחרות.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'האח צעיר יותר משום שלא יצאה קהלה או שפל ראש',
      'זהו אח מסוים בשם',
    ]),
  });
}

function p244Policy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-01',
    goldenCaseIds: freezeArray(['PV-BF01-P244-POSITIVE', 'PV-BF01-P244-HARDSHIP']),
    policyId: 'p244-traveler-return-one-way-v1',
    questionScopeHebrew: 'חזרת נוסע מן המסע לפי עמ׳ 244',
    decisiveRuleHebrew: 'H1,H2,H9 מיטיבים ופנימיים תומכים בחזרה בטוב ובשמחה. אם שלושתם מזיקים, המקור מוסר יגיעה ולעיתים אי-חזרה — לא פסק ודאי של אי-חזרה.',
    oneWayBranches: freezeArray([
      'H1+H2+H9 כולם מיטיבים ופנימיים => ישוב אל ארצו בטוב ובשמחה',
      'H1+H2+H9 כולם מזיקים => יגיעה במסע, ולעיתים לא ישוב',
    ]),
    forbiddenInversions: freezeArray([
      'כישלון התנאי החיובי אינו מוכיח אי-חזרה.',
      'הענף המזיק אינו מתיר להפוך "לעיתים לא ישוב" ל"לא ישוב" ודאי.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'כלל H5 הנפרד על בן-לוויה.',
      'missing.p249.returnAnglesJudge — דין נעדר נפרד.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'הנוסע בוודאות לא יחזור',
      'רוב הבתים חיוביים ולכן יחזור',
    ]),
  });
}

function p249Policy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-01',
    goldenCaseIds: freezeArray(['PV-BF01-P249']),
    policyId: 'p249-missing-return-male-scope-v1',
    questionScopeHebrew: 'סימן חזרת נעדר/בורח בזכרים לפי עמ׳ 249',
    decisiveRuleHebrew: 'היתדות H1,H4,H7,H10 צריכות לשאת צורות מיטיבות פנימיות, וגם H15 צריך להעיד לכך; אז המקור מורה על חזרת הזכרים.',
    oneWayBranches: freezeArray([
      'כל ארבע היתדות מיטיבות ופנימיות + H15 מעיד לכך => סימן לחזרת הזכרים',
    ]),
    forbiddenInversions: freezeArray([
      'אי-קיום התנאי אינו מוכיח שהנעדר לא יחזור.',
      'הסימן אינו פסק אוניברסלי לכל נעדר ואינו מורחב בשקט מעבר ללשון הזכרים.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'travel.p244.returnH1H2H9 — דין נוסע נפרד.',
      'missing.p248-249.lifeH1H4H9Outcome — דין חיים/מוות נפרד.',
      'שיטות מיקום/כיוון של נעדר.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'הנעדר לא יחזור',
      'כל נעדר יחזור ללא הגבלת מין/הקשר',
    ]),
  });
}

function p210Policy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'golden-case-001',
    goldenCaseIds: freezeArray(['PV-GC001-P210']),
    policyId: 'p210-marriage-source-hierarchy-v1',
    questionScopeHebrew: 'התאמת/דין נישואין כללי לפי עמ׳ 210–211',
    decisiveRuleHebrew: 'הפסק הבינארי של שיטת p210 נקבע מן ההולדה המפורשת H1+H5: מיטיב => לטוב; מזיק => להפך; ממוזג => ללא הכרעה בינארית.',
    sourceRoles: Object.freeze({
      manAndMarriage: freezeArray([1, 2]),
      woman: freezeArray([7, 8]),
      betweenThem: 10,
      judge: 15,
      finalDerivation: freezeArray([1, 5]),
    }),
    oneWayBranches: freezeArray([
      'H1 מיטיב => האיש טוב לה ומיטיב עמה',
      'H1 מזיק + H7 מיטיב => היא טובה ממנו',
      'H15 מיטיב => אחרית עניינם טובה, יפה ושמחה',
    ]),
    forbiddenInversions: freezeArray([
      'H15 שאינו מיטיב אינו מוכיח כשלעצמו אחרית רעה, חסימה או כישלון.',
      'אי-קיום ענף חיובי חד-כיווני אינו מוכיח את היפוכו אלא אם המקור אומר זאת במפורש.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'H16 — אינו חלק ממבצע p210 ואסור לו לשנות את פסק p210.',
      'המשמעות הכללית של H15/הצורה היושבת בו — מחוץ לענפים המפורשים של p210.',
      `${P211_DISSOLUTION_METHOD} — שיטת יציבות/פירוק נפרדת; אינה מצביעה בתוך p210 אלא אם נבחרה כשיטה נפרדת.`,
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'יש חסימה בנישואין',
      'הנישואין ייכשלו',
      'תהיה פרידה או גירושין',
      'לא כדאי להתקדם לקשר בגלל H15/H16 בלבד',
    ]),
  });
}


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


function p183StayMovePolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-03',
    goldenCaseIds: freezeArray(['PV-BF03-P183-STAY', 'PV-BF03-P183-MOVE', 'PV-BF03-P183-UNRESOLVED']),
    policyId: 'p183-stay-move-exact-opposites-v1',
    questionScopeHebrew: 'האם טוב להישאר במקום הנוכחי או לעבור ממנו לפי H1/H2, עמ׳ 178/183',
    decisiveRuleHebrew: 'H1 מיטיב + H2 מזיק => המקום הנוכחי טוב לו. H1 מזיק + H2 מיטיב => הדין להפך, המעבר עדיף. כל צירוף אחר אינו מוכרע בכלל זה.',
    oneWayBranches: freezeArray([
      'H1 מיטיב + H2 מזיק => להישאר; המקום הנוכחי טוב לו',
      'H1 מזיק + H2 מיטיב => הדין להפך; המעבר עדיף',
    ]),
    forbiddenInversions: freezeArray([
      'שני בתים מיטיבים, שני בתים מזיקים, עדות מפוצלת שאינה שתי הצורות המפורשות או צורה ממוזגת אינם יוצרים ענף שלישי.',
      'אין להסיק סיבת כדאיות — כסף, זוגיות, בריאות או עבודה — מן הכלל הזה.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'relocation.p183.currentVsNewPlace — שיטת השוואת מקום נוכחי/חדש נפרדת.',
      'relocation.p183.h4h15 ושיטות המעבר הסמוכות בעמ׳ 183–184.',
      'משמעות כללית של בית 1 או בית 2 מעבר לצירוף המפורש.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'כדאי לעבור משום שהעבודה תהיה טובה יותר',
      'כדאי להישאר משום שהזוגיות תהיה טובה יותר',
      'שני הבתים מיטיבים ולכן בוודאות עדיף להישאר',
    ]),
  });
}

function p212ReconciliationPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-03',
    goldenCaseIds: freezeArray(['PV-BF03-P212-RECONCILIATION', 'PV-BF03-P212-NOINVERSE']),
    policyId: 'p212-reconciliation-benefic-one-way-v1',
    questionScopeHebrew: 'עצם הפיוס בין שני צדדים לפי הולדת H1+H7, עמ׳ 212',
    decisiveRuleHebrew: 'אם מן H1+H7 נולדת צורה מיטיבה — שני הצדדים יתפייסו. המקור אינו נותן בענף זה היפוך מפורש של מזיק => לא יתפייסו.',
    oneWayBranches: freezeArray([
      'תוצאת H1+H7 מיטיבה => שניהם יתפייסו',
    ]),
    forbiddenInversions: freezeArray([
      'תוצאה מזיקה אינה מתירה לקבוע שלא יהיה פיוס.',
      'תוצאה ממוזגת אינה מתירה לקבוע כן או לא.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'סעיפי זהות המפשר/המתווך — חומר הסבר נפרד שאינו יוצר את פסק כן/לא.',
      'שיטות מנצח/מנוצח, אויבים או משפט אינן חלק מפסק הפיוס הזה.',
      'Al-Falak או כל שיטת פיוס השוואתית אחרת.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'לא יהיה פיוס משום שהתוצאה מזיקה',
      'פלוני יהיה המתווך בלי שהסעיף המפורש של המקור הופעל',
      'צד מסוים ינצח בסכסוך',
    ]),
  });
}

function p253ReligionPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-03',
    goldenCaseIds: freezeArray(['PV-BF03-P253-BENEFIC', 'PV-BF03-P253-MALEFIC', 'PV-BF03-P253-SPLIT']),
    policyId: 'p253-religion-two-house-agreement-v1',
    questionScopeHebrew: 'מצב הדת והצדקות לפי H3/H9, עמ׳ 253',
    decisiveRuleHebrew: 'H3 ו-H9 יחד במיטיב טהור => בעל דת ויראת אלוהים; שניהם במזיק טהור => מועט בדת. עדות מפוצלת או ממוזגת נשארת בלתי מוכרעת.',
    oneWayBranches: freezeArray([
      'H3+H9 שניהם מיטיבים טהורים => בעל דת ויראת אלוהים',
      'H3+H9 שניהם מזיקים טהורים => מועט בדת',
    ]),
    forbiddenInversions: freezeArray([
      'בית מיטיב אחד ובית מזיק אחד אינם מוכרעים באמצעות רוב או העדפת בית.',
      'צורה ממוזגת אינה מקודמת בכוח לצד הנטייה שלה.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'מוסר כללי, יושר, אמינות, השתייכות דתית או זהות אישית שאינם כתובים בכלל.',
      'משמעות כללית של H3/H9 מעבר לכלל המקומי.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'האדם שקרן או לא מוסרי',
      'האדם שייך לדת או לזרם מסוים',
      'עדות מפוצלת מוכיחה שהוא דתי במידה בינונית',
    ]),
  });
}

function p202LostReturnPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-03',
    goldenCaseIds: freezeArray(['PV-BF03-P202-RETURN', 'PV-BF03-P202-NORETURN']),
    policyId: 'p202-lost-item-return-exact-else-v1',
    questionScopeHebrew: 'שיבת אבדה/דבר אבוד לפי H6/H8, עמ׳ 202',
    decisiveRuleHebrew: 'אם ב-H6 וב-H8 צורות מיטיבות פנימיות — האבדה תשוב; ואם לא — לא. זהו ענף else מפורש במקור.',
    oneWayBranches: freezeArray([
      'H6+H8 שניהם מיטיבים ופנימיים => האבדה תשוב',
      'התנאי אינו מתקיים => האבדה לא תשוב לפי כלל זה',
    ]),
    forbiddenInversions: freezeArray([]),
    excludedFromPrimaryVerdict: freezeArray([
      'זיהוי גנב, סיבת גניבה, מיקום מדויק או תיאור אדם.',
      'theft.p224.relationshipH7Recurrence ושאר דיני גניבה.',
      'שיטות אבדה אחרות שאינן H6/H8.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'פלוני גנב את האבדה',
      'האבדה נמצאת במקום מסוים',
      'האבדה תחזור בתוך פרק זמן מסוים',
    ]),
  });
}

function p265ClothingLuckPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-03',
    goldenCaseIds: freezeArray(['PV-BF03-P265-GOOD', 'PV-BF03-P265-BAD', 'PV-BF03-P265-ROYAL-QUALIFIER', 'PV-BF03-P265-MIXED']),
    policyId: 'p265-clothing-luck-layered-branches-v1',
    questionScopeHebrew: 'מזל בלבוש לפי H5/H11 והסייג הנפרד של H10, עמ׳ 264–265',
    decisiveRuleHebrew: 'H5+H11 מיטיבים טהורים => יש מזל בלבושים; שניהם מזיקים טהורים => אין מזל בלבוש. H10 מזיק הוא סייג נפרד על לבוש מלכים/כיבוד מבעלי מעלה ואינו מבטל אוטומטית מזל כללי חיובי.',
    oneWayBranches: freezeArray([
      'H5+H11 שניהם מיטיבים => יש מזל בלבושים',
      'H5+H11 שניהם מזיקים => אין מזל בלבוש',
      'H10 מזיק => אין מזל בלבוש המלכים או בכיבוד הבא מצד בעלי מעלה',
    ]),
    forbiddenInversions: freezeArray([
      'H10 מיטיב אינו יוצר לבדו הבטחת מזל כללי בלבוש.',
      'עדות H5/H11 מפוצלת או ממוזגת אינה מוכרעת באמצעות רוב/נטייה.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'clothing.color — צבעי לבוש הם ידע/כוונה נפרדים.',
      'clothing.fixedMutable — קביעות/החלפת לבוש אינן פסק המזל הכללי.',
      'משמעות כללית של H10 שאינה סעיף לבוש-המלכים המפורש.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'צבע מסוים יביא מזל',
      'H10 מזיק מבטל את המזל הכללי אף כאשר H5/H11 מיטיבים',
      'צורה ממוזגת מוכיחה מזל חלקי',
    ]),
  });
}


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


function p179MoneySourcePolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-08',
    goldenCaseIds: freezeArray(['PV-BF08-P179-H10', 'PV-BF08-P179-MULTI', 'PV-BF08-P179-MIXED-GATE']),
    policyId: 'p179-money-source-incoming-honor-v1',
    questionScopeHebrew: 'מקור הממון לפי H2 וכבוד נכנס, כשף עמ׳ 179',
    decisiveRuleHebrew: 'אימות הסריקה הערבית אומר במפורש «وإن كان في الثاني سعد»: רק H2 מיטיב טהור פותח את השער. אז מחפשים כבוד נכנס (2211), וטבע הבית או הבתים שבהם הוא שורה מורה על מקור הממון. ממון נכנס ב-H2 הוא עדות נפרדת באותו עמוד.',
    oneWayBranches: freezeArray([
      'H2 מיטיב טהור + כבוד נכנס בבית נושא => מקור הממון לפי טבע אותו בית',
      'כבוד נכנס בכמה בתי נושא => נשמרים כמה ערוצי מקור; המקור אינו מדרג ביניהם',
      'ממון נכנס ב-H2 => הופעותיו נותנות עדות נפרדת על השגת הממון',
    ]),
    forbiddenInversions: freezeArray([
      'H2 ממוזג או מזיק אינו נחשב מיטיב לצורך השער, אך גם אינו מוכיח שאין כסף.',
      'היעדר כבוד נכנס בשנים-עשר בתי הנושא אינו מוכיח שלא יגיע כסף.',
      'אין לבחור ערוץ אחד כעיקרי כאשר כבוד נכנס מופיע ביותר מבית נושא אחד.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'money.p180.livelihoodH10Invert — מצב המחיה הוא דין נפרד.',
      'money.p181.recast25811 — עצם השגת הממון היא דין נפרד.',
      'סכום הממון, מועד קבלתו, חוקיותו/איסורו ושיטות כסף אחרות אינם חלק משיטת מקור הממון הזאת.',
      'עמדות 13–16 אינן מקבלות פירוש של ערוץ כספי בשיטה הזאת; המבצע רק מתעד אותן.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'הכסף בוודאות יגיע',
      'הכסף בוודאות לא יגיע',
      'סכום הכסף או מועד קבלתו',
      'ערוץ אחד הוא המקור העיקרי כאשר המקור מציג כמה הופעות',
      'מקור כספי שאינו נובע מטבע הבית שבו כבוד נכנס שורה',
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



function p225ThiefDescriptionPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-09',
    goldenCaseIds: freezeArray(['PV-BF09-P225-JOUDALA', 'PV-BF09-P225-NUSRA-IN', 'PV-BF09-P225-EXACT-DRAFT']),
    policyId: 'p225-thief-description-h7-source-table-v1',
    questionScopeHebrew: 'פרופיל תיאורי של הגנב לפי הצורה שב-H7: הוראת עמ׳ 225 וטבלת עמ׳ 231–233',
    decisiveRuleHebrew: 'קרא את צורת H7 והחזר רק את שורת התיאור המתאימה לה בטבלת המקור. אין לצרף חזרות בתים, משמעות כללית של הצורה או שיטת זיהוי אחרת.',
    oneWayBranches: freezeArray([
      'צורת H7 בעלת שורה בטבלה => החזר את הפרופיל המודפס של אותה צורה בלבד',
    ]),
    forbiddenInversions: freezeArray([
      'תיאור דומה לאדם מוכר אינו מוכיח שאותו אדם הוא הגנב.',
      'אין להפוך תכונת מראה, מלאכה או מגדר לזהות ודאית.',
      'אין להשלים אותיות שם משום שעמ׳ 225 מזכיר אותן אך המבצע הזה אינו כולל שיטת אותיות.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'theft.p224.relationshipH7Recurrence — קשר/קרבה לפי חזרת H7 הוא דין נפרד.',
      'מיקום הגניבה, החזרת האבדה, מספר הגנבים, גיל הגנב או אשמת חשוד מסוים.',
      'תיאור כללי של צורה ממקור אחר או משיטת חאווי.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'פלוני הוא הגנב',
      'הפרופיל מוכיח אשמה',
      'אותיות שמו של הגנב הן',
      'זהותו של הגנב ודאית',
    ]),
  });
}


function p194ChildHealthPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-10',
    goldenCaseIds: freezeArray(['PV-BF10-P194-H6', 'PV-BF10-P194-H8-BENEFIC', 'PV-BF10-P194-H8-MALEFIC', 'PV-BF10-P194-EXACT-DRAFT']),
    policyId: 'p194-child-health-h6-h8-scan-corrected-v1',
    questionScopeHebrew: 'מסלול בריאות הילד לאורך הזמן לפי עמ׳ 194',
    decisiveRuleHebrew: 'H6 מזיק טהור => ריבוי מכאובים בילדות. H8 מזיק טהור => התקווה בו מועטה. H8 מיטיב טהור => ככל שיגדל ימעט חוליו וישתפר מצבו. הסעיף הקודם על H5 שאינה זכרית/נקבית ומתַהפכת שייך לריקות הבטן ואינו שער להפעלת H6/H8.',
    oneWayBranches: freezeArray([
      'H6 מזיק טהור => ריבוי מכאובים בילדות',
      'H8 מזיק טהור => התקווה בו מועטה',
      'H8 מיטיב טהור => ככל שיגדל ימעט חוליו וישתפר מצבו',
    ]),
    forbiddenInversions: freezeArray([
      'H6 שאינו מזיק טהור אינו מוכיח שלא יהיו מכאובים.',
      'H8 ממוזג אינו מקודם למיטיב או למזיק.',
      'אין להפוך את סעיף ריקות הבטן של H5 לתנאי סף לבריאות H6/H8.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'pregnancy.p191.existsH5SilentEmpty — קיום הריון הוא דין נפרד.',
      'pregnancy.p191.genderH5 — מין הוולד הוא דין נפרד.',
      'pregnancy.p191.deliveryDifficultyH1H5H15 — קלות הלידה היא דין נפרד.',
      'illness.p196.outcomeH15 — החלמת חולה נוכחי היא דין נפרד.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'אבחנה רפואית של מחלה מסוימת',
      'ודאות שהילד ימות או לא יחלים',
      'אין שום בעיית בריאות משום ש-H6 אינו מזיק',
    ]),
  });
}

function p248249MissingLifePolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-10',
    goldenCaseIds: freezeArray(['PV-BF10-P248-ALIVE', 'PV-BF10-P248-DEATH-SIGN', 'PV-BF10-P248-NEIGHBOR-EXCLUSION', 'PV-BF10-P248-EXACT-DRAFT']),
    policyId: 'p248-249-missing-life-exact-five-figures-v1',
    questionScopeHebrew: 'חיי הנעדר ועדות למותו לפי עמ׳ 248–249',
    decisiveRuleHebrew: 'H1+H15+H4+H9 כולם מיטיבים טהורים => סימן שהנעדר חי. H6+H7+H8+H15 כולם אחת מחמש הצורות המפורשות קהלה/חיבור/דרך/לבן/אדום => סימן המקור למותו.',
    oneWayBranches: freezeArray([
      'H1+H15+H4+H9 כולם מיטיבים טהורים => הנעדר חי לפי השיטה',
      'H6+H7+H8+H15 כולם מן {קהלה, חיבור, דרך, לבן, אדום} => סימן המקור למותו',
    ]),
    forbiddenInversions: freezeArray([
      'כישלון סימן החיים אינו מוכיח מוות.',
      'כישלון רשימת חמש הצורות אינו מוכיח חיים.',
      'סוהר ושפל ראש אינם רשאים להיכנס לרשימת חמש הצורות של עמ׳ 248–249.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'רשימות מוות מן הכלל הסמוך בעמוד הקודם.',
      'missing.p249.returnAnglesJudge — דין חזרת נעדר הוא שיטה נפרדת.',
      'שיטות מיקום/כיוון של נעדר.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'אימות עובדתי חיצוני של מותו של אדם',
      'הנעדר מת משום שלא התקיים סימן החיים',
      'הנעדר חי משום שלא התקיימה רשימת חמש הצורות',
    ]),
  });
}

const METHOD_POLICIES = Object.freeze({
  [P174_GENERAL_METHOD]: p174Policy(),
  [P182_SIBLING_SENIORITY_METHOD]: p182Policy(),
  [P244_TRAVELER_RETURN_METHOD]: p244Policy(),
  [P249_MISSING_RETURN_METHOD]: p249Policy(),
  [P210_MARRIAGE_METHOD]: p210Policy(),
  [P204_PREVIOUS_STATUS_METHOD]: p204PreviousStatusPolicy(),
  [P204_DOWRY_METHOD]: p204DowryPolicy(),
  [P206_WOMAN_FAVOR_METHOD]: p206WomanFavorPolicy(),
  [P206_QUERENT_DESIRE_METHOD]: p206QuerentDesirePolicy(),
  [P183_STAY_MOVE_METHOD]: p183StayMovePolicy(),
  [P212_RECONCILIATION_METHOD]: p212ReconciliationPolicy(),
  [P253_RELIGION_METHOD]: p253ReligionPolicy(),
  [P202_LOST_RETURN_METHOD]: p202LostReturnPolicy(),
  [P265_CLOTHING_LUCK_METHOD]: p265ClothingLuckPolicy(),
  [P191_PREGNANCY_EXISTS_METHOD]: p191PregnancyExistsPolicy(),
  [P191_PREGNANCY_GENDER_METHOD]: p191PregnancyGenderPolicy(),
  [P196_ILLNESS_RECOVERY_METHOD]: p196IllnessRecoveryPolicy(),
  [P188_HIDDEN_STILL_THERE_METHOD]: p188HiddenStillTherePolicy(),
  [P224_THIEF_RELATIONSHIP_METHOD]: p224ThiefRelationshipPolicy(),
  [P172_MATTER_OUTCOME_METHOD]: p172MatterOutcomePolicy(),
  [P183_CURRENT_VS_NEW_METHOD]: p183CurrentVsNewPolicy(),
  [P256_HONOR_CONDITION_METHOD]: p256HonorConditionPolicy(),
  [P257_APPOINTMENT_METHOD]: p257AppointmentPolicy(),
  [P257_RULER_CONDITION_METHOD]: p257RulerConditionPolicy(),
  [P264_LIFESPAN_STAGES_METHOD]: p264LifespanStagesPolicy(),
  [P180_LIVELIHOOD_METHOD]: p180LivelihoodPolicy(),
  [P181_MONEY_ACQUIRE_METHOD]: p181MoneyAcquirePolicy(),
  [P266_RETURN_TO_OFFICE_METHOD]: p266ReturnToOfficePolicy(),
  [P204_ATTENTION_METHOD]: p204AttentionPolicy(),
  [P173_COMPLETION_METHOD]: p173CompletionPolicy(),
  [P183_PLACE_TO_PLACE_METHOD]: p183PlaceToPlacePolicy(),
  [P182_SIBLING_RELATIONSHIP_METHOD]: p182SiblingRelationshipPolicy(),
  [P238_TRAVEL_SUCCESS_METHOD]: p238TravelSuccessPolicy(),
  [P199_BODY_PART_METHOD]: p199BodyPartPolicy(),
  [P191_CHILD_SAFETY_METHOD]: p191ChildSafetyPolicy(),
  [P191_DELIVERY_DIFFICULTY_METHOD]: p191DeliveryDifficultyPolicy(),
  [P167_HIDDEN_ACTION_METHOD]: p167HiddenActionPolicy(),
  [P179_MONEY_SOURCE_METHOD]: p179MoneySourcePolicy(),
  [P225_THIEF_DESCRIPTION_METHOD]: p225ThiefDescriptionPolicy(),
  [P194_CHILD_HEALTH_METHOD]: p194ChildHealthPolicy(),
  [P248_249_MISSING_LIFE_METHOD]: p248249MissingLifePolicy(),
});

export const KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS = Object.freeze(
  Object.entries(METHOD_POLICIES)
    .filter(([, policy]) => policy?.certificationStatus === 'certified')
    .map(([methodId]) => methodId)
);

export function isKashfMethodProfessionallyCertified(methodId) {
  return KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.includes(methodId);
}

/**
 * Build a deterministic safety contract around an already-computed canonical
 * reading. This function does not calculate geomancy and does not change the
 * engine verdict. It only tells downstream AI what is authoritative and what
 * is forbidden for verdict formation.
 */
export function buildKashfProfessionalVerdictSafety({
  resolution = null,
  canonicalReading = null,
  canonicalRetrieval = null,
  baseAiVerdictAllowed = false,
} = {}) {
  const methodId = resolution?.kashfMethodId || canonicalReading?.kashfMethodId || null;
  const intentId = resolution?.kashfIntentId || canonicalReading?.kashfIntentId || null;
  const retrievalMethodId = canonicalRetrieval?.kashfMethodId || null;
  const readingMethodId = canonicalReading?.kashfMethodId || null;
  const polarity = polarityFromReading(canonicalReading);

  const methodIdsAligned = Boolean(
    methodId
    && readingMethodId === methodId
    && (!retrievalMethodId || retrievalMethodId === methodId)
  );
  const sourceReady = resolution?.kashfRuntimeStatus === 'ready'
    && resolution?.executorStatus === 'ready'
    && resolution?.runtimeAllowed === true;
  const readingReady = canonicalReading?.valid === true
    && canonicalReading?.canRunKashf === true;
  const operationalHebrewPresent = Boolean(canonicalRetrieval?.v57?.hebrewRule);
  const isSafe = Boolean(
    baseAiVerdictAllowed === true
    && methodIdsAligned
    && sourceReady
    && readingReady
    && operationalHebrewPresent
  );

  const methodSpecificPolicy = METHOD_POLICIES[methodId] || null;
  const authoritativeClientDraftHebrew = authoritativeClientDraftFromReading(canonicalReading);
  const certificationStatus = methodSpecificPolicy?.certificationStatus === 'certified'
    ? 'certified'
    : (sourceReady && readingReady ? 'pending-backfill' : 'not-applicable');
  const clientFacingCertified = certificationStatus === 'certified';
  const doNotMixWith = Array.isArray(canonicalRetrieval?.doNotMixWith)
    ? [...canonicalRetrieval.doNotMixWith]
    : [];

  const forbiddenVerdictSources = [
    'readingContext.board — raw house/figure placement is context, not an independent verdict engine',
    'readingContext.board.houses[*].figureState — generic fortune/movement/element metadata cannot create or reverse the selected method verdict',
    'readingContext.retrievalCandidates — alternative search hits are not selected methods',
    'readingContext.canonicalRetrieval.arabicVerification — verification-only, never operational verdict input',
    'legacyTopicBundle / dhamir / alternateMethods — not part of the selected canonical method unless explicitly selected',
    'Hawi / combined-method / Raml Shastra / Al-Falak comparative material — forbidden for a Kashf verdict unless the user explicitly selected a combined method',
    ...doNotMixWith.map((id) => `unselected method ${id}`),
  ];
  if (methodId === P210_MARRIAGE_METHOD) {
    forbiddenVerdictSources.push('H16 and generic H15 meaning outside the explicit p210 branches');
    if (!doNotMixWith.includes(P211_DISSOLUTION_METHOD)) {
      forbiddenVerdictSources.push(`unselected method ${P211_DISSOLUTION_METHOD}`);
    }
  }

  return Object.freeze({
    policyVersion: KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION,
    isSafe,
    kashfMethodId: methodId,
    kashfIntentId: intentId,
    authoritativePolarity: polarity,
    authoritativeVerdictPath: 'readingContext.engineOutput.verdict',
    authoritativePositivePath: 'readingContext.engineOutput.overallPositive',
    requiresExactPolarityMatch: true,
    certificationStatus,
    clientFacingCertified,
    clientDraftExactMatchRequired: Boolean(clientFacingCertified),
    authoritativeClientDraftHebrew,
    authoritativeClientDraftSourcePath: authoritativeClientDraftHebrew ? 'readingContext.engineOutput.primaryFormula.result.executorResult.outputHebrew|verdict.text' : null,
    certificationBatch: methodSpecificPolicy?.certificationBatch || null,
    goldenCaseIds: freezeArray(methodSpecificPolicy?.goldenCaseIds || []),
    binaryClientVerdictAllowed: Boolean(isSafe && clientFacingCertified && (polarity === 'positive' || polarity === 'negative')),
    nonBinaryExplanationAllowed: Boolean(isSafe && clientFacingCertified && polarity === 'non-binary'),
    noInverseRule: true,
    noUnstatedAggregation: true,
    selectedMethodOnly: true,
    genericFigureMetadataRole: 'context-only-never-overrides-verdict',
    otherMethodsRole: 'forbidden-for-verdict-unless-explicitly-selected',
    comparativeSourcesRole: 'advisor-reference-only-never-kashf-verdict',
    allowedVerdictSources: freezeArray([
      'readingContext.engineOutput.overallPositive',
      'readingContext.engineOutput.verdict',
    ]),
    explanationOnlySources: freezeArray([
      'readingContext.engineOutput.primaryFormula',
      'readingContext.canonicalRetrieval.v57',
    ]),
    forbiddenVerdictSources: freezeArray(forbiddenVerdictSources),
    doNotMixWith: freezeArray(doNotMixWith),
    clientVerdictInstructionHebrew: clientInstruction(polarity),
    methodSpecificPolicy,
    checks: Object.freeze({
      baseAiVerdictAllowed: baseAiVerdictAllowed === true,
      methodIdsAligned,
      sourceReady,
      readingReady,
      operationalHebrewPresent,
    }),
  });
}

export function getKashfProfessionalVerdictPolarity(reading) {
  return polarityFromReading(reading);
}

export default {
  buildKashfProfessionalVerdictSafety,
  getKashfProfessionalVerdictPolarity,
  KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION,
  KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS,
  isKashfMethodProfessionallyCertified,
};
