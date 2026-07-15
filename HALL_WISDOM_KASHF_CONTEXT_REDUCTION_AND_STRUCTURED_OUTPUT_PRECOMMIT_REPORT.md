# HALL_WISDOM_KASHF_CONTEXT_REDUCTION_AND_STRUCTURED_OUTPUT_PRECOMMIT_REPORT

> Precommit report only. No Commit, no Push, no Deploy of this fix. No
> additional AI call performed. Awaiting explicit approval per instructions.

Implements the approved audit's proposal
(`HALL_WISDOM_KASHF_LIVE_PILOT_CONTEXT_SIZE_AND_JSON_AUDIT_REPORT.md`,
already committed as `402b51b`): Step B (AI-safe board projection) + Step C
(forced structured tool output).

---

## 1. Files changed

**Modified:**
- `goral-hachol/intelligence/kashf-ai-context-builder.js` — added
  `buildAiSafeKashfBoard()`, wired into `buildKashfAiContextPackage()`.
- `supabase/functions/oren-smart-advisor/anthropic-provider-edge.ts` —
  added `callAnthropicEdgeWithForcedTool()` alongside the existing
  `callAnthropicEdge()` (unchanged, still used by `module:"goralQA"`).
- `supabase/functions/oren-smart-advisor/index.ts` — `module:"kashf"`
  branch now calls `callAnthropicEdgeWithForcedTool()` + server-side
  `validateKashfAdvisorOutput()` instead of `JSON.parse` on free text.
- `supabase/functions/oren-smart-advisor/ai-invocation-log.ts` — added 6
  optional, classified-only diagnostic fields.
- `_test_kashf_ai_context_builder.mjs` — updated the now-obsolete
  raw-board-deep-equal assertion, added a 13-point board-projection suite.

**New:**
- `supabase/functions/oren-smart-advisor/oren-smart-advisor-brain-tool-schema.ts`
  — tool definition + zero-trust re-validator.
- `_test_kashf_structured_tool_output.mjs` — 34 assertions.

**Deliberately untouched:** `oren-smart-advisor-brain-prompt.ts` (the
12-field schema description in prose is now redundant with the tool
schema but not harmful — `tool_choice` forces the tool regardless of
prompt wording; left as-is to keep this round's diff minimal), every file
under `goral-hachol/engine/`, `raml-board-generator.js` itself, every
`.html` file, `callAnthropicEdge()` (text-based, still used by
`module:"goralQA"`).

## 2. Board Allowlist structure

`buildAiSafeKashfBoard(board)` — pure function, does not mutate its input
(verified: raw board still has `housesByNumber` after projection, byte-for-
byte identical before/after). Canonical representation: `houses` (array)
only.

Per position (16 total), kept: `house`, `houseNumber`, `figureId`,
`figure: {id, hebrewName, arabicName}` (identity only), `figureState`
(Kashf's own classification layer — fortune/movement/element/gender/
zodiac/seeker-status, folded in from `board.entries` by house number, not
present anywhere else in `board.houses`), `houseMeaning` (house's own
generic meaning), `figureHouseMeaning` (this figure's meaning specifically
in this house — confirmed byte-identical to the matching entry that used
to be nested inside `figure.houses[]`, so nothing is lost), `sourceStatus`.

Dropped entirely: `housesByNumber` (confirmed exact duplicate of `houses`),
each figure's full 16-house transit table (redundant with
`figureHouseMeaning`), `entries`/`generation` as separate top-level
structures (their one useful piece of content — figure state — is folded
into each position instead), `sourceReview` (generation-process provenance,
not reading content).

## 3. Payload size before/after

Same real payload (mothers `['1211','1212','1121','1122']`, topicId
`spiritualDiagnostics`, question from the live pilot, readingId
`kashf-live-pilot-001`), measured deterministically (bytes, not estimated):

| | Before | After |
|---|---|---|
| `board` | 462,476 bytes | 67,858 bytes |
| full payload | 478,095 bytes | 83,477 bytes |

## 4. Reduction percentage

**82.5%** on the full payload (board alone: 85.4%) — exceeds the 73.1%
simulated in the audit report, because folding `board.entries`' figure-
state data in per-position (instead of leaving it as a separate top-level
structure) removed additional bytes beyond the original dedup+transit-
filter simulation.

## 5. New estimated token count (marked as estimate only)

**~34,800 input tokens (estimate only, scaled proportionally from the real
199,552-token measurement — no second AI call was made to confirm this).**
Real confirmation requires an actual live pilot call, not performed this
round per instruction.

## 6. Tool schema

`KASHF_ADVISOR_TOOL_DEFINITION` (`oren-smart-advisor-brain-tool-schema.ts`)
— name `submit_hall_wisdom_kashf_analysis`, `strict: true`, JSON Schema
`input_schema` with `additionalProperties: false` at both the top level and
inside `engineCritique`/`codeInstructionForClaude`, `required` listing all
12 fields exactly as specified in `oren-smart-advisor-brain-prompt.ts`
(`module`, `advisorDiagnosis`, `clientAnswerDraft`, `engineCritique`,
`missingKnowledgeOrRules`, `recommendedFix`, `codeInstructionForClaude`,
`safetyNotes`, `privacyBlockedFields`, `nextBestAction`, `confidence`,
`needsOrenDecision`) — no more, no less.

## 7. How tool_choice is enforced

