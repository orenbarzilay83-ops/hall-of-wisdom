# HALL_WISDOM_READING_STRATEGY_BUILDER_PRECOMMIT_REPORT.md

> **דוח לפני commit. לא בוצע commit. לא בוצע push.**
> תאריך: 2026-07-13. ענף: `claude/app-cleanup-organization-mia9b2`.
> שלב: **מימוש-תשתית ראשון (Foundation Implementation) בלבד** ל-Reading Strategy Builder, לפי `HALL_WISDOM_READING_STRATEGY_BUILDER_COMPONENT_CONTRACT.md` (כבר מאושר וב-git, commit `defa970`).
> **לא מחובר עדיין** למנועי כשף אל-אסרר, למנועי חאווי, ל-UI, ל-Edge Functions, ל-Supabase, או ל-`goral-rule-applicability-matrix.js`/`goral-knowledge-registry.js` החיים — בדיוק כפי שנדרש.
> **עודכן** — שני עדכוני-תכנון בלבד ב-`HALL_WISDOM_CORE_ARCHITECTURE.md` (Pipeline מעודכן + הפרדת Reading/Site Intelligence + AI Usage Boundary). **לא נערך שום קובץ-קוד/Test בסבב הזה.**
> **עודכן שוב** — שני עדכוני-ארכיטקטורה אחרונים נוספים ב-`HALL_WISDOM_CORE_ARCHITECTURE.md`: שכבת-העל **Hall of Wisdom Platform** (חלק 0) ו-**Cost & Usage Intelligence** (הרחבת חלק יד) + הרחבת **AI Usage Boundary** (חלק טו) + עיקרון חדש **AI is an Assistant, Hall of Wisdom Core is the Decision Maker** (חלק טז). **לא נערך שום קובץ-קוד/Test בסבב הזה.**

---

## -1. עדכוני-הארכיטקטורה האחרונים שבוצעו (ב-`HALL_WISDOM_CORE_ARCHITECTURE.md` בלבד)

1. **Platform Layer נוסף** — חלק 0 חדש, לפני חלק א: שכבת-על `Hall of Wisdom Platform` הכוללת את Core, Intelligence (Reading+Site), Applications (Goral HaChol, Cards, Future Modules, Advisor Tools), Platform Services (Authentication, Users, Client Archive, Reports, PDF, API, Payments/Notifications/Integrations-עתידיים), ו-AI Runtime. הובהר: Core = לב-המערכת, Platform = כל-המערכת, כל מודול-עתידי-שאינו-Core שייך ל-Platform.
2. **Cost & Usage Intelligence נוסף** — תת-רכיב חדש תחת Site Intelligence (הרחבת חלק יד): מעקב-שימוש-AI, מעקב-עלויות, זיהוי-שימוש-חריג, ניתוח-מגמות, המלצת-מודל, התרעת-תקציב, ניתוח לפי כלי/משתמש/יועץ/קריאה/בדיקת-תחזוקה. הובהר במפורש כרכיב-בקרה-בלבד: אינו מבצע חיוב, אינו משנה מודל, אינו קובע תמחור, אינו מפעיל AI בעצמו.
3. **AI Usage Boundary הורחב** — חלק טו: נוספה רשימת Platform Services מפורשת (Authentication/Users/Reports/Archive/PDF/Payments/Notifications/Settings/Calculator/Navigation) שכולם דטרמיניסטיים-ללא-AI-כברירת-מחדל; 3 ה-scopes המותרים (`reading.cards`/`reading.goralHachol`/`siteMaintenance`) נשארו בדיוק כפי שהיו — Cost & Usage Intelligence **אינו** scope רביעי, הוא רק צרכן של רשומות-המטא-דאטה הקיימות.
4. **Architecture Principle נוסף** — חלק טז חדש: **"AI is an Assistant, Hall of Wisdom Core is the Decision Maker"** — כל החלטה מקצועית מתקבלת ב-Core; AI מסביר/מבקר/מציע/מסכם בלבד; AI אינו מחליף מנועי-ידע, אינו מחליף ספרים, אינו מחליף החלטת-אורן. מוצג גם כ"עיקרון-בדיקה" לכל רכיב-עתידי.
5. **אישור: אין שינוי קוד** — שום קובץ `.js`/`.mjs` נערך בסבב הזה.
6. **אישור: אין שינוי Tests** — `_test_hall_wisdom_reading_strategy_builder.mjs` נשאר untracked, לא נערך.
7. **אישור: אין שינוי מנועים** — `goral-hachol/engine/*` לא נגוע.
8. **אישור: אין שינוי QA** — `goral-hachol/qa/*` לא נגוע.
9. **אישור: אין שינוי UI** — `goral-hachol.html`/`goral-hachol/ui/*`/`cards.html`/`cartomancy/*` לא נגועים.
10. **אישור: אין AI Runtime חי** — כל התוספות (Cost & Usage Intelligence, AI Usage Boundary המורחב, Architecture Principle) הן תיעוד-עקרוני-בלבד, ללא קוד-AI, ללא `fetch`, ללא `callAnthropic`.
11. **אישור: אין Deploy** — לא בוצע.
12. **אישור: אין Merge ל-main** — לא בוצע. כל העבודה על `claude/app-cleanup-organization-mia9b2` בלבד.

