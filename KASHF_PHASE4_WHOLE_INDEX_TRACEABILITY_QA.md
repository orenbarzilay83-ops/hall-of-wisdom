# KASHF Phase 4 — Whole-Index Traceability QA

Branch: `codex/kashf-phase4-v57-corrections-p44-53`

## Scope

This QA is the checkpoint after the printed-page boundary repair and the staged Master-Index synchronization. It verifies traceability and source placement only. It does **not** authorize runtime implementation and it does **not** close content-correction queue items whose corrected HTML artifact is not yet versioned in the repository.

Inputs:

- exact user-supplied v57 input: `kashf-v57-draft(1).html`
  - SHA-256: `1939848fc5c1b2f773cc4851401c8f6455e1c7d428af14da8a18a8bd1359a295`
- current corrected boundary working artifact: `kashf-v57-draft-phase4-boundary-batch07.html`
  - SHA-256: `74c4fbf81fb7b55ad73bd6beaf3babe68d06b7c462be80080e964c89917a73bc`
- AI Master Index: `kashf-v57-ai-master-index.html`
- all staged Master-Index sync patches through printed p276
- authoritative printed Arabic scan `كشف الأسرار المصونة في إخراج الضمائر المخزونة`

## 1. Corrected-v57 structural QA — PASS

Programmatic checks on `batch07`:

- numbered page anchors found: **256**
- unique numbered page anchors: **256**
- exact anchor range: **p21–p276**
- missing numbered pages: **0**
- duplicate numbered page IDs: **0**
- numbered page order is strictly sequential p21, p22, …, p276

Therefore the boundary repair did not create a numeric retrieval hole or duplicate page identity.

## 2. Printed-page / scan-page offset invariant — PASS

For the staged synchronization ranges, `scanPdfPages` follows the authoritative scan offset consistently:

`scan PDF page = printed KASHF page + 2`

This invariant is preserved in the staged page-span repairs through p276, including the mixed chapter-boundary pages.

## 3. Cross-page retrieval seams — PASS

The staged index now preserves the source units that genuinely cross printed page boundaries rather than forcing a one-page retrieval model. The final audited set includes, among others:

- orders 12–14 across p147→p150;
- illness/prognosis p199→p200;
- mutual-gaze fire-row rule p204→p205;
- virgin/non-virgin rule p206→p207;
- marriage-house figure sequence p207→p209;
- woman-by-man’s-houses p209→p210;
- winner/loser p212→p214;
- enemy/allies/two-armies p214→p216;
- circular seeker p218→p219;
- hidden-request/year material p220→p222;
- yearly-price continuation p222→p223;
- theft-direction/place p224→p226;
- livestock p226→p227;
- surroundings/external thief addendum p227→p229;
- comprehensive theft rule p229→p230;
- Gate-8/Gate-9 mixed page p235;
- Gate-9 promise/Gate-10 mixed page p256;
- Gate-10/Gate-11 mixed page p263;
- Gate-11/Gate-12 mixed page p271;
- Al-Multaqat prisoner ending p275→p276.

Intentional overlaps are retained where one printed page contains the end of one source unit and the beginning of another.

## 4. Gate boundary QA — PASS

After applying the staged synchronization patches in order, the source-layer gate ranges are expected to be:

- Gate 8 / theft: indexed through **p235**; chapter closes on mixed page p235; first full Gate-9 page is p236.
- Gate 9 / travel: begins on mixed page **p235**, continues through **p256**, and closes on mixed page p256; first full Gate-10 page is p257.
- Gate 10 / authority: begins on mixed page **p256** and closes on mixed page **p263**.
- Gate 11 / friends-hope: begins on mixed page **p263** and closes on mixed page **p271**.
- Gate 12 / enemies-prisoners: begins on mixed page **p271** and closes with the book body on **p276**.

The overlaps at p235, p256, p263 and p271 are source facts, not index duplication errors.

## 5. Queue-safety QA — PASS

The synchronization work does not convert content-only uncertainty into source certainty.

No staged sync change intentionally turns an OPEN v57 correction item into CLOSED merely because page placement is now correct. When the corrected working HTML already appears source-correct, the queue summary is updated to say so but the item remains OPEN until the corrected HTML artifact is versioned and repository-diff reviewed.

Live content blockers intentionally preserved include at least:

- p244 separate `الكوسج` and `نقي الخد` source tokens;
- p254 Mercury-profession `الغرايم/الغرائم` terminology;
- p260 H9 benefic=justice / malefic=injustice polarity in current Hebrew content;
- p263 printed `الجودلة` identity;
- p267 hope-house list H1/H2/H5/H13;
- p269 omitted false/untruthful-promise clause;
- p270 `مال إلى الأول` = “leans to the first,” not “to the one/singular”;
- p275 H11 as an independent alternative rather than an added condition.

Working-copy repairs at p246, p251, p273 and p276 remain queue-open pending artifact versioning/diff review.

## 6. p111 regression/audit recheck — CORRECTED AND PASS

Whole-index QA caught one **audit conclusion error**, not a source ambiguity.

The earlier Phase-4 log had stated that printed p111 supported H11/H12 alternate values 760/770. That statement was wrong.

The authoritative scan was rendered directly at printed p111 / PDF p113 and its embedded text layer was checked against the visual page. The source clearly reads:

- H7 primary: **29** (`تسعة وعشرون`)
- H11 primary 66; alternate: **600** (`ستمائة`)
- H12 primary 79; alternate: **700** (`سبعمائة`)

The exact uploaded v57 contains 760/770 and is wrong on these two alternates. The current corrected boundary artifact from `batch03` onward contains 600/700, which is source-correct. The existing Master-Index item `B05-P111-MONEY-NUMBERS` was therefore correct and must not be deleted as stale.

Actions taken during this QA:

- corrected `KASHF_PHASE4_V57_CORRECTION_LOG.md` so the wrong 760/770 conclusion is explicitly superseded;
- added `KASHF_PHASE4_V57_CORRECTIONS_P111.patch` to make the 600/700 correction auditable in repository history;
- retained the guard not to alter the separate p106 sequence where position 7 = 28.

## 7. Historical batch labels — RETAIN

The Master Index `coverage.completedBatches` labels describe the historical indexing batches. Their names are not treated as authoritative rule boundaries and therefore are not rewritten merely because later page-boundary QA found cross-batch source units. Traceability is carried by `bookPages`, `scanPdfPages`, `v57Anchors`, source-verification notes and gate-status fields.

## 8. Remaining blocker before queue closure

The current corrected HTML working artifact is still local and not versioned in the repository as the canonical corrected `kashf-v57-draft.html`. Therefore:

- source/content correction work may continue locally and as explicit patch artifacts;
- Master-Index sync patches may be reviewed/applied;
- queue items must **not** be marked fully closed solely from the local working copy;
- runtime/Registry/routing/Golden Tests remain out of scope.

## QA result

**TRACEABILITY QA: PASS, with one audit defect found and corrected (p111).**

The source-page boundary layer is synchronized through printed p276 at patch level, page-anchor integrity is intact, gate overlaps are explicitly modeled, and the live content blockers remain visible. The next allowed Phase-4 action is to resume the normal `v57CorrectionQueue` in printed-page order while preserving the artifact-versioning guard above.
