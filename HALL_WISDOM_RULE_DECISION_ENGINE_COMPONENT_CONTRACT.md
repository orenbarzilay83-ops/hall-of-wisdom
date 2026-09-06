# HALL_WISDOM_RULE_DECISION_ENGINE_COMPONENT_CONTRACT.md

> **מסמך-חוזה בלבד. אין קוד. אין תיקיות חדשות. אין JS. אין Tests.**
> תאריך: 2026-07-13. ענף: `claude/app-cleanup-organization-mia9b2`.
> מטרת המסמך: להגדיר את חוזה הרכיב הבא ב-Roadmap (`HALL_WISDOM_CORE_ARCHITECTURE.md`, חלק יב, שלב 5 מתוך 16; `HALL_WISDOM_DECISION_PIPELINE_INTEGRATION_CONTRACT.md`, Handoff D→E) — **Rule Decision Engine** — לפני שמתחיל מימוש בפועל.

---

## 1. הבחנה מחייבת

**`Rule Definition`** = חוק קיים מתוך מקור מאושר או Knowledge Repository (`HALL_WISDOM_DECISION_PIPELINE_INTEGRATION_CONTRACT.md`, חלק יז). זהו ה"מה" — עובדה-על-המקור, קיימת-מראש, לא-נגזרת-מקריאה-ספציפית.

**`Rule Decision`** = החלטה **עבור קריאה מסוימת** אם להפעיל, לאפשר, להתנות, להסתיר, לאסור, או לסמן-כחסר את אותו `Rule Definition`. זהו ה"האם-והיכן", ספציפי-לקריאה, לא-קבוע-מראש.

### Rule Decision Engine:

- **אינו ממציא** `Rule Definition`.
- **אינו משנה** `Rule Definition`.
- **אינו יוצר** חוק חדש.
- **אינו מפרש** מקור מחדש.
- **אינו מעביר** חוק בין Domains או Methods.
- **אינו מחליט ללא `sourceEvidence`** כאשר נדרש.

---

## 2. מטרת הרכיב

Rule Decision Engine מקבל `Shared Envelope` + `Reading Plan` + `Knowledge Decision Pipeline Output` + `Rule Definitions` זמינים + `Strategy Constraints` + `Source Evidence` + `Method`/`Domain` + `Topic`/`Question Type`/`Intent`, ומחזיר: החלטה מסודרת לכל `Rule Definition` רלוונטי, `selectedRuleIds`/`rejectedRuleIds`/`conditionalRuleIds`/`advisorOnlyRuleIds`/`unavailableRuleIds`, `executionInstructions`, ו-`warnings`/`errors`/`needsOrenDecision`.

**הוא אינו מפעיל מנועים. הוא אינו מחשב תוצאה. הוא אינו בונה Narrative. הוא אינו מבצע Audit. הוא אינו מפעיל AI.**

זהו הרכיב הראשון בשרשרת שבו נבחרים **Rule IDs סופיים** — לא רק קטגוריות (כפי שכבר תועד ב-`HALL_WISDOM_READING_PLANNER_COMPONENT_CONTRACT.md` §6: "Reading Planner אינו בוחר Rule IDs סופיים... Rule Decision Engine העתידי הוא זה שיבחר Rule IDs בפועל").

---

## 3. Input Contract

```js
{
  pipelineRunId,
  readingDomain,
  method,
  spreadId,
  topicId,
  questionType,
  primaryIntent,
  readingPlan,
  strategyConstraints,
  knowledgeContext,
  ruleDefinitions,
  availableInputs,
  sourceEvidencePointers,
  advisorMode,
  clientMode,
}
```

### שדות חובה

`pipelineRunId`, `readingDomain`, `method`, `topicId`/`questionType`/`primaryIntent` (echo מ-`readingPlan`, לא-מחושבים-מחדש), `readingPlan` (עובר `validatePlannerResult`), `ruleDefinitions` (מערך, גם-אם-ריק — ריקנות היא מצב-חוקי-לבדיקה, לא שגיאת-קלט).

### שדות אופציונליים

`spreadId`, `strategyConstraints` (echo מ-`readingPlan` אם לא-סופק-ישירות), `knowledgeContext`, `availableInputs`, `sourceEvidencePointers`, `advisorMode`, `clientMode`.

