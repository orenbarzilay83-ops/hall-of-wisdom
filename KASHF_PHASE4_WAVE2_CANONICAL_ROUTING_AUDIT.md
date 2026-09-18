# KASHF Phase 4 — Wave 2 Canonical Routing Audit

Date: 2026-09-18
Target branch: `claude/app-cleanup-organization-mia9b2`

## Goal

Replace broad topic-bundle execution with a canonical route selected by the exact UI question. A topic is now a knowledge container; it is not permission to run every formula/check it contains.

## Runtime architecture

- New `goral-hachol/engine/kashf-question-router.js`.
- `goral-app.js` passes the selected `questionId` into the KASHF runtime.
- `buildKashfReading()` resolves that exact route before calculation.
- Each route independently controls:
  - primary formula
  - alternate formula
  - exact allow-list of supporting checks
- A blocked route returns an explicit blocked reading instead of silently falling back to a broad topic method.

## Canonical separation implemented

### House 1 / general
General state, geographic direction, clothing, completion and lifespan are no longer treated as one executable bundle. Lifespan remains blocked because its walking algorithm belongs to Wave 3.

### Money
- money state -> scoped money route
- money source -> only `money-source-total`
- livelihood -> only livelihood/parnasa checks
No cross-method vote is performed.

### Relocation
- move to a place/home -> primary relocation route
- stay vs move -> `current-place` only
- compare two cities -> blocked until the source defines a safe strength comparator

### Property / hidden location
- hidden item still in place -> one primary route
- direction search -> blocked pending its own verified algorithm
- well/depth -> blocked pending pp188-190 closure
- generic secret question -> cannot fall through into hidden-object location methods
- mixed father/house/land question -> blocked from the unresolved p184 property map

### Pregnancy / children
The former broad `computeChildrenPregnancyKashfAnalysis` is no longer the default answer for every pregnancy/child question. Dedicated source-scoped functions now exist for:
- pregnancy confirmation
- fetal sex
- miscarriage signals
- birth ease/difficulty
- child health
- child welfare/life trend

Child survival retains only its explicit H1/H6/H8 checks.

### Illness
Recovery, body-part and illness-type questions receive separate allow-lists. Cause-of-illness is blocked because no approved p196 KASHF route supports using the broad illness bundle as a substitute.

## No-runtime closures

The following are considered resolved as routing/safety decisions without inventing an algorithm:
- figure proximity pp164-165
- balance-point location/name/color pp168-169
- other-book istikhara pp170-172
- messenger sub-board recast p176
- p184 property map

They remain non-runtime unless a later source/algorithm pass explicitly reopens them.

## Queue result

Wave 2 resolves 14 queue items:
1. B10-PROXIMITY-NO-RUNTIME-WITHOUT-DEFINITION
2. B11-HOUSE1-INTENT-ROUTING-DEFERRED
3. B11-P168-169-LOCATION-PROCEDURE-BLOCKED
4. B11-P170-171-ALTERNATE-ISTIKHARA-NO-RUNTIME
5. B12-HOUSE1-P172-178-INTENT-ROUTING-DEFERRED
6. B12-P176-SUBBOARD-RECAST-NO-RUNTIME
7. B13-HOUSE2-ONE-PRIMARY-MONEY-ROUTE
8. B13-HOUSE3-RELOCATION-ROUTING-DEFERRED
9. B13-P184-PROPERTY-MAP-NO-RUNTIME
10. B14-HIDDEN-LOCATION-NO-MULTIMETHOD
11. B14-HOUSE5-PREGNANCY-ROUTING-DEFERRED
12. B15-P192-INTENT-SEPARATION
13. B15-P194-CHILD-HEALTH-ROUTING
14. B15-P196-ILLNESS-CHAPTER-OPENING

Exactly 9 downstream items remain unresolved; all are source/algorithm blockers reserved for Wave 3.
