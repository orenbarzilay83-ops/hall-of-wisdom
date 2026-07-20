# HALL_WISDOM_KASHF_FIRST_IMPLEMENTATION_SLICE_RECOMMENDATION

> Planning only. No code changed. No commit/push/deploy. No AI call. No
> UI touched. No catalog record added. **This document recommends; it
> does not implement.** Per instruction, "easiest to build" is explicitly
> excluded as a standalone deciding factor — Seven Witnesses of Wisdom is
> evaluated on equal footing with the other options below, not
> pre-selected.

> **STATUS UPDATE — Option 3 (Essential Dignities Table / L0.3), this
> document's original recommended first slice, is now CONFIRMED ALREADY
> IMPLEMENTED.** A later verification round discovered `FIGURE_DIGNITIES`
> already exists in `kashf-figure-attributes-gate2.js`, is 100%
> source-verified (98/98 values), and is already consumed by Dhamir Type
> 2. No new data file was created. See
> `HALL_WISDOM_KASHF_ESSENTIAL_DIGNITIES_EXISTING_DATA_VERIFICATION_REPORT.md`
> for full detail. **The original analysis below (Options 1-4 and the
> "Recommendation" section) is left in place as the historical record of
> that round's reasoning — it is not deleted or rewritten.** A **new
> re-ranking**, reflecting this corrected status and covering the
> options you specified, appears in the new final section, "Re-Ranking
> After L0.3 Status Correction," below. No new slice has been chosen or
> started — the re-ranking is analysis only, per instruction.

---

## Candidates compared

Per instruction, at least 3 options are compared, including these three:

1. **Seven Witnesses of Wisdom** (L3.F, p.164)
2. **Completing missing dhamir methods** (the Face-3/Type-5 core gaps and/or
   the 9 additional p.156-160 techniques)
3. **Another shared-foundation engine the mapping showed missing** —
   selected here as the **Essential Dignities Table** (L0.3, p.97-99)

A 4th option is included for completeness, since it was also flagged as
a serious foundation candidate during the mapping:

4. **Sixteen Placement Orders module** (L0.5, p.104-151)

---

## Option 1 — Seven Witnesses of Wisdom (L3.F)

| Criterion | Assessment |
|---|---|
| Benefit | Adds a 6th, fully independent witness-evidence source; simplest possible mechanism (plain benefic/malefic majority over 7 fixed houses) |
| Dependency value | **Low** — nothing in the mapped system depends on L3.F existing. It is a leaf node: it consumes L0.1 and L1.1 (both already implemented) but unlocks no other engine and no question family's blocked technique |
| Source certainty | High — fully specified, no competing tradition, no internal contradiction found |
| Complexity | Low — a single majority-count function |
| Regression risk | Low — new standalone function, no existing code path touches it |
| Question families unlocked | **Zero with certainty** — witness systems are almost never invoked by name inside any topic formula (see Precedence Map §1.2); wiring F into any specific family's verdict would require an engineering decision the book does not make, not a sourced integration |
| Recommendation | **Good second or third slice, not first.** Its low complexity is real, but complexity alone does not create system value if nothing else in the map depends on it existing. Building it first would produce a working, source-correct, but functionally isolated piece — a valid choice for a later, low-risk-fill-in phase (see Roadmap Phase 3), not the highest-leverage starting point. |

## Option 2 — Completing missing dhamir methods

| Criterion | Assessment |
|---|---|
| Benefit | Closes the largest single numerically-disclosed gap in the whole mapping (17 methods described, 7 functions implemented, at most ~6-7 of 17 confirmed covered) |
| Dependency value | **Low-medium** — the majority-decision aggregator (L3.Dh10) already runs against however many methods exist; adding more methods deepens the vote's reliability but does not unblock any currently-blocked question family. No topic-family is `blocked-by-missing-dependency` on a *specific* dhamir method the way L4.13 (trade) is blocked on L0.3 |
| Source certainty | **Mixed** — the 8 core methods are fully specified with no ambiguity; several of the 9 additional techniques carry a "not revealed to everyone" esoteric framing (p.158) whose implementation-worthiness is itself unclear (Precedence Map §11.2), and the majority-vote's scope (8 vs 8+9) is explicitly unresolved by the source (Precedence Map §7.1) |
| Complexity | Low for the 2 confirmed-missing core methods (Type 5 circle-closure, and Face 3 pending a code-level re-check); low-to-medium per additional technique, but 9 separate small builds |
| Regression risk | **Medium** — this option touches `kashf-dhamir.js`, a file whose 6 existing functions are already wired into `computeDhamirByMajority` per a prior round's task list; adding new methods to the same aggregator changes the majority's composition and could shift existing verdicts for readings that are already relying on the current 6-7-method vote, even though runtime testing to confirm this was not performed this round |
| Question families unlocked | Zero directly — dhamir is confirmed topic-independent (no family gates its implementation on a specific dhamir method) |
| Recommendation | **Valuable, but not first.** The Face-3/Type-5 verification-first approach (Roadmap Phase 4) is low-risk and should happen early, but as a *verification* step, not a full "complete all 9 additional techniques" slice — the latter carries real regression risk to an already-live aggregator and touches an unresolved scope question (§7.1) that should arguably be answered by the user before any of the 9 are added to the vote. |

