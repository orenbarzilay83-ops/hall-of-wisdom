# HALL_WISDOM_READING_STRATEGY_BUILDER_COMPONENT_CONTRACT.md

> **מסמך-חוזה בלבד. אין קוד. אין תיקיות חדשות. אין JS. אין Tests.**
> תאריך: 2026-07-13. ענף: `claude/app-cleanup-organization-mia9b2`.
> מטרת המסמך: להגדיר את חוזה הרכיב הבא ב-Roadmap (`HALL_WISDOM_CORE_ARCHITECTURE.md`, חלק יב, שלב 3 מתוך 16) — **Reading Strategy Builder** — לפני שמתחיל מימוש בפועל.
> **עודכן** — נוספו `strategyConstraints` ו-`strategyReason` ל-Output Contract, לפי בקשה מפורשת. כל העדכון הזה הוא inline בתוך המסמך הזה בלבד — לא נוגע בשום קובץ אחר.

---

## 1. מטרת הרכיב

לתרגם `Question + Intent (מ-Intent Analyzer) + Method` **לאסטרטגיית-קריאה מלאה** (`ReadingStrategy`) — **לפני** שה-Reading Planner בכלל מתחיל לבנות `ReadingPlan`.

זהו הצעד השני בשרשרת `Intent → Strategy → Plan` שכבר נקבעה במסמך-הליבה (`HALL_WISDOM_CORE_ARCHITECTURE.md`, חלק ה): ה-Planner **אינו** מחליט מדיניות בעצמו — הוא מיישם מדיניות שה-Strategy Builder כבר קבע. Reading Strategy Builder הוא הרכיב שקובע את המדיניות הזו.

## 2. אחריות

