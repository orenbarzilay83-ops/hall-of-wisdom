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

assert(KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.length === 37, 'certification registry contains thirty-seven professionally certified methods');
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
  'matter.p172.h17_h1011_thenCombine',
  'relocation.p183.currentVsNewPlace',
  'authority.p256.honorConditionH10Planet',
  'authority.p257.appointmentH1H10Planet',
  'authority.p257.rulerConditionH7H10',
  'lifespan.p264.stagesH11H9H7',
  'money.p180.livelihoodH10Invert',
  'money.p181.recast25811',
  'career.p266.returnToOffice',
  'love.p204.attentionFireRows1713',
  'completion.p173.fireRows15910',
  'relocation.p183.h4h15',
  'siblings.p182.h1h3',
  'travel.p238.assemble1359',
  'illness.bodyPart.h6Figure',
  'pregnancy.p191.childSafetyH1H6H8',
  'pregnancy.p191.deliveryDifficultyH1H5H15',
  'spiritual.p167.hiddenActionAirRows46815',
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



console.log('\n--- Professional backfill batch 05 ---');

// PV-BF05-P172 — only the final generated figure decides good/bad; mixed stays mixed.
const p172BfGood = buildKashfCanonicalAiBridge({
  questionId: 'q-matter-end',
  questionText: 'מה תהיה תוצאת העניין?',
  board: makeBoard({ 1:'1111', 7:'2222', 10:'1111', 11:'1122' }),
});
const p172BfGoodExec = p172BfGood.canonicalReading?.primaryFormula?.result?.executorResult;
assert(p172BfGoodExec?.firstSeventhPattern === '1111' && p172BfGoodExec?.tenthEleventhPattern === '2211', 'p172 builds the two exact intermediate figures');
assert(p172BfGoodExec?.resultPattern === '1122' && p172BfGoodExec?.sourceOutcome === 'good', 'p172 final pure-benefic figure gives good outcome');
assert(p172BfGood.canonicalReading?.overallPositive === true, 'p172 good branch is positive');
assert(p172BfGood.professionalVerdictSafety?.certificationStatus === 'certified', 'p172 matter outcome passed professional backfill');
assert(p172BfGood.professionalVerdictSafety?.methodSpecificPolicy?.excludedFromPrimaryVerdict?.some((x) => x.includes('completion.p173')), 'p172 safety policy isolates the separate p173 completion method');
const p172BfBad = buildKashfCanonicalAiBridge({
  questionId: 'q-matter-end', questionText: 'מה תהיה תוצאת העניין?',
  board: makeBoard({ 1:'1111', 7:'2222', 10:'1111', 11:'1112' }),
});
assert(p172BfBad.canonicalReading?.primaryFormula?.result?.executorResult?.resultPattern === '1112', 'p172 bad fixture generates the expected final figure');
assert(p172BfBad.canonicalReading?.overallPositive === false, 'p172 pure-malefic final figure gives bad outcome');
const p172BfMixed = buildKashfCanonicalAiBridge({
  questionId: 'q-matter-end', questionText: 'מה תהיה תוצאת העניין?',
  board: makeBoard({ 1:'1111', 7:'2222', 10:'1111', 11:'2212' }),
});
assert(p172BfMixed.canonicalReading?.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'mixed', 'p172 mixed final preserves the mixed class');
assert(p172BfMixed.canonicalReading?.overallPositive === null, 'p172 mixed final cannot become binary good/bad');

