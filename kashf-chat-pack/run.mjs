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

// These four legacy formula routes already return short, branch-specific
// Hebrew verdicts, rather than an advisor explanation. Each of their three
// reachable outcomes is pinned against real boards in verify.mjs.
const DIRECT_VERDICT_TEXT_METHODS = new Set([
  'completion.p173.fireRows15910',
  'relocation.p183.h4h15',
  'siblings.p182.h1h3',
  'travel.p238.assemble1359',
]);

function explicitClientDraft(reading, methodId) {
  const execution = reading?.primaryFormula?.result?.executorResult;
  const text = execution?.clientSafeHebrew ??
    (execution == null && DIRECT_VERDICT_TEXT_METHODS.has(methodId) ? reading?.verdict?.text : null);
  if (typeof text !== 'string' || !text.trim()) return null;
  const value = text.trim();
  // The advisor's outputHebrew can include provenance, raw figures and
  // working notes. Never fall back to it for a client draft.
  if (/[\u0600-\u06ff]/u.test(value) || /(?:^|[^0-9])[12]{4}(?![0-9])/u.test(value) ||
      /\b[a-z][a-z0-9]*\.[a-z][a-z0-9]*\.[a-zA-Z0-9]+\b/u.test(value) ||
      /עמ[׳']|\bPDF\b/u.test(value)) return null;
  return value;
}

export function runKashfPack(input) {
  if (!input || !Array.isArray(input.mothers) || input.mothers.length !== 4 ||
      input.mothers.some(pattern => typeof pattern !== 'string' || !/^[12]{4}$/.test(pattern))) {
    return blocked('נדרשות ארבע צורות אמהות תקינות, כל אחת בת ארבע שורות 1/2.');
  }
  const questionId = typeof input.questionId === 'string' ? input.questionId.trim() : '';
  const methodId = typeof input.methodId === 'string' ? input.methodId.trim() : '';
  if (Boolean(questionId) === Boolean(methodId)) return blocked('בחר questionId אחד או methodId אחד, לא שניהם.');

  // Only the inputs required by the four explicitly named methods are passed
  // through. They are per-reading values, never written into the package or
  // returned to the caller as part of the board/evidence output.
  const methodInputs = input.methodInputs ?? {};
  if (!methodInputs || typeof methodInputs !== 'object' || Array.isArray(methodInputs) ||
      Object.keys(methodInputs).some(key => !['candidate', 'castConfirmedOnName', 'motherCastPeriod', 'quarterPatterns'].includes(key))) {
    return blocked('methodInputs מכיל שדה לא מוכר. מותר למסור רק קלט ייעודי לשיטה שנבחרה.');
  }
  const dynFields = {};
  if ('candidate' in methodInputs) {
    if (typeof methodInputs.candidate !== 'string' || !methodInputs.candidate.trim()) return blocked('יש למסור שם מועמדת תקין לשיטה הדורשת הטלה על שם.');
    dynFields.candidate = methodInputs.candidate.trim();
  }
  if ('castConfirmedOnName' in methodInputs) {
    if (typeof methodInputs.castConfirmedOnName !== 'boolean') return blocked('אישור הטלה על שם חייב להיות true או false מפורש.');
    dynFields.castConfirmedOnName = methodInputs.castConfirmedOnName;
  }
  if ('motherCastPeriod' in methodInputs) {
    if (!['יום', 'לילה'].includes(methodInputs.motherCastPeriod)) return blocked('זמן הטלה בשיטת האם חייב להיות יום או לילה.');
    dynFields.motherCastPeriod = methodInputs.motherCastPeriod;
  }
  if ('quarterPatterns' in methodInputs) {
    if (!Array.isArray(methodInputs.quarterPatterns) || methodInputs.quarterPatterns.length !== 4 ||
        methodInputs.quarterPatterns.some(pattern => typeof pattern !== 'string' || !/^[12]{4}$/.test(pattern))) {
      return blocked('לכיוון החפירה דרושות ארבע צורות תקינות מהטלות עצמאיות.');
    }
    methodInputs.quarterPatterns.forEach((pattern, index) => { dynFields[`quarter${index + 1}Pattern`] = pattern; });
  }
  const clientContext = { dynFields };

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
    const bridge = buildKashfCanonicalAiBridge({ board, questionId, clientContext });
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
    canonicalReading = buildKashfReadingByMethod(board, methodId, clientContext);
    canonicalRetrieval = record;
    safety = buildKashfProfessionalVerdictSafety({ resolution, canonicalReading,
      canonicalRetrieval, baseAiVerdictAllowed: canonicalReading?.valid === true && canonicalReading?.canRunKashf === true });
  }

  const activeMethodId = resolution?.kashfMethodId || methodId;
  const safe = safety?.isSafe === true && canonicalReading?.valid === true && canonicalReading?.canRunKashf === true;
  const methodPolicyCertified = safe && safety?.clientFacingCertified === true;
  const clientDraft = methodPolicyCertified ? explicitClientDraft(canonicalReading, activeMethodId) : null;
  const certified = methodPolicyCertified && clientDraft !== null;
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
    safety: { isSafe: safe, certificationStatus: safety?.certificationStatus || 'not-applicable',
      methodPolicyCertified, clientFacingCertified: certified,
      clientDraftGate: certified ? 'explicit-client-safe-text' : 'advisor-only',
      authoritativePolarity: safe ? safety?.authoritativePolarity ?? null : null },
    // Engine text is for the advisor. It can contain source locators and must
    // not be copied verbatim into the client answer.
    authoritativeEngineText: safe ? canonicalReading?.primaryFormula?.result?.executorResult?.outputHebrew ?? null : null,
    clientAnswerDraft: certified ? clientDraft : null,
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
