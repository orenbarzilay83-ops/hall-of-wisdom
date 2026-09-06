# HALL_WISDOM_GORAL_QA_SUPABASE_LIVE_PREDEPLOY_CHECKLIST — לפני deploy אמיתי של oren-smart-advisor

> **דוח בלבד. לא בוצע `supabase secrets set`, לא `supabase functions deploy`, לא שינוי קוד, לא commit (אין שינוי-קוד לבצע לו commit).**
> תאריך: 2026-07-09. ממשיך את `HALL_WISDOM_GORAL_QA_LIVE_AI_READY_PRECOMMIT_REPORT.md` (`cee58a9`).

---

## 1. deploy ישפיע על סביבה חיה, או שיש Preview/Staging נפרד?

**נבדק בפועל בריפו — אין סביבת Staging/Preview נפרדת של Supabase.**

- `supabase-client.js` (בשימוש היום על ידי **כל האתר החי** — login, session, כל טבלה/auth קיימים) מצביע על **פרויקט Supabase יחיד**: `https://hfdsoudhelzayimjwqkp.supabase.co`.
- אין `supabase/config.toml` בריפו — כלומר **`supabase link` מעולם לא בוצע** בסביבה הזו. זה שלב-הכנה נדרש *לפני* כל `deploy`, לא רק "אזהרה" — בלעדיו `supabase functions deploy` לא-ידע לאיזה פרויקט לפרוס.
- **מסקנה קריטית:** `supabase link --project-ref hfdsoudhelzayimjwqkp` (או כל project-ref שתבחר לקשר) יקשר **ישירות לאותו פרויקט שכבר-חי ומשרת התחברויות אמיתיות של משתמשים**. אין כאן "סביבת בדיקה" נפרדת שאפשר-לפרוס-אליה-בלי-סיכון. **כל deploy הוא, למעשה, deploy ל-production.**
- **הקלה חלקית:** Edge Functions נפרסות **בנפרד זו-מזו** — פריסת `oren-smart-advisor` **לא נוגעת** בשום Auth/טבלה/פונקציה קיימת (כולל `oren-smart-ai` שכבר-קיים כקוד אך גם-הוא-לא-פרוס). אבל היא **כן** משתמשת ב**אותו פרויקט**, **אותם secrets ברמת-פרויקט** (סעיף הבא), ו**אותה מכסת-שימוש**.

## 2. אילו secrets בדיוק נדרשים

| שם | סוג | הערה |
|---|---|---|
| `SUPABASE_URL` | לא-סודי-במיוחד (כבר גלוי ב-`supabase-client.js`) | `https://hfdsoudhelzayimjwqkp.supabase.co` — כבר ידוע, אין צורך לחפש |
| `SUPABASE_ANON_KEY` | לא-סודי-במיוחד (מפתח "publishable", מיועד-לחשיפה בצד-לקוח) | **כבר קיים** ב-`supabase-client.js`: `sb_publishable_SIC9qvnZB3gr_cc1S9iWKw_i6N0SA65` — ⚠ לשים-לב: זה בפורמט-החדש (`sb_publishable_...`), לא JWT ישן (`eyJ...`). ל-`verifyTokenWithSupabase` ב-`index.ts` צריך את **אותו** מפתח-publishable של הפרויקט — סביר שזה בדיוק אותו ערך, אבל **אורן צריך לוודא בעצמו** מול Supabase Dashboard (Project Settings → API) שזה אכן המפתח הנכון להעביר ל-Auth REST API, ולא להניח בלי-בדיקה |
| `ALLOWED_OREN_UID` | **סודי-יחסית** (מזהה-משתמש פנימי, לא סוד-קריפטוגרפי אך לא-לפרסום) | ה-`user.id` (UUID) של המשתמש-של-אורן-עצמו ב-Supabase Auth. **לא ניחוש/לא בקוד** — נמצא ב-Supabase Dashboard → Authentication → Users, או בשאילתת-`auth.users` |
| `ANTHROPIC_API_KEY` | **סודי — קריטי** | מפתח-API אמיתי מ-Anthropic Console. **לעולם לא להדביק בצ'אט הזה, לעולם לא בקוד** |
| `ANTHROPIC_MODEL` | לא-סודי, אך **החלטה נדרשת** | מזהה-מודל אמיתי (למשל `claude-sonnet-5`/`claude-opus-4-8`/`claude-haiku-4-5-20251001`) — **לא הומצא ולא נבחר על ידי בשלב הקודם בכוונה תחילה**; זו החלטה שלך |
| `HALL_WISDOM_AI_MODE` | לא-סודי, מתג-הפעלה | **מומלץ: אל תגדיר אותו כלל בשלב ה-deploy הראשוני** (ראו סעיף 4) — היעדרו = MOCK אוטומטי, גם ב-production |