// PV-BF05-P183 — two independent positive pairs; no inverse and no ranking.
const p183BfCurrent = buildKashfCanonicalAiBridge({
  questionId: 'q-move-home', questionText: 'מקום נוכחי מול מקום חדש',
  board: makeBoard({ 1:'1122', 4:'1122', 7:'1112', 10:'1112' }),
});
const p183BfCurrentExec = p183BfCurrent.canonicalReading?.primaryFormula?.result?.executorResult;
assert(p183BfCurrentExec?.sourceOutcome === 'current-place-good', 'p183 H1+H4 benefic pair gives the current-place positive clause');
assert(p183BfCurrentExec?.moveGood === false && p183BfCurrentExec?.sourceOutcome === 'current-place-good' && p183BfCurrent.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenInversions?.some((x) => x.includes('H7+H10')), 'p183 failed move pair stays non-positive and the safety policy explicitly forbids inversion into a bad move');
assert(p183BfCurrent.canonicalReading?.overallPositive === null, 'p183 comparison stays descriptive/non-binary');
assert(p183BfCurrent.professionalVerdictSafety?.certificationStatus === 'certified', 'p183 current-vs-new passed professional backfill');
const p183BfMove = buildKashfCanonicalAiBridge({
  questionId: 'q-move-home', questionText: 'מקום נוכחי מול מקום חדש',
  board: makeBoard({ 1:'1112', 4:'1112', 7:'1122', 10:'1122' }),
});
assert(p183BfMove.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'move-good', 'p183 H7+H10 benefic pair gives the move positive clause');
assert(!String(p183BfMove.canonicalReading?.primaryFormula?.result?.executorResult?.outputHebrew || '').includes('המקום הנוכחי רע'), 'p183 failed current pair is not inverted into a bad current place');
const p183BfBoth = buildKashfCanonicalAiBridge({
  questionId: 'q-move-home', questionText: 'מקום נוכחי מול מקום חדש',
  board: makeBoard({ 1:'1122', 4:'1122', 7:'1122', 10:'1122' }),
});
assert(p183BfBoth.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'both-good', 'p183 preserves both positive clauses together');
assert(!String(p183BfBoth.canonicalReading?.primaryFormula?.result?.executorResult?.outputHebrew || '').includes('טובה יותר'), 'p183 does not invent a ranking when both options qualify');
const p183BfMixed = buildKashfCanonicalAiBridge({
  questionId: 'q-move-home', questionText: 'מקום נוכחי מול מקום חדש',
  board: makeBoard({ 1:'2212', 4:'1122', 7:'1112', 10:'1112' }),
});
assert(p183BfMixed.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'unresolved', 'p183 mixed/nonqualifying evidence remains unresolved');

// PV-BF05-P256 — H10 planetary branch only; no fame or appointment inference.
const p256BfSun = buildKashfCanonicalAiBridge({ questionId: 'q-fame', questionText: 'מה מצב הכבוד והמעמד?', board: makeBoard({ 10:'1122' }) });
const p256BfSunExec = p256BfSun.canonicalReading?.primaryFormula?.result?.executorResult;
assert(p256BfSunExec?.planetHebrew === 'שמש' && p256BfSunExec?.condition === 'strong-honor-and-rank', 'p256 Sun branch preserves strength of honor/rank');
assert(p256BfSun.canonicalReading?.overallPositive === true, 'p256 Sun branch is positive');
assert(p256BfSun.professionalVerdictSafety?.certificationStatus === 'certified', 'p256 honor condition passed professional backfill');
assert(p256BfSun.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenClientClaimsWithoutExplicitSelectedMethodBranch?.includes('האדם יהיה מפורסם'), 'p256 policy blocks expansion into fame prediction');
const p256BfSaturn = buildKashfCanonicalAiBridge({ questionId: 'q-fame', questionText: 'מה מצב הכבוד והמעמד?', board: makeBoard({ 10:'1112' }) });
assert(p256BfSaturn.canonicalReading?.primaryFormula?.result?.executorResult?.planetHebrew === 'שבתאי', 'p256 Saturn fixture resolves the exact planet');
assert(p256BfSaturn.canonicalReading?.overallPositive === false, 'p256 Saturn branch is negative');
const p256BfOther = buildKashfCanonicalAiBridge({ questionId: 'q-fame', questionText: 'מה מצב הכבוד והמעמד?', board: makeBoard({ 10:'2222' }) });
assert(p256BfOther.canonicalReading?.primaryFormula?.result?.executorResult?.condition === 'unresolved-by-source', 'p256 unlisted planet remains source-unresolved');
assert(p256BfOther.canonicalReading?.overallPositive === null, 'p256 unlisted planet is not invented into positive/negative');

