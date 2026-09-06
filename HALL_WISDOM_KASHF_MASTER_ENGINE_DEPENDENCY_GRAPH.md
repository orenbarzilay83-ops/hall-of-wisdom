# HALL_WISDOM_KASHF_MASTER_ENGINE_DEPENDENCY_GRAPH

> Planning only. No code changed. No commit/push/deploy. No AI call. No
> UI touched. No catalog record added. This document is built entirely
> from the 6 binding mapping documents (commit `d0f68d9`) — it does not
> re-read the source book and does not introduce any new source claim
> that was not already established there. Where a status below differs
> from a source document's wording, it is a re-labeling for graph
> purposes only, not a new finding.
>
> **Layer boundaries reflect the book's own professional workflow**
> (data → board → general calculation → witness/dhamir evidence → topic
> verdict → strengthen/weaken → final judge → traceability), not
> convenience of file layout. Several engines are cross-cutting and are
> flagged as such where they don't fit one layer cleanly (e.g. the
> קוטרי/צלעי classification is produced in Layer 1 but consumed again,
> differently, inside Layer 3's dhamir branch).

## Resolution-level note (read before Layer 4)

Layers 0-3, 5-7 are documented at the same per-mechanism resolution used
in `HALL_WISDOM_KASHF_SUB_ENGINE_INVENTORY.md` (31 named sub-engines).
Layer 4 (topic formulas) is documented at the same per-question-family
resolution used in `HALL_WISDOM_KASHF_QUESTION_FORMULA_MATRIX.md` (21
families), **not** at the level of individual "כלל מעשי" — the book
contains several hundred of those (see the Session Report's "number of
formulas" disclosure), and a full one-node-per-formula graph was never
in scope for any round so far. This is a resolution choice, disclosed
here, not a completeness claim.

---

## Graph overview (layered)

```
Layer 0 — נתוני יסוד וסיווגים (foundational data & classification)
  L0.1 Figure Taxonomy & Classification
  L0.2 House Table (16 houses)
  L0.3 Essential Dignities Table            [implemented, not fully routed — corrected, see verification report]
  L0.4 Figure-to-Lunar-Month Table          [missing]
  L0.5 Sixteen Placement Orders (1-16)      [implemented, 15/16, corrected — see audit report]
  L0.6 Element Point-Counting Base System(s)
  L0.7 Distance-Measurement System          [missing]
  L0.8 Dalail al-Fasl Alt. L/W/D Table      [missing]
  L0.9 Timing/Duration Scaling Table        [missing]
  L0.10 Figure Names Glossary (reference only)
        │
        ▼
Layer 1 — בניית הלוח והצורות (board & figure construction)
  L1.1 Board Construction (mothers→daughters→balances→judge)
  L1.2 Board Validation (house-15 parity)
  L1.3 Querent-Honesty / Mother-Recurrence Check
  L1.4 קוטרי/צלעי Board Classification
  L1.5 Sub-Board Recast Pattern             [missing]
        │
        ▼
Layer 2 — חישובים כלליים (general-purpose calculations)
  L2.1 לשון העניין (Tongue of the Matter) Timing
  L2.2 Money-Magnitude Table Application
  L2.3 Decision-Oracle General Pattern      [missing]
  L2.4 מבקש/מבוקש במעגל General Technique   [split — Requester(p.219) implemented+routed+exposed; Sought(p.220) unverified/missing]
        │
        ▼
Layer 3 — מנועי עדים ודמיר (witness & dhamir engines)
  L3.A..F  Witness Systems A-F (kept SEPARATE, not merged)
  L3.Dh1..10  Core dhamir (8 methods + additional-way + majority)
  L3.Dh11  Nine Additional Dhamir Techniques (p.156-160) [missing, 9 sub-items]
        │
        ▼
Layer 4 — נוסחאות נושאיות (21 topic/question families)
  L4.1..21  (see Question/Formula Matrix)
        │
        ▼
Layer 5 — חיזוק, החלשה וסתירות (strengthen / weaken / conflict)
  L5.1 "כוח העדים" General Modulation Principle   [ambiguous]
  L5.2 Five-Witnesses Tier-Escalation Logic (part of L3.E)
  L5.3 Dhamir Majority-Decision Scope Question    [unresolved]
  L5.4 Precedence/Conflict Resolution Rule-Set
        │
        ▼
Layer 6 — הכרעה סופית (final verdict assembly)
  L6.1 Judge (House 15) Final Synthesis Role
  L6.2 Final Verdict Assembly Mechanism          [missing]
  L6.3 Narrative/Conclusion Writer (kashf-narrative-writer.js)
        │
        ▼
Layer 7 — Traceability ו-AI Context
  L7.1 candidateBookRules collection
  L7.2 selectedBookRules (kashf-book-rule-selector.js)
  L7.3 evaluatedBookRules (kashf-formula-engine.js / kashf-reading-engine.js)
  L7.4 appliedBookRules
  L7.5 rejectedBookRules / missingRelevantRules / unresolvedRules
  L7.6 sourceEvidence / runtimeEvidence
  L7.7 conflictResolution record
  L7.8 AI-context sanitization (kashf-context-sanitizer.js)
  L7.9 AI Context/Payload Builder            [uncertain, not Kashf-specific this round]
```

Cross-layer back-references (not shown as a straight pipeline because
the book itself does not specify one — see Precedence Map §12.4):
L1.4 (קוטרי/צלעי) is produced in Layer 1 but re-consumed as a branching
condition inside L3.Dh11's diametric/lateral variant. L0.3 (Dignities
Table) is consumed by both L3.E (Layer 3) and L2.4 (Layer 2) — a Layer-0
node feeding both Layer-2 and Layer-3 nodes, which is why Layer 0 sits
below nothing and above everything rather than being folded into Layer 1.

---

## LAYER 0 — נתוני יסוד וסיווגים