---

## 0. עדכוני-התכנון שבוצעו (ב-`HALL_WISDOM_CORE_ARCHITECTURE.md` בלבד)

1. **Pipeline העתידי המעודכן** (חלק יא) — נוסף שלב `Knowledge Decision Pipeline` בין Reading Strategy ל-Reading Plan:
   ```
   Question → Intent Analyzer → Reading Strategy Builder → Knowledge Decision Pipeline →
   Reading Planner → Rule Decision Engine → Engine Execution Coordinator →
   Verification & Evidence → Reasoning Layer → Client Narrative Builder →
   Advisor Narrative Builder → Audit Module → Mentor Module
   ```
2. **אישור: Reading Strategy Builder משתלב לפני Knowledge Decision Pipeline ו-Reading Planner** — מתועד במפורש בחלק יא: "Reading Strategy Builder קובע מדיניות ומגבלות (`strategyConstraints`), **לא בוחר Rule IDs סופיים**"; "Knowledge Decision Pipeline מספק ידע, התאמות ומגבלות" (לא רכיב-חדש, אלא כינוי-זרימה ל-Knowledge Memory/Matrix/Registry הקיימים); "Reading Planner בונה תוכנית קריאה"; "Rule Decision Engine מקבל החלטות סופיות לכל חוק"; "Engine Execution Coordinator מפעיל רק מנועים שנבחרו"; "Narrative Builders בונים פלטים נפרדים ללקוח וליועץ".
3. **אישור: נוספה הפרדה בין Reading Intelligence ל-Site Intelligence** — חלק יד חדש ב-`HALL_WISDOM_CORE_ARCHITECTURE.md`, עץ-Domains מלא תחת Hall of Wisdom Intelligence:
   - **Reading Intelligence** — Goral HaChol (Kashf/Hawi) + Cards. פועלת רק עבור קריאות-גורל, אינה נדרשת לכלים דטרמיניסטיים אחרים באתר.
   - **Site Intelligence** — Site Health Checks, Regression Detection, UI/Navigation Checks, Auth/Database Checks, Deployment Health, Broken Imports, Security/Privacy Checks, QA Supervisor, Claude Repair Planner. Domain נפרד-לגמרי, לא תת-רכיב של Reading Intelligence — בודקת את כל האתר, אוספת ממצאים דטרמיניסטיים, AI (כשיגיע) רק לניתוח/תעדוף/הוראות-לקלוד, אינה משנה קוד ואינה מבצעת Deploy/Merge אוטומטי.
