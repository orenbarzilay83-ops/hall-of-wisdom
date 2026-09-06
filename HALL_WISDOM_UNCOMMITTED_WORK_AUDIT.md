# HALL_WISDOM_UNCOMMITTED_WORK_AUDIT.md — Audit של עבודה פתוחה לפני Intent Analyzer

> **דוח-Audit בלבד. לא בוצע שום שינוי-קוד, לא נוצר קובץ נוסף (מעבר לדוח הזה), לא commit, לא push, לא מחיקה, לא reset/clean/stash.**
> תאריך: 2026-07-13. ענף: `claude/app-cleanup-organization-mia9b2`. HEAD: `9a952de` ("Establish Hall of Wisdom Core architecture").

---

## 1. `git status --short` (מלא)

```
 M goral-hachol/qa/goral-qa-ai-payload-builder.js
 M goral-hachol/qa/goral-qa-output-collector.js
 M goral-hachol/qa/goral-qa-scenarios.js
?? HALL_WISDOM_GORAL_KNOWLEDGE_DECISION_BRAIN_PHASE4_PRECOMMIT_REPORT.md
?? HALL_WISDOM_GORAL_QA_SUPABASE_LIVE_PREDEPLOY_CHECKLIST.md
?? HALL_WISDOM_GORAL_QA_SUPABASE_LOCAL_SERVE_REPORT.md
?? HALL_WISDOM_GORAL_QA_SUPABASE_MOCK_DEPLOY_REPORT.md
?? HALL_WISDOM_READING_INTELLIGENCE_ARCHITECTURE.md
?? HALL_WISDOM_READING_INTELLIGENCE_ARCHITECTURE_PRECOMMIT_REPORT.md
?? _test_goral_knowledge_decision_brain_phase4.mjs
?? _test_hall_wisdom_reading_intelligence_foundation.mjs
?? goral-hachol/brain/
?? goral-hachol/intelligence/
```

## 2. `git diff --stat` (מלא)

```
 goral-hachol/qa/goral-qa-ai-payload-builder.js |  65 ++++++++
 goral-hachol/qa/goral-qa-output-collector.js   |  29 +++-
 goral-hachol/qa/goral-qa-scenarios.js          | 202 ++++++++++++++++++++-----
 3 files changed, 255 insertions(+), 41 deletions(-)
```

---

## 3. קבצים Modified — פירוט מלא

### `goral-hachol/qa/goral-qa-output-collector.js`
- **מה השתנה:** שורה חדשה אחת `import { evaluateReading } from '../brain/goral-decision-brain.js'`; פונקציה חדשה `attachBrainEvaluation(collected)` שמוסיפה שדה `collected.brainEvaluation = evaluateReading({...})`; `collectScenarioOutput()` עוטפת את שתי הקריאות הקיימות (`collectKashf`/`collectHawi`) ב-`attachBrainEvaluation(...)`.
- **באיזה שלב נוצר:** Phase 4 (Knowledge/Decision Brain), חלק C — אינטגרציה עם ה-QA הקיים.
- **חלק מ-Phase 4:** כן, במלואו.
- **משנה התנהגות קיימת:** **לא.** שלוש הקריאות הקיימות (`buildRamlBoardFromMothers`, `collectKashf`, `collectHawi`) נשארו זהות ב-100% — אומת ב-`git diff` (אין שינוי בגוף `collectKashf`/`collectHawi` עצמם, רק תוספת-שדה **אחרי** שהם כבר רצו). זו תוספת אדיטיבית טהורה.
- **נבדק:** כן — `_test_goral_qa_brain_phase2.mjs` (הבדיקה המקורית, ללא שינוי, עדיין עוברת במלואה), `_test_goral_knowledge_decision_brain_phase4.mjs` (996 assertions, כולל בדיקות ישירות על `collectScenarioOutput`).
- **תלוי בקבצים אחרים:** כן — `goral-hachol/brain/goral-decision-brain.js` (untracked, ראו סעיף 5). **לא ניתן ל-commit את הקובץ הזה בלי `goral-decision-brain.js` — ה-import ישבר.**

