const GROUP_MEANINGS = {
  "4A": "\u05E1\u05DB\u05E0\u05D4, \u05D0\u05D5\u05D1\u05D3\u05DF \u05DB\u05E1\u05E4\u05D9, \u05E4\u05E8\u05D9\u05D3\u05D4 \u05DE\u05D7\u05D1\u05E8\u05D9\u05DD, \u05E6\u05E8\u05D5\u05EA \u05D0\u05D4\u05D1\u05D4, \u05DC\u05E4\u05E2\u05DE\u05D9\u05DD \u05DE\u05D0\u05E1\u05E8",
  "3A": "\u05E6\u05E8\u05D5\u05EA \u05D7\u05D5\u05DC\u05E4\u05D5\u05EA \u05E2\u05DD \u05D1\u05E9\u05D5\u05E8\u05D5\u05EA \u05D8\u05D5\u05D1\u05D5\u05EA, \u05D1\u05D2\u05D9\u05D3\u05EA \u05D0\u05D5\u05D4\u05D1",
  "2A_HH_CC": "\u05D4\u05EA\u05D0\u05D7\u05D3\u05D5\u05EA \u05DC\u05D8\u05D5\u05D1\u05D4 \u2014 \u05DC\u05D1 \u05D5\u05EA\u05DC\u05EA\u05DF",
  "2A_DD_SS": "\u05D4\u05EA\u05D0\u05D7\u05D3\u05D5\u05EA \u05DC\u05E8\u05E2\u05D4 \u2014 \u05D9\u05D4\u05DC\u05D5\u05DD \u05D5\u05E2\u05DC\u05D4",
  "4K": "\u05DB\u05D1\u05D5\u05D3, \u05E7\u05D9\u05D3\u05D5\u05DD, \u05DE\u05D9\u05E0\u05D5\u05D9\u05D9\u05DD \u05D8\u05D5\u05D1\u05D9\u05DD",
  "3K": "\u05E2\u05E0\u05D9\u05D9\u05E0\u05D9\u05DD \u05E8\u05E6\u05D9\u05E0\u05D9\u05D9\u05DD \u05D1\u05D9\u05D3\u05D9\u05D9\u05DD \u05D8\u05D5\u05D1\u05D5\u05EA",
  "2K": "\u05E9\u05D9\u05EA\u05D5\u05E3 \u05E4\u05E2\u05D5\u05DC\u05D4 \u05E2\u05E1\u05E7\u05D9, \u05D4\u05E6\u05DC\u05D7\u05D4",
  "4Q": "\u05D4\u05EA\u05DB\u05E0\u05E1\u05D5\u05EA \u05D7\u05D1\u05E8\u05EA\u05D9\u05EA",
  "3Q": "\u05D1\u05D9\u05E7\u05D5\u05E8\u05D9\u05DD \u05D9\u05D3\u05D9\u05D3\u05D5\u05EA\u05D9\u05D9\u05DD (\u05D4\u05E4\u05D5\u05DA \u2014 \u05E8\u05DB\u05D9\u05DC\u05D5\u05EA)",
  "2Q": "\u05E1\u05D5\u05D3\u05D5\u05EA \u05DE\u05E9\u05D5\u05EA\u05E4\u05D9\u05DD, \u05E4\u05D2\u05D9\u05E9\u05D4 \u05D1\u05D9\u05DF \u05D7\u05D1\u05E8\u05D5\u05EA",
  "4J": "\u05E9\u05DE\u05D7\u05D4 \u05E8\u05D5\u05E2\u05E9\u05EA",
  "3J": "\u05D3\u05D0\u05D2\u05D5\u05EA \u05DE\u05D4\u05D9\u05DB\u05E8\u05D5\u05D9\u05D5\u05EA, \u05D3\u05D9\u05D1\u05D4",
  "2J": "\u05D0\u05D5\u05D1\u05D3\u05DF \u05E8\u05DB\u05D5\u05E9, \u05EA\u05D5\u05DB\u05E0\u05D9\u05D5\u05EA \u05D6\u05D3\u05D5\u05E0\u05D9\u05D5\u05EA",
  "4_10": "\u05DE\u05D6\u05DC \u05D8\u05D5\u05D1, \u05E2\u05D5\u05E9\u05E8, \u05D4\u05E6\u05DC\u05D7\u05D4",
  "3_10": "\u05D4\u05E8\u05E1 \u05DE\u05EA\u05D1\u05D9\u05E2\u05D5\u05EA \u05DE\u05E9\u05E4\u05D8\u05D9\u05D5\u05EA",
  "2_10": "\u05DE\u05D6\u05DC \u05D1\u05DC\u05EA\u05D9 \u05E6\u05E4\u05D5\u05D9, \u05E9\u05D9\u05E0\u05D5\u05D9 \u05E2\u05D9\u05E1\u05D5\u05E7",
  "4_9": "\u05D4\u05EA\u05D2\u05E9\u05DE\u05D5\u05EA \u05D0\u05D9\u05E8\u05D5\u05E2\u05D9\u05DD \u05D1\u05DC\u05EA\u05D9 \u05E6\u05E4\u05D5\u05D9\u05D9\u05DD",
  "3_9": "\u05D1\u05E8\u05D9\u05D0\u05D5\u05EA, \u05E2\u05D5\u05E9\u05E8 \u05D5\u05D0\u05D5\u05E9\u05E8",
  "2_9": "\u05E9\u05D2\u05E9\u05D5\u05D2 \u05D5\u05E9\u05DC\u05D5\u05D5\u05D4",
  "4_8": "\u05D4\u05E6\u05DC\u05D7\u05D4 \u05D5\u05DB\u05D9\u05E9\u05DC\u05D5\u05DF \u05DE\u05E2\u05D5\u05E8\u05D1\u05D1\u05D9\u05DD",
  "3_8": "\u05DE\u05D7\u05E9\u05D1\u05D5\u05EA \u05E2\u05DC \u05D0\u05D4\u05D1\u05D4 \u05D5\u05E0\u05D9\u05E9\u05D5\u05D0\u05D9\u05DF",
  "2_8": "\u05E2\u05D5\u05E0\u05D2\u05D9\u05DD \u05D7\u05D5\u05DC\u05E4\u05D9\u05DD",
  "4_7": "\u05EA\u05D7\u05D1\u05D5\u05DC\u05D5\u05EA \u05D5\u05DE\u05D6\u05D9\u05DE\u05D5\u05EA",
  "3_7": "\u05E2\u05E6\u05D1 \u05DE\u05D0\u05D9\u05D1\u05D5\u05D3 \u05D7\u05D1\u05E8\u05D9\u05DD, \u05D1\u05E8\u05D9\u05D0\u05D5\u05EA \u05E8\u05E2\u05D4",
  "2_7": "\u05D0\u05D4\u05D1\u05D4 \u05D4\u05D3\u05D3\u05D9\u05EA"
};
function detectGroups(cards) {
  const results = [];
  const symbolToLetter = { "\u2665": "H", "\u2666": "D", "\u2663": "C", "\u2660": "S" };
  const codes = cards.map((c) => {
    const last = c.code.slice(-1);
    return symbolToLetter[last] ? c.code.slice(0, -1) + symbolToLetter[last] : c.code;
  });
  function getRank(code) {
    return code.slice(0, -1);
  }
  function getSuit(code) {
    return code.slice(-1);
  }
  const rankCounts = {};
  for (const code of codes) {
    const rank = getRank(code);
    if (!rankCounts[rank]) rankCounts[rank] = [];
    rankCounts[rank].push(getSuit(code));
  }
  for (const [rank, suits] of Object.entries(rankCounts)) {
    const count = suits.length;
    if (count < 2) continue;
    let key = "";
    if (rank === "A") {
      if (count === 4) key = "4A";
      else if (count === 3) key = "3A";
      else if (count === 2) {
        const hasHeart = suits.includes("H");
        const hasClub = suits.includes("C");
        const hasDiamond = suits.includes("D");
        const hasSpade = suits.includes("S");
        if (hasHeart && hasClub && !(hasDiamond || hasSpade)) key = "2A_HH_CC";
        else if (hasDiamond && hasSpade && !(hasHeart || hasClub)) key = "2A_DD_SS";
        else key = "2A_HH_CC";
      }
    } else if (rank === "K") {
      key = count === 4 ? "4K" : count === 3 ? "3K" : "2K";
    } else if (rank === "Q") {
      key = count === 4 ? "4Q" : count === 3 ? "3Q" : "2Q";
    } else if (rank === "J") {
      key = count === 4 ? "4J" : count === 3 ? "3J" : "2J";
    } else if (rank === "10") {
      key = count === 4 ? "4_10" : count === 3 ? "3_10" : "2_10";
    } else if (rank === "9") {
      key = count === 4 ? "4_9" : count === 3 ? "3_9" : "2_9";
    } else if (rank === "8") {
      key = count === 4 ? "4_8" : count === 3 ? "3_8" : "2_8";
    } else if (rank === "7") {
      key = count === 4 ? "4_7" : count === 3 ? "3_7" : "2_7";
    }
    if (key && GROUP_MEANINGS[key]) {
      results.push(GROUP_MEANINGS[key]);
    }
  }
  return results;
}
import { interpretCard } from "./context-interpreter.js";
import { CLUBS_CARDS, CLUBS_SUIT_INFLUENCE } from "./clubs.js";
import { HEARTS_CARDS, HEARTS_SUIT_INFLUENCE } from "./hearts.js";
import { SPADES_CARDS, SPADES_SUIT_INFLUENCE } from "./spades.js";
import { DIAMONDS_CARDS, DIAMONDS_SUIT_INFLUENCE } from "./diamonds.js";
import { COURT_CARDS } from "./court-cards.js";
import { NUMBER_MEANINGS } from "./numbers.js";
function getCardMeaning32(code, reversed) {
  const symbolToLetter = { "\u2665": "H", "\u2666": "D", "\u2663": "C", "\u2660": "S" };
  const lastChar = code.slice(-1);
  const normalized = symbolToLetter[lastChar] ? code.slice(0, -1) + symbolToLetter[lastChar] : code;
  const suit = normalized.slice(-1);
  const rank = normalized.slice(0, -1);
  const cardLabel = `${rank}${suit}`;
  code = normalized;
  let howToRead = "";
  if (COURT_CARDS[code]) howToRead = COURT_CARDS[code].slice(0, 200) + "...";
  else if (suit === "H") howToRead = (HEARTS_CARDS[code] || "").slice(0, 200) + "...";
  else if (suit === "C") howToRead = (CLUBS_CARDS[code] || "").slice(0, 200) + "...";
  else if (suit === "S") howToRead = (SPADES_CARDS[code] || "").slice(0, 200) + "...";
  else if (suit === "D") howToRead = (DIAMONDS_CARDS[code] || "").slice(0, 200) + "...";
  const suitInfluence = suit === "H" ? HEARTS_SUIT_INFLUENCE : suit === "C" ? CLUBS_SUIT_INFLUENCE : suit === "S" ? SPADES_SUIT_INFLUENCE : suit === "D" ? DIAMONDS_SUIT_INFLUENCE : "";
  const rankMap = {
    A: 1,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10
  };
  const n = rankMap[rank];
  const numberMeaning = n ? NUMBER_MEANINGS[n] || "" : "";
  const contextMeaning = interpretCard(code, "general") || "";
  const parts = [
    `\u05E7\u05DC\u05E3: ${cardLabel}`,
    contextMeaning ? `\u05DE\u05E9\u05DE\u05E2\u05D5\u05EA: ${contextMeaning}` : "",
    suitInfluence ? `\u05E1\u05D3\u05E8\u05D4: ${suitInfluence}` : "",
    numberMeaning ? `\u05E1\u05E4\u05E8\u05D4: ${numberMeaning}` : "",
    howToRead ? `\u05E8\u05E7\u05E2: ${howToRead}` : ""
  ].filter(Boolean).join(" | ");
  if (reversed) {
    const reversedMeanings = {
      "AH": "\u05D1\u05D9\u05E7\u05D5\u05E8 \u05DE\u05D7\u05D1\u05E8 \u05E8\u05D7\u05D5\u05E7, \u05D0\u05D5 \u05DE\u05E2\u05D1\u05E8 \u05D3\u05D9\u05E8\u05D4",
      "KH": "\u05D3\u05DE\u05D5\u05EA \u05DE\u05D0\u05DB\u05D6\u05D1\u05EA, \u05DC\u05D0 \u05E2\u05D5\u05DE\u05D3 \u05D1\u05E6\u05D9\u05E4\u05D9\u05D5\u05EA",
      "QH": "\u05D0\u05D9\u05E9\u05D4 \u05E9\u05D7\u05D5\u05D5\u05EA\u05D4 \u05D0\u05D4\u05D1\u05D4 \u05D0\u05D5\u05DE\u05DC\u05DC\u05D4",
      "JH": "\u05DE\u05D0\u05D4\u05D1 \u05E6\u05D1\u05D0\u05D9 \u05E2\u05DD \u05EA\u05DC\u05D5\u05E0\u05D5\u05EA \u05D5\u05D8\u05D9\u05E0\u05D4",
      "10H": "\u05D3\u05D0\u05D2\u05D5\u05EA \u05D7\u05D5\u05DC\u05E4\u05D5\u05EA",
      "9H": "\u05E2\u05E6\u05D1 \u05E7\u05E6\u05E8",
      "8H": "\u05D0\u05D3\u05D9\u05E9\u05D5\u05EA, \u05D7\u05D5\u05E1\u05E8 \u05D4\u05D9\u05E2\u05E0\u05D5\u05EA \u05E8\u05D2\u05E9\u05D9\u05EA",
      "7H": "\u05E9\u05E2\u05DE\u05D5\u05DD, \u05E9\u05D1\u05E2 \u05E8\u05E6\u05D5\u05DF \u05DE\u05D3\u05D9",
      "AD": "\u05D7\u05D3\u05E9\u05D5\u05EA \u05E8\u05E2\u05D5\u05EA",
      "KD": "\u05DE\u05EA\u05D7\u05D6\u05D4 \u05D5\u05D1\u05D5\u05D2\u05D3",
      "QD": "\u05E4\u05DC\u05E8\u05D8\u05D8\u05E0\u05D9\u05EA \u05D6\u05D3\u05D5\u05E0\u05D9\u05EA",
      "JD": "\u05E2\u05D5\u05E9\u05D4 \u05E6\u05E8\u05D5\u05EA \u05D5\u05DE\u05E1\u05D9\u05EA",
      "10D": "\u05DE\u05D6\u05DC \u05E8\u05E2 \u05D9\u05DC\u05D5\u05D5\u05D4 \u05D0\u05EA \u05D4\u05E6\u05E2\u05D3",
      "9D": "\u05D5\u05D9\u05DB\u05D5\u05D7\u05D9\u05DD \u05D1\u05D9\u05EA\u05D9\u05D9\u05DD, \u05D0\u05D5 \u05DE\u05E8\u05D9\u05D1\u05EA \u05D0\u05D5\u05D4\u05D1\u05D9\u05DD",
      "8D": "\u05D0\u05D4\u05D1\u05D4 \u05E9\u05E0\u05DB\u05D7\u05D3\u05D4, \u05E8\u05D2\u05E9 \u05E9\u05E0\u05E9\u05E8\u05E3",
      "7D": "\u05E8\u05DB\u05D9\u05DC\u05D5\u05EA \u05D8\u05D9\u05E4\u05E9\u05D9\u05EA \u05D5\u05D7\u05E1\u05E8\u05EA \u05D1\u05E1\u05D9\u05E1",
      "AC": "\u05E9\u05DE\u05D7\u05D4 \u05E7\u05E6\u05E8\u05D4, \u05D4\u05EA\u05DB\u05EA\u05D1\u05D5\u05EA \u05DE\u05E2\u05D9\u05E7\u05D4",
      "KC": "\u05DB\u05D5\u05D5\u05E0\u05D5\u05EA \u05D8\u05D5\u05D1\u05D5\u05EA \u05E9\u05E0\u05DB\u05E9\u05DC\u05D5\u05EA",
      "QC": "\u05E1\u05D5\u05D1\u05DC\u05EA \u05DE\u05E7\u05E0\u05D0\u05D4",
      "JC": "\u05D7\u05E1\u05E8 \u05D0\u05D7\u05E8\u05D9\u05D5\u05EA \u05D5\u05DC\u05D0 \u05E2\u05E7\u05D1\u05D9",
      "10C": "\u05DE\u05E1\u05E2 \u05D1\u05D9\u05DD",
      "9C": "\u05DE\u05EA\u05E0\u05D4 \u05E7\u05D8\u05E0\u05D4 \u05D9\u05D3\u05D9\u05D3\u05D5\u05EA\u05D9\u05EA",
      "8C": "\u05E8\u05D2\u05E9 \u05DC\u05D0 \u05E8\u05D0\u05D5\u05D9 \u05E9\u05D9\u05E1\u05D1 \u05E6\u05E8\u05D4",
      "7C": "\u05D1\u05E2\u05D9\u05D5\u05EA \u05DB\u05E1\u05E3",
      "AS": "\u05D7\u05D3\u05E9\u05D5\u05EA \u05DE\u05D5\u05D5\u05EA, \u05E2\u05E6\u05D1",
      "KS": "\u05E8\u05E6\u05D5\u05DF \u05DC\u05D2\u05E8\u05D5\u05DD \u05E8\u05E2\u05D4 \u2014 \u05DC\u05DC\u05D0 \u05D9\u05DB\u05D5\u05DC\u05EA \u05DC\u05DE\u05DE\u05E9\u05D5",
      "QS": "\u05D0\u05D9\u05E9\u05D4 \u05DE\u05E1\u05DB\u05E1\u05DB\u05EA \u05D5\u05D6\u05D3\u05D5\u05E0\u05D9\u05EA",
      "JS": "\u05D3\u05DE\u05D5\u05EA \u05D1\u05D5\u05D2\u05D3\u05E0\u05D9\u05EA, \u05D0\u05D5\u05D4\u05D1 \u05EA\u05D7\u05D1\u05D5\u05DC\u05D5\u05EA \u05E0\u05E1\u05EA\u05E8\u05D5\u05EA",
      "10S": "\u05E6\u05E8\u05D4 \u05D7\u05D5\u05DC\u05E4\u05EA \u05D0\u05D5 \u05DE\u05D7\u05DC\u05D4 \u05E7\u05DC\u05D4",
      "9S": "\u05D0\u05D5\u05D1\u05D3\u05DF \u05D9\u05E7\u05E8 \u05D1\u05E7\u05E8\u05D5\u05D1\u05D9\u05DD",
      "8S": "\u05D0\u05D9\u05E8\u05D5\u05E1\u05D9\u05DF \u05E9\u05D1\u05D5\u05D8\u05DC\u05D5, \u05D4\u05E6\u05E2\u05D4 \u05E9\u05E0\u05D3\u05D7\u05EA\u05D4, \u05E4\u05D9\u05D6\u05D5\u05E8",
      "7S": "\u05EA\u05D7\u05D1\u05D5\u05DC\u05D5\u05EA \u05D0\u05D4\u05D1\u05D4 \u05DE\u05D8\u05D5\u05E4\u05E9\u05D5\u05EA"
    };
    const reversedMeaning = reversedMeanings[code] || "\u05DE\u05E9\u05DE\u05E2\u05D5\u05EA \u05DE\u05E0\u05D5\u05D2\u05D3\u05EA";
    const suitLine = suitInfluence ? `\u05E1\u05D3\u05E8\u05D4: ${suitInfluence}` : "";
    return [`\u05E7\u05DC\u05E3: ${cardLabel} (\u05D4\u05E4\u05D5\u05DA)`, `\u05DE\u05E9\u05DE\u05E2\u05D5\u05EA: ${reversedMeaning}`, suitLine].filter(Boolean).join(" | ");
  }
  return parts;
}
export {
  detectGroups,
  getCardMeaning32
};
