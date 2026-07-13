# HALL_WISDOM_READING_PLANNER_COMPONENT_CONTRACT.md

> **מסמך-חוזה בלבד. אין קוד. אין תיקיות חדשות. אין JS. אין Tests.**
> תאריך: 2026-07-13. ענף: `claude/app-cleanup-organization-mia9b2`.
> מטרת המסמך: להגדיר את חוזה הרכיב הבא ב-Roadmap (`HALL_WISDOM_CORE_ARCHITECTURE.md`, חלק יב, שלב 4 מתוך 16; חלק יא, ה-Pipeline הסופי) — **Reading Planner** — לפני שמתחיל מימוש בפועל.
> **עודכן** — שני תיקונים לפני-קוד: (1) נוסף `readingDomain` (`'goralHachol'`/`'cards'`) לתיקון-הסתירה שבין ה-`method` המוגבל-ל-Kashf/Hawi לבין תיאור-הרכיב כמשותף גם ל-`reading.cards` — ראו סעיף 2. (2) `question` הוגדר-במפורש כשדה-חובה (היה סותר את עצמו — "נדרש" בהגדרת-השדה מול "אופציונלי" ברשימת-החובה) — ראו סעיף 2.

---

## 1. מטרת הרכיב

Reading Planner מקבל `Intent Result` + `Reading Strategy` + `Question Type` + `Reading Domain` + `Method` + `TopicId`/`SpreadId` + `Knowledge Pipeline Output` + `Strategy Constraints`, ומחזיר **`Reading Plan`** — תוכנית-קריאה מובנית ומפורשת.

**הוא אינו מפעיל מנועים. הוא אינו מחשב לוח. הוא אינו בוחר תשובה ללקוח. הוא אינו מבצע Audit. הוא אינו מפעיל AI.**

**תפקידו:** לתרגם `ReadingStrategy` לתוכנית-קריאה מובנית ומפורשת שה-**Rule Decision Engine** וה-**Engine Execution Coordinator** יוכלו לבצע בפועל. זהו הצעד השלישי בשרשרת `Intent → Strategy → Knowledge Decision Pipeline → Plan` שכבר נקבעה במסמך-הליבה (`HALL_WISDOM_CORE_ARCHITECTURE.md`, חלק יא): ה-Rule Decision Engine **אינו** מחליט לבד אילו קטגוריות בכלל רלוונטיות — הוא מקבל אותן מוכנות מה-Plan.

---

## 2. Input Contract

**עודכן — נוסף `readingDomain` (תיקון הסתירה מסעיף 1 למטה) ו-`spreadId`, ו-`question` הפך לשדה-חובה (תיקון הסתירה מסעיף 2 למטה).**

```js
{
  question,                  // string, נדרש — echo/traceability בלבד, לא מנותח-מחדש (ר' "כללי question" למטה)
  readingDomain,              // 'goralHachol' | 'cards', נדרש
  method,                      // תלוי-readingDomain — ר' "כללי method" למטה, נדרש
  spreadId,                     // string, אופציונלי — ר' "כללי spreadId" למטה
  topicId,                       // string, אופציונלי (רלוונטי בעיקר ל-goralHachol)
  questionType,                   // string, נדרש (echo מ-Intent Result/Reading Strategy)
  intentResult,                    // object, נדרש — פלט מלא של analyzeIntent()
  readingStrategy,                  // object, נדרש — פלט מלא של buildReadingStrategy()
  knowledgeContext,                  // object, אופציונלי — פלט עתידי של Knowledge Decision Pipeline, ספציפי-ל-readingDomain
  availableRuleCategories,            // string[], אופציונלי — אילו קטגוריות בכלל קיימות ל-readingDomain+method+topicId/spreadId הנתונים
  sourceEvidencePointers,              // string[]/object[], אופציונלי — הפניות-מקור זמינות, ספציפיות-ל-readingDomain (לא תוכן-מקור עצמו)
  advisorMode,                          // boolean, אופציונלי, ברירת-מחדל false
  clientMode,                            // boolean, אופציונלי, ברירת-מחדל true
}
```

### שדות חובה (required)

`question`, `readingDomain`, `method`, `questionType`, `intentResult`, `readingStrategy`. בלי כל אחד מששת אלה אין מספיק מידע לבנות תוכנית-קריאה בכלל.

### שדות אופציונליים (optional)

`spreadId`, `topicId`, `knowledgeContext`, `availableRuleCategories`, `sourceEvidencePointers`, `advisorMode`, `clientMode`.

### כללי `readingDomain` (חדש)

**`readingDomain` הוא שדה-חובה**, קובע לאיזה Domain בתוך Reading Intelligence (`HALL_WISDOM_CORE_ARCHITECTURE.md`, חלק יד) שייכת הקריאה:

- `'goralHachol'` — גורל החול (Kashf/Hawi).
- `'cards'` — קלפים (cartomancy).

Reading Planner הוא **רכיב משותף** ל-Reading Intelligence כולה — לא רק לגורל החול. `readingDomain` הוא זה שקובע, לצורך כל שאר-הכללים, איזה `method` בכלל חוקי ואיזה `Knowledge Context` בכלל רלוונטי.

### כללי `method` (עודכן — תלוי-`readingDomain`)

```
readingDomain === 'goralHachol'  →  method ∈ { 'kashf', 'hawi' }
readingDomain === 'cards'         →  method === 'cartomancy'
```

