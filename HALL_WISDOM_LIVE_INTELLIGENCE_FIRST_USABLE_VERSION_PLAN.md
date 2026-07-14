# HALL_WISDOM_LIVE_INTELLIGENCE_FIRST_USABLE_VERSION_PLAN.md

> **מסמך-תוכנית בלבד. אין קוד. אין secrets. אין Deploy. אין שינוי-מנועים. אין שינוי-UI. אין Merge.**
> תאריך: 2026-07-14. ענף: `claude/app-cleanup-organization-mia9b2`.
> מטרת המסמך: להגדיר את הנתיב הקצר והבטוח ביותר לגרסה ראשונה שבאמת ניתנת לשימוש, ובה AI חי בודק תרחיש-אמיתי-אחד בכל אחד משלושת ה-Domains הרשמיים.

---

## הבהרת-מוצר מחייבת — Hall of Wisdom Intelligence, מערכת אחת, שלושה Domains

### Hall of Wisdom Intelligence — מערכת אחת, לא שלוש

**שלושת ה-Pilots אינם שלוש מערכות שונות. הם שלושה מסלולי-הפעלה של אותה בינה.** Hall of Wisdom Intelligence היא **מערכת אחת**, עם שלושה Domains רשמיים:

1. **`reading.goralHachol`** — קריאות כשף/חאווי.
2. **`reading.cards`** — קריאות קלפים (cartomancy).
3. **`siteMaintenance`** — תחזוקת-האתר כולו, לרבות כלים דטרמיניסטיים שאינם משתמשים ב-AI כלל.

**בעתיד יתווספו Domains נוספים** (למשל: מודולי-קריאה נוספים) — **כולם יעבדו דרך אותו Core**, לא כמערכות-נפרדות-חדשות.

### Shared Core — לא שייך לאף Domain

רכיבי-הליבה **אינם שייכים ל-Domain מסוים** — הם **משותפים לכל המערכת**:

- Intent Analyzer
- Reading Strategy Builder
- Reading Planner
- Rule Decision Engine
- Investigation *(Follow-up Investigation Manager)*
- Narrative
- Client History
- AI Gateway *(שכבת ה-Edge Function/module-routing — כיום `supabase/functions/oren-smart-advisor`)*
- AI Provider *(`ai/provider/anthropic-provider.js` + הפורט ל-Edge)*
- Verification
- Audit

**כל Domain מספק רק:** Context, Sources, Engines, Rules — **לא** מנגנון-AI-נפרד-משלו. **אסור לשכפל Core Components לכל Domain** — לדוגמה: Cards ו-Site Maintenance **לא-אמורים** לקבל Edge Function/adapter/auth-gate נפרדים-משלהם; הם מתרחבים **בתוך** אותו `oren-smart-advisor` (בדיוק כפי-שכבר-נעשה עבור `module:'kashf'` מול `module:'goralQA'`, §1.3) — כל Domain חדש הוא **module נוסף באותה שער**, לא מערכת-מקבילה. עיקרון-זה משפיע ישירות על §3-§5 למטה — כל פיילוט מוסיף **Context/Sources/Engines/Rules ייחודיים-לו**, לא שכבת-Gateway/Provider/Verification/Audit חדשה.

### Product Validation

**לא ניתן לקבוע שהמערכת המקצועית תקינה רק על סמך:** Contracts, Unit Tests, QA דטרמיניסטי, ומנועים קיימים. רק לאחר חיבור AI חי מבוקר — שמקבל את הספרים והמקורות שאורן אישר, השאלה, הלוח/הפריסה, החלטות-המנוע, Rule Decisions, והפלט הסופי — ניתן לבצע ביקורת מקצועית אמיתית ולזהות: חוקים חסרים, חוקים שמופעלים שלא-לצורך, מיפוי-שאלה שגוי, סתירות, פלט שאינו-נאמן-לספר, ניסוח שאינו-דומה-ליועץ-מקצועי, מידע שנשפך-ללא-צורך, **Advisor-only leakage**, וממצאים-נוספים-שלא-הוצגו-כאשר-כן-היה-צריך.

### AI Role

**ה-AI אינו מקור האמת.** הוא **אינו** מחליף את הספרים, **אינו** מחליף את המנועים, **אינו** מחליף את החלטות אורן. **תפקידו:** להבין, לבקר, להסביר, לזהות פערים, להמליץ, לנסח, לנהל חקירת-המשך (Follow-up Investigation), ולנהל את האתר (Site Maintenance). **מקור ההכרעה נשאר:** Hall of Wisdom Core, Rule Engine, Sources/Books, Decision Engine, ואישור-מקצועי-של-אורן.

### מטרת הפיילוטים החיים

**אינה להוכיח שהארכיטקטורה מושלמת** — היא לחשוף: חוקים חסרים, חוקים שמופעלים שלא-לצורך, ידע חסר במאגרים, פערים בין הספרים למימוש, בעיות בניסוח המקצועי, בעיות-בחוויית-היועץ, בעיות-בממשק, בעיות-בביצועים, בעיות-UX, ובעיות-תחזוקת-אתר.

**כל ממצא חייב:** Evidence, Severity, Domain, Recommended Fix, Tests To Add, `codeInstructionForClaude`, ו-`needsOrenDecision` כאשר נדרש. **אין לשנות ארכיטקטורה בגלל מקרה בודד** — השינויים יהיו **מבוססי-ראיות בלבד** (יותר-מתרחיש-אחד, מקור-מאושר, פלט-מנוע, ממצא-AI, בדיקת-regression, ואישור-אורן כשנדרשת-הכרעה-מקצועית).

---

## 1. מה כבר קיים ואפשר למחזר

**זהו סעיף שאינו-משוער** — כל שורה כאן אומתה ישירות מול הקוד/הדוחות-הקיימים בריפו (לא מ-Contracts שנכתבו-ואינם-ממומשים).

