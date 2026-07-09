# HALL_WISDOM_GORAL_QA_EDGE_MOCK_PRECOMMIT_REPORT — module:"goralQA" ב-Edge Function (MOCK, deploy-safe)

> **דוח לפני-commit (מעודכן — תיקן סיכון-ייבוא-חוצה-ריפו). עדיין לא בוצע commit/push. אין AI חי, אין secret, אין deploy, אין production deploy, אין merge ל-main, אין תיקון-מנועים, אין נגיעה בקלפים/UI/`inner-compass`, לא נוצר ענף חדש.**
> תאריך: 2026-07-09. ממשיך את הגרסה הקודמת של דוח זה — תוקן סיכון-הייבוא שזיהית לפני האישור.

---

## 0. הבעיה שתוקנה

בגרסה הקודמת, `index.ts` ייבא ישירות `../../../goral-hachol/qa/goral-qa-ai-evaluator-mock.js` — ייבוא חוצה-ריפו שעלול לא-לעבוד בבנדלינג-אמיתי של Supabase Edge Functions/Deno Deploy. **תוקן**: נוצר adapter עצמאי בתוך תיקיית-הפונקציה עצמה, ו-`index.ts` מייבא ממנו בלבד — אפס תלות מחוץ ל-`supabase/functions/oren-smart-advisor/`.

## 1. git diff --stat

```
 supabase/functions/oren-smart-advisor/index.ts | 45 ++++++++++++++++++++++++--
 1 file changed, 43 insertions(+), 2 deletions(-)
```

## 2. קבצים ששונו/נוצרו

```
 M  supabase/functions/oren-smart-advisor/index.ts                    (43 שורות נוספו)
?? supabase/functions/oren-smart-advisor/goral_qa_mock_evaluator.ts   (חדש — adapter מקומי, self-contained)
?? _test_hall_wisdom_goral_qa_edge_mock.mjs                            (חדש/מעודכן — 38 assertions)
?? HALL_WISDOM_GORAL_QA_EDGE_MOCK_PRECOMMIT_REPORT.md                  (קובץ זה, מעודכן)
```

**שום קובץ אחר לא נערך** — כולל `goral-hachol/qa/goral-qa-ai-evaluator-mock.js` (הקובץ המקומי המקורי, ה-runner ממשיך-להשתמש-בו ללא שינוי).

## 3. איך נפתר סיכון-הייבוא

נוצר **`supabase/functions/oren-smart-advisor/goral_qa_mock_evaluator.ts`** — קובץ עצמאי בתוך תיקיית-הפונקציה עצמה:
- **0 imports** — self-contained לחלוטין (אומת ישירות בבדיקה: `!/^import/m.test(adapterSrc)`).
- פורט-נאמן (לא-שכפול-לוגיקה-חכמה — זו רק טרנספורמציה דטרמיניסטית פשוטה, בדיוק כפי שאישרת שמותר) של `evaluateQaRunMock` המקומי ל-TypeScript טהור, עם אותה סכימת-פלט **בדיוק** (14 שדות).
- `index.ts` מייבא רק ממנו (`import { evaluateQaRunMockEdge } from './goral_qa_mock_evaluator.ts'`) — **ייבוא-יחסי בתוך אותה תיקייה בלבד**, לא חוצה-ריפו.
- ה-runner המקומי (`goral-hachol/qa/goral-qa-ai-runner.mjs`) **ממשיך להשתמש** ב-`goral-hachol/qa/goral-qa-ai-evaluator-mock.js` המקורי — לא שונה, לא הוחלף.

**אומת אוטומטית (בדיקה חדשה 3ב):** אין שום `import ... from '../...goral-hachol'` ב-`index.ts` (regex על import-statement בפועל, לא על אזכור-מילולי בהערה).

## 4. איך module:"goralQA" עובד (ללא שינוי מהגרסה הקודמת)

אחרי 5 בדיקות-ההרשאה הקיימות (401/503/401/503/403): קריאת-body → `module` undefined/`'kashf'` → תאימות-לאחור (advisorBrainOutput הישן); `'goralQA'` → אימות `payload.scenarios`/`payload.collectedOutputs` (מערכים, אחרת 400) → `evaluateQaRunMockEdge(payload)` → `200`; כל module אחר → `422`, ללא fallback.

## 5. איפה auth מתבצע

זהה-לחלוטין למנגנון הקיים — `verifyTokenWithSupabase` + `ALLOWED_OREN_UID` allowlist, fail-closed. **לא נערך שום שינוי בלוגיקת ה-auth.**

## 6. איך מוכח שה-evaluator לא רץ לפני auth

- **התנהגותי:** בקשות עם `module:'goralQA'` + payload תקין אך auth כושל (401/403/503) — `evaluatorOutput` לא-מופיע בשום מקום בתגובה.
- **סטטי:** `src.indexOf("errorCode: 'forbidden'") < src.indexOf('evaluateQaRunMockEdge(qaPayload')` — נבדק ישירות על טקסט-הקובץ.

## 7. דוגמת request

```http
POST /oren-smart-advisor
Authorization: Bearer <supabase-access-token>
Content-Type: application/json

{
  "module": "goralQA",
  "payload": {
    "qaRunSummary": { "totalScenarios": 20, "crashed": 0, "scenariosWithProblems": 0, "totalDeterministicProblems": 0 },
    "scenarios": [ { "id": "commerce-kashf", "method": "kashf", "topicId": "commerce", "question": "האם העסק החדש יצליח?" } ],
    "collectedOutputs": [ { "scenarioId": "commerce-kashf", "sourceRulesApplied": ["..."] } ],
    "deterministicFindings": []
  }
}
```

