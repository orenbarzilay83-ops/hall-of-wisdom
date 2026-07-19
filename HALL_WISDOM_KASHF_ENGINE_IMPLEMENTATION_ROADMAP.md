# HALL_WISDOM_KASHF_ENGINE_IMPLEMENTATION_ROADMAP

> Planning only. No code changed. No commit/push/deploy. No AI call. No
> UI touched. No catalog record added. No engine implemented. This
> roadmap sequences FUTURE work — it does not perform any of it. Every
> phase below requires a separate, explicit approval before it starts,
> per the standing instruction governing this whole mapping effort.

---

## 1. Witness Systems Implementation Plan

Per instruction: **kept strictly separate — no merged "Witness Engine."**
Each system gets its own row with its own activation logic. This section
does not recommend building any of them yet — see document 4
(`HALL_WISDOM_KASHF_FIRST_IMPLEMENTATION_SLICE_RECOMMENDATION.md`) for
the actual sequencing recommendation.

| System | Source | Independent? | Depends on | Activation condition | Produces verdict or evidence? | Relationship to other systems known? | Implementation priority (informational only) | Source ambiguity | Permitted to implement now? |
|---|---|---|---|---|---|---|---|---|---|
| A — Six Pillars | p.41 | Yes (conceptual) | none | Always present as background context | Neither — a concept list, not a scorer | Not stated how it relates to B-F | N/A — not implementable as a function | None | N/A |
| B — Trine (+square/sextile) | p.43, 45 | Yes | none | Aspect-detection between figures | Evidence | Not stated | Low — content itself only partially re-verified | Square/sextile taxonomy not content-checked in any round | **No** — verify full aspect taxonomy first (targeted re-read, not implementation) |
| C — Basic house 13/14/15 testimony | p.53 | Yes | Board construction (L1.1) | Always active (structural) | Evidence | Not stated relative to D, E, F | Already structurally present | None | N/A — already exists structurally, nothing new to implement |
| D — Extended house-testimony | p.101-102 | Yes | Board construction (L1.1) | Always active (structural) | Evidence | Not stated relative to C, E, F — C and D appear to be two different-scope house-testimony schemes with no stated reconciliation | Already structurally present | Relationship to C unresolved (long-standing, flagged in prior rounds) | N/A — already exists structurally |
| E — Five Witnesses (degree-scoring) | p.130-131 | No — depends on Essential Dignities Table (L0.3) | L0.3, L0.6, L1.1 | Unspecified which topics invoke it | Scored evidence (1-15 scale) | Counter-tradition rejects the whole apparatus; not reconciled | Medium — high value, blocked by a real missing dependency | Active-tier-disagreement case not addressed; counter-tradition not reconciled | **Not yet** — L0.3 must exist first |
| F — Seven Witnesses of Wisdom | p.164 | Yes | Board construction (L1.1), figure classification (L0.1) | Majority-rule over houses 9-15(+16) | Direct majority verdict/evidence | Not stated relative to A-E | High on pure independence/simplicity — but see document 4 for why "simple" is not treated as the deciding factor | None — fully specified | **Not yet** — no engine implementation authorized this round for ANY system, F included |

**Explicit compliance note**: this table does **not** rank F above E
because F is easier. F is independent and E is dependency-blocked — that
is a factual, not a preference-based, distinction. Whether F should be
built before, after, or instead of completing L0.3 (which would unblock
both E and the trade-pricing technique L2.4) is a sequencing question
resolved in document 4, not here, and using multiple criteria, not
complexity alone.

---

## 2. Dhamir Implementation Plan