4. **אישור: AI נדרש רק עבור 3 scopes** — חלק טו חדש, "AI Usage Boundary": `reading.cards`, `reading.goralHachol`, `siteMaintenance` — בתוספת מבנה-מטא-דאטה עקרוני לכל קריאת-AI עתידית (`scope, tool, operation, actorType, provider, model, inputTokens, outputTokens, estimatedCost, readingIdOrCheckId, createdAt`). **עיקרון ארכיטקטוני בלבד — לא ממומש Usage Metering בשלב זה.**
5. **אישור: שאר הכלים באתר נשארים דטרמיניסטיים** — מתועד במפורש בחלק טו: "שאר הכלים באתר... נשארים דטרמיניסטיים לחלוטין ואינם יוצרים קריאת-AI או עלות-AI בשום נסיבה", מורחב מעיקרון Core Constitution §2 (Deterministic Engines) שכבר קיים.
6. **אישור: לא שונה קוד ה-Strategy Builder** — `goral-hachol/intelligence/reading-strategy-builder.js` ו-`reading-strategy-types.js` נשארו **untracked, בדיוק כפי שהיו**, לא נערכו בסבב הזה (ראו סעיף 5 למטה — `git status --short`).
7. **אישור: לא שונו Tests** — `_test_hall_wisdom_reading_strategy_builder.mjs` נשאר untracked, לא נערך.
8. **אישור: אין AI חי** — לא בוצעה שום קריאת-AI, לא נוסף קוד-AI; חלק טו הוא תיעוד-עקרון בלבד.
9. **אישור: אין Deploy** — לא בוצע.
10. **אישור: אין Merge ל-main** — לא בוצע. כל העבודה על `claude/app-cleanup-organization-mia9b2` בלבד.

---

## 1. קבצים שנוצרו

| קובץ | שורות | תפקיד |
|---|---|---|
| `goral-hachol/intelligence/reading-strategy-types.js` | 169 | Single source of truth: enums-מדיניות, `STRATEGY_VERSION`, קטלוג-קטגוריות v1 (`STRATEGY_CONSTRAINT_CATEGORIES`), מיפויים דטרמיניסטיים (Intent→primary-evidence, hint→may-include, תוויות עבריות/אנגליות). |
| `goral-hachol/intelligence/reading-strategy-builder.js` | 398 | המנוע: `buildReadingStrategy()` + 4 תת-הרכיבים הפנימיים — Strategy Resolver, Constraints Resolver, Strategy Reason Builder, Validators (`validateStrategyInput`/`validateStrategyResult`). |
| `_test_hall_wisdom_reading_strategy_builder.mjs` | 340 | 238 assertions. |

## 2. קבצים ששונו

**אין.** לא נערך שום קובץ קיים — לא מנוע, לא QA, לא UI, לא קלפים, לא Supabase, לא Intent Analyzer.

```
$ git status --short
?? HALL_WISDOM_READING_STRATEGY_BUILDER_PRECOMMIT_REPORT.md   (קובץ זה)
?? HALL_WISDOM_SESSION_SUMMARY_REPORT.md                       (ישן, לא-קשור, לא נגוע)
?? HALL_WISDOM_UNCOMMITTED_WORK_AUDIT.md                       (ישן, לא-קשור, לא נגוע)
?? _test_hall_wisdom_reading_strategy_builder.mjs
?? goral-hachol/intelligence/reading-strategy-builder.js
?? goral-hachol/intelligence/reading-strategy-types.js
```

---

## 3. Architecture Diagram

```
Intent Analyzer (analyzeIntent)
        │  Intent Result (primaryIntent, secondaryIntents,
        │  confidence, requiresClarification, questionType, ...)
        ▼
┌─────────────────────────────────────────────────────────────┐
│              Reading Strategy Builder (foundation)            │
│                                                                 │
│  buildReadingStrategy({ intentResult, method, questionType }) │
│           │                                                    │
│           ├─► [2] Strategy Resolver                           │
│           │      defaultStrategyHints → verificationPolicy,   │
│           │      clientDepth, advisorDepth, hiddenSections,   │
│           │      timingPolicy, spiritualPolicy, ...           │
│           │                                                    │
│           ├─► [3] Constraints Resolver                        │
│           │      forbiddenDefaultRuleCategories +              │
│           │      per-intent evidence map → strategyConstraints │
│           │      { mustInclude, mayInclude, mustExclude,       │
│           │        advisorOnly, requiresEvidence,               │
│           │        forbiddenWithoutQuestion }                  │
│           │                                                    │
│           └─► [4] Strategy Reason Builder                     │
│                  template-based → strategyReason (Hebrew,      │
│                  deterministic, no chain-of-thought)            │
│                                                                 │
│  unknown primaryIntent → conservativeStrategyValues() +        │
│  conservative constraints, never guessed                       │
└─────────────────────────────────────────────────────────────┘
        │  ReadingStrategy (23 fields, per component contract)
        ▼
[5] validateStrategyResult() — structural + policy-enum + PII/CoT checks
        │
        ▼
   (not built yet: Reading Planner) ── explicitly NOT wired in this phase
```