## Option 3 — Essential Dignities Table (L0.3)

| Criterion | Assessment |
|---|---|
| Benefit | Pure new data — a 16×7 correspondence table with zero interaction with any existing verdict logic |
| Dependency value | **High** — this is the clearest dependency-closing candidate found anywhere in the mapping. Two engines are structurally blocked on it: L3.E (Five Witnesses, a fully-specified but entirely unimplemented witness system) and L2.4 (מבקש/מבוקש במעגל, the trade-pricing technique with a **confirmed fully-worked source example**, p.219-220). Building L0.3 doesn't just add a table — it converts two `missing` engines into `buildable` ones |
| Source certainty | High — full table read and confirmed this round, no internal contradiction on the table's own content |
| Complexity | **Lowest of all four options** — no computation at all, pure lookup data, comparable in shape to data files already in the repo (figure-transits, figure-states) |
| Regression risk | **Near-zero** — new data file, not wired into any verdict path in this slice |
| Question families unlocked | Indirectly unlocks family L4.13 (tradeBuySellPricing)'s specific sub-technique once L2.4 is subsequently built, and provides the missing input for witness system E |
| Includes a possible Golden Test | **Yes — GT-10 (table-fidelity)**, and it is the direct prerequisite for **GT-3**, the single strongest Golden Test candidate in the entire mapping (fully-worked source example, clean dependency chain, no ambiguity) |
| Recommendation | **Strongest candidate for the first slice.** It is simultaneously the lowest-complexity, lowest-risk, and highest-dependency-value option — not a coincidence, but the direct result of it being pure Layer-0 data rather than a Layer-3/4 computational engine. |

## Option 4 — Sixteen Placement Orders module (L0.5)

| Criterion | Assessment |
|---|---|
| Benefit | Would close the second-largest infrastructure gap (16 correspondence tables feeding naming, timing, letter-magic, distance, money) |
| Dependency value | High in principle (feeds L2.1, L2.2, L2.4, GT-1, GT-2, GT-3), but **two of its 16 orders have confirmed source gaps** (Order 15's missing base-values; p.128-129's unresolved element-order pairings) |
| Source certainty | **Blocked** — per Roadmap Phase 0, this module cannot be honestly claimed complete until those 2 gaps are resolved or explicitly documented as permanent |
| Complexity | Medium-high — 16 distinct sub-tables, several with their own internal arithmetic derivation rules (Orders 8-12 derive from Order 7) |
| Regression risk | Low (new data), but the module's completeness claim is at risk if shipped with silent gaps |
| Question families unlocked | Same as Option 3's downstream value, but gated behind Phase 0 |
| Recommendation | **Strong second-wave candidate, not first.** Its dependency value rivals Option 3's, but it is the only option of the four that is `blocked-by-source-ambiguity` at the outset — Option 3 has no such block. A future round could reasonably sequence L0.5 immediately after L0.3, per the Roadmap's Phase 5. |

---

## Comparison summary table

| Option | Benefit | Dependency value | Source certainty | Complexity | Regression risk | Families unlocked | Recommendation |
|---|---|---|---|---|---|---|---|
| 1. Seven Witnesses of Wisdom | Medium | Low | High | Low | Low | 0 confirmed | Good later slice |
| 2. Dhamir gap completion | Medium-high | Low-medium | Mixed (esoteric framing + unresolved scope) | Low-medium | **Medium** (touches live aggregator) | 0 confirmed | Verification-first, not full completion, and not first |
| 3. Essential Dignities Table | High (indirect) | **High** | High | **Lowest** | **Near-zero** | 1 confirmed downstream (trade), 1 more enabled (witness E) | **Recommended first slice** |
| 4. Sixteen Placement Orders | High | High | **Blocked** (2 gaps) | Medium-high | Low | Same as #3, gated | Strong second-wave |

