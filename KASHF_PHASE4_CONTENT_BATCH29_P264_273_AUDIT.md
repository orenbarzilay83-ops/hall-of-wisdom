# KASHF Phase 4 — Content Batch 29 Audit (printed pp. 264–273)

## Scope

- Printed pages 264–273; authoritative scan PDF pages 266–275.
- Input: `kashf-v57-draft-phase4-content-batch28.html`.
- Input SHA-256: `92554c9e76f9d049f11273d6ca66d7d4416c98d8ca5ba6566cb1ee23741d5a11`.
- Output: `kashf-v57-draft-phase4-content-batch29.html`.
- Output SHA-256: `ae70feb5d7b54909b16bf7a697569a5c3ffaaaeb8491776ee1db8060383e5882`.

## Corrections from the printed scan

- p264: restored the explicit printed sexual-offence wording in the Dragon's Tail friends branch instead of the earlier euphemistic paraphrase.
- p265: separated the malefic-figures rule from the fixed-figure garment rule; replaced generic “planet” with Hebrew-primary `כוכב חמה`; retained the unclear printed `خلع الملوك` clause as `REVIEW_REQUIRED` rather than inventing a causal reading.
- p266: corrected `החמישי` to `החמישה־עשר` in the houses used for duration of condition.
- p267: restored the judge-witness distinction, acquisition after delay, and rapid acquisition when the angles are benefic and entering.
- p268: corrected the abundant-livelihood figure from `סף יוצא`/1112 to Hebrew-primary `כבוד יוצא`/1122; corrected `נقي الخد` to `בר הלחי`.
- p271: corrected the beginning-of-casting rule and restored the explicit return from al-Multaqat to the body of KASHF.
- p272: preserved the defective main enemy clause and separated the alternative reading; restored the omitted safe-release rule when house 12 is benefic.
- p273: preserved the editor's conjectural insertion “malefic” in the inward-figures prisoner rule as `REVIEW_REQUIRED` rather than silently adopting it.

## External-source separation

- Nuzhat al-ʿUqul and al-Multaqat sections remain explicitly labeled and separate from the body of KASHF.
- No external addition was promoted to runtime logic.

## Unresolved register

| ID | Page | Evidence | Status |
|---|---:|---|---|
| B29-U1 | 265 | `خلع الملوك` following the tenth-house clothing clause | `REVIEW_REQUIRED`; printed phrase retained separately. |
| B29-U2 | 272 | defective main clause `فإن يكون` | `REVIEW_REQUIRED`; alternative version kept distinct. |
| B29-U3 | 273 | print has “if both are entering”; editor conjectures “both malefic and entering” | `REVIEW_REQUIRED`; conjecture identified as editorial. |

## QA

- `git diff --no-index --check`: clean.
- Diff against Batch 28: 10 insertions and 10 deletions.
- 256/256 unique anchors p21–p276; no missing or duplicate anchors.
- Target-range span balance: 262/262.
- Full-file tag balance remains exact: section 261/261, article 260/260, span 10135/10135, table 61/61, tr 425/425, td 1250/1250.
- Target range: obsolete `נקי הלחי` = 0; required `בר הלחי` = 1.
- p263→p264 and p270→p271 continuations were preserved.

## Status guard and resume marker

- Batch 28 was not overwritten. The corrected HTML is versioned as a new Batch 29 artifact.
- No Registry, Routing, Engine, or Golden Test work was performed. No PR or merge was performed.
- Continue with printed pp. 274–276. This is the final three-page body range and begins with the continuation of the prisoner material.
