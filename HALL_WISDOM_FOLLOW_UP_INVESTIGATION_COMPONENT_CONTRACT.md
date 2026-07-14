# HALL_WISDOM_FOLLOW_UP_INVESTIGATION_COMPONENT_CONTRACT.md

> **מסמך-חוזה בלבד. אין קוד. אין תיקיות חדשות. אין JS. אין Tests.**
> תאריך: 2026-07-14. ענף: `claude/app-cleanup-organization-mia9b2`.
> מטרת המסמך: להגדיר חוזה-רכיב **חדש** — **Follow-up Investigation
> Manager** — שאינו משנה את שרשרת ה-Pipeline הקיימת
> (`HALL_WISDOM_DECISION_PIPELINE_INTEGRATION_CONTRACT.md`), אלא מוסיף
> לה יכולת מקצועית נוספת: חקירת-המשך על לוח שכבר חושב, מבלי לבצע קריאה
> חדשה.

---

## 1. מטרת הרכיב

**Follow-up Investigation Manager:**

- **אינו** Chat.
- **אינו** Assistant.
- **אינו** AI Conversation.

זהו רכיב מקצועי-דטרמיניסטי שמאפשר לבצע **חקירת המשך** על אותו לוח
שכבר חושב — ניצול מלא של מה-שהמערכת כבר-קבעה, במקום פתיחת קריאה חדשה
או שיחה-חופשית עם AI.

---

## 2. Professional Investigation Principle

**חקירת המשך אינה שיחה חופשית.**

היא **חקירה מקצועית** המבוססת על:

- אותו לוח.
- אותם Rule Decisions.
- אותם Engine Results.
- אותם Sources.

**אסור לחקירת ההמשך:**

- להמציא ידע.
- לחרוג מהלוח.
- לענות על שאלות שאינן ניתנות להכרעה מהקריאה הקיימת.

**אם השאלה מחייבת לוח חדש או קריאה חדשה** — הרכיב **חייב** להחזיר
`requiresNewReading:true` או `requiresNewBoard:true`, **ולא לנסות
להשלים תשובה.** זהו עיקרון-מסגרת שחוזר ונאכף לאורך כל המסמך — בפרט
ב-Investigation Never Expands Beyond the Board (§8), Follow-up
Eligibility (§11), Follow-up Router (§13), ו-Output Contract (§29) —
ומוצג כאן בראש המסמך כי הוא ההגדרה-המהותית של מה-שהרכיב **הוא**, לא רק
מגבלה טכנית אחת מני-רבות.

---

## 3. עקרון יסוד

```
קריאה אחת
    ↓
לוח אחד
    ↓
חקירות המשך רבות
```

**מבלי לבצע קריאה חדשה.** כל עוד השאלה-הנוספת ניתנת-להכרעה מתוך מה
שהלוח הנוכחי כבר קבע (Rule Decisions, Engine Results, Source Evidence),
אין צורך בקריאה חדשה, בלוח חדש, או אפילו ב-AI.

---

## 4. אחריות

### הרכיב כן:

