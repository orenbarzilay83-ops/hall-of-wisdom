# HALL_WISDOM_KASHF_BOOK_TO_CODE_COVERAGE_AUDIT

> Mapping only. No code changed. This document continues the semantic-
> correction discipline established in the prior committed round
> (`36a59e7`): **catalogued**, **implemented**, **selected**,
> **evaluated**, **applied**, **exposed**, and **sourced** are treated as
> SEPARATE, non-unified statuses. A rule can be true on some of these
> axes and false on others simultaneously — this table records each axis
> independently rather than collapsing them into one "done/not done"
> label. No runtime testing was performed this round (prohibited by
> instruction); "runtime-evidence-available" is therefore `no` for every
> row unless it was already established in a prior committed round.

## Status-axis definitions (for this document only)

- **catalogued** — present as an entry in `kashf-book-rule-catalog.js`
- **implemented** — a corresponding function/table exists in the engine code
- **selected** — the engine's rule-selector (`kashf-book-rule-selector.js`) would pick this rule for a relevant question, if catalogued and implemented
- **evaluated** — the implemented function actually runs and produces a value for a real board
- **applied** — the evaluated result is used in the topic's verdict/narrative logic
- **exposed** — the result is visible in the UI or sent to the AI/narrative layer, not just computed internally
- **sourced** — the rule's text/citation is traceable to a specific book page, with `sourceStatus` integrity intact

None of these axes were re-verified by running the application this round (prohibited). Where a prior committed round already established runtime evidence for the 13 catalogued entries, this is noted but not re-tested.

---

## Part 1 — The existing 13-entry catalog, re-audited against the new full-book read

