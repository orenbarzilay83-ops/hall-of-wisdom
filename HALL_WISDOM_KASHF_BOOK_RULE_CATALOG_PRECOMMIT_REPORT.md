# HALL_WISDOM_KASHF_BOOK_RULE_CATALOG_PRECOMMIT_REPORT

> Precommit report only. No AI call. No Deploy. No engine change (Kashf or
> Hawi). No UI change. No Commit, no Push of this layer — awaiting explicit
> approval.

Implements Step B (Canonical Book Rule Catalog) from your approved
Method-Isolation-follow-up instructions, built entirely from
`HALL_WISDOM_KASHF_EXHAUSTIVE_WITNESS_AND_SPIRITUAL_RULES_AUDIT.md`
(already committed, `22ea380`). Scope: `spiritualDiagnostics` topic only —
no speculative entries for other topics.

---

## 1. מבנה קטלוג החוקים

Two new, self-contained data/engine files, following the repo's existing
`data/sources/` vs `engine/` split:

- **`goral-hachol/data/sources/kashf-al-asrar/kashf-book-rule-catalog.js`**
  — `KASHF_BOOK_RULE_CATALOG` (rule records, exact schema you specified:
  `ruleKey, ruleCategory, sourceMethod, sourceBook, sourcePage,
  sourceSection, shortSourceReference, appliesToTopics,
  appliesToQuestionTypes, triggerConditions, requiredHouses,
  requiredFigures, calculationType, verdictEffect, precedence,
  conflictHandling, evidenceRole, implementationStatus, enginePath,
  confidence, unresolvedReason`, plus `resolutionStatus` where relevant) +
  `KASHF_DHAMIR_METHOD_COVERAGE` (the 8 sub-method coverage map).
- **`goral-hachol/engine/kashf-book-rule-selector.js`** — pure,
  deterministic `selectApplicableBookRules({method, topicId,
  questionType, primaryIntent})`. No board computation, no new facts —
  lookup + categorization only.

## 2. מספר החוקים שהוזנו

**7 רשומות ב-`KASHF_BOOK_RULE_CATALOG`** (רק verified-relevant, כלום unresolved-content לא-נכנס-כפעיל):
1. `kashf-p167-primary-formula-spiritual-sorcery`
2. `kashf-p167-alt-formula-hidden-action`
3. `kashf-p166-movement-initiator`
4. `kashf-p49-house6-sorcery-domain`
5. `kashf-p53-witness-scheme-basic` (unresolved)
6. `kashf-p101-witness-scheme-extended` (unresolved)
7. `kashf-p101-witness-non-dispensable-principle`
8. `kashf-p155-dhamir-majority-decision`

(8 total — 6 "resolved/applied-eligible" + 2 unresolved-flagged, kept as
real catalog entries but never returned in an applied bucket.)

**8 רשומות ב-`KASHF_DHAMIR_METHOD_COVERAGE`** — 5 `implemented`, 3 `missing`.

## 3. כל קטגוריות העדים שנשמרו בנפרד

| מערכת | sourcePage | requiredHouses | resolutionStatus |
|---|---|---|---|
| בסיסית | 53 | [13,14,15] | `unresolved-source-relationship` |
| מורחבת | "101-102" | [9,13,14,15,16] | `unresolved-source-relationship` |

**מאומת (test §1/§2):** `sourcePage` שונה, `requiredHouses` שונה, שתי
הרשומות קיימות בו-זמנית, ואף אחת לא-נמחקה/נבחרה/מוזגה. `resolutionStatus`
זהה בכוונה (שתיהן "לא-פתורות") — לא נבחרה אחת-על-פני-השנייה.

## 4. מפת 8 שיטות הדמיר

| methodKey | page | implemented? |
|---|---|---|
| type1-face1-mizan | 151-152 | ✅ |
| type1-face2-harkat-al-ard | 152 | ✅ |
| type1-face3-depth-movement | 152 | ❌ missing |
| type1-face4-jawharayn | 153 | ✅ |
| type2-element-prevalence | 153-154, 104-105 | ✅ |
| type3-mothers-arithmetic | 154 | ❌ missing |
| type4-opening-abjad | 154-155 | ✅ |
| type5-circle-closure | 155 | ❌ missing |

