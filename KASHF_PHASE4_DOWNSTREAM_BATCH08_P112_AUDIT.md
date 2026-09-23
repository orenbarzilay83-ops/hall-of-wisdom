# KASHF Phase 4 — Downstream Batch 08 (printed p112)

## Scope
- Printed Arabic source: book p112 / scan p114.
- Canonical source record: `shibutz.p112.lisan-al-amr`.
- Downstream target: `goral-hachol/engine/kashf-leshon-hainyan.js`.
- Queue item: `B05-P112-LISAN-STRUCTURE`.

## Printed-source recheck
The printed page was read directly. The operative sentence is structural:

- `الأوتاد` → present/current judgment.
- `مائل الأوتاد` → future judgment.
- `الزائل الساقط عن الوتد` → past judgment.

The trigger is the **house structural class in which the figure is found**. It is not a free semantic label such as “future”.

The source record remains conservative about the two formulations for producing Lisan al-Amr; this batch does not silently reconcile them.

## Downstream repair
`kashf-leshon-hainyan.js` now exposes a source-faithful p112 structural taxonomy:

- H1/H4/H7/H10 → `الأوتاد` → present.
- H2/H5/H8/H11 → `مائل الأوتاد` → future.
- H3/H6/H9/H12 → `الزائل الساقط عن الوتد` → past.
- H13–H16 are not assigned to this p112 12-house taxonomy by inference.

`computeLeshonHainyan` now reports the actual H1–H12 occurrences of the resulting Lisan figure together with their structural states. If a figure repeats across more than one structural class, every state is retained and the result is marked ambiguous; no precedence rule was invented.

When the figure is absent from H1–H12, the source's placement/taksin fallback is explicitly left unimplemented rather than guessed.

No production routing was added: the Lisan module remains disconnected until its wider operational contract is separately closed.

## Regression
New regression:
`_test_kashf_lisan_structure_p112.mjs`

It verifies:
- all 12 houses against the three printed structural groups;
- no invented classification for H13–H16;
- preservation of the structural trigger in `computeLeshonHainyan`;
- preservation of multiple structural states without invented precedence.

## Queue result
`B05-P112-LISAN-STRUCTURE` → **RESOLVED**

Current downstream totals:
- total: 46
- resolved: 15
- remaining: 31

Next item:
`B06-OPS-ATTRIBUTED-METHODS` — pp113–114/121, keep attributed/variant methods REFERENCE_ONLY unless explicitly selected.

## QA
GitHub Actions run `35872588035` — PASS.

Passed:
- p112 Lisan structural regression;
- syntax checks;
- Book Rule Catalog;
- Rule Applicability;
- AI Retrieval Index;
- AI Retrieval Live Bridge;
- AI Context Builder;
- Professional Verdict Safety;
- Kashf/Hawi Method Isolation;
- Canonical Routing;
- Question Route Coverage;
- all prior downstream regressions p97–p111.
