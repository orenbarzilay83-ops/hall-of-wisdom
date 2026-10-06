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

export const KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION = 'kashf-professional-verdict-safety-v13';

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
const P191_192_MISCARRIAGE_METHOD = 'pregnancy.p191-192.miscarriageRedH7NakisH8';
const P196_ILLNESS_RECOVERY_METHOD = 'illness.p196.outcomeH15';
const P188_HIDDEN_STILL_THERE_METHOD = 'hidden.p188.isStillThere';
const P188_QUARTER_DIRECTION_METHOD = 'hidden.p188.quarterDirection';
const P224_THIEF_RELATIONSHIP_METHOD = 'theft.p224.relationshipH7Recurrence';
const P224_THEFT_RECOVERY_METHOD = 'theft.p224.recoveryH8';
const P271_ENEMY_METHOD = 'enemy.p271.h1vsH12';
const P197_ILLNESS_HUMOR_METHOD = 'illness.p197.h1h8ElementHumor';
const P263_FRIENDSHIP_METHOD = 'friends.p263.h1h11';
const P265_STATE_CONTINUITY_METHOD = 'state.p265.h1h2h9h15';
const P257_MOTHER_METHOD = 'mother.p257.statusDayNight';
const P267_HOPE_METHOD = 'hope.p267.fulfillment';
const P193_GIFT_METHOD = 'gift.p193.h5Quality';
const P184_FATHER_MONEY_METHOD = 'family.p184.fatherMoneyH5';
const P184_LAND_OWNERSHIP_METHOD = 'property.p184.landOwnershipH4';
const P243_244_VESSEL_METHOD = 'travel.p243-244.vesselH1Signs';
const P212_DISPUTE_WINNER_METHOD = 'dispute.p212.winnerH1';
const P272_273_PRISONER_METHOD = 'prisoner.p272-273.rapidExitH11WithH5Caution';
const P249_MISSING_CITY_METHOD = 'missing.p249.departedCityH7';
const P174_HOPE_METHOD = 'hope.p174.h5h11ThroughH1';
const P176_REQUEST_METHOD = 'request.p176.h1h2GateThenH1H4';
const P176_PURPOSE_METHOD = 'intent.p176.h7h10';
const P273_PUNISHMENT_METHOD = 'fear.p273.punishmentSigns';
const P240_TRAVEL_CAUTION_METHOD = 'travel.p240.roadCautionsH9H7';
const P254_DREAM_METHOD = 'dream.p254.h9AndTransit';
const P236_TRAVEL_TIME_METHOD = 'travel.p236.timeSelectionH9H4';
const P172_MATTER_OUTCOME_METHOD = 'matter.p172.h17_h1011_thenCombine';
const P183_CURRENT_VS_NEW_METHOD = 'relocation.p183.currentVsNewPlace';
const P256_HONOR_CONDITION_METHOD = 'authority.p256.honorConditionH10Planet';
const P257_APPOINTMENT_METHOD = 'authority.p257.appointmentH1H10Planet';
const P257_RULER_CONDITION_METHOD = 'authority.p257.rulerConditionH7H10';
const P264_LIFESPAN_STAGES_METHOD = 'lifespan.p264.stagesH11H9H7';
const P180_LIVELIHOOD_METHOD = 'money.p180.livelihoodH10Invert';
const P181_MONEY_ACQUIRE_METHOD = 'money.p181.recast25811';
const P182_MONEY_OUTLOOK_METHOD = 'money.p182.h2h10Outlook';
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
const P254_PROFESSION_METHOD = 'profession.p254.h9Planet';
const P196_DURATION_RISK_METHOD = 'illness.p196.h1RecurrenceDurationRisk';
const P196_SENSORY_SIGNS_METHOD = 'illness.p196.sensorySignsH6H8';
const P192_MATERNAL_SAFETY_METHOD = 'pregnancy.p192.maternalSafetyH6H8H12';
const P194_CHILD_WELLBEING_METHOD = 'child.p194.wellbeingH5H16';
const P212_DISPUTE_H2H8_METHOD = 'dispute.p212.winnerH2H8Sign';
const P168_NEED_MOVE_METHOD = 'need.p168.moveToObtainH5H9H14';
const P168_REQUEST_EASE_METHOD = 'request.p168.answeredEaseH5H7';
// 2026-10-06 (backfill-13): thirteen pre-existing, already-routed, ready
// methods found carrying NO certification entry at all -- not opened or
// touched this round, just never backfilled by an earlier certification
// batch. This is a real functional gap: the live GPT system prompt
// (supabase/functions/oren-smart-advisor/oren-smart-advisor-brain-prompt.ts)
// forces clientAnswerDraft=null whenever certificationStatus!=="certified"
// or clientFacingCertified!==true, regardless of aiVerdictAllowed -- so
// every one of these already-shipped questions was silently producing no
// client-facing draft through the AI path despite a correct, ready
// computation underneath.
const P169_MATTER_VALIDITY_METHOD = 'matter.p169.validityH6H8Planet';
const P205_MODESTY_PURITY_METHOD = 'marriage.p205.modestyPurity';
const P208_WOMAN_QUALITY_METHOD = 'marriage.p208.womanQualityH5H4';
const P170_MUTUAL_GAZE_METHOD = 'attention.p170.mutualGazeFireRows1713';
const P239_TRAVEL_PROFIT_WITNESS_METHOD = 'travel.p239.profitH7Witness';
const P249_IN_CITY_H1H4_METHOD = 'missing.p249.inCitySignH1H4';
const P249_RETURN_TIMING_METHOD = 'missing.p249.returnTimingTariqH10H11';
const P249_ARRIVAL_SIGN_METHOD = 'missing.p249.arrivalSignH3H15';
const P212_PARTNERSHIP_COMPAT_METHOD = 'partnership.p212.compatibilityH1H7H5H7';
const P169_NEED_FULFILLMENT_METHOD = 'need.p169.fulfillmentH1Fortune';
const P272_PRISONER_OUTCOME_METHOD = 'prisoner.p272.outcomeH1H4';
const P272_PRISONER_EXIT_SAFETY_METHOD = 'prisoner.p272.exitSafetyH12';
const P272_PRISONER_RELEASE_MANNER_METHOD = 'prisoner.p272.releaseManner';

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

function p224TheftRecoveryPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-05',
    goldenCaseIds: freezeArray(['PV-BF05-P224-RECOVERED', 'PV-BF05-P224-NOT-RECOVERED', 'PV-BF05-P224-MIXED']),
    policyId: 'p224-theft-recovery-h8-v1',
    questionScopeHebrew: 'השגת רכוש שנגנב לפי בית 8, עמ׳ 224',
    decisiveRuleHebrew: 'H8 מיטיב טהור => בעל הדבר יזכה בגניבה; H8 מזיק טהור => לא יזכה בה. לצורה ממוזגת אין דין בסעיף.',
    oneWayBranches: freezeArray([
      'H8 מיטיב => הרכוש הגנוב יושג',
      'H8 מזיק => הרכוש הגנוב לא יושג',
    ]),
    forbiddenInversions: freezeArray([
      'H8 ממוזג אינו פסק חלקי או הסתברות להשבה.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'lostItem.p202.returnH6H8 — השבת אבדה היא שאלה נפרדת.',
      'זהות הגנב, תיאורו ומיקום הגניבה הם דינים נפרדים.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'אדם מסוים גנב את הרכוש',
      'הרכוש יוחזר במועד או במקום מסוים',
    ]),
  });
}

function p271EnemyPolicy() {
  return Object.freeze({
    certificationStatus: 'certified', certificationBatch: 'professional-backfill-12',
    goldenCaseIds: freezeArray(['PV-BF12-P271-BOTH-GOOD', 'PV-BF12-P271-BOTH-BAD', 'PV-BF12-P271-QUERENT', 'PV-BF12-P271-ENEMY', 'PV-BF12-P271-MIXED']),
    policyId: 'p271-enemy-h1-h12-v1', questionScopeHebrew: 'קיום אויב והתגברות לפי בתים 1 ו־12',
    decisiveRuleHebrew: 'שני הבתים מיטיבים => אין אויב; שניהם מזיקים => יש אויבים; הראשון מיטיב והשנים־עשר מזיק => השואל גובר; להפך => האויב גובר.',
    oneWayBranches: freezeArray(['H1/H12 מיטיב/מיטיב => אין אויב', 'מזיק/מזיק => יש אויבים', 'מיטיב/מזיק => השואל גובר', 'מזיק/מיטיב => האויב גובר']),
    forbiddenInversions: freezeArray(['צורה ממוזגת אינה מוכרעת בארבעת הענפים.']),
    excludedFromPrimaryVerdict: freezeArray(['זיהוי אדם, קביעה שהאויב נסתר, וקביעת רמת סכנה.']),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray(['פלוני הוא האויב', 'האויב פועל בסתר', 'האויב גרם כישוף']),
  });
}

function p197IllnessHumorPolicy() {
  return Object.freeze({
    certificationStatus: 'certified', certificationBatch: 'professional-backfill-12',
    goldenCaseIds: freezeArray(['PV-BF12-P197-WATER', 'PV-BF12-P197-EARTH', 'PV-BF12-P197-FIRE', 'PV-BF12-P197-AIR', 'PV-BF12-P197-MISMATCH']),
    policyId: 'p197-illness-h1-h8-element-v1', questionScopeHebrew: 'סיווג מסורתי של סוג חולי לפי היסוד המשותף לבתים 1 ו־8',
    decisiveRuleHebrew: 'מים => קור ולחות; עפר => מרה שחורה; אש => מרה צהובה; אוויר => רוחות שונות. יסודות שונים אינם מוכרעים.',
    oneWayBranches: freezeArray(['H1/H8 אותו יסוד => קטגוריית הספר בלבד']),
    forbiddenInversions: freezeArray(['שני יסודות שונים אינם מייצרים אבחנה או היעדר חולי.']),
    excludedFromPrimaryVerdict: freezeArray(['אבחון רפואי מודרני, סיבה רוחנית, טיפול או תחזית החלמה.']),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray(['זו מחלה מאובחנת', 'אפשר להימנע מבדיקה רפואית', 'כישוף גרם לחולי']),
  });
}

