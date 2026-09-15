# KASHF Phase 4 — v57 Correction Execution Log

Phase 4 starts from merged PR #53 / `main` SHA `c000899d75fa3e095e957c8712a7dbb66673c0de`.

## Operating rule

The authoritative correction target is the exact current `kashf-v57-draft.html` working artifact supplied by the user. Do **not** regenerate v57 from v56, do **not** substitute the Arabic-only helper PDF, and do **not** mark a `v57CorrectionQueue` item resolved merely because a proposed patch was written.

Source authority remains the printed Arabic scan `كشف الأسرار المصونة في إخراج الضمائر المخزونة`; OCR/Arabic-only text is helper evidence only.

## Imported artifact checkpoint — 2026-09-15

The exact working v57 artifact was supplied in the active conversation as `kashf-v57-draft(1).html`. The `(1)` suffix is only the upload/download filename suffix.

Input artifact QA:
- bytes: `4,646,535`
- SHA-256: `1939848fc5c1b2f773cc4851401c8f6455e1c7d428af14da8a18a8bd1359a295`
- page anchors p21–p276: 256/256 present
- duplicate page anchors: 0

The source-verified staged corrections already prepared on this branch were applied to an exact local copy of that artifact. All 21 targeted old strings matched exactly once before replacement.

Corrected local artifact:
- filename: `kashf-v57-draft-phase4-batch1.html`
- bytes: `4,649,358`
- SHA-256: `a2a8bf35ee6270627045c3a39e2dfcecd2e23ed3da1639920d3acbb612e1b2e7`
- page anchors p21–p276: 256/256 present
- missing page anchors: 0
- duplicate page anchors: 0

Repository provenance and QA are also recorded in `KASHF_PHASE4_IMPORTED_ARTIFACT_MANIFEST.md`.

## Batch 1 — printed pp44–45

### p44 — `B01-P44-TAXONOMY`

Printed scan p44 / PDF scan p46 was visually checked. The source distinguishes four separate classifications:

- `الأوتاد`: H1/H4/H7/H10 — present/current.
- `مائل الأوتاد`: H2/H5/H8/H11 — future.
- `زايد الأوتاد`: H3/H6/H9 — past.
- `الساقط`: H6/H12 — separate classification.

Current v57 collapses H3/H6/H9/H12 into one Hebrew “נופלי היתדות” group. The staged correction restores the source distinction and deliberately retains the Arabic technical labels for the two potentially ambiguous Hebrew terms.

Status: **SOURCE VERIFIED / PATCH APPLIED TO EXACT LOCAL v57 COPY / QUEUE NOT YET CLOSED IN MASTER INDEX**.

### p45 — `B01-P45-WALTHANI`

Printed scan p45 / PDF scan p47 was visually checked. After the three explicitly printed sextile relations, the source prints the isolated token `والثاني`, followed by `ويخص كل تسديس وتدان`. Its syntactic role is not determinable safely from the printed source.

The correction does not invent a fourth sextile pair. It adds an explicit source note preserving `والثاني` and the uncertainty.

Status: **SOURCE CONFLICT PRESERVED / PATCH APPLIED TO EXACT LOCAL v57 COPY**.

## Batch 2 — printed pp46–53 — `houses.p46-53.profiles`

### p46 — H1 / `PASS2-P46-H1-PROFILE-V57`

Printed p46–47 includes `المعاونين` and the `العمر` age/lifespan sense. Current v57 already explicitly says `אורך החיים` and `במסייעים`. The old queue description is stale; no rewrite was introduced.

Status: **CURRENT v57 ALREADY SATISFIES THIS CORRECTION / QUEUE CLEANUP PENDING MASTER-INDEX UPDATE**.

### p47 — H2 / `B01-P47-H2`

Printed p47 reads `وعلى ما يستقبل رضاعه من الأولاد`. Current v57 narrows this to `מינקת הילדים`, which is not a safe one-to-one rendering. The correction removes the narrowing and preserves the exact Arabic phrase inline until its technical Hebrew wording is closed.

Status: **SOURCE VERIFIED / PATCH APPLIED**.

### p47 — H3 / `B01-P47-H3`

Printed p47 begins the domain with brothers and sisters; it does not add `המים` as a domain noun. It also contains `وقلب البقاء وما لا يكون`, which current v57 omits. The correction removes the extra `המים` and restores the exact omitted Arabic clause inline rather than inventing a translation.

Status: **SOURCE VERIFIED / PATCH APPLIED**.

### pp48–49 — H5 / `PASS2-P48-49-H5-PROFILE-V57`

The current v57 artifact materially contains the items previously reported omitted: `الغنج`, `كسر الحواجب`, `المكاتب`, `القمر`, `الزنا`, `أموال الآباء الماضين`, and the `الجوار / المغاني` area. No structural-omission rewrite was introduced.

Status: **STRUCTURAL BLOCKER SATISFIED IN CURRENT v57 / TERMINOLOGY REVIEW ONLY / QUEUE CLEANUP PENDING**.

### p50 — H8 / `PASS2-P50-H8-NUWL-PHRASE-V57`

Printed p50 clearly has `وعلى الشرك والنول بلا تثمين`. Current v57 says `שותפות בלא תיקון`. The correction preserves the exact Arabic source phrase inline and marks its technical rendering as unresolved rather than guessing.

Status: **SOURCE VERIFIED / PATCH APPLIED**.

