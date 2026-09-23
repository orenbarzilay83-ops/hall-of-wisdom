# KASHF Phase 4 — Downstream Batch 09 (printed pp113–114 / p121)

## Scope
- Printed Arabic source: book pp113–114 and p121.
- Canonical source records:
  - `shibutz.p113.al-zanati-examples`
  - `shibutz.p114.al-zanati-continuation`
  - `shibutz.p114-115.dalail-al-fadl-table`
  - `shibutz.p121.al-zanati-al-layth-distance`
- Queue item: `B06-OPS-ATTRIBUTED-METHODS`.

## Printed-source recheck
The printed pages were read directly.

### pp113–114
The number/duration examples are introduced with `قال الزناتي`, so they are attributed to al-Zanati rather than silently merged into the author's primary rule.

Immediately after the continuation, the source says `ومن كتاب آخر` and names `دلايل الفضل في علم الرمل`; that table is therefore an explicitly external-book source.

### p121
The distance section begins with `ومن نسخة أخرى`, then gives:
- al-Zanati's method: count the odd/single points through figures 1–15, reduce by 16, walk the remainder through houses; landing group determines span/cubit/fathom/farsakh.
- al-Layth's method: perform the same calculation but derive the unit from the original group of the figure where the count stops.

The passage then states `رجع إلى النسخة الأولى` — return to the first copy — before the third placement order begins.

## Downstream repair
A shared policy is now explicit in `kashf-shibutzim.js`:

- `operationalRole: REFERENCE_ONLY`
- `runtimeEligible: false`
- `defaultEligible: false`
- `mayAutoRun: false`
- `mayVoteAgainstPrimary: false`
- `requiresExplicitSelection: true`

The attributed-method catalog now covers:
1. al-Zanati number/duration, pp113–114.
2. Dalail al-Fadl external table, pp114–115.
3. al-Zanati distance method, p121.
4. al-Layth distance method, p121.

The p121 methods were preserved as reference data without wiring either one into a live executor.

## Runtime hard-stop
The canonical Kashf path was hardened at three levels:

- `kashf-method-router.js`: attributed/external records cannot become runnable even if other flags are accidentally changed.
- `kashf-canonical-reading-engine.js`: direct method execution also blocks attributed/external records, so bypassing question routing cannot feed them into a verdict.
- `kashf-canonical-method-registry.js`: validation rejects `runtimeAllowed=true` for any non-Kashf or non-body source.

This preserves the rule that an attributed/variant method cannot auto-run and cannot vote against the selected primary method.

## Regression
New regression:
`_test_kashf_attributed_methods_reference_only.mjs`

It verifies:
- the shared REFERENCE_ONLY policy;
- all four attributed-method catalog entries;
- al-Zanati pp113–114 metadata;
- both p121 al-Zanati/al-Layth distance records and their four unit groups;
- the `رجع إلى النسخة الأولى` return marker;
- the registry invariant for all external/attributed methods;
- direct-execution hard-stop using an already-existing external method record.

## Queue result
`B06-OPS-ATTRIBUTED-METHODS` → **RESOLVED**

Current downstream totals:
- total: 46
- resolved: 16
- remaining: 30

Next item:
`B06-DHAMIR-NEED-DRIVEN` — pp121–123; the existence of `SHIBUTZ_3_ELEMENT_VALUES` must not cause all dhamir types to run.

## QA
GitHub Actions run `35873589809` — **PASS**.

Passed:
- Batch09 attributed-method reference-only regression;
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
- all prior downstream regressions p97–p112.
