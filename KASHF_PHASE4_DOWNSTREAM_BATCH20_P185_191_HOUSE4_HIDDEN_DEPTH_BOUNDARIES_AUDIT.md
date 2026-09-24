# KASHF Phase 4 — Downstream Batch 20: House 4 Hidden-Location + Depth Boundaries

## Closed queue items
- `B14-HIDDEN-LOCATION-NO-MULTIMETHOD`
- `B14-P185-RECURSIVE-QUARTERS-BLOCKED`
- `B14-P187-KIND-DIRECTION-BLOCKED`
- `B14-P188-190-DEPTH-METHODS-BLOCKED`

## Source boundary
Printed pp185–191 were visually re-read before the runtime/index changes. SOURCE-OPEN records remain separate from this downstream closure.

## Hidden-location method separation

### p185 — recursive quarter arithmetic
Registered `hidden.p185.recursiveQuarterFireAir`.

Preserved:
- fire-point count plus the relevant name count;
- reduction by fours;
- remainder 1=east, 2=west, 3=south, 4=north;
- recursive narrowing inside the selected quarter using air points and the name.

Hard stop:
- the same printed passage says sixteen places, each divided into four, yet prints `أربعة وتسعين` = 94;
- apparent 16×4 would be 64, but 94 is not normalized or “corrected”.

Runtime remains blocked-by-source.

The separate source-review record `B14-SOURCE-P185-94-VS-RECURSIVE-COUNT` remains OPEN for Source Freeze.

### p186 — two separate directional procedures
Registered separately:
- `hidden.p186.nameDayAbjadQuarter`
- `hidden.p186.tamtamFourQuarterCasts`

Name/day method preserves:
- stand in the middle;
- face the qibla;
- large-abjad total of querent name + mother name + current day;
- reduce by four;
- 1 east, 2 west, 3 south, 4 north.

Tamtam method preserves:
- one additional cast per quarter;
- internal benefic = object there;
- external malefic = nothing there;
- in the 2-benefic/2-malefic branch, derive **two intermediate figures** and only then their final result.

Neither method is inferred from the ordinary board and neither votes with the p188 route.

### p187 — kind and root direction
Registered `hidden.p187.kindRootDirection`.

Preserved:
- extract **two** figures from the angles;
- derive a third from those two;
- element of the third identifies context/kind: fire near fire, air suspended/in air, water near water, earth buried in earth;
- root location: mothers east, daughters west, balances south.

Hard stop:
- the munshaat branch prints the difficult token `ناحية الجاه`;
- it is not source-secure as “north”;
- no symmetry, Hawi, or other chapter is used to fill it.

The separate source-review record `B14-SOURCE-P187-MUNSHAAT-DIRECTION` remains OPEN.

### p188 — selected presence and direction routes
`q-treasure` remains exactly:
- `hidden.p188.isStillThere`
- H1,H2,H4,H13,H14,H15 must all be explicitly benefic;
- no majority rule;
- the method does not prove an unknown treasure exists.

`q-dig-direction` now explicitly selects only:
- `hidden.p188.quarterDirection`
- four quarters, four dedicated additional casts;
- no inference from the ordinary board.

Its executor remains pending because the dedicated additional-cast input flow does not yet exist.

## Depth separation

### pp188–189 — open-element length framework
Registered `hiddenDepth.p188-189.openElementLengths`.

Preserved:
- fire = one finger;
- air = one span;
- water = one cubit;
- earth = one stature;
- use the indicator figure's **open elements**;
- worked result = two fingers + one span.

Hard stop:
- exact open-element extraction, letter/opposites ordering and measurement accumulation must be Golden-Testable before runtime.

### pp189–190 — Tamtam water-depth table
Registered `waterDepth.p189-190.tamtamTable`.

Preserved derivation chain:
1. H1+H12;
2. H12+H9;
3. derive from those two results;
4. apply the figure-specific p189–190 table.

It is not merged with the open-element framework and remains blocked until the complete figure/table mapping is Golden-Testable.

### q-well-drilling
The UI wording was narrowed:
- route = `well.p188.recast1468`;
- it answers only whether the drilling/water objective is obtained;
- depth is explicitly excluded from this route.

### pp190–191 recursive inside-house localization
Registered `hidden.p190-191.recursiveHouseTriangles`.

The printed recursion is preserved, but runtime is blocked because the technical operation `مثلثة` is not defined in the passage. It is not reduced to one ordinary figure and is not replaced with the p185/p188 quarter methods.

The separate source-review record `B14-SOURCE-P190-MUTHALLATHA-OPERATION` remains OPEN.

## Additional distinct p190 procedure
Registered `hidden.p190.nearFarElementDirection` separately:
- Moon/Mars = near;
- Mercury/Jupiter = difficult road/fear;
- Saturn in H1 = thorny road;
- H1 air=north, fire=east, earth=qibla, water=west.

It is not used as a supporting vote for `q-dig-direction`.

## Retrieval
Curated retrieval aliases and `doNotMixWith` boundaries were added for all new House-4 procedures, plus:
- `hidden.p188.quarterDirection`
- `well.p188.recast1468`

No retrieval record authorizes runtime by itself.

## Regression
Added:
`_test_kashf_house4_hidden_boundaries_p185_191.mjs`

It proves:
- one-method p188 presence routing;
- one selected p188 direction route with executor-pending hard stop;
- p185 94-vs-16×4 source conflict;
- p186 methods stay independent;
- p187 two-angle derivation and unresolved munshaat token;
- well-result/depth separation;
- open-element depth and Tamtam depth remain distinct;
- p190 `مثلثة` recursion stays blocked;
- abstract secrets remain unsupported;
- exact retrieval aliases resolve to the intended source methods.

## QA
Initial temporary run `35978849197` failed only because the new regression expected a route `note` field from the router result; the router deliberately does not expose that field. The test was corrected to assert the method's canonical notes instead. No source rule, route or runtime boundary was loosened.

Final GitHub Actions run `35978925720` — **PASS**.

Passed:
- Batch20 dedicated regression
- Batch19 regression
- Batch18 regression
- Batch17 regression
- Batch16 regression
- canonical routing: **1685 passed / 0 failed**
- AI retrieval: **695 passed / 0 failed**
- indexed records: **77**
- source-ready retrieval coverage: **54/54**
- runnable retrieval coverage: **45/45**
- AI retrieval live bridge: **145 passed / 0 failed**
- professional verdict safety: **424 passed / 0 failed**
- book-rule catalog
- rule applicability
- Kashf/Hawi isolation
- Question Route Coverage: **138/138 = 100%**

## Result
Official downstream:
- **42/46 RESOLVED**
- **4 remaining**

Next, in printed-source order:
- `B14-HOUSE5-PREGNANCY-ROUTING-DEFERRED`
- `B15-P192-INTENT-SEPARATION`
- `B15-P194-CHILD-HEALTH-ROUTING`
- `B15-P196-ILLNESS-CHAPTER-OPENING`
