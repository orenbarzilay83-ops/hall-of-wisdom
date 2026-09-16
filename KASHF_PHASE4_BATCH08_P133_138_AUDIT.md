# KASHF Phase 4 — Batch 08 audit, printed pp133–138

Authority: printed Arabic scan `كشف الأسرار المصونة في إخراج الضمائر المخزونة`.

This checkpoint re-opened pp133–138 after ordinary content-queue review exposed source-page leakage that the earlier broad Page Boundary pass had not caught. The older statement that all earlier seams through p150 were already closed is therefore **superseded for pp133–138 by this file**.

## Why this re-open matters

The AI Master Index retrieves source units by printed pages and v57 anchors. In the pre-repair v57, several units in this range existed but sat on the wrong HTML page:

- the latter half of the Mazag poem and the `الجودلة` / `نقي الخد` disagreement were pulled backward from printed p134 into `#p133`;
- the post-table explanatory paragraph of printed p135 was left on `#p134`;
- the first zodiac-placement verse printed on p135 was moved forward into `#p136`;
- the seasonal chapter printed at the foot of p136 was collapsed wholly into `#p137`;
- the zodiac-element list, which truly crosses printed p137→p138, was collapsed wholly into `#p137`;
- `#p138` began with an editorial combined heading that hid the genuine p137→p138 continuation and duplicated the sixth-placement heading.

Those are retrieval defects even when the Hebrew words themselves are otherwise present.

## Visual source verification

Rendered and checked directly:

- printed p133 = scan PDF p135
- printed p134 = scan PDF p136
- printed p135 = scan PDF p137
- printed p136 = scan PDF p138
- printed p137 = scan PDF p139
- printed p138 = scan PDF p140

OCR/text-layer evidence was not used to overrule the page images.

## Source-boundary repairs

### p133→p134

Printed p133 ends after the third Mazag verse. Printed p134 begins with the remaining four verses, then the explicit disagreement between `الجودلة` and `نقي الخد`, and only then the table. The working v57 now follows that distribution.

The project-canonical figure identities are kept separate from the Arabic source labels:

- `الجودلة` → `נלחם` / 1121 in this printed dispute;
- `نقي الخد` → `בר הלחי` / 1211.

The historical v57 wording `נקי הלחי` is not retained as a canonical figure name.

### p134→p135

The paragraph beginning “כאשר צורה שוכנת בבית שלה...” belongs to printed p135 and was moved to the head of `#p135`.

### p135→p136

The first verse of the zodiac-placement poem (`غرب على زحل بدلو التيس ...`) is printed at the foot of p135. The Hebrew rendering is now retained on `#p135`; `#p136` starts with the next verse.

### p136→p137

Printed p136 contains the seasonal heading and the Spring unit. It is no longer collapsed into p137.

Source figure groups restored from the printed glyphs (project convention `1=point`, `2=line`):

- Spring: אדום 2122; בר הלחי 1211; כבוד נכנס 2211; נלחם 1121; קהלה 2222; חיבור 2112.
- Summer: לבן 2212; דרך 1111; כבוד יוצא 1122; ממון נכנס 2121; חיבור 2112.
- Winter: סוהר 1221; שפל ראש 2221; סף נכנס 2111.
- Autumn: נלחם 1121; כבוד נכנס 2211; נשוא ראש 1222.

The groups overlap in the printed source. They must not be normalized into a one-figure/one-season mapping.

### p137→p138

Printed p137 gives:

- fire signs;
- earth signs;
- then begins the air-sign clause with Gemini, Libra and Aquarius before the page ends.

Printed p138 opens with `هوائية`, then gives Cancer, Scorpio and Pisces as water signs. The corrected v57 therefore makes the element correspondence a genuine `#p137` + `#p138` retrieval unit.

The editorial combined heading `אזהרת המחבר / השיבוץ השישי` was removed from the start of p138. The page now begins with the source continuation, then the warning prose, then the genuine sixth-placement heading.

## Content repairs closed in the working copy

### Mazag table, p134

The printed glyph map closes 16/16:

- Venus gains כבוד נכנס 2211;
- Jupiter gains נשוא ראש 1222;
- Mars uses canonical בר הלחי 1211;
- Head = ממון יוצא 1212;
- Tail = סף יוצא 1112.

### Planet letters, p135

Exact printed Arabic rows are preserved inline. Critical corrections include:

- Mercury ends `ح`;
- Moon ends `ذ`;
- Saturn ends `ص`.

### Zodiac/planet table, p136

The printed nine-column glyph table is restored as a 16/16 map:

- Mars = בר הלחי 1211 + אדום 2122;
- Venus = נלחם 1121 + כבוד נכנס 2211;
- Mercury = חיבור 2112 + קהלה 2222;
- Moon = דרך 1111 + לבן 2212;
- Sun = ממון נכנס 2121 + כבוד יוצא 1122;
- Jupiter = סף נכנס 2111 + נשוא ראש 1222;
- Saturn = שפל ראש 2221 + סוהר 1221;
- Head = ממון יוצא 1212;
- Tail = סף יוצא 1112.

The following printed return clause remains separate and is **not** used to normalize the table. The internal source difference between p136 `العتبة الداخلة` and p137 `عتبة خارجة` is preserved.

### Season letters, p137

Exact source strings are retained:

- Spring `أبجد هوز`
- Summer `حطي كلمن`
- Autumn `شعفص قرشت`
- Winter `تثخذ ضظغ`

## Working artifact

Input for this batch: `kashf-v57-draft-phase4-boundary-batch07.html`.

Output: `kashf-v57-draft-phase4-content-batch08-final.html`.

Output QA:

- bytes: **4,644,674**
- SHA-256: **`a62c2e822f260fb7c62c2bd812cdb44ce3d888288468ceada847572dd5ee4585`**
- numbered anchors p21–p276: **256/256**
- missing anchors: **0**
- duplicate anchors: **0**
- only page sections p133–p138 changed in this batch.

## Master Index consequence

Existing index ranges for the Mazag map, planet letters, zodiac/planet order and seasonal figure groups already cover the necessary printed-page spans. One traceability repair is newly mandatory:

`foundation.p137.season-letters-zodiac-elements` already has printed pages `[137,138]` / scan pages `[139,140]`, but the old index has only v57 anchor `#p137` because the pre-repair HTML had collapsed the p138 continuation backward. Stage `#p138` as a second required anchor.

This is recorded separately in `KASHF_PHASE4_MASTER_INDEX_SYNC_P133_138.patch`.

## Queue status

The local working copy now contains the source-verified repairs for `B07-P134-MAZAG-TABLE-COMPLETENESS`, `B08-P135-PLANET-LETTERS-V57`, `B08-P136-ZODIAC-PLANET-TABLE-V57`, `B08-P136-137-SEASON-FIGURE-GROUPS-V57`, and `B08-P137-SEASON-LETTERS-V57`.

They remain **OPEN** in the canonical Master Index until the corrected HTML artifact itself is versioned in the repository and its repository diff is reviewed. No runtime/Registry/routing/Golden-Test work is authorized by this checkpoint.