// PV-BF05-P257 appointment — exact planet-class test, with explicit else.
const p257AppointmentYes = buildKashfCanonicalAiBridge({
  questionId: 'q-position-keep', questionText: 'האם המינוי יתקיים?',
  board: makeBoard({ 1:'1111', 10:'2222' }),
});
const p257AppointmentYesExec = p257AppointmentYes.canonicalReading?.primaryFormula?.result?.executorResult;
assert(p257AppointmentYesExec?.resultPattern === '1111' && p257AppointmentYesExec?.planetHebrew === 'ירח', 'p257 appointment positive fixture resolves to Moon');
assert(p257AppointmentYesExec?.appointmentCompletes === true && p257AppointmentYes.canonicalReading?.overallPositive === true, 'p257 luminary result completes the appointment');
assert(p257AppointmentYes.professionalVerdictSafety?.certificationStatus === 'certified', 'p257 appointment passed professional backfill');
assert(p257AppointmentYes.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenInversions?.some((x) => x.includes('מיטיב/מזיק')), 'p257 appointment policy forbids fortune-class substitution');
const p257AppointmentNo = buildKashfCanonicalAiBridge({
  questionId: 'q-position-keep', questionText: 'האם המינוי יתקיים?',
  board: makeBoard({ 1:'1111', 10:'2221' }),
});
const p257AppointmentNoExec = p257AppointmentNo.canonicalReading?.primaryFormula?.result?.executorResult;
assert(p257AppointmentNoExec?.resultPattern === '1112' && p257AppointmentNoExec?.planetHebrew === 'שבתאי', 'p257 appointment negative fixture resolves to Saturn');
assert(p257AppointmentNoExec?.appointmentCompletes === false && p257AppointmentNo.canonicalReading?.overallPositive === false, 'p257 verified non-luminary/non-benefic planet activates the explicit no branch');

// PV-BF05-P257 ruler condition — derived H7+H10 only; mixed stays unresolved.
const p257RulerGood = buildKashfCanonicalAiBridge({ questionId: 'q-ruler-status', questionText: 'מה מצב בעל השררה?', board: makeBoard({ 7:'1122', 10:'2222' }) });
const p257RulerGoodExec = p257RulerGood.canonicalReading?.primaryFormula?.result?.executorResult;
assert(p257RulerGoodExec?.resultPattern === '1122' && p257RulerGoodExec?.rulerCondition === 'good', 'p257 ruler benefic derivation gives good condition');
assert(p257RulerGood.canonicalReading?.overallPositive === true, 'p257 ruler good branch is positive');
assert(p257RulerGood.professionalVerdictSafety?.certificationStatus === 'certified', 'p257 ruler condition passed professional backfill');
const p257RulerBad = buildKashfCanonicalAiBridge({ questionId: 'q-ruler-status', questionText: 'מה מצב בעל השררה?', board: makeBoard({ 7:'1112', 10:'2222' }) });
assert(p257RulerBad.canonicalReading?.primaryFormula?.result?.executorResult?.rulerCondition === 'bad', 'p257 ruler malefic derivation gives bad condition');
assert(p257RulerBad.canonicalReading?.overallPositive === false, 'p257 ruler bad branch is negative');
const p257RulerMixed = buildKashfCanonicalAiBridge({ questionId: 'q-ruler-status', questionText: 'מה מצב בעל השררה?', board: makeBoard({ 7:'1111', 10:'2222' }) });
assert(p257RulerMixed.canonicalReading?.primaryFormula?.result?.executorResult?.classification?.saadNahs === 'mixed', 'p257 ruler mixed fixture preserves mixed classification');
assert(p257RulerMixed.canonicalReading?.overallPositive === null, 'p257 ruler mixed result remains non-binary');
assert(p257RulerMixed.professionalVerdictSafety?.methodSpecificPolicy?.excludedFromPrimaryVerdict?.some((x) => x.includes('משך המלכות')), 'p257 ruler policy isolates kingship-duration/removal rules');



console.log('\n--- Professional backfill batch 06 ---');

