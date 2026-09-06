# HALL_WISDOM_KASHF_SOURCE_LOCAL_CLASSIFICATION_AUDIT

> Documentation only. No code changed, no test changed, no engine file
> touched. No Commit/Push/Deploy/Amend/Merge. No code proposed anywhere
> in this document — only findings and correction *categories*. Source
> re-read directly from `kashf-hebrew-v56-clean-final.html` (via
> `/tmp/kashf_book_extracted.txt`, footer-verified `pageno`, not the
> table of contents). This document consolidates the source-local
> classification audit performed for the 9 live functions identified in
> the `MALEFIC_FIGURE_PATTERNS` impact audit (functions confirmed
> reachable: imported into `kashf-reading-engine.js`, present in
> `LEGACY_FN_REGISTRY`, and referenced by `fnName` in at least one
> topic's `supportingChecks` in `kashf-topic-rules.js`).

---

## 1. `computeReturnToOfficeKashf`

- **Footer-verified source page:** p.266.
- **Code citation:** `kashf-pending-extraction.js` comment says "kashf p.266" — **correct**.
- **Local source rule** ("מי שהודח משירות — האם יחזור?"):
  > "ראה את הראשון. אם הוא מיטיב נכנס, ומצטייר בעשירי או בבתים החזקים,
  > והאחרית מעידה על כך — הוא חוזר למקומו. ואם הצורה מזיקה, הדין להפך."
- **Classification mechanism required:** binary benefic/malefic (מיטיב/מזיק), explicit in the text, applied to h1 (with an "incoming" qualifier), with supporting conditions on h10/"the strong houses" and an outcome-house.
- **Mechanism currently implemented:** binary `isBenefic = !MALEFIC_FIGURE_PATTERNS.has(key)` applied to h1 (+incoming), h10, h16.
- **Status:** **provisionally safe.**
- **Independently proven defects:** none found.
- **Missing dependency / source decision:** the local page states the binary judgment but never enumerates which of the 16 patterns fall on which side — the boundary treatment of the 6 mixed figures is not resolved here. This is the same open, general classification-source decision documented in the `MALEFIC_FIGURE_PATTERNS` impact audit, not a page-specific problem.
- **Expected correction category:** classification-source decision (general, not specific to this function).

---

## 2. `computeStateStabilityKashf`

- **Footer-verified source page:** p.265–266.
- **Code citation:** "kashf pp.265-266" — **correct**.
- **Local source rule** ("דין הלבוש וקיום המצב" → "קיום המצב"):
  > "אם בראשון צורה מיטיבה והיא בבתים מאושרים, וחוזרת גם בחמישה־עשר...
  > וכן ראה את הראשון, השני ואת הנולד מהם — התשיעי... בקיום המצב ראה את
  > ארבעת היתדות, הסמוכים להן, החמישי והשישה־עשר... מזיק בבית טוב יכול
  > להפוך מרע לטוב; ומזיק בבית מזיק — להפך."
- **Classification mechanism required:** binary benefic/malefic, explicit, applied across h1/h2/h9/h15.
- **Mechanism currently implemented:** binary `isBenefic` check on h1/h2/h9/h15, matching the house selection in the text.
- **Status:** **provisionally safe.**
- **Independently proven defects:** none found.
- **Missing dependency / source decision:** same open boundary-treatment question as #1 — not resolved locally.
- **Expected correction category:** classification-source decision (general).

---

## 3. `computeLifespanKashf`

- **Footer-verified source page:** p.264.
- **Code citation:** "kashf p.264" — **correct**.
- **Local source rule** ("דין החיים"), quoted in full:
  > "הבית האחד־עשר מורה על ראשית החיים; התשיעי על האמצע; והשביעי על
  > הסוף. **דון לפי צורות הכוכבים המופיעות בבתים.**"
- **Classification mechanism required:** **planet-based association** ("judge by the planetary figures appearing in the houses") — not a benefic/malefic binary at all.
- **Mechanism currently implemented:** binary `isSaad`/`MALEFIC_FIGURE_PATTERNS` labeling of h11/h9/h7 as מיטיב/מזיק.
- **Status:** **blocked by a proven implementation defect.**
- **Independently proven defect:** the implemented mechanism (fortune binary) does not match the mechanism the source specifies (planetary-figure judgment) for this technique. This is provable directly from the quoted text, not merely ambiguous.
- **Missing dependency / source decision:** a planet-based interpretation table for what each planet means at each of the three life-stage houses (h11/h9/h7) — the app already has a comparable planet-association mechanism used elsewhere (`FIGURE_PLANET_MAP`, `PROFESSION_BY_PLANET` pattern in `computeProfessionH9Kashf`), but no such table exists yet for this specific life-stage technique.
- **Expected correction category:** planet-based interpretation (mechanism replacement, not a classification-source tweak).

---

## 4. `computeClothingLuckKashf`

- **Footer-verified source page:** p.265.
- **Code citation:** "kashf p.265" — **correct**.
- **Local source rule** ("דין הלבוש"):
  > "אם בחמישי ובאחד־עשר יש צורות מיטיבות, יש לו מזל בלבושים. אם
  > בעשירי מזיק, אין לו מזל בלבוש המלכים או בכיבוד הבא מצד בעלי מעלה.
  > אם בשני הבתים צורות מזיקות, אין לו מזל בלבוש, והבגד נשאר עליו עד
  > שיקרע. אם הצורה מתהפכת, אינו עומד על לבוש אחד."
- **Classification mechanism required:** binary benefic/malefic for h5/h10/h11, plus a separate "mutable" (מתהפכת) qualifier.
- **Mechanism currently implemented:** binary `isSaad` on h5/h10/h11, plus `isMutable` on h5 — matches the text's structure.
- **Status:** **provisionally safe.**
- **Independently proven defects:** none found.
- **Missing dependency / source decision:** same general boundary-treatment question as #1/#2 — not resolved locally.
- **Expected correction category:** classification-source decision (general).

---

## 5. `computeProfessionH9Kashf`

- **Footer-verified source page:** p.254.
- **Code citation:** "kashf p.254" — **correct**.
- **Local source rule** ("תכונות המלאכות"):
  > "אם בבית העשירי ובאחד־עשר יש צורה מיטיבה, מלאכתו מעטה בטרחה והוא
  > מוצא בה מנוחה. אחר כך דנים לפי הצורה או הכוכב בבית התשיעי:" [followed
  > by a planet→profession table].
