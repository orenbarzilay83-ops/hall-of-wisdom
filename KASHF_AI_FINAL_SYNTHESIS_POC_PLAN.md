# KASHF_AI_FINAL_SYNTHESIS_POC_PLAN — מפרט-הפיילוט-המפורט, Kashf commerce (תת-מסמך)

> **⚠ מסמך זה הוא תת-מסמך של `OREN_SMART_ADVISOR_SITE_BRAIN_POC_PLAN.md` — מפרט-הפיילוט-הראשון-והמפורט (Kashf commerce) של הבינה-הכללית "Oren Smart Advisor Brain", לא-ארכיטקטורת-העל ולא-הבינה-כולה. ראו המסמך-הראשי לתפקיד/תחומי-אחריות/router/סכימה-כללית.**
>
> **מסמך תכנון+מפרט בלבד. לא חובר API חי, לא נוסף secret, לא שונה `goral-app.js`/`kashf-reading-engine.js`/`kashf-narrative-writer.js`/commerce-smart-layer/HTML/UI, לא בוצע deploy, לא נגע ב-`inner-compass`, לא מוזג ל-main. לא בוצע commit/push — רק יצירת הקבצים.**
> תאריך: 2026-07-08. **עדכון-היקף:** זו לא-רק שכבת-ניסוח-סופי ללקוח — זו PoC ראשונה ל-**Oren Smart Advisor Brain**: בינה-פנימית שמבינה קריאה+ספרים+מנועים+פרטי-לקוח+סגנון-ייעוץ, ומסוגלת **גם** לזהות בעיות במנוע הדטרמיניסטי עצמו ולהפיק הוראה מוכנה-להעתקה ל-Claude Code. עונה על ההחלטה: engine-only לא-מספיק לרמת-הייעוץ הנדרשת — שכבת-בינה מעל-המנועים-הקיימים, לא-מחליפה אותם, **וגם** מפקחת עליהם.

---

## 1. קלט JSON שהבינה תקבל מהמנועים

מבנה אחד, נבנה **מ-`reading` הקיים בלבד** (אחרי חישוב מלא) + פלט `sanitizeKashfClientContext(reading)` — שום נתון חדש לא-נאסף:

```json
{
  "topicId": "commerce",
  "question": "האם העסקה תצליח?",
  "clientSafeContext": {
    "name": "...", "gender": "male|female|null",
    "workStatus": "self|employed|unemployed|retired|null",
    "quesitedName": "...|null"
  },
  "board": {
    "keyHouses": [
      { "houseNum": 1, "houseName": "בית ראשון — הנפש", "figureName": "...", "qualityHebrew": "מיטיב|מזיק" }
    ],
    "judge": { "houseNum": 15, "figureName": "...", "qualityHebrew": "..." },
    "complement": { "houseNum": 16, "figureName": "...", "qualityHebrew": "..." },
    "witnesses": { "w13": { "hebrewSummary": "..." }, "w14": { "hebrewSummary": "..." } },
    "dhamir": { "nameHebrew": "...", "houseNumber": 3, "methodHebrew": "..." },
    "leshonHaInyan": null
  },
  "formula": {
    "primaryVerdict": { "text": "...", "positive": true },
    "altVerdict": { "text": "...", "positive": false },
    "sourceText": "ציטוט-הספר — לביסוס-בלבד, לעולם לא-מצוטט-מילה-במילה ללקוח"
  },
  "engineDiagnosis": {
    "certaintyLevel": "high|medium|low",
    "contradictions": [ { "type": "primary-vs-alt", "primary": true, "alt": false } ],
    "contextAdjustments": [ { "type": "business-context-allowed", "note": "..." } ],
    "strongestSignals": [ { "id": "goods-profit-loss", "label": "...", "detail": "..." } ],
    "weakSignals": [ { "id": "buyer-vs-seller", "label": "...", "matches": false } ],
    "clientWordingExisting": "clientWording הדטרמיניסטי הקיים — חומר-ייחוס, לא-מחייב-העתקה",
    "practicalGuidanceExisting": "practicalGuidance הדטרמיניסטי הקיים — חומר-ייחוס"
  },
  "safety": {
    "blockedContextFields": ["phone", "dynFields", "..."],
    "advisorOnlyNotes": [ { "field": "dynFields.debtDetails", "note": "...", "sensitive": true } ]
  }
}
```

