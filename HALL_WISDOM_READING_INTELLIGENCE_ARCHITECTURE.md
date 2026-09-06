# HALL_WISDOM_READING_INTELLIGENCE_ARCHITECTURE.md — בינת היכל החכמה: מסמך-האב

> **מסמך ארכיטקטורה + PLAN. שלב זה: PLAN + Architecture + Phase 1 foundation בלבד.**
> לא בוצע ולא יבוצע בשלב הזה: תיקון מנועים, שינוי פלטים, שינוי UI, שינוי קלפים, חיבור AI חי,
> secrets חדשים, Supabase/production deploy, merge ל-`main`, ענף חדש, נגיעה ב-`inner-compass`.
> תאריך: 2026-07-13. ענף: `claude/app-cleanup-organization-mia9b2`.

---

## חלק א — מטרת המערכת

**בינת היכל החכמה (Reading Intelligence) אינה:**
- עוד מנוע חישוב (יש כבר `kashf-reading-engine.js` ו-`hawi-interpreter.js` — היא לא מחליפה אותם, לא כותבת מחדש נוסחה אחת מהם)
- עוד פאנל UI
- עוד QA runner נפרד (יש כבר `goral-hachol/qa/*` — שכבת-הבינה **בונה מעל** זה, לא משכפלת אותו)
- עוד prompt
- תחליף למקורות הספרים (`kashf-al-asrar-book.js`, ספר חאוי) — שום תוכן-בינה לא "יודע יותר" מהמקור המאושר

**בינת היכל החכמה כן:**
- שכבת ההיגיון העליונה (orchestration layer) שיושבת **מעל** המנועים הקיימים, לא בתוכם
- **מתכננת** קריאה (Reading Plan) *לפני* הרצת מנוע — מחליטה מראש אילו חוקים אמורים לפעול, לא רק בודקת בדיעבד
- **מפקחת** על בחירת-חוקים בזמן-אמת דרך Rule Decision Pipeline מפורש ובר-ביקורת
- **מבקרת** פלטים אחרי הרצה (Audit Mode) — האם המנוע עשה בפועל את מה שהתוכנית אמרה
- משמשת **חונך מקצועי** (Mentor Mode) — מציעה שיפורים, לא כופה אותם ולא מחליטה במקום אורן
- **מזהה בעיות חוזרות** במערכת לאורך זמן (System Memory) — לא רק בהרצה בודדת
- **מייצרת הוראות-תיקון מובנות לקלוד קוד** — לא קוד בעצמה, רק אבחון+המלצה מוכנה-לביצוע אחרי אישור אורן
- נשארת **נאמנה למקורות שאורן אישר בלבד** — ראו חלק ח (Source Fidelity)

**היחס לעבודה הקיימת:** שלב 4 הקודם (`HALL_WISDOM_GORAL_KNOWLEDGE_DECISION_BRAIN_PHASE4_PRECOMMIT_REPORT.md`, `goral-hachol/brain/*`) בנה את שכבת-הידע הסטטית (registry/taxonomy/matrix/rubric) ואת ה-Decision Brain הדטרמיניסטי הראשון. **הארכיטקטורה הזו לא מבטלת את זה — היא ממסגרת אותו כרכיב אחד (Rule Selection Engine + חלק מ-Verification Layer) בתוך pipeline שלם ורחב יותר.**

---

## חלק ב — Pipeline מלא

```
שאלה → סיווג → תכנון קריאה → בחירת חוקים → הרצת מנוע → אימות
     → פלט ללקוח → פלט ליועץ → Audit + Mentor → הוראת תיקון → זיכרון מערכת
```

### 1. Question Classifier
- **Input:** טקסט-שאלה חופשי, `method` (אם ידוע), `topicId` (אם ידוע)
- **Output:** `{ questionType, confidence, matchedKeywordCount }`
- **אחריות:** לזהות איזה מתוך 17 סוגי-השאלה (`goral-question-taxonomy.js`) הכי מתאים לשאלה
- **אסור לו:** להמציא סוג-שאלה חדש; להכריע topicId (זה תפקיד ה-Reading Planner)
- **קבצים קיימים למחזור:** `goral-hachol/brain/goral-question-taxonomy.js::classifyQuestionType` — **קיים ומיושם במלואו כבר משלב 4**
- **קבצים חדשים דרושים:** אין (רכיב זה כבר בנוי)
- **דטרמיניסטי / AI:** דטרמיניסטי (היוריסטיקת מילות-מפתח). שדרוג עתידי אפשרי ל-AI-assisted (לא בשלב הזה)
- **Client-facing / advisor-only:** advisor-only (פנימי לגמרי, הלקוח לא רואה סיווג)

