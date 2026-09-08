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
assert(safety?.clientDraftExactMatchRequired === true, 'certified p210 requires exact deterministic client draft');
assert(safety?.authoritativeClientDraftHebrew === executor?.outputHebrew, 'p210 authoritative client draft is the executor source-bounded text');
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
    clientAnswerDraft: safety.authoritativeClientDraftHebrew,
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
assert(validateKashfAdvisorVerdictAlignment(schemaGood.value, rc.professionalVerdictSafety).ok === true, 'matching exact positive engine draft passes deterministic server alignment');

const paraphrasedSamePolarity = validateKashfAdvisorOutput(advisorOutput({ clientAnswerDraft: 'לפי הדין התשובה חיובית.' }));
const paraphrasedAlignment = validateKashfAdvisorVerdictAlignment(paraphrasedSamePolarity.value, rc.professionalVerdictSafety);
assert(paraphrasedAlignment.ok === false && paraphrasedAlignment.category === 'client-draft-not-exact-engine-text', 'server rejects same-polarity paraphrase: client text is deterministic, not AI-authored');

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

assert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.length === 19, 'certification registry contains nineteen professionally certified methods');
for (const id of [
  'marriage.p210.generalMarriageH1H2H7H8H10Judge',
  'general.p174.h1h2h4h7h10h15',
  'siblings.p182.seniority',
  'travel.p244.returnH1H2H9',
  'missing.p249.returnAnglesJudge',
  'marriage.p204.previousStatusH7inH10',
  'marriage.p204.dowryH8',
  'love.p206.womanFavorH7H11ThenH5',
  'desire.p206.querentWantsH7H11ThenH5',
  'relocation.p183.stayMoveH1H2',
  'dispute.p212.reconciliationH1H7',
  'religion.p253.h3h9Quality',
  'lostItem.p202.returnH6H8',
  'clothing.p264-265.luck',
  'pregnancy.p191.existsH5SilentEmpty',
  'pregnancy.p191.genderH5',
  'illness.p196.outcomeH15',
  'hidden.p188.isStillThere',
  'theft.p224.relationshipH7Recurrence',
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



console.log('\n--- Professional backfill batch 02 ---');

// PV-BF02-P204-PREVIOUS-* — the p204 rule is conditional on H7 recurring in H10.
const p204PreviousMutable = buildKashfCanonicalAiBridge({ questionId: 'q-marriage-thayib', questionText: 'בתולה או גרושה?', board: makeBoard({ 7:'1121', 10:'1121' }) });
assert(p204PreviousMutable.canonicalReading?.primaryFormula?.result?.executorResult?.previousStatus === 'divorced', 'p204 mutable H7 recurrence yields exactly divorced');
assert(p204PreviousMutable.professionalVerdictSafety?.certificationStatus === 'certified', 'p204 previous-status method passed professional backfill');
assert(p204PreviousMutable.professionalVerdictSafety?.authoritativePolarity === 'non-binary', 'p204 previous status remains categorical rather than sentiment polarity');
const p204PreviousFixed = buildKashfCanonicalAiBridge({ questionId: 'q-marriage-thayib', questionText: 'בתולה או גרושה?', board: makeBoard({ 7:'2222', 10:'2222' }) });
assert(p204PreviousFixed.canonicalReading?.primaryFormula?.result?.executorResult?.previousStatus === 'virgin', 'p204 fixed H7 recurrence yields exactly virgin');
const p204PreviousNoRecurrence = buildKashfCanonicalAiBridge({ questionId: 'q-marriage-thayib', questionText: 'בתולה או גרושה?', board: makeBoard({ 7:'1121', 10:'2222' }) });
assert(p204PreviousNoRecurrence.canonicalReading?.primaryFormula?.result?.executorResult?.previousStatus === null, 'p204 no-recurrence case stays unresolved');
assert(p204PreviousNoRecurrence.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenInversions?.some((x) => x.includes('אי-חזרת')), 'p204 safety policy explicitly forbids guessing from absent recurrence');

// PV-BF02-P204-DOWRY-* — only the stated benefic H8 branch proves a large mahr.
const p204DowryLarge = buildKashfCanonicalAiBridge({ questionId: 'q-dowry', questionText: 'מה גודל המוהר?', board: makeBoard({ 8:'1122' }) });
assert(p204DowryLarge.canonicalReading?.primaryFormula?.result?.executorResult?.isLargeDowry === true, 'p204 benefic H8 yields the explicit large-mahr branch');
assert(p204DowryLarge.professionalVerdictSafety?.certificationStatus === 'certified', 'p204 dowry method passed professional backfill');
const p204DowryMalefic = buildKashfCanonicalAiBridge({ questionId: 'q-dowry', questionText: 'מה גודל המוהר?', board: makeBoard({ 8:'1112' }) });
assert(p204DowryMalefic.canonicalReading?.primaryFormula?.result?.executorResult?.isLargeDowry === null, 'p204 malefic H8 does not invert into small mahr');
assert(p204DowryMalefic.professionalVerdictSafety?.authoritativePolarity === 'non-binary', 'p204 malefic dowry branch remains non-binary');
const p204DowryInventedSmall = validateKashfAdvisorOutput(auditOutputForSafety(p204DowryMalefic.professionalVerdictSafety, { draft: 'המוהר יהיה קטן.', draftPolarity: 'negative' }));
assert(validateKashfAdvisorVerdictAlignment(p204DowryInventedSmall.value, p204DowryMalefic.professionalVerdictSafety).ok === false, 'server rejects invented small-mahr inverse verdict');

// PV-BF02-P206-WOMAN-FAVOR-* — exact semantics: finding favor, not love/chemistry/marriage.
const p206FavorGood = buildKashfCanonicalAiBridge({ questionId: 'q-woman-grace', questionText: 'האם האישה תמצא חן בעיני האיש?', board: makeBoard({ 5:'2211', 7:'2222', 11:'2222' }) });
assert(p206FavorGood.canonicalReading?.overallPositive === true, 'p206 woman-favor benefic final is positive');
assert(p206FavorGood.professionalVerdictSafety?.certificationStatus === 'certified', 'p206 woman-favor method passed professional backfill');
const p206FavorBad = buildKashfCanonicalAiBridge({ questionId: 'q-woman-grace', questionText: 'האם האישה תמצא חן בעיני האיש?', board: makeBoard({ 5:'1212', 7:'2222', 11:'2222' }) });
assert(p206FavorBad.canonicalReading?.overallPositive === false, 'p206 woman-favor malefic final is negative');
const p206FavorMixed = buildKashfCanonicalAiBridge({ questionId: 'q-woman-grace', questionText: 'האם האישה תמצא חן בעיני האיש?', board: makeBoard({ 5:'2222', 7:'2222', 11:'2222' }) });
assert(p206FavorMixed.canonicalReading?.overallPositive === null, 'p206 woman-favor mixed final remains unresolved');
assert(p206FavorGood.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenClientClaimsWithoutExplicitSelectedMethodBranch?.some((x) => x.includes('כימיה')), 'p206 woman-favor policy forbids mutual-chemistry expansion');
const p206FavorUnsupportedLove = validateKashfAdvisorOutput(auditOutputForSafety(p206FavorGood.professionalVerdictSafety, { draft: 'הוא אוהב אותה.', draftPolarity: 'positive' }));
p206FavorUnsupportedLove.value.verdictAudit.unsupportedClientClaims = ['הוא אוהב אותה'];
assert(validateKashfAdvisorVerdictAlignment(p206FavorUnsupportedLove.value, p206FavorGood.professionalVerdictSafety).ok === false, 'server rejects expansion from finding-favor to love');

// PV-BF02-P206-DESIRE-* — same arithmetic as woman-favor, but a different semantic question.
const p206DesireGood = buildKashfCanonicalAiBridge({ questionText: 'האם השואל רוצה בדבר', board: makeBoard({ 5:'2211', 7:'2222', 11:'2222' }) });
assert(p206DesireGood.resolution.kashfMethodId === 'desire.p206.querentWantsH7H11ThenH5', 'p206 desire free text resolves only the exact desire method');
assert(p206DesireGood.canonicalReading?.overallPositive === true, 'p206 desire benefic final means the querent wants the matter');
assert(p206DesireGood.professionalVerdictSafety?.certificationStatus === 'certified', 'p206 desire method passed professional backfill');
const p206DesireBad = buildKashfCanonicalAiBridge({ questionText: 'האם השואל רוצה בדבר', board: makeBoard({ 5:'1212', 7:'2222', 11:'2222' }) });
assert(p206DesireBad.canonicalReading?.overallPositive === false, 'p206 desire malefic final means the querent does not want the matter');
const p206DesireMixed = buildKashfCanonicalAiBridge({ questionText: 'האם השואל רוצה בדבר', board: makeBoard({ 5:'2222', 7:'2222', 11:'2222' }) });
assert(p206DesireMixed.canonicalReading?.overallPositive === null, 'p206 desire mixed final remains unresolved');
assert(p206DesireGood.professionalVerdictSafety?.methodSpecificPolicy?.excludedFromPrimaryVerdict?.some((x) => x.includes('womanFavor')), 'p206 desire policy explicitly isolates the identical-arithmetic woman-favor method');

// p211 is deliberately NOT certified: Arabic verification shows branches absent from current operational v57 knowledge/executor.
assert(!KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.includes('marriage.p211.dissolutionH7StateMatrix'), 'p211 dissolution is held from certification pending source-coverage repair');
const p211Pending = buildKashfCanonicalAiBridge({ questionId: 'q-divorce', questionText: 'האם תהיה פרידה בנישואין?', board: makeBoard({ 7:'2111' }) });
assert(p211Pending.professionalVerdictSafety?.certificationStatus === 'pending-backfill', 'p211 remains pending-backfill despite being computationally runnable');
assert(p211Pending.professionalVerdictSafety?.clientFacingCertified === false, 'p211 cannot issue client-facing advice before source coverage is repaired');
assert(p211Pending.professionalVerdictSafety?.binaryClientVerdictAllowed === false, 'p211 has no binary client-verdict permission while uncertified');
const p211UnsafeDraft = validateKashfAdvisorOutput(auditOutputForSafety(p211Pending.professionalVerdictSafety, { draft: 'הנישואין יישארו יציבים.', draftPolarity: p211Pending.professionalVerdictSafety.authoritativePolarity === 'positive' ? 'positive' : 'non-binary' }));
assert(validateKashfAdvisorVerdictAlignment(p211UnsafeDraft.value, p211Pending.professionalVerdictSafety).ok === false, 'server blocks a p211 client draft while professional certification is pending');



console.log('\n--- Professional backfill batch 03 + exact client-draft lock ---');

// The exact draft gate must protect categorical/non-binary methods too.
const p204CategoryLock = buildKashfCanonicalAiBridge({ questionId: 'q-marriage-thayib', questionText: 'בתולה או גרושה?', board: makeBoard({ 7:'1121', 10:'1121' }) });
assert(p204CategoryLock.canonicalReading?.primaryFormula?.result?.executorResult?.previousStatus === 'divorced', 'category-lock fixture engine says divorced');
assert(p204CategoryLock.professionalVerdictSafety?.authoritativePolarity === 'non-binary', 'category-lock fixture is non-binary by polarity');
assert(p204CategoryLock.professionalVerdictSafety?.clientDraftExactMatchRequired === true, 'categorical certified method requires exact client text');
const p204ExactDraft = validateKashfAdvisorOutput(auditOutputForSafety(p204CategoryLock.professionalVerdictSafety, { draft: p204CategoryLock.professionalVerdictSafety.authoritativeClientDraftHebrew, draftPolarity: 'non-binary' }));
assert(validateKashfAdvisorVerdictAlignment(p204ExactDraft.value, p204CategoryLock.professionalVerdictSafety).ok === true, 'exact categorical engine text is accepted');
const p204WrongCategory = validateKashfAdvisorOutput(auditOutputForSafety(p204CategoryLock.professionalVerdictSafety, { draft: 'בתולה', draftPolarity: 'non-binary' }));
const p204WrongCategoryAlignment = validateKashfAdvisorVerdictAlignment(p204WrongCategory.value, p204CategoryLock.professionalVerdictSafety);
assert(p204WrongCategoryAlignment.ok === false && p204WrongCategoryAlignment.category === 'client-draft-not-exact-engine-text', 'server rejects divorced→virgin category inversion even though both are non-binary');

// PV-BF03-P183-* — two exact opposite branches; same-class remains unresolved.
const p183Stay = buildKashfCanonicalAiBridge({ questionId: 'q-stay-place', questionText: 'האם כדאי להישאר במקום זה או לעבור?', board: makeBoard({ 1:'1122', 2:'1112' }) });
assert(p183Stay.canonicalReading?.primaryFormula?.result?.executorResult?.decision === 'stay', 'p183 H1 benefic + H2 malefic chooses stay');
assert(p183Stay.professionalVerdictSafety?.certificationStatus === 'certified', 'p183 passed professional backfill');
assert(p183Stay.professionalVerdictSafety?.authoritativePolarity === 'non-binary', 'p183 directional decision remains non-binary polarity');
const p183StayExact = validateKashfAdvisorOutput(auditOutputForSafety(p183Stay.professionalVerdictSafety, { draft: p183Stay.professionalVerdictSafety.authoritativeClientDraftHebrew, draftPolarity: 'non-binary' }));
assert(validateKashfAdvisorVerdictAlignment(p183StayExact.value, p183Stay.professionalVerdictSafety).ok === true, 'p183 exact stay text passes server gate');
const p183WrongMove = validateKashfAdvisorOutput(auditOutputForSafety(p183Stay.professionalVerdictSafety, { draft: 'המעבר עדיף.', draftPolarity: 'non-binary' }));
assert(validateKashfAdvisorVerdictAlignment(p183WrongMove.value, p183Stay.professionalVerdictSafety).ok === false, 'p183 server blocks stay→move category reversal');
const p183Move = buildKashfCanonicalAiBridge({ questionId: 'q-stay-place', questionText: 'האם כדאי להישאר במקום זה או לעבור?', board: makeBoard({ 1:'1112', 2:'1122' }) });
assert(p183Move.canonicalReading?.primaryFormula?.result?.executorResult?.decision === 'move', 'p183 reverse explicit branch chooses move');
const p183Same = buildKashfCanonicalAiBridge({ questionId: 'q-stay-place', questionText: 'האם כדאי להישאר במקום זה או לעבור?', board: makeBoard({ 1:'1122', 2:'2211' }) });
assert(p183Same.canonicalReading?.primaryFormula?.result?.executorResult?.decision === 'unresolved', 'p183 same-class testimony remains unresolved');

// PV-BF03-P212-* — only the benefic result is an explicit reconciliation verdict.
const p212Good = buildKashfCanonicalAiBridge({ questionId: 'q-reconciliation', questionText: 'האם יהיה פיוס בין הצדדים?', board: makeBoard({ 1:'1111', 7:'2211' }) });
assert(p212Good.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'reconciliation', 'p212 benefic generated figure yields explicit reconciliation');
assert(p212Good.canonicalReading?.overallPositive === true, 'p212 explicit reconciliation branch is positive');
assert(p212Good.professionalVerdictSafety?.certificationStatus === 'certified', 'p212 passed professional backfill');
const p212Bad = buildKashfCanonicalAiBridge({ questionId: 'q-reconciliation', questionText: 'האם יהיה פיוס בין הצדדים?', board: makeBoard({ 1:'1111', 7:'2221' }) });
assert(p212Bad.canonicalReading?.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'nahs', 'p212 counterfixture generates a malefic result');
assert(p212Bad.canonicalReading?.overallPositive === null, 'p212 malefic result is not inverted into explicit no-reconciliation');
assert(p212Bad.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenInversions?.some((x) => x.includes('מזיקה')), 'p212 policy records the no-inverse rule');

// PV-BF03-P253-* — H3/H9 must agree in the same pure source class.
const p253Good = buildKashfCanonicalAiBridge({ questionId: 'q-religion', questionText: 'מה מצב דתו וצדקותו של האדם?', board: makeBoard({ 3:'1122', 9:'2211' }) });
assert(p253Good.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'religious-and-god-fearing', 'p253 two benefics yield the exact positive source branch');
assert(p253Good.canonicalReading?.overallPositive === true, 'p253 benefic branch is positive');
assert(p253Good.professionalVerdictSafety?.certificationStatus === 'certified', 'p253 passed professional backfill');
const p253Bad = buildKashfCanonicalAiBridge({ questionId: 'q-religion', questionText: 'מה מצב דתו וצדקותו של האדם?', board: makeBoard({ 3:'1112', 9:'1221' }) });
assert(p253Bad.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'little-religion', 'p253 two malefics yield little-religion source branch');
assert(p253Bad.canonicalReading?.overallPositive === false, 'p253 malefic branch is negative');
const p253Split = buildKashfCanonicalAiBridge({ questionId: 'q-religion', questionText: 'מה מצב דתו וצדקותו של האדם?', board: makeBoard({ 3:'1112', 9:'1122' }) });
assert(p253Split.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'unresolved', 'p253 split testimony remains unresolved');
assert(p253Split.canonicalReading?.overallPositive === null, 'p253 split testimony does not become an invented middle verdict');

// PV-BF03-P202-* — source has an explicit else branch.
const p202Yes = buildKashfCanonicalAiBridge({ questionId: 'q-lost-item', questionText: 'האם האבדה תשוב?', board: makeBoard({ 6:'2111', 8:'2121' }) });
assert(p202Yes.canonicalReading?.overallPositive === true, 'p202 H6/H8 benefic+internal condition yields return');
assert(p202Yes.professionalVerdictSafety?.certificationStatus === 'certified', 'p202 passed professional backfill');
const p202No = buildKashfCanonicalAiBridge({ questionId: 'q-lost-item', questionText: 'האם האבדה תשוב?', board: makeBoard({ 6:'1112', 8:'2121' }) });
assert(p202No.canonicalReading?.overallPositive === false, 'p202 failure of explicit H6/H8 condition yields the source else/no branch');
assert(p202No.professionalVerdictSafety?.methodSpecificPolicy?.excludedFromPrimaryVerdict?.some((x) => x.includes('גנב')), 'p202 policy blocks theft-attribution expansion');

// PV-BF03-P265-* — general clothing luck and H10 royal-clothing qualifier remain separate.
const p265Good = buildKashfCanonicalAiBridge({ questionId: 'q-clothing-lucky', questionText: 'מה מזלי בלבוש?', board: makeBoard({ 5:'1122', 10:'2211', 11:'2111' }) });
assert(p265Good.canonicalReading?.primaryFormula?.result?.executorResult?.clothingLuck === true, 'p265 H5/H11 benefic branch gives general clothing luck');
assert(p265Good.canonicalReading?.overallPositive === true, 'p265 good clothing-luck branch is positive');
assert(p265Good.professionalVerdictSafety?.certificationStatus === 'certified', 'p265 passed professional backfill');
const p265Bad = buildKashfCanonicalAiBridge({ questionId: 'q-clothing-lucky', questionText: 'מה מזלי בלבוש?', board: makeBoard({ 5:'1112', 10:'1122', 11:'1212' }) });
assert(p265Bad.canonicalReading?.primaryFormula?.result?.executorResult?.clothingLuck === false, 'p265 H5/H11 malefic branch gives no general clothing luck');
assert(p265Bad.canonicalReading?.overallPositive === false, 'p265 bad clothing-luck branch is negative');
const p265Royal = buildKashfCanonicalAiBridge({ questionId: 'q-clothing-lucky', questionText: 'מה מזלי בלבוש?', board: makeBoard({ 5:'1122', 10:'1112', 11:'2111' }) });
assert(p265Royal.canonicalReading?.primaryFormula?.result?.executorResult?.clothingLuck === true, 'p265 general clothing luck remains positive when H5/H11 are benefic');
assert(p265Royal.canonicalReading?.primaryFormula?.result?.executorResult?.royalClothingNoLuck === true, 'p265 malefic H10 remains a separate royal-clothing qualifier');
assert(p265Royal.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenClientClaimsWithoutExplicitSelectedMethodBranch?.some((x) => x.includes('מבטל')), 'p265 policy forbids H10 from silently cancelling the general branch');
const p265Mixed = buildKashfCanonicalAiBridge({ questionId: 'q-clothing-lucky', questionText: 'מה מזלי בלבוש?', board: makeBoard({ 5:'2212', 10:'1122', 11:'2111' }) });
assert(p265Mixed.canonicalReading?.overallPositive === null, 'p265 mixed/split H5-H11 evidence remains unresolved');



console.log('\n--- Professional backfill batch 04 ---');

// PV-BF04-P191 existence — use silent/empty only; never substitute fortune.
const p191ExistsYes = buildKashfCanonicalAiBridge({ questionId: 'q-pregnancy', questionText: 'האם יש הריון?', board: makeBoard({ 5:'2111' }) });
assert(p191ExistsYes.canonicalReading?.primaryFormula?.result?.executorResult?.classification === 'silent', 'p191 existence silent H5 uses the exact silent class');
assert(p191ExistsYes.canonicalReading?.overallPositive === true, 'p191 silent H5 gives the explicit pregnancy-exists branch');
assert(p191ExistsYes.professionalVerdictSafety?.certificationStatus === 'certified', 'p191 pregnancy existence passed professional backfill');
assert(p191ExistsYes.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenInversions?.some((x) => x.includes('מיטיב/מזיק')), 'p191 existence policy forbids replacing silent/empty with benefic/malefic');
const p191ExistsNo = buildKashfCanonicalAiBridge({ questionId: 'q-pregnancy', questionText: 'האם יש הריון?', board: makeBoard({ 5:'1112' }) });
assert(p191ExistsNo.canonicalReading?.primaryFormula?.result?.executorResult?.classification === 'empty', 'p191 existence empty H5 uses the exact empty class');
assert(p191ExistsNo.canonicalReading?.overallPositive === false, 'p191 empty H5 gives the explicit pregnancy-nullified branch');
const p191ExistsUnresolved = buildKashfCanonicalAiBridge({ questionId: 'q-pregnancy', questionText: 'האם יש הריון?', board: makeBoard({ 5:'1111' }) });
assert(p191ExistsUnresolved.canonicalReading?.overallPositive === null, 'p191 H5 outside silent/empty remains unresolved');

// PV-BF04-P191 gender — categorical male/female needs exact-draft protection.
const p191GenderMale = buildKashfCanonicalAiBridge({ questionId: 'q-gender', questionText: 'מה מין הוולד?', board: makeBoard({ 5:'1112' }) });
assert(p191GenderMale.canonicalReading?.primaryFormula?.result?.executorResult?.gender === 'male', 'p191 masculine H5 gives male');
assert(p191GenderMale.canonicalReading?.overallPositive === null, 'p191 gender remains categorical/non-binary polarity');
assert(p191GenderMale.professionalVerdictSafety?.certificationStatus === 'certified', 'p191 gender passed professional backfill');
const p191GenderExact = validateKashfAdvisorOutput(auditOutputForSafety(p191GenderMale.professionalVerdictSafety, { draft: p191GenderMale.professionalVerdictSafety.authoritativeClientDraftHebrew, draftPolarity: 'non-binary' }));
assert(validateKashfAdvisorVerdictAlignment(p191GenderExact.value, p191GenderMale.professionalVerdictSafety).ok === true, 'p191 exact male category text passes server gate');
const p191GenderWrong = validateKashfAdvisorOutput(auditOutputForSafety(p191GenderMale.professionalVerdictSafety, { draft: 'לפי כשף עמ׳ 191: הוולד נקבה.', draftPolarity: 'non-binary' }));
const p191GenderWrongAlignment = validateKashfAdvisorVerdictAlignment(p191GenderWrong.value, p191GenderMale.professionalVerdictSafety);
assert(p191GenderWrongAlignment.ok === false && p191GenderWrongAlignment.category === 'client-draft-not-exact-engine-text', 'server blocks male→female category replacement even though both are non-binary');
const p191GenderFemale = buildKashfCanonicalAiBridge({ questionId: 'q-gender', questionText: 'מה מין הוולד?', board: makeBoard({ 5:'2111' }) });
assert(p191GenderFemale.canonicalReading?.primaryFormula?.result?.executorResult?.gender === 'female', 'p191 feminine H5 gives female');
const p191GenderUnresolved = buildKashfCanonicalAiBridge({ questionId: 'q-gender', questionText: 'מה מין הוולד?', board: makeBoard({ 5:'1111' }) });
assert(p191GenderUnresolved.canonicalReading?.primaryFormula?.result?.executorResult?.gender === null, 'p191 unclassified H5 does not invent a gender');

// PV-BF04-P196 illness — malefic means prolongation, not death or permanent non-recovery.
const p196Recovery = buildKashfCanonicalAiBridge({ questionId: 'q-illness-heal', questionText: 'האם החולה יחלים?', board: makeBoard({ 15:'1122' }) });
assert(p196Recovery.canonicalReading?.primaryFormula?.result?.executorResult?.recoveryStatus === 'recovers', 'p196 benefic H15 gives explicit recovery');
assert(p196Recovery.canonicalReading?.overallPositive === true, 'p196 recovery branch is positive');
assert(p196Recovery.professionalVerdictSafety?.certificationStatus === 'certified', 'p196 illness recovery passed professional backfill');
const p196Prolonged = buildKashfCanonicalAiBridge({ questionId: 'q-illness-heal', questionText: 'האם החולה יחלים?', board: makeBoard({ 15:'1112' }) });
assert(p196Prolonged.canonicalReading?.primaryFormula?.result?.executorResult?.recoveryStatus === 'prolonged-illness', 'p196 malefic H15 means prolonged illness');
assert(p196Prolonged.canonicalReading?.primaryFormula?.result?.executorResult?.recovers === null && p196Prolonged.canonicalReading?.overallPositive === null, 'p196 prolongation is not inverted into categorical no-recovery');
assert(p196Prolonged.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenClientClaimsWithoutExplicitSelectedMethodBranch?.includes('החולה ימות'), 'p196 policy explicitly forbids inventing death');
const p196Mixed = buildKashfCanonicalAiBridge({ questionId: 'q-illness-heal', questionText: 'האם החולה יחלים?', board: makeBoard({ 15:'2212' }) });
assert(p196Mixed.canonicalReading?.overallPositive === null, 'p196 mixed H15 remains unresolved');

// PV-BF04-P188 hidden thing — all six required houses, no majority.
const p188Present = buildKashfCanonicalAiBridge({ questionId: 'q-treasure', questionText: 'האם הדבר הנסתר עדיין במקומו?', board: makeBoard({ 1:'1122', 2:'1122', 4:'1122', 13:'1122', 14:'1122', 15:'1122' }) });
assert(p188Present.canonicalReading?.primaryFormula?.result?.executorResult?.allBenefic === true, 'p188 all six required houses are pure benefic');
assert(p188Present.canonicalReading?.overallPositive === true, 'p188 all-six condition gives present-in-place');
assert(p188Present.professionalVerdictSafety?.certificationStatus === 'certified', 'p188 hidden-item method passed professional backfill');
const p188Absent = buildKashfCanonicalAiBridge({ questionId: 'q-treasure', questionText: 'האם הדבר הנסתר עדיין במקומו?', board: makeBoard({ 1:'1122', 2:'1122', 4:'1122', 13:'1122', 14:'1112', 15:'1122' }) });
assert(p188Absent.canonicalReading?.primaryFormula?.result?.executorResult?.nonBeneficHouses?.includes(14), 'p188 identifies the single failing required house');
assert(p188Absent.canonicalReading?.overallPositive === false, 'p188 one failing house triggers the explicit not-there branch');
assert(p188Absent.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenClientClaimsWithoutExplicitSelectedMethodBranch?.some((x) => x.includes('חמישה מתוך שישה')), 'p188 policy explicitly forbids invented 5/6 majority');

// PV-BF04-P224 thief relationship — recurrence describes a source-bounded relation, not identity.
const p224Relation = buildKashfCanonicalAiBridge({ questionId: 'q-thief-near', questionText: 'מה הקשר של הגנב לבעל הדבר?', board: makeBoard({ 4:'1121', 7:'1121' }) });
const p224RelationExec = p224Relation.canonicalReading?.primaryFormula?.result?.executorResult;
assert(p224RelationExec?.relationResolved === true, 'p224 H7 recurrence in H4 resolves a source-supported relation');
assert(JSON.stringify(p224RelationExec?.recurrenceHouses) === JSON.stringify([4]), 'p224 reference H7 itself is excluded and only H4 recurrence is used');
assert(String(p224RelationExec?.outputHebrew || '').includes('מי שנכנס לביתו'), 'p224 H4 recurrence preserves the p224 relationship text');
assert(String(p224RelationExec?.outputHebrew || '').includes('שורש קרבה: אב'), 'p224 H4 recurrence preserves the p225 kinship-root layer');
assert(p224Relation.canonicalReading?.overallPositive === null, 'p224 relationship is descriptive/non-binary');
assert(p224Relation.professionalVerdictSafety?.certificationStatus === 'certified', 'p224 thief relationship passed professional backfill');
assert(p224Relation.professionalVerdictSafety?.methodSpecificPolicy?.excludedFromPrimaryVerdict?.some((x) => x.includes('זהות של אדם מסוים')), 'p224 policy blocks named-person identification');
const p224NoRecurrence = buildKashfCanonicalAiBridge({ questionId: 'q-thief-near', questionText: 'מה הקשר של הגנב לבעל הדבר?', board: makeBoard({ 7:'1121' }) });
assert(p224NoRecurrence.canonicalReading?.primaryFormula?.result?.executorResult?.relationResolved === false, 'p224 no H7 recurrence remains unresolved');
assert(p224NoRecurrence.canonicalReading?.overallPositive === null, 'p224 no recurrence does not invent stranger/near/far polarity');

console.log(`\nKashf professional verdict safety tests: ${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
