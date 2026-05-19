import { HAWI_METADATA } from './hawi-metadata.js';
import { HAWI_FOUNDATIONS } from './foundations/hawi-foundations.js';
import {
  HAWI_QUESTION_RULES_LIST,
  HAWI_QUESTION_RULES_BY_ID,
  getHawiQuestionRules,
} from './question-rules/hawi-question-rules.js';
import {
  HAWI_FIGURE_TRANSITS_LIST,
  HAWI_FIGURE_TRANSITS_BY_ID,
  getHawiFigureTransit,
  getHawiFigureHouseMeaning,
} from './figure-transits/hawi-figure-transits.js';

export const HAWI_SOURCE = {
  id: 'hawi-source',
  sourceId: HAWI_METADATA.id,
  metadata: HAWI_METADATA,
  foundations: HAWI_FOUNDATIONS,
  questionRules: {
    list: HAWI_QUESTION_RULES_LIST,
    byId: HAWI_QUESTION_RULES_BY_ID,
    getById: getHawiQuestionRules,
  },
  figureTransits: {
    list: HAWI_FIGURE_TRANSITS_LIST,
    byId: HAWI_FIGURE_TRANSITS_BY_ID,
    getById: getHawiFigureTransit,
    getHouseMeaning: getHawiFigureHouseMeaning,
  },
};

export {
  HAWI_METADATA,
  HAWI_FOUNDATIONS,
  HAWI_QUESTION_RULES_LIST,
  HAWI_QUESTION_RULES_BY_ID,
  HAWI_FIGURE_TRANSITS_LIST,
  HAWI_FIGURE_TRANSITS_BY_ID,
  getHawiQuestionRules,
  getHawiFigureTransit,
  getHawiFigureHouseMeaning,
};
