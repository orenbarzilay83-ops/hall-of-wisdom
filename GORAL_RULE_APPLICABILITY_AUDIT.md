# GORAL_RULE_APPLICABILITY_AUDIT — Audit בלבד: חוקים לא-מסוננים בפלט (כשף + חאווי)

> **דוח Audit בלבד. לא בוצע שום תיקון קוד, לא שונה שום מנוע/narrative, לא נגע בגרפיקת קלפים, לא חובר AI חי, לא נגע ב-`inner-compass`, לא merge, לא deploy.**
> תאריך: 2026-07-09. נבדק על הענף `claude/app-cleanup-organization-mia9b2` (כולל המיזוג האחרון של הקלפים).

---

## תקציר מנהלים

**הבעיה קיימת בשתי השיטות, אך בעוצמות שונות ובמנגנונים שונים לחלוטין:**

- **בכשף אל-אסראר — הבעיה חמורה ומאושרת במלואה.** "מחשבת השואל" (דמיר) מחושבת **וגם מוצגת** בכל קריאה, בכל נושא, ללא כל תלות בשאלה שנשאלה. זה בדיוק התרחיש שתיארת: שאלת עסק מציגה "מה שבאמת מעסיק את השואל הוא הדת והנסיעה" — כי בית-הדמיר יצא בית 9, ואין שום מנגנון שבודק אם השאלה בכלל דרשה גילוי-כוונה-נסתרת.
- **בחאווי — יש בעיה מקבילה אך קלה בהרבה, ומוגבלת לחלק אחד בלבד.** לחאווי יש "דמיר" משלו (שונה במהותו — לא "מה השואל באמת חושב עליו", אלא "האם מחשבת השואל תומכת/סותרת את הדיין") שגם הוא מוצג תמיד ללא תלות בנושא. **אבחון רוחני בחאווי, לעומת זאת, כן מסונן כראוי** — הוא מחושב תמיד ברקע, אבל מוצג ללקוח רק כשהנושא הוא `spiritualDiagnostics`/`foundations`/`generalReading`. זה בדיוק הדפוס הנכון שכשף צריך לאמץ.

הממצא המרכזי: **המנגנון הנכון כבר קיים בחלקים אחרים של הקוד** (topic-rules בכשף, spiritual-gating בחאווי) — הבעיה היא שהוא לא הוחל באופן עקבי על *כל* החוקים.

---

## א. תשובות לשאלות ה-Audit — כשף אל-אסראר

### 1. אילו sections מופיעים תמיד בפלט?

מ-`kashf-narrative-writer.js:writeKashfReading` (שורות 684-698), הרכיבים הבאים מופיעים **תמיד**, ללא תלות בנושא:
- `writeShortVerdictBox` — תשובה קצרה (כן/לא/לא ודאי) — **תמיד גלוי ללקוח**, לא מאחורי "קרא עוד".
- `writeConclusionPara` ("קרא ללקוח") — **תמיד גלוי ללקוח**.
- מאחורי כפתור "קרא עוד" (מכווץ כברירת מחדל, אך נגיש לכל לקוח בלחיצה אחת, ללא כל הגבלת-הרשאה): `writeHeader`, `writeBoardWarnings`, `writeOpeningPara`, `writeVerdictPara`, `writeAltPara`, `writeSupportingPara`, `writeKeyHousesPara`, **`writeDhamirPara`**, `writeWitnessJudgePara`.

### 2. איפה הדמיר / מחשבת השואל נכנס לפלט?

- **חישוב:** `kashf-reading-engine.js:556-561` — `dhamir = computeDhamirByMajority(board)` נקרא **ללא פרמטר topicId בכלל**. הפונקציה לא יודעת ואף לא יכולה לדעת מה השאלה — היא פועלת אך ורק על הלוח.
- **תוספות דמיר:** `kashf-reading-engine.js:576-591` — `dhamirExtras` (sodHaDhamirim, honestyCheck, querentSubject, timingByThirds, temperament, timingByMadad, timingEstimate) — גם הן מחושבות תמיד, ללא תלות בנושא.
- **תצוגה:** `kashf-narrative-writer.js:319-359` (`writeDhamirPara`) — מוצג **בכל קריאה שיש לה `dhamir.winner`** (שזה כמעט תמיד, כי הפונקציה כמעט תמיד מוצאת בית מנצח). שורה 696 מכניסה אותו ל-`detailSections` **ללא כל תנאי `topicId`** — בניגוד גמור לאיך ש-`supportingChecks`/`keyHouses` מטופלים (ראו סעיף הבא).
- **הדוגמה שנתת (שאלת "האם העסק החדש יצליח?" עם דמיר שיוצא בית 9 — דת/נסיעה) בדיוק הקוד הזה. זה לא באג נקודתי — זו התנהגות מתוכננת-בטעות: הפונקציה אף פעם לא נבנתה עם מושג של "מתי דמיר רלוונטי".**

