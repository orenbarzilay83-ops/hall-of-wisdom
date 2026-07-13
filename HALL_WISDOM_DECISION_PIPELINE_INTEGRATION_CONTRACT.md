# HALL_WISDOM_DECISION_PIPELINE_INTEGRATION_CONTRACT.md

> **מסמך-חוזה בלבד. אין קוד. אין תיקיות חדשות. אין JS. אין Tests.**
> תאריך: 2026-07-13. ענף: `claude/app-cleanup-organization-mia9b2`.
> מטרת המסמך: להגדיר את **הממשקים והמעברים** בין כל רכיבי Reading Intelligence, לפני שמתחיל מימוש Reading Planner ושאר-השרשרת. זהו מסמך-אינטגרציה, לא מסמך-רכיב-בודד — הוא **אינו מגדיר לוגיקה עסקית חדשה**, ולא מחליף/משנה שום Component Contract שכבר אושר (Intent Analyzer, Reading Strategy Builder, Reading Planner).
> **עודכן** — נוספה שכבת **Learning & Knowledge Feedback → Human Approval (Oren) → Knowledge Repository** בסוף השרשרת (סעיפים 15-18 החדשים), ועודכנה טבלת ה-Component Ownership (סעיף 14) בהתאם. עדכון-תכנון בלבד — לא בוצע שינוי-קוד.

---

## 1. Scope

```
Question
↓
Intent Analyzer
↓
Reading Strategy Builder
↓
Knowledge Decision Pipeline
↓
Reading Planner
↓
Rule Decision Engine
↓
Engine Execution Coordinator
↓
Verification & Evidence
↓
Reasoning Layer
↓
Client Narrative Builder
↓
Advisor Narrative Builder
↓
Audit Module
↓
Mentor Module
↓
Learning & Knowledge Feedback
↓
Human Approval (Oren)
↓
Knowledge Repository
```

המסמך מגדיר: **contracts, handoffs, stop conditions, warnings, errors, traceability, responsibility boundaries.**

