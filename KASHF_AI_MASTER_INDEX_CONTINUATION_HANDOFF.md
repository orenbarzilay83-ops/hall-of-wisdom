# KASHF AI Master Index — Continuation / Handoff Plan

> מסמך המשכיות פנימי ומחייב לפרויקט **„חשיפת הסודות הנצורים” / KASHF** בתוך „היכל החכמה”.
> מטרתו למנוע פתיחת כיווני עבודה חדשים, שינוי סדר העבודה או חזרה אחורה כאשר עוברים לצ׳אט חדש.

## 1. כלל עליון לצ׳אט חדש

אם העבודה נמשכת בצ׳אט חדש, **אין להתחיל תכנון חדש ואין לפתוח מסלול עבודה מקביל**. קודם קוראים את המסמך הזה במלואו, בודקים את מצב `main`, קוראים את דוח ה־Super Audit האחרון ואת `kashf-v57-ai-master-index.html`, ואז ממשיכים בדיוק מן ה־Continuation Pointer שבסעיף 4.

אם `main` התקדם מאז ה־checkpoint הרשום כאן, יש לקבל את `main` החדש כאמת התפעולית ולא להחזיר את הריפו ל־SHA הישן. ה־SHA במסמך משמש נקודת ייחוס היסטורית בלבד.

## 2. היררכיית המקורות המחייבת

הכיוון תמיד נשאר:

**v57 עברי → אימות מול הסריקה הערבית המודפסת → רשומת Master Index → ורק אחר כך מנועים / Registry / Routing / Golden Tests.**

הסמכות הגבוהה ביותר לאימות היא הספר הערבי הסרוק המודפס:

`كشف الأسرار المصونة في إخراج الضمائر المخزونة`

קובץ הטקסט הערבי המלא / OCR / EPUB הוא **מקור עזר בלבד** ואינו גובר על הסריקה.

ה־v57 הוא גרסת העבודה העברית שנבדקת מול המקור. אין להשתמש במנועים, ב־Canonical Registry, בקוד קיים או במסמכי implementation כדי „לתקן” את המקור או את ה־Master Index.

כל סתירה, חוסר, מונח לא בטוח, מעבר עמוד בעייתי או תרגום שלא נסגר — נשמרים במפורש. **אין silent reconciliation ואין השלמה מהראש.**

## 3. מצב הפרויקט בנקודת ההעברה

Checkpoint לפני יצירת מסמך זה:

- PR #39 מוזג ל־`main`.
- merge SHA: `fcd412fa3f3c0f655349dd5d7d3b416ec43b1052`.
- גוף הספר המהותי סגור בעמ׳ מודפס **276**; עמ׳ 277 ואילך מתחילים תוכן עניינים / אינדקס מודפס ואינם נחשבים אוטומטית ל־Batch חדש של חוקים.
- Master Index מכסה עמ׳ מודפס **21–276** / PDF scan **23–278**.
- מספר רשומות: **271**.
- `VERIFIED`: **181**.
- `REVIEW_REQUIRED`: **90**.
- `INDEXED`: **0**.
- `UNRESOLVED`: **0**.
- duplicate `entryId`: **0**.
- חורי כיסוי בעמ׳ 21–276: **0**.
- `runtimeEligible:true`: **0**.

Super Audit Pass 1 כבר בוצע. הוא תיקן רק פגמים שהמקור אפשר לסגור בביטחון:

- הפרדת מספור המקור מעוגני v57 בסדרי השיבוץ 12–14, עמ׳ 147–150.
- פיצול נכון של תור התיקון בין p164 לבין p165 בדיני קרבת הצורות.
- תיקון seam של כלל הגניבה החוצה p229→p230.

ממצאים שנשארו פתוחים בכוונה:

- `coverage.completedBatches` מתחיל ב־Batch02 אף שקיים Section של Batch01 לעמ׳ 21–53. אין לשנות בלי בדיקת היסטוריה/משמעות.
- 68 רשומות ישנות חסרות שדה `runtimeEligible` מפורש. אין פירוש הדבר שהן מורשות runtime; אף רשומה אינה `true`.
- 9 רשומות ישנות חסרות `sourceVerification`; אין למלא אותן מכנית בלי בדיקת מקור.
- הריפו אינו מכיל כרגע את `kashf-v57-draft.html` ואת `kashf-v57-topic-index.html`, אף שקיימים עותקי עבודה מחוץ לריפו. אין להעתיק אותם לריפו בלי החלטה מפורשת בשלב המתאים.