## 8. דוגמת response (200, דרך ה-adapter החדש)

```json
{
  "ok": true,
  "module": "goralQA",
  "evaluatorOutput": {
    "overallDiagnosis": "MOCK (אין AI חי מחובר) — 20 תרחישים נבדקו, 0 בעיות דטרמיניסטיות נמצאו. שכבת-שיפוט-סמנטית אמיתית עדיין לא מחוברת.",
    "scenarioFindings": [ "... 20 פריטים" ],
    "detectedProblems": [], "severity": "low",
    "irrelevantSections": [], "missingRelevantSections": [], "advisorOnlyLeaks": [], "clientOutputProblems": [],
    "sourceRuleConcerns": [ { "scenarioId": "illness-hawi", "concern": "MOCK — אין sourceRulesApplied..." } ],
    "recommendedFixes": [],
    "codeInstructionForClaude": { "needed": false, "instruction": "", "filesToInspect": [], "filesNotToTouch": [], "testsToRun": [] },
    "testsToAdd": [], "needsOrenDecision": false, "confidence": "low"
  }
}
```

**עקביות בין שני המימושים:** הבדיקה מוודאת ששני ה-evaluators (adapter מקומי-ל-Edge, ומקומי-ל-runner) מפיקים **אותה צורת-סכימה בדיוק** (14 מפתחות זהים) ו**אותה מסקנה** (`detectedProblems.length`/`severity`/`needsOrenDecision`) על אותו payload — לא זהות-מוחלטת-string (שני קבצים נפרדים בכוונה), אלא עקביות-פונקציונלית מאומתת.

## 9. תוצאות בדיקות

**`_test_hall_wisdom_goral_qa_edge_mock.mjs` (מעודכן, 38/38 עברו):**
```
✓ ללא token → 401, אין evaluatorOutput
✓ UID לא-מורשה → 403, אין evaluatorOutput
✓ UID מורשה + payload תקין → 200, evaluatorOutput מלא (14 שדות), מתויג MOCK
✓ עקביות-סכימה בין Edge-adapter למקומי (מפתחות זהים + אותה מסקנה)
✓ payload חסר/לא-תקין → 400 (2 תרחישים)
✓ module לא-מוכר → 422, אין fallback
✓ תאימות-לאחור: בלי module → 200 עם advisorBrainOutput הישן
✓ evaluator לא-נקרא לפני auth (התנהגותי + סטטי)
✓ אין ייבוא חוצה-תיקיות אל goral-hachol מ-index.ts (import-statement, לא הערה)
✓ index.ts מייבא רק מ-adapter מקומי; goral_qa_mock_evaluator.ts עצמו self-contained (0 imports)
✓ אין callAnthropic/ANTHROPIC_API_KEY/OpenAI בפועל, 0 קריאות-fetch חיצוניות
✓ אין "phone"/"dynFields"/"clientHistorySummary" בתגובה
✓ regression: 20 תרחישים בלי קריסה, קלפים קיימים, כותרת-UI ללא שינוי
```

**`_test_oren_smart_advisor_auth_function.mjs` (הבדיקה הקיימת, לא נערכה) — עדיין 100% ירוקה**, כולל תרחיש 200-ישן (בלי module) — מוכיח שהתיקון לא-שבר-שום-התנהגות-קיימת.

**חבילת-הרגרסיה המלאה (14 קבצים נוספים) — כולם עברו:** `_test_hall_wisdom_ai_qa_evaluator_phase3.mjs`, `goral-qa-ai-runner.mjs`, `goral-qa-runner.mjs`, `_test_goral_qa_brain_phase2.mjs`, `_test_goral_rule_applicability.mjs`, `_test_kashf_house_label_context.mjs`, `_test_kashf_context_sanitizer.mjs`, `_test_kashf_commerce_smart_layer.mjs`, `_test_kashf_commerce_context_coherence.mjs`, `_test_kashf_commerce_context_aware.mjs`, `_test_kashf_context_fields_transfer.mjs`, `_test_kashf_archive_save.mjs`, `cartomancy/_test_cartomancy.mjs`, `_test_oren_smart_advisor_site_brain_poc.mjs`.

**Playwright — `_test_oren_advisor_panel_ui.mjs` — 21/21.** **`node --check`** על כל JS/MJS — עבר. **סריקת-שיבוש** — נקי.

## 10. אישורים

- ✅ **אין AI חי** — 0 קריאות `callAnthropic`.
- ✅ **אין secret** — 0 קריאות בפועל ל-`ANTHROPIC_API_KEY`.
- ✅ **אין deploy, אין production deploy.**
- ✅ **אין merge ל-`main`.**
- ✅ **סיכון-הייבוא-חוצה-ריפו נפתר** — `index.ts` תלוי אך-ורק בקובץ בתוך תיקיית-הפונקציה עצמה, אומת אוטומטית.
- ✅ לא שונו מנועי Kashf/Hawi, לא שונו קלפים, לא שונה UI.
- ✅ לא נגעתי ב-`inner-compass`, לא נוצר ענף חדש.
- ⏳ **עדיין לא בוצע commit/push** — ממתין לאישורך.

---

## הצעד הבא

ממתין לאישורך ל-commit. חיבור `callAnthropic` אמיתי (secret) נשאר שלב נפרד ורגיש יותר, דורש אישור מפורש נוסף.
