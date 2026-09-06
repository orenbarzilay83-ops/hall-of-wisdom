function countRedBlack(cards) {
  const red = cards.filter((c) => c.color === "red").length;
  const black = cards.filter((c) => c.color === "black").length;
  if (red > black) return "red";
  if (black > red) return "black";
  return "balanced";
}
function countCourt(cards) {
  return cards.filter((c) => ["J", "Q", "K"].includes(c.rank.key)).length;
}
function detectStrongCard(cards) {
  const ace = cards.find((c) => c.rank.key === "A");
  if (ace) return ace;
  const court = cards.find(
    (c) => ["K", "Q", "J"].includes(c.rank.key)
  );
  if (court) return court;
  return cards[cards.length - 1];
}
function detectBlocking(cards) {
  const spades = cards.filter((c) => c.suit.key === "spades").length;
  if (spades >= 2) {
    return "\u05E8\u05D9\u05D1\u05D5\u05D9 \u05E2\u05DC\u05D9\u05DD \u05DE\u05E6\u05D1\u05D9\u05E2 \u05E2\u05DC \u05E2\u05D9\u05DB\u05D5\u05D1\u05D9\u05DD, \u05DC\u05D7\u05E5 \u05D0\u05D5 \u05D4\u05EA\u05E0\u05D2\u05D3\u05D5\u05EA \u05D1\u05DE\u05E6\u05D1.";
  }
  const lowCards = cards.filter((c) => c.rank.num <= 4).length;
  if (lowCards >= 2) {
    return "\u05D4\u05DE\u05E6\u05D1 \u05E2\u05D3\u05D9\u05D9\u05DF \u05D1\u05E9\u05DC\u05D1\u05D9\u05DD \u05DE\u05D5\u05E7\u05D3\u05DE\u05D9\u05DD \u05D5\u05DC\u05DB\u05DF \u05D9\u05D9\u05EA\u05DB\u05DF \u05D7\u05D5\u05E1\u05E8 \u05D9\u05E6\u05D9\u05D1\u05D5\u05EA.";
  }
  return void 0;
}
function detectOutcomeDriver(cards) {
  const last = cards[cards.length - 1];
  if (last.suit.key === "hearts") {
    return "\u05E8\u05D2\u05E9, \u05D9\u05D7\u05E1\u05D9\u05DD \u05D0\u05D5 \u05D7\u05D9\u05D1\u05D5\u05E8 \u05D0\u05D9\u05E9\u05D9 \u05DE\u05E9\u05E4\u05D9\u05E2\u05D9\u05DD \u05E2\u05DC \u05D4\u05EA\u05D5\u05E6\u05D0\u05D4.";
  }
  if (last.suit.key === "diamonds") {
    return "\u05DB\u05E1\u05E3, \u05D4\u05D6\u05D3\u05DE\u05E0\u05D5\u05EA \u05D0\u05D5 \u05D4\u05E6\u05DC\u05D7\u05D4 \u05D7\u05D5\u05DE\u05E8\u05D9\u05EA \u05DE\u05D5\u05D1\u05D9\u05DC\u05D9\u05DD \u05D0\u05EA \u05D4\u05EA\u05D5\u05E6\u05D0\u05D4.";
  }
  if (last.suit.key === "clubs") {
    return "\u05E4\u05E2\u05D5\u05DC\u05D4, \u05E2\u05D1\u05D5\u05D3\u05D4 \u05D5\u05D4\u05EA\u05E4\u05EA\u05D7\u05D5\u05EA \u05DE\u05E2\u05E9\u05D9\u05EA \u05DE\u05D5\u05D1\u05D9\u05DC\u05D9\u05DD \u05D0\u05EA \u05D4\u05DE\u05E6\u05D1.";
  }
  return "\u05D0\u05EA\u05D2\u05E8\u05D9\u05DD \u05D0\u05D5 \u05DC\u05D7\u05E5 \u05D3\u05D5\u05E8\u05E9\u05D9\u05DD \u05D4\u05EA\u05DE\u05D5\u05D3\u05D3\u05D5\u05EA \u05DC\u05E4\u05E0\u05D9 \u05D4\u05EA\u05E7\u05D3\u05DE\u05D5\u05EA.";
}
function detectMainMessage(cards) {
  const colorBalance = countRedBlack(cards);
  const courts = countCourt(cards);
  if (colorBalance === "red") {
    return "\u05D4\u05D0\u05E0\u05E8\u05D2\u05D9\u05D4 \u05D4\u05DB\u05DC\u05DC\u05D9\u05EA \u05E9\u05DC \u05D4\u05E7\u05E8\u05D9\u05D0\u05D4 \u05D7\u05D9\u05D5\u05D1\u05D9\u05EA \u05D5\u05DE\u05E7\u05D3\u05DE\u05EA.";
  }
  if (colorBalance === "black") {
    return "\u05D9\u05E9 \u05E6\u05D5\u05E8\u05DA \u05DC\u05D4\u05EA\u05DE\u05D5\u05D3\u05D3 \u05E2\u05DD \u05D0\u05EA\u05D2\u05E8\u05D9\u05DD \u05DC\u05E4\u05E0\u05D9 \u05D4\u05EA\u05E7\u05D3\u05DE\u05D5\u05EA.";
  }
  if (courts >= 2) {
    return "\u05D0\u05E0\u05E9\u05D9\u05DD \u05E0\u05D5\u05E1\u05E4\u05D9\u05DD \u05DE\u05E9\u05E4\u05D9\u05E2\u05D9\u05DD \u05DE\u05E9\u05DE\u05E2\u05D5\u05EA\u05D9\u05EA \u05E2\u05DC \u05D4\u05DE\u05E6\u05D1.";
  }
  return "\u05D4\u05DE\u05E6\u05D1 \u05DE\u05EA\u05E4\u05EA\u05D7 \u05D1\u05D4\u05D3\u05E8\u05D2\u05D4 \u05D5\u05D3\u05D5\u05E8\u05E9 \u05D4\u05DE\u05E9\u05DA \u05EA\u05E0\u05D5\u05E2\u05D4.";
}
function detectConfidence(cards) {
  const colorBalance = countRedBlack(cards);
  const courts = countCourt(cards);
  if (colorBalance !== "balanced" || courts >= 2) {
    return "high";
  }
  if (courts === 1) {
    return "medium";
  }
  return "low";
}
function analyzePriority(cards) {
  const dominantCard = detectStrongCard(cards);
  const dominantReason = dominantCard.rank.key === "A" ? "\u05D0\u05E1 \u05D1\u05E4\u05E8\u05D9\u05E1\u05D4 \u05D1\u05D3\u05E8\u05DA \u05DB\u05DC\u05DC \u05DE\u05E6\u05D1\u05D9\u05E2 \u05E2\u05DC \u05D4\u05EA\u05D7\u05DC\u05D4 \u05D7\u05D6\u05E7\u05D4 \u05D0\u05D5 \u05D2\u05D5\u05E8\u05DD \u05DE\u05E8\u05DB\u05D6\u05D9." : ["K", "Q", "J"].includes(dominantCard.rank.key) ? "\u05E7\u05DC\u05E3 \u05D7\u05E6\u05E8 \u05DE\u05E6\u05D1\u05D9\u05E2 \u05E2\u05DC \u05D0\u05D3\u05DD \u05D0\u05D5 \u05D2\u05D5\u05E8\u05DD \u05DE\u05E9\u05E4\u05D9\u05E2." : "\u05D4\u05E7\u05DC\u05E3 \u05D4\u05D0\u05D7\u05E8\u05D5\u05DF \u05D1\u05E4\u05E8\u05D9\u05E1\u05D4 \u05DC\u05E8\u05D5\u05D1 \u05DE\u05E1\u05DE\u05DC \u05D0\u05EA \u05DB\u05D9\u05D5\u05D5\u05DF \u05D4\u05D4\u05EA\u05E4\u05EA\u05D7\u05D5\u05EA.";
  const mainMessage = detectMainMessage(cards);
  const blockingFactor = detectBlocking(cards);
  const outcomeDriver = detectOutcomeDriver(cards);
  const confidence = detectConfidence(cards);
  return {
    dominantCard,
    dominantReason,
    mainMessage,
    blockingFactor,
    outcomeDriver,
    confidence
  };
}
export {
  analyzePriority
};