## 3. אילו ערכים אורן צריך לספק — בלי להדפיס בצ'אט ובלי קוד

- **`ANTHROPIC_API_KEY`** — להעתיק ישירות מ-Anthropic Console **לתוך שורת-הפקודה בטרמינל שלך** (סעיף 4) — לעולם לא לשלוח לי אותו כאן, לעולם לא לשמור בקובץ בריפו (גם לא ב-`.env` מקומי שנדחק לגיט — `.gitignore` כבר-חוסם `.env`/`.env.*` מהעבודה הקודמת בסשן זה, נבדק כרגע: השורות `.env`, `.env.*`, `!.env.example` קיימות).
- **`ALLOWED_OREN_UID`** — לשלוף מ-Supabase Dashboard בעצמך, ולהעביר ישירות לפקודת ה-`secrets set` בטרמינל. פחות-רגיש מ-API-key, אך עדיין מומלץ לא-לפרסם אותו בשום מסמך-ציבורי/chat.
- **`ANTHROPIC_MODEL`** — ההחלטה שלך איזה מודל (עלות מול איכות) — לא סודי, אבל אני לא בוחר בשבילך.
- **אין צורך לספק מחדש** `SUPABASE_URL`/`SUPABASE_ANON_KEY` — כבר קיימים בקוד-הציבורי (`supabase-client.js`) ואפשר להעתיק משם ישירות.

## 4. הפקודות המדויקות (מוצגות בלבד — לא מורצות עכשיו)

```bash
# שלב הכנה — קישור לפרויקט (חד-פעמי, לא בוצע עדיין בסביבה הזו)
supabase login
supabase link --project-ref hfdsoudhelzayimjwqkp

# secrets — כל אחד בנפרד, בטרמינל שלך בלבד, לא כאן
supabase secrets set SUPABASE_URL=https://hfdsoudhelzayimjwqkp.supabase.co
supabase secrets set SUPABASE_ANON_KEY=<המפתח-publishable מ-Dashboard, ראו סעיף 2>
supabase secrets set ALLOWED_OREN_UID=<ה-UID-האמיתי-שלך מ-Dashboard>
supabase secrets set ANTHROPIC_API_KEY=<המפתח-האמיתי-מ-Anthropic Console>
supabase secrets set ANTHROPIC_MODEL=<בחירתך>

# deploy — רק אחרי כל ה-secrets למעלה
supabase functions deploy oren-smart-advisor
```

**⚠ מומלץ בכוונה-תחילה: אל תריץ `supabase secrets set HALL_WISDOM_AI_MODE=live` בשלב הזה בכלל.** גם אחרי ה-deploy, כל עוד המשתנה הזה לא מוגדר — הפונקציה החיה תחזיר **MOCK תמיד**, בדיוק כמו בבדיקות. הפעלת-live היא החלטה נפרדת, לביצוע **רק** אחרי שווידאת שה-deploy עצמו תקין (סעיף 5) — לא באותו batch-פקודות.

## 5. איך לוודא אחרי deploy (curl אמיתי, כתובת אמיתית)

