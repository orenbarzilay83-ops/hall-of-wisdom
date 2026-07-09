import { getSpreadKnowledge, getSuitInteraction, COURT_CARDS_SUIT_PERSONALITY } from "./knowledge/index.js";
import { interpretCard, detectTopic } from "./knowledge/context-interpreter.js";
function getSuit(cardCode) {
  return cardCode.slice(-1);
}
function getSuitName(suit) {
  const names = {
    C: "\u05EA\u05DC\u05EA\u05DF \u2663",
    D: "\u05D9\u05D4\u05DC\u05D5\u05DD \u2666",
    H: "\u05DC\u05D1 \u2665",
    S: "\u05E2\u05DC\u05D4 \u2660"
  };
  return names[suit] ?? suit;
}
function buildKnowledgeContext(cardCodes, question, topic = "") {
  const entries = getSpreadKnowledge(cardCodes);
  if (entries.length === 0) return "";
  const lines = [];
  const detectedTopic = detectTopic(topic, question);
  const isWork = detectedTopic === "work";
  const isLove = detectedTopic === "love";
  const isMoney = detectedTopic === "money";
  const isHealth = detectedTopic === "health";
  const domainKey = detectedTopic;
  const SUIT_COLORS = { H: "red", D: "red", C: "black", S: "black" };
  const colors = cardCodes.map((c) => SUIT_COLORS[c.slice(-1)] || "black");
  const redCount = colors.filter((c) => c === "red").length;
  const blackCount = colors.length - redCount;
  const colorNote = redCount > blackCount ? `\u05DE\u05D0\u05D6\u05DF \u05E6\u05D1\u05E2\u05D9\u05DD: ${redCount} \u05D0\u05D3\u05D5\u05DD, ${blackCount} \u05E9\u05D7\u05D5\u05E8 \u2014 \u05E8\u05D5\u05D1 \u05D7\u05D9\u05D5\u05D1\u05D9` : blackCount > redCount ? `\u05DE\u05D0\u05D6\u05DF \u05E6\u05D1\u05E2\u05D9\u05DD: ${redCount} \u05D0\u05D3\u05D5\u05DD, ${blackCount} \u05E9\u05D7\u05D5\u05E8 \u2014 \u05E8\u05D5\u05D1 \u05DE\u05D0\u05EA\u05D2\u05E8` : `\u05DE\u05D0\u05D6\u05DF \u05E6\u05D1\u05E2\u05D9\u05DD: ${redCount} \u05D0\u05D3\u05D5\u05DD, ${blackCount} \u05E9\u05D7\u05D5\u05E8 \u2014 \u05E9\u05D5\u05D5\u05D9\u05D5\u05DF`;
  lines.push(`\u05EA\u05D7\u05D5\u05DD \u05D4\u05E7\u05E8\u05D9\u05D0\u05D4: ${isWork ? "\u05E2\u05D1\u05D5\u05D3\u05D4/\u05E7\u05E8\u05D9\u05D9\u05E8\u05D4" : isLove ? "\u05D6\u05D5\u05D2\u05D9\u05D5\u05EA/\u05E8\u05D2\u05E9" : isMoney ? "\u05DB\u05E1\u05E3/\u05DB\u05DC\u05DB\u05DC\u05D4" : isHealth ? "\u05D1\u05E8\u05D9\u05D0\u05D5\u05EA" : "\u05DB\u05DC\u05DC\u05D9"}`);
  lines.push(colorNote);
  lines.push("");
  entries.forEach((entry, i) => {
    const position = i === 0 ? "\u05E7\u05DC\u05E3 \u05E9\u05D5\u05E8\u05E9 (\u05E2\u05D1\u05E8)" : i === 1 ? "\u05E7\u05DC\u05E3 \u05DC\u05D1 (\u05D4\u05D5\u05D5\u05D4)" : "\u05E7\u05DC\u05E3 \u05DB\u05D9\u05D5\u05D5\u05DF (\u05E2\u05EA\u05D9\u05D3)";
    lines.push(`--- ${position}: ${entry.cardCode} ---`);
    if (entry.suitMeaning) {
      lines.push(`\u05E1\u05D3\u05E8\u05D4: ${entry.suitMeaning}`);
    }
    if (entry.numberMeaning) {
      lines.push(`\u05DE\u05E1\u05E4\u05E8: ${entry.numberMeaning}`);
    }
    if (entry.suitInfluence) {
      lines.push(`\u05D4\u05E9\u05E4\u05E2\u05EA \u05D4\u05E1\u05D3\u05E8\u05D4 \u05D1\u05E4\u05E8\u05D9\u05E1\u05D4: ${entry.suitInfluence}`);
    }
    const contextInterpretation = interpretCard(entry.cardCode, detectedTopic);
    if (contextInterpretation) {
      lines.push(`\u05DE\u05E9\u05DE\u05E2\u05D5\u05EA \u05D1\u05D4\u05E7\u05E9\u05E8 \u05D6\u05D4: ${contextInterpretation}`);
    }
    if (!contextInterpretation) {
      lines.push(`\u05DB\u05D9\u05E6\u05D3 \u05DC\u05E7\u05E8\u05D5\u05D0: ${entry.howToRead}`);
    }
    if (entry.isCourtCard && entry.archetype) {
      lines.push(`\u05D0\u05E8\u05DB\u05D9\u05D8\u05D9\u05E4: ${entry.archetype}`);
    }
    const thisRank = entry.cardCode.slice(0, -1);
    const rankCountInSpread = cardCodes.filter((c) => c.slice(0, -1) === thisRank).length;
    if (!entry.isCourtCard && rankCountInSpread > 1 && entry.doubles) {
      const relevantMeaning = entry.doubles[rankCountInSpread.toString()];
      if (relevantMeaning) {
        lines.push(`\u05E7\u05DC\u05E4\u05D9\u05DD \u05DB\u05E4\u05D5\u05DC\u05D9\u05DD (${rankCountInSpread}): ${relevantMeaning}`);
      }
    }
    if (!entry.isCourtCard && entry.combinations && Object.keys(entry.combinations).length > 0) {
      const isCourt = (c) => ["K", "Q", "J"].includes(c.slice(0, -1));
      const relevantCombos = Object.entries(entry.combinations).filter(([other]) => {
        if (other === "court") return cardCodes.some(isCourt);
        return cardCodes.includes(other);
      });
      if (relevantCombos.length > 0) {
        lines.push("\u05E9\u05D9\u05DC\u05D5\u05D1\u05D9\u05DD \u05E2\u05DD \u05E7\u05DC\u05E4\u05D9\u05DD \u05D0\u05D7\u05E8\u05D9\u05DD:");
        for (const [other, meaning] of relevantCombos) {
          lines.push(`  \u05E2\u05DD ${other}: ${meaning}`);
        }
      }
    }
    lines.push("");
  });
  const suits = cardCodes.map(getSuit);
  const uniqueSuitPairs = /* @__PURE__ */ new Set();
  for (let i = 0; i < suits.length; i++) {
    for (let j = i + 1; j < suits.length; j++) {
      uniqueSuitPairs.add(`${suits[i]}+${suits[j]}`);
    }
  }
  const suitInteractions = [];
  uniqueSuitPairs.forEach((pair) => {
    const [s1, s2] = pair.split("+");
    const interaction = getSuitInteraction(s1, s2);
    if (interaction) {
      suitInteractions.push(`${getSuitName(s1)} \u05E2\u05DD ${getSuitName(s2)}: ${interaction}`);
    }
  });
  if (suitInteractions.length > 0) {
    lines.push("=== \u05D9\u05D7\u05E1\u05D9 \u05D2\u05D5\u05DE\u05DC\u05D9\u05DF \u05D1\u05D9\u05DF \u05E1\u05D3\u05E8\u05D5\u05EA ===");
    suitInteractions.forEach((i) => lines.push(i));
    lines.push("");
  }
  const courtCards = entries.filter((e) => e.isCourtCard);
  if (courtCards.length > 1) {
    lines.push("=== \u05E7\u05DC\u05E4\u05D9 \u05D7\u05E6\u05E8 \u05D1\u05E7\u05D1\u05D5\u05E6\u05D4 ===");
    lines.push("\u05DB\u05D0\u05E9\u05E8 \u05E7\u05DC\u05E4\u05D9 \u05D7\u05E6\u05E8 \u05DE\u05D5\u05E4\u05D9\u05E2\u05D9\u05DD \u05D9\u05D7\u05D3 \u05D4\u05DD \u05DE\u05E6\u05D1\u05D9\u05E2\u05D9\u05DD \u05E2\u05DC \u05D0\u05D9\u05E0\u05D8\u05E8\u05D0\u05E7\u05E6\u05D9\u05D5\u05EA \u05D1\u05D9\u05DF \u05D0\u05E0\u05E9\u05D9\u05DD \u05D1\u05D7\u05D9\u05D9 \u05D4\u05E9\u05D5\u05D0\u05DC.");
    lines.push(COURT_CARDS_SUIT_PERSONALITY.hearts);
    lines.push(COURT_CARDS_SUIT_PERSONALITY.clubs);
    lines.push(COURT_CARDS_SUIT_PERSONALITY.diamonds);
    lines.push(COURT_CARDS_SUIT_PERSONALITY.spades);
    lines.push("");
  }
  const suitNames = {
    C: "\u05EA\u05DC\u05EA\u05DF \u2663 (\u05E2\u05E1\u05E7\u05D9\u05DD, \u05E2\u05D1\u05D5\u05D3\u05D4, \u05DB\u05E1\u05E3, \u05E4\u05E2\u05D9\u05DC\u05D5\u05EA)",
    D: "\u05D9\u05D4\u05DC\u05D5\u05DD \u2666 (\u05D0\u05E0\u05E8\u05D2\u05D9\u05D4, \u05DB\u05E1\u05E3, \u05EA\u05D2\u05DE\u05D5\u05DC\u05D9\u05DD, \u05D4\u05E6\u05DC\u05D7\u05D4)",
    H: "\u05DC\u05D1 \u2665 (\u05E8\u05D2\u05E9, \u05D0\u05D4\u05D1\u05D4, \u05E7\u05E9\u05E8\u05D9\u05DD, \u05E8\u05D9\u05E4\u05D5\u05D9)",
    S: "\u05E2\u05DC\u05D4 \u2660 (\u05D1\u05E2\u05D9\u05D5\u05EA, \u05D0\u05EA\u05D2\u05E8\u05D9\u05DD, \u05D7\u05E1\u05D9\u05DE\u05D5\u05EA, \u05D0\u05D5\u05D1\u05D3\u05DF)"
  };
  const suitDomains = {
    C: "\u05E2\u05E1\u05E7\u05D9\u05DD, \u05E2\u05D1\u05D5\u05D3\u05D4, \u05DB\u05E1\u05E3 \u05D5\u05E4\u05E2\u05D9\u05DC\u05D5\u05EA",
    D: "\u05DB\u05E1\u05E3, \u05D0\u05E0\u05E8\u05D2\u05D9\u05D4, \u05EA\u05D2\u05DE\u05D5\u05DC\u05D9\u05DD \u05D5\u05D4\u05E6\u05DC\u05D7\u05D4",
    H: "\u05E8\u05D2\u05E9, \u05D0\u05D4\u05D1\u05D4, \u05E7\u05E9\u05E8\u05D9\u05DD \u05D5\u05DE\u05E9\u05E4\u05D7\u05D4",
    S: "\u05D1\u05E2\u05D9\u05D5\u05EA, \u05D0\u05EA\u05D2\u05E8\u05D9\u05DD, \u05D7\u05E1\u05D9\u05DE\u05D5\u05EA \u05D5\u05D0\u05D5\u05D1\u05D3\u05DF"
  };
  const normalizedSuits = cardCodes.map((c) => c.slice(-1));
  for (let idx = 0; idx < normalizedSuits.length - 1; idx++) {
    if (normalizedSuits[idx] === normalizedSuits[idx + 1]) {
      const suit = normalizedSuits[idx];
      const domain = suitDomains[suit];
      const suitLabel = suitNames[suit];
      if (domain) {
        const pos = idx === 0 ? "\u05E9\u05D5\u05E8\u05E9 \u05D5\u05DC\u05D1" : "\u05DC\u05D1 \u05D5\u05DB\u05D9\u05D5\u05D5\u05DF";
        lines.push("=== \u05DB\u05DC\u05DC: \u05E9\u05E0\u05D9 \u05E7\u05DC\u05E4\u05D9\u05DD \u05E1\u05DE\u05D5\u05DB\u05D9\u05DD \u05DE\u05D0\u05D5\u05EA\u05D4 \u05E1\u05D3\u05E8\u05D4 ===");
        lines.push(`\u05E9\u05E0\u05D9 \u05D4\u05E7\u05DC\u05E4\u05D9\u05DD \u05D1\u05DE\u05D9\u05E7\u05D5\u05DD ${pos} \u05D4\u05DD \u05DE\u05E1\u05D3\u05E8\u05EA ${suitLabel}.`);
        lines.push(`\u05DB\u05DC\u05DC: \u05DB\u05D0\u05E9\u05E8 \u05E9\u05E0\u05D9 \u05E7\u05DC\u05E4\u05D9\u05DD \u05E1\u05DE\u05D5\u05DB\u05D9\u05DD \u05D7\u05D5\u05DC\u05E7\u05D9\u05DD \u05D0\u05D5\u05EA\u05D4 \u05E1\u05D3\u05E8\u05D4, \u05D4\u05E1\u05D3\u05E8\u05D4 \u05D4\u05D6\u05D5 \u05E7\u05D5\u05D1\u05E2\u05EA \u05D0\u05EA \u05EA\u05D7\u05D5\u05DD \u05D4\u05E4\u05E8\u05D9\u05E1\u05D4 \u2014 ${domain}.`);
        lines.push("\u05D7\u05E9\u05D5\u05D1: \u05DB\u05DC\u05DC \u05D6\u05D4 \u05E4\u05D5\u05E2\u05DC \u05D1\u05E8\u05DE\u05EA \u05D4\u05E1\u05D3\u05E8\u05D4, \u05DC\u05DC\u05D0 \u05E7\u05E9\u05E8 \u05DC\u05DE\u05E9\u05DE\u05E2\u05D5\u05EA \u05D4\u05D1\u05D5\u05D3\u05D3\u05EA \u05E9\u05DC \u05DB\u05DC \u05E7\u05DC\u05E3.");
        lines.push("");
      }
    }
  }
  return lines.join("\n");
}
export {
  buildKnowledgeContext
};
