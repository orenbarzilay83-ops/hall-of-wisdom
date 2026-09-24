# KASHF Source Freeze — Wave 04 (printed pp254–275)

## Scope
Final ten SOURCE-OPEN records.

Starting after Wave 03:
- 38/48 frozen
- 10 OPEN

Wave 04 closes all ten:
- 1 → RESOLVED
- 9 → SOURCE_CONFLICT/NON_OPERATIONAL

## RESOLVED

### B30-SOURCE-P275-AL-MUNAQQAT-TITLE
High-resolution visual reread of printed p275 / scan277 resolves the source title.

The scan visibly reads:

`الملتقط في علم النقط`

not:

`المنقط في علم النقط`

Freeze decision:
- source title is frozen as **al-Multaqat / الملتقط**;
- the existing source-record ID is retained only for traceability;
- this is a direct visual correction, not normalization from context.

## SOURCE_CONFLICT/NON_OPERATIONAL

### B28-SOURCE-P254-AL-TUWAYHIR
Printed p254 / scan256 visibly reads `التويهر`.

Freeze:
- literal token is secure;
- canonical figure identity is not secure;
- do not normalize it to Dragon’s Tail or another figure from sequence/symmetry.

The p254 Master Index record was also corrected so its profession map no longer silently states “Dragon’s Tail” for this printed token.

### B28-SOURCE-P254-AL-GHARAIM
Printed p254 / scan256 visibly reads `الغرايم` in the Mercury profession line.

Freeze:
- preserve `الغرايم` literally;
- technical/lexical meaning remains unresolved;
- do not force v57’s “נפלאות” or normalize to another Arabic term.

### B28-SOURCE-P255-TARAKTAHU
Printed p255 / scan257 visibly contains:

`وإن خرج لك أحد هذه الثلاثة الأشكال تركته`

Freeze:
- literal wording preserved;
- referent of “these three figures” and operational force of `تركته` are not sufficiently defined;
- no reconstructed runtime branch.

### B28-SOURCE-P256-DUPLICATED-SAAD
Printed p256 / scan258 repeats `سعد`.
The printed editor parenthesis conjectures:

`لعله: نحس`

Freeze:
- printed `سعد` and editorial `نحس` remain distinct;
- conjecture is not promoted to source text;
- affected mixed branch remains non-operational.

### B28-SOURCE-P261-HARITHAN
Printed p261 / scan263 visibly reads `حارثا` in the ninth-house ruler profile.

Freeze:
- preserve the literal token;
- no guessed adjective, occupation or moral interpretation without another certified witness.

### B29-SOURCE-P265-KHILA-AL-MULUK
Printed p265 / scan267 clearly contains `خلع الملوك` immediately after the H10 clothing clause.

Freeze:
- words are visually secure;
- exact syntactic/operational relation remains unclear;
- do not fold it automatically into the clothing verdict.

### B29-SOURCE-P272-FA-IN-YAKUN
Printed p272 / scan274 preserves the defective `فإن يكون` construction and gives an alternate-version note:

`وفي نسخة أخرى: تكرر`

Freeze:
- main reading and alternate version remain separate;
- no grammatical repair selected for runtime.

### B29-SOURCE-P273-INCOMING-CONJECTURE
Printed p273 / scan275 gives the incoming branch while the editor inserts:

`لعله: كانا نحسين`

Freeze:
- the illness/death branch depends on an editorial malefic insertion;
- no fatal runtime rule may be activated from the printed main text alone.

### B30-SOURCE-P274-KHASHIYA-CONJECTURE
Printed p274 / scan276 reads:

`خشي على نفسه`

The editor conjectures:

`لعله: جنى جناية`

Freeze:
- preserve both readings separately;
- no substitution in runtime.

## Runtime effect
No new source-conflict rule was activated.

This wave freezes source status only, except for one source-index correction:
- p254 no longer silently normalizes `التويهر` to Dragon’s Tail.

## Final Source Freeze result
- **48/48 frozen**
- **8 RESOLVED**
- **40 SOURCE_CONFLICT/NON_OPERATIONAL**
- **0 OPEN**

## Next roadmap phase
Rule Decision payload:
- `activatedRuleIds`
- `rejectedRuleIds`
- `decisionSummary`

Then:
1. Golden/E2E
2. Clean Chat Knowledge Pack
3. Live deployment verification
