function normalizeText(text) {
  return text.replace(/\s+/g, " ").trim();
}
function detectQuestionType(question) {
  const clean = normalizeText(question);
  if (clean.includes("?") || clean.startsWith("\u05D4\u05D0\u05DD") || clean.startsWith("\u05D0\u05DD ")) {
    return "yesno";
  }
  return "open";
}
function detectTopic(question) {
  const text = normalizeText(question);
  if (/אהבה|זוגיות|קשר|רגש|מרגיש|מרגישה|בן זוג|בת זוג|יחסים|בינינו|ביניהם/.test(
    text
  )) {
    return "love";
  }
  if (/עבודה|משרה|קריירה|פרנסה|ראיון|קבלה לעבודה|אתקבל|תפקיד/.test(text)) {
    return "work";
  }
  if (/כסף|הכנסה|רווח|תשלום|משכורת|חוב|תקציב/.test(text)) {
    return "money";
  }
  return "general";
}
function detectQuestionMode(question, questionType, topic) {
  const text = normalizeText(question);
  if (questionType === "yesno") {
    if (/כדאי|נכון לי|טוב לי|להמשיך|לוותר|לבחור|לקחת/.test(text)) {
      return "decision";
    }
    return "yesno";
  }
  if (/מה הוא מרגיש|מה היא מרגישה|מה הם מרגישים|איך הוא מרגיש|איך היא מרגישה|מה הרגש|מה יש בלב|איך הוא רואה אותי|איך היא רואה אותי/.test(
    text
  )) {
    return "feeling";
  }
  if (/מי זה|מי זאת|מי האדם|מי הדמות|במי מדובר|איזה אדם זה/.test(text)) {
    return "identity";
  }
  if (/לאן זה הולך|מה יהיה|מה צפוי|איך זה יתפתח|בהמשך|בעתיד|מה התוצאה/.test(
    text
  )) {
    return "outcome";
  }
  if (/ביני לבין|בינינו|ביניהם|בין .* לבין|מה קורה בינינו|מה קורה ביניהם|מה מצב הקשר|מה מצב הזוגיות|מה יש בינינו|מה יש ביניהם|בני הזוג/.test(
    text
  )) {
    return "relationship";
  }
  if (/מה מצב|מה קורה|איפה זה עומד|מה יש כאן|מה הסיפור/.test(text)) {
    return "state";
  }
  if (topic === "love") return "relationship";
  return "general";
}
function isCourt(card) {
  return ["J", "Q", "K"].includes(card.rank.key);
}
function isAceOfSpades(card) {
  return card.rank.key === "A" && card.suit.key === "spades";
}
function buildCardMeaning(card) {
  return `${card.rank.heb} ${card.suit.heb}`;
}
function countSuits(cards) {
  return {
    hearts: cards.filter((card) => card.suit.key === "hearts").length,
    diamonds: cards.filter((card) => card.suit.key === "diamonds").length,
    clubs: cards.filter((card) => card.suit.key === "clubs").length,
    spades: cards.filter((card) => card.suit.key === "spades").length
  };
}
function detectDominantSuit(cards) {
  const counts = countSuits(cards);
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (!entries[0] || entries[0][1] === 0) return "mixed";
  if (entries[1] && entries[0][1] === entries[1][1]) return "mixed";
  return entries[0][0];
}
function detectDominantColor(cards) {
  const red = cards.filter((card) => card.color === "red").length;
  const black = cards.filter((card) => card.color === "black").length;
  if (red > black) return "red";
  if (black > red) return "black";
  return "balanced";
}
function buildInteraction(left, right) {
  const key = `${left.suit.key}-${right.suit.key}`;
  const map = {
    "spades-spades": "\u05D4\u05D7\u05D9\u05D1\u05D5\u05E8 \u05D1\u05D9\u05DF \u05D4\u05E7\u05DC\u05E4\u05D9\u05DD \u05DE\u05DB\u05D1\u05D9\u05D3 \u05D5\u05DE\u05E8\u05D0\u05D4 \u05E7\u05D5\u05E9\u05D9 \u05DB\u05E4\u05D5\u05DC.",
    "spades-hearts": "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05DB\u05D0\u05D1 \u05D0\u05D5 \u05E7\u05D5\u05E9\u05D9 \u05E9\u05E0\u05D5\u05D2\u05E2 \u05D1\u05E8\u05D2\u05E9.",
    "spades-clubs": "\u05D9\u05E9 \u05DE\u05D0\u05DE\u05E5 \u05DC\u05D4\u05EA\u05DE\u05D5\u05D3\u05D3 \u05E2\u05DD \u05D1\u05E2\u05D9\u05D4 \u05E4\u05E2\u05D9\u05DC\u05D4.",
    "spades-diamonds": "\u05D9\u05E9 \u05DC\u05D7\u05E5 \u05E1\u05D1\u05D9\u05D1 \u05DB\u05E1\u05E3, \u05E2\u05E8\u05DA \u05D0\u05D5 \u05DE\u05E1\u05E8.",
    "hearts-spades": "\u05D4\u05E8\u05D2\u05E9 \u05E4\u05D5\u05D2\u05E9 \u05D7\u05E1\u05D9\u05DE\u05D4, \u05DB\u05D0\u05D1 \u05D0\u05D5 \u05E8\u05D9\u05D7\u05D5\u05E7.",
    "hearts-hearts": "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05D6\u05E8\u05D9\u05DE\u05D4 \u05E8\u05D2\u05E9\u05D9\u05EA, \u05E7\u05D9\u05E8\u05D1\u05D4 \u05D0\u05D5 \u05E8\u05DB\u05D5\u05EA.",
    "hearts-clubs": "\u05E8\u05D2\u05E9 \u05DE\u05EA\u05D7\u05D1\u05E8 \u05DC\u05E2\u05E9\u05D9\u05D9\u05D4 \u05D0\u05D5 \u05D9\u05D5\u05D6\u05DE\u05D4.",
    "hearts-diamonds": "\u05E8\u05D2\u05E9 \u05DE\u05EA\u05D7\u05D1\u05E8 \u05DC\u05DE\u05E1\u05E8\u05D9\u05DD, \u05E2\u05E8\u05DA \u05D0\u05D5 \u05D4\u05E6\u05DC\u05D7\u05D4.",
    "clubs-spades": "\u05D9\u05E9 \u05E4\u05E2\u05D5\u05DC\u05D4, \u05D0\u05D1\u05DC \u05D4\u05D9\u05D0 \u05E4\u05D5\u05D2\u05E9\u05EA \u05E7\u05D5\u05E9\u05D9 \u05D0\u05D5 \u05D4\u05EA\u05E0\u05D2\u05D3\u05D5\u05EA.",
    "clubs-hearts": "\u05E2\u05E9\u05D9\u05D9\u05D4 \u05DE\u05D5\u05D1\u05D9\u05DC\u05D4 \u05DC\u05E8\u05D2\u05E9, \u05E7\u05D9\u05E8\u05D1\u05D4 \u05D0\u05D5 \u05D7\u05D5\u05D5\u05D9\u05D4 \u05D8\u05D5\u05D1\u05D4 \u05D9\u05D5\u05EA\u05E8.",
    "clubs-clubs": "\u05D9\u05E9 \u05E2\u05E9\u05D9\u05D9\u05D4 \u05D7\u05D6\u05E7\u05D4, \u05EA\u05E0\u05D5\u05E2\u05D4 \u05D5\u05D4\u05EA\u05E7\u05D3\u05DE\u05D5\u05EA.",
    "clubs-diamonds": "\u05D4\u05E2\u05E9\u05D9\u05D9\u05D4 \u05D9\u05DB\u05D5\u05DC\u05D4 \u05DC\u05D4\u05D1\u05D9\u05D0 \u05EA\u05D5\u05E6\u05D0\u05D4 \u05DE\u05E2\u05E9\u05D9\u05EA \u05D0\u05D5 \u05DE\u05E1\u05E8 \u05DE\u05DE\u05E9\u05D9.",
    "diamonds-spades": "\u05DE\u05E1\u05E8 \u05D0\u05D5 \u05E2\u05E0\u05D9\u05D9\u05DF \u05D7\u05D5\u05DE\u05E8\u05D9 \u05E4\u05D5\u05D2\u05E9\u05D9\u05DD \u05E2\u05D9\u05DB\u05D5\u05D1 \u05D0\u05D5 \u05E7\u05D5\u05E9\u05D9.",
    "diamonds-hearts": "\u05DE\u05E1\u05E8, \u05EA\u05E9\u05D5\u05D1\u05D4 \u05D0\u05D5 \u05E2\u05E8\u05DA \u05DE\u05EA\u05D7\u05D1\u05E8\u05D9\u05DD \u05DC\u05E8\u05D2\u05E9 \u05D7\u05D9\u05D5\u05D1\u05D9.",
    "diamonds-clubs": "\u05D9\u05E9 \u05D7\u05D9\u05D1\u05D5\u05E8 \u05D1\u05D9\u05DF \u05DE\u05D9\u05D3\u05E2, \u05DE\u05E1\u05E8 \u05D0\u05D5 \u05DB\u05E1\u05E3 \u05DC\u05D1\u05D9\u05DF \u05E4\u05E2\u05D5\u05DC\u05D4.",
    "diamonds-diamonds": "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05D7\u05D9\u05D6\u05D5\u05E7 \u05DE\u05E2\u05E9\u05D9, \u05D7\u05D5\u05DE\u05E8\u05D9 \u05D0\u05D5 \u05DB\u05E1\u05E4\u05D9 \u05D1\u05E8\u05D5\u05E8."
  };
  return map[key] || "\u05D9\u05E9 \u05E7\u05E9\u05E8 \u05DE\u05E9\u05DE\u05E2\u05D5\u05EA\u05D9 \u05D1\u05D9\u05DF \u05E9\u05E0\u05D9 \u05D4\u05E7\u05DC\u05E4\u05D9\u05DD.";
}
function buildThemes(cards) {
  const themes = /* @__PURE__ */ new Set();
  cards.forEach((card) => {
    if (card.suit.key === "hearts") themes.add("\u05E8\u05D2\u05E9");
    if (card.suit.key === "diamonds") themes.add("\u05DB\u05E1\u05E3");
    if (card.suit.key === "clubs") themes.add("\u05E2\u05E9\u05D9\u05D9\u05D4");
    if (card.suit.key === "spades") themes.add("\u05E7\u05D5\u05E9\u05D9");
    if (card.rank.key === "A") themes.add("\u05E9\u05E2\u05E8");
    if (card.rank.key === "10") themes.add("\u05EA\u05D5\u05E6\u05D0\u05D4");
    if (["J", "Q", "K"].includes(card.rank.key)) themes.add("\u05D3\u05DE\u05D5\u05EA");
  });
  return Array.from(themes);
}
function buildWarnings(cards) {
  const warnings = [];
  const spadesCount = cards.filter((card) => card.suit.key === "spades").length;
  if (spadesCount >= 2) {
    warnings.push("\u05D9\u05E9 \u05E2\u05D5\u05DE\u05E1 \u05E9\u05DC \u05E2\u05DC\u05D9\u05DD \u05D5\u05DC\u05DB\u05DF \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D6\u05D4\u05E8 \u05DE\u05E2\u05D9\u05DB\u05D5\u05D1, \u05DC\u05D7\u05E5 \u05D0\u05D5 \u05DB\u05D5\u05D1\u05D3.");
  }
  if (cards.some((card) => isAceOfSpades(card))) {
    warnings.push("\u05D0\u05E1 \u05E2\u05DC\u05D4 \u05DE\u05D5\u05E1\u05D9\u05E3 \u05DE\u05E9\u05E7\u05DC \u05DB\u05D1\u05D3 \u05D5\u05DC\u05DB\u05DF \u05E6\u05E8\u05D9\u05DA \u05DC\u05E7\u05E8\u05D5\u05D0 \u05D0\u05EA \u05D4\u05E4\u05E8\u05D9\u05E1\u05D4 \u05D1\u05D6\u05D4\u05D9\u05E8\u05D5\u05EA.");
  }
  return warnings;
}
function detectSpecialRule(_topic, _questionMode, root, heart, direction) {
  if (isCourt(root) && isAceOfSpades(heart) && isCourt(direction)) {
    return "two-people-ace-of-spades-middle";
  }
  if (isCourt(root) && !isCourt(heart) && isCourt(direction)) {
    return "two-people-middle-card";
  }
  return "none";
}
function scoreYesNo(dominantColor, dominantSuit, root, heart, direction) {
  let positive = 0;
  let negative = 0;
  const suits = countSuits([root, heart, direction]);
  if (dominantColor === "red") positive += 3;
  if (dominantColor === "black") negative += 3;
  if (dominantSuit === "hearts") positive += 2;
  if (dominantSuit === "diamonds") positive += 2;
  if (dominantSuit === "clubs") positive += 1;
  if (dominantSuit === "spades") negative += 2;
  if (suits.hearts >= 2) positive += 2;
  if (suits.diamonds >= 2) positive += 2;
  if (suits.clubs >= 2) positive += 1;
  if (suits.spades >= 2) negative += 3;
  if (heart.suit.key === "hearts") positive += 2;
  if (heart.suit.key === "diamonds") positive += 2;
  if (heart.suit.key === "clubs") positive += 1;
  if (heart.suit.key === "spades") negative += 3;
  if (direction.suit.key === "hearts") positive += 2;
  if (direction.suit.key === "diamonds") positive += 2;
  if (direction.suit.key === "clubs") positive += 1;
  if (direction.suit.key === "spades") negative += 2;
  if (isAceOfSpades(heart)) negative += 5;
  if (isAceOfSpades(direction)) negative += 4;
  if (isAceOfSpades(root)) negative += 2;
  return { positive, negative };
}
function resolveYesNoVerdict(score) {
  const diff = score.positive - score.negative;
  if (diff >= 5) return "yes";
  if (diff >= 2) return "yes-but";
  if (diff <= -5) return "no";
  if (diff <= -2) return "no-now";
  return "mixed";
}
function resolveStateVerdict(dominantSuit, dominantColor, root, heart, direction) {
  const suits = countSuits([root, heart, direction]);
  if (isAceOfSpades(heart) || suits.spades >= 2 && dominantColor === "black") {
    return "blocked";
  }
  if (direction.suit.key === "hearts" || suits.hearts >= 2 && dominantColor === "red") {
    return "open-flow";
  }
  if (direction.suit.key === "diamonds" || direction.suit.key === "clubs" || suits.diamonds >= 2 || suits.clubs >= 2) {
    return "practical-progress";
  }
  if (dominantSuit === "spades") return "blocked";
  return "mixed";
}
function resolveOutcomeVerdict(dominantColor, root, heart, direction) {
  const suits = countSuits([root, heart, direction]);
  if (isAceOfSpades(direction) || isAceOfSpades(heart)) {
    return "slow-or-blocked";
  }
  if (direction.suit.key === "hearts" || suits.hearts >= 2 && dominantColor === "red") {
    return "opening";
  }
  if (direction.suit.key === "diamonds" || direction.suit.key === "clubs" || suits.diamonds >= 2 || suits.clubs >= 2) {
    return "practical-result";
  }
  if (direction.suit.key === "spades" || suits.spades >= 2) {
    return "slow-or-blocked";
  }
  return "mixed";
}
function resolveFeelingVerdict(dominantColor, root, heart, direction) {
  const suits = countSuits([root, heart, direction]);
  if (isAceOfSpades(heart) || heart.suit.key === "spades" && suits.spades >= 2) {
    return "blocked-emotion";
  }
  if (heart.suit.key === "hearts" && (direction.suit.key === "hearts" || suits.hearts >= 2 || dominantColor === "red")) {
    return "open-emotion";
  }
  if (heart.suit.key === "diamonds" || direction.suit.key === "diamonds" || dominantColor === "red" && suits.diamonds >= 1) {
    return "warm-but-cautious";
  }
  return "mixed-emotion";
}
function resolveRelationshipVerdict(specialRule, dominantColor, root, heart, direction) {
  const suits = countSuits([root, heart, direction]);
  if (specialRule === "two-people-ace-of-spades-middle") {
    return "blocked-relationship";
  }
  if (isAceOfSpades(heart) || heart.suit.key === "spades" && suits.spades >= 2 || direction.suit.key === "spades" && dominantColor === "black") {
    return "blocked-relationship";
  }
  if (heart.suit.key === "hearts" && (direction.suit.key === "hearts" || suits.hearts >= 2 || dominantColor === "red")) {
    return "open-connection";
  }
  if (heart.suit.key === "diamonds" || direction.suit.key === "diamonds" || dominantColor === "red" && suits.diamonds >= 1) {
    return "attraction-with-delay";
  }
  return "mixed-relationship";
}
function describeCourtCard(card) {
  if (card.rank.key === "Q") {
    return {
      gender: "female",
      age: "mature",
      description: "\u05E0\u05E8\u05D0\u05D9\u05EA \u05DB\u05D0\u05DF \u05D3\u05DE\u05D5\u05EA \u05E0\u05E9\u05D9\u05EA \u05D1\u05D5\u05D2\u05E8\u05EA \u05D0\u05D5 \u05D3\u05D5\u05DE\u05D9\u05E0\u05E0\u05D8\u05D9\u05EA."
    };
  }
  if (card.rank.key === "K") {
    return {
      gender: "male",
      age: "mature",
      description: "\u05E0\u05E8\u05D0\u05D9\u05EA \u05DB\u05D0\u05DF \u05D3\u05DE\u05D5\u05EA \u05D2\u05D1\u05E8\u05D9\u05EA \u05D1\u05D5\u05D2\u05E8\u05EA, \u05D9\u05E6\u05D9\u05D1\u05D4 \u05D0\u05D5 \u05E1\u05DE\u05DB\u05D5\u05EA\u05D9\u05EA \u05D9\u05D5\u05EA\u05E8."
    };
  }
  if (card.rank.key === "J") {
    return {
      gender: "unknown",
      age: "young",
      description: "\u05E0\u05E8\u05D0\u05D9\u05EA \u05DB\u05D0\u05DF \u05D3\u05DE\u05D5\u05EA \u05E6\u05E2\u05D9\u05E8\u05D4 \u05D9\u05D5\u05EA\u05E8, \u05E4\u05D7\u05D5\u05EA \u05D1\u05E9\u05DC\u05D4 \u05D0\u05D5 \u05D1\u05EA\u05E0\u05D5\u05E2\u05D4."
    };
  }
  return {
    gender: "unknown",
    age: "unknown",
    description: "\u05D0\u05D9\u05DF \u05DB\u05D0\u05DF \u05D6\u05D9\u05D4\u05D5\u05D9 \u05D7\u05D3 \u05E9\u05DC \u05D3\u05DE\u05D5\u05EA \u05D7\u05E6\u05E8 \u05DE\u05E8\u05DB\u05D6\u05D9\u05EA."
  };
}
function resolveIdentityVerdict(root, heart, direction) {
  const positions = [
    { name: "heart", card: heart, weight: 3 },
    { name: "direction", card: direction, weight: 2 },
    { name: "root", card: root, weight: 1 }
  ];
  const courtPositions = positions.filter((item) => isCourt(item.card));
  if (courtPositions.length === 0) {
    const energy2 = isAceOfSpades(heart) || isAceOfSpades(direction) ? "blocking" : direction.suit.key === "hearts" || direction.suit.key === "diamonds" ? "helpful" : "neutral";
    return {
      gender: "unknown",
      age: "unknown",
      energy: energy2,
      dominantPosition: "none",
      description: energy2 === "blocking" ? "\u05DC\u05D0 \u05DE\u05D5\u05E4\u05D9\u05E2\u05D4 \u05DB\u05D0\u05DF \u05D3\u05DE\u05D5\u05EA \u05D7\u05E6\u05E8 \u05D1\u05E8\u05D5\u05E8\u05D4, \u05D0\u05D1\u05DC \u05D4\u05D0\u05E0\u05E8\u05D2\u05D9\u05D4 \u05E0\u05E8\u05D0\u05D9\u05EA \u05D7\u05D5\u05E1\u05DE\u05EA \u05D0\u05D5 \u05E7\u05E9\u05D4 \u05D9\u05D5\u05EA\u05E8." : energy2 === "helpful" ? "\u05DC\u05D0 \u05DE\u05D5\u05E4\u05D9\u05E2\u05D4 \u05DB\u05D0\u05DF \u05D3\u05DE\u05D5\u05EA \u05D7\u05E6\u05E8 \u05D1\u05E8\u05D5\u05E8\u05D4, \u05D0\u05D1\u05DC \u05D4\u05D0\u05E0\u05E8\u05D2\u05D9\u05D4 \u05E0\u05E8\u05D0\u05D9\u05EA \u05DE\u05D9\u05D8\u05D9\u05D1\u05D4 \u05D0\u05D5 \u05EA\u05D5\u05DE\u05DB\u05EA \u05D9\u05D5\u05EA\u05E8." : "\u05DC\u05D0 \u05DE\u05D5\u05E4\u05D9\u05E2\u05D4 \u05DB\u05D0\u05DF \u05D3\u05DE\u05D5\u05EA \u05D7\u05E6\u05E8 \u05D1\u05E8\u05D5\u05E8\u05D4, \u05D5\u05DC\u05DB\u05DF \u05E7\u05E9\u05D4 \u05DC\u05D6\u05D4\u05D5\u05EA \u05D0\u05D3\u05DD \u05DE\u05D5\u05D2\u05D3\u05E8 \u05DE\u05EA\u05D5\u05DA \u05D4\u05E4\u05E8\u05D9\u05E1\u05D4."
    };
  }
  const dominantCourt = courtPositions.sort((a, b) => b.weight - a.weight)[0];
  const courtInfo = describeCourtCard(dominantCourt.card);
  const energy = isAceOfSpades(heart) || dominantCourt.card.suit.key === "spades" ? "blocking" : dominantCourt.card.suit.key === "hearts" || dominantCourt.card.suit.key === "diamonds" ? "helpful" : "neutral";
  const positionText = dominantCourt.name === "heart" ? "\u05D4\u05D3\u05DE\u05D5\u05EA \u05E2\u05D5\u05DE\u05D3\u05EA \u05D1\u05DC\u05D1 \u05D4\u05E4\u05E8\u05D9\u05E1\u05D4 \u05D5\u05DC\u05DB\u05DF \u05D4\u05D9\u05D0 \u05DE\u05E8\u05DB\u05D6\u05D9\u05EA \u05DE\u05D0\u05D5\u05D3." : dominantCourt.name === "direction" ? "\u05D4\u05D3\u05DE\u05D5\u05EA \u05DE\u05D5\u05E4\u05D9\u05E2\u05D4 \u05D1\u05DB\u05D9\u05D5\u05D5\u05DF \u05D4\u05D4\u05EA\u05E4\u05EA\u05D7\u05D5\u05EA \u05D5\u05DC\u05DB\u05DF \u05D4\u05D9\u05D0 \u05E0\u05E2\u05E9\u05D9\u05EA \u05DE\u05E9\u05DE\u05E2\u05D5\u05EA\u05D9\u05EA \u05D9\u05D5\u05EA\u05E8 \u05D1\u05D4\u05DE\u05E9\u05DA." : "\u05D4\u05D3\u05DE\u05D5\u05EA \u05DE\u05D5\u05E4\u05D9\u05E2\u05D4 \u05D1\u05E9\u05D5\u05E8\u05E9 \u05D5\u05DC\u05DB\u05DF \u05D4\u05D9\u05D0 \u05D7\u05DC\u05E7 \u05D7\u05E9\u05D5\u05D1 \u05DE\u05D4\u05E8\u05E7\u05E2 \u05E9\u05DC \u05D4\u05E1\u05D9\u05E4\u05D5\u05E8.";
  const energyText = energy === "helpful" ? "\u05D4\u05D0\u05E0\u05E8\u05D2\u05D9\u05D4 \u05E9\u05DC\u05D4 \u05E0\u05E8\u05D0\u05D9\u05EA \u05D9\u05D5\u05EA\u05E8 \u05DE\u05D9\u05D8\u05D9\u05D1\u05D4, \u05EA\u05D5\u05DE\u05DB\u05EA \u05D0\u05D5 \u05E0\u05E2\u05D9\u05DE\u05D4." : energy === "blocking" ? "\u05D4\u05D0\u05E0\u05E8\u05D2\u05D9\u05D4 \u05E9\u05DC\u05D4 \u05E0\u05E8\u05D0\u05D9\u05EA \u05D9\u05D5\u05EA\u05E8 \u05D7\u05D5\u05E1\u05DE\u05EA, \u05DE\u05DB\u05D1\u05D9\u05D3\u05D4 \u05D0\u05D5 \u05DE\u05E7\u05E9\u05D4." : "\u05D4\u05D0\u05E0\u05E8\u05D2\u05D9\u05D4 \u05E9\u05DC\u05D4 \u05E0\u05E8\u05D0\u05D9\u05EA \u05E0\u05D5\u05DB\u05D7\u05EA, \u05D0\u05D1\u05DC \u05DC\u05D0 \u05D7\u05D3-\u05DE\u05E9\u05DE\u05E2\u05D9\u05EA.";
  return {
    gender: courtInfo.gender,
    age: courtInfo.age,
    energy,
    dominantPosition: dominantCourt.name,
    description: `${courtInfo.description} ${positionText} ${energyText}`
  };
}
function buildShortAnswer(params) {
  const {
    questionType,
    questionMode,
    topic,
    specialRule,
    yesNoVerdict,
    stateVerdict,
    outcomeVerdict,
    feelingVerdict,
    relationshipVerdict,
    identityVerdict
  } = params;
  if (specialRule === "two-people-ace-of-spades-middle") {
    return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05D7\u05E1\u05D9\u05DE\u05D4 \u05D0\u05D5 \u05E7\u05D5\u05E0\u05E4\u05DC\u05D9\u05E7\u05D8 \u05D1\u05E8\u05D5\u05E8 \u05D1\u05D9\u05DF \u05E9\u05E0\u05D9 \u05D4\u05E6\u05D3\u05D3\u05D9\u05DD.";
  }
  if (questionType === "yesno" || questionMode === "decision") {
    if (yesNoVerdict === "yes") return "\u05DB\u05DF.";
    if (yesNoVerdict === "yes-but") return "\u05DB\u05DF, \u05D0\u05D1\u05DC \u05D1\u05D6\u05D4\u05D9\u05E8\u05D5\u05EA.";
    if (yesNoVerdict === "no-now") return "\u05DC\u05D0 \u05DB\u05E8\u05D2\u05E2.";
    if (yesNoVerdict === "no") return "\u05DC\u05D0.";
    return "\u05D4\u05EA\u05E9\u05D5\u05D1\u05D4 \u05E2\u05D3\u05D9\u05D9\u05DF \u05DE\u05E2\u05D5\u05E8\u05D1\u05EA.";
  }
  if (questionMode === "relationship") {
    if (relationshipVerdict === "open-connection") return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05E7\u05E9\u05E8 \u05E4\u05EA\u05D5\u05D7 \u05D9\u05D5\u05EA\u05E8.";
    if (relationshipVerdict === "attraction-with-delay") return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05E7\u05E9\u05E8, \u05D0\u05D1\u05DC \u05E2\u05DD \u05E2\u05D9\u05DB\u05D5\u05D1.";
    if (relationshipVerdict === "blocked-relationship") return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05E7\u05E9\u05E8 \u05D7\u05E1\u05D5\u05DD \u05D0\u05D5 \u05DE\u05EA\u05D5\u05D7.";
    return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05E7\u05E9\u05E8 \u05DE\u05E2\u05D5\u05E8\u05D1.";
  }
  if (questionMode === "feeling") {
    if (feelingVerdict === "open-emotion") return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05E8\u05D2\u05E9 \u05E4\u05EA\u05D5\u05D7 \u05D9\u05D5\u05EA\u05E8.";
    if (feelingVerdict === "warm-but-cautious") return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05E8\u05D2\u05E9, \u05D0\u05D1\u05DC \u05D4\u05D5\u05D0 \u05D6\u05D4\u05D9\u05E8.";
    if (feelingVerdict === "blocked-emotion") return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05E8\u05D2\u05E9 \u05D7\u05E1\u05D5\u05DD \u05D0\u05D5 \u05E4\u05D2\u05D5\u05E2.";
    return "\u05D4\u05E8\u05D2\u05E9 \u05DB\u05D0\u05DF \u05DE\u05E2\u05D5\u05E8\u05D1.";
  }
  if (questionMode === "state") {
    if (stateVerdict === "open-flow") return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05DE\u05E6\u05D1 \u05E4\u05EA\u05D5\u05D7 \u05D5\u05D6\u05D5\u05E8\u05DD \u05D9\u05D5\u05EA\u05E8.";
    if (stateVerdict === "practical-progress") return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05EA\u05D4\u05DC\u05D9\u05DA \u05E9\u05DE\u05EA\u05E7\u05D3\u05DD \u05D1\u05E4\u05D5\u05E2\u05DC.";
    if (stateVerdict === "blocked") return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05DB\u05E8\u05D2\u05E2 \u05E7\u05D5\u05E9\u05D9 \u05D0\u05D5 \u05D7\u05E1\u05D9\u05DE\u05D4.";
    return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05DE\u05E6\u05D1 \u05DE\u05E2\u05D5\u05E8\u05D1.";
  }
  if (questionMode === "outcome") {
    if (outcomeVerdict === "opening") return "\u05D4\u05DB\u05D9\u05D5\u05D5\u05DF \u05E0\u05E4\u05EA\u05D7 \u05D1\u05E6\u05D5\u05E8\u05D4 \u05D7\u05D9\u05D5\u05D1\u05D9\u05EA \u05D9\u05D5\u05EA\u05E8.";
    if (outcomeVerdict === "practical-result") return "\u05D4\u05DB\u05D9\u05D5\u05D5\u05DF \u05E0\u05DE\u05E9\u05DA \u05DC\u05EA\u05D5\u05E6\u05D0\u05D4 \u05DE\u05DE\u05E9\u05D9\u05EA \u05D9\u05D5\u05EA\u05E8.";
    if (outcomeVerdict === "slow-or-blocked") return "\u05D4\u05DB\u05D9\u05D5\u05D5\u05DF \u05E0\u05DE\u05E9\u05DA \u05DC\u05D0\u05D8 \u05D0\u05D5 \u05D3\u05E8\u05DA \u05E2\u05D9\u05DB\u05D5\u05D1.";
    return "\u05D4\u05DB\u05D9\u05D5\u05D5\u05DF \u05E2\u05D3\u05D9\u05D9\u05DF \u05DE\u05E2\u05D5\u05E8\u05D1.";
  }
  if (questionMode === "identity" && identityVerdict) {
    if (identityVerdict.gender === "female") return "\u05E0\u05E8\u05D0\u05D9\u05EA \u05DB\u05D0\u05DF \u05D3\u05DE\u05D5\u05EA \u05E0\u05E9\u05D9\u05EA \u05DE\u05E8\u05DB\u05D6\u05D9\u05EA.";
    if (identityVerdict.gender === "male") return "\u05E0\u05E8\u05D0\u05D9\u05EA \u05DB\u05D0\u05DF \u05D3\u05DE\u05D5\u05EA \u05D2\u05D1\u05E8\u05D9\u05EA \u05DE\u05E8\u05DB\u05D6\u05D9\u05EA.";
    if (identityVerdict.age === "young") return "\u05E0\u05E8\u05D0\u05D9\u05EA \u05DB\u05D0\u05DF \u05D3\u05DE\u05D5\u05EA \u05E6\u05E2\u05D9\u05E8\u05D4 \u05D9\u05D5\u05EA\u05E8.";
    return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05D3\u05DE\u05D5\u05EA \u05DE\u05E9\u05DE\u05E2\u05D5\u05EA\u05D9\u05EA, \u05D0\u05D1\u05DC \u05DC\u05D0 \u05D7\u05D3\u05D4 \u05DC\u05D2\u05DE\u05E8\u05D9.";
  }
  if (topic === "work") return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05DB\u05D9\u05D5\u05D5\u05DF \u05DE\u05E9\u05DE\u05E2\u05D5\u05EA\u05D9 \u05D1\u05E0\u05D5\u05E9\u05D0 \u05D4\u05E2\u05D1\u05D5\u05D3\u05D4.";
  if (topic === "love") return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05DE\u05E6\u05D1 \u05E8\u05D2\u05E9\u05D9 \u05DE\u05E9\u05DE\u05E2\u05D5\u05EA\u05D9.";
  if (topic === "money") return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05DE\u05E6\u05D1 \u05D7\u05D5\u05DE\u05E8\u05D9 \u05E9\u05D3\u05D5\u05E8\u05E9 \u05E4\u05D9\u05E8\u05D5\u05E9 \u05DE\u05D3\u05D5\u05D9\u05E7 \u05D9\u05D5\u05EA\u05E8.";
  return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05DE\u05E6\u05D1 \u05E9\u05D3\u05D5\u05E8\u05E9 \u05E4\u05D9\u05E8\u05D5\u05E9 \u05DE\u05E2\u05DE\u05D9\u05E7 \u05D9\u05D5\u05EA\u05E8.";
}
function buildInterpretation(params) {
  const {
    questionType,
    questionMode,
    topic,
    dominantSuit,
    specialRule,
    yesNoVerdict,
    stateVerdict,
    outcomeVerdict,
    feelingVerdict,
    relationshipVerdict,
    identityVerdict
  } = params;
  if (specialRule === "two-people-ace-of-spades-middle") {
    return "\u05DB\u05D0\u05E9\u05E8 \u05D9\u05E9 \u05E9\u05EA\u05D9 \u05D3\u05DE\u05D5\u05D9\u05D5\u05EA \u05D5\u05D1\u05DE\u05E8\u05DB\u05D6 \u05D0\u05E1 \u05D4\u05E2\u05DC\u05D9\u05DD, \u05DE\u05D4 \u05E9\u05E2\u05D5\u05DE\u05D3 \u05D1\u05D9\u05E0\u05D9\u05D4\u05DF \u05D4\u05D5\u05D0 \u05D7\u05E1\u05D9\u05DE\u05D4, \u05E7\u05D5\u05E0\u05E4\u05DC\u05D9\u05E7\u05D8, \u05E8\u05D9\u05D7\u05D5\u05E7 \u05D0\u05D5 \u05DB\u05D0\u05D1.";
  }
  if (specialRule === "two-people-middle-card") {
    return "\u05DB\u05D0\u05E9\u05E8 \u05D9\u05E9 \u05E9\u05EA\u05D9 \u05D3\u05DE\u05D5\u05D9\u05D5\u05EA \u05DE\u05E9\u05E0\u05D9 \u05D4\u05E6\u05D3\u05D3\u05D9\u05DD, \u05D4\u05E7\u05DC\u05E3 \u05D4\u05D0\u05DE\u05E6\u05E2\u05D9 \u05DE\u05E1\u05D1\u05D9\u05E8 \u05DE\u05D4 \u05D1\u05D0\u05DE\u05EA \u05E2\u05D5\u05DE\u05D3 \u05D1\u05D9\u05E0\u05D9\u05D4\u05DF.";
  }
  if (questionType === "yesno" || questionMode === "decision") {
    if (yesNoVerdict === "yes") {
      return "\u05E8\u05D5\u05D1 \u05D4\u05D0\u05D5\u05EA\u05D5\u05EA \u05E0\u05D5\u05D8\u05D9\u05DD \u05DC\u05E6\u05D3 \u05D7\u05D9\u05D5\u05D1\u05D9 \u05D5\u05EA\u05D5\u05DE\u05DA \u05D9\u05D5\u05EA\u05E8.";
    }
    if (yesNoVerdict === "yes-but") {
      return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05E0\u05D8\u05D9\u05D9\u05D4 \u05D7\u05D9\u05D5\u05D1\u05D9\u05EA, \u05D0\u05D1\u05DC \u05DC\u05D0 \u05D1\u05DC\u05D9 \u05D4\u05E1\u05EA\u05D9\u05D9\u05D2\u05D5\u05EA \u05D0\u05D5 \u05E6\u05D5\u05E8\u05DA \u05D1\u05D6\u05D4\u05D9\u05E8\u05D5\u05EA.";
    }
    if (yesNoVerdict === "no-now") {
      return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05D9\u05D5\u05EA\u05E8 \u05E2\u05D9\u05DB\u05D5\u05D1 \u05D0\u05D5 \u05DB\u05D5\u05D1\u05D3 \u05DE\u05D0\u05E9\u05E8 \u05E4\u05EA\u05D9\u05D7\u05D4.";
    }
    if (yesNoVerdict === "no") {
      return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05D7\u05E1\u05D9\u05DE\u05D4 \u05D1\u05E8\u05D5\u05E8\u05D4 \u05D9\u05D5\u05EA\u05E8 \u05DE\u05D0\u05E9\u05E8 \u05EA\u05DE\u05D9\u05DB\u05D4.";
    }
    return "\u05D4\u05D0\u05D5\u05EA\u05D5\u05EA \u05DE\u05E2\u05D5\u05E8\u05D1\u05D9\u05DD, \u05D5\u05DC\u05DB\u05DF \u05D0\u05D9\u05DF \u05DB\u05D0\u05DF \u05EA\u05E9\u05D5\u05D1\u05D4 \u05D7\u05D3-\u05DE\u05E9\u05DE\u05E2\u05D9\u05EA.";
  }
  if (questionMode === "relationship") {
    if (relationshipVerdict === "open-connection") {
      return "\u05D1\u05D9\u05DF \u05D4\u05E6\u05D3\u05D3\u05D9\u05DD \u05D9\u05E9 \u05D6\u05E8\u05D9\u05DE\u05D4 \u05E4\u05EA\u05D5\u05D7\u05D4 \u05D9\u05D5\u05EA\u05E8.";
    }
    if (relationshipVerdict === "attraction-with-delay") {
      return "\u05D9\u05E9 \u05D7\u05D9\u05D1\u05D5\u05E8 \u05D0\u05D5 \u05DE\u05E9\u05D9\u05DB\u05D4, \u05D0\u05D1\u05DC \u05D4\u05DD \u05E2\u05D5\u05D1\u05E8\u05D9\u05DD \u05D3\u05E8\u05DA \u05E2\u05D9\u05DB\u05D5\u05D1 \u05D0\u05D5 \u05D6\u05D4\u05D9\u05E8\u05D5\u05EA.";
    }
    if (relationshipVerdict === "blocked-relationship") {
      return "\u05DE\u05D4 \u05E9\u05E2\u05D5\u05DE\u05D3 \u05D1\u05DE\u05E8\u05DB\u05D6 \u05D4\u05E7\u05E9\u05E8 \u05DB\u05E8\u05D2\u05E2 \u05DB\u05D1\u05D3 \u05D0\u05D5 \u05D7\u05E1\u05D5\u05DD \u05D9\u05D5\u05EA\u05E8.";
    }
    return "\u05D4\u05EA\u05DE\u05D5\u05E0\u05D4 \u05D1\u05D9\u05DF \u05D4\u05E6\u05D3\u05D3\u05D9\u05DD \u05DE\u05E2\u05D5\u05E8\u05D1\u05EA.";
  }
  if (questionMode === "feeling") {
    if (feelingVerdict === "open-emotion") {
      return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05E8\u05D2\u05E9 \u05E4\u05EA\u05D5\u05D7 \u05D5\u05D1\u05E8\u05D5\u05E8 \u05D9\u05D5\u05EA\u05E8.";
    }
    if (feelingVerdict === "warm-but-cautious") {
      return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05E8\u05D2\u05E9 \u05E7\u05D9\u05D9\u05DD, \u05D0\u05D1\u05DC \u05D4\u05D5\u05D0 \u05E9\u05DE\u05D5\u05E8 \u05D0\u05D5 \u05D6\u05D4\u05D9\u05E8.";
    }
    if (feelingVerdict === "blocked-emotion") {
      return "\u05D4\u05E8\u05D2\u05E9 \u05D7\u05E1\u05D5\u05DD, \u05E4\u05D2\u05D5\u05E2 \u05D0\u05D5 \u05DE\u05EA\u05E7\u05E9\u05D4 \u05DC\u05D1\u05D5\u05D0 \u05DC\u05D9\u05D3\u05D9 \u05D1\u05D9\u05D8\u05D5\u05D9.";
    }
    return "\u05D4\u05EA\u05DE\u05D5\u05E0\u05D4 \u05D4\u05E8\u05D2\u05E9\u05D9\u05EA \u05DE\u05E2\u05D5\u05E8\u05D1\u05EA.";
  }
  if (questionMode === "state") {
    if (stateVerdict === "open-flow") {
      return "\u05D4\u05DE\u05E6\u05D1 \u05DE\u05E8\u05D0\u05D4 \u05D9\u05D5\u05EA\u05E8 \u05E4\u05EA\u05D9\u05D7\u05D4 \u05D5\u05D6\u05E8\u05D9\u05DE\u05D4.";
    }
    if (stateVerdict === "practical-progress") {
      return "\u05D4\u05DE\u05E6\u05D1 \u05DE\u05E8\u05D0\u05D4 \u05EA\u05D4\u05DC\u05D9\u05DA \u05E9\u05DE\u05EA\u05E7\u05D3\u05DD \u05D1\u05E4\u05D5\u05E2\u05DC.";
    }
    if (stateVerdict === "blocked") {
      return "\u05D4\u05DE\u05E6\u05D1 \u05DE\u05E8\u05D0\u05D4 \u05DB\u05D5\u05D1\u05D3, \u05E2\u05D9\u05DB\u05D5\u05D1 \u05D0\u05D5 \u05D7\u05E1\u05D9\u05DE\u05D4.";
    }
    return "\u05D4\u05DE\u05E6\u05D1 \u05DE\u05E8\u05D0\u05D4 \u05EA\u05DE\u05D5\u05E0\u05D4 \u05DE\u05E2\u05D5\u05E8\u05D1\u05EA.";
  }
  if (questionMode === "outcome") {
    if (outcomeVerdict === "opening") {
      return "\u05D4\u05DB\u05D9\u05D5\u05D5\u05DF \u05D4\u05D5\u05DC\u05DA \u05D5\u05E0\u05E4\u05EA\u05D7 \u05D9\u05D5\u05EA\u05E8.";
    }
    if (outcomeVerdict === "practical-result") {
      return "\u05D4\u05DB\u05D9\u05D5\u05D5\u05DF \u05E0\u05E2 \u05DC\u05EA\u05D5\u05E6\u05D0\u05D4 \u05DE\u05DE\u05E9\u05D9\u05EA \u05D9\u05D5\u05EA\u05E8.";
    }
    if (outcomeVerdict === "slow-or-blocked") {
      return "\u05D4\u05D4\u05DE\u05E9\u05DA \u05E0\u05E2 \u05D3\u05E8\u05DA \u05E2\u05D9\u05DB\u05D5\u05D1, \u05DB\u05D5\u05D1\u05D3 \u05D0\u05D5 \u05D6\u05D4\u05D9\u05E8\u05D5\u05EA.";
    }
    return "\u05D4\u05DB\u05D9\u05D5\u05D5\u05DF \u05D4\u05E2\u05EA\u05D9\u05D3\u05D9 \u05E2\u05D3\u05D9\u05D9\u05DF \u05DE\u05E2\u05D5\u05E8\u05D1.";
  }
  if (questionMode === "identity" && identityVerdict) {
    return identityVerdict.description;
  }
  if (topic === "love") {
    return "\u05D6\u05D5 \u05E4\u05E8\u05D9\u05E1\u05D4 \u05E8\u05D2\u05E9\u05D9\u05EA, \u05D5\u05DC\u05DB\u05DF \u05DE\u05D4 \u05E9\u05E4\u05D5\u05E2\u05DC \u05D1\u05DC\u05D1 \u05D4\u05E2\u05E0\u05D9\u05D9\u05DF \u05D7\u05E9\u05D5\u05D1 \u05D1\u05DE\u05D9\u05D5\u05D7\u05D3.";
  }
  if (topic === "work") {
    return "\u05D6\u05D5 \u05E4\u05E8\u05D9\u05E1\u05D4 \u05DE\u05E2\u05E9\u05D9\u05EA \u05D9\u05D5\u05EA\u05E8, \u05D5\u05DC\u05DB\u05DF \u05DE\u05E1\u05E8, \u05EA\u05D5\u05E6\u05D0\u05D4 \u05D0\u05D5 \u05D4\u05EA\u05E7\u05D3\u05DE\u05D5\u05EA \u05D1\u05E4\u05D5\u05E2\u05DC \u05D7\u05E9\u05D5\u05D1\u05D9\u05DD \u05D1\u05DE\u05D9\u05D5\u05D7\u05D3.";
  }
  if (topic === "money") {
    return "\u05D6\u05D5 \u05E4\u05E8\u05D9\u05E1\u05D4 \u05D7\u05D5\u05DE\u05E8\u05D9\u05EA \u05D9\u05D5\u05EA\u05E8, \u05D5\u05DC\u05DB\u05DF \u05D4\u05E9\u05D0\u05DC\u05D4 \u05D4\u05D9\u05D0 \u05DE\u05D4 \u05D1\u05D0\u05DE\u05EA \u05D6\u05D6 \u05D5\u05DE\u05D4 \u05E2\u05D3\u05D9\u05D9\u05DF \u05DE\u05EA\u05E2\u05DB\u05D1.";
  }
  if (dominantSuit === "hearts") {
    return "\u05DE\u05E8\u05DB\u05D6 \u05D4\u05DB\u05D5\u05D1\u05D3 \u05E9\u05DC \u05D4\u05E4\u05E8\u05D9\u05E1\u05D4 \u05E8\u05D2\u05E9\u05D9 \u05D9\u05D5\u05EA\u05E8.";
  }
  if (dominantSuit === "diamonds") {
    return "\u05DE\u05E8\u05DB\u05D6 \u05D4\u05DB\u05D5\u05D1\u05D3 \u05E9\u05DC \u05D4\u05E4\u05E8\u05D9\u05E1\u05D4 \u05DE\u05E2\u05E9\u05D9 \u05D9\u05D5\u05EA\u05E8.";
  }
  if (dominantSuit === "clubs") {
    return "\u05DE\u05E8\u05DB\u05D6 \u05D4\u05DB\u05D5\u05D1\u05D3 \u05E9\u05DC \u05D4\u05E4\u05E8\u05D9\u05E1\u05D4 \u05D4\u05D5\u05D0 \u05E2\u05E9\u05D9\u05D9\u05D4 \u05D5\u05EA\u05E0\u05D5\u05E2\u05D4.";
  }
  if (dominantSuit === "spades") {
    return "\u05DE\u05E8\u05DB\u05D6 \u05D4\u05DB\u05D5\u05D1\u05D3 \u05E9\u05DC \u05D4\u05E4\u05E8\u05D9\u05E1\u05D4 \u05D4\u05D5\u05D0 \u05E7\u05D5\u05E9\u05D9, \u05E2\u05D9\u05DB\u05D5\u05D1 \u05D0\u05D5 \u05DE\u05D1\u05D7\u05DF.";
  }
  return "\u05E6\u05E8\u05D9\u05DA \u05DC\u05E7\u05E8\u05D5\u05D0 \u05D0\u05EA \u05E9\u05DC\u05D5\u05E9\u05EA \u05D4\u05E7\u05DC\u05E4\u05D9\u05DD \u05D9\u05D7\u05D3 \u05DB\u05DE\u05D1\u05E0\u05D4 \u05D0\u05D7\u05D3.";
}
function buildOutcome(params) {
  const {
    questionType,
    questionMode,
    topic,
    yesNoVerdict,
    stateVerdict,
    outcomeVerdict,
    feelingVerdict,
    relationshipVerdict,
    identityVerdict
  } = params;
  if (questionType === "yesno" || questionMode === "decision") {
    if (yesNoVerdict === "yes") return "\u05D4\u05DB\u05D9\u05D5\u05D5\u05DF \u05E0\u05DE\u05E9\u05DA \u05DC\u05EA\u05D5\u05E6\u05D0\u05D4 \u05EA\u05D5\u05DE\u05DB\u05EA \u05D9\u05D5\u05EA\u05E8.";
    if (yesNoVerdict === "yes-but") return "\u05D4\u05DB\u05D9\u05D5\u05D5\u05DF \u05E0\u05DE\u05E9\u05DA \u05DC\u05D7\u05D9\u05D5\u05D1, \u05D0\u05D1\u05DC \u05D3\u05E8\u05DA \u05EA\u05E0\u05D0\u05D9 \u05D0\u05D5 \u05D6\u05DE\u05DF.";
    if (yesNoVerdict === "no-now") return "\u05D4\u05DB\u05D9\u05D5\u05D5\u05DF \u05E0\u05DE\u05E9\u05DA \u05DB\u05E8\u05D2\u05E2 \u05DC\u05E2\u05D9\u05DB\u05D5\u05D1 \u05D0\u05D5 \u05E7\u05D5\u05E9\u05D9.";
    if (yesNoVerdict === "no") return "\u05D4\u05DB\u05D9\u05D5\u05D5\u05DF \u05E0\u05DE\u05E9\u05DA \u05DC\u05E1\u05D2\u05D9\u05E8\u05D4 \u05D0\u05D5 \u05D7\u05E1\u05D9\u05DE\u05D4 \u05D1\u05E8\u05D5\u05E8\u05D4 \u05D9\u05D5\u05EA\u05E8.";
    return "\u05D4\u05DB\u05D9\u05D5\u05D5\u05DF \u05E2\u05D3\u05D9\u05D9\u05DF \u05DC\u05D0 \u05E0\u05E1\u05D2\u05E8 \u05DC\u05D2\u05DE\u05E8\u05D9.";
  }
  if (questionMode === "relationship") {
    if (relationshipVerdict === "open-connection") {
      return "\u05D4\u05E7\u05E9\u05E8 \u05E0\u05DE\u05E9\u05DA \u05DC\u05E4\u05EA\u05D9\u05D7\u05D4 \u05D0\u05D5 \u05E7\u05D9\u05E8\u05D1\u05D4.";
    }
    if (relationshipVerdict === "attraction-with-delay") {
      return "\u05D4\u05E7\u05E9\u05E8 \u05E0\u05DE\u05E9\u05DA \u05D3\u05E8\u05DA \u05E2\u05E0\u05D9\u05D9\u05DF, \u05D0\u05D1\u05DC \u05D2\u05DD \u05D3\u05E8\u05DA \u05E2\u05D9\u05DB\u05D5\u05D1.";
    }
    if (relationshipVerdict === "blocked-relationship") {
      return "\u05D4\u05E7\u05E9\u05E8 \u05E0\u05DE\u05E9\u05DA \u05DB\u05E8\u05D2\u05E2 \u05D3\u05E8\u05DA \u05DE\u05EA\u05D7, \u05D7\u05E1\u05D9\u05DE\u05D4 \u05D0\u05D5 \u05E8\u05D9\u05D7\u05D5\u05E7.";
    }
    return "\u05D4\u05E7\u05E9\u05E8 \u05E2\u05D3\u05D9\u05D9\u05DF \u05DE\u05E2\u05D5\u05E8\u05D1.";
  }
  if (questionMode === "feeling") {
    if (feelingVerdict === "open-emotion") {
      return "\u05D4\u05E8\u05D2\u05E9 \u05E0\u05DE\u05E9\u05DA \u05DC\u05E4\u05EA\u05D9\u05D7\u05D4 \u05D2\u05D3\u05D5\u05DC\u05D4 \u05D9\u05D5\u05EA\u05E8.";
    }
    if (feelingVerdict === "warm-but-cautious") {
      return "\u05D4\u05E8\u05D2\u05E9 \u05E7\u05D9\u05D9\u05DD, \u05D0\u05D1\u05DC \u05D4\u05D4\u05DE\u05E9\u05DA \u05E9\u05DC\u05D5 \u05E2\u05D5\u05D1\u05E8 \u05D3\u05E8\u05DA \u05D6\u05D4\u05D9\u05E8\u05D5\u05EA.";
    }
    if (feelingVerdict === "blocked-emotion") {
      return "\u05D4\u05E8\u05D2\u05E9 \u05E0\u05DE\u05E9\u05DA \u05D3\u05E8\u05DA \u05D7\u05E1\u05D9\u05DE\u05D4 \u05D0\u05D5 \u05E7\u05D5\u05E9\u05D9 \u05DC\u05D4\u05D9\u05E4\u05EA\u05D7.";
    }
    return "\u05D4\u05E8\u05D2\u05E9 \u05E2\u05D3\u05D9\u05D9\u05DF \u05DE\u05E2\u05D5\u05E8\u05D1.";
  }
  if (questionMode === "state") {
    if (stateVerdict === "open-flow") {
      return "\u05D4\u05DE\u05E6\u05D1 \u05E0\u05DE\u05E9\u05DA \u05DC\u05D9\u05D5\u05EA\u05E8 \u05D6\u05E8\u05D9\u05DE\u05D4 \u05D5\u05E4\u05EA\u05D9\u05D7\u05D4.";
    }
    if (stateVerdict === "practical-progress") {
      return "\u05D4\u05DE\u05E6\u05D1 \u05E0\u05DE\u05E9\u05DA \u05DC\u05D4\u05DE\u05E9\u05DA \u05EA\u05E0\u05D5\u05E2\u05D4 \u05D0\u05D5 \u05D4\u05EA\u05E7\u05D3\u05DE\u05D5\u05EA \u05DE\u05E2\u05E9\u05D9\u05EA.";
    }
    if (stateVerdict === "blocked") {
      return "\u05D4\u05DE\u05E6\u05D1 \u05E0\u05DE\u05E9\u05DA \u05DB\u05E8\u05D2\u05E2 \u05DC\u05E2\u05D9\u05DB\u05D5\u05D1 \u05D0\u05D5 \u05DB\u05D5\u05D1\u05D3.";
    }
    return "\u05D4\u05DE\u05E6\u05D1 \u05E2\u05D3\u05D9\u05D9\u05DF \u05DE\u05E2\u05D5\u05E8\u05D1.";
  }
  if (questionMode === "outcome") {
    if (outcomeVerdict === "opening") {
      return "\u05D4\u05D4\u05EA\u05E4\u05EA\u05D7\u05D5\u05EA \u05E0\u05E4\u05EA\u05D7\u05EA \u05DC\u05DB\u05D9\u05D5\u05D5\u05DF \u05D7\u05D9\u05D5\u05D1\u05D9 \u05D9\u05D5\u05EA\u05E8.";
    }
    if (outcomeVerdict === "practical-result") {
      return "\u05D4\u05D4\u05EA\u05E4\u05EA\u05D7\u05D5\u05EA \u05E0\u05DE\u05E9\u05DB\u05EA \u05DC\u05EA\u05D5\u05E6\u05D0\u05D4 \u05DE\u05DE\u05E9\u05D9\u05EA \u05D9\u05D5\u05EA\u05E8.";
    }
    if (outcomeVerdict === "slow-or-blocked") {
      return "\u05D4\u05D4\u05EA\u05E4\u05EA\u05D7\u05D5\u05EA \u05E0\u05DE\u05E9\u05DB\u05EA \u05DC\u05D0\u05D8 \u05D9\u05D5\u05EA\u05E8 \u05D0\u05D5 \u05D3\u05E8\u05DA \u05D7\u05E1\u05D9\u05DE\u05D4.";
    }
    return "\u05D4\u05D4\u05EA\u05E4\u05EA\u05D7\u05D5\u05EA \u05E2\u05D3\u05D9\u05D9\u05DF \u05DE\u05E2\u05D5\u05E8\u05D1\u05EA.";
  }
  if (questionMode === "identity" && identityVerdict) {
    if (identityVerdict.energy === "helpful") {
      return "\u05D4\u05D3\u05DE\u05D5\u05EA \u05D4\u05D6\u05D0\u05EA \u05D9\u05DB\u05D5\u05DC\u05D4 \u05DC\u05D4\u05D9\u05D5\u05EA \u05DE\u05D5\u05E2\u05D9\u05DC\u05D4 \u05D0\u05D5 \u05EA\u05D5\u05DE\u05DB\u05EA \u05D9\u05D5\u05EA\u05E8 \u05D1\u05D4\u05DE\u05E9\u05DA.";
    }
    if (identityVerdict.energy === "blocking") {
      return "\u05D4\u05D3\u05DE\u05D5\u05EA \u05D4\u05D6\u05D0\u05EA \u05E2\u05DC\u05D5\u05DC\u05D4 \u05DC\u05D4\u05DB\u05D1\u05D9\u05D3 \u05D0\u05D5 \u05DC\u05E2\u05DB\u05D1 \u05D0\u05EA \u05D4\u05D4\u05DE\u05E9\u05DA.";
    }
    return "\u05D4\u05D3\u05DE\u05D5\u05EA \u05D4\u05D6\u05D0\u05EA \u05DE\u05E9\u05DE\u05E2\u05D5\u05EA\u05D9\u05EA, \u05D0\u05D1\u05DC \u05D4\u05D4\u05E9\u05E4\u05E2\u05D4 \u05E9\u05DC\u05D4 \u05E2\u05D3\u05D9\u05D9\u05DF \u05DC\u05D0 \u05D7\u05D3-\u05DE\u05E9\u05DE\u05E2\u05D9\u05EA.";
  }
  if (topic === "love") {
    return "\u05D4\u05DB\u05D9\u05D5\u05D5\u05DF \u05EA\u05DC\u05D5\u05D9 \u05D1\u05E9\u05D0\u05DC\u05D4 \u05D0\u05DD \u05D4\u05E8\u05D2\u05E9 \u05D9\u05E6\u05DC\u05D9\u05D7 \u05DC\u05D4\u05D9\u05E4\u05EA\u05D7 \u05D0\u05D5 \u05D9\u05D9\u05E9\u05D0\u05E8 \u05D7\u05E1\u05D5\u05DD.";
  }
  if (topic === "work") {
    return "\u05D4\u05DB\u05D9\u05D5\u05D5\u05DF \u05EA\u05DC\u05D5\u05D9 \u05D1\u05EA\u05D5\u05E6\u05D0\u05D4, \u05D1\u05DE\u05E1\u05E8 \u05D0\u05D5 \u05D1\u05D4\u05EA\u05E7\u05D3\u05DE\u05D5\u05EA \u05E9\u05EA\u05D2\u05D9\u05E2 \u05D1\u05E4\u05D5\u05E2\u05DC.";
  }
  return "\u05D4\u05DB\u05D9\u05D5\u05D5\u05DF \u05E2\u05D3\u05D9\u05D9\u05DF \u05DE\u05EA\u05E4\u05EA\u05D7.";
}
function buildConclusion(params) {
  const {
    questionType,
    questionMode,
    topic,
    dominantSuit,
    specialRule,
    yesNoVerdict,
    stateVerdict,
    outcomeVerdict,
    feelingVerdict,
    relationshipVerdict,
    identityVerdict
  } = params;
  if (specialRule === "two-people-ace-of-spades-middle") {
    return "\u05DE\u05D5\u05E4\u05D9\u05E2\u05D5\u05EA \u05DB\u05D0\u05DF \u05E9\u05EA\u05D9 \u05D3\u05DE\u05D5\u05D9\u05D5\u05EA \u05D5\u05D1\u05D9\u05E0\u05D9\u05D4\u05DF \u05D7\u05E1\u05D9\u05DE\u05D4, \u05E8\u05D9\u05D7\u05D5\u05E7 \u05D0\u05D5 \u05E7\u05D5\u05E0\u05E4\u05DC\u05D9\u05E7\u05D8 \u05D1\u05E8\u05D5\u05E8.";
  }
  if (questionType === "yesno" || questionMode === "decision") {
    if (yesNoVerdict === "yes") {
      return topic === "work" ? "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05D9\u05D5\u05EA\u05E8 \u05EA\u05DE\u05D9\u05DB\u05D4 \u05DE\u05D0\u05E9\u05E8 \u05D4\u05EA\u05E0\u05D2\u05D3\u05D5\u05EA, \u05D5\u05DC\u05DB\u05DF \u05D9\u05E9 \u05E1\u05D9\u05DB\u05D5\u05D9 \u05D8\u05D5\u05D1 \u05D9\u05D5\u05EA\u05E8 \u05DC\u05D4\u05EA\u05E7\u05D3\u05DE\u05D5\u05EA." : "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05D9\u05D5\u05EA\u05E8 \u05EA\u05DE\u05D9\u05DB\u05D4 \u05DE\u05D0\u05E9\u05E8 \u05D4\u05EA\u05E0\u05D2\u05D3\u05D5\u05EA, \u05D5\u05DC\u05DB\u05DF \u05D4\u05EA\u05E9\u05D5\u05D1\u05D4 \u05E0\u05D5\u05D8\u05D4 \u05DC\u05D7\u05D9\u05D5\u05D1.";
    }
    if (yesNoVerdict === "yes-but") {
      return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05E0\u05D8\u05D9\u05D9\u05D4 \u05DC\u05D7\u05D9\u05D5\u05D1, \u05D0\u05D1\u05DC \u05DC\u05D0 \u05D1\u05DC\u05D9 \u05D6\u05DE\u05DF, \u05D6\u05D4\u05D9\u05E8\u05D5\u05EA \u05D0\u05D5 \u05D4\u05E1\u05EA\u05D9\u05D9\u05D2\u05D5\u05EA.";
    }
    if (yesNoVerdict === "no-now") {
      return "\u05DB\u05E8\u05D2\u05E2 \u05D9\u05E9 \u05D9\u05D5\u05EA\u05E8 \u05E2\u05D9\u05DB\u05D5\u05D1 \u05D0\u05D5 \u05DB\u05D5\u05D1\u05D3 \u05DE\u05D0\u05E9\u05E8 \u05E4\u05EA\u05D9\u05D7\u05D4.";
    }
    if (yesNoVerdict === "no") {
      return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05D7\u05E1\u05D9\u05DE\u05D4 \u05D1\u05E8\u05D5\u05E8\u05D4 \u05D9\u05D5\u05EA\u05E8 \u05DE\u05D0\u05E9\u05E8 \u05EA\u05DE\u05D9\u05DB\u05D4.";
    }
    return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05D0\u05D5\u05EA\u05D5\u05EA \u05DC\u05E9\u05E0\u05D9 \u05D4\u05E6\u05D3\u05D3\u05D9\u05DD, \u05D5\u05DC\u05DB\u05DF \u05D4\u05EA\u05E9\u05D5\u05D1\u05D4 \u05E2\u05D3\u05D9\u05D9\u05DF \u05D0\u05D9\u05E0\u05D4 \u05E0\u05E1\u05D2\u05E8\u05EA \u05D1\u05D0\u05D5\u05E4\u05DF \u05D7\u05D3.";
  }
  if (questionMode === "relationship") {
    if (relationshipVerdict === "open-connection") {
      return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05E7\u05E9\u05E8 \u05E4\u05EA\u05D5\u05D7 \u05D9\u05D5\u05EA\u05E8 \u05D5\u05D6\u05D5\u05E8\u05DD \u05D9\u05D5\u05EA\u05E8.";
    }
    if (relationshipVerdict === "attraction-with-delay") {
      return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05E7\u05E9\u05E8 \u05D0\u05D5 \u05DE\u05E9\u05D9\u05DB\u05D4, \u05D0\u05D1\u05DC \u05D2\u05DD \u05E2\u05D9\u05DB\u05D5\u05D1, \u05E9\u05DE\u05D9\u05E8\u05D4 \u05D0\u05D5 \u05E7\u05E6\u05D1 \u05D0\u05D9\u05D8\u05D9 \u05D9\u05D5\u05EA\u05E8.";
    }
    if (relationshipVerdict === "blocked-relationship") {
      return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05E7\u05E9\u05E8 \u05E9\u05D7\u05E1\u05D5\u05DD, \u05DE\u05EA\u05D5\u05D7 \u05D0\u05D5 \u05DB\u05D1\u05D3 \u05D9\u05D5\u05EA\u05E8 \u05DB\u05E8\u05D2\u05E2.";
    }
    return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05E7\u05E9\u05E8 \u05DE\u05E2\u05D5\u05E8\u05D1.";
  }
  if (questionMode === "feeling") {
    if (feelingVerdict === "open-emotion") {
      return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05E8\u05D2\u05E9 \u05E4\u05EA\u05D5\u05D7, \u05D7\u05D9 \u05D5\u05D1\u05E8\u05D5\u05E8 \u05D9\u05D5\u05EA\u05E8.";
    }
    if (feelingVerdict === "warm-but-cautious") {
      return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05E8\u05D2\u05E9 \u05E7\u05D9\u05D9\u05DD, \u05D0\u05D1\u05DC \u05D4\u05D5\u05D0 \u05E2\u05D3\u05D9\u05D9\u05DF \u05D6\u05D4\u05D9\u05E8 \u05D0\u05D5 \u05E9\u05DE\u05D5\u05E8.";
    }
    if (feelingVerdict === "blocked-emotion") {
      return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05E8\u05D2\u05E9 \u05E9\u05D7\u05E1\u05D5\u05DD, \u05E4\u05D2\u05D5\u05E2 \u05D0\u05D5 \u05DE\u05E2\u05D5\u05DB\u05D1 \u05D9\u05D5\u05EA\u05E8.";
    }
    return "\u05D9\u05E9 \u05DB\u05D0\u05DF \u05EA\u05DE\u05D5\u05E0\u05D4 \u05E8\u05D2\u05E9\u05D9\u05EA \u05DE\u05E2\u05D5\u05E8\u05D1\u05EA.";
  }
  if (questionMode === "state") {
    if (stateVerdict === "open-flow") {
      return "\u05DE\u05E6\u05D1 \u05D4\u05E2\u05E0\u05D9\u05D9\u05DF \u05E4\u05EA\u05D5\u05D7 \u05D5\u05D6\u05D5\u05E8\u05DD \u05D9\u05D5\u05EA\u05E8.";
    }
    if (stateVerdict === "practical-progress") {
      return "\u05DE\u05E6\u05D1 \u05D4\u05E2\u05E0\u05D9\u05D9\u05DF \u05DE\u05EA\u05E7\u05D3\u05DD \u05D3\u05E8\u05DA \u05E2\u05E9\u05D9\u05D9\u05D4, \u05DE\u05E1\u05E8 \u05D0\u05D5 \u05EA\u05E0\u05D5\u05E2\u05D4 \u05DE\u05DE\u05E9\u05D9\u05EA.";
    }
    if (stateVerdict === "blocked") {
      return "\u05DE\u05E6\u05D1 \u05D4\u05E2\u05E0\u05D9\u05D9\u05DF \u05DB\u05D1\u05D3, \u05D7\u05E1\u05D5\u05DD \u05D0\u05D5 \u05DE\u05E2\u05D5\u05DB\u05D1 \u05D9\u05D5\u05EA\u05E8 \u05DB\u05E8\u05D2\u05E2.";
    }
    return "\u05DE\u05E6\u05D1 \u05D4\u05E2\u05E0\u05D9\u05D9\u05DF \u05DE\u05E2\u05D5\u05E8\u05D1.";
  }
  if (questionMode === "outcome") {
    if (outcomeVerdict === "opening") {
      return "\u05D4\u05D4\u05EA\u05E4\u05EA\u05D7\u05D5\u05EA \u05D4\u05E2\u05EA\u05D9\u05D3\u05D9\u05EA \u05E0\u05E4\u05EA\u05D7\u05EA \u05DC\u05DB\u05D9\u05D5\u05D5\u05DF \u05D7\u05D9\u05D5\u05D1\u05D9 \u05D9\u05D5\u05EA\u05E8.";
    }
    if (outcomeVerdict === "practical-result") {
      return "\u05D4\u05D4\u05EA\u05E4\u05EA\u05D7\u05D5\u05EA \u05D4\u05E2\u05EA\u05D9\u05D3\u05D9\u05EA \u05E0\u05E8\u05D0\u05D9\u05EA \u05D4\u05D5\u05DC\u05DB\u05EA \u05DC\u05EA\u05D5\u05E6\u05D0\u05D4 \u05DE\u05DE\u05E9\u05D9\u05EA \u05D9\u05D5\u05EA\u05E8.";
    }
    if (outcomeVerdict === "slow-or-blocked") {
      return "\u05D4\u05D4\u05EA\u05E4\u05EA\u05D7\u05D5\u05EA \u05D4\u05E2\u05EA\u05D9\u05D3\u05D9\u05EA \u05E0\u05E8\u05D0\u05D9\u05EA \u05D0\u05D9\u05D8\u05D9\u05EA, \u05DB\u05D1\u05D3\u05D4 \u05D0\u05D5 \u05DE\u05E2\u05D5\u05DB\u05D1\u05EA \u05D9\u05D5\u05EA\u05E8.";
    }
    return "\u05D4\u05D4\u05EA\u05E4\u05EA\u05D7\u05D5\u05EA \u05D4\u05E2\u05EA\u05D9\u05D3\u05D9\u05EA \u05E2\u05D3\u05D9\u05D9\u05DF \u05DE\u05E2\u05D5\u05E8\u05D1\u05EA.";
  }
  if (questionMode === "identity" && identityVerdict) {
    return identityVerdict.description;
  }
  if (dominantSuit === "hearts") {
    return "\u05DE\u05E8\u05DB\u05D6 \u05D4\u05DB\u05D5\u05D1\u05D3 \u05E9\u05DC \u05D4\u05E4\u05E8\u05D9\u05E1\u05D4 \u05E8\u05D2\u05E9\u05D9 \u05D9\u05D5\u05EA\u05E8.";
  }
  if (dominantSuit === "diamonds") {
    return "\u05DE\u05E8\u05DB\u05D6 \u05D4\u05DB\u05D5\u05D1\u05D3 \u05E9\u05DC \u05D4\u05E4\u05E8\u05D9\u05E1\u05D4 \u05DE\u05E2\u05E9\u05D9 \u05D0\u05D5 \u05D7\u05D5\u05DE\u05E8\u05D9 \u05D9\u05D5\u05EA\u05E8.";
  }
  if (dominantSuit === "clubs") {
    return "\u05DE\u05E8\u05DB\u05D6 \u05D4\u05DB\u05D5\u05D1\u05D3 \u05E9\u05DC \u05D4\u05E4\u05E8\u05D9\u05E1\u05D4 \u05D4\u05D5\u05D0 \u05E2\u05E9\u05D9\u05D9\u05D4, \u05D9\u05D5\u05D6\u05DE\u05D4 \u05D5\u05EA\u05E0\u05D5\u05E2\u05D4.";
  }
  if (dominantSuit === "spades") {
    return "\u05DE\u05E8\u05DB\u05D6 \u05D4\u05DB\u05D5\u05D1\u05D3 \u05E9\u05DC \u05D4\u05E4\u05E8\u05D9\u05E1\u05D4 \u05D4\u05D5\u05D0 \u05E7\u05D5\u05E9\u05D9, \u05E2\u05D9\u05DB\u05D5\u05D1 \u05D0\u05D5 \u05DE\u05D1\u05D7\u05DF.";
  }
  if (topic === "work") {
    return "\u05E6\u05E8\u05D9\u05DA \u05DC\u05E7\u05E8\u05D5\u05D0 \u05D0\u05EA \u05D4\u05E4\u05E8\u05D9\u05E1\u05D4 \u05D3\u05E8\u05DA \u05DE\u05D4 \u05E9\u05DE\u05EA\u05E7\u05D3\u05DD \u05D1\u05E4\u05D5\u05E2\u05DC \u05D5\u05DE\u05D4 \u05E2\u05D3\u05D9\u05D9\u05DF \u05DE\u05D7\u05DB\u05D4 \u05DC\u05EA\u05E9\u05D5\u05D1\u05D4 \u05D0\u05D5 \u05EA\u05D5\u05E6\u05D0\u05D4.";
  }
  if (topic === "love") {
    return "\u05E6\u05E8\u05D9\u05DA \u05DC\u05E7\u05E8\u05D5\u05D0 \u05D0\u05EA \u05D4\u05E4\u05E8\u05D9\u05E1\u05D4 \u05D3\u05E8\u05DA \u05DE\u05D4 \u05E9\u05E4\u05D5\u05E2\u05DC \u05D1\u05DC\u05D1 \u05D4\u05E2\u05E0\u05D9\u05D9\u05DF \u05D5\u05DE\u05D4 \u05D1\u05D0\u05DE\u05EA \u05E0\u05E4\u05EA\u05D7 \u05E8\u05D2\u05E9\u05D9\u05EA.";
  }
  return "\u05E6\u05E8\u05D9\u05DA \u05DC\u05E7\u05E8\u05D5\u05D0 \u05D0\u05EA \u05D4\u05E4\u05E8\u05D9\u05E1\u05D4 \u05DB\u05DE\u05DB\u05DC\u05D5\u05DC \u05D5\u05DC\u05D0 \u05DC\u05E4\u05D9 \u05E7\u05DC\u05E3 \u05D0\u05D7\u05D3 \u05D1\u05DC\u05D1\u05D3.";
}
function runThreeCardEngine(question, root, heart, direction) {
  const cards = [root, heart, direction];
  const questionType = detectQuestionType(question);
  const topic = detectTopic(question);
  const questionMode = detectQuestionMode(question, questionType, topic);
  const dominantSuit = detectDominantSuit(cards);
  const dominantColor = detectDominantColor(cards);
  const rootMeaning = buildCardMeaning(root);
  const heartMeaning = buildCardMeaning(heart);
  const directionMeaning = buildCardMeaning(direction);
  const rootHeartInteraction = buildInteraction(root, heart);
  const heartDirectionInteraction = buildInteraction(heart, direction);
  const rootDirectionInteraction = buildInteraction(root, direction);
  const themes = buildThemes(cards);
  const warnings = buildWarnings(cards);
  const specialRule = detectSpecialRule(
    topic,
    questionMode,
    root,
    heart,
    direction
  );
  const yesNoVerdict = questionType === "yesno" || questionMode === "decision" ? resolveYesNoVerdict(
    scoreYesNo(dominantColor, dominantSuit, root, heart, direction)
  ) : void 0;
  const stateVerdict = questionMode === "state" ? resolveStateVerdict(dominantSuit, dominantColor, root, heart, direction) : void 0;
  const outcomeVerdict = questionMode === "outcome" ? resolveOutcomeVerdict(dominantColor, root, heart, direction) : void 0;
  const feelingVerdict = questionMode === "feeling" ? resolveFeelingVerdict(dominantColor, root, heart, direction) : void 0;
  const relationshipVerdict = questionMode === "relationship" ? resolveRelationshipVerdict(
    specialRule,
    dominantColor,
    root,
    heart,
    direction
  ) : void 0;
  const identityVerdict = questionMode === "identity" ? resolveIdentityVerdict(root, heart, direction) : void 0;
  const shortAnswer = buildShortAnswer({
    questionType,
    questionMode,
    topic,
    specialRule,
    yesNoVerdict,
    stateVerdict,
    outcomeVerdict,
    feelingVerdict,
    relationshipVerdict,
    identityVerdict
  });
  const interpretation = buildInterpretation({
    questionType,
    questionMode,
    topic,
    dominantSuit,
    specialRule,
    yesNoVerdict,
    stateVerdict,
    outcomeVerdict,
    feelingVerdict,
    relationshipVerdict,
    identityVerdict
  });
  const outcome = buildOutcome({
    questionType,
    questionMode,
    topic,
    yesNoVerdict,
    stateVerdict,
    outcomeVerdict,
    feelingVerdict,
    relationshipVerdict,
    identityVerdict
  });
  const conclusion = buildConclusion({
    questionType,
    questionMode,
    topic,
    dominantSuit,
    specialRule,
    yesNoVerdict,
    stateVerdict,
    outcomeVerdict,
    feelingVerdict,
    relationshipVerdict,
    identityVerdict
  });
  return {
    questionType,
    questionMode,
    topic,
    dominantSuit,
    dominantColor,
    specialRule,
    yesNoVerdict,
    stateVerdict,
    outcomeVerdict,
    feelingVerdict,
    relationshipVerdict,
    identityVerdict,
    rootMeaning,
    heartMeaning,
    directionMeaning,
    rootHeartInteraction,
    heartDirectionInteraction,
    rootDirectionInteraction,
    themes,
    warnings,
    shortAnswer,
    interpretation,
    outcome,
    conclusion
  };
}
export {
  runThreeCardEngine
};
