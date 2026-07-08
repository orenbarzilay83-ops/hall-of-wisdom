# KASHF_CLIENT_CONTEXT_FIELDS_AUDIT — ביקורת מצומצמת: שדות פרטי-לקוח בפועל

> **מסמך ביקורת בלבד. לא נכתב/שונה קוד, לא שונה HTML/מנוע, לא נוצר Context Collector, לא חוברה לשון-העניין, לא חובר AI חי, לא נוסף secret, לא בוצע deploy, לא נוצר storage/database/embeddings, לא נוצר UI, לא נגע ב-`inner-compass`. לא בוצע commit/push — רק יצירת הקובץ.**
> תאריך: 2026-07-08. ממשיך את `KASHF_CONTEXT_AWARE_FINAL_SYNTHESIS_SPEC.md` (מאושר, `0ab4654`) — בדיקה מדויקת של המבנה בפועל לפני בניית Context Collector.

---

## 1. `profileState.marital`

- **מוגדר ב:** `goral-hachol/ui/goral-app.js:15` (`let profileState = { gender: null, marital: null, work: null, children: null };`), נקרא ע"י לחיצה על כפתור ב-`goral-app.js:1352-1364` (מאזין כללי `.profile-btn`).
- **הכפתורים בפועל (`goral-hachol.html:2971-2974`):**
  | `data-value` | טקסט עברי מוצג |
  |---|---|
  | `married` | נשוי/אה |
  | `single` | רווק/ה |
  | `divorced` | גרוש/ה |
  | `widowed` | אלמן/ה |
- **ערך ריק/לא-ידוע:** אין ערך-מחרוזת נפרד ל"לא ידוע". ברירת-המחדל היא `null` (לפני כל לחיצה). **חשוב:** הלחיצה היא toggle — לחיצה שנייה על כפתור שכבר נבחר מחזירה את הערך ל-`null` (`goral-app.js:1357-1358`), כך ש-`null` מייצג גם "מעולם לא נענה" וגם "הוסר במפורש" — אין דרך להבחין ביניהם בקוד.

## 2. `profileState.work`

- **מוגדר ב:** אותו מנגנון בדיוק (`goral-app.js:15`, `1352-1364`).
- **הכפתורים בפועל (`goral-hachol.html:2983-2986`):**
  | `data-value` | טקסט עברי מוצג |
  |---|---|
  | `employed` | שכיר |
  | `unemployed` | מחפש |
  | `self` | עצמאי |
  | `retired` | פנסיה |