**מצב-מימוש נכון-להיום** (חשוב לקריאה נכונה של המסמך): Intent Analyzer ו-Reading Strategy Builder **כבר ממומשים ובדוקים** (208+238 assertions, ב-commit `5d2184c`/`d6e2bee`). Reading Planner **מאושר-כ-Component Contract** בלבד (`HALL_WISDOM_READING_PLANNER_COMPONENT_CONTRACT.md`), טרם ממומש. שאר-הרכיבים (Knowledge Decision Pipeline, Rule Decision Engine, Engine Execution Coordinator, Verification & Evidence, Reasoning Layer, שני ה-Narrative Builders, Audit Module, Mentor Module, **Learning & Knowledge Feedback**) **אין להם עדיין Component Contract משלהם** — השדות שמוגדרים עבורם בסעיף 4 הם **הכרזה-מוקדמת (forward declaration)** של הממשק-הצפוי, לא חוזה-סופי — כל אחד מהם עדיין יקבל Component Contract נפרד-משלו לפני מימוש, כפי שכבר נעשה לשלושת-הראשונים. **Human Approval (Oren) ו-Knowledge Repository אינם "רכיבי-קוד"** — הראשון הוא שער-אנושי-מפורש, השני הוא מקור-אמת-נתונים (ר' סעיפים 16-17).

---

## 2. Shared Envelope

כל רכיב בשרשרת מקבל ומחזיר את אותה מעטפת-בסיס:

```js
{
  pipelineRunId,
  readingDomain,
  method,
  question,
  topicId,
  questionType,
  actorType,
  clientMode,
  advisorMode,
  trace,
  warnings,
  errors,
  requiresClarification,
  clarificationQuestion,
  needsOrenDecision,
  confidence,
  versionMap,
}
```

### כללי-ברזל לכל רכיב

- **מקבל את המעטפת** כפי שהיא (לא בונה-מחדש).
- **מוסיף `output` משלו** — תוצאת-הרכיב-עצמו נוספת ליד המעטפת, לא בתוכה (המעטפת נשארת "שכבה משותפת", ה-output הוא "שכבה ספציפית-לרכיב").
- **אינו מוחק מידע של רכיב קודם** — `warnings`/`errors`/`trace` הם **תמיד-מצטברים** (append-only) לאורך השרשרת, אף רכיב לא "מנקה" ממצא של רכיב-שקדם-לו.
- **אינו משנה `question`/`method`/`readingDomain`** — שלושת-השדות-האלה נקבעים **פעם אחת בתחילת השרשרת** (Intent Analyzer) ונשארים קבועים-לחלוטין לאורך כל הריצה. שינוי שלהם באמצע השרשרת הוא הפרת-חוזה.
- **מוסיף `trace` entry** — ר' סעיף 3.

**הבהרה:** `confidence` ברמת-המעטפת הוא **ה-confidence-הנוכחי-ביותר** (של הרכיב האחרון שרץ), לא ממוצע/צבירה — כל רכיב עשוי לעדכן אותו (בדרך-כלל להנמיך, לעולם לא-להמציא-העלאה בלי-בסיס), אך אינו ממציא ערך-חדש-משלו-בלי-בסיס בקלט.

---

## 3. Trace Contract

כל רכיב מוסיף רשומת-trace אחת ל-`trace` (מערך, append-only):

```js
{
  componentId,
  componentVersion,
  startedAt,
  completedAt,
  inputSummary,
  outputSummary,
  warningsAdded,
  errorsAdded,
  stoppedPipeline,
  stopReason,
}
```

**⚠️ אין לשמור chain-of-thought.** `inputSummary`/`outputSummary` הם **סיכומים מבניים-דטרמיניסטיים** (למשל: "3 קטגוריות ב-primaryDecisionCategories, 0 warnings"), **לא** תיאור-תהליך-החשיבה של הרכיב. זהו אותו עיקרון שכבר נאכף על `decisionReason`/`strategyReason`/`plannerReason` בכל שלושת הרכיבים הקיימים — רק trace דטרמיניסטי, מבוקר וקצר.

---

## 4. Component Handoffs

### A. Intent Analyzer → Reading Strategy Builder

**כבר-ממומש** (Intent Analyzer, commit `5d2184c`) — Input/Output למטה תואמים **בדיוק** לפלט האמיתי של `analyzeIntent()`, לא ניחוש.

**Input:** `intentResult`, `questionType`, `method`, `readingDomain`
**Output required:** `primaryIntent`, `secondaryIntents`, `confidence`, `excludedIntents`, `strategyHints`, `forbiddenDefaultRuleCategories`, `requiresClarification`, `decisionReason`, `analysisVersion`

**Stop condition:** אם `requiresClarification===true` ואין אישור-להמשיך (מ-Oren, מחוץ לשרשרת) — **השרשרת נעצרת**. אין fallback שקט.

**הערת-התאמה:** `readingDomain` **אינו** עדיין שדה-קלט אמיתי ל-`analyzeIntent()` (הפונקציה הקיימת מקבלת `method`/`topicId`/`questionTypeHint` בלבד — ר' `intent-analyzer.js`). הוספת `readingDomain` כקלט-רשמי ל-Intent Analyzer היא עדכון-חוזה עתידי, לא בוצעה בסבב הזה (המסמך הזה **אינו** משנה קוד קיים).

### B. Reading Strategy Builder → Knowledge Decision Pipeline

**כבר-ממומש** (Reading Strategy Builder, commit `d6e2bee`) — תואם בדיוק לפלט האמיתי של `buildReadingStrategy()`.

**Output required:** `readingStrategy` (האובייקט המלא), `strategyConstraints`, `strategyReason`, `strategyVersion`, `confidence`, `requiresClarification`, `needsOrenDecision`

### C. Knowledge Decision Pipeline → Reading Planner

**⚠️ טרם ממומש, אין Component Contract עצמאי עדיין.**

**Output required:** `applicableRuleCategories`, `unavailableRuleCategories`, `sourceEvidencePointers`, `knowledgeWarnings`, `missingKnowledge`, `ambiguousMappings`, `needsOrenDecision`

**הערת-התאמת-שמות (חשוב):** ב-`HALL_WISDOM_READING_PLANNER_COMPONENT_CONTRACT.md` (סעיף 2), הקלט ל-Reading Planner כבר תיעד שני שדות גנריים לצורך זה — `knowledgeContext` ו-`availableRuleCategories`. המסמך הזה **מפרט לראשונה** את הצורה-המדויקת-הצפויה מ-Knowledge Decision Pipeline: `applicableRuleCategories` ≈ `availableRuleCategories` (שם-מדויק-יותר), `unavailableRuleCategories`/`knowledgeWarnings`/`missingKnowledge`/`ambiguousMappings` הם **תוכן** ה-`knowledgeContext` הגנרי שכבר תועד. **זהו עידון-שמות (refinement), לא סתירה** — כשיבנה Component Contract עצמאי ל-Knowledge Decision Pipeline, הוא יאמץ את השמות המדויקים כאן, וחוזה-הקלט של Reading Planner יעודכן-בהתאם (עדיין לא בוצע).

### D. Reading Planner → Rule Decision Engine

**מאושר כ-Component Contract** (`HALL_WISDOM_READING_PLANNER_COMPONENT_CONTRACT.md`), טרם ממומש בקוד. Output למטה הוא **תת-קבוצה מדויקת** מתוך 36 השדות של `ReadingPlan` — לא שדות-חדשים.

**Output required:** `readingPlan` (האובייקט המלא), `executionOrder`, `primaryDecisionCategories`, `verificationCategories`, `conditionalCategories`, `supportingCategories`, `advisorOnlyCategories`, `forbiddenCategories`, `unavailableCategories`, `plannerWarnings`, `plannerReason`

### E. Rule Decision Engine → Engine Execution Coordinator

**⚠️ טרם ממומש, אין Component Contract עצמאי עדיין.**

**Output required:** `selectedRuleIds`, `rejectedRuleIds`, `conditionalRuleIds`, `advisorOnlyRuleIds`, `unavailableRuleIds`, `ruleDecisionRecords`, `sourceEvidence`, `executionInstructions`, `needsOrenDecision`

**הערה:** זהו הרכיב שבו — לראשונה בכל השרשרת — נבחרים **Rule IDs סופיים**, לא רק קטגוריות. `ruleDecisionRecords` נבנה מתוך `rule-decision-schema.js` הקיים (`goral-hachol/intelligence/rule-decision-schema.js`, כבר-מתועד ב-`HALL_WISDOM_CORE_ARCHITECTURE.md` חלק ז) — שימוש-חוזר בסכימה קיימת, לא סכימה-מקבילה-חדשה.

### F. Engine Execution Coordinator → Verification & Evidence

**⚠️ טרם ממומש. חופף חלקית לרכיב-קיים-בפועל** — `goral-hachol/qa/goral-qa-output-collector.js` כבר ממלא תפקיד דומה בהקשר-QA (ר' `HALL_WISDOM_CORE_ARCHITECTURE.md` חלק ז).

**Output required:** `engineResults`, `executedRules`, `skippedRules`, `executionErrors`, `rawEvidence`, `calculationTrace`

### G. Verification & Evidence → Reasoning Layer

**⚠️ טרם ממומש כרכיב-פורמלי. חופף חלקית ל-`goral-hachol/qa/goral-qa-deterministic-checks.js` הקיים.**

**Output required:** `verifiedEvidence`, `contradictions`, `unresolvedConflicts`, `confidenceAdjustments`, `missingEvidence`, `evidenceChain`

### H. Reasoning Layer → Narrative Builders

**⚠️ טרם ממומש.** הסכימה העקרונית (`ReasoningRecord`) כבר תועדה ב-`HALL_WISDOM_CORE_ARCHITECTURE.md` חלק ט — Output למטה תואם-לה.

**Output required:** `reasoningRecord`, `conclusionBasis`, `uncertainty`, `contradictionExplanation`, `clientSafeFacts`, `advisorOnlyFacts`

**אילוץ-ברזל (חוזר מחלק ט):** אין לשמור/להציג chain-of-thought של מודל-שפה. Reasoning Layer שומר רק הסברים מובנים ומבוססי-מקור.

### I. Narrative Builders → Audit / Mentor

**Client Narrative Builder ו-Advisor Narrative Builder כבר קיימים בפועל וחיים-באפליקציה** (`kashf-narrative-writer.js::writeKashfReading`, `hawi-interpreter.js`) — ר' `HALL_WISDOM_CORE_ARCHITECTURE.md` חלק ג. ה-handoff **החדש** כאן הוא הפלט-הפורמלי-כלפי-Audit/Mentor, לא שינוי-ברכיבים-הקיימים.

**Output required:** `clientNarrative`, `advisorNarrative`, `sectionsShown`, `sectionsHidden`, `wordingWarnings`

### J. Audit / Mentor → Claude Instruction Generator

**Audit Module חופף ברובו ל-`goral-decision-brain.js::evaluateReading` הקיים.** Mentor Module קיים-כזרעים-בלבד (`goral-brain-evaluation-runner.mjs`).

**Output required:** `auditFindings`, `mentorRecommendations`, `severity`, `recommendedFixes`, `testsToAdd`, `codeInstructionForClaude`, `needsOrenDecision`

### K. Mentor Module → Learning & Knowledge Feedback (חדש)

**⚠️ טרם ממומש, אין Component Contract עצמאי עדיין.** ר' סעיף 15 להגדרת-אחריות-מלאה.

**Output required:** `recurringPatterns`, `recurringWarnings`, `recurringRejectedRules`, `sourceGaps`, `knowledgeExtensionSuggestions`, `qaSuggestions`, `testImprovementSuggestions`, `documentationUpdateSuggestions`

### L. Learning & Knowledge Feedback → Human Approval (Oren) (חדש)

**⚠️ טרם ממומש — ואינו-ניתן-למימוש-אוטומטי-מלא בהגדרה, שכן השלב-הבא הוא שער-אנושי.** ר' סעיף 16.

**Output required:** `proposals[]` (כל הצעה: `{ proposalId, proposalType, evidence, affectedKnowledge, affectedRules, affectedContracts, affectedQA, affectedTests, affectedEngines, recommendationText, orenDecision:'pending' }`)

### M. Human Approval (Oren) → Knowledge Repository (חדש)

**זהו שער-אנושי, לא שלב-אוטומטי.** ר' סעיף 16-17.

**Output required (רק לאחר אישור מפורש):** `approvedProposalIds`, `rejectedProposalIds`, `orenDecisionTimestamp`, `knowledgeRepositoryUpdateInstructions`

**Stop condition (מוחלט, לא-מותנה):** **ללא `orenDecision==='approved'` מפורש לכל proposal בנפרד — אין כל עדכון ל-Knowledge Repository, לשום Rule, לשום Contract, ל-QA, ל-Tests, או למנועים.** זהו לא "stop condition" רגיל שניתן-לעקוף בתנאים מסוימים — זהו שער-קבוע.

---

## 5. Stop Conditions

| רכיב | Stop conditions |
|---|---|
| Intent Analyzer | ambiguity · missing question |
| Reading Strategy Builder | conflicting intent/strategy · unsupported strategy |
| Knowledge Decision Pipeline | missing approved source · ambiguous rule applicability |
| Reading Planner | conflicting constraints · missing required inputs |
| Rule Decision Engine | no valid rule path · unresolved rule conflict |
| Engine Execution Coordinator | calculation failure · missing engine adapter |
| Verification Layer | irreconcilable contradiction · insufficient evidence |
| Audit | privacy leak · unsafe client output · source fidelity failure |

**כל stop חייב להחזיר:**

```js
{
  stopped: true,
  stopComponent,
  stopReason,
  recoverable,
  clarificationQuestion,
  needsOrenDecision,
}
```

`recoverable` מבחין בין stop-שניתן-להמשיך-ממנו-אחרי-הבהרה/החלטת-אורן (למשל `requiresClarification`), לבין stop-שדורש-תיקון-מחוץ-לריצה-הנוכחית (למשל `missing engine adapter`).

---

## 6. Warning vs Error vs Oren Decision

| קטגוריה | משמעות |
|---|---|
| **warning** | אפשר להמשיך, אבל יש סיכון/חוסר. |
| **error** | אי-אפשר להשלים את השלב. |
| **needsOrenDecision** | המערכת יכולה להציג אפשרויות, אך **אסור לה להכריע לבד**. |

**כלל-חובה:** כל רכיב חייב לסווג **כל ממצא** לאחת משלוש-הקטגוריות האלה — אין ממצא "לא-מסווג". זה מה שמאפשר ל-`warnings`/`errors` המצטברים (סעיף 2) להישאר שימושיים ל-Audit בסוף השרשרת, במקום להצטבר כרעש בלתי-ממוין.

---

## 7. Clarification Policy

**רק שלושת הרכיבים הבאים רשאים להחזיר `clarificationQuestion`:**

1. Intent Analyzer
2. Reading Strategy Builder
3. Reading Planner

**Rule Decision Engine ומטה (E-J) אינם מנסחים-מחדש את שאלת-המשתמש.** אם נדרשת הבהרה בשלב מאוחר (למשל Rule Decision Engine מגלה `no valid rule path`) — **מחזירים את הבקשה ל-Reading Planner או Intent Analyzer** (דרך `stopComponent`/`stopReason`, סעיף 5), **ולא ממציאים שאלה חדשה בתוך מנוע-הביצוע**. זהו הרחבה-ישירה של העיקרון שכבר אומץ בשלושת-הרכיבים-הראשונים: `clarificationQuestion` הוא תמיד מנוסח על-ידי הרכיב-שהכי-קרוב-להבנת-כוונת-המשתמש, לא על-ידי רכיב-ביצועי.

---

## 8. Versioning

```js
versionMap: {
  intentAnalyzer,          // כיום: ANALYSIS_VERSION = 'intent-analyzer-v1'
  strategyBuilder,          // כיום: STRATEGY_VERSION = 'reading-strategy-builder-v1'
  knowledgePipeline,         // טרם ממומש — null עד למימוש
  readingPlanner,             // מתועד ב-Component Contract כ-'reading-planner-v1', טרם ממומש בקוד — null עד אז
  ruleDecisionEngine,          // טרם ממומש — null
  executionCoordinator,         // טרם ממומש — null
  verificationLayer,             // טרם ממומש — null
  reasoningLayer,                  // טרם ממומש — null
  clientNarrativeBuilder,           // קיים בפועל, אין-לו-עדיין-version-מפורש (kashf-narrative-writer.js/hawi-interpreter.js) — ייקבע-בעתיד
  advisorNarrativeBuilder,           // קיים בפועל, אותה הערה
  auditModule,                        // חופף ל-evaluateReading הקיים, אין-לו-עדיין-version-מפורש
  mentorModule,                        // זרעים-בלבד — null
}
```

**כלל-חובה:** כל ריצה **חייבת** לשמור את ה-`versionMap` המלא (כולל `null` לרכיבים-שטרם-ממומשו) — כדי שבעתיד, כשרכיב יתעדכן, אפשר יהיה לזהות בדיוק אילו-ריצות-ישנות רצו-תחת-איזו-גרסה (Traceability, Core Constitution §5).

---

## 9. Privacy Boundary

**שדות אסורים במעטפת המשותפת (Shared Envelope, סעיף 2) ובכל `output` של כל רכיב:**

```
phone · rawClientHistory · rawDynFields · secrets · accessTokens · paymentData
```

**אם צריך מידע כזה בפועל** (למשל Audit צריך לדעת אם קריאה מסוימת שייכת-ללקוח-מסוים לצורך מעקב-איכות) — **הוא עובר דרך `reference ID` או `sanitized summary` בלבד**, לעולם לא כטקסט-גולמי. זהו אותו עיקרון שכבר אומץ בכל שלושת-הרכיבים-הקיימים (`question` הוא היוצא-מן-הכלל-היחיד-המתועד, ומותר-לו-לשאת-PII רק כי הוא שאלת-הלקוח-המקורית-הלגיטימית, ר' Reading Planner Component Contract סעיף 2 — לא נסתר, מוצהר-ומתועד).

---

## 10. Reading Domains

השרשרת תומכת **רק** ב:

- `reading.goralHachol`
- `reading.cards`

### כללים

- **Kashf/Hawi לעולם לא משתמשים בידע של Cards.**
- **Cards לעולם לא משתמשים ב-Kashf/Hawi rules.**
- **לכל Domain יש Knowledge Adapter נפרד** (עתידי — לא ממומש).
- **ה-shared pipeline contracts כן משותפים** — כל 14 סעיפי המסמך הזה (Shared Envelope, Trace, Handoffs, Stop Conditions, וכו') חלים-על-שני-ה-domains **באותה צורה בדיוק**, בדיוק כפי שכבר נקבע ב-Reading Planner Component Contract ("אותו Output Contract בדיוק לכל readingDomain — אין חוזה-נפרד-לכל-domain").
- **`rule IDs`, `source evidence` ו-`engine adapters` אינם משותפים בין domains** — אלה השכבה-שכן-ספציפית-ל-domain-אחד-בכל-קריאה (ר' גם "הפרדת-Domains" ב-Reading Planner Component Contract, סעיף 3).

---

## 11. End-to-End Decision Test Contract

**⚠️ תכנון-בדיקות-עתידיות בלבד — ללא מנוע חי, ללא AI, לא ממומש בשלב זה.**

### סכימת-תרחיש עקרונית

```js
{
  scenarioId,
  question,
  readingDomain,
  method,
  expectedIntent,
  expectedStrategy,
  expectedPlanCategories,
  expectedForbiddenCategories,
  expectedStopComponent,
  expectedWarnings,
  expectedNeedsOrenDecision,
}
```

### 10 קטגוריות-תרחיש נדרשות (עתידי — לא ממומש, לא נכתב תוכן-בדיקה בפועל)

| # | קטגוריה | דוגמת-שאלה (ניתנת-לצורך-המחשה, לא ידע-מקצועי) |
|---|---|---|
| 1 | Business Prediction | "האם העסק החדש יצליח?" (כבר-נבדק-בפועל ב-Intent Analyzer/Reading Strategy Builder/Reading Planner) |
| 2 | Business Decision Support | "האם כדאי לי לפתוח עסק?" (כבר-נבדק-בפועל) |
| 3 | Hidden Thought | "מה הוא חושב עליי?" (כבר-נבדק-בפועל) |
| 4 | Timing | "מתי העסק יתחיל להרוויח?" (כבר-נבדק-בפועל) |
| 5 | Spiritual question | "האם יש עליי עין הרע?" (דוגמת-תרחיש-לצורך-מבנה-בלבד — **אין** בזה שום פירוש/ידע-מקצועי, רק מזהה-סוג-שאלה שאמור להפעיל `spiritualPolicy` שונה) |
| 6 | Ambiguous question | "מה קורה בעסק?" (כבר-נבדק-בפועל — `primaryIntent==='unknown'`) |
| 7 | Conflicting constraints | תרחיש-מלאכותי שבו `mustInclude` ו-`mustExclude` מתנגשים (כבר יש לו כיסוי-Validator ב-Reading Strategy Builder/Reading Planner, `expectedStopComponent` צפוי: Reading Planner) |
| 8 | Missing knowledge | תרחיש שבו `Knowledge Decision Pipeline` מחזיר `missingKnowledge` לא-ריק — `expectedStopComponent`: Knowledge Decision Pipeline |
| 9 | Cards relationship spread | "האם הקשר הזה יכול להתפתח?" (`readingDomain:'cards'`, כבר-הודגם-כ-illustrative ב-Reading Planner Component Contract דוגמה 5) |
| 10 | Domain mismatch | `readingDomain:'cards'` עם `method:'hawi'` — קלט לא-חוקי, `expectedStopComponent`: Reading Planner (Validator "method תואם-readingDomain") |

**⚠️ לא נכתב תוכן-תרחיש מלא לאף אחת מ-10 הקטגוריות למעלה.** זו רשימת-קטגוריות-נדרשות בלבד — הבדיקות-בפועל (`_test_hall_wisdom_decision_pipeline_*.mjs` או דומה) הן עבודה עתידית, אחרי שכל הרכיבים-הרלוונטיים ימומשו.

---

## 12. Integration Rules

- **רכיב לא קורא ישירות לרכיב שנמצא שני שלבים קדימה** — כל handoff הוא צעד-אחד-בלבד (Intent Analyzer מדבר רק עם Reading Strategy Builder, לא ישירות עם Reading Planner).
- **רכיב לא עוקף stop condition.**
- **רכיב לא משנה output של רכיב קודם** — עקבי עם "אינו מוחק מידע של רכיב קודם" (סעיף 2).
- **כל normalization נעשית בתחילת השרשרת בלבד** — `normalizeQuestion()` (Intent Analyzer) הוא המקום היחיד שבו הטקסט-הגולמי מעובד; אף רכיב-הלאה-בשרשרת לא מנרמל-מחדש.
- **כל source evidence נשמר לאורך כל השרשרת** — `sourceEvidencePointers`/`sourceEvidence` עוברים-הלאה (echo), לא נבנים-מחדש בכל שלב.
- **כל warning נשאר traceable עד Audit** — עקבי עם ה-`warnings` המצטבר במעטפת (סעיף 2).
- **כל החלטה שמצריכה את אורן נשארת מסומנת עד סוף הריצה** — `needsOrenDecision` ברמת-המעטפת, ברגע שהופך `true` על-ידי רכיב-כלשהו, **לעולם לא הופך-חזרה ל-`false`** על-ידי רכיב-מאוחר-יותר.
- **AI Runtime אינו חלק משרשרת ההכרעה הדטרמיניסטית** — עקבי עם `HALL_WISDOM_CORE_ARCHITECTURE.md` חלק יא ("AI Runtime לפי צורך", בסוף-מוחלט) וחלק טז (AI is an Assistant).
- **AI Runtime יכול לנסח/לסכם/לבקר רק אחרי שנבנו contracts מלאים** — כלומר רק אחרי Reasoning Layer/Narrative Builders/Audit, לא באמצע השרשרת הדטרמיניסטית.

---

## 13. Relationship to Site Intelligence

**Decision Pipeline שייך רק ל-Reading Intelligence.** Site Intelligence משתמש ב-**Pipeline נפרד-לחלוטין**:

```
Health Checks
↓
Evidence Collection
↓
Issue Classification
↓
Site Audit
↓
Site Mentor
↓
Claude Repair Plan
```

**אין לערבב בין שני ה-Pipelines.** שני ה-Pipelines חולקים **מונחים-דומים** (שניהם יש להם "Audit"/"Mentor") אך הם **רכיבים נפרדים-לגמרי**, בכל domain נפרד (Reading Intelligence מול Site Intelligence, כבר תועד ב-`HALL_WISDOM_CORE_ARCHITECTURE.md` חלק יד) — "Audit Module" בשרשרת-הזו (סעיף 1) הוא **לא** אותו רכיב כמו "Site Audit" בשרשרת-האתר.

---

## 14. Component Ownership Table

| Component | Owner Domain | Deterministic/AI | Input | Output | May stop pipeline | May ask clarification | May set needsOrenDecision | Client-facing/Advisor-only |
|---|---|---|---|---|---|---|---|---|
| Intent Analyzer | Reading Intelligence | Deterministic | question, method, topicId | primaryIntent, ... (ר' A) | ✅ | ✅ | ✅ | (פנימי — לא-פונה-ישירות-ללקוח) |
| Reading Strategy Builder | Reading Intelligence | Deterministic | intentResult, questionType, method | readingStrategy, strategyConstraints, ... (ר' B) | ✅ | ✅ | ✅ | פנימי |
| Knowledge Decision Pipeline | Reading Intelligence | Deterministic | readingStrategy, readingDomain | applicableRuleCategories, ... (ר' C) | ✅ | ❌ | ✅ | פנימי |
| Reading Planner | Reading Intelligence | Deterministic | intentResult, readingStrategy, knowledgeContext | readingPlan, executionOrder, ... (ר' D) | ✅ | ✅ | ✅ | פנימי |
| Rule Decision Engine | Reading Intelligence | Deterministic | readingPlan | selectedRuleIds, ... (ר' E) | ✅ | ❌ | ✅ | פנימי |
| Engine Execution Coordinator | Reading Intelligence | Deterministic (proxy) | executionInstructions | engineResults, ... (ר' F) | ✅ | ❌ | ❌ | פנימי |
| Verification & Evidence | Reading Intelligence | Deterministic | engineResults | verifiedEvidence, contradictions, ... (ר' G) | ✅ | ❌ | ✅ | פנימי |
| Reasoning Layer | Reading Intelligence | Deterministic (never AI chain-of-thought) | verifiedEvidence, ruleDecisionRecords | reasoningRecord, ... (ר' H) | ❌ | ❌ | ❌ | פנימי |
| Client Narrative Builder | Reading Intelligence | Deterministic | reasoningRecord, readingPlan | clientNarrative | ❌ | ❌ | ❌ | **Client-facing** |
| Advisor Narrative Builder | Reading Intelligence | Deterministic | reasoningRecord, ruleDecisionRecords | advisorNarrative | ❌ | ❌ | ❌ | **Advisor-only** |
| Audit Module | Reading Intelligence | Deterministic | readingPlan, clientNarrative, advisorNarrative | auditFindings | ✅ (privacy/safety stop) | ❌ | ✅ | פנימי |
| Mentor Module | Reading Intelligence | Deterministic (AI-assisted עתידי, לאחר אישור נפרד) | auditFindings | mentorRecommendations | ❌ | ❌ | ✅ | פנימי |
| **Learning & Knowledge Feedback** (חדש) | Reading Intelligence | Deterministic — **צופה/מציע בלבד, לעולם לא-לומד-לבד** | mentorRecommendations, auditFindings (מרובות-ריצות) | proposals[] (ר' סעיף 15) | ❌ | ❌ | ✅ (כל proposal חייב needsOrenDecision) | פנימי |
| **Human Approval (Oren)** (חדש) | Reading Intelligence | **אנושי — לא-קוד, לא-AI** | proposals[] | approvedProposalIds/rejectedProposalIds | ✅ (שער-קבוע, לא-מותנה) | ❌ | (הוא-עצמו-ה-decision) | פנימי |
| **Knowledge Repository** (חדש) | Reading Intelligence | **מאגר-נתונים — לא רכיב-לוגי** | knowledgeRepositoryUpdateInstructions (רק-אחרי-אישור) | Knowledge Memory המעודכן | — | — | — | פנימי (מקור-אמת, לא-פונה-ללקוח-ישירות) |

---

## 15. Learning & Knowledge Feedback

**הרכיב אינו לומד לבד. הרכיב אינו משנה ידע. הרכיב אינו משנה חוקים. הרכיב אינו משנה ספרים. הרכיב אינו מוסיף Rule. הרכיב אינו מסיר Rule. הרכיב אינו משנה Knowledge Graph.**

**תפקידו בלבד — לזהות ולהציע, לא להחליט ולא לשנות:**

- לזהות דפוסים חוזרים.
- לזהות Warnings שחוזרים פעמים רבות.
- לזהות Rules שחוזרים ונדחים.
- לזהות Topics שאין עבורם ידע מספיק.
- לזהות Source Gaps.
- לזהות הצעות להרחבת הידע.
- לזהות הצעות ל-QA חדש.
- לזהות הצעות לשיפור Tests.
- לזהות הצעות לעדכון Documentation.

**קלט:** תוצרים-מצטברים מרובי-ריצות של Audit Module + Mentor Module (`auditFindings`/`mentorRecommendations`, ר' Handoff J) — **לא** קריאה בודדת, אלא דפוס-לאורך-זמן. **פלט:** `proposals[]` (ר' Handoff K/L) — כל הצעה נושאת `evidence` (על אילו ריצות/ממצאים היא מבוססת) ו-`needsOrenDecision: true` **תמיד**, ללא יוצא-מן-הכלל.

---

## 16. Human Approval (Oren)

**שלב-חובה, לא-אופציונלי.** כל `proposal` שיוצא מ-Learning & Knowledge Feedback **חייב** לעבור דרכו.

**ללא אישור מפורש (per-proposal, לא גורף):**
- אין שינוי Knowledge Repository.
- אין שינוי Rules.
- אין שינוי Contracts.
- אין שינוי QA.
- אין שינוי Tests.
- אין שינוי Engines.

זהו אותו-דיוק-עיקרון שכבר חוזר בכל מסמכי הסבב הזה (Intent Analyzer `unknown`+`requiresClarification`, Reading Strategy Builder `needsOrenDecision`, Reading Planner `needsOrenDecision`) — מובא כאן לרמת-ה-**Pipeline-כולו**: שום הצעה, גם כזו שנתמכת-בהרבה-evidence, לא הופכת-אוטומטית-לשינוי-בפועל.

---

## 17. Knowledge Repository

**Knowledge Repository הוא מקור-האמת** (עקבי עם "Knowledge Memory" ב-`HALL_WISDOM_CORE_ARCHITECTURE.md` חלק ו-ז — לא מאגר-מקביל-חדש, אלא השם-התפעולי-של-אותו-מקור-אמת בהקשר-ה-Pipeline הזה).

**הוא מתעדכן רק לאחר:**
```
Learning & Knowledge Feedback
↓
Human Approval
```

**ולעולם לא ישירות על-ידי AI.** אין נתיב-עוקף — גם אם Mentor Module יהיה AI-assisted בעתיד (לאחר אישור נפרד, כפי שכבר מותנה ב-`HALL_WISDOM_CORE_ARCHITECTURE.md` חלק יב, Roadmap), הפלט שלו עדיין עובר דרך Learning & Knowledge Feedback ← Human Approval לפני שהוא נוגע ב-Knowledge Repository — **בלי קיצור-דרך**.

---

## 18. Architecture Principle: The System May Learn Observations, But Never Changes Knowledge Autonomously

זהו עיקרון-על נוסף, באותה משפחה כמו העיקרון שכבר תועד ב-`HALL_WISDOM_CORE_ARCHITECTURE.md` חלק טז ("AI is an Assistant, Hall of Wisdom Core is the Decision Maker") — הרחבה שלו לספציפית-ל-Learning Loop:

**Allowed:**
- Observe.
- Suggest.
- Explain.
- Prioritize.

**Forbidden:**
- Learn autonomously.
- Rewrite rules.
- Update books.
- Change interpretations.
- Modify engines.

**עיקרון-בדיקה שימושי (מקביל לזה שכבר נקבע בחלק טז):** אם רכיב-כלשהו בשכבת Learning & Knowledge Feedback מתחיל "לשנות" משהו במקום "להציע" — זו סטייה מהעיקרון הזה, ודורשת אישור-מפורש-נפרד לפני מימוש.

---

## סיכום היקף המסמך הזה

✅ הוגדרו: Scope + Pipeline מלא (כולל שכבת Learning & Knowledge Feedback → Human Approval → Knowledge Repository), Shared Envelope, Trace Contract, 13 Handoffs (A-M) עם Input/Output מדויקים, Stop Conditions לכל רכיב, הבחנת warning/error/needsOrenDecision, Clarification Policy (3 רכיבים בלבד), Versioning (`versionMap`), Privacy Boundary, הפרדת Reading Domains, E2E Test Contract (10 קטגוריות-נדרשות), Integration Rules, קשר ל-Site Intelligence, טבלת Component Ownership מלאה (15 שורות), אחריות Learning & Knowledge Feedback, שער Human Approval, הבהרת Knowledge Repository, ועיקרון-ארכיטקטוני חדש (Learn-Observations-Never-Autonomous).

❌ שום קוד. שום תיקייה חדשה. שום קובץ `.js`/`.mjs`. שום test. שום שינוי-מנועים/QA/UI/קלפים/Supabase. שום AI. שום commit. שום push. שום שינוי-ללוגיקה-עסקית-קיימת או ל-Component Contracts שכבר אושרו.