- **Classification mechanism required:** binary benefic/malefic (explicit) for the h10/h11 "light work" qualifier only; **named/planet-based** for the profession itself (h9).
- **Mechanism currently implemented:** binary `isSaad` on h10/h11 for the "light work" clause; a separate planet-lookup table (`PROFESSION_BY_PLANET`/`FIGURE_PLANET_MAP`) for h9's profession — **already correctly split**, matching the source's own two-part structure.
- **Status:** **provisionally safe.**
- **Independently proven defects:** none found. The function's separation of the binary clause from the planet-based clause is a positive, source-consistent design already in place.
- **Missing dependency / source decision:** same general boundary-treatment question as above, limited to the h10/h11 clause only.
- **Expected correction category:** classification-source decision (general, narrow scope — h10/h11 clause only).

---

## 6. `computeWellDrillingKashf`

- **Footer-verified source page:** p.188 (the operative sentence; code cites p.188-189, a 2-page range that includes it).
- **Code citation:** "kashf p.188-189" — **correct as a range**, operative sentence is on p.188.
- **Local source rule** ("בחפירת בארות ותעלות"):
  > "עשה את הראשון, הרביעי, השישי והשמיני לאמהות, והשלים את גורל
  > החול. אם **הרביעי והיתדות מיטיבים ופנימיים** — המבוקש מתקבל."