function p263FriendshipPolicy() {
  return Object.freeze({
    certificationStatus: 'certified', certificationBatch: 'professional-backfill-12',
    goldenCaseIds: freezeArray(['PV-BF12-P263-GOOD-PAIR', 'PV-BF12-P263-BAD-PAIR', 'PV-BF12-P263-MIXED']),
    policyId: 'p263-friendship-pair-derived-v1', questionScopeHebrew: 'תועלת/נזק הדדי בחברות והצורה הנולדת מבתים 1 ו־11',
    decisiveRuleHebrew: 'שני הבתים מיטיבים => תועלת הדדית; שניהם מזיקים => נזק הדדי. צורה נולדת מיטיבה => טוב ביניהם, מזיקה => להפך.',
    oneWayBranches: freezeArray(['H1/H11 שניהם מיטיבים או שניהם מזיקים => עדות זוגית', 'הצורה הנולדת מיטיבה או מזיקה => עדות נפרדת']),
    forbiddenInversions: freezeArray(['אין פסק כולל כאשר העדויות שונות או כשהסעיף שותק על צורה ממוזגת.']),
    excludedFromPrimaryVerdict: freezeArray(['כנות פנימית, נאמנות מוחלטת, תקווה ושאלת אהבה ממקורות אחרים.']),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray(['החבר משקר', 'החבר בוגד', 'האדם אינו נאמן']),
  });
}

function p273PunishmentPolicy() {
  return Object.freeze({
    certificationStatus: 'certified', certificationBatch: 'professional-backfill-13',
    goldenCaseIds: freezeArray(['PV-BF13-P273-H1', 'PV-BF13-P273-H12', 'PV-BF13-P273-MISSING', 'PV-BF13-P273-MIXED']),
    policyId: 'p273-punishment-one-way-v1', questionScopeHebrew: 'היעדר חשש מעונש לפי סימני בתי 10, 5, 1 או 12, ו־4',
    decisiveRuleHebrew: 'H10 כבוד נכנס, H5 סף נכנס, נשוא ראש H1 או H12, ו־H4 מיטיב טהור => אין לחשוש. אחרת אין דין הפוך.',
    oneWayBranches: freezeArray(['כל התנאים יחד => אין לחשוש מן העונש']),
    forbiddenInversions: freezeArray(['אי־קיום התנאי אינו מוכיח שהעונש יוטל.', 'H4 ממוזג אינו מיטיב טהור.']),
    excludedFromPrimaryVerdict: freezeArray(['עיתוי ענישה, זיכוי משפטי ושחרור אסיר.']),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray(['העונש ודאי יוטל', 'בית משפט יזכה אותך', 'אין צורך בייעוץ משפטי']),
  });
}

function p240TravelCautionPolicy() {
  return Object.freeze({
    certificationStatus: 'certified', certificationBatch: 'professional-backfill-13',
    goldenCaseIds: freezeArray(['PV-BF13-P240-FIRE', 'PV-BF13-P240-AIR', 'PV-BF13-P240-WATER', 'PV-BF13-P240-EARTH']),
    policyId: 'p240-travel-cautions-h9-h7-v1', questionScopeHebrew: 'טיב הדרך בבית 9 וסוג האזהרה לפי יסוד בית 7',
    decisiveRuleHebrew: 'H9 מיטיב => טוב; מזיק => להיזהר. H7 אש/אוויר/מים/עפר => אזהרות הליסטים/בהמות/טביעה גנבה ולחימה/נחשים ועקרבים.',
    oneWayBranches: freezeArray(['דין H9 לפי מיטיב/מזיק טהור', 'דין סוג האזהרה לפי יסוד H7']),
    forbiddenInversions: freezeArray(['H9 ממוזג אינו מוכרע בדין זה.', 'אזהרת H7 אינה קביעה שאירוע יקרה.']),
    excludedFromPrimaryVerdict: freezeArray(['בטיחות כלי שיט, מועד חזרה, סכנת חיים מוכחת.']),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray(['ודאי תיפגע בדרך', 'הדרך בטוחה בוודאות', 'תתרחש גנבה']),
  });
}

function p254DreamPolicy() {
  return Object.freeze({
    certificationStatus: 'certified', certificationBatch: 'professional-backfill-14',
    goldenCaseIds: freezeArray(['PV-BF14-P254-GOOD', 'PV-BF14-P254-ADVERSE', 'PV-BF14-P254-MIXED', 'PV-BF14-P254-OCCURRENCE']),
    policyId: 'p254-dream-h9-omen-v1', questionScopeHebrew: 'סימן החלום לפי טיב צורת בית 9 והופעות אותה צורה בלוח',
    decisiveRuleHebrew: 'H9 מיטיב => דון לטוב; מזיק => להפך. היכן עברה הצורה נרשם, ללא דין נוסף שאינו מפורט בסעיף.',
    oneWayBranches: freezeArray(['H9 מיטיב טהור => סימן לטובה', 'H9 מזיק טהור => סימן הפוך']),
    forbiddenInversions: freezeArray(['H9 ממוזג אינו פסק ביניים.', 'הופעת צורה בבית אחר אינה פשר חלום מפורט בלא כלל נוסף.']),
    excludedFromPrimaryVerdict: freezeArray(['פירוש תמונות וסמלים בחלום; הבדל מובנה בין חלום יומי לנבואי.']),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray(['תוכן החלום מבשר על אירוע מסוים', 'החלום נבואי', 'החלום מלמד מי פגע בשואל']),
  });
}