**5/8 implemented, 3/8 missing — verified by test §7/§8, never reported as
"all verified" anywhere in code or payload.**

## 5. Selector לפי שאלה

`selectApplicableBookRules({method:'kashf', topicId:'spiritualDiagnostics'})`
מחזיר 7 buckets: `verdictRules` (A), `supportingRules` (B),
`generalWitnessRules` (C), `dhamirRules` (D — כולל את כל 8 שיטות-הדמיר +
כלל-הרוב, כי דמיר עצמאי-מנושא לפי המקור עצמו), `irrelevantRules` (E),
`unresolvedRules` (F), ו-`unavailableRules` (cross-cutting: כל רשומה
matched-אך-לא-implemented, למעט unresolved שלא-נכנסות-לשם-בכלל כדי
לא-לכפול-סיווג). **מדגם-אמת (spiritualDiagnostics):**

```
verdictRules: [primaryFormula, altFormula]                    (2)
supportingRules: [movement-initiator, house6-domain]           (2)
generalWitnessRules: [witness-non-dispensable-principle]       (1)
dhamirRules: [majority-decision + 8 methods]                   (9)
irrelevantRules: []                                            (0)
unresolvedRules: [witness-scheme-basic, witness-scheme-extended] (2)
unavailableRules: [non-dispensable-principle, 3 missing dhamir methods] (4)
```

## 6. אילו חוקים נבחרים ל-spiritualDiagnostics

ראה טבלה בסעיף 5 — **verdict נקבע אך ורק מ-2 רשומות** (primaryFormula,
altFormula), בדיוק כפי שאומת ב-Traceability הקודם. שום רשומת-עדים (לא
בסיסית, לא מורחבת, לא העיקרון-הכללי) לא-נכנסת ל-`verdictRules`.

## 7. אילו חוקים נשארים unresolved

`kashf-p53-witness-scheme-basic` ו-`kashf-p101-witness-scheme-extended` —
שתיהן, תמיד, בכל קריאה ל-spiritualDiagnostics, עד שתהיה הכרעת-מקור
מפורשת. **לא נגעתי ב-`computeWitnessTestimony` הקיים** (עדיין מיישם רק את
המערכת הבסיסית, כפי שהיה) — הקטלוג רק **מתעד** את שתי המערכות, לא-בוחר
ולא-מפעיל את המורחבת.

## 8. כיצד ימולא sourceEvidence (בעתיד)

לא מולא בסבב זה (כפי שנדרש — "אין למלא חוק חסר"). המבנה שנבנה מאפשר
בעתיד: `readingContext.activatedBookRules` = `verdictRules ∪
supportingRules` שבפועל השתתפו בחישוב-הריאלי (השוואה מול
`engineOutput.primaryFormula`/`altFormula` בפועל), `evaluatedBookRules` =
כל מה ש-selector החזיר, `rejectedBookRules` = ריק כרגע (אין עדיין מנגנון
דחיה-אמיתי), `unavailableBookRules` = `unavailableRules` ישירות מה-selector,
`unresolvedBookRules` = `unresolvedRules` ישירות. **לא מומש בסבב זה** —
זו הצעת-מבנה בלבד, כפי שהתבקש ("יש להציע כיצד למלא בעתיד").

## 9. כיצד הבינה תדע מה חסר לה

