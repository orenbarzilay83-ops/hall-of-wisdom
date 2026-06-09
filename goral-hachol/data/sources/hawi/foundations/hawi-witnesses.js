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

// Source: كشف الأسرار المصونة, page 46
// "وأما التربيع، فهو: من الأول إلى الرابع، ومن الرابع إلى السابع، ومن السابع إلى العاشر، وهو المسمى: بالأوتاد"
export const HAWI_SQUARE_ASPECT = {
  id: 'square-tarbii',
  arabicName: 'التربيع',
  hebrewName: 'ריבוע',
  pairs: [
    { fromHouse: 1, toHouse: 4, sourceStatus: 'explicit-in-source' },
    { fromHouse: 4, toHouse: 7, sourceStatus: 'explicit-in-source' },
    { fromHouse: 7, toHouse: 10, sourceStatus: 'explicit-in-source' },
  ],
  note: 'הריבוע הוא היתדות (בתים 1, 4, 7, 10)',
  sourceStatus: 'explicit-in-source',
};

// Source: كشف الأسرار المصونة, page 46
// "وأما التسديس، فهو: من الأول إلى الثالث، ومن التاسع إلى الحادي عشر، ومن الرابع إلى الثامن؛ والثاني ويخص كل تسديس وتدان"
export const HAWI_SEXTILE_ASPECT = {
  id: 'sextile-tasdis',
  arabicName: 'التسديس',
  hebrewName: 'שישי',
  pairs: [
    { fromHouse: 1, toHouse: 3, sourceStatus: 'explicit-in-source' },
    { fromHouse: 9, toHouse: 11, sourceStatus: 'explicit-in-source' },
    { fromHouse: 4, toHouse: 8, sourceStatus: 'explicit-in-source' },
  ],
  note: 'לכל זוג תסדיס שייכים שני בתי יתד',
  sourceStatus: 'explicit-in-source',
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

export function getHawiAspectsBetweenHouses(houseA, houseB) {
  const a = Number(houseA);
  const b = Number(houseB);
  const aspects = [];

  const inTrine = HAWI_WITNESS_SEQUENCE.some(
    (item) => (item.fromHouse === a && item.toHouse === b) || (item.fromHouse === b && item.toHouse === a)
  );
  if (inTrine) aspects.push({ type: 'תלת', arabicName: 'التثليث' });

  const inSquare = HAWI_SQUARE_ASPECT.pairs.some(
    (p) => (p.fromHouse === a && p.toHouse === b) || (p.fromHouse === b && p.toHouse === a)
  );
  if (inSquare) aspects.push({ type: 'ריבוע', arabicName: 'التربيع' });

  const inSextile = HAWI_SEXTILE_ASPECT.pairs.some(
    (p) => (p.fromHouse === a && p.toHouse === b) || (p.fromHouse === b && p.toHouse === a)
  );
  if (inSextile) aspects.push({ type: 'שישי', arabicName: 'التسديس' });

  return aspects;
}
