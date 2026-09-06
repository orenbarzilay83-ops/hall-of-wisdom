# OREN_SMART_ADVISOR_SITE_BRAIN_POC_PLAN — Oren Smart Advisor Brain, מסמך-על לכל האתר

> **מסמך תכנון+מפרט בלבד. לא חובר API חי, לא נוסף secret, לא בוצע deploy, לא שונה HTML/UI/מנועים/narrative, לא נגע ב-`inner-compass`, לא נמחק שום קובץ-קיים, לא מוזג ל-main. לא בוצע commit/push — רק יצירת/עדכון-הקבצים.**
> תאריך: 2026-07-08. **מסמך-העל** לכל הבינה הפנימית של אורן משה. מחליף את המיקוד-הצר-מדי של `KASHF_AI_FINAL_SYNTHESIS_POC_PLAN.md` (שנשאר, כפיילוט-מפורט, ראו §6) — הבינה הזו **לא** נבנית "בשביל כשף", היא נבנית **בשביל אורן משה, על כל היכל החכמה והתבונה**, וכשף/commerce הוא רק הפיילוט-הראשון-להוכחת-היתכנות.

---

## 1. תפקיד הבינה

**Oren Smart Advisor Brain** היא בינה-פנימית **ליועץ בלבד** (אורן משה) — **לא client-facing**, לא-רואה-אותה שום לקוח, לא-מגיעה לשום מסך-קריאה באתר.

עקרונות-יסוד:
- **לא מחליפה מנועים** — כל חישוב-גורלי (חאווי/כשף/עתידי-קלפים) נשאר דטרמיניסטי, בקוד קיים, בלתי-תלוי-בבינה.
- **לא מחליפה ספרים** — הידע-המקורי (כשף אל-אסראר, חאוי) נשאר מקור-האמת; הבינה קוראת-ממנו, לא-כותבת-אותו-מחדש.
- **לא מחליפה את אורן משה** — כל החלטה-מהותית (על-קוד, על-ניסוח-קבוע, על-כלל-חדש) חוזרת אליו; הבינה **ממליצה**, לא-מבצעת.
- **עוזרת לאורן משה** — להבין את מה שקורה באתר, לבדוק-איכות, לשפר, ולתת-הוראות-מדויקות ל-Claude Code (העתקה-ידנית, לא-הרצה-אוטומטית).

זו **תבנית-אחת-כללית**, לא-מבנה-נפרד-לכל-מודול — כשף/חאווי/קלפים/site-tooling כולם נכנסים דרך **אותו router ואותה סכימת-קלט/פלט** (§3-5), עם תוכן-ספציפי-למודול (§2).

## 2. תחומי אחריות

| תחום | מה הוא כולל |
|---|---|
| **Site Advisor** | בעיות-כלליות-באתר: UI תקוע, שגיאת-קונסול, בעיית-git, שאלות-על-Vercel/deploy, מבנה-קבצים |
| **Goral HaChol Advisor** | חאווי + כשף — שני-המסלולים הנפרדים (ראו `CLAUDE.md`: אין-לערבב-מקורות ביניהם) |
| **Cards Advisor** | קלפים — **עתידי**, אין-עדיין-מודול-קלפים ב-hall-of-wisdom (ראו §7) |
| **Client Session Advisor** | פרטי-לקוח, היסטוריית-קריאות, איכות-ניסוח-ללקוח |
| **Engine Critic** | ביקורת על מנועים-דטרמיניסטיים-קיימים — מכני-מדי? חסר-כלל? סותר-דיין/עדים? |
| **Claude Code Instructor** | הפקת `codeInstructionForClaude` — טקסט-מוכן-להעתקה, לא-הרצה-אוטומטית |
| **Safety/Privacy Guard** | חסימת `phone`/`dynFields`-רגישים/`sourceText`-גולמי מכל-פלט-ללקוח, בכל-תחום |

כל תחום הוא **תת-פרומפט עתידי** (כמו `goral-hachol/ai-prompts/kashf-final-synthesis.prompt.md`, ראו §3) שנטען-לפי-`module`, לא-קובץ-נפרד-לגמרי-מהמבנה-הכללי.

## 3. Router פנימי

הבינה חייבת לסווג כל בקשה ל-`module` אחד מתוך רשימה-סגורה, לפני-שהיא-בכלל-עונה:

```
site | kashf | hawi | cards | clientProfile | report | uiBug | codeFix | deployment | knowledgeExtraction | promptImprovement
```

הסיווג קובע **איזה תת-פרומפט/הקשר-נוסף** נטען (למשל `module:"kashf"` → נטען-גם `goral-hachol/ai-prompts/kashf-final-synthesis.prompt.md` כהקשר-משני). אם הבקשה לא-מתאימה-בבירור לאף-`module` — הבינה חייבת-להחזיר `needsOrenDecision: true` ולא-לנחש.