- **הבחנה שכיר/עצמאי/בעל-עסק/לא-עובד/אחר:** **חלקית בלבד.** יש הבחנה בין שכיר (`employed`) לעצמאי (`self`), אבל **אין ערך נפרד ל"בעל עסק"** (יכול להיות תחת `self` או לא מיוצג כלל), ו-`unemployed` מתויג "מחפש" (משתמע: מחפש עבודה) ולא "לא עובד" באופן כללי (למשל גמלאי-שלא-מחפש, הורה-שאינו-בשוק-העבודה וכו' — לא מכוסים). אין ערך "אחר".

## 3. `profileState.children`

- **מוגדר ב:** אותו מנגנון (`goral-app.js:15`, `1352-1364`).
- **הכפתורים בפועל (`goral-hachol.html:2978-2979`):**
  | `data-value` | טקסט עברי מוצג |
  |---|---|
  | `yes` | יש ילדים |
  | `no` | אין ילדים |
- **סוג הערך:** מחרוזת (`'yes'`/`'no'`), **לא boolean אמיתי** — אך פונקציונלית מתפקד כבינארי.
- **"אין ילדים" מול "לא ידוע":** **כן, ניתן להבחין** — `'no'` = נבחר במפורש "אין ילדים"; `null` = לא נענה כלל (או הוסר). זה שונה מ-`marital`/`work` רק בכך שיש כאן שני ערכים בלבד, אז ההבחנה `null` מול `'no'` ברורה-יותר, אך עדיין קיימת אותה בעיית-toggle (סעיף 1) — לחיצה חוזרת על "אין ילדים" מבטלת אותו בחזרה ל-`null`.

## 4. שדות נוספים ב-`getClientContext()` (`goral-app.js:627-650`)

| שדה | מקור | הערה |
|---|---|---|
| `clientName` | `#clientNameInput` | טקסט חופשי |
| `parentName` | `#clientParentInput` | טקסט חופשי ("שם האב/אם") |
| `phone` | `#clientPhoneInput` | טקסט חופשי |
| `questionDate`, `questionTime` | inputs | תאריך/שעת השאלה |
| `quesitedName` | `#quesitedNameInput` | שם "הנשאל עליו" (כשהשאלה היא על אדם שלישי) |
| `consultationContext` | — | **מוגדר תמיד כמחרוזת ריקה `""`** — קיים כשדה במבנה אך אינו נאסף בפועל משום מקום בקוד |
| `topicOverride`, `selectedHouse` | state | מזהי-נושא/בית פנימיים, לא "פרטי-לקוח" אנושיים |
| `gender`, `maritalStatus`, `workStatus`, `hasChildren` | `profileState` | ראו סעיפים 1-3 |
| שדות דינמיים (`dynField_*`) | `selectedQuestion.clientFields` (מ-`question-bank.js`) | טקסט חופשי ספציפי-לנושא, למשל `matter` (מהות הענין), `symptoms`/`duration`/`treatment` (לנושאי בריאות), `promiseDesc`, `dreamDesc`, `birthDate`, `newCity`, `msgFrom`, `yearForecast` — **תוכן-חופשי אמיתי שהלקוח מקליד, לא select קבוע** |
| **`age`** | **אינו קיים בפועל** | ⚠ ממצא נוסף: הקוד ב-`goral-app.js:1158` כותב `age: _ctx.age || ''`, אך `getClientContext()` **מעולם לא בונה שדה `age`** (אין `document.getElementById("ageInput")` או דומה בשום מקום בקובץ). כלומר `clientCtx.age` המועבר ל-Kashf הוא **תמיד `''`** — לא רק "נשמט", אלא לא קיים כלל היום באפליקציה. |

## 5. `clientHistorySummary`

- **מחושב ב:** `goral-app.js:1126-1130`, קורא ל-`window.GORAL_CLIENT_ARCHIVE.summarizeGoralClientHistory(clientName)` (`goral-hachol/engine/goral-client-archive.js:90-135`).
- **מבנה:** **אובייקט**, לא מחרוזת: `{ clientName, total, summaryHebrew, repeatedTopics: [{topic, count}], repeatedSpiritualFlags: [{grade, count}] }`. `summaryHebrew` הוא המחרוזת-התמציתית (לדוגמה: `"נמצאו 3 קריאות קודמות ללקוח זה. כדאי לבדוק דפוסים חוזרים..."`).
- **מקור הנתונים:** `getGoralClientHistory(clientName)` מסנן את `localStorage` (`goralHacholClientReadingsArchive_v1_<uid>`) לפי **התאמת-מחרוזת מדויקת** (אחרי `trim()` בלבד — לא fuzzy, רגיש לרווחים/כתיב) על `clientName`.
- **⚠ ממצא קריטי חדש, לא צוין קודם:** `saveGoralReadingToArchive` (השמירה בפועל לארכיון) נקראת **רק** בתוך `buildInterpretationHtml()` (`goral-app.js:887-889`), ופונקציה זו נקראת **רק בענף חאווי** (`goral-app.js:1175`). ענף כשף (`goral-app.js:1136-1172`) **חוזר (`return`) לפני** שהוא מגיע ל-`buildInterpretationHtml` — כלומר **קריאות כשף מעולם לא נשמרות לארכיון הלקוח**. המשמעות: גם אם `clientHistorySummary` יחובר ל-Kashf מחר, הוא ישקף **רק היסטוריית-חאווי** של הלקוח (אם קיימת) — לא היסטוריית-כשף, כי כזו אינה נאספת כלל כרגע.
- **בטיחות לשימוש במסקנה:** `summaryHebrew` הוא נגזרת-סטטיסטית (ספירת נושאים/דגלים חוזרים) — לא ציטוט מקור, לא "ידע-ספר" — לכן אין כאן סיכון של "המצאת-נתונים" מבחינת `sourceStatus`, אך יש סיכון-דיוק אחר: מכיוון שההתאמה היא לפי שם מדויק, לקוח עם רישום שם לא-עקבי (למשל "אבי" מול "אבי כהן") יקבל היסטוריה חלקית/שגויה מבלי אינדיקציה לכך.
- **מתאים ליועץ בלבד או גם ללקוח:** `repeatedSpiritualFlags` (המבוסס על `spiritualDiagnosis.grade`, אבחון-רוחני מחאווי) — **ליועץ בלבד**, לא לניסוח-ישיר-ללקוח (רגיש). `repeatedTopics` ו-`summaryHebrew` הכללי — יכולים לשמש כרקע-ליועץ לניסוח עדין, אך גם הם **לא** צריכים להיכתב מילה-במילה ללקוח (העיקרון שכבר נקבע ב-`OREN_CONCLUSION_STYLE_SPEC.md`: אבחון-יועץ ≠ ניסוח-ללקוח).

## 6. נקודת ההשמטה — אישור חוזר

`goral-app.js:1154-1160`:
```js
const _ctx = getClientContext(resolvedTopicId ?? reading.topicId);
const clientCtx = {
  name:     _ctx.clientName || '',
  question: question,
  age:      _ctx.age || '',   // תמיד '' — ראו סעיף 4
  gender:   _ctx.gender || '',
};
```
רק 4 שדות עוברים בפועל ל-`buildKashfReading` (ומתוכם `age` תמיד ריק). כל שאר `_ctx` (`maritalStatus`, `workStatus`, `hasChildren`, `parentName`, `phone`, `quesitedName`, שדות `dynField_*`) נבנים ע"י `getClientContext()` ונזרקים באותה שורה. `reading.clientHistorySummary` (שורה 1126-1130) מחושב לפני-כן ואף הוא לא מגיע ל-`clientCtx`.

## 7. המלצה — מה להעביר ל-Context Collector בשלב הבא (תכנון בלבד, לא בוצע)

| שדה | סיווג מוצע | הערה |
|---|---|---|
| `name`, `question`, `gender` | חובה | כבר עוברים היום |
| `age` | להסיר מהתכנון הקרוב | לא קיים כלל באפליקציה — לא "לתקן שמטה", אלא להוסיף שדה-קלט חדש אם רוצים אותו, וזו החלטת-UI נפרדת שלא אושרה |
| `maritalStatus`, `workStatus`, `hasChildren` | אופציונלי, לניסוח-ללקוח **בזהירות** | ערכים חלקיים/לא-ממצים (סעיפים 1-2) — מתאים כ"רמז-התאמה" (כמו הדוגמה של אבי במפרט), לא כעובדה-קשיחה, ובוודאי לא כשהערך `null` (חסר מובהק בין "לא נענה" ל"הוסר") |
| `parentName`, `phone`, `questionDate/Time`, `quesitedName` | ליועץ בלבד / טכני | לא מיועדים לניסוח-תוכן, שימוש מנהלי בעיקרו (`quesitedName` יכול להיות רלוונטי-תוכנית כששואלים על צד-שלישי, אך זה מעבר-להיקף-הביקורת-הזו) |
| שדות `dynField_*` (טקסט חופשי לפי-נושא) | חובה-לנושא הרלוונטי | אלה בדיוק ה"מהות-הענין"/"תיאור-תסמינים" שהמפרט הקודם ציין כחלק מ"השאלה עצמה" — קרובים ביותר לכוונה המקורית שלך, וכרגע גם הם נשמטים |
| `clientHistorySummary` | ליועץ בלבד, ורק אחרי שהשמירה-לארכיון תורחב גם לכשף | כרגע **ריק/לא-רלוונטי** למשתמשי-כשף בפועל (סעיף 5) — לחבר "עם החוט הזה" לפני שמישהו מניח שהוא כבר עובד |
| `consultationContext` | להסיר מהתכנון | קיים כשדה-שלד בלבד, אף פעם לא נאסף בפועל — אין מה להעביר |

**המלצה מעשית:** לפני בניית ה-Context Collector עצמו, יש שתי החלטות-קדם נפרדות שכדאי שתחליט עליהן: (א) האם להרחיב את `saveGoralReadingToArchive`-call כך שגם קריאות-כשף יישמרו לארכיון (כדי ש-`clientHistorySummary` יהיה בעל משמעות עבור כשף) — זו שינוי-התנהגות (לא רק "העברת-שדה"), ו-(ב) האם להוסיף שדה `age` אמיתי ל-UI, או להסיר את ההתייחסות-השקטה-אליו. שני אלה הם החלטות-מוצר, לא רק חיווט-קוד — מומלץ להכריע עליהן במפורש **לפני** כתיבת ה-Context Collector, לא תוך-כדי.

---

## הצהרות

- שום קוד לא נכתב/שונה. שום HTML/מנוע לא נערך. שום Context Collector לא נבנה.
- שום לשון-העניין לא חוברה. שום AI חי, secret, storage/database/embeddings, UI. שום נגיעה ב-`inner-compass`.
- שום commit/push — רק יצירת קובץ המסמך הזה.
- הצעד הבא — לפי החלטת אורן משה בלבד.
