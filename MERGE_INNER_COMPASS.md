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
  engine/    → פורט lib/*     (שלב 1)
  data/      → knowledge/*     (שלב 1)
  assets/cards/ → 52 SVG       (שלב 1)
```

## סטטוס שלבים
- [x] **שלב 0 — אבטחה + הכנת עץ יעד + מיזוג .gitignore** ← הושלם
- [ ] שלב 1 — פורט מנועים (TS→ES modules)
- [ ] שלב 2 — Backend AI (Supabase Edge Function)
- [ ] שלב 3 — UI וונילה (cards.html + cards-app.js)
- [ ] שלב 4 — אינטגרציה בדשבורד
- [ ] שלב 5 — ניקוי + תיעוד + אימות

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
