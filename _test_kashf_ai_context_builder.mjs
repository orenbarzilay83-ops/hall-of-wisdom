/**
 * _test_kashf_ai_context_builder.mjs
 *
 * Proves goral-hachol/intelligence/kashf-ai-context-builder.js wires REAL
 * engine calls (not fabricated data) into an AiContextPackage, that the
 * AI-safe engineOutput projection (Layer 1) never mutates the original
 * reading and never leaks any forbidden personal-data key, and that the
 * real kashf_reading_payload_sanitizer.ts (Layer 2, unmodified) accepts
 * the resulting payload. Also proves rule-level fields
 * (activatedRuleIds/rejectedRuleIds/sourceEvidence/decisionSummary) are
 * honestly reported as missing, never invented.
 *
 * No AI call. No fetch. No network. No UI. No change to any Kashf engine
 * file (kashf-reading-engine.js, kashf-commerce-smart-layer.js, etc.).
 */

import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { buildKashfReading } from './goral-hachol/engine/kashf-reading-engine.js';
import { analyzeIntent } from './goral-hachol/intelligence/intent-analyzer.js';
import { buildReadingStrategy } from './goral-hachol/intelligence/reading-strategy-builder.js';
import { buildReadingPlan } from './goral-hachol/intelligence/reading-planner.js';
import {
  buildKashfAiContextPackage,
  buildAiSafeKashfEngineOutput,
  KASHF_AI_CONTEXT_BUILDER_VERSION,
} from './goral-hachol/intelligence/kashf-ai-context-builder.js';
import { sanitizeKashfReadingPayloadForAi } from './supabase/functions/oren-smart-advisor/kashf_reading_payload_sanitizer.ts';

let failures = 0;
function assert(condition, message) {
  if (!condition) { failures++; console.error(`✗ ${message}`); }
  else { console.log(`✓ ${message}`); }
}

const MOTHERS = ['2222', '2211', '2121', '2221'];
const TOPIC_ID = 'commerce';
const QUESTION = 'האם העסק החדש יצליח?';
const FORBIDDEN_KEYS = ['phone', 'dynFields', 'parentName', 'maritalStatus', 'hasChildren', 'clientHistorySummary', 'workStatus', 'quesitedName', 'rawClientHistory', 'clientContext'];

console.log(`\n--- ${KASHF_AI_CONTEXT_BUILDER_VERSION} ---\n`);

const directBoard = buildRamlBoardFromMothers(MOTHERS);
const directRawEngineOutput = buildKashfReading(directBoard, TOPIC_ID, { name: '', question: QUESTION });

const { contextPackage, completeness, missingFields, intentResult } = buildKashfAiContextPackage({
  mothers: MOTHERS,
  topicId: TOPIC_ID,
  question: QUESTION,
  readingId: 'test-reading-001',
});

// ── 1. buildKashfReading's own real output still contains clientContext (engine untouched) ──
console.log('--- 1. buildKashfReading() itself is unmodified ---');
{
  const freshRawEngineOutput = buildKashfReading(buildRamlBoardFromMothers(MOTHERS), TOPIC_ID, { name: '', question: QUESTION });
  assert('clientContext' in freshRawEngineOutput, 'a direct, fresh buildKashfReading() call still returns clientContext (engine function itself was not edited)');
  assert(JSON.stringify(freshRawEngineOutput.clientContext).includes('maritalStatus'), 'clientContext still echoes maritalStatus etc. exactly as before — no change to kashf-reading-engine.js');
}

// ── 2. buildAiSafeKashfEngineOutput does not mutate its input ────────────
console.log('\n--- 2. AI-safe projection does not mutate the original object ---');
{
  const before = JSON.stringify(directRawEngineOutput);
  const projected = buildAiSafeKashfEngineOutput(directRawEngineOutput);
  const after = JSON.stringify(directRawEngineOutput);
  assert(before === after, 'directRawEngineOutput is byte-for-byte unchanged after calling buildAiSafeKashfEngineOutput on it');
  assert(projected !== directRawEngineOutput, 'projection returns a new object, not the same reference');
  assert('clientContext' in directRawEngineOutput, 'the original object still has clientContext after projection (not deleted from it)');
}

// ── 3. Payload's engineOutput has no clientContext at all ────────────────
console.log('\n--- 3. No clientContext in the payload engineOutput ---');
{
  assert(!('clientContext' in contextPackage.readingContext.engineOutput), 'contextPackage.readingContext.engineOutput has no clientContext key');
}