---

## Recommendation

**Implement the Essential Dignities Table (L0.3, p.97-99) as the first
implementation slice**, as pure Layer-0 data with no verdict-logic
wiring in this first slice — matching Roadmap Phase 1.

### Why this satisfies every stated requirement

- **Based on full and clear source**: yes — p.97-99 fully read, no
  competing tradition found for this specific table.
- **Not blocked by an unresolved contradiction**: correct — unlike
  Option 4, nothing about this table's own content is disputed.
- **Closes a real dependency for several topics**: yes — L3.E (witness
  system E) and L2.4 (trade-pricing technique, family L4.13) are both
  structurally blocked on it today; nothing else in the entire mapping
  unblocks two separate, previously-`missing` engines this cheaply.
- **Does not require mixing systems**: correct — it is a standalone data
  table, not a computation that touches dhamir, witnesses, or any topic
  formula simultaneously.
- **Includes a possible Golden Test**: yes — GT-10 directly, and it is
  the enabling prerequisite for GT-3, the single best-evidenced worked
  example found in the whole book.
- **Small enough for one commit or a defined series**: yes — comparable
  in size and shape to existing data files in
  `goral-hachol/data/sources/kashf-al-asrar/`.
- **Returns clear professional value**: honestly stated as **infrastructure
  value, not immediate standalone verdict value** — this table alone
  produces no verdict. Its value is entirely in what it unblocks. This
  is disclosed plainly, not inflated: a user expecting a new
  question-answering capability from this slice alone would be
  disappointed; a user expecting the fastest, safest path to two new
  engines becoming buildable would be well served.

### Why Seven Witnesses of Wisdom was not chosen despite being simpler

Complexity and risk are real criteria, and F scores well on both — but
the instruction is explicit that ease alone must not decide this. F is
a leaf node: nothing in the mapped 73-node dependency graph depends on
it. Building it first would be a safe, correct, but isolated addition —
it would not make any other currently-blocked engine buildable. The
Essential Dignities Table scores at least as well as F on complexity and
risk, while additionally scoring highest of all four options on
dependency value — the criterion F is weakest on. When two options tie
on safety/simplicity, the one that unblocks more future work is the
correct first slice.

### Why dhamir completion was not chosen

It carries the only **medium** regression-risk rating among the four
options, because it is the only one that modifies a file
(`kashf-dhamir.js`) already wired into a live aggregation function
(`computeDhamirByMajority`) per prior-round work — unlike the other three
options, which are all net-new, unwired additions. It also depends on
resolving an explicitly unstated source question (majority-vote scope,
Precedence Map §7.1) before "completion" can even be well-defined. A
narrow *verification* pass on the 2 confirmed-missing core methods
remains reasonable as an early, separate, low-risk phase (Roadmap Phase
4) — but full dhamir completion is not the recommended first slice.

---

## What this recommendation does NOT authorize

This document recommends a next step. It does not implement it. Per the
standing instruction governing this entire effort, no code will be
written, no file will be created inside
`goral-hachol/data/sources/kashf-al-asrar/`, and no commit will occur
until the user explicitly approves starting Roadmap Phase 1.

---

## Re-Ranking After L0.3 Status Correction

**No new slice is chosen here. This is a re-ranking of already-analyzed
options, reflecting L0.3's corrected status, as requested.** No
implementation is started by this section.

Five options are re-ranked: the 3 required (Seven Witnesses of Wisdom;
missing Dhamir methods; the L2.4 מבקש/מבוקש-במעגל circle technique),
plus the Five Witnesses system (L3.E) and one further dependent engine
that L0.3's now-confirmed existence opens up (L0.5, Sixteen Placement
Orders — still the other half of L2.4's dependency chain).

