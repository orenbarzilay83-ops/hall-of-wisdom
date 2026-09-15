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

## Batch 3 — printed pp65–66

### p65 — `B02-P65-SOUGHT-WORDING`

The printed p65 table was visually checked from the authoritative scan. Two live wording issues remain in current v57:

- row 2 prints `مطلوب ، منتظر ، معدوم ، منحضر ، باكي ، صامت`; current v57 renders the middle as `נעדרת וממתינה`, which suppresses the distinct printed token `منحضر`;
- row 6 prints `مطلوب ، بالرفق معدم ، أمن ، ناظر ، متحرك`; current v57's `מבוקשת ברוך/בעדינות; נעדרת` is still an interpretive split of the compact source phrase `بالرفق معدم`.

The staged patch preserves `منحضر` and `بالرفق معدم` explicitly rather than claiming a final Hebrew technical meaning.

The old row-8 blocker is stale: current v57 already reads `נעדר גבול; מקצר/חסר`, matching the printed `معدوم حد، مقصر` materially. The earlier row-6 wording was also improved, but still needs source-token preservation as above.

Status: **SOURCE VERIFIED / TWO TARGETED WORDING PATCHES STAGED / STALE ROW-8 PART CLOSED IN PRINCIPLE**.

### pp65–66 — `figures.p65-66.house-gender-context`

Printed p66 repeatedly uses the explicit source expressions `وله فرج حقيقي` and `ليس له فرج حقيقي` in the male/female and point-balance branches. Current v57 repeatedly replaces them with the interpretive phrase `סימן מין ממשי` and in the first branch even reshapes the syntax as `או על דבר שיש לו...`.

The staged patch keeps the operational male/female logic but restores the exact Arabic expressions inline, without expanding them into an anatomical interpretation not authorized by the printed source.

Status: **SOURCE VERIFIED / PATCH STAGED / QUEUE REMAINS OPEN UNTIL APPLIED**.

## Batch 4 — printed pp97–101

### pp97–99 — `B04-P97-99-DIGNITIES`

The printed source table was visually checked against current v57. Three live defects remain and are staged in `KASHF_PHASE4_V57_CORRECTIONS_P97_99.patch`:

- the current unsupported `סוהר / العقلة` row is replaced by the printed `חיבור / الاجتماع` row;
- the current unsupported `ממון נכנס / قبض داخل` row is replaced by the printed `דרך / الطريق` row;
- `ממון יוצא / قبض خارج` has face H5 in print, not H3.

Earlier defects for Ataba Kharija, Nusra Kharija and Nusra Dakhila are already materially repaired in the current v57 artifact and are not reintroduced.

Status: **SOURCE VERIFIED / THREE TARGETED REPAIRS STAGED**.

### p100 — `B04-P100-VENUS-JOY`

Printed p100 confirms the omitted Venus joy in H5. It also confirms the grief pair `البياض + الطريق` at H1 and keeps `قبض خارج + عتبة خارج` together under the source's tentative clause `لعله ملحوقات بزحل والمريخ`. The staged p100 patch restores exactly those distinctions without strengthening the source's tentative wording.

Status: **SOURCE VERIFIED / PATCH STAGED**.

### p101 — `B04-P100-101-MONTHS`

Printed p101 was re-read visually after an apparent line-wrap ambiguity. The source clearly reads `شوال ، ومحرم له : البياض`, so Bayad/לבן belongs to both Shawwal and Muharram. Current v57 already has Bayad with Muharram but omits its additional Shawwal association; the staged patch correctly changes that clause to `לשוואל ולמוחרם שייכת לבן` while preserving the separate source association `שוואל → קהלה`.

The second historical blocker in the queue is already stale in current v57: printed p101 has `ربيع الآخر له : عتبة داخلة`, and current v57 already includes `סף נכנס` with Rabi al-Akhir. No second patch is needed.

Status: **SOURCE VERIFIED / ONE LIVE ASSOCIATION PATCH STAGED / ATABA-DAKHILA PART STALE**.

## Batch 5 — printed pp111–115

### p111 — `B05-P111-MONEY-NUMBERS`

This queue item was rechecked before staging any change and was found to be stale/wrong for the authoritative printed page and current v57.

Printed p111 gives:

- H7 primary = 29;
- H11 primary = 66, alternate = 760;
- H12 primary = 79, alternate = 770.

The exact current File Library v57 already has 29 / 760 / 770. Therefore the queue summary that asks for H11 alternate=600 and H12 alternate=700 must **not** be applied. No p111 correction patch is staged.

Status: **CURRENT v57 MATCHES PRINTED SOURCE / QUEUE ITEM STALE / REMOVE ONLY AFTER EXACT v57 IMPORT+DIFF**.

### pp112–115

No `v57CorrectionQueue` item targets printed pp112, 113, 114 or 115. Their source unit was inspected only to preserve page-order continuity; Phase 4 does not create speculative changes where the Master Index records no demonstrated v57 defect.

Status: **NO QUEUE ACTION IN THIS RANGE**.

## Phase 4 progress through p115

Source-order review has now covered all open correction points encountered through printed p115. The branch contains staged patch files for the live defects through p101; p111 was deliberately not patched because its queue instruction is stale.

No `v57CorrectionQueue` item is marked resolved yet. The next required operation is no longer to accumulate more patches: it is to import the exact current `kashf-v57-draft.html` artifact unchanged at repository root, then apply the staged source-verified corrections, run diff/QA, and only then clean stale queue entries and update verification statuses.

## Continuation pointer

**BLOCKER BEFORE FURTHER CORRECTION EXECUTION:** obtain the exact current `kashf-v57-draft.html` artifact used during this audit and commit it unchanged to the Phase 4 branch. Do not recreate it from v56 and do not substitute another copy. Once imported, apply the staged patches in printed-page order and verify each change against the printed scan before closing any queue item.
