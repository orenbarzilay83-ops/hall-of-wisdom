# HALL_WISDOM_GORAL_QA_LIVE_AI_READY_PRECOMMIT_REPORT — module:"goralQA" Live-Ready (MOCK כברירת-מחדל, בלי secret אמיתי)

> **דוח לפני-commit. עדיין לא בוצע commit/push. אין secret אמיתי, אין supabase functions deploy, אין production deploy, אין merge ל-main, אין תיקון-מנועים, אין נגיעה בקלפים/UI/`inner-compass`, לא נוצר ענף חדש. אין שום קריאת-רשת אמיתית — כל fetch מוחלף ב-mock מבוקר בבדיקות.**
> תאריך: 2026-07-09. ממימוש `HALL_WISDOM_GORAL_QA_LIVE_AI_INTEGRATION_PLAN.md` §H (שלבים 1-4 מתוך 6, ללא secret אמיתי/deploy — אלה נשארים שלב נפרד).

---

## 1. git diff --stat

```
 _test_hall_wisdom_goral_qa_edge_mock.mjs       |  14 ++--
 supabase/functions/oren-smart-advisor/index.ts | 108 ++++++++++++++++++++++---
 2 files changed, 107 insertions(+), 15 deletions(-)
```

## 2. קבצים חדשים/שונו

```
 M  _test_hall_wisdom_goral_qa_edge_mock.mjs                        (עדכון-assertion שהתיישן — ראו סעיף 9)
 M  supabase/functions/oren-smart-advisor/index.ts                  (+108 שורות)
?? supabase/functions/oren-smart-advisor/anthropic-provider-edge.ts (חדש, self-contained)
?? supabase/functions/oren-smart-advisor/goral-qa-evaluator-prompt.ts (חדש, self-contained)
?? supabase/functions/oren-smart-advisor/goral_qa_payload_sanitizer.ts (חדש, self-contained)
?? _test_hall_wisdom_goral_qa_live_ai.mjs                            (חדש, 33 assertions)
?? HALL_WISDOM_GORAL_QA_LIVE_AI_INTEGRATION_PLAN.md                  (מהתור הקודם — עדיין לא הוכרע אם לצרף, ראו סעיף 12)
?? HALL_WISDOM_GORAL_QA_LIVE_AI_READY_PRECOMMIT_REPORT.md            (קובץ זה)
```

**שום קובץ אחר לא נערך** — כולל `goral_qa_mock_evaluator.ts` (הקיים, לא שונה), `ai/provider/anthropic-provider.js` (המקורי, לא שונה — הפורט החדש עצמאי-לחלוטין), `ai/prompts/hall-wisdom-goral-qa-evaluator.prompt.md` (לא שונה — ראו סעיף 12 לגבי חוב-סנכרון מתועד).

## 3. איך נשמר MOCK כברירת מחדל

**שלוש שכבות-הגנה עצמאיות**, כל אחת לבדה מספיקה לשמור MOCK:
1. **אין `body.mode === 'live'` בבקשה** → MOCK מיידי, בלי אפילו לבדוק את יתר-התנאים (רוב-הבקשות היום, כולל כל הבדיקות-הקיימות).
2. **`HALL_WISDOM_AI_MODE` לא מוגדר כ-`'live'`** בסביבת-השרת (המצב האמיתי-כרגע — המשתנה הזה לא-קיים בשום `.env`/secret אמיתי) → `mock`, `liveModeUnavailableReason:'mode-not-live'`.
3. גם אם שני-אלה יתקיימו יום אחד — **`ANTHROPIC_API_KEY`/`ANTHROPIC_MODEL` עדיין לא-קיימים בשום מקום** (לא נוספו בשלב הזה) → `mock`, `liveModeUnavailableReason:'missing-api-key'`/`'missing-model'`.

**המשמעות המעשית: היום, בהיעדר כל שינוי-סביבה נוסף, `module:"goralQA"` מתנהג בדיוק כמו לפני השלב הזה — MOCK תמיד**, אומת ישירות בבדיקה (`_test_hall_wisdom_goral_qa_edge_mock.mjs`, ללא שינוי-משמעותי בהתנהגות).

## 4. איך מופעל live — כל 5 התנאים ביחד (לא שני-בלבד, כדי למנוע-אי-דיוק)

בנוסף לאימות-ההרשאה שכבר קיים (auth תקין, UID תואם — שלבים 1-5 הישנים), נדרשים **כל חמשת** התנאים הבאים:
1. `body.mode === 'live'` (בקשה מפורשת מהקורא)
2. `HALL_WISDOM_AI_MODE === 'live'` (מתג-שרת)
3. `ANTHROPIC_API_KEY` קיים בסביבה
4. `ANTHROPIC_MODEL` קיים בסביבה (לא-מקובע-בקוד — לפי הנחייתך, לא הומצא שם-מודל)
5. `sanitizeGoralQaPayloadForAi(payload).ok === true`

