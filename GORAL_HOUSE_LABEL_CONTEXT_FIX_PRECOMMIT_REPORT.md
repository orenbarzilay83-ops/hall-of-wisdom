# GORAL_HOUSE_LABEL_CONTEXT_FIX_PRECOMMIT_REPORT — תווית-בית context-aware + הסתרת סעיפים ללא-תחולה

> **דוח לפני-commit. עדיין לא בוצע commit/push. לא נגע בחישוב, בקלפים, ב-`inner-compass`, ב-AI, ב-secrets, ב-production/main, ובאבחון הרוחני.**
> תאריך: 2026-07-09. ממשיך את `GORAL_RULE_APPLICABILITY_FIX_PRECOMMIT_REPORT.md` (`49abd7c`) — תיקון-המשך על אותה בעיה שנצפתה ב-Preview.

---

## Audit קצר (לפני התיקון)

**1. איפה נבנית "מפת הבתים המרכזיים" בכשף?**
`kashf-narrative-writer.js:writeKeyHousesPara` — מרנדרת `reading.keyHouseReadings`, שמחושב ב-`kashf-reading-engine.js:describeHouse()` לפי `rules.keyHouses` (per-topic, `kashf-topic-rules.js`).

**2. האם היא תמיד מציגה שמות נושאיים של בתים?**
כן, לפני התיקון — `describeHouse()` השתמש תמיד ב-`HOUSE_NAMES[houseNum]` (טבלה קבועה, למשל בית 9 = "הדת והנסיעה"), ללא קשר לשאלה אם הבית הגיע ל-`keyHouses` בגלל תוכן-נושאי אמיתי או רק כרכיב-חישוב בנוסחה. **דוגמה מדויקת שנמצאה:** נושא `completion` ("השלמת העניין") — `primaryFormula.houses: [1, 5, 9, 10]` (נוסחת "ראש" משורת-האש) ו-`keyHouses: [1, 5, 9, 10, 16]`. בית 9 שם רק כי הוא רכיב בנוסחה — אין שום `supportingCheck` שמתייחס אליו כ"דת/נסיעה". זה בדיוק מה שראית ב-Preview בשאלת "האם העסק החדש יצליח?".

