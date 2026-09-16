# KASHF Phase 4 — Batch 10 audit, printed pp164–172

Branch: `codex/kashf-phase4-v57-corrections-p44-53`

Authoritative source: printed Arabic scan `كشف الأسرار المصونة في إخراج الضمائر المخزونة`.
Working input: `kashf-v57-draft-phase4-content-batch09.html`.
Working output: `kashf-v57-draft-phase4-content-batch10.html`.

Output SHA-256: `6ba9072674133755ca4fbe6e26a005bf89ba4814db0c10d8d414d2667af0f2db`.

Structural QA after the batch:
- page anchors p21–p276: 256/256
- unique page anchors: 256
- missing page anchors: 0
- duplicate page anchors: 0

## p164 — legacy queue item rechecked

Printed p164 / scan166 was visually re-read. The corrected working copy already contains the source-clear clauses:

- repeated `نقي الخد` two or three times = fear;
- adjacent `القبض الخارج` = `فتنة` and movement in a blameworthy fitna.

The Hebrew working copy uses the canonical project name `בר הלחי` for `نقي الخد` and `ממון יוצא` for `القبض الخارج`.

Result: `B10-P164-165-PROXIMITY-CONTINUITY` is already satisfied in the current working artifact at p164. Keep the queue item OPEN until the corrected HTML itself is versioned and diff-reviewed.

## p167 — `B11-P167-BEHIND-WORK-PRONOUN`

Printed p167 / scan169 reads explicitly:

`هل ورائي عمل أم لا؟`

The subject is the questioner: “is there an act/work behind me?”, not “behind the matter.” The working copy now asks whether there is a `פעולה מאחוריי` and keeps the outcome as the work being behind the questioner.

Result: source-verified correction applied locally and staged in `KASHF_PHASE4_V57_CORRECTIONS_P167_172.patch`.

## p168 — `B11-P168-HOUSE-EVENT-TENSE`

Printed p168 / scan170 was visually re-read. The current working copy is already source-aligned:

- first branch is past: something occurred/fell in the house and they rebuilt it;
- only if the questioner denies it does the text move to the future branch: something will fall and they will rebuild it.

Result: stale correction item in the current working artifact; no new text change introduced.

## p169 — `B11-P169-MERCURY-NAME`

Printed p169 / scan171 says `عطارد` explicitly in the Venus/Moon/Mercury validity clause. The generic Hebrew `כוכב` was replaced by `כוכב חמה (عطارد)`.

Result: source-verified correction applied.

## p169→170 — H10 house-class branch

Printed p169–170 / scans171–172 confirms the three-way house class rule already present in the working copy:

- inward figure in an angle = attainment is near;
- in the houses following the angles = attainment after delay;
- if its lord is cadent = the request is not attained.

Result: `B11-P169-170-H10-HOUSE-CLASS` is already satisfied in the working artifact; no speculative rewrite added.

## p170 — `B11-P170-WATER-HOUSES-OMISSION`

The printed source has two distinct checks, not one:

1. complete the board through H16, construct a figure from the water houses, and if it falls in an angle or benefic house **and is inward**, judge attainment;
2. separately inspect the watery houses themselves: if their water row opens, the matter is attained; otherwise the matter is prevented for this questioner.

The second check was missing from the working Hebrew and has now been restored.

## p170 — `B11-P170-GAZE-H1-RECIPROCAL`

Printed p170 / scan172 requires in the second gaze branch:

- H13 fire open;
- H1 fire closed;
- H7 fire open;
- the person looks at the other **and the other looks at him**.

The working copy omitted the closed-H1 condition and reciprocal result. Both are now restored.

## p170 — `B11-P170-ISTIKHARA-NOT-21-CASTINGS`

Printed p170 says:

`فاستخير الله عز وجل أحد وعشرين مرة وأنت طاهر`

This is devotional istikhara to God twenty-one times while pure; it is **not** an instruction to repeat the geomantic casting twenty-one times. The working copy now preserves the technical devotional term and the Arabic phrase `استخارة الله عز وجل` instead of saying “repeat the casting.”

## p171–172 — alternate table boundary

The source table itself was re-rendered through scans173–174. Batch 10 does not claim the full `B11-P170-171-ALTERNATE-TABLE` item closed yet; its row-by-row wording remains the next table-specific correction pass.

## p172 — `B12-P172-H16-OUTCOME-PRECONDITION`

Printed p172 / scan174 begins the outcome procedure with:

`كمل الخط إلى السادس عشر`

The current Hebrew omitted that prerequisite. It is now restored before deriving H1+H7 and H10+H11 and combining the two generated figures.

## p172 — `B12-P172-MATTER-EARNINGS-SCOPE`

Printed p172 asks:

`في أي بيت أمرك وكسبك`

The old Hebrew narrowed this to “the house of the questioner’s money.” The working copy now preserves the broader scope as `עניינך ורכישתך/פרנסתך (أمرك وكسبك)` and retains the H2+H16 derivation.

## Queue policy

None of these queue items is marked CLOSED in the Master Index merely because the local working copy is corrected. Final closure waits for:

1. versioning the corrected HTML artifact in the repository;
2. reviewing the repository diff;
3. applying the Master-Index queue/status cleanup against that versioned artifact.

## Next source-order checkpoint

Continue from the still-live p171 alternate-source table and then p172–173 odd/even movement/money paragraph, followed by p173 qibla/H12 closure.
