# GORAL_RULE_APPLICABILITY_FIX_PRECOMMIT_REPORT — Question-Aware Section Filter (דמיר)

> **דוח לפני-commit. עדיין לא בוצע commit/push. לא נגע בקלפים/גרפיקה/CSS, לא ב-`inner-compass`, לא AI חי, לא secret, לא production deploy, לא main, לא במנועי-החישוב עצמם, לא במקורות הידע, לא באבחון הרוחני בחאווי.**
> תאריך: 2026-07-09. ממשיך את `GORAL_RULE_APPLICABILITY_AUDIT.md` (`f2be481`).

---

## 1. רשימת קבצים ששונו/נוצרו

```
 M  goral-hachol/engine/goral-conclusion-writer.js
 M  goral-hachol/engine/kashf-narrative-writer.js
?? goral-hachol/engine/goral-rule-applicability.js   (חדש)
?? _test_goral_rule_applicability.mjs                (חדש)
```

## 2. diff --stat

```
 goral-hachol/engine/goral-conclusion-writer.js | 13 +++++++++++--
 goral-hachol/engine/kashf-narrative-writer.js  | 17 +++++++++++++++--
 2 files changed, 26 insertions(+), 4 deletions(-)

 goral-hachol/engine/goral-rule-applicability.js   47 שורות (חדש)
 _test_goral_rule_applicability.mjs                85 שורות (חדש)
```

## 3. המנגנון המרכזי — `goral-rule-applicability.js`

קובץ חדש, קטן ומבודד. **לא מחשב שום דבר, לא נוגע במנוע** — רק מחליט מה מותר להציג ללקוח:

```js
export function getSectionVisibility({ method, topicId, sectionId, mode = 'client' }) {
  if (mode === 'advisor') return { showToClient: true, keepAdvisorOnly: false };
  if (sectionId === 'dhamir') {
    const isVisible = DHAMIR_CLIENT_VISIBLE_TOPICS[method]?.has(topicId);
    return { showToClient: isVisible, keepAdvisorOnly: !isVisible };
  }
  return { showToClient: true, keepAdvisorOnly: false }; // כל section אחר — לא שינינו התנהגות
}
```

**חשוב — לפי דרישה 3 שלך, לא החלטתי לבד אילו topicId מקבלים דמיר:**
- **בכשף:** בדקתי את כל 29 ה-topicId (`kashf-topic-rules.js`) — **אין אף אחד** שמתאר במפורש "מה בלב האדם"/"כוונה נסתרת של אדם". הרשימה `DHAMIR_CLIENT_VISIBLE_TOPICS.kashf` נשארה **ריקה בכוונה**.
- **בחאווי:** יש topicId מועמד: **`loveHate`** ("אהבה ושנאה", `hawi-interpreter.js:124`) — הכי קרוב מבחינת-שם ל"מה הוא מרגיש כלפיי". **לא הפעלתי אותו** — הרשימה `DHAMIR_CLIENT_VISIBLE_TOPICS.hawi` נשארה **ריקה בכוונה**, כפי שביקשת ("אם אין topicId ברור — השאר דמיר מוסתר כברירת מחדל"). מדווח לך את המועמד הזה כאן, לפני כל הפעלה — ההחלטה אם להפעיל אותו היא שלך.

**התוצאה בפועל כרגע: דמיר מוסתר ללקוח ב-100% מהנושאים, בשתי השיטות**, עד שתחליט אחרת.

## 4. איפה נוסף gating בכשף

**`kashf-narrative-writer.js`:**
- `writeKashfReading(reading, options = {})` — פרמטר חדש `options.mode` (`'client'` ברירת מחדל, `'advisor'` חושף הכל).
- שורה שבה `writeDhamirPara(reading)` נכנס ל-`detailSections`: הוחלפה ב-
  `dhamirVisibility.showToClient ? writeDhamirPara(reading) : ''`
- **החישוב (`kashf-reading-engine.js`) לא נגע כלל** — `dhamir`/`dhamirExtras`/`dhamirType4External` ממשיכים להיות מחושבים תמיד בדיוק כמו קודם, ומופיעים באובייקט `reading` המלא (זמין ל-advisor panel).

## 5. איפה נוסף gating בחאווי

**`goral-conclusion-writer.js`:** נמצאו 3 קריאות ל-`dhamirParagraph`. טופלו 2, הושארה 1 בכוונה:

| מיקום | הקשר | טופל? |
|---|---|---|
| שורה ~1589 (בתוך `buildNarrativeByTopic`) | הנתיב הראשי לכל שאלה רגילה (לא-רוחנית) | ✅ עטוף בתנאי `getSectionVisibility` |
| שורה ~1842 (בתוך `buildSpiritualNarrative`) | **בתוך הנרטיב הרוחני עצמו** — רץ רק כש-`topicId==='spiritualDiagnostics'` | **לא נגעתי** — לפי דרישתך המפורשת "לא לגעת באבחון הרוחני". זה חלק מהנרטיב הרוחני שכבר מסונן נכון ברמת-הכניסה. |
| שורה ~2261 (fallback טכני ב-`writeHumanGoralConclusion`) | נתיב-גיבוי נדיר (לוח חסר/נושא לא-מזוהה) | ✅ עטוף באותו תנאי, לעקביות |

## 6. אילו sections מוסתרים עכשיו ללקוח (ברירת מחדל)

