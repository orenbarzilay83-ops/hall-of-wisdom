# Hall of Wisdom — Rule Decision Engine Foundation — Precommit Report

**סטטוס: לא בוצע Commit. לא בוצע Push. ממתין לאישור מפורש.**

תאריך: 2026-07-14
ענף: `claude/app-cleanup-organization-mia9b2` (אומת — `git branch --show-current`)

---

## 1. מה נבנה

מימוש Foundation בלבד של **Hall of Wisdom Rule Decision Engine**, נאמן ל-
`HALL_WISDOM_RULE_DECISION_ENGINE_COMPONENT_CONTRACT.md` (המסמך המאושר). הרכיב
מקבל Reading Plan + Rule Definitions + Knowledge Context + Strategy
Constraints ומחזיר **Rule Decisions בלבד** — ללא Execution, ללא Narrative,
ללא Audit.

## 2. קבצים חדשים

| קובץ | שורות | תפקיד |
|---|---|---|
| `goral-hachol/intelligence/rule-decision-types.js` | 118 | קטלוג טיפוסים/אנומים — Decision Vocabulary (משוחזר, לא מוגדר-מחדש), Warning Types (13), Conflict Types (7), Client Visibility (4, כולל `hidden` חדש), Decision Order (14 שלבים), Decision Precedence (8 שכבות), Rule ID Namespacing |
| `goral-hachol/intelligence/rule-decision-engine.js` | 464 | המנוע הדטרמיניסטי: `decideRule`, `validateRuleSet` (שלב Rule Set Validation החדש), `buildExecutionInstructions`, `runRuleDecisionEngine` |
| `goral-hachol/intelligence/rule-decision-validators.js` | 359 | ולידטורים: Rule Definition, Rule Decision Record, Warning, Conflict, Input, Engine Output (כולל Stop Result) |
| `_test_hall_wisdom_rule_decision_engine.mjs` | 891 | **218 assertions** (דרישה: ≥200) |

**סה"כ קוד חדש (לא כולל בדיקות): 941 שורות.**

## 3. git diff --stat (מול origin)

```
$ git status --short
?? HALL_WISDOM_RULE_DECISION_ENGINE_COMPONENT_CONTRACT.md   (מאושר בסבב קודם, טרם קומיט)
?? HALL_WISDOM_SESSION_SUMMARY_REPORT.md                    (קיים מסבבים קודמים)
?? HALL_WISDOM_UNCOMMITTED_WORK_AUDIT.md                    (קיים מסבבים קודמים)
?? _test_hall_wisdom_rule_decision_engine.mjs                (חדש, סבב זה)
?? goral-hachol/intelligence/rule-decision-engine.js          (חדש, סבב זה)
?? goral-hachol/intelligence/rule-decision-types.js           (חדש, סבב זה)
?? goral-hachol/intelligence/rule-decision-validators.js      (חדש, סבב זה)

$ git diff --stat
(ריק — אין שינוי לאף קובץ שכבר קיים ב-repo)
```

**אין שום שינוי לקובץ קיים.** במיוחד — `reading-planner.js`,
`reading-planner-types.js`, `reading-planner-validators.js`,
`reading-strategy-builder.js`, `reading-strategy-types.js`,
`intent-analyzer.js`, `intent-types.js` — **כולם לא נגעו כלל** (מאומת גם
דרך `git diff --stat` הריק, וגם דרך תוצאות הרגרסיה בסעיף 5 — ספירות
הבדיקות זהות ל-100%).

## 4. תוצאות בדיקות — Rule Decision Engine

```
$ node _test_hall_wisdom_rule_decision_engine.mjs
218 passed, 0 failed (total 218 assertions)
```

כיסוי (לפי דרישת המשתמש המפורשת):

