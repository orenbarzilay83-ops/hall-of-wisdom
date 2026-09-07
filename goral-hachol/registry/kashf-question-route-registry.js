/**
 * kashf-question-route-registry.js
 *
 * P0 explicit Question ID -> Kashf source intent -> canonical method mapping.
 * This registry is authoritative for Kashf routing when a concrete
 * question-bank id is known.
 *
 * Unmapped question ids are NOT allowed to fall back to topic routing.
 */

const route = ({
  questionId,
  disposition,
  kashfIntentId,
  kashfMethodId,
  kashfRuntimeStatus,
  aliasOf = null,
  note = null,
}) => Object.freeze({
  questionId,
  disposition,
  kashfIntentId,
  kashfMethodId,
  kashfRuntimeStatus,
  aliasOf,
  note,
});

export const KASHF_QUESTION_ROUTES = Object.freeze({
  // ── READY pilot questions ---------------------------------------------
  'q-success': route({
    questionId: 'q-success',
    disposition: 'KEEP',
    kashfIntentId: 'completion.willComplete',
    kashfMethodId: 'completion.p173.fireRows15910',
    kashfRuntimeStatus: 'ready',
  }),

  'q-knowledge-success': route({
    questionId: 'q-knowledge-success',
    disposition: 'ALIAS',
    aliasOf: 'q-success',
    kashfIntentId: 'completion.willComplete',
    kashfMethodId: 'completion.p173.fireRows15910',
    kashfRuntimeStatus: 'ready',
  }),

  'q-academic': route({
    questionId: 'q-academic',
    disposition: 'ALIAS',
    aliasOf: 'q-success',
    kashfIntentId: 'completion.willComplete',
    kashfMethodId: 'completion.p173.fireRows15910',
    kashfRuntimeStatus: 'ready',
  }),

  'q-spiritual-path': route({
    questionId: 'q-spiritual-path',
    disposition: 'ALIAS',
    aliasOf: 'q-success',
    kashfIntentId: 'completion.willComplete',
    kashfMethodId: 'completion.p173.fireRows15910',
    kashfRuntimeStatus: 'ready',
    note: 'Only when the intended question is whether the path/study will succeed; not a diagnosis of spiritual status.',
  }),

  'q-move-city': route({
    questionId: 'q-move-city',
    disposition: 'KEEP',
    kashfIntentId: 'relocation.placeToPlace',
    kashfMethodId: 'relocation.p183.h4h15',
    kashfRuntimeStatus: 'ready',
  }),

  'q-illness-heal': route({
    questionId: 'q-illness-heal',
    disposition: 'KEEP',
    kashfIntentId: 'illness.recovery',
    kashfMethodId: 'illness.p196.outcomeH15',
    kashfRuntimeStatus: 'ready',
  }),

  'q-illness-bodypart': route({
    questionId: 'q-illness-bodypart',
    disposition: 'KEEP',
    kashfIntentId: 'illness.bodyPart',
    kashfMethodId: 'illness.bodyPart.h6Figure',
    kashfRuntimeStatus: 'ready',
  }),

  'q-gender': route({
    questionId: 'q-gender',
    disposition: 'KEEP',
    kashfIntentId: 'pregnancy.gender',
    kashfMethodId: 'pregnancy.p191.genderH5',
    kashfRuntimeStatus: 'ready',
  }),

  'q-siblings': route({
    questionId: 'q-siblings',
    disposition: 'RENAME',
    kashfIntentId: 'siblings.relationship',
    kashfMethodId: 'siblings.p182.h1h3',
    kashfRuntimeStatus: 'ready',
    note: 'Source-safe scope is sibling relationship/condition; generic relatives/neighbors are not automatically covered.',
  }),

  'q-sibling-agreement': route({
    questionId: 'q-sibling-agreement',
    disposition: 'ALIAS',
    aliasOf: 'q-siblings',
    kashfIntentId: 'siblings.relationship',
    kashfMethodId: 'siblings.p182.h1h3',
    kashfRuntimeStatus: 'ready',
  }),

  'q-sibling-eldest': route({
    questionId: 'q-sibling-eldest',
    disposition: 'KEEP',
    kashfIntentId: 'siblings.seniority',
    kashfMethodId: 'siblings.p182.seniority',
    kashfRuntimeStatus: 'ready',
  }),

  'q-marriage-thayib': route({
    questionId: 'q-marriage-thayib',
    disposition: 'KEEP',
    kashfIntentId: 'marriage.previousStatus',
    kashfMethodId: 'marriage.p204.previousStatusH7',
    kashfRuntimeStatus: 'ready',
  }),

  'q-travel-safe': route({
    questionId: 'q-travel-safe',
    disposition: 'KEEP',
    kashfIntentId: 'travel.success',
    kashfMethodId: 'travel.p238.assemble1359',
    kashfRuntimeStatus: 'ready',
  }),

  'q-short-travel': route({
    questionId: 'q-short-travel',
    disposition: 'ALIAS',
    aliasOf: 'q-travel-safe',
    kashfIntentId: 'travel.success',
    kashfMethodId: 'travel.p238.assemble1359',
    kashfRuntimeStatus: 'ready',
  }),

  // ── AUDITED GENERAL / RELOCATION SLICE --------------------------------
  'q-general-state': route({
    questionId: 'q-general-state',
    disposition: 'KEEP',
    kashfIntentId: 'general.state',
    kashfMethodId: 'general.p174.h1h2h4h7h10h15',
    kashfRuntimeStatus: 'ready',
  }),

  'q-best-city': route({
    questionId: 'q-best-city',
    disposition: 'BLOCK',
    kashfIntentId: 'relocation.compareTwoCities',
    kashfMethodId: 'relocation.p183.compare12vs78',
    kashfRuntimeStatus: 'blocked-by-source',
    note: 'Exact source meaning of comparative strength must be closed before execution.',
  }),

  'q-move-home': route({
    questionId: 'q-move-home',
    disposition: 'KEEP',
    kashfIntentId: 'relocation.isThisPlaceGood',
    kashfMethodId: 'relocation.p183.currentVsNewPlace',
    kashfRuntimeStatus: 'ready',
  }),

  'q-stay-place': route({
    questionId: 'q-stay-place',
    disposition: 'KEEP',
    kashfIntentId: 'relocation.stayOrMove',
    kashfMethodId: 'relocation.p183.stayMoveH1H2',
    kashfRuntimeStatus: 'ready',
  }),

  'q-message': route({
    questionId: 'q-message',
    disposition: 'KEEP',
    kashfIntentId: 'messenger.outcome',
    kashfMethodId: 'messenger.p176.recast14511',
    kashfRuntimeStatus: 'ready',
  }),

  'q-news-arrive': route({
    questionId: 'q-news-arrive',
    disposition: 'ALIAS',
    aliasOf: 'q-message',
    kashfIntentId: 'messenger.outcome',
    kashfMethodId: 'messenger.p176.recast14511',
    kashfRuntimeStatus: 'ready',
    note: 'Alias only when the question means a message/news item arriving from a sender; generic future news remains outside this method.',
  }),

  'q-clothing-lucky': route({
    questionId: 'q-clothing-lucky',
    disposition: 'RENAME',
    kashfIntentId: 'clothing.luck',
    kashfMethodId: 'clothing.p264-265.luck',
    kashfRuntimeStatus: 'ready',
    note: 'Keep within the source clothing judgment; do not promise an unsourced universal lucky-color system.',
  }),

  'q-matter-end': route({
    questionId: 'q-matter-end',
    disposition: 'KEEP',
    kashfIntentId: 'matter.outcome',
    kashfMethodId: 'matter.p172.h17_h1011_thenCombine',
    kashfRuntimeStatus: 'ready',
  }),

  'q-celebrations': route({
    questionId: 'q-celebrations',
    disposition: 'KEEP',
    kashfIntentId: 'joy.occurrence',
    kashfMethodId: 'joy.p196.recast14511',
    kashfRuntimeStatus: 'ready',
  }),

  'q-joy-coming': route({
    questionId: 'q-joy-coming',
    disposition: 'ALIAS',
    aliasOf: 'q-celebrations',
    kashfIntentId: 'joy.occurrence',
    kashfMethodId: 'joy.p196.recast14511',
    kashfRuntimeStatus: 'ready',
  }),

  'q-gift': route({
    questionId: 'q-gift',
    disposition: 'BLOCK',
    kashfIntentId: 'gift.receive',
    kashfMethodId: 'gift.sourceInputUnclear',
    kashfRuntimeStatus: 'blocked-by-source',
    note: 'Gift polarity is stated, but the exact source input/house is not closed.',
  }),

  // ── AUDITED FAMILY + HEALTH SLICE -------------------------------------
  'q-pregnancy': route({
    questionId: 'q-pregnancy',
    disposition: 'KEEP',
    kashfIntentId: 'pregnancy.exists',
    kashfMethodId: 'pregnancy.p191.existsH5SilentEmpty',
    kashfRuntimeStatus: 'ready',
    note: 'Use silent/empty classification of H5. Never replace with benefic/malefic.',
  }),

  'q-miscarriage': route({
    questionId: 'q-miscarriage',
    disposition: 'BLOCK',
    kashfIntentId: 'pregnancy.miscarriageRisk',
    kashfMethodId: 'pregnancy.miscarriageRisk.unresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    note: 'p192-p193 contain several miscarriage/fetus-risk conditions. One canonical method has not yet been formally selected; no aggregation is allowed.',
  }),

  'q-birth-ease': route({
    questionId: 'q-birth-ease',
    disposition: 'KEEP',
    kashfIntentId: 'pregnancy.deliveryDifficulty',
    kashfMethodId: 'pregnancy.p191.deliveryDifficultyH1H5H15',
    kashfRuntimeStatus: 'ready',
  }),

  'q-child-health': route({
    questionId: 'q-child-health',
    disposition: 'RENAME',
    kashfIntentId: 'child.healthTrajectory',
    kashfMethodId: 'child.p194.healthTrajectoryH6H8',
    kashfRuntimeStatus: 'ready',
    note: 'Source scope is childhood pains and health trajectory as the child grows, not a generic current-illness recovery prognosis.',
  }),

  'q-child-survive': route({
    questionId: 'q-child-survive',
    disposition: 'KEEP',
    kashfIntentId: 'pregnancy.childSafety',
    kashfMethodId: 'pregnancy.p191.childSafetyH1H6H8',
    kashfRuntimeStatus: 'ready',
  }),

  'q-child-lifespan': route({
    questionId: 'q-child-lifespan',
    disposition: 'BLOCK',
    kashfIntentId: 'child.lifespan',
    kashfMethodId: 'child.lifespan.p195.provenanceUnresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    note: 'The child-lifespan paragraph sits adjacent to al-Zanati material on p195. Passage-level provenance must be closed before runtime use.',
  }),

  'q-lifespan': route({
    questionId: 'q-lifespan',
    disposition: 'RENAME',
    kashfIntentId: 'lifespan.duration',
    kashfMethodId: 'lifespan.p178.elementCountToHouse',
    kashfRuntimeStatus: 'ready',
    note: 'The canonical p178 method calculates lifespan duration; do not substitute p264 life-stage houses.',
  }),

  'q-lifespan-remaining': route({
    questionId: 'q-lifespan-remaining',
    disposition: 'ALIAS',
    aliasOf: 'q-lifespan',
    kashfIntentId: 'lifespan.duration',
    kashfMethodId: 'lifespan.p178.elementCountToHouse',
    kashfRuntimeStatus: 'ready',
  }),

  'q-lifespan-stages': route({
    questionId: 'q-lifespan-stages',
    disposition: 'KEEP',
    kashfIntentId: 'lifespan.stages',
    kashfMethodId: 'lifespan.p264.stagesH11H9H7',
    kashfRuntimeStatus: 'ready',
    note: 'Distinct intent: beginning/middle/end of life, not duration.',
  }),

  'q-mother': route({
    questionId: 'q-mother',
    disposition: 'KEEP',
    kashfIntentId: 'mother.status',
    kashfMethodId: 'mother.p257.statusDayNight',
    kashfRuntimeStatus: 'ready',
    note: 'Must preserve day/night distinction and angles+succedents vs cadents; current broad mother helper is not sufficient.',
  }),

  'q-lost-item': route({
    questionId: 'q-lost-item',
    disposition: 'KEEP',
    kashfIntentId: 'lostItem.return',
    kashfMethodId: 'lostItem.p202.returnH6H8',
    kashfRuntimeStatus: 'ready',
    note: 'H6+H8 must be benefic and internal for return. This route is for a lost object, not theft attribution.',
  }),

  'q-treasure': route({
    questionId: 'q-treasure',
    disposition: 'RENAME',
    kashfIntentId: 'hidden.isStillThere',
    kashfMethodId: 'hidden.p188.isStillThere',
    kashfRuntimeStatus: 'ready',
    note: 'Source-safe wording is whether a suspected hidden thing is still in the place; it does not prove the existence of an unspecified treasure from nothing.',
  }),

  'q-secrets': route({
    questionId: 'q-secrets',
    disposition: 'BLOCK',
    kashfIntentId: 'hidden.abstractSecret',
    kashfMethodId: 'hidden.abstractSecret.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'Audited hidden-object rules concern physical hidden things, not abstract secrets or unspoken truths.',
  }),

  'q-dowry': route({
    questionId: 'q-dowry',
    disposition: 'KEEP',
    kashfIntentId: 'marriage.dowryAmount',
    kashfMethodId: 'marriage.p204.dowryH8',
    kashfRuntimeStatus: 'ready',
  }),

  'q-dig-direction': route({
    questionId: 'q-dig-direction',
    disposition: 'KEEP',
    kashfIntentId: 'hidden.direction',
    kashfMethodId: 'hidden.p188.quarterDirection',
    kashfRuntimeStatus: 'ready',
    note: 'Requires a dedicated four-quarter casting flow; it cannot be inferred from the ordinary board.',
  }),

  'q-well-drilling': route({
    questionId: 'q-well-drilling',
    disposition: 'RENAME',
    kashfIntentId: 'well.result',
    kashfMethodId: 'well.p188.recast1468',
    kashfRuntimeStatus: 'ready',
    note: 'This canonical route answers whether the drilling/water objective is obtained. The current Question Bank wording also asks depth; depth is a separate intent and must be split rather than silently merged.',
  }),

  // ── AUDITED MONEY + ECONOMY SLICE -------------------------------------
  'q-money-state': route({
    questionId: 'q-money-state',
    disposition: 'KEEP',
    kashfIntentId: 'money.generalCondition',
    kashfMethodId: 'money.p180.elementComparison',
    kashfRuntimeStatus: 'repair-required',
    note: 'Current runtime mechanism is not source-equivalent: p180 requires two derived money figures and element comparison, not incoming/outgoing judgment.',
  }),

  'q-money-source': route({
    questionId: 'q-money-source',
    disposition: 'KEEP',
    kashfIntentId: 'money.source',
    kashfMethodId: 'money.p179.sourceByIncomingHonorHouse',
    kashfRuntimeStatus: 'ready',
  }),

  'q-livelihood': route({
    questionId: 'q-livelihood',
    disposition: 'KEEP',
    kashfIntentId: 'money.livelihood',
    kashfMethodId: 'money.p180.livelihoodH10Invert',
    kashfRuntimeStatus: 'ready',
  }),

  'q-livelihood-arrive': route({
    questionId: 'q-livelihood-arrive',
    disposition: 'KEEP',
    kashfIntentId: 'money.acquire',
    kashfMethodId: 'money.p181.recast25811',
    kashfRuntimeStatus: 'ready',
    note: 'Expected/specific income is a distinct intent from general livelihood condition.',
  }),

  'q-money-halal': route({
    questionId: 'q-money-halal',
    disposition: 'BLOCK',
    kashfIntentId: 'money.lawfulness',
    kashfMethodId: 'money.lawfulness.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'A fresh audit of p179-p182 did not locate an explicit body-source lawful/unlawful money method. Do not map this to an assumed H9+H11 rule without a source passage.',
  }),

  'q-inheritance': route({
    questionId: 'q-inheritance',
    disposition: 'RENAME',
    kashfIntentId: 'inheritance.whoInheritsWhom',
    kashfMethodId: 'inheritance.p180.elementComposite',
    kashfRuntimeStatus: 'ready',
    note: 'Source-safe scope: which side inherits the other. The method does not calculate shares, amounts, or whether there will be a dispute.',
  }),

  'q-loan': route({
    questionId: 'q-loan',
    disposition: 'EDUCATIONAL',
    kashfIntentId: 'loan.repayment',
    kashfMethodId: 'loan.external.p234.repayment',
    kashfRuntimeStatus: 'educational-only',
    note: 'The loan repayment method is inside the non-body block beginning at p228.',
  }),

  'q-loan-return': route({
    questionId: 'q-loan-return',
    disposition: 'ALIAS',
    aliasOf: 'q-loan',
    kashfIntentId: 'loan.repayment',
    kashfMethodId: 'loan.external.p234.repayment',
    kashfRuntimeStatus: 'educational-only',
  }),

  'q-loan-give': route({
    questionId: 'q-loan-give',
    disposition: 'EDUCATIONAL',
    kashfIntentId: 'loan.shouldGive',
    kashfMethodId: 'loan.external.p234.shouldGive',
    kashfRuntimeStatus: 'educational-only',
  }),

  'q-debts': route({
    questionId: 'q-debts',
    disposition: 'BLOCK',
    kashfIntentId: 'debt.outcome',
    kashfMethodId: 'debt.outcome.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'The broad old-debt question is not assigned a canonical body method. p179 financial-claim material is not generalized automatically.',
  }),

  'q-trade': route({
    questionId: 'q-trade',
    disposition: 'EDUCATIONAL',
    kashfIntentId: 'commerce.buySell',
    kashfMethodId: 'commerce.external.p218.buySell',
    kashfRuntimeStatus: 'educational-only',
    note: 'p218 buy/sell begins after an explicit ومن غير الكتاب marker.',
  }),

  'q-buy-sell': route({
    questionId: 'q-buy-sell',
    disposition: 'ALIAS',
    aliasOf: 'q-trade',
    kashfIntentId: 'commerce.buySell',
    kashfMethodId: 'commerce.external.p218.buySell',
    kashfRuntimeStatus: 'educational-only',
  }),

  'q-market-price': route({
    questionId: 'q-market-price',
    disposition: 'EDUCATIONAL',
    kashfIntentId: 'market.price',
    kashfMethodId: 'market.external.p218-223.price',
    kashfRuntimeStatus: 'educational-only',
    note: 'Dearness/cheapness material in this range belongs to non-body/Nuzhat additions.',
  }),

  'q-sell-property': route({
    questionId: 'q-sell-property',
    disposition: 'BLOCK',
    kashfIntentId: 'property.sale',
    kashfMethodId: 'property.sale.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'No audited body-source canonical method has been selected for sale of a specific property; do not fall back to p218 commerce.',
  }),

  'q-missing-money': route({
    questionId: 'q-missing-money',
    disposition: 'SPLIT',
    kashfIntentId: 'money.missingMixedScope',
    kashfMethodId: 'money.missingMixedScope.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'Current wording mixes physically lost money, theft, unpaid debt and investment. Split into distinct questions before routing.',
  }),

  // ── AUDITED LOVE + MARRIAGE SLICE -------------------------------------
  'q-marriage-fit': route({
    questionId: 'q-marriage-fit',
    disposition: 'KEEP',
    kashfIntentId: 'marriage.suitability',
    kashfMethodId: 'marriage.p210.generalMarriageH1H2H7H8H10Judge',
    kashfRuntimeStatus: 'ready',
    note: 'Fresh source review selects the dedicated p210 general-marriage judgment. Do not use the p206 H7+H11→H5 desire formula as a marriage-suitability test.',
  }),

  'q-marriage-chastity': route({
    questionId: 'q-marriage-chastity',
    disposition: 'RENAME',
    kashfIntentId: 'marriage.modesty',
    kashfMethodId: 'marriage.p205.modestyPurity',
    kashfRuntimeStatus: 'repair-required',
    note: 'Source question concerns modesty/chastity and explicit pure/impure classifications. Current wording also implies “past/loyalty”; do not overstate beyond the source.',
  }),

  'q-love': route({
    questionId: 'q-love',
    disposition: 'KEEP',
    kashfIntentId: 'love.doesPersonLoveMe',
    kashfMethodId: 'love.p205.directLoveH1PlacementH15',
    kashfRuntimeStatus: 'ready',
    note: 'Dedicated body-source p205 love question. Keep separate from p264 friendship/love material.',
  }),

  'q-love-desire': route({
    questionId: 'q-love-desire',
    disposition: 'ALIAS',
    aliasOf: 'q-love',
    kashfIntentId: 'love.doesPersonLoveMe',
    kashfMethodId: 'love.p205.directLoveH1PlacementH15',
    kashfRuntimeStatus: 'ready',
    note: 'Alias only after wording is made directional to match the source question “does this person love you?”.',
  }),

  'q-who-looks-love': route({
    questionId: 'q-who-looks-love',
    disposition: 'KEEP',
    kashfIntentId: 'love.attention',
    kashfMethodId: 'love.p204.attentionFireRows1713',
    kashfRuntimeStatus: 'ready',
    note: 'This is a distinct source intent: where the other person’s attention/look is directed, not whether love exists.',
  }),

  'q-divorce': route({
    questionId: 'q-divorce',
    disposition: 'KEEP',
    kashfIntentId: 'marriage.dissolution',
    kashfMethodId: 'marriage.p211.dissolutionH7StateMatrix',
    kashfRuntimeStatus: 'ready',
    note: 'Use the H7 quality × internal/external/fixed/mutable matrix; do not reduce divorce risk to simple benefic/malefic.',
  }),

  'q-adultery': route({
    questionId: 'q-adultery',
    disposition: 'BLOCK',
    kashfIntentId: 'marriage.adulterySigns',
    kashfMethodId: 'marriage.p207-208.adulterySignsUnresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    note: 'The source gives specific warning signs, but not a complete symmetric yes/no verdict for all figures. Partial signs must not become a universal accusation.',
  }),

  'q-woman-grace': route({
    questionId: 'q-woman-grace',
    disposition: 'RENAME',
    kashfIntentId: 'desire.querentWantsMatter',
    kashfMethodId: 'desire.p206.querentWantsH7H11ThenH5',
    kashfRuntimeStatus: 'ready',
    note: 'The p206 formula answers whether the querent wants the matter. It does not answer whether the woman will please the man or whether chemistry is mutual; the UI wording must be corrected before cutover.',
  }),

  // ── AUDITED TRAVEL + MISSING SLICE -----------------------------------
  'q-travel-timing': route({
    questionId: 'q-travel-timing',
    disposition: 'RENAME',
    kashfIntentId: 'travel.timeSelection',
    kashfMethodId: 'travel.p238.timeSelectionH9H4',
    kashfRuntimeStatus: 'repair-required',
    note: 'Source-safe wording is whether a proposed departure time is favorable. p238 does not calculate an arbitrary future date; the existing timing table also requires repair.',
  }),

  'q-travel-direction': route({
    questionId: 'q-travel-direction',
    disposition: 'EDUCATIONAL',
    kashfIntentId: 'travel.direction',
    kashfMethodId: 'travel.external.p246.directionNuzhat',
    kashfRuntimeStatus: 'educational-only',
    note: 'The explicit dominant-element direction method is attributed to Nuzhat al-Uqul. No body-source canonical direction method is selected for runtime.',
  }),

  'q-sea-or-land': route({
    questionId: 'q-sea-or-land',
    disposition: 'KEEP',
    kashfIntentId: 'travel.seaOrLand',
    kashfMethodId: 'travel.p239.seaOrLandByElement',
    kashfRuntimeStatus: 'ready',
  }),

  'q-travel-profit': route({
    questionId: 'q-travel-profit',
    disposition: 'KEEP',
    kashfIntentId: 'travel.profit',
    kashfMethodId: 'travel.p239.profitEarthRowH2',
    kashfRuntimeStatus: 'ready',
  }),

  'q-travel-danger': route({
    questionId: 'q-travel-danger',
    disposition: 'KEEP',
    kashfIntentId: 'travel.roadDanger',
    kashfMethodId: 'travel.p242.roadDangerH7Element',
    kashfRuntimeStatus: 'repair-required',
    note: 'The source method is clear, but the current generic element resolver must be verified before canonical execution.',
  }),

  'q-traveler-return': route({
    questionId: 'q-traveler-return',
    disposition: 'KEEP',
    kashfIntentId: 'travel.return',
    kashfMethodId: 'travel.p244.returnH1H2H9',
    kashfRuntimeStatus: 'ready',
  }),

  'q-missing-location': route({
    questionId: 'q-missing-location',
    disposition: 'BLOCK',
    kashfIntentId: 'missing.location',
    kashfMethodId: 'missing.p249.locationDirectionUnresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    note: 'The body source supports in-city/outside-city evidence, but the exact directional operation is not closed. Do not borrow the later Nuzhat fugitive-direction rule.',
  }),

  'q-missing-return': route({
    questionId: 'q-missing-return',
    disposition: 'RENAME',
    kashfIntentId: 'missing.return',
    kashfMethodId: 'missing.p249.returnAnglesJudge',
    kashfRuntimeStatus: 'ready',
    note: 'The selected body method answers whether the absent person returns. The current description also promises WHEN; timing must be removed or handled by a separate verified intent.',
  }),

  'q-fugitive': route({
    questionId: 'q-fugitive',
    disposition: 'EDUCATIONAL',
    kashfIntentId: 'fugitive.capture',
    kashfMethodId: 'fugitive.external.p250.nuzhat',
    kashfRuntimeStatus: 'educational-only',
  }),

  'q-lost-animal': route({
    questionId: 'q-lost-animal',
    disposition: 'ALIAS',
    aliasOf: 'q-lost-item',
    kashfIntentId: 'lostItem.return',
    kashfMethodId: 'lostItem.p202.returnH6H8',
    kashfRuntimeStatus: 'ready',
    note: 'p202 is a general lost-thing return rule and can cover a lost animal when the intent is simply whether it returns.',
  }),

  'q-two-trips': route({
    questionId: 'q-two-trips',
    disposition: 'EDUCATIONAL',
    kashfIntentId: 'travel.compareTwoTrips',
    kashfMethodId: 'travel.external.p247.compareTwoTrips',
    kashfRuntimeStatus: 'educational-only',
  }),

  // ── REPAIR REQUIRED: explicit hard stop until fixed -------------------
  'q-wish': route({
    questionId: 'q-wish',
    disposition: 'KEEP',
    kashfIntentId: 'hope.fulfillment',
    kashfMethodId: 'hope.p267.fulfillment',
    kashfRuntimeStatus: 'repair-required',
    note: 'Must route to the dedicated p267 hope method, not completion p173.',
  }),

  'q-dream': route({
    questionId: 'q-dream',
    disposition: 'KEEP',
    kashfIntentId: 'dream.meaning',
    kashfMethodId: 'dream.p254.h9AndTransit',
    kashfRuntimeStatus: 'repair-required',
  }),

  'q-dream-daily': route({
    questionId: 'q-dream-daily',
    disposition: 'ALIAS',
    aliasOf: 'q-dream',
    kashfIntentId: 'dream.meaning',
    kashfMethodId: 'dream.p254.h9AndTransit',
    kashfRuntimeStatus: 'repair-required',
  }),

  'q-dream-omen': route({
    questionId: 'q-dream-omen',
    disposition: 'ALIAS',
    aliasOf: 'q-dream',
    kashfIntentId: 'dream.meaning',
    kashfMethodId: 'dream.p254.h9AndTransit',
    kashfRuntimeStatus: 'repair-required',
  }),

  'q-friends': route({
    questionId: 'q-friends',
    disposition: 'RENAME',
    kashfIntentId: 'friends.relationship',
    kashfMethodId: 'friends.p263.h1h11',
    kashfRuntimeStatus: 'repair-required',
    note: 'Do not execute the current friendsHope bundle; Nuzhat need/hope material must be isolated first.',
  }),

  'q-stability': route({
    questionId: 'q-stability',
    disposition: 'KEEP',
    kashfIntentId: 'state.stability',
    kashfMethodId: 'state.p265.h1h2h9h15',
    kashfRuntimeStatus: 'repair-required',
  }),

  'q-missing-alive': route({
    questionId: 'q-missing-alive',
    disposition: 'KEEP',
    kashfIntentId: 'missing.aliveOrDead',
    kashfMethodId: 'missing.p248-249.lifeH1H4H9Outcome',
    kashfRuntimeStatus: 'ready',
    note: 'Provenance correction: the prior 3/5/9 recurrence method is in the later al-Multaqat addition. This route now points to the selected body-source life/death method from p248-p249.',
  }),

  'q-enemy-exists': route({
    questionId: 'q-enemy-exists',
    disposition: 'KEEP',
    kashfIntentId: 'enemy.presenceAndDominance',
    kashfMethodId: 'enemy.p271.h1vsH12',
    kashfRuntimeStatus: 'repair-required',
  }),

  'q-hidden-enemy': route({
    questionId: 'q-hidden-enemy',
    disposition: 'ALIAS',
    aliasOf: 'q-enemy-exists',
    kashfIntentId: 'enemy.presenceAndDominance',
    kashfMethodId: 'enemy.p271.h1vsH12',
    kashfRuntimeStatus: 'repair-required',
    note: 'The canonical method establishes enemy presence/dominance, not identity of a hidden enemy.',
  }),

  'q-enemy': route({
    questionId: 'q-enemy',
    disposition: 'RENAME',
    aliasOf: 'q-enemy-exists',
    kashfIntentId: 'enemy.presenceAndDominance',
    kashfMethodId: 'enemy.p271.h1vsH12',
    kashfRuntimeStatus: 'repair-required',
    note: 'Rename away from “who is the enemy”; p271 does not identify a named person.',
  }),

  // ── BLOCKED BY SOURCE --------------------------------------------------
  'q-sea-voyage': route({
    questionId: 'q-sea-voyage',
    disposition: 'BLOCK',
    kashfIntentId: 'travel.vehicleSafety',
    kashfMethodId: 'travel.p242.vehicleSafety',
    kashfRuntimeStatus: 'blocked-by-source',
  }),

  'q-prisoner': route({
    questionId: 'q-prisoner',
    disposition: 'RENAME',
    kashfIntentId: 'prisoner.releaseTiming',
    kashfMethodId: 'prisoner.releaseTiming.unresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    note: 'Current wording asks WHEN; selected body-source methods do not provide a canonical release-timing calculation.',
  }),

  // ── EDUCATIONAL ONLY ---------------------------------------------------
  'q-promise': route({
    questionId: 'q-promise',
    disposition: 'EDUCATIONAL',
    kashfIntentId: 'promise.fulfillment',
    kashfMethodId: 'promise.external.p255',
    kashfRuntimeStatus: 'educational-only',
  }),

  'q-yearly-forecast': route({
    questionId: 'q-yearly-forecast',
    disposition: 'EDUCATIONAL',
    kashfIntentId: 'yearly.forecast',
    kashfMethodId: 'yearly.external.p221-223',
    kashfRuntimeStatus: 'educational-only',
    note: 'Mapped yearly methods in this range belong to non-body/Nuzhat additions, so they remain learning-only by default.',
  }),

  'q-fear': route({
    questionId: 'q-fear',
    disposition: 'EDUCATIONAL',
    kashfIntentId: 'fear.general',
    kashfMethodId: 'fear.external.p274.h7h8',
    kashfRuntimeStatus: 'educational-only',
  }),

  // ── UNSUPPORTED IN KASHF ----------------------------------------------
  'q-sorcery': route({
    questionId: 'q-sorcery',
    disposition: 'BLOCK',
    kashfIntentId: 'spiritual.affectedBySorcery',
    kashfMethodId: 'spiritual.affectedBySorcery.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'p167 does not answer whether the querent is affected by sorcery/evil eye/jinn.',
  }),

  'q-sorcery-h10': route({
    questionId: 'q-sorcery-h10',
    disposition: 'ALIAS',
    aliasOf: 'q-sorcery',
    kashfIntentId: 'spiritual.affectedBySorcery',
    kashfMethodId: 'spiritual.affectedBySorcery.unsupported',
    kashfRuntimeStatus: 'unsupported',
  }),
});

