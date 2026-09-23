# KASHF Phase 4 — Downstream Batch 12: Season Map Source Correction

## Scope
- Printed source: pp136-137.
- Queue item: `B08-SHIB-5-SEASON-MAP-SOURCE-CORRECTION`.
- Runtime data: `goral-hachol/data/sources/kashf-al-asrar/kashf-shibutzim.js`.
- Consumer: `raml-data/raml-seasonal-astro-profile-engine.js`.

## Source correction
The old runtime table treated the four seasons as a mutually-exclusive partition and reconstructed Spring by elimination.

The printed source/index evidence instead requires overlapping groups:
- Spring: 2122, 1211, 2211, 1121, 2222, 2112
- Summer: 2212, 1111, 1122, 2121, 2112
- Winter: 1221, 2221, 2111
- Autumn: 1121, 1211, 1222

Explicit overlaps:
- 1121 → Spring + Autumn
- 1211 → Spring + Autumn
- 2112 → Spring + Summer

No completion-by-elimination remains.

## Consumer repair
The seasonal profile engine no longer uses `.find()` to select the first matching season.

It now:
- collects all explicit source groups for a figure;
- returns a unique `season.value` only when exactly one season applies;
- returns `season.value=null` plus `season.values=[...]` when the source overlaps;
- marks overlap as `VERIFIED_OVERLAP`;
- unions zodiac candidates across all matching seasons;
- never resolves a single zodiac sign from the overlap.

This prevents source-array order from becoming an invented precedence rule.

## Regression
Updated:
- `tests/raml-seasonal-astro-profile-engine.test.js`

Covered:
- unique Autumn;
- explicit Spring (no reconstructed status);
- 1121 Spring+Autumn overlap;
- six zodiac candidates across an overlap;
- no automatic season/sign collapse;
- existing planet/element/provenance behavior.

## QA
GitHub Actions run `35891252862` — **PASS**.

Passed:
- syntax checks;
- seasonal profile regression;
- Batch11 Dhamir runtime precedence;
- canonical routing;
- AI retrieval live bridge;
- professional verdict safety.

## Queue result
`B08-SHIB-5-SEASON-MAP-SOURCE-CORRECTION` → **RESOLVED**.

Current official downstream total:
- resolved: 21/46
- remaining: 25

Next:
`B09-DHAMIR-H6-SUBJECT-ID-CANDIDATE` — p159.
