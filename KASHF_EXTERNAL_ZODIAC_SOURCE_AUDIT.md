# ביקורת מקור חיצוני — zodiacHebrew ב-kashf-figure-names.js

**מסמך תיעוד בלבד. אין המלצה מוכרעת. אין שינוי UI במסגרת מסמך זה.**

---

## הממצא

`zodiacHebrew` (מזל בודד — 1 מתוך 12 — לכל אחת מ-16 הצורות) **מקורו אינו כשף אל-אסראר.**

מקור-הנתונים המתועד **בראש הקובץ עצמו** (`goral-hachol/data/sources/kashf-al-asrar/kashf-figure-names.js:1-6`):
```
// Sources:
//   كشف الأسرار المصونة في اخراج الضمائر المخزونة, pages 43-67
//     → fortuneHebrew, movementHebrew, elementHebrew, compassDirection, gender, time,
//       weight, purity, zodiacPosition, seekerStatus, seekerSought
//   Ramal Shastra (Marathi), page 38
//     → zodiacHebrew (מזל), ichchhaHebrew (אופי: מזין/מחזק)
```

**שני שדות — `zodiacHebrew` ו-`ichchhaHebrew` — מיוחסים במפורש לספר "Ramal Shastra" (מרתי), עמוד 38.** זהו ספר גיאומנטיה הודי, נפרד לחלוטין מכשף אל-אסראר. כל שאר 11 השדות ברשומה (`fortuneHebrew`, `movementHebrew`, `elementHebrew`, `compassDirection`, `genderHebrew`, `timeHebrew`, `weightHebrew`, `purityHebrew`, `zodiacPosition`, `seekerStatus`, `seekerSoughtHebrew`) — כן ממקור כשף, עמ' 43-67.

**כל 16 הרשומות בקובץ נושאות אותו `sourceStatus: 'explicit-in-source'` גורף** — דגל בודד שאינו מבחין בין השדות-הכשפיים לשני השדות ממקור-אחר לגמרי. אין אזכור נוסף ל-"Ramal Shastra" בשום מקום אחר בפרויקט (נבדק: חיפוש מלא בכל הריפו).

---

## היכן זה מופיע כיום

- **`kashf-figure-names.js`** — מקור הנתונים, `HAWI_FIGURE_NAMES` (השם הפנימי של הקובץ, על אף שהוא נמצא בתיקיית `kashf-al-asrar`).
- **מוצג בפועל ב-UI**, לפי `WORKPLAN.md:200`: `buildBoardAnalysis` מעשיר **כל** בית מוצג (דיין, שני עדים, בית 1, בית מרכזי — בכל נושא, בכל קריאת חאווי) ב"מזל/אופי/מצב-מחפש-מבוקש" מתוך קובץ זה, ומוצג צמוד ישירות לטקסט המתויג "חאוי: ..." — **ללא שום אבחנה חזותית**. עד למסמך זה, ה-WORKPLAN הקודם כבר סימן בעיה חלקית ("Kashf sourceStatus, לא Hawi") — אך **לא זיהה** שחלק מהנתון גם אינו-כשף בכלל (Ramal Shastra). זו שכבת-בעיה נוספת, עמוקה יותר, שלא תועדה קודם.
- **המנוע החדש** (`raml-data/raml-seasonal-astro-profile-engine.js`, נבנה במסגרת המשימה הנוכחית) **אינו** משתמש ב-`zodiacHebrew` או ב-`kashf-figure-names.js` בשום צורה — אומת גם ב-grep על קוד-המקור וגם בבדיקה אוטומטית (`tests/raml-seasonal-astro-profile-engine.test.js`, סעיף 9).

---

## מדוע אין להשתמש בו כמקור כשף

1. תיוג-המקור **בקובץ עצמו** קובע חד-משמעית: Ramal Shastra, לא כשף אל-אסראר.
2. הפרויקט הזה (לפי CLAUDE.md ולפי התיחום המפורש שנקבע לשיחה הזו: "אנחנו עובדים כעת על מנוע הכשף... בלבד") דורש שכל נתון-פרשני יתחקה למקור מפורש וספציפי — ואסור לערבב ספרים ללא אישור.
3. `sourceStatus: 'explicit-in-source'` הגורף מטעה: הוא נכון לחלק מהשדות ברשומה, אך לא לכולם, ואין דרך להבחין ביניהם בלי לקרוא את הערת-הכותרת.

---

## החלטות עתידיות אפשריות (לא מוכרעות כאן)

| אפשרות | תיאור |
|---|---|
| **A. הסרה** | הסרת `zodiacHebrew`/`ichchhaHebrew` מהתצוגה ומהמבנה, או סימונם `sourceStatus: 'not-yet-found-in-current-code-search'` עד שיימצא מקור-כשף חלופי. |
| **B. הצגה כמקור חיצוני** | שמירה, אך עם תיוג-שדה נפרד ומפורש ("Ramal Shastra — לא כשף") בכל מקום שבו הנתון מוצג, בהתאם לקטגוריית "Quoted External Opinion" מכלל "Practical Algorithm Selection Rule" שכבר אומץ ל-backlog. |
| **C. שמירה רק במצב לימודי** | הסתרה מהתצוגה הרגילה/מהמסקנה, שמירה רק בתצוגת-לימוד/מחקר נפרדת המיועדת לחוקרי-הספר, לא לתשובה לשואל. |
| **D. אימות מחדש מול מקור כשף** | חיפוש-מקור ייעודי בכשף אל-אסראר עצמו לתוכן-מזל-לצורה, ואם יימצא — החלפת הנתון (לא מיזוגו) במקור-כשף מאומת. |

---

## אישור סיום
- לא בוצע שינוי UI כלשהו במסגרת מסמך זה.
- לא בוצעה הכרעה — 4 האפשרויות מוצגות לבחירתך.
- לא נערך `kashf-figure-names.js`.