- **Classification mechanism required:** binary benefic/malefic **combined with an "internal" (פנימי) qualifier applied to the whole group** (h4 + all four pillar houses together), preceded by a **board reconstruction step**: houses 1, 4, 6, 8 are to be used as fresh "mothers" for a new raml casting, not read directly off the existing board.
- **Mechanism currently implemented:** `h4Good = isSaad(h4) && isIn(h4)` (internal qualifier applied to h4 only); `pillarsOk = [h1,h4,h7,h10].every(isSaad)` (benefic-only, **no internal qualifier** applied to h1/h7/h10); no board reconstruction — reads the existing board's h1/h4/h7/h10 directly.
- **Status:** **blocked by proven implementation defects.**
- **Independently proven defects:**
  1. The "internal" (פנימי) qualifier the source applies to the pillars **as a group** is dropped for 3 of the 4 pillar houses (h1, h7, h10) — only h4 is checked for it.
  2. The source's board-reconstruction step (1/4/6/8 as new mothers) is not implemented at all — the function reads the existing board instead.
- **Missing dependency / source decision:** (a) a decision on whether to add the missing internal-qualifier check to h1/h7/h10; (b) a decision on whether/how to implement the described secondary board reconstruction.
- **Expected correction category:** missing internal/external condition; reconstructed secondary board.

---

## 7. `computeTravelTimingKashf`

- **Footer-verified source page:** p.238.
- **Code citation:** "kashf p.238" — **correct**.
- **Local source rule** ("זמן המסע וצורות המורות עליו"), three named-figure statements plus one binary statement:
  > "בבחירת זמן המסע טוב שתהיה **דרך, נשוא ראש או כבוד נכנס** בבית
  > התשיעי... וצריך שגם הבית הרביעי יהיה בצורה מיטיבה."
  > "אם נשאלת על מסע וראית אחת מן הצורות האלה: **דרך, סף נכנס, כבוד
  > יוצא** — הרי המסע מתקיים."
  > "ואם נמצאו **נשוא ראש, אדום, סף יוצא, ממון יוצא, סוהר, חיבור או
  > קהלה** — המסע אמנם יתקיים, אך ישוב בלא תועלת שלמה."
- **Classification mechanism required:** **named figures only** for h9 (three explicit, closed lists — BEST=3, GOOD=3, NEUTRAL=7 patterns); binary benefic/malefic (explicit) for h4 only.
- **Mechanism currently implemented:** `BEST = ['1111','2221','2211']`; `GOOD = ['1111','2111','1122']`; `NEUTRAL = ['2221','1112','1212','1221','2112','2222']` (6 patterns) for h9; binary `isSaad` for h4.
- **Status:** **blocked by proven implementation defects.**
- **Independently proven defects:**
  1. `BEST` should contain דרך(1111), **נשוא ראש(1222)**, כבוד נכנס(2211) per the source — the code substitutes **שפל ראש(2221)** for נשוא ראש(1222).
  2. `NEUTRAL` should contain 7 patterns — נשוא ראש(1222), **אדום(2122)**, סף יוצא(1112), ממון יוצא(1212), סוהר(1221), חיבור(2112), קהלה(2222) — the code's set has only 6, is **missing נשוא ראש(1222) and אדום(2122) entirely**, and wrongly includes שפל ראש(2221) (the same pattern erroneously placed in `BEST`).
  3. As a direct consequence, אדום currently falls through to the function's `else` branch ("avoid-travel"), contradicting the source, which places it in the "travel happens, no full benefit" category.
  4. `GOOD` matches the source exactly — no defect there.
- **Missing dependency / source decision:** none — this is a direct data-correction matter, not an open source question.
- **Expected correction category:** named-figure data correction.

---

## 8. `computeFugitiveKashf`

- **Footer-verified source page:** p.231.
- **Code citation:** "kashf p.240-241" — **incorrect**. Pages 240-241 contain travel-direction-by-element material with no fugitive-specific house mapping; the actual matching passage, including an exact house-for-house match to the function's own house selection, is on p.231 ("כלל מעשי בבורח ובאבדה").
- **Local source rule** (p.231):
  > "עשה את הבית הראשון לבעל החפץ, ואת הבית השביעי לבורח או לאבדה,
  > ואת הבית העשירי לבעל העניין, ואת הבית הרביעי למקום שבו הם מצויים,
  > ואת הבית החמישה־עשר לסוף הדבר. אם מצאת את ארבע צורות היסוד האלה
  > במצב מיטיב, והסוף מעיד לטובה, הרי הבורח או האבדה לא התרחקו
  > ממקומם, והם עתידים לשוב."