**עקרון-בנייה:** `board`/`formula`/`engineDiagnosis` נבנים ישירות משדות-קיימים ב-`reading`/`reading.commerceSmartLayer` (`keyHouseReadings`, `dhamir.winner`, `witnessTestimony`, `primaryFormula`, `altFormula`, `advisorDiagnosis`) — שום חישוב-חדש. `strongestSignals`/`weakSignals` (מ-`advisorDiagnosis` הקיים) נוספו-כאן כדי-שתהיה-לבינה תשתית-מינימלית לזהות `engineCritique`/`missingRules` (למשל: אם `weakSignals` לא-תואם או `strongestSignals` ריק). `clientSafeContext`/`safety` נלקחים **ישירות** מ-`sanitizeKashfClientContext(reading)` הקיים (commit `a2a095e`) — לא-נבנה מנגנון-סינון-חדש. `leshonHaInyan: null` כרגע — `kashf-leshon-hainyan.js` עדיין-לא-מחובר ל-`kashf-reading-engine.js` (ממצא מ-`KASHF_CONTEXT_AWARE_FINAL_SYNTHESIS_SPEC.md` §8) — שדה קיים-במבנה, `null` עד-שיחובר.

**⚠ מגבלה-ידועה (לא-נפתרת בשלב הזה):** `engineCritique`/`missingRules` איכותיים דורשים שהבינה תדע **מה יש בספר** שלא-הופעל — אבל הקלט-כרגע כולל רק את `formula.sourceText` (הציטוט-של-הכלל-שכבר-הופעל), לא את הספר-כולו. בלי גישה רחבה-יותר לחומר-המקור, `engineCritique`/`missingRules` יהיו **best-effort מוגבל** — מבוססים על מבנה-הקלט (חוסר ב-`leshonHaInyan`, `weakSignals` לא-תואמים, `dynFields` לא-מנוצלים) ולא-על-ידע-אמיתי-של-כל-כללי-הספר. זה-לא-חסם-ל-PoC, אבל צריך-להיות-ברור-מראש: הביקורת-הזו חלקית-במובהק, לא-מקיפה.

## 2. פלט JSON שהיא חייבת להחזיר

**עדכון-היקף:** הבינה היא לא-רק-מנסחת — היא גם **מפקחת-פנימית** על המנוע. הפלט חייב לכלול גם ביקורת-מנוע וגם הוראת-קוד-מוכנה-להעתקה (ידנית — Oren מעתיק בעצמו, אין הרצה-אוטומטית):

