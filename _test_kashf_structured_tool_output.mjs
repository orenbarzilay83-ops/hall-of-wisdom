/**
 * _test_kashf_structured_tool_output.mjs
 *
 * Unit + structural tests for the module:"kashf" forced-tool structured
 * output path — callAnthropicEdgeWithForcedTool() in
 * anthropic-provider-edge.ts, KASHF_ADVISOR_TOOL_DEFINITION +
 * validateKashfAdvisorOutput() in oren-smart-advisor-brain-tool-schema.ts,
 * and their wiring into index.ts's module:"kashf" branch.
 *
 * fetch is mocked in-process — no real network call, no real API key, no
 * AI call. Covers HALL_WISDOM_KASHF_LIVE_PILOT_CONTEXT_SIZE_AND_JSON_AUDIT_REPORT.md
 * §7A's proposed fix.
 */

import { callAnthropicEdgeWithForcedTool, callAnthropicEdge } from './supabase/functions/oren-smart-advisor/anthropic-provider-edge.ts';
import { KASHF_ADVISOR_TOOL_DEFINITION, KASHF_ADVISOR_TOOL_NAME, validateKashfAdvisorOutput } from './supabase/functions/oren-smart-advisor/oren-smart-advisor-brain-tool-schema.ts';

let failures = 0;
function assert(condition, message) {
  if (!condition) { failures++; console.error(`✗ ${message}`); }
  else { console.log(`✓ ${message}`); }
}

const originalFetch = globalThis.fetch;
function mockFetchOnce(responseBody, { status = 200 } = {}) {
  let capturedBody = null;
  globalThis.fetch = async (_url, init) => {
    capturedBody = JSON.parse(init.body);
    return { ok: status >= 200 && status < 300, status, json: async () => responseBody };
  };
  return () => capturedBody;
}

const VALID_ADVISOR_OUTPUT = {
  module: 'kashf',
  advisorDiagnosis: 'test diagnosis',
  clientAnswerDraft: null,
  engineCritique: { hasProblem: false, problems: [], severity: 'none' },
  missingKnowledgeOrRules: [],
  recommendedFix: 'none needed',
  codeInstructionForClaude: { needed: false, instruction: '', filesToInspect: [], filesNotToTouch: [], testsToRun: [] },
  safetyNotes: [],
  privacyBlockedFields: [],
  nextBestAction: 'none',
  confidence: 'high',
  needsOrenDecision: false,
};

console.log('\n--- 1/2/3. request body: single tool, full input_schema, strict:true, tool_choice forces exact name ---');
{
  const getBody = mockFetchOnce({
    content: [{ type: 'tool_use', id: 'x', name: KASHF_ADVISOR_TOOL_NAME, input: VALID_ADVISOR_OUTPUT }],
    stop_reason: 'tool_use',
    usage: { input_tokens: 100, output_tokens: 50 },
  });
  await callAnthropicEdgeWithForcedTool({ apiKey: 'fake', model: 'claude-sonnet-5', system: 's', userMessage: 'u', tool: KASHF_ADVISOR_TOOL_DEFINITION });
  const body = getBody();
  assert(Array.isArray(body.tools) && body.tools.length === 1, '(1) request sends exactly one tool');
  assert(body.tools[0].name === KASHF_ADVISOR_TOOL_NAME, '(1) tool name matches KASHF_ADVISOR_TOOL_NAME');
  assert(body.tools[0].input_schema && body.tools[0].input_schema.required.length === 12, '(1) tool input_schema carries the full 12-field required list');
  assert(body.tools[0].strict === true, '(2) tool definition sets strict:true');
  assert(body.tool_choice?.type === 'tool' && body.tool_choice?.name === KASHF_ADVISOR_TOOL_NAME, '(3) tool_choice forces the exact tool name');
}

console.log('\n--- 4. valid tool_use.input is accepted as success ---');
{
  mockFetchOnce({
    content: [{ type: 'tool_use', id: 'x', name: KASHF_ADVISOR_TOOL_NAME, input: VALID_ADVISOR_OUTPUT }],
    stop_reason: 'tool_use',
    usage: { input_tokens: 100, output_tokens: 50 },
  });
  const result = await callAnthropicEdgeWithForcedTool({ apiKey: 'fake', model: 'm', system: 's', userMessage: 'u', tool: KASHF_ADVISOR_TOOL_DEFINITION });
  assert(result.ok === true, '(4) ok:true for a valid matching tool_use block');
  assert(JSON.stringify(result.toolInput) === JSON.stringify(VALID_ADVISOR_OUTPUT), '(4) toolInput is exactly the tool_use.input, unmodified');
  const validated = validateKashfAdvisorOutput(result.toolInput);
  assert(validated.ok === true, '(4) server-side re-validation accepts the same valid input');
}