- **Classification mechanism required:** binary benefic/malefic, explicit, applied to h1/h7/h10/h4 (the "four foundation figures") plus an outcome check on h15.
- **Mechanism currently implemented:** `allFourGood = [h1,h7,h10,h4].every(isSaad)`, `outcomeGood = isSaad(h15)` — matches the source's house selection and binary structure exactly. **In addition**, the code requires `h1h6BothIn` (both h1 **and h6** must be "incoming") as a further precondition for the "will-return" verdict.
- **Status:** **blocked by proven implementation defects.**
- **Independently proven defects:**
  1. The code's page citation (240-241) is wrong; the correct citation is p.231.
  2. The `h1h6BothIn` condition has **no textual support** in the matching passage — house 6 is not mentioned anywhere in this rule at all.
- **Missing dependency / source decision:** a decision on whether the h6 condition originates from a different, not-yet-identified passage (and should be retained with a corrected citation) or should be removed as unsupported.
- **Expected correction category:** unsupported house condition removal; citation correction.

---

## 9. `computeServantMatterKashf`

- **Footer-verified source page:** p.166.
- **Code citation:** "כשף עמ' 165" — **incorrect**. The matching sentence appears in "פרק כולל לסימנים רבים," which is on p.166, not p.165.
- **Local source rule, quoted in full for this technique** (p.166):
  > "ואם תרצה לדעת עניין עבד, קח מן השישי והשישה־עשר צורה."
  > ("If you want to know about a servant matter, take a figure from the
  > 6th and 16th [houses].")
- **Classification mechanism required:** **none stated locally.** The passage specifies only how to *derive* the figure (combine h6 and h16) — it gives no favorable/unfavorable, מיטיב/מזיק, or any other interpretation rule for the resulting figure anywhere in this sentence or its immediate surrounding text.
- **Mechanism currently implemented:** the combined/derived figure (h6 XOR-combined with h16) is looked up in `MALEFIC_FIGURE_PATTERNS`; מיטיב → "favorable," מזיק → "unfavorable."
- **Status:** **blocked because the local source supplies no interpretation rule.**
- **Independently proven defects:** (a) the page citation is wrong (165 vs actual 166); (b) the interpretation step (favorable/unfavorable by fortune) is not stated by this passage at all — it is a generic geomantic convention applied by the function, not a locally-sourced rule. Per standing instruction, this convention is not treated as source-derived merely because similar fortune-based readings appear elsewhere in the book (p.55-57 or otherwise) — the local page does not refer back to any such classification.
- **Missing dependency / source decision:** whether an interpretation rule for this specific combined figure exists elsewhere in the book (not yet located) and should be found before any classification is applied, or whether the current generic-convention approach should be documented as `not-yet-found-in-current-code-search` pending that search.
- **Expected correction category:** citation correction; missing interpretation rule.

---

## Final Correction Matrix

### Provisionally safe
- `computeReturnToOfficeKashf`
- `computeStateStabilityKashf`
- `computeClothingLuckKashf`
- `computeProfessionH9Kashf`

*(All four share the same open, general classification-source decision — the local pages require a binary מיטיב/מזיק judgment but do not resolve which of the 16 patterns, including the 6 mixed figures, fall on which side. No independently provable defect was found in any of the four beyond this shared, already-documented open question.)*

### Blocked by proven implementation defects
- `computeLifespanKashf` — wrong mechanism (planet-based interpretation required, not fortune-binary).
- `computeWellDrillingKashf` — missing internal/external condition on 3 of 4 pillar houses; unimplemented secondary board reconstruction.
- `computeTravelTimingKashf` — named-figure data errors (pattern swap in `BEST`; missing/duplicated entries in `NEUTRAL`).
- `computeFugitiveKashf` — citation error; unsupported house condition (h6) with no textual basis.

### Blocked because the local source supplies no interpretation rule
- `computeServantMatterKashf` — citation error; the local passage specifies figure derivation only, with no stated fortune-interpretation rule to implement or correct against.

No code, test, or other existing file was modified in the production of this document.
