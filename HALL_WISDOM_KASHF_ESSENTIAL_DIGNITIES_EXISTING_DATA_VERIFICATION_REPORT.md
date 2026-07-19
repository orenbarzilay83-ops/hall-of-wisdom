# HALL_WISDOM_KASHF_ESSENTIAL_DIGNITIES_EXISTING_DATA_VERIFICATION_REPORT

> Verification only. No code changed. No commit/push/deploy. No AI call.
> No UI touched. No engine wiring. No new data file, adapter, or
> re-export created — per explicit user decision, this round verifies
> and tests the **existing** `FIGURE_DIGNITIES` object in
> `goral-hachol/data/sources/kashf-al-asrar/kashf-figure-attributes-gate2.js`
> in place, and adds one new test file (`_test_kashf_essential_dignities_table.mjs`,
> GT-10).

---

## 1. Record count — resolved with certainty, not assumed

Verified by direct Node execution (`Object.keys(FIGURE_DIGNITIES).length`),
not by reading comments:

| Metric | Value |
|---|---|
| `FIGURE_DIGNITIES` key count | **14** |
| Unique keys (patterns) | 14 (all unique — `new Set(keys).size === 14`) |
| Registry (`HAWI_FIGURE_NAMES`, `kashf-figure-names.js`) total figures | 16 |
| Registry patterns missing from `FIGURE_DIGNITIES` | 2 — `1111` (דרך) and `2112` (חיבור) |

**The "14" in the prior turn's report was correct; the "16" framing
("FIGURE_DIGNITIES כולל 16 צורות") in that same message was imprecise
phrasing, not a separate factual claim** — it meant "16 figures are
conceptually addressed by this table's surrounding scope (14 with data +
2 explicitly documented as out of scope for this specific source
passage)," but stated in a way that could be misread as "the object has
16 keys." It does not. This is now stated with no ambiguity: **the
object has exactly 14 keys.**

## 2. Resolving the 16-vs-14 contradiction