| Method | Source pages | Current status | Depends on | Inputs | Calculation (summary) | Output | Verdict role | Relevant questions | Test example in source? | Implementation complexity | Missing source clarification |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Type 1 Face 1 — mizan (Length) | 151-155 | `implemented-but-unverified` | L1.1 | Board | Walk balance-point through mothers/daughters | House landing | Hidden-intent reveal | dhamir-general | Not isolated this round | N/A — already coded | None |
| Type 1 Face 2 — harkat-al-ard (Width) | 151-155 | `implemented-but-unverified` | L1.1, L0.6 | Board | Count elements in balance figure, walk house15→1 | House landing | Same | dhamir-general | Not isolated | N/A — coded | None |
| Type 1 Face 3 — depth movement | 151-155 | `missing` (contradicts a prior working note — flagged, not resolved) | L1.1 | Board | Add houses1→8, subtract 8→16 | House landing | Same | dhamir-general | Not isolated | Low, if genuinely missing — mechanism is simple arithmetic | Code-level: does a function exist under an unrecognized name? |
| Type 1 Face 4 — jawharayn | 151-155 | `implemented-but-unverified` | L1.1, L0.6 | Board | Light+heavy point count, mod 12 | House landing | Same | dhamir-general | Not isolated | N/A — coded | None |
| Type 2 — element-prevalence (+ refinement) | 151-155 | `implemented-but-unverified` (core); `implemented-without-source-traceability` (refinement clause) | L0.6, L1.1 | Board | Element majority + root-vs-walk-path comparison | House landing + strength note | Same | dhamir-general | Not isolated | Low for the refinement clause specifically, if core is confirmed correct | "Stronger in its place" undefined |
| Type 3 — mothers-arithmetic | 151-155 | `ambiguous` (possible name-mismatch with `computeDhamirDoubledSquare`) | L1.1 | 4 mothers | Square odd-unit count, add itself, halve | House/figure | Same | dhamir-general | Not isolated | Low, if confirming an existing function | Book itself flags this method as error-prone ("if result changes, it's a mistake") — a self-declared reliability caveat, not a formula gap |
| Type 4 — opening/abjad (external) | 151-155 | `implemented-but-unverified` | L0.6 | Board point total | Total→letter(abjad)→figure | Figure | Same | dhamir-general | Not isolated | N/A — coded, dedicated file | None |
| Type 5 — circle-closure | 151-155 | `missing` | L1.1 | Board | Walk point, then walk landing further until repeat | House landing | Same | dhamir-general | Not isolated | Medium — iterative walk, needs a repeat-detection guard | None on content |
| "Additional way" (house-1 sevenths) | 155 | `missing`/`ambiguous` | L1.1 | House 1's 7th-face | True vs metaphorical joining/release test | Boolean-ish distinction | Same | dhamir-general | Not isolated | Medium — the true/metaphorical distinction is not formally specified | Distinction criterion not fully specified |
| Majority decision | 155 | `implemented-but-unverified` | All above (scope unresolved) | Set of dhamir results | Majority vote | Final dhamir verdict | Aggregation | dhamir-general | Not isolated | N/A — coded | **Scope unresolved: 8 core only, or +9 additional?** |
| 1. מיזוג הצורות (figure-pairing, mod 8) | 156-157 | `missing` | L1.1, L0.6 | House-1 figure | Mod-8 reduction to find "seeking" partner (8 fixed pairs) | Paired figure | Alternate reveal | dhamir-general | Named example implied, not isolated | Low-medium | Attribution (Al-Zanati) noted, not a content gap |
| 2. דרך המעגל (circle-way) | 157 | `missing` | L1.1 | Figure in house 1 | Examine that figure's own 7th-house content | House/theme | Alternate reveal | dhamir-general | Illustrative case given | Low-medium | Distinct from Type 5 — must not be conflated in code naming |
| 3a. קוטרי branch | 157-158 | `missing` | L1.4, L0.6 | Board (diametric) | Water+earth points mod 9, cast from house 1 | House landing | Alternate reveal | dhamir-general | Not isolated | Low | None |
| 3b. צלעי branch | 157-158 | `missing` | L1.4, L0.6 | Board (lateral) | Water+air points mod 12, cast from house 1 | House landing | Alternate reveal | dhamir-general | Not isolated | Low | None |
| 4. Letters+10 mod 12 | 158 | `missing` | L1.1, L0.5 (Order 6) | 4 mothers | Sum letter-roots, +10, mod 12, cast | House landing | Alternate reveal | dhamir-general | Not isolated | Medium — depends on unimplemented L0.5 | "Not revealed to everyone" (esoteric framing) — implementation-worthiness itself unclear |
| 5. House-1/15 repetition check | 158 | `missing` | L1.1 | Board | Pattern-match: does house1 or house15 figure recur elsewhere? | Boolean + location | Alternate reveal | dhamir-general | Not isolated | Low — simplest of the 9 | None |
| 6. Angular-points derived-figure | 158 | `missing` | L1.1 | Houses 1,4,7,10 | Combine into 1 new figure, locate it | House landing | Alternate reveal | dhamir-general | Not isolated | Medium | None |
| 7. Houses 9-12 heads+feet combination | 159 | `missing` | L1.1 | Houses 9-12 | Combine "heads" → 1 figure, "feet" → 1 figure, combine again | House landing | Alternate reveal | dhamir-general | "Correct and tested way" (source's own framing) | Medium-high | None |
| 8. Houses 1/4/7/10 heads combination | 159 | `missing` | L1.1 | Houses 1,4,7,10 | Heads + second-order "heads of heads," combine, locate | House landing | Alternate reveal | dhamir-general | Not isolated | Medium-high | None |
| 9a-c. Numeric-reduction "poetic" variants (mod 8/9/12) | 159-160 | `missing` | L0.6, L1.1 | Full board point sum | Reduce mod N, cast; one variant also yields subject gender | House landing (+gender for one variant) | Alternate reveal | dhamir-general | Not isolated | Low each | None |

### Re-verified gap between book / catalog / code / active

- **Methods described in the book (this round's full read)**: 17 (8 core
  sub-methods + 9 additional, per the Session Report's disclosed count,
  itself qualified as "8+9" rather than a flat 17 given the family
  resemblance among several of the 9).
- **Methods with a catalog entry** (`kashf-book-rule-catalog.js`,
  13-entry catalog): 1 (`kashf-p155-dhamir-majority-decision` — the
  aggregation rule only; none of the individual methods themselves have
  catalog rows).
- **Methods with an existing function in `kashf-dhamir.js`**: 6 confirmed
  by direct export-name inspection this round (`computeDhamirMizan`,
  `computeDhamirHarkatAlArd`, `computeDhamirJawharayn`,
  `computeDhamirDoubledSquare`, `computeDhamirElementPrevalence`,
  `computeDhamirByMajority`), plus 1 more in a dedicated file
  (`kashf-dhamir-type4-external.js`) = **7 implemented functions total**,
  against at most 9 of the 17 methods they could plausibly map to (Faces
  1/2/4, Type 2, Type 4, majority, and a possible-but-unconfirmed Type 3
  via `computeDhamirDoubledSquare`) — **2 of the 8 core methods (Face 3,
  Type 5) and all 9 additional techniques have no implementation**.
- **Methods confirmed actually running/wired into live output**: **not
  verified this round** (runtime testing was prohibited by instruction);
  a prior round's task list records "Wire kashf-dhamir.js into live Kashf
  reading output" as completed, but this was not re-confirmed against
  the current file state this round.

**This round's mapping explicitly does NOT assume 5/8 (or 6/8, or 7/9)
is the final state.** The count stands as: 17 methods described in the
fully-read source, 1 aggregation rule catalogued, 7 functions
implemented in code (covering at most 6-7 of the 17 methods with
certainty, 1 more — Type 3 — unconfirmed), 0 of the 9 additional
techniques implemented, and live-routing status unverified this round.

---

## 3. Question-Family Completion Order

For each of the 21 families (Layer 4 in the Dependency Graph), a
readiness assessment and a proposed completion order — proposed, not
decided, and explicitly not ranked by ease alone.

| Order | Family | Required engines (beyond L1.1) | Existing coverage | Missing coverage | Unresolved rules | Source examples | Readiness % (informational estimate) | Risk if implemented now |
|---|---|---|---|---|---|---|---|---|
| 1 | money | L2.2, L0.6 | Primary/alt formula + source-of-money oracle confirmed exact match | Money-magnitude table cross-check unconfirmed | None | Yes | ~85% | Low — best-verified chapter in the whole book |
| 2 | completion | none beyond L1.1 | Primary/alt formula confirmed exact match, correct page (p.173) | None identified | None | Yes | ~85% | Low |
| 3 | spiritualDiagnostics | L0.6 | 2 formulas confirmed, catalogued | 20 additional Chapter-1 sub-rules (decision-oracle, request-lifecycle framework, etc.) not covered | None on the 5 covered rules | Yes | ~40% for the full chapter, ~90% for the 5 already-catalogued rules | Medium — chapter is far larger than what's covered; risk of a reading claiming "spiritualDiagnostics is done" when only 5 of ~25 sub-rules are in |
| 4 | siblingsAndTravelShort | none beyond L1.1 | topicIds exist | Formula-level cross-check not performed | None | Partial | Unknown — needs verification before a % can be assigned | Low-medium |
| 5 | illnessLostAnimals | none beyond L1.1 | topicIds exist | 2 lookup tables (body-part×16, animal-type) not verified against code | None | Yes, both tables | Unknown | Low-medium — tables are concrete, low-ambiguity if added |
| 6 | theftAndLoan | none beyond L1.1 | topicIds exist | Thief-description table (×16), kinship-mapping table not verified | None | Partial (descriptive table, no numeric worked example) | Unknown | Low-medium |
| 7 | enemiesPrisoners | none beyond L1.1 | topicId exists | Prisoner-outcome figure-pair table not verified | None | Yes | Unknown | Low-medium |
| 8 | lineageOccupationDream | none beyond L1.1 | topicId unclear (short chapter) | Occupation-by-planet table not verified | None | Not isolated | Unknown | Low |
| 9 | debtPromise | none beyond L1.1 | topicId unclear | Verdict table not verified | 2 external sources cited, not reconciled | Yes | Unknown | Medium — external-source reconciliation needed first |
| 10 | travel | none beyond L1.1 | topicId "likely catalogued," unverified | Ship-damage table not verified | None | Yes | Unknown | Low-medium |
| 11 | missingPerson | L1.5, L2.3 | topicId "likely catalogued," unverified | Sub-board-recast and decision-oracle dependencies both unimplemented | None on missingPerson itself; L1.5's general applicability is open | Yes | Low until L1.5/L2.3 exist | **High if attempted before L1.5/L2.3** — would require building topic-specific one-off logic that duplicates future general infrastructure |
| 12 | authorityState | L1.5 | topicIds exist | Ruler's-12-house table, dynasty-continuation recast not verified | None | Yes | Low until L1.5 exists | Same dependency risk as missingPerson |
| 13 | parentsPropertyHidden | L0.8 | topicIds exist | ~8-method hidden-object sub-system, water-depth table not verified | None | Yes, multiple worked examples | Unknown | Medium — large, dense sub-system |
| 14 | marriageSeekerSought | none beyond L1.1 (though figure-character rules reference dignities informally) | topicId exists | ~15 formulas not verified against code | None flagged this round | Yes | Unknown | Medium — dense chapter |
| 15 | winnerLoser | none beyond L1.1 | topicId exists | Dual-board army-comparison, city-conquest table not verified | None | Yes | Unknown | Medium |
| 16 | tradeBuySellPricing | L2.4, L0.3, L0.5 | topicId exists (`commerce`) | מבקש/מבוקש-במעגל technique entirely dependent on unimplemented L0.3/L0.5 | None on the technique itself | Yes, fully worked | Low until L0.3/L0.5 exist | **High if attempted before L0.3/L0.5** |
| 17 | friendsHopeLifeLove | L2.3 | topicId `friendsHope` confirmed to already exist | Livelihood-oracle, friend-type, clothing-color tables not verified | **קהלה double-entry in livelihood table — source-level ambiguity** | Yes | Unknown, capped by the ambiguity | Medium-high — the table itself needs a targeted re-check before any digitization, independent of code work |
| 18 | childrenPregnancy | none beyond L1.1 | topicId exists | Gender-determination sub-rules not verified | **4-5 competing gender methods, not reconciled by the book** | Yes | Unknown, capped by the ambiguity | **High** — implementing any ONE gender method without user guidance risks silently picking a side the book itself didn't pick |
| 19 | decisionOracleSixteenFigure | L2.3 | Not a `kashf-topic-rules.js` topicId — general-purpose pattern, not topic-bound | Entire pattern unimplemented | קהלה double-entry affects one of its 3 known table instances (p.267-269) | Yes, 3 full tables | 0% | Low complexity, but same table-ambiguity caveat for one of its 3 instances |
| 20 | authority sub-board pattern (shared with #11, #12) | L1.5 | — | Entire pattern unimplemented | Whether it generalizes beyond the 2 confirmed instances is unstated | 2 procedural instances, not fully numerically worked | 0% | Building it topic-specifically (inside #11 or #12 alone) risks the same "premature specificity" issue noted for those rows |
| 21 | marriage-adjacent dignity techniques (feeds #14, #16 partially) | L0.3 | — | Entirely unimplemented | None on the table itself | — | 0% | Foundational — see document 4 |

### Completion-order rationale (not "easiest first")

1. **Dependencies**: families 11, 12, 16 are explicitly flagged as
   high-risk to implement before their shared infrastructure (L1.5
   sub-board-recast; L2.4/L0.3/L0.5 for trade) exists — doing so would
   produce topic-specific one-off code that duplicates work needed again
   later.
2. **Source completeness**: families 9 (debtPromise) and 17
   (friendsHopeLifeLove) carry unresolved internal source ambiguities
   (external-source reconciliation; קהלה double-entry) that should be
   targeted-re-checked in the source **before** any code work, independent
   of implementation order.
3. **Golden Test buildability**: families 1, 2, 6, 10, 21 (money,
   completion, theftAndLoan's table, travel's table, dignities table)
   have concrete, source-verified, low-ambiguity content well-suited to
   Golden Tests — see document 3.
4. **Professional importance**: money and completion are both already
   near-complete and high-traffic question types per the existing
   topicId structure — low-risk places to consolidate before expanding.
5. **Risk of rule-mixing**: family 18 (childrenPregnancy) is flagged
   `blocked-by-source-ambiguity` specifically to prevent silently
   choosing among 4-5 competing gender methods without user sign-off —
   this is a "do not implement yet" flag, not a low-priority ranking.
6. **Downstream unlock value**: family 21 (dignities table, which is
   really L0.3 from the Dependency Graph, not a question family in its
   own right) unlocks both family 16 (trade) and witness system E — see
   document 4 for the full cross-comparison.

This ordering is a **planning input**, not an implementation schedule —
no phase below is authorized to start without separate approval.

---

## 4. Traceability Architecture (design only — nothing implemented)

Per instruction, this section designs how a future implementation
**would** record rule usage — it does not build it.

### Proposed field set per reading (design sketch)

| Field | Purpose | Populated by (future) |
|---|---|---|
| `candidateBookRules` | Every book rule structurally relevant to the question, before narrowing | A future candidate-collection stage (L7.1) |
| `selectedBookRules` | The subset the rule-selector actually chose | `kashf-book-rule-selector.js` (L7.2) — exists today, scope of its current selection logic not verified this round |
| `evaluatedBookRules` | Rules whose calculation actually ran against this board | `kashf-formula-engine.js` / `kashf-reading-engine.js` (L7.3) |
| `appliedBookRules` | Subset of evaluated rules whose result actually changed the verdict | **Not identified as a distinct tracked field in current code** — this is the single most important gap for any future "is this rule actually doing anything" audit |
| `rejectedBookRules` | Rules that were candidates but explicitly not selected, with why | Not identified |
| `missingRelevantRules` | Rules the book has, that this reading's question-type would benefit from, but that are not yet implemented at all | Not identified — would need to reference the Coverage Audit's gap list at runtime |
| `unresolvedRules` | Rules that fired but hit a source-level ambiguity (e.g. childrenPregnancy's gender methods) requiring a flagged, not-silently-resolved output | Not identified |
| `sourceEvidence` | Page citation + exact/paraphrased text for each applied rule | Partially present via existing `sourceStatus` fields on data records; not confirmed to propagate through to a per-reading trace |
| `runtimeEvidence` | The actual computed intermediate values (house numbers, point counts) for each applied rule, for this specific board | Not identified as a structured per-reading record |
| `verdictImpact` | Explicit statement of how each applied rule changed (or did not change) the final verdict | Not identified |
| `conflictResolution` | If two applied rules disagreed, what happened and why | Not identified — consistent with L5.4/L6.2's finding that no unified precedence mechanism exists in code today |

### Design principle carried forward from the prior semantic-correction round

**`implemented` must never be displayed or logged as `applied`.** A rule
can be implemented, selected for this question type, and even evaluated
against this specific board, and still have zero effect on the verdict
(e.g. because a threshold wasn't met, or because a higher-precedence rule
already decided the outcome). Any future traceability implementation
must keep these as genuinely separate fields with genuinely different
population logic — not derive one from another by assumption.

### What this section does NOT do

It does not propose a schema migration, a new file, a new data
structure in code, or a UI display of any of these fields. It is a
design vocabulary for the phases in Section 5 below to reference.

---

## 5. שלבי הבנייה (Build Phases)

Every phase below is a **future proposal**. None is authorized to begin.
Each requires separate, explicit approval, and — per instruction — the
roadmap starts with shared foundations, not with spiritual diagnostics
and not with a single witness engine.

### Phase 0 — Source clarification pass (no code)
- **Objective**: Resolve, or explicitly confirm as permanently
  unresolved, the source-level ambiguities that block downstream work:
  Order 15's missing element base-values, the p.128-129 element-order
  pairing gap, Chapter 5's gender-method plurality (childrenPregnancy),
  Chapter 11's קהלה double-entry.
- **Engines included**: none — this is a targeted re-reading pass, not
  an engine phase.
- **Dependencies**: none.
- **Files likely involved**: none (research only, possibly a small
  addendum note to the Structure Map).
- **Source pages**: 150 (Order 15), 128-129, 191-196, 267-269.
- **Tests required**: none.
- **Completion criteria**: each ambiguity is either resolved with a
  quoted source passage, or explicitly confirmed unresolvable and
  flagged for a user decision.
- **Regression risk**: none — no code touched.
- **Deploy needed?** No. **Live AI pilot needed?** No.

### Phase 1 — Layer 0 foundational data entry (no verdict logic)
- **Objective**: Digitize the Essential Dignities Table (L0.3) and,
  if approved separately, the Figure-to-Lunar-Month Table (L0.4) as pure
  data — no computation, no verdict wiring.
- **Engines included**: L0.3, optionally L0.4.
- **Dependencies**: Phase 0 not required for these two (no ambiguity
  flagged on their content).
- **Files likely involved**: a new data file under
  `goral-hachol/data/sources/kashf-al-asrar/` (exact path/naming not
  decided here — a naming decision for the approval step, not this
  document).
- **Source pages**: 97-99, 100.
- **Tests required**: a table-fidelity Golden Test (verify all 16
  figures' 7 dignity fields against the source text) — see document 3.
- **Completion criteria**: data file exists, matches source exactly,
  is NOT yet wired into any verdict-producing code path.
- **Regression risk**: near-zero — pure new data, no existing code path
  touches it yet.
- **Deploy needed?** No. **Live AI pilot needed?** No.

### Phase 2 — Layer 1 board-construction traceability verification
- **Objective**: Confirm (not re-implement) that `raml-board-generator.js`
  actually matches the book's p.28-36 algorithm and p.34 validation rule,
  closing the `implemented-without-source-traceability` status on L1.1
  and the `ambiguous` status on L1.2/L1.3.
- **Engines included**: L1.1, L1.2, L1.3.
- **Dependencies**: none.
- **Files likely involved**: `raml-board-generator.js` (read-only
  verification).
- **Source pages**: 28-36.
- **Tests required**: none new — this is a verification pass; existing
  behavior, if confirmed correct, needs no test changes.
- **Completion criteria**: written confirmation (or a list of specific
  discrepancies) comparing the function to the source algorithm,
  line-by-line for the core construction steps.
- **Regression risk**: none if verification-only; would become
  non-zero only if a discrepancy is found and a fix is separately
  authorized.
- **Deploy needed?** No. **Live AI pilot needed?** No.

### Phase 3 — Witness System F implementation (conditional on document 4's outcome)
- **Objective**: Implement Seven Witnesses of Wisdom (L3.F) as a
  standalone, independently-callable function — not merged with any
  other witness system.
- **Engines included**: L3.F only.
- **Dependencies**: L0.1, L1.1 (both already implemented).
- **Files likely involved**: a new function, likely alongside
  `kashf-dhamir.js`'s sibling witness-scoring code (exact file not
  decided here).
- **Source pages**: 164.
- **Tests required**: a Golden Test using a constructed board with a
  known 9-15 majority.
- **Completion criteria**: function returns correct majority verdict for
  at least 3 hand-constructed test boards (benefic-majority,
  malefic-majority, tie/mixed case — noting the book doesn't specify a
  tie-break, which the test would need to surface, not invent).
- **Regression risk**: low — new standalone function, not wired into
  any existing verdict path until a separate wiring approval.
- **Deploy needed?** No (still local/test-only until wiring + deploy
  separately approved). **Live AI pilot needed?** No.

### Phase 4 — Dhamir gap closure, Tier 1 (verification, not new methods)
- **Objective**: Resolve the L3.Dh3 (Face 3) and L3.Dh6 (Type 3)
  discrepancies found in this round's audit — confirm whether they exist
  under different names or are genuinely missing.
- **Engines included**: L3.Dh3, L3.Dh6.
- **Dependencies**: none.
- **Files likely involved**: `kashf-dhamir.js` (read-only verification
  first; implementation only if confirmed missing and separately
  approved).
- **Source pages**: 151-155.
- **Tests required**: none for the verification step.
- **Completion criteria**: written confirmation of each function's
  actual mechanism vs. the book's Face-3/Type-3 description.
- **Regression risk**: none for verification; low for any resulting
  fix, since these would be net-new or corrected functions, not edits
  to already-relied-upon dhamir methods.
- **Deploy needed?** No. **Live AI pilot needed?** No.

### Phase 5 — Layer 0 completion: Sixteen Placement Orders module
- **Objective**: Build the 16-placement-orders lookup module (L0.5) as
  a unified, reusable data+lookup layer, resolving the Order-15 and
  p.128-129 gaps from Phase 0 first.
- **Engines included**: L0.5.
- **Dependencies**: Phase 0 (must resolve Order 15 / p.128-129 gaps
  first, or explicitly document them as permanently unresolved).
- **Files likely involved**: new data module (path TBD at approval time).
- **Source pages**: 104-151.
- **Tests required**: table-fidelity Golden Tests for each of the 16
  orders.
- **Completion criteria**: all 16 orders digitized and independently
  verifiable against source; 2 known gaps either closed or explicitly
  documented as permanent.
- **Regression risk**: near-zero — pure data, not wired to verdict logic
  in this phase.
- **Deploy needed?** No. **Live AI pilot needed?** No.

### Phase 6 — Trade-pricing technique (L2.4) + Witness E, contingent on Phases 1 and 5
- **Objective**: With L0.3 (Phase 1) and L0.5 (Phase 5) both in place,
  implement L2.4 (מבקש/מבוקש במעגל) and, separately, L3.E (Five
  Witnesses) — each independently testable against their respective
  worked examples.
- **Engines included**: L2.4, L3.E.
- **Dependencies**: Phase 1, Phase 5.
- **Files likely involved**: new functions, files TBD.
- **Source pages**: 218-220 (L2.4), 130-131 (L3.E).
- **Tests required**: L2.4 has a fully-worked source example (p.219-220)
  — a strong Golden Test candidate. L3.E has no isolated worked numeric
  example found this round — a hand-constructed test would be needed,
  clearly labeled as engineering-constructed, not source-worked.
- **Completion criteria**: L2.4 reproduces the p.219-220 worked example
  exactly; L3.E produces internally consistent scores on constructed
  test boards.
- **Regression risk**: low-medium — first real consumers of L0.3/L0.5,
  so any latent error in those data layers surfaces here.
- **Deploy needed?** No. **Live AI pilot needed?** No.

### Phase 7 — Question-family formula-level verification sweep
- **Objective**: Systematically cross-check each of the 21 families'
  `kashf-topic-rules.js` formula bodies against the source pages, per
  family, in the order proposed in Section 3 above (money and
  completion already done; proceed through the remaining 19).
- **Engines included**: L4.1-21 (verification, not new implementation,
  except where a gap is confirmed and separately approved).
- **Dependencies**: none technically, though families 11/12/16/18/17
  should wait for Phases 5-6 and Phase 0 respectively per Section 3's
  dependency and ambiguity flags.
- **Files likely involved**: `kashf-topic-rules.js` (read-only per
  sub-phase, until a specific fix is separately approved).
- **Source pages**: as listed per family in Section 3.
- **Tests required**: Golden Tests per family, prioritized by the order
  in Section 3.
- **Completion criteria**: each family's coverage status upgraded from
  `partially-implemented`/`conditional` to either `verified-complete` or
  a documented, specific list of confirmed gaps.
- **Regression risk**: low for verification; risk profile of any
  resulting fix depends on the specific family (highest for
  childrenPregnancy given the gender-method ambiguity — any fix there
  requires explicit user sign-off on which method to encode, not an
  engineering decision).
- **Deploy needed?** No. **Live AI pilot needed?** No.

### Phase 8 — Traceability field implementation
- **Objective**: Implement the `appliedBookRules` / `rejectedBookRules`
  / `verdictImpact` / `conflictResolution` fields designed in Section 4,
  once enough of Layers 0-5 exist that there is something meaningful to
  trace.
- **Engines included**: L7.1-7.7.
- **Dependencies**: Phases 1-7 (meaningful traceability requires
  meaningful rule coverage to trace).
- **Files likely involved**: `kashf-book-rule-selector.js`,
  `kashf-formula-engine.js`, `kashf-reading-engine.js`.
- **Source pages**: N/A — engineering design, not source-derived.
- **Tests required**: tests confirming `applied` is never silently
  equated with `implemented` or `selected`.
- **Completion criteria**: a real reading's trace can answer, per rule,
  all 7 axis-questions from Part 1 of the Coverage Audit.
- **Regression risk**: medium — touches shared pipeline files serving
  multiple topic families simultaneously.
- **Deploy needed?** Only once explicitly approved as a separate step;
  not implied by this phase's completion. **Live AI pilot needed?** No —
  this is deterministic-engine traceability, independent of any AI
  layer.

### Phase 9 — (not authorized to name a target here) Live AI pilot
- Explicitly **not planned in detail by this document**. Per the
  standing project-level plan (`ai/provider` skeleton work, already
  separately gated behind its own explicit stop condition), any live AI
  connection is a distinct, separately-approved initiative and is
  **out of scope for this Kashf-engine roadmap** — noted here only so
  the roadmap doesn't appear to silently assume it.

---

## Summary

This roadmap sequences 9 phases, starting with source clarification and
foundational data (Phases 0-1), through board-construction verification
(Phase 2), a single independently-testable witness system (Phase 3,
contingent on document 4's comparison, not pre-decided here), dhamir
gap-verification (Phase 4), remaining Layer-0 infrastructure (Phase 5),
the two engines that Layer-0 completion unlocks (Phase 6), a full
topic-family verification sweep (Phase 7), and traceability
implementation (Phase 8) — deliberately **not** starting with
spiritualDiagnostics expansion or a single witness engine, per
instruction. No phase is authorized to begin without a separate,
explicit approval, and no phase in this document includes a Commit,
Push, Deploy, or live AI call.
