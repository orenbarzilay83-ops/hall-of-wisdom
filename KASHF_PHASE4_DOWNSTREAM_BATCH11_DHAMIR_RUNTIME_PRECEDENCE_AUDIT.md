# KASHF Phase 4 — Downstream Batch 11: Element Traditions + Need-Driven Dhamir Runtime

## Scope
Closed three downstream items together because they are one runtime-precedence problem:
- `B07-DATA-ELEMENT-TRADITIONS-RUNTIME-PRECEDENCE`
- `B07-DHAMIR-NEED-DRIVEN-SELECTION`
- `B09-DHAMIR-MAJORITY-RUNTIME-DISABLED`

Current downstream status after this batch:
- total: 46
- resolved: 20
- remaining: 26

## Source-faithful data boundary

### p122
The working element values remain:
- fire 1
- air 2
- water 3
- earth 4

They are now identified as the named tradition `p122-author-working`.
Importing this table no longer gives it automatic runtime authority.

### p126
The three distinct traditions remain separate:
- al-Zanati: 9 / 11 / 14 / 16
- Abu Sa'id al-Trabulsi: 1 / 2 / 4 / 8
- Ahl al-Tabai': 1 / 2 / 3 / 4

All three are `REFERENCE_ONLY` by default:
- `runtimeEligible:false`
- `mayAutoSelect:false`
- `mayVoteAgainstSelectedTradition:false`

No normalization or consensus engine was created.

### p131→132
The source conflict is preserved rather than repaired:
- Ahl al-Tabai': 8 / 4 / 2 / 1
- al-Zanati: 1 / 2 / 3 / 4
- the text states al-Trabulsi agrees with al-Zanati there

This remains `SOURCE_CONFLICT`.
It cannot override p122 or p126.

## Runtime repair

### One approved intent
Kashf Dhamir runtime now requires:
- `intentId: hiddenThoughtIntent`
- one explicit `methodId`

An unrelated intent is blocked before any Dhamir calculation.

### One selected method
`computeSelectedDhamirMethod()` executes exactly one method.
It reports `methodsExecuted` with only that method.

There is no fallback to all methods and no fallback to majority.

### Element-prevalence
The element-prevalence Dhamir method now additionally requires an explicit `elementTraditionId`.

Only a runtime-eligible tradition can execute.
Reference-only p126 traditions are rejected.

The result records:
- `elementTraditionId`
- `elementTraditionSourceRef`

### Legacy reading engine
`buildKashfReading()` no longer computes Dhamir automatically.

Default readings now return:
- `dhamir: null`
- `dhamirType4External: null`
- `dhamirExtras: null`

Dhamir is only computed after explicit `clientContext.dhamirSelection`.

The external Type-4 supplement also requires explicit opt-in:
`enableExternalDhamirType4 === true`.

Dhamir extras require:
- an already-selected Dhamir house
- `enableDhamirExtras === true`

## p155 majority rule
`computeDhamirByMajority()` remains in the source engine because the majority rule is explicitly part of the book.

However, `buildKashfReading()` no longer imports or calls it.

Therefore:
- source rule preserved: yes
- code preserved: yes
- default runtime execution: no
- automatic 3/5 or all-method vote: no

The book-rule catalog was updated accordingly:
implemented Dhamir methods are availability facts, not proof that they ran.
Default payload now reports 0 evaluated / 0 applied Dhamir methods.

## Brain / registry alignment
The downstream brain now matches runtime behavior:
- Kashf Dhamir is `forbidden` for unrelated question types
- `hiddenThoughtIntent` is the only approved direct Dhamir intent
- within hiddenThoughtIntent it remains advisor-only unless separately exposed later
- engine registry marks Dhamir runtime as conditional explicit selection
- the external Type-4 runtime role is explicit external opt-in

Hawi behavior was not changed.

## Regression coverage
Added:
- `_test_kashf_dhamir_runtime_precedence_wave.mjs`

Updated:
- `_test_kashf_dhamir_need_driven_p121_123.mjs`
- `_test_goral_rule_applicability.mjs`
- `_test_goral_qa_brain_phase2.mjs`
- `_test_goral_knowledge_decision_brain_phase4.mjs`
- `_test_kashf_book_rule_catalog.mjs`
- `_test_kashf_hawi_method_isolation.mjs`

## QA
GitHub Actions run `35880640295` — **PASS**.

Passed:
- syntax checks
- Batch11 Dhamir runtime precedence
- Batch10 need-driven Dhamir
- rule applicability
- Knowledge/Decision Brain Phase 4
- QA Brain Phase 2
- Book Rule Catalog
- Kashf/Hawi Method Isolation
- AI Context Builder
- AI Retrieval Index
- AI Retrieval Live Bridge
- Professional Verdict Safety
- Canonical Routing
- Question Route Coverage
- all prior downstream regressions through p112

## Queue result
Resolved in this batch:
1. `B07-DATA-ELEMENT-TRADITIONS-RUNTIME-PRECEDENCE`
2. `B07-DHAMIR-NEED-DRIVEN-SELECTION`
3. `B09-DHAMIR-MAJORITY-RUNTIME-DISABLED`

Next source-order item:
`B08-SHIB-5-SEASON-MAP-SOURCE-CORRECTION` — printed pp136–137.
