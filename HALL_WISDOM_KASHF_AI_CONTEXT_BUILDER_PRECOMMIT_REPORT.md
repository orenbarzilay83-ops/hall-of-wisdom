# HALL_WISDOM_KASHF_AI_CONTEXT_BUILDER_PRECOMMIT_REPORT (updated)

> Local, deterministic, no-network work only. No AI call. No Deploy. No UI change.
> Not committed/pushed — awaiting explicit approval, per instructions.

---

## 1. מה היה פער הפרטיות

`buildKashfReading()`'s real return value always echoes a full `clientContext` sub-object back into `engineOutput.clientContext`, containing every key `kashf_reading_payload_sanitizer.ts` forbids (`maritalStatus`, `hasChildren`, `parentName`, `phone`, `dynFields`) — present with `null`/`''` values regardless of what's actually passed in (hardcoded object literal in `kashf-reading-engine.js`). A **second, deeper leak** was found only after building the real end-to-end payload and running it through the real sanitizer: for `topicId:'commerce'`, `engineOutput.commerceSmartLayer.advisorDiagnosis.contextRelevance` is an object whose own **key names** are those same forbidden strings (`{ maritalStatus: {relevant:false, reason:'...'}, hasChildren: {...}, ... }`) — confirmed via a full recursive scan of a real reading's output; no other leak paths exist anywhere else in `engineOutput`.

## 2. מדוע buildKashfReading לא שונה

Per your explicit decision: not changed. It's used elsewhere (e.g. `kashf-narrative-writer.js`) and changing its return shape would be a wider-blast-radius architecture change requiring its own separate review. The fix lives entirely at the AI-payload-construction boundary instead.

## 3. אילו שדות נכללים ב-Allowlist של engineOutput ל-AI

`buildAiSafeKashfEngineOutput()` (new function, `goral-hachol/intelligence/kashf-ai-context-builder.js`) — three explicit allowlists, no blacklist/delete step anywhere:

- **Top level:** `valid, error, topicId, topicHebrewName, topicDescription, sourceRef, primaryFormula, altFormula, supportingFindings, keyHouseReadings, boardValidation, dhamir, dhamirType4External, dhamirExtras, witnessTestimony, overallPositive`
- **`commerceSmartLayer`** (topic-specific, only present for `topicId:'commerce'` today): `weightedHouses, certaintyLevel, strongestSignals, weakSignals, contradictions, clientWording, practicalGuidance`
- **`commerceSmartLayer.advisorDiagnosis`:** `weightedHouses, strongestSignals, weakSignals, contradictions, certaintyLevel, supportRatio, contextAdjustments`

`contextAdjustments` was individually verified safe before allowlisting — checked its real construction in `kashf-context-sanitizer.js`: entries are professional labels (`{type:'business-context-allowed', note:'...'}` etc.), never a raw field name or client value.

## 4. אילו שדות הוסרו

- `clientContext` (top level) — entirely excluded.
- `commerceSmartLayer.advisorDiagnosis.contextRelevance` — entirely excluded (the nested leak).

Both are structurally impossible to include, not merely deleted after copying — the projection only ever copies keys named in an allowlist.

## 5. הוכחה שה-Payload עובר את הסניטייזר האמיתי

`sanitizeKashfReadingPayloadForAi(contextPackage)` — imported directly from `supabase/functions/oren-smart-advisor/kashf_reading_payload_sanitizer.ts`, **completely unmodified** — now returns `{ok:true}` on the real payload (was `{ok:false, reason:'sanitization-failed'}` before this round). Verified live in this session (not assumed) and asserted in the test suite (§6 below).

## 6. אילו נתוני Rule-level עדיין חסרים

Unchanged from the previous report: `activatedRuleIds`, `rejectedRuleIds`, `sourceEvidence` (per-rule), `decisionSummary`. No per-rule `ruleDefinitions` loader exists for Kashf (`goral-knowledge-registry.js` has only topic-level entries; `rule-decision-engine.js` has no real loader anywhere outside its own unit test). Not built this round, per instruction not to invent a registry just to fill these fields.

## 7. כיצד החוסר מסומן בלי להמציא מידע

- `readingContext.activatedRuleIds: []`, `rejectedRuleIds: []`, `sourceEvidence: []` — honestly empty, never fabricated IDs/snippets.
- `decisionSummary` — omitted from the object entirely (not a placeholder string).
- Return value now includes `completeness: 'partial' | 'complete'` (computed dynamically — flips to `'complete'` automatically once/if a real rule-level loader is built and `missingFields` becomes empty) alongside `missingFields: string[]`, each entry naming exactly which field is missing and why.
- **Not yet done, flagged for a future explicit task (out of this round's scope):** wiring this `completeness`/`missingFields` metadata into `oren-smart-advisor-brain-prompt.ts` so the AI itself is instructed not to claim full rule coverage. The metadata exists and is ready to be consumed; the prompt file itself was not touched.

## 8. מספר assertions ותוצאות regressions

**`_test_kashf_ai_context_builder.mjs` (updated, v2): 59/59 assertions passed.** Covers all 12 required checks (engine-untouched, no-mutation, no-clientContext, no-forbidden-keys-even-empty, professional-fields-preserved, real-sanitizer-accepts, rule-level-fields-honest, completeness-metadata, no-AI, no-fetch, no-engine-change, no-unnecessary-PII) plus the original genuineness/Edge-Function-gate-compatibility checks carried over from v1.

**Regression suite — all green, zero failures:**
| File | Result |
|---|---|
| `_test_oren_smart_advisor_kashf_reading_payload.mjs` | all passed (exit 0) |
| `_test_hall_wisdom_rule_decision_engine.mjs` | 218/218 |
| `_test_hall_wisdom_reading_planner.mjs` | 205/205 |
| `_test_hall_wisdom_reading_strategy_builder.mjs` | 282/282 |
| `_test_hall_wisdom_intent_analyzer.mjs` | 208/208 |

## 9. אישור שאין AI/fetch

Confirmed — grepped the builder source for `fetch(`, `callAnthropic`, and any mention of "anthropic": zero matches (test §9/10). No network call made anywhere this round.

## 10. אישור שאין Deploy

Confirmed. No `supabase` CLI command, no GitHub Actions trigger, no touch to any file under `supabase/functions/`.

## 11. אישור שאין שינוי UI

Confirmed. No `.html` file touched.

## 12. אישור שאין שינוי במנוע Kashf

Confirmed — and proven structurally in the test suite (§11: two fresh direct calls to `buildKashfReading()` produce byte-identical output to each other and to the pre-existing baseline, including the still-present `clientContext` echo and the still-present `commerceSmartLayer.advisorDiagnosis.contextRelevance` leak — proof the engine itself was not edited; filtering happens only in the new builder file). No file under `goral-hachol/engine/` was modified.

---

## Files touched/updated this round (uncommitted, awaiting approval)

- `goral-hachol/intelligence/kashf-ai-context-builder.js` (updated — added `buildAiSafeKashfEngineOutput`, `completeness`)
- `_test_kashf_ai_context_builder.mjs` (updated — 59 assertions, up from 30)
- `HALL_WISDOM_KASHF_AI_CONTEXT_BUILDER_PRECOMMIT_REPORT.md` (this file, updated)

No commit, no push, no live Runner attempt, no Deploy performed.
