# KASHF Phase 4 — Canonical corrected v57 versioning audit

## Decision and provenance

- Canonical repository artifact: `kashf-v57-draft.html`.
- Exact cumulative input artifact: `kashf-v57-draft-phase4-content-batch30.html`.
- Batch 30 input SHA-256: `fc88c81c546bbffc3dd6aafb7498643ae8d77098460e8bdcdbc479b39048915e`.
- Canonical SHA-256 after the project-wide Hebrew figure-name normalization: `1a78da8622c68fae51dbc987ed00adc099398fded620e02e3a04fd22c9a6d562`.
- Final canonical SHA-256 after the isolated p99 duplicate-row erratum: `b59f6e937992f5bd11e1451c255a4ef738c4f320b2b3e847bfb97f99f1db4785`.
- This is the cumulative Phase 4 corrected artifact through printed p276. It was not regenerated from v56. The only post-Batch-30 content change is replacement of all 50 remaining erroneous `נקי הלחי` labels with the mandatory canonical Hebrew name `בר הלחי`.
- The authoritative content source remains the printed Arabic scan. The Arabic OCR PDF was used only as helper evidence.

## Verification before versioning

- Printed-page anchors: 256 total and 256 unique, continuously covering p21–p276.
- Missing anchors: none.
- Duplicate anchors: none.
- Page structure: every source page contains its page wrapper, `article.text`, and printed page-number element.
- Full-file tag balance: section 261/261, article 260/260, span 10137/10137, table 61/61, tr 425/425, td 1250/1250.
- `git diff --check` passes after the final terminology normalization.
- The last sequential source correction pass is recorded in Content Batches 08–30 and ends with `תם הספר` on p276.

## Queue implications

- The corrected HTML was versioned and every surviving `v57CorrectionQueue` item was checked against the corrected artifact and its source/audit evidence: 91/91 are `RESOLVED`.
- Five obsolete pagination/traceability queue entries were removed when the corresponding Master Index synchronization patches were applied; their removal is enumerated in the final closure report.
- Source ambiguities and editor conjectures remain open as source conflicts or `REVIEW_REQUIRED`; they must not be converted to runtime rules.
- Master Knowledge Index synchronization patches were applied and the resulting index was revalidated. Open source conflicts and downstream corrections remain in their dedicated queues and are not runtime truth.

## Scope guard

- No Registry, Routing, Engine, or Golden Test changes are included.
- No PR or merge is created by this commit.
