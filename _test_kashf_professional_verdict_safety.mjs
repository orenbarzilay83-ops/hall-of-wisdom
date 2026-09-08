import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { buildKashfCanonicalAiBridge } from './goral-hachol/intelligence/kashf-canonical-ai-bridge.js';
import { buildKashfAiContextPackage } from './goral-hachol/intelligence/kashf-ai-context-builder.js';
import {
  buildKashfProfessionalVerdictSafety,
  KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION,
  KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS,
} from './goral-hachol/intelligence/kashf-professional-verdict-safety.js';
import {
  validateKashfAdvisorOutput,
  validateKashfAdvisorVerdictAlignment,
} from './supabase/functions/oren-smart-advisor/oren-smart-advisor-brain-tool-schema.ts';
import { sanitizeKashfReadingPayloadForAi } from './supabase/functions/oren-smart-advisor/kashf_reading_payload_sanitizer.ts';

let passed = 0;
let failed = 0;
function assert(condition, message) {
  if (condition) {
    passed++;
    console.log('✓ ' + message);
  } else {
    failed++;
    console.error('✗ ' + message);
  }
}

const METHOD = 'marriage.p210.generalMarriageH1H2H7H8H10Judge';
const DISSOLUTION = 'marriage.p211.dissolutionH7StateMatrix';
const MOTHERS = ['1222', '1211', '1221', '1112'];
const QUESTION = 'האם הקשר עם הגבר שאני יוצאת איתו יצליח והאם כדאי להתקדם איתו לכיוון חתונה?';

console.log('\n--- Professional Verdict Safety: real marriage case ---');

const board = buildRamlBoardFromMothers(MOTHERS);
const bridge = buildKashfCanonicalAiBridge({
  questionId: 'q-marriage-fit',
  questionText: QUESTION,
  board,
});

assert(bridge.resolution.kashfMethodId === METHOD, 'real question route selects only p210 general-marriage method');
assert(bridge.canonicalReading?.valid === true, 'p210 canonical reading is valid');
assert(bridge.canonicalReading?.overallPositive === true, 'p210 deterministic verdict is positive');
assert(bridge.canonicalReading?.verdict?.positive === true, 'p210 verdict object preserves positive polarity');

const executor = bridge.canonicalReading?.primaryFormula?.result?.executorResult || null;
assert(executor?.finalPattern === '2111', 'real board H1+H5 derives 2111 (סף נכנס)');
assert(executor?.finalOutcome === 'good', 'p210 source derivation classifies the final branch as good');
assert(Array.isArray(executor?.housesUsed) && !executor.housesUsed.includes(16), 'H16 is not part of the p210 executor');
assert(executor?.houseResults?.find((x) => x.houseNumber === 15)?.pattern === '1221', 'H15 is indeed 1221 (סוהר) in the real case');
assert(!bridge.canonicalReading?.canonicalExecution?.methodsExecuted?.includes(DISSOLUTION), 'p211 dissolution method is not silently executed inside p210');

const safety = bridge.professionalVerdictSafety;
assert(safety?.policyVersion === KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION, 'bridge carries the professional verdict safety policy version');
assert(safety?.isSafe === true, 'real p210 reading passes deterministic professional safety prerequisites');
assert(safety?.authoritativePolarity === 'positive', 'safety gate locks authoritative polarity to positive');
assert(safety?.binaryClientVerdictAllowed === true, 'positive binary client verdict is allowed because the engine itself is binary');
assert(safety?.noInverseRule === true && safety?.noUnstatedAggregation === true, 'safety contract forbids invented inverse rules and unstated aggregation');
assert(safety?.genericFigureMetadataRole === 'context-only-never-overrides-verdict', 'generic figure metadata is explicitly context-only');
assert(safety?.forbiddenVerdictSources?.some((x) => x.includes('H16')), 'p210 safety contract explicitly forbids H16 as a verdict source');
assert(safety?.methodSpecificPolicy?.forbiddenInversions?.some((x) => x.includes('H15')), 'p210 contract records that non-benefic H15 cannot be inverted into a bad outcome');
assert(safety?.doNotMixWith?.includes(DISSOLUTION), 'p210 retrieval boundary explicitly separates the p211 dissolution method');
assert(bridge.aiVerdictAllowed === true, 'AI may explain the already-computed p210 verdict only after the safety gate passes');

