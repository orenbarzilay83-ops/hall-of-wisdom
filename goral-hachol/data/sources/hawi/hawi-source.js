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

import { HAWI_FULL_BOOK_GAP_AUDIT } from './hawi-full-book-gap-audit.js';

import {
  HAWI_TOPIC_INDEX,
  getHawiTopic,
  getHawiTopicsByStatus,
  getHawiTopicsByPriority,
} from './hawi-topic-index.js';

import { HAWI_INTRODUCTION_MAHW_THABAT } from './foundations/hawi-introduction-mahw-thabat.js';
import { HAWI_DHAMIR_DIRECTIONS_VALIDATION } from './foundations/hawi-dhamir-directions-validation.js';
import { HAWI_HOUSE_STATES_COLORS } from './foundations/hawi-house-states-colors.js';
import {
  HAWI_WITNESS_SEQUENCE,
  HAWI_HOUSE_GROUPS,
  HAWI_HOUSE_GROUPS_LIST,
  HAWI_HOUSE_GROUP_BY_HOUSE,
  HAWI_WITNESS_ADDITIONAL_RULE,
  getHawiHouseGroup,
  getHawiWitnessRule,
} from './foundations/hawi-witnesses.js';
import { HAWI_SPIRITUAL_DIAGNOSTICS } from './foundations/hawi-spiritual-diagnostics.js';

import { HAWI_BIRTH_NATIVITY } from './birth-nativity/hawi-birth-nativity.js';
import { HAWI_TRIANGLES_ZODIAC } from './triangles/hawi-triangles-zodiac.js';

import { HAWI_YEARLY_PRICES_FORECAST } from './yearly-forecast/hawi-yearly-prices-forecast.js';
import { HAWI_RAIN_WEATHER_FORECAST } from './yearly-forecast/hawi-rain-weather-forecast.js';

import { HAWI_AUTHORITY_STATE_RULERS } from './authority-state/hawi-authority-state-rulers.js';
import { HAWI_PLANETARY_CORRESPONDENCES } from './planetary-correspondences/hawi-planetary-correspondences.js';

import { HAWI_QUESTION_CHILDREN_PREGNANCY_EXTRA } from './question-rules/hawi-question-children-pregnancy-extra.js';
import { HAWI_QUESTION_HIDDEN_TREASURE_EXTRA } from './question-rules/hawi-question-hidden-treasure-extra.js';
import { HAWI_QUESTION_MISSING_PERSON_EXTRA } from './question-rules/hawi-question-missing-person-extra.js';
import { HAWI_QUESTION_TRAVEL_EXTRA } from './question-rules/hawi-question-travel-extra.js';

import { HAWI_QUESTION_MARRIAGE } from './question-rules/hawi-question-marriage.js';
import { HAWI_QUESTION_ILLNESS } from './question-rules/hawi-question-illness.js';
import { HAWI_QUESTION_DISPUTES } from './question-rules/hawi-question-disputes.js';
import { HAWI_QUESTION_FEAR } from './question-rules/hawi-question-fear.js';
import { HAWI_QUESTION_COMMERCE } from './question-rules/hawi-question-commerce.js';
import { HAWI_QUESTION_LOVE_HATE } from './question-rules/hawi-question-love-hate.js';
import { HAWI_QUESTION_ENEMIES } from './question-rules/hawi-question-enemies.js';
import { HAWI_QUESTION_COMPLETION } from './question-rules/hawi-question-completion.js';
import { HAWI_QUESTION_THEFT } from './question-rules/hawi-question-theft.js';
import { HAWI_QUESTION_SEA_VOYAGE } from './question-rules/hawi-question-sea-voyage.js';
import { HAWI_QUESTION_PRISONER } from './question-rules/hawi-question-prisoner.js';

export const HAWI_EXTENDED_KNOWLEDGE_LIST = [
  HAWI_INTRODUCTION_MAHW_THABAT,
  HAWI_DHAMIR_DIRECTIONS_VALIDATION,
  HAWI_HOUSE_STATES_COLORS,
  HAWI_SPIRITUAL_DIAGNOSTICS,
  HAWI_BIRTH_NATIVITY,
  HAWI_TRIANGLES_ZODIAC,
  HAWI_YEARLY_PRICES_FORECAST,
  HAWI_RAIN_WEATHER_FORECAST,
  HAWI_AUTHORITY_STATE_RULERS,
  HAWI_PLANETARY_CORRESPONDENCES,
  HAWI_QUESTION_CHILDREN_PREGNANCY_EXTRA,
  HAWI_QUESTION_HIDDEN_TREASURE_EXTRA,
  HAWI_QUESTION_MISSING_PERSON_EXTRA,
  HAWI_QUESTION_TRAVEL_EXTRA,
  HAWI_QUESTION_MARRIAGE,
  HAWI_QUESTION_ILLNESS,
  HAWI_QUESTION_DISPUTES,
  HAWI_QUESTION_FEAR,
  HAWI_QUESTION_COMMERCE,
  HAWI_QUESTION_LOVE_HATE,
  HAWI_QUESTION_ENEMIES,
  HAWI_QUESTION_COMPLETION,
  HAWI_QUESTION_THEFT,
  HAWI_QUESTION_SEA_VOYAGE,
  HAWI_QUESTION_PRISONER,
];

