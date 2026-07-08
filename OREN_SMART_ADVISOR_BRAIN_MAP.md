# OREN_SMART_ADVISOR_BRAIN_MAP — מפת-מוח סטטית ראשונית (שלב 7)

> **מסמך בלבד. לא נכתב קוד, לא שונה HTML, לא שונה מנוע, לא נוסף AI חי, לא נוסף secret, לא בוצע deploy, לא נוצר storage, לא נוצרו embeddings, לא נוצר UI, לא נגע ב-`inner-compass`. לא בוצע commit/push — רק יצירת הקובץ.**
> תאריך: 2026-07-08. שלב 7 מתוך `OREN_SMART_ADVISOR_BRAIN_PLAN.md` — "מפת-מוח" סטטית, בלי שום קריאת-AI. כל תוכן המסמך אומת ישירות מול הריפו בזמן הכתיבה (`ls`/`grep`), לא שוחזר מזיכרון.

---

## 1. מפת קבצים ומבנה פרויקט

### קבצי HTML מרכזיים (שורש הריפו)
| קובץ | תפקיד |
|---|---|
| `index.html` | login |
| `calculator.html` | דשבורד ראשי — כולל גורל העשיריות, נומרולוגיה, תהילים, גימטריה, יומן, ועוד כלים |
| `goral-hachol.html` | האפליקציה הראשית — גורל החול (חאווי + כשף), 2,236+ שורות |
| `goral-hachol-new.html` | גרסה חלופית/ניסיונית |
| `myseal.html` | אפליקציית חותם/טליסמאני |
| `ramal-shastra.html`, `kashf-al-asrar-arabic-only.html` | מסכי-עזר/תצוגה נלווים |
| `_mockup1/2/3.html`, `font-preview.html`, `tune.html` | קבצי-עבודה/mockup, לא חלק מהזרימה הראשית |

### תיקיות מנועים
`goral-hachol/engine/` — 21 קבצי-מנוע: `goral-conclusion-writer.js`, `hawi-interpreter.js` (חאווי), `kashf-reading-engine.js`+`kashf-narrative-writer.js`+`kashf-topic-rules.js`+`kashf-dhamir.js`+`kashf-dhamir-type4-external.js`+`kashf-figure-appearance.js`+`kashf-figure-classifier.js`+`kashf-formula-engine.js`+`kashf-legacy-chart-adapter.js`+`kashf-leshon-hainyan.js`+`kashf-pending-extraction.js`+`kashf-book-additions.js` (כשף), `raml-board-generator.js`+`raml-board.js`+`raml-figures.js`+`raml-interpreter.js` (לוח משותף — `raml-interpreter.js` קוד-מת, לא נטען מ-`goral-hachol.html`), `narrative-fact-phrasing.js` (שכבת-הסינתזה החדשה, מסחר בלבד כרגע), `goral-spiritual-diagnostics-engine.js` (אבחון רוחני), `goral-client-archive.js` (ארכיון-לקוחות, `localStorage`), `other-sources-pending-extraction.js` (תוכן ממקורות לא-חאווי/לא-כשף שהוצא מהמנועים).

`goral-hachol/ui/` — `goral-app.js` (UI state ראשי), `goral-hachol-ui.js` (קוד-מת, לא נטען מ-`goral-hachol.html` — רק מ-`goral-hachol-test.html`), `question-bank.js` (בנק 138 שאלות, `topicId`+`kashfTopicId` נפרד לכל שאלה).

### תיקיות `data`
`goral-hachol/data/sources/`:
- `hawi/` — `hawi-source.js`, `hawi-metadata.js`, `hawi-topic-index.js`, `hawi-knowledge-router.js`, `hawi-full-book-gap-audit.js` + תיקיות `figure-transits/`, `figure-states/`, `question-rules/`, `foundations/`, `birth-nativity/`, `yearly-forecast/`, `triangles/`, `planetary-correspondences/`, `authority-state/`.
- `kashf-al-asrar/` — `kashf-al-asrar-book.js` (הספר המובנה, 13,577+ שורות), `kashf-book-sections.js`, `kashf-figure-names.js`, `kashf-hazz.js`, `kashf-shibutzim.js`, `kashf-gate5-foundational-figures.js`, `kashf-topics-per-house.js`, `kashf-topic-house11-friends-hope.js`, וקבצי `kashf-figure-*-gate2.js` (שער 2, תכונות/תיאורים/סיווג).
- `al-falak-al-mashhun/` — `al-falak-abjad-decomposition.js` (מקור חיצוני-מוצהר, לא כשף — ראו סעיף 4).
- `approved-raml/spiritual-diagnostics/` — חומר אבחון-רוחני ממוקור.
- `komilla/` — `komilla-vedic-astrology.html` (מודול נפרד, לא חלק מגורל החול).

