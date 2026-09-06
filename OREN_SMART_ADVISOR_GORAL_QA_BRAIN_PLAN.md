# OREN_SMART_ADVISOR_GORAL_QA_BRAIN_PLAN — Oren Smart Advisor: Goral QA Brain

> **מסמך תכנון בלבד. אין בו קוד, אין deploy, אין AI חי, אין secret.**
> תאריך: 2026-07-09. ממשיך את `OREN_SMART_ADVISOR_SITE_BRAIN_POC_PLAN.md` ו-`GORAL_RULE_APPLICABILITY_AUDIT.md` — **מחליף** את שיטת "תיקון-שאלה-אחר-שאלה" שרצנו בשני התיקונים האחרונים (`49abd7c`, `70953ec`) בתשתית שבודקת את **כל** גורל החול באופן שיטתי.

---

## 0. למה זה קורה עכשיו — הקשר

בשני התיקונים האחרונים מצאנו ותיקנו שתי בעיות אמיתיות (דמיר מוצג-תמיד, תווית-בית מטעה) — כל אחת התגלתה **רק כי ראית אותה בעיניים ב-Preview**, שאלה אחת בכל פעם. זו לא שיטת-עבודה שמתכנסת: יש 29 topicId בכשף, ~29 בחאווי, ועשרות legacy-fn/supportingChecks/sections בכל אחד — אין דרך לגלות את כולן ידנית שאלה-אחר-שאלה. **בינת אורן — Goral QA Brain** היא תשתית שמריצה שיטתית שאלות-בדיקה על שתי השיטות, אוספת את הפלט המובנה, ובודקת (בהתחלה ברמה דטרמיניסטית, בהמשך עם AI) האם הפלט מתאים לשאלה — ומפיקה רשימת-בעיות + הוראת-תיקון לקלוד קוד, במקום שאתה תמצא כל בעיה ידנית.

---

## A. Scenario Runner

מריץ קבוצת שאלות-בדיקה קבועה על שתי השיטות, בלוחות אמיתיים (לא מדומיינים — כמו כל בדיקות הרגרסיה הקיימות בריפו).

**10 קטגוריות שאלה × 2 שיטות = 20 תרחישי-בדיקה בסיס** (ניתן להרחיב):

| קטגוריה | topicId מוצע — כשף | topicId מוצע — חאווי |
|---|---|---|
| עסק/הצלחה | `commerce` | `commerce` |
| אהבה/כוונת אדם | `marriage` (אין topicId ייעודי ל"כוונה" — ראו `GORAL_RULE_APPLICABILITY_FIX_PRECOMMIT_REPORT.md`) | `loveHate` |
| עיתוי | `completion` (עיתוי נגזר מ-`dhamirExtras`) | `yearlyForecast`/`birthNativity` |
| רוחני | `spiritualDiagnostics` | `spiritualDiagnostics` |
| חולי/בריאות | `illness` | `illness` |
| השלמת עניין | `completion` | `completion` |
| נסיעה | `travel` | `travel` |
| כסף/פרנסה | `money` | — (אין topicId נפרד; קרוב ל-`commerce`) |
| אויבים/יריבים | `enemies` | `enemies` |
| שאלה כללית | `generalReading` | `generalReading`/`foundations` |

**קובץ מוצע (חדש):** `goral-hachol/qa/goral-qa-scenarios.js` — מערך `{ method, topicId, question, mothers }` קבוע, `mothers` בפורמט-מחרוזות זהה לזה שכבר בשימוש בכל `_test_kashf_*.mjs` (`buildRamlBoardFromMothers(['1112','2122','1121','2211'])`). **אין המצאת-נתונים** — כל שאלה מנוסחת בעברית טבעית, כל `topicId` נלקח מרשימת ה-topicId האמיתית שכבר קיימת ב-`kashf-topic-rules.js`/`hawi-interpreter.js`.

---

## B. Engine Output Collector

פונקציה טהורה (לא AI, לא רשת) שמריצה תרחיש בודד ומחזירה אובייקט מובנה אחיד לשתי השיטות:

```js
{
  method: 'kashf' | 'hawi',
  topicId, question,
  board: { mothers, chart },           // הלוח שנוצר בפועל
  clientOutputHtml,                     // writeKashfReading(reading) / finalConclusionHebrew
  advisorOnlyOutput,                    // writeKashfReading(reading, {mode:'advisor'}) / result המלא
  sectionsShown: [...],                 // מ-goral-rule-applicability.js — אילו sections הוצגו
  sectionsHidden: [...],                // אילו הוסתרו, ולמה (showToClient:false)
  warnings: reading.boardValidation?.warnings,
  sourceRulesApplied: [...],            // sourceText של primaryFormula/altFormula/supportingChecks שהופעלו בפועל
}
```

