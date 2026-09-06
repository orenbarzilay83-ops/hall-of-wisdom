# OREN_SMART_ADVISOR_SITE_BRAIN_POC_REPORT — דוח PoC מקומי, Oren Smart Advisor Brain

> **דוח בלבד. לא חובר API חי, לא נוסף secret, לא בוצע deploy, לא נקרא למפתח אמיתי, לא שונה HTML/UI/מנועים/narrative/commerce-smart-layer/goral-app.js/kashf-reading-engine.js/supabase function, לא נגע ב-`inner-compass`, לא מוזג ל-main. לא בוצע commit/push — רק יצירת הקבצים.**
> תאריך: 2026-07-08. בדיקת-מבנה מקומית ל-`ai/prompts/oren-smart-advisor-brain.prompt.md` דרך `_test_oren_smart_advisor_site_brain_poc.mjs` — `input → prompt/provider mock → output JSON → validation`, על 5 דוגמאות-אמיתיות (מ-`KASHF_COMMERCE_MANUAL_OUTPUT_SAMPLES.md`).

---

## 1. מה נבדק

השרשרת המלאה, ללא-חלק-מדומיין מלבד-תשובת-ה-AI עצמה:
1. **טעינת ה-prompt הראשי** (`ai/prompts/oren-smart-advisor-brain.prompt.md`) — קריאת-קובץ-אמיתית.
2. **בניית input** — מלוח-אמיתי (`buildRamlBoardFromMothers`) → `buildKashfReading` (אמיתי, לא-שונה) → `sanitizeKashfClientContext` (אמיתי, לא-שונה) → הרכבת-JSON לפי הסכימה-הכללית (`module`/`subModule`/`userIntent`/`clientContext`/`question`/`readingData`/`engineOutput`/`sourceKnowledge`/`sourceRules`/`safetyRestrictions`/`currentOutputToCritique`/`orenStyleRules`).
3. **קריאה ל-`callAnthropic`** (מ-`ai/provider/anthropic-provider.js`, **לא-שונה**) — עם `apiKey` מזויף-במפורש (`'test-fake-key-do-not-use-not-real'`) ו-`globalThis.fetch` מוחלף-זמנית לפונקציה-מזויפת שמחזירה JSON-קבוע (מותאם-אישית לכל-דוגמה, לא-גנרי).
4. **פרסור-הפלט כ-JSON** ו-**ולידציה מלאה** על 12 המפתחות + 8 כללי-הבטיחות שנדרשו.

## 2. אילו 5 דוגמאות נבחרו

מ-12 הדוגמאות ב-`KASHF_COMMERCE_MANUAL_OUTPUT_SAMPLES.md` (mothers מדויקים, לא-מדומיינים):

| # | דוגמה | mothers | תכונה-נבדקת |
|---|---|---|---|
| 1 | שכיר ששואל אם לפתוח עסק | `2222,2211,2121,2221` | `engineCritique.hasProblem: false` (המנוע כבר-תקין) |
| 6 | quesitedName: שותף בעסקה | `2122,1111,2212,2222` | `codeInstructionForClaude.needed: true` (פער-אמיתי-ומעוגן) |
| 8 | dynFields רגישים | `1111,2222,1121,2222` | דליפת-תוכן-רגיש (`debtDetails`) |
| 9 | ודאות נמוכה | `1112,1122,2211,1112` | `confidence: "low"` + ביקורת-מינורית (`leshonHaInyan`) |
| 12 | phone קיים + employed, שלילי | `1122,2112,2211,2212` | דליפת `phone` |

## 3. דוגמת input מקוצרת (דוגמה 6 — quesitedName)