## 4. קלט JSON כללי

מבנה-גמיש-לפי-הצורך (לא-כל-שדה-נדרש-בכל-קריאה):

```json
{
  "userIntent": "string — מה אורן משה מבקש",
  "currentTool": "goral-hachol|calculator|myseal|site-general",
  "module": "site|kashf|hawi|cards|...",
  "clientContext": { "...": "כמו clientSafeContext ב-KASHF_AI_FINAL_SYNTHESIS_POC_PLAN.md §1 — מסונן, אף פעם לא raw" },
  "question": "string|null",
  "readingData": { "board": "...", "formula": "...", "engineDiagnosis": "..." },
  "engineOutput": "string|object — הפלט-הדטרמיניסטי-הקיים, חומר-ייחוס",
  "sourceKnowledge": "string|null — ציטוט-ספר רלוונטי, לביסוס-בלבד",
  "currentUIState": "string|null — לשימוש-site/uiBug בלבד",
  "errorLogs": ["string"],
  "fileArchitectureMap": "string|null — הפניה ל-OREN_SMART_ADVISOR_BRAIN_MAP.md הקיים, לא-כפילה",
  "previousDecisions": ["string — סיכום-החלטות-קודמות רלוונטיות"],
  "orenStyleRules": ["string — כללי-סגנון-הייעוץ שאורן דורש, ראו OREN_CONCLUSION_STYLE_SPEC.md"],
  "safetyRestrictions": ["phone", "dynFields-sensitive", "sourceText-raw", "..."]
}
```

## 5. פלט JSON כללי

```json
{
  "module": "site|kashf|hawi|cards|ui|code|client",
  "advisorDiagnosis": "string — ליועץ בלבד",
  "clientAnswerDraft": "string|null — טיוטת-ניסוח-ללקוח, אם-רלוונטי-לתחום (null עבור site/codeFix/deployment)",
  "engineCritique": {
    "hasProblem": true,
    "problems": [],
    "severity": "none|minor|medium|major"
  },
  "missingKnowledgeOrRules": [],
  "recommendedFix": "string — תיאור-מילולי-קצר, לא-קוד",
  "codeInstructionForClaude": {
    "needed": true,
    "instruction": "string",
    "filesToInspect": [],
    "filesNotToTouch": [],
    "testsToRun": []
  },
  "safetyNotes": [],
  "privacyBlockedFields": [],
  "nextBestAction": "string",
  "confidence": "high|medium|low",
  "needsOrenDecision": true
}
```

**עקרון-אחדות:** זו **אותה-משפחת-סכימה** כמו הפלט-הספציפי-לכשף (`KASHF_AI_FINAL_SYNTHESIS_POC_PLAN.md` §2) — `engineCritique`/`codeInstructionForClaude` זהים-במבנה; `clientFinalAnswer` הספציפי-לכשף מתאים ל-`clientAnswerDraft` הכללי; `advisorFinalDiagnosis`/`reasoningTraceForAdvisor`/`advisorBrainNotes` הספציפיים מתאחדים כאן ל-`advisorDiagnosis`. תת-הפרומפט-של-כשף (§6) יכול-להחזיר-את-הסכימה-המורחבת-שלו-עצמו כשהוא נטען כ-"תוסף" למודול `kashf` — אין-סתירה, יש-הרחבה.

## 6. פיילוט ראשון — Kashf commerce (לא הארכיטקטורה כולה)

**Kashf commerce נבחר כפיילוט-ראשון** כי כבר-קיימת-לו-תשתית-שלמה: מנוע (`kashf-reading-engine.js`), Context Sanitizer (`kashf-context-sanitizer.js`), שכבת-ניסוח (`kashf-commerce-smart-layer.js`), 12 דוגמאות-פלט-אמיתיות (`KASHF_COMMERCE_MANUAL_OUTPUT_SAMPLES.md`, טרם-commit), וביקורת-קוהרנטיות-מאומתת (`KASHF_COMMERCE_CONTEXT_COHERENCE_REVIEW.md`). זו **הזדמנות-נוחה לבדוק PoC**, לא-סימן-שהבינה "שייכת" לכשף.

`KASHF_AI_FINAL_SYNTHESIS_POC_PLAN.md` (קיים, לא-נמחק) הוא **מפרט-הפיילוט-המפורט** — נשאר-בתוקף כתת-מסמך של המסמך-הזה, לא-מוחלף. `goral-hachol/ai-prompts/kashf-final-synthesis.prompt.md` (קיים, לא-נמחק) הוא **תת-פרומפט-עתידי של מודול `kashf`** — נטען **מעל** ה-prompt הראשי (`ai/prompts/oren-smart-advisor-brain.prompt.md`, §3 למטה), לא-נפרד-ממנו ולא-מחליף-אותו.

