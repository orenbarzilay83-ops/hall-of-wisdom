# HALL_WISDOM_KASHF_HAWI_METHOD_ISOLATION_PRECOMMIT_REPORT

> Precommit report only. No AI call. No Deploy. No engine change (Kashf or
> Hawi). No UI change. No Commit, no Push — awaiting explicit approval.

Implements the approved Method Isolation Audit's recommended fix
(`HALL_WISDOM_KASHF_HAWI_METHOD_ISOLATION_AUDIT` — sent as a file earlier
this session). Audit conclusion, unchanged and reaffirmed: pilot-003's
deterministic verdict came from Kashf only; no evidence the AI used Hawi
prose to alter it; the fix here is **preventive**, not a correction of a
proven verdict error.

---

## 1. Which Hawi fields were removed from the Kashf AI payload

`board.houses[i].houseMeaning` and `board.houses[i].figureHouseMeaning` —
both confirmed (audit §2, `raml-board.js:42-43`) to originate from
`HAWI_SOURCE`/`getHawiFigureHouseMeaning()`, i.e. Hawi's own interpretive
figure-in-house prose. Removed entirely from `buildAiSafeKashfBoard()`'s
per-position projection — not trimmed, not summarized, structurally
absent (confirmed: `'houseMeaning' in position` is `false`).

## 2. Which Kashf fields remain

