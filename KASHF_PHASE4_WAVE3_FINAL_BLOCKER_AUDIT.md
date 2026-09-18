# KASHF Phase 4 — Wave 3 Final Blocker Audit

Date: 2026-09-18
Target branch: `claude/app-cleanup-organization-mia9b2`

## Outcome

The 32-item downstream pass is fully decided:

- 23 items: `RESOLVED`
- 8 items: `BLOCKED`
- 1 item: `DEFERRED_UNTIL_ALGORITHM_VERIFIED`
- 0 undecided items

The nine Wave-3 items are deliberately not converted to RESOLVED. Each now has a final disposition, a blocker type, `runtimeEligible=false`, and explicit unlock criteria.

## Runtime safety boundary

`runSupportingCheck()` now enforces `runtimeEligible:false`. A blocked source method may remain indexed and searchable, but it cannot execute through a broad/legacy topic path. The client narrative also suppresses blocked findings.

The experimental `kashf-leshon-hainyan.js` implementation was reduced to a documentation-only blocked stub. It no longer auto-computes the legacy Dhamir majority and no longer conflates the p106 canonical-position axis with the p111 house-indexed money table.

## Final blockers

### B05-P112-LISAN-STRUCTURE — DEFERRED

Printed p112 preserves two mechanical descriptions of "Lisan al-Amr": H8 born from H1 + the Dhamir house, and a second wording involving the Dhamir house with its "two thirds", H5 and H9. The project must not collapse these into one invented formula. Runtime stays off until a worked source example or equivalent witness reconciles them.

### B12-P177-RELATIVE-THIRTEENTH-BLOCKED

The relative-thirteenth rule remains reference-only. Branch order and difficult source tokens are not fully closed, and the generalized per-house relative mapping is not yet source-certified.

### B12-P178-LIFESPAN-COMPUTATION-BLOCKED

The source procedure is preserved, but the existing helper's raw board-point sum is not established as equivalent to "sum all the elements". The mod-16 walk and "figure number in that house" lookup also require an explicit source-faithful definition and Golden Test.

### B12-P179-DEBT-WALKING-BLOCKED

Wave-3 re-read preserves the printed token `السابع والتاسع عشر` ("the seventh and the nineteenth") even though the geomancy board has 16 houses. It must not be silently normalized to H9. Walk-two/walk-three, "hand", Farah and Bakr also remain computationally open.

### B13-P180-ELEMENT-AMOUNT-BLOCKED

The source gives two derived money figures and element weights (fire=1, air=2, water=3, earth=4), then instructs retaining the lower element and working by its number. It does not close the conversion from that retained element/number to a final monetary amount.

### B13-P181-OTHER-BOOK-REMAINDER-BLOCKED

This method is explicitly from another book. The printed text says reduce by twos, then gives a source-of-money table for remainders 1–7. Those two instructions cannot coexist mechanically. The direct UI money-source route is now blocked rather than changing 2 to 7 or discarding entries.

### B14-P185-RECURSIVE-QUARTERS-BLOCKED

Printed p185 is preserved exactly at the decision points: remainder 1=west, 2=east, 3=south, 4=north. The same passage says 16 places, each divided into four, but explicitly totals them as 94. The arithmetic contradiction remains a source blocker; 94 is not normalized to 64.

### B14-P187-KIND-DIRECTION-BLOCKED

The source says the angles produce two intermediate figures and those produce a third figure for the hidden object's kind. The direction token for the `المنشآت` branch is not securely readable as "north"; symmetry is not permitted as a substitute.

### B14-P188-190-DEPTH-METHODS-BLOCKED

The element-length/opposites framework and the Tamtam water method stay separate. The printed Tamtam text clearly gives H1+H12 as its first derivation, but the following repeated-H12 wording is not mechanically closed. The project therefore preserves the depth groups as knowledge while refusing to invent H12+H9 or a self-combination chain.

## Source-record corrections made during Wave 3

Three Master Index records were corrected because the final printed-source re-read contradicted prior working assumptions:

1. p179: no H7+H9 normalization; the printed "seventh and nineteenth" token is retained as an open defect.
2. p185: direction residues are 1=west and 2=east; the explicit printed total 94 is retained.
3. pp189–190: no claim that the printed second Tamtam derivation is H12+H9; the repeated-H12 wording is retained literally and the chain stays blocked.

## Unlock policy

A blocker may be reopened only when the missing source token/algorithm is resolved by a reliable witness or worked source example and a Golden Test can reproduce it without editorial guessing. Comparative books may support interpretation but may not silently overwrite KASHF.
