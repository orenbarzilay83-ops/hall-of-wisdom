import * as CHILDREN_PREGNANCY from './hawi-question-children-pregnancy.js';
import * as COMMERCE from './hawi-question-commerce.js';
import * as COMPLETION from './hawi-question-completion.js';
import * as DISPUTES from './hawi-question-disputes.js';
import * as FEAR from './hawi-question-fear.js';
import * as HIDDEN_TREASURE from './hawi-question-hidden-treasure.js';
import * as ILLNESS from './hawi-question-illness.js';
import * as LOVE_HATE from './hawi-question-love-hate.js';
import * as MARRIAGE from './hawi-question-marriage.js';
import * as TRAVEL from './hawi-question-travel.js';

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

export const HAWI_QUESTION_ENEMIES_RECOVERY = {
  id: 'hawi-question-enemies',
  sourceSectionArabic: 'باب في أمر العداوة',
  sourceSectionHebrew: 'שער האויבות',
  status: 'needs-source-recovery',
  sourceStatus: 'not-explicit-in-source',
  note: 'לא הוכנס כמקור מלא. אין להשלים מסברה.',
};

export const HAWI_QUESTION_RULES_LIST = [
  resolveQuestionRule(CHILDREN_PREGNANCY, 'hawi-question-children-pregnancy.js'),
  resolveQuestionRule(COMMERCE, 'hawi-question-commerce.js'),
  resolveQuestionRule(COMPLETION, 'hawi-question-completion.js'),
  resolveQuestionRule(DISPUTES, 'hawi-question-disputes.js'),
  resolveQuestionRule(FEAR, 'hawi-question-fear.js'),
  resolveQuestionRule(HIDDEN_TREASURE, 'hawi-question-hidden-treasure.js'),
  resolveQuestionRule(ILLNESS, 'hawi-question-illness.js'),
  resolveQuestionRule(LOVE_HATE, 'hawi-question-love-hate.js'),
  resolveQuestionRule(MARRIAGE, 'hawi-question-marriage.js'),
  resolveQuestionRule(TRAVEL, 'hawi-question-travel.js'),
  HAWI_QUESTION_ENEMIES_RECOVERY,
];

export const HAWI_QUESTION_RULES_BY_ID = Object.fromEntries(
  HAWI_QUESTION_RULES_LIST.map((rule) => [rule.id, rule])
);

export function getHawiQuestionRules(id) {
  return HAWI_QUESTION_RULES_BY_ID[id] || null;
}