| קטגוריה | כוסתה |
|---|---|
| Rule Decision — כל 6 הערכים (required/allowed/conditional/advisorOnly/forbidden/unavailable) | ✅ |
| Rule Set Validation (כפילות, סתירה-הדדית, companion חסר, קומבינציה לא-תקינה) | ✅ |
| הפרדת Domain (goralHachol מול cards) | ✅ |
| הפרדת Method (kashf מול hawi, אותו domain) | ✅ |
| Source Fidelity (sourceEvidence חובה ל-required/allowed) | ✅ |
| Required rules | ✅ |
| Forbidden rules | ✅ |
| Conditional rules (activationCondition + requiredInputs, כולל מעבר ל-required כשהתנאי מתקיים) | ✅ |
| Advisor only (כולל דין-קדימות מול missing-input/condition) | ✅ |
| Missing evidence | ✅ |
| Conflicts (ישיר, missing-companion, invalid-combination) | ✅ |
| Stop behavior (readingPlan.stopped, אין Rule Definitions, אין primary decision path, קונפליקט קריטי) | ✅ |
| Rule Set Validation (חזרה מפורשת, ולידציה ישירה) | ✅ |
| מניעת כפילות (Duplicate prevention) | ✅ |
| דחיית Cross-domain | ✅ |
| שמירת מבנה (structural guards — אין import ל-engine/AI/Supabase/matrix חי) | ✅ |
| טוהר אוצר-המילים (Decision Vocabulary purity) | ✅ |
| אינטגרציה אמיתית — Reading Plan אמיתי (מ-Intent Analyzer + Reading Strategy Builder + Reading Planner האמיתיים) מוזן למנוע | ✅ (2 תרחישים: Business Prediction / Hidden Thought) |

## 5. רגרסיה מלאה — כל חבילות הבדיקה הקיימות

```
_test_hall_wisdom_intent_analyzer.mjs                  208 passed, 0 failed   (ללא שינוי)
_test_hall_wisdom_reading_strategy_builder.mjs          282 passed, 0 failed   (ללא שינוי)
_test_hall_wisdom_reading_planner.mjs                   205 passed, 0 failed   (ללא שינוי)
_test_goral_knowledge_decision_brain_phase4.mjs        1010 passed, 0 failed   (ללא שינוי — מוכיח ש-Kashf/Hawi לא נגעו)
_test_hall_wisdom_reading_intelligence_foundation.mjs    54 passed, 0 failed   (ללא שינוי)
_test_goral_qa_brain_phase2.mjs                         כל הבדיקות עברו       (ללא שינוי)
_test_hall_wisdom_ai_qa_evaluator_phase3.mjs            כל הבדיקות עברו       (ללא שינוי, אין AI חי)
```

כל ספירות ה-assertions זהות במדויק לסבב הקודם — הוכחה שאף רכיב קיים לא הושפע.

## 6. דוגמה — Rule Decision Record (required)

תרחיש: שאלת עסק ("האם העסק החדש יצליח?"), Reading Plan אמיתי דורש
`outcomeRules` כ-primaryDecisionCategory, Rule Definition תואם עם
sourceEvidence תקף:

```json
{
  "ruleId": "goral.kashf.r1",
  "ruleVersion": "1.0",
  "decision": "required",
  "decisionReason": "הקטגוריה מסומנת primaryDecisionCategories ב-Reading Plan; כל התנאים התקיימו.",
  "sourceEvidence": ["kashf p.73 — עסק חדש יצליח אם..."],
  "matchedConditions": [],
  "missingConditions": [],
  "requiredInputs": [],
  "missingInputs": [],
  "activationCondition": null,
  "clientVisibility": "client",
  "executionPriority": 1,
  "conflicts": [],
  "confidence": 0.85,
  "warningIds": [],
  "needsOrenDecision": false
}
```

## 7. דוגמה — Rule Set Validation (זיהוי כפילות)

תרחיש: אותו `ruleId` מופיע פעמיים בסט-ההחלטות (באג-אינטגרציה היפותטי
בשכבה מעל) — `validateRuleSet` מזהה ומדרג כ-critical:

