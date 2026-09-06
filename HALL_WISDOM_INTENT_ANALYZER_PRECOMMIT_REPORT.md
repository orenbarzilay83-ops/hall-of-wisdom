# HALL_WISDOM_INTENT_ANALYZER_PRECOMMIT_REPORT.md

> **דוח לפני commit. לא בוצע commit. לא בוצע push. לא הותחל Reading Strategy Builder.**
> תאריך: 2026-07-13. ענף: `claude/app-cleanup-organization-mia9b2`.
> **עודכן פעמיים:** (1) אחרי 3 התיקונים בסבב הראשון (unknown/tie-break/exclusion reasons), (2) אחרי 2 התוספות בסבב השני (`decisionReason` + `analysisVersion`). כל הדוח עודכן **inline** בהתאם בשני הסבבים — לא רק מוסף בסוף.

---

## עדכון סבב 2 — decisionReason + analysisVersion (עונה ישירות על 10 הנקודות שביקשת)

1. **היכן נוסף `analysisVersion`:** קבוע יחיד `export const ANALYSIS_VERSION = 'intent-analyzer-v1';` ב-`goral-hachol/intelligence/intent-analyzer.js` (מקום-הגדרה יחיד בקוד כולו). מוחזר כשדה `analysisVersion` בכל פלט של `analyzeIntent()` (גם `unknown` וגם intent אמיתי — ללא יוצא מן הכלל), וגם מיוצא ב-default export (`export default { analyzeIntent, validateIntentInput, validateIntentResult, ANALYSIS_VERSION }`) כדי שקוד-קורא/בדיקות יוכלו להשוות מול המקור בלי לשכפל את המחרוזת.
2. **היכן נוסף `decisionReason`:** פונקציה חדשה `buildDecisionReason(...)` ב-`intent-analyzer.js`, נבנית **אך ורק** מעובדות שכבר חושבו במהלך `analyzeIntent()` (מספר-תבניות-שתאמו, ניקודים, רשימת-excludedIntents, קיום-מתחרה-אמיתי) — ללא AI, ללא chain-of-thought, ללא ניחוש. 4 ענפים דטרמיניסטיים: (א) 0-ניקוד → המשפט המדויק שביקשת: *"לא ניתן לזהות Intent יחיד בביטחון מספק ולכן נדרשת הבהרה."* (ב) פער-לא-מספיק/תיקו → *"לא ניתן להכריע בין X ל-Y (ניקוד קרוב מדי), ולכן נדרשת הבהרה."* (ג) מתחת-לסף-הביטחון → משפט-הסבר עם שם-המועמד והביטחון-המחושב. (ד) הכרעה-בטוחה → *"נבחר X משום ש[מספר-תבניות] התואמות ל-X[, לא נמצאו אותות של Y או Z][, וקיבל עדיפות על W]."* מוחזר כשדה `decisionReason` בכל פלט, **תמיד קיים** — גם כש-`requiresClarification:true` וגם כשהביטחון גבוה (עונה על שני התנאים שביקשת בו-זמנית, ראו סעיף 4 להלן להסבר למה "תמיד-חובה" היא הפרשנות היחידה-העקבית).
3. **כמה בדיקות נוספו:** **153 → 208 (55 בדיקות חדשות)**. פירוט מלא בסעיף 11 למטה.
4. **האם Output Contract השתנה:** כן — נוספו **2 שדות חדשים** לפלט (`decisionReason`, `analysisVersion`), הצורה עולה מ-13 ל-**15 שדות**. שני השדות נאכפים גם ב-`validateIntentResult`: `analysisVersion` חייב להיות מחרוזת-לא-ריקה בכל פלט; `decisionReason` חייב להיות מחרוזת-לא-ריקה בכל פלט. לגבי "not empty above confidence threshold" מול "exists even when requiresClarification=true": שני התנאים נאכפים כאחד ע"י דרישת-קיום-תמידית (string לא-ריק בכל מקרה) — זו הפרשנות היחידה שמספקת גם את המקרה-של-ביטחון-גבוה וגם את המקרה-של-בקשת-הבהרה בלי סתירה, ומאומתת ישירות ב-4 הדוגמאות שנתת (המקרה-הריק, התיקו, וההכרעה-הבטוחה — לכולם יש `decisionReason` לא-ריק).
5. **אישור: אין שינוי במנועים.** `goral-hachol/engine/*` לא נערך ולא נגוע בסבב הזה — מאומת אוטומטית (structural guard) וידנית (`grep` לא מצא ייבוא מ-`engine/` בשום קובץ ב-`intelligence/`).
6. **אישור: אין שינוי ב-QA הקיים.** `goral-hachol/qa/*` לא נערך. `_test_goral_qa_brain_phase2.mjs` ו-`_test_hall_wisdom_ai_qa_evaluator_phase3.mjs` הורצו-מחדש אחרי התוספות — עדיין ירוקים במלואם, זהה-בדיוק לבייסליין.
7. **אישור: אין AI חי.** שום `callAnthropic`/`ANTHROPIC_API_KEY` בשום קובץ ב-`intelligence/` — מאומת אוטומטית ב-structural guard וגם ב-`grep` ידני. `decisionReason` הוא תבנית-מחרוזת קבועה, לא קריאה למודל.
8. **אישור: אין fetch.** שום `fetch(...)` בשום קובץ ב-`intelligence/` — מאומת אוטומטית וידנית.
9. **אישור: אין Deploy.** לא בוצע `supabase functions deploy`, לא Vercel/production deploy, לא נגעתי ב-`supabase/functions/*` בסבב הזה.
10. **אישור: אין Merge ל-main.** כל העבודה על `claude/app-cleanup-organization-mia9b2` בלבד. לא נוצר ענף חדש, לא בוצע commit — ממתין לאישורך.

