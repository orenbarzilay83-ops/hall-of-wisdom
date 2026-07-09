# HALL_WISDOM_AI_QA_EVALUATOR_PHASE3_PRECOMMIT_REPORT — בינת היכל החכמה: Goral QA AI Evaluator (שלב 3, MOCK)

> **דוח לפני-commit. עדיין לא בוצע commit/push. אין AI חי, אין secret, אין Edge Function deploy, אין deploy, אין merge ל-main, אין תיקון-מנועים, אין נגיעה בגרפיקת-קלפים/UI, אין נגיעה ב-`inner-compass`, לא נוצר ענף חדש.**
> תאריך: 2026-07-09. ממימוש `OREN_SMART_ADVISOR_GORAL_QA_BRAIN_PLAN.md` §H שלב 3 (חלקי — payload+mock evaluator בלבד, ללא חיווט-בפועל ל-Edge Function).

---

## 1. git diff --stat

```
(ריק — שום קובץ קיים לא נערך)
```

**אפס קבצים קיימים שונו.** כל הבנייה היא קבצים חדשים בלבד — כולל `supabase/functions/oren-smart-advisor/index.ts` (**נבדק, לא נערך** — ראו סעיף 6).

## 2. קבצים חדשים

```
?? ai/prompts/hall-wisdom-goral-qa-evaluator.prompt.md         (77 שורות)
?? goral-hachol/qa/goral-qa-ai-payload-builder.js               (80 שורות)
?? goral-hachol/qa/goral-qa-ai-evaluator-mock.js                (107 שורות)
?? goral-hachol/qa/goral-qa-ai-runner.mjs                       (52 שורות)
?? _test_hall_wisdom_ai_qa_evaluator_phase3.mjs                 (110 שורות)
?? HALL_WISDOM_AI_QA_EVALUATOR_PHASE3_PRECOMMIT_REPORT.md       (קובץ זה)
```

## 3. איך מריצים

```bash
node goral-hachol/qa/goral-qa-ai-runner.mjs
```

מריץ את ה-QA Runner (שלב 2) → בונה payload מסונן-פרטיות → מעביר ל-evaluator (כרגע MOCK) → מדפיס סיכום. בלי ארגומנטים, בלי משתני-סביבה, בלי רשת.

## 4. דוגמת payload מקוצר (הרצה אמיתית, תרחיש ראשון בלבד)

```json
{
  "qaRunSummary": { "totalScenarios": 20, "crashed": 0, "scenariosWithProblems": 0, "totalDeterministicProblems": 0 },
  "scenarios": [
    { "id": "commerce-kashf", "category": "commerce", "method": "kashf", "topicId": "commerce", "question": "האם העסק החדש יצליח?" }
  ],
  "collectedOutputs": [
    {
      "scenarioId": "commerce-kashf", "method": "kashf", "topicId": "commerce", "category": "commerce",
      "question": "האם העסק החדש יצליח?",
      "clientOutputHtml": "<div class=\"kashf-reading-output\">...",
      "sectionsShown": [], "sectionsHidden": ["dhamir"],
      "warnings": [ { "code": "dhanab-tinnin-in-house1", "severity": "warning", "hebrewMessage": "בית 1 מכיל את הצורה \"סף יוצא\"..." } ],
      "sourceRulesApplied": [ "במכירה וקנייה: התבונן בראשון, ברביעי, בשני, בשביעי...", "ואם הראשון בא בעשירי, הקונה נדיב מן המוכר." ]
    }
  ],
  "deterministicFindings": []
}
```

## 5. דוגמת output JSON (MOCK, מלא)

```json
{
  "overallDiagnosis": "MOCK (אין AI חי מחובר) — 20 תרחישים נבדקו, 0 בעיות דטרמיניסטיות נמצאו. שכבת-שיפוט-סמנטית אמיתית עדיין לא מחוברת.",
  "scenarioFindings": [ { "scenarioId": "commerce-kashf", "method": "kashf", "topicId": "commerce", "summary": "MOCK — אין ממצא דטרמיניסטי...", "ok": true }, "... (20 סה\"כ)" ],
  "detectedProblems": [],
  "severity": "low",
  "irrelevantSections": [], "missingRelevantSections": [], "advisorOnlyLeaks": [], "clientOutputProblems": [],
  "sourceRuleConcerns": [ { "scenarioId": "illness-hawi", "concern": "MOCK — אין sourceRulesApplied בקלט..." } ],
  "recommendedFixes": [],
  "codeInstructionForClaude": { "needed": false, "instruction": "", "filesToInspect": [], "filesNotToTouch": [], "testsToRun": [] },
  "testsToAdd": [],
  "needsOrenDecision": false,
  "confidence": "low"
}
```

**האם זה AI חי או mock:** **100% MOCK.** אין `fetch`, אין `callAnthropic`, אין `ANTHROPIC_API_KEY` בשום קובץ משלב 3 — אומת ישירות בבדיקה (סעיף 8). `overallDiagnosis`/`confidence`/`scenarioFindings[].summary` כולם מתויגים במפורש "MOCK" בטקסט עצמו. שדות שדורשים שיפוט-שפה אמיתי (`irrelevantSections`/`missingRelevantSections`/`advisorOnlyLeaks`/`clientOutputProblems`) נשארים **ריקים בכוונה** — לא ממציאים תוכן כדי "למלא" שדה.

## 6. חיבור ל-Edge Function — בדיקה בלבד, לא שונה

בדקתי את `supabase/functions/oren-smart-advisor/index.ts` (קריאה בלבד, **לא נערך**). ממצאים:

