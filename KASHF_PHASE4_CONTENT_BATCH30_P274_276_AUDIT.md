# KASHF Phase 4 — Content Batch 30 Audit (printed pp. 274–276)

## Scope

- Final body range: printed pages 274–276; authoritative scan PDF pages 276–278.
- Input: `kashf-v57-draft-phase4-content-batch29.html`.
- Input SHA-256: `ae70feb5d7b54909b16bf7a697569a5c3ffaaaeb8491776ee1db8060383e5882`.
- Output: `kashf-v57-draft-phase4-content-batch30.html`.
- Output SHA-256: `fc88c81c546bbffc3dd6aafb7498643ae8d77098460e8bdcdbc479b39048915e`.

## Corrections from the printed scan

- p274: retained Hebrew-primary `נלחם`, while preserving printed `الجودلة` and the decisive printed glyph 1121 as evidence.
- p274: corrected `נقي الخد` to the required Hebrew figure name `בר הלחי`.
- p274: separated the printed statement in the `חיבור` branch (“he fears for himself”) from the editor's conjecture (“he committed an offence”), marked `REVIEW_REQUIRED`.
- p275: restored the explicit return marker.
- p275: preserved the printed source title `المنقط في علم النقط` as `אל־מֻנַקַּט`, marked `REVIEW_REQUIRED`, instead of silently normalizing it to al-Multaqat.
- p275: restored the omitted fifth-house alternative in the repeated-figure prison-release rule.
- p276: verified the final continuation and `תם הספר` against the scan.

## Unresolved register

| ID | Page | Evidence | Status |
|---|---:|---|---|
| B30-U1 | 274 | printed `خشي على نفسه`; editor proposes `جنى جناية` | `REVIEW_REQUIRED`; print and conjecture remain distinct. |
| B30-U2 | 275 | printed source title `المنقط في علم النقط` | `REVIEW_REQUIRED`; retained as printed, not silently normalized. |

## QA

- `git diff --no-index --check`: clean.
- Diff against Batch 29: 4 insertions and 4 deletions.
- 256/256 unique anchors p21–p276; no missing or duplicate anchors.
- Target-range span balance: 119/119.
- Full-file tag balance: section 261/261, article 260/260, span 10137/10137, table 61/61, tr 425/425, td 1250/1250.
- Target range: obsolete `נקי הלחי` = 0; required `בר הלחי` = 1; `الجودلة` evidence = 1; Hebrew-primary `נלחם` = 1.

## Status guard

- Batch 29 was not overwritten; the corrected body-ending artifact is Batch 30.
- This completes the sequential content pass through printed p276, but does not by itself declare the correction queue closed.
- Remaining work is source-layer closure: reconcile the correction queue, version/diff-review the corrected HTML in the repository, apply the prepared Master Knowledge Index synchronization, and run final QA.
- Registry, Routing, Engines, and Golden Tests remain suspended. No PR or merge was performed.
