/**
 * kashf-book-rule-catalog.js
 *
 * Canonical, source-verified rule catalog extracted from כשף אל-אסרר
 * (kashf-al-asrar-book.js) — built from
 * HALL_WISDOM_KASHF_EXHAUSTIVE_WITNESS_AND_SPIRITUAL_RULES_AUDIT.md. Every
 * entry here was read in full page-context in that audit before being
 * catalogued; nothing here was invented, paraphrased-with-added-meaning,
 * or merged across ambiguous source passages.
 *
 * Scope of this round: topicId "spiritualDiagnostics" only (the audited
 * question: "האם קיימת פגיעת כישוף על הנשאלת?"). The shape is intentionally
 * generic/extensible for future topics, but ONLY verified-relevant rules
 * for this one topic are populated — no speculative entries for other
 * topics, per instruction not to invent coverage that wasn't audited.
 *
 * Hard rule carried over from the audit: page 53 (basic witness scheme,
 * houses 13/14/15) and page 101-102 (expanded "partner + testimony"
 * scheme, houses 9/13/14/15/16) are DELIBERATELY kept as two SEPARATE
 * catalog entries with resolutionStatus:"unresolved-source-relationship".
 * They are NOT merged, NOT deduplicated, and neither is chosen over the
 * other. computeWitnessTestimony (kashf-pending-extraction.js) implements
 * ONLY the page-53 scheme — that engine function is UNCHANGED by this file.
 *
 * @typedef {object} KashfBookRule
 * @property {string} ruleKey - stable, source-derived id: {sourceMethodShort}-p{page}-{role}
 * @property {string} ruleCategory - 'verdictFormula'|'supportingCheck'|'foundationalContext'|'witnessScheme'|'generalPrinciple'|'aggregationRule'|'dhamirMethod'
 * @property {'kashf'} sourceMethod
 * @property {string} sourceBook
 * @property {string|number} sourcePage
 * @property {string} sourceSection
 * @property {string} shortSourceReference
 * @property {string[]} appliesToTopics
 * @property {string[]} appliesToQuestionTypes
 * @property {string[]} triggerConditions
 * @property {number[]|null} requiredHouses
 * @property {string[]|null} requiredFigures
 * @property {string} calculationType
 * @property {string} verdictEffect
 * @property {number|null} precedence
 * @property {string|null} conflictHandling
 * @property {string} evidenceRole
 * @property {'implemented'|'missing'|'partiallyImplemented'} implementationStatus
 * @property {string|null} enginePath
 * @property {'verified'|'ambiguous'} confidence
 * @property {string|null} unresolvedReason
 * @property {string|null} [resolutionStatus]
 */