// PV-BF06-P264 — descriptive planetary life stages only; no lifespan duration/aggregate verdict.
const p264StagesBf = buildKashfCanonicalAiBridge({
  questionId: 'q-lifespan-stages', questionText: 'ראשית אמצע וסוף החיים',
  board: makeBoard({ 11:'1122', 9:'1111', 7:'1112' }),
});
const p264StagesExec = p264StagesBf.canonicalReading?.primaryFormula?.result?.executorResult;
assert(JSON.stringify(p264StagesExec?.housesUsed) === JSON.stringify([11,9,7]), 'p264 stages reads exactly H11,H9,H7');
assert(p264StagesExec?.stages?.map((x) => x.stage).join(',') === 'beginning,middle,end', 'p264 stages preserves beginning/middle/end order');
assert(p264StagesExec?.stages?.[0]?.planetHebrew === 'שמש', 'p264 H11 fixture resolves the verified Sun attribution');
assert(p264StagesExec?.stages?.[1]?.planetHebrew === 'ירח', 'p264 H9 fixture resolves the verified Moon attribution');
assert(p264StagesExec?.stages?.[2]?.planetHebrew === 'שבתאי', 'p264 H7 fixture resolves the verified Saturn attribution');
assert(p264StagesBf.canonicalReading?.overallPositive === null, 'p264 life stages remains descriptive/non-binary');
assert(p264StagesBf.professionalVerdictSafety?.certificationStatus === 'certified', 'p264 life stages passed professional backfill');
assert(p264StagesBf.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenClientClaimsWithoutExplicitSelectedMethodBranch?.includes('כמה שנים יחיה האדם'), 'p264 policy blocks lifespan-duration expansion');

// PV-BF06-P180 — H10 inversion: angle+benefic positive, cadent negative, conflict unresolved.
const p180Angle = buildKashfCanonicalAiBridge({
  questionId: 'q-livelihood', questionText: 'מה מצב הפרנסה?',
  board: makeBoard({ 10:'2211', 1:'1122' }),
});
const p180AngleExec = p180Angle.canonicalReading?.primaryFormula?.result?.executorResult;
assert(p180AngleExec?.resultPattern === '1122', 'p180 inversion fixture produces 1122');
assert(p180AngleExec?.sourceOutcome === 'expanded-livelihood' && p180Angle.canonicalReading?.overallPositive === true, 'p180 benefic result in an angle gives expanded livelihood');
assert(p180Angle.professionalVerdictSafety?.certificationStatus === 'certified', 'p180 livelihood passed professional backfill');
const p180Cadent = buildKashfCanonicalAiBridge({
  questionId: 'q-livelihood', questionText: 'מה מצב הפרנסה?',
  board: makeBoard({ 10:'2211', 3:'1122' }),
});
assert(p180Cadent.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'unfavorable-livelihood', 'p180 cadent placement activates the explicit unfavorable branch');
assert(p180Cadent.canonicalReading?.overallPositive === false, 'p180 cadent branch is negative');
const p180Conflict = buildKashfCanonicalAiBridge({
  questionId: 'q-livelihood', questionText: 'מה מצב הפרנסה?',
  board: makeBoard({ 10:'2211', 1:'1122', 3:'1122' }),
});
assert(p180Conflict.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'conflicting-placement', 'p180 angle+cadent duplicate preserves source conflict');
assert(p180Conflict.canonicalReading?.overallPositive === null, 'p180 conflicting placement is not resolved by invented priority');

// PV-BF06-P181 — reconstructed board positive condition is one-way only.
const p181Yes = buildKashfCanonicalAiBridge({
  questionId: 'q-livelihood-arrive', questionText: 'האם הממון יושג?',
  board: makeBoard({ 2:'2121', 5:'2111', 8:'2112', 11:'2111' }),
});
const p181YesExec = p181Yes.canonicalReading?.primaryFormula?.result?.executorResult;
assert(p181YesExec?.recastMotherPatterns?.join(',') === '2121,2111,2112,2111', 'p181 uses original H2,H5,H8,H11 as the four recast mothers');
assert(p181YesExec?.allRequiredInternal === true && p181YesExec?.moneyObtained === true, 'p181 all required recast houses strictly internal => money obtained');
assert(p181Yes.canonicalReading?.overallPositive === true, 'p181 explicit money-obtained branch is positive');
assert(p181Yes.professionalVerdictSafety?.certificationStatus === 'certified', 'p181 money acquisition passed professional backfill');
const p181Unresolved = buildKashfCanonicalAiBridge({
  questionId: 'q-livelihood-arrive', questionText: 'האם הממון יושג?',
  board: makeBoard({ 2:'2121', 5:'2111', 8:'2112', 11:'2222' }),
});
assert(p181Unresolved.canonicalReading?.primaryFormula?.result?.executorResult?.allRequiredInternal === false, 'p181 counterfixture fails the all-internal condition');
assert(p181Unresolved.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'unresolved', 'p181 failed positive condition stays unresolved');
assert(p181Unresolved.canonicalReading?.overallPositive === null, 'p181 failed condition is not inverted into no-money');
assert(p181Unresolved.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenInversions?.some((x) => x.includes('אינו מוכיח')), 'p181 policy explicitly locks the no-inverse rule');

