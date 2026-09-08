import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { buildKashfCanonicalAiBridge } from './goral-hachol/intelligence/kashf-canonical-ai-bridge.js';
import { buildKashfAiContextPackage } from './goral-hachol/intelligence/kashf-ai-context-builder.js';
import {
  buildKashfProfessionalVerdictSafety,
  KASHF_PROFESSIONAL_VERDICT_SAFETY_VERSION,
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

console.log(`\nKashf professional verdict safety tests: ${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
