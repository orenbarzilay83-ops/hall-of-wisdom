# KASHF Phase 4 — Downstream Batch 13: p159 H6 Subject Identification

## Scope
- Printed source: p159.
- Queue item: `B09-DHAMIR-H6-SUBJECT-ID-CANDIDATE`.
- Exact source intent: `في معرفة السائل عمن سأل` — identify whom/what the querent is asking about.

## Source recheck
Printed p159 states:
- look at H6;
- look for the same figure in another house;
- the question concerns the owner of that house.

The page also contains several other Dhamir methods. They were not merged into this rule.

## Canonical method
Added:
`dhamir.p159.subjectByH6Recurrence`

Intent:
`dhamir.identifyQuestionSubject`

Runtime:
- source-ready;
- custom canonical executor ready;
- one method only;
- no majority;
- no fallback to generic Dhamir.

## Exact executor boundary
The executor:
1. reads H6;
2. scans H1-H12 except H6 for the same figure;
3. one recurrence → resolves the relevant house owner/role;
4. no recurrence → unresolved;
5. more than one recurrence → explicit ambiguity.

The source gives no precedence rule for multiple recurrences, so none was invented.

H13-H16 are not assigned topical owners in this executor.

## Routing / retrieval boundary
Natural-language retrieval aliases are restricted to the exact intent, e.g.:
- על מי השואל שואל
- על מי נסובה השאלה
- מי האדם שעליו השואל שואל

Generic hidden-thought questions such as:
- מה הוא חושב?
- מה היא מרגישה?

do not resolve to this p159 method.

No new public Question Bank entry was added in this batch. That prevents this internal source-specific rule from silently replacing existing user-facing Dhamir questions.

## Knowledge layer
Added a v57 operational knowledge record with:
- printed page 159;
- Arabic verification page 159;
- explicit Hebrew rule;
- warning that multiple recurrences have no source precedence;
- warning not to combine this route with the other Dhamir methods.

## Regression
Added:
`_test_kashf_dhamir_h6_subject_p159.mjs`

Covers:
- registry readiness;
- retrieval exactness;
- isolation from generic hidden thought;
- unique recurrence;
- no recurrence;
- multiple recurrence ambiguity;
- canonical one-method execution.

## QA
GitHub Actions run `35892121524` — **PASS**.

Passed:
- syntax;
- p159 H6 regression;
- AI Retrieval Index;
- AI Retrieval Live Bridge;
- Canonical Routing;
- Professional Verdict Safety;
- Dhamir Runtime Precedence;
- Question Route Coverage.

## Queue result
`B09-DHAMIR-H6-SUBJECT-ID-CANDIDATE` → **RESOLVED**

Official downstream total:
- 22/46 resolved
- 24 remaining

Next:
`B10-DEREKH-H13-POLARITY-DOWNSTREAM` — p163.
