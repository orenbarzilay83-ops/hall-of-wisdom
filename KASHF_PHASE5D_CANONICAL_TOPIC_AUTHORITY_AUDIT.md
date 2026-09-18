# KASHF Phase 5D — Canonical Topic Authority

Date: 2026-09-18  
Baseline: `261b6d52c5041f449dd2528e120af194ba0eabef`  
Working branch: `chatgpt/kashf-phase5d-canonical-topic-authority`

## Purpose

Close the Phase 5C architectural finding: `buildKashfAiContextPackage()`
required a second caller-supplied `topicId` even when an authoritative
Question Bank `questionId` had already resolved one canonical Kashf method.

That created redundant authority:

`Question ID -> canonical method` **and** external `topicId`.

Phase 5D removes that duplication for canonical flows.

## New authority chain

For a selected Question Bank item:

`Question ID -> canonical route -> canonical method -> method.topicId -> v57 -> executor -> AI context`

The method registry now owns the topic metadata used by the AI context.

## Implementation

### 1. Router exposes method-owned topic

`goral-hachol/engine/kashf-method-router.js`

Successful method-backed route resolutions now expose:

`topicId: method.topicId`

Invalid/unmapped/missing-method routes expose no invented topic.

### 2. Canonical AI bridge propagates topic

`goral-hachol/intelligence/kashf-canonical-ai-bridge.js`

Both authoritative Question-ID resolution and uniquely resolved free-text
canonical retrieval now carry the canonical method topic in
`resolution.topicId`.

The route-only fallback prefers canonical `route.topicId` and retains the
legacy topic only as a compatibility fallback.

### 3. AI Context Builder uses one topic authority

`goral-hachol/intelligence/kashf-ai-context-builder.js`

Version advanced:

`kashf-ai-context-builder-v9 -> v10`

For a resolved canonical method:

- `topicId` is no longer required from the caller;
- the method-owned canonical topic becomes `effectiveTopicId`;
- Intent/Strategy/Plan and Book Rule Coverage receive `effectiveTopicId`;
- a conflicting caller `topicId` cannot override the canonical method topic;
- the conflict is preserved only as diagnostic metadata in
  `readingContext.topicResolution`.

Diagnostic structure:

- `effectiveTopicId`
- `callerTopicId`
- `canonicalTopicId`
- `authority`
- `callerConflict`

Legacy/non-canonical flow still requires an explicit topic. No topic is
invented when no canonical method resolves.

## Whole-bank verification

New regression:

`_test_kashf_phase5d_canonical_topic_authority.mjs`

It verifies all **138/138** Question Bank routes while deliberately omitting
caller `topicId`.

For every route:

- canonical method exists;
- router topic equals `method.topicId`;
- AI Context Package builds without caller topic;
- topic authority is `canonical-method`;
- effective topic equals method registry topic;
- rule coverage is built from that canonical topic.

Additional guards prove:

- a deliberately wrong caller topic (`commerce`) cannot override
  `q-travel-safe -> travel.p238.assemble1359 -> travel`;
- uniquely resolved free-text canonical retrieval derives its own topic;
- non-canonical legacy flow without a topic remains fail-closed.

## QA

Final GitHub Actions run: `35340085547` — **PASS**

Passed:

- Phase 5D canonical topic authority
- Phase 5C client↔AI parity
- Phase 5B canonical client path
- Phase 5A system integration
- Canonical routing — **1535 passed, 0 failed**
- AI Context Builder regression
- AI Retrieval Live Bridge — **146 passed, 0 failed**
- Question Route Coverage — **138/138, 100.0%**
- Eight runtime-gap closure regression

Runtime counts remain unchanged:

- ready: **54**
- blocked-by-source: **19**
- unsupported: **31**
- repair-required: **20**
- educational-only: **14**

## Source/runtime safety

Phase 5D changes no Kashf source rule, no v57 content, no executor logic and no
runtime status. It does not reopen any Phase-4/5A blocker.

The change is authority/metadata hardening only.

## Result

The canonical selected-question path no longer has two independent topic
authorities.

For Question Bank flows, the method registry is now the single source of topic
metadata for both deterministic execution context and AI context construction.
