# HALL_WISDOM_DECISION_PIPELINE_INTEGRATION_CONTRACT_REPORT.md

> **דוח לפני commit. לא בוצע commit. לא בוצע push.**
> תאריך: 2026-07-13. ענף: `claude/app-cleanup-organization-mia9b2`.
> שלב: **מסמך-אינטגרציה בלבד** — `HALL_WISDOM_DECISION_PIPELINE_INTEGRATION_CONTRACT.md`, מגדיר ממשקים/מעברים בין רכיבי Reading Intelligence, לפני מימוש Reading Planner ושאר השרשרת.
> **עודכן** — נוספה שכבת **Learning & Knowledge Feedback → Human Approval (Oren) → Knowledge Repository** בסוף השרשרת (ר' סעיף 4א החדש). עדכון-תכנון בלבד — לא בוצע שינוי-קוד.

---

## 1. `git status --short`

```
?? HALL_WISDOM_DECISION_PIPELINE_INTEGRATION_CONTRACT.md
?? HALL_WISDOM_DECISION_PIPELINE_INTEGRATION_CONTRACT_REPORT.md   (קובץ זה)
?? HALL_WISDOM_READING_PLANNER_COMPONENT_CONTRACT.md               (מסבב קודם, ממתין-לאישור-נפרד)
?? HALL_WISDOM_SESSION_SUMMARY_REPORT.md                            (ישן, לא-קשור)
?? HALL_WISDOM_UNCOMMITTED_WORK_AUDIT.md                             (ישן, לא-קשור)
```

## 2. `git diff --stat`

```
(ריק — אין שינוי לשום קובץ עקוב-גיט קיים, כל השינוי הוא קבצים חדשים בלבד)
```

## 3. אישור — עודכנו רק שני המסמכים

✅ `HALL_WISDOM_DECISION_PIPELINE_INTEGRATION_CONTRACT.md` (עודכן — נוספו handoffs K/L/M, סעיפים 15-18, שורות-חדשות בטבלת-Ownership)
✅ `HALL_WISDOM_DECISION_PIPELINE_INTEGRATION_CONTRACT_REPORT.md` (עודכן, זה)

שום קובץ אחר לא נערך/נוצר. `HALL_WISDOM_READING_PLANNER_COMPONENT_CONTRACT.md` נשאר untracked מסבב-קודם, לא נגוע בסבב הזה. שני הקבצים עדיין untracked-לגמרי (מעולם לא היו ב-git) — `git diff --stat` נשאר ריק, אין diff-מול-HEAD.

---

## 4. סיכום ה-Shared Envelope

```js
{
  pipelineRunId, readingDomain, method, question, topicId, questionType,
  actorType, clientMode, advisorMode, trace, warnings, errors,
  requiresClarification, clarificationQuestion, needsOrenDecision, confidence, versionMap,
}
```

כללי-ברזל: כל רכיב מקבל את המעטפת כמו-שהיא, מוסיף `output` משלו (לא לתוך המעטפת), **לעולם לא מוחק** `warnings`/`errors`/`trace` שנוספו קודם (append-only), **לעולם לא משנה** `question`/`method`/`readingDomain` (נקבעים פעם-אחת ב-Intent Analyzer), ומוסיף רשומת-trace אחת (סעיף 5 להלן).

## 5. סיכום ה-Handoffs (10, A-J)

| Handoff | סטטוס-מימוש | Output עיקרי |
|---|---|---|
| A. Intent Analyzer → Strategy Builder | **ממומש בפועל** | primaryIntent, secondaryIntents, confidence, excludedIntents, strategyHints, forbiddenDefaultRuleCategories, requiresClarification, decisionReason, analysisVersion |
| B. Strategy Builder → Knowledge Decision Pipeline | **ממומש בפועל** | readingStrategy, strategyConstraints, strategyReason, strategyVersion, confidence, requiresClarification, needsOrenDecision |
| C. Knowledge Decision Pipeline → Reading Planner | טרם ממומש | applicableRuleCategories, unavailableRuleCategories, sourceEvidencePointers, knowledgeWarnings, missingKnowledge, ambiguousMappings, needsOrenDecision |
| D. Reading Planner → Rule Decision Engine | **מאושר כ-Contract**, טרם קוד | readingPlan, executionOrder, 7 קטגוריות, plannerWarnings, plannerReason |
| E. Rule Decision Engine → Engine Execution Coordinator | טרם ממומש | selectedRuleIds, rejectedRuleIds, conditionalRuleIds, advisorOnlyRuleIds, unavailableRuleIds, ruleDecisionRecords, sourceEvidence, executionInstructions, needsOrenDecision |
| F. Engine Execution Coordinator → Verification & Evidence | טרם ממומש (חופף חלקית ל-goral-qa-output-collector.js) | engineResults, executedRules, skippedRules, executionErrors, rawEvidence, calculationTrace |
| G. Verification & Evidence → Reasoning Layer | טרם ממומש (חופף חלקית ל-goral-qa-deterministic-checks.js) | verifiedEvidence, contradictions, unresolvedConflicts, confidenceAdjustments, missingEvidence, evidenceChain |
| H. Reasoning Layer → Narrative Builders | טרם ממומש | reasoningRecord, conclusionBasis, uncertainty, contradictionExplanation, clientSafeFacts, advisorOnlyFacts |
| I. Narrative Builders → Audit/Mentor | **Narrative Builders עצמם קיימים וחיים**, ה-handoff הפורמלי טרם ממומש | clientNarrative, advisorNarrative, sectionsShown, sectionsHidden, wordingWarnings |
| J. Audit/Mentor → Claude Instruction Generator | טרם ממומש (Audit חופף ל-evaluateReading, Mentor זרעים-בלבד) | auditFindings, mentorRecommendations, severity, recommendedFixes, testsToAdd, codeInstructionForClaude, needsOrenDecision |

**הערת-התאמת-שמות מתועדת (Handoff C):** `applicableRuleCategories`/`unavailableRuleCategories`/`knowledgeWarnings`/`missingKnowledge`/`ambiguousMappings` הם עידון-שמות של `knowledgeContext`/`availableRuleCategories` הגנריים שכבר תועדו כקלט ל-Reading Planner — לא סתירה, יעודכן-בפועל כשיבנה Component Contract עצמאי ל-Knowledge Decision Pipeline.

**עודכן — נוספו 3 handoffs (K, L, M):**

| Handoff | סטטוס-מימוש | Output עיקרי |
|---|---|---|
| K. Mentor Module → Learning & Knowledge Feedback | טרם ממומש | recurringPatterns, recurringWarnings, recurringRejectedRules, sourceGaps, knowledgeExtensionSuggestions, qaSuggestions, testImprovementSuggestions, documentationUpdateSuggestions |
| L. Learning & Knowledge Feedback → Human Approval (Oren) | טרם ממומש (ולא-ניתן-לאוטומציה-מלאה, כי השלב הבא הוא שער-אנושי) | `proposals[]` — כל אחת עם `evidence`, `affectedKnowledge/Rules/Contracts/QA/Tests/Engines`, `orenDecision:'pending'` |
| M. Human Approval (Oren) → Knowledge Repository | שער-אנושי, לא-קוד | `approvedProposalIds`, `rejectedProposalIds`, `orenDecisionTimestamp`, `knowledgeRepositoryUpdateInstructions` — **רק לאחר אישור מפורש per-proposal** |

## 4א. Learning & Knowledge Feedback + Human Approval + Knowledge Repository (חדש)

- **Learning & Knowledge Feedback נוסף** — רכיב-שמזהה-בלבד (דפוסים חוזרים, warnings חוזרים, rules-שנדחים-שוב-ושוב, source gaps, הצעות-להרחבת-ידע/QA/Tests/Documentation). **לעולם לא לומד לבד, לא משנה ידע/חוקים/ספרים/Knowledge Graph, לא מוסיף/מסיר Rule.**
- **Human Approval (Oren) נוסף** — שער-חובה, לא-אופציונלי. ללא אישור-מפורש **per-proposal** (לא גורף): אין שינוי Knowledge Repository/Rules/Contracts/QA/Tests/Engines.
- **Knowledge Repository נוסף** — מקור-האמת (עקבי עם Knowledge Memory הקיים ב-`HALL_WISDOM_CORE_ARCHITECTURE.md` חלק ו-ז). מתעדכן **רק** אחרי Learning & Knowledge Feedback ← Human Approval, **לעולם לא ישירות על-ידי AI** — אין נתיב-עוקף, גם אם Mentor Module יהפוך AI-assisted בעתיד.
- **Architecture Principle החדש** — *"The system may learn observations, but it never changes knowledge autonomously."* מותר: Observe/Suggest/Explain/Prioritize. אסור: Learn autonomously/Rewrite rules/Update books/Change interpretations/Modify engines. הרחבה-ישירה של העיקרון הקיים ב-`HALL_WISDOM_CORE_ARCHITECTURE.md` חלק טז ("AI is an Assistant, Hall of Wisdom Core is the Decision Maker").

## 6. רשימת Stop Conditions (8 רכיבים)

Intent Analyzer (ambiguity, missing question) · Reading Strategy Builder (conflicting intent/strategy, unsupported strategy) · Knowledge Decision Pipeline (missing approved source, ambiguous rule applicability) · Reading Planner (conflicting constraints, missing required inputs) · Rule Decision Engine (no valid rule path, unresolved rule conflict) · Engine Execution Coordinator (calculation failure, missing engine adapter) · Verification Layer (irreconcilable contradiction, insufficient evidence) · Audit (privacy leak, unsafe client output, source fidelity failure).

כל stop מחזיר `{ stopped:true, stopComponent, stopReason, recoverable, clarificationQuestion, needsOrenDecision }`.

## 7. Clarification Policy

**רק 3 רכיבים** רשאים להחזיר `clarificationQuestion`: Intent Analyzer, Reading Strategy Builder, Reading Planner. Rule Decision Engine ומטה (E-J) **אינם מנסחים-מחדש** את שאלת-המשתמש — הבהרה-נדרשת-מאוחר-יותר מוחזרת ל-Reading Planner/Intent Analyzer דרך `stopComponent`/`stopReason`, לא כשאלה-חדשה-בתוך-מנוע-הביצוע.

## 8. Privacy Boundary

שדות אסורים במעטפת ובכל `output`: `phone`, `rawClientHistory`, `rawDynFields`, `secrets`, `accessTokens`, `paymentData`. מידע-כזה עובר רק דרך `reference ID`/`sanitized summary` — לעולם לא כטקסט-גולמי. `question` נשאר היוצא-מן-הכלל-המוצהר-היחיד (שאלת-הלקוח-המקורית-הלגיטימית).

## 9. Reading Domain Separation

שרשרת תומכת רק ב-`reading.goralHachol`/`reading.cards`. Kashf/Hawi לעולם לא-משתמשים-בידע-Cards ולהפך; לכל domain Knowledge Adapter נפרד (עתידי); ה-shared pipeline contracts (כל 18 סעיפי המסמך, כולל שכבת Learning & Knowledge Feedback החדשה) משותפים-לשני-ה-domains; `rule IDs`/`source evidence`/`engine adapters` אינם-משותפים-בין-domains.

## 10. E2E Test Contract

סכימת-תרחיש: `{ scenarioId, question, readingDomain, method, expectedIntent, expectedStrategy, expectedPlanCategories, expectedForbiddenCategories, expectedStopComponent, expectedWarnings, expectedNeedsOrenDecision }`. 10 קטגוריות-נדרשות (עתידי, לא ממומש): Business Prediction, Business Decision Support, Hidden Thought, Timing, Spiritual question, Ambiguous question, Conflicting constraints, Missing knowledge, Cards relationship spread, Domain mismatch — 4 מהן כבר-נבדקות-בפועל ברכיבים הקיימים (Prediction/Decision Support/Hidden Thought/Timing), אחת illustrative-בלבד לקלפים (מ-Reading Planner Contract), שאר-4 טרם ממומשות בכלל.

---

## 11. אישור — אין שינוי קוד

✅ שום קובץ `.js`/`.mjs` נערך או נוצר.

## 12. אישור — אין Tests

✅ שום קובץ-test חדש/משונה.

## 13. אישור — אין שינוי מנועים/UI/קלפים/Supabase

✅ `goral-hachol/engine/*` לא נגוע. ✅ `goral-hachol.html`/`goral-hachol/ui/*` לא נגוע. ✅ `cards.html`/`cartomancy/*` לא נגוע. ✅ `supabase/*` לא נגוע.

## 14. אישור — אין AI חי

✅ שום `fetch`/`callAnthropic`/`ANTHROPIC_API_KEY` — המסמך כולו הוא תיעוד-עקרוני, כולל הסעיף המפורש ש-AI Runtime **אינו** חלק משרשרת-ההכרעה-הדטרמיניסטית (סעיף 12 במסמך).

## 15. אישור — אין Deploy

✅ לא בוצע.

## 16. אישור — אין Merge ל-main

✅ לא בוצע. כל העבודה על `claude/app-cleanup-organization-mia9b2` בלבד. לא נוצר branch חדש.

## 17. אישור — השלב הבא

**מימוש Reading Planner Foundation** — אחרי אישור המסמך הזה, זהו השלב-הבא-היחיד. לא Knowledge Decision Pipeline, לא Rule Decision Engine, לא שום רכיב אחר — Reading Planner כבר עבר Component Contract מאושר (`HALL_WISDOM_READING_PLANNER_COMPONENT_CONTRACT.md`, מעודכן עם `readingDomain`), הוא הרכיב-הבא-בתור למימוש-בפועל לפי ה-Roadmap.

---

## סיכום

לא commit. לא push. לא הותחל Reading Planner. `HALL_WISDOM_SESSION_SUMMARY_REPORT.md`/`HALL_WISDOM_UNCOMMITTED_WORK_AUDIT.md` נשארים untracked, לא-נגועים, לא-נכללים.