---

## עדכון סבב 1 — 3 התיקונים שבוצעו

**1. אין יותר `generalForecast` כברירת-מחדל.** נוסף `primaryIntent = 'unknown'` (קבוע חדש, `UNKNOWN_INTENT_ID`) — ערך **שאינו** אחד מ-12 ה-intents. כל עוד הביטחון לא-מספיק (0 ניקוד, תיקו/פער-לא-מספיק, או תבנית-חלשה-בלבד) → `primaryIntent:'unknown'`, `requiresClarification:true` **תמיד** (נאכף גם בולידטור: `unknown` בלי `requiresClarification:true` נכשל-ולידציה). כשלא-ידוע: `strategyHints:[]`, `forbiddenDefaultRuleCategories` = איחוד-שמרני של כל הקטגוריות-האסורות מכל 12 ה-intents (קבוע חדש `UNKNOWN_FORBIDDEN_RULE_CATEGORIES`).

**2. אין יותר הכרעת-תיקו לפי סדר-רשימה.** נוסף קבוע `CLEAR_WIN_MARGIN = 2`. אם הפער בין הניקוד-המוביל לניקוד-השני **קטן מ-2** (כולל תיקו מוחלט) — **לא נבחר אף primaryIntent אמיתי**, גם לא לפי סדר-הצהרה. התוצאה: `unknown` + `requiresClarification:true`, עם שני-המועמדים-הקרובים גלויים ב-`secondaryIntents` ובנימוק-מפורש ב-`ambiguityReasons`. נבדק ישירות עם דוגמה אמיתית ("מתי כדאי לי לנסוע?" — תיקו/פער-1 בין `decisionSupport` ל-`timingRequest`) שהופכת ל-`unknown`.

