# HALL_WISDOM_KASHF_GOLDEN_TEST_STRATEGY

> Planning only. No test written. No code changed. This document
> catalogs practical examples found in the source book across all prior
> mapping rounds and proposes which should become Golden Tests in a
> future, separately-approved round. It does not write any test.

A "Golden Test" here means: a test whose expected output is derived
directly from a source-book passage (a worked example, or a complete
low-ambiguity lookup table treated as N implicit test cases), not from
an engineer's independent judgment of what the "right" answer should be.

---

## Candidate Golden Tests

### GT-1 — Al-Zanati's Order-2 monetary-conversion example
| Field | Value |
|---|---|
| Source page | 113 |
| Question | Illustrative — a worked numeric conversion of figure+house into a monetary sum |
| Inputs | A specific figure/house combination (exact values need re-extraction from the working notes' source excerpt — not fully re-quoted in this document) |
| Expected intermediate calculations | Addition/subtraction per Order-2's triangular-number sequence |
| Expected figures | Not isolated in this round's notes at the individual-figure level |
| Expected witnesses/dhamir | None involved |
| Expected verdict | A monetary sum |
| Exact textual evidence | Present in source, not verbatim-quoted in the working notes (flagged — would need a targeted re-read of p.113 before this test can be written) |
| Current reproduction status | `not-tested` — **corrected: L0.5 is implemented as `kashf-shibutzim.js` (Order 2 = `SHIBUTZ_2_CANONICAL_NUMBER`, already source-verified); this test is not written yet, but the blocking claim was wrong** — the actual blocker is that this specific worked example's exact figure/house values were never re-extracted verbatim (see Inputs row) |
| Missing implementation | None in L0.5 itself — only the missing verbatim re-extraction of this specific example's numbers |

### GT-2 — Love-divination letter-magic example (Order 6)
| Field | Value |
|---|---|
| Source page | 140 |
| Question | A love-divination case using letter-magic derived from the Order-6 letter table |
| Inputs | Order-6 letter mapping (p.138-141) |
| Expected intermediate calculations | Not fully re-quoted in this round's notes |
| Expected verdict | Not isolated in this round's notes |
| Exact textual evidence | Present in source at p.140, not verbatim-quoted here |
| Current reproduction status | `not-tested` — **corrected: L0.5 Order 6 (`SHIBUTZ_6_LETTER_TABLE`) is implemented and source-verified**; not written yet, but not blocked by a missing table |
| Missing implementation | None in L0.5 itself — only the test has not been written |

### GT-3 — SPLIT into GT-3A and GT-3B (a later verification round)

> **Correction**: GT-3 as originally scoped bundled p.219 and p.220
> together as "a fully-worked trade example." A later round found these
> are two distinct rules with genuinely different verification status —
> p.219 (Requester) is already reproduced exactly by existing code;
> p.220 (Requested) is a separate rule whose own arithmetic does not
> verify under any interpretation tried. They must not be tested
> together. See
> `HALL_WISDOM_KASHF_L0_5_SIXTEEN_PLACEMENT_ORDERS_AUDIT.md`.

### GT-3A — Requester circle (מבקש), p.219 — ★ regression-lock candidate, ready to write today
| Field | Value |
|---|---|
| Source page | 219 |
| Question | Trade/pricing — Seeker (Requester) strength via the Circle |
| Inputs | A figure's own "house of honor" (`REQUEST_CIRCLE_HONOR_HOUSES`, `kashf-shibutzim.js` — verified for exactly 2 of 16 figures), current board position (house 1) |
| Expected intermediate calculations | Count inclusive-forward-wraparound from house-of-honor to house 1; cast that count from house 1 via Order 1's sequence (`SHIBUTZ_1_MOSHAV`) |
| Expected figures | שפל ראש (house-of-honor 8) and כבוד נכנס (house-of-honor 12) — the only 2 verified cases |
| Expected witnesses/dhamir | None stated for this technique specifically |
| Expected verdict | שפל ראש: count 10, lands house 10 (authority/status — benefic). כבוד נכנס: count 6, lands house 6 (illness/worry house, but supplementary reasoning still yields hope) |
| Exact textual evidence | Both examples quoted directly, p.219 |
| Current reproduction status | **`exact`** — confirmed this round by direct code execution: `computeRequesterCircleHouse('2221')` → `{honorHouse:8, count:10, landingHouse:10}`; `computeRequesterCircleHouse('2211')` → `{honorHouse:12, count:6, landingHouse:6}`. Both match the source exactly |
| Missing implementation | **None** — `computeRequesterCircleHouse`, `computeRequesterCircleStrengthKashf` already implemented, routed under the `commerce` topic (`id: 'requester-circle-strength'`), and exposed via `kashf-reading-engine.js` |
| Why ready now | This is a **regression-lock candidate, not a gap-closer** — the code already works; writing this test only formalizes already-correct, already-verified behavior so future changes can't silently break it. No new engine work is required to write it |

### GT-3B — Requested circle (מבוקש), p.220 — blocked
| Field | Value |
|---|---|
| Source page | 220 |
| Question | Trade/pricing — whether the sought thing will be attained |
| Inputs | A figure's "house of honor" (possibly the same table as GT-3A, possibly not — unconfirmed) and its actual board position |
| Expected intermediate calculations | Unclear — the source's own example (ממון יוצא, house-of-honor stated as 4) does not resolve to the stated result (7) under any counting interpretation tried this round or in a prior round |
| Expected figures | ממון יוצא (the only example given) |
| Expected witnesses/dhamir | None stated |
| Expected verdict | Cannot be determined until the arithmetic is resolved |
| Exact textual evidence | Present in source but internally inconsistent — not usable as a Golden Test reference as written |
| Current reproduction status | `blocked` — not `fail` in the sense of "code doesn't exist yet"; this is `blocked-by-source-ambiguity`, since even a correct implementation could not reproduce the source's own stated result |
| Missing implementation | No code exists, but writing code would not help until the source ambiguity is resolved |
| Why blocked | **Do not write an expected verdict for this test until the source itself is re-verified.** Picking any single interpretation to make the test pass would mean inventing a resolution the book does not provide — exactly what this whole project's discipline forbids |

### GT-4 — "שאילת הכרעה" (Decision-Request) 16-figure verdict table
| Field | Value |
|---|---|
| Source pages | 170-171 |
| Question | General-purpose yes/no oracle via 21-repeat casting |
| Inputs | The resultant single figure after 21 castings |
| Expected intermediate calculations | None — direct table lookup |
| Expected figures | All 16, each with a distinct fixed verdict phrase (e.g. סוהר/ממון יוצא="will come to pass"; בר הלחי="your effort is fruitless") |
| Expected witnesses/dhamir | None |
| Expected verdict | Per-figure fixed phrase — treat as 16 implicit test cases, one per figure |
| Exact textual evidence | Full table present, p.170-171 |
| Current reproduction status | `fail` — L2.3 (decision-oracle pattern) is `missing` |
| Missing implementation | L2.3 |

### GT-5 — Missing-person mod-4 numeric oracle
| Field | Value |
|---|---|
| Source pages | 248-253 |
| Question | Missing person — alive/dead/timing via total-points mod 4 |
| Inputs | Total board point count |
| Expected intermediate calculations | Mod-4 reduction |
| Expected verdict | 1=imprisoned, 2=arrives-quickly, 3=never-arrives, 4=arrives-after-long-time — 4 implicit test cases |
| Exact textual evidence | Present, p.248-253 |
| Current reproduction status | `fail` — part of L2.3's pattern family; L4.16 (missingPerson) itself is `partially-implemented` but this specific sub-oracle not confirmed present |
| Missing implementation | Confirm whether L4.16's existing code already covers this mod-4 oracle specifically (not verified this round) |

### GT-6 — Livelihood-oracle table (first-figure-rises pattern)
| Field | Value |
|---|---|
| Source pages | 267-269 |
| Question | Sustenance/livelihood outcome via which figure rises first |
| Inputs | First-rising figure |
| Expected verdict | Per-figure phrase — **but קהלה appears twice with different verdicts, an unresolved source-level inconsistency** |
| Exact textual evidence | Present, p.267-269, with the flagged inconsistency |
| Current reproduction status | `fail` — L2.3 pattern missing; L4.20 (friendsHopeLifeLove) `blocked-by-source-ambiguity` |
| Missing implementation | L2.3; **also requires Phase 0 source-clarification of the קהלה double-entry before this table can be safely digitized** — this Golden Test cannot be finalized until that ambiguity is resolved or explicitly documented as permanent |
| Note | Do not write this test with either קהלה verdict picked arbitrarily — that would be inventing a resolution the source does not provide |

### GT-7 — Thief physical/occupational description table (×16 figures)
| Field | Value |
|---|---|
| Source pages | 232-234 |
| Question | Theft — thief's physical description and likely trade, by figure |
| Inputs | The figure representing the thief (house 7, per L4.14's formula) |
| Expected verdict | 16 distinct descriptive phrases (e.g. נלחם=tall reddish sparse-bearded; לבן=white laughing clever, paper/writing trade) — 16 implicit test cases |
| Exact textual evidence | Full table present, confirmed in this round's reading |
| Current reproduction status | `not-tested` — table itself not confirmed present in `kashf-topic-rules.js`'s `theft` topic this round |
| Missing implementation | Confirm presence in code first (Phase 7 of the Roadmap); if absent, this is a `missing` lookup table (Sub-Engine Inventory §25) |

### GT-8 — Ship-damage-by-figure table
| Field | Value |
|---|---|
| Source pages | 237-247 (approx.) |
| Question | Travel — which part of the vessel is damaged, by resultant figure |
| Expected verdict | Per-figure damage description (e.g. קהלה=arrives safely; סוהר=prow damaged-but-fixed) — implicit test cases per figure |
| Exact textual evidence | Present, confirmed this round |
| Current reproduction status | `not-tested` — same status as GT-7 |
| Missing implementation | Confirm presence in code first |

### GT-9 — Prisoner-outcome figure-pair table
| Field | Value |
|---|---|
| Source pages | 271-276 |
| Question | Prisoner's fate, by specific figure-pair combination |
| Expected verdict | E.g. נלחם+בר הלחי=dies-in-prison; חיבור=suspected-real-offense-then-released — implicit test cases per pair |
| Exact textual evidence | Present, confirmed this round |
| Current reproduction status | `not-tested` |
| Missing implementation | Confirm presence in code first |

### GT-10 — Essential Dignities Table fidelity (data-only test)
> **IMPLEMENTED, in a later round.** L0.3 was discovered already
> existing as `FIGURE_DIGNITIES` in `kashf-figure-attributes-gate2.js`
> — no new file was created. This test now exists as
> `_test_kashf_essential_dignities_table.mjs` (repo root) and passes
> 196/196 assertions. See
> `HALL_WISDOM_KASHF_ESSENTIAL_DIGNITIES_EXISTING_DATA_VERIFICATION_REPORT.md`
> for full detail. Fields below are left as originally planned, for the
> historical record of this document's original proposal.

| Field | Value |
|---|---|
| Source pages | 97-99 |
| Question | Not a verdict test — a pure data-fidelity test: does the digitized table match the source's 14×7 grid (14 of 16 figures have data; 2 are correctly absent from the source) exactly? |
| Inputs | None — static comparison |
| Expected output | Exact match, field-by-field, figure-by-figure |
| Exact textual evidence | Full table, confirmed this round |
| Current reproduction status | **`exact`** — 196/196 assertions pass, including a 98/98 exact-value cross-check against a fresh independent re-extraction |
| Missing implementation | None — implemented |
| Why included despite being "not a verdict test" | This is the model for how any purely-tabular Layer-0 engine should be tested — fidelity first, verdict-consumption second (see GT-3, which depends on this table being correct) |

### GT-11 — Money-source mod-7 oracle
| Field | Value |
|---|---|
| Source pages | 179-182 |
| Question | Money — source of funds via whole-board point-count mod 7 |
| Expected verdict | 7 named sources (government/women/writing/inheritance/travel/trade/theft) |
| Exact textual evidence | Present, confirmed this round, and confirmed to exactly match the already-implemented `computeMoneySourceKashf` |
| Current reproduction status | **`exact`** — this is the one candidate this round confirms already reproduces correctly, based on the source-vs-code comparison performed (though full runtime execution was not tested, prohibited this round) |
| Missing implementation | None — candidate for a **regression-lock** Golden Test (protect existing correct behavior) rather than a gap-closing one |

### GT-12 — Completion primary/alt formula
| Field | Value |
|---|---|
| Source page | 173 |
| Question | Will the matter be completed? |
| Expected verdict | Internal=yes / external=no (primary); saad/nahs of houses 1,16 (alt) |
| Exact textual evidence | Confirmed exact match to existing code this round |
| Current reproduction status | **`exact`** per source-vs-code comparison (not runtime-tested) |
| Missing implementation | None — regression-lock candidate |

---

## Proposed prioritization for a future round

1. **Regression-lock tier (protect what's already correct)**: GT-11,
   GT-12, GT-10 (implemented and passing), **and now GT-3A (Requester
   circle, p.219) — moved here from the gap-closing tier below,
   corrected in a later round, since it too is already implemented,
   routed, and exposed, reproducing both source examples exactly**.
   These require no new engine work — only formalizing existing
   confirmed-correct behavior into a test, so future changes can't
   silently break it.
2. **Table-fidelity tier (once code presence is confirmed or built)**:
   GT-7, GT-8, GT-9 — concrete, low-ambiguity, good "second wave" tests.
3. **Blocked tier — do not write yet**: GT-6, pending Phase 0's
   resolution (or documented non-resolution) of the קהלה double-entry;
   **and now GT-3B (Requested circle, p.220), corrected in a later
   round from "highest-value gap-closing" to blocked — its own source
   example does not verify under any interpretation tried, so this
   cannot be closed by more implementation work.** Writing either test
   today would force an arbitrary choice the source itself doesn't make.
5. **Needs re-extraction before writeable**: GT-1, GT-2 — this round's
   working notes recorded that these examples exist and roughly what
   they demonstrate, but not the exact source numbers needed to write a
   precise expected-output assertion. A targeted re-read of p.113 and
   p.140 is needed first.
6. **Needs confirmation of current code state first**: GT-5, GT-7, GT-8,
   GT-9 — before writing these as gap-closing tests, confirm whether the
   underlying table already exists somewhere in `kashf-topic-rules.js`
   (this round did not verify function bodies, only topicId presence).

No test code is written in this document, per instruction. This is a
prioritized inventory only.
