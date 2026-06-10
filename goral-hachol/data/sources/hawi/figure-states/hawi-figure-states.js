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

import {
  HAWI_FIGURE_STATE_NAKIS,
  getHawiFigureStateNakisHouse,
} from './hawi-figure-state-nakis.js';

import {
  HAWI_FIGURE_STATE_HUMRA,
  getHawiFigureStateHumraHouse,
} from './hawi-figure-state-humra.js';

import {
  HAWI_FIGURE_STATE_BAYAD,
  getHawiFigureStateBayadHouse,
} from './hawi-figure-state-bayad.js';

import {
  HAWI_FIGURE_STATE_NUSRA_KHARIJA,
  getHawiFigureStateNusraKharijaHouse,
} from './hawi-figure-state-nusra-kharija.js';

import {
  HAWI_FIGURE_STATE_NUSRA_DAKHILA,
  getHawiFigureStateNusraDakhilaHouse,
} from './hawi-figure-state-nusra-dakhila.js';

import {
  HAWI_FIGURE_STATE_ATABA_KHARIJA,
  getHawiFigureStateAtabaKharijaHouse,
} from './hawi-figure-state-ataba-kharija.js';

import {
  HAWI_FIGURE_STATE_ATABA_DAKHILA,
  getHawiFigureStateAtabaDakhilaHouse,
} from './hawi-figure-state-ataba-dakhila.js';

import {
  HAWI_FIGURE_STATE_IJTIMA,
  getHawiFigureStateIjtimaHouse,
} from './hawi-figure-state-ijtima.js';

import {
  HAWI_FIGURE_STATE_TARIQ,
  getHawiFigureStateTariqHouse,
} from './hawi-figure-state-tariq.js';

import {
  HAWI_FIGURE_STATE_NAQI_KHAD,
  getHawiFigureStateNaqiKhadHouse,
} from './hawi-figure-state-naqi-khad.js';

import {
  HAWI_FIGURE_STATE_HAYYAN,
  getHawiFigureStateHayyanHouse,
} from './hawi-figure-state-hayyan.js';

export const HAWI_FIGURE_STATES_LIST = [
  HAWI_FIGURE_STATE_QABD_DAKHIL,
  HAWI_FIGURE_STATE_QABD_KHARIJ,
  HAWI_FIGURE_STATE_JAMAA,
  HAWI_FIGURE_STATE_JUDLA,
  HAWI_FIGURE_STATE_AQLA,
  HAWI_FIGURE_STATE_NAKIS,
  HAWI_FIGURE_STATE_HUMRA,
  HAWI_FIGURE_STATE_BAYAD,
  HAWI_FIGURE_STATE_NUSRA_KHARIJA,
  HAWI_FIGURE_STATE_NUSRA_DAKHILA,
  HAWI_FIGURE_STATE_ATABA_KHARIJA,
  HAWI_FIGURE_STATE_ATABA_DAKHILA,
  HAWI_FIGURE_STATE_IJTIMA,
  HAWI_FIGURE_STATE_TARIQ,
  HAWI_FIGURE_STATE_NAQI_KHAD,
  HAWI_FIGURE_STATE_HAYYAN,
];

export const HAWI_FIGURE_STATES_BY_ID = Object.fromEntries(
  HAWI_FIGURE_STATES_LIST.map((figureState) => [figureState.id, figureState])
);

export const HAWI_FIGURE_STATES_AUDIT = HAWI_FIGURE_STATES_SOURCE_AUDIT;

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

export const HAWI_FIGURE_STATES_META = {
  audit: HAWI_FIGURE_STATES_AUDIT,
  getAudit: getHawiFigureStateAudit,
};

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

  if (figureState.id === HAWI_FIGURE_STATE_NAKIS.id) {
    return getHawiFigureStateNakisHouse(houseNumber);
  }

  if (figureState.id === HAWI_FIGURE_STATE_HUMRA.id) {
    return getHawiFigureStateHumraHouse(houseNumber);
  }

  if (figureState.id === HAWI_FIGURE_STATE_BAYAD.id) {
    return getHawiFigureStateBayadHouse(houseNumber);
  }

  if (figureState.id === HAWI_FIGURE_STATE_NUSRA_KHARIJA.id) {
    return getHawiFigureStateNusraKharijaHouse(houseNumber);
  }

  if (figureState.id === HAWI_FIGURE_STATE_NUSRA_DAKHILA.id) {
    return getHawiFigureStateNusraDakhilaHouse(houseNumber);
  }

  if (figureState.id === HAWI_FIGURE_STATE_ATABA_KHARIJA.id) {
    return getHawiFigureStateAtabaKharijaHouse(houseNumber);
  }

  if (figureState.id === HAWI_FIGURE_STATE_ATABA_DAKHILA.id) {
    return getHawiFigureStateAtabaDakhilaHouse(houseNumber);
  }

  if (figureState.id === HAWI_FIGURE_STATE_IJTIMA.id) {
    return getHawiFigureStateIjtimaHouse(houseNumber);
  }

  if (figureState.id === HAWI_FIGURE_STATE_TARIQ.id) {
    return getHawiFigureStateTariqHouse(houseNumber);
  }

  if (figureState.id === HAWI_FIGURE_STATE_NAQI_KHAD.id) {
    return getHawiFigureStateNaqiKhadHouse(houseNumber);
  }

  if (figureState.id === HAWI_FIGURE_STATE_HAYYAN.id) {
    return getHawiFigureStateHayyanHouse(houseNumber);
  }

  return figureState.states.find((state) => state.house === houseNumber) || null;
}

export default {
  HAWI_FIGURE_STATES_LIST,
  HAWI_FIGURE_STATES_BY_ID,
  HAWI_FIGURE_STATES_BY_FIGURE_ID,
};


import {
  HAWI_FIGURE_STATES_SOURCE_AUDIT,
  getHawiFigureStateAudit,
} from './hawi-figure-states-source-audit.js';

if (typeof module !== 'undefined') {
  module.exports = {
    HAWI_FIGURE_STATES_LIST,
    HAWI_FIGURE_STATES_BY_ID,
    HAWI_FIGURE_STATES_BY_FIGURE_ID,
  };
}

export { getHawiFigureStateAudit };
