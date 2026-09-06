# HALL_WISDOM_KASHF_LIVE_PILOT_CONTEXT_SIZE_AND_JSON_AUDIT_REPORT

> Audit + proposal only. No production code changed. No AI call performed.
> No Commit, no Push, no Deploy. Awaiting explicit approval before any fix
> is implemented.

Input to this audit: real `[AI_INVOCATION_LOG]` line from the live pilot —
`readingId: kashf-live-pilot-001`, `inputTokens: 199552`, `outputTokens: 6525`,
`latencyMs: 102298`, `success: false`, `error: invalid-json-response`.

---

## 1. What exactly produced 199,552 input tokens

Rebuilt the identical payload locally (same builder, same mothers/topicId/
question/readingId as the live run — deterministic, no network) and measured
every component by byte size. **`readingContext.board` is 462,476 of 478,095
total payload bytes — 96.7% of everything sent to the model.** Root cause
inside `board`:

- `board.houses` (215,118 bytes) and `board.housesByNumber` (215,189 bytes)
  are **the same data serialized twice** — one as an array, one as an
  object keyed by house number. Confirmed byte-identical per entry.
- Worse, nested inside: each of the 16 board-house entries embeds the full
  `figure` object for that position, and `figure.houses` is **the figure's
  entire 16-house transit table** (full Arabic source text + Hebrew
  translation + details for all 16 houses that figure could ever land in) —
  not just the one house relevant to this board position. Only 9 distinct
  figures actually appear across the 16 houses, but each embedding repeats
  the same 16-entry table regardless.

## 2. Size of every component (bytes, % of total payload)

| Field | Bytes | % of payload |
|---|---|---|
| `readingContext.board` | 462,476 | 96.73% |
| — `board.houses` | 215,118 | 45.00% |
| — `board.housesByNumber` (duplicate of houses) | 215,189 | 45.01% |
| — `board.entries` | 15,498 | 3.24% |
| — `board.generation` | 15,576 | 3.26% |
| — `board.sourceReview` | 817 | 0.17% |
| `readingContext.engineOutput` | 12,426 | 2.60% |
| `readingStrategy` | 1,277 | 0.27% |
| `readingPlan` | 1,517 | 0.32% |
| `readingContext.question` | 60 | 0.01% |
| `activatedRuleIds` / `rejectedRuleIds` / `sourceEvidence` | 2+2+2 | ~0% |
| system prompt (`oren-smart-advisor-brain-prompt.ts`) | 6,876 | separate from userMessage, small |

`engineOutput` is **not** a concern — it already goes through the
privacy-safe allowlist projection (`buildAiSafeKashfEngineOutput`, prior
round) and is proportionally tiny (2.6%). `board` is inserted raw at
`kashf-ai-context-builder.js:182` with **no equivalent filtering** — that
asymmetry is the architectural gap.

## 3. Duplications found

1. **`board.houses` vs `board.housesByNumber`** — exact same content,
   two representations, sent together. 2× multiplier on the entire board.
2. **Each figure's full 16-entry transit table embedded per board
   position** — a board position only needs the 1-of-16 entry matching its
   own house number; it currently receives all 16 (its own + 15 irrelevant
   ones), repeated independently for every board position that figure
   occupies. Measured: this nested table alone is 66.9% of `board.houses`'
   own bytes (143,809 of 215,118).

No duplication found between `system` and `userMessage` (system prompt is
static instructions only, 6,876 bytes, no board/engineOutput content
repeated there). No duplication found in `readingStrategy`/`readingPlan`
(both small, no embedded copies of `board`/`engineOutput`).

## 4. What would be removed or summarized (proposal only, not applied)

- Drop `board.housesByNumber` entirely — `board.houses` (the array) already
  carries every field the AI prompt describes needing
  (`readingContext.board: מצב-הלוח (הצורות/הבתים)`); nothing in the prompt
  asks for a by-number-keyed duplicate.
- For each board-position's `figure.houses`, keep only the entry whose
  `house` matches that position's own `house`/`houseNumber` — the AI is
  being asked to critique *this reading*, not asked to relearn the full
  transit table of every figure for every house it could theoretically
  occupy.
- `board.entries` and `board.generation` (3.2% each) were not part of this
  round's measurement priority (small next to the 90%+ items above) —
  flagged for a second look only if the primary cut isn't sufficient.

## 5. Target input size

Simulated the two structural cuts above (dedup + per-position transit
filter) against the real rebuilt payload, no other content removed, no
field renamed:

- Full payload: 478,095 bytes → trimmed: 128,477 bytes (**73.1% reduction**,
  byte-for-byte, measured, not estimated).
- Applying that same ratio to the real API-reported `inputTokens: 199,552`
  gives an estimated **~53,700 input tokens** — this is a proportional
  estimate from measured bytes, not a second API call (no AI call was made
  for this report). Practical target for the next pilot attempt: **well
  under 60,000 input tokens**, without touching `mothers`, `question`,
  `topicId`, or any engine output content.

## 6. Likely reason for `invalid-json-response`

`outputTokens: 6525` of a 12,000 budget — **not** a `max_tokens` cutoff;
the model finished generating before the budget ran out, and what it
finished with did not survive `JSON.parse`. Built a diagnostic test,
`_test_kashf_invalid_json_diagnosis.mjs` (created this round, not wired
into any production file), that reproduces `index.ts`'s exact current
parsing step (`JSON.parse(aiResult.text)`, no trimming, no fence-stripping)
against 10 plausible malformed-output shapes:

markdown fence (with/without `json` tag) · leading prose · trailing prose ·
truncated mid-object · trailing comma · unescaped quote in a string value ·
raw control character in a string · two concatenated JSON objects · prose+
fence combined.

