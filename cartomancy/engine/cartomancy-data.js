const SUITS = [
  { key: "hearts", symbol: "\u2665", heb: "\u05DC\u05D1\u05D1\u05D5\u05EA", color: "red" },
  { key: "diamonds", symbol: "\u2666", heb: "\u05D9\u05D4\u05DC\u05D5\u05DE\u05D9\u05DD", color: "red" },
  { key: "clubs", symbol: "\u2663", heb: "\u05EA\u05DC\u05EA\u05E0\u05D9\u05DD", color: "black" },
  { key: "spades", symbol: "\u2660", heb: "\u05E2\u05DC\u05D9\u05DD", color: "black" }
];
const RANKS = [
  { key: "A", heb: "\u05D0\u05E1", num: 1 },
  { key: "2", heb: "2", num: 2 },
  { key: "3", heb: "3", num: 3 },
  { key: "4", heb: "4", num: 4 },
  { key: "5", heb: "5", num: 5 },
  { key: "6", heb: "6", num: 6 },
  { key: "7", heb: "7", num: 7 },
  { key: "8", heb: "8", num: 8 },
  { key: "9", heb: "9", num: 9 },
  { key: "10", heb: "10", num: 10 },
  { key: "J", heb: "\u05E0\u05E1\u05D9\u05DA", num: 11 },
  { key: "Q", heb: "\u05DE\u05DC\u05DB\u05D4", num: 12 },
  { key: "K", heb: "\u05DE\u05DC\u05DA", num: 13 }
];
function createDeck() {
  return SUITS.flatMap(
    (suit) => RANKS.map((rank) => ({
      id: `${rank.key}${suit.symbol}`,
      label: `${rank.key}${suit.symbol}`,
      rank,
      suit,
      color: suit.color
    }))
  );
}
const DECK = createDeck();
function findCardById(cardId) {
  return DECK.find((card) => card.id === cardId);
}
const RANKS_32 = ["A", "7", "8", "9", "10", "J", "Q", "K"];
const DECK_32 = DECK.filter(
  (card) => RANKS_32.includes(card.rank.key)
);
export {
  DECK,
  DECK_32,
  RANKS,
  RANKS_32,
  SUITS,
  createDeck,
  findCardById
};