console.log('\n--- 5. thinking block + tool_use: thinking never exposed, tool_use still recognized ---');
{
  const secretThinkingMarker = 'SECRET_THINKING_MARKER_kt7f';
  mockFetchOnce({
    content: [
      { type: 'thinking', thinking: secretThinkingMarker },
      { type: 'tool_use', id: 'x', name: KASHF_ADVISOR_TOOL_NAME, input: VALID_ADVISOR_OUTPUT },
    ],
    stop_reason: 'tool_use',
    usage: { input_tokens: 100, output_tokens: 50 },
  });
  const result = await callAnthropicEdgeWithForcedTool({ apiKey: 'fake', model: 'm', system: 's', userMessage: 'u', tool: KASHF_ADVISOR_TOOL_DEFINITION });
  assert(result.ok === true, '(5) thinking block before tool_use still succeeds');
  const serialized = JSON.stringify(result);
  assert(!serialized.includes(secretThinkingMarker), '(5) thinking content never appears anywhere in the return value');
  assert(result.diagnostics?.contentBlockTypes === 'thinking,tool_use', '(5) diagnostics record block TYPES only (thinking,tool_use), never thinking content');
}

console.log('\n--- 6. text-only response is rejected on the Kashf tool path ---');
{
  mockFetchOnce({
    content: [{ type: 'text', text: JSON.stringify(VALID_ADVISOR_OUTPUT) }],
    stop_reason: 'end_turn',
    usage: { input_tokens: 100, output_tokens: 50 },
  });
  const result = await callAnthropicEdgeWithForcedTool({ apiKey: 'fake', model: 'm', system: 's', userMessage: 'u', tool: KASHF_ADVISOR_TOOL_DEFINITION });
  assert(result.ok === false, '(6) a text-only response (even with valid-looking JSON text) is rejected, not parsed as fallback success');
  assert(result.error === 'no-single-matching-tool-use', `(6) rejection reason is classified (got: ${result.error})`);
  assert(result.diagnostics?.textBlockCount === 1 && result.diagnostics?.toolUseBlockCount === 0, '(6) diagnostics correctly count 1 text block, 0 tool_use blocks');
}

console.log('\n--- 7. tool_use with the wrong name is rejected ---');
{
  mockFetchOnce({
    content: [{ type: 'tool_use', id: 'x', name: 'some_other_tool', input: VALID_ADVISOR_OUTPUT }],
    stop_reason: 'tool_use',
    usage: { input_tokens: 100, output_tokens: 50 },
  });
  const result = await callAnthropicEdgeWithForcedTool({ apiKey: 'fake', model: 'm', system: 's', userMessage: 'u', tool: KASHF_ADVISOR_TOOL_DEFINITION });
  assert(result.ok === false, '(7) tool_use with a mismatched name is rejected');
  assert(result.diagnostics?.receivedToolNames === 'some_other_tool', '(7) diagnostics record the (wrong) tool name actually received');
}

console.log('\n--- 8. tool_use.input missing a required field is rejected by server-side re-validation ---');
{
  const { confidence, ...missingConfidence } = VALID_ADVISOR_OUTPUT;
  const validated = validateKashfAdvisorOutput(missingConfidence);
  assert(validated.ok === false, '(8) missing "confidence" field fails validateKashfAdvisorOutput');
  assert(validated.category === 'wrong-type:confidence', `(8) classified category reported (got: ${validated.category})`);
  assert(!('value' in validated) || validated.value === undefined, '(8) no repaired/defaulted value is returned for a rejected input');
}

console.log('\n--- 9. wrong-typed field is rejected ---');
{
  const wrongType = { ...VALID_ADVISOR_OUTPUT, needsOrenDecision: 'yes' }; // string instead of boolean
  const validated = validateKashfAdvisorOutput(wrongType);
  assert(validated.ok === false && validated.category === 'wrong-type:needsOrenDecision', `(9) wrong-typed needsOrenDecision rejected (got: ${JSON.stringify(validated)})`);

  const wrongEnum = { ...VALID_ADVISOR_OUTPUT, confidence: 'extreme' };
  const validated2 = validateKashfAdvisorOutput(wrongEnum);
  assert(validated2.ok === false, '(9) out-of-enum confidence value rejected');

  const wrongArray = { ...VALID_ADVISOR_OUTPUT, safetyNotes: 'not an array' };
  const validated3 = validateKashfAdvisorOutput(wrongArray);
  assert(validated3.ok === false && validated3.category === 'wrong-type:safetyNotes', '(9) non-array safetyNotes rejected');
}

