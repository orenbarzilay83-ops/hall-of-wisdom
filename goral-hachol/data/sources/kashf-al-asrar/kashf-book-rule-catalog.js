/**
 * kashf-book-rule-catalog.js
 *
 * Canonical, source-verified rule catalog extracted from כשף אל-אסרר
 * (kashf-al-asrar-book.js) — built from
 * HALL_WISDOM_KASHF_EXHAUSTIVE_WITNESS_AND_SPIRITUAL_RULES_AUDIT.md, direct
 * re-verification of the raw page-167 source block, and (v3, this round)
 * direct re-verification of ACTUAL RUNTIME EVIDENCE in
 * kashf-reading-engine.js / kashf-narrative-writer.js for every entry —
 * not just its `implementationStatus` claim. Every entry here was read in
 * full page-context before being catalogued; nothing here was invented,
 * paraphrased-with-added-meaning, or merged across ambiguous source
 * passages.
 *
 * Scope of this round: topicId "spiritualDiagnostics" only. No speculative
 * entries for other topics.
 *
 * ── v3 (semantic-correction round): why `runtimeEvidence` exists ──
 * v2 built `ruleCoverageStatus.appliedBookRules` directly from
 * `implementationStatus === 'implemented'`. That conflates two genuinely
 * different facts: "this rule has code" vs "this rule's result actually
 * participated in a finding/decision of THIS reading". Concretely, that
 * conflation caused `kashf-p49-house6-sorcery-domain` to be reported as
 * "applied" even though there is NO independent runtime object for house 6
 * alone anywhere in kashf-reading-engine.js — it is only ever one of four
 * houses folded into primaryFormula/altFormula's own computed figure.
 *
 * `runtimeEvidence` on every entry below records what was directly
 * verified by reading kashf-reading-engine.js (which fields get computed,
 * on every call, unconditionally) and kashf-narrative-writer.js (which
 * fields actually reach a rendered professional/client finding, and which
 * are gated behind a visibility flag or never rendered at all). The
 * selector (kashf-book-rule-selector.js v3) computes `evaluatedRules` and
 * `appliedBookRules` FROM this field, never from `implementationStatus`
 * alone — see that file's header comment for the exact bucket logic.
 *
 * ── Five distinct witness systems (unchanged from v2, still never merged) ──
 * A=p.41 (six pillars), B=p.45 (trine), C=p.53 (basic house-testimony,
 * IMPLEMENTED), D=p.101-102 (extended house-testimony, NOT implemented),
 * E=p.130-131 (five-witnesses scoring technique). C and D are explicitly
 * kept as two SEPARATE catalog entries with
 * resolutionStatus:"unresolvedSourceRelationship" — neither merged nor
 * chosen over the other. `computeWitnessTestimony` (kashf-pending-
 * extraction.js) implements ONLY the page-53 scheme — untouched by this
 * file. Per this round's correction: C's resolutionStatus staying
 * "unresolvedSourceRelationship" does NOT prevent it from being
 * genuinely `evaluated`+`applied` in the selector — that is an
 * orthogonal, independently-verified runtime fact (see its
 * `runtimeEvidence` below). D has resolutionStatus:"unresolvedSourceRelationship"
 * AND implementationStatus:"missing" AND no runtimeEvidence — it can never
 * appear in `appliedBookRules`.
 *
 * ── connection-type-by-element / matter-true-and-directed-at-me (v3 correction) ──
 * v2 marked these `applicabilityStatus:"conditionallyRelevant"` and
 * counted them in `missingRelevantRules`. On review: their ONLY evidence
 * of relevance to spiritualDiagnostics specifically is that they share a
 * page with primaryFormula/altFormula — the book itself does not label
 * either as sorcery-specific (unlike primaryFormula/altFormula, which are
 * explicitly framed as "האם השואל עושה כישוף"/"האם יש פעולה מאחורי
 * הדבר"). Page-adjacency alone is not proof of topical relevance.
 * `applicabilityStatus` is corrected to `"unresolved"` for both, and the
 * selector routes them to `unresolvedApplicabilityRules`, not
 * `missingVerifiedRelevantRules` — being "clearly worded in the source"
 * (resolutionStatus stays "resolved") is a different fact from "proven
 * relevant to this exact topic" (applicabilityStatus).
 *
 * @typedef {object} KashfRuleRuntimeEvidence
 * @property {boolean} evaluated - true only if directly confirmed that the engine computes this rule's own result on every relevant call (not merely referenced inside another rule's computation)
 * @property {string|null} engineOutputPath - exact field path + engine file/line where the computation happens, or null if none exists
 * @property {boolean} resultConfirmedNonError - true if a real run was inspected and returned a non-error result (not just that the code exists)
 * @property {boolean} feedsOverallPositive - true only if this rule's result is read into reading.overallPositive
 * @property {boolean} feedsNarrativeOrProfessionalFinding - true if this rule's result reaches a rendered client narrative section OR is present as a distinct professional/advisor finding in the AI-safe engineOutput, independent of feedsOverallPositive
 * @property {string} evidenceNote - human-readable citation of exactly what was checked
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
 * @property {'implemented'|'partiallyImplemented'|'missing'} implementationStatus
 * @property {string|null} enginePath
 * @property {'verified'|'ambiguous'} confidence
 * @property {string|null} unresolvedReason
 * @property {'verified-exact-quote'|'verified-page-attribution-discrepancy'} sourceVerificationStatus
 * @property {'verifiedRelevant'|'conditionallyRelevant'|'generalRule'|'unrelatedToCurrentQuestion'|'unresolved'} applicabilityStatus
 * @property {'resolved'|'unresolvedSourceRelationship'|'requiresFullContextReview'} resolutionStatus
 * @property {KashfRuleRuntimeEvidence} runtimeEvidence
 */

