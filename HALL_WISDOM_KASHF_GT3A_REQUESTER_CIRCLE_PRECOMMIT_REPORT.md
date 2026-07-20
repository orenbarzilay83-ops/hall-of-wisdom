# HALL_WISDOM_KASHF_GT3A_REQUESTER_CIRCLE_PRECOMMIT_REPORT

> Precommit report only. No code changed. No engine file touched. No
> `kashf-shibutzim.js` change. No Commit/Push/Deploy. No AI call. No
> new implementation — this test exercises code that already existed,
> already worked, and was already live before this round began.

---

## 1. Source and page

`kashf-hebrew-v56-clean-final.html`, printed page 219 (PAGE_BLOCK 202,
verified via the `.pageno` footer, not the table of contents), section
"במבקש ובמבוקש על פי המעגל" / "המבקש והמבוקש במעגל — דוגמאות בשפל ראש
וכבוד נכנס." Re-read directly from the raw source this round, not taken
from prior documentation alone.

## 2. The two source examples (re-verified word-for-word)

**Example 1 — שפל ראש**: *"אם הופיעה צורת שפל ראש בבית הראשון, ובית כבודה
הוא השמיני, מונים מן השמיני עד הראשון, ונמצאים עשרה. התבוננו בעשירי מסדר
שיבוץ המושב, ומצאנו אותו בית הכבוד, השלטון, הרוממות, התוספת והמעמד."*
→ house-of-honor = 8, count to house 1 = 10, lands house 10 (a pillar/
authority house — benefic).

**Example 2 — כבוד נכנס**: *"וכן אם הופיעה כבוד נכנס בראשון, ובית כבודה
השנים־עשר, מנה ממנו עד הראשון — שישה. והשישי הוא בית המחלות, הדאגה,
היגון..."* → house-of-honor = 12, count to house 1 = 6, lands house 6
(illness/worry house — but supplementary reasoning, outside the core
counting formula, still argues for hope).

Both re-verifications match the existing code and existing documentation
exactly — no discrepancy found.

## 3. Code paths tested (all pre-existing, none copied into the test)

- `computeRequesterCircleHouse` — `goral-hachol/data/sources/kashf-al-
  asrar/kashf-shibutzim.js`
- `REQUEST_CIRCLE_HONOR_HOUSES`, `SHIBUTZ_1_MOSHAV` — same file
- `computeRequesterCircleStrengthKashf` — `goral-hachol/engine/kashf-
  book-additions.js`
- Routing: `id: 'requester-circle-strength'` inside the `commerce` topic
  block, `goral-hachol/engine/kashf-topic-rules.js`
- Dispatch/exposure: `buildKashfReading` → `runSupportingCheck` →
  `LEGACY_FN_REGISTRY` → `reading.supportingFindings`, `goral-hachol/
  engine/kashf-reading-engine.js`
- Board construction (shared, method-agnostic, not Hawi-specific
  content): `buildRamlBoardFromMothers`, `goral-hachol/engine/raml-
  board-generator.js`

No logic from any of these files was copied into the test. No mock
replaces the circle-counting calculation. Real boards were built via
`buildRamlBoardFromMothers` and passed through the real
`buildKashfReading('commerce', ...)` call.

## 4. Assertions written

75 assertions across 14 numbered sections in
`_test_kashf_gt3a_requester_circle_p219.mjs`, each tagged with its
evidentiary type:

- **[source fact]** — a direct re-verified claim about the book text
- **[code routing fact]** — a direct observation of how the code
  actually dispatches/exposes the result
- **[regression invariant]** — a value or absence-of-value that must
  hold for the currently-correct behavior not to silently regress

Section-by-section: (1) Example 1 reproduced both directly and
end-to-end; (2) Example 2 reproduced both directly and end-to-end; (3)
structural consistency of the returned object across both examples; (4)
`commerce` topic activates the rule, a different topic (`money`) does
not; (5) the result is present on `buildKashfReading`'s returned object
(`engineOutput`), not merely computed internally; (6) all 14
non-source-verified figures return `null` directly and
`"undefined-in-source"` end-to-end, with no `honorHouse`/`count`/
`landingHouse` keys present at all (not even as `null`); (7-8) explicit
no-fallback/no-guess checks on `REQUEST_CIRCLE_HONOR_HOUSES`'s exact
size (2 entries); (9) **positive proof** that `FIGURE_DIGNITIES.
maalaHouse` is not silently substituted — כבוד נכנס's `maalaHouse` (9)
and its Requester "house of honor" (12) are different values, and the
code correctly returns 12, not 9; (10) `SHIBUTZ_1_MOSHAV` (Order 1,
keyed house→figure) and `REQUEST_CIRCLE_HONOR_HOUSES` (keyed
figure→house) are proven structurally distinct, not merged; (11) the
reading's `primaryFormula` remains independent of this supportingCheck;
(12) structural sanity that `buildKashfReading` is unmodified and
callable; (13) no AI/fetch import in the test file itself, scoped to
actual import-statement lines (a bare substring scan false-positived on
this very check's own token-list definition — the identical class of
issue found and fixed in GT-10 — fixed the same way, by scoping to
import lines only); (14) no Hawi-specific topic-content import (`raml-
board-generator.js` is explicitly the shared, method-agnostic board
engine used identically by both methods, not Hawi content, and is
deliberately used).

## 5. Results — both source examples