```json
{
  "advisorFinalDiagnosis": "string — ליועץ בלבד, מנוסח-מקצועי, יכול להזכיר כל-מה-שב-safety",
  "clientFinalAnswer": "string — ניסוח מקצועי ללקוח, לא-מזכיר phone/dynFields-רגישים/sourceText-גולמי",
  "reasoningTraceForAdvisor": "string קצר — אילו שדות מ-board/formula/context חוברו ולמה, ליועץ בלבד",
  "engineCritique": {
    "hasProblem": true,
    "problems": ["מכני מדי", "לא מחבר בין בית 1 לבית 15 בניסוח", "מתעלם מלשון-העניין (leshonHaInyan=null)"],
    "severity": "none|minor|medium|major"
  },
  "missingRules": ["כלל-מהספר שלא-הופעל, אם-ניכר-מ-weakSignals/strongestSignals-חסרים", "לשון-העניין לא-מחוברת ל-reading"],
  "codeInstructionForClaude": {
    "needed": true,
    "instruction": "string — הוראה קונקרטית, לא-כללית: מה-לתקן, למה",
    "filesToInspect": ["goral-hachol/engine/kashf-commerce-smart-layer.js"],
    "doNotTouch": ["kashf-reading-engine.js (חישוב הלוח)", "kashf-narrative-writer.js (אלא אם צוין אחרת)"],
    "testsToRun": ["_test_kashf_commerce_smart_layer.mjs", "_test_kashf_commerce_context_aware.mjs"]
  },
  "safetyFlags": ["phone-withheld", "sensitive-dynfield-withheld:debtDetails", "..."],
  "advisorBrainNotes": ["הבנתי מעבר-לפלט-ללקוח ש...", "כדאי-לבדוק-ידנית את...", "לא-לומר-ללקוח את..."],
  "nextBestAction": "approveOutput|rewriteClientAnswerOnly|fixEngineLogic|addMissingRule|improvePrompt|askOrenForClarification|sendInstructionToClaude",
  "confidence": "high|medium|low",
  "caution": "none|mild|strong"
}
```

**אכיפה:** תגובה שלא-פרסה כ-JSON תקין עם **כל 12** המפתחות האלה = כישלון, הקורא נופל-חזרה ל-`clientWordingExisting`/`practicalGuidanceExisting` (אותו עיקרון-fallback שכבר-קיים ב-`oren-smart-ai/index.ts`) — במקרה-כשל, `engineCritique`/`missingRules`/`codeInstructionForClaude` פשוט לא-קיימים, לא-שגיאה-חוסמת.

**חשוב להבהיר:** `codeInstructionForClaude` הוא **טקסט-מוכן-להעתקה בלבד** — Oren מעתיק אותו ידנית לשיחה עם Claude Code. שום מנגנון-אוטומטי לא-שולח/מריץ את ההוראה הזו בפני-עצמו — אין הרצה-אוטומטית-של-קוד מהבינה, בשום שלב.

## 3. איפה השכבה תשב בארכיטקטורה

```
buildKashfReading()  ← דטרמיניסטי, בלתי-משתנה (Kashf engine)
        │
        ▼
computeCommerceSmartLayer()  ← דטרמיניסטי, בלתי-משתנה (advisorDiagnosis/clientWording/practicalGuidance)
        │
        ▼
sanitizeKashfClientContext()  ← דטרמיניסטי, בלתי-משתנה (סינון-הקשר)
        │
        ▼
[חדש] buildAiSynthesisInput(reading)  ← פונקציה טהורה, מרכיבה את ה-JSON בסעיף 1
        │
        ▼
[חדש, PoC בלבד] callOrenSmartAdvisorBrain(input)  ← קורא ל-AI, fallback על-כשל
        │
        ├──► narrative-writer / UI  ← עדיין-לא-נוגע — משתמש-היום ב-clientWording/
        │                              practicalGuidance הישנים, יעודכן רק בשלב-נפרד-ומאושר
        │
        └──► פלט-ליועץ (Oren בלבד, לא-לאתר-החי): engineCritique / missingRules /
                                                    codeInstructionForClaude / advisorBrainNotes
```

השכבה **אחרי** כל החישוב הקיים — לא-מחליפה אף-שכבה קיימת. יש לה **שני-יעדים**: (א) ניסוח-ללקוח (`clientFinalAnswer`, מקביל-למה-שהיה-מתוכנן קודם, עדיין-לא-מחובר-בפועל ל-narrative-writer), (ב) **פיקוח-פנימי ליועץ** (`engineCritique`/`codeInstructionForClaude`/`advisorBrainNotes`) — זה-בכלל-לא-מגיע-לאתר-החי, זה-כלי-עבודה-של-אורן-משה-מול-הקוד.

## 4. אילו קבצים קיימים כבר יכולים לשמש אותה

