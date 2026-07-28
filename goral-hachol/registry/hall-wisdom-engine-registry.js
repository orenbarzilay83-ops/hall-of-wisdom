// goral-hachol/registry/hall-wisdom-engine-registry.js
//
// Hall of Wisdom — Passive Engine Registry Snapshot.
//
// זהו Snapshot פסיבי, סטטי ודטרמיניסטי בלבד. הקובץ הזה:
//   - אינו מריץ שום מנוע.
//   - אינו מייבא שום קובץ-מנוע (אין import/require לשום קובץ תחת engine/,
//     brain/, qa/, intelligence/, raml-data/, ai/provider/, kundali/).
//   - אינו בונה Execution Plan, אינו פותר תלויות, אינו מחשב confidence,
//     אינו מאחד תוצאות, ואינו משנה שום התנהגות Runtime קיימת.
//   - כל שדה שלא אומת ישירות מול הקוד נשמר במפורש כמחרוזת 'OPEN' — לעולם
//     לא הומר לניחוש או להשלמה-לפי-שם-קובץ.
//
// מבוסס אך ורק על (לפי הוראת המשימה):
//   1. HALL_OF_WISDOM_INFERENCE_LAYERS_FULL_AUDIT.md
//   2. HALL_WISDOM_INFERENCE_ORCHESTRATOR_ARCHITECTURE.md
//   3. HALL_WISDOM_INFERENCE_ORCHESTRATOR_VALIDATION.md
//   4. HALL_WISDOM_ENGINE_REGISTRY_SPECIFICATION.md
//   5. HALL_WISDOM_SOURCE_TRACEABILITY_MATRIX.md
//   6. HALL_WISDOM_KUNDALI_SOURCE_BOUNDARY_AUDIT.md
//   7. אימות-קוד סטטי ישיר (grep על imports/exports/module.exports/window.*)
//      שבוצע כחלק מבניית ה-Snapshot הזה — ללא הרצת שום קובץ.
//
// ראה HALL_WISDOM_ENGINE_REGISTRY_IMPLEMENTATION_REPORT.md לפירוט מלא של
// שיטת-האימות, חריגות שנמצאו מול ה-Specification (כולל שני תיקוני-ספירה
// ותיקון-סגנון-מודול), והחלטות-גבול.

'use strict';

/** ערך-Sentinel אחיד לכל שדה שלא אומת. לעולם לא מומר לניחוש. */
const OPEN = 'OPEN';

/**
 * ברירת-מחדל לרשומה — כל 27 השדות מהחוזה (סעיף 3 של המשימה), כולם OPEN
 * כברירת-מחדל. כל רשומה בפועל דורסת רק את השדות שאומתו.
 */