console.log('\n--- AI Context Package carries the same gate ---');
const { contextPackage } = buildKashfAiContextPackage({
  mothers: MOTHERS,
  topicId: 'marriage',
  question: QUESTION,
  questionId: 'q-marriage-fit',
  readingId: 'golden-marriage-001',
});
const rc = contextPackage?.readingContext;
assert(rc?.professionalVerdictSafety?.authoritativePolarity === 'positive', 'AI payload carries authoritative positive polarity');
assert(rc?.methodMetadata?.allowedVerdictSources?.includes('readingContext.engineOutput.overallPositive'), 'method metadata allows overallPositive as a verdict source');
assert(!rc?.methodMetadata?.allowedVerdictSources?.includes('readingContext.engineOutput.primaryFormula'), 'raw primaryFormula is no longer an independent verdict source for AI');
assert(rc?.methodMetadata?.explanationOnlySources?.includes('readingContext.engineOutput.primaryFormula'), 'primaryFormula is explanation-only');
assert(rc?.methodMetadata?.forbiddenForVerdict?.includes('readingContext.board'), 'raw board is forbidden as an independent verdict source');
assert(sanitizeKashfReadingPayloadForAi(contextPackage).ok === true, 'real Golden Case payload passes the stricter server sanitizer');

console.log('\n--- Structured AI verdict alignment is fail-closed ---');
function advisorOutput(overrides = {}) {
  const verdictAudit = {
    methodId: METHOD,
    engineVerdictPolarity: 'positive',
    clientDraftPolarity: 'positive',
    usedOnlyAuthorizedVerdictSource: true,
    inventedInverseRule: false,
    mixedUnselectedMethod: false,
    unsupportedClientClaims: [],
    ...(overrides.verdictAudit || {}),
  };
  return {
    module: 'kashf',
    advisorDiagnosis: 'הפסק הקנוני חיובי לפי p210.',
    clientAnswerDraft: 'לפי דין הנישואין שנבחר, התשובה חיובית.',
    engineCritique: { hasProblem: false, problems: [], severity: 'none' },
    missingKnowledgeOrRules: [],
    recommendedFix: '',
    codeInstructionForClaude: { needed: false, instruction: '', filesToInspect: [], filesNotToTouch: [], testsToRun: [] },
    safetyNotes: [],
    privacyBlockedFields: [],
    nextBestAction: 'להציג לאורן את טיוטת הפסק החיובי לבדיקה.',
    confidence: 'high',
    needsOrenDecision: false,
    verdictAudit,
    ...Object.fromEntries(Object.entries(overrides).filter(([k]) => k !== 'verdictAudit')),
  };
}

const goodOutput = advisorOutput();
const schemaGood = validateKashfAdvisorOutput(goodOutput);
assert(schemaGood.ok === true, 'structured advisor output with verdictAudit passes schema validation');
assert(validateKashfAdvisorVerdictAlignment(schemaGood.value, rc.professionalVerdictSafety).ok === true, 'matching positive AI draft passes deterministic server alignment');

const wrongPolarity = validateKashfAdvisorOutput(advisorOutput({ verdictAudit: { clientDraftPolarity: 'negative' } }));
assert(wrongPolarity.ok === true, 'wrong-polarity fixture is schema-valid before semantic safety check');
assert(validateKashfAdvisorVerdictAlignment(wrongPolarity.value, rc.professionalVerdictSafety).ok === false, 'server rejects a negative client draft against positive engine verdict');

const inventedInverse = validateKashfAdvisorOutput(advisorOutput({ verdictAudit: { inventedInverseRule: true } }));
assert(validateKashfAdvisorVerdictAlignment(inventedInverse.value, rc.professionalVerdictSafety).ok === false, 'server rejects AI that reports inventing an inverse rule');

const mixedMethod = validateKashfAdvisorOutput(advisorOutput({ verdictAudit: { mixedUnselectedMethod: true } }));
assert(validateKashfAdvisorVerdictAlignment(mixedMethod.value, rc.professionalVerdictSafety).ok === false, 'server rejects AI that mixed an unselected method');

const unsupportedClaim = validateKashfAdvisorOutput(advisorOutput({ verdictAudit: { unsupportedClientClaims: ['יש חסימה בגלל H15 סוהר'] } }));
assert(validateKashfAdvisorVerdictAlignment(unsupportedClaim.value, rc.professionalVerdictSafety).ok === false, 'server rejects an unsupported client-facing claim');