לאחר-שהפיילוט-הזה יאושר-ויעבוד (כולל בדיקות-איכות אמיתיות, לא-רק-mock), אותה-תבנית-בדיוק תורחב ל-Hawi, ואחר-כך למודולים-האחרים (§2) — **לא-במקביל, אחד-אחרי-השני, כל-שלב-דורש-אישור-נפרד**, בדיוק כמו-הדפדוד-שכבר-הוכיח-את-עצמו לאורך כל-הסבב-הזה (שלב-א → ג-חלקי → age (בוטל) → sanitizer → חיבור-commerce → ביקורת-קוהרנטיות).

## 7. קלפים — מקום עתידי

**נבדק ישירות:** אין-עדיין-שום-מודול-קלפים-פעיל ב-hall-of-wisdom — לא-מנוע, לא-UI, לא-נתוני-קלפים. `ai/prompts/cartomancy-runtime.md` **כן-קיים** (מהתשתית-שנבנתה-מוקדם-יותר בסבב-הזה) — נכתב-מחדש (לא-מועתק) עבור hall-of-wisdom, בהשראת-העיקרון-שכבר-הוכיח-את-עצמו ב-`inner-compass`, אך **אין לו עדיין מנוע-דטרמיניסטי-מקביל לחבר-אליו** (בניגוד-לכשף/חאווי) — לפי `MERGE_INNER_COMPASS_INTO_HALL_OF_WISDOM_REPORT.md` (קיים), טרם-הוחלט-אם/איך-למזג.

כשהמודול-יהיה-קיים, ה-Advisor Brain יתפקד עבורו **באותו-router** (`module:"cards"`) עם-אחריות מקבילה ל-Engine Critic הכשפי: בדיקת-פריסות (האם-הקלפים-שעלו-מתאימים-למבנה-הפריסה), איכות-פירוש (האם-הניסוח-מכני-מדי), התאמה-לשאלה (כמו-שנבדק-ב-commerce עם `contextRelevance`), ניסוח-דוח-ללקוח, זיהוי-פלט-מכני, והצעת-תיקוני-מנוע/ידע/ניסוח — **אותה-מתודולוגיה, לא-מנגנון-נפרד**. זה **לא-מתוכנן-לביצוע-כרגע** — רק-מצוין-כאן כדי-שהארכיטקטורה-הכללית (§2-5) תהיה-נכונה-מראש ולא-תצטרך-שינוי-מבני כשהקלפים-ייבנו.

## 8. מה אסור עכשיו

לא לחבר API חי | לא להוסיף secret | לא לעשות deploy | לא לשנות HTML/UI | לא לשנות מנועים | לא לשנות narrative | לא למזג ל-main | לא לגעת ב-`inner-compass` | **לא למחוק שום קובץ-קיים בלי אישור** (כולל `KASHF_AI_FINAL_SYNTHESIS_POC_PLAN.md` ו-`goral-hachol/ai-prompts/kashf-final-synthesis.prompt.md` — שניהם נשארים, כפי-שהובהר-ב-§6).

## 9. מה מותר עכשיו

לעדכן מסמכי-תכנון בלבד | ליצור prompt ראשי כללי (§להלן) | להשאיר Kashf כפיילוט-ראשון-בלבד, לא-כל-הארכיטקטורה.

---

## מיקום ה-prompt הראשי

`ai/prompts/oren-smart-advisor-brain.prompt.md` — **הזהות-הראשית**, כללי-לכל-האתר, כולל-router+סכימת-קלט/פלט-כללית (§3-5 למעלה). נטען-תמיד-ראשון; תת-פרומפטים-ספציפיים-למודול (כמו `kashf-final-synthesis.prompt.md`) נטענים **בנוסף**, לא-במקום.

**חשוב:** `ai/prompts/kashf-runtime.md` הישן (STUB, לא-נגעתי-בו) הוא **עדיין-לא-קשור** לתשתית-הזו — הוא-שייך-לדפוס-הישן-יותר ("Runtime AI לניסוח-בלבד", `oren-smart-ai` Edge Function, `cartomancy`-בלבד-מיושם). ה-Advisor Brain הוא **מסלול-נפרד**, לא-מרחיב-את-ה-stub-הישן — אין-לבלבל-בין-השניים.

---

## הצהרות

- שום API חי לא חובר. שום secret לא נוסף. שום deploy. שום שינוי HTML/UI/מנועים/narrative.
- שום קובץ-קיים לא נמחק. שום נגיעה ב-`inner-compass`. לא מוזג ל-main.
- שום commit/push — רק יצירת/עדכון-הקבצים.
- הצעד הבא — לפי החלטת אורן משה בלבד.
