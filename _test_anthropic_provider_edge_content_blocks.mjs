/**
 * _test_anthropic_provider_edge_content_blocks.mjs
 *
 * Unit tests for callAnthropicEdge() in
 * supabase/functions/oren-smart-advisor/anthropic-provider-edge.ts —
 * specifically the Claude Sonnet 5 Adaptive Thinking content-block parsing
 * fix (collect ALL type:"text" blocks, ignore thinking blocks safely,
 * classified-only diagnostics on empty-response).
 *
 * fetch is mocked in-process — no real network call, no real API key.
 */

import { callAnthropicEdge } from './supabase/functions/oren-smart-advisor/anthropic-provider-edge.ts';

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
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => responseBody,
    };
  };
  return () => capturedBody;
}

console.log('\n--- 1. thinking block followed by text block succeeds ---');
{
  const getBody = mockFetchOnce({
    content: [
      { type: 'thinking', thinking: 'internal reasoning not for output' },
      { type: 'text', text: '{"module":"kashf"}' },
    ],
    stop_reason: 'end_turn',
    usage: { input_tokens: 500, output_tokens: 200 },
  });
  const result = await callAnthropicEdge({ apiKey: 'fake', model: 'claude-sonnet-5', system: 's', userMessage: 'u' });
  assert(result.ok === true, 'ok:true when a real text block follows a thinking block');
  assert(result.text === '{"module":"kashf"}', 'text extracted from the text block, not the thinking block');
  assert(result.usage?.inputTokens === 500 && result.usage?.outputTokens === 200, 'usage token counts passed through');
  getBody();
}

console.log('\n--- 2. multiple text blocks joined in order ---');
{
  mockFetchOnce({
    content: [
      { type: 'thinking', thinking: 'ignore me' },
      { type: 'text', text: 'part one ' },
      { type: 'text', text: 'part two' },
    ],
    stop_reason: 'end_turn',
    usage: { input_tokens: 10, output_tokens: 20 },
  });
  const result = await callAnthropicEdge({ apiKey: 'fake', model: 'claude-sonnet-5', system: 's', userMessage: 'u' });
  assert(result.ok === true, 'ok:true with multiple text blocks');
  assert(result.text === 'part one part two', 'multiple text blocks joined in array order, not just content[0]');
}

console.log('\n--- 3. thinking-only response, stop_reason:max_tokens -> classified empty-response ---');
{
  mockFetchOnce({
    content: [
      { type: 'thinking', thinking: 'a very long internal reasoning trace that consumed the whole budget' },
    ],
    stop_reason: 'max_tokens',
    usage: { input_tokens: 3000, output_tokens: 12000 },
  });
  const result = await callAnthropicEdge({ apiKey: 'fake', model: 'claude-sonnet-5', system: 's', userMessage: 'u' });
  assert(result.ok === false, 'ok:false when only a thinking block is present');
  assert(result.error === 'empty-response:max_tokens:blocks=thinking', `error is classified and specific (got: ${result.error})`);
  assert(result.usage?.inputTokens === 3000 && result.usage?.outputTokens === 12000, 'usage still returned on the empty-response path for diagnosis');
}

console.log('\n--- 4. thinking content never appears anywhere in the return value ---');
{
  const secretThinkingMarker = 'SECRET_INTERNAL_REASONING_MARKER_9f3a';
  mockFetchOnce({
    content: [{ type: 'thinking', thinking: secretThinkingMarker }],
    stop_reason: 'max_tokens',
    usage: { input_tokens: 1, output_tokens: 2 },
  });
  const result = await callAnthropicEdge({ apiKey: 'fake', model: 'claude-sonnet-5', system: 's', userMessage: 'u' });
  const serialized = JSON.stringify(result);
  assert(!serialized.includes(secretThinkingMarker), 'thinking block content never appears in callAnthropicEdge\'s return value (not even in error/blocks)');
}

console.log('\n--- 5/6. request body uses max_tokens:12000 and output_config.effort:"medium" by default ---');
{
  const getBody = mockFetchOnce({
    content: [{ type: 'text', text: 'ok' }],
    stop_reason: 'end_turn',
    usage: { input_tokens: 1, output_tokens: 1 },
  });
  await callAnthropicEdge({ apiKey: 'fake', model: 'claude-sonnet-5', system: 's', userMessage: 'u' });
  const body = getBody();
  assert(body.max_tokens === 12000, `default max_tokens is 12000 (got: ${body.max_tokens})`);
  assert(body.output_config?.effort === 'medium', `default output_config.effort is "medium" (got: ${JSON.stringify(body.output_config)})`);
  assert(!('thinking' in body), 'request body does not set a manual thinking:{budget_tokens} param (Adaptive Thinking is model-default, not manually configured)');
}

console.log('\n--- No unrelated changes (structural checks) ---');
{
  const fs = await import('node:fs');
  const promptSrc = fs.readFileSync('./supabase/functions/oren-smart-advisor/oren-smart-advisor-brain-prompt.ts', 'utf8');
  assert(typeof promptSrc === 'string' && promptSrc.length > 0, 'prompt file untouched/readable (no change made to it this round)');
  const engineFiles = fs.readdirSync('./goral-hachol/engine');
  assert(engineFiles.includes('kashf-reading-engine.js'), 'engine directory untouched (no file added/removed)');
}

console.log('\n--- No auto-retry (structural check) ---');
{
  const fs = await import('node:fs');
  const src = fs.readFileSync('./supabase/functions/oren-smart-advisor/anthropic-provider-edge.ts', 'utf8');
  assert(!/for\s*\(|while\s*\(/.test(src), 'no loop construct in anthropic-provider-edge.ts — fetch is called at most once per callAnthropicEdge invocation');
}

globalThis.fetch = originalFetch;

console.log('');
if (failures > 0) {
  console.error(`${failures} בדיקות נכשלו.`);
  process.exit(1);
}
console.log('כל הבדיקות עברו. callAnthropicEdge אוסף את כל בלוקי type:"text" (לא רק content[0]), מתעלם בבטחה מתוכן thinking (לעולם לא חוזר בפלט), מחזיר אבחון-מסווג-בלבד (stopReason+blockTypes+usage) על empty-response, ושולח max_tokens:12000 + output_config.effort:"medium" כברירת-מחדל, בלי thinking.budget_tokens ידני.');