**3. האם אפשר להחליף כותרות לבית לפי context (topicId/formulaRole/clientMode)?**
כן — ונגזר **אוטומטית** מנתונים שכבר קיימים ב-`kashf-topic-rules.js`, בלי לקבוע ידנית לכל נושא/בית. הכלל: בית שנמצא ב-`primaryFormula.houses ∪ altFormula.houses` **ואינו** מוזכר באף `supportingCheck` (לא ב-`houses`, לא ב-`mainHouse`/`targetHouse`) — אין לו פרשנות-תוכן עצמאית בנושא הזה, ולכן מקבל תווית טכנית ניטרלית במקום השם הנושאי. בתים 1 ו-13-16 (השואל/עדים/דיין) לא נכללים בכלל — אין להם שם-נושאי שעלול להטעות ("הנפש"/"עד ראשון"/"הדיין" אינם "נושאים" שיכולים להתבלבל עם השאלה).
**אימות שהכלל לא פוגע במקומות שבהם הבית כן טוען משמעות אמיתית:** בנושא `illness`, בית 6 ("המחלה") ובית 8 ("מוות/ירושה") נשארים עם השם הנושאי — כי יש להם `supportingChecks` ספציפיים (`illness-duration-h6`, `illness-severity-h8`, `illness-type`, `body-part` וכו') שמפרשים אותם ישירות. נבדק בפועל (ראו בדיקות למטה).

**4. איפה מוצג "מתן התאוות" גם כשאין תחולה?**
`computeFigureDesireFulfillmentKashf` (`kashf-book-additions.js:491-508`) מחזירה, כשאין הערה לצורת בית 1: `outputHebrew: 'לא נמצאה הערה מיוחדת... אין לכלל זה תחולה בקריאה זו.'`. `findingSentence()` ב-`kashf-narrative-writer.js` (checkType `'legacy-fn'`) הציג את זה **תמיד** ללקוח, ללא סינון. אותה תבנית טקסט מדויקת ("אין לכלל זה תחולה") נמצאת גם ב-`kashf-book-additions.js:461` (כלל אחר, "צורת דרך אינה שורה בבתי-העדות").

**5. האם אותה בעיה קיימת גם בחאווי?**
**לא.** נבדק ישירות: `HOUSE_NAMES`/`houseName` (הטבלה הקבועה "בית X — נושא Y") **קיימת ומיובאת רק בקבצי כשף** — `grep` על `goral-conclusion-writer.js`/`hawi-interpreter.js` לא מצא שום שימוש בהם. חאווי בכלל לא בנוי כך: הוא תמיד מציג שם-צורה + `transit.meaning` (טקסט פרשני ספציפי לצירוף צורה×בית, לא תווית-נושא גנרית של הבית עצמו) — כך שאין לו את אותו וקטור-בלבול. **לא בוצע שום שינוי בחאווי בשלב זה.**

---

## הצעת התיקון שיושמה

1. **`kashf-reading-engine.js`** — פונקציה חדשה `getFormulaOnlyHouseNumbers(rules)` (גזירה אוטומטית, לא מיון-ידני), ו-`describeHouse()` מקבל אותה ומחזיר `isFormulaOnly` + `houseName` מותאם ("בית 9 — מרכיב בנוסחת ההכרעה" במקום "בית תשיעי — הדת והנסיעה").
2. **`kashf-narrative-writer.js`** — `findingSentence()` (checkType `'legacy-fn'`) מחזירה `null` (מוסתר) כש-`outputHebrew` מכיל את המשפט "אין לכלל זה תחולה" — הרשומה עדיין קיימת במלואה ב-`reading.supportingFindings` (advisor-only/עתידי).

**החישוב עצמו לא נגע בשום מקום** — `pattern`/`quality`/`dakhalKharij`/`verdict`/`overallPositive` זהים לחלוטין. רק תוויות-תצוגה.

## קבצים ששונו

```
 M  goral-hachol/engine/kashf-narrative-writer.js   (+3 שורות)
 M  goral-hachol/engine/kashf-reading-engine.js      (+37 -3 שורות)
?? _test_kashf_house_label_context.mjs               (חדש — בדיקה)
```

## תוצאות בדיקות

**בדיקה חדשה — `_test_kashf_house_label_context.mjs` (12/12 עברו):**
```
✓ completion: אין "הדת והנסיעה" בפלט הלקוח
✓ reading.keyHouseReadings: בית 9 מסומן isFormulaOnly=true
✓ houseName של בית 9 = "בית 9 — מרכיב בנוסחת ההכרעה"
✓ illness: בית 6/8 עדיין מציגים כותרת נושאית (יש להם תמיכה ספציפית — לא נפגעו)
✓ מתן-התאוות: לא מוצג ללקוח כשאין תחולה (verdict=no-note-for-this-figure), אך עדיין קיים ב-supportingFindings
✓ חישוב (overallPositive, primaryFormula.result.resultPattern) זהה — לא השתנה
```

**חבילת-הרגרסיה המלאה (9 קבצים, כולל התיקון הקודם) — כולם עברו ללא כשל:**
`_test_goral_rule_applicability.mjs`, `_test_kashf_context_sanitizer.mjs`, `_test_kashf_commerce_smart_layer.mjs`, `_test_kashf_commerce_context_coherence.mjs` (4500 שילובים), `_test_kashf_commerce_context_aware.mjs`, `_test_kashf_context_fields_transfer.mjs`, `_test_kashf_archive_save.mjs`, `cartomancy/_test_cartomancy.mjs`, `_test_oren_smart_advisor_site_brain_poc.mjs`.

**Playwright (דפדפן אמיתי) — `_test_oren_advisor_panel_ui.mjs` — 21/21** — פאנל בינת אורן ללא שינוי.

**`node --check`** על כל 204 קבצי JS/MJS — כולם עברו (חוץ מהתקלה הקיימת-מראש הלא-קשורה `raml-data/raml-spiritual-diagnostics.js`, שתועדה קודם ולא טופלה כרגע).

## אישורים

- ✅ החישוב לא השתנה — רק תוויות-תצוגה.
- ✅ הקלפים לא שונו (לא נערך אף קובץ תחת `cartomancy/`).
- ✅ פאנל בינת אורן לא שונה, אומת ב-Playwright.
- ✅ אבחון רוחני בחאווי לא נגע — לא נערך `hawi-interpreter.js`/`goral-conclusion-writer.js`/`goral-spiritual-diagnostics-engine.js` בשלב זה.
- ✅ לא נגעתי ב-`inner-compass`, לא AI חי, לא secret, לא production deploy, לא main.
- ⏳ **עדיין לא בוצע commit/push** — ממתין לאישורך.

---

## הצעד הבא

ממתין לאישורך ל-commit ו-push. שם commit מוצע: `Show formula-only Kashf houses with a neutral label, hide no-applicability rule sections`.
