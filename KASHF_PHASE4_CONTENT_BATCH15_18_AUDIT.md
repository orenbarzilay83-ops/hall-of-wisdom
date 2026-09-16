# KASHF Phase 4 — Content correction audit, Batches 15–18

Branch: `codex/kashf-phase4-v57-corrections-p44-53`

Authority: printed Arabic KASHF scan. OCR/helper text is non-authoritative.

This checkpoint records source corrections made in the local corrected-v57 working artifact. It does **not** close Master-Index queue items yet, because the full corrected HTML artifact is not yet versioned as the canonical repository `kashf-v57-draft.html`.

## Batch 15 — printed pp191–196

Source-verified corrections applied locally:

- p191→p192: restored the true cross-page miscarriage rule, including Humra/אדום in H7 and Ankis/שפל ראש in H8.
- p194: restored the branch in which a figure that is neither male nor female and is overturned indicates an empty womb.
- p196: retained canonical Hebrew `בר הלחי` for `نقي الخد`.
- p196: restored the omitted `ظلمة البصر` / darkness-of-vision branch in the Ahyan/H6 example.

Dedicated local diff: `KASHF_PHASE4_V57_CORRECTIONS_P191_196.patch`.

## Batch 16 — printed pp201, 204, 208

### Visual QA checkpoint — 2026-09-16

The authoritative printed scan was rendered and visually rechecked at printed p201 / scan-PDF p203, printed p204 / scan-PDF p206, and printed p208 / scan-PDF p210. The scan images confirm the Batch-16 readings below. No OCR-only reading was promoted over the printed image.

- p201 visibly prints `الحمرة` for sheep/rams; `التشمير` beside glyph 2211 for bulls; `النصرة الخارجة` for horses; `العتبة الخارجة` for camels; `العقلة` for donkeys; `الأنكيس` for kids/goats; and `القبض الخارج` for mules. The rows are indepent and must not be merged by analogy.
- p204 visibly separates `الأول في السابع` → `أمة`, `السابع في العاشر` → `حرة`, mutable seventh → `ثيب`, and fixed seventh → `بكر`.
- p208 visibly preserves separate `نقي الخد` and `الكوسج` clauses. The age-group sentence explicitly prints `عطارد` in the middle group, so the Hebrew must identify Mercury / כוכב חמה rather than a generic star.

Visual QA result: **PASS** for the Batch-16 source readings. This pass verifies the source evidence only; it does not close queue items while the corrected HTML artifact remains unversioned.

### p201 — animal/figure map

Restored the printed mapping exactly at the source-token level:

- Humra → rams/sheep;
- printed `التشمير` beside glyph 2211 (canonical glyph name: כבוד נכנס) → bulls;
- Nusra Kharija → horses;
- Ataba Kharija → camels;
- Aqla → donkeys;
- Ankis → kids/goats;
- Qabd Kharij → mules.

The printed token `التشمير` is preserved rather than silently normalized.

### p204 — marriage/woman-status branches

Restored four separate source branches:

- H1 in H7 → `أمة` (bondwoman/female slave);
- H7 in H10 → `حرة` (free woman);
- mutable H7 → `ثيب` (non-virgin / previously married; not necessarily divorced);
- fixed H7 → `بكر` (virgin).

### p208

- `نقي الخد` is rendered with the canonical Hebrew figure name `בר הלחי`.
- `الكوسج` is preserved beside canonical `נלחם` rather than collapsed with `نقي الخد`.
- printed `عطارد` is explicit Mercury, not a generic “star”.

Working artifact: `kashf-v57-draft-phase4-content-batch16.html`.
SHA-256: `0bc27298fcf4e930e0bcf60f607d4ce988b30c4761d5162dd6f0b62a62625dab`.

## Batch 17 — printed pp112–123 recheck

Source-verified corrections applied locally:

- p112: restored `مائل الأوتاد` as the structural future trigger rather than reducing it to a semantic “future” label.
- p113: Ahyan example now subtracts three days from one year, per the printed source.
- pp114–115: rebuilt the Dalail al-Fadl table literally from the scan; anomalous/blank values are preserved rather than mathematically normalized. The visually printed Ijtima length is 60, not the older queue-note value 600.
- p117→p118: restored the printed ranks/subjects across the page seam.
- p118: preserved the printed 1123 arithmetic anomaly and documented its internal inconsistency rather than silently changing it to 123.
- p119: preserved the source’s repeated `الأمهات` in the weeks/months branch rather than silently replacing it with spawned figures.
- p120: Ahyan example = 1000 dirhams; Humra/fire example = `ألفا درهم` = 2000 dirhams.
- p123: preserved `طريف` as an unresolved technical source token instead of narrowing it to “sharp”.

Working artifact: `kashf-v57-draft-phase4-content-batch17.html`.
SHA-256: `fceec47852bbe3d40ec6f110dd4ee52a5717229aac2cf7fd63cb4bc74caa5b4e`.

## Batch 18 — late live blockers, printed pp244–275

Eight source-clear repairs were applied to Batch17:

1. **p244:** the adverse-travel list contains separate `الكوسج` and `نقي الخد` tokens. The working Hebrew now preserves `נלחם (الكوسج)` and `בר הלחי (نقي الخد)` as distinct figures.
2. **p254:** Mercury profession line preserves printed `الغرايم` explicitly; its technical meaning remains unresolved instead of being translated as “wonders”.
3. **p260:** restored exact H9 polarity: benefic → justice in judgments; malefic → injustice/oppression in judgments.
4. **p263:** printed token `الجودلة` is preserved without silently identifying it as קהלה or נלחם; the presence of a printed glyph is noted while its identity remains unnormalized in this source-local clause.
5. **p267:** hope-house list corrected to H1, H2, H5, H13 only.
6. **p269:** restored the Ankis false/untruthful-promise clause before “neither good nor evil”.
7. **p270:** `مال إلى الأول` restored as “leans to the first”, not “leans to the singular/one”.
8. **p275:** H12/H2/H5/H11 restored as independent alternatives in the prisoner-honor clause; H11 is not an added conjunction/condition.

Working artifact: `kashf-v57-draft-phase4-content-batch18.html`.
SHA-256: `8553606a03d82d5d91976b51162663aec3e8e5a60d716633dd04f6cdea02b5b0`.

Local focused diff: `KASHF_PHASE4_V57_CORRECTIONS_P244_275.patch`.
SHA-256: `e2b25b771b0e588bf79f606a4c17952fd407fdac718a09932c3f712ddc84745a`.

## Structural QA after Batch 18

- numbered page anchors: 256
- unique numbered page anchors: 256
- exact numbered range: p21–p276
- missing numbered page IDs: 0
- duplicate numbered page IDs: 0
- every numbered page retains `article.text` and `.pageno`

Result: **PASS**.

## Guard

These corrections are source-layer work only. Do not modify runtime/Registry/routing/Golden Tests from this checkpoint, and do not mark Master-Index queue items formally resolved until the corrected HTML artifact is versioned and its repository diff is reviewable.
