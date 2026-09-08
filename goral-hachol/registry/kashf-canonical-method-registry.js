/**
 * kashf-canonical-method-registry.js
 *
 * P0 source-of-truth for Kashf source-specific intents and their ONE
 * canonical operational method.
 *
 * IMPORTANT:
 * - Hall of Wisdom generic `intentId` lives elsewhere (prediction,
 *   timingRequest, ...). This file uses `kashfIntentId` only.
 * - `runtimeAllowed:false` is a hard stop. Callers must never silently fall
 *   back to topic-level execution.
 * - `kashfRuntimeStatus` describes source/method readiness; `executorStatus`
 *   independently describes whether the new canonical runtime can execute it.
 * - Educational / external methods may remain available to the knowledge
 *   layer but must never feed a live Kashf verdict.
 */

export const KASHF_RUNTIME_STATUSES = Object.freeze([
  'ready',
  'repair-required',
  'blocked-by-source',
  'educational-only',
  'unsupported',
]);

export const KASHF_METHOD_ROLES = Object.freeze([
  'canonical-operational',
  'supporting-condition',
  'educational-only',
  'external-tradition',
  'unresolved',
]);

export const KASHF_EXECUTOR_STATUSES = Object.freeze([
  'ready',
  'pending',
  'not-applicable',
]);

const method = ({
  kashfMethodId,
  kashfIntentId,
  topicId = null,
  sourcePages = [],
  sourceLayer = 'body',
  attributedSourceBook = 'Kashf',
  sourceConfidence = 'confirmed',
  methodRole = 'canonical-operational',
  kashfRuntimeStatus,
  runtimeAllowed,
  executionKind = null,
  executorStatus = executionKind ? 'pending' : 'not-applicable',
  legacyTopicId = null,
  legacyFormulaSlot = null,
  notes = null,
}) => Object.freeze({
  kashfMethodId,
  kashfIntentId,
  topicId,
  methodRole,
  kashfRuntimeStatus,
  runtimeAllowed: runtimeAllowed === true,
  sourceVolume: 'kashf',
  sourcePages: Object.freeze([...sourcePages]),
  sourceLayer,
  attributedSourceBook,
  sourceConfidence,
  executionKind,
  executorStatus,
  legacyTopicId,
  legacyFormulaSlot,
  notes,
});

/**
 * Canonical-method registry.
 *
 * A method may be source-ready while its new canonical executor is still
 * pending. Only records with runtimeAllowed=true AND executorStatus=ready may
 * execute. This prevents source confidence from being confused with code
 * readiness.
 */