### 2. Reading Planner
- **Input:** `method`, `question`, `questionType` (מ-#1), `topicId`
- **Output:** אובייקט `ReadingPlan` מלא (סכימה מלאה בחלק ג)
- **אחריות:** לקבוע *מראש*, לפני הרצת מנוע, אילו קטגוריות-חוק אמורות לפעול, אילו אסורות, אילו section-ים צפויים ללקוח/ליועץ
- **אסור לו:** להריץ מנוע; להמציא חוק שלא קיים ב-registry; להכריע סתירה עמומה בלי `needsOrenDecision: true`
- **קבצים קיימים למחזור:** `goral-rule-applicability-matrix.js::getApplicability`, `goral-knowledge-registry.js::getRegistryEntriesForTopic`
- **קבצים חדשים דרושים:** `goral-hachol/intelligence/reading-plan-schema.js` (סכימה+ולידציה בלבד בשלב 1; בניית-Plan-בפועל מהמטריצה היא Phase 2, לא כאן)
- **דטרמיניסטי / AI:** דטרמיניסטי
- **Client-facing / advisor-only:** advisor-only

### 3. Rule Selection Engine
- **Input:** `ReadingPlan`, רשימת רשומות-מועמדות מ-`GORAL_KNOWLEDGE_REGISTRY` (מסוננות לפי `method`+`topicId`)
- **Output:** מערך `RuleDecision[]` — אחד לכל חוק-מועמד (סכימה מלאה בחלק ד)
- **אחריות:** להריץ את 12 שלבי ה-Rule Decision Pipeline (חלק ד) על כל חוק ולהחזיר הכרעה מנומקת
- **אסור לו:** לשנות את ה-registry; להריץ מנוע; "לנחש" reason בלי evidence
- **קבצים קיימים למחזור:** `goral-decision-brain.js` (הלוגיקה הקיימת של missingRequiredRules/irrelevantAppliedRules/advisorOnlyLeaks היא **תת-קבוצה** ממומשת-בפועל של מה ש-Rule Selection Engine אמור לעשות באופן מלא)
- **קבצים חדשים דרושים:** `goral-hachol/intelligence/rule-decision-schema.js` (שלב 1: סכימה+ולידציה בלבד)
- **דטרמיניסטי / AI:** דטרמיניסטי
- **Client-facing / advisor-only:** advisor-only

### 4. Engine Execution Adapter
- **Input:** `ReadingPlan.requiredInputs`, board/mothers, `method`, `topicId`, `question`
- **Output:** הפלט הגולמי בדיוק כפי שהמנוע האמיתי מחזיר (`reading`/`result`) — **ללא שינוי**
- **אחריות:** הרכיב **היחיד** שמורשה לקרוא בפועל ל-`buildKashfReading`/`writeKashfReading`/`interpretHawiQuestionInitial`. עוטף אותם, לא משנה אותם
- **אסור לו:** לשנות פרמטר, לוגיקה, או תוצאה של המנוע; לקרוא למנוע methods שלא קיימים
- **קבצים קיימים למחזור:** `goral-hachol/qa/goral-qa-output-collector.js` — **הדפוס הזה כבר קיים ועובד** (`collectScenarioOutput`/`collectKashf`/`collectHawi`), רק לא מנוהל עדיין דרך `ReadingPlan`
- **קבצים חדשים דרושים:** אין בשלב 1 (רק תיעוד-כוונה בארכיטקטורה; המימוש בפועל של "אדפטר מונחה Reading Plan" הוא Phase 2+)
- **דטרמיניסטי / AI:** דטרמיניסטי (proxy טהור למנוע)
- **Client-facing / advisor-only:** אף אחד — זהו רכיב-תשתית פנימי

### 5. Verification & Evidence Layer
- **Input:** פלט-מנוע גולמי (מ-#4), `ReadingPlan`, `RuleDecision[]` (מ-#3)
- **Output:** רשימת בעיות (`missingRequiredRules`, `contradictionProblems`, `uncertaintyProblems`, `privacyProblems` וכו') + אימות ש-`sourceEvidencePointers` קיימים בפועל
- **אחריות:** לוודא שמה שקרה בפועל תואם למה שהתוכנית ציפתה, ושלכל טענה יש עוגן-מקור
- **אסור לו:** לשנות את הפלט; "לתקן" בעיה שמצא
- **קבצים קיימים למחזור:** `goral-hachol/qa/goral-qa-deterministic-checks.js`, `goral-hachol/brain/goral-decision-brain.js::evaluateReading` — **קיימים ומיושמים במלואם כבר משלב 4**
- **קבצים חדשים דרושים:** אין (רכיב זה כבר בנוי ברובו; חיבור מלא ל-`ReadingPlan` הוא Phase 2)
- **דטרמיניסטי / AI:** דטרמיניסטי
- **Client-facing / advisor-only:** advisor-only

### 6. Client Answer Builder
- **Input:** פלט-מנוע גולמי, `ReadingPlan.expectedClientSections`
- **Output:** טקסט/HTML ללקוח (בדיוק מה ש-`writeKashfReading()`/`finalConclusionHebrew` כבר מייצרים היום)
- **אחריות:** לסנן/להרכיב את מה שכבר מוצג ללקוח לפי התוכנית — **לא לייצר תוכן חדש**
- **אסור לו:** לכתוב משפט שלא הגיע מהמנוע; לחשוף advisorOnly
- **קבצים קיימים למחזור:** `kashf-narrative-writer.js::writeKashfReading` (mode ברירת-מחדל), `hawi-interpreter.js` (`finalConclusionHebrew`), `goral-rule-applicability.js::getSectionVisibility` — **קיימים, לא נגועים**
- **קבצים חדשים דרושים:** אין בשלב 1
- **דטרמיניסטי / AI:** דטרמיניסטי
- **Client-facing / advisor-only:** **client-facing**

### 7. Advisor Explanation Builder
- **Input:** פלט-מנוע גולמי, `RuleDecision[]`, `ReadingPlan.expectedAdvisorSections`
- **Output:** תצוגה מורחבת ליועץ — כולל dhamir/timing/temperament וכל ה-`reason`/`sourceEvidence` מכל `RuleDecision`
- **אחריות:** לתת ליועץ (אורן) שקיפות מלאה על *למה* המנוע החליט מה שהחליט
- **אסור לו:** לדלוף ללקוח (ראו רכיב #6 — נתיב נפרד לגמרי)
- **קבצים קיימים למחזור:** `writeKashfReading(reading, {mode:'advisor'})`, `advisorOnlyOutput` (כבר קיים ב-`goral-qa-output-collector.js`)
- **קבצים חדשים דרושים:** אין בשלב 1
- **דטרמיניסטי / AI:** דטרמיניסטי
- **Client-facing / advisor-only:** **advisor-only**

### 8. Hall Wisdom Audit Brain
- **Input:** `ReadingPlan`, `RuleDecision[]`, פלט-מנוע גולמי, פלט-ללקוח, פלט-ליועץ
- **Output:** ממצאי-Audit (חלק ה) — התאמה/אי-התאמה בין תוכנית לביצוע בפועל
- **אחריות:** "האם המנוע עשה מה שהתכנון אמר שיעשה" — ברמה גבוהה יותר מבדיקה בודדת
- **אסור לו:** לתקן; להריץ מנוע מחדש; להמציא ממצא בלי evidence
- **קבצים קיימים למחזור:** `goral-decision-brain.js::evaluateReading` הוא **הגרעין הקיים** של הרכיב הזה — Audit Brain הוא ההרחבה שלו להשוואה מפורשת מול `ReadingPlan` (במקום רק מול המטריצה הגולמית)
- **קבצים חדשים דרושים:** לא בשלב 1 (המימוש המלא הוא Phase 2 — כאן רק schema/types תומכים)
- **דטרמיניסטי / AI:** דטרמיניסטי
- **Client-facing / advisor-only:** advisor-only

### 9. Hall Wisdom Mentor Brain
- **Input:** ממצאי Audit Brain, `GORAL_KNOWLEDGE_REGISTRY`
- **Output:** המלצות (לא הכרעות) — חוק משלים אפשרי, ניסוח-משופר, מה נשאר advisor-only
- **אחריות:** להציע, לא להחליט
- **אסור לו (קשיח, לפי דרישתך):**
  - **לא רשאי להמציא חוק חדש** — כל המלצה חייבת `sourceEvidencePointer` קיים ב-registry
  - **לא רשאי לשנות חישוב**
  - **לא רשאי להכריע במקום אורן במקרה עמום** — כל עמימות → `needsOrenDecision: true`, לא הכרעה עצמאית
- **קבצים קיימים למחזור:** `goral-brain-evaluation-runner.mjs` (`recommendedFixes`, `scenariosNeedingOrenDecision`) — **גרסה ראשונית קיימת כבר משלב 4**
- **קבצים חדשים דרושים:** לא בשלב 1 — מימוש מלא הוא Phase 2+, ורק אחרי אישור נפרד (זהו הרכיב הכי קרוב ל"שיפוט", דורש הכי הרבה זהירות)
- **דטרמיניסטי / AI:** דטרמיניסטי בשלב 1 (מבוסס-כללים/registry בלבד). AI-assisted הוא אפשרות **עתידית**, רק אחרי אישור נפרד ומפורש — לא כלול בהיקף הזה
- **Client-facing / advisor-only:** advisor-only

### 10. Claude Instruction Generator
- **Input:** ממצאי Audit Brain + הצעות Mentor Brain, שסומנו **מאושרים על ידי אורן**
- **Output:** בלוק-הוראה מובנה (קובץ/סעיף) שקלוד קוד יכול לבצע — לא קוד, אלא: מה לבדוק, איזה קובץ, איזה שינוי מדויק, מה **לא** לגעת בו
- **אחריות:** לגשר בין "בינה מזהה בעיה" לבין "קלוד מבצע תיקון מאושר" — **בלי לדלג על שלב-האישור של אורן**
- **אסור לו:** לייצר הוראה שמבצעת שינוי-קוד ישירות בלי שלב-אישור מפורש קודם; לכלול secrets/PII בהוראה
- **קבצים קיימים למחזור:** `codeInstructionForClaude` (שדה בודד, כבר קיים ב-`goral-brain-evaluation-runner.mjs` משלב 4) — גרסה מינימלית-ביותר
- **קבצים חדשים דרושים:** לא בשלב 1 — Phase 3+ (זהו הרכיב שהכי משנה תהליך-עבודה, דורש אישור-תהליך נפרד לפני מימוש)
- **דטרמיניסטי / AI:** דטרמיניסטי (תבנית+נתונים, לא ניסוח-חופשי)
- **Client-facing / advisor-only:** advisor-only (פנימי לתהליך הפיתוח, הלקוח לעולם לא רואה)

### 11. System Memory
- **Input:** ממצאי Audit Brain לאורך זמן, מ-הרצות מרובות
- **Output:** מאגר `IssueEvent[]` (סכימה מלאה בחלק ז) — בעיות חוזרות, סטטוס-טיפול, קישור ל-commit שתיקן
- **אחריות:** לזכור בעיות **בין הרצות**, לזהות דפוסים חוזרים, להבדיל "בעיה חדשה" מ"בעיה שכבר טופלה וחזרה" (רגרסיה אמיתית)
- **אסור לו:** לשמור מידע-לקוח (זה **לא** זיכרון-לקוח, ראו הבהרה בחלק ז); לשנות סטטוס-issue בלי evidence
- **קבצים קיימים למחזור:** אין (רכיב חדש לגמרי — `goral-brain-evaluation-runner.mjs` מפיק ממצאים אבל לא שומר אותם בין הרצות)
- **קבצים חדשים דרושים:** `goral-hachol/intelligence/system-memory-schema.js` (סכימה+ולידציה+stub-אחסון-בזיכרון-תהליך-בלבד; **לא** אחסון-אמיתי/DB בשלב הזה)
- **דטרמיניסטי / AI:** דטרמיניסטי
- **Client-facing / advisor-only:** advisor-only

---

## חלק ג — Reading Plan (סכימה מלאה)

```js
{
  method: 'kashf' | 'hawi',
  question: string,
  questionType: string,              // אחד מ-17 ה-questionType ב-goral-question-taxonomy.js
  topicId: string,
  intent: string,                    // תיאור-כוונה חופשי, לצורכי-תיעוד/audit בלבד — לא נכנס ללוגיקה
  primaryDecisionRules: string[],    // ruleId[] מה-registry, ruleType==='primaryDecision'
  verificationRules: string[],       // ruleId[], ruleType==='verification'
  conditionalRules: string[],        // ruleId[], ruleType==='conditional'
  supportingRules: string[],         // ruleId[], ruleType==='supporting'
  advisorOnlyRules: string[],        // ruleId[], clientVisibility==='advisorOnly'
  forbiddenRules: string[],          // ruleId[]/category[] שאסורים לתוקן-שאלה זה
  requiredInputs: string[],          // למשל: ['board (16 houses)', 'question text']
  evidenceRequirements: string[],    // אילו sourceEvidencePointer סוגים נדרשים
  expectedClientSections: string[],  // section ids שאמורים להופיע ללקוח
  expectedAdvisorSections: string[], // section ids שאמורים להופיע ליועץ בלבד
  uncertaintyPolicy: 'mustReflectInClientText' | 'advisorOnlyNote' | 'none',
  contradictionPolicy: 'mustSurfaceToClient' | 'advisorOnlyNote' | 'blockOutputUntilResolved',
  safetyPolicy: 'standard' | 'heightened',  // heightened: health/legal/spiritual-adjacent topics
  sourceEvidencePointers: { ruleId: string, file: string, exportOrFunction: string, confidence: string }[],
  needsOrenDecision: boolean,
}
```

**כלל-ברזל:** ה-Reading Plan **חייב להיווצר לפני** הרצת המנוע (רכיב #4). אף מנוע לא רץ בלי Plan קיים ותקין. בשלב 1 (הפאונדיישן הזה) — רק הסכימה+הולידציה קיימות; **יצירת Plan בפועל מתוך שאלה אמיתית היא Phase 2**, לא כלולה כאן.

---

## חלק ד — Rule Decision Pipeline

לכל חוק-מועמד (מתוך `GORAL_KNOWLEDGE_REGISTRY`, מסונן לפי `method`+`topicId`), 12 השאלות הבאות נשאלות ברצף:

1. האם החוק קיים במקור מאושר? (`registry.approvedSource === true`)
2. האם הוא שייך לשיטה? (`registry.method === plan.method`)
3. האם הוא מתאים ל-`topicId`? (`registry.topicId === plan.topicId` או `null`/cross-cutting)
4. האם הוא מתאים ל-`questionType`? (`registry.applicableQuestionTypes.includes(plan.questionType)`)
5. האם הוא נדרש להכרעה? (`getApplicability(questionType, method, category) === 'required'`)
6. האם הוא רק אימות? (`registry.ruleType === 'verification'`)
7. האם הוא מותנה בסתירה? (`registry.ruleType === 'conditional'`, למשל formula-only-house-labeling)
8. האם הוא advisor-only? (`registry.clientVisibility === 'advisorOnly'`)
9. האם הוא מותר להצגה ללקוח? (`registry.clientVisibility === 'client'` וגם `getApplicability(...) !== 'forbidden'`)
10. האם יש מספיק inputs להפעלתו? (`registry.requiredInputs` כולם קיימים ב-`plan.requiredInputs`)
11. האם יש conflict עם חוק אחר? (שני חוקים שמסומנים `required` אך סותרים זה את זה בפלט-הצפוי)
12. האם צריך החלטת אורן? (כל "לא ברור"/עמימות מהשלבים 1-11 → `true`)

**תוצר לכל חוק:**
```js
{
  ruleId: string,
  decision: 'required' | 'allowed' | 'conditional' | 'advisorOnly' | 'forbidden' | 'unavailable',
  reason: string,                     // חובה — לא ריק, מסביר איזה שלב מ-1-12 קבע את ההכרעה
  sourceEvidence: string | null,      // חובה (לא null) כאשר decision === 'required'
  activationCondition: string | null, // למשל: "רק אם primaryFormula.verdict !== altFormula.verdict"
  clientVisibility: 'client' | 'advisorOnly' | 'hiddenUnlessRequested',
  confidence: 'high' | 'medium' | 'low',
  needsOrenDecision: boolean,
}
```

**אילוץ-ברזל (נאכף בולידציה, ראו חלק יא):** `decision === 'advisorOnly'` ⇒ `clientVisibility !== 'client'` — לעולם לא סותר.

**הערה על יחס למטריצה הקיימת (Phase 4):** `goral-rule-applicability-matrix.js` המקורי (Phase 4) מגדיר 5 ערכים בלבד (`required/allowed/advisorOnly/forbidden/notAvailable`). ה-Rule Decision הזה מוסיף `conditional` כערך נבדל (Phase 4 לא הפריד "מותנה-בסתירה" מ"נדרש תמיד") ומחליף את השם `notAvailable`→`unavailable` (לצורך-עקביות-מינוח בלבד). **זו תוספת, לא שבירה** — הקוד הקיים (`getApplicability`) ממשיך לפעול כפי שהוא; המרה בין שני האוצרות-מילים (אם תידרש) היא עבודת Phase 2.

---

## חלק ה — Audit Mode

במצב Audit, המערכת בודקת (על סמך `ReadingPlan` + `RuleDecision[]` + פלט-מנוע בפועל):

1. האם המנוע פעל לפי Reading Plan (כל `primaryDecisionRules` אכן הופעל)
2. אילו חוקים הופעלו בטעות (מופיעים בפלט אך `decision==='forbidden'`)
3. אילו חוקים חסרים (`decision==='required'` אך לא מופיעים בפלט)
4. אילו sections דלפו ללקוח (advisorOnly-marked content שמופיע ב-clientOutput)
5. האם בית טכני (formula-only) הוצג כמשמעות נושאית
6. האם יש סתירה בין תשובה קצרה, אימות והרחבה (short/verification/full narrative לא מתיישבים)
7. האם אי-הוודאות (`warnings`) מוצגת נכון לפי `uncertaintyPolicy`
8. האם הפלט נאמן למקור (`sourceRulesApplied` לא ריק כשיש תוכן מהותי)
9. האם הופיעה טענה ללא מקור (ruleId שאין לו רשומת-registry תואמת)
10. האם נדרש תיקון מנוע/ידע/routing/narrative (סיווג-סוג-הבעיה, לא רק זיהוי)

**מיפוי למימוש קיים:** בדיקות 1-3, 5, 8-9 **כבר ממומשות במלואן** ב-`goral-decision-brain.js::evaluateReading` (Phase 4) תחת שמות אחרים (`missingRequiredRules`/`irrelevantAppliedRules`/`formulaRoleLabelProblems`/`sourceFaithfulness` rubric). בדיקות 4, 6, 7 ממומשות חלקית. בדיקה 10 (סיווג-סוג-בעיה: engine/knowledge/routing/narrative) היא **חדשה**, לא קיימת עדיין — Phase 2+.

---

## חלק ו — Mentor Mode

במצב Mentor, המערכת **מציעה** (לא מכריעה):
- חוק משלים רלוונטי (מתוך registry בלבד — לא חוק שאינו קיים שם)
- בדיקת-אימות נוספת, **רק כשצריך** (למשל: `contradictionProblems` לא ריק)
- ניסוח מקצועי יותר ללקוח (תבנית, לא תוכן-מומצא)
- מה להשאיר advisor-only (על סמך `clientVisibility` הקיים ב-registry, לא שיפוט חדש)
- איך להסביר סתירה (תבנית-ניסוח, לא הכרעה-מהותית-מי-צודק)
- האם חסר מקור (בדיקת `sourceEvidencePointers` מול registry)
- האם יש יותר מדרך-הכרעה אחת (primary vs alt formula, Kashf; boardScore vs judgeVerdict, Hawi)
- האם צריך החלטת אורן לפני שינוי (ברירת-המחדל בכל עמימות)

**איסורים קשיחים (חוזר ומודגש, כי זה הרכיב הכי-רגיש בפייפליין):**
- **Mentor לא רשאי להמציא חוק חדש.** כל הצעה חייבת `sourceEvidencePointer` שכבר קיים ב-`GORAL_KNOWLEDGE_REGISTRY`.
- **Mentor לא רשאי לשנות חישוב.** אין לו גישה-כתיבה לשום מנוע — הוא קורא בלבד.
- **Mentor לא רשאי להכריע במקום אורן במקרה עמום.** כל מצב שלא נופל בבירור תחת מדיניות קיימת ⇒ `needsOrenDecision: true`, ותו-לא.

---

## חלק ז — System Memory

**הבהרה קריטית: זהו זיכרון-מערכת (issue tracking), לא זיכרון-לקוח.** אין כאן שום קשר ל-`clientHistorySummary`/פרופיל-לקוח/`localStorage` הקיים באפליקציה. זהו מאגר-פנימי-בלבד למעקב אחרי בעיות-קוד/ידע לאורך זמן, לשימוש אורן וקלוד קוד בלבד.

```js
{
  issueId: string,
  firstSeenAt: string,      // ISO date
  lastSeenAt: string,       // ISO date
  method: 'kashf' | 'hawi' | null,
  questionType: string | null,
  topicId: string | null,
  ruleId: string | null,
  issueType: string,        // למשל: 'advisorOnlyLeak' | 'missingRequiredRule' | 'sourceGap' | 'contradiction' | ...
  severity: 'high' | 'medium' | 'low' | 'none',
  occurrenceCount: number,  // מספר-שלם חיובי בלבד
  scenarioIds: string[],
  affectedFiles: string[],
  sourceEvidence: string | null,
  currentStatus: 'open' | 'investigating' | 'orenDecisionRequired' | 'fixed' | 'verified' | 'rejected',
  linkedFixCommit: string | null,
  regressionTests: string[],
  notes: string,
}
```

**המערכת צריכה לזהות (Phase 2+, לא בשלב 1):**
- בעיות חוזרות (אותו `ruleId`+`issueType` שמופיע ב->1 הרצה)
- חוקים שמופעלים שוב-ושוב בטעות
- topicIds עם מיפוי חסר (למשל 6 ה-topicId שכבר זוהו ב-Phase 4 כחסרי page-map)
- פערי-ידע (`missingKnowledge`)
- בעיות שכבר תוקנו (`currentStatus:'fixed'`/`'verified'`)
- רגרסיות שחזרו (`fixed`→ מופיע-שוב ⇒ `open` מחדש + סימון-מיוחד)
- החלטות שאורן עדיין צריך לקבל (`orenDecisionRequired`)

**שלב 1 (כאן):** רק סכימה+ולידציה+stub-אחסון-בזיכרון-תהליך (מערך JS רגיל, לא DB/קובץ). **אין אחסון-אמיתי, אין persistence חוצה-הרצות** בשלב הזה — זה יידרש להחלטה נפרדת (איפה שומרים? Supabase table? קובץ JSON בריפו? זה בעצמו שינוי-ארכיטקטורה שדורש אישור).

---

## חלק ח — Source Fidelity (מדיניות קשיחה)

1. **להשתמש רק במקורות שאורן אישר** — `kashf-al-asrar-book.js`, ספר חאוי (Drive ID מתועד ב-CLAUDE.md), ולא מקור אחר.
2. **לא להשתמש בידע חיצוני כדי להשלים חוק חסר.** אם `GORAL_KNOWLEDGE_REGISTRY` לא מכיל רשומה — אין רשומה. נקודה.
3. **כל המלצה מקצועית המבוססת-חוק חייבת `sourceEvidencePointer`.** המלצה בלי evidence היא לא המלצה תקפה.
4. **אם המקור לא קיים/לא ברור:** `missingKnowledge: true`, `needsOrenDecision: true`. לעולם לא ממולא בניחוש (עקבי לחלוטין עם CLAUDE.md §"No Invented Data — EVER").
5. **לא להעמיד פנים שהמערכת יודעת.** `confidence: 'low'` הוא ערך לגיטימי ותכוף, לא כשל.
6. **לא לערבב בין Kashf לחאווי.** כל `RuleDecision`/`ReadingPlan` נושא `method` יחיד; אין "מיזוג-חוקים" בין השיטות (עקבי עם CLAUDE.md §"כשף ≠ חאוי").
7. **לא לערבב בין מקור, engine behavior ופרשנות AI.** שלושה שכבות נבדלות תמיד: (א) מה שהספר אומר, (ב) מה שהמנוע-בפועל עושה עם זה, (ג) כל שכבת-AI עתידית — **לעולם לא מוצגות כמקור אחד**.

---

## חלק ט — Integration עם מה שכבר קיים

| קובץ/תיקייה | סימון | הערה |
|---|---|---|
| `goral-hachol/brain/*` (Phase 4: registry/taxonomy/matrix/rubric/decision-brain/runner) | **extend** | הליבה של רכיבים #1,#2,#3,#5,#8,#9 בפייפליין החדש — לא נכתב-מחדש |
| `goral-hachol/qa/*` (output-collector/deterministic-checks/ai-payload-builder/scenarios) | **keep** | ממשיך לשמש כ-scenario-testing harness עצמאי; Reading Intelligence הוא שכבה נוספת מעליו, לא מחליף אותו |
| `goral-hachol/engine/goral-rule-applicability.js` | **keep — do not touch** | הקובץ החי שמפעיל את שער-ה-visibility בפועל באפליקציה; שכבת-הבינה קוראת ממנו, לא כותבת אליו |
| `goral-hachol/engine/kashf-reading-engine.js` | **do not touch** | מנוע-ליבה. Engine Execution Adapter (#4) עוטף, לא נוגע |
| `goral-hachol/engine/kashf-narrative-writer.js` | **do not touch** | Client/Advisor Answer Builders (#6,#7) קוראים ממנו בלבד |
| `goral-hachol/engine/hawi-interpreter.js` | **do not touch** | מנוע-ליבה |
| `goral-hachol/engine/goral-conclusion-writer.js` | **do not touch** | מנוע-ליבה |
| `goral-hachol/engine/goral-spiritual-diagnostics-engine.js` | **do not touch** | מנוע-ליבה נפרד, לא נסקר עדיין ב-registry לעומק — פוטנציאל ל-Phase 2 (מיפוי-בלבד, לא שינוי) |
| `supabase/functions/oren-smart-advisor/*` | **keep** | תשתית Edge Function קיימת (MOCK בלבד, כפי שנפרס ב-deploy הקודם) — לא נוגעים בשלב הזה |
| `ai/prompts/hall-wisdom-goral-qa-evaluator.prompt.md` | **keep** | prompt נפרד קיים לצורך AI evaluator עתידי של ה-QA — לא קשור ישירות ל-Reading Intelligence, לא נערך |

**אין "replace later" ברשימה הזו כרגע** — שום קובץ קיים לא מיועד-להחלפה. הארכיטקטורה בנויה במפורש כשכבה-נוספת, לא כתחליף.

---

## חלק י — Foundation Implementation (Phase 1, מאושר לביצוע בשלב הזה)

4 קבצי-schema/types חדשים + קובץ-בדיקה, כולם תחת `goral-hachol/intelligence/`:

| קובץ | תוכן |
|---|---|
| `reading-intelligence-types.js` | קבועים/enums משותפים (METHODS, RULE_DECISION_VALUES, CLIENT_VISIBILITY_VALUES, CONFIDENCE_VALUES, SEVERITY_VALUES, ISSUE_STATUS_VALUES, UNCERTAINTY_POLICY_VALUES, CONTRADICTION_POLICY_VALUES, SAFETY_POLICY_VALUES) + type guards (`isMethod`, `isRuleDecisionValue`, וכו') |
| `reading-plan-schema.js` | `createReadingPlan(input)`, `validateReadingPlan(plan)` — סכימה+ולידציה בלבד, אין בניית-Plan-אמיתית מתוך שאלה (זה Phase 2) |
| `rule-decision-schema.js` | `createRuleDecision(input)`, `validateRuleDecision(decision)` — כולל אכיפת האילוץ `advisorOnly ⇒ clientVisibility !== 'client'` |
| `system-memory-schema.js` | `createSystemMemoryEvent(input)`, `validateSystemMemoryEvent(event)` + `SystemMemoryStore` — **מערך-בזיכרון-תהליך בלבד, לא DB/קובץ** |

**מפורשות, מה הקבצים האלה *לא* מכילים:** אין קריאה למנוע (לא `import` מ-`goral-hachol/engine/*`), אין קריאת-AI (`fetch`/`callAnthropic`), אין persistence אמיתי (DB/קובץ/localStorage), אין UI, אין שינוי-התנהגות לשום דבר קיים.

---

## חלק יא — בדיקות חובה (ראו `_test_hall_wisdom_reading_intelligence_foundation.mjs`)

1. Reading Plan תקין עובר validation
2. Reading Plan בלי `method` נכשל
3. Reading Plan בלי `questionType` נכשל
4. rule decision עם `decision` לא-מוכר נכשל
5. `advisorOnly` rule לא יכול להיות `clientVisibility:'client'`
6. חוק ב-`forbiddenRules` לא יכול להיכלל גם ב-`expectedClientSections` (אותו plan)
7. system memory event עם `currentStatus` לא-חוקי נכשל
8. `occurrenceCount` חייב להיות מספר-שלם חיובי
9. `sourceEvidence` נדרש לחוק שמסומן `decision==='required'`
10. אין import למנועי Kashf/Hawi בקבצי `intelligence/`
11. אין AI call (`callAnthropic`) בקבצי `intelligence/`
12. אין `fetch` בקבצי `intelligence/`
13. אין שינוי UI (smoke: `goral-hachol.html`/`orenAdvisorPanel` ללא שינוי)
14. אין שינוי קלפים (smoke: `cards.html`/`cartomancy/` קיימים ללא שינוי)
15. אין שינוי מנועים (smoke: exports מרכזיים של `kashf-reading-engine.js`/`hawi-interpreter.js` עדיין קיימים בדיוק כפי שהיו)

---

## סיכום היקף Phase 1 (מה שהמסמך הזה מאשר לביצוע עכשיו)

✅ מסמך ארכיטקטורה זה
✅ 4 קבצי schema/types חדשים תחת `goral-hachol/intelligence/`
✅ קובץ-בדיקה אחד
✅ Precommit Report

❌ שום דבר אחר. במפורש לא: בניית Reading Plan אמיתי מתוך שאלה, Rule Selection Engine מלא, Audit/Mentor Brain בפועל, Claude Instruction Generator בפועל, System Memory persistence אמיתי, כל חיבור ל-Supabase/AI חי, כל שינוי-מנוע/UI/קלפים.