function mk(overrides) {
  return {
    id: OPEN,
    canonicalName: OPEN,
    filePath: OPEN,
    category: OPEN,
    system: OPEN,
    runtimeRole: OPEN,
    description: OPEN,
    moduleStyle: OPEN,
    imports: OPEN,
    importedBy: OPEN,
    publicExports: OPEN,
    inputs: OPEN,
    outputs: OPEN,
    dependencies: OPEN,
    sourceDatasets: OPEN,
    provenanceBehavior: OPEN,
    warningBehavior: OPEN,
    confidenceBehavior: OPEN,
    executionBehavior: OPEN,
    executionStatus: OPEN,
    testFiles: OPEN,
    testStatus: OPEN,
    productionStatus: OPEN,
    orphanStatus: OPEN,
    knownLimitations: OPEN,
    openItems: OPEN,
    evidence: { overall: OPEN },
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// שכבת כשף (16 רכיבים) — filePath יחסי ל-goral-hachol/
// ---------------------------------------------------------------------------
const KASHF_LAYER = [
  mk({
    id: 'kashf-formula-engine',
    filePath: 'goral-hachol/engine/kashf-formula-engine.js',
    category: 'executable-inference-engine',
    system: 'kashf',
    runtimeRole: 'mandatory-core',
    moduleStyle: 'ES-module-pure',
    publicExports: ['ROW', 'getHousePattern', 'getHouseEntry', 'combineHouses', 'assembleFromRow',
      'assembleFromFireRows', 'assembleFromAllRows', 'assembleRowThenCombine', 'combineSharedHousePair',
      'assessHouseQuality', 'classifyHouse', 'classifyPattern', 'hasFigureInHouse', 'countQualityInHouses',
      'isHouseMasculine', 'getHouseElement', 'isBeneficPlanetPattern', 'getFigureHebrewName', 'getQualityHebrew', 'default'],
    confidenceBehavior: 'none',
    executionStatus: 'connected-live',
    testStatus: 'indirect-only',
    productionStatus: 'production',
    orphanStatus: 'not-orphan',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'kashf-reading-engine',
    filePath: 'goral-hachol/engine/kashf-reading-engine.js',
    category: 'facade-partial-orchestrator',
    system: 'kashf',
    runtimeRole: 'mandatory-core',
    description: 'מרכז-קריאות ל-Kashf: מפעיל תת-מנועים (dhamir, dhamirType4External, dhamirExtras, witnessTestimony, commerceSmartLayer) בבלוקי try/catch נפרדים ומאחד ל-reading{} יחיד.',
    moduleStyle: 'ES-module-pure',
    publicExports: ['HOUSE_NAMES', 'buildKashfReading', 'default'],
    provenanceBehavior: 'אין שדה provenance מאוחד (return-object נקרא במלואו, מאומת)',
    warningBehavior: 'אין שדה warnings',
    confidenceBehavior: 'סכמה-א׳ (dhamir.agreementCount/winner — פנימי בלבד, לא ברמת-reading כולו)',
    executionStatus: 'connected-live',
    testFiles: ['13 קבצי _test_kashf_*.mjs/_test_goral_*.mjs נוגעים בו (מספר לא מאומת-מחדש בסבב זה, מועתק מה-Specification)'],
    testStatus: 'passing',
    productionStatus: 'production',
    orphanStatus: 'not-orphan',
    knownLimitations: ['category הוא facade/partial-orchestrator, לא executable-inference-engine טהור — 9 import-statements, 10 בלוקי try/catch נפרדים (VERIFIED_BY_CODE, Validation + סבב זה)'],
    evidence: {
      overall: 'VERIFIED_BY_CODE',
      category: 'VERIFIED_BY_CODE (Validation doc + Specification example, לא נבדק-מחדש שורה-שורה בסבב זה)',
      publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה: שורות 508,582,768)',
    },
  }),
  mk({
    id: 'kashf-topic-rules',
    filePath: 'goral-hachol/engine/kashf-topic-rules.js',
    category: 'dataset-knowledge-module',
    system: 'kashf',
    runtimeRole: 'mandatory-core',
    moduleStyle: 'ES-module-pure',
    publicExports: ['KASHF_TOPIC_RULES', 'getTopicRules', 'getAllTopicIds', 'getTopicHebrewName', 'default'],
    confidenceBehavior: 'none',
    executionStatus: 'connected-live',
    testStatus: 'indirect-only',
    productionStatus: 'production',
    orphanStatus: 'not-orphan',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'kashf-dhamir',
    filePath: 'goral-hachol/engine/kashf-dhamir.js',
    category: 'executable-inference-engine',
    system: 'kashf',
    runtimeRole: 'mandatory-core',
    moduleStyle: 'ES-module-pure',
    publicExports: ['computeDhamirMizan', 'computeDhamirHarkatAlArd', 'computeDhamirJawharayn',
      'computeDhamirDoubledSquare', 'computeDhamirElementPrevalence', 'computeDhamirByMajority', 'default'],
    confidenceBehavior: 'סכמה-א׳ ({candidates[], winner, agreementCount} — 0-5, סף-מהימנות לא אומת בקוד, OPEN)',
    executionStatus: 'connected-live',
    testStatus: 'indirect-only',
    productionStatus: 'partial',
    knownLimitations: ['Face3/Type4/שיטה-5 חסרים או שנויים-במחלוקת לפי KASHF_HARAKAT_ALUMQ_FOCUSED_RESEARCH.md ו-KASHF_DHAMIR_TYPE1_FACE4_GAP_MAPPING_REPORT.md (מסמכי-מחקר נפרדים, לא-קשורים ישירות לרשומה זו)'],
    orphanStatus: 'not-orphan',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'kashf-dhamir-type4-external',
    filePath: 'goral-hachol/engine/kashf-dhamir-type4-external.js',
    category: 'executable-inference-engine',
    system: 'kashf',
    runtimeRole: 'mandatory-core',
    moduleStyle: 'ES-module-pure',
    publicExports: ['TYPE4_EXTERNAL_DISCLOSURE_HEBREW', 'computeDhamirType4External'],
    sourceDatasets: ['الفلك المشحون (al-falak-al-mashhun) — מקור-חיצוני מוצהר, ראו HALL_WISDOM_SOURCE_TRACEABILITY_MATRIX.md'],
    confidenceBehavior: 'none',
    executionStatus: 'connected-live',
    testStatus: 'indirect-only',
    productionStatus: 'partial',
    orphanStatus: 'not-orphan',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'kashf-leshon-hainyan',
    filePath: 'goral-hachol/engine/kashf-leshon-hainyan.js',
    category: 'orphan-module',
    system: 'kashf',
    runtimeRole: 'disconnected',
    moduleStyle: 'ES-module-pure',
    publicExports: ['computeLeshonHainyan', 'default'],
    executionStatus: 'disconnected-orphan',
    testStatus: 'none-found',
    productionStatus: 'blocked',
    orphanStatus: 'orphan',
    confidenceBehavior: 'none',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'kashf-narrative-writer',
    filePath: 'goral-hachol/engine/kashf-narrative-writer.js',
    category: 'narrative-assembler',
    system: 'kashf',
    runtimeRole: 'mandatory-core',
    moduleStyle: 'ES-module-pure',
    publicExports: ['writeKashfReading', 'default'],
    confidenceBehavior: 'none',
    executionStatus: 'connected-live',
    testStatus: 'passing',
    productionStatus: 'production',
    orphanStatus: 'not-orphan',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'kashf-book-additions',
    filePath: 'goral-hachol/engine/kashf-book-additions.js',
    category: 'executable-inference-engine',
    system: 'kashf',
    runtimeRole: 'conditional',
    moduleStyle: 'ES-module-pure',
    publicExports: ['computeFearOfPunishment', 'computePrisonerDurationDanger', 'computeStayOrMove',
      'computeWomanModesty', 'computeJoyTimingKashf', 'computeServantMatterKashf', 'computeLifeYearsKashf',
      'computeMoneyMagnitudeKashf', 'computeGoodsProfitLossKashf', 'computeHiddenDepthKashf',
      'computeRequesterCircleStrengthKashf', 'computeWheelPositionStrengthKashf', 'computeDerekhHouseRuleKashf',
      'computeFigureDesireFulfillmentKashf', 'computeFriendTypeByHouse11Kashf'],
    confidenceBehavior: 'none',
    executionStatus: 'connected-live',
    testStatus: 'none-found',
    productionStatus: 'production',
    orphanStatus: 'not-orphan',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'kashf-pending-extraction',
    filePath: 'goral-hachol/engine/kashf-pending-extraction.js',
    category: 'executable-inference-engine',
    system: 'kashf',
    runtimeRole: 'conditional',
    moduleStyle: 'ES-module-pure',
    publicExports: ['TOPIC_HOUSE_ROLES_KASHF', 'computeSodHaDhamirim', 'computeQuerentHonestyCheck',
      'computeTimingByDhamirThirds', 'FIGURE_ELEMENTS_MAP', 'computeQuerentTemperament', 'computeQuerentSubject',
      'computeAuthorityDurationKashf', 'computeReturnToOfficeKashf', 'computeStateStabilityKashf',
      'computeSecurityKashf', 'computeLifespanKashf', 'computeClothingLuckKashf', 'computeLifespanByFigureShapes',
      'computeClothingBestFiguresKashf', 'computeWhoLooksAtWhomKashf', 'computeMoneySourceKashf',
      'computeWellDrillingKashf', 'computeTravelTimingKashf', 'computeProfessionH9Kashf'],
    dependencies: ['→ hawi-interpreter.js (12 סמלים — תלות-חוצה מתועדת, ראו HALL_WISDOM_ENGINE_REGISTRY_SPECIFICATION.md §4)',
      '→ goral-conclusion-writer.js (תלות-חוצה מתועדת)',
      '← raml-seasonal-astro-profile-engine.js (מייבא FIGURE_ELEMENTS_MAP מכאן, require())'],
    confidenceBehavior: 'none',
    executionStatus: 'connected-live',
    testStatus: 'indirect-only',
    productionStatus: 'production',
    orphanStatus: 'not-orphan',
    evidence: {
      overall: 'VERIFIED_BY_CODE',
      publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)',
      dependencies: 'VERIFIED_BY_CODE (מ-HALL_WISDOM_ENGINE_REGISTRY_SPECIFICATION.md §4, לא נבדק-מחדש שורה-שורה בסבב זה)',
    },
  }),
  mk({
    id: 'other-sources-pending-extraction',
    filePath: 'goral-hachol/engine/other-sources-pending-extraction.js',
    category: 'orphan-module',
    system: 'kashf',
    runtimeRole: 'disconnected',
    moduleStyle: 'ES-module-pure',
    publicExports: ['computeBodyPartDiagnosis', 'computeThiefGenderAge', 'computeMissingPersonLocation',
      'computeMissingPersonReturn', 'computePrisonerGuilty', 'computeDebts', 'computeIllnessTypeIsqat',
      'computeSorcererH9', 'computeHiddenTreasureH2', 'computeH3Topics', 'computeH4Secrets',
      'computeIllnessCauseH4', 'computeCelebrationsH5', 'computeDeathRisk', 'computeJinnType',
      'computeWifeVirginityStatus', 'computeWifeChastity', 'computeMarketPrices', 'computeWishFulfillment',
      'computeQuerentSorceryCheck'],
    dependencies: ['→ hawi-interpreter.js (7 סמלים — תלות-חוצה קיימת-בקוד למרות שהקובץ עצמו orphan, ראו Specification §4)'],
    executionStatus: 'disconnected-orphan',
    testStatus: 'none-found',
    productionStatus: 'blocked',
    orphanStatus: 'orphan',
    confidenceBehavior: 'none',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'kashf-commerce-smart-layer',
    filePath: 'goral-hachol/engine/kashf-commerce-smart-layer.js',
    category: 'executable-inference-engine',
    system: 'kashf',
    runtimeRole: 'conditional',
    knownLimitations: ['conditional על topic=commerce בלבד (לפי ה-Specification, לא נבדק-מחדש שורה-שורה בסבב זה)'],
    moduleStyle: 'ES-module-pure',
    publicExports: ['computeCommerceSmartLayer', 'default'],
    confidenceBehavior: 'none',
    executionStatus: 'connected-live',
    testStatus: 'passing',
    productionStatus: 'partial',
    orphanStatus: 'not-orphan',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'kashf-context-sanitizer',
    filePath: 'goral-hachol/engine/kashf-context-sanitizer.js',
    category: 'adapter-compatibility-layer',
    system: 'kashf',
    runtimeRole: 'supplementary',
    moduleStyle: 'ES-primary-CommonJS-tail',
    publicExports: ['sanitizeKashfClientContext', 'default'],
    knownLimitations: ['moduleStyle מתוקן מול ה-Specification: יש module.exports-tail בשורה 150, בנוסף ל-export-ים — לא ES-module-pure טהור כפי שלא-צוין-אחרת ב-Specification. ראו HALL_WISDOM_ENGINE_REGISTRY_IMPLEMENTATION_REPORT.md §חריגות.'],
    confidenceBehavior: 'none',
    executionStatus: 'connected-live',
    testStatus: 'passing',
    productionStatus: 'production',
    orphanStatus: 'not-orphan',
    evidence: { overall: 'VERIFIED_BY_CODE', moduleStyle: 'VERIFIED_BY_CODE (grep סטטי, סבב זה — שורה 150)', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'kashf-figure-classifier',
    filePath: 'goral-hachol/engine/kashf-figure-classifier.js',
    category: 'executable-inference-engine',
    system: 'kashf',
    runtimeRole: 'supplementary',
    description: 'מסווגת צורות גורל לפי שיטת כשף-אל-אסראר (יוצא/נכנס/אנדרוגינוס, מיטיב/מזיק) — שכבת-סיווג נפרדת, אינה מחליפה מנוע קיים.',
    moduleStyle: 'ES-module-pure',
    publicExports: ['getDakhalKharij', 'getSaadNahs', 'classifyFigure', 'default'],
    dependencies: ['קורא רק fig.fortuneHebrew מ-HAWI_FIGURE_NAMES_BY_ID — לא קורא zodiacHebrew/ichchhaHebrew (VERIFIED_BY_CODE, ראו HALL_WISDOM_KUNDALI_SOURCE_BOUNDARY_AUDIT.md §5.2)'],
    confidenceBehavior: 'none',
    executionStatus: 'connected-live',
    testStatus: 'indirect-only',
    productionStatus: 'production',
    orphanStatus: 'not-orphan',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'kashf-legacy-chart-adapter',
    filePath: 'goral-hachol/engine/kashf-legacy-chart-adapter.js',
    category: 'adapter-compatibility-layer',
    system: 'kashf',
    runtimeRole: 'mandatory-core',
    description: 'ממיר את פורמט הלוח של מנוע כשף (board.entries[i].pattern) לפורמט ה-"chart" שמצפות לו הפונקציות ב-kashf-pending-extraction.js.',
    moduleStyle: 'ES-module-pure',
    publicExports: ['buildLegacyChart'],
    dependencies: ['buildLegacyChart מסנן במפורש ל-{hebrew, fortune, element, elementHebrew, direction, movement} — לא מעביר zodiacHebrew/ichchhaHebrew (VERIFIED_BY_CODE, HALL_WISDOM_KUNDALI_SOURCE_BOUNDARY_AUDIT.md §5.2)'],
    confidenceBehavior: 'none',
    executionStatus: 'connected-live',
    testStatus: 'indirect-only',
    productionStatus: 'production',
    orphanStatus: 'not-orphan',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'kashf-book-rule-selector',
    filePath: 'goral-hachol/engine/kashf-book-rule-selector.js',
    category: 'qa-validation-engine',
    system: 'kashf',
    runtimeRole: 'supplementary',
    moduleStyle: 'ES-module-pure',
    publicExports: ['selectApplicableBookRules', 'default'],
    executionStatus: 'connected-partial (רק דרך intelligence/, לא UI — לפי Specification, לא נבדק-מחדש שורה-שורה בסבב זה)',
    testStatus: 'passing',
    productionStatus: 'partial',
    orphanStatus: 'not-orphan',
    confidenceBehavior: 'none',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'kashf-figure-appearance',
    filePath: 'goral-hachol/engine/kashf-figure-appearance.js',
    category: 'dataset-knowledge-module',
    system: 'kashf',
    runtimeRole: 'supplementary',
    moduleStyle: 'ES-module-pure',
    publicExports: ['FIGURE_APPEARANCE', 'getFigureAppearance'],
    confidenceBehavior: 'none',
    executionStatus: 'connected-live',
    testStatus: 'indirect-only',
    productionStatus: 'production',
    orphanStatus: 'not-orphan',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
];

// ---------------------------------------------------------------------------
// שכבת חאווי (2)
// ---------------------------------------------------------------------------
const HAWI_LAYER = [
  mk({
    id: 'hawi-interpreter',
    filePath: 'goral-hachol/engine/hawi-interpreter.js',
    category: 'executable-inference-engine',
    system: 'hawi',
    runtimeRole: 'mandatory-core',
    moduleStyle: 'ES-primary-CommonJS-tail',
    publicExports: ['NATURAL_HOUSE_FIGURES', 'ELEMENT_DIRECTION', 'MALEFIC_FIGURE_PATTERNS',
      'getFigureFortuneTone', 'getFigureDirection', 'chartHouse', 'computeNameLetters', 'FIGURE_PLANET_MAP',
      'FIGURE_FORTUNE_MAP', 'getDerivedFortune', 'getDerivedFortuneTone', 'deriveFigureG', 'isBeneficG',
      'isMaleficG', 'FIGURE_HEBREW_G', 'FIGURE_ELEMENT_MAP_G', 'ELEMENT_ABJAD_VALUES',
      'interpretHawiQuestionInitial', 'formatHawiInitialInterpretationHebrew', 'default'],
    dependencies: [
      '← kashf-dhamir.js (NATURAL_HOUSE_FIGURES)',
      '← kashf-pending-extraction.js (12 סמלים: NATURAL_HOUSE_FIGURES, MALEFIC_FIGURE_PATTERNS, getFigureDirection, chartHouse, FIGURE_PLANET_MAP, ELEMENT_DIRECTION, ועוד)',
      '← other-sources-pending-extraction.js (7 סמלים)',
      'מייבא goral-spiritual-diagnostics-engine.js (diagnoseSpiritualInfluence, isSpiritualQuestion) ומפעיל diagnoseSpiritualInfluence ללא-תנאי (שורה 2907)',
      'מייבא goral-conclusion-writer.js (writeHumanGoralConclusion) ומבצע Narrative Assembly בתוך interpretHawiQuestionInitial עצמה (שורה 2951) — לא כשלב-נפרד כמו בנתיב-הכשפי',
    ],
    confidenceBehavior: 'סכמה-ב׳ (route.confidence/route.matchedBy, למשל \'topic-override\' — ערכים-אפשריים-נוספים לא אומתו במלואם)',
    executionStatus: 'connected-live',
    testFiles: ['_test_engine.mjs (שבור-מראש: ERR_MODULE_NOT_FOUND על hawi-figure-names.js — נכשל גם על מצב-branch נקי, לא-קשור לשינוי כלשהו, מתועד ב-CLAUDE.md/דוחות קודמים)'],
    testStatus: 'indirect-only',
    productionStatus: 'production',
    orphanStatus: 'not-orphan',
    knownLimitations: [
      'מבצע גם narrative-assembly פנימית (writeHumanGoralConclusion בשורה 2951), לא מופרד כמו הנתיב-הכשפי (buildKashfReading + writeKashfReading נפרדים) — VERIFIED_BY_CODE',
      'isSpiritualQuestion מיובא (שורה 11) אך אינה נקראת בשום מקום בריפו — dead import / unused routing predicate (מתועדת ברשומת goral-spiritual-diagnostics-engine, לא כאן כרכיב-נפרד)',
      'moduleStyle מתוקן מול ה-Specification: יש module.exports-tail (שורה 3015) — קובץ שישי מתוך שישה שנמצאו עם התבנית הזו, לא רק goral-spiritual-diagnostics-engine.js כפי שה-Specification טוען "מקרה-יחיד". ראו IMPLEMENTATION_REPORT §חריגות.',
    ],
    evidence: {
      overall: 'VERIFIED_BY_CODE',
      publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)',
      moduleStyle: 'VERIFIED_BY_CODE (grep סטטי, סבב זה — שורה 3015, לא היה מתועד בשום מסמך קודם)',
      dependencies: 'VERIFIED_BY_CODE (buildBoardAnalysis שורות 2440-2467 נקראו ישירות; שאר-התלויות מ-Specification §4, לא נבדקו-מחדש שורה-שורה בסבב זה)',
    },
  }),
  mk({
    id: 'hawi-knowledge-router',
    filePath: 'goral-hachol/data/sources/hawi/hawi-knowledge-router.js',
    category: 'router',
    system: 'hawi',
    runtimeRole: 'mandatory-core',
    moduleStyle: 'ES-primary-CommonJS-tail',
    publicExports: ['detectHawiTopicFromQuestion', 'getHawiKnowledgeForTopic', 'routeHawiQuestion',
      'getAllHawiKnowledgeTopics', 'HOUSE_TOPICS_MAP', 'getTopicsForHouse', 'getAllHawiExtendedKnowledge',
      'HAWI_KNOWLEDGE_ROUTER', 'default'],
    knownLimitations: ['moduleStyle מתוקן מול ה-Specification: יש module.exports-tail (שורה 617), לא ES-module-pure טהור בלבד.'],
    confidenceBehavior: 'סכמה-ב׳ (route.confidence/route.matchedBy)',
    executionStatus: 'connected-live',
    testStatus: 'indirect-only',
    productionStatus: 'production',
    orphanStatus: 'not-orphan',
    evidence: {
      overall: 'VERIFIED_BY_CODE',
      publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)',
      moduleStyle: 'VERIFIED_BY_CODE (grep סטטי, סבב זה — שורה 617)',
    },
  }),
];

// ---------------------------------------------------------------------------
// שכבה משותפת (5)
// ---------------------------------------------------------------------------
const SHARED_LAYER = [
  mk({
    id: 'raml-board-generator',
    filePath: 'goral-hachol/engine/raml-board-generator.js',
    category: 'executable-inference-engine',
    system: 'shared',
    runtimeRole: 'mandatory-core',
    description: 'מנוע יצירת לוח הגורל מתוך 4 אמהות (Mothers→Daughters→Nieces→Witnesses→Judge→Sentence) — משותף לחאווי ולכשף כאחד.',
    moduleStyle: 'ES-module-pure',
    publicExports: ['generateRamlEntriesFromMothers', 'buildRamlBoardFromMothers', 'default'],
    dependencies: [
      'entry.figure לכל 16 הבתים נבנה דרך raml-figures.js::getHawiFigureCanonicalName(), המחזירה את אובייקט HAWI_FIGURE_NAMES_BY_ID המלא — כולל zodiacHebrew/ichchhaHebrew (Ramal Shastra) — ללא סינון (VERIFIED_BY_CODE, HALL_WISDOM_KUNDALI_SOURCE_BOUNDARY_AUDIT.md §5.1)',
    ],
    confidenceBehavior: 'none',
    executionStatus: 'connected-live',
    testStatus: 'passing',
    productionStatus: 'production',
    orphanStatus: 'not-orphan',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'goral-conclusion-writer',
    filePath: 'goral-hachol/engine/goral-conclusion-writer.js',
    category: 'narrative-assembler',
    system: 'shared',
    runtimeRole: 'mandatory-core',
    moduleStyle: 'ES-primary-CommonJS-tail',
    publicExports: ['writeShortClientVerdict', 'writeHumanGoralConclusion', 'writeClientReadingHebrew', 'default'],
    dependencies: [
      '← kashf-pending-extraction.js (תלות-חוצה מתועדת)',
      'hMeta() (שורות 1361-1366) קוראת h.zodiacHebrew/h.ichchhaHebrew — אך אלה תמיד undefined בפועל בנתיב-חאווי כי buildBoardAnalysis (hawi-interpreter.js) מסנן אותם החוצה במפורש — קוד-מת, לא contamination פעיל (VERIFIED_BY_CODE, HALL_WISDOM_KUNDALI_SOURCE_BOUNDARY_AUDIT.md §5.5)',
      'לא נקרא כלל מ-kashf-reading-engine.js/kashf-narrative-writer.js (VERIFIED_BY_CODE, grep מלא — סבב הביקורת הקודם)',
    ],
    knownLimitations: ['moduleStyle מתוקן מול ה-Specification: יש module.exports-tail (שורה 2892).', 'hMeta() מכילה קריאה לשדות-Ramal-Shastra שאינם-מגיעים-בפועל — שריד-קוד לא-מנוקה, ראו dependencies.'],
    confidenceBehavior: 'none',
    executionStatus: 'connected-live',
    testStatus: 'indirect-only',
    productionStatus: 'production',
    orphanStatus: 'not-orphan',
    evidence: {
      overall: 'VERIFIED_BY_CODE',
      publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)',
      moduleStyle: 'VERIFIED_BY_CODE (grep סטטי, סבב זה — שורה 2892)',
      dependencies: 'VERIFIED_BY_CODE (נקרא ישירות בביקורת ה-Kundali, שורות 1359-1366, 2440-2467 ב-hawi-interpreter.js)',
    },
  }),
  mk({
    id: 'goral-rule-applicability',
    filePath: 'goral-hachol/engine/goral-rule-applicability.js',
    category: 'qa-validation-engine',
    system: 'shared',
    runtimeRole: 'mandatory-core',
    moduleStyle: 'ES-module-pure',
    publicExports: ['getSectionVisibility', 'default'],
    confidenceBehavior: 'none',
    executionStatus: 'connected-live',
    testStatus: 'passing',
    productionStatus: 'production',
    orphanStatus: 'not-orphan',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'goral-spiritual-diagnostics-engine',
    filePath: 'goral-hachol/engine/goral-spiritual-diagnostics-engine.js',
    category: 'diagnostics-engine',
    system: 'hawi',
    runtimeRole: 'mandatory-core',
    knownLimitations: [
      'system מתועד hawi בפועל (לא shared) — hawi-interpreter.js הוא היחיד שמייבא (VERIFIED_BY_CODE)',
      'runtimeRole mandatory-core, לא conditional: diagnoseSpiritualInfluence נקרא ללא-תנאי ב-hawi-interpreter.js:2907, ללא if. isSpiritualQuestion מיובא (hawi-interpreter.js:11) אך אינה נקראת בשום מקום בריפו — dead import / unused routing predicate (VERIFIED_BY_CODE — grep מלא, ריק מלבד ה-import וההגדרה-העצמית)',
    ],
    moduleStyle: 'ES-primary-CommonJS-tail',
    publicExports: ['diagnoseSpiritualInfluence', 'isSpiritualQuestion', 'default'],
    importedBy: ['hawi-interpreter.js (ES import אמיתי)', 'qa/goral-qa-ai-evaluator-mock.js ו-qa/goral-qa-runner.mjs (רק כ-filesNotToTouch guard string, לא import אמיתי — לפי Specification, לא נבדק-מחדש בסבב זה)'],
    confidenceBehavior: 'none',
    executionStatus: 'connected-live (רק דרך חאווי — kashf-reading-engine.js לא מייבא)',
    testFiles: ['none found'],
    testStatus: 'none-found',
    productionStatus: 'partial',
    orphanStatus: 'not-orphan',
    evidence: {
      overall: 'VERIFIED_BY_CODE',
      publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)',
      runtimeRole: 'VERIFIED_BY_CODE (hawi-interpreter.js שורה 2907 — נקרא ישירות בסבב זה ובסבב הקודם)',
    },
  }),
  mk({
    id: 'goral-client-archive',
    filePath: 'goral-hachol/engine/goral-client-archive.js',
    category: 'archive-report-layer',
    system: 'shared',
    runtimeRole: 'mandatory-core',
    moduleStyle: 'ES-primary-CommonJS-tail',
    publicExports: ['getGoralArchive', 'saveGoralReadingToArchive', 'saveKashfReadingToArchive',
      'deleteGoralArchiveRecord', 'clearGoralArchive', 'getGoralClientHistory', 'summarizeGoralClientHistory', 'default'],
    knownLimitations: [
      'moduleStyle מתוקן מול ה-Specification: יש module.exports-tail (שורה 194).',
      'לא נבדק בסבב זה האם saveKashfReadingToArchive/saveGoralReadingToArchive שומרות board.entries גולמי (הנושא zodiacHebrew/ichchhaHebrew, ראו raml-board-generator) כמות-שהוא — OPEN (HALL_WISDOM_KUNDALI_SOURCE_BOUNDARY_AUDIT.md §5.7)',
    ],
    openItems: ['תוכן מלא של מה-שנשמר-בפועל בארכיון ביחס לשדות Ramal-Shastra — OPEN'],
    confidenceBehavior: 'none',
    executionStatus: 'connected-live',
    testStatus: 'OPEN (לא נבדק בסבב-זה, לפי Specification)',
    productionStatus: 'production',
    orphanStatus: 'not-orphan',
    evidence: {
      overall: 'VERIFIED_BY_CODE (exports בלבד)',
      publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)',
      moduleStyle: 'VERIFIED_BY_CODE (grep סטטי, סבב זה — שורה 194)',
    },
  }),
];