```bash
BASE_URL="https://hfdsoudhelzayimjwqkp.supabase.co/functions/v1/oren-smart-advisor"

# 1. no token → 401
curl -s -o /dev/stdout -w "\nHTTP %{http_code}\n" "$BASE_URL"

# 2. wrong UID → 403 (טוקן-אמיתי-שלא-שלך, אם יש לך גישה לבדוק כזה; אחרת דלג)
curl -s -H "Authorization: Bearer <טוקן-של-משתמש-אחר>" -o /dev/stdout -w "\nHTTP %{http_code}\n" "$BASE_URL"

# 3. authorized + mode mock (ברירת-מחדל) → mock
curl -s -X POST -H "Authorization: Bearer <הטוקן-האמיתי-שלך>" -H "Content-Type: application/json" \
  -d '{"module":"goralQA","payload":{"scenarios":[],"collectedOutputs":[]}}' \
  "$BASE_URL" | python3 -m json.tool
# ← ודא: evaluatorMode === "mock"

# 4. authorized + mode live (רק אחרי שתגדיר HALL_WISDOM_AI_MODE=live בנפרד!)
curl -s -X POST -H "Authorization: Bearer <הטוקן-האמיתי-שלך>" -H "Content-Type: application/json" \
  -d '{"module":"goralQA","mode":"live","payload":{"scenarios":[],"collectedOutputs":[]}}' \
  "$BASE_URL" | python3 -m json.tool
# ← ודא: evaluatorMode === "live" רק-אם-כל-5-התנאים-מתקיימים, אחרת "mock"+liveModeUnavailableReason

# 5. בדיקה-ידנית על כל תגובה: לוודא שאין המחרוזת של ANTHROPIC_API_KEY/sk-ant בשום מקום בתגובה
# 6. בדיקה-ידנית: payload עם phone/dynFields/clientHistorySummary צריך לתת liveModeUnavailableReason:"sanitization-failed" (אם mode:live), ואף פעם לא-להופיע בחזרה בתגובה
```

**חשוב:** בדוק את כל 6 הסעיפים **לפני** שאתה מגדיר `HALL_WISDOM_AI_MODE=live` בפועל — סעיפים 1-3 ו-5-6 (חוץ מ"live רק אם...") רלוונטיים גם במצב-MOCK-בלבד.

## 6. Rollback — אם משהו משתבש

**המנוף המהיר ביותר (בלי redeploy בכלל):**
```bash
supabase secrets unset HALL_WISDOM_AI_MODE
```
מחזיר מיידית ל-MOCK-תמיד, בלי לגעת בקוד-הפרוס. זה תמיד השלב הראשון אם live מתנהג-לא-כצפוי.

**אם צריך להסיר את הפונקציה כולה:**
```bash
supabase functions delete oren-smart-advisor
```

**אם צריך לחזור לגרסת-קוד קודמת (למשל, ה-mock-בלבד מלפני השלב הזה):**
```bash
git checkout 6c89471 -- supabase/functions/oren-smart-advisor/
supabase functions deploy oren-smart-advisor
```
(`6c89471` = ה-commit האחרון שבו הפונקציה הייתה עדיין MOCK-בלבד, ללא live-ready בכלל — לפני `cee58a9`).

**אם צריך לבטל secret ספציפי (למשל, חשד לדליפת-מפתח):**
```bash
supabase secrets unset ANTHROPIC_API_KEY
```
מחזיר-מיידית ל-`liveModeUnavailableReason:'missing-api-key'` בכל בקשת-live, גם בלי redeploy.

## 7. בדיקה מקומית לפני deploy אמיתי — אפשרית, ומומלצת חלקית

**כן, יש דרך:**
```bash
supabase functions serve oren-smart-advisor --env-file ./supabase/.env.local.test
```
דורש: Supabase CLI מותקן (כבר-קיים בהנחה שאתה מריץ `supabase secrets set`), ו-**Docker רץ** (Supabase CLI מריץ Edge Runtime מקומי בתוך container). `--env-file` מצביע על קובץ-`.env` מקומי (**חדש, לא-לדחוף לגיט** — `.gitignore` כבר חוסם) עם ערכים-מזויפים בלבד:
```
SUPABASE_URL=https://fake-project.example.invalid
SUPABASE_ANON_KEY=fake-anon-key-not-real
ALLOWED_OREN_UID=fake-uid-for-local-test
ANTHROPIC_API_KEY=fake-key-for-local-test
ANTHROPIC_MODEL=fake-model-for-local-test
HALL_WISDOM_AI_MODE=live
```
ואז `curl` מול `http://localhost:54321/functions/v1/oren-smart-advisor` באותה צורה כמו סעיף 5. תגובת-Anthropic-האמיתית **תיכשל** (כי המפתח מזויף) — זה **תקין ורצוי לבדיקה הזו**: המטרה היא לוודא ש-`evaluatorMode` נופל-בחזרה-ל-`mock` עם `liveModeUnavailableReason:'anthropic-error'` בצורה מסודרת, **לא** לבדוק קריאת-AI אמיתית.

