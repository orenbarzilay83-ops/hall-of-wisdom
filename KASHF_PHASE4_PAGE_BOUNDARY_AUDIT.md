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

## Structural QA after the p228 checkpoint

The working artifact still contains all 256 page anchors `p21`–`p276`, with no duplicate page IDs. Every numbered page retains its text container and folio marker.

This structural result does **not** by itself certify semantic correctness; it certifies that the page-boundary repairs have not broken the page skeleton.

## Open boundary work

Continue source-first from printed p229 through p276. Known seams/issues that must be preserved explicitly during this continuation include:

- printed p229→p230 comprehensive theft rule crosses the page boundary; the dedicated p230 knowledge unit remains an intentional overlapping retrieval unit;
- printed p246 has `فهو مكتوب`, while the later p251 repetition has `فهو منكوب`; do not repair p246 from p251 by analogy;
- the final printed p276 text includes `وعدمه` and explicit `انتهى الكتاب`.

After p276 is closed, re-audit Master Index `bookPages` + `v57Anchors` against the corrected page distribution before ordinary `v57CorrectionQueue` work resumes.