// PV-BF06-P266 — exact return-to-office positive/opposite branches and unresolved middle.
const p266Return = buildKashfCanonicalAiBridge({
  questionId: 'q-career-return', questionText: 'האם אחזור לתפקיד?',
  board: makeBoard({ 1:'2121', 4:'2121', 16:'1122' }),
});
const p266ReturnExec = p266Return.canonicalReading?.primaryFormula?.result?.executorResult;
assert(p266ReturnExec?.h1BeneficIncoming === true && p266ReturnExec?.appearsInStrongHouse === true && p266ReturnExec?.outcomeSupportsReturn === true && p266ReturnExec?.sourceOutcome === 'returns', 'p266 benefic-internal H1 + strong recurrence + benefic H16 gives return');
assert(p266Return.canonicalReading?.overallPositive === true, 'p266 return branch is positive');
assert(p266Return.professionalVerdictSafety?.certificationStatus === 'certified', 'p266 return-to-office passed professional backfill');
const p266No = buildKashfCanonicalAiBridge({
  questionId: 'q-career-return', questionText: 'האם אחזור לתפקיד?',
  board: makeBoard({ 1:'1112' }),
});
assert(p266No.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'does-not-return', 'p266 pure-malefic H1 activates the explicit opposite branch');
assert(p266No.canonicalReading?.overallPositive === false, 'p266 explicit opposite branch is negative');
const p266Unresolved = buildKashfCanonicalAiBridge({
  questionId: 'q-career-return', questionText: 'האם אחזור לתפקיד?',
  board: makeBoard({ 1:'2121', 16:'1112' }),
});
assert(p266Unresolved.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'unresolved', 'p266 incomplete positive testimony without pure-malefic H1 remains unresolved');
assert(p266Unresolved.canonicalReading?.overallPositive === null, 'p266 incomplete positive testimony is not inverted into no-return');

// PV-BF06-P204 attention — one explicit row-state condition; never promote it to love/exclusivity.
const p204AttentionMatch = buildKashfCanonicalAiBridge({
  questionId: 'q-who-looks-love', questionText: 'האם אדם זה מביט אלי או אל אחר?',
  board: makeBoard({ 1:'1111', 7:'1121', 13:'2222' }),
});
const p204AttentionMatchExec = p204AttentionMatch.canonicalReading?.primaryFormula?.result?.executorResult;
assert(p204AttentionMatchExec?.sourceConditionMet === true && p204AttentionMatchExec?.attention === 'mutual-and-others', 'p204 exact fire-row condition yields mutual-and-others attention');
assert(p204AttentionMatch.canonicalReading?.overallPositive === null, 'p204 attention is categorical/non-binary, not sentiment polarity');
assert(p204AttentionMatch.professionalVerdictSafety?.certificationStatus === 'certified', 'p204 attention passed professional backfill');
assert(p204AttentionMatch.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenClientClaimsWithoutExplicitSelectedMethodBranch?.includes('הוא אוהב אותך'), 'p204 attention policy forbids expansion into love');
const p204AttentionNoMatch = buildKashfCanonicalAiBridge({
  questionId: 'q-who-looks-love', questionText: 'האם אדם זה מביט אלי או אל אחר?',
  board: makeBoard({ 1:'1111', 7:'1121', 13:'1111' }),
});
assert(p204AttentionNoMatch.canonicalReading?.primaryFormula?.result?.executorResult?.sourceConditionMet === false, 'p204 counterfixture fails the exact H13 joined condition');
assert(p204AttentionNoMatch.canonicalReading?.primaryFormula?.result?.executorResult?.attention === null, 'p204 failed condition stays unresolved rather than inverted');
assert(p204AttentionNoMatch.canonicalReading?.overallPositive === null, 'p204 failed condition remains non-binary');


console.log('\n--- Professional backfill batch 07 ---');