| קובץ | תפקיד עתידי |
|---|---|
| `goral-hachol/engine/kashf-reading-engine.js` | מקור ל-`board`/`formula` (`keyHouseReadings`, `dhamir`, `witnessTestimony`, `primaryFormula`/`altFormula`) — **לא-נערך** |
| `goral-hachol/engine/kashf-commerce-smart-layer.js` | מקור ל-`engineDiagnosis` (`advisorDiagnosis`, `clientWording`, `practicalGuidance`) — **לא-נערך** |
| `goral-hachol/engine/kashf-context-sanitizer.js` | מקור ל-`clientSafeContext`/`safety` — **לא-נערך** |
| `ai/provider/anthropic-provider.js` | `callAnthropic({apiKey, model, system, userMessage})` — **קיים ומוכן**, ללא-שינוי-נדרש |
| `ai/provider/_test-anthropic-provider.mjs` | דוגמה-לדפוס-בדיקת-mock (fetch מזויף) — לשימוש-כתבנית לבדיקת ה-PoC |
| `supabase/functions/oren-smart-ai/index.ts` | שלד Edge Function גנרי — כרגע תומך רק ב-`cartomancy` (יש prompt אמיתי); `kashf` הוא **stub מפורש** (`ai/prompts/kashf-runtime.md`) שנכשל-בבירור ל-`fallback:true` |

## 5. האם קיימת כבר תשתית Anthropic/OpenAI בפרויקט

**כן — תשתית-שלד קיימת ומאומתת, אך לא-מחוברת-חי:**
- `ai/provider/anthropic-provider.js` — `fetch` גולמי ל-Anthropic Messages API, בלי SDK, בלי מפתח-מוטמע, בלי מודל-מקובע-בקוד. **לא נטען משום HTML** (מאומת). נבדק ב-`_test-anthropic-provider.mjs` עם `fetch` מזויף (הצלחה+כשל), 0 קריאת-רשת-אמיתית.
- `supabase/functions/oren-smart-ai/index.ts` — שלד Deno, **לא-נפרס** (`supabase functions deploy` לא-בוצע), קורא ל-`Deno.env.get('ANTHROPIC_API_KEY')` (לא-קיים כרגע), נופל-חזרה ל-`fallback:true` בכל-כשל.
- `ai/prompts/kashf-runtime.md` — **STUB מפורש**, "אין בו שום הנחיה שניתנת לשימוש בפועל" (מצוטט מהקובץ עצמו).
- **אין OpenAI** בפרויקט בשום מקום.

**מסקנה:** אין-צורך לבנות תשתית-חיבור-חדשה — `callAnthropic` כבר-קיים-ומוכן-לשימוש. מה שחסר הוא **תוכן** (prompt אמיתי לכשף) ו**חיווט** (הפונקציה שבונה את ה-JSON מסעיף 1 ומעבירה אותה ל-`callAnthropic`), לא **תשתית**.

## 6. מה חסר כדי להריץ בפועל (לא-בוצע כאן, לתשומת-לב-עתידית)