### מה קורה אם `readingPlan` נעצר

אם `readingPlan.stopped === true` (Stop Result מ-Reading Planner) — Rule Decision Engine **אינו רץ כלל**. הוא מחזיר Stop Result משלו-הלאה (`stopComponent:'ruleDecisionEngine'`, `stopReason` מציין שהעצירה-ירשה-מ-Reading Planner) — **לא מנסה להכריע** על בסיס תוכנית-שלא-נבנתה.

### מה קורה אם אין `Rule Definitions`

מערך-`ruleDefinitions` ריק (או שאין-אף-`Rule Definition`-שתואם-ל-`readingDomain`/`method`/`topicId` הנתונים) → `plannerWarning: noPrimaryDecisionPath` (ר' חלק יב) + Stop Result אם `readingPlan.primaryDecisionCategories` אינו-ריק (כלומר: התוכנית ציפתה-להכרעה-עיקרית, אך אין-חוק-זמין-כלל למלא-אותה) — זהו מקרה-`missing approved source` ברמת-כל-הקריאה, לא רק חוק-בודד.

### מה קורה אם Domain/Method אינם תואמים

קלט-לא-חוקי, נדחה (ר' חלק ח — Domain Separation) — **לא** מטופל כ-warning, כ-Stop, או-אפילו-מגיע-לשלב-ההכרעה: זהו כשל-חוזה-בין-הרכיבים (כמו ב-Reading Planner ו-Reading Strategy Builder), נתפס ב-validator.

### מה קורה אם מקור חסר

`Rule Definition` בודד ללא `sourceEvidence` תקף → אינו-יכול-להיות `required`/`allowed` (ר' חלק יד, Source Fidelity) — מסומן `unavailable` **או** `needsOrenDecision:true`, לפי מה שהחוזה-לרכיב-הזה קובע (ר' חלק ז, סעיף 2): ברירת-המחדל היא `unavailable` (שמרני), אלא-אם ה-`Rule Definition` עצמו מסומן `status` שמצביע-על-כך-שהמקור-ידוע-אך-שנוי-במחלוקת (ואז `needsOrenDecision:true` במקום).

### מה קורה אם `Rule Definition` עמום

`Rule Definition` שאינו-עובר `validateRuleDefinition` (למשל `ruleCategory` לא-מוכר, `activationConditions` סותרים) → מוצא-כליל-מהכרעה, מדווח כ-warning `ambiguousApplicability`, **לא** נכלל באף אחד מ-6 מערכי-ה-decision.

---

## 4. Rule Definition Contract

```js
{
  ruleId,
  ruleVersion,
  readingDomain,
  method,
  sourceId,
  sourceEvidence,
  topicIds,
  questionTypes,
  intents,
  ruleCategory,
  rulePurpose,
  requiredInputs,
  activationConditions,
  clientVisibility,
  conflictsWith,
  verifies,
  supplements,
  confidence,
  status,
  needsOrenDecision,
}
```

**`ruleCategory` חייב להשתמש רק בקטגוריות-הידע-המאושרות** — אותו קטלוג-קטגוריות שכבר נקבע ב-`reading-strategy-types.js::STRATEGY_CONSTRAINT_CATEGORIES`/`CATEGORY_DOMAINS` (goralHachol-בלעדיות, cards-בלעדיות, ומשותפות) — Rule Decision Engine **אינו מגדיר קטלוג-קטגוריות-חדש-משלו**, הוא צורך את זה שכבר אושר וממומש.

**`Rule Definition` חייב להיות traceable למקור** — `sourceId`+`sourceEvidence` הם שדות-חובה-מהותיים (לא רק-מבניים): Rule Definition בלי-מקור-מזוהה הוא **קלט לא-חוקי**, לא רק "חוק-חלש".

---

## 5. Rule Decision Contract

```js
{
  ruleId,
  ruleVersion,
  decision,
  decisionReason,
  sourceEvidence,
  matchedConditions,
  missingConditions,
  requiredInputs,
  missingInputs,
  activationCondition,
  clientVisibility,
  executionPriority,
  conflicts,
  confidence,
  warningIds,
  needsOrenDecision,
}
```

**`decision` חייב להיות אחד-בלבד** מתוך אוצר-המילים הרשמי (זהה ל-`RULE_DECISION_VALUES` הקיים כבר ב-`reading-intelligence-types.js`, ולא סתם-דומה-לו — **אותו קבוע בדיוק**, שימוש-חוזר, לא הגדרה-מקבילה):

```
required · allowed · conditional · advisorOnly · forbidden · unavailable
```

**אסור: `notAvailable`, `selected`, `rejected`, `active`, `inactive`, או כל vocabulary-מקביל-אחר.** זהו אותו איסור-מפורש שכבר נאכף ב-Reading Planner (`HALL_WISDOM_READING_PLANNER_COMPONENT_CONTRACT.md` §5) — מורחב-כאן במפורש-גם-ל-4 המילים-הנוספות שמישהו עלול-לנסות-להשתמש-בהן (`selected`/`rejected`/`active`/`inactive`).

**מקור-האמת ל-`decisionReason`:** אותו עיקרון-בנייה שכבר אומץ ב-`decisionReason`/`strategyReason`/`plannerReason` — תבנית-דטרמיניסטית, לא chain-of-thought, לא AI, לא מידע-אישי (ר' חלק טו).

---

## 6. Decision Order

**סדר-הכרעה מחייב לכל `Rule Definition` — 14 שלבים, אסור לדלג על שלב:**

1. האם ה-`Rule Definition` קיים ותקין?
2. האם `readingDomain` מתאים?
3. האם `method` מתאים?
4. האם `sourceEvidence` קיים?
5. האם `topicId` מתאים?
6. האם `questionType` מתאים?
7. האם `primaryIntent` מתאים?
8. האם `Reading Plan` מאפשר את הקטגוריה?
9. האם `Strategy Constraints` אוסרים אותה?
10. האם `requiredInputs` קיימים?
11. האם `activationConditions` מתקיימים?
12. האם החוק `advisorOnly`?
13. האם קיימת סתירה עם `Rule` אחר?
14. האם נדרשת החלטת-אורן?

כל שלב עוצר-מוקדם-ברגע-שיש-תשובה-חד-משמעית (למשל: כישלון-בשלב-2 [domain mismatch] קובע `unavailable` **מיידית**, לא ממשיך לבדוק activationConditions) — עקבי עם עקרון-הקדימויות בחלק ז.

---

## 7. Decision Precedence

**קדימויות ברורות — כל שורה גוברת על השורות-שמתחתיה:**

1. **Domain/Method mismatch** → `unavailable`
2. **Missing approved source** → `unavailable` **או** `needsOrenDecision` (ר' חלק ג, "מה קורה אם מקור חסר")
3. **`mustExclude`/forbidden category** → `forbidden`
4. **`advisorOnly` visibility** → `advisorOnly`
5. **Missing activation condition** → `conditional`
6. **Missing required input** → `conditional` **או** `unavailable` (לפי אם ניתן-להשלים-את-הקלט — אם `missingInputs` יכולים-להתמלא-בהמשך-הריצה, `conditional`; אם-לא, `unavailable`)
7. **Primary decision required by plan** → `required`
8. **Optional/supporting rule** → `allowed`

**כללי-ברזל:**
- **אין לאפשר ש-`allowed` יעקוף `forbidden`.**
- **אין לאפשר `required` יעקוף `domain mismatch`.**
- **אין לאפשר `advisorOnly` להפוך client-visible.**

---

## 8. Domain Separation

```
readingDomain: goralHachol | cards
method:        kashf | hawi | cartomancy
```

**כללים:**
- **`Rule Definition` של Cards לא נבחן בקריאת Goral HaChol.**
- **`Rule Definition` של Kashf לא נבחן בחאווי.**
- **`Rule Definition` של Hawi לא נבחן ב-Kashf.**
- **אין Source Evidence משותף בין Domains ללא Adapter מפורש.**
- **`spreadId` הוא context בלבד ואינו מקור ליצירת Rule.**
- **`Rule IDs` חייבים להיות namespaced לפי Domain/Method:**

```
goral.kashf.*
goral.hawi.*
cards.cartomancy.*
```

**⚠️ אל לשנות Rule IDs קיימים בשלב החוזה — רק להגדיר מדיניות עתידית.** אין כרגע `Rule Definitions` אמיתיים-מיושמים בקוד; ה-namespacing הזה הוא הסכם-שמות-עתידי, לא מיגרציה-לקוד-קיים.

---

## 9. Conflict Handling

### סוגי-קונפליקט

`directContradiction` · `sourceConflict` · `applicabilityConflict` · `visibilityConflict` · `executionOrderConflict` · `missingEvidenceConflict` · `crossDomainConflict`

### מבנה כל Conflict

```js
{
  conflictType,
  ruleIds,
  severity,
  description,
  recoverable,
  needsOrenDecision,
}
```

### כללים

- **Conflict אינו נפתר לפי סדר-מערך.**
- **Conflict אינו נפתר לפי `confidence` בלבד.**
- **Conflict בין מקורות דורש source review** (אנושי, לא-אוטומטי).
- **Conflict מקצועי עמום דורש `needsOrenDecision:true`.**
- **Rule Decision Engine אינו משנה את המקור כדי לפתור conflict** — זהה-בעקרון לכלל שכבר נקבע ב-Reading Planner (§5, כלל 6: "אינו מכריע איזה צד מנצח") ומורחב-כאן ל-conflict-בין-Rule-Definitions.

---

## 10. Execution Instructions

הפלט ל-Engine Execution Coordinator (`HALL_WISDOM_DECISION_PIPELINE_INTEGRATION_CONTRACT.md`, Handoff E):

```js
{
  selectedRuleIds,
  conditionalRuleIds,
  advisorOnlyRuleIds,
  skippedRuleIds,
  unavailableRuleIds,
  executionOrder,
  executionGroups,
  requiredInputs,
  missingInputs,
  stopConditions,
  evidenceRequirements,
}
```

**הבהרות:**
- **`selectedRuleIds` כולל `required` + `allowed` שהופעלו.**
- **`conditionalRuleIds` לא מופעלים עד שה-`condition` מתקיים** — Engine Execution Coordinator (לא Rule Decision Engine) הוא זה שבודק-בפועל-בזמן-ריצה אם ה-condition התקיים.
- **`advisorOnlyRuleIds` יכולים להתבצע אך לא להופיע ללקוח.**
- **`forbidden`/`unavailable` לעולם אינם נשלחים לביצוע.**
- **`executionOrder` נשען על `Reading Plan`** — לא נבנה-מחדש, echo+refinement של `readingPlan.executionOrder` (ר' `HALL_WISDOM_READING_PLANNER_COMPONENT_CONTRACT.md` §4).
- **`Verification` אינו מחליף `Primary Decision`** — אותו עיקרון שכבר נקבע ב-Reading Planner, חוזר-כאן ברמת-Rule-IDs-בפועל.

---

## 11. Stop Conditions

Rule Decision Engine רשאי לעצור אם:

- אין `Rule Definition` תקין למסלול-נדרש.
- אין מקור-מאושר לחוק-נדרש.
- אין primary decision path.
- יש cross-domain contamination.
- יש conflict מקצועי בלתי-פתור.
- חסר input קריטי שאי-אפשר-להשלים.
- `Reading Plan` עצמו לא-תקין.

### Stop Result

```js
{
  stopped: true,
  stopComponent: 'ruleDecisionEngine',
  stopReason,
  recoverable,
  missingInputs,
  conflictingRuleIds,
  clarificationQuestion: null,
  needsOrenDecision,
}
```

**Rule Decision Engine אינו מנסח `clarificationQuestion` חדש** — `clarificationQuestion: null` תמיד. אם נדרשת הבהרה, **הוא מחזיר את הבקשה ל-Reading Planner או Intent Analyzer** (עקבי-לחלוטין עם Clarification Policy הקיים ב-`HALL_WISDOM_DECISION_PIPELINE_INTEGRATION_CONTRACT.md` חלק ז: "רק שלושת הרכיבים... Rule Decision Engine ומטה אינם מנסחים-מחדש את שאלת-המשתמש").

---

## 12. Warnings and Errors

### סוגי-Warning

`missingSourceEvidence` · `unsupportedRuleForMethod` · `forbiddenRuleRequested` · `advisorOnlyLeakRisk` · `missingRequiredInput` · `unmetActivationCondition` · `ambiguousApplicability` · `ruleConflict` · `noVerificationPath` · `noPrimaryDecisionPath` · `crossDomainRule` · `deprecatedRule` · `lowConfidenceRule`

### מבנה כל Warning

```js
{
  warningId,
  warningType,
  severity,
  ruleId,
  message,
  recoverable,
  needsOrenDecision,
}
```

**`severity`:** `info` · `warning` · `error` · `critical` — **זהה-בדיוק** ל-`WARNING_SEVERITY_VALUES` שכבר הוגדר ב-Reading Planner (`reading-planner-types.js`), לא vocabulary-מקביל-חדש.

---

## 13. Client Visibility

```
clientVisibility: client | advisorOnly | hiddenUnlessRequested | hidden
```

**כללים:**
- **`advisorOnly` לעולם לא client-visible.**
- **`hiddenUnlessRequested` דורש Intent/Question signal מפורש** — כלומר: קטגוריה-מה-סוג-הזה נחשפת-ללקוח **רק** אם ה-`primaryIntent`/`secondaryIntents` בפועל מצביעים-על-בקשה-מפורשת (אותו-עיקרון-בדיוק כמו `forbiddenWithoutQuestion` ב-Reading Strategy Builder — "אות מפורש" נגזר-מ-Intent-שכבר-חושב, לא מניתוח-מחדש).
- **`hidden` אינו מופיע ללקוח** (ולא-אמור-אפילו-להיחשף-ליועץ כברירת-מחדל — שונה מ-`advisorOnly`, שמור-לשימושים-פנימיים-בלבד כמו diagnostics).
- **Rule Decision Engine אינו מנסח Client Narrative — הוא רק מגדיר visibility metadata.**

---

## 14. Source Fidelity

כל `Decision` חייב לשמור: `sourceId`, `sourceEvidence`, `ruleVersion`, `decisionReason`, `confidence`.

**אם אין `sourceEvidence`:**
- **אין לסמן Rule כ-`required`.**
- **אין לסמן Rule כ-`allowed` לביצוע מקצועי.**
- **יש לסמן `unavailable` או `needsOrenDecision`.**

**AI אינו רשאי להשלים מקור חסר** — הרחבה-ישירה של Core Constitution §1 (Source Before AI, `HALL_WISDOM_CORE_ARCHITECTURE.md` חלק ב) ושל העיקרון החדש בחלק טז ("AI is an Assistant... אינו מחליף את הספרים").

---

## 15. Output Contract

```js
{
  engineVersion,
  readingDomain,
  method,
  topicId,
  questionType,
  primaryIntent,

  ruleDecisionRecords,

  selectedRuleIds,
  rejectedRuleIds,
  conditionalRuleIds,
  advisorOnlyRuleIds,
  forbiddenRuleIds,
  unavailableRuleIds,

  executionInstructions,
  conflicts,
  warnings,
  errors,

  sourceEvidencePointers,
  decisionSummary,
  confidence,
  stopped,
  stopReason,
  needsOrenDecision,
}
```

**`decisionSummary`:** הסבר דטרמיניסטי קצר-בלבד. **לא chain-of-thought. לא מידע אישי. לא תשובת לקוח.** (מקביל ל-`plannerReason`/`strategyReason`/`decisionReason` ברמת-כל-הריצה, לא רק-per-rule כמו `decisionReason` בחלק ה).

---

## 16. Validators עתידיים

**Rule Definition:**
1. `ruleId` קיים.
2. `ruleVersion` קיים.
3. `readingDomain`/`method` תקינים ותואמים (Domain Separation, חלק ח).
4. `ruleCategory` הוא קטגוריה-מאושרת (מ-`STRATEGY_CONSTRAINT_CATEGORIES`/`CATEGORY_DOMAINS`).
5. `sourceId`/`sourceEvidence` קיימים.

**Rule Decision Record:**
6. `decision` חוקי (אחד מ-6 הערכים, חלק ה).
7. `sourceEvidence` קיים ל-`required`/`allowed`.
8. `advisorOnly` אינו client-visible.
9. `forbidden`/`unavailable` אינם `selected`.
10. `conditional` אינו `selected` בלי `condition fulfilled`.

**Engine Output:**
11. אין `Rule ID` ביותר-ממערך-החלטה-סופי-אחד (עקבי עם כלל-דומה ב-Reading Planner לגבי קטגוריות).
12. `executionOrder` כולל רק Rules מותרים.
13. cross-domain Rule נדחה.
14. conflict unresolved מחייב `stop` או `needsOrenDecision`.
15. `confidence` בין 0 ל-1.

**Warning/כללי:**
16. `warning.severity` חוקי.
17. אין `notAvailable` (או `selected`/`rejected`/`active`/`inactive`) בשום מקום.
18. אין מידע-אישי.
19. אין ייבוא AI/fetch/engine.

---

## 17. Examples

**כל 5 הדוגמאות הן חוזה-בלבד (Rule Decision Records עקרוניים) — אין המצאת Rule Definitions אמיתיים, אין תוכן-מקור, אין פירושי-קלפים.**

### דוגמה 1 — Kashf / Business Prediction

**הקשר:** `readingDomain:'goralHachol'`, `method:'kashf'`, `primaryIntent:'prediction'`, ממשיך ישירות מדוגמה-מקבילה ב-Reading Planner (`primaryDecisionCategories:['outcomeRules','businessRelevantRules']`).

```js
{ ruleId: 'goral.kashf.outcome-prediction-001', decision: 'required',
  decisionReason: 'קטגוריה outcomeRules מסומנת primaryDecisionCategories בתוכנית; קיים sourceEvidence תקף.',
  clientVisibility: 'client', confidence: 0.9 }
{ ruleId: 'goral.kashf.verification-contradiction-001', decision: 'allowed',
  decisionReason: 'verificationPolicy=onlyOnContradiction; אין סתירה שזוהתה עדיין — allowed לא required.',
  clientVisibility: 'client', confidence: 0.9 }
{ ruleId: 'goral.kashf.dhamir-detail-001', decision: 'forbidden',
  decisionReason: 'dhamir מופיע ב-forbiddenCategories של התוכנית (hiddenThought לא רלוונטי ל-prediction).',
  clientVisibility: 'advisorOnly', confidence: 1 }
```

### דוגמה 2 — Hawi / Spiritual Question

**הקשר:** `readingDomain:'goralHachol'`, `method:'hawi'`, `questionType:'spiritual'`, `spiritualPolicy:'includeIfRelevant'` (ר' Reading Planner דוגמה 5).

```js
{ ruleId: 'goral.hawi.spiritual-assessment-001', decision: 'allowed',
  decisionReason: 'questionType=spiritual מספק אות-מפורש; spiritualPolicy=includeIfRelevant מתיר (לא מחייב) הפעלה.',
  clientVisibility: 'client', confidence: 0.85 }
{ ruleId: 'goral.hawi.hidden-thought-relevance-001', decision: 'advisorOnly',
  decisionReason: 'primaryIntent=stateAssessment אינו hiddenThoughtIntent — הכלל רלוונטי-פנימית-בלבד ליועץ, לא ללקוח.',
  clientVisibility: 'advisorOnly', confidence: 0.7 }
```

### דוגמה 3 — Cards / Relationship State

**הקשר:** `readingDomain:'cards'`, `method:'cartomancy'`, `primaryIntent:'compatibility'` (ר' Reading Strategy Builder + Reading Planner, "האם אנחנו מתאימים?").

```js
{ ruleId: 'cards.cartomancy.relationship-relevance-001', decision: 'required',
  decisionReason: 'relationshipRelevantRules מסומנת primaryDecisionCategories; sourceEvidence תקף לקטגוריה זו.',
  clientVisibility: 'client', confidence: 0.8 }
{ ruleId: 'cards.cartomancy.technical-spread-001', decision: 'advisorOnly',
  decisionReason: 'technicalSpreadDetails מסומנת advisorOnly בתוכנית — לעולם לא client-visible.',
  clientVisibility: 'advisorOnly', confidence: 0.8 }
```
**⚠️ אין כאן שום שם-קלף, שום פירוש-קלף, שום Rule ID אמיתי — `ruleId`-ים הם דוגמאות-מבניות-בלבד, תואמים ל-namespacing שנקבע בחלק ח.**

### דוגמה 4 — Missing Source Evidence

```js
{ ruleId: 'goral.hawi.timing-estimate-001', decision: 'unavailable',
  decisionReason: 'אין sourceEvidence תקף לחוק זה — לא ניתן לסמן required/allowed בלי מקור.',
  sourceEvidence: null, needsOrenDecision: true,
  warningIds: ['w-missing-source-001'] }
```
`needsOrenDecision:true` כאן משום שהתוכנית (`readingPlan`) כן ציינה את הקטגוריה כ-`primaryDecisionCategories` — כלומר יש-צורך-אמיתי בחוק הזה, אבל אין-לו-מקור, ולכן זו לא רק "אין-מספיק-מידע" (warning רגיל) אלא פער-שדורש-החלטת-אורן (האם-לחפש-מקור-נוסף, האם-להשמיט-את-הקטגוריה-כליל).

### דוגמה 5 — Direct Conflict

```js
{ ruleId: 'goral.kashf.outcome-positive-001', decision: 'required', ... }
{ ruleId: 'goral.kashf.outcome-negative-001', decision: 'required', ... }
// שני Rules, אותה קטגוריה, מסקנות-סותרות מבחינת-מקור

conflict: {
  conflictType: 'directContradiction',
  ruleIds: ['goral.kashf.outcome-positive-001', 'goral.kashf.outcome-negative-001'],
  severity: 'critical',
  description: 'שני חוקים מאותו מקור/קטגוריה מובילים למסקנות-הפוכות עבור אותה קריאה.',
  recoverable: false,
  needsOrenDecision: true,
}
```
**Rule Decision Engine אינו בוחר איזה מהשניים "נכון"** — הוא מדווח את הקונפליקט, מסמן `needsOrenDecision:true`, ו(תלוי-חומרה)עשוי להחזיר Stop Result במקום להמשיך עם החלטה-חלקית-מוטה.

---

## 18. Boundaries

| Rule Decision Engine — **כן** | Rule Decision Engine — **לא** |
|---|---|
| בוחן Rule Definitions קיימים | לא ממציא Rule |
| משווה ל-Reading Plan | לא משנה ספר |
| מחיל Constraints | לא משנה Rule Definition |
| מסווג כל Rule | לא מפעיל מנוע |
| מזהה conflicts | לא מחשב לוח |
| בונה execution instructions | לא מפרש קלפים |
| שומר source fidelity | לא בונה Narrative |
| | לא מבצע Audit |
| | לא מפעיל AI |
| | לא מחליט במקום אורן |

---

## 19. Relationship to Knowledge Pipeline

**Knowledge Pipeline מספק:** Rule Definitions, Applicability, Source Evidence, Missing Knowledge, Ambiguity (ר' `HALL_WISDOM_DECISION_PIPELINE_INTEGRATION_CONTRACT.md`, Handoff C).

**Rule Decision Engine מספק:** Rule Decisions **לקריאה הנוכחית** — צריכה-חד-פעמית של מה-ש-Knowledge Pipeline סיפק, לא מקור-ידע-משלו.

**אין לאחד את שני הרכיבים.** Knowledge Pipeline הוא שכבת-ידע-כללית (מה-קיים-בעולם); Rule Decision Engine הוא שכבת-הכרעה-ספציפית-לקריאה (מה-רלוונטי-כאן-ועכשיו). בלבול-בין-השניים הוא בדיוק-הדפוס שה-Core Constitution (`HALL_WISDOM_CORE_ARCHITECTURE.md` חלק א) נועד למנוע ("ריבוי-מוחות מקבילים... אוצרות-מילים תחרותיים").

---

## סיכום היקף המסמך הזה

✅ הוגדר חוזה מלא ל-Rule Decision Engine: הבחנת Rule Definition/Rule Decision, מטרה, Input Contract, Rule Definition Contract, Rule Decision Contract, Decision Order (14 שלבים), Decision Precedence (8 קדימויות), Domain Separation (namespacing), Conflict Handling (7 סוגים), Execution Instructions, Stop Conditions, Warnings (13 סוגים), Client Visibility, Source Fidelity, Output Contract, Validators עתידיים (19), 5 דוגמאות, גבולות-אחריות, קשר ל-Knowledge Pipeline.

❌ שום קוד. שום תיקייה חדשה. שום קובץ `.js`/`.mjs`. שום test. שום שינוי-מנועים/QA/UI/קלפים/Supabase. שום AI. שום commit. שום push עדיין (ימתין לאישור נפרד לפני מימוש בפועל, כרגיל).
