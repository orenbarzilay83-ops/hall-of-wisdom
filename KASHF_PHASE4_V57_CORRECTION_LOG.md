# KASHF Phase 4 — v57 Correction Execution Log

Phase 4 starts from merged PR #53 / `main` SHA `c000899d75fa3e095e957c8712a7dbb66673c0de`.

## Operating rule

The authoritative correction target is the exact current `kashf-v57-draft.html` working artifact from File Library. The repository still does not contain that artifact. Do **not** regenerate v57 from v56, do **not** substitute the Arabic-only helper PDF, and do **not** mark a `v57CorrectionQueue` item resolved merely because a proposed patch was written.

Until the exact current v57 artifact can be committed at repository root as `kashf-v57-draft.html`, corrections are staged as source-verified patch files on the Phase 4 branch. Once the exact artifact is available to the repository workflow, it must be imported unchanged first, then the staged patches applied, then queue/status metadata updated only after diff + source verification.

Source authority remains the printed Arabic scan `كشف الأسرار المصونة في إخراج الضمائر المخزونة`; OCR/Arabic-only text is helper evidence only.

## Batch 1 — printed pp44–45

### p44 — `B01-P44-TAXONOMY`

Printed scan p44 / PDF scan p46 was visually checked. The source distinguishes four separate classifications:

- `الأوتاد`: H1/H4/H7/H10 — present/current.
- `مائل الأوتاد`: H2/H5/H8/H11 — future.
- `زايد الأوتاد`: H3/H6/H9 — past.
- `الساقط`: H6/H12 — separate classification.

Current v57 collapses H3/H6/H9/H12 into one Hebrew “נופלי היתדות” group. The staged correction restores the source distinction and deliberately retains the Arabic technical labels for the two potentially ambiguous Hebrew terms.

Status: **SOURCE VERIFIED / PATCH STAGED / QUEUE REMAINS OPEN UNTIL APPLIED TO EXACT v57**.

### p45 — `B01-P45-WALTHANI`

Printed scan p45 / PDF scan p47 was visually checked. After the three explicitly printed sextile relations, the source prints the isolated token `والثاني`, followed by `ويخص كل تسديس وتدان`. Its syntactic role is not determinable safely from the printed source.

The staged v57 correction therefore does not invent a fourth sextile pair. It adds an explicit source note preserving `والثاني` and the uncertainty.

Status: **SOURCE CONFLICT PRESERVED / PATCH STAGED / QUEUE REMAINS OPEN UNTIL APPLIED TO EXACT v57**.

## Next in page order

Continue with printed pp46–53 (`houses.p46-53.profiles`), one source discrepancy at a time, preserving exact Arabic tokens where Hebrew meaning is not securely closed.