Per position (16 total): `house`, `houseNumber`, `figureId`, `pattern`
(new — the bare 4-digit figure pattern, e.g. `"1211"`, joined in from
`board.entries[i].pattern`), `figure` (`id`/`hebrewName`/`arabicName` —
objective figure-naming identity, unchanged from the prior round),
`figureState` (Kashf's own classification layer — fortune/movement/
element/gender/zodiac/seeker-status, unchanged). All structurally
necessary for the AI to identify which figure sits in which house and
its Kashf-native state — nothing needed for Kashf's own formula math was
removed (the formula engine itself never read `houseMeaning`/
`figureHouseMeaning` in the first place, per the audit's §3 verification).

## 3. How external supplemental evidence is tagged

`dhamirType4External` was already self-disclosing at the engine level
(`isExternalSource: true`, `sourceBook`, `disclosureHebrew` —
`kashf-dhamir-type4-external.js`, untouched). `buildAiSafeKashfEngineOutput()`
now adds one machine-readable tag at the **projection layer only**
(a shallow copy, never written back onto the engine's own return value):
`evidenceRole: "externalSupplementalAdvisorOnly"`.

## 4. Prompt instructions added

New rule #12 ("Method Isolation") in `oren-smart-advisor-brain-prompt.ts`:
verdict must come only from `readingContext.methodMetadata.primaryMethod`
and only from fields listed in `methodMetadata.allowedVerdictSources`;
anything in `methodMetadata.forbiddenForVerdict`, or tagged
`evidenceRole:"externalSupplementalAdvisorOnly"`, is advisor-only — may
not change/soften the verdict, may not appear as a verdict in
`clientAnswerDraft`, may not be merged with the primary method's rules
into a new rule; apparent contradictions must be shown as a separate
finding, never as a contradiction to the verdict or a rule of the primary
method. The input-structure section now also documents
`readingContext.methodMetadata`. Prompt version bumped
`oren-smart-advisor-brain-prompt-v1` → `-v2`.

## 5. Payload size before/after

Same real scenario (mothers `['1211','1212','1121','1122']`, topicId
`spiritualDiagnostics`, `readingId: kashf-live-pilot-003`), measured
deterministically:

| | Before (post-Structured-Output round) | After (this round) |
|---|---|---|
| `board` | 67,858 bytes | 11,992 bytes |
| full payload | 83,477 bytes | 27,929 bytes |

**66.5% further reduction this round; 94.2% total from the original
478,095-byte baseline.**

## 6. Did the verdict stay identical?

**Yes — verified, not assumed.** `overallPositive`, `primaryFormula.verdict`,
and `altFormula.verdict` in the new AI payload are asserted byte-identical
(`JSON.stringify` equality) to a fresh, direct `buildKashfReading()` call
on the same unmodified board (test §5/§6, `_test_kashf_hawi_method_isolation.mjs`).
The removed fields were never read by any formula/verdict computation
(confirmed both in the audit and re-confirmed here) — this round only
removes what the AI *sees*, not anything the engine *computes*.

## 7. Kashf test results

| File | Result |
|---|---|
| `_test_kashf_hawi_method_isolation.mjs` (new) | 30/30 assertions passed |
| `_test_kashf_ai_context_builder.mjs` (updated) | all passed (obsolete `houseMeaning`/`figureHouseMeaning`-presence assertions replaced with absence assertions) |
| `_test_kashf_structured_tool_output.mjs` | all passed, unchanged |
| `_test_kashf_invalid_json_diagnosis.mjs` | all passed, unchanged |
| `_test_oren_smart_advisor_kashf_reading_payload.mjs` | all passed, unchanged |

## 8. Hawi test results

No dedicated standalone Hawi regression file exists in the repo currently
(the `verify-hawi-full-audit.mjs` referenced in `WORKPLAN.md` history is
not present in the working tree). Confirmed instead structurally: `git
status --short` shows zero files under `goral-hachol/engine/` or
`goral-hachol/ui/` touched this round (test §4); `hawi-interpreter.js` and
`raml-board-generator.js`/`raml-board.js` are byte-untouched; the raw
board returned by `buildRamlBoardFromMothers()` still carries
`houseMeaning`/`figureHouseMeaning` unchanged (test §3) — the fix removes
these only from the *AI projection*, never from the shared board used by
Hawi's own UI/engine.

## 9. Confirmation — no engine changed (Kashf or Hawi)

Confirmed. `git status --short`: only `kashf-ai-context-builder.js`
(the AI-projection layer, not `kashf-reading-engine.js` or any file under
`goral-hachol/engine/`), `oren-smart-advisor-brain-prompt.ts`, and test
files. Zero engine files in either method were modified.

## 10. Confirmation — no AI call performed

Confirmed. All new/updated tests use only local, deterministic function
calls — no `fetch`, no `callAnthropic*` reference (test §13).

## 11. Confirmation — no Deploy performed

Confirmed. No `supabase` CLI command run this round.

## 12. Exact next step

Awaiting your explicit approval to:
1. Commit + push the files touched this round (list below) — same
   verify-then-commit pattern as prior rounds.
2. Only after that: decide whether to authorize a new live pilot call
   (new `readingId`, same mothers/topicId/question) to confirm the real
   `inputTokens` lands near the ~27,929-byte payload's proportional
   estimate (roughly 12,000-13,000 tokens, scaling from the 38,311-token/
   83,477-byte measurement of the prior round) — not performed this round.

---

## Files touched this round (uncommitted, awaiting approval)

- `goral-hachol/intelligence/kashf-ai-context-builder.js` (modified —
  `buildAiSafeKashfBoard` drops Hawi fields + adds `pattern`;
  `buildAiSafeKashfEngineOutput` tags `dhamirType4External`; new
  `KASHF_METHOD_METADATA` wired into `readingContext.methodMetadata`)
- `supabase/functions/oren-smart-advisor/oren-smart-advisor-brain-prompt.ts`
  (modified — new rule #12, `methodMetadata` documented, version bumped)
- `_test_kashf_ai_context_builder.mjs` (modified — obsolete assertions
  replaced)
- `_test_kashf_hawi_method_isolation.mjs` (new — 30 assertions)

**Not part of this round** (pre-existing, separate, local-only from the
earlier pilot-003 output-capture work, unrelated to Method Isolation):
`_test_oren_smart_advisor_kashf_live_runner.mjs` (modified),
`_test_kashf_live_runner_output_capture.mjs` (new).
