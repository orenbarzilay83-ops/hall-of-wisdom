// EXTRA files are preferred where they exist — richer content (OLD + additional source rules).
// Original OLD files kept for source reference only.
import * as CHILDREN_PREGNANCY from './hawi-question-children-pregnancy-extra.js';
import * as COMMERCE from './hawi-question-commerce.js';
import * as COMPLETION from './hawi-question-completion.js';
import * as DISPUTES from './hawi-question-disputes.js';
import * as FEAR from './hawi-question-fear.js';
import * as HIDDEN_TREASURE from './hawi-question-hidden-treasure-extra.js';
import * as ILLNESS from './hawi-question-illness.js';
import * as LOVE_HATE from './hawi-question-love-hate.js';
import * as MARRIAGE from './hawi-question-marriage.js';
import * as TRAVEL from './hawi-question-travel-extra.js';
import * as ENEMIES from './hawi-question-enemies.js';
import * as MISSING_PERSON from './hawi-question-missing-person-extra.js';
import * as THEFT from './hawi-question-theft.js';
import * as AUTHORITY_STATE from './hawi-question-authority-state.js';
import * as BIRTH_NATIVITY from './hawi-question-birth-nativity.js';
import * as YEARLY_FORECAST from './hawi-question-yearly-forecast.js';
import * as SEA_VOYAGE from './hawi-question-sea-voyage.js';
import * as PRISONER from './hawi-question-prisoner.js';
import * as PARTNERSHIP from './hawi-question-partnership.js';
import * as SIBLINGS from './hawi-question-siblings.js';
import * as DEATH_INHERITANCE from './hawi-question-death-inheritance.js';

function findQuestionRule(value) {
  if (!value || typeof value !== 'object') {
    return null;
  }

  if (typeof value.id === 'string') {
    return value;
  }

  for (const nestedValue of Object.values(value)) {
    if (nestedValue && typeof nestedValue === 'object' && typeof nestedValue.id === 'string') {
      return nestedValue;
    }
  }

  return null;
}

function resolveQuestionRule(moduleExports, fileName) {
  const rule =
    findQuestionRule(moduleExports) ||
    findQuestionRule(moduleExports.default);

  if (!rule || typeof rule !== 'object' || typeof rule.id !== 'string') {
    throw new Error(`Invalid hawi question rule file: ${fileName}`);
  }

  return rule;
}

export const HAWI_QUESTION_RULES_LIST = [
  resolveQuestionRule(CHILDREN_PREGNANCY, 'hawi-question-children-pregnancy-extra.js'),
  resolveQuestionRule(COMMERCE, 'hawi-question-commerce.js'),
  resolveQuestionRule(COMPLETION, 'hawi-question-completion.js'),
  resolveQuestionRule(DISPUTES, 'hawi-question-disputes.js'),
  resolveQuestionRule(FEAR, 'hawi-question-fear.js'),
  resolveQuestionRule(HIDDEN_TREASURE, 'hawi-question-hidden-treasure-extra.js'),
  resolveQuestionRule(ILLNESS, 'hawi-question-illness.js'),
  resolveQuestionRule(LOVE_HATE, 'hawi-question-love-hate.js'),
  resolveQuestionRule(MARRIAGE, 'hawi-question-marriage.js'),
  resolveQuestionRule(TRAVEL, 'hawi-question-travel-extra.js'),
  resolveQuestionRule(ENEMIES, 'hawi-question-enemies.js'),
  resolveQuestionRule(MISSING_PERSON, 'hawi-question-missing-person-extra.js'),
  resolveQuestionRule(THEFT, 'hawi-question-theft.js'),
  resolveQuestionRule(AUTHORITY_STATE, 'hawi-question-authority-state.js'),
  resolveQuestionRule(BIRTH_NATIVITY, 'hawi-question-birth-nativity.js'),
  resolveQuestionRule(YEARLY_FORECAST, 'hawi-question-yearly-forecast.js'),
  resolveQuestionRule(SEA_VOYAGE, 'hawi-question-sea-voyage.js'),
  resolveQuestionRule(PRISONER, 'hawi-question-prisoner.js'),
  resolveQuestionRule(PARTNERSHIP, 'hawi-question-partnership.js'),
  resolveQuestionRule(SIBLINGS, 'hawi-question-siblings.js'),
  resolveQuestionRule(DEATH_INHERITANCE, 'hawi-question-death-inheritance.js'),
];

export const HAWI_QUESTION_RULES_BY_ID = Object.fromEntries(
  HAWI_QUESTION_RULES_LIST.map((rule) => [rule.id, rule])
);

export function getHawiQuestionRules(id) {
  return HAWI_QUESTION_RULES_BY_ID[id] || null;
}
