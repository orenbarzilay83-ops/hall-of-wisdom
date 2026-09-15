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

## Batch 2 — printed pp46–53 — `houses.p46-53.profiles`

### p46 — H1 / `PASS2-P46-H1-PROFILE-V57`

Printed p46–47 includes `المعاونين` and the `العمر` age/lifespan sense. Current v57 now explicitly says `אורך החיים` and `במסייעים`. The old queue description is therefore stale for the current File Library artifact; no new v57 text patch is staged for H1.

Status: **CURRENT v57 ALREADY SATISFIES THIS CORRECTION / QUEUE CLEANUP DEFERRED UNTIL EXACT v57 IS IMPORTED AND DIFFED**.

### p47 — H2 / `B01-P47-H2`

Printed p47 reads `وعلى ما يستقبل رضاعه من الأولاد`. Current v57 narrows this to `מינקת הילדים`, which is not a safe one-to-one rendering. The staged patch removes the narrowing and preserves the exact Arabic phrase inline until its technical Hebrew wording is closed.

Status: **SOURCE VERIFIED / PATCH STAGED / QUEUE REMAINS OPEN UNTIL APPLIED**.

### p47 — H3 / `B01-P47-H3`

Printed p47 begins the domain with brothers and sisters; it does not add `המים` as a domain noun. It also contains `وقلب البقاء وما لا يكون`, which current v57 omits. The staged patch removes the extra `המים` and restores the exact omitted Arabic clause inline rather than inventing a translation.

Status: **SOURCE VERIFIED / PATCH STAGED / QUEUE REMAINS OPEN UNTIL APPLIED**.

### pp48–49 — H5 / `PASS2-P48-49-H5-PROFILE-V57`

The current v57 artifact now materially contains the items previously reported omitted: the list includes the equivalent working renderings for `الغنج`, `كسر الحواجب`, `المكاتب`, `القمر`, `الزنا`, `أموال الآباء الماضين`, and the `الجوار / المغاني` area. Therefore no structural-omission patch is staged for H5 in this batch.

Some difficult lexical choices may still merit terminology review, but they must not be converted into a wholesale rewrite when the source list is already materially present.

Status: **STRUCTURAL BLOCKER APPEARS SATISFIED IN CURRENT v57 / TERMINOLOGY REVIEW ONLY / QUEUE CLEANUP DEFERRED UNTIL IMPORT+DIFF**.

### p50 — H8 / `PASS2-P50-H8-NUWL-PHRASE-V57`

Printed p50 clearly has `وعلى الشرك والنول بلا تثمين`. Current v57 still says `שותפות בלא תיקון`. The technical phrase is not securely translated by that wording. The staged patch preserves the exact Arabic source phrase inline and marks its technical rendering as unresolved rather than guessing.

Status: **SOURCE VERIFIED / PATCH STAGED / QUEUE REMAINS OPEN UNTIL APPLIED**.

### p50 — H9 / `PASS2-P50-H9-HULI-TAISIYYA-V57`

Printed p50 contains the unusual `الحلي التعيسية`. Current v57 reduces it to generic `תכשיטים`. The staged patch restores the exact Arabic token inline and leaves the technical Hebrew meaning open.

Status: **SOURCE VERIFIED / PATCH STAGED / QUEUE REMAINS OPEN UNTIL APPLIED**.

### p51 — H10 / `PASS2-P51-H10-NAW-WA-DAW-V57`

Printed p51 explicitly lists `النوء ، والضوء ، والملائكة ، وأمورهم`. Current v57 keeps only `האור, המלאכים וענייניהם`. The staged patch restores `النوء` as its own source token and explicitly ties `האור` to `الضوء`.

Status: **SOURCE VERIFIED / PATCH STAGED / QUEUE REMAINS OPEN UNTIL APPLIED**.

### p52 — H12 / `PASS2-P52-H12-NAWAWIS-V57`

Printed p52 uses `النواويس`. Current v57 has improved from the older generic `בתי הקברות` to `כוכי הקבורה ומבני הקבורה`, but it still suppresses the exact technical source token. The staged patch retains the current Hebrew wording and adds `النواويس` explicitly, avoiding a false claim that the lexical question is fully closed.

Status: **SOURCE VERIFIED / PATCH STAGED / QUEUE REMAINS OPEN UNTIL APPLIED**.

### p53 — H15 / `PASS2-P53-H15-UNSUPPORTED-LIGHT-V57`

Printed p53 reads exactly `فإذا جاء في الثالث عشر شكل ثقيل ، وفي الرابع عشر شكل يعلم أنه غلط`. No `خفيف` / “light” appears after H14, and the printed sentence is syntactically defective. Current v57 silently supplies `בארבעה־עשר צורה קלה`. The staged patch removes that invented symmetry and preserves the defective printed sentence explicitly.

Status: **SOURCE CONFLICT PRESERVED / PATCH STAGED / QUEUE REMAINS OPEN UNTIL APPLIED**.

## Phase 4 progress after pp44–53

Source-order review completed through printed p53. Two current-v57 blockers in this range (H1 p46 and the structural H5 omission claim on pp48–49) appear already repaired in the File Library artifact and should not be rewritten redundantly. Seven p47–53 corrections plus the two p44–45 corrections are staged in patch files. No `v57CorrectionQueue` item is marked resolved yet because the exact v57 artifact has not been imported into the repository and patched in-place.

## Next in page order

Continue with printed p65 onward. Before each correction, compare the exact current File Library v57 wording to the printed scan and drop any stale queue item rather than reintroducing an old defect.
