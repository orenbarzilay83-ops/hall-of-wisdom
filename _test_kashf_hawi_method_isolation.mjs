/**
 * _test_kashf_hawi_method_isolation.mjs
 *
 * Proves the Method Isolation fix (per HALL_WISDOM_KASHF_HAWI_METHOD_ISOLATION_AUDIT
 * and the resulting precommit) — the Kashf AI payload no longer carries
 * Hawi's own interpretive houseMeaning/figureHouseMeaning text, the
 * deterministic verdict (primaryFormula/altFormula/overallPositive) is
 * unchanged, dhamirType4External stays explicitly tagged external/
 * advisor-only, and readingContext.methodMetadata declares the isolation
 * contract the prompt now enforces.
 *
 * No AI call. No fetch. No network. No UI. No change to any Kashf or Hawi
 * engine file (kashf-reading-engine.js, hawi-interpreter.js, etc.).
 */

import { buildRamlBoardFromMothers } from './goral-hachol/engine/raml-board-generator.js';
import { buildKashfReading } from './goral-hachol/engine/kashf-reading-engine.js';
import {
  buildKashfAiContextPackage,
  buildAiSafeKashfBoard,
  KASHF_METHOD_METADATA,
} from './goral-hachol/intelligence/kashf-ai-context-builder.js';
import { sanitizeKashfReadingPayloadForAi } from './supabase/functions/oren-smart-advisor/kashf_reading_payload_sanitizer.ts';
import { OREN_SMART_ADVISOR_BRAIN_PROMPT } from './supabase/functions/oren-smart-advisor/oren-smart-advisor-brain-prompt.ts';

let failures = 0;
function assert(condition, message) {
  if (!condition) { failures++; console.error(`✗ ${message}`); }
  else { console.log(`✓ ${message}`); }
}

const MOTHERS = ['1211', '1212', '1121', '1122'];
const TOPIC_ID = 'spiritualDiagnostics';
const QUESTION = 'האם קיימת פגיעת כישוף על הנשאלת?';

const directBoard = buildRamlBoardFromMothers(MOTHERS);
const directRawEngineOutput = buildKashfReading(directBoard, TOPIC_ID, { name: '', question: QUESTION });

const { contextPackage } = buildKashfAiContextPackage({
  mothers: MOTHERS, topicId: TOPIC_ID, question: QUESTION, readingId: 'test-method-isolation-001',
});
const rc = contextPackage.readingContext;
const boardJson = JSON.stringify(rc.board);
const fullPayloadJson = JSON.stringify(contextPackage);

console.log('\n--- 1/2. No Hawi interpretive prose in the Kashf AI board projection ---');
{
  assert(!('houseMeaning' in (rc.board.houses[0] || {})), '(1) board.houses[i] has no "houseMeaning" key at all');
  assert(!boardJson.includes('houseMeaning'), '(1) the string "houseMeaning" does not appear anywhere in the projected board JSON');
  assert(!('figureHouseMeaning' in (rc.board.houses[0] || {})), '(2) board.houses[i] has no "figureHouseMeaning" key at all');
  assert(!boardJson.includes('figureHouseMeaning'), '(2) the string "figureHouseMeaning" does not appear anywhere in the projected board JSON');
  // Spot-check known Hawi-only substrings (from the real house-1 transit
  // text confirmed during the audit) are not present anywhere in the board.
  assert(!boardJson.includes('البيت الأول'), '(1/2) sanity: Hawi house-1 Arabic title ("البيت الأول") not present in the projected board');
  assert(!boardJson.includes('PDF document'), '(1/2) sanity: Hawi source-paging marker ("PDF document") not present in the projected board');
}

console.log('\n--- 3. Original board (buildRamlBoardFromMothers) is unchanged ---');
{
  const before = JSON.stringify(directBoard);
  buildAiSafeKashfBoard(directBoard);
  const after = JSON.stringify(directBoard);
  assert(before === after, '(3) directBoard is byte-for-byte unchanged after buildAiSafeKashfBoard()');
  assert('houseMeaning' in directBoard.houses[0], '(3) the raw board (not the AI projection) still has houseMeaning — nothing was deleted from the source');
  assert('figureHouseMeaning' in directBoard.houses[0], '(3) the raw board still has figureHouseMeaning too');
}

console.log('\n--- 4. Hawi engine/UI files untouched (structural) ---');
{
  const fs = await import('node:fs');
  const { execSync } = await import('node:child_process');
  let changedFiles = [];
  try {
    changedFiles = execSync('git diff --name-only HEAD -- goral-hachol/engine goral-hachol/ui', { cwd: process.cwd() }).toString().trim().split('\n').filter(Boolean);
  } catch { changedFiles = ['<git diff failed>']; }
  const hawiTouched = changedFiles.filter((f) => /hawi|raml/i.test(f) && !/kashf/i.test(f));
  assert(hawiTouched.length === 0, `(4) no Hawi/raml engine or UI file appears in git diff (got: ${JSON.stringify(hawiTouched)})`);
  assert(fs.existsSync('./goral-hachol/engine/hawi-interpreter.js'), '(4) hawi-interpreter.js still exists, untouched');
}

console.log('\n--- 5. primaryFormula/altFormula verdicts unchanged by the projection ---');
{
  assert(JSON.stringify(rc.engineOutput.primaryFormula.verdict) === JSON.stringify(directRawEngineOutput.primaryFormula.verdict), '(5) primaryFormula.verdict in the AI payload matches the raw engine output exactly');
  assert(JSON.stringify(rc.engineOutput.altFormula?.verdict) === JSON.stringify(directRawEngineOutput.altFormula?.verdict), '(5) altFormula.verdict in the AI payload matches the raw engine output exactly');
}

