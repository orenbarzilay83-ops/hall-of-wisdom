# HALL_WISDOM_GORAL_QA_LIVE_AI_INTEGRATION_PLAN — בינת היכל החכמה: חיבור AI חי מאובטח ל-Goral QA Evaluator

> **מסמך תכנון בלבד. אין בו קוד, אין secret אמיתי, אין deploy, אין חיבור-AI-בפועל.**
> תאריך: 2026-07-09. ממשיך את `HALL_WISDOM_GORAL_QA_EDGE_MOCK_PRECOMMIT_REPORT.md` (`6c89471`) ואת `OREN_SMART_ADVISOR_GORAL_QA_BRAIN_PLAN.md` §H שלב 4.

---

## 0. הבחנה קריטית — Vercel לעומת Supabase (כפי שהדגשת)

| | Vercel Preview | Supabase Edge Function |
|---|---|---|
| מה רץ שם | קוד frontend סטטי (`goral-hachol.html`, `goral-app.js`) | `supabase/functions/oren-smart-advisor/index.ts` |
| deploy | אוטומטי בכל push ל-PR (כבר קורה) | **ידני נפרד** — `supabase functions deploy`, לא קורה אף-פעם עד עכשיו |
| secrets | אין, ואסור שיהיו (קוד-דפדפן) | `supabase secrets set` — נפרד לחלוטין מ-Vercel |
| מצב נוכחי | חי, כבר בשימוש (PR #21) | **לא-פרוס בכלל** — כל מה שנבנה עד כה (`index.ts`, `goral_qa_mock_evaluator.ts`) קיים רק כקוד-בריפו, לא-רץ בשום מקום |

**מסקנה מרכזית:** שלב זה (4) הוא **תכנון בלבד** של מה-שיקרה **כש-**ה-Edge Function תיפרס בעתיד (בשלב נפרד, לא-כאן). שום דבר בפועל לא-משתנה ב-Vercel, ושום Supabase-deploy לא-מבוצע.

---

## 1. מה כבר קיים (נבדק, לא נערך)

| קובץ | תפקיד נוכחי |
|---|---|
| `supabase/functions/oren-smart-advisor/index.ts` | Auth gate אמיתי (Supabase Auth + `ALLOWED_OREN_UID`, fail-closed) + routing ל-`module:"goralQA"` → כרגע **תמיד MOCK** (`goral_qa_mock_evaluator.ts`) |
| `supabase/functions/oren-smart-advisor/goral_qa_mock_evaluator.ts` | Adapter self-contained (0 imports) — טרנספורמציה דטרמיניסטית של `deterministicFindings` לסכימת-הפלט |
| `ai/prompts/hall-wisdom-goral-qa-evaluator.prompt.md` | תת-פרומפט מלא (Input/Output Schema, כללי-ברזל) — **טקסט בלבד כרגע, לא-טעון לשום מקום בקוד** |
| `goral-hachol/qa/goral-qa-ai-payload-builder.js` | בונה payload מסונן-פרטיות (`phone`/`dynFields`/`clientHistorySummary` **לעולם לא** נכללים — נבדק אוטומטית) — משמש כרגע רק ב-runner-מקומי, **לא** ב-Edge Function |
| `ai/provider/anthropic-provider.js` | `callAnthropic({apiKey,model,system,userMessage})` — `fetch` גולמי, בלי SDK, בלי מפתח-מוטמע, **בלי שום import** (self-contained, כמו `goral_qa_mock_evaluator.ts`) — **לא-מיובא-לשום Edge Function עדיין** |
| בדיקות auth קיימות | `_test_oren_smart_advisor_auth_function.mjs` (401/403/503/200 core) + `_test_hall_wisdom_goral_qa_edge_mock.mjs` (routing+MOCK, 38 assertions) — שתיהן ירוקות, ללא שינוי מתוכנן להן |

**ממצא-מפתח:** `ai/provider/anthropic-provider.js` **כבר self-contained** (0 imports) — בדיוק כמו `goral_qa_mock_evaluator.ts`. זו נקודת-מוצא טובה: **אותו דפוס בדיוק** שכבר עבד (adapter מקומי בתוך תיקיית-הפונקציה) חוזר על עצמו.

---

## 2. איך לחבר AI חי

### 2.1 ספק (Provider)
**Anthropic**, בדיוק כמו שכל התשתית עד כה תוכננה (`ai/provider/anthropic-provider.js`, `ai/prompts/*`). לא OpenAI, לא ספק אחר — עקבי עם כל התכנון הקודם בסשן הזה.

### 2.2 איפה נשמר ANTHROPIC_API_KEY
**אך ורק** ב-Supabase secrets (`supabase secrets set ANTHROPIC_API_KEY=...`) — נקרא בזמן-ריצה דרך `Deno.env.get('ANTHROPIC_API_KEY')` (אותו `getEnv()` שכבר קיים ב-`index.ts`). **לעולם לא בקוד, לעולם לא ב-Vercel, לעולם לא נחשף לדפדפן** — אין לזה שום נתיב-אל-frontend בארכיטקטורה הזו כלל (ה-Edge Function היא היחידה שקוראת ל-Anthropic; הדפדפן מדבר רק עם ה-Edge Function, לעולם לא עם Anthropic ישירות).

### 2.3 איך ה-Edge Function קוראת ל-Anthropic — לקח-מהניסיון מ-goral_qa_mock_evaluator.ts

**בדיוק כמו הבעיה שפתרנו בשלב הקודם:** ייבוא-ישיר של `ai/provider/anthropic-provider.js` מ-`index.ts` (`../../../ai/provider/...`) הוא **אותו סיכון-deploy-safety בדיוק** שכבר תיקנו עם ה-mock-evaluator. **המלצה:** לבנות `supabase/functions/oren-smart-advisor/anthropic-provider-edge.ts` — פורט-נאמן (זהה-כמעט-מילולית, הקובץ המקורי כבר קטן ופשוט: 44 שורות, `fetch` גולמי, אין מה-לשכפל-מבחינה-לוגית-מורכבת) בתוך תיקיית-הפונקציה, **self-contained**, באותו-דפוס-בדיוק כמו `goral_qa_mock_evaluator.ts`.

**הפרומפט עצמו** (`ai/prompts/hall-wisdom-goral-qa-evaluator.prompt.md`) — מאותה סיבה, **לא ייטען בקריאת-קובץ בזמן-ריצה** (Deno Deploy לא-בהכרח-תומך בקריאת-קבצים-חוצי-תיקיה גם-לא לטקסט). **המלצה:** להטמיע את תוכן-הפרומפט כקבוע-מחרוזת בתוך קובץ מקומי חדש (`supabase/functions/oren-smart-advisor/goral-qa-evaluator-prompt.ts`, `export const GORAL_QA_EVALUATOR_PROMPT = \`...\`;`), **מועתק-ידנית** מהמקור (`ai/prompts/hall-wisdom-goral-qa-evaluator.prompt.md`) — לא-אוטומטי, כדי שלא-תהיה תלות-קובץ-חיצוני. יידרש תהליך-סנכרון-ידני אם הפרומפט המקורי משתנה בעתיד (מתועד כ"חוב-תחזוקה" מוכר, לא נפתר כאן).

### 2.4 fallback ל-MOCK אם live disabled

הצעה (לאישורך, לא-מוכרעת סופית כאן): **fallback מתועד, לא fail-closed** — כי חוסר-AI-חי הוא מגבלת-פיצ'ר, לא-פרצת-אבטחה (בניגוד ל-auth שחייב fail-closed). כשל בשרשרת-ה-AI (מפתח חסר / `mode` לא `live` / שגיאת-Anthropic) **תמיד** נופל בחזרה ל-`evaluateQaRunMockEdge` הקיים — התגובה כוללת שדה חדש `evaluatorMode: 'mock' | 'live'` ושדה `liveModeUnavailableReason` (למשל `'missing-api-key'`/`'mode-not-live'`/`'anthropic-error'`) כדי שהקורא **תמיד יידע** אם קיבל תשובה אמיתית-מ-AI או נפילה-חזרה — לא-שקט-מטעה.

### 2.5 מנגנון וידוא שאין קריאת-AI לפני auth תקין

**זהה-לחלוטין לדפוס הקיים** (שכבר מאומת בבדיקות): קריאת-ה-AI (כמו הקריאה ל-mock evaluator כיום) תמשיך לשבת **רק** אחרי שלבי-ה-auth (1-5) הקיימים ב-`handleAdvisorRequest`. לא מתוכנן שום שינוי במיקום-הקוד-הזה — רק הענף הפנימי בתוך "module goralQA מאומת" יתפצל בין mock/live.

---

## 3. env/secrets נדרשים

| משתנה | קיים כבר? | תפקיד |
|---|---|---|
| `SUPABASE_URL` | כן (auth) | אימות-טוקן |
| `SUPABASE_ANON_KEY` | כן (auth) | אימות-טוקן |
| `ALLOWED_OREN_UID` | כן (auth) | allowlist |
| `ANTHROPIC_API_KEY` | **לא** — יתווסף רק בשלב-חיבור-AI-בפועל, בהמשך, עם אישור נפרד | מפתח-Anthropic אמיתי |
| `HALL_WISDOM_AI_MODE` | **לא** — חדש, מוצע | `mock` (ברירת-מחדל) / `live` — מתג-שרת גלובלי |

**הצעה לעקרון "שני-מתגים" (defense-in-depth):** AI חי יופעל **רק** כששני התנאים מתקיימים **יחד**:
1. `HALL_WISDOM_AI_MODE=live` בסביבת-השרת (Oren שולט מתי בכלל-אפשרי).
2. הבקשה עצמה כוללת `mode: 'live'` בגוף-הבקשה (Oren שולט per-request אם רוצה live או מוק, גם כשה-flag הגלובלי live).

אם אחד מהם חסר/false → **תמיד MOCK**, ללא תלות בשני.

---

## 4. מצב-הפעלה — ברירת-מחדל MOCK, תמיד

```
if (moduleName === 'goralQA') {
  validate payload (כבר קיים) → 400 אם לא-תקין

  const serverModeIsLive = getEnv('HALL_WISDOM_AI_MODE') === 'live';
  const requestWantsLive = body?.mode === 'live';
  const hasApiKey = !!getEnv('ANTHROPIC_API_KEY');

  if (serverModeIsLive && requestWantsLive && hasApiKey) {
    // ← ניסיון-AI-חי, עם fallback-אוטומטי-ל-mock בכל כשל (ראו §2.4)
  } else {
    // ← MOCK, כמו היום — ללא שינוי בהתנהגות הקיימת
  }
}
```

זהו **שינוי-הוספה בלבד** — אם `HALL_WISDOM_AI_MODE` לא-מוגדר בכלל (המצב היום, ותמיד יישאר כך עד deploy-מפורש-עתידי), ההתנהגות **זהה-לחלוטין** למה שכבר קיים ונבדק.

---

## 5. אבטחה — פירוט לפי כל דרישה

| דרישה | איך ממומש |
|---|---|
| לא לחשוף API key בדפדפן | המפתח קיים **רק** ב-Supabase secrets, נקרא רק בתוך ה-Edge Function; אין שום נתיב-קוד שמעביר אותו ל-frontend |
| לא לשלוח phone/clientHistorySummary/dynFields גולמיים | **כבר-אכוף** ב-`goral-qa-ai-payload-builder.js` (המקומי) — אך ה-Edge Function מקבלת payload **מהקורא** (לא בהכרח דרך ה-payload-builder!) — **תוספת נדרשת:** בדיקת-סניטציה **שרתית** (defense-in-depth) שדוחה/מנקה payload שמכיל את המפתחות האסורים לפני שהוא נשלח ל-Anthropic, גם אם הקורא-לא-השתמש-ב-payload-builder |
| לא לשלוח sourceText מלא | ה-payload כבר כולל רק `sourceRulesApplied` — ציטוטי-כלל בודדים (משפט-שניים), לא-עמודים-שלמים-מהספר; להבהיר במפורש בקוד/prompt שאסור להוסיף שדה חדש שמצרף טקסט-ספר גולמי-ולא-מסונן |
| לא להריץ AI אם payload לא עבר sanitization | הבדיקה-השרתית (השורה השנייה למעלה) חוסמת גם תרחיש-הזה — `mode:'live'` לא-מספיק, ה-payload עצמו נבדק תמיד לפני קריאת-Anthropic |
| לא להחזיר chain-of-thought | ה-prompt (`hall-wisdom-goral-qa-evaluator.prompt.md`) כבר-קובע "JSON בלבד, אין טקסט מחוץ ל-JSON" — יש להוסיף עוד-הנחיה-מפורשת "אל תסביר את תהליך-החשיבה שלך, רק את המסקנה" בשלב-כתיבת-הפרומפט-הסופי-להטמעה; תגובת-Anthropic תיבדק (`JSON.parse`) ותידחה אם היא לא-JSON-תקין (מונע-דליפת-טקסט-חופשי) |
| להחזיר JSON בלבד לפי הסכימה | `response.content` (טקסט מ-Anthropic) עובר `JSON.parse` + בדיקת-14-המפתחות-הנדרשים; כשל → fallback ל-mock (§2.4), **לא** מוחזר טקסט-גולמי-לא-מאומת ללקוח |

---

## 6. בדיקות שצריך להכין (לשלב-המימוש, לא כאן)

כל הבדיקות הבאות ירוצו **ללא** קריאת-רשת אמיתית — `fetch` ל-Anthropic יוזרק/יומוקק, בדיוק כמו ש-`verifyToken` כבר מוזרק היום:

1. `no token → 401` — (קיים, ללא שינוי)
2. `wrong UID → 403` — (קיים, ללא שינוי)
3. `authorized + mode mock (ברירת-מחדל) → mock response` — (קיים, `_test_hall_wisdom_goral_qa_edge_mock.mjs`)
4. `authorized + mode:'live' + HALL_WISDOM_AI_MODE!=='live' → עדיין mock` (מתג-שרת חוסם)
5. `authorized + HALL_WISDOM_AI_MODE='live' + mode:'live' אך ANTHROPIC_API_KEY חסר → fallback-מתועד ל-mock, evaluatorMode:'mock', liveModeUnavailableReason:'missing-api-key'`
6. `authorized + שני-המתגים live + ANTHROPIC_API_KEY מזויף + fetch-מוזרק-ל-Anthropic מחזיר-הצלחה → 200, evaluatorMode:'live', JSON תקין לפי סכימה`
7. `Anthropic מחזיר שגיאה (500/timeout מדומים) → fallback-מתועד ל-mock, evaluatorMode:'mock', liveModeUnavailableReason:'anthropic-error', אין secret בהודעת-השגיאה`
8. `Anthropic מחזיר טקסט-לא-JSON → אותו fallback, לא-נשלח-ללקוח טקסט-גולמי-לא-מאומת`
9. `evaluator (mock או live) לא-רץ לפני auth` — (מורחב מהקיים, אותו דפוס בדיקה-סטטית-על-המקור)
10. `אין קריאת-fetch-ל-Anthropic לפני auth תקין` — spy-על-fetch כמו היום, מוודא 0 קריאות בכל תרחישי-401/403/503
11. `payload עם phone/dynFields/clientHistorySummary נדחה/מנוקה גם ב-mode:'live'` — הבדיקה-השרתית-החדשה (§5)
12. `regression`: כל הבדיקות הקיימות (auth + mock-routing) נשארות ירוקות ללא שינוי

**קובץ-בדיקה מתוכנן:** `_test_hall_wisdom_goral_qa_live_ai.mjs` (שם-בלבד, לא-נוצר בשלב זה).

---

## 7. מה לא בוצע בשלב זה (תכנון בלבד)

- ❌ לא נוסף `ANTHROPIC_API_KEY` אמיתי בשום מקום.
- ❌ לא בוצע `supabase functions deploy`.
- ❌ לא חובר AI חי בפועל.
- ❌ לא שונה UI.
- ❌ לא תוקנו מנועים.
- ❌ לא תוקנו קלפים.
- ❌ לא מוזג ל-`main`.
- ❌ לא בוצע production deploy.
- ❌ לא נגעתי ב-`inner-compass`.

---

## תשובות מסכמות

**1. האם אפשר לחבר AI חי במבנה הקיים?**
כן — התשתית (auth gate, payload-builder עם סינון-פרטיות, prompt מוגדר, provider self-contained) כבר קיימת. הדרוש הוא בעיקר **הרכבה**, לא בנייה-מאפס. הלקח החשוב מהשלב הקודם (ייבוא-חוצה-ריפו לא-deploy-safe) חל **גם** על `ai/provider/anthropic-provider.js` — צריך פורט-מקומי, לא ייבוא-ישיר.

**2. אילו קבצים יצטרכו להשתנות?**
`supabase/functions/oren-smart-advisor/index.ts` (ענף-live בתוך ה-routing הקיים, לא-refactor); קבצים-חדשים בתוך אותה תיקייה: `anthropic-provider-edge.ts` (פורט-מקומי, self-contained), `goral-qa-evaluator-prompt.ts` (טקסט-הפרומפט כקבוע). קובץ-בדיקה חדש. **שום קובץ מחוץ ל-`supabase/functions/oren-smart-advisor/`** אמור להשתנות.

**3. האם צריך provider חדש ל-Deno או אפשר להשתמש בקיים?**
**צריך פורט-מקומי חדש** (`anthropic-provider-edge.ts`) — לא ייבוא-ישיר של `ai/provider/anthropic-provider.js`, מאותה סיבת deploy-safety שכבר תיקנו ב-mock-evaluator. הפורט טריוויאלי (44 שורות, `fetch` גולמי) — לא refactor, רק העתקה-מודעת לתוך תיקיית-הפונקציה.

**4. איך ייראה request ל-Anthropic?**
```js
callAnthropic({
  apiKey: getEnv('ANTHROPIC_API_KEY'),
  model: <עדיין-לא-הוחלט — פרמטר-נכנס, לא-מקובע-בקוד>,
  system: GORAL_QA_EVALUATOR_PROMPT,       // מ-goral-qa-evaluator-prompt.ts
  userMessage: JSON.stringify(sanitizedPayload), // אחרי הסניטציה השרתית
})
```

**5. איך ייראה response?**
`callAnthropic` מחזיר `{ok:true, text}` (טקסט חופשי מה-מודל, שאמור-להיות JSON לפי ה-prompt). ה-Edge Function עושה `JSON.parse(text)`, בודקת שכל 14 המפתחות קיימים, ומחזירה `{ok:true, module:'goralQA', evaluatorMode:'live', evaluatorOutput:<הJSON המנותח>}`. כל כשל (parse/schema/http) → fallback מתועד ל-mock (§2.4).

**6. איך נשמור MOCK כברירת מחדל?**
שני מתגים עצמאיים (`HALL_WISDOM_AI_MODE=live` בסביבה + `mode:'live'` בבקשה) — חייבים-שניהם. בהיעדר אחד מהם (המצב הנוכחי והעתידי-הקרוב) — MOCK תמיד, בדיוק כמו היום, ללא שום שינוי-התנהגות.

**7. רשימת בדיקות:** ראו §6 לעיל — 12 תרחישים.

**8. סדר ביצוע מומלץ לשלב הבא (אחרי אישורך):**
1. בניית `anthropic-provider-edge.ts` (פורט מקומי, בלי secret, בלי קריאה-אמיתית — נבדק עם fetch-מוזרק).
2. בניית `goral-qa-evaluator-prompt.ts` (העתקת-הטקסט הקיים).
3. הוספת הסניטציה-השרתית (§5) + הענף-live-עם-fallback ב-`index.ts` — **עדיין בלי `ANTHROPIC_API_KEY` אמיתי בשום סביבה**, כל הבדיקות עם מפתח-מזויף+fetch-מוזרק.
4. כתיבת `_test_hall_wisdom_goral_qa_live_ai.mjs` (12 התרחישים).
5. Precommit Report נפרד — **עדיין ללא secret/deploy**.
6. **רק אחרי אישור נפרד ומפורש נוסף:** `supabase secrets set ANTHROPIC_API_KEY=...` + `supabase functions deploy` (בשלב-נפרד-לגמרי, מחוץ להיקף כל מה שתוכנן כאן).