export const HAWI_EXTENDED_KNOWLEDGE_BY_ID = Object.fromEntries(
  HAWI_EXTENDED_KNOWLEDGE_LIST.map((item) => [item.id, item])
);

export function getHawiExtendedKnowledge(id) {
  return HAWI_EXTENDED_KNOWLEDGE_BY_ID[id] || null;
}

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

  extendedKnowledge: {
    list: HAWI_EXTENDED_KNOWLEDGE_LIST,
    byId: HAWI_EXTENDED_KNOWLEDGE_BY_ID,
    getById: getHawiExtendedKnowledge,

    introductionMahwThabat: HAWI_INTRODUCTION_MAHW_THABAT,
    dhamirDirectionsValidation: HAWI_DHAMIR_DIRECTIONS_VALIDATION,
    houseStatesColors: HAWI_HOUSE_STATES_COLORS,
    spiritualDiagnosticsIndex: HAWI_SPIRITUAL_DIAGNOSTICS,
    witnesses: {
      sequence: HAWI_WITNESS_SEQUENCE,
      houseGroups: HAWI_HOUSE_GROUPS,
      houseGroupsList: HAWI_HOUSE_GROUPS_LIST,
      houseGroupByHouse: HAWI_HOUSE_GROUP_BY_HOUSE,
      additionalRule: HAWI_WITNESS_ADDITIONAL_RULE,
      getHouseGroup: getHawiHouseGroup,
      getWitnessRule: getHawiWitnessRule,
    },
    birthNativity: HAWI_BIRTH_NATIVITY,
    trianglesZodiac: HAWI_TRIANGLES_ZODIAC,
    yearlyPricesForecast: HAWI_YEARLY_PRICES_FORECAST,
    rainWeatherForecast: HAWI_RAIN_WEATHER_FORECAST,
    authorityStateRulers: HAWI_AUTHORITY_STATE_RULERS,
    planetaryCorrespondences: HAWI_PLANETARY_CORRESPONDENCES,
    childrenPregnancyExtra: HAWI_QUESTION_CHILDREN_PREGNANCY_EXTRA,
    hiddenTreasureExtra: HAWI_QUESTION_HIDDEN_TREASURE_EXTRA,
    missingPersonExtra: HAWI_QUESTION_MISSING_PERSON_EXTRA,
    travelExtra: HAWI_QUESTION_TRAVEL_EXTRA,
    marriage: HAWI_QUESTION_MARRIAGE,
    illness: HAWI_QUESTION_ILLNESS,
    disputes: HAWI_QUESTION_DISPUTES,
    fear: HAWI_QUESTION_FEAR,
    commerce: HAWI_QUESTION_COMMERCE,
    loveHate: HAWI_QUESTION_LOVE_HATE,
    enemies: HAWI_QUESTION_ENEMIES,
    completion: HAWI_QUESTION_COMPLETION,
    theft: HAWI_QUESTION_THEFT,
    seaVoyage: HAWI_QUESTION_SEA_VOYAGE,
    prisoner: HAWI_QUESTION_PRISONER,
  },

  fullBookGapAudit: HAWI_FULL_BOOK_GAP_AUDIT,

  topicIndex: HAWI_TOPIC_INDEX,
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

  HAWI_TOPIC_INDEX,
  getHawiTopic,
  getHawiTopicsByStatus,
  getHawiTopicsByPriority,

  HAWI_INTRODUCTION_MAHW_THABAT,
  HAWI_DHAMIR_DIRECTIONS_VALIDATION,
  HAWI_HOUSE_STATES_COLORS,
  HAWI_SPIRITUAL_DIAGNOSTICS,
  HAWI_WITNESS_SEQUENCE,
  HAWI_HOUSE_GROUPS,
  HAWI_HOUSE_GROUPS_LIST,
  HAWI_HOUSE_GROUP_BY_HOUSE,
  HAWI_WITNESS_ADDITIONAL_RULE,
  getHawiHouseGroup,
  getHawiWitnessRule,
  HAWI_BIRTH_NATIVITY,
  HAWI_TRIANGLES_ZODIAC,
  HAWI_YEARLY_PRICES_FORECAST,
  HAWI_RAIN_WEATHER_FORECAST,
  HAWI_AUTHORITY_STATE_RULERS,
  HAWI_PLANETARY_CORRESPONDENCES,
  HAWI_QUESTION_CHILDREN_PREGNANCY_EXTRA,
  HAWI_QUESTION_HIDDEN_TREASURE_EXTRA,
  HAWI_QUESTION_MISSING_PERSON_EXTRA,
  HAWI_QUESTION_TRAVEL_EXTRA,
};