`readingContext.ruleCoverageStatus` (חדש, מחובר בפועל ל-payload האמיתי):
```json
{
  "completeness": "partial",
  "implementedRelevantRules": ["kashf-p167-primary-formula-spiritual-sorcery", "...", 10 total],
  "missingRelevantRules": ["kashf-p101-witness-non-dispensable-principle", "type1-face3-depth-movement", "type3-mothers-arithmetic", "type5-circle-closure"],
  "unresolvedRules": ["kashf-p53-witness-scheme-basic", "kashf-p101-witness-scheme-extended"],
  "sourceCoverage": {
    "verdictRules": 2, "supportingRules": 2, "generalWitnessRules": 1,
    "dhamirRules": {"total": 9, "implemented": 6, "missing": 3},
    "dhamirMethodsOnly": {"total": 8, "implemented": 5, "missing": 3},
    "unresolvedWitnessSchemes": 2
  }
}
```
**Prompt rule #13 (חדש)** מחייב את ה-AI: אסור לטעון-שלמות-כשלא-complete,
אסור להפעיל unresolved-rule כחוק-פעיל, אסור להשלים חוק-חסר מהידע הכללי
שלו, אסור למזג מערכות-עדים, אסור להסיק precedence-לא-מקורי, וחובה להבדיל
בין engine-verdict (תמיד-ודאי) לבין book-rule-coverage (יכול-להיות-חלקי).

## 10. תוצאות הבדיקות

| קובץ | תוצאה |
|---|---|
| `_test_kashf_book_rule_catalog.mjs` (חדש) | 12/12 סעיפים, כל ה-assertions עברו |
| `_test_kashf_ai_context_builder.mjs` | all passed, ללא שינוי-נדרש |
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

**Zero failures across all 12 suites.**

## 11. אישור שלא שונה מנוע

מאושר. `git diff --stat` (מטה) מראה רק: 2 קבצים חדשים (data+engine
selector, לא-מנוע-קיים), `kashf-ai-context-builder.js` (שכבת-projection,
לא-מנוע), `oren-smart-advisor-brain-prompt.ts` (prompt). אפס קבצים תחת
`goral-hachol/engine/kashf-reading-engine.js`,
`kashf-pending-extraction.js`, `hawi-interpreter.js`,
`raml-board-generator.js` נגעו. אומת גם structurally בטסט (§11: פלט-מנוע
זהה בין קריאות, `computeWitnessTestimony`'s file לא-מכיל אזכור-לקטלוג).

```
 _test_oren_smart_advisor_kashf_live_runner.mjs        | 40 +++ (לא-חלק מסבב זה, כבר-ידוע)
 goral-hachol/intelligence/kashf-ai-context-builder.js | 67 ++-
 supabase/functions/oren-smart-advisor/oren-smart-advisor-brain-prompt.ts | 19 ++-
 (+ 3 new files: kashf-book-rule-catalog.js, kashf-book-rule-selector.js, _test_kashf_book_rule_catalog.mjs)
```

## 12. אישור שלא הופעל AI

מאושר. כל 12 הבדיקות משתמשות רק בקריאות-פונקציה-מקומיות-דטרמיניסטיות —
`fetch`/`callAnthropic` — 0 מופעים בקבצים החדשים (test §12).

## 13. אישור שלא בוצע Deploy

מאושר. שום פקודת `supabase` לא-הורצה בסבב זה.

## 14. הצעד הבא המדויק

ממתין לאישורך:
1. Commit + Push לחמשת-הקבצים של הסבב הזה (`kashf-book-rule-catalog.js`,
   `kashf-book-rule-selector.js`, `_test_kashf_book_rule_catalog.mjs`,
   `kashf-ai-context-builder.js`, `oren-smart-advisor-brain-prompt.ts`) —
   **לא** כולל את שני קובצי ה-output-capture המקומיים מהסבב הקודם.
2. **בנפרד, ורק אחר-כך:** הכרעת-אורן על סעיף 4 בביקורת-הקודמת (עמ' 53 מול
   עמ' 101-102) — עדיין לא-מוכרעת, עדיין לא-מבוקשת ממך בסבב הזה.

**Payload size (readingId: kashf-live-pilot-003, אותו תרחיש-אמת):**
27,929 → **28,781 bytes** (+852 bytes, ~3% — עלייה קטנה וסבירה בזכות
`ruleCoverageStatus` השקוף החדש).