**3. מנגנון Excluded Intents חוזק.** לכל intent הורחב `commonlyConfusedWith` ל-3-5 items (היה 2-4). נוסף מיפוי-נימוקים חדש `EXCLUSION_REASON_BY_INTENT` — נימוק קונקרטי-ואנושי לכל intent-נפסל (למשל `decisionSupport`: "לא נשאל האם כדאי לבצע פעולה"), במקום התבנית-הגנרית הקודמת ("לא נמצא אות"). דוגמת `prediction` עודכנה ל-5 excludedIntents בדיוק כפי שביקשת (כולל `decisionSupport` שהיה חסר).

---

## 1. `git diff --stat`

```
(ריק — אין שינוי לשום קובץ עקוב-גיט קיים)
```
כל השינוי בסבב הזה הוא קבצים חדשים בלבד.

## 2. רשימת קבצים חדשים/שונו

| קובץ | שורות (אחרי סבב 2) | סוג |
|---|---|---|
| `goral-hachol/intelligence/intent-types.js` | 279 (ללא שינוי בסבב 2) | חדש |
| `goral-hachol/intelligence/intent-analyzer.js` | 347 (היה 283) | חדש |
| `goral-hachol/intelligence/intent-analyzer-hebrew-rules.js` | 122 (ללא שינוי) | חדש |
| `_test_hall_wisdom_intent_analyzer.mjs` | 465 (היה 379) | חדש |
| `HALL_WISDOM_INTENT_ANALYZER_PRECOMMIT_REPORT.md` | (זה) | חדש |

**`HALL_WISDOM_UNCOMMITTED_WORK_AUDIT.md` נשאר untracked, לא נגעתי בו, לא נכלל ב-commit המוצע.** (ראו גם `HALL_WISDOM_SESSION_SUMMARY_REPORT.md` — נוצר בסבב קודם, גם הוא untracked ולא-נגוע, לא נכלל.)

**שום קובץ קיים לא נערך.** אין `M` אחד ב-`git status` מלבד אלה שכבר-untracked-מבעוד-מועד.

---

## 3. רשימת ה-Intents

12 intents, במקור-אמת יחיד (`intent-types.js::INTENT_DEFINITIONS`):

| intentId | titleHebrew | תיאור קצר |
|---|---|---|
| `prediction` | ניבוי | מה צפוי לקרות |
| `decisionSupport` | תמיכה בהחלטה | האם כדאי לבצע פעולה |
| `stateAssessment` | בירור מצב | מה המצב הנוכחי |
| `hiddenThoughtIntent` | כוונה/מחשבה נסתרת | מה אדם חושב/מרגיש/מתכוון |
| `timingRequest` | בקשת עיתוי | מתי דבר יקרה |
| `investigation` | חקירה | מי עשה/היכן נמצא |
| `diagnosis` | אבחון סיבה | מה מקור הבעיה |
| `compatibility` | התאמה | האם יש התאמה בין אנשים/דברים |
| `outcomeCompletion` | השלמת עניין | האם עניין יושלם |
| `comparison` | השוואה | איזו אפשרות עדיפה |
| `guidance` | הכוונה | מה נכון לעשות |
| `generalForecast` | תחזית כללית | שאלה כללית ללא יעד ממוקד |

**עודכן (תיקון 1): `generalForecast` כבר לא ברירת-המחדל כשאין אף אות.** נוסף ערך נפרד ומיוחד, `unknown` (`UNKNOWN_INTENT_ID`) — **אינו** אחד מ-12 ה-intents למעלה, לא-מקבל `compatibleQuestionTypes`/`defaultStrategyHints`/`confidenceThreshold` משלו (אין לו "הגדרה" — הוא **היעדר**-הגדרה, במפורש). כל 12 ה-intents נשארים ורק הם ניתנים-לבחירה-בפועל כ-`primaryIntent`, ומעליהם ה-fallback-הבטוח `unknown`.