/** @type {KashfBookRule[]} */
export const KASHF_BOOK_RULE_CATALOG = [
  {
    ruleKey: 'kashf-p167-primary-formula-spiritual-sorcery',
    ruleCategory: 'verdictFormula',
    sourceMethod: 'kashf',
    sourceBook: 'כשף אל-אסרר',
    sourcePage: 167,
    sourceSection: 'הפרק הראשון — הנפש — נקודות אחדות',
    shortSourceReference: 'כשף אל-אסרר עמ׳ 167',
    appliesToTopics: ['spiritualDiagnostics'],
    appliesToQuestionTypes: ['spiritual'],
    triggerConditions: ['topicId === "spiritualDiagnostics"'],
    requiredHouses: [1, 4, 6, 15],
    requiredFigures: null,
    calculationType: 'fire-row-assemble + saad-nahs',
    verdictEffect: 'direct-primary',
    precedence: 1,
    conflictHandling: null,
    evidenceRole: 'primaryVerdictSource',
    implementationStatus: 'implemented',
    enginePath: 'kashf-topic-rules.js:105-115; kashf-reading-engine.js:535-543',
    confidence: 'verified',
    unresolvedReason: null,
  },
  {
    ruleKey: 'kashf-p167-alt-formula-hidden-action',
    ruleCategory: 'verdictFormula',
    sourceMethod: 'kashf',
    sourceBook: 'כשף אל-אסרר',
    sourcePage: 167,
    sourceSection: 'הפרק הראשון — הנפש — נקודות אחדות',
    shortSourceReference: 'כשף אל-אסרר עמ׳ 167',
    appliesToTopics: ['spiritualDiagnostics'],
    appliesToQuestionTypes: ['spiritual'],
    triggerConditions: ['topicId === "spiritualDiagnostics"'],
    requiredHouses: [4, 6, 8, 15],
    requiredFigures: null,
    calculationType: 'row-assemble(air) + saad-nahs',
    verdictEffect: 'direct-secondary',
    precedence: 2,
    conflictHandling: null,
    evidenceRole: 'primaryVerdictSource',
    implementationStatus: 'implemented',
    enginePath: 'kashf-topic-rules.js:116-127; kashf-reading-engine.js:549-560',
    confidence: 'verified',
    unresolvedReason: null,
  },
  {
    ruleKey: 'kashf-p166-movement-initiator',
    ruleCategory: 'supportingCheck',
    sourceMethod: 'kashf',
    sourceBook: 'כשף אל-אסרר',
    sourcePage: 166,
    sourceSection: 'פרק כולל לסימנים רבים — והשער השישי',
    shortSourceReference: 'כשף אל-אסרר עמ׳ 166',
    appliesToTopics: ['spiritualDiagnostics'],
    appliesToQuestionTypes: ['spiritual'],
    triggerConditions: ['topicId === "spiritualDiagnostics"'],
    requiredHouses: [4, 7, 13, 14, 15],
    requiredFigures: null,
    calculationType: 'row-assemble(water)-then-combine-dakhal-kharij',
    verdictEffect: 'supporting-only',
    precedence: null,
    conflictHandling: null,
    evidenceRole: 'supportingFinding',
    implementationStatus: 'implemented',
    enginePath: 'kashf-topic-rules.js:128-138 (id: "movement-initiator")',
    confidence: 'verified',
    unresolvedReason: null,
  },
  {
    ruleKey: 'kashf-p49-house6-sorcery-domain',
    ruleCategory: 'foundationalContext',
    sourceMethod: 'kashf',
    sourceBook: 'כשף אל-אסרר',
    sourcePage: 49,
    sourceSection: 'תיאור-יסוד בית 6',
    shortSourceReference: 'כשף אל-אסרר עמ׳ 49',
    appliesToTopics: ['spiritualDiagnostics'],
    appliesToQuestionTypes: ['spiritual'],
    triggerConditions: [],
    requiredHouses: [6],
    requiredFigures: null,
    calculationType: 'none (descriptive domain only)',
    verdictEffect: 'contextual-corroboration-only',
    precedence: null,
    conflictHandling: null,
    evidenceRole: 'contextualCorroboration',
    implementationStatus: 'implemented',
    enginePath: 'house 6 already present in both formulas above; no separate code needed',
    confidence: 'verified',
    unresolvedReason: null,
  },
  {
    ruleKey: 'kashf-p53-witness-scheme-basic',
    ruleCategory: 'witnessScheme',
    sourceMethod: 'kashf',
    sourceBook: 'כשף אל-אסרר',
    sourcePage: 53,
    sourceSection: 'תיאור-יסוד בתים 13-14-15',
    shortSourceReference: 'כשף אל-אסרר עמ׳ 53',
    appliesToTopics: ['spiritualDiagnostics'],
    appliesToQuestionTypes: ['spiritual'],
    triggerConditions: [],
    requiredHouses: [13, 14, 15],
    requiredFigures: null,
    calculationType: 'fixed house-to-house testimony map: 13→[1,9], 14→[5,6,11], 15→[3,7,10,11]',
    verdictEffect: 'undetermined',
    precedence: null,
    conflictHandling: null,
    evidenceRole: 'structuralWitnessData',
    implementationStatus: 'implemented',
    enginePath: 'kashf-pending-extraction.js:1352 (describeWitnessEffect), :1404 (computeWitnessTestimony)',
    confidence: 'verified',
    unresolvedReason: 'Book does not state a mechanical effect on the spiritualDiagnostics verdict specifically; see kashf-p101-witness-scheme-extended for a conflicting-scope scheme.',
    resolutionStatus: 'unresolved-source-relationship',
  },
  {
    ruleKey: 'kashf-p101-witness-scheme-extended',
    ruleCategory: 'witnessScheme',
    sourceMethod: 'kashf',
    sourceBook: 'כשף אל-אסרר',
    sourcePage: '101-102',
    sourceSection: 'פרק בשותף ובעדות',
    shortSourceReference: 'כשף אל-אסרר עמ׳ 101-102',
    appliesToTopics: ['spiritualDiagnostics'],
    appliesToQuestionTypes: ['spiritual'],
    triggerConditions: [],
    requiredHouses: [9, 13, 14, 15, 16],
    requiredFigures: null,
    calculationType: 'partner-pairs (13↔1,14↔7,15↔10,16↔4) + testimony map: 9→[1,5,7], 14→[2,6,10], 15→[3,6,7,11], 16→[4,8,12]',
    verdictEffect: 'undetermined',
    precedence: null,
    conflictHandling: null,
    evidenceRole: 'structuralWitnessData',
    implementationStatus: 'missing',
    enginePath: null,
    confidence: 'verified',
    unresolvedReason: 'Testimony targets for house 14 differ from the page-53 scheme ([2,6,10] vs [5,6,11]); house 9 and 16 are witnesses here but not in the page-53 scheme. No reconciling source text was found. Do NOT implement, merge, or choose between this and kashf-p53-witness-scheme-basic without explicit resolution.',
    resolutionStatus: 'unresolved-source-relationship',
  },
  {
    ruleKey: 'kashf-p101-witness-non-dispensable-principle',
    ruleCategory: 'generalPrinciple',
    sourceMethod: 'kashf',
    sourceBook: 'כשף אל-אסרר',
    sourcePage: '101-102',
    sourceSection: 'פרק בשותף ובעדות',
    shortSourceReference: 'כשף אל-אסרר עמ׳ 101-102',
    appliesToTopics: ['spiritualDiagnostics'],
    appliesToQuestionTypes: ['spiritual'],
    triggerConditions: [],
    requiredHouses: null,
    requiredFigures: null,
    calculationType: 'none (doctrinal statement, no formula)',
    verdictEffect: 'undetermined-general',
    precedence: null,
    conflictHandling: 'תולדה של שתי צורות חלוקות מכריעה — "אל מי שתיטה על פיו תדון" (documented mechanism, but only for the specific case of two disagreeing figures, not stated as universal)',
    evidenceRole: 'generalDoctrine',
    implementationStatus: 'missing',
    enginePath: null,
    confidence: 'verified',
    unresolvedReason: 'Book states witnesses "must not be dispensed with" as a general principle, but does not give a mechanical rule for how this modifies a specific topic-formula verdict (like spiritualDiagnostics primaryFormula/altFormula). Not wired into any engine or prompt logic yet.',
  },
  {
    ruleKey: 'kashf-p155-dhamir-majority-decision',
    ruleCategory: 'aggregationRule',
    sourceMethod: 'kashf',
    sourceBook: 'כשף אל-אסרר',
    sourcePage: 155,
    sourceSection: 'הסוג הרביעי והחמישי — וסיכום חמש הדרכים',
    shortSourceReference: 'כשף אל-אסרר עמ׳ 155',
    appliesToTopics: ['spiritualDiagnostics'],
    appliesToQuestionTypes: ['spiritual'],
    triggerConditions: [],
    requiredHouses: null,
    requiredFigures: null,
    calculationType: 'majority vote across the 5 dhamir types ("ותכריע לפי הרוב")',
    verdictEffect: 'advisor-only (dhamir aggregation, not the topic verdict)',
    precedence: null,
    conflictHandling: null,
    evidenceRole: 'dhamirAggregation',
    implementationStatus: 'implemented',
    enginePath: 'kashf-dhamir.js (computeDhamirByMajority)',
    confidence: 'verified',
    unresolvedReason: null,
  },
];