### `goral-hachol/qa/goral-qa-ai-payload-builder.js`
- **מה השתנה:** 2 imports חדשים (`getApplicability`/`RULE_CATEGORIES` מ-`goral-rule-applicability-matrix.js`, `getRegistryEntriesForTopic`/`KASHF_RULES_WITHOUT_PAGE_MAP`/`KASHF_PAGE_MAP_WITHOUT_RULES` מ-`goral-knowledge-registry.js`); 4 פונקציות-עזר חדשות (`buildApplicableRuleMatrix`, `buildMissingKnowledgeReferences`, `buildSourceEvidencePointers`, `buildDecisionBrainFindings`); `sanitizeForAi()` מקבלת 6 שדות חדשים בפלט (`classifiedQuestionType`, `applicableRuleMatrix`, `decisionBrainFindings`, `rubricScores`, `missingKnowledgeReferences`, `sourceEvidencePointers`).
- **באיזה שלב נוצר:** Phase 4, חלק C.
- **חלק מ-Phase 4:** כן, במלואו.
- **משנה התנהגות קיימת:** **לא לשדות הקיימים.** כל 5 השדות המקוריים (`scenarioId`/`method`/`topicId`/`category`/`question`/`clientOutputHtml`/`sectionsShown`/`sectionsHidden`/`warnings`/`sourceRulesApplied`) נשארו זהים ב-100%; ה-guard הקיים נגד `SENSITIVE_KEYS` (`phone`/`dynFields`/`clientHistorySummary`) נשאר ללא שינוי. תוספת-שדות טהורה לפלט.
- **נבדק:** כן — `_test_hall_wisdom_ai_qa_evaluator_phase3.mjs` (הבדיקה המקורית, עוברת במלואה), בדיקה-ידנית שבוצעה במהלך Phase 4 (payload עם השדות החדשים, ללא דליפת SENSITIVE_KEYS — ראו `HALL_WISDOM_GORAL_KNOWLEDGE_DECISION_BRAIN_PHASE4_PRECOMMIT_REPORT.md` §11).
- **תלוי בקבצים אחרים:** כן — `goral-hachol/brain/goral-rule-applicability-matrix.js` + `goral-hachol/brain/goral-knowledge-registry.js` (שניהם untracked). **גם קובץ זה לא ניתן ל-commit לבד.**

### `goral-hachol/qa/goral-qa-scenarios.js`
- **מה השתנה:** הרחבה מ-20 תרחישים ל-60 (30 Kashf / 30 Hawi). 20 התרחישים המקוריים **נשארו זהים ב-100%** (אותו `id`/`category`/`method`/`topicId`/`question`/`mothers` לכל אחד — אומת ישירות בבדיקת-רגרסיה ייעודית, ראו סעיף 8). נוספו 40 תרחישים חדשים + 5 combos-אמהות חדשים (`MOTHERS_F`-`MOTHERS_J`) + 2 imports חדשים (`getApplicability`/`RULE_CATEGORIES` מהמטריצה, `getQuestionType` מהטקסונומיה) + פונקציית-עזר `deriveExpectedMetadata()` שמוסיפה 4 שדות חדשים (`expectedQuestionType`, `expectedRequiredRules`, `expectedAdvisorOnlySections`, `expectedForbiddenClientSections`) **לכל 60 התרחישים כולל ה-20 המקוריים** — זו התוספת היחידה שנוגעת גם בתרחישים-הישנים, אך היא הוספת-שדות-נגזרים, לא שינוי לשדות הקיימים.
- **באיזה שלב נוצר:** Phase 4, חלק D.
- **חלק מ-Phase 4:** כן, במלואו.
- **משנה התנהגות קיימת:** **לא במובן שמריץ-מנוע** — קובץ זה הוא נתונים-בלבד (אין בו קריאה למנוע). ה-4 שדות-החדשים על 20 התרחישים המקוריים הם מידע-נוסף, לא שינוי לשדות שכבר נצרכו (`goral-qa-output-collector.js`/`goral-qa-deterministic-checks.js` קוראים רק `id`/`category`/`method`/`topicId`/`question`/`mothers` — לא נוגעים בשדות החדשים כלל, כך שאין סיכון-שבירה).
- **נבדק:** כן — כל 60 התרחישים רצו בהצלחה מול המנועים האמיתיים (0 קריסות, אומת בסעיף 8 למטה שוב); `_test_goral_knowledge_decision_brain_phase4.mjs` כולל guard-רגרסיה מפורש (`ORIGINAL_20_SCENARIO_IDS`) שמוודא שה-20 המקוריים עדיין מחזירים `overallSeverity:'none'`.
- **תלוי בקבצים אחרים:** כן — `goral-hachol/brain/goral-rule-applicability-matrix.js` + `goral-hachol/brain/goral-question-taxonomy.js` (untracked).

