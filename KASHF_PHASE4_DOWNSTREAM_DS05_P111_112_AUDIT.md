# KASHF Phase 4 — Downstream Correction DS-05 (p111–112)

## Authority and decision

- Highest authority: printed Arabic p111 / scan PDF p113, and printed p112 / scan PDF p114 — visually verified line-by-line and confirmed at the AI Master Index super-audit level.
- p111: `H7 primary = 29` (`تسعة وعشرون`); `H11 primary = 66, alternate = 600` (`وفي نسخة: ستمائة`); `H12 primary = 79, alternate = 700` (`وفي نسخة: سبعمائة`). The previously-live code values (H7=28, H11 alt=760, H12 alt=770) do not match the printed scan.
- p106 is a distinct, independent table (canonical figure-ranking, not house-indexed). Its position 7 = 28 is unrelated to p111's house-7 value and **must not be changed** — the two tables coexist by design (the source itself preserves alternate formulas without unifying them).
- p112: the source separates its house-position taxonomy into four groups, not three — `الأوتاد` (H1,4,7,10 → present), `مائل الأوتاد` (H2,5,8,11 → future), `زايد الأوتاد` (H3,6,9 → past), and `الساقط` (H6,12) as its own, separately-printed category. House 12 belongs to `الساقط`, not automatically to a generic "past" group with H3/H6/H9 — collapsing it there would misrepresent the printed source. This distinction is documented at `houses.p43-44.taxonomy`; see the "Open item flagged, not touched" section below for the precise, unresolved state of that record.

## Corrected surfaces

| Surface | Correction |
|---|---|
| `goral-hachol/data/sources/kashf-al-asrar/kashf-shibutzim.js` | `SHIBUTZ_2_MONEY_BY_HOUSE`: H7 value 28→29, H11 altValue 760→600, H12 altValue 770→700. `SHIBUTZ_2_CANONICAL_NUMBER` (p106) untouched — position 7 stays `number: 28`. |
| `kashf-v57-ai-master-index.html` — `shibutz.p111.money-number-table` | `sourceDiscrepancies` cleared to `[]`; `verificationStatus` REVIEW_REQUIRED → VERIFIED; verification note updated to state the scan, v57 draft, and `kashf-shibutzim.js` are now synchronized. `runtimeEligible` stays `false`. |
| `kashf-v57-ai-master-index.html` — `downstreamCorrectionQueue` item `B05-DATA-P111-MONEY-TABLE` | `status` DEFER_UNTIL_INDEX_COMPLETE → RESOLVED, with a `resolution` field describing the exact three-value fix and confirming p106 was kept separate. |
| `kashf-v57-ai-master-index.html` — `shibutz.p112.lisan-al-amr` | `sourceDiscrepancies` cleared (the stale claim that v57 lost the structural trigger no longer applies — `kashf-v57-draft.html#p112` preserves `مائل الأوتاد` with transliteration); `verificationStatus` REVIEW_REQUIRED → VERIFIED **at the source/HTML representation level only**. `runtimeEligible` stays `false`. `structuralStates` left untouched. |
| `kashf-v57-ai-master-index.html` — `downstreamCorrectionQueue` item `B05-P112-LISAN-STRUCTURE` | `status` DEFER_UNTIL_INDEX_COMPLETE → **DEFERRED_UNTIL_ALGORITHM_VERIFIED** (not RESOLVED). Added `deferralReason` spelling out: the structural term is preserved at the representation level; `kashf-leshon-hainyan.js` remains an unwired, unverified, 0-consumer orphan; a known p106/p111 index-conflation risk exists inside that orphan module (`canonicalPositionOf()` used as a house-index key) and must not be resolved by assumption; the module must not be wired to Runtime/Registry/Router before the mechanical algorithm is reconstructed and source-verified; and `زايد الأوتاد` (H3,6,9) / `الساقط` (H6,12) remain separate, non-merged categories — no `past:[3,6,9,12]`-style grouping was introduced. |
| `_test_kashf_downstream_ds05_p111_112.mjs` (new) | 13 golden-test assertions covering the code fix, the p106/p111 separation, the Master Index status changes, the Registry's orphan classification, and the two forbidden constructs. |
| `WORKPLAN.md` | Top section updated: DS-05 p111 marked done; p112 marked `DEFERRED_UNTIL_ALGORITHM_VERIFIED`; next items `B06-OPS-ATTRIBUTED-METHODS` and `B06-DHAMIR-NEED-DRIVEN` listed (both already exist as `DEFER_UNTIL_INDEX_COMPLETE` queue items in the Master Index; not created or modified there in this batch). |

## Safety boundary

