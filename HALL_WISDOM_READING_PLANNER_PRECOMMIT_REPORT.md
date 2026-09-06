# HALL_WISDOM_READING_PLANNER_PRECOMMIT_REPORT.md

> **דוח לפני commit. לא בוצע commit. לא בוצע push.**
> תאריך: 2026-07-13. ענף: `claude/app-cleanup-organization-mia9b2`.
> שלב: **מימוש בפועל** של Reading Planner — הרכיב השלישי-שמומש-בפועל ב-Hall of Wisdom Core (אחרי Intent Analyzer ו-Reading Strategy Builder), לפי `HALL_WISDOM_READING_PLANNER_COMPONENT_CONTRACT.md` ו-`HALL_WISDOM_DECISION_PIPELINE_INTEGRATION_CONTRACT.md`.
> **עודכן** — סבב-סגירת-פער: הפער שדווח בסעיף 5 (`validateStrategyResult` לא-תמך ב-`cards`) **נסגר**. Reading Strategy Builder קיבל תמיכה רשמית ב-`readingDomain:'cards'`/`method:'cartomancy'`. Reading Planner **לא נגע** בסבב הזה.

---

## 0. סגירת פער-האינטגרציה (סבב חדש)

**הפער שהתגלה בסבב הקודם (סעיף 5 המקורי):** `validateStrategyResult()` ב-`reading-strategy-builder.js` הכיר רק `method:'kashf'/'hawi'` וקטלוג-קטגוריות goralHachol-בלבד — קריאה אמיתית ל-`readingStrategy` עבור `readingDomain:'cards'` לא הייתה יכולה לעבור אותו, למרות ש-Reading Planner עצמו כבר תמך ב-cards במלואו. זה שבר את השרשרת `Intent Analyzer → Reading Strategy Builder → Reading Planner` עבור קלפים.

**איך נוספה תמיכה ב-`readingDomain:'cards'`:**
1. **`reading-strategy-types.js`** — נוספו `READING_DOMAINS`/`METHOD_BY_DOMAIN` (עותק-מקומי, לא ייבוא-הדדי מ-`reading-planner-types.js`, כדי למנוע circular import — שני הקבצים חייבים-להישאר-מסונכרנים-ידנית, מתועד בהערת-קוד). קטלוג `STRATEGY_CONSTRAINT_CATEGORIES` הורחב ב-3 קטגוריות-cards-ייחודיות (`relationshipRelevantRules`, `technicalSpreadDetails`, `spiritualDiagnostics`) ונוסף `CATEGORY_DOMAINS` — מיפוי לכל קטגוריה אילו-domain-ים מותרת-בהם (משותפות: `hiddenThought`/`timing`/`characterNature`/`verification`/`contradictionResolution`/`outcomeRules`/ועוד; goralHachol-בלעדיות: `*Rules`-suffixed/`dhamir`/`technicalFormulaDetails`; cards-בלעדיות: 3 החדשות). נוספה `PRIMARY_EVIDENCE_CATEGORIES_BY_INTENT_CARDS` — מיפוי מינימלי-וכללי (12 intents, ללא שום ידע-מקצועי-על-קלפים) ו-`spiritualCategoryForDomain()` (מתרגם `'spiritual'`→`'spiritualDiagnostics'` עבור cards).
2. **`reading-strategy-builder.js`** — `resolveConstraints()`/`buildReadingStrategy()` הפכו domain-aware: `readingDomain` (ברירת-מחדל `'goralHachol'` כשלא-סופק, **לתאימות-לאחור מלאה**), `spreadId` נוספו לקלט/פלט; `mustInclude`/`mayInclude`/`mustExclude`/`advisorOnly`/`forbiddenWithoutQuestion` כולם עוברים דרך המיפוי הדומיין-מודע (`dhamir` **לעולם** לא נוסף עבור cards; `mayInclude` מסונן-לקטגוריות-חוקיות-לדומיין). `validateStrategyInput`/`validateStrategyResult` עודכנו: `method` נבדק מול `readingDomain` (לא מול רשימה-קבועה), קטגוריות נבדקות מול `isKnownConstraintCategoryForDomain` (לא רק existence — גם domain-exclusivity), נוסף אימות-חוצה-domain ל-`knowledgeContext`.
3. **תאימות-לאחור מאומתת:** לפני העדכון: 238 assertions ב-Reading Strategy Builder, כולן-מבוססות-על-goralHachol. אחרי העדכון (רק תוספת `readingDomain`/`spreadId` לפלט, ללא שינוי-ערך בשום שדה-קיים-אחר): **237/238 עברו-מיד**, ה-assertion היחיד-שנכשל היה בדיקת-מספר-שדות-קבועה (23→25, כצפוי מהוספת 2 שדות) — עודכנה, וכל 238 המקוריות חוזרות-לעבור. **אף לוגיקת-goralHachol-קיימת לא השתנתה במשמעות.**

