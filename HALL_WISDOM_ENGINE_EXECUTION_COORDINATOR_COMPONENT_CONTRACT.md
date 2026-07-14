# HALL_WISDOM_ENGINE_EXECUTION_COORDINATOR_COMPONENT_CONTRACT.md

> **מסמך-חוזה בלבד. אין קוד. אין תיקיות חדשות. אין JS. אין Tests.**
> תאריך: 2026-07-14. ענף: `claude/app-cleanup-organization-mia9b2`.
> מטרת המסמך: להגדיר את חוזה הרכיב הבא ב-Roadmap (`HALL_WISDOM_CORE_ARCHITECTURE.md`, חלק יב, שלב 6 מתוך 16; `HALL_WISDOM_DECISION_PIPELINE_INTEGRATION_CONTRACT.md`, Handoff E→F) — **Engine Execution Coordinator** — לפני שמתחיל מימוש בפועל.

---

## 1. מטרת הרכיב

**Engine Execution Coordinator אינו מקבל החלטות מקצועיות.**

כל ההחלטות המקצועיות כבר התקבלו, במורד השרשרת:

```
Intent Analyzer
      ↓
Reading Strategy Builder
      ↓
Reading Planner
      ↓
Rule Decision Engine
```

עד לשלב הזה, המערכת כבר קבעה: **אילו** Rules ייבחרו, **באיזה** סטטוס
(`required`/`allowed`/`conditional`/`advisorOnly`/`forbidden`/`unavailable`),
ו**לפי איזה** `executionInstructions` (ר' `HALL_WISDOM_RULE_DECISION_ENGINE_COMPONENT_CONTRACT.md`
§10, §15). Engine Execution Coordinator אחראי אך ורק על:

- הפעלת המנועים הנכונים (Kashf / Hawi / Cards / מודולים עתידיים).
- סדר ההפעלה (Execution Stages, ר' §11).
- בידוד Domains (Engine Isolation, ר' §14).
- העברת Inputs למנוע הנכון.
- איסוף Outputs מהמנוע.
- Trace (מי-רץ-מתי-על-מה, ר' §17).
- Error Handling (ר' §16).
- Stop Handling (העברת עצירה הלאה, ללא ניסוח-מחדש).

**זהו רכיב-ביצוע (execution proxy), לא רכיב-החלטה.** הוא אינו יודע *למה* Rule
מסוים required — הוא רק יודע *שהוא* required, ומפעיל את המנוע המתאים לפי
ההוראה שכבר ניתנה.

---

## 2. הבחנה מחייבת — Coordinator מול Rule Decision Engine

| | Rule Decision Engine | Engine Execution Coordinator |
|---|---|---|
| שאלה שהוא עונה עליה | "האם ואיך להחיל את החוק הזה?" | "איך מריצים את מה שכבר הוחלט?" |
| תוצר | `Rule Decision` (סטטוס לכל Rule ID) | `engineResults` (תוצאת-חישוב בפועל) |
| בוחר Rules? | כן | לא — לעולם לא |
| משנה Rule Decision? | (מגדיר אותה) | **אסור בהחלט** |
| מכיר תוכן-מקצועי (טקסט-מקור, פירוש)? | כן (`sourceEvidence`) | לא — עובר-דרכו כ-payload, לא-נקרא-לצורך-החלטה |
| מפעיל מנוע (Kashf/Hawi/Cards)? | לא | כן — זה כל תפקידו |

---

## 3. Input Contract

Engine Execution Coordinator מקבל את הפלט המלא של Rule Decision Engine
(`HALL_WISDOM_RULE_DECISION_ENGINE_COMPONENT_CONTRACT.md` §15) ללא שינוי:

```js
{
  pipelineRunId,
  readingDomain,
  method,
  ruleDecisionRecords,
  selectedRuleIds,
  conditionalRuleIds,
  advisorOnlyRuleIds,
  executionInstructions,   // כולל executionOrder, executionGroups, evidenceRequirements
  sourceEvidencePointers,
  needsOrenDecision,
}
```

### מה קורה אם הקלט הוא Stop Result

אם הפלט-שהתקבל הוא Stop Result (`stopped:true`, מ-Rule Decision Engine או
ממה-שלפניו) — Coordinator **אינו רץ כלל**. הוא מחזיר Stop Result משלו-הלאה
(`stopComponent:'engineExecutionCoordinator'`, `stopReason` מציין
שהעצירה-ירשה-מהרכיב-הקודם) — עקרון-זהה לזה שכבר נקבע ב-Reading Planner
וב-Rule Decision Engine (`HALL_WISDOM_DECISION_PIPELINE_INTEGRATION_CONTRACT.md`
§8): **Coordinator לעולם אינו מנסח `clarificationQuestion` חדש**, ואינו
מנסה "להשלים" עבודה על בסיס תוכנית-שלא-הושלמה.

### מה קורה אם `selectedRuleIds`/`conditionalRuleIds`/`advisorOnlyRuleIds` ריקים

מצב-חוקי (למשל: קריאה שכולה advisorOnly, או קריאה בה כל ה-Rules נדחו
כ-`forbidden`/`unavailable`) — Coordinator מריץ 0 Stages בפועל ומחזיר
`engineResults: []` תקין, לא שגיאה.

---

## 4. אחריות

### Coordinator כן:

- קורא `ruleDecisionRecords` ו-`executionInstructions`.
- בונה Execution Stages (ר' §11).
- בונה Rule Sequence בתוך כל Stage (ר' §12).
- מפעיל Engines דרך Engine Adapters (ר' §13).
- אוסף Results מכל הרצה.
- שומר Trace לכל Rule שהורץ.
- שומר Timing (התחלה/סיום לכל Rule ולכל Stage).
- שומר Source References (מעביר-הלאה, לא-בוחן-תוכן).

### Coordinator לא:

- לא בוחר Rules.
- לא משנה Rule Decisions.
- לא משנה Reading Strategy.
- לא משנה Reading Plan.
- לא מחליט על Narratives.
- לא מחליט על Audit.
- לא מחליט על Mentor.
- לא מפעיל AI.
- לא ניגש ל-Knowledge Repository ישירות (זה תפקיד Rule Decision Engine, שכבר-קרה).
- לא מנסח `clarificationQuestion`.

---

## 5. Professional Deterministic Execution Policy

**Engine Execution Coordinator אינו משנה את משמעות ההכרעות שהתקבלו.**

אם Rule Decision Engine קבע הכרעה דטרמיניסטית, Coordinator **חייב לשמור
עליה ללא שינוי**.

אסור לו:

- לרכך מסקנה.
- להפוך "כן" ל"ייתכן".
- להפוך "לא" ל"כנראה לא".
- להוסיף הסתייגויות שאינן קיימות בשיטה.
- לשנות ניסוח בגלל Confidence פנימי.
- ליצור ספק במקום שבו השיטה הכריעה.

**Coordinator מעביר את הכרעת המנוע כפי שהיא** — לא מנוסח-מחדש, לא
מרוכך, לא מוחמר. זהו המשך-ישיר לעיקרון Source Fidelity שכבר נקבע ב-Rule
Decision Engine (`HALL_WISDOM_RULE_DECISION_ENGINE_COMPONENT_CONTRACT.md`
§14): אם ההכרעה נאמנה-למקור בשלב-הקודם, שום רכיב-ביצועי במורד-הזרם אינו
רשאי לגמד את הנאמנות הזו.

---

## 6. Primary Question Preservation

Coordinator חייב לשמור על הקשר בין:

- **השאלה המקורית** (השאלה שהמשתמש שאל).
- **ההכרעה שניתנה לה** (Primary Answer, נגזרת מ-Rule Decision הראשי).

גם אם במהלך ההרצה עולים ממצאים נוספים (Additional Findings, ר' §7),
**אסור לאבד את השאלה הראשית** או לטשטש את הקשר-הישיר בינה לבין ההכרעה
שלה.

בעתיד ה-Narrative Builder יקבל:

- `primaryQuestion`
- `primaryAnswer`
- `additionalFindings`

**כשלושה חלקים נפרדים.** Coordinator חייב להעביר אותם כמידע נפרד, ואסור
לאחד אותם לכדי טקסט-משולב אחד — האיחוד (אם בכלל) הוא תפקיד Narrative
Builder, לא Coordinator (ר' §10).

---

## 7. Additional Findings

**ממצא נוסף אינו משנה את ההכרעה לשאלה הראשית.**

דוגמה:

> **שאלה:** "האם יש כישוף?"
> **Rule Decision:** אין.
> **אבל Engine Results מצביעים על:** חולשה גופנית.

Coordinator חייב להעביר:

- **Primary Answer:** אין כישוף.
- **Additional Findings:** חולשה גופנית.

**אסור להעביר:** "אין כישוף אבל..." כאילו זו אותה תשובה. **אלה שני
אובייקטים שונים ב-Pipeline** — מיזוגם-לכדי-משפט-אחד הוא סוג-של-ניסוח
(ר' §10, Narrative Boundary), ולכן אסור ל-Coordinator לבצע אותו.

---

## 8. Confidence Policy

`confidence` הוא **Metadata בלבד**.

Coordinator שומר אותו. Coordinator מעביר אותו.

אבל: **אסור להשתמש בו כדי לשנות את ניסוח ההכרעה המקצועית.**

- אם השיטה קבעה **יש** → `primaryAnswer = יש`, **גם אם** `confidence`
  הוא 0.61.
- אם השיטה קבעה **אין** → `primaryAnswer = אין`, **גם אם** `confidence`
  נמוך.

`confidence` יכול (ברכיבים-הבאים-בשרשרת — Verification & Evidence,
Reasoning Layer) להשפיע על **איך** מציגים אי-ודאות, אך **לא** על
Coordinator עצמו: הוא רק-מעביר את הערך כפי-שהתקבל, לא-מפרש אותו ולא
פועל-לפיו.

---

## 9. Source Fidelity Reinforcement

Coordinator חייב לשמור קשר ישיר בין:

```
primaryAnswer  ←→  Rule Decisions  ←→  Source Evidence
```

**אסור ליצור `primaryAnswer` שאינו ניתן לייחוס ל-Rule Decision קיים.**
כל `primaryAnswer` שCoordinator מעביר-הלאה חייב להיות עקיב, באופן-ישיר
וניתן-לבדיקה, ל-`ruleDecisionRecords` שהתקבלו-כקלט (§3) — לא תוצר-לוואי
של תהליך-הביצוע עצמו, ולא ניסוח-חדש שנוצר במהלך ה-Execution. זהו המשך-ישיר
לעקרון Source Fidelity שכבר נקבע ב-Rule Decision Engine — Coordinator
**משמר** אותו, לא רק לא-פוגע-בו.

---

## 10. Narrative Boundary

**Coordinator אינו מנסח טקסט.**

Coordinator רק מעביר:

- `primaryAnswer`
- `additionalFindings`
- `metadata` (כולל `confidence`, `sourceEvidencePointers`, `decisionTraceReference`)

**Narrative Builder הוא שיכתוב אותם לשפה מקצועית** (Client Narrative
Builder / Advisor Narrative Builder, בהתאם ל-Handoff I,
`HALL_WISDOM_DECISION_PIPELINE_INTEGRATION_CONTRACT.md` §I).

**Coordinator אינו בוחר מילים.** אין לו שכבת-ניסוח משלו, לא-זמנית ולא-
קבועה — גם לא "ניסוח-ביניים" לצורך Trace או Debug. כל טקסט-חופשי שדרוש
לתיעוד-פנימי (למשל `stopReason`) הוא תיאור-טכני-דטרמיניסטי, לא ניסוח
מקצועי-ללקוח.

---

## 11. Execution Stages

Coordinator מריץ שישה שלבים קבועים, **לפי הסדר, ללא דילוג**:

| Stage | שם | מקור-הרשימה |
|---|---|---|
| 1 | Primary Decision | `ruleDecisionRecords` עם `decision:'required'` |
| 2 | Verification | `executionInstructions.executionGroups.verification` |
| 3 | Supporting | `executionInstructions.executionGroups.supporting` |
| 4 | Conditional | `conditionalRuleIds` (רק אלו-שה-condition/input-שלהם-התמלא **מאז** ריצת Rule Decision Engine — אם לא-התמלא, ה-Rule נשאר-מדולג ב-Stage הזה, לא-נכשל) |
| 5 | Advisor Only | `advisorOnlyRuleIds` |
| 6 | Post Validation | לא-מפעיל-מנוע — בודק שכל Stage 1-5 הושלם-תקין, שאין Rule-שרץ-פעמיים, ושאין Rule-שדולג-בלי-סיבה-מתועדת |

**אסור לדלג על Stage** — גם אם הרשימה-של-Stage מסוים ריקה, Stage 6
(Post Validation) עדיין-רץ ומתעד "0 Rules ב-Stage X" כתוצאה-לגיטימית, לא
כדילוג.

**Stage 6 אינו Rule Set Validation מחדש** — זהו תפקיד Rule Decision Engine
(`HALL_WISDOM_RULE_DECISION_ENGINE_COMPONENT_CONTRACT.md`, שלב Rule Set
Validation, שכבר-רץ **לפני** ש-Coordinator בכלל מקבל את הקלט). Stage 6 בודק
רק **שלמות-ביצוע** (כל מה-שהיה-אמור-לרוץ אכן-רץ-או-דולג-בסיבה-מתועדת) — לא
תוכן-מקצועי.

---

## 12. Rule Sequence (בתוך כל Stage)

בתוך כל Stage, Coordinator מקבל את קבוצת ה-`Rule Decisions` הרלוונטית
ומפיק `executionSequence` — סדר-ריצה-לינארי המכבד תלויות:

```
Stage 1:
  Rule A
    ↓
  Rule B   (תלוי ב-Rule A)
    ↓
  Rule C
```

**מקור-התלות**: שדה `verifies`/`supplements` על ה-`Rule Definition`
(`HALL_WISDOM_RULE_DECISION_ENGINE_COMPONENT_CONTRACT.md` §4) — אם Rule B
מפנה ל-Rule A דרך `verifies`, Rule A **חייב** לסיים-ריצה (הצלחה או כשל
מתועד) לפני ש-Rule B מתחיל.

**אסור להריץ Rule לפני שכל ה-Dependencies שלו הסתיימו.** אם תלות לא-נמצאת
באותו Stage (למשל Rule B ב-Stage 3 תלוי ב-Rule A שנמצא ב-Stage 1) — זה
תקין-מבנית (Stages רצים-לפי-סדר, כך ש-Stage 1 תמיד מסתיים לפני Stage 3
מתחיל). אם תלות מצביעה על Rule שכלל-לא-נבחר-לביצוע (למשל נדחה כ-forbidden)
— זהו מצב שכבר-היה-אמור-להיתפס ב-Rule Set Validation של Rule Decision
Engine; אם בכל-זאת מגיע ל-Coordinator, הוא מדווח `warning` ומדלג את
ה-Rule-התלוי, **אינו מנחש** תלות-חלופית.

---

## 13. Engine Adapter Architecture

Coordinator **אינו מכיר מנועים ישירות**. הוא עובד אך ורק דרך שכבת-Adapter
אחידה:

```
Engine Execution Coordinator
        ↓ (interface אחיד)
  Engine Adapter
        ↓
  ┌─────────────┬─────────────┬─────────────┐
  Kashf Adapter   Hawi Adapter   Cards Adapter
        ↓              ↓              ↓
  Kashf Engine    Hawi Engine    Cards Engine
```

כל Adapter חושף את אותו interface כלפי Coordinator (לא-מוגדר-בפירוט
בשלב-חוזה זה — יוגדר בעת המימוש, בכפוף לעיקרון: קלט אחיד `{ ruleId,
readingInputs, sourceEvidencePointers }`, פלט אחיד `{ ruleId, result,
raw, error }`). **Coordinator אינו יודע** אם Kashf Adapter קורא ל-
`kashf-narrative-writer.js`, `raml-interpreter.js`, או מודול אחר — זה
פרטי-מימוש-פנימיים-ל-Adapter.

**מודולים עתידיים** (מעבר ל-Kashf/Hawi/Cards) מתווספים כ-Adapter נוסף,
**ללא שינוי בליבת ה-Coordinator** — זו הסיבה לקיום שכבת-ה-Adapter מלכתחילה.

---

## 14. Engine Isolation

**אסור בהחלט:**

- Kashf Adapter לקרוא ל-Hawi Engine.
- Hawi Adapter לקרוא ל-Cards Engine.
- Cards Adapter לקרוא ל-Kashf Engine.
- כל שילוב-צולב אחר בין המנועים.

Coordinator הוא **השומר** של הבידוד הזה — הוא לעולם לא מעביר `readingInputs`
של קריאת-`goralHachol` ל-Adapter של `cards`, גם-אם שני ה-Domains רצים
באותו `pipelineRunId` (למשל: משתמש שמזמין גם קריאת-חול וגם קריאת-קלפים
באותה session — אלו **שתי הרצות-Coordinator נפרדות-לחלוטין**, לא הרצה
משותפת-אחת). זהו המשך-ישיר לעיקרון Domain Separation שכבר נקבע ב-Reading
Strategy Builder, Reading Planner, ו-Rule Decision Engine.

---

## 15. Execution Result — Output Contract

```js
{
  pipelineRunId,
  readingDomain,
  method,

  // --- Primary Question Preservation (§6) / Additional Findings (§7) ---
  primaryQuestion,          // השאלה המקורית, ללא שינוי
  primaryAnswer,            // ההכרעה לשאלה הראשית, נגזרת ישירות מ-Rule Decision — לא מנוסחת-מחדש
  additionalFindings,       // [{ findingId, sourceRuleId, summary }] — נפרד לגמרי מ-primaryAnswer, לעולם לא ממוזג אליו

  engineResults,        // [{ ruleId, engineId, adapterId, result, raw, sourceEvidencePointers, startedAt, endedAt }]
  stageResults,         // [{ stage: 'primaryDecision'|'verification'|'supporting'|'conditional'|'advisorOnly'|'postValidation', ruleIds, status }]
  executionTrace,       // ר' §17
  executionDuration,    // מ"ש כולל, מתחילת Stage 1 עד סוף Stage 6

  skippedRules,         // [{ ruleId, reason }] — למשל: תלות-לא-זמינה, conditional-שטרם-התמלא
  failedRules,          // [{ ruleId, engineId, error }]

  sourceEvidencePointers,   // ברמת-כל-ה-run — איחוד (union) של כל ה-sourceEvidencePointers שבבסיס primaryAnswer/additionalFindings
  decisionTraceReference,   // Reference בלבד ל-Trace הפנימי — ר' הערה למטה

  warnings,
  errors,

  stopped,
  stopComponent,
  stopReason,
  needsOrenDecision,
}
```

**חשוב: `decisionTraceReference` אינו מיועד להצגה ללקוח.** זהו מזהה/הפניה
בלבד (pointer) אל ה-Trace הפנימי (§17) — לשימוש דיבוג/Audit/Mentor
במורד-הזרם, לא תוכן-שמוצג-בטקסט-סופי. שדה זה שונה במהותו מ-
`sourceEvidencePointers`, שכן `sourceEvidencePointers` מצביע-למקור-הידע
(שיכול-בעקיפין-להיות-מוצג ללקוח/יועץ דרך Narrative Builder), בעוד
`decisionTraceReference` מצביע-לרשומת-ביצוע-טכנית בלבד.

**Coordinator אינו שולח מידע ישירות ל-Narrative.** הפלט הזה עובר ל-
Verification & Evidence (Handoff F→G,
`HALL_WISDOM_DECISION_PIPELINE_INTEGRATION_CONTRACT.md` §160) — לא ל-שני
ה-Narrative Builders ישירות.

---

## 16. Error Policy

אם Engine בודד נכשל (Adapter מחזיר `error`), Coordinator מחליט **לפי
מדיניות שתיקבע בחוזה-המימוש** (לא כעת) — אחת משלוש:

- **Continue** — ממשיך ל-Rule הבא באותו Stage.
- **Skip** — מדלג את ה-Rules-שתלויים-ב-Rule-שנכשל, ממשיך בשאר.
- **Stop** — עוצר את כל ה-Execution (למקרה של כשל בשלב Primary Decision,
  כאשר אין-טעם-להמשיך בלי-ההחלטה-העיקרית).

**בכל מקרה — Coordinator אינו משנה Rule Decisions.** כשל-ביצוע של מנוע
אינו הופך `required` ל-`unavailable` באופן-רטרואקטיבי; הוא מתועד כ-
`failedRules`, וה-`Rule Decision` המקורי (מ-Rule Decision Engine) נשאר
כפי-שהיה — Verification & Evidence (הרכיב-הבא) הוא זה שמחליט איך להתייחס
לפער בין "מה-שהוחלט" ל-"מה-שבוצע-בפועל".

**מדיניות ברירת-המחדל בין Continue/Skip/Stop לכל סוג-כשל** תוגדר בחוזה
נפרד-או-בעת-המימוש — מסמך זה קובע רק **שקיימות שלוש האפשרויות, ושהבחירה
ביניהן היא תפקיד Coordinator, לא Rule Decision Engine**.

---

## 17. Tracing

לכל Rule שרץ (או-נוסה-לרוץ), Coordinator שומר:

- מתי התחיל (`startedAt`).
- מתי הסתיים (`endedAt`).
- איזה Engine (`engineId`).
- איזה Adapter (`adapterId`).
- איזה מקור (`sourceEvidencePointers` — מועבר-הלאה מ-Rule Decision, לא-נבחן).
- איזה Output (`result`/`raw`, כפי-שהוחזר-מה-Adapter).

**אין Chain of Thought.** ה-Trace הוא רשומת-ביצוע טכנית (timing, זיהוי,
סטטוס) — **לא** הסבר-בשפה-חופשית של "למה" משהו קרה. הסבר-מהסוג-הזה, אם
נדרש, הוא תפקיד Reasoning Layer (הרכיב שאחרי Verification & Evidence),
לא Coordinator. עיקרון זהה לזה שכבר נקבע לגבי `decisionSummary` ב-Rule
Decision Engine (`HALL_WISDOM_RULE_DECISION_ENGINE_COMPONENT_CONTRACT.md`
— תבנית דטרמיניסטית, לא ניסוח-AI, לא chain-of-thought).

---

## 18. Future Support (לא מיושם כעת)

החוזה **חייב לאפשר** בעתיד, מבלי לדרוש שינוי-ארכיטקטוני:

- **Parallel Execution** — הרצת Rules-בלתי-תלויים באותו Stage
  במקביל (כרגע: לינארי-בלבד).
- **Retry Policy** — ניסיון-חוזר למנוע שנכשל, לפי מדיניות-שתיקבע.
- **Timeout Policy** — הגבלת-זמן לכל Rule/Engine.
- **Future Distributed Engines** — Adapters שמפעילים מנוע-מרוחק (לא
  in-process), מבלי לשנות את interface ה-Adapter כלפי Coordinator.

**אין לממש אף אחד מהנ"ל עכשיו.** הם מוזכרים כאן כדי ש-Output Contract
(§15) ו-Engine Adapter Architecture (§13) לא ייסגרו בצורה שתמנע הרחבה
עתידית — למשל: `executionDuration` כשדה-בודד (לא-מבנה-נעול) מאפשר בעתיד
גם `parallelExecutionDuration` בלי לשבור-תאימות.

---

## 19. Relationship to Pipeline

```
Rule Decision Engine
        ↓
Engine Execution Coordinator
        ↓
Verification & Evidence
```

- **Coordinator אינו עוקף את Rule Decision Engine** — הוא לעולם לא מפעיל
  מנוע על Rule שלא עבר דרך Rule Decision Engine עם סטטוס-מתאים
  (`required`/`allowed`-שנבחר-ב-conditional/`advisorOnly`).
- **Coordinator אינו שולח מידע ישירות ל-Narrative** (ר' §15) — הפלט שלו
  עובר תמיד דרך Verification & Evidence קודם.
- **Coordinator אינו יוצר Rule Decision חדש** — גם כשל-מנוע מתועד
  כ-`failedRules`, לא כשינוי-סטטוס.

---

## 20. Boundaries

| שאלה | תשובה |
|---|---|
| בוחר אילו Rules להריץ? | לא — Rule Decision Engine כבר בחר |
| קובע סדר-הרצה בין Stages? | כן — סדר-קבוע, לא-ניתן-לשינוי-בזמן-ריצה |
| קובע סדר-הרצה בתוך Stage? | כן — לפי Dependencies (`verifies`/`supplements`) |
| קורא/מפרש `sourceEvidence`? | לא — מעביר-הלאה בלבד |
| בונה Narrative? | לא |
| מבצע Audit? | לא |
| מפעיל AI? | לא, אף פעם |
| ניגש ל-Supabase/DB? | לא בשלב זה — טעינת-Rule-Definitions כבר-קרתה קודם ב-Rule Decision Engine |
| שומר Trace? | כן — timing + זיהוי, ללא chain-of-thought |
| משנה Rule Decision בעקבות כשל-ביצוע? | לא, לעולם לא |
| מרכך/מחמיר ניסוח הכרעה בגלל Confidence? | לא, אף פעם — `confidence` הוא Metadata בלבד |
| ממזג `primaryAnswer` ו-`additionalFindings` לטקסט אחד? | לא, לעולם לא — שני אובייקטים נפרדים תמיד |

---

## 21. סיכום היקף המסמך הזה

מסמך זה מגדיר **חוזה-רכיב בלבד** ל-Engine Execution Coordinator: מטרה,
אחריות (כן/לא), Professional Deterministic Execution Policy (שימור-נאמן
של הכרעות דטרמיניסטיות, ללא ריכוך/החמרה), Primary Question Preservation
(הפרדה תמידית בין `primaryQuestion`/`primaryAnswer`/`additionalFindings`),
Confidence Policy (Metadata בלבד, לא-משפיע-על-ניסוח), Source Fidelity
Reinforcement (קשר-ישיר primaryAnswer↔RuleDecisions↔SourceEvidence),
Narrative Boundary (Coordinator לא מנסח טקסט), שישה Execution Stages
קבועים, מנגנון Rule Sequence מבוסס-תלויות, ארכיטקטורת Engine Adapter
(Kashf/Hawi/Cards + מודולים עתידיים), בידוד-מנועים מוחלט, Output Contract
מורחב (כולל `primaryQuestion`/`primaryAnswer`/`additionalFindings`/
`decisionTraceReference`), מדיניות-שגיאות (שלוש אפשרויות בלבד,
ללא-שינוי-Rule-Decisions), Tracing ללא chain-of-thought, ותמיכה-עתידית
מתועדת-אך-לא-ממומשת (מקביליות/retry/timeout/מנועים-מרוחקים).

**לא נכתב קוד. לא נוצרו קבצים נוספים מלבד מסמך זה. לא בוצע מימוש. לא
בוצע Commit. לא בוצע Push.**