### 3. איפה עיתוי, טבע השואל, מתן התאוות, בתים מרכזיים וכללי עזר נכנסים לפלט?

- **עיתוי/טבע-שואל** (`timingByThirds`, `temperament`, `timingByMadad`, `timingEstimate`) — כל אלה חלק מ-`dhamirExtras` (סעיף 2 לעיל) — **אותה בעיה בדיוק**: מחושבים ומוצגים תמיד בתוך `writeDhamirPara`, ללא תלות בנושא.
- **בתים מרכזיים (`keyHouses`)** — **מוגדרים per-topic** ב-`kashf-topic-rules.js` (למשל commerce: `keyHouses: [1, 2, 4, 7, 8, 10, 11, 15, 16]`, שורה 1462). זה **כבר מסונן נכון** — כל נושא מגדיר רק את הבתים הרלוונטיים לו.
- **כללי עזר (`supportingChecks`)** — **גם הם per-topic**, מוגדרים בתוך אותו בלוק-נושא ב-`kashf-topic-rules.js` (למשל commerce: `buyer-vs-seller`, `buyer-generosity`, `goods-profit-loss`, `requester-circle-strength` — שורות 1429-1461). זה **כבר מסונן נכון**.

**מסקנת ביניים חשובה:** מנגנון הסינון-לפי-נושא **כבר קיים ועובד** עבור `primaryFormula`/`altFormula`/`supportingChecks`/`keyHouses` — הבעיה מוגבלת לשכבת ה-**דמיר** (וכל תת-הבדיקות שתלויות בה), שנוספה כשכבה נפרדת ועצמאית-מהנושא (ראו ההערה בקוד עצמו, `kashf-reading-engine.js:553-554`: *"עצמאי מהנושא שנבחר"* — זו הייתה החלטת-עיצוב מכוונת בזמנו, אך היא זו שיוצרת את הבעיה).

### 4-5. אילו חוקים הם חוקי הכרעה ראשיים לפי topic, ואילו הם רק אימות/תמיכה?