export const KASHF_CANONICAL_METHODS = Object.freeze({
  // ── READY + EXECUTOR READY pilot slice --------------------------------
  'completion.p173.fireRows15910': method({
    kashfMethodId: 'completion.p173.fireRows15910',
    kashfIntentId: 'completion.willComplete',
    topicId: 'completion',
    sourcePages: [173],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'formula',
    executorStatus: 'ready',
    legacyTopicId: 'completion',
    legacyFormulaSlot: 'primaryFormula',
    notes: 'Canonical p173 method. Legacy alt 1+16 is not part of this verdict.',
  }),

  'relocation.p183.h4h15': method({
    kashfMethodId: 'relocation.p183.h4h15',
    kashfIntentId: 'relocation.placeToPlace',
    topicId: 'relocation',
    sourcePages: [183],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'formula',
    executorStatus: 'ready',
    legacyTopicId: 'relocation',
    legacyFormulaSlot: 'primaryFormula',
  }),

  'siblings.p182.h1h3': method({
    kashfMethodId: 'siblings.p182.h1h3',
    kashfIntentId: 'siblings.relationship',
    topicId: 'siblings',
    sourcePages: [182],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'formula',
    executorStatus: 'ready',
    legacyTopicId: 'siblings',
    legacyFormulaSlot: 'primaryFormula',
  }),

  'travel.p238.assemble1359': method({
    kashfMethodId: 'travel.p238.assemble1359',
    kashfIntentId: 'travel.success',
    topicId: 'travel',
    sourcePages: [238],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'formula',
    executorStatus: 'ready',
    legacyTopicId: 'travel',
    legacyFormulaSlot: 'primaryFormula',
  }),

  // ── SOURCE READY; CANONICAL EXECUTOR PENDING ---------------------------
  'general.p174.h1h2h4h7h10h15': method({
    kashfMethodId: 'general.p174.h1h2h4h7h10h15',
    kashfIntentId: 'general.state',
    topicId: 'generalReading',
    sourcePages: [174],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    legacyTopicId: 'generalReading',
    notes: 'Canonical p174 general-state executor is wired. It reads only H1,H2,H4,H7,H10,H15 separately according to their explicit v57 roles. It does not execute the broad legacy generalReading bundle, does not average or majority-vote the six houses, and does not collapse them into one yes/no verdict. Each house exposes its figure and canonical fortune class for a bounded general-state reading.',
  }),

  'messenger.p176.recast14511': method({
    kashfMethodId: 'messenger.p176.recast14511',
    kashfIntentId: 'messenger.outcome',
    topicId: 'siblings',
    sourcePages: [176],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'recast-board',
    executorStatus: 'pending',
    notes: 'Houses 1,4,5,11 become new mothers; complete a new board and judge the method-specific houses.',
  }),

  'clothing.p264-265.luck': method({
    kashfMethodId: 'clothing.p264-265.luck',
    kashfIntentId: 'clothing.luck',
    topicId: 'generalReading',
    sourcePages: [264, 265],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    legacyTopicId: 'generalReading',
    notes: 'Canonical clothing-luck executor is wired from v57 pp264-265 using only the explicit fortune clauses: H5+H11 both pure benefic => luck in clothing; both pure malefic => no luck in clothing; pure malefic H10 separately indicates no luck in royal clothing/honor from superiors. Mixed/split testimony remains unresolved. The legacy helper is not reused because it collapses mixed figures and invents a partial branch. Fixed/mutable persistence and clothing-color subrules are excluded from this luck verdict.',
  }),

  'matter.p172.h17_h1011_thenCombine': method({
    kashfMethodId: 'matter.p172.h17_h1011_thenCombine',
    kashfIntentId: 'matter.outcome',
    topicId: 'generalReading',
    sourcePages: [172],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    notes: 'Canonical p172 matter-outcome executor is wired: combine H1+H7, combine H10+H11, then combine those two generated figures. The final figure alone is the source result for good/bad. Pure benefic => good, pure malefic => bad, and mixed remains mixed/unresolved rather than being collapsed. Distinct from completion p173.',
  }),

  'joy.p196.recast14511': method({
    kashfMethodId: 'joy.p196.recast14511',
    kashfIntentId: 'joy.occurrence',
    topicId: 'completion',
    sourcePages: [196],
    kashfRuntimeStatus: 'blocked-by-source',
    runtimeAllowed: false,
    executionKind: 'recast-board',
    executorStatus: 'pending',
    notes: 'v57 p196 is the illness/lost-item/animals chapter and does not contain the 1,4,5,11 joy/event recast. The known celebrations helper is sourced from an external PDF, not Kashf. Do not execute or backfill it as a Kashf method until a real v57 source method is identified.',
  }),

  'relocation.p183.currentVsNewPlace': method({
    kashfMethodId: 'relocation.p183.currentVsNewPlace',
    kashfIntentId: 'relocation.isThisPlaceGood',
    topicId: 'relocation',
    sourcePages: [183],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    notes: 'Canonical p183 place/move executor is wired. H1+H4 both pure benefic => good residence in the current place; H7+H10 both pure benefic => good move/relocation. The source does not say that failure of either pair proves the opposite, and it does not compare which option is better when both pairs qualify. Mixed figures are not promoted to pure benefic.',
  }),

  'relocation.p183.stayMoveH1H2': method({
    kashfMethodId: 'relocation.p183.stayMoveH1H2',
    kashfIntentId: 'relocation.stayOrMove',
    topicId: 'relocation',
    sourcePages: [178, 183],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    legacyTopicId: 'relocation',
    notes: 'Canonical H1/H2 stay-or-move executor is wired from the repeated v57 rule on pp178 and 183. H1 pure benefic + H2 pure malefic => the current place is better / stay. H1 pure malefic + H2 pure benefic => the reverse / moving away is better. Same-class, mixed or unknown testimony remains unresolved; no broad relocation helper is executed.',
  }),

  'illness.p196.outcomeH15': method({
    kashfMethodId: 'illness.p196.outcomeH15',
    kashfIntentId: 'illness.recovery',
    topicId: 'illness',
    sourcePages: [196],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    legacyTopicId: 'illness',
    notes: 'Canonical p196 H15 executor is wired. Pure benefic => recovery; pure malefic => illness is prolonged. A malefic H15 is NOT promoted to a death/no-recovery verdict, because the source does not say that here. Mixed remains unresolved. Only H15 is executed for this intent; the broader illness bundle stays outside the verdict.',
  }),

  'illness.bodyPart.h6Figure': method({
    kashfMethodId: 'illness.bodyPart.h6Figure',
    kashfIntentId: 'illness.bodyPart',
    topicId: 'illness',
    sourcePages: [199],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'legacy-function',
    executorStatus: 'ready',
    legacyTopicId: 'illness',
    notes: 'Use only the verified H6 figure → body-part mapping from p199. Canonical method-scoped legacy executor is wired and tested; missing source entries remain unresolved rather than invented.',
  }),

  'pregnancy.p191.genderH5': method({
    kashfMethodId: 'pregnancy.p191.genderH5',
    kashfIntentId: 'pregnancy.gender',
    topicId: 'children',
    sourcePages: [191],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    legacyTopicId: 'children',
    notes: 'Canonical p191 method: read the sex from the masculine/feminine classification of H5 only. The four androgynous figures remain unresolved. Do not blend the alternative p192-p194 gender procedures into this verdict.',
  }),

  // ── FAMILY + HEALTH canonical slice -----------------------------------
  'pregnancy.p191.existsH5SilentEmpty': method({
    kashfMethodId: 'pregnancy.p191.existsH5SilentEmpty',
    kashfIntentId: 'pregnancy.exists',
    topicId: 'children',
    sourcePages: [191],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    notes: 'Canonical body rule: H5 silent => pregnancy true; H5 empty => pregnancy false. Figures that are neither silent nor empty remain unresolved by this rule. Do not substitute benefic/malefic.',
  }),

  'pregnancy.p191.childSafetyH1H6H8': method({
    kashfMethodId: 'pregnancy.p191.childSafetyH1H6H8',
    kashfIntentId: 'pregnancy.childSafety',
    topicId: 'children',
    sourcePages: [191],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    notes: 'Canonical p191 child-safety executor is wired. H1 pure benefic gives the source safety testimony; H1 pure malefic gives fear/concern. H6+H8 both pure malefic activate the separate severe source warning that the fetus/child may emerge dead. Mixed figures are not collapsed. The severe clause is treated as a risk statement, not as a certain death verdict.',
  }),

  'pregnancy.p191.deliveryDifficultyH1H5H15': method({
    kashfMethodId: 'pregnancy.p191.deliveryDifficultyH1H5H15',
    kashfIntentId: 'pregnancy.deliveryDifficulty',
    topicId: 'children',
    sourcePages: [191, 194],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    notes: 'Canonical p191 delivery-difficulty executor is wired. H1+H5 both masculine give the explicit ease sign, with the source noting greater force when both are mutable. A fixed H5 gives the explicit difficulty sign, with H1 and H15 exposed as testimony rather than converted into an invented vote. If ease and difficulty signs coexist, the executor reports conflicting source signs instead of choosing one silently.',
  }),

  'child.p194.healthTrajectoryH6H8': method({
    kashfMethodId: 'child.p194.healthTrajectoryH6H8',
    kashfIntentId: 'child.healthTrajectory',
    topicId: 'children',
    sourcePages: [194],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    notes: 'Canonical p194 child-health trajectory executor is wired as two separate source witnesses: pure malefic H6 gives the explicit childhood-pains warning; H8 pure malefic gives low hope, while H8 pure benefic gives improvement as the child grows. Mixed or unmentioned branches remain unresolved. This method is not current-illness recovery and does not aggregate H6+H8 into one invented score.',
  }),

  'lifespan.p178.elementCountToHouse': method({
    kashfMethodId: 'lifespan.p178.elementCountToHouse',
    kashfIntentId: 'lifespan.duration',
    topicId: 'generalReading',
    sourcePages: [178],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'Canonical numeric lifespan/duration method: aggregate elements, reduce by 16, walk houses, then interpret the landing house class as years/months/days. Do not replace with p264 life stages.',
  }),

  'lifespan.p264.stagesH11H9H7': method({
    kashfMethodId: 'lifespan.p264.stagesH11H9H7',
    kashfIntentId: 'lifespan.stages',
    topicId: 'friendsHope',
    sourcePages: [264],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    notes: 'Canonical p264 life-stages executor is wired as a descriptive three-stage profile only: H11 beginning of life, H9 middle, H7 end. Each stage exposes the figure and the verified p133-134 planetary attribution. It does not calculate lifespan duration and does not invent an aggregate good/bad score.',
  }),

  'mother.p257.statusDayNight': method({
    kashfMethodId: 'mother.p257.statusDayNight',
    kashfIntentId: 'mother.status',
    topicId: 'motherRules',
    sourcePages: [257],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'Body-source mother rule. Night: house quality plus White/Road in angles or succedents vs cadents. Day: judge by Venus figures. Existing helper is incomplete and must not be reused unchanged.',
  }),

  'hidden.p188.isStillThere': method({
    kashfMethodId: 'hidden.p188.isStillThere',
    kashfIntentId: 'hidden.isStillThere',
    topicId: 'hiddenTreasure',
    sourcePages: [188],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    notes: 'Canonical p188 executor is wired: H1,H2,H4,H13,H14,H15 must all be explicitly benefic (saad) for the hidden thing to be in the tested place; otherwise the source says it is not there. No majority rule and no promotion of mixed tendency to benefic. This does not prove an unspecified treasure exists from nothing.',
  }),

  'hidden.p188.quarterDirection': method({
    kashfMethodId: 'hidden.p188.quarterDirection',
    kashfIntentId: 'hidden.direction',
    topicId: 'hiddenTreasure',
    sourcePages: [188],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'additional-cast',
    executorStatus: 'pending',
    notes: 'Divide the suspected place into four quarters and cast one figure per direction. This requires method-specific additional input/casting and cannot be inferred from the existing board.',
  }),

  'well.p188.recast1468': method({
    kashfMethodId: 'well.p188.recast1468',
    kashfIntentId: 'well.result',
    topicId: 'hiddenTreasure',
    sourcePages: [188],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'recast-board',
    executorStatus: 'pending',
    notes: 'Make H1,H4,H6,H8 the new mothers, complete a new board, then judge H4 and angles as benefic+internal. Existing legacy helper using original houses is not source-equivalent. Depth is a separate intent.',
  }),

  'lostItem.p202.returnH6H8': method({
    kashfMethodId: 'lostItem.p202.returnH6H8',
    kashfIntentId: 'lostItem.return',
    topicId: 'lostAnimal',
    sourcePages: [202],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    notes: 'Canonical p202 executor is wired: BOTH H6 and H8 must each be pure benefic (saad) and strictly internal (dakhil). The source says otherwise it does not return. Mixed figures and mujassad/fixed/mutable movement classes are not coerced into benefic+internal. This method is shared by lost-item and lost-animal routes and is not a theft-attribution rule.',
  }),

  'marriage.p204.dowryH8': method({
    kashfMethodId: 'marriage.p204.dowryH8',
    kashfIntentId: 'marriage.dowryAmount',
    topicId: 'marriage',
    sourcePages: [204],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    notes: 'Canonical p204 H8 executor: an explicitly benefic figure indicates a large mahr. The immediately following benefic/malefic clause belongs to H10 family status, so H8 malefic or mixed does NOT authorize a small-mahr verdict. Those branches remain unresolved.',
  }),

  'siblings.p182.seniority': method({
    kashfMethodId: 'siblings.p182.seniority',
    kashfIntentId: 'siblings.seniority',
    topicId: 'siblings',
    sourcePages: [182],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    legacyTopicId: 'siblings',
    notes: 'Canonical p182 sibling-seniority executor is wired to H3 only. Jamaa/קהלה (2222) is the source sign for elders, especially paternal elders; Nakis/שפל ראש (2221) also indicates elders. Other H3 figures remain unresolved by this exact rule. The method does not identify a named sibling or infer that an unlisted figure means younger.',
  }),

  'marriage.p204.previousStatusH7inH10': method({
    kashfMethodId: 'marriage.p204.previousStatusH7inH10',
    kashfIntentId: 'marriage.previousStatus',
    topicId: 'marriage',
    sourcePages: [204],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    legacyTopicId: 'marriage',
    notes: 'Corrected against primary Arabic p204: the H7 figure must occur in H10. If that repeated figure is mutable (منقلب) => divorced (مطلقة); if fixed (ثابت) => virgin (بكر). If H7 does not recur in H10, or the repeated figure is outside the four source-defined mutable/four fixed classes, this rule remains unresolved. It does not distinguish widowhood.',
  }),

  // ── LOVE + MARRIAGE canonical slice -----------------------------------
  'marriage.p210.generalMarriageH1H2H7H8H10Judge': method({
    kashfMethodId: 'marriage.p210.generalMarriageH1H2H7H8H10Judge',
    kashfIntentId: 'marriage.suitability',
    topicId: 'marriage',
    sourcePages: [210, 211],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    notes: 'Canonical pp210-211 general-marriage executor is wired. It preserves the source roles of H1/H2 for the man and marriage, H7/H8 for the woman, H10 for what occurs between them and H15 for the outcome; it then performs the explicit H1+H5 derivation for the final good/opposite judgment. Only source-explicit branches are asserted, and mixed testimony remains unresolved.',
  }),

  'love.p205.directLoveH1PlacementH5Relation': method({
    kashfMethodId: 'love.p205.directLoveH1PlacementH5Relation',
    kashfIntentId: 'love.doesPersonLoveMe',
    topicId: 'marriage',
    sourcePages: [205],
    kashfRuntimeStatus: 'repair-required',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'Primary scan p205 reads H5 (الخامس المطلوب), not H15. The H1 figure is judged by its recurrence/placement, but the printed negative list names 6,8,3,12 while the standard cadents are 3,6,9,12. The source then says to inspect H5, called the sought, relative to the ascendant; a bad relation means aversion, while the final phrase "وإن كان في قبضتك" is not mechanically closed. Runtime remains blocked until the placement anomaly, نسبة relation and قبضتك clause are source-closed. Do not substitute p204 attention or p264 friendship/love.',
  }),

  'love.p204.attentionFireRows1713': method({
    kashfMethodId: 'love.p204.attentionFireRows1713',
    kashfIntentId: 'love.attention',
    topicId: 'marriage',
    sourcePages: [204],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    notes: 'Canonical p204 attention/look executor is wired. It uses only the explicit p204 condition: fire row of H1 open + fire row of H7 open + fire row of H13 joined/closed => both look at each other and also at others. Other row combinations remain unresolved by this exact method. The similar p170 practical rule is not blended into this verdict, and this method does not answer whether love exists.',
  }),

  'love.p206.womanFavorH7H11ThenH5': method({
    kashfMethodId: 'love.p206.womanFavorH7H11ThenH5',
    kashfIntentId: 'love.womanFindsFavor',
    topicId: 'marriage',
    sourcePages: [206],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    notes: 'Canonical p206 woman-favor clause. Combine H7+H11, then combine that result with H5. Pure benefic means the woman finds favor in his eyes; pure malefic means she does not; mixed remains unresolved. This is one-directional favor, not mutual chemistry or a general love verdict.',
  }),
  'desire.p206.querentWantsH7H11ThenH5': method({
    kashfMethodId: 'desire.p206.querentWantsH7H11ThenH5',
    kashfIntentId: 'desire.querentWantsMatter',
    topicId: 'marriage',
    sourcePages: [206],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    notes: 'Canonical p206 querent-desire executor is wired. Combine H7+H11, then combine that generated figure with H5. Pure benefic means the querent wants the matter; pure malefic means the opposite; mixed remains unresolved. The separate p206 woman-favor clause uses the same derivation but remains a different method/intent and never votes into this result.',
  }),

  'marriage.p211.dissolutionH7StateMatrix': method({
    kashfMethodId: 'marriage.p211.dissolutionH7StateMatrix',
    kashfIntentId: 'marriage.dissolution',
    topicId: 'marriage',
    sourcePages: [210, 211],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    notes: 'Canonical p211 marriage stability/dissolution executor is wired from H7 quality plus state. Internal figures support continuation; internal malefic adds quarrel while preserving continuity. External pure benefic gives a good marriage with possible separation; external pure malefic gives the explicit breakdown/cut-off branch. Pure benefic fixed gives the stated repair condition. Unstated mixed/mutable combinations remain unresolved.',
  }),

  // ── MONEY + ECONOMY canonical slice -----------------------------------
  'money.p179.sourceByIncomingHonorHouse': method({
    kashfMethodId: 'money.p179.sourceByIncomingHonorHouse',
    kashfIntentId: 'money.source',
    topicId: 'money',
    sourcePages: [179],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    notes: 'Canonical p179 money-source executor is wired. If H2 is pure benefic, locate Incoming Honor (2211) in the twelve topical houses and report the source by the nature/title of the house or houses where it appears. Multiple occurrences remain multiple source channels; none are ranked. If Money Incoming (2121) itself is in H2, its topical recurrences are exposed separately as acquisition-judgment testimony and are not silently merged into the Incoming-Honor source rule. Mixed/non-benefic H2 does not activate this source clause. The distinct p179 malefic-H2 exceptions and p181 alternate/modulo method are not imported.',
  }),

  'money.p180.livelihoodH10Invert': method({
    kashfMethodId: 'money.p180.livelihoodH10Invert',
    kashfIntentId: 'money.livelihood',
    topicId: 'money',
    sourcePages: [180],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    notes: 'Canonical p180 livelihood executor is wired. It inverts every open/closed row of H10, identifies the resulting figure, and traces its recurrence in houses 1-12. A pure-benefic result placed in an angle supports expanded livelihood; cadent placement is unfavorable. If the result occurs in both angle and cadent houses, or only in an unstated placement, the method remains unresolved rather than inventing a priority rule.',
  }),

  'money.p181.recast25811': method({
    kashfMethodId: 'money.p181.recast25811',
    kashfIntentId: 'money.acquire',
    topicId: 'money',
    sourcePages: [181],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    notes: 'Canonical p181 secondary-board executor is wired: original H2,H5,H8,H11 become the four mothers of a fresh board. In that recast board H1,H2,H4,H7,H10 must each be strictly internal (dakhil); when all qualify, the source says the money is obtained. Failure of the positive condition remains unresolved because this exact clause does not state the inverse. The preceding p181 2/6/8/10 parity method remains a separate alternative and is not aggregated.',
  }),

  'inheritance.p180.elementComposite': method({
    kashfMethodId: 'inheritance.p180.elementComposite',
    kashfIntentId: 'inheritance.whoInheritsWhom',
    topicId: 'deathInheritance',
    sourcePages: [180],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'Body-source inheritance method determines which side inherits the other through the stated element-row composites. It does not calculate shares, amounts, or inheritance disputes.',
  }),

  // ── TRAVEL + MISSING canonical slice ----------------------------------
  'travel.p238.timeSelectionH9H4': method({
    kashfMethodId: 'travel.p238.timeSelectionH9H4',
    kashfIntentId: 'travel.timeSelection',
    topicId: 'travel',
    sourcePages: [238],
    kashfRuntimeStatus: 'repair-required',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    legacyTopicId: 'travel',
    notes: 'Canonical time-selection rule judges a proposed departure time: Road, Ahyan/Nesu Rosh, or Incoming Honor in H9 / the head / querent house, with H4 benefic. The existing timing helper has a named-figure table defect and must not run until repaired. This method does not calculate a future date from nothing.',
  }),

  'travel.p239.profitEarthRowH2': method({
    kashfMethodId: 'travel.p239.profitEarthRowH2',
    kashfIntentId: 'travel.profit',
    topicId: 'travel',
    sourcePages: [239],
    kashfRuntimeStatus: 'blocked-by-source',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'v57 preserves the profit rule, but the exact source input denoted by the earth row of the point/area is not sufficiently resolved for canonical construction. Hebrew knowledge is indexed; runtime remains source-blocked until the input is closed.',
  }),

  'travel.p239.seaOrLandByElement': method({
    kashfMethodId: 'travel.p239.seaOrLandByElement',
    kashfIntentId: 'travel.seaOrLand',
    topicId: 'travel',
    sourcePages: [239],
    kashfRuntimeStatus: 'blocked-by-source',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'v57 preserves the sea/land element mapping, but the preceding two-figure construction is unresolved and the Hebrew fire branch omits the Arabic return-by-sea clause. Runtime remains source-blocked until v57 is explicitly corrected/closed.',
  }),

  'travel.p242.roadDangerH7Element': method({
    kashfMethodId: 'travel.p242.roadDangerH7Element',
    kashfIntentId: 'travel.roadDanger',
    topicId: 'travel',
    sourcePages: [242],
    kashfRuntimeStatus: 'repair-required',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'Body-source danger classification uses H7 element: fire=robbers; air=road animals and the like; water=drowning/theft/fighting; earth=snakes/scorpions/ground harms. The current generic element resolver must be verified before reuse.',
  }),

  'travel.p244.returnH1H2H9': method({
    kashfMethodId: 'travel.p244.returnH1H2H9',
    kashfIntentId: 'travel.return',
    topicId: 'travel',
    sourcePages: [244],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    notes: 'Canonical p244 traveler-return executor is wired conservatively. H1/H2/H9 all pure benefic and strictly internal support return in goodness and joy. H1/H2/H9 all pure malefic expose the source hardship / possible non-return branch, but are not converted into a certain no-return verdict. Split or mixed testimony remains unresolved. The separate H5 companion rule is not imported.',
  }),

  'missing.p249.returnAnglesJudge': method({
    kashfMethodId: 'missing.p249.returnAnglesJudge',
    kashfIntentId: 'missing.return',
    topicId: 'missingPerson',
    sourcePages: [249],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    notes: 'Canonical p249 missing-return executor is wired conservatively. The four angles H1/H4/H7/H10 must all be pure benefic and strictly internal, and H15 must give the same benefic/internal supporting testimony before the source return sign is exposed. Failure of the positive condition is not inverted into non-return. The Hebrew source clause explicitly speaks of return of males, so the executor preserves that scope and does not silently generalize it to every missing-person case.',
  }),

  'missing.p249.locationDirectionUnresolved': method({
    kashfMethodId: 'missing.p249.locationDirectionUnresolved',
    kashfIntentId: 'missing.location',
    topicId: 'missingPerson',
    sourcePages: [249, 250],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Body text distinguishes whether the absent person is in the city using the four angles and says to inspect direction, but the exact body-source directional operation is not sufficiently closed. Do not import the later Nuzhat fugitive-direction method.',
  }),

  'travel.external.p246.directionNuzhat': method({
    kashfMethodId: 'travel.external.p246.directionNuzhat',
    kashfIntentId: 'travel.direction',
    topicId: 'travel',
    sourcePages: [246],
    sourceLayer: 'added-from-other-book',
    attributedSourceBook: 'Nuzhat al-Uqul',
    methodRole: 'educational-only',
    kashfRuntimeStatus: 'educational-only',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Explicit Nuzhat addition: dominant element gives direction (fire east, air west, water sea, earth qibla/south). Knowledge-only by default; no canonical body direction method has been selected.',
  }),

  'travel.external.p247.compareTwoTrips': method({
    kashfMethodId: 'travel.external.p247.compareTwoTrips',
    kashfIntentId: 'travel.compareTwoTrips',
    topicId: 'travel',
    sourcePages: [247],
    sourceLayer: 'added-from-other-book',
    attributedSourceBook: 'Nuzhat al-Uqul',
    methodRole: 'educational-only',
    kashfRuntimeStatus: 'educational-only',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The two-trips comparison is inside the explicit Nuzhat addition. Retain for learning only unless explicitly selected later.',
  }),

  'fugitive.external.p250.nuzhat': method({
    kashfMethodId: 'fugitive.external.p250.nuzhat',
    kashfIntentId: 'fugitive.capture',
    topicId: 'missingPerson',
    sourcePages: [250],
    sourceLayer: 'added-from-other-book',
    attributedSourceBook: 'Nuzhat al-Uqul',
    methodRole: 'educational-only',
    kashfRuntimeStatus: 'educational-only',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Fugitive material after the return marker is explicitly from Nuzhat al-Uqul. It must not be executed as body-source Kashf runtime.',
  }),

  // ── CAREER + AUTHORITY canonical slice --------------------------------
  'authority.p256.honorConditionH10Planet': method({
    kashfMethodId: 'authority.p256.honorConditionH10Planet',
    kashfIntentId: 'authority.honorCondition',
    topicId: 'authorityState',
    sourcePages: [256],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    notes: 'Canonical p256 H10-planet executor is wired to the source-verified p133-134 planetary map. Sun => strength of honor/rank; Jupiter or Venus => good/completion; Saturn => lack of benefit, gloom and distress. Moon, Mercury and Mars remain unresolved by this p256 excerpt; do not turn this into a binary fame prediction.',
  }),

  'authority.p257.appointmentH1H10Planet': method({
    kashfMethodId: 'authority.p257.appointmentH1H10Planet',
    kashfIntentId: 'authority.appointmentStays',
    topicId: 'authorityState',
    sourcePages: [257],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    notes: 'Canonical p257 executor combines H1+H10 and judges the resulting figure by the source-verified planetary attribution. Sun/Moon or Jupiter/Venus => the appointment/authority completes; every other verified planet => it does not. Never substitute a benefic/malefic proxy for the planetary rule.',
  }),

  'authority.p257.rulerConditionH7H10': method({
    kashfMethodId: 'authority.p257.rulerConditionH7H10',
    kashfIntentId: 'authority.rulerCondition',
    topicId: 'authorityState',
    sourcePages: [257],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    notes: 'Canonical p257 ruler-condition executor combines H7+H10. Source-explicit benefic => good and malefic => bad. Canonical mixed classification stays unresolved because this rule does not state a mixed branch. This is distinct from appointment persistence.',
  }),

  'career.p266.returnToOffice': method({
    kashfMethodId: 'career.p266.returnToOffice',
    kashfIntentId: 'career.returnToOffice',
    topicId: 'authorityState',
    sourcePages: [266],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    legacyTopicId: 'authorityState',
    notes: 'Canonical p266 return-to-office executor is wired directly from the body-source clause rather than the broad authorityState helper. H1 must be pure benefic and strictly internal, its same figure must recur in another strong/angle house (H4/H7/H10; H10 is explicitly named), and H16 / al-aqiba must be pure benefic to support the return. Pure-malefic H1 activates the explicit opposite branch. Mixed H1 or incomplete positive testimony remains unresolved. The original H1 occurrence is not counted as a recurrence.',
  }),

  'profession.p254.h9Planet': method({
    kashfMethodId: 'profession.p254.h9Planet',
    kashfIntentId: 'profession.type',
    topicId: 'authorityState',
    sourcePages: [254],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'legacy-function',
    executorStatus: 'ready',
    legacyTopicId: 'authorityState',
    notes: 'Body-source profession/craft rule: profession itself is judged by the planetary figure in H9; H10/H11 benefic is only a separate ease-of-work qualifier. Existing computeProfessionH9Kashf already follows this split and may be reused after method-scoped wiring. Source does not claim to optimize a modern “best career fit” from personal preference.',
  }),

  // ── CONFLICT + THEFT canonical slice --------------------------------
  'theft.p224.recoveryH8': method({
    kashfMethodId: 'theft.p224.recoveryH8',
    kashfIntentId: 'theft.recovery',
    topicId: 'theft',
    sourcePages: [224],
    kashfRuntimeStatus: 'repair-required',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    legacyTopicId: 'theft',
    notes: 'Body-source recovery rule: H8 benefic => the stolen property is obtained/recovered; H8 malefic => it is not. Legacy runtime softens this binary rule and adds mixed branches, so it must not run unchanged.',
  }),

  'theft.p224.relationshipH7Recurrence': method({
    kashfMethodId: 'theft.p224.relationshipH7Recurrence',
    kashfIntentId: 'theft.thiefRelationship',
    topicId: 'theft',
    sourcePages: [224, 225],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    notes: 'Body-source relationship/proximity method follows where the H7 figure recurs and judges the connection by that house. It can classify relation/proximity; it does not identify a named thief.',
  }),

  'theft.p225.thiefDescriptionH7': method({
    kashfMethodId: 'theft.p225.thiefDescriptionH7',
    kashfIntentId: 'theft.thiefDescription',
    topicId: 'theft',
    sourcePages: [224, 225],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    notes: 'Body-source instruction takes the thief description from H7 and its figure, with H10 used for location/context. This yields a descriptive profile/letters, not a certain real-world identity or accusation.',
  }),

  'dispute.p212.reconciliationH1H7': method({
    kashfMethodId: 'dispute.p212.reconciliationH1H7',
    kashfIntentId: 'dispute.reconciliation',
    topicId: 'disputes',
    sourcePages: [212],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    notes: 'Canonical p212 reconciliation executor is wired. Generate one figure from H1+H7. A pure benefic generated figure gives the explicit source verdict that the two sides reconcile. Pure malefic, mixed, or unknown generated figures remain unresolved because p212 does not state the converse in this clause. Mediator identity clauses remain outside this yes/no executor.',
  }),

  'dispute.p213.winnerStrengthUnresolved': method({
    kashfMethodId: 'dispute.p213.winnerStrengthUnresolved',
    kashfIntentId: 'dispute.whoWins',
    topicId: 'disputes',
    sourcePages: [213],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Body-source winner/loser method is identified (H13+balance for querent, H14 for respondent, then multiplicity/strength and tie-break house groups), but the exact source semantics of “strength/multiplicity of force” are not closed. No code until that term is resolved.',
  }),

  'partnership.p212.operationUnresolved': method({
    kashfMethodId: 'partnership.p212.operationUnresolved',
    kashfIntentId: 'partnership.goodOrBad',
    topicId: 'partnership',
    sourcePages: [212],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'p212 gives partnership indications from H1/H7 and H5/H7 and also a 2-by-2 remainder rule, but the exact operation/input denoted by the total is not sufficiently closed. Do not merge the variants or invent the operand.',
  }),

  'fear.p273.punishmentSigns': method({
    kashfMethodId: 'fear.p273.punishmentSigns',
    kashfIntentId: 'fear.punishment',
    topicId: 'fear',
    sourcePages: [273],
    kashfRuntimeStatus: 'repair-required',
    runtimeAllowed: false,
    executionKind: 'legacy-function',
    executorStatus: 'pending',
    legacyTopicId: 'fear',
    notes: 'Body-source punishment-fear rule requires Incoming Honor in H10, Incoming Threshold in H5, Ahyan/Nesu Rosh in H1 OR the enemy house, and H4 benefic. Existing computeFearOfPunishment checks the H1 branch but omits the alternative enemy-house branch.',
  }),

  'war.external.p213-217.nonBody': method({
    kashfMethodId: 'war.external.p213-217.nonBody',
    kashfIntentId: 'war.outcome',
    topicId: 'disputes',
    sourcePages: [213, 214, 215, 216, 217],
    sourceLayer: 'non-body-addition',
    attributedSourceBook: 'other',
    methodRole: 'educational-only',
    kashfRuntimeStatus: 'educational-only',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The city/war/winner material after the explicit ومن غير الكتاب marker is retained for learning only. It must not become the runtime fallback for dispute or war questions.',
  }),

  'prisoner.causeOfImprisonment.unsupported': method({
    kashfMethodId: 'prisoner.causeOfImprisonment.unsupported',
    kashfIntentId: 'prisoner.causeOfImprisonment',
    topicId: 'prisoner',
    sourcePages: [272, 273],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Audited body-source prisoner rules judge outcome/exit conditions, not the identity of the person responsible for causing the imprisonment. Do not infer a culprit from house symbolism.',
  }),

  'conflict.victoryGoalMixedScope.unsupported': method({
    kashfMethodId: 'conflict.victoryGoalMixedScope.unsupported',
    kashfIntentId: 'conflict.victoryGoalMixedScope',
    topicId: 'disputes',
    sourcePages: [212, 213, 267],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The UI question mixes defeating an opponent with succeeding in a personal objective. Those belong to dispute.whoWins and hope.fulfillment respectively and must be split before canonical routing.',
  }),

  'business.attention.unsupported': method({
    kashfMethodId: 'business.attention.unsupported',
    kashfIntentId: 'business.otherPartyAttention',
    topicId: 'partnership',
    sourcePages: [212],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'No audited body-source method has been selected for whether a business counterparty is still mentally committed or has shifted attention elsewhere. Do not reuse the p204 love-attention method across domains.',
  }),

  // ── SPIRITUAL + MISC source-safety slice -----------------------------
  'spiritual.p167.hiddenActionAirRows46815': method({
    kashfMethodId: 'spiritual.p167.hiddenActionAirRows46815',
    kashfIntentId: 'spiritual.hiddenAction',
    topicId: 'spiritualDiagnostics',
    sourcePages: [167],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    notes: 'Canonical p167 hidden-action executor is wired. Take ONLY the AIR row of H4, H6, H8 and H15 (the balance/judge) and assemble one four-row figure. Pure malefic => an action is behind the matter; every other source classification follows the explicit source complement “otherwise no”. This is covert/hidden action only and must never be promoted to sorcery, jinn, evil-eye or sorcerer identification.',
  }),

  'religion.p253.h3h9Quality': method({
    kashfMethodId: 'religion.p253.h3h9Quality',
    kashfIntentId: 'religion.religiosity',
    topicId: 'religion',
    sourcePages: [253],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    notes: 'Canonical p253 religion/righteousness executor is wired. Both H3 and H9 pure malefic => little religion; both pure benefic => religious and God-fearing according to the source wording. Mixed figures and split H3/H9 testimony remain unresolved rather than being forced into a binary judgment. It does not answer broad theological, spiritual-practice or faith-advice questions.',
  }),

  'spiritual.jinnType.unsupported': method({
    kashfMethodId: 'spiritual.jinnType.unsupported',
    kashfIntentId: 'spiritual.jinnType',
    topicId: 'spiritualDiagnostics',
    sourcePages: [167],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'No audited Kashf body method classifies an alleged influence as jinn vs evil eye vs human sorcery. p167 must not be stretched into this diagnosis.',
  }),

  'spiritual.sorcererIdentity.unsupported': method({
    kashfMethodId: 'spiritual.sorcererIdentity.unsupported',
    kashfIntentId: 'spiritual.sorcererIdentity',
    topicId: 'spiritualDiagnostics',
    sourcePages: [167],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'p167 can ask whether the querent acts by sorcery on the quesited person; it does not identify a named sorcerer behind an alleged harm. No identity method is selected.',
  }),

  'spiritual.obsessionCause.unsupported': method({
    kashfMethodId: 'spiritual.obsessionCause.unsupported',
    kashfIntentId: 'spiritual.obsessionCause',
    topicId: 'spiritualDiagnostics',
    sourcePages: [43],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'House symbolism includes worry/waswasa-like meanings, but no audited operational Kashf body rule distinguishes spiritual from psychological causes of anxiety or intrusive thoughts. Do not diagnose by house meaning alone.',
  }),

  'security.external.p235.h8': method({
    kashfMethodId: 'security.external.p235.h8',
    kashfIntentId: 'security.general',
    topicId: 'deathInheritance',
    sourcePages: [235, 236],
    sourceLayer: 'added-from-other-book',
    attributedSourceBook: 'al-Multaqat',
    methodRole: 'educational-only',
    kashfRuntimeStatus: 'educational-only',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The H8 security/fear/longevity/inheritance material is in the explicitly attributed collected/al-Multaqat addition. Keep it in educational knowledge only; never feed a Kashf body verdict.',
  }),

  'social.slander.unsupported': method({
    kashfMethodId: 'social.slander.unsupported',
    kashfIntentId: 'social.slander',
    topicId: 'enemies',
    sourcePages: [43],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Slander/backbiting can appear among house meanings, but no audited operational body-source method has been selected for the UI yes/no/identity question.',
  }),

  'social.twoFaced.unsupported': method({
    kashfMethodId: 'social.twoFaced.unsupported',
    kashfIntentId: 'social.twoFaced',
    topicId: 'enemies',
    sourcePages: [43],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'No audited Kashf body method establishes that a specific person is two-faced/deceptive. General house symbolism is not an operational verdict.',
  }),

  'wronged.status.unsupported': method({
    kashfMethodId: 'wronged.status.unsupported',
    kashfIntentId: 'wronged.status',
    topicId: 'disputes',
    sourcePages: [43],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The wronged/oppressed person occurs in house meanings, but no audited operational Kashf body method has been selected for the broad UI question. Keep blocked rather than infer from house semantics.',
  }),

  'isolation.status.unsupported': method({
    kashfMethodId: 'isolation.status.unsupported',
    kashfIntentId: 'isolation.status',
    topicId: 'enemies',
    sourcePages: [43],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Isolation/confinement meanings of houses do not constitute a dedicated operational method for the broad UI isolation question.',
  }),

  // ── FINAL QUESTION-BANK COVERAGE slice -------------------------------
  'agriculture.mixedScope.unsupported': method({
    kashfMethodId: 'agriculture.mixedScope.unsupported',
    kashfIntentId: 'agriculture.mixedScope',
    topicId: 'yearlyForecast',
    sourcePages: [184, 222],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The UI mixes crop yield, irrigation and land ownership. Kashf body p184 treats land/property structure, while agriculture/yield material mapped at p222 belongs to the Nuzhat addition. Split the question before any operational method is selected.',
  }),

  'family.fatherPropertyMixedScope.unsupported': method({
    kashfMethodId: 'family.fatherPropertyMixedScope.unsupported',
    kashfIntentId: 'family.fatherPropertyMixedScope',
    topicId: 'parentsProperty',
    sourcePages: [184],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'p184 contains distinct rules for father condition and for property/house/land. The current UI merges father health, house and land into one question, so it must be split rather than routed to one verdict.',
  }),

  'direction.generic.unsupported': method({
    kashfMethodId: 'direction.generic.unsupported',
    kashfIntentId: 'direction.generic',
    topicId: 'generalReading',
    sourcePages: [117, 188, 246],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Kashf contains several domain-specific direction systems with different provenance and inputs. No single body-source generic direction method is selected for every question.',
  }),

  'helpers.generic.unsupported': method({
    kashfMethodId: 'helpers.generic.unsupported',
    kashfIntentId: 'helpers.findHelp',
    topicId: 'completion',
    sourcePages: [176],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'p176 contains servant/service material, but no audited canonical body method has been selected for the broad modern question “will I find someone to help me?”. Do not generalize servant rules automatically.',
  }),

  'illness.causeMixedScope.unsupported': method({
    kashfMethodId: 'illness.causeMixedScope.unsupported',
    kashfIntentId: 'illness.causeMixedScope',
    topicId: 'illness',
    sourcePages: [197],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'p197 classifies humoral/elemental illness nature. It does not provide a verified modern physical-vs-emotional-vs-environmental cause classifier. Keep the broader cause question blocked.',
  }),

  'illness.p197.h1h8ElementHumor': method({
    kashfMethodId: 'illness.p197.h1h8ElementHumor',
    kashfIntentId: 'illness.humor',
    topicId: 'illness',
    sourcePages: [197],
    kashfRuntimeStatus: 'repair-required',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    legacyTopicId: 'illness',
    notes: 'Canonical body-source humor rule requires H1 and H8 to be of the same element: water => cold/moist illness; earth => black bile; fire => yellow bile; air => winds/air-related condition. Existing legacy handling is not source-equivalent and must be repaired before execution.',
  }),

  'money.loseFortune.unsupported': method({
    kashfMethodId: 'money.loseFortune.unsupported',
    kashfIntentId: 'money.loseFortune',
    topicId: 'money',
    sourcePages: [179, 223],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'No single audited body-source canonical method is selected for the broad question of losing one’s fortune. p223 loss/profit material is in an added/Nuzhat context and is not a body fallback.',
  }),

  'nativity.birthDate.unsupported': method({
    kashfMethodId: 'nativity.birthDate.unsupported',
    kashfIntentId: 'nativity.birthDate',
    topicId: 'generalReading',
    sourcePages: [],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'No audited Kashf canonical method has been selected for deriving a complete fate reading from a birth date alone.',
  }),

  'social.neighbor.unsupported': method({
    kashfMethodId: 'social.neighbor.unsupported',
    kashfIntentId: 'social.neighborState',
    topicId: 'siblings',
    sourcePages: [182],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The selected p182 siblings method is not automatically a neighbor method. No separate audited canonical rule for the broad neighbor question is selected.',
  }),

  'authority.officialDocs.unsupported': method({
    kashfMethodId: 'authority.officialDocs.unsupported',
    kashfIntentId: 'authority.officialDocs',
    topicId: 'authorityState',
    sourcePages: [256, 257],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The audited authority chapter covers honor, appointments, rulers and return to service. It does not provide a selected body-source method for modern visa/license/contract approval.',
  }),

  'general.pastEvents.unsupported': method({
    kashfMethodId: 'general.pastEvents.unsupported',
    kashfIntentId: 'general.pastEvents',
    topicId: 'generalReading',
    sourcePages: [],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'No audited Kashf canonical method has been selected for reconstructing arbitrary past events from a generic question.',
  }),

  'family.relativeState.unsupported': method({
    kashfMethodId: 'family.relativeState.unsupported',
    kashfIntentId: 'family.relativeState',
    topicId: 'siblings',
    sourcePages: [182],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The canonical p182 sibling method is source-specific to siblings and must not be expanded to every in-law, uncle, relative or neighbor without an explicit source rule.',
  }),

  'separation.mixedScope.unsupported': method({
    kashfMethodId: 'separation.mixedScope.unsupported',
    kashfIntentId: 'separation.mixedScope',
    topicId: 'generalReading',
    sourcePages: [183, 211],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The current UI mixes separation from a person, a place and a relationship. Kashf has distinct relocation and marriage-dissolution methods; no universal separation method should be inferred.',
  }),

  'separation.loved.unsupported': method({
    kashfMethodId: 'separation.loved.unsupported',
    kashfIntentId: 'separation.lovedPerson',
    topicId: 'marriage',
    sourcePages: [205, 211, 264],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Love and marriage passages do not yield a selected universal canonical method for whether separation from a loved person is final. Do not substitute marriage divorce or friendship alternatives automatically.',
  }),

  'stalled.cause.unsupported': method({
    kashfMethodId: 'stalled.cause.unsupported',
    kashfIntentId: 'stalled.cause',
    topicId: 'generalReading',
    sourcePages: [],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'No audited Kashf canonical method has been selected for diagnosing the general cause of “why is everything stuck?”. Keep this broad causal question blocked.',
  }),

  'stranger.description.unresolved': method({
    kashfMethodId: 'stranger.description.unresolved',
    kashfIntentId: 'stranger.description',
    topicId: 'generalReading',
    sourcePages: [68, 69, 71, 72, 74, 76, 77, 79, 81, 82, 85, 86, 88, 89, 91, 93],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Kashf contains detailed figure descriptions, but a source-safe operational rule selecting which figure/house describes an arbitrary unknown stranger has not been closed. Do not turn the descriptive corpus into a generic identity engine by inference.',
  }),

  // ── REPAIR REQUIRED ----------------------------------------------------
  'money.p180.elementComparison': method({
    kashfMethodId: 'money.p180.elementComparison',
    kashfIntentId: 'money.generalCondition',
    topicId: 'money',
    sourcePages: [180],
    kashfRuntimeStatus: 'repair-required',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    legacyTopicId: 'money',
    notes: 'Canonical source derives queried-person money from H2/H4/H6/H8 and querent money from H1/H3/H5/H7, then compares their elements (fire=1, air=2, water=3, earth=4). Current legacy mechanism judges figures by incoming/outgoing and is not source-equivalent.',
  }),

  'marriage.p205.modestyPurity': method({
    kashfMethodId: 'marriage.p205.modestyPurity',
    kashfIntentId: 'marriage.modesty',
    topicId: 'marriage',
    sourcePages: [205, 206],
    kashfRuntimeStatus: 'repair-required',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    legacyTopicId: 'marriage',
    notes: 'Canonical source uses the explicit pure/impure figure classification, including H1/H7/H9 and the balance/judge conditions. Current code incorrectly substitutes benefic/malefic for pure/impure, so it must be repaired before runtime use.',
  }),

  'hope.p267.fulfillment': method({
    kashfMethodId: 'hope.p267.fulfillment',
    kashfIntentId: 'hope.fulfillment',
    topicId: 'friendsHope',
    sourcePages: [267],
    kashfRuntimeStatus: 'repair-required',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'Canonical hope method requires incoming conditions, H11 recurrence, nature matching and fallback; current count-quality implementation is not source-equivalent.',
  }),

  'dream.p254.h9AndTransit': method({
    kashfMethodId: 'dream.p254.h9AndTransit',
    kashfIntentId: 'dream.meaning',
    topicId: 'dream',
    sourcePages: [254],
    kashfRuntimeStatus: 'repair-required',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'Must judge H9 and then where the H9 figure moved; current implementation is partial.',
  }),

  'friends.p263.h1h11': method({
    kashfMethodId: 'friends.p263.h1h11',
    kashfIntentId: 'friends.relationship',
    topicId: 'friendsHope',
    sourcePages: [263, 264],
    kashfRuntimeStatus: 'repair-required',
    runtimeAllowed: false,
    executionKind: 'formula',
    executorStatus: 'pending',
    legacyTopicId: 'friendsHope',
    notes: 'Core friendship formula is usable only after removing unrelated hope/Nuzhat bundle execution.',
  }),

  'state.p265.h1h2h9h15': method({
    kashfMethodId: 'state.p265.h1h2h9h15',
    kashfIntentId: 'state.stability',
    topicId: 'authorityState',
    sourcePages: [265],
    kashfRuntimeStatus: 'repair-required',
    runtimeAllowed: false,
    executionKind: 'legacy-function',
    executorStatus: 'pending',
    legacyTopicId: 'authorityState',
    notes: 'Existing helper must be isolated from the authorityState topic bundle.',
  }),

  'missing.p248-249.lifeH1H4H9Outcome': method({
    kashfMethodId: 'missing.p248-249.lifeH1H4H9Outcome',
    kashfIntentId: 'missing.aliveOrDead',
    topicId: 'missingPerson',
    sourcePages: [250, 251],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    executorStatus: 'ready',
    notes: 'Canonical pp250-251 missing-person life-status executor is wired from the corrected v57 provenance. H1+H4+H9+H15 all pure benefic expose the explicit alive sign. H6+H7+H8+H15 all drawn from the seven source-listed death figures expose the separate severe testimony. Neither absence of the alive sign nor the severe pattern is silently converted into a certain death/alive verdict; mixed or incomplete testimony remains unresolved.',
  }),

  'enemy.p271.h1vsH12': method({
    kashfMethodId: 'enemy.p271.h1vsH12',
    kashfIntentId: 'enemy.presenceAndDominance',
    topicId: 'enemies',
    sourcePages: [271],
    kashfRuntimeStatus: 'repair-required',
    runtimeAllowed: false,
    executionKind: 'legacy-function',
    executorStatus: 'pending',
    legacyTopicId: 'enemies',
    notes: 'computeEnemyPresenceCheck matches the direct four-case source rule; legacy primary combine(1,12) must be bypassed.',
  }),

  // ── BLOCKED BY SOURCE --------------------------------------------------
  'relocation.p183.compare12vs78': method({
    kashfMethodId: 'relocation.p183.compare12vs78',
    kashfIntentId: 'relocation.compareTwoCities',
    topicId: 'relocation',
    sourcePages: [183],
    kashfRuntimeStatus: 'blocked-by-source',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Source comparison is identified, but the exact strength semantics must be closed before implementation.',
  }),

  'gift.sourceInputUnclear': method({
    kashfMethodId: 'gift.sourceInputUnclear',
    kashfIntentId: 'gift.receive',
    topicId: 'children',
    sourcePages: [193],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Gift verdict polarity is stated, but the exact house/input to which it applies is not sufficiently explicit.',
  }),

  'pregnancy.miscarriageRisk.unresolved': method({
    kashfMethodId: 'pregnancy.miscarriageRisk.unresolved',
    kashfIntentId: 'pregnancy.miscarriageRisk',
    topicId: 'children',
    sourcePages: [192, 193],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Several body-source miscarriage/fetus-risk conditions exist across p192-p193. Canonical method selection has not yet been formally closed; do not merge them or vote across them.',
  }),

  'child.lifespan.p195.provenanceUnresolved': method({
    kashfMethodId: 'child.lifespan.p195.provenanceUnresolved',
    kashfIntentId: 'child.lifespan',
    topicId: 'children',
    sourcePages: [195],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'p195 contains child-lifespan material adjacent to al-Zanati material. Passage-level provenance must be closed before this can be selected operationally.',
  }),

  'marriage.p207-208.adulterySignsUnresolved': method({
    kashfMethodId: 'marriage.p207-208.adulterySignsUnresolved',
    kashfIntentId: 'marriage.adulterySigns',
    topicId: 'marriage',
    sourcePages: [207, 208],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The body text supplies specific warning signs associated with sexual misconduct or another attachment, but the audited passage does not provide a complete symmetric yes/no method for all figures. Do not turn partial signs into a universal adultery verdict.',
  }),

  'travel.p242.vehicleSafety': method({
    kashfMethodId: 'travel.p242.vehicleSafety',
    kashfIntentId: 'travel.vehicleSafety',
    topicId: 'travel',
    sourcePages: [242],
    kashfRuntimeStatus: 'blocked-by-source',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Source contradiction: house 12 appears in conflicting outcome groups. No code until textual resolution.',
  }),

  'prisoner.releaseTiming.unresolved': method({
    kashfMethodId: 'prisoner.releaseTiming.unresolved',
    kashfIntentId: 'prisoner.releaseTiming',
    topicId: 'prisoner',
    sourcePages: [272, 273],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'blocked-by-source',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'No canonical body method selected that yields release timing. Do not infer timing from outcome/exit rules.',
  }),

  // ── EDUCATIONAL / EXTERNAL --------------------------------------------
  'promise.external.p255': method({
    kashfMethodId: 'promise.external.p255',
    kashfIntentId: 'promise.fulfillment',
    topicId: 'completion',
    sourcePages: [255],
    sourceLayer: 'added-from-other-book',
    attributedSourceBook: 'Nuzhat al-Uqul',
    methodRole: 'educational-only',
    kashfRuntimeStatus: 'educational-only',
    runtimeAllowed: false,
    executionKind: 'legacy-function',
    executorStatus: 'not-applicable',
    notes: 'Knowledge-only. Must never feed verdict.',
  }),

  'yearly.external.p221-223': method({
    kashfMethodId: 'yearly.external.p221-223',
    kashfIntentId: 'yearly.forecast',
    topicId: 'yearlyForecast',
    sourcePages: [221, 222, 223],
    sourceLayer: 'non-body-addition',
    attributedSourceBook: 'other',
    methodRole: 'educational-only',
    kashfRuntimeStatus: 'educational-only',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Mapped material in this range belongs to non-body/Nuzhat additions; retained for learning only by default.',
  }),

  'fear.external.p274.h7h8': method({
    kashfMethodId: 'fear.external.p274.h7h8',
    kashfIntentId: 'fear.general',
    topicId: 'fear',
    sourcePages: [274],
    sourceLayer: 'non-body-addition',
    attributedSourceBook: 'other',
    methodRole: 'educational-only',
    kashfRuntimeStatus: 'educational-only',
    runtimeAllowed: false,
    executionKind: 'formula',
    executorStatus: 'not-applicable',
    notes: 'Post-ومن غير الكتاب material; knowledge-only by default.',
  }),

  'commerce.external.p218.buySell': method({
    kashfMethodId: 'commerce.external.p218.buySell',
    kashfIntentId: 'commerce.buySell',
    topicId: 'commerce',
    sourcePages: [218],
    sourceLayer: 'non-body-addition',
    attributedSourceBook: 'other',
    methodRole: 'educational-only',
    kashfRuntimeStatus: 'educational-only',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The buy/sell rule begins after an explicit ومن غير الكتاب marker. Knowledge-only by default.',
  }),

  'market.external.p218-223.price': method({
    kashfMethodId: 'market.external.p218-223.price',
    kashfIntentId: 'market.price',
    topicId: 'yearlyForecast',
    sourcePages: [218, 221, 222, 223],
    sourceLayer: 'non-body-addition',
    attributedSourceBook: 'other',
    methodRole: 'educational-only',
    kashfRuntimeStatus: 'educational-only',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Price/dearness-cheapness material in this range belongs to non-body and Nuzhat additions. It remains educational and must not feed the live verdict.',
  }),

  'loan.external.p234.repayment': method({
    kashfMethodId: 'loan.external.p234.repayment',
    kashfIntentId: 'loan.repayment',
    topicId: 'loan',
    sourcePages: [234],
    sourceLayer: 'non-body-addition',
    attributedSourceBook: 'other',
    methodRole: 'educational-only',
    kashfRuntimeStatus: 'educational-only',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The p234 loan chain lies inside the non-body block that starts at p228. Keep for learning only by default.',
  }),

  'loan.external.p234.shouldGive': method({
    kashfMethodId: 'loan.external.p234.shouldGive',
    kashfIntentId: 'loan.shouldGive',
    topicId: 'loan',
    sourcePages: [234],
    sourceLayer: 'non-body-addition',
    attributedSourceBook: 'other',
    methodRole: 'educational-only',
    kashfRuntimeStatus: 'educational-only',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The p234 “is this loan sound / should it be given” rule is non-body material. Knowledge-only by default.',
  }),

  // ── UNSUPPORTED / ABSTRACT INTENTS ------------------------------------
  'hidden.abstractSecret.unsupported': method({
    kashfMethodId: 'hidden.abstractSecret.unsupported',
    kashfIntentId: 'hidden.abstractSecret',
    topicId: 'hiddenTreasure',
    sourcePages: [184, 188],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The audited body rules address physical hidden things/locations. They do not provide a verified canonical method for “what secret/truth is being hidden?”.',
  }),

  'money.lawfulness.unsupported': method({
    kashfMethodId: 'money.lawfulness.unsupported',
    kashfIntentId: 'money.lawfulness',
    topicId: 'money',
    sourcePages: [],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Audited p179-p182 money chapter did not yield an explicit body-source lawful/unlawful money method. Do not revive the previously assumed H9+H11 rule without a source passage.',
  }),

  'debt.outcome.unsupported': method({
    kashfMethodId: 'debt.outcome.unsupported',
    kashfIntentId: 'debt.outcome',
    topicId: 'loan',
    sourcePages: [179],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'p179 contains a financial-claim passage, but no single canonical body method has been selected for the broad UI question “old debt — what will happen?”. Keep blocked rather than generalize.',
  }),

  'property.sale.unsupported': method({
    kashfMethodId: 'property.sale.unsupported',
    kashfIntentId: 'property.sale',
    topicId: 'commerce',
    sourcePages: [],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'No audited body-source canonical method has been selected for whether a specific property will sell. Do not fall back to non-body commerce rules.',
  }),

  'money.missingMixedScope.unsupported': method({
    kashfMethodId: 'money.missingMixedScope.unsupported',
    kashfIntentId: 'money.missingMixedScope',
    topicId: 'money',
    sourcePages: [],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'The current UI mixes physically lost money, theft, unpaid debt and failed investment. These are different intents and must be split before any Kashf method is selected.',
  }),

  // ── LEGACY UNSUPPORTED PLACEHOLDER (kept only for old P0 route history) -
  'spiritual.affectedBySorcery.unsupported': method({
    kashfMethodId: 'spiritual.affectedBySorcery.unsupported',
    kashfIntentId: 'spiritual.affectedBySorcery',
    topicId: 'spiritualDiagnostics',
    sourcePages: [167],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    executorStatus: 'not-applicable',
    notes: 'Compatibility placeholder only. p167 asks whether the querent acts by sorcery on the quesited person; it does not answer whether the querent is affected by sorcery/evil eye/jinn.',
  }),
});

