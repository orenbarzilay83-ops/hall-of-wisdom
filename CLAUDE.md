# Hall of Wisdom — Developer Notes for Claude

> **Read this entire file before touching any code.** Every section exists to prevent a specific class of mistake.

---

## What This App Is

**גורל החול** (Sand Divination) is a full Hebrew-language geomantic divination platform based on classical Arabic RAML (رمل) geomancy. It is NOT a generic fortune-telling app — it is a faithful digital implementation of specific classical source books.

**User workflow:**
1. User enters a question + client context (name, age, marital status, etc.)
2. User selects or generates 4 "mother" figures
3. App builds a 16-house RAML board from those mothers
4. App interprets the board using source-based rules → outputs a full Hebrew narrative conclusion

**Platform scope:** Readings + self-study of geomancy + client history/profiles

---

## Tech Stack

- **Language:** Plain JavaScript (ES6 modules) — NO TypeScript, NO framework
- **Frontend:** HTML5 + CSS + vanilla JS — NO React, NO Vue, NO build tool
- **Module system:** `<script type="module">` — browser-native imports
- **Persistence:** `localStorage` only
- **UI direction:** RTL (Hebrew)
- **Entry points:**
  - `index.html` → login (default: oren moshe / 1983)
  - `calculator.html` → main dashboard with sidebar tools
  - `goral-hachol.html` → geomancy app (2,236 lines, main product)

**Do NOT introduce:** TypeScript, React, Vue, webpack, npm build steps, or any framework. The app runs directly in the browser with no build step.

---

## File Structure

```
/home/user/hall-of-wisdom/
├── CLAUDE.md                          ← you are here
├── index.html                         ← login page
├── calculator.html                    ← dashboard (numerology, psalms, diary, etc.)
├── goral-hachol.html                  ← main geomancy app
├── goral-hachol-new.html              ← alternative version (experimental)
├── myseal.html                        ← talismanic/seal app
├── raml.js                            ← legacy engine (NOT used in main app)
├── logic.js, library.js, data.js     ← helper scripts
├── _test_engine.mjs                   ← test harness
└── goral-hachol/
    ├── ui/
    │   └── goral-hachol-ui.js         ← UI state builder
    ├── engine/
    │   ├── raml-board-generator.js    ← generates 16 figures from mothers
    │   ├── raml-interpreter.js        ← house meanings + witness analysis
    │   ├── hawi-interpreter.js        ← topic-specific conclusion logic
    │   └── goral-conclusion-writer.js ← final Hebrew narrative generator
    └── data/sources/hawi/
        ├── figure-transits/           ← 16 files, one per geomantic figure
        ├── figure-states/             ← 14 files, figure fortune/movement states
        ├── question-rules/            ← 25 files, one per question topic
        ├── foundations/               ← figures, houses, witnesses, diagnostics
        ├── birth-nativity/            ← birth chart interpretation
        ├── yearly-forecast/           ← price and weather forecasting
        ├── triangles/                 ← zodiac triangle correspondences
        ├── planetary-correspondences/ ← planet associations
        └── authority-state/          ← ruler interpretations
```

---

## Data Flow

```
goral-hachol-ui.js::createRamlUiState()
  → raml-board-generator.js::buildRamlBoardFromMothers()   [generate 16 figures]
  → raml-interpreter.js::interpretRamlBoard()               [house meanings + witnesses]
  → hawi-interpreter.js::interpretHawiQuestionInitial()     [topic-specific conclusion]
  → goral-conclusion-writer.js::writeHumanGoralConclusion() [Hebrew narrative output]
```

---

## Key Geomantic Concepts

**Figures (16 total):** Each is a 4-line pattern of odd (1) / even (2) points.
Example: `1111` = Tariq, `2212` = Labbayn, `1122` = Nusra Kharija

**Houses (16 on the RAML board):**
- House 1 = Querent | House 2 = Moveable property | House 3 = Siblings
- House 4 = Father/foundation | House 5 = Children | House 6 = Illness/servants
- House 7 = Marriage/enemies | House 8 = Death/inheritance | House 9 = Religion/travel
- House 10 = Authority/vocation | House 11 = Friends/hopes | House 12 = Hidden enemies
- Houses 13–16 = Witnesses and Judge

**Key terms:**
- **Mothers** — First 4 figures (manually entered or randomly generated)
- **Daughters** — Derived from mothers
- **Witnesses** — Summary figures synthesizing the board
- **Judge** — Final synthesizing figure
- **Dhamir** — Hidden/shadow house (fortune analysis)
- **Mahw & Thabat** — Erasure & establishment (derivation rules)
- **Figure States** — Fortune (good/bad), Movement (internal/external/stable), Speaking/Silent
- **Spiritual Diagnostics** — Detection of sorcery, evil eye, demonic influence
- **Isqat (7×7)** — Advanced 49-figure extraction method (not yet implemented)