| קטגוריה | חוקים | סטטוס-סינון |
|---|---|---|
| הכרעה ראשית | `primaryFormula`, `altFormula` (per-topic ב-kashf-topic-rules.js) | ✅ מסונן נכון |
| תמיכה/אימות | `supportingChecks` (per-topic) | ✅ מסונן נכון |
| תיאור-מצב | `keyHouseReadings` (per-topic `keyHouses`) | ✅ מסונן נכון |
| הכרעה-סופית-מבנית | `witnessTestimony` (בתים 13-14), הדיין (בית 15) | ⚠ מוצג תמיד, בכל נושא — אך זה עקרון-מבנה קלאסי בגורל החול (כל קריאה מסתיימת בעדים+דיין) ולא "חוק צדדי לא-קשור". **לא זיהיתי את זה כבעיה במובן שתיארת — יש להחליט אם זה בכוונה.**
| גילוי-כוונה-נסתרת | `dhamir`, `dhamirExtras` (עיתוי/טבע-שואל/כנות וכו') | ❌ **לא מסונן בכלל — הבעיה המרכזית** |

### 6. אילו חוקים צריכים להיות advisor-only?

- `dhamirType4External` — **כבר** advisor-only הלכה למעשה: מחושב ב-`kashf-reading-engine.js:567-572` אך **לא מוצג בכלל** ב-narrative-writer (יש הערה מפורשת בקוד, `kashf-narrative-writer.js:361-364`, שמסבירה שהוא "נשאר זמין לשימוש פנימי בלבד"). זה תבנית טובה שאפשר להעתיק.
- מועמדים טבעיים ל-advisor-only (במקום client-facing): `dhamirExtras.honestyCheck` (בדיקת-כנות-השואל — רגיש מטבעו, לא מתאים לומר ללקוח "בדקנו אם אתה כן"), `dhamirExtras.querentSubject`, `sodHaDhamirim`.

### 7. אילו חוקים לא צריכים להופיע אלא אם השאלה דורשת אותם?

- **כל שכבת הדמיר** (`writeDhamirPara` על כל תת-הרכיבים שלה) — לפי העיקרון שהצגת: להופיע רק בשאלות מסוג "מה הוא חושב עליי?"/"מה בלבו?", או כשאורן מבקש אבחון-עומק במפורש.
- **`timingByThirds`/`timingByMadad`/`timingEstimate`** — להופיע רק בשאלות-עיתוי, לא כברירת מחדל.
- **`temperament`** (טבע השואל) — כנ"ל, רלוונטי רק לשאלות-אופי/כוונה, לא לכל שאלה.

---

## ב. תשובות לשאלות ה-Audit — חאווי

### 1. אילו חלקים מופיעים תמיד בפלט?

מ-`interpretHawiQuestionInitial` (`hawi-interpreter.js:2889-2971`), ומ-`buildNarrativeByTopic` (`goral-conclusion-writer.js:1322` ואילך — משמש את רוב הנושאים דרך `writeHumanGoralConclusion`):
- הדיין (בית 15), עדים (בתים 13-14), הגעה-ישירה (תחסיל), **דמיר של חאווי** (`dhamirParagraph`, שורה 1583) — **תמיד**, ללא תנאי-topicId.
- לעומת זאת: `birthNativity` (שורה 1586), `yearlyForecast` (שורה 1594), וכל בלוק סעיף 12 ("ניתוחים נושאיים", משורה 1608) — **כן מסוננים** במפורש לפי `topicId`, כולל הערה מפורשת בקוד עצמו (שורה 1608-1609): *"כל שדה מוצג רק אם הנושא רלוונטי — מניעת הצפת מסקנות כלליות בנתונים נושאיים"*.

### 2. האם הפלט מציג פירושי בתים/צורות שאינם קשורים לשאלה?

**לא, ברמת הפלט הקצר ללקוח.** `writeShortClientVerdict` (`goral-conclusion-writer.js:1872`) בנוי כ-`switch(topicId)` מלא — כל נושא (theft/missingPerson/illness/marriage וכו') מציג **רק** את הבתים הרלוונטיים לו (למשל theft מציג רק בית 7, illness מציג בתים 1+6+8). זו דוגמה טובה למנגנון-סינון תקין.

ברמת `describeCoreHouses` (`goral-conclusion-writer.js:299`, בשימוש רק בנתיב fallback) — קיים דגל `isGenericTopic` (שורה 316) שמבחין בין קריאה-פתוחה (`foundations`/`generalReading` — מציג הכל) לשאלה ספציפית (מציג רק focus/judge/witnesses) — גם זה מנגנון-סינון תקין וקיים.

### 3. האם אבחנות רוחניות מופיעות גם כשלא נשאלה שאלה רוחנית?

**לא — האבחון הרוחני בחאווי מסונן היטב.** נבדק בשלושה מקומות נפרדים:
- `spiritualParagraph` (`goral-conclusion-writer.js:669-683`) — `shouldShow` דורש `topicId ∈ {spiritualDiagnostics, foundations, generalReading}` (שורות 676-679). לכל נושא אחר — מחזיר מחרוזת ריקה.
- `buildSpiritualNarrative` (שורה 2213) — נקרא **רק** כש-`isSpiritualTopic = topicId === 'spiritualDiagnostics'` (שורה 2202/2213).
- `writeClientReadingHebrew` (שורה 2298) — מטפל בתוכן הרוחני **רק** בענף `topicId === 'spiritualDiagnostics'` (שורה 2302).

**הערה:** `diagnoseSpiritualInfluence(question, board)` **כן מחושב תמיד** (`hawi-interpreter.js:2907`, ללא תנאי) — זה בזבוז-חישוב (הרצת isqat 7×7, בדיקת ג'ין, אבחון-איברים על כל שאלה, גם "מתי הנסיעה שלי טובה") אך **לא דולף ללקוח** כי כל 3 נקודות-התצוגה חוסמות אותו לפי topicId. זה בדיוק הדפוס ש**כשף** צריך לאמץ לדמיר: תמיד-לחשב-ברקע, אבל-להציג-רק-בתנאי.

### 4. האם עדים/דיין/משלים/בתים מודגשים מוצגים תמיד או לפי topic?

תמיד (מבנה קלאסי, לא ספציפי-לנושא) — עדים (13-14) ודיין (15) מופיעים בכל נושא ב-`buildNarrativeByTopic`. זהה למבנה בכשף (ראו סעיף א.4-5 לעיל) — כנראה זה עיקרון קבוע בגורל החול ולא "דליפת מידע לא-רלוונטי", אבל יש להחליט אם גם זה בכוונה.

### 5. האם יש routing לפי סוג שאלה או שהמנוע שופך את כל מה שהוא יודע?

**יש routing אמיתי ועובד** — `routeHawiQuestion(question)` (`hawi-interpreter.js:2890`) מזהה נושא, ו-`TOPIC_MAIN_HOUSES[topicId]` קובע אילו בתים רלוונטיים. `buildNarrativeByTopic` ו-`writeShortClientVerdict` שניהם מכבדים את זה ברוב המקומות. **החריג היחיד שנמצא: `dhamirParagraph`** (שורה 1583) — נקרא ללא כל תנאי-topicId, בניגוד לדפוס שאר הקובץ.

### 6-7. אילו חלקים צריכים להיות ללקוח / אילו פנימיים ליועץ בלבד?

- **ללקוח (מסונן כבר כראוי):** `writeShortClientVerdict`, רוב `writeClientReadingHebrew`, האבחון הרוחני (מסונן ל-topicId מתאים).
- **מועמד ל-advisor-only או gating-נוסף:** `dhamirParagraph` (שורה 1583 ב-`goral-conclusion-writer.js`) — כרגע client-facing תמיד, ראוי לבחון אם צריך תנאי-topicId כמו שאר הקטע.
- **כבר פנימי-בלבד וטוב כמודל:** `spiritualDiagnosis` המלא (עם `mainReasons`, `isqatResult`, `jinnTypeResult` וכו') — מוחזר ב-`result` המלא (לצרכי-פיתוח/ניפוי-שגיאות/advisor) אך לא מודלף ללקוח כי הרינדור מסונן.

---

## ג. השוואה — האם הבעיה זהה בשתי השיטות?

**לא זהה.** טבלת חומרה:

| | כשף — דמיר | חאווי — דמיר | חאווי — אבחון רוחני |
|---|---|---|---|
| מחושב תמיד? | כן | כן | כן |
| מוצג תמיד (ללא topicId)? | **כן — הבעיה** | **כן — בעיה, אך פחות חמורה** | לא — מסונן כראוי |
| חושף נושא-לא-קשור? | **כן, ישירות** ("מה שבאמת מעסיק אותו הוא הדת והנסיעה") | לא — רק אומר "מסכים/סותר את הדיין" | לא רלוונטי (חסום) |
| חומרה | גבוהה | נמוכה-בינונית | אין (כבר תקין) |

---

## ד. הצעת ארכיטקטורה מינימלית — Goral Rule Applicability Filter

**עיקרון:** לא לבנות מנוע-כללים חדש מאפס — לזהות שהמנגנון הנכון **כבר קיים בשני מקומות** ולהכליל אותו:
1. כשף: `kashf-topic-rules.js` כבר מגדיר per-topic מה רלוונטי (`primaryFormula`/`supportingChecks`/`keyHouses`) — **לא כולל דמיר**.
2. חאווי: `spiritualParagraph`/`buildSpiritualNarrative`/`writeClientReadingHebrew` כבר עושים `shouldShow` לפי `topicId` — **לא כולל dhamirParagraph**.

הצעה מינימלית (ל-Audit בלבד — לא מיושמת כאן): הוספת שדה-הרשאה מפורש לכל "יחידת-תוכן" (section) בשני המנועים, בדומה ל-`shouldShow` הקיים כבר ב-`goral-spiritual-diagnostics-engine.js:740`:

```js
// דוגמה עקרונית בלבד — לא קוד מיושם
sectionApplicability = {
  dhamir:              { alwaysCompute: true, showWhen: (topicId) => DHAMIR_RELEVANT_TOPICS.has(topicId) || advisorMode },
  witnessJudge:         { alwaysCompute: true, showWhen: () => true }, // מבני-קבוע, לא תלוי-נושא
  spiritualDiagnostics: { alwaysCompute: true, showWhen: (topicId) => SPIRITUAL_TOPICS.has(topicId) || advisorMode },
}
```

הרכיב הזה יכול להיות **משותף** לשתי השיטות (kashf/hawi) כי העיקרון זהה — "method + topicId + advisorMode → אילו sections להראות" — אך **הרשימות עצמן (אילו נושאים מפעילים דמיר) חייבות להיות נפרדות לכל שיטה**, כי לדמיר בכשף ("גילוי כוונה נסתרת") ולדמיר בחאווי ("אישור/סתירה של הדיין") יש משמעות שונה לגמרי במקור.

**חשוב:** אין להציע כאן החלטה על *אילו* topicId-ים בדיוק מפעילים דמיר — זו החלטת-תוכן שדורשת חזרה למקור (כשף עמ' 151-155) ואישור שלך, לא ניחוש הנדסי.

---

## ה. אילו קבצים ישתנו אם נאשר תיקון (הערכה, לא ביצוע)

| קובץ | סוג שינוי צפוי |
|---|---|
| `goral-hachol/engine/kashf-reading-engine.js` | הוספת פרמטר/דגל ל-`buildKashfReading` שמסמן אם דמיר רלוונטי לנושא/advisor-mode |
| `goral-hachol/engine/kashf-narrative-writer.js` | `writeDhamirPara` — לא לכלול ב-`detailSections` (שורה 696) אלא בתנאי |
| `goral-hachol/engine/kashf-topic-rules.js` | הוספת שדה חדש per-topic (למשל `dhamirRelevant: boolean`) |
| `goral-hachol/engine/goral-conclusion-writer.js` | `dhamirParagraph` (שורה 1583) — לעטוף בתנאי-topicId דומה לסעיף 12 |
| קובץ חדש אפשרי | `goral-rule-applicability.js` (או דומה) — אם מוחלט לבנות מנגנון משותף |
| **לא ישתנה** | `kashf-topic-rules.js` (primaryFormula/supportingChecks/keyHouses) — כבר תקין; `goral-spiritual-diagnostics-engine.js`/רינדור-רוחני-בחאווי — כבר תקין |

---

## ו. אילו בדיקות צריך להוסיף

- בדיקת-רגרסיה חדשה: לכל אחד מ-16 הנושאים בכשף (ו-29 בחאווי), להריץ קריאה אמיתית ולוודא **מה מופיע ומה לא** מופיע ב-HTML הסופי — כרגע אין שום בדיקה קיימת שבודקת absence (רק presence).
- בדיקה ספציפית: שאלת-מסחר (commerce) לא אמורה להכיל את המילים "דת"/"נסיעה"/"בית 9" בפלט הדמיר, אלא אם דמיר עצמו הצביע במפורש על רלוונטיות.
- בדיקת-קונטרסט: לוודא ש-2 הקריאות הבאות מפיקות תוכן-דמיר שונה בבירור: (א) שאלת-עסק רגילה, (ב) שאלת "מה הוא חושב עליי" — היום שתיהן מקבלות **בדיוק אותו סוג תצוגה** ללא הבדל.

## ז. אילו פלטים לדוגמה צריך לבדוק (אחרי אישור לתיקון)

| תרחיש | topicId | ציפייה אחרי תיקון |
|---|---|---|
| עסק/הצלחה | `commerce` | ללא דמיר, אלא אם דמיר תומך-ישירות בנושא עצמו |
| אהבה/כוונה ("מה הוא חושב עליי") | קיים כ-`marriage`? צריך לבדוק אם יש topicId ייעודי לכך | דמיר **כן** מוצג |
| עיתוי | תלוי-topic (`timingByMadad`/`timingByThirds`) | עיתוי מוצג רק בשאלות-עיתוי |
| רוחני | `spiritualDiagnostics` | ללא שינוי — כבר תקין |
| בריאות/חולי | `illness` | ללא דמיר (אלא אם המקור אומר אחרת) |
| השלמת עניין | `completion` | ללא דמיר כברירת מחדל |

---

## הצהרות

- זהו Audit בלבד — **לא בוצע שום תיקון קוד**, לא ב-Kashf ולא ב-Hawi.
- כל הממצאים מבוססים על קריאה ישירה בקוד עם ציטוט file:line מדויק — אין ניחוש.
- לא נגעתי בגרפיקת הקלפים, לא ב-`inner-compass`, לא חוברAI חי, לא בוצע merge/deploy.
- הצעד הבא — החלטתך: האם לאשר תיקון, ובאיזה היקף (רק כשף? גם `dhamirParagraph` בחאווי? בניית מנגנון משותף?).
