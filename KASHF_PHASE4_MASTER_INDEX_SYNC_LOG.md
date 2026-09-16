# KASHF Phase 4 — Master Index / corrected-v57 page-boundary sync

Branch: `codex/kashf-phase4-v57-corrections-p44-53`

## Operating rule

This pass synchronizes the Master Index to the already audited/corrected printed-page boundaries in the current Phase-4 v57 working artifact. It does **not** implement runtime engines and it does **not** silently close unrelated content-correction items.

For every affected source unit, keep these dimensions separate:

1. `bookPages` = printed KASHF pages occupied by the source unit.
2. `scanPdfPages` = authoritative scan PDF pages (printed page + 2 in this scan).
3. `v57Anchors` = corrected v57 page anchors that actually contain the unit after the Phase-4 boundary repair.
4. Content discrepancies remain open unless the corrected v57 text itself demonstrably resolved them.

## pp147–150 — staged

Patch: `KASHF_PHASE4_MASTER_INDEX_ANCHOR_SYNC_P147_150.patch`

Verified against the corrected v57 page sections:

- Order 12 occupies corrected v57 `p147` + `p148`, matching printed pp147–148.
- Order 13 occupies corrected v57 `p148` + `p149`, matching printed pp148–149.
- Order 14 occupies corrected v57 `p149` + `p150`, matching printed pp149–150.

The patch therefore expands each stale single shifted v57 anchor to the true two-page span and removes the three pagination-only queue blockers. The separate order-13 content problem (`بياض في الأصل` incorrectly rendered as a title meaning “לבן”) remains open.

## pp164–165 — staged / verified

Patch: `KASHF_PHASE4_MASTER_INDEX_SYNC_P164_165.patch`

- `gate5.p164.figure-desire-rules` already points to p164 correctly.
- `gate5.p164.seven-witnesses` already points to p164 correctly.
- `gate5.p164.figure-proximity-core` now exists in corrected v57 p164 as a complete printed-page unit, including the two previously omitted final clauses: repeated `نقي الخد`/בר הלחי = fear, and adjacent `القبض الخارج`/ממון יוצא = `فتنة` / movement in a blameworthy fitna.
- The stale p164 omission discrepancy and its pagination/continuity queue blocker are therefore staged for removal and the p164 record is staged back to `VERIFIED`.
- `gate5.p165.figure-proximity-extended` remains a separate p165 record and remains `REVIEW_REQUIRED`; the boundary is correct but its content reconciliation is not complete.

## pp199–201 — staged

Patch: `KASHF_PHASE4_MASTER_INDEX_SYNC_P199_201.patch`

The corrected boundary audit shows two stale Master-Index spans:

- `gate6.house6.p200.patient-spirit-and-sixth-eighth` actually starts on printed/corrected-v57 p199 and continues on p200. Staged span: `bookPages [199,200]`, scan `[201,202]`, anchors `p199,p200`.
- `gate6.house6.p200-201.prognosis-chain` is complete on printed/corrected-v57 p200; it no longer spills into p201. Staged span: `bookPages [200]`, scan `[202]`, anchor `p200`.

## Next checkpoint

Continue in printed-page order through the remaining repaired seams in pp204–228, then pp229–252, then pp253–276. For each seam, change only the page/traceability fields and stale boundary-derived metadata; preserve unrelated content-correction blockers.