// PV-BF07-P173-* — exact fire-row completion method; no H1+H16 alternate vote.
const p173Complete = buildKashfCanonicalAiBridge({ questionId: 'q-success', questionText: 'האם העניין יושלם', board: makeBoard({ 1:'2111', 5:'1112', 9:'1112', 10:'1112' }) });
assert(p173Complete.resolution?.kashfMethodId === 'completion.p173.fireRows15910', 'p173 exact completion route selected');
assert(p173Complete.canonicalReading?.primaryFormula?.result?.resultPattern === '2111', 'p173 fire-row fixture builds 2111');
assert(p173Complete.canonicalReading?.overallPositive === true, 'p173 internal result gives explicit completion');
assert(p173Complete.professionalVerdictSafety?.certificationStatus === 'certified', 'p173 completion passed professional backfill');
assert(p173Complete.professionalVerdictSafety?.methodSpecificPolicy?.excludedFromPrimaryVerdict?.some((x) => x.includes('H1+H16')), 'p173 policy excludes alternate H1+H16 method');
const p173No = buildKashfCanonicalAiBridge({ questionId: 'q-success', questionText: 'האם העניין יושלם', board: makeBoard({ 1:'1112', 5:'1112', 9:'1112', 10:'2111' }) });
assert(p173No.canonicalReading?.primaryFormula?.result?.resultPattern === '1112', 'p173 external fixture builds 1112');
assert(p173No.canonicalReading?.overallPositive === false, 'p173 external result gives explicit non-completion');

// PV-BF07-P183-PLACE-* — H4+H15 has explicit good/bad/mixed branches.
const p183PlaceGood = buildKashfCanonicalAiBridge({ questionId: 'q-move-city', questionText: 'מעבר ממקום למקום', board: makeBoard({ 4:'1111', 15:'2211' }) });
assert(p183PlaceGood.resolution?.kashfMethodId === 'relocation.p183.h4h15', 'p183 place-to-place exact route selected');
assert(p183PlaceGood.canonicalReading?.primaryFormula?.result?.resultPattern === '1122', 'p183 good fixture derives 1122');
assert(p183PlaceGood.canonicalReading?.overallPositive === true, 'p183 benefic H4+H15 gives good/blessed place');
assert(p183PlaceGood.professionalVerdictSafety?.certificationStatus === 'certified', 'p183 place-to-place passed professional backfill');
const p183PlaceBad = buildKashfCanonicalAiBridge({ questionId: 'q-move-city', questionText: 'מעבר ממקום למקום', board: makeBoard({ 4:'1111', 15:'2221' }) });
assert(p183PlaceBad.canonicalReading?.primaryFormula?.result?.resultPattern === '1112', 'p183 bad fixture derives 1112');
assert(p183PlaceBad.canonicalReading?.overallPositive === false, 'p183 malefic H4+H15 gives hardship branch');
const p183PlaceMixed = buildKashfCanonicalAiBridge({ questionId: 'q-move-city', questionText: 'מעבר ממקום למקום', board: makeBoard({ 4:'2222', 15:'2222' }) });
assert(p183PlaceMixed.canonicalReading?.primaryFormula?.result?.classification?.saadNahs === 'mixed', 'p183 mixed fixture preserves mixed classification');
assert(p183PlaceMixed.canonicalReading?.overallPositive === null, 'p183 mixed place remains non-binary');

// PV-BF07-P182-REL-* — H1+H3 only; seniority and other sibling variants remain separate.
const p182RelGood = buildKashfCanonicalAiBridge({ questionId: 'q-siblings', questionText: 'יחסים בין אחים', board: makeBoard({ 1:'1111', 3:'2211' }) });
assert(p182RelGood.resolution?.kashfMethodId === 'siblings.p182.h1h3', 'p182 sibling relationship exact route selected');
assert(p182RelGood.canonicalReading?.overallPositive === true, 'p182 benefic H1+H3 gives agreement');
assert(p182RelGood.professionalVerdictSafety?.certificationStatus === 'certified', 'p182 sibling relationship passed professional backfill');
const p182RelBad = buildKashfCanonicalAiBridge({ questionId: 'q-siblings', questionText: 'יחסים בין אחים', board: makeBoard({ 1:'1111', 3:'2221' }) });
assert(p182RelBad.canonicalReading?.overallPositive === false, 'p182 malefic H1+H3 gives corruption/dispute branch');
assert(p182RelGood.professionalVerdictSafety?.methodSpecificPolicy?.excludedFromPrimaryVerdict?.some((x) => x.includes('seniority')), 'p182 relationship policy isolates sibling-seniority method');

