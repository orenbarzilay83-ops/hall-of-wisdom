# Kashf Golden/E2E — canonical pipeline audit

## Scope and authority
- Branch: `chatgpt/kashf-downstream-batch05-p100-101-months`.
- Printed Arabic scan `كشف الأسرار المصونة في إخراج الضمائر المخزونة` is authoritative for the four fixed source cases. The approved v57 Hebrew rule in the Master Index is operational-primary; Arabic is verification-only in the AI payload.
- This phase tested the existing pipeline. It did not edit v56, v57, the Master Index, geomancy calculations, professional policy, UI, or live deployment.

## Source-to-code-to-test traceability

| Case | Printed evidence | Canonical method and activation | Fixed test obligation |
|---|---|---|---|
| GT-P191-PREGNANCY-EXISTS-SILENT | Printed p191, scan PDF p193: a silent figure in H5 indicates pregnancy; an empty figure is the contrary branch. | `q-pregnancy` → `pregnancy.p191.existsH5SilentEmpty`; H5=2111. | Executor result `classification=silent`, `pregnancyExists=true`; exact v57 p191 source rule reaches AI context. |
| GT-P191-GENDER-MALE | Printed p191, scan PDF p193: masculine H5 indicates a male child, feminine H5 a female child. | `q-gender` → `pregnancy.p191.genderH5`; H5=1112 masculine in the approved figure classification. | `h5Pattern=1112`, `gender=male`; p192 alternative methods cannot vote. |
| GT-P191-192-MISCARRIAGE-PAIR | Printed p191→192, scan PDF pp193–194: Humra in H7 and Ankis in H8 constitute the stated miscarriage sign. | `q-miscarriage` → `pregnancy.p191-192.miscarriageRedH7NakisH8`. | H7=2122, H8=2221, `miscarriageSign=true`; no inverse claim of pregnancy safety or medical certainty. |
| GT-P196-ILLNESS-RECOVERY | Printed p196, scan PDF p198: a benefic H15 indicates recovery; the malefic branch prolongs illness. | `q-illness-heal` → `illness.p196.outcomeH15`; H15=2211. | `recoveryStatus=recovers`, `recovers=true`; recurrence and sensory procedures do not vote with H15. |

The four printed pages were visually rechecked against the supplied scan. The test's expected method, page, board fixture and executor fields are fixed; they are not generated from the implementation's returned verdict. This is a scoped Golden set, not a claim that every source example in the book has a Golden case.

## Full path and boundaries
`_test_kashf_golden_e2e.mjs` covers selected question/intent, one canonical method, real board/executor, v57 retrieval, Rule Decision activation/rejection, AI context, server sanitization, and the Smart Advisor structured-output gate. It covers 44 distinct runnable Question Bank methods, plus the p206 free-text desire method and the p159 Dhamir subject-identification method: 46/46 runnable methods accounted for.

The p159 method is source/executor-ready but `pending-backfill` for client-facing certification. Advisor analysis may run with this exact selected method, while the mocked structured output has `clientAnswerDraft=null`; the server's exact-client-draft gate rejects an uncertified draft. Thus 45/45 professionally certified methods can provide the authorized draft path, and p159 is not silently promoted to client certification.

The Anthropic response was mocked inside the test; a fake key/model and injected token verifier were used. No external AI request, genuine credential, client record, deploy, PR or merge was involved. This test does not prove the quality of a real model response or a live deployment.

## QA and disposition
Final GitHub Actions run `36313304583` — PASS:
- Golden/E2E: **886 assertions**, 46/46 runnable method coverage, 4/4 fixed source cases.
- Canonical routing: **1751/0**; AI retrieval: **772/0**; live bridge: **145/0**.
- Rule Decision, AI Context Builder, Smart Advisor payload, professional safety, book-rule catalog, applicability, Kashf/Hawi isolation and 138/138 Question Route Coverage passed.
- Master Index Source Freeze remained **48/48**: 9 RESOLVED, 39 SOURCE_CONFLICT/NON_OPERATIONAL, 0 OPEN.

An initial QA run stopped on escaped template literals in the new test file. The next run revealed a test-only assumption that p159 was blocked from advisor analysis; inspection of the existing safety contract clarified that only its *client draft* is uncertified. The mocked response was corrected to emit no draft for p159. No production engine or source rule was changed to make the test pass.

## Unresolved evidence and next resume point
No new source conflict was decided in this scoped Golden set. The 39 frozen non-operational source items remain non-operational and must not be inferred into runtime. Further source-derived cases require their own printed evidence and activation checks.

Next: **Clean Chat Knowledge Pack** from the verified canonical v57/index/registry and this E2E boundary, then separately approved **live deployment verification**. Do not infer a live-model PASS from this mocked QA.