**מסקנת-תלות קריטית לסעיף 9 (חלוקת-commits):** שלושת הקבצים ה-Modified **תלויים ישירות** ב-`goral-hachol/brain/*` — **אי-אפשר לעשות commit לשלושתם בלי `goral-hachol/brain/*` באותו commit (או קודם לו).** לא ניתן להפריד "Phase 4 brain" מ-"Phase 4 QA integration" לשני commits בלי לשבור import בזמן-הביניים.

---

## 4. קבצים/תיקיות Untracked — פירוט מלא

| קובץ | סיווג | עדיין נחוץ? | superseded? |
|---|---|---|---|
| `HALL_WISDOM_GORAL_KNOWLEDGE_DECISION_BRAIN_PHASE4_PRECOMMIT_REPORT.md` | (א) Phase 4 | כן — דוח-precommit רשמי של Phase 4, כבר נשלח ואושר-תוכן על ידך (טרם commit) | לא |
| `HALL_WISDOM_GORAL_QA_SUPABASE_LIVE_PREDEPLOY_CHECKLIST.md` | (ג) Supabase deployment docs | כן — תיעוד-החלטה היסטורי (סעיפי secrets/סיכונים לפני ה-deploy שכבר בוצע) | לא, אך **לוגית קדם ל-Mock Deploy Report** — שלושת-מסמכי-הסופאבייס (זה + Local Serve + Mock Deploy) מתעדים רצף-אירועים אחד (checklist→local-serve-attempt→deploy-בפועל) |
| `HALL_WISDOM_GORAL_QA_SUPABASE_LOCAL_SERVE_REPORT.md` | (ג) Supabase deployment docs | כן — מתעד ניסיון-`functions serve` מקומי שנכשל (Docker חסר) | לא |
| `HALL_WISDOM_GORAL_QA_SUPABASE_MOCK_DEPLOY_REPORT.md` | (ג) Supabase deployment docs | כן — הדוח **הסופי-והמעודכן** של ה-deploy בפועל (הצליח, MOCK בלבד, כולל חסימת-curl מהסביבה) | **מחליף** גרסה-קודמת-יותר של עצמו (לפני חיבור ה-Supabase MCP) — אין קובץ נפרד לגרסה-הישנה, היא נדרסה במקום (`Write` על אותו path), כך שאין superseded-file נפרד לטפל בו |
| `HALL_WISDOM_READING_INTELLIGENCE_ARCHITECTURE.md` | (ד) הוחלף רעיונית | **דיון בסעיף 7 למטה** | **כן, מהותית** — ראו סעיף 7 |
| `HALL_WISDOM_READING_INTELLIGENCE_ARCHITECTURE_PRECOMMIT_REPORT.md` | (ד) הוחלף רעיונית | תלוי בהחלטה על הקובץ למעלה | אותו סטטוס כמו המסמך שהוא מדווח-עליו |
| `_test_goral_knowledge_decision_brain_phase4.mjs` | (א) Phase 4 | כן — 996 assertions, 0 נכשלות (סעיף 8) | לא |
| `_test_hall_wisdom_reading_intelligence_foundation.mjs` | (ב) Reading Intelligence Foundation | כן — 54 assertions, 0 נכשלות (סעיף 8). **שים לב:** הבדיקות עצמן (Reading Plan/Rule Decision/System Memory schemas) עדיין תקפות גם תחת המינוח של Hall of Wisdom Core (ראו סעיף 6) — הקובץ לא הוחלף, רק המסמך שמתאר את ההקשר שלו | לא |
| `goral-hachol/brain/` (6 קבצים) | (א) Phase 4 | כן — ליבת ה-Knowledge/Decision Brain, מיושמת-בפועל | לא |
| `goral-hachol/intelligence/` (4 קבצים) | (ב) Reading Intelligence Foundation | כן — עדיין תואם-ארכיטקטונית ל-Core (סעיף 6) | לא (הקוד עצמו, לא המסמך) |

---

## 5. `goral-hachol/brain/` — פירוט מלא

