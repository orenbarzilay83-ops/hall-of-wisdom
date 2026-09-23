# KASHF Phase 4 — Downstream Batch 16: House-1 p166–172 Intent Boundaries + P0-G

## Closed queue items
- `B11-HOUSE1-INTENT-ROUTING-DEFERRED`
- `B11-P168-169-LOCATION-PROCEDURE-BLOCKED`
- `B11-P170-171-ALTERNATE-ISTIKHARA-NO-RUNTIME`

## Source recheck
Printed pp167–171 were rechecked.

Key source boundaries:
- p167 `هل ورائي عمل` asks whether an action/work is behind the querent; it does not ask whether an action is behind “the matter”.
- p169 H6+H8 validity names Venus, Moon and Mercury/`عطارد`.
- pp168–169 do not fully define the balance-point walking endpoint or second-figure selection needed for the location/name/color procedure.
- p170 marks the istikhara material as outside the book; the alternate table continues through p172.

## Canonical separation
Explicit non-aggregating records now exist for:
- p166–167 connection initiator/degree
- p168–169 location/name/color balance walk
- p169 H6+H8 matter validity
- p169–170 need/outcome rules
- p170 mutual gaze
- p170–172 external istikhara table

Only source/runtime-safe methods may execute.

## p167 pronoun repair
The runnable p167 hidden-action path now says “behind the querent” consistently in:
- canonical executor
- canonical method notes
- v57 operational knowledge registry
- retrieval aliases
- Question Bank wording
- professional verdict safety
- regression tests

Broad old paraphrases such as “behind the matter” are excluded from selecting p167 from free text.

## P0-G Question Bank cutover
The visible Kashf Question Bank path now uses:
- `buildKashfReadingByQuestionId`
- `writeCanonicalKashfReading`

A known Question ID cannot fall back to the legacy topic bundle.
Blocked, repair-required, educational-only and unsupported routes fail closed.
The old topic API remains only for no-Question-ID compatibility mode.

## External istikhara
`decision.external.p170-172.istikharaFigureTable` is:
- external-tradition
- educational-only
- runtimeAllowed=false

Direct canonical execution is regression-tested to fail closed.

## QA
GitHub Actions run `35895167409` — **PASS**.

Passed:
- syntax
- House1 p166–172 boundary regression
- canonical routing
- AI retrieval index
- AI retrieval live bridge
- professional verdict safety
- book-rule catalog
- rule applicability
- Kashf/Hawi isolation
- route coverage

## Result
Official downstream:
- **28/46 RESOLVED**
- **18 remaining**

Next queue:
- `B12-HOUSE1-P172-178-INTENT-ROUTING-DEFERRED`
- `B12-P176-SUBBOARD-RECAST-NO-RUNTIME`
- `B12-P177-RELATIVE-THIRTEENTH-BLOCKED`
- `B12-P178-LIFESPAN-COMPUTATION-BLOCKED`
