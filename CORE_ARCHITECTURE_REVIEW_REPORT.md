# CORE_ARCHITECTURE_REVIEW_REPORT.md

> **דוח-ביקורת בלבד. אין קוד. אין שינוי קבצים קיימים. אין commit. אין deploy. אין merge.**
> תאריך: 2026-07-13. ענף: `claude/app-cleanup-organization-mia9b2`.
> **עודכן** (סבב שני): נוסף סעיף 8 המתעד את עדכוני `HALL_WISDOM_CORE_ARCHITECTURE.md` — Core Constitution, Knowledge Graph, Reasoning Layer, הפרדת-שמות רשמית, Pipeline/Roadmap מעודכנים. סעיפים 1-7 המקוריים נשארו ללא שינוי.
> **עודכן** (סבב שלישי): נוסף סעיף 9 המתעד את הוספת **Controlled Learning Loop (Future)** ל-`HALL_WISDOM_CORE_ARCHITECTURE.md`. סעיפים 1-8 נשארו ללא שינוי.

---

## 1. מה השתנה לעומת Reading Intelligence

- **מ-11 רכיבים ל-14 רכיבים תחת שם-על אחד.** `HALL_WISDOM_READING_INTELLIGENCE_ARCHITECTURE.md` הציג 11 רכיבים כ-pipeline שטוח, בלי שם-על-מאחד. `HALL_WISDOM_CORE_ARCHITECTURE.md` ממסגר את כולם תחת **Hall of Wisdom Core** אחד, ומוסיף 3 רכיבים שלא היו קיימים כלל קודם: **Intent Analyzer**, **Reading Strategy Builder**, **Knowledge Memory** (כרכיב פורמלי נבדל מ-System/Issue Memory).
- **Planner הפסיק להיות הרכיב-הראשון-שמחליט.** ב-Reading Intelligence, ה-Reading Planner קיבל שאלה+questionType+topicId והחליט הכל לבד. כעת יש שרשרת מפורשת: **Intent → Strategy → Plan**. ה-Planner מיישם `ReadingStrategy` מוכן, לא בונה מדיניות מאפס.
- **Intent נוסף כציר-סיווג נפרד מ-questionType.** קודם הייתה רק טקסונומיית `questionType` אחת (17 סוגים, `goral-question-taxonomy.js`). כעת מוגדר ציר-נוסף, אורתוגונלי: אותו `questionType` (`businessSuccess`) יכול לשאת Intent שונה (`Prediction` מול `Decision Support`) — הבחנה שלא הייתה קיימת כלל.
- **Knowledge Memory הופרד רשמית מ-Issue Memory.** ב-Reading Intelligence הייתה רק "System Memory" אחת (`system-memory-schema.js`, סכימת `IssueEvent`) — שהתאימה בפועל רק לבעיות/רגרסיות. הסבב הזה מגדיר Knowledge Memory כרכיב-נפרד-לגמרי (רישום-חוקים/כיסוי/מקורות/פערים), ומבהיר ש-`system-memory-schema.js` הקיים הוא בעצם Issue Memory, לא Knowledge Memory.
- **`Rule Decision Engine`/`Engine Execution Coordinator`/`Audit Module`/`Mentor Module` מחליפים שמות** את `Rule Selection Engine`/`Engine Execution Adapter`/`Hall Wisdom Audit Brain`/`Hall Wisdom Mentor Brain` — **שינוי-שם בלבד**, לא שינוי-אחריות מהותי לרכיבים האלה.

## 2. אילו Brains אוחדו

חמשת ה"מוחות" שהוזכרו/נרמזו לאורך הסשן — **QA Brain** (`goral-hachol/qa/*`, Phase 2), **Decision Brain** (`goral-hachol/brain/goral-decision-brain.js`, Phase 4), **Mentor Brain** ו-**Audit Brain** (שני שמות-רכיב מתוך `HALL_WISDOM_READING_INTELLIGENCE_ARCHITECTURE.md`), ו-**Reading Brain** (השם המרומז לכל אשכול ה-Planner/Rule-Selection/Engine-Adapter ב-Reading Intelligence) — **כולם הופכים לתת-רכיבים בעלי-שם-ברור בתוך Core אחד**: Audit Brain → Audit Module, Mentor Brain → Mentor Module, Decision Brain → מפוצל בין Rule Decision Engine ל-Audit Module (לפי סוג-הלוגיקה בפועל שכל פונקציה שם מבצעת), QA Brain → Verification Layer + Engine Execution Coordinator, Reading Brain → Reading Planner + Rule Decision Engine.