---

## 4. אילו Tests נוספו (238 assertions, כולן ב-`_test_hall_wisdom_reading_strategy_builder.mjs`)

- **Output-contract shape** — 23 שדות + 6 שדות `strategyConstraints`.
- **Prediction** — "האם העסק החדש יצליח?"
- **Decision Support** — "האם כדאי לי לפתוח עסק?"
- **Timing** — "מתי העסק יתחיל להרוויח?"
- **Hidden Thought** — "מה הוא חושב עליי?"
- **Advisor Only** — invariant (אין חפיפה בין `advisorOnly` ל-client-visible) + נבדק חוצה-4-שאלות.
- **Mixed Intent** — "האם כדאי לי לנסוע, ומתי?" (secondary evidence + gating נכון).
- **Ambiguous Question** — zero-signal ("מה קורה בעסק?") + near-tie ("מתי כדאי לי לנסוע?").
- **Conflict Detection** — 5 תרחישי-הפרה מלאכותיים: `mustInclude∩mustExclude`, `mayInclude∩mustExclude`, `advisorOnly∩client-visible`, `forbiddenWithoutQuestion` בלי `requiresEvidence`, קטגוריה לא-מוכרת.
- **strategyReason** — פרטיות (הזרקת-מספר-טלפון), chain-of-thought (8 מרקרים אסורים, זהה למוסכמה שכבר אומצה ב-Intent Analyzer).
- **strategyVersion** — עקביות חוצה-שאלות + תואם למחרוזת המיוצאת.
- **Strict Method Separation** — structural (method מועבר נכון; קטגוריות-לפי-שיטה ממתינות לאינטגרציה עתידית).
- **`validateStrategyInput`** — קלט תקין/לא-תקין.
- **`validateStrategyResult`** — 8 תרחישי-כשל (שדה חסר, ריק, enum לא-תקין, צורה-לא-תקינה, אי-התאמה בין `requiresClarification`/`clarificationQuestion`/`needsOrenDecision`).
- **מיפוי Intent→Strategy** — נבדק על 11 מתוך 12 ה-intents (השאלות הידועות מ-`_test_hall_wisdom_intent_analyzer.mjs`), מוודא `goal`/`primaryEvidence` לא-ריקים ווולידציה-נקייה בכל אחד.
- **Structural guards** — אין ייבוא מ-`engine/`/`goral-rule-applicability-matrix`/`goral-knowledge-registry`, אין `fetch`/`callAnthropic`/`ANTHROPIC_API_KEY`/Supabase.

---

## 5. האם כל ה-Tests עברו

**כן — כולם, כולל regression מלא:**

```
_test_hall_wisdom_reading_strategy_builder.mjs        → 238 passed, 0 failed
_test_hall_wisdom_intent_analyzer.mjs                  → 208 passed, 0 failed (regression, ללא שינוי)
_test_goral_knowledge_decision_brain_phase4.mjs        → 1010 passed, 0 failed
_test_hall_wisdom_reading_intelligence_foundation.mjs   → 54 passed, 0 failed
_test_goral_qa_brain_phase2.mjs                         → כל הבדיקות עברו
_test_hall_wisdom_ai_qa_evaluator_phase3.mjs             → כל הבדיקות עברו
```

סריקת-שיבוש (עברית/ערבית/קירילית לא-מכוונת) וסריקת-סוד (`sk-ant-...`) — שתיהן נקיות על כל 3 הקבצים החדשים.

