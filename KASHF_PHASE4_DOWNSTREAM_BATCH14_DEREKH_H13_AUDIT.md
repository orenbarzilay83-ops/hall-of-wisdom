# KASHF Phase 4 — Downstream Batch 14: p163 Derekh H13 Polarity

## Scope
Queue: `B10-DEREKH-H13-POLARITY-DOWNSTREAM`.

## Source closure
The original printed p163 was re-read directly.

Authoritative H13 branches:
- H9 internal + H10 external → quick return from the journey.
- H9 external + H10 internal → delay in the journey / long stay.

The historical reversed wording is not used.

## Downstream repair
`DEREKH_HOUSE_RULES[13]` now matches the printed source and current v57 index.
Both branches point to p163.

`computeDerekhHouseRuleKashf()` required no algorithm rewrite: it already derives H13 from H9/H10 and consumes the data table.

Undefined same-polarity combinations remain unresolved rather than inferred.

## Regression
Added `_test_kashf_derekh_h13_p163.mjs`.

## QA
GitHub Actions run `35892641124` — **PASS**:
syntax, p163 polarity regression, canonical routing, professional verdict safety, AI retrieval live bridge, rule applicability, route coverage.

## Result
`B10-DEREKH-H13-POLARITY-DOWNSTREAM` → **RESOLVED**.

Official downstream:
- 23/46 resolved
- 23 remaining
