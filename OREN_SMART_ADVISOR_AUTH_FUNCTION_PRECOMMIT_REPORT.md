# OREN_SMART_ADVISOR_AUTH_FUNCTION_PRECOMMIT_REPORT — שער-הרשאה MOCK, Oren Smart Advisor Brain

> **דוח בלבד. לא חובר Anthropic חי, לא נוסף secret, לא בוצע deploy, לא שונה HTML/UI/מנועים/narrative/goral-app.js, לא הורחב ל-Hawi/קלפים, לא נגע ב-`inner-compass`, לא מוזג ל-main. לא בוצע commit/push — רק יצירת הקבצים.**
> תאריך: 2026-07-08. ממשיך את `OREN_SMART_ADVISOR_AUTH_ALLOWLIST_PLAN.md` (`3d97d29`) — מימוש-מבוקר-במצב-mock של שער-ההרשאה עצמו.

---

## 1. `git diff --stat`

```
(ריק — שני קבצים חדשים בלבד + דוח זה, אין שינוי בקבצים קיימים)
```

## 2. אילו קבצים נוצרו/שונו

- `supabase/functions/oren-smart-advisor/index.ts` (חדש)
- `_test_oren_smart_advisor_auth_function.mjs` (חדש)
- `OREN_SMART_ADVISOR_AUTH_FUNCTION_PRECOMMIT_REPORT.md` (חדש, קובץ זה)

**שום קובץ קיים לא נערך** — `supabase/functions/oren-smart-ai/index.ts`, `ai/provider/anthropic-provider.js`, `goral-app.js`, כל-מנוע — כולם נשארו בדיוק כפי-שהיו.

## 3. איך בדיקת ההרשאה עובדת

`handleAdvisorRequest(req)` ב-`index.ts` מבצע 5 שלבים-סדרתיים, כל-אחד יכול-לחסום:
1. `Authorization` header חסר/לא-בפורמט `Bearer` → **401** `unauthenticated`.
2. הטוקן לא-מזוהה ע"י `mockVerifyToken` (מדמה `supabase.auth.getUser`, ללא-קריאת-רשת) → **401** `unauthenticated`.
3. `ALLOWED_OREN_UID` חסר בסביבה (`getEnv`, שקורא מ-`Deno.env`/`process.env` לפי-סביבת-הריצה) → **503** `server_misconfigured` — **fail closed**, לעולם לא ממשיכים.
4. `user.id` המאומת לא-תואם `ALLOWED_OREN_UID` → **403** `forbidden`.
5. רק אם כל-הבדיקות עברו → **200**, עם `advisorBrainOutput` (mock, לא-AI-אמיתי).

**חשוב לגבי הבדיקה עצמה:** `_test_oren_smart_advisor_auth_function.mjs` **טוען ומריץ את `index.ts` בפועל** (`import { handleAdvisorRequest } from './supabase/functions/oren-smart-advisor/index.ts'`) — לא-מדובר-בהעתק/מירור-לוגי בקובץ-נפרד. זה עובד כי Node 22 (הגרסה בסביבה הזו, `v22.22.2`) תומך בטעינת-`.ts` עם type-stripping, ו-`index.ts` נכתב עם `declare const Deno: any` + `typeof Deno !== 'undefined'`-guards כדי-שלא-יקרוס כש-`Deno` אינו-מוגדר (ב-Node) — ה-`Deno.serve(...)` בתחתית-הקובץ **לא-מופעל** כשנטען ב-Node (מאומת: הבדיקה רצה בלי-לתלות/לפתוח-שרת). ב-Deno האמיתי, אותו-קוד-בדיוק יעבוד-כרגיל.

## 4. איך מוכח שאין קריאת AI לפני auth success

שתי הוכחות-משלימות, לא-רק-הנחה:
1. **הוכחה התנהגותית (בדיקה 8):** בכל שלוש-תגובות-הכישלון (401/403/503), גוף-התגובה **לא-מכיל** את מחרוזת-הסימון של פלט-ה-mock-AI (`"MOCK — אין קריאת-AI"`) — הוכחה-ישירה שהפונקציה שמייצרת אותו (`mockAdvisorBrainOutput`) **אף פעם לא-נקראת** בענפי-הכישלון, כי-אילו-נקראה, הטקסט-הזה היה-מופיע-איפשהו.
2. **הוכחה מבוססת-מקור:** קריאת `index.ts` כטקסט ואימות ש-`errorCode: 'forbidden'` (בדיקת-403) מופיע **לפני**, טקסטואלית, הקריאה-בפועל `advisorBrainOutput: mockAdvisorBrainOutput()` — כלומר גם-סדר-הקוד-עצמו (לא-רק-ההתנהגות-בזמן-ריצה) מבטיח שאין-מסלול-אפשרי שבו ה-AI-output מחושב לפני-שההרשאה-אושרה.

## 5. תוצאות בדיקות 401/403/allowed

**27/27 assertions עברו.** תמצית:

| מקרה | קלט | תוצאה | ok | advisorBrainOutput |
|---|---|---|---|---|
| אין token | ללא header | **401** | false | ❌ |
| token לא-תקף | `Bearer this-is-not-a-real-token` | **401** | false | ❌ |
| `ALLOWED_OREN_UID` חסר | token תקף, אין-secret בסביבה | **503** | false | ❌ (fail closed) |
| token תקף, UID לא-תואם | `Bearer mock-token-other-user` | **403** | false | ❌ |
| token תקף, UID תואם | `Bearer mock-token-oren` | **200** | true | ✅ — כל 12 המפתחות קיימים |

## 6. האם נעשה שימוש ב-secret אמיתי

**לא.** `ALLOWED_OREN_UID` נקרא **רק** דרך `getEnv('ALLOWED_OREN_UID')` (שמפנה ל-`Deno.env.get`/`process.env`) — לעולם לא-מוגדר-כערך-מחרוזת-קבוע בקוד (נבדק-מכנית, בדיקה 9). בבדיקה, `process.env.ALLOWED_OREN_UID` נקבע-זמנית למחרוזת-מזויפת-במפורש (`'mock-uid-oren-000'`, תואמת-בכוונה למחרוזת-ה-mock-token — לא UID-אמיתי-של-אף-אחד) ומוחזר-למצבו-המקורי בסוף-הריצה. אין `ANTHROPIC_API_KEY` בקוד כלל — אין קריאה ל-Anthropic API בשום-מקום בקובץ (נבדק-מכנית: היעדר `api.anthropic.com` במקור).

## 7. האם נעשה deploy

**לא.** לא הורץ `supabase functions deploy` בשום שלב — לא-לפני, לא-במהלך, לא-אחרי הבדיקות. הערות-ה-deploy-העתידיות מופיעות **כתגובה בלבד** בראש `index.ts` (זהה-בדיוק לדפוס הקיים ב-`oren-smart-ai/index.ts`) — לא-כפעולה-שבוצעה.

## 8. `git status --short`

```
?? OREN_SMART_ADVISOR_AUTH_FUNCTION_PRECOMMIT_REPORT.md
?? _test_oren_smart_advisor_auth_function.mjs
?? supabase/functions/oren-smart-advisor/
```

---

## הצהרות

- שום Anthropic חי לא חובר. שום secret אמיתי לא נוסף/נקרא. שום deploy.
- שום HTML/UI/מנוע/narrative/goral-app.js לא שונה. שום הרחבה ל-Hawi/קלפים.
- שום נגיעה ב-`inner-compass`. לא מוזג ל-main.
- שום commit/push — רק יצירת הקבצים.
- הצעד הבא — לפי החלטת אורן משה בלבד.