console.log('\n--- Non-binary readings may not be turned into yes/no ---');
const nonBinarySafety = buildKashfProfessionalVerdictSafety({
  resolution: {
    kashfMethodId: 'test.nonbinary', kashfIntentId: 'test.nonbinary',
    kashfRuntimeStatus: 'ready', executorStatus: 'ready', runtimeAllowed: true,
  },
  canonicalReading: {
    valid: true, canRunKashf: true, kashfMethodId: 'test.nonbinary',
    kashfIntentId: 'test.nonbinary', overallPositive: null, verdict: { positive: null },
  },
  canonicalRetrieval: {
    kashfMethodId: 'test.nonbinary', v57: { hebrewRule: 'כלל בדיקה' }, doNotMixWith: [],
  },
  baseAiVerdictAllowed: true,
});
assert(nonBinarySafety.authoritativePolarity === 'non-binary', 'null engine polarity is classified non-binary');
assert(nonBinarySafety.binaryClientVerdictAllowed === false, 'non-binary engine result cannot authorize a yes/no client verdict');


console.log('\n--- Professional backfill batch 01 ---');

function makeBoard(overrides = {}) {
  return {
    entries: Array.from({ length: 16 }, (_, index) => {
      const house = index + 1;
      const pattern = overrides[house] || '2222';
      return { house, houseNumber: house, pattern, key: pattern, hebrewName: pattern };
    }),
  };
}

function auditOutputForSafety(safetyBlock, { draft = null, draftPolarity = 'none' } = {}) {
  return {
    module: 'kashf',
    advisorDiagnosis: 'בדיקת backfill מקצועית.',
    clientAnswerDraft: draft,
    engineCritique: { hasProblem: false, problems: [], severity: 'none' },
    missingKnowledgeOrRules: [],
    recommendedFix: '',
    codeInstructionForClaude: { needed: false, instruction: '', filesToInspect: [], filesNotToTouch: [], testsToRun: [] },
    safetyNotes: [],
    privacyBlockedFields: [],
    nextBestAction: 'בדיקת backfill.',
    confidence: 'high',
    needsOrenDecision: false,
    verdictAudit: {
      methodId: safetyBlock.kashfMethodId,
      engineVerdictPolarity: safetyBlock.authoritativePolarity,
      clientDraftPolarity: draftPolarity,
      usedOnlyAuthorizedVerdictSource: true,
      inventedInverseRule: false,
      mixedUnselectedMethod: false,
      unsupportedClientClaims: [],
    },
  };
}

assert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.length === 5, 'certification registry starts with p210 + four backfilled methods');
for (const id of [
  'marriage.p210.generalMarriageH1H2H7H8H10Judge',
  'general.p174.h1h2h4h7h10h15',
  'siblings.p182.seniority',
  'travel.p244.returnH1H2H9',
  'missing.p249.returnAnglesJudge',
]) {
  assert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.includes(id), id + ' is explicitly professionally certified');
}

// PV-BF01-P174 — six-house profile remains non-binary; no majority is allowed.
const p174 = buildKashfCanonicalAiBridge({ questionId: 'q-general-state', questionText: 'מה מצבי הכללי?', board: makeBoard({ 1:'2111', 2:'1112', 4:'2111', 7:'1112', 10:'2111', 15:'1112' }) });
assert(p174.canonicalReading?.overallPositive === null, 'p174 remains non-binary even with a deliberately split 3/3 board');
assert(p174.professionalVerdictSafety?.certificationStatus === 'certified', 'p174 passed professional backfill');
assert(p174.professionalVerdictSafety?.clientFacingCertified === true, 'p174 client-facing explanation is certified');
assert(p174.professionalVerdictSafety?.binaryClientVerdictAllowed === false, 'p174 cannot become yes/no');
assert(p174.professionalVerdictSafety?.methodSpecificPolicy?.excludedFromPrimaryVerdict?.some((x) => x.includes('רוב')), 'p174 policy explicitly forbids majority aggregation');

// PV-BF01-P182 — named figures indicate seniority; every other H3 figure stays unresolved.
const p182Named = buildKashfCanonicalAiBridge({ questionId: 'q-sibling-eldest', questionText: 'מי הגדול בין האחים?', board: makeBoard({ 3:'2222' }) });
const p182NamedExec = p182Named.canonicalReading?.primaryFormula?.result?.executorResult;
assert(p182NamedExec?.senioritySignal === 'older-paternal-emphasis', 'p182 Jamaa branch preserves older/paternal emphasis');
assert(p182Named.professionalVerdictSafety?.certificationStatus === 'certified', 'p182 passed professional backfill');
const p182Other = buildKashfCanonicalAiBridge({ questionId: 'q-sibling-eldest', questionText: 'מי הגדול בין האחים?', board: makeBoard({ 3:'2111' }) });
assert(p182Other.canonicalReading?.primaryFormula?.result?.executorResult?.senioritySignal === 'unresolved', 'p182 unlisted H3 figure is not inverted into younger');
assert(p182Other.canonicalReading?.overallPositive === null, 'p182 unlisted branch does not invent binary polarity');

