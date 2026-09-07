#!/usr/bin/env node
import {
  KASHF_AI_RETRIEVAL_INDEX,
  getKashfAiRetrievalRecord,
  searchKashfAiRetrievalIndex,
  resolveBestKashfAiRetrievalHit,
  validateKashfAiRetrievalIndex,
} from './goral-hachol/registry/kashf-ai-retrieval-index.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) passed += 1;
  else {
    failed += 1;
    console.error('FAIL:', message);
  }
}

const validation = validateKashfAiRetrievalIndex();
assert(validation.valid, `AI retrieval index valid: ${validation.errors.join('; ')}`);
assert(validation.sourceReadyCoveredCount === validation.sourceReadyCount, `all source-ready methods indexed: ${validation.sourceReadyCoveredCount}/${validation.sourceReadyCount}`);
assert(validation.runnableCoveredCount === validation.runnableCount, `all runnable methods indexed: ${validation.runnableCoveredCount}/${validation.runnableCount}`);
assert(validation.recordCount >= validation.sourceReadyCount, 'retrieval index contains at least all source-ready methods');

for (const record of Object.values(KASHF_AI_RETRIEVAL_INDEX)) {
  assert(record.operationalLanguage === 'he', `${record.kashfMethodId}: Hebrew is operational language`);
  assert(record.operationalRole === 'operational-primary', `${record.kashfMethodId}: v57 is operational-primary`);
  assert(record.arabicVerificationRole === 'verification-only', `${record.kashfMethodId}: Arabic is verification-only`);
  assert(record.v57.indexFile === 'kashf-v57-topic-index.html', `${record.kashfMethodId}: points to topic index`);
  assert(record.v57.draftFile === 'kashf-v57-draft.html', `${record.kashfMethodId}: points to v57 draft`);
  assert(Array.isArray(record.pages) && record.pages.length > 0, `${record.kashfMethodId}: has exact source pages`);
  assert(typeof record.v57.hebrewRule === 'string' && record.v57.hebrewRule.length > 0, `${record.kashfMethodId}: has Hebrew rule`);
}

function expectTop(query, methodId, options = {}) {
  const results = searchKashfAiRetrievalIndex(query, { limit: 5, ...options });
  assert(results.length > 0, `${query}: returns retrieval candidates`);
  assert(results[0]?.kashfMethodId === methodId, `${query}: top result is ${methodId}, got ${results[0]?.kashfMethodId || 'none'}`);
  return results[0] || null;
}

expectTop('האם החולה יחלים', 'illness.p196.outcomeH15');
expectTop('איפה בגוף החולי', 'illness.bodyPart.h6Figure');
expectTop('האם יש הריון', 'pregnancy.p191.existsH5SilentEmpty');
expectTop('בן או בת', 'pregnancy.p191.genderH5');
expectTop('בתולה או גרושה', 'marriage.p204.previousStatusH7inH10');
expectTop('מה גודל המוהר', 'marriage.p204.dowryH8');
expectTop('אל מי מופנה המבט', 'love.p204.attentionFireRows1713');
expectTop('האם האישה תמצא חן בעיניו', 'love.p206.womanFavorH7H11ThenH5');
expectTop('האם השואל רוצה בדבר', 'desire.p206.querentWantsH7H11ThenH5');
expectTop('להישאר במקום או לעבור', 'relocation.p183.stayMoveH1H2');
expectTop('מקום נוכחי מול מקום חדש', 'relocation.p183.currentVsNewPlace');
expectTop('מעבר ממקום למקום', 'relocation.p183.h4h15');
expectTop('מה מזלי בלבוש', 'clothing.p264-265.luck');
expectTop('מה מצב דתו', 'religion.p253.h3h9Quality');
expectTop('האם יהיה פיוס', 'dispute.p212.reconciliationH1H7');
expectTop('תיאור הגנב', 'theft.p225.thiefDescriptionH7');
expectTop('מה הקשר של הגנב', 'theft.p224.relationshipH7Recurrence');
expectTop('האם יקבל משרה', 'authority.p257.appointmentH1H10Planet');
expectTop('מה מצב הכבוד והמעמד', 'authority.p256.honorConditionH10Planet');
expectTop('מה המקצוע שלו', 'profession.p254.h9Planet');
expectTop('האם האבדה תחזור', 'lostItem.p202.returnH6H8');
expectTop('האם המטמון במקומו', 'hidden.p188.isStillThere');
expectTop('מה תוצאת העניין', 'matter.p172.h17_h1011_thenCombine');
expectTop('האם העניין יושלם', 'completion.p173.fireRows15910');

const exactQuestion = resolveBestKashfAiRetrievalHit('q-clothing-lucky');
assert(exactQuestion.resolved === true, 'exact question id resolves');
assert(exactQuestion.best?.kashfMethodId === 'clothing.p264-265.luck', 'q-clothing-lucky resolves exact clothing method');

const exactMethod = resolveBestKashfAiRetrievalHit('marriage.p204.dowryH8');
assert(exactMethod.resolved === true, 'exact method id resolves');
assert(exactMethod.best?.kashfMethodId === 'marriage.p204.dowryH8', 'exact method id remains exact');

const clothing = getKashfAiRetrievalRecord('clothing.p264-265.luck');
assert(JSON.stringify(clothing?.houses) === JSON.stringify([5, 10, 11]), 'clothing record exposes exact method houses');
assert(clothing?.doNotMixWith.includes('clothing.color'), 'clothing luck explicitly warns not to mix with color subrule');
assert(clothing?.questionIds.includes('q-clothing-lucky'), 'clothing record links the app question id');
assert(clothing?.runtimeAllowed === true && clothing?.executorStatus === 'ready', 'clothing record exposes current runtime state');

const stayMove = getKashfAiRetrievalRecord('relocation.p183.stayMoveH1H2');
assert(stayMove?.doNotMixWith.includes('relocation.p183.currentVsNewPlace'), 'stay/move warns against current-vs-new method mixing');
assert(stayMove?.pages.includes(178) && stayMove?.pages.includes(183), 'stay/move carries both v57 source pages');

const pregnancy = getKashfAiRetrievalRecord('pregnancy.p191.existsH5SilentEmpty');
assert(pregnancy?.doNotMixWith.includes('pregnancy.p191.genderH5'), 'pregnancy existence separated from gender');

const sourceReadyPendingResults = searchKashfAiRetrievalIndex('בריאות הוולד', { sourceReadyOnly: true, limit: 20 });
assert(sourceReadyPendingResults.some((item) => item.kashfMethodId === 'child.p194.healthTrajectoryH6H8' || item.kashfMethodId === 'pregnancy.p191.childSafetyH1H6H8'), 'source-ready pending methods are retrievable as knowledge');

const runnableOnly = searchKashfAiRetrievalIndex('הריון', { runnableOnly: true, limit: 20 });
assert(runnableOnly.every((item) => item.runtimeAllowed === true && item.executorStatus === 'ready'), 'runnableOnly filter never returns pending executor');

console.log(`Kashf AI retrieval index tests: ${passed} passed, ${failed} failed`);
console.log(`Indexed records: ${validation.recordCount}; source-ready coverage: ${validation.sourceReadyCoveredCount}/${validation.sourceReadyCount}; runnable coverage: ${validation.runnableCoveredCount}/${validation.runnableCount}`);
if (validation.warnings.length) console.log(`Warnings: ${validation.warnings.length}`);
if (failed > 0) process.exit(1);