Request body sends `tools: [KASHF_ADVISOR_TOOL_DEFINITION]` and
`tool_choice: { type: 'tool', name: 'submit_hall_wisdom_kashf_analysis' }`
— confirmed via a captured mock request body (test §1-3). Only a
`tool_use` content block whose `name` matches exactly is accepted; a
text-only response (even containing valid-looking JSON text) is rejected
with the classified reason `no-single-matching-tool-use` (test §6); a
wrong tool name is rejected (test §7); zero or more-than-one matching
`tool_use` blocks are rejected under the same single rule — "exactly one
matching block required" (test §10). No `JSON.parse` call exists anywhere
in `callAnthropicEdgeWithForcedTool()` or in `index.ts`'s `module:"kashf"`
branch (confirmed structurally, test §11); no markdown-fence-stripping or
"repair" logic exists in the production tool path (test §12); no retry
loop exists anywhere in the provider file (test §13, same structural
check as the prior round).

## 8. How tool_use.input is validated

Two independent layers:
1. Anthropic's own `strict: true` schema enforcement on the API side (not
   independently verifiable from here — treated as defense-in-depth, not
   sole authority).
2. `validateKashfAdvisorOutput()` (zero-trust, server-side, in
   `oren-smart-advisor-brain-tool-schema.ts`) — re-checks every field's
   presence and exact type against the same 12-field contract. A missing
   field, wrong type, or out-of-enum value is a rejection with a classified
   `category` string (e.g. `wrong-type:confidence`,
   `missing-or-wrong-type:advisorDiagnosis`) — never coerced, defaulted, or
   invented (test §8/§9: missing field, wrong boolean type, out-of-enum
   string, non-array all correctly rejected with no partial/repaired value
   returned).

## 9. Compatibility with other modules

`module:"goralQA"` still calls the original, completely unmodified
`callAnthropicEdge()` (text-based free JSON) — not touched by this round's
tool-forcing work. Confirmed by test §14 and by the full `goralQA`
regression suite (`_test_hall_wisdom_goral_qa_live_ai.mjs`) still passing
unchanged. `callAnthropicEdge()`'s own dedicated regression
(`_test_anthropic_provider_edge_content_blocks.mjs`) also still passes
unchanged — the Adaptive-Thinking content-block-collection fix from the
prior round is untouched.

## 10. Test results

| File | Result |
|---|---|
| `_test_kashf_ai_context_builder.mjs` (updated) | all passed, incl. new 13-point board-projection suite |
| `_test_kashf_structured_tool_output.mjs` (new) | 34/34 assertions passed |
| `_test_kashf_invalid_json_diagnosis.mjs` (from audit round) | all passed (unchanged) |
| `_test_oren_smart_advisor_kashf_reading_payload.mjs` | all passed |
| `_test_hall_wisdom_goral_qa_live_ai.mjs` | all passed |
| `_test_anthropic_provider_edge_content_blocks.mjs` | all passed |
| `_test_hall_wisdom_rule_decision_engine.mjs` | 218/218 |
| `_test_hall_wisdom_reading_planner.mjs` | 205/205 |
| `_test_hall_wisdom_reading_strategy_builder.mjs` | 282/282 |
| `_test_hall_wisdom_intent_analyzer.mjs` | 208/208 |

**Zero failures across all 10 suites.**

## 11. Confirmation — no AI call performed

Confirmed. Every test uses a mocked `fetch` (in-process, no network). No
real `ANTHROPIC_API_KEY`, no real live pilot invocation, this round.

## 12. Confirmation — no Deploy performed

Confirmed. No `supabase` CLI command run.

## 13. Confirmation — no UI changed

Confirmed. `git diff --stat` shows zero `.html` files touched.

## 14. Confirmation — no Kashf engine changed

Confirmed. Zero files under `goral-hachol/engine/` touched;
`raml-board-generator.js` itself untouched — `buildAiSafeKashfBoard()`
lives entirely in `kashf-ai-context-builder.js` and only projects the
already-returned board object, never alters how it's generated. `git diff
--stat` (below) shows exactly 5 modified + 2 new files, all inside
`goral-hachol/intelligence/` or `supabase/functions/oren-smart-advisor/`.

```
 _test_kashf_ai_context_builder.mjs                                          |  59 ++++++-
 goral-hachol/intelligence/kashf-ai-context-builder.js                       | 102 +++++++++-
 supabase/functions/oren-smart-advisor/ai-invocation-log.ts                  |  21 ++
 supabase/functions/oren-smart-advisor/anthropic-provider-edge.ts            | 130 +++++++++++-
 supabase/functions/oren-smart-advisor/index.ts                              |  50 +++--
 5 files changed, 334 insertions(+), 28 deletions(-)
 (+ 2 new untracked files: oren-smart-advisor-brain-tool-schema.ts, _test_kashf_structured_tool_output.mjs)
```

## 15. Exact next step

Awaiting your explicit approval to:
1. Commit + push these 7 files (5 modified + 2 new) — same two-step
   pattern as the audit round (show `git status`/`diff --stat`/`diff
   --cached --name-only` before commit, stop if anything unexpected
   appears).
2. Only after that: authorize a **single** new live pilot call (same
   `readingId`, same mothers/topicId/question — nothing else changed) to
   confirm the real `inputTokens` lands near the ~34,800 estimate and that
   `evaluatorMode:"live"` is actually reached this time, with no
   `max_tokens` increase and `effort` staying `medium`, per your Step G
   target.

---

## Not performed (awaiting further approval)

- Commit, Push, Deploy of this fix.
- Any additional live Anthropic call.
- Any change to `oren-smart-advisor-brain-prompt.ts`, any engine file, or
  any `.html` file.