### L0.1 — Figure Taxonomy & Classification
| Field | Value |
|---|---|
| Professional purpose | Classify each of the 16 figures as benefic/malefic/leaning, internal/external, fixed/mutable, male/female/androgynous, rising/setting/exalting/descending |
| Source pages | 54-60 |
| Required inputs | Figure identity |
| Produced outputs | Classification tags per figure |
| Depends on | none |
| Depended on by | L1.1, L3.A-F (benefic/malefic counts), L3.Dh1-11, L4.1-21, L5.1 |
| Relevant question families | All 21 |
| Verdict role | Foundational — feeds nearly every downstream benefic/malefic judgment |
| Current implementation status | `verified-complete` at the classification-taxonomy level |
| Current tests | None identified this round (no test-suite inspection performed) |
| Source traceability | `sourced` — matches `kashf-figure-classifier.js`'s categorization per this round's file inspection |
| Unresolved source issues | None found for the taxonomy itself; the recurring "וכוח העדים" qualifier attached to figure-quality modulation (p.55-58) is a downstream ambiguity, not a taxonomy defect — tracked at L5.1 |

### L0.2 — House Table (16 houses)
| Field | Value |
|---|---|
| Professional purpose | Define each house's domain, direction, element, angularity, body part, significations |
| Source pages | 43-53 |
| Required inputs | none (static table) |
| Produced outputs | 16 house-definition records |
| Depends on | none |
| Depended on by | L1.1-1.5, L3.C/D, L4.1-21 |
| Relevant question families | All 21 |
| Verdict role | Foundational |
| Current implementation status | `verified-complete` — confirmed to match CLAUDE.md's own documented house table exactly |
| Current tests | None identified this round |
| Source traceability | `sourced` |
| Unresolved source issues | House 15's third name "מראת הרמל" (mirror of the sand) newly confirmed this round, not previously documented in code comments — a documentation gap, not a data gap |

### L0.3 — Essential Dignities Table
> **Status corrected in a later verification round** (see
> `HALL_WISDOM_KASHF_ESSENTIAL_DIGNITIES_EXISTING_DATA_VERIFICATION_REPORT.md`):
> this table was already implemented, as `FIGURE_DIGNITIES` in
> `goral-hachol/data/sources/kashf-al-asrar/kashf-figure-attributes-gate2.js`,
> at the time this document was first written — the `missing` status
> below was a mapping-round research gap, not an accurate code-state
> finding. Corrected fields are marked below; the rest of this node's
> original content is left as originally written.

