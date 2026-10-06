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

  'q-matter-valid': route({
    questionId: 'q-matter-valid',
    disposition: 'KEEP',
    kashfIntentId: 'matter.isRightForQuerent',
    kashfMethodId: 'matter.p169.validityH6H8Planet',
    kashfRuntimeStatus: 'ready',
    note: 'Opened 2026-10-05 from printed p169. Distinct from q-success (completion.p173, outcome) — this answers suitability/rightness for the querent via H6+H8 and the planet-figure table, not whether the matter will succeed.',
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
    note: 'Exact p183 destination-quality route: H4+H15 only. Do not add the legacy H1+H15 alternative, H1/H2 stay-or-move, H1/H4 vs H7/H10, or two-city comparison as supporting votes.',
  }),

  'q-illness-heal': route({
    questionId: 'q-illness-heal',
    disposition: 'KEEP',
    kashfIntentId: 'illness.recovery',
    kashfMethodId: 'illness.p196.outcomeH15',
    kashfRuntimeStatus: 'ready',
    note: 'Exact p196 recovery route uses H15 only: benefic => recovery; malefic => illness prolonged; mixed => unresolved. H1 recurrence, sensory signs and p197+ illness methods are separate intents and do not vote.',
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
    note: 'Use only the p191 masculine/feminine classification of H5. The distinct p192-p195 gender procedures remain reference-only and never vote with this route.',
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
    kashfMethodId: 'marriage.p204.previousStatusH7inH10',
    kashfRuntimeStatus: 'ready',
    note: 'Source-safe p204 question is divorced vs virgin, and only when the H7 figure recurs in H10. The source does not provide widow as a third result in this rule.',
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
    note: 'Printed p183 benefic precondition and H1/H2 vs H7/H8 comparison are preserved, but the exact source meaning of comparative strength is not operationally defined; fail closed.',
  }),

  'q-move-home': route({
    questionId: 'q-move-home',
    disposition: 'KEEP',
    kashfIntentId: 'relocation.isThisPlaceGood',
    kashfMethodId: 'relocation.p183.currentVsNewPlace',
    kashfRuntimeStatus: 'ready',
    note: 'Exact p183 place-quality route: H1+H4 for current residence and H7+H10 for the move. No converse or ranking is invented when the source conditions do not decide.',
  }),

  'q-stay-place': route({
    questionId: 'q-stay-place',
    disposition: 'KEEP',
    kashfIntentId: 'relocation.stayOrMove',
    kashfMethodId: 'relocation.p183.stayMoveH1H2',
    kashfRuntimeStatus: 'ready',
    note: 'Exact repeated pp178/183 H1/H2 polarity rule only. The separate p184 multi-indicator passage is not aggregated or used as a fallback.',
  }),

  'q-message': route({
    questionId: 'q-message',
    disposition: 'RENAME',
    kashfIntentId: 'completion.willComplete',
    kashfMethodId: 'completion.p173.fireRows15910',
    kashfRuntimeStatus: 'ready',
    note: 'Apply printed p173 general completion to the concrete task carried by a messenger. This is an alternative general matter method, not the special p176 messengers recast; it does not decide letter or news arrival.',
  }),

  'q-news-arrive': route({
    questionId: 'q-news-arrive',
    disposition: 'BLOCK',
    kashfIntentId: 'news.arrival',
    kashfMethodId: 'news.arrival.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'Arrival of generic news is not the printed p176 outcome-of-messengers/request-fulfilled intent. No verified Kashf arrival method has been selected.',
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
    disposition: 'RENAME',
    kashfIntentId: 'completion.willComplete',
    kashfMethodId: 'completion.p173.fireRows15910',
    kashfRuntimeStatus: 'ready',
    note: 'Apply printed p173 general completion only to a concrete planned celebration/event. This does not execute the p196 joy recast or predict timing or generic good news.',
  }),

  'q-joy-coming': route({
    questionId: 'q-joy-coming',
    disposition: 'ALIAS',
    aliasOf: 'q-celebrations',
    kashfIntentId: 'completion.willComplete',
    kashfMethodId: 'completion.p173.fireRows15910',
    kashfRuntimeStatus: 'ready',
    note: 'Alias of concrete planned celebration completion under p173; excludes unspecified joy, generic news and overall improvement.',
  }),

  'q-gift': route({
    questionId: 'q-gift',
    disposition: 'RENAME',
    kashfIntentId: 'gift.quality',
    kashfMethodId: 'gift.p193.h5Quality',
    kashfRuntimeStatus: 'ready',
    note: 'Cross-passage p48 gift-house H5 plus p193 good/adverse gift sign. Only a specified gift and its quality; no arrival, giver identity, timing, or obligation.',
  }),

  // ── AUDITED FAMILY + HEALTH SLICE -------------------------------------
  'q-pregnancy': route({
    questionId: 'q-pregnancy',
    disposition: 'KEEP',
    kashfIntentId: 'pregnancy.exists',
    kashfMethodId: 'pregnancy.p191.existsH5SilentEmpty',
    kashfRuntimeStatus: 'ready',
    note: 'Use only the p191 silent/empty classification of H5. Do not aggregate p192/p193/p195 pregnancy-confirmation alternatives and never replace silent/empty with benefic/malefic.',
  }),

  'q-miscarriage': route({
    questionId: 'q-miscarriage',
    disposition: 'KEEP',
    kashfIntentId: 'pregnancy.miscarriageRisk',
    kashfMethodId: 'pregnancy.p191-192.miscarriageRedH7NakisH8',
    kashfRuntimeStatus: 'ready',
    note: 'Use only the explicit p191→p192 cross-page seam: Humra/Red in H7 together with Nakis/Shallow Head in H8 is the source miscarriage sign. Absence of the pair does not prove safety. Other p192-p193 risk clauses are not votes or fallbacks.',
  }),

  'q-birth-ease': route({
    questionId: 'q-birth-ease',
    disposition: 'KEEP',
    kashfIntentId: 'pregnancy.deliveryDifficulty',
    kashfMethodId: 'pregnancy.p191.deliveryDifficultyH1H5H15',
    kashfRuntimeStatus: 'ready',
    note: 'Use only the selected p191 H1/H5/H15 delivery method. The p194 H5-heavy/benefic statements are reference-only and do not vote with it.',
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
    note: 'Use only p191 H1 plus the separate severe H6+H8 condition. Maternal safety, miscarriage signs and p193 fetal-safety alternatives do not vote into this route.',
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
    kashfRuntimeStatus: 'blocked-by-source',
    note: 'p178 specifies the route but the figure-number-in-house lookup is not source-certified for execution. Do not substitute p264 life stages.',
  }),

  'q-lifespan-remaining': route({
    questionId: 'q-lifespan-remaining',
    disposition: 'ALIAS',
    aliasOf: 'q-lifespan',
    kashfIntentId: 'lifespan.duration',
    kashfMethodId: 'lifespan.p178.elementCountToHouse',
    kashfRuntimeStatus: 'blocked-by-source',
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
    note: 'Only the night White/Road placement branch executes with an explicit cast-period input; day/Venus and the “this house” clause remain unresolved.',
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
    note: 'Select only the printed p188 four-quarter cast. It requires a dedicated four-cast input flow and cannot be inferred from the ordinary board. The p185, p186, p187 and p190 location methods are separate alternatives and are never aggregated, voted or used as automatic fallbacks.',
  }),

  'q-well-drilling': route({
    questionId: 'q-well-drilling',
    disposition: 'RENAME',
    kashfIntentId: 'well.result',
    kashfMethodId: 'well.p188.recast1468',
    kashfRuntimeStatus: 'blocked-by-source',
    note: 'The p188 H1/H4/H6/H8 recast is explicit, but the derived H4+angles inward condition is unreachable under the current strict dakhil classification over all 65,536 source boards. Clarify source meaning before runtime. Water depth is a separate intent.',
  }),

  // ── AUDITED MONEY + ECONOMY SLICE -------------------------------------
  'q-money-state': route({
    questionId: 'q-money-state',
    disposition: 'KEEP',
    kashfIntentId: 'money.generalCondition',
    kashfMethodId: 'money.p182.h2h10Outlook',
    kashfRuntimeStatus: 'ready',
    note: 'Exact general money/livelihood route from printed p182: combine H2 with H10. The distinct p180 two-person element/amount comparison stays source-blocked and is not used as a generic money-state fallback.',
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
    kashfMethodId: 'money.p182.lawfulnessInclination',
    kashfRuntimeStatus: 'blocked-by-source',
    note: 'Printed p182 does contain the H9+H11 lawful/unlawful rule. Runtime remains blocked only because the source does not operationally define what it means for the resulting figure to “incline” to H9 or H11.',
  }),

  'q-inheritance': route({
    questionId: 'q-inheritance',
    disposition: 'RENAME',
    kashfIntentId: 'inheritance.whoInheritsWhom',
    kashfMethodId: 'inheritance.p180.elementComposite',
    kashfRuntimeStatus: 'blocked-by-source',
    note: 'The p180 final-figure selector for querent versus other party is not defined operationally; no executor is certified. The method does not calculate shares, amounts or disputes.',
  }),

  'q-loan': route({
    questionId: 'q-loan',
    disposition: 'BLOCK',
    kashfIntentId: 'loan.repayment',
    kashfMethodId: 'debt.p179.creditorDebtorWalking',
    kashfRuntimeStatus: 'blocked-by-source',
    note: 'The body-source p179 creditor/debtor procedure is the exact primary source boundary for this repayment question, but its walk-two/walk-three, hand, Farah and Bakr computations are unresolved. Fail closed; do not fall back to the external p234 method.',
  }),

  'q-loan-return': route({
    questionId: 'q-loan-return',
    disposition: 'ALIAS',
    aliasOf: 'q-loan',
    kashfIntentId: 'loan.repayment',
    kashfMethodId: 'debt.p179.creditorDebtorWalking',
    kashfRuntimeStatus: 'blocked-by-source',
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
    disposition: 'RENAME',
    kashfIntentId: 'completion.willComplete',
    kashfMethodId: 'completion.p173.fireRows15910',
    kashfRuntimeStatus: 'ready',
    note: 'Printed p173 general completion applies only to a concrete collection effort already underway. It does not execute p179 debt walking, decide amount/timing/payment mechanism, or diagnose the debtor.',
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
    disposition: 'RENAME',
    kashfIntentId: 'completion.willComplete',
    kashfMethodId: 'completion.p173.fireRows15910',
    kashfRuntimeStatus: 'ready',
    note: 'Printed p173 general completion applies only to a concrete sale effort already underway. It does not execute p218 commerce or decide buyer, price, timing, or terms.',
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
    kashfRuntimeStatus: 'ready',
    note: 'Repaired 2026-10-04: marriage.p205.modestyPurity now runs via computeMarriageChastityPurityP205. The method answers the SIGN of modesty/chastity/purity shown by the chart (H1, H7, H9, Mizan) per the printed p205-206 "وقيل" clauses — it is a character sign, not a factual finding about the candidate\'s actual past conduct or loyalty. question-bank.js desc was narrowed accordingly (2026-10-04) to remove the overstated "נאמנות ועבר" framing; that factual-history intent remains unanswered by this or any other Kashf method found.',
  }),

  'q-marriage-woman-quality': route({
    questionId: 'q-marriage-woman-quality',
    disposition: 'KEEP',
    kashfIntentId: 'marriage.womanQualitySign',
    kashfMethodId: 'marriage.p208.womanQualityH5H4',
    kashfRuntimeStatus: 'ready',
    note: 'Added 2026-10-05: wires the newly-opened marriage.p208.womanQualityH5H4 (H5 named-figure positive sign; H15/H4 named-figure poor-outcome sign, reported but not forced to positive:false) to a new, separately-scoped question. Same chapter and same named-cast precondition as q-marriage-chastity -- the form carries the identical required name + cast-confirmation fields. Kept separate from q-marriage-chastity (H1/H7/H9/Mizan purity signs, a different source passage) and from the still-blocked marriage.p207-208.adulterySignsUnresolved (an unrelated, unresolved "بيت التزويج" table on the facing pages) -- never merged or voted.',
  }),

  'q-love': route({
    questionId: 'q-love',
    disposition: 'KEEP',
    kashfIntentId: 'love.doesPersonLoveMe',
    kashfMethodId: 'love.p205.ascendantAndSoughtFifth',
    kashfRuntimeStatus: 'repair-required',
    note: 'Dedicated body-source p205 love question. Keep separate from p264 friendship/love material.',
  }),

  'q-love-desire': route({
    questionId: 'q-love-desire',
    disposition: 'ALIAS',
    aliasOf: 'q-love',
    kashfIntentId: 'love.doesPersonLoveMe',
    kashfMethodId: 'love.p205.ascendantAndSoughtFifth',
    kashfRuntimeStatus: 'repair-required',
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

  'q-attention-focus': route({
    questionId: 'q-attention-focus',
    disposition: 'KEEP',
    kashfIntentId: 'attention.mutualGaze',
    kashfMethodId: 'attention.p170.mutualGazeFireRows1713',
    kashfRuntimeStatus: 'ready',
    note: 'Opened 2026-10-05 from printed p170. Same H1/H7/H13 fire-row houses as q-who-looks-love (love.p204), but a separate source method with its own second branch; never merged or voted together.',
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
    disposition: 'KEEP',
    kashfIntentId: 'love.womanFindsFavor',
    kashfMethodId: 'love.p206.womanFavorH7H11ThenH5',
    kashfRuntimeStatus: 'ready',
    note: 'v57 p206 explicitly asks whether the woman will find favor in his eyes. This route is one-directional favor only; it must not be expanded into mutual chemistry, mutual attraction, or the neighboring querent-desire rule.',
  }),

  // ── AUDITED TRAVEL + MISSING SLICE -----------------------------------
  'q-travel-timing': route({
    questionId: 'q-travel-timing',
    disposition: 'RENAME',
    kashfIntentId: 'travel.timeSelection',
    kashfMethodId: 'travel.p236.timeSelectionH9H4',
    kashfRuntimeStatus: 'ready',
    note: 'Judges only a proposed departure time by the printed p236 H9/H1 named figures and pure-benefic H4; it does not derive a future calendar date.',
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
    kashfRuntimeStatus: 'blocked-by-source',
    note: 'Re-verified 2026-10-04 directly against the scan, not merged with the nearby profit blocker merely by page adjacency: "الشكل الخارج من الشكلين" (dual, definite) has no closer antecedent than the profit clause\'s own "تراب المنطقة"-derived figure and H2, which the text combines immediately before in the same unbroken passage (no new "نكتة" header between them; sourcePages corrected from 239 to the real location, printed p237). This is a grounded grammatical conclusion about the most likely antecedent, not final proof that the two blockers share one undecoded input — still blocked on that basis, not on page adjacency alone.',
  }),

  'q-travel-profit': route({
    questionId: 'q-travel-profit',
    disposition: 'KEEP',
    kashfIntentId: 'travel.profit',
    kashfMethodId: 'travel.p239.profitH7Witness',
    kashfRuntimeStatus: 'ready',
    note: 'Repaired 2026-10-04: re-verified against the printed scan p239 (PDF p241) and the p101-102 witness table. The route previously pointed to travel.p239.profitEarthRowH2 (its sourcePages corrected from 239 to the real location, printed p237), which remains blocked on an undefined "تراب المنطقة" input — that method is NOT closed by this change. This question now answers through the independent H7+witness rule instead, which is fully decodable from the printed text.',
  }),

  'q-travel-danger': route({
    questionId: 'q-travel-danger',
    disposition: 'KEEP',
    kashfIntentId: 'travel.roadDanger',
    kashfMethodId: 'travel.p240.roadCautionsH9H7',
    kashfRuntimeStatus: 'ready',
    note: 'Printed p240 H9 quality and H7 elemental cautions; no factual prediction that an event will occur.',
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
    disposition: 'RENAME',
    kashfIntentId: 'missing.departedCitySign',
    kashfMethodId: 'missing.p249.departedCityH7',
    kashfRuntimeStatus: 'ready',
    note: 'Only the source-explicit outgoing-benefic H7 sign of leaving town, and fixed-H7 sign of remaining in place. The direction/current location computation remains unresolved.',
  }),

  'q-missing-in-city': route({
    questionId: 'q-missing-in-city',
    disposition: 'KEEP',
    kashfIntentId: 'missing.currentlyInCity',
    kashfMethodId: 'missing.p249.inCitySignH1H4',
    kashfRuntimeStatus: 'ready',
    note: 'RE-POINTED 2026-10-05 (independent re-audit, flagged on review): originally wired to missing.p249.inCitySignAwtad (all four Awtad dakhil/kharij -> in-city/not-in-city), which has since been WITHDRAWN -- its grammar does not support an "all four must agree" collective condition (singular predicate against an explicitly plural, four-count named subject; see that method\'s own registry entry for the full finding). Re-pointed to missing.p249.inCitySignH1H4, the clause\'s own explicit alternate method ("ومن غيره"), which is grammatically sound and was promoted from supporting-condition to the sole primary method for this intent. Split out of the former missing.p249.locationDirectionUnresolved (see missing.p249.directionUnresolved for the still-blocked direction portion). Kept separate from q-missing-location (a different H7-based sign of having LEFT the city, not of CURRENTLY being in it) -- never merged or voted.',
  }),

  'q-missing-return': route({
    questionId: 'q-missing-return',
    disposition: 'RENAME',
    kashfIntentId: 'missing.return',
    kashfMethodId: 'missing.p249.returnAnglesJudge',
    kashfRuntimeStatus: 'ready',
    note: 'The selected body method answers whether the absent person returns. The current description also promises WHEN; timing must be removed or handled by a separate verified intent.',
  }),

  'q-missing-return-timing': route({
    questionId: 'q-missing-return-timing',
    disposition: 'KEEP',
    kashfIntentId: 'missing.returnTiming',
    kashfMethodId: 'missing.p249.returnTimingTariqH10H11',
    kashfRuntimeStatus: 'ready',
    note: 'Added 2026-10-05: wires the previously-unrouted missing.p249.returnTimingTariqH10H11 (opened the same round, registered ready/canonical-operational but left unwired as an explicit open product decision) to a new, separately-scoped question, resolving the gap q-missing-return\'s own note names. Deliberately NOT merged into q-missing-return itself -- that question answers IF the person returns via a different H1/H4/H7/H10+H15 rule (missing.p249.returnAnglesJudge) and the two methods are never voted or blended together. This question is intentionally narrow: it only exposes the two explicit source branches (H10=H11=Tariq same-day; H10=Tariq+H11=Ijtima within-the-hour) and gives no verdict, and no timing claim, for any other H10/H11 pairing -- the question-bank description says so explicitly and cross-references q-missing-return for the separate return-or-not question. CORRECTED 2026-10-05 (flagged on review): the source text is "اجتماع به" -- a MEETING/union with the absent person, not "his return" -- so the question-bank label/desc were rewritten to speak of a meeting/reunion only and explicitly deny that this determines his return home; see the method registry\'s own note for the exact wording fix and the re-confirmed reachability split (same-day branch reachable on 512/65536 real boards, within-the-hour branch confirmed unreachable on any real board, 0/65536).',
  }),

  'q-missing-arriving': route({
    questionId: 'q-missing-arriving',
    disposition: 'KEEP',
    kashfIntentId: 'missing.arrivalSign',
    kashfMethodId: 'missing.p249.arrivalSignH3H15',
    kashfRuntimeStatus: 'ready',
    note: 'Added 2026-10-05: wires the newly-opened missing.p249.arrivalSignH3H15 to a new, separately-scoped question. RE-AUDITED 2026-10-06 (3rd pass): withdrew an unproven H3+H15 combine, replaced with checking H3 and H15 EACH independently for dakhil (AND), by analogy to missing.p249.returnTimingTariqH10H11. RE-AUDITED AGAIN 2026-10-06 (4th pass, independent, flagged on review): that AND reading is ITSELF withdrawn -- the analogy does not transfer cleanly from a named-figure subject (Tariq) to this clause\'s abstract referent (قدومه, his arrival); see the method\'s own registry entry for the full grammatical finding. The method stays routed here but is now descriptive-only (positive always null) -- it reports H3/H15\'s classifications without asserting an unproven combining rule. This still resolves the referent that was previously flagged unresolved in missing.p249.lifeStatusH8H14\'s own notes, just without a verdict. Kept separate from q-missing-return (official return-or-not), q-missing-return-timing (meeting timing via H10/H11) and the aliveOrDead intent (H8+H14) -- four independent p248-249 signs, never merged or voted.',
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

  // ── AUDITED CAREER + AUTHORITY SLICE ----------------------------------
  'q-career-state': route({
    questionId: 'q-career-state',
    disposition: 'RENAME',
    aliasOf: 'q-stability',
    kashfIntentId: 'state.stability',
    kashfMethodId: 'state.p265.h1h2h9h15',
    kashfRuntimeStatus: 'ready',
    note: 'Only the source-defined positive sign of continuity in the present role, p265 first clause; no broad career diagnosis or negative verdict from absent signs.',
  }),

  'q-position-keep': route({
    questionId: 'q-position-keep',
    disposition: 'KEEP',
    kashfIntentId: 'authority.appointmentStays',
    kashfMethodId: 'authority.p257.appointmentH1H10Planet',
    kashfRuntimeStatus: 'ready',
    note: 'Dedicated p257 body-source question: does the appointment/authority remain? Uses H1+H10 and actual planetary attribution.',
  }),

  'q-career-duration': route({
    questionId: 'q-career-duration',
    disposition: 'RENAME',
    aliasOf: 'q-position-keep',
    kashfIntentId: 'authority.appointmentStays',
    kashfMethodId: 'authority.p257.appointmentH1H10Planet',
    kashfRuntimeStatus: 'ready',
    note: 'The source method answers whether the post continues or ends; it does not calculate how many months/years remain. Rename the UI accordingly.',
  }),

  'q-career-return': route({
    questionId: 'q-career-return',
    disposition: 'KEEP',
    kashfIntentId: 'career.returnToOffice',
    kashfMethodId: 'career.p266.returnToOffice',
    kashfRuntimeStatus: 'ready',
    note: 'Distinct body-source p266 intent for a person dismissed from service. Do not treat it as an alternative vote inside authorityState.',
  }),

  'q-profession': route({
    questionId: 'q-profession',
    disposition: 'RENAME',
    kashfIntentId: 'profession.type',
    kashfMethodId: 'profession.p254.h9Planet',
    kashfRuntimeStatus: 'ready',
    note: 'Source-safe wording concerns the craft/profession indicated by H9 planetary attribution. The current “best profession for me” wording should not imply a modern optimization system.',
  }),

  'q-ruler-status': route({
    questionId: 'q-ruler-status',
    disposition: 'RENAME',
    kashfIntentId: 'authority.rulerCondition',
    kashfMethodId: 'authority.p257.rulerConditionH7H10',
    kashfRuntimeStatus: 'ready',
    note: 'Keep only “what is the ruler/authority-holder condition?”. The current description also asks whether they remain in office, which is a separate appointment-stability intent.',
  }),

  'q-fame': route({
    questionId: 'q-fame',
    disposition: 'RENAME',
    kashfIntentId: 'authority.honorCondition',
    kashfMethodId: 'authority.p256.honorConditionH10Planet',
    kashfRuntimeStatus: 'ready',
    note: 'p256 judges the condition/strength of honor, rank and reputation by the planetary figure in H10. It does not directly promise “will I become famous?”. Rename to a source-safe honor/reputation condition question.',
  }),

  // ── AUDITED CONFLICT + THEFT SLICE -----------------------------------
  'q-theft-return': route({
    questionId: 'q-theft-return',
    disposition: 'KEEP',
    kashfIntentId: 'theft.recovery',
    kashfMethodId: 'theft.p224.recoveryH8',
    kashfRuntimeStatus: 'ready',
    note: 'Use only the body p224 H8 recovery rule; mixed figure remains unresolved. Do not mix with p202 lost-item return.',
  }),

  'q-thief-near': route({
    questionId: 'q-thief-near',
    disposition: 'RENAME',
    kashfIntentId: 'theft.thiefRelationship',
    kashfMethodId: 'theft.p224.relationshipH7Recurrence',
    kashfRuntimeStatus: 'ready',
    note: 'Source-safe scope is the thief’s relationship/connection indicated by the house where the H7 figure recurs. It is not a numeric distance meter.',
  }),

  'q-theft-who': route({
    questionId: 'q-theft-who',
    disposition: 'RENAME',
    kashfIntentId: 'theft.thiefDescription',
    kashfMethodId: 'theft.p225.thiefDescriptionH7',
    kashfRuntimeStatus: 'ready',
    note: 'Rename from “who stole?” to a source-safe descriptive profile of the thief. The method does not prove a named person’s identity and must not be used to accuse a specific suspect.',
  }),

  'q-dispute': route({
    questionId: 'q-dispute',
    disposition: 'RENAME',
    kashfIntentId: 'dispute.whoWinsH1Sign',
    kashfMethodId: 'dispute.p212.winnerH1',
    kashfRuntimeStatus: 'ready',
    note: 'Only the source-explicit H1 winner sign on p212; do not aggregate the H2/H8 clauses or the undefined strength comparison on p213.',
  }),

  'q-women-dispute': route({
    questionId: 'q-women-dispute',
    disposition: 'ALIAS',
    aliasOf: 'q-dispute',
    kashfIntentId: 'dispute.whoWinsH1Sign',
    kashfMethodId: 'dispute.p212.winnerH1',
    kashfRuntimeStatus: 'ready',
    note: 'Same bounded H1 p212 sign; no gender-specific calculation is printed here.',
  }),

  'q-reconciliation': route({
    questionId: 'q-reconciliation',
    disposition: 'KEEP',
    kashfIntentId: 'dispute.reconciliation',
    kashfMethodId: 'dispute.p212.reconciliationH1H7',
    kashfRuntimeStatus: 'ready',
  }),

  'q-compromise': route({
    questionId: 'q-compromise',
    disposition: 'ALIAS',
    aliasOf: 'q-reconciliation',
    kashfIntentId: 'dispute.reconciliation',
    kashfMethodId: 'dispute.p212.reconciliationH1H7',
    kashfRuntimeStatus: 'ready',
    note: 'Treat as the same reconciliation/settlement intent, not as a separate voting method.',
  }),

  'q-partnership': route({
    questionId: 'q-partnership',
    disposition: 'KEEP',
    kashfIntentId: 'partnership.goodOrBad',
    kashfMethodId: 'partnership.p212.compatibilityH1H7H5H7',
    kashfRuntimeStatus: 'ready',
    note: 'Opened 2026-10-04: printed p212\'s "تحكم للشريك" clause judges partnership compatibility from two generated figures (H1+H7, H5+H7), each on its own fortune. Agreeing branches (both benefic / both malefic) give a clear verdict; disagreement is left unresolved (no source tie-break). The separate 2-by-2 Jumla note on the same page (partnership.p212.operationUnresolved) remains independently blocked — see that method; it is not merged into this route.',
  }),

  'q-war': route({
    questionId: 'q-war',
    disposition: 'EDUCATIONAL',
    kashfIntentId: 'war.outcome',
    kashfMethodId: 'war.external.p213-217.nonBody',
    kashfRuntimeStatus: 'educational-only',
    note: 'The audited war/city rules follow the explicit ومن غير الكتاب marker and remain knowledge-only by default.',
  }),

  'q-fear-punishment': route({
    questionId: 'q-fear-punishment',
    disposition: 'KEEP',
    kashfIntentId: 'fear.punishment',
    kashfMethodId: 'fear.p273.punishmentSigns',
    kashfRuntimeStatus: 'ready',
    note: 'Use only the p273 one-way no-fear condition, including Ahyan in H1 or H12. Failure is not evidence that punishment occurs.',
  }),

  'q-prisoner-guilty': route({
    questionId: 'q-prisoner-guilty',
    disposition: 'BLOCK',
    kashfIntentId: 'prisoner.causeOfImprisonment',
    kashfMethodId: 'prisoner.causeOfImprisonment.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'The body prisoner rules do not identify who caused the imprisonment. Do not infer culpability from general house meanings.',
  }),

  'q-victory-goal': route({
    questionId: 'q-victory-goal',
    disposition: 'SPLIT',
    kashfIntentId: 'conflict.victoryGoalMixedScope',
    kashfMethodId: 'conflict.victoryGoalMixedScope.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'Split opponent-victory from personal-goal fulfillment. The former belongs to dispute.whoWins; the latter to hope.fulfillment.',
  }),

  'q-who-looks-biz': route({
    questionId: 'q-who-looks-biz',
    disposition: 'BLOCK',
    kashfIntentId: 'business.otherPartyAttention',
    kashfMethodId: 'business.attention.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'No body-source business-attention method selected. Do not reuse the p204 love-attention formula for commerce.',
  }),

  // ── AUDITED SPIRITUAL + MISC SLICE ----------------------------------
  'q-hidden-action': route({
    questionId: 'q-hidden-action',
    disposition: 'KEEP',
    kashfIntentId: 'spiritual.hiddenAction',
    kashfMethodId: 'spiritual.p167.hiddenActionAirRows46815',
    kashfRuntimeStatus: 'ready',
    note: 'Use only the p167 question whether an action is behind the querent (هل ورائي عمل). This route does not diagnose sorcery, jinn or evil eye.',
  }),

  'q-religion': route({
    questionId: 'q-religion',
    disposition: 'RENAME',
    kashfIntentId: 'religion.religiosity',
    kashfMethodId: 'religion.p253.h3h9Quality',
    kashfRuntimeStatus: 'ready',
    note: 'Source-safe wording is the person’s religiosity/righteousness condition. p253 does not answer broad theology, practice advice or spiritual-study questions.',
  }),

  'q-jinn-type': route({
    questionId: 'q-jinn-type',
    disposition: 'BLOCK',
    kashfIntentId: 'spiritual.jinnType',
    kashfMethodId: 'spiritual.jinnType.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'No audited Kashf body method classifies jinn vs eye vs human sorcery.',
  }),

  'q-sorcerer': route({
    questionId: 'q-sorcerer',
    disposition: 'BLOCK',
    kashfIntentId: 'spiritual.sorcererIdentity',
    kashfMethodId: 'spiritual.sorcererIdentity.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'Re-checked 2026-10-04: the UI question ("מי הוא המכשף / המאחז?", question-bank.js) asks to IDENTIFY an unknown third-party perpetrator from the victim\'s side. The only p167 rule found (spiritual.p167.querentCastsSorceryMizan, now ready) answers the OPPOSITE direction — whether the QUERENT is casting sorcery on someone else — and must not be routed here; doing so would answer a different, inverted question. Do not turn p167 into an identity-finding method.',
  }),

  'q-obsession': route({
    questionId: 'q-obsession',
    disposition: 'BLOCK',
    kashfIntentId: 'spiritual.obsessionCause',
    kashfMethodId: 'spiritual.obsessionCause.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'No source-safe Kashf method distinguishes spiritual from psychological causes of anxiety/intrusive thoughts.',
  }),

  'q-security-h8': route({
    questionId: 'q-security-h8',
    disposition: 'EDUCATIONAL',
    kashfIntentId: 'security.general',
    kashfMethodId: 'security.external.p235.h8',
    kashfRuntimeStatus: 'educational-only',
    note: 'The mapped H8 security/fear material is explicitly from the added al-Multaqat/collected point-lore layer.',
  }),

  'q-slander': route({
    questionId: 'q-slander',
    disposition: 'BLOCK',
    kashfIntentId: 'social.slander',
    kashfMethodId: 'social.slander.unsupported',
    kashfRuntimeStatus: 'unsupported',
  }),

  'q-two-faced': route({
    questionId: 'q-two-faced',
    disposition: 'BLOCK',
    kashfIntentId: 'social.twoFaced',
    kashfMethodId: 'social.twoFaced.unsupported',
    kashfRuntimeStatus: 'unsupported',
  }),

  'q-wronged': route({
    questionId: 'q-wronged',
    disposition: 'BLOCK',
    kashfIntentId: 'wronged.status',
    kashfMethodId: 'wronged.status.unsupported',
    kashfRuntimeStatus: 'unsupported',
  }),

  'q-isolation': route({
    questionId: 'q-isolation',
    disposition: 'BLOCK',
    kashfIntentId: 'isolation.status',
    kashfMethodId: 'isolation.status.unsupported',
    kashfRuntimeStatus: 'unsupported',
  }),

  // ── FINAL AUDITED QUESTION-BANK COVERAGE SLICE -----------------------
  'q-agriculture': route({
    questionId: 'q-agriculture',
    disposition: 'RENAME',
    kashfIntentId: 'property.landOwnershipSign',
    kashfMethodId: 'property.p184.landOwnershipH4',
    kashfRuntimeStatus: 'ready',
    note: 'Retain only the land-ownership aspect of the existing mixed agriculture/land question. Crop yield and irrigation are separate intents, not decided here.',
  }),

  'q-father': route({
    questionId: 'q-father',
    disposition: 'RENAME',
    kashfIntentId: 'family.fatherMoneySign',
    kashfMethodId: 'family.p184.fatherMoneyH5',
    kashfRuntimeStatus: 'ready',
    note: 'Narrow existing mixed father/house/land question to the explicit father-money H5 clause of p184. No health, lifespan, property title or land judgment.',
  }),

  'q-geo-direction': route({
    questionId: 'q-geo-direction',
    disposition: 'BLOCK',
    kashfIntentId: 'direction.generic',
    kashfMethodId: 'direction.generic.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'No single generic direction method covers every intent; direction must remain method/domain specific.',
  }),

  'q-helpers': route({
    questionId: 'q-helpers',
    disposition: 'BLOCK',
    kashfIntentId: 'helpers.findHelp',
    kashfMethodId: 'helpers.generic.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'Do not generalize servant/service material into a universal helper-finding verdict.',
  }),

  'q-illness-cause': route({
    questionId: 'q-illness-cause',
    disposition: 'BLOCK',
    kashfIntentId: 'illness.causeMixedScope',
    kashfMethodId: 'illness.causeMixedScope.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'The source humor rule is not a physical/emotional/environmental diagnostic classifier.',
  }),

  'q-illness-type': route({
    questionId: 'q-illness-type',
    disposition: 'KEEP',
    kashfIntentId: 'illness.humor',
    kashfMethodId: 'illness.p197.h1h8ElementHumor',
    kashfRuntimeStatus: 'ready',
    note: 'Use the p197 H1+H8 elemental/humoral classification only. It does not itself prescribe treatment.',
  }),

  'q-lose-fortune': route({
    questionId: 'q-lose-fortune',
    disposition: 'BLOCK',
    kashfIntentId: 'money.loseFortune',
    kashfMethodId: 'money.loseFortune.unsupported',
    kashfRuntimeStatus: 'unsupported',
  }),

  'q-nativity': route({
    questionId: 'q-nativity',
    disposition: 'BLOCK',
    kashfIntentId: 'nativity.birthDate',
    kashfMethodId: 'nativity.birthDate.unsupported',
    kashfRuntimeStatus: 'unsupported',
  }),

  'q-neighbor': route({
    questionId: 'q-neighbor',
    disposition: 'BLOCK',
    kashfIntentId: 'social.neighborState',
    kashfMethodId: 'social.neighbor.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'Do not reuse the p182 sibling method for a neighbor.',
  }),

  'q-official-docs': route({
    questionId: 'q-official-docs',
    disposition: 'BLOCK',
    kashfIntentId: 'authority.officialDocs',
    kashfMethodId: 'authority.officialDocs.unsupported',
    kashfRuntimeStatus: 'unsupported',
  }),

  'q-past-events': route({
    questionId: 'q-past-events',
    disposition: 'BLOCK',
    kashfIntentId: 'general.pastEvents',
    kashfMethodId: 'general.pastEvents.unsupported',
    kashfRuntimeStatus: 'unsupported',
  }),

  'q-relative-state': route({
    questionId: 'q-relative-state',
    disposition: 'BLOCK',
    kashfIntentId: 'family.relativeState',
    kashfMethodId: 'family.relativeState.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'Do not expand the siblings method to arbitrary relatives/in-laws.',
  }),

  'q-separation': route({
    questionId: 'q-separation',
    disposition: 'SPLIT',
    kashfIntentId: 'separation.mixedScope',
    kashfMethodId: 'separation.mixedScope.unsupported',
    kashfRuntimeStatus: 'unsupported',
    note: 'Split person/relationship separation from place/relocation; no universal separation method.',
  }),

  'q-separation-loved': route({
    questionId: 'q-separation-loved',
    disposition: 'BLOCK',
    kashfIntentId: 'separation.lovedPerson',
    kashfMethodId: 'separation.loved.unsupported',
    kashfRuntimeStatus: 'unsupported',
  }),

  'q-stalled': route({
    questionId: 'q-stalled',
    disposition: 'BLOCK',
    kashfIntentId: 'stalled.cause',
    kashfMethodId: 'stalled.cause.unsupported',
    kashfRuntimeStatus: 'unsupported',
  }),

  'q-stranger-desc': route({
    questionId: 'q-stranger-desc',
    disposition: 'BLOCK',
    kashfIntentId: 'stranger.description',
    kashfMethodId: 'stranger.description.unresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    note: 'Figure descriptions exist, but the operational selector for an arbitrary stranger is not source-closed.',
  }),

  // ── REPAIR REQUIRED: explicit hard stop until fixed -------------------
  'q-wish': route({
    questionId: 'q-wish',
    disposition: 'KEEP',
    kashfIntentId: 'hope.fulfillment',
    kashfMethodId: 'hope.p267.fulfillment',
    kashfRuntimeStatus: 'ready',
    note: 'Dedicated p267 House 11 fallback only. Compound conditions and request-nature matching remain unimplemented; no p173 completion substitution.',
  }),

  'q-need-fulfillment': route({
    questionId: 'q-need-fulfillment',
    disposition: 'KEEP',
    kashfIntentId: 'need.fulfillment',
    kashfMethodId: 'need.p169.fulfillmentH1Fortune',
    kashfRuntimeStatus: 'ready',
    note: 'Opened 2026-10-05 from printed p169, split out of the formerly-bundled need.p169-170.outcomeRules. Distinct source page/intent from q-wish (hope.p267, House 11) — never merged or voted together.',
  }),

  'q-hope-p174': route({
    questionId: 'q-hope-p174',
    disposition: 'KEEP',
    kashfIntentId: 'hope.fulfillmentP174',
    kashfMethodId: 'hope.p174.h5h11ThroughH1',
    kashfRuntimeStatus: 'ready',
    note: 'Independent printed p174 hope calculation through two intermediates. Do not combine its verdict with the p267 House 11 fallback.',
  }),

  'q-request-p176': route({
    questionId: 'q-request-p176',
    disposition: 'KEEP',
    kashfIntentId: 'request.fulfillmentAndEnd',
    kashfMethodId: 'request.p176.h1h2GateThenH1H4',
    kashfRuntimeStatus: 'ready',
    note: 'Printed p176 request gate H1/H2 followed by outcome H1+H4. Independent from hope p174/p267 and general completion p173.',
  }),

  'q-person-purpose-p176': route({
    questionId: 'q-person-purpose-p176',
    disposition: 'KEEP',
    kashfIntentId: 'person.intent',
    kashfMethodId: 'intent.p176.h7h10',
    kashfRuntimeStatus: 'ready',
    note: 'Printed p176 purpose sign from H7+H10; no claim about character, honesty, secret thoughts or Gate-4 Dhamir.',
  }),

  'q-dream': route({
    questionId: 'q-dream',
    disposition: 'KEEP',
    kashfIntentId: 'dream.meaning',
    kashfMethodId: 'dream.p254.h9AndTransit',
    kashfRuntimeStatus: 'ready',
    note: 'Source-bounded p254 H9 good/adverse sign and same-figure occurrences, not interpretation of dream imagery.',
  }),

  'q-dream-daily': route({
    questionId: 'q-dream-daily',
    disposition: 'ALIAS',
    aliasOf: 'q-dream',
    kashfIntentId: 'dream.meaning',
    kashfMethodId: 'dream.p254.h9AndTransit',
    kashfRuntimeStatus: 'ready',
    note: 'Alias of p254 dream omen; the printed rule does not split daily and prophetic dreams into distinct methods.',
  }),

  'q-dream-omen': route({
    questionId: 'q-dream-omen',
    disposition: 'ALIAS',
    aliasOf: 'q-dream',
    kashfIntentId: 'dream.meaning',
    kashfMethodId: 'dream.p254.h9AndTransit',
    kashfRuntimeStatus: 'ready',
  }),

  'q-friends': route({
    questionId: 'q-friends',
    disposition: 'RENAME',
    kashfIntentId: 'friends.relationship',
    kashfMethodId: 'friends.p263.h1h11',
    kashfRuntimeStatus: 'ready',
    note: 'Only p263 H1/H11 pair and derived figure; not an assertion of honesty or access to a person’s private intentions.',
  }),

  'q-stability': route({
    questionId: 'q-stability',
    disposition: 'KEEP',
    kashfIntentId: 'state.stability',
    kashfMethodId: 'state.p265.h1h2h9h15',
    kashfRuntimeStatus: 'ready',
    note: 'Only p265 first clause: H1 pure benefic recurring in a fortunate house and H15. The other p265 clause and negative inference remain unresolved.',
  }),

  'q-missing-alive': route({
    questionId: 'q-missing-alive',
    disposition: 'KEEP',
    kashfIntentId: 'missing.aliveOrDead',
    kashfMethodId: 'missing.p248-249.lifeH1H4H9Outcome',
    kashfRuntimeStatus: 'ready',
    note: 'Original-scan re-audit: the selected body-source life/death rule is on printed pp248-249. The prior 3/5/9 recurrence method is in the later al-Multaqat addition. Keep this route isolated from the separate return rule on p249 and from neighboring death-sign lists.',
  }),

  'q-enemy-exists': route({
    questionId: 'q-enemy-exists',
    disposition: 'KEEP',
    kashfIntentId: 'enemy.presenceAndDominance',
    kashfMethodId: 'enemy.p271.h1vsH12',
    kashfRuntimeStatus: 'ready',
  }),

  'q-hidden-enemy': route({
    questionId: 'q-hidden-enemy',
    disposition: 'ALIAS',
    aliasOf: 'q-enemy-exists',
    kashfIntentId: 'enemy.presenceAndDominance',
    kashfMethodId: 'enemy.p271.h1vsH12',
    kashfRuntimeStatus: 'ready',
    note: 'Alias for the H1/H12 enemy presence/dominance question; it does not establish secrecy or identity.',
  }),

  'q-enemy': route({
    questionId: 'q-enemy',
    disposition: 'RENAME',
    aliasOf: 'q-enemy-exists',
    kashfIntentId: 'enemy.presenceAndDominance',
    kashfMethodId: 'enemy.p271.h1vsH12',
    kashfRuntimeStatus: 'ready',
    note: 'Rename away from “who is the enemy”; p271 does not identify a named person.',
  }),

  // ── BLOCKED BY SOURCE --------------------------------------------------
  'q-sea-voyage': route({
    questionId: 'q-sea-voyage',
    disposition: 'RENAME',
    kashfIntentId: 'travel.vesselCondition',
    kashfMethodId: 'travel.p243-244.vesselH1Signs',
    kashfRuntimeStatus: 'ready',
    note: 'Use the separate printed p241-242 H1 vessel signs (legacy method ID retains p243-244), not the contradictory H12 recurrence on printed p240. Only named figures are judged; repairable defects are not shipwreck or a factual safety certificate.',
  }),

  'q-prisoner': route({
    questionId: 'q-prisoner',
    disposition: 'RENAME',
    kashfIntentId: 'prisoner.rapidExitSign',
    kashfMethodId: 'prisoner.p272-273.rapidExitH11WithH5Caution',
    kashfRuntimeStatus: 'ready',
    note: 'Scope is the p272 sign of rapid release and the p273 H5 caution. Neither gives a calendar date; conflicting signs stay unresolved.',
  }),

  'q-prisoner-outcome': route({
    questionId: 'q-prisoner-outcome',
    disposition: 'KEEP',
    kashfIntentId: 'prisoner.outcomeFate',
    kashfMethodId: 'prisoner.p272.outcomeH1H4',
    kashfRuntimeStatus: 'ready',
    note: 'Added 2026-10-05: new, narrowly-scoped question wiring the newly-opened prisoner.p272.outcomeH1H4 (H1+H4 combine, saad/nahs -> good/bad outcome). Deliberately separate from q-prisoner (exit speed, H11/H5) and q-prisoner-guilty (blocked, culpability) -- this question answers neither of those, only the prisoner\'s general eventual outcome. No release timing or manner is given.',
  }),

  'q-prisoner-exit-safety': route({
    questionId: 'q-prisoner-exit-safety',
    disposition: 'KEEP',
    kashfIntentId: 'prisoner.exitSafety',
    kashfMethodId: 'prisoner.p272.exitSafetyH12',
    kashfRuntimeStatus: 'ready',
    note: 'Added 2026-10-05: new, narrowly-scoped question wiring the newly-opened prisoner.p272.exitSafetyH12 (H12 benefic -> safe exit, positive-only). Kept separate from q-prisoner and q-prisoner-outcome -- a different house, a different specific claim (safety of the exit, not its speed or the prisoner\'s ultimate fate).',
  }),

  'q-prisoner-release-manner': route({
    questionId: 'q-prisoner-release-manner',
    disposition: 'KEEP',
    kashfIntentId: 'prisoner.releaseManner',
    kashfMethodId: 'prisoner.p272.releaseManner',
    kashfRuntimeStatus: 'ready',
    note: 'Added 2026-10-05, same round as the corrected prisoner.p272.releaseManner citation: new, narrowly-scoped descriptive-only question (positive always null) for the voluntary/involuntary exit-manner sign via H2/H3/H5/H9/H10. Kept separate from q-prisoner (exit speed), q-prisoner-outcome (ultimate fate) and q-prisoner-exit-safety (H12 safety sign) -- four independent p272/273 signs, never merged or voted.',
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
    note: 'Re-checked 2026-10-04: the p167 "هل ورائي عمل" rule is a GENERIC hidden-action diagnostic, already correctly implemented separately as q-hidden-action (spiritual.p167.hiddenActionAirRows46815) — its own boundary note explicitly says it does not identify sorcery, jinn or evil eye. Do not relabel it as sorcery-specific here; no dedicated sorcery-affected rule exists in the pages read so far.',
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
