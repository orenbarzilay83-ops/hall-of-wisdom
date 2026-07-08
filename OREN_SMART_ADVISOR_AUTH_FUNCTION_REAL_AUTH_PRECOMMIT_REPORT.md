# OREN_SMART_ADVISOR_AUTH_FUNCTION_REAL_AUTH_PRECOMMIT_REPORT — מסלול-אימות אמיתי (עדיין ללא-deploy)

> **דוח בלבד. לא חובר Anthropic חי, לא נוסף secret, לא בוצע deploy, לא הוכנס UID/מפתח אמיתי, לא שונה HTML/UI/מנועים/narrative, לא נבנה פאנל, לא הורחב ל-Hawi/קלפים, לא נגע ב-`inner-compass`, לא מוזג ל-main. לא בוצע commit/push — רק יצירת/עדכון-הקבצים.**
> תאריך: 2026-07-08. ממשיך את `OREN_SMART_ADVISOR_AUTH_FUNCTION_PRECOMMIT_REPORT.md` (`a874644`) — מחליף את `mockVerifyToken` במסלול-אימות-אמיתי מול Supabase Auth, עם dependency-injection לבדיקה מקומית.

---

## 1. `git diff --stat`

```
 _test_oren_smart_advisor_auth_function.mjs     | 156 ++++++++++++++++---------
 supabase/functions/oren-smart-advisor/index.ts |  83 +++++++++----
 2 files changed, 166 insertions(+), 73 deletions(-)
```

## 2. אילו קבצים שונו/נוצרו

- `supabase/functions/oren-smart-advisor/index.ts` (עריכה)
- `_test_oren_smart_advisor_auth_function.mjs` (עריכה)
- `OREN_SMART_ADVISOR_AUTH_FUNCTION_REAL_AUTH_PRECOMMIT_REPORT.md` (חדש, קובץ זה)

שום קובץ אחר לא נערך.

## 3. איך מתבצע אימות Supabase האמיתי

`verifyTokenWithSupabase(token, {supabaseUrl, supabaseAnonKey})` — פונקציה חדשה, **המסלול-הראשי-כעת** (לא-עוד `mockVerifyToken`, שהוסר-לגמרי מהקובץ — מאומת מכנית, בדיקה 9). קוראת ל-**`GET {SUPABASE_URL}/auth/v1/user`** עם `Authorization: Bearer <token>` ו-`apikey: <SUPABASE_ANON_KEY>` — זהו ה-REST endpoint הרשמי של Supabase Auth לאימות-משתמש-מטוקן, **בלי SDK**, באותו-דפוס-פונקציונלי בדיוק כמו `ai/provider/anthropic-provider.js` (fetch גולמי, אין מפתח-מוטמע). תגובה תקינה עם `data.id` → `{valid:true, userId:data.id}`; כל-תגובה-לא-תקינה/שגיאת-רשת → `{valid:false, userId:null}` (**לעולם לא-זורק**, בדיוק כמו `callAnthropic`).

`handleAdvisorRequest` בודק **קודם** ש-`SUPABASE_URL`/`SUPABASE_ANON_KEY` קיימים בסביבה — אם-אחד-מהם-חסר, **fail-closed מיידי (503)**, עוד-לפני-שמנסים-לאמת-בכלל (אי-אפשר-לאמת-בלי-תצורה). שני-שמות-ה-env נקראים **רק** דרך `getEnv()` (אותה-פונקציית-הפשטה Deno/Node שכבר-הייתה קיימת ל-`ALLOWED_OREN_UID`).

## 4. איך הבדיקות נשארות mock בלי רשת

`handleAdvisorRequest(req, deps)` תומך ב-**dependency injection**: `deps.verifyToken` — כשמוזרק (כמו-שהבדיקה עושה), הוא **מחליף לגמרי** את `verifyTokenWithSupabase` — אף-קריאה-אליו לא-קורית. הבדיקה מזריקה `injectedMockVerifier` (פונקציה-מקומית-בקובץ-הבדיקה-בלבד, לא-בקוד-הראשי) שמזהה-מחרוזות-קבועות-מזויפות (`'mock-token-oren'`/`'mock-token-other-user'`), **לעולם לא-קוראת ל-fetch**.

