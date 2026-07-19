# HALL_WISDOM_KASHF_FIRST_IMPLEMENTATION_SLICE_RECOMMENDATION

> Planning only. No code changed. No commit/push/deploy. No AI call. No
> UI touched. No catalog record added. **This document recommends; it
> does not implement.** Per instruction, "easiest to build" is explicitly
> excluded as a standalone deciding factor — Seven Witnesses of Wisdom is
> evaluated on equal footing with the other options below, not
> pre-selected.

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
