# OREN_SMART_ADVISOR_PANEL_UI_MOCK_PRECOMMIT_REPORT — פאנל-יועץ-פנימי, UI במצב MOCK

> **דוח בלבד. לא חובר Anthropic/OpenAI חי, לא נוסף secret, לא בוצע deploy, לא נקראה Edge Function חיה, לא שונה מנוע Kashf/Hawi, לא שונה narrative, לא הורחב ל-Hawi/קלפים, לא נגע ב-`inner-compass`, לא מוזג ל-main. לא בוצע commit/push — רק יצירת/עדכון-הקבצים.**
> תאריך: 2026-07-08. ממשיך את `OREN_SMART_ADVISOR_PANEL_PLACEMENT_DECISION.md` (`da58d4a`) — מימוש-UI-ראשון, MOCK-בלבד.

---

## 1. `git diff --stat`

```
 _test_kashf_context_sanitizer.mjs |  28 ++++++--
 goral-hachol.html                 |  60 ++++++++++++++++
 goral-hachol/ui/goral-app.js      | 148 ++++++++++++++++++++++++++++++++++++++
 3 files changed, 230 insertions(+), 6 deletions(-)
```
(+ קובץ-בדיקה חדש: `_test_oren_advisor_panel_ui.mjs`)

## 2. רשימת כל הקבצים ששונו/נוצרו

- `goral-hachol.html` (עריכה — CSS + container-div בלבד)
- `goral-hachol/ui/goral-app.js` (עריכה — 2 פונקציות חדשות + נקודת-חיבור אחת)
- `_test_kashf_context_sanitizer.mjs` (עריכה — עדכון-assertion-ישן, ראו סעיף 3)
- `_test_oren_advisor_panel_ui.mjs` (חדש — בדיקת-דפדפן אמיתית, Playwright+Chromium)
- `OREN_SMART_ADVISOR_PANEL_UI_MOCK_PRECOMMIT_REPORT.md` (חדש, קובץ זה)

**שום קובץ אחר לא נערך** — `kashf-reading-engine.js`, `kashf-commerce-smart-layer.js`, `kashf-narrative-writer.js`, `supabase/functions/*`, כל-קובץ-חאווי — כולם נשארו בדיוק כפי-שהיו.

## 3. איך הפאנל נראה ואיפה הוא ממוקם

**מיקום:** `<div id="orenAdvisorPanel">` נוסף כ-sibling נפרד **אחרי** `<div id="kashfReadingOutput">`, בתוך אותו `<section id="screen-kashf-reading">` — לא-בתוכו, לפי `OREN_SMART_ADVISOR_PANEL_PLACEMENT_DECISION.md` §1.

**מראה:** כותרת מתקפלת עם `🔒 בינת אורן — לוח יועץ פנימי` + badge קבוע `מצב בדיקה / MOCK — לא AI חי`. סכימה-ויזואלית **נבדלת-בכוונה** מה-Navy/Gold הלקוחי — רקע אדום-כהה (`#1a0808`), מסגרת `#7a1f1f`, טקסט-ורוד-בהיר — כדי-שיהיה בלתי-אפשרי-לבלבל בין-הפאנל-לתוכן-הרגיל. **מכווץ כברירת-מחדל** (`hidden` על ה-body מיד-אחרי-render). לחיצה-על-הכותרת פותחת/סוגרת. בפתיחה — 7 אזורים (אבחון-ליועץ, טיוטת-תשובה-ללקוח, ביקורת-מנוע, חוקים/ידע-חסרים, הוראה-לקלוד-קוד, בטיחות-ופרטיות, פעולה-מומלצת), עם כפתור **"📋 העתק הוראה לקלוד קוד"** שמופיע **רק** כש-`codeInstructionForClaude.needed === true`.

## 4. איך הוא נשאר MOCK בלבד

`buildMockOrenAdvisorBrainOutput(kashfReading)` — פונקציה חדשה, **לא-קוראת ל-AI בשום-אופן** — בונה את 12-המפתחות **מקומית**, מנתוני-`kashfReading` שכבר-קיימים (`clientWording`/`practicalGuidance`/`certaintyLevel` הדטרמיניסטיים, ו-`sanitizeKashfClientContext` לקבלת `blockedContextFields` בלבד). התוכן עצמו **מסומן-במפורש כ-"MOCK"** בתוך הטקסט (`advisorDiagnosis`/`clientAnswerDraft` כוללים "MOCK —" במפורש). **אין fetch, אין `callAnthropic`, אין קריאה ל-`supabase/functions/oren-smart-advisor`** בשום-מקום בקוד-הזה — מאומת-ישירות בבדיקת-הדפדפן (סעיף 5).

