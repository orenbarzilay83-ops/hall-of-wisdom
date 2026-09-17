# KASHF Phase 4 — Content Batch 26, printed pp234–243

Branch: `codex/kashf-phase4-v57-corrections-p44-53`

Authority: printed Arabic KASHF scan. OCR/helper text is non-authoritative.

Input artifact: `kashf-v57-draft-phase4-content-batch25.html`

Input SHA-256: `1e4b565ba9c32b77c4cbab9295ef6c2a7cc301fe53057e9fa426cc5907cb2b1b`

## Scope and boundary QA

This deliberately enlarged batch covers ten printed pages, pp234–243 / scan-PDF pp236–245. The loan rule remains continuous across p233→p234; the chapter-nine travel material begins on p235; and the final derivation on p243 remains complete before the separately headed Nuzhat addition on p244.

Approved Hebrew figure names are primary. Printed Arabic names are retained only as source evidence where needed.

## Source-verified corrections

1. **p234 — external addition boundary:** separated the printed al-Multaqat addition from the preceding KASHF loan rule with an explicit source-addition heading; it remains source-layer material and is not silently promoted to runtime KASHF.
2. **p235 — worry rule and Mercury:** restored “different in essence” rather than an opposition of natures, restored one reversing figure in H6/H7 rather than both houses “overturning”, and translated `عطارد` specifically as כוכב חמה.
3. **pp236–237 — travel-figure branches:** restored the omitted benefic outward H1 condition, the requirement that one of חיבור/סוהר/דרך be in H9, the H9 placement of both figure groups, and their respective safe-return versus no-benefit outcomes.
4. **p237 — profit and sea/land tests:** retained printed `تراب المنطقة` as an unresolved source token (`REVIEW_REQUIRED`) instead of silently normalizing it; restored the omitted return by sea in the fire branch.
5. **p238 — direction calculation:** replaced the incorrect H1-element shortcut with the printed comparison of total elemental points. Restored the exact mapping אש–מזרח, אוויר–מערב, מים–ים, עפר–קיבלה/דרום and the four-element house-count dominance rule.
6. **p239 — outward figures and traveler state:** restored the three-way outward-figure rule (quick travel, danger from malefics, good from benefics), the missing bad witness in the money branch, and the printed role of H10 as the traveler’s needs rather than an additional route house.
7. **p240 — road danger and ship contradiction:** preserved printed `الذراقم` as `REVIEW_REQUIRED`. Restored all transition branches, including H4 and no-transition, and retained the source contradiction in which H12 appears in both the break and safe-arrival lists; it is explicitly marked `REVIEW_REQUIRED`.
8. **pp241–242 — vehicle damage:** corrected חיבור to damage on both sides, נשוא ראש to major head damage while remaining intact, and סף יוצא to corner damage. The printed `الجودلة` is rendered with Hebrew נלחם first because the page supplies glyph 1121; the Arabic token remains parenthetical evidence.
9. **p242 — general travel judgment:** restored the omitted positive benefic branch and the final rule that bad H7/H8 do not harm when H1/H2 are good.
10. **p243 — traveler, road, and outcome:** restored the strong/clean, mixed/weak, and malefic branches; corrected שפל ראש, ממון יוצא, and the omitted malefic-combination result; and restored H15 as outcome/return and H7 as conflicts, partnership, and quarrel.

## QA

- Numbered page anchors: 256.
- Unique numbered page anchors: 256.
- Exact range: p21–p276.
- Missing IDs: 0.
- Duplicate IDs: 0.
- Every numbered page retains `article.text` and `.pageno`.
- Printed-page seams p233→p234 and p243→p244 remain intact.
- No occurrence of the obsolete Hebrew name `נקי הלחי` was introduced in pp234–243.
- Batch diff passes whitespace/error checks.

Output artifact: `kashf-v57-draft-phase4-content-batch26.html`

Output SHA-256: `05770720866929bafe005b2952f8a37f5a7c8c1ff4d66389c883b7120f2db2f6`

## Status guard

These are source-layer corrections only. `تراب المنطقة`, `الذراقم`, and the contradictory H12 ship branches remain `REVIEW_REQUIRED`. Queue closure remains blocked until the corrected HTML itself is versioned in the repository and diff-reviewed. Runtime, Registry, routing, engines, and Golden Tests remain out of scope.

## Resume marker

Continue in printed-page order with the next enlarged batch, pp244–253, beginning with the separately sourced Nuzhat addition on p244 and keeping it distinct from the return to the main KASHF text.
