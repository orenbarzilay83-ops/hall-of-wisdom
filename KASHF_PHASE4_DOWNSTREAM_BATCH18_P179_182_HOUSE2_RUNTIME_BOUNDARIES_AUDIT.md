# KASHF Phase 4 Downstream — Batch 18: p179 debt + House 2 runtime boundaries

Date: 2026-09-24  
Branch: `chatgpt/kashf-downstream-batch05-p100-101-months`  
Starting HEAD: `45e4ecd23514a536d553ded01d5ed68cd715602c`  
Implementation commit: `52a533083f661e4257951aa8b19acaa8a8be580e`  
Certification-test fix: `508775c103f8af7fd2e87fde9038b0d52ff9a029`  
Final QA run: https://github.com/orenbarzilay83-ops/hall-of-wisdom/actions/runs/35976136881

## Scope

This batch closes the four official downstream items that followed Batch 17:

1. `B12-P179-DEBT-WALKING-BLOCKED`
2. `B13-HOUSE2-ONE-PRIMARY-MONEY-ROUTE`
3. `B13-P180-ELEMENT-AMOUNT-BLOCKED`
4. `B13-P181-OTHER-BOOK-REMAINDER-BLOCKED`

The controlling source was the printed/scanned Arabic Kashf text. v57, Hebrew working text and OCR were used only as navigation/work aids.

## Source review

### Printed p179 — debt movement

The body passage assigns H1 to the creditor, derives the debtor from H7+H9 and the money from H2+H12, then branches on the expressions “walked two”, “walked three”, absence from “the hand”, and the tokens Farah and Bakr. The printed passage does not supply enough operational definition to map those expressions safely into the current engine.

Decision: preserve the method boundary but fail closed at runtime. No walk arithmetic, “hand” mapping, Farah/Bakr identification, or external-book repair was invented.

### Printed p180 — questioner/asked-person money comparison

The asked person’s money figure is derived from H2/H4/H6/H8 and the questioner’s from H1/H3/H5/H7. Elements are weighted fire=1, air=2, water=3, earth=4. The source then instructs the reader to retain the lower element and work by its number, but does not close the conversion from that retained value to an actual monetary amount.

Decision: register the exact method and intent, but keep runtime blocked. It may not be replaced by incoming/outgoing classification, dignities, the p182 magnitude rule, Hawi, or symmetry.

### Printed p181 — body methods versus “other book”

The body contains distinct money-attainment procedures, including the recast-board method already implemented from H2/H5/H8/H11.

A later passage is explicitly introduced with `ومن غير الكتاب`. It says to count the sixteen figures’ points and reduce by twos, gives remainder 1/2 outcomes, and then immediately provides a 1–7 source-of-money table. That is not an executable closed arithmetic system as printed.

Decision: preserve the passage as `educational-only / source-conflict`; do not change the divisor to seven, delete branches, or let it participate in a vote against the selected body method.

### Printed p182 — general money route and lawful/unlawful boundary

The source supplies a direct general money/livelihood route from H2+H10. This is now the exact primary route for `q-money-state`.

The same page also supplies a lawful/unlawful rule from H9+H11, but says the derived figure “inclines” to one house or the other without defining that inclination operationally in this passage.

Decision: H2+H10 is runnable and professionally certified; the H9+H11 lawfulness method is source-recognized but remains `blocked-by-source`.

## Runtime / consumer changes

- Added `debt.p179.creditorDebtorWalking` as the body-source boundary for `q-loan` and `q-loan-return`; both fail closed.
- Removed the external p234 repayment method as the automatic route for those questions. It remains educational-only.
- Kept broad `q-debts` separate and unsupported; p179 was not generalized beyond its source scope.
- Reclassified `money.p180.elementComparison` to the exact `money.compareQuestionerAsked` intent and locked it `blocked-by-source`.
- Added `money.p181.otherBookRemainder` as non-body / other-book, educational-only, source-conflicted and non-runnable.
- Added runnable `money.p182.h2h10Outlook`; `q-money-state` now executes exactly this method.
- Added `money.p182.lawfulnessInclination`; `q-money-halal` now points to the real source rule but remains blocked.
- Added Hebrew v57 knowledge and AI retrieval boundaries for all of the above.
- Added Professional Verdict Safety policy for p182 H2+H10.
- Narrowed the inheritance Question Bank wording so it no longer promises amount/dispute answers that the selected p180 method does not supply.
- The canonical Question Bank path continues to report `topicSupportingChecksExecuted:false`, `altFormulaExecuted:false`, and `topicBundleExecuted:false`.

## Dedicated regression

New test:

`_test_kashf_house2_runtime_boundaries_p179_182.mjs`

It locks:

- p179 debt runtime hard stop and no p234 fallback;
- p180 amount-conversion hard stop;
- p181 other-book isolation and source-conflict status;
- one selected House-2 route per exact intent;
- p182 H2+H10 execution only for general money state;
- p182 lawfulness source recognition with runtime block;
- AI retrieval boundaries;
- preservation of broad `q-debts` as a separate unsupported intent.

## QA

Temporary workflow: `.github/workflows/kashf-downstream-batch18-qa-temp.yml`.

The first run exposed one expected regression-test maintenance issue: adding a newly certified runnable method raised the Professional Verdict Safety registry count from 43 to 44. No engine/source failure was found. The certification test was updated to include the new p182 route.

Final run `35976136881`: **PASS**.

- Batch 18 dedicated regression: PASS
- Batch 17 p172–178 regression: PASS
- Batch 16 p166–172 regression: PASS
- Canonical routing: **1619 passed, 0 failed**
- AI retrieval index: **618 passed, 0 failed**
- Retrieval live bridge: **145 passed, 0 failed**
- Professional Verdict Safety: **424 passed, 0 failed**
- Book rule catalog: PASS
- Rule applicability: PASS
- Kashf/Hawi isolation: PASS
- Question Route Coverage: **138 explicit routes, 100.0%, PASS**
- Syntax checks for changed runtime/registry files: PASS

## Official counter after Batch 18

**36/46 downstream RESOLVED. 10 official downstream items remain.**

Next source-ordered wave:

- `B13-HOUSE3-RELOCATION-ROUTING-DEFERRED`
- `B13-P184-PROPERTY-MAP-NO-RUNTIME`

Then the House-4 hidden-location/depth blockers, followed by House-5/pregnancy and illness-opening items.

SOURCE-OPEN records remain a separate source-review track and are not counted as additional downstream engines.