- שומר `Reading Session` (ר' §5).
- שומר Board Context (`boardState`).
- שומר Rule Decisions (מ-Rule Decision Engine).
- שומר Engine Results (מ-Engine Execution Coordinator).
- שומר Source Evidence.
- שומר Discoverable Knowledge, דרך Discoverable Knowledge Registry (ר' §6).
- שומר Investigation Tree (ר' §7).
- שומר Investigation Memory (ר' §17).
- שומר Decision Trace Reference.
- מאפשר חקירת המשך (Follow-up Question → Follow-up Answer).
- מציע ממצאים ל-Client Knowledge History, **בכפוף לאישור אורן** (ר' §19-§21).

### הרכיב אינו:

- יוצר לוח חדש.
- מפעיל קריאה חדשה.
- משנה Rule Decisions.
- משנה מקורות (`sourceEvidence`).
- מפעיל AI **כברירת מחדל**.
- שומר אוטומטית ל-Client Knowledge History ללא אישור אורן (ר' §21).

(ר' §32, Boundaries, לרשימה המקיפה-יותר.)

---

## 5. Reading Session

`Reading Session` הוא אובייקט-מצב שנשמר בתום ריצת-פייפליין מלאה (לאחר
Engine Execution Coordinator / Verification & Evidence — ר' §31), ומשמש
כבסיס-בלעדי לכל חקירת-המשך על אותו לוח:

```js
{
  readingSessionId,
  boardId,
  readingDomain,
  method,

  primaryQuestion,
  primaryAnswer,

  boardState,              // Board Context המלא — הצורות/הבתים כפי-שנקבעו בקריאה זו, ללא שינוי
  ruleDecisions,           // ruleDecisionRecords מ-Rule Decision Engine, כפי-שהם
  engineResults,           // מ-Engine Execution Coordinator, כפי-שהם
  discoverableKnowledge,   // רשימת-ממצאים על-בסיס Discoverable Knowledge Registry (ר' §6) — לא רשימה קשיחה
  investigationTree,       // מצב-עץ-החקירות המצטבר של ה-Session — סכימת Node מלאה ב-§7
  investigationMemory,     // Investigation Fact[] — עובדות-שהוכרעו בתוך ה-Session, סכימה מלאה ב-§17

  decisionTraceReference,  // Reference פנימי-בלבד, לא-להצגה — עקבי עם ההגדרה ב-Engine Execution Coordinator Contract §15

  sessionStart,
  sessionExpiration,
}
```

**הרכיב אינו ממציא שדה מהשדות האלה** — כולם echo ישיר מתוך פלטי
Rule Decision Engine / Engine Execution Coordinator, או מבנה-מצב פנימי
(`investigationTree`/`investigationMemory`) שנצבר-בתוך אותו Session
בלבד, לא מחושבים-מחדש ולא מפורשים-מחדש.

**`investigationMemory` שונה במהותו מ-Client Knowledge History (§19)** —
הראשון הוא זמני, session-scoped, ונסגר עם הלוח (§15, §28); השני הוא
מתמשך, שייך לכרטיס-הלקוח, ונכנס-אליו רק לאחר אישור-אורן מפורש (§21).
אין לערבב בין השניים (ר' §32, Boundaries).

---

## 6. Discoverable Knowledge Registry

**אין להשתמש ברשימות קשיחות של שאלות המשך.** רשימת ה-Topics/חקירות
היא **הרחבה עתידית מתמדת**, ולכן היא ממוקמת ב-Registry נפרד, לא מקודדת
בתוך לוגיקת הרכיב.

### מבנה עקרוני

```
Topic
  ↓
Discoverable Investigations  (כל אחת — Investigation Dependency Contract, ר' תת-הסעיף הבא)
```

### Investigation Dependency Contract (חוזה לכל Investigation)

כל Investigation ב-Registry מתועד לפי חוזה עקרוני קבוע:

```js
{
  investigationId,
  title,
  followUpIntent,
  eligibleIf,
  requires,
  dependsOn,
  provides,
  blockedIf,
  sourceEvidenceRequirements,
  requiresNewReading,
  requiresNewBoard,
  advisorOnly,
  confidence,
}
```

**משמעות השדות:**

- `eligibleIf` — התנאים שמאפשרים לפתוח את החקירה.
- `requires` — מידע שחייב כבר להיות קיים ב-`Reading Session`.
- `dependsOn` — חקירות קודמות שחייבות להסתיים לפני החקירה הזאת.
- `provides` — איזה מידע חדש החקירה יכולה להפיק.
- `blockedIf` — תנאים שחוסמים את החקירה.
- `sourceEvidenceRequirements` — איזה מקור או Rule Decision חייבים לתמוך
  בחקירה.

**דוגמה עקרונית — Identity Investigation:**

```js
{
  investigationId: "witchcraft.identity",
  eligibleIf: ["primaryFinding.witchcraftExists === true"],
  requires: ["boardState", "ruleDecisions"],
  dependsOn: [],
  provides: ["suspectedActorIdentity"],
  blockedIf: ["primaryFinding.witchcraftExists === false"],
}
```

**דוגמה עקרונית — Location Investigation:**

```js
{
  investigationId: "witchcraft.objectLocation",
  eligibleIf: ["witchcraftObjectExists === true"],
  requires: ["boardState", "ruleDecisions"],
  dependsOn: ["witchcraft.objectExistence"],
  provides: ["suspectedObjectLocation"],
  blockedIf: ["witchcraftObjectExists !== true"],
}
```

**חשוב: אין לקבע עכשיו חוקים מקצועיים אמיתיים. אלה דוגמאות Contract
בלבד** — לא Rule Definitions אמיתיות, לא נתונים ממקור מאושר. תוכן-
המחרוזות ב-`eligibleIf`/`blockedIf` הוא-עצמו לדוגמה-בלבד; התחביר-
המדויק-לביטויי-תנאי ייקבע בעת המימוש.

### דוגמאות (Topics ראשוניים, תקציר)

**Witchcraft** ↓
- Identity
- Purpose
- Object
- Location
- Duration
- Removal
- Active Status

**Enemy** ↓
- Identity
- Relationship
- Motivation
- Current Action
- Future Action

**Health** ↓
- Cause
- Affected Organ
- Development
- Recovery
- Risk

כל פריט ברשימות למעלה מיוצג-בפועל כ-Investigation Dependency Contract
מלא (ר' למעלה) — הרשימות מוצגות כאן כתקציר-קריא-לאדם בלבד, לא כמבנה-
הנתונים-בפועל.

**בעתיד ניתן להוסיף Topics נוספים מבלי לשנות את הארכיטקטורה** — הוספת
Topic חדש ל-Registry (עם ה-Discoverable Investigations שלו, כל אחת לפי
Investigation Dependency Contract) אינה דורשת שינוי בלוגיקת Follow-up
Router/Classifier/Eligibility/Tree — אלו קוראים מה-Registry, לא מכילים
את הרשימה בעצמם.

### עיקרון מפתח

**Follow-up Investigation Manager אינו מכיר שאלות קבועות.** הוא **שואל
את ה-Registry** אילו חקירות זמינות עבור הממצא שהתגלה על הלוח — לא
מחזיק if/else מקודד לפי נוסח-השאלה. `discoverableKnowledge` ב-Reading
Session (§5) הוא **תוצאת-שאילתה** אל ה-Registry (אילו Topics/
Investigations רלוונטיים לממצאים-בפועל בלוח הזה), לא רשימה-גלובלית-
קבועה.

**אסור לחשוף את הפרטים עד שיש שאלת המשך מפורשת** — ה-Registry קובע **מה
ניתן-בעקרון-לחקור**, לא חושף תוכן. תוכן-החשיפה מופק רק כתגובה לשאלת-
ההמשך, דרך Follow-up Router (§13), ורק אם קיים-לו בסיס-מקצועי (§11).

---

## 7. Investigation Tree

**חקירות המשך אינן רשימה שטוחה. הן עץ מקצועי** שבו כל תשובה יכולה
לפתוח ענפים חדשים.

### מבנה עקרוני

```
Primary Finding
      ↓
Investigation Root
      ↓
Investigation Nodes
      ↓
Eligible Child Investigations
```

### סכימת Node

```js
{
  nodeId,
  investigationId,          // מפנה ל-Investigation Dependency Contract, ר' §6
  parentNodeId,
  status:                   // 'locked' | 'available' | 'inProgress' | 'answered' | 'blocked' | 'requiresNewReading' | 'requiresNewBoard'
  question,
  answer,
  evidence,
  openedAt,
  completedAt,
  childNodeIds,
  needsOrenDecision,
}
```

### כללים

1. חקירה אינה נפתחת אם ה-`parent` שלה לא הושלם.
2. תשובה יכולה לפתוח child investigations.
3. child investigation נפתחת רק אם `eligibleIf` (§6) מתקיים.
4. `blocked` node אינו מייצר תשובה.
5. אם נדרש לוח חדש: `status = requiresNewBoard`.
6. אם נדרשת קריאה חדשה: `status = requiresNewReading`.
7. אסור לדלג על `dependency` רק כי היועץ שאל ישירות.
8. המערכת רשאית להסביר איזה שלב צריך לבדוק קודם (ר' §9, Guided
   Investigation Behavior).

### דוגמה

```
נמצא כישוף
      ↓
האם קיים חפץ?
      ↓
אם כן: איפה הוא נמצא?
```

**אם עדיין לא הוכרע שקיים חפץ, שאלת "איפה החפץ?" אינה נענית אוטומטית.**
במקום זאת: *"תחילה יש לבדוק האם הלוח מצביע על קיומו של חפץ הקשור
לפעולה."*

**Investigation Tree נשמר בתוך `Reading Session`** (`investigationTree`,
ר' §5) — לא-מבנה-נפרד-מנותק; הוא נצבר לאורך חיי ה-Session (§15) ומסתיים
עמו.

---

## 8. Investigation Never Expands Beyond the Board

**חקירת ההמשך יכולה להעמיק בתוך המידע שהלוח, החוקים והמקורות מאפשרים.**

**היא אינה רשאית:**

- להמציא אדם.
- להמציא שם.
- להמציא מקום.
- להמציא חפץ.
- להמציא זמן.
- להשלים מידע מהעולם החיצוני.
- להסיק פרט שאינו ניתן להכרעה מהלוח.
- להרחיב את גבולות הקריאה רק בגלל שהיועץ ביקש.

**אם אין בסיס מקצועי לשאלה — החזר אחד מ:**

- `notDiscoverableFromCurrentBoard`
- `requiresNewReading`
- `requiresNewBoard`
- `missingApprovedRule`
- `needsOrenDecision`

**לא לנסות לנסח תשובה חלקית כאילו היא ממצא.**

זהו חיזוק-ישיר, ברמת-הפרט-הבודד (שם/מקום/זמן/אדם/חפץ), ל-Professional
Investigation Principle (§2) ולעיקרון No Invented Data
(`CLAUDE.md`, "ABSOLUTE RULES") — האחרון חל על נתוני-המקור המקוריים;
העיקרון הזה מרחיב אותו במפורש לכל פרט-בודד שעולה תוך-כדי חקירת-המשך,
לא רק להכרעה-הכללית.

---

## 9. Guided Investigation Behavior

**המערכת אינה רק דוחה שאלה לא-כשירה. כאשר אפשר, היא מנחה את היועץ מה
צריך לבדוק קודם.**

דוגמה:

> **שאלה:** "איפה הכישוף נמצא?"
> **אבל:** טרם נקבע שקיים חפץ.
>
> **תשובה פנימית ליועץ:** *"לא ניתן לבדוק מיקום לפני בירור קיומו של
> חפץ. ניתן להתחיל בבדיקה: האם הפעולה קשורה לחפץ מוחשי?"*

**זו אינה תשובה מקצועית לשאלה עצמה. זו הנחיית מסלול חקירה.**

מבחינה-מבנית: node ב-Investigation Tree (§7) שנמצא-במצב `locked` (כלל 1
— ה-`parent` שלו לא הושלם) מייצר `suggestedPriorInvestigation` ב-Output
Contract (§29), ו-`answerStatus:'requiresPriorInvestigation'` — לא
`answered` ולא שגיאה-סתמית. זהו התרגום-הפורמלי של "הנחיית-מסלול" לשדות
מובנים, לא טקסט-חופשי-שהרכיב-מנסח (עקבי עם Narrative Boundary,
`HALL_WISDOM_ENGINE_EXECUTION_COORDINATOR_COMPONENT_CONTRACT.md` §10 —
גם כאן, Coordinator/Manager לא-מנסח, רק-מסמן-מצב; הניסוח-בפועל הוא
תפקיד Narrative Builder).

---

## 10. Follow-up Intent Classification

**כל שאלת המשך אינה עוברת שוב את Intent Analyzer הראשי.** קריאה-חוזרת
ל-Intent Analyzer המלא (עם כל שכבות Reading Strategy Builder/Reading
Planner שמעליו) שקולה-בפועל לפתיחת-קריאה-חדשה — בדיוק מה-שהרכיב הזה
נועד למנוע (§3).

במקום זאת: **Follow-up Intent Classifier** — שכבה נקודתית וצרה, ש**מטרתה
היחידה** היא לסווג את **סוג החקירה** בלבד, לא לנתח-כוונה-מלאה.

### קטגוריות-סיווג (Investigation Types), לדוגמה

- Identity Investigation
- Location Investigation
- Purpose Investigation
- Timing Investigation
- Verification Investigation
- Relationship Investigation
- Status Investigation

**הקטגוריות הללו מתואמות ל-`discoverableInvestigations` שב-Registry
(§6)** — לא רשימה-נפרדת-משלהן; Identity Investigation, לדוגמה, תואמת
ל-`investigationId:"witchcraft.identity"`.

**Coordinator בוחר Investigation Path לפי הסיווג** — הסיווג הוא הקלט
ל-Follow-up Router (§13): הוא קובע **איזה** `investigationId` (אם בכלל)
שאלת-ההמשך מכוונת-אליו, לפני שה-Router בודק אם התשובה כבר-קיימת/
ניתנת-להיסק/דורשת-ידע-חדש — וגם, לפני-כן, איזה **node** ב-Investigation
Tree (§7) מייצג אותה (אם כבר-נפתח) או צריך-להיפתח.

**אין לבצע קריאה מלאה מחדש.** ה-Classifier אינו קורא ל-Intent Analyzer,
ל-Reading Strategy Builder, או ל-Reading Planner — הוא פועל אך-ורק על
נוסח-שאלת-ההמשך מול קטגוריות-קבועות-מוגדרות-בחוזה (הרשימה למעלה),
בזיקה-ישירה ל-Registry.

---

## 11. Follow-up Eligibility

**כל שאלת המשך חייבת לעבור בדיקת-כשירות (Eligibility) לפני מענה.**

דוגמה:

> **אם אין כישוף** (Primary Answer שולל קיום-כישוף), **ושואלים:**
> "מי עשה את הכישוף?"
>
> הרכיב מחזיר: **"אין בסיס מקצועי לחקירת שאלה זו, משום שהקריאה הראשית
> שללה קיום כישוף."**

**אסור להמציא תשובה.** אם אין בסיס-בלוח לשאלת-ההמשך — התשובה היא דחייה
מנומקת (`eligible:false` + `reason`, ותרגומה ל-`answerStatus:'blocked'`
או `'notDiscoverable'` ב-Output Contract, §29), **לא** ניחוש, **לא**
השערה, **לא** ניסיון-לספק-תשובה-חלקית שנשמעת-סבירה. זהו המשך-ישיר
לעיקרון No Invented Data (`CLAUDE.md`), Professional Investigation
Principle (§2), ו-Investigation Never Expands Beyond the Board (§8) —
הוא חל כאן במלואו, כולל על שאלות-המשך, לא רק על נתוני-המקור המקוריים.

הבדיקה נגזרת ישירות מ-`eligibleIf`/`blockedIf` (§6) של ה-Investigation
המסווג (§10), ומ-`status` הנוכחי של ה-node המתאים ב-Investigation Tree
(§7) — לא בדיקה-אד-הוק נפרדת.

---

## 12. Local Knowledge First Policy

**עיקרון-סדר-פעולות מחייב** (מחזק ומרחיב את Cost Optimization, §16):

```
1. Reading Session Cache
2. Existing Rule Decisions
3. Existing Engine Results
4. Discoverable Knowledge Registry
5. Investigation Tree
6. Focused deterministic Rule Evaluation
7. Source Evidence
8. AI only for wording/summary if explicitly needed
```

- **AI אינו השלב הראשון.**
- **AI אינו ברירת מחדל.**
- **AI הוא מוצא אחרון בלבד** — שלב 8, ורק לניסוח/תמצות, לא לקביעת-
  עובדה-מקצועית-חדשה.

**כל עוד התשובה ניתנת מהשלבים 1–7: `requiredAI = false`.**

**כל שאלה שניתן לענות עליה מתוך אותו Reading Session אינה מפעילה AI.**

### Tracking

**כל Follow-up חייב לשמור:**

- `whetherAIWasUsed`
- `aiOperation`
- `cacheHit`
- `deterministicEvaluationUsed`

**אין צורך לממש Usage Metering עכשיו** — השדות למעלה מתועדים כדרישת-
מבנה-עתידית (עקבי עם `HALL_WISDOM_CORE_ARCHITECTURE.md`, עיקרון Usage
Metering, המתועד-שם-אך-לא-ממומש), לא כ-persistence-בפועל בשלב זה.

---

## 13. Follow-up Router

**לפני כל תשובה**, Follow-up Router בודק שלוש שאלות, לפי הסדר — בהתאם
ל-Local Knowledge First Policy (§12), לסיווג מ-Follow-up Intent
Classifier (§10), ולמצב ה-node הרלוונטי ב-Investigation Tree (§7):

### 1. האם התשובה כבר קיימת ב-Reading Session?

אם כן → **אין AI. אין קריאה חדשה.** התשובה מופקת ישירות מ-`ruleDecisions`/
`engineResults`/`discoverableKnowledge` הקיימים, `usedExistingSession:true`,
`usedCachedResult:true`.

### 2. האם ניתן להסיק אותה מאותו לוח?

אם כן → **Rule Engine בלבד** (Local Knowledge First Policy, §12, שלב 6
— Focused deterministic Rule Evaluation). התשובה מופקת מהפעלה-
דטרמיניסטית-נקודתית של לוגיקת-הכרעה קיימת (Rule Decision Engine,
במצב-שאילתה-על-לוח-קיים, ולא-כריצת-פייפליין-מלאה-מחדש) על נתוני
`boardState` הקיימים — `usedExistingSession:true`, `requiredAI:false`,
`requiredRuleEvaluation:true`.

### 3. האם נדרש ידע חדש?

אם כן → **סמן**:

- `requiresPriorInvestigation` — אם ה-node ב-Investigation Tree (§7)
  שמייצג את שאלת-ההמשך תלוי (`dependsOn`, §6) בחקירה-שטרם-הושלמה
  (`status:'locked'`) — ר' Guided Investigation Behavior (§9).
- `requiresNewReading` — אם באמת נדרש לוח חדש (השאלה חורגת ממה-שהלוח
  הנוכחי מסוגל-בעקרון להכריע עליו, ר' §8).
- `requiresNewBoard` — עקבי-עם-לעיל, כאשר הגבלה היא ברמת-הלוח-עצמו.

הבחירה בין השלוש **לפי החוזה** (Follow-up Eligibility, §11,
Investigation Dependency Contract, §6, וגבולות Investigation Never
Expands Beyond the Board, §8) — לא לפי ניחוש חופשי של הרכיב.

---

## 14. Primary Question Preservation

**השאלה הראשית לעולם אינה משתנה.**

חקירות המשך **אינן מחליפות אותה** — הן נספחות אליה, נשמרות כרשומות
נפרדות (`followUpQuestion`/`followUpAnswer`, ר' §29), בעוד `primaryQuestion`/
`primaryAnswer` נשארים קבועים למשך כל חיי ה-Session. עיקרון זהה-במהותו
לזה שכבר נקבע ב-Engine Execution Coordinator
(`HALL_WISDOM_ENGINE_EXECUTION_COORDINATOR_COMPONENT_CONTRACT.md` §6) —
כאן מורחב מ"תוך-ריצה-אחת" ל"לאורך-כל-חיי-ה-Session", כולל כל ענפי
Investigation Tree (§7) שנפתחו במהלכה.

---

## 15. Session Lifetime

**Follow-up Session תקף רק עבור אותו לוח.**

ברגע שנוצר לוח חדש (קריאה חדשה, `boardId` חדש) — ה-Session **מסתיים**,
**כולל** כל מצב-ה-Investigation Tree (§7) **וה-Investigation Memory**
(§17) שנצברו בתוכו (ר' §18, כלל 7). אין המשכיות-חקירה בין לוחות שונים,
גם אם השאלה דומה-במבנה לשאלה קודמת. `sessionExpiration` (§5) הוא
הגבול-הפורמלי-הנוסף (זמן), אך תנאי-הסיום-המהותי הוא **לוח חדש**, לא רק
פקיעת-זמן.

**Client Knowledge History (§19) אינו מושפע מסגירת ה-Session** — ממצאים
שכבר-אושרו-על-ידי-אורן ונכנסו-אליו (§21) נשארים בכרטיס-הלקוח לצמיתות,
בניגוד ל-Investigation Memory הזמני.

---

## 16. Cost Optimization

**עיקרון-בסיס לרכיב זה** (מפורט לכדי-שרשרת-8-שלבים מלאה ב-Local
Knowledge First Policy, §12):

**Follow-up Investigation ישתמש תחילה בכל המידע שכבר חושב.**

**אסור לבצע קריאת AI אם אותה תשובה ניתנת להפקה מתוך ה-Reading Session.**

**AI הוא מוצא אחרון בלבד** — רק לאחר שכל שבעת-הצעדים הראשונים ב-Local
Knowledge First Policy (§12) נבדקו ונכשלו. זהו המשך-ישיר לעיקרון
"Source Before AI" (`HALL_WISDOM_CORE_ARCHITECTURE.md`) — וגם עיקרון-
חיסכון תפעולי מפורש: אין לשלם על קריאת-AI עבור מידע שכבר-קיים-
בזיכרון-הקריאה.

---

## 17. Investigation Memory

רכיב פנימי חדש: **Investigation Memory**.

**מטרתו:** לשמור את העובדות שכבר הוכרעו במהלך חקירת ההמשך של אותו לוח.

כל Investigation Node (§7) שהסתיים בהצלחה (`status:'answered'`) יכול
לייצר **Investigation Fact**:

```js
{
  factId,
  readingSessionId,
  investigationNodeId,
  investigationId,
  factType,
  factValue,
  factStatus,
  sourceRuleIds,
  sourceEvidence,
  confidence,
  derivedFromInvestigation,
  createdAt,
  supersededByFactId,
  needsOrenDecision,
}
```

### `factStatus` — ערכים אפשריים

- `active`
- `negated`
- `unresolved`
- `superseded`
- `verified`

### כללים

1. Fact שייך רק ל-`readingSessionId` הנוכחי.
2. Fact אינו מקור ידע חדש.
3. Fact אינו משנה Rule Definition.
4. Fact אינו גובר על הלוח.
5. Fact משמש רק כדי לא לחזור על חקירות שכבר הושלמו.
6. Fact חדש יכול לסמן Fact קודם כ-`superseded`, אך **לא למחוק אותו**.
7. אם נוצר לוח חדש — Investigation Memory של הלוח הישן נסגר (ר' §15).
8. אין להשתמש ב-Fact של לקוח אחר.
9. אין להשתמש ב-Fact מקריאה אחרת כאילו הוא עדיין אמת נוכחית.
10. Fact חייב להיות traceable ל: Investigation Node (§7), Rule
    Decisions, Source Evidence.

**Investigation Memory נשמר בתוך `Reading Session`** (`investigationMemory`,
ר' §5) — כמו Investigation Tree, לא-מבנה-נפרד-מנותק.

---

## 18. Investigation Memory Never Overrides the Board

**עיקרון מחייב:**

- הזיכרון שומר מה כבר הוכרע.
- הוא **אינו** משנה את הכרעת הלוח.
- הוא **אינו** מחליף Rule Evaluation חדש כאשר נדרש.
- הוא **אינו** הופך ממצא ישן לממצא נוכחי.
- **אם הלוח הנוכחי סותר Fact קודם — יש לשמור את הסתירה ולהעביר אותה
  להשוואה, לא למחוק היסטוריה.**

זהו היישום הישיר, ברמת-הזיכרון-הפנימי, של Investigation Never Expands
Beyond the Board (§8) ושל Professional Investigation Principle (§2) —
זיכרון-שכבר-הוכרע אינו-פוטר מהחובה שכל תשובה עדיין-נשלטת על-ידי הלוח
בפועל, לא על-ידי מה-שנרשם-בעבר.

---

## 19. Client Knowledge History

שכבה נפרדת לחלוטין מ-Investigation Memory: **Client Knowledge History**.

**זו אינה Investigation Memory.** היא נשמרת בכרטיס הלקוח **לאורך זמן**.

**מטרתה:** לשמור ממצאים מקצועיים מאושרים מתוך קריאות קודמות, כדי לבצע
השוואה בבדיקות חוזרות.

**אין לשמור בה את כל ה-Rule Decisions הטכניים כברירת מחדל.** יש לשמור
**Professional Findings** בלבד:

```js
{
  clientFindingId,
  clientId,
  readingId,
  readingSessionId,
  readingDate,
  readingDomain,
  method,
  questionType,
  primaryQuestionSummary,
  findingType,
  findingLabel,
  findingValue,
  findingStatus,
  severity,
  sourceEvidenceReference,
  decisionTraceReference,
  confirmedByOren,
  comparisonEligible,
  sensitive,
  createdAt,
  updatedAt,
}
```

### `findingStatus` — ערכים אפשריים

- `present`
- `absent`
- `active`
- `weakened`
- `strengthened`
- `unchanged`
- `resolved`
- `returned`
- `uncertain`
- `notAssessed`

**חשוב: `uncertain` מותר רק כאשר השיטה עצמה אינה מכריעה. לא להשתמש בו
כדי לרכך הכרעה חד-משמעית.** זהו יישום-ישיר של Professional
Deterministic Execution Policy
(`HALL_WISDOM_ENGINE_EXECUTION_COORDINATOR_COMPONENT_CONTRACT.md` §5)
ברמת-הרישום-ההיסטורי — לא רק ברמת-הביצוע-החי.

---

## 20. What Is Stored

**לכרטיס הלקוח נשמרים:**

- המסקנה המקצועית.
- ממצאים נוספים שאורן בחר לשמור.
- סטטוס הממצא.
- תאריך הקריאה.
- מקור הקריאה.
- קישור ללוח/קריאה.
- האם הממצא אושר על ידי אורן.
- האם הוא מתאים להשוואה עתידית.

**לא נשמרים כברירת מחדל:**

- raw chain-of-thought
- prompt
- API response גולמי
- כל Rule Decision טכני
- access token
- secret
- מידע שאינו נחוץ למעקב מקצועי

**מותר לשמור reference פנימי ל-`decisionTrace`, אבל לא להציג אותו
בכרטיס הלקוח כברירת מחדל** — עקבי-עם ההגדרה הקיימת של
`decisionTraceReference`
(`HALL_WISDOM_ENGINE_EXECUTION_COORDINATOR_COMPONENT_CONTRACT.md` §15:
"אינו מיועד להצגה ללקוח").

---

## 21. Oren Approval Before Persistence

**ממצא מחקירת המשך אינו נשמר אוטומטית בכרטיס הלקוח.**

לפני שמירה מתמשכת — המערכת מציגה לאורן את הממצא. אורן יכול:

- לאשר.
- לערוך.
- לדחות.
- לסמן כרגיש.
- לסמן כלא מתאים להשוואה.

**רק לאחר אישור: `confirmedByOren = true`, והממצא נכנס ל-Client
Knowledge History (§19).**

זהו יישום ישיר של עקרון Human Approval (Oren) שכבר נקבע ב-Pipeline
הראשי (`HALL_WISDOM_DECISION_PIPELINE_INTEGRATION_CONTRACT.md`,
שער-אנושי-מפורש, לא שלב-אוטומטי) — כאן מוחל, לראשונה, על שכבת-הזיכרון-
המתמשך-של-הלקוח.

---

## 22. Sensitive Findings

מדיניות-רגישות. ממצאים כגון:

- כישוף
- אויב
- זהות חשודה
- מצב רפואי
- בעיה נפשית
- הריון
- זוגיות
- סכסוך משפחתי
- חשד לפעולה של אדם

**חייבים להיות: `sensitive = true`.**

### כללים

1. לא להציג אוטומטית ללקוח.
2. לא לכלול בדוח מודפס בלי אישור אורן.
3. לא להשתמש להשוואה אוטומטית ללא אישור.
4. לא להציג שם של אדם כעובדה משפטית.
5. לשמור את הניסוח המקצועי כפי שאורן אישר.

---

## 23. Follow-up Answer → Client Finding Flow

```
Follow-up Question
      ↓
Investigation Eligibility        (§11)
      ↓
Focused Rule Evaluation          (§12, שלב 6)
      ↓
Follow-up Answer                 (§29)
      ↓
Investigation Fact               (§17)
      ↓
Oren Review                      (§21)
      ↓
Approved Client Finding          (§19)
      ↓
Client Knowledge History         (§19)
```

**חשוב:**

- **לא כל** Follow-up Answer הופך ל-Client Finding.
- רק ממצא מקצועי משמעותי.
- רק לאחר אישור אורן (§21).
- ניסוח שיחה זמני אינו נשמר אוטומטית.

---

## 24. Repeat Visit Comparison

רכיב עתידי: **Client Reading Comparison**.

כאשר הלקוח חוזר עם לוח חדש, המערכת יכולה להשוות: **Previous Approved
Findings** מול **Current Approved Findings**.

```js
{
  clientId,
  previousReadingId,
  currentReadingId,
  comparedFindingType,
  previousStatus,
  currentStatus,
  trend,
  comparisonSummary,
  evidenceReferences,
  conflicts,
  needsOrenDecision,
}
```

### `trend` — ערכים אפשריים

- `appeared`
- `disappeared`
- `weakened`
- `strengthened`
- `unchanged`
- `returned`
- `resolved`
- `notComparable`

---

## 25. Comparison Rules

1. משווים רק Findings מאותו `clientId`.
2. משווים רק Findings עם `comparisonEligible:true`.
3. משווים רק Domains/Methods תואמים, אלא אם קיים Adapter מאושר.
4. ממצא ישן אינו נחשב אמת נוכחית.
5. הקריאה החדשה היא המקור למצב הנוכחי.
6. הקריאה הישנה משמשת להשוואה בלבד.
7. אם השאלה החדשה לא בדקה את הממצא הישן: `currentStatus = notAssessed`
   — **ולא** `absent`.
8. לא לקבוע `resolved` רק משום שממצא לא הוזכר.
9. סתירה בין קריאות חייבת להישמר ולהיות מוצגת לאורן.
10. AI רשאי לנסח השוואה, אך **לא** לקבוע את הסטטוס במקום המנוע/אורן.

---

## 26. Example

**דוגמת Contract בלבד** — להמחשת מבנה Repeat Visit Comparison (§24),
**לא** קביעה מקצועית אמיתית:

**קריאה ראשונה:**

| findingType | findingStatus / findingValue |
|---|---|
| `witchcraft` | `active` |
| `witchcraftObject` | `present` |
| `suspectedActorRelationship` | `"קרוב משפחה"` |

**לאחר טיפול, קריאה חוזרת:**

| findingType | findingStatus |
|---|---|
| `witchcraft` | `absent` |
| `witchcraftObject` | `notAssessed` |
| `suspectedActorRelationship` | `notAssessed` |

**Comparison:**

| comparedFindingType | trend |
|---|---|
| `witchcraft` | `resolved` |
| `witchcraftObject` | `notComparable` |

**הבהרה: אין לקבוע שהחפץ נעלם רק מפני שלא נבדק בקריאה החדשה** (Comparison
Rules, §25, כלל 7-8).

---

## 27. Client Evolution View

רכיב עתידי: **Client Evolution View** — תצוגה מקצועית בכרטיס הלקוח.

**הוא יציג:**

- Timeline של Findings.
- מצב קודם.
- מצב נוכחי.
- מגמות.
- ממצאים שחזרו.
- ממצאים שנפתרו.
- ממצאים שטרם נבדקו מחדש.
- קישורים לקריאות המקור.

**הוא אינו:**

- מחליף קריאה חדשה.
- קובע אבחנה.
- משנה סטטוס ללא Rule Evaluation או אישור אורן.
- מציג מידע רגיש ללקוח בלי אישור.

---

## 28. Retention and Privacy

**Investigation Memory:**

- session-scoped.
- נסגר עם סיום הקריאה/לוח (§15).
- ניתן לשמור Snapshot פנימי אם אורן מאשר.

**Client Knowledge History:**

- persistent.
- שייך לכרטיס הלקוח.
- נגיש רק למורשים.
- חייב לאפשר מחיקה/תיקון.
- חייב לשמור audit trail של שינוי.
- **לא** כולל secrets/tokens/raw AI payloads.

---

## 29. Output Contract

```js
{
  readingSessionId,
  primaryQuestion,
  primaryAnswer,

  followUpQuestion,
  followUpIntent,             // מ-Follow-up Intent Classifier, §10
  investigationId,             // מ-Discoverable Knowledge Registry, §6
  investigationNodeId,         // מ-Investigation Tree, §7
  investigationPath,           // שרשרת parentNodeId's מ-שורש-העץ ועד ה-node הנוכחי

  eligibilityStatus,           // §11
  dependencyStatus,            // §6/§7 — locked/satisfied
  answerStatus,                // ר' רשימת-הערכים למטה
  followUpAnswer,

  usedExistingSession,
  usedCachedResult,
  requiredRuleEvaluation,
  requiredAI,
  requiredNewReading,
  requiredNewBoard,

  blockedReason,
  suggestedPriorInvestigation, // §9, Guided Investigation Behavior

  discoverableChildInvestigations, // investigationId-ים שנפתחים כעת כ-eligible, §7 כלל 2-3

  sourceEvidence,
  decisionTraceReference,
  needsOrenDecision,

  // --- Output Contract Expansion (Investigation Memory / Client Knowledge History) ---
  investigationFactsCreated,     // Investigation Fact[] שנוצרו מתוך ההרצה הזו, §17
  investigationMemoryUpdated,    // boolean — האם investigationMemory (§5) עודכן

  proposedClientFindings,        // Client Finding[] מוצעים, טרם-אושרו — §19
  clientFindingSaveStatus,       // ר' רשימת-הערכים למטה
  requiresOrenApprovalForPersistence, // boolean — §21

  comparisonEligibleFindings,    // findingId-ים עם comparisonEligible:true — §24-§25
  sensitiveFindings,             // findingId-ים עם sensitive:true — §22

  whetherAIWasUsed,               // §12, Tracking
  aiOperation,
  cacheHit,
  deterministicEvaluationUsed,
}
```

### `answerStatus` — ערכים אפשריים

- `answered`
- `blocked`
- `notDiscoverable`
- `requiresPriorInvestigation`
- `requiresNewReading`
- `requiresNewBoard`
- `needsOrenDecision`

### `clientFindingSaveStatus` — ערכים אפשריים

- `notProposed`
- `proposed`
- `approved`
- `editedAndApproved`
- `rejected`
- `saved`
- `saveFailed`

כל שדה — כפי שנדרש במפורש; לא נוספו שדות מעבר לרשימה זו.

---

## 30. Examples

**אין תשובות מקצועיות מומצאות בדוגמאות אלו — רק התנהגות-החוזה מוצגת.**

### 1. נמצא כישוף → "מי עשה?"

```js
{
  primaryQuestion: "האם יש כישוף?",
  followUpQuestion: "מי עשה את הכישוף?",
  followUpIntent: "Identity Investigation",
  investigationId: "witchcraft.identity",
  answerStatus: "answered",
  followUpAnswer: "...",
  usedExistingSession: true,
  usedCachedResult: true,
  requiredRuleEvaluation: false,
  requiredAI: false,
  requiredNewReading: false,
  requiredNewBoard: false,
  sourceEvidence: [...],
  decisionTraceReference: "...",
  needsOrenDecision: false,
}
```

### 2. נמצא כישוף + נמצא חפץ → "איפה החפץ?"

```js
{
  primaryQuestion: "האם יש כישוף?",
  followUpQuestion: "איפה החפץ?",
  followUpIntent: "Location Investigation",
  investigationId: "witchcraft.objectLocation",
  dependencyStatus: "satisfied",   // witchcraft.objectExistence כבר answered
  answerStatus: "answered",
  followUpAnswer: "...",
  usedExistingSession: true,
  requiredRuleEvaluation: true,
  requiredAI: false,
  requiredNewReading: false,
  requiredNewBoard: false,
  sourceEvidence: [...],
  decisionTraceReference: "...",
  needsOrenDecision: false,
}
```

### 3. נמצא כישוף אבל טרם נבדק חפץ → "איפה החפץ?"

```js
{
  primaryQuestion: "האם יש כישוף?",
  followUpQuestion: "איפה החפץ?",
  followUpIntent: "Location Investigation",
  investigationId: "witchcraft.objectLocation",
  dependencyStatus: "locked",      // witchcraft.objectExistence טרם הושלמה
  answerStatus: "requiresPriorInvestigation",
  followUpAnswer: null,
  blockedReason: "לא ניתן לבדוק מיקום לפני בירור קיומו של חפץ.",
  suggestedPriorInvestigation: "witchcraft.objectExistence",
  usedExistingSession: true,
  requiredAI: false,
  requiredNewReading: false,
  requiredNewBoard: false,
  sourceEvidence: [],
  needsOrenDecision: false,
}
```

### 4. אין כישוף → "מי עשה?"

```js
{
  primaryQuestion: "האם יש כישוף?",
  followUpQuestion: "מי עשה את הכישוף?",
  followUpIntent: "Identity Investigation",
  investigationId: "witchcraft.identity",
  answerStatus: "blocked",
  followUpAnswer: null,
  blockedReason: "אין בסיס מקצועי לחקירת שאלה זו, משום שהקריאה הראשית שללה קיום כישוף.",
  usedExistingSession: true,
  requiredAI: false,
  requiredNewReading: false,
  requiredNewBoard: false,
  sourceEvidence: [],
  needsOrenDecision: false,
}
```

### 5. נמצא אויב → "מה הקשר שלו ללקוח?"

```js
{
  primaryQuestion: "האם יש אויב?",
  followUpQuestion: "מה הקשר שלו ללקוח?",
  followUpIntent: "Relationship Investigation",
  investigationId: "enemy.relationship",
  answerStatus: "answered",
  followUpAnswer: "...",
  usedExistingSession: true,
  requiredRuleEvaluation: true,
  requiredAI: false,
  requiredNewReading: false,
  requiredNewBoard: false,
  sourceEvidence: [...],
  decisionTraceReference: "...",
  needsOrenDecision: false,
}
```

### 6. שאלה שאינה ניתנת להכרעה מהלוח

```js
{
  primaryQuestion: "...",
  followUpQuestion: "...",
  followUpIntent: null,
  investigationId: null,
  answerStatus: "notDiscoverable",  // או 'requiresNewReading', לפי מהות-החריגה — ר' §8
  followUpAnswer: null,
  blockedReason: "השאלה חורגת ממה שהלוח הנוכחי מסוגל להכריע עליו — נדרשת קריאה חדשה.",
  usedExistingSession: false,
  requiredAI: false,
  requiredNewReading: true,
  requiredNewBoard: true,
  sourceEvidence: [],
  needsOrenDecision: false,
}
```

---

## 31. Relationship to Pipeline

```
Rule Decision Engine
        ↓
Engine Execution Coordinator
        ↓
Verification & Evidence
        ↓
   Reading Session (נשמר, כולל Investigation Tree)
        ↓
Follow-up Investigation Manager  ← (רכיב חדש, לא-חלק מהשרשרת-הליניארית)
```

- **Follow-up Investigation Manager אינו מקדים/עוקף את Rule Decision
  Engine** — הוא צורך את התוצרים-שלו (`ruleDecisions`) לאחר-מעשה, לא
  קורא-לו-מחדש (למעט הפעלה-נקודתית-מבוקרת דרך Router §13 סעיף 2 /
  Local Knowledge First Policy §12 שלב 6).
- **אינו שולח מידע ישירות ל-Narrative** — פלט-חקירת-ההמשך (§17) עובר
  לאותו מסלול-ניסוח שכל תשובה אחרת עוברת (Narrative Builders), לא-נכתב
  כטקסט-סופי כאן.
- **אינו רכיב-חובה בכל קריאה** — הוא רכיב-אופציונלי-בזמן-הרצה, מופעל רק
  כשמשתמש מבקש חקירת-המשך על קריאה-שכבר-בוצעה.

---

## 32. Boundaries

### טבלת שאלות-ותשובות

| שאלה | תשובה |
|---|---|
| יוצר לוח חדש? | לא, לעולם לא |
| מפעיל קריאה חדשה כברירת-מחדל? | לא — רק אם `requiredNewReading:true` נקבע במפורש |
| משנה Rule Decisions קיימים? | לא |
| משנה `sourceEvidence` קיים? | לא |
| מפעיל AI כברירת-מחדל? | לא — AI הוא מוצא-אחרון בלבד (§12, §16) |
| חושף Discoverable Knowledge אוטומטית? | לא — רק בתגובה לשאלת-המשך מפורשת (§6) |
| ממציא תשובה כשאין בסיס? | לא, לעולם לא (§8, §11) |
| משנה את השאלה הראשית? | לא, לעולם לא (§14) |
| תקף בין לוחות שונים? | לא — Session (ו-Investigation Memory שבתוכו) מסתיים עם לוח חדש (§15) |
| משתמש ברשימה קשיחה של שאלות-המשך האפשריות? | לא — Discoverable Knowledge Registry, מורחב-ללא-שינוי-ארכיטקטוני (§6) |
| עובר שוב דרך Intent Analyzer הראשי לכל שאלת-המשך? | לא — Follow-up Intent Classifier נקודתי בלבד (§10) |
| עוקף Dependencies כשהיועץ שואל ישירות? | לא, לעולם לא (§7, כלל 7) |
| שומר Fact אוטומטית בכרטיס הלקוח? | לא — רק לאחר אישור אורן (§21) |
| Investigation Memory גובר על הלוח? | לא, לעולם לא (§18) |
| Client Knowledge History משנה ממצאים היסטוריים? | לא — רק מתעד סתירה/מגמה, לעולם לא מוחק (§18, §25 כלל 9) |

### Investigation Memory מול Client Knowledge History — אסור לערבב

| | Investigation Memory (§17) | Client Knowledge History (§19) |
|---|---|---|
| טווח-חיים | זמני — session-scoped | מתמשך — persistent |
| שייך ל- | לוח אחד (§15) | כרטיס הלקוח |
| מטרה | לא-לחזור-על-חקירה-שכבר-הושלמה בתוך אותה קריאה | השוואה בין קריאות-לאורך-זמן |
| נכתב אוטומטית? | כן — כל Investigation Node שהסתיים | **לא** — רק לאחר אישור-אורן מפורש (§21) |
| נמחק? | נסגר-עם-הלוח (§28) | נשמר-לצמיתות, ניתן-למחיקה/תיקון-מבוקר בלבד (§28) |

**Follow-up Manager אינו שומר אוטומטית בכרטיס הלקוח** (§21). **Client
Comparison אינו משנה ממצאים היסטוריים** (§25). **History אינו גובר על
הלוח הנוכחי** (§18) — עקרון-זהה לזה שכבר נקבע ל-Investigation Memory,
מוחל כאן גם על השכבה-המתמשכת.

### כן/לא — סיכום מקיף

**Follow-up Investigation Manager כן:**

- מנהל Session.
- מסווג Follow-up Intent.
- בודק Eligibility.
- מנהל Dependencies.
- מנהל Investigation Tree.
- משתמש באותו Board.
- מפעיל Rule Evaluation ממוקד אם מותר.
- מציע חקירה קודמת כאשר נדרש.

**הוא לא:**

- לא יוצר Board חדש בעצמו.
- לא מחליט לבצע Reading חדש בעצמו.
- לא ממציא תשובות.
- לא עוקף Dependencies.
- לא מפעיל את כל חוקי הספר.
- לא חושף Discoverable Knowledge בלי בקשה.
- לא משתמש ב-AI כברירת מחדל.
- לא משנה את Primary Answer.
- לא משנה את Rule Decisions המקוריים.

---

## 33. סיכום היקף המסמך הזה

מסמך זה מגדיר **חוזה-רכיב חדש בלבד** — Follow-up Investigation Manager:
מטרה (לא-Chat, לא-Assistant, לא-AI Conversation), Professional
Investigation Principle, עקרון-היסוד (קריאה אחת → לוח אחד → חקירות-
המשך-רבות), אחריות (כן/לא), מבנה Reading Session (כולל
`investigationTree`), Discoverable Knowledge Registry **+ Investigation
Dependency Contract** (חוזה-13-שדות לכל Investigation, עם 2 דוגמאות-
Contract-בלבד, ללא-חוקים-מקצועיים-אמיתיים), **Investigation Tree**
(מבנה-עץ רשמי, סכימת Node, 8 כללים, דוגמת כישוף→חפץ→מיקום),
**Investigation Never Expands Beyond the Board** (איסור-המצאה ברמת-
פרט-בודד: אדם/שם/מקום/חפץ/זמן, ורשימת-ערכי-דחייה פורמליים),
**Guided Investigation Behavior** (הנחיית-מסלול-חקירה, לא-תשובה-
מקצועית), Follow-up Intent Classification (סיווג-סוג-חקירה נקודתי,
ללא-חזרה-על-Intent-Analyzer-המלא), Follow-up Eligibility, Local
Knowledge First Policy **מחוזק** (שרשרת-8-שלבים: Reading Session Cache
→ Rule Decisions → Engine Results → Discoverable Registry → Investigation
Tree → Focused Rule Evaluation → Source Evidence → AI-לניסוח-בלבד,
כולל שדות-מעקב `whetherAIWasUsed`/`aiOperation`/`cacheHit`/
`deterministicEvaluationUsed`), Follow-up Router (מעודכן ל-3 תוצאות:
answered/requiresPriorInvestigation/requiresNewReading-או-Board),
Primary Question Preservation, Session Lifetime, Cost Optimization,
**Investigation Memory** (Investigation Fact, 5 `factStatus`-ים, 10
כללים, נשמר בתוך Reading Session), **Investigation Memory Never
Overrides the Board**, **Client Knowledge History** (שכבה מתמשכת
נפרדת-לגמרי, Client Finding עם 21 שדות, 10 `findingStatus`-ים כולל
אזהרת-שימוש ל-`uncertain`), **What Is Stored** (רשימת-מותר/אסור
מפורשת, כולל איסור raw-chain-of-thought/prompt/secrets), **Oren
Approval Before Persistence** (שער-אנושי-מפורש — `confirmedByOren`),
**Sensitive Findings** (9 קטגוריות-רגישות, 5 כללי-חשיפה), **Follow-up
Answer → Client Finding Flow** (Pipeline מלא), **Repeat Visit
Comparison** (Comparison Result, 8 `trend`-ים), **Comparison Rules**
(10 כללים, כולל `notAssessed`≠`absent`), דוגמת-Contract-להמחשת-
השוואה, **Client Evolution View** (רכיב-עתידי, כן/לא), **Retention and
Privacy** (Investigation Memory מול Client Knowledge History), Output
Contract **מורחב פעמיים** (כולל שדות Investigation Memory/Client
Knowledge History ו-`clientFindingSaveStatus`), 6 דוגמאות-חוזה (ללא
תוכן-מקצועי-מומצא), Relationship to Pipeline, ו-Boundaries **מורחב**
(טבלה + טבלת-הפרדה Investigation Memory מול Client Knowledge History +
סיכום כן/לא מקיף).

**לא נכתב קוד. לא נוצרו קבצים נוספים מלבד מסמך זה. לא בוצע מימוש. לא
בוצע Commit. לא בוצע Push. לא בוצע Deploy. לא בוצע Merge.**
