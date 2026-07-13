# HALL_WISDOM_CORE_ARCHITECTURE.md — Hall of Wisdom Core (מסמך-האב המחייב)

> **מסמך ארכיטקטורה בלבד. אין קוד. אין שינוי קבצים קיימים. אין commit. אין deploy. אין merge.**
> זהו מסמך-האב המחייב של כל מערכת היכל החכמה — Core Constitution + Architecture + Roadmap + Controlled Learning Loop (Future).
> תאריך: 2026-07-13. ענף: `claude/app-cleanup-organization-mia9b2`.

---

## חלק א — Hall of Wisdom Core

**זהו המוח היחיד של כל המערכת.**

אין יותר:
- ~~QA Brain~~
- ~~Mentor Brain~~
- ~~Reading Brain~~
- ~~Audit Brain~~
- ~~Decision Brain~~

כולם הופכים לתת-רכיבים בתוך **Hall of Wisdom Core** אחד. אין ריבוי-מוחות מקבילים, אין אוצרות-מילים תחרותיים (זה בדיוק מה שכבר קרה בפועל: המטריצה בת-5-הערכים של Phase 4 מול הסכימה בת-6-הערכים של Reading Intelligence — שני "מוחות" שכל אחד המציא לעצמו וריאציה. Core אחד עוצר את הדפוס הזה).

Core הוא לא קובץ אחד — הוא **קונספט-ארגון**: כל רכיב הוא מודול נבדק-בנפרד, אבל כולם חיים תחת שם-שכבה אחד, מונח-אחד, סכימה-אחת-לכל-מושג-חוצה-רכיבים.

---

## חלק ב — Core Constitution (עקרונות-יסוד מחייבים)

עקרונות אלה **מחייבים כל רכיב עתידי** ב-Core. כל סטייה מהם דורשת אישור מפורש של אורן.

### 1. Source Before AI
- כל ידע מקצועי מגיע ממקור שאורן אישר.
- AI אינו רשאי להמציא חוק, פירוש או התאמה.
- כאשר חסר מקור: `missingKnowledge = true`, `needsOrenDecision = true`.

### 2. Deterministic Engines
- Kashf, Hawi, Cards וכל מנוע עתידי נשארים דטרמיניסטיים.
- ה-Core אינו מחליף חישוב מנוע.
- AI אינו משנה תוצאות חישוב.

### 3. Intelligence as Meta Layer
- שכבת הבינה מתכננת, מפקחת, מבקרת, מסבירה וממליצה.
- היא אינה ממציאה תשובה עצמאית ללא בסיס במנוע ובמקור.

### 4. Explainability
כל החלטה חייבת להסביר:
- למה החוק נבחר
- על סמך איזה מקור
- למה חוק חלופי לא נבחר
- מה רמת הביטחון
- האם נדרשת החלטת אורן

### 5. Traceability
כל שינוי בעתיד צריך לאפשר לזהות:
- איזה חוק השתנה
- איזה מנוע הושפע
- אילו תרחישי QA צריכים לרוץ
- איזה מקור תומך בשינוי
- איזו החלטת אורן קשורה אליו
- איזה commit ביצע את התיקון

### 6. Strict Method Separation
- לא לערבב בין Kashf לחאווי.
- לא להעביר חוק בין שיטות ללא מקור מפורש.
- קלפים וכל מודול עתידי יקבלו Adapter ו-Knowledge Domain נפרדים.

---

## חלק ג — הארכיטקטורה החדשה

```
Hall of Wisdom Core
├── Intent Analyzer
├── Reading Strategy Builder
├── Reading Planner
├── Rule Decision Engine
├── Engine Execution Coordinator
├── Verification Layer
├── Reasoning Layer                    ← חדש (חלק ט)
├── Client Narrative Builder
├── Advisor Narrative Builder
├── Audit Module
├── Mentor Module
├── Claude Instruction Generator
├── Knowledge Memory
├── Issue Memory
├── Knowledge Graph                    ← חדש, עתידי-בלבד (חלק ח)
└── AI Runtime
```

**קיבוץ רשמי (פירוט מלא בחלק י):** מבין 16 הרכיבים למעלה — 8 מהם (Intent Analyzer, Strategy Builder, Planner, Rule Decision, Reasoning, Audit, Mentor, Memory [Knowledge+Issue יחד]) מקובצים תחת השם **Hall of Wisdom Intelligence**; **AI Runtime** נשאר קטגוריה נפרדת-לגמרי, לא תת-רכיב של Intelligence; שאר הרכיבים (Engine Execution Coordinator, Verification Layer, שני ה-Narrative Builders, Claude Instruction Generator, Knowledge Graph) שייכים ל-**Core** הכללי מבלי להיכלל תחת שם Intelligence הצר.

