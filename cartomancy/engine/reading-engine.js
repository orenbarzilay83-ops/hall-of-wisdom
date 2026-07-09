import { interpretThreeCardSpread } from "./three-card-interpreter.js";
function shuffle(deck) {
  const copy = [...deck];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}
function drawCards(deck, count) {
  return shuffle(deck).slice(0, count);
}
function createThreeCardReading(deck, question, _topicOverride) {
  const cards = drawCards(deck, 3);
  const insight = interpretThreeCardSpread(
    question,
    cards[0],
    cards[1],
    cards[2]
  );
  return {
    spread: "three",
    cards,
    insight
  };
}
function interpretSpread(spread, cards, question, _topicOverride) {
  if (spread === "three") {
    if (cards.length < 3) {
      throw new Error("\u05E4\u05E8\u05D9\u05E1\u05EA 3 \u05E7\u05DC\u05E4\u05D9\u05DD \u05D3\u05D5\u05E8\u05E9\u05EA 3 \u05E7\u05DC\u05E4\u05D9\u05DD.");
    }
    return interpretThreeCardSpread(
      question,
      cards[0],
      cards[1],
      cards[2]
    );
  }
  throw new Error("\u05E1\u05D5\u05D2 \u05D4\u05E4\u05E8\u05D9\u05E1\u05D4 \u05D4\u05D6\u05D4 \u05D0\u05D9\u05E0\u05D5 \u05E4\u05E2\u05D9\u05DC \u05DB\u05E8\u05D2\u05E2.");
}
export {
  createThreeCardReading,
  drawCards,
  interpretSpread
};
