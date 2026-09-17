# KASHF Phase 4 — Content Batch 23, printed pp220–223

Branch: `codex/kashf-phase4-v57-corrections-p44-53`

Authority: printed Arabic KASHF scan. OCR/helper text is non-authoritative.

Input artifact: `kashf-v57-draft-phase4-content-batch22.html`

Input SHA-256: `c673cb1668e6dd0fb0730b34c57c4e7b3a29dc373a74b4af525eff145f680c10`

## Scope and boundary QA

Printed pp220–223 / scan-PDF pp222–225 were rendered and visually checked. The hidden-request rule retains its p220→p221 seam, the yearly-price rule retains its p222→p223 seam, and the printed p221 heading explicitly beginning the addition from `نزهة العقول` remains a separate source layer.

## Source-verified corrections

Terminology presentation rule: approved Hebrew figure names are always primary. Arabic tokens appear only as parenthetical source evidence. Where a printed token/glyph conflict prevents a supported Hebrew identification, the entry is described by its glyph and remains `REVIEW_REQUIRED`; an Arabic transliteration is not promoted to the product-facing name. This corrective rule was also applied to the already-audited ambiguous `الجودلة` occurrences on pp209 and 219.

1. **p220 — requested-figure example:** restored the approved Hebrew names שפל ראש and ממון יוצא as the primary labels beside glyphs 2221 and 1212; the printed Arabic tokens `الأنكيس` and `قبض خارج` are retained only as source evidence in parentheses. Removed the duplicated and incorrect sentence that conflated H14 with H4; the source says that the figure's honor house is H14 and that it was found in H4 of the casting.
2. **p221 — hidden-request procedure:** restored the sequential operation. The approved Hebrew name נשוא ראש is primary for glyph 1222, with printed `الأحيان` retained only as source evidence. For printed `الجودلة` / glyph 1121, the Hebrew label is left `REVIEW_REQUIRED` rather than silently identifying it as קהלה or נלחם. The previous wording incorrectly made the requested figure appear “in H2 with” al-Ahyan.
3. **p222 — Nuzhat rain rule:** retained the approved Hebrew name שפל ראש as the primary label for glyph 2221, with printed `الأنكيس` only as source evidence in parentheses.
4. **p223 — impossible H18:** restored printed `الثامن عشر` exactly as “the eighteenth house” and marked it `REVIEW_REQUIRED`. No silent normalization to an inferred “place indicating loss of money” was allowed.
5. **p223 — besieged city:** restored the approved Hebrew name נלחם as the primary label beside glyph 1121, with printed `الكوسج` only as source evidence in parentheses. The previous version incorrectly substituted `נقي الخد` / glyph 1211.
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

Output SHA-256: `c334784953b3a28fd13bcff32fcfc717fca890a8fdb36c969d3b2c55306edb46`

## Status guard

These are source-layer corrections only. The p223 H18 contradiction remains `REVIEW_REQUIRED`; it is not resolved. The `نزهة العقول` addition remains separate and does not automatically become runtime KASHF. Master-Index queue closure remains blocked until the corrected HTML itself is versioned in the repository and diff-reviewed. Runtime, Registry, routing, engines, and Golden Tests remain out of scope.

## Resume marker

Continue in printed-page order from p224, beginning with the printed Chapter 8 boundary and the following Gate-8 queue items.
