# KASHF Phase 4 — Downstream Batch 15: Seven Witnesses + Proximity Isolation

## Scope
Closed together:
- `B10-SEVEN-WITNESSES-SUPPORTING-ROLE`
- `B10-PROXIMITY-NO-RUNTIME-WITHOUT-DEFINITION`

## Printed-source recheck
Printed p164 confirms seven witnesses exactly:
H9, H10, H11, H12, H13, H14, H15.

H16 is added separately to know the querent's hidden intention; it is not an eighth witness.

Printed pp164-165 also contain multiple figure-proximity clauses, but the passage does not define a computational board-adjacency/proximity algorithm suitable for runtime.

## Seven Witnesses boundary
`SEVEN_WISDOM_WITNESSES_NOTE` now explicitly records:
- witnessHouses = H9-H15
- hiddenIntentionHouse = H16
- H16 does not count as a witness
- operationalRole = SUPPORTING_ONLY
- no primary auto-routing
- no merging with other witness systems

## Proximity boundary
Added `FIGURE_PROXIMITY_RUNTIME_POLICY`:
- REFERENCE_ONLY
- runtimeEligible=false
- mayAutoRun=false
- mayFeedVerdict=false
- computationalDefinitionStatus=UNRESOLVED
- knowledgeStatus=REVIEW_REQUIRED

The existing proximity source records remain available for source review, but their unresolved semantics cannot enter runtime.

## Regression
Added:
`_test_kashf_gate5_witness_proximity_isolation.mjs`

It verifies the H9-H15/H16 separation and recursively checks live runtime directories for forbidden imports/references to the Gate-5 Seven-Witnesses and proximity symbols.

## QA
GitHub Actions run `35893073355` — **PASS**.

Passed:
- syntax
- Gate5 witness/proximity isolation
- p163 Derekh polarity regression
- Kashf/Hawi method isolation
- canonical routing
- professional verdict safety
- Dhamir runtime precedence
- route coverage

## Result
- `B10-SEVEN-WITNESSES-SUPPORTING-ROLE` → RESOLVED
- `B10-PROXIMITY-NO-RUNTIME-WITHOUT-DEFINITION` → RESOLVED

Official downstream:
- 25/46 resolved
- 21 remaining