**נקודה מרכזית:** `sectionsShown`/`sectionsHidden` דורשים ש-`goral-rule-applicability.js` (שכבר קיים, נבנה בתיקון האחרון) **ידווח** את החלטתו במקום רק להחיל אותה בשקט — הרחבה קטנה ולא-פולשנית לפונקציה הקיימת (מחזירה כבר `{showToClient, keepAdvisorOnly}` — רק צריך לאסוף את זה לרשימה במקום לזרוק).

**קובץ מוצע (חדש):** `goral-hachol/qa/goral-qa-output-collector.js` — מייבא `buildKashfReading`/`writeKashfReading`/`interpretHawiQuestionInitial` **ישירות מהקבצים הקיימים, ללא שינוי בהם** (למעט ההרחבה הקטנה הנ"ל).

---

## C. Smart Advisor Evaluator — שני שכבות

**שכבה 1 — דטרמיניסטית (בלי AI, אפשר לבנות ולהריץ מיד):**
בדיקות-מבנה אוטומטיות שממש כבר עשינו ידנית ב-`GORAL_RULE_APPLICABILITY_AUDIT.md` — למשל: "האם `clientOutputHtml` מכיל את השם הנושאי המלא (`HOUSE_NAMES`) של בית שמסומן `isFormulaOnly`", "האם `clientOutputHtml` מכיל טקסט-דמיר כש-`topicId` לא ברשימת ה-allowlist", "האם יש section עם `outputHebrew` שמכיל 'אין לכלל זה תחולה' ועדיין מופיע ב-HTML". זו בעצם **הפיכת הממצאים הידניים האחרונים לכללים אוטומטיים קבועים** — יתפוס רגרסיות עתידיות בלי לחכות שתראה אותן ב-Preview.

**שכבה 2 — AI-מבוסס (דורש Edge Function + Anthropic, שלב מאוחר יותר):**
שיפוט סמנטי שדורש הבנת-שפה: "האם התשובה בכלל עונה על השאלה שנשאלה", "האם יש ניסוח לא-מקצועי", "האם יש סתירה בין `verdict-box` הקצר לפסקת-הקריאה-ללקוח", "האם המידע נאמן לשיטת המקור (בהשוואה ל-`sourceText`)". זו השכבה שדורשת `callAnthropic` דרך ה-Edge Function הקיים.

**חשוב:** שכבה 1 לבדה **כבר תופסת את שתי הבעיות שתיקנו היום** (דמיר-לא-מסונן, תווית-בית-מטעה) — כלומר יש ערך מיידי גם בלי AI בכלל.

---

## D. Knowledge Context — מקורות-ידע, ללא המצאה

בהתאם לכלל "No Invented Data" (CLAUDE.md), ה-Brain **לא** מקבל שום ידע חיצוני. מקורות מותרים בלבד:
1. **קבצי-חוקים קיימים** — `kashf-topic-rules.js` (`sourceText` בכל formula/check), `hawi-interpreter.js`/`data/sources/hawi/**` (`figure-transits`, `hawi-knowledge-router.js`).
2. **הספרים המובנים** — `kashf-al-asrar-book.js`, `hawi-source.js`.
3. **תוצרי-המנוע עצמם** — `reading`/`result` המובנה, לא טקסט חופשי שממציא ה-AI.

ה-prompt (כשייבנה בפועל, שלב מאוחר) יצטרך לצטט את ה-`sourceText` הרלוונטי **מתוך** ה-`Engine Output Collector` (סעיף B) — לא לשלוף ידע-רמל כללי מהאימון של המודל. זה מבטיח שהביקורת עצמה נשארת "נאמנה למקור", לא רק הפלט שהיא בודקת.

---

## E. Output Schema

הסכימה שביקשת **מתלכדת** עם ה-12 מפתחות שכבר הוגדרו ב-`OREN_SMART_ADVISOR_SITE_BRAIN_POC_PLAN.md` (לא כפילות — הרחבה). Goral QA Brain יהיה `module: 'goralQA'` בתוך הראוטר הכללי הקיים, עם schema ייעודי:

```js
{
  module: 'goralQA',
  method,                        // 'kashf' | 'hawi'
  questionType,                  // אחת מ-10 הקטגוריות בסעיף A
  engineAnswerSummary,           // תמצית מה שהמנוע ענה בפועל
  detectedProblems: [ { section, description, evidence } ],
  irrelevantSections: [ sectionId ],
  missingRelevantSections: [ sectionId ],
  sourceRuleConflicts: [ { rule, conflictWith } ],
  advisorOnlyRecommendations: [ sectionId ],
  clientOutputProblems: [ description ],
  severity: 'low' | 'medium' | 'high',
  recommendedFix: string,
  codeInstructionForClaude: {    // אותו מבנה שכבר קיים ב-schema הכללי
    needed, instruction, filesToInspect, filesNotToTouch, testsToRun,
  },
  testsToAdd: [ description ],
  needsOrenDecision: boolean,
}
```

---

## F. UI / Report

- **לא ללקוח, בשום מצב** — עקרון-הברזל שכבר נקבע ב-`OREN_SMART_ADVISOR_PANEL_PLACEMENT_DECISION.md`, תקף גם כאן.
- **החלטת-מוצר פתוחה (לא מכריע כאן):** בניגוד לפאנל ה-MOCK הנוכחי (שמוצג *בתוך* מסך-קריאה בודד, אחרי קריאה אחת), QA Brain מריץ **20+ תרחישים בבת-אחת** — זה כלי-בדיקה-אצווה (batch), לא תוספת-לכל-קריאה. שתי אפשרויות שקולות לדיון איתך:
  - (א) מסך-אדמין נפרד בתוך האתר (מוגן באותו Auth/UID allowlist), עם כפתור "הרץ בדיקת עומק" ורשימת-בעיות.
  - (ב) כלי מקומי בלבד (סקריפט Node, כמו `_test_*.mjs` הקיימים) שמפיק דוח Markdown — בלי לגעת ב-UI של האתר בכלל, מתאים לשלבים המוקדמים (2-3) לפני שיש בכלל AI מחובר.
- **כפתור "העתק הוראה לקלוד קוד"** — התבנית כבר קיימת ועובדת בפאנל ה-MOCK (`renderOrenAdvisorPanel`/`#orenAdvisorCopyBtn`) — ניתנת לשימוש-חוזר ישירות.

---

## G. Security

זהה לחלוטין למדיניות שכבר נבנתה ואומתה ב-`supabase/functions/oren-smart-advisor/index.ts`:
- מפתח-AI **לעולם לא בדפדפן** — רק `Deno.env.get('ANTHROPIC_API_KEY')` בתוך Edge Function.
- גישה רק דרך Edge Function מוגנת, עם אימות-Supabase-Auth אמיתי + `ALLOWED_OREN_UID` allowlist, fail-closed על כל קונפיגורציה חסרה (כבר קיים ונבדק, 34 assertions).
- Goral QA Brain הוא **module נוסף בתוך אותו ראוטר** (`module: 'goralQA'`) — לא Edge Function נפרדת, לא נתיב-אבטחה נפרד.
- **הפרדה מוחלטת פלט-לקוח מול פלט-יועץ** — QA Brain לא מייצר בכלל "תשובה ללקוח" (אין `clientAnswerDraft` בסכימה שלו, בניגוד ל-Brain הכללי) — הוא מנתח פלטים קיימים, לא מייצר קריאה חדשה.
- שדות-לקוח רגישים (טלפון, `dynFields`) — ממשיכים להיחסם על ידי `kashf-context-sanitizer.js` הקיים בכל מקום שבו התרחישים כוללים `clientContext`.

---

## H. Implementation Phases

| שלב | תוכן | דורש AI/secret/deploy? | אישור נפרד נדרש? |
|---|---|---|---|
| 1 | **מסמך זה** — QA Brain PLAN | לא | ✅ זה מה שמאושר עכשיו |
| 2 | Scenario fixtures (20 שאלות) + Output Collector + שכבה-1 דטרמיניסטית — **מריץ מקומית, `node`, בלי AI** | לא | כן — שלב-קוד נפרד |
| 3 | חיבור ל-Edge Function הקיימת (`oren-smart-advisor`) — הוספת `module:'goralQA'` לראוטר, עדיין עם `deps.verifyToken`/mock ב-tests | לא (רק חיווט, בלי secret אמיתי) | כן |
| 4 | חיבור ל-Anthropic עם secret אמיתי (שכבה-2) | **כן** | כן — שלב רגיש, דורש אישור נפרד ומפורש |
| 5 | הרצת 20 שאלות-הבדיקה הראשונות דרך שכבה-2 | כן (AI חי) | כן |
| 6 | דוח-בעיות אוטומטי (Markdown/UI) | תלוי בהחלטת F | כן |
| 7 | תיקוני-מנועים לפי סדר-עדיפות מהדוח (**לא לפני שיש דוח מלא**) | לא | כן, לכל תיקון בנפרד — כמו עד היום |

**שלבים 2-3 לא דורשים AI, secret, או deploy בכלל** — ניתן לבנות ולבדוק אותם באופן זהה לכל קובץ `_test_*.mjs` קיים בריפו.

---

## מה לא נעשה כרגע (לפי הנחייתך)

- ❌ שום תיקון נוסף במנועי Kashf/Hawi.
- ❌ שום שינוי בגרפיקת/CSS הקלפים.
- ❌ שום merge ל-`main`.
- ❌ שום production deploy.
- ❌ שום חיבור AI חי.
- ❌ שום נגיעה ב-`inner-compass`.

---

## תשובות לשאלות שלך

**1. האם זה אפשרי במבנה הקיים?**
כן, ובמידה רבה יותר ממה שנראה במבט ראשון — רוב האבנים כבר קיימות: שני המנועים כבר מחזירים אובייקטים מובנים (לא רק HTML), `goral-rule-applicability.js` כבר פותר בדיוק את "מה advisor-only", תשתית ה-AI (`ai/provider`+`ai/prompts`+Edge Function+schema-12-מפתחות) כבר תוכננה ואומתה מבנית בפרק קודם של הסשן הזה. QA Brain הוא בעיקר **הרכבה מחדש** של חלקים קיימים סביב לולאת-תרחישים, לא בנייה מאפס.

**2. אילו קבצים קיימים כבר שאפשר להשתמש בהם?**
`goral-hachol/engine/raml-board-generator.js` (יצירת-לוח), `kashf-reading-engine.js`+`kashf-narrative-writer.js` (מנוע+כתיבה, כשף), `hawi-interpreter.js`+`goral-conclusion-writer.js` (חאווי), `goral-rule-applicability.js` (הבסיס לשכבה-1), `kashf-topic-rules.js` (מקור ל-`sourceText`/topicId), `ai/provider/anthropic-provider.js`, `ai/prompts/oren-smart-advisor-brain.prompt.md`, `supabase/functions/oren-smart-advisor/index.ts` (auth gate מוכן), `kashf-context-sanitizer.js` (חסימת-שדות-רגישים).

**3. אילו קבצים חדשים צריך ליצור?**
`goral-hachol/qa/goral-qa-scenarios.js` (20 התרחישים), `goral-hachol/qa/goral-qa-output-collector.js` (איסוף מובנה), `goral-hachol/qa/goral-qa-deterministic-checks.js` (שכבה-1, בלי AI), בהמשך: `ai/prompts/goral-qa-brain.prompt.md` (prompt ייעודי לשכבה-2), עדכון-חיווט ב-Edge Function הקיימת (לא קובץ חדש — `module:'goralQA'` בראוטר הקיים), ולבסוף כלי-דוח (UI או סקריפט).

**4. האם צריך Edge Function אמיתית עכשיו או אפשר להתחיל ב-QA harness מקומי?**
**מומלץ להתחיל מקומי (שלב 2).** יש ערך מיידי ומוכח בשכבה-1 הדטרמיניסטית — היא לבדה הייתה תופסת את שתי הבעיות שתיקנו היום, ולא דורשת שום secret/deploy/AI. Edge Function (שלב 3) רלוונטית רק כשעוברים לשכבה-2 (שיפוט סמנטי).

**5. מה השלב הראשון המומלץ לביצוע אחרי אישור אורן?**
**שלב 2**: בניית 20 תרחישי-הבדיקה + ה-Output Collector + שכבת-הבדיקות-הדטרמיניסטית, ללא AI. תוצר מוחשי מיידי: הרצה של `node goral-qa-runner.mjs` שמפיקה רשימת-בעיות אמיתית על **כל** גורל החול בבת-אחת, לא שאלה-אחר-שאלה — כולל regression-guard שמונע מהבעיות שתיקנו היום לחזור בשקט.