| Field | Value |
|---|---|
| Professional purpose | Per-figure exaltation/domicile/bound/face/joy/fall/temperament-pairing, expressed as house numbers |
| Source pages | 97-99 |
| Required inputs | Figure identity |
| Produced outputs | 7 house-number values per figure |
| Depends on | none |
| Depended on by | L3.E (Five Witnesses) — not yet wired; L2.4 (מבקש/מבוקש במעגל) — not yet wired; **Dhamir Type 2 (element-prevalence) — already wired**, via `FIGURE_MAALA_HOUSE` derived from this table in `kashf-dhamir.js` |
| Relevant question families | Indirectly, whichever families use L3.E or L2.4 (still not implemented); directly, dhamir-general (already consumed) |
| Verdict role | Indirect infrastructure |
| Current implementation status | **`implemented` + `source-verified`** — 14 of 16 figures have full dignity data (100%-verified against the source, 98/98 values, see the verification report); the other 2 (דרך, חיבור) are correctly documented as absent from the source itself, not a digitization gap. **Currently consumed by Dhamir Type 2; not yet routed to L3.E or L2.4** — `implemented-but-not-fully-routed`, not `missing` |
| Current tests | `_test_kashf_essential_dignities_table.mjs` (GT-10) — 196/196 assertions passing |
| Source traceability | `sourced`, fully verified (this table's own content, independently re-extracted and diffed 98/98 exact match) |
| Unresolved source issues | None on the table's own content; its NOT-YET-WIRED downstream consumers (E, מבקש/מבוקש) remain unimplemented — that is a routing gap in those two engines, not in L0.3 itself |

### L0.4 — Figure-to-Lunar-Month Table
| Field | Value |
|---|---|
| Professional purpose | Islamic lunar month correspondence per figure |
| Source pages | 100 |
| Required inputs | Figure identity |
| Produced outputs | Month name |
| Depends on | none |
| Depended on by | none identified this round (no consuming technique found in the pages read) |
| Relevant question families | Timing-adjacent families generally (no specific family confirmed to invoke it) |
| Verdict role | Timing refinement only, if ever wired in |
| Current implementation status | `missing` — matches CLAUDE.md's own documented gap ("Islamic lunar calendar integration for timing — Not Yet Implemented") |
| Current tests | none |
| Source traceability | `sourced` |
| Unresolved source issues | None on content; its intended consumer within the book was not identified this round |

### L0.5 — Sixteen Placement Orders (1-16)
> **STATUS CORRECTED** in a later verification round (see
> `HALL_WISDOM_KASHF_L0_5_SIXTEEN_PLACEMENT_ORDERS_AUDIT.md`): a
> 934-line existing file, `kashf-shibutzim.js`, already contains 15 of
> the claimed 16 orders, each with explicit source citations — this was
> not found when this document was first written. No new data file is
> needed. The `missing` status below was a research gap, not an
> accurate code-state finding.

| Field | Value |
|---|---|
| Professional purpose | 16 distinct figure↔position/value permutations feeding naming, timing, letter-magic, distance, money-magnitude techniques |
| Source pages | 104-151 (15 confirmed orders); 189 (candidate 16th, different chapter, unresolved) |
| Required inputs | Figure identity (per order) |
| Produced outputs | Position/value per order |
| Depends on | Order 7 seeds Orders 8-12 (internal dependency within this node) |
| Depended on by | L2.1 (לשון העניין, uses Order-6 letters), L2.2 (money-magnitude, Order 2's alternate column), L2.4 (Order 1 seat-placement — **confirmed by exact source wording, not assumed**) |
| Relevant question families | Money (indirectly), any timing/naming-adjacent family |
| Verdict role | Infrastructure only |
| Current implementation status | **`implemented-data-layer` + `source-verified-for-15-orders` + `one-order-unresolved` + not-fully-routed-to-all-dependent-engines** (not `missing`) — 15 of 16 orders exist as `kashf-shibutzim.js` exports, each with `sourceStatus`/`sourceRef`; Orders 1, 2 (canonical number), 3 (element values) are already live in Dhamir Type 2; Order 1 is already live, routed, and exposed inside a working fragment of L2.4 (see L2.4 node below) |
| Current tests | None dedicated to L0.5 as a whole; local read/execution checks performed this round (see the L0.5 audit and precommit report) confirm `SHIBUTZ_1_MOSHAV` reproduces the p.219 worked examples exactly via `computeRequesterCircleHouse` |
| Source traceability | `sourced` for 15 orders, each independently cross-verified this round against a fresh raw-HTML re-extraction (Order 1 confirmed exact match). Order 15 confirmed (not merely suspected) to have no stated element base-values or reduction method anywhere in the source — a genuine content gap, not an extraction gap |
| Unresolved source issues | Order 15's missing method; the book's own "16 orders" claim vs. only 15 headed within Gate 3 (a p.189 candidate 16th exists in a different chapter, unconfirmed); p.128-129 pairing gap; Order 3's 4-way element-value dispute (see L5.4); **newly found**: Order 1 is confirmed to be a different book tradition from `FIGURE_DIGNITIES.moshavHouse` (7 of 14 comparable figures disagree) — the two must never be merged |

### L0.6 — Element Point-Counting Base System(s)
| Field | Value |
|---|---|
| Professional purpose | Per-line elemental point values (fire/air/water/earth), numeric substrate for downstream techniques |
| Source pages | 37-39 (base), 126 (4-way comparison), 130 (5th variant), 142 (Order 7 reuse) |
| Required inputs | Figure line pattern |
| Produced outputs | Integer point total |
| Depends on | none |
| Depended on by | L1.1 (indirectly), L3.E, L3.Dh1-11 (several), L2.2, L4.1-21 (several) |
| Relevant question families | Money, several others using point-count majority tests |
| Verdict role | Infrastructure |
| Current implementation status | `implemented-without-source-traceability` — code likely exists inside `kashf-dhamir.js`'s internal helpers, exact base (1/2/4/8) not verified against code this round |
| Current tests | none identified |
| Source traceability | `sourced` for the book side; **4 competing numeric traditions exist and are not fully reconciled by the book** (see L5.4) |
| Unresolved source issues | See L5.4 — which of the 4 traditions is "the" base for any given consuming technique is not always stated |

### L0.7 — Distance-Measurement System
| Field | Value |
|---|---|
| Professional purpose | שיבר/אמה/פישוק ידיים/פרסה units keyed to mothers/daughters/born/balances |
| Source pages | 121 |
| Depends on | none |
| Depended on by | none identified this round |
| Verdict role | Infrastructure, unused elsewhere in the pages read |
| Current implementation status | `missing` |
| Source traceability | `sourced` |
| Unresolved source issues | None on content; no confirmed consumer found |

### L0.8 — Dalail al-Fasl Alternate Length/Width/Depth Table
| Field | Value |
|---|---|
| Professional purpose | Alternate per-figure L/W/D/N numbering, explicitly attributed to another book |
| Source pages | 114-116; reused at 185-190 for hidden-object depth-measurement |
| Depends on | none |
| Depended on by | L4.8 (parentsProperty/hiddenTreasure family, hidden-object depth technique) |
| Verdict role | Infrastructure for one topic family |
| Current implementation status | `missing` |
| Source traceability | `sourced`, external-attributed — must be tagged as attributed-external if ever catalogued (matches the existing dhamir-Type-4-external tagging precedent) |
| Unresolved source issues | None on content |

### L0.9 — Timing/Duration Scaling Table
| Field | Value |
|---|---|
| Professional purpose | mothers=days, daughters=weeks, born=months, balances=years scaling for timing verdicts |
| Source pages | 110, 118 (confirmed again), 178 (topic-specific lifespan reuse) |
| Depends on | none |
| Depended on by | L4.1 (Self/lifespan-calculation sub-rule) |
| Verdict role | Timing infrastructure |
| Current implementation status | `missing` |
| Source traceability | `sourced` |
| Unresolved source issues | None on content |

### L0.10 — Figure Names Glossary (reference only)
| Field | Value |
|---|---|
| Professional purpose | Alternate/esoteric Arabic-transliterated figure names |
| Source pages | 102-103 |
| Depends on | none |
| Depended on by | none — naming reference only, not a rule |
| Verdict role | None — explicitly non-computational |
| Current implementation status | `missing` (as a glossary artifact); irrelevant to verdict logic |
| Source traceability | `sourced` |
| Unresolved source issues | None |

---

## LAYER 1 — בניית הלוח והצורות

### L1.1 — Board Construction
| Field | Value |
|---|---|
| Professional purpose | Mothers → daughters → balances (×2) → judge (house 15) → house 16, from 4 struck mother-lines |
| Source pages | 28-36 |
| Required inputs | 4 mother figures |
| Produced outputs | Full 16-house board |
| Depends on | L0.1, L0.2 |
| Depended on by | Every Layer 2-6 node |
| Relevant question families | All 21 |
| Verdict role | Structural prerequisite, no direct verdict |
| Current implementation status | `implemented-without-source-traceability` — `raml-board-generator.js` structurally matches the algorithm shape; no line-by-line cross-check performed against p.28-36 this round or any prior round |
| Current tests | Not identified this round |
| Source traceability | `sourced`; code-side traceability unverified |
| Unresolved source issues | None on the book side |

### L1.2 — Board Validation (house-15 parity)
| Field | Value |
|---|---|
| Professional purpose | Reject invalid casts (house 15 must be even) |
| Source pages | 34 |
| Depends on | L1.1 |
| Depended on by | Gates all downstream processing |
| Verdict role | Gate, no verdict content itself |
| Current implementation status | `ambiguous` — plausibly implemented under an unconfirmed name in `raml-board-generator.js` |
| Source traceability | `sourced`; code traceability unconfirmed |
| Unresolved source issues | None |

### L1.3 — Querent-Honesty / Mother-Recurrence Check
| Field | Value |
|---|---|
| Professional purpose | Flag dishonest/bad-faith questions if none of the 4 mother-only figures recur anywhere in the cast |
| Source pages | 35 |
| Depends on | L1.1 |
| Depended on by | none confirmed |
| Verdict role | Colors overall reading reliability |
| Current implementation status | `ambiguous` — possibly `computeQuerentHonestyCheck` per prior-round audit notes, not re-verified against code this round |
| Source traceability | `sourced`; code traceability unconfirmed |
| Unresolved source issues | None |

### L1.4 — קוטרי/צלעי Board Classification
| Field | Value |
|---|---|
| Professional purpose | Classify board via house-15 parentage parity; feeds a distinct dhamir-specific branch |
| Source pages | 34 (general), 157-158 (dhamir reuse) |
| Depends on | L1.1 |
| Depended on by | L3.Dh11's diametric/lateral variant |
| Verdict role | Classificatory; general role beyond the dhamir branch not established by the source read this round |
| Current implementation status | `missing` |
| Source traceability | `sourced` |
| Unresolved source issues | The general (non-dhamir) use of this classification, beyond board validity and the one dhamir branch, is not established — flagged, not invented |

### L1.5 — Sub-Board Recast Pattern
| Field | Value |
|---|---|
| Professional purpose | Take a subset of the existing board's houses and re-derive an entirely new sub-board using them as fresh "mothers" |
| Source pages | 253 (missing-person, houses 13-15), ~262 (dynasty-continuation, 4 angular houses) |
| Depends on | L1.1 (re-invokes the same construction algorithm on a house subset) |
| Depended on by | L4.16 (missingPerson), L4.19 (authorityState) |
| Verdict role | Feeds a topic-specific sub-verdict |
| Current implementation status | `missing` |
| Source traceability | `sourced`, procedurally described in both instances; not fully numerically worked in either excerpt read |
| Unresolved source issues | Whether this is a general-purpose technique applicable beyond these 2 confirmed instances is not stated by the source — flagged as an open architectural question, not resolved |

---

## LAYER 2 — חישובים כלליים

### L2.1 — לשון העניין (Tongue of the Matter) Timing Technique
| Field | Value |
|---|---|
| Professional purpose | Derive a timing figure via house-8-from-intent struck against houses 5&9 |
| Source pages | 112, 119-120 (extended arithmetic) |
| Depends on | L0.5 (Order 6 letters, for the extended variant) |
| Depended on by | Any topic needing fulfillment-timing (not confirmed wired to any specific family this round) |
| Verdict role | Timing refinement |
| Current implementation status | `implemented-without-source-traceability` — `kashf-leshon-hainyan.js` (93 lines) plausibly matches by filename; algorithm body not verified against p.112/119-120 this round |
| Source traceability | `sourced`; code traceability plausible but unconfirmed |
| Unresolved source issues | None on content |

### L2.2 — Money-Magnitude Table Application
| Field | Value |
|---|---|
| Professional purpose | House1=1 dirham...house16=136 dirhams (+ alternate 9-16 scaling column) |
| Source pages | 111 |
| Depends on | L0.2, L0.6 |
| Depended on by | L4.6 (money family) |
| Verdict role | Direct magnitude estimate |
| Current implementation status | `implemented-without-source-traceability` — likely `computeMoneyMagnitudeKashf`, exact table cross-check not performed this round |
| Source traceability | `sourced`; code traceability plausible but unconfirmed |
| Unresolved source issues | None |

### L2.3 — Decision-Oracle General Pattern
| Field | Value |
|---|---|
| Professional purpose | Cast (or repeat-cast) until one figure emerges, look up a fixed verdict phrase in a full 16-figure table — general-purpose, not topic-bound |
| Source pages | 170-171 (21-cast method), 248-253 (missing-person mod-4 variant), 267-269 (livelihood-oracle table) |
| Depends on | L1.1, L0.1 |
| Depended on by | L4.4 (as its own family), L4.16, L4.20 |
| Verdict role | Direct, standalone verdict |
| Current implementation status | `missing` |
| Source traceability | `sourced`; **p.267-269's table has a flagged internal inconsistency (קהלה appears twice with different verdicts), not resolved by the source and not resolved here** |
| Unresolved source issues | קהלה double-entry (p.267-269); relationship to topic-formulas when both apply to the same question is not stated (see L5.4) |

### L2.4 — מבקש/מבוקש במעגל (Seeker/Sought via the Circle) General Technique
> **STATUS CORRECTED and SPLIT** in a later verification round (see
> `HALL_WISDOM_KASHF_L0_5_SIXTEEN_PLACEMENT_ORDERS_AUDIT.md`). This is
> two distinct rules, not one — a "מבקש" (Requester) rule (p.219) and a
> "מבוקש" (Requested) rule (p.220) — with genuinely different
> implementation status. Also corrected: the counting/casting step uses
> **Order 1 by name, confirmed via exact source wording** ("על פי סדר
> השיבוץ של המושב"), not the Essential Dignities Table's מושב field —
> the "Depends on L0.3" line below was an unverified assumption, now
> replaced.

**L2.4A — Requester (מבקש), p.219**
| Field | Value |
|---|---|
| Professional purpose | Count from a figure's "house of honor" to house 1; cast that count from house 1 via Order 1's sequence; judge the seeker's strength by the landed house |
| Source pages | 219 |
| Depends on | L0.5 (Order 1, for the casting step — confirmed); a distinct, only-2-of-16-figures-verified "house of honor" table (`REQUEST_CIRCLE_HONOR_HOUSES`) for the starting count — **conceptually linked to, but numerically inconsistent with, `FIGURE_DIGNITIES.maalaHouse` in 1 of 2 checked cases** |
| Depended on by | L4.13 (tradeBuySellPricing family, via the `commerce` topic) |
| Verdict role | Direct, topic-specific |
| Current implementation status | **`implemented` + `routed` + `exposed` + `source-example-reproduced`** — `computeRequesterCircleHouse` / `computeRequesterCircleStrengthKashf` (`kashf-shibutzim.js` / `kashf-book-additions.js`), registered under the `commerce` topic in `kashf-topic-rules.js` (`id: 'requester-circle-strength'`), dispatched via `kashf-reading-engine.js`'s function table. Confirmed by direct execution this round to reproduce both p.219 worked examples exactly (8→10→house10; 12→6→house6). Correctly returns `null`, not a guess, for the other 14 house-1 figures |
| Source traceability | `sourced`, both worked examples independently reproduced |
| Unresolved source issues | `REQUEST_CIRCLE_HONOR_HOUSES` covers only 2 of 16 figures; extending it requires resolving the "house of honor" vs. `maalaHouse` numeric inconsistency (not resolved) |

**L2.4B — Requested (מבוקש), p.220**
| Field | Value |
|---|---|
| Professional purpose | Judge whether the sought thing/person will be attained, via a related but distinct circle-counting rule |
| Source pages | 220 |
| Depends on | Unclear — the one worked example's arithmetic (ממון יוצא, "house of honor"=4) does not resolve under any counting interpretation tried, by either this round or a prior one |
| Depended on by | Not confirmed to feed any implemented family |
| Verdict role | Direct, if it could be reproduced |
| Current implementation status | **`unverified` / `unresolved` / `missing`** — no implementation anywhere in the repo (confirmed by `grep`); not merely unbuilt but genuinely blocked, since even the source's own example does not check out |
| Source traceability | `sourced` in the sense of being quoted, but not `verified` — its own arithmetic is internally inconsistent |
| Unresolved source issues | The worked example's numbers do not resolve; this is a source-level problem, not an implementation gap closeable by more careful coding |

---

## LAYER 3 — מנועי עדים ודמיר

**Instruction compliance note**: the 6 witness systems below are kept as
6 separate nodes, each with its own activation conditions and
dependencies, exactly as required — no merged "Witness Engine" is
proposed anywhere in this document.

### L3.A — Witness System A (Six Pillars, foundational concept list)
| Field | Value |
|---|---|
| Professional purpose | Enumerates 6 foundational witness-concepts (degrees, witnesses, joining, participation, temperament, blending) |
| Source pages | 41 |
| Depends on | none |
| Depended on by | Conceptually underlies B-F, but no explicit source statement makes B-F formally derive from A |
| Relevant families | All (as background concept) |
| Verdict role | None directly — conceptual foundation, not a scorer |
| Current implementation status | `implemented-not-exposed`/n-a — catalogued (`kashf-book-rule-catalog.js`), not implementable as a single function by its own nature |
| Source traceability | `sourced`, verbatim-confirmed |
| Unresolved source issues | None |

### L3.B — Witness System B (Trine/aspect note)
| Field | Value |
|---|---|
| Source pages | 43, 45 |
| Depends on | none |
| Depended on by | none confirmed |
| Verdict role | Evidence, degree unclear |
| Current implementation status | `blocked-by-source-ambiguity` — trine content catalogued and sourced; square/sextile named at p.43 but not content-verified in any round to date |
| Source traceability | Partial — trine confirmed, square/sextile unconfirmed |
| Unresolved source issues | Full aspect taxonomy at p.43-45 not re-checked this round |

### L3.C — Witness System C (basic house 13/14/15 testimony)
| Field | Value |
|---|---|
| Source pages | 53 |
| Depends on | L1.1 (houses 13-15 exist by construction) |
| Depended on by | Structurally present in every reading |
| Verdict role | Evidence |
| Current implementation status | `implemented-not-routed`/structural — exists because houses 13-15 exist, not as a discrete scoring function; catalogued and verbatim-sourced |
| Source traceability | `sourced`, verbatim-confirmed twice (prior round + this round) |
| Unresolved source issues | None |

### L3.D — Witness System D (extended house-testimony)
| Field | Value |
|---|---|
| Source pages | 101-102 |
| Depends on | L1.1 |
| Depended on by | Structurally present |
| Verdict role | Evidence |
| Current implementation status | Same structural status as L3.C |
| Source traceability | `sourced`, verbatim-confirmed word-for-word this round |
| Unresolved source issues | Relationship between C and D is not explained by the source (both are house-testimony schemes with different scope) — flagged historically, not resolved this round either |

### L3.E — Witness System E (Five Witnesses, degree-scoring)
| Field | Value |
|---|---|
| Professional purpose | 5-tier scored witness strength (בית=5,שררה=4,גבול=3,שלישות=2,פנים=1) via Fire+Earth mod-12 pole-point walk |
| Source pages | 130-131 |
| Depends on | L0.3 (Essential Dignities Table), L0.6 (element points), L1.1 |
| Depended on by | none yet (nothing implemented consumes it) |
| Verdict role | Strengthens/weakens whatever verdict it's attached to (not stated which) |
| Current implementation status | `missing`; previously catalogued only as "unresolved, no house numbers" — now fully specified but still uncatalogued and unimplemented |
| Source traceability | `sourced`, full mechanism recovered this round |
| Unresolved source issues | Counter-tradition (בעלי הטבעים) rejects the whole apparatus with a simpler element-counting equivalent — not reconciled; "active disagreement between tiers" case not addressed by source (Precedence Map §5.1) |

### L3.F — Witness System F (Seven Witnesses of Wisdom)
| Field | Value |
|---|---|
| Professional purpose | Houses 9-15 (+16 for dhamir) majority-rule (benefic vs malefic) |
| Source pages | 164 |
| Depends on | L0.1, L1.1 |
| Depended on by | none |
| Verdict role | Direct majority-verdict evidence |
| Current implementation status | `missing` |
| Source traceability | `sourced`, fully specified, newly found this round |
| Unresolved source issues | Relationship to systems A-E not stated by source |

### L3.Dh1-4 — Core Dhamir Type 1, Faces 1/2/4 (Length, Width, Jawharayn)
| Field | Value |
|---|---|
| Source pages | 151-155 |
| Depends on | L1.1, L0.6 |
| Depended on by | L3.Dh10 (majority decision) |
| Verdict role | Hidden-intent reveal, feeds majority aggregation |
| Current implementation status | `implemented-but-unverified` — `computeDhamirMizan`, `computeDhamirHarkatAlArd`, `computeDhamirJawharayn` all confirmed present in `kashf-dhamir.js`; calculation correctness, activation timing, and verdict-impact not re-tested this round (prohibited) |
| Source traceability | `sourced`, re-verified exactly against the new source this round with no discrepancies in description |
| Unresolved source issues | None |

### L3.Dh3 — Core Dhamir Type 1, Face 3 (Depth Movement)
| Field | Value |
|---|---|
| Source pages | 151-155 |
| Depends on | L1.1 |
| Depended on by | L3.Dh10 |
| Current implementation status | `missing` per this round's direct inspection of `kashf-dhamir.js`'s 6 exports (none named for Face 3) — **this contradicts a prior-round working note claiming this was implemented**; flagged as a discrepancy requiring a targeted code re-check, not resolved here |
| Source traceability | `sourced` |
| Unresolved source issues | Code-side discrepancy, not a source issue |

### L3.Dh5 — Core Dhamir Type 2 (Element Prevalence + refinement clause)
| Field | Value |
|---|---|
| Source pages | 151-155 |
| Depends on | L0.6, L1.1 |
| Depended on by | L3.Dh10 |
| Current implementation status | `implemented-but-unverified` for the core mechanism (`computeDhamirElementPrevalence`); `implemented-without-source-traceability` for the specific "root vs walk-path, two-witnesses-stronger" refinement clause |
| Source traceability | `sourced` |
| Unresolved source issues | None on content; "whichever is stronger in its place" tie-rule has no further formula (Precedence Map §2.2) |

### L3.Dh6 — Core Dhamir Type 3 (Mothers-Arithmetic)
| Field | Value |
|---|---|
| Source pages | 151-155 |
| Depends on | L1.1 |
| Depended on by | L3.Dh10 |
| Current implementation status | `blocked-by-source-ambiguity`-adjacent — actually `ambiguous` at the code level: `computeDhamirDoubledSquare` may implement this method under a different name, not confirmed |
| Source traceability | `sourced` |
| Unresolved source issues | None on content; code-name mismatch needs a targeted body-read |

### L3.Dh7 — Core Dhamir Type 4 (Opening/Abjad, external-tagged)
| Field | Value |
|---|---|
| Source pages | 151-155 |
| Depends on | L0.6 |
| Depended on by | L3.Dh10 |
| Current implementation status | `implemented-but-unverified` — dedicated file `kashf-dhamir-type4-external.js`, correctly tagged as external-attributed |
| Source traceability | `sourced` |
| Unresolved source issues | None — this is the model pattern for future external-attributed material |

### L3.Dh8 — Core Dhamir Type 5 (Circle-Closure)
| Field | Value |
|---|---|
| Source pages | 151-155 |
| Depends on | L1.1 |
| Depended on by | L3.Dh10 |
| Current implementation status | `missing`, consistent with prior-round notes |
| Source traceability | `sourced` |
| Unresolved source issues | Distinct from L3.Dh11's "דרך המעגל" variant despite the similar "circle" name — must not be conflated |

### L3.Dh9 — "Additional Way" (house-1 sevenths)
| Field | Value |
|---|---|
| Source pages | 155 |
| Depends on | L1.1 |
| Depended on by | L3.Dh10 (unclear whether it's included in the majority vote — see L5.3) |
| Current implementation status | `missing`/`ambiguous` |
| Source traceability | `sourced` |
| Unresolved source issues | Distinguishing true vs metaphorical joining/release not formally specified as a decision rule |

### L3.Dh10 — Dhamir Majority Decision (aggregation)
| Field | Value |
|---|---|
| Professional purpose | Decide by majority among computed dhamir method results |
| Source pages | 155 |
| Depends on | L3.Dh1-9 (whichever subset is actually run — scope unresolved, see L5.3) |
| Depended on by | L4 topic verdicts that reference dhamir |
| Current implementation status | `implemented-but-unverified` — `computeDhamirByMajority` confirmed present |
| Source traceability | `sourced` |
| Unresolved source issues | Scope of the majority vote (8 core only, or including the 9 additional techniques) not specified by source — see L5.3 |

### L3.Dh11 — Nine Additional Dhamir Techniques (p.156-160)
| Field | Value |
|---|---|
| Professional purpose | 9 separately-named alternate hidden-intent-revealing techniques: מיזוג הצורות (mod-8 figure-pairing), דרך המעגל (circle-way, distinct from Type 5), קוטרי/צלעי branching (2 variants), letters+10 mod-12, house-1/15 repetition check, angular-points derived-figure, houses-9-12 heads+feet combination, houses-1/4/7/10 heads combination, 3 numeric-reduction "poetic" variants (mod 8/9/12) |
| Source pages | 156-160 |
| Depends on | L1.1; L1.4 (for the קוטרי/צלעי variant); L0.5 Order 6 (for the letters+10 variant) |
| Depended on by | none (leaf techniques, not consumed elsewhere) |
| Relevant families | dhamir-adjacent, not topic-bound |
| Verdict role | Alternate hidden-intent reveal, unclear whether/how folded into L3.Dh10's majority |
| Current implementation status | `missing`, all 9 |
| Source traceability | `sourced`, fully described; several share a "sum points, reduce by modulus N" family resemblance rather than being 9 wholly independent algorithms |
| Unresolved source issues | Book itself frames some as "not revealed to everyone" (esoteric framing, p.158) — a soft signal against routine inclusion in majority voting, not a formal exclusion rule (see Precedence Map §11.2) |

---

## LAYER 4 — נוסחאות נושאיות (21 question families)

| # | Family `[provisional]` | Source pages | Depends on (Layers 0-3) | Verdict role | Implementation status | Source traceability |
|---|---|---|---|---|---|---|
| L4.1 | spiritualDiagnostics | 167 | L1.1, L0.6 | Direct verdict | `implemented-but-unverified` (catalogued+coded, not re-tested) | `sourced` |
| L4.2 | connectionTypeByElement | 167 | L4.1's resultant figure | Sequential sub-verdict | `implemented-but-unverified` | `sourced` |
| L4.3 | matterTrueAndDirectedAtMe | 167 | L1.1, L0.6 | Direct verdict | `implemented-but-unverified` | `sourced` |
| L4.4 | decisionOracleSixteenFigure | 170-171 | L2.3 | Standalone verdict | `missing` (L2.3 itself missing) | `sourced` |
| L4.5 | completion | 173 | L1.1 | Direct verdict | `implemented-but-unverified`, confirmed exact match to `kashf-topic-rules.js` | `sourced` |
| L4.6 | money | 179-182 | L1.1, L2.2, L0.6 | Direct verdict | `implemented-but-unverified`, confirmed exact match (primary/alt formula + `computeMoneySourceKashf`) | `sourced` |
| L4.7 | siblingsAndTravelShort | 182-184 | L1.1 | Direct verdict | `partially-implemented` — topicIds `siblings`/`relocation` exist, formula-level cross-check not performed | `sourced` |
| L4.8 | parentsPropertyHidden | 184-196 | L1.1, L0.8 | Direct verdict + multi-method hidden-object location sub-system | `partially-implemented` — topicIds exist, ~8-method hidden-object sub-system not verified against code | `sourced` |
| L4.9 | childrenPregnancy | 191-196 | L1.1 | Direct verdict | `blocked-by-source-ambiguity` — 4-5 competing gender-determination methods not reconciled by the book itself | `sourced` but internally ambiguous |
| L4.10 | illnessLostAnimals | 196-204 | L1.1 | Direct verdict + 2 lookup tables (body-part, animal-type) | `partially-implemented` | `sourced` |
| L4.11 | marriageSeekerSought | 204-212 | L1.1, L0.3(indirect via marriage figure-character rules) | Direct verdict | `partially-implemented` | `sourced` |
| L4.12 | winnerLoser | 212-217 | L1.1 | Direct verdict | `partially-implemented` | `sourced` |
| L4.13 | tradeBuySellPricing | 217-224 | L1.1, L2.4A (implemented, routed, exposed — corrected), L2.4B (unresolved), L0.5 | Direct verdict | `partially-implemented` — the Requester (L2.4A) half is already live and reachable via the `commerce` topic; the Requested (L2.4B) half is unresolved at the source level, not just unbuilt | `sourced`, p.219 fully reproduced; p.220 does not verify |
| L4.14 | theftAndLoan | 224-237 | L1.1 | Direct verdict + description table | `partially-implemented` | `sourced` |
| L4.15 | travel | 237-247 | L1.1 | Direct verdict + ship-damage table | `partially-implemented` (topicId "likely catalogued," not verified this round) | `sourced` |
| L4.16 | missingPerson | 248-253 | L1.1, L1.5, L2.3 | Direct verdict | `partially-implemented`; sub-board-recast and decision-oracle dependencies unimplemented | `sourced` |
| L4.17 | lineageOccupationDream | 254-255 | L1.1 | Direct verdict + occupation table | `partially-implemented` | `sourced` |
| L4.18 | debtPromise | 255-256 | L1.1 | Direct verdict | `partially-implemented` | `sourced`, 2 external-attributed sources cited, not reconciled |
| L4.19 | authorityState | 256-264 | L1.1, L1.5 | Direct verdict + 12-house table | `partially-implemented`; sub-board-recast dependency unimplemented | `sourced` |
| L4.20 | friendsHopeLifeLove | 264-271 | L1.1, L2.3 | Direct verdict + 2 lookup tables | `blocked-by-source-ambiguity` for the livelihood-oracle table (קהלה double-entry); otherwise `partially-implemented`. TopicId `friendsHope` confirmed to already exist in code | `sourced` |
| L4.21 | enemiesPrisoners | 271-276 | L1.1 | Direct verdict + prisoner-outcome table | `partially-implemented` | `sourced` |

Cross-cutting: witness systems A-F (Layer 3) are almost never invoked BY
NAME inside any Layer-4 node's own formula text — the generic "לפי כוח
העדים" phrase recurs instead (see L5.1). Dhamir (Layer 3) is confirmed
topic-independent — no Layer-4 node shows a topic-specific dhamir
invocation.

---

## LAYER 5 — חיזוק, החלשה וסתירות

### L5.1 — "כוח העדים" General Modulation Principle
| Field | Value |
|---|---|
| Professional purpose | General statement that witnesses modulate verdict outcomes |
| Source pages | 55-58 (repeated), recurring throughout Gate 6 |
| Depends on | One or more of L3.A-F (unspecified which) |
| Depended on by | Implicitly, most of Layer 4 |
| Current implementation status | `blocked-by-source-ambiguity` — the book does not specify which witness system this phrase invokes in any given context |
| Source traceability | `sourced` for the phrase's recurrence; not resolvable to a specific system without inventing a resolution |
| Unresolved source issues | The single largest cross-cutting ambiguity in the whole map (Precedence Map §1.2, §5.2) |

### L5.2 — Five-Witnesses Tier-Escalation Logic
Cross-reference only — full detail at L3.E. Included here because its
"N witnesses stronger than N-1" language is itself a strengthening rule,
not merely a scoring mechanism. No new fields; see L3.E.

### L5.3 — Dhamir Majority-Decision Scope Question
| Field | Value |
|---|---|
| Issue | Whether L3.Dh10's majority vote is meant to run over the 8 core methods only, or also the 9 additional p.156-160 techniques |
| Source pages | 155 (rule), 156-160 (additional techniques, with soft "esoteric" framing for at least one) |
| Current status | `blocked-by-source-ambiguity` |
| Unresolved source issues | Precedence Map §7.1 — not resolved by the source, not resolved here |

### L5.4 — Precedence/Conflict Resolution Rule-Set
| Field | Value |
|---|---|
| Professional purpose | Everything the book DOES and DOES NOT specify about tie-breaking, override, and cross-system reconciliation |
| Source pages | See `HALL_WISDOM_KASHF_PRECEDENCE_AND_CONFLICT_MAP.md` in full — 12 sub-sections, 8 confirmed unresolved relationships |
| Depends on | L3.A-F, L3.Dh1-11, L4.1-21 |
| Depended on by | L6.1, L6.2 |
| Current implementation status | `missing` as a unified mechanism — no code path found that implements cross-system precedence |
| Source traceability | `sourced` for what IS resolved (e.g. Order 4's planet dispute, Order 2's seat-exception rule); explicitly `blocked-by-source-ambiguity` for what is NOT (6-witness-system reconciliation, primary-vs-alt-formula tie-break, topic-vs-witness conflict, universal calculation order) |
| Unresolved source issues | See Precedence Map's Summary section — 8 items, the largest being witness-system cross-reconciliation |

---

## LAYER 6 — הכרעה סופית

### L6.1 — Judge (House 15) Final Synthesis Role
| Field | Value |
|---|---|
| Professional purpose | Structural final-synthesis figure (balance-of-balances) |
| Source pages | 28-36, 43-53 |
| Depends on | L1.1 |
| Depended on by | Implicitly all verdicts, by construction |
| Current implementation status | `implemented-without-source-traceability` — exists as a board field via L1.1, its role as "final arbiter" is architectural/implicit, not asserted as a formal override rule in the text (Precedence Map §9.1) |
| Source traceability | `sourced` |
| Unresolved source issues | **No "completer" role distinct from the judge was found anywhere in the 261 pages read** — the Kashf system has one synthesis role, not two (Precedence Map §9.3) |

### L6.2 — Final Verdict Assembly Mechanism
| Field | Value |
|---|---|
| Professional purpose | The step that would combine topic-formula + witnesses + dhamir + precedence into one final answer |
| Source pages | none — **no such unified mechanism was found anywhere in the 261 pages read** |
| Depends on | L4.1-21, L3.A-F, L3.Dh1-11, L5.4 |
| Current implementation status | `missing` — and, per Precedence Map §12.4, this may not be a gap in the mapping but a genuine absence in the source: the book leaves sequencing to practitioner judgment rather than defining one universal pipeline |
| Source traceability | N/A — nothing to trace |
| Unresolved source issues | Whether a unified assembly mechanism should even be engineered, given the source itself doesn't define one, is an open design question for a future round — not answered here |

### L6.3 — Narrative/Conclusion Writer
| Field | Value |
|---|---|
| Professional purpose | Produce the final Hebrew narrative text from the computed verdict data |
| Source pages | N/A — this is a presentation-layer concern, not itself a source-derived rule |
| Depends on | L6.1, L6.2 (whatever verdict data is available) |
| Current implementation status | `implemented-not-exposed`/`implemented-but-unverified` — `kashf-narrative-writer.js` (730 lines) exists in the engine directory; its content was NOT read this round, so whether its phrasing is faithfully source-derived (per CLAUDE.md's "no invented data ever" rule) or contains synthesized language was not verified |
| Source traceability | **Not verified this round — flagged as an open item, not assumed safe** |
| Unresolved source issues | This file's traceability to actual book text should be a priority check in any future round that touches narrative output, given CLAUDE.md's absolute prohibition on invented interpretive text |

---

## LAYER 7 — Traceability ו-AI Context

| Node | Professional purpose | Current code (if any) | Status |
|---|---|---|---|
| L7.1 candidateBookRules | Collect every book rule potentially relevant to a question before selection | Not identified as a distinct stage this round | `missing`/`ambiguous` |
| L7.2 selectedBookRules | Narrow candidates to the ones actually chosen for this reading | `kashf-book-rule-selector.js` (263 lines) | `implemented-but-unverified` |
| L7.3 evaluatedBookRules | Run selected rules against the actual board | `kashf-formula-engine.js` (245 lines), `kashf-reading-engine.js` (698 lines) | `implemented-but-unverified` |
| L7.4 appliedBookRules | Subset of evaluated rules that actually changed the verdict | Not identified as a distinct tracked field this round | `missing`/`ambiguous` — **per the semantic-correction discipline from commit `36a59e7`, this must NOT be assumed equal to L7.3's output without verification** |
| L7.5 rejectedBookRules / missingRelevantRules / unresolvedRules | Explicit negative-space tracking | Not identified this round | `missing` |
| L7.6 sourceEvidence / runtimeEvidence | Per-applied-rule citation + actual runtime values | Not identified as a unified structure this round | `missing`/`ambiguous` |
| L7.7 conflictResolution record | Record of how any detected conflict was resolved for this specific reading | Not identified — consistent with L5.4's finding that no unified precedence mechanism exists in code | `missing` |
| L7.8 AI-context sanitization | Prepare/clean data before any AI payload | `kashf-context-sanitizer.js` (151 lines) | `implemented-but-unverified` |
| L7.9 AI Context/Payload Builder | Assemble the final structured payload sent to an AI layer, if any | Not confirmed Kashf-specific this round; a "Decision Brain" / AI payload builder exists per earlier session work (task list items referencing "Phase 4 Part B/C") but its Kashf-specific coverage was not re-verified this round | `ambiguous` |

**Traceability discipline reminder (per user instruction)**: nothing in
this Layer 7 section should be read as claiming any rule is "applied"
merely because it is "implemented" or "selected" — these remain
independent axes throughout this entire document, exactly as required.

---

## Summary counts (for cross-reference with the Session Report to follow)

- Layer 0 nodes: 10
- Layer 1 nodes: 5
- Layer 2 nodes: 4
- Layer 3 nodes: 6 witness systems + 11 dhamir nodes (10 individually-tracked core/majority + 1 grouped node covering the 9 additional techniques) = 17
- Layer 4 nodes: 21
- Layer 5 nodes: 4 (one is a cross-reference, not a new engine)
- Layer 6 nodes: 3
- Layer 7 nodes: 9

**Total distinct engine/mechanism nodes catalogued in this graph: 73**
(counting L3.Dh11's 9 additional techniques as 1 grouped node, not 9 —
seeSub-Engine Inventory §21 for their individual breakdown if a
finer-grained count is needed).