**אישור שהפלט הרגיל ללקוח לא השתנה:** `kashfHtml`/`outputEl.innerHTML` ממשיכים-להיבנות **אך-ורק** מ-`writeKashfReading(kashfReading)` (בלתי-שונה) — ה-sanitizer/הפאנל-החדש נקראים **אחרי** ששורת-`outputEl.innerHTML` כבר-רצה, בתוך `try/catch` נפרד (best-effort, לא-חוסם). מאומת-מכנית: `_test_kashf_context_sanitizer.mjs` (בדיקה מעודכנת) בודקת ש-`kashf-context-sanitizer` **לא-מופיע כלל** בקוד שלפני שורת `outputEl.innerHTML = buildBoardHtml(...)`; `_test_oren_advisor_panel_ui.mjs` בודקת ישירות בדפדפן ש-`#kashfReadingOutput` נשאר ריק כשלא-נגעו-בו (מוכיח-הפרדה מלאה בין שני ה-containers).

## 5. איך הוכח שאין קריאת רשת

בדיקת-דפדפן אמיתית (`_test_oren_advisor_panel_ui.mjs`, Playwright+Chromium — זמין-בסביבת-ההרצה-הזו): `page.on('request', ...)` עוקב-אחרי **כל** בקשת-רשת שהדף שולח. הבדיקה מפעילה-מעקב (`trackingActive = true`) **רק סביב-לחיצת-כפתור-ההעתקה**, ומאמתת ש-**0 בקשות-רשת חיצוניות** נשלחו כתוצאה-מהלחיצה. `navigator.clipboard.writeText` הוחלף-ב-mock-מקומי (Chromium חוסם clipboard-אמיתי-בלי-הרשאות בכל-מקרה) שרק-רושם-לזיכרון — הבדיקה מאמתת שהכפתור קורא-לו **בדיוק-פעם-אחת**, עם-התוכן-הנכון.

## 6. תוצאות בדיקות

**כל 8 קבצי-הבדיקה עברו:**
- `_test_oren_advisor_panel_ui.mjs` (חדש) — **21/21**: פאנל-ריק-לפני-render; מכווץ-כברירת-מחדל אחרי-render; כותרת+badge מדויקים; פתיחה מציגה בדיוק-7-אזורים בסדר-הנכון; mock-output כולל-כל-12-המפתחות; אין phone/sourceText/clientHistorySummary גולמיים בטקסט-הפאנל; כפתור-העתקה קורא ל-clipboard בדיוק-פעם-אחת, 0 בקשות-רשת; כשאין `needed`, הכפתור **לא-קיים-כלל ב-DOM**; `#kashfReadingOutput` נשאר-ריק (לא-הושפע מהפאנל).
- `_test_kashf_context_sanitizer.mjs` (עודכן) — 34/34, כולל 4 assertions חדשות שמבחינות במפורש בין שימוש-אסור (sanitizer לפני בניית-הפלט-ללקוח — לא-קיים) לשימוש-מותר (רק בתוך `buildMockOrenAdvisorBrainOutput`, מתויג-MOCK).
- 6 קבצי-הרגרסיה הנותרים — **100% ירוקים, ללא-עדכון**.

## 7. `git status --short`

```
 M _test_kashf_context_sanitizer.mjs
 M goral-hachol.html
 M goral-hachol/ui/goral-app.js
?? _test_oren_advisor_panel_ui.mjs
```

---

## הצהרות

- שום AI חי לא חובר. שום secret לא נוסף. שום Edge Function חיה לא נקראה. שום deploy.
- שום מנוע Kashf/Hawi/narrative לא שונה. שום הרחבה ל-Hawi/קלפים.
- שום נגיעה ב-`inner-compass`. לא מוזג ל-main.
- שום commit/push — רק יצירת/עדכון-הקבצים.
- הצעד הבא — לפי החלטת אורן משה בלבד.