**הערך `'cartomancy'` אומת מול הקוד הקיים, לא הומצא:** תיקיית-המודול היא `cartomancy/` (לא `cards/`), ומזהה-האחסון הקיים כבר משתמש בשם הזה — `cartomancyReadingsArchive_v1_${uid}` (`cartomancy/ui/cards-app.js:41`), וגם קובצי-QA כבר מתייחסים לתחום כ-`'cartomancy/**'` (`goral-hachol/qa/goral-qa-runner.mjs`, `goral-qa-ai-evaluator-mock.js`). **אין** כרגע קבוע-מפורש בשם `method`/`readingType` בקוד-הקלפים עצמו (שכן יש כרגע רק חפיסה-אחת/שיטה-אחת, לא כמה method-ים כמו ב-goralHachol) — `'cartomancy'` הוא לכן הבחירה-העקבית-היחידה עם המוסכמה הקיימת, לא ערך-מומצא.

**כלל-דחייה:** `method` שאינו-תואם ל-`readingDomain` הנתון (למשל `readingDomain:'cards'` עם `method:'hawi'`) — קלט לא-חוקי, נדחה.

### כללי `spreadId` (חדש)

- **אופציונלי עבור `goralHachol`** — אין מושג-פריסה בגורל החול (הלוח נבנה מ-4 אמהות, לא נבחר מרשימת-פריסות).
- **אופציונלי-או-נדרש עבור `cards`, בהתאם לחוזה העתידי של Cards Adapter** (Roadmap שלב 15) — לא נקבע-סופית כאן. ערכים-קיימים-בפועל בקוד (`cartomancy/ui/cards-app.js`, `state.spread`): `'three'` (שלושה קלפים) ו-`'past-present-future'` (עבר-הווה-עתיד).
- **Reading Planner אינו בוחר פריסה בעצמו.** אם פריסה כבר נבחרה (במסך-הקלפים, לפני שהתוכנית נבנית), הוא מקבל את `spreadId` כ-**context בלבד** — בדיוק כפי שהוא מקבל `topicId` כ-context בגורל-החול, לא כפרמטר-שהוא-עצמו-קובע.

### ערכים אסורים

