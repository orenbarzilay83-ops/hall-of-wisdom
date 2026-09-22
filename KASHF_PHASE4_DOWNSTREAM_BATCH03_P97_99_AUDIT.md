# KASHF Phase 4 — Downstream Batch 03 (printed pp97–99)

## Scope and authority

- Authoritative evidence: printed Arabic scan, book pp97–99 / scan PDF pp99–101.
- Canonical Hebrew evidence: `kashf-v57-draft.html`.
- Master Index evidence: `figures.p97-99.dignities-source-table`.
- Downstream target: `goral-hachol/data/sources/kashf-al-asrar/kashf-figure-attributes-gate2.js`.
- Existing consumer checked: `goral-hachol/engine/kashf-dhamir.js` (Dhamir Type 2 derives its maala map from this table).
- No new Registry, Routing, executor, AI policy, or runtime-status rule was introduced.

## Source recheck

Printed pp97–99 were rechecked directly against the scan before the downstream repair.

The printed dignity chapter contains **14 figure rows**, not 16.

Explicitly absent from this printed table:

- `2121` — ממון נכנס / `قبض داخل`
- `1221` — סוהר / `العقلة`

Explicitly present in the printed table:

- `2112` — חיבור / `الإجتماع`
- `1111` — דרך / `الطريق`

The source also confirms the row-level repairs now stored in data, including:

- סף יוצא: face H7, joy H6;
- כבוד נכנס: joy H12;
- חיבור: maala H11, moshav H15, gvul H15, face H6, joy H15, mezeg H3;
- כבוד יוצא: face H12, mezeg H6;
- דרך: maala H13, moshav H13, gvul H16, face H15, joy H13, mezeg H5;
- ממון יוצא: face H5.

For ממון יוצא the sorrow statement remains an indirect “opposite” reference. It is kept non-numeric; no house was inferred.

## Downstream repair

`FIGURE_DIGNITIES` was rebuilt to the exact 14-row printed-source set preserved in the Master Index.

Repairs include:

1. removed unsupported `2121` / `1221` dignity rows;
2. restored `2112` / `1111`;
3. corrected the affected row values listed above;
4. changed the table provenance from historical `kashf-hebrew-v56` to corrected `kashf-hebrew-v57`;
5. changed `FIGURE_DIGNITIES_METADATA.omittedFigures` to exactly the two source-omitted figures;
6. retained explicit no-inference / no-other-tradition completion policy.

## Historical verification correction

The historical report
`HALL_WISDOM_KASHF_ESSENTIAL_DIGNITIES_EXISTING_DATA_VERIFICATION_REPORT.md`
had certified the old v56-derived table as “98/98 source verified”.

That conclusion is now explicitly marked **SUPERSEDED**.

The current authority is the printed-scan audit + Master Index record +
the rewritten `_test_kashf_essential_dignities_table.mjs`.

This correction is deliberate: downstream code is not allowed to become
“source truth” merely because an older regression encoded it.

## Existing runtime consumer

`kashf-dhamir.js` already imports `FIGURE_DIGNITIES` and derives
`FIGURE_MAALA_HOUSE` from it for Dhamir Type 2.

No Dhamir algorithm was changed in this batch. Only stale source comments
inside that file were corrected.

Because the data dependency is live, the consumer and broader safety suite
were rerun rather than treating this as a documentation-only change.

## Queue result

Master Index downstream item:

`B04-DATA-DIGNITIES-SOURCE-DRIFT` → **RESOLVED**

Current downstream totals:

- total: **46**
- resolved: **10**
- remaining: **36**

The next source-ordered downstream item is the p100 joy/grief supplement
(`B04-DATA-JOY-VENUS`). It is **not** part of Batch 03.

## QA

GitHub Actions run: `35714694059` — **PASS**

Passed:

- syntax checks for the corrected data file, Dhamir consumer, and GT-10;
- GT-10 printed-source dignity regression — PASS;
- GT-3A requester-circle separation — PASS;
- Kashf AI Retrieval Index — **520 passed, 0 failed**;
- Kashf AI Retrieval Live Bridge — **145 passed, 0 failed**;
- AI Context Builder — PASS;
- Professional Verdict Safety — **423 passed, 0 failed**;
- Goral Rule Applicability — PASS;
- Kashf Book Rule Catalog — PASS;
- Kashf/Hawi Method Isolation — PASS;
- Canonical Routing — **1535 passed, 0 failed**;
- Question Route Coverage — **138/138, 100.0%**.

The requester-circle test is important here because it positively proves that
its separate “house of honor” table is not silently replaced by
`FIGURE_DIGNITIES.maalaHouse`.

## Result

Downstream Batch 03 closes the p97–99 dignity-table drift against the printed
KASHF source without filling omitted rows, without resolving indirect source
phrasing by guess, and without introducing new runtime logic.

Next, and only after this batch is accepted, continue in printed-source order
with p100 joy/grief.
