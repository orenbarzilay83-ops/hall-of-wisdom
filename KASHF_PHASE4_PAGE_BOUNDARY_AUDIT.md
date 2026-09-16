# KASHF Phase 4 — Page Boundary + Heading Audit

## Purpose

This pass exists specifically to protect AI retrieval. A numerically complete `#pN` anchor set is not enough: if printed-source text has leaked into the next/previous HTML page, or if an editorial heading sits on the wrong page, page-based retrieval can silently omit or misassign knowledge.

Authority order remains:

1. printed Arabic KASHF scan;
2. exact current v57 Hebrew artifact supplied by the user;
3. AI Master Index;
4. later engines/registry/routing/tests.

No runtime implementation is part of this pass.

## Audit contract

For every printed page seam, verify:

- actual beginning of printed page;
- actual end of printed page;
- sentence/paragraph continuation across the seam;
- headings that genuinely occur in the printed source;
- tables/lists that cross the seam;
- whether the corresponding v57 `#pN` contains exactly that source-page content.

Editorial navigation headings that are not in the printed source must not be allowed to redefine source-page boundaries. Semantic/terminology defects discovered incidentally are recorded but are not silently closed merely because the boundary is repaired.

## Completed boundary work

### Earlier ranges through p150

The audit already repaired/verified the earlier source-page distribution, including the known placement-order drift:

- order 12 begins on printed p147 and continues on p148;
- order 13 begins on printed p148 and continues on p149;
- order 14 begins on printed p149 and continues on p150.

The old v57 placement had shifted their visible starts/headings forward. The corrected working artifact restores printed-page distribution without inventing a title for the damaged/blank order-13 heading.

### Printed pp151–200

A dedicated seam pass was completed through p200. Source-clear continuations were moved back to their actual printed pages, including seams at p151→152, p153→154, p154→155, p155→156, p156→157, p157→158, p158→159, p159→160, p161→162, p162→163, p163→164, p167→168, p168→169, p169→170, p170→171, p171→172, p172→173, p173→174, p174→175, p175→176, p176→177, p180→181, p182→183, p186→187, p188→189, p189→190, p190→191, p191→192, p196→197, p197→198 and p199→200.

Printed p164 was also rechecked against the source. Its final two source-clear clauses were restored to p164: `نقي الخد` repeated two or three times = fear, and adjacent `القبض الخارج` = fitna / movement in a blameworthy fitna. The distinct p165 continuation remains a separate source unit.

### Printed pp200–228

The next seam pass completed the source-page distribution through p228.

Key repairs:

- **p200→201:** the illness outcome/timing paragraph belongs to printed p200; p201 starts the next illness rule.
- **p201→202:** printed p201 opens the lost-item-return rule with `في الضال ورجوعها ... الثامن والسادس`; its Hebrew lead was moved back to p201, while p202 now starts with the outcome.
- **p202→203:** p202 ends the Bayad/H8 clause with `فإنه يدل على البكاء`; p203 begins the next death/inheritance continuation.
- **p203→204:** the funerary sequence belongs to printed p204 and was moved out of p203.
- **p204→205:** visually checked against the authoritative scan; the gaze-rule sentence breaks exactly after the p204 condition and continues on p205.
- **p206→207:** the virgin/non-virgin rule starts on p206 and continues on p207.
- **p207→208:** the first old v57 p208 paragraph was actually the printed tail of p207 and was moved back.
- **p208→209:** the next rule begins on p208 and continues into p209.
- **p209→210:** p209 ends with the bed-house case `היא טובה`; p210 begins the continuation `מבורכת ומתאימה...`.
- **p211→212:** the repeated-H7 rule begins on p211 and continues on p212.
- **p212→213:** the winner/loser method begins on p212 and continues on p213.
- **p218→219:** the printed word itself is split across pages: p218 ends `والخامس` and p219 begins `عشر`, together `الخامس عشر` = fifteenth. The Hebrew page seam now preserves fifteen rather than turning the split into fifth.

Existing seams p210→211, p213→214, p216→217, p220→221, p222→223, p224→225, p226→227, p227→228 and p228→229 were checked and retained where already source-aligned.

Genuine source headings preserved in this range include printed p204 Chapter 7, printed p221 `نزهة العقول` addition heading, and printed p224 Chapter 8.

### Printed pp229–252