### p50 — H9 / `PASS2-P50-H9-HULI-TAISIYYA-V57`

Printed p50 contains the unusual `الحلي التعيسية`. Current v57 reduces it to generic `תכשיטים`. The correction restores the exact Arabic token inline and leaves the technical Hebrew meaning open.

Status: **SOURCE VERIFIED / PATCH APPLIED**.

### p51 — H10 / `PASS2-P51-H10-NAW-WA-DAW-V57`

Printed p51 explicitly lists `النوء ، والضوء ، والملائكة ، وأمورهم`. Current v57 keeps only `האור, המלאכים וענייניהם`. The correction restores `النوء` as its own source token and explicitly ties `האור` to `الضوء`.

Status: **SOURCE VERIFIED / PATCH APPLIED**.

### p52 — H12 / `PASS2-P52-H12-NAWAWIS-V57`

Printed p52 uses `النواويس`. Current v57 has improved to `כוכי הקבורה ומבני הקבורה`, but suppresses the exact technical source token. The correction retains the Hebrew wording and adds `النواويس` explicitly.

Status: **SOURCE VERIFIED / PATCH APPLIED**.

### p53 — H15 / `PASS2-P53-H15-UNSUPPORTED-LIGHT-V57`

Printed p53 reads exactly `فإذا جاء في الثالث عشر شكل ثقيل ، وفي الرابع عشر شكل يعلم أنه غلط`. No `خفيف` / “light” appears after H14, and the printed sentence is syntactically defective. Current v57 silently supplies `בארבעה־עשר צורה קלה`. The correction removes that invented symmetry and preserves the defective printed sentence explicitly.

Status: **SOURCE CONFLICT PRESERVED / PATCH APPLIED**.

## Batch 3 — printed pp65–66

### p65 — `B02-P65-SOUGHT-WORDING`

Two live wording issues were corrected:

- row 2 preserves the distinct printed token `منحضر` rather than collapsing it into `נעדרת וממתינה`;
- row 6 preserves the compact source phrase `بالرفق معدم` rather than splitting it interpretively.

The old row-8 blocker is stale: current v57 already reads `נעדר גבול; מקצר/חסר`, materially matching the printed `معدوم حد، مقصر`.

Status: **SOURCE VERIFIED / TWO TARGETED PATCHES APPLIED / STALE ROW-8 PART CLOSED IN PRINCIPLE**.

### pp65–66 — `figures.p65-66.house-gender-context`

Printed p66 repeatedly uses `وله فرج حقيقي` and `ليس له فرج حقيقي`. The correction keeps the operational male/female logic but restores these exact Arabic expressions inline, without expanding them anatomically beyond the source.

Status: **SOURCE VERIFIED / FOUR TARGETED PARAGRAPH PATCHES APPLIED**.

## Batch 4 — printed pp97–101

### pp97–99 — `B04-P97-99-DIGNITIES`

Applied only the live current-v57 repairs established by the source review:

- replace unsupported Aqla row with the printed `اجتماع` / חיבור row;
- replace unsupported Qabd-Dakhil row with the printed `الطريق` / דרך row;
- correct Qabd Kharij face from 3 to printed face=5.

Earlier Ataba Kharija, Nusra Kharija and Nusra Dakhila defects were already repaired in current v57 and were not reintroduced.

Status: **SOURCE VERIFIED / THREE TARGETED PATCHES APPLIED**.

### p100 — `B04-P100-VENUS-JOY`

Applied:
- Venus joy restored at H5;
- erroneous Tariq+Qabd-Kharij H1 grief pair corrected to Bayad+Tariq;
- Qabd Kharij + Ataba Kharija both preserved in the tentative Saturn/Mars attachment clause, retaining the source's own uncertainty `لعله ملحوقات بزحل والمريخ`.

Status: **SOURCE VERIFIED / PATCH APPLIED**.

### p101 — `B04-P100-101-MONTHS`

Current v57 already contains Ataba Dakhila with Rabi al-Akhir, so that old blocker is stale. The live omission was Bayad with Shawwal in addition to Muharram. The correction now states Shawwal + Muharram for Bayad.

Status: **SOURCE VERIFIED / ONE LIVE MONTH PATCH APPLIED / STALE SUB-BLOCKER IDENTIFIED**.

## Batch 5 checkpoint — printed pp111–115

The p111 money table was rechecked against the printed scan before staging any change. The old queue wording that proposed changing H11/H12 alternates to 600/700 is not supported by the printed source currently under review. The supplied current v57 contains H11=760 and H12=770, matching the checked source reading used in this Phase 4 pass. No p111 patch was created.

No additional live v57 correction item was established on pp112–115 in this checkpoint, so no speculative patch was added.

Status: **REVIEWED THROUGH p115 / NO NEW PATCH**.

## Phase 4 status after exact-artifact application

- exact user-supplied v57 artifact received and fingerprinted
- source-order review completed through printed p115
- 21 targeted replacements applied to an exact local copy
- structural anchor QA passed
- stale queue claims were not reintroduced
- Master Index queue statuses are intentionally not yet mutated until the corrected artifact is versioned and the repository diff is reviewable

## Next in page order

Continue from the next live `v57CorrectionQueue` item after p115. Before each correction, compare the exact supplied v57 wording to the printed scan and drop stale queue items rather than reintroducing old defects. Do not move to runtime / Registry / routing / Golden Tests yet.