function p236TravelTimePolicy() {
  return Object.freeze({
    certificationStatus: 'certified', certificationBatch: 'professional-backfill-14',
    goldenCaseIds: freezeArray(['PV-BF14-P236-H9-ROAD', 'PV-BF14-P236-H1-HONOR', 'PV-BF14-P236-H4-MIXED', 'PV-BF14-P236-NO-MATCH']),
    policyId: 'p236-travel-time-proposed-v1', questionScopeHebrew: 'התאמת זמן נסיעה שהוצע מראש לפי בתים 9/1 ו־4',
    decisiveRuleHebrew: 'דרך, נשוא ראש או כבוד נכנס ב־H9 או H1, ובית 4 מיטיב טהור => סימן טוב לזמן המוצע.',
    oneWayBranches: freezeArray(['צורה נקובה ב־H9 או H1 ו־H4 מיטיב טהור => זמן מוצע נוח']),
    forbiddenInversions: freezeArray(['אי־קיום התנאי אינו קובע שהמסע ייכשל.', 'H4 ממוזג אינו מיטיב טהור.']),
    excludedFromPrimaryVerdict: freezeArray(['חישוב תאריך עתידי, שעת יציאה, בטיחות הדרך.']),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray(['יש לצאת בתאריך מסוים שהמנוע חישב', 'המסע ייכשל בוודאות']),
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
      'love.p205.ascendantAndSoughtFifth — אהבה ישירה, כרגע repair-required.',
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
      'love.p205.ascendantAndSoughtFifth — אהבת אדם אחר.',
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

function p191192MiscarriagePolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'downstream-batch-21',
    goldenCaseIds: freezeArray(['DS21-P191-192-MISCARRIAGE-SIGN', 'DS21-P191-192-MISCARRIAGE-ABSENT']),
    policyId: 'p191-192-miscarriage-red-h7-nakis-h8-v1',
    questionScopeHebrew: 'סימן ההפלה המפורש בתפר עמ׳ 191–192: אדום H7 + שפל ראש H8',
    decisiveRuleHebrew: 'Humra/אדום (2122) ב-H7 יחד עם Ankis/שפל ראש (2221) ב-H8 => סימן ההפלה המפורש במקור. אם הצירוף אינו מתקיים, השיטה אינה מכריעה בטיחות.',
    oneWayBranches: freezeArray([
      'אדום H7 + שפל ראש H8 => סימן ההפלה המפורש במקור',
      'הצירוף אינו מתקיים => ללא הכרעה; אין היפוך לבטיחות',
    ]),
    forbiddenInversions: freezeArray([
      'היעדר הצירוף אינו מוכיח שלא תתרחש הפלה.',
      'סימן המקור אינו הופך לוודאות רפואית שהפלה תתרחש.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'pregnancy.p191.childSafetyH1H6H8 — שלום הוולד הוא דין נפרד.',
      'pregnancy.p192.maternalSafetyH6H8H12 — בטיחות האם היא דין נפרד.',
      'ענפי הפלה/סיכון נוספים בעמ׳ 192–193 אינם מצביעים למסלול הנבחר.',
      'אבחנה רפואית, בדיקות רפואיות או תחזית קלינית.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'ההפלה ודאית מבחינה רפואית',
      'ההריון בטוח משום שהצירוף אינו קיים',
      'האם או הוולד ימותו',
      'זהו אבחון רפואי',
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

function p188QuarterDirectionPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'four-independent-casts-p188',
    goldenCaseIds: freezeArray(['P188-FOUR-CASTS-ONE', 'P188-FOUR-CASTS-MULTIPLE', 'P188-FOUR-CASTS-UNRESOLVED']),
    policyId: 'p188-four-independent-quarter-casts-v1',
    questionScopeHebrew: 'כיוון הדבר הנסתר במקום שנחלק לארבעה רבעים, עמ׳ 188',
    decisiveRuleHebrew: 'צורה מיטיבה טהורה ופנימית מסמנת רבע חשוד; מזיקה טהורה וחיצונית שוללת רבע. ארבע צורות עצמאיות נדרשות. צורות אחרות אינן מוכרעות.',
    oneWayBranches: freezeArray([
      'מיטיב טהור+פנימי => אותו רבע חשוד לפי הכלל',
      'מזיק טהור+חיצוני => אין באותו רבע דבר לפי הכלל',
    ]),
    forbiddenInversions: freezeArray([
      'רבע שלא סומן כחשוד אינו נשלל אלא אם הופיע בו מזיק טהור וחיצוני.',
      'ריבוי רבעים חשודים אינו מוכרע בהצבעת רוב או בבחירת הראשון.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'ארבע האמהות ובתי הלוח הרגיל אינם ארבע ההטלות הייעודיות.',
      'שיטות עמ׳ 185–187 ו־190, והדין הנפרד אם הדבר עדיין במקומו.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'נקודת חפירה מדויקת או כיוון מצפן שלא סומן בקלט',
      'קיום ודאי של מטמון מתוך סימון רבע חשוד',
      'פסק כולל בהיעדר רבע חשוד יחיד וכל יתר הרבעים מוכרעים',
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

function p182MoneyOutlookPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'downstream-batch-18',
    goldenCaseIds: freezeArray(['PV-B18-P182-GOOD', 'PV-B18-P182-BAD', 'PV-B18-P182-MIXED']),
    policyId: 'p182-money-outlook-h2h10-single-route-v1',
    questionScopeHebrew: 'מצב כללי של הממון והפרנסה לפי הולדת H2+H10, עמ׳ 182',
    decisiveRuleHebrew: 'מולידים צורה מ-H2 ומ-H10. צורה מיטיבה מורה על טוב בעניין; מזיקה מורה על רע. צורה ממוזגת נשארת ללא פסק בינארי.',
    oneWayBranches: freezeArray([
      'תוצאת H2+H10 מיטיבה => טוב בעניין הממון והפרנסה',
      'תוצאת H2+H10 מזיקה => רע בעניין הממון והפרנסה',
    ]),
    forbiddenInversions: freezeArray([
      'צורה ממוזגת אינה נהפכת אוטומטית לטוב או לרע לפי נטייה.',
      'אין להסיק מן התוצאה מקור כסף, סכום, זמן קבלה או חוקיות.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'money.p180.elementComparison — השוואת ממון בין שני אנשים, חסומה.',
      'money.p180.livelihoodH10Invert — מצב המחיה בשיטה נפרדת.',
      'money.p181.recast25811 — השגת ממון מסוים בשיטה נפרדת.',
      'money.p181.otherBookRemainder — תוספת מספר אחר עם סתירת מקור.',
      'money.p179.sourceByIncomingHonorHouse — מקור הממון בשיטה נפרדת.',
      'כל supportingChecks של topic money הישן.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'הכסף יגיע ממקור מסוים',
      'סכום הכסף יהיה מסוים',
      'הממון מותר או אסור',
      'ממון מסוים יתקבל בוודאות',
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
      'love.p205.ascendantAndSoughtFifth — שאלת אהבה היא שיטה נפרדת וחסומה כרגע.',
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
      'travel.p236.timeSelectionH9H4 — בחירת זמן לפי צורות נקובות היא דין נפרד.',
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

function p265StateContinuityPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-state-p265-first-clause',
    goldenCaseIds: freezeArray(['PV-P265-STATE-REPEAT-HAPPY', 'PV-P265-STATE-NO-HAPPY-REPEAT']),
    policyId: 'p265-state-continuity-first-clause-v1',
    questionScopeHebrew: 'סימן לקיום המצב הנוכחי לפי הענף הראשון בעמ׳ 265',
    decisiveRuleHebrew: 'צורת H1 מיטיבה טהורה, חוזרת בבית מאושר נוסף לפי עמ׳ 174–175 וגם בבית 15 — סימן לקיום המצב ושלמות האושר.',
    oneWayBranches: freezeArray([
      'כל שלושת התנאים מתקיימים => סימן מקור ליציבות המצב',
    ]),
    forbiddenInversions: freezeArray([
      'העדר חזרה או בית מאושר אינו מוכיח שהמצב יידרדר או שהתפקיד יאבד.',
      'ענף H1/H2/H9/H15 השני אינו מוכרע באמצעות סיווג מיטיב טהור בלבד.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'העזר הישן computeStateStabilityKashf והאשכול authorityState הרחב.',
      'career.p266.returnToOffice — חזרה לתפקיד לאחר הדחה היא שיטה אחרת.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'יציבות בינונית', 'ירידה צפויה', 'אובדן התפקיד', 'מועד שינוי המצב',
    ]),
  });
}

function p257MotherNightPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-mother-p257-night-placement',
    goldenCaseIds: freezeArray(['PV-P257-MOTHER-NIGHT-ANGLE', 'PV-P257-MOTHER-NIGHT-FALLING', 'PV-P257-MOTHER-DAY-BLOCK']),
    policyId: 'p257-mother-night-white-road-placement-v1',
    questionScopeHebrew: 'סימן למצב האם לפי מיקום לבן או דרך בשאלת לילה, עמ׳ 257',
    decisiveRuleHebrew: 'לבן או דרך ביתד/סמוך לו — טוב ותיקון; בבית נופל — צרות; רק כאשר השאלה נשאלה בלילה.',
    oneWayBranches: freezeArray([
      'לילה עם הופעה רק בביתד/סמוך => סימן לטוב ותיקון',
      'לילה עם הופעה רק בבית נופל => סימן לצרות',
    ]),
    forbiddenInversions: freezeArray([
      'בהיעדר לבן/דרך אין פסק על מצב האם.',
      'הופעה בשתי קבוצות הבתים אינה מקבלת כלל קדימות מומצא.',
      'בחירת יום או זמן חסר אינם מפעילים את ענף הלילה.',
    ]),
    excludedFromPrimaryVerdict: freezeArray(['דין “בית זה” שאינו סגור', 'ענף היום וצורות נוגה', 'אבחון רפואי']),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray(['אבחון בריאות האם', 'פסק יום לפי נוגה']),
  });
}

function p267HopeHouse11Policy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-hope-p267-house11-fallback',
    goldenCaseIds: freezeArray(['PV-P267-H11-BENEFIC', 'PV-P267-H11-MALEFIC', 'PV-P267-H11-MIXED']),
    policyId: 'p267-hope-house11-fallback-v1',
    questionScopeHebrew: 'סימן למימוש תקווה מענף בית התקווה בלבד',
    decisiveRuleHebrew: 'צורה מיטיבה טהורה בבית התקווה מורה זכייה וטוב; מזיקה טהורה מורה אי־השלמה.',
    oneWayBranches: freezeArray(['H11 מיטיב טהור => זכייה וטוב', 'H11 מזיק טהור => הדבר אינו נשלם']),
    forbiddenInversions: freezeArray([
      'ממוזג בבית 11 אינו פסק מיטיב או מזיק.',
      'התנאי המורכב של בתי 1/2/5/13, חזרת בית 11 וטבע הבקשה עדיין אינו מחושב.',
    ]),
    excludedFromPrimaryVerdict: freezeArray(['completion.p173.fireRows15910 — השלמת עניין בשיטה אחרת', 'hope.p174.h5h11ThroughH1 — תקווה בשיטה אחרת']),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray(['מועד מימוש התקווה', 'פסק מן התנאי המורכב', 'פירוש צורה ממוזגת כפסק']),
  });
}

function p193GiftQualityPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-gift-p193-h5',
    goldenCaseIds: freezeArray(['PV-P193-GIFT-BENEFIC', 'PV-P193-GIFT-MALEFIC', 'PV-P193-GIFT-MIXED']),
    policyId: 'p193-gift-quality-h5-v1',
    questionScopeHebrew: 'סימן לטובה או להפך במתנה מסוימת',
    decisiveRuleHebrew: 'בית המתנות הוא H5 בעמ׳ 48; עמ׳ 193 דן מתנות במיטיב לטובה ובמזיק להפך.',
    oneWayBranches: freezeArray(['H5 מיטיב טהור => סימן לטובה', 'H5 מזיק טהור => סימן להפך']),
    forbiddenInversions: freezeArray(['H5 ממוזג אינו מקבל פסק מיטיב או מזיק.', 'סימן איכות המתנה אינו מבטיח הגעת מתנה.']),
    excludedFromPrimaryVerdict: freezeArray(['completion.p173.fireRows15910', 'joy.p196.recast14511']),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray(['המתנה תגיע', 'זהות הנותן ודאית', 'מועד קבלת המתנה']),
  });
}

function p184FatherMoneyPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-father-money-p184',
    goldenCaseIds: freezeArray(['PV-P184-FATHER-MONEY', 'PV-P184-FATHER-NO-MONEY-OR-NO-BENEFIT', 'PV-P184-FATHER-MIXED']),
    policyId: 'p184-father-money-h5-v1',
    questionScopeHebrew: 'סימן ממונו של האב בבית החמישי בלבד',
    decisiveRuleHebrew: 'מיטיב טהור בחמישי — יש לו ממון; מזיק טהור — אין לו ממון או שאין לו תועלת מן הממון שיש לו.',
    oneWayBranches: freezeArray(['H5 מיטיב טהור => סימן ממון', 'H5 מזיק טהור => העדר ממון או העדר תועלת ממנו']),
    forbiddenInversions: freezeArray(['H5 ממוזג אינו נותן פסק.', 'סעיף האב אינו סעיף נכס השואל.']),
    excludedFromPrimaryVerdict: freezeArray(['property.p184-185.houseGardenMap', 'family.fatherPropertyMixedScope.unsupported']),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray(['אבחון בריאות האב', 'אורך חייו של האב', 'בעלות על בית או קרקע']),
  });
}

function p184LandOwnershipPolicy() {
  return Object.freeze({
    certificationStatus: 'certified', certificationBatch: 'professional-land-ownership-p184',
    goldenCaseIds: freezeArray(['PV-P184-LAND-POSITIVE', 'PV-P184-LAND-NEGATIVE', 'PV-P184-LAND-MIXED']),
    policyId: 'p184-land-ownership-h4-v1',
    questionScopeHebrew: 'סימן לקניין נכס או קרקע בבית הרביעי',
    decisiveRuleHebrew: 'מיטיב טהור ברביעי מורה נכס וקניין; העדר מיטיב בטוח בענף המזיק מורה העדר קניין או יציאתו.',
    oneWayBranches: freezeArray(['H4 מיטיב טהור => סימן לקניין', 'H4 מזיק טהור => סימן להעדר קניין או יציאתו']),
    forbiddenInversions: freezeArray(['H4 ממוזג אינו מכריע.', 'סימן גורל אינו אישור בעלות משפטי.']),
    excludedFromPrimaryVerdict: freezeArray(['property.p184-185.houseGardenMap', 'agriculture.mixedScope.unsupported']),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray(['תחזית יבול', 'מצב השקיה', 'בעלות רשומה בקרקע']),
  });
}

function p243244VesselPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-vessel-h1-p243-244',
    goldenCaseIds: freezeArray(['PV-P243-VESSEL-ARRIVAL', 'PV-P243-VESSEL-REPAIR', 'PV-P243-VESSEL-UNNAMED']),
    policyId: 'p243-244-vessel-h1-signs-v1',
    questionScopeHebrew: 'סימן הגעה או פגם בר תיקון של כלי שיט לפי בית ראשון',
    decisiveRuleHebrew: 'קהלה בבית הראשון מורה על הגעה בשלום; הצורות המנויות האחרות מורות על מקום פגם ותיקונו.',
    oneWayBranches: freezeArray(['H1 קהלה => סימן הגעה בשלום', 'H1 אחת הצורות המנויות לפגם => פגם מסוים ותיקון']),
    forbiddenInversions: freezeArray(['שלוש צורות לא מנויות נשארות ללא פסק.', 'פגם ותיקון אינם שקולים לשבר או לאובדן הכלי.']),
    excludedFromPrimaryVerdict: freezeArray(['travel.p242.vehicleSafety', 'travel.p240.roadCautionsH9H7']),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray(['אישור בטיחות עובדתי למסע', 'טביעה ודאית', 'הכרעה לפי חזרת הצורה בבית 12']),
  });
}

