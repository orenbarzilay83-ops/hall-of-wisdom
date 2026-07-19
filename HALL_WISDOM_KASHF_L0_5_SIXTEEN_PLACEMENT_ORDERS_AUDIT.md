# HALL_WISDOM_KASHF_L0_5_SIXTEEN_PLACEMENT_ORDERS_AUDIT

> Audit only. No code changed. No commit/push/deploy. No AI call. No UI
> touched. No engine wiring. No L0.5 or L2.4 implementation. No Hawi
> legacy fix. **Headline finding, stated up front because it overturns
> every prior mapping document's status claim: L0.5 is NOT missing.**
> A 934-line, rigorously source-verified data file
> (`kashf-shibutzim.js`) already exists, already covers 15 of the
> claimed 16 placement orders in full, and is already partially wired
> into live engine output — including a working, routed, exposed
> fragment of L2.4 itself. This was not found by any of the 6
> mapping-round documents or the Roadmap/Sub-Engine-Inventory/Coverage-
> Audit documents produced earlier in this effort.

---

## 1. Scope of the search

Re-read, from `kashf-hebrew-v56-clean-final.html`, the full printed-page
range 104-151 (Gate 3, "בביאור סדרי השיבוץ הדרושים לכל רמלאי," PAGE_BLOCK
87-134) sequentially, page by page — not keyword search — searching
specifically for: סדר, שיבוץ, מעגל, מבקש, מבוקש, מעלה, מושב, גבול, פנים,
שמחה, צער, מזג, קוטרי/צלעי, and the requested Arabic-transliteration
terms. Also re-read p.218-221 (Gate 6 Chapter 7, "יוקר וזול... והמבקש
והמבוקש במעגל") in full for the L2.4 connection. Cross-referenced every
finding against the repository via `grep`/`node` execution — not
assumption. Did **not** independently re-verify p.189 (the candidate
16th order, "שיבוץ ההפכים") from raw HTML this round; that citation is
taken from `kashf-shibutzim.js`'s own prior, already-careful
documentation (which quotes the source directly) rather than re-derived
here — disclosed explicitly, not silently assumed.

---

## 2. Professional definition

1. **Exact name in the book**: "סדרי השיבוץ" (Placement Orders / "shibbutz
   orders"). Chapter title (p.104): *"השער השלישי — בביאור סדרי השיבוץ
   הדרושים לכל רמלאי — והם שישה־עשר סדרי שיבוץ"* ("Gate Three — explaining
   the placement orders required for every geomancer — and they are
   sixteen placement orders").
2. **What it is**: a **table** in every single case found — specifically,
   a fixed permutation of the 16 figures into positions 1-16 (a
   "שיבוץ" is explicitly defined at p.104: *"סידור של שש־עשרה צורות בשורה
   אחת"* — "an arrangement of the sixteen figures in one row"). Several
   orders (2, 3) additionally carry a companion **numeric/elemental value
   table**, and several (8-14) carry an explicit **derivation algorithm**
   (a formula for computing which position a given figure lands in, from
   its point-count). It is **not** an algorithm alone, not a house-to-
   figure mapping, and not a circular/wheel structure per se — each
   order is a distinct, independently-orderable **sequence**, sometimes
   with an attached arithmetic method for deriving positions dynamically.
3. **Purpose**: each order is an independent *lookup permutation* used by
   downstream techniques (money magnitude, timing/duration, letter-magic,
   distance-measurement, planetary/zodiac correspondence) — the orders
   are infrastructure, not verdict-producing in themselves.
4. **Which questions use it**: no single order is tied to one question
   type. Order 1 (Seat) and Order 2 (Number/Duration) are the most
   heavily reused (by L2.1 "לשון העניין" and by the L2.4 "מבקש במעגל"
   technique — see §6). Others (4=temperament, 5=zodiac) feed
   descriptive/astrological content (clothing, character) rather than
   direct verdicts.
5. **Input**: a figure identity (pattern), or a point-count (existence/
   absence tally) depending on the order.
6. **Calculation**: table lookup for Orders 1, 3-7, 15; explicit
   subtract-and-reduce arithmetic for Orders 8-14 (each with its own
   modulus and element-value table); Order 2 is a hybrid (a canonical-
   number table plus an author-stated reconciliation rule, see §3).
7. **Output**: a position/house number, or (for Orders 2-3-4 etc.) a
   secondary attribute (duration, money magnitude, planet, zodiac sign,
   letter).
8. **Verdict or intermediate data**: **intermediate data only**. No order,
   by itself, produces a verdict — each is consumed by a *further*
   technique (L2.1, L2.4, money-magnitude, etc.) that produces the actual
   verdict.
9. **Dependent engines**: L2.1 (לשון העניין, uses Order 2), L2.2 (money-
   magnitude, uses Order 2's money table), L2.4 (מבקש במעגל, uses Order 1
   — confirmed precisely in §6, correcting a prior assumption), Dhamir
   Type 2 (element-prevalence, uses Order 1 and Order 3 — see §5),
   Dhamir's "letters+10 mod 12" additional technique (uses Order 6).
10. **Global or topic-specific**: **global infrastructure** — none of the
    16 orders is itself scoped to a single topic/question-family.

---

## 3. Full order map

**Correction up front**: the book's own closing line (p.151) states
*"הרי אלו שישה־עשר סדרי שיבוץ"* ("these are sixteen placement orders"),
but a heading-by-heading `grep` of the entire p.104-151 range this round
found **exactly 15 distinctly-titled orders** — no "השיבוץ השישה־עשר"
heading exists anywhere in that range. This is not an extraction gap
(verified by direct line-count grep of every `[title]`/`[chapter-title]`
tag in the range) — see §8 for full disclosure. `kashf-shibutzim.js`
already documents a strong candidate for the missing 16th at p.189, in
an *entirely different chapter* (Gate 6) — included below as Order 16
(candidate), clearly marked as such, not merged into the main 15.

| # | Provisional label | Source page(s) | Section title (exact) | Trigger | Input | Sequence/method | Output meaning | Question families | Worked example? | Unresolved notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | שיבוץ המושב (Seat) | 104-105 | "השיבוץ הראשון: שיבוץ המושב" | On demand | Figure identity | Fixed table, figure→"own house" | Which house is a figure's "home"; sitting there signals hidden-intent strength | L2.4 (confirmed, §6); general dhamir "own-house" checks | No numeric worked example, but the table itself is exhaustive | A quoted, explicitly-rejected alternate (בר הלחי↔דרך swap) exists at p.104 — author states "the first is more correct," i.e. the table as given is preferred |
| 2 | שיבוץ המספר ומשך־הזמן (Number & Duration) | 105-121 | "השיבוץ השני: שיבוץ המספר ומשך־הזמן" | On demand | Figure identity or house | Canonical-number table (triangular sequence) + author's own final reconciliation rule (p.109) | A number (dirhams or count) and a duration (days/weeks/months/years) | L2.1 (לשון העניין), L2.2 (money-magnitude) | Yes — a full "לשון העניין" worked example (p.112) and Al-Zanati's 3 examples (p.113, cited but explicitly NOT the author's own ruling — see §8) | Al-Zanati's 3rd example (p.113, דרך) does not fit the arithmetic pattern of his other 2 — `kashf-shibutzim.js` flags this as an open, unresolved contradiction, not fixed |
| 3 | שיבוץ היסודות (Elements) | 121-132 | "השיבוץ השלישי: שיבוץ היסודות" | On demand | Figure identity | Fixed table + element base-values (3 competing traditions cited, 1 chosen as the author's working method) | Elemental composition of a figure/question | Dhamir Type 2, Five Witnesses (E) — see §5 | Yes, single-element examples (p.122) | 3 competing element-value traditions (Al-Zanati 9/11/14/16; Al-Tarablusi 1/2/4/8; "naturalists" 1/2/3/4 — the author's own working choice) explicitly presented without full numeric reconciliation, though the author asserts "all return to one law" |
| 4 | שיבוץ המזג (Temperament/Planets) | 133-135 | "השיבוץ הרביעי: שיבוץ המזג" | On demand | Figure identity | Fixed table, figure↔planet | Planetary temperament, day/night, letters | Illness diagnosis (planet-linked letters) | No | An unresolved cross-reference: a separate existing file (`hawi-interpreter.js::FIGURE_PLANET_MAP`) adds כבוד נכנס to נוגה, not directly supported by p.133-135's own text — flagged, not fixed, in `kashf-shibutzim.js` |
| 5 | שיבוץ המזלות (Zodiac) | 135-138 | "השיבוץ החמישי: שיבוץ המזלות" | On demand | Figure identity | Fixed table, figure↔season/zodiac (3 figures per season) | Seasonal/zodiac correspondence | Timing (planting/harvest), illness-season matching | No | The 3-figure "spring" group is completion-by-elimination, not explicitly quoted from source (per `kashf-shibutzim.js`'s own disclosure) |
| 6 | שיבוץ האותיות (Letters) | 138-141 | "השיבוץ השישי: שיבוץ האותיות" | On demand | Figure identity | Fixed table (16/16 primary letters, 12/16 secondary) | Letter(s) for name/talisman work | Letter-magic across many topics; Dhamir's "letters+10" additional technique | Yes (p.140, love-divination case) | 2 competing letter-to-element traditions cited side by side (Arab/Indian sages vs. Greek/Eastern sages), not reconciled |
| 7 | שיבוץ אבּדח (Abjad) | 142-143 | "השיבוץ השביעי: שיבוץ אבּדח" | On demand | Figure identity | Fixed table; base values fire=1,air=2,water=4,earth=8 | Seed sequence for Orders 8-10 | Infrastructure only | No | None found |
| 8 | שיבוץ הרוחב (Width) | 143-144 | "השיבוץ השמיני: שיבוץ הרוחב" | On demand | Existence+absence point count | Subtract 17 (or 1) from the count | House position | Infrastructure | Yes (כבוד נכנס worked example, p.143) | One position (11, כבוד יוצא) lacks an explicit רמל-sign citation in source, completed by elimination |
| 9 | שיבוץ העומק (Depth) | 144-145 | "השיבוץ התשיעי: שיבוץ העומק" | On demand | Existence+absence point count | Subtract 16 | House position | Infrastructure | Yes (כבוד נכנס worked example, p.145) | None found |
| 10 | שיבוץ ההשבה (Return) | 145-146 | "השיבוץ העשירי: שיבוץ ההשבה" | On demand | Absence count only, Abjad-based | Abjad-style reduction | House position | Infrastructure | No numeric example, but the full 16-position order is verified word-for-word against the source poem | None found — this order is unusually well-verified (poem cross-check, per `kashf-shibutzim.js`) |
| 11 | שיבוץ יזד'ג (Yazdaj) | 146-148 | "השיבוץ האחד־עשר: שיבוץ יזדג׳" | On demand | Existence count | Subtract 16 (if <16, count itself = house) | House position | Infrastructure | No | 2 of 16 positions (4, 12) lack explicit רמל-signs in source, completed by elimination |
| 12 | שיבוץ כדוגמת אבּדח ("תסכין مثله أبدح") | 147-149 | "הסדר השנים־עשר" | On demand | Existence count | Subtract 16 twice (32) | House position | Infrastructure | No | An alternate element-value tradition cited (7/14/28/56, doubling the main 3/6/12/24) not chosen between |
| 13 | שיבוץ "לבן" (name lost in source, editorially inferred) | 149 | "הסדר השלושה־עשר" | On demand | Existence count | Same method as Order 11 (Yazdaj-style) | House position | Infrastructure | No | **Order name itself is missing from the source** — the book's own editorial note says "לבן" was inferred, not an original heading |
| 14 | שיבוץ "הדרך נופלת" / "אייקע אל־טאריק" | 150 | "הסדר הארבעה־עשר" | On demand | Existence count | Yazdaj-style | House position | Infrastructure | No | None found |
| 15 | שיבוץ בן־מחפוף אל־מונַג'ם | 150 | "הסדר החמישה־עשר" | On demand | Figure identity (sequence only) | **No element base-values or reduction method given anywhere in the source for this order** — only a fixed 16-position sequence | House position (presumably; mechanism unstated) | Infrastructure | No | **Confirmed, not merely suspected**: this order has a full 16-figure sequence table but zero stated fire/air/water/earth values and zero stated reduction algorithm — a genuine content gap in the source itself |
| 16 (candidate) | שיבוץ ההפכים (Opposites) | 189 (**different chapter — Gate 6, not Gate 3**) | Embedded in "האם הדבר במקומו?" (hidden-object/water-depth chapter) | On demand | Which elemental lines are "open" in a figure | Sum the length-measure of each open elemental line | Depth/distance of a hidden or buried thing | Hidden-object, water-depth questions (Gate 6 Ch.4) | Yes, 2 examples (p.185-190 region, per `kashf-shibutzim.js`) | **Not confirmed to be "the" missing 16th order** — the book itself never explicitly numbers it as part of the Gate-3 sequence; it is the closest completion candidate found, not a certainty |

**Provisional-label discipline**: none of these 16 labels is invented —
each is quoted or directly transliterated from the book's own section
titles, except Order 16 which is explicitly marked `[candidate]`, not
asserted as confirmed.

---

## 4. Sources and pages (summary)

Gate 3 spans printed pages 104-151 (PAGE_BLOCK 87-134 in the extracted
text, verified via the `.pageno` footer, not the table of contents —
consistent with the pagination-offset finding from the earlier mapping
round). The candidate 16th order sits at p.189, inside Gate 6 Chapter 4.
The L2.4 technique sits at p.218-221, inside Gate 6 Chapter 7.

---

## 5. Connection to the Essential Dignities Table (`FIGURE_DIGNITIES`)

This section required the most caution, and produced the audit's second
major finding.

### 5.1 — Order 1 vs. `FIGURE_DIGNITIES.moshavHouse`: NOT the same table

A programmatic cross-check (Order 1's house→figure table, inverted to
figure→house, compared against `FIGURE_DIGNITIES.moshavHouse` for the
14 figures that have dignity data) found:

- **7 of 14 figures match exactly**: נלחם(5), נשוא ראש(1), סף נכנס(14),
  לבן(9), בר הלחי(16), שפל ראש(7), ממון יוצא(3).
- **7 of 14 figures do NOT match**: סף יוצא (Order1=12, Dignities=13),
  אדום (Order1=8, Dignities=9), סוהר (Order1=6, Dignities=12), כבוד
  נכנס (Order1=11, Dignities=10), כבוד יוצא (Order1=10, Dignities=11),
  ממון נכנס (Order1=2, Dignities=15), קהלה (Order1=4, Dignities=2).

`kashf-shibutzim.js` already documents this exact finding independently
(lines 32-36): *"שיטה זו נפרדת לגמרי מטבלת 'מעלה/מושב/גבול/פנים'
שבעמ' 97-99 ... שתי מסורות 'מושב' שונות באותו ספר"* ("this method is
entirely separate from the exaltation/domicile/bound/face table at
p.97-99 ... two different 'domicile' traditions in the same book"). This
round's independent re-derivation from raw HTML matches that prior
finding exactly, on every one of the 14 compared figures — strong
mutual confirmation. **Conclusion: L0.5's Order 1 and L0.3's `moshavHouse`
field are two distinct, non-interchangeable book traditions sharing the
same Hebrew word "מושב." Any future code must never use one where the
book means the other.**

### 5.2 — "בית כבוד" (house of honor, used by L2.4) vs. `FIGURE_DIGNITIES.maalaHouse`: partially confirmed, partially contradicted

See §6 for the full derivation. Summary: `kashf-shibutzim.js` already
found, and this round independently re-derived from the same raw text,
that of the 2 explicitly-worked p.219 examples, **1 matches
`maalaHouse` exactly (שפל ראש=8) and 1 contradicts it (כבוד נכנס: p.219
says 12, `FIGURE_DIGNITIES` says 9)**. A third data point (ממון יוצא,
p.220) was independently checked this round and found to belong to a
**different rule** ("דיני המבוקש במעגל," not "המבקש במעגל") — confirmed
via `kashf-shibutzim.js`'s own prior documentation of the same
conclusion, and its arithmetic does not resolve under any interpretation
tried by either this round or the prior one.

### 5.3 — Does the "צערה" (its sorrow) reference in Order 2 use `FIGURE_DIGNITIES.tzaarHouse`?

The Order 2 reconciliation text (p.109) states that when a figure is not
in its Order-1 seat, one derives a new figure and judges "by its number,
or by its sorrow (צערה), or by its day." "Its number" and "its day" both
resolve to Order-2-internal tables (canonical number, חיאתי day-count).
Whether "צערה" resolves to `FIGURE_DIGNITIES.tzaarHouse` or to some other,
undocumented concept is **not confirmed either way** — no dedicated
"sorrow" table exists elsewhere in Gate 3, which is suggestive but not
conclusive. Flagged as an open question, not resolved here.

### 5.4 — Does the Five Witnesses system (E) use Order 3's element values specifically?

The Five Witnesses mechanism (p.130-131) sits physically within Gate 3,
immediately after Order 3's three competing element-value traditions
(p.126-129), and its own Fire+Earth reduction does not restate which
tradition's numeric values it uses. This is an existing ambiguity
already noted in the earlier mapping round's Precedence & Conflict Map
(§10.4) — this round adds the observation that Order 3's own physical
placement in the text (immediately preceding Five Witnesses) is at least
suggestive of a direct link, though not textually confirmed.

### 5.5 — Is "single remaining dependency" still an accurate status for L2.4?

**No — this status, stated in all prior Roadmap/Slice-Recommendation
documents, requires revision.** Prior documents assumed L2.4 depended
on both L0.3 (Essential Dignities Table) and L0.5 (specifically Order
1), and that L0.3's later-confirmed existence left "only L0.5" as the
blocker. This round's finding is more precise: L2.4's actual dependency
is **Order 1 (L0.5) for the casting step, and a distinct, only-2-of-16-
figures-verified "בית כבוד" table for the starting count** — a
table that is conceptually related to, but numerically inconsistent
with, `FIGURE_DIGNITIES.maalaHouse` in 2 of 3 checked cases. **L0.3 was
never actually the correct dependency for L2.4's counting step** — this
was an unverified assumption carried across every prior document,
corrected here for the first time. This does not change the standing
conclusion that no document should be edited without your explicit
authorization (see §11) — it is reported, not silently fixed elsewhere.

---

## 6. Connection to L2.4 — the full, evidence-based account

### Exact source pages
p.218 (rules opening), p.219 (מבקש/Seeker rule + 2 worked examples),
p.220 (מבוקש/Sought rule + 1 example, distinct rule).

### Required inputs
The figure occupying house 1 of the current board; that figure's "בית
כבוד" (house of honor); Order 1's sequence table (for the casting step).

### Calculation sequence (reverse-engineered and independently confirmed
programmatically this round against `computeRequesterCircleHouse`)
1. Identify the figure in house 1.
2. Look up its "house of honor" (currently known for exactly 2 of 16
   figures: שפל ראש=8, כבוד נכנס=12 — per `REQUEST_CIRCLE_HONOR_HOUSES`).
3. Count inclusively, forward, with wraparound, from the house-of-honor
   number to house 1. (Verified: שפל ראש 8→1 = 10 steps; כבוד נכנס 12→1
   = 6 steps — both match the source's stated results exactly.)
4. Cast that count starting from house 1, "according to the placement-
   order of the Seat" (**explicitly, literally, Order 1 by name** — the
   source text says "על פי סדר השיבוץ של המושב," directly naming Order 1,
   not the Essential Dignities table's מושב column — resolving the §5.1
   ambiguity in L2.4's specific favor).
5. Read the landed house's quality (pillar/succedent/cadent, benefic/
   malefic) to judge the seeker's strength.

### Where L0.5 enters, precisely
Step 4 only — the casting/counting mechanism. Steps 2-3 use a *different*,
much-less-verified table (`REQUEST_CIRCLE_HONOR_HOUSES`, 2 of 16 figures).

### Is L2.4 fully blocked without it?
**No — L2.4's "מבקש" (Seeker) half is already implemented, routed, and
exposed** (see §7). It is not "blocked"; it is **partially built and
correctly, honestly limited to 2 of 16 possible house-1 figures**,
refusing to guess for the other 14 (confirmed by direct execution:
`computeRequesterCircleHouse('1121')` returns `null`). The "מבוקש"
(Sought) half (p.220) has **no implementation anywhere in the repo**
(confirmed by `grep`) and its own worked example's arithmetic does not
verify under any interpretation tried — a genuine, unresolved source
issue, not an implementation gap that can be closed by more careful
coding.

### Does GT-3 require all of L0.5, or a subset?
**A subset — Order 1 only** — and even that, only for the 2 already-
verified house-of-honor figures. GT-3 (as defined in the earlier Golden
Test Strategy document) needs **revision**: it currently cites "a
confirmed fully-worked source example, p.219-220" as a single unit —
this round finds that p.219's two examples ARE fully reproducible and
already reproduced exactly by existing code, while **p.220's example
belongs to a different, unverified rule and should not be bundled into
the same Golden Test**. This is reported for your awareness; the Golden
Test Strategy document is not edited this round (see §11).

---

## 7. Existing Code Audit

| File | Export/function | Purpose | Input/Output | Source ref | Status | Is it really L0.5? |
|---|---|---|---|---|---|---|
| `kashf-shibutzim.js` (934 lines) | `SHIBUTZ_1_MOSHAV` through `SHIBUTZ_15_ORDER`, plus `SHIBUTZ_16_OPPOSITES_DEPTH_MEASURES` | All 15 confirmed orders + the p.189 candidate 16th, each with `sourceStatus`/`sourceRef` | Figure↔position tables, element-value tables, method descriptions | p.104-151 (Orders 1-15), p.189 (candidate 16) | **Implemented, source-verified, partially routed** | **Yes — this is L0.5**, far more complete than any prior document found or assumed |
| `kashf-shibutzim.js` | `getFigureByLetter(letter)` | Reverse lookup for Order 6 | Letter → figure | p.138 | Implemented, unclear if routed further (not checked this round) | Yes — Order 6 helper |
| `kashf-shibutzim.js` | `computeHiddenDepthByOpposites(pattern)` | Applies the candidate Order 16 | Pattern → length-measure list | p.189 | **Implemented and routed** (see `kashf-book-additions.js`) | Yes — candidate Order 16 |
| `kashf-shibutzim.js` | `REQUEST_CIRCLE_HONOR_HOUSES`, `computeRequesterCircleHouse(pattern)` | L2.4's "בית כבוד"/casting mechanism, 2 of 16 figures | Pattern → `{honorHouse, count, landingHouse}` or `null` | p.218-219 | **Implemented, routed, exposed** (see below) | This is **L2.4**, not L0.5 itself — but it *consumes* L0.5's Order 1 internally |
| `kashf-dhamir.js` | imports `SHIBUTZ_1_MOSHAV`, `SHIBUTZ_2_CANONICAL_NUMBER`, `SHIBUTZ_3_ELEMENT_VALUES`; also `FIGURE_DIGNITIES` | Dhamir Type 2 (element-prevalence) root/seat checks | — | — | Live consumer | Confirms Orders 1-3 are already load-bearing in production dhamir logic |
| `kashf-book-additions.js` | imports `computeRequesterCircleHouse`, `computeHiddenDepthByOpposites`; defines `computeRequesterCircleStrengthKashf(chart)` | Wraps L2.4's Seeker-strength check into a narrative-producing function | Board → Hebrew narrative object or `undefined-in-source` fallback | p.218-219 | **Implemented** | This is the L2.4 wrapper, one layer above the raw L0.5 consumer |
| `kashf-topic-rules.js` (line ~1452) | rule entry `id: 'requester-circle-strength'`, `checkType: 'legacy-fn'`, `fnName: 'computeRequesterCircleStrengthKashf'`, `houses: [1]` | Registers the L2.4 Seeker check as a supportingCheck under the `commerce` topic | — | Cites p.218-219 verbatim, including the "מאומת ל-2 מתוך 16 הצורות בלבד" caveat in its own `sourceText` field | **Routed** | Confirms this reaches the rule-selection pipeline, not just a dangling function |
| `kashf-reading-engine.js` (lines 87, 141) | imports and registers `computeRequesterCircleStrengthKashf` in its function-dispatch table | Makes the check callable by the generic `legacy-fn` dispatcher used for all supportingChecks | — | — | **Exposed** — reaches the same dispatch path as every other already-verified supportingCheck in the codebase (confirmed this round by direct inspection, not assumed from naming similarity) | Confirms full routing to output, matching the codebase's own established `legacy-fn` pattern |
| `kashf-leshon-hainyan.js` (93 lines) | `computeLeshonHainyan(board, dhamirHouseNum)` | Attempted implementation of L2.1 (לשון העניין), consumes `SHIBUTZ_1_MOSHAV`, `SHIBUTZ_2_*` | — | p.109, 112 | **Implemented but NOT consumed anywhere else in the repo** (confirmed via `grep` — no importer found) | Related to L0.5 (Order 2) but is L2.1, not L0.5 itself; its own source file (`kashf-shibutzim.js`) explicitly disclaims it as "not verified against worked examples from the source" |
| — | search for a "מבוקש"/Sought-circle implementation | — | — | p.220 | **Not found anywhere in the repo** | Confirms the "מבוקש" half of L2.4 genuinely has zero code, unlike the "מבקש" half |

**Classification discipline honored**: nothing above is classified as
"L0.5" merely by name-similarity. `computeRequesterCircleHouse` was
checked by tracing its literal *consumption* of `SHIBUTZ_1_MOSHAV`
(confirmed) before being counted as an L0.5 consumer, not an L0.5
component itself.

---

## 8. Source Ambiguities

| # | Ambiguity | Source page(s) | Exact context | Possible interpretations | Impact on implementation | Resolution status |
|---|---|---|---|---|---|---|
| 1 | **16-vs-15 order count** | 104, 151, 189 | Book opens and closes Gate 3 claiming "16 placement orders"; only 15 are headed/numbered within Gate 3's own body (verified by exhaustive heading grep, not assumption) | (a) A 16th order exists but is misplaced/mistitled within the digitized HTML; (b) the count "16" is a round/approximate authorial claim not meant literally; (c) the candidate at p.189 (Gate 6, "שיבוץ ההפכים") is the intended 16th, deliberately placed elsewhere for thematic reasons | Any "16 orders" assertion in code/docs (including this project's own prior Roadmap documents) should be phrased as "15 confirmed + 1 strong candidate elsewhere," not asserted as a clean 16 | **Unresolved.** `kashf-shibutzim.js` already carries this exact disclosure; this round's independent heading-count re-verification confirms it precisely, does not resolve it further |
| 2 | **Order 1 vs. Dignities-table "מושב" mismatch** | 97-99 vs. 104-105 | See §5.1 — 7 of 14 comparable figures disagree | (a) Two genuinely distinct book traditions sharing a word; (b) a digitization/transcription error in one of the two passages; (c) the book's author himself conflated two source traditions without noticing | Any future engine touching "מושב"/domicile must specify WHICH of the two tables it means — never assume interchangeability | **Unresolved**, independently re-confirmed this round, not newly discovered (already flagged in existing code) |
| 3 | **"בית כבוד" (house of honor) numeric inconsistency** | 97-99 vs. 218-220 | See §5.2/§6 — 1 of 2 comparable data points matches `maalaHouse`, 1 contradicts it; a 3rd point belongs to a separate, unverifiable rule | (a) Same "two traditions, same name" pattern as #2; (b) a genuine transcription slip in one passage; (c) "בית כבוד" in Gate 6 may reference a table never fully digitized anywhere | Blocks confident extension of `REQUEST_CIRCLE_HONOR_HOUSES` beyond its current 2 verified figures without further source work | **Unresolved**, independently re-confirmed this round; the "מעגל נציר א-דין" (Nasir al-Din circle) name-match between p.99 and p.219-220 (see below) suggests a conceptual link despite the numeric mismatch |
| 4 | **"מעגל נציר א-דין" (Nasir al-Din circle) is never independently tabulated** | 99, 219, 220 | The phrase appears in exactly 3 places in the whole book (verified by full-text grep); p.99 says the מעלה column is drawn from it; p.219-220 invoke it twice for L2.4's mechanics — but no standalone table titled "מעגל נציר א-דין" exists anywhere in the digitized source | Either the "מעלה" column at p.97-99 IS the full table (and #3's mismatches are a transcription problem), or a separate, never-digitized table exists elsewhere in the physical book, un-captured here | Cannot build a confident, complete `REQUEST_CIRCLE_HONOR_HOUSES` for the remaining 14 figures without resolving this | **Unresolved — newly surfaced this round**, not previously documented anywhere in this project |
| 5 | **Order 15's missing element base-values** | 150 | The 15th order gives a full 16-position sequence but no fire/air/water/earth values and no stated reduction method, unlike every other arithmetic order (7-14) | (a) An editorial omission in the source; (b) the order was meant to reuse a prior order's values without restating them (the text calls it "the seal of the arithmetic orders," suggesting a closing/summary role rather than a fully independent method) | Order 15 cannot be mechanically applied (only its sequence is known, not how a figure "arrives" at a position) | **Confirmed, not merely suspected** — re-verified by direct reading this round, matching a prior round's suspicion but now stated with certainty |
| 6 | **Al-Zanati's 3rd number-example doesn't fit his own pattern** | 113 | Two of his three worked examples follow a clean subtract/add rule; the third (דרך, landing house 8) does not, and additionally labels house-12's Order-2 group as "the years' place," contradicting the author's own four-winds table (p.106, which puts position 12 in "south/months") | (a) Al-Zanati uses an independent figure↔time mapping not otherwise documented; (b) a transcription error in one of the three examples | This example should not be used as a Golden Test reference without flagging its own internal inconsistency | **Unresolved**, already documented precisely in `kashf-shibutzim.js`, independently re-confirmed this round |
| 7 | **p.220's "מבוקש" worked example arithmetic does not verify** | 220 | ממון יוצא's "house of honor" stated as house 4; counting from house 4 to its actual board position is claimed to yield 7, which does not check out under any counting interpretation tried (forward, backward, inclusive, exclusive, with or without wraparound) | (a) A different, undocumented counting rule for this specific sub-case ("דיני המבוקש," not "מבקש"); (b) a numeric transcription error in the source | This example cannot currently serve as a Golden Test; it should not be silently folded into GT-3 alongside the p.219 examples | **Unresolved**, already documented precisely in `kashf-shibutzim.js`, independently re-confirmed this round |
| 8 | **Order 4's planet dispute for כבוד נכנס** | 133-135 vs. `hawi-interpreter.js::FIGURE_PLANET_MAP` | An existing, separate (Hawi-side) file adds כבוד נכנס to נוגה (Venus); Order 4's own text (p.133-135) does not directly support this; Order 5's seasonal grouping offers indirect, not direct, support | The existing file may reflect a different or later source passage not captured in Order 4's own section | Not urgent — flagged, not blocking L0.5 or L2.4 | **Unresolved**, already flagged in existing code, independently re-confirmed as unresolved this round (not re-investigated further) |
| 9 | **"צערה" reference in Order 2's reconciliation rule** | 109 | See §5.3 | Possibly `FIGURE_DIGNITIES.tzaarHouse`; possibly an undocumented Gate-3-internal concept | Low impact — this is one clause of Order 2's least-mechanically-certain reconciliation rule (already marked `not-yet-found-in-current-code-search` in existing code) | **Unresolved, newly surfaced this round** |
| 10 | **Order 3's element-value tradition used by Five Witnesses (E)** | 126-131 | See §5.4 | Physical proximity suggests a link; not textually confirmed | Affects any future L3.E implementation, not L0.5/L2.4 directly | **Unresolved**, already flagged in the earlier Precedence & Conflict Map, not re-resolved here |

**No ambiguity above was resolved by inference or convenience.** Every
"unresolved" status is left exactly as the evidence leaves it.

---

## 9. Data Model Proposal (proposal only — nothing implemented)

**This section proposes for a hypothetical future round; `kashf-
shibutzim.js` already substantially satisfies it and should not be
rebuilt.** For reference, the shape already in use (and recommended to
continue) is:

```js
{
  orderKey,              // e.g. 'SHIBUTZ_1_MOSHAV'
  position,              // 1-16 (or house key, depending on order)
  pattern,                // 4-digit figure pattern
  hebrewName,
  // order-specific extras: number, elementValue, altNameInPoem, etc.
  sourceStatus,           // 'explicit-in-source' | 'not-yet-found-in-current-code-search'
  sourceRef,               // exact page citation
  patternNote,             // per-item disclosure of inference/gap, where applicable
}
```

**Classification of what this should be**: confirmed, matching the
existing implementation's own choice — **pure data files, one module per
Gate-3-derived concern, with narrow companion functions only where the
book gives an explicit, mechanically-checkable algorithm** (e.g.
`computeHiddenDepthByOpposites`, `computeRequesterCircleHouse`). Not a
single monolithic "engine," not a combined data+engine module. This
matches the existing repo's own established pattern (seen identically
in `kashf-figure-attributes-gate2.js` for L0.3) and should be followed,
not redesigned, if any future round extends this file.

**No new file, adapter, or module is proposed** — the existing file
already occupies this design space correctly.

---

## 10. GT-3 Readiness (p.219-220 worked example)

| Field | Value |
|---|---|
| Question | Trade/pricing — Seeker (מבקש) strength via the Circle |
| Raw inputs | Board with a known figure in house 1 |
| Intermediate steps | (1) identify house-1 figure; (2) look up its house-of-honor; (3) count inclusive-forward-wraparound to house 1; (4) cast that count from house 1 via Order 1's sequence; (5) read the landed house's quality |
| Order used | Order 1 (שיבוץ המושב) — confirmed by exact source wording, not assumed |
| Expected placements (example 1) | שפל ראש in house 1, house-of-honor 8, count 10, lands house 10 |
| Expected placements (example 2) | כבוד נכנס in house 1, house-of-honor 12, count 6, lands house 6 |
| Expected verdict | Example 1: landed house is authority/status-themed (benefic) → seeker gains honor/status/wealth. Example 2: landed house is illness/worry-themed, but supplementary reasoning (a separate figure-blending argument, not part of the circle-count itself) still yields hope |
| Source explanation | Quoted directly, p.219, both examples |
| Dependencies already available | Order 1 (`SHIBUTZ_1_MOSHAV`, confirmed correct); `REQUEST_CIRCLE_HONOR_HOUSES` for these exact 2 figures; `computeRequesterCircleHouse` (confirmed to reproduce both examples exactly, via direct execution this round) |
| Dependency still missing | None, for these 2 specific figures — a **working, routed, exposed implementation already exists and already reproduces both p.219 examples exactly** |
| Reproducible now? | **Exact**, for the 2 verified figures (שפל ראש, כבוד נכנס) — confirmed by direct code execution this round, not claimed from documentation alone. **Blocked**, for any of the other 14 house-1 figures, since `REQUEST_CIRCLE_HONOR_HOUSES` correctly refuses to extrapolate |

**GT-3, as originally scoped in the Golden Test Strategy document
(bundling p.219 and p.220 together), needs revision**: the p.219 portion
is not just reproducible — **it is already reproduced, today, by
existing code**, making it a **regression-lock candidate**, not a
gap-closing one. The p.220 portion should be split out and marked
`blocked-by-source-ambiguity` (per ambiguity #7 above), not bundled into
the same test. This document does not edit the Golden Test Strategy
document itself (see §11).

---

## Recommended Next Step (exactly one)

**Hold a scoping/status-correction conversation, mirroring the L0.3
precedent exactly: before any further implementation work (L2.4's
"מבוקש" half, extending `REQUEST_CIRCLE_HONOR_HOUSES`, or anything else),
correct the "L0.5 = missing" and "L2.4 = missing" status claims across
the previously-delivered mapping documents** (`HALL_WISDOM_KASHF_
MASTER_ENGINE_DEPENDENCY_GRAPH.md`, `HALL_WISDOM_KASHF_ENGINE_
IMPLEMENTATION_ROADMAP.md`, `HALL_WISDOM_KASHF_FIRST_IMPLEMENTATION_
SLICE_RECOMMENDATION.md`, `HALL_WISDOM_KASHF_SUB_ENGINE_INVENTORY.md`,
`HALL_WISDOM_KASHF_BOOK_TO_CODE_COVERAGE_AUDIT.md`, `HALL_WISDOM_KASHF_
GOLDEN_TEST_STRATEGY.md`) — this is a documentation-correction question
requiring your explicit authorization before any file is touched, per
the standing rule for this entire effort, exactly as was done for L0.3.
This is the single most consequential, well-evidenced finding of this
audit and should be corrected before any new implementation decision is
made on top of it.

---

## §10 (per original instruction numbering) — Binding conclusion

- **L0.5 professional definition**: "סדרי השיבוץ" — 16 (15 confirmed + 1
  candidate) independent figure-permutation lookup tables, Gate 3 of the
  book, pure infrastructure, no verdict-producing power of their own.
- **Source pages**: 104-151 (15 confirmed orders), 189 (candidate 16th,
  different chapter).
- **Number of actual orders found**: 15 distinctly headed within Gate 3
  itself; 1 additional strong candidate elsewhere; the book's own claim
  of "16" is not resolved by its own body text.
- **Data/table/engine classification**: overwhelmingly data (tables),
  with narrow, explicitly-sourced companion functions only where the
  book gives a checkable algorithm.
- **Current code status**: **`implemented`, `source-verified`,
  `partially routed`** — NOT `missing`. 15 of 16 orders exist in
  `kashf-shibutzim.js` with rich source citations; 3 orders (1, 2's
  canonical number, 3's element values) are already live in Dhamir Type
  2; Order 1 is already live, routed, and exposed inside a working
  fragment of L2.4.
- **Missing pieces**: the "מבוקש" (Sought) half of L2.4 (zero code, and
  its own worked example doesn't verify); `REQUEST_CIRCLE_HONOR_HOUSES`
  for 14 of 16 figures; Order 15's element-values/method; resolution of
  the Nasir-al-Din-circle table gap (ambiguity #4).
- **Source ambiguities**: 10 identified and precisely documented (§8),
  4 of them newly surfaced this round, 6 already known from existing
  code's own prior, careful documentation and independently re-confirmed.
- **Dependency on `FIGURE_DIGNITIES`**: **more nuanced than previously
  assumed** — Order 1 (L0.5) is provably NOT the same table as
  `FIGURE_DIGNITIES.moshavHouse`; L2.4's "בית כבוד" concept is
  conceptually linked to `FIGURE_DIGNITIES.maalaHouse` (via the shared
  "Nasir al-Din circle" citation) but numerically inconsistent with it in
  2 of 3 checked cases.
- **Dependency of L2.4 on L0.5**: confirmed precisely — L2.4's casting
  step (not its starting-count step) explicitly and literally names
  Order 1, resolving a previously-vague assumption.
- **GT-3 readiness**: **partially exact today** (p.219, 2 of 16 house-1
  figures, already reproduced by existing code) and **blocked**
  (p.220, a distinct rule with unverifiable arithmetic) — not a single
  uniform readiness state, contrary to how it was previously scoped.
- **Is L0.5 the correct next implementation slice?** — **Not applicable
  in the form the question was asked.** L0.5 does not need
  "implementation" as a next slice — it already exists, in far more
  complete and rigorous form than any prior document in this project
  assumed. The correct "next slice," if one is still wanted after the
  recommended documentation correction (above), would be narrower:
  either (a) targeted source re-verification of the Nasir-al-Din-circle
  gap (ambiguity #4), to responsibly extend `REQUEST_CIRCLE_HONOR_HOUSES`
  beyond 2 figures, or (b) a fresh Golden Test built specifically and
  only around the already-working p.219 fragment (a regression-lock, not
  a gap-closer). Neither is authorized to start by this document.
