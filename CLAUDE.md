# Hall of Wisdom — Developer Notes for Claude

## Primary Knowledge Source

The Google Drive folder **"ספרים לאפליקציית גורל החול"** is the **primary source** for all knowledge in this application.
When researching new topics, completing missing data, or verifying interpretations — **always search this Drive folder first**.

Drive folder ID: `183LO6vN9CsPW13CkNWN7Q-8_MMylrkmO`

Key books inside:
- `كتاب بلوغ الامل في علم الرمل` (ID: `1tPtkzzXeug4OjknSdDQDnNbe1F42xQ_-`) — primary practical source, rules and figures
- `كتاب القول الجامع في علم الرمل` (ID: `1oze2_qY4Esmd8rlGwc59f-WuWf-OktO5`) — 54 PDFs, advanced methods (7×7 isqat, etc.)
- `كتاب حاوي العجائب ومظهر الغرائب` (ID: `1SZ3rxN2AKLeD8ExRoToj67WKr6DIViZR`) — core source for foundations, figure transits, figure states
- `مستهل الحقائق` (PDF ID: `13KonpnrihbyHVhkvdqoX1V3kdhuMN2Jl`) — additional source

Use the `mcp__*__download_file_content` or `mcp__*__read_file_content` tools with the Drive file IDs above to fetch content before implementing new features or filling gaps.

## Branch

Active development branch: `claude/app-conclusion-generation-B3mlQ`

## ABSOLUTE RULE — No Invented Data

**NEVER insert into the application any interpretation, meaning, or text that is not taken verbatim or paraphrased faithfully from a verified source book.**

This means:
- No "sounds logical" translations of symbolic language
- No invented figure×house meanings based on intuition or general knowledge
- No paraphrasing that changes the meaning of the source
- Every piece of interpretive text must trace back to a specific book, page, or passage

If a source is missing → leave it blank or mark as `sourceStatus: "missing"`. Do NOT fill gaps with guesses.

Verified sources for interpretation data:
- حاوي العجائب — figure transit meanings (already extracted to figure-transit files)
- بلوغ الأمل — question rules and house principles
- European geomancy (Agrippa / Greer) — to be extracted when source is available