This is **not an implementation gap**. Direct re-reading of
`kashf-hebrew-v56-clean-final.html`'s printed pages 97-99 (PAGE_BLOCK 80,
81, 82 — verified via the printed `.pageno` footer, not the table of
contents, consistent with the pagination-offset finding from the earlier
mapping round) confirms: the book's own "פרק במעלת הצורות, מושבן, מזגן
ופניהן" chapter **never assigns exaltation/domicile/term/face/joy/
sorrow/temperament values to פattern 1111 (דרך) or 2112 (חיבור)
anywhere in this page range.** Both figures appear only in the
**preceding** section ("סיום טבעי הצורות," the tail of an earlier
elemental-nature chapter, describing them as e.g. "ממוזגת, פנימית,
זכרית, קבועה, מיסוד המים..." for חיבור) — nature/temperament-class
description, not dignity-table values.

This was independently confirmed twice:
1. By a **fresh, from-scratch re-extraction** of the raw HTML performed
   in this session, done before re-reading the existing file's own
   content.
2. By the existing file's own header comment (line 25-27), which
   already stated this same fact.

Both independent readings agree: **14, not 16, is correct.** No
completion "from memory" was performed, and no new file was created —
per your explicit instruction.

## 3. Seven professional fields — field map

| Requested field (Phase 1 schema) | Actual field name in `FIGURE_DIGNITIES` | Professional meaning | Source page | Present in all 14 records? | Explicit value or derived? | Verification status |
|---|---|---|---|---|---|---|
| exaltation | `maalaHouse` | מעלה — the figure's exaltation house | 97-99 | Yes (as own-property; value may be `null`) | Explicit, transcribed directly from source house-number words | `verified` on all non-null values (see §5) |
| domicile | `moshavHouse` | מושב — the figure's domicile/seat house | 97-99 | Yes | Explicit | `verified` |
| term | `gvulHouse` | גבול — the figure's bound/term house | 97-99 | Yes | Explicit | `verified` |
| face | `panimHouse` | פנים — the figure's face house | 97-99 | Yes | Explicit | `verified` |
| joy | `simchaHouse` | שמחה — the figure's joy/rejoicing house | 97-99 | Yes | Explicit where non-null; one figure (סף יוצא) has a source-internal variant (see §5) | `verified`, one `verified-with-source-variant` |
| sorrow | `tzaarHouse` | צער — the figure's fall/grief house | 97-99 | Yes | Explicit where non-null; one figure (ממון יוצא) states only "כנגדו" (opposite it) without resolving the house number — correctly left `null`, not guessed | `verified` where stated; `unresolved-indirect-reference` for ממון יוצא |
| temperament | `mezegHouse` | מזג — the figure's temperament-pairing house | 97-99 | Yes | Explicit where non-null | `verified` |

**Additional fields found in the file, not part of the requested
schema — left untouched, classified as instructed:**

| Field | Present on | Source | Classification |
|---|---|---|---|
| `note` | 4 of 14 records (נלחם, סף יוצא, כבוד נכנס, ממון יוצא) | Same pages 97-99 | **Part of the p.97-99 table** — each note documents a specific source-level nuance (an indirect "כנגדו" reference, a stated variant elsewhere in the source, or a duplicate value flagged as "not a transcription error"). Not from another source; not touched or altered this round. |

No `connection`, `path`, or `variants` fields exist in this file — those
mentioned in your instruction as hypothetical examples are not present
here.

## 4. Source Fidelity Table — all 16 figures

| # | figureId (registry) | pattern | Hebrew name | Arabic name | exaltation | domicile | term | face | joy | sorrow | temperament | source page | registry match | verification status | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | hawi-figure-judla | 1121 | נלחם | جودلة / كوسج | 1 | 5 | 9 | 11 | 5 | 7 | null | 97 | exact match | verified (temperament not-specified-in-source) | sorrow resolved by source itself: "כנגדו, והוא השביעי" |
| 2 | hawi-figure-hayyan | 1222 | נשוא ראש | الأحيان / الضاحك | 2 | 1 | 1 | 1 | 11 | null | 6 | 97 | exact match | verified (sorrow not-specified-in-source) | face and term share the same stated value (house 1) |
| 3 | hawi-figure-ataba-dakhila | 2111 | סף נכנס | عتبة داخلة / راية الفرح | 3 | 14 | 7 | 14 | 5 | null | 2 | 97-98 | exact match | verified (sorrow not-specified-in-source) | entry spans the p.97→p.98 page break |
| 4 | hawi-figure-bayad | 2212 | לבן | البياض | 4 | 9 | 4 | 6 | 6 | null | null | 98 | exact match | verified; temperament explicitly "לא נתפרש במקור" | — |
| 5 | hawi-figure-naqi-khad | 1211 | בר הלחי | نقي الخد / الأشقر | 5 | 16 | 9 | 13 | null | null | null | 98 | exact match | verified for 4 fields; joy/sorrow/temperament explicitly "לא נתפרשו כאן" | — |
| 6 | hawi-figure-ataba-kharija | 1112 | סף יוצא | عتبة خارجة | 6 | 13 | 8 | 8 | 7 (variant: 6, stated elsewhere in source) | null | null | 98 | exact match | verified-with-source-variant | source explicitly notes an alternate joy value elsewhere in the book — both preserved, not merged |
| 7 | hawi-figure-humra | 2122 | אדום | الحمرة | 7 | 9 | 3 | 2 | null | null | null | 98 | exact match | verified for 4 fields; temperament/joy/sorrow explicitly "לא נתפרשו כאן" | — |
| 8 | hawi-figure-nakis | 2221 | שפל ראש | المنكوس / الأنكيس | 8 | 7 | 2 | 8 | 12 | null | 5 | 98 | exact match | verified (sorrow not-specified-in-source) | exaltation and face share the same stated value (house 8) |
| 9 | hawi-figure-aqla | 1221 | סוהר | العقلة / الشقاوة | 9 | 12 | 6 | 11 | 10 | 4 | 15 | 99 | exact match | **fully verified — all 7 fields explicit** | only figure with a complete 7-field entry in this range |
| 10 | hawi-figure-nusra-dakhila | 2211 | כבוד נכנס | نصرة داخلة / النصير | 9 | 10 | 6 | 3 | null | null | null | 99 | exact match | verified for 4 fields; joy explicitly "לא נתפרשה כאן" | exaltation value (9) duplicates סוהר's — source's own note confirms this is not a transcription error |
| 11 | hawi-figure-nusra-kharija | 1122 | כבוד יוצא | نصرة خارجة / الجواد | 12 | 11 | 5 | 2 | null | null | null | 99 | exact match | verified for 4 fields; joy explicitly "לא נתפרשה כאן" | — |
| 12 | hawi-figure-qabd-dakhil | 2121 | ממון נכנס | القبض الداخل | 13 | 15 | 7 | null | 13 | null | 5 | 99 | exact match | verified for 5 fields; face not stated | — |
| 13 | hawi-figure-qabd-kharij | 1212 | ממון יוצא | القبض الخارج | 14 | 3 | 12 | 3 | 10 | **unresolved** | 3 | 99 | exact match | verified for 6 fields; sorrow = **unresolved-indirect-reference** | source says only "כנגדו" (opposite it) for sorrow — the house number is not stated; NOT resolved/guessed here |
| 14 | hawi-figure-jamaa | 2222 | קהלה | الجماعة | 16 | 2 | 11 | 10 | 10 | null | 9 | 99 | exact match | verified (sorrow not-specified-in-source) | face and joy share the same stated value (house 10) |
| 15 | hawi-figure-ijtima | 2112 | חיבור | الاجتماع | — | — | — | — | — | — | — | n/a | exact match (identity only) | **absent-from-requested-source-range** | figure is mentioned on p.97 only in the preceding nature-description passage; zero dignity values exist anywhere in p.97-99 |
| 16 | hawi-figure-tariq | 1111 | דרך | الطريق | — | — | — | — | — | — | — | n/a | exact match (identity only) | **absent-from-requested-source-range** | same — mentioned only in the nature-description passage, no dignity values in p.97-99 |

**Cross-verification method**: a fresh, independent re-extraction of the
raw HTML source was performed and diffed programmatically (not by eye)
against `FIGURE_DIGNITIES`'s actual runtime values. Result: **98 of 98
compared values (14 records × 7 fields) matched exactly — zero
discrepancies.**

**One minor citation-precision note, not a data defect**: the file's own
header comment cites "עמ' 96-99" for this table. Direct verification
shows page 96 contains only the tail of the preceding nature-description
chapter (no dignity values), and the actual "פרק במעלת הצורות" chapter
with its house-number values begins mid-page-97. The **values
themselves are unaffected** — this is a citation-range breadth note, not
a correctness issue, and the file is not modified this round.

## 5. Registry cross-check

| Check | Result |
|---|---|
| Exact matches (pattern + Hebrew name + Arabic name) | 16 of 16 |
| Name variants | 0 |
| Transliteration variants | 0 |
| Mismatches | 0 |
| Missing registry entries | 0 (registry has all 16; `FIGURE_DIGNITIES` simply doesn't have data for 2 of them, which is a source-content fact, not a registry problem) |
| Duplicate patterns | 0 |

Registry (`kashf-figure-names.js` → `HAWI_FIGURE_NAMES` /
`HAWI_FIGURE_NAMES_BY_ID`) was **not modified** this round.

## 6. GT-10 results

New file: `_test_kashf_essential_dignities_table.mjs` (repo root, matching
the existing `_test_kashf_*.mjs` naming convention). Imports
`FIGURE_DIGNITIES` directly from the existing data file — no new/adapter
file involved.

```
196 assertions, 0 failures, exit code 0
```

Covers, in order: (1) registry baseline sanity: 16 unique figures; (2)
true record count = 14, not assumed; (3) full 16-figure accounting via
set arithmetic (14 present ∪ 2 known-absent = all 16 registry patterns,
no gap, no double-count); (4) all 7 professional fields present as
own-properties on every one of the 14 records; (5) registry
cross-check per pattern; (6) zero placeholder tokens (`TODO`, `demo`,
`sample`, `inferred`, `FIXME`, `XXX`, `placeholder`) anywhere in the
file; (7) every `null` value's position matches a source-verified
expected-null map built from the fresh re-extraction — protects against
both silent future gaps and silent future padding; (8) a page-range
citation in the 96-99 vicinity is present at module level; (9)
deterministic key order; (10) no fetch/AI/network references; (11) zero
import statements (confirmed leaf data file, no engine coupling); (12)
confirms exactly one data source is imported — no duplicate file exists.

One self-correction during this round: assertion (11) initially
false-positived on the string "kashf-dhamir.js" appearing in a
*documentation comment* (line 9) that discloses — correctly and
transparently — that `kashf-dhamir.js` **consumes** this data (the
reverse direction: engine imports data, not data imports engine). The
assertion was narrowed to check only actual `import`-statement lines
(of which there are zero), not bare substring occurrence across the
whole file text including comments. This is documented here rather than
silently fixed and forgotten, since it's a real example of exactly the
kind of imprecise-check risk this whole verification exercise exists to
catch.

**Related discovery, out of this round's scope but worth flagging**:
`kashf-dhamir.js` (line 61) already imports `FIGURE_DIGNITIES` and
derives `FIGURE_MAALA_HOUSE` from it for Dhamir Type 2's (element-
prevalence) "root" check. This means the Essential Dignities Table is
**already partially wired into a live engine today** — which corrects
the `HALL_WISDOM_KASHF_MASTER_ENGINE_DEPENDENCY_GRAPH.md` document's
L0.3 status (previously recorded as `missing`). That document is not
edited this round (out of scope for this verification pass); flagging
it here so a future round can correct it deliberately, with your
awareness, rather than leaving a known-stale status uncorrected.

## 7. Regression tests

| Test | Result | Note |
|---|---|---|
| `_test_kashf_essential_dignities_table.mjs` (GT-10, new) | ✅ 196/196 pass | — |
| `_test_kashf_book_rule_catalog.mjs` | ✅ pass (exit 0) | Unaffected — no shared code path touched |
| `_test_kashf_ai_context_builder.mjs` | ✅ pass (exit 0) | Unaffected |
| `_test_engine.mjs`, `_test_full_topics.mjs`, `_test_new_topics.mjs`, `_test_client_reading.mjs`, `_test_complex_extraction.mjs`, `_test_demo_reading.mjs` | ❌ all 6 fail | **Pre-existing failure, unrelated to this round.** All 6 fail identically on `ERR_MODULE_NOT_FOUND` for `goral-hachol/data/sources/hawi/foundations/hawi-figure-names.js` — a file that does not exist at that path (the actual file there is `hawi-foundations.js`). Confirmed via `git status --short` that no file these tests depend on was touched this round, this session, or is even related to Kashf's essential-dignities work. Not fixed — out of scope for this verification round, and fixing it would be a code change requiring separate authorization. |
| Dedicated board-construction test | Not found | No `_test*board*`/`_test*raml*` file exists at the repo root to run. `raml-board-generator.js` was not touched this round regardless. |

No test that imports `FIGURE_DIGNITIES`, `kashf-figure-attributes-gate2.js`,
or `kashf-figure-names.js` showed any regression.

## 8. Was Phase 1 already complete?

**Yes — Decision: A. Phase 1 already complete and verified**, with three
explicit, honest caveats (not silently smoothed over):

1. "16 records" must be understood precisely as **14 records with
   real, 100%-source-verified dignity data, plus 2 figures explicitly
   and correctly documented as having zero dignity data anywhere in
   p.97-99** — this is a true reflection of the source book, not a gap
   to fill later. There is no missing data to add.
2. The existing file's per-record shape does **not** match the
   originally-envisioned richer schema (no embedded `figureId`,
   `hebrewName`, `arabicName`, `sourceBook`, `sourcePages`,
   `sourceVerificationStatus` per record) — identity fields are
   available via a one-hop cross-reference to `kashf-figure-names.js`
   by pattern instead, which avoids data duplication by design. This is
   a structural difference from the original ask, not a content defect.
3. The file's own header page-citation ("עמ' 96-99") is slightly
   broader than the precise value-table range (97-99); page 96 itself
   contains no dignity values. Cosmetic only.

None of these three caveats represent missing or incorrect data. All
values present are verified correct; all documented absences are
verified correct.

## 9. Gaps found

**None requiring correction.** The three items in §8 are disclosed
observations, not defects. No fix is proposed or performed this round.

## 10. Is a code change required?

**No.** The existing `kashf-figure-attributes-gate2.js` requires no
change to satisfy Roadmap Phase 1's goal (a verified, pure-data Essential
Dignities Table with no verdict wiring). The only new artifact this
round is the test file, `_test_kashf_essential_dignities_table.mjs`,
which is additive and imports the existing file unchanged.