- `goral-hachol/engine/kashf-leshon-hainyan.js` was **not modified**. It remains a `disconnected-orphan` in `goral-hachol/registry/hall-wisdom-engine-registry.js` (`executionStatus: 'disconnected-orphan'`, `runtimeRole: 'disconnected'`, `productionStatus: 'blocked'`, `testStatus: 'none-found'`) — verified unchanged, and confirmed by the new test's static-import scan of `goral-hachol/engine`, `goral-hachol/ui`, and `goral-hachol/brain`, which found no active importer of `computeLeshonHainyan`.
- No `KASHF_P112_HOUSE_TRIPLICITY_GROUPS` constant, and no `past: [3, 6, 9, 12]` grouping, were added anywhere — both explicitly forbidden this round because they would falsely merge `زايد الأوتاد` (H3,6,9) with `الساقط` (H6,12).
- `kashf-v57-draft.html`, `SHIBUTZ_2_CANONICAL_NUMBER` (p106), the Registry, the Router, and all Runtime engines were left untouched.
- `main` was not touched; no branch was created; no merge was performed; no PR was opened.

## Acceptance criteria

- `SHIBUTZ_2_MONEY_BY_HOUSE[7].value === 29`, `[11].altValue === 600`, `[12].altValue === 700`.
- `SHIBUTZ_2_CANONICAL_NUMBER` position 7 remains `{ pattern: '2122', hebrewName: 'אדום', number: 28 }`.
- `SHIBUTZ_2_CANONICAL_NUMBER` (array, p106) and `SHIBUTZ_2_MONEY_BY_HOUSE` (object, p111) remain two structurally distinct exports.
- Master Index record `shibutz.p111.money-number-table` is `VERIFIED` with empty `sourceDiscrepancies`.
- Master Index queue item `B05-DATA-P111-MONEY-TABLE` is `RESOLVED`.
- Master Index record `shibutz.p112.lisan-al-amr` keeps `runtimeEligible: false`.
- Master Index queue item `B05-P112-LISAN-STRUCTURE` is `DEFERRED_UNTIL_ALGORITHM_VERIFIED`, not `RESOLVED`.
- No `runtimeEligible: true` anywhere in the Master Index; no duplicate queue ids; every `sourceEntryId` resolves to an existing record; record count unchanged at 272.

## Open item flagged, not touched

The `downstreamCorrectionQueue` item `B01-P44-TAXONOMY` is marked `RESOLVED`. The underlying record `houses.p43-44.taxonomy` itself, however, is still `verificationStatus: REVIEW_REQUIRED` and still carries a `sourceDiscrepancies` note describing `kashf-v57-draft.html` as merging H3/H6/H9/H12 under one label — a claim that looks stale next to the queue item's `RESOLVED` status and the `sourceTaxonomy` array already present on the same record (which does show the four groups distinctly, including the isolated `الساقط: H6,H12`). This contradiction between the queue item and the record is only **flagged here for a future pass**, not resolved in DS-05. Per this round's explicit scope, `houses.p43-44.taxonomy` was **not modified**.

## Verification results

- `node --check goral-hachol/data/sources/kashf-al-asrar/kashf-shibutzim.js`: PASS.
- `node --check _test_kashf_downstream_ds05_p111_112.mjs`: PASS.
- `node _test_kashf_downstream_ds05_p111_112.mjs`: PASS — all 13 assertions.
- `node _test_kashf_book_rule_catalog.mjs`: PASS (all sub-checks, engine payload/verdict unchanged).
- `node _test_kashf_ai_retrieval_index.mjs`: 520 passed, 0 failed.
- `node _test_kashf_ai_retrieval_live_bridge.mjs`: 145 passed, 0 failed.
- `node _test_kashf_canonical_routing.mjs`: 1,535 passed, 0 failed.
- `git diff --check`: PASS (no whitespace errors).
- Master Index JSON: valid (`JSON.parse` succeeds); 272 records (unchanged); 46 `downstreamCorrectionQueue` items (unchanged); no duplicate queue ids; no `sourceEntryId` pointing to a missing record; zero `runtimeEligible: true` occurrences anywhere in the document.
- `git diff` confirms only the intended 3-value change in `kashf-shibutzim.js` (H7/H11/H12) and no change to `SHIBUTZ_2_CANONICAL_NUMBER` or to `kashf-leshon-hainyan.js`.
- Browser check: `python3 -m http.server` + Playwright/Chromium (`/opt/pw-browsers/chromium`) loading `goral-hachol.html`. The page's own auth guard (`if (!sessionStorage.getItem('userId')) window.location.replace('/index.html')`) redirects unauthenticated sessions immediately, aborting all in-flight resource loads — a pre-existing behavior unrelated to this change. With a synthetic `sessionStorage.userId` set before navigation (bypassing login only, to observe the app's own module loading), the page loaded with **zero page errors and zero failed local-resource/script loads**. The only console noise was a missing `favicon.ico` (pre-existing, cosmetic) and a blocked external CDN request to `cdn.jsdelivr.net` for `@supabase/supabase-js` (blocked by this sandbox's network egress policy, pre-existing, unrelated to this data change).
- Downstream queue after DS-05: **14/46 resolved**; 32 remain open/deferred (1 `DEFERRED_UNTIL_ALGORITHM_VERIFIED`, 25 `DEFERRED_UNTIL_INDEX_COMPLETE`, 2 `DEFER_UNTIL_INDEX_COMPLETE`, 4 `DEFERRED_UNTIL_SOURCE_RESOLVED`).