- לקבוע **מדיניות-קריאה** (לא תוכן-קריאה) על בסיס Intent שכבר זוהה, לא לזהות Intent בעצמו (זו אחריות Intent Analyzer בלבד — הרכיב הזה **צורך** Intent Result, לא מייצר).
- לקבוע אילו קטגוריות-חוקים הן `primaryEvidence`/`secondaryEvidence`, מהי `verificationPolicy`, מהי `contradictionPolicy`, מהו עומק-הפלט ללקוח וליועץ (`clientDepth`/`advisorDepth`), ומהי מדיניות-הסתרה של סעיפים רגישים (`hiddenSectionsPolicy`/`timingPolicy`/`spiritualPolicy`) — **כל אלה ברמת-מדיניות, לא ברמת-ביצוע**.
- לקבוע `confidencePolicy` — איך להתייחס לביטחון-נמוך שמגיע מ-Knowledge Memory בהמשך השרשרת.
- **(עודכן)** להחזיר `strategyConstraints` — מגבלות מפורשות (מה חובה/מותר/אסור/advisor-only/דורש-evidence/אסור-בלי-שאלה-מפורשת) שה-Reading Planner וה-Rule Decision Engine **חייבים לכבד** בהמשך השרשרת. ר' סעיף 5.
- **(עודכן)** להחזיר `strategyReason` — הסבר דטרמיניסטי קצר לבחירת האסטרטגיה, לפי אותו עיקרון שכבר אומץ ב-`decisionReason` של Intent Analyzer (ר' סעיף 6).
- לשקף בפלט את חוסר-הוודאות של Intent Analyzer עצמו: אם `primaryIntent==='unknown'`/`requiresClarification===true` הגיע מ-Intent Analyzer, ה-Strategy Builder **אינו רשאי להמציא מדיניות בכל זאת** — הוא מחזיר אסטרטגיה שמרנית-במפורש (ר' סעיף 7) ומעביר הלאה את `needsOrenDecision`.

## 3. מה הוא מקבל (קלט)

| שדה | מקור | הערה |
|---|---|---|
| `Intent Result` | Intent Analyzer (`analyzeIntent()` output, הצורה המלאה בת-15-השדות — כולל `primaryIntent`, `confidence`, `requiresClarification`, `decisionReason`, `analysisVersion`) | קלט **חובה**. לא נגזר-מחדש, לא מנוחש — מגיע מוכן מהרכיב הקודם. |
| `Question Type` | `goral-hachol/brain/goral-question-taxonomy.js::classifyQuestionType` | ציר-סיווג אורתוגונלי ל-Intent, כבר קיים במערכת. |
| `Method` | `'kashf' \| 'hawi'` | קובע אילו קטגוריות-חוקים בכלל קיימות לשיטה הזו (Strict Method Separation, Core Constitution §6). |
| `Topic` | `topicId` (מ-`goral-hachol/brain/goral-knowledge-registry.js`) | מצמצם את מרחב-החוקים הרלוונטי בפועל. |
| `Knowledge Pipeline Output` | פלט Knowledge Memory (כשיהיה קיים כשכבה פורמלית — ר' Roadmap שלב 9) — עד אז: `goral-rule-applicability-matrix.js`/`goral-knowledge-registry.js` הסטטיים הקיימים | משמש כדי לדעת אילו קטגוריות-חוקים בכלל **קיימות ומכוסות-מקור** לפני שקובעים מדיניות לגביהן — אסור לבנות אסטרטגיה שמפנה ל-evidence שלא קיים. |

**איסור מפורש על קלט:** אין קלט של טקסט-שאלה גולמי לצורך ניתוח-מחדש. השאלה הגולמית כבר מוצתה ע"י Intent Analyzer + Question Taxonomy — Reading Strategy Builder לא מריץ שום regex/heuristic חדש על הטקסט עצמו.

## 4. מה הוא מחזיר (Output Contract — עודכן, כעת 23 שדות)

```js
{
  strategyId,
  strategyVersion,
  method,
  questionType,
  primaryIntent,
  secondaryIntents,
  goal,
  primaryEvidence,
  secondaryEvidence,
  verificationPolicy,
  contradictionPolicy,
  clientDepth,
  advisorDepth,
  hiddenSectionsPolicy,
  timingPolicy,
  spiritualPolicy,
  confidencePolicy,
  strategyConstraints,        // חדש — ר' סעיף 5
  strategyReason,              // חדש — ר' סעיף 6
  confidence,
  requiresClarification,
  clarificationQuestion,
  needsOrenDecision,
}
```

**מקור:** 11 השדות המקוריים (`goal` עד `confidencePolicy`) כבר תועדו ב-`HALL_WISDOM_CORE_ARCHITECTURE.md` חלק ה — נשארים ללא שינוי. `strategyId`/`strategyVersion` תועדו בסבב-התכנון הקודם של המסמך הזה. `method`/`questionType`/`primaryIntent`/`secondaryIntents`/`confidence`/`requiresClarification`/`clarificationQuestion`/`needsOrenDecision` הם **echo מפורש** של שדות מקבילים מ-Intent Result + הקלטים (Traceability, Core Constitution §5) — לא מחושבים-מחדש, רק מועברים-הלאה כדי שצרכן-הפלט (Planner) לא יצטרך לשמור הפניה נפרדת ל-Intent Result המקורי.

**הערה:** בסבב-התכנון הקודם הופיעו `basedOnIntentId`/`basedOnIntentConfidence`/`requiresOrenDecision` כשדות מוצעים. הם **מוחלפים כאן** ב-`primaryIntent`/`secondaryIntents`/`confidence`/`needsOrenDecision` — אותה כוונה (traceability + העברת-חוסר-ודאות), אבל בשמות התואמים ישירות לשמות-השדות המקבילים ב-Intent Result עצמו, כדי למנוע כפילות-שם למושג-זהה (`requiresOrenDecision` מול `needsOrenDecision` הקיים כבר ב-Intent Result — נבחר השם השני, התואם למוסכמה שכבר קיימת בכל שאר הרכיבים ב-`HALL_WISDOM_CORE_ARCHITECTURE.md`).

---

## 5. `strategyConstraints` (חדש)

Reading Strategy Builder אינו רק בונה אסטרטגיה — הוא חייב להחזיר גם **מגבלות ברורות** שמגדירות מה מותר ומה אסור ל-Reading Planner (ובהמשך, ל-Rule Decision Engine) לעשות. אלו **אינם Rule Decisions סופיים** — הם גבולות-מדיניות שה-Planner וה-Rule Decision Engine חייבים לכבד בהמשך השרשרת, לא בחירת-חוק-בפועל.

### סכימה עקרונית

```js
strategyConstraints: {
  mustInclude: [],              // קטגוריות שחייבות להיכלל בתוכנית הקריאה
  mayInclude: [],                // קטגוריות מותרות אך לא חובה
  mustExclude: [],                // קטגוריות שאסור להפעיל בהקשר הזה
  advisorOnly: [],                 // מותר לחשב/לבדוק פנימית, אסור להציג ללקוח
  requiresEvidence: [],            // לא ניתן להפעיל בלי מקור/תנאי/evidence מתאים
  forbiddenWithoutQuestion: [],    // אסור להפעיל אם המשתמש לא שאל עליהם במפורש
}
```

### דוגמאות לקטגוריות (לא רשימה סגורה — נגזרות מ-`goral-rule-applicability-matrix.js`)

`hiddenThought`, `characterNature`, `timing`, `spiritualDiagnostics`, `verification`, `contradictionResolution`, `thematicHouseMeaning`, `formulaOnlyHouse`, `clientNarrative`, `advisorNarrative`.

### דוגמה מלאה — "האם העסק החדש יצליח?"

Intent: `prediction` | Question Type: `businessSuccess`

```js
strategyConstraints: {
  mustInclude: ["outcomeRules", "businessRelevantRules"],
  mayInclude: ["verification"],
  mustExclude: ["hiddenThought", "characterNature"],
  advisorOnly: ["technicalFormulaDetails"],
  requiresEvidence: ["contradictionResolution"],
  forbiddenWithoutQuestion: ["timing", "spiritualDiagnostics"],
}
```

**הסבר:** לא להפעיל מחשבת השואל (לא נשאל). לא להפעיל טבע השואל (לא רלוונטי ל-prediction). לא להציג עיתוי אם לא נשאל "מתי". לא להפעיל אבחון רוחני אם השאלה אינה רוחנית. כן לאפשר חוקי תוצאה והצלחה (זה בדיוק מה שנשאל). כן לאפשר בדיקת-אימות אם השיטה תומכת בכך.

---

## 6. `strategyReason` (חדש)

הסבר דטרמיניסטי קצר מדוע נבחרה האסטרטגיה — **אינו chain-of-thought, אינו reasoning פנימי של מודל AI**. תקציר מקצועי, קצר, ניתן-לביקורת. באותו עיקרון-בנייה כמו `decisionReason` ב-Intent Analyzer: נבנה **אך ורק** מעובדות שכבר חושבו (Intent שנבחר, Question Type, אילו מגבלות הוטלו) — אין ניחוש, אין ניסוח חופשי.

### דוגמאות

- `"נבחרה אסטרטגיית Prediction משום שהשאלה מבקשת לברר תוצאה עתידית של עסק, ללא בקשת עיתוי, ללא בירור מחשבות וללא אבחון רוחני."`
- `"נבחרה אסטרטגיית Decision Support משום שהשאלה מבקשת להחליט אם לבצע פעולה, ולא לחזות תוצאה מוחלטת."`
- **מקרה עמימות:** `"לא ניתן לבנות אסטרטגיה חד-משמעית משום שלא ברור אם המשתמש מבקש הערכת מצב, תחזית או הכוונה."`

---

## 7. מה אסור לו לעשות

- **לא להריץ מנועים** — לא `buildKashfReading`/`writeKashfReading`/`interpretHawiQuestionInitial` ולא שום קריאה למנוע אחר. זו אחריות Engine Execution Coordinator בלבד, שלב מאוחר-יותר בפייפליין.
- **לא לבחור פלט ללקוח** — הוא קובע *מדיניות-עומק* (`clientDepth`) אך לא בונה טקסט/HTML בפועל. זו אחריות Client Narrative Builder.
- **לא לבצע QA** — אין הרצת-תרחישים, אין בדיקת-תוצאה-מול-ציפייה. זו אחריות Verification Layer / Audit Module.
- **לא להפעיל AI** — דטרמיניסטי לחלוטין, כמו Intent Analyzer. שום `fetch`, שום `callAnthropic`, שום `ANTHROPIC_API_KEY`. `strategyReason` הוא תבנית-מחרוזת קבועה, לא קריאה למודל.
- **לא להחליט במקום היועץ** — כאשר Intent Result מגיע עם `requiresClarification===true`, ה-Strategy Builder **אינו רשאי לבחור אסטרטגיה "בטוחה-בכל-זאת"**. הוא חייב להחזיר אסטרטגיה שמרנית-מפורשת (`verificationPolicy:'always'`, `hiddenSectionsPolicy` מצומצם-למינימום, `confidencePolicy` שמרני, `strategyConstraints.mustExclude` רחב-מהרגיל) **ולסמן `needsOrenDecision:true`** — לא לנחש מדיניות מתוך Intent לא-ודאי, באותו עקרון-שמרנות שכבר אומץ ב-Intent Analyzer עצמו (ר' `CLEAR_WIN_MARGIN`/`unknown` fallback).
- **לא ליצור קטגוריות-חוקים חדשות** — `primaryEvidence`/`secondaryEvidence`/כל שדות `strategyConstraints` יכולים להצביע רק על קטגוריות שכבר קיימות ב-`goral-rule-applicability-matrix.js`/`goral-knowledge-registry.js`. אין המצאת-קטגוריה חדשה בשלב הזה.
- **לא לערבב שיטות** — אסטרטגיה שנבנתה עבור `method:'kashf'` לא יכולה להצביע על קטגוריות-חוקים שקיימות רק ב-Hawi ולהפך (Core Constitution §6, Strict Method Separation).

## 8. איך הוא יתחבר בעתיד

| רכיב | כיוון-החיבור | מהות-החיבור |
|---|---|---|
| **Rule Decision Engine** (Roadmap שלב 5) | Strategy Builder → Rule Decision Engine (דרך Reading Planner) | `primaryEvidence`/`secondaryEvidence`/`confidencePolicy`/`strategyConstraints` הם קלט-מדיניות ל-12-שלבי-ההכרעה על כל חוק-מועמד. Rule Decision Engine לא בוחר קטגוריות בעצמו וגם לא רשאי להפר `mustExclude`/`forbiddenWithoutQuestion` — הוא מקבל את הגבולות מוכנים מה-Strategy (דרך ה-Plan). |
| **Reasoning Layer** (Roadmap שלב 6) | Strategy Builder → Reasoning Layer (עקיף, דרך `strategyId`+`strategyReason` ב-`ReasoningRecord`) | כל `ReasoningRecord` עתידי ישא `strategyId` כדי שאפשר יהיה להסביר "למה נבחר חוק X" גם ביחס-ל"איזו אסטרטגיה ומאיזו סיבה (`strategyReason`) קבעה שהחוק הזה כלל-רלוונטי". |
| **Audit Module** (Roadmap שלב 7) | Audit Module ← Strategy Builder (קריאה בלבד) | Audit צריך להשוות בין מה-שקרה-בפועל למה-ש-`strategyConstraints` קבע כברירת-מחדל (למשל: קטגוריה ב-`advisorOnly` שהופיעה בטעות בפלט-לקוח, או קטגוריה ב-`forbiddenWithoutQuestion` שהופעלה בלי שנשאלה) כדי לתפוס דליפות-מדיניות באופן ישיר וניתן-לבדיקה-אוטומטית. |
| **Mentor Module** (Roadmap שלב 8) | Mentor Module ← Strategy Builder (קריאה בלבד, עקיף דרך Audit) | כשה-Mentor מציע שיפור, הוא צריך לדעת אם הבעיה הייתה באסטרטגיה עצמה (`strategyConstraints`/`strategyReason` שגויים) או בביצוע (Rule Decision/Engine Execution) — הבחנה שדורשת גישה ל-`ReadingStrategy` המקורי במלואו. |

**איסור מפורש:** אף אחד מהרכיבים למעלה **אינו ממומש בשלב הזה** (מלבד Intent Analyzer, שכבר מומש). החיבורים בטבלה הם תיעוד-כיוון-עתידי בלבד, לא קוד ולא ממשק-בפועל.

## 9. אילו Validators יידרשו (עודכן)

בהשראת הדפוס שכבר אומץ ב-Intent Analyzer (`validateIntentInput`/`validateIntentResult`):

**קלט:**
- `validateStrategyInput(input)` — מוודא ש-`Intent Result` שהתקבל הוא פלט תקין (`validateIntentResult` מ-Intent Analyzer מוחזר `valid:true`), ש-`method` הוא `'kashf'`/`'hawi'` בלבד, ש-`topicId` (אם נמסר) קיים ב-Knowledge Registry.

**פלט — כללים כלליים:**
- כל 23 שדות ה-Output Contract קיימים בכל פלט.
- `strategyVersion` לא-ריק.
- `primaryIntent`/`secondaryIntents`/`confidence`/`requiresClarification`/`clarificationQuestion`/`needsOrenDecision` תואמים בדיוק את ה-Intent Result שהוזן (traceability, לא חישוב-מחדש).
- `primaryEvidence`/`secondaryEvidence`/כל שדות `strategyConstraints` הם רק קטגוריות-שקיימות-בפועל ל-`method` הנתון (לא קטגוריה מהשיטה השנייה).

**פלט — כללים ל-`strategyConstraints` (חדש, לפי בקשה מפורשת):**
1. `strategyConstraints` חייב להיות אובייקט.
2. כל שדה בתוכו (`mustInclude`/`mayInclude`/`mustExclude`/`advisorOnly`/`requiresEvidence`/`forbiddenWithoutQuestion`) חייב להיות מערך.
3. לא יכולה להיות אותה קטגוריה גם ב-`mustInclude` וגם ב-`mustExclude` (סתירה-פנימית).
4. לא יכולה להיות אותה קטגוריה גם ב-`mayInclude` וגם ב-`mustExclude` (סתירה-פנימית).
5. קטגוריה ב-`advisorOnly` אינה client-visible — נאכף כ-invariant, לא רק כתיעוד.
6. קטגוריה ב-`forbiddenWithoutQuestion` לא יכולה להיכלל ב-`mustInclude` בלי תנאי מפורש (למשל בלי אזכור-מקביל ב-`requiresEvidence` שמסביר למה בכל זאת חובה).

**פלט — כללים ל-`strategyReason` (חדש, לפי בקשה מפורשת):**
7. `strategyReason` חייב להיות קיים ואינו ריק.
8. `strategyReason` אינו כולל מידע אישי (אותה משמעת-פרטיות שכבר נאכפת ב-`decisionReason` של Intent Analyzer — בדיקה מבנית, לא echo של טקסט חופשי).
9. `strategyReason` אינו chain-of-thought (אותם 8 מרקרים-אסורים שכבר נבדקו ב-Intent Analyzer: `'אני חושב'`/`'לדעתי'`/`'בואו נבדוק'`/`'step by step'`/`'let me'`/`'I think'`/`'reasoning:'`/`'thought:'`).
10. אם `requiresClarification===true`: `strategyReason` **חייב** להסביר את העמימות (לא רק "לא נבחרה אסטרטגיה" — חייב לנקוב בגורם, כמו הדוגמה בסעיף 6), **וגם** `clarificationQuestion` חייב להיות קיים ולא-ריק.

**Structural guard** (כמו ב-Intent Analyzer): הקובץ עצמו לא מייבא דבר מ-`goral-hachol/engine/`, לא מכיל `fetch`/`callAnthropic`/`ANTHROPIC_API_KEY`.

## 10. אילו בדיקות ייכתבו

בהתאם לרמת-הדוקומנטציה שכבר נקבעה כתקן ב-Intent Analyzer (208 assertions, 6+ קטגוריות):

1. **תקינות-סכימה** — כל 23 השדות קיימים בכל פלט, מכל סוגי-קלט.
2. **מיפוי Intent→Strategy** — לכל אחד מ-12 ה-intents (מ-`intent-types.js::INTENT_IDS`), אימות ש-`goal`/`primaryEvidence`/`hiddenSectionsPolicy`/`strategyConstraints` נגזרים באופן עקבי וניתן-לחיזוי (לא אקראי).
3. **מקרה `unknown`** — Intent Result עם `primaryIntent:'unknown'` מייצר אסטרטגיה שמרנית-מפורשת + `needsOrenDecision:true`, **בלי חריגה משום הקטגוריה השמרנית**, ו-`strategyReason` שמסביר במפורש את העמימות (ולא רק "unknown").
4. **Strict Method Separation** — אסטרטגיה ל-`method:'kashf'` לעולם לא מכילה קטגוריית-חוק שקיימת רק ב-Hawi (ולהפך) — נבדק ישירות מול `goral-rule-applicability-matrix.js`, כולל בתוך `strategyConstraints`.
5. **Traceability** — `primaryIntent`/`secondaryIntents`/`confidence` תואמים בדיוק את ה-Intent Result שהוזן, בכל תרחיש.
6. **strategyConstraints — עקביות-פנימית** — אין קטגוריה החוזרת גם ב-`mustInclude` וגם ב-`mustExclude`; אין קטגוריה החוזרת גם ב-`mayInclude` וגם ב-`mustExclude`; קטגוריות ב-`advisorOnly` אף פעם לא מופיעות ב-`mustInclude` בלי הופעה-מקבילה ב-`advisorOnly` (client-visibility invariant).
7. **strategyReason — פרטיות + chain-of-thought** — אותה סוללת-בדיקות שכבר נבנתה ל-`decisionReason` ב-Intent Analyzer (PII, 8 מרקרים אסורים), מורצת גם על `strategyReason`.
8. **Validators** — פלט חסר-שדה נכשל-ולידציה; פלט עם `strategyConstraints` לא-תקין (לא אובייקט/שדה לא-מערך/סתירה-פנימית) נכשל-ולידציה; פלט עם `strategyReason` ריק נכשל-ולידציה; פלט עם `requiresClarification:true` בלי `strategyReason`-מסביר או בלי `clarificationQuestion` נכשל-ולידציה; פלט תקין עובר.
9. **Structural guards** — אין ייבוא-מנוע, אין fetch/AI, אין שינוי-קבצים-קיימים (כמו בכל רכיב קודם בסבב הזה).
10. **Regression** — הרצה חוזרת של כל 4 סוויטות ה-regression הקיימות (Decision Brain / Reading Intelligence Foundation / QA Brain / AI QA Evaluator) לוודא ש-0 שינוי-התנהגות בקוד הקיים.

---

## 11. דוגמאות מלאות (4, כנדרש — Intent Result + Strategy + constraints + reason לכל אחת)

### דוגמה 1 — Prediction: "האם העסק החדש יצליח?"

**Intent Result (מ-Intent Analyzer, מקוצר):**
```js
{ primaryIntent: 'prediction', confidence: 1, requiresClarification: false,
  decisionReason: 'נבחר prediction משום שנמצאה תבנית מובהקת התואמת ל-prediction, לא נמצאו אותות של hiddenThoughtIntent או timingRequest.' }
```

**Reading Strategy (מקוצר):**
```js
{
  strategyId: 'strat-prediction-businessSuccess',
  method: 'hawi', questionType: 'businessSuccess', primaryIntent: 'prediction',
  goal: 'לברר תוצאה עתידית של הצלחת העסק',
  primaryEvidence: ['outcomeRules', 'businessRelevantRules'],
  secondaryEvidence: ['verification'],
  verificationPolicy: 'onlyOnContradiction',
  clientDepth: 'standard', advisorDepth: 'standard',
  hiddenSectionsPolicy: 'excludeAll', timingPolicy: 'excludeUnlessAsked', spiritualPolicy: 'excludeUnlessAsked',
  confidencePolicy: 'flagIfBelowThreshold',
  strategyConstraints: {
    mustInclude: ['outcomeRules', 'businessRelevantRules'],
    mayInclude: ['verification'],
    mustExclude: ['hiddenThought', 'characterNature'],
    advisorOnly: ['technicalFormulaDetails'],
    requiresEvidence: ['contradictionResolution'],
    forbiddenWithoutQuestion: ['timing', 'spiritualDiagnostics'],
  },
  strategyReason: 'נבחרה אסטרטגיית Prediction משום שהשאלה מבקשת לברר תוצאה עתידית של עסק, ללא בקשת עיתוי, ללא בירור מחשבות וללא אבחון רוחני.',
  requiresClarification: false, needsOrenDecision: false,
}
```

### דוגמה 2 — Decision Support: "האם כדאי לי לפתוח עסק?"

**Intent Result (מקוצר):**
```js
{ primaryIntent: 'decisionSupport', confidence: 0.9, requiresClarification: false }
```

**Reading Strategy (מקוצר):**
```js
{
  strategyId: 'strat-decisionSupport-businessSuccess',
  method: 'hawi', questionType: 'businessSuccess', primaryIntent: 'decisionSupport',
  goal: 'לתמוך בהחלטה אם לפתוח את העסק',
  primaryEvidence: ['outcomeRules', 'businessRelevantRules', 'currentStateRules'],
  secondaryEvidence: ['verification'],
  verificationPolicy: 'always',
  clientDepth: 'extended', advisorDepth: 'standard',
  hiddenSectionsPolicy: 'excludeAll', timingPolicy: 'excludeUnlessAsked', spiritualPolicy: 'excludeUnlessAsked',
  confidencePolicy: 'flagIfBelowThreshold',
  strategyConstraints: {
    mustInclude: ['outcomeRules', 'currentStateRules'],
    mayInclude: ['businessRelevantRules', 'verification'],
    mustExclude: ['hiddenThought', 'characterNature'],
    advisorOnly: ['technicalFormulaDetails'],
    requiresEvidence: ['contradictionResolution'],
    forbiddenWithoutQuestion: ['timing', 'spiritualDiagnostics'],
  },
  strategyReason: 'נבחרה אסטרטגיית Decision Support משום שהשאלה מבקשת להחליט אם לבצע פעולה, ולא לחזות תוצאה מוחלטת.',
  requiresClarification: false, needsOrenDecision: false,
}
```

### דוגמה 3 — Hidden Thought: "מה הוא חושב עליי?"

**Intent Result (מקוצר):**
```js
{ primaryIntent: 'hiddenThoughtIntent', confidence: 0.95, requiresClarification: false }
```

**Reading Strategy (מקוצר):**
```js
{
  strategyId: 'strat-hiddenThoughtIntent-loveRelationship',
  method: 'kashf', questionType: 'loveRelationship', primaryIntent: 'hiddenThoughtIntent',
  goal: 'לברר מחשבה/כוונה נסתרת של הצד השני',
  primaryEvidence: ['hiddenThoughtRules'],
  secondaryEvidence: ['characterNature'],
  verificationPolicy: 'onlyOnContradiction',
  clientDepth: 'standard', advisorDepth: 'full-reasoning',
  hiddenSectionsPolicy: 'includeHiddenThoughtOnly', timingPolicy: 'excludeUnlessAsked', spiritualPolicy: 'excludeUnlessAsked',
  confidencePolicy: 'flagIfBelowThreshold',
  strategyConstraints: {
    mustInclude: ['hiddenThoughtRules'],
    mayInclude: ['characterNature'],
    mustExclude: ['outcomeRules'],
    advisorOnly: ['technicalFormulaDetails', 'dhamir'],
    requiresEvidence: ['contradictionResolution'],
    forbiddenWithoutQuestion: ['timing', 'spiritualDiagnostics'],
  },
  strategyReason: 'נבחרה אסטרטגיית Hidden Thought משום שהשאלה מבקשת לברר מה אדם אחר חושב או מרגיש, לא תוצאה עתידית ולא החלטה.',
  requiresClarification: false, needsOrenDecision: false,
}
```

### דוגמה 4 — Timing: "מתי העסק יתחיל להרוויח?"

**Intent Result (מקוצר):**
```js
{ primaryIntent: 'timingRequest', confidence: 0.85, requiresClarification: false }
```

**Reading Strategy (מקוצר):**
```js
{
  strategyId: 'strat-timingRequest-businessSuccess',
  method: 'hawi', questionType: 'businessSuccess', primaryIntent: 'timingRequest',
  goal: 'לברר את עיתוי תחילת הרווחיות',
  primaryEvidence: ['timingRules', 'outcomeRules'],
  secondaryEvidence: ['verification'],
  verificationPolicy: 'onlyOnContradiction',
  clientDepth: 'standard', advisorDepth: 'standard',
  hiddenSectionsPolicy: 'excludeAll', timingPolicy: 'includeAsPrimary', spiritualPolicy: 'excludeUnlessAsked',
  confidencePolicy: 'flagIfBelowThreshold',
  strategyConstraints: {
    mustInclude: ['timingRules', 'outcomeRules'],
    mayInclude: ['verification'],
    mustExclude: ['hiddenThought', 'characterNature'],
    advisorOnly: ['technicalFormulaDetails'],
    requiresEvidence: ['contradictionResolution'],
    forbiddenWithoutQuestion: ['spiritualDiagnostics'],
  },
  strategyReason: 'נבחרה אסטרטגיית Timing משום שהשאלה מבקשת עיתוי מפורש ("מתי"), בצירוף תוצאה-כלכלית ספציפית, ולא תיאור-מצב או החלטה.',
  requiresClarification: false, needsOrenDecision: false,
}
```

**הערה:** בניגוד לדוגמה 1 (Prediction), כאן `timing` **לא** מופיע ב-`forbiddenWithoutQuestion` — כי המשתמש בפועל שאל "מתי" במפורש. זה ממחיש את המנגנון: `forbiddenWithoutQuestion` הוא תלוי-הקשר, לא רשימה-קבועה-גלובלית.

---

## 12. גבולות אחריות (סיכום מחודד)

| Reading Strategy Builder — **כן** | Reading Strategy Builder — **לא** |
|---|---|
| מתרגם Intent לתוכנית אסטרטגית | לא בוחר Rule IDs סופיים |
| מגדיר גבולות (`strategyConstraints`) | לא מפעיל מנוע |
| מגדיר מדיניות אימות, סתירה, עיתוי ורוחניות | לא מחשב לוח |
| מסביר למה נבחרה האסטרטגיה (`strategyReason`) | לא בונה תשובת לקוח |
| | לא מבצע Audit |
| | לא מתקן מנועים |
| | לא מחליט במקום אורן במקרה עמום |

---

## סיכום היקף המסמך הזה

✅ הוגדר חוזה מלא ל-Reading Strategy Builder: מטרה, אחריות, קלט, Output Contract מלא (23 שדות, כולל `strategyConstraints`+`strategyReason` החדשים), איסורים, חיבורים-עתידיים, validators נדרשים (כולל 10 כללי strategyConstraints/strategyReason), בדיקות נדרשות, 4 דוגמאות מלאות, גבולות-אחריות מחודדים.

❌ שום קוד. שום תיקייה חדשה. שום קובץ `.js`/`.mjs`. שום test. שום commit. שום push עדיין (ימתין לאישור נפרד לפני מימוש בפועל, כרגיל).