כל תנאי-חסר עוצר את השרשרת **מיד** (ללא-בדיקת-התנאים-הבאים) ומחזיר MOCK עם `liveModeUnavailableReason` ספציפי (`mode-not-live`/`missing-api-key`/`missing-model`/`sanitization-failed`/`anthropic-error`).

## 5. איך מתבצעת הסניטציה

`goral_qa_payload_sanitizer.ts` (self-contained, 0 imports) — **הגנה שרתית עצמאית**, לא-תלויה-ב-payload-builder-המקומי (כי ה-Edge Function מקבלת payload מהקורא, שיכול-לא-להשתמש-בו):
- סורק את כל ה-payload (JSON.stringify) לחיפוש המפתחות האסורים (`"phone"`/`"dynFields"`/`"clientHistorySummary"`) — נמצא-אחד → `{ok:false, reason:'sanitization-failed'}`.
- בודק אורך כל מחרוזת ב-`sourceRulesApplied` (חשד ל"sourceText מלא"/דאמפ-עמוד-שלם, לא ציטוט-כלל קצר) — מעל 2000 תווים → נחסם.

**החלטה מתועדת (כפי שביקשת שאסביר):** כשנמצא שדה-אסור — **חוסמים live ונופלים-חזרה-ל-MOCK** (`sanitization-failed`), **לא** מנקים-בשקט-וממשיכים. נימוק: ניקוי-שקט עלול-להסתיר-באג בשכבה-שמעליה (שהייתה-אמורה-כבר-לסנן) ולתת ביטחון-שווא. חסימה-עם-סיבה-גלויה שקופה יותר ועקבית עם עקרון-ה-fail-closed שכבר-נהוג באתר.

**אומת בפועל:** בדיקה 6 ב-`_test_hall_wisdom_goral_qa_live_ai.mjs` שולחת payload עם `phone` מזוהם, `mode:'live'` מלא + כל-התנאים-האחרים-תקינים — מוודאת ש-`liveModeUnavailableReason==='sanitization-failed'` **וגם** ש-**0 קריאות-fetch נוספות בוצעו** (ה-AI מעולם-לא-ראה את הטלפון).

## 6. איך מוכח שאין AI call לפני auth

זהה-לדפוס-שכבר-קיים ומאומת: **התנהגותי** — בדיקה 10 שולחת `mode:'live'` + payload-תקין-לגמרי + `fetchMockImpl` שהיה-מחזיר-הצלחה **אם-הייתה-נקראת** — עם token חסר/UID-לא-תואם, ומוודאת **0 קריאות-fetch נוספות**. **סטטי** — `src.indexOf("errorCode: 'forbidden'") < src.indexOf('callAnthropicEdge({')` נבדק ישירות על טקסט-הקובץ.

## 7. איך מוכח שאין imports חוצה-תיקיות

בדיקה 11 (חדשה) קוראת את 4 קבצי ה-Edge Function (`index.ts` + 3 החדשים) ומוודאת ש-**אף אחד מהם** לא-מכיל שום `import ... from '../...'` (רגקס על import-statement אמיתי). כל ה-imports ב-`index.ts` הם `from './...'` (אותה תיקייה בלבד).

## 8. דוגמת request — MOCK (ברירת מחדל, ללא mode)

```http
POST /oren-smart-advisor
Authorization: Bearer <token>
Content-Type: application/json

{ "module": "goralQA", "payload": { "scenarios": [...], "collectedOutputs": [...] } }
```
→ `200 { ok:true, module:'goralQA', evaluatorMode:'mock', evaluatorOutput:{...} }` (ללא `liveModeUnavailableReason` — לא-נשלח live בכלל).

## 9. דוגמת request — Live-ready (כרגע עדיין נופל ל-mock, כי אין secrets)

```http
POST /oren-smart-advisor
Authorization: Bearer <token>
Content-Type: application/json

{ "module": "goralQA", "mode": "live", "payload": { "scenarios": [...], "collectedOutputs": [...] } }
```
→ בסביבה-האמיתית-כיום (`HALL_WISDOM_AI_MODE`/`ANTHROPIC_API_KEY`/`ANTHROPIC_MODEL` לא-מוגדרים): `200 { ok:true, module:'goralQA', evaluatorMode:'mock', liveModeUnavailableReason:'mode-not-live', evaluatorOutput:{...} }`.

## 10. דוגמת response — Live מדומה-בבדיקה-בלבד (fetch מוחלף, לא-Anthropic-אמיתי)

