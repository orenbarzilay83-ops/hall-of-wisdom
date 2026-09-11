# KASHF AI Master Index — Super Audit Pass 1 Consolidated

## Scope

Whole-index structural and traceability audit after Batch 25. Source-first policy remains unchanged: the printed Arabic scan is the highest verification authority; v57 is checked against it; no engine, runtime, registry, routing or Golden-Test behavior is changed in this pass.

## Structural result

- Records: **271**
- Coverage: printed **21–276**, scan **23–278**
- Status counts: **VERIFIED 181 / REVIEW_REQUIRED 90 / INDEXED 0 / UNRESOLVED 0**
- Duplicate `entryId`s: **0**
- Printed-page holes 21–276: **0**
- `runtimeEligible:true`: **0**
- Gate 12 and the body of the book remain closed at printed p276.

## Source-clear defects repaired in this pass

1. **Placement orders 12–14, printed pp147–150:** the printed scan places order 12 across pp147–148, order 13 from p148 into p149, and order 14 from p149 into p150. The current v57 artifact places their visible headings/content at p148/p149/p150. The AI index now keeps printed-source page ranges separate from v57 anchors; stable legacy `entryId`s were preserved.
2. **p164/p165 proximity queue:** the old correction item named pp164–165 while targeting only the p164 record. Printed p165 begins a distinct rule unit. The legacy queue item is now scoped to p164 and a separate p165 correction item was added.
3. **p229→p230 theft seam:** the printed comprehensive theft rule crosses the page boundary. Its record now spans pp229–230; the focused p230 record remains as an intentional overlapping source unit.

## Findings intentionally not auto-repaired

- `coverage.completedBatches` begins with Batch02 although the HTML contains a Batch01 section for pp21–53. This may be a legacy baseline convention, so the audit does not invent a metadata change.
- **68** older records lack an explicit `runtimeEligible` field. None is `true`; this is schema-normalization work, not runtime permission.
- **9** older records lack `sourceVerification`. They require source-aware backfill, not mechanical certification.
- The repository does not currently contain the referenced `kashf-v57-draft.html` or `kashf-v57-topic-index.html` artifacts, although current copies are available outside the repo. This is a repository/deployment traceability gap; the audit does not silently copy or relocate source artifacts.
- The remaining `REVIEW_REQUIRED` records and page-level queue items must be reconciled semantically; no textual or technical uncertainty was closed merely because the structure is valid.

## Next pass

Proceed gate-by-gate through all **90 `REVIEW_REQUIRED`** records and the three queue families, reconciling **status ↔ source discrepancy ↔ correction item ↔ exact printed page ↔ v57 anchor**. Resolve only source-clear traceability/metadata defects; keep unresolved readings open. Only after that pass should downstream engine/registry/Golden-Test repair planning begin.
