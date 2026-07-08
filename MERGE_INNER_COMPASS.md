# מיזוג "המצפן הפנימי" → מודול קלפים בהיכל החכמה

> יומן-מיזוג חי. ענף עבודה: `merge-inner-compass` (override מאושר לכלל "ענף יחיד" ולכלל "בלי framework/build" — ראה החלטות למטה).
> גישה שנבחרה: **A — פורט לוונילה JS**. אין Next, אין React, אין build. המנועים עוברים ל-ES modules טהורים; ה-UI נכתב מחדש בסגנון היכל; ה-AI עובר ל-Supabase Edge Function.

## החלטות מאושרות
- **Override:** מותר לשבור זמנית את כלל no-framework כדי לפרט את המצפן; העבודה על ענף `merge-inner-compass` (לא על הענף היחיד הרגיל, לא על main).
- **מפתח Anthropic מודלף:** המשתמש מבצע רוטציה; המסמך הזה מתעד את הצעדים.
- **בלי היסטוריית git של המצפן** — לא מייבאים את היסטוריית `inner-compass` להיכל (כדי לא לייבא את המפתח המודלף להיסטוריה).

## מבנה יעד
```
cards.html                    ← נקודת כניסה (טרם נוצרה — שלב 3)
cartomancy/
  ui/        → cards-app.js   (בקר UI וונילה — שלב 3)
  engine/    → פורט lib/*     (שלב 1) — כולל engine/knowledge/** ו-engine/spreads/**
  assets/cards/ → 52 SVG       (שלב 1)
  _test_cartomancy.mjs         ← מבחן מנוע (node)
```

### סטייה מהתוכנית המקורית (מתועדת)
בתוכנית דיברנו על הפרדת `data/` מ-`engine/`. בפועל שוכפל מבנה `lib/` **במלואו** תחת `cartomancy/engine/` (כולל `knowledge/` ו-`spreads/`). **סיבה:** שמירה 1:1 על נתיבי ה-import היחסיים של המקור (`./knowledge`, `../../types` וכו') → הפורט מכני, אפס שכתוב-נתיבים ידני, סיכון-שגיאה מינימלי. הפרדת data/engine נשארת אפשרות לעתיד אם תרצה.

## סטטוס שלבים
- [x] **שלב 0 — אבטחה + הכנת עץ יעד + מיזוג .gitignore** ← הושלם
- [x] **שלב 1 — פורט מנועים (TS→ES modules)** ← הושלם (41 מודולים, 52 SVG, מבחן עובר)
- [~] **שלב 2 — Backend AI** ← **נדחה בהחלטת המשתמש**: מנוע בלבד כרגע, בלי שרת. מסקנה דטרמיניסטית מהמנוע; PPF דרך `buildPPFEngineConclusion` (אופליין). חוזרים ל-AI בסוף עם המפתח המרוטט.
- [x] **שלב 3 — UI וונילה (cards.html + cards-app.js)** ← הושלם. מסכים: תפריט/קריאה-חדשה/תוצאה/ארכיון/לימוד. שומר Supabase כמו שאר העמודים. תמה Navy/Gold ממודרת תחת `.cards-root` (לא דולפת). מנוע three-card + PPF מחווטים; מסקנת-לקוח + אבחון-יועץ בשכבות נפרדות; דוח הדפסה B/W.
- [x] **שלב 4 — אינטגרציה בדשבורד** ← הושלם. אריח "🃏 המצפן הפנימי — קלפים" נוסף לתפריט `calculator.html` (ליד "גורל החול"), `location.href='cards.html'` — אותו דפוס ניווט קיים.
- [x] **שלב 5 — ניקוי + תיעוד + אימות** ← הושלם. הוסר `.gitkeep` מיותר; עודכן `OREN_APP_STRUCTURE.md §2.5` (המודול קיים) ו-`WORKPLAN.md #21`. אימות סופי: `node --check` נקי על כל 41+test, סריקת-שיבוש נקייה, מבחן מנוע עובר, הגשה סטטית 200. **פתוח:** בדיקת Playwright (לא מותקן), אימות מקור-נתונים, backend AI, רוטציית מפתח.

> **הערה על כלל "בלי framework/build":** התוצר המקומט הוא **וונילה טהורה** (ES modules, ללא build, ללא תלויות) — הכלל של CLAUDE.md נשמר בפועל. esbuild שימש ככלי-פיתוח חד-פעמי להסרת טיפוסים בלבד; אינו חלק מהריפו או מזמן-הריצה.

### אימות שלב 3
- `node --check` נקי · DOM-shim: הטעינה + render של התפריט בלי קריסה · חיווט מנוע three-card+PPF מפיק פלט · הגשה סטטית `python3 -m http.server` → 200 לכל הנכסים.
- **תיקון:** `buildPPFEngineConclusion`/`detectGroups` מקבלים את מבנה החלוקה הגולמי `{code, reversed}` ישירות (לא אובייקטי-קלף) — תוקן ב-`doReadPPF`.
- ⚠️ **בדיקת דפדפן אמיתית (Playwright, כנדרש ב-AGENTS.md) — ממתינה:** Playwright/chromium אינם מותקנים בסביבה הזו. צעדים ידניים: התחבר דרך `index.html` → נווט ל-`cards.html` → הנח 3 קלפים → "קרא את הפריסה" → ודא מסקנה עברית + "הפק דוח".

## 🔴 הוראות רוטציה + ניקוי למפתח Anthropic המודלף
המפתח `sk-ant-api03-...` נמצא ב-`inner-compass/.env.local` והוא git-tracked (מקומיט). לביצוע בריפו `inner-compass`:
1. **לבטל** את המפתח בקונסולת Anthropic וליצור מפתח חדש. (פעולה ידנית של המשתמש.)
2. הסרה מהאינדקס + הגנה עתידית:
   ```bash
   cd inner-compass
   git rm --cached .env.local inner-compass.zip
   printf '\n.env*\n*.zip\n' >> .gitignore
   git commit -m "chore: stop tracking secrets and heavy snapshot"
   ```
3. **ניקוי היסטוריה** (המפתח כבר בהיסטוריה):
   ```bash
   git filter-repo --path .env.local --invert-paths   # או BFG
   git push --force origin main
   ```
   לוודא שגם `inner-compass.zip` אינו מכיל את המפתח (אם כן — לנקות גם אותו).
4. המפתח החדש חי **רק** כ-secret ב-Supabase Edge Function (שלב 2). לעולם לא בקומיט.

> הערה: הרוטציה, מחיקת ההיסטוריה וה-force-push הן פעולות של המשתמש בריפו `inner-compass` — אינן חלק מהשינויים בריפו `hall-of-wisdom`.

## מזהי-קלף (לשמירה על סנכרון בשלב 1)
`"9♥"` (מזהה/state) ↔ `9_of_hearts.svg` (קובץ) ↔ `"9H"` (מפתח-ידע, דרך normalize: ♠→S ♣→C ♥→H ♦→D).
