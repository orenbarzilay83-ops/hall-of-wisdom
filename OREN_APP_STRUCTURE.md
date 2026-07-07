# OREN_APP_STRUCTURE — מבנה האפליקציה של אורן משה

> מסמך תשתית עבור מפקח-הבינה (AI Supervisor) וכל סוכן-קוד. מתעד את **המצב הקיים בפועל** בקוד, נכון ל-2026-07-07. מסמך זה אינו משנה התנהגות — הוא תיעוד בלבד.
> המסמך המחייב לכללי-עבודה הוא `CLAUDE.md` בשורש הריפו. בכל סתירה — `CLAUDE.md` גובר.

---

## 1. נקודות כניסה (HTML — האפליקציה סטטית, ללא build, ללא framework)

| קובץ | תפקיד |
|---|---|
| `index.html` | מסך כניסה (ברירת מחדל: oren moshe / 1983) |
| `calculator.html` | דשבורד ראשי — כלי הייעוץ הנומרולוגי |
| `goral-hachol.html` | **המוצר המרכזי** — גורל החול (רמל), שתי שיטות קריאה |
| `myseal.html` | חותם אישי / קמעות |
| `ramal-shastra.html` | ראמאל שסטרה |
| `kashf-al-asrar.html` | ספר כשף אל-אסרר המתורגם (276 עמ') — קריאה/עיון |
| `goral-hachol-new.html` | גרסה ניסיונית — לא בשימוש חי |

## 2. מודולים ראשיים

### 2.1 גורל החול (goral-hachol.html) — המוצר המרכזי
שתי שיטות קריאה **נפרדות לחלוטין** (הופרדו בפרויקט ארכיטקטורה במהלך 2026-07):
- **שיטת חאווי** — קריאת לוח מלאה, 16 בתים, דיין/עדים/דמיר.
- **חשיפת הסודות הנצורים (כשף אל-אסרר)** — שיטה נוסחתית: נוסחה ראשית + נוסחת-אימות + בדיקות תומכות לכל נושא.

בנוסף בתוך אותו קובץ: גורל חולי 7×7 (איסקאט), קישור לראמאל שסטרה, לוח קונדלי (קומילה — אסטרולוגיה ודית), יומן/ארכיון לקוחות, מסך תפילה, מבוא.

### 2.2 דשבורד (calculator.html)
מערכת ייעוץ נומרולוגית, **גורל העשיריות**, מחשבון זוגיות, חיבור הורים-ילדים, מחשבון פרק תהילים אישי, מחשבון גימטריה, **יומן לקוחות**.

### 2.3 ארכיון לקוחות
- `goral-hachol/engine/goral-client-archive.js` + `window.GORAL_CLIENT_ARCHIVE` — שמירת קריאות והיסטוריית לקוח, מוזן חזרה לקריאות (`clientHistorySummary`).
- persistence: `localStorage` בלבד.

### 2.4 דוחות / מסקנות (השכבה שבבנייה מחדש)
ראו סעיף 4 — זרימת הנתונים.

### 2.5 מודול קלפים (Cartomancy)
**לא קיים בקוד הנוכחי.** אם מתוכנן — יש להוסיף כמודול חדש באישור אורן משה, לא לתעד אותו כקיים.

## 3. מנועים קיימים

| מנוע | קבצים מרכזיים | תפקיד |
|---|---|---|
| ייצור לוח רמל | `raml.js` (`ramlRunReading`), `goral-hachol/engine/raml-board-generator.js`, `raml-figures.js`, `raml-board.js` | 4 אמהות → 16 בתים. מתמטיקה משותפת לשתי השיטות. |
| פרשנות חאווי | `goral-hachol/engine/hawi-interpreter.js` (~3,000 שורות) | ניתוח לוח: דיין, עדים, דמיר, תחסיל, ניקוד (`scoreBoard`, `buildJudgeVerdict`) |
| מסקנות חאווי | `goral-hachol/engine/goral-conclusion-writer.js` (~2,900 שורות) | `writeClientReadingHebrew` (📖 קרא ללקוח), `writeHumanGoralConclusion` (פירוט), `writeShortClientVerdict` |
| קריאת כשף | `goral-hachol/engine/kashf-reading-engine.js` (`buildKashfReading`), `kashf-topic-rules.js`, `kashf-formula-engine.js`, `kashf-figure-classifier.js`, `kashf-dhamir.js`, `kashf-pending-extraction.js` | נוסחאות לפי נושא (29 נושאים), דמיר (5 שיטות מאומתות-מקור), בדיקות תומכות |
| נרטיב כשף | `goral-hachol/engine/kashf-narrative-writer.js` (`writeKashfReading`) | תיבת תשובה + קרא-ללקוח + פאנל פירוט |
| **שכבת סינתזה (חדשה, בבנייה)** | `goral-hachol/engine/narrative-fact-phrasing.js` | בניית משפט מהעובדה הספציפית (צורה+מהות+פסיקה) במקום משפט-קבוע-לפי-פולריות; יישוב סתירות מפורש ("יחד עם זאת", "אך פסיקתה ממוזגת-מיטיבה") |
| אבחון רוחני | `goral-spiritual-diagnostics-engine.js` (כולל `applyIsqatSevenMethod`) | עין הרע, כישוף, ג'ין — לפי מקורות |
| קורא ספר כשף | `kashf-book-reader.js`, `kashf-chapter-map.js` | עיון בספר המובנה (`kashf-al-asrar-book.js`, 13,577 שורות) |

**קוד מת ידוע (לא לגעת בלי אישור, לא להסתמך עליו):** `raml-interpreter.js` + `goral-hachol/ui/goral-hachol-ui.js` — לא נטענים מ-goral-hachol.html (רק מ-goral-hachol-test.html). מועמדים למחיקה עתידית באישור.

## 4. זרימת נתונים (goral-hachol, המסלול החי)

```
goral-hachol/ui/goral-app.js  (runReading — נטען מ-goral-hachol.html)
  → window.ramlRunReading(question, mothers)            [raml.js — בניית 16 בתים]
  ├─ מצב חאווי:
  │    → HAWI_INTERPRETER.interpretHawiQuestionInitial   [hawi-interpreter.js]
  │        → scoreBoard / buildJudgeVerdict              [הדיין = הפסיקה הראשית]
  │        → writeClientReadingHebrew                    [goral-conclusion-writer.js → 📖 קרא ללקוח]
  │        → writeHumanGoralConclusion                   [→ פאנל "קרא עוד"]
  └─ מצב כשף:
       → KASHF_ENGINE.buildKashfReading(board, kashfTopicId, ctx)   [שדה עצמאי בשאלון — לא תלוי בחאווי]
           → נוסחה ראשית + אימות + supportingFindings + dhamir
       → KASHF_ENGINE.writeKashfReading                  [kashf-narrative-writer.js]
```

סיווג שאלות: `goral-hachol/ui/question-bank.js` — 138 שאלות, לכל אחת `topicId` (חאווי) **ו-`kashfTopicId` עצמאי** (כשף). אין תרגום ביניהם בזמן-ריצה.

## 5. שכבת הידע (מקורות)

- `goral-hachol/data/sources/hawi/` — transits (16 קבצים), figure-states (14), question-rules (25+), foundations.
- `goral-hachol/data/sources/kashf-al-asrar/` — הספר המלא, טבלאות שערים 2-5, שיבוצים, נושאי-בתים.
- `goral-hachol/data/sources/al-falak-al-mashhun/` — **מקור חיצוני משלים** (שער 4 סוג 4 בלבד), משולב באישור מפורש עם גילוי מלא. לא כשף.
- מערכת `sourceStatus` על כל רשומה — ראו CLAUDE.md לטבלת הערכים המלאה. **לעולם לא ממלאים פער-מקור בניחוש.**

## 6. כללים קריטיים שאסור להפר

1. **אין להמציא נתונים פרשניים** — כל טענה חייבת להתחקות למקור ספציפי (ספר/עמוד). פער-מקור = ריק + `sourceStatus: "not-yet-found-in-current-code-search"`.
2. **אין לשנות מנועי-חישוב בלי אישור מפורש של אורן משה.**
3. **אין לעצב מחדש UI אלא אם התבקש במפורש.** ערכת Navy/Gold, RTL עברית.
4. **בגורל החול — סדר הלוח מימין לשמאל חובה:** בית 1 בצד ימין. המנוע שומר סדר חישובי 1–16; התצוגה הופכת.
5. **שמירה על ידע רוחני/אוקולטי ממוקור:** אין לרכך, לצנזר או להסיר תוכן כמו כישוף, עין הרע, קנאה, חסימה רוחנית, מס, ג'ין, שדים, רוחות, קללות — כשהוא קיים בידע-המקור המאושר. עידון מותר **רק בשכבת ניסוח-ללקוח**, לעולם לא באבחון-היועץ ולא בשכבת הנתונים.
6. **הפרדת שכבות מסקנה:** אבחון-יועץ ≠ נוסח-ללקוח (ראו `OREN_CONCLUSION_STYLE_SPEC.md`).
7. **הפרדת שיטות:** אין דליפה בין חאווי לכשף (הופרדו במאמץ רב — אין לערבב חזרה). מקור חיצוני (כמו אל-פלק) מוצג תמיד עם גילוי, לעולם לא כתוכן-כשף.
8. **אין לגעת ב-`kashf-figure-appearance.js`** (הוראת אורן משה מפורשת).
9. **בלי ציטוטי-עמוד, "מקור:", או ערבית בטקסט המוצג ללקוח** — המקור נשאר בקוד (`sourceRef`/`sourceText`), לא במסך. (נאכף החל מ-PR #16-#17.)
10. **ענף עבודה יחיד:** `claude/app-cleanup-organization-mia9b2`. קומיט+פוש אחרי כל שינוי. אין דחיפה ל-main בלי הוראה.
11. **סתירות בין ממצאים מוצגות במפורש** ("יחד עם זאת"), לא בשקט (נאכף החל מ-PR #18-#19).
