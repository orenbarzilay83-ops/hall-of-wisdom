# HALL_WISDOM_KASHF_SPIRITUAL_RULE_CATALOG_EXPANSION_PRECOMMIT_REPORT

> Precommit report only. No AI call. No Deploy. No workflow_dispatch. No
> UI change. No Commit, no Push — awaiting explicit approval. No decision
> made between page 53 and page 101-102. No new rule invented beyond what
> is directly quoted from `kashf-al-asrar-book.js`.
>
> **v3 revision (this update):** corrects a semantic conflation flagged in
> your review — v2 built `ruleCoverageStatus.appliedBookRules` directly
> from `implementationStatus`, treating "has code" as equivalent to "this
> reading's finding/decision actually used it". This revision separates
> **implemented / applicable / selected / evaluated / applied** into five
> independently-tracked facts, each backed by direct re-verification of
> `kashf-reading-engine.js` and `kashf-narrative-writer.js` — not inferred,
> not assumed. **No engine file was changed to produce this evidence** —
> only read and cited.

---

## 1. כיצד appliedBookRules נבנה — לפני ואחרי

**לפני (v2, שגוי):**
```js
const appliedBookRules = dedupIds(selection.implementedRules); // = implementationStatus === 'implemented'
```
כל חוק עם `implementationStatus:"implemented"` נספר אוטומטית כ-"applied" — כולל `kashf-p49-house6-sorcery-domain`, שלמעשה **אין לו שום אובייקט-ריצה עצמאי** בקוד (בית 6 מופיע רק כאחד מ-4 הבתים בתוך `primaryFormula`/`altFormula` עצמן).

**אחרי (v3, מתוקן):**
```js
appliedBookRules = evaluatedRules.filter(r =>
  r.runtimeEvidence.feedsOverallPositive === true
  || r.runtimeEvidence.feedsNarrativeOrProfessionalFinding === true
);
```
כל חוק ב-`appliedBookRules` חייב לעמוד בשלושה תנאים מוכחים (לא מוצהרים): `runtimeEvidence.evaluated === true`, `resultConfirmedNonError === true`, וש-תוצאתו מגיעה בפועל ל-`overallPositive` **או** לממצא-נרטיבי/מקצועי מוצג. `runtimeEvidence` על כל רשומה נבנה מקריאה ישירה של `kashf-reading-engine.js` (אילו שדות מחושבים בכל קריאה) ו-`kashf-narrative-writer.js` (אילו שדות אכן מגיעים לפסקת-נרטיב מוצגת, ואילו חסומים מאחורי דגל-נראות).

---

## 2. אילו חוקים באמת הופעלו ב-pilot-003 (appliedBookRules בפועל, 10)

| ruleKey | engineOutputPath | פעולה בפועל |
|---|---|---|
| `kashf-p167-primary-formula-spiritual-sorcery` | `reading.primaryFormula` (kashf-reading-engine.js:535-538) | קובע `overallPositive` (שורה 682) + מוצג ב-`writeVerdictPara()` |
| `kashf-p167-alt-formula-hidden-action` | `reading.altFormula` (שורות 551-553) | ממצא-עצמאי מוצג ב-`writeAltPara()`; **אינו** קובע `overallPositive` |
| `kashf-p166-movement-initiator` | `reading.supportingFindings[0]` (שורות 563-569) | מוצג ב-`writeSupportingPara()` |
| `kashf-p53-witness-scheme-basic` | `reading.witnessTestimony` (שורות 625-630, `computeWitnessTestimony`) | מוצג **ללא-תנאי** ב-`writeWitnessJudgePara()` (kashf-narrative-writer.js:713 — לא-חסום מאחורי דגל-נראות, בניגוד לדמיר) |
| `kashf-p155-dhamir-majority-decision` | `reading.dhamir.winner`/`.candidates` (שורות 588-591) | בוחר winner מ-4 המועמדים הממומשים; מוצג ב-`writeDhamirPara()` רק כש-`dhamirVisibility.showToClient===true`, אך תמיד-נוכח ב-engineOutput |
| `type1-face1-mizan` | `reading.dhamir.candidates[]` | מועמד ממומש לתוך הצבעת-הרוב |
| `type1-face2-harkat-al-ard` | `reading.dhamir.candidates[]` | כנ"ל |
| `type1-face4-jawharayn` | `reading.dhamir.candidates[]` | כנ"ל |
| `type2-element-prevalence` | `reading.dhamir.candidates[]` | כנ"ל |
| `type4-opening-abjad` | `reading.dhamirType4External` (שורות 598-600) | נוכח ב-AI-safe payload (`evidenceRole:"externalSupplementalAdvisorOnly"`), **אינו** מוצג בנרטיב-ללקוח (הערת-קוד מפורשת: "אינו מוצג בקריאה") |

## 3. אילו חוקים רק ממומשים (implementedAvailableRules)

