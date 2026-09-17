# KASHF Phase 4 — Downstream Batch 02 (p72–95)

## Scope and authority

- Authoritative evidence: printed Arabic scan, book p72–95 / scan PDF p74–97.
- Knowledge evidence: six verified Master Index figure-profile records.
- Downstream target: `goral-hachol/data/sources/kashf-al-asrar/kashf-figure-descriptions-gate2.js`.
- Global scalar taxonomy in `kashf-figure-names.js` was deliberately not changed.
- No Registry, Routing, executor, calculation engine, or UI change is included.

## Resolution model

Each verified profile is stored with `profileScope: local-chapter-profile`, `localProfileAttributes`, and explicit `crossChapterConflicts`. These values describe the local p68–95 profile chapter only. Consumers must not silently promote them into global figure classifications.

## Resolved queue entries

- `B03-JAMAA-LOCAL-CONFLICT`: קהלה is locally female and neither internal nor external; global androgynous/fixed classifications remain intact.
- `B03-JOUDALA-DUAL-ELEMENT`: נלחם preserves both printed air and water element statements; global air remains intact.
- `B03-BAYAD-LOCAL-CONFLICT`: לבן is locally internal and diurnal; global fixed/nocturnal classifications remain intact.
- `B03-TARIQ-LOCAL-CONFLICT`: דרך is locally female; global androgynous classification remains intact.
- `B03-IJTIMA-CONTEXTUAL`: חיבור preserves the printed range of opposing categories as an explicit contextuality statement.
- `B03-NAQI-LOCAL-CONFLICT`: בר הלחי is locally internal; global mutable classification remains intact.

## Queue result

- Resolved in this batch: 6.
- Cumulative downstream resolutions: 9/46.
- Remaining downstream items: 37.
- Next source-ordered batch: printed dignity table p97–99.

## Guardrails

- Hebrew figure names are primary in project-facing fields.
- Cross-chapter contradictions remain visible and scoped.
- No local profile is treated as a source-wide override.
- No unresolved statement is converted into runtime behavior.

## Verification

- Visual recheck completed against the printed scan for the six relevant profile openings and the dual-element continuation of נלחם.
- `node --check` passed for the edited data file and focused test.
- `_test_kashf_local_figure_profiles.mjs`: PASS; verifies all six local profiles and proves the corresponding global scalar fields remain unchanged.
- `_test_kashf_figure_names_source_tables.mjs`: PASS.
- `_test_kashf_ai_retrieval_index.mjs`: 520 passed, 0 failed.
- `_test_kashf_ai_retrieval_live_bridge.mjs`: 145 passed, 0 failed.
- Embedded Master Index JSON parses successfully; downstream queue now contains 9 `RESOLVED` and 37 deferred entries.
- `git diff --check`: PASS.

Browser verification remains unavailable because Playwright and Chromium are not installed in the current environment. The batch changes a currently non-runtime source-data module and tests only; no UI or live-engine path was changed.