function p212DisputeWinnerPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-dispute-h1-p212',
    goldenCaseIds: freezeArray(['PV-P212-DISPUTE-SEEKER', 'PV-P212-DISPUTE-OTHER', 'PV-P212-DISPUTE-MIXED']),
    policyId: 'p212-dispute-winner-h1-v1',
    questionScopeHebrew: 'סימן המתגבר בסכסוך על פי צורת בית ראשון בלבד',
    decisiveRuleHebrew: 'מזיק טהור ב-H1 מורה שהמבקש גובר; מיטיב טהור מורה שהצד השני גובר.',
    oneWayBranches: freezeArray(['H1 מזיק טהור => המבקש גובר', 'H1 מיטיב טהור => הצד השני גובר']),
    forbiddenInversions: freezeArray(['צורה ממוזגת אינה מוכרעת.', 'אין להציג את סימן H1 כפסק המאחד גם את בתי 2 ו־8.']),
    excludedFromPrimaryVerdict: freezeArray(['dispute.p212.reconciliationH1H7', 'dispute.p213.winnerStrengthUnresolved']),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray(['פסק כולל כאשר עדויות הסכסוך חלוקות', 'הכרעה לפי חוזק בלתי מוגדר', 'תוצאת הליך משפטי בפועל']),
  });
}

function p272273PrisonerPolicy() {
  return Object.freeze({
    certificationStatus: 'certified', certificationBatch: 'professional-prisoner-p272-273',
    goldenCaseIds: freezeArray(['PV-P272-PRISONER-RAPID', 'PV-P273-PRISONER-CAUTION', 'PV-P272-273-PRISONER-CONFLICT', 'PV-P272-PRISONER-ABSENT']),
    policyId: 'p272-273-prisoner-rapid-exit-and-caution-v1',
    questionScopeHebrew: 'סימן יציאה מהירה של אסיר והאזהרה הנגדית בלבד',
    decisiveRuleHebrew: 'כבוד נכנס ב-H11 מורה יציאה מהירה; שפל ראש ב-H5 מורה חשש שמא לא יצא.',
    oneWayBranches: freezeArray(['H11 כבוד נכנס בלבד => סימן יציאה מהירה', 'H5 שפל ראש => אזהרה שמא לא יצא']),
    forbiddenInversions: freezeArray(['העדר H11 אינו שולל שחרור.', 'נוכחות שני הסימנים אינה מוכרעת בהצבעה.', 'אזהרת H5 אינה ודאות של אי־יציאה.']),
    excludedFromPrimaryVerdict: freezeArray(['prisoner.releaseTiming.unresolved', 'fear.p273.punishmentSigns']),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray(['תאריך שחרור', 'האסיר בוודאות לא ישוחרר', 'הכרעה כאשר סימני H11 ו־H5 סותרים']),
  });
}

function p249MissingCityPolicy() {
  return Object.freeze({
    certificationStatus: 'certified', certificationBatch: 'professional-missing-city-p249',
    goldenCaseIds: freezeArray(['PV-P249-MISSING-DEPARTED', 'PV-P249-MISSING-FIXED', 'PV-P249-MISSING-UNKNOWN']),
    policyId: 'p249-missing-departed-city-h7-v1',
    questionScopeHebrew: 'סימן עזיבת העיר או שהייה במקום לפי בית הנעדר',
    decisiveRuleHebrew: 'מיטיב חיצוני בבית 7 מורה שיצא מן העיר; צורה קבועה מורה על שהייה במקום.',
    oneWayBranches: freezeArray(['H7 מיטיב טהור וחיצוני => סימן יציאה מן העיר', 'H7 קבוע => שהייה במקום בלתי מזוהה']),
    forbiddenInversions: freezeArray(['היעדר מיטיב חיצוני אינו אומר שהנעדר בעיר.', 'שהייה במקום אינה מזהה את העיר.']),
    excludedFromPrimaryVerdict: freezeArray(['missing.p249.directionUnresolved', 'fugitive.external.p250.nuzhat']),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray(['מיקום נוכחי מאומת', 'כיוון גיאוגרפי', 'כתובת הנעדר']),
  });
}

function p174HopeThroughIntermediatesPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-hope-p174-two-intermediates',
    goldenCaseIds: freezeArray(['PV-P174-HOPE-INCOMING', 'PV-P174-HOPE-OUTGOING', 'PV-P174-HOPE-UNRESOLVED']),
    policyId: 'p174-hope-two-intermediates-v1',
    questionScopeHebrew: 'מימוש תקווה מסוימת לפי חיבורי הבתים 1, 5 ו־11',
    decisiveRuleHebrew: 'חבר 5 עם 1 ו־11 עם 1, אחר כך את שתי הנולדות; דון בארבעה צירופי מיטיב/מזיק ופנימי/חיצוני שבמקור.',
    oneWayBranches: freezeArray([
      'מיטיב פנימי => הבקשה נענית; מיטיב חיצוני => מתעכבת ונענית',
      'מזיק פנימי => מושגת בעמל; מזיק חיצוני => עדיף לעזוב',
    ]),
    forbiddenInversions: freezeArray(['ממוזג או קבוע/מתהפך אינם מקבלים הכרעה בארבעת הענפים.']),
    excludedFromPrimaryVerdict: freezeArray(['hope.p267.fulfillment', 'completion.p173.fireRows15910']),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray(['מועד מדויק', 'פסק מתקווה בעמ׳ 267']),
  });
}

function p176RequestGatePolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-request-p176-gate-outcome',
    goldenCaseIds: freezeArray(['PV-P176-REQUEST-GATE', 'PV-P176-REQUEST-GOOD', 'PV-P176-REQUEST-DIFFICULT', 'PV-P176-REQUEST-MIDDLE', 'PV-P176-REQUEST-MIXED-GATE']),
    policyId: 'p176-request-gate-outcome-v1',
    questionScopeHebrew: 'אחרית בקשה מסוימת לפי שער הבתים 1/2 וחיבור 1+4',
    decisiveRuleHebrew: 'מזיק טהור באחד מבתי השער מורה לעזוב; אחרי שער מיטיב טהור בשניהם דנים בצורת 1+4: מיטיב, מזיק או ממוזג.',
    oneWayBranches: freezeArray([
      'H1 או H2 מזיק טהור => עצת מקור לעזוב את הבקשה, בלי חישוב פסק אחרית',
      'שער מיטיב בשניהם, 1+4 מיטיב => טוב ושלום; מזיק => עמל וקושי; ממוזג => אחרית ממוצעת',
    ]),
    forbiddenInversions: freezeArray(['שער ממוזג ללא מזיק טהור אינו נהפך לשער חיובי.', 'עצה לעזוב אינה קביעה ודאית שהבקשה תיכשל.']),
    excludedFromPrimaryVerdict: freezeArray(['hope.p174.h5h11ThroughH1', 'hope.p267.fulfillment', 'completion.p173.fireRows15910']),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray(['מועד מימוש מדויק', 'כישלון ודאי מענף עצת העזיבה']),
  });
}

function p176PersonPurposePolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-person-purpose-p176',
    goldenCaseIds: freezeArray(['PV-P176-PURPOSE-FAVORABLE', 'PV-P176-PURPOSE-ADVERSE', 'PV-P176-PURPOSE-MIXED']),
    policyId: 'p176-person-purpose-h7h10-v1',
    questionScopeHebrew: 'סימן למטרתו של אדם בעניין מוגדר',
    decisiveRuleHebrew: 'חיבור H7+H10: צורה מיטיבה נותנת סימן מיטיב למטרה, מזיקה נותנת סימן מזיק.',
    oneWayBranches: freezeArray(['מיטיב טהור => סימן מיטיב', 'מזיק טהור => סימן מזיק']),
    forbiddenInversions: freezeArray(['ממוזג אינו פסק מיטיב או מזיק.', 'אין ללמוד מן הסימן על יושר, מוסר או מחשבות נסתרות.']),
    excludedFromPrimaryVerdict: freezeArray(['dhamir.p159.subjectByH6Recurrence', 'request.p176.h1h2GateThenH1H4']),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray(['הוא משקר', 'כוונתו נסתרת', 'אופיו רע']),
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
    questionScopeHebrew: 'האם מאחורי השואל יש פעולה נסתרת לפי אוויר H4,H6,H8,H15, עמ׳ 167',
    decisiveRuleHebrew: 'מרכיבים צורה משורת האוויר של H4,H6,H8 והמאזן H15. אם התוצאה מזיקה => יש פעולה מאחורי השואל; ואם לא => אין פעולה לפי כלל זה.',
    oneWayBranches: freezeArray([
      'הצורה המורכבת מזיקה => יש פעולה מאחורי השואל',
      'הצורה המורכבת אינה מזיקה => אין פעולה מאחורי השואל לפי הכלל',
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

function p196DurationRiskPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-11',
    goldenCaseIds: freezeArray(['PV-BF11-P196-DUR-H6', 'PV-BF11-P196-DUR-H8', 'PV-BF11-P196-DUR-NONE']),
    policyId: 'p196-duration-risk-h1-recurrence-v1',
    questionScopeHebrew: 'סימן משך/סיכון המחלה לפי חזרת צורת H1 בעמ׳ 196',
    decisiveRuleHebrew: 'צורת H1 חוזרת בבית 6 => המחלה מתארכת. צורת H1 חוזרת בבית 8 => המחלה מתארכת ויש לחשוש. אין משך מספרי ואין פסק מוות.',
    oneWayBranches: freezeArray([
      'צורת H1 חוזרת בבית 6 => המחלה מתארכת',
      'צורת H1 חוזרת בבית 8 => המחלה מתארכת ויש לחשוש',
    ]),
    forbiddenInversions: freezeArray([
      'היעדר חזרה אינו מוכיח שהמחלה קצרה.',
      'אין להמיר "יש לחשוש" לפסק מוות או אי-החלמה.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'illness.p196.outcomeH15 — החלמה/התארכות לפי H15 הוא דין נפרד.',
      'illness.p196.sensorySignsH6H8 — סימני ראייה/שמיעה הם דין נפרד.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'מספר ימים/חודשים מדויק למחלה',
      'ודאות מוות או אי-החלמה',
    ]),
  });
}