**רק אחד:** `kashf-p49-house6-sorcery-domain` — `implementationStatus:"implemented"`, אך **אין לו אובייקט-ריצה עצמאי**. בית 6 מופיע רק בתוך `primaryFormula.houses`/`altFormula.houses` — אין דרך להוכיח שהוא "פעל" בנפרד. הוצא מ-`appliedBookRules` ומוצג עתה תחת `implementedAvailableRules`.

## 4. אילו רק מועמדים (selectedRules שאינם evaluated)

| ruleKey | סטטוס |
|---|---|
| `kashf-p101-witness-scheme-extended` | selected, **לא-evaluated** (`missing`, אין קוד) |
| `kashf-p101-witness-non-dispensable-principle` | selected, **לא-evaluated** (`missing`, דוקטרינה בלבד) |
| `kashf-p41-six-pillars-witnesses-general` | selected, **לא-evaluated** (`missing`) |
| `kashf-p45-trine-witness-scheme` | selected, **לא-evaluated** (`missing`) |
| `kashf-p130-five-witnesses-scoring-technique` | selected, **לא-evaluated** (`missing`) |
| `kashf-p167-connection-type-by-element` | selected, **לא-evaluated** (`missing`) — וגם `applicabilityStatus:"unresolved"` (ראה §7) |
| `kashf-p167-matter-true-and-directed-at-me` | selected, **לא-evaluated** (`missing`) — וגם `applicabilityStatus:"unresolved"` |
| 3 שיטות-דמיר (`depth-movement`,`mothers-arithmetic`,`circle-closure`) | candidateDhamirRules, **לא-evaluated** — אושר: נעדרות מ-`reading.dhamir.candidates` בקריאה חיה |

## 5. אילו שיטות דמיר הופעלו בפועל (dhamirCoverage)

```json
{"catalogued": 8, "implemented": 5, "missing": 3, "selected": 8, "evaluated": 5, "applied": 5}
```

**`selected:8` ≠ "כל שמונה רצות יחד"** — זהו רק "8 מועמדים-רלוונטיים-לנושא (עצמאי-מנושא)". **`evaluated:5`/`applied:5` הם המספר-האמיתי** שאושר בקריאה חיה של `buildKashfReading()`: `mizan`, `harkat-al-ard`, `jawharayn`, `element-prevalence`, `type4-opening-abjad`. שלוש הנותרות נעדרות לגמרי מ-`reading.dhamir.candidates` — לא נטען עבורן שום runtime evidence.

## 6. כיצד הופרד operational status מ-source relationship status

לכל רשומה בקטלוג יש כעת **שני שדות בלתי-תלויים**:
- `implementationStatus` (=ruleOperationalStatus ב-`witnessSystemsCoverage`) — האם יש קוד שרץ.
- `resolutionStatus` (=relationshipResolutionStatus ב-`witnessSystemsCoverage`) — האם יש אי-ודאות ביחס למקור/לרשומה-אחות.

**הוכחה חיה (`witnessSystemsCoverage` מהפלט האמיתי):**
```json
{
  "ruleKey": "kashf-p53-witness-scheme-basic",
  "ruleOperationalStatus": "implemented",
  "relationshipResolutionStatus": "unresolvedSourceRelationship",
  "appliedThisRound": true
}
```
עמ' 53 מוכרז **implemented + applied** באותו-זמן שבו הוא **גם** מסומן `unresolvedSourceRelationship` — שתי עובדות בלתי-תלויות, כפי שנדרש. עמ' 101-102: `ruleOperationalStatus:"missing"`, `appliedThisRound:false` — לעולם לא-applied. הכלל "unresolved rule לעולם אינו applied" **מתייחס במפורש לרשומה הלא-ממומשת** ואינו-מוחק את עובדת-ההפעלה של עמ' 53. מאומת ב-Test §7/§8.

## 7. האם שני חוקי עמ׳ 167 (connection-type / matter-true) רלוונטיים או רק סמוכים

**רק סמוכים — הראיה היחידה היא מיקום-בעמוד.** בניגוד ל-`primaryFormula`/`altFormula` (שמנוסחות במפורש "האם השואל עושה כישוף"/"האם יש פעולה מאחורי הדבר"), שני החוקים הללו הם "כלל מעשי" כלליים יותר ("סוג החיבור", "האם העניין נכון ומכוון לי") שאין להם ניסוח-ספציפי-לכישוף במקור. תוקן: `applicabilityStatus` שונה מ-`"conditionallyRelevant"` (v2) ל-`"unresolved"` (v3), וה-selector מנתב אותם ל-`unresolvedApplicabilityRules` — **לא** ל-`missingVerifiedRelevantRules`, כדי לא-לטעון-בטעות שהרלוונטיות-לנושא כבר-הוכחה. מאומת ב-Test §9.

