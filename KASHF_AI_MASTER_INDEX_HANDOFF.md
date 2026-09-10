# KASHF AI MASTER INDEX — CURRENT HANDOFF

> מסמך המשכיות מחייב לעבודה על אינדקס AI של הספר „חשיפת הסודות הנצורים” v57.
> יש לקרוא מסמך זה ואת `kashf-v57-ai-master-index.html` לפני כל שינוי.
> אם הנתונים כאן אינם תואמים ל-`main` הנוכחי — עוצרים ובודקים את היסטוריית Git לפני שמשנים דבר.

## מצב מאושר

- Repository: `orenbarzilay83-ops/hall-of-wisdom`
- Authoritative branch: `main`
- Working branch: `claude/app-cleanup-organization-mia9b2`
- Latest indexed-content commit: `3b85ba7f8abf33301895191adf6628da3046294d`
- Last completed batch: `BATCH11_P167_171`
- Book coverage: עמ׳ 21–171
- Boundary capture: השורה הראשונה של עמ׳ 172 צורפה לכלל הממשיך מעמ׳ 171
- Next full source page: עמ׳ 172
- Schema version: `2.1.0`
- Records: 143
- VERIFIED: 106
- REVIEW_REQUIRED: 37
- INDEXED: 0
- UNRESOLVED: 0
- runtimeEligible true: 0
- v57CorrectionQueue: 33
- downstreamCorrectionQueue: 28
- sourceConflictQueue: 6

אם מסמך זה נמצא ב-`main`, משמעות הדבר היא ש-Batch 11 ותיקוני התפרים של Batch 10–11 מוזגו. תמיד יש לאמת את ה-HEAD החי של `main` ולא להניח שהוא זהה ל-SHA ישן שנמסר בשיחה.

## נקודת ההמשך

המשך העבודה הוא Batch 12, החל מעמ׳ ספר 172 / עמ׳ סריקה 174.

אין לקרוא מחדש את עמ׳ 172 כשורה מנותקת: השורה הראשונה כבר נשמרה כהמשך לכלל מעמ׳ 171. יש להתחיל מן התוכן המלא בעמ׳ 172, לבדוק את החיבור לאחור, ולהמשיך ברצף בלי לדלג על שורה, טבלה, מספר, בית או תנאי.

## סדר האימות המחייב

1. `kashf-v57-draft.html` — גרסת העבודה העברית.
2. הסריקה הערבית המודפסת — סמכות האימות העליונה.
3. `kashf-v57-ai-master-index.html`.
4. רק בשלב עתידי ונפרד: engines, registries ו-Golden Tests.

אין להשתמש בקוד קיים כדי להכריע סתירה בין v57 לבין המקור. אין להשלים לפי היגיון, סימטריה או OCR.

## גבולות העבודה הנוכחית

- ממשיכים בבניית האינדקס עמוד אחר עמוד עד סוף הספר.
- אין לשכתב את הסכמה.
- אין לתקן כרגע את v57.
- אין לשנות מנועים, registries, routing או Golden Tests.
- אין להגדיר `runtimeEligible:true`.
- כל שיטה המופיעה בספר מתועדת, אך אינה הופכת אוטומטית למנוע פעיל.
- מדיניות הבחירה: `ONE_PRIMARY_METHOD_PER_QUESTION_INTENT`.
- `operationalSelection: NEED_DRIVEN`.
- `noMultiMethodAggregation: true`.
- `legacyFiveMethodMajorityRuntimeAllowed: false`.

## טיפול בפערים

- פער בין v57 למקור: `v57CorrectionQueue`.
- פער בקוד, registry או engine: `downstreamCorrectionQueue`.
- סתירה פנימית במקור: `sourceConflictQueue`.
- אין לתקן את הפערים תוך כדי האינדוקס.
- רשומה עם פער אמיתי נשארת `REVIEW_REQUIRED`.

## ממצאי תפר Batch 10–11 שחייבים להישמר

- החיבור בין עמ׳ 166 לעמ׳ 167 נבדק מחדש ונשמר כיחידת מקור רציפה.
- שני סוגי השאלות הרוחניות בעמ׳ 167 נשמרו כ-intents נפרדים.
- כללי מקור החוצים מעבר עמוד נרשמים על פני כל העמודים שבהם הם מופיעים; מעבר עמוד אינו חותך procedure או branches.
- עמ׳ 166–171 נסגרו לאחר בדיקת שורות חסרות ותפרי עמודים.
- עמ׳ 172 הוא העמוד המלא הבא לעבודה.

## תהליך Git המחייב לכל Batch

1. מתחילים רק מ-`main` מאומת ונקי.
2. עובדים בענף `claude/app-cleanup-organization-mia9b2`; אין ליצור ענף חדש ללא החלטה מפורשת.
3. משנים את האינדקס ואת מסמך ההמשכיות בלבד, אלא אם ניתן אישור מפורש לקבצים נוספים.
4. מבצעים validation מלא.
5. מוודאים שאין `INDEXED`, `UNRESOLVED`, כפילויות entryId או `runtimeEligible:true`.
6. פותחים Pull Request אל `main`.
7. בודקים את רשימת הקבצים ואת ה-diff לפני מיזוג.
8. ממזגים רק לאחר אישור מפורש.
9. לאחר המיזוג מאמתים מחדש את `main`, את הכיסוי ואת המונים.
10. מעדכנים מסמך זה בסיום כל Batch.

## הוראה לצ׳אט חדש

התחבר ל-GitHub וקרא תחילה את:

- `KASHF_AI_MASTER_INDEX_HANDOFF.md`
- `kashf-v57-ai-master-index.html`
- ה-commit וה-PR האחרונים הנוגעים לאינדקס

אמת שמצב `main` תואם למסמך. אם קיימת סתירה, עצור וחקור את Git לפני כל שינוי. לאחר האימות המשך מן `Next full source page` בלבד, לפי סדר האימות והגבולות המפורטים לעיל.