// ---------------------------------------------------------------------------
// Decision Brain (6)
// ---------------------------------------------------------------------------
const BRAIN_LAYER = [
  mk({
    id: 'goral-decision-brain', filePath: 'goral-hachol/brain/goral-decision-brain.js',
    category: 'qa-validation-engine', system: 'brain', runtimeRole: 'offline-only',
    moduleStyle: 'ES-module-pure', publicExports: ['evaluateReading', 'default'],
    confidenceBehavior: 'none', executionStatus: 'disconnected-by-design', testStatus: 'passing',
    productionStatus: 'not-applicable', orphanStatus: 'disconnected-by-decision',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'goral-knowledge-registry', filePath: 'goral-hachol/brain/goral-knowledge-registry.js',
    category: 'dataset-knowledge-module', system: 'brain', runtimeRole: 'offline-only',
    moduleStyle: 'ES-module-pure',
    publicExports: ['GORAL_KNOWLEDGE_REGISTRY', 'getRegistryEntriesForMethod', 'getRegistryEntryByRuleId',
      'getRegistryEntriesForTopic', 'KASHF_RULES_WITHOUT_PAGE_MAP', 'KASHF_PAGE_MAP_WITHOUT_RULES', 'default'],
    confidenceBehavior: 'none', executionStatus: 'disconnected-by-design', testStatus: 'indirect-only',
    productionStatus: 'not-applicable', orphanStatus: 'disconnected-by-decision',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'goral-rule-applicability-matrix', filePath: 'goral-hachol/brain/goral-rule-applicability-matrix.js',
    category: 'qa-validation-engine', system: 'brain', runtimeRole: 'offline-only',
    moduleStyle: 'ES-module-pure',
    publicExports: ['RULE_CATEGORIES', 'APPLICABILITY_VALUES', 'RULE_APPLICABILITY_MATRIX',
      'MATRIX_OVERRIDE_EVIDENCE', 'getApplicability', 'default'],
    confidenceBehavior: 'none', executionStatus: 'disconnected-by-design', testStatus: 'passing',
    productionStatus: 'not-applicable', orphanStatus: 'disconnected-by-decision',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'goral-question-taxonomy', filePath: 'goral-hachol/brain/goral-question-taxonomy.js',
    category: 'qa-validation-engine', system: 'brain', runtimeRole: 'offline-only',
    knownLimitations: ['סיווג-category גבולי — heuristic-classifier, לפי Specification'],
    moduleStyle: 'ES-module-pure', imports: [] ,
    publicExports: ['QUESTION_TYPES', 'getAllQuestionTypeIds', 'getQuestionType', 'classifyQuestionType', 'default'],
    confidenceBehavior: 'none', executionStatus: 'disconnected-by-design', testStatus: 'passing',
    productionStatus: 'not-applicable', orphanStatus: 'disconnected-by-decision',
    evidence: { overall: 'VERIFIED_BY_CODE (leaf, ללא imports)', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'goral-output-quality-rubric', filePath: 'goral-hachol/brain/goral-output-quality-rubric.js',
    category: 'dataset-knowledge-module', system: 'brain', runtimeRole: 'offline-only',
    moduleStyle: 'ES-module-pure',
    publicExports: ['RUBRIC_DIMENSIONS', 'getAllRubricDimensionIds', 'severityForScore', 'default'],
    confidenceBehavior: 'none', executionStatus: 'disconnected-by-design', testStatus: 'indirect-only',
    productionStatus: 'not-applicable', orphanStatus: 'disconnected-by-decision',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'goral-brain-evaluation-runner', filePath: 'goral-hachol/brain/goral-brain-evaluation-runner.mjs',
    category: 'qa-validation-engine', system: 'brain', runtimeRole: 'offline-only',
    moduleStyle: 'ES-module-pure', publicExports: ['run', 'default'],
    confidenceBehavior: 'none', executionStatus: 'disconnected-by-design', testStatus: 'passing',
    productionStatus: 'not-applicable', orphanStatus: 'disconnected-by-decision',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
];

// ---------------------------------------------------------------------------
// QA Layer (7)
// ---------------------------------------------------------------------------
const QA_LAYER = [
  mk({
    id: 'goral-qa-output-collector', filePath: 'goral-hachol/qa/goral-qa-output-collector.js',
    category: 'qa-validation-engine', system: 'qa', runtimeRole: 'offline-only',
    moduleStyle: 'ES-module-pure', publicExports: ['collectScenarioOutput', 'default'],
    knownLimitations: ['אינו מייבא/קורא ל-kashf-ai-context-builder.js (VERIFIED_BY_CODE — grep מלא, סבב-הביקורת הקודם), בניגוד לניסוח "connected-partial (רק דרך qa/)" שמופיע ב-HALL_WISDOM_ENGINE_REGISTRY_SPECIFICATION.md:287'],
    confidenceBehavior: 'none', executionStatus: 'disconnected-by-design', testStatus: 'passing',
    productionStatus: 'not-applicable', orphanStatus: 'disconnected-by-decision',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'goral-qa-deterministic-checks', filePath: 'goral-hachol/qa/goral-qa-deterministic-checks.js',
    category: 'qa-validation-engine', system: 'qa', runtimeRole: 'offline-only',
    moduleStyle: 'ES-module-pure', publicExports: ['runDeterministicChecks', 'default'],
    confidenceBehavior: 'none', executionStatus: 'disconnected-by-design', testStatus: 'passing',
    productionStatus: 'not-applicable', orphanStatus: 'disconnected-by-decision',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'goral-qa-runner', filePath: 'goral-hachol/qa/goral-qa-runner.mjs',
    category: 'qa-validation-engine', system: 'qa', runtimeRole: 'offline-only',
    moduleStyle: 'ES-module-pure', publicExports: ['run', 'default'],
    confidenceBehavior: 'none', executionStatus: 'disconnected-by-design', testStatus: 'indirect-only',
    productionStatus: 'not-applicable', orphanStatus: 'disconnected-by-decision',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'goral-qa-scenarios', filePath: 'goral-hachol/qa/goral-qa-scenarios.js',
    category: 'dataset-knowledge-module', system: 'qa', runtimeRole: 'offline-only',
    moduleStyle: 'ES-module-pure', publicExports: ['GORAL_QA_SCENARIOS', 'default'],
    confidenceBehavior: 'none', executionStatus: 'disconnected-by-design', testStatus: 'indirect-only',
    productionStatus: 'not-applicable', orphanStatus: 'disconnected-by-decision',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'goral-qa-ai-payload-builder', filePath: 'goral-hachol/qa/goral-qa-ai-payload-builder.js',
    category: 'qa-validation-engine', system: 'qa', runtimeRole: 'offline-only',
    moduleStyle: 'ES-module-pure', publicExports: ['buildQaEvaluatorPayload', 'default'],
    confidenceBehavior: 'none', executionStatus: 'disconnected-by-design', testStatus: 'passing',
    productionStatus: 'not-applicable', orphanStatus: 'disconnected-by-decision',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'goral-qa-ai-evaluator-mock', filePath: 'goral-hachol/qa/goral-qa-ai-evaluator-mock.js',
    category: 'qa-validation-engine', system: 'qa', runtimeRole: 'offline-only',
    moduleStyle: 'ES-module-pure', publicExports: ['evaluateQaRunMock', 'default'],
    confidenceBehavior: 'none', executionStatus: 'disconnected-by-design', testStatus: 'passing',
    productionStatus: 'not-applicable', orphanStatus: 'disconnected-by-decision',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'goral-qa-ai-runner', filePath: 'goral-hachol/qa/goral-qa-ai-runner.mjs',
    category: 'qa-validation-engine', system: 'qa', runtimeRole: 'offline-only',
    moduleStyle: 'ES-module-pure', publicExports: ['run', 'default'],
    confidenceBehavior: 'none', executionStatus: 'disconnected-by-design', testStatus: 'indirect-only',
    productionStatus: 'not-applicable', orphanStatus: 'disconnected-by-decision',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
];

// ---------------------------------------------------------------------------
// Intelligence Layer (15 — רוב-השדות OPEN במכוון, לפי ה-Specification;
// publicExports אומת-מחדש בגישה-סטטית בסבב זה לכל 15, גם כשיתר-השדות OPEN)
// ---------------------------------------------------------------------------
const INTELLIGENCE_LAYER = [
  mk({
    id: 'intent-analyzer', filePath: 'goral-hachol/intelligence/intent-analyzer.js',
    category: 'qa-validation-engine (INFERRED)', system: 'intelligence',
    executionStatus: 'disconnected-by-design (מתעד-עצמו כ"לא-מחובר")',
    moduleStyle: 'ES-module-pure',
    publicExports: ['ANALYSIS_VERSION', 'analyzeIntent', 'validateIntentInput', 'validateIntentResult', 'default'],
    testStatus: 'indirect-only',
    evidence: { overall: 'DOCUMENTED_ONLY', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'intent-analyzer-hebrew-rules', filePath: 'goral-hachol/intelligence/intent-analyzer-hebrew-rules.js',
    category: 'dataset-knowledge-module (INFERRED)', system: 'intelligence',
    moduleStyle: 'ES-module-pure', publicExports: ['INTENT_PATTERNS', 'default'],
    evidence: { overall: 'OPEN', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'intent-types', filePath: 'goral-hachol/intelligence/intent-types.js',
    category: 'dataset-knowledge-module (INFERRED)', system: 'intelligence',
    moduleStyle: 'ES-module-pure',
    publicExports: ['UNKNOWN_INTENT_ID', 'UNKNOWN_INTENT_TITLE_HEBREW', 'INTENT_IDS', 'INTENT_DEFINITIONS',
      'EXCLUSION_REASON_BY_INTENT', 'UNKNOWN_FORBIDDEN_RULE_CATEGORIES', 'getAllIntentIds',
      'getIntentDefinition', 'isIntentId', 'isPrimaryIntentValue'],
    evidence: { overall: 'OPEN', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'kashf-ai-context-builder', filePath: 'goral-hachol/intelligence/kashf-ai-context-builder.js',
    category: 'adapter-compatibility-layer', system: 'intelligence',
    moduleStyle: 'ES-module-pure',
    publicExports: ['KASHF_AI_CONTEXT_BUILDER_VERSION', 'KASHF_METHOD_METADATA', 'buildRuleCoverageStatus',
      'buildAiSafeKashfEngineOutput', 'buildAiSafeKashfBoard', 'buildKashfAiContextPackage', 'default'],
    importedBy: ['_test_kashf_book_rule_catalog.mjs', '_test_kashf_hawi_method_isolation.mjs', '_test_kashf_ai_context_builder.mjs — שלושתם קבצי-בדיקה בלבד'],
    executionStatus: 'disconnected-orphan-from-live-runtime (מתוקן מול Specification)',
    testStatus: 'passing (בקבצי-הבדיקה עצמם)',
    orphanStatus: 'not-orphan',
    knownLimitations: [
      'orphanStatus הוא not-orphan (מקושר לשלושה קבצי-בדיקה — לא 0 קוראים) אך executionStatus מציין במפורש שהוא מנותק-מריצה-חיה — "not-orphan" ו-"לא-מחובר-לריצה-חיה" הם שני ממדים נפרדים כאן, לא סותרים.',
      'תוקן מול HALL_WISDOM_ENGINE_REGISTRY_SPECIFICATION.md:287 (שם מתויג "connected-partial (רק דרך qa/, לא UI)") — grep-מלא-מחדש בסבב-הקודם (HALL_WISDOM_KUNDALI_SOURCE_BOUNDARY_AUDIT.md §5.6) מצא: 0 קוראים ב-qa/, 0 ב-goral-app.js, 0 ב-kashf-reading-engine.js — הקוראים היחידים הם שלושת קבצי-ה-_test_*.mjs. אינו מחובר לשום ריצה חיה כיום.',
      'POSITION_FIGURE_STATE_KEYS (שורות 338-343) מתיר-מעבר של zodiacHebrew/ichchhaHebrew (מקור Ramal Shastra) עם הערת-קוד שגויה (שורות 335-337) המתארת אותם כ"שכבת-הסיווג העצמית של כשף" — misattribution בתוך הקוד עצמו, לא רק שאלת-provenance חיצונית (VERIFIED_BY_CODE, HALL_WISDOM_KUNDALI_SOURCE_BOUNDARY_AUDIT.md §5.6, סיכון R3/R4)',
    ],
    evidence: {
      overall: 'VERIFIED_BY_CODE (מאומת-מחדש, סבב הביקורת הקודם — HALL_WISDOM_KUNDALI_SOURCE_BOUNDARY_AUDIT.md)',
      publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)',
      executionStatus: 'VERIFIED_BY_CODE (grep מלא על buildKashfAiContextPackage בכל הריפו, סבב הקודם)',
    },
  }),
  mk({
    id: 'reading-intelligence-types', filePath: 'goral-hachol/intelligence/reading-intelligence-types.js',
    category: 'dataset-knowledge-module (INFERRED)', system: 'intelligence',
    moduleStyle: 'ES-module-pure',
    publicExports: ['METHODS', 'RULE_DECISION_VALUES', 'CLIENT_VISIBILITY_VALUES', 'CONFIDENCE_VALUES',
      'SEVERITY_VALUES', 'ISSUE_STATUS_VALUES', 'UNCERTAINTY_POLICY_VALUES', 'CONTRADICTION_POLICY_VALUES',
      'SAFETY_POLICY_VALUES', 'isMethod'],
    evidence: { overall: 'OPEN', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'reading-plan-schema', filePath: 'goral-hachol/intelligence/reading-plan-schema.js',
    category: 'dataset-knowledge-module (INFERRED)', system: 'intelligence',
    moduleStyle: 'ES-module-pure', publicExports: ['createReadingPlan', 'validateReadingPlan', 'default'],
    evidence: { overall: 'OPEN', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'reading-planner-types', filePath: 'goral-hachol/intelligence/reading-planner-types.js',
    category: 'dataset-knowledge-module (INFERRED)', system: 'intelligence',
    moduleStyle: 'ES-module-pure',
    publicExports: ['PLAN_VERSION', 'READING_DOMAINS', 'METHOD_BY_DOMAIN', 'KNOWN_CARD_SPREAD_IDS',
      'EXECUTION_ORDER_DEFAULT', 'WARNING_TYPES', 'WARNING_SEVERITY_VALUES', 'isReadingDomain',
      'isMethodForDomain', 'isWarningType'],
    evidence: { overall: 'OPEN', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'reading-planner-validators', filePath: 'goral-hachol/intelligence/reading-planner-validators.js',
    category: 'qa-validation-engine (INFERRED)', system: 'intelligence', moduleStyle: 'ES-module-pure',
    publicExports: ['validatePlannerInput', 'validatePlannerResult', 'default'],
    evidence: { overall: 'OPEN', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'reading-planner', filePath: 'goral-hachol/intelligence/reading-planner.js',
    category: 'executable-inference-engine (INFERRED)', system: 'intelligence',
    executionStatus: 'disconnected-by-design (מתעד-עצמו)', moduleStyle: 'ES-module-pure',
    publicExports: ['PLAN_VERSION', 'buildReadingPlan', 'default'],
    evidence: { overall: 'DOCUMENTED_ONLY', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'reading-strategy-builder', filePath: 'goral-hachol/intelligence/reading-strategy-builder.js',
    category: 'executable-inference-engine (INFERRED)', system: 'intelligence',
    executionStatus: 'disconnected-by-design (מתעד-עצמו)', moduleStyle: 'ES-module-pure',
    publicExports: ['STRATEGY_VERSION', 'buildReadingStrategy', 'validateStrategyInput', 'validateStrategyResult', 'default'],
    evidence: { overall: 'DOCUMENTED_ONLY', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'reading-strategy-types', filePath: 'goral-hachol/intelligence/reading-strategy-types.js',
    category: 'dataset-knowledge-module (INFERRED)', system: 'intelligence', moduleStyle: 'ES-module-pure',
    publicExports: ['STRATEGY_VERSION', 'READING_DOMAINS', 'METHOD_BY_DOMAIN', 'VERIFICATION_POLICY_VALUES',
      'CLIENT_DEPTH_VALUES', 'ADVISOR_DEPTH_VALUES', 'HIDDEN_SECTIONS_POLICY_VALUES', 'TIMING_POLICY_VALUES',
      'SPIRITUAL_POLICY_VALUES', 'CONFIDENCE_POLICY_VALUES'],
    evidence: { overall: 'OPEN', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'rule-decision-engine', filePath: 'goral-hachol/intelligence/rule-decision-engine.js',
    category: 'executable-inference-engine (INFERRED)', system: 'intelligence',
    executionStatus: 'disconnected-by-design (מתעד-עצמו)', moduleStyle: 'ES-module-pure',
    publicExports: ['ENGINE_VERSION', 'validateRuleSet', 'runRuleDecisionEngine', 'decideRule', 'default'],
    evidence: { overall: 'DOCUMENTED_ONLY', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'rule-decision-schema', filePath: 'goral-hachol/intelligence/rule-decision-schema.js',
    category: 'dataset-knowledge-module (INFERRED)', system: 'intelligence', moduleStyle: 'ES-module-pure',
    publicExports: ['createRuleDecision', 'validateRuleDecision', 'default'],
    evidence: { overall: 'OPEN', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'rule-decision-types', filePath: 'goral-hachol/intelligence/rule-decision-types.js',
    category: 'dataset-knowledge-module (INFERRED)', system: 'intelligence', moduleStyle: 'ES-module-pure',
    publicExports: ['ENGINE_VERSION', 'RULE_DECISION_VALUES', 'isRuleDecisionValue', 'WARNING_SEVERITY_VALUES',
      'isWarningSeverity', 'WARNING_TYPES', 'CONFLICT_TYPES', 'CLIENT_VISIBILITY_VALUES',
      'isClientVisibilityValue', 'isWarningType', 'isConflictType', 'DECISION_ORDER_STEPS'],
    knownLimitations: ['קיים גם קובץ intelligence/rule-decision-validators.js (16-מתוך-16 קבצי intelligence/ בפועל) שאינו מופיע באף אחד משורות "Intelligence Layer (15)" ב-HALL_WISDOM_ENGINE_REGISTRY_SPECIFICATION.md §8 — נמצא ב-ls טרי, לא נכלל ברשומה עצמאית ב-Snapshot הזה כי לא כוסה באף אחד מ-6 מסמכי-המקור. ראו IMPLEMENTATION_REPORT.'],
    evidence: { overall: 'OPEN', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'system-memory-schema', filePath: 'goral-hachol/intelligence/system-memory-schema.js',
    category: 'dataset-knowledge-module (INFERRED)', system: 'intelligence', moduleStyle: 'ES-module-pure',
    publicExports: ['createSystemMemoryEvent', 'validateSystemMemoryEvent', 'createSystemMemoryStore',
      'upsertIssueEvent', 'findIssueEvents', 'default'],
    evidence: { overall: 'OPEN', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
];

// ---------------------------------------------------------------------------
// מנועי Astro/Temperament (2) — raml-data/
// ---------------------------------------------------------------------------
const ASTRO_LAYER = [
  mk({
    id: 'raml-temperament-engine', filePath: 'raml-data/raml-temperament-engine.js',
    category: 'executable-inference-engine', system: 'infrastructure', runtimeRole: 'supplementary',
    moduleStyle: 'dual-CommonJS-window',
    publicExports: ['normalizeFigureKey', 'getPlanetByFigureKey', 'ramlBuildTemperamentProfile', 'ramlTemperamentSummary'],
    confidenceBehavior: 'סכמה-ג׳ (VERIFIED/HIGH CONFIDENCE/RECONSTRUCTED/PARTIAL/OPEN)',
    executionStatus: 'disconnected-by-design', testStatus: 'indirect-only',
    productionStatus: 'blocked (בכוונה)', orphanStatus: 'disconnected-by-decision',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)', system: 'INFERRED (לא-מוצהר-במפורש ב-Specification)' },
  }),
  mk({
    id: 'raml-seasonal-astro-profile-engine', filePath: 'raml-data/raml-seasonal-astro-profile-engine.js',
    category: 'executable-inference-engine', system: 'infrastructure', runtimeRole: 'supplementary',
    moduleStyle: 'dual-CommonJS-window',
    publicExports: ['ramlBuildSeasonalAstroProfile'],
    dependencies: ['require() בזמן-טעינה (try/catch-guarded) על ./raml-temperament-engine.js, kashf-shibutzim.js, kashf-pending-extraction.js — VERIFIED_BY_CODE, כפי-שתועד-כבר בעת-הבנייה המקורית'],
    confidenceBehavior: 'סכמה-ג׳ (VERIFIED/HIGH CONFIDENCE/RECONSTRUCTED/PARTIAL/OPEN)',
    executionStatus: 'disconnected-by-design',
    testFiles: ['tests/raml-seasonal-astro-profile-engine.test.js (13 קבוצות, כולן PASSED)'],
    testStatus: 'passing', productionStatus: 'blocked (בכוונה)', orphanStatus: 'disconnected-by-decision',
    evidence: { overall: 'VERIFIED_BY_TEST', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)', system: 'INFERRED (לא-מוצהר-במפורש ב-Specification)' },
  }),
];

// ---------------------------------------------------------------------------
// raml-data — קבצי-נתונים (11)
// ---------------------------------------------------------------------------
const RAML_DATA_LAYER = [
  mk({
    id: 'raml-astro-correspondences', filePath: 'raml-data/raml-astro-correspondences.js',
    category: 'dataset-knowledge-module', system: 'infrastructure', runtimeRole: 'supplementary',
    moduleStyle: 'dual-CommonJS-window',
    publicExports: ['RAML_PLANETARY_TEMPERAMENT', 'RAML_SEASONS', 'RAML_ZODIAC_ELEMENTS', 'RAML_ZODIAC_FIGURE_ASSIGNMENTS', 'ramlPlanetByFigureKey'],
    executionStatus: 'connected-partial (רק ע"י temperament-engine)', testStatus: 'indirect-only',
    productionStatus: 'blocked (בכוונה)', orphanStatus: 'disconnected-by-decision', confidenceBehavior: 'none',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'raml-forms-basic', filePath: 'raml-data/raml-forms-basic.js',
    category: 'dataset-knowledge-module', system: 'infrastructure', runtimeRole: 'mandatory-core (טעון ב-HTML)',
    moduleStyle: 'dual-CommonJS-window', publicExports: ['RAML_FORMS_BASIC'],
    executionStatus: 'connected-live', testStatus: 'none-found', productionStatus: 'production',
    orphanStatus: 'not-orphan', confidenceBehavior: 'none',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'raml-forms-profiles', filePath: 'raml-data/raml-forms-profiles.js',
    category: 'orphan-module', system: 'infrastructure', runtimeRole: 'disconnected',
    moduleStyle: 'dual-CommonJS-window',
    publicExports: ['RAML_FORMS_PROFILES', 'ramlGetFigureFullProfile', 'ramlListFigureFullProfiles'],
    executionStatus: 'disconnected-orphan', testStatus: 'none-found', productionStatus: 'blocked',
    orphanStatus: 'orphan', confidenceBehavior: 'none',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'raml-foundation-bulugh-al-amal', filePath: 'raml-data/raml-foundation-bulugh-al-amal.js',
    category: 'orphan-module', system: 'infrastructure', runtimeRole: 'disconnected',
    moduleStyle: 'dual-CommonJS-window',
    publicExports: ['RAML_BULUGH_AL_AMAL_FOUNDATIONS', 'ramlGetBulughAlAmalFoundations',
      'ramlListBulughAlAmalPages', 'ramlListBulughAlAmalMissingTargets'],
    executionStatus: 'disconnected-orphan', testStatus: 'none-found', productionStatus: 'blocked',
    orphanStatus: 'orphan', confidenceBehavior: 'none',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'raml-foundation-closure-audit', filePath: 'raml-data/raml-foundation-closure-audit.js',
    category: 'orphan-module', system: 'infrastructure', runtimeRole: 'disconnected',
    moduleStyle: 'dual-CommonJS-window',
    publicExports: ['RAML_FOUNDATION_CLOSURE_AUDIT', 'ramlGetFoundationClosureAudit',
      'ramlListFoundationClosureOpenItems', 'ramlListFoundationClosureReadyItems'],
    executionStatus: 'disconnected-orphan', testStatus: 'none-found', productionStatus: 'blocked',
    orphanStatus: 'orphan', confidenceBehavior: 'none',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'raml-foundation-qawl-jami-extra', filePath: 'raml-data/raml-foundation-qawl-jami-extra.js',
    category: 'orphan-module', system: 'infrastructure', runtimeRole: 'disconnected',
    moduleStyle: 'dual-CommonJS-window',
    publicExports: ['RAML_QAWL_JAMI_EXTRA_FOUNDATIONS', 'ramlGetQawlJamiExtraFoundation', 'ramlListQawlJamiExtraFoundationSections'],
    executionStatus: 'disconnected-orphan', testStatus: 'none-found', productionStatus: 'blocked',
    orphanStatus: 'orphan', confidenceBehavior: 'none',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'raml-houses-basic', filePath: 'raml-data/raml-houses-basic.js',
    category: 'dataset-knowledge-module', system: 'infrastructure', runtimeRole: 'mandatory-core (טעון ב-HTML)',
    moduleStyle: 'dual-CommonJS-window',
    publicExports: ['RAML_HOUSES_BASIC', 'ramlGetHouseBasic', 'ramlListHousesBasic'],
    executionStatus: 'connected-live', testStatus: 'none-found', productionStatus: 'production',
    orphanStatus: 'not-orphan', confidenceBehavior: 'none',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'raml-houses-profiles', filePath: 'raml-data/raml-houses-profiles.js',
    category: 'orphan-module', system: 'infrastructure', runtimeRole: 'disconnected',
    moduleStyle: 'dual-CommonJS-window',
    publicExports: ['RAML_HOUSES_PROFILES', 'RAML_HOUSES_GENERAL_RULES', 'ramlGetHouseFullProfile', 'ramlListHouseFullProfiles'],
    executionStatus: 'disconnected-orphan', testStatus: 'none-found', productionStatus: 'blocked',
    orphanStatus: 'orphan', confidenceBehavior: 'none',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'raml-reading-foundations', filePath: 'raml-data/raml-reading-foundations.js',
    category: 'orphan-module', system: 'infrastructure', runtimeRole: 'disconnected',
    moduleStyle: 'dual-CommonJS-window',
    publicExports: ['RAML_READING_FOUNDATIONS', 'ramlGetReadingFoundation', 'ramlListReadingFoundationSections'],
    executionStatus: 'disconnected-orphan', testStatus: 'none-found', productionStatus: 'blocked',
    orphanStatus: 'orphan', confidenceBehavior: 'none',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'raml-spiritual-diagnostics', filePath: 'raml-data/raml-spiritual-diagnostics.js',
    category: 'orphan-module', system: 'infrastructure', runtimeRole: 'disconnected',
    moduleStyle: 'dual-CommonJS-window',
    publicExports: ['RAML_SPIRITUAL_DIAGNOSTICS', 'ramlGetSpiritualDiagnostics', 'ramlGetDropSevenOpenPointsRule', 'ramlInterpretOpenPointsDropSeven'],
    knownLimitations: ['התנגשות-שם עם goral-spiritual-diagnostics-engine.js (engine/) — קובץ נפרד לחלוטין, לא לבלבל (מתועד ב-Specification)'],
    executionStatus: 'disconnected-orphan', testStatus: 'none-found', productionStatus: 'blocked',
    orphanStatus: 'orphan', confidenceBehavior: 'none',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
  mk({
    id: 'raml-topic-rules', filePath: 'raml-data/raml-topic-rules.js',
    category: 'orphan-module', system: 'infrastructure', runtimeRole: 'disconnected',
    moduleStyle: 'dual-CommonJS-window',
    publicExports: ['RAML_TOPIC_RULES', 'ramlGetTopicRules', 'ramlListTopicHouses', 'ramlFindTopicHouseByNumber', 'ramlFindTopicAliases'],
    executionStatus: 'disconnected-orphan', testStatus: 'none-found', productionStatus: 'blocked',
    orphanStatus: 'orphan', confidenceBehavior: 'none',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
];

// ---------------------------------------------------------------------------
// AI Provider (1)
// ---------------------------------------------------------------------------
const AI_PROVIDER_LAYER = [
  mk({
    id: 'anthropic-provider', filePath: 'ai/provider/anthropic-provider.js',
    category: 'adapter-compatibility-layer', system: 'infrastructure', runtimeRole: 'disconnected',
    moduleStyle: 'ES-module-pure',
    knownLimitations: ['moduleStyle מתוקן/מושלם מול Specification (שם היה OPEN): מאומת בפועל כ-ES-module-pure טהור (export async function, אין window/CommonJS) — לא dual-CommonJS-window כמו raml-data/**.'],
    publicExports: ['callAnthropic'],
    executionStatus: 'disconnected-by-design (מוצהר-בכותרת)', testStatus: 'passing (own test)',
    productionStatus: 'not-applicable', orphanStatus: 'disconnected-by-decision', confidenceBehavior: 'none',
    evidence: { overall: 'VERIFIED_BY_CODE', publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)', moduleStyle: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)' },
  }),
];

// ---------------------------------------------------------------------------
// Kundali (2) — הרחבת-תחום מפורשת מעבר ל-6 התיקיות המקוריות של ה-Specification
// (goral-hachol/kundali/ אינו בתחום סעיף 1 של ה-Specification), נוספת כאן
// אך ורק כי המשימה הנוכחית דורשת זאת במפורש (סעיף 5) ומפנה ל-
// HALL_WISDOM_KUNDALI_SOURCE_BOUNDARY_AUDIT.md כמקור-Evidence.
// ---------------------------------------------------------------------------
const KUNDALI_LAYER = [
  mk({
    id: 'kundali-engine', filePath: 'goral-hachol/kundali/kundali-engine.js',
    category: 'orphan-module', system: 'infrastructure', runtimeRole: 'disconnected',
    description: 'קובץ-שלד: מכריז כוונה למנוע-קונדלי ייעודי (TODO בגוף-הקובץ) — הכוונה כבר מומשה בקוד inline בתוך goral-app.js, לא דרך הקובץ הזה.',
    moduleStyle: 'ES-module-pure', publicExports: ['KUNDALI_ENGINE_VERSION'],
    imports: [], importedBy: [],
    executionStatus: 'disconnected-orphan', testFiles: [], testStatus: 'none-found',
    productionStatus: 'blocked', orphanStatus: 'orphan',
    knownLimitations: ['0 imports, 0 script tags, 0 קוראים — orphan מוחלט (VERIFIED_BY_CODE)',
      'הכוונה המקורית (בניית VEDIC_SIGN_IN_HOUSE) כבר מומשה ב-komilla-house-signs.js, לא כאן'],
    openItems: ['גורל הקובץ — חיבור/מחיקה/השארה-כתיעוד — OPEN, לא הוכרע (HALL_WISDOM_KUNDALI_SOURCE_BOUNDARY_AUDIT.md §7, §9-D5)'],
    confidenceBehavior: 'none',
    evidence: {
      overall: 'VERIFIED_BY_CODE (HALL_WISDOM_KUNDALI_SOURCE_BOUNDARY_AUDIT.md §7, אומת-מחדש בקוד עצמו)',
      publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)',
      orphanStatus: 'VERIFIED_BY_CODE',
    },
  }),
  mk({
    id: 'komilla-house-signs', filePath: 'goral-hachol/kundali/komilla-house-signs.js',
    category: 'dataset-knowledge-module', system: 'infrastructure', runtimeRole: 'mandatory-core (טעון ב-HTML, מוצג במסך #screen-kundali)',
    description: 'פרשנות מזל-בבית — 144 ערכים (12 מזלות × 12 בתים), מקור מוצהר בקובץ: "יסודות האסטרולוגיה הוודית — קומילה סטון (עמ׳ 102–139)".',
    moduleStyle: 'window-global-only (VERIFIED_BY_CODE — window.VEDIC_SIGN_IN_HOUSE בלבד, אין module.exports, אין ES export — סגנון רביעי שלא-מכוסה באף אחת משלוש סגנונות-המודול המתועדים ב-HALL_WISDOM_ENGINE_REGISTRY_SPECIFICATION.md §3)',
    publicExports: ['window.VEDIC_SIGN_IN_HOUSE'],
    imports: [], importedBy: ['goral-hachol/ui/goral-app.js::buildKundaliHtml (window.VEDIC_SIGN_IN_HOUSE, שורות 803-804)'],
    dependencies: ['נטען דרך <script src="./goral-hachol/kundali/komilla-house-signs.js?v=2"> ב-goral-hachol.html (שורה 3391) — מופעל ברמת-מודול בכל טעינת-עמוד, סינכרוני'],
    executionStatus: 'connected-live', testFiles: [], testStatus: 'none-found',
    productionStatus: 'production', orphanStatus: 'not-orphan',
    knownLimitations: ['0 כיסוי-בדיקות (VERIFIED_BY_CODE — grep מלא, ריק)',
      'ללא שדה sourceStatus כלל, בניגוד לכלל-החובה ב-CLAUDE.md לכל dataset אחר באפליקציה (VERIFIED_BY_CODE)'],
    openItems: ['זהות "Ramal Shastra (עמ׳ 38)" מול "קומילה סטון (עמ׳ 102-139)" — OPEN (HALL_WISDOM_KUNDALI_SOURCE_BOUNDARY_AUDIT.md §4)'],
    confidenceBehavior: 'none',
    evidence: {
      overall: 'VERIFIED_BY_CODE (HALL_WISDOM_KUNDALI_SOURCE_BOUNDARY_AUDIT.md §1-§2, אומת-מחדש בקוד עצמו)',
      publicExports: 'VERIFIED_BY_CODE (grep סטטי, סבב זה)',
      moduleStyle: 'VERIFIED_BY_CODE (grep סטטי, סבב זה — ממצא-חדש, לא היה בשום מסמך קודם)',
    },
  }),
];

// ---------------------------------------------------------------------------
// הרכבה סופית — קריאה-בלבד
// ---------------------------------------------------------------------------

function deepFreeze(value) {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }
  Object.getOwnPropertyNames(value).forEach((key) => {
    deepFreeze(value[key]);
  });
  return Object.freeze(value);
}

/** רשומת-ה-Registry המלאה. קריאה-בלבד (deep-frozen). 67 רכיבים. */
const ENGINE_REGISTRY = deepFreeze([
  ...KASHF_LAYER,
  ...HAWI_LAYER,
  ...SHARED_LAYER,
  ...BRAIN_LAYER,
  ...QA_LAYER,
  ...INTELLIGENCE_LAYER,
  ...ASTRO_LAYER,
  ...RAML_DATA_LAYER,
  ...AI_PROVIDER_LAYER,
  ...KUNDALI_LAYER,
]);

/** עותק-קריאה-בלבד עמוק, ללא reference משותף למקור. */
function cloneDeepFrozen(value) {
  if (Array.isArray(value)) {
    return deepFreeze(value.map(cloneDeepFrozen));
  }
  if (value !== null && typeof value === 'object') {
    const out = {};
    Object.keys(value).forEach((key) => {
      out[key] = cloneDeepFrozen(value[key]);
    });
    return deepFreeze(out);
  }
  return value;
}

/**
 * מחזירה Snapshot בלתי-ניתן-לשינוי של כל ה-Registry. עותק עמוק —
 * אין reference משותף עם ENGINE_REGISTRY המקורי.
 */
function getEngineRegistrySnapshot() {
  return cloneDeepFrozen(ENGINE_REGISTRY);
}

/** מחזירה רשומה בודדת לפי id, או null. עותק בלתי-ניתן-לשינוי. */
function findRegistryComponentById(id) {
  const found = ENGINE_REGISTRY.find((r) => r.id === id);
  return found ? cloneDeepFrozen(found) : null;
}

/** מחזירה את כל הרשומות בקטגוריה נתונה (מחרוזת category, כולל וריאציות (INFERRED)). */
function listRegistryComponentsByCategory(category) {
  return cloneDeepFrozen(ENGINE_REGISTRY.filter((r) => r.category === category));
}

/**
 * מחזירה רק רשומות שיש-להן openItems לא-ריקים (מערך-לא-ריק, לא OPEN הסתמי).
 */
function listRegistryOpenItems() {
  return cloneDeepFrozen(
    ENGINE_REGISTRY.filter((r) => Array.isArray(r.openItems) && r.openItems.length > 0)
  );
}

module.exports = {
  ENGINE_REGISTRY,
  getEngineRegistrySnapshot,
  findRegistryComponentById,
  listRegistryComponentsByCategory,
  listRegistryOpenItems,
};