---

## 6. האם נדרשים שינויים נוספים לפני אינטגרציה

**כן, בכוונה — זה בדיוק גבול-השלב שנקבע מראש:**

- **קטלוג הקטגוריות** (`STRATEGY_CONSTRAINT_CATEGORIES`, `PRIMARY_EVIDENCE_CATEGORIES_BY_INTENT`) הוא **v1 עצמאי**, לא מותאם עדיין מול `goral-rule-applicability-matrix.js`/`goral-knowledge-registry.js` האמיתיים — תואם-בדיוק להוראה "אסור עדיין לחבר אותו למנועי גורל החול". התאמה זו היא עבודת-אינטגרציה עתידית מפורשת, לא בוצעה כאן.
- **Strict Method Separation** נבדק כרגע ברמת-מבנה (`method` מועבר נכון) בלבד — לא ברמת "קטגוריה X אסורה בשיטה Y", כי אין עדיין קישור לרשימת-קטגוריות-אמיתית-לפי-שיטה.
- **הרכיב אינו מחובר לשום דבר** — לא ל-Reading Planner (עוד לא קיים), לא למנוע, לא ל-UI, לא ל-QA.
- **עדכון (סבב זה):** ה-Pipeline הרשמי כעת כולל `Knowledge Decision Pipeline` בין Strategy Builder ל-Planner — כשה-Reading Planner ייבנה בפועל, הוא יצטרך לצרוך גם את הפלט הזה, לא רק את ה-`ReadingStrategy`.

---

## 7. לפני Commit — בדיקות שבוצעו כעת (סבב עדכון-התכנון)

**1. `git status --short`:**
```
 M HALL_WISDOM_CORE_ARCHITECTURE.md
?? HALL_WISDOM_READING_STRATEGY_BUILDER_PRECOMMIT_REPORT.md   (קובץ זה)
?? HALL_WISDOM_SESSION_SUMMARY_REPORT.md                       (ישן, לא-קשור, לא נגוע)
?? HALL_WISDOM_UNCOMMITTED_WORK_AUDIT.md                       (ישן, לא-קשור, לא נגוע)
?? _test_hall_wisdom_reading_strategy_builder.mjs
?? goral-hachol/intelligence/reading-strategy-builder.js
?? goral-hachol/intelligence/reading-strategy-types.js
```

**2. `git diff --stat`:**
```
 HALL_WISDOM_CORE_ARCHITECTURE.md | 100 +++++++++++++++++++++++++++++++++++++++
 1 file changed, 100 insertions(+)
```

**3. רשימת המסמכים ששונו:** `HALL_WISDOM_CORE_ARCHITECTURE.md` (100+ שורות נוספו — Pipeline מעודכן, חלק יד, חלק טו) ו-`HALL_WISDOM_READING_STRATEGY_BUILDER_PRECOMMIT_REPORT.md` (קובץ זה, untracked). **שני מסמכים בלבד.**

**4. אישור — קבצי-הקוד הבאים לא השתנו בסבב הזה** (עדיין untracked, זהים-בייט-לבייט למה שנוצר בסבב הקודם):
- `goral-hachol/intelligence/reading-strategy-types.js`
- `goral-hachol/intelligence/reading-strategy-builder.js`
- `_test_hall_wisdom_reading_strategy_builder.mjs`

**5. תוצאות הבדיקות הקיימות (הורצו-מחדש כעת, לוודא שהעדכון-התכנוני לא שינה שום דבר):**
```
_test_hall_wisdom_reading_strategy_builder.mjs        → 238 passed, 0 failed
_test_hall_wisdom_intent_analyzer.mjs                  → 208 passed, 0 failed
_test_goral_knowledge_decision_brain_phase4.mjs        → 1010 passed, 0 failed
_test_hall_wisdom_reading_intelligence_foundation.mjs   → 54 passed, 0 failed
_test_goral_qa_brain_phase2.mjs                         → כל הבדיקות עברו
_test_hall_wisdom_ai_qa_evaluator_phase3.mjs             → כל הבדיקות עברו
```
זהה-לחלוטין לתוצאות מהסבב הקודם — כצפוי, שכן לא נערך שום קובץ-קוד.