export function getKashfQuestionRoute(questionId) {
  return KASHF_QUESTION_ROUTES[questionId] || null;
}

export function validateKashfQuestionRoutes(methodLookup) {
  const errors = [];

  for (const [key, entry] of Object.entries(KASHF_QUESTION_ROUTES)) {
    if (entry.questionId !== key) errors.push(`${key}: key must equal questionId`);
    if (!entry.kashfIntentId) errors.push(`${key}: kashfIntentId is required`);
    if (!entry.kashfMethodId) errors.push(`${key}: kashfMethodId is required`);

    if (typeof methodLookup === 'function') {
      const methodEntry = methodLookup(entry.kashfMethodId);
      if (!methodEntry) {
        errors.push(`${key}: unknown kashfMethodId ${entry.kashfMethodId}`);
      } else {
        if (methodEntry.kashfIntentId !== entry.kashfIntentId) {
          errors.push(`${key}: route intent ${entry.kashfIntentId} does not match method intent ${methodEntry.kashfIntentId}`);
        }
        if (methodEntry.kashfRuntimeStatus !== entry.kashfRuntimeStatus) {
          errors.push(`${key}: route status ${entry.kashfRuntimeStatus} does not match method status ${methodEntry.kashfRuntimeStatus}`);
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

export default {
  KASHF_QUESTION_ROUTES,
  getKashfQuestionRoute,
  validateKashfQuestionRoutes,
};