```json
{
  "module": "kashf",
  "subModule": "commerce",
  "userIntent": "בדוק את המסקנה הקיימת עבור קריאת commerce זו והצע שיפור אם צריך",
  "clientContext": { "name": "רונית", "gender": "female", "workStatus": "self", "quesitedName": "השותף המוצע" },
  "question": "האם השותפות עם השותף המוצע תצליח?",
  "readingData": { "judge": "בית 15: כבוד נכנס — מיטיב", "dhamir": "בר הלחי", "leshonHaInyan": null, "...": "9 בתי-מפתח + עדים" },
  "engineOutput": {
    "certaintyLevel": "medium",
    "contradictions": [{ "type": "primary-vs-alt", "primary": false, "alt": true }],
    "clientWordingExisting": "בית המבקש בעסקה מראה אדום — מזיקה. בית אחרית העסקה מראה כבוד נכנס — מיטיבה.",
    "practicalGuidanceExisting": "יש כאן סתירה בין סימנים..."
  },
  "sourceKnowledge": "במכירה וקנייה: התבונן בראשון, ברביעי...",
  "safetyRestrictions": ["phone", "parentName", "maritalStatus", "hasChildren", "dynFields", "sourceText"],
  "orenStyleRules": ["לא מתלהם", "לא מיסטי-מדי", "מקצועי-וזהיר", "מפריד יועץ/לקוח"]
}
```

## 4. דוגמת output JSON (דוגמה 6 — מלא, זהו-בדיוק-מה-שה-mock-fetch החזיר ועבר-ולידציה)

```json
{
  "module": "kashf",
  "advisorDiagnosis": "ניתוח-פנימי עבור רונית: בית 15: כבוד נכנס — מיטיב",
  "clientAnswerDraft": "בית המבקש בעסקה מראה אדום — מזיקה. בית אחרית העסקה מראה כבוד נכנס — מיטיבה. יש כאן סתירה בין סימנים, ולכן לא נכון להתקדם בביטחון מלא. כדאי לבדוק את תנאי העסקה, לבקש הבהרה נוספת, או להמתין לפני החלטה סופית.",
  "engineCritique": {
    "hasProblem": true,
    "problems": ["quesitedName (\"השותף המוצע\") מגיע ב-clientSafeContext אך לא-מוזכר כלל ב-clientWordingExisting"],
    "severity": "minor"
  },
  "missingKnowledgeOrRules": ["clientSafeContext.quesitedName לא-נצרך היום ב-kashf-commerce-smart-layer.js"],
  "recommendedFix": "להרחיב את שכבת-הניסוח כך שתתייחס לתפקיד-הנישאל (שותף/קונה/מוכר) כשהוא רלוונטי",
  "codeInstructionForClaude": {
    "needed": true,
    "instruction": "הרחב את kashf-commerce-smart-layer.js כך ש-clientSafeContext.quesitedName ישפיע על clientWordingAdjustments כשהוא קיים וה-topicId הוא commerce",
    "filesToInspect": ["goral-hachol/engine/kashf-commerce-smart-layer.js", "goral-hachol/engine/kashf-context-sanitizer.js"],
    "filesNotToTouch": ["goral-hachol/engine/kashf-reading-engine.js", "goral-hachol/engine/kashf-narrative-writer.js"],
    "testsToRun": ["_test_kashf_commerce_context_aware.mjs", "_test_kashf_commerce_smart_layer.mjs"]
  },
  "safetyNotes": [],
  "privacyBlockedFields": ["phone", "parentName", "maritalStatus", "hasChildren", "dynFields", "sourceText"],
  "nextBestAction": "sendInstructionToClaude",
  "confidence": "medium",
  "needsOrenDecision": true
}
```

## 5. האם כל 12 המפתחות קיימים

**כן, בכל 5 הדוגמאות** — `module`, `advisorDiagnosis`, `clientAnswerDraft`, `engineCritique`, `missingKnowledgeOrRules`, `recommendedFix`, `codeInstructionForClaude`, `safetyNotes`, `privacyBlockedFields`, `nextBestAction`, `confidence`, `needsOrenDecision`. מאומת-מכנית (`REQUIRED_KEYS.every((k) => k in output)`), לא-רק-הצצה-ידנית.

## 6. אילו ולידציות עברו