כל אחד מ-12 ה-intents נושא 7 שדות: `intentId`, `titleHebrew`, `description`, `compatibleQuestionTypes`, `defaultStrategyHints`, `forbiddenDefaultRuleCategories`, `confidenceThreshold` — **בתוספת שדה שמיני, `commonlyConfusedWith`**, שנוסף מעבר למפרט המינימלי-שביקשת כי הוא נדרש להפעלת ה-exclusion logic (חלק ו במפרט) — הרחבה מינימלית ומתועדת, לא סטייה שקטה. **(תיקון 3):** `commonlyConfusedWith` הורחב מ-2-4 items ל-3-5 items לכל intent, ונוסף מיפוי-נימוקים חדש `EXCLUSION_REASON_BY_INTENT`.

---

## 4. Output Contract — האם השתנה?

**(עודכן, סבב 2) צורת ה-contract גדלה מ-13 ל-15 שדות** — נוספו `decisionReason` ו-`analysisVersion` בסוף:
```js
{
  normalizedQuestion, primaryIntent, secondaryIntents, questionType, confidence,
  matchedSignals, excludedIntents, ambiguityReasons, strategyHints,
  forbiddenDefaultRuleCategories, requiresClarification, clarificationQuestion,
  needsOrenDecision, decisionReason, analysisVersion,
}
```
כל 15 השדות ממומשים בדיוק כפי שהתבקש (נבדק ישירות — `_test_hall_wisdom_intent_analyzer.mjs` §"output contract shape", עודכן לכלול את 2 השדות החדשים). **`topicId` לא מופיע בפלט בכלל** — מאומת אוטומטית שהוא לעולם לא-מומצא/לא-נכלל.