function p196SensorySignsPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-11',
    goldenCaseIds: freezeArray(['PV-BF11-P196-SENSE-BLIND', 'PV-BF11-P196-SENSE-DIM', 'PV-BF11-P196-SENSE-HEARING', 'PV-BF11-P196-SENSE-NONE']),
    policyId: 'p196-197-sensory-signs-v1',
    questionScopeHebrew: 'סימני ראייה ושמיעה מסורתיים לפי עמ׳ 196–197',
    decisiveRuleHebrew: 'H1=נשוא ראש (1222) חוזר בבית 8 => סימן לעיוורון; חוזר בבית 6 => סימן לחשכת הראייה. צורת שבתאי/צדק (2221,1221,2111,1222) בבית 6 או 8 => סימן לכובד שמיעה. הסימנים מדווחים בנפרד ואינם ממוזגים.',
    oneWayBranches: freezeArray([
      'H1=1222 וחוזר בבית 8 => סימן לעיוורון',
      'H1=1222 וחוזר בבית 6 => סימן לחשכת הראייה',
      'צורת שבתאי/צדק בבית 6 או 8 => סימן לכובד שמיעה',
    ]),
    forbiddenInversions: freezeArray([
      'היעדר הסימנים אינו שולל בעיה חושית שלא נמסרה במקור.',
      'אין להפוך סימן מסורתי לאבחנה רפואית.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'illness.p196.outcomeH15 — החלמה/התארכות לפי H15 הוא דין נפרד.',
      'illness.p196.h1RecurrenceDurationRisk — משך/סיכון המחלה הוא דין נפרד.',
      'illness.p197.h1h8ElementHumor — סיווג האח\'לאט הוא דין נפרד.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'זהו אבחון רפואי של עיוורון או חרשות',
      'תחליף לבדיקה רפואית',
    ]),
  });
}

function p192MaternalSafetyPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-11',
    goldenCaseIds: freezeArray(['PV-BF11-P192-SAFE', 'PV-BF11-P192-NOT-ALL-BENEFIC']),
    policyId: 'p192-maternal-safety-h6h8h12-v1',
    questionScopeHebrew: 'בטיחות היולדת לפי בתים 6, 8 ו-12, עמ׳ 192',
    decisiveRuleHebrew: 'בתים 6, 8 ו-12 כולם מיטיבים => היולדת ניצלת/בטוחה. התנאי החיובי בלבד נמסר; אין דין הפוך.',
    oneWayBranches: freezeArray([
      'בתים 6, 8 ו-12 כולם מיטיבים => היולדת ניצלת',
    ]),
    forbiddenInversions: freezeArray([
      'אי-התקיימות התנאי המלא אינה פסק שהיולדת בסכנה.',
      'זהו סימן מסורתי, לא קביעה רפואית.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'pregnancy.p191.childSafetyH1H6H8 — בטיחות העובר היא דין נפרד.',
      'pregnancy.p191-192.miscarriageRedH7NakisH8 — סיכון הפלה הוא דין נפרד.',
      'pregnancy.p191.genderH5 — מין הוולד הוא דין נפרד.',
      'pregnancy.p191.deliveryDifficultyH1H5H15 — קלות הלידה היא דין נפרד.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'קביעה רפואית על מצב היולדת',
      'פסק סכנת חיים כאשר התנאי החיובי לא התקיים',
    ]),
  });
}

function p194ChildWellbeingPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-11',
    goldenCaseIds: freezeArray(['PV-BF11-P194-WELL-GOOD', 'PV-BF11-P194-WELL-POOR', 'PV-BF11-P194-WELL-MEDIUM', 'PV-BF11-P194-WELL-MIXED']),
    policyId: 'p194-child-wellbeing-h5h16-v1',
    questionScopeHebrew: 'מזל ומצב הילד לפי בתים 5 ו-16, עמ׳ 194',
    decisiveRuleHebrew: 'H5+H16 שניהם מיטיבים => מזל טוב, שיפור מצב וריבוי ממון. שניהם מזיקים => מצב ירוד. אחד מכל סוג => מצב בינוני. צורה ממוזגת אינה מקודמת לאחד הענפים.',
    oneWayBranches: freezeArray([
      'H5+H16 שניהם מיטיבים => מזל טוב, שיפור מצב וריבוי ממון',
      'H5+H16 שניהם מזיקים => מצב ירוד',
      'אחד מיטיב ואחד מזיק => מצב בינוני',
    ]),
    forbiddenInversions: freezeArray([
      'צורה ממוזגת בבית 5 או 16 אינה מקודמת לפי נטייתה לאחד משלושת הענפים.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'child.p194.healthTrajectoryH6H8 — בריאות הילד היא דין נפרד.',
      'illness.p196.outcomeH15 — החלמה ממחלה נוכחית היא דין נפרד.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'אבחנה כלכלית מדויקת או סכום ממון',
    ]),
  });
}

function p212DisputeH2H8Policy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-12',
    goldenCaseIds: freezeArray(['PV-BF12-P212-H2H8-PETITIONER', 'PV-BF12-P212-H2H8-RESPONDENT', 'PV-BF12-P212-H2H8-CONFLICT', 'PV-BF12-P212-H2H8-NONE']),
    policyId: 'p212-dispute-winner-h2h8-v1',
    questionScopeHebrew: 'סימן המנצח בסכסוך לפי בתים 2 ו-8, עמ׳ 212 — נפרד מסימן בית 1',
    decisiveRuleHebrew: 'בית 2 מיטיב => סימן שהמבקש זוכה במבוקש. בית 8 מיטיב => סימן שהמבוקש גובר. שני הסימנים עצמאיים ועלולים להתנגש; כשמתנגשים, אין הכרעה בין השניים. מזיק אינו נותן דין הפוך.',
    oneWayBranches: freezeArray([
      'בית 2 מיטיב => סימן שהמבקש זוכה במבוקש',
      'בית 8 מיטיב => סימן שהמבוקש גובר על המבקש',
    ]),
    forbiddenInversions: freezeArray([
      'בית 2 או 8 מזיק אינו נותן דין הפוך.',
      'התנגשות בין שני הסימנים אינה מוכרעת מן הדעת לטובת אחד מהם.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'dispute.p212.winnerH1 — סימן בית 1 הוא דין נפרד ועצמאי.',
      'dispute.p213.winnerStrengthUnresolved — השוואת החוזק אינה סגורה ואינה מצטרפת.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'הכרעה סופית וחד-משמעית בין המבקש למבוקש כשהסימנים מתנגשים',
    ]),
  });
}

function p168NeedMovePolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-12',
    goldenCaseIds: freezeArray(['PV-BF12-P168-MOVE-ALLGOOD', 'PV-BF12-P168-MOVE-ALLBAD', 'PV-BF12-P168-MOVE-MAJORITY', 'PV-BF12-P168-MOVE-TIE']),
    policyId: 'p168-need-move-h5h9h14-v1',
    questionScopeHebrew: 'האם לנוע כדי להשיג צורך, לפי בתים 5, 9 ו-14, עמ׳ 168',
    decisiveRuleHebrew: 'שלושת הבתים מיטיבים => נכון לנוע. שלושתם מזיקים => אין זה נכון. עדות מעורבת => הכרעה לפי הרוב בין הבתים המיטיבים/מזיקים הטהורים בלבד; בית ממוזג אינו נמנה, ואם זה משאיר שוויון — אין הכרעה.',
    oneWayBranches: freezeArray([
      'H5+H9+H14 כולם מיטיבים => נכון לנוע',
      'H5+H9+H14 כולם מזיקים => אין זה נכון לנוע',
      'עדות מעורבת עם רוב ברור => הכרעה לפי הרוב',
    ]),
    forbiddenInversions: freezeArray([
      'אין להמציא שובר-שוויון כאשר הרוב שווה.',
      'בית שצורתו ממוזגת אינו נמנה בהכרעת הרוב.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'need.p169.fulfillmentH1Fortune — האם הצורך עצמו ייפתר הוא דין נפרד (בית 1, עמ׳ 169).',
      'hope.p267.fulfillment — דין נפרד (בית 11).',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'הבטחה שהצורך עצמו יושג כתוצאה מן הנסיעה',
    ]),
  });
}

function p168RequestEasePolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-12',
    goldenCaseIds: freezeArray(['PV-BF12-P168-EASE-EASY', 'PV-BF12-P168-EASE-HARD', 'PV-BF12-P168-EASE-NONE']),
    policyId: 'p168-request-answered-ease-h5h7-v1',
    questionScopeHebrew: 'קלות מענה הבקשה לפי בתים 5 ו-7, עמ׳ 168',
    decisiveRuleHebrew: 'שני הבתים מיטיבים => הבקשה תיענה בנחת. שניהם מזיקים => הבקשה תיענה אך רק בקושי. שני הענפים מורים שהבקשה תיענה; אין כאן ענף של אי-מענה. כל צירוף אחר אינו מוכרע.',
    oneWayBranches: freezeArray([
      'H5+H7 שניהם מיטיבים => הבקשה תיענה בנחת',
      'H5+H7 שניהם מזיקים => הבקשה תיענה בקושי',
    ]),
    forbiddenInversions: freezeArray([
      'אין להפוך צירוף שאינו שני הענפים הטהורים לפסק "לא תיענה".',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'need.p169.fulfillmentH1Fortune — דין נפרד (בית 1, עמ׳ 169).',
      'hope.p267.fulfillment — דין נפרד (בית 11).',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'קביעה שהבקשה לא תיענה בכלל',
    ]),
  });
}

function p169MatterValidityPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-13',
    goldenCaseIds: freezeArray(['PV-BF13-P169-VALID-VENUS', 'PV-BF13-P169-VALID-MOON', 'PV-BF13-P169-VALID-MERCURY', 'PV-BF13-P169-NOT-VALID']),
    policyId: 'p169-matter-validity-h6h8-planet-v1',
    questionScopeHebrew: 'התאמת העניין לשואל לפי צורת H6+H8 ושיוכי כוכב, עמ׳ 169',
    decisiveRuleHebrew: 'הצורה הנולדת מ-H6+H8: אם היא מצורות נוגה, הירח או כוכב (עטארד) — הדבר נכון עבור השואל. כל צורה אחרת — אינו נכון. זהו דין בינארי מלא על כל 16 הצורות, לא ענף חלקי.',
    oneWayBranches: freezeArray([
      'H6+H8 נולדת צורת נוגה/ירח/כוכב (6 מ-16) => העניין נכון עבור השואל',
      'H6+H8 נולדת כל צורה אחרת (10 מ-16) => העניין אינו נכון עבור השואל',
    ]),
    forbiddenInversions: freezeArray([
      'אין ענף שלישי/לא-מוכרע כאן — כל 16 הצורות מכוסות; אין להמציא ענף "ממוזג" שאינו קיים.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'completion.p173.fireRows15910 (q-success) — האם העניין יצליח הוא דין נפרד מהתאמה/נכונות.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'קביעה שהעניין יצליח או יושלם',
    ]),
  });
}

