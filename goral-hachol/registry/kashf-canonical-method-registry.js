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
  legacyTopicId,
  legacyFormulaSlot,
  notes,
});

/**
 * P0 registry.
 *
 * This first slice intentionally records both runnable and non-runnable
 * methods so the router can block unsafe questions BEFORE an engine runs.
 */
export const KASHF_CANONICAL_METHODS = Object.freeze({
  // ── READY pilot slice ---------------------------------------------------
  'completion.p173.fireRows15910': method({
    kashfMethodId: 'completion.p173.fireRows15910',
    kashfIntentId: 'completion.willComplete',
    topicId: 'completion',
    sourcePages: [173],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'formula',
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
    legacyTopicId: 'relocation',
    legacyFormulaSlot: 'primaryFormula',
  }),

  'illness.p196.outcomeH15': method({
    kashfMethodId: 'illness.p196.outcomeH15',
    kashfIntentId: 'illness.recovery',
    topicId: 'illness',
    sourcePages: [196],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    legacyTopicId: 'illness',
    notes: 'Canonical recovery intent is the H15 benefic/malefic rule; topic bundle contains additional illness intents and must not be used as a substitute.',
  }),

  'illness.bodyPart.h6Figure': method({
    kashfMethodId: 'illness.bodyPart.h6Figure',
    kashfIntentId: 'illness.bodyPart',
    topicId: 'illness',
    sourcePages: [199],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'legacy-function',
    legacyTopicId: 'illness',
    notes: 'Use the verified H6 figure → body-part mapping only.',
  }),

  'pregnancy.p191.genderH5': method({
    kashfMethodId: 'pregnancy.p191.genderH5',
    kashfIntentId: 'pregnancy.gender',
    topicId: 'children',
    sourcePages: [191],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    legacyTopicId: 'children',
  }),

  'siblings.p182.h1h3': method({
    kashfMethodId: 'siblings.p182.h1h3',
    kashfIntentId: 'siblings.relationship',
    topicId: 'siblings',
    sourcePages: [182],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'formula',
    legacyTopicId: 'siblings',
    legacyFormulaSlot: 'primaryFormula',
  }),

  'siblings.p182.seniority': method({
    kashfMethodId: 'siblings.p182.seniority',
    kashfIntentId: 'siblings.seniority',
    topicId: 'siblings',
    sourcePages: [182],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    legacyTopicId: 'siblings',
  }),

  'marriage.p204.previousStatusH7': method({
    kashfMethodId: 'marriage.p204.previousStatusH7',
    kashfIntentId: 'marriage.previousStatus',
    topicId: 'marriage',
    sourcePages: [204],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'custom-engine',
    legacyTopicId: 'marriage',
  }),

  'travel.p238.assemble1359': method({
    kashfMethodId: 'travel.p238.assemble1359',
    kashfIntentId: 'travel.success',
    topicId: 'travel',
    sourcePages: [238],
    kashfRuntimeStatus: 'ready',
    runtimeAllowed: true,
    executionKind: 'formula',
    legacyTopicId: 'travel',
    legacyFormulaSlot: 'primaryFormula',
  }),

  // ── REPAIR REQUIRED ----------------------------------------------------
  'friends.p263.h1h11': method({
    kashfMethodId: 'friends.p263.h1h11',
    kashfIntentId: 'friends.relationship',
    topicId: 'friendsHope',
    sourcePages: [263, 264],
    kashfRuntimeStatus: 'repair-required',
    runtimeAllowed: false,
    executionKind: 'formula',
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
    legacyTopicId: 'enemies',
    notes: 'computeEnemyPresenceCheck matches the direct four-case source rule; legacy primary combine(1,12) must be bypassed.',
  }),

  // ── BLOCKED BY SOURCE --------------------------------------------------
  'travel.p242.vehicleSafety': method({
    kashfMethodId: 'travel.p242.vehicleSafety',
    kashfIntentId: 'travel.vehicleSafety',
    topicId: 'travel',
    sourcePages: [242],
    kashfRuntimeStatus: 'blocked-by-source',
    runtimeAllowed: false,
    executionKind: null,
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
    notes: 'Knowledge-only. Must never feed verdict.',
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
    notes: 'Post-ومن غير الكتاب material; knowledge-only by default.',
  }),

  // ── UNSUPPORTED QUESTION INTENTS --------------------------------------
  'spiritual.affectedBySorcery.unsupported': method({
    kashfMethodId: 'spiritual.affectedBySorcery.unsupported',
    kashfIntentId: 'spiritual.affectedBySorcery',
    topicId: 'spiritualDiagnostics',
    sourcePages: [167],
    methodRole: 'unresolved',
    kashfRuntimeStatus: 'unsupported',
    runtimeAllowed: false,
    executionKind: null,
    notes: 'p167 asks whether the querent acts by sorcery on the quesited person; it does not answer whether the querent is affected by sorcery/evil eye/jinn.',
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
  return !!entry && entry.methodRole === 'canonical-operational' && entry.runtimeAllowed === true;
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
    if (entry.runtimeAllowed && entry.kashfRuntimeStatus !== 'ready') {
      errors.push(`${key}: runtimeAllowed=true requires status=ready`);
    }
    if (entry.runtimeAllowed && entry.methodRole !== 'canonical-operational') {
      errors.push(`${key}: runtimeAllowed=true requires canonical-operational role`);
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
  KASHF_CANONICAL_METHODS,
  getKashfMethod,
  getKashfMethodsForIntent,
  getCanonicalKashfMethodForIntent,
  canRunKashfMethod,
  validateKashfMethodRegistry,
};
