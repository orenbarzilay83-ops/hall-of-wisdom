# KASHF Phase 5C — Client ↔ AI Canonical Parity Audit

Date: 2026-09-18  
Baseline: `ecd498141223e5bc98c0323abcdc63bac70e7006`  
Working branch: `chatgpt/kashf-phase5c-client-ai-parity-audit`

## Purpose

After Phase 5B moved the visible client reading onto the canonical Question-ID path,
this audit verifies that the visible reading and the AI/advisor context now receive
the same canonical Kashf decision for every Question Bank route.

This phase is QA/documentation only. It does not add source rules, does not change
any executor, and does not promote blocked methods.

## Whole-bank parity result

The new regression `_test_kashf_phase5c_client_ai_parity.mjs` audits all 138
canonical Question-ID routes with one deterministic four-mother board.

For every Question ID it verifies:

- the route resolves to the same `kashfMethodId` and `kashfIntentId` for client and AI;
- `buildKashfReadingByQuestionId()` is the client-side canonical authority;
- `buildKashfAiContextPackage()` exposes the AI-safe projection of that exact canonical reading;
- `verdict`, `overallPositive`, runtime status and method identity are identical;
- runnable routes execute exactly one canonical method;
- runnable routes never execute a broad topic bundle;
- blocked/repair/unsupported/educational routes remain fail-closed;
- runnable AI payloads carry v57 Hebrew operational knowledge and source evidence;
- blocked routes never receive `aiVerdictAllowed:true`.

## Results

Final GitHub Actions run: `35339460196` — **PASS**

Whole-bank counts:

- Question IDs audited: **138**
- Runnable: **54**
- Non-runnable / blocked: **84**
- Runtime status counts:
  - ready: **54**
  - blocked-by-source: **19**
  - unsupported: **31**
  - repair-required: **20**
  - educational-only: **14**
- Distinct canonical topic IDs represented: **29**
- Runnable routes with AI verdict allowed: **54 / 54**
- Runnable routes withheld by Professional Verdict Safety: **0**
- Canonical routing regression: **1535 passed, 0 failed**
- Question-route coverage remains **138 / 138, 100%**

## Stale regression repaired

During the audit, `_test_kashf_ai_retrieval_live_bridge.mjs` still expected
`q-mother` to be source-ready with a pending executor.

That expectation was stale after the final Phase-5A source disposition.

The test now matches the approved final state:

- method: `mother.p257.statusDayNight`
- runtime status: `blocked-by-source`
- executor status: `not-applicable`
- Hebrew knowledge may remain retrievable for inspection;
- AI verdict remains forbidden;
- canonical runtime remains blocked.

No production behavior changed; only the stale regression was corrected.

## Remaining architectural finding

The parity itself is correct, but `buildKashfAiContextPackage()` still requires
the caller to provide a separate `topicId` even when a Question Bank
`questionId` is already authoritative.

This is now redundant authority.

The builder currently validates `topicId` before it builds the canonical
Question-ID bridge. Therefore a request containing:

- four valid mothers,
- a valid authoritative Question ID,
- a valid question text,

still fails to build an AI Context Package if `topicId` is omitted.

The same external `topicId` is also passed into the generic
Intent/Reading-Strategy/Reading-Plan and topic-level rule-coverage layers.

The canonical method registry already owns a `topicId` for each method, so
the next hardening step should make the canonical method/question route the
authority for topic metadata whenever a Question ID is selected.

## Recommended next gate — Phase 5D

For an explicit selected Question ID:

1. resolve the canonical route first;
2. derive effective topic metadata from the selected canonical method;
3. do not require a second caller-supplied topic ID;
4. if a caller supplies a conflicting topic ID, preserve it only as diagnostic
   input if needed — never as routing/knowledge authority;
5. keep free-topic/retrieval-only flows separate;
6. rerun the 138-route client↔AI parity sweep and all existing canonical tests.

This change should be isolated to the intelligence/router metadata path. It
must not alter Kashf source rules, executors, verdicts, or Phase-4 blockers.