// PV-BF01-P244 — positive branch is binary; hardship branch is not a certain no-return.
const p244Good = buildKashfCanonicalAiBridge({ questionId: 'q-traveler-return', questionText: 'האם הנוסע יחזור?', board: makeBoard({ 1:'2111', 2:'2111', 9:'2111' }) });
assert(p244Good.canonicalReading?.overallPositive === true, 'p244 all-benefic/internal fixture gives the explicit positive return branch');
assert(p244Good.professionalVerdictSafety?.certificationStatus === 'certified', 'p244 passed professional backfill');
assert(p244Good.professionalVerdictSafety?.binaryClientVerdictAllowed === true, 'p244 explicit positive branch may be stated positively');
const p244Hard = buildKashfCanonicalAiBridge({ questionId: 'q-traveler-return', questionText: 'האם הנוסע יחזור?', board: makeBoard({ 1:'1112', 2:'1112', 9:'1112' }) });
assert(p244Hard.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'hardship-possible-no-return', 'p244 malefic fixture exposes hardship/possible non-return only');
assert(p244Hard.canonicalReading?.overallPositive === null, 'p244 hardship branch is not inverted into a certain negative verdict');
const p244WrongNegative = validateKashfAdvisorOutput(auditOutputForSafety(p244Hard.professionalVerdictSafety, { draft: 'הנוסע לא יחזור.', draftPolarity: 'negative' }));
assert(validateKashfAdvisorVerdictAlignment(p244WrongNegative.value, p244Hard.professionalVerdictSafety).ok === false, 'server rejects certain negative client verdict for p244 hardship/non-binary branch');

// PV-BF01-P249 — return sign is explicitly male-scoped and remains non-binary globally.
const p249 = buildKashfCanonicalAiBridge({ questionId: 'q-missing-return', questionText: 'האם הנעדר יחזור?', board: makeBoard({ 1:'2111', 4:'2111', 7:'2111', 10:'2111', 15:'2111' }) });
const p249Exec = p249.canonicalReading?.primaryFormula?.result?.executorResult;
assert(p249Exec?.returnIndicatedForMale === true, 'p249 exact angle+judge fixture exposes the male-return sign');
assert(p249.canonicalReading?.overallPositive === null, 'p249 does not generalize male-return sign into universal yes/no');
assert(p249.professionalVerdictSafety?.certificationStatus === 'certified', 'p249 passed professional backfill');
assert(p249.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenInversions?.some((x) => x.includes('לא יחזור')), 'p249 policy forbids inverse non-return claim');

// p179 is intentionally NOT rubber-stamped: v57 says "יש בה צד מיטיב" while
// the current executor gate is pure saad. Until scan-level wording is closed,
// it stays runnable for advisor inspection but client-facing drafting is blocked.
const p179Pending = buildKashfCanonicalAiBridge({ questionId: 'q-money-source', questionText: 'מאיפה יגיע הכסף?', board: makeBoard({ 2:'2111', 10:'2211' }) });
assert(p179Pending.canonicalReading?.valid === true && p179Pending.canonicalReading?.canRunKashf === true, 'p179 engine remains runnable while professional wording audit is open');
assert(p179Pending.professionalVerdictSafety?.certificationStatus === 'pending-backfill', 'p179 is explicitly pending professional backfill, not silently certified');
assert(p179Pending.professionalVerdictSafety?.clientFacingCertified === false, 'p179 cannot produce client-facing draft before source wording closes');
const p179Draft = validateKashfAdvisorOutput(auditOutputForSafety(p179Pending.professionalVerdictSafety, { draft: 'מקור הכסף הוא מן השלטון.', draftPolarity: 'non-binary' }));
const p179DraftAlignment = validateKashfAdvisorVerdictAlignment(p179Draft.value, p179Pending.professionalVerdictSafety);
assert(p179DraftAlignment.ok === false && p179DraftAlignment.category === 'uncertified-client-draft', 'server hard-blocks p179 client draft while backfill certification is pending');
const p179AdvisorOnly = validateKashfAdvisorOutput(auditOutputForSafety(p179Pending.professionalVerdictSafety));
assert(validateKashfAdvisorVerdictAlignment(p179AdvisorOnly.value, p179Pending.professionalVerdictSafety).ok === true, 'p179 may still be analyzed advisor-only with clientAnswerDraft:null');

console.log(`\nKashf professional verdict safety tests: ${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