| # | Rule (catalog id) | Professional role | Relevant questions | catalogued | implemented | selected | evaluated | applied | exposed | sourced | Coverage status | Gap severity | Recommended action |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | primaryFormula (spiritualDiagnostics) | Direct fire/air verdict for sorcery detection | "is there sorcery/action behind this" | yes | yes (per prior rounds) | yes | not re-tested this round | not re-tested this round | not re-tested this round | yes (p.167, verified again this round) | catalogued+sourced confirmed; runtime axes carried from prior round, not re-tested | low | none — stable |
| 2 | altFormula (spiritualDiagnostics) | Alternate air-based verdict | same | yes | yes | yes | not re-tested | not re-tested | not re-tested | yes (p.167) | same as #1 | low | none |
| 3 | movement-initiator (supportingCheck) | Feeds connection-type formula | "what type of connection" | yes | yes | unknown this round | not re-tested | not re-tested | not re-tested | yes (p.167) | catalogued+sourced confirmed | low | none |
| 4 | matter-true-and-directed-at-me (supportingCheck) | Water-row test | "is this real and about me" | yes | yes | unknown | not re-tested | not re-tested | not re-tested | yes (p.167) | catalogued+sourced confirmed | low | none |
| 5 | connection-type-by-element (supportingCheck) | Element-graded connection depth | "type of connection" | yes | yes | unknown | not re-tested | not re-tested | not re-tested | yes (p.167) | catalogued+sourced confirmed | low | none |
| 6 | foundationalContext entry | General board-role context | all | yes | n/a (contextual, not a formula) | n/a | n/a | n/a | n/a | yes | catalogued | low | none |
| 7 | kashf-p41-six-pillars-witnesses-general (witnessScheme A) | Foundational witness-concept list | all | yes | not identified as a standalone scoring function this round | no (it's a concept list, not a scorer) | no | no | no | yes (p.41, re-verified verbatim this round) | catalogued+sourced; NOT itself an executable scoring engine — it enumerates 6 concepts (degrees, witnesses, joining, participation, temperament, blending), most of which have no single dedicated implementation | medium | clarify in future rounds that this entry is a conceptual foundation, not a callable function — mislabeling risk if treated as "implemented" |
| 8 | (trine reference, witnessScheme B) | Aspect-based witness note | all | yes | not identified | no | no | no | no | yes (p.45, not re-verified this round; square/sextile also named at p.43 but not content-checked) | catalogued; content depth beyond the trine mention itself not independently re-confirmed this round | medium | targeted re-check of p.43-45's full aspect taxonomy (trine/square/sextile) before treating this entry as complete |
| 9 | kashf-p53-witness-scheme-basic (witnessScheme C) | House 13/14/15 fixed testimony | all | yes | not identified as standalone function; structurally present via board's own house roles | plausible (structural) | not re-tested | not re-tested | not re-tested | yes (p.53, verbatim-confirmed again this round) | catalogued+sourced confirmed; implementation is architectural (via board structure) not a discrete callable | low-medium | none required, but should be explicitly noted in code comments that this "implementation" is structural, not a function |
| 10 | generalPrinciple #1 | (content not re-read this round — carried from prior catalog) | — | yes | unknown | unknown | unknown | unknown | unknown | yes (per prior round) | not re-audited this round — out of the pages re-read | unknown | targeted re-check recommended, not performed here to stay within instructed scope (full-book structural read, not re-auditing every existing entry line-by-line) |
| 11 | generalPrinciple #2 | (same) | — | yes | unknown | unknown | unknown | unknown | unknown | yes (per prior round) | not re-audited this round | unknown | same as #10 |
| 12 | kashf-p101-witness-scheme-extended (witnessScheme D) | Extended house-testimony | all | yes | not identified as standalone function | plausible (structural) | not re-tested | not re-tested | not re-tested | yes (p.101-102, verbatim-confirmed word-for-word again this round) | catalogued+sourced confirmed | low-medium | same structural-implementation caveat as #9 |
| 13 | kashf-p155-dhamir-majority-decision (aggregationRule) | Majority vote across dhamir results | dhamir | yes | yes (`computeDhamirByMajority` confirmed present in `kashf-dhamir.js`) | plausible | not re-tested | not re-tested | not re-tested | yes (p.155) | catalogued+implemented+sourced confirmed | low | none, but see Precedence Map §7.1 — the rule's scope (which subset of the now-17+ dhamir techniques it majority-votes over) is itself unresolved by the source |

**Verdict on the 13-entry catalog**: all 13 entries remain **correctly catalogued and correctly sourced** per this round's re-reading — no factual errors found. However, this round's full-book read confirms that entries #7, #8, #9, #12 (the 4 witness-scheme entries, A/B/C/D) describe only **4 of what are now confirmed to be at least 6 distinct witness systems** (E and F newly found, see Part 3). The catalog is accurate as far as it goes; it is not exhaustive, and was never claimed to be.

---

## Part 2 — Core Dhamir 8-method structure vs `kashf-dhamir.js`

| # | Method (book name) | Professional role | catalogued | implemented | selected | evaluated | applied | exposed | sourced | Coverage status | Gap severity | Recommended action |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Type 1 Face 1 — תנועת האורך (mizan) | Length-movement dhamir | yes (implicitly, via prior rounds' dhamir work — not in the 13-entry catalog's explicit rows) | yes — `computeDhamirMizan` | plausible | not re-tested | not re-tested | not re-tested | yes (p.151-155, re-verified) | implemented+sourced; NOT in the 13-entry rule catalog as a discrete row (the catalog's scope was narrower than the full dhamir chapter) | low | consider whether future catalog rounds should add explicit rows for each of these 6 implemented functions |
| 2 | Type 1 Face 2 — תנועת הרוחב (harkat-al-ard) | Width-movement dhamir | not in 13-entry catalog | yes — `computeDhamirHarkatAlArd` | plausible | not re-tested | not re-tested | not re-tested | yes (p.151-155) | implemented+sourced, not catalogued | low | same as #1 |
| 3 | Type 1 Face 3 — תנועת העומק (depth movement) | Depth-movement dhamir | not in 13-entry catalog | **not found** among `kashf-dhamir.js`'s 6 exports this round | no | no | no | no | yes (p.151-155) | **missing** — contradicts a prior-round working-note's claim that this was implemented; this round's direct `grep` of the file's exports found only 6 functions, none named for Face 3 | medium | targeted code re-check needed: either the function exists under an unexpected name (re-verify), or the prior-round note was mistaken and this face is genuinely unimplemented |
| 4 | Type 1 Face 4 — jawharayn | Light+heavy point-count dhamir | not in 13-entry catalog | yes — `computeDhamirJawharayn` | plausible | not re-tested | not re-tested | not re-tested | yes (p.151-155) | implemented+sourced, not catalogued | low | same as #1 |
| 5 | Type 2 — element-prevalence (+ refinement clause) | Element-majority dhamir | not in 13-entry catalog | yes — `computeDhamirElementPrevalence` | plausible | not re-tested | not re-tested | not re-tested | yes (p.151-155); refinement clause not independently re-verified against function body | implemented; sourced for the core mechanism, `implemented-without-source-traceability` for the refinement clause specifically | low-medium | targeted body-read of `computeDhamirElementPrevalence` against the p.151-155 refinement-clause text |
| 6 | Type 3 — mothers-arithmetic | Squared-odd-count dhamir | not in 13-entry catalog | **ambiguous** — `computeDhamirDoubledSquare` may be this method under a different name, not confirmed | unknown | unknown | unknown | unknown | yes (p.151-155) | `ambiguous` | medium | targeted body-read of `computeDhamirDoubledSquare` to confirm/deny it implements the book's Type-3 squaring procedure |
| 7 | Type 4 — opening/abjad (external-tagged) | Point-total→letter→figure dhamir | not in 13-entry catalog | yes — dedicated file `kashf-dhamir-type4-external.js` | plausible | not re-tested | not re-tested | not re-tested | yes (p.151-155), correctly tagged as external-attributed per file naming | implemented+sourced, exemplary tagging discipline | low | none — this is the model pattern other external-attributed material (Tamtam al-Hindi, Nuzhat al-Uqul) should follow if ever catalogued |
| 8 | Type 5 — circle-closure | Repeated-walk-until-repeat dhamir | not in 13-entry catalog | **not found** among `kashf-dhamir.js`'s 6 exports | no | no | no | no | yes (p.151-155) | **missing**, consistent with prior-round notes which already flagged this as missing (not a new discrepancy) | medium | implement if/when a future round is authorized to expand dhamir coverage |
| 9 | "Additional way" — house-1 sevenths | Metaphorical vs true joining/release test | not in 13-entry catalog | not identified | no | no | no | no | yes (p.155) | missing | low-medium | future round |
| 10 | Majority decision | Aggregation across all above | catalogued (#13 in Part 1) | yes — `computeDhamirByMajority` | plausible | not re-tested | not re-tested | not re-tested | yes (p.155) | catalogued+implemented+sourced | low | see Precedence Map §7.1 unresolved scope question |

---

## Part 3 — Witness systems A-F: coverage summary

| System | Source pages | catalogued | implemented (as discrete scoring engine) | sourced | Coverage status | Gap severity | Recommended action |
|---|---|---|---|---|---|---|---|
| A — Six Pillars (foundational concept list) | 41 | yes | n/a (conceptual, not a scorer) | yes | catalogued+sourced; not implementable as a single function by nature | low | none |
| B — Trine (+ square/sextile, not content-verified) | 43, 45 | yes (trine only) | not identified | yes (trine only) | catalogued+sourced for trine; square/sextile named but not content-checked | medium | targeted re-check of p.43-45 full aspect taxonomy |
| C — Basic house-13/14/15 testimony | 53 | yes | structural (via board itself), not a discrete function | yes | catalogued+sourced | low-medium | none required |
| D — Extended house-testimony | 101-102 | yes | structural, not a discrete function | yes | catalogued+sourced | low-medium | none required |
| E — Five Witnesses (degree-scoring) | 130-131 | **no** | **no** | yes (full mechanism now recovered this round) | **sourced but not catalogued and not implemented** — this round upgraded E from "unresolved, no house numbers" (prior audit) to a fully-specified mechanism | **high** — the fullest-mechanism witness system in the book has zero code presence | recommended first domain to complete (see Session Report) |
| F — Seven Witnesses of Wisdom (majority-rule) | 164 | **no** | **no** | yes (newly found this round) | **sourced but not catalogued and not implemented** | **high** — simplest-to-implement of all 6 systems (plain majority count over 7 fixed houses), zero code presence | strong secondary candidate — low implementation complexity, source fully specified |

---

## Part 4 — Gate 6 topic-chapter coverage vs `kashf-topic-rules.js`'s 28 topicIds

`kashf-topic-rules.js` was inspected this round (topicId list only, not function bodies): `completion, spiritualDiagnostics, money, siblings, relocation, hiddenTreasure, parentsProperty, children, illness, lostAnimal, marriage, disputes, enemies, theft, loan, deathInheritance, travel, missingPerson, dream, authorityState, motherRules, commerce, yearlyForecast, partnership, prisoner, fear, religion, friendsHope, generalReading` (28 topics — more granular than the 12 Gate-6 chapters, since several topics like `siblings`/`relocation` or `theft`/`loan` split a single book chapter).

| Book chapter | Approx. topicId(s) matched | catalogued (13-entry) | implemented (has topic entry) | sourced (page-cited) | Coverage status | Gap severity | Recommended action |
|---|---|---|---|---|---|---|---|
| Ch.1 Self (p.166-179) | `completion`, `spiritualDiagnostics` | yes (5 of ~25 sub-rules) | yes for the 5; remaining ~20 sub-rules (decision-oracle, odd/even parity framework, request-lifecycle framework, occupation-by-element, lifespan-calculation, etc.) not identified in `kashf-topic-rules.js`'s topicId set | yes for the 5; yes for the ~20 (this round) | **partial** — primary/alt formulas covered; general-purpose infrastructure (decision-oracle) and ~20 granular sub-rules not covered | medium | decision-oracle table (§22 of Sub-Engine Inventory) is general-purpose and high-value; recommend as a distinct future target from topic-specific sub-rules |
| Ch.2 Money (p.179-182) | `money` | no (not in 13-entry catalog, but confirmed exact match to code) | yes — primaryFormula/altFormula/`computeMoneySourceKashf` all confirmed exact matches this round | yes (179-182) | **good** — this is the single best-covered chapter found this round | low | none — positive confirmation only |
| Ch.3 Siblings/Travel-short (p.182-184) | `siblings`, `relocation` | no | not verified this round whether these topicIds' internal formulas match p.182-184's specific house-combinations | conditional (pages identified, formula-level cross-check not done) | conditional | medium | targeted formula-level cross-check of `siblings`/`relocation` topic bodies against p.182-184 |
| Ch.4 Parents/Property/Hidden (p.184-196) | `parentsProperty`, `hiddenTreasure` | no | topicIds exist; the elaborate ~8-method hidden-object-location sub-system (quadrant-reduction, Tamtam al-Hindi, iterative-quadrant-subdivision, Dalail-al-Fasl depth-measurement, water-depth table) not verified against `hiddenTreasure`'s actual formula body this round | conditional | conditional | medium-high | targeted formula-level cross-check; the water-depth-by-figure table (p.189-190) is a concrete, high-value digitization candidate if not already present |
| Ch.5 Children/Pregnancy (p.191-196) | `children` | no | topicId exists; the 4-5 competing gender-determination methods (ambiguous in source itself, see Precedence Map §10.3) not verified against code | conditional | **ambiguous at the source level**, coverage-status itself therefore also ambiguous | medium | do not resolve the source's own gender-method plurality without user guidance; if `children`'s code currently picks ONE gender method, flag which one and confirm it's a deliberate choice, not an oversight |
| Ch.6 Illness/Lost/Animals (p.196-204) | `illness`, `lostAnimal` | no | topicIds exist; the body-part-by-figure table (16 entries, p.199) and animal-type-by-figure table not verified against code | conditional | conditional | medium | targeted cross-check; these are concrete lookup tables, good digitization candidates |
| Ch.7 Marriage/Winner-Loser/Trade (p.204-224) | `marriage`, `disputes`, `commerce` | no | topicIds exist; this is the single densest chapter (~35 formulas); **corrected in a later round — the "מבקש/מבוקש במעגל" technique's Requester half is now confirmed implemented, routed, and exposed** (`id: 'requester-circle-strength'`, `commerce` topic); the remaining ~34 formulas and the Requested half are still not verified against code | conditional | conditional | medium-high (largest single chapter, mostly still unverified) | highest-value target for a future dedicated cross-check round given its size |
| Ch.8 Theft/Loan (p.224-237) | `theft`, `loan` | no | topicIds exist; the thief physical/occupational description table (16 figures, p.232-234) and kinship-mapping table not verified against code | conditional | conditional | medium | targeted cross-check; thief-description table is concrete and high-value |
| Ch.9 Travel/Missing/Dream/Debt (p.237-255) | `travel`, `missingPerson`, `dream` | no (though `travel` and `missingPerson` are "existing, likely catalogued" per the Question/Formula Matrix's own caveat — cross-ref not verified) | topicIds exist; the "sub-board recast" (Al-Zanati missing-person variant, houses 13-15 as mothers) and ship-damage-by-figure table not verified against code | conditional | conditional | medium | the sub-board-recast pattern (§23 of Sub-Engine Inventory) is architecturally novel and almost certainly not implemented — recommend explicit future check |
| Ch.10 Authority (p.256-264) | `authorityState`, `motherRules` | no | topicIds exist; the ruler's-12-house-landing table and dynasty-continuation sub-board-recast not verified against code | conditional | conditional | medium | same sub-board-recast note as Ch.9 |
| Ch.11 Friends/Hope/Life/Love (p.264-271) | `friendsHope` | no | topicId **exists** (contrary to the Question/Formula Matrix's earlier flag that this might be a "candidate new topic" — this round's direct inspection of `kashf-topic-rules.js` confirms `friendsHope` IS already a defined topicId) | conditional | **correction to prior working notes**: `friendsHope` already exists as a topic, so CLAUDE.md's implied gap does not apply here at the topicId level — formula-level completeness (the livelihood-oracle table, clothing-color table, friend-type-by-planet table) still not verified | medium | targeted cross-check of `friendsHope`'s formula body against p.264-271, especially the possibly-inconsistent קהלה double-entry in the livelihood table |
| Ch.12 Enemies/Prisoners (p.271-276) | `enemies`, `prisoner` | no | topicIds exist; the prisoner-outcome figure-pair table not verified against code | conditional | conditional | medium | targeted cross-check |

---

## Part 5 — Domains entirely missing from all code (catalogued or not)

These have **no topicId, no catalog entry, and no identified implementation** at all, per this round's inspection:

> **Correction (later verification round)**: item 1 below, the Essential
> Dignities Table, is **not** actually missing — it already exists as
> `FIGURE_DIGNITIES` in `kashf-figure-attributes-gate2.js`, is source-
> verified, and is already consumed by Dhamir Type 2. This round's
> original inspection missed that sibling data file. See
> `HALL_WISDOM_KASHF_ESSENTIAL_DIGNITIES_EXISTING_DATA_VERIFICATION_REPORT.md`.
> Left in the numbered list below (struck through) for an accurate
> historical record of the original 14-item count, rather than silently
> renumbering to 13.

> **Second correction (a later round)**: items 8 and 9 below are also
> **not** actually missing. Item 9 (Sixteen Placement Orders) exists as
> `kashf-shibutzim.js` — 15 of 16 orders, source-verified. Item 8
> (מבקש/מבוקש במעגל) is split: its Requester half is already
> implemented, routed, and exposed; only its Requested half remains
> genuinely unresolved (blocked on a source-level arithmetic
> inconsistency, not an implementation gap). See
> `HALL_WISDOM_KASHF_L0_5_SIXTEEN_PLACEMENT_ORDERS_AUDIT.md`. Both left
> struck through below for an accurate historical record.

1. ~~Essential Dignities Table (p.97-99) — feeds two other techniques, zero code presence.~~ **Corrected: implemented, source-verified, 14 of 16 figures have data (the other 2 correctly absent from the source itself); not fully routed to its two intended downstream consumers (E, מבקש/מבוקש), but already consumed by Dhamir Type 2.**
2. Figure-to-lunar-month table (p.100) — matches CLAUDE.md's own documented gap.
3. Five Witnesses system E (p.130-131) — fully specified, zero code presence.
4. Seven Witnesses of Wisdom system F (p.164) — fully specified, zero code presence.
5. The 9 additional dhamir techniques beyond the core 8 (p.156-160).
6. Decision-oracle general-purpose pattern (p.170-171, 248-253, 267-269).
7. Sub-board-recast general-purpose pattern (p.253, ~262).
8. ~~"מבקש/מבוקש במעגל" trade-pricing technique (p.218-220).~~ **Corrected: SPLIT — the Requester half (p.219) is implemented, routed (under the `commerce` topic, `id: 'requester-circle-strength'`), and exposed via `kashf-reading-engine.js`, confirmed by direct execution to reproduce both worked examples exactly. Only the Requested half (p.220) remains genuinely unresolved — its own worked example's arithmetic does not verify under any interpretation tried.**
9. ~~Sixteen Placement Orders as a unified lookup module (p.104-151) — components may exist ad hoc inside individual functions, not verified.~~ **Corrected: implemented as `kashf-shibutzim.js` — 15 of 16 claimed orders exist, each with an explicit `sourceStatus`/`sourceRef`. Order 15 confirmed to genuinely lack a stated method in the source (not a digitization gap); the book's own "16 orders" claim is not resolved by Gate 3's own body text (only 15 headed sections found).**
10. Timing/duration scaling table (p.110, 118).
11. Distance-measurement system (p.121).
12. Dalail al-Fasl alternate length/width/depth table (p.114-116).
13. Property/real-estate sub-features (house4=land, house10=trees, etc., p.184-185) as a distinct sub-domain.
14. "כוח העדים" as a named, unified modulation mechanism (currently only ad hoc, if at all, inside individual topic formulas).

---

## Part 6 — Recommended first domain to complete

Per the Sub-Engine Inventory's summary and this audit's Part 3, **witness system F (Seven Witnesses of Wisdom, p.164)** is the recommended first domain: it is fully and unambiguously specified by the source (a plain majority count over 7 fixed houses), has zero code presence today, and would immediately extend witness coverage from 4 systems (A/C/D at structural-implementation level, B partial) to 5, closing the largest single gap identified in Part 3 at the lowest implementation complexity. System E (Five Witnesses) is higher-complexity regardless (a 5-tier scored mechanism vs. F's plain majority count) — **but its former blocking dependency, the Essential Dignities Table, is now confirmed already implemented and source-verified** (see the essential-dignities verification report), so E is a natural, now-unblocked second step, not gated behind building the Dignities Table first as originally stated here. This recommendation is not a decision to act on it — no implementation is authorized by this document; see the First-Implementation-Slice document's post-correction re-ranking for an updated cross-comparison.
