const SPREAD_DEFINITIONS = {
  three: {
    key: "three",
    label: "\u05E4\u05E8\u05D9\u05E1\u05EA 3 \u05E7\u05DC\u05E4\u05D9\u05DD",
    cardCount: 3,
    positions: [
      {
        key: "root",
        label: "\u05E9\u05D5\u05E8\u05E9 \u05D4\u05DE\u05E6\u05D1",
        subtitle: "\u05DE\u05D4 \u05D4\u05D5\u05D1\u05D9\u05DC \u05DC\u05DB\u05D0\u05DF"
      },
      {
        key: "heart",
        label: "\u05DC\u05D1 \u05D4\u05E2\u05E0\u05D9\u05D9\u05DF",
        subtitle: "\u05DE\u05D4 \u05E4\u05D5\u05E2\u05DC \u05E2\u05DB\u05E9\u05D9\u05D5"
      },
      {
        key: "direction",
        label: "\u05DB\u05D9\u05D5\u05D5\u05DF \u05D4\u05D4\u05EA\u05E4\u05EA\u05D7\u05D5\u05EA",
        subtitle: "\u05DC\u05D0\u05DF \u05D6\u05D4 \u05D4\u05D5\u05DC\u05DA"
      }
    ]
  },
  four: {
    key: "four",
    label: "\u05E4\u05E8\u05D9\u05E1\u05EA 4 \u05E7\u05DC\u05E4\u05D9\u05DD",
    cardCount: 4,
    positions: [
      { key: "card1", label: "\u05E7\u05DC\u05E3 1", subtitle: "\u05E4\u05EA\u05D9\u05D7\u05EA \u05D4\u05DE\u05E6\u05D1" },
      { key: "card2", label: "\u05E7\u05DC\u05E3 2", subtitle: "\u05DC\u05D1 \u05D4\u05E2\u05E0\u05D9\u05D9\u05DF" },
      { key: "card3", label: "\u05E7\u05DC\u05E3 3", subtitle: "\u05D2\u05D5\u05E8\u05DD \u05DE\u05E9\u05E4\u05D9\u05E2" },
      { key: "card4", label: "\u05E7\u05DC\u05E3 4", subtitle: "\u05DB\u05D9\u05D5\u05D5\u05DF \u05D4\u05D4\u05EA\u05E4\u05EA\u05D7\u05D5\u05EA" }
    ]
  },
  five: {
    key: "five",
    label: "\u05E4\u05E8\u05D9\u05E1\u05EA 5 \u05E7\u05DC\u05E4\u05D9\u05DD",
    cardCount: 5,
    positions: [
      { key: "card1", label: "\u05E7\u05DC\u05E3 1", subtitle: "\u05E4\u05EA\u05D9\u05D7\u05EA \u05D4\u05DE\u05E6\u05D1" },
      { key: "card2", label: "\u05E7\u05DC\u05E3 2", subtitle: "\u05D2\u05D5\u05E8\u05DD \u05E8\u05D0\u05E9\u05D5\u05DF" },
      { key: "card3", label: "\u05E7\u05DC\u05E3 3", subtitle: "\u05DC\u05D1 \u05D4\u05E2\u05E0\u05D9\u05D9\u05DF" },
      { key: "card4", label: "\u05E7\u05DC\u05E3 4", subtitle: "\u05D2\u05D5\u05E8\u05DD \u05E9\u05E0\u05D9" },
      { key: "card5", label: "\u05E7\u05DC\u05E3 5", subtitle: "\u05DB\u05D9\u05D5\u05D5\u05DF \u05D4\u05D4\u05EA\u05E4\u05EA\u05D7\u05D5\u05EA" }
    ]
  },
  star: {
    key: "star",
    label: "\u05E4\u05E8\u05D9\u05E1\u05EA \u05DE\u05D2\u05DF \u05D3\u05D5\u05D3",
    cardCount: 6,
    positions: []
  },
  "past-present-future": {
    key: "past-present-future",
    label: "\u05E2\u05D1\u05E8 / \u05D4\u05D5\u05D5\u05D4 / \u05E2\u05EA\u05D9\u05D3",
    cardCount: 32,
    positions: [
      { key: "past1", label: "\u05E2\u05D1\u05E8 1" },
      { key: "past2", label: "\u05E2\u05D1\u05E8 2" },
      { key: "past3", label: "\u05E2\u05D1\u05E8 3" },
      { key: "past4", label: "\u05E2\u05D1\u05E8 4" },
      { key: "past5", label: "\u05E2\u05D1\u05E8 5" },
      { key: "past6", label: "\u05E2\u05D1\u05E8 6" },
      { key: "past7", label: "\u05E2\u05D1\u05E8 7" },
      { key: "past8", label: "\u05E2\u05D1\u05E8 8" },
      { key: "past9", label: "\u05E2\u05D1\u05E8 9" },
      { key: "past10", label: "\u05E2\u05D1\u05E8 10" },
      { key: "present1", label: "\u05D4\u05D5\u05D5\u05D4 1" },
      { key: "present2", label: "\u05D4\u05D5\u05D5\u05D4 2" },
      { key: "present3", label: "\u05D4\u05D5\u05D5\u05D4 3" },
      { key: "present4", label: "\u05D4\u05D5\u05D5\u05D4 4" },
      { key: "present5", label: "\u05D4\u05D5\u05D5\u05D4 5" },
      { key: "present6", label: "\u05D4\u05D5\u05D5\u05D4 6" },
      { key: "present7", label: "\u05D4\u05D5\u05D5\u05D4 7" },
      { key: "present8", label: "\u05D4\u05D5\u05D5\u05D4 8" },
      { key: "present9", label: "\u05D4\u05D5\u05D5\u05D4 9" },
      { key: "present10", label: "\u05D4\u05D5\u05D5\u05D4 10" },
      { key: "future1", label: "\u05E2\u05EA\u05D9\u05D3 1" },
      { key: "future2", label: "\u05E2\u05EA\u05D9\u05D3 2" },
      { key: "future3", label: "\u05E2\u05EA\u05D9\u05D3 3" },
      { key: "future4", label: "\u05E2\u05EA\u05D9\u05D3 4" },
      { key: "future5", label: "\u05E2\u05EA\u05D9\u05D3 5" },
      { key: "future6", label: "\u05E2\u05EA\u05D9\u05D3 6" },
      { key: "future7", label: "\u05E2\u05EA\u05D9\u05D3 7" },
      { key: "future8", label: "\u05E2\u05EA\u05D9\u05D3 8" },
      { key: "future9", label: "\u05E2\u05EA\u05D9\u05D3 9" },
      { key: "future10", label: "\u05E2\u05EA\u05D9\u05D3 10" },
      { key: "surprise1", label: "\u05D4\u05E4\u05EA\u05E2\u05D4 1" },
      { key: "surprise2", label: "\u05D4\u05E4\u05EA\u05E2\u05D4 2" }
    ]
  }
};
function getSpreadDefinition(spreadType) {
  return SPREAD_DEFINITIONS[spreadType];
}
export {
  SPREAD_DEFINITIONS,
  getSpreadDefinition
};
