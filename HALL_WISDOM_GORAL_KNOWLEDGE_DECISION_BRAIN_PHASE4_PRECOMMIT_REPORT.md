# HALL_WISDOM_GORAL_KNOWLEDGE_DECISION_BRAIN_PHASE4_PRECOMMIT_REPORT — בינת היכל החכמה: Knowledge + Decision Brain (Phase 4)

> **דוח לפני commit. לא בוצע commit. ממתין לאישורך המפורש עם רשימת-קבצים מדויקת, לפי התהליך הקבוע בסשן הזה.**
> תאריך: 2026-07-13.

---

## תקציר

זהו שלב-הידע וההכרעה של בינת היכל החכמה: שכבת **Knowledge Registry** (מה האפליקציה יודעת בפועל, מתועד לפי מקור אמיתי) + שכבת **Decision Brain** דטרמיניסטית (משווה בין מה שהמנוע עשה בפועל לבין מה שהמטריצה/הרישום אומרים שצריך לקרות) + הרחבת תרחישי-הבדיקה מ-20 ל-60. **לא AI. לא UI. לא תיקון-מנועים. לא קלפים. לא deploy. לא merge.**

כל רשומת-ידע נבנתה מקריאה ישירה בקוד הקיים (`kashf-topic-rules.js`, `kashf-book-sections.js`, `hawi-interpreter.js`, קבצי `question-rules/`) — לא הומצא אף כלל. במקומות שבהם המקור חסר/לא-תואם, זה מתועד במפורש כפער (`gap: true` / `missingKnowledgeEntries`), לא מולא בניחוש.

---

## 1. `git diff --stat`

```
 goral-hachol/qa/goral-qa-ai-payload-builder.js |  65 ++++++++
 goral-hachol/qa/goral-qa-output-collector.js   |  29 +++-
 goral-hachol/qa/goral-qa-scenarios.js          | 202 ++++++++++++++++++++-----
 3 files changed, 255 insertions(+), 41 deletions(-)
```
(שינויים בקבצים שכבר קיימים — תוספת-שדות בלבד, לא נגיעה בקריאות למנועים)

---

## 2. כל הקבצים החדשים/שהשתנו

