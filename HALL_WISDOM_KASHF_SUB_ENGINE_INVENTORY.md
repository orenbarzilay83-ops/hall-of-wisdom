# HALL_WISDOM_KASHF_SUB_ENGINE_INVENTORY

> Mapping only. No code changed. No engine implemented or modified. Status
> values below describe the **current state of the repository as observed
> by reading, not as a plan**. No contradictions resolved. No coverage
> claimed as complete — see the companion
> `HALL_WISDOM_KASHF_COMPLETE_BOOK_STRUCTURE_MAP.md` §4 and the Session
> Report for full disclosure of what was and was not read at each depth.

This document inventories every **sub-engine** (a reusable calculation
mechanism, as opposed to a single topic-formula) that the book requires,
as identified across the full sequential read (pages 21-276). Status enum
used throughout (per instruction): `implemented` /
`partially-implemented` / `missing` / `implemented-but-not-routed` /
`implemented-but-not-exposed` / `implemented-without-source-traceability`
/ `ambiguous`.

Current code inspected for this document (read-only, no edits):
`goral-hachol/engine/kashf-dhamir.js` (535 lines, 6 exported compute
functions), `kashf-topic-rules.js` (1952 lines, 28 `topicId` entries),
`kashf-book-rule-catalog.js` (13 entries, `ruleCategory` values:
`verdictFormula` ×2, `supportingCheck` ×3, `foundationalContext` ×1,
`witnessScheme` ×4, `generalPrinciple` ×2, `aggregationRule` ×1),
`kashf-figure-classifier.js`, `kashf-formula-engine.js`,
`kashf-reading-engine.js`, `kashf-dhamir-type4-external.js`,
`kashf-book-rule-selector.js`. This is a structural/inventory check only
— no line-by-line correctness verification of any function body was
performed this round.

---

## 1. Board Construction

| Field | Value |
|---|---|
| Concept | Mothers → Daughters → Balances (×2) → Judge (house 15) → house 16 |
| Purpose | Produce the full 16-house board from 4 struck mother-lines |
| Activation | Every reading, unconditionally |
| Inputs | 4 mother figures (from striking or manual entry) |
| Calculation | XOR-style odd/even combination per the book's p.28-33 procedure; house 15 = balance-of-balances; house 16 = "אחרית האחרית" |
| Outputs | 16-house board |
| Verdict effect | Structural prerequisite for everything else — no direct verdict |
| Dependencies | None (root engine) |
| Precedence | N/A — always runs first |
| Source pages | 28-33 |
| Examples in source | Procedure narrated, no single fully-worked numeric example isolated this round |
| Current code path | `raml-board-generator.js` (Hawi/shared engine, per CLAUDE.md file structure — not re-read line-by-line this round) |
| Status | `implemented-without-source-traceability` — structurally matches the book's algorithm shape per this round's read, but no line-by-line cross-check of `raml-board-generator.js` against p.28-33 was performed this round (out of scope; flagged as future verification work) |

## 2. Board Validation (house-15 parity rule)

