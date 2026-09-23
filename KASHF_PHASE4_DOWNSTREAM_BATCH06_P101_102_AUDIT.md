# KASHF Phase 4 — Downstream Batch 06 (printed pp101–102)

## Scope

- Printed Arabic authority: book pp101–102 / scan pp103–104.
- Canonical source record: `houses.p101-102.partners-witnesses`.
- Downstream targets:
  - `goral-hachol/data/sources/kashf-al-asrar/kashf-figure-attributes-gate2.js`
  - `goral-hachol/data/sources/kashf-al-asrar/kashf-book-rule-catalog.js`
  - stale audit wording that could reintroduce the bad numeral.
- Queue item: `B04-DATA-WITNESS-NUMERAL`.
- No executor was added for the unresolved p101-102 extended witness scheme.
- No attempt was made to reconcile p53 with p101-102; their source relationship remains unresolved.

## Printed-source recheck

Printed p101 states:

Partners:
- 13 → H1
- 14 → H7
- 15 → H10
- 16 → H4

Witnesses:
- H9 → H1/H5/H7
- H14 → H2/H6/H10
- **H5 → H3/H7/H11**
- H16 → H4/H8/H12

Critical correction:
- the source says `الشكل الخامس` — **the fifth figure/house**, not the fifteenth;
- H6 is not present in the H5 target list.

Printed p102 continues with the doctrinal statement that the product of two
disagreeing figures can serve as witness between/against them and that witness
evidence is not dispensable. That continuation does not provide a source rule
for merging the separate p53 and p101-102 schemes.

## Repairs

### HOUSE_PARTNERS / HOUSE_TESTIMONY

- source reference corrected to pp101–102;
- provenance moved from v56 to v57;
- visual dependency points to printed scan pp103–104;
- partner map preserved exactly;
- testimony map corrected from stale
  `15→[3,6,7,11]`
  to
  `5→[3,7,11]`.

### Book-rule catalog

`kashf-p101-witness-scheme-extended` now carries:

- required houses: `[5,9,13,14,15,16]`;
- exact corrected testimony map;
- explicit note that H5 is the printed source numeral;
- unresolved relationship to the separate p53 scheme remains unchanged;
- `implementationStatus: 'missing'` remains unchanged.

No runtime rule was invented.

### Stale documentation

`HALL_WISDOM_KASHF_EXHAUSTIVE_WITNESS_AND_SPIRITUAL_RULES_AUDIT.md`
was corrected so it no longer records the stale H15/H6 reading.

## Regression

New test:
`_test_kashf_partners_witnesses_p101_102.mjs`

It asserts:

- exact partner map;
- exact witness map;
- H5 → H3/H7/H11;
- H15 absent as a witness key;
- H6 absent from H5 targets;
- catalog alignment;
- p53/p101-102 relationship stays unresolved;
- no silent implementation of the extended scheme.

## Queue result

`B04-DATA-WITNESS-NUMERAL` → **RESOLVED**

Current downstream totals:

- total: **46**
- resolved: **13**
- remaining: **33**

Next source-ordered item:

`B05-DATA-P111-MONEY-TABLE` — printed p111.

## QA

GitHub Actions run `35867368376` — **PASS**.

Passed:

- p101–102 partner/witness regression;
- Book Rule Catalog;
- Rule Applicability;
- AI Retrieval Index — 520/0;
- AI Retrieval Live Bridge — 145/0;
- AI Context Builder;
- Professional Verdict Safety — 423/0;
- Kashf/Hawi Method Isolation;
- Canonical Routing — 1535/0;
- Question Route Coverage — 138/138;
- p97–99 dignity regression;
- p100 joy/grief regression;
- p100–101 month-map regression.

## Result

The critical witness numeral is now source-correct everywhere in the active
downstream data/catalog path, while the unresolved relationship between the
book's separate witness systems remains explicitly unresolved.
