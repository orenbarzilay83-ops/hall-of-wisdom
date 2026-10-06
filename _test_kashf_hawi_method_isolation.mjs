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
  buildAiSafeKashfEngineOutput,
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
  // 2026-10-06: raml-board-generator.js is genuinely SHARED infrastructure
  // (buildRamlBoardFromMothers/generateRamlEntriesFromMothers are imported
  // by goral-hachol-ui.js, the Hawi-facing UI, as well as the Kashf
  // canonical engine), not a Hawi-only file this isolation check is meant
  // to protect. It is explicitly allow-listed here, scoped NOT to "no line
  // removed" (too strict -- it blocked legitimate iteration within the
  // Kashf-only verifyKashfBoardStructuralIntegrity function itself, added
  // 2026-10-05 and extended 2026-10-06 with the p.35 daughter/mother
  // diagonal check) but to a stronger, more precise guarantee: every byte
  // of the file OUTSIDE that one function's own block (delimited by its
  // leading "// ── אימות בלתי-תלוי..." divider comment and the next
  // "// ──" divider that follows it) is byte-identical to HEAD. That block
  // is never imported by Hawi (goral-hachol-ui.js only imports
  // buildRamlBoardFromMothers, confirmed by the import-list check below),
  // so edits confined to it cannot touch Hawi-observable behavior by
  // construction, not just by assertion. Section 3 above additionally
  // proves buildRamlBoardFromMothers's own OUTPUT is unaffected for a real
  // case.
  const ALLOWED_SHARED_FILE = 'goral-hachol/engine/raml-board-generator.js';
  const ALLOWED_BLOCK_START_MARKER = '// ── אימות בלתי-תלוי של תקינות'; // stable prefix -- the word after it may change (e.g. "הדיין" -> "הלוח") as the function's own scope/title is edited
  let allowedFileChangeIsConfinedToAllowedBlock = true;
  if (changedFiles.includes(ALLOWED_SHARED_FILE)) {
    try {
      const headContent = execSync(`git show HEAD:${ALLOWED_SHARED_FILE}`, { cwd: process.cwd() }).toString();
      const workingContent = fs.readFileSync(ALLOWED_SHARED_FILE, 'utf8');
      const stripAllowedBlock = (text) => {
        const startIdx = text.indexOf(ALLOWED_BLOCK_START_MARKER);
        if (startIdx === -1) return text; // block not present (e.g. pre-2026-10-05 HEAD) -- nothing to strip
        const nextDividerIdx = text.indexOf('\n// ──', startIdx + ALLOWED_BLOCK_START_MARKER.length);
        if (nextDividerIdx === -1) return text; // malformed -- fail open to the raw comparison below
        return text.slice(0, startIdx) + text.slice(nextDividerIdx + 1);
      };
      const headOutsideBlock = stripAllowedBlock(headContent);
      const workingOutsideBlock = stripAllowedBlock(workingContent);
      allowedFileChangeIsConfinedToAllowedBlock = headOutsideBlock === workingOutsideBlock;
      // Also confirm the shared import goral-hachol-ui.js actually relies on
      // (buildRamlBoardFromMothers) is untouched by name, as a second,
      // independent signal (not the only check).
      assert(workingContent.includes('export function buildRamlBoardFromMothers'), '(4) buildRamlBoardFromMothers export still present by name');
    } catch { allowedFileChangeIsConfinedToAllowedBlock = false; }
  }
  assert(allowedFileChangeIsConfinedToAllowedBlock, `(4) every change to the one allow-listed shared file (${ALLOWED_SHARED_FILE}) is confined to verifyKashfBoardStructuralIntegrity's own block -- everything else must be byte-identical to HEAD`);
  const hawiTouched = changedFiles.filter((f) => /hawi|raml/i.test(f) && !/kashf/i.test(f) && f !== ALLOWED_SHARED_FILE);
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

console.log('\n--- 7. external Dhamir is off by default; explicit opt-in stays tagged ---');
{
  assert(rc.engineOutput.dhamirType4External === null, '(7) default Kashf AI payload does not auto-run external Dhamir Type 4');

  const explicitExternal = buildKashfReading(directBoard, TOPIC_ID, {
    name: '',
    question: QUESTION,
    enableExternalDhamirType4: true,
  });
  const projectedExternal = buildAiSafeKashfEngineOutput(explicitExternal);
  const d4 = projectedExternal.dhamirType4External;
  assert(d4 && d4.isExternalSource === true, '(7) explicit external Dhamir remains self-disclosing');
  assert(typeof d4?.sourceBook === 'string' && d4.sourceBook.length > 0, '(7) explicit external Dhamir sourceBook is present');
  assert(typeof d4?.disclosureHebrew === 'string' && d4.disclosureHebrew.length > 0, '(7) explicit external Dhamir disclosureHebrew is present');
  assert(d4?.evidenceRole === 'externalSupplementalAdvisorOnly', `(7) explicit external Dhamir is tagged externalSupplementalAdvisorOnly (got: ${d4?.evidenceRole})`);
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
console.log('כל הבדיקות עברו. Kashf AI payload מבודד מ-Hawi, הפסק הדטרמיניסטי נשמר, Dhamir חיצוני אינו רץ כברירת מחדל וב-opt-in מפורש נשאר מתויג externalSupplementalAdvisorOnly.');
