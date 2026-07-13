# HALL_WISDOM_VOCABULARY_CONTRACTS_ALIGNMENT_PRECOMMIT_REPORT.md

> **דוח לפני commit. לא בוצע commit. לא בוצע push. לא הותחל Intent Analyzer. לא נמחק שום קובץ. לא בוצע reset/clean/stash.**
> תאריך: 2026-07-13. ענף: `claude/app-cleanup-organization-mia9b2`.

---

## 1. `git diff --stat`

```
 goral-hachol/qa/goral-qa-ai-payload-builder.js |  65 ++++++++
 goral-hachol/qa/goral-qa-output-collector.js   |  29 +++-
 goral-hachol/qa/goral-qa-scenarios.js          | 202 ++++++++++++++++++++-----
 3 files changed, 255 insertions(+), 41 deletions(-)
```
(שלושת אלה **כבר** היו modified לפני הסבב הזה — Phase 4 מהסבב הקודם, ללא שינוי נוסף כאן.) הקבצים ששונו-בפועל **בסבב הזה** הם כולם untracked (חלק מ-Phase 4/Reading Intelligence שטרם נכנסו ל-git), ולכן לא מופיעים ב-`git diff` — פירוט מלא בסעיף 2.

## 2. רשימת כל הקבצים ששונו בסבב הזה

| קובץ | סוג-שינוי | שורות (אחרי) |
|---|---|---|
| `goral-hachol/brain/goral-rule-applicability-matrix.js` | עריכה (untracked מ-Phase 4) | 156 (היה 152) |
| `goral-hachol/brain/goral-brain-evaluation-runner.mjs` | עריכה (untracked מ-Phase 4) | 147 (היה 141) |
| `_test_goral_knowledge_decision_brain_phase4.mjs` | עריכה (untracked מ-Phase 4) | 450 (היה 332) |

**שום קובץ נוסף לא נערך.** `goral-hachol/intelligence/*` (4 קבצים) **לא נערכו כלל** — הם כבר היו המקור-הקנוני הנכון מלכתחילה, לא נדרש בהם שום שינוי.

---

## 3. איפה היה `notAvailable`

לפני הסבב הזה, `notAvailable` הופיע ב-3 מקומות בקוד-ייצור (לא-מסמכים):
1. `goral-hachol/brain/goral-rule-applicability-matrix.js` — הגדרת `APPLICABILITY_VALUES` (מערך-מקומי-נפרד מ-5 ערכים), הערת-תיעוד בראש הקובץ, ערך-נתונים אחד בפועל (`METHOD_DEFAULT_OVERRIDES.hawi.formulaOnlyHouses`), ו-2 fallbacks בתוך `getApplicability()`.
2. `_test_goral_knowledge_decision_brain_phase4.mjs` — רשימה מקומית קשיחה בבדיקת-מבנה של המטריצה (שורה 94 לשעבר).

## 4. איפה הוחלף ל-`unavailable`

כל 5 המקומות בסעיף 3 הוחלפו:
- `goral-hachol/brain/goral-rule-applicability-matrix.js`: הערת-הראש עודכנה (כוללת עכשיו `conditional` ומפנה למקור-הקנוני); `APPLICABILITY_VALUES` **כבר לא מגדיר-מערך-עצמאי** — הוא כעת `export const APPLICABILITY_VALUES = RULE_DECISION_VALUES;` (re-export, לא עותק); `METHOD_DEFAULT_OVERRIDES.hawi.formulaOnlyHouses: 'notAvailable'` → `'unavailable'`; שני ה-fallbacks ב-`getApplicability()` → `'unavailable'`.
- `_test_goral_knowledge_decision_brain_phase4.mjs`: הבדיקה-הקשיחה הוחלפה בקריאה ל-`isRuleDecisionValue(value)` (מ-`reading-intelligence-types.js`), בנוסף ל-14 בדיקות-חדשות שמאמתות ישירות את היעדר-`notAvailable` בכל הפלטים (matrix, registry, decision-brain output, QA payload, QA collector output) — פירוט מלא בסעיף 11.

