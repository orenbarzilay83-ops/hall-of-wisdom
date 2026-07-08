function isCourtCard(card) {
  const rank = String(card.rank.key);
  return rank === "J" || rank === "Q" || rank === "K";
}
function getRank(card) {
  return card.rank.key;
}
function getSuit(card) {
  return card.suit.key;
}
function joinOptions(values) {
  if (values.length === 0) return "";
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} \u05D0\u05D5 ${values[1]}`;
  return `${values.slice(0, -1).join(", ")} \u05D0\u05D5 ${values[values.length - 1]}`;
}
function detectAppearance(card) {
  const suit = getSuit(card);
  if (suit === "diamonds") {
    const possibleHair2 = ["\u05E9\u05D9\u05E2\u05E8 \u05D1\u05DC\u05D5\u05E0\u05D3\u05D9\u05E0\u05D9", "\u05E9\u05D9\u05E2\u05E8 \u05D2'\u05D9\u05E0\u05D2'\u05D9"];
    const possibleEyes2 = ["\u05E2\u05D9\u05E0\u05D9\u05D9\u05DD \u05DB\u05D7\u05D5\u05DC\u05D5\u05EA", "\u05E2\u05D9\u05E0\u05D9\u05D9\u05DD \u05D9\u05E8\u05D5\u05E7\u05D5\u05EA"];
    return {
      possibleHair: possibleHair2,
      possibleEyes: possibleEyes2,
      appearanceText: `\u05D4\u05DE\u05E8\u05D0\u05D4 \u05DB\u05D0\u05DF \u05D1\u05D4\u05D9\u05E8 \u05D9\u05D5\u05EA\u05E8, \u05E2\u05DD ${joinOptions(possibleHair2)} \u05D5${joinOptions(
        possibleEyes2
      )}.`
    };
  }
  if (suit === "hearts") {
    const possibleHair2 = ["\u05E9\u05D9\u05E2\u05E8 \u05D7\u05D5\u05DD \u05D1\u05D4\u05D9\u05E8"];
    const possibleEyes2 = ["\u05E2\u05D9\u05E0\u05D9\u05D9\u05DD \u05D7\u05D5\u05DE\u05D5\u05EA", "\u05E2\u05D9\u05E0\u05D9\u05D9\u05DD \u05DB\u05D7\u05D5\u05DC\u05D5\u05EA", "\u05E2\u05D9\u05E0\u05D9\u05D9\u05DD \u05D9\u05E8\u05D5\u05E7\u05D5\u05EA"];
    return {
      possibleHair: possibleHair2,
      possibleEyes: possibleEyes2,
      appearanceText: `\u05D4\u05DE\u05E8\u05D0\u05D4 \u05DB\u05D0\u05DF \u05D1\u05D4\u05D9\u05E8 \u05D9\u05D7\u05E1\u05D9\u05EA, \u05E2\u05DD ${joinOptions(possibleHair2)} \u05D5${joinOptions(
        possibleEyes2
      )}.`
    };
  }
  if (suit === "clubs") {
    const possibleHair2 = ["\u05E9\u05D9\u05E2\u05E8 \u05D7\u05D5\u05DD", "\u05E9\u05D9\u05E2\u05E8 \u05D7\u05D5\u05DD \u05DB\u05D4\u05D4"];
    const possibleEyes2 = ["\u05E2\u05D9\u05E0\u05D9\u05D9\u05DD \u05D7\u05D5\u05DE\u05D5\u05EA"];
    return {
      possibleHair: possibleHair2,
      possibleEyes: possibleEyes2,
      appearanceText: `\u05D4\u05DE\u05E8\u05D0\u05D4 \u05DB\u05D0\u05DF \u05DB\u05D4\u05D4 \u05D9\u05D5\u05EA\u05E8, \u05E2\u05DD ${joinOptions(possibleHair2)} \u05D5${joinOptions(
        possibleEyes2
      )}.`
    };
  }
  const possibleHair = ["\u05E9\u05D9\u05E2\u05E8 \u05D7\u05D5\u05DD \u05DB\u05D4\u05D4", "\u05E9\u05D9\u05E2\u05E8 \u05E9\u05D7\u05D5\u05E8"];
  const possibleEyes = ["\u05E2\u05D9\u05E0\u05D9\u05D9\u05DD \u05D7\u05D5\u05DE\u05D5\u05EA \u05DB\u05D4\u05D5\u05EA"];
  return {
    possibleHair,
    possibleEyes,
    appearanceText: `\u05D4\u05DE\u05E8\u05D0\u05D4 \u05DB\u05D0\u05DF \u05DB\u05D4\u05D4, \u05E2\u05DD ${joinOptions(possibleHair)} \u05D5${joinOptions(
      possibleEyes
    )}.`
  };
}
function detectIdentity(card) {
  const rank = getRank(card);
  if (rank === "J") {
    return {
      possibleGenders: ["male", "female"],
      possibleAgeGroups: ["under-35", "under-18"],
      identityText: "\u05D6\u05D4 \u05E7\u05DC\u05E3 \u05E9\u05DC \u05D3\u05DE\u05D5\u05EA \u05E6\u05E2\u05D9\u05E8\u05D4. \u05D1\u05D3\u05E8\u05DA \u05DB\u05DC\u05DC \u05D4\u05D5\u05D0 \u05DE\u05E6\u05D1\u05D9\u05E2 \u05E2\u05DC \u05D0\u05D3\u05DD \u05E6\u05E2\u05D9\u05E8 \u05D9\u05D7\u05E1\u05D9\u05EA, \u05D5\u05DC\u05E2\u05D9\u05EA\u05D9\u05DD \u05D2\u05DD \u05E2\u05DC \u05E0\u05E2\u05E8 \u05D0\u05D5 \u05E0\u05E2\u05E8\u05D4 \u05DC\u05E4\u05D9 \u05D4\u05D4\u05E7\u05E9\u05E8."
    };
  }
  if (rank === "Q") {
    return {
      possibleGenders: ["female"],
      possibleAgeGroups: ["under-35", "over-35"],
      identityText: "\u05D6\u05D4 \u05E7\u05DC\u05E3 \u05E9\u05DC \u05D3\u05DE\u05D5\u05EA \u05E0\u05E9\u05D9\u05EA. \u05D1\u05D3\u05E8\u05DA \u05DB\u05DC\u05DC \u05D4\u05D5\u05D0 \u05DE\u05E6\u05D1\u05D9\u05E2 \u05E2\u05DC \u05D0\u05D9\u05E9\u05D4, \u05E6\u05E2\u05D9\u05E8\u05D4 \u05D9\u05D5\u05EA\u05E8 \u05D0\u05D5 \u05D1\u05D5\u05D2\u05E8\u05EA \u05D9\u05D5\u05EA\u05E8 \u05DC\u05E4\u05D9 \u05D4\u05D4\u05E7\u05E9\u05E8."
    };
  }
  return {
    possibleGenders: ["male"],
    possibleAgeGroups: ["over-35"],
    identityText: "\u05D6\u05D4 \u05E7\u05DC\u05E3 \u05E9\u05DC \u05D3\u05DE\u05D5\u05EA \u05D2\u05D1\u05E8\u05D9\u05EA \u05D1\u05D5\u05D2\u05E8\u05EA \u05D9\u05D5\u05EA\u05E8, \u05DC\u05E8\u05D5\u05D1 \u05D2\u05D1\u05E8 \u05DE\u05E2\u05DC \u05D2\u05D9\u05DC 35 \u05D0\u05D5 \u05D3\u05DE\u05D5\u05EA \u05D1\u05E2\u05DC\u05EA \u05D1\u05E9\u05DC\u05D5\u05EA \u05D5\u05E1\u05DE\u05DB\u05D5\u05EA."
  };
}
function buildNaturalDescription(card) {
  const identity = detectIdentity(card);
  const appearance = detectAppearance(card);
  return `${identity.identityText} ${appearance.appearanceText}`;
}
function identifyPerson(card) {
  if (!isCourtCard(card)) return null;
  const rank = getRank(card);
  const suit = getSuit(card);
  const identity = detectIdentity(card);
  const appearance = detectAppearance(card);
  return {
    cardId: card.id,
    rank,
    suit,
    possibleGenders: identity.possibleGenders,
    possibleAgeGroups: identity.possibleAgeGroups,
    possibleHair: appearance.possibleHair,
    possibleEyes: appearance.possibleEyes,
    appearanceText: appearance.appearanceText,
    identityText: identity.identityText,
    naturalDescription: buildNaturalDescription(card)
  };
}
function identifyPeople(cards) {
  return cards.map((card) => identifyPerson(card)).filter((value) => Boolean(value));
}
function describePersonShort(person) {
  const rank = person.rank;
  if (rank === "J") {
    return `\u05D3\u05DE\u05D5\u05EA \u05E6\u05E2\u05D9\u05E8\u05D4 \u05D9\u05D7\u05E1\u05D9\u05EA, \u05E2\u05DD ${joinOptions(person.possibleHair)} \u05D5${joinOptions(
      person.possibleEyes
    )}.`;
  }
  if (rank === "Q") {
    return `\u05D3\u05DE\u05D5\u05EA \u05E0\u05E9\u05D9\u05EA, \u05E2\u05DD ${joinOptions(person.possibleHair)} \u05D5${joinOptions(
      person.possibleEyes
    )}.`;
  }
  return `\u05D3\u05DE\u05D5\u05EA \u05D2\u05D1\u05E8\u05D9\u05EA \u05D1\u05D5\u05D2\u05E8\u05EA \u05D9\u05D5\u05EA\u05E8, \u05E2\u05DD ${joinOptions(person.possibleHair)} \u05D5${joinOptions(
    person.possibleEyes
  )}.`;
}
function buildPeopleNarrative(cards) {
  const people = identifyPeople(cards);
  if (people.length === 0) return "";
  if (people.length === 1) {
    return describePersonShort(people[0]);
  }
  if (people.length === 2) {
    return `${describePersonShort(people[0])} \u05DC\u05E6\u05D3 ${describePersonShort(people[1])}`;
  }
  return `${describePersonShort(people[0])} \u05D1\u05E0\u05D5\u05E1\u05E3 \u05DE\u05D5\u05E4\u05D9\u05E2\u05D5\u05EA \u05E2\u05D5\u05D3 \u05D3\u05DE\u05D5\u05D9\u05D5\u05EA \u05DE\u05E9\u05DE\u05E2\u05D5\u05EA\u05D9\u05D5\u05EA \u05D1\u05E4\u05E8\u05D9\u05E1\u05D4.`;
}
export {
  buildPeopleNarrative,
  describePersonShort,
  identifyPeople,
  identifyPerson
};