1. `ANTHROPIC_API_KEY` אמיתי — Secret ב-Supabase, **לא-בקוד, לא-ב-git** (עקרון קיים-ומאושר).
2. `supabase functions deploy oren-smart-ai` בפועל — לא-בוצע.
3. `PROMPT_PATHS.kashf` ב-`oren-smart-ai/index.ts` מצביע על `ai/prompts/kashf-runtime.md` (STUB) — צריך-להצביע (בעתיד, בנפרד) על ה-prompt-האמיתי מהמסמך הזה, **או** ליצור נתיב-נפרד למודול "kashf-final-synthesis"/"oren-advisor-brain" (מומלץ, כדי-לא-לגעת-ב-stub-הקיים-שנחסם-בכוונה מסיבות-משילות שתועדו שם).
4. פונקציה חדשה `buildAiSynthesisInput(reading)` — טרם-נכתבה (מתוכננת בסעיף 1/3 בלבד).
5. פונקציית-קריאה `callOrenSmartAdvisorBrain(input)` — טרם-נכתבה — צריכה: קריאה-ל-`callAnthropic` עם ה-prompt מ-`goral-hachol/ai-prompts/kashf-final-synthesis.prompt.md`, פרסור-JSON קפדני (כל 12 המפתחות) עם fallback-על-כישלון-פרסור, timeout סביר.
6. החלטה נפרדת: האם הקריאה קורית client-side (מהדפדפן, ישירות ל-Edge Function) או server-side בלבד — משפיע על מבנה-ה-CORS/auth של ה-Edge Function, לא-הוכרע כאן.
7. ולידציה על הפלט: `safetyFlags` חייב-להיבדק-מכנית (למשל `phone` לא-מופיע ב-`clientFinalAnswer`) **גם אחרי** תשובת-AI — לא-מספיק-לסמוך-על-ה-prompt, כמו-שכבר-נקבע-לגבי-הבטחות-אחרות בפרויקט הזה.
8. **החלטה נפרדת (לא-הוכרעה כאן):** איפה `engineCritique`/`codeInstructionForClaude`/`advisorBrainNotes` מוצגים בפועל ל-Oren — אין-היום שום UI-ליועץ נפרד מהאתר-הלקוחי. ייתכן שזה-דורש כלי-נפרד לגמרי (לא `goral-hachol.html`) — לא-מתוכנן-כאן, מעבר-להיקף-ה-PoC.
9. הרחבת-קלט אפשרית לעתיד: אם ירצו `engineCritique`/`missingRules` מבוססים-יותר (לא רק best-effort, ראו המגבלה בסעיף 1) — יידרש להזין קטעים-רלוונטיים מהספר (לא כל הספר), עדיין-לא-מתוכנן.

## 7. איך להריץ בדיקת PoC בלי לשנות את האתר החי

- סקריפט Node עצמאי (`_test_kashf_ai_synthesis_poc.mjs`, אם-ייכתב-בעתיד) שקורא ל-`buildKashfReading` (קיים) + פונקציית-ה-input-builder החדשה, ואז ל-`callAnthropic` **עם `fetch` מזויף** (כמו ב-`_test-anthropic-provider.mjs` הקיים) — **אין-קריאת-רשת-אמיתית, אין-מפתח-אמיתי** בשלב-הבדיקה-הראשוני.
- רק **אחרי** אישור-נפרד-ומפורש: הרצה-אמיתית מקומית (לא ב-Edge Function, לא ב-production) עם מפתח-בדיקה-זמני שנטען מ-`process.env` (לעולם-לא-בקובץ), מול 5 הדוגמאות שבסעיף 8.
- שום שינוי ל-`goral-hachol.html`/`goral-app.js` — הבדיקה רצה כ-סקריפט `node` עצמאי, בדיוק-כמו-כל-בדיקת-הרגרסיה-הקיימת בפרויקט הזה.

## 8. איך לבדוק על 5 דוגמאות commerce מהקובץ הקיים