**`decisionReason`**: מחרוזת עברית דטרמיניסטית, נבנית מ-template לפי עובדות-מחושבות בלבד (ר' עדכון סבב 2 §2). **`analysisVersion`**: מחרוזת-קבועה `'intent-analyzer-v1'`, זהה בכל פלט, ממקור-הגדרה יחיד (`ANALYSIS_VERSION`).

**מה כן השתנה: מרחב-הערכים החוקי של `primaryIntent` הורחב.** קודם: אך-ורק אחד מ-12 ה-intents. עכשיו: אחד מ-12 ה-intents, **או** `'unknown'`. זהו שינוי-ערך (value-space), לא שינוי-צורה — `primaryIntent` עדיין מחרוזת יחידה, עדיין שדה-חובה. בנוסף, שלושה שדות אחרים משנים-משמעות-מותנית כש-`primaryIntent==='unknown'`: `strategyHints` יהיה `[]`, `forbiddenDefaultRuleCategories` יהיה האיחוד-השמרני (`UNKNOWN_FORBIDDEN_RULE_CATEGORIES`), ו-`excludedIntents` יהיה `[]` — כל השלושה מתועדים ונבדקים במפורש.

---

## 5. איך מתבצע normalization

`normalizeQuestion()`: `trim()` + כיווץ-רווחים-מרובים לרווח-בודד (`replace(/\s+/g, ' ')`). **לא** מוסר סימני-פיסוק, **לא** משנה ניקוד/אותיות (עברית אין לה case). נבדק שסימן-שאלה/נקודה/רווחים-כפולים לא משנים את תוצאת-הסיווג (`_test_hall_wisdom_intent_analyzer.mjs` §"punctuation variants").

---

## 6. איך נקבע primaryIntent (עודכן — תיקונים 1+2)

1. לכל אחד מ-12 ה-intents, סוכמים משקל-משולב של כל תבנית-regex תואמת מ-`intent-analyzer-hebrew-rules.js` (משקל 1=חלש, 2=בינוני, 3=חזק-וממוקד).
2. אם `questionTypeHint` תקף נמסר והוא נמצא ב-`compatibleQuestionTypes` של ה-intent, מתווסף בונוס קטן (0.5) — **לעולם לא-מספיק כדי-להמציא-סיווג מאפס, רק לשבור-תיקו בין 2+ מועמדים שכבר-קיבלו-ניקוד-מהטקסט**.
3. **(תיקון 2, החליף לגמרי את הכרעת-התיקו-לפי-סדר-רשימה שהייתה קודם):** ה-intent המוביל (`candidateId`) נבדק מול השני-בתור. אם הפער `topScore - secondScore < CLEAR_WIN_MARGIN` (קבוע=2, כולל תיקו-מוחלט שהפער בו 0) — **אין הכרעה כלל**. אין ברירת-מחדל-לפי-סדר-רשימה, אין ניחוש. `primaryIntent` הופך ל-`unknown`.
4. **(תיקון 1, החליף לגמרי את ה-fallback ל-`generalForecast`):** אם **אף** intent לא קיבל ניקוד (0 בכולם), **או** התקיים סעיף 3 (פער-לא-מספיק), **או** הביטחון-המחושב (סעיף 5) נמוך-מהסף-הספציפי-ל-intent המוביל — בכל שלושת המקרים: `primaryIntent = 'unknown'` (**לא** `generalForecast`, **לא** אף intent אחר), `requiresClarification = true` **תמיד** (נאכף גם ב-`validateIntentResult` — קומבינציה של `unknown` בלי `requiresClarification:true` נכשלת-ולידציה במפורש).
5. `confidence` מחושב מיחס בין ניקוד-ראשון לניקוד-שני (או נוסחת-בסיס אם אין מתחרה), **עם תקרה: אם התבנית-החזקה-ביותר-שתאמה היא ממשקל-1-בלבד, ה-confidence לא יכול לעבור 0.4** — זה מה שמונע מ"מה יהיה איתו?" (תבנית חלשה בלבד) לקבל ביטחון-שווא.
6. **רק כאשר** יש-מנצח-ברור (פער ≥2) **וגם** הביטחון עובר את הסף-הספציפי-ל-intent — `primaryIntent` נקבע לאותו intent אמיתי, `requiresClarification:false`. **בכל מקרה אחר — `unknown`.** אין מצב-ביניים (לא "primaryIntent אמיתי עם requiresClarification:true").

## 7. איך נקבעים secondaryIntents

כל intent (מלבד ה-primary) שניקודו ≥ 1, ממוין-לפי-ניקוד-יורד, מוגבל ל-3, ללא כפילויות (`Set`).

## 8. איך exclusion עובד (עודכן — תיקון 3)

לכל intent מוגדר `commonlyConfusedWith` (**3-5** intents "מסוכנים-לבלבול", הורחב מ-2-4). אם intent כזה **לא** קיבל שום ניקוד (0), הוא נכנס ל-`excludedIntents` עם `reason` — **כעת נימוק-קונקרטי-ואנושי לפי מיפוי חדש `EXCLUSION_REASON_BY_INTENT`** (לדוגמה: `hiddenThoughtIntent` → "השאלה אינה מבקשת לברר מחשבות או רגשות", `decisionSupport` → "לא נשאל האם כדאי לבצע פעולה"), **לא** התבנית-הגנרית-הקודמת ("לא נמצא אות התואם ל-X"). כשה-`primaryIntent` הוא `unknown` — `excludedIntents` הוא **תמיד מערך-ריק** (אין "primary" אמיתי להסביר-ביחס-אליו מה נפסל).

## 9. איך ambiguity מטופלת (עודכן — תיקונים 1+2)

שלושה מקרים מובחנים, וכולם מובילים כעת ל-**אותה תוצאה מחייבת**: `primaryIntent:'unknown'`, `requiresClarification:true`:
- **0 ניקוד בכל ה-intents** → `confidence:0`, `ambiguityReasons` מכיל "לא נמצאה אף תבנית-כוונה מוכרת".
- **(חדש, תיקון 2) פער-לא-מספיק/תיקו בין 2 מועמדים** (`topScore-secondScore < 2`) → `ambiguityReasons` מסביר בדיוק את שני-הניקודים-והפער, שני המועמדים מופיעים ב-`secondaryIntents`.
- **רק תבנית-חלשה (משקל 1) תאמה** → `confidence` מוגבל ל-0.4, `ambiguityReasons` מסביר "נמצא רק אות חלש".

`clarificationQuestion` נבנה תמיד מהמועמדים-האמיתיים-שכן-ניקדו (עד 3, ממוינים), או מרשימת-ברירת-מחדל (`stateAssessment`/`hiddenThoughtIntent`/`prediction`) רק כאשר 0 מועמדים ניקדו כלל.

---

## 10. דוגמאות קלט/פלט (עודכן, סבב 2: כל דוגמה מציגה גם `decisionReason`+`analysisVersion`)

**קלט:** `{ question: 'האם העסק החדש יצליח?' }`
**פלט (מקוצר):**
```js
{
  primaryIntent: 'prediction', confidence: 1,
  excludedIntents: [
    { intentId: 'hiddenThoughtIntent', reason: 'השאלה אינה מבקשת לברר מחשבות או רגשות.' },
    { intentId: 'timingRequest', reason: 'לא נשאל מתי.' },
    { intentId: 'diagnosis', reason: 'לא נשאלה סיבת הבעיה.' },
    { intentId: 'investigation', reason: 'לא מתבצע בירור של אדם, חפץ או אירוע.' },
    { intentId: 'decisionSupport', reason: 'לא נשאל האם כדאי לבצע פעולה.' },
  ],
  requiresClarification: false, clarificationQuestion: null,
  decisionReason: 'נבחר prediction משום שנמצאה תבנית מובהקת התואמת ל-prediction, לא נמצאו אותות של hiddenThoughtIntent או timingRequest.',
  analysisVersion: 'intent-analyzer-v1',
}
```

**קלט:** `{ question: 'מה יהיה איתו?' }`
**פלט (מקוצר):**
```js
{ primaryIntent: 'unknown', confidence: 0.4, requiresClarification: true,
  clarificationQuestion: 'האם אתה מבקש לדעת תחזית כללית?',
  ambiguityReasons: ['נמצא רק אות חלש (משקל 1) ולא נמצאה תבנית חזקה ומדויקת יותר.'],
  decisionReason: 'הביטחון בזיהוי generalForecast (0.4) נמוך מהסף הנדרש, ולכן לא ניתן לזהות Intent יחיד בביטחון מספק ונדרשת הבהרה.',
  analysisVersion: 'intent-analyzer-v1' }
```

**קלט:** `{ question: 'מה קורה בעסק?' }`
**פלט (מקוצר):**
```js
{ primaryIntent: 'unknown', confidence: 0, requiresClarification: true,
  clarificationQuestion: 'האם אתה מבקש לדעת בירור מצב, כוונה/מחשבה נסתרת, או ניבוי?',
  decisionReason: 'לא ניתן לזהות Intent יחיד בביטחון מספק ולכן נדרשת הבהרה.',
  analysisVersion: 'intent-analyzer-v1' }
```
(זהו **בדיוק** המשפט שביקשת כטקסט מילולי-חובה למקרה-0-ניקוד — הותאם מילה-במילה, לא רק בסגנון.)

**קלט (דוגמת-תיקו אמיתית, סבב 1):** `{ question: 'מתי כדאי לי לנסוע?' }`
**פלט (מקוצר):**
```js
{ primaryIntent: 'unknown', confidence: 0.57, requiresClarification: true,
  secondaryIntents: ['decisionSupport', 'timingRequest'],
  ambiguityReasons: ['הפער בין "תמיכה בהחלטה" (ניקוד 4) ל-"בקשת עיתוי" (ניקוד 3) קטן-מדי להכרעה שמרנית — לא נבחרת כוונה יחידה באופן שרירותי.'],
  decisionReason: 'לא ניתן להכריע בין decisionSupport ל-timingRequest (ניקוד קרוב מדי), ולכן נדרשת הבהרה.',
  analysisVersion: 'intent-analyzer-v1' }
```

**קלט חדש (סבב 2, מדגים את סעיף "קיבל עדיפות על" ב-decisionReason):** `{ question: 'האם כדאי לי לנסוע, ומתי?' }`
**פלט (מקוצר):**
```js
{ primaryIntent: 'decisionSupport', confidence: 0.71, requiresClarification: false,
  secondaryIntents: ['timingRequest'],
  decisionReason: 'נבחר decisionSupport משום שנמצאו 3 תבניות התואמות ל-decisionSupport, לא נמצאו אותות של hiddenThoughtIntent או outcomeCompletion, וקיבל עדיפות על timingRequest.',
  analysisVersion: 'intent-analyzer-v1' }
```
(שאלה זו כוללת גם ביטוי-decisionSupport חזק וגם ביטוי-timing — decisionSupport מנצח בפער מספיק, ו-`decisionReason` מתעד במפורש את הניצחון-על-המתחרה-האמיתי, בניגוד לדוגמה הקודמת שבה אין מתחרה-אמיתי לציין.)

---

## 11. מספר הבדיקות (עודכן, סבב 2: 153 → 208, +55)

**208 assertions**, 0 נכשלות, ב-`_test_hall_wisdom_intent_analyzer.mjs` (היה 153 אחרי סבב 1 — נוספו **55 בדיקות** בסבב 2). מכסות את כל מה שהיה קודם, **בתוספת 55 בדיקות חדשות לסבב 2**:
- **decisionReason קיים ותקין** (כמה בדיקות): קיים במקרה-הכרעה-בטוחה וכולל את שם ה-intentId שנבחר; קיים במקרה-עמימות; מחרוזת-לא-ריקה בכל תרחיש שנבדק.
- **decisionReason — טקסט מדויק למקרה-0-ניקוד**: בדיקת-שוויון-מדויקת (`===`) מול המשפט המילולי שביקשת: `'לא ניתן לזהות Intent יחיד בביטחון מספק ולכן נדרשת הבהרה.'`.
- **decisionReason — תבנית-תיקו**: `startsWith('לא ניתן להכריע בין')` + בדיקה ששני ה-intentId (המוביל והשני) אכן מופיעים בטקסט.
- **decisionReason — מקרה-הכרעה-עם-מתחרה-אמיתי**: `includes('קיבל עדיפות על')` כשיש runner-up אמיתי (ניקוד>0), ו-**היעדר** הביטוי הזה כשאין runner-up אמיתי.
- **analysisVersion — עקביות**: לא-ריק; **זהה בין 4 שאלות שונות לגמרי** (כולל מקרי unknown ומקרי-הכרעה-בטוחה); תואם בדיוק למחרוזת המיוצאת `ANALYSIS_VERSION`.
- **פרטיות — decisionReason לא דולף PII**: הורצו שאלות עם מספר-טלפון מזויף ועם שם-פרטי מזויף בתוך `question`, ואומת ש-`decisionReason` **אינו** מכיל את המחרוזות האלה (רק ניתוח מבני, לא echo של תוכן חופשי).
- **decisionReason אינו chain-of-thought**: לולאה על 8 מרקרים אסורים (`'אני חושב'`, `'לדעתי'`, `'בואו נבדוק'`, `'step by step'`, `'let me'`, `'I think'`, `'reasoning:'`, `'thought:'`) × 4 שאלות שונות — כולן עוברות (אין אף מרקר).
- **decisionReason למקרה-עמימות מכיל את הטקסט המתאים** — נבדק בנפרד לכל אחד משלושת ענפי-העמימות (0-ניקוד / תיקו / מתחת-לסף).
- **4 בדיקות-ולידטור חדשות**: פלט-בלי-`analysisVersion` נכשל-ולידציה; פלט-עם-`decisionReason` ריק (`''`) נכשל-ולידציה; פלט-בלי-`decisionReason` בכלל נכשל-ולידציה; פלט אמיתי (מ-`analyzeIntent()` בפועל, גם מקרה-unknown וגם מקרה-בטוח) עובר את כל הבדיקות-החדשות ב-`validateIntentResult`.
- **output-contract shape** עודכן לבדוק 15 שדות (לא 13).

## 12. תוצאות Regression (הורצו-מחדש אחרי סבב 2 — עדיין ירוק, זהה-בדיוק)

```
_test_goral_knowledge_decision_brain_phase4.mjs           → 1010 passed, 0 failed (60/60 תרחישים ללא בעיה)
_test_hall_wisdom_reading_intelligence_foundation.mjs      → 54 passed, 0 failed
_test_goral_qa_brain_phase2.mjs                              → כל הבדיקות עברו
_test_hall_wisdom_ai_qa_evaluator_phase3.mjs                  → כל הבדיקות עברו
```
**כן — Regression עדיין ירוק במלואו, ללא אף שינוי-תוצאה, גם אחרי סבב 2.**

---

## 13. אישור: אין שינוי מנועים

✅ שום קובץ תחת `goral-hachol/engine/` לא נערך ולא נגוע — `intent-analyzer.js`/`intent-types.js`/`intent-analyzer-hebrew-rules.js` **אינם מייבאים דבר** מ-`goral-hachol/engine/`, מאומת אוטומטית (structural guard בקובץ-הבדיקה) וגם ידנית.

## 14. אישור: אין שינוי QA קיים

✅ `goral-hachol/qa/*` לא נערך כלל. `git diff --stat` ריק. הרצה מלאה של `goral-brain-evaluation-runner.mjs` (60 תרחישים) מוכיחה תוצאה-זהה-בדיוק לבייסליין הקודם.

## 15. אישור: אין שינוי UI/קלפים

✅ `goral-hachol.html`/`goral-hachol/ui/*`/`cards.html`/`cartomancy/*` לא נערכו — מאומת אוטומטית (smoke tests).

## 16. אישור: אין AI חי

✅ שום `callAnthropic`/הפניה ל-`ANTHROPIC_API_KEY` בשום קובץ חדש — מאומת אוטומטית.

## 17. אישור: אין fetch

✅ שום קריאת `fetch(...)` בשום קובץ חדש — מאומת אוטומטית.

## 18. אישור: אין deploy

✅ לא בוצע `supabase functions deploy`, לא Vercel production deploy — לא נגעתי כלל ב-`supabase/functions/*` בסבב הזה.

## 19. אישור: אין merge ל-main

✅ כל העבודה על `claude/app-cleanup-organization-mia9b2` בלבד. לא נוצר ענף חדש. אין commit — ממתין לאישורך.

## 20. הרכיב הבא בלבד

**Reading Strategy Builder** — לפי ה-Roadmap (`HALL_WISDOM_CORE_ARCHITECTURE.md`, שלב 3 מתוך 16). **לא הותחל** בסבב הזה. יקבל `Question + Intent (מ-Intent Analyzer) + Method` ויחזיר `ReadingStrategy` (הסכימה כבר מתועדת במסמך-הליבה, חלק ה) — אבל המימוש בפועל דורש אישור-התחלה נפרד ומפורש, כמו כל שלב קודם.

---

## סיכום — לא בוצע כלום מעבר למימוש+בדיקות+הדוח (כולל אחרי סבב 2)

לא commit. לא push. לא Reading Strategy Builder. `HALL_WISDOM_UNCOMMITTED_WORK_AUDIT.md` נשאר untracked, לא-נגוע, לא-נכלל. `git status` מציג בדיוק אותם 7 קבצים untracked שהיו לפני סבב 2 (4 קבצי-ליבה + 3 מסמכים untracked קודמים) — אין קובץ נוסף/חסר.