// ── 4. No forbidden key anywhere in the payload, not even null/empty ─────
console.log('\n--- 4. No forbidden keys anywhere in the payload (allowlist proof) ---');
{
  const json = JSON.stringify(contextPackage);
  for (const key of FORBIDDEN_KEYS) {
    assert(!json.includes(`"${key}"`), `payload JSON does not contain the forbidden key "${key}" (not even as null/empty)`);
  }
  // The deeper leak path found during investigation — must be gone too.
  assert(!('contextRelevance' in (contextPackage.readingContext.engineOutput.commerceSmartLayer?.advisorDiagnosis || {})),
    'commerceSmartLayer.advisorDiagnosis.contextRelevance (the nested leak) is absent');
}

// ── 5. Required professional fields are preserved ─────────────────────────
console.log('\n--- 5. Professional fields preserved by the allowlist ---');
{
  const eo = contextPackage.readingContext.engineOutput;
  for (const key of ['valid', 'topicId', 'primaryFormula', 'overallPositive', 'dhamir', 'witnessTestimony']) {
    assert(key in eo, `engineOutput retains professional field "${key}"`);
  }
  assert(eo.valid === directRawEngineOutput.valid, 'engineOutput.valid matches the real engine verdict');
  assert(eo.overallPositive === directRawEngineOutput.overallPositive, 'engineOutput.overallPositive matches the real engine verdict');
  const csl = eo.commerceSmartLayer;
  assert(!!csl, 'commerceSmartLayer preserved (topic-specific real signal data)');
  for (const key of ['weightedHouses', 'certaintyLevel', 'strongestSignals', 'clientWording', 'practicalGuidance']) {
    assert(key in csl, `commerceSmartLayer retains professional field "${key}"`);
  }
  for (const key of ['weightedHouses', 'certaintyLevel', 'supportRatio', 'contextAdjustments']) {
    assert(key in csl.advisorDiagnosis, `commerceSmartLayer.advisorDiagnosis retains professional field "${key}"`);
  }
}

// ── 6. The REAL sanitizer (unmodified) accepts the projected payload ─────
console.log('\n--- 6. Real kashf_reading_payload_sanitizer result ---');
{
  const result = sanitizeKashfReadingPayloadForAi(contextPackage);
  assert(result.ok === true, `sanitizeKashfReadingPayloadForAi(contextPackage) === {ok:true} (in practice: ${JSON.stringify(result)})`);
}

// ── 7. Rule-level fields honestly empty, never invented ──────────────────
console.log('\n--- 7. Rule-level fields honestly empty ---');
{
  const rc = contextPackage.readingContext;
  assert(Array.isArray(rc.activatedRuleIds) && rc.activatedRuleIds.length === 0, 'activatedRuleIds === [] (no fabricated rule IDs)');
  assert(Array.isArray(rc.rejectedRuleIds) && rc.rejectedRuleIds.length === 0, 'rejectedRuleIds === [] (no fabricated rule IDs)');
  assert(Array.isArray(rc.sourceEvidence) && rc.sourceEvidence.length === 0, 'sourceEvidence === [] (no fabricated evidence snippets)');
  assert(!('decisionSummary' in contextPackage), 'decisionSummary omitted entirely (not a fabricated placeholder string)');
  assert(missingFields.some((m) => m.includes('activatedRuleIds')), 'missingFields documents the activatedRuleIds gap');
  assert(missingFields.some((m) => m.includes('rejectedRuleIds')), 'missingFields documents the rejectedRuleIds gap');
  assert(missingFields.some((m) => m.includes('sourceEvidence')), 'missingFields documents the sourceEvidence gap');
  assert(missingFields.some((m) => m.includes('decisionSummary')), 'missingFields documents the decisionSummary gap');
}

// ── 8. completeness metadata reflects the gap ─────────────────────────────
console.log('\n--- 8. completeness metadata ---');
{
  assert(completeness === 'partial', `completeness === 'partial' while rule-level fields are missing (in practice: ${completeness})`);
}