```json
{
  "conflicts": [
    {
      "conflictType": "executionOrderConflict",
      "ruleIds": ["goral.kashf.dup1"],
      "severity": "critical",
      "description": "Rule \"goral.kashf.dup1\" מופיע 2 פעמים בסט-ההחלטות — ביצוע-כפול.",
      "recoverable": false,
      "needsOrenDecision": true
    }
  ],
  "warnings": [],
  "stopRequired": true
}
```

`validateRuleSet` **לעולם לא מוסיף/מוריד Rule, ולעולם לא משנה Decision** —
מאומת ישירות בבדיקה ייעודית (סעיף 12h בקובץ הבדיקות: `records`
לא-משתנה לפני/אחרי הקריאה).

## 8. החלטות פרשנות שקופות (לאישור/הערה של אורן, לא חוסמות)

- **דין-הקדימות (Decision Precedence) הוגדר כסמכות עבור ה-`decision` הסופי**, בעוד ש-Decision Order מבוצע כרצף-בדיקות פרוצדורלי. במקרה של התנגשות בין השניים (Decision Order בודק "קלט חסר" בשלבים 10-11, *לפני* "advisorOnly" בשלב 12 — אך Decision Precedence מציב advisorOnly בשכבה 4, *לפני* missing-input/missing-condition בשכבות 5-6) — **advisorOnly מנצח**: Rule שמסומן advisorOnly נשאר advisorOnly גם אם חסרים לו קלטים/תנאים, כי הוא ממילא לא client-facing. מתועד בקוד (`rule-decision-engine.js` שורות 138-146) ונבדק ישירות (בדיקה 5b).
- **"קונפליקט לא-פתור" (unresolved critical) גורם ל-Stop רק כאשר severity=`critical` וגם recoverable=`false`.** קונפליקט מסוג `applicabilityConflict` (Rule מותנה בתנאי ששמו הוא Rule אחר שהוא forbidden/unavailable) מסומן `severity: 'error'` — מוצג כאזהרה/קונפליקט מצורף לרשומה, לא עוצר את המנוע. אם אורן מעדיף שגם זה יעצור — זו נקודת-הרחבה עתידית, לא מומשה כברירת-מחדל כדי לא להמציא סף-חומרה שלא הוגדר במפורש בחוזה.

## 9. אישורים מפורשים

- ✅ **אין שינוי למנועים** — `goral-hachol/engine/*` לא נגע, ואומת גם בבדיקה מבנית (`_test_hall_wisdom_rule_decision_engine.mjs` §19) שאין import מתיקיית `engine/`.
- ✅ **אין AI** — נבדק מבנית: אין `fetch()`, אין הפניה ל-Anthropic/OpenAI בשלושת קבצי-הקוד החדשים.
- ✅ **אין Deploy** — לא בוצעה שום פעולת פריסה.
- ✅ **אין Merge** — לא בוצע merge לשום ענף.
- ✅ **אין Commit, אין Push** — כנדרש במפורש.
- ✅ **Reading Planner / Reading Strategy Builder / Intent Analyzer לא נגעו כלל** — מאומת הן ב-`git diff --stat` (ריק) והן ברגרסיה המלאה (ספירות זהות).
- ✅ **אין Rules חדשים נוספו לספר ידע כלשהו** — כל Rule Definition בבדיקות הוא mock מלאכותי, לא נתון-מקור אמיתי.
- ✅ **סריקת שיבוש** — 0 תווים קיריליים, 0 תבניות `sk-ant-` בכל 4 הקבצים החדשים.

## 10. מה עדיין לא קיים (כמתוכנן ל-Foundation)

- אין חיבור ל-`goral-rule-applicability-matrix.js` / `goral-knowledge-registry.js` החיים.
- אין Rule Definitions אמיתיים בשום מקום בקוד.
- אין חיבור ל-Engine Execution Coordinator (הרכיב הבא ברודמאפ).

---

**ממתין לאישור אורן. לא בוצעה שום פעולת commit/push.**
