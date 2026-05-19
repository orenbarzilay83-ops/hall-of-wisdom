import {
  HAWI_FIGURE_STATE_QABD_DAKHIL,
  getHawiFigureStateQabdDakhilHouse,
} from './hawi-figure-state-qabd-dakhil.js';

import {
  HAWI_FIGURE_STATE_QABD_KHARIJ,
  getHawiFigureStateQabdKharijHouse,
} from './hawi-figure-state-qabd-kharij.js';

import {
  HAWI_FIGURE_STATE_JAMAA,
  getHawiFigureStateJamaaHouse,
} from './hawi-figure-state-jamaa.js';

import {
  HAWI_FIGURE_STATE_JUDLA,
  getHawiFigureStateJudlaHouse,
} from './hawi-figure-state-judla.js';

import {
  HAWI_FIGURE_STATE_AQLA,
  getHawiFigureStateAqlaHouse,
} from './hawi-figure-state-aqla.js';

export const HAWI_FIGURE_STATES_LIST = [
  HAWI_FIGURE_STATE_QABD_DAKHIL,
  HAWI_FIGURE_STATE_QABD_KHARIJ,
  HAWI_FIGURE_STATE_JAMAA,
  HAWI_FIGURE_STATE_JUDLA,
  HAWI_FIGURE_STATE_AQLA,
];

export const HAWI_FIGURE_STATES_BY_ID = Object.fromEntries(
  HAWI_FIGURE_STATES_LIST.map((figureState) => [figureState.id, figureState])
);

export const HAWI_FIGURE_STATES_BY_FIGURE_ID = Object.fromEntries(
  HAWI_FIGURE_STATES_LIST.flatMap((figureState) => {
    const entries = [[figureState.figureId, figureState]];

    if (figureState.shortFigureId) {
      entries.push([figureState.shortFigureId, figureState]);
    }

    return entries;
  })
);

export function getHawiFigureState(id) {
  if (!id || typeof id !== 'string') {
    return null;
  }

  return (
    HAWI_FIGURE_STATES_BY_ID[id] ||
    HAWI_FIGURE_STATES_BY_FIGURE_ID[id] ||
    null
  );
}

export function getHawiFigureStateHouse(id, house) {
  const figureState = getHawiFigureState(id);
  const houseNumber = Number(house);

  if (
    !figureState ||
    !Number.isInteger(houseNumber) ||
    houseNumber < 1 ||
    houseNumber > 16
  ) {
    return null;
  }

  if (figureState.id === HAWI_FIGURE_STATE_QABD_DAKHIL.id) {
    return getHawiFigureStateQabdDakhilHouse(houseNumber);
  }

  if (figureState.id === HAWI_FIGURE_STATE_QABD_KHARIJ.id) {
    return getHawiFigureStateQabdKharijHouse(houseNumber);
  }

  if (figureState.id === HAWI_FIGURE_STATE_JAMAA.id) {
    return getHawiFigureStateJamaaHouse(houseNumber);
  }

  if (figureState.id === HAWI_FIGURE_STATE_JUDLA.id) {
    return getHawiFigureStateJudlaHouse(houseNumber);
  }

  if (figureState.id === HAWI_FIGURE_STATE_AQLA.id) {
    return getHawiFigureStateAqlaHouse(houseNumber);
  }

  return figureState.states.find((state) => state.house === houseNumber) || null;
}

export default {
  HAWI_FIGURE_STATES_LIST,
  HAWI_FIGURE_STATES_BY_ID,
  HAWI_FIGURE_STATES_BY_FIGURE_ID,
};

if (typeof module !== 'undefined') {
  module.exports = {
    HAWI_FIGURE_STATES_LIST,
    HAWI_FIGURE_STATES_BY_ID,
    HAWI_FIGURE_STATES_BY_FIGURE_ID,
  };
}
