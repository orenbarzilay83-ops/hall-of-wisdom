# HALL_WISDOM_READING_INTELLIGENCE_ARCHITECTURE_PRECOMMIT_REPORT.md

> **דוח לפני commit. לא בוצע commit. ממתין לאישורך המפורש עם רשימת-קבצים מדויקת.**
> תאריך: 2026-07-13. ענף: `claude/app-cleanup-organization-mia9b2`.

---

## 1. `git diff --stat`

אין שינוי לקבצים קיימים בשלב הזה (Reading Intelligence Phase 1 הוא כולו קבצים חדשים):
```
(no tracked-file changes from this phase)
```
לתשומת-לבך: `goral-qa-ai-payload-builder.js`/`goral-qa-output-collector.js`/`goral-qa-scenarios.js` עדיין מופיעים כ-`M` ב-`git status` — אלה משלב 4 הקודם (Knowledge + Decision Brain), **לא** משלב זה, וממתינים לאישור נפרד משלהם.

## 2. רשימת קבצים חדשים/שונו (השלב הזה בלבד)

| קובץ | שורות | סוג |
|---|---|---|
| `HALL_WISDOM_READING_INTELLIGENCE_ARCHITECTURE.md` | 373 | חדש — מסמך-האב |
| `goral-hachol/intelligence/reading-intelligence-types.js` | 98 | חדש |
| `goral-hachol/intelligence/reading-plan-schema.js` | 109 | חדש |
| `goral-hachol/intelligence/rule-decision-schema.js` | 60 | חדש |
| `goral-hachol/intelligence/system-memory-schema.js` | 96 | חדש |
| `_test_hall_wisdom_reading_intelligence_foundation.mjs` | 275 | חדש |
| `HALL_WISDOM_READING_INTELLIGENCE_ARCHITECTURE_PRECOMMIT_REPORT.md` | (זה) | חדש |

**שום קובץ קיים לא נערך בשלב הזה.**

## 3. סיכום הארכיטקטורה

Pipeline של 11 רכיבים: Question Classifier → Reading Planner → Rule Selection Engine → Engine Execution Adapter → Verification & Evidence Layer → Client Answer Builder → Advisor Explanation Builder → Hall Wisdom Audit Brain → Hall Wisdom Mentor Brain → Claude Instruction Generator → System Memory.