function p205ModestyPurityPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-13',
    goldenCaseIds: freezeArray(['PV-BF13-P205-NO-NAME', 'PV-BF13-P205-PURE', 'PV-BF13-P205-IMPURE', 'PV-BF13-P205-MIXED', 'PV-BF13-P205-NO-CLAUSE']),
    policyId: 'p205-modesty-purity-v1',
    questionScopeHebrew: 'סימן צניעות/טהרה לפי בתים 1, 7, 9 והמאזן, עמ׳ 205–206, בכפוף להטלה מאומתת על שם המועמדת',
    decisiveRuleHebrew: 'ללא שם מועמדת + אישור הטלה-על-שם מפורש — אין סימן כלל. כשמאומת: כל "وقيل" (שיטה חלופית) מדווח כסימן עצמאי משלו (טהרת H1, התאמת H1/H7, הרכבת H7+H9, התאמת H1/המאזן והפכה, אזהרת H1-טהור+H9-מזיק, הרגעת H1-מזיק+H9/מאזן-טהורים) — אין סדר עדיפות מומצא בין הסימנים. אם כל הסימנים שחלים חיוביים — פסק חיובי; אם כולם שליליים — פסק שלילי; אחרת — ממוזג.',
    oneWayBranches: freezeArray([
      'אין שם מועמדת ואין אישור הטלה-על-שם => אין סימן; אין להמיר שם לצורה אוטומטית',
      'H1=H15 וטהורים => טהורה כליל, אין ספק',
      'H1 טהור => סימן צניעות',
      'H1+H7 טהורים => סימן צניעות (שיטה חלופית)',
      'הרכבת H7+H9 מיטיבה => יראת שמים/תקיה; מזיקה => אזהרת פריצות (שיטה חלופית)',
      'H1=H15 ומזיק => סימן פריצות (ההפך המפורש)',
      'H1 מיטיב+טהור ו-H9 מזיק => חשש לעתיד',
      'H1 מזיק אך H9+המאזן טהורים => אין חשש מרכילה',
    ]),
    forbiddenInversions: freezeArray([
      'אין להמציא סדר עדיפות בין הסעיפים ה"وقيل" השונים שאינו כתוב במקור.',
      'אין להפיק סימן כלשהו לפני אישור הטלה-על-שם מפורש.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'marriage.p208.womanQualityH5H4 — דין נפרד (בתים 5/15/4).',
      'marriage.p207-208.adulterySignsUnresolved — טבלת "בית התזווג" הנפרדת אינה סגורה ואינה מצטרפת.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'קביעה עובדתית או מוסרית על התנהגות עבר של המועמדת',
      'ודאות המרה אוטומטית של שם לצורה',
    ]),
  });
}

function p208WomanQualityPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-13',
    goldenCaseIds: freezeArray(['PV-BF13-P208-GOOD', 'PV-BF13-P208-POOR-OUTCOME', 'PV-BF13-P208-NO-NAME', 'PV-BF13-P208-NONE']),
    policyId: 'p208-woman-quality-h5h4-v1',
    policyScopeHebrew: 'איכות האישה לפי בית 5 מול בתים 15/4, עמ׳ 207–208, בכפוף להטלה מאומתת על שם',
    questionScopeHebrew: 'איכות האישה לפי בית 5 מול בתים 15/4, עמ׳ 207–208, בכפוף להטלה מאומתת על שם',
    decisiveRuleHebrew: 'ללא שם מועמדת מאומת — אין סימן. H5 בכבוד נכנס/כבוד יוצא/סוהר => האישה טובה ויציבה (פסק חיובי). המאזן (H15) או H4 בממון יוצא/דרך/חיבור => אחריתה אינה טובה — מדווח כסימן, אך אינו הופך positive:false (זהירות מכוונת, כמו תקדימי האסיר). שני הסימנים עצמאיים וללא יחס היפוך הדדי.',
    oneWayBranches: freezeArray([
      'H5 בכבוד נכנס/כבוד יוצא/סוהר => האישה טובה ויציבה',
      'H15 או H4 בממון יוצא/דרך/חיבור => אחריתה אינה טובה (סימן בלבד, positive נשאר null)',
    ]),
    forbiddenInversions: freezeArray([
      'סימן האחרית-הרעה אינו מקודם לפסק שלילי ("positive:false") — נשאר אזהרה בלבד, לפי המדיניות השמורנית בכוונה.',
      'אין להפיק סימן לפני אישור הטלה-על-שם מפורש.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'marriage.p205.modestyPurity — דין נפרד (בתים 1/7/9/מאזן).',
      'marriage.p207-208.adulterySignsUnresolved — טבלת "בית התזווג" הנפרדת אינה סגורה ואינה מצטרפת.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'קביעה עובדתית או מוסרית על האישה',
      'הפיכת סימן האחרית-הרעה לפסק שלילי חד-משמעי',
    ]),
  });
}

function p170MutualGazePolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-13',
    goldenCaseIds: freezeArray(['PV-BF13-P170-MUTUAL', 'PV-BF13-P170-OTHER-PARTY', 'PV-BF13-P170-NONE']),
    policyId: 'p170-mutual-gaze-fire-rows-v1',
    questionScopeHebrew: 'מבט הדדי בין שני אנשים לפי שורות אש בתים 1, 7 ו-13, עמ׳ 170',
    decisiveRuleHebrew: 'שורת אש H1 פתוחה, H7 פתוחה, H13 סתומה => מבט הדדי. שורת אש H13 פתוחה, H1 סתומה, H7 פתוחה => האדם הנשאל מביט באחר, לא בשואל. כל צירוף אחר אינו מוכרע; "ועל זה פי קיש" (היקש) אינו מורחב לצירופים נוספים.',
    oneWayBranches: freezeArray([
      'אש H1 פתוחה + אש H7 פתוחה + אש H13 סתומה => מבט הדדי',
      'אש H13 פתוחה + אש H1 סתומה + אש H7 פתוחה => האדם מביט באחר',
    ]),
    forbiddenInversions: freezeArray([
      'אין להרחיב את "היקש" המקורי לצירופי שורות-אש נוספים שלא נמסרו במפורש.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'love.p204.attentionFireRows1713 — דין נפרד (H1/H7/H13 בניסוח אחר, לא ממוזג).',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'אבחון רומנטי או רגשי מעבר למבט המדווח במקור',
    ]),
  });
}

function p239TravelProfitWitnessPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-13',
    goldenCaseIds: freezeArray(['PV-BF13-P239-PROFIT', 'PV-BF13-P239-LOSS', 'PV-BF13-P239-DISAGREE', 'PV-BF13-P239-NONE']),
    policyId: 'p239-travel-profit-h7-witness-v1',
    questionScopeHebrew: 'רווח במסע לפי בית 7 ועדי הבית (9, 5), עמ׳ 239',
    decisiveRuleHebrew: 'H7 מיטיב וגם H9 וגם H5 מיטיבים (ללא מחלוקת) => ירוויח במסחרו וישוב בשלום. H7 מזיק => המסחר מפסיד (ללא תנאי בעדים). כאשר H9 ו-H5 חלוקים — אין דין "מאל אליה" מחושב (אופרטור לא מוגדר במקור); הענף נשאר "מחלוקת-עדים-לא-מוכרעת".',
    oneWayBranches: freezeArray([
      'H7 מיטיב + H9 מיטיב + H5 מיטיב (ללא מחלוקת) => רווח ושיבה בשלום',
      'H7 מזיק => המסחר מפסיד',
    ]),
    forbiddenInversions: freezeArray([
      'כאשר H9/H5 חלוקים — אין להמציא אופרטור "מאל אליה"; הענף נשאר לא-מוכרע.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'travel.p239.profitEarthRowH2 — חסום במקור (מנטקה לא מוגדרת); אינו מצטרף.',
      'money.p182.lawfulnessInclination — אותו אופרטור "נוטה אל" לא מוגדר, דין נפרד.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'הכרעה כשהעדים חלוקים',
    ]),
  });
}

function p249InCityH1H4Policy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-13',
    goldenCaseIds: freezeArray(['PV-BF13-P249-INCITY', 'PV-BF13-P249-RETURNED-OUT']),
    policyId: 'p249-in-city-h1h4-v1',
    questionScopeHebrew: 'האם הנעדר בעיר, לפי הרכבת בתים 1 ו-4, עמ׳ 249–250',
    decisiveRuleHebrew: 'הרכבת H1+H4 פנימית (דאכיל) => סימן שהוא בעיר/חזר. חיצונית (כ׳ארג׳) => ההפך המפורש במקור ("دخول أو ضده").',
    oneWayBranches: freezeArray([
      'H1+H4 נולדת פנימית => בעיר/חזר',
      'H1+H4 נולדת חיצונית => ההפך (אינו בעיר)',
    ]),
    forbiddenInversions: freezeArray([
      'אין ענף שלישי כאן — שני הענפים (פנימי/חיצוני) מכוסים ישירות מהמקור, לא מומצאים.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'missing.p249.returnTimingTariqH10H11 — תזמון מפגש הוא דין נפרד.',
      'missing.p249.arrivalSignH3H15 — תיאורי בלבד, אינו מצטרף.',
      'missing.p248-249.lifeH1H4H9Outcome — חי/מת הוא דין נפרד.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'תאריך או זמן חזרה',
    ]),
  });
}

function p249ReturnTimingPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-13',
    goldenCaseIds: freezeArray(['PV-BF13-P249-SAMEDAY', 'PV-BF13-P249-WITHINHOUR', 'PV-BF13-P249-NONE']),
    policyId: 'p249-return-timing-tariq-h10h11-v1',
    questionScopeHebrew: 'תזמון מפגש/התאחדות עם הנעדר, לפי בתים 10 ו-11, עמ׳ 249',
    decisiveRuleHebrew: 'H10=H11=דרך(1111) => התאחדות באותו יום. H10=דרך(1111), H11=חיבור(2112) => התאחדות בתוך השעה (מנוסה, מצוין במקור). כל צירוף אחר אינו מוכרע. זהו דין מפגש/התאחדות, לא דין חזרה עצמה.',
    oneWayBranches: freezeArray([
      'H10=H11=דרך(1111) => התאחדות באותו יום',
      'H10=דרך(1111) וH11=חיבור(2112) => התאחדות בתוך השעה',
    ]),
    forbiddenInversions: freezeArray([
      'כל צירוף אחר אינו הופך לדין שלילי של "לא יחזור" — נשאר ללא הכרעה.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'missing.p249.returnAnglesJudge — דין חזרה כללי נפרד.',
      'missing.p249.inCitySignH1H4 — דין נפרד (האם בעיר).',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'הבטחת שיבה/חזרה בפועל',
    ]),
  });
}

