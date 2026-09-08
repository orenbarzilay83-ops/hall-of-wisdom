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

export const KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION = 'kashf-professional-verdict-safety-v1';

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

function p210Policy() {
  return Object.freeze({
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
  [P210_MARRIAGE_METHOD]: p210Policy(),
});

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
    binaryClientVerdictAllowed: Boolean(isSafe && (polarity === 'positive' || polarity === 'negative')),
    nonBinaryExplanationAllowed: Boolean(isSafe && polarity === 'non-binary'),
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
};
