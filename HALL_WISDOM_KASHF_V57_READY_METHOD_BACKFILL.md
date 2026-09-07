# Kashf v57 — Source-ready Hebrew Knowledge Backfill

## Goal
Extend the v57 Hebrew operational-primary knowledge layer from runnable methods to every canonical method whose source status is genuinely ready, before adding more executors. Arabic remains verification-only.

## Corrections found while backfilling

1. **joy.p196.recast14511 was falsely source-ready.** v57 p196 belongs to the illness/lost-item/animals chapter and does not contain the 1/4/5/11 joy/event recast. The known celebrations helper is external, so the Kashf route is now blocked-by-source rather than fabricating a v57 entry.
2. **travel.p239.profitEarthRowH2 was falsely source-ready.** The Hebrew rule is indexed, but the exact earth-row input is unresolved; it is now blocked-by-source.
3. **travel.p239.seaOrLandByElement was falsely source-ready.** The preceding two-figure construction is unresolved, and v57 omits the Arabic fire-branch return-by-sea clause. The Hebrew text is preserved with explicit verification metadata and the method is blocked-by-source.
4. **missing-person life/death page traceability was stale.** The selected operational rule is in v57 pp250-251; the historical method id is retained for compatibility, but sourcePages are corrected.

## Permanent contract

- Every method with methodRole=canonical-operational and kashfRuntimeStatus=ready must have a v57 Hebrew knowledge entry, even while executorStatus is pending.
- Runnable methods still require runtimeAllowed=true and executorStatus=ready.
- Blocked-by-source methods may have Hebrew knowledge for AI context, but that knowledge never authorizes runtime execution.
- Source discrepancies are recorded rather than silently repaired from Arabic.
- The canonical routing CI now triggers when kashf-v57-knowledge-registry.js changes.
