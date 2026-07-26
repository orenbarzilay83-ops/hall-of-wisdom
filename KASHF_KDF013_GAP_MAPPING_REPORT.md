# KDF-013 — מיפוי פערים בין המימוש החי למפרט האלגוריתם המשוחזר (17 שלבים)

**Research Status:** Temporarily Paused
**Reason:** unresolved second-cycle walk convention (start-house/direction for the repeated walk stage)
**Implementation Status:** do not implement yet — active engine (`illness.altFormula`) unchanged, no `Experimental_KDF013_Reconstruction` file created

---

## מצב בזמן הכתיבה
- **Branch:** `claude/app-cleanup-organization-mia9b2`
- **HEAD בזמן הכתיבה:** `36d17dcad8e006c5d0b4f2273fe5023f4182bd90`

---

## 1. קבצים קיימים בפרויקט הנוגעים ל-KDF-013

בריפו עצמו — אף קובץ לא הכיל את המזהה "KDF-013" בשום צורה עד למסמך זה. הקובץ הרלוונטי היחיד הוא המימוש-הקיים עצמו, ללא תיוג-KDF:

- **`goral-hachol/engine/kashf-topic-rules.js`** — `illness.altFormula` (המימוש החי היחיד שנוגע לחוק הזה)
- **`goral-hachol/engine/kashf-formula-engine.js`** — `combineHouses` (המנוע שמפעיל אותו)
- **`goral-hachol/engine/kashf-reading-engine.js`** — `executeFormula`/`getFormulaPrimaryVerdict` (הדיספצ'ר)
- **`goral-hachol/engine/kashf-book-additions.js`** — לא נוגע ל-illness ישירות, אך מכיל helper רלוונטי (`walkToDurationHouse`, `PILLAR_HOUSES_SET`/`SUCCEDENT_HOUSES_SET`/`CADENT_HOUSES_SET`)
- **`goral-hachol/data/sources/kashf-al-asrar/kashf-shibutzim.js`** — `SHIBUTZ_2_CANONICAL_NUMBER` (הטבלה שכבר אומתה מול הערבית)
- **`WORKPLAN.md`** — מזכיר את `illness` פעם אחת, אך רק בנוגע לתיקון-באג ישן בטבלת "האיבר הכואב" (`body-part`), לא קשור לשרשרת מספר-16/12

**מסקנה:** לא היה תיעוד-KDF-013 קבוע בפרויקט עצמו עד למסמך זה. כל הידע התקיים רק בהיסטוריית-הצ'אט.

---

## 2. מה המימוש הקיים עושה כיום

```js
altFormula: {
  type: 'combine',
  houses: [6, 8],
  interpretBy: 'saad-nahs',
  sourceText: 'הכה את הצורה השישית בצורת השמיני — ודון בתוצאה.',
  verdictBySaadNahs: {
    saad:  { text: 'שילוב ו-ח מיטיב — פחות סכנה', positive: true },
    nahs:  { text: 'שילוב ו-ח מזיק — יש סכנה', positive: false },
    mixed: { text: 'שילוב ו-ח ממוזג', positive: null },
  },
},
```

זרימה בפועל: `combineHouses(board,[6,8])` → `classifyPattern` (מיטיב/מזיק/ממוזג) → מיפוי-טקסט ישיר → מוצג בפאנל "בדיקת אימות נוספת". **זהו בדיוק שלב 1 מתוך ~17 השלבים במפרט המשוחזר.** שום דבר מעבר לזה לא קיים: אין חישוב-מספר, אין השמטת-16/12, אין הליכה-על-בתים, אין מחזור-חוזר, אין השוואת-שאריות, אין הכאה שנייה, אין איתור-בלוח, ואין סיווג יתד/עוקב/נופל.

---

## 3. סתירות בין המימוש הקיים למפרט המשוחזר

| # | המימוש הקיים | המפרט המשוחזר | סתירה |
|---|---|---|---|
| 1 | תוצאת combine(6,8) בלבד | תחילת שרשרת בת ~8 שלבי-חישוב | מבני מלא — 1 מתוך ~17 שלבים ממומש |
| 2 | סיווג saad/nahs (מיטיב/מזיק/ממוזג) של patternA ישירות | סיווג יתד/עוקב/נופל של הצורה הסופית אחרי כל השרשרת, ממוקמת בפועל בלוח | ציר-סיווג שונה לגמרי — לא רק "חסר שלבים", אלא סוג-הפלט עצמו שונה |
| 3 | אין מושג "מספר צורה" בשום מקום בקוד ל-illness | שלב מרכזי: "חישוב מספר הצורה היוצאת" | חסר לחלוטין (יש טבלה מוכנה — `SHIBUTZ_2_CANONICAL_NUMBER` — אך לא מחוברת) |
| 4 | אין helper מחובר להליכה-על-בתים ל-illness | 3 שלבי-הליכה נפרדים (מחזור ראשי, צורה א', צורה ב') | חסר; קיים helper-דומה (`walkToDurationHouse`) אך למוסכמה אחרת ולנושא אחר |
| 5 | אין "איתור צורה בלוח" | שלב מפורש: "איתור הצורה היוצאת בלוח" | חסר; יש תקדים-דפוס דומה ב-`computeDhamirDoubledSquare`, `computeDhamirJawharayn`, `resolveMizanPoint` |
| 6 | `sourceText` הנוכחי מצטט רק את המשפט הראשון בלבד | המפרט מבוסס על כל הפסקה, כולל ההמשך בעמ' 199 | ה-`sourceText` הקיים מטעה מבחינת-שלמות |
| 7 | `sourceStatus`/verdict לא מסומן VERIFIED/RECONSTRUCTED לפי-שלב | כלל 6 של המפרט דורש תיוג לכל שלב | לא קיים מבנה כזה כלל היום |

---

## 4. פרטים שעדיין חסרים ל-Golden Test מלא

**הפער הגדול-ביותר:** בית-התחלה וכיוון ל"הליכה על בתי הלוח" (ראה מסמכי המשך המחקר — `KASHF_KDF013_WALK_CONVENTION_RESEARCH_REPORT.md` ו-`KASHF_KDF013_SECOND_CYCLE_PRECEDENT_REPORT.md`).

רשימה מלאה של הפרטים החסרים:

1. בית-התחלה להליכה (בכל 3 המופעים).
2. כיוון ההליכה (קדימה/אחורה).
3. האם שלושת ההליכות (מחזור ראשי, צורה א', צורה ב') חולקות אותה מוסכמת בית-התחלה/כיוון, או שכל אחת שונה?
4. **נסגר:** "מספר הצורה" = `SHIBUTZ_2_CANONICAL_NUMBER.number` (1-136), לפי הכרעת אורן משה — לא `.position` (1-16).
5. תנאי-עצירה למחזור — כמה סבבים בדיוק?
6. "כל התוצאות" בשלב "השמטת 12 מכל התוצאות" — רשימה מדויקת.
7. מקרה שהצורה הסופית אינה מופיעה בפועל באף אחד מ-16 בתי הלוח הספציפי — לא מכוסה במפרט.
8. "עוקב" (המונח החדש) מול "סמוך ליתד" (המונח הקודם/`SUCCEDENT_HOUSES_SET`) — דורש הכרעת-שם-סופית לקוד.
9. טיפול-שוויון — מוגדר עקרונית (`tie_requires_source_rule`), אין עדיין כלל-מקור לבדוק מולו מתי בדיוק זה קורה (זה בסדר, במכוון).

---

## אישור סיום
לא שונה שום קובץ בקוד החי, לא נוצר קובץ ניסיוני, לא נכתב שום קוד. מסמך זה הוא תיעוד-מחקר בלבד.
