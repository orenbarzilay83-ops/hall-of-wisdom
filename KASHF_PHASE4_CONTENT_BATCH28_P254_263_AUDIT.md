# KASHF Phase 4 — Content Batch 28 Audit (printed pp. 254–263)

## Scope and authority

- Corrected range: printed pages 254–263 (authoritative scan PDF pages 256–265).
- Authoritative source: `كشف الأسرار المصونة في اخراج الضمائر المخزونة(1).pdf`.
- OCR text was used only as a navigation aid; every accepted correction was checked against the printed scan.
- Input: `kashf-v57-draft-phase4-content-batch27.html`.
- Input SHA-256: `8eb6ad9cee56c1451b2f093c67acf903701133a0c170d15fbb520776be918edf`.
- Output: `kashf-v57-draft-phase4-content-batch28.html`.
- Output SHA-256: `92554c9e76f9d049f11273d6ca66d7d4416c98d8ca5ba6566cb1ee23741d5a11`.

## Source-grounded corrections

### Printed p. 254

- Restored the witness-evidence qualification in the Saturn/agriculture branch.
- Replaced the generic planet label with Hebrew-primary `כוכב חמה (עֻטַארִד)`.
- Removed the unsupported normalization of printed `التويهر` to Dragon's Tail. The printed token is retained as `אל־תֻוַיְהִר` and marked `REVIEW_REQUIRED`.

### Printed p. 255

- Separated the Nuzhat al-ʿUqul addition from the al-Multaqat addition with explicit source headings.
- Corrected the `דרך` branch to promises arising from wishful thinking and many empty promises; removed the unsupported promise of eventual fulfillment.
- Preserved the incomplete/unclear printed clause containing `تركته` without speculative completion.

### Printed pp. 256–260

- Corrected the chapter wording from “duration of the priesthood” to “duration of appointments.”
- Preserved the printed duplicated `سعد` reading on p. 256 and recorded the editor's conjecture that the second group may be `نحس`; the conjecture was not silently adopted.
- Restored the strength-and-witness condition in the p. 257 kingship rule.
- Corrected the figure name on p. 258 to Hebrew-primary `בר הלחי`.
- Restored the complete mixed-benefic/malefic branch on p. 259.

### Printed pp. 261–263

- Restored piety and asceticism in the third-house branch.
- Corrected the reversed fourth-house meaning: the ruler does not entrust his affairs to another; restored the treasurer/property material and retained the unusual “no known road” clause.
- Expanded the fifth-house branch with increase of authority and gifts from peers.
- Corrected the seventh-house branch to tyranny/oppression, exposure to affliction, seditions, and wars.
- Restored the omitted end of the eighth-house branch concerning lack of justice and knowledge.
- Restored the ninth-house material concerning Sharia/religion, truth, falsehood, and the hereafter; retained printed `حارثا` as unresolved.
- Restored the omitted end of the twelfth-house branch: little awe/status, much worry, and no affair succeeding.
- Corrected the p. 263 chapter heading to friends, hope, and lifespan; removed unsupported “love” from the printed chapter heading.
- Restored soldiers in the Sun-friends row, beardless youths/boys in the Venus row, and `כוכב חמה` in the Mercury row.
- Where printed `الجودلة` is accompanied by glyph `1121`, rendered the figure Hebrew-first as `נלחם`, preserved the printed Arabic token in evidence, and restored the glyph.

## External-source separation

- Material explicitly attributed in the print to Nuzhat al-ʿUqul or al-Multaqat remains visibly separated from the main KASHF text.
- This batch does not promote external additions to runtime KASHF rules.

## Unresolved register

| ID | Printed page | Printed evidence | Status |
|---|---:|---|---|
| B28-U1 | 254 | `التويهر` | `REVIEW_REQUIRED`; not normalized to a known figure without sufficient printed evidence. |
| B28-U2 | 254 | `الغرايم` | Existing unresolved technical term retained unchanged. |
| B28-U3 | 255 | `تركته` | `REVIEW_REQUIRED`; incomplete/unclear clause retained without conjectural completion. |
| B28-U4 | 256 | duplicated `سعد`; editor conjectures second group `نحس` | `REVIEW_REQUIRED`; print and editorial conjecture kept distinct. |
| B28-U5 | 261 | `حارثا` | `REVIEW_REQUIRED`; transliterated as `חארת׳`, without forced interpretation. |

## QA

- `git diff --no-index --check`: clean.
- Diff against Batch 27: 12 insertions and 12 deletions across the ten-page range.
- Page anchors: 256 total and 256 unique, covering p21–p276 with no missing or duplicate anchors.
- Every p21–p276 page section contains `article.text` and a `.pageno` element.
- Full-file tag balance: section 261/261, article 260/260, span 10134/10134, table 61/61, tr 425/425, td 1250/1250.
- Target-range span balance: 188/188.
- Target-range terminology check: old `נקי הלחי` = 0; required `בר הלחי` = 1.
- The p263→p264 seam is preserved: “חבריו גנבים” continues on p. 264 with “ליסטים ושודדי דרכים”.

## Status guard

- The corrected HTML is a new Batch 28 artifact; Batch 27 was not overwritten.
- No queue item is declared formally closed merely by this patch/audit. Formal closure remains contingent on versioning the corrected HTML itself and reviewing the resulting diff.
- No Registry, Routing, Engine, or Golden Test work was performed.
- No PR was opened and no merge was performed.

## Resume marker

Continue from printed p. 264 through p. 273 as the next ten-page source batch, beginning with the continuation “ליסטים ושודדי דרכים”.