- `readingDomain` שאינו `'goralHachol'`/`'cards'` — קלט לא-חוקי, נדחה.
- `method` שאינו-תואם ל-`readingDomain` (ר' למעלה).
- `intentResult`/`readingStrategy` שאינם עוברים את הולידטורים שלהם (`validateIntentResult`/`validateStrategyResult`, כבר קיימים) — קלט לא-חוקי, נדחה.
- `availableRuleCategories` המכיל קטגוריה שאינה מוכרת לקטלוג הקיים (`STRATEGY_CONSTRAINT_CATEGORIES` — הרחבתו העתידית היא עבודת-אינטגרציה, לא חלק מהחוזה הזה).

### כללי `question` (עודכן — הסתירה תוקנה)

**החלטה מאושרת: `question` הוא שדה-חובה.** הסיבה: Traceability, קישור בין Intent↔Strategy↔Plan, Audit עתידי, Reasoning Record עתידי, Scenario Regression. **אבל** Reading Planner:
- **אינו מנתח-מחדש את השאלה** (הניתוח כבר בוצע ב-Intent Analyzer).
- **אינו משנה אותה.**
- **אינו מסיק ממנה Intent חדש.**
- **רק שומר reference נורמלי/traceable**, בהתאם למדיניות-הפרטיות שלמטה — הוא לא "קורא" את השאלה מחדש כדי להחליט משהו, הוא רק נושא אותה כ-echo לצורך שרשור עתידי.

### שדות שאסור שיכילו מידע אישי מיותר

`question` הוא **השדה היחיד** בקלט שמותר לו להכיל טקסט-חופשי מהמשתמש (ולכן גם לשאת PII, שכן זו שאלת-הלקוח המקורית — לא זליגה, אלא הקשר-לגיטימי, וגם היא כבר-חובה כעת מסיבות traceability). **כל שאר השדות** (`knowledgeContext`, `availableRuleCategories`, `sourceEvidencePointers`, `topicId`, `spreadId`) חייבים להכיל אך ורק מזהים/קטגוריות/מבנה-נתונים — **אסור** שיכילו שם-לקוח, טלפון, כתובת, או כל פרט-מזהה אחר. Reading Planner אינו זיכרון-לקוח (Core Constitution, חלק ו). **בנוסף (Validator חדש):** אסור להעתיק את `question` לתוך `plannerReason` (ר' סעיף 8), ואסור להפיץ אותו מעבר לרכיבים שזקוקים-לו-בפועל.

### מה קורה אם `intentResult` דורש clarification

אם `intentResult.requiresClarification === true` (כלומר `primaryIntent === 'unknown'`), Reading Planner **אינו בונה תוכנית-פעולה אמיתית**. הוא מחזיר `Reading Plan` שמרני-במפורש: כל קטגוריות `primaryDecisionCategories`/`verificationCategories`/`conditionalCategories`/`supportingCategories` ריקות, `forbiddenCategories` רחב (איחוד-שמרני, כמו ב-Intent Analyzer/Reading Strategy Builder), `requiresClarification: true`, `clarificationQuestion` מועבר-הלאה מ-`intentResult`/`readingStrategy` (לא נבנה-מחדש), ו-`needsOrenDecision: true`. **לא בוצע ניחוש.**

### מה קורה אם `readingStrategy` אינו תקין

אם `readingStrategy` לא עובר את `validateStrategyResult` — Reading Planner **דוחה את הקלט** (שגיאת-קלט, לא מייצר Plan כלל). בניגוד למקרה-העמימות למעלה (שם יש `readingStrategy` תקין-אך-שמרני), כאן אין מספיק מידע-תקין בכלל להתחיל — זהו כשל-חוזה בין הרכיבים, לא מצב-ביניים לגיטימי.

---

## 3. Output Contract — `ReadingPlan`

**עודכן — נוספו `readingDomain` ו-`spreadId`:**

```js
{
  planId,
  planVersion,
  readingDomain,
  method,
  spreadId,
  topicId,
  questionType,
  primaryIntent,
  strategyId,
  goal,

  primaryDecisionCategories,
  verificationCategories,
  conditionalCategories,
  supportingCategories,
  advisorOnlyCategories,
  forbiddenCategories,
  unavailableCategories,

  requiredInputs,
  missingInputs,
  evidenceRequirements,
  sourceEvidencePointers,

  expectedClientSections,
  expectedAdvisorSections,
  hiddenClientSections,

  executionOrder,
  verificationOrder,
  contradictionPolicy,
  uncertaintyPolicy,
  timingPolicy,
  spiritualPolicy,

  plannerWarnings,
  plannerReason,
  confidence,
  requiresClarification,
  clarificationQuestion,
  needsOrenDecision,
}
```

**מקור השדות:** `readingDomain`/`method`/`spreadId`/`topicId`/`questionType`/`primaryIntent`/`confidence`/`requiresClarification`/`clarificationQuestion`/`needsOrenDecision` הם **echo מפורש** מהקלט/`intentResult`/`readingStrategy` (Traceability, Core Constitution §5) — לא מחושבים-מחדש. `strategyId`/`goal`/`contradictionPolicy`/`timingPolicy`/`spiritualPolicy` מגיעים ישירות מ-`readingStrategy`. שבע הקטגוריות (`primaryDecisionCategories` עד `unavailableCategories`) הן **תרגום** של `readingStrategy.strategyConstraints` + `availableRuleCategories` — ר' סעיף 5-6. `evidenceRequirements`/`sourceEvidencePointers` נגזרים מ-`strategyConstraints.requiresEvidence` + הקלט `sourceEvidencePointers`. `expectedClientSections`/`expectedAdvisorSections`/`hiddenClientSections` נגזרים מהקטגוריות + `advisorMode`/`clientMode`.

### הפרדת-Domains (חדש — מחייב)

- **החוזה הזה משותף לקלפים ולגורל החול** — אותו Output Contract, אותם 36 שדות, לכל `readingDomain`. אין חוזה-נפרד-לכל-domain.
- **כל Domain מקבל `Knowledge Context` נפרד.** `knowledgeContext`/`availableRuleCategories`/`sourceEvidencePointers` שסופקו עבור `readingDomain:'goralHachol'` שייכים אך-ורק לקריאה הזו — הם **לא** נשמרים/מועברים/מנוחשים עבור קריאת `readingDomain:'cards'` אחרת, ולהפך.
- **אסור לערבב חוקי קלפים עם Kashf/Hawi.** קטגוריה שנגזרה מ-`strategyConstraints` של קריאת-קלפים (למשל קטגוריה עתידית ספציפית-לקלפים) לא יכולה להופיע ב-`primaryDecisionCategories`/`forbiddenCategories`/וכו' של קריאת-`goralHachol`, ולהפך — Strict Method Separation (Core Constitution §6) חל **גם** בין ה-Domains עצמם, לא רק בין Kashf ל-Hawi בתוך `goralHachol`.
- **אסור להעביר Rule Categories בין Domains ללא Adapter וידע מאושר.** אם בעתיד יתגלה צורך-לגיטימי (למשל קטגוריה משותפת-מהותית לשני ה-domains) — זו החלטת-אינטגרציה נפרדת, לא ברירת-מחדל של Reading Planner.
- **Site Intelligence אינו משתמש ב-Reading Planner** — ר' סעיף 13 למטה (ללא שינוי-מהותי, רק חיזוק-החזרה כאן).

---

## 4. Execution Order

Reading Planner **חייב** להחזיר `executionOrder` מסודר. דוגמה עקרונית:

```js
executionOrder: ["primaryDecision", "verification", "conditional", "supporting", "advisorOnly"]
```

### כללי-ברזל

- **`forbidden` לעולם לא נכנס ל-`executionOrder`.**
- **`unavailable` לעולם לא נכנס ל-`executionOrder`.**
- **`advisorOnly` אינו client-visible** — מופיע ב-`executionOrder` (כי הוא בהחלט מבוצע/מחושב), אך אף פעם לא ב-`expectedClientSections`.
- **`conditional` נכנס רק עם `activationCondition` עתידי** — כלומר קטגוריה ב-`conditionalCategories` חייבת לשאת תנאי-הפעלה מפורש (למשל: "רק אם השאלה כללה גם בקשת-עיתוי"), לא הפעלה-סתמית.
- **`verification` אינו מחליף `primaryDecision`** — גם כש-`verificationPolicy==='always'`, שלב-האימות מגיע **אחרי** ההכרעה-העיקרית, לא במקומה. `executionOrder` משקף זאת סדרתית: `primaryDecision` תמיד לפני `verification`.

`verificationOrder` הוא שדה-נפרד (לא זהה ל-`executionOrder`) — מפרט את **סדר-הבדיקות-הפנימי** בתוך שלב-האימות עצמו (למשל: קודם `contradictionResolution`, אחר-כך שאר `requiresEvidence`), רלוונטי רק כש-`verificationCategories` אינו ריק.

---

## 5. Constraints Enforcement

Reading Planner חייב לכבד את `readingStrategy.strategyConstraints` (`mustInclude`/`mayInclude`/`mustExclude`/`advisorOnly`/`requiresEvidence`/`forbiddenWithoutQuestion`) — הוא **הצרכן הישיר הראשון** של המבנה הזה מאז שאושר ב-`HALL_WISDOM_READING_STRATEGY_BUILDER_COMPONENT_CONTRACT.md`. שישה כללי-אכיפה:

1. **מה שב-`mustExclude` לא יכול להיכנס ל-`primaryDecisionCategories`.** נאכף כ-invariant — הפרה = באג-ברכיב, לא מצב-חוקי.
2. **מה שב-`advisorOnly` לא יכול להיכנס ל-`expectedClientSections`.** זו האכיפה-בפועל של העיקרון שכבר תועד ב-Reading Strategy Builder ("קטגוריה ב-advisorOnly אינה client-visible") — כאן היא הופכת מ-constraint-מדיניות ל-partition-בפועל בין `expectedClientSections`/`expectedAdvisorSections`.
3. **מה שב-`forbiddenWithoutQuestion` לא ייכלל בלי אות מפורש מהשאלה.** "אות מפורש" = הקטגוריה כבר לא מופיעה ב-`forbiddenWithoutQuestion` בפועל (Reading Strategy Builder כבר הסיר אותה משם כשזוהה-כנשאלת — ר' הדוגמה `timingRequest` בסעיף 7 למטה). Reading Planner **לא בודק מחדש** אם נשאל — הוא סומך על ההחלטה שכבר התקבלה ב-Strategy.
4. **מה שב-`requiresEvidence` לא ייכלל בלי `evidenceRequirement` מתאים.** אם קטגוריה דורשת-evidence לפי ה-Strategy אך אין `sourceEvidencePointers` תואם בקלט — הקטגוריה **לא** נכנסת ל-`primaryDecisionCategories`/`verificationCategories` בלי `plannerWarning` מסוג `missingEvidence` (ר' סעיף 9).
5. **`mustInclude` חייב להופיע בתוכנית או ליצור `plannerWarning`.** אם קטגוריה ב-`mustInclude` לא זמינה בפועל (למשל מופיעה גם ב-`unavailableCategories` לפי `availableRuleCategories`) — Reading Planner **לא משמיט אותה בשקט**, הוא חייב `plannerWarning` מסוג `missingRequiredCategory`.
6. **קונפליקט בין constraints חייב לגרום ל-`needsOrenDecision` או `requiresClarification`.** למשל: קטגוריה שמופיעה גם ב-`mustInclude` (מה-Strategy) וגם ב-`unavailableCategories` (מה-`availableRuleCategories` שסופק) — זה קונפליקט אמיתי בין "מה שצריך" ל"מה שקיים", ולא ניתן לפתור אוטומטית. Reading Planner **אינו מכריע** איזה צד "מנצח" — הוא מדגיש את הקונפליקט ומעביר להחלטת-אורן, באותו עיקרון-שמרנות שכבר אומץ בשני הרכיבים הקודמים.

---

## 6. Rule Category Planning

**Reading Planner אינו בוחר Rule IDs סופיים.** הוא בוחר **קטגוריות בלבד**:

```
primaryDecision · verification · conditional · supporting · advisorOnly · forbidden · unavailable
```

**Rule Decision Engine העתידי (Roadmap שלב 5) הוא זה שיבחר Rule IDs בפועל** — מתוך הקטגוריות שה-Plan כבר סימן כרלוונטיות, על-בסיס Knowledge Memory/Registry האמיתיים. Reading Planner עוצר בגבול-הקטגוריה במכוון, בדיוק כפי ש-Reading Strategy Builder עוצר בגבול-המדיניות ולא בוחר קטגוריות-Rule-ID ישירות.

**מיפוי-בסיס (v1, עקבי עם `strategyConstraints`):**

| ReadingPlan category | נגזר מ- |
|---|---|
| `primaryDecisionCategories` | `strategyConstraints.mustInclude` |
| `supportingCategories` | `strategyConstraints.mayInclude` |
| `forbiddenCategories` | `strategyConstraints.mustExclude` |
| `advisorOnlyCategories` | `strategyConstraints.advisorOnly` |
| `verificationCategories` | נגזר מ-`verificationPolicy` (אם `!=='none'`) + `strategyConstraints.requiresEvidence` |
| `conditionalCategories` | קטגוריות בעלות `activationCondition` עתידי (למשל דרוש-אישור/דרוש-מידע-נוסף) — v1: ריק כברירת-מחדל, שמור למקרים עתידיים |
| `unavailableCategories` | נגזר מ-`availableRuleCategories` (אם סופק) — קטגוריות שה-Strategy ביקש אך אינן קיימות בפועל ל-method/topicId |

**הבהרה — Domain:** מיפוי-הבסיס למעלה זהה-במבנה לכל `readingDomain`, אך **תוכן-הקטגוריות עצמו תלוי-Domain** — קטגוריות `goralHachol` (`outcomeRules`, `hiddenThoughtRules`, וכו') שונות-לחלוטין מקטגוריות `cards` (עתידיות, לא-מוגדרות-סופית כאן). המיפוי נבדק-בפועל רק מול `goralHachol` (ר' 4 הדוגמאות הראשונות בסעיף 7) — מיפוי-`cards` המלא הוא עבודת-Cards-Adapter עתידית (Roadmap שלב 15), לא חלק מהחוזה הזה.

---

## 7. Example Plans

**5 דוגמאות.** דוגמאות 1-4 (`readingDomain:'goralHachol'`) בונות על הפלט **האמיתי, הבדוק** של `analyzeIntent()`/`buildReadingStrategy()` (208+238 assertions כבר מכסים אותם), ומרחיבות אותו ל-`ReadingPlan` עקרוני-לצורך-הדוגמה (עדיין לא ממומש בקוד). דוגמה 5 (`readingDomain:'cards'`) היא **illustrative-בלבד** — ר' הבהרה בתחילתה.

### דוגמה 1 — Prediction: "האם העסק החדש יצליח?" (readingDomain: goralHachol, method: hawi)

**Intent Result (מקוצר):** `{ primaryIntent: 'prediction', confidence: 1, requiresClarification: false }`
**Reading Strategy (מקוצר):** `{ strategyId: 'strat-prediction-businessSuccess', verificationPolicy: 'onlyOnContradiction', ... }`
**Strategy Constraints:**
```js
{ mustInclude: ['outcomeRules', 'businessRelevantRules'], mayInclude: ['verification'],
  mustExclude: ['hiddenThought', 'characterNature', 'timing', 'spiritual'],
  advisorOnly: ['technicalFormulaDetails'], requiresEvidence: ['contradictionResolution'],
  forbiddenWithoutQuestion: ['timing', 'spiritual'] }
```
**Reading Plan (מקוצר):**
```js
{
  planId: 'plan-prediction-businessSuccess', planVersion: 'reading-planner-v1',
  readingDomain: 'goralHachol', method: 'hawi', spreadId: null,
  questionType: 'businessSuccess', primaryIntent: 'prediction',
  strategyId: 'strat-prediction-businessSuccess', goal: 'שאלה מה צפוי לקרות — תוצאה עתידית קונקרטית.',
  primaryDecisionCategories: ['outcomeRules', 'businessRelevantRules'],
  verificationCategories: ['contradictionResolution'],
  conditionalCategories: [], supportingCategories: ['verification'],
  advisorOnlyCategories: ['technicalFormulaDetails'],
  forbiddenCategories: ['hiddenThought', 'characterNature', 'timing', 'spiritual'],
  unavailableCategories: [],
  executionOrder: ['primaryDecision', 'verification', 'supporting', 'advisorOnly'],
  expectedClientSections: ['outcomeRules', 'businessRelevantRules'],
  expectedAdvisorSections: ['outcomeRules', 'businessRelevantRules', 'technicalFormulaDetails'],
  hiddenClientSections: ['technicalFormulaDetails'],
  requiresClarification: false, needsOrenDecision: false,
  plannerWarnings: [],
  plannerReason: 'נבנתה תוכנית סביב outcomeRules/businessRelevantRules כקטגוריות-הכרעה-עיקריות, ללא verification מלא (onlyOnContradiction), עם technicalFormulaDetails ל-advisor בלבד; hiddenThought/characterNature/timing/spiritual אינם נכללים לפי mustExclude.',
}
```

### דוגמה 2 — Decision Support: "האם כדאי לי לפתוח עסק?" (readingDomain: goralHachol, method: hawi)

**Strategy Constraints:**
```js
{ mustInclude: ['outcomeRules', 'currentStateRules'], mayInclude: [],
  mustExclude: ['hiddenThought', 'characterNature', 'absoluteOutcomeClaims'],
  advisorOnly: ['technicalFormulaDetails'], requiresEvidence: ['contradictionResolution'],
  forbiddenWithoutQuestion: ['timing', 'spiritual'] }
```
**Reading Plan (מקוצר):**
```js
{
  planId: 'plan-decisionSupport-businessSuccess',
  readingDomain: 'goralHachol', method: 'hawi', spreadId: null,
  primaryDecisionCategories: ['outcomeRules', 'currentStateRules'],
  verificationCategories: [],  // verificationPolicy==='none' עבור decisionSupport
  conditionalCategories: [], supportingCategories: [],
  advisorOnlyCategories: ['technicalFormulaDetails'],
  forbiddenCategories: ['hiddenThought', 'characterNature', 'absoluteOutcomeClaims'],
  unavailableCategories: [],
  executionOrder: ['primaryDecision', 'advisorOnly'],
  expectedClientSections: ['outcomeRules', 'currentStateRules'],
  expectedAdvisorSections: ['outcomeRules', 'currentStateRules', 'technicalFormulaDetails'],
  hiddenClientSections: ['technicalFormulaDetails'],
  requiresClarification: false, needsOrenDecision: false,
  plannerWarnings: [],
  plannerReason: 'נבנתה תוכנית סביב outcomeRules/currentStateRules; אין verification (verificationPolicy=none); absoluteOutcomeClaims נאסר כדי למנוע ניסוח-החלטה כתחזית-מוחלטת.',
}
```

### דוגמה 3 — Hidden Thought: "מה הוא חושב עליי?" (readingDomain: goralHachol, method: kashf)

**Strategy Constraints:**
```js
{ mustInclude: ['hiddenThoughtRules'], mayInclude: [],
  mustExclude: ['timing', 'spiritual', 'unrelatedOutcomeRules'],
  advisorOnly: ['technicalFormulaDetails', 'dhamir'], requiresEvidence: ['contradictionResolution'],
  forbiddenWithoutQuestion: ['timing', 'spiritual'] }
```
**Reading Plan (מקוצר):**
```js
{
  planId: 'plan-hiddenThoughtIntent-hiddenThoughtIntent',
  readingDomain: 'goralHachol', method: 'kashf', spreadId: null,
  primaryDecisionCategories: ['hiddenThoughtRules'],
  verificationCategories: [],  // verificationPolicy==='none'
  conditionalCategories: [], supportingCategories: [],
  advisorOnlyCategories: ['technicalFormulaDetails', 'dhamir'],
  forbiddenCategories: ['timing', 'spiritual', 'unrelatedOutcomeRules'],
  unavailableCategories: [],
  executionOrder: ['primaryDecision', 'advisorOnly'],
  expectedClientSections: ['hiddenThoughtRules'],
  expectedAdvisorSections: ['hiddenThoughtRules', 'technicalFormulaDetails', 'dhamir'],
  hiddenClientSections: ['technicalFormulaDetails', 'dhamir'],
  requiresClarification: false, needsOrenDecision: false,
  plannerWarnings: [],
  plannerReason: 'נבנתה תוכנית סביב hiddenThoughtRules בלבד; dhamir ו-technicalFormulaDetails מסומנים advisor-only ואינם נכנסים ל-expectedClientSections; timing/spiritual/unrelatedOutcomeRules נאסרים.',
}
```
**הערה:** זו הדוגמה שממחישה הכי-ברור את כלל 2 (סעיף 5) — `dhamir` נמצא ב-`advisorOnlyCategories` ולכן **חייב** להופיע ב-`hiddenClientSections`, לא ב-`expectedClientSections`.

### דוגמה 4 — Timing: "מתי העסק יתחיל להרוויח?" (readingDomain: goralHachol, method: hawi)

**Strategy Constraints:**
```js
{ mustInclude: ['timingRules', 'outcomeRules'], mayInclude: [],
  mustExclude: ['hiddenThought', 'characterNature', 'spiritual'],
  advisorOnly: ['technicalFormulaDetails'], requiresEvidence: ['contradictionResolution'],
  forbiddenWithoutQuestion: ['spiritual'] }
```
**Reading Plan (מקוצר):**
```js
{
  planId: 'plan-timingRequest-businessSuccess',
  readingDomain: 'goralHachol', method: 'hawi', spreadId: null,
  primaryDecisionCategories: ['timingRules', 'outcomeRules'],
  verificationCategories: [],  // verificationPolicy==='none'
  conditionalCategories: [], supportingCategories: [],
  advisorOnlyCategories: ['technicalFormulaDetails'],
  forbiddenCategories: ['hiddenThought', 'characterNature', 'spiritual'],
  unavailableCategories: [],
  executionOrder: ['primaryDecision', 'advisorOnly'],
  expectedClientSections: ['timingRules', 'outcomeRules'],
  expectedAdvisorSections: ['timingRules', 'outcomeRules', 'technicalFormulaDetails'],
  hiddenClientSections: ['technicalFormulaDetails'],
  requiresClarification: false, needsOrenDecision: false,
  plannerWarnings: [],
  plannerReason: 'נבנתה תוכנית סביב timingRules/outcomeRules; spiritual עדיין נאסר-בלי-שאלה, אך timing עצמו כבר לא ב-forbiddenWithoutQuestion (נשאל במפורש), ולכן נכנס ל-primaryDecisionCategories כרגיל.',
}
```
**הערה:** זו הדוגמה שממחישה את ההבדל בין דוגמה 1 (`timing` אסור, לא נשאל) לדוגמה 4 (`timing` מותר, כן נשאל) — אותה קטגוריה, מדיניות הפוכה, לפי מה שכבר קבע Reading Strategy Builder.

### דוגמה 5 — Cards: "האם הקשר הזה יכול להתפתח?" (readingDomain: cards, method: cartomancy)

**⚠️ זו דוגמת-Contract בלבד — ממחישה את מבנה ה-Reading Plan עבור Domain אחר, ללא המצאת חוקי-קלפים או פירושים חדשים.** hall-of-wisdom עדיין לא מחזיק Intent Analyzer/Reading Strategy Builder אמיתיים עבור קלפים (הם קיימים ונבדקו רק עבור `goralHachol` — 208+238 assertions) — לכן `Intent Result`/`Reading Strategy` כאן הם **המחשה-מבנית-בלבד** (illustrative), לא פלט-אמיתי-נבדק כמו בדוגמאות 1-4. שם ה-`method` (`'cartomancy'`) ו-`spreadId` (`'three'`) הם הערכים-הרשמיים-היחידים שאומתו מול הקוד הקיים (`cartomancy/ui/cards-app.js`) — שאר-התוכן (Intent/Strategy/קטגוריות) הוא שלד-מבנה-בלבד.

**Intent Result (מקוצר, illustrative):** `{ primaryIntent: 'compatibility', confidence: 0.8, requiresClarification: false }`
**Reading Strategy (מקוצר, illustrative):** `{ strategyId: 'strat-compatibility-loveRelationship', verificationPolicy: 'onlyOnContradiction', ... }`
**Strategy Constraints (illustrative — שמות-קטגוריה עקרוניים-בלבד, לא ידע-קלפים אמיתי):**
```js
{ mustInclude: ['cardMeaningRules'], mayInclude: ['verification'],
  mustExclude: ['hiddenThought'], advisorOnly: ['technicalSpreadDetails'],
  requiresEvidence: ['contradictionResolution'], forbiddenWithoutQuestion: ['timing'] }
```
**Reading Plan (מקוצר):**
```js
{
  planId: 'plan-compatibility-loveRelationship-cards', planVersion: 'reading-planner-v1',
  readingDomain: 'cards', method: 'cartomancy', spreadId: 'three',
  questionType: 'loveRelationship', primaryIntent: 'compatibility',
  strategyId: 'strat-compatibility-loveRelationship', goal: '(illustrative) בירור-התאמה בין שני צדדים.',
  primaryDecisionCategories: ['cardMeaningRules'],
  verificationCategories: ['contradictionResolution'],
  conditionalCategories: [], supportingCategories: ['verification'],
  advisorOnlyCategories: ['technicalSpreadDetails'],
  forbiddenCategories: ['hiddenThought'],
  unavailableCategories: [],
  executionOrder: ['primaryDecision', 'verification', 'supporting', 'advisorOnly'],
  expectedClientSections: ['cardMeaningRules'],
  expectedAdvisorSections: ['cardMeaningRules', 'technicalSpreadDetails'],
  hiddenClientSections: ['technicalSpreadDetails'],
  requiresClarification: false, needsOrenDecision: false,
  plannerWarnings: [],
  plannerReason: '(illustrative) נבנתה תוכנית סביב cardMeaningRules כקטגוריית-הכרעה-עיקרית עבור פריסת-three-קלפים; technicalSpreadDetails ל-advisor בלבד; hiddenThought נאסר.',
}
```
**הבהרה:** אותו Output Contract בדיוק (36 שדות) כמו דוגמאות 1-4 — **אין חוזה-נפרד לקלפים**. ה-`Knowledge Context`/`strategyConstraints` של הדוגמה הזו שייכים אך-ורק ל-`readingDomain:'cards'` — לעולם לא יעורבבו עם קטגוריות-`goralHachol` (`outcomeRules`/`hiddenThoughtRules`/וכו') מדוגמאות 1-4, בדיוק כפי שנקבע ב"הפרדת-Domains" (סעיף 3 למעלה).

---

## 8. Planner Reason

`plannerReason` — הסבר דטרמיניסטי קצר, באותו עיקרון שכבר אומץ ב-`decisionReason` (Intent Analyzer) וב-`strategyReason` (Reading Strategy Builder): **לא chain-of-thought, לא reasoning של AI, לא מידע אישי.** נבנה אך ורק מעובדות שכבר חושבו (הקטגוריות שנכנסו/הוצאו, ה-constraints שהופעלו, האם חסר evidence).

**חייב לכלול:**
- למה נבחר סדר-ההפעלה (`executionOrder`).
- למה קטגוריות מסוימות נכללו.
- למה אחרות הוצאו.
- אילו `strategyConstraints` הופעלו בפועל.
- האם חסר evidence.

ר' 4 הדוגמאות בסעיף 7 למעלה — כל אחת מדגימה `plannerReason` עקבי לתוכן ה-Plan עצמו.

---

## 9. Planner Warnings

### סוגי-Warning

`missingRequiredCategory` · `conflictingConstraints` · `missingEvidence` · `unsupportedTopic` · `unavailableForMethod` · `clarificationRequired` · `advisorOnlyLeakRisk` · `forbiddenCategoryRequested` · `ambiguousPlan` · `missingInput`

### מבנה כל Warning

```js
{
  warningType,        // אחד מ-10 הסוגים למעלה
  severity,            // 'low' | 'medium' | 'high' (ר' CONFIDENCE_VALUES/SEVERITY_VALUES הקיימים ב-reading-intelligence-types.js)
  message,              // הסבר קצר, דטרמיניסטי, בעברית
  affectedCategory,      // string, הקטגוריה-הרלוונטית (אם יש)
  needsOrenDecision,      // boolean
}
```

**כלל-חובה:** `advisorOnlyLeakRisk` ו-`conflictingConstraints` **תמיד** נושאים `needsOrenDecision: true` — אלה לא warnings-אינפורמטיביים-בלבד, הם מצבים שדורשים החלטת-אדם לפני שהתוכנית תיחשב-בטוחה-לביצוע.

---

## 10. Validators עתידיים

**כללים כלליים:**

- `planId` קיים ולא-ריק.
- `planVersion` קיים ולא-ריק.
- `method` חוקי **ותואם ל-`readingDomain`** (`goralHachol`→`kashf`/`hawi`; `cards`→`cartomancy`).
- `primaryIntent` חוקי (אחד מ-12 ה-intents או `UNKNOWN_INTENT_ID`).
- `strategyId` קיים ולא-ריק.
- `executionOrder` אינו ריק (למעט מקרה-עמימות מלא, שם הוא ריק במפורש).
- `forbidden`/`unavailable` **לעולם** לא מופיעים ב-`executionOrder`.
- `advisorOnly` **לעולם** לא מופיע ב-`expectedClientSections`.
- אין כפילויות בין ה-7 category arrays (כל קטגוריה שייכת בדיוק-לקטגוריה-בקשה אחת, לא לשתיים בו-זמנית — ר' גם הכלל הבא).
- אין קטגוריה שמופיעה גם ב-required (`primaryDecisionCategories`) וגם ב-`forbiddenCategories`.
- `requiresClarification === true` מחייב `clarificationQuestion` לא-ריק.
- `question` חייב להיות string לא-ריק (עודכן — כעת שדה-חובה, ר' סעיף 2).
- אין להעתיק את `question` לתוך `plannerReason`.
- אין לכלול `question` (או תוכן דומה — טלפון/`clientHistory`/dynFields) בתוך `plannerReason`/`plannerWarnings`/כל שדה-פלט אחר מלבד `question` עצמו.
- אין להפיץ את `question` מעבר לרכיבים שזקוקים-לו-בפועל (Reading Planner בלבד, בשלב הזה — לא Rule Decision Engine/Engine Execution Coordinator, שאינם צריכים את הטקסט-הגולמי).
- `plannerReason` אינו ריק.
- `confidence` בין 0 ל-1.
- `sourceEvidence`/`evidenceRequirements` נדרשים לקטגוריה שסומנה כ-`requiresEvidence` בחוזה — אם לא סופקו, מייצר `plannerWarning` מסוג `missingEvidence`, לא כשל-שקט.
- `warning.severity` חוקי (`'low'`/`'medium'`/`'high'`).
- אין מידע אישי בשום שדה מלבד `question` (ר' סעיף 2).
- אין ייבוא מ-`goral-hachol/engine/`.
- אין `fetch`/AI.

**כללי-Domain (חדש):**

1. `readingDomain` חייב להיות חוקי (`'goralHachol'`/`'cards'`).
2. `readingDomain==='goralHachol'` מאפשר **רק** `method` של Kashf/Hawi.
3. `readingDomain==='cards'` מאפשר **רק** `method` הרשמי של קלפים (`'cartomancy'`).
4. `method` שאינו-מתאים ל-`readingDomain` הנתון — נדחה (קלט לא-חוקי, לא מטופל-בשקט).
5. `spreadId` אינו גורם ל-Reading Planner לבחור פריסה — הוא נקרא-כ-context בלבד, לעולם לא נכתב/משתנה על-ידי הרכיב.
6. `knowledgeContext` (אם סופק) חייב להתאים ל-`readingDomain` — נבדק מבנית (למשל: לא מכיל קטגוריה מוכרת-כ-`goralHachol`-בלבד כש-`readingDomain==='cards'`, ולהפך).
7. `sourceEvidencePointers` של Domain אחד אינו משמש Domain אחר — Reading Planner לא "משאיל" evidence-pointer שסופק לקריאת-`cards` כדי למלא דרישת-evidence של קריאת-`goralHachol`, ולהפך, גם אם מבנית הם נראים תואמים.

---

## 11. גבולות אחריות

| Reading Planner — **כן** | Reading Planner — **לא** |
|---|---|
| מתרגם Strategy לתוכנית ביצוע — משותף לכל `readingDomain` (`goralHachol`/`cards`) | לא בוחר Rule IDs |
| מסדר קטגוריות לפי סדר (`executionOrder`) | לא מפעיל Kashf/Hawi/Cards |
| מגדיר client/advisor visibility | לא בונה לוח (goralHachol) ולא בוחר/מציג פריסה (cards) |
| מגדיר evidence requirements | לא מחשב תשובה |
| מזהה קונפליקטים וחוסרים (כולל בין-Domain) | לא בונה Narrative |
| מחזיר warnings | לא מבצע Audit |
| | לא מחליט במקום אורן |
| | לא מפעיל AI |
| | לא מערבב קטגוריות/ידע בין `readingDomain`-ים |

---

## 12. קשר לרכיבים הבאים

```
Intent Analyzer
↓
Reading Strategy Builder
↓
Knowledge Decision Pipeline
↓
Reading Planner
↓
Rule Decision Engine
↓
Engine Execution Coordinator
```

**Reading Planner צורך את Knowledge Decision Pipeline Output** (מ-Knowledge Memory/Matrix/Registry — פירוט ב-`HALL_WISDOM_CORE_ARCHITECTURE.md` חלק יא), **אך לא מחליף את Rule Decision Engine.** ה-Plan שהוא מייצר הוא קלט ל-Rule Decision Engine — לא הכרעה-סופית-לכל-חוק. גבול-האחריות זהה בעיקרון לגבול שכבר נקבע בין Reading Strategy Builder ל-Reading Planner עצמו: כל רכיב מצמצם את מרחב-האפשרויות לרכיב-הבא, אף רכיב לא "קופץ קדימה" ומבצע את תפקיד-הבא.

---

## 13. Site Intelligence

**Reading Planner שייך רק ל-Reading Intelligence** (`HALL_WISDOM_CORE_ARCHITECTURE.md`, חלק יד) — עבור שני ה-`readingDomain` המוגדרים בלבד (`'goralHachol'` = scope `reading.goralHachol`, `'cards'` = scope `reading.cards`, חלק טו, AI Usage Boundary). **הוא לא משמש את Site Intelligence** — אין לו שום תפקיד בבדיקות-תחזוקה/QA-של-האתר/Cost & Usage Intelligence. Domain נפרד-לחלוטין, כפי שכבר תועד. **חיזוק (עודכן):** גם בתוך Reading Intelligence עצמה, שני ה-`readingDomain` נשארים מופרדים — Reading Planner **הוא** הרכיב-המשותף (חוזה אחד, כפי שתוקן בסבב הזה), אך **התוכן** (קטגוריות/ידע/evidence) שהוא מעבד תמיד נשאר ספציפי-ל-domain-אחד-בכל-קריאה, לעולם לא מעורבב.

---

## סיכום היקף המסמך הזה

✅ הוגדר חוזה מלא ל-Reading Planner: מטרה, Input Contract (כולל `readingDomain`/`spreadId`, `question` כחובה), Output Contract (36 שדות), Execution Order, Constraints Enforcement (6 כללים), Rule Category Planning, **5 דוגמאות מלאות (4 goralHachol + 1 cards)**, Planner Reason, Planner Warnings (10 סוגים), Validators עתידיים (כולל 7 כללי-Domain חדשים), גבולות-אחריות, קשר-לרכיבים-הבאים, שיוך ל-Reading Intelligence עם הפרדת-Domains מפורשת.

**עודכן בסבב הזה (שני תיקונים לפני-קוד):** (1) `readingDomain` נוסף — Reading Planner הוא כעת רכיב-משותף מוצהר ל-`goralHachol` ו-`cards`, `method:'cartomancy'` אומת מול הקוד הקיים (לא הומצא). (2) הסתירה סביב `question` תוקנה — כעת שדה-חובה עקבי בכל המסמך.

❌ שום קוד. שום תיקייה חדשה. שום קובץ `.js`/`.mjs`. שום test. שום שינוי-מנועים/QA/UI/קלפים/Supabase. שום AI. שום commit. שום push עדיין (ימתין לאישור נפרד לפני מימוש בפועל, כרגיל).