export const KASHF_BOOK_RULE_CATALOG_VERSION = 'kashf-book-rule-catalog-v3';

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
    sourceVerificationStatus: 'verified-exact-quote',
    applicabilityStatus: 'verifiedRelevant',
    resolutionStatus: 'resolved',
    runtimeEvidence: {
      evaluated: true,
      engineOutputPath: 'reading.primaryFormula.result / reading.primaryFormula.verdict (kashf-reading-engine.js:535-538, executeFormula)',
      resultConfirmedNonError: true,
      feedsOverallPositive: true,
      feedsNarrativeOrProfessionalFinding: true,
      evidenceNote: 'executeFormula() runs on every call; verdict.positive is copied verbatim into reading.overallPositive (kashf-reading-engine.js:682); rendered to the client via writeVerdictPara() (kashf-narrative-writer.js:174-193, called unconditionally).',
    },
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
    sourceVerificationStatus: 'verified-exact-quote',
    applicabilityStatus: 'verifiedRelevant',
    resolutionStatus: 'resolved',
    runtimeEvidence: {
      evaluated: true,
      engineOutputPath: 'reading.altFormula.result / reading.altFormula.verdict (kashf-reading-engine.js:551-553, executeFormula)',
      resultConfirmedNonError: true,
      feedsOverallPositive: false,
      feedsNarrativeOrProfessionalFinding: true,
      evidenceNote: 'executeFormula() runs on every call; its own verdict is a real, independent finding rendered via writeAltPara() (kashf-narrative-writer.js:195-209). reading.overallPositive (line 682) is wired only to primaryVerdict — an engine implementation choice, not a book-stated precedence between the two formulas (the book presents both as parallel "כלל מעשי" entries, not ranked).',
    },
  },
  {
    ruleKey: 'kashf-p166-movement-initiator',
    ruleCategory: 'supportingCheck',
    sourceMethod: 'kashf',
    sourceBook: 'כשף אל-אסרר',
    sourcePage: '166-167',
    sourceSection: 'פרק כולל לסימנים רבים — והשער השישי / הפרק הראשון — הנפש — נקודות אחדות',
    shortSourceReference: 'כשף אל-אסרר עמ׳ 166-167 (ראה שדה sourceVerificationStatus)',
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
    sourceVerificationStatus: 'verified-page-attribution-discrepancy',
    applicabilityStatus: 'verifiedRelevant',
    resolutionStatus: 'resolved',
    runtimeEvidence: {
      evaluated: true,
      engineOutputPath: 'reading.supportingFindings[0] (kashf-reading-engine.js:563-569, runSupportingCheck)',
      resultConfirmedNonError: true,
      feedsOverallPositive: false,
      feedsNarrativeOrProfessionalFinding: true,
      evidenceNote: 'runSupportingCheck() runs on every call for this topic (rules.supportingChecks has exactly one entry: "movement-initiator"); result rendered via writeSupportingPara() (kashf-narrative-writer.js:279-290, called unconditionally).',
    },
  },
  {
    ruleKey: 'kashf-p167-connection-type-by-element',
    ruleCategory: 'supportingCheck',
    sourceMethod: 'kashf',
    sourceBook: 'כשף אל-אסרר',
    sourcePage: 167,
    sourceSection: 'הפרק הראשון — הנפש — נקודות אחדות',
    shortSourceReference: 'כשף אל-אסרר עמ׳ 167',
    appliesToTopics: ['spiritualDiagnostics'],
    appliesToQuestionTypes: ['spiritual'],
    triggerConditions: [],
    requiredHouses: [4, 7, 13, 14, 15],
    requiredFigures: null,
    calculationType: 'element-openness of the movement-initiator figure: fire-only → connection-by-sight; fire+air → sight+speech; fire+air+water → full connection',
    verdictEffect: 'undetermined',
    precedence: null,
    conflictHandling: null,
    evidenceRole: 'supportingFinding',
    implementationStatus: 'missing',
    enginePath: null,
    confidence: 'verified',
    unresolvedReason: 'Immediately follows the movement-initiator figure in the source ("לפי שיעור היסודות שבה יהיה החיבור..."), read from the same page-167 book paragraph. Not yet wired into kashf-topic-rules.js. The ONLY evidence tying it to spiritualDiagnostics specifically is page-adjacency to primaryFormula/altFormula — the book does not itself label this paragraph as sorcery-specific, unlike those two. Relevance to this exact topic is therefore unresolved, not merely "not yet coded".',
    sourceVerificationStatus: 'verified-exact-quote',
    applicabilityStatus: 'unresolved',
    resolutionStatus: 'resolved',
    runtimeEvidence: {
      evaluated: false,
      engineOutputPath: null,
      resultConfirmedNonError: false,
      feedsOverallPositive: false,
      feedsNarrativeOrProfessionalFinding: false,
      evidenceNote: 'Not implemented anywhere in kashf-topic-rules.js or kashf-reading-engine.js — no computation exists to evaluate.',
    },
  },
  {
    ruleKey: 'kashf-p167-matter-true-and-directed-at-me',
    ruleCategory: 'supportingCheck',
    sourceMethod: 'kashf',
    sourceBook: 'כשף אל-אסרר',
    sourcePage: 167,
    sourceSection: 'הפרק הראשון — הנפש — נקודות אחדות',
    shortSourceReference: 'כשף אל-אסרר עמ׳ 167',
    appliesToTopics: ['spiritualDiagnostics'],
    appliesToQuestionTypes: ['spiritual'],
    triggerConditions: [],
    requiredHouses: [1, 4, 7, 10],
    requiredFigures: null,
    calculationType: 'fire(1)+air(4)+water(7)+earth(10) row-assemble; if water row open in result → "הדבר יתקיים"',
    verdictEffect: 'undetermined',
    precedence: null,
    conflictHandling: null,
    evidenceRole: 'supportingFinding',
    implementationStatus: 'missing',
    enginePath: null,
    confidence: 'verified',
    unresolvedReason: 'Distinct "כלל מעשי" on the same page-167 block ("האם העניין נכון ומכוון לי"), quoted in full. Not yet wired into kashf-topic-rules.js. Like connection-type-by-element, the ONLY evidence tying it to spiritualDiagnostics is page-adjacency — the book does not frame it as sorcery-specific. Relevance to this exact topic is unresolved.',
    sourceVerificationStatus: 'verified-exact-quote',
    applicabilityStatus: 'unresolved',
    resolutionStatus: 'resolved',
    runtimeEvidence: {
      evaluated: false,
      engineOutputPath: null,
      resultConfirmedNonError: false,
      feedsOverallPositive: false,
      feedsNarrativeOrProfessionalFinding: false,
      evidenceNote: 'Not implemented anywhere in kashf-topic-rules.js or kashf-reading-engine.js — no computation exists to evaluate.',
    },
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
    sourceVerificationStatus: 'verified-exact-quote',
    applicabilityStatus: 'verifiedRelevant',
    resolutionStatus: 'resolved',
    runtimeEvidence: {
      evaluated: false,
      engineOutputPath: null,
      resultConfirmedNonError: false,
      feedsOverallPositive: false,
      feedsNarrativeOrProfessionalFinding: false,
      evidenceNote: 'No independent computation exists for house 6 alone — house 6 is only ever one of four houses folded into primaryFormula\'s/altFormula\'s OWN computed figure (kashf-reading-engine.js:535,551). There is no separate runtime object to point to, so this rule cannot be verified as independently evaluated or applied, despite implementationStatus:"implemented" (the house-number literally appears in two implemented formulas). Correctly excluded from appliedBookRules this round — see implementedAvailableRules.',
    },
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
    unresolvedReason: 'Book does not state a mechanical effect on the spiritualDiagnostics verdict specifically; see kashf-p101-witness-scheme-extended for a conflicting-scope scheme (audit "מערכת C" vs "מערכת D"). This resolutionStatus describes the RELATIONSHIP between the two witness schemes, and is independent of — does not override — the runtimeEvidence below, which confirms this scheme genuinely runs and reaches a rendered finding today.',
    sourceVerificationStatus: 'verified-exact-quote',
    applicabilityStatus: 'unresolved',
    resolutionStatus: 'unresolvedSourceRelationship',
    runtimeEvidence: {
      evaluated: true,
      engineOutputPath: 'reading.witnessTestimony (kashf-reading-engine.js:625-630, computeWitnessTestimony)',
      resultConfirmedNonError: true,
      feedsOverallPositive: false,
      feedsNarrativeOrProfessionalFinding: true,
      evidenceNote: 'computeWitnessTestimony() runs on every call — spiritualDiagnostics\' own keyHouses list includes 13/14/15, so keyHouseReadings always has h13/h14/h15 present; result unconditionally rendered via writeWitnessJudgePara() (kashf-narrative-writer.js:372-421, called unconditionally at line 713 — NOT gated by any visibility flag, unlike dhamir). This operational fact is independent of, and does not resolve or replace, kashf-p101-witness-scheme-extended.',
    },
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
    unresolvedReason: 'Testimony targets for house 14 differ from the page-53 scheme ([2,6,10] vs [5,6,11]); house 9 and 16 are witnesses here but not in the page-53 scheme (audit "מערכת D" vs "מערכת C"). No reconciling source text was found. Do NOT implement, merge, or choose between this and kashf-p53-witness-scheme-basic without explicit resolution. This entry has no runtime evidence whatsoever — it can never appear in appliedBookRules.',
    sourceVerificationStatus: 'verified-exact-quote',
    applicabilityStatus: 'unresolved',
    resolutionStatus: 'unresolvedSourceRelationship',
    runtimeEvidence: {
      evaluated: false,
      engineOutputPath: null,
      resultConfirmedNonError: false,
      feedsOverallPositive: false,
      feedsNarrativeOrProfessionalFinding: false,
      evidenceNote: 'No engine function implements this scheme — confirmed absent from kashf-reading-engine.js, kashf-pending-extraction.js, and kashf-narrative-writer.js. Never evaluated, never applied.',
    },
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
    sourceVerificationStatus: 'verified-exact-quote',
    applicabilityStatus: 'generalRule',
    resolutionStatus: 'requiresFullContextReview',
    runtimeEvidence: {
      evaluated: false,
      engineOutputPath: null,
      resultConfirmedNonError: false,
      feedsOverallPositive: false,
      feedsNarrativeOrProfessionalFinding: false,
      evidenceNote: 'Doctrinal statement only, no formula exists to implement or evaluate.',
    },
  },
  {
    ruleKey: 'kashf-p41-six-pillars-witnesses-general',
    ruleCategory: 'generalPrinciple',
    sourceMethod: 'kashf',
    sourceBook: 'כשף אל-אסרר',
    sourcePage: 41,
    sourceSection: 'יסודות הדין (שישה יסודות כלליים)',
    shortSourceReference: 'כשף אל-אסרר עמ׳ 41',
    appliesToTopics: ['spiritualDiagnostics'],
    appliesToQuestionTypes: ['spiritual'],
    triggerConditions: [],
    requiredHouses: null,
    requiredFigures: null,
    calculationType: 'none (framework declaration only — no mechanism given on this page)',
    verdictEffect: 'undetermined-general',
    precedence: null,
    conflictHandling: null,
    evidenceRole: 'generalDoctrine',
    implementationStatus: 'missing',
    enginePath: null,
    confidence: 'verified',
    unresolvedReason: 'Audit "מערכת A": "עדים" is named as the second of six general pillars of judgment in the whole book. No mechanical rule accompanies this declaration on this page. Distinct from the house-testimony schemes (C/D) and from the trine (B) and scoring (E) systems — kept as its own separate entry.',
    sourceVerificationStatus: 'verified-exact-quote',
    applicabilityStatus: 'generalRule',
    resolutionStatus: 'requiresFullContextReview',
    runtimeEvidence: {
      evaluated: false,
      engineOutputPath: null,
      resultConfirmedNonError: false,
      feedsOverallPositive: false,
      feedsNarrativeOrProfessionalFinding: false,
      evidenceNote: 'Framework declaration only, no formula exists to implement or evaluate.',
    },
  },
  {
    ruleKey: 'kashf-p45-trine-witness-scheme',
    ruleCategory: 'witnessScheme',
    sourceMethod: 'kashf',
    sourceBook: 'כשף אל-אסרר',
    sourcePage: 45,
    sourceSection: 'השילוש (Trine)',
    shortSourceReference: 'כשף אל-אסרר עמ׳ 45',
    appliesToTopics: ['spiritualDiagnostics'],
    appliesToQuestionTypes: ['spiritual'],
    triggerConditions: [],
    requiredHouses: [1, 3, 5, 7, 9, 11],
    requiredFigures: null,
    calculationType: 'geometric trine relationship between houses 1-3-5-7-9-11 — named "עדים" in the source, but no house-to-house testimony targets given here (unlike C/D)',
    verdictEffect: 'undetermined',
    precedence: null,
    conflictHandling: null,
    evidenceRole: 'structuralWitnessData',
    implementationStatus: 'missing',
    enginePath: null,
    confidence: 'verified',
    unresolvedReason: 'Audit "מערכת B": defines which houses stand in trine relationship and calls that relationship "עדים", but does not specify who-testifies-to-whom the way C/D do — a geometric definition, not a testimony map. Completely distinct from house 13/14/15/16-based schemes; not merged with them.',
    sourceVerificationStatus: 'verified-exact-quote',
    applicabilityStatus: 'unresolved',
    resolutionStatus: 'requiresFullContextReview',
    runtimeEvidence: {
      evaluated: false,
      engineOutputPath: null,
      resultConfirmedNonError: false,
      feedsOverallPositive: false,
      feedsNarrativeOrProfessionalFinding: false,
      evidenceNote: 'Geometric definition only, no formula exists to implement or evaluate.',
    },
  },
  {
    ruleKey: 'kashf-p130-five-witnesses-scoring-technique',
    ruleCategory: 'witnessScheme',
    sourceMethod: 'kashf',
    sourceBook: 'כשף אל-אסרר',
    sourcePage: '130-131',
    sourceSection: 'השלמת חמשת העדים וטענת בעלי הטבעים',
    shortSourceReference: 'כשף אל-אסרר עמ׳ 130-131',
    appliesToTopics: ['spiritualDiagnostics'],
    appliesToQuestionTypes: ['spiritual'],
    triggerConditions: [],
    requiredHouses: null,
    requiredFigures: null,
    calculationType: 'classical dignity-strength point scoring (5 cumulative confirmation tiers — "עד ראשון/שני/שלישי/רביעי/חמישי"), NOT a house-testimony map. No board house numbers used.',
    verdictEffect: 'undetermined',
    precedence: null,
    conflictHandling: null,
    evidenceRole: 'structuralWitnessData',
    implementationStatus: 'missing',
    enginePath: null,
    confidence: 'verified',
    unresolvedReason: 'Audit "מערכת E": "עד" here means a cumulative numeric-strength confirmation layer in a degree/dignity-based scoring technique, unrelated in mechanism to houses 13-16. Deliberately kept separate from A/B/C/D — never conflated with house-witness testimony despite sharing the word "עדים".',
    sourceVerificationStatus: 'verified-exact-quote',
    applicabilityStatus: 'unresolved',
    resolutionStatus: 'requiresFullContextReview',
    runtimeEvidence: {
      evaluated: false,
      engineOutputPath: null,
      resultConfirmedNonError: false,
      feedsOverallPositive: false,
      feedsNarrativeOrProfessionalFinding: false,
      evidenceNote: 'Scoring technique only, no formula exists to implement or evaluate.',
    },
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
    sourceVerificationStatus: 'verified-exact-quote',
    applicabilityStatus: 'generalRule',
    resolutionStatus: 'resolved',
    runtimeEvidence: {
      evaluated: true,
      engineOutputPath: 'reading.dhamir.winner / reading.dhamir.candidates (kashf-reading-engine.js:588-591, computeDhamirByMajority)',
      resultConfirmedNonError: true,
      feedsOverallPositive: false,
      feedsNarrativeOrProfessionalFinding: true,
      evidenceNote: 'computeDhamirByMajority() runs on every call, selecting reading.dhamir.winner from the 4 currently-implemented candidates. Rendered to the client via writeDhamirPara() only when a visibility flag (dhamirVisibility.showToClient) allows it (kashf-narrative-writer.js:323-364, gated at line 712) — but the raw candidates+winner object is always present in engineOutput and in the AI-safe payload regardless of that client-display gate, which is why this still counts as a genuine professional/advisor finding.',
    },
  },
];