console.log('\n--- 10. multiple tool_use blocks: rejected under one unambiguous rule ---');
{
  mockFetchOnce({
    content: [
      { type: 'tool_use', id: 'a', name: KASHF_ADVISOR_TOOL_NAME, input: VALID_ADVISOR_OUTPUT },
      { type: 'tool_use', id: 'b', name: KASHF_ADVISOR_TOOL_NAME, input: VALID_ADVISOR_OUTPUT },
    ],
    stop_reason: 'tool_use',
    usage: { input_tokens: 100, output_tokens: 50 },
  });
  const result = await callAnthropicEdgeWithForcedTool({ apiKey: 'fake', model: 'm', system: 's', userMessage: 'u', tool: KASHF_ADVISOR_TOOL_DEFINITION });
  assert(result.ok === false, '(10) more than one matching tool_use block is rejected, not arbitrarily picked');
  assert(result.diagnostics?.toolUseBlockCount === 2, '(10) diagnostics report the actual count (2)');

  mockFetchOnce({ content: [], stop_reason: 'end_turn', usage: { input_tokens: 1, output_tokens: 1 } });
  const zeroResult = await callAnthropicEdgeWithForcedTool({ apiKey: 'fake', model: 'm', system: 's', userMessage: 'u', tool: KASHF_ADVISOR_TOOL_DEFINITION });
  assert(zeroResult.ok === false, '(10) zero tool_use blocks is rejected under the same rule (exactly-one-required)');
}

console.log('\n--- 11/12. no JSON.parse on text, no markdown-fence extraction, in the production tool path ---');
{
  const providerSrc = (await import('node:fs')).readFileSync('./supabase/functions/oren-smart-advisor/anthropic-provider-edge.ts', 'utf8');
  const forcedToolFnSrc = providerSrc.slice(providerSrc.indexOf('export async function callAnthropicEdgeWithForcedTool'));
  assert(!/JSON\.parse\(/.test(forcedToolFnSrc), '(11) callAnthropicEdgeWithForcedTool never calls JSON.parse');
  assert(!/```/.test(forcedToolFnSrc) && !/markdown/i.test(forcedToolFnSrc.toLowerCase()), '(12) no markdown-fence-stripping/extraction logic in the forced-tool function');

  const indexSrc = (await import('node:fs')).readFileSync('./supabase/functions/oren-smart-advisor/index.ts', 'utf8');
  const kashfBranchStart = indexSrc.indexOf("moduleName === undefined || moduleName === 'kashf'");
  const kashfBranchEnd = indexSrc.indexOf("if (moduleName === 'goralQA')");
  const kashfBranchSrc = indexSrc.slice(kashfBranchStart, kashfBranchEnd);
  assert(!/JSON\.parse\(/.test(kashfBranchSrc), '(11) index.ts\'s module:"kashf" branch never calls JSON.parse on the AI result');
  assert(/callAnthropicEdgeWithForcedTool/.test(kashfBranchSrc), 'index.ts\'s module:"kashf" branch calls the forced-tool function');
  assert(/validateKashfAdvisorOutput/.test(kashfBranchSrc), 'index.ts\'s module:"kashf" branch re-validates tool_use.input server-side');
}

console.log('\n--- 13. no retry loop anywhere in the provider ---');
{
  const providerSrc = (await import('node:fs')).readFileSync('./supabase/functions/oren-smart-advisor/anthropic-provider-edge.ts', 'utf8');
  assert(!/for\s*\(|while\s*\(/.test(providerSrc), '(13) no loop construct in anthropic-provider-edge.ts — no auto-retry, single fetch per call');
}

console.log('\n--- 14. existing non-Kashf path (callAnthropicEdge, text-based) is unaffected ---');
{
  mockFetchOnce({
    content: [{ type: 'text', text: '{"overallDiagnosis":"ok"}' }],
    stop_reason: 'end_turn',
    usage: { input_tokens: 10, output_tokens: 5 },
  });
  const result = await callAnthropicEdge({ apiKey: 'fake', model: 'm', system: 's', userMessage: 'u' });
  assert(result.ok === true && result.text === '{"overallDiagnosis":"ok"}', '(14) callAnthropicEdge (used by module:"goralQA") still works exactly as before — free-text JSON, no tool_choice involved');
}

globalThis.fetch = originalFetch;

console.log('');
if (failures > 0) {
  console.error(`${failures} בדיקות נכשלו.`);
  process.exit(1);
}
console.log('כל הבדיקות עברו. module:"kashf" עובר כעת דרך forced tool_choice (KASHF_ADVISOR_TOOL_DEFINITION, strict:true) — tool_use.input בלבד מתקבל כהצלחה, text/שם-כלי-שגוי/ריבוי-blocks נדחים תחת כלל אחיד, thinking אף פעם לא נחשף, ואין JSON.parse/markdown-extraction/retry בנתיב הזה. validateKashfAdvisorOutput מבצע אימות-אפס-אמון בצד השרת ודוחה (לא מתקן) כל שדה חסר/שגוי-טיפוס. callAnthropicEdge (goralQA) נשאר ללא שינוי.');