### תיקיית `ai/` (חדשה, נבנתה השבוע)
- `ai/provider/anthropic-provider.js` — שכבת-adapter כללית ל-Anthropic (fetch גולמי, ללא SDK, ללא מפתח/מודל מקובעים).
- `ai/provider/_test-anthropic-provider.mjs` — בדיקת-mock (12 בדיקות, בלי רשת אמיתית).
- `ai/prompts/cartomancy-runtime.md` — תוכן-prompt **מלא** (ייחוס בלבד כרגע, קלפים נדחו לעדיפות שלישית).
- `ai/prompts/hawi-runtime.md`, `ai/prompts/kashf-runtime.md` — **stub בלבד**, לא תוכן אמיתי.

### תיקיית `supabase/functions/` (חדשה)
- `supabase/functions/oren-smart-ai/index.ts` — שלד Edge Function ל-Runtime AI (**לא נפרס**), נועד ללקוח (לא לבינה הפנימית). כשתיבנה Edge Function למוח-הפנימי, לפי `OREN_SMART_ADVISOR_BRAIN_PLAN.md` סעיף 6, היא צריכה להיות **פונקציה נפרדת** (למשל `oren-advisor-brain`), לא זו.

### מסמכי-תכנון קיימים (שורש הריפו)
`CLAUDE.md` (המסמך השולט), `AGENTS.md`, `WORKPLAN.md` (יומן-עבודה ראשי, סעיפים #1–#29 עד כה), `GORAL_WORKPLAN.md` (יומן-עבודה ישן/נפרד לגורל החול — 12/12 משימות הושלמו לפי כותרתו), `GORAL-SYSTEM-RULES.md` (זיכרון-מערכת לגורל החול, מבוסס-כשף), `OREN_APP_STRUCTURE.md`, `OREN_CONCLUSION_STYLE_SPEC.md`, `OREN_AI_SUPERVISOR_SPEC.md`, `OREN_EXISTING_AI_API_AUDIT.md`, `MERGE_INNER_COMPASS_INTO_HALL_OF_WISDOM_REPORT.md`, `AI_RUNTIME_GORAL_HACHOL_FIRST_PLAN.md`, `AI_RUNTIME_PHASE_6_SHARED_SYNC_PLAN.md`, `OREN_SMART_ADVISOR_BRAIN_PLAN.md`, `README.md` (חד-שורתי).

**הערה:** קיימים **שני מסמכי "כללי-מערכת" ישנים יותר** (`GORAL_WORKPLAN.md`, `GORAL-SYSTEM-RULES.md`) שלא עודכנו לצד `WORKPLAN.md`/`CLAUDE.md` החדשים יותר — פוטנציאל-לבלבול לבינה העתידית (איזה מסמך סמכותי?). מסומן כשאלה-פתוחה בסעיף 6.

## 2. מפת מודולים

| מודול | קיים בקוד? |
|---|---|
| גורל החול / חאווי | ✅ קיים ופעיל |
| גורל החול / כשף אל-אסראר | ✅ קיים ופעיל |
| גורל העשיריות | ✅ קיים בתוך `calculator.html` (לא נמצא קובץ-JS ייעודי נפרד בחיפוש) |
| קלפים / Cartomancy | ❌ **לא קיים ב-hall-of-wisdom** — קיים רק ב-`inner-compass` (ריפו נפרד) |
| דוחות | ⚠ אין מודול-UI ייעודי ל"דוחות" — קיימים מסמכי-`OREN_*`/`WORKPLAN.md` כתיעוד-פיתוח, ו-`goral-client-archive.js` כתיעוד-קריאות-לקוח |
| ארכיון לקוחות | ✅ קיים — `goral-client-archive.js`, `localStorage` בלבד, אין backend |
| Runtime AI | ⚠ **תשתית בלבד** — `ai/provider`, `ai/prompts` (2/3 stub), שלד Edge Function. אין AI חי, אין deploy |
| Smart Advisor Brain (מוח פנימי) | ⚠ **תכנון בלבד** — `OREN_SMART_ADVISOR_BRAIN_PLAN.md` + המסמך הזה (שלב 7). אין קוד |

## 3. מצב כל מודול

### גורל החול / חאווי
- **בנוי:** `hawi-interpreter.js` (buildFinalConclusion, boardAnalysis), `goral-conclusion-writer.js` (writeHumanGoralConclusion — 2,850+ שורות, ~20 ענפי-נושא), `data/sources/hawi/` (figure-transits לכל 16 צורות × 16 בתים, figure-states, question-rules).
- **מתוכנן:** גלגול שכבת-הסינתזה (`narrative-fact-phrasing.js`) ל-19 נושאים נוספים (כרגע רק מסחר) — WORKPLAN #26, פתוח. `hawi-runtime.md` (Runtime AI) — stub, מתוכנן ב-`AI_RUNTIME_GORAL_HACHOL_FIRST_PLAN.md`.
- **חסר:** תיעוד-מלא ל-`hawi-interpreter.js` (WORKPLAN #20: "כ-90 פונקציות/קבועים, לא כולם אומתו שורה-שורה מול המקור").
- **מסוכן לשנות:** `MALEFIC_FIGURE_PATTERNS`/טבלאות-כוכב-צורה (כבר תוקנו פעם אחת, WORKPLAN #17/#20 — היסטוריית-באגים אמיתית באזור הזה).
- **קבצים קשורים:** `hawi-interpreter.js`, `goral-conclusion-writer.js`, `narrative-fact-phrasing.js`, `data/sources/hawi/**`, `question-bank.js` (שדה `topicId`).

### גורל החול / כשף אל-אסראר
- **בנוי:** `kashf-reading-engine.js`+`kashf-narrative-writer.js` (29 נושאים), `kashf-al-asrar-book.js` (הספר המובנה), שער 4 (5 שיטות דמיר, 3 פעילות + סוג 4 עם מקור-חיצוני מגולה), שער 5 (4 צורות-יסוד), אבחון-רוחני, `kashfTopicId` עצמאי בבנק-השאלות.
- **מתוכנן:** `kashf-runtime.md` (Runtime AI) — stub, **אחרי** חאווי לפי סדר-העדיפויות המעודכן.
- **חסר:** שער 4 סוג 5 (הליכה איטרטיבית, ללא כלל-עצירה מוגדר במקור) — לא מיושם. חלק משיבוצי שער 3 (4-15) ללא שימוש מזוהה בספר.
- **מסוכן לשנות:** `kashf-figure-appearance.js` — **אסור לגעת** לפי `AGENTS.md` כלל 13 (החלטת-משתמש מוקדמת, לא לשינוי).
- **קבצים קשורים:** כל 12 קבצי ה-`kashf-*.js` ב-`engine/`, כל `data/sources/kashf-al-asrar/**`, `kashf-dhamir-type4-external.js`+`al-falak-al-mashhun/` (מקור-חיצוני-מגולה, לא כשף עצמו).

### גורל העשיריות
- **בנוי:** בתוך `calculator.html` (לא אותר קובץ-מנוע נפרד ב-`goral-hachol/engine/`).
- **חסר:** תיעוד-ארכיטקטורה — לא מוזכר בפירוט ב-`CLAUDE.md`/`OREN_APP_STRUCTURE.md` באותה רמה כמו חאווי/כשף. **שאלה פתוחה** (סעיף 6) — היכן בדיוק הלוגיקה חיה בתוך `calculator.html`.
- **מסוכן לשנות:** לא ידוע — נדרשת בדיקה ייעודית לפני כל שינוי, כי אין עדיין מיפוי-קבצים ברור.

### קלפים / Cartomancy
- **לא קיים ב-hall-of-wisdom.** קיים ב-`inner-compass` (Next.js/React/TypeScript, ריפו נפרד) — כולל אינטגרציית-Anthropic עובדת (`OREN_EXISTING_AI_API_AUDIT.md`).
- **מתוכנן:** `ai/prompts/cartomancy-runtime.md` כבר נכתב כייחוס-מבנה (לא קוד פעיל). מיזוג-אפשרי תועד ב-`MERGE_INNER_COMPASS_INTO_HALL_OF_WISDOM_REPORT.md` (אופציה B) — לא הוחלט.
- **מסוכן לשנות:** אין מה לשנות ב-hall-of-wisdom (לא קיים כאן). כל שינוי עתידי דורש קודם החלטת-מיזוג.

### דוחות
- **בנוי:** אין UI-ייעודי; קיימים מסמכי-Markdown (היסטוריית-החלטות) ו-`goral-client-archive.js` (תיעוד-קריאות).
- **חסר:** מודול "דוחות" במובן-מוצרי (למשל דוח-מרוכז-ללקוח, ייצוא-PDF) לא אותר בקוד.

### ארכיון לקוחות
- **בנוי:** `goral-client-archive.js` — `localStorage` בלבד (`goralHacholClientReadingsArchive_v1_${userId}`), אין שרת/DB.
- **חסר:** סנכרון-רב-מכשירי (תלוי `localStorage` מקומי בלבד — לא זמין ממכשיר אחר).
- **מסוכן לשנות:** מבנה-המפתח בlocalStorage (`STORAGE_KEY`) — שינוי-פורמט עלול "לאבד" ארכיונים קיימים של לקוחות אמיתיים בלי מיגרציה.

### Runtime AI
- **בנוי:** תשתית בלבד (סעיף 1) — `anthropic-provider.js` מאומת (12/12 mock-tests), שלד Edge Function לא-פרוס.
- **מתוכנן:** `hawi-runtime.md` (ראשון), `kashf-runtime.md` (שני), קלפים (שלישי) — לפי `AI_RUNTIME_GORAL_HACHOL_FIRST_PLAN.md`. סנכרון ל-`supabase/functions/_shared/` תוכנן ונדחה (`AI_RUNTIME_PHASE_6_SHARED_SYNC_PLAN.md`).
- **מסוכן לשנות:** אין עדיין קוד-חי לשנות (הכל תשתית לא-מחוברת) — הסיכון האמיתי יתחיל רק בשלב ה-deploy/prompt-אמיתי.

### Smart Advisor Brain (מוח פנימי)
- **בנוי:** שני מסמכי-תכנון בלבד (`OREN_SMART_ADVISOR_BRAIN_PLAN.md` + מסמך זה). אין קוד, אין storage, אין UI.
- **מתוכנן:** שלב 8 (ממשק-שאלות) ושלב 9 (מאגר-ספרים) — שניהם ממתינים לאישור נפרד.

## 4. מקורות מאושרים לפי שיטה

- **חאווי:** רק מקורות-חאווי שאורן משה אישר במפורש לשיטת חאווי. אין להשתמש במקורות-כשף כדי להשלים חאווי אלא אם אושר במפורש, מקרה-לגופו.
- **כשף אל-אסראר:**
  1. המקור הערבי — كشف الأسرار المصونة في إخراج الضمائر المخزونة (המובנה כבר באפליקציה, `kashf-al-asrar-book.js`).
  2. התרגום העברי של אורן משה — **חשיפת הסודות הנצורים**.
  שני המקורות עובדים יחד: הערבית כמקור-יסוד, התרגום העברי כמקור-עבודה-והבנה.
- **אין לערבב בין חאווי לכשף** — כל שיטה נשארת במסלול-המקורות שלה.
- **אם אין מקור מאושר לשיטה** (למשל: גורל-העשיריות, כל ספר עתידי, `al-falak-al-mashhun` שכבר מגולה-כמקור-חיצוני-לא-כשף) — הבינה עונה: **"לא נמצא במקורות המאושרים לשיטה הזאת."**

## 5. כללי-סיכון לפני שינוי-קוד

- **לא לשנות מנוע בלי להבין מי קורא לו** — יש קוד-מת מתועד בריפו (`raml-interpreter.js`, `goral-hachol-ui.js` — לא נטענים מ-`goral-hachol.html`); שינוי-בטעות בקובץ הלא-נכון לא ישפיע על האתר החי ועלול ליצור תחושת-ביטחון-שווא.
- **לא לשנות HTML בלי לבדוק כפתורים וזרימה** — `goral-hachol.html` מכיל תפריט-צד עם `showPage()`/`location.href` — שינוי-מבנה עלול לשבור ניווט בלי שגיאת-קונסולה מיידית.
- **לא לחבר AI בלי fallback** — עיקרון שכבר ממומש בקוד הקיים (`anthropic-provider.js`/`index.ts` תמיד `{ok:false, fallback:true}`), חובה לשמר בכל הרחבה עתידית.
- **לא להכניס secret לריפו** — תקדים-אמיתי-שקרה (`inner-compass/.env.local`, `OREN_EXISTING_AI_API_AUDIT.md`) — לא תיאורטי.
- **לא להכניס ספרים מלאים לריפו ציבורי** — `OREN_SMART_ADVISOR_BRAIN_PLAN.md` סעיף 5 — מאגר-ידע פרטי בלבד.
- **לא לשנות התנהגות ללקוח בלי אישור אורן משה** — כלל-העל של `AGENTS.md`/`OREN_AI_SUPERVISOR_SPEC.md`.

## 6. שאלות פתוחות — לבירור לפני בנייה אמיתית של הבינה

- היכן יאוחסן הידע הפרטי בפועל (Supabase Storage? טבלת-DB? שילוב)?
- איך מכניסים ספרים בפועל — תהליך-עבודה מדויק (מי מעלה, איך מתעד עמוד/פרק, מי מאשר-לפני-שהבינה-משתמשת)?
- איך מזהים מקור/עמוד/שיטה בבירור בתשובת-הבינה — פורמט-ציטוט קבוע?
- איך הבינה תענה עם מקור — תמיד לצטט ספר+עמוד, גם בתשובות-קצרות?
- איך מגינים על הממשק הפנימי — האם login הקיים (Supabase auth) מספיק, או נדרשת שכבת-הרשאה נוספת (רק אורן, לא כל מי שיש לו חשבון)?
- מה יהיה שלב-ההפעלה-הראשון בפועל — מסמך-אינדקס סטטי (JSON/MD) בלבד, או כבר קריאת-AI-ראשונה מוגבלת?
- מה מעמדם המדויק של `GORAL_WORKPLAN.md`/`GORAL-SYSTEM-RULES.md` הישנים ביחס ל-`WORKPLAN.md`/`CLAUDE.md` — האם הבינה צריכה להתייחס לשניהם, או שהישנים מיושנים ויש לסמן אותם ככאלה?
- היכן בדיוק לוגיקת "גורל העשיריות" חיה בתוך `calculator.html` — לא מופה עדיין ברמת-קובץ/פונקציה.

## 7. המלצה לשלב הבא

מסמך זה (שלב 7) **הוא** מפת-המוח הסטטית — אין צורך בשלב-ביניים נוסף לפני שהוא "מוכן". הצעד הבא **הכי בטוח**, כשיאושר בנפרד, הוא **לענות על שאלות-הפתוחות** בסעיף 6 (בירור מול אורן משה, לא קוד) — במיוחד: מיקום-האחסון הפרטי, ורמת-ההגנה על הממשק הפנימי — כי שתיהן קובעות ישירות את הארכיטקטורה של שלב 8 (`OREN_SMART_ADVISOR_BRAIN_PLAN.md`) לפני שכותבים ממנה שורת-קוד אחת.

---

## הצהרות

- שום קוד לא נכתב, שום HTML לא שונה, שום מנוע לא נגע.
- שום AI חי, secret, deploy, storage, embeddings, או UI — לא נוצרו.
- שום נגיעה ב-`inner-compass`.
- שום commit/push — רק יצירת קובץ המסמך הזה.
- הצעד הבא — לפי החלטת אורן משה בלבד.
