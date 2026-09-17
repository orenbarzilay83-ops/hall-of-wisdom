# KASHF Phase 4 — Content Batch 27, printed pp244–253

Branch: `codex/kashf-phase4-v57-corrections-p44-53`

Authority: printed Arabic KASHF scan. OCR/helper text is non-authoritative.

Input artifact: `kashf-v57-draft-phase4-content-batch26.html`

Input SHA-256: `05770720866929bafe005b2952f8a37f5a7c8c1ff4d66389c883b7120f2db2f6`

## Scope and boundary QA

This enlarged batch covers ten printed pages, pp244–253 / scan-PDF pp246–255. The Nuzhat addition begins explicitly at p244, continues through the ship-rule seam p245→p246, and then yields to the main KASHF text. A second Nuzhat addition begins on p250, and a separately headed al-Multaqat addition begins on p251. These source layers remain visibly distinct and are not promoted automatically to runtime KASHF.

The absent-person discussion remains continuous across p246→p247, p248→p249, p250→p251, p251→p252, and p252→p253.

Approved Hebrew figure names are primary. Printed Arabic names are retained only as parenthetical source evidence.

## Source-verified corrections

1. **p244 — Nuzhat source layer:** removed the duplicated prose introduction and made the printed addition an explicit heading. Restored the sea-vessel wording for ממון יוצא in H9, retained printed `الزمل` as unresolved, restored קיבלה/דרום for earth, and removed an unsupported reference to “the method of the book”.
2. **p245 — travel safety test:** removed a spurious דרך figure, restored H7 to the H3/H7/H9/H15 test, retained the printed `(13, 13)` instruction and the editor’s warning that two questions appear to overlap, recorded the duplicated fear sentence, and restored the three-stage pairwise derivation.
3. **p246 — absent-person branches:** restored H4 in the difficult-arrival branch; “on the road and arriving”; the omitted H1/H15 outward wandering result; the five-day H10 branch; the dangerous-illness houses; and the H5/H11 love-or-brother’s-need seam.
4. **p247 — state of the absent person:** restored the instruction to complete the board, corrected the fixed figure as the H9 figure rather than a separate “money” object, and restored both outcome and outcome-of-outcome as witnesses of health.
5. **p248 — inward death figures:** restored the antecedent from H3 and corrected the printed 1121 figure to Hebrew נלחם, retaining printed `النقاف` parenthetically. The earlier version incorrectly supplied סוהר/1221.
6. **p248 — corrupt derivation formulas:** restored both printed derivations and the edition’s explicit conjectures without silently adopting them. Restored the printed death result when the derived figure is absent from the board, the additional derivation from H1/H6 and H8/H12, and the absolute-loss result when H1 is in H8 or H12.
7. **p249 — meeting and city tests:** corrected the meeting time to “within the hour”, corrected `المذكور` from “the males” to “the mentioned person”, and restored “heads of the four figures” with the editor’s conjecture that the intended reading is the four angles.
8. **pp250–251 — source additions:** separated the second Nuzhat addition and the al-Multaqat addition with explicit headings. Retained printed `الجاه` as unresolved, corrected H9 inward in H7 or H4, and restored the omitted benefic-arrival and H9-in-H10/H11 branches.
9. **p252 — arrival and meeting:** restored H3 as an alternative location for outward H1, clarified the H1/H9 owner in H2, removed the unsupported חיבור figure from the printed inward-benefic list, and corrected H15 from testimony of departure to testimony of arrival.
10. **p253 — Zanati figure identity:** repaired malformed nested glyph markup and replaced the incorrect קהלה/2222 identification with Hebrew נלחם/1121 for printed `الجودلة`. Restored the printed result “bad news, but he is healthy” and the omitted closing instruction.

## Unresolved-evidence register

| ID | Printed page | Source evidence | Status | Required action |
|---|---:|---|---|---|
| B27-U1 | 244 | `الزمل` in the damaged-vessel example | `REVIEW_REQUIRED` | Preserve token; no lexical normalization without stronger evidence. |
| B27-U2 | 245 | `(13, 13)` plus the edition’s note that two questions overlap | `REVIEW_REQUIRED` | Preserve printed instruction and editorial warning; do not operationalize. |
| B27-U3 | 248 | Corrupt H1/H2/H4 derivation and editor’s H1/H4 conjecture | `REVIEW_REQUIRED` | Keep printed reading and conjecture separate. |
| B27-U4 | 248 | Printed “or” between H1/H6 and H8/H12 derivations; editor conjectures a third derivation | `REVIEW_REQUIRED` | Do not choose a runtime formula. |
| B27-U5 | 249 | “Heads of the four figures”; editor conjectures “the four angles” | `REVIEW_REQUIRED` | Preserve both readings; no silent substitution. |
| B27-U6 | 250 | Direction token `الجاه` | `REVIEW_REQUIRED` | Preserve source token; do not identify a direction automatically. |

## QA

- Numbered page anchors: 256.
- Unique numbered page anchors: 256.
- Exact range: p21–p276.
- Missing IDs: 0.
- Duplicate IDs: 0.
- Every numbered page retains `article.text` and `.pageno`.
- All p244–p253 sections have balanced figure/span markup.
- No occurrence of the obsolete Hebrew name `נקי הלחי` was introduced in pp244–253.
- Hebrew figure names remain primary; Arabic tokens occur only as source evidence.
- Batch diff passes whitespace/error checks.

Output artifact: `kashf-v57-draft-phase4-content-batch27.html`

Output SHA-256: `8eb6ad9cee56c1451b2f093c67acf903701133a0c170d15fbb520776be918edf`

## Status guard

These are source-layer corrections only. The unresolved items above remain outside runtime interpretation. Queue closure remains blocked until the corrected HTML itself is versioned in the repository and diff-reviewed. Runtime, Registry, routing, engines, and Golden Tests remain out of scope.

## Resume marker

Continue in printed-page order with the next enlarged batch, pp254–263, beginning with the continuation of the religion-and-righteousness material after p253.