| Option | Dependency readiness | Source certainty | Missing dependencies | Golden Test availability | Complexity | Professional value | Regression risk |
|---|---|---|---|---|---|---|---|
| **Seven Witnesses of Wisdom (L3.F)** | Fully ready — depends only on L0.1, L1.1, both already implemented | High — fully specified, no competing tradition | None | No source-worked numeric example found; would need a hand-constructed test, clearly labeled non-source | Low — single majority-count function | Adds a 6th witness-evidence source; still a leaf (unlocks nothing else) | Low — new standalone function |
| **Missing Dhamir methods (Face-3/Type-5 core gaps, +9 additional)** | Partially ready — Face-3/Type-5 have no data dependency; the 9 additional techniques have mixed dependencies (some need L0.5, some need L1.4) | Mixed — core gaps fully specified; several of the 9 additional carry an "esoteric, not for everyone" framing (p.158) and the majority-vote's scope (8 vs 8+9) is source-unresolved | None for Face-3/Type-5 verification; L0.5 for the letters+10 variant among the 9 | No source-worked numeric example isolated for any of these | Low for Face-3/Type-5 verification; low-medium per additional technique | Closes the largest numerically-disclosed gap in the whole mapping, but with no downstream unlock | **Medium** — touches `kashf-dhamir.js`, already wired into a live aggregator; could shift existing verdicts |
| **L2.4 — מבקש/מבוקש במעגל (trade-pricing circle technique)** | **Improved — L0.3 dependency now satisfied.** Still depends on L0.5 (Order 1 seat-placement), which remains unbuilt | High — fully specified, with a confirmed fully-worked source example (p.219-220) | **Only L0.5 remains** (previously blocked on both L0.3 and L0.5) | **Yes — the strongest candidate in the whole mapping** (GT-3, p.219-220, exact worked numbers) | Medium — the technique itself is a moderate positional-counting algorithm; blocked until L0.5 exists | High — closes a real question-family gap (tradeBuySellPricing) with a verifiable, source-worked verdict | Low-medium — new function, first real verdict-facing consumer of L0.3 |
| **Five Witnesses (L3.E)** | **Improved — L0.3 dependency now satisfied.** No other missing dependency (L0.6 already implemented; L1.1 already implemented) | High for the mechanism itself; counter-tradition (בעלי הטבעים) rejects the whole apparatus and is not reconciled | None remaining | No source-worked numeric example found; a hand-constructed test would be needed | Medium-high — a 5-tier scored mechanism with conditional escalation logic, more intricate than F | Adds the fullest-mechanism witness system in the book; still a leaf (nothing else depends on it existing) | Low-medium — new standalone function |
| **L0.5 — Sixteen Placement Orders module** | Not ready — 2 of its 16 orders have confirmed, unresolved source gaps (Order 15 base-values; p.128-129 element-order pairings) | **Blocked** until Phase 0 (source clarification) resolves or explicitly documents those 2 gaps as permanent | Phase 0 completion | Table-fidelity Golden Tests possible for the 14 unblocked orders now; full 16 blocked on Phase 0 | Medium-high — 16 distinct sub-tables, several with internal arithmetic derivation | High — feeds L2.1, L2.2, and directly unblocks L2.4 (the only remaining blocker on GT-3, the strongest Golden Test in the mapping) | Low — new data, not wired to verdict logic |

### Reading of the re-ranking

- **L2.4 moved from "blocked by 2 dependencies" to "blocked by 1
  dependency" (L0.5 only)** — this is the single most consequential
  change from L0.3's status correction. It is now the option with the
  clearest path to unlocking the strongest Golden Test in the entire
  mapping (GT-3), contingent only on L0.5.
- **L3.E (Five Witnesses) is now fully dependency-ready** for the first
  time — no missing data blocks it anymore. It remains a leaf (nothing
  else in the map depends on it), same structural weakness as F, but it
  is now the more source-rich of the two "fully ready" witness options.
- **L0.5 is the one remaining structural blocker** shared by both L2.4
  and (to a lesser extent) the timing/money-magnitude infrastructure —
  but it is itself gated behind Phase 0's unresolved source gaps, so it
  cannot be honestly called "fully ready" the way F or E now are.
- **Dhamir gap-completion remains the only option with a non-low
  regression-risk rating**, unchanged by L0.3's status correction, since
  its risk comes from touching an already-wired aggregator, not from any
  data dependency.
- **F (Seven Witnesses) is unchanged** — L0.3's correction does not
  affect it either way, since it never depended on L0.3.

This re-ranking does not select a slice. It updates the readiness
picture so that a future, separately-authorized decision can be made
with accurate information — including the option of formally revisiting
the "first implementation slice" question now that its original answer
(L0.3) turned out to already be done.

---

## Second Re-Ranking (post-L0.5 audit) — the table above is now also stale

> **STATUS UPDATE**: the re-ranking table immediately above (built after
> the L0.3 correction) assumed L2.4 was "blocked by L0.5 only" and that
> L0.5 itself was "not ready." Both assumptions are now corrected by
> `HALL_WISDOM_KASHF_L0_5_SIXTEEN_PLACEMENT_ORDERS_AUDIT.md`:
> **L0.5 already exists (15/16 orders, source-verified) and L2.4's
> Requester half is already implemented, routed, and exposed.** The
> table above is left in place as the historical record of the prior
> round's reasoning; the table below reflects today's corrected
> understanding. **No new slice is selected here either** — this is a
> second readiness update, not a decision.