**All 10 collapse to the exact same opaque `invalid-json-response` string
today** — `index.ts` has zero tolerance and zero diagnostic granularity for
*why* parsing failed (confirmed by test, 20/20 assertions passed). Given
the prompt already instructs "JSON only, no text outside" (rule #10) and
the model still failed structurally, the most probable cause under a
200K-token input is that the model wrapped the answer in a
```` ```json ```` fence and/or added a short lead-in/summary line despite
the instruction — a known common failure mode of prompt-only JSON
enforcement, independent of Adaptive Thinking (which is already handled
separately by the block-filtering fix from the prior round).

## 7. How valid JSON would be enforced (two-layer proposal, not implemented)

**A. Preferred — Anthropic's structured tool-forcing mechanism.** The
Messages API supports defining a `tools` schema and forcing the model to
respond via a single forced tool call (`tool_choice: {type:"tool",
name:"..."}`) whose `input` is validated against a JSON Schema by the API
itself — this is a stable, long-supported part of the Messages API (not
experimental), and is the standard way to guarantee structurally-valid
JSON rather than relying on prompt instructions alone. The 12-key output
schema already defined in `oren-smart-advisor-brain-prompt.ts` maps
directly onto a `tools[0].input_schema`. Not implemented this round —
flagged as the recommended primary fix.

**B. Fallback / defense-in-depth — safe single-object extractor.**
Diagnostic-only implementation in `_test_kashf_invalid_json_diagnosis.mjs`
(`extractSingleJsonObject`): strips at most one leading/trailing
markdown-fence-or-prose wrapper *outside* the outermost `{...}` span,
changes nothing *inside* that span, and explicitly **rejects** (does not
attempt to repair) trailing commas, truncation, or any structural problem
inside the object — never invents or patches professional content. Tested
against all 10 malformed shapes: recovers the object correctly for the 5
wrapper-only cases, correctly rejects (doesn't silently "fix") the 2
genuinely-broken-content cases tested (truncated, trailing comma). If
adopted, it would sit *before* today's `JSON.parse(aiResult.text)` call in
`index.ts`, and a still-unparseable result would still return a classified
error, never a partial/guessed object.

## 8. Files that would need to change (not yet touched)

- `goral-hachol/intelligence/kashf-ai-context-builder.js` — add a
  board-shaping step (new function, symmetric to the existing
  `buildAiSafeKashfEngineOutput`) applied before `board` is placed into
  `contextPackage.readingContext.board` at line 182. `raml-board-generator.js`
  itself would **not** change — the full board remains available for
  every other consumer (UI display, `raml-interpreter.js`, etc.); only the
  AI-payload copy would be shaped.
- `supabase/functions/oren-smart-advisor/index.ts` — parsing step only
  (lines ~265-271), to adopt extractor 7B and/or tool-forcing 7A. No
  change to auth, sanitizer, or fallback-to-mock behavior.
- `supabase/functions/oren-smart-advisor/oren-smart-advisor-brain-prompt.ts`
  — only if approach 7A (tool-forcing) is chosen, the 12-key schema
  currently described in prose would move into a `tools[0].input_schema`
  structure; approach 7B alone would need no prompt change.
- `supabase/functions/oren-smart-advisor/anthropic-provider-edge.ts` — only
  if approach 7A is chosen (adds `tools`/`tool_choice` to the request
  body); untouched for 7B alone.

## 9. Tests that would be added

- Extend `_test_kashf_ai_context_builder.mjs` with assertions on the new
  board-shaping function: no `housesByNumber` duplicate, each house's
  `figure.houses` filtered to exactly 1 entry matching that house, no
  other field renamed/removed, real sanitizer still accepts the result,
  byte-size assertion (trimmed board stays under an explicit ceiling).
- Promote `_test_kashf_invalid_json_diagnosis.mjs` (already created,
  20/20 passing) from diagnostic-only into a real regression test once
  the extractor (7B) or tool-forcing (7A) is actually wired in — asserting
  the *production* code path, not just the standalone function.

## 10. Estimated impact on latency and cost

Not measured directly (no second AI call made for this report — per
instruction). Directionally, given `latencyMs: 102,298` scaled with a
~200K-token input: a ~73% input-token reduction (§5) would be expected to
reduce both latency and per-call cost roughly proportionally to the input
side, though output-side latency/cost (6,525 tokens) is independent of
this cut and would need its own measurement once a real (post-fix) live
call is authorized.

## 11. Confirmation — no additional AI call performed

Confirmed. Every measurement in this report came from re-running the
existing local, deterministic, no-network builder
(`buildKashfAiContextPackage`) with the exact same inputs as the live
pilot, and from a local diagnostic script against hand-written mock
strings. `grep` for `fetch(`/`callAnthropic`/`anthropic` in
`_test_kashf_invalid_json_diagnosis.mjs`: zero matches beyond the
diagnostic file's own docstring references.

## 12. Confirmation — no Commit / Push / Deploy performed

Confirmed. Two new files exist on disk, both untracked/unstaged:
`_test_kashf_invalid_json_diagnosis.mjs` (diagnostic test, 20/20 passing)
and this report. No existing file was modified — `git status --short`
shows only these two new paths. No `supabase` CLI command run, no
`git commit`, no `git push`.

---

## Not performed (awaiting explicit approval)

- Any change to `kashf-ai-context-builder.js`, `index.ts`,
  `anthropic-provider-edge.ts`, or `oren-smart-advisor-brain-prompt.ts`.
- Wiring the diagnostic extractor or tool-forcing into production code.
- Any additional live Anthropic call.
- Commit, Push, or Deploy.