The boundary pass then repaired the dense theft, loan/inheritance, travel and absent-person block. The working artifact for this checkpoint is `kashf-v57-draft-phase4-boundary-batch06.html`.

Important results include:

- the comprehensive theft rule is preserved as a true p229→p230 cross-page unit;
- the thief-description sequence is restored to the printed p231–234 distribution instead of drifting one page forward;
- the loan/inheritance material and the opening of Chapter 9 are restored to the printed p235 seam;
- the travel and absent-person sequences are redistributed across printed pp236–252 rather than being retrieved from later HTML anchors;
- printed p246 remains `فهو مكتوب`; the later p251 repetition `فهو منكوب` is not used to normalize p246 by analogy.

All pages p229–252 changed in the boundary working copy because the prior drift was cumulative across the block.

### Printed pp253–276 — CLOSED

The final source-page pass was completed against rendered scans/PDF pages 255–278 and the scan's embedded text layer as helper evidence. The authoritative visual pages were checked before applying the repairs. The resulting working artifact is `kashf-v57-draft-phase4-boundary-batch07.html`.

Source-clear seam repairs:

- **p255→p256:** p255 stops where the printed promise rule stops; the ninth/third/tenth continuation now precedes Chapter 10 on p256, so the chapter heading no longer hides previous-rule content.
- **p256→p257:** the printed office-seeking/duration rule is restored; the mutable-form dismissal breaks at the printed page edge and p257 begins with its continuation “quickly.”
- **p258→p259:** p258 ends after “if the fourth figure rises—”; p259 begins “incoming — he is in office.”
- **p260→p261:** restored the p261 opening continuation `واستمال الرعية إليه` before the H3 branch.
- **p261→p262:** restored the justice clause across the actual page break; p262 begins with the continuation about justice, rejection of oppression/falsehood, and support for the righteous.
- **p262→p263:** `تسلب دولته` is again a true cross-page sentence. Chapter 11 follows only after the continuation and `رجع إلى الكتاب`.
- **p263→p264:** p263 ends at `حرامية`; p264 begins `لصوص، قطاع الطريق` — thieves are no longer collapsed with the next-page robbers/highwaymen phrase.
- **p267→p268:** the high-livelihood figure set was moved from p267 to its printed location at the start of p268.
- **p270→p271:** `وإن كان نحسا خارجا، تركها أصلح` is restored to the start of p271.
- **p272→p273:** the dangling printed `وإن` / H5-Ankis continuation is explicitly preserved.
- **p273→p274:** prisoner clauses that had leaked into p274 were restored to p273. This also source-closes the printed polarity here: benefic incoming = long stay; malefic outgoing + abundant Humra = bloodshed; malefic incoming = illness/death. p274 now starts with the H7/H8 fear continuation.
- **p274→p275:** the Nusra Dakhila/Nusra Kharija fine-and-release sentence is split at the real page edge; p275 begins with its printed continuation and `والله أعلم`.
- **p275→p276:** the final continuation into p276 is preserved.
- **p276:** the final source line is restored as `التكرار يعلم سبب خروجه وعدمه، انتهى الكتاب`. In the Hebrew working copy `وعدمه` is treated as absence/non-exit, not “delay,” and the unsupported expanded ending was removed.

The detailed final-range repair manifest is `KASHF_PHASE4_PAGE_BOUNDARY_P253_276.md`.

## Structural QA after closing p276

The boundary working artifact still contains exactly **256 unique numbered page anchors**, `p21` through `p276`, with no missing page IDs and no duplicates. Every numbered page retains its `article.text` container and folio marker.

Boundary/source placement is now audited through the end of the printed book. This does **not** mean every terminology/content queue item is resolved: unresolved lexical readings, canonical figure naming, and other semantic corrections remain separate Phase 4 work.

## Next mandatory step

Before ordinary `v57CorrectionQueue` work resumes, re-audit the AI Master Index against the corrected page distribution:

1. `bookPages` must describe the actual printed-source range;
2. `v57Anchors` must point to every corrected HTML page needed to retrieve the complete rule;
3. cross-page rules must retain all required anchors rather than being collapsed to a single page;
4. headings that moved during the boundary repair must not leave stale topic/index anchors;
5. source-overlap records such as p229→p230 must remain intentional and documented.

Only after this synchronization is clean should normal Phase 4 content correction continue. Runtime/registry/routing/Golden-Test implementation remains out of scope until the source layer is closed.
