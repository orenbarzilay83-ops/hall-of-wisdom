# HALL_WISDOM_GORAL_QA_SUPABASE_LOCAL_SERVE_REPORT — ניסיון `supabase functions serve` מקומי

> **דוח בלבד. לא בוצע `supabase link`, לא `supabase secrets set`, לא `supabase functions deploy`, לא merge, לא production deploy, לא שינוי-קוד, לא commit. לא הותקן שום כלי חדש בסביבה.**
> תאריך: 2026-07-09. ממשיך את `HALL_WISDOM_GORAL_QA_SUPABASE_LIVE_PREDEPLOY_CHECKLIST.md`.

---

## תוצאה מסכמת: הבדיקה המקומית לא עלתה — Docker לא זמין בסביבה הזו

`supabase functions serve` נכשל עם שגיאה חד-משמעית — **Docker Desktop/daemon חסר**. לא ניתן היה להריץ אף אחת מבדיקות ה-curl המתוכננות. פורט-בסעיפים למטה בדיוק מה נבדק, מה עבד, ומה נחסם.

---

## 1. האם Supabase CLI זמין

**חלקית — לא כ-binary גלובלי, אבל נגיש דרך `npx`.**
```
which supabase → (לא נמצא, exit 1)
supabase --version → command not found
npx --yes supabase --version → 2.109.1 (הצליח מיידית, כנראה כבר-קיים ב-cache המקומי של הסביבה)
```
לא בוצעה שום פעולת-התקנה חדשה על ידי — `npx --yes` השתמש בגרסה שכבר הייתה זמינה/cached בסביבה, לא הורדתי/התקנתי כלום ביוזמתי.

## 2. האם Docker זמין

**ה-binary קיים, אך ה-daemon לא רץ.**
```
which docker → /usr/bin/docker (קיים)
docker --version → Docker version 29.3.1, build c2be9cc (קיים)
docker ps → failed to connect to the docker API at unix:///var/run/docker.sock:
            dial unix /var/run/docker.sock: connect: no such file or directory
```
**לא ניסיתי להפעיל/לתקן את ה-daemon** (למשל `dockerd`, `systemctl start docker`) — זו הייתה חריגה מ"לא להתקין/לתקן כלום לבד" שביקשת.

## 3. האם serve עלה

**לא.** הרצת:
```bash
npx --yes supabase functions serve oren-smart-advisor --env-file ./supabase/.env.local.test
```
החזירה מיידית:
```json
{"_tag":"Error","error":{"code":"UnknownError","message":"failed to run docker. Docker Desktop is a prerequisite for local development. Follow the official docs to install: https://docs.docker.com/desktop"}}
```
(exit code 1). זה בדיוק-כפי-שצפוי מסעיף 2 — Supabase Edge Runtime המקומי רץ בתוך container, ואין daemon זמין להריץ אותו.

**רעש לא-קשור בפלט:** הופיעו גם כמה שגיאות `PostHogFetchHttpError: ... status=403` — אלו ניסיונות-טלמטריה-פנימיים של ה-CLI עצמו (לא-קשורים לפונקציה שלנו) שנחסמו על ידי מדיניות-הרשת של הסביבה (proxy) — **זה תקין וצפוי**, לא תקלה בקוד שלנו.

## 4. אילו curl tests הצליחו

**אף אחד — השרת המקומי מעולם לא עלה, אין `localhost:54321` להפנות אליו בקשות.** כל 6 הבדיקות המתוכננות (no-token→401, module-לא-מוכר, live-נופל-ל-mock, אין-secret-בתגובה, אין-קריאת-AI-מצליחה) **לא בוצעו** — לא כי הן נכשלו, אלא כי אין שרת להריץ אותן מולו.

## 5. האם היו שגיאות Deno/import/bundling

**לא ניתן לדעת — לא הגענו לשלב שבו Deno בכלל טוען את `index.ts`.** השגיאה שהתקבלה היא ברמת-Docker (לפני-הפעלת-Deno-Runtime בכלל), לא שגיאת-קוד. **המסקנה החשובה מ-`HALL_WISDOM_GORAL_QA_LIVE_AI_INTEGRATION_PLAN.md` — שצריך לאמת שה-imports-היחסיים-בין-הקבצים עובדים בבנדלינג-אמיתי-של-Deno — נשארת פתוחה, לא-אושרה ולא-נשללה בבדיקה הזו.**

## 6. האם `.env.local.test` נשאר מחוץ לגיט