**6. אישור — אין שינוי מנועים/UI/קלפים/Supabase:** ✅ `goral-hachol/engine/*` לא נגוע. ✅ `goral-hachol.html`/`goral-hachol/ui/*` לא נגוע. ✅ `cards.html`/`cartomancy/*` לא נגוע. ✅ `supabase/*` לא נגוע. השינוי היחיד בסבב הזה הוא תכנוני-בלבד ב-`HALL_WISDOM_CORE_ARCHITECTURE.md`.

## אישורים

✅ אין שינוי במנועי כשף אל-אסרר. ✅ אין שינוי במנועי חאווי. ✅ אין שינוי ב-UI. ✅ אין שינוי ב-Edge Functions. ✅ אין AI (Claude/OpenAI/Anthropic). ✅ אין Supabase. ✅ אין Deploy. ✅ אין Merge ל-main. ✅ אין commit. ✅ אין push.

---

## 8. לאחר העדכון (סבב Platform Layer + Cost & Usage Intelligence)

**1. `git diff --stat`:**
```
 HALL_WISDOM_CORE_ARCHITECTURE.md | 200 +++++++++++++++++++++++++++++++++++++++
 1 file changed, 200 insertions(+)
```
(מצטבר מתחילת-הסבב-התכנוני — כולל גם את עדכון ה-Pipeline/Reading-Site-Intelligence מהסבב הקודם וגם את Platform Layer/Cost & Usage/Architecture Principle מהסבב הזה, שכן שני הסבבים עדיין לא-commit על אותו קובץ.)

**2. אילו מסמכים השתנו:** `HALL_WISDOM_CORE_ARCHITECTURE.md` בלבד (מסמך יחיד, `M` ב-git status) + `HALL_WISDOM_READING_STRATEGY_BUILDER_PRECOMMIT_REPORT.md` (קובץ זה, untracked).

**3. אישור — לא השתנה אף קובץ קוד:**
```
$ git status --short
 M HALL_WISDOM_CORE_ARCHITECTURE.md
?? HALL_WISDOM_READING_STRATEGY_BUILDER_PRECOMMIT_REPORT.md
?? HALL_WISDOM_SESSION_SUMMARY_REPORT.md          (ישן, לא-קשור)
?? HALL_WISDOM_UNCOMMITTED_WORK_AUDIT.md          (ישן, לא-קשור)
?? _test_hall_wisdom_reading_strategy_builder.mjs
?? goral-hachol/intelligence/reading-strategy-builder.js
?? goral-hachol/intelligence/reading-strategy-types.js
```
שלושת קבצי-הקוד/Test בתחתית הרשימה נשארים `??` (untracked, לא-נערכים) — בדיוק כפי שהיו מאז הסבב שאושר.

**4. אישור — Reading Strategy Builder Foundation עצמו לא השתנה:** ✅ `goral-hachol/intelligence/reading-strategy-builder.js`, `reading-strategy-types.js`, `_test_hall_wisdom_reading_strategy_builder.mjs` — זהים-בייט-לבייט למה שנוצר ואושר קודם. שום Edit לא בוצע עליהם בסבב הזה.

**5. אישור — הבדיקות עדיין תקינות (הורצו-מחדש כעת):**
```
_test_hall_wisdom_reading_strategy_builder.mjs        → 238 passed, 0 failed
_test_hall_wisdom_intent_analyzer.mjs                  → 208 passed, 0 failed
_test_goral_knowledge_decision_brain_phase4.mjs        → 1010 passed, 0 failed
_test_hall_wisdom_reading_intelligence_foundation.mjs   → 54 passed, 0 failed
_test_goral_qa_brain_phase2.mjs                         → כל הבדיקות עברו
_test_hall_wisdom_ai_qa_evaluator_phase3.mjs             → כל הבדיקות עברו
```
זהה-לחלוטין לתוצאות מכל הסבבים הקודמים — כצפוי, שכן זהו עדכון-תכנון-בלבד.