---

## Data Structure — sourceStatus

Every house entry in every data file has a `sourceStatus` field. This is the integrity system. **Never remove it, never ignore it.**

| Value | Meaning |
|---|---|
| `explicit-in-source` | Directly extracted from Hawi book — highest confidence |
| `not-explicit-in-source` | Not found in primary source — do not treat as verified |
| `source-audited-final` | Reviewed and confirmed accurate |
| `source-audited-final-source-kept-as-mapped` | Audited; source absent for this house |
| `sourceMapped` | Mapped to source section |
| `engine-implemented` | Generated by interpretation engine |
| `explicitly-not-shown-in-this-section` | Intentionally omitted |
| `not-yet-found-in-current-code-search` | Awaiting verification |

**When source is missing:** set `sourceStatus: "not-yet-found-in-current-code-search"`, leave `arabicText: []`, `hebrewTranslation: []`, `effectHebrew: ""`. **Never fill with guesses.**

---

## Primary Knowledge Sources

The Google Drive folder **"ספרים לאפליקציית גורל החול"** is the **primary source** for all knowledge.

Drive folder ID: `183LO6vN9CsPW13CkNWN7Q-8_MMylrkmO`

| Book | Drive ID | Role |
|---|---|---|
| `كتاب بلوغ الامل في علم الرمل` | `1tPtkzzXeug4OjknSdDQDnNbe1F42xQ_-` | Primary practical source, rules and figures |
| `كتاب القول الجامع في علم الرمل` | `1oze2_qY4Esmd8rlGwc59f-WuWf-OktO5` | 54 PDFs, advanced methods (7×7 isqat) |
| `كتاب حاوي العجائب ومظهر الغرائب` | `1SZ3rxN2AKLeD8ExRoToj67WKr6DIViZR` | Core source: figure transits, figure states, foundations |
| `مستهل الحقائق` | `13KonpnrihbyHVhkvdqoX1V3kdhuMN2Jl` | Additional reference |

Use `mcp__*__download_file_content` or `mcp__*__read_file_content` with these IDs before implementing new features or filling data gaps.

---

## ABSOLUTE RULES — Read Before Every Edit

### 1. No Invented Data — EVER
**NEVER insert any interpretation, meaning, or text that is not taken verbatim or faithfully paraphrased from a verified source book.**

This means:
- No "sounds logical" translations of symbolic language
- No invented figure×house meanings based on intuition or general geomancy knowledge
- No paraphrasing that changes the meaning of the source
- Every piece of interpretive text must trace back to a specific book, page, or passage

**If source is missing → `sourceStatus: "not-yet-found-in-current-code-search"` and leave blank. Never guess.**

### 2. No Framework Introduction
Do not add React, Vue, TypeScript, webpack, or any build tool. The app is intentionally plain HTML/JS.

### 3. No Architecture Changes Without Explicit Permission
Do not rename files, move files, change module import paths, or restructure folders without the user explicitly asking.

### 4. No Style Changes Without Explicit Permission
The UI uses a Navy/Gold theme with RTL Hebrew layout. Do not change colors, fonts, or layout structure unless asked.

### 5. No Filling Data Gaps Without Source Verification
If a `sourceStatus` field is missing, blank, or marked as not found — do NOT fill it. First fetch the source book from Drive, find the relevant passage, then fill with the actual text.

---

## What Is Implemented vs Missing

### ✅ Implemented
- Full RAML board generation from mother figures
- Board interpretation engine (raml-interpreter.js)
- Question rule matching for 25 topic types
- Figure transit meanings for all 16 figures in all 16 houses (Hawi source)
- Figure state data for 14 figures
- Witness sequence and house grouping logic
- Spiritual diagnostics engine (evil eye, sorcery detection)
- Conclusion writer (full Hebrew narrative generation)
- Client profile context
- Board display with natural houses & dhamir marking
- Multi-screen workflow (Open → Cast → Board → Reading)

### ❌ Not Yet Implemented
- European geomancy (Agrippa/Greer) — no source extracted yet
- Advanced 7×7 isqat method (49-figure extraction)
- Islamic lunar calendar integration for timing
- Astrological houses (zodiac correspondence for figures)
- Real-time figure randomization (test data may be hardcoded in places)

### ⚠️ Implemented But May Be Incomplete
- Yearly forecast section
- Birth nativity interpretation (framework exists, needs full rules)
- Client diary appointment system (UI exists, no reading integration)

---

## Active Development Branch

`claude/app-conclusion-generation-B3mlQ`

Always develop on this branch. Never push to main without explicit user instruction.