| Field | Value |
|---|---|
| Concept | House 15 must always be even; if odd, "the board is erroneous" |
| Purpose | Reject invalid casts before interpretation |
| Activation | Immediately after board construction |
| Inputs | House 15 figure |
| Calculation | Parity check of house 15's point-total |
| Outputs | valid/invalid flag |
| Verdict effect | Gates all downstream processing |
| Dependencies | Board Construction (#1) |
| Precedence | Runs before any other sub-engine |
| Source pages | 34 |
| Examples | None isolated |
| Current code path | Possibly `raml-board-generator.js`'s `boardValidation` (name inferred from prior-round notes, not re-verified this round) |
| Status | `ambiguous` — plausibly implemented under a different name, not confirmed against actual code this round |

## 3. Querent-Honesty / Mother-Recurrence Check

| Field | Value |
|---|---|
| Concept | If none of the 4 "mother-only" figures (דרך, סוהר, חיבור, קהלה) appear anywhere in the full cast, the hidden-intention-holder is "a deceiver and a liar" |
| Purpose | Flag dishonest/bad-faith questions before interpretation |
| Activation | After board construction |
| Inputs | Full 16-house board |
| Calculation | Presence/absence test of 4 named figures across all houses |
| Outputs | honesty flag |
| Verdict effect | Colors the whole reading's reliability |
| Dependencies | Board Construction (#1) |
| Precedence | Not stated relative to other checks |
| Source pages | 35 |
| Examples | None isolated |
| Current code path | Possibly `computeQuerentHonestyCheck` (name from prior-round audit notes, not re-verified against actual code this round) |
| Status | `ambiguous` |

## 4. קוטרי/צלעי (Diametric/Lateral) Board Classification

| Field | Value |
|---|---|
| Concept | House 15's parentage parity (born of two odd figures = קוטרי; two even = צלעי) classifies the whole board/question |
| Purpose | General question-type classification; also feeds Dhamir branch #4b below |
| Activation | After board construction |
| Inputs | House-15 parentage |
| Calculation | Parity test |
| Outputs | קוטרי / צלעי label |
| Verdict effect | Feeds the dhamir-specific branching technique (see §11.12 below); general classificatory role otherwise unclear |
| Dependencies | Board Construction (#1) |
| Precedence | Feeds into #11.12 |
| Source pages | 34 (general classification), 157-158 (dhamir-specific reuse) |
| Examples | None isolated |
| Current code path | Not identified this round |
| Status | `missing` |

## 5. Four-Elements Point-Counting (base system: fire=1, air=2, water=4, earth=8)

| Field | Value |
|---|---|
| Concept | Per-line elemental point values, single/odd lines only |
| Purpose | Numeric substrate for many downstream techniques (money magnitude, witness scoring, dhamir reduction) |
| Activation | On demand by consuming techniques |
| Inputs | Any figure or house set |
| Calculation | Sum of odd-line point values per the base table |
| Outputs | Integer point total |
| Verdict effect | None directly — infrastructure only |
| Dependencies | None |
| Precedence | Base infrastructure; **at least 4 competing element-value traditions exist in the book** (Al-Tarablusi's 1/2/4/8 = the one matching this base system; Al-Zanati's 9/11/14/16; "naturalists'" 1/2/3/4 ordinal; a 4th variant at p.130 in the Five-Witnesses counter-tradition, 8/2/4/1) — the book states these "all return to one law" without fully reconciling the numeric divergence |
| Source pages | 37-39 (base), 126 (comparison table), 130 (Five-Witnesses variant) |
| Examples | None isolated numerically this round |
| Current code path | Possibly `kashf-dhamir.js`'s internal point-counting (used by `computeDhamirElementPrevalence`, `computeDhamirJawharayn`) — not verified against the specific 1/2/4/8 base this round |
| Status | `implemented-without-source-traceability` |

## 6. Essential Dignities Table (מעלה/מושב/גבול/פנים/שמחה/צער/מזג per figure)

| Field | Value |
|---|---|
| Concept | Classical-astrology-style per-figure dignity table: exaltation, domicile, bound, face, joy, fall, temperament-pairing, each as a house number |
| Purpose | Supplies positional data consumed by the Five Witnesses system (§9 below) and the "מבקש/מבוקש במעגל" technique (§14 below) |
| Activation | On demand |
| Inputs | Figure identity |
| Calculation | Table lookup |
| Outputs | 7 house-number values per figure |
| Verdict effect | Indirect, via consuming techniques |
| Dependencies | None (foundational table) |
| Precedence | Feeds §9 and §14 |
| Source pages | 97-99 |
| Examples | None isolated this round |
| Current code path | Not identified — NOT in `kashf-figure-classifier.js` per this round's inspection (that file covers benefic/malefic/internal-external/fixed-mutable taxonomy only, not dignities) |
| Status | `missing` |

## 7. Figure-to-Lunar-Month Correspondence Table

| Field | Value |
|---|---|
| Concept | Each figure mapped to an Islamic lunar month |
| Purpose | Timing/calendar integration |
| Activation | On demand, for timing questions |
| Inputs | Figure identity |
| Calculation | Table lookup |
| Outputs | Month name |
| Verdict effect | Timing refinement only |
| Dependencies | None |
| Precedence | N/A |
| Source pages | 100 |
| Examples | None |
| Current code path | None — directly matches CLAUDE.md's explicitly documented gap "❌ Islamic lunar calendar integration for timing — Not Yet Implemented" |
| Status | `missing` |

## 8. Sixteen Placement Orders (Gate 3, Orders 1-16)

| Field | Value |
|---|---|
| Concept | 16 distinct fixed figure↔position/value permutations (seat, number/duration ×3 sub-methods, elements ×4 traditions, temperament/planets, zodiac, letters ×2 traditions, abjad, width, depth, return, yazdaj, abjad-pattern, decimal, "path-falls," ibn-mahfuf) |
| Purpose | Toolkit/correspondence infrastructure consumed by naming, timing, letter-magic, distance-measurement, and money-magnitude techniques elsewhere in the book |
| Activation | On demand by consuming techniques |
| Inputs | Figure identity (per order) |
| Calculation | Table lookup or, for Orders 8-15, arithmetic derivation from Order 7's base sequence |
| Outputs | Position/value per order |
| Verdict effect | None directly — infrastructure only |
| Dependencies | Order 7 is the seed for Orders 8-12 |
| Precedence | Several orders have explicitly disputed/alternate versions within the source itself (Order 1 mother-seat dispute; Order 2's 3-way method dispute; Order 3's 4 competing element-value traditions; Order 12's doubled alternate; Order 6's 2-tradition letter table) — **the book does not always resolve these**, see the Precedence & Conflict Map |
| Source pages | 104-151 |
| Examples | Al-Zanati's worked numeric example (p.113) for Order 2; love-divination worked example (p.140) for Order 6 |
| Current code path | Not individually identified this round; possibly partially embedded inside `kashf-dhamir.js`'s internal helpers (unverified) |
| Status | `missing` (as a named, general-purpose lookup module); components may be duplicated ad hoc inside individual functions elsewhere — `ambiguous` |
| Note | Order 15's base element-values were not found restated in the read excerpt — flagged in the Structure Map as a possible source gap, not resolved here |

## 9. Five Witnesses (מערכת E) — degree-scoring witness system

| Field | Value |
|---|---|
| Concept | 5 tiers (בית=5, שררה=4, גבול=3, שלישות=2, פנים=1, summing to 15) computed via Fire+Earth point-reduction mod 12 walking a "pole point," each tier conditioned on landing/thematic correspondence |
| Purpose | Scored, cumulative witness-strength assessment |
| Activation | On demand, general-purpose (not tied to one topic in the text read) |
| Inputs | Full board (houses 1-15), Essential Dignities Table (§6) |
| Calculation | Fire+Earth points mod 12 → pole-point walk → tier-by-tier conditional scoring |
| Outputs | Cumulative score 1-15, with "N witnesses stronger than N-1" escalation language |
| Verdict effect | Strengthens/weakens whatever verdict it is attached to |
| Dependencies | Essential Dignities Table (§6) |
| Precedence | A counter-tradition (בעלי הטבעים) rejects the whole apparatus and proposes a simpler element-counting equivalent (yet a 4th distinct element-value set) — not reconciled by the book |
| Source pages | 130-131 |
| Examples | None isolated this round |
| Current code path | None — this system was previously catalogued only as "unresolved, no house numbers" (existing `kashf-book-rule-catalog.js` witnessScheme entries do not include this mechanism) |
| Status | `missing` |

## 10. Basic House-Testimony Witness Scheme (מערכת C)

| Field | Value |
|---|---|
| Concept | Fixed house-13/14/15 witness assignments (13→[1,9], 14→[5,6,11], 15→[3,7,10,11]) |
| Source pages | 53 |
| Current code path | Catalogued (`kashf-book-rule-catalog.js`, `ruleCategory: 'witnessScheme'`), structurally always present via houses 13-15's board role |
| Status | `implemented` at the catalog/documentation level; runtime wiring into `kashf-dhamir.js`/`kashf-reading-engine.js` not re-verified this round — see Coverage Audit for the catalogued/implemented/routed/exposed distinction |

## 11. Extended House-Testimony Witness Scheme (מערכת D)

| Field | Value |
|---|---|
| Source pages | 101-102 |
| Current code path | Catalogued (`witnessScheme`) |
| Status | Same as §10 — catalogued; runtime routing not re-verified this round |

## 12. "Six Pillars" General Witness Foundation (מערכת A)

| Field | Value |
|---|---|
| Source pages | 41 |
| Current code path | Catalogued (`kashf-p41-six-pillars-witnesses-general`, `generalPrinciple`) |
| Status | Catalogued; not a scoring engine itself, a foundational-concept list (degrees, witnesses, joining, participation, temperament, blending) |

## 13. Trine Aspect Witness Note (מערכת B)

| Field | Value |
|---|---|
| Source pages | 45 |
| Current code path | Referenced in prior audits |
| Status | `ambiguous` — square/sextile aspects also named in the taxonomy at p.43 but not content-verified this round |

## 14. "שבעת עדי החכמה" (Seven Witnesses of Wisdom) — מערכת F [NEW]

| Field | Value |
|---|---|
| Concept | Houses 9-15 (7 houses) collectively named "witnesses of wisdom"; house 16 added for dhamir purposes; majority-rule (benefic-majority → judge favorably, malefic-majority → judge unfavorably) |
| Purpose | Distinct, simpler majority-based witness mechanism |
| Activation | On demand |
| Inputs | Houses 9-16 |
| Calculation | Count benefic vs malefic figures among houses 9-15 (+16 for dhamir) |
| Outputs | Majority verdict direction |
| Verdict effect | Direct strengthening/weakening signal |
| Dependencies | Figure benefic/malefic classification (`kashf-figure-classifier.js`) |
| Precedence | Not reconciled with systems A-E; mechanically distinct from all of them |
| Source pages | 164 |
| Examples | None isolated |
| Current code path | None |
| Status | `missing` |

## 15. Gate 4 Core Dhamir — Type 1 (4 Faces): Length/Width/Depth Movement + Jawharayn

| Field | Value |
|---|---|
| Source pages | 151-155 |
| Current code path | `computeDhamirMizan` (Length/Face 1), `computeDhamirHarkatAlArd` (Width/Face 2), `computeDhamirJawharayn` (Face 4) — all confirmed present in `kashf-dhamir.js`. Face 3 (Depth Movement, "type1-face3-depth-movement") — **not found as a separate exported function in `kashf-dhamir.js`'s 6 exports** (only 6 functions exist: `computeDhamirMizan`, `computeDhamirHarkatAlArd`, `computeDhamirJawharayn`, `computeDhamirDoubledSquare`, `computeDhamirElementPrevalence`, `computeDhamirByMajority`) |
| Status | Faces 1, 2, 4: `implemented` (module-level; routing/exposure not re-verified this round). Face 3 (Depth Movement): `missing` per this round's function-name inspection — contradicts the prior-round note file's claim of a `type1-face3-depth-movement` implementation; **flagged as a discrepancy requiring a targeted code re-check**, not resolved here |

## 16. Gate 4 Core Dhamir — Type 2 (Element Prevalence, with witness-accumulation refinement clause)

| Field | Value |
|---|---|
| Source pages | 151-155 |
| Current code path | `computeDhamirElementPrevalence` |
| Status | `implemented`; the "trace the point's root, compare to the walk-path, weight by which is stronger" refinement clause noted in the working notes was **not verified against this function's actual body this round** — `implemented-without-source-traceability` for that specific refinement clause |

## 17. Gate 4 Core Dhamir — Type 3 (Mothers-Arithmetic)

| Field | Value |
|---|---|
| Source pages | 151-155 |
| Current code path | `computeDhamirDoubledSquare` is present in `kashf-dhamir.js`'s export list — plausibly this IS "type3-mothers-arithmetic" under a different function name (the book's method squares the odd-unit count and doubles/halves), but the exact name mismatch was not resolved this round |
| Status | `ambiguous` — needs a targeted body-read to confirm `computeDhamirDoubledSquare` implements the book's Type-3 mothers-squaring procedure, not assumed here |

## 18. Gate 4 Core Dhamir — Type 4 (Opening/Abjad, external-source-tagged)

| Field | Value |
|---|---|
| Source pages | 151-155 |
| Current code path | `kashf-dhamir-type4-external.js` (separate dedicated file, 139 lines) |
| Status | `implemented`, with external-source tagging already in place per file naming — the strongest existing precedent for how future external-attributed material (Tamtam al-Hindi, Nuzhat al-Uqul, etc.) should be tagged if ever catalogued |

## 19. Gate 4 Core Dhamir — Type 5 (Circle-Closure)

| Field | Value |
|---|---|
| Source pages | 151-155 |
| Current code path | Not found among `kashf-dhamir.js`'s 6 exports |
| Status | `missing` per this round's function-name inspection — contradicts the prior-round working-notes claim that `type5-circle-closure` was "existing (missing)"; the notes themselves already flagged it as missing, so this is **consistent**, not a new discrepancy |

## 20. Gate 4 "Additional Way" (house-1 sevenths) + Majority Decision

| Field | Value |
|---|---|
| Source pages | 155 |
| Current code path | `computeDhamirByMajority` (majority decision, confirmed); the "house-1 sevenths" additional way not separately identified |
| Status | Majority decision: `implemented`. House-1-sevenths: `ambiguous`/`missing`, not resolved this round |

## 21. Gate 4 — Nine Additional Undocumented Dhamir Techniques [NEW]

| Field | Value |
|---|---|
| Concept | מיזוג הצורות (figure-pairing, mod 8), דרך המעגל (circle-way, distinct from Type 5), קוטרי/צלעי branching (2 variants, mod 12 / mod 9), letters+10 mod 12, house-1/15 repetition check, angular-points derived-figure, houses-9-12 heads+feet combination, houses-1/4/7/10 heads combination, 3 numeric-reduction "poetic" variants (mod 8/9/12) |
| Purpose | Each independently reveals hidden intent; several share the "sum points, reduce by N, cast onto houses" shape with different moduli — a family resemblance, not 9 wholly independent algorithms, but each has its own name/attribution/worked context in the source |
| Activation | Alternate to the core 5-type/8-method structure |
| Inputs | Varies per technique — mostly full-board point sums or specific house subsets |
| Calculation | See `04_notes_pages_151-161...md` for full per-technique detail |
| Outputs | House/figure landing → hidden-intent reveal |
| Verdict effect | Same role as core dhamir methods |
| Dependencies | קוטרי/צלעי classification (§4) for the branching variant; Order-6 letter table (§8) for the letters+10 variant |
| Precedence | Not stated relative to the core 5 types — book presents them as additional options "from among" many, not ranked |
| Source pages | 156-160 |
| Examples | None isolated numerically this round |
| Current code path | None |
| Status | `missing`, all 9 |

## 22. "Decision-Oracle" General-Purpose Pattern

| Field | Value |
|---|---|
| Concept | Cast repeatedly (or take a single figure) until one figure emerges, then look up a fixed verdict phrase in a full 16-figure table |
| Purpose | General-purpose yes/no or outcome oracle, reusable across ANY question — not topic-bound |
| Activation | On demand, explicitly invoked by name in at least 3 places |
| Inputs | Resultant single figure |
| Calculation | Table lookup |
| Outputs | Fixed verdict phrase |
| Verdict effect | Direct, standalone verdict |
| Dependencies | None |
| Precedence | Independent of topic-formulas; can supplement or substitute for them — book does not state which takes precedence when both are used for the same question |
| Source pages | 170-171 ("שאילת הכרעה," 21-cast method), 248-253 (missing-person mod-4 variant), 267-269 (livelihood-oracle table) |
| Examples | Yes — full tables at all 3 locations |
| Current code path | None identified |
| Status | `missing` |
| Note | Chapter 11's livelihood-oracle table (p.267-269) has a possible internal inconsistency (קהלה appears twice with different verdicts) — flagged, not resolved |

## 23. "Sub-Board Recast" General-Purpose Pattern

| Field | Value |
|---|---|
| Concept | Take a subset of the existing board's houses and use them as fresh "mothers" to derive an entirely new sub-board |
| Purpose | Deepen analysis of a specific sub-question using the existing cast as a seed, without a fresh physical casting |
| Activation | Topic-specific invocation (seen twice) |
| Inputs | A designated house-subset from the parent board |
| Calculation | Re-run the Board Construction algorithm (§1) using the subset as the new "mothers" |
| Outputs | A new, nested 16-house board |
| Verdict effect | Feeds a topic-specific sub-verdict |
| Dependencies | Board Construction (#1) |
| Precedence | Not stated as overriding or subordinate to the main board's verdict |
| Source pages | 253 (Al-Zanati missing-person variant, houses 13-15 as mothers), 262-ish (Chapter 10 dynasty-continuation, 4 angular houses as mothers) |
| Examples | Both instances are procedurally described, not fully numerically worked in the excerpts read |
| Current code path | None identified |
| Status | `missing` |

## 24. "מבקש/מבוקש במעגל" (Seeker/Sought via the Circle)

| Field | Value |
|---|---|
| Concept | Count from a figure's own "house of honor" (Essential Dignities Table, §6) back to its current position; use that count via Order-1 seat-placement (§8) to find a target house; judge by that house's quality |
| Purpose | Trade/pricing verdict technique, dependency-heavy |
| Activation | Topic-specific (trade/buy-sell) |
| Inputs | Figure identity, Essential Dignities Table, Order-1 table |
| Calculation | Positional count + lookup, see source |
| Outputs | Target house → quality verdict |
| Verdict effect | Direct |
| Dependencies | Essential Dignities Table (§6), Placement Order 1 (§8) |
| Precedence | Not stated |
| Source pages | 218-220 |
| Examples | Yes, fully worked (p.219-220) |
| Current code path | None identified |
| Status | `missing` |

## 25. Lookup-Table Sub-Engines (concrete, self-contained, low-ambiguity)

| Field | Value |
|---|---|
| Concept | A recurring class of complete figure↔outcome or figure↔attribute tables found throughout Gate 6: thief physical/occupational description (×16 figures, p.232-234), ship-damage-by-figure (~×13, p.244-ish), occupation-by-planet-in-house-9 (×9, p.254), body-part-of-illness-by-figure (×16, p.199), animal-type-by-figure (×6+, p.203-204), water-depth-by-figure (p.189-190), friend-type-by-planet (×7, p.264-265), clothing-color-by-planet (×7, p.266), ruler's-condition-by-landing-house (×12, p.261-262), prisoner-outcome-figure-pair table (p.274-275), dismissal/appointment-by-figure-in-house-10 (p.258-260) |
| Purpose | Direct descriptive/verdict lookups, no interpretation required |
| Activation | Topic-specific |
| Inputs | A specific figure or figure-in-house combination |
| Calculation | Table lookup only |
| Outputs | Fixed descriptive/verdict text |
| Verdict effect | Direct, topic-specific |
| Dependencies | None beyond figure identity |
| Precedence | N/A — independent per-topic tables |
| Source pages | See list above |
| Examples | The tables themselves are the examples |
| Current code path | None identified as a unified "lookup-table" module; some individual values may already appear inside `kashf-topic-rules.js` topic definitions for theft/travel/authorityState/friendsHope (not verified line-by-line this round) |
| Status | `missing` as a systematic module; `ambiguous` for any individual overlap with existing topic code |
| Note | These are collectively the **highest-value, lowest-ambiguity future digitization targets** — no interpretive judgment required, just faithful transcription |

## 26. Timing / Duration Sub-Engine (mothers=days, daughters=weeks, born=months, balances=years scaling)

| Field | Value |
|---|---|
| Source pages | 110 (base table), 118 (confirmed again), 178 (topic-specific lifespan application) |
| Current code path | Not identified this round |
| Status | `missing` |

## 27. "לשון העניין" (Tongue of the Matter) Timing Sub-Technique

| Field | Value |
|---|---|
| Concept | House 8 counted from house-of-querent's-intent, struck against houses 5&9, yields a timing figure |
| Source pages | 112, 119-120 (extended arithmetic) |
| Current code path | Possibly `kashf-leshon-hainyan.js` (93 lines, name matches "לשון העניין" transliterated) — **plausible match by filename, not verified against the actual p.112/119-120 algorithm this round** |
| Status | `implemented-without-source-traceability` if the filename match holds; flagged for a targeted future verification, not confirmed here |

## 28. Money-Magnitude Table

| Field | Value |
|---|---|
| Source pages | 111 |
| Current code path | Likely `computeMoneyMagnitudeKashf` referenced in `kashf-topic-rules.js`'s money topic (per prior-round notes) |
| Status | `implemented-without-source-traceability` — plausible match, exact table cross-check (house1=1 dirham...house16=136, with the alternate 9-16 scaling column) not performed this round |

## 29. Distance-Measurement System (Al-Zanati/Al-Layth, שיבר/אמה/פישוק ידיים/פרסה)

| Field | Value |
|---|---|
| Source pages | 121 |
| Current code path | None identified |
| Status | `missing` |

## 30. Dalail al-Fasl Alternate Length/Width/Depth Table (attributed external source)

| Field | Value |
|---|---|
| Source pages | 114-116; reused at 185-190 for hidden-object depth-measurement |
| Current code path | None identified |
| Status | `missing`; must be tagged as attributed-external if ever catalogued, per the dhamir-Type-4-external precedent (§18) |

## 31. Final Verdict Assembly / "כוח העדים" General Modulation Principle

| Field | Value |
|---|---|
| Concept | The recurring qualifier "והכול לפי כוח העדים" ("and all of this is per the strength of the witnesses") attached throughout Gate 2's benefic/malefic-modification-by-neighboring-figure rules — a general principle that witnesses modulate verdict outcomes, without specifying WHICH witness system (A-F) applies |
| Purpose | Final-stage verdict modulation |
| Activation | Implicitly, everywhere |
| Inputs | Whichever witness system is in play |
| Calculation | Not specified — the book leaves this generic |
| Outputs | Modulated verdict |
| Verdict effect | Direct, universal |
| Dependencies | One or more of witness systems A-F (§9-14) |
| Precedence | **The book does not specify which witness system this phrase invokes** — this is itself a precedence gap, not resolved by the source; see Precedence & Conflict Map |
| Source pages | 55, 56, 57, 58 (repeated), and recurring throughout Gate 6 as "לפי כוח העדים" |
| Examples | None isolated |
| Current code path | Not identified as a unified module |
| Status | `missing` as a general mechanism; individual topic formulas in `kashf-topic-rules.js` may apply ad hoc witness-weighting without this being traced to a named system — `ambiguous` |

---

## Summary count

- **Sub-engines identified**: 31 (numbered above; several §10-§14 are witness-system variants of one conceptual category, and §15-§21 are dhamir-method variants of one conceptual category — see the Session Report for the consolidated tallies requested there).
- **Status breakdown** (counting each numbered engine once): `implemented` — 6 (§10 catalog-level, §11 catalog-level, §12 catalog-level, §15 partial/3-of-4, §16, §18, §20 partial). `implemented-without-source-traceability` — 5 (§1, §5, §27, §28, and §16's refinement clause). `ambiguous` — 6 (§2, §3, §13, §17, §19, §31). `missing` — remainder (§4, §6, §7, §8, §9, §14, §21 [9 sub-items], §22, §23, §24, §25, §26, §29, §30).
- This counting is **approximate and structural**, not a certified audit — see `HALL_WISDOM_KASHF_BOOK_TO_CODE_COVERAGE_AUDIT.md` for the required catalogued/implemented/selected/evaluated/applied/exposed/sourced status breakdown, which is a stricter, separate classification.