function p249ArrivalSignPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-13',
    goldenCaseIds: freezeArray(['PV-BF13-P249-ARRIVAL-OBS']),
    policyId: 'p249-arrival-sign-h3h15-descriptive-v1',
    questionScopeHebrew: 'תצפית תיאורית בלבד על מצב דאכיל/כ׳ארג׳ של בתים 3 ו-15 בעניין הגעת נעדר, עמ׳ 249',
    decisiveRuleHebrew: 'שיטה תיאורית בלבד: מדווחים סיווגי דאכיל/כ׳ארג׳ של H3 ו-H15 בנפרד. positive הוא null לעולם — לא הוכח כלל-שילוב (AND או אחר) סגור מהמקור. אין להפיק פסק בינארי מכלל זה.',
    oneWayBranches: freezeArray([
      'H3 ו-H15 מדווחים כתצפיות עצמאיות — ללא פסק מכריע',
    ]),
    forbiddenInversions: freezeArray([
      'אין להמציא כלל-שילוב (AND/OR) בין H3 ל-H15 שאינו מוכח מהמקור.',
      'positive חייב להישאר null בכל מקרה; זוהי שיטה תיאורית, לא פסק.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'missing.p249.returnAnglesJudge', 'missing.p249.returnTimingTariqH10H11', 'missing.p248-249.lifeH1H4H9Outcome',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'כל פסק כן/לא על הגעת הנעדר מכלל זה',
    ]),
  });
}

function p212PartnershipCompatPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-13',
    goldenCaseIds: freezeArray(['PV-BF13-P212-COMPAT-GOOD', 'PV-BF13-P212-COMPAT-BAD', 'PV-BF13-P212-COMPAT-DISAGREE']),
    policyId: 'p212-partnership-compatibility-h1h7-h5h7-v1',
    questionScopeHebrew: 'התאמת שותפות לפי הצורות הנולדות מ-H1+H7 ומ-H5+H7, עמ׳ 212',
    decisiveRuleHebrew: 'כל אחת מהצורות הנולדות (H1+H7, H5+H7) נבדקת בנפרד: מיטיבה => דון לטוב; מזיקה => דון להפך. כששתי הצורות מסכימות — פסק אחיד. כשהן חלוקות — המקור אינו נותן שובר-שוויון; שתי העדויות מדווחות בלי פסק כפוי אחד.',
    oneWayBranches: freezeArray([
      'שתי הצורות הנולדות (H1+H7, H5+H7) מיטיבות => השותפות טובה',
      'שתי הצורות הנולדות מזיקות => השותפות רעה',
    ]),
    forbiddenInversions: freezeArray([
      'כשהצורות חלוקות — אין להמציא שובר-שוויון; שתי העדויות מדווחות כפי שהן.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'partnership.p212.operationUnresolved — חסום (הג\'ומלה הגולמית לא זמינה במודל הנתונים); אינו מצטרף.',
      'dispute.p212.reconciliationH1H7 — שאלה נפרדת (פיוס בסכסוך, לא התאמת שותפות).',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'הכרעה בין שני הסימנים כשהם חלוקים',
    ]),
  });
}

function p169NeedFulfillmentPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-13',
    goldenCaseIds: freezeArray(['PV-BF13-P169-NEED-FULFILLED', 'PV-BF13-P169-NEED-DELAYED', 'PV-BF13-P169-NEED-NOTFULFILLED']),
    policyId: 'p169-need-fulfillment-h1-fortune-v1',
    questionScopeHebrew: 'האם הצורך ייפתר, לפי מזל בית 1 ("בית הצורך"), עמ׳ 169',
    decisiveRuleHebrew: 'בית 1 מיטיב => הצורך ייפתר. בית 1 ממוזג => עיכוב/איטיות (ענף מפורש, לא שקט). בית 1 מזיק => הצורך לא ייפתר. דין סגור על כל שלושת מצבי המזל.',
    oneWayBranches: freezeArray([
      'בית 1 מיטיב => הצורך ייפתר',
      'בית 1 ממוזג => עיכוב/איטיות',
      'בית 1 מזיק => הצורך לא ייפתר',
    ]),
    forbiddenInversions: freezeArray([
      'אין ענף רביעי — שלושת מצבי המזל מכוסים ישירות מהמקור.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'hope.p267.fulfillment — דין נפרד (בית 11, עמ׳ 267).',
      'need.p168.moveToObtainH5H9H14 — דין נפרד (נסיעה להשגת הצורך, לא פתרון הצורך עצמו).',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'מועד פתרון הצורך',
    ]),
  });
}

function p272PrisonerOutcomePolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-13',
    goldenCaseIds: freezeArray(['PV-BF13-P272-OUTCOME-GOOD', 'PV-BF13-P272-OUTCOME-BAD']),
    policyId: 'p272-prisoner-outcome-h1h4-v1',
    questionScopeHebrew: 'אחרית/גורל האסיר לפי הצורה הנולדת מ-H1+H4, עמ׳ 272',
    decisiveRuleHebrew: 'הצורה הנולדת מ-H1+H4 מזיקה => אחרית האסיר לרע. מיטיבה => אחריתו לטוב. דין בינארי שלם; אין ענף מפורש לממוזג.',
    oneWayBranches: freezeArray([
      'H1+H4 נולדת מיטיבה => אחרית לטוב',
      'H1+H4 נולדת מזיקה => אחרית לרע',
    ]),
    forbiddenInversions: freezeArray([
      'צורה ממוזגת אינה מקודמת לאחד הענפים — נשארת ללא הכרעה.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'prisoner.p272-273.rapidExitH11WithH5Caution — מהירות יציאה, דין נפרד.',
      'prisoner.p272.exitSafetyH12 — בטיחות יציאה, דין נפרד.',
      'prisoner.releaseTiming.unresolved — תזמון (לא נמסר כאן).',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'תאריך שחרור',
    ]),
  });
}

function p272PrisonerExitSafetyPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-13',
    goldenCaseIds: freezeArray(['PV-BF13-P272-EXITSAFE', 'PV-BF13-P272-EXITSAFE-NONE']),
    policyId: 'p272-prisoner-exit-safety-h12-v1',
    questionScopeHebrew: 'בטיחות יציאת האסיר לפי בית 12, עמ׳ 272',
    decisiveRuleHebrew: 'בית 12 מיטיב => יציאתו בשלום. המקור אינו נותן הפך מפורש למזיק/ממוזג; שניהם נשארים ללא הכרעה (לא פסק "יציאה מסוכנת").',
    oneWayBranches: freezeArray([
      'בית 12 מיטיב => יציאה בשלום',
    ]),
    forbiddenInversions: freezeArray([
      'בית 12 מזיק או ממוזג אינו הופך לפסק "יציאה מסוכנת" — נשאר ללא הכרעה.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'prisoner.p272.outcomeH1H4 — אחרית האסיר, דין נפרד (בתים אחרים).',
      'prisoner.p272-273.rapidExitH11WithH5Caution — מהירות יציאה, דין נפרד.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'פסק סכנה כשהתנאי החיובי לא מתקיים',
    ]),
  });
}

function p272PrisonerReleaseMannerPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-13',
    goldenCaseIds: freezeArray(['PV-BF13-P272-MANNER-FORCED', 'PV-BF13-P272-MANNER-CHOICE', 'PV-BF13-P272-MANNER-CONFLICT']),
    policyId: 'p272-prisoner-release-manner-v1',
    questionScopeHebrew: 'אופן השחרור (בכפייה/ברצון) לפי בתים 2, 3, 5, 9, 10, עמ׳ 272',
    decisiveRuleHebrew: 'מזיק באחד מבתים 2/3/5/9/10 => האסיר יוצא שלא ברצון שלטון העיר. מיטיב באחד מהם => יוצא ברצונו. המקור אינו קובע סדר-עדיפות בין חמשת הבתים; סימנים סותרים מדווחים יחד בלי פסק כפוי. אין כאן שיפוט ערכי (לא "טוב"/"רע") — רק תיאור אופן היציאה.',
    oneWayBranches: freezeArray([
      'מזיק באחד מהבתים 2/3/5/9/10 => יציאה ללא רצון השלטון',
      'מיטיב באחד מהם => יציאה ברצון',
    ]),
    forbiddenInversions: freezeArray([
      'אין סדר-עדיפות מומצא בין חמשת הבתים כשחלקם מיטיבים וחלקם מזיקים.',
      'אין שיפוט ערכי — אופן היציאה אינו "טוב" או "רע" מבחינת האסיר.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'prisoner.p272.outcomeH1H4 — אחרית האסיר, דין נפרד.',
      'prisoner.releaseTiming.unresolved — תזמון (לא נמסר כאן).',
      'prisoner.p272.forcedEscapeRepeatedBenefic — חסום (וריאנט כתב-יד לא פתור); אינו מצטרף.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'שיפוט ערכי על אופן השחרור',
      'תאריך שחרור',
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

function p211DissolutionPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-12',
    goldenCaseIds: freezeArray([
      'PV-BF12-P211-INTERNAL-BENEFIC',
      'PV-BF12-P211-INTERNAL-MALEFIC',
      'PV-BF12-P211-EXTERNAL-BENEFIC',
      'PV-BF12-P211-EXTERNAL-MALEFIC',
      'PV-BF12-P211-FIXED-BENEFIC',
      'PV-BF12-P211-FIXED-MALEFIC',
      'PV-BF12-P211-MUTABLE-BENEFIC',
      'PV-BF12-P211-MUTABLE-MALEFIC',
      'PV-BF12-P211-EXACT-DRAFT',
    ]),
    policyId: 'p211-marriage-h7-complete-state-matrix-v1',
    questionScopeHebrew: 'יציבות/פירוק הנישואין לפי מטריצת H7 המלאה בעמ׳ 211 בלבד',
    decisiveRuleHebrew: 'H7 נקרא לפי שני צירים יחד: פנימי/חיצוני/קבוע/מתהפך ומיטיב/מזיק. המקור נותן ענפים מפורשים לכל ארבעת המצבים. בענפי קבוע ומתַהפך בלבד, צורות ממוזגות משתמשות בנטיית המיטיב/מזיק הרשומה בקטלוג כדי לממש את זוג הענפים سعد/نحس של עמ׳ 211.',
    oneWayBranches: freezeArray([
      'פנימי מיטיב => יישוב הדעת וקיום מצב הנישואין',
      'פנימי מזיק => עגמת נפש ומריבה, אך המצב קבוע',
      'חיצוני מיטיב => נישואין טובים, אך פרידה אפשרית משום שהחלק אינו קבוע',
      'חיצוני מזיק => אין נישואין ראויים; ואם כבר היו, החלק נחתך ונפסק',
      'קבוע מיטיב => תיקון בית המשכב',
      'קבוע מזיק => אין תיקון לבית המשכב; רוע בין בני הזוג ומקורו מן האיש',
      'מתהפך מיטיב => יישוב, שמחה וששון בבית המשכב, אהבה, עושר ועונג',
      'מתהפך מזיק => אין נישואין; הדבר הולך לרעה ולפירוד; המקור מוסר שהעזיבה עדיפה',
    ]),
    forbiddenInversions: freezeArray([
      'חיצוני מיטיב אומר שפרידה אפשרית, לא שפרידה ודאית.',
      'אסור לצמצם את p211 למיטיב/מזיק בלבד ולהתעלם ממצב פנימי/חיצוני/קבוע/מתהפך.',
      'השימוש ב-mixedTendency בענפי קבוע/מתהפך הוא חריג מקומי ל-p211 בלבד; אסור לקדם צורה ממוזגת בשיטות אחרות.',
      'לשון המקור שהעזיבה עדיפה בענף מתהפך-מזיק אינה היתר להוסיף עצת קשר עצמאית מעבר לטקסט המקור.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'marriage.p210.generalMarriageH1H2H7H8H10Judge — דין הנישואין הכללי הוא שיטה נפרדת.',
      'marriage.p204.previousStatusH7inH10 — מעמד קודם הוא שיטה נפרדת.',
      'marriage.p204.dowryH8 — מוהר הוא שיטה נפרדת.',
      'love.p206.womanFavorH7H11ThenH5 ו-desire.p206.querentWantsH7H11ThenH5 — רצון/מציאת חן הם שיטות נפרדות.',
      'H15/H16 ומשמעות כללית של צורות/בתים מחוץ למטריצת H7 של p211.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'ודאי תהיה פרידה',
      'ודאי יהיה גירושין',
      'המקור מוכיח בגידה',
      'האיש אשם בכל בעיות הנישואין',
      'אני ממליץ לעזוב את הקשר',
    ]),
  });
}

