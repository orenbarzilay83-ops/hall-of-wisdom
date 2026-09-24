# KASHF Phase 4 — Downstream Batch 21: House 5 Pregnancy + Chapter 6 Illness Boundaries

## Closed official downstream items
- `B14-HOUSE5-PREGNANCY-ROUTING-DEFERRED`
- `B15-P192-INTENT-SEPARATION`
- `B15-P194-CHILD-HEALTH-ROUTING`
- `B15-P196-ILLNESS-CHAPTER-OPENING`

This closes the official downstream queue at **46/46 RESOLVED**.

## Source review
Printed pp191–196 were read before implementation, including the cross-page seams. Runtime decisions follow the printed source boundary rather than the broad legacy `children` / `illness` topic bundles.

## p191 — distinct pregnancy intents
The following remain independent:
- pregnancy existence: H5 silent / empty
- fetal sex: H5 masculine / feminine
- fetal safety: H1 base testimony plus the distinct severe H6+H8 condition
- delivery difficulty: H1/H5 with H15 testimony
- twins: printed `مجسدا` statement

The first four keep exact selected runtime methods.

The twins statement is registered as `pregnancy.p191.twinsMujassad`, but runtime is blocked. The source passage does not define whether `مجسدا` maps to canonical `mujassad-dakhil`, `mujassad-kharij`, both, or another local category. No name-based equivalence was invented.

## p191→p192 cross-page miscarriage seam
The printed sentence crossing the page boundary gives:
- H7 = Humra / Red (`2122`)
- H8 = Ankis/Nakis / Shallow Head (`2221`)

That pair is now `pregnancy.p191-192.miscarriageRedH7NakisH8`.

`q-miscarriage` selects only this method.

Boundary:
- exact pair present => the source miscarriage sign is present
- exact pair absent => unresolved
- absence is not inverted into “safe”
- the source sign is not presented as medical certainty or diagnosis

Other p192–p193 risk clauses do not vote with this route.

## p192 — intent separation
### Fetal sex alternatives
- `pregnancy.p192.genderH5H11InOut`
- `pregnancy.p192.genderParityH1H6H8H12`

Both are body-source alternatives retained as educational/reference-only. They do not vote against the selected p191 H5 gender route.

### Maternal safety
`pregnancy.p192.maternalSafetyH6H8H12`

H6/H8/H12 benefic is the positive source condition for the mother. This is not fetal safety, miscarriage risk, or delivery difficulty. Runtime remains off pending a dedicated client-safe executor/policy; failure of the positive condition is not inverted into a danger/death verdict.

### Pregnancy month count
`pregnancy.p192.monthCount`

The source gives a “third in the pregnancy house” operation followed by reduction nine-by-nine, plus an alternate balance-figure indication. Runtime remains blocked until the exact operation and relation between the two source routes are Golden-Testable.

## p194 — child boundaries
`q-child-health` remains exactly `child.p194.healthTrajectoryH6H8`:
- H6 malefic => source testimony of many childhood pains
- H8 malefic => low hope
- H8 benefic => illness decreases / condition improves with age

Separated from it:
- `child.p194.existenceH1H5Nature` — child/existence and empty-womb branch
- `pregnancy.p194.deliveryH5Weight` — p194 delivery statements, reference-only
- `child.p194.wellbeingH5H16` — wellbeing/fortune/status

The “neither male nor female + overturned/mutable => empty womb” clause is not a prerequisite for H6/H8 health.

## p196 — Chapter 6 illness opening
`q-illness-heal` remains exactly `illness.p196.outcomeH15`.

Only H15 enters the selected verdict:
- benefic => recovery
- malefic => illness prolonged
- mixed => unresolved

A malefic H15 does not authorize certain death, permanent non-recovery, or numeric duration.

Separate p196 source procedures:
- `illness.p196.h1RecurrenceDurationRisk`: H1 recurring in H6 => prolonged illness; H1 recurring in H8 => prolonged illness plus fear/danger
- `illness.p196.sensorySignsH6H8`: p196 vision/hearing signs retained as source knowledge only

Neither votes with H15 recovery. p197+ humors/body-location material is not pulled backward into the p196 opening.

## Question Bank wording
Narrowed visible descriptions for:
- `q-pregnancy`
- `q-gender`
- `q-miscarriage`
- `q-illness-heal`

The descriptions now state the exact selected source rule and the key non-inference boundary.

## Professional verdict safety
Added a certified policy for `pregnancy.p191-192.miscarriageRedH7NakisH8`.

It forbids:
- converting absence of the pair into pregnancy safety
- presenting the source sign as medical certainty
- importing maternal-safety or fetal-safety rules
- importing other miscarriage signs as votes
- claims of certain death

Professional certified method count is now **45**. The separate p159 Dhamir subject-identification executor remains outside the client-verdict certification registry by design.

## Regression
Added `_test_kashf_house5_illness_boundaries_p191_196.mjs`.

It verifies:
- one selected method for each p191 UI intent
- twins hard stop
- exact p191→p192 miscarriage pair and non-inversion
- p192 gender alternatives reference-only
- maternal safety / month count separation
- p194 existence / health / delivery / wellbeing separation
- p196 recovery / duration-risk / sensory separation
- exact retrieval hits
- no topic supporting-check or topic-bundle leakage

## QA
GitHub Actions run `35981311392` — **PASS**.

Passed:
- Batch21 dedicated regression
- Batch20–Batch16 regressions
- canonical routing: **1751 passed / 0 failed**
- AI retrieval: **772 passed / 0 failed**
- indexed records: **88**
- source-ready retrieval coverage: **60/60**
- runnable retrieval coverage: **46/46**
- AI retrieval live bridge: **145 passed / 0 failed**
- professional verdict safety: **425 passed / 0 failed**
- book-rule catalog
- rule applicability
- Kashf/Hawi isolation
- Question Route Coverage: **138/138 = 100%**

## Result
Official downstream is complete:

**46/46 RESOLVED — 0 remaining.**

## Next roadmap phase
Proceed to **Source Freeze**.

Every `SOURCE-OPEN` record must be reviewed independently and closed only as:
- `RESOLVED`, when source evidence actually resolves it; or
- `SOURCE_CONFLICT/NON_OPERATIONAL`, when printed/source evidence remains contradictory, unreadable, or insufficient for runtime.

No SOURCE-OPEN record may be repaired by symmetry, legacy code, Hawi, or another book unless provenance is explicitly recorded.
