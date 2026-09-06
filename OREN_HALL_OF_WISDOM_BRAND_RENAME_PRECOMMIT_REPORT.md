# OREN_HALL_OF_WISDOM_BRAND_RENAME_PRECOMMIT_REPORT — שינוי מיתוג תצוגה: "בינת אורן" → "בינת היכל החכמה"

> **דוח לפני-commit. עדיין לא בוצע commit/push. שינוי טקסט-תצוגה בלבד — שום שם-קובץ, Edge Function, internal ID, secret, auth, מנוע, QA runner, או קלף לא נגע.**
> תאריך: 2026-07-09.

---

## 1. אילו קבצים שונו

```
 M  _test_oren_advisor_panel_ui.mjs      (1 שורה — עדכון-assertion בלבד)
 M  goral-hachol/ui/goral-app.js         (1 שורה — טקסט-תצוגה בלבד)
```

`git diff` מלא — 2 שורות שונו בסה"כ, שתיהן טקסט בלבד:

```diff
- <span class="oren-advisor-title">בינת אורן — לוח יועץ פנימי</span>
+ <span class="oren-advisor-title">בינת היכל החכמה — לוח יועץ פנימי</span>
```
```diff
- assert(panelHtml.includes('...') && panelHtml.includes('בינת אורן — לוח יועץ פנימי'), ...)
+ assert(panelHtml.includes('...') && panelHtml.includes('בינת היכל החכמה — לוח יועץ פנימי'), ...)
```

## 2. איפה הוחלף השם

**מקום יחיד בקוד חי:** `goral-hachol/ui/goral-app.js:2792` — תוך `renderOrenAdvisorPanel()`, בתוך `<span class="oren-advisor-title">`. זהו **המקום היחיד בכל בסיס-הקוד** שבו הכותרת מוצגת בפועל למשתמש/יועץ (אומת ב-`grep` על `goral-hachol.html`, `goral-hachol/ui/goral-app.js`, וכל `goral-hachol/**/*.js` — 0 מופעים נותרו).

**עדכון-נלווה נדרש:** `_test_oren_advisor_panel_ui.mjs:148` — בדיקת-Playwright שאסרה בפועל את הטקסט הקודם ("בינת אורן — לוח יועץ פנימי") ותוקנה כדי לבדוק את הטקסט החדש — ללא העדכון הזה, השינוי ב-UI היה **שובר** את הבדיקה הקיימת (הוכחה שהשינוי אכן נלכד ע"י בדיקה אמיתית, לא רק הצהרה).

**חיפשתי גם את השגיאה "open-smart-advisor" (שציינת שאם תופיע יש לתקן ל-`oren-smart-advisor`) — 0 מופעים נמצאו בכל הריפו. אין מה לתקן.**

**קבצי-דוח היסטוריים (`.md`) שכבר תיעדו את השם הקודם — לא נערכו.** אלו רשומות מתוארכות של מה שנבנה ב-commit-ים ספציפיים בעבר (למשל `OREN_SMART_ADVISOR_PANEL_UI_MOCK_PRECOMMIT_REPORT.md` מתאר במדויק מה היה קיים ב-commit `bffddea`) — עריכה שלהם עכשיו הייתה יוצרת רישום היסטורי לא-מדויק. אם ברצונך שאעדכן גם אותם — זו החלטה נפרדת שאשמח לבצע לפי הנחייתך המפורשת.

## 3. אישור: שמות טכניים לא שונו

- ✅ `oren-advisor-title`/`oren-advisor-header`/`oren-advisor-lock`/`oren-advisor-badge`/`oren-advisor-caret`/`oren-advisor-body`/כל שאר מחלקות ה-CSS — **ללא שינוי** (28 מופעי `oren-advisor-*`/`orenAdvisor*`/`oren-smart-advisor` בקובץ, כולם זהים לפני ואחרי).
- ✅ `buildMockOrenAdvisorBrainOutput`/`renderOrenAdvisorPanel` (שמות-פונקציה) — ללא שינוי.
- ✅ `#orenAdvisorPanel`/`#orenAdvisorToggle`/`#orenAdvisorBody`/`#orenAdvisorCopyBtn` (DOM IDs) — ללא שינוי.
- ✅ `supabase/functions/oren-smart-advisor/index.ts` — לא נערך כלל, שם ה-Edge Function נשאר `oren-smart-advisor`.
- ✅ שום שם-קובץ לא שונה.

## 4. אישור: מנועים/AI/QA/קלפים לא נגעו

- ✅ `goral-hachol/engine/**` — לא נערך אף קובץ.
- ✅ `goral-hachol/qa/**` (Goral QA Brain, כולל ה-runner) — לא נערך.
- ✅ שום AI חי, שום secret, שום auth — לא נגעתי.
- ✅ `cartomancy/**`/`cards.html` — לא נערכו.
- ✅ `inner-compass` — לא נגעתי.

## 5. תוצאות בדיקות

**Playwright (דפדפן אמיתי) — `_test_oren_advisor_panel_ui.mjs` — 21/21**, כולל האסרציה המעודכנת שמאמתת שהכותרת המדויקת "בינת היכל החכמה — לוח יועץ פנימי" (+ 🔒 + badge ללא-שינוי) מופיעה בפועל בדפדפן.

**חבילת-הרגרסיה המלאה (12 קבצים) — כולם עברו ללא כשל:**
`goral-qa-runner.mjs`, `_test_goral_qa_brain_phase2.mjs`, `_test_goral_rule_applicability.mjs`, `_test_kashf_house_label_context.mjs`, `_test_kashf_context_sanitizer.mjs`, `_test_kashf_commerce_smart_layer.mjs`, `_test_kashf_commerce_context_coherence.mjs`, `_test_kashf_commerce_context_aware.mjs`, `_test_kashf_context_fields_transfer.mjs`, `_test_kashf_archive_save.mjs`, `cartomancy/_test_cartomancy.mjs`, `_test_oren_smart_advisor_site_brain_poc.mjs`.

**`node --check`** על כל קבצי JS/MJS — כולם עברו (חוץ מהתקלה הקיימת-מראש הלא-קשורה `raml-data/raml-spiritual-diagnostics.js`).

## 6. אישור

⏳ **עדיין לא בוצע commit/push** — ממתין לאישורך.

---

## הצעד הבא

ממתין לאישורך ל-commit. שם commit מוצע: `Rename advisor panel display title to "בינת היכל החכמה"`.
