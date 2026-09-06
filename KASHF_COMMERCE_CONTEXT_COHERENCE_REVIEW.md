# KASHF_COMMERCE_CONTEXT_COHERENCE_REVIEW — ביקורת-קוהרנטיות בהיקף-גדול, commerce context-aware

> **דוח בלבד. לא שונה קוד-לוגיקה, לא שונה `narrative-writer`, לא שונה HTML/UI, לא נוסף age, לא חובר AI, לא בוצע deploy, לא נגע ב-`inner-compass`, לא הורחב לנושא נוסף. לא בוצע commit/push — רק יצירת הקבצים.**
> תאריך: 2026-07-08. בודק אם חיבור `kashf-context-sanitizer.js` ל-`kashf-commerce-smart-layer.js` (commit `4db722a`, "Wire safe client context into Kashf commerce") יוצר ניסוח-לא-קוהרנטי בהיקף-גדול-של-לוחות-אמיתיים ושילובי-context — לא רק על-המקרים-הידניים-שנבדקו-בזמן-הפיתוח.

---

## 1. כמה לוחות נבדקו

**3,000 לוחות-אמיתיים-אקראיים** (לא-מדומיינים, דרך `buildRamlBoardFromMothers`) בסבב-הראשי, מתוכם **3,000 תקינים** (100% — commerce תמיד-מייצר reading תקין, אין boardValidation-שנכשל בסבב הזה). בנוסף: **500 לוחות נוספים** בסבב-הקבוע (שהפך לקובץ-הבדיקה `_test_kashf_commerce_context_coherence.mjs`), ו-**500 הרצות נוספות** על **28 נושאים-אחרים** (לא-commerce) כדי לוודא-בידוד.

## 2. אילו שילובי-context נבדקו

