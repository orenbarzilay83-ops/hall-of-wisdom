# HALL_WISDOM_KASHF_COMPLETE_BOOK_STRUCTURE_MAP

> Mapping only. No code changed. No Commit/Push/Deploy. No AI call. No UI.
> No catalog entries added. No contradictions resolved.
>
> **Source file (binding, per instruction):** `kashf-hebrew-v56-clean-final.html`
> (uploaded to this session; title in-file: *"חשיפת הסודות הנצורים — בהוצאת
> המחשבות הגנוזות לאור | מהדורה עברית מלאה"*). 4,643,724 bytes, 261 rendered
> `<section class="page">` blocks (1 cover + 3 TOC pages + 256 numbered
> body/appendix pages).

---

## 0. A critical pagination finding (read this before any page number below)

**The book's own printed Table of Contents (front matter) uses a DIFFERENT
page-numbering scheme than the book's own physical page footers** (the
`.pageno` divs rendered at the bottom of each page). This was discovered
and verified independently at **15 separate points** spanning the entire
book (intro through Chapter 8), and is **consistently a +20 offset**:
`real_printed_page = TOC_page + 20`. Examples directly verified:

| Section | TOC page | Real printed page |
|---|---|---|
| מבוא (Intro) | 1 | 21 |
| השער הראשון (Gate 1) | 23 | 43 |
| השער השני (Gate 2) | 34 | 54 |
| השער השלישי (Gate 3) | 84 | 104 |
| השער הרביעי (Gate 4) | 131 | 151 |
| השער החמישי (Gate 5) | 141 | 161 |
| השער השישי (Gate 6) | 146 | 166 |
| הפרק השמיני (Gate 6, Ch.8) | 204 | 224 |
| הפרק העשירי (Gate 6, Ch.10) | 236 | 256 (exact) |
| הפרק השנים־עשר (Gate 6, Ch.12) | 251 | 271 (exact) |

**All page numbers used in this and the other 5 deliverable documents are
the REAL PRINTED page numbers (the `.pageno` footer values), NOT the TOC's
numbers** — and this matches the existing `kashf-al-asrar-book.js`
digitization's own `page:` field, which was spot-verified twice against
this HTML (p.41 six-pillars quote, p.53 witness quote — both matched
exactly). **This means the existing 13-entry rule catalog's page citations
are reliable against this source.** This offset is a book-internal
front-matter/pagination inconsistency, not a code problem — reported here
per the "duplicate passages / apparent contradictions" completeness
requirement, not resolved or chosen between.

---

## 1. Top-level structure (all real page numbers)