```json
{
  "ok": true,
  "module": "goralQA",
  "evaluatorMode": "live",
  "evaluatorOutput": {
    "overallDiagnosis": "LIVE-TEST — הכל תקין.",
    "scenarioFindings": [], "detectedProblems": [], "severity": "low",
    "irrelevantSections": [], "missingRelevantSections": [], "advisorOnlyLeaks": [], "clientOutputProblems": [],
    "sourceRuleConcerns": [], "recommendedFixes": [],
    "codeInstructionForClaude": { "needed": false, "instruction": "", "filesToInspect": [], "filesNotToTouch": [], "testsToRun": [] },
    "testsToAdd": [], "needsOrenDecision": false, "confidence": "high"
  }
}
```
(תוצר-בדיקה 7 — `fetchMockImpl` מחזיר תגובת-Anthropic מדומה עם JSON תקין; `evaluatorOutput` הוא בדיוק מה שה-mock-הזה החזיר, מוכיח JSON.parse+ולידציית-סכימה עובדים.)

## 11. תוצאות בדיקות

**`_test_hall_wisdom_goral_qa_live_ai.mjs` (חדש, 33/33 עברו):** כל 12 התרחישים מדרישה 7 — 401/403/mock-ברירת-מחדל/mode-not-live/missing-api-key/missing-model/sanitization-blocks-live/live-success/anthropic-http-error/anthropic-non-json/no-AI-before-auth/no-cross-dir-imports/regression — כולם ירוקים.

**`_test_hall_wisdom_goral_qa_edge_mock.mjs` (מעודכן, 38/38 עברו)** — assertion אחת עודכנה (סעיף 9), שאר 37 ללא שינוי.

**`_test_oren_smart_advisor_auth_function.mjs` (לא נערך) — עדיין 100% ירוק.**

**חבילת-הרגרסיה המלאה (13 קבצים נוספים) — כולם עברו:** `_test_hall_wisdom_ai_qa_evaluator_phase3.mjs`, `goral-qa-ai-runner.mjs`, `goral-qa-runner.mjs`, `_test_goral_qa_brain_phase2.mjs`, `_test_goral_rule_applicability.mjs`, `_test_kashf_house_label_context.mjs`, `_test_kashf_context_sanitizer.mjs`, `_test_kashf_commerce_smart_layer.mjs`, `_test_kashf_commerce_context_coherence.mjs`, `_test_kashf_commerce_context_aware.mjs`, `_test_kashf_context_fields_transfer.mjs`, `_test_kashf_archive_save.mjs`, `cartomancy/_test_cartomancy.mjs`, `_test_oren_smart_advisor_site_brain_poc.mjs`.

**Playwright — `_test_oren_advisor_panel_ui.mjs` — 21/21.** **`node --check`** — כל JS/MJS עבר. **סריקת-שיבוש** ו**סריקת-secret** (`sk-ant-` pattern) על כל 6 הקבצים החדשים/שונו — נקי.

## 12. הערה — קובץ מהתור הקודם

`HALL_WISDOM_GORAL_QA_LIVE_AI_INTEGRATION_PLAN.md` (התוכנית שאישרת) עדיין untracked — **לא נכלל כאן** ברשימת-הקבצים-לאישור אלא-אם-תאשר במפורש לצרפו לקומיט הזה (או קומיט נפרד).

## 13. אישורים

- ✅ **אין secret אמיתי** — `ANTHROPIC_API_KEY`/`HALL_WISDOM_AI_MODE`/`ANTHROPIC_MODEL` לא-נוספו לשום סביבה אמיתית; רק שמות-משתנים בקוד + ערכים-מזויפים-מפורשים בבדיקות (`FAKE_API_KEY`, `FAKE_MODEL`).
- ✅ **`supabase secrets set` לא הורץ.**
- ✅ **`supabase functions deploy` לא הורץ.**
- ✅ **אין production deploy, אין merge ל-`main`.**
- ✅ **אין קריאת-רשת אמיתית ל-Anthropic** — כל `fetch` מוחלף ב-mock מבוקר בבדיקות; אומת (`fetchCallCount`) בכל תרחיש.
- ✅ לא שונו מנועי Kashf/Hawi, לא שונו קלפים, לא שונה UI.
- ✅ לא נגעתי ב-`inner-compass`, לא נוצר ענף חדש.
- ⏳ **עדיין לא בוצע commit/push** — ממתין לאישורך.

---

## הצעד הבא

ממתין לאישורך ל-commit. חיבור `ANTHROPIC_API_KEY`/`ANTHROPIC_MODEL` אמיתיים ו-`supabase functions deploy` בפועל נשארים שלב נפרד, רגיש-יותר, דורש אישור מפורש נוסף — לא מתבצע כאן.