| | Direct function call | End-to-end via `buildKashfReading` |
|---|---|---|
| שפל ראש | `{honorHouse:8, count:10, landingHouse:10}` | Same, plus `houseTypeHebrew:"יתד"`, `verdict:"landing-computed"` |
| כבוד נכנס | `{honorHouse:12, count:6, landingHouse:6}` | Same, plus `houseTypeHebrew:"נופל מן היתד"`, `verdict:"landing-computed"` |

Both **exact matches** to the source, confirmed twice (direct call and
full reading pipeline).

## 6. Results — 14 unverified-figure cases

All 14 registry patterns outside `{שפל ראש, כבוד נכנס}` confirmed, via
direct execution:
- `computeRequesterCircleHouse(pattern)` → `null` for all 14.
- End-to-end (spot-checked with נלחם in house 1) → `reading.
  supportingFindings` entry has `verdict: "undefined-in-source"`, with
  **no `honorHouse`, `count`, or `landingHouse` keys present at all** —
  not populated with `null`, not populated with any default house
  number. No fallback value is synthesized anywhere in the pipeline.

## 7. Routing through `commerce`

Confirmed by direct execution: `buildKashfReading(board, 'commerce',
{})` includes the `requester-circle-strength` finding;
`buildKashfReading(board, 'money', {})` on the identical board does
**not** include it. This confirms topic-scoped routing, not a
global/always-on injection.

## 8. Exposure in `engineOutput`

Confirmed: `reading.supportingFindings` is a real array on the object
returned by `buildKashfReading` (the function this codebase treats as
`engineOutput` for a Kashf reading), and the Requester finding is
present in it for both verified examples.

## 9. Confirmation: no fallback

`REQUEST_CIRCLE_HONOR_HOUSES` contains exactly 2 figure entries (plus
its `sourceStatus`/`sourceRef`/`note` metadata fields) — confirmed by
direct key-count. No 15th or 16th entry has been silently added by any
prior round. No default/placeholder house value exists anywhere in the
function's return paths for unverified figures.

## 10. Confirmation: no alternate-tradition substitution

Explicit, positive proof (not just absence-of-evidence): for כבוד נכנס,
`REQUEST_CIRCLE_HONOR_HOUSES['2211']` = 12 and `FIGURE_DIGNITIES['2211'].
maalaHouse` = 9 — two different values, confirmed by direct comparison.
If the code silently used `FIGURE_DIGNITIES.maalaHouse` as a stand-in
for "house of honor," this example would return the wrong, unverified
answer (9). It does not — it returns 12, the source-verified value.
Separately, `SHIBUTZ_1_MOSHAV` (Order 1) and `REQUEST_CIRCLE_HONOR_
HOUSES` are confirmed to be two distinct, differently-keyed exported
objects, not merged into one table.

## 11. Confirmation: no verdict change

`reading.primaryFormula` remains present and distinct from the
Requester supportingCheck's finding on every tested reading — this
check does not overwrite, replace, or feed into the topic's primary
verdict.

## 12. Regression results

| Test | Result |
|---|---|
| `_test_kashf_gt3a_requester_circle_p219.mjs` (new, this round) | ✅ 75/75, exit 0 |
| `_test_kashf_essential_dignities_table.mjs` (GT-10) | ✅ exit 0 |
| `_test_kashf_book_rule_catalog.mjs` | ✅ exit 0 |
| `_test_kashf_ai_context_builder.mjs` | ✅ exit 0 |
| `_test_kashf_commerce_context_aware.mjs` | ✅ exit 0 |
| `_test_kashf_commerce_context_coherence.mjs` | ✅ exit 0 |
| `_test_kashf_commerce_smart_layer.mjs` | ✅ exit 0 |
| `_test_kashf_context_fields_transfer.mjs` | ✅ exit 0 |
| `_test_kashf_hawi_method_isolation.mjs` | ✅ exit 0 |
| `_test_kashf_house_label_context.mjs` | ✅ exit 0 |

**10 of 10 relevant Kashf tests pass**, including every test found by
searching the repo for references to `kashf-reading-engine` or
`kashf-topic-rules` that does not involve a live AI call.

**Explicitly excluded, per your "no live AI" instruction**:
`_test_oren_smart_advisor_kashf_live_runner.mjs` (its own header
confirms it is "the FIRST live Kashf call against the deployed
oren-smart-advisor Edge Function"), `_test_oren_smart_advisor_site_
brain_poc.mjs`, and `_test_anthropic_provider_edge_content_blocks.mjs`
— all three are AI/live-call-related and out of scope for a read-only
regression pass. Not run, not needed for this test's own correctness
claims.

## 13. Files changed this round

New files only:
- `_test_kashf_gt3a_requester_circle_p219.mjs`
- `HALL_WISDOM_KASHF_GT3A_REQUESTER_CIRCLE_PRECOMMIT_REPORT.md` (this file)

No existing file was modified. Confirmed via `git status --short`
before and after test-writing — only these two files appear as
untracked; zero modified files.

## 14. Exact next step

**Await your explicit approval before either of the two next actions
this round's work makes available**: (a) committing and pushing
`_test_kashf_gt3a_requester_circle_p219.mjs` and this report, or (b)
starting work on GT-3B (the Requested/מבוקש half, p.220), which per the
prior audit remains blocked on a source-level arithmetic inconsistency
and should not be attempted without first re-verifying p.220 against
the original book more deeply than this round's scope allowed. Neither
is started by this report.