## 4. CONTINUATION POINTER — הנקודה המדויקת להמשך

השלב הפעיל הוא **Super Audit — Pass 2**.

### מצב Pass 2 לאחר בדיקת עמ׳ 43–53

- `lastCompletedReviewEntry`: `houses.p46-53.profiles`
- `lastCompletedPrintedRange`: **46–53**
- `lastCompletedScanRange`: **48–55**
- `nextReviewEntry`: `figures.p65.sought-hebrew-wording`
- `nextReviewPrintedRange`: **65**
- `reviewRequiredStatusCount`: **90** — שלוש הרשומות שנבדקו נשארו `REVIEW_REQUIRED` מסיבות מקור מתועדות; לא שונה סטטוס מלאכותית.
- `pass2ReviewedEntries`: **3 / 90**
- `pass2UnauditedReviewEntries`: **87**
- `VERIFIED`: **181**
- `PR #41 merge SHA`: `5f53b20933ea5e4087d974df165f8718713de707`

הכרעות Pass 2 שכבר בוצעו:

1. `houses.p43-44.taxonomy` — סיווג **B**: המקור המודפס ברור, אך v57 שגוי. הסריקה קובעת `زايد الأوتاد = H3/H6/H9` ומורה על העבר; `الساقط = H6/H12` הוא סיווג נפרד. האינדקס תוקן לשקף זאת, והרשומה נשארת `REVIEW_REQUIRED` עד תיקון v57.
2. `houses.p45.aspects-and-gender` — סיווג **C**: המילה `والثاني` מודפסת בבירור לאחר שלושת זוגות ה־sextile, אך תפקידה התחבירי/מבני אינו סגור מן המקור. היא נשמרת כאנומליית מקור; נוסף `sourceConflictQueue` מתאים, ואין להמציא זוג רביעי.
3. `houses.p46-53.profiles` — סיווג **B** ברוב הפערים, עם תת־מקרה **C** ב־H15: בדיקה חזותית רציפה של עמ׳ מודפס 46–53 חשפה פערי v57 נוספים ב־H1, H3, H5, H8, H9, H10, H12 ו־H15. האינדקס שומר את נוסח המקור והערבית הקשה במפורש; H15 נשאר גם ב־`sourceConflictQueue` משום שהמשפט המודפס עצמו פגום ואינו מכיל `خفيف`. הרשומה נשארת `REVIEW_REQUIRED`.

מכאן ממשיכים **לפי סדר העמודים בלבד** אל:

`figures.p65.sought-hebrew-wording`

עמוד מקור: **65**  
עמוד scan: **67**

אין להתחיל מחדש מ־Batch 01, אין לדלג לרשומה מאוחרת משום שהיא קלה יותר, ואין להתחיל מ־p277.

### כלל עדכון Pointer

אחרי כל PR של Pass 2 שמוזג, יש לעדכן **את אותו מסמך** בסעיף זה עם:

- `lastCompletedReviewEntry`
- `nextReviewEntry`
- טווח העמודים האחרון שהושלם
- מספר `REVIEW_REQUIRED` שנותרו
- מספר `VERIFIED` החדש
- מספרי ה־PR וה־merge SHA

כך כל צ׳אט חדש יקבל נקודת המשך חד־משמעית.

## 5. המטרה המדויקת של Super Audit — Pass 2

לעבור על **כל 90 רשומות `REVIEW_REQUIRED`**, לפי סדר עמודי הספר, ולהצליב לכל רשומה את כל השכבות הבאות:

1. `bookPages` — עמודי הספר המודפס.
2. `scanPdfPages` — עמודי קובץ הסריקה.
3. `v57Anchors` — מיקום החומר ב־v57.
4. נוסח הסריקה הערבית בפועל, כולל seams בין עמודים, טבלאות, הערות שוליים ושמות צורות.
5. `criticalFacts`, `procedure`, `branches`, `preconditions`, `doNotInfer`.
6. `sourceDiscrepancies`.
7. `verificationStatus`.
8. כל reference מתאים מתוך:
   - `v57CorrectionQueue`
   - `sourceConflictQueue`
   - `downstreamCorrectionQueue`