/**
 * Coverage of the book's own 8 dhamir sub-methods (שער הרביעי, עמ' 151-155
 * — 5 named "types", the first split into 4 "faces" = 8 total). Every entry
 * is real and page-cited; 3 are honestly marked missing/not-implemented —
 * this list must never be summarized as "all dhamir methods verified".
 *
 * @typedef {object} KashfDhamirMethodCoverage
 * @property {string} methodKey
 * @property {string} methodLabelHebrew
 * @property {string|number} sourcePage
 * @property {string} triggerCondition
 * @property {string} calculation
 * @property {string} outputDescription
 * @property {boolean} participatesInVerdict
 * @property {'implemented'|'missing'} implementationStatus
 * @property {string|null} enginePath
 * @property {boolean} sentToAi
 * @property {boolean} sourceEvidenceAvailable
 */

/** @type {KashfDhamirMethodCoverage[]} */
export const KASHF_DHAMIR_METHOD_COVERAGE = [
  {
    methodKey: 'type1-face1-mizan',
    methodLabelHebrew: 'סוג 1, פנים 1 — תנועת האורך (המאזן)',
    sourcePage: '151-152',
    triggerCondition: 'תמיד מחושב (עצמאי-מנושא)',
    calculation: 'נקודת-מאזן → הליכה לאמהות/בנות → שילוב עם נקודה שנייה',
    outputDescription: 'צורה יחידה, חושפת "מחשבת השואל"',
    participatesInVerdict: false,
    implementationStatus: 'implemented',
    enginePath: 'kashf-dhamir.js (candidate: "mizan")',
    sentToAi: true,
    sourceEvidenceAvailable: true,
  },
  {
    methodKey: 'type1-face2-harkat-al-ard',
    methodLabelHebrew: 'סוג 1, פנים 2 — תנועת הרוחב',
    sourcePage: 152,
    triggerCondition: 'תמיד מחושב (עצמאי-מנושא)',
    calculation: 'ספירת-יסודות מבית 15, הובלה בבתים',
    outputDescription: 'צורה/בית, חושפת "מחשבת השואל"',
    participatesInVerdict: false,
    implementationStatus: 'implemented',
    enginePath: 'kashf-dhamir.js (candidate: "harkat-al-ard")',
    sentToAi: true,
    sourceEvidenceAvailable: true,
  },
  {
    methodKey: 'type1-face3-depth-movement',
    methodLabelHebrew: 'סוג 1, פנים 3 — תנועת העומק',
    sourcePage: 152,
    triggerCondition: 'לא מיושם — טרם נבדק תנאי-הפעלה בקוד',
    calculation: 'חשבון תוספת/הפחתה ממקום-הצורה-השמינית עד בית 16',
    outputDescription: 'לא ממומש',
    participatesInVerdict: false,
    implementationStatus: 'missing',
    enginePath: null,
    sentToAi: false,
    sourceEvidenceAvailable: true,
  },
  {
    methodKey: 'type1-face4-jawharayn',
    methodLabelHebrew: 'סוג 1, פנים 4 — חשבון-הפחתה מודולו-12',
    sourcePage: 153,
    triggerCondition: 'תמיד מחושב (עצמאי-מנושא)',
    calculation: 'ספירת נקודות קל+כבד מבתים 1-15, הפחתה מודולו-12',
    outputDescription: 'בית, חושף "מחשבת השואל"',
    participatesInVerdict: false,
    implementationStatus: 'implemented',
    enginePath: 'kashf-dhamir.js (candidate: "jawharayn")',
    sentToAi: true,
    sourceEvidenceAvailable: true,
  },
  {
    methodKey: 'type2-element-prevalence',
    methodLabelHebrew: 'סוג 2 — דומיננטיות-יסוד',
    sourcePage: '153-154, 104-105',
    triggerCondition: 'תמיד מחושב (עצמאי-מנושא)',
    calculation: 'יסוד-דומיננטי בצורת-המאזן, הובלה בבתים',
    outputDescription: 'בית/צורה, חושפת "מחשבת השואל"',
    participatesInVerdict: false,
    implementationStatus: 'implemented',
    enginePath: 'kashf-dhamir.js (candidate: "element-prevalence")',
    sentToAi: true,
    sourceEvidenceAvailable: true,
  },
  {
    methodKey: 'type3-mothers-arithmetic',
    methodLabelHebrew: 'סוג 3 — חשבון-נקודות-אמהות',
    sourcePage: 154,
    triggerCondition: 'לא מיושם',
    calculation: 'ספירת יחידים ב-4 אמהות, ריבוע, הכפלה, חלוקה ל-2',
    outputDescription: 'לא ממומש',
    participatesInVerdict: false,
    implementationStatus: 'missing',
    enginePath: null,
    sentToAi: false,
    sourceEvidenceAvailable: true,
  },
  {
    methodKey: 'type4-opening-abjad',
    methodLabelHebrew: 'סוג 4 — "פתיחה" (ספירה→אות→צורה)',
    sourcePage: '154-155',
    triggerCondition: 'תמיד מחושב (עצמאי-מנושא)',
    calculation: 'ספירת מערך מלא → אות (אבג׳ד) → צורה. מבנה מ-Kashf; כלל-הצמצום המספרי המדויק מהשלמה חיצונית מתועדת (אל-פלק אל-משחון) — הספר עצמו לא נותן דוגמה מספרית.',
    outputDescription: 'צורה/צורות, מתויג isExternalSource+evidenceRole',
    participatesInVerdict: false,
    implementationStatus: 'implemented',
    enginePath: 'kashf-dhamir-type4-external.js (computeDhamirType4External)',
    sentToAi: true,
    sourceEvidenceAvailable: true,
  },
  {
    methodKey: 'type5-circle-closure',
    methodLabelHebrew: 'סוג 5 — הובלת-נקודה עד סגירת-מעגל',
    sourcePage: 155,
    triggerCondition: 'לא מיושם',
    calculation: 'הובלת נקודה חוזרת עד שהיא חוזרת על עצמה/סוגרת מעגל',
    outputDescription: 'לא ממומש',
    participatesInVerdict: false,
    implementationStatus: 'missing',
    enginePath: null,
    sentToAi: false,
    sourceEvidenceAvailable: true,
  },
];

export default { KASHF_BOOK_RULE_CATALOG, KASHF_DHAMIR_METHOD_COVERAGE };