// PV-BF07-P238-TRAVEL-* — exact four-house all-row assembly.
const p238Good = buildKashfCanonicalAiBridge({ questionId: 'q-travel-safe', questionText: 'האם המסע טוב', board: makeBoard({ 1:'1122', 3:'2222', 5:'2222', 9:'2222' }) });
assert(p238Good.resolution?.kashfMethodId === 'travel.p238.assemble1359', 'p238 travel success exact route selected');
assert(p238Good.canonicalReading?.primaryFormula?.result?.resultPattern === '1122', 'p238 assembly preserves benefic fixture');
assert(p238Good.canonicalReading?.overallPositive === true, 'p238 benefic assembly gives good travel');
assert(p238Good.professionalVerdictSafety?.certificationStatus === 'certified', 'p238 travel success passed professional backfill');
const p238Bad = buildKashfCanonicalAiBridge({ questionId: 'q-travel-safe', questionText: 'האם המסע טוב', board: makeBoard({ 1:'1112', 3:'2222', 5:'2222', 9:'2222' }) });
assert(p238Bad.canonicalReading?.primaryFormula?.result?.resultPattern === '1112', 'p238 assembly preserves malefic fixture');
assert(p238Bad.canonicalReading?.overallPositive === false, 'p238 malefic assembly gives caution branch');
assert(p238Good.professionalVerdictSafety?.methodSpecificPolicy?.excludedFromPrimaryVerdict?.some((x) => x.includes('timeSelection')), 'p238 success policy isolates named-figure time-selection method');

// PV-BF07-P199-* — H6 source table only; missing table row remains unresolved.
const p199Mapped = buildKashfCanonicalAiBridge({ questionText: 'איפה בגוף החולי', board: makeBoard({ 6:'1112' }) });
assert(p199Mapped.resolution?.kashfMethodId === 'illness.bodyPart.h6Figure', 'p199 body-part free text resolves exact method');
assert(p199Mapped.canonicalReading?.primaryFormula?.result?.executorResult?.bodyPartHebrew === 'הרגל השמאלית', 'p199 source table maps 1112 to left leg');
assert(p199Mapped.professionalVerdictSafety?.certificationStatus === 'certified', 'p199 body-part method passed professional backfill');
assert(p199Mapped.professionalVerdictSafety?.authoritativePolarity === 'non-binary', 'p199 body-part result stays categorical/non-binary');
const p199Unlisted = buildKashfCanonicalAiBridge({ questionText: 'איפה בגוף החולי', board: makeBoard({ 6:'1121' }) });
assert(p199Unlisted.canonicalReading?.primaryFormula?.result?.executorResult?.bodyPartHebrew === null, 'p199 unlisted 1121 does not invent a body part');
assert(p199Mapped.professionalVerdictSafety?.methodSpecificPolicy?.excludedFromPrimaryVerdict?.some((x) => x.includes('אבחנה רפואית')), 'p199 policy blocks medical-diagnosis expansion');

// PV-BF07-P191-CHILD-* — safety, fear, and severe-risk wording stay distinct.
const p191ChildSafe = buildKashfCanonicalAiBridge({ questionId: 'q-child-survive', questionText: 'האם הוולד יהיה בשלום', board: makeBoard({ 1:'2111', 6:'2222', 8:'2222' }) });
assert(p191ChildSafe.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'safety', 'p191 H1 benefic gives safety testimony');
assert(p191ChildSafe.canonicalReading?.overallPositive === true, 'p191 safety branch is positive');
assert(p191ChildSafe.professionalVerdictSafety?.certificationStatus === 'certified', 'p191 child-safety method passed professional backfill');
const p191ChildFear = buildKashfCanonicalAiBridge({ questionId: 'q-child-survive', questionText: 'האם הוולד יהיה בשלום', board: makeBoard({ 1:'1112', 6:'2222', 8:'2222' }) });
assert(p191ChildFear.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'fear', 'p191 H1 malefic preserves fear branch');
assert(p191ChildFear.canonicalReading?.overallPositive === null, 'p191 fear is not inverted into certain non-survival');
const p191ChildSevere = buildKashfCanonicalAiBridge({ questionId: 'q-child-survive', questionText: 'האם הוולד יהיה בשלום', board: makeBoard({ 1:'2111', 6:'1112', 8:'1112' }) });
assert(p191ChildSevere.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'severe-risk', 'p191 H6+H8 malefic activates severe source warning');
assert(p191ChildSevere.canonicalReading?.overallPositive === null, 'p191 severe warning is not converted into certain death');
assert(p191ChildSafe.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenInversions?.some((x) => x.includes('ודאי')), 'p191 child-safety policy blocks certainty inflation');