function p254ProfessionPolicy() {
  return Object.freeze({
    certificationStatus: 'certified',
    certificationBatch: 'professional-backfill-11',
    goldenCaseIds: freezeArray(['PV-BF11-P254-VENUS', 'PV-BF11-P254-SATURN', 'PV-BF11-P254-HEAD-TAIL', 'PV-BF11-P254-MIXED-EASE', 'PV-BF11-P254-EXACT-DRAFT']),
    policyId: 'p254-profession-h9-attribution-pure-saad-ease-v1',
    questionScopeHebrew: 'סוג המלאכה לפי ייחוס הצורה ב-H9; H10/H11 הם רק סייג נפרד של קלות המלאכה',
    decisiveRuleHebrew: 'סוג המלאכה נקבע לפי ייחוס H9 בטבלת עמ׳ 133–134 והפירוש בעמ׳ 254. רק אם H10 וגם H11 מיטיבים טהורים נאמר שמלאכתו מעטה בטרחה ומוצא בה מנוחה.',
    oneWayBranches: freezeArray([
      'H9 משויך לשמש/נוגה/עֻטַארִד/ירח/שבתאי/צדק/מאדים/ראש/זנב => החזרת המלאכה המפורשת של אותו ייחוס בעמ׳ 254',
      'H10+H11 שניהם pure saad => מלאכתו מעטה בטרחה והוא מוצא בה מנוחה',
    ]),
    forbiddenInversions: freezeArray([
      'כישלון תנאי H10/H11 אינו מוכיח שהמלאכה קשה או מרובת טרחה.',
      'צורה ממוזגת ב-H10 או H11 אינה מקודמת למיטיב טהור.',
      'אין לאחד ראש וזנב התלי לענף מעורפל אחד; לכל אחד דין שונה בעמ׳ 254.',
    ]),
    excludedFromPrimaryVerdict: freezeArray([
      'H10/H11 אינם קובעים את סוג המקצוע.',
      'משמעות כללית של H9 או של הצורה מחוץ לטבלת הייחוס והפירוש של p254.',
      'שיטות משרה, כבוד, חזרה לתפקיד או המלצת קריירה מודרנית.',
    ]),
    forbiddenClientClaimsWithoutExplicitSelectedMethodBranch: freezeArray([
      'זה המקצוע שהכי מתאים לך בחיים',
      'יהיה לך קשה במקצוע משום שתנאי H10/H11 לא התקיים',
      'ראש התלי וזנב התלי נותנים אותה תוצאה',
      'המקור מוכיח הצלחה כלכלית במקצוע',
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
  [P191_192_MISCARRIAGE_METHOD]: p191192MiscarriagePolicy(),
  [P196_ILLNESS_RECOVERY_METHOD]: p196IllnessRecoveryPolicy(),
  [P188_HIDDEN_STILL_THERE_METHOD]: p188HiddenStillTherePolicy(),
  [P188_QUARTER_DIRECTION_METHOD]: p188QuarterDirectionPolicy(),
  [P224_THIEF_RELATIONSHIP_METHOD]: p224ThiefRelationshipPolicy(),
  [P224_THEFT_RECOVERY_METHOD]: p224TheftRecoveryPolicy(),
  [P271_ENEMY_METHOD]: p271EnemyPolicy(),
  [P197_ILLNESS_HUMOR_METHOD]: p197IllnessHumorPolicy(),
  [P263_FRIENDSHIP_METHOD]: p263FriendshipPolicy(),
  [P265_STATE_CONTINUITY_METHOD]: p265StateContinuityPolicy(),
  [P257_MOTHER_METHOD]: p257MotherNightPolicy(),
  [P267_HOPE_METHOD]: p267HopeHouse11Policy(),
  [P193_GIFT_METHOD]: p193GiftQualityPolicy(),
  [P184_FATHER_MONEY_METHOD]: p184FatherMoneyPolicy(),
  [P184_LAND_OWNERSHIP_METHOD]: p184LandOwnershipPolicy(),
  [P243_244_VESSEL_METHOD]: p243244VesselPolicy(),
  [P212_DISPUTE_WINNER_METHOD]: p212DisputeWinnerPolicy(),
  [P272_273_PRISONER_METHOD]: p272273PrisonerPolicy(),
  [P249_MISSING_CITY_METHOD]: p249MissingCityPolicy(),
  [P174_HOPE_METHOD]: p174HopeThroughIntermediatesPolicy(),
  [P176_REQUEST_METHOD]: p176RequestGatePolicy(),
  [P176_PURPOSE_METHOD]: p176PersonPurposePolicy(),
  [P273_PUNISHMENT_METHOD]: p273PunishmentPolicy(),
  [P240_TRAVEL_CAUTION_METHOD]: p240TravelCautionPolicy(),
  [P254_DREAM_METHOD]: p254DreamPolicy(),
  [P236_TRAVEL_TIME_METHOD]: p236TravelTimePolicy(),
  [P172_MATTER_OUTCOME_METHOD]: p172MatterOutcomePolicy(),
  [P183_CURRENT_VS_NEW_METHOD]: p183CurrentVsNewPolicy(),
  [P256_HONOR_CONDITION_METHOD]: p256HonorConditionPolicy(),
  [P257_APPOINTMENT_METHOD]: p257AppointmentPolicy(),
  [P257_RULER_CONDITION_METHOD]: p257RulerConditionPolicy(),
  [P264_LIFESPAN_STAGES_METHOD]: p264LifespanStagesPolicy(),
  [P180_LIVELIHOOD_METHOD]: p180LivelihoodPolicy(),
  [P181_MONEY_ACQUIRE_METHOD]: p181MoneyAcquirePolicy(),
  [P182_MONEY_OUTLOOK_METHOD]: p182MoneyOutlookPolicy(),
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
  [P211_DISSOLUTION_METHOD]: p211DissolutionPolicy(),
  [P254_PROFESSION_METHOD]: p254ProfessionPolicy(),
  [P196_DURATION_RISK_METHOD]: p196DurationRiskPolicy(),
  [P196_SENSORY_SIGNS_METHOD]: p196SensorySignsPolicy(),
  [P192_MATERNAL_SAFETY_METHOD]: p192MaternalSafetyPolicy(),
  [P194_CHILD_WELLBEING_METHOD]: p194ChildWellbeingPolicy(),
  [P212_DISPUTE_H2H8_METHOD]: p212DisputeH2H8Policy(),
  [P168_NEED_MOVE_METHOD]: p168NeedMovePolicy(),
  [P168_REQUEST_EASE_METHOD]: p168RequestEasePolicy(),
  [P169_MATTER_VALIDITY_METHOD]: p169MatterValidityPolicy(),
  [P205_MODESTY_PURITY_METHOD]: p205ModestyPurityPolicy(),
  [P208_WOMAN_QUALITY_METHOD]: p208WomanQualityPolicy(),
  [P170_MUTUAL_GAZE_METHOD]: p170MutualGazePolicy(),
  [P239_TRAVEL_PROFIT_WITNESS_METHOD]: p239TravelProfitWitnessPolicy(),
  [P249_IN_CITY_H1H4_METHOD]: p249InCityH1H4Policy(),
  [P249_RETURN_TIMING_METHOD]: p249ReturnTimingPolicy(),
  [P249_ARRIVAL_SIGN_METHOD]: p249ArrivalSignPolicy(),
  [P212_PARTNERSHIP_COMPAT_METHOD]: p212PartnershipCompatPolicy(),
  [P169_NEED_FULFILLMENT_METHOD]: p169NeedFulfillmentPolicy(),
  [P272_PRISONER_OUTCOME_METHOD]: p272PrisonerOutcomePolicy(),
  [P272_PRISONER_EXIT_SAFETY_METHOD]: p272PrisonerExitSafetyPolicy(),
  [P272_PRISONER_RELEASE_MANNER_METHOD]: p272PrisonerReleaseMannerPolicy(),
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
