# KASHF Phase 4 — Downstream Batch 01 (p63–65)

## Scope and authority

- Authoritative evidence: printed Arabic scan, book p63–65 / scan PDF p65–67.
- Working knowledge evidence: `kashf-v57-draft.html` and the three verified Master Index records for p63–65.
- Downstream target: `goral-hachol/data/sources/kashf-al-asrar/kashf-figure-names.js`.
- No Registry, Routing, executor, or calculation-engine change is included.

## Resolutions

### `B02-DATA-P63-PURITY-OVERLAP`

The printed p63 list includes אדום (`2122`) among the pure figures and separately attributes it to impurity from both jinn and humans. The active scalar field previously retained only the second classification. It now preserves the source overlap as `טהור וגם טמא-שניהם`.

### `B02-DATA-P64-SEEKER-MAP`

The printed row order is `1222, 1212, 1211, 1221, 1122, 1112, 1121, 1111`. The active data had exchanged the descriptions of בר הלחי (`1211`, row 3) and נלחם (`1121`, row 7). The assignments were corrected. Row 3 now preserves the printed `طالب الشر ضعيف`; the conflicting OCR reading `النذر` is rejected.

### `B02-DATA-P65-SOUGHT-MAP`

The printed row order is `2221, 2222, 2211, 2112, 2121, 2111, 2212, 2122`. All descriptions are now assigned to those patterns. קהלה (`2222`) was already correct; seven assignments were repaired.

## Queue result

- Resolved in this batch: 3.
- Remaining downstream items: 43.
- Next source-ordered batch: local figure-profile conflicts spanning p72–95.

## Guardrails

- Hebrew figure names remain the product-facing authority.
- The printed scan overrides OCR where they differ.
- Local-profile classifications are not silently promoted into global scalar taxonomy.
- No unresolved source statement is converted into runtime logic.

## Verification

- `node --check` passed for the edited source-data file and the focused test.
- `_test_kashf_figure_names_source_tables.mjs`: PASS for the p63 overlap, all eight p64 rows, and all eight p65 rows.
- `_test_kashf_ai_retrieval_index.mjs`: 520 passed, 0 failed.
- `_test_kashf_ai_retrieval_live_bridge.mjs`: 145 passed, 0 failed.
- `_test_kashf_ai_context_builder.mjs`: PASS.
- `_test_kashf_context_fields_transfer.mjs`: PASS.
- `_test_kashf_professional_verdict_safety.mjs`: 423 passed, 0 failed.
- `_audit_kashf_question_route_coverage.mjs`: PASS, 138/138 explicit routes; routing was not changed.
- Embedded Master Index JSON parses successfully; downstream queue now contains 3 `RESOLVED` and 43 deferred entries.
- `git diff --check`: PASS.

Two repository-environment limitations are recorded rather than hidden:

- `_test_full_topics.mjs` cannot start because it imports the absent legacy file `goral-hachol/data/sources/hawi/foundations/hawi-figure-names.js`; this failure predates and is unrelated to this batch.
- Browser verification was unavailable because neither Playwright nor Chromium is installed in the current environment. This batch changes source data and tests only; it does not alter UI structure or styling.
