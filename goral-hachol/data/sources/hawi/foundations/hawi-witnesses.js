export const HAWI_WITNESS_SEQUENCE = [
  { witnessHouse: 1, testifiedHouse: 3, fromHouse: 1, toHouse: 3, sourceStatus: 'explicit-in-source' },
  { witnessHouse: 3, testifiedHouse: 5, fromHouse: 3, toHouse: 5, sourceStatus: 'explicit-in-source' },
  { witnessHouse: 5, testifiedHouse: 7, fromHouse: 5, toHouse: 7, sourceStatus: 'explicit-in-source' },
  { witnessHouse: 7, testifiedHouse: 9, fromHouse: 7, toHouse: 9, sourceStatus: 'explicit-in-source' },
  { witnessHouse: 9, testifiedHouse: 11, fromHouse: 9, toHouse: 11, sourceStatus: 'explicit-in-source' },
  { witnessHouse: 11, testifiedHouse: 13, fromHouse: 11, toHouse: 13, sourceStatus: 'explicit-in-source' },
  { witnessHouse: 13, testifiedHouse: 15, fromHouse: 13, toHouse: 15, sourceStatus: 'explicit-in-source' },
];

export const HAWI_HOUSE_GROUPS = {
  angular: {
    id: 'angular',
    arabicName: 'الأوتاد',
    hebrewName: 'יתדות',
    houses: [1, 4, 7, 10],
    ruling: 'קבוע, אפשרי, נכון',
    sourceStatus: 'explicit-in-source',
  },

  succedent: {
    id: 'succedent',
    arabicName: 'ما يلي الأوتاد',
    hebrewName: 'אחרי יתדות',
    houses: [2, 5, 8, 11],
    ruling: 'יש בו תקווה, בריאות/תקינות, סימן עתידי',
    sourceStatus: 'explicit-in-source',
  },

  cadent: {
    id: 'cadent',
    arabicName: 'السواقط',
    hebrewName: 'נופלים מן היתדות',
    houses: [3, 6, 9, 12],
    ruling: 'אין בהם תקווה, אינם מתקנים, אינם מתאפשרים',
    sourceStatus: 'explicit-in-source',
  },
};

export const HAWI_WITNESS_ADDITIONAL_RULE = {
  id: 'witnesses-angular-strength-and-mutual-support',
  rule: 'כוח העדים מן היתדות וסיוע הצורות זו לזו יכולים להביא תוצאה, אבל אם הדבר אינו יציב — הוא יוצא מהר ואינו נשאר.',
  sourceStatus: 'explicit-in-source',
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

  const witness = HAWI_WITNESS_SEQUENCE.find(
    (item) => item.witnessHouse === house || item.fromHouse === house
  );

  const group = getHawiHouseGroup(house);

  return {
    house,
    witness: witness || null,
    group,
    additionalRule: HAWI_WITNESS_ADDITIONAL_RULE,
    sourceStatus: witness || group ? 'explicit-in-source' : 'not-explicit-in-source',
  };
}