### Intent Analyzer
- **אחריות:** לזהות את *כוונת-העל* של השאלה (Prediction / Decision Support / Relationship State / Relationship Decision / Investigation / Forecast וכו') — נבדל מ-`questionType` (שממשיך להתקיים כסיווג-נושא). ראו חלק ד.
- **קלט:** טקסט-שאלה, `method`
- **פלט:** `{ intent, confidence }`
- **דטרמיניסטי / AI-assisted:** דטרמיניסטי בשלב הראשון (היוריסטיקה), כמו `classifyQuestionType`
- **האם כבר קיים:** **לא.** רכיב חדש-לגמרי
- **מה ממוחזר:** דפוס-הקוד (keyword-matching + fallback) מ-`goral-hachol/brain/goral-question-taxonomy.js::classifyQuestionType` — לא התוכן עצמו
- **מה חדש:** כל ה-Intent taxonomy עצמו (חלק ד)

### Reading Strategy Builder
- **אחריות:** לתרגם `Question + Intent + Method` לאסטרטגיית-קריאה מלאה (חלק ה) — **לפני** שה-Planner בכלל מתחיל
- **קלט:** `question`, `intent` (מ-Intent Analyzer), `method`
- **פלט:** `ReadingStrategy` (סכימה בחלק ה)
- **דטרמיניסטי / AI-assisted:** דטרמיניסטי
- **האם כבר קיים:** **לא.** רכיב חדש-לגמרי
- **מה ממוחזר:** כלום ישירות — אבל הוא הצרכן הטבעי של `goral-hachol/brain/goral-rule-applicability-matrix.js` (למדיניות ברירת-מחדל)
- **מה חדש:** כל הרכיב

### Reading Planner
- **אחריות:** לבנות `ReadingPlan` (כפי שכבר הוגדר ב-Reading Intelligence) — **אבל כעת מקבל `ReadingStrategy` כקלט, לא מחליט לבד**
- **קלט:** `ReadingStrategy` (מ-Reading Strategy Builder), `topicId`
- **פלט:** `ReadingPlan`
- **דטרמיניסטי / AI-assisted:** דטרמיניסטי
- **האם כבר קיים:** **חלקית** — סכימה+ולידציה קיימות (`goral-hachol/intelligence/reading-plan-schema.js`, עדיין לא-commit), אך **בניית Plan בפועל מ-Strategy אינה קיימת**
- **מה ממוחזר:** `reading-plan-schema.js` (`createReadingPlan`/`validateReadingPlan`) — הסכימה תישאר תקפה, רק תקבל קלט חדש (Strategy) במקום להחליט מאפס
- **מה חדש:** לוגיקת "Strategy → Plan"

### Rule Decision Engine
- **אחריות:** להריץ את 12-שלבי ההכרעה (כבר הוגדרו ב-Reading Intelligence) על כל חוק-מועמד מתוך Knowledge Memory
- **קלט:** `ReadingPlan`, רשומות-מועמדות מ-Knowledge Memory
- **פלט:** `RuleDecision[]`
- **דטרמיניסטי / AI-assisted:** דטרמיניסטי
- **האם כבר קיים:** **חלקית** — סכימה+ולידציה קיימות (`goral-hachol/intelligence/rule-decision-schema.js`), ולוגיקת-הכרעה-חלקית קיימת בפועל ב-`goral-hachol/brain/goral-decision-brain.js` (`missingRequiredRules`/`irrelevantAppliedRules`/`advisorOnlyLeaks`) — לא כל 12 השלבים ממומשים כפיפליין-מפורש
- **מה ממוחזר:** `rule-decision-schema.js` + `goral-rule-applicability-matrix.js::getApplicability` + `goral-knowledge-registry.js`
- **מה חדש:** מימוש-מלא-של-12-השלבים כפונקציה אחת מפורשת (במקום היגיון-מפוזר)

### Engine Execution Coordinator
- **אחריות:** הרכיב **היחיד** שקורא בפועל למנועים (`buildKashfReading`/`writeKashfReading`/`interpretHawiQuestionInitial`)
- **קלט:** `ReadingPlan.requiredInputs`, board/mothers
- **פלט:** פלט-מנוע גולמי, ללא שינוי
- **דטרמיניסטי / AI-assisted:** דטרמיניסטי (proxy טהור)
- **האם כבר קיים:** **כן, בפועל** — `goral-hachol/qa/goral-qa-output-collector.js` (`collectScenarioOutput`/`collectKashf`/`collectHawi`) **הוא כבר הרכיב הזה**, רק לא מכונה כך ולא מקבל `ReadingPlan` פורמלי כקלט
- **מה ממוחזר:** כל `goral-qa-output-collector.js`
- **מה חדש:** חיבור-קלט ל-`ReadingPlan` פורמלי (במקום `scenario` הגולמי של ה-QA harness)

### Verification Layer
- **אחריות:** לוודא שהפלט-בפועל תואם ל-Plan, ושלכל טענה יש `sourceEvidence`
- **קלט:** פלט-מנוע גולמי, `ReadingPlan`, `RuleDecision[]`
- **פלט:** רשימת-בעיות (contradiction/uncertainty/privacy/missing-evidence)
- **דטרמיניסטי / AI-assisted:** דטרמיניסטי
- **האם כבר קיים:** **כן, ברובו** — `goral-hachol/qa/goral-qa-deterministic-checks.js` + `goral-hachol/brain/goral-decision-brain.js::evaluateReading` (חלק הבדיקות)
- **מה ממוחזר:** שני הקבצים במלואם
- **מה חדש:** השוואה מפורשת מול `ReadingPlan` פורמלי (כרגע ההשוואה היא מול המטריצה הגולמית, לא מול Plan בנוי)

### Reasoning Layer — **חדש** (פירוט מלא בחלק ט)
- **אחריות:** לייצר הסבר מובנה ודטרמיניסטי לכל החלטה, להפריד בין היגיון-המערכת לבין מודל-ה-AI
- **קלט:** `RuleDecision[]` (מ-Rule Decision Engine), ממצאי Verification Layer
- **פלט:** `ReasoningRecord` (סכימה בחלק ט)
- **דטרמיניסטי / AI-assisted:** דטרמיניסטי — **לעולם לא chain-of-thought של מודל-שפה**
- **האם כבר קיים:** **לא.** רכיב חדש-לגמרי
- **מה ממוחזר:** שדות דומים כבר קיימים מפוזרים ב-`goral-decision-brain.js` (`recommendedFixes`, `rubricScores`) — לא כשכבה-מאוחדת
- **מה חדש:** כל הרכיב, כולל ההפרדה הפורמלית מ-AI Runtime

### Client Narrative Builder
- **אחריות:** להרכיב את הטקסט/HTML ללקוח, מסונן לפי `ReadingPlan.expectedClientSections`
- **קלט:** פלט-מנוע גולמי, `ReadingPlan`
- **פלט:** טקסט/HTML ללקוח
- **דטרמיניסטי / AI-assisted:** דטרמיניסטי
- **האם כבר קיים:** **כן, בפועל וחי-באפליקציה** — `kashf-narrative-writer.js::writeKashfReading` (ברירת-מחדל), `hawi-interpreter.js` (`finalConclusionHebrew`)
- **מה ממוחזר:** שני המנועים, ללא שינוי
- **מה חדש:** כלום — הרכיב **קיים ופעיל**, רק לא ממוסגר עדיין תחת Core

### Advisor Narrative Builder
- **אחריות:** תצוגה מורחבת ליועץ (dhamir/timing/temperament/reasons)
- **קלט:** פלט-מנוע גולמי, `RuleDecision[]`
- **פלט:** טקסט/אובייקט ליועץ
- **דטרמיניסטי / AI-assisted:** דטרמיניסטי
- **האם כבר קיים:** **כן, בפועל** — `writeKashfReading(reading,{mode:'advisor'})`, `advisorOnlyOutput`
- **מה ממוחזר:** קיים במלואו
- **מה חדש:** כלום

### Audit Module
- **אחריות:** להשוות בין Plan לביצוע-בפועל — חוקים-שהופעלו-בטעות, חוקים-חסרים, sections-שדלפו, סתירות
- **קלט:** `ReadingPlan`, `RuleDecision[]`, פלט-מנוע, פלט-לקוח, פלט-יועץ
- **פלט:** ממצאי-Audit
- **דטרמיניסטי / AI-assisted:** דטרמיניסטי
- **האם כבר קיים:** **כן, ברובו** — `goral-decision-brain.js::evaluateReading` **הוא כבר** מרבית-הלוגיקה הזו (missingRequiredRules/irrelevantAppliedRules/advisorOnlyLeaks/formulaRoleLabelProblems/contradictionProblems/uncertaintyProblems/privacyProblems/rubricScores)
- **מה ממוחזר:** `evaluateReading` במלואו
- **מה חדש:** השוואה-מפורשת מול `ReadingPlan` (כרגע מול המטריצה ישירות, לא מול Plan בנוי)

### Mentor Module
- **אחריות:** להציע (לא להכריע) — חוק משלים, ניסוח משופר, מתי צריך אימות נוסף
- **קלט:** ממצאי Audit Module, Knowledge Memory
- **פלט:** המלצות + `needsOrenDecision`
- **איסורים קשיחים (חוזר, לא משתנה):** לא ממציא חוק חדש; לא משנה חישוב; לא מכריע במקום אורן במקרה עמום
- **דטרמיניסטי / AI-assisted:** דטרמיניסטי בשלב הראשון. AI-assisted הוא אפשרות-עתידית, רק אחרי אישור נפרד
- **האם כבר קיים:** **זרעים בלבד** — `goral-brain-evaluation-runner.mjs` (`recommendedFixes`, `scenariosNeedingOrenDecision`) הוא גרסה-ראשונית-ביותר
- **מה ממוחזר:** אותם 2 שדות כבסיס-מחשבה
- **מה חדש:** כמעט הכל — לוגיקת-הצעה אמיתית, כפופה לרישום Knowledge Memory בלבד

### Claude Instruction Generator
- **אחריות:** לתרגם ממצאים-מאושרים-על-ידי-אורן להוראת-ביצוע מובנית לקלוד קוד
- **קלט:** ממצאי Audit+Mentor **שאושרו על ידי אורן**
- **פלט:** בלוק-הוראה מובנה
- **דטרמיניסטי / AI-assisted:** דטרמיניסטי (תבנית+נתונים)
- **האם כבר קיים:** **זרע מינימלי בלבד** — שדה `codeInstructionForClaude` בודד ב-`goral-brain-evaluation-runner.mjs`
- **מה ממוחזר:** אותו שדה כבסיס-מחשבה
- **מה חדש:** כמעט הכל

### Knowledge Memory
- **אחריות:** "מה המערכת יודעת" — Rule, Coverage, Known Sources, Missing Examples, Ambiguous Interpretation, Needs Oren Decision, Confidence
- **קלט:** (כתיבה) ממצאי-סקירת-מקור; (קריאה) על ידי Rule Decision Engine/Mentor Module
- **פלט:** רשומות-ידע שאילתא-ברות
- **דטרמיניסטי / AI-assisted:** דטרמיניסטי
- **האם כבר קיים:** **הנתונים כן, ה-Memory כשכבה-פורמלית לא** — `goral-hachol/brain/goral-knowledge-registry.js` (69 רשומות), `goral-question-taxonomy.js`, `goral-rule-applicability-matrix.js` הם בפועל ה"תוכן" של Knowledge Memory, אבל הם מערכים-סטטיים-בקוד, לא שכבת-memory עם API-כתיבה/קוברג'-לאורך-זמן
- **מה ממוחזר:** כל שלושת קבצי-הידע כבסיס-תוכן
- **מה חדש:** שכבת-ה-API/schema שהופכת אותם מ"נתונים קבועים" ל"זיכרון בר-עדכון" — **בנפרד לגמרי מ-Issue Memory** (חלק ו)
- **⚠️ אסור:** לשמור ב-Knowledge Memory מידע על לקוחות (שם/טלפון/פרופיל/היסטוריית-פנייה) — זהו זיכרון-ידע-מערכתי בלבד. ראו חלק ו.

### Issue Memory
- **אחריות:** "מה שבור/חוזר" — Bug, Regression, Engine Problem, Narrative Problem, Leak, Privacy, Routing, QA
- **קלט:** ממצאי Audit Module לאורך זמן
- **פלט:** `IssueEvent[]` שאילתא-ברי (בעיות-חוזרות, סטטוס-טיפול)
- **דטרמיניסטי / AI-assisted:** דטרמיניסטי
- **האם כבר קיים:** **סכימה+ולידציה+stub-בזיכרון-תהליך בלבד** — `goral-hachol/intelligence/system-memory-schema.js` (`IssueEvent`, `SystemMemoryStore`), עדיין לא-commit. **השם `system-memory-schema.js` יוחלף מושגית ל"Issue Memory" בפועל-הבא — לא שונה כאן, רק מסומן-לעתיד**
- **מה ממוחזר:** הסכימה כולה
- **מה חדש:** persistence אמיתי (עדיין לא הוחלט איפה — Supabase table? קובץ?), וההפרדה-הפורמלית מ-Knowledge Memory (חלק ו)

### Knowledge Graph — **חדש, עתידי-בלבד** (פירוט מלא בחלק ח)
- **אחריות:** שכבת-קשרים בין כל יחידות-הידע (לא Database, לא AI)
- **קלט:** Knowledge Memory, Rule Applicability Matrix, Question Taxonomy, Reading Strategies, Scenario Runner, Issue Memory, החלטות אורן
- **פלט:** תשובות-לשאילתות-יחסים (חלק ח)
- **דטרמיניסטי / AI-assisted:** דטרמיניסטי
- **האם כבר קיים:** **לא, בכלל.** שלב-תכנון בלבד
- **מה ממוחזר:** נבנה **בהדרגה** מתוך כל מקורות-הידע הקיימים (לא ייבנה-מאפס בבת-אחת)
- **מה חדש:** כל הרכיב — **לא ממומש בשלב הנוכחי**

### AI Runtime
- **אחריות:** השכבה **היחידה** שמורשית לקרוא למודל-שפה חיצוני (Anthropic/OpenAI/מודל מקומי עתידי), בכל שימוש עתידי
- **קלט:** `ReasoningRecord` מוכן מראש (מ-Reasoning Layer), לא שאלה גולמית
- **פלט:** תשובת-AI גולמית, לעולם לא ישירות ללקוח
- **דטרמיניסטי / AI-assisted:** **AI** (זה בהגדרה הרכיב היחיד שאינו דטרמיניסטי)
- **האם כבר קיים:** **תשתית MOCK-בלבד קיימת** — `ai/provider/anthropic-provider.js` (fetch גולמי, ללא SDK), `supabase/functions/oren-smart-advisor/anthropic-provider-edge.ts` (פורט ל-Edge), `ai/prompts/*.md` (5 קבצי-prompt). **חי ב-MOCK בלבד** — הנתיב-החי (`HALL_WISDOM_AI_MODE==='live'`) קיים בקוד אך חסום-כברירת-מחדל וללא secrets
- **מה ממוחזר:** כל התשתית הקיימת
- **מה חדש:** כלום עדיין — **אין הרחבה מתוכננת בשלב הזה**. ראו חלק י — AI Runtime **אינו** חלק מ-"Intelligence" ומורכב כך שהחלפת-ספק (Anthropic↔OpenAI↔מודל-מקומי) לא תדרוש שינוי ב-Core

---

## חלק ד — Intent Analyzer (טקסונומיית Intent)

**Intent הוא ציר-סיווג נוסף, אורתוגונלי ל-`questionType`, לא תחליף לו.** אותו `questionType` (למשל `businessSuccess`) יכול לשאת Intent שונה:

| שאלה | Intent | הבדל מ-questionType |
|---|---|---|
| "האם העסק החדש יצליח?" | **Prediction** | `questionType: businessSuccess` — אותו נושא, כוונה=ניבוי-תוצאה |
| "האם כדאי לי לפתוח עסק?" | **Decision Support** | `questionType: businessSuccess` — אותו נושא, כוונה=תמיכה-בהחלטה-טרם-בוצעה |
| "האם הוא אוהב אותי?" | **Relationship State** | `questionType: loveRelationship` — כוונה=תיאור-מצב-קיים |
| "האם כדאי לי להמשיך איתו?" | **Relationship Decision** | `questionType: loveRelationship` — כוונה=תמיכה-בהחלטה |
| "מי גנב?" | **Investigation** | `questionType: lostObject` — כוונה=זיהוי-גורם, לא ניבוי |
| "מה יקרה?" | **Forecast** | `questionType: general` (או ספציפי) — כוונה=תחזית-פתוחה, לא שאלת כן/לא |

**לכל Intent (מבנה, לא תוכן-סופי — ייקבע ב-Phase הבא):**
- אילו **אסטרטגיות-קריאה** אפשריות (למשל: `Decision Support` דורש בדרך-כלל גם ניתוח-מצב-נוכחי וגם תחזית, בעוד `Prediction` מסתפק בתחזית)
- אילו **חוקים בדרך-כלל רלוונטיים** (למשל: `Investigation` מדגיש `witnessesJudge`/`verificationRules`; `Relationship State`/`Relationship Decision` מתירים `characterNature`, בדומה למה שכבר נקבע ב-Phase 4 עבור `loveRelationship`)
- אילו **חוקים אסור להפעיל כברירת-מחדל** (למשל: `Prediction`/`Forecast` לא אמורים לכלול `dhamir`/`timing` כברירת-מחדל, כמו כל questionType רגיל שכבר קיים ב-`goral-rule-applicability-matrix.js`)

**הבהרה חשובה:** הטבלה למעלה היא **דוגמה מבנית בלבד**, לא טקסונומיה סופית-ומאושרת. קביעת רשימת-ה-Intent המלאה ומיפוי מדויק ל-questionType/rule-categories היא עבודת Phase הבא (ראו Roadmap, חלק יב) — **לא מבוצעת בשלב הזה**.

---

## חלק ה — Reading Strategy (סכימה)

```js
{
  strategyId: string,
  goal: string,                       // תיאור-מטרה חופשי, נגזר מ-Intent
  primaryEvidence: string[],          // ruleId[]/category[] שאמורים לשאת את עיקר-המשקל
  secondaryEvidence: string[],        // ruleId[]/category[] תומכים
  verificationPolicy: string,         // למשל: 'always' | 'onlyOnContradiction' | 'none'
  contradictionPolicy: string,        // תואם ל-ReadingPlan.contradictionPolicy הקיים
  clientDepth: string,                // למשל: 'short' | 'standard' | 'extended'
  advisorDepth: string,               // למשל: 'standard' | 'full-reasoning'
  hiddenSectionsPolicy: string,       // מדיניות dhamir/timing/temperament לרמת-האסטרטגיה
  timingPolicy: string,
  spiritualPolicy: string,
  confidencePolicy: string,           // איך להתייחס ל-confidence נמוך מה-Knowledge Memory
}
```

**שינוי-תפקידים קריטי לעומת Reading Intelligence:** ב-Reading Intelligence, ה-Reading Planner היה הרכיב הראשון שמחליט הכל. **כעת ה-Planner מקבל `ReadingStrategy` מוכן כקלט** — הוא לא בוחר `verificationPolicy`/`clientDepth` וכו' לבד, הוא מיישם את מה ש-Strategy כבר קבע. זו ההפרדה המרכזית שכבר נקבעה בסבב הקודם: **Intent → Strategy → Plan**, לא `Question → Plan` ישירות.

---

## חלק ו — Knowledge Memory מול Issue Memory (הפרדה רשמית, מחייבת)

**אסור לערבב ביניהם. שני מאגרים נפרדים, שני schemas נפרדים, שתי שאלות שונות לגמרי:**

| Issue Memory — "מה שבור" | Knowledge Memory — "מה אנחנו יודעים" |
|---|---|
| Bugs | Rules |
| Regressions | Sources |
| Routing problems | Coverage |
| Narrative problems | Missing examples |
| Privacy leaks | Ambiguous interpretations |
| Engine failures | Confidence |
| Fixes and tests | Unanswered questions |
| | Decisions required from Oren |

**⚠️ אסור להשתמש ב-Knowledge Memory כדי לשמור מידע על לקוחות** (שם/טלפון/פרופיל/היסטוריית-פנייה/`clientHistorySummary`). זהו זיכרון-ידע-מערכתי-בלבד — לא זיכרון-לקוח, אין קשר ל-`localStorage`/פרופיל-לקוח הקיים באפליקציה.

**דוגמה למה שכבר קיים בפועל ומדגים את ההפרדה, גם בלי שהיא הייתה פורמלית:**
- `KASHF_RULES_WITHOUT_PAGE_MAP`/`KASHF_PAGE_MAP_WITHOUT_RULES` (ב-`goral-knowledge-registry.js`) = **Knowledge Memory** מובהק — זה "מה שאנחנו לא יודעים על המקור", לא "באג".
- שלושת ה-`scenariosNeedingOrenDecision` שהתגלו ב-Phase 4 (`lost-animal-kashf`/`pregnancy-soon-kashf`/`children-status-kashf`, חסרי `verificationRules`) = **גם הם Knowledge Memory** (פער-ידע — חסר `altFormula` במקור), **לא** Issue Memory — זו לא "רגרסיה", זו עובדה-על-המקור שהתגלתה.
- לעומת זאת, דוגמה מ-commit קודם בסשן הזה (`70953ec`) — בית פורמולה-בלבד שהוצג עם תווית נושאית שגויה ("בית תשיעי — הדת והנסיעה" בשאלה עסקית) — **זה Issue Memory** (Narrative Problem, כבר תוקן, `currentStatus:'fixed'`/`'verified'`).

הבחנה זו הייתה **מטושטשת** ב-`system-memory-schema.js` הקיים (עדיין לא-commit) — הסכימה שם (`IssueEvent`) מתאימה **רק** ל-Issue Memory. Knowledge Memory כשכבה-פורמלית-עם-schema-משלה **עדיין לא נבנתה כלל**, גם לא ברמת-schema — זהו פער אמיתי שהוזהה ומתועד כאן.

---

## חלק ז — מיפוי כל מה שכבר נבנה לתוך Core

| מה שכבר קיים | נכנס תחת | סטטוס |
|---|---|---|
| `goral-hachol/qa/goral-qa-scenarios.js` (60 תרחישים) | תשתית-בדיקה חוצה-Core (לא רכיב בעצמו) | קיים, לא-commit |
| `goral-hachol/qa/goral-qa-output-collector.js` | Engine Execution Coordinator | קיים, לא-commit |
| `goral-hachol/qa/goral-qa-deterministic-checks.js` | Verification Layer | קיים, כבר-commit (Phase 2) |
| `goral-hachol/brain/goral-decision-brain.js` | Audit Module (+ חלק מ-Rule Decision Engine) | קיים, לא-commit |
| `goral-hachol/brain/goral-knowledge-registry.js` | Knowledge Memory (תוכן, לא עדיין schema פורמלי) | קיים, לא-commit |
| `goral-hachol/brain/goral-question-taxonomy.js` | קלט ל-Intent Analyzer/Rule Decision Engine (לא Intent עצמו) | קיים, לא-commit |
| `goral-hachol/brain/goral-rule-applicability-matrix.js` | Rule Decision Engine (מדיניות-ברירת-מחדל) | קיים, לא-commit |
| `goral-hachol/brain/goral-output-quality-rubric.js` | Audit Module (ציוני-איכות) | קיים, לא-commit |
| `goral-hachol/brain/goral-brain-evaluation-runner.mjs` | Mentor Module (זרע) + Claude Instruction Generator (זרע) + Reasoning Layer (זרע חלקי) | קיים, לא-commit |
| `goral-hachol/intelligence/reading-plan-schema.js` | Reading Planner (סכימה) | קיים, לא-commit |
| `goral-hachol/intelligence/rule-decision-schema.js` | Rule Decision Engine (סכימה) | קיים, לא-commit |
| `goral-hachol/intelligence/system-memory-schema.js` | Issue Memory (סכימה — **לא** Knowledge Memory) | קיים, לא-commit |
| `supabase/functions/oren-smart-advisor/*` | AI Runtime (Edge-side, MOCK) | קיים, פרוס ב-Supabase (MOCK) |
| `ai/prompts/hall-wisdom-goral-qa-evaluator.prompt.md` | AI Runtime (prompt) | קיים |
| `ai/provider/anthropic-provider.js` | AI Runtime (client-side/Node adapter) | קיים |
| `goral-hachol/qa/goral-qa-ai-payload-builder.js` | גשר בין Verification/Reasoning Layer ל-AI Runtime | קיים, לא-commit |

**Intent Analyzer, Reading Strategy Builder, Reasoning Layer, Knowledge Memory (כשכבה-פורמלית), Mentor Module (מימוש-אמיתי), Claude Instruction Generator (מימוש-אמיתי), Issue Memory persistence אמיתי, Knowledge Graph — אף אחד מאלה לא קיים עדיין, לא ברמת-קוד ולא ברמת-schema (מלבד הזרעים המצוינים למעלה).**

---

## חלק ח — Knowledge Graph (רכיב עתידי, לא ממומש כעת)

**Hall of Wisdom Knowledge Graph — אינו Database ואינו AI. הוא שכבת-קשרים בין כל יחידות הידע.**

### סכימת Node עקרונית

```js
{
  nodeId,
  nodeType: 'source' | 'rule' | 'topic' | 'questionType' | 'intent' | 'strategy' |
            'engine' | 'house' | 'figure' | 'scenario' | 'decision' | 'issue' | 'test',
  title,
  method,
  sourceEvidence,
  confidence,
  status,
  needsOrenDecision,
}
```

### סכימת Edge עקרונית

```js
{
  edgeId,
  fromNodeId,
  toNodeId,
  relation: 'belongsTo' | 'supportedBy' | 'requires' | 'verifies' | 'contradicts' |
            'supplements' | 'forbiddenFor' | 'applicableTo' | 'advisorOnlyFor' |
            'testedBy' | 'failedIn' | 'fixedBy' | 'decidedByOren',
  evidence,
  confidence,
}
```

### מה ה-Graph צריך לאפשר בעתיד לענות

- אילו חוקים שייכים לסוג שאלה מסוים?
- אילו חוקים מאמתים זה את זה?
- אילו חוקים סותרים זה את זה?
- איזה מקור תומך בהחלטה?
- אילו תרחישים בדקו חוק מסוים?
- אילו בעיות חוזרות קשורות לאותו חוק?
- איזה תיקון פתר את הבעיה?
- היכן עדיין חסר ידע?

### איך ה-Graph ייבנה (בהדרגה, לא בבת-אחת)

מתוך: Knowledge Registry, Rule Applicability Matrix, Question Taxonomy, Reading Strategies, Scenario Runner, Issue Memory, Knowledge Memory, החלטות אורן.

**⚠️ לא לבצע מימוש Graph בשלב הנוכחי.** זהו תכנון-מבנה בלבד, לא commitment למימוש בזמן קרוב.

---

## חלק ט — Reasoning Layer

**Hall of Wisdom Reasoning Layer**

### מיקומו בפייפליין

```
Knowledge
↓
Intent Analyzer
↓
Reading Strategy Builder
↓
Reading Planner
↓
Rule Decision Engine
↓
Reasoning Layer
↓
Audit / Mentor
↓
AI Runtime
```

### תפקידו

- לייצר הסבר מובנה ודטרמיניסטי להחלטות המערכת.
- להפריד בין היגיון המערכת לבין מודל ה-AI.
- לאפשר החלפת Anthropic/OpenAI/מודל מקומי **בלי לשנות את ה-Core**.

### סכימת Reasoning Record עקרונית

```js
{
  reasoningId,
  questionType,
  intent,
  strategyId,
  selectedRules,        // RuleDecision[] שנבחרו בפועל
  rejectedRules,         // RuleDecision[] שנדחו
  conditionalRules,      // RuleDecision[] מותנים
  advisorOnlyRules,      // RuleDecision[] advisor-only
  evidenceChain,
  contradictions,
  uncertainty,
  missingKnowledge,
  conclusionBasis,
  needsOrenDecision,
}
```

לכל `selectedRule` (וכל שאר מערכי-החוקים למעלה):
```js
{
  ruleId,
  decision,
  reason,
  sourceEvidence,
  activationCondition,
  clientVisibility,
  confidence,
}
```
(זהה במבנה ל-`RuleDecision` הקיים ב-`goral-hachol/intelligence/rule-decision-schema.js` — לא סכימה מקבילה-נפרדת, אלא שימוש-חוזר באותה סכימה בתוך ה-Reasoning Record.)

### חשוב — אילוץ-ברזל

- **אין לשמור או להציג chain-of-thought של מודל שפה.**
- Reasoning Layer שומר **רק** הסברים מובנים, ניתנים לביקורת ומבוססי-מקור — לא "מחשבות" חופשיות של AI.
- **AI Runtime יקבל את ה-Reasoning Record וינסח ממנו פלט, אך לא יחליף אותו.** ה-AI הוא מנסח-מחדש (rephraser), לא קובע-עובדות.

---

## חלק י — הפרדת שמות רשמית

### 1. Hall of Wisdom Core
ליבת המערכת והזרימה הכוללת — **כל** 16 הרכיבים (חלק ג), כולל AI Runtime ו-Knowledge Graph.

### 2. Hall of Wisdom Intelligence
תת-קבוצה של Core, הרכיבים:
- Intent Analyzer
- Strategy Builder
- Planner
- Rule Decision
- Reasoning
- Audit
- Mentor
- Memory (Knowledge Memory + Issue Memory יחד, כשתי תת-שכבות נפרדות-פנימית אך שתיהן תחת "Memory" בהקשר-השם-הזה)

### 3. AI Runtime
Adapter למודל שפה — **קטגוריה נפרדת מ-Intelligence, לא תת-רכיב שלה**:
- Anthropic
- OpenAI
- מודל מקומי עתידי

### 4. שם התצוגה בעברית
**בינת היכל החכמה** — ללא שינוי, כפי שכבר אושר ומוצג בפאנל (`goral-hachol/ui/goral-app.js`).

### 5. השם הטכני הקיים של Edge Function
נשאר זמנית: **`oren-smart-advisor`**.

**⚠️ לא לשנות שמות קבצים או IDs בשום מקום בשלב הזה.** ההפרדה למעלה היא מושגית-בלבד (איך אנחנו *מדברים* על הרכיבים), לא הוראת-refactor.

---

## חלק יא — Pipeline הסופי המחייב

```
Question
↓
Question Classification
↓
Intent Analysis
↓
Reading Strategy
↓
Reading Plan
↓
Rule Decisions
↓
Engine Execution
↓
Verification & Evidence
↓
Structured Reasoning
↓
Client Narrative
↓
Advisor Narrative
↓
Audit
↓
Mentor
↓
Issue Memory + Knowledge Memory
↓
Claude Instruction Generator
↓
AI Runtime לפי צורך
```

**הבדל מהותי מה-pipeline הקודם (Reading Intelligence):** נוספו 3 שלבים חדשים באמצע-הזרימה — **Intent Analysis** (אחרי Question Classification, לפני Reading Strategy), **Structured Reasoning** (אחרי Verification, לפני ה-Narrative Builders), ו-**AI Runtime** מוזז לסוף-מוחלט, מסומן **"לפי צורך"** — כלומר לא כל קריאה חייבת לעבור דרכו, בניגוד לכל שאר-השלבים שהם חובה.

---

## חלק יב — Roadmap (סדר בנייה מחייב)

1. **Hall of Wisdom Core contracts** — המסגור הארגוני עצמו (המסמך הזה)
2. **Intent Analyzer**
3. **Reading Strategy Builder**
4. **Reading Planner** (עדכון `reading-plan-schema.js` לקבל Strategy כקלט)
5. **Rule Decision Engine** (מימוש מלא של 12-השלבים, לא רק תת-הקבוצה הקיימת)
6. **Reasoning Layer**
7. **Audit Module** (הרחבת `evaluateReading` להשוואה מול Plan מלא)
8. **Mentor Module** (מימוש-אמיתי, כפוף ל-3 האיסורים הקשיחים)
9. **Knowledge Memory** (schema פורמלי + הפרדה סופית מ-Issue Memory)
10. **Issue Memory** (persistence אמיתי — דורש החלטת-ארכיטקטורה נפרדת: איפה שומרים)
11. **Knowledge Graph**
12. **Controlled Learning Loop** (חלק יג) — נשען על 2-11 למעלה; לא יכול להיבנות לפניהם
13. **AI Runtime** (הרחבה מעבר ל-MOCK — דורש אישור נפרד ומפורש, כרגיל)
14. **Claude Instruction Generator** (מימוש-אמיתי)
15. **Cards Adapter**
16. **Future Module Adapters**

**כל שלב ברשימה הזו דורש אישור נפרד לפני תחילת-מימוש** — הרשימה היא סדר-עדיפויות-מוצע, לא אישור-מראש לכל 16 השלבים.

**הערה עקרונית, לא-מקרית במיקומה ברשימה:** **AI Runtime אינו השלב הראשון** (הוא שלב 13 מתוך 16). הידע וההיגיון (Intent → Strategy → Plan → Rule Decision → Reasoning → Audit → Mentor → Knowledge/Issue Memory → Knowledge Graph → Controlled Learning Loop) **נבנים ומתבססים במלואם לפני** שיש בכלל צורך לגעת ב-AI Runtime. הידע נשאר בבעלות המערכת (registry/matrix/taxonomy שאורן אישר) ולא בבעלות ספק-AI חיצוני — זו לא רק סדר-עדיפויות טכני, זו עמדה-ארכיטקטונית: **המערכת תדע להסביר את עצמה גם בלי AI חי בכלל**, ה-AI (כשיגיע) רק מנסח את מה שכבר נקבע.

**הערה על Controlled Learning Loop (חלק יג) — למה הוא ממוקם אחרי Knowledge Graph:** ה-Loop **נשען** על Intent, Strategy, Planner, Rule Decision, Audit, Mentor, Knowledge Memory, Issue Memory, ו-Knowledge Graph — **כל התשעה** האלה. הוא **אינו יכול להיבנות** לפני שהם קיימים, כי הוא בעצם רק מחבר-ביניהם לכדי מחזור-שיפור אחד; אין לו תוכן עצמאי משלו.

---

## חלק יג — Controlled Learning Loop (Future)

**זהו רכיב עתידי של Hall of Wisdom Core — לא שירות נפרד ולא Brain נוסף.**

### הגדרה — מה זה *לא*

- **זה אינו Machine Learning.**
- **זה אינו Fine-tuning.**
- **זה אינו RAG אוטומטי.**
- **זה אינו מנגנון שמשנה חוקים בלי אישור.**

### הגדרה — מה זה כן

מחזור שיפור **מבוקר** של המערכת, לא לולאה-אוטונומית:

```
Scenario
↓
Intent + Strategy
↓
Reading Plan
↓
Engine Execution
↓
Audit
↓
Mentor Recommendation
↓
Oren Decision
↓
Approved Knowledge Update
↓
Regression Tests
↓
Knowledge Graph Update
↓
Verified Release
```

### עקרונות מחייבים

1. **שום חוק לא משתנה אוטומטית.**
2. **שום ידע חדש לא נכנס ל-Knowledge Memory בלי מקור מאושר.**
3. **שום המלצת Mentor לא הופכת לכלל מחייב בלי החלטת אורן.**
4. כל שינוי חייב לכלול: `sourceEvidence`, `affectedRules`, `affectedMethods`, `affectedFiles`, `testsToAdd`, `regressionTests`, `needsOrenDecision`.
5. אחרי אישור אורן: הידע מתעדכן, הבדיקות מתעדכנות, ה-Knowledge Graph מתעדכן, ה-Issue Memory מתעדכן.
6. אם Regression חוזר: לפתוח issue חדש, לקשר לתיקון הקודם, **לא לדרוס היסטוריה**.
7. **אין זיכרון לקוח בתוך מחזור הלמידה הזה** (עקבי עם ההפרדה בחלק ו — Knowledge/Issue Memory אינם זיכרון-לקוח).
8. **אין self-modifying code.**
9. **אין autonomous deployment.**
10. **אין autonomous merge.**
11. **אין autonomous source approval.**
12. **AI Runtime רשאי להציע, לא לאשר.**

### סכימת Learning Event עקרונית

```js
{
  learningEventId,
  scenarioId,
  method,
  questionType,
  intent,
  strategyId,
  detectedIssue,
  mentorRecommendation,
  sourceEvidence,
  affectedRules,
  affectedFiles,
  testsRequired,
  orenDecision: 'pending' | 'approved' | 'rejected' | 'needsMoreEvidence',
  knowledgeUpdateStatus: 'notStarted' | 'proposed' | 'applied' | 'verified',
  issueMemoryLink,
  knowledgeGraphLinks,
  fixCommit,
  regressionStatus,
  notes,
}
```

**⚠️ לא ממומש בשלב הנוכחי.** זהו תכנון-מבנה בלבד — ראו Roadmap (חלק יב) למיקומו (שלב 12 מתוך 16, אחרי Knowledge Graph).

---

## סיכום היקף הסבב הזה

✅ עדכון מסמך ארכיטקטורה זה (`HALL_WISDOM_CORE_ARCHITECTURE.md`) — הוספת Core Constitution, Knowledge Graph, Reasoning Layer, הפרדת-שמות רשמית, Pipeline מעודכן, Roadmap מעודכן, **Controlled Learning Loop (Future)** (חלק יג)
✅ עדכון `CORE_ARCHITECTURE_REVIEW_REPORT.md` (קובץ נפרד)

❌ שום קוד. שום שינוי-קובץ-קיים (מעבר לשני קבצי-הארכיטקטורה עצמם). שום commit. שום deploy. שום merge.
