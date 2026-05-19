import { HAWI_METADATA } from './hawi-metadata.js';

import {
  HAWI_FOUNDATIONS,
  getHawiHouse,
} from './foundations/hawi-foundations.js';

import {
  HAWI_FIGURE_NAMES,
  HAWI_FIGURE_NAMES_BY_ID,
  getHawiFigureCanonicalName,
  getHawiFigureHebrewName,
} from './foundations/hawi-figure-names.js';

import {
  HAWI_QUESTION_RULES_LIST,
  HAWI_QUESTION_RULES_BY_ID,
  getHawiQuestionRules,
} from './question-rules/hawi-question-rules.js';

import {
  HAWI_FIGURE_TRANSITS_LIST,
  HAWI_FIGURE_TRANSITS_BY_ID,
  HAWI_FIGURE_TRANSITS_AUDIT,
  HAWI_FIGURE_TRANSITS_META,
  getHawiFigureTransit,
  getHawiFigureHouseMeaning,
  getHawiFigureTransitAudit,
} from './figure-transits/hawi-figure-transits.js';

import {
  HAWI_FIGURE_STATES_LIST,
  HAWI_FIGURE_STATES_BY_ID,
  HAWI_FIGURE_STATES_BY_FIGURE_ID,
  HAWI_FIGURE_STATES_AUDIT,
  HAWI_FIGURE_STATES_META,
  getHawiFigureState,
  getHawiFigureStateHouse,
  getHawiFigureStateAudit,
} from './figure-states/hawi-figure-states.js';

import {
  HAWI_FULL_BOOK_GAP_AUDIT,
  getHawiFullBookGap,
  getHawiFullBookGapsByStatus,
} from './hawi-full-book-gap-audit.js';

export const HAWI_SOURCE = {
  id: 'hawi-source',
  sourceId: HAWI_METADATA.id,
  metadata: HAWI_METADATA,

  foundations: HAWI_FOUNDATIONS,

  figureNames: {
    list: HAWI_FIGURE_NAMES,
    byId: HAWI_FIGURE_NAMES_BY_ID,
    getCanonicalName: getHawiFigureCanonicalName,
    getHebrewName: getHawiFigureHebrewName,
  },

  questionRules: {
    list: HAWI_QUESTION_RULES_LIST,
    byId: HAWI_QUESTION_RULES_BY_ID,
    getById: getHawiQuestionRules,
  },

  figureTransits: {
    list: HAWI_FIGURE_TRANSITS_LIST,
    byId: HAWI_FIGURE_TRANSITS_BY_ID,
    audit: HAWI_FIGURE_TRANSITS_AUDIT,
    meta: HAWI_FIGURE_TRANSITS_META,
    getById: getHawiFigureTransit,
    getHouseMeaning: getHawiFigureHouseMeaning,
    getAudit: getHawiFigureTransitAudit,
  },

  figureStates: {
    list: HAWI_FIGURE_STATES_LIST,
    byId: HAWI_FIGURE_STATES_BY_ID,
    byFigureId: HAWI_FIGURE_STATES_BY_FIGURE_ID,
    audit: HAWI_FIGURE_STATES_AUDIT,
    meta: HAWI_FIGURE_STATES_META,
    getById: getHawiFigureState,
    getHouseState: getHawiFigureStateHouse,
    getAudit: getHawiFigureStateAudit,
  },

  fullBookGapAudit: HAWI_FULL_BOOK_GAP_AUDIT,
};

export {
  HAWI_METADATA,

  HAWI_FOUNDATIONS,
  getHawiHouse,

  HAWI_FIGURE_NAMES,
  HAWI_FIGURE_NAMES_BY_ID,
  getHawiFigureCanonicalName,
  getHawiFigureHebrewName,

  HAWI_QUESTION_RULES_LIST,
  HAWI_QUESTION_RULES_BY_ID,
  getHawiQuestionRules,

  HAWI_FIGURE_TRANSITS_LIST,
  HAWI_FIGURE_TRANSITS_BY_ID,
  HAWI_FIGURE_TRANSITS_AUDIT,
  HAWI_FIGURE_TRANSITS_META,
  getHawiFigureTransit,
  getHawiFigureHouseMeaning,
  getHawiFigureTransitAudit,

  HAWI_FIGURE_STATES_LIST,
  HAWI_FIGURE_STATES_BY_ID,
  HAWI_FIGURE_STATES_BY_FIGURE_ID,
  HAWI_FIGURE_STATES_AUDIT,
  HAWI_FIGURE_STATES_META,
  getHawiFigureState,
  getHawiFigureStateHouse,
  getHawiFigureStateAudit,

  HAWI_FULL_BOOK_GAP_AUDIT,
  getHawiFullBookGap,
  getHawiFullBookGapsByStatus,
};
