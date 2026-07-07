import { HAWI_HOUSES_16 as HAWI_HOUSES_SOURCE } from './hawi-houses-16.js';
import {
  HAWI_WITNESS_SEQUENCE,
  HAWI_HOUSE_GROUPS,
  HAWI_HOUSE_GROUPS_LIST,
  HAWI_HOUSE_GROUP_BY_HOUSE,
  getHawiHouseGroup,
  getHawiWitnessRule,
} from './hawi-witnesses.js';

import {
  HAWI_FIGURE_NAMES,
  HAWI_FIGURE_NAMES_BY_ID,
  getHawiFigureCanonicalName,
  getHawiFigureHebrewName,
} from '../../kashf-al-asrar/kashf-figure-names.js';

import {
  HAWI_SPIRITUAL_DIAGNOSTICS,
  getHawiSpiritualDiagnosticRule,
  getHawiSpiritualDiagnosticsByCategory,
} from './hawi-spiritual-diagnostics.js';

if (
  !HAWI_HOUSES_SOURCE ||
  typeof HAWI_HOUSES_SOURCE !== 'object' ||
  !Array.isArray(HAWI_HOUSES_SOURCE.houses) ||
  HAWI_HOUSES_SOURCE.houses.length !== 16
) {
  throw new Error('Invalid hawi houses file: hawi-houses-16.js');
}

export const HAWI_HOUSES_16 = HAWI_HOUSES_SOURCE.houses;

export const HAWI_HOUSES_BY_NUMBER = Object.fromEntries(
  HAWI_HOUSES_16.map((house, index) => {
    const houseNumber =
      Number(house.houseNumber) ||
      Number(house.house) ||
      Number(house.number) ||
      index + 1;

    return [houseNumber, { ...house, houseNumber }];
  })
);

export const HAWI_FOUNDATIONS = {
  id: 'hawi-foundations',
  source: 'hawi',
  housesSource: HAWI_HOUSES_SOURCE,
  houses: HAWI_HOUSES_16,
  housesByNumber: HAWI_HOUSES_BY_NUMBER,
  witnesses: {
    sequence: HAWI_WITNESS_SEQUENCE,
    houseGroups: HAWI_HOUSE_GROUPS,
    houseGroupsList: HAWI_HOUSE_GROUPS_LIST,
    houseGroupByHouse: HAWI_HOUSE_GROUP_BY_HOUSE,
  },
  figureNames: {
    list: HAWI_FIGURE_NAMES,
    byId: HAWI_FIGURE_NAMES_BY_ID,
    getCanonicalName: getHawiFigureCanonicalName,
    getHebrewName: getHawiFigureHebrewName,
  },
  spiritualDiagnostics: HAWI_SPIRITUAL_DIAGNOSTICS,
};

export function getHawiHouse(houseNumber) {
  const house = Number(houseNumber);

  if (!Number.isInteger(house) || house < 1 || house > 16) {
    return null;
  }

  return HAWI_HOUSES_BY_NUMBER[house] || null;
}

export {
  getHawiHouseGroup,
  getHawiWitnessRule,
  HAWI_FIGURE_NAMES,
  HAWI_FIGURE_NAMES_BY_ID,
  getHawiFigureCanonicalName,
  getHawiFigureHebrewName,
  getHawiSpiritualDiagnosticRule,
  getHawiSpiritualDiagnosticsByCategory,
};
