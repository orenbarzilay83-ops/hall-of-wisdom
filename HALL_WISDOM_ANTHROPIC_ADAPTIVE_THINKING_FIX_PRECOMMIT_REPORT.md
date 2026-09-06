# HALL_WISDOM_ANTHROPIC_ADAPTIVE_THINKING_FIX_PRECOMMIT_REPORT

> Precommit report only. No Commit, no Push, no Deploy, no additional AI call
> performed. Awaiting explicit approval per instructions.

---

## Root cause (confirmed via live pilot + Supabase logs)

Claude Sonnet 5 uses **Adaptive Thinking**, default `effort:"high"`. For this payload's complexity (large board/engineOutput/readingStrategy/readingPlan + a 12-field structured JSON ask), the model was spending its entire token budget on internal `thinking`-type content blocks before ever reaching a `text` block. Confirmed twice live: `error:"empty-response:max_tokens"` at both maxTokens=1200 (17.4s) and maxTokens=4096 (53.2s) — raising the budget alone just delayed the same failure, proving it wasn't a simple "not enough tokens" problem but a structural parsing gap (`anthropic-provider-edge.ts` only ever inspected `content[0]`/the first `type:"text"` block's existence, with no visibility into `stop_reason` or block composition).

## 1. Response parsing — audited and fixed

**Before:** `data.content.find(c => c?.type === 'text')` — found at most one text block; if the model emitted `thinking` blocks first and ran out of budget before any `text` block, this silently returned `undefined` with no diagnostic beyond a generic `stop_reason` string (added in the prior round).

**After:**
- Collects **all** blocks where `type === 'text'` (`contentBlocks.filter(...)`), not just `content[0]`.
- Joins their `.text` values **in array order** (`.map().join('')`).
- `thinking`/`redacted_thinking`/any other block type is filtered out — the code never reads `.thinking` or any field of a non-text block, only its `.type` string (for the diagnostic `blockTypes` list).
- `stop_reason` and `usage` (input/output token counts) are read and returned/logged **only** as classified, short values — never raw response content, never thinking text.

## 2. Approved pilot call configuration

```ts
max_tokens: 12000
output_config: { effort: 'medium' }
```

Both are now the function's defaults (`maxTokens = 12000`, `effort = 'medium'`), applied via the existing `params` destructuring — no caller (`index.ts`, either `module:"kashf"` or `module:"goralQA"` branch) needed to change, since neither currently passes `maxTokens`/`effort` explicitly.

**Not used:** `thinking: { type: 'enabled', budget_tokens: ... }` — confirmed absent from the request body (test §5/6 explicitly asserts `!('thinking' in body)`). Adaptive Thinking is Sonnet 5's model-level default; not manually configured here, and thinking was not disabled.

## 3. Error diagnostics on empty-response

New format: `empty-response:{stopReason}:blocks={commaSeparatedBlockTypes}` — e.g. the real failure we saw would now read `empty-response:max_tokens:blocks=thinking`. `usage` (`inputTokens`/`outputTokens`) is now also populated on this failure path (previously only on success), so the `[AI_INVOCATION_LOG]` entry will show real token counts even when the call fails. Confirmed absent from any return value: raw response body, thinking content, prompt, API key, JWT, raw payload — the classified error string and numeric usage are the only diagnostic surface, exactly as before this fix (same design principle, just fed by real data now instead of nothing).

## 4. Tests

New file: `_test_anthropic_provider_edge_content_blocks.mjs` — **15/15 assertions passed**, covering:
1. thinking block → text block succeeds, text extracted correctly (not the thinking content).
2. Multiple text blocks joined in order.
3. thinking-only + `stop_reason:max_tokens` → `empty-response:max_tokens:blocks=thinking` exactly.
4. A planted secret marker inside a `thinking` block is asserted absent from the entire serialized return value — proves thinking content cannot leak through any field.
5. Default `max_tokens` is 12000 (asserted against the actual captured fetch request body).
6. Default `output_config.effort` is `"medium"` (same).
7. Structural check: prompt file (`oren-smart-advisor-brain-prompt.ts`) untouched.
8/9. Structural check: no file added/removed under `goral-hachol/engine/` (engine and payload-builder untouched — this fix is isolated to the provider file).
10. Structural check: no `for`/`while` loop in `anthropic-provider-edge.ts` — confirms `fetch` is called at most once per `callAnthropicEdge` invocation, no auto-retry.

**Regression suite — all green, zero failures:**
| File | Result |
|---|---|
| `_test_oren_smart_advisor_kashf_reading_payload.mjs` | all passed |
| `_test_hall_wisdom_goral_qa_live_ai.mjs` | all passed |
| `_test_kashf_ai_context_builder.mjs` | all passed |

## 5. Diff summary (pre-commit)

```
 supabase/functions/oren-smart-advisor/anthropic-provider-edge.ts | 44 +++++++++++++++++-----
 1 file changed, 34 insertions(+), 10 deletions(-)
```

Only **one** source file changed. One new file, untracked, not yet staged: `_test_anthropic_provider_edge_content_blocks.mjs` (the test itself — needed to prove the fix, not a supporting/incidental change).

---

## Not performed (awaiting further approval)

- Commit
- Push
- Deploy (GitHub Actions `workflow_dispatch`)
- Any additional live AI call / Runner execution

Full diff and test output available above/in-session for review before authorizing the next step.
