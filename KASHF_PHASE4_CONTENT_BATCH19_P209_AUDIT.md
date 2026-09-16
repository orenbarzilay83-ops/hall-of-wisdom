# KASHF Phase 4 — Content Batch 19, printed p209

Branch: `codex/kashf-phase4-v57-corrections-p44-53`

Authority: printed Arabic KASHF scan. OCR/helper text is non-authoritative.

Input artifact: `kashf-v57-draft-phase4-content-batch18.html`

Input SHA-256: `8553606a03d82d5d91976b51162663aec3e8e5a60d716633dd04f6cdea02b5b0`

## Scope

The printed p208→p209 seam and printed pp209–210 were visually checked at scan-PDF pp210–212. The already-repaired page boundary is retained. Batch 19 changes only three source-clear defects on printed p209; printed p210 required no content correction in this pass.

## Source-verified corrections

1. Restored the omitted `الأحيان` / נשוא ראש alternative beside `البياض` / לבן in H5 before the H9 Ankis branch.
2. Preserved printed `الجودلة` and its printed glyph in the H7 clause with `القبض الداخل`. The source-local token/glyph conflict is explicit and remains unresolved; the clause is not silently normalized to קהלה or נלחם.
3. Preserved the three printed tokens `الركائز`, `الأمرد`, and `الكوسج`. `الكوسج` remains a separate source token and is not silently identified with נלחם.

## QA

- Source image checked visually: printed p209 / scan-PDF p211.
- Continuation checked visually: printed p210 / scan-PDF p212.
- Numbered page anchors: 256.
- Unique numbered page anchors: 256.
- Exact range: p21–p276.
- Missing IDs: 0.
- Duplicate IDs: 0.
- Every numbered page retains `article.text` and `.pageno`.

Output artifact: `kashf-v57-draft-phase4-content-batch19.html`

Output SHA-256: `e29ac9900101bcdf84ac4c535a4566c28dbe8ea58eb221cf296404b06fab716c`

## Status guard

The p209 source correction is applied to the continuing v57 artifact, but the corresponding Master-Index status must remain open until the corrected HTML is versioned in the repository and its full diff is reviewed. Runtime, Registry, routing, engines, and Golden Tests remain out of scope.

## Resume marker

Continue in printed-page order after p210 with the next Gate-7 unit. Preserve the established seams p211→p212 and p212→p213 before evaluating content discrepancies.