**מה כבר קיים ומשמש כליבה (Phase 4):** Question Classifier (#1), חלק מ-Rule Selection Engine (#3) וחלק מ-Verification Layer (#5) ו-Audit Brain (#8) — כולם ממומשים בפועל דרך `goral-hachol/brain/*` (registry/taxonomy/matrix/decision-brain/runner). **מה שחדש בארכיטקטורה הזו** הוא המסגור-לכדי-pipeline-שלם + 3 רכיבים שלא היו קיימים כלל (Reading Planner כמושג-פורמלי, Mentor Brain, Claude Instruction Generator, System Memory) + הפורמליזציה של Reading Plan/Rule Decision כסכימות עצמאיות.

Mentor Brain כפוף לשלושה איסורים קשיחים: לא ממציא חוק, לא משנה חישוב, לא מכריע במקום אורן במקרה עמום.

## 4. סכימת Reading Plan

```js
{
  method, question, questionType, topicId, intent,
  primaryDecisionRules, verificationRules, conditionalRules, supportingRules,
  advisorOnlyRules, forbiddenRules, requiredInputs, evidenceRequirements,
  expectedClientSections, expectedAdvisorSections,
  uncertaintyPolicy, contradictionPolicy, safetyPolicy,
  sourceEvidencePointers, needsOrenDecision,
}
```
ממומש כ-`createReadingPlan()`+`validateReadingPlan()` ב-`reading-plan-schema.js`. אוכף 2 אילוצים-צולבים: `forbiddenRules` לא חופפים ל-`expectedClientSections`; `advisorOnlyRules` לא חופפים ל-`expectedClientSections`.

## 5. סכימת Rule Decision

```js
{
  ruleId, decision: required|allowed|conditional|advisorOnly|forbidden|unavailable,
  reason, sourceEvidence, activationCondition, clientVisibility, confidence, needsOrenDecision,
}
```
ממומש כ-`createRuleDecision()`+`validateRuleDecision()` ב-`rule-decision-schema.js`. אוכף 2 אילוצי-ברזל: `decision==='advisorOnly'` ⇒ `clientVisibility!=='client'`; `decision==='required'` ⇒ `sourceEvidence` לא ריק.

**הבהרה:** זו הרחבה (6 ערכים, כולל `conditional` חדש) של אוצר-המילים בן-5-הערכים שכבר קיים ב-`goral-rule-applicability-matrix.js` משלב 4 (`required/allowed/advisorOnly/forbidden/notAvailable`). הקוד הקיים **לא שונה** — זו תוספת מקבילה, לא שבירה.

## 6. סכימת System Memory

```js
{
  issueId, firstSeenAt, lastSeenAt, method, questionType, topicId, ruleId,
  issueType, severity, occurrenceCount, scenarioIds, affectedFiles, sourceEvidence,
  currentStatus: open|investigating|orenDecisionRequired|fixed|verified|rejected,
  linkedFixCommit, regressionTests, notes,
}
```
ממומש כ-`createSystemMemoryEvent()`+`validateSystemMemoryEvent()` + `SystemMemoryStore` (מערך-בזיכרון-תהליך, `upsertIssueEvent`/`findIssueEvents`) ב-`system-memory-schema.js`. **חשוב:** זה זיכרון-מערכת (מעקב-בעיות), לא זיכרון-לקוח — אין קשר ל-`clientHistorySummary`/פרופיל-לקוח. **אין persistence אמיתי** בשלב הזה — המערך נעלם עם סיום-התהליך, בכוונה.

## 7. מה ממוחזר מהמערכת הקיימת

- `goral-hachol/brain/goral-question-taxonomy.js::classifyQuestionType` → Question Classifier (#1), ללא שינוי
- `goral-hachol/brain/goral-rule-applicability-matrix.js::getApplicability` → הבסיס ל-Reading Planner (#2) ו-Rule Selection Engine (#3), ללא שינוי
- `goral-hachol/brain/goral-knowledge-registry.js` → מקור-האמת ל-`sourceEvidencePointers`, ללא שינוי
- `goral-hachol/brain/goral-decision-brain.js::evaluateReading` → גרעין קיים של Verification Layer (#5) ו-Audit Brain (#8), ללא שינוי
- `goral-hachol/qa/goral-qa-output-collector.js` → הדפוס הקיים של Engine Execution Adapter (#4), ללא שינוי
- `goral-hachol/brain/goral-brain-evaluation-runner.mjs` (`recommendedFixes`/`scenariosNeedingOrenDecision`/`codeInstructionForClaude`) → גרסה ראשונית של Mentor Brain (#9) ו-Claude Instruction Generator (#10), ללא שינוי

## 8. מה עדיין חסר

- בניית `ReadingPlan` בפועל מתוך שאלה אמיתית (Phase 2)
- הרצת 12-שלבי Rule Decision Pipeline בפועל מול ה-registry (Phase 2)
- Audit Brain כהשוואה מפורשת מול Reading Plan (מעבר למה שכבר קיים ב-decision-brain) (Phase 2)
- Mentor Brain בפועל (Phase 2+, דורש אישור נפרד — זה הרכיב הכי-רגיש)
- Claude Instruction Generator בפועל (Phase 3+, דורש אישור-תהליך נפרד)
- System Memory persistence אמיתי — היכן שומרים בין הרצות (Supabase table? קובץ?) — **החלטת-ארכיטקטורה נפרדת שטרם התקבלה**
- מיפוי `goral-spiritual-diagnostics-engine.js` ל-registry (לא נסקר עדיין)

## 9. מהו שלב המימוש הבא

**לא מומלץ לקפוץ קדימה בלי אישורך.** הצעד הבא ההגיוני, בכפוף להחלטתך: לממש Reading Planner (#2) בפועל — פונקציה שבונה `ReadingPlan` אמיתי מתוך `questionType`+`method`+`topicId` תוך שימוש ב-`goral-rule-applicability-matrix.js`+`goral-knowledge-registry.js` הקיימים (ללא שינוי בהם), ולבדוק אותו מול 60 התרחישים הקיימים.

## 10. תוצאות בדיקות

```
_test_hall_wisdom_reading_intelligence_foundation.mjs   → 54 passed, 0 failed
_test_goral_knowledge_decision_brain_phase4.mjs          → 996 passed, 0 failed (ללא שינוי)
_test_goral_qa_brain_phase2.mjs                           → כל הבדיקות עברו (ללא שינוי)
_test_hall_wisdom_ai_qa_evaluator_phase3.mjs               → כל הבדיקות עברו (ללא שינוי)
_test_hall_wisdom_goral_qa_edge_mock.mjs                   → כל הבדיקות עברו (ללא שינוי)
_test_hall_wisdom_goral_qa_live_ai.mjs                      → כל הבדיקות עברו (ללא שינוי)
```
`node --check` עבר על כל קובץ `.js`/`.mjs` חדש. נבדק scan-שיבוש (קירילית) וscan-סוד (`sk-ant-...`) — אפס תוצאות. כל 15 הבדיקות שביקשת בחלק יא ממומשות ועוברות: Reading Plan תקין/בלי method/בלי questionType, rule decision עם value לא-מוכר, advisorOnly≠client-visible, forbidden∉expectedClientSections, status לא-חוקי, occurrenceCount חיובי, sourceEvidence עבור required, אין import-מנוע, אין AI call, אין fetch, אין שינוי UI/קלפים/מנועים (smoke).

## 11. אישור: אין AI חי

✅ שום קובץ בשלב הזה לא קורא ל-`fetch`/`callAnthropic`/Anthropic API. נבדק גם אוטומטית (בדיקות 11-12 בקובץ הבדיקה).

## 12. אישור: אין שינוי מנועים

✅ לא נערך שום קובץ תחת `goral-hachol/engine/`. נבדק אוטומטית — `buildKashfReading`/`interpretHawiQuestionInitial` עדיין exports תקינים בדיוק כפי שהיו (בדיקה 15).

## 13. אישור: אין שינוי UI/קלפים

✅ לא נערך `goral-hachol.html`/`goral-hachol/ui/*`/`cards.html`/`cartomancy/*`. נבדק אוטומטית — `orenAdvisorPanel` וכותרת "בינת היכל החכמה" עדיין קיימים ללא שינוי, `cards.html`/`cartomancy/ui/cards-app.js` עדיין קיימים (בדיקות 13-14).

## 14. אישור: אין deploy

✅ לא בוצע `supabase functions deploy`, לא Vercel production deploy, לא כל פעולה על `supabase/functions/*`.

## 15. אישור: אין merge ל-main

✅ כל העבודה על `claude/app-cleanup-organization-mia9b2` בלבד (`git branch --show-current` מאומת). לא נוצר ענף חדש. אין commit — ממתין לאישורך.

---

## קבצים הממתינים לאישורך לצורך commit (השלב הזה)

```
HALL_WISDOM_READING_INTELLIGENCE_ARCHITECTURE.md               (חדש)
goral-hachol/intelligence/reading-intelligence-types.js          (חדש)
goral-hachol/intelligence/reading-plan-schema.js                  (חדש)
goral-hachol/intelligence/rule-decision-schema.js                  (חדש)
goral-hachol/intelligence/system-memory-schema.js                   (חדש)
_test_hall_wisdom_reading_intelligence_foundation.mjs                 (חדש)
HALL_WISDOM_READING_INTELLIGENCE_ARCHITECTURE_PRECOMMIT_REPORT.md      (חדש)
```

(קבצי Phase 4 — `goral-hachol/brain/*`, `_test_goral_knowledge_decision_brain_phase4.mjs`, שינויי `goral-qa-*` — עדיין ממתינים לאישור נפרד משל עצמם, לפי הדוח הקודם.)
