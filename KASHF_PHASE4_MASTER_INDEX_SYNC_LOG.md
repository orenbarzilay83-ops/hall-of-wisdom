# KASHF Phase 4 — Master Index / corrected-v57 page-boundary sync

Branch: `codex/kashf-phase4-v57-corrections-p44-53`

## Operating rule

This pass synchronizes the Master Index to the already audited/corrected printed-page boundaries in the current Phase-4 v57 working artifact. It does **not** implement runtime engines and it does **not** silently close unrelated content-correction items.

For every affected source unit, keep these dimensions separate:

1. `bookPages` = printed KASHF pages occupied by the source unit.
2. `scanPdfPages` = authoritative scan PDF pages (printed page + 2 in this scan).
3. `v57Anchors` = corrected v57 page anchors that actually contain the unit after the Phase-4 boundary repair.
4. Content discrepancies remain open unless the corrected v57 working text itself demonstrably resolved them; even then, queue closure waits for versioned-artifact diff review.

## pp147–150 — staged

Patch: `KASHF_PHASE4_MASTER_INDEX_ANCHOR_SYNC_P147_150.patch`

Verified against the corrected v57 page sections:

- Order 12 occupies corrected v57 `p147` + `p148`, matching printed pp147–148.
- Order 13 occupies corrected v57 `p148` + `p149`, matching printed pp148–149.
- Order 14 occupies corrected v57 `p149` + `p150`, matching printed pp149–150.

The patch expands each stale single shifted v57 anchor to the true two-page span. The separate order-13 content problem (`بياض في الأصل` incorrectly rendered as a title meaning “לבן”) remains open.

## pp164–165 — staged / verified

Patch: `KASHF_PHASE4_MASTER_INDEX_SYNC_P164_165.patch`

- `gate5.p164.figure-desire-rules` already points to p164 correctly.
- `gate5.p164.seven-witnesses` already points to p164 correctly.
- `gate5.p164.figure-proximity-core` now exists in corrected v57 p164 as a complete printed-page unit, including repeated `نقي الخد`/בר הלחי = fear and adjacent `القبض الخارج`/ממון יוצא = `فتنة` / movement in a blameworthy fitna.
- `gate5.p165.figure-proximity-extended` remains a separate p165 record and remains `REVIEW_REQUIRED`.

## pp199–201 — staged

Patch: `KASHF_PHASE4_MASTER_INDEX_SYNC_P199_201.patch`

- `gate6.house6.p200.patient-spirit-and-sixth-eighth` actually starts on printed/corrected-v57 p199 and continues on p200: staged span `[199,200]`, scan `[201,202]`, anchors `p199,p200`.
- `gate6.house6.p200-201.prognosis-chain` is complete on printed/corrected-v57 p200: staged span `[200]`, scan `[202]`, anchor `p200`.

## pp204–228 — staged

Patch: `KASHF_PHASE4_MASTER_INDEX_SYNC_P204_228.patch`

This closes the previously skipped page-boundary sync checkpoint before the already staged Gate-8 patches. Main changes:

- Added a dedicated cross-page source unit for the mutual-gaze fire-row rule spanning p204→p205; this rule was present in corrected v57 but had no dedicated Master-Index record.
- Expanded the p206 virgin/non-virgin rule to p206→p207.
- Expanded the marriage-house figure-meaning unit to p207→p209 and the woman-by-man’s-houses unit to p209→p210.
- Expanded winner/loser to p212→p214 and enemy/allies/two-armies to p214→p216.
- Preserved circular-seeker p218→p219, hidden-request/year seams p220→p222, and yearly price continuation p222→p223.
- Preserved theft-direction p224→p226, livestock p226→p227, and surroundings/external-addendum p227→p229, with intentional overlaps where a page contains the end of one source unit and the start of the next.

No unrelated content-correction queue item was closed.

## pp229–230 — staged

Patch: `KASHF_PHASE4_MASTER_INDEX_SYNC_P229_230.patch`

The comprehensive theft rule is preserved as one source unit across printed p229→p230, while the dedicated p230 return/discovery record remains as an intentional overlap. The H7→H14 and H6-in-H13 content omissions remain open correction work.

## pp231–235 — staged

Patch: `KASHF_PHASE4_MASTER_INDEX_SYNC_P231_235.patch`

- The thief-description/variant unit is synchronized to its actual corrected source span.
- The loan/inheritance/death/worry unit is synchronized through p235.
- p235 is a mixed chapter-boundary page: Gate 8 closes there and Gate 9 opens later on the same printed page. This overlap is now carried forward explicitly rather than forcing Gate 9 to begin at p236.

## pp235–252 — staged

Patch: `KASHF_PHASE4_MASTER_INDEX_SYNC_P235_252.patch`

Key traceability repairs:

- Gate 9 opening/core travel record now begins on printed p235 and runs through p238.
- Direction procedure spans p238→p239; traveler safety/return spans p239→p243; relocation/road-request is on p243.
- Nuzhat al-ʿUqul travel condition/direction is aligned to printed p244 / scan246 / corrected-v57 `#p244`; the old `#p246` pagination mismatch is removed, while the separate `الكوسج` / `نقي الخد` content issue remains open.
- Two-journey/absent-person chain spans p245→p251, including the p251 first-line continuation; the later arrival/meeting unit spans p250→p253 and intentionally overlaps the dedicated p253 record.
- `gate8Theft` gate status now closes at p235; `gate9Travel` includes p235 because Gate 9 begins on that mixed page.
- The corrected working artifact already preserves p246 `فهو مكتوب`, p251 `فهو منكوب` without the unsupported captivity alternative, and canonical `בר הלחי` at the vehicle branch. Their queue entries remain OPEN until the corrected HTML artifact is versioned and its diff is reviewed.

## Next checkpoint

Continue in printed-page order with the remaining pp253–276 Master-Index synchronization. After that, run a whole-index traceability QA across the corrected p21–p276 anchor set before resuming normal `v57CorrectionQueue` execution.
