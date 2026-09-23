# KASHF Phase 4 — Downstream Batch 10 (printed pp121–123)

## Scope
- Printed Arabic source: book pp121–123.
- Canonical source record: `shibutz.p121-123.elements-order`.
- Downstream targets:
  - `goral-hachol/engine/kashf-dhamir.js`
  - `goral-hachol/engine/kashf-leshon-hainyan.js`
- Queue item: `B06-DHAMIR-NEED-DRIVEN`.

## Printed-source recheck
Printed p121 explicitly closes the attributed-distance variant block with:
`رجع إلى النسخة الأولى` — return to the first copy.

Printed p122 then gives the third placement order and the element values:
- fire = 1
- air = 2
- water = 3
- earth = 4
- Path is the root and the total is 10.

The source establishes the element data. It does **not** say that the mere presence of those values should trigger every implemented dhamir calculation. The need-driven boundary in this batch is therefore a project runtime policy, not an invented source quotation.

## Downstream repair
`kashf-dhamir.js` now exposes:
- `KASHF_DHAMIR_NEED_DRIVEN_POLICY`
- `KASHF_DHAMIR_IMPLEMENTED_METHOD_CATALOG`
- `computeSelectedDhamirMethod(board, methodId)`

The selector:
- requires an explicit method id;
- blocks missing or unknown method ids before touching the board;
- executes exactly one selected method;
- reports `methodsExecuted` with that one method only;
- never falls back to `computeDhamirByMajority`;
- does not infer a question→method mapping from the existence of `SHIBUTZ_3_ELEMENT_VALUES`.

The catalog records that only `element-prevalence` consumes the p122 element-value table among the five currently implemented dhamir methods.

## Lisan isolation
`kashf-leshon-hainyan.js` previously called `computeDhamirByMajority(board)` whenever no dhamir house was supplied. That meant invoking Lisan could indirectly execute every implemented dhamir method.

That fallback was removed. Lisan now:
- requires an explicitly supplied dhamir house;
- returns `null` if the house is missing or invalid;
- labels a valid input as `provided-explicitly`;
- does not import or call the majority aggregator.

The p112 structural-timing behavior remains unchanged.

## Scope deliberately not changed
`computeDhamirByMajority` remains in `kashf-dhamir.js` because the majority rule itself is explicitly present later in the source (p155). This batch does not decide its final runtime status; that is tracked separately by the downstream precedence/runtime item.

The legacy broad `kashf-reading-engine.js` was therefore not rewritten in this batch.

## Regression
New regression:
`_test_kashf_dhamir_need_driven_p121_123.mjs`

It verifies:
- explicit single-method policy;
- no auto-selection from source-data availability;
- missing/unknown selection blocks without board access;
- only the selected element-prevalence method executes;
- p122 water=3 outranks air=2 in the synthetic H15 test;
- Lisan no longer triggers majority implicitly;
- explicit Lisan dhamir-house input still works.

## Queue result
`B06-DHAMIR-NEED-DRIVEN` → **RESOLVED**

Current downstream totals:
- total: 46
- resolved: 17
- remaining: 29

Next item:
`B07-DATA-ELEMENT-TRADITIONS-RUNTIME-PRECEDENCE` — pp124–126/132.

## QA
GitHub Actions run `35874220919` — **PASS**.

Passed:
- Batch10 need-driven dhamir regression;
- p112 Lisan structural regression;
- Batch09 attributed-method isolation;
- syntax checks;
- Book Rule Catalog;
- Rule Applicability;
- AI Retrieval Index;
- AI Retrieval Live Bridge;
- AI Context Builder;
- Professional Verdict Safety;
- Kashf/Hawi Method Isolation;
- Canonical Routing;
- Question Route Coverage;
- all prior downstream regressions p97–p111.
