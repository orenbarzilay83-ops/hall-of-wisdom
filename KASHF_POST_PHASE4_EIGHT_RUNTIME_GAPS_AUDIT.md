# KASHF Post-Phase-4 — Eight Runtime Gap Closure Audit

Date: 2026-09-18
Target branch: `claude/app-cleanup-organization-mia9b2`

## Trigger

A full consistency scan found eight Question Bank routes whose question route reported `kashfRuntimeStatus: ready` while the canonical method still had `runtimeAllowed:false` and `executorStatus:pending`.

The eight questions were:
- q-message
- q-news-arrive
- q-lifespan
- q-lifespan-remaining
- q-mother
- q-dig-direction
- q-well-drilling
- q-inheritance

## Final disposition

### Runnable now — 4 questions

**q-message + q-news-arrive**
- Canonical method: `messenger.p176.recast14511`
- Source: v57 / Kashf p176
- Runtime: READY
- Executor: READY
- Exact procedure: original H1,H4,H5,H11 become new mothers; complete a fresh board; judge new H5 plus H1,H4,H7,H10.
- No broad siblings/general bundle runs.

**q-well-drilling**
- Canonical method: `well.p188.recast1468`
- Source: v57 / Kashf p188
- Runtime: READY
- Executor: READY
- Exact procedure: original H1,H4,H6,H8 become new mothers; complete a fresh board; source-positive condition is new angles pure-benefic + strictly internal.
- Failure of that positive condition does NOT become an invented “no water” verdict.
- UI wording was narrowed from “is there water / at what depth” to the source-safe drilling/canal objective. Depth remains separate.

**q-inheritance**
- Canonical method: `inheritance.p180.elementComposite`
- Source: printed Arabic p180 + Talib/Matlub division pp64-66
- Runtime: READY
- Executor: READY
- Source correction: the old Hebrew operational rule had omitted the first derived figure and the final combination step.
- Correct procedure:
  1. earth(H1)+water(H2)+air(H3)+fire(H4) -> figure A
  2. fire(H5)+air(H6)+water(H7)+earth(H2) -> figure B
  3. derive a final figure from A+B
  4. Talib group -> questioner inherits; Matlub group -> person asked about inherits
- UI wording was narrowed to “who inherits whom”; the method does not compute shares, amounts, or disputes.

### Explicitly blocked/repair-required — 4 questions

**q-lifespan + q-lifespan-remaining**
- Canonical method: `lifespan.p178.elementCountToHouse`
- Final status: BLOCKED_BY_SOURCE
- Reason: Wave 3 already established that element aggregation and the figure-number lookup at the landing house are not mechanically closed enough for a Golden-Testable executor.
- p264 life stages must not be substituted.

**q-mother**
- Canonical method: `mother.p257.statusDayNight`
- Final status: BLOCKED_BY_SOURCE
- Reason: the preserved source says “this house” without closing the referent in the immediate passage; the daytime Venus branch is also not mechanically complete.
- No house is guessed and the incomplete legacy helper is not reused.

**q-dig-direction**
- Canonical method: `hidden.p188.quarterDirection`
- Final status: REPAIR_REQUIRED
- Reason: source method is clear, but it requires four additional casts — one per quarter/direction. The current ordinary board cannot supply them.
- Runtime remains blocked until the UI/runtime has that method-specific four-cast input flow.

## Source correction note — inheritance p180

The printed source states both derived figures before the final figure:
- first: earth of H1, water of H2, air of H3, fire of H4
- second: fire of H5, air of H6, water of H7, earth of H2
- then derive one figure from the two

This was restored into `kashf-v57-knowledge-registry.js`. The Talib/Matlub classification used for the final side is the book's explicit eight/eight division on pp64-66.

## Invariants after closure

- Every Question Bank id still has one canonical route.
- No route with `kashfRuntimeStatus: ready` points to a method with `runtimeAllowed:false` or a non-ready executor.
- No executor was added for a source-blocked method.
- Recast methods execute only their own method-scoped secondary board.
- No broad legacy topic fallback was re-enabled.