**קבצים שהשתנו (מדויק, כפי שאושר):**
- `goral-hachol/intelligence/reading-strategy-types.js`
- `goral-hachol/intelligence/reading-strategy-builder.js`
- `_test_hall_wisdom_reading_strategy_builder.mjs`
- `_test_hall_wisdom_reading_planner.mjs` (רק שני-תרחישי-הקלפים עודכנו משימוש-ב-mock לשימוש-בשרשרת-האמיתית)
- `HALL_WISDOM_READING_PLANNER_PRECOMMIT_REPORT.md` (זה)

**Reading Planner עצמו (`reading-planner.js`/`reading-planner-types.js`/`reading-planner-validators.js`) לא נערך כלל בסבב הזה.**

---

## 1. `git diff --stat`

```
(ריק — אין שינוי לשום קובץ עקוב-גיט קיים, כל השינוי הוא קבצים חדשים בלבד)
```

## 2. קבצים חדשים/שונו

| קובץ | שורות | תפקיד |
|---|---|---|
| `goral-hachol/intelligence/reading-planner-types.js` | 91 | Single source of truth: `PLAN_VERSION`, `READING_DOMAINS`, `METHOD_BY_DOMAIN` (כולל `'cartomancy'`, ר' סעיף 5), `WARNING_TYPES` (11), `WARNING_SEVERITY_VALUES` (4), reuse של `RULE_DECISION_VALUES`/`STRATEGY_CONSTRAINT_CATEGORIES`. |
| `goral-hachol/intelligence/reading-planner.js` | 330 | המנוע: `buildReadingPlan()` — resolve categories (precedence-ordered), execution order, client/advisor visibility, plannerReason, Stop Result. |
| `goral-hachol/intelligence/reading-planner-validators.js` | 206 | `validatePlannerInput()`/`validatePlannerResult()` — קובץ נפרד, כפי שהתבקש. |
| `_test_hall_wisdom_reading_planner.mjs` | 427 | 202 assertions. |

**שום קובץ קיים לא נערך.** `git status --short` מציג רק את 4 הקבצים החדשים למעלה (+ 5 מסמכים untracked מסבבים קודמים, לא-נגועים).

---

## 3. Input Contract (כפי שמומש)

```js
{
  question,                // חובה, לא-ריק
  readingDomain,             // חובה, 'goralHachol' | 'cards'
  method,                     // חובה, חייב-להתאים ל-readingDomain
  spreadId,                    // אופציונלי
  topicId,                      // אופציונלי
  questionType,                  // חובה
  intentResult,                   // חובה, עובר validateIntentResult
  readingStrategy,                  // חובה, עובר validateStrategyResult
  knowledgeContext,                  // אופציונלי (טרם-מחובר בפועל)
  availableRuleCategories,             // אופציונלי
  sourceEvidencePointers,                // אופציונלי
  advisorMode, clientMode,                 // אופציונליים
}
```

`buildReadingPlan()` **אינו מוודא את הקלט בעצמו** — עקבי עם המוסכמה הקיימת ב-`analyzeIntent()`/`buildReadingStrategy()`: `validatePlannerInput()` הוא השער הנפרד שהקורא מריץ לפני קריאה ל-`buildReadingPlan()`. **אין ניתוח-מחדש של השאלה, אין בחירת-Intent חדש, אין שינוי `topicId`/`method`.**

**אם `intentResult.requiresClarification` או `readingStrategy.requiresClarification` הם `true`** — `buildReadingPlan()` **אינו** בונה תוכנית מלאה: הוא מחזיר Stop Result (`{ stopped:true, stopComponent:'readingPlanner', stopReason, recoverable:true, requiresClarification:true, clarificationQuestion, needsOrenDecision:true }`) ולא נוגע בשאר-הלוגיקה כלל.

---

## 4. Output Contract (כפי שמומש — 36 שדות בתוכנית מלאה)

זהה-במדויק לחוזה שאושר ב-`HALL_WISDOM_READING_PLANNER_COMPONENT_CONTRACT.md` §3 — `planId, planVersion, readingDomain, method, spreadId, topicId, questionType, primaryIntent, strategyId, goal`, שבע קטגוריות-ההחלטה, `requiredInputs/missingInputs/evidenceRequirements/sourceEvidencePointers`, שלוש-visibility, `executionOrder/verificationOrder` + 5 policies, `plannerWarnings/plannerReason/confidence/requiresClarification/clarificationQuestion/needsOrenDecision`. מאומת אוטומטית ב-test §"Output contract shape".

**הבהרת-עיצוב:** `evidenceRequirements` הוא מערך-אובייקטים `{category, satisfied}` (לא רק שמות) — כדי ש-`requiredInputs`/`missingInputs` יוכלו להיגזר ממנו בבירור (`requiredInputs` = כל השמות, `missingInputs` = תת-הקבוצה הלא-מסופקת), נגד `sourceEvidencePointers` שסופק בקלט.

---

## 5. Domain/Method Mapping

```
readingDomain === 'goralHachol'  →  method ∈ { 'kashf', 'hawi' }
readingDomain === 'cards'         →  method === 'cartomancy'
```

**`'cartomancy'` אומת מול הקוד הקיים, לא הומצא** (בדיקה חוזרת, זהה לזו שכבר בוצעה ב-Component Contract): תיקיית-המודול היא `cartomancy/`, מזהה-האחסון `cartomancyReadingsArchive_v1_${uid}` (`cartomancy/ui/cards-app.js:41`), וקבצי-QA כבר מתייחסים אליו כ-`'cartomancy/**'`. אין קבוע `method`-מפורש בקוד-הקלפים עצמו (רק שיטה-אחת קיימת) — `'cartomancy'` הוא הבחירה העקבית-היחידה. `spreadId` הידועים (`'three'`, `'past-present-future'`) נלקחו מ-`state.spread` ב-`cartomancy/ui/cards-app.js` כקטלוג-ידוע, **בלי לייבא** את הקובץ עצמו.

**✅ עודכן — הפער נסגר (ר' סעיף 0 למעלה).** `validateStrategyResult()`/`validateStrategyInput()` ב-`reading-strategy-builder.js` תומכים כעת רשמית ב-`readingDomain:'cards'`/`method:'cartomancy'`, כולל בדיקת domain-exclusivity לקטגוריות. `readingStrategy` אמיתי עבור `readingDomain:'cards'` **עובר כעת** את `validateStrategyResult()` בהצלחה (ר' תרחישים 6-7 בסעיף 10, המשתמשים כעת בשרשרת האמיתית, לא ב-mock).

---

## 6. Constraints Enforcement (כפי שמומש)

אלגוריתם precedence-ordered מבטיח שכל קטגוריה שייכת לכל-היותר לדלי-החלטה אחד (בהתאם ל-8 הכללים שנדרשו):

1. `mustInclude` → `primaryDecisionCategories`, אחרת `plannerWarning: missingRequiredCategory`.
2. `mustExclude` → `forbiddenCategories`.
3. `advisorOnly` → `advisorOnlyCategories`, לעולם לא ל-`expectedClientSections` (נאכף גם ב-validator).
4. `requiresEvidence` → `evidenceRequirements` (רק לקטגוריות שבפועל בתוכנית — primary/verification).
5. `forbiddenWithoutQuestion` → `forbiddenCategories` (Reading Strategy Builder כבר הסיר ממנו קטגוריות-שכן-נשאלו — Planner סומך על כך, לא בודק-מחדש).
6. קטגוריה לא-יותר-ממערך-אחד — precedence: conflicting (מוצא-מכל-הדליים) → forbidden → unavailable → advisorOnly → primaryDecision → verification → supporting → conditional.
7. קונפליקט `mustInclude`∩`mustExclude` → `needsOrenDecision:true` + `plannerWarning: conflictingConstraints` (severity `critical`) — הקטגוריה **לא** מוצבת בשום דלי (לא נבחר-צד-שרירותית).
8. קטגוריה `unavailable` (לפי `availableRuleCategories`, אם סופק) — לא נכנסת ל-`executionOrder`.

---

## 7. Execution Order (כפי שמומש)

ברירת-מחדל `['primaryDecision','verification','conditional','supporting','advisorOnly']`, מסונן-לשלבים-עם-תוכן-בפועל בלבד (סדר-קבוע, לא-משתנה). `forbidden`/`unavailable` **לעולם** לא נכנסים (הם שמות-דליים, לא שלבי-ביצוע). אם `primaryDecisionCategories` ריק → `plannerWarning: missingRequiredCategory`.

## 8. Stop Behavior (כפי שמומש)

טריגר: `intentResult.requiresClarification===true` **או** `readingStrategy.requiresClarification===true`. מחזיר **אך ורק** את מבנה ה-Stop Result (6 שדות) — **לא** מכיל אף אחד מ-36 שדות-התוכנית-המלאה (מאומת ב-test).

## 9. Warnings (כפי שמומש)

11 סוגים (`WARNING_TYPES`), 4 רמות-severity (`info/warning/error/critical` — **שונה במכוון** מ-`SEVERITY_VALUES` הקיים ב-`reading-intelligence-types.js` [`high/medium/low/none`], כפי שנדרש עבור הרכיב הזה ספציפית). כל warning: `{warningType, severity, message, affectedCategory, needsOrenDecision}`. `conflictingConstraints` תמיד `needsOrenDecision:true`.

---

## 10. דוגמאות פלט (12 התרחישים הנדרשים)

1. **Business Prediction** ("האם העסק החדש יצליח?", hawi) — `primaryDecisionCategories:['outcomeRules','businessRelevantRules']`, `forbiddenCategories` כוללת `hiddenThought/timing/spiritual`. ✅ תואם-לחלוטין לצפוי.
2. **Decision Support** ("האם כדאי לי לפתוח עסק?", hawi) — `primaryDecisionCategories:['outcomeRules','currentStateRules']`.
3. **Hidden Thought** ("מה הוא חושב עליי?", kashf) — `dhamir`/`technicalFormulaDetails` ב-`advisorOnlyCategories`, לא ב-`expectedClientSections`.
4. **Timing** ("מתי העסק יתחיל להרוויח?", hawi) — `timing` **לא** ב-`forbiddenCategories` (נשאל), `timingPolicy:'includeAsPrimary'`.
5. **Hawi/Spiritual** ("מה מצבו?" עם `questionTypeHint:'spiritual'`) — `spiritualPolicy:'includeIfRelevant'` (מדיניות-רמת-אסטרטגיה גמישה, בעוד `spiritual` עדיין ב-`mustExclude`-הקשיח של `stateAssessment` — שתי-מנגנונים-שונים, שניהם עובדים-נכון).
6-7. **Cards** (Relationship State / Decision Support) — **עודכן: שרשרת אמיתית מקצה-לקצה, לא mock.** "האם אנחנו מתאימים?" → `primaryIntent:'compatibility'` → `readingStrategy` תקין (`readingDomain:'cards'`, `method:'cartomancy'`) → `readingPlan` תקין, `relationshipRelevantRules` ב-`primaryDecisionCategories`, `technicalSpreadDetails` ב-`advisorOnlyCategories` בלבד. "האם כדאי לי לפתוח עסק?" → `primaryIntent:'decisionSupport'`, `outcomeRules` (קטגוריה-משותפת) ב-`primaryDecisionCategories`. שני התרחישים עוברים `validatePlannerInput()` **ו-**`validatePlannerResult()` בהצלחה-מלאה.
8. **Ambiguous question → stop** ("מה קורה בעסק?") — Stop Result תקין.
9. **Domain mismatch → validation failure** — `validatePlannerInput()` דוחה `readingDomain:'cards'`+`method:'hawi'`.
10. **Conflicting constraints → needsOrenDecision** — תרחיש-סינתטי, `needsOrenDecision:true` + warning.
11. **Missing evidence → warning** — `contradictionResolution` חסר-evidence מייצר warning רך (`needsOrenDecision:false`); תרחיש-חיובי-מקביל מראה `missingInputs` מתרוקן כש-evidence מסופק.
12. **Advisor-only leak attempt → blocked** — `validatePlannerResult()` דוחה פלט-מזוייף עם קטגוריית-advisorOnly ב-`expectedClientSections`.

כל 12 התרחישים נבדקו ועברו בפועל — לא תיאור-בלבד.

---

## 11. מספר Assertions (עודכן)

- `_test_hall_wisdom_reading_planner.mjs`: **205** (היה 202 — 3 נוספו/שונו בעדכון תרחישי-הקלפים מ-mock לשרשרת-אמיתית).
- `_test_hall_wisdom_reading_strategy_builder.mjs`: **282** (היה 238 — 44 assertions חדשות: תמיכת-Cards, 2 תרחישי-אינטגרציה מלאים (עמום + full-plan), 8 negative tests, sanity על `READING_DOMAINS`/`METHOD_BY_DOMAIN`).

מכסה (מעבר למה שכבר תועד): output-contract shape (25 שדות, כולל `readingDomain`/`spreadId`), Cards strategy behavior (ללא `dhamir`/`technicalFormulaDetails`), Integration Test מלא (Intent→Strategy→Planner, cards), 8 Negative Tests (§8 למטה), structural guards (אין ייבוא `cartomancy/`).

## 12. תוצאות Regression (הורצו-מחדש לאחר סגירת-הפער)

```
_test_hall_wisdom_reading_planner.mjs                 → 205 passed, 0 failed
_test_hall_wisdom_intent_analyzer.mjs                  → 208 passed, 0 failed (ללא שינוי — לא נגוע)
_test_hall_wisdom_reading_strategy_builder.mjs          → 282 passed, 0 failed
_test_goral_knowledge_decision_brain_phase4.mjs          → 1010 passed, 0 failed (זהה-לחלוטין — Kashf/Hawi לא השתנו)
_test_hall_wisdom_reading_intelligence_foundation.mjs     → 54 passed, 0 failed
_test_goral_qa_brain_phase2.mjs                            → כל הבדיקות עברו
_test_hall_wisdom_ai_qa_evaluator_phase3.mjs                → כל הבדיקות עברו
```
**כל 7 הסוויטות ירוקות במלואן. Kashf/Hawi מאומתים כלא-שונים (1010 תוצאות-Decision-Brain זהות-בייט-לבייט לפני/אחרי). Cards support נוסף בלי לשבור אף Domain אחר.**

## 12א. תוצאות Negative Tests (כולן עברו)

| בדיקה | תוצאה |
|---|---|
| `cards` + `method:'kashf'` | ✅ נכשל-validation (גם `validateStrategyResult` וגם `validateStrategyInput`) |
| `cards` + `method:'hawi'` | ✅ נכשל-validation |
| `goralHachol` + `method:'cartomancy'` | ✅ נכשל-validation |
| `cards` עם `knowledgeContext:{readingDomain:'goralHachol'}` | ✅ נדחה |
| `goralHachol` עם `knowledgeContext:{readingDomain:'cards'}` | ✅ נדחה |
| `spreadId` שונה (`spread-a` מול `spread-b`) לא-משנה `primaryIntent`/`strategyConstraints` | ✅ מאומת-זהה |
| אין ייבוא `cartomancy/` ב-Strategy Builder | ✅ מאומת (structural guard) |
| אין ייבוא בשם `cartomancy-data`/`spread-policy-engine` | ✅ מאומת |

---

## 13. אישור — אין שינוי מנועים

✅ שום קובץ תחת `goral-hachol/engine/` או `cartomancy/` לא נערך ולא נגוע — מאומת אוטומטית (structural guard) וידנית.

## 14. אישור — אין שינוי QA קיים

✅ `goral-hachol/qa/*` לא נערך כלל. `_test_goral_qa_brain_phase2.mjs`/`_test_hall_wisdom_ai_qa_evaluator_phase3.mjs` ירוקים-במלואם.

## 15. אישור — אין שינוי UI/קלפים/Supabase

✅ `goral-hachol.html`/`goral-hachol/ui/*`/`cards.html`/`cartomancy/*`/`supabase/*` לא נגועים.

## 15א. אישור — לא נוספו חוקי קלפים

✅ שום שם-פריסה, Rule ID, פירוש-קלף, או משמעות-קלפים לא הומצא. `PRIMARY_EVIDENCE_CATEGORIES_BY_INTENT_CARDS` (חדש) מכיל אך-ורק שמות-קטגוריה-מבניים (`relationshipRelevantRules`/`outcomeRules`), זהה-בעיקרון-מבני ל-goralHachol. `spreadId` (`'three'`) הוא ערך-context-שהמשתמש-מספק, לא ערך-שה-Strategy-Builder בוחר/ממציא.

## 15ב. אישור — Reading Planner לא שונה מעבר לבדיקות

✅ `goral-hachol/intelligence/reading-planner.js`, `reading-planner-types.js`, `reading-planner-validators.js` — שלושתם **זהים-בייט-לבייט** לגרסה שאושרה בסבב הקודם. רק `_test_hall_wisdom_reading_planner.mjs` עודכן (2 תרחישי-קלפים עברו מ-mock לשרשרת-אמיתית).

## 16. אישור — אין AI חי

✅ שום `callAnthropic`/`ANTHROPIC_API_KEY` — מאומת אוטומטית.

## 17. אישור — אין fetch

✅ שום קריאת `fetch(...)` — מאומת אוטומטית.

## 18. אישור — אין deploy

✅ לא בוצע.

## 19. אישור — אין merge ל-main

✅ לא בוצע. כל העבודה על `claude/app-cleanup-organization-mia9b2` בלבד. לא נוצר branch חדש.

## 20. הרכיב הבא בלבד

**Rule Decision Engine Component Contract** — לפי ה-Pipeline (`HALL_WISDOM_DECISION_PIPELINE_INTEGRATION_CONTRACT.md`, Handoff D→E) ו-Roadmap (`HALL_WISDOM_CORE_ARCHITECTURE.md`, שלב 5 מתוך 16). **לא הותחל** בסבב הזה.

---

## סיכום

לא commit. לא push. לא הותחל Rule Decision Engine. לא שונתה ארכיטקטורה. **פער-האינטגרציה שדווח בסבב הקודם נסגר במלואו** — Intent Analyzer → Reading Strategy Builder → Reading Planner עובד כעת מקצה-לקצה עבור שני ה-Domains (`goralHachol`, `cards`), מאומת ב-205+282 assertions ורגרסיה מלאה ללא שינוי-תוצאה ב-Kashf/Hawi.
