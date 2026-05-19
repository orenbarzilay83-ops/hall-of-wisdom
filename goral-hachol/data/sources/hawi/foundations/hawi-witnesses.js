export const HAWI_WITNESS_SEQUENCE = [
  { fromHouse: 1, toHouse: 3, sourceStatus: 'explicit-in-source' },
  { fromHouse: 3, toHouse: 5, sourceStatus: 'explicit-in-source' },
  { fromHouse: 5, toHouse: 7, sourceStatus: 'explicit-in-source' },
  { fromHouse: 7, toHouse: 9, sourceStatus: 'explicit-in-source' },
  { fromHouse: 9, toHouse: 11, sourceStatus: 'explicit-in-source' },
  { fromHouse: 11, toHouse: 13, sourceStatus: 'explicit-in-source' },
  { fromHouse: 13, toHouse: 15, sourceStatus: 'explicit-in-source' },
];

export const HAWI_HOUSE_GROUPS = {
  angular: {
    id: 'angular',
    hebrewName: 'יתדות',
    houses: [1, 4, 7, 10],
    ruling: 'קבוע, אפשרי, נכון',
    sourceStatus: 'explicit-in-source',
  },
  succedent: {
    id: 'succedent',
    hebrewName: 'אחרי יתדות',
    houses: [2, 5, 8, 11],
    ruling: 'יש תקווה, בריאות/תקינות, סימן עתידי',
    sourceStatus: 'explicit-in-source',
  },
  cadent: {
    id: 'cadent',
    hebrewName: 'נופלים מן היתד',
    houses: [3, 6, 9, 12],
    ruling: 'אין בהם תקווה, אינם מתקנים, אינם מתאפשרים',
    sourceStatus: 'explicit-in-source',
  },
};

export const HAWI_HOUSE_GROUPS_LIST = Object.values(HAWI_HOUSE_GROUPS);

export const HAWI_HOUSE_GROUP_BY_HOUSE = Object.fromEntries(
  HAWI_HOUSE_GROUPS_LIST.flatMap((group) =>
    group.houses.map((house) => [house, group])
  )
);

export function getHawiHouseGroup(houseNumber) {
  const house = Number(houseNumber);

  if (!Number.isInteger(house)) {
    return null;
  }

  return HAWI_HOUSE_GROUP_BY_HOUSE[house] || null;
}

export function getHawiWitnessRule(houseNumber) {
  const house = Number(houseNumber);

  if (!Number.isInteger(house)) {
    return null;
  }

  const witness = HAWI_WITNESS_SEQUENCE.find((item) => item.fromHouse === house);
  const group = getHawiHouseGroup(house);

  return {
    house,
    witness: witness || null,
    group,
    sourceStatus: witness || group ? 'explicit-in-source' : 'not-explicit-in-source',
  };
}