### סיווג מחייב לכל מקרה

**A — Source clear + v57/index consistent**  
ניתן לסגור את פער הבדיקה ולהעביר ל־`VERIFIED`, רק אם אין סתירה פתוחה אחרת.

**B — Source clear, אבל v57 שגוי/חסר**  
האינדקס צריך לשמר את אמת המקור, אבל הרשומה נשארת `REVIEW_REQUIRED` כל עוד תיקון v57 פתוח. יש לשמור/ליצור פריט מתאים ב־`v57CorrectionQueue`.

**C — המקור עצמו עמום/פגום/סותר את עצמו**  
נשאר `REVIEW_REQUIRED`. יש לשמר את הטקסט והאי־ודאות במפורש ולוודא פריט מתאים ב־`sourceConflictQueue`. אין להכריע לפי סימטריה, היגיון, ספר אחר או קוד קיים.

**D — המקור וה־v57 סגורים, אבל downstream שגוי**  
הרשומה יכולה להיות `VERIFIED`, בעוד התיקון נשאר ב־`downstreamCorrectionQueue`. אין לממש את תיקון ה־downstream בתוך Pass 2.

## 6. דרך העבודה בתוך Pass 2

Pass 2 הוא **מסלול יחיד רציף**, לא אוסף פרויקטים חדשים.

עובדים בקבוצות רציפות לפי עמודים. PR אחד יכול לכלול כמה רשומות סמוכות כאשר כולן עברו בדיקה מלאה, אבל:

- אין לפתוח כמה PRs מקבילים לאותו Pass.
- אין לקפוץ קדימה לנושא אחר משום שהוא „קל יותר”.
- אין לבצע merge ללא אישור מפורש של אורן משה.
- לאחר merge מעדכנים את Continuation Pointer במסמך זה.
- כל שינוי ב־Master Index צריך להיות minimal diff; אין reformat גדול של כל ה־JSON/HTML רק כדי לבצע תיקון נקודתי.

בכל PR יש להריץ לפחות QA מבני:

- embedded JSON תקין.
- 271 רשומות אלא אם נוספה/פוצלה רשומה מסיבה מקורית מתועדת.
- `entryId` ייחודיים.
- כיסוי רציף 21–276.
- התאמת queue references לרשומות קיימות.
- אין queue IDs כפולים.
- `runtimeEligible:true` נשאר 0.
- אין שינוי במנועים/Registry/Routing/Golden Tests.

## 7. מה אסור לעשות במהלך Pass 2

- לא ליצור v58 או גרסת ספר חדשה.
- לא לבנות Master Index חלופי.
- לא לפתוח workstream חדש של מנועים, routing, canonical registry או UI.
- לא לשנות מנועים רק משום שנמצא פער באינדקס.
- לא להשתמש בקוד הקיים כהוכחה למה שהתכוון הספר.
- לא להפעיל „רוב שיטות” או להמציא מסלול דמיר חדש.
- לא להפוך אף רשומה ל־`runtimeEligible:true`.
- לא למחוק `REVIEW_REQUIRED` רק כדי להקטין את המספר.
- לא לסגור source conflict באמצעות השערה.
- לא להכניס את תוכן העניינים שאחרי p276 כאילו הוא המשך גוף הספר.
- לא למזג PR ללא אישור מפורש של המשתמש.

## 8. שלבי ההמשך אחרי Pass 2 — ורק לפי הסדר הזה

### Phase 3 — Schema / Metadata Normalization

רק אחרי סיום כל 90 הבדיקות הסמנטיות:

- להכריע מה עושים עם 68 הרשומות החסרות `runtimeEligible` מפורש; ברירת המחדל היא `false`, לא `true`.
- להשלים את 9 רשומות `sourceVerification` רק לאחר בדיקת מקור אמיתית.
- לבדוק אם `completedBatches` צריך לכלול Batch01 או שזה convention היסטורי מכוון.
- לבצע QA מלא לכל queue references, source pages, scan pages, anchors ו־status counts.

