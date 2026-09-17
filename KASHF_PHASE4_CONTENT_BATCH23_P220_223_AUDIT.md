# KASHF Phase 4 — Content Batch 23, printed pp220–223

Branch: `codex/kashf-phase4-v57-corrections-p44-53`

Authority: printed Arabic KASHF scan. OCR/helper text is non-authoritative.

Input artifact: `kashf-v57-draft-phase4-content-batch22.html`

Input SHA-256: `c673cb1668e6dd0fb0730b34c57c4e7b3a29dc373a74b4af525eff145f680c10`

## Scope and boundary QA

Printed pp220–223 / scan-PDF pp222–225 were rendered and visually checked. The hidden-request rule retains its p220→p221 seam, the yearly-price rule retains its p222→p223 seam, and the printed p221 heading explicitly beginning the addition from `نزهة العقول` remains a separate source layer.

## Source-verified corrections

1. **p220 — requested-figure example:** restored the printed figure tokens `الأنكيس` and `قبض خارج` beside their 2221 and 1212 glyphs, while retaining the canonical Hebrew names as aliases. Removed the duplicated and incorrect sentence that conflated H14 with H4; the source says that the figure's honor house is H14 and that it was found in H4 of the casting.
2. **p221 — hidden-request procedure:** restored the sequential operation: combine the H1 figure with printed `الجودلة`; if the requested figure does not appear, combine the H2 figure with the second circle figure, `الأحيان`, and continue in this manner. The previous wording incorrectly made the requested figure appear “in H2 with” al-Ahyan.
3. **p222 — Nuzhat rain rule:** retained printed `الأنكيس` explicitly beside glyph 2221 rather than silently replacing the source-local name with only the canonical Hebrew name.
4. **p223 — impossible H18:** restored printed `الثامن عشر` exactly as “the eighteenth house” and marked it `REVIEW_REQUIRED`. No silent normalization to an inferred “place indicating loss of money” was allowed.
5. **p223 — besieged city:** restored printed `الكوسج` beside glyph 1121 and the canonical alias נלחם. The previous version incorrectly substituted `נقي الخد` / glyph 1211.
6. **p223 — inhabited or ruined city:** restored the printed mixed case as two inward figures and two outward figures, not one of each.

## QA

- Numbered page anchors: 256.
- Unique numbered page anchors: 256.
- Exact range: p21–p276.
- Missing IDs: 0.
- Duplicate IDs: 0.
- Every numbered page retains `article.text` and `.pageno`.
- Batch diff passes whitespace/error checks.

Output artifact: `kashf-v57-draft-phase4-content-batch23.html`

Output SHA-256: `493fed087cece18d008131b41e41bd952ed966a44ae48237275d8ade0d8e3b37`

## Status guard

These are source-layer corrections only. The p223 H18 contradiction remains `REVIEW_REQUIRED`; it is not resolved. The `نزهة العقول` addition remains separate and does not automatically become runtime KASHF. Master-Index queue closure remains blocked until the corrected HTML itself is versioned in the repository and diff-reviewed. Runtime, Registry, routing, engines, and Golden Tests remain out of scope.

## Resume marker

Continue in printed-page order from p224, beginning with the printed Chapter 8 boundary and the following Gate-8 queue items.