// PV-BF07-P191-DELIVERY-* — exact ease/difficulty signs, no H15 vote.
const p191DeliveryEasy = buildKashfCanonicalAiBridge({ questionId: 'q-birth-ease', questionText: 'לידה קלה או קשה', board: makeBoard({ 1:'1112', 5:'1112', 15:'2222' }) });
assert(p191DeliveryEasy.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'easy', 'p191 masculine H1+H5 gives ease sign');
assert(p191DeliveryEasy.canonicalReading?.overallPositive === true, 'p191 easy-delivery branch is positive');
assert(p191DeliveryEasy.professionalVerdictSafety?.certificationStatus === 'certified', 'p191 delivery-difficulty method passed professional backfill');
const p191DeliveryHard = buildKashfCanonicalAiBridge({ questionId: 'q-birth-ease', questionText: 'לידה קלה או קשה', board: makeBoard({ 1:'2222', 5:'2222', 15:'2111' }) });
assert(p191DeliveryHard.canonicalReading?.primaryFormula?.result?.executorResult?.sourceOutcome === 'difficult', 'p191 fixed H5 gives difficulty sign');
assert(p191DeliveryHard.canonicalReading?.overallPositive === false, 'p191 difficult-delivery branch is negative');
assert(p191DeliveryEasy.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenInversions?.some((x) => x.includes('H15')), 'p191 delivery policy forbids an invented H15 vote');

// PV-BF07-P167-* — hidden action only; no sorcery/jinn/evil-eye promotion.
const p167Hidden = buildKashfCanonicalAiBridge({ questionText: 'האם יש פעולה מאחורי הדבר', board: makeBoard({ 4:'1111', 6:'1111', 8:'1111', 15:'1211' }) });
assert(p167Hidden.resolution?.kashfMethodId === 'spiritual.p167.hiddenActionAirRows46815', 'p167 hidden-action free text resolves exact method');
assert(p167Hidden.canonicalReading?.primaryFormula?.result?.executorResult?.derivedPattern === '1112', 'p167 air rows derive the malefic fixture 1112');
assert(p167Hidden.canonicalReading?.overallPositive === true, 'p167 malefic derived figure means hidden action exists');
assert(p167Hidden.professionalVerdictSafety?.certificationStatus === 'certified', 'p167 hidden-action method passed professional backfill');
const p167None = buildKashfCanonicalAiBridge({ questionText: 'האם יש פעולה מאחורי הדבר', board: makeBoard({ 4:'1111', 6:'1111', 8:'1211', 15:'1211' }) });
assert(p167None.canonicalReading?.primaryFormula?.result?.executorResult?.derivedPattern === '1122', 'p167 air rows derive benefic fixture 1122');
assert(p167None.canonicalReading?.overallPositive === false, 'p167 non-malefic derived figure activates explicit no-action complement');
assert(p167Hidden.professionalVerdictSafety?.methodSpecificPolicy?.forbiddenClientClaimsWithoutExplicitSelectedMethodBranch?.some((x) => x.includes('כישוף')), 'p167 policy forbids expanding hidden action into sorcery');

// Six runnable methods remain intentionally uncertified after source/implementation audit.
for (const id of [
  'money.p179.sourceByIncomingHonorHouse',
  'marriage.p211.dissolutionH7StateMatrix',
  'profession.p254.h9Planet',
  'theft.p225.thiefDescriptionH7',
  'child.p194.healthTrajectoryH6H8',
  'missing.p248-249.lifeH1H4H9Outcome',
]) {
  assert(!KASHF_PROFESSIONAL_CERTIFIED_METHOD_IDS.includes(id), id + ' remains pending professional source closure');
}

console.log(`\nKashf professional verdict safety tests: ${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