**18 פרופילים** על כל לוח בסבב-הראשי (54,000 שילובים סה"כ = 3,000 לוחות × 18 פרופילים):

`none` (ללא-context) | `workStatus`: `employed`/`self`/`unemployed`/`retired` | `maritalStatus`: `married`/`single`/`divorced`/`widowed` | `hasChildren`: `yes`/`no` | `dynFields` רגילים (`matter`) | `dynFields` רגישים (`symptoms`) | `phone` קיים | `quesitedName` קיים | ושני-שילובים-מורכבים: `self+married+children+phone+dynFields-רגישים+quesitedName` (כל-מה-שאסור-יחד), `employed+divorced+children`, `unemployed+single`.

## 3. כמה כשלים נמצאו

**0 כשלים מתוך 54,000 שילובי-בדיקה** בסבב-הראשי. **0 כשלים** בסבב-הקבוע (4,500 שילובים נוספים). **0 דליפות** ל-28 הנושאים-האחרים (560 הרצות, כולל context מלא: `self`+`married`+`yes`+`phone`).

כל 9 הבדיקות-המכניות שהוגדרו נבדקו על כל שילוב: phone לא-ב-HTML/clientWording/practicalGuidance; dynFields-רגישים ולא-רגישים לא-מצוטטים כלשונם ב-HTML; `employed` לא-יוצר "בעל עסק"/"העסק שלך"; דגל-הסתירה (`contradictions.length`) זהה בין baseline-בלי-context ל-כל-פרופיל; "זה זמן טוב להתקדם" לא-מופיע-אף-פעם לצד-סתירה; `overallPositive`/`certaintyLevel` זהים ל-baseline בכל-הפרופילים; `primaryFormula` (JSON מלא) זהה ל-baseline; `clientWording` (המבוסס-לוח) זהה ל-baseline בכל-הפרופילים.

## 4. דוגמאות מקרי-קצה (מלוחות-אמיתיים, לא-מומצאים)

**self + certaintyLevel='low' (בלי-סתירה)** — mothers `['1112','1122','2211','1112']`:
> *"...בית המבקש בעסקה מראה סף יוצא — מזיקה. בית אחרית העסקה מראה חיבור — ממוזגת-מזיקה. **יש כאן אי-ודאות של ממש** — לא כדאי להסתמך על תשובה אחת בלבד. כדאי לבדוק שוב בזמן אחר... **מאחר שמדובר בפעילות עצמאית שלך, כדאי להתייחס גם למצב התזרים והלקוחות הקיימים.** הדיין — הצורה חיבור — מדגיש את הקושי שבמצב."*
שתי-האזהרות (ודאות-נמוכה + הקשר-עצמאי) **מתקיימות-יחד בהרמוניה** — אין ניסוח-סותר, אין "ודאות-מזויפת".

**self + contradiction** — mothers `['2111','1222','2212','1211']`:
> *"...**יש כאן סתירה בין סימנים**, ולכן לא נכון להתקדם בביטחון מלא... אולם הדיין... מזהיר מפני קשיים... בדיקת אימות נוספת... נתנה כיוון הפוך..."*
משפט-ה-`self` (**"פעילות עצמאית שלך"**) **לא-מופיע כלל** — מאומת ישירות: הקוד ב-`kashf-commerce-smart-layer.js` בודק `!hasContradiction` לפני-הוספת-הבהרה, כך שהסתירה **לא-מדוללת**.

**unemployed + פסיקה-חיובית-מהלוח** — mothers `['1222','2121','1212','1121']` (702 מקרים כאלה נמצאו מתוך 3,000):
> *"...התמונה לא לגמרי חד-משמעית. **זה זמן טוב להתקדם, בזהירות סבירה.** **מאחר שאין כרגע הכנסה קבועה, מומלץ להיות זהיר-במיוחד לפני כל התחייבות כספית.**"*
זהו **הצירוף התקין-והמכוון**: הלוח קובע "טוב-להתקדם", וה-context מוסיף **אזהרה-מציאותית-נוספת** בלי-להפוך את הפסיקה עצמה — זה בדיוק העיקרון "context מתאים טון, לא-קובע-מסקנה" בפעולה.

## 5. האם היו תיקונים נדרשים

**לא.** 0 כשלים אומרים ש**החיבור מ-commit `4db722a` תקין כפי-שנבנה** — לא-בוצע שום תיקון-קוד בביקורת הזו. שני קבצים חדשים בלבד נוצרו: קובץ-הבדיקה-הזמני (בסקראצ'-פד, לא-בריפו) וקובץ-בדיקה-קבוע (`_test_kashf_commerce_context_coherence.mjs`) שמנציח 500 לוחות + 9 פרופילים + 3 מקרי-הקצה-הספציפיים שנמצאו, כדי-שרגרסיה-עתידית-תיתפס-אוטומטית.

## 6. `git diff --stat`

```
 _test_kashf_commerce_context_coherence.mjs        | 92 ++++++++++++++++++
 KASHF_COMMERCE_CONTEXT_COHERENCE_REVIEW.md         | (קובץ זה)
```
(שני קבצים חדשים בלבד — אין שינוי בשום קובץ-לוגיקה קיים)

## 7. רשימת קבצים שנוצרו/שונו

- `_test_kashf_commerce_context_coherence.mjs` (חדש)
- `KASHF_COMMERCE_CONTEXT_COHERENCE_REVIEW.md` (חדש, קובץ זה)

**שום קובץ-לוגיקה קיים לא נערך** — `kashf-commerce-smart-layer.js`, `kashf-context-sanitizer.js`, `kashf-narrative-writer.js`, `goral-app.js`, `kashf-reading-engine.js` נשארו **בדיוק** כפי-שהיו אחרי commit `4db722a`.

## 8. תוצאות כל הבדיקות

- `_test_kashf_commerce_context_coherence.mjs` (חדש) — **20/20 עברו**: 500 לוחות × 9 פרופילים (4,500 שילובים, 0 כשלים) + 10 בדיקות על 3 מקרי-הקצה הקבועים.
- הרצת-הביקורת-הראשית (סקראצ'-פד, לא-בריפו) — 3,000 לוחות × 18 פרופילים (54,000 שילובים), **0 כשלים**.
- בדיקת-בידוד-נושאים — 560 הרצות על 28 נושאים-לא-commerce עם context מלא (`self`+`married`+`yes`+`phone`), **0 דליפות** (`commerceSmartLayer` נשאר `undefined`/`null` בכולן).
- 5 קבצי-הרגרסיה הקודמים (`_test_kashf_commerce_smart_layer.mjs`, `_test_kashf_commerce_context_aware.mjs`, `_test_kashf_context_sanitizer.mjs`, `_test_kashf_archive_save.mjs`, `_test_kashf_context_fields_transfer.mjs`) — **עדיין 100% ירוקים**, לא-נערכו.
- `node --check` על הקובץ החדש — OK.
- סריקת-שיבוש — 0 ממצאים.

## 9. אישור שאין הרחבה לנושאים אחרים

מאומת ישירות (סעיף 4/8) — 28 נושאים-לא-commerce, 560 הרצות עם context-מלא-רלוונטי (כולל `workStatus:self`/`maritalStatus:married` שהם בדיוק-השדות-שמשפיעים-ב-commerce), **0 מקרים** שבהם `commerceSmartLayer` הופיע. `computeCommerceSmartLayer` עדיין-בודק `reading.topicId !== 'commerce'` כתנאי-ראשון-וגורף, ולא-נערך בביקורת הזו.

---

## מסקנה

**commerce context-aware מוכן ותקין בהיקף-גדול — אין ניסוח-לא-קוהרנטי בין `contextGuidanceClause` החדש לבין `certaintyPhrase`/`contradictions`/`practicalGuidance`/`judgeNote`/מקרי-ודאות-נמוכה/`blockedContextFields`, לא-רק-על-הדוגמאות-הידניות שנבדקו-בזמן-הפיתוח.** שום תיקון-קוד לא-נדרש. הצעד-הבא — לפי החלטת אורן משה בלבד.

---

## הצהרות

- שום קוד-לוגיקה לא נכתב/שונה. שום `narrative-writer`/HTML/UI לא נערך. שום הרחבה לנושא-נוסף.
- שום age נוסף. שום AI חי, secret, deploy. שום נגיעה ב-`inner-compass`.
- שום commit/push — רק יצירת שני-הקבצים.