| Option | Source certainty | Implementation already present | Missing work | Dependency value | Regression risk | Golden Test readiness | Professional value |
|---|---|---|---|---|---|---|---|
| **GT-3A regression-lock (Requester circle, p.219)** | High — both worked examples exactly reproduced | **Fully present** — `computeRequesterCircleHouse`, `computeRequesterCircleStrengthKashf`, routed under `commerce`, exposed via the reading engine | None for the code itself; only the test needs writing | N/A — this is a test-writing task on top of already-working code | **Near-zero** — writing a test around already-correct, already-live behavior | **Ready today** | Protects already-shipped, already-correct behavior from silent future regression |
| **Requested circle (מבוקש, p.220) resolution/implementation** | **Blocked** — the source's own worked example does not verify under any interpretation tried | None | Targeted re-verification of p.220 against the original book (possibly requiring the physical/photographed source, not just this HTML digitization) before any code is written | Would complete L2.4 and unblock GT-3B | Low, once unblocked (new function, not touching L2.4A) | Not possible until the source ambiguity is resolved | Would close the one remaining gap in a question family (`tradeBuySellPricing`) that is otherwise the best-covered chapter after Money |
| **The 16th placement order (p.189 candidate)** | **Unresolved** — the book claims 16 orders, only 15 are headed in Gate 3's own body; the p.189 candidate is the closest completion found but not confirmed as "the" 16th | `SHIBUTZ_16_OPPOSITES_DEPTH_MEASURES` and `computeHiddenDepthByOpposites` already exist and are already routed (via `kashf-book-additions.js`) for their own purpose (hidden-object depth), independent of whether they are "the" missing 16th order | Confirming or refuting whether p.189 is genuinely the intended 16th, or whether a true 16th order exists elsewhere entirely undigitized | Low — nothing else in the map is currently known to depend on resolving this specific numbering question | None — no code change implied either way | N/A — a numbering/provenance question, not a testable mechanism | Low-medium — a completeness/accuracy question more than a functional gap |
| **Five Witnesses (L3.E)** | High for the mechanism; counter-tradition not reconciled | None — still fully unbuilt | The scoring engine itself, from scratch | Both its known dependencies (L0.3, L0.6) are now satisfied | Low-medium — new standalone function | No source-worked numeric example — a hand-constructed test would be needed | Adds the fullest-mechanism witness system in the book; still a leaf, unlocks nothing else |
| **Missing Dhamir methods** | Mixed — core gaps fully specified; several of the 9 additional carry esoteric framing; majority-vote scope unresolved | 7 of 17 methods already implemented | Face-3/Type-5 core gaps (verification first); 9 additional techniques (mixed complexity) | Low — no downstream engine depends on completing this | **Medium** — touches an already-wired live aggregator | No source-worked numeric example for any of the missing methods | Closes the largest numerically-disclosed gap in the whole mapping, but with no downstream unlock |
| **Another dependent engine (L2.1 "לשון העניין")** | Mixed — the literal description is verified, but the exact mechanical formula is explicitly flagged in `kashf-shibutzim.js` itself as "not verified against worked examples" | A first attempt exists (`kashf-leshon-hainyan.js`) but is **not consumed anywhere in the repo** (confirmed by `grep`) | Either verify the existing attempt against a worked example, or confirm it needs rework | Feeds money-magnitude and duration verdicts across several topics | Low — currently unwired, so no regression risk from further work | No isolated worked numeric example confirmed this round | Medium — a genuinely load-bearing timing mechanism once verified, but currently inert |

### Reading of the second re-ranking

- **GT-3A is now the single lowest-risk, highest-certainty action
  available anywhere in this whole project** — not because it's "easy,"
  but because the engineering work is already done and verified; only a
  regression-lock test remains to be written.
- **The Requested-circle (p.220) and 16th-order questions are both
  source-verification problems, not implementation problems** — neither
  should be "implemented" via a guess. Both require either the original
  photographed/physical source or a much more targeted re-read of the
  existing HTML than this round performed.
- **Five Witnesses (L3.E) remains the most straightforward genuinely-new
  engine to build**, now that both L0.3 and L0.6 are confirmed available
  — unchanged from the prior re-ranking's conclusion on this point.
- **Dhamir completion remains the highest-regression-risk option**,
  unchanged.

No slice is selected by this section either — per instruction, this
remains analysis only.
