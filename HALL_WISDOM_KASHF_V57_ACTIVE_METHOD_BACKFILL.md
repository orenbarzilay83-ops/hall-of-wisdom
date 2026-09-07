# Kashf v57 — Active Method Hebrew Knowledge Backfill

## Status

This backfill makes **v57 Hebrew** the operational-primary knowledge layer for every currently runnable canonical Kashf method. The Arabic source remains the highest verification authority, but its runtime role is explicitly **verification-only**.

The navigation source is `kashf-v57-topic-index.html`; the Hebrew content source is `kashf-v57-draft.html`. A runnable method without a v57 entry is now blocked by the canonical reading engine with `v57-knowledge-missing`.

## Runtime contract

For a method to produce a live Kashf reading it must satisfy both existing canonical gates and the new Hebrew-knowledge gate:

1. canonical-operational method;
2. `kashfRuntimeStatus === 'ready'`;
3. `runtimeAllowed === true`;
4. `executorStatus === 'ready'`;
5. a matching entry in `kashf-v57-knowledge-registry.js`.

Successful readings expose `knowledgeLanguage: 'he'`, `hebrewKnowledge`, and v57 operational source metadata. Arabic metadata is exposed only as `verificationSource.role = 'verification-only'`.

## Backfilled runnable methods

- completion.p173.fireRows15910 — p173
- relocation.p183.h4h15 — p183
- siblings.p182.h1h3 — p182
- travel.p238.assemble1359 — p238
- illness.p196.outcomeH15 — p196
- illness.bodyPart.h6Figure — p199
- pregnancy.p191.genderH5 — p191
- pregnancy.p191.existsH5SilentEmpty — p191
- hidden.p188.isStillThere — p188
- lostItem.p202.returnH6H8 — p202
- marriage.p204.dowryH8 — p204
- marriage.p204.previousStatusH7inH10 — p204
- authority.p256.honorConditionH10Planet — p256
- authority.p257.appointmentH1H10Planet — p257
- authority.p257.rulerConditionH7H10 — p257
- profession.p254.h9Planet — p254
- theft.p224.relationshipH7Recurrence — p224
- theft.p225.thiefDescriptionH7 — p225, with detailed descriptions p232–234

## Defect found by using v57

The active profession material contained a stale Mercury/עֻטַארִד gloss (writing/accounts). v57 p254 gives Mercury as **כישוף, נפלאות ואצטגנינות**, matching the Arabic verification text `السحر والغرائب والتنجيم`. The active profession map and topic source text were corrected to the v57 Hebrew reading.

## Rule for future work

No new canonical executor may be enabled before its exact method has:

- an index location in v57;
- a Hebrew operational rule/excerpt in the v57 knowledge registry;
- source-page traceability;
- Arabic verification metadata;
- canonical contract tests.

This prevents the AI layer from depending on Arabic-only context or on legacy paraphrases when the Hebrew v57 knowledge exists.