/**
 * Coverage of the book's own 8 dhamir sub-methods (שער הרביעי, עמ' 151-155
 * — 5 named "types", the first split into 4 "faces" = 8 total). Every entry
 * is real and page-cited. `runtimeEvidence` (v3, new) records exactly what
 * was directly confirmed in kashf-reading-engine.js/kashf-dhamir.js —
 * being "topic-independent" per the book does NOT mean all 8 run together
 * on every reading; only the 5 genuinely-coded ones (mizan, harkat-al-ard,
 * jawharayn, element-prevalence, type4-opening-abjad) do. This list must
 * never be summarized as "all dhamir methods verified" or "applied".
 *
 * @typedef {object} KashfDhamirMethodCoverage
 * @property {string} methodKey
 * @property {string} methodLabelHebrew
 * @property {string|number} sourcePage
 * @property {string} triggerCondition
 * @property {string} calculation
 * @property {string} verdictRole
 * @property {boolean} participatesInVerdict
 * @property {'implemented'|'missing'} implementationStatus
 * @property {string|null} enginePath
 * @property {boolean} sourceEvidenceAvailable
 * @property {boolean} sentToAi
 * @property {boolean} applicableToSpiritualDiagnostics
 * @property {string} notes
 * @property {KashfRuleRuntimeEvidence} runtimeEvidence
 */