## 3. למה Core עדיף

- **מונע דריפט-אוצר-מילים.** התופעה כבר קרתה בפועל בתוך הסשן הזה: המטריצה של Phase 4 (`goral-rule-applicability-matrix.js`) הגדירה 5 ערכי-הכרעה (`required/allowed/advisorOnly/forbidden/notAvailable`); Reading Intelligence, שנבנה מיד אחר-כך כ"מוח נפרד", הגדיר 6 ערכים עם שם שונה לאותו-מושג (`unavailable` במקום `notAvailable`) בלי שהיה הכרח אמיתי. Core-אחד עם schema-משותף מונע את זה מבנית.
- **שאלה אחת, מקום אחד.** "מה אנחנו יודעים על הכלל הזה?" צריכה תשובה אחת (Knowledge Memory), לא תשובה אחת מה-registry ותשובה אחרת מה-QA runner.
- **הפרדת Knowledge/Issue Memory מונעת בלבול מהותי.** "פער-ידע" (למשל: אין page-map ל-`money`) ו-"באג" (למשל: תווית-בית שגויה שכבר תוקנה) הם דברים שונים לגמרי מבחינת מה-שצריך-לקרות-הלאה (האחד דורש בדיקת-מקור, השני דורש בדיקת-קוד) — לערבב אותם במאגר אחד היה מוביל לתהליכי-טיפול שגויים.
- **נקודת-כניסה אחת לכלים עתידיים.** קלפים/כלים-נוספים לא צריכים "להמציא Brain משלהם" — הם נכנסים כ-`method` נוסף (או קונספט-מקביל) לתוך אותו Core.

## 4. אילו רכיבים כבר קיימים

**קיימים ופעילים בפועל (חלק מהאפליקציה החיה, לא-commit-תלוי):**
- Client Narrative Builder — `kashf-narrative-writer.js`, `hawi-interpreter.js`
- Advisor Narrative Builder — אותם קבצים, מצב `advisor`

**קיימים כקוד, ממתינים ל-commit (Phase 4 + Reading Intelligence Phase 1):**
- Engine Execution Coordinator — `goral-hachol/qa/goral-qa-output-collector.js`
- Verification Layer — `goral-hachol/qa/goral-qa-deterministic-checks.js` (Phase 2, **כבר-commit**), `goral-decision-brain.js` (חלק)
- Audit Module — `goral-hachol/brain/goral-decision-brain.js::evaluateReading` (רוב-הלוגיקה כבר קיימת, רק לא תחת השם הזה)
- Reading Planner (סכימה בלבד) — `goral-hachol/intelligence/reading-plan-schema.js`
- Rule Decision Engine (סכימה + חלק מהלוגיקה) — `goral-hachol/intelligence/rule-decision-schema.js` + `goral-decision-brain.js`
- Mentor Module (זרע בלבד) — `recommendedFixes`/`scenariosNeedingOrenDecision` ב-`goral-brain-evaluation-runner.mjs`
- Claude Instruction Generator (זרע בלבד) — שדה `codeInstructionForClaude` באותו קובץ
- Issue Memory (סכימה בלבד, ללא persistence) — `goral-hachol/intelligence/system-memory-schema.js`
- AI Runtime (MOCK בלבד, פרוס) — `ai/provider/anthropic-provider.js`, `supabase/functions/oren-smart-advisor/*`, `ai/prompts/*.md`

## 5. אילו רכיבים עדיין חסרים

- **Intent Analyzer** — לא קיים כלל, לא ברמת-קוד ולא ברמת-schema
- **Reading Strategy Builder** — לא קיים כלל
- **Knowledge Memory כשכבה פורמלית** (schema+API נבדל מה-registry הסטטי) — לא קיים כלל, גם לא ברמת-schema
- **Rule Decision Engine — מימוש מלא של 12 השלבים** כפונקציה-אחת-מפורשת (קיים רק כתת-קבוצה מפוזרת)
- **Reading Planner — לוגיקת "Strategy → Plan"** (קיימת רק סכימה, לא בנייה-אמיתית)
- **Audit Module — השוואה מפורשת מול Plan מלא** (קיימת רק השוואה מול המטריצה הגולמית)
- **Mentor Module — מימוש אמיתי** (קיים רק זרע בן-2-שדות)
- **Claude Instruction Generator — מימוש אמיתי** (קיים רק שדה בודד)
- **Issue Memory — persistence אמיתי** (קיים רק מערך-בזיכרון-תהליך)
- **AI Runtime — כל הרחבה מעבר ל-MOCK** (לא מתוכננת בשלב זה כלל)