**קבצים חדשים (`goral-hachol/brain/`, 1880 שורות בסה"כ):**
| קובץ | שורות | תפקיד |
|---|---|---|
| `goral-hachol/brain/goral-knowledge-registry.js` | 489 | רישום-ידע — 69 רשומות, method/sourceId/ruleType/clientVisibility/evidenceLocation/confidence |
| `goral-hachol/brain/goral-question-taxonomy.js` | 294 | 17 סוגי-שאלה, מילות-מפתח, topicId צפויים, מסווג היוריסטי |
| `goral-hachol/brain/goral-rule-applicability-matrix.js` | 152 | questionType × method × ruleCategory → required/allowed/advisorOnly/forbidden/notAvailable |
| `goral-hachol/brain/goral-output-quality-rubric.js` | 146 | 12 מדדי-איכות, score 0-4, failure conditions, severity mapping |
| `goral-hachol/brain/goral-decision-brain.js` | 326 | evaluateReading() — ההכרעה הדטרמיניסטית המרכזית |
| `goral-hachol/brain/goral-brain-evaluation-runner.mjs` | 141 | מריץ את כל התרחישים, מפיק דוח-כיסוי |

**קובץ בדיקה חדש:**
| קובץ | שורות |
|---|---|
| `_test_goral_knowledge_decision_brain_phase4.mjs` | 332 (996 assertions) |

**קבצים קיימים ששונו (תוספת-שדות בלבד, ללא נגיעה בקריאות-מנוע):**
| קובץ | שינוי |
|---|---|
| `goral-hachol/qa/goral-qa-output-collector.js` | הוספת `attachBrainEvaluation()` — קורא ל-`evaluateReading` על הפלט שכבר נאסף, מוסיף שדה `collected.brainEvaluation`. לא נגע בקריאות ל-`buildRamlBoardFromMothers`/`buildKashfReading`/`writeKashfReading`/`interpretHawiQuestionInitial` |
| `goral-hachol/qa/goral-qa-ai-payload-builder.js` | הוספת 6 שדות ל-payload: `classifiedQuestionType`, `applicableRuleMatrix`, `decisionBrainFindings`, `rubricScores`, `missingKnowledgeReferences`, `sourceEvidencePointers` — כולם נגזרים מ-`collected.brainEvaluation` + רישום-הידע, לא מידע חדש שנאסף |
| `goral-hachol/qa/goral-qa-scenarios.js` | הרחבה מ-20 ל-60 תרחישים (30 Kashf/30 Hawi), הוספת `expectedQuestionType`/`expectedRequiredRules`/`expectedForbiddenClientSections`/`expectedAdvisorOnlySections` לכל תרחיש (נגזרים אוטומטית מהמטריצה, לא מוקלדים-ידנית) |

---

## 3. כמה knowledge entries נוצרו

**69 רשומות** ב-`GORAL_KNOWLEDGE_REGISTRY`: 35 Kashf + 34 Hawi.
- 29 רשומות-נושא Kashf (אחת לכל topicId ב-`KASHF_TOPIC_RULES`) + 6 רשומות חוצות-נושא (dhamir, dhamir-type4-external, timing/temperament bundle, witness-testimony, formula-only-house-labeling, commerce-smart-layer).
- 28 רשומות-נושא Hawi (אחת לכל topicId ב-`TOPIC_MAIN_HOUSES`) + 6 רשומות חוצות-נושא (judge-verdict, ittisalat, figure-states, triangles, ghalib/maghloub, dhamir).

## 4. כמה rule categories

**9** ב-מטריצת-ההתאמה: `dhamir, timing, spiritual, characterNature, houseMeanings, witnessesJudge, verificationRules, formulaOnlyHouses, clientWording`.
**9** ב-registry ruleType (לפי המפרט שביקשת): `primaryDecision, verification, supporting, advisorOnly, conditional, spiritual, timing, hiddenThought, characterNature`.

## 5. כמה question types

**17**: businessSuccess, completion, moneyLivelihood, loveRelationship, hiddenThoughtIntent, timing, travel, health, spiritual, enemiesConflict, lostObject, general, personCharacter, marriage, pregnancyChildren, legalAuthority, workCareer.

## 6. כמה scenarios

**60** (30 Kashf / 30 Hawi), כל 17 סוגי-השאלה מיוצגים ≥3 פעמים (4 טיפוסים מקבלים 4). 0 IDs כפולים, 0 קריסות בהרצה מלאה מול המנועים האמיתיים.

## 7. Coverage לפי Kashf/Hawi

מתוך הרצת `goral-brain-evaluation-runner.mjs` על כל 60 התרחישים:
```
methodCoverage: {"kashf":30,"hawi":30}
sourceCoverage: {
  "kashf": {"withPageMap":27,"withoutPageMap":6},
  "hawi":  {"withQuestionRuleFile":26,"withoutQuestionRuleFile":4}
}
ruleCategoryCoverage: {
  "houseMeanings":60, "clientWording":60, "verificationRules":57,
  "witnessesJudge":60, "formulaOnlyHouses":13, "spiritual":3
}
failuresBySeverity: {"high":0,"medium":3,"low":0,"none":57}
```

## 8. דוגמת decision brain output

תרחיש `commerce-kashf` (עסק/מסחר, Kashf, topicId=`commerce`):
```json
{
  "questionType": "businessSuccess",
  "expectedRuleCategories": ["houseMeanings","verificationRules","clientWording"],
  "detectedRuleCategories": ["houseMeanings","clientWording","verificationRules"],
  "missingRequiredRules": [],
  "irrelevantAppliedRules": [],
  "advisorOnlyLeaks": [],
  "forbiddenClientSections": [],
  "formulaRoleLabelProblems": [],
  "contradictionProblems": [],
  "uncertaintyProblems": [],
  "privacyProblems": [],
  "rubricScores": { "relevanceToQuestion":4, "sourceFaithfulness":4, "ruleApplicability":4,
    "internalConsistency":4, "clientClarity":4, "advisorOnlyLeakage":4, "unsupportedClaims":4,
    "contradictionHandling":4, "uncertaintyHandling":4, "safetyAndPrivacy":4,
    "professionalTone":4, "actionability":4 },
  "overallSeverity": "none",
  "recommendedFixes": [],
  "needsAiReview": true
}
```
(`needsAiReview: true` תמיד — זו שכבה דטרמיניסטית שמכינה ground truth, לא תחליף לשיפוט-AI עתידי על טון/ניסוח.)

## 9. אילו פערי ידע נמצאו

**מהרישום (סטטי, לא תלוי-תרחיש):**
- 6 topicId ב-Kashf עם כלל-מנוע פעיל (`KASHF_TOPIC_RULES`) אך **ללא** רשומת-עמוד תואמת ב-`KASHF_TOPIC_PAGE_MAP`: `money, relocation, parentsProperty, children, dream, friendsHope`.
- 5 topicId עם רשומת-עמוד ב-`KASHF_TOPIC_PAGE_MAP` אך **ללא** כלל-מנוע תואם: `foundations, loveHate, childrenPregnancy, seaVoyage, birthNativity`.

**מהרצת 60 התרחישים (דינמי, ממצא חדש שהתגלה בשלב הזה):**
- **3 תרחישים** (`lost-animal-kashf`, `pregnancy-soon-kashf`, `children-status-kashf`) מסמנים `missingRequiredRules: ["verificationRules"]`, severity `medium`. **אומת ישירות מול הקוד**: ל-topicId `lostAnimal` ו-`children` ב-`KASHF_TOPIC_RULES` **אין `altFormula` מוגדר כלל** (`getTopicRules('lostAnimal').altFormula === false`, `getTopicRules('children').altFormula === false`) — לעומת `money` שכן יש לו. זה ממצא אמיתי, לא באג בבדיקה: או שהמקור עצמו לא מכיל נוסחת-אימות שנייה לנושאים האלה, או שהחילוץ מהמקור עדיין חסר. **לא תוקן** — נשאר לפער-ידע לבירור.

## 10. אילו מיפויים דורשים החלטת אורן

1. **`hiddenThoughtIntent`** — `DHAMIR_CLIENT_VISIBLE_TOPICS` ריק לגמרי בשתי השיטות, כך שגם שאלת-כוונה-נסתרת מפורשת ("מה הוא באמת חושב עליי?") לא מקבלת כרגע תוכן-דהמיר ישיר ללקוח. במטריצה נרשם כ-`advisorOnly` (תואם-התנהגות-בפועל), לא כ-`required`, כדי לא להמציא מדיניות.
2. **`timing`** — תוכן-העיתוי מקונן בכרטיס-הדהמיר בלבד; אין נתיב-הצגה נפרד. גם שאלת "מתי" מפורשת לא בהכרח מקבלת תשובת-עיתוי ייעודית.
3. **`personCharacter`** — `checkTemperamentLeak` (goral-qa-deterministic-checks.js) מדלג-מבדיקה רק על `category==='loveIntention'`, לא על `'personCharacter'`. אם ייווצר תרחיש `personCharacter` אמיתי בעתיד עם קטגוריה כזו, הבדיקה הקיימת עלולה לסמן תוכן-אופי-לגיטימי כדליפה.
4. **`workCareer`** — אין topicId ייעודי לעבודה/קריירה באף מקור; המיפוי ל-`authorityState`+`commerce` הוא קירוב, לא מקור מפורש.
5. **פערי-מקור מסעיף 9** (6 topicId ללא page-map, 5 page-map ללא כלל, 3 תרחישים ללא altFormula) — כולם דורשים בדיקת-מקור נוספת לפני כל שינוי-קוד.
6. **חריגת דהמיר ב-Hawi/spiritualDiagnostics** — `buildSpiritualNarrative` מציג דהמיר ללא-תנאי (לא דרך `getSectionVisibility`). נרשם במטריצה כחריגה מפורשת ומתועדת (per "לא לגעת באבחון הרוחני"), **לא שונה**.

## 11. תוצאות כל הבדיקות

```
_test_goral_knowledge_decision_brain_phase4.mjs   → 996 passed, 0 failed
_test_goral_qa_brain_phase2.mjs                   → כל הבדיקות עברו (ללא שינוי)
_test_hall_wisdom_ai_qa_evaluator_phase3.mjs      → כל הבדיקות עברו (ללא שינוי)
_test_hall_wisdom_goral_qa_edge_mock.mjs          → כל הבדיקות עברו (ללא שינוי)
_test_hall_wisdom_goral_qa_live_ai.mjs            → כל הבדיקות עברו (ללא שינוי)
```
כל 60 התרחישים רצים בהצלחה מול המנועים האמיתיים (0 קריסות, 0 שגיאות-מנוע). `node --check` עבר על כל קובץ `.js`/`.mjs` חדש/שונה. נבדק scan-שיבוש (ערבית/קירילית מחוץ להערות) — 2 שורות ערבית נמצאו ואומתו כשמות-ספר לגיטימיים (`كشف الأسرار`, `كتاب حاوي العجائب...`), לא שיבוש. נבדק scan-סוד (`sk-ant-...`) — אפס תוצאות בכל הקבצים.

## 12. אישור: לא שונו מנועים/UI/קלפים

- ✅ **אף שינוי לא בוצע** ב-`goral-hachol/engine/*.js` (kashf-reading-engine, kashf-narrative-writer, hawi-interpreter, goral-conclusion-writer, goral-rule-applicability וכו') — כל הבדיקות `checkFormulaOnlyHouseLabelLeak`/דומות שרצות בקבצי-הבדיקה הקיימים ממשיכות לרוץ מול אותו קוד-מנוע בדיוק.
- ✅ **אף שינוי לא בוצע** ב-UI (`goral-hachol/ui/`, `goral-hachol.html`, `calculator.html`, `index.html`) — נבדק ישירות (`orenAdvisorPanel` עדיין קיים, כותרת "בינת היכל החכמה" ללא שינוי).
- ✅ **אף שינוי לא בוצע** בקלפים (`cards.html`, `cartomancy/`) — נבדק ישירות בקבצי-הבדיקה הקיימים, וגם ב-guard מבני חדש ב-`_test_goral_knowledge_decision_brain_phase4.mjs` (בודק שקבצי `brain/` לא מייבאים כלום מ-`ui/`/cartomancy/tarot/myseal).
- ✅ השינוי היחיד בקבצים קיימים הוא **תוספת-שדות אדיטיבית** ל-`goral-qa-output-collector.js`/`goral-qa-ai-payload-builder.js`/`goral-qa-scenarios.js` — לא נגיעה בקריאות-מנוע קיימות.

## 13. אישור: אין AI חי/secrets/deploy/main merge

- ✅ **אין AI חי** — שום קובץ בשלב הזה לא קורא ל-`fetch`/`callAnthropic`/Anthropic API. הכל דטרמיניסטי (markers, טבלאות, חישוב-ציון).
- ✅ **אין secrets חדשים** — לא נוסף/שונה שום `ANTHROPIC_API_KEY`/`HALL_WISDOM_AI_MODE`/משתנה-סביבה.
- ✅ **אין deploy** — לא בוצע `supabase functions deploy`, לא Vercel production deploy.
- ✅ **אין merge ל-`main`** — כל העבודה על `claude/app-cleanup-organization-mia9b2` בלבד (מאומת: `git branch --show-current`).
- ✅ **אין commit** — ממתין לאישורך.

---

## המלצה לשלב הבא

**לא ממליץ להמשיך** לשום שלב נוסף (חיבור-AI/UI/תיקון-מנועים) לפני שתחליט על 5 הנקודות בסעיף 10. הצעד המעשי הבא, בכפוף לאישורך: לבחור פריט אחד מתוך `scenariosNeedingOrenDecision`/`missingKnowledgeEntries` ולחקור אותו לעומק (בדיקת-מקור פיזית) לפני כל שינוי-קוד.

**קבצים הממתינים לאישורך לצורך commit** (לא בוצע כלום עדיין):
```
goral-hachol/brain/goral-knowledge-registry.js          (חדש)
goral-hachol/brain/goral-question-taxonomy.js            (חדש)
goral-hachol/brain/goral-rule-applicability-matrix.js     (חדש)
goral-hachol/brain/goral-output-quality-rubric.js         (חדש)
goral-hachol/brain/goral-decision-brain.js                (חדש)
goral-hachol/brain/goral-brain-evaluation-runner.mjs       (חדש)
_test_goral_knowledge_decision_brain_phase4.mjs            (חדש)
goral-hachol/qa/goral-qa-output-collector.js               (שונה)
goral-hachol/qa/goral-qa-ai-payload-builder.js              (שונה)
goral-hachol/qa/goral-qa-scenarios.js                       (שונה)
```
