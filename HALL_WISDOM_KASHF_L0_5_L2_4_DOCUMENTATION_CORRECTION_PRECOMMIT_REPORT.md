# HALL_WISDOM_KASHF_L0_5_L2_4_DOCUMENTATION_CORRECTION_PRECOMMIT_REPORT

> Precommit report only. No code changed. No `kashf-shibutzim.js`
> change. No new implementation. No Commit/Push performed for this
> round's documentation edits. No Deploy. No AI call. No Hawi fix.

---

## 1. Documents corrected (targeted edits, not rewrites)

Per your explicit authorization, the following 8 documents received
surgical status corrections for L0.5 and/or L2.4 (the 6 you named + 2
additional documents found, per your "any additional document, if one
exists" instruction, to also declare L0.5/L2.4 as `missing`):

| Document | What was corrected |
|---|---|
| `HALL_WISDOM_KASHF_MASTER_ENGINE_DEPENDENCY_GRAPH.md` | Graph-overview status tags for L0.5 and L2.4; L0.5's full node (status, code path, source pages); L2.4's node split into L2.4A/L2.4B; the L4.13 topic-family row; L2.1's dependency line unaffected (already correct) |
| `HALL_WISDOM_KASHF_ENGINE_IMPLEMENTATION_ROADMAP.md` | Dhamir additional-technique #4's L0.5 dependency note; question-family row #16 (tradeBuySellPricing); Phase 5 (rewritten from "build L0.5" to "verify Order 15 / p.189 only"); Phase 6 (rewritten to reflect L2.4A already done, L2.4B blocked) |
| `HALL_WISDOM_KASHF_SUB_ENGINE_INVENTORY.md` | §8 (Sixteen Placement Orders) full node; §24 split into §24A (Requester, implemented) and §24B (Requested, unresolved); the summary status-breakdown tally |
| `HALL_WISDOM_KASHF_BOOK_TO_CODE_COVERAGE_AUDIT.md` | Part 5's numbered-list items 8 and 9 (struck through, corrected); the Ch.7 coverage-table row |
| `HALL_WISDOM_KASHF_GOLDEN_TEST_STRATEGY.md` | GT-1 and GT-2's L0.5-blocked status; GT-3 split into GT-3A (regression-lock, ready today) and GT-3B (blocked); the prioritization-tier list |
| `HALL_WISDOM_KASHF_FIRST_IMPLEMENTATION_SLICE_RECOMMENDATION.md` | A new "Second Re-Ranking (post-L0.5 audit)" section appended (original re-ranking table left as historical record, not deleted) |
| `HALL_WISDOM_KASHF_FULL_BOOK_MAPPING_SESSION_REPORT.md` | "Which domains are entirely missing" — 2 more items struck through, tally corrected from 13 to 11 remaining |
| `HALL_WISDOM_KASHF_ESSENTIAL_DIGNITIES_EXISTING_DATA_VERIFICATION_REPORT.md` | §11a's re-ranking summary — correction banner added, original text kept as historical record |

**No document was rewritten in full.** Every edit is a targeted
insertion or table-cell replacement; original stale text is preserved
(often struck through or placed under an explicit "STATUS CORRECTED"
banner) rather than silently deleted, matching the discipline already
established in the L0.3 correction round.

---

## 2. L0.5's corrected status

**Old (incorrect)**: `missing` / `missing as a unified module` /
`ambiguous`.

**New**: **`implemented-data-layer` + `source-verified-for-15-orders` +
`one-order-unresolved` + not-fully-routed-to-all-dependent-engines`.**

- 15 of the claimed 16 placement orders exist as rigorously source-cited
  exports in `kashf-shibutzim.js` (`goral-hachol/data/sources/kashf-al-
  asrar/kashf-shibutzim.js`, 934 lines).
- The book itself claims "16 placement orders" (opening and closing
  lines of Gate 3), but only 15 distinctly-headed sections exist within
  Gate 3's own body (verified by exhaustive heading grep, not assumed).
- A candidate 16th order ("שיבוץ ההפכים," p.189) exists, but in a
  **different chapter entirely** (Gate 6, not Gate 3) — not confirmed as
  "the" missing 16th.
- `kashf-shibutzim.js` is the active, correct data source. **No new data
  file was created or is needed.**
- Orders 1, 2 (canonical number), and 3 (element values) are already
  consumed by `kashf-dhamir.js`. Order 1 is already consumed by L2.4A
  (see below). Not all 15 orders are yet routed to a consumer — this is
  disclosed, not overstated.

---

## 3. L2.4's split status

**Old (incorrect)**: `missing`, treated as a single undivided technique.

**New**: two genuinely distinct rules, verified separately.

### L2.4A — Requester (מבקש), p.219
**Status: `implemented` + `routed` + `exposed` + `source-example-reproduced`.**

Code paths documented:
- `computeRequesterCircleHouse` — `goral-hachol/data/sources/kashf-al-
  asrar/kashf-shibutzim.js`
- `REQUEST_CIRCLE_HONOR_HOUSES` — same file, verified for exactly 2 of
  16 figures (שפל ראש, כבוד נכנס), correctly refusing to guess the rest
- `computeRequesterCircleStrengthKashf` — `goral-hachol/engine/kashf-
  book-additions.js`, wraps the above into a narrative-producing function
- `kashf-topic-rules.js` — registers it as `id: 'requester-circle-
  strength'` under the `commerce` topic (line ~1452)
- `kashf-reading-engine.js` — imports and dispatches it (lines 87, 141)

### L2.4B — Requested (מבוקש), p.220
**Status: `unverified` / `unresolved` / `missing`.**

No code exists anywhere in the repo (confirmed by `grep`). Not merely
unbuilt — the source's own single worked example (ממון יוצא, "house of
honor" stated as 4) does not resolve to its own stated result (7) under
any counting interpretation tried, in this round or a prior one. This is
a source-level problem that cannot be closed by writing more code.

---

## 4. GT-3A / GT-3B

| | GT-3A (Requester, p.219) | GT-3B (Requested, p.220) |
|---|---|---|
| Status | Regression-lock, **ready to write today** | Blocked |
| Reproduction | **Exact** — confirmed by direct execution this round | Does not reproduce under any interpretation tried |
| Example 1 | שפל ראש: 8 → 10 → house 10 | ממון יוצא: 4 → claimed 7 (does not resolve) |
| Example 2 | כבוד נכנס: 12 → 6 → house 6 | — |
| Next step | Write the test — no new engine work needed | Do not write an expected verdict until the source ambiguity is resolved |

Both were previously bundled as a single "GT-3" with a `fail` status.
That framing is now corrected in `HALL_WISDOM_KASHF_GOLDEN_TEST_
STRATEGY.md`.

---

## 5. Map of the four "מושב/מעלה/בית כבוד" traditions

| Tradition | Source page | Professional context | Current code representation | Comparison status | Disagreement count | Interchangeable? |
|---|---|---|---|---|---|---|
| Essential Dignities Table — `moshavHouse` (מושב) | 97-99 | Gate 2's per-figure exaltation/domicile/bound/face/joy/sorrow/temperament table | `FIGURE_DIGNITIES.moshavHouse` (`kashf-figure-attributes-gate2.js`) | Compared against Order 1 below | 7 of 14 comparable figures disagree | **No / unverified** |
| Order 1 — שיבוץ המושב | 104-105 | Gate 3's first placement order — which house each figure "sits in" | `SHIBUTZ_1_MOSHAV` (`kashf-shibutzim.js`) | Compared against `moshavHouse` above | Same 7 of 14 | **No / unverified** |
| Essential Dignities Table — `maalaHouse` (מעלה) | 97-99 | Same Gate-2 table, the exaltation column, explicitly sourced "ממעגל נציר א-דין" (from the Nasir al-Din circle) | `FIGURE_DIGNITIES.maalaHouse` | Compared against "בית כבוד" below | 1 of 2 checked figures agrees, 1 disagrees | **Partial / unverified** |
| L2.4A — "בית כבוד" (house of honor) | 218-219 | The Requester technique's starting-count table, also explicitly invoking "מעגל נציר א-דין" | `REQUEST_CIRCLE_HONOR_HOUSES` (`kashf-shibutzim.js`) | Compared against `maalaHouse` above | Same 1 of 2 | **Partial / unverified** |

**No data was corrected. No tradition was chosen over another. No
fallback was added.** All four representations remain exactly as they
exist in the repository, each independently source-cited, each
correctly kept separate.

---

## 6. The 16th order

- **Confirmed**: Gate 3 contains exactly 15 explicit order headings
  (verified by exhaustive heading-level grep of the full p.104-151
  range, not assumed).
- **Confirmed**: p.189 (Gate 6, a different chapter) contains a
  candidate — "שיבוץ ההפכים" — already implemented in code
  (`SHIBUTZ_16_OPPOSITES_DEPTH_MEASURES`, `computeHiddenDepthByOpposites`)
  for its own independent purpose (hidden-object/water depth), regardless
  of whether it is "the" missing 16th Gate-3 order.
- **Status**: `unresolved-sixteenth-order`.
- **Per instruction, the candidate was NOT activated as "Order 16" of
  Gate 3 anywhere in this round's documentation edits** — it is
  described only as "a candidate," consistently, in every corrected
  document.
- **`kashf-shibutzim.js` was not modified this round.**

---

## 7. Re-ranking (documented in the First-Implementation-Slice document; summarized here)

| Option | Status this round |
|---|---|
| GT-3A regression-lock (p.219) | Fully present, near-zero risk, ready today |
| Requested-circle (p.220) resolution | Blocked on source ambiguity, not implementation |
| The 16th placement order | Unresolved provenance question, not a coding task |
| Five Witnesses (L3.E) | Both known dependencies now satisfied, still fully unbuilt |
| Missing Dhamir methods | Unchanged — highest regression-risk option |
| L2.1 ("לשון העניין") | A first attempt exists but is unconsumed anywhere in the repo |

**No slice was finally selected.** This is a readiness update only, per
your explicit instruction.

---

## 8. Verification test results (read/execute only, no code changed)

All checks performed via direct `node` execution against the existing,
unmodified `kashf-shibutzim.js`:

1. **15 of 15 order exports found** (`SHIBUTZ_1_MOSHAV` through
   `SHIBUTZ_15_ORDER`) — confirmed programmatically.
2. **`sourceRef` present** on every checked method-level/table-level
   export (14 spot-checked, all carry an explicit page citation).
3. **No `SHIBUTZ_16_..._ORDER` export exists** — confirmed
   (`S.SHIBUTZ_16_ORDER === undefined`); only the independent depth-
   measures helper for the p.189 candidate exists, correctly not
   presented as a verified 16th Gate-3 order.
4. **`computeRequesterCircleHouse` reproduces both source examples
   exactly**: `'2221'` (שפל ראש) → `{honorHouse:8, count:10,
   landingHouse:10}` — **MATCH**. `'2211'` (כבוד נכנס) → `{honorHouse:12,
   count:6, landingHouse:6}` — **MATCH**.
5. **All 14 non-verified figures return `null`**, not a guessed value —
   confirmed by iterating the full registry and checking every pattern
   outside the 2 verified ones.
6. **Requester check is routed through the `commerce` topic** —
   confirmed: `id: 'requester-circle-strength'` appears inside the
   `commerce:` block of `kashf-topic-rules.js`.
7. **Requester check appears in the reading engine's dispatch surface**
   — confirmed: `computeRequesterCircleStrengthKashf` is imported and
   registered twice in `kashf-reading-engine.js` (import line and
   function-table registration line).
8. **No verdict or engine behavior changed** — confirmed via `git
   status`: only 8 `.md` files show as modified; zero `.js`/`.ts` files
   appear in the diff.

---

## 9. Confirmation: no code changed

- `kashf-shibutzim.js`: **not modified**.
- `kashf-dhamir.js`, `kashf-book-additions.js`, `kashf-topic-rules.js`,
  `kashf-reading-engine.js`: **not modified** — read-only inspection
  only, confirmed via `git status --short` showing zero code files in
  the working tree diff.
- No new file created except this precommit report.
- No AI Context, Prompt, or UI file touched.
- No Deploy, no AI call.

---

## 10. Exact next step

**Await your explicit approval before either of the two actionable next
steps identified by this round**: (a) committing and pushing this
round's 8 documentation corrections plus this precommit report, or (b)
authorizing GT-3A to be written as a new regression-lock test (the
lowest-risk, highest-certainty action identified anywhere in this
project to date, since it requires no new engine code — only a test
file around already-working, already-verified behavior). Neither is
started by this report.
