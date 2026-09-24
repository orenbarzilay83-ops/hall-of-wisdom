# KASHF Phase 4 — Canonical Rule Decision Payload

## Purpose
Close the roadmap gap in the Kashf AI Context Package:

- `activatedRuleIds`
- `rejectedRuleIds`
- `decisionSummary`

without inventing a synthetic per-rule catalogue and without weakening the existing generic Hall of Wisdom Rule Decision Engine contract.

## Architecture decision
The generic `rule-decision-engine.js` remains unchanged.

Its contract requires full Rule Definitions, source evidence, categories and activation metadata. The current canonical Kashf registry does not contain a source-faithful one-to-one Rule Definition catalogue with those fields, so this work does **not** fabricate one.

Instead, a narrow adapter was added:

`goral-hachol/intelligence/kashf-canonical-rule-decision.js`

It projects a deterministic decision payload only from facts already established by the canonical pipeline:

1. authoritative Question Bank route / canonical retrieval resolution
2. exact `kashfMethodId`
3. canonical reading validity and runtime permission
4. exact method alignment between route, retrieval and reading
5. professional verdict safety
6. explicit retrieval `doNotMixWith`
7. non-selected retrieval candidates

No new geomantic rule is created by this adapter.

## Activation semantics
A rule is placed in `activatedRuleIds` only when all canonical gates agree:

- one method was resolved
- the selected method is the same method returned by canonical retrieval
- the canonical reading is valid
- `canRunKashf === true`
- the reading executed that same method
- professional verdict safety passed
- `aiVerdictAllowed === true`

Therefore the activation set is either:
- exactly one canonical Kashf method, or
- empty.

There is no majority vote and no fallback method.

## Rejection semantics
`rejectedRuleIds` is reading-local. It does **not** mean that a method is globally invalid.

It contains:
- the selected method itself when it cannot pass canonical runtime/source/safety gates
- methods explicitly listed in the selected retrieval record’s `doNotMixWith`
- non-selected retrieval candidates for the current question

The activated method is always removed from the rejected set.

## Source evidence
The adapter passes the canonical v57 Hebrew source rule into `sourceEvidence` with its page number.

Arabic remains verification-only and is not promoted into the operational client rule.

## decisionSummary
`decisionSummary` is deterministic and contains:
- selected method / intent
- how many alternate paths were rejected
- v57 page when available
- explicit statement that no majority/fallback/alternate aggregation is allowed

It does not copy the user’s question, client name or other personal information.

## AI Context integration
`goral-hachol/intelligence/kashf-ai-context-builder.js` is now v10.

In canonical mode it writes:
- `readingContext.canonicalRuleDecisionVersion`
- `readingContext.activatedRuleIds`
- `readingContext.rejectedRuleIds`
- `readingContext.sourceEvidence`
- top-level `decisionSummary`

Canonical mode no longer reports these four fields as missing.

Legacy/non-canonical mode remains fail-honest:
- activated/rejected remain empty
- decisionSummary is omitted
- the fields remain documented in `missingFields`

No legacy rule IDs are invented.

## Retrieval-shadowing defect found by the new test
The first QA run exposed a real integration defect: `RETRIEVAL_OVERRIDES` contained later duplicate keys that shadowed stricter p191/p196 isolation metadata.

The duplicates were consolidated and removed. The final retrieval object now has one definition per method key, preserving all useful aliases and the stricter `doNotMixWith` boundaries.

This is why the first temporary QA run failed and the final run passed; no source rule was weakened to satisfy the test.

## Regression
Added:

`_test_kashf_canonical_rule_decision_payload.mjs`

Coverage includes:
- q-gender → only p191 H5 gender method activates
- p192 gender alternatives reject
- q-birth-ease → p194 delivery alternative rejects
- q-miscarriage → exact p191→192 miscarriage method activates; child/maternal safety do not vote
- q-illness-heal → H15 only; duration/sensory/body-part methods reject
- blocked q-dig-direction → zero activation and no fallback
- route authority beats disagreeing retrieval text
- source evidence is v57
- decision summary contains no supplied private marker
- canonical AI Context Package carries the real decision payload
- legacy context path remains honest and partial

## QA
Final GitHub Actions run `35986026389` — **PASS**.

Passed:
- canonical Rule Decision payload regression
- AI Context Builder regression
- generic Hall of Wisdom Rule Decision Engine regression
- Batch21 pregnancy/illness boundary regression
- canonical routing: **1751 / 0**
- AI retrieval: **772 / 0**
- indexed records: **88**
- source-ready retrieval coverage: **60/60**
- runnable retrieval coverage: **46/46**
- live bridge: **145 / 0**
- professional verdict safety: **425 / 0**
- book-rule catalog
- rule applicability
- Kashf/Hawi isolation
- Question Route Coverage: **138/138 = 100%**
- Master Index Source Freeze: **48/48; 9 RESOLVED; 39 SOURCE_CONFLICT/NON_OPERATIONAL; 0 OPEN**

## Result
The Rule Decision payload roadmap item is complete for the canonical Kashf path.

## Next phase
Golden/E2E:

`question → intent → method → engine → source retrieval → Rule Decision payload → AI context → advisor output`

No Golden Case may bypass the canonical route, source boundary or professional verdict safety gate.
