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
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    legacyTopicId: 'generalReading',
    notes: 'Body-source general-state method. Must not execute the broad generalReading topic bundle.',
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
    runtimeAllowed: false,
    executionKind: 'legacy-function',
    executorStatus: 'pending',
    legacyTopicId: 'generalReading',
    notes: 'Existing clothing helper may be reused only after method-scoped executor wiring.',
  }),

  'matter.p172.h17_h1011_thenCombine': method({
    kashfMethodId: 'matter.p172.h17_h1011_thenCombine',
    kashfIntentId: 'matter.outcome',
    topicId: 'generalReading',
    sourcePages: [172],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'Combine 1+7, combine 10+11, then combine the two results. Distinct from completion p173.',
  }),

  'joy.p196.recast14511': method({
    kashfMethodId: 'joy.p196.recast14511',
    kashfIntentId: 'joy.occurrence',
    topicId: 'completion',
    sourcePages: [196],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'recast-board',
    executorStatus: 'pending',
    notes: 'Houses 1,4,5,11 become new mothers; this is occurrence of joy/event, not joy timing.',
  }),

  'relocation.p183.currentVsNewPlace': method({
    kashfMethodId: 'relocation.p183.currentVsNewPlace',
    kashfIntentId: 'relocation.isThisPlaceGood',
    topicId: 'relocation',
    sourcePages: [183],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    notes: 'Body-source comparison of current-place pair 1+4 with new-place pair 7+10.',
  }),

  'relocation.p183.stayMoveH1H2': method({
    kashfMethodId: 'relocation.p183.stayMoveH1H2',
    kashfIntentId: 'relocation.stayOrMove',
    topicId: 'relocation',
    sourcePages: [178, 183],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'legacy-function',
    executorStatus: 'pending',
    legacyTopicId: 'relocation',
    notes: 'Existing stay/move helper needs isolated canonical wiring and traceability cleanup.',
  }),

  'illness.p196.outcomeH15': method({
    kashfMethodId: 'illness.p196.outcomeH15',
    kashfIntentId: 'illness.recovery',
    topicId: 'illness',
    sourcePages: [196],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    legacyTopicId: 'illness',
    notes: 'Canonical recovery intent is the H15 benefic/malefic rule; topic bundle contains additional illness intents and must not be used as a substitute.',
  }),

  'illness.bodyPart.h6Figure': method({
    kashfMethodId: 'illness.bodyPart.h6Figure',
    kashfIntentId: 'illness.bodyPart',
    topicId: 'illness',
    sourcePages: [199],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'legacy-function',
    executorStatus: 'pending',
    legacyTopicId: 'illness',
    notes: 'Use the verified H6 figure → body-part mapping only; canonical legacy-function executor is not wired yet.',
  }),

  'pregnancy.p191.genderH5': method({
    kashfMethodId: 'pregnancy.p191.genderH5',
    kashfIntentId: 'pregnancy.gender',
    topicId: 'children',
    sourcePages: [191],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    legacyTopicId: 'children',
  }),

  'siblings.p182.seniority': method({
    kashfMethodId: 'siblings.p182.seniority',
    kashfIntentId: 'siblings.seniority',
    topicId: 'siblings',
    sourcePages: [182],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    legacyTopicId: 'siblings',
  }),

  'marriage.p204.previousStatusH7': method({
    kashfMethodId: 'marriage.p204.previousStatusH7',
    kashfIntentId: 'marriage.previousStatus',
    topicId: 'marriage',
    sourcePages: [204],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    legacyTopicId: 'marriage',
  }),

  // ── REPAIR REQUIRED ----------------------------------------------------
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

  'missing.p248.aliveOrDead': method({
    kashfMethodId: 'missing.p248.aliveOrDead',
    kashfIntentId: 'missing.aliveOrDead',
    topicId: 'missingPerson',
    sourcePages: [248],
    kashfRuntimeStatus: 'repair-required',
    runtimeAllowed: false,
    executionKind: 'custom-engine',
    executorStatus: 'pending',
    legacyTopicId: 'missingPerson',
    notes: 'Must use houses 3,5,9 plus recurrence in 8/6/12; current topic bundle uses other mechanisms.',
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