export function getKashfMethod(kashfMethodId) {
  return KASHF_CANONICAL_METHODS[kashfMethodId] || null;
}

export function getKashfMethodsForIntent(kashfIntentId) {
  return Object.values(KASHF_CANONICAL_METHODS)
    .filter((entry) => entry.kashfIntentId === kashfIntentId);
}

export function getCanonicalKashfMethodForIntent(kashfIntentId) {
  const matches = getKashfMethodsForIntent(kashfIntentId)
    .filter((entry) => entry.methodRole === 'canonical-operational');
  return matches.length === 1 ? matches[0] : null;
}

export function canRunKashfMethod(kashfMethodId) {
  const entry = getKashfMethod(kashfMethodId);
  return !!entry
    && entry.methodRole === 'canonical-operational'
    && entry.kashfRuntimeStatus === 'ready'
    && entry.executorStatus === 'ready'
    && entry.runtimeAllowed === true;
}

export function validateKashfMethodRegistry() {
  const errors = [];
  const seenIds = new Set();
  const canonicalByIntent = new Map();

  for (const [key, entry] of Object.entries(KASHF_CANONICAL_METHODS)) {
    if (!entry || typeof entry !== 'object') {
      errors.push(`${key}: method entry must be an object`);
      continue;
    }
    if (entry.kashfMethodId !== key) errors.push(`${key}: key must equal kashfMethodId`);
    if (seenIds.has(entry.kashfMethodId)) errors.push(`${key}: duplicate kashfMethodId`);
    seenIds.add(entry.kashfMethodId);

    if (!entry.kashfIntentId) errors.push(`${key}: kashfIntentId is required`);
    if (!KASHF_RUNTIME_STATUSES.includes(entry.kashfRuntimeStatus)) {
      errors.push(`${key}: invalid kashfRuntimeStatus ${entry.kashfRuntimeStatus}`);
    }
    if (!KASHF_METHOD_ROLES.includes(entry.methodRole)) {
      errors.push(`${key}: invalid methodRole ${entry.methodRole}`);
    }
    if (!KASHF_EXECUTOR_STATUSES.includes(entry.executorStatus)) {
      errors.push(`${key}: invalid executorStatus ${entry.executorStatus}`);
    }
    if (entry.runtimeAllowed && entry.kashfRuntimeStatus !== 'ready') {
      errors.push(`${key}: runtimeAllowed=true requires status=ready`);
    }
    if (entry.runtimeAllowed && entry.methodRole !== 'canonical-operational') {
      errors.push(`${key}: runtimeAllowed=true requires canonical-operational role`);
    }
    if (entry.runtimeAllowed && entry.executorStatus !== 'ready') {
      errors.push(`${key}: runtimeAllowed=true requires executorStatus=ready`);
    }

    if (entry.methodRole === 'canonical-operational') {
      const existing = canonicalByIntent.get(entry.kashfIntentId);
      if (existing) {
        errors.push(`${entry.kashfIntentId}: more than one canonical-operational method (${existing}, ${entry.kashfMethodId})`);
      } else {
        canonicalByIntent.set(entry.kashfIntentId, entry.kashfMethodId);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

export default {
  KASHF_RUNTIME_STATUSES,
  KASHF_METHOD_ROLES,
  KASHF_EXECUTOR_STATUSES,
  KASHF_CANONICAL_METHODS,
  getKashfMethod,
  getKashfMethodsForIntent,
  getCanonicalKashfMethodForIntent,
  canRunKashfMethod,
  validateKashfMethodRegistry,
};