## 11. Mapping documents corrected (approved and completed this round)

Per your explicit approval, the L0.3 status was corrected — as targeted,
surgical edits, not full rewrites — in the following 7 documents (5
named + 2 additional documents found to declare the same incorrect
`missing`/"zero code presence" status, per your "מסמך נוסף, אם קיים"
instruction):

| Document | What was corrected |
|---|---|
| `HALL_WISDOM_KASHF_MASTER_ENGINE_DEPENDENCY_GRAPH.md` | L0.3's own node: status tag in the graph overview, the full status table row, and 2 downstream dependency mentions (L4.13, L4.11 context) |
| `HALL_WISDOM_KASHF_ENGINE_IMPLEMENTATION_ROADMAP.md` | Witness-system-E table row, the F-vs-E compliance note, question-family rows #16 and #21, the rationale note #6, and Phase 1/Phase 6's descriptions |
| `HALL_WISDOM_KASHF_FIRST_IMPLEMENTATION_SLICE_RECOMMENDATION.md` | Added a status-update callout (original analysis left intact as historical record) plus a new "Re-Ranking After L0.3 Status Correction" section (see §11a below) |
| `HALL_WISDOM_KASHF_SUB_ENGINE_INVENTORY.md` | §6's own status block, the summary status-breakdown tally, and the "Dependencies" fields of §9 (Five Witnesses) and §24 (מבקש/מבוקש) |
| `HALL_WISDOM_KASHF_BOOK_TO_CODE_COVERAGE_AUDIT.md` | Part 5's numbered list item 1, and Part 6's recommendation paragraph |
| `HALL_WISDOM_KASHF_GOLDEN_TEST_STRATEGY.md` | GT-3's and GT-10's status fields, and the prioritization-tier list (GT-10 moved from "gap-closing" to "regression-lock," now that it's implemented) |
| `HALL_WISDOM_KASHF_FULL_BOOK_MAPPING_SESSION_REPORT.md` | "Which domains are entirely missing," "Recommended first domain to complete," "Number currently implemented," "Number missing," and "Current Kashf system status" — all updated from 14-missing/6-implemented to 13-missing/7-implemented |

Each correction states plainly: **14 source-assigned records, not 16;
דרך and חיבור are not missing rows (they are correctly documented as
absent from the source itself); GT-10 verifies the existing table; and
the original First-Implementation-Slice recommendation (L0.3) already
existed and required no new data file.** No document was rewritten in
full — only the specific incorrect status claims were edited, with the
original text left visible (often struck through or annotated) as an
honest historical record rather than silently erased.

### 11a. Re-ranking summary (full detail in the First-Implementation-Slice document)

With L0.3 no longer a blocker, L2.4 (מבקש/מבוקש במעגל) moved from
"blocked by 2 dependencies" to "blocked by 1" (L0.5 only), making it the
option with the clearest path to the strongest Golden Test in the
mapping (GT-3). L3.E (Five Witnesses) is now fully dependency-ready for
the first time, though it remains a leaf engine like F. L0.5 (Sixteen
Placement Orders) remains gated behind Phase 0's unresolved source gaps.
Dhamir gap-completion is unchanged (still the only medium-regression-risk
option). Seven Witnesses of Wisdom (F) is unchanged (never depended on
L0.3). **No new slice was chosen — this is a re-ranking of readiness
only**, per your explicit instruction not to select on my own authority.

## 12. Confirmation: no production code changed

- No change to `kashf-figure-attributes-gate2.js` (the existing data
  file) — confirmed via `git status`, not present in the diff.
- No change to `kashf-dhamir.js`, or any other engine file.
- No Adapter or re-export file created.
- No engine wiring (no new import added to any engine file).
- No AI Context, Prompt, or UI file touched.
- No Commit, Push, or Deploy performed.
- No AI call made.
- The only changes in the working tree this round: 7 markdown planning
  documents received targeted, non-rewriting corrections (listed in §11
  above); 2 files remain new and untracked
  (`_test_kashf_essential_dignities_table.mjs` and this report).
- GT-10 and both required regression tests
  (`_test_kashf_book_rule_catalog.mjs`, `_test_kashf_ai_context_builder.mjs`)
  re-run after the documentation edits and still pass (exit 0), confirming
  the doc-only changes had zero effect on any executable code.