| קובץ | שורות | Exports | תפקיד | בדיקות | קשר ל-Hall of Wisdom Core |
|---|---|---|---|---|---|
| `goral-knowledge-registry.js` | 489 | `GORAL_KNOWLEDGE_REGISTRY`, `getRegistryEntriesForMethod`, `getRegistryEntryByRuleId`, `getRegistryEntriesForTopic`, `KASHF_RULES_WITHOUT_PAGE_MAP`, `KASHF_PAGE_MAP_WITHOUT_RULES` | 69 רשומות-ידע (35 Kashf + 34 Hawi), traced ל-קוד-מנוע אמיתי | `_test_goral_knowledge_decision_brain_phase4.mjs` (חלק "Knowledge Registry", ~15 assertions) | = **Knowledge Memory** (התוכן, לא עדיין ה-schema הפורמלי — ראו `HALL_WISDOM_CORE_ARCHITECTURE.md` חלק ג/ז) |
| `goral-question-taxonomy.js` | 294 | `QUESTION_TYPES`, `getAllQuestionTypeIds`, `getQuestionType`, `classifyQuestionType` | 17 סוגי-שאלה + מסווג-היוריסטי | `_test_goral_knowledge_decision_brain_phase4.mjs` (חלק "Question Taxonomy") | קלט ל-**Intent Analyzer**/**Rule Decision Engine** (לא Intent עצמו — `questionType` ≠ `intent`, ראו Core חלק ד) |
| `goral-rule-applicability-matrix.js` | 152 | `RULE_CATEGORIES`, `APPLICABILITY_VALUES`, `RULE_APPLICABILITY_MATRIX`, `MATRIX_OVERRIDE_EVIDENCE`, `getApplicability` | questionType×method×ruleCategory → 5 ערכי-הכרעה | `_test_goral_knowledge_decision_brain_phase4.mjs` (חלק "Rule Applicability Matrix") | = **Rule Decision Engine** (מדיניות-ברירת-מחדל) — **⚠️ ראו אזהרת-אוצר-מילים למטה** |
| `goral-output-quality-rubric.js` | 146 | `RUBRIC_DIMENSIONS`, `getAllRubricDimensionIds`, `severityForScore` | 12 מדדי-איכות, score 0-4 | `_test_goral_knowledge_decision_brain_phase4.mjs` (חלק "Output Quality Rubric") | = **Audit Module** (ציוני-איכות) |
| `goral-decision-brain.js` | 326 | `evaluateReading` | מנוע-הכרעה דטרמיניסטי מרכזי — משווה מה-שקרה מול המטריצה | `_test_goral_knowledge_decision_brain_phase4.mjs` (רוב-הקובץ, כולל 7 בדיקות-רגרסיה ייעודיות) | = **Audit Module** (רוב-הלוגיקה) + חלק מ-**Rule Decision Engine** |
| `goral-brain-evaluation-runner.mjs` | 141 | `run` | מריץ את כל 60 התרחישים, מפיק דוח-כיסוי | `_test_goral_knowledge_decision_brain_phase4.mjs` (חלק "Brain Evaluation Runner/Coverage Report") | = זרע של **Mentor Module** + **Claude Instruction Generator** + **Reasoning Layer** (ראו `HALL_WISDOM_CORE_ARCHITECTURE.md` חלק ז) |

**⚠️ אזהרת-אוצר-מילים (חשובה, מדווחת כאן במפורש כי היא בדיוק סוג-הבעיה ש-Core Constitution נועד למנוע):** `goral-rule-applicability-matrix.js` (Phase 4) משתמש ב-5 ערכים (`required/allowed/advisorOnly/forbidden/notAvailable`). `goral-hachol/intelligence/rule-decision-schema.js` (Reading Intelligence, סעיף 6 למטה) מגדיר 6 ערכים (`required/allowed/conditional/advisorOnly/forbidden/unavailable`). **שני הקבצים חיים זה-לצד-זה כרגע, לא מאוחדים.** `HALL_WISDOM_CORE_ARCHITECTURE.md` (המחייב, כבר-committed) מתעד את זה כפער-ידוע (חלק ד — "הבהרה על יחס למטריצה הקיימת") ומגדיר את 6-הערכים כ"תוספת, לא שבירה" — אך בפועל **הקוד עדיין לא מאוחד**, זו הבהרה-מסמכית בלבד. זה לא-דחוף לתקן עכשיו, אבל **חובה לדעת לפני שמתחילים Intent Analyzer**, כי הוא יצטרך לבחור באיזה אוצר-מילים להשתמש.

---

## 6. `goral-hachol/intelligence/` — פירוט מלא

| קובץ | שורות | Exports | Validators/Schemas | בדיקות | תואם ל-Core? |
|---|---|---|---|---|---|
| `reading-intelligence-types.js` | 98 | `METHODS`, `RULE_DECISION_VALUES`, `CLIENT_VISIBILITY_VALUES`, `CONFIDENCE_VALUES`, `SEVERITY_VALUES`, `ISSUE_STATUS_VALUES`, `UNCERTAINTY_POLICY_VALUES`, `CONTRADICTION_POLICY_VALUES`, `SAFETY_POLICY_VALUES` + 9 type-guards (`isMethod`, `isRuleDecisionValue` וכו') | קבועים+type-guards בלבד, אין validation-object | `_test_hall_wisdom_reading_intelligence_foundation.mjs` (חלק "type guards sanity") | **כן** — `RULE_DECISION_VALUES` תואם בדיוק ל-6-הערכים המתועדים ב-`HALL_WISDOM_CORE_ARCHITECTURE.md` חלק ד (Rule Decision Engine) |
| `reading-plan-schema.js` | 109 | `createReadingPlan`, `validateReadingPlan` | סכימת `ReadingPlan` מלאה (18 שדות) + 2 אילוצים-צולבים (forbiddenRules/advisorOnlyRules לא חופפים ל-expectedClientSections) | `_test_hall_wisdom_reading_intelligence_foundation.mjs` (בדיקות 1-3, 6) | **כן, עם הסתייגות אחת** — הסכימה מתארת `ReadingPlan` שנבנה "מאפס" משאלה; ה-Core doc (חלק ה) קובע ש-Planner **צריך לקבל `ReadingStrategy` כקלט**, לא לבנות-Plan-לבד. הסכימה עצמה (השדות של `ReadingPlan`) לא סותרת את זה — היא רק לא-עדיין-מבטאת את זרימת-הקלט-החדשה (`ReadingStrategy → Plan`). אין `strategyId` כשדה ב-`ReadingPlan` הנוכחי. **התאמה נדרשת לפני שימוש בפועל, לא סתירה מהותית.** |
| `rule-decision-schema.js` | 60 | `createRuleDecision`, `validateRuleDecision` | סכימת `RuleDecision` (8 שדות) + 2 אילוצי-ברזל (advisorOnly⇒לא-client-visible; required⇒sourceEvidence לא-ריק) | `_test_hall_wisdom_reading_intelligence_foundation.mjs` (בדיקות 4-5, 9) | **כן, במדויק** — זהה-לחלוטין לסכימת `selectedRule`/`RuleDecision` המתועדת ב-`HALL_WISDOM_CORE_ARCHITECTURE.md` חלק ט (Reasoning Layer) |
| `system-memory-schema.js` | 96 | `createSystemMemoryEvent`, `validateSystemMemoryEvent`, `createSystemMemoryStore`, `upsertIssueEvent`, `findIssueEvents` | סכימת `IssueEvent` (15 שדות) + store-בזיכרון-תהליך (לא persistence אמיתי) | `_test_hall_wisdom_reading_intelligence_foundation.mjs` (בדיקות 7-8, + "round-trip" נפרד) | **כן, אך רק ל-Issue Memory** — הקובץ (ושמו) תואמים במדויק את מה ש-Core doc (חלק ו) מגדיר כ-Issue Memory. **⚠️ אין קובץ מקביל ל-Knowledge Memory** — זה פער שכבר תועד ב-`HALL_WISDOM_CORE_ARCHITECTURE.md` (חלק ג/ו: "Knowledge Memory כשכבה פורמלית — לא קיים כלל, גם לא ברמת-schema"), ומאושש כאן שוב. |

**מסקנה כללית לסעיף 6:** כל 4 הקבצים **תואמים-מבנית** ל-Hall of Wisdom Core, אך **שם-הקובץ** `system-memory-schema.js` לא-תואם-יותר את המינוח הרשמי ("Issue Memory", לא "System Memory") — זהו **שינוי-שם עתידי מתועד, לא בוצע** (מצוין במפורש ב-Core doc: "לא שונה כאן, רק מסומן-לעתיד"). אין צורך לשנות שם-קובץ עכשיו.

---

## 7. `HALL_WISDOM_READING_INTELLIGENCE_ARCHITECTURE.md` מול `HALL_WISDOM_CORE_ARCHITECTURE.md`

**כן, הוחלף רעיונית ברובו המכריע.** השוואה ישירה:

| נושא | Reading Intelligence (הישן) | Core Architecture (המחייב, כבר-committed) |
|---|---|---|
| שם-העל | אין (11 רכיבים ב-pipeline שטוח) | Hall of Wisdom Core |
| מספר רכיבים | 11 | 16 (+3: Intent Analyzer\*, Reading Strategy Builder\*, Reasoning Layer, Knowledge Graph — \*אלה כבר היו ב-Reading Intelligence בגרסתו; Reasoning Layer/Knowledge Graph/Controlled Learning Loop הם תוספת אמיתית של Core) |
| Planner | מחליט-לבד מ-Question+questionType+topicId | מקבל `ReadingStrategy` מוכן (Intent→Strategy→Plan) |
| Rule Decision | 6 ערכים (`unavailable`) | זהה — **הקובץ בפועל (`rule-decision-schema.js`) לא שונה**, רק המסמך-שמתאר-אותו הוחלף |
| Memory | "System Memory" אחת (`IssueEvent`) | Knowledge Memory + Issue Memory, מופרדים רשמית |
| Core Constitution | לא קיים | קיים (6 עקרונות) |
| Naming (Core/Intelligence/AI Runtime) | לא קיים | קיים |
| Controlled Learning Loop | לא קיים | קיים (Future) |

**המלצה:** 

**לשמור כהיסטוריה + לשנות שם ל-superseded.** נימוק:
1. **לא למחוק** — המסמך מתעד תהליך-חשיבה אמיתי (Reading Plan/Rule Decision schemas שכבר-מומשו-בפועל ב-`goral-hachol/intelligence/*` נובעים ישירות ממנו — יש לו ערך-היסטורי-ותיעודי אמיתי, לא רק "טיוטה זרוקה").
2. **לא להשאיר בשם הנוכחי בלי סימון** — שם הקובץ (`HALL_WISDOM_READING_INTELLIGENCE_ARCHITECTURE.md`) עלול להטעות קורא-עתידי לחשוב שזה עדיין המסמך-המחייב, בעוד ש-`HALL_WISDOM_CORE_ARCHITECTURE.md` הוא כעת "מסמך-האב המחייב" (כך מוגדר במפורש בכותרתו).
3. **המלצה קונקרטית (לא בוצעה בסבב הזה — audit בלבד):** לפני/בזמן ה-commit הבא שכולל את הקובץ הזה, לשקול לשנות-שם ל-`HALL_WISDOM_READING_INTELLIGENCE_ARCHITECTURE_SUPERSEDED.md` (או להוסיף שורת-כותרת בולטת "⚠️ SUPERSEDED BY HALL_WISDOM_CORE_ARCHITECTURE.md" בראש הקובץ הקיים, בלי לשנות שם-קובץ — פחות פולשני, שומר על ה-git-history הקיים אם/כשייכנס ל-commit). **זו החלטה שדורשת את אישורך — לא בוצעה כאן.**
4. **אין מידע ב-Reading Intelligence שחסר ב-Core** — עברתי על שני המסמכים שורה-מול-שורה; כל תוכן מהותי ב-Reading Intelligence (11 הרכיבים, סכימת Reading Plan/Rule Decision, Audit/Mentor Mode, Source Fidelity, Integration map) **קיים ומעודכן** בתוך Core doc. **אין צורך במיזוג-מידע-חסר.**

---

## 8. תוצאות בדיקות (הרצה בלבד, ללא תיקון כשלים)

```
_test_goral_knowledge_decision_brain_phase4.mjs          → 996 passed, 0 failed
_test_hall_wisdom_reading_intelligence_foundation.mjs     → 54 passed, 0 failed
_test_goral_qa_brain_phase2.mjs                            → כל הבדיקות עברו (משפיע: goral-qa-output-collector.js, goral-qa-scenarios.js)
_test_hall_wisdom_ai_qa_evaluator_phase3.mjs                → כל הבדיקות עברו (משפיע: goral-qa-ai-payload-builder.js)
_test_hall_wisdom_goral_qa_edge_mock.mjs                     → כל הבדיקות עברו (משפיע בעקיפין: goral-qa-scenarios.js/collector, דרך goral-qa-runner.mjs)
_test_hall_wisdom_goral_qa_live_ai.mjs                        → כל הבדיקות עברו (אותה השפעה עקיפה)
```

**0 כשלים בכל 6 חבילות-הבדיקה.** לא בוצע שום תיקון — לא נדרש.

---

## 9. חלוקה מוצעת ל-commits נפרדים

### Commit A — Knowledge/Decision Brain Phase 4 (כולל אינטגרציית-QA, לא ניתנת-להפרדה)
### Commit B — Reading Intelligence Foundation
### Commit C — Supabase reports/docs
### Commit D — סימון-superseded למסמך הישן (רק אם תאשר בנפרד)

**פירוט מלא בסעיף 10.**

---

## 10. פירוט כל Commit מוצע

### Commit A — Knowledge/Decision Brain Phase 4
**רשימת קבצים מדויקת:**
```
goral-hachol/brain/goral-knowledge-registry.js
goral-hachol/brain/goral-question-taxonomy.js
goral-hachol/brain/goral-rule-applicability-matrix.js
goral-hachol/brain/goral-output-quality-rubric.js
goral-hachol/brain/goral-decision-brain.js
goral-hachol/brain/goral-brain-evaluation-runner.mjs
_test_goral_knowledge_decision_brain_phase4.mjs
goral-hachol/qa/goral-qa-output-collector.js
goral-hachol/qa/goral-qa-ai-payload-builder.js
goral-hachol/qa/goral-qa-scenarios.js
HALL_WISDOM_GORAL_KNOWLEDGE_DECISION_BRAIN_PHASE4_PRECOMMIT_REPORT.md
```
**Commit message מוצע:** `Add Goral Knowledge Registry and Decision Brain (Phase 4)`
**סיכון:** נמוך — 996+ בדיקות עוברות, 0 שינוי-התנהגות למנועים/UI/קלפים, נבדק-ידנית לאורך כל Phase 4.
**תלות:** **חייב להיות commit אחד מאוחד** — 3 קבצי-`goral-qa-*` ה-Modified תלויים ישירות (import) ב-`goral-hachol/brain/*`, כפי שתועד בסעיף 3. אי-אפשר לפצל.
**דורש אישור אורן:** **כן, מפורש** — כבר נשלח דוח-precommit (`HALL_WISDOM_GORAL_KNOWLEDGE_DECISION_BRAIN_PHASE4_PRECOMMIT_REPORT.md`) וטרם התקבל אישור-commit מפורש עם רשימת-קבצים, כנדרש בתהליך הקבוע.

### Commit B — Reading Intelligence Foundation
**רשימת קבצים מדויקת:**
```
goral-hachol/intelligence/reading-intelligence-types.js
goral-hachol/intelligence/reading-plan-schema.js
goral-hachol/intelligence/rule-decision-schema.js
goral-hachol/intelligence/system-memory-schema.js
_test_hall_wisdom_reading_intelligence_foundation.mjs
HALL_WISDOM_READING_INTELLIGENCE_ARCHITECTURE_PRECOMMIT_REPORT.md
```
**Commit message מוצע:** `Add Reading Intelligence Phase 1 foundation (schemas only)`
**סיכון:** נמוך — 54 בדיקות עוברות, אין import למנוע (נבדק אוטומטית), אין AI/fetch (נבדק אוטומטית).
**תלות:** עצמאי — לא תלוי ב-Commit A (אין import הדדי בין `goral-hachol/brain/` ל-`goral-hachol/intelligence/`). **יכול להיכנס בנפרד, בכל סדר.**
**דורש אישור אורן:** **כן, מפורש** — כנ"ל, דוח-precommit נשלח, טרם התקבל אישור-commit.
**הערה:** `HALL_WISDOM_READING_INTELLIGENCE_ARCHITECTURE.md` **לא** ברשימה — ראו Commit D.

### Commit C — Supabase reports/docs
**רשימת קבצים מדויקת:**
```
HALL_WISDOM_GORAL_QA_SUPABASE_LIVE_PREDEPLOY_CHECKLIST.md
HALL_WISDOM_GORAL_QA_SUPABASE_LOCAL_SERVE_REPORT.md
HALL_WISDOM_GORAL_QA_SUPABASE_MOCK_DEPLOY_REPORT.md
```
**Commit message מוצע:** `Document Supabase MOCK deploy of oren-smart-advisor goralQA route`
**סיכון:** אין — מסמכי-תיעוד בלבד, אין קוד, ה-deploy-בפועל שהם מתעדים כבר קרה ב-Supabase (לא תלוי-commit).
**תלות:** אין תלות בקוד. עצמאי לגמרי.
**דורש אישור אורן:** **כן** — לא נשלחה עדיין בקשת-commit ייעודית לשלושת הקבצים האלה (הם דווחו בזמנו כדוחות, אך התהליך הקבוע דורש אישור-commit נפרד ומפורש עם רשימת-קבצים).

### Commit D — סימון-superseded למסמך הישן — **רק אם תאשר**
**רשימת קבצים מדויקת (2 אופציות, לבחירתך):**
- **אופציה 1 (מינימלית, ללא שינוי-שם):** `HALL_WISDOM_READING_INTELLIGENCE_ARCHITECTURE.md` נכנס כמו-שהוא, אולי עם שורת-אזהרה שתתווסף בראשו.
- **אופציה 2 (rename):** הקובץ נכנס בשם `HALL_WISDOM_READING_INTELLIGENCE_ARCHITECTURE_SUPERSEDED.md`.
**Commit message מוצע:** `Preserve Reading Intelligence architecture as historical reference (superseded by Core)`
**סיכון:** אין (מסמך-בלבד).
**תלות:** אין.
**דורש אישור אורן:** **כן, במיוחד** — כולל בחירה מפורשת בין 2 האופציות למעלה (או "לא לכלול בכלל", ראו סעיף 11). **לא בוצע כלום כאן — רק המלצה, כנדרש.**

---

## 11. המלצה סופית

**מה צריך להיכנס ל-Git (בכפוף לאישורך המפורש, קובץ-אחר-קובץ, כרגיל):**
- Commit A (Knowledge/Decision Brain Phase 4) — מוכן, נבדק, 996 בדיקות ירוקות.
- Commit B (Reading Intelligence Foundation) — מוכן, נבדק, 54 בדיקות ירוקות, עצמאי מ-A.
- Commit C (Supabase docs) — מוכן, ללא סיכון, מסמכים-בלבד.

**מה לא צריך להיכנס (או להיכנס-בזהירות-מיוחדת):**
- `HALL_WISDOM_READING_INTELLIGENCE_ARCHITECTURE.md` — **לא בטוח שצריך להיכנס כלל בצורתו הנוכחית** (סעיף 7). דורש החלטתך: לשמור-כהיסטוריה (עם/בלי rename), או לא לכלול בכלל ב-git (להשאיר רק-על-הדיסק-המקומי, לא נדרש ב-repo אם Core doc כבר מכיל את כל התוכן המהותי).

**מה חייב להיבדק לפני שמתחילים Intent Analyzer:**
1. **החלטה על אוצר-המילים המאוחד** (5 ערכים של Phase 4 מול 6 ערכים של Reading Intelligence, סעיף 5 למעלה) — Intent Analyzer עצמו לא תלוי-ישירות בזה, אבל ה-Rule Decision Engine שהוא-מזין כן, וכדאי להחליט לפני שבונים עוד רכיב שיצטרך "לבחור צד".
2. **החלטה על גורל Reading Intelligence doc** (סעיף 7/11 למעלה) — לא חוסם טכנית, אבל עדיף לסגור לפני שמצטבר עוד מסמך-שלישי שיצטרך יישור-קו.
3. **כל 3 ה-commits הפתוחים (A/B/C) צריכים לקבל את אישורך** — אני **לא** ממליץ להתחיל Intent Analyzer מעל working tree שעדיין לא-מחויב, כי Intent Analyzer (לפי Core doc) צורך ישירות את `goral-hachol/brain/goral-question-taxonomy.js` (עדיין untracked) — עבודה חדשה מעל בסיס לא-מחויב מגדילה סיכון-לאובדן-עבודה ומקשה על ביקורת-קוד נקייה.

**אין המלצה לפעולה-מתקנת כלשהי כרגע — זהו audit בלבד, כפי שהתבקש.**