## 6. האם הארכיטקטורה תוכל להכיל גורל החול / חאווי / קלפים / כלים עתידיים

**גורל החול (Kashf) וחאווי (Hawi):** כן, במלואם — הארכיטקטורה **כבר נבנתה סביבם**. `method: 'kashf'|'hawi'` הוא שדה-יסוד בכל סכימה קיימת (`ReadingPlan`, `RuleDecision`, `IssueEvent`), וכל 69 רשומות ה-Knowledge Registry כבר מכסות את שתי השיטות.

**קלפים (Cartomancy):** **מבנית כן, בפועל לא-עדיין.** ה-pipeline (Intent→Strategy→Plan→Rule Engine→Execution→Verification→Narrative→Audit) אינו-תלוי-גיאומנטיה במפורש — שום רכיב לא "יודע" שיש 16 צורות/בתים. אבל בפועל: **אין שום רשומת-Knowledge-Memory לקלפים כרגע** (`cartomancy/` קיים כמודול-נפרד-לגמרי, לא ממופה ל-registry), ו-`method` כשדה-בינארי (`kashf`/`hawi`) ידרוש הרחבה (שדה שלישי, או ציר-נבדל "domain"/"deckType") לפני שקלפים יוכלו להיכנס בפועל. **זו עבודת-מיפוי נפרדת שטרם בוצעה ולא כלולה בהיקף הזה.**

**כלים עתידיים:** אותו עיקרון — מבנית התשתית תומכת (ה-Core לא מניח שום דבר ספציפי ל-geomancy מעבר לשכבת ה-Knowledge Memory עצמה), אבל כל כלי חדש דורש: (א) רשומות-Knowledge-Memory משלו, (ב) הרחבת ציר ה-method/domain, (ג) אישור נפרד לפני מימוש — בדיוק כמו כל שלב אחר ב-Roadmap.

## 7. האם נדרש שינוי כלשהו בקוד הקיים

**No code changes required.**

הסבב הזה הוא תיעוד-ומיסוד-ארגוני בלבד. שני הקבצים החדשים (`HALL_WISDOM_CORE_ARCHITECTURE.md`, `CORE_ARCHITECTURE_REVIEW_REPORT.md`) הם היחידים שנוצרו. אף קובץ-קוד קיים — כולל `goral-hachol/intelligence/*` ו-`goral-hachol/brain/*` שממתינים ל-commit משלבים קודמים — **לא נערך, לא נמחק, ולא שונה** בסבב הזה. שינוי-השמות (`Reading Plan Schema`→תחת "Reading Planner", `system-memory-schema.js`→מזוהה-מחדש כ-"Issue Memory") הוא **שינוי-מיפוי-מושגי במסמך בלבד** — הקובץ הפיזי `system-memory-schema.js` לא שונה ולא הוזז.

## 8. עדכוני הסבב הנוכחי ל-`HALL_WISDOM_CORE_ARCHITECTURE.md`

