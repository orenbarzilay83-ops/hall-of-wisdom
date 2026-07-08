import { CLUBS_CARDS, CLUBS_SUIT_INFLUENCE, CLUBS_DOUBLES, CLUBS_COMBINATIONS } from "./clubs.js";
import { DIAMONDS_CARDS, DIAMONDS_SUIT_INFLUENCE, DIAMONDS_DOUBLES, DIAMONDS_COMBINATIONS } from "./diamonds.js";
import { HEARTS_CARDS, HEARTS_SUIT_INFLUENCE, HEARTS_DOUBLES, HEARTS_COMBINATIONS } from "./hearts.js";
import { SPADES_CARDS, SPADES_SUIT_INFLUENCE, SPADES_DOUBLES, SPADES_COMBINATIONS } from "./spades.js";
import { SUIT_MEANINGS, SUIT_INTERACTIONS, getSuitInteraction } from "./suits.js";
import { NUMBER_MEANINGS } from "./numbers.js";
import { COURT_CARDS } from "./court-cards.js";
import { COURT_CARDS_ARCHETYPES, COURT_CARDS_SUIT_PERSONALITY, COURT_CARDS_IN_GROUPS, COURT_CARDS_DIRECTION } from "./court-cards-intro.js";
import { FIVES_INTRODUCTION, FIVES_CARDS, FIVES_MULTIPLES, FIVES_COMBINATIONS } from "./special/fives.js";
import { DEATH_CARD_INTRODUCTION, DEATH_CARD_WITH_HEARTS, DEATH_CARD_WITH_CLUBS, DEATH_CARD_WITH_DIAMONDS, DEATH_CARD_WITH_SPADES, DEATH_CARD_WITH_ACES, DEATH_CARD_WITH_COURT_CARDS, DEATH_CARD_MEANS_ACTUAL_DEATH } from "./special/death.js";
import { SIX_HEARTS_INTRODUCTION, SIX_HEARTS_AS_MASCULINE, SIX_HEARTS_AS_TWIN_SOUL, SIX_HEARTS_AS_COMMUNICATION, SIX_HEARTS_HOW_TO_KNOW } from "./special/male.js";
import { WISH_CARD_INTRODUCTION, WISH_CARD_WITH_SPADES, WISH_CARD_WITH_CLUBS, WISH_CARD_WITH_DIAMONDS, WISH_CARD_WITH_HEARTS, WISH_CARD_WITH_COURT_CARDS, WISH_CARD_ALWAYS_FULFILLED } from "./special/wish.js";
import { HEALTH_DISCLAIMER, HEALTH_SUIT_CONNECTIONS, HEALTH_CARD_BODY_PARTS, HEALTH_CARD_MEANINGS } from "./special/health.js";
const ALL_NUMBER_CARDS = {
  ...CLUBS_CARDS,
  ...DIAMONDS_CARDS,
  ...HEARTS_CARDS,
  ...SPADES_CARDS
};
const ALL_DOUBLES = {
  ...CLUBS_DOUBLES,
  ...DIAMONDS_DOUBLES,
  ...HEARTS_DOUBLES,
  ...SPADES_DOUBLES
};
const ALL_COMBINATIONS = {
  ...CLUBS_COMBINATIONS,
  ...DIAMONDS_COMBINATIONS,
  ...HEARTS_COMBINATIONS,
  ...SPADES_COMBINATIONS
};
const SUIT_INFLUENCE = {
  C: CLUBS_SUIT_INFLUENCE,
  D: DIAMONDS_SUIT_INFLUENCE,
  H: HEARTS_SUIT_INFLUENCE,
  S: SPADES_SUIT_INFLUENCE
};
const SUIT_MAP = {
  C: "clubs",
  D: "diamonds",
  H: "hearts",
  S: "spades"
};
const NUMBER_MAP = {
  A: 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10
};
const COURT_RANKS = /* @__PURE__ */ new Set(["J", "Q", "K"]);
function isCourtCard(cardCode) {
  const rank = cardCode.slice(0, -1);
  return COURT_RANKS.has(rank);
}
function getSpecialNotes(cardCode) {
  const notes = [];
  if (cardCode === "AS") {
    notes.push(DEATH_CARD_INTRODUCTION);
    notes.push(DEATH_CARD_WITH_HEARTS);
    notes.push(DEATH_CARD_WITH_CLUBS);
    notes.push(DEATH_CARD_WITH_DIAMONDS);
    notes.push(DEATH_CARD_WITH_SPADES);
    notes.push(DEATH_CARD_WITH_ACES);
    notes.push(DEATH_CARD_WITH_COURT_CARDS);
    notes.push(DEATH_CARD_MEANS_ACTUAL_DEATH);
  }
  if (cardCode === "9H") {
    notes.push(WISH_CARD_INTRODUCTION);
    notes.push(WISH_CARD_WITH_SPADES);
    notes.push(WISH_CARD_WITH_CLUBS);
    notes.push(WISH_CARD_WITH_DIAMONDS);
    notes.push(WISH_CARD_WITH_HEARTS);
    notes.push(WISH_CARD_WITH_COURT_CARDS);
    notes.push(WISH_CARD_ALWAYS_FULFILLED);
  }
  if (cardCode === "6H") {
    notes.push(SIX_HEARTS_INTRODUCTION);
    notes.push(SIX_HEARTS_AS_MASCULINE);
    notes.push(SIX_HEARTS_AS_TWIN_SOUL);
    notes.push(SIX_HEARTS_AS_COMMUNICATION);
    notes.push(SIX_HEARTS_HOW_TO_KNOW);
  }
  if (cardCode.startsWith("5")) {
    notes.push(FIVES_INTRODUCTION);
    const fiveCard = FIVES_CARDS[cardCode];
    if (fiveCard) notes.push(fiveCard);
    notes.push(FIVES_MULTIPLES);
    notes.push(FIVES_COMBINATIONS);
  }
  return notes;
}
function getCardKnowledge(cardCode) {
  const suit = cardCode.slice(-1);
  const rank = cardCode.slice(0, -1);
  if (isCourtCard(cardCode)) {
    const howToRead2 = COURT_CARDS[cardCode];
    if (!howToRead2) return null;
    return {
      cardCode,
      suitInfluence: SUIT_INFLUENCE[suit] ?? "",
      howToRead: howToRead2,
      numberMeaning: "",
      suitMeaning: SUIT_MEANINGS[SUIT_MAP[suit]] ?? "",
      isCourtCard: true,
      archetype: COURT_CARDS_ARCHETYPES[cardCode] ?? "",
      specialNotes: []
    };
  }
  const howToRead = ALL_NUMBER_CARDS[cardCode];
  if (!howToRead) return null;
  const numberKey = NUMBER_MAP[rank];
  const numberMeaning = numberKey ? NUMBER_MEANINGS[numberKey] ?? "" : "";
  const suitMeaning = SUIT_MEANINGS[SUIT_MAP[suit]] ?? "";
  return {
    cardCode,
    suitInfluence: SUIT_INFLUENCE[suit] ?? "",
    howToRead,
    numberMeaning,
    suitMeaning,
    doubles: ALL_DOUBLES[cardCode] ?? {},
    combinations: ALL_COMBINATIONS[cardCode] ?? {},
    isCourtCard: false,
    specialNotes: getSpecialNotes(cardCode)
  };
}
function getSpreadKnowledge(cardCodes) {
  return cardCodes.map(getCardKnowledge).filter((entry) => entry !== null);
}
function getHealthKnowledge() {
  return {
    disclaimer: HEALTH_DISCLAIMER,
    suitConnections: HEALTH_SUIT_CONNECTIONS,
    bodyParts: HEALTH_CARD_BODY_PARTS,
    cardMeanings: HEALTH_CARD_MEANINGS
  };
}
export {
  COURT_CARDS_DIRECTION,
  COURT_CARDS_IN_GROUPS,
  COURT_CARDS_SUIT_PERSONALITY,
  NUMBER_MEANINGS,
  SUIT_INTERACTIONS,
  SUIT_MEANINGS,
  getCardKnowledge,
  getHealthKnowledge,
  getSpreadKnowledge,
  getSuitInteraction
};
