# Hall of Wisdom — Developer Notes for Claude

## Primary Knowledge Source

The Google Drive folder **"ספרים לאפליקציית גורל החול"** is the **primary source** for all knowledge in this application.
When researching new topics, completing missing data, or verifying interpretations — **always search this Drive folder first**.

**IMPORTANT: Always search ALL books in the folder, not just one or two.** Use `mcp__*__search_files` with `parentId = '183LO6vN9CsPW13CkNWN7Q-8_MMylrkmO'` to list every file, then read the relevant ones. Never assume a rule is absent until you have checked every book.

Drive folder ID: `183LO6vN9CsPW13CkNWN7Q-8_MMylrkmO`

All books currently in the folder (verified IDs — use these directly with `mcp__*__read_file_content`):
- `كتاب حاوي العجائب ومظهر الغرائب` — ID: `1xpCq1_f0nWePxBuTbbeDMULXN2ni_R8w` — core source: figure transits, figure states, house foundations
- `بلوغ الامل في علم الرمل` — ID: `1wsc6uO3WdChDyKS7jgz4qrDXdhBdKwcl` — question rules, house principles, judge rule, الجملة modulo methods (pp. 62-63)
- `كتاب القول الجامع في علم الرمل` — ID: `1bcjfmfswbu7Jz0EX-_vdnTZ3osykgEIy` — board completeness (96-point rule, pp. 36+51), advanced methods
- `كتاب القول الجامع في علم الرمل` (folder, 54 PDFs) — ID: `10Xm2C0F72xnDGIjqqU9JMOwPW3OIErrb` — extended edition, 7×7 isqat and more
- `الفلك المشحون في علم الرمل المصون` — ID: `1t2Xc7vAgqL3DRMH9K2hqKjSLtlnJfedB` — Omani tradition source
- `نهاية العمل في علم الرمل` — ID: `1r3coMHimy_tYpZNc19cYF_sYPMhL9Wa6` — comprehensive encyclopedia of geomancy
- `علم الرمل دروس مهمة` — ID: `1TuD3-lVdP-c1W_Aipfgoh7mAcqGB3LL3` — practical lessons
- `علم الرمل` — ID: `1XaL--Oce-VDFq2Zj-twdvdeBioTBTFtG` — general reference
- `John Michael Greer — The Art and Practice of Geomancy` — ID: `1fHWTDOQHBQa81FgCg6U9Cio8rxUZXqdN` — European geomancy tradition

## Branch

Active development branch: `claude/book-format-preference-b4laA`

## Core Rule — No Invented Data

**NEVER insert into the application any interpretation, meaning, or text that is not taken verbatim or paraphrased faithfully from a verified source book.**

This means:
- No "sounds logical" translations of symbolic language
- No invented figure×house meanings based on intuition or general knowledge
- No paraphrasing that changes the meaning of the source
- Every piece of interpretive text must trace back to a specific book, page, or passage

If a source is missing → leave it blank or mark as `sourceStatus: "missing"`. Do NOT fill gaps with guesses.

## Verified Sources

**حاوي العجائب** is the primary and most detailed source for this application (figure transits, figure states, house foundations).

All other books in the Google Drive folder **"ספרים לאפליקציית גורל החול"** are approved enrichment sources and may be used to fill gaps or add additional interpretations. See the full list with verified IDs in the **Primary Knowledge Source** section above.

- `بلوغ الامل في علم الرمل` — question rules, house principles, judge rule, الجملة modulo methods
- `كتاب القول الجامع في علم الرمل` — board completeness (96-point rule), advanced methods, 7×7 isqat
- `الفلك المشحون في علم الرمل المصون` — Omani tradition
- `نهاية العمل في علم الرمل` — comprehensive geomancy encyclopedia
- `علم الرمل دروس مهمة` — practical rules
- `John Michael Greer — The Art and Practice of Geomancy` — European tradition

When using enrichment sources, always note the source in `sourceTitle` / `sourceTitleArabic` fields.
