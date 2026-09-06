import { runThreeCardEngine } from "./three-card-engine.js";
import { buildThreeCardReading } from "./spreads/three-card/pipeline.js";
import { analyzePriority } from "./master-priority-engine.js";
import { detectQuestionFocus } from "./question-focus-engine.js";
import {
  analyzeColorBalance,
  analyzeNumberPattern,
  buildThemes,
  buildWarnings,
  detectSpecialCombinations,
  getSuitInteraction
} from "./combination-engine.js";
import { analyzeQuestionRoles } from "./question-role-engine.js";
import { buildBookRuleSummary } from "./book-rules-engine.js";
import {
  buildSimpleTiming,
  collectPeople,
  getCardKeywords
} from "./card-knowledge.js";
function normalizeTopic(topic) {
  if (topic === "love") return "love";
  if (topic === "work") return "work";
  if (topic === "money") return "money";
  return "general";
}
function normalizeLegacyQuestionMode(mode) {
  if (mode === "yesno") return "yesno";
  if (mode === "state" || mode === "feeling" || mode === "outcome" || mode === "relationship") {
    return "decision";
  }
  return "general";
}
function buildThemeList(cards, topic) {
  const baseThemes = buildThemes(cards, topic);
  const keywordThemes = cards.flatMap((card) => getCardKeywords(card));
  return Array.from(/* @__PURE__ */ new Set([...baseThemes, ...keywordThemes])).slice(0, 12);
}
function buildNarrativeSignals(shortInterpretation, outcomeLine, professionalSummary) {
  return [shortInterpretation, outcomeLine, professionalSummary].filter(
    (value) => typeof value === "string" && value.trim().length > 0
  );
}
function buildStory(shortInterpretation, outcomeLine, professionalSummary) {
  return buildNarrativeSignals(
    shortInterpretation,
    outcomeLine,
    professionalSummary
  ).join(" ");
}
function buildSummary(shortAnswer, shortInterpretation, outcomeLine, professionalSummary) {
  return [shortAnswer, shortInterpretation, outcomeLine, professionalSummary].filter(Boolean).join("\n\n");
}
function buildSpreadStructure() {
  return [
    "\u05E7\u05DC\u05E3 1 \u2013 \u05E9\u05D5\u05E8\u05E9 \u05D4\u05DE\u05E6\u05D1",
    "\u05E7\u05DC\u05E3 2 \u2013 \u05DC\u05D1 \u05D4\u05E2\u05E0\u05D9\u05D9\u05DF",
    "\u05E7\u05DC\u05E3 3 \u2013 \u05DB\u05D9\u05D5\u05D5\u05DF \u05D4\u05D4\u05EA\u05E4\u05EA\u05D7\u05D5\u05EA"
  ];
}
function cardKey(card) {
  const suit = card.suit.key === "hearts" ? "H" : card.suit.key === "diamonds" ? "D" : card.suit.key === "clubs" ? "C" : "S";
  return `${card.rank.key}${suit}`;
}
function shortMeaning(card) {
  const id = cardKey(card);
  const meanings = {
    AS: "\u05D7\u05D9\u05EA\u05D5\u05DA, \u05DE\u05E9\u05D1\u05E8 \u05D0\u05D5 \u05D4\u05DB\u05E8\u05E2\u05D4 \u05D7\u05D3\u05D4",
    "2S": "\u05E8\u05D9\u05D7\u05D5\u05E7, \u05E7\u05D5\u05E0\u05E4\u05DC\u05D9\u05E7\u05D8 \u05D0\u05D5 \u05E4\u05E8\u05D9\u05D3\u05D4",
    "3S": "\u05D1\u05DC\u05D1\u05D5\u05DC, \u05D4\u05EA\u05E2\u05E8\u05D1\u05D5\u05EA \u05D0\u05D5 \u05E7\u05D5\u05E9\u05D9 \u05E9\u05DE\u05D7\u05DE\u05D9\u05E8",
    "4S": "\u05E2\u05E6\u05D9\u05E8\u05D4, \u05D7\u05D5\u05DC\u05E9\u05D4 \u05D0\u05D5 \u05E6\u05D5\u05E8\u05DA \u05D1\u05D4\u05EA\u05D0\u05D5\u05E9\u05E9\u05D5\u05EA",
    "5S": "\u05DB\u05D0\u05D1, \u05DB\u05E2\u05E1 \u05D0\u05D5 \u05E0\u05D9\u05EA\u05D5\u05E7 \u05D7\u05D3",
    "6S": "\u05E9\u05D7\u05E8\u05D5\u05E8, \u05E1\u05D9\u05D5\u05DD \u05E9\u05DC \u05E9\u05DC\u05D1 \u05D0\u05D5 \u05DE\u05E2\u05D1\u05E8 \u05D4\u05DC\u05D0\u05D4",
    "7S": "\u05E2\u05D9\u05DB\u05D5\u05D1, \u05EA\u05E1\u05DB\u05D5\u05DC \u05D0\u05D5 \u05E0\u05E1\u05D9\u05D2\u05D4",
    "8S": "\u05DE\u05D2\u05D1\u05DC\u05D4, \u05DC\u05D7\u05E5 \u05D0\u05D5 \u05E6\u05D5\u05E8\u05DA \u05D1\u05D1\u05D3\u05D9\u05E7\u05D4",
    "9S": "\u05D3\u05D0\u05D2\u05D4, \u05E6\u05E2\u05E8 \u05D0\u05D5 \u05E2\u05D5\u05DE\u05E1 \u05E8\u05D2\u05E9\u05D9",
    "10S": "\u05E7\u05E8\u05D9\u05E1\u05D4, \u05E4\u05D7\u05D3 \u05D0\u05D5 \u05E1\u05D5\u05E3 \u05E7\u05E9\u05D4",
    AH: "\u05E4\u05EA\u05D9\u05D7\u05EA \u05DC\u05D1, \u05D1\u05D9\u05EA \u05D0\u05D5 \u05D4\u05EA\u05D7\u05DC\u05D4 \u05E8\u05D2\u05E9\u05D9\u05EA \u05D7\u05D3\u05E9\u05D4",
    "2H": "\u05E7\u05E8\u05D1\u05D4, \u05D7\u05D9\u05D1\u05D4 \u05D0\u05D5 \u05D7\u05D9\u05D1\u05D5\u05E8 \u05D1\u05D9\u05DF \u05E9\u05E0\u05D9\u05D9\u05DD",
    "3H": "\u05E9\u05DE\u05D7\u05D4, \u05D4\u05EA\u05E4\u05EA\u05D7\u05D5\u05EA \u05E8\u05D2\u05E9\u05D9\u05EA \u05D0\u05D5 \u05D7\u05D2\u05D9\u05D2\u05D4",
    "4H": "\u05E7\u05E9\u05E8 \u05D6\u05D5\u05D2\u05D9, \u05E7\u05E8\u05D1\u05D4 \u05D5\u05D1\u05D9\u05D8\u05D7\u05D5\u05DF \u05E8\u05D2\u05E9\u05D9",
    "5H": "\u05DE\u05E9\u05D9\u05DB\u05D4, \u05D4\u05D6\u05D3\u05DE\u05E0\u05D5\u05EA \u05E8\u05D2\u05E9\u05D9\u05EA \u05D0\u05D5 \u05D4\u05EA\u05DC\u05D4\u05D1\u05D5\u05EA",
    "6H": "\u05D7\u05D9\u05D1\u05D5\u05E8 \u05E8\u05D2\u05E9\u05D9 \u05E2\u05DE\u05D5\u05E7, \u05D0\u05D4\u05D1\u05D4 \u05D0\u05D5 \u05D1\u05DF \u05D6\u05D5\u05D2 \u05DE\u05E9\u05DE\u05E2\u05D5\u05EA\u05D9",
    "7H": "\u05E9\u05D9\u05E4\u05D5\u05E8, \u05E8\u05D9\u05E4\u05D5\u05D9 \u05D0\u05D5 \u05D4\u05D6\u05D3\u05DE\u05E0\u05D5\u05EA \u05E9\u05E0\u05D9\u05D9\u05D4",
    "8H": "\u05E7\u05E9\u05E8 \u05E7\u05D9\u05D9\u05DD, \u05D4\u05D3\u05D3\u05D9\u05D5\u05EA \u05D5\u05E8\u05D2\u05E9 \u05DE\u05D0\u05D5\u05D6\u05DF",
    "9H": "\u05DE\u05E9\u05D0\u05DC\u05D4, \u05E1\u05D9\u05E4\u05D5\u05E7 \u05D0\u05D5 \u05D4\u05D2\u05E9\u05DE\u05D4 \u05E8\u05D2\u05E9\u05D9\u05EA",
    "10H": "\u05D0\u05D5\u05E9\u05E8, \u05DE\u05D7\u05D5\u05D9\u05D1\u05D5\u05EA \u05D0\u05D5 \u05E9\u05D9\u05D0 \u05E8\u05D2\u05E9\u05D9",
    AD: "\u05DE\u05E1\u05E8 \u05D7\u05E9\u05D5\u05D1, \u05DE\u05E1\u05DE\u05DA \u05D0\u05D5 \u05D4\u05EA\u05D7\u05DC\u05D4 \u05DE\u05E2\u05E9\u05D9\u05EA",
    "2D": "\u05EA\u05DB\u05EA\u05D5\u05D1\u05EA, \u05DE\u05D9\u05D3\u05E2 \u05D0\u05D5 \u05E2\u05E0\u05D9\u05D9\u05DF \u05DB\u05E1\u05E4\u05D9 \u05E7\u05D8\u05DF",
    "3D": "\u05E6\u05DE\u05D9\u05D7\u05D4, \u05E8\u05D5\u05D5\u05D7 \u05D0\u05D5 \u05D4\u05EA\u05E7\u05D3\u05DE\u05D5\u05EA \u05D7\u05D5\u05DE\u05E8\u05D9\u05EA",
    "4D": "\u05D9\u05E6\u05D9\u05D1\u05D5\u05EA \u05DB\u05E1\u05E4\u05D9\u05EA, \u05D1\u05E1\u05D9\u05E1 \u05D0\u05D5 \u05DE\u05E1\u05D2\u05E8\u05EA \u05D1\u05D8\u05D5\u05D7\u05D4",
    "5D": "\u05E9\u05D9\u05E7\u05D5\u05DC \u05D7\u05D5\u05DE\u05E8\u05D9, \u05D0\u05D7\u05D9\u05D6\u05D4 \u05D0\u05D5 \u05D3\u05E4\u05D5\u05E1 \u05D7\u05D5\u05D6\u05E8",
    "6D": "\u05E9\u05D9\u05D7\u05D4, \u05EA\u05E9\u05D5\u05D1\u05D4 \u05D0\u05D5 \u05D4\u05EA\u05E7\u05D3\u05DE\u05D5\u05EA \u05D3\u05E8\u05DA \u05DE\u05E1\u05E8",
    "7D": "\u05E9\u05D9\u05E4\u05D5\u05E8 \u05DB\u05E1\u05E4\u05D9, \u05D4\u05D9\u05E9\u05D2 \u05D0\u05D5 \u05D4\u05DB\u05E8\u05D4",
    "8D": "\u05D0\u05D9\u05D6\u05D5\u05DF, \u05E0\u05D9\u05D4\u05D5\u05DC \u05E0\u05DB\u05D5\u05DF \u05D0\u05D5 \u05EA\u05DB\u05E0\u05D5\u05DF \u05DB\u05DC\u05DB\u05DC\u05D9",
    "9D": "\u05DB\u05E1\u05E3, \u05EA\u05E9\u05D5\u05DE\u05EA \u05DC\u05D1 \u05D0\u05D5 \u05D4\u05E9\u05E4\u05E2\u05D4 \u05D7\u05D9\u05E6\u05D5\u05E0\u05D9\u05EA",
    "10D": "\u05D1\u05D9\u05D8\u05D7\u05D5\u05DF \u05D7\u05D5\u05DE\u05E8\u05D9, \u05D4\u05E6\u05DC\u05D7\u05D4 \u05D0\u05D5 \u05E9\u05E4\u05E2",
    AC: "\u05D9\u05D5\u05D6\u05DE\u05D4 \u05D7\u05D3\u05E9\u05D4, \u05D7\u05D5\u05D6\u05D4 \u05D0\u05D5 \u05D4\u05EA\u05D7\u05DC\u05D4 \u05DE\u05E2\u05E9\u05D9\u05EA",
    "2C": "\u05E7\u05E9\u05E8, \u05D4\u05D6\u05DE\u05E0\u05D4 \u05D0\u05D5 \u05E9\u05D9\u05EA\u05D5\u05E3 \u05E4\u05E2\u05D5\u05DC\u05D4",
    "3C": "\u05E6\u05DE\u05D9\u05D7\u05D4 \u05DE\u05E2\u05E9\u05D9\u05EA, \u05D1\u05E0\u05D9\u05D9\u05D4 \u05D0\u05D5 \u05D4\u05EA\u05E4\u05EA\u05D7\u05D5\u05EA",
    "4C": "\u05DE\u05E1\u05D2\u05E8\u05EA \u05E7\u05D1\u05D5\u05E2\u05D4, \u05E2\u05D1\u05D5\u05D3\u05D4 \u05D0\u05D5 \u05E1\u05D9\u05D3\u05D5\u05E8 \u05D9\u05E6\u05D9\u05D1",
    "5C": "\u05E2\u05E9\u05D9\u05D9\u05D4, \u05D9\u05D5\u05D6\u05DE\u05D4 \u05D0\u05D5 \u05D3\u05D7\u05D9\u05E4\u05D4 \u05E7\u05D3\u05D9\u05DE\u05D4",
    "6C": "\u05E4\u05EA\u05E8\u05D5\u05DF, \u05EA\u05E0\u05D5\u05E2\u05D4 \u05D0\u05D5 \u05D4\u05EA\u05E7\u05D3\u05DE\u05D5\u05EA \u05D3\u05E8\u05DA \u05E9\u05D9\u05D7\u05D4",
    "7C": "\u05DE\u05D0\u05DE\u05E5, \u05E2\u05D5\u05DE\u05E1 \u05D0\u05D5 \u05E2\u05D1\u05D5\u05D3\u05D4 \u05DE\u05E8\u05D5\u05D1\u05D4",
    "8C": "\u05E9\u05D2\u05E8\u05D4, \u05E4\u05D2\u05D9\u05E9\u05D5\u05EA \u05D0\u05D5 \u05E2\u05D9\u05E1\u05D5\u05E7 \u05E7\u05D1\u05D5\u05E2",
    "9C": "\u05D4\u05D6\u05D3\u05DE\u05E0\u05D5\u05EA, \u05D4\u05EA\u05E7\u05D3\u05DE\u05D5\u05EA \u05E2\u05E1\u05E7\u05D9\u05EA \u05D0\u05D5 \u05E6\u05E2\u05D3 \u05D7\u05E9\u05D5\u05D1",
    "10C": "\u05E9\u05D0\u05E4\u05EA\u05E0\u05D5\u05EA, \u05E7\u05E8\u05D9\u05D9\u05E8\u05D4 \u05D0\u05D5 \u05E6\u05E2\u05D3 \u05D2\u05D3\u05D5\u05DC \u05D1\u05E2\u05D1\u05D5\u05D3\u05D4",
    JH: "\u05E8\u05D2\u05E9 \u05E6\u05E2\u05D9\u05E8 \u05D0\u05D5 \u05DE\u05E1\u05E8 \u05E8\u05D2\u05E9\u05D9",
    QH: "\u05D0\u05D9\u05E9\u05D4 \u05EA\u05D5\u05DE\u05DB\u05EA, \u05D7\u05DE\u05D4 \u05D0\u05D5 \u05D3\u05DE\u05D5\u05EA \u05DE\u05D9\u05D8\u05D9\u05D1\u05D4",
    KH: "\u05D2\u05D1\u05E8 \u05D0\u05D5\u05D4\u05D1, \u05DE\u05D2\u05D5\u05E0\u05DF \u05D0\u05D5 \u05D1\u05E2\u05DC \u05E0\u05D5\u05DB\u05D7\u05D5\u05EA \u05E8\u05D2\u05E9\u05D9\u05EA",
    JD: "\u05E6\u05E2\u05D9\u05E8 \u05D7\u05DB\u05DD \u05D0\u05D5 \u05DE\u05E1\u05E8 \u05DE\u05E2\u05E9\u05D9",
    QD: "\u05D0\u05D9\u05E9\u05D4 \u05DE\u05E2\u05E9\u05D9\u05EA, \u05D7\u05DB\u05DE\u05D4 \u05D0\u05D5 \u05D1\u05E2\u05DC\u05EA \u05EA\u05D5\u05E9\u05D9\u05D9\u05D4",
    KD: "\u05D2\u05D1\u05E8 \u05DE\u05E2\u05E9\u05D9, \u05D1\u05D8\u05D5\u05D7 \u05D0\u05D5 \u05D1\u05E2\u05DC \u05E1\u05DE\u05DB\u05D5\u05EA \u05D7\u05D5\u05DE\u05E8\u05D9\u05EA",
    JC: "\u05D0\u05D3\u05DD \u05E6\u05E2\u05D9\u05E8 \u05E4\u05E2\u05D9\u05DC \u05D0\u05D5 \u05E9\u05DC\u05D9\u05D7 \u05E9\u05DC \u05E2\u05E9\u05D9\u05D9\u05D4",
    QC: "\u05D0\u05D9\u05E9\u05D4 \u05DE\u05E2\u05E9\u05D9\u05EA, \u05D0\u05DE\u05D9\u05E0\u05D4 \u05D0\u05D5 \u05DE\u05D5\u05E2\u05D9\u05DC\u05D4",
    KC: "\u05D2\u05D1\u05E8 \u05DE\u05E2\u05E9\u05D9, \u05DE\u05E0\u05D4\u05D9\u05D2\u05D5\u05EA\u05D9 \u05D0\u05D5 \u05D1\u05E2\u05DC \u05E0\u05D9\u05E1\u05D9\u05D5\u05DF",
    JS: "\u05D0\u05D3\u05DD \u05E6\u05E2\u05D9\u05E8 \u05D7\u05D3 \u05D0\u05D5 \u05DC\u05D0 \u05D9\u05E6\u05D9\u05D1",
    QS: "\u05D0\u05D9\u05E9\u05D4 \u05DE\u05D7\u05D5\u05E9\u05D1\u05EA \u05D0\u05D5 \u05DE\u05D0\u05EA\u05D2\u05E8\u05EA",
    KS: "\u05D2\u05D1\u05E8 \u05E1\u05DE\u05DB\u05D5\u05EA\u05D9, \u05E7\u05E9\u05D4 \u05D0\u05D5 \u05EA\u05D5\u05D1\u05E2\u05E0\u05D9"
  };
  return meanings[id] || `${card.rank.heb} ${card.suit.heb}`;
}
function buildReadablePositionText(position, card, topic) {
  const meaning = shortMeaning(card);
  if (position === "root") {
    return `\u05E9\u05D5\u05E8\u05E9 \u05D4\u05DE\u05E6\u05D1 \u05DE\u05E8\u05D0\u05D4 ${meaning}.`;
  }
  if (position === "heart") {
    return `\u05D1\u05DC\u05D1 \u05D4\u05E2\u05E0\u05D9\u05D9\u05DF \u05E4\u05D5\u05E2\u05DC\u05D9\u05DD ${meaning}.`;
  }
  if (topic === "love") {
    return `\u05DB\u05D9\u05D5\u05D5\u05DF \u05D4\u05D4\u05EA\u05E4\u05EA\u05D7\u05D5\u05EA \u05DE\u05E8\u05D0\u05D4 \u05E9\u05D4\u05E7\u05E9\u05E8 \u05E0\u05DE\u05E9\u05DA \u05D0\u05DC ${meaning}.`;
  }
  return `\u05DB\u05D9\u05D5\u05D5\u05DF \u05D4\u05D4\u05EA\u05E4\u05EA\u05D7\u05D5\u05EA \u05DE\u05E8\u05D0\u05D4 \u05E9\u05D4\u05DE\u05E6\u05D1 \u05E0\u05DE\u05E9\u05DA \u05D0\u05DC ${meaning}.`;
}
function buildOutcomeLine(topic, directionCard) {
  const meaning = shortMeaning(directionCard);
  if (topic === "love") {
    return `\u05DC\u05D0\u05DF \u05D6\u05D4 \u05D4\u05D5\u05DC\u05DA: \u05D4\u05E7\u05E9\u05E8 \u05E0\u05DE\u05E9\u05DA \u05D0\u05DC ${meaning}.`;
  }
  return `\u05DC\u05D0\u05DF \u05D6\u05D4 \u05D4\u05D5\u05DC\u05DA: \u05D4\u05DB\u05D9\u05D5\u05D5\u05DF \u05E0\u05DE\u05E9\u05DA \u05D0\u05DC ${meaning}.`;
}
function interpretThreeCards(rootCard, heartCard, directionCard, question, _querentProfile) {
  const cards = [rootCard, heartCard, directionCard];
  const roles = analyzeQuestionRoles(question);
  const topic = normalizeTopic(roles.topic);
  const engine = runThreeCardEngine(
    question,
    rootCard,
    heartCard,
    directionCard
  );
  const pipeline = buildThreeCardReading(
    rootCard,
    heartCard,
    directionCard,
    question
  );
  const colorBalance = analyzeColorBalance(cards);
  const numberPattern = analyzeNumberPattern(cards);
  const root = buildReadablePositionText("root", rootCard, topic);
  const heart = buildReadablePositionText("heart", heartCard, topic);
  const direction = buildReadablePositionText("direction", directionCard, topic);
  const interactionRootHeart = getSuitInteraction(rootCard, heartCard);
  const interactionHeartDirection = getSuitInteraction(
    heartCard,
    directionCard
  );
  const interactionRootDirection = getSuitInteraction(rootCard, directionCard);
  const combinations = detectSpecialCombinations(cards);
  const warnings = buildWarnings(cards);
  const themes = buildThemeList(cards, topic);
  const people = collectPeople(cards);
  const timing = buildSimpleTiming(cards);
  const priority = analyzePriority(cards);
  const questionFocus = detectQuestionFocus(
    question,
    rootCard,
    heartCard,
    directionCard
  );
  const shortAnswer = pipeline.finalConclusion.trim();
  const shortInterpretation = [root, heart].filter(Boolean).join(" ");
  const outcomeLine = buildOutcomeLine(topic, directionCard);
  const professionalSummary = [
    ...pipeline.processLines,
    "",
    pipeline.finalConclusion
  ].join("\n");
  const story = buildStory(
    shortInterpretation,
    outcomeLine,
    professionalSummary
  );
  const narrativeSignals = buildNarrativeSignals(
    shortInterpretation,
    outcomeLine,
    professionalSummary
  );
  const summary = pipeline.finalConclusion;
  return {
    questionType: roles.questionType,
    answer: pipeline.finalConclusion,
    root,
    heart,
    direction,
    interactionRootHeart,
    interactionHeartDirection,
    interactionRootDirection,
    dominantSuit: engine.dominantSuit,
    colorBalance,
    numberPattern,
    combinations,
    people,
    themes,
    timing,
    warnings,
    story,
    narrativeSignals,
    bookRules: [],
    bookRuleSummary: buildBookRuleSummary(cards),
    summary,
    professional: {
      shortAnswer: pipeline.finalConclusion,
      shortInterpretation,
      outcomeLine,
      professionalSummary: `\u05E9\u05D5\u05E8\u05E9: ${shortMeaning(rootCard)}
\u05DC\u05D1: ${shortMeaning(heartCard)}
\u05DB\u05D9\u05D5\u05D5\u05DF: ${shortMeaning(directionCard)}

${pipeline.finalConclusion}`
    },
    priority,
    questionFocus,
    questionMode: normalizeLegacyQuestionMode(engine.questionMode),
    spreadStructure: buildSpreadStructure()
  };
}
function interpretThreeCardSpread(question, root, heart, direction, querentProfile) {
  return interpretThreeCards(root, heart, direction, question, querentProfile);
}
export {
  interpretThreeCardSpread,
  interpretThreeCards
};