**הוכחה-נוספת, לא-רק-הנחה:** הבדיקה **גם monkey-patches את `globalThis.fetch` הגלובלי** לזרוק-חריגה-מיידית אם-הוא-נקרא-בכלל (בדיקה 10) — כך שאם-במקרה `deps.verifyToken` לא-הועבר-כראוי ונפלנו-חזרה-בטעות ל-`verifyTokenWithSupabase` האמיתי, הבדיקה **תיכשל-בקול-רם** במקום-לנסות-קריאת-רשת-אמיתית-בשקט. תוצאה בפועל: `fetchCallCount === 0` לאורך **כל** ה-34 assertions.

## 5. תוצאות 401/403/allowed

**34/34 assertions עברו.** תמצית:

| מקרה | קלט | תוצאה | ok | advisorBrainOutput |
|---|---|---|---|---|
| אין token | ללא header | **401** | false | ❌ |
| token לא-תקף | `Bearer this-is-not-a-real-token` | **401** | false | ❌ |
| `ALLOWED_OREN_UID` חסר | token תקף, אין-secret | **503** | false | ❌ (fail closed) |
| `SUPABASE_URL` חסר (חדש) | token תקף | **503** | false | ❌ (fail closed) |
| `SUPABASE_ANON_KEY` חסר (חדש) | token תקף | **503** | false | ❌ (fail closed) |
| token תקף, UID לא-תואם | `Bearer mock-token-other-user` | **403** | false | ❌ |
| token תקף, UID תואם | `Bearer mock-token-oren` | **200** | true | ✅ כל 12 המפתחות |

בנוסף: `fetchCallCount === 0` (בדיקה 10) — 0 קריאות-רשת-אמיתיות לאורך כל-הריצה.

## 6. אישור שאין secret אמיתי

`ALLOWED_OREN_UID`/`SUPABASE_URL`/`SUPABASE_ANON_KEY` נקראים **רק** דרך `getEnv()` — אף-אחד מהם לא-מוגדר-כערך-מחרוזת-קבוע בקוד (נבדק-מכנית, בדיקה 9). ב-`_test_oren_smart_advisor_auth_function.mjs`, `process.env.SUPABASE_URL`/`SUPABASE_ANON_KEY`/`ALLOWED_OREN_UID` נקבעים-זמנית לערכים-מזויפים-במפורש (`FAKE_SUPABASE_URL='https://fake-project.example.invalid'`, `FAKE_SUPABASE_ANON_KEY='fake-anon-key-not-real'`, `MOCK_ALLOWED_UID='mock-uid-oren-000'`) ומוחזרים-למצבם-המקורי בסוף-הריצה. אין `ANTHROPIC_API_KEY` בקוד. אין UID-אמיתי-של-אף-אחד בשום-מקום.

## 7. אישור שאין deploy

**לא בוצע.** לא הורץ `supabase functions deploy` בשום שלב. הערות-ה-deploy-העתידיות (כולל שני-שמות-env-חדשים, `SUPABASE_URL`/`SUPABASE_ANON_KEY`) נוספו **כתגובה בלבד** בראש `index.ts` — לא-כפעולה-שבוצעה.

## 8. `git status --short`

```
 M _test_oren_smart_advisor_auth_function.mjs
 M supabase/functions/oren-smart-advisor/index.ts
?? OREN_SMART_ADVISOR_AUTH_FUNCTION_REAL_AUTH_PRECOMMIT_REPORT.md
```

---

## הצהרות

- שום Anthropic/AI חי לא חובר. שום secret אמיתי לא נוסף/נקרא. שום deploy.
- שום UID אמיתי בקוד. שום HTML/UI/מנוע/narrative לא שונה. שום פאנל לא נבנה. שום הרחבה ל-Hawi/קלפים.
- שום נגיעה ב-`inner-compass`. לא מוזג ל-main.
- שום commit/push — רק יצירת/עדכון-הקבצים.
- הצעד הבא — לפי החלטת אורן משה בלבד.