1. **נוספה Core Constitution** (חלק ב) — 6 עקרונות-יסוד מחייבים לכל רכיב עתידי ב-Core: Source Before AI, Deterministic Engines, Intelligence as Meta Layer, Explainability, Traceability, Strict Method Separation.
2. **נוסף Knowledge Graph כרכיב עתידי** (חלק ח) — שכבת-קשרים בין יחידות-ידע (Node/Edge schemas עקרוניים), **לא Database ולא AI**, **לא ממומש בשלב הנוכחי** — תכנון-מבנה בלבד.
3. **נוספה Reasoning Layer נפרדת מ-AI Runtime** (חלק ט) — ממוקמת בפייפליין בין Rule Decision Engine לבין Audit/Mentor, ולפני AI Runtime. שומרת הסברים דטרמיניסטיים-מבוססי-מקור בלבד, **לעולם לא chain-of-thought של מודל-שפה**. מאפשרת החלפת-ספק-AI (Anthropic/OpenAI/מודל-מקומי) בלי לגעת ב-Core.
4. **נוספה הפרדה רשמית: Core / Intelligence / AI Runtime** (חלק י) — Hall of Wisdom Core הוא כלל-16-הרכיבים; Hall of Wisdom Intelligence היא תת-קבוצה (Intent Analyzer, Strategy Builder, Planner, Rule Decision, Reasoning, Audit, Mentor, Memory); AI Runtime הוא קטגוריה **נפרדת-לגמרי**, לא תת-רכיב של Intelligence. שם-התצוגה בעברית ("בינת היכל החכמה") והשם הטכני הקיים (`oren-smart-advisor`) נשארים ללא שינוי בשלב הזה.
5. **נוספה הפרדה: Issue Memory / Knowledge Memory** (חלק ו, הורחב) — טבלה מעודכנת (Bugs/Regressions/Routing/Narrative/Privacy/Engine-failures/Fixes-and-tests מול Rules/Sources/Coverage/Missing-examples/Ambiguous-interpretations/Confidence/Unanswered-questions/Oren-decisions), עם איסור מפורש-וחדש: **אסור להשתמש ב-Knowledge Memory כדי לשמור מידע על לקוחות.**
6. **לא נדרש שינוי קוד.** ראו אישור מפורש בסוף.
7. **הארכיטקטורה מתאימה** ל-Kashf, Hawi, Cards, ומודולים עתידיים — במבנה (ה-pipeline לא-תלוי-דומיין-ספציפי), אך **בפועל** Cards עדיין דורש עבודת-מיפוי נפרדת שלא בוצעה (אין רשומות-Knowledge-Memory לקלפים, אין הרחבת שדה `method`/`domain`) — זהה למסקנה שכבר תועדה בסעיף 6 למעלה, ולא השתנתה בסבב הזה.
8. **No code changes required.**

## 9. עדכוני הסבב השלישי — Controlled Learning Loop (Future)

1. **נוסף Controlled Learning Loop כרכיב עתידי** (חלק יג ב-`HALL_WISDOM_CORE_ARCHITECTURE.md`) — מחזור-שיפור מבוקר, **לא רכיב-נפרד ולא Brain נוסף**, אלא חלק מ-Hall of Wisdom Core עצמו. ממוקם ב-Roadmap כשלב 12 מתוך 16, מיד אחרי Knowledge Graph.
2. **המערכת אינה לומדת אוטומטית.** הוגדר במפורש: זה אינו Machine Learning, אינו Fine-tuning, אינו RAG אוטומטי, ואינו מנגנון שמשנה חוקים בלי אישור.
3. **כל שינוי ידע דורש החלטת אורן.** נאכף בשלושה עקרונות מפורשים בתוך ה-Loop: שום חוק לא משתנה אוטומטית; שום ידע חדש לא נכנס ל-Knowledge Memory בלי מקור מאושר; שום המלצת Mentor לא הופכת לכלל מחייב בלי החלטת אורן.
4. **אין self-modifying code** — עיקרון מחייב מפורש בתוך ה-Loop (עיקרון 8 מתוך 12).
5. **אין autonomous merge/deploy** — שני עקרונות נפרדים ומפורשים בתוך ה-Loop (עיקרונות 9-10), בנוסף לעיקרון-נפרד "אין autonomous source approval" (11) ול-"AI Runtime רשאי להציע, לא לאשר" (12).
6. **ה-Loop מחבר בין:** `Scenario → Intent+Strategy → Reading Plan → Engine Execution → Audit → Mentor Recommendation → Oren Decision → Approved Knowledge Update → Regression Tests → Knowledge Graph Update → Verified Release`. סכימת `Learning Event` עקרונית מוגדרת (11 שדות + `orenDecision`/`knowledgeUpdateStatus` כ-enums), כולל טיפול-מפורש ב-regression חוזר (פתיחת-issue חדש, קישור-לתיקון-קודם, איסור-דריסת-היסטוריה).
7. **לא נדרש שינוי קוד** בסבב הזה.
8. **No code changes required.**

---

## אישורים

- ✅ **אין קוד** — רק שני קבצי-Markdown קיימים עודכנו (`HALL_WISDOM_CORE_ARCHITECTURE.md`, `CORE_ARCHITECTURE_REVIEW_REPORT.md`); לא נוצר קובץ חדש בסבב הזה.
- ✅ **אין שינוי קבצים קיימים אחרים** — כולל אלה שממתינים-לאישור משלבים קודמים (`goral-hachol/brain/*`, `goral-hachol/intelligence/*`, `goral-hachol/qa/goral-qa-*`).
- ✅ **אין commit.**
- ✅ **אין deploy.**
- ✅ **אין merge ל-`main`.**
- ✅ **אין ענף חדש** — הכל על `claude/app-cleanup-organization-mia9b2`.
