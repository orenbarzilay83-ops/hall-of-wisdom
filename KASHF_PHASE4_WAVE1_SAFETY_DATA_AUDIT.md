# KASHF Phase 4 — Wave 1 Safety & Data Audit

Date: 2026-09-18
Branch target: `claude/app-cleanup-organization-mia9b2`

## Scope

Wave 1 resolves the nine safety/data items B06–B10 before the routing rewrite.

## Runtime safety changes

- `buildKashfReading()` no longer runs dhamir on every reading.
- Default runtime: no dhamir route, no majority vote, no external Type-4 supplement, no dhamir extras.
- Legacy multi-method behavior is preserved only behind explicit `clientContext.dhamirMode = 'legacy-majority-explicit'` for diagnostics/tests.
- The p159 H6 subject-identification rule is isolated behind explicit `dhamirMode = 'subject-h6'`; it runs alone and does not vote with other methods.
- Attributed/variant methods remain reference-only and do not compete automatically with the selected primary method.

## Source-data corrections

### Seasons, printed pp136–137

`SHIBUTZ_5_SEASONS` now preserves the printed overlapping groups instead of forcing an elimination partition:

- Spring: 2122, 1211, 2211, 1121, 2222, 2112
- Summer: 2212, 1111, 1122, 2121, 2112
- Winter: 1221, 2221, 2111
- Autumn: 1121, 1211, 1222

Overlap is intentional and retained.

### Derekh in house 13, printed p163

Verified polarity:
- H9 external + H10 internal -> quick return from travel.
- H9 internal + H10 external -> remains on the journey for a long time.

The existing runtime lookup already matched the printed order. A source-verification marker was added so a future refactor cannot silently reverse it.

### Seven witnesses, printed pp163–164

H9–H15 are supporting witnesses. H16 is separately added for hidden intention. The data now states `runtimeRole: 'supporting-only'` and `autoRoute: false`; this scheme is not a primary route and is not merged with other witness systems.

## Queue decisions

All nine Wave 1 queue items are now `RESOLVED`:
- B06-OPS-ATTRIBUTED-METHODS
- B06-DHAMIR-NEED-DRIVEN
- B07-DATA-ELEMENT-TRADITIONS-RUNTIME-PRECEDENCE
- B07-DHAMIR-NEED-DRIVEN-SELECTION
- B08-SHIB-5-SEASON-MAP-SOURCE-CORRECTION
- B09-DHAMIR-MAJORITY-RUNTIME-DISABLED
- B09-DHAMIR-H6-SUBJECT-ID-CANDIDATE
- B10-DEREKH-H13-POLARITY-DOWNSTREAM
- B10-SEVEN-WITNESSES-SUPPORTING-ROLE

## Boundaries

Wave 1 does not yet map ordinary user questions to a canonical dhamir method. That belongs to Wave 2 Routing. The safety invariant established here is: no method runs merely because it exists in code.