/** @type {KashfDhamirMethodCoverage[]} */
export const KASHF_DHAMIR_METHOD_COVERAGE = [
  {
    methodKey: 'type1-face1-mizan',
    methodLabelHebrew: 'סוג 1, פנים 1 — תנועת האורך (המאזן)',
    sourcePage: '151-152',
    triggerCondition: 'תמיד מחושב (עצמאי-מנושא)',
    calculation: 'נקודת-מאזן → הליכה לאמהות/בנות → שילוב עם נקודה שנייה',
    verdictRole: 'advisor-only — dhamir is source-declared topic-independent (עמ׳ 155), never a verdict input',
    participatesInVerdict: false,
    implementationStatus: 'implemented',
    enginePath: 'kashf-dhamir.js (candidate: "mizan")',
    sourceEvidenceAvailable: true,
    sentToAi: true,
    applicableToSpiritualDiagnostics: true,
    notes: 'Output: single figure, reveals "מחשבת השואל" (the querent\'s hidden intent).',
    runtimeEvidence: {
      evaluated: true,
      engineOutputPath: 'reading.dhamir.candidates[] (method:"mizan") (kashf-reading-engine.js:589, computeDhamirByMajority)',
      resultConfirmedNonError: true,
      feedsOverallPositive: false,
      feedsNarrativeOrProfessionalFinding: true,
      evidenceNote: 'Confirmed present with real computed pattern/houseNumber in a live buildKashfReading() call. Always present in engineOutput.dhamir.candidates regardless of client narrative visibility gating.',
    },
  },
  {
    methodKey: 'type1-face2-harkat-al-ard',
    methodLabelHebrew: 'סוג 1, פנים 2 — תנועת הרוחב',
    sourcePage: 152,
    triggerCondition: 'תמיד מחושב (עצמאי-מנושא)',
    calculation: 'ספירת-יסודות מבית 15, הובלה בבתים',
    verdictRole: 'advisor-only — dhamir is source-declared topic-independent (עמ׳ 155), never a verdict input',
    participatesInVerdict: false,
    implementationStatus: 'implemented',
    enginePath: 'kashf-dhamir.js (candidate: "harkat-al-ard")',
    sourceEvidenceAvailable: true,
    sentToAi: true,
    applicableToSpiritualDiagnostics: true,
    notes: 'Output: figure/house, reveals "מחשבת השואל".',
    runtimeEvidence: {
      evaluated: true,
      engineOutputPath: 'reading.dhamir.candidates[] (method:"harkat-al-ard") (kashf-reading-engine.js:589, computeDhamirByMajority)',
      resultConfirmedNonError: true,
      feedsOverallPositive: false,
      feedsNarrativeOrProfessionalFinding: true,
      evidenceNote: 'Confirmed present with real computed pattern/houseNumber/dotCount in a live buildKashfReading() call.',
    },
  },
  {
    methodKey: 'type1-face3-depth-movement',
    methodLabelHebrew: 'סוג 1, פנים 3 — תנועת העומק',
    sourcePage: 152,
    triggerCondition: 'לא מיושם — טרם נבדק תנאי-הפעלה בקוד',
    calculation: 'חשבון תוספת/הפחתה ממקום-הצורה-השמינית עד בית 16',
    verdictRole: 'advisor-only if implemented — dhamir is source-declared topic-independent, never a verdict input',
    participatesInVerdict: false,
    implementationStatus: 'missing',
    enginePath: null,
    sourceEvidenceAvailable: true,
    sentToAi: false,
    applicableToSpiritualDiagnostics: true,
    notes: 'Not implemented. Never sent to AI, never claimed as executed.',
    runtimeEvidence: {
      evaluated: false,
      engineOutputPath: null,
      resultConfirmedNonError: false,
      feedsOverallPositive: false,
      feedsNarrativeOrProfessionalFinding: false,
      evidenceNote: 'Confirmed absent from reading.dhamir.candidates in a live buildKashfReading() call (only 4 candidates present: mizan, harkat-al-ard, jawharayn, element-prevalence).',
    },
  },
  {
    methodKey: 'type1-face4-jawharayn',
    methodLabelHebrew: 'סוג 1, פנים 4 — חשבון-הפחתה מודולו-12',
    sourcePage: 153,
    triggerCondition: 'תמיד מחושב (עצמאי-מנושא)',
    calculation: 'ספירת נקודות קל+כבד מבתים 1-15, הפחתה מודולו-12',
    verdictRole: 'advisor-only — dhamir is source-declared topic-independent (עמ׳ 155), never a verdict input',
    participatesInVerdict: false,
    implementationStatus: 'implemented',
    enginePath: 'kashf-dhamir.js (candidate: "jawharayn")',
    sourceEvidenceAvailable: true,
    sentToAi: true,
    applicableToSpiritualDiagnostics: true,
    notes: 'Output: house, reveals "מחשבת השואל".',
    runtimeEvidence: {
      evaluated: true,
      engineOutputPath: 'reading.dhamir.candidates[] (method:"jawharayn") (kashf-reading-engine.js:589, computeDhamirByMajority)',
      resultConfirmedNonError: true,
      feedsOverallPositive: false,
      feedsNarrativeOrProfessionalFinding: true,
      evidenceNote: 'Confirmed present with real computed pattern/houseNumber/totalDots/landedHouse in a live buildKashfReading() call.',
    },
  },
  {
    methodKey: 'type2-element-prevalence',
    methodLabelHebrew: 'סוג 2 — דומיננטיות-יסוד',
    sourcePage: '153-154, 104-105',
    triggerCondition: 'תמיד מחושב (עצמאי-מנושא)',
    calculation: 'יסוד-דומיננטי בצורת-המאזן, הובלה בבתים',
    verdictRole: 'advisor-only — dhamir is source-declared topic-independent (עמ׳ 155), never a verdict input',
    participatesInVerdict: false,
    implementationStatus: 'implemented',
    enginePath: 'kashf-dhamir.js (candidate: "element-prevalence")',
    sourceEvidenceAvailable: true,
    sentToAi: true,
    applicableToSpiritualDiagnostics: true,
    notes: 'Output: house/figure, reveals "מחשבת השואל".',
    runtimeEvidence: {
      evaluated: true,
      engineOutputPath: 'reading.dhamir.candidates[] (method:"element-prevalence") (kashf-reading-engine.js:589, computeDhamirByMajority)',
      resultConfirmedNonError: true,
      feedsOverallPositive: false,
      feedsNarrativeOrProfessionalFinding: true,
      evidenceNote: 'Confirmed present with real computed prevailingElement/walkValue/pattern/landedHouse in a live buildKashfReading() call.',
    },
  },
  {
    methodKey: 'type3-mothers-arithmetic',
    methodLabelHebrew: 'סוג 3 — חשבון-נקודות-אמהות',
    sourcePage: 154,
    triggerCondition: 'לא מיושם',
    calculation: 'ספירת יחידים ב-4 אמהות, ריבוע, הכפלה, חלוקה ל-2',
    verdictRole: 'advisor-only if implemented — dhamir is source-declared topic-independent, never a verdict input',
    participatesInVerdict: false,
    implementationStatus: 'missing',
    enginePath: null,
    sourceEvidenceAvailable: true,
    sentToAi: false,
    applicableToSpiritualDiagnostics: true,
    notes: 'Not implemented. Never sent to AI, never claimed as executed.',
    runtimeEvidence: {
      evaluated: false,
      engineOutputPath: null,
      resultConfirmedNonError: false,
      feedsOverallPositive: false,
      feedsNarrativeOrProfessionalFinding: false,
      evidenceNote: 'Confirmed absent from reading.dhamir.candidates in a live buildKashfReading() call.',
    },
  },
  {
    methodKey: 'type4-opening-abjad',
    methodLabelHebrew: 'סוג 4 — "פתיחה" (ספירה→אות→צורה)',
    sourcePage: '154-155',
    triggerCondition: 'תמיד מחושב (עצמאי-מנושא)',
    calculation: 'ספירת מערך מלא → אות (אבג׳ד) → צורה. מבנה מ-Kashf; כלל-הצמצום המספרי המדויק מהשלמה חיצונית מתועדת (אל-פלק אל-משחון) — הספר עצמו לא נותן דוגמה מספרית.',
    verdictRole: 'advisor-only — additionally tagged evidenceRole:"externalSupplementalAdvisorOnly" at the AI-projection layer because part of the numeric reduction rule is externally-sourced',
    participatesInVerdict: false,
    implementationStatus: 'implemented',
    enginePath: 'kashf-dhamir-type4-external.js (computeDhamirType4External)',
    sourceEvidenceAvailable: true,
    sentToAi: true,
    applicableToSpiritualDiagnostics: true,
    notes: 'Output: figure/figures, self-discloses isExternalSource + sourceBook + disclosureHebrew.',
    runtimeEvidence: {
      evaluated: true,
      engineOutputPath: 'reading.dhamirType4External (kashf-reading-engine.js:598-600, computeDhamirType4External)',
      resultConfirmedNonError: true,
      feedsOverallPositive: false,
      feedsNarrativeOrProfessionalFinding: true,
      evidenceNote: 'Confirmed present with real computed totalPoints/isExternalSource/disclosureHebrew in a live buildKashfReading() call. Per kashf-narrative-writer.js\'s own code comment (~line 361-363): explicitly NOT rendered in the client-facing narrative HTML ("אינו מוצג בקריאה... נשאר זמין לשימוש פנימי בלבד"). Still counted as a professional/advisor finding because it is genuinely computed and present in the AI-safe engineOutput with evidenceRole:"externalSupplementalAdvisorOnly" — a distinct advisor-facing finding by design, just never client-rendered.',
    },
  },
  {
    methodKey: 'type5-circle-closure',
    methodLabelHebrew: 'סוג 5 — הובלת-נקודה עד סגירת-מעגל',
    sourcePage: 155,
    triggerCondition: 'לא מיושם',
    calculation: 'הובלת נקודה חוזרת עד שהיא חוזרת על עצמה/סוגרת מעגל',
    verdictRole: 'advisor-only if implemented — dhamir is source-declared topic-independent, never a verdict input',
    participatesInVerdict: false,
    implementationStatus: 'missing',
    enginePath: null,
    sourceEvidenceAvailable: true,
    sentToAi: false,
    applicableToSpiritualDiagnostics: true,
    notes: 'Not implemented. Never sent to AI, never claimed as executed.',
    runtimeEvidence: {
      evaluated: false,
      engineOutputPath: null,
      resultConfirmedNonError: false,
      feedsOverallPositive: false,
      feedsNarrativeOrProfessionalFinding: false,
      evidenceNote: 'Confirmed absent from reading.dhamir.candidates in a live buildKashfReading() call.',
    },
  },
];

export default { KASHF_BOOK_RULE_CATALOG, KASHF_BOOK_RULE_CATALOG_VERSION, KASHF_DHAMIR_METHOD_COVERAGE };