// ── 9/10. No AI, no fetch anywhere in the builder ─────────────────────────
console.log('\n--- 9/10. No AI, no fetch in the builder source ---');
{
  const fs = await import('node:fs');
  const src = fs.readFileSync('./goral-hachol/intelligence/kashf-ai-context-builder.js', 'utf8');
  assert(!/\bfetch\s*\(/.test(src), 'builder source contains no fetch() call');
  assert(!/callAnthropic/i.test(src), 'builder source contains no callAnthropic reference');
  assert(!/anthropic/i.test(src), 'builder source contains no reference to Anthropic at all');
}

// ── 11. No Kashf engine file was changed by this work ─────────────────────
console.log('\n--- 11. No engine change ---');
{
  // Structural proof (portable, not git-dependent): a fresh direct call to
  // buildKashfReading behaves identically to the pre-projection baseline
  // captured at the top of this file — same keys, same clientContext echo,
  // same commerceSmartLayer.advisorDiagnosis.contextRelevance leak. If the
  // engine had been "fixed" to stop echoing forbidden fields, these would
  // no longer match, and that would be a real (unauthorized) engine change.
  const freshRaw = buildKashfReading(buildRamlBoardFromMothers(MOTHERS), TOPIC_ID, { name: '', question: QUESTION });
  assert(JSON.stringify(freshRaw) === JSON.stringify(directRawEngineOutput), 'buildKashfReading() output is identical across calls — engine behavior unchanged');
  assert('contextRelevance' in (freshRaw.commerceSmartLayer?.advisorDiagnosis || {}), 'kashf-commerce-smart-layer.js still produces contextRelevance exactly as before (engine untouched, filtering happens only in the builder)');
}

// ── 12. No personal information beyond what's structurally necessary ─────
console.log('\n--- 12. No unnecessary personal data ---');
{
  const json = JSON.stringify(contextPackage);
  for (const key of ['accessToken', 'access_token', 'apiKey', 'api_key']) {
    assert(!json.includes(`"${key}"`), `payload does not contain "${key}"`);
  }
}

// ── Board/intent/strategy/plan genuineness (carried over from v1) ────────
console.log('\n--- Board/Intent/Strategy/Plan genuineness (regression from v1) ---');
{
  assert(JSON.stringify(contextPackage.readingContext.board) === JSON.stringify(directBoard), 'board deep-equals a direct buildRamlBoardFromMothers(MOTHERS) call');
  const directIntent = analyzeIntent({ question: QUESTION, method: 'kashf', topicId: TOPIC_ID });
  assert(JSON.stringify(intentResult) === JSON.stringify(directIntent), 'intentResult deep-equals a direct analyzeIntent() call');
  const directStrategy = buildReadingStrategy({ intentResult: directIntent, method: 'kashf', topicId: TOPIC_ID });
  assert(JSON.stringify(contextPackage.readingStrategy) === JSON.stringify(directStrategy), 'readingStrategy deep-equals a direct buildReadingStrategy() call');
  const directPlan = buildReadingPlan({
    question: QUESTION, readingDomain: 'goralHachol', method: 'kashf', topicId: TOPIC_ID,
    questionType: directIntent.questionType, intentResult: directIntent, readingStrategy: directStrategy,
  });
  assert(JSON.stringify(contextPackage.readingPlan) === JSON.stringify(directPlan), 'readingPlan deep-equals a direct buildReadingPlan() call');
}

// ── Structural compatibility with the live Runner / Edge Function gate ───
console.log('\n--- Edge Function gate compatibility (regression from v1) ---');
{
  const rc = contextPackage.readingContext;
  const isValidEnvelope = typeof contextPackage.payloadVersion === 'string' && contextPackage.payloadVersion.length > 0
    && typeof contextPackage.domain === 'string' && contextPackage.domain.length > 0
    && typeof contextPackage.method === 'string' && contextPackage.method.length > 0
    && !!rc && typeof rc === 'object';
  const hasRealReadingPayload = isValidEnvelope
    && contextPackage.domain === 'reading.goralHachol'
    && typeof rc.question === 'string' && rc.question.length > 0
    && rc.board !== undefined
    && rc.engineOutput !== undefined;
  assert(hasRealReadingPayload, 'payload passes index.ts\'s hasRealReadingPayload gate structurally');
}

console.log('');
if (failures > 0) {
  console.error(`${failures} בדיקות נכשלו.`);
  process.exit(1);
}
console.log('כל הבדיקות עברו. buildAiSafeKashfEngineOutput מסנן ב-allowlist מפורש (לא מחיקה-חלקית), לא-משנה את buildKashfReading() המקורי, מסיר clientContext וגם את הדליפה המקוננת ב-commerceSmartLayer.advisorDiagnosis.contextRelevance, והפלט המלא עובר בפועל את kashf_reading_payload_sanitizer.ts האמיתי (Layer 2, ללא שינוי). activatedRuleIds/rejectedRuleIds/sourceEvidence/decisionSummary עדיין מדווחים בכנות כחסרים (completeness:"partial"), לא מומצאים.');
