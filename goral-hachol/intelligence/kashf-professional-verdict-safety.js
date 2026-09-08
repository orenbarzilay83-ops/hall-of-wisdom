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

export const KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION = 'kashf-professional-verdict-safety-v2';

const P174_GENERAL_METHOD = 'general.p174.h1h2h4h7h10h15';
const P182_SIBLING_SENIORITY_METHOD = 'siblings.p182.seniority';
const P244_TRAVELER_RETURN_METHOD = 'travel.p244.returnH1H2H9';
const P249_MISSING_RETURN_METHOD = 'missing.p249.returnAnglesJudge';
const P210_MARRIAGE_METHOD = 'marriage.p210.generalMarriageH1H2H7H8H10Judge';
const P211_DISSOLUTION_METHOD = 'marriage.p211.dissolutionH7StateMatrix';

function freezeArray(values = []) {
  return Object.freeze([...(Array.isArray(values) ? values : [])]);
}

function polarityFromReading(reading) {
  if (!reading || reading.valid !== true || reading.canRunKashf !== true) return 'blocked';
  if (reading.overallPositive === true) return 'positive';
  if (reading.overallPositive === false) return 'negative';
  return 'non-binary';
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

const METHOD_POLICIES = Object.freeze({
  [P174_GENERAL_METHOD]: p174Policy(),
  [P182_SIBLING_SENIORITY_METHOD]: p182Policy(),
  [P244_TRAVELER_RETURN_METHOD]: p244Policy(),
  [P249_MISSING_RETURN_METHOD]: p249Policy(),
  [P210_MARRIAGE_METHOD]: p210Policy(),
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