| method | section | מוצג ללקוח כברירת מחדל? |
|---|---|---|
| kashf | דמיר (מחשבת השואל + כל תוספותיו: עיתוי, טבע-שואל, כנות, וכו') | **לא** (בכל 29 הנושאים) |
| hawi | dhamirParagraph (אישור/סתירה מול הדיין) | **לא** (בכל הנושאים הרגילים; לא נגענו בנתיב הרוחני) |
| kashf | primaryFormula/altFormula/supportingChecks/keyHouses | ללא שינוי — היו תקינים |
| hawi | אבחון רוחני | ללא שינוי — **לא נגענו**, כפי שנדרש |
| kashf/hawi | עדים+דיין (בתים 13-15) | ללא שינוי — נשאר כפי שהיה (מבנה קלאסי, לא טופל בשלב זה) |

## 7. מה נשאר advisor-only

- אובייקט ה-`reading`/`result` המלא **תמיד** מכיל `dhamir`/`dhamirExtras`/`dhamirParagraph`-content — שום מידע לא נמחק. פאנל בינת אורן (וכל צריכה עתידית אחרת, advisor-facing) יכול להמשיך לגשת אליו ישירות מהאובייקט, או דרך `writeKashfReading(reading, {mode:'advisor'})`.
- לא נגעתי בפאנל בינת אורן עצמו (`buildMockOrenAdvisorBrainOutput`/`renderOrenAdvisorPanel`) — הוא ממשיך לקרוא ישירות מ-`reading` (לא דרך ה-HTML), ולכן לא הושפע מהשינוי.

## 8. תוצאות בדיקות

**בדיקה חדשה — `_test_goral_rule_applicability.mjs` (15/15 עברו):**
```
✓ commerce: אין "מחשבת השואל"/כרטיס-דמיר/תוספות-דמיר בפלט הלקוח (כשף)
✓ commerce: reading.dhamir + reading.dhamirExtras עדיין מחושבים (לא נמחקו)
✓ completion: אין דמיר בפלט הלקוח כברירת מחדל (כשף)
✓ advisor mode: דמיר כן מוצג כשמבקשים mode:"advisor" (כשף)
✓ writeKashfReading(reading) === writeKashfReading(reading, {mode:"client"}) — ברירת מחדל עקבית
✓ חאווי: אין "מחשבת השואל" ב-finalConclusionHebrew/clientReadingHebrew בשאלת מסחר רגילה
✓ spiritualDiagnostics topic: spiritualDiagnosis עדיין מחושב ומוחזר (חאווי)
✓ commerce topic: spiritualDiagnosis עדיין מחושב ברקע, לא דולף לפלט (חאווי, ללא שינוי)
✓ orenAdvisorPanel עדיין ב-goral-hachol.html
✓ cards.html + cartomancy/ui/cards-app.js עדיין קיימים
```

**חבילת-הרגרסיה המלאה — כל 8 הקבצים עברו ללא כשל אחד:**
`_test_kashf_context_sanitizer.mjs`, `_test_kashf_commerce_smart_layer.mjs`, `_test_kashf_commerce_context_coherence.mjs` (4500 שילובים), `_test_kashf_commerce_context_aware.mjs`, `_test_kashf_context_fields_transfer.mjs`, `_test_kashf_archive_save.mjs`, `cartomancy/_test_cartomancy.mjs`, `_test_oren_smart_advisor_site_brain_poc.mjs`.

**Playwright (דפדפן אמיתי) — `_test_oren_advisor_panel_ui.mjs` — 21/21** — פאנל בינת אורן פועל בדיוק כמו קודם.

**`node --check`** על כל קבצי JS/MJS בריפו (203 קבצים) — 202/202 עברו (הקובץ החריג `raml-data/raml-spiritual-diagnostics.js` נשאר שבור **מלפני** השינוי הזה, לא קשור אליו — תועד ב-`OREN_CARDS_ADVISOR_MERGE_FULL_SUMMARY.md`).

## 9. אישורים

- ✅ לא נגעתי בקלפים, ב-CSS/גרפיקה של הקלפים.
- ✅ לא נגעתי ב-`inner-compass`.
- ✅ לא חובר AI חי, לא נוסף secret.
- ✅ לא בוצע production deploy.
- ✅ לא נגעתי ב-main.
- ✅ לא נגעתי במנועי-החישוב עצמם (`kashf-reading-engine.js`, `kashf-dhamir.js`, `hawi-interpreter.js`) — הדמיר עדיין מחושב זהה-לחלוטין.
- ✅ לא נגעתי במקורות הידע (`data/sources/**`).
- ✅ לא נגעתי באבחון הרוחני בחאווי (`goral-spiritual-diagnostics-engine.js` לא נערך; `spiritualParagraph`/`buildSpiritualNarrative`/`writeClientReadingHebrew` לא נערכו).
- ⏳ **עדיין לא בוצע commit/push** — ממתין לאישורך.

---

## הצעד הבא

ממתין לאישורך ל-commit (שם מוצע: `Add question-aware section filter for dhamir output`) ו-push לענף `claude/app-cleanup-organization-mia9b2`. בנוסף — אם תרצה, אפשר בעתיד לדון בהפעלת `loveHate` בחאווי לדמיר, לאחר שתבדוק את זה בעצמך מול המקור.
