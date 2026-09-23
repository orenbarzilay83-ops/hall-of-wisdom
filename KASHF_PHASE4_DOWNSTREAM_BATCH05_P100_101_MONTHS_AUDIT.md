# KASHF Phase 4 — Downstream Batch 05 (printed pp100–101)

## Scope

- Printed Arabic source: book pp100–101 / scan pp102–103.
- Canonical source record: `figures.p100-101.month-associations`.
- Downstream target: `goral-hachol/data/sources/kashf-al-asrar/kashf-figure-attributes-gate2.js`.
- Queue item: `B04-DATA-MONTH-MAP`.
- No routing, executor, AI-verdict, or question-status logic changed.

## Printed-source result

The printed layout was visually rechecked directly.

The source is not one-to-one:

- Shawwal → Jamaa + Bayad.
- Muharram → Bayad.
- Rabi al-Akhir → Joudala + Ataba Dakhila.
- Jumada al-Ula → Qabd Dakhil + Ataba Kharija.
- Dhu al-Hijjah → Ijtimaa + Tariq.

All 12 Hijri months are represented.

Bar al-Khad (`1211`) is the only canonical figure not assigned a month in this chapter. It remains unassigned; no completion was inferred.

## Repair

`FIGURE_MONTHS` now:

1. points to printed pp100–101;
2. uses corrected v57 provenance;
3. restores Bayad in both Shawwal and Muharram;
4. restores Ataba Dakhila in Rabi al-Akhir;
5. preserves all other duplicate month associations;
6. represents all 12 months;
7. marks only Bar al-Khad as source-unassigned;
8. explicitly forbids forcing one month per figure or one figure per month.

## Queue

`B04-DATA-MONTH-MAP` → **RESOLVED**

Current downstream state:

- total: **46**
- resolved: **12**
- remaining: **34**

Next source-ordered item:

`B04-DATA-WITNESS-NUMERAL` — printed pp101–102.

## QA

GitHub Actions run `35862810446` — **PASS**.

Passed:

- p100–101 month source regression;
- p100 joy/grief regression;
- p97–99 dignity regression;
- figure-name source tables;
- Kashf Book Rule Catalog;
- Goral Rule Applicability;
- AI Retrieval Index — **520/0**;
- AI Retrieval Live Bridge — **145/0**;
- AI Context Builder;
- Professional Verdict Safety — **423/0**;
- Kashf/Hawi Method Isolation;
- Canonical Routing — **1535/0**;
- Question Route Coverage — **138/138, 100%**.

## Result

The month-association downstream data now follows the printed source without
collapsing duplicate associations or inventing a missing assignment.
