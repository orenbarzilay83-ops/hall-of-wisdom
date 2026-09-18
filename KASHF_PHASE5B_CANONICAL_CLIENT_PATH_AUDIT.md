# KASHF Phase 5B — Canonical Client Path Closure

Date: 2026-09-18  
Baseline: `b3a01fd4d3bd23891fd1dbc257eb26e3e97da5a7`  
Working branch: `chatgpt/kashf-phase5b-canonical-client-path-v2`

## Purpose

Close the highest-priority integration gap found in Phase 5A:

- the advisor/AI path already used the canonical Question-ID authority;
- the visible client reading still used the legacy broad topic reader;
- the legacy exact router covered only 30/138 Question Bank IDs, so a selected question could still fall into a broader topic bundle.

Phase 5B makes an explicit Question Bank ID authoritative for the visible Kashf reading as well.

## Safety rule

For a selected Question Bank item the operational path is now:

`Question ID -> canonical route -> one canonical method -> v57 Hebrew knowledge -> one executor or explicit block`

There is no fallback to the broad legacy topic bundle when a Question ID exists.

The legacy `buildKashfReading(...)` path is retained only for explicit free-topic / no-selected-question flows.

## Implementation

### Browser module wiring

`goral-hachol.html` now loads and exposes:

- `buildKashfReadingByQuestionId`
- `writeCanonicalKashfReading`
- `buildRamlBoardFromMothers`

The existing legacy reader/writer remain available only for the free-topic branch.

### Client reading path

In `goral-hachol/ui/goral-app.js`:

- if `selectedQuestion.id` exists, the app rebuilds the canonical board directly from the four selected mothers;
- it executes `buildKashfReadingByQuestionId(canonicalBoard, selectedQuestion.id, clientCtx)`;
- it renders through `writeCanonicalKashfReading()`;
- blocked/repair/unsupported routes remain blocked and are rendered as canonical blocked output;
- no selected Question ID may fall through to `buildKashfReading(kashfBoard, kashfTopicId, clientCtx)`.

If there is no selected Question ID, the explicit legacy/free-topic path remains available.

## Preservation of the eight-runtime-gap closure

This work was applied on top of the final Phase 5A closure baseline `b3a01fd...`, not by merging the older stale Phase-5B branch.

The four newly runnable closure questions remain runnable:

- `q-message`
- `q-news-arrive`
- `q-well-drilling`
- `q-inheritance`

The four fail-closed questions remain blocked/repair-only:

- `q-lifespan`
- `q-lifespan-remaining`
- `q-mother`
- `q-dig-direction`

## QA

GitHub Actions run: `35338414815` — **PASS**

Passed:

- syntax checks for the modified UI and canonical engine/writer
- `_test_kashf_phase5b_canonical_client_path.mjs`
- `_test_kashf_phase5a_system_integration.mjs`
- `_test_kashf_close_eight_runtime_gaps.mjs`
- `_test_kashf_canonical_routing.mjs` — **1535 passed, 0 failed**
- `_audit_kashf_question_route_coverage.mjs`
- Phase 4 Wave 2 routing assertions
- Phase 4 Wave 3 blocker assertions

Coverage remains:

- Question IDs in bank: **138**
- Explicit canonical routes: **138**
- Unmapped: **0**
- Coverage: **100.0%**
- Runtime statuses: **54 ready, 19 blocked-by-source, 31 unsupported, 14 educational-only, 20 repair-required**

## Result

The Phase 5A split between AI routing and visible-client routing is closed for selected Question Bank questions.

The visible reading and the advisor/AI now share the same canonical Question-ID authority. Broad topic execution cannot override or soften a selected canonical decision.

Phase 5B does not add new source rules, does not reopen Phase-4 blockers, and does not promote any blocked method to ready.
