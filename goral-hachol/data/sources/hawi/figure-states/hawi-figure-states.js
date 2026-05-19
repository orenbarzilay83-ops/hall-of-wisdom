import {
  HAWI_FIGURE_STATE_QABD_DAKHIL,
  getHawiFigureStateQabdDakhilHouse,
} from './hawi-figure-state-qabd-dakhil.js';

export const HAWI_FIGURE_STATES_LIST = [
  HAWI_FIGURE_STATE_QABD_DAKHIL,
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
