# תוכנית עבודה — גורל החול
> **הוראה חשובה:** כשמשימה הושלמה — מחק אותה מהקובץ הזה וקומיט. לא לסמן V — למחוק.

> ענף: `claude/app-cleanup-organization-mia9b2` | עודכן: 2026-06-14

---

## 🔴 קריטי — מנוע המסקנות

### 1. השלמת נתוני figure-states חסרים (2 בתים)
- כל 16 הצורות רשומות ✓ — אך **חיין** (1211) ו**ממון נכנס** (2121) חסרים כל אחד **בית אחד** עם `not-yet-found`
- מקור: חאוי — פרק מצבי הצורות (Drive ID: `1SZ3rxN2AKLeD8ExRoToj67WKr6DIViZR`)
- מיקום: `goral-hachol/data/sources/hawi/figure-states/hawi-figure-state-hayyan.js` ו-`hawi-figure-state-naqi-khad.js`

### 2. השלמת נתוני figure×house חסרים
- יש בתים שמסומנים `sourceStatus: "not-yet-found-in-current-code-search"`
- לכל צורה×בית חסר: להוריד מ-Drive את ספר חאוי ולמצוא את הפסקה המדויקת
- מיקום: `goral-hachol/data/sources/hawi/figure-transits/`

### 3. מסקנות עם "הכוחות בלתי-מוכרעים" — לוגיקת הכרעה
- הסיבה: צורות מג'סד (50% מכלל הצורות) אינן מניבות כיוון (דאח'ל/ח'ארג'), ולכן ניתוח התמיכה אומר "ניטרלי" — גם כשהדיין ברור
- הוסר ההודעה הכפולה ✓ — ה-kashf block כבר מציג את ה"ניטרלי" פעם אחת
- נשאר: לשפר את `computeConfidence` ב-`kashf-support-analyzer.js` — כאשר כל הצורות מג'סד, להשתמש במזל (סעד/נחס) כמדד חלופי
- מיקום: `goral-hachol/engine/kashf-support-analyzer.js`

---

## 🟠 חשוב — נושאים חסרים

### 4. birthNativity — לידה ומנהיגות
- מסגרת קיימת אך ריקה מתוכן
- מקור: ספר חאוי / כשף אל-אסראר
- מיקום: `goral-hachol/data/sources/hawi/birth-nativity/`

### 5. yearlyForecast — תחזית שנתית
- מיושם חלקית, מסקנות חלשות
- מקור: ספרי הרמל — פרק תחזית שנתית
- מיקום: `goral-hachol/data/sources/hawi/yearly-forecast/`

### 6. הצגת birthNativity ו-yearlyForecast בגריד הבחירה
- הנושאים קיימים בקוד אך לא נגישים למשתמש
- מיקום: `goral-hachol/ui/goral-app.js` → TOPIC_CARDS

---

## 🟡 שיפורים למנוע

### 7. שיטת 7×7 (אסקאט) — 49 צורות
- שיטה מתקדמת שלא ממומשת כלל
- מקור: `كتاب القول الجامع في علم الرمل` — Drive ID: `1oze2_qY4Esmd8rlGwc59f-WuWf-OktO5`
- תכנון נדרש לפני מימוש

### 8. אבחון לידה ונטיביטי — בית הלידה
- חישוב בית הלידה לפי תאריך + צורות
- מיקום: `goral-hachol/engine/hawi-interpreter.js`

### 9. עיתוי מדויק (תזמון האדד)
- כרגע מחשב ימים/חודשים/שנים אך לא מחובר ללוח הירחי האסלאמי
- דרוש: מימוש לוח ירחי

---

## 🔵 שיפורי UI/UX

### 10. תיבת שאלת הלקוח — מרכוז וסגנון
- תיבת הטקסט עדיין נראית גדולה יחסית בפורטרייט

### 12. כפתורי פרופיל — אינדיקציה לבחירה פעילה
- כשטוענים פרופיל שמור, הכפתורים לא מוצגים כ-selected

---

## 🟢 ביקורת מקורות (audit)

### 13. בדיקת כל שדות sourceStatus = "not-yet-found"
- להוריד דפים רלוונטיים מ-Drive ולמלא או לסמן כ-"explicitly-not-shown"
- מיקום: כל קבצי הנתונים ב-`goral-hachol/data/sources/`

### 14. אימות פסיקות Kashf al-Asrar
- פסיקות רבות בקוד מגיעות מזיכרון — לאמת מול הספר הממוספר
- מיקום: `goral-hachol/engine/goral-conclusion-writer.js`

---

## הנחיות לצ'אטים חדשים
- **ענף עבודה:** `claude/app-cleanup-organization-mia9b2` בלבד
- **לפני כל עבודה:** בדוק `git branch` ו-`git status`
- **משימה הושלמה:** מחק אותה מקובץ זה וקומיט
- **אין להמציא נתונים** — אם מקור חסר, השאר ריק עם sourceStatus: "not-yet-found"
