import { getSuitInteraction as getSuitInteractionFromBook } from "../../knowledge/suits.js";
import {
  getCardProfile,
  getColorBalance
} from "./knowledge.js";
function buildSuitInteraction(root, heart, direction) {
  const s1 = getSuitInteractionFromBook(root.suit.key, heart.suit.key);
  const s2 = getSuitInteractionFromBook(heart.suit.key, direction.suit.key);
  const parts = [s1, s2].filter(Boolean);
  return [...new Set(parts)].join(" | ");
}
function detectTopic(question) {
  const q = question.trim();
  if (/אהבה|זוגיות|קשר|רגש|בן זוג|בת זוג|יחסים|פרידה|גירושין/.test(q)) {
    return "love";
  }
  if (/עבודה|משרה|קריירה|קבלה|ראיון|תפקיד|פרנסה/.test(q)) {
    return "work";
  }
  if (/כסף|הכנסה|רווח|תשלום|משכורת|חוב/.test(q)) {
    return "money";
  }
  return "general";
}
function detectQuestionMode(question) {
  const q = question.trim();
  if (/^האם|^אם /.test(q) || q.endsWith("?")) return "yesno";
  if (/זוגיות|בינינו|ביניהם|מה מצב|מה היחסים|בין .+ ל/.test(q)) {
    return "relationship";
  }
  if (/לאן|מה יהיה|מה יקרה|עתיד/.test(q)) return "outcome";
  if (/מרגיש|חושב|רוצה/.test(q)) return "state";
  return "general";
}
function lane(profile) {
  if (profile.isSupportive) return "support";
  if (profile.isBlocking) return "block";
  return "neutral";
}
function buildProgressionNature(rootProfile, heartProfile, directionProfile) {
  const key = `${lane(rootProfile)}_${lane(heartProfile)}_${lane(
    directionProfile
  )}`;
  const map = {
    support_support_support: "support_to_support_to_support",
    support_support_block: "support_to_support_to_block",
    support_block_support: "support_to_block_to_support",
    support_block_block: "support_to_block_to_block",
    block_support_support: "block_to_support_to_support",
    block_support_block: "block_to_support_to_block",
    block_block_support: "block_to_block_to_support",
    block_block_block: "block_to_block_to_block"
  };
  return map[key] ?? "neutral_flow";
}
function detectYesNoBalanceSignal(questionMode, colorBalance) {
  if (questionMode !== "yesno") return "no_bias";
  if (colorBalance === "positive") return "positive_bias";
  if (colorBalance === "negative") return "negative_bias";
  return "no_bias";
}
function detectFinalCardWeight(directionProfile) {
  if (directionProfile.isSupportive) return "supportive_outcome";
  if (directionProfile.isBlocking) return "blocked_outcome";
  return "neutral_outcome";
}
function analyzeSpread(root, heart, direction, question) {
  const topic = detectTopic(question);
  const questionMode = detectQuestionMode(question);
  const rootProfile = getCardProfile(root, topic, "root");
  const heartProfile = getCardProfile(heart, topic, "heart");
  const directionProfile = getCardProfile(direction, topic, "direction");
  const colorBalance = getColorBalance([root, heart, direction]);
  const redCount = [root, heart, direction].filter((c) => c.color === "red").length;
  const blackCount = [root, heart, direction].filter((c) => c.color === "black").length;
  const hasPersonInRoot = rootProfile.isCourt;
  const hasPersonInDirection = directionProfile.isCourt;
  const hasTwoPersons = hasPersonInRoot && hasPersonInDirection;
  const personCount = (rootProfile.isCourt ? 1 : 0) + (heartProfile.isCourt ? 1 : 0) + (directionProfile.isCourt ? 1 : 0);
  const centerIsSharpBlock = heartProfile.nature === "sharp_block";
  const centerIsBlocking = heartProfile.isBlocking;
  const centerIsMessage = heartProfile.isMessageCard;
  const centerIsSupportive = heartProfile.isSupportive;
  const centerIsPerson = heartProfile.isCourt;
  const rootIsSupportive = rootProfile.isSupportive;
  const rootIsBlocking = rootProfile.isBlocking;
  const rootIsPractical = rootProfile.isPracticalCard;
  const rootIsPerson = rootProfile.isCourt;
  const directionIsSupportivePerson = directionProfile.nature === "supportive_person";
  const directionIsNegative = directionProfile.isBlocking;
  const directionIsSupportive = directionProfile.isSupportive;
  const directionIsPerson = directionProfile.isCourt;
  const directionPersonGender = directionProfile.personGender;
  const finalCardWeight = detectFinalCardWeight(directionProfile);
  const progressionNature = buildProgressionNature(
    rootProfile,
    heartProfile,
    directionProfile
  );
  const supportiveStart = rootProfile.isSupportive;
  const blockedStart = rootProfile.isBlocking;
  const supportiveCenter = heartProfile.isSupportive;
  const blockedCenter = heartProfile.isBlocking;
  const supportiveEnd = directionProfile.isSupportive;
  const blockedEnd = directionProfile.isBlocking;
  const hasPersonOnEitherSide = hasPersonInRoot || hasPersonInDirection;
  const sharpCenterWithPerson = centerIsSharpBlock && hasPersonOnEitherSide;
  const twoPeopleAroundBlockedCenter = hasTwoPersons && blockedCenter;
  const twoPeopleAroundSupportiveCenter = hasTwoPersons && supportiveCenter;
  const blockedCenterBetweenTwoPeople = hasTwoPersons && centerIsBlocking;
  const supportivePersonInOutcome = directionIsSupportivePerson;
  const humanInfluenceOnOutcome = directionIsPerson;
  const femaleInfluenceOnOutcome = directionIsPerson && directionPersonGender === "female";
  const maleInfluenceOnOutcome = directionIsPerson && directionPersonGender === "male";
  const messageLeadsToSupportiveOutcome = centerIsMessage && finalCardWeight === "supportive_outcome";
  const practicalStartLeadsToMessage = rootIsPractical && centerIsMessage;
  const practicalStartLeadsToSupportiveOutcome = rootIsPractical && supportiveEnd;
  const supportiveStartSupportiveEnd = supportiveStart && supportiveEnd;
  const blockedCenterButRecoveredOutcome = blockedCenter && supportiveEnd;
  const fullyBlockedFlow = progressionNature === "block_to_block_to_block";
  const recoveryFlow = progressionNature === "block_to_support_to_support" || progressionNature === "support_to_block_to_support";
  const centerBlocksRelationship = questionMode === "relationship" && hasTwoPersons && centerIsBlocking;
  const centerSupportsRelationship = questionMode === "relationship" && hasTwoPersons && (centerIsSupportive || centerIsMessage);
  const suitInteraction = buildSuitInteraction(root, heart, direction);
  return {
    topic,
    questionMode,
    rootProfile,
    heartProfile,
    directionProfile,
    colorBalance,
    redCount,
    blackCount,
    yesNoBalanceSignal: detectYesNoBalanceSignal(questionMode, colorBalance),
    hasTwoPersons,
    hasPersonInRoot,
    hasPersonInDirection,
    personCount,
    centerIsSharpBlock,
    centerIsBlocking,
    centerIsMessage,
    centerIsSupportive,
    centerIsPerson,
    rootIsSupportive,
    rootIsBlocking,
    rootIsPractical,
    rootIsPerson,
    directionIsSupportivePerson,
    directionIsNegative,
    directionIsSupportive,
    directionIsPerson,
    directionPersonGender,
    finalCardWeight,
    progressionNature,
    supportiveStart,
    blockedStart,
    supportiveCenter,
    blockedCenter,
    supportiveEnd,
    blockedEnd,
    hasPersonOnEitherSide,
    sharpCenterWithPerson,
    twoPeopleAroundBlockedCenter,
    twoPeopleAroundSupportiveCenter,
    blockedCenterBetweenTwoPeople,
    supportivePersonInOutcome,
    humanInfluenceOnOutcome,
    femaleInfluenceOnOutcome,
    maleInfluenceOnOutcome,
    messageLeadsToSupportiveOutcome,
    practicalStartLeadsToMessage,
    practicalStartLeadsToSupportiveOutcome,
    supportiveStartSupportiveEnd,
    blockedCenterButRecoveredOutcome,
    fullyBlockedFlow,
    recoveryFlow,
    centerBlocksRelationship,
    centerSupportsRelationship,
    suitInteraction
  };
}
export {
  analyzeSpread
};