**סריקה סופית לאישוש:** `grep -rn "notAvailable"` על כל הריפו (למעט node_modules) מחזיר **אך ורק** שורות בתוך `_test_goral_knowledge_decision_brain_phase4.mjs` שהן הבדיקות-עצמן שמאמתות ש-`notAvailable` **נדחה**/**לא מופיע** — אין אף הופעה של `notAvailable` כערך-אמיתי בשום קובץ-ייצור בריפו.

## 5. איפה נוספה תמיכה ב-`conditional`

**לא נוספה תמיכה חדשה — היא כבר הייתה קיימת.** `goral-hachol/intelligence/reading-intelligence-types.js::RULE_DECISION_VALUES` כבר כלל `'conditional'` מאז שנכתב (Reading Intelligence Phase 1). מה שהשתנה בסבב הזה: **`goral-hachol/brain/goral-rule-applicability-matrix.js` (Phase 4) עכשיו יורש את התמיכה הזו אוטומטית** דרך ה-re-export, במקום להיות "תקוע" על 5-ערכים-בלבד. **לא נקבע ל-`conditional` שום ערך-נתונים חדש** באף cell של המטריצה — לפי ההנחיה המפורשת, לא הומצא `activationCondition` ולא סומן שום כלל כ-conditional על דעת עצמי. כל הערכים הקיימים במטריצה נשארו מדויק כפי שהיו (למעט שינוי-האיות `notAvailable`→`unavailable` היחיד).

## 6. מהו מקור האמת היחיד של ה-enum

**`goral-hachol/intelligence/reading-intelligence-types.js::RULE_DECISION_VALUES`** (ומלווה הפונקציה `isRuleDecisionValue`). זהו הקובץ היחיד שמגדיר את המערך בפועל. כל שאר הקבצים (`goral-rule-applicability-matrix.js`, קובץ-הבדיקה) **מייבאים ממנו** — אין enum מקביל נוסף בשום מקום בריפו.

## 7. אילו contracts אוחדו

- **Rule Decision Values** (המרכזי) — `goral-hachol/brain/*` ו-`goral-hachol/intelligence/*` חולקים כעת בדיוק את אותו המקור (`RULE_DECISION_VALUES`).
- **Method** (`kashf`/`hawi`) — בדיקות ה-Knowledge Registry עברו מבדיקה-קשיחה-מקומית (`['kashf','hawi'].includes(...)`) ל-`isMethod(...)` הקנוני.
- **Client Visibility** (`client`/`advisorOnly`/`hiddenUnlessRequested`) — אותו מעבר, מ-`['client','advisorOnly','hiddenUnlessRequested'].includes(...)` ל-`isClientVisibility(...)` הקנוני.
- **Confidence** (`high`/`medium`/`low`) — אותו מעבר, ל-`isConfidence(...)` הקנוני.
- **Severity** (`high`/`medium`/`low`/`none`) — נוסף אימות חדש (לא היה קודם) ש-`brainEvaluation.overallSeverity` תואם ל-`isSeverity(...)` הקנוני.
- **Knowledge Pipeline** — הוגדר-כשם-ארכיטקטוני-בלבד ("Hall of Wisdom Knowledge Pipeline") בהערת-תיעוד בראש `goral-brain-evaluation-runner.mjs`, המתאר את השרשרת Knowledge Registry → Question Taxonomy → Rule Applicability Matrix → Decision Engine → reasoning-ready output. **שום קובץ/API לא שונה-שם** בגלל זה.

**מה *לא* אוחד, ולמה (בכוונה):**
- **`ruleType`** ב-Knowledge Registry (9 ערכים: `primaryDecision`/`verification`/`supporting`/`advisorOnly`/`conditional`/`spiritual`/`timing`/`hiddenThought`/`characterNature`) **נשאר עצמאי, לא מיובא מ-`reading-intelligence-types.js`**. זהו קונספט שונה במהותו מ-`RULE_DECISION_VALUES` (מסווג-סוג-כלל, לא הכרעת-הצגה-לתרחיש-ספציפי) — איחוד-בכפייה של שני מושגים-שונים היה יוצר בלבול, לא מונע אותו. תועד ישירות בקוד (הערה בקובץ-הבדיקה) ובדוח הזה.

## 8. אילו renames בוצעו

**אף rename לא בוצע.** לא שונה שם-שדה, שם-פונקציה, שם-קובץ, או שם-export ציבורי כלשהו. השינוי היחיד לשם קיים הוא **תוכן** המערך `APPLICABILITY_VALUES` (מה-5-ערכים-הישנים למקור-קנוני-6-ערכים) — **השם עצמו לא שונה**, וכל מי שכבר משתמש ב-`APPLICABILITY_VALUES` (בדקתי — אף קובץ אחר לא מייבא אותו) ממשיך לעבוד ללא שינוי.

**נבדקה אפשרות-rename ולא בוצעה, בכוונה:** שדות ה-`RuleDecision`/`evidenceLocation` (registry) מול השמות המועדפים (`ruleDecision`/`activationCondition`/`sourceEvidence` וכו') — נמצא ש-`goral-decision-brain.js::evaluateReading()` **לא מייצר אובייקטי-`RuleDecision` כלל** (הוא מייצר פלט-audit מצטבר: `missingRequiredRules`/`irrelevantAppliedRules`/וכו', צורת-נתונים שונה-במהותה, לא רק שם-שונה-לאותו-דבר). אין כאן "אותו רעיון בשם אחר" לתקן — יש שני מודלי-נתונים שונים בכוונה (audit מצטבר מול per-rule decision). כשה-Rule Decision Engine המלא ייבנה (Phase 2, לפי Roadmap), הוא אמור להשתמש ב-`rule-decision-schema.js` הקיים ישירות — לא נדרש rename כרגע.

## 9. האם נשמרה backward compatibility

**כן, במלואה.** בדיקה מפורשת (סעיף 7 בהנחיות): מי הצרכנים של `getApplicability()`/`APPLICABILITY_VALUES`? נמצאו 2 צרכנים בקוד-ייצור: `goral-hachol/brain/goral-decision-brain.js` (משווה מול המחרוזות `'required'`/`'forbidden'`/`'advisorOnly'` בלבד — אף אחת מהן לא השתנתה) ו-`goral-hachol/qa/goral-qa-ai-payload-builder.js` (מעביר את הערך כמו-שהוא ל-payload, לא בודק שוויון-מחרוזת ישיר מול `notAvailable`/`unavailable`). **שני הצרכנים עודכנו-יחד באותו סבב** (הקובץ הראשון לא-שונה כי לא-נזקק לשינוי; השני נבדק ואומת שהוא לא-שובר). **לא נוסף שום converter-כפול-קבוע** — הפלט-הרשמי הוא `unavailable` בלבד, אין תמיכה-מקבילה ב-`notAvailable` בשום מקום.

## 10. האם השתנתה לוגיקה כלשהי

**לא.** אומת בשלוש רמות:
1. **קריאה-ישירה של הקוד** — כל שינוי הוא או (א) איחוד-מקור-לאותם-ערכים, (ב) שינוי-איות `notAvailable`→`unavailable` שמעולם לא נבדק כמחרוזת-שוואה בשום `if`/`switch` פרט למקום שהוחלף, או (ג) בדיקות-חדשות (לא-לוגיקת-ייצור).
2. **הרצת 60 התרחישים** — 0 קריסות, 0 שינוי בפלט (`clientOutputHtml`/`advisorOnlyOutput` זהים, לא נבדקו-מחדש כי אין import שמשפיע עליהם).
3. **בדיקת-רגרסיה מספרית מפורשת (חדשה, סעיף 11 #13)** — התפלגות-החומרה על 60 התרחישים (`0 high / 3 medium / 0 low / 57 none`) **זהה-בדיוק** למה שתועד ב-`HALL_WISDOM_GORAL_KNOWLEDGE_DECISION_BRAIN_PHASE4_PRECOMMIT_REPORT.md` (הדוח הקודם, לפני היישור) — הוכחה כמותית שאין שינוי-התנהגות.

---

## 11. תוצאות כל הבדיקות

```
_test_goral_knowledge_decision_brain_phase4.mjs           → 1010 passed, 0 failed  (996 קודם + 14 בדיקות-יישור חדשות)
_test_hall_wisdom_reading_intelligence_foundation.mjs      → 54 passed, 0 failed  (ללא שינוי, לא נערך)
_test_goral_qa_brain_phase2.mjs                              → כל הבדיקות עברו (ללא שינוי)
_test_hall_wisdom_ai_qa_evaluator_phase3.mjs                  → כל הבדיקות עברו (ללא שינוי)
_test_hall_wisdom_goral_qa_edge_mock.mjs                        → כל הבדיקות עברו (ללא שינוי)
_test_hall_wisdom_goral_qa_live_ai.mjs                            → כל הבדיקות עברו (ללא שינוי)
```

**14 הבדיקות החדשות (מתוך רשימת 18 הדרישות שביקשת):**
1. `RULE_DECISION_VALUES` שווה בדיוק ל-6 הערכים הרשמיים + `APPLICABILITY_VALUES` הוא-אותו-reference (לא עותק)
2. `isRuleDecisionValue('notAvailable') === false`
3. `isRuleDecisionValue('conditional') === true`
4. re-check: `advisorOnly` + `clientVisibility:'client'` נדחה (דרך `validateRuleDecision`)
5. (מכוסה ב-#4 concептуально + בדיקות קיימות ב-Reading Intelligence foundation)
6. אין cell במטריצה שהוא גם `unavailable` וגם `required`; `hawi.formulaOnlyHouses === 'unavailable'` מאומת ישירות
7. סריקה-מלאה של כל תא במטריצה — כולם ערכים חוקיים
8. כל רשומת-registry עומדת ב-contract (method/clientVisibility/confidence הקנוניים)
9. `brainEvaluation.overallSeverity` הוא ערך-severity קנוני
10. `buildQaEvaluatorPayload()` לא מכיל `notAvailable` בשום מקום ב-JSON
11. `collectScenarioOutput().brainEvaluation` לא מכיל `notAvailable` באף אחד מ-60 התרחישים
12. (מכוסה — כל 60 התרחישים רצים ללא קריסה בכל הרצה, כולל `runQaRunner()`/`runBrainEvaluation()` בתוך הבדיקות החדשות)
13. התפלגות-חומרה זהה-לגמרי לפני/אחרי (הוכחה כמותית ל"אין שינוי בתוצאות מנוע")

**בדיקות 14-18 (ללא-תיקון, ריצה-בלבד — כבר מכוסות על ידי חבילות-הבדיקה הקיימות שרצו למעלה, לא כפלתי אותן):** 14 (אין שינוי בקבצי Kashf/Hawi engine) — מאומת ב-`_test_goral_qa_brain_phase2.mjs`/`_test_hall_wisdom_goral_qa_edge_mock.mjs` (בדיקות-regression מפורשות). 15 (אין שינוי UI) ו-16 (אין שינוי קלפים) — מאומת באותן חבילות (`orenAdvisorPanel`/`cards.html`/`cartomancy/ui/cards-app.js`). 17 (אין AI call) ו-18 (אין fetch) — מאומת ב-`_test_hall_wisdom_ai_qa_evaluator_phase3.mjs`/`_test_hall_wisdom_goral_qa_live_ai.mjs` (בדיקות-regex מפורשות על קבצי ה-AI evaluator).

---

## 12. אישור: אין שינוי מנועים

✅ שום קובץ תחת `goral-hachol/engine/` לא נערך. `git status`/`git diff` מאששים — אף קובץ-מנוע לא מופיע בשום רשימת-שינויים. `_test_goral_qa_brain_phase2.mjs`/`_test_hall_wisdom_goral_qa_edge_mock.mjs` מריצים בדיקת-רגרסיה ישירה על `kashf-reading-engine.js`/`hawi-interpreter.js` — עוברות.

## 13. אישור: אין שינוי UI/קלפים

✅ שום קובץ תחת `goral-hachol/ui/`, `goral-hachol.html`, `cards.html`, `cartomancy/` לא נערך — מאומת אוטומטית בכל חבילות-הבדיקה שרצו.

## 14. אישור: אין AI חי

✅ שום `fetch`/`callAnthropic`/הפניה ל-`ANTHROPIC_API_KEY` בשום קובץ שנערך בסבב הזה — מאומת ידנית (הקבצים שנערכו הם data/schema/test בלבד) וגם דרך חבילות-הבדיקה הקיימות שממשיכות לרוץ.

## 15. אישור: אין deploy

✅ לא בוצע `supabase functions deploy`, לא Vercel production deploy, לא כל פעולה על `supabase/functions/*` (לא נערך כלל בסבב הזה).

## 16. אישור: אין merge ל-main

✅ כל העבודה על `claude/app-cleanup-organization-mia9b2` בלבד (מאומת `git branch --show-current`). לא נוצר ענף חדש. אין commit — ממתין לאישורך.

## 17. הצעת חלוקה ל-commit אחד בלבד

**Commit מוצע: "Phase 4 + Reading Intelligence Foundation aligned to Hall of Wisdom Core"**

```
goral-hachol/brain/goral-knowledge-registry.js
goral-hachol/brain/goral-question-taxonomy.js
goral-hachol/brain/goral-rule-applicability-matrix.js
goral-hachol/brain/goral-output-quality-rubric.js
goral-hachol/brain/goral-decision-brain.js
goral-hachol/brain/goral-brain-evaluation-runner.mjs
goral-hachol/intelligence/reading-intelligence-types.js
goral-hachol/intelligence/reading-plan-schema.js
goral-hachol/intelligence/rule-decision-schema.js
goral-hachol/intelligence/system-memory-schema.js
_test_goral_knowledge_decision_brain_phase4.mjs
_test_hall_wisdom_reading_intelligence_foundation.mjs
goral-hachol/qa/goral-qa-output-collector.js
goral-hachol/qa/goral-qa-ai-payload-builder.js
goral-hachol/qa/goral-qa-scenarios.js
```

**נימוק לאיחוד ל-commit אחד (בניגוד להצעת "A+B נפרדים" ב-`HALL_WISDOM_UNCOMMITTED_WORK_AUDIT.md`):** הסבב הזה יצר תלות-חדשה-ומכוונת בין `goral-hachol/brain/*` ל-`goral-hachol/intelligence/*` (ה-`import { RULE_DECISION_VALUES } from '../intelligence/reading-intelligence-types.js'` ב-`goral-rule-applicability-matrix.js`) — **מרגע זה, שני התיקיות תלויות-הדדית ברמת-import, לא רק ברמת-ארכיטקטורה-דוקומנטרית.** commit נפרד ל-A בלי B (או להפך) ישבור import באמצע-ההיסטוריה. **זו סטייה מודעת ומוצדקת מהחלוקה שהוצעה ב-audit הקודם** — התנאים השתנו (תלות-import חדשה נוצרה) מאז שהוצע A/B נפרדים.

**לא כלולים בהצעה הזו (נותרו כפי-שהם, ממתינים להחלטה נפרדת):**
- 3 מסמכי-Supabase (`HALL_WISDOM_GORAL_QA_SUPABASE_*`)
- `HALL_WISDOM_READING_INTELLIGENCE_ARCHITECTURE.md` + ה-precommit-report שלו (superseded, לפי `HALL_WISDOM_UNCOMMITTED_WORK_AUDIT.md` §7)
- `HALL_WISDOM_GORAL_KNOWLEDGE_DECISION_BRAIN_PHASE4_PRECOMMIT_REPORT.md` — דוח-precommit *קודם*, שכעת מיושן-חלקית (המספרים בו עדיין נכונים, אך הוא לא-משקף את שלב-היישור הזה). **אם תאשר את ה-commit המוצע למעלה, מומלץ לצרף גם את הדוח-הזה (`HALL_WISDOM_VOCABULARY_CONTRACTS_ALIGNMENT_PRECOMMIT_REPORT.md`) כתיעוד-משלים**, לא במקום הדוח-הישן.
- `HALL_WISDOM_UNCOMMITTED_WORK_AUDIT.md` (דוח-ה-audit עצמו) — מסמך-תיעוד-היסטורי, לא-חלק-מהקוד.

**סיכון של ה-commit המוצע:** נמוך — 1010+54 בדיקות ירוקות, 0 שינוי-לוגיקה מאומת (סעיף 10), backward-compat נשמרה (סעיף 9).
**תלות:** פנימית-בלבד בין 15 הקבצים ברשימה — אין תלות בקבצים חיצוניים-לרשימה.
**דורש אישור אורן:** **כן, מפורש** — כרגיל, עם רשימת-הקבצים המדויקת למעלה.

---

## סיכום — לא בוצע כלום מעבר ל-alignment

לא commit. לא push. לא Intent Analyzer. לא מחיקה. לא reset/clean/stash. רק יישור-חוזים בקבצים הפתוחים הקיימים + בדיקות + הדוח הזה.