### 1.1 שכבת AI Provider / Adapter

- **`ai/provider/anthropic-provider.js`** — `callAnthropic()`, `fetch` גולמי ל-Anthropic Messages API, **בלי SDK** (הריפו ללא `package.json`/`node_modules` בכוונה). מודל ומפתח **תמיד** פרמטרים-נכנסים, לא-מקובעים. **לעולם לא זורקת חריגה**. **מאומת: 12/12 בדיקות-mock עוברות** (`ai/provider/_test-anthropic-provider.mjs`), ללא רשת אמיתית וללא מפתח אמיתי.
- **`supabase/functions/oren-smart-advisor/anthropic-provider-edge.ts`** — פורט מקומי לאותו-adapter, ל-Deno Edge Runtime. **אומת בפועל** דרך `deploy_edge_function` (§1.3) — הקוד הפרוס נקרא-בחזרה וזהה-מילה-במילה לקוד בריפו.

### 1.2 Prompts קיימים — שתי מסלולים נפרדים, לא-לבלבל ביניהם

| קובץ | מטרה | מצב |
|---|---|---|
| `ai/prompts/oren-smart-advisor-brain.prompt.md` | **ביקורת/audit** של קריאה קיימת (בדיוק מה-שהמשתמש מבקש כאן) | **תוכן אמיתי, אומת-מקומית** (PoC על 5 דוגמאות-אמיתיות מ-`KASHF_COMMERCE_MANUAL_OUTPUT_SAMPLES.md`, ר' §1.5) |
| `ai/prompts/hall-wisdom-goral-qa-evaluator.prompt.md` | הערכת-QA אוטומטית (batch, לא-קריאה-בודדת) | תוכן אמיתי, כבר-פרוס בפועל (`goral-qa-evaluator-prompt.ts`, ר' §1.3) |
| `ai/prompts/kashf-runtime.md` / `hawi-runtime.md` | **ניסוח-מחדש** של מסקנת-המנוע ללקוח (מטרה שונה-לגמרי — לא-audit) | `hawi-runtime.md` **stub בלבד**; `kashf-runtime.md` — לבדוק-שוב לפני-שימוש |
| `ai/prompts/cartomancy-runtime.md` | ניסוח-מחדש-ללקוח עבור קלפים (אותה מטרה כמו לעיל, לא-audit) | תוכן אמיתי, **מעולם לא נבדק מול Edge Function פעיל** |

**מסקנה קריטית לתוכנית הזו:** מה-שהמשתמש מבקש ("ה-AI בודק מול הספרים/השאלה/הלוח/החלטות-המנוע") הוא **מסלול ה-Audit** (`oren-smart-advisor-brain.prompt.md`), **לא** מסלול-הניסוח-מחדש (`kashf-runtime.md`/`hawi-runtime.md`/`cartomancy-runtime.md`). זה כבר-קיים-וכבר-אומת (חלקית) לגורל-החול; **אינו קיים כלל** לקלפים.

### 1.3 Supabase Edge Function — **פרוס בפועל, MOCK-בלבד**

- `supabase/functions/oren-smart-advisor` — **`status:ACTIVE`, `version:1`**, פרויקט `hfdsoudhelzayimjwqkp` (`eu-west-3`), נפרס דרך MCP ואומת-קריאה-חוזרת שהקוד-הפרוס זהה למה-שאושר (`HALL_WISDOM_GORAL_QA_SUPABASE_MOCK_DEPLOY_REPORT.md`).
- **`verify_jwt: true`** — אימות-Supabase-Auth אמיתי (`verifyTokenWithSupabase`, `GET /auth/v1/user`), **לא mock**, `fail closed` בכל שלב (חסר-config / טוקן-לא-תקף / UID-לא-תואם).
- **UID-Allowlist מעוצב ומיושם בקוד**: `ALLOWED_OREN_UID` (secret, **לא-מוגדר עדיין**) — אם חסר, 503 (fail-closed), **אף פעם לא-פותח-גישה-חופשית**.
- **שני נתיבי-module קיימים בקוד הפרוס:**
  - **`module:'kashf'`** — **תמיד מחזיר MOCK קבוע** (`mockAdvisorBrainOutput()`), **בלי-קשר-לתוכן-הבקשה** — אינו-קורא-כלל ל-payload אמיתי, אינו-מייבא את `oren-smart-advisor-brain.prompt.md`, אינו-מחובר ל-`anthropic-provider-edge.ts`. **זהו הפער המדויק שצריך לסגור עבור Pilot 1** (ר' §2).
  - **`module:'goralQA'`** — **שער-Live-מלא כבר-קיים בקוד**: דורש-בו-זמנית `body.mode==='live'` **וגם** `HALL_WISDOM_AI_MODE==='live'` **וגם** `ANTHROPIC_API_KEY` **וגם** `ANTHROPIC_MODEL` **וגם** מעבר-סניטציה (`goral_qa_payload_sanitizer.ts`, כבר-פרוס). כל תנאי-חסר → mock-fallback מנומק, **אף פעם לא-שגיאה-שקטה**. **זהו התבנית-להעתקה** לנתיב `kashf` (§2).
- `supabase/functions/oren-smart-ai` — שלד ישן, **מעולם לא נפרס**, מכוון-לקלפים אך-נשאר-ברמת-שלד-בלבד. מוחלף-בפועל-בגישה-של `oren-smart-advisor` (module-routing בתוך פונקציה-אחת), **לא-מומלץ להמשיך-לפתח שני מסלולים במקביל**.

### 1.4 שכבת-ידע/QA דטרמיניסטית קיימת — גורל החול

- **`goral-decision-brain.js` + `goral-knowledge-registry.js` + `goral-rule-applicability-matrix.js` + `goral-question-taxonomy.js`** — מערכת בשלה, **1010 תרחישי-בדיקה עוברים**, כבר-מחוברת בפועל ל-`goral-qa-output-collector.js` ול-`goral-qa-ai-payload-builder.js::buildQaEvaluatorPayload()` (בונה payload עם ממצאי-Decision-Brain, מטריצת-חוקים-ישימים, הפניות-ל-source-evidence, וסניטציה — **זהו הקוד שכבר מזין את `module:'goralQA'`**).
- **חשוב:** זו **מערכת נפרדת** מ-`goral-hachol/intelligence/*` (Intent Analyzer / Reading Strategy Builder / Reading Planner / Rule Decision Engine) שנבנתה **בסבב הזה** בשיחה — האחרונה מוגדרת-לחלוטין-כ-Contract+קוד-עצמאי, **טרם-מחוברת** לשום-דבר-חי (לא ל-QA Output Collector, לא ל-Advisor Panel, לא ל-Edge Function). שתי-המערכות קיימות-במקביל כרגע.

### 1.5 Advisor Panel (UI) — קיים, **מנותק לגמרי** מה-Edge Function

- `goral-hachol.html` + `goral-hachol/ui/goral-app.js` — פאנל `#orenAdvisorPanel`, **מסך-כשף-בלבד**, סכימה-ויזואלית-נבדלת (אדום, badge "מצב בדיקה / MOCK"), מכווץ-כברירת-מחדל.
- **קורא ל-`buildMockOrenAdvisorBrainOutput(kashfReading)` — פונקציה מקומית-בלבד**. **מאומת (בדיקת-דפדפן אמיתית, Playwright): אין `fetch`, אין `callAnthropic`, אין קריאה ל-`supabase/functions/oren-smart-advisor` בשום-מקום בקוד הזה.**
- ה-12 מפתחות בפלט (`advisorDiagnosis`/`clientAnswerDraft`/`engineCritique`/`missingKnowledgeOrRules`/`recommendedFix`/`codeInstructionForClaude`/`safetyNotes`/`privacyBlockedFields`/`nextBestAction`/`confidence`/`needsOrenDecision`/`module`) **כבר תואמים** לסכימה שאומתה ב-PoC (§1.2) — **אין צורך להמציא סכימה חדשה**.

### 1.6 קלפים (Cards / Cartomancy)

- מנוע-דטרמיניסטי מלא ובשל: `cartomancy/engine/reading-engine.js`, `ppf-engine.js`, `three-card/pipeline.js`, `book-rules-engine.js`, `spread-definitions.js`, `combination-engine.js`, `question-focus-engine.js`, ועוד (~25 קבצי-מנוע), + UI (`cartomancy/ui/cards-app.js`).
- **אין QA harness. אין Advisor Panel מקביל. אין prompt-ל-audit. אין payload builder.** שום-רכיב-AI קיים היום עבור Domain הקלפים.

### 1.7 תחזוקת-אתר (Site Maintenance)

- **אין מימוש קיים כלל.** קיימים רק אבני-בניין כלליות-לשימוש-חוזר: ה-adapter (`anthropic-provider.js`, לא-תלוי-Domain), דפוס-ה-Edge-Function-עם-auth-gate, ותבנית-הפלט `codeInstructionForClaude` (כבר-מבוססת ב-3 מקומות: Advisor Panel mock, PoC report, goralQA fallback — ר' §1.2/§1.5).
- Playwright+Chromium **מותקנים-מראש** בסביבת-הריצה הזו (`PLAYWRIGHT_BROWSERS_PATH`) — כלי-סריקה-דפדפן-בסיסי זמין-לשימוש-עתידי, **לא-מומש-עדיין** כ-scanner.

---

## 2. מהו המינימום שחסר כדי להריץ AI חי ראשון

**זהו הפער המצומצם ביותר בין המצב-הקיים לבין קריאת-AI-חיה אחת אמיתית**, בלי לשנות ארכיטקטורה:

| קטגוריה | חסר | הערה |
|---|---|---|
| **Secrets** | `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`, `HALL_WISDOM_AI_MODE=live`, `ALLOWED_OREN_UID` (UID אמיתי של אורן משה) | אף אחד מהם אינו-מוגדר כרגע (מאומת, §1.3). כולם secrets ברמת-Supabase Edge Function, לעולם לא בקוד/git. |
| **Provider activation** | אין — `anthropic-provider-edge.ts` כבר-פרוס וכבר-live-ready מבחינה-קוד | רק חסרי-secrets, לא-חסר-קוד |
| **Payloads** | `module:'kashf'` **חייב להיות מורחב** לקבל payload אמיתי (question/board/engineOutput/ruleDecisions-activated/ruleDecisions-rejected/sourceEvidence) ולנתב אותו דרך שער-5-התנאים שכבר-קיים ל-`goralQA` | כרגע מתעלם-לגמרי מגוף-הבקשה |
| **Source context** | חיבור בפועל של `oren-smart-advisor-brain.prompt.md` לתוך `index.ts` (כרגע **לא-מיובא כלל** שם — רק `goral-qa-evaluator-prompt.ts` מיובא) | הפרומפט עצמו כבר-קיים-ואומת (§1.2) |
| **Response schema** | אין — כבר-מוגדר-ואומת (§1.5, 12 מפתחות) | לשימוש-חוזר כפי-שהוא |
| **UI trigger / local runner** | הפאנל-הקיים (§1.5) חייב-לעבור מ-`buildMockOrenAdvisorBrainOutput` מקומי ל-`fetch` אמיתי (עם session-token אמיתי + `mode:'live'`) — **או**, כצעד-ביניים-בטוח-יותר, סקריפט-runner מקומי (Node, לא-דפדפן) שמדמה-את-אותה-קריאה | ר' §8, סדר-ביצוע — מומלץ-קודם-runner-מקומי |
| **Usage logging** | אינו-קיים כלל — נדרש בסיסי-בלבד: scope/tool/operation/tokens/cost (ר' §6) | לא-נדרש-DB-מלא לפיילוט ראשון; יכול-להתחיל כשורת-log/מטא-דאטה-בתגובה |

**לקלפים ולתחזוקת-אתר — המינימום-החסר גדול משמעותית** (ר' §4, §5): אין payload builder, אין prompt-audit, אין Advisor-Panel-מקביל, ועבור תחזוקת-אתר — אין אפילו scanner בסיסי.

---

## 3. Pilot 1 — Goral HaChol (Kashf תחילה, לא Hawi)

**המלצה מפורשת: Pilot 1 מוגבל ל-Kashf בלבד**, לא Kashf+Hawi יחד — משום ש-`oren-smart-advisor-brain.prompt.md` אומת-PoC **רק** מול נתוני-Kashf (5 דוגמאות-commerce אמיתיות), ו-`hawi-runtime.md` נשאר stub. הרחבה ל-Hawi היא **החלטת-scope נפרדת** שדורשת PoC דומה משלה לפני-שתיכלל בפיילוט-חי — לא הנחה-אוטומטית.

**זרימה (כולה ממוחזרת ממה-שכבר-קיים, §1):**

1. **שאלה אמיתית** — מוזנת דרך `goral-hachol.html` הקיים, בדיוק כמו-היום.
2. **לוח אמיתי** — נבנה דרך `raml-board-generator.js` הקיים (ללא שינוי).
3. **Engine output** — `kashf-reading-engine.js`/`kashf-narrative-writer.js` הקיימים (ללא שינוי) — **זהו בדיוק מה-שכבר-זורם לפאנל-היועץ היום ב-MOCK**.
4. **Source rules** — `kashf-al-asrar-book.js` (הספר-המובנה, כבר-מקור-האמת באפליקציה) + כל `sourceStatus` רלוונטי.
5. **AI audit** — קריאה חיה אחת דרך `oren-smart-advisor` (`module:'kashf'`, מורחב לפי §2) עם `oren-smart-advisor-brain.prompt.md`.
6. **Professional advisor conclusion** — הפלט (12 מפתחות, §1.5) מוצג **רק** בפאנל-היועץ (`#orenAdvisorPanel`), **לא** בפלט-הלקוח (`#kashfReadingOutput` — נשאר-בלתי-שונה, בדיוק כמו-היום).
7. **No automatic client exposure** — **כבר-נכון-היום** (הפאנל מכווץ-כברירת-מחדל, badge-ברור, container-נפרד-לגמרי מפלט-הלקוח) — **אין צורך לבנות-את-ההפרדה-הזו מחדש, רק לשמור-עליה**.

---

## 4. Pilot 2 — Cards

**זהו הפיילוט הכי-פחות-מוכן** מבין השלושה — כמעט-כלום קיים מעבר-למנוע-הדטרמיניסטי:

1. **פריסה אמיתית** — `cards-app.js` הקיים כבר-בונה-פריסות (ללא שינוי).
2. **Question / Positions** — `spread-definitions.js` הקיים כבר-מגדיר-מיקומים-לכל-פריסה.
3. **Selected cards** — כבר-חלק-מזרימת-ה-UI-הקיימת.
4. **Existing engine output** — `reading-engine.js`/`ppf-engine.js`/`three-card/pipeline.js` הקיימים (ללא שינוי).
5. **Approved book context** — **דורש החלטה מפורשת מאורן**: אילו-מקורות-קלפים כבר-מאושרים-במלואם (בניגוד ל-`kashf-al-asrar-book.js`, שמעמדו-כמקור-מאושר כבר-ברור) — לא-ידוע-לי-מהסביבה-הזו איזה מקורות-קלפים סופיים-לעומת-עדיין-בבנייה.
6. **AI audit** — **דורש prompt חדש** (audit, לא-reformulation — `cartomancy-runtime.md` הקיים **אינו-מתאים** למטרה-הזו, ר' §1.2), **ודורש PoC-אימות-מקומי** באותה-רמת-קפדנות כמו זו-שכבר-בוצעה ל-Kashf (§1.2) לפני-כל-חיבור-חי.
7. **Professional advisor conclusion** — דורש **Advisor Panel חדש** ב-UI של הקלפים (`cards.html`/`cards-app.js`) — לא-קיים-כלל היום, בניגוד ל-Kashf.

**Cards Audit חייב לבדוק** (לפי הדרישה המפורשת של אורן):

- התאמת הפריסה לשאלה.
- משמעות כל Position.
- **הסדר המקצועי:** שאלה → Suit Analysis → Numbers → Relationships → Story.
- נאמנות לספרים שאורן אישר.
- הפעלת Rules ששייכים **רק** לפריסה (ולא-חוקים-מספרים/פריסות-אחרות).
- הפרדת פלט-ללקוח מפלט-פנימי-ליועץ.
- תשובה ישירה לשאלה.
- Additional Findings — **רק** לפי רלוונטיות או שאלת-המשך מפורשת (לא-אוטומטית).
- **Follow-up Investigation** — מסלול-חקירת-המשך על-אותה-פריסה (עקבי-עם `HALL_WISDOM_FOLLOW_UP_INVESTIGATION_COMPONENT_CONTRACT.md` — Contract-כללי, לא-Domain-ספציפי; Cards הוא ה-Domain-השני-שישתמש-בו, לצד `reading.goralHachol`).

**כל אלה דורשים בניית-payload-builder חדש** (מקביל ל-`goral-qa-ai-payload-builder.js`, §1.4), **שאינו-קיים כלל כרגע** — אך, בהתאם ל-Shared Core (לעיל), payload builder זה מזין את **אותו** `oren-smart-advisor` (module חדש, לא Gateway נפרד).

---

## 5. Pilot 3 — Site Maintenance

**Domain עצמאי לגמרי — Site Intelligence אינו תלוי בקריאות גורל-החול או קלפים.** המטרה: AI שמשמש **איש-תחזוקה של האתר**. זהו הפיילוט השני-הכי-פחות-מוכן.

**חייב לבדוק:**

- Pages
- Navigation
- Buttons
- JavaScript Errors
- Broken Imports
- Missing Assets
- Supabase Auth
- Database
- Archive
- Reports
- PDF
- Responsive
- Preview vs Production
- Regressions
- Privacy
- Security
- Vercel
- Supabase
- Build Problems

**וכן להפיק:** `codeInstructionForClaude` — reuse **מדויק** של תבנית-הפלט הקיימת (§1.5), **אותו Core Component** (Audit), לא-סכימה-נפרדת.

**מצב-מוכנות בפועל, פריט-פריט (מה-קיים מול-מה-חסר):**

1. **Crawl/list of key pages** — רשימה-ידועה כבר מ-`CLAUDE.md` (`index.html`, `calculator.html`, `goral-hachol.html`, `cards.html`/cartomancy UI, `myseal.html`) — **אין scanner אוטומטי קיים**, נדרש-לבנות (Playwright, כבר-מותקן-בסביבה, §1.7).
2. **JavaScript Errors / Broken Imports / Missing Assets / Navigation / Buttons** — נדרש-כלי-חדש (Playwright-driven).
3. **Supabase Auth / Database / Archive** — בדיקת-בריאות `supabase-client.js`/Supabase-Auth ניתנת-לביצוע-Read-only דרך-הדפוסים-הקיימים; טבלאות/ארכיון דורשים-בדיקה-ייעודית, לא-קיימת-עדיין.
4. **Reports / PDF / Responsive** — לא-נבדק-אוטומטית-היום, נדרש-לבנות.
5. **Preview vs Production / Regressions** — דורש-גישה-לשני-הסביבות ומנגנון-השוואה — לא-קיים.
6. **Privacy / Security** — ניתן-למחזר-חלקית מהדפוסים-שכבר-קיימים (§6, סניטציית-פרטיות/fail-closed) — לא-סריקה-אוטומטית-מלאה.
7. **Vercel / Build Problems** — דורש-גישה-שאינה-מאושרת-כרגע בסביבה-הזו (לא-נבדק, לא-להניח-שקיימת).
8. **AI prioritization** — reuse `anthropic-provider.js` (Core משותף) + **prompt חדש** (site-maintenance-audit, לא-קיים כלל).

**המלצה: להתחיל צר** — Preview URL בלבד, רשימת-עמודים-קבועה-קצרה, תת-קבוצה-ראשונה של הרשימה למעלה (Pages/Navigation/Buttons/JavaScript-Errors/Broken-Imports/Missing-Assets בלבד), **ללא** אוטומציה חיה מול Production בשלב-ראשון, **ללא** Vercel/Database/PDF בסבב-ראשון — עד-שיוכח שהמסלול-כולו עובד על-סביבה-בטוחה-יותר. שאר-הפריטים ברשימה מתועדים-כאן-כהיקף-מלא, **לא-כדרישה-לסבב-הראשון**.

---

## 6. Live AI security

### כבר קיים ומיושם בפועל (§1.3)

- **Server-side only** — כל קריאת-AI רק דרך Edge Function, **אף פעם** לא מפתח-בדפדפן.
- **Fail closed** — כל תנאי-config-חסר חוסם (503), **אף פעם** לא-פותח-גישה-כברירת-מחדל.
- **אימות-Supabase אמיתי** (לא-mock) — `GET /auth/v1/user`.
- **UID-Allowlist** — `ALLOWED_OREN_UID`, מעוצב-ומיושם-בקוד (לא-מוגדר-עדיין כ-secret).
- **סניטציית-פרטיות** קיימת ל-`goralQA` (`goral_qa_payload_sanitizer.ts`) — שדות-אסורים-כבר-מזוהים: `phone`, `parentName`, `maritalStatus`, `hasChildren`, `dynFields`, `sourceText`.
- **אין Chain-of-Thought** — עיקרון שנאכף לכל-אורך הסבב-הזה (`decisionSummary`/Trace תמיד-תבנית-דטרמיניסטית, לא-ניסוח-חופשי) — חל-במלואו גם-כאן.

### עדיין חסר

- הרחבת-הסניטציה מ-`goralQA`-בלבד ל-payload של קריאה-בודדת (`module:'kashf'`, §2), ולעתיד — payloads-מקבילים לקלפים ולתחזוקת-אתר, ברגע-שיוגדרו.
- **Usage logging** — לא-קיים כלל. נדרש-מינימלי: `scope`/`tool`/`operation`/`tokens`/`cost` לכל קריאה. לא-נדרש-persistence-מלא לפיילוט-ראשון — אפשר-להתחיל כשדה-מטא-דאטה בתגובת-ה-Edge-Function עצמה + log-line, לא טבלת-DB.
- **No autonomous code changes / no autonomous deploy / no merge** — כבר-הכלל-המחייב-של-הסבב-כולו (`CLAUDE.md` + כל דוח בסבב הזה) — AI נשאר בתפקיד audit/explain/recommend בלבד, **אף פעם** לא-משנה-קוד-ישירות; `codeInstructionForClaude` הוא **הצעה-לפעולה-אנושית**, לא-ביצוע-אוטומטי.

---

## 7. Success criteria

| קריטריון | איך נאמת |
|---|---|
| AI מסביר אם פלט-המנוע תואם-לשאלה ולמקורות-מאושרים | תרחיש-Pilot-1 אמיתי, השוואה-ידנית של `engineCritique` מול-הקריאה-בפועל |
| AI מזהה לפחות בעיה-אמיתית-אחת כשקיימת | דרוש-לבחור תרחיש-Pilot-1 עם-פער-ידוע-מראש (בדומה-לדוגמה-6 ב-PoC, §1.2 — `quesitedName` שלא-הוזכר) |
| AI לא-ממציא חוק כשחסר הקשר-מקור | תרחיש-payload-מכוון-חסר (מקביל-ל"Missing Source Evidence" שכבר-נבדק ב-Rule Decision Engine, `_test_hall_wisdom_rule_decision_engine.mjs`) — לוודא-`missingKnowledgeOrRules` מדווח, לא-ממציא-תוכן |
| AI מבחין בין גורל לקלפים | פורמלית מובטח דרך `module` field בבקשה (`'kashf'` מול-`'cards'`-עתידי) — לבדוק שאין-דליפת-הקשר בין-השניים |
| AI מפיק ממצאי-תחזוקת-אתר בנפרד מממצאי-קריאה | `module:'siteMaintenance'`-עתידי מבודד-לגמרי מ-`'kashf'`/`'cards'` — עקרון-Domain-Separation שכבר-קיים ברמת-הקוד-הפרוס |
| פלט-היועץ ברור ומקצועי | סקירה-ידנית של אורן, כמו-שכבר-נעשה ל-5-הדוגמאות ב-PoC |
| Trace טכני נשאר-פנימי | מאומת-מבנית (כבר-חלק-מהחוזים, `decisionTraceReference` "אינו-מיועד-להצגה-ללקוח") |

---

## 8. Order of execution

```
1. First live AI through Edge Function
   → הרחבת module:'kashf' לקבל payload אמיתי + שער-5-תנאים (מהעתקת-הדפוס-הקיים מ-goralQA)
   → הגדרת 4 ה-secrets (§2) — רק-לאחר-אישור-נפרד-ומפורש
   → קריאה-חיה-אחת מוצלחת, דרך runner-מקומי (Node) לפני-חיבור-UI — לא-דרך-דפדפן-קודם

2. Goral Pilot (Kashf)
   → חיבור הפאנל-הקיים (§1.5) ל-Edge Function האמיתית (במקום ה-mock המקומי)
   → מספר-קטן של קריאות-אמיתיות, נבדקות-ידנית מול Success Criteria (§7)

3. Cards Pilot
   → prompt חדש + PoC-מקומי (כמו §1.2) + payload builder חדש + Advisor Panel חדש
   → רק לאחר ש-Goral Pilot הוכיח שהמסלול-הבסיסי עובד

4. Site Maintenance Pilot
   → scanner בסיסי (Preview-בלבד) + prompt חדש
   → רק לאחר ששני-הפיילוטים-הקודמים יציבים

5. רק לאחר שלושת-הפיילוטים — להחליט אילו רכיבי Hall of Wisdom Core דטרמיניסטיים
   (Engine Execution Coordinator, Follow-up Investigation Manager, וכל-Contract-נוסף)
   עדיין-נדרשים-למימוש, לפי מה-שהפיילוטים-החיים בפועל חשפו כחסר.
```

---

## 9. תשובות מפורשות

### מה יכול להיות שמיש מיידית (בלי-שינוי-קוד)

- Auth gate של `oren-smart-advisor` — כבר-אמיתי, ניתן-לבדיקה-עצמאית (401/403/503) כבר-היום.
- Advisor Panel UI — קיים ושמיש **כ-shell מקצועי**, אך **לא AI חי** — עדיין MOCK.

### מה נשאר Mock

- `module:'kashf'` — MOCK-קבוע, בלי-קשר-לבקשה, עד-שיורחב (§2).
- `module:'goralQA'` — MOCK עד-שיוגדרו-4-ה-secrets (§2), הקוד-עצמו כבר-live-ready.
- Advisor Panel — MOCK מקומי, מנותק-מה-Edge-Function.

### מה נשאר לא-ממומש

- Cards Audit — במלואו (payload builder, prompt, Advisor Panel).
- Site Maintenance — במלואו (scanner, prompt, Domain routing).
- Usage logging.
- UID אמיתי (`ALLOWED_OREN_UID`) — עוד-לא-נקבע.
- ביקורת-Hawi — `hawi-runtime.md` stub, ואין-PoC-מקביל-לזה-של-Kashf.

### אילו רכיבים מתוכננים ניתנים-לדחייה עד-אחרי-הפיילוטים-החיים

- **Engine Execution Coordinator** — Contract בלבד, טרם-מומש בקוד; מומלץ-להמתין — הפיילוט-החי עשוי-לחשוף-דרישות-אמיתיות-לביצוע שישנו-את-החוזה.
- **Follow-up Investigation Manager** — Contract בלבד; אותה-סיבה.
- **Learning & Knowledge Feedback / Human Approval / Knowledge Repository** (שלבי-הסגירה בפייפליין) — רחוקים-מדי-מהמסלול-הקצר-הזה, לא-רלוונטיים-לפיילוט-ראשון.
- **כל Contract נוסף מעבר-לאלה שכבר-נכתבו** — מומלץ **להפסיק-זמנית** את רצף-כתיבת-ה-Contracts (כפי-שהמשתמש-עצמו ציין ב"שינוי-סדר-עדיפויות") עד-שהפיילוטים-החיים מספקים-ראיות-אמיתיות למה-עוד-נחוץ.

### הצעד הבא המדויק בקוד, אחרי אישור

**צעד-קוד-ראשון-ויחיד המומלץ**, כשיאושר במפורש:

> הרחבת `supabase/functions/oren-smart-advisor/index.ts`, ענף `moduleName === 'kashf'` — לקבל `body.payload` אמיתי (question/board/engineOutput/activatedRuleIds/rejectedRuleIds/sourceEvidence), לייבא ולהשתמש ב-`oren-smart-advisor-brain.prompt.md`, ולנתב דרך **בדיוק** אותו שער-5-תנאים שכבר-קיים בענף `'goralQA'` (mode==='live' + HALL_WISDOM_AI_MODE==='live' + ANTHROPIC_API_KEY + ANTHROPIC_MODEL + סניטציה) — עם mock-fallback מנומק בכל תנאי-חסר, בדיוק כמו-הדפוס-הקיים.

זהו השינוי-הקטן-ביותר שסוגר את הפער בין המצב-הקיים לבין קריאת-AI-חיה-ראשונה, **ללא** שינוי-ארכיטקטורה, **ללא** נגיעה-במנוע/UI/סכימת-פלט.

---

## 10. First Live Version — הגדרת "מוכן" לשלב הזה

**מטרת הגרסה הראשונה אינה לסיים את הפרויקט.** מטרתה להגיע למצב שבו מתקיימים יחד:

1. **בינה אחת** — Hall of Wisdom Intelligence, לא-שלוש-מערכות.
2. **Core אחד** — Shared Core (לעיל), לא-משוכפל.
3. **שלושה Domains** — Goral HaChol, Cards, Site Maintenance.
4. **AI חי** — לפחות קריאה-אחת-אמיתית פועלת (Pilot 1, §3).
5. **פיילוטים אמיתיים** — שלושתם, לא-mock (§3-§5).
6. **למידה מבוססת-ראיות** — כל ממצא עובר דרך המסלול שהוגדר ב"מטרת הפיילוטים החיים" (בהבהרת-המוצר, ראש-המסמך: Evidence/Severity/Domain/RecommendedFix/TestsToAdd/codeInstructionForClaude/needsOrenDecision).

**מרגע שהשלב הזה יושלם, כל שיפור עתידי יתבסס על שימוש אמיתי, לא על הנחות תיאורטיות.**

---

## 11. עיקרון מנחה — אל תתאהבו בפיילוט הראשון

**הפיילוטים אינם באים להוכיח שהכול מושלם.** הם באים לגלות: מה חסר, מה מיותר, מה צריך-להשתנות, מה עובד-מצוין. **כל ממצא חייב להיכנס למסלול-שיפור מסודר** ("מטרת הפיילוטים החיים", בהבהרת-המוצר) — לא-להתעלם-ולא-לתקן-בפזיזות-על-סמך-תרחיש-בודד (עקבי-עם "אין לשנות ארכיטקטורה בגלל מקרה בודד", לעיל).

---

## 12. Human Review & Continuous Improvement Loop

**Hall of Wisdom Intelligence אינה מערכת שלומדת באופן אוטונומי מהמשתמשים.** השיפור המקצועי מתבצע באמצעות **מחזור-עבודה מבוקר**, לא-למידה-אוטומטית.

### מחזור החיים

```
Client Reading
      ↓
Hall of Wisdom Core
      ↓
Deterministic Engines
      ↓
AI Professional Review
      ↓
Oren Professional Review
      ↓
Improvement Decision
      ↓
Claude Implementation
      ↓
Regression Tests
      ↓
Live Pilot
      ↓
Evidence Collection
      ↓
Next Improvement Cycle
```

זהו-בדיוק הפירוט-המעשי של "מטרת הפיילוטים החיים" (בהבהרת-המוצר, ראש-המסמך) ושל §10-§11 לעיל — **הלולאה שדרכה** כל ממצא (Evidence/Severity/Domain/RecommendedFix/TestsToAdd/codeInstructionForClaude/needsOrenDecision) הופך-בפועל-לשיפור-מאושר.

### אחריות — AI

**AI כן:**

- מזהה פערים.
- מזהה חוקים חסרים.
- מזהה הפעלת-חוקים מיותרת.
- מזהה ניסוח בעייתי.
- מזהה בעיות UX.
- מזהה בעיות תחזוקה.
- מציע שיפורים.

**AI אינו:**

- משנה Rules.
- משנה ספרים.
- משנה מקורות.
- משנה מנועים.
- מבצע Deploy.
- מבצע Merge.
- מחליט מקצועית במקום אורן.

זהו הרחבה-ישירה של AI Role (בהבהרת-המוצר) ושל "No autonomous code changes / no autonomous deploy / no merge" (§6) — כאן ברמת-לולאת-השיפור-כולה, לא רק ברמת-קריאה-בודדת.

### Oren Review

**כל ממצא משמעותי עובר Review מקצועי.** אורן מחליט:

- Accept
- Reject
- Needs Investigation
- Needs Source Review
- Needs New Rule
- Needs Engine Change
- Needs UX Change
- Needs Documentation

**רק לאחר אישורו נוצרה משימת-פיתוח** — ממצא-AI, גם-כשהוא-נכון, **אינו** מספיק-בעצמו כדי-להתחיל-מימוש (עקבי-עם "אין לשנות ארכיטקטורה בגלל מקרה בודד", §11).

### Claude Implementation

**Claude מממש רק שינויים שאושרו.** לאחר כל שינוי: Regression, Live Validation, AI Review — שלושתם, לא-חלקם.

### Continuous Improvement

**מטרת כל Pilot: לא להוכיח שהמערכת מושלמת — אלא לייצר Evidence לשיפור הבא.** כל Improvement חייב-להיות-מבוסס-על: Reading אמיתי, Evidence, Professional Review, Regression, ו-Approval — **כל חמשת האלה יחד**, לא-חלק-מהם.

### Success Metric

**הצלחה אינה נמדדת בכמות הקוד.** אלא בכך שכל Pilot חדש: מדויק יותר, מקצועי יותר, נאמן-יותר-לספרים, ברור-יותר-ליועץ, זול-יותר-להפעלה, ויציב-יותר — **מגמה-בין-פיילוטים**, לא-מדד-חד-פעמי.

---

## 13. Advisor Acceptance Criteria

**מטרת הפיילוט הראשון אינה רק להוכיח ש-AI מחובר.** המטרה היא לבדוק **האם בינת היכל החכמה מתפקדת כמו יועץ מקצועי אמיתי.** לכן כל Pilot ייבחן גם לפי קריטריונים מקצועיים — לא רק לפי "הקריאה-הצליחה-טכנית".

**בדיקות חובה:**

- [ ] האם השאלה הובנה נכון.
- [ ] האם נבחרו המנועים הנכונים.
- [ ] האם נבחרו החוקים הרלוונטיים בלבד.
- [ ] האם נמנעה הפעלת חוקים שאינם שייכים.
- [ ] האם ההכרעה תואמת את הספרים המאושרים.
- [ ] האם נשמרה תשובה דטרמיניסטית כאשר השיטה מכריעה.
- [ ] האם הופרדו: Primary Answer / Additional Findings / Advisor Only.
- [ ] האם לא הומצא מידע.
- [ ] האם כל מסקנה ניתנת לייחוס למקור.
- [ ] האם החקירה ממשיכה רק כאשר יש בסיס מקצועי.
- [ ] האם הניסוח מתאים ליועץ מקצועי.
- [ ] **האם אורן היה נותן את הפלט הזה ללקוח ללא שינוי.**

**רק אם הקריטריונים הללו מתקיימים, Pilot ייחשב מוצלח** — לא-מספיק ש-Success Criteria הטכניים (§7) עברו; שני-הסטים-נבדקים-יחד. הקריטריון-האחרון ("האם אורן היה נותן...") הוא **מבחן-הזהב** — אם התשובה "לא", הפיילוט לא-הצליח, גם-אם כל-שאר-הסעיפים ✓.

---

## 14. Human Review Workflow

**כל ממצא מהפיילוטים עובר מחזור-עבודה קבוע:**

```
AI Review
    ↓
Oren Review
    ↓
Severity
    ↓
Decision
    ↓
Backlog
    ↓
Claude Implementation
    ↓
Regression Tests
    ↓
Live Validation
    ↓
Closed
```

זהו מחזור-העבודה **ברמת-ממצא-בודד** — עדין-יותר מ"מחזור-החיים" הכללי ב-§12 (שמתאר את-הלולאה-מקצה-לקצה, מקריאת-לקוח ועד-מחזור-השיפור-הבא). כל ממצא-בודד (Evidence/Severity/Domain/RecommendedFix/TestsToAdd, §12) עובר את **תשעת-השלבים** האלה בנפרד, עד שהוא נסגר.

**AI אינו** יוצר משימות-פיתוח אוטומטית. **AI אינו** משנה מנועים. **AI אינו** משנה ספרים. **AI אינו** משנה Rules. **אורן הוא הגורם המקצועי המאשר.** **Claude מממש רק שינויים שאושרו.** **Regression חייב לעבור לפני שהשינוי נכנס לפיילוט הבא** — לא-אחרי, לא-במקביל.

---

## 15. Pilot Freeze Rule

**עם תחילת המימוש של הגרסה החיה הראשונה, נכנס לתוקף Pilot Freeze.**

### המשמעות — במהלך הפיילוטים הראשונים

**אסור:**

- ליצור Contracts חדשים.
- להוסיף שכבות Core חדשות.
- להרחיב את הארכיטקטורה בגלל רעיון בודד.
- לבצע Refactor רחב.

**מותר:**

- לתקן Bugs.
- להשלים Wiring.
- להוסיף Rules חסרים.
- להשלים Knowledge חסר.
- לשפר Prompting.
- לשפר UX.
- לשפר Narrative.
- לשפר Follow-up.
- לשפר Site Maintenance.

**כל רעיון חדש** (שאינו-נכנס-לרשימת-המותר לעיל) **יירשם ב-Future Improvements Backlog** — לא-מיושם-מיידית, גם-אם נשמע-נכון.

### מתי מותר לשקול שינוי ארכיטקטוני

**רק לאחר סיום מחזור-Pilot מלא:**

```
Pilot
  ↓
AI Review
  ↓
Oren Review
  ↓
Claude Implementation
  ↓
Regression
  ↓
Pilot Again
```

**רק אז** יוחלט האם רעיון-מה-Backlog **מצדיק** שינוי-ארכיטקטוני — לא-לפני-מחזור-שלם-אחד-לפחות, ולא-על-בסיס-Pilot-בודד-שטרם-חזר-על-עצמו (עקבי-עם §11, "אל תתאהבו בפיילוט הראשון", ועם §13, מבחן-הזהב).

**המטרה: להגיע לגרסה חיה יציבה לפני הרחבת המערכת.** זהו-האכיפה-המעשית של §15 (Pilot Freeze) על-גבי הכלל שכבר-נקבע ב"הבהרת-המוצר" (ראש-המסמך): "אין לשנות ארכיטקטורה בגלל מקרה בודד — השינויים יהיו מבוססי-ראיות בלבד."

**Pilot Freeze חל גם על המסמך הזה עצמו** — עקבי-עם ההחלטה שכבר-תועדה לעיל: אין-לפתוח-מסמכי-תכנון-נוספים-עבור Live Intelligence, אלא-אם-אורן-מבקש-במפורש (וזה-כולל Contracts-חדשים, לא-רק-מסמכי-Live-Intelligence).

---

**מכאן ואילך — אין לפתוח מסמכי-תכנון חדשים עבור Live Intelligence, אלא אם אורן מבקש במפורש.** מוקד-העבודה עובר ל: Integration, Wiring, Live AI, Pilot, Validation, Evidence, Improvements.

---

## אישורים

**לא בוצע מימוש. לא נוספו secrets. לא בוצע Deploy. לא שונו מנועים. לא שונה UI. לא בוצע Merge ל-`main`. לא בוצע Commit. לא בוצע Push.**