- `handleAdvisorRequest(req)` **לא קורא בכלל ל-`req.json()`** כרגע — אין קליטת-payload, אין `module`-routing. הוא רק בודק הרשאה (auth gate, עובד ומאומת) ואז מחזיר תמיד `mockAdvisorBrainOutput()` קבוע (עם `module: 'kashf'` קשיח).
- **מה חסר כדי לחבר את ה-QA Evaluator בפועל (לא בוצע כאן, לשלב הבא):**
  1. קריאת `await req.json()` וחילוץ `{ module, payload }`.
  2. `if (module === 'goralQA') { ... }` — ראוטינג לפי המפרט ב-`OREN_SMART_ADVISOR_SITE_BRAIN_POC_PLAN.md`.
  3. עבור `goralQA`: בשלב-ביניים (עדיין בלי secret) — להחזיר את `evaluateQaRunMock(payload)` דרך ה-Edge Function (proof שה-wiring עובד, עדיין MOCK). **רק בשלב מאוחר יותר, עם אישור נפרד ומפורש**: להחליף ל-`callAnthropic` עם `ai/prompts/hall-wisdom-goral-qa-evaluator.prompt.md` ו-`ANTHROPIC_API_KEY` אמיתי.
- אימות-ההרשאה הקיים (Supabase Auth + `ALLOWED_OREN_UID`, fail-closed) **כבר מתאים כמו שהוא** — אין צורך לשנות אותו בשביל goralQA; המודול החדש פשוט ירוץ **אחרי** ההרשאה, כמו כל module אחר.

**לא בוצע שום שינוי בקובץ הזה** — זו בדיקה בלבד, כנדרש.

## 7. תוצאות בדיקות

**בדיקה חדשה — `_test_hall_wisdom_ai_qa_evaluator_phase3.mjs` (30/30 עברו):**
```
✓ payload כולל 20 תרחישים (10 כשף + 10 חאווי)
✓ evaluation עומד בסכימה המלאה (14 שדות נדרשים, כולם קיימים וטיפוסים נכונים)
✓ overallDiagnosis מתויג במפורש MOCK
✓ codeInstructionForClaude בפורמט תקין (needed/instruction/filesToInspect/filesNotToTouch/testsToRun)
✓ אין "phone"/"dynFields"/"clientHistorySummary" בשום מקום ב-payload
✓ collectedOutputs לא כולל board/advisorOnlyOutput/raw גולמיים
✓ sourceRulesApplied כן קיים (מכוון — נחוץ לשיפוט נאמנות-למקור)
✓ אין שינוי במנועים (0 קריסות בהרצה מלאה)
✓ קלפים ו-UI (כולל כותרת "בינת היכל החכמה") ללא שינוי
✓ אין קריאה/ייבוא בפועל של callAnthropic/fetch/ANTHROPIC_API_KEY בשום קובץ חדש
```

**חבילת-הרגרסיה המלאה (13 קבצים, כולל כל התיקונים והשלבים הקודמים) — כולם עברו:**
`goral-qa-ai-runner.mjs`, `goral-qa-runner.mjs`, `_test_goral_qa_brain_phase2.mjs`, `_test_goral_rule_applicability.mjs`, `_test_kashf_house_label_context.mjs`, `_test_kashf_context_sanitizer.mjs`, `_test_kashf_commerce_smart_layer.mjs`, `_test_kashf_commerce_context_coherence.mjs`, `_test_kashf_commerce_context_aware.mjs`, `_test_kashf_context_fields_transfer.mjs`, `_test_kashf_archive_save.mjs`, `cartomancy/_test_cartomancy.mjs`, `_test_oren_smart_advisor_site_brain_poc.mjs`.

**Playwright (דפדפן אמיתי) — `_test_oren_advisor_panel_ui.mjs` — 21/21** — פאנל "בינת היכל החכמה" ללא שינוי.

**`node --check`** על כל קבצי JS/MJS — כולם עברו. **סריקת-שיבוש** (תווים ערביים בלתי-מכוונים מחוץ להערות) על כל 8 הקבצים החדשים משלבים 2+3 — נקי, 0 ממצאים.

## 8. אישורים

- ✅ **אין AI חי** — 0 קריאות `fetch`/`callAnthropic` בכל קובץ חדש (אומת אוטומטית + ידנית).
- ✅ **אין secret** — 0 הפניות ל-`ANTHROPIC_API_KEY` בכל קובץ חדש.
- ✅ **אין Edge Function deploy** — `supabase/functions/**` נבדק בלבד, לא נערך ולא נפרס.
- ✅ אין deploy production, אין merge ל-`main`.
- ✅ **לא שונו מנועים** — `git diff --stat` על קבצים קיימים ריק לחלוטין (סעיף 1); 0 קריסות בהרצה מלאה על 20 תרחישים.
- ✅ **לא שונו קלפים** — `cartomancy/**`/`cards.html` לא נערכו.
- ✅ **לא שונה UI** — `goral-hachol.html`/`goral-hachol/ui/goral-app.js` לא נערכו בשלב הזה (הכותרת "בינת היכל החכמה" מהשלב הקודם נשארה ללא שינוי, אומת).
- ✅ לא נגעתי ב-`inner-compass`, לא נוצר ענף חדש.
- ⏳ **עדיין לא בוצע commit/push** — ממתין לאישורך.

---

## הצעד הבא

ממתין לאישורך ל-commit. לאחר מכן — לפי `OREN_SMART_ADVISOR_GORAL_QA_BRAIN_PLAN.md` §H, חיווט בפועל של `module:'goralQA'` לתוך ה-Edge Function הקיימת (עדיין ללא secret אמיתי, שלב-ביניים) הוא הבא בתור, ודורש אישור נפרד. חיבור AI חי (Anthropic API key אמיתי) הוא שלב נפרד ורגיש יותר בהמשך.
