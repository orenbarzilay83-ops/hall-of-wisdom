# KASHF Phase 4 — Downstream Batch 07 (printed p111)

## Scope
- Printed Arabic source: book p111 / scan p113.
- Canonical source record: `shibutz.p111.money-number-table`.
- Downstream target: `goral-hachol/data/sources/kashf-al-asrar/kashf-shibutzim.js`.
- Queue item: `B05-DATA-P111-MONEY-TABLE`.

## Printed-source recheck
The printed page was read directly.

Correct p111 money table critical rows:
- H7 = 29
- H11 = 66, alternate 600
- H12 = 79, alternate 700

The p106 canonical sequence is a separate source table and remains unchanged:
- canonical position 7 = 28
- canonical position 11 = 66
- canonical position 12 = 78

No cross-normalization between p106 and p111 was introduced.

## Downstream repair
`SHIBUTZ_2_MONEY_BY_HOUSE` was corrected:
- H7: 28 → 29
- H11 alt: 760 → 600
- H12 alt: 770 → 700

The explanatory comment now explicitly separates the local p111 money table from the p106 canonical sequence.

## Regression
New regression:
`_test_kashf_money_table_p111.mjs`

It verifies all 16 p111 rows plus the p106 separation guard.

## Queue result
`B05-DATA-P111-MONEY-TABLE` → **RESOLVED**

Current downstream totals:
- total: 46
- resolved: 14
- remaining: 32

Next item:
`B05-P112-LISAN-STRUCTURE` — p112, `kashf-leshon-hainyan.js`.

## QA
GitHub Actions run `35868562221` — PASS.

Passed:
- p111 money-table regression;
- Book Rule Catalog;
- Rule Applicability;
- AI Retrieval Index;
- AI Retrieval Live Bridge;
- AI Context Builder;
- Professional Verdict Safety;
- Kashf/Hawi Method Isolation;
- Canonical Routing;
- Question Route Coverage;
- all prior downstream regressions p97–p102.
