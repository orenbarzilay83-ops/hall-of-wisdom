import { pathToFileURL } from 'node:url';
import { buildRamlBoardFromMothers } from './runtime/goral-hachol/engine/raml-board-generator.js';
import { buildKashfCanonicalAiBridge } from './runtime/goral-hachol/intelligence/kashf-canonical-ai-bridge.js';
import { buildKashfReadingByMethod } from './runtime/goral-hachol/engine/kashf-canonical-reading-engine.js';
import { getKashfMethod } from './runtime/goral-hachol/registry/kashf-canonical-method-registry.js';
import { getKashfAiRetrievalRecord } from './runtime/goral-hachol/registry/kashf-ai-retrieval-index.js';
import { buildKashfProfessionalVerdictSafety } from './runtime/goral-hachol/intelligence/kashf-professional-verdict-safety.js';
import { buildQawlSpiritualReading, QAWL_SPIRITUAL_QUESTION_IDS } from './runtime/goral-hachol/engine/qawl-spiritual-kashf-bridge.js';

function blocked(reason) {
  return { status: 'blocked', reason, verdict: null, clientAnswerDraft: null };
}

export function runKashfPack(input) {
  if (!input || !Array.isArray(input.mothers) || input.mothers.length !== 4 ||
      input.mothers.some(pattern => typeof pattern !== 'string' || !/^[12]{4}$/.test(pattern))) {
    return blocked('נדרשות ארבע צורות אמהות תקינות, כל אחת בת ארבע שורות 1/2.');
  }
  const questionId = typeof input.questionId === 'string' ? input.questionId.trim() : '';
  const methodId = typeof input.methodId === 'string' ? input.methodId.trim() : '';
  if (Boolean(questionId) === Boolean(methodId)) return blocked('בחר questionId אחד או methodId אחד, לא שניהם.');

  const board = buildRamlBoardFromMothers(input.mothers);
  const houses = board.entries.map(({ houseNumber, pattern, hebrewName }) => ({ houseNumber, pattern, hebrewName }));
  const boardOutput = { houses, boardValidation: board.boardValidation };
  if (board.boardValidation?.isValid !== true) return { ...blocked('הלוח נפסל לפי בדיקת התקינות.'), ...boardOutput };

  if (QAWL_SPIRITUAL_QUESTION_IDS.includes(questionId)) {
    const reading = buildQawlSpiritualReading(board, questionId, { gender: input.gender });
    if (!reading.valid) return { ...blocked(reading.message || 'כלל המקור המשלים אינו מכריע בלוח זה.'), ...boardOutput,
      questionId, sourceVolume: 'al-qawl-al-jami', sourceBook: 'القول الجامع في علم الرمل' };
    return {
      status: 'ok', reason: null, ...boardOutput, questionId, methodId: null,
      sourceVolume: reading.sourceVolume, sourceBook: reading.sourceBook, sourcePages: [57, 58], sourceStatus: reading.status,
      openCount: reading.openCount, remainder: reading.remainder,
      isqatEvidence: reading.isqatEvidence, directEvidence: reading.directEvidence,
      jinnTypeEvidence: reading.jinnTypeEvidence, sourceEvidence: reading.evidence,
      verdict: null, overallPositive: null, clientAnswerDraft: null,
      safety: { isSafe: true, certificationStatus: 'source-evidence-only', clientFacingCertified: false },
    };
  }

  let resolution, canonicalReading, canonicalRetrieval, safety;
  if (questionId) {
    const bridge = buildKashfCanonicalAiBridge({ board, questionId });
    ({ resolution, canonicalReading, canonicalRetrieval } = bridge);
    safety = bridge.professionalVerdictSafety;
  } else {
    const method = getKashfMethod(methodId);
    if (!method || method.methodRole !== 'canonical-operational' || method.attributedSourceBook !== 'Kashf' ||
        method.sourceLayer !== 'body' || method.kashfRuntimeStatus !== 'ready' ||
        method.runtimeAllowed !== true || method.executorStatus !== 'ready') {
      return { ...blocked('השיטה אינה מאושרת להפעלה.'), ...boardOutput, methodId };
    }
    const record = getKashfAiRetrievalRecord(methodId);
    if (!record?.v57?.hebrewRule) return { ...blocked('כלל v57 עברי אינו זמין.'), ...boardOutput, methodId };
    resolution = { state: 'resolved', kashfMethodId: methodId, kashfIntentId: method.kashfIntentId,
      kashfRuntimeStatus: 'ready', runtimeAllowed: true, executorStatus: 'ready' };
    canonicalReading = buildKashfReadingByMethod(board, methodId);
    canonicalRetrieval = record;
    safety = buildKashfProfessionalVerdictSafety({ resolution, canonicalReading,
      canonicalRetrieval, baseAiVerdictAllowed: canonicalReading?.valid === true && canonicalReading?.canRunKashf === true });
  }

  const activeMethodId = resolution?.kashfMethodId || methodId;
  const safe = safety?.isSafe === true && canonicalReading?.valid === true && canonicalReading?.canRunKashf === true;
  const certified = safe && safety?.clientFacingCertified === true;
  return {
    status: safe ? 'ok' : 'blocked',
    reason: safe ? null : (resolution?.userMessage || canonicalReading?.userMessage || canonicalReading?.reason || 'שער הבטיחות חסם את הפסק.'),
    ...boardOutput,
    questionId: questionId || null,
    methodId: activeMethodId || null,
    intentId: resolution?.kashfIntentId || null,
    sourcePage: canonicalRetrieval?.v57?.page ?? null,
    sourceRuleHebrew: safe ? canonicalRetrieval?.v57?.hebrewRule ?? null : null,
    methodResult: safe ? (canonicalReading?.primaryFormula?.result ?? null) : null,
    verdict: safe ? canonicalReading?.verdict ?? null : null,
    overallPositive: safe ? canonicalReading?.overallPositive ?? null : null,
    safety: { isSafe: safe, certificationStatus: safety?.certificationStatus || 'not-applicable', clientFacingCertified: certified,
      authoritativePolarity: safe ? safety?.authoritativePolarity ?? null : null },
    // Engine text is for the advisor. It can contain source locators and must
    // not be copied verbatim into the client answer.
    authoritativeEngineText: certified ? safety?.authoritativeClientDraftHebrew ?? null : null,
    clientAnswerDraft: null,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const raw = process.argv[2];
    const input = JSON.parse(raw ?? 'null');
    console.log(JSON.stringify(runKashfPack(input), null, 2));
  } catch (error) {
    console.log(JSON.stringify(blocked(`קלט לא תקין: ${error instanceof Error ? error.message : String(error)}`), null, 2));
    process.exitCode = 1;
  }
}