### Phase 4 — v57 Correction Execution

רק אחרי שהאינדקס הסמנטי יציב:

- לקחת את `v57CorrectionQueue` לפי סדר עמודים.
- לתקן את v57 מול הסריקה בלבד.
- לא לשכתב חומר שכבר תואם מקור.
- לא לשנות מינוחים מחייבים בלי ראיה מקורית.
- להחליט במפורש אם ואיך `kashf-v57-draft.html` מוכנס לריפו לפני תיקון repository-wide.

### Phase 5 — Downstream Impact Mapping

אחרי שה־v57 וה־Master Index מיושרים:

- למפות את השפעת המקור המאומת על data, engines, canonical registry, routing ו־traceability.
- לכל intent לבחור **מסלול מקור ראשי אחד** במקום להריץ אוטומטית כמה שיטות ולעשות majority.
- לפתוח מחדש פריטים deferred/paused רק אם האינדקס המלא מוכיח שהם נדרשים.
- לא לממש עדיין בלי מפת השפעה ו־plan מאושרים.

### Phase 6 — Implementation Repairs

רק לאחר אישור מפת ההשפעה:

- תיקוני data / engines / registry / routing בקבוצות קטנות ובעלות traceability לעמודי מקור.
- כל תיקון חייב להצביע על `entryId` ומקור מאומת.
- אין placeholder או canned answer.

### Phase 7 — Golden Tests / Regression / AI Readiness

- Golden Tests לכל מסלול שהופעל.
- בדיקות negative/edge cases.
- בדיקת שאין source conflict שמוזרם לפסק פעיל.
- בדיקת traceability: שאלה → intent → source rule → executor → conclusion.
- רק אחרי זה ממשיכים לחיבור ה־AI המלא לאתר.

## 9. קבצים שחייבים להיקרא לפני המשך עבודה בצ׳אט חדש

בריפו:

1. `KASHF_AI_MASTER_INDEX_CONTINUATION_HANDOFF.md` — המסמך הזה; ראשון לקריאה.
2. `KASHF_AI_MASTER_INDEX_SUPER_AUDIT_FINAL.md` — תוצאות Pass 1.
3. `kashf-v57-ai-master-index.html` — מקור העבודה המרכזי של האינדקס.
4. `KASHF_OPEN_RESEARCH_AND_IMPLEMENTATION_BACKLOG.md` — רק להבנת פריטים paused/deferred; אין לממש מהם אוטומטית.

מקורות חיצוניים/מועלים לפי הצורך:

- הסריקה המודפסת הערבית המלאה: `كشف الأسرار المصونة في اخراج الضمائر المخزونة(1).pdf`.
- הטקסט הערבי המלא: `كشف الأسرار — النص العربي الكامل(5).pdf` — עזר בלבד.
- `kashf-v57-draft.html` — גרסת העבודה העברית הנוכחית.
- `kashf-hebrew-v56-clean-final.html` — baseline קודם; **אין לערוך אותו** במסגרת v57.

אם אחד ממקורות החובה אינו זמין לצ׳אט חדש, אין לנחש את תוכנו. יש לאתר אותו ב־File Library / פרויקט או לבקש מאורן משה לצרף אותו.

## 10. משפט הפעלה לצ׳אט חדש

אם אורן משה אומר בצ׳אט חדש „תמשיך מאיפה שעצרנו”, יש לפרש זאת כך:

> קרא את `KASHF_AI_MASTER_INDEX_CONTINUATION_HANDOFF.md`, בדוק את `main` ואת ה־Continuation Pointer, ואז המשך את Super Audit Pass 2 מהרשומה `nextReviewEntry` לפי סדר עמודי הספר. אל תפתח תכנית חדשה, אל תשנה מנועים ואל תדלג לשלב הבא לפני שהשלב הנוכחי הושלם ואושר.

---

**עיקרון שמירה:** המסמך הזה הוא living handoff. הוא צריך להתעדכן בכל נקודת עצירה משמעותית ובכל merge של Pass 2, כדי שמעבר לצ׳אט חדש לא ישנה את התכנית ולא יאבד את נקודת ההמשך.