מ-`KASHF_COMMERCE_MANUAL_OUTPUT_SAMPLES.md` (12 דוגמאות קיימות) — 5 מומלצות ל-PoC ראשון, כי הן מכסות את מרחב-ההחלטות הקריטי, **גם** לניסוח-ללקוח **וגם** לביקורת-מנוע:
1. **דוגמה 1 (שכיר + contradiction)** — לוודא ש-`clientFinalAnswer` לא-כותב "בעל עסק" וגם-לא-מרכך את הסתירה; ולבחון אם `engineCritique.problems` מזהה שהמנוע-כבר-מטפל-נכון (כלומר `hasProblem` יכול-להיות `false` כאן — זה-לא-מקרה-שדורש-תיקון).
2. **דוגמה 6 (quesitedName לא-מנוצל)** — הדוגמה-המובהקת-ביותר לבחון `missingRules`/`codeInstructionForClaude`: הבינה **צריכה** לזהות ש-`quesitedName` מגיע-בקלט אך אף-פעם-לא-משפיע על `clientWordingExisting`, ולהפיק הוראה קונקרטית (למשל: "הרחב את `kashf-commerce-smart-layer.js` לצרוך `clientSafeContext.quesitedName`").
3. **דוגמה 8 (dynFields רגישים)** — לוודא ש-`safetyFlags` כולל `sensitive-dynfield-withheld` וש-`clientFinalAnswer` לא-מכיל את התוכן הרגיש.
4. **דוגמה 9 (low certainty)** — לוודא ש-`caution: "strong"` או `"mild"` (לא `"none"`), ולבחון אם `advisorBrainNotes` מוסיף-תובנה-מעבר-לפלט-הקיים (למשל: "כדאי-לבדוק-ידנית מול-הלקוח לפני-שממליצים").
5. **דוגמה 12 (phone + employed, שלילי)** — לוודא ש-`safetyFlags` כולל `phone-withheld`, ו-`nextBestAction` הגיוני (סביר: `"approveOutput"` אם-אין-בעיה-אמיתית, לא `"fixEngineLogic"` סתם).

לכל דוגמה: להריץ עם `fetch` מזויף בשלב-ראשון (בדיקת-מבנה-הקלט/פלט בלבד — כולל-בדיקה-מכנית שכל 12 המפתחות קיימים ומהסוג-הנכון, לא-רק-6-הישנים) — בדיקת-איכות-תוכן-אמיתית (האם `engineCritique`/`codeInstructionForClaude` באמת-מדויקים ולא-סתם-נשמעים-הגיוניים) **דורשת** קריאה-אמיתית, שממתינה-לאישור-נפרד (סעיף 6-7).

## 9. מה אסור לחשוף ללקוח

`phone` (בשום-ניסוח, גם-לא-חלקי) | תוכן-`dynFields` רגיש (מזוהה ע"י `sanitizeKashfClientContext`) | `sourceText` הגולמי-מהספר (ציטוט-מילולי) | `parentName` | `clientHistorySummary`/`repeatedSpiritualFlags` הגולמיים (אם-יחוברו-בעתיד) | כל תוכן שאין-לו-עיגון-ב-`board`/`formula`/`engineDiagnosis` שנמסרו (איסור-המצאה מוחלט, מקביל-ל"no invented data" הקיים ב-`CLAUDE.md`).

## 10. מה צריך להישאר ליועץ בלבד

`advisorFinalDiagnosis` (הניתוח-המלא, כולל-כל-מה-שב-`safety`) | `reasoningTraceForAdvisor` | `advisorDiagnosis` הדטרמיניסטי הקיים (`weightedHouses`/`strongestSignals`/`weakSignals`) | `sourceText` (מותר-ליועץ, אסור-ללקוח — כבר-כך-היום ב-`kashf-narrative-writer.js`) | כל `advisorOnlyNotes` שמקורם ב-`safety.advisorOnlyNotes`. **וכעת גם:** `engineCritique` (ביקורת-מנוע — לא-רלוונטי-ואסור-ללקוח בהחלט), `missingRules`, `codeInstructionForClaude` (מיועד-ל-Oren-בלבד, לא-לאתר-הלקוחי בשום-אופן), `advisorBrainNotes`, `nextBestAction` — כל 5 השדות-החדשים הם **advisor-only/Oren-only במובהק**, אין אף-תרחיש-שבו-הם-מוצגים-ללקוח.

---

## הצהרות

- שום API חי לא חובר. שום secret לא נוסף. שום קוד-מנוע/narrative/HTML/UI לא שונה.
- שום deploy. שום נגיעה ב-`inner-compass`. לא מוזג ל-main.
- שום commit/push — רק יצירת הקבצים.
- הצעד הבא — לפי החלטת אורן משה בלבד.