**עם זאת — הערכה כנה:** חבילת-הבדיקות הקיימת (`_test_hall_wisdom_goral_qa_live_ai.mjs`, 33 assertions, `fetch` מוזרק) **כבר מכסה** את כל-הלוגיקה-העסקית באופן-יסודי-יותר ממה ש-`supabase functions serve` יכול (כולל תרחישי-שגיאה מגוונים). הערך המוסף היחיד של `supabase functions serve` הוא **אימות שהבנדלינג-של-Deno-בפועל** (ה-imports-היחסיים-בתוך-אותה-תיקייה) עובד כמצופה — זו בדיוק הנקודה שהניעה את כל תיקון-ה-deploy-safety בשלב הקודם, ולכן **שווה לבדוק לפחות פעם אחת** לפני deploy-אמיתי, גם אם לא-חובה-מבחינת-כיסוי-לוגי.

## 8. הסיכון הכי גדול בשלב הזה

**אין סביבת Staging נפרדת (סעיף 1).** כל secret שמוגדר, וכל deploy שמבוצע, פועל **ישירות מול הפרויקט שכבר משרת התחברויות-אמיתיות של משתמשים באתר החי**. בנוסף: secrets ב-Supabase הם **ברמת-פרויקט**, לא ברמת-פונקציה — כלומר `ANTHROPIC_API_KEY` שתגדיר יהיה **זמין לכל פונקציה עתידית שתיפרס לאותו פרויקט** (כולל, למשל, `oren-smart-ai` הקיים-אך-לא-פרוס, אם יופעל בעתיד) — לא מבודד-אוטומטית ל-`oren-smart-advisor` בלבד. זה לא-אומר-שיש-בעיה-היום (שום פונקציה אחרת לא-פרוסה), אבל זו נקודה-לזכור אם בעתיד תיפרס פונקציה נוספת.

## 9. המלצה — בדיקה מקומית קודם, או ישר ל-deploy אמיתי?

**המלצה: בדיקה מקומית מינימלית (סעיף 7) קודם, ואז deploy — אך ללא `HALL_WISDOM_AI_MODE=live` בפריסה הראשונה.**

נימוק בקצרה:
1. הלוגיקה-העסקית כבר מכוסה-במלואה בבדיקות-Node (33+38+... assertions) — אין צורך "לבדוק מחדש" את זה מקומית.
2. הדבר האחד שבדיקות-Node **לא-יכולות** להוכיח הוא שהבנדלינג-האמיתי-של-Deno מכבד את ה-imports-היחסיים-בתוך-אותה-תיקייה — שווה 5 דקות של `supabase functions serve` מקומי (עם מפתחות מזויפים) כדי לסגור את הפער הזה **לפני** deploy אמיתי.
3. ה-**deploy עצמו** מומלץ לבצע **בלי** `HALL_WISDOM_AI_MODE=live` — כך שגם ברגע ה-deploy, הפונקציה החיה עדיין מתנהגת בדיוק כמו-MOCK, וניתן לוודא עם curl אמיתי (סעיף 5, סעיפים 1-3+5-6) שה-auth/routing/MOCK עובדים נכון ב-production **לפני** שמפעילים בכלל את אפשרות-ה-live.
4. **הפעלת `HALL_WISDOM_AI_MODE=live`** (עם מפתח-Anthropic-אמיתי) צריכה להיות **החלטה נפרדת ומודעת**, אחרי שסעיף 3 אומת, לא חלק מאותו batch-deploy.

---

## הצהרות

- זהו דוח-בדיקה-מוקדמת בלבד — **לא בוצע שום `secrets set`, שום `deploy`, שום שינוי-קוד**.
- אין שינוי-קוד → אין מה ל-commit על הדוח הזה מלבד הקובץ עצמו, וגם זה ימתין לאישורך המפורש כמו כל קובץ קודם.
- כל הפרטים כאן מבוססים על קריאה ישירה של `supabase-client.js`/`.gitignore`/מבנה-`supabase/` בפועל — אין ניחוש.
