/**
 * kashf-ai-retrieval-index.js
 *
 * Machine-facing retrieval index for the Hebrew Kashf v57 knowledge layer.
 *
 * Why this exists:
 * - kashf-v57-topic-index.html is an excellent human/page navigation index,
 *   but it is chapter/page oriented.
 * - The AI needs method-level retrieval: user wording -> exact intent -> exact
 *   canonical method -> exact v57 page(s) -> runtime status.
 * - This module derives its records from the canonical registries so the AI
 *   index cannot silently drift away from routing/runtime truth.
 *
 * Source policy:
 * - v57 Hebrew is operational-primary.
 * - Arabic remains verification-only.
 * - Retrieval NEVER changes runtimeAllowed/executorStatus.
 * - A good retrieval hit does not authorize execution of a blocked/pending
 *   method.
 */

import { KASHF_CANONICAL_METHODS } from './kashf-canonical-method-registry.js';
import { KASHF_QUESTION_ROUTES } from './kashf-question-route-registry.js';
import { KASHF_V57_KNOWLEDGE } from './kashf-v57-knowledge-registry.js';

const HEBREW_DIACRITICS_RE = /[\u0591-\u05C7]/g;
const PUNCT_RE = /[\u05BE\u05F3\u05F4'"״׳,:;.!?()\[\]{}\/\\|+*=<>—–_-]+/g;

const STOPWORDS = new Set([
  'האם', 'מה', 'מי', 'איך', 'כיצד', 'למה', 'מדוע', 'של', 'את', 'על', 'עם',
  'אל', 'מן', 'מ', 'ב', 'ל', 'כ', 'ו', 'או', 'גם', 'זה', 'זו', 'זאת', 'הוא',
  'היא', 'הם', 'הן', 'יש', 'אין', 'יהיה', 'תהיה', 'אני', 'לי', 'לו', 'לה',
  'אותו', 'אותה', 'אדם', 'איש', 'אישה', 'דבר', 'עניין',
]);

/**
 * Curated natural-language aliases for intents that already matter to the
 * canonical app flow. These aliases are retrieval hints only; they are never
 * executable rules.
 */
const RETRIEVAL_OVERRIDES = Object.freeze({
  'completion.p173.fireRows15910': {
    aliases: ['האם העניין יושלם', 'האם הדבר יצליח', 'האם אצליח', 'השלמת העניין', 'הצלחת העניין'],
    doNotMixWith: ['matter.p172.h17_h1011_thenCombine'],
    houses: [1, 5, 9, 10],
  },
  'matter.p172.h17_h1011_thenCombine': {
    aliases: ['מה תוצאת העניין', 'תוצאת עניינו של השואל', 'האם העניין טוב או רע', 'תוצאת הדבר'],
    doNotMixWith: ['completion.p173.fireRows15910'],
    houses: [1, 7, 10, 11],
  },
  'relocation.p183.h4h15': {
    aliases: ['מעבר ממקום למקום', 'איך יהיה המקום החדש', 'מה טיב המקום שאליו עוברים', 'מקום חדש'],
    doNotMixWith: ['relocation.p183.currentVsNewPlace', 'relocation.p183.stayMoveH1H2'],
    houses: [4, 15],
  },
  'relocation.p183.currentVsNewPlace': {
    aliases: ['האם המקום הנוכחי טוב', 'האם המעבר טוב', 'מקום נוכחי מול מקום חדש', 'השוואת מגורים ומעבר'],
    doNotMixWith: ['relocation.p183.h4h15', 'relocation.p183.stayMoveH1H2'],
    houses: [1, 4, 7, 10],
  },
  'relocation.p183.stayMoveH1H2': {
    aliases: ['להישאר במקום או לעבור', 'האם כדאי להישאר כאן', 'האם כדאי לעבור מכאן', 'להישאר בעיר או לעזוב', 'להישאר או לעבור'],
    doNotMixWith: ['relocation.p183.h4h15', 'relocation.p183.currentVsNewPlace'],
    houses: [1, 2],
  },
  'siblings.p182.h1h3': {
    aliases: ['יחסים בין אחים', 'הסכמה בין אחים', 'מצב האחים', 'האם האחים מסתדרים'],
    houses: [1, 3],
  },
  'travel.p238.assemble1359': {
    aliases: ['האם המסע טוב', 'האם הנסיעה מוצלחת', 'האם כדאי לצאת למסע', 'הצלחת הנסיעה', 'בטיחות והצלחת המסע'],
    houses: [1, 3, 5, 9],
  },
  'illness.p196.outcomeH15': {
    aliases: ['האם החולה יחלים', 'האם יתרפא', 'החלמה ממחלה', 'האם המחלה תתארך', 'תוצאת החולי'],
    doNotMixWith: ['illness.bodyPart.h6Figure'],
    houses: [15],
  },
  'illness.bodyPart.h6Figure': {
    aliases: ['איפה בגוף החולי', 'איזה איבר חולה', 'מקום המחלה בגוף', 'איבר הגוף החולה'],
    doNotMixWith: ['illness.p196.outcomeH15'],
    houses: [6],
  },
  'pregnancy.p191.existsH5SilentEmpty': {
    aliases: ['האם יש הריון', 'האם ההריון נכון', 'האם היא בהריון', 'קיום הריון'],
    doNotMixWith: ['pregnancy.p191.genderH5', 'pregnancy.p191.childSafetyH1H6H8', 'pregnancy.p191.deliveryDifficultyH1H5H15'],
    houses: [5],
  },
  'pregnancy.p191.genderH5': {
    aliases: ['מין הוולד', 'בן או בת', 'זכר או נקבה בהריון', 'מה מין התינוק'],
    doNotMixWith: ['pregnancy.p191.existsH5SilentEmpty', 'pregnancy.p191.childSafetyH1H6H8', 'pregnancy.p191.deliveryDifficultyH1H5H15'],
    houses: [5],
  },
  'hidden.p188.isStillThere': {
    aliases: ['האם הדבר הנסתר עדיין שם', 'האם המטמון במקומו', 'האם החפץ המוסתר עדיין במקום', 'דבר נסתר במקומו'],
    houses: [1, 2, 4, 13, 14, 15],
  },
  'lostItem.p202.returnH6H8': {
    aliases: ['האם האבדה תחזור', 'האם החפץ האבוד ישוב', 'האם אמצא את האבדה', 'שיבת האבדה', 'חיה אבודה תחזור'],
    houses: [6, 8],
  },
  'marriage.p204.dowryH8': {
    aliases: ['מה גודל המוהר', 'האם המוהר גדול', 'גובה המוהר', 'מוהר בנישואין'],
    doNotMixWith: ['marriage.p204.previousStatusH7inH10', 'love.p204.attentionFireRows1713'],
    houses: [8],
  },
  'marriage.p204.previousStatusH7inH10': {
    aliases: ['בתולה או גרושה', 'האם היא גרושה', 'האם היא בתולה', 'מצב קודם של האישה'],
    doNotMixWith: ['marriage.p204.dowryH8', 'love.p204.attentionFireRows1713'],
    houses: [7, 10],
  },
  'love.p204.attentionFireRows1713': {
    aliases: ['האם הוא מביט אלי', 'האם היא מביטה אלי', 'אל מי מופנה המבט', 'מביטים זה בזה', 'תשומת לב באהבה'],
    doNotMixWith: ['marriage.p204.dowryH8', 'marriage.p204.previousStatusH7inH10'],
    houses: [1, 7, 13],
  },
  'authority.p256.honorConditionH10Planet': {
    aliases: ['מה מצב הכבוד והמעמד', 'כבוד ושררה', 'מעמד אצל השלטון', 'מצב המשרה והכבוד'],
    doNotMixWith: ['authority.p257.appointmentH1H10Planet', 'authority.p257.rulerConditionH7H10'],
    houses: [10],
  },
  'authority.p257.appointmentH1H10Planet': {
    aliases: ['האם יקבל משרה', 'האם יתמנה לתפקיד', 'קבלת תפקיד', 'מינוי למשרה'],
    doNotMixWith: ['authority.p256.honorConditionH10Planet', 'authority.p257.rulerConditionH7H10'],
    houses: [1, 10],
  },
  'authority.p257.rulerConditionH7H10': {
    aliases: ['מה מצב השליט', 'מצב בעל השררה', 'טובת השליט או רעתו', 'דין המושל'],
    doNotMixWith: ['authority.p256.honorConditionH10Planet', 'authority.p257.appointmentH1H10Planet'],
    houses: [7, 10],
  },
  'profession.p254.h9Planet': {
    aliases: ['מה המקצוע שלו', 'איזו מלאכה מתאימה', 'מקצוע ומלאכה', 'עיסוק לפי בית תשיעי'],
    houses: [9, 10, 11],
  },
  'theft.p224.relationshipH7Recurrence': {
    aliases: ['מה הקשר של הגנב', 'האם הגנב קרוב', 'קשר הגנב לבעל הדבר', 'קרבת הגנב'],
    doNotMixWith: ['theft.p225.thiefDescriptionH7'],
    houses: [7],
  },
  'theft.p225.thiefDescriptionH7': {
    aliases: ['תיאור הגנב', 'איך הגנב נראה', 'מראה הגנב', 'אותיות שם הגנב'],
    doNotMixWith: ['theft.p224.relationshipH7Recurrence'],
    houses: [7],
  },
  'religion.p253.h3h9Quality': {
    aliases: ['מה מצב דתו', 'האם הוא בעל דת', 'יראת אלוהים', 'צדקות ודת', 'מצב האמונה והדת'],
    houses: [3, 9],
  },
  'dispute.p212.reconciliationH1H7': {
    aliases: ['האם יהיה פיוס', 'האם הצדדים יתפייסו', 'פשרה בין הצדדים', 'שלום אחרי סכסוך', 'גישור ופיוס'],
    houses: [1, 7],
  },
  'desire.p206.querentWantsH7H11ThenH5': {
    aliases: ['האם השואל רוצה בדבר', 'האם אני רוצה בזה', 'רצון השואל בדבר', 'האם הוא רוצה בעניין'],
    doNotMixWith: ['love.p206.womanFavorH7H11ThenH5'],
    houses: [7, 11, 5],
  },
  'love.p206.womanFavorH7H11ThenH5': {
    aliases: ['האם האישה תמצא חן בעיניו', 'האם היא תמצא חן בעיניו', 'האם האישה מוצאת חן בעיני האיש', 'האם היא מוצאת חן בעיניי'],
    doNotMixWith: ['desire.p206.querentWantsH7H11ThenH5', 'love.p204.attentionFireRows1713'],
    houses: [7, 11, 5],
  },
  'money.p179.sourceByIncomingHonorHouse': {
    aliases: ['מאיפה יגיע הכסף', 'מה מקור הכסף', 'מאיזה מקום יבוא הכסף', 'מאיזה ערוץ יגיע הממון', 'מקור הממון'],
    doNotMixWith: ['money.p180.livelihoodH10Invert', 'money.p181.recast25811', 'inheritance.p180.elementComposite'],
    houses: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
  'spiritual.p167.hiddenActionAirRows46815': {
    aliases: ['האם יש פעולה מאחורי הדבר', 'פעולה נסתרת מאחורי הדבר', 'האם יש פעולה סמויה מאחורי העניין', 'פעולה נסתרת מאחורי העניין'],
    doNotMixWith: ['spiritual.affectedBySorcery.unsupported', 'spiritual.sorcererIdentity.unsupported', 'spiritual.jinnType.unsupported'],
    houses: [4, 6, 8, 15],
  },
  'clothing.p264-265.luck': {
    aliases: ['מה מזלי בלבוש', 'האם יש מזל בבגדים', 'מזל בלבושים', 'מזל בבגד', 'לבוש מלכים'],
    doNotMixWith: ['clothing.color', 'clothing.fixedMutable'],
    houses: [5, 10, 11],
  },
});

function uniq(values) {
  return [...new Set(values.filter((value) => value !== null && value !== undefined && value !== ''))];
}

export function normalizeKashfRetrievalText(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .replace(HEBREW_DIACRITICS_RE, '')
    .replace(PUNCT_RE, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function tokenizeKashfRetrievalText(value) {
  return uniq(
    normalizeKashfRetrievalText(value)
      .split(' ')
      .map((token) => token.trim())
      .filter((token) => token.length > 1 && !STOPWORDS.has(token))
  );
}

function getQuestionRoutesForMethod(methodId) {
  return Object.values(KASHF_QUESTION_ROUTES).filter((route) => route.kashfMethodId === methodId);
}

function buildRecord(methodId, knowledge) {
  const method = KASHF_CANONICAL_METHODS[methodId] || null;
  if (!method || !knowledge) return null;

  const routes = getQuestionRoutesForMethod(methodId);
  const override = RETRIEVAL_OVERRIDES[methodId] || {};
  const v57 = knowledge.v57 || {};
  const pages = uniq([...(method.sourcePages || []), v57.page, ...(v57.detailPages || [])]).sort((a, b) => a - b);
  const supportingPages = uniq([...(v57.supportingPages || [])]).sort((a, b) => a - b);
  const aliases = uniq([...(override.aliases || [])]);
  const questionIds = uniq(routes.map((route) => route.questionId));
  const routeDispositions = uniq(routes.map((route) => route.disposition));
  const routeAliases = uniq(routes.map((route) => route.aliasOf));

  const searchableParts = [
    methodId,
    method.kashfIntentId,
    method.topicId,
    v57.topic,
    v57.heading,
    v57.hebrewRule,
    ...aliases,
    ...questionIds,
    ...routeAliases,
    ...pages.map(String),
  ];

  return Object.freeze({
    kashfMethodId: methodId,
    kashfIntentId: method.kashfIntentId,
    topicId: method.topicId,
    methodRole: method.methodRole,
    kashfRuntimeStatus: method.kashfRuntimeStatus,
    runtimeAllowed: method.runtimeAllowed === true,
    executorStatus: method.executorStatus,
    executionKind: method.executionKind,
    sourceConfidence: method.sourceConfidence,
    questionIds: Object.freeze(questionIds),
    routeAliases: Object.freeze(routeAliases),
    routeDispositions: Object.freeze(routeDispositions),
    aliases: Object.freeze(aliases),
    houses: Object.freeze([...(override.houses || [])]),
    doNotMixWith: Object.freeze([...(override.doNotMixWith || [])]),
    pages: Object.freeze(pages),
    supportingPages: Object.freeze(supportingPages),
    v57: Object.freeze({
      version: v57.version,
      indexFile: v57.indexFile,
      draftFile: v57.draftFile,
      page: v57.page,
      anchor: v57.anchor,
      topic: v57.topic,
      heading: v57.heading,
      hebrewRule: v57.hebrewRule,
    }),
    operationalLanguage: knowledge.knowledgeLanguage,
    operationalRole: knowledge.knowledgeRole,
    arabicVerificationRole: knowledge.arabicVerification?.role || null,
    arabicVerificationPages: Object.freeze([...(knowledge.arabicVerification?.pages || [])]),
    notes: knowledge.notes || method.notes || null,
    searchText: normalizeKashfRetrievalText(searchableParts.join(' ')),
    searchTokens: Object.freeze(tokenizeKashfRetrievalText(searchableParts.join(' '))),
  });
}

export const KASHF_AI_RETRIEVAL_INDEX = Object.freeze(
  Object.fromEntries(
    Object.entries(KASHF_V57_KNOWLEDGE)
      .map(([methodId, knowledge]) => [methodId, buildRecord(methodId, knowledge)])
      .filter(([, record]) => Boolean(record))
  )
);

export function getKashfAiRetrievalRecord(methodId) {
  return KASHF_AI_RETRIEVAL_INDEX[methodId] || null;
}

function scoreRecord(record, query, queryTokens) {
  const normalizedQuery = normalizeKashfRetrievalText(query);
  let score = 0;
  const reasons = [];

  if (!normalizedQuery) return { score: 0, reasons };
  if (normalizeKashfRetrievalText(record.kashfMethodId) === normalizedQuery) {
    score += 200;
    reasons.push('exact-method-id');
  }
  if (normalizeKashfRetrievalText(record.kashfIntentId) === normalizedQuery) {
    score += 180;
    reasons.push('exact-intent-id');
  }
  if (record.questionIds.some((id) => normalizeKashfRetrievalText(id) === normalizedQuery)) {
    score += 170;
    reasons.push('exact-question-id');
  }

  for (const alias of record.aliases) {
    const normalizedAlias = normalizeKashfRetrievalText(alias);
    if (normalizedAlias === normalizedQuery) {
      score += 150;
      reasons.push(`exact-alias:${alias}`);
    } else if (normalizedQuery.includes(normalizedAlias) || normalizedAlias.includes(normalizedQuery)) {
      score += 80;
      reasons.push(`alias-phrase:${alias}`);
    }
  }

  const aliasTokens = new Set(tokenizeKashfRetrievalText(record.aliases.join(' ')));
  const headingTokens = new Set(tokenizeKashfRetrievalText(`${record.v57.topic} ${record.v57.heading}`));
  const ruleTokens = new Set(tokenizeKashfRetrievalText(record.v57.hebrewRule));

  let aliasOverlap = 0;
  let headingOverlap = 0;
  let ruleOverlap = 0;
  for (const token of queryTokens) {
    if (aliasTokens.has(token)) aliasOverlap += 1;
    if (headingTokens.has(token)) headingOverlap += 1;
    if (ruleTokens.has(token)) ruleOverlap += 1;
  }
  if (aliasOverlap) {
    score += aliasOverlap * 24;
    reasons.push(`alias-token-overlap:${aliasOverlap}`);
  }
  if (headingOverlap) {
    score += headingOverlap * 12;
    reasons.push(`heading-token-overlap:${headingOverlap}`);
  }
  if (ruleOverlap) {
    score += ruleOverlap * 5;
    reasons.push(`rule-token-overlap:${ruleOverlap}`);
  }

  const numericTokens = queryTokens.filter((token) => /^\d+$/.test(token));
  for (const token of numericTokens) {
    if (record.pages.includes(Number(token))) {
      score += 35;
      reasons.push(`page:${token}`);
    }
  }

  // Small ranking preference only. It NEVER authorizes execution.
  if (record.runtimeAllowed && record.executorStatus === 'ready') score += 3;

  return { score, reasons };
}

export function searchKashfAiRetrievalIndex(query, options = {}) {
  const {
    limit = 8,
    sourceReadyOnly = false,
    runnableOnly = false,
    includeStatuses = null,
  } = options;

  const queryTokens = tokenizeKashfRetrievalText(query);
  const records = Object.values(KASHF_AI_RETRIEVAL_INDEX).filter((record) => {
    if (sourceReadyOnly && record.kashfRuntimeStatus !== 'ready') return false;
    if (runnableOnly && !(record.runtimeAllowed && record.executorStatus === 'ready')) return false;
    if (Array.isArray(includeStatuses) && includeStatuses.length > 0 && !includeStatuses.includes(record.kashfRuntimeStatus)) return false;
    return true;
  });

  return records
    .map((record) => {
      const scored = scoreRecord(record, query, queryTokens);
      return Object.freeze({ ...record, retrievalScore: scored.score, retrievalReasons: Object.freeze(scored.reasons) });
    })
    .filter((record) => record.retrievalScore > 0)
    .sort((a, b) => b.retrievalScore - a.retrievalScore || a.kashfMethodId.localeCompare(b.kashfMethodId))
    .slice(0, Math.max(1, Number(limit) || 8));
}

export function resolveBestKashfAiRetrievalHit(query, options = {}) {
  const [best = null, second = null] = searchKashfAiRetrievalIndex(query, { ...options, limit: 2 });
  if (!best) return Object.freeze({ resolved: false, reason: 'no-match', best: null, alternatives: Object.freeze([]) });

  // Exact identifiers/aliases can resolve directly. Otherwise require a useful
  // margin so ambiguous natural language does not silently choose a method.
  const hasExactReason = best.retrievalReasons.some((reason) => reason.startsWith('exact-'));
  const margin = second ? best.retrievalScore - second.retrievalScore : best.retrievalScore;
  const singleTokenNaturalQuery = !hasExactReason && tokenizeKashfRetrievalText(query).length <= 1 && Boolean(second);
  const resolved = hasExactReason || (!singleTokenNaturalQuery && best.retrievalScore >= 45 && margin >= 12);

  return Object.freeze({
    resolved,
    reason: resolved ? 'ranked-match' : 'ambiguous-match',
    best,
    alternatives: Object.freeze(second ? [second] : []),
    scoreMargin: margin,
  });
}

export function validateKashfAiRetrievalIndex() {
  const errors = [];
  const warnings = [];
  const records = Object.values(KASHF_AI_RETRIEVAL_INDEX);

  const sourceReadyMethods = Object.values(KASHF_CANONICAL_METHODS).filter(
    (method) => method.methodRole === 'canonical-operational' && method.kashfRuntimeStatus === 'ready'
  );
  const runnableMethods = sourceReadyMethods.filter(
    (method) => method.runtimeAllowed === true && method.executorStatus === 'ready'
  );

  for (const method of sourceReadyMethods) {
    const record = KASHF_AI_RETRIEVAL_INDEX[method.kashfMethodId];
    if (!record) {
      errors.push(`${method.kashfMethodId}: source-ready method missing AI retrieval record`);
      continue;
    }
    if (record.operationalLanguage !== 'he') errors.push(`${method.kashfMethodId}: operational language must be he`);
    if (record.operationalRole !== 'operational-primary') errors.push(`${method.kashfMethodId}: v57 must be operational-primary`);
    if (record.arabicVerificationRole !== 'verification-only') errors.push(`${method.kashfMethodId}: Arabic must be verification-only`);
    if (record.v57.indexFile !== 'kashf-v57-topic-index.html') errors.push(`${method.kashfMethodId}: wrong topic index file`);
    if (record.v57.draftFile !== 'kashf-v57-draft.html') errors.push(`${method.kashfMethodId}: wrong v57 draft file`);
    if (!record.v57.anchor || !record.pages.length) errors.push(`${method.kashfMethodId}: missing page/anchor traceability`);
  }

  for (const route of Object.values(KASHF_QUESTION_ROUTES)) {
    const record = KASHF_AI_RETRIEVAL_INDEX[route.kashfMethodId];
    if (!record) continue; // unsupported/external routes may intentionally have no v57 record
    if (!record.questionIds.includes(route.questionId)) {
      errors.push(`${route.questionId}: route is not linked into retrieval record ${route.kashfMethodId}`);
    }
  }

  for (const record of records) {
    if (!record.aliases.length && record.runtimeAllowed && record.executorStatus === 'ready') {
      warnings.push(`${record.kashfMethodId}: runnable method has no curated natural-language aliases yet`);
    }
  }

  return Object.freeze({
    valid: errors.length === 0,
    errors: Object.freeze(errors),
    warnings: Object.freeze(warnings),
    recordCount: records.length,
    sourceReadyCount: sourceReadyMethods.length,
    runnableCount: runnableMethods.length,
    sourceReadyCoveredCount: sourceReadyMethods.filter((method) => Boolean(KASHF_AI_RETRIEVAL_INDEX[method.kashfMethodId])).length,
    runnableCoveredCount: runnableMethods.filter((method) => Boolean(KASHF_AI_RETRIEVAL_INDEX[method.kashfMethodId])).length,
  });
}

export default {
  KASHF_AI_RETRIEVAL_INDEX,
  normalizeKashfRetrievalText,
  tokenizeKashfRetrievalText,
  getKashfAiRetrievalRecord,
  searchKashfAiRetrievalIndex,
  resolveBestKashfAiRetrievalHit,
  validateKashfAiRetrievalIndex,
};
