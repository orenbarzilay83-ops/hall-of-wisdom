import { getExtendedCardKnowledge } from "../../card-knowledge.js";
function getCardLabel(card) {
  return `${card.rank.heb} ${card.suit.heb}`;
}
function isCourt(card) {
  return ["J", "Q", "K"].includes(card.rank.key);
}
function isNegativeSuit(card) {
  return card.suit.key === "spades";
}
function getNumberSignal(rank) {
  const map = {
    A: "\u05D4\u05EA\u05D7\u05DC\u05D4 \u05D0\u05D5 \u05E1\u05D9\u05D5\u05DD \u2014 \u05E7\u05D9\u05E6\u05D5\u05E0\u05D9, \u05DE\u05DB\u05E8\u05D9\u05E2, \u05DC\u05D0 \u05D0\u05DE\u05E6\u05E2",
    "2": "\u05E9\u05D9\u05EA\u05D5\u05E3 \u05E4\u05E2\u05D5\u05DC\u05D4 \u05D0\u05D5 \u05E7\u05D5\u05E0\u05E4\u05DC\u05D9\u05E7\u05D8",
    "3": "\u05D4\u05EA\u05E8\u05D7\u05D1\u05D5\u05EA \u05D0\u05D5 \u05D0\u05D5\u05D1\u05D3\u05DF",
    "4": "\u05D4\u05EA\u05D1\u05E1\u05E1\u05D5\u05EA \u05D0\u05D5 \u05D7\u05D5\u05E1\u05E8 \u05D9\u05E6\u05D9\u05D1\u05D5\u05EA",
    "5": "\u05E4\u05E2\u05D9\u05DC\u05D5\u05EA \u05D0\u05D5 \u05D7\u05D5\u05E1\u05E8 \u05DE\u05E0\u05D5\u05D7\u05D4",
    "6": "\u05EA\u05E7\u05E9\u05D5\u05E8\u05EA \u05D0\u05D5 \u05D1\u05D5\u05E8\u05D5\u05EA",
    "7": "\u05E9\u05D9\u05E4\u05D5\u05E8 \u05D0\u05D5 \u05E7\u05D9\u05E4\u05D0\u05D5\u05DF",
    "8": "\u05D1\u05E8\u05D9\u05D0\u05D5\u05EA \u05D0\u05D5 \u05D7\u05D5\u05DC\u05D9 \u2014 \u05D0\u05D9\u05D6\u05D5\u05DF \u05D0\u05D5 \u05D7\u05D5\u05E1\u05E8 \u05D0\u05D9\u05D6\u05D5\u05DF",
    "9": "\u05DE\u05E9\u05D0\u05DC\u05D4 \u05D0\u05D5 \u05D0\u05DB\u05D6\u05D1\u05D4",
    "10": "\u05D4\u05E6\u05DC\u05D7\u05D4 \u05D0\u05D5 \u05DB\u05D9\u05E9\u05DC\u05D5\u05DF",
    J: "\u05DE\u05D7\u05E9\u05D1\u05D5\u05EA, \u05D0\u05D3\u05DD \u05E6\u05E2\u05D9\u05E8 \u05D5\u05E2\u05D5\u05D6\u05E8, \u05D0\u05D5 \u05E0\u05E2\u05E8 \u05D1\u05E2\u05D9\u05D9\u05EA\u05D9",
    Q: "\u05E4\u05EA\u05D9\u05D7\u05D5\u05EA \u05D5\u05D0\u05D9\u05E0\u05D8\u05D5\u05D0\u05D9\u05E6\u05D9\u05D4, \u05D2\u05DD \u05D7\u05D1\u05E8\u05D4 \u05D0\u05D5 \u05D9\u05E8\u05D9\u05D1\u05D4",
    K: "\u05E4\u05E2\u05D5\u05DC\u05D4 \u05D5\u05DB\u05D5\u05D7, \u05D2\u05DD \u05D7\u05D1\u05E8 \u05D0\u05D5 \u05D9\u05E8\u05D9\u05D1"
  };
  return map[rank] ?? "\u05D0\u05E0\u05E8\u05D2\u05D9\u05D4 \u05DC\u05D0 \u05DE\u05D5\u05D2\u05D3\u05E8\u05EA";
}
function getSuitSignal(suit, topic) {
  const map = {
    hearts: {
      love: "\u05E8\u05D2\u05E9, \u05D7\u05D5\u05DD, \u05E7\u05D9\u05E8\u05D1\u05D4",
      work: "\u05E0\u05E2\u05D9\u05DE\u05D5\u05EA, \u05EA\u05DE\u05D9\u05DB\u05D4, \u05D2\u05D9\u05E9\u05D4 \u05D0\u05E0\u05D5\u05E9\u05D9\u05EA",
      money: "\u05E1\u05D9\u05E4\u05D5\u05E7, \u05E0\u05D3\u05D9\u05D1\u05D5\u05EA",
      general: "\u05E8\u05D2\u05E9, \u05D7\u05D5\u05DD, \u05D7\u05D9\u05D1\u05D5\u05E8"
    },
    clubs: {
      love: "\u05D9\u05D5\u05D6\u05DE\u05D4, \u05E0\u05D9\u05E1\u05D9\u05D5\u05DF \u05DC\u05D4\u05E0\u05D9\u05E2",
      work: "\u05E2\u05E9\u05D9\u05D9\u05D4, \u05D1\u05E0\u05D9\u05D9\u05D4, \u05D4\u05EA\u05E7\u05D3\u05DE\u05D5\u05EA \u05DE\u05E2\u05E9\u05D9\u05EA",
      money: "\u05DE\u05D0\u05DE\u05E5, \u05E2\u05D1\u05D5\u05D3\u05D4",
      general: "\u05E4\u05E2\u05D5\u05DC\u05D4, \u05EA\u05E0\u05D5\u05E2\u05D4, \u05D9\u05D5\u05D6\u05DE\u05D4"
    },
    diamonds: {
      love: "\u05DE\u05E1\u05E8, \u05DE\u05E9\u05D9\u05DB\u05D4, \u05E6\u05D9\u05E4\u05D9\u05D9\u05D4 \u05DC\u05EA\u05D2\u05D5\u05D1\u05D4",
      work: "\u05EA\u05D5\u05E6\u05D0\u05D4, \u05EA\u05D2\u05DE\u05D5\u05DC, \u05D4\u05D6\u05D3\u05DE\u05E0\u05D5\u05EA",
      money: "\u05DB\u05E1\u05E3, \u05E2\u05E8\u05DA, \u05E4\u05E8\u05D9\u05E6\u05EA \u05D3\u05E8\u05DA",
      general: "\u05DE\u05E1\u05E8, \u05E2\u05E8\u05DA, \u05EA\u05D5\u05E6\u05D0\u05D4 \u05DE\u05E2\u05E9\u05D9\u05EA"
    },
    spades: {
      love: "\u05DB\u05D0\u05D1, \u05E8\u05D9\u05D7\u05D5\u05E7, \u05D7\u05E1\u05D9\u05DE\u05D4 \u05E8\u05D2\u05E9\u05D9\u05EA",
      work: "\u05E2\u05D9\u05DB\u05D5\u05D1, \u05D7\u05E1\u05D9\u05DE\u05D4, \u05E7\u05D5\u05E9\u05D9",
      money: "\u05D4\u05E4\u05E1\u05D3, \u05DC\u05D7\u05E5, \u05D7\u05D5\u05D1",
      general: "\u05E7\u05D5\u05E9\u05D9, \u05DE\u05D1\u05D7\u05DF, \u05E2\u05D9\u05DB\u05D5\u05D1"
    }
  };
  return map[suit]?.[topic] ?? "\u05D4\u05E9\u05E4\u05E2\u05D4 \u05DC\u05D0 \u05DE\u05D5\u05D2\u05D3\u05E8\u05EA";
}
function getFallbackTopicMeaning(card, topic) {
  return getSuitSignal(card.suit.key, topic);
}
function getFallbackPositionHint(role) {
  if (role === "root") return "\u05D6\u05D4\u05D5 \u05E9\u05D5\u05E8\u05E9 \u05D4\u05DE\u05E6\u05D1 \u05D0\u05D5 \u05E0\u05E7\u05D5\u05D3\u05EA \u05D4\u05DE\u05D5\u05E6\u05D0.";
  if (role === "heart") return "\u05D6\u05D4\u05D5 \u05DC\u05D1 \u05D4\u05E2\u05E0\u05D9\u05D9\u05DF \u05D5\u05DE\u05D4 \u05E9\u05E4\u05D5\u05E2\u05DC \u05E2\u05DB\u05E9\u05D9\u05D5 \u05D1\u05DE\u05E8\u05DB\u05D6.";
  return "\u05D6\u05D4\u05D5 \u05DB\u05D9\u05D5\u05D5\u05DF \u05D4\u05D4\u05EA\u05E4\u05EA\u05D7\u05D5\u05EA \u05D0\u05D5 \u05D4\u05EA\u05D5\u05E6\u05D0\u05D4 \u05E9\u05D0\u05DC\u05D9\u05D4 \u05D4\u05DE\u05E6\u05D1 \u05E0\u05DE\u05E9\u05DA.";
}
function inferPersonGender(card) {
  if (card.rank.key === "Q") return "female";
  if (card.rank.key === "K" || card.rank.key === "J") return "male";
  return "unknown";
}
function inferNature(card) {
  const { suit, rank } = card;
  if (["J", "Q", "K"].includes(rank.key)) {
    if (suit.key === "hearts" || suit.key === "diamonds") return "supportive_person";
    if (suit.key === "spades") return "challenging_person";
    return "neutral_person";
  }
  if (suit.key === "spades") {
    if (rank.key === "A" || ["8", "9", "10"].includes(rank.key)) return "sharp_block";
    return "slow_delay";
  }
  if (rank.key === "4") return "stability";
  if (rank.key === "2") return "choice_tension";
  if (suit.key === "diamonds") return "message_result";
  if (suit.key === "clubs") return "practical_progress";
  if (suit.key === "hearts") return "emotional_flow";
  return "unknown";
}
function inferIntensity(card, nature) {
  if (nature === "sharp_block") return "high";
  if (card.rank.key === "A") return "high";
  if (["J", "Q", "K", "10", "9"].includes(card.rank.key)) return "medium";
  return "low";
}
function getCoreMeaning(card, topic) {
  const knowledge = getExtendedCardKnowledge(card);
  if (knowledge?.topicMeanings?.[topic]) {
    return knowledge.topicMeanings[topic];
  }
  if (knowledge?.cardMeaning) {
    return knowledge.cardMeaning;
  }
  return getFallbackTopicMeaning(card, topic);
}
function getPositionHint(card, topic, role) {
  const knowledge = getExtendedCardKnowledge(card);
  if (knowledge?.topicMeanings?.[topic]) {
    return knowledge.topicMeanings[topic];
  }
  return getFallbackPositionHint(role);
}
function getCardProfile(card, topic, role) {
  const nature = inferNature(card);
  return {
    key: `${card.rank.key}_${card.suit.key}`,
    label: getCardLabel(card),
    suit: card.suit.key,
    rank: card.rank.key,
    color: card.color,
    topicMeaning: getCoreMeaning(card, topic),
    positionHint: getPositionHint(card, topic, role),
    coreMeaning: getCoreMeaning(card, topic),
    nature,
    intensity: inferIntensity(card, nature),
    isCourt: isCourt(card),
    personGender: inferPersonGender(card),
    isSupportive: nature === "supportive_person" || nature === "message_result" || nature === "practical_progress" || nature === "emotional_flow",
    isBlocking: nature === "sharp_block" || nature === "slow_delay" || nature === "challenging_person",
    isMessageCard: nature === "message_result",
    isPracticalCard: nature === "practical_progress"
  };
}
function getColorBalance(cards) {
  const red = cards.filter((c) => c.color === "red").length;
  const black = cards.filter((c) => c.color === "black").length;
  if (red > black) return "positive";
  if (black > red) return "negative";
  return "mixed";
}
export {
  getCardLabel,
  getCardProfile,
  getColorBalance,
  getNumberSignal,
  getSuitSignal,
  isCourt,
  isNegativeSuit
};
