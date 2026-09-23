# KASHF Phase 4 — Downstream Batch 04 (printed p100)

## Scope and authority

- Authoritative evidence: printed Arabic scan, book p100 / scan PDF p102.
- Canonical source record: `figures.p100.joy-grief-supplement`.
- Downstream target: `goral-hachol/data/sources/kashf-al-asrar/kashf-figure-attributes-gate2.js`.
- Queue item: `B04-DATA-JOY-VENUS`.
- This batch is source-data repair only. It does not change canonical routing, question statuses, executors, AI verdict policy, or the main p97–99 dignity table.

## Printed-source recheck

The printed page was visually rechecked directly from the Arabic scan before changing data.

The source states:

- Saturn figures: joy in the joy of Jupiter, at H11.
- Mars figures: H16.
- Sun figures: H9.
- Venus figures: H5.
- Mercury figures: H1.
- Moon figures: H3.
- Head of the Node follows Jupiter.
- Tail of the Node follows Saturn.

The printed source then gives a six-figure sentence whose wording mixes `ترح الأشكال`
with `فرحها بالحادي عشر`. That wording is preserved as ambiguous and is not
silently normalized into a grief-at-H11 rule.

The source-clear grief rows are:

- Jamaa + Ijtimaa: H7 and H14.
- Bayad + Tariq: H1.

The final clause says:

`قبض خارج وعتبة خارج لعله ملحوقات بزحل والمريخ`

Therefore Qabd Kharij + Ataba Kharija are preserved as a **collective tentative**
attachment to Saturn/Mars. The source does not authorize a one-to-one assignment.

## Downstream repairs

`FIGURE_JOY_GRIEF_SUPPLEMENTARY_NOTE` was rebuilt so that:

1. source page is corrected from p99 to **p100**;
2. provenance is corrected from historical v56 to **v57**;
3. Venus joy at **H5** is restored;
4. Head/Tail follow-relations are represented as relations, not converted to H11;
5. the six-figure mixed wording is stored as `ambiguousFigureGroup`;
6. H1 grief is corrected from the old Tariq+Qabd Kharij pair to **Bayad+Tariq**;
7. Qabd Kharij is removed from the H1 grief map;
8. Qabd Kharij + Ataba Kharija are stored in `tentativePlanetAttachments`;
9. policy flags explicitly forbid turning follow-relations or tentative attachments into inferred numeric assignments;
10. the supplementary source remains forbidden from overwriting the main p97–99 dignity table.

## Regression

New regression:

`_test_kashf_joy_grief_supplement_p100.mjs`

It verifies:

- exact planet joy houses, including Venus H5;
- node follow-relations without numeric inference;
- exact six-figure ambiguous group;
- exact grief pairs;
- absence of Qabd Kharij from H1 grief;
- preservation of the tentative Saturn/Mars clause;
- no overwrite of the 14-row main dignity table.

## Queue result

`B04-DATA-JOY-VENUS` → **RESOLVED**

Downstream totals after Batch 04:

- total: **46**
- resolved: **11**
- remaining: **35**

The next source-ordered queue item is:

`B04-DATA-MONTH-MAP` — printed pp100–101.

It is not part of this batch.

## QA

GitHub Actions run: `35862028251` — **PASS**

Passed:

- p100 joy/grief regression — PASS;
- p97–99 dignity regression — PASS;
- p63–65 figure-name source-table regression — PASS;
- Kashf Book Rule Catalog — PASS;
- Goral Rule Applicability — PASS;
- AI Retrieval Index — **520 passed, 0 failed**;
- AI Retrieval Live Bridge — **145 passed, 0 failed**;
- AI Context Builder — PASS;
- Professional Verdict Safety — **423 passed, 0 failed**;
- Kashf/Hawi Method Isolation — PASS;
- Canonical Routing — **1535 passed, 0 failed**;
- Question Route Coverage — **138/138, 100%**.

## Result

Batch 04 closes the p100 joy/grief source-data drift while preserving every
source ambiguity as ambiguity and every tentative clause as tentative.

No inferred completion was introduced.

Next, after this batch is accepted, continue in printed-source order with the
p100–101 month-association map.