| Unit | Page range | Content |
|---|---|---|
| Cover + TOC | (unpaginated) | Cover image, 3-page table of contents (using the OLD/TOC numbering, see §0) |
| הקדמה (Preface) | 21 | Legendary/religious origin story (Daniel, 96 points) — devotional, not a rule |
| פרק בהכאת הקו (Striking the Line) | 23-27 | Ritual/timing preconditions for casting (purity, forbidden times, max-3-questions rule, invocation text) |
| פרק בהוצאת ההכאה (Extracting the Strike) | 28-36 | The mothers→daughters→balances→judge(15th)→outcome(16th) derivation algorithm; 3-part board interpretation (past/present/future); קוטרי/צלעי board-validity classification |
| פרק בחשבון ארבעת היסודות (Four-Elements Arithmetic) | 37-42 | Point-counting/element-tallying system feeding later techniques |
| **השער הראשון — הבתים** (Gate 1: The Houses) | 43-53 | Full 16-house descriptive table (matches CLAUDE.md's existing table exactly) |
| **השער השני — הצורות** (Gate 2: The Figures) | 54-103 | Master figure taxonomy (benefic/malefic/leaning/mixed etc.); all 16 figure profiles (element/animal/color/body-part/poem); **essential-dignities table** (מעלה/מושב/גבול/פנים/שמחה/צער per figure, p.97-99 — NEW, uncatalogued); month-correspondence table (p.100); "שותף ועדות" chapter (p.101-102, = catalog's existing D witness system, verbatim-confirmed); figure alternate-names glossary |
| **השער השלישי — סדרי השיבוץ** (Gate 3: 16 Placement Orders) | 104-151 | 16 fixed figure↔symbol/number correspondence systems — see §2 |
| **השער הרביעי — גילוי הכוונה הנסתרת** (Gate 4: Revealing Hidden Intent / Dhamir) | 151-161 | Author states upfront he brings "5 types FROM AMONG" many ways; core 5-type/8-method structure (p.151-155) PLUS **≥9 additional distinct, named, uncatalogued techniques** (p.156-160) — see Dhamir Complete Map deliverable |
| **השער החמישי** (Gate 5: Four Foundation Figures + misc.) | 161-166 | House-by-house rules for סוהר/חיבור/קהלה/דרך; **"שבעת עדי החכמה"** — a 6th distinct witness system (houses 9-16, majority-rule, p.164, NEW/uncatalogued); figure-proximity effect rules |
| **השער השישי — דין שנים־עשר הבתים** (Gate 6: Judgment on the 12 Houses) | 166-276 | 12 topic chapters — see §3 |
| נספח עזר (Appendix — Astrology Glossary) | unnumbered, after 276 | **Editorial addition, explicitly marked "not part of the source text"** — defines trine/square/sextile/aspect/house/angular-houses/saad-nahs for the modern reader |

---

## 2. Gate 3 — the 16 Placement Orders (שיבוץ), p.104-151

Each order is a fixed figure↔symbol correspondence table with its own
element base-values and mnemonic poem. None contain topic-verdict
formulas — they are infrastructure tables other techniques draw on.

| # | Name | Page | Element base-values (fire/air/water/earth) | Purpose |
|---|---|---|---|---|
| 1 | שיבוץ המושב (Seat) | 104-105 | — | Figure→"home house"; used for movement-analysis and dignity checks |
| 2 | שיבוץ המספר ומשך־הזמן (Number & Duration) | 105-121 | — (3 competing methods) | Timing/monetary-magnitude; includes "לשון העניין" timing sub-technique, Dalail-al-Fasl alternate table, Ḥayati day-count |
| 3 | שיבוץ היסודות (Elements) | 121-132 | 4 competing traditions given (see §4) | Element-nature determination; **feeds the Five Witnesses mechanism (p.130-131)** |
| 4 | שיבוץ המזג (Temperament/Planets) | 133-135 | — | 7-planet groupings; 4-letter alphabet per planet (used in illness diagnosis) |
| 5 | שיבוץ המזלות (Zodiac) | 135-138 | — | 12-sign + node correspondences |
| 6 | שיבוץ האותיות (Letters) | 138-141 | — | Figure→Hebrew/Arabic letter; 2 competing traditions (Arab/Indian vs Greek/Eastern) given in full |
| 7 | שיבוץ אבּדח (Abjad) | 142-143 | 1/2/4/8 | "Length order"; seed for Orders 8-10 |
| 8 | שיבוץ הרוחב (Width) | 143-144 | derived | Subtract 17 (or 1) from Order-7 count |
| 9 | שיבוץ העומק (Depth) | 144-145 | derived | Subtract 16 repeatedly from Order-7/8 |
| 10 | שיבוץ ההשבה (Return) | 145-146 | derived | Recombine length+width+depth |
| 11 | שיבוץ יזדג׳ (Yazdaj) | 146-147 | 2/7/4/8 | Existence-count minus 16 |
| 12 | שיבוץ כדוגמת אבּדח | 148 | 3/6/12/24 (alt: 7/14/28/56) | Abjad-pattern variant |
| 13 | "שיבוץ לבן" (name gap in source) | 149 | 1/10/100/1000 | Decimal-place system |
| 14 | "הדרך נופלת" | 150 | 9/200/10/100 | — |
| 15 | שיבוץ בן־מחפוף אל־מונַג׳ם | 150 | not restated (possible source gap) | Closes the "arithmetic" order-group |
| 16 | *(the 16 orders are counted inclusive of Order-1 through Order-15 plus the closing; see note)* | — | — | Book's own count states "16 orders" (p.104) — cross-check against this table recommended in a future round; Order-15's own base-values were not found restated in the excerpt read, flagged as a possible gap |

**The book itself documents multiple internally-competing traditions**
(אל-זנאתי, אבו סעיד אל-טרבלסי, בעלי הטבעים/"naturalists," אנשי הברבר,
unnamed "others") for several of these orders — sometimes reconciled by
the author, usually not. See the Precedence & Conflict Map deliverable.

---

## 3. Gate 6 — the 12 Topic Chapters, p.166-276

| Ch. | Topic (Hebrew) | Page range | Approx. density (distinct sub-formulas, this-round estimate) |
|---|---|---|---|
| 1 | הנפש (Self) | 166-179 | ~25 (near-exhaustively read) — includes the 5 already-catalogued spiritualDiagnostics formulas (all on p.167) plus a 16-figure decision-oracle table (p.170-171), an odd/even house-parity framework (p.172), a "request lifecycle" house framework, occupation-divination, lifespan-calculation |
| 2 | דיני הממון (Money) | 179-182 | ~10 — confirmed positive cross-reference to existing `kashf-topic-rules.js` money topic |
| 3 | אחים ומעבר (Siblings & Travel) | 182-184 | ~6 |
| 4 | הורים, נכסים, נסתרות (Parents/Property/Hidden Things) | 184-196 | ~15 — includes an elaborate hidden-object-location sub-system (quadrant search, Tamtam al-Hindi method, water-depth-by-figure table) |
| 5 | ילדים והריון (Children & Pregnancy) | 191-196 | ~18 — includes 4-5 internally-competing gender-determination methods (unresolved plurality) |
| 6 | חולה, אבדה, בהמות (Illness/Lost/Animals) | 196-204 | ~20 — includes body-part-by-figure table, animal-type-by-figure table |
| 7 | נישואין וכו׳ (Marriage/Seeker-Sought/Winner-Loser/Buy-Sell) | 204-224 | ~35 (longest chapter) — includes the "מבקש/מבוקש במעגל" technique (directly dependent on the Gate-2 dignities table), city-conquest table, weather/price-forecast insert ("נֻזְהַת אל־עֻקוּל") |
| 8 | גניבה והלוואה (Theft & Loan) | 224-237 | ~30 — includes a full 16-figure thief-description table |
| 9 | מסע, נעדר, אבדה, חלום, חוב (Travel/Missing/Dream/Debt) | 237-255 | ~35 — includes ship-damage table, occupation-by-planet table, a "sub-board recast" technique (houses 13-15 as new mothers) |
| 10 | כבוד, שלטון, שררות, אם (Honor/Authority/Mother) | 256-264 | ~20 — includes a 12-house ruler-condition table, another "sub-board recast" instance (4 angular houses as new mothers) |
| 11 | חברים, תקווה, חיים, אהבה (Friends/Hope/Life/Love) | 264-271 | ~20 — includes friend-type-by-planet table, clothing-color-by-planet table, a livelihood decision-oracle table structurally similar to Ch.1's |
| 12 | אויבים ואסירים (Enemies & Prisoners) | 271-276 | ~20 — includes a prisoner-outcome figure-pair table |

**Recurring cross-chapter patterns identified:** (a) a "decision-oracle
table" pattern (first-figure-to-rise → fixed verdict phrase) appears at
least 3 times (Ch.1 p.170-171, Ch.9's missing-person mod-4 oracle, Ch.11
p.267-269); (b) a "sub-board recast" pattern (take a subset of existing
houses as fresh "mothers," derive an entirely new board) appears at least
twice (Ch.9 p.253, Ch.10 dynasty-continuation); (c) named external-book
insertions recur consistently and are self-attributed in the source text:
"נֻזְהַת אל־עֻקוּל" and "אל־מֻלְתַקַט פי עִלְם א־נֻקַט" — both should be
tagged as attributed-external-source material if ever catalogued, the
same way `dhamirType4External` already is.

---

## 4. Completeness disclosure (per instruction §11 — no "complete"/"full coverage" claims)

- **Pages reviewed:** All 261 rendered page-blocks (cover, 3 TOC pages,
  256 numbered body+appendix pages) were opened and read in sequential
  order. **No section was skipped and no keyword-only search was used** —
  every page's actual paragraph text was read in context.
- **Depth of reading was NOT uniform**, and this is disclosed honestly
  rather than papered over:
  - **Near-exhaustive, clause-by-clause** depth: front matter (p.21-42),
    Gate 1 (p.43-53), Gate 2 (p.54-103), all of Gate 3 (p.104-151), all
    of Gate 4 (p.151-161), all of Gate 5 (p.161-166), and Gate 6 Chapter 1
    (p.166-179).
  - **Condensed, chapter-level-inventory** depth (full sequential reading
    maintained, but individual minor sub-rule variants were summarized
    rather than each transcribed verbatim): Gate 6 Chapters 2 through 12
    (p.179-276), given confirmed extreme density (10-35+ distinct
    formulas per chapter × 11 remaining chapters).
- **Unreadable sections:** none encountered — the HTML source rendered
  cleanly throughout via the custom page-block extractor built for this
  round (Python `html.parser`-based, not a regex/keyword approach).
- **Ambiguous translations / duplicate passages / apparent contradictions:**
  flagged individually throughout this and the companion documents (e.g.
  the §0 pagination offset; Order 15's missing restated base-values;
  Chapter 11's קהלה appearing twice with different verdicts in the same
  table, p.267-269; Chapter 5's 4-5 competing gender-determination
  methods).
- **External-source material:** flagged wherever the book itself names an
  external attributed source (נֻזְהַת אל־עֻקוּל, אל־מֻלְתַקַט פי עִלְם
  א־נֻקַט, דלאיל אל־פצל, אבו סעיד אל־טרבלסי, אל-זנאתי, טמטם ההודי) —
  none of these were silently absorbed as unattributed native content.
- **Hawi material:** none found anywhere in this Kashf source — the two
  books remain confirmed-distinct, consistent with prior audits.
- **Provisional interpretations:** the Gate-3 Order-15 base-value gap and
  the exact figure-list rendering for a few table cells in Gate 6
  Chapters 8-9 (animal-type-by-figure) are marked as needing a targeted
  re-read in a future round — not resolved here.

**This document does NOT claim "complete coverage" of the book's content
at the granular formula level** — it claims complete coverage of the
book's *structure* (every section identified, every chapter's scope
established) with *near-exhaustive* formula-level extraction for roughly
the first third of the book and *inventory-level* extraction for the
remaining two-thirds. See the Session Report for the exact numeric
breakdown.
