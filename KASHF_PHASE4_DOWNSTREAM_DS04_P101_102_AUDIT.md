# KASHF Phase 4 — Downstream Correction DS-04 (p101–102)

## Authority and decision

- Highest authority: printed Arabic p101–102 / scan PDF p103–104.
- The scan reads `والشكل الخامس يشهد على الثالث، والسابع، والحادي عشر`.
- Therefore the correct extended testimony row is `5→[3,7,11]`, not `15→[3,6,7,11]`.

## Corrected surfaces

| Surface | Correction |
|---|---|
| `kashf-al-asrar-book.js` | Source mirror now says figure 5 and omits H6 |
| `kashf-al-asrar.html` | Legacy HTML source mirror corrected identically |
| `kashf-book-rule-catalog.js` | Extended scheme now records `5→[3,7,11]`; catalog version advanced to v4 |
| Witness audit | Quotation, map and correction note aligned with the printed scan |
| Master Index | `B04-DATA-WITNESS-NUMERAL` marked `RESOLVED` with traceability |

## Safety boundary

The extended p101–102 system remains `implementationStatus: 'missing'`, `applicabilityStatus: 'unresolved'`, and `resolutionStatus: 'unresolvedSourceRelationship'`. It was not merged with the implemented p53 system and no engine, Registry, Router or verdict behavior was enabled.

## Acceptance criteria

- Exact partner map remains `13↔1, 14↔7, 15↔10, 16↔4`.
- Exact witness map is `9→[1,5,7], 14→[2,6,10], 5→[3,7,11], 16→[4,8,12]`.
- No active p101 data surface retains `15→[3,6,7,11]` or adds H6 to figure 5.
- The p53 runtime witness scheme remains unchanged.

## Verification results

- Focused DS-04 test: PASS.
- Book-rule catalog semantic suite: PASS; the p101 rule is selected but never evaluated or applied.
- AI retrieval index: 520 passed, 0 failed.
- AI live bridge: 145 passed, 0 failed.
- Canonical routing: 1,535 passed, 0 failed.
- Downstream queue after DS-04: 13/46 resolved; 33 remain deferred.
- `git diff --check`: PASS.
