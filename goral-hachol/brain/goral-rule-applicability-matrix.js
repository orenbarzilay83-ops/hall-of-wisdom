/**
 * goral-rule-applicability-matrix.js
 *
 * questionType x method x ruleCategory -> applicability value.
 * Values: 'required' | 'allowed' | 'conditional' | 'advisorOnly' | 'forbidden' | 'unavailable'
 * Canonical source of these values: goral-hachol/intelligence/reading-intelligence-types.js
 * (RULE_DECISION_VALUES) — this file re-exports it as APPLICABILITY_VALUES rather than
 * maintaining a parallel list, per Hall of Wisdom Core vocabulary alignment.
 *
 * Built as DEFAULT_ROW + explicit per-questionType overrides, so every
 * deviation from the default is visible and auditable rather than being
 * one of 16*2*9 hand-typed cells. Overrides are grounded directly in the
 * real gating code (goral-rule-applicability.js, goral-qa-deterministic-checks.js) —
 * see the `evidence` field on each override.
 */

import { getAllQuestionTypeIds } from './goral-question-taxonomy.js';
import { RULE_DECISION_VALUES } from '../intelligence/reading-intelligence-types.js';

export const RULE_CATEGORIES = [
  'dhamir',
  'timing',
  'spiritual',
  'characterNature',
  'houseMeanings',
  'witnessesJudge',
  'verificationRules',
  'formulaOnlyHouses',
  'clientWording',
];

export const APPLICABILITY_VALUES = RULE_DECISION_VALUES;

const DEFAULT_ROW = {
  dhamir: 'advisorOnly',
  timing: 'forbidden',
  spiritual: 'forbidden',
  characterNature: 'forbidden',
  houseMeanings: 'required',
  witnessesJudge: 'allowed',
  verificationRules: 'allowed',
  formulaOnlyHouses: 'allowed',
  clientWording: 'required',
};

const METHOD_DEFAULT_OVERRIDES = {
  kashf: { verificationRules: 'required', formulaOnlyHouses: 'allowed' },
  hawi: { witnessesJudge: 'required', formulaOnlyHouses: 'unavailable' },
};

/**
 * questionType-level overrides. Only cells that differ from
 * DEFAULT_ROW + METHOD_DEFAULT_OVERRIDES are listed.
 * `evidence` points to the real code path that justifies the override.
 */
const QUESTION_TYPE_OVERRIDES = {
  loveRelationship: {
    both: {
      characterNature: {
        value: 'allowed',
        evidence:
          "goral-qa-deterministic-checks.js::checkTemperamentLeak skips category==='loveIntention' — " +
          'temperament content is expected/legitimate for love questions, not a leak.',
      },
    },
  },
  hiddenThoughtIntent: {
    both: {
      dhamir: {
        value: 'advisorOnly',
        evidence:
          'DHAMIR_CLIENT_VISIBLE_TOPICS is empty for both methods (goral-rule-applicability.js) — ' +
          'even for this questionType, current code still hides dhamir from the client. ' +
          'Kept as advisorOnly (matching real behavior) rather than "required", with a gap flagged ' +
          'in goral-question-taxonomy.js (hiddenThoughtIntent.gapNote). Needs explicit decision from Oren ' +
          'before this can become client-visible.',
      },
    },
  },
  timing: {
    both: {
      timing: {
        value: 'allowed',
        evidence:
          "goral-qa-deterministic-checks.js::checkTimingLeak skips category==='timing' — " +
          'but no dedicated timing-only rendering path exists (bundled inside the always-hidden dhamir card). ' +
          'Marked "allowed" (not "required") because current code cannot guarantee it is actually shown.',
      },
    },
  },
  spiritual: {
    both: {
      spiritual: {
        value: 'required',
        evidence:
          'goral-question-taxonomy.js spiritual.requiredRuleCategories includes "spiritual" — ' +
          'the spiritualDiagnostics topicId is exactly what this questionType asks for in both methods, ' +
          'so spiritual-category content here is expected, not a leak (DEFAULT_ROW forbids it everywhere else).',
      },
    },
    hawi: {
      dhamir: {
        value: 'allowed',
        evidence:
          'goral-conclusion-writer.js::buildSpiritualNarrative calls dhamirParagraph() unconditionally ' +
          '(not gated by getSectionVisibility) — this is real, current, intentional behavior per prior ' +
          'explicit instruction "לא לגעת באבחון הרוחני". Registered as an allowed exception for this exact ' +
          'method+questionType cell only, not a general dhamir policy change.',
      },
    },
  },
  personCharacter: {
    both: {
      characterNature: {
        value: 'allowed',
        evidence:
          'Explicit character question — characterNature content is the expected answer, not a leak. ' +
          'NOTE: checkTemperamentLeak currently only skips for category==="loveIntention", not "personCharacter" — ' +
          'a real scenario of this type would be mis-flagged by the existing deterministic check until fixed.',
      },
    },
  },
};

function buildRow(method) {
  return { ...DEFAULT_ROW, ...(METHOD_DEFAULT_OVERRIDES[method] || {}) };
}

function buildMatrix() {
  const matrix = {};
  for (const questionTypeId of getAllQuestionTypeIds()) {
    matrix[questionTypeId] = { kashf: buildRow('kashf'), hawi: buildRow('hawi') };
    const overrides = QUESTION_TYPE_OVERRIDES[questionTypeId];
    if (!overrides) continue;

    for (const method of ['kashf', 'hawi']) {
      const methodOverrides = { ...(overrides.both || {}), ...(overrides[method] || {}) };
      for (const [ruleCategory, override] of Object.entries(methodOverrides)) {
        matrix[questionTypeId][method][ruleCategory] = override.value;
      }
    }
  }
  return matrix;
}

export const RULE_APPLICABILITY_MATRIX = buildMatrix();

export const MATRIX_OVERRIDE_EVIDENCE = QUESTION_TYPE_OVERRIDES;

export function getApplicability(questionTypeId, method, ruleCategory) {
  const row = RULE_APPLICABILITY_MATRIX[questionTypeId]?.[method];
  if (!row) return 'unavailable';
  return row[ruleCategory] ?? 'unavailable';
}

export default { RULE_CATEGORIES, APPLICABILITY_VALUES, RULE_APPLICABILITY_MATRIX, MATRIX_OVERRIDE_EVIDENCE, getApplicability };