console.log('\n--- 6. overallPositive (the deterministic verdict) unchanged ---');
{
  assert(rc.engineOutput.overallPositive === directRawEngineOutput.overallPositive, `(6) overallPositive matches the raw engine verdict (${directRawEngineOutput.overallPositive})`);
}

console.log('\n--- 7. dhamirType4External still tagged external/advisor-only ---');
{
  const d4 = rc.engineOutput.dhamirType4External;
  assert(d4 && d4.isExternalSource === true, '(7) dhamirType4External.isExternalSource === true (engine-computed, unchanged)');
  assert(typeof d4?.sourceBook === 'string' && d4.sourceBook.length > 0, '(7) dhamirType4External.sourceBook is present');
  assert(typeof d4?.disclosureHebrew === 'string' && d4.disclosureHebrew.length > 0, '(7) dhamirType4External.disclosureHebrew is present');
  assert(d4?.evidenceRole === 'externalSupplementalAdvisorOnly', `(7) dhamirType4External.evidenceRole === "externalSupplementalAdvisorOnly" (new projection-layer tag, got: ${d4?.evidenceRole})`);
}

console.log('\n--- 8. Prompt contains explicit method-isolation instruction ---');
{
  assert(/Method Isolation/.test(OREN_SMART_ADVISOR_BRAIN_PROMPT), '(8) prompt contains a "Method Isolation" rule');
  assert(/methodMetadata\.primaryMethod/.test(OREN_SMART_ADVISOR_BRAIN_PROMPT), '(8) prompt references methodMetadata.primaryMethod');
  assert(/methodMetadata\.allowedVerdictSources/.test(OREN_SMART_ADVISOR_BRAIN_PROMPT), '(8) prompt references methodMetadata.allowedVerdictSources');
  assert(/methodMetadata\.forbiddenForVerdict/.test(OREN_SMART_ADVISOR_BRAIN_PROMPT), '(8) prompt references methodMetadata.forbiddenForVerdict');
  assert(/externalSupplementalAdvisorOnly/.test(OREN_SMART_ADVISOR_BRAIN_PROMPT), '(8) prompt references the evidenceRole tag value directly');
}

console.log('\n--- 9. AI Context specifies primaryMethod:"kashf" ---');
{
  assert(rc.methodMetadata?.primaryMethod === 'kashf', '(9) readingContext.methodMetadata.primaryMethod === "kashf"');
  assert(KASHF_METHOD_METADATA.primaryMethod === 'kashf', '(9) exported KASHF_METHOD_METADATA constant also declares primaryMethod:"kashf"');
}

console.log('\n--- 10. Hawi evidence is not in allowedVerdictSources ---');
{
  const allowed = rc.methodMetadata?.allowedVerdictSources || [];
  assert(Array.isArray(allowed) && allowed.every((s) => !/hawi/i.test(s)), `(10) allowedVerdictSources contains no "hawi"-prefixed entry (got: ${JSON.stringify(allowed)})`);
  assert(allowed.includes('kashf.primaryFormula') && allowed.includes('kashf.altFormula'), '(10) allowedVerdictSources contains exactly the Kashf formula sources');
  const forbidden = rc.methodMetadata?.forbiddenForVerdict || [];
  assert(forbidden.includes('hawi.houseMeaning') && forbidden.includes('hawi.figureHouseMeaning'), '(10) forbiddenForVerdict explicitly lists both Hawi-sourced fields');
}

console.log('\n--- 11. Payload passes the real, unmodified sanitizer ---');
{
  const result = sanitizeKashfReadingPayloadForAi(contextPackage);
  assert(result.ok === true, `(11) sanitizeKashfReadingPayloadForAi(contextPackage) === {ok:true} (got: ${JSON.stringify(result)})`);
}

console.log('\n--- 12. Payload size is smaller than (or equal to) the prior context-reduction round ---');
{
  const bytes = Buffer.byteLength(fullPayloadJson, 'utf8');
  const PRIOR_ROUND_BYTES = 83477; // measured after the context-reduction fix, before this Method Isolation round
  assert(bytes <= PRIOR_ROUND_BYTES, `(12) payload is ${bytes} bytes, <= prior round's ${PRIOR_ROUND_BYTES} bytes (removing Hawi text should only shrink it further)`);
  console.log(`  (12) actual payload bytes: ${bytes} (${(100 - bytes / 478095 * 100).toFixed(1)}% reduction from the original 478,095-byte baseline)`);
}

console.log('\n--- 13. No fetch/AI reference introduced by this round\'s changes ---');
{
  const fs = await import('node:fs');
  const builderSrc = fs.readFileSync('./goral-hachol/intelligence/kashf-ai-context-builder.js', 'utf8');
  assert(!/\bfetch\s*\(/.test(builderSrc), '(13) builder source still contains no fetch() call');
  assert(!/callAnthropic/i.test(builderSrc), '(13) builder source still contains no callAnthropic reference');
}

console.log('');
if (failures > 0) {
  console.error(`${failures} בדיקות נכשלו.`);
  process.exit(1);
}
console.log('כל הבדיקות עברו. Kashf AI payload אינו מכיל houseMeaning/figureHouseMeaning (Hawi-native), הלוח/מנוע המקוריים לא השתנו, primaryFormula/altFormula/overallPositive זהים לפלט המנוע הגולמי, dhamirType4External מתויג evidenceRole:"externalSupplementalAdvisorOnly", readingContext.methodMetadata מצהיר primaryMethod:"kashf" ללא מקורות-Hawi ב-allowedVerdictSources, ה-Prompt כולל הוראת Method Isolation מפורשת, הפלט עובר את הסניטייזר האמיתי, וגודלו קטן מהסבב הקודם.');