## 8. מבנה ruleCoverageStatus המתוקן

```json
{
  "completeness": "partial",
  "catalogVersion": "kashf-book-rule-catalog-v3",
  "directVerdictRules": ["primaryFormula", "altFormula"],
  "implementedAvailableRules": ["house6-domain"],
  "selectedRules": ["...21 מזהים..."],
  "evaluatedRules": ["...10 מזהים (הוכח שרצו)..."],
  "appliedBookRules": ["...10 מזהים (הוכח שהגיעו לממצא/verdict)..."],
  "missingVerifiedRelevantRules": [],
  "unresolvedApplicabilityRules": ["connection-type-by-element", "matter-true-and-directed-at-me"],
  "unresolvedSourceRelationshipRules": ["p53-witness-basic", "p101-witness-extended"],
  "requiresFullContextReviewRules": ["p101-non-dispensable", "p41-six-pillars", "p45-trine", "p130-five-witnesses"],
  "unavailableBookRules": ["...10 מזהים..."],
  "dhamirCoverage": {"catalogued": 8, "implemented": 5, "missing": 3, "selected": 8, "evaluated": 5, "applied": 5, "majorityDecisionRuleImplemented": true, "majorityDecisionRuleApplied": true},
  "witnessSystemsCoverage": ["...5 אובייקטים, כל אחד עם ruleOperationalStatus+applicabilityStatus+relationshipResolutionStatus+appliedThisRound..."],
  "sourceCoverage": {...}
}
```

`Prompt rule #15 (חדש, oren-smart-advisor-brain-prompt-v5)` מוסיף הוראה מפורשת: אין להשתמש ב-`implementedAvailableRules`/`selectedRules` כדי לתאר חוק כ"פעיל" — רק `appliedBookRules` משמש לכך; חוק יכול להופיע גם ב-`appliedBookRules` וגם ב-`unresolvedSourceRelationshipRules` בו-זמנית (עמ' 53) בלי סתירה; `unresolvedApplicabilityRules` ≠ `missingVerifiedRelevantRules` (שני מצבים שונים לגמרי); `dhamirCoverage.selected`/`catalogued` אינם-אומרים ש-8 השיטות רצות-יחד — רק `evaluated`/`applied` משקפים-בפועל.

---

## 9. תוצאות הבדיקות

| קובץ | תוצאה |
|---|---|
| `_test_kashf_book_rule_catalog.mjs` (שוכתב, 14 סעיפים נדרשים + bonus) | **כל הבדיקות עברו** — כולל כל 14 הוכחות-הסמנטיקה המפורשות |
| `_test_kashf_ai_context_builder.mjs` | all passed |
| `_test_kashf_hawi_method_isolation.mjs` | all passed |
| `_test_kashf_structured_tool_output.mjs` | all passed |
| `_test_kashf_invalid_json_diagnosis.mjs` | all passed |
| `_test_oren_smart_advisor_kashf_reading_payload.mjs` | all passed |
| `_test_hall_wisdom_goral_qa_live_ai.mjs` | all passed |
| `_test_anthropic_provider_edge_content_blocks.mjs` | all passed |
| `_test_hall_wisdom_rule_decision_engine.mjs` | 218/218 |
| `_test_hall_wisdom_reading_planner.mjs` | 205/205 |
| `_test_hall_wisdom_reading_strategy_builder.mjs` | 282/282 |
| `_test_hall_wisdom_intent_analyzer.mjs` | 208/208 |

**Zero failures across all 12 suites.** ה-14 בדיקות הנדרשות (implemented≠applied, applicable≠selected, selected≠evaluated, evaluated≠verdict-impacting, appliedBookRules only with runtime evidence, unrun-implemented dhamir excluded, p.53 operationally-implemented-while-unresolved, p.101-102 never-applied, page-adjacency-not-verifiedRelevant, verdict unchanged, completeness partial, sanitizer pass, no engine change, no AI/fetch) — **כולן עברו**, בנוסף ל-regression-suite המלא.

**Payload size (readingId: kashf-live-pilot-003):** 31,400 → **32,003 bytes** (+603, ~2% — עלייה קטנה, בזכות שדות ה-`runtimeEvidence`-מבוססים החדשים).

## 10. אישור שה-verdict לא השתנה

מאושר — `_test_kashf_book_rule_catalog.mjs` §10: `buildKashfReading()` מחזיר פלט זהה בין קריאות, `positive:true` של pilot-003 ללא שינוי. אושש גם שאף קובץ-מנוע (`kashf-reading-engine.js`, `kashf-topic-rules.js`, `kashf-pending-extraction.js`, `kashf-narrative-writer.js`, `kashf-dhamir.js`) לא נערך — כל ה-`runtimeEvidence` נבנה מ**קריאה בלבד**, לא מעריכה.

---

**ממתין לאישורך.** אין Commit/Push/Deploy. עוצר כאן.
