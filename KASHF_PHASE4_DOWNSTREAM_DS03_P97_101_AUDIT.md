# KASHF Phase 4 — Downstream Correction DS-03 (p97–101)

## Authority and scope

- Highest authority: printed Arabic scan, book p97–101 / scan PDF p99–103.
- Supporting comparison: canonical `kashf-v57-draft.html` and Master Index records.
- Downstream target: `goral-hachol/data/sources/kashf-al-asrar/kashf-figure-attributes-gate2.js`.
- Live consumer checked: `kashf-dhamir.js` derives only `maalaHouse`; no Registry, Router, UI, or verdict code was changed.

## Branch continuity

- `claude/app-cleanup-organization-mia9b2` was fast-forwarded from `09298a2` to the completed Phase-4 tip `1c64ce0`.
- GitHub confirmed the move was 95 commits ahead with zero divergent commits; no merge commit, rebase, force update, or history rewrite occurred.
- `codex/kashf-phase4-v57-corrections-p44-53` remains at the identical `1c64ce0` recovery point.
- `main` remained unchanged at `c000899d`.

## Coverage matrix

| ID | Source | Working layer | Before | After | Impact | Status |
|---|---|---|---|---|---|---|
| `B04-DATA-DIGNITIES-SOURCE-DRIFT` | p97–99 / PDF 99–101 | `FIGURE_DIGNITIES` | HTML-derived wrong rows and values | 14 printed rows; only ממון נכנס and סוהר omitted | Material source-data correction | Resolved |
| `B04-DATA-JOY-VENUS` | p100 / PDF 102 | supplementary joy/grief | Venus missing; wrong H1 pair; uncertainty collapsed | Venus H5; לבן+דרך H1; tentative pair preserved | Material retrieval correction | Resolved |
| `B04-DATA-MONTH-MAP` | p100–101 / PDF 102–103 | `FIGURE_MONTHS` | three printed associations missing | לבן→שוואל+מוחרם; סף נכנס→רביע האחרון | Material association correction | Resolved |

## Detailed corrections

### Dignity table

- Removed unsupported rows: ממון נכנס (`2121`) and סוהר (`1221`).
- Restored printed rows: חיבור (`2112`) and דרך (`1111`).
- Corrected the affected values for סף יוצא, כבוד נכנס, כבוד יוצא and ממון יוצא.
- Preserved דרך's printed `burjHouse: 7`.
- Kept ממון יוצא's grief as a nonnumeric relative statement; no house was inferred.

### Joy and grief supplement

- Added Venus joy at H5.
- Corrected H1 grief to לבן (`2212`) and דרך (`1111`).
- Stored ממון יוצא (`1212`) and סף יוצא (`1112`) as a joint `source-tentative` Saturn/Mars attachment.
- The ambiguous printed phrase about the H11 group remains unresolved and cannot overwrite the main table.

### Month associations

- Added לבן to שוואל and מוחרם.
- Added סף נכנס to רביע האחרון.
- Preserved many-to-many mapping; only בר הלחי remains unassigned in this chapter.

## Unresolved-evidence register

| ID | Evidence | Affected layer | Status | Required action |
|---|---|---|---|---|
| `DS03-P99-DUPLICATE-NUSRA-DAKHILA` | Printed p99 / PDF p101 proceeds from חיבור to כבוד יוצא; canonical p99 repeated כבוד נכנס | Canonical v57 HTML | Resolved | Removed only the duplicate p99 paragraph; retained the verified p98 row and reran canonical structure QA |

The HTML duplication was never copied into downstream data. After the isolated source erratum, `figures.p97-99.dignities-source-table` and the two reconciled p100–101 records are all `VERIFIED`.

## Traceability and acceptance criteria

| Source unit | Code/data | Test obligation | Acceptance |
|---|---|---|---|
| Printed 14-row dignity table | `FIGURE_DIGNITIES` | exact seven-field comparison for all 14 rows | 14 matches; omitted set exactly `{2121,1221}` |
| Printed p100 supplement | joy/grief export | positive and negative assertions | Venus H5; H1 pair correct; tentative pair not promoted |
| Printed p100–101 months | `FIGURE_MONTHS` | many-to-many assertions | all three restored associations; only `1211` unassigned |
| Existing Dhamir consumer | `computeDhamirElementPrevalence` | live fallback regression | verified H1 path and omitted-row fallback both remain safe |

Focused Golden Test: `_test_kashf_downstream_ds03_p97_101.mjs`.

## Verification results

- Visual source pass: printed p97–101 / scan p99–103 inspected at original rendered resolution.
- `node --check`: all edited JavaScript and both focused tests passed.
- `_test_kashf_downstream_ds03_p97_101.mjs`: PASS.
- `_test_kashf_essential_dignities_table.mjs` (corrected GT-10): PASS.
- `_test_kashf_ai_retrieval_index.mjs`: 520 passed, 0 failed.
- `_test_kashf_ai_retrieval_live_bridge.mjs`: 145 passed, 0 failed.
- `_test_kashf_canonical_routing.mjs`: 1,535 passed, 0 failed.
- Master Index: valid JSON; 272 unique records; no broken queue references or duplicate queue IDs; `runtimeEligible:true` remains zero.
- Canonical HTML anchors: 256/256 unique, p21–p276; canonical HTML content unchanged in DS-03.
- `_test_full_topics.mjs`, `_test_new_topics.mjs`, and `_test_engine.mjs` remain blocked before execution by the pre-existing missing import `goral-hachol/data/sources/hawi/foundations/hawi-figure-names.js`; DS-03 does not touch that path.
- Browser verification unavailable: Playwright is installed, but no Chromium executable is present in the environment. DS-03 changes source data and tests, not UI/layout.
- `git diff --check`: PASS.

## Queue result and resume marker

- Resolved in DS-03: 3.
- Cumulative downstream resolutions: 12/46.
- Remaining downstream items: 34.
- `runtimeEligible:true`: unchanged at zero.
- Exact next source-ordered item: `B04-DATA-WITNESS-NUMERAL`, printed p101–102.