**55/55 assertions עברו**, על-פני 5 הדוגמאות + 3 בדיקות-טעינת-prompt:
- prompt נטען, מזהה-את-עצמו כ-Oren Smart Advisor Brain, מכיל "לא client-facing".
- לכל דוגמה: לוח-תקין, `callAnthropic` מחזיר `ok:true`, פלט הוא-JSON-תקין, כל 12 המפתחות קיימים, `module === "kashf"`, `engineCritique` כולל `hasProblem`/`problems`/`severity`, `codeInstructionForClaude` כולל את-כל-5-תתי-השדות, `nextBestAction` מתוך ה-enum-המוגדר, `needsOrenDecision` הוא-`boolean`.
- **אין שם-שדה מ-`privacyBlockedFields` בתוך `clientAnswerDraft`** (בדיקה מכנית: `privacyBlockedFields.filter(f => clientAnswerDraft.includes(f))` ריק).
- **`phone` (דוגמה 12) לא-מופיע ב-`clientAnswerDraft`** — נבדק מול-הערך-המדויק (`0521234567`).
- **תוכן-`dynFields`-רגיש (דוגמה 8) לא-מצוטט ב-`clientAnswerDraft`** — נבדק מול-הטקסט-המדויק שהוזן ("יש לי חוב אישי-משפחתי...").

## 7. מה עדיין חסר להפעלה חיה

1. `ANTHROPIC_API_KEY` אמיתי — Secret, לא-בקוד.
2. חיבור-בפועל ל-Edge Function (`supabase/functions/oren-smart-ai/` או Function-חדש-נפרד) — לא-נעשה כאן, ולא-שונה.
3. `buildAiSynthesisInput(reading)` כפונקציה-אמיתית-בקוד-הפרויקט — כאן היא-רק-לוגיקת-בדיקה בתוך קובץ-ה-PoC, לא-קוד-ייצור.
4. ולידציה-אוטומטית-על-תשובת-AI-אמיתית (לא-mock) — ה-mock כאן נכתב-ידנית-לכל-דוגמה; תשובה-אמיתית-מ-Claude תדרוש את-אותה-ולידציה, אך על-תוכן-לא-צפוי-מראש.
5. מקום-תצוגה ל-Oren (`engineCritique`/`codeInstructionForClaude` וכו') — כרגע אין-שום-UI-ליועץ; זה-כלי-שירוץ-מחוץ-לאתר-הלקוחי (ראו `OREN_SMART_ADVISOR_SITE_BRAIN_POC_PLAN.md` §6, הערה-8).
6. הרחבה-מעבר-ל-`kashf`/`commerce` — כרגע רק-מודול-אחד-נבדק (הפיילוט המאושר).

## 8. מה ידרוש secret/deploy בעתיד

`ANTHROPIC_API_KEY` (Supabase secret) + `supabase functions deploy` — **שניהם לא-בוצעו, לא-יבוצעו-בלי-אישור-נפרד-ומפורש**, בדיוק-כפי-שכבר-תועד ב-`supabase/functions/oren-smart-ai/index.ts` (הערות-ה-deploy-העתידיות שכבר-כתובות-שם-כהערה, לא-כפעולה).

## 9. למה זה עדיין לא AI חי

- `apiKey` שהועבר ל-`callAnthropic` הוא מחרוזת-מזויפת-קבועה-בקוד (`'test-fake-key-do-not-use-not-real'`), לא-נקראת-מ-`process.env`/Supabase-secret.
- `globalThis.fetch` **הוחלף-זמנית** בפונקציה-מזויפת בתוך-הבדיקה-בלבד (ומוחזר-למקורו מיד-אחרי, ב-`finally`) — **0 קריאות-רשת-אמיתיות** בוצעו בהרצת-הבדיקה.
- תשובות-ה-AI במקום-מוזרם-מ-Anthropic הן **מחרוזות-JSON כתובות-ידנית מראש** בקוד-הבדיקה (`mockAiResponseFor`) — לא-נוצרו-על-ידי-שום-מודל.
- אין `supabase functions deploy`, אין Edge Function רץ, אין endpoint חי בשום מקום.

---

## הצהרות

- שום API חי לא חובר. שום secret/מפתח-אמיתי לא נוסף/נקרא. שום deploy.
- שום קוד-מנוע/narrative/commerce-smart-layer/goral-app.js/kashf-reading-engine.js/supabase-function/HTML/UI לא שונה.
- שום נגיעה ב-`inner-compass`. לא מוזג ל-main.
- שום commit/push — רק יצירת הקבצים.
- הצעד הבא — לפי החלטת אורן משה בלבד.
