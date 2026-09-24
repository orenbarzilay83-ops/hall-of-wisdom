# KASHF Phase 4 — Downstream Batch 19: House 3 Relocation + pp184–185 Property Boundaries

## Closed queue items
- `B13-HOUSE3-RELOCATION-ROUTING-DEFERRED`
- `B13-P184-PROPERTY-MAP-NO-RUNTIME`

## Source review
The printed scan was read before runtime changes.

### Printed p183 — relocation
The chapter contains separate procedures, not one combined relocation vote:

1. Destination/place quality:
   - derive one figure from H4+H15;
   - benefic => the destination/place is good;
   - malefic => harm, difficulty and fatigue;
   - mixed => intermediate.

2. Which of two cities is better:
   - inspect H1, H2, H7, H8, H9 and the outcome;
   - the printed text includes a benefic-figures precondition;
   - stronger H1+H2 => current place better;
   - stronger H7+H8 => relocation better;
   - the passage does not define the operational metric for “stronger”.

3. Is this place / the move good:
   - H1+H4 both benefic => good residence in the current place;
   - H7+H10 benefic => good move;
   - no converse is stated and no ranking is stated when both pairs qualify.

4. Stay or move:
   - H1 benefic + H2 malefic => current place is better;
   - the opposite polarity => the judgment reverses.

### Printed p184 — additional relocation indicators
The source gives additional indications involving:
- H6/H7 with benefic testimony for staying;
- H1/H12 benefic testimony for moving to the desired place;
- an internal H2 supporting staying.

The passage gives no conflict-resolution or precedence rule when those indications disagree. They therefore remain a distinct blocked source procedure and do not vote with the selected p183 method.

## Canonical routing decision
The Question Bank now preserves exactly one method per relocation intent:

- `q-move-city` → `relocation.p183.h4h15`
- `q-move-home` → `relocation.p183.currentVsNewPlace`
- `q-stay-place` → `relocation.p183.stayMoveH1H2`
- `q-best-city` → `relocation.p183.compare12vs78` (blocked-by-source)

The broad legacy relocation topic bundle remains compatibility data only. Its alt formula and supporting checks are not executed by the canonical Question Bank path.

## Two-city hard stop
`relocation.p183.compare12vs78` now preserves:
- the benefic precondition;
- H1/H2/H7/H8/H9 and the outcome;
- the printed comparison branches.

Runtime remains blocked because the printed passage does not define how “stronger” is measured. No dignity score, elemental score, recurrence rule, Hawi rule or legacy supporting check is substituted.

## pp184–185 property / house / garden map
The printed map is preserved as:
- H4 = land / ground
- H10 = trees
- H7 = vegetables / plants (`البقول`)
- H3 = water channels (`السواقي`)
- H2 = surrounding wall

At the top of p185, benefics are judged good and malefics the opposite, followed by `والإعتماد على الشواهد` — reliance on the witnesses.

The passage does not define which witness system applies. Therefore:
- `property.p184-185.houseGardenMap` is source-backed and retrieval-visible;
- runtime is `blocked-by-source`;
- no witness scheme is borrowed from another chapter;
- the already-corrected H7/H3 printed mapping is preserved.

The UI question `q-sell-property` remains `property.sale.unsupported`: sale of a specific property is a different intent and is not inferred from the p184 ownership/condition passage.

## Retrieval
Added distinct retrieval records for:
- p183 two-city comparison
- p184 relocation indicators
- pp184–185 house/garden map

All p183 relocation records explicitly exclude the other relocation methods from accidental mixing.

## Regression
Added:
`_test_kashf_house3_property_boundaries_p183_185.mjs`

It proves:
- exact one-method routing for the runnable p183 intents;
- no legacy alt/supporting topic execution;
- two-city comparison fails closed at the source strength gap;
- p184 indicators cannot aggregate/vote;
- H7=plants and H3=water channels are preserved;
- the property map fails closed at the undefined witness system;
- property sale remains a separate unsupported intent;
- retrieval distinguishes all new boundaries.

## QA
GitHub Actions run `35977564111` — **PASS**.

Passed:
- Batch19 dedicated regression
- Batch18 p179–182 regression
- Batch17 p172–178 regression
- Batch16 p166–172 regression
- canonical routing: **1637 passed / 0 failed**
- AI retrieval: **639 passed / 0 failed**
- retrieval records: **69**
- source-ready retrieval coverage: **51/51**
- runnable retrieval coverage: **45/45**
- AI retrieval live bridge: **145 passed / 0 failed**
- professional verdict safety: **424 passed / 0 failed**
- book-rule catalog
- rule applicability
- Kashf/Hawi isolation
- Question Route Coverage: **138/138 = 100%**

## Result
Official downstream:
- **38/46 RESOLVED**
- **8 remaining**

Next in printed-source order:
- `B14-HIDDEN-LOCATION-NO-MULTIMETHOD`
- `B14-P185-RECURSIVE-QUARTERS-BLOCKED`
- `B14-P187-KIND-DIRECTION-BLOCKED`
- `B14-P188-190-DEPTH-METHODS-BLOCKED`