**כן, אומת ישירות:**
```
git status --short → (הקובץ לא מופיע ברשימה כלל)
git check-ignore -v supabase/.env.local.test → .gitignore:15:.env.* supabase/.env.local.test
```
נלכד על ידי הכלל `.env.*` הקיים ב-`.gitignore` (מהעבודה הקודמת בסשן הזה) — לא נדרש שינוי ל-`.gitignore`. הקובץ עדיין קיים בדיסק המקומי (לא נמחק), עם ערכים מזויפים בלבד כפי שביקשת:
```
SUPABASE_URL=https://fake-project.example.invalid
SUPABASE_ANON_KEY=fake-anon-key-not-real
ALLOWED_OREN_UID=fake-uid-for-local-test
ANTHROPIC_API_KEY=fake-key-for-local-test
ANTHROPIC_MODEL=fake-model-for-local-test
HALL_WISDOM_AI_MODE=live
```

## אישורים

- ✅ **לא היו secrets אמיתיים** — כל הערכים ב-`.env.local.test` מזויפים-במפורש (`fake-...`), נכתבו על ידי בהתאם להוראה, לא הועברו לשום מקום חוץ מהקובץ המקומי-המוגן.
- ✅ **לא בוצע deploy** — `supabase functions deploy` לא הורץ כלל.
- ✅ **לא בוצע `supabase link`** — לא הורץ כלל; גם אם היה מורץ, `functions serve` ממילא לא-דורש link (עובד מקומי-בלבד), אבל ליתר-ביטחון גם זה לא נעשה.
- ✅ **לא בוצע merge ל-`main`.**
- ✅ **לא הותקן שום כלי חדש** — `npx --yes` השתמש ב-cache קיים; לא נגעתי ב-Docker daemon; לא ניסיתי להתקין Docker Desktop.
- ✅ לא נערך שום קוד, לא תוקנו מנועים/קלפים.

---

## המלצה — אפשר לעבור ל-deploy MOCK-בלבד, או שצריך תיקון קודם?

**אפשר לעבור ל-deploy MOCK-בלבד — הבדיקה המקומית לא חושפת שום סיבה-לעצור.**

נימוק:
1. הכישלון היחיד שנמצא הוא **תשתיתי-סביבתי** (Docker חסר בסביבת-הפיתוח-הזו של Claude Code) — **לא** קשור לקוד עצמו, לא מעיד על באג ב-`index.ts`/הקבצים-החדשים.
2. חבילת-הבדיקות-הקיימת ב-Node (`_test_hall_wisdom_goral_qa_live_ai.mjs`, 33 assertions, ו-`_test_hall_wisdom_goral_qa_edge_mock.mjs`, 38 assertions) **כבר מריצה את `index.ts` בפועל** (טעינה+הרצה אמיתית, לא-מדומה, דרך Node's TypeScript type-stripping) — כולל את כל שרשרת-ה-imports היחסיים (`./goral_qa_mock_evaluator.ts`, `./anthropic-provider-edge.ts`, `./goral-qa-evaluator-prompt.ts`, `./goral_qa_payload_sanitizer.ts`) בהצלחה מלאה. זו **כבר** הוכחה חלקית-חזקה שה-imports-היחסיים תקינים-מבחינה-לוגית.
3. הפער היחיד שנשאר-פתוח (סעיף 5) הוא ספציפי ל**בנדלינג-של-Deno-Edge-Runtime עצמו** (לא Node) — וזה בדיוק מה ש-`supabase functions serve` היה-אמור-לבדוק, ולא-הצלחנו. **הדרך היחידה לסגור את הפער הזה במלואה היא deploy אמיתי (או סביבת-Docker זמינה)** — אין קיצור-דרך נוסף שאפשר לבצע כרגע בסביבה הזו בלי Docker.
4. בהתאם להמלצה הקודמת (`HALL_WISDOM_GORAL_QA_SUPABASE_LIVE_PREDEPLOY_CHECKLIST.md` §9): ה-deploy הראשוני **בלי** `HALL_WISDOM_AI_MODE=live` הוא **בעצמו** בדיקה-בטוחה — אם יש בעיית-imports/bundling, היא תתגלה **גם במצב-MOCK** (הפונקציה כולה לא-תעלה/`index.ts` לא-ייטען), עם סיכון-נמוך (אין AI חי מעורב, אין קריאת-Anthropic אפשרית בכלל בלי secrets).

**המלצה מעשית:** כשתחליט להמשיך ל-deploy — בצע אותו **בלי** `HALL_WISDOM_AI_MODE=live` (כפי שכבר הומלץ), ומיד אחרי ה-deploy הרץ את בדיקת §5 סעיף 3 מה-checklist הקודם (`curl` עם `mode:"mock"` בלבד) **כבדיקת-הוכחה ראשונה** שה-imports-היחסיים אכן נטענו נכון ב-Deno-האמיתי — לפני שממשיכים לכל צעד נוסף.